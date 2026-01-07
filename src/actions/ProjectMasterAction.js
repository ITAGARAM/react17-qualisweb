import rsapi from '../rsapi';
import Axios from 'axios';
import { toast } from 'react-toastify';
import { DEFAULT_RETURN, UN_AUTHORIZED_ACCESS } from './LoginTypes';
import { initRequest } from './LoginAction';
import { sortData, constructOptionList, rearrangeDateFormat } from '../components/CommonScript';
import { transactionStatus, attachmentType } from '../components/Enumeration';
import { intl } from "../components/App";
import { modalSave } from './ServiceAction';

export const changeProjectTypeFilter = (inputParam, filterProjectType) => {
    return (dispatch) => {
        dispatch(initRequest(true));
        rsapi().post("/projectmaster/get" + inputParam.methodUrl, inputParam.inputData)
            .then(response => {
                const masterData = response.data
                sortData(masterData);

                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false,
                        dataState: undefined,
                        masterData: {
                            ...masterData,
                            filterProjectType,
                            nfilterProjectType: inputParam.inputData.nfilterProjectType

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
        } else if (error.response.status === 500) {
                    toast.error(error.message);
                } else {
                    toast.warn(error.response.data);
                }
            });
    }
}

export function getuserComboServices(methodParam, selectedRecord) {

    return function (dispatch) {

        let URL = [];

        URL = rsapi().post("/projectmaster/getUsers", { "userinfo": methodParam.inputData.userinfo, "nuserrolecode": methodParam.inputData.primarykey })

        dispatch(initRequest(true));

        Axios.all([URL])

            .then(response => {

                let userList;

                const userMap = constructOptionList(response[0].data || [], "nusercode",

                    "susername", undefined, undefined, false);

                userList = userMap.get("OptionList");



                dispatch({
                    type: DEFAULT_RETURN, payload:

                        { userList, selectedRecord, loading: false, data: undefined, dataState: undefined }
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



//Add Project Master
export const addProjectMaster = (operation, nfilterProjectMaster, userInfo, ncontrolCode,
     selectedRecordvalue, SelectedProjectType,timeZone) => {
    return function (dispatch) {
        // if (nfilterProjectMaster && Object.values(nfilterProjectMaster).length > 0) {
        if (selectedRecordvalue && selectedRecordvalue.nprojecttypecodevalue !== undefined) {
            if ((Object.values(selectedRecordvalue.nprojecttypecodevalue).length > 0 && selectedRecordvalue.nprojecttypecodevalue !== undefined && operation === 'create') || (nfilterProjectMaster && nfilterProjectMaster.nprojecttypecode > 0 && operation === 'update' && nfilterProjectMaster.ntransactionstatus === transactionStatus.DRAFT)) {
                dispatch(initRequest(true));
                const urlArray = [
                ];
                let selectedRecord = {};
                // selectedRecord = selectedRecordvalue ;
                if (operation === "create" || operation === "update") {

                    urlArray.push(rsapi().post("projecttype/getProjectType", {
                        "userinfo": userInfo
                    }));

                    /*       urlArray.push(rsapi().post("projectmaster/getStudyDirector", {
                               "userinfo": userInfo
                           })); */

                    urlArray.push(rsapi().post("projectmaster/getUserrole", {
                        "userinfo": userInfo
                    }));

                    // urlArray.push(rsapi().post("projectmaster/getUsers", {
                    //     "userinfo": userInfo //,
                    //     // "nuserrolecode" : nfilterProjectMaster.nuserrolecode
                    // })); 

                    urlArray.push(rsapi().post("projectmaster/getTeammembers", {
                        "userinfo": userInfo
                    }));

                    urlArray.push(rsapi().post("projectmaster/getPeriodByControl", {
                        "userinfo": userInfo,
                        "ncontrolcode": ncontrolCode
                    }));

                    urlArray.push(rsapi().post("clientcategory/getClientCategory", { "userinfo": userInfo }));

                }
                if (operation === "update") {

                    urlArray.push(rsapi().post("projectmaster/getActiveProjectMasterById", {
                        "userinfo": userInfo,
                        "nprojectmastercode": nfilterProjectMaster.nprojectmastercode
                    }));

                    urlArray.push(rsapi().post("projectmaster/getUsers", {
                        "userinfo": userInfo,
                        "nuserrolecode": nfilterProjectMaster.nuserrolecode
                    }));

                    urlArray.push(rsapi().post("client/getClientByCategory", {
                        "nclientcatcode": nfilterProjectMaster.nclientcatcode,
                        "userinfo": userInfo

                    }));

                    urlArray.push(rsapi().post("projectmaster/getQuotaionNoByClient", {
                        "nclientcatcode": nfilterProjectMaster.nclientcatcode,
                        "nclientcode": nfilterProjectMaster.nclientcode,
                        "userinfo": userInfo
                    }));

                }
               // urlArray.push(rsapi.post("timezone/getTimeZone", { "userinfo": userInfo }));

                Axios.all(urlArray)
                    .then(response => {


                        let testData = {};

                        let { ProjectType, Userrole, userList, TeamMembers,
                            PeriodByControl, ClientCategory, Client, QuotationNo,
                            rfwTimeZone, projectStartDateTimeZone, expectCompletionDateTimeZone } = []


                        if (operation === "create") {

                            ProjectType = constructOptionList(response[0].data || [], "nprojecttypecode", "sprojecttypename", false, false, true).get("OptionList");

                            Userrole = constructOptionList(response[1].data || [], "nuserrolecode", "suserrolename", false, false, true).get("OptionList");

                            //                Users = constructOptionList(response[2].data || [], "nusercode", "susername", false, false, true).get("OptionList");

                            TeamMembers = constructOptionList(response[2].data || [], "nusercode", "steammembername", false, false, true).get("OptionList");

                            PeriodByControl = constructOptionList(response[3].data || [], "nperiodcode", "speriodname", false, false, true).get("OptionList");

                            ClientCategory = constructOptionList(response[4].data || [], "nclientcatcode", "sclientcatname", false, false, true).get("OptionList");

                            if (userInfo.istimezoneshow === transactionStatus.YES) {
                            rfwTimeZone = constructOptionList(timeZone || [], "ntimezonecode", "stimezoneid", undefined, undefined, true).get("OptionList");

                            projectStartDateTimeZone = constructOptionList(timeZone || [], "ntimezonecode", "stimezoneid", undefined, undefined, true).get("OptionList");

                            expectCompletionDateTimeZone = constructOptionList(timeZone || [], "ntimezonecode", "stimezoneid", undefined, undefined, true).get("OptionList");

                            selectedRecord = {
                                    "ntzrfwdate":{
                                        "value": userInfo.ntimezonecode,
                                        "label": userInfo.stimezoneid
                                    },
                                    "ntzprojectstartdate":{
                                        "value": userInfo.ntimezonecode,
                                        "label": userInfo.stimezoneid
                                    },   
                                    "ntzexpectcompletiondate":{
                                        "value": userInfo.ntimezonecode,
                                        "label": userInfo.stimezoneid
                                    }
                                }
                            }
                                selectedRecord = {...selectedRecord,
                                "nprojecttypecode": {
                                    "value": SelectedProjectType.nprojecttypecode,
                                    "label": SelectedProjectType.sprojecttypename
                                }
                            };

                        } else if (operation === "update") {

                            const editData = response[5].data.SelectedProjectMaster;

                            selectedRecord["sprojectcode"] = editData.sprojectcode;
                            selectedRecord["sprojecttitle"] = editData.sprojecttitle;
                            selectedRecord["sprojectdescription"] = editData.sprojectdescription;
                            selectedRecord["nprojectduration"] = editData.nprojectduration;
                            selectedRecord["sprojectname"] = editData.sprojectname;
                            selectedRecord["srfwid"] = editData.srfwid;



                            selectedRecord = { ...selectedRecord }

                            ProjectType = constructOptionList(response[0].data || [], "nprojecttypecode", "sprojecttypename", false, false, true).get("OptionList");
                            Userrole = constructOptionList(response[1].data || [], "nuserrolecode", "suserrolename", false, false, true).get("OptionList");
                            userList = constructOptionList(response[6].data || [], "nusercode", "susername", false, false, true).get("OptionList");
                            TeamMembers = constructOptionList(response[2].data || [], "nusercode", "steammembername", false, false, true).get("OptionList");
                            PeriodByControl = constructOptionList(response[3].data || [], "nperiodcode", "speriodname", false, false, true).get("OptionList");
                            ClientCategory = constructOptionList(response[4].data || [], "nclientcatcode", "sclientcatname", false, false, true).get("OptionList");
                            Client = constructOptionList(response[7].data.Client || [], "nclientcode", "sclientname", false, false, true).get("OptionList");
                            QuotationNo = constructOptionList(response[8].data || [], "nquotationcode", "squotationno", false, false, true).get("OptionList");

                                rfwTimeZone = constructOptionList(timeZone || [], "ntimezonecode", "stimezoneid", undefined, undefined, true).get("OptionList");
                                projectStartDateTimeZone = constructOptionList(timeZone || [], "ntimezonecode", "stimezoneid", undefined, undefined, true).get("OptionList");
                                expectCompletionDateTimeZone = constructOptionList(timeZone || [], "ntimezonecode", "stimezoneid", undefined, undefined, true).get("OptionList");

                            selectedRecord["nprojecttypecode"] = {
                                "value": editData["nprojecttypecode"],
                                "label": editData["sprojecttypename"]
                            };

                            selectedRecord["nuserrolecode"] = {
                                "value": editData["nuserrolecode"],
                                "label": editData["suserrolename"]
                            };

                            selectedRecord["nusercode"] = {
                                "value": editData["nusercode"],
                                "label": editData["susername"]
                            };


                            selectedRecord["nteammembercode"] = {
                                "value": editData["nteammembercode"],
                                "label": editData["steammembername"]
                            };

                            selectedRecord["nperiodcode"] = {
                                "value": editData["nperiodcode"],
                                "label": editData["speriodname"]
                            };
                            selectedRecord["nclientcatcode"] = {
                                "value": editData["nclientcatcode"],
                                "label": editData["sclientcatname"]
                            };

                            selectedRecord["nclientcode"] = {
                                "value": editData["nclientcode"],
                                "label": editData["sclientname"]
                            };
                                 selectedRecord["ntzrfwdate"]={
                                        "value":  editData["ntzrfwdate"],
                                        "label":  editData["srfwtimezoneid"]
                                    }
                                    selectedRecord["ntzprojectstartdate"]={
                                        "value":  editData["ntzprojectstartdate"],
                                        "label":  editData["sprojectstarttimezoneid"]
                                    } 
                                    selectedRecord["ntzexpectcompletiondate"]={
                                        "value":  editData["ntzexpectcompletiondate"],
                                        "label":  editData["sexpectcompletiontimezoneid"]
                                    }
                            if (editData["nquotationcode"] != -1)
                                selectedRecord["nquotationcode"] = {
                                    "value": editData["nquotationcode"],
                                    "label": editData["squotationno"]
                                };


                            // selectedRecord["nstudydirectorcode"] = response[1].data;
                            // selectedRecord["nteammembercode"] = response[2].data;
                            //  selectedRecord["nperiodcode"] = response[3].data;
                            // selectedRecord["sprojecttitle"] = editData.sprojecttitle;
                            // selectedRecord["sprojectcode"] = editData.sprojectcode;

                            if (editData.srfwdate != "-") {
                                selectedRecord["drfwdate"] = rearrangeDateFormat(userInfo, editData.srfwdate);

                            }
                            if (editData.sexpectcompletiondate != "-") {
                                selectedRecord["dexpectcompletiondate"] = rearrangeDateFormat(userInfo, editData.sexpectcompletiondate);

                            }
                            selectedRecord["dprojectstartdate"] = rearrangeDateFormat(userInfo, editData.sprojectstartdate);

                        }

                        dispatch({
                            type: DEFAULT_RETURN,
                            payload: {

                                openModal: true,
                                ProjectType, Userrole, userList, TeamMembers, PeriodByControl, ClientCategory, Client, QuotationNo,
                                    operation: operation, rfwTimeZone, expectCompletionDateTimeZone, projectStartDateTimeZone,
                                screenName: "IDS_PROJECTMASTER",
                                selectedRecord,
                                ncontrolCode,
                                testData,


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
                toast.warn(intl.formatMessage({ id: "IDS_SELECTDRAFTVERSION" }));
            }
        } else {
            //  if(nfilterProjectMaster.ntransactionstatus !== transactionStatus.DRAFT){ nfilterProjectMaster
            if (nfilterProjectMaster !== null && operation === "update") {

                toast.warn(intl.formatMessage({ id: "IDS_SELECTDRAFTVERSION" }));

            } else {
                toast.warn(intl.formatMessage({ id: "IDS_PROJECTTYPENOTAVAILABLE" }))
            }

        }
    }
}

export const addProjectMasterFile = (inputParam) => {
    return (dispatch) => {
        if (inputParam.ntransactionstatus === transactionStatus.DRAFT) {
            dispatch(initRequest(true));
            let urlArray = [rsapi().post("/linkmaster/getLinkMaster", {
                userinfo: inputParam.userInfo
            })];
            if (inputParam.operation === "update") {
                urlArray.push(rsapi().post("/projectmaster/editProjectMasterFile", {
                    userinfo: inputParam.userInfo,
                    projectmasterfile: inputParam.selectedRecord
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
                                slinkfilename: editObject.sfilename,
                                slinkdescription: editObject.sdescription,
                                nlinkdefaultstatus: editObject.ndefaultstatus,
                                sfilesize: '',
                                nfilesize: 0,
                                ndefaultstatus: 4,
                                sfilename: '',
                            }

                        } else {
                            nlinkcode = defaultLink.length > 0 ? defaultLink[0] : "" //{"label": defaultLink[0].slinkname, "value": defaultLink[0].nlinkcode}:""
                            link = {
                                slinkfilename: '',
                                slinkdescription: '',
                                nlinkdefaultstatus: 4,
                                sfilesize: editObject.sfilesize,
                                nfilesize: editObject.nfilesize,
                                ndefaultstatus: editObject.ndefaultstatus,
                                sfilename: editObject.sfilename,
                            }
                        }
                        selectedRecord = {
                            ...link,
                            nprojectmasterfilecode: editObject.nprojectmasterfilecode,
                            nattachmenttypecode: editObject.nattachmenttypecode,
                            //...editObject,
                            nlinkcode,

                            // disabled: true
                        };
                    } else {
                        selectedRecord = {
                            nattachmenttypecode: response[0].data.AttachmentType.length > 0 ?
                                response[0].data.AttachmentType[0].nattachmenttypecode : attachmentType.FTP,
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

        } else {
            toast.warn(intl.formatMessage({ id: "IDS_SELECTDRAFTVERSION" }));
        }
    }
}

//ProjectMaster Click
export const getProjectMaster = (projectmasterItem, userInfo, masterData) => {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("/projectmaster/getActiveProjectMasterById", {
            nprojectmastercode: projectmasterItem.nprojectmastercode,
            nprojecttypecode: projectmasterItem.nprojecttypecode,
            userinfo: userInfo
        })
            .then(response => {


                let masterData1 = {
                    ...masterData,

                    ...response.data
                }

                // ...masterData,
                // ...response.data
                masterData = masterData1
                sortData(masterData);
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        // masterData,
                        loading: false,
                        dataState: undefined,
                        masterData

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
          
                  } else {
                    //status 417
                    toast.warn(intl.formatMessage({
          
                      id: error.response.data
          
                    }));
          
                  }
            });
    }
}

export function getProjectmasterAddMemberService(screenName, operation, masterData, userInfo, ncontrolCode) {
    return function (dispatch) {
        // if (masterData.SelectedProjectMaster.ntransactionstatus !== transactionStatus.RETIRED) {

        dispatch(initRequest(true));
        rsapi().post("projectmaster/getProjectUnmappedTeammember", {
            "nprojectmastercode": masterData.SelectedProjectMaster["nprojectmastercode"],
            userinfo: userInfo
        })

            .then(response => {

                let masterData1 = {
                    ...masterData,

                    ...response.data
                }
                masterData = masterData1
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        MembersList: response.data,
                        masterData,
                        openChildModal: true,
                        operation, screenName, ncontrolCode,
                        //selectedRecord, 
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
        //}
        // else {
        //     toast.warn(intl.formatMessage({ id: "IDS_SELECTNONRETIEDPROJECTMASTERVERSION" }));
        // }
    }
}


export function ReportInfo(screenName, operation, primaryKeyName, masterData, userInfo, ncontrolCode, needjsontemplate) {
    return function (dispatch) {

        const Status = masterData.SelectedProjectMaster.ntransactionstatus;
        if (Status === transactionStatus.DRAFT || Status === transactionStatus.APPROVED) {
            let urlArray = [];
            // const Submitter = rsapi().post("/projectmaster/getEditReportInfoProject", {
            //                                   [primaryKeyName]: masterData.SelectedProjectMaster[primaryKeyName],needjsontemplate:needjsontemplate!=4?3:4,
            //                                   "userinfo": userInfo
            //                 });

            urlArray.push(rsapi().post("/projectmaster/getEditReportInfoProject", {
                [primaryKeyName]: masterData.SelectedProjectMaster[primaryKeyName],
                "userinfo": userInfo
            }));


            if (needjsontemplate != 4)
                urlArray.push(rsapi().post("/projectmaster/getReportTemplate", {
                    "userinfo": userInfo
                })
                );
            urlArray.push(rsapi().post("/projectmaster/getActiveReportTemplate", {
                [primaryKeyName]: masterData.SelectedProjectMaster[primaryKeyName],
                "userinfo": userInfo
            }));


            // const ReportTemplate=rsapi().post("/projectmaster/getReportTemplate", {
            //     "userinfo": userInfo});
            //urlArray = [Submitter,ReportTemplate];
            dispatch(initRequest(true));
            Axios.all(urlArray)
                .then(response => {
                    let selectedRecord = {};
                    let reportTemplateList = [];
                    if (needjsontemplate != 4) {
                        reportTemplateList = constructOptionList(response[1].data || [], "nreporttemplatecode", "stemplatename", undefined, undefined, false).get("OptionList");

                    }

                    selectedRecord["sreporttemplateversion"] = response[0].data.ReportInfoProject.sreporttemplateversion;
                    selectedRecord["srevision"] = response[0].data.ReportInfoProject.srevision;
                    selectedRecord["srevisionauthor"] = response[0].data.ReportInfoProject.srevisionauthor;
                    selectedRecord["sintroduction"] = response[0].data.ReportInfoProject.sintroduction;
                    selectedRecord["stestproductheadercomments"] = response[0].data.ReportInfoProject.stestproductheadercomments;
                    selectedRecord["stestproductfootercomments1"] = response[0].data.ReportInfoProject.stestproductfootercomments1;
                    selectedRecord["stestproductfootercomments2"] = response[0].data.ReportInfoProject.stestproductfootercomments2;
                    selectedRecord["stestproductfootercomments3"] = response[0].data.ReportInfoProject.stestproductfootercomments3;
                    selectedRecord["stestproductfootercomments4"] = response[0].data.ReportInfoProject.stestproductfootercomments4;
                    selectedRecord["ssamplingdetails"] = response[0].data.ReportInfoProject.ssamplingdetails;
                    selectedRecord["suncertainitymeasurement"] = response[0].data.ReportInfoProject.suncertainitymeasurement;
                    if (needjsontemplate != 4) {
                        if (response[2].data.ReportTemplate != null) {
                            selectedRecord["nreporttemplatecode"] = {
                                "value": response[2].data.ReportTemplate["nreporttemplatecode"],
                                "label": response[2].data.ReportTemplate["stemplatename"]
                            };
                        }
                    }
                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {
                            isOpen: true,
                            masterData: masterData,
                            selectedRecord,
                            operation: operation,
                            screenName: screenName,
                            openModal: true,
                            ncontrolCode: ncontrolCode,
                            loading: false,
                            reportTemplateList

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
                        toast.error(intl.formatMessage({ id: error.message }));
                    } else {
                        toast.warn(intl.formatMessage({ id: error.response.data }));
                    }
                })
        } else {
            toast.info(intl.formatMessage({ id: "IDS_SELECTDRAFTRECORD" }));

        }






    }

}
export function getClientByCategory(methodParam, selectedRecord) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("/client/getClientByCategory", { "nclientcatcode": methodParam.inputData.primarykey, "userinfo": methodParam.inputData.userinfo }).then(response => {
            let Client = [];
            Client = constructOptionList(response.data.Client || [], "nclientcode", "sclientname", undefined, undefined, false).get("OptionList");
            dispatch({
                type: DEFAULT_RETURN, payload: {
                    loading: false, Client, selectedRecord
                }
            }


            );
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


export function getQuotationByClient(methodParam, selectedRecord) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("/projectmaster/getQuotaionNoByClient", { "nclientcatcode": methodParam.inputData.nclientcatcode, "nclientcode": methodParam.inputData.nclientcode, "userinfo": methodParam.inputData.userinfo }).then(response => {
            let QuotationNo = [];
            QuotationNo = constructOptionList(response.data || [], "nquotationcode", "squotationno", undefined, undefined, false).get("OptionList");
            QuotationNo.map(key => {

            })
            dispatch({
                type: DEFAULT_RETURN, payload: {
                    loading: false, QuotationNo, selectedRecord
                }
            }


            )
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

export function closureProjectMaster(inputParam, masterData) {


    return function (dispatch) {
        dispatch(initRequest(true));

        const formData = inputParam.formData;
        formData.append("userinfo", JSON.stringify(inputParam.inputData.userinfo));
        rsapi().post(inputParam.classUrl + "/" + "closure" + inputParam.methodUrl, formData).then(response => {
            masterData = {
                ...masterData,
                ...response.data
            }
            
            // const foundIndex = masterData["ProjectMaster"].findIndex(
            //     x => x["nprojectmastercode"] === masterData["SelectedProjectMaster"]["nprojectmastercode"]
            //   );
            if (masterData["searchedData"]) {
                const foundIndex1 = masterData["searchedData"].findIndex(
                    x => x["nprojectmastercode"] === masterData["SelectedProjectMaster"]["nprojectmastercode"]
                );
             // masterData["ProjectMaster"][foundIndex] = masterData["SelectedProjectMaster"];

            }
            masterData = sortData(masterData);

            //  })             
            dispatch({
                type: DEFAULT_RETURN, payload: {
                    loading: false, masterData, openModal: false, operation: inputParam.operation,
                    ncontrolCode: inputParam.ncontrolCode,
                }
            }


            )
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
export function validateEsignforModal(inputParam) {
    return (dispatch) => {
        dispatch(initRequest(true));
        return rsapi().post("login/validateEsignCredential", inputParam.inputData)
            .then(response => {
                if (response.data.credentials === "Success") {
                    const methodUrl = inputParam["screenData"]["inputParam"]["methodUrl"];

                    inputParam["screenData"]["inputParam"]["inputData"]["userinfo"] = inputParam.inputData.userinfo;

                    if (inputParam["screenData"]["inputParam"]["inputData"][methodUrl.toLowerCase()] &&
                        inputParam["screenData"]["inputParam"]["inputData"][methodUrl.toLowerCase()]["esignpassword"]) {
                        delete inputParam["screenData"]["inputParam"]["inputData"][methodUrl.toLowerCase()]["esignpassword"];
                        delete inputParam["screenData"]["inputParam"]["inputData"][methodUrl.toLowerCase()]["esigncomments"];
                        delete inputParam["screenData"]["inputParam"]["inputData"][methodUrl.toLowerCase()]["esignreason"];
                        delete inputParam["screenData"]["inputParam"]["inputData"][methodUrl.toLowerCase()]["agree"];
                    }
                    // ALPD-2437 added for Type3 Component. Use selected record to clear esign values
                    if (inputParam["screenData"]["inputParam"]["selectedRecord"]) {

                        delete inputParam["screenData"]["inputParam"]["selectedRecord"]["esignreason"];
                        delete inputParam["screenData"]["inputParam"]["selectedRecord"]["esignpassword"];
                        delete inputParam["screenData"]["inputParam"]["selectedRecord"]["esigncomments"];
                        delete inputParam["screenData"]["inputParam"]["selectedRecord"]["agree"];
                    }
                    dispatch(modalSave(inputParam["screenData"]["inputParam"], inputParam["screenData"]["masterData"]))
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

export function projectMasterModal(selectedProjecmaster, operation, screenName, ncontrolcode, sdate, userInfo,timeZone) {
    return (dispatch) => {
        let alertMsg;
        let check;
        if (operation === "complete" || operation === "retire") {
            check = selectedProjecmaster.ntransactionstatus === transactionStatus.APPROVED;
            alertMsg = "IDS_SELECTAPPROVEVERSION";
        }
        if (operation === "closure") {
            alertMsg = "IDS_SELECTCOMPLETEORRETIREACTION";
            check = selectedProjecmaster.ntransactionstatus === transactionStatus.COMPLETED || selectedProjecmaster.ntransactionstatus === transactionStatus.RETIRED;

        }


        if (check) {
            dispatch(initRequest(true));
            let selectedRecord = {};
            let ntimezonedate;
            let stimezonedate;
            let openModal = false;
            let modalShow = false;
            if (operation === "complete") {
                ntimezonedate = "ntzprojectcompletiondate";
                stimezonedate = "stzprojectcompletiondate";
                modalShow = true;
            }
            if (operation === "retire") {
                ntimezonedate = "ntzprojectretiredate";
                stimezonedate = "stzprojectretiredate";
                modalShow = true;

            }
            if (operation === "closure") {

                ntimezonedate = "ntzprojectclosuredate";
                stimezonedate = "stzprojectclosuredate";
                openModal = true;
            }
            let urlArray = [];
            //const timeZoneService = rsapi().post("timezone/getTimeZone");
            const UTCtimeZoneService = rsapi().post("timezone/getLocalTimeByZone", {
                userinfo: userInfo
            });
            urlArray = [UTCtimeZoneService]
            Axios.all(urlArray).then(response => {
                const timezoneMap = constructOptionList(timeZone || [], "ntimezonecode",
                    "stimezoneid", undefined, undefined, false);

                const TimeZoneList = timezoneMap.get("OptionList");
                let date = rearrangeDateFormat(userInfo, response[0].data?.date);

                selectedRecord = {
                    ntzprojectcompletiondate: {
                        "value": userInfo.ntimezonecode,
                        "label": userInfo.stimezoneid
                    },
                    stimezonedate: userInfo.stimezoneid,
                };

                if (operation === "retire") {
                  selectedRecord = {
                    ntzprojectretiredate: {
                        "value": userInfo.ntimezonecode,
                        "label": userInfo.stimezoneid
                    },
                    stimezonedate: userInfo.stimezoneid,
                };

            }
            if (operation === "closure") {

                 selectedRecord = {
                    ntzprojectclosuredate: {
                        "value": userInfo.ntimezonecode,
                        "label": userInfo.stimezoneid
                    },
                    stimezonedate: userInfo.stimezoneid,
                };
            }

                selectedRecord[sdate] = date;


                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        loading: false, selectedRecord, modalShow: modalShow, operation: operation,
                        screenName: screenName, TimeZoneList,
                        ncontrolcode: ncontrolcode,
                        openModal: openModal
                    }
                }


                )
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

            toast.warn(intl.formatMessage({ id: alertMsg }));

        }

    };
}
export const getAvailableQuotation = (Item,screenName, userInfo, ncontrolCode) => {
    return (dispatch) => {
        if (Item.ntransactionstatus === transactionStatus.DRAFT|| Item.ntransactionstatus === transactionStatus.APPROVED) {
            const inputParam = {
                nprojectmastercode: Item.nprojectmastercode,
                "userinfo": userInfo
            }
            dispatch(initRequest(true));
            rsapi().post("projectmaster/getAvailableProjectQuotation", inputParam)
                .then(response => {
                    const availableDataMap = constructOptionList(response.data, "nquotationcode", "squotationno", false, false, true);
                    const ProjectQuotationList = availableDataMap.get("OptionList");
                    dispatch({
                    
                        type: DEFAULT_RETURN,
                        payload: {
                            openChildModal: true,
                            showSaveContinue: false,
                            ProjectQuotationList: ProjectQuotationList,
                            screenName: screenName,
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
        else {
            toast.warn(intl.formatMessage({id: "IDS_SELECTDRAFTAPPROVEDRECORD"}));

        }
    }
}
export const getActiveProjectQuotationById = (quotationParam) => {
    return function (dispatch) {
        if (quotationParam.SelectedProjectMaster.ntransactionstatus === transactionStatus.DRAFT
            || quotationParam.SelectedProjectMaster.ntransactionstatus === transactionStatus.APPROVED) {
            let urlArray = [];

            const quotationById = rsapi().post("projectmaster/getQuotation", {
                "userinfo": quotationParam.userInfo
            });
          
            const activeQuotationById = rsapi().post("projectmaster/getActiveProjectQuotationById", {
                [quotationParam.primaryKeyField]: quotationParam.primaryKeyValue,
                "userinfo": quotationParam.userInfo
            });
              
            urlArray = [quotationById, activeQuotationById];


            dispatch(initRequest(true));
            Axios.all(urlArray)
                .then(response => {
                    let selectedRecord = {};
                    let quotationData = [];

                    const quotationOptions = constructOptionList(response[0].data.Quotation || [], "nquotationcode", "squotationno", false, false, true);

                    const ProjectQuotationList = quotationOptions.get("OptionList");

                    quotationData.push({
                        "value": response[1].data["nquotationcode"],
                        "label": response[1].data["squotationno"]
                    });
                    selectedRecord = response[1].data;

                    selectedRecord["nquotationcode"] = quotationData[0];
               
                
                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {
                            ProjectQuotationList: ProjectQuotationList,
                            selectedRecord: selectedRecord,
                            operation: quotationParam.operation,
                            screenName: "IDS_QUOTATION",
                            openChildModal: true,
                            ncontrolCode: quotationParam.ncontrolCode,
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
        else {
            toast.warn(intl.formatMessage({id: "IDS_SELECTDRAFTAPPROVEDRECORD"}));

        }
    }
}

