import rsapi from '../rsapi';
import { DEFAULT_RETURN, UN_AUTHORIZED_ACCESS } from './LoginTypes';
import { sortData, getComboLabelValue, constructOptionList } from '../components/CommonScript';
import { toast } from 'react-toastify';
import { initRequest } from './LoginAction';
import { intl } from '../components/App';
import { transactionStatus, reportTypeEnum } from '../components/Enumeration';
import { reportUrl,serverUrl} from '../rsapi'  //SWSM-121  added the code for security vulnerability - by rukshana


export function getReportMasterComboService(inputParam) {
    return function (dispatch) {
        // if (inputParam.operation === "create" || (inputParam.operation === "update" && inputParam.detailtoedit.ntransactionstatus !== transactionStatus.APPROVED))
        // {      
        dispatch(initRequest(true));
        let nreportcode = null;
        if (inputParam.operation === "update") {
            nreportcode = inputParam.mastertoedit[inputParam.primaryKeyName];
        }
        return rsapi().post("reportconfig/getReportMasterComboData", {
            nreportcode,
            userinfo: inputParam.userInfo,
            filterreporttype: inputParam.filterReportType
        })
            .then(response => {

                const reportTypeMap = constructOptionList(response.data["ReportType"] || [], "nreporttypecode",
                    "sdisplayname", undefined, undefined, true);
                const reportModuleMap = constructOptionList(response.data["ReportModule"] || [], "nreportmodulecode",
                    "sdisplayname", undefined, undefined, true);
                const reportSubTypeMap = constructOptionList(response.data["COAReportType"] || [], "ncoareporttypecode",
                    "scoareporttypename", undefined, undefined, true);
                const sampleTypeMap = constructOptionList(response.data["SampleType"] || [], "nsampletypecode",
                    "ssampletypename", undefined, undefined, true);
                const regTypeMap = constructOptionList(response.data["RegistrationType"] || [], "nregtypecode",
                    "sregtypename", undefined, undefined, true);                
                const regSubTypeMap = constructOptionList(response.data["RegistrationSubType"] || [], "nregsubtypecode",
                    "sregsubtypename", undefined, undefined, true);
                 const approvaConfigVersionMap = constructOptionList(response.data["ApprovalConfigVersion"] || [], "napproveconfversioncode",
                    "sversionname", undefined, undefined, false);
                const sectionMap = constructOptionList(response.data["SectionList"] || [], "nsectioncode",
                    "ssectionname", undefined, undefined, true);
                const decisionTypeMap = constructOptionList(response.data["ReportDecisionType"] || [], "nreportdecisiontypecode",
                    "sdecisiontypename", undefined, undefined, true);
                const certificateTypeMap = constructOptionList(response.data["CertificateType"] || [], "ncertificatetypecode",
                    "scertificatetype", undefined, undefined, true);
                const controlScreenTypeMap = constructOptionList(response.data["ControlScreen"] || [], "nformcode",
                    "sdisplayname", undefined, undefined, true);
                const reportTemplateMap = constructOptionList(response.data["ReportTemplate"] || [], "nreporttemplatecode",
                    "sreporttemplatename", "nreporttemplatecode", "ascending", true);

                const reportTypeList = reportTypeMap.get("OptionList");
                const reportModuleList = reportModuleMap.get("OptionList");
                const reportSubTypeList = reportSubTypeMap.get("OptionList");
                const regTypeList = regTypeMap.get("OptionList");
                const sampleTypeList = sampleTypeMap.get("OptionList");
                const regSubTypeList = regSubTypeMap.get("OptionList");
                const sectionList = sectionMap.get("OptionList");
                const decisionTypeList = decisionTypeMap.get("OptionList");
                const certificateTypeList = certificateTypeMap.get("OptionList");
                const controlScreenTypeList = controlScreenTypeMap.get("OptionList");
               const  ApproveConfigList=approvaConfigVersionMap.get("OptionList");
                const reportTemplateList = reportTemplateMap.get("OptionList");

                let selectedRecord = { ntransactionstatus: transactionStatus.ACTIVE };
                let respObject = { "reportVersionStatus": transactionStatus.DRAFT };

                if (inputParam.operation === "update") {
                    if (response.status === 202) {
                        respObject["reportVersionStatus"] = transactionStatus.APPROVED;
                        respObject["ApprovedReportMaster"] = response.data["SelectedReportDesigner"];
                    }
                    selectedRecord = JSON.parse(JSON.stringify(response.data["SelectedReportDesigner"]));
                    if (selectedRecord.nreporttypecode === reportTypeEnum.SAMPLE
                        || selectedRecord.nreporttypecode === reportTypeEnum.COA || selectedRecord.nreporttypecode === reportTypeEnum.COAPREVIEW
                        || selectedRecord.nreporttypecode === reportTypeEnum.COAPRELIMINARY) {
                            selectedRecord["nsampletypecode"] = {
                                value: response.data["SelectedReportDesigner"].nsampletypecode,
                                label: response.data["SelectedReportDesigner"].ssampletypename
                            };
                        // selectedRecord["nregtypecode"] = {
                        //     value: response.data["SelectedReportDesigner"].nregtypecode,
                        //     label: response.data["SelectedReportDesigner"].sregtypename
                        // };
                        if (response.data["SelectedReportDesigner"].nregtypecode !== -1) {
                            selectedRecord["nregtypecode"] = {
                                value: response.data["SelectedReportDesigner"].nregtypecode,
                                label: response.data["SelectedReportDesigner"].sregtypename
                            };
                        }
                        else {
                            selectedRecord["nregtypecode"] = undefined;
                        }
                        if (response.data["SelectedReportDesigner"].nregsubtypecode !== -1) {
                            selectedRecord["nregsubtypecode"] = {
                                value: response.data["SelectedReportDesigner"].nregsubtypecode,
                                label: response.data["SelectedReportDesigner"].sregsubtypename
                            };
                        }
                        else {
                            selectedRecord["nregsubtypecode"] = undefined;
                        }


                        if (response.data["SelectedReportDesigner"].nregsubtypecode !== -1) {
                            selectedRecord["napproveconfversioncode"] = {
                                value: response.data["SelectedReportDesigner"].napproveconfversioncode,
                                label: response.data["SelectedReportDesigner"].sapproveversionname
                            };
                        }
                        else {
                            selectedRecord["nregsubtypecode"] = undefined;
                        }

                        if (response.data["SelectedReportDesigner"].nsectioncode !== -1) {
                            selectedRecord["nsectioncode"] = {
                                value: response.data["SelectedReportDesigner"].nsectioncode,
                                label: response.data["SelectedReportDesigner"].ssectionname
                            };
                        }
                        else {
                            selectedRecord["nsectioncode"] = undefined;
                        }

                        if (response.data["SelectedReportDesigner"].ncoareporttypecode !== -1) {
                            selectedRecord["ncoareporttypecode"] = {
                                value: response.data["SelectedReportDesigner"].ncoareporttypecode,
                                label: response.data["SelectedReportDesigner"].scoareporttypename
                            };
                        }
                        else {
                            selectedRecord["ncoareporttypecode"] = undefined;
                        }

                        // if (response.data["SelectedReportDesigner"].nreporttemplatecode !== -1) {
                            selectedRecord["nreporttemplatecode"] = {
                                value: response.data["SelectedReportDesigner"].nreporttemplatecode,
                                label: response.data["SelectedReportDesigner"].sreporttemplatename
                            };
                        // }

                        if (selectedRecord.nreporttypecode === reportTypeEnum.SAMPLE) {
                            selectedRecord["nreportdecisiontypecode"] = {
                                value: response.data["SelectedReportDesigner"].nreportdecisiontypecode,
                                label: response.data["SelectedReportDesigner"].sdecisiontypename
                            };
                        }

                    }
                    else if (selectedRecord.nreporttypecode === reportTypeEnum.MIS) {
                        selectedRecord["nreportmodulecode"] = {
                            value: response.data["SelectedReportDesigner"].nreportmodulecode,
                            label: response.data["SelectedReportDesigner"].smoduledisplayname,

                        };

                        selectedRecord["nreportmodule"] = {
                            value: response.data["SelectedReportDesigner"].smoduledisplayname,
                            label: response.data["SelectedReportDesigner"].smoduledisplayname
                        }

                    }

                    else if (selectedRecord.nreporttypecode === reportTypeEnum.SCREENWISE) {
                        selectedRecord["ncontrolcode"] = {
                            value: response.data["SelectedReportDesigner"].ncontrolcode,
                            label: response.data["SelectedReportDesigner"].scontrolids
                        };

                        selectedRecord["nformcode"] = {
                            value: response.data["SelectedReportDesigner"].nformcode,
                            label: response.data["SelectedReportDesigner"].sdisplayname
                        };
                    }

                    if (selectedRecord.nreporttypecode === reportTypeEnum.SAMPLE
                        || selectedRecord.nreporttypecode === reportTypeEnum.BATCH) {
                        if (response.data["SelectedReportDesigner"].ncoareporttypecode !== -1) {
                            selectedRecord["ncoareporttypecode"] = {
                                value: response.data["SelectedReportDesigner"].ncoareporttypecode,
                                label: response.data["SelectedReportDesigner"].scoareporttypename
                            };
                        }
                        else {
                            selectedRecord["ncoareporttypecode"] = undefined;
                        }
                        selectedRecord["ncertificatetypecode"] = {
                            value: response.data["SelectedReportDesigner"].ncertificatetypecode,
                            label: response.data["SelectedReportDesigner"].scertificatetype
                        };

                        selectedRecord["sbatchtypename"] = response.data["SelectedReportDesigner"].sbatchtypename
                    }

                    selectedRecord["ntransactionstatus"] = response.data["SelectedReportDesigner"].ntransactionstatus;

                    selectedRecord["nreporttypecode"] = {
                        item: response.data["SelectedReportDesigner"],
                        value: response.data["SelectedReportDesigner"].nreporttypecode,
                        label: response.data["SelectedReportDesigner"].sreportdisplayname
                    };

                }

                respObject = {
                    ...respObject, reportSubTypeList,//:response.data["COAReportType"]  || [], 
                    sampleTypeList,
                    regTypeList,//:response.data["RegistrationType"]  || [],                                                               
                    regSubTypeList,//:response.data["RegistrationSubType"]  || [],  
                    sectionList,
                    ApproveConfigList,//:response.data["SectionList"] || [],   
                    certificateTypeList,
                    reportDecisionTypeList: decisionTypeList,
                    controlScreen: controlScreenTypeList,
                    reportTemplateList
                    //masterData:{...inputParam.masterData, SelectedFilterReportType:response.data["SelectedReportType"] }                                                             
                };

                if (inputParam.operation === "create") {
                    selectedRecord["nreporttypecode"] = {
                        item: response.data["SelectedReportType"], label: response.data["SelectedReportType"].sdisplayname,
                        value: response.data["SelectedReportType"].nreporttypecode
                    }

                    if (selectedRecord["nreporttypecode"].value === reportTypeEnum.SAMPLE
                        && selectedRecord["nreporttypecode"]['item'].isneedregtype === transactionStatus.YES) {
                        // selectedRecord["nregtypecode"] = getComboLabelValue(response.data["SelectedRegType"],
                        //     response.data["RegistrationType"], "nregtypecode", "sregtypename")
                        selectedRecord["nsampletypecode"] = getComboLabelValue(response.data["SelectedSampleType"],
                            response.data["SampleType"], "nsampletypecode", "ssampletypename")

                        if (selectedRecord["nreporttypecode"]['item'].isneedsection === transactionStatus.YES) {
                            selectedRecord["nsectioncode"] = sectionMap.get("DefaultValue");
                        }
                    }
                }
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        reportTypeList,//:response.data["ReportType"] || [], 
                        reportModuleList,//:response.data["ReportModule"] || [] ,
                        ...respObject,
                        operation: inputParam.operation,
                        screenName: inputParam.screenName,
                        selectedRecord,
                        openModal: true,
                        ncontrolCode: inputParam.ncontrolcode,
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
                    toast.warn(error.response.data);
                }
            })
        // }
        // else{       
        //     toast.warn(intl.formatMessage({id: "IDS_CANNOTUPDATEAPPROVEDREPORT"}));
        // }

    }
}

export function getReportDetailComboService(inputParam) {
    return function (dispatch) {
        if (inputParam.operation === "create" || (inputParam.operation === "update" && inputParam.detailtoedit.ntransactionstatus === transactionStatus.DRAFT)) {
            if (inputParam.masterData.SelectedReportMaster !== null) {
                dispatch(initRequest(true));
                let nreportdetailcode = null;
                if (inputParam.operation === "update") {
                    nreportdetailcode = inputParam.detailtoedit[inputParam.primaryKeyName];
                }
                return rsapi().post("reportconfig/getReportDetailComboData", {
                    nreportdetailcode,
                    reportmaster: inputParam.masterData.SelectedReportMaster,
                    userinfo: inputParam.userInfo
                })
                    .then(response => {

                        // const reportType = response.data["SelectedReportType"];
                        // const reportSubTypeMap  = constructOptionList(response.data["COAReportType"] ||[], "ncoareporttypecode",
                        //                             "scoareporttypename" , undefined, undefined, true);    
                        // const sectionMap  = constructOptionList(response.data["SectionList"] ||[], "nsectioncode",
                        //                             "ssectionname", undefined, undefined, true);

                        // const decisionTypeMap  = constructOptionList(response.data["ReportDecisionType"] ||[], "nreportdecisiontypecode",
                        //                             "sdecisiontypename" , undefined, undefined, true);   

                        // const certificateTypeMap  = constructOptionList(response.data["CertificateType"] ||[], "ncertificatetypecode",
                        //                             "scertificatetype" , undefined, undefined, true);

                        // const  reportSubTypeList = reportSubTypeMap.get("OptionList");
                        // const  sectionList = sectionMap.get("OptionList"); 
                        // const  decisionTypeList = decisionTypeMap.get("OptionList");
                        // const  certificateTypeList = certificateTypeMap.get("OptionList");  

                        let selectedRecord = {};
                        let respObject = {};
                        if (inputParam.operation === "update") {
                            selectedRecord = response.data["SelectedReportDetail"];

                        }
                        selectedRecord["ntransactionstatus"] = transactionStatus.DRAFT;

                        //    console.log("selected in action:", selectedRecord);
                        dispatch({
                            type: DEFAULT_RETURN, payload: {
                                ...respObject,
                                operation: inputParam.operation,
                                screenName: inputParam.screenName,
                                selectedRecord,
                                openModal: true,
                                ncontrolCode: inputParam.ncontrolcode,
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
                            toast.warn(error.response.data);
                        }
                    })
            }
            else {
                toast.warn(intl.formatMessage({ id: "IDS_REPORTNOTFOUND" }));
            }
        }
        else if (inputParam.operation === "create" || (inputParam.operation === "update" && inputParam.detailtoedit.ntransactionstatus === transactionStatus.APPROVED)) {
            toast.warn(intl.formatMessage({ id: "IDS_CANNOTEDITAPPROVEDREPORT" }));
        }
        else if (inputParam.operation === "create" || (inputParam.operation === "update" && inputParam.detailtoedit.ntransactionstatus === transactionStatus.RETIRED)) {
            toast.warn(intl.formatMessage({ id: "IDS_CANNOTEDITRETIREDREPORT" }));
        }
    }
}

export function getSelectedReportMasterDetail(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("reportconfig/getReportDesigner", {
            nreportcode: parseInt(inputParam.nreportcode),
            nreporttypecode: inputParam.masterData && inputParam.masterData.SelectedFilterReportType ? inputParam.masterData.SelectedFilterReportType.nreporttypecode.toString() : null,
            userinfo: inputParam.userInfo
        })
            .then(response => {

                const masterData = { ...inputParam.masterData, ...response.data };

                sortData(masterData);
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData, operation: null, modalName: undefined,
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
                    toast.warn(error.response.data);
                }

            })
    }
}

export function getSelectedReportDetail(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("reportconfig/getReportDetail", {
            nreportdetailcode: parseInt(inputParam.nreportdetailcode),
            userinfo: inputParam.userInfo
        })
            .then(response => {

                const masterData = { ...inputParam.masterData, ...response.data };

                sortData(masterData);
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData, operation: null, modalName: undefined,
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
                    toast.warn(error.response.data);
                }

            })
    }
}

export function getConfigReportComboService(inputParam) {
    return function (dispatch) {

        if (inputParam.reportMaster.nreporttypecode === reportTypeEnum.MIS) {
            if (inputParam.reportDetail.ntransactionstatus === transactionStatus.DRAFT) {
                dispatch(initRequest(true));
                return rsapi().post("reportconfig/getReportAddDesignComboData", {
                    nreportdetailcode: parseInt(inputParam.reportDetail.nreportdetailcode),
                    userinfo: inputParam.userInfo
                })
                    .then(response => {

                        const parameterMap = constructOptionList(response.data["ReportParameter"] || [], "nreportparametercode",
                            "sreportparametername", undefined, undefined, true);

                        const reportParameterList = parameterMap.get("OptionList");

                        const designComponentMap = constructOptionList(response.data["DesignComponents"] || [], "ndesigncomponentcode",
                            "sdesigncomponentname", undefined, undefined, true);

                        const designComponentList = designComponentMap.get("OptionList");

                        const sqlQueryMap = constructOptionList(response.data["SQLQuery"] || [], "nsqlquerycode",
                            "ssqlqueryname", undefined, undefined, true);

                        const sqlQueryList = sqlQueryMap.get("OptionList");

                        dispatch({
                            type: DEFAULT_RETURN, payload: {
                                reportParameterList,//:response.data["ReportParameter"] || [], 
                                designComponentList,//:response.data["DesignComponents"] || [],
                                sqlQueryList,//:response.data["SQLQuery"] || [], 
                                operation: inputParam.operation,
                                screenName: inputParam.screenName,
                                //selectedRecord:{nmandatory:transactionStatus.YES}, 
                                selectedRecord: {},
                                openModal: true,
                                ncontrolCode: inputParam.ncontrolCode,
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
                            toast.warn(error.response.data);
                        }

                    })
            }
            else {
                toast.warn(intl.formatMessage({ id: "IDS_CANNOTCONFIGUREAPPROVEDREPORT" }))
            }
        }
        else {
            toast.warn(intl.formatMessage({ id: "IDS_CANCONFIGUREMISREPORT" }))
        }
    }
}

export function getParameterMappingComboService(inputParam) {
    return function (dispatch) {

        if (inputParam.reportMaster.nreporttypecode === reportTypeEnum.MIS) {
            if (inputParam.reportDetail.ntransactionstatus === transactionStatus.DRAFT) {
                dispatch(initRequest(true));
                return rsapi().post("reportconfig/getReportParameterMappingComboData", {
                    nreportdetailcode: parseInt(inputParam.reportDetail.nreportdetailcode),
                    userinfo: inputParam.userInfo
                })
                    .then(response => {
                        if (response.data["ChildComponentList"].length > 0) {

                            const parentComponentMap = constructOptionList(response.data["ParentComponentList"] || [], "nreportdesigncode",
                                "sdisplayname", undefined, undefined, true);
                            const parentComponentList = parentComponentMap.get("OptionList");

                            const childComponentMap = constructOptionList(response.data["ChildComponentList"] || [], "nreportdesigncode",
                                "sdisplayname", undefined, undefined, true);
                            const childComponentList = childComponentMap.get("OptionList");

                            dispatch({
                                type: DEFAULT_RETURN, payload: {
                                    parentComponentList,//:response.data["ParentComponenList"] || [],
                                    childComponentList,//:response.data["ChildComponentList"] || [], 
                                    operation: inputParam.operation,
                                    screenName: inputParam.screenName,
                                    selectedRecord: {},
                                    openModal: true,
                                    ncontrolCode: inputParam.ncontrolCode,
                                    loading: false
                                }
                            });
                        }
                        else {
                            dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                            toast.warn(intl.formatMessage({ id: "IDS_NOPARAMETERSTOMAP" }))
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
            else {
                toast.warn(intl.formatMessage({ id: "IDS_CANNOTMAPAPPROVEDREPORT" }))
            }
        }
        else {
            toast.warn(intl.formatMessage({ id: "IDS_CANMAPMISREPORT" }))
        }
    }
}

export function viewReportDetail(reportmaster, userInfo, masterData) {
    return function (dispatch) {
        if (masterData["ViewReportMaster"] !== undefined && Object.keys(masterData["ViewReportMaster"]).length !== 0) {
            dispatch(initRequest(true));

            return rsapi().post("reportview/viewReport", {reportmaster, userinfo: userInfo })
                .then(response => {
                    // console.log("report action:", response);

                    masterData = { ...masterData, ...response.data };

                    if (response.data["ViewReportDesignConfig"] !== undefined) {
                        masterData["ReportPDFFile"] = undefined;
                    }
                    // else{
                    //     document.getElementById("download_data").setAttribute("href", masterData["ReportPDFFile"]);
                    //     document.getElementById("download_data").click();
                    // }

                    dispatch({ type: DEFAULT_RETURN, payload: { masterData, loading: false } });
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
            toast.warn(intl.formatMessage({ id: "IDS_REPORTNOTFOUND" }))
        }
    }
}

// export function getActionMappingComboService(inputParam) {
//     return function (dispatch) {   

//     if (inputParam.reportDetail.ntransactionstatus === transactionStatus.DRAFT){
//             dispatch(initRequest(true));
//             return rsapi().post("reportconfig/getActionMappingComboData", {nreportdetailcode:parseInt(inputParam.reportDetail.nreportdetailcode),
//                                         userinfo:inputParam.userInfo})
//         .then(response=>{ 
//             if (response.data["ActionMappingChild"].length > 0)
//             {     
//                     dispatch({type: DEFAULT_RETURN, payload:{actionMappingParentList:response.data["ActionMappingParent"] || [],
//                                                             actionMappingChildList:response.data["ActionMappingChild"] || [], 
//                                                             operation:inputParam.operation, 
//                                                             screenName:inputParam.screenName,   
//                                                             selectedRecord:{}, 
//                                                             openModal : true,
//                                                             ncontrolCode:inputParam.ncontrolCode,
//                                                             loading:false
//                                                             }}); 
//             }
//             else{
//                 dispatch({type: DEFAULT_RETURN, payload: {loading:false}})
//                 toast.warn(intl.formatMessage({id:"IDS_NOACTIONSTOMAP"}))
//             }
//         })
//         .catch(error=>{
//                 dispatch({type: DEFAULT_RETURN, payload: {loading:false}})
//             if (error.response.status === 500){
//                 toast.error(error.message);
//             } 
//             else{               
//                 toast.warn(error.response.data);
//             }  

//         })
//     }
//     else{
//         toast.warn(intl.formatMessage({id:"IDS_CANNOTACTIONMAPAPPROVEDREPORT"}))
//     }
// }}

export function getReportViewChildDataList(inputParam) {
    return function (dispatch) {
        // dispatch(initRequest(true));
        return rsapi().post("reportview/getChildDataList", { ...inputParam["inputData"] })
            .then(response => {
                const controlList = inputParam.viewReportDesignConfigList;

                const selectedRecord = inputParam.selectedRecord;

                Object.keys(response.data).map(displayName => {
                    const index = controlList.findIndex(item => displayName === item.sdisplayname);

                    const comboMap = constructOptionList(response.data[displayName] || [], controlList[index].svaluemember,
                        controlList[index].sdisplaymember, undefined, undefined, true);

                    const comboList = comboMap.get("OptionList");
                    //selectedRecord[controlList[index].svaluemember] = undefined;
                    selectedRecord[controlList[index].sreportparametername] = undefined;

                    return controlList[index]["dataList"] = comboList;//response.data[displayName]
                })
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        viewReportDesignConfigList: controlList,
                        loading: false,
                        inputFieldData: inputParam.inputData.inputfielddata,
                        selectedRecord
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

export function viewReportDetailWithParameters(viewReportParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("reportview/viewReportWithParameters", { ...viewReportParam })
            .then(response => {
                const masterData = {
                    ...viewReportParam.masterData, ...response.data,
                    ReportPDFFile: response.data["ReportPDFFile"],
                    SelectedReportDetails: response.data["SelectedReportDetails"],
                    ReportPDFPath: response.data["ReportPDFPath"],
                    ViewReportDesignConfig: undefined
                };

                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData, loading: false, //openModal:false
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

export function validationReportparameter(validationReportParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("reportconfig/getReportValidation", { ...validationReportParam })
            .then(response => {
                const reportType = constructOptionList(response.data || [], "ntranscode",
                "stransstatus", undefined, undefined, false);

                const reportstatus = reportType.get("OptionList");
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        loading: false, openModal:true,
                        reportTypeList:reportstatus,
                        screenName:"IDS_REPORTVALIDATION"
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

export function controlBasedReportparametre(validationReportParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("controlbasedreport/controlBasedReportParameter", { ...validationReportParam })
            .then(response => {
                const reportType = constructOptionList(response.data.reportTemplateList || [], "ncontrolbasedparameter",
                "scontrolbasedparameter", undefined, undefined, false);

                const reportTypecopy = constructOptionList(response.data.reportTemplateList || [], "ncontrolbasedparameter",
                "scontrolbasedparameter", undefined, undefined, false);

                const reportstatus = reportType.get("OptionList");
                const reportstatuscopy = reportTypecopy.get("OptionList");
                let reportTypeListparameter={};
                if(response.data.ParameterMappingDatagrid.length !== 0){
                    //reportTypeListparameter=reportstatus.splice(1,response.data.ParameterMappingDatagrid.map(function (el) { return el.nreportparametercode; }))
                    reportTypeListparameter = reportstatus.filter(item => response.data.ParameterMappingDatagrid.every(el => el.nreportparametercode !== item.value) );

                }else{
                    reportTypeListparameter=reportstatus;
                }
               // const reportTypeListparameter=reportstatus.splice(1,response.data.ParameterMappingDatagrid.map(function (el) { return el.nreportparametercode; }))
                const reportstatus1 = response.data.ParameterMappingDatagrid;

                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        loading: false, openModal:true,
                        reportTypeListparameter:reportTypeListparameter,
                        reportTypeListparametercopy:reportstatuscopy,
                        reportTypeListName:[],
                        ParameterMappingDatagrid:reportstatus1,
                        screenName:"IDS_REPORTPARAMETERMAPPING"
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



export function controlBasedReportparametretable(nformcode,nreportdetailcode,userInfo,sdatatype) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("controlbasedreport/controlBasedReportparametretable",
         {"nformcode":nformcode,"nreportdetailcode": nreportdetailcode,"sdatatype":sdatatype,userinfo: userInfo})
            .then(response => {
                const reportType = constructOptionList(response.data || [], "ncolumnfield",
                "stablecolumn", undefined, undefined, false);

                const reportstatus = reportType.get("OptionList");
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        loading: false, openModal:true,
                        reportTypeListName:reportstatus,
                        screenName:"IDS_REPORTPARAMETERMAPPING"
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

// export function controlBasedReportparametretablecolumn(nformcode,nreportdetailcode,userInfo,sdatatype) {
//     return function (dispatch) {
//         dispatch(initRequest(true));
//         return rsapi().post("controlbasedreport/controlBasedReportparametretablecolumn",
//          {"nformcode":nformcode,"nreportdetailcode": nreportdetailcode,"reportdatatype":sdatatype,userinfo: userInfo})
//             .then(response => {
//                 const reportType = constructOptionList(response.data || [], "ncolumnfield",
//                 "stablecolumn", undefined, undefined, false);

//                 const reportstatus = reportType.get("OptionList");
//                 dispatch({
//                     type: DEFAULT_RETURN, payload: {
//                         loading: false, openModal:true,
//                         reportTypeListColumn:reportstatus,
//                         screenName:"IDS_REPORTPARAMETERMAPPING"
//                     }
//                 });
//             })
//             .catch(error => {
//                 dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
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
//                 }
//                 else {
//                     toast.warn(error.response.data);
//                 }

//             })
//     }
// }

export function downloadControlBasedReportparametreInsert(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("controlbasedreport/downloadControlBasedReportparametreInsert",{inputParam})
            .then(response => {
                const reportType = constructOptionList(response.data || [], "nquerybuildertablecodecolumn",
                "stablecolumn", undefined, undefined, false);

                const reportstatus = reportType.get("OptionList");
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        loading: false, openModal:true,
                        reportTypeListColumn:reportstatus,
                        screenName:"IDS_REPORTPARAMETERMAPPING"
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





// export function viewReportDetailWithParametersReports(viewReportParam,inputParam) {
//     return function (dispatch) {
//         dispatch(initRequest(true));
//         return rsapi().post("reportview/viewReportWithParameters", { ...viewReportParam })
//             .then(response => {
//                 const masterData = {
//                     ...viewReportParam.masterData, ...response.data,
//                     ReportPDFFile: response.data["ReportPDFFile"],
//                     SelectedReportDetails: response.data["SelectedReportDetails"],
//                     ReportPDFPath: response.data["ReportPDFPath"],
//                     ViewReportDesignConfig: undefined
//                 };
//                 if(masterData.sourceparameter!=undefined
//                     && masterData.sourceparameter!="")//&&
//                    //this.props.Login.masterData.sourceparameter !== previousProps.Login.masterData.sourceparameter )
//                   {
                 
//                     let mrtfilePath = reportUrl()
//                     + "?name=" + viewReportParam.userinfo.sreportingtoolfilename
//                     + "&slanguagetypecode=" + viewReportParam.userinfo.sreportlanguagecode
//                     + "&foldername=" + masterData.SelectedReportDetails.sreportname //"Quotation-002"//this.props.Login.masterData.SelectedReportDetails.sreportname
//                     + "&filename=" + masterData.SelectedReportDetails.ssystemfilename //"a6008692-3e1a-422b-b4da-5e9ad9cf3be6.mrt"//"b701dbc4-d90e-4840-b8e1-942649d6ec25.mrt"//this.props.Login.masterData.SelectedReportDetails.ssystemfilename
//                     + "&sconnectionstring=" + viewReportParam.userinfo.sconnectionString
//                     + "&sreportlink=" + viewReportParam.sreportlink //"//localhost:8090/SharedFolder/QuaLISjrxml"//this.props.Login.reportSettings[15] //this.props.Login.userInfo.sreportLink  
//                     + "&smrttemplatelink=" + viewReportParam.smrttemplatelink //"//localhost:8090//SharedFolder//ReportJSON//ReportTemplate.json"//this.props.Login.reportSettings[16]//this.props.Login.userInfo.smrttemplateLink
//                     + "&sourceparameter=" + encodeURIComponent(masterData.sourceparameter);
               
             
                 
             
//                      window.open(mrtfilePath);
             
//                      //this.setState({mrtfileflag:false});
             
//                      //this.props.Login.masterData.sourceparameter="";
             
             
//                       }
//                 dispatch({
//                     type: DEFAULT_RETURN, payload: {
//                         masterData, loading: false //openModal:false
//                     }
//                 });
//             })
//             .catch(error => {
//                 dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
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
//                 }
//                 else {
//                     toast.warn(error.response.data);
//                 }
 
//             })
//     }
// }




export function viewReportDetailWithParametersReports(viewReportParam,inputParam) {
        
    if(viewReportParam.sourceparameter !== undefined && viewReportParam.sourceparameter !== "")
    {
        // Added btoa() to encode the sapi and srepotlink values by Gowtham on dec 2 2025 for SWSM-125 JavaReportingTool sensetive data hide through url
        // Added btoa() to encode the For ALl Parameter values by Neeraj on dec 4 2025 for SWSM-125 JavaReportingTool sensetive data hide through url
        let mrtfilePath = reportUrl()
        + "?name=" + btoa(inputParam.userinfo.sreportingtoolfilename)     //en-xml
        + "&slanguagetypecode=" + btoa(inputParam.userinfo.sreportlanguagecode)    //en-us
        + "&foldername=" + btoa(viewReportParam.SelectedReportDetails.sreportname)   //"Quotation-002"//this.props.Login.masterData.SelectedReportDetails.sreportname
        + "&filename=" + btoa(viewReportParam.SelectedReportDetails.ssystemfilename)  //"a6008692-3e1a-422b-b4da-5e9ad9cf3be6.mrt"//"b701dbc4-d90e-4840-b8e1-942649d6ec25.mrt"//this.props.Login.masterData.SelectedReportDetails.ssystemfilename
        + "&sconnectionstring=" + inputParam.userinfo.sconnectionString 
        + "&sapi=" + btoa(serverUrl() + "/reststimulsoft/urljson")  //SWSM-121 Start - added the code for security vulnerability - by rukshana
        + "&sreportlink=" + btoa(inputParam.sreportlink) //inputParam.sreportlink //"//localhost:8090/SharedFolder/QuaLISjrxml"//this.props.Login.reportSettings[15] //this.props.Login.userInfo.sreportLink  
        // + "&smrttemplatelink=" + inputParam.smrttemplatelink  //inputParam.smrttemplatelink //"//localhost:8090//SharedFolder//ReportJSON//ReportTemplate.json"//this.props.Login.reportSettings[16]//this.props.Login.userInfo.smrttemplateLink
        + "&sourceparameter=" + btoa(viewReportParam.sourceparameter);

    window.open(mrtfilePath);
    //return(viewReportParam.statusCodeValue);
    }    
}


export function getReportsByModule(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("reportview/getReportView", {
            nreportmodulecode: inputParam.nreportmodulecode,
            userinfo: inputParam.userInfo
        })
            .then(response => {

                let masterData={...inputParam.masterData,ViewReportDesignConfig:[]}
                 masterData = { ...masterData, ...response.data };

                // const  reportModuleMap  = constructOptionList(masterData.ViewReportModuleList ||[], "nreportmodulecode",
                //                          "smoduledisplayname" , undefined, undefined, true);
                // const  reportModuleList  = reportModuleMap.get("OptionList");

                sortData(masterData);
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData, //viewReportModuleList:reportModuleList,
                        operation: null, modalName: undefined,
                        loading: false, selectedRecord: inputParam.selectedRecord
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


export function getControlButton(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("reportconfig/getControlButton", {
            nformcode: inputParam.ControlScreen.nformcode,
            userinfo: inputParam.userInfo
        })
            .then(response => {

                const controlButtonMap = constructOptionList(response.data || [], "ncontrolcode",
                    "scontrolids", undefined, undefined, true);
                const controlButtonList = controlButtonMap.get("OptionList");
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        controlButton: controlButtonList,//: response.data,                                            
                        loading: false,
                        selectedRecord: {
                            ...inputParam.selectedRecord,
                            nregsubtypecode: undefined
                            //nregsubtypecode:{label:"Please Select...", value:-4}
                        }
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

export function getReportRegSubType(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("reportconfig/getReportRegistrationSubType", {
            nregtypecode: inputParam.registrationType.nregtypecode,
            userinfo: inputParam.userInfo
        })
            .then(response => {

                const regSubTypeMap = constructOptionList(response.data || [], "nregsubtypecode",
                    "sregsubtypename", undefined, undefined, true);
                const regSubTypeList = regSubTypeMap.get("OptionList");
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        regSubTypeList,//: response.data,                                            
                        loading: false,
                        ApproveConfigList:[],                                           
                        selectedRecord: {
                            ...inputParam.selectedRecord,
                            nregsubtypecode: undefined,
                            napproveconfversioncode: undefined

                            //nregsubtypecode:{label:"Please Select...", value:-4}
                        }
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

export function getReportSubType(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("reportconfig/getReportSubType", {
            nreporttypecode: inputParam.reportType.nreporttypecode,
            //nreporttypecode: inputParam.reportType.nreporttypecode,
            userinfo: inputParam.userInfo
        })
            .then(response => {

               // const reportSubTypeMap = constructOptionList(response.data.COAReportType || [], "ncoareporttypecode",
               //     "scoareporttypename", undefined, undefined, true);
               // const reportSubTypeList = reportSubTypeMap.get("OptionList");

                const certificateTypeMap = constructOptionList(response.data.CertificateType || [], "ncertificatetypecode",
                    "scertificatetype", undefined, undefined, true);
                const certificateTypeList = certificateTypeMap.get("OptionList");
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                       // reportSubTypeList,
                        certificateTypeList,
                        loading: false,
                        selectedRecord: {
                            ...inputParam.selectedRecord,
                            ncoareporttypecode: undefined,
                            ncertificatetypecode: ""
                            // ncoareporttypecode:{label:"Please Select...", value:-4}
                        }
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
export function getReportSampletype(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("reportconfig/getReportSampleType", {
            nsampletypecode: inputParam.nsampletypecode, nreporttypecode: inputParam.reportType.nreporttypecode,
            userinfo: inputParam.userInfo
        })
            .then(response => {

                // const reportRegTypeMap  = constructOptionList(response.data.Regtype ||[], "nregtypecode",
                //                          "sregtypename" , undefined, undefined, true);   
                // const  reportRegTypeList = reportRegTypeMap.get("OptionList");

                // // const reportRegSubTypeMap  = constructOptionList(response.data.RegSubtype ||[], "nregsubtypecode",
                // // "sregsubtypename" , undefined, undefined, true);   
                // //   const  reportRegSubTypeList = reportRegSubTypeMap.get("OptionList");
                
                const sampleTypeMap = constructOptionList(response.data["SampleType"] || [], "nsampletypecode",
                "ssampletypename", undefined, undefined, true);
                const sampleTypeList = sampleTypeMap.get("OptionList");
                
                const regTypeMap = constructOptionList(response.data["RegistrationType"] || [], "nregtypecode",
                    "sregtypename", undefined, undefined, true);
                const regTypeList = regTypeMap.get("OptionList");

                // const regSubTypeMap = constructOptionList(response.data["RegistrationSubType"] || [], "nregsubtypecode",
                //     "sregsubtypename", undefined, undefined, true);
                // const regSubTypeList = regSubTypeMap.get("OptionList");

                const coaReportTypeMap = constructOptionList(response.data.COAReportType || [], "ncoareporttypecode",
                    "scoareporttypename", undefined, undefined, true);
                const reportSubTypeList = coaReportTypeMap.get("OptionList");

                const certificateType = constructOptionList(response.data.CertificateType || [], "ncertificatetypecode",
                    "scertificatetype", undefined, undefined, true);
                const certificateTypeList = certificateType.get("OptionList");


                const nsampletypecode = getComboLabelValue(response.data["SelectedSampleType"],
                    response.data["SampleType"], "nsampletypecode", "ssampletypename")


                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        sampleTypeList,
                        regTypeList,
                      //  regSubTypeList,
                        reportSubTypeList,
                        loading: false,
                        certificateTypeList,
                        selectedRecord: {
                            ...inputParam.selectedRecord,
                            nsampletypecode: nsampletypecode, nregtypecode: undefined,
                            ncoareporttypecode: undefined,
                            ncertificatetypecode: ""
                        }
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

export function getregtype(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("reportconfig/getRegistrationtypeForSample", {
            nsampletypecode: inputParam.sampleType.nsampletypecode,
            nregtypecode: inputParam.nregtypecode,
            //nreporttypecode: inputParam.selectedRecord.nreporttypecode.value,
            nreporttypecode: (inputParam.selectedRecord.nreporttypecode.value === reportTypeEnum.COAPREVIEW)||
            (inputParam.selectedRecord.nreporttypecode.value === reportTypeEnum.COAPRELIMINARY) ? reportTypeEnum.COA : inputParam.selectedRecord.nreporttypecode.value,
            userinfo: inputParam.userInfo
        })
            .then(response => {

                // const reportRegTypeMap  = constructOptionList(response.data.Regtype ||[], "nregtypecode",
                //                          "sregtypename" , undefined, undefined, true);   
                // const  reportRegTypeList = reportRegTypeMap.get("OptionList");

                // // const reportRegSubTypeMap  = constructOptionList(response.data.RegSubtype ||[], "nregsubtypecode",
                // // "sregsubtypename" , undefined, undefined, true);   
                // //   const  reportRegSubTypeList = reportRegSubTypeMap.get("OptionList");
                // const sampleTypeMap = constructOptionList(response.data["SampleType"] || [], "nsampletypecode",
                // "ssampletypename", undefined, undefined, true);
                // const sampleTypeList = sampleTypeMap.get("OptionList");
                
                const regTypeMap = constructOptionList(response.data["RegistrationType"] || [], "nregtypecode",
                    "sregtypename", undefined, undefined, true);
                const regTypeList = regTypeMap.get("OptionList");

                // const regSubTypeMap = constructOptionList(response.data["RegistrationSubType"] || [], "nregsubtypecode",
                //     "sregsubtypename", undefined, undefined, true);
                // const regSubTypeList = regSubTypeMap.get("OptionList");

                const coaReportTypeMap = constructOptionList(response.data.COAReportType || [], "ncoareporttypecode",
                    "scoareporttypename", undefined, undefined, true);
                const reportSubTypeList = coaReportTypeMap.get("OptionList");

                const certificateType = constructOptionList(response.data.CertificateType || [], "ncertificatetypecode",
                    "scertificatetype", undefined, undefined, true);
                const certificateTypeList = certificateType.get("OptionList");


            //    const nregtypecode = getComboLabelValue(response.data["SelectedRegType"],
              //      response.data["RegistrationType"], "nregtypecode", "sregtypename")


                dispatch({
                    type: DEFAULT_RETURN, payload: {
                     //   sampleTypeList,
                        regTypeList,
                        regSubTypeList: [],
                        ApproveConfigList:[],                                           
                        reportSubTypeList,
                        loading: false,
                        certificateTypeList,
                        selectedRecord: {
                            ...inputParam.selectedRecord,
                            nregtypecode: undefined, nregsubtypecode: undefined,
                            ncoareporttypecode: undefined,
                            ncertificatetypecode: "",
                            napproveconfversioncode: undefined
                        }
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

export function getReportRegSubTypeApproveConfigVersion(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("reportconfig/getReportRegSubTypeApproveConfigVersion", {
            nregtypecode: inputParam.selectedRecord.nregtypecode.value,
            nregsubtypecode: inputParam.registrationsubType.nregsubtypecode,
            userinfo: inputParam.userInfo
        })
            .then(response => {

                const ApproveConfigVersionMap = constructOptionList(response.data || [], "napproveconfversioncode",
                    "sversionname", undefined, undefined, false);
                const ApproveConfigList = ApproveConfigVersionMap.get("OptionList");
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        ApproveConfigList,//: response.data,                                            
                        loading: false,
                        selectedRecord: {
                            ...inputParam.selectedRecord,
                            napproveconfversioncode: undefined

                        }
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

export function getReportTemplate(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("reportconfig/getReportTemplate", {
            userinfo: inputParam.userInfo
        })
            .then(response => {
                const reportTemplateMap = constructOptionList(response.data || [], "nreporttemplatecode",
                    "sreporttemplatename", "nreporttemplatecode", "ascending", true);
                const reportTemplateList = reportTemplateMap.get("OptionList");
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        reportTemplateList,                                         
                        loading: false,
                        selectedRecord: {
                            ...inputParam.selectedRecord,
                            nreporttemplatecode:undefined
                        }
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