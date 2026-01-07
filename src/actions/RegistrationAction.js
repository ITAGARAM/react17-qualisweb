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
    constructjsonOptionDefault, childComboLoad, filterRecordBasedOnPrimaryKeyName, reArrangeArrays, childComboLoadForEdit, sortDataByParent, sortDataForDate,
    convertDateTimetoStringDBFormat
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
const { checkTree, loadTree } = QbUtils;

export function getSampleTypeChange(Map, masterData, event, labelname) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("/registration/getRegTypeBySampleType", Map)
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
                } else if (error.response?.status === 401 || error.response?.status === 403) {
                    dispatch({
                        type: UN_AUTHORIZED_ACCESS,
                        payload: {
                            navigation: 'forbiddenaccess',
                            loading: false,
                            responseStatus: error.response.status
                        }
                    });
                } else if (error.response?.status === 500) {
                    toast.error(error.message);
                } else {
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
                userinfo: inputData.userinfo,
                npreregno: inputData.npreregno ? inputData.npreregno : -1
            }
            let url = null
            switch (inputData.activeSubSampleTab) {
                case "IDS_SUBSAMPLEATTACHMENTS":
                    url = "attachment/getSubSampleAttachment"
                    break;
                case "IDS_SUBSAMPLECOMMENTS":
                    url = "comments/getSubSampleComment"
                    break;
                case "IDS_OUTSOURCEDETAILS":
                    url = "registration/getOutsourceDetails"
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
                                    selectedSubSample: inputData.selectedSubSample,
                                    // selectedTestCode: inputData.ntransactiontestcode,
                                },
                                loading: false,
                                showFilter: false,
                                activeSubSampleTab: inputData.activeSubSampleTab,
                                screenName: inputData.screenName,
                                activeTestTab: inputData.activeSubSampleTab,
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
                        } else if (error.response?.status === 500) {
                            toast.error(error.message);
                        } else {
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

            toast.warn(intl.formatMessage({ id: "IDS_PLSSELECTASAMPLE" }));
        }
    }
}

export function getRegTypeChange(Map, masterData, event, labelname) {
    return function (dispatch) {
        rsapi().post("/registration/getRegSubTypeByRegType", Map)
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
                } else if (error.response?.status === 401 || error.response?.status === 403) {
                    dispatch({
                        type: UN_AUTHORIZED_ACCESS,
                        payload: {
                            navigation: 'forbiddenaccess',
                            loading: false,
                            responseStatus: error.response.status
                        }
                    });
                } else if (error.response?.status === 500) {
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
        rsapi().post("/registration/getRegTemplateTypeByRegSubType", Map)

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
                } else if (error.response?.status === 401 || error.response?.status === 403) {
                    dispatch({
                        type: UN_AUTHORIZED_ACCESS,
                        payload: {
                            navigation: 'forbiddenaccess',
                            loading: false,
                            responseStatus: error.response.status
                        }
                    });
                } else if (error.response?.status === 500) {
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
        rsapi().post("/registration/getApprovalConfigBasedTemplateDesign", Map)

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
                } else if (error.response?.status === 401 || error.response?.status === 403) {
                    dispatch({
                        type: UN_AUTHORIZED_ACCESS,
                        payload: {
                            navigation: 'forbiddenaccess',
                            loading: false,
                            responseStatus: error.response.status
                        }
                    });
                } else if (error.response?.status === 500) {
                    toast.error(error.message);
                } else {
                    toast.warn(error.response.data);
                }
            })
    }
}

export function getComponentTestBySpec(Map, selectedRecord, masterData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("/registration/getComponentTestBySpec", Map)
            .then(response => {
                const { Component, Test } = response.data;
                let slno = Component.length > 0 ? Component[0].slno : -1;
                let selectedComponent = Component.length > 0 ? Component[0] : undefined
                let SelectedTest = [];
                if (Object.keys(Test).length > 0) {
                    SelectedTest = Test[slno];
                }
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        Component, Test, SelectedTest, selectedComponent, loading: false,
                        selectedRecord, popUptestDataState: { skip: 0, take: 10 }
                    }
                });

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
                } else if (error.response?.status === 500) {
                    toast.error(error.message);
                } else {
                    toast.warn(error.response.data);
                }
            })
    }
}

export function getTestfromDB(objComponent, LoginProps, nflag) {
    return function (dispatch) {
        dispatch(initRequest(true));
        let component = { ...objComponent };
        component["ncomponentcode"] = objComponent["ncomponentcode"] ? objComponent["ncomponentcode"].value : -1;
        component["nstoragelocationcode"] = objComponent["nstoragelocationcode"] ? objComponent["nstoragelocationcode"].value : -1;
        component["nstorageconditioncode"] = objComponent["nstorageconditioncode"] ? objComponent["nstorageconditioncode"].value : -1;
        component["slno"] = LoginProps.Component ? Object.keys(LoginProps.Component).length + 1 : 0;
        component["scomponentname"] = objComponent["ncomponentcode"].label;
        component["sstoragelocationname"] = objComponent["nstoragelocationcode"] && objComponent["nstoragelocationcode"].label ? objComponent["nstoragelocationcode"].label : "";
        component["sstorageconditionname"] = objComponent["nstorageconditioncode"] && objComponent["nstorageconditioncode"].label ? objComponent["nstorageconditioncode"].label : "";
        component["ntzdmanufdate"] = objComponent["ntzdmanufdate"] ? objComponent["ntzdmanufdate"].value : -1;
        component["ntzdreceivedate"] = objComponent["ntzdreceivedate"] ? objComponent["ntzdreceivedate"].value : -1;
        component["stzdreceivedate"] = objComponent["ntzdreceivedate"] ? objComponent["ntzdreceivedate"].label : "";
        component["nplasmafilecode"] = objComponent["nplasmafilecode"] ? objComponent["nplasmafilecode"].value : -1;
        component["splasmafilenumber"] = objComponent["nplasmafilecode"] ? objComponent["nplasmafilecode"].label : "";
        const dreceiveddate = objComponent["dreceiveddate"];
        component["dreceiveddate"] = dreceiveddate;//formatInputDate(objComponent["dreceiveddate"], false);
        component["sreceiveddate"] = convertDateTimetoString(dreceiveddate, LoginProps.userInfo);//formatInputDateWithoutT(objComponent["dreceiveddate"], false);//formatDate(objComponent["sreceiveddate"]);
        // rsapi().post("/registration/getTestfromDB", { "Component": component })
        rsapi().post("/registration/getTestfromDB", {
            nspecsampletypecode: component.nspecsampletypecode,
            slno: component.slno,
            nneedsubsample: LoginProps.masterData.RealRegSubTypeValue.nneedsubsample,
            //ALPD-5907
            userinfo: LoginProps.userInfo
        })
            .then(response => {
                let TestData = response.data;
                let slno = component.slno;
                let SelectedTest = [];
                let loadComponent = true;
                let selectComponent = {};
                let showSaveContinue = true;
                let SelectedSource = [];
                // let openChildModal = true;
                let selectedComponent = undefined;
                let parentPopUpSize = "lg"
                // selectComponent = objComponent
                if (nflag === 1) {
                    loadComponent = true;
                    objComponent["smanuflotno"] = "";
                    objComponent["dreceiveddate"] = rearrangeDateFormat(LoginProps.userInfo, LoginProps.CurrentTime)//new Date(LoginProps.CurrentTime);
                    objComponent["sreceiveddate"] = rearrangeDateFormat(LoginProps.userInfo, LoginProps.CurrentTime)//new Date(LoginProps.CurrentTime);
                    selectComponent = objComponent;
                } else {
                    loadComponent = false;
                    parentPopUpSize = "xl"
                    // openChildModal = false;
                    showSaveContinue = false;
                    selectComponent = undefined
                }
                let Test = LoginProps.Test || [];
                let Component = LoginProps.Component || [];
                Component.unshift(component);
                selectedComponent = component;
                Test[slno] = response.data;
                SelectedTest = TestData;
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        Component, Test, SelectedTest, selectComponent, selectedComponent,
                        loadComponent, showSaveContinue, parentPopUpSize, loading: false, SelectedSource
                    }
                });
                // console.log(response.data);
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
                } else if (error.response?.status === 500) {
                    toast.error(error.message);
                } else {
                    toast.warn(error.response.data);
                }
            })
    }
}

export function EditComponent(Map, component, userInfo) {
    return function (dispatch) {
        dispatch(initRequest(true));
        let urlArray = [];
        const ComponentTestBySpec = rsapi().post("/registration/getComponentBySpec",
            Map);

        const timezone = rsapi().post("timezone/getTimeZone");

        urlArray = [ComponentTestBySpec, timezone]
        Axios.all(urlArray)
            .then(response => {
                const lstComponentMap = constructOptionList(response[0].data.lstComponent || [], "ncomponentcode",
                    "scomponentname", undefined, undefined, true);
                const timeZoneListMap = constructOptionList(response[1].data || [], "ntimezonecode",
                    "stimezoneid", undefined, undefined, true);
                const TimeZoneField = response[1].data;
                const lstComponent = lstComponentMap.get("OptionList");
                const timeZoneList = timeZoneListMap.get("OptionList");

                component["ncomponentcode"] = { label: component.scomponentname, value: component.ncomponentcode }
                component["dreceiveddate"] = rearrangeDateFormat(userInfo, component["sreceiveddate"]);
                component["scomments"] = component["scomments"]

                let ntzdreceivedate = component.ntzdreceivedate;
                if (component.ntzdreceivedate !== null && typeof component.ntzdreceivedate === "object") {
                    ntzdreceivedate = component.ntzdreceivedate.value;
                }
                component["ntzdreceivedate"] = component.ntzdreceivedate ?
                    {
                        "label": TimeZoneField[TimeZoneField.findIndex(x => x.ntimezonecode === ntzdreceivedate)].stimezoneid, "value":
                            TimeZoneField[TimeZoneField.findIndex(x => x.ntimezonecode === ntzdreceivedate)].ntimezonecode
                    } : ""

                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loadComponent: true, childoperation: "update",
                        lstComponent, ChildscreenName: "Component",
                        openChildModal: false, selectComponent: component, parentPopUpSize: "lg",
                        timeZoneList, loading: false
                    }
                });
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
                } else if (error.response?.status === 500) {
                    toast.error(error.message);
                } else {
                    toast.warn(error.response.data);
                }
            })
    }
}

export function ReloadData(inputData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("registration/getRegistrationByFilterSubmit", { ...inputData.inputData })
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
                    //masterData['searchedTests'] = undefined
                    masterData['searchedTest'] = undefined
                }
                // let selectedFilter = inputData.selectedFilter;
                // selectedFilter["fromdate"] = "";
                // selectedFilter["todate"] = "";

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
                        // filterColumnActive:false,
                        //selectedFilter
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
                } else if (error.response?.status === 500) {
                    toast.error(error.message);
                } else {
                    toast.warn(error.response.data);
                }
            })
    }
}

export function getTreeByProduct(Map, selectedRecord, comboData, inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        if (Map.nsampletypecode === SampleType.CLINICALTYPE &&
            Map.nportalrequired === transactionStatus.YES && selectedRecord["Order Type"] && selectedRecord["Order Type"].value == 2) {
            Map = { ...Map, nordertypecode: selectedRecord["Order Type"].value, nallottedspeccode: selectedRecord["Order"] && selectedRecord["Order"].item.jsondata.nallottedspeccode }
        }
        else if (Map.nsampletypecode === SampleType.PRODUCT && selectedRecord["Plant Order"] && selectedRecord["Plant Order"].item && selectedRecord["Plant Order"].item.jsondata) {
            Map = { ...Map, nallottedspeccode: selectedRecord["Plant Order"] && selectedRecord["Plant Order"].item.jsondata.nallottedspeccode }
        }

        rsapi().post("/registration/getTreeByProduct", Map)
            .then(response => {
                let { Specification, AgaramTree, ActiveKey, FocusKey, OpenNodes } = [];
                const selectedSpec = {}
                if (response.data["rtn"] === true) {
                    Specification = constructOptionList(response.data["Specification"] || [], "nallottedspeccode",
                        "sspecname", undefined, undefined, true).get("OptionList");
                    AgaramTree = response.data["AgaramTree"];
                    ActiveKey = response.data["ActiveKey"];
                    FocusKey = response.data["FocusKey"];
                    OpenNodes = response.data["OpenNodes"];
                    //Manufacturer = response.data["Manufacturer"];
                    selectedSpec["nallottedspeccode"] = Specification.length > 0 ? {
                        "value": Specification[0].value,
                        "label": Specification[0].label,
                        "item": Specification[0].item
                    } : "";

                    selectedSpec["sversion"] = Specification.length > 0 ? Specification[0].item.sversion : ""
                    selectedSpec["ntemplatemanipulationcode"] = Specification.length > 0 ? Specification[0].item.ntemplatemanipulationcode : -1
                }
                selectedRecord = { ...selectedRecord, ...selectedSpec }

                if ((Map.nsampletypecode === SampleType.CLINICALTYPE &&
                    Map.nportalrequired && Map.nportalrequired === 3
                    && selectedRecord["Order Type"] && selectedRecord["Order Type"].value === 2)
                    || (Map.nsampletypecode === SampleType.PRODUCT
                        && selectedRecord["Plant Order"] && selectedRecord["Plant Order"].item && selectedRecord["Plant Order"].item.jsondata.nallottedspeccode)) {

                    let dispatchData = {
                        Specification,
                        selectedRecord,
                        AgaramTree, ActiveKey, FocusKey, OpenNodes,
                        Test: [],
                        SelectedTest: [],
                        loading: false,
                        comboData,
                        ...inputParam,
                        selectedSpec,
                        Component: [],
                        selectComponent: {},
                        selectedComponent: {},
                        subSampleDataGridList: [],
                        "userInfo": Map.userInfo  // ALPD-3673 VISHAKH
                    }


                    if (Specification.length > 0) {
                        if (Map.nsampletypecode === SampleType.CLINICALTYPE) {
                            dispatch(autoExternalComponentLoadBasedOnSpec(dispatchData))
                        }
                        else if (Map.nsampletypecode === SampleType.PRODUCT) {
                            dispatch(autoPortalTestLoadBasedOnSpec(dispatchData))
                        }

                    } else {
                        let masterStatus = ''
                        if (selectedRecord["Order"] && selectedRecord["Order"].item.jsondata.nallottedspeccode) {
                            masterStatus = intl.formatMessage({ id: "IDS_SELECTEDEXTERNALORDERSPECISRETIRED" })
                        }
                        dispatch({
                            type: DEFAULT_RETURN,
                            payload: { ...dispatchData, masterStatus }
                        })
                    }

                }
                else {
                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {
                            Specification,
                            selectedRecord,
                            AgaramTree, ActiveKey, FocusKey, OpenNodes,
                            Test: [],
                            SelectedTest: [],
                            loading: false,
                            comboData,
                            ...inputParam,
                            selectedSpec,
                            Component: [],
                            selectComponent: {},
                            selectedComponent: {},
                            subSampleDataGridList: [],
                            addMaster: false,
                            masterIndex: undefined,

                        }
                    });
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
                } else if (error.response?.status === 500) {
                    toast.error(error.message);
                } else {
                    toast.warn(error.response.data);
                }
            })
    }
}

export const getNewRegSpecification = (inputParam, masterData) => {
    return (dispatch) => {
        if (inputParam.selectedNode !== null) {
            dispatch(initRequest(true));
            rsapi().post("/registration/" + inputParam.operation + inputParam.methodUrl, { ...inputParam, ntreetemplatemanipulationcode: inputParam.selectedNode.ntemplatemanipulationcode })
                .then(response => {
                    sortData(response.data);
                    let Specification = constructOptionList(response.data || [], "nallottedspeccode", "sspecname", false, false, true).get("OptionList");
                    let selectedComponent = undefined;
                    inputParam.selectedRecord["nallottedspeccode"] = Specification.length > 0 ? { value: Specification[0].value, label: Specification[0].label, item: Specification[0].item } : "";
                    inputParam.selectedRecord["sversion"] = Specification.length > 0 ? Specification[0].item.sversion : "";
                    inputParam.selectedRecord["ntemplatemanipulationcode"] = Specification.length > 0 ? Specification[0].item.ntemplatemanipulationcode : -1;
                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {
                            SelectedActiveKey: inputParam.activeKey,
                            SelectedFocusKey: inputParam.focusKey,
                            primaryKey: inputParam.primaryKey,
                            Specification: Specification,
                            selectedNode: inputParam.selectedNode,
                            selectedRecord: inputParam.selectedRecord,
                            //  Test: [],
                            selectedComponent,
                            //ALPD-1793_fix
                            // SelectedTest: [],
                            loading: false,
                            showSample: undefined
                        }
                    }
                    );
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
                    } else if (error.response?.status === 500) {
                        toast.error(error.message);
                    } else {
                        toast.warn(error.response.data);
                    }
                });
        }
    }
}

export function AddComponents(Map) {
    return function (dispatch) {
        dispatch(initRequest(true));
        let urlArray = []
        const ComponentTestBySpec = rsapi().post("/registration/getComponentBySpec",
            Map);
        const timezone = rsapi().post("timezone/getTimeZone");

        urlArray = [ComponentTestBySpec, timezone
        ]
        Axios.all(urlArray)
            .then(response => {
                const lstComponentMap = constructOptionList(response[0].data.lstComponent || [], "ncomponentcode",
                    "scomponentname", undefined, undefined, true);
                const timeZoneListMap = constructOptionList(response[1].data || [], "ntimezonecode",
                    "stimezoneid", undefined, undefined, true);
                const lstComponent = lstComponentMap.get("OptionList");
                const timeZoneList = timeZoneListMap.get("OptionList");
                let dreceiveddate = null;
                if (lstComponent[0].item.sreceiveddate)
                    dreceiveddate = rearrangeDateFormat(Map["userinfo"], lstComponent[0].item.sreceiveddate);//new Date(lstComponent[0].item.sreceiveddate);//|| [];

                let selectComponent = {
                    sreceiveddate: dreceiveddate,
                    dreceiveddate,
                    ntzdreceivedate: { "label": Map["userinfo"].stimezoneid, "value": Map["userinfo"].ntimezonecode },
                    stzdreceivedate: Map["userinfo"].stimezoneid,
                    scomments: "",
                    nallottedspeccode: lstComponent[0].item.nallottedspeccode
                };
                let CurrentTime = dreceiveddate;
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loadComponent: true,
                        lstComponent, dreceiveddate, ChildscreenName: "Component",
                        showSaveContinue: true, openChildModal: false, childoperation: "create", selectComponent
                        , parentPopUpSize: "lg", CurrentTime, timeZoneList, loading: false,
                        openPortal: true, openModal: false
                    }
                });
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
                } else if (error.response?.status === 500) {
                    toast.error(error.message);
                } else {
                    toast.warn(error.response.data);
                }
            })
    }
}

export function getAllTest(objComponent, LoginProps, nneedsubsample, specBasedComponent, selectPackage1, specBasedTestPackage, selectPackage) {
    return function (dispatch) {
        if (Object.keys(objComponent).length > 0) {
            dispatch(initRequest(true));
            rsapi().post("/registration/getTestfromDB", {
                nspecsampletypecode: objComponent.nspecsampletypecode,
                slno: objComponent.slno,
                nneedsubsample: nneedsubsample,
                nallottedspeccode: objComponent.nallottedspeccode,
                specBasedComponent: specBasedComponent,
                specBasedTestPackage: specBasedTestPackage,
                conditionalTestPackage: true,
                //ALPD-5907
                userinfo: LoginProps.userInfo
                //    ntestpackagecode:selectPackage.ntestpackagecode.value

            })
                .then(response => {
                    let PackageData = [];
                    let TestCombined = [];
                    //   const TestCombined = response.data;
                    let TestData = response.data;
                    let Test = LoginProps.Test || [];
                    let componentTest = Test[objComponent.slno] ? Test[objComponent.slno] : [];
                    TestCombined = filterRecordBasedOnTwoArrays(TestData, componentTest, "ntestgrouptestcode");


                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {
                            TestCombined, TestPackage: PackageData, selectPackage: [],
                            loadTest: true, openChildModal: false,
                            ChildscreenName: intl.formatMessage({ id: "IDS_TEST" }),
                            screenName: intl.formatMessage({ id: "IDS_TEST" }),
                            operation: "create",
                            childoperation: "create",
                            parentPopUpSize: "lg", loading: false
                        }
                    });
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
                    } else if (error.response?.status === 500) {
                        toast.error(error.message);
                    } else {
                        toast.warn(error.response.data);
                    }
                })
        } else {
            toast.info(intl.formatMessage({ id: "IDS_SELECTCOMPONENTTOADDTEST" }));
        }

    }
}

export function getTest(objComponent, LoginProps, nneedsubsample, specBasedComponent, selectPackage1, specBasedTestPackage, selectPackage) {
    return function (dispatch) {

        //console.log("LoginProps:", LoginProps);
        // if (Object.keys(objComponent).length > 0) {
        const urlArray = []

        const TestGet = rsapi().post("/registration/getTestfromDB", {
            nspecsampletypecode: objComponent.nspecsampletypecode,
            slno: objComponent.slno,
            nneedsubsample: nneedsubsample,
            nallottedspeccode: objComponent.nallottedspeccode,
            specBasedComponent: specBasedComponent,
            specBasedTestPackage: specBasedTestPackage,
            conditionalTestPackage: true,
            userinfo: LoginProps.userInfo
            //    ntestpackagecode:selectPackage.ntestpackagecode.value

        });
        urlArray[0] = TestGet;
        const TestPackageGet = rsapi().post("/registration/getTestfromTestPackage", {
            nspecsampletypecode: objComponent.nspecsampletypecode,
            slno: objComponent.slno,
            nneedsubsample: nneedsubsample,
            nallottedspeccode: objComponent.nallottedspeccode,
            specBasedComponent: specBasedComponent,
            specBasedTestPackage: specBasedTestPackage,
            conditionalTestPackage: true,
            userinfo: LoginProps.userInfo
        });
        urlArray[1] = TestPackageGet;
        const TestSectionGet = rsapi().post("/registration/getTestfromSection", {
            nspecsampletypecode: objComponent.nspecsampletypecode,
            slno: objComponent.slno,
            nneedsubsample: nneedsubsample,
            nallottedspeccode: objComponent.nallottedspeccode,
            specBasedComponent: specBasedComponent,
            specBasedTestPackage: specBasedTestPackage,
            conditionalTestPackage: true,
            userinfo: LoginProps.userInfo
        });
        urlArray[2] = TestSectionGet;
        dispatch(initRequest(true));
        Axios.all(urlArray).then(response => {

            // const TestCombined = [];
            let PackageData = [];
            let TestSectionData = [];
            //  if (specBasedTestPackage) {
            const PackageDataMap = constructOptionList(response[1].data.TestPackage || [], "ntestpackagecode",
                "stestpackagename", undefined, undefined, true);
            PackageData = PackageDataMap.get("OptionList");

            const TestSectionDataMap = constructOptionList(response[2].data.TestSection || [], "nsectioncode",
                "ssectionname", undefined, undefined, true);
            TestSectionData = TestSectionDataMap.get("OptionList");
            //    }
            //    else {
            let TestData = response[0].data;
            let Test = LoginProps.Test || [];
            let componentTest = Test[objComponent.slno] ? Test[objComponent.slno] : [];
            let TestCombined = filterRecordBasedOnTwoArrays(TestData, componentTest, "ntestcode");
            //    }
            // const lstComponentMap = constructOptionList(TestCombined|| [], "ntestgrouptestcode",
            //"stestsynonym", undefined, undefined, true);
            dispatch({
                type: DEFAULT_RETURN,
                payload: {
                    TestCombined, TestPackage: PackageData, selectPackage: [], AllTest: TestData,
                    TestSection: TestSectionData, selectSection: [],
                    loadTest: true, openChildModal: false,
                    ChildscreenName: intl.formatMessage({ id: "IDS_TEST" }),
                    screenName: intl.formatMessage({ id: "IDS_TEST" }),
                    operation: "create",
                    childoperation: "create",
                    parentPopUpSize: "lg", loading: false, AllSection: TestSectionData, selectedTestData: []
                }
            });
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
                } else if (error.response?.status === 500) {
                    toast.error(error.message);
                } else {
                    toast.warn(error.response.data);
                }
            })
        // } else {
        //     toast.info(intl.formatMessage({ id: "IDS_SELECTCOMPONENTTOADDTEST" }));
        // }

    }
}

export function addsubSample(masterData, userinfo, columnList,
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
                userinfo
            })
            urlArray[1] = actualService;
            if (specBasedComponent) {
                const ComponentTestBySpec = rsapi().post("/registration/getComponentBySpec", {
                    ...Map,
                    specBasedComponent: specBasedComponent,
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
                    userinfo
                })
                urlArray[2] = TestGet;
                const TestPackageGet = rsapi().post("/registration/getTestfromTestPackage", {
                    nallottedspeccode: Map["nallottedspeccode"],
                    // slno: Component ? Object.keys(Component).length + 1 : 1,
                    specBasedComponent: specBasedComponent,
                    userinfo
                    //   specBasedTestPackage: specBasedTestPackage,
                    //  conditionalTestPackage: conditionalTestPackage
                });
                urlArray[5] = TestPackageGet;

                const TestSectionGet = rsapi().post("/registration/getTestfromSection", {
                    nallottedspeccode: Map["nallottedspeccode"],
                    // slno: Component ? Object.keys(Component).length + 1 : 1,
                    specBasedComponent: specBasedComponent,
                    userinfo
                    //   specBasedTestPackage: specBasedTestPackage,
                    //  conditionalTestPackage: conditionalTestPackage
                });
                urlArray[6] = TestSectionGet;
            }
            const currentDate = rsapi().post("timezone/getLocalTimeByZone", {
                userinfo
            })
            urlArray[3] = currentDate
            const dateService = rsapi().post("dynamicpreregdesign/dateValidation", {
                datecolumnlist: SubSamplewithoutCombocomponent.filter(x => x.inputtype === "date"),
                userinfo
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
                            selectedRecord1[componentrow.label] = componentrow.loadcurrentdate ? rearrangeDateFormat(userinfo, response[3].data?.date) : "";
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
                    ChildscreenName: intl.formatMessage({ id: "IDS_SUBSAMPLE" }),
                    screenName: intl.formatMessage({ id: "IDS_SUBSAMPLE" }),
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
                    TestSection: TestSectionData, selectSection: [], AllTest: TestCombined, AllSection: TestSectionData
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
                    } else if (error.response?.status === 401 || error.response?.status === 403) {
                        dispatch({
                            type: UN_AUTHORIZED_ACCESS,
                            payload: {
                                navigation: 'forbiddenaccess',
                                loading: false,
                                responseStatus: error.response.status
                            }
                        });
                    } else if (error.response?.status === 500) {
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
                    userinfo
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
                const TestPackageGet = rsapi().post("/registration/getTestfromTestPackage", {
                    //  nspecsampletypecode: selectedobject.nspecsampletypecode,
                    nallottedspeccode: selectedRecord.nallottedspeccode.item.nallottedspeccode,
                    slno: Component ? Object.keys(Component).length + 1 : 1,
                    specBasedComponent: specBasedComponent,
                    specBasedTestPackage: specBasedTestPackage,
                    conditionalTestPackage: conditionalTestPackage,
                    userinfo
                });
                urlArray[3] = TestPackageGet;

                const TestSectionGet = rsapi().post("/registration/getTestfromSection", {
                    //  nspecsampletypecode: selectedobject.nspecsampletypecode,
                    nallottedspeccode: selectedRecord.nallottedspeccode.item.nallottedspeccode,
                    slno: Component ? Object.keys(Component).length + 1 : 1,
                    specBasedComponent: specBasedComponent,
                    specBasedTestPackage: specBasedTestPackage,
                    conditionalTestPackage: conditionalTestPackage,
                    userinfo
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
                                selectedRecord1[componentrow.label] = componentrow.loadcurrentdate ? rearrangeDateFormat(userinfo, response[1].data?.date) : "";
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
                            ChildscreenName: intl.formatMessage({ id: "IDS_SUBSAMPLE" }),
                            screenName: intl.formatMessage({ id: "IDS_SUBSAMPLE" }),
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
                    } else if (error.response?.status === 401 || error.response?.status === 403) {
                        dispatch({
                            type: UN_AUTHORIZED_ACCESS,
                            payload: {
                                navigation: 'forbiddenaccess',
                                loading: false,
                                responseStatus: error.response.status
                            }
                        });
                    } else if (error.response?.status === 500) {
                        toast.error(error.message);
                    } else {
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
                                selectedRecord1[componentrow.label] = componentrow.loadcurrentdate ? rearrangeDateFormat(userinfo, response[1].data?.date) : "";
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
                        ChildscreenName: intl.formatMessage({ id: "IDS_SUBSAMPLE" }),
                        screenName: intl.formatMessage({ id: "IDS_SUBSAMPLE" }),
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
                        selectedTestData: [],
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
                    } else if (error.response?.status === 401 || error.response?.status === 403) {
                        dispatch({
                            type: UN_AUTHORIZED_ACCESS,
                            payload: {
                                navigation: 'forbiddenaccess',
                                loading: false,
                                responseStatus: error.response.status
                            }
                        });
                    } else if (error.response?.status === 500) {
                        toast.error(error.message);
                    } else {
                        toast.warn(error.response.data);
                    }
                })
            }
        }
    }

}


export function componentTest(selectedobject, Reg, specBasedComponent, Component, specBasedTestPackage,
    conditionalTestPackage, inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        // console.log("componentTest:", inputParam);
        const urlArray = []
        Component = Component ? Component : []
        const TestGet = rsapi().post("/registration/getTestfromDB", {
            nspecsampletypecode: selectedobject.nspecsampletypecode,
            slno: Component ? Object.keys(Component).length + 1 : 1,
            specBasedComponent: specBasedComponent,
            specBasedTestPackage: specBasedTestPackage,
            conditionalTestPackage: conditionalTestPackage,
            nneedsubsample: selectedobject.nneedsubsample,
            userinfo: inputParam.userinfo
        });
        urlArray[0] = TestGet;
        const TestPackageGet = rsapi().post("/registration/getTestfromTestPackage", {
            nspecsampletypecode: selectedobject.nspecsampletypecode,
            slno: Component ? Object.keys(Component).length + 1 : 1,
            specBasedComponent: specBasedComponent,
            specBasedTestPackage: specBasedTestPackage,
            conditionalTestPackage: conditionalTestPackage,
            userinfo: inputParam.userinfo
        });
        urlArray[1] = TestPackageGet;

        const TestSectionGet = rsapi().post("/registration/getTestfromSection", {
            nspecsampletypecode: selectedobject.nspecsampletypecode,
            slno: Component ? Object.keys(Component).length + 1 : 1,
            specBasedComponent: specBasedComponent,
            specBasedTestPackage: specBasedTestPackage,
            conditionalTestPackage: conditionalTestPackage,
            userinfo: inputParam.userinfo

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
                } else if (error.response?.status === 401 || error.response?.status === 403) {
                    dispatch({
                        type: UN_AUTHORIZED_ACCESS,
                        payload: {
                            navigation: 'forbiddenaccess',
                            loading: false,
                            responseStatus: error.response.status
                        }
                    });
                } else if (error.response?.status === 500) {
                    toast.error(error.message);
                } else {
                    toast.warn(error.response.data);
                }
            })
    }
}

// export function testPackageTest(selectedobject, Reg, specBasedComponent, Component,specBasedTestPackage,conditionalTestPackage,selectComponent,objComponent,LoginProps,selectPackage,subSampleBased,selectedSpec,nneedsubsample) {
// export function testPackageTest(selectedobject, Reg, specBasedComponent, Component, selectComponent, objComponent, LoginProps, selectPackage, subSampleBased, selectedSpec, nneedsubsample, action) {

//     return function (dispatch) {
//         dispatch(initRequest(true));
//         Component = Component ? Component : []
//         // rsapi().post("/registration/getTestBasesdTestPackage", {
//         //     nspecsampletypecode:!nneedsubsample?selectedSpec.item.nspecsampletypecode: Object.keys(selectedobject).length!==0?selectedobject.nspecsampletypecode:selectComponent.nspecsampletypecode,
//         //     slno:subSampleBased?Component ? Object.keys(Component).length + 1 : 1:selectComponent.slno,
//         //     specBasedComponent: specBasedComponent,
//         //     ntestpackagecode: selectPackage.ntestpackagecode.value,
//         //     nallottedspeccode:selectedSpec!==undefined?selectedSpec.value:selectedobject.nallottedspeccode

//         // })
//         rsapi().post("/registration/getTestBasesdTestPackage", {
//             // nspecsampletypecode:!nneedsubsample?selectedSpec.item.nspecsampletypecode: Object.keys(selectedobject).length!==0?selectedobject.nspecsampletypecode:selectComponent.nspecsampletypecode,
//             nspecsampletypecode: selectComponent && selectComponent.nspecsampletypecode ? selectComponent.nspecsampletypecode : selectedobject.nspecsampletypecode,
//             //     slno: subSampleBased ? Component ? Object.keys(Component).length + 1 : 1 : selectComponent.slno,
//             specBasedComponent: specBasedComponent,
//             ntestpackagecode: selectPackage.ntestpackagecode.value,
//             nallottedspeccode: selectedSpec && selectedSpec.value !== undefined ? selectedSpec.value : selectedobject.nallottedspeccode

//         })
//             .then(response => {
//                 const Map = {}
//                 let TestData = response.data;
//                 let Test = (action !== "AddSubSample") ? (LoginProps.Test || []) : [];

//                 let componentTest = [];
//                 if (subSampleBased) {
//                     componentTest = Test[Component ? Object.keys(Component).length + 1 : 1] ? Test[Component ? Object.keys(Component).length + 1 : 1] : [];

//                 } else {
//                     componentTest = objComponent && Test[objComponent.slno] ? Test[objComponent.slno] : [];

//                 }
//                 const availableTest = filterRecordBasedOnTwoArrays(TestData, componentTest, "ntestcode");
//                 const TestCombined = filterRecordBasedOnTwoArrays(TestData, componentTest, "ntestcode");

//                 delete selectedobject.ntestgrouptestcode;
//                 if (Reg) {
//                     Map["selectedRecord"] = selectedobject
//                 } else {
//                     Map["selectPackage"] = selectPackage
//                 }
//                 dispatch({
//                     type: DEFAULT_RETURN,
//                     payload: {
//                         availableTest, TestCombined, ...Map, loading: false, selectedTestData: [], AllTest: LoginProps.TestCombined
//                         //, selectPackage: []
//                         // TestCombined,loadTest: true, openChildModal: false,
//                         // ChildscreenName: "Test",
//                         //  screenName: "Test",
//                         // operation: "create",
//                         //  childoperation: "create",
//                         //   parentPopUpSize: "lg", loading: false
//                     }
//                 });
//             })
//             .catch(error => {
//                 toast.error(error.message);
//                 dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
//             })
//     }
// }

export function testPackageTest(selectedobject, Reg, specBasedComponent, Component, selectComponent, objComponent, LoginProps, selectPackage, selectSection, subSampleBased, selectedSpec, nneedsubsample, action) {

    return function (dispatch) {
        dispatch(initRequest(true));
        let urlArray = []
        let testpackage;
        Component = Component ? Component : []
        const testsection = rsapi().post("/registration/getTestSectionBasesdTestPackage", {
            nspecsampletypecode: selectComponent && selectComponent.nspecsampletypecode ? selectComponent.nspecsampletypecode : selectedobject.nspecsampletypecode,
            specBasedComponent: specBasedComponent,
            ntestpackagecode: selectPackage.ntestpackagecode.value,
            nallottedspeccode: selectedSpec && selectedSpec.value !== undefined ? selectedSpec.value : selectedobject.nallottedspeccode,
            userinfo: LoginProps.userInfo
        })
        //ALPD-3404
        urlArray[0] = testsection;
        testpackage = rsapi().post("/registration/getTestBasesdTestPackage", {
            nspecsampletypecode: selectComponent && selectComponent.nspecsampletypecode ? selectComponent.nspecsampletypecode : selectedobject.nspecsampletypecode,
            specBasedComponent: specBasedComponent,
            ntestpackagecode: selectPackage.ntestpackagecode.value,
            nallottedspeccode: selectedSpec && selectedSpec.value !== undefined ? selectedSpec.value : selectedobject.nallottedspeccode,
            userinfo: LoginProps.userInfo
        })
        urlArray[1] = testpackage;
        Axios.all(urlArray)
            .then(response => {
                const Map = {}
                let TestSectionData = [];
                let TestData = response[1].data;
                let Test = (action !== "AddSubSample") ? (LoginProps.Test || []) : [];

                let componentTest = [];
                if (subSampleBased) {
                    componentTest = Test[Component ? Object.keys(Component).length + 1 : 1] ? Test[Component ? Object.keys(Component).length + 1 : 1] : [];

                } else {
                    componentTest = objComponent && Test[objComponent.slno] ? Test[objComponent.slno] : [];

                }
                const availableTest = filterRecordBasedOnTwoArrays(TestData, componentTest, "ntestcode");
                const TestCombined = filterRecordBasedOnTwoArrays(TestData, componentTest, "ntestcode");


                const testSectionDataMap = constructOptionList(response[0].data.TestSectionBasedonTestPackage || [], "nsectioncode",
                    "ssectionname", undefined, undefined, true);
                TestSectionData = testSectionDataMap.get("OptionList");

                delete selectedobject.ntestgrouptestcode;
                delete selectedobject.nsectioncode;
                if (Reg) {
                    Map["selectedRecord"] = selectedobject
                } else {
                    Map["selectPackage"] = selectPackage
                }
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        availableTest, TestCombined, ...Map, loading: false, selectedTestData: [],
                        AllTest: LoginProps.AllTest,
                        AllSection: LoginProps.AllSection, TestSection: TestSectionData, selectSection: [],
                        TestPakageTest: TestCombined
                        //, selectPackage: []
                        // TestCombined,loadTest: true, openChildModal: false,
                        // ChildscreenName: "Test",
                        //  screenName: "Test",
                        // operation: "create",
                        //  childoperation: "create",
                        //   parentPopUpSize: "lg", loading: false
                    }
                });
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
                } else if (error.response?.status === 500) {
                    toast.error(error.message);
                } else {
                    toast.warn(error.response.data);
                }
            })
    }
}
//ALPD-3404
export function testSectionTest(selectedobject, Reg, specBasedComponent, Component, selectComponent, objComponent, LoginProps, selectPackage, selectSection, subSampleBased, selectedSpec, nneedsubsample, action) {

    return function (dispatch) {
        dispatch(initRequest(true));
        Component = Component ? Component : [];
        //console.log("LoginProps:", LoginProps);
        rsapi().post("/registration/getTestBasedTestSection", {
            nspecsampletypecode: selectComponent && selectComponent.nspecsampletypecode ? selectComponent.nspecsampletypecode : selectedobject.nspecsampletypecode,
            specBasedComponent: specBasedComponent,
            ntestpackagecode: selectPackage.ntestpackagecode && selectPackage.ntestpackagecode.value || -1,
            nsectioncode: selectSection.nsectioncode.value,
            nallottedspeccode: selectedSpec && selectedSpec.value !== undefined ? selectedSpec.value : selectedobject.nallottedspeccode,
            userinfo: LoginProps.userInfo
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
                } else if (error.response?.status === 401 || error.response?.status === 403) {
                    dispatch({
                        type: UN_AUTHORIZED_ACCESS,
                        payload: {
                            navigation: 'forbiddenaccess',
                            loading: false,
                            responseStatus: error.response.status
                        }
                    });
                } else if (error.response?.status === 500) {
                    toast.error(error.message);
                } else {
                    toast.warn(error.response.data);
                }
            })
    }
}



export function addSubSampleSaveContinue(Map1, Map,
    specBasedComponent, Component, selectedTestData, lstComponent, LoginProps) {

    //  const newcomboData = parentChildComboLoad(columnList, SubSamplecomboData,
    //     selectComponent, childColumnList, SubSamplewithoutCombocomponent)
    return (dispatch) => {
        if (!specBasedComponent) {
            // rsapi().post("/registration/getTestfromDB", {
            //     nallottedspeccode: Map["nallottedspeccode"],
            //     nspecsampletypecode: Map["nspecsampletypecode"],
            //     slno: Map1.Component ? Object.keys(Map1.Component).length + 1 : 1,
            //     specBasedComponent: specBasedComponent, nneedsubsample: Map["nneedsubsample"]
            // }).then(response => {
            //     let TestCombined = Map1.TestCombined;//response.data
            //     // let selectedTestPackageData = selectedTestPackageData && selectedTestPackageData.length > 0 ? selectedTestData : []

            //     let selectedTestPackageData = selectedTestData && selectedTestData.length > 0 ? selectedTestData : []

            //     const selectedTestPackageData1 = TestCombined.filter(function (x) {
            //         return selectedTestPackageData.some(function (y) {
            //             return x["ntestpackagetestcode"] === y.value
            //         })
            //     });
            //     selectedTestData = selectedTestData && selectedTestData.length > 0 ? selectedTestPackageData : []

            //     const selectedTestData1 = TestCombined.filter(function (x) {
            //         return selectedTestData.some(function (y) {
            //             return x["ntestgrouptestcode"] === y.value
            //         })
            //     });


            //     selectedTestData = constructOptionList(selectedTestData1, "ntestgrouptestcode", "stestsynonym")
            //     selectedTestData["ntestgrouptestcode"] = selectedTestData.get("OptionList")
            //     selectedTestPackageData = constructOptionList(selectedTestPackageData1, "ntestpackagetestcode", "stestpackagename")
            //     selectedTestPackageData["ntestpackagetestcode"] = selectedTestPackageData.get("OptionList")

            //     // Map1.selectComponent = {};
            //     Map1.selectComponent = { ...Map1.saveContinueData };
            //     // Map1.selectComponent["ncomponentcode"] = {};
            //     dispatch({
            //         type: DEFAULT_RETURN,
            //         payload: {
            //             ...Map1,
            //             loading: false,
            //             TestCombined,
            //             selectPackage: [],
            //             //TestPackage
            //             //selectedTestData,
            //             //selectedTestPackageData,
            //             selectedTestData: [],
            //             selectedTestPackageData: [],
            //             masterStatus: intl.formatMessage({ id: "IDS_SAVESUCCESSFULLY" })
            //         }
            //     });
            // })
            Map1.selectComponent = { ...Map1.saveContinueData };
            //ALPD-3404
            const TestCombined = LoginProps.AllTest || Map1.TestCombined;
            delete (Map1.TestCombined)
            dispatch({
                type: DEFAULT_RETURN,
                payload: {
                    ...Map1,
                    loading: false,
                    TestCombined,
                    selectPackage: [],
                    selectSection: [],
                    //TestPackage
                    //selectedTestData,
                    //selectedTestPackageData,
                    selectedTestData: [],
                    selectedTestPackageData: [],
                    masterStatus: intl.formatMessage({ id: "IDS_SAVESUCCESSFULLY" }),
                }
            });

        }
        else {
            // lstComponent = lstComponent.filter(x => x.item.nspecsampletypecode !== Map1.selectComponent["nspecsampletypecode"])
            // Map1.selectComponent = {};
            // Map1.selectComponent["ncomponentcode"] = {};           
            // Map1.selectComponent["Sample Name"] = "";
            Map1.selectComponent = { ...Map1.saveContinueData }//, "ncomponentcode": {} };
            const inputParam = {
                ...Map1,
                loading: false,
                TestCombined: [],
                selectPackage: [],
                TestPackage: [],
                selectedTestData: [],
                selectedTestPackageData: [],
                selectComponent: {},
                lstComponent,
                masterStatus: intl.formatMessage({ id: "IDS_SAVESUCCESSFULLY" }),
                userinfo: LoginProps.userinfo
            }
            if (Map1.selectComponent['ncomponentcode'] !== undefined) {
                dispatch(componentTest(Map1.selectComponent, false, specBasedComponent, Component, Map1.specBasedTestPackage, Map1.specBasedTestPackage ? true : false, inputParam));
            }
            else {
                dispatch({ type: DEFAULT_RETURN, payload: { ...inputParam } })
            }
        }
    }

}

export function editSubSample(Map,
    component, userInfo, specBasedComponent,
    SubSamplecomboData, selectedRecord) {
    return function (dispatch) {
        dispatch(initRequest(true));
        let urlArray = []
        let Componnet = {}
        if (specBasedComponent) {
            Componnet = rsapi().post("/registration/getComponentBySpec", {
                ...Map
            });
        }
        urlArray = [Componnet]
        Axios.all(urlArray)
            .then(response => {
                let comp = []
                if (specBasedComponent) {
                    comp = response[0].data.lstComponent
                }
                const lstComponentMap = constructOptionList(comp || [], "ncomponentcode",
                    "scomponentname", undefined, undefined, true);
                const lstComponent = lstComponentMap.get("OptionList");
                if (Map.nregsubtypecode === 6) {
                    let portalOrder = component['Container Type'] || {}
                    let containerType = SubSamplecomboData['ContainerType'] || []
                    let containerList = []
                    const nportalordercode = portalOrder && portalOrder.value ? portalOrder.value : -1
                    containerType.map(x => {
                        if (x.item.jsondata.nportalordercode === nportalordercode) {
                            containerList.push(x)
                        }
                    })

                    SubSamplecomboData['Container Type'] = containerList
                }

                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loadSubSample: true, childoperation: "update",
                        ChildscreenName: intl.formatMessage({ id: "IDS_SUBSAMPLE" }),
                        openChildModal: false, selectComponent: component,
                        parentPopUpSize: "lg", loading: false, lstComponent, SubSamplecomboData
                    }
                });
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
                } else if (error.response?.status === 500) {
                    toast.error(error.message);
                } else {
                    toast.warn(error.response.data);
                }
            })
    }
}

export function insertRegistration(inputParam, masterData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        let requestUrl = '';
        if (inputParam.isFileupload) {
            requestUrl = rsapi().post("/registration/createRegistrationWithFile", inputParam.formData)
        } else {
            requestUrl = rsapi().post("/registration/createRegistration", inputParam.inputData)
        }
        return requestUrl
            //  rsapi().post("/registration/createRegistration", inputParam.formData)
            .then(response => {
                if (response.data.rtn === "Success") {
                    // if (response.data["isPortalData"] && response.data["PortalStatus"] && response.data["PortalStatus"].length > 0) {
                    //     dispatch(UpdateExternalOrderStatus(response.data["PortalStatus"], inputParam));
                    // }

                    let RegistrationGetSample = updatedObjectWithNewElement(response.data["selectedSample"], masterData.RegistrationGetSample, 'Sample');
                    let selectedSample = response.data["selectedSample"];
                    let RegistrationGetSubSample = response.data["RegistrationGetSubSample"];
                    let RegistrationGetTest = response.data["RegistrationGetTest"];
                    let selectedSubSample = RegistrationGetSubSample;
                    RegistrationGetTest = sortData(RegistrationGetTest, "npreregno", "desc");
                    let selectedTest = RegistrationGetTest.length > 0 ? [RegistrationGetTest[0]] : [];
                    let regSampleExisted = inputParam.inputData && inputParam.inputData.orderTypeValue === 2 ? true : false;
                    if (inputParam.inputData.nneedsubsample) {
                        RegistrationGetSubSample = sortData(response.data["RegistrationGetSubSample"], 'npreregno', 'desc')
                        selectedSubSample = RegistrationGetSubSample.length > 0 ? [RegistrationGetSubSample[0]] : [];
                        RegistrationGetTest = RegistrationGetTest.filter(x => x.ntransactionsamplecode === selectedSubSample[0].ntransactionsamplecode)
                        selectedTest = RegistrationGetTest.length > 0 ? response.data["selectedTest"] : [];
                    }
                    // RegistrationGetTest = sortData(RegistrationGetTest, "npreregno", "desc")
                    if (inputParam.multipleselectionFlag) {
                        selectedSample = updatedObjectWithNewElement(response.data["selectedSample"], masterData.selectedSample);
                        updatedObjectWithNewElement(response.data["selectedSubSample"], masterData.RegistrationGetSubSample);
                        updatedObjectWithNewElement(response.data["selectedTest"], masterData.RegistrationGetTest);
                        RegistrationGetSubSample = masterData.RegistrationGetSubSample;
                        RegistrationGetTest = masterData.RegistrationGetTest;
                    }

                    masterData = {
                        ...masterData, ...response.data,
                        selectedSample, selectedSubSample, selectedTest,
                        RegistrationGetSubSample, RegistrationGetTest, RegistrationGetSample,
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
                } else if (error.response?.status === 500) {
                    toast.error(error.message);
                } else {
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

export function insertRegistrationScheduler(inputParam, masterData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("/registration/schedulerinsertRegistration", inputParam.inputData)
            .then(response => {
                // if (response.data.rtn === "Success") {
                //     let RegistrationGetSample = updatedObjectWithNewElement(response.data["selectedSample"], masterData.RegistrationGetSample);
                //     let selectedSample = response.data["selectedSample"];
                //     let RegistrationGetSubSample = response.data["RegistrationGetSubSample"];
                //     let RegistrationGetTest = response.data["RegistrationGetTest"];
                //     let selectedSubSample = RegistrationGetSubSample;
                //     RegistrationGetTest = sortData(RegistrationGetTest, "npreregno", "desc");
                //     let selectedTest = RegistrationGetTest.length > 0 ? [RegistrationGetTest[0]] : [];
                //     if (inputParam.inputData.nneedsubsample) {
                //         RegistrationGetSubSample = sortData(response.data["RegistrationGetSubSample"], 'npreregno', 'desc')
                //         selectedSubSample = RegistrationGetSubSample.length > 0 ? [RegistrationGetSubSample[0]] : [];
                //         RegistrationGetTest = RegistrationGetTest.filter(x => x.ntransactionsamplecode === selectedSubSample[0].ntransactionsamplecode)
                //         selectedTest = RegistrationGetTest.length > 0 ? response.data["selectedTest"] : [];
                //     }
                //     // RegistrationGetTest = sortData(RegistrationGetTest, "npreregno", "desc")
                //     if (inputParam.multipleselectionFlag) {
                //         selectedSample = updatedObjectWithNewElement(response.data["selectedSample"], masterData.selectedSample);
                //         updatedObjectWithNewElement(response.data["selectedSubSample"], masterData.RegistrationGetSubSample);
                //         updatedObjectWithNewElement(response.data["selectedTest"], masterData.RegistrationGetTest);
                //         RegistrationGetSubSample = masterData.RegistrationGetSubSample;
                //         RegistrationGetTest = masterDat..a.RegistrationGetTest;
                //     }


                //     masterData = {
                //         ...masterData, ...response.data,
                //         selectedSample, selectedSubSample, selectedTest,
                //         RegistrationGetSubSample, RegistrationGetTest, RegistrationGetSample
                //     }
                let respObject = {
                    masterData: { ...masterData, SchedulerTransaction: response["data"].SchedulerTransaction },
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
                    subSampleDataGridList: []
                }
                // inputParam.postParamList[0]['clearFilter'] = 'yes'
                // dispatch(postCRUDOrganiseTransSearch(inputParam.postParamList, respObject))
                dispatch({ type: DEFAULT_RETURN, payload: { ...respObject } })
                // } else {
                //     toast.info(response.data.rtn);
                //     dispatch({ type: DEFAULT_RETURN, payload: { loading: false, showConfirmAlert: false } })
                // }

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
                } else if (error.response?.status === 500) {
                    toast.error(error.message);
                } else {
                    toast.warn(error.response.data);
                }
            })
    }
}

export function getRegistrationSample(inputData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("registration/getRegistrationByFilterSubmit", { ...inputData.inputData })
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
                        subsampleskip: 0,
                        subsampletake: undefined,
                        showSample: undefined,
                        ...respObject,
                        activeSampleTab: inputData.inputData.activeSampleTab, regSampleExisted: false,
                        filterSubmitValueEmpty: false   // ALPDJ21-15  Added filterSubmitValueEmpty by Vishakh (10-07-2025)
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
                } else if (error.response?.status === 500) {
                    toast.error(error.message);
                } else {
                    toast.warn(error.response.data);
                }
            })
    }
}

export function getRegistrationsubSampleDetail(inputData, isServiceRequired, isParentValue) {
    return function (dispatch) {
        let inputParamData = {
            nsampletypecode: inputData.nsampletypecode,
            nregtypecode: inputData.nregtypecode,
            nregsubtypecode: inputData.nregsubtypecode,
            npreregno: inputData.npreregno,
            ntransactionstatus: inputData.ntransactionstatus,
            napprovalconfigcode: inputData.napprovalconfigcode,
            activeTestTab: inputData.activeTestTab,
            activeSampleTab: inputData.activeTestTab,
            activeSubSampleTab: inputData.activeTestTab,
            userinfo: inputData.userinfo,
            ndesigntemplatemappingcode: inputData.ndesigntemplatemappingcode,
            nneedsubsample: inputData.nneedsubsample,
            // ntype: inputData.nneedsubsample === true ? inputData.checkBoxOperation === 7 ? 4 : undefined:2, //ALPD-497
            ntype: inputData.nneedsubsample === true ? inputData.checkBoxOperation === checkBoxOperation.QUICKSELECTALL ? checkBoxOperation.SINGLEDESELECT : undefined : checkBoxOperation.DESELECT, //ALPD-497
            checkBoxOperation: inputData.nneedsubsample === true ?
                inputData.checkBoxOperation === checkBoxOperation.QUICKSELECTSTATUS ? checkBoxOperation.SINGLESELECT : inputData.checkBoxOperation : inputData.checkBoxOperation,
            OrderCodeData: inputData.selectedSample ? inputData.selectedSample.length > 0 && inputData.selectedSample.map(item => item.hasOwnProperty("OrderCodeData") ? item.OrderCodeData : -1).join(",") : null,
            selectedPreregno: inputData.selectedSample && inputData.selectedSample.length > 0 ? inputData.selectedSample.map(item => item.npreregno).join(",") : null,
            selectedTransactionsamplecode: inputData.selectedSample && inputData.selectedSample.length > 1
                && inputData.masterData.selectedSubSample ? inputData.masterData.selectedSubSample.map(item => item.ntransactionsamplecode).join(",") : null,
            noutsourcerequired: inputData.masterData && inputData.masterData.RealSampleTypeValue ? inputData.masterData.RealSampleTypeValue.noutsourcerequired : transactionStatus.NA
        }
        let activeName = "";
        let dataStateName = "";
        const subSample = inputData.nneedsubsample
        dispatch(initRequest(true));
        if (isServiceRequired) {
            rsapi().post("registration/getRegistrationSubSample", inputParamData)
                .then(response => {
                    sortData(response.data, "descending", "npreregno");
                    // if(isParentValue){
                    response.data['RegistrationGetSubSample'] = sortDataByParent(response.data['RegistrationGetSubSample'], inputData.sample, "npreregno");
                    //response.data['RegistrationGetTest']= sortDataByParent(response.data['RegistrationGetTest'],response.data['RegistrationGetSubSample'], "ntransactionsamplecode");
                    //  }
                    sortData(response.data['RegistrationAttachment']);
                    sortData(response.data['RegistrationComment']);
                    let masterData = {}
                    let skipInfo = {}
                    let oldSelectedTest = inputData.masterData.selectedTest || []
                    let externalOrderAttachmentList = response.data && response.data.ExternalOrderAttachmentList;
                    let outsourceDetailsList = response.data && response.data.OutsourceDetailsList;
                    if (subSample) {
                        let oldSelectedSubSample = inputData.masterData.selectedSubSample
                        fillRecordBasedOnCheckBoxSelection(inputData.masterData, response.data,
                            inputData.childTabsKey, inputData.checkBoxOperation, "npreregno",
                            inputData.removeElementFromArray);
                        masterData = {
                            ...inputData.masterData,
                            selectedSample: inputData.selectedSample,
                            selectedPreregno: inputData.npreregno,
                            selectedSubSample: inputData.masterData.RegistrationGetSubSample.length > 0 ?
                                [inputData.masterData.RegistrationGetSubSample[0]] : [],
                            activeTabIndex: inputData.activeTabIndex,
                        }
                        let RegistrationTestComment = [];
                        let RegistrationTestAttachment = [];
                        let RegistrationParameter = [];
                        let RegistrationComment = [];
                        //if (inputData.checkBoxOperation === 1 || inputData.checkBoxOperation === 7) {  
                        //if (inputData.checkBoxOperation === 1) {
                        if (inputData.checkBoxOperation === checkBoxOperation.MULTISELECT) {

                            const wholeSubSampleList = masterData.RegistrationGetSubSample.map(b => b.ntransactionsamplecode)
                            // START ALPD-3625 VISHAKH
                            // oldSelectedSubSample.forEach((subsample, index) => {
                            //     if (!wholeSubSampleList.includes(subsample.ntransactionsamplecode)) {
                            //         oldSelectedSubSample.splice(index, 1)
                            //     }

                            // })
                            oldSelectedSubSample = oldSelectedSubSample.filter(item =>
                                wholeSubSampleList.includes(item.ntransactionsamplecode)
                            );
                            // END ALPD-3625 VISHAKH
                            if (oldSelectedSubSample.length > 0) {
                                masterData = {
                                    ...masterData,
                                    selectedSubSample: oldSelectedSubSample
                                }
                            }
                            const selectedTest = getSameRecordFromTwoArrays(oldSelectedTest,
                                masterData.selectedSubSample, 'npreregno')
                            masterData = {
                                ...masterData,
                                selectedTest
                            }
                        }
                        //  if (inputData.checkBoxOperation === 7) {
                        if (inputData.checkBoxOperation === checkBoxOperation.QUICKSELECTALL) {
                            // masterData = {
                            //     ...masterData,
                            //     APSelectedTest:responseData.APSelectedTest,
                            //     AP_TEST:responseData.AP_TEST,
                            //     ApprovalParameter:responseData.ApprovalParameter ? responseData.ApprovalParameter.length > 0  ? responseData.ApprovalParameter : masterData.ApprovalParameter: masterData.ApprovalParameter
                            // }

                            switch (inputData.activeTestTab) {
                                case "IDS_TESTCOMMENTS":
                                    let ResponseData = response.data.RegistrationTestComment ? response.data.RegistrationTestComment : [];
                                    let RegistrationTestComment1 = [];
                                    if (inputData.masterData.RegistrationTestComment !== undefined) {
                                        RegistrationTestComment1 = [...inputData.masterData.RegistrationTestComment, ...ResponseData];
                                    }
                                    let ntransactiontestcode = inputData.masterData.RegistrationGetTest.length > 0 ? inputData.masterData.RegistrationGetTest[0].ntransactiontestcode : -1
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
                                        let ntransactiontestcode = inputData.masterData.RegistrationGetTest.length > 0 ? inputData.masterData.RegistrationGetTest[0].ntransactiontestcode : -1
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
                                    let ntransactionTestCode = inputData.masterData.RegistrationGetTest.length > 0 ? inputData.masterData.RegistrationGetTest[0].ntransactiontestcode : -1
                                    RegistrationTestComment = getRecordBasedOnPrimaryKeyName(RegistrationTestComment2, ntransactionTestCode, "ntransactiontestcode");
                                    activeName = "RegistrationParameter"
                                    dataStateName = "resultDataState"
                                    break;
                            }
                            masterData['RegistrationTestComment'] = RegistrationTestComment;
                            masterData['RegistrationTestAttachment'] = RegistrationTestAttachment;
                            masterData["RegistrationParameter"] = RegistrationParameter;
                            masterData["RegistrationComment"] = RegistrationComment;
                        }
                        //if (inputData.checkBoxOperation === 3 || inputData.checkBoxOperation === 5) {
                        if (inputData.checkBoxOperation === checkBoxOperation.SINGLESELECT || inputData.checkBoxOperation === checkBoxOperation.QUICKSELECTSTATUS) {
                            masterData = {
                                ...masterData,
                                selectedTest: masterData.RegistrationGetTest.length > 0 ? [masterData.RegistrationGetTest[0]] : []
                            }

                            switch (inputData.activeTestTab) {
                                case "IDS_TESTCOMMENTS":
                                    let ResponseData = response.data.RegistrationTestComment ? response.data.RegistrationTestComment : [];
                                    let RegistrationTestComment1 = [];
                                    if (inputData.masterData.RegistrationTestComment !== undefined) {
                                        RegistrationTestComment1 = [
                                            // ...inputData.masterData.RegistrationTestComment, 
                                            ...ResponseData];
                                    }
                                    let ntransactiontestcode = inputData.masterData.RegistrationGetTest.length > 0 ? inputData.masterData.RegistrationGetTest[0].ntransactiontestcode : -1
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
                                        let ntransactiontestcode = inputData.masterData.RegistrationGetTest.length > 0 ? inputData.masterData.RegistrationGetTest[0].ntransactiontestcode : -1
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
                                    let ntransactionTestCode = inputData.masterData.RegistrationGetTest.length > 0 ? inputData.masterData.RegistrationGetTest[0].ntransactiontestcode : -1
                                    RegistrationTestComment = getRecordBasedOnPrimaryKeyName(RegistrationTestComment2, ntransactionTestCode, "ntransactiontestcode");
                                    activeName = "RegistrationParameter"
                                    dataStateName = "resultDataState"
                                    break;
                            }
                            masterData['RegistrationTestComment'] = RegistrationTestComment;
                            masterData['RegistrationTestAttachment'] = RegistrationTestAttachment;
                            masterData["RegistrationParameter"] = RegistrationParameter;
                            masterData["RegistrationComment"] = RegistrationComment;

                        }
                        masterData['ExternalOrderAttachmentList'] = externalOrderAttachmentList;
                        masterData['OutsourceDetailsList'] = outsourceDetailsList;
                        let { testskip, testtake, subsampleskip, subsampletake } = inputData
                        // let bool = false;
                        // Commented bool value because no need to check bool condition to update skipInfo value.
                        // if (inputData.masterData.RegistrationGetSubSample.length < inputData.subsampleskip) {
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
                            inputData.childTabsKey, inputData.checkBoxOperation, "npreregno",
                            inputData.removeElementFromArray);
                        masterData = {
                            ...inputData.masterData,
                            selectedSample: inputData.selectedSample,
                            selectedPreregno: inputData.npreregno,
                            selectedTest: inputData.masterData.RegistrationGetTest.length > 0 ?
                                [inputData.masterData.RegistrationGetTest[0]] : [],
                            selectedSubSample: inputData.masterData.RegistrationGetSubSample,
                        }
                        let RegistrationTestComment = [];
                        let RegistrationParameter = [];
                        let RegistrationTestAttachment = [];
                        let RegistrationComment = [];

                        //if (inputData.checkBoxOperation === 7 || inputData.checkBoxOperation === 1) {
                        if (inputData.checkBoxOperation === checkBoxOperation.QUICKSELECTALL || inputData.checkBoxOperation === checkBoxOperation.MULTISELECT) {
                            const wholeTestList = masterData.RegistrationGetTest.map(b => b.ntransactiontestcode)
                            // START ALPD-3625 VISHAKH
                            // oldSelectedTest.forEach((test, index) => {
                            //     if (!wholeTestList.includes(test.ntransactiontestcode)) {
                            //         oldSelectedTest.splice(index, 1)
                            //     }

                            // })
                            oldSelectedTest = oldSelectedTest.filter(item =>
                                wholeTestList.includes(item.ntransactiontestcode)
                            );
                            // START ALPD-3625 VISHAKH
                            let keepOld = false;
                            let ntransactiontestcode;
                            let npreregno;
                            if (oldSelectedTest.length > 0) {
                                keepOld = true
                                masterData = {
                                    ...masterData,
                                    selectedTest: oldSelectedTest,
                                }
                            } else {
                                ntransactiontestcode = inputData.masterData.RegistrationGetTest.length > 0 ?
                                    inputData.masterData.RegistrationGetTest[0].ntransactiontestcode : ""
                                npreregno = inputData.masterData.RegistrationGetSample.length > 0 ?
                                    inputData.masterData.RegistrationGetSample[0].npreregno : ""
                            }
                            switch (inputData.activeTestTab) {
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
                            }
                        }
                        //else if (inputData.checkBoxOperation === 5) {
                        else if (inputData.checkBoxOperation === checkBoxOperation.QUICKSELECTSTATUS) {
                            switch (inputData.activeTestTab) {
                                case "IDS_TESTCOMMENTS":
                                    let ResponseData = response.data.RegistrationTestComment ? response.data.RegistrationTestComment : [];
                                    let RegistrationTestComment1 = [];
                                    if (inputData.masterData.RegistrationTestComment !== undefined) {
                                        RegistrationTestComment1 = [...inputData.masterData.RegistrationTestComment, ...ResponseData];
                                    }
                                    let ntransactiontestcode = inputData.masterData.RegistrationGetTest.length > 0 ? inputData.masterData.RegistrationGetTest[0].ntransactiontestcode : -1
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
                                        let ntransactiontestcode = inputData.masterData.RegistrationGetTest.length > 0 ? inputData.masterData.RegistrationGetTest[0].ntransactiontestcode : -1
                                        RegistrationTestAttachment = getRecordBasedOnPrimaryKeyName(RegistrationTestAttachment1, ntransactiontestcode, "ntransactiontestcode");
                                        activeName = "RegistrationTestAttachment"
                                        dataStateName = "testCommentDataState"

                                    }
                                    break;
                                case "IDS_PARAMETERRESULTS":
                                    let resultResponseData = response.data.RegistrationParameter ? response.data.RegistrationParameter : [];
                                    let RegistrationParameter1 = [...inputData.masterData.RegistrationParameter, ...resultResponseData];
                                    let ntransactiontestcode1 = inputData.masterData.RegistrationGetTest.length > 0 ? inputData.masterData.RegistrationGetTest[0].ntransactiontestcode : -1
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
                                    let ntransactionTestCode = inputData.masterData.RegistrationGetTest.length > 0 ? inputData.masterData.RegistrationGetTest[0].ntransactiontestcode : -1
                                    RegistrationTestComment = getRecordBasedOnPrimaryKeyName(RegistrationTestComment2, ntransactionTestCode, "ntransactiontestcode");
                                    activeName = "RegistrationParameter"
                                    dataStateName = "resultDataState"
                                    break;
                            }
                            // RegistrationTestComment = response.data.RegistrationTestComment ? [...response.data.RegistrationTestComment] : [];
                        }
                        else {
                            switch (inputData.activeTestTab) {
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
                            }
                        }
                        masterData['RegistrationTestComment'] = RegistrationTestComment;
                        masterData["RegistrationParameter"] = RegistrationParameter;
                        masterData['RegistrationTestAttachment'] = RegistrationTestAttachment;
                        masterData['RegistrationComment'] = RegistrationComment;
                        let { testskip, testtake } = inputData
                        let bool = false;

                        if (inputData.masterData.RegistrationGetTest.length < inputData.testskip) {
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
                    } else if (error.response?.status === 401 || error.response?.status === 403) {
                        dispatch({
                            type: UN_AUTHORIZED_ACCESS,
                            payload: {
                                navigation: 'forbiddenaccess',
                                loading: false,
                                responseStatus: error.response.status
                            }
                        });
                    } else if (error.response?.status === 500) {
                        toast.error(error.message);
                    } else {
                        toast.warn(error.response.data);
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
                TestSelected = getRecordBasedOnPrimaryKeyName(inputData.masterData.selectedTest, inputData.removeElementFromArray[0].npreregno, "npreregno");
                subSampleSelected = getRecordBasedOnPrimaryKeyName(inputData.masterData.selectedSubSample, inputData.removeElementFromArray[0].npreregno, "npreregno");
            }
            else {
                TestSelected = filterRecordBasedOnPrimaryKeyName(inputData.masterData.selectedTest, inputData.removeElementFromArray[0].npreregno, "npreregno");
                subSampleSelected = filterRecordBasedOnPrimaryKeyName(inputData.masterData.selectedSubSample, inputData.removeElementFromArray[0].npreregno, "npreregno");
            }

            if (TestSelected.length > 0) {
                isGrandChildGetRequired = false;
            } else {
                isGrandChildGetRequired = true;
            }
            fillRecordBasedOnCheckBoxSelection(inputData.masterData, inputData.selectedSample, inputData.childTabsKey, inputData.checkBoxOperation, "npreregno", inputData.removeElementFromArray);
            if (isGrandChildGetRequired) {
                let selectedSample = inputData.selectedSample;
                let filterTestSameOldSelectedTest = getSameRecordFromTwoArrays(oldSelectedTest, inputData.masterData.RegistrationGetTest, "ntransactiontestcode");
                let selectedTest = filterTestSameOldSelectedTest.length > 0 ? filterTestSameOldSelectedTest :
                    inputData.masterData.RegistrationGetTest.length > 0 ? [inputData.masterData.RegistrationGetTest[0]] : [];
                let ntransactiontestcode = selectedTest.length > 0 ? selectedTest.map(x => x.ntransactiontestcode).join(",") : "-1";
                let selectedSubSample = inputData.masterData.RegistrationGetSubSample

                if (subSample) {
                    let filterSelectedSubSample = getSameRecordFromTwoArrays(oldSelectedSubSample, inputData.masterData.RegistrationGetSubSample, "ntransactionsamplecode");
                    selectedSubSample = filterSelectedSubSample.length > 0 ? filterSelectedSubSample : [inputData.masterData.RegistrationGetSubSample[0]];
                    if (inputData.masterData.RegistrationGetSubSample.length <= inputData.subsampleskip) {
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
                if (inputData.masterData.RegistrationGetTest.length <= inputData.testskip) {
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
                    ...inputData, childTabsKey: ["RegistrationTestComment", "RegistrationParameter", "RegistrationTestAttachment"], ntransactiontestcode, masterData, selectedTest,
                    selectedSubSample, checkBoxOperation: checkBoxOperation.SINGLESELECT, skipInfo, masterData
                }
                if (subSample) {
                    if (selectedTest.length === 0) {
                        inputData["npreregno"] = selectedSubSample.map(x => x.npreregno).join(",")
                        inputData["ntransactionsamplecode"] = selectedSubSample.map(x => x.ntransactionsamplecode).join(",")
                        // inputData["checkBoxOperation"] = 3
                        inputData["checkBoxOperation"] = checkBoxOperation.SINGLESELECT
                        inputData["childTabsKey"] = ["RegistrationGetTest"]
                        dispatch(getRegistrationTestDetail(inputData, true));
                    } else {
                        dispatch(getTestChildTabDetailRegistration(inputData, true));
                    }
                } else {
                    dispatch(getTestChildTabDetailRegistration(inputData, true));
                }
            }
            else {
                let masterData = {
                    ...inputData.masterData,
                    selectedSample: inputData.selectedSample,
                    selectedPreregno: inputData.npreregno,
                    selectedTest: TestSelected ? TestSelected : inputData.masterData.RegistrationGetTest.length > 0 ? [inputData.masterData.RegistrationGetTest[0]] : [],
                    // RegistrationTestComment,
                    selectedSubSample: subSampleSelected ? subSampleSelected : inputData.masterData.RegistrationGetSubSample
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
                    let SubSampleSelected = getRecordBasedOnPrimaryKeyName(inputData.masterData.selectedSubSample, inputData.removeElementFromArray[0].npreregno, "npreregno");
                    if (SubSampleSelected.length > 0) {
                        let filterSelectedSubSample = getSameRecordFromTwoArrays(oldSelectedSubSample, inputData.masterData.RegistrationGetSubSample, "ntransactionsamplecode");
                        if (filterSelectedSubSample.length === 0) {
                            let wholeSubSample = masterData.RegistrationGetSubSample.map(b => b.ntransactionsamplecode)
                            // START ALPD-3625 VISHAKH
                            // oldSelectedSubSample.forEach((test, index) => {
                            //     if (!wholeSubSample.includes(test.ntransactionsamplecode)) {
                            //         oldSelectedSubSample.splice(index, 1)
                            //     }
                            //     return null;
                            // })
                            oldSelectedSubSample = oldSelectedSubSample.filter(item =>
                                wholeSubSample.includes(item.ntransactionsamplecode)
                            );
                            // END ALPD-3625 VISHAKH
                            if (oldSelectedSubSample.length === 0 && wholeSubSample.length > 0
                                && masterData.selectedTest.length === 0) {
                                const selectedSubSample1 = [inputData.masterData.RegistrationGetSubSample[0]];
                                masterData = {
                                    ...masterData,
                                    selectedSubSample: selectedSubSample1,
                                    selectedTest: []
                                }
                                inputData = { ...inputData, ...masterData }
                                inputData["npreregno"] = selectedSubSample1.map(x => x.npreregno).join(",")
                                inputData["ntransactionsamplecode"] = selectedSubSample1.map(x => x.ntransactionsamplecode).join(",")
                                // inputData["checkBoxOperation"] = 3
                                inputData["checkBoxOperation"] = checkBoxOperation.SINGLESELECT
                                inputData["childTabsKey"] = ["RegistrationGetTest"]
                                subsamplecheck = false;
                                dispatch(getRegistrationTestDetail(inputData, true));

                            }
                        } else {
                            oldSelectedSubSample = filterSelectedSubSample
                        }

                    } else {
                        let wholeSubSample = masterData.RegistrationGetSubSample.map(b => b.ntransactionsamplecode)
                        // START ALPD-3625 VISHAKH
                        // oldSelectedSubSample.forEach((test, index) => {
                        //     if (!wholeSubSample.includes(test.ntransactionsamplecode)) {
                        //         oldSelectedSubSample.splice(index, 1)
                        //     }
                        //     return null;
                        // })
                        oldSelectedSubSample = oldSelectedSubSample.filter(item =>
                            wholeSubSample.includes(item.ntransactionsamplecode)
                        );
                        // END ALPD-3625 VISHAKH
                    }

                    if (subsamplecheck) {
                        masterData = {
                            ...masterData,
                            selectedSubSample: oldSelectedSubSample
                        }
                    }
                    if (inputData.masterData.RegistrationGetSubSample.length <= inputData.subsampleskip) {
                        subsampleskip = 0;
                        skipInfo = { subsampleskip, subsampletake }
                    }
                }
                let wholeTestList = masterData.RegistrationGetTest.map(b => b.ntransactiontestcode)
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
                        selectedTest: oldSelectedTest
                    }
                } else {
                    ntransactiontestcode = inputData.masterData.RegistrationGetTest.length > 0 ? inputData.masterData.RegistrationGetTest[0].ntransactiontestcode : "-1"
                }
                masterData["RegistrationTestComment"] = keepOld ? inputData.masterData.RegistrationTestComment : getRecordBasedOnPrimaryKeyName(inputData.masterData.RegistrationTestComment, ntransactiontestcode, "ntransactiontestcode")
                masterData["RegistrationParameter"] = keepOld ? inputData.masterData.RegistrationParameter : getRecordBasedOnPrimaryKeyName(inputData.masterData.RegistrationParameter, ntransactiontestcode, "ntransactiontestcode")
                let skipInfo = {};
                if (inputData.masterData.RegistrationGetTest.length <= inputData.testskip) {
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
}

export function getRegistrationTestDetail(inputData, isServiceRequired) {
    return function (dispatch) {
        let inputParamData = {
            nsampletypecode: inputData.nsampletypecode,
            nregtypecode: inputData.nregtypecode,
            nregsubtypecode: inputData.nregsubtypecode,
            npreregno: inputData.npreregno,
            ntransactionsamplecode: inputData.ntransactionsamplecode,
            ntransactionstatus: inputData.ntransactionstatus,
            napprovalconfigcode: inputData.napprovalconfigcode,
            activeTestTab: inputData.activeTestTab,
            activeSampleTab: inputData.activeSampleTab,
            activeSubSampleTab: inputData.activeSubSampleTab,
            userinfo: inputData.userinfo,
            ndesigntemplatemappingcode: inputData.ndesigntemplatemappingcode,
            checkBoxOperation: inputData.checkBoxOperation,
            nneedsubsample: inputData.nneedsubsample,
            selectedTransactionsamplecode: inputData.selectedSubSample && inputData.selectedSubSample.length > 0 && inputData.selectedSubSample.map(item => item.ntransactionsamplecode).join(","),
            noutsourcerequired: inputData.masterData && inputData.masterData.RealSampleTypeValue ? inputData.masterData.RealSampleTypeValue.noutsourcerequired : transactionStatus.NA

        }
        const subSample = inputData.nneedsubsample;
        let activeName = "";
        let dataStateName = "";
        dispatch(initRequest(true));
        if (isServiceRequired) {
            rsapi().post("registration/getRegistrationTest", inputParamData)
                .then(response => {
                    //sortData(response.data);
                    //ALPD-1609
                    sortData(response.data, 'descending', 'npreregno')
                    let oldSelectedTest = inputData.masterData.selectedTest || []
                    let oldSelectedSubSample = inputData.masterData.selectedSubSample || []
                    let outsourceDetailsList = response.data && response.data.OutsourceDetailsList;
                    fillRecordBasedOnCheckBoxSelection(inputData.masterData, response.data,
                        inputData.childTabsKey, inputData.checkBoxOperation, "ntransactionsamplecode",
                        inputData.removeElementFromArray);
                    let masterData = {
                        ...inputData.masterData,
                        selectedSubSample: inputData.selectedSubSample,
                        selectedTransactionsamplecode: inputData.ntransactionsamplecode,
                        selectedTest: inputData.masterData.RegistrationGetTest.length > 0 ?
                            [inputData.masterData.RegistrationGetTest[0]] : [],
                        // RegistrationTestComment,
                    }

                    //let wholeRegistrationTestComments = [];
                    let RegistrationTestComment = [];
                    let RegistrationTestAttachment = [];
                    let RegistrationParameter = [];
                    let RegistrationSampleComment = [];
                    let RegistrationSampleAttachment = [];
                    //if (inputData.checkBoxOperation === 1) {
                    if (inputData.checkBoxOperation === checkBoxOperation.MULTISELECT) {
                        const wholeTestList = masterData.RegistrationGetTest.map(b => b.ntransactiontestcode)
                        // START ALPD-3625 VISHAKH
                        // oldSelectedTest.forEach((test, index) => {
                        //     if (!wholeTestList.includes(test.ntransactiontestcode)) {
                        //         oldSelectedTest.splice(index, 1)
                        //     }

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
                            ntransactiontestcode = inputData.masterData.RegistrationGetTest.length > 0 ?
                                inputData.masterData.RegistrationGetTest[0].ntransactiontestcode : ""
                        }
                        switch (inputData.activeTestTab) {
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



                    }
                    // else if (inputData.checkBoxOperation === 5) {
                    else if (inputData.checkBoxOperation === checkBoxOperation.QUICKSELECTSTATUS) {
                        switch (inputData.activeTestTab) {
                            case "IDS_TESTCOMMENTS":
                                let ResponseData = response.data.RegistrationTestComment ? response.data.RegistrationTestComment : [];
                                let RegistrationTestComment1 = [];
                                if (inputData.masterData.RegistrationTestComment !== undefined) {
                                    RegistrationTestComment1 = [...inputData.masterData.RegistrationTestComment, ...ResponseData];
                                }
                                let ntransactiontestcode = inputData.masterData.RegistrationGetTest.length > 0 ? inputData.masterData.RegistrationGetTest[0].ntransactiontestcode : -1
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
                                    let ntransactiontestcode = inputData.masterData.RegistrationGetTest.length > 0 ? inputData.masterData.RegistrationGetTest[0].ntransactiontestcode : -1
                                    RegistrationTestAttachment = getRecordBasedOnPrimaryKeyName(RegistrationTestAttachment1, ntransactiontestcode, "ntransactiontestcode");
                                    activeName = "RegistrationTestAttachment"
                                    dataStateName = "testCommentDataState"
                                }
                                break;
                            case "IDS_PARAMETERRESULTS":
                                let resultResponseData = response.data.RegistrationParameter ? response.data.RegistrationParameter : [];
                                let RegistrationParameter1 = [...inputData.masterData.RegistrationParameter, ...resultResponseData];
                                let ntransactiontestcode1 = inputData.masterData.RegistrationGetTest.length > 0 ? inputData.masterData.RegistrationGetTest[0].ntransactiontestcode : -1
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
                                let ntransactionTestCode = inputData.masterData.RegistrationGetTest.length > 0 ? inputData.masterData.RegistrationGetTest[0].ntransactiontestcode : -1
                                RegistrationTestComment = getRecordBasedOnPrimaryKeyName(RegistrationTestComment2, ntransactionTestCode, "ntransactiontestcode");
                                activeName = "RegistrationParameter"
                                dataStateName = "resultDataState"
                                break;
                        }
                        // RegistrationTestComment = response.data.RegistrationTestComment ? [...response.data.RegistrationTestComment] : [];
                    }
                    // else if (inputData.checkBoxOperation === 7) {
                    else if (inputData.checkBoxOperation === checkBoxOperation.QUICKSELECTALL) {
                        let testList = reArrangeArrays(inputData.masterData.RegistrationGetSubSample, response.data.RegistrationGetTest, "ntransactionsamplecode");
                        masterData = {
                            ...masterData,
                            selectedTest: testList ? testList.length > 0 ? [testList[0]] : [] : [],
                            RegistrationGetTest: testList ? testList.length > 0 ? testList : [] : [],
                            //ApprovalParameter:responseData.ApprovalParameter ? responseData.ApprovalParameter.length > 0  ? responseData.ApprovalParameter : masterData.ApprovalParameter: masterData.ApprovalParameter
                        }

                        switch (inputData.activeTestTab) {
                            case "IDS_TESTCOMMENTS":
                                let ResponseData = response.data.RegistrationTestComment ? response.data.RegistrationTestComment : [];
                                let RegistrationTestComment1 = [];
                                if (inputData.masterData.RegistrationTestComment !== undefined) {
                                    RegistrationTestComment1 = [...inputData.masterData.RegistrationTestComment, ...ResponseData];
                                }
                                let ntransactiontestcode = inputData.masterData.RegistrationGetTest.length > 0 ? inputData.masterData.RegistrationGetTest[0].ntransactiontestcode : -1
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
                                    let ntransactiontestcode = inputData.masterData.RegistrationGetTest.length > 0 ? inputData.masterData.RegistrationGetTest[0].ntransactiontestcode : -1
                                    RegistrationTestAttachment = getRecordBasedOnPrimaryKeyName(RegistrationTestAttachment1, ntransactiontestcode, "ntransactiontestcode");
                                    activeName = "RegistrationTestAttachment"
                                    dataStateName = "testCommentDataState"
                                }
                                break;
                            case "IDS_PARAMETERRESULTS":
                                let resultResponseData = response.data.RegistrationParameter ? response.data.RegistrationParameter : [];
                                // let RegistrationParameter1 = [...inputData.masterData.RegistrationParameter, ...resultResponseData];
                                let RegistrationParameter1 = [...resultResponseData];
                                let ntransactiontestcode1 = testList ? testList.length > 0 ? testList[0].ntransactiontestcode : inputData.masterData.RegistrationGetTest.length > 0 ? inputData.masterData.RegistrationGetTest[0].ntransactiontestcode : -1 : -1

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
                                let ntransactionTestCode = inputData.masterData.RegistrationGetTest.length > 0 ? inputData.masterData.RegistrationGetTest[0].ntransactiontestcode : -1
                                RegistrationTestComment = getRecordBasedOnPrimaryKeyName(RegistrationTestComment2, ntransactionTestCode, "ntransactiontestcode");
                                activeName = "RegistrationParameter"
                                dataStateName = "resultDataState"
                                break;
                        }
                        // RegistrationTestComment = response.data.RegistrationTestComment ? [...response.data.RegistrationTestComment] : [];
                    }
                    else {
                        switch (inputData.activeTestTab) {
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
                        }
                    }
                    if (subSample) {
                        let wholeSubsampleList = masterData.RegistrationGetSubSample.map(b => b.ntransactionsamplecode)
                        // START ALPD-3625 VISHAKH
                        // oldSelectedSubSample.map((test, index) => {
                        //     if (!wholeSubsampleList.includes(test.ntransactionsamplecode)) {
                        //         oldSelectedSubSample.splice(index, 1)
                        //     }
                        //     return null;
                        // })
                        oldSelectedSubSample = oldSelectedSubSample.filter(item =>
                            wholeSubsampleList.includes(item.ntransactionsamplecode)
                        );
                        // END ALPD-3625 VISHAKH
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
                    masterData['RegistrationTestComment'] = RegistrationTestComment;
                    masterData['RegistrationTestAttachment'] = RegistrationTestAttachment;
                    masterData["RegistrationParameter"] = RegistrationParameter;
                    masterData["RegistrationSampleComment"] = RegistrationSampleComment;
                    masterData["RegistrationSampleAttachment"] = RegistrationSampleAttachment;
                    masterData['OutsourceDetailsList'] = outsourceDetailsList;
                    let { testskip, testtake, subsampleskip, subsampletake } = inputData
                    // let bool = false;
                    // Commented bool value because no need to check bool condition to update skipInfo value.
                    let skipInfo = {}
                    // if (inputData.masterData.RegistrationGetTest.length < inputData.testskip) {
                    testskip = 0;
                    // bool = true
                    // }
                    if (inputData.masterData.RegistrationGetSubSample.length < inputData.subsampleskip) {
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
                    } else if (error.response?.status === 401 || error.response?.status === 403) {
                        dispatch({
                            type: UN_AUTHORIZED_ACCESS,
                            payload: {
                                navigation: 'forbiddenaccess',
                                loading: false,
                                responseStatus: error.response.status
                            }
                        });
                    } else if (error.response?.status === 500) {
                        toast.error(error.message);
                    } else {
                        toast.warn(error.response.data);
                    }
                })
        } else {
            let oldSelectedTest = inputData.masterData.selectedTest
            // START ALPD-3625 VISHAKH
            // let TestSelected = getRecordBasedOnPrimaryKeyName(inputData.masterData.selectedTest, inputData.removeElementFromArray[0].npreregno, "npreregno");
            let TestSelected = filterRecordBasedOnPrimaryKeyName(inputData.masterData.selectedTest, inputData.removeElementFromArray[0].ntransactionsamplecode, "ntransactionsamplecode");
            let isGrandChildGetRequired = false;
            if (TestSelected.length > 0) {
                isGrandChildGetRequired = false;
            } else {
                isGrandChildGetRequired = true;
            }
            // END ALPD-3625 VISHAKH
            fillRecordBasedOnCheckBoxSelection(inputData.masterData, inputData.selectedSubSample, inputData.childTabsKey, inputData.checkBoxOperation, "ntransactionsamplecode", inputData.removeElementFromArray);
            if (isGrandChildGetRequired) {
                let ntransactiontestcode = inputData.masterData.RegistrationGetTest.length > 0 ? inputData.masterData.RegistrationGetTest[0].ntransactiontestcode.toString() : "-1";
                let selectedSubSample = inputData.selectedSubSample;
                // let selectedPreregno = inputData.npreregno;
                let selectedTest = inputData.masterData.RegistrationGetTest.length > 0 ? [inputData.masterData.RegistrationGetTest[0]] : [];
                // let selectedSubSample = inputData.masterData.RegistrationGetSubSample
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
                    ...inputData, childTabsKey: ["RegistrationTestAttachment", "RegistrationTestComment", "RegistrationParameter"], ntransactiontestcode, masterData, selectedTest,
                    selectedSubSample, checkBoxOperation: checkBoxOperation.SINGLESELECT, activeTabIndex: inputData.masterData.activeTabIndex
                }
                dispatch(getTestChildTabDetailRegistration(inputData, true));
            } else {
                let masterData = {
                    ...inputData.masterData,
                    selectedSubSample: inputData.selectedSubSample,
                    selectedTransactioncode: inputData.ntransactionsamplecode,
                    selectedTest: inputData.masterData.RegistrationGetTest.length > 0 ?
                        [inputData.masterData.RegistrationGetTest[0]] : [],
                }
                // START ALPD-3671 VISHAKH
                if (inputData.searchTestRef !== undefined && inputData.searchTestRef.current !== null) {
                    inputData.searchTestRef.current.value = ""
                    masterData['searchedTest'] = undefined
                }
                // END ALPD-3671 VISHAKH
                const wholeTestList = masterData.RegistrationGetTest.map(b => b.ntransactiontestcode)
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
                    ntransactiontestcode = inputData.masterData.RegistrationGetTest.length > 0 ?
                        inputData.masterData.RegistrationGetTest[0].ntransactiontestcode : "-1"
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

export function acceptRegistration(inputParam, LoginProps) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("/registration/acceptRegistration", inputParam.inputData)
            .then(response => {
                if (response.data.rtn === undefined || response.data.rtn === "Success"
                    || response.data.rtn === "IDS_ATLEASTONETESTMUSTBEPREREGISTER"
                    || response.data.rtn === "IDS_ALLSAMPLESAREREGISTERED" || response.data.rtn === "IDS_SELECTPREREGISTERORQUARANTINESAMPLES") {
                    // if (response.data["isPortalData"] && response.data["PortalStatus"] && response.data["PortalStatus"].length > 0) {
                    //     dispatch(UpdateExternalOrderStatus(response.data["PortalStatus"], inputParam));
                    // }

                    replaceUpdatedObject(response.data["RegistrationGetSample"], LoginProps.RegistrationGetSample, "npreregno");
                    replaceUpdatedObject(response.data["RegistrationGetSubSample"], LoginProps.RegistrationGetSubSample, "ntransactionsamplecode");
                    replaceUpdatedObject(response.data["RegistrationGetTest"], LoginProps.RegistrationGetTest, "ntransactiontestcode");

                    delete response.data["RegistrationGetSample"];
                    delete response.data["RegistrationGetSubSample"];
                    delete response.data["RegistrationGetTest"];
                    let masterData = {
                        ...LoginProps, ...response.data,
                        selectedSample: replaceUpdatedObject(response.data["selectedSample"], LoginProps.selectedSample, "npreregno"),
                        selectedSubSample: replaceUpdatedObject(response.data["selectedSubSample"], LoginProps.selectedSubSample, "ntransactionsamplecode"),
                        selectedTest: replaceUpdatedObject(response.data["selectedTest"], LoginProps.selectedTest, "ntransactiontestcode"),
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
                    if (response.data.rtn === "IDS_ATLEASTONETESTMUSTBEPREREGISTER"
                        || response.data.rtn === "IDS_ALLSAMPLESAREREGISTERED"
                        || response.data.rtn === "IDS_SELECTPREREGISTERORQUARANTINESAMPLES") {
                        toast.info(intl.formatMessage({ id: response.data.rtn }));
                    }
                } else {
                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {
                            loading: false,
                            loadEsign: false,
                            openModal: false,
                        }
                    });
                    toast.info(intl.formatMessage({ id: response.data.rtn }));
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
                } else if (error.response?.status === 500) {
                    toast.error(error.message);
                } else {
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

export const addMoreTest = (inputParam, ncontrolCode) => {
    return (dispatch) => {
        /// console.log("adMoreTst:",inputParam);
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
                                    //  ALPD-5808   Changed service call from getMoreTest to getTestfromDB by Vishakh
                                    const TestGet = rsapi().post("/registration/getTestfromDB", {
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
                                                    specBasedComponent: inputParam.specBasedComponent,
                                                    loadPrinter: false, TestSection: TestSectionData, AllSection: TestSectionData
                                                }
                                            });
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
                                            } else if (error.response?.status === 500) {
                                                toast.error(error.message);
                                            } else {
                                                toast.warn(error.response.data);
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

export const createRegistrationTest = (inputParam, masterData, modalName) => {
    return (dispatch) => {
        dispatch(initRequest(true));
        rsapi().post(inputParam.classUrl + "/" + inputParam.operation + inputParam.methodUrl, { ...inputParam.inputData })
            .then(response => {
                let RegistrationGetTest = updatedObjectWithNewElement(masterData["RegistrationGetTest"], response.data["RegistrationGetTest"]);

                //let RegistrationGetSubSample = updatedObjectWithNewElement(masterData["RegistrationGetSubSample"], response.data["RegistrationGetSubSample"]);
                masterData = {
                    ...masterData,
                    RegistrationGetTest: sortData(RegistrationGetTest, "descending", "ntransactiontestcode"),
                    RegistrationGetSubSample: sortData(response.data["RegistrationGetSubSample"], "descending", "ntransactionsamplecode"),
                    selectedTest: response.data["RegistrationGetTest"],
                    //  selectedSubSample: response.data["RegistrationGetSubSample"],
                    selectedSubSample: response.data["selectedSubSample"],
                    RegistrationParameter: response.data.RegistrationParameter,
                    RegistrationGetSample: replaceUpdatedObject(response.data.selectedSample, masterData.RegistrationGetSample, 'npreregno'),
                    RegistrationTestPackage:sortData(response.data.RegistrationTestPackage, "descending", "nregistrationtestpackagecode")
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
                } else if (error.response?.status === 500) {
                    toast.error(error.message);
                } else {
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

export function getEditRegistrationComboService(inputParam, columnList,
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
            inputParam.editRegParam["getSampleChildDetail"] = true;
        }
        masterData["selectedSample"] = [];
        masterData["selectedSample"].push(inputParam["mastertoedit"]);

        const npreregno = inputParam.mastertoedit[inputParam.primaryKeyName];
        let urlArray = [];

        const timeZoneService = rsapi().post("timezone/getTimeZone");
        // const actualService = rsapi().post("dynamicpreregdesign/getComboValues", {
        //     parentcolumnlist: columnList,
        //     childcolumnlist: childColumnList,
        //     userinfo: userInfo
        // })
        const selectedRegistration = rsapi().post("/registration/getEditRegistrationDetails", {
            ...inputParam.editRegParam, npreregno, parentcolumnlist: parentColumnList,
            childcolumnlist: childColumnList,
            userinfo: userInfo, nallottedspeccode: inputParam.mastertoedit.nallottedspeccode || -1
        })

        const dateService = rsapi().post("dynamicpreregdesign/dateValidation", {
            datecolumnlist: withoutCombocomponent.filter(x => x.inputtype === "date"),
            userinfo: userInfo
        })

        urlArray = [timeZoneService, selectedRegistration, dateService]

        Axios.all(urlArray)
            .then(response => {
                let selectedRecord = { ...response[1].data["EditData"] };
                selectedRecord = { ...selectedRecord, ...selectedRecord['jsondata'] }
                // const recordToEdit = { ...response[2].data["SelectedRegistration"][0] };
                //  const currentTime = rearrangeDateFormat(userInfo, response[6].data);



                const timeZoneMap = constructOptionList(response[0].data || [], "ntimezonecode", "stimezoneid", undefined, undefined, true);
                const timeZoneList = timeZoneMap.get("OptionList");
                const defaultTimeZone = { label: userInfo.stimezoneid, value: userInfo.ntimezonecode }


                //  const newcomboData = parentChildComboLoad(columnList, response[1].data,
                // selectedRecord, childColumnList, withoutCombocomponent)

                if (selectedRecord.ntransactionstatus === transactionStatus.CANCELLED
                    || selectedRecord.ntransactionstatus === transactionStatus.REJECT) {
                    toast.info(intl.formatMessage({ id: "IDS_CANNOTEDITCANCELLEDSAMPLE" }));
                    // ALPD-3393
                    if (inputParam.editRegParam["getSampleChildDetail"] === true) {
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
                    //AgaramTree = response[1].data["AgaramTree"];
                    // ActiveKey = response[1].data["FocusKey"];
                    //FocusKey = response[1].data["ActiveKey"];
                    //OpenNodes = response[1].data["OpenNodes"];
                    //Manufacturer = response.data["Manufacturer"];
                    selectedSpec["nallottedspeccode"] = Specification.length > 0 ? {
                        "value": Specification[0].value,
                        "label": Specification[0].label,
                        "item": Specification[0].item
                    } : "";

                    selectedSpec["sversion"] = Specification.length > 0 ? Specification[0].item.sversion : ""
                    selectedSpec["ntemplatemanipulationcode"] = Specification.length > 0 ?
                        Specification[0].item.ntemplatemanipulationcode : -1
                    selectedRecord = { ...selectedRecord, ...selectedSpec }

                    if (inputParam.editRegParam["getSampleChildDetail"] === true) {
                        masterData = sortData({ ...masterData, ...response[1].data["SampleChildDetail"] })
                    }
                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {
                            // AgaramTree,
                            //FocusKey,
                            // ActiveKey,
                            //OpenNodes,
                            selectedSpec,
                            Specification,
                            // statustoEditDetail: response[2].data["ApprovalConfigRole"] || {},
                            // currentTime,
                            operation: "update",
                            screenName: inputParam.masterData.RealRegSubTypeValue.sregsubtypename,
                            // PopUpLabel: popUpLabel,
                            timeZoneList,
                            defaultTimeZone,
                            selectedRecord,
                            openPortal: true,
                            ncontrolCode: inputParam.editRegParam.ncontrolCode,
                            loadPreregister: true,
                            parentPopUpSize: "xl",
                            loading: false,
                            showSample: undefined,
                            comboData: comboValues.comboData,
                            childColumnList, comboComponents,
                            withoutCombocomponent,
                            columnList,
                            masterData,
                            // testskip and take added by gowtham on 04 July 2025 - ALPDJ21-7 - Sample registration screen -> Tests getting disappeared in specific scenario.
                            testskip: 0,
                            testtake: undefined,
                            //  regRecordToEdit:recordToEdit

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

export function updateRegistration(inputParam, masterData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        let requestUrl = '';
        if (inputParam.isFileupload) {
            requestUrl = rsapi().post("/registration/updateRegistrationWithFile", inputParam.formData)
        } else {
            requestUrl = rsapi().post("/registration/updateRegistration", inputParam.inputData)
        }
        return requestUrl
            //   rsapi().post("/registration/updateRegistration", inputParam.inputData)
            .then(response => {
                if (response.data.rtn === "Success") {
                    // sortData(response.data);
                    replaceUpdatedObject(response.data["RegistrationGetSample"], masterData.RegistrationGetSample, "npreregno");
                    replaceUpdatedObject(response.data["RegistrationGetSubSample"], masterData.RegistrationGetSubSample, "ntransactionsamplecode");
                    replaceUpdatedObject(response.data["RegistrationGetTest"], masterData.RegistrationGetTest, "ntransactiontestcode");
                    //  let RegistrationGetSubSample = response.data["RegistrationGetSubSample"];
                    //let RegistrationGetTest = response.data["RegistrationGetTest"];
                    masterData = {
                        ...masterData,
                        selectedSample: response.data["selectedSample"],
                        // selectedSubSample: masterData["selectedSubSample"],
                        //selectedTest:masterData["selectedTest"],
                        // RegistrationGetTest,
                        // RegistrationGetSubSample,
                        RegistrationParameter: masterData["RegistrationParameter"]
                    }
                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {
                            masterData, openPortal: false, loading: false, showConfirmAlert: false,
                            regDateEditConfirmMessage: undefined, loadEsign: false, openModal: false,
                            loadPreregister: false, selectedRecord: {}, showSample: undefined
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

export function cancelTestAction(inputParam, LoginProps) {

    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("/registration/cancelTest", inputParam.inputData)
            .then(response => {

                // replaceUpdatedObject(response.data["selectedTest"], LoginProps.RegistrationGetTest, "ntransactiontestcode");

                let masterData = {
                    ...LoginProps,
                    selectedTest: response.data["selectedTest"],
                    // RegistrationGetTest:response.data["RegistrationGetTest"],
                    RegistrationGetTest: replaceUpdatedObject(response.data["selectedTest"], LoginProps.RegistrationGetTest, "ntransactiontestcode"),
                    //  RegistrationGetSample: replaceUpdatedObject(response.data.selectedSample, LoginProps.RegistrationGetSample, 'npreregno')
                }
                let respObject = {
                    masterData,
                    ...inputParam.inputData,
                    openModal: false,
                    loadEsign: false,
                    showConfirmAlert: false,
                    selectedRecord: {},
                    loading: false,
                    loadPreregister: false,
                    showSample: undefined
                }
                inputParam.postParamList[0]['clearFilter'] = 'no'
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

export function cancelSampleAction(inputParam, LoginProps) {

    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("/registration/cancelSample", inputParam.inputData)
            .then(response => {
                // if (response.data["isPortalData"] && response.data["PortalStatus"] && response.data["PortalStatus"].length > 0) {
                //     dispatch(UpdateExternalOrderStatus(response.data["PortalStatus"], inputParam));
                // }
                replaceUpdatedObject(response.data["RegistrationGetSample"], LoginProps.RegistrationGetSample, "npreregno");
                replaceUpdatedObject(response.data["RegistrationGetSubSample"], LoginProps.RegistrationGetSubSample, "ntransactionsamplecode");
                replaceUpdatedObject(response.data["RegistrationGetTest"], LoginProps.RegistrationGetTest, "ntransactiontestcode");

                let masterData = {
                    ...LoginProps,
                    selectedSample: replaceUpdatedObject(response.data["selectedSample"], LoginProps.selectedSample, "npreregno"),
                    selectedSubSample: replaceUpdatedObject(response.data["selectedSubSample"], LoginProps.selectedSubSample, "ntransactionsamplecode"),
                    selectedTest: replaceUpdatedObject(response.data["selectedTest"], LoginProps.selectedTest, "ntransactiontestcode"),
                }

                let respObject = {
                    masterData,
                    ...inputParam.inputData,
                    loading: false,
                    loadEsign: false,
                    openModal: false,
                    showSample: undefined
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
                    toast.info(error.response.data.rtn);
                }
            })
    }
}

export function addsubSampleRegistration(masterData, userinfo, regcolumnList,
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
            userinfo
        })
        urlArray[1] = actualService;

        if (specBasedComponent) {
            const ComponentTestBySpec = rsapi().post("/registration/getComponentBySpec", {
                ...Map,
                specBasedComponent: specBasedComponent,
                userinfo
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
                userinfo

            })
            urlArray[2] = TestGet;
            const TestPackageGet = rsapi().post("/registration/getTestfromTestPackage", {
                nallottedspeccode: Map["nallottedspeccode"],
                specBasedComponent: specBasedComponent,
                specBasedTestPackage: specBasedTestPackage,
                userinfo
            });
            urlArray[5] = TestPackageGet;
            const TestSectionGet = rsapi().post("/registration/getTestfromSection", {
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
                            selectedRecord1[componentrow.label] = componentrow.loadcurrentdate ? rearrangeDateFormat(userinfo, response[3].data?.date) : "";
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

export function saveSubSample(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        let requestUrl = '';
        if (inputParam.isFileupload) {
            requestUrl = rsapi().post("/registration/createSubSampleWithFile", inputParam.formData)
        } else {
            requestUrl = rsapi().post("/registration/createSubSample", inputParam.inputData);
        }
        return requestUrl
            //  rsapi().post("/registration/createSubSample", inputParam.inputData)
            .then(response => {
                // let RegistrationGetSample = updatedObjectWithNewElement(response.data["selectedSample"], inputParam.inputData.masterData.RegistrationGetSample);
                // let selectedSample = response.data["selectedSample"];
                let RegistrationGetSubSample = updatedObjectWithNewElement(inputParam.inputData.masterData.RegistrationGetSubSample, response.data["selectedSubSample"]);
                let RegistrationGetTest = response.data["selectedTest"];
                let selectedSubSample = response.data["selectedSubSample"];// RegistrationGetSubSample.length > 0 ? [RegistrationGetSubSample[0]] : [];
                RegistrationGetTest = sortData(RegistrationGetTest, "npreregno", "desc");
                let selectedTest = RegistrationGetTest.length > 0 ? [RegistrationGetTest[0]] : [];
                let RegistrationParameter = response.data["RegistrationParameter"];
                RegistrationParameter = RegistrationParameter ? getSameRecordFromTwoArrays(RegistrationParameter, selectedTest, 'ntransactiontestcode') : RegistrationParameter;
                let RegistrationGetSample = replaceUpdatedObject(response.data["selectedSample"], inputParam.inputData.masterData.RegistrationGetSample, 'npreregno');
                let selectedSample = response.data["selectedSample"];



                let masterData = { ...inputParam.inputData.masterData }
                masterData = {
                    ...masterData, ...response.data,
                    selectedSubSample, selectedTest,
                    RegistrationGetSubSample, RegistrationGetTest, RegistrationParameter, selectedSample, RegistrationGetSample
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

export function getEditSubSampleComboService(inputParam, columnList, selectedRecord1,
    childColumnList, comboComponents,
    withoutCombocomponent, specBasedComponent) {
    return function (dispatch) {

        let { userInfo, operation, masterData } = { ...inputParam };

        if (masterData["selectedSubSample"].length > 1 ||
            masterData["selectedSubSample"]
                .findIndex(x => x[inputParam.primaryKeyName] === inputParam["mastertoedit"][inputParam.primaryKeyName])
            === -1) {
            inputParam.editSubSampleRegParam["getSubSampleChildDetail"] = true;
        }

        masterData["selectedSubSample"] = [];
        masterData["selectedSubSample"].push(inputParam["mastertoedit"]);

        inputParam.editSubSampleRegParam["npreregno"] = inputParam["mastertoedit"]["npreregno"];
        //inputParam.editSubSampleRegParam["checkBoxOperation"] = 3;
        inputParam.editSubSampleRegParam["checkBoxOperation"] = checkBoxOperation.SINGLESELECT;
        inputParam.editSubSampleRegParam["nfilterstatus"] = inputParam["mastertoedit"]["ntransactionstatus"];
        inputParam.editSubSampleRegParam["napprovalconfigcode"] = inputParam["mastertoedit"]["napprovalconfigcode"];
        //inputParam.editSubSampleRegParam["withoutgetparameter"] = 3;

        const ntransactionsamplecode = inputParam.mastertoedit[inputParam.primaryKeyName];
        if (ntransactionsamplecode === undefined) {
            toast.info(intl.formattedMessage({ id: "IDS_SELECTVALIDSUBSAMPLE" }));
        }
        else {
            let urlArray = [];

            const timeZoneService = rsapi().post("timezone/getTimeZone");
            // const actualService = rsapi().post("dynamicpreregdesign/getComboValues", {
            //     parentcolumnlist: columnList,
            //     childcolumnlist: childColumnList,
            //     userinfo: userInfo
            // })
            const selectedRegistration = rsapi().post("/registration/getEditRegistrationSubSampleDetails", {
                ...inputParam.editSubSampleRegParam, ntransactionsamplecode, parentcolumnlist: columnList,
                childcolumnlist: childColumnList,
                userinfo: userInfo
            })

            const dateService = rsapi().post("dynamicpreregdesign/dateValidation", {
                datecolumnlist: withoutCombocomponent.filter(x => x.inputtype === "date"),
                userinfo: userInfo
            })


            urlArray = [timeZoneService, selectedRegistration, dateService]
            // if(specBasedComponent){
            //     const ComponentTestBySpec = rsapi().post("/registration/getComponentBySpec", {
            //         ...Map,
            //         specBasedComponent: specBasedComponent
            //     })
            //     urlArray.push(ComponentTestBySpec) 
            // }
            dispatch(initRequest(true));
            Axios.all(urlArray)
                .then(response => {
                    let selectedRecord = { ...response[1].data["EditData"] };

                    selectedRecord = { ...selectedRecord, ...selectedRecord['jsondata'] }

                    const timeZoneMap = constructOptionList(response[0].data || [], "ntimezonecode", "stimezoneid", undefined, undefined, true);
                    const timeZoneList = timeZoneMap.get("OptionList");
                    const defaultTimeZone = { label: userInfo.stimezoneid, value: userInfo.ntimezonecode }

                    // if (selectedRecord.ntransactionstatus !== transactionStatus.PREREGISTER) {
                    //     toast.info(intl.formatMessage({ id: "IDS_SELECTPREREGISTERSUBSAMPLETOEDIT" }));
                    //     dispatch({ type: DEFAULT_RETURN, payload: { loading: false } });
                    // }

                    //else {
                    //               let lstComponent=[]
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
                            screenName: "IDS_SUBSAMPLE",
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

export function onUpdateSubSampleRegistration(inputParam, masterData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        let requestUrl = '';
        if (inputParam.isFileupload) {
            requestUrl = rsapi().post("/registration/updateRegistrationSubSampleWithFile", inputParam.formData)
        } else {
            requestUrl = rsapi().post("/registration/updateRegistrationSubSample", inputParam.inputData)
        }
        return requestUrl
            // rsapi().post("/registration/updateRegistrationSubSample", inputParam.inputData)
            .then(response => {
                sortData(response.data);
                replaceUpdatedObject(response.data["RegistrationGetSubSample"], masterData.RegistrationGetSubSample, "ntransactionsamplecode");
                //replaceUpdatedObject(response.data["RegistrationGetSubSample"], masterData.RegistrationGetSubSample, "ntransactionsamplecode");
                // replaceUpdatedObject(response.data["selectedTest"], masterData.RegistrationGetTest, "ntransactiontestcode");
                //  let RegistrationGetSubSample=response.data["RegistrationGetSubSample"];
                let RegistrationGetTest = response.data["RegistrationGetTest"];
                masterData = {
                    ...masterData,
                    // selectedSample: response.data["selectedSample"],
                    selectedSubSample: response.data["selectedSubSample"],
                    //selectedTest: response.data["selectedTest"],
                    selectedTest: replaceUpdatedObject(response.data["RegistrationGetTest"], masterData.selectedTest, "ntransactiontestcode"),
                    RegistrationGetTest,
                    // RegistrationGetSubSample,
                    RegistrationParameter: response.data["RegistrationParameter"]
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

export function cancelSubSampleAction(inputParam, LoginProps) {

    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("/registration/cancelSubSample", inputParam.inputData)
            .then(response => {
                if (inputParam.inputData.nsampletypecode === SampleType.CLINICALTYPE && response.data.isMapped) {
                    replaceUpdatedObject(response.data["RegistrationGetSample"], LoginProps.RegistrationGetSample, "npreregno");
                }
                replaceUpdatedObject(response.data["RegistrationGetSubSample"], LoginProps.RegistrationGetSubSample, "ntransactionsamplecode");
                replaceUpdatedObject(response.data["RegistrationGetTest"], LoginProps.RegistrationGetTest, "ntransactiontestcode");

                let masterData = {
                    ...LoginProps,
                    //selectedSample: replaceUpdatedObject(response.data["selectedSample"], LoginProps.selectedSample, "npreregno"),
                    selectedSubSample: replaceUpdatedObject(response.data["selectedSubSample"], LoginProps.selectedSubSample, "ntransactionsamplecode"),
                    selectedTest: replaceUpdatedObject(response.data["selectedTest"], LoginProps.selectedTest, "ntransactiontestcode"),
                }
                if (inputParam.inputData.nsampletypecode === SampleType.CLINICALTYPE && response.data.isMapped) {
                    masterData = {
                        ...masterData,
                        selectedSample: replaceUpdatedObject(response.data["selectedSample"], LoginProps.selectedSample, "npreregno")
                    }
                }

                let respObject = {
                    masterData,
                    ...inputParam.inputData,
                    loading: false,
                    loadEsign: false,
                    openModal: false,
                    showSample: undefined
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
                    toast.info(error.response.data.rtn);
                }
            })
    }
}

export function preregRecordToQuarantine(inputParam, LoginProps) {

    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("/registration/quarantineRegistration", inputParam.inputData)
            .then(response => {
                // replaceUpdatedObject(response.data["selectedSample"], LoginProps.RegistrationGetSample, "npreregno");
                // replaceUpdatedObject(response.data["selectedSubSample"], LoginProps.RegistrationGetSubSample, "ntransactionsamplecode");
                // replaceUpdatedObject(response.data["selectedTest"], LoginProps.RegistrationGetTest, "ntransactiontestcode");
                replaceUpdatedObject(response.data["RegistrationGetSample"], LoginProps.RegistrationGetSample, "npreregno");
                replaceUpdatedObject(response.data["RegistrationGetSubSample"], LoginProps.RegistrationGetSubSample, "ntransactionsamplecode");
                replaceUpdatedObject(response.data["RegistrationGetTest"], LoginProps.RegistrationGetTest, "ntransactiontestcode");

                delete response.data["RegistrationGetSample"];
                delete response.data["RegistrationGetSubSample"];
                delete response.data["RegistrationGetTest"];
                let masterData = {
                    ...LoginProps,
                    selectedSample: replaceUpdatedObject(response.data["selectedSample"], LoginProps.selectedSample, "npreregno"),
                    selectedSubSample: replaceUpdatedObject(response.data["selectedSubSample"], LoginProps.selectedSubSample, "ntransactionsamplecode"),
                    selectedTest: replaceUpdatedObject(response.data["selectedTest"], LoginProps.selectedTest, "ntransactiontestcode"),
                }
                let respObject = {
                    masterData,
                    loading: false,
                    loadEsign: false,
                    openModal: false,
                    showSample: undefined
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
                    toast.info(error.response.data.rtn);
                }

            })
    }
}

export function getTestChildTabDetailRegistration(inputData, isServiceRequired) {
    return function (dispatch) {
        if (inputData.ntransactiontestcode === "") {
            inputData.ntransactiontestcode = "0";
        }
        if (inputData.ntransactiontestcode && inputData.ntransactiontestcode.length > 0) {
            let inputParamData = {
                ntransactiontestcode: inputData.ntransactiontestcode,
                npreregno: inputData.npreregno,
                userinfo: inputData.userinfo,
                ntransactionsamplecode: inputData.ntransactionsamplecode ? inputData.ntransactionsamplecode :
                    inputData.selectedSubSample && inputData.selectedSubSample.map(item => item.ntransactionsamplecode).join(","),
                OrderCodeData: inputData.masterData && inputData.masterData.selectedSample && inputData.masterData.selectedSample.length > 0 ?
                    inputData.masterData.selectedSample.map(item => item.hasOwnProperty("OrderCodeData") ? item.OrderCodeData : -1).join(",") : null,
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
                case "IDS_TESTHISTORY":
                    url = "history/getTestHistory"
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
                            let responseData = { ...response.data, selectedSample: inputData.selectedSample || inputData.masterData.selectedSample, selectedTest: inputData.selectedTest }
                            //responseData = sortData(responseData)
                            // fillRecordBasedOnCheckBoxSelection(inputData.masterData, inputData.selectedTest, inputData.childTabsKey, inputData.checkBoxOperation, "ntransactiontestcode",inputData.removeElementFromArray);
                            fillRecordBasedOnCheckBoxSelection(inputData.masterData, responseData, inputData.childTabsKey, inputData.checkBoxOperation, "ntransactionsamplecode", inputData.removeElementFromArray);
                            let masterData = {
                                ...inputData.masterData,
                                selectedSample: inputData.selectedSample || inputData.masterData.selectedSample,
                                selectedTest: inputData.selectedTest,
                                selectedPreregno: inputData.npreregno,
                                selectedSampleCode: inputData.ntransactionsamplecode,
                                selectedTestCode: inputData.ntransactiontestcode,
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
                    fillRecordBasedOnCheckBoxSelection(inputData.masterData, inputData.selectedTest, inputData.childTabsKey, inputData.checkBoxOperation, "ntransactiontestcode", inputData.removeElementFromArray);
                    let skipInfo = {};
                    let masterData = {
                        ...inputData.masterData,
                        selectedTest: inputData.selectedTest,
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
                        ApprovalResultChangeHistory, RegistrationTestComment, ApprovalHistory, RegistrationTestHistory
                    }, loading: false,
                    activeTabIndex: inputData.activeTabIndex,
                    activeTabId: inputData.activeTabId,
                }
            })
        }
    }
}

export const toTimestamp = (strDate) => {
    // const dt = new Date(strDate).getTime();
    // return dt / 1000;
    const dt = strDate.getTime();
    return dt;
}

export function getDynamicFilter(inputParam) {
    if (inputParam.component.inputtype === 'frontendsearchfilter') {
        return function (dispatch) {
            dispatch(initRequest(true));
            rsapi().post("/dynamicpreregdesign/getcustomsearchfilter", { ...inputParam.component, userinfo: inputParam.userinfo })
                .then(response => {
                    const source = inputParam.component.source
                    const languageTypeCode = inputParam.userinfo.slanguagetypecode
                    const lstData = response.data[inputParam.component.label]


                    // const responseparam={}
                    const gridColumns = []
                    const fields = []
                    const datefileds = []
                    const multilingual = []
                    inputParam.component.filterfields.map(item => {
                        fields.push(filterObject(item, languageTypeCode, response.data, inputParam.component));
                        if (item.ismultilingual) {
                            multilingual.push(item.columnname)
                        }
                        if (item.filterinputtype === "date") {
                            datefileds.push(item.columnname)
                        }
                        if (item.filterinputtype !== 'predefinednumeric') {
                            gridColumns.push(creategridColumns(item, languageTypeCode,));
                        }
                    })

                    const optionList = lstData.map(item => {
                        const jsondata = item[source] ? item[source].value ?
                            JSON.parse(item[source].value) : item.jsondata : item.jsondata

                        datefileds.map(x => {
                            jsondata[x + "timestamp"] = toTimestamp(rearrangeDateFormatforKendoDataTool(inputParam.userinfo, jsondata[x]))
                        })
                        multilingual.map(mul => {
                            jsondata[mul] =
                                jsondata[mul][languageTypeCode] || jsondata[mul]['en-US']
                                ;
                        })


                        return jsondata
                    });
                    let map = {
                    }
                    if (inputParam.type === 'design') {
                        map = { ...map, showFilter: true, selectedComponentpath: inputParam.selectedComponentpath }
                    } else {
                        map = { ...map, loadCustomSearchFilter: true }
                    }
                    dispatch({
                        type: DEFAULT_RETURN, payload: {
                            lstPatient: optionList, gridColumns, fields,
                            //  loadCustomSearchFilter: true
                            loading: false,
                            screenName: inputParam.component.displayname[languageTypeCode],
                            seletedFilterComponent: inputParam.component,
                            kendoSkip: 0,
                            kendoTake: 5,
                            kendoFilter: inputParam.component.kendoFilter || {
                                logic: "and",
                                filters: []
                            },
                            //awesomeTree: undefined,
                            //awesomeConfig: undefined,
                            // showFilter: true,
                            ...map
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
    } else if (inputParam.component.inputtype === "backendsearchfilter") {
        return function (dispatch) {
            dispatch(initRequest(true));
            rsapi().post("/dynamicpreregdesign/getcustomsearchfilterpredefined", { ...inputParam.component, userinfo: inputParam.userinfo })
                .then(response => {
                    const languageTypeCode = inputParam.userinfo.slanguagetypecode
                    const { fields, gridColumns } = filterObjectForReactAwesomeFilter(inputParam.component.filterfields, languageTypeCode, response.data, inputParam.component)

                    let map = {
                    }
                    let awesomeTree = inputParam.component.awesomeTree ? checkTree(loadTree(inputParam.component.awesomeTree), inputParam.component.awesomeConfig) : undefined
                    if (inputParam.component.awesomeTree
                        && inputParam.component.filterquery && inputParam.component.filterquery !== ''
                    ) {
                        map = {
                            filterquery: inputParam.component.filterquery
                        }

                        if (inputParam.type === 'design') {
                            map = {
                                ...map, filterquery: inputParam.component.filterquery,
                                selectedFieldRecord: { ...inputParam.component, awesomeTree: awesomeTree }
                            }
                        }
                    } else {
                        map = {
                            filterquery: ''
                        }
                        if (inputParam.type === 'design') {
                            map = {
                                ...map, filterquery: inputParam.component.filterquery,
                                selectedFieldRecord: { ...inputParam.component, awesomeTree: awesomeTree }
                            }
                        }
                    }
                    if (inputParam.type === 'design') {
                        map = {
                            ...map,
                            showFilter: true, selectedComponentpath: inputParam.selectedComponentpath
                        }
                    } else {
                        map = { ...map, loadCustomSearchFilter: true }
                    }

                    dispatch({
                        type: DEFAULT_RETURN, payload: {
                            lstPatient: [], gridColumns, fields,
                            // loadCustomSearchFilter: true
                            loading: false,
                            screenName: inputParam.component.displayname[languageTypeCode],
                            seletedFilterComponent: inputParam.component,
                            kendoSkip: 0,
                            kendoTake: 5,
                            awesomeTree,
                            onExecute: true,
                            // awesomeConfig: inputParam.component.awesomeConfig || undefined,
                            // showFilter: true,
                            ...map
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
}

let datapredef = {}
const CustomFilter = props => {
    const { filter, data = [], defaultItem } = props;
    const onChange = event => {
        props.onFilterChange.call(undefined, {
            nextFilter: { ...props.filter, value: event.target.value.value }
        });
    };

    return <ComboBox onChange={onChange} data={filter.field ? datapredef[filter.field] : []} textField="text" />;
};

export function creategridColumns(item, languageTypeCode) {
    let obj = {}
    if (item.filterinputtype !== 'predefinednumeric') {
        return {
            field: item.columnname,
            title: item.displayname[languageTypeCode], width: "250px"
        }
    }
}

export function filterObjectForReactAwesomeFilter(filterFields, languageTypeCode, resposedata, component) {
    let obj = {}
    obj['fields'] = {}
    obj['gridColumns'] = []
    filterFields.map(item => {
        if (item.filterinputtype === 'predefinednumeric' || item.filterinputtype === 'predefinedtext') {
            const optionList = resposedata[item.predefinedtablename].map(data => {
                const jsondata = data[item.predefinedtablename] ? data[item.predefinedtablename].value ?
                    JSON.parse(data[item.predefinedtablename].value) : data.jsondata : data.jsondata

                jsondata['title'] = item.predefinedismultilingual ?
                    jsondata[item.predefineddisplaymember]
                    [languageTypeCode] || jsondata[item.predefineddisplaymember]['en-US']
                    : jsondata[item.predefineddisplaymember];
                jsondata['value'] = jsondata[component.valuemember === 'ndynamicmastercode' ? item.predefineddisplaymember : item.predefinedvaluemember === 'ndynamicmastercode' ? item.predefineddisplaymember : item.predefinedvaluemember]
                return jsondata
            });
            datapredef[item.columnname] = optionList
        }
        switch (item.filterinputtype) {
            case "text":
                obj['fields'][item.type === 'dynamic' ? item.ismultilingual ?
                    "jsondata->'" + item.columnname + "'->>'" + languageTypeCode + "'" :
                    "jsondata->>'" + item.columnname + "'" :
                    "\"" + item.columnname + "\""] = {
                    label: item.displayname[languageTypeCode],
                    type: "text",
                    valueSources: ["value", "func"],
                    mainWidgetProps: {
                        "valueLabel": "Name",
                        "valuePlaceholder": intl.formatMessage({ id: "IDS_ENTER" }) + " " + item.displayname[languageTypeCode]
                    }
                }
                break;
            case "numeric":
                obj['fields'][item.type === 'dynamic' ?
                    "(jsondata->>'" + item.columnname + "')::int" :
                    "\"" + item.columnname + "\""] = {
                    label: item.displayname[languageTypeCode],
                    type: "number",
                    valueSources: ["value"],
                    fieldSettings: {
                        ...item.numericcondition
                    }
                }
                break;
            case "date":
                obj['fields'][item.type === 'dynamic' ?
                    "jsondata->>'" + item.columnname + "'" :
                    "\"" + item.columnname + "\""] = {
                    label: item.displayname[languageTypeCode],
                    type: "date",
                    valueSources: ["value"],
                }
                break;
            case "predefinednumeric":
                obj['fields'][item.type === 'dynamic' ?
                    "(jsondata->>'" + item.columnname + "')::int" :
                    "\"" + item.columnname + "\""] = {
                    label: item.displayname[languageTypeCode],
                    type: "select",
                    valueSources: ["value"],
                    fieldSettings: {
                        listValues: datapredef[item.columnname]
                    }

                }
                break;
            case "predefinedtext":
                obj['fields'][item.type === 'dynamic' ? item.ismultilingual ?
                    "jsondata->'" + item.columnname + "'->>'" + languageTypeCode + "'" :
                    "jsondata->>'" + item.columnname + "'" :
                    "\"" + item.columnname + "\""] = {
                    label: item.displayname[languageTypeCode],
                    type: "select",
                    valueSources: ["value"],
                    fieldSettings: {
                        listValues: datapredef[item.columnname]
                    }

                }
                break;
        }
        const gridColumns = creategridColumns(item, languageTypeCode)
        if (item.filterinputtype !== 'predefinednumeric') {
            obj['gridColumns'].push(gridColumns)
        }


    })
    return obj;
}

export function filterObject(item, languageTypeCode, resposedata, component, isMultiFilter) {
    let obj = {}
    let preobj = {}
    if (item.filterinputtype === 'predefinednumeric' || item.filterinputtype === 'predefinedtext') {
        const optionList = resposedata[item.predefinedtablename].map(data => {
            const jsondata = data[item.predefinedtablename] ? data[item.predefinedtablename].value ?
                JSON.parse(data[item.predefinedtablename].value) : data.jsondata : data.jsondata

            jsondata['text'] = item.predefinedismultilingual ?
                jsondata[item.predefineddisplaymember]
                [languageTypeCode] || jsondata[item.predefineddisplaymember]['en-US']
                : jsondata[item.predefineddisplaymember];
            jsondata['value'] = jsondata[component.valuemember === 'ndynamicmastercode' ? item.predefineddisplaymember : item.predefinedvaluemember === 'ndynamicmastercode' ? item.predefineddisplaymember : item.predefinedvaluemember]
            //delete jsondata.jsondata
            return jsondata
        });
        datapredef[item.columnname] = optionList
        // preobj = {
        //     predefdata: optionList, predefineddisplaymember: item.predefineddisplaymember,
        //     predefinedvaluemember: item.columnname
        // }
    }
    switch (item.filterinputtype && item.filterinputtype.toLowerCase()) {
        case "text":
            return obj = {
                name: item.columnname,
                label: item.displayname[languageTypeCode],
                filter: TextFilter,
                operators: Operators.text,
            }
        case "numeric":
            return obj = {
                name: item.columnname,
                label: item.displayname[languageTypeCode],
                filter: NumericFilter,
                operators: Operators.numeric,
            }
        case "date":
            if (isMultiFilter) {
                return obj = {
                    name: item.columnname,
                    // + "timestamp",
                    label: item.displayname[languageTypeCode],
                    filter: DateFilter,
                    operators: Operators.date,
                }
            } else {
                return obj = {
                    name: item.columnname + "timestamp",
                    label: item.displayname[languageTypeCode],
                    filter: DateFilter,
                    operators: Operators.date,
                }
            }

        case "predefinednumeric":


            return obj = {
                name: item.columnname,
                label: item.displayname[languageTypeCode],
                filter: CustomFilter,
                operators: Operators.text,
                // operators: Operators.numeric,
            }
        case "predefinedtext":
            return obj = {
                name: item.columnname,
                label: item.displayname[languageTypeCode],
                filter: CustomFilter,
                operators: Operators.text,
            }
        default:
            return obj = {
                name: item.columnname,
                label: item.displayname[languageTypeCode],
                filter: TextFilter,
                operators: Operators.text,
            }

    }

    //return obj;
}

export function getDynamicFilterExecuteData(inputParam) {
    return function (dispatch) {

        let obj = { ...inputParam.component, filterquery: inputParam.filterquery, userinfo: inputParam.userinfo }
        dispatch(initRequest(true));
        rsapi().post("/dynamicpreregdesign/getdynamicfilterexecutedata", obj)
            .then(response => {
                const source = inputParam.component.source
                const languageTypeCode = inputParam.userinfo.slanguagetypecode
                const lstData = response.data[inputParam.component.label]
                const multilingual = []
                inputParam.component.filterfields.map(item => {
                    if (item.ismultilingual) {
                        multilingual.push(item.columnname)
                    }
                })
                const optionList = lstData.map(item => {
                    const jsondata = item[source] ? item[source].value ?
                        JSON.parse(item[source].value) : item.jsondata : item.jsondata

                    multilingual.map(mul => {
                        jsondata[mul] =
                            jsondata[mul][languageTypeCode] || jsondata[mul]['en-US'];
                    })
                    // let label = isMultiLingual ?
                    //   jsondata[optionValue]
                    //   [languageTypeCode] || jsondata[optionValue]['en-US']
                    //   : jsondata[optionValue];

                    return jsondata
                });
                if (inputParam.userinfo.nformcode === 161) {
                    dispatch({
                        type: DEFAULT_RETURN, payload: {
                            lstPatient: optionList,
                            onExecute: false,
                            loading: false,
                            screenName: inputParam.component.displayname[languageTypeCode]
                        }
                    })
                }
                else {
                    dispatch({
                        type: DEFAULT_RETURN, payload: {
                            lstPatient: optionList,
                            // onExecute: false,
                            loading: false,
                            screenName: inputParam.component.displayname[languageTypeCode]
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
                    toast.info(error.response.data.rtn);
                }

            })
    }
}

export function rearrangeDateFormatforKendoDataTool(userInfo, dateValue) {
    let splitChar = "/";

    if (dateValue !== undefined) {
        const index = userInfo.ssitedatetime && userInfo.ssitedatetime.indexOf("/" || "-")
        if (index !== -1)
            splitChar = userInfo.ssitedatetime.substring(index, index + 1)

    }
    //   console.log("splitChar:", splitChar);
    if ((splitChar === "/" || splitChar === "-") && typeof dateValue === "string") {
        const firstField = userInfo.ssitedatetime && userInfo.ssitedatetime.split(splitChar)[0];
        // console.log("firstField:", firstField);
        const timeSplitChar = dateValue.indexOf("T") !== -1 ? "T" : " "
        const datetime = dateValue.split(timeSplitChar);
        const dateArray = datetime[0].split(splitChar);
        if (firstField === "dd") {
            const day = dateArray[0];
            const month = dateArray[1];
            const year = dateArray[2];
            const time = datetime[1] || "00:00:00";

            const formatted = year + "-" + month + "-" + day + "T" + time;
            return new Date(formatted);
        }
        else if (firstField === "yyyy") {
            const year = dateArray[0];
            const month = dateArray[1];
            const day = dateArray[2];
            const time = datetime[1] || "00:00:00";
            const formatted = year + "-" + month + "-" + day + "T" + time;
            return new Date(formatted);
        }
        else {
            return new Date(dateValue);
        }
    }
    else {
        return dateValue;
    }
}

export function preRegDispatch(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        dispatch({
            type: DEFAULT_RETURN,
            payload: {
                ...inputParam
            }
        });
    }
}

export function validateEsignforRegistration(inputParam) {
    return (dispatch) => {
        dispatch(initRequest(true));
        return rsapi().post("login/validateEsignCredential", inputParam.inputData)
            .then(response => {
                if (response.data.credentials === "Success") {

                    const methodUrl = "registration";
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
            case "preregister":
                dispatch(insertRegistration(screenData.inputParam, screenData.masterData));
                break;
            case "editSample":
                dispatch(updateRegistration(screenData.inputParam, screenData.masterData, 'openModal'));
                break;
            case "accept":
                dispatch(acceptRegistration(screenData.inputParam, screenData.masterData));
                break;
            case "quarantine":
                dispatch(preregRecordToQuarantine(screenData.inputParam, screenData.masterData));
                break;
            case "cancelTest":
                dispatch(cancelTestAction(screenData.inputParam, screenData.masterData));
                break;
            case "cancelSample":
                dispatch(cancelSampleAction(screenData.inputParam, screenData.masterData));
                break;
            case "addregsourcecountry":
                dispatch(crudMaster(screenData.inputParam, screenData.masterData, "openModal"))
                break;
            case "deleteregsourcecountry":
                dispatch(crudMaster(screenData.inputParam, screenData.masterData, "openModal"))
                break;
            case "printer":
                dispatch(crudMaster(screenData.inputParam, screenData.masterData, "openModal"))
                break;
            case "editSubSample":
                dispatch(onUpdateSubSampleRegistration(screenData.inputParam, screenData.masterData));
                //ALPD-1128
                break;
            case "cancelSubSample":
                dispatch(cancelSubSampleAction(screenData.inputParam, screenData.masterData));
                break;
            case "adhocTest":
                dispatch(createAdhocTest(screenData.inputParam, screenData.masterData));
                break;
            //ALPD-5511--Added by Vignesh R(08-04-2025)-->Esign added
            case "editTestMethod":
                dispatch(onUpdateTestMethod(screenData.inputParam, screenData.masterData));
                break;
            //ALPDJ21-49--Added by Vignesh R(08-04-2025)-->Esign added
            case "editTestInstrumentCategory":
                dispatch(onUpdateTestInstrumentCategory(screenData.inputParam, screenData.masterData));
                break;

            default:
                break;
        }
    }
}
//
export function getprojectType(storeInputParam, selectedRecord, inputData) {

    return (dispatch) => {
        dispatch(initRequest(true));
        let objItems = {
            userinfo: storeInputParam.userInfo
        }
        const getProjectType = rsapi().post("projecttype/getProjectType", objItems);
//ATE234 Janakumar -> ALPDJ21-61 Sample Registration -> sample or sub sample send to store test was not got properly.
        if (inputData.needSubSample === true) {
            inputData["getSubSampleChildDetail"] = true;
        } else {
            inputData["getSampleChildDetail"] = true;

        }
        //ATE234 Janakumar -> ALPDJ21-61 Sample Registration -> sample or sub sample send to store test was not got properly.
        const getRegistrationSentToStore = rsapi().post("registration/getRegistrationSampleStatus", inputData);

        let urlArray = [getProjectType, getRegistrationSentToStore];

        dispatch(initRequest(true));
        Axios.all(urlArray)
            .then(response => {
                let projectType;
                let needdatashow;
                let masterData;
                let selectedRecord;
                let sampleStorageLocation;
                let SampleStorageContainerPath;
                let excelValues;
                let showAlertTransStatus;
                let openChildModal = false;
                let isShowAlert;
                let operation;
                let nTransStatusAlert;
                let screenName;
                    showAlertTransStatus = response?.[1]?.data?.statusNeedsubsample;
                    nTransStatusAlert = response?.[1]?.data?.ntransactionstatus;
                //ALPDJ21-97--Added by Vignesh(22-09-2025)-->Blank page occurs, when do send to store for cancel and reject in specific scenario.
                 if(!(nTransStatusAlert===transactionStatus.CANCELLED  || nTransStatusAlert===transactionStatus.REJECT || nTransStatusAlert===transactionStatus.PREREGISTER || nTransStatusAlert===transactionStatus.QUARANTINE) ){

                if (response[0].status === 200 && response[0].status !== null) {
                    masterData = {
                        ...storeInputParam.masterData
                    };

                    if (inputData.needSubSample === false) {

                        if (masterData["selectedSample"].length > 1 ||
                            masterData["selectedSample"]
                                .findIndex(x => x['npreregno'] === storeInputParam["mastersendtostore"]['npreregno'])
                            === -1) {
                            storeInputParam.mastersendtostore["getSampleChildDetail"] = true;
                        }
                        masterData["selectedSample"] = [];
                        masterData["selectedSample"].push(storeInputParam["mastersendtostore"]);

                    } else {

                        if (masterData["selectedSubSample"].length > 1 ||
                            masterData["selectedSubSample"]
                                .findIndex(x => x['ntransactionsamplecode'] === storeInputParam["mastersendtostore"]['ntransactionsamplecode'])
                            === -1) {
                            storeInputParam.mastersendtostore["getSubSampleChildDetail"] = true;
                        }
                        masterData["selectedSubSample"] = [];
                        masterData["selectedSubSample"].push(storeInputParam["mastersendtostore"]);

                    }

                    if (masterData["selectedSample"][0].storage === true || masterData["selectedSubSample"][0].storage === true) {

                        needdatashow = true;
                        isShowAlert = false;
                        openChildModal = true;
                        operation = "MovesendToStore";
                        screenName="IDS_STORAGE";
                    } else {
                        needdatashow = false;
                        isShowAlert = true;
                        operation = "";
                        screenName="IDS_STORESAMPLE";

                    }

                    const projectTypeMap = constructOptionList(response[0].data || [], "nprojecttypecode",
                        "sprojecttypename", undefined, undefined, true);
                    projectType = projectTypeMap.get("OptionList");

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
                        masterData = { ...masterData, ...response[1].data["SubSampleChildDetail"] };
                    }
                    //masterData["selectedTest"] = storeInputParam?.masterData?.selectedTest ?? [];
                    //masterData["RegistrationGetTest"] = storeInputParam?.masterData?.RegistrationGetTest ?? [];

                }
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData,
                        projectType,
                        loading: false,
                        isShowAlert: isShowAlert,
                        showAlertTransStatus: showAlertTransStatus,
                        nTransStatusAlert:nTransStatusAlert,
                        openChildModal: openChildModal,
                        operation: operation,
                        selectedRecord,
                        "SaveBtnHide": needdatashow,
                        testskip: inputData.testskip,
                        testtake: inputData.testtake,
                        subsampleskip: inputData.subsampleskip,
                        subsampletake: inputData.subsampletake,
                        skip: inputData.skip,
                        take: inputData.take,
                        sampleStorageLocation,
                        SampleStorageContainerPath,
                        excelValues,
                        screenName:screenName
                        //ncontrolcode: sendToStoreId,
                        //selectedRecord,
                        //npreregno: sampleDetails.npreregno,
                        //ntransactionsamplecode: sampleDetails.ntransactionsamplecode

                    }
                });
            
            }else{
                 //ALPDJ21-97--Added by Vignesh(22-09-2025)-->Blank page occurs, when do send to store for cancel and reject in specific scenario.
                const alertMsg = intl.formatMessage({ id: "IDS_SELECTVALIDSAMPLEFORSTORAGE" });
                toast.info(showAlertTransStatus +" "+ alertMsg);
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })

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
                    toast.info(error.response.data);
                }
            })

    }
}

//  ALPD-5347 Sample Registration -> sample or sub sample save into storage    -- start

export function getStorageCategoryForSendToStore(inputData, SampleStorageLocation, Samplestoragecontainerpath, selectedRecord) {
    return (dispatch) => {
        dispatch(initRequest(true));
        return rsapi().post("registration/getRegistrationSentToStore", inputData)
            .then(response => {
                let sampleStorageContainerPath;
                let sampleStorageLocation;
                let masterData;
                let excelValues;
                //let sampleStorageContainerPath;

                if (response.status === 200) {

                    if (inputData.comboKey === 'nprojecttypecode') {

                        const sampleStorageLocationMap = constructOptionList(response.data.SampleStorageLocation || [], "nsamplestoragelocationcode",
                            "ssamplestoragelocationname", undefined, undefined, true);
                        sampleStorageLocation = sampleStorageLocationMap.get("OptionList");


                    } else if (inputData.comboKey === 'nsamplestoragelocationcode') {

                        const sampleStorageContainerPathMap = constructOptionList(response.data.SampleStorageContainerPath || [], "nsamplestoragecontainerpathcode",
                            "scontainerpath", undefined, undefined, true);
                        sampleStorageContainerPath = sampleStorageContainerPathMap.get("OptionList");
                        sampleStorageLocation = SampleStorageLocation;

                    } else if (inputData.comboKey === 'nsamplestoragecontainerpathcode') {

                        const excelValue = constructOptionList(response.data.excelSheetValues || [], "alphabet",
                            "alphabet", "ascending", undefined, true);
                        excelValues = excelValue.get("OptionList");

                        sampleStorageLocation = SampleStorageLocation;
                        sampleStorageContainerPath = Samplestoragecontainerpath;
                    }

                    masterData = {
                        ...inputData.masterData
                    };
                }
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData,
                        excelValues,
                        sampleStorageLocation,
                        sampleStorageContainerPath,
                        loading: false,
                        openChildModal: true,
                        operation: "MovesendToStore",
                        //ncontrolcode: sendToStoreId,
                        selectedRecord,
                        //npreregno: sampleDetails.npreregno,
                        //ntransactionsamplecode: sampleDetails.ntransactionsamplecode

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


export function createSampleSendToStore(inputParam, inputData, userInfo) {
    return (dispatch) => {
        dispatch(initRequest(true));
        return rsapi().post("samplestoragetransaction/createSampleStorageTransaction", inputData)
            .then(response => {

                let masterData;
                let selectedRecord;

                if (response.status === 200) {


                    if (inputData.needSubSample === true) {
                        masterData = {
                            RegistrationGetSubSample: replaceUpdatedObject(response.data.body.RegistrationGetSubSample, inputParam.inputData.masterData.RegistrationGetSubSample, 'ntransactionsamplecode'),
                            selectedSubSample: replaceUpdatedObject(response.data.body.selectedSubSample, inputParam.inputData.masterData.selectedSubSample, 'ntransactionsamplecode'),
                            ...inputParam.inputData.masterData
                        };
                    } else {
                        masterData = {
                            RegistrationGetSample: replaceUpdatedObject(response.data.body.RegistrationGetSample, inputParam.inputData.masterData.RegistrationGetSample, 'npreregno'),
                            selectedSample: replaceUpdatedObject(response.data.body.selectedSample, inputParam.inputData.masterData.selectedSample, 'npreregno'),
                            ...inputParam.inputData.masterData
                        };
                    }

                    selectedRecord = [];
                }
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        selectedRecord,
                        masterData,
                        loading: false,
                        openChildModal: false,
                        operation: "MovesendToStore",
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

//  ALPD-5347 Sample Registration -> sample or sub sample save into storage    -- End


// export function getStorageCategoryForSendToStore(storeInputParam, selectedRecord, sampleDetails) {
//     return function (dispatch) {
//         dispatch(initRequest(true));

//         const userInfo = storeInputParam.userInfo;
//         let masterData = storeInputParam.masterData;
//         const sendToStoreId = storeInputParam.controlcode;


//         const geStorageCategory = rsapi().post("/storagecategory/getStorageCategory", { 'userinfo': userInfo });
//         const getUnit = rsapi().post("/unit/getUnit", { 'userinfo': userInfo });
//         const getApprovedLocation = rsapi().post("/samplestoragemaster/getSampleQty", sampleDetails);

//         let urlArray = [geStorageCategory, getUnit, getApprovedLocation];

//         ///////////////////////////////
//         if (sampleDetails.needSubSample) {
//             if (masterData["selectedSubSample"].length > 1 ||
//                 masterData["selectedSubSample"]
//                     .findIndex(x => x[storeInputParam.primaryKeyName] === storeInputParam["mastersendtostore"][storeInputParam.primaryKeyName])
//                 === -1) {
//                 storeInputParam.subSampleRegParam["getSubSampleChildDetail"] = true;
//             }

//             masterData["selectedSubSample"] = [];
//             masterData["selectedSubSample"].push(storeInputParam["mastersendtostore"]);

//             // storeInputParam.subSampleRegParam["npreregno"] = storeInputParam["mastersendtostore"]["npreregno"];
//             // storeInputParam.subSampleRegParam["checkBoxOperation"] = 3;
//             // storeInputParam.subSampleRegParam["nfilterstatus"] = storeInputParam["mastersendtostore"]["ntransactionstatus"];
//             // storeInputParam.subSampleRegParam["napprovalconfigcode"] = storeInputParam["mastersendtostore"]["napprovalconfigcode"];

//             let inputParamData = {
//                 nsampletypecode: storeInputParam["subSampleRegParam"].nsampletypecode,
//                 nregtypecode: storeInputParam["subSampleRegParam"].nregtypecode,
//                 nregsubtypecode: storeInputParam["subSampleRegParam"].nregsubtypecode,
//                 npreregno: String(storeInputParam["mastersendtostore"].npreregno),
//                 ntransactionsamplecode: String(storeInputParam["mastersendtostore"].ntransactionsamplecode),
//                 ntransactionstatus: storeInputParam["mastersendtostore"].ntransactionstatus,
//                 napprovalconfigcode: storeInputParam["mastersendtostore"].napprovalconfigcode,
//                 activeTestTab: storeInputParam["subSampleRegParam"].activeTestTab,
//                 activeSampleTab: storeInputParam["subSampleRegParam"].activeSampleTab,
//                 activeSubSampleTab: storeInputParam["subSampleRegParam"].activeSubSampleTab,
//                 userinfo: storeInputParam.userInfo,
//                 ndesigntemplatemappingcode: storeInputParam["subSampleRegParam"].ndesigntemplatemappingcode,
//                 checkBoxOperation: storeInputParam["masterData"].checkBoxOperation,
//                 nneedsubsample: storeInputParam["subSampleRegParam"].nneedsubsample
//             }

//             urlArray.push(rsapi().post("registration/getRegistrationTest", inputParamData));
//         }
//         else {
//             if (masterData["selectedSample"].length > 1 ||
//                 masterData["selectedSample"]
//                     .findIndex(x => x[storeInputParam.primaryKeyName] === storeInputParam["mastersendtostore"][storeInputParam.primaryKeyName])
//                 === -1) {
//                 storeInputParam.mainSampleRegParam["getSampleChildDetail"] = true;
//             }
//             masterData["selectedSample"] = [];
//             masterData["selectedSample"].push(storeInputParam["mastersendtostore"]);

//             const inputParamData = {
//                 nsampletypecode: storeInputParam.mainSampleRegParam.nsampletypecode,
//                 nregtypecode: storeInputParam.mainSampleRegParam.nregtypecode,
//                 nregsubtypecode: storeInputParam.mainSampleRegParam.nregsubtypecode,
//                 npreregno: String(storeInputParam.mastersendtostore.npreregno),
//                 ntransactionstatus: storeInputParam.mastersendtostore.ntransactionstatus,
//                 napprovalconfigcode: storeInputParam.mastersendtostore.napprovalconfigcode,
//                 activeTestTab: storeInputParam.mainSampleRegParam.activeTestTab,
//                 activeSampleTab: storeInputParam.mainSampleRegParam.activeTestTab,
//                 activeSubSampleTab: storeInputParam.mainSampleRegParam.activeTestTab,
//                 userinfo: storeInputParam.userInfo,
//                 ndesigntemplatemappingcode: storeInputParam.mainSampleRegParam.ndesigntemplatemappingcode,
//                 nneedsubsample: storeInputParam.mainSampleRegParam.nneedsubsample,
//                 // ntype: storeInputParam.masterData.checkBoxOperation === 7 ? 4 : undefined,
//                 ntype: storeInputParam.masterData.checkBoxOperation === checkBoxOperation.QUICKSELECTALL ? 4 : undefined,
//                 // checkBoxOperation: storeInputParam.masterData.nneedsubsample === true ?
//                 //     storeInputParam.masterData.checkBoxOperation === 5 ? 3 : storeInputParam.masterData.checkBoxOperation : storeInputParam.mastersendtostore.checkBoxOperation
//                 checkBoxOperation: storeInputParam.masterData.nneedsubsample === true ?
//                     storeInputParam.masterData.checkBoxOperation === checkBoxOperation.QUICKSELECTSTATUS ? checkBoxOperation.SINGLESELECT : storeInputParam.masterData.checkBoxOperation : storeInputParam.mastersendtostore.checkBoxOperation

//             }
//             urlArray.push(rsapi().post("registration/getRegistrationSubSample", inputParamData));

//         }

//         Axios.all(urlArray)
//             .then(response => {
//                 //console.log("res:", response);
//                 if (response[2].data["ReturnStatus"] !== undefined) {
//                     toast.info(response[2].data["ReturnStatus"]);
//                     masterData = {
//                         ...masterData, ...response[3].data
//                     };

//                     dispatch({
//                         type: DEFAULT_RETURN,
//                         payload: {
//                             masterData,
//                             loading: false,
//                             // openChildModal: true,
//                             // operation: "sendToStore",
//                             ncontrolcode: sendToStoreId,
//                             selectedRecord,
//                             npreregno: sampleDetails.npreregno,
//                             ntransactionsamplecode: sampleDetails.ntransactionsamplecode

//                         }
//                     });
//                 }
//                 else {
//                     const conditionMap = constructOptionList(response[0].data, "nstoragecategorycode", "sstoragecategoryname", false, false, true);
//                     const conditionMaster = conditionMap.get("OptionList");

//                     const conditionUnitMap = constructOptionList(response[1].data, "nunitcode", "sunitname", false, false, true);
//                     const conditionUnitMaster = conditionUnitMap.get("OptionList");

//                     let isneedSubSampleQty = false;
//                     let approvedTreeData = [];
//                     selectedRecord["nsamplestoragelocationcode"] = [];
//                     selectedRecord["nstoragecategorycode"] = [];
//                     selectedRecord["nsampleqty"] = undefined;
//                     selectedRecord["sampleToStore"] = sampleDetails.sample === undefined ? "" : sampleDetails.sample;

//                     if (response[2].data !== null && response[2].data["isNeedSubSampleQty"] && response[2].data["isNeedSubSampleQty"] !== "") {
//                         isneedSubSampleQty = false;
//                     } else {
//                         isneedSubSampleQty = true;
//                     }

//                     if (response[2].data !== null && response[2].data.unit && response[2].data.unit.value !== undefined) {
//                         conditionUnitMaster.map(item => item.value === response[2].data.unit.value ?
//                             selectedRecord["nunitcode"] = {
//                                 "label": item.label,
//                                 "value": item.value,
//                                 "item": item.item
//                             }
//                             : "");

//                     }
//                     masterData = {
//                         ...masterData, storageCategory: conditionMaster, approvedTreeData,
//                         unitMaster: conditionUnitMaster, ...response[3].data
//                     };

//                     dispatch({
//                         type: DEFAULT_RETURN,
//                         payload: {
//                             masterData,
//                             loading: false,
//                             openChildModal: true,
//                             operation: "sendToStore",
//                             ncontrolcode: sendToStoreId,
//                             selectedRecord,
//                             npreregno: sampleDetails.npreregno,
//                             ntransactionsamplecode: sampleDetails.ntransactionsamplecode, isneedSubSampleQty

//                         }
//                     });
//                 }


//             })
//             .catch(error => {
//                 dispatch({
//                     type: DEFAULT_RETURN,
//                     payload: {
//                         loading: false
//                     }
//                 })
//                 if (error.response.status === 503) {
//                     toast.error(error.message);
//                 } else if (error.response?.status === 429) {
//                    toast.warn(intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
//                    dispatch({ type: DEFAULT_RETURN, payload: { loading: false } });
//                } else if (error.response?.status === 401 || error.response?.status === 403) {
//                     dispatch({
//                         type: UN_AUTHORIZED_ACCESS,
//                         payload: {
//                             navigation: 'forbiddenaccess',
//                             loading: false,
//                             responseStatus: error.response.status
//                         }

//                     });
//                 } else {
//                     toast.info(error.response.data);
//                 }
//             });
//     }
// }


export function UpdateExternalOrderStatus(portallist, inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post((String)(inputParam.inputData["url"]) + "/portal/UpdateMultiSampleStatus", JSON.stringify(portallist), {
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(response => {

                dispatch({
                    type: DEFAULT_RETURN, payload: {
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
                } else if (error.response !== undefined && error.response.status === 500) {
                    toast.error(error.message);
                }
                else if (error.response === undefined) {
                    toast.error(error.message);
                }
                else {
                    toast.warn(error.response.data);
                }
            })
    }
}


export function autoExternalComponentLoadBasedOnSpec(dispatchData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("/registration/getSampleBasedOnExternalOrder",
            {
                'nexternalordercode': dispatchData.selectedRecord["Order"] ? dispatchData.selectedRecord["Order"].value : -1,
                "nexternalordersamplecode": dispatchData.selectedRecord["External Sample Id"] ? dispatchData.selectedRecord["External Sample Id"].value : -1
            })
            .then(response => {
                let Sample = response.data.Sample;
                //console.log("sample:", Sample);
                let Test1 = response.data.Test
                let subSampleDataGridList = []
                let Component = []
                const Test = {};
                Sample.map((sample, index) => {
                    let saveComponent = {};
                    saveComponent["slno"] = index;
                    saveComponent['jsondata'] = {}
                    saveComponent['jsonuidata'] = {}
                    saveComponent['ncomponentcode'] = sample['ncomponentcode']
                    saveComponent['nspecsampletypecode'] = sample['nspecsampletypecode']
                    saveComponent['scomponentname'] = sample['scomponentname']
                    //saveComponent['jsondata']['ncomponentcode'] = { label: sample['scomponentname'], value: sample['ncomponentcode'] }
                    // saveComponent['jsonuidata']['ncomponentcode'] = sample['scomponentname']

                    //  saveComponent['jsondata']['scomponentname'] =  sample['scomponentname']
                    saveComponent['jsonuidata']['scomponentname'] = sample['scomponentname']

                    saveComponent['jsondata']['External Sample ID_child'] = sample['sexternalsampleid']
                    saveComponent['jsonuidata']['External Sample ID_child'] = sample['sexternalsampleid']

                    saveComponent['jsondata']['sampleorderid'] = sample['sexternalsampleid']
                    saveComponent['jsonuidata']['sampleorderid'] = sample['sexternalsampleid']

                    saveComponent['jsondata']['nsampleordercode'] = dispatchData.selectedRecord["External Sample Id"] ? dispatchData.selectedRecord["External Sample Id"].value : -1;
                    saveComponent['jsonuidata']['nsampleordercode'] = dispatchData.selectedRecord["External Sample Id"] ? dispatchData.selectedRecord["External Sample Id"].value : -1;
                    // ALPD-3575
                    saveComponent['jsondata']['subsamplecollectiondatetime'] = sample['dsamplecollectiondatetime']
                    saveComponent['jsonuidata']['subsamplecollectiondatetime'] = sample['dsamplecollectiondatetime']

                    saveComponent['jsondata']['nsampleappearancecode'] = sample['nsampleappearancecode']
                    saveComponent['jsonuidata']['nsampleappearancecode'] = sample['nsampleappearancecode']

                    saveComponent['jsondata']['ssampleappearance'] = sample['ssampleappearance']
                    saveComponent['jsonuidata']['ssampleappearance'] = sample['ssampleappearance']

                    saveComponent['jsondata']['Sample Collection Date Time_child'] = sample['dsamplecollectiondatetime']
                    saveComponent['jsonuidata']['Sample Collection Date Time_child'] = sample['dsamplecollectiondatetime']

                    saveComponent['jsondata']['Sample Appearance_child'] = {
                        'label': sample['ssampleappearance'], 'value': sample['nsampleappearancecode'],
                        'source': 'sampleappearance', 'pkey': 'nsampleappearancecode', 'nquerybuildertablecode': sample['nquerybuildertablecode']
                    }
                    saveComponent['jsonuidata']['Sample Appearance_child'] = sample['ssampleappearance']
                    // ALPD-3575
                    // saveComponent['jsondata']['Quantity_child'] = sample['nsampleqty']
                    // saveComponent['jsonuidata']['Quantity_child'] = sample['nsampleqty']

                    // saveComponent['jsondata']['Unit Name_child'] = { label: sample['sunitname'], value: sample['nunitcode'] }
                    // saveComponent['jsonuidata']['Unit Name_child'] = sample['sunitname']

                    subSampleDataGridList.push({ ...saveComponent['jsonuidata'], ...saveComponent, "Sample Collection Date Time_child": convertDateTimetoString(new Date(sample['dsamplecollectiondatetime']), dispatchData.userInfo) });
                    Component.unshift(saveComponent);
                    delete dispatchData['userInfo'];
                    const filterTest = Test1.filter(x => x.nexternalordersamplecode === sample.nexternalordersamplecode)
                    filterTest.map(x => {
                        x['slno'] = index
                    })
                    //selectedTestData=[...selectedTestData,...filterTest]
                    Test[index] = filterTest

                })
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        ...dispatchData,
                        Component,
                        selectedComponent: Component.length > 0 ? { ...Component[0] } : {},
                        selectComponent: {},
                        SelectedTest: Component.length > 0 ? Test[Component[0].slno] : [],
                        Test: Test,
                        selectedTestData: {},
                        subSampleDataGridList,
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

export function autoPortalTestLoadBasedOnSpec(dispatchData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("/registration/getSampleBasedOnPortalOrder",
            {
                'nexternalordercode': dispatchData.selectedRecord["Plant Order"] ? dispatchData.selectedRecord["Plant Order"].value : -1,
                'userinfo': dispatchData.userInfo
            })
            .then(response => {
                let Sample = response.data.Sample;
                let Test1 = response.data.Test
                let subSampleDataGridList = []
                let Component = []
                const Test = {};

                Sample.map((sample, index) => {
                    let saveComponent = {};
                    saveComponent["slno"] = index;
                    saveComponent['jsondata'] = {}
                    saveComponent['jsonuidata'] = {}
                    saveComponent['ncomponentcode'] = sample['ncomponentcode']
                    saveComponent['nspecsampletypecode'] = sample['nspecsampletypecode']
                    saveComponent['scomponentname'] = sample['scomponentname']
                    saveComponent['jsonuidata']['scomponentname'] = sample['scomponentname']
                    saveComponent['jsondata']['External Sample ID_child'] = sample['sexternalsampleid']
                    saveComponent['jsonuidata']['External Sample ID_child'] = sample['sexternalsampleid']
                    saveComponent['jsondata']['sampleorderid'] = sample['sexternalsampleid']
                    saveComponent['jsonuidata']['sampleorderid'] = sample['sexternalsampleid']
                    saveComponent['jsondata']['nsampleordercode'] = dispatchData.selectedRecord["External Sample Id"] ? dispatchData.selectedRecord["External Sample Id"].value : -1;
                    saveComponent['jsonuidata']['nsampleordercode'] = dispatchData.selectedRecord["External Sample Id"] ? dispatchData.selectedRecord["External Sample Id"].value : -1;
                    saveComponent['jsondata']['subsamplecollectiondatetime'] = sample['dsamplecollectiondatetime']
                    saveComponent['jsonuidata']['subsamplecollectiondatetime'] = sample['dsamplecollectiondatetime']

                    saveComponent['jsondata']['nsampleappearancecode'] = sample['nsampleappearancecode']
                    saveComponent['jsonuidata']['nsampleappearancecode'] = sample['nsampleappearancecode']

                    saveComponent['jsondata']['ssampleappearance'] = sample['ssampleappearance']
                    saveComponent['jsonuidata']['ssampleappearance'] = sample['ssampleappearance']

                    saveComponent['jsondata']['Sample Collection Date Time_child'] = sample['dsamplecollectiondatetime']
                    saveComponent['jsonuidata']['Sample Collection Date Time_child'] = sample['dsamplecollectiondatetime']

                    saveComponent['jsondata']['Sample Appearance_child'] = {
                        'label': sample['ssampleappearance'], 'value': sample['nsampleappearancecode'],
                        'source': 'sampleappearance', 'pkey': 'nsampleappearancecode', 'nquerybuildertablecode': sample['nquerybuildertablecode']
                    }
                    saveComponent['jsonuidata']['Sample Appearance_child'] = sample['ssampleappearance']

                    subSampleDataGridList.push({ ...saveComponent['jsonuidata'], ...saveComponent, "Sample Collection Date Time_child": convertDateTimetoString(new Date(sample['dsamplecollectiondatetime']), dispatchData.userInfo) });
                    Component.unshift(saveComponent);
                    delete dispatchData['userInfo'];
                    const filterTest = Test1.filter(x => x.nexternalordersamplecode === sample.nexternalordersamplecode)
                    filterTest.map(x => {
                        x['slno'] = index
                    })
                    Test[index] = filterTest

                })
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        ...dispatchData,
                        Component,
                        selectedComponent: Component.length > 0 ? { ...Component[0] } : {},
                        selectComponent: {},
                        SelectedTest: Test[0],
                        Test: Test,
                        subSampleDataGridList,
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

export function getBarcodeAndPrinterService(inputParam) {
    return (dispatch) => {
        dispatch(initRequest(true))
        let urlArray = [];
        const getPrinter = rsapi().post("barcode/getPrinter", inputParam.userInfo);

        const getControlBasedBarcode = rsapi().post("barcode/getControlBasedBarcode", inputParam);

        urlArray = [getPrinter, getControlBasedBarcode]
        // rsapi().post("barcode/getPrinter", inputParam.userInfo)
        Axios.all(urlArray).then(response => {
            let selectedPrinterData = {
                sprintername: {
                    value: response[0].data[0].sprintername,
                    label: response[0].data[0].sprintername,
                    item: response[0].data[0]
                },
                sbarcodename: ""
            };
            const printer = constructOptionList(response[0].data || [], "sprintername",
                "sprintername", undefined, undefined, true).get("OptionList");
            const barcode = constructOptionList(response[1].data || [], "sbarcodename",
                "sbarcodename", undefined, undefined, true).get("OptionList");
            dispatch({
                type: DEFAULT_RETURN,
                payload: {
                    masterData: {
                        ...inputParam.masterData, control: inputParam.control,
                    },
                    printer,
                    barcode,
                    selectedPrinterData,
                    operation: "printer",
                    screenName: "IDS_PRINTBARCODE",
                    //dataToPrint: inputParam.selectedGoodsIn.nrmsno,
                    ncontrolcode: inputParam.ncontrolcode,
                    loading: false,
                    openModal: true,
                    loadPrinter: true
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
                    toast.warn(intl.formatMessage({ id: error.response.data }));
                }
            });

    }

}

export function getOrderDetails(inputData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("/externalorder/getDraftExternalOrderDetails", { sexternalorderid: inputData.sexternalorderid, nexternalordertypecode: inputData.selectedRecord.nexternalordertypecode && inputData.selectedRecord.nexternalordertypecode.value, userinfo: inputData.userinfo }).then(response => {

            let masterData = { ...inputData.masterData }  //orders:response.data.ExternalOrder
            let selectedRecord = { ...inputData.selectedRecord }

            selectedRecord['orders'] = response.data.ExternalOrder
            response.data.isRecordNotAvailable && response.data.isRecordNotAvailable !== "" && toast.warn(response.data.isRecordNotAvailable);
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
                    //toast.warn(error.response.data['rtn']);
                    toast.warn(error.response.data);
                }
            })
    }
}

export function onUpdateCancelExternalOrder(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("/externalorder/onUpdateCancelExternalOrder", { ...inputParam.inputData }).then(response => {


            // if (response.data["PortalStatus"] && response.data["PortalStatus"].length > 0) {
            //     dispatch(UpdateExternalOrderStatus(response.data["PortalStatus"], inputParam));
            // }
            let masterData = { ...inputParam.inputData.masterData, orders: [] }

            // if (response.data["rtn"] === true) {
            //     toast.info(intl.formatMessage({ id: response.data["rtn"] }));
            // }

            dispatch({
                type: DEFAULT_RETURN,
                payload: {
                    selectedRecord: {},
                    masterData,
                    loading: false,
                    openModal: false
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
                }
                else {
                    //toast.warn(error.response.data['rtn']);
                    toast.warn(error.response.data);
                }

            })
    }
}

export function getOutSourceSite(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("/externalorder/getOutSourceSite", { ...inputParam.inputData })
            .then(response => {
                //console.log("response if loop");
                const siteListMap = constructOptionList(response.data || [], 'nsitecode', 'ssitename', undefined, undefined, undefined,
                    'ndefaultstatus') || [];

                const siteList = siteListMap.get("OptionList");
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        outSourceSiteList: siteList,
                        loading: false,
                        openModal: true,
                        outsourcetest: true,
                        outSourceSiteData: inputParam.inputData,
                        screenName: inputParam.screenName,
                        parentPopUpSize: "lg"

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
                    toast.warn(intl.formatMessage({
                        id: error.response.data
                    }));
                    //toast.error(error.response.data);
                }

            })
    }
}


export function getOutSourceSiteAndTest(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("/externalorder/getOutSourceSiteAndTest", { ...inputParam.inputData })
            .then(response => {
                //console.log("response if loop");
                const siteListMap = constructOptionList(response.data.Site || [], 'nsitecode', 'ssitename', undefined, undefined, undefined,
                    'ndefaultstatus') || [];
                // const testListMap = constructOptionList(response.data.Test || [], 'ntransactiontestcode', 'stestsynonym', undefined, undefined, undefined,
                // 'ndefaultstatus') || [];

                const selectedRecord = [];
                selectedRecord["ssampleid"] = inputParam.inputData.registrationtest.ssamplearno;
                selectedRecord["doutsourcedate"] = new Date();
                const siteList = siteListMap.get("OptionList");
                const str = response.data.regDate;

                const date = new Date(str);
                // const testList = testListMap.get("OptionList");
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        outSourceSiteList: siteList,
                        outSourceTestList: response.data.Test,//testList,
                        regDate: date.toDateString(),
                        loading: false,
                        openModal: true,
                        outsourcetest: true,
                        outSourceSiteData: inputParam.inputData,
                        screenName: inputParam.screenName,
                        parentPopUpSize: "lg",
                        selectedRecord

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
                    toast.warn(intl.formatMessage({
                        id: error.response.data
                    }));
                    //toast.error(error.response.data);
                }

            })
    }
}

export function outsourceTest(inputData, masterData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        //console.log("inputData:", inputData);
        rsapi().post("/externalorder/outSourceTest", { ...inputData })
            .then(response => {
                //console.log("Test OutSourced");
                const OutSourcedTestGet = response.data["OutSourcedTestGet"];
                // console.log("OutSourcedTestGet:", OutSourcedTestGet);

                masterData = {
                    ...masterData,
                    selectedTest: OutSourcedTestGet,

                    ...masterData.selectedSample.map(statusupdate => {
                        if (statusupdate.npreregno === OutSourcedTestGet[0].npreregno) {
                            // childref.ref.current.value = "";
                            statusupdate.ntransactionstatus = 33;
                            statusupdate.stransdisplaystatus = "Released";
                        }
                    }),

                    RegistrationGetTest: replaceUpdatedObject(OutSourcedTestGet, masterData.RegistrationGetTest, "ntransactiontestcode"),
                }

                toast.info(response.data["Msg"]);
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        loading: false,
                        openModal: false,
                        outsourcetest: false,
                        masterData
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

export function outsourceSampleTest(inputData, masterData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        //console.log("inputData:", inputData);
        rsapi().post("/externalorder/outSourceSampleTest", { ...inputData })
            .then(response => {
                //console.log("Test OutSourced");
                const OutSourcedTestGet = response.data["OutSourcedTestGet"];
                // console.log("OutSourcedTestGet:", OutSourcedTestGet);
                const OutSourcedSubSampleGet = response.data["OutSourcedSubSampleGet"];
                const OutsourceDetailsList = response.data["OutsourceDetailsList"];
                masterData = {
                    ...masterData,
                    selectedTest: OutSourcedTestGet, OutsourceDetailsList,
                    //selectedSubSample:OutSourcedSubSampleGet,
                    // ...masterData.selectedSample.map(statusupdate => {
                    //     if (statusupdate.npreregno === OutSourcedTestGet[0].npreregno) {
                    //      // childref.ref.current.value = "";
                    //      statusupdate.ntransactionstatus=33;
                    //      statusupdate.stransdisplaystatus="Released";
                    //     }
                    //   }),

                    RegistrationGetTest: replaceUpdatedObject(OutSourcedTestGet, masterData.RegistrationGetTest, "ntransactiontestcode"),
                    RegistrationGetSubSample: replaceUpdatedObject(OutSourcedSubSampleGet, masterData.RegistrationGetSubSample, "ntransactionsamplecode"),
                    RegistrationGetSample: replaceUpdatedObject(response.data["OutSourcedSampleGet"], masterData.RegistrationGetSample, "npreregno"),
                }

                toast.info(response.data["Msg"]);
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        loading: false,
                        openModal: false,
                        outsourcetest: false,
                        masterData,
                        selectedRecord: {},
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

export function insertMultipleRegistration(inputParam, masterData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        let requestUrl = '';
        if (inputParam.isFileupload) {
            requestUrl = rsapi().post("/registration/importRegistrationData", inputParam.formData)
        } else {
            requestUrl = rsapi().post("/registration/createRegistration", inputParam.inputData)
        }
        return requestUrl
            //  rsapi().post("/registration/createRegistration", inputParam.formData)
            .then(response => {
                if (response.data.rtn === "Success") {
                    // if (response.data["PortalStatus"] && response.data["PortalStatus"].length > 0) {
                    //     dispatch(UpdateExternalOrderStatus(response.data["PortalStatus"], inputParam));
                    // }
                    let registrationList = [...response.data["RegistrationGetSample"], ...masterData.RegistrationGetSample]
                    let RegistrationGetSample = registrationList;
                    // updatedObjectWithNewElement(response.data["RegistrationGetSample"] , masterData.RegistrationGetSample, 'Sample');
                    let selectedSample = response.data["selectedSample"];
                    let RegistrationGetSubSample = response.data["RegistrationGetSubSample"];
                    let RegistrationGetTest = response.data["RegistrationGetTest"];
                    let selectedSubSample = RegistrationGetSubSample;
                    RegistrationGetTest = sortData(RegistrationGetTest, "npreregno", "desc");
                    let selectedTest = RegistrationGetTest.length > 0 ? [RegistrationGetTest[0]] : [];
                    let regSampleExisted = inputParam.inputData && inputParam.inputData.orderTypeValue === 2 ? true : false;
                    if (inputParam.inputData.nneedsubsample) {
                        RegistrationGetSubSample = sortData(response.data["RegistrationGetSubSample"], 'npreregno', 'desc')
                        selectedSubSample = RegistrationGetSubSample.length > 0 ? [RegistrationGetSubSample[0]] : [];
                        RegistrationGetTest = RegistrationGetTest.filter(x => x.ntransactionsamplecode === selectedSubSample[0].ntransactionsamplecode)
                        selectedTest = RegistrationGetTest.length > 0 ? response.data["selectedTest"] : [];
                    }
                    // RegistrationGetTest = sortData(RegistrationGetTest, "npreregno", "desc")
                    if (inputParam.multipleselectionFlag) {
                        selectedSample = updatedObjectWithNewElement(response.data["selectedSample"], masterData.selectedSample);
                        updatedObjectWithNewElement(response.data["selectedSubSample"], masterData.RegistrationGetSubSample);
                        updatedObjectWithNewElement(response.data["selectedTest"], masterData.RegistrationGetTest);
                        RegistrationGetSubSample = masterData.RegistrationGetSubSample;
                        RegistrationGetTest = masterData.RegistrationGetTest;
                    }


                    masterData = {
                        ...masterData, ...response.data,
                        selectedSample, selectedSubSample, selectedTest,
                        RegistrationGetSubSample, RegistrationGetTest, RegistrationGetSample
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
                            loading: false, showConfirmAlert: false, preregConfirmMessage: undefined, loadImportFileData: false, loadImportSampleCountData: false, openModal: false,
                            openPortal: false,
                            loadEsign: false,
                            showConfirmAlert: false,
                        }
                    })
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



export function insertRegSample(inputParam, masterData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        //console.log("inputData:", inputData);
        rsapi().post("/registration/importRegistrationSample", inputParam.formData)
            .then(response => {
                if (response.data.rtn === "Success") {
                    // if (response.data["PortalStatus"] && response.data["PortalStatus"].length > 0) {
                    //     dispatch(UpdateExternalOrderStatus(response.data["PortalStatus"], inputParam));
                    // }
                    // Commented because insertRegSample is for smtl not for portal
                    let registrationList = [...response.data["RegistrationGetSample"], ...masterData.RegistrationGetSample]
                    let RegistrationGetSample = registrationList;
                    // updatedObjectWithNewElement(response.data["RegistrationGetSample"] , masterData.RegistrationGetSample, 'Sample');
                    let selectedSample = response.data["selectedSample"];
                    let RegistrationGetSubSample = response.data["RegistrationGetSubSample"];
                    let RegistrationGetTest = response.data["RegistrationGetTest"];
                    let selectedSubSample = RegistrationGetSubSample;
                    RegistrationGetTest = sortData(RegistrationGetTest, "npreregno", "desc");
                    let selectedTest = RegistrationGetTest.length > 0 ? [RegistrationGetTest[0]] : [];
                    let regSampleExisted = inputParam.inputData && inputParam.inputData.orderTypeValue === 2 ? true : false;
                    if (inputParam.inputData.nneedsubsample) {
                        RegistrationGetSubSample = sortData(response.data["RegistrationGetSubSample"], 'npreregno', 'desc')
                        selectedSubSample = RegistrationGetSubSample.length > 0 ? [RegistrationGetSubSample[0]] : [];
                        RegistrationGetTest = RegistrationGetTest.filter(x => x.ntransactionsamplecode === selectedSubSample[0].ntransactionsamplecode)
                        selectedTest = RegistrationGetTest.length > 0 ? response.data["selectedTest"] : [];
                    }
                    // RegistrationGetTest = sortData(RegistrationGetTest, "npreregno", "desc")
                    if (inputParam.multipleselectionFlag) {
                        selectedSample = updatedObjectWithNewElement(response.data["selectedSample"], masterData.selectedSample);
                        updatedObjectWithNewElement(response.data["selectedSubSample"], masterData.RegistrationGetSubSample);
                        updatedObjectWithNewElement(response.data["selectedTest"], masterData.RegistrationGetTest);
                        RegistrationGetSubSample = masterData.RegistrationGetSubSample;
                        RegistrationGetTest = masterData.RegistrationGetTest;
                    }


                    masterData = {
                        ...masterData, ...response.data,
                        selectedSample, selectedSubSample, selectedTest,
                        RegistrationGetSubSample, RegistrationGetTest, RegistrationGetSample
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
                            //showConfirmAlert: false, 
                            // preregConfirmMessage: undefined,
                            //loadImportFileData:false,
                            //loadImportSampleCountData:false, 
                            openModal: false,
                            // openPortal:false,
                            loadEsign: false,
                            //showConfirmAlert: false,
                        }
                    })
                }
            })
            ////ALPD-5315->Added by Dhanushya RI, To apply the logic of method validity when import data
            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false, showConfirmAlert: false, preregConfirmMessage: undefined } })

                // dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
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
                    // toast.warn(error.response.data);
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
                    else if (error.response.data) {
                        toast.warn(error.response.data);
                        dispatch({
                            type: DEFAULT_RETURN, payload: {
                                loading: false,
                                showConfirmAlert: false, preregConfirmMessage: undefined
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
export function getExternalOrderTypeForMapping(inputParem) {
    return function (dispatch) {
        let masterData = inputParem.inputParam.masterData;
        let selectedSample = {};
        if (masterData["selectedSample"].length > 1) {
            inputParem.masterData.selectedSample.map(x => {
                if (x.npreregno === inputParem.inputParam["subSample"].npreregno) {
                    selectedSample = x;
                }
            });

        } else {
            selectedSample = masterData.selectedSample[0];
        }
        if (selectedSample && selectedSample.orderTypeValue === orderType.MANUAL) {

            if (inputParem.inputParam.subSample.nordertypecode === orderType.MANUAL && inputParem.inputParam.subSample.ntransactionstatus !== transactionStatus.RELEASED
                && inputParem.inputParam.subSample.ntransactionstatus !== transactionStatus.REJECT
                && inputParem.inputParam.subSample.ntransactionstatus !== transactionStatus.CANCELLED) {
                dispatch(initRequest(true));
                rsapi().post("/registration/getExternalOrderForMapping", inputParem)
                    .then(response => {
                        const orderListMap = constructOptionList(response.data.externalOrderList || [], "nexternalordersamplecode",
                            "sexternalsampleid", "nsorter", "ascending", false);
                        const orderList = orderListMap.get("OptionList")
                        if (masterData["selectedSubSample"].length > 1) {
                            masterData["selectedSubSample"] = [];
                            masterData["selectedSubSample"].push(inputParem.inputParam["subSample"]);
                        }
                        // if (masterData["selectedSample"].length > 1) {
                        //     inputParem.masterData.selectedSample.map(x => {
                        //         if(x.npreregno === inputParem.inputParam["subSample"].npreregno)
                        //         {
                        //             selectedSample = x;
                        //         }
                        //     });

                        // } else {
                        //     selectedSample = masterData.selectedSample[0];
                        // }

                        dispatch({
                            type: DEFAULT_RETURN,
                            payload: {
                                orderList, orderDetails: { ...inputParem.inputParam, selectedSample: selectedSample },
                                masterData: masterData, loading: false, showFilter: false, MappingFields: true, showQRCode: false,
                                openChildModal: true, selectedDetailField: {}, selectedRecord: {}
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
            } else {
                if (inputParem.inputParam.subSample.ntransactionstatus === transactionStatus.RELEASED) {
                    toast.info(intl.formatMessage({ id: "IDS_RELEASEDSAMPLESCONNOTBEMAPPED" }));
                } else if (inputParem.inputParam.subSample.ntransactionstatus === transactionStatus.REJECT) {
                    toast.info(intl.formatMessage({ id: "IDS_REJECTEDSAMPLESCONNOTBEMAPPED" }));
                } else if (inputParem.inputParam.subSample.ntransactionstatus === transactionStatus.CANCELLED) {
                    toast.info(intl.formatMessage({ id: "IDS_CANCELLEDSAMPLESCONNOTBEMAPPED" }));
                } else {
                    toast.info(intl.formatMessage({ id: "IDS_ALREADYEXTERNALMAPPED" }));
                }
            }
        } else {
            toast.info(intl.formatMessage({ id: "IDS_SELECTMANUALORDER" }));
        }
    }
}
export function getExternalOrderForMapping(inputParem) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("/registration/getExternalOrderForMapping", inputParem)
            .then(response => {
                const orderListMap = constructOptionList(response.data.externalOrderList || [], "nexternalordersamplecode",
                    "sexternalsampleid", "nsorter", "ascending", false);
                const orderList = orderListMap.get("OptionList")
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        orderList, selectedRecord: inputParem.selectedRecord,
                        masterData: inputParem.masterData, loading: false, showFilter: false, MappingFields: true, showQRCode: false,
                        openChildModal: true, selectedDetailField: {}
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
export function orderMapping(inputParem) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("/registration/orderMapping", inputParem.inputData)
            .then(response => {
                // if (response.data["isPortalData"] && response.data["PortalStatus"] && response.data["PortalStatus"].length > 0) {
                //     dispatch(UpdateExternalOrderStatus(response.data["PortalStatus"], inputParem));
                // }
                replaceUpdatedObject(response.data["RegistrationGetSample"], inputParem.masterData.RegistrationGetSample, "npreregno");
                replaceUpdatedObject(response.data["RegistrationGetSubSample"], inputParem.masterData.RegistrationGetSubSample, "ntransactionsamplecode");
                replaceUpdatedObject(response.data["RegistrationGetTest"], inputParem.masterData.RegistrationGetTest, "ntransactiontestcode");
                let masterData = {
                    ...inputParem.masterData,
                    selectedSample: replaceUpdatedObject(response.data["selectedSample"], inputParem.masterData.selectedSample, "npreregno"),
                    selectedSubSample: replaceUpdatedObject(response.data["selectedSubSample"], inputParem.masterData.selectedSubSample, "ntransactionsamplecode"),
                    selectedTest: replaceUpdatedObject(response.data["selectedTest"], inputParem.masterData.selectedTest, "ntransactiontestcode"),
                };
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData: masterData,
                        loading: false, showFilter: false, openChildModal: false, showQRCode: false, selectedDetailField: undefined,
                        orderList: []
                    }
                });
                if (response.data.rtn === "Success") {
                    toast.info(intl.formatMessage({ id: "IDS_EXTERNALSAMPLEMAPPEDSUCCESSFULLY" }));
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

export function orderRecords(inputData) {
    return function (dispatch) {
        rsapi().post("/externalorder/getExternalOrderType", inputData)
            .then(response => {
                let selectedRecord = { ...inputData.selectedRecord }
                let externalOrderType = [];
                response.data.ExternalOrderType.map(item => item.nexternalordertypecode !== -1 && externalOrderType.push(item));
                let externalOrderTypeMap = constructOptionList(externalOrderType || [], "nexternalordertypecode",
                    "sexternalordertypename", "nexternalordertypecode", "descending", false);
                const externalOrderTypeList = externalOrderTypeMap.get("OptionList")
                // let selectedExternalOrderType = externalOrderTypeList[0];
                // selectedRecord["selectedExternalOrderType"] = selectedExternalOrderType;
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        ncontrolcode: inputData.CancelExternalOrderSampleId,
                        operation: inputData.operation,
                        loadPrinter: false,
                        openModal: true,
                        parentPopUpSize: 'xl',
                        screenName: inputData.screenName,
                        loading: false,
                        masterData: inputData.masterData,
                        externalOrderTypeList,
                        // selectedRecord
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
//ALPD-3615--Start
export const getAdhocTest = (inputParam, masterData, ncontrolCode) => {
    return (dispatch) => {
        const { userInfo } = { ...inputParam };
        let ntransactionsamplecode = -1;
        let requestUrl = '';

        if (masterData && masterData.RealRegSubTypeValue.nneedsubsample) {
            if (masterData["selectedSubSample"].length > 1 ||
                masterData["selectedSubSample"]
                    .findIndex(x => x[inputParam.primaryKeyName] === inputParam["sampleadhoctest"][inputParam.primaryKeyName])
                === -1) {
                inputParam.editRegParam["getSubSampleChildDetail"] = true;
            }
            masterData["selectedSubSample"] = [];
            masterData["selectedSubSample"].push(inputParam["sampleadhoctest"]);
            const selectedSpec = getSameRecordFromTwoArrays(masterData.selectedSample, masterData.selectedSubSample, "npreregno");
            inputParam.sampleadhoctest['nallottedspeccode'] = selectedSpec[0].nallottedspeccode;
            inputParam.sampleadhoctest['sspecname'] = selectedSpec[0].sspecname;
            inputParam.editRegParam["npreregno"] = inputParam["sampleadhoctest"]["npreregno"];
            inputParam.editRegParam["checkBoxOperation"] = checkBoxOperation.SINGLESELECT;
            inputParam.editRegParam["nfilterstatus"] = inputParam["sampleadhoctest"]["ntransactionstatus"];
            inputParam.editRegParam["napprovalconfigcode"] = inputParam["sampleadhoctest"]["napprovalconfigcode"];
            ntransactionsamplecode = inputParam.sampleadhoctest[inputParam.primaryKeyName];
            inputParam.editRegParam['nallottedspeccode'] = selectedSpec[0].nallottedspeccode;
        }
        else {
            if (masterData["selectedSample"].length > 1 ||
                masterData["selectedSample"]
                    .findIndex(x => x[inputParam.primaryKeyName] === inputParam["sampleadhoctest"][inputParam.primaryKeyName])
                === -1) {
                inputParam.editRegParam["getSampleChildDetail"] = true;
            }
            masterData["selectedSample"] = [];
            masterData["selectedSample"].push(inputParam["sampleadhoctest"]);
        }
        const npreregno = inputParam["sampleadhoctest"].npreregno;
        if (inputParam["sampleadhoctest"] && inputParam["sampleadhoctest"].ntransactionstatus !== transactionStatus.REJECT && inputParam["sampleadhoctest"] && inputParam["sampleadhoctest"].ntransactionstatus !== transactionStatus.CANCELLED) {
            if (inputParam["sampleadhoctest"] && inputParam["sampleadhoctest"].ntransactionstatus !== transactionStatus.RELEASED) {


                inputParam["nallottedspeccode"] = inputParam["sampleadhoctest"]["nallottedspeccode"]
                dispatch(initRequest(true));
                if (masterData && masterData.RealRegSubTypeValue.nneedsubsample) {
                    requestUrl = rsapi().post("/registration/getAdhocTest", {
                        ...inputParam.editRegParam, ntransactionsamplecode,
                        UserInfo: userInfo
                    })
                } else {
                    requestUrl = rsapi().post("/registration/getAdhocTest", {
                        ...inputParam.editRegParam, UserInfo: userInfo, npreregno, nallottedspeccode: inputParam.sampleadhoctest.nallottedspeccode || -1
                    })
                }
                return requestUrl

                    .then(response => {
                        let testData = [];
                        const TestDataMap = constructOptionList(response.data['AdhocTest'] || [], "ntestcode",
                            "stestsynonym", undefined, undefined, true);
                        testData = TestDataMap.get("OptionList");
                        let selectedRecord = {};
                        selectedRecord['visibleadhoctest'] = transactionStatus.NO;
                        selectedRecord['specName'] = inputParam.sampleadhoctest['sspecname'];
                        if (masterData && masterData.RealRegSubTypeValue.nneedsubsample) {
                            if (inputParam.editRegParam["getSubSampleChildDetail"] === true) {
                                masterData = { ...masterData, ...response.data["SubSampleChildDetail"] };
                            }
                        }
                        else {
                            if (inputParam.editRegParam["getSampleChildDetail"] === true) {
                                masterData = sortData({ ...masterData, ...response.data["SampleChildDetail"] })
                            }
                        }

                        dispatch({
                            type: DEFAULT_RETURN,
                            payload: {
                                masterData: masterData,
                                availableAdhocTest: testData,
                                loadAdhocTest: true,
                                loading: false, ncontrolCode,
                                screenName: "IDS_ADHOCTEST",
                                operation: "create",
                                openModal: true,
                                parentPopUpSize: "lg",
                                selectedRecord: selectedRecord,
                                showSample: undefined,
                                // testskip and take added by gowtham on 04 July 2025 - ALPDJ21-7 - Sample registration screen -> Tests getting disappeared in specific scenario.
                                testskip: 0,
                                testtake: undefined,
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
            }
            else {
                toast.info(intl.formatMessage({ id: "IDS_TESTCANNOTBEFORRELEASEDSAMPLES" }));
                // if (inputParam.addTestParam["getSampleChildDetail"] === true) {
                //     masterData = sortData({ ...masterData, ...response[1].data["SampleChildDetail"] })
                // }
            }
        }
        else {
            toast.info(intl.formatMessage({ id: "IDS_SAMPLEISREJECTEDORCANCELLED" }));
            // if (inputParam.editRegParam["getSampleChildDetail"] === true) {
            //     masterData = sortData({ ...masterData, ...response[1].data["SampleChildDetail"] })
            // }
        }

    }


}
export const createAdhocTest = (inputParam, masterData, modalName) => {
    return (dispatch) => {
        dispatch(initRequest(true));
        rsapi().post(inputParam.classUrl + "/" + inputParam.operation + inputParam.methodUrl, { ...inputParam.inputData })
            .then(response => {
                let RegistrationGetTest = updatedObjectWithNewElement(masterData["RegistrationGetTest"], response.data["RegistrationGetTest"]);
                //let RegistrationGetSubSample = updatedObjectWithNewElement(masterData["RegistrationGetSubSample"], response.data["RegistrationGetSubSample"]);

                masterData = {
                    ...masterData,
                    RegistrationGetTest: sortData(RegistrationGetTest, "descending", "ntransactiontestcode"),
                    RegistrationGetSubSample: sortData(response.data["RegistrationGetSubSample"], "descending", "ntransactionsamplecode"),
                    selectedTest: response.data["RegistrationGetTest"],
                    //  selectedSubSample: response.data["RegistrationGetSubSample"],
                    selectedSubSample: response.data["selectedSubSample"],
                    RegistrationParameter: response.data.RegistrationParameter,
                    RegistrationGetSample: replaceUpdatedObject(response.data.selectedSample, masterData.RegistrationGetSample, 'npreregno')
                }
                let respObject = {
                    masterData,
                    [modalName]: false,
                    loading: false,
                    loadChildTest: false,
                    showSample: undefined,
                    openModal: false,
                    loadEsign: false,
                    selectedRecord: {},
                    showConfirmAlert: false,
                    createTestConfirmMessage: undefined,
                    //ALPD-4225--Vignesh R(24-05-2024)--when search the additional  filter the adhoc test popup are showing in sample reg screen.
                    loadAdhocTest: false
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
                                loading: false,
                                loadChildTest: false,
                                showSample: undefined,
                                loadAdhocTest: inputParam.inputData.loadAdhocTest
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
                                createTestConfirmMessage: undefined,
                                loadAdhocTest: false,
                                loadEsign: false,


                            }
                        });
                        toast.info(error.response.data.rtn);
                    }
                }
            });
    }
}
//ALPD-3615--End

export const copySampleService = (inputData, masterData) => {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("/registration/copySample", inputData)
            .then(response => {
                // masterData = {
                //     ...masterData,
                //     ...response.data
                // };
                if (response.data.rtn === "Success") {
                    // if (response.data["isPortalData"] && response.data["PortalStatus"] && response.data["PortalStatus"].length > 0) {
                    //     dispatch(UpdateExternalOrderStatus(response.data["PortalStatus"], inputParam));
                    // }

                    let RegistrationGetSample = updatedObjectWithNewElement(response.data["RegistrationGetSample"], masterData.RegistrationGetSample);
                    let selectedSample = response.data["selectedSample"];
                    let RegistrationGetSubSample = response.data["RegistrationGetSubSample"];
                    let RegistrationGetTest = response.data["RegistrationGetTest"];
                    let selectedSubSample = RegistrationGetSubSample;
                    RegistrationGetTest = sortData(RegistrationGetTest, "npreregno", "desc");
                    let selectedTest = RegistrationGetTest.length > 0 ? [RegistrationGetTest[0]] : [];
                    let regSampleExisted = inputData && inputData.orderTypeValue === 2 ? true : false;
                    if (inputData.nneedsubsample) {
                        RegistrationGetSubSample = sortData(response.data["RegistrationGetSubSample"], 'npreregno', 'desc')
                        selectedSubSample = RegistrationGetSubSample.length > 0 ? [RegistrationGetSubSample[0]] : [];
                        RegistrationGetTest = RegistrationGetTest.filter(x => x.ntransactionsamplecode === selectedSubSample[0].ntransactionsamplecode)
                        selectedTest = RegistrationGetTest.length > 0 ? response.data["selectedTest"] : [];
                    }
                    // RegistrationGetTest = sortData(RegistrationGetTest, "npreregno", "desc")
                    if (inputData.multipleselectionFlag) {
                        selectedSample = updatedObjectWithNewElement(response.data["selectedSample"], masterData.selectedSample);
                        updatedObjectWithNewElement(response.data["selectedSubSample"], masterData.RegistrationGetSubSample);
                        updatedObjectWithNewElement(response.data["selectedTest"], masterData.RegistrationGetTest);
                        RegistrationGetSubSample = masterData.RegistrationGetSubSample;
                        RegistrationGetTest = masterData.RegistrationGetTest;
                    }

                    masterData = {
                        ...masterData, ...response.data,
                        selectedSample, selectedSubSample, selectedTest,
                        RegistrationGetSubSample, RegistrationGetTest, RegistrationGetSample
                    }
                    let respObject = {
                        masterData,
                        //...inputData,
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
                        isDynamicViewSlideOut: false
                    }
                    let postParamList = [];
                    dispatch(postCRUDOrganiseTransSearch(postParamList, respObject))
                } else {
                    toast.warn(response.data.rtn);
                    dispatch({ type: DEFAULT_RETURN, payload: { loading: false, showConfirmAlert: false, preregConfirmMessage: undefined } })
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

//ALPD-4914-To get previously saved filter details when click the filter name,done by Dhanushya RI
export function getRegistrationFilter(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("registration/getRegistrationFilter", { ...inputParam.inputData })
            .then(response => {
                let masterData = {
                    ...inputParam.masterData,
                    ...response.data
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
                }
                let respObject = {};
                // if (inputData.selectedFilter) {
                //     respObject = { selectedFilter: { ...inputData.selectedFilter } };
                // }
                sortData(masterData);
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        nfilternamecode: inputParam.inputData.nfilternamecode,
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
                        modalShow: false,
                        ...respObject,
                        activeSampleTab: inputParam.inputData.activeSampleTab, regSampleExisted: false
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

export function getTestMethod(inputParam, activeTestTab, selectedRecord) {
    return function (dispatch) {
        dispatch(initRequest(true));
        let masterData = inputParam.masterData;
        let getTestDetail = false;
        if (masterData["selectedTest"].length > 1 ||
            masterData["selectedTest"]
                .findIndex(x => x[inputParam.primaryKeyName] === inputParam["mastertoedit"][inputParam.primaryKeyName])
            === -1) {
            getTestDetail = true;
        }

        masterData["selectedTest"] = [];
        masterData["selectedTest"].push(inputParam["mastertoedit"]);

        rsapi().post("registration/getTestMethod", {
            userinfo: inputParam.userinfo,
            ntransactiontestcode: String(inputParam["mastertoedit"].ntransactiontestcode),
            nneedjoballocation: inputParam.nneedjoballocation,
            nneedmyjob: inputParam.nneedmyjob,
            getTestChildDetail: getTestDetail,
            ntype: checkBoxOperation.SINGLESELECT,
            npreregno: masterData.selectedSample && masterData.selectedSample.length > 0 ?
                String(masterData.selectedSample.map(x => x.npreregno).join(",")) : "-1",
            ndesigntemplatemappingcode: masterData && masterData.RealDesignTemplateMappingValue.ndesigntemplatemappingcode,
            ntransactionsamplecode: masterData.selectedSubSample && masterData.selectedSubSample.length > 0 ?
                String(masterData.selectedSubSample.map(sample => sample.ntransactionsamplecode).join(",")) : "-1",
            activeTestTab: activeTestTab || "IDS_PARAMETERRESULTS"

        })
            .then(response => {
                const testMethodListMap = constructOptionList(response.data.TestMethod || [], "nmethodcode",
                    "smethodname", undefined, undefined, true);
                const testMethodList = testMethodListMap.get("OptionList");

                masterData = {
                    ...masterData, ...response.data,
                    selectedTest: replaceUpdatedObject(response.data["selectedTest"], masterData.selectedTest, "ntransactiontestcode"),
                    RegistrationGetTest: replaceUpdatedObject(response.data["RegistrationGetTest"], masterData.RegistrationGetTest, "ntransactiontestcode"),
                }
                //Added by Vignesh R(06-08-2025) for JIRA ID:ALPDJ21-49 edit test instrument category.
                if (masterData.selectedTest[0].nmethodcode !== transactionStatus.NA) {
                    const filteredItem = testMethodList.filter(
                        item => item.value === masterData.selectedTest[0].nmethodcode
                    );
                    selectedRecord["nmethodcode"] = filteredItem[0];
                }
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        screenName: intl.formatMessage({ id: "IDS_METHOD" }),
                        masterData,
                        loading: false,
                        testMethodList: testMethodList,
                        openModal: true,
                        needMethod: true,
                        operation: "update",
                        testskip: 0,
                        testtake: inputParam.testtake,
                        //ALPD-5511--Added by Vignesh R(08-04-2025)-->Esign added
                        ncontrolCode: inputParam.ncontrolCode,
                        subsampleskip: 0,
                        subsampletake: inputParam.subsampletake,
                        selectedRecord: selectedRecord
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
export function onUpdateTestMethod(inputParam, masterData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        let requestUrl = rsapi().post("/registration/updateTestMethod", inputParam.inputData)
        return requestUrl
            .then(response => {
                sortData(response.data);
                masterData = {
                    ...masterData,
                    RegistrationGetTest: replaceUpdatedObject(response.data["RegistrationGetTest"], masterData.RegistrationGetTest, "ntransactiontestcode"),
                }

                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData,
                        openModal: false,
                        loading: false,
                        loadEsign: false,
                        needMethod: false,
                        selectedRecord: {},
                        screenName: intl.formatMessage({ id: "IDS_METHOD" })
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
                }
                else {
                    toast.warn(error.response.data);
                }
            })
    }
}


//Added by Vignesh R(06-08-2025) for JIRA ID:ALPDJ21-49 edit test instrument category.
//start
export function getTestInstrumentCat(inputParam, activeTestTab, selectedRecord) {
    return function (dispatch) {
        dispatch(initRequest(true));
        let masterData = inputParam.masterData;
        let getTestDetail = false;
        if (masterData["selectedTest"].length > 1 ||
            masterData["selectedTest"]
                .findIndex(x => x[inputParam.primaryKeyName] === inputParam["mastertoedit"][inputParam.primaryKeyName])
            === -1) {
            getTestDetail = true;
        }

        masterData["selectedTest"] = [];
        masterData["selectedTest"].push(inputParam["mastertoedit"]);

        rsapi().post("registration/getTestInstrumentCategory", {
            userinfo: inputParam.userinfo,
            ntransactiontestcode: String(inputParam["mastertoedit"].ntransactiontestcode),
            nneedjoballocation: inputParam.nneedjoballocation,
            nneedmyjob: inputParam.nneedmyjob,
            getTestChildDetail: getTestDetail,
            ntype: checkBoxOperation.SINGLESELECT,
            npreregno: masterData.selectedSample && masterData.selectedSample.length > 0 ?
                String(masterData.selectedSample.map(x => x.npreregno).join(",")) : "-1",
            ndesigntemplatemappingcode: masterData && masterData.RealDesignTemplateMappingValue.ndesigntemplatemappingcode,
            ntransactionsamplecode: masterData.selectedSubSample && masterData.selectedSubSample.length > 0 ?
                String(masterData.selectedSubSample.map(sample => sample.ntransactionsamplecode).join(",")) : "-1",
            activeTestTab: activeTestTab || "IDS_PARAMETERRESULTS"

        })
            .then(response => {
                const testInstrumentCategoryListMap = constructOptionList(response.data.TestInstrumentCategory || [], "ninstrumentcatcode",
                    "sinstrumentcatname", undefined, undefined, true);
                const testInstrumentCategoryList = testInstrumentCategoryListMap.get("OptionList");

                masterData = {
                    ...masterData, ...response.data,
                    selectedTest: replaceUpdatedObject(response.data["selectedTest"], masterData.selectedTest, "ntransactiontestcode"),
                    RegistrationGetTest: replaceUpdatedObject(response.data["RegistrationGetTest"], masterData.RegistrationGetTest, "ntransactiontestcode"),
                }
                if (masterData.selectedTest[0].ninstrumentcatcode !== transactionStatus.NA) {
                    const filteredItem = testInstrumentCategoryList.filter(
                        item => item.value === masterData.selectedTest[0].ninstrumentcatcode
                    );
                    selectedRecord["ninstrumentcatcode"] = filteredItem[0];
                }

                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        screenName: intl.formatMessage({ id: "IDS_INSTRUMENTCATEGORY" }),
                        masterData,
                        loading: false,
                        selectedRecord,
                        testInstrumentCategoryList: testInstrumentCategoryList,
                        openModal: true,
                        needInstrumentCategory: true,
                        operation: "update",
                        testskip: 0,
                        testtake: inputParam.testtake,
                        //ALPD-5511--Added by Vignesh R(08-04-2025)-->Esign added
                        ncontrolCode: inputParam.ncontrolCode,
                        subsampleskip: 0,
                        subsampletake: inputParam.subsampletake
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


export function onUpdateTestInstrumentCategory(inputParam, masterData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        let requestUrl = rsapi().post("/registration/updateTestInstrumentCategory", inputParam.inputData)
        return requestUrl
            .then(response => {
                sortData(response.data);
                masterData = {
                    ...masterData,
                    RegistrationGetTest: replaceUpdatedObject(response.data["RegistrationGetTest"], masterData.RegistrationGetTest, "ntransactiontestcode"),
                }

                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData,
                        openModal: false,
                        loading: false,
                        loadEsign: false,
                        needInstrumentCategory: false,
                        selectedRecord: {},
                        screenName: intl.formatMessage({ id: "IDS_INSTRUMENTCATEGORY" })
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
                }
                else {
                    toast.warn(error.response.data);
                }
            })
    }
}
//end


export function getTestPackage(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));

        rsapi().post("registration/getTestPackage",
            {
                userinfo: inputParam.userinfo, nallottedspeccode: inputParam.nallottedspeccode, specBasedComponent: inputParam.specBasedComponent
            })
            .then(response => {
                const testPackageListMap = constructOptionList(response.data.TestPackage || [], "ntestpackagecode",
                    "stestpackagename", undefined, undefined, true);
                const testPackageList = testPackageListMap.get("OptionList");
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        screenName: inputParam.screenName,
                        masterData: inputParam.masterData,
                        loading: false,
                        testPackageList,
                        loadtestpackage: true,
                        selectedRecordTestPackage: undefined
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

export function getSubSampleBasedOnTestPackage(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));

        rsapi().post("registration/getSubSampleBasedOnTestPackage",
            {
                userinfo: inputParam.userinfo, nallottedspeccode: inputParam.allottedspeccode, specBasedComponent: inputParam.specBasedComponent,
                ntestpackagecode: inputParam.ntestpackagecode, nspecsampletypecode: inputParam.nspecsampletypecode
            })
            .then(response => {
                let Sample = response.data.TestContainerType;
                let Test1 = response.data.TestMaster
                let subSampleDataGridList = []
                let ncontainertypecode = Sample.map(x => x.ncontainertypecode).join(",")
                let Test = [];
                let Component = [];
                let dateName;
                Sample.map((sample, index) => {
                    let saveComponent = {};
                    saveComponent["slno"] = index;
                    //saveComponent["slno"] = inputParam.Component.length>0?(inputParam.Component.length + index+1):index;
                    saveComponent['jsondata'] = {}
                    saveComponent['jsonuidata'] = {}
                    saveComponent['ncomponentcode'] = -1;
                    saveComponent['nspecsampletypecode'] = inputParam.allottedspeccode
                    saveComponent['nallottedspeccode'] = inputParam.allottedspeccode
                    inputParam.subSampleLayout.map(row => {
                        return row.children.map(column => {
                            return column.children.map(component => {
                                if (component.hasOwnProperty("children")) {
                                    return component.children.map(componentrow => {
                                        if (componentrow.inputtype === "combo") {
                                            if (componentrow.name === 'Sample Type_child') {
                                                saveComponent['jsondata'][componentrow.label] = sample['scontainertype']
                                                saveComponent['jsonuidata'][componentrow.label] = sample['scontainertype']
                                            }
                                            else {
                                                saveComponent['jsondata'][componentrow.label] = -1;
                                                saveComponent['jsonuidata'][componentrow.label] = "";
                                            }
                                        }
                                        else if (componentrow.inputtype === "date") {
                                            // if (componentrow.timezone) {
                                            //     selectComponent[`tz${componentrow.label}`] = objComponent["jsondata"][`tz${componentrow.label}`] ?
                                            //         objComponent["jsondata"][`tz${componentrow.label}`] :
                                            //         defaulttimezone ? defaulttimezone : -1
                                            // }
                                            if (componentrow.name === 'subsamplecollectiondatetime') {
                                                saveComponent['jsondata'][componentrow.label] = convertDateTimetoStringDBFormat(new Date(), inputParam.userinfo)
                                                saveComponent['jsonuidata'][componentrow.label] = convertDateTimetoStringDBFormat(new Date(), inputParam.userinfo)
                                                dateName = componentrow.label;
                                            }
                                        }
                                        else {
                                            saveComponent['jsondata'][componentrow.label] = ""
                                            saveComponent['jsonuidata'][componentrow.label] = ""
                                        }
                                        //return null;
                                    })
                                }
                                else {
                                    if (component.inputtype === "combo") {
                                        if (component.name === 'Sample Type_child') {
                                            saveComponent['jsondata'][component.label] = sample['scontainertype']
                                            saveComponent['jsonuidata'][component.label] = sample['scontainertype']
                                            saveComponent['jsondata'][component.label] = {
                                                'label': sample['scontainertype'],
                                                'value': sample['ncontainertypecode'],
                                                'source': 'containertype',
                                                'pkey': 'ncontainertypecode',
                                                'nquerybuildertablecode': 39
                                            }
                                        }
                                    }
                                    else if (component.inputtype === "date") {
                                        // if (component.timezone) {
                                        //     selectComponent[`tz${component.label}`] = objComponent["jsondata"][`tz${component.label}`] ?
                                        //         objComponent["jsondata"][`tz${component.label}`] :
                                        //         defaulttimezone ? defaulttimezone : -1
                                        // }
                                        if (component.name === 'subsamplecollectiondatetime') {
                                            saveComponent['jsondata'][component.label] = convertDateTimetoStringDBFormat(new Date(), inputParam.userinfo)
                                            saveComponent['jsonuidata'][component.label] = convertDateTimetoStringDBFormat(new Date(), inputParam.userinfo)
                                            dateName = component.label;
                                        }
                                    }
                                    else {
                                        saveComponent['jsondata'][component.label] = ""
                                        saveComponent['jsonuidata'][component.label] = ""
                                    }
                                    //return saveComponent;
                                }
                            }
                            )
                        })
                    })

                    //  saveComponent['jsondata']['Sample_child'] = sample['scontainertype']
                    //  saveComponent['jsonuidata']['Sample_child'] = sample['scontainertype']

                    // saveComponent['jsondata']['Remarks_child'] = ""
                    // saveComponent['jsonuidata']['Remarks_child'] = ""

                    // saveComponent['jsondata']['sampleorderid'] = sample['scontainertype']
                    //saveComponent['jsonuidata']['sampleorderid'] = sample['scontainertype']

                    // saveComponent['jsondata']['Sample Type_child'] = {
                    //     'label': sample['scontainertype'],
                    //     'value': sample['ncontainertypecode'],
                    //     'source': 'containertype',
                    //     'pkey': 'ncontainertypecode',
                    //     'nquerybuildertablecode': 39
                    // }
                    //saveComponent['jsonuidata']['Sample Type_child'] = sample['scontainertype']
                    // saveComponent['jsondata']['Sample Collection Date Time_child'] =convertDateTimetoStringDBFormat(new Date(), inputParam.userinfo) 
                    //saveComponent['jsonuidata']['Sample Collection Date Time_child'] = convertDateTimetoStringDBFormat(new Date(), inputParam.userinfo) 

                    subSampleDataGridList.push({ ...saveComponent['jsonuidata'], ...saveComponent, [dateName]: convertDateTimetoString(new Date(), inputParam.userinfo) });
                    Component.unshift(saveComponent);
                    //delete inputParam['userinfo'];
                    const filterTest = Test1.filter(x => x.ncontainertypecode === sample.ncontainertypecode)
                    filterTest.map(x => {
                        x['slno'] = index;
                        //  x['slno'] = inputParam.Component.length>0?(inputParam.Component.length + index+1):index;
                        delete (x.dmodifieddate)
                    })
                    Test[index] = filterTest
                    // Test[inputParam.Component.length>0?(inputParam.Component.length + index+1):index] = filterTest
                })
                //Component=[...inputParam.Component,...Component]
                //Test=[...inputParam.Test,...Test]
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        screenName: inputParam.screenName,
                        masterData: inputParam.masterData,
                        loading: false,
                        loadtestpackage: false,
                        //selectedRecordTestPackage:undefined,

                        Component,
                        selectedComponent: Component.length > 0 ? { ...Component[0] } : {},
                        selectComponent: {},
                        SelectedTest: Component.length > 0 ? Test[Component[0].slno] : [],
                        Test: Test,
                        selectedTestData: {},
                        subSampleDataGridList, ntestpackagecode: inputParam.ntestpackagecode,
                        selectedRecordTestPackage: inputParam.selectedRecordTestPackage
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