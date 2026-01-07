import rsapi from '../rsapi';
import { DEFAULT_RETURN, UN_AUTHORIZED_ACCESS } from './LoginTypes';
import { toast } from 'react-toastify';
import Axios from 'axios';
import { initRequest } from './LoginAction';
import { sortData, constructOptionList, rearrangeDateFormat } from '../components/CommonScript';
import { intl } from '../components/App';
import { transactionStatus } from '../components/Enumeration';

export function getGoodsInFilterSubmit(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("goodsin/getGoodsInData", inputParam.inputData)
            .then(response => {
                let responseData = { ...response.data }
                delete inputParam.masterData.searchedData

                let masterData = {
                    ...inputParam.masterData,
                    ...responseData,
                }               
                sortData(masterData);
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData,
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

export function getGoodsInComboService (inputParam) {
    return function (dispatch){

        // if(inputParam.operation === "update" && inputParam.masterData.selectedGoodsIn.ntransactionstatus=== transactionStatus.APPROVED){
        //     toast.warn(intl.formatMessage({ id: "IDS_SELECTDRAFTRECEIVERECORDTOEDIT" }));
        // }else {
            
        let urlArray = [];
        let selectedId = null;
        let Client =null;
        let ProjectType =null;
        let Project =null;
      
            const addGoodsInService =rsapi().post("goodsin/getGoodsInAdd",{userinfo:inputParam.userInfo});
            
            if (inputParam.operation === "create") {

                urlArray = [addGoodsInService];
            }else if(inputParam.operation === "update"){

                const clientService = rsapi().post("goodsin/getClient", {"nclientcatcode":inputParam.masterData.selectedGoodsIn.nclientcatcode,"userinfo": inputParam.userInfo });
               // const projectTypeService = rsapi().post("goodsin/getProjectType",{"nclientcatcode":inputParam.masterData.selectedGoodsIn.nclientcatcode,"nclientcode":inputParam.masterData.selectedGoodsIn.nclientcode,"userinfo": inputParam.userInfo})
                const projectService = rsapi().post("goodsin/getProjectMaster", {"nclientcatcode":inputParam.masterData.selectedGoodsIn.nclientcatcode,"nclientcode":inputParam.masterData.selectedGoodsIn.nclientcode,"nprojecttypecode":inputParam.masterData.selectedGoodsIn.nprojecttypecode,"userinfo": inputParam.userInfo });
                const GoodsInById = rsapi().post("goodsin/getGoodsInEdit", { [inputParam.primaryKeyField]: inputParam.masterData.selectedGoodsIn[inputParam.primaryKeyField], "userinfo": inputParam.userInfo });

                urlArray = [addGoodsInService,clientService,projectService,GoodsInById];
                selectedId = inputParam.primaryKeyValue;

            }

        dispatch(initRequest(true));
        Axios.all(urlArray)
        .then(response => {
            let selectedRecord = {};
          
                let data=response[0].data;
                const clientCatList = constructOptionList(data["ClientCategory"] || [], "nclientcatcode","sclientcatname", undefined, undefined, false);   
                const ClientCategory = clientCatList.get("OptionList");

                // const projectTypeList = constructOptionList(data["ProjectType"] || [], "nprojecttypecode", "sprojecttypename", undefined, undefined, false);
                // const ProjectType = projectTypeList.get("OptionList");
                             
                const courierList = constructOptionList(data["Courier"] || [], "ncouriercode", "scouriername", undefined, undefined, false);
                const Courier = courierList.get("OptionList");

                const timezoneList = constructOptionList(data["TimeZone"] || [], "ntimezonecode", "stimezoneid", undefined, undefined, false);
                const TimeZone = timezoneList.get("OptionList");


                if(inputParam.operation === "update"){

                    const clientList = constructOptionList( response[1].data["Client"] || [], "nclientcode","sclientname", undefined, undefined, false);   
                    Client = clientList.get("OptionList");

                     const projectTypeList = constructOptionList( response[1].data["ProjectType"] || [], "nprojecttypecode", "sprojecttypename", undefined, undefined, false);
                     ProjectType = projectTypeList.get("OptionList");
    
                    const projectList = constructOptionList( response[2].data["ProjectMaster"] || [], "nprojectmastercode", "sprojectname", undefined, undefined, false);
                    Project = projectList.get("OptionList");

                    const editData = response[3].data.selectedGoodsIn;
                    
                    selectedRecord["nnoofpackages"] = editData.nnoofpackages;
                    selectedRecord["sconsignmentno"] = editData.sconsignmentno;
                    selectedRecord["noutofhours"] = editData.noutofhours;
                    selectedRecord["ssecurityrefno"] = editData.ssecurityrefno;
                    selectedRecord["scomments"] = editData.scomments;
                    selectedRecord["dgoodsindatetime"] = rearrangeDateFormat(inputParam.userInfo,editData.sgoodsindatetime);
                    selectedRecord["nclientcatcode"] ={
                        "value": editData["nclientcatcode"],
                        "label": editData["sclientcatname"]
                    };
                    selectedRecord["nclientcode"] ={
                        "value": editData["nclientcode"],
                        "label": editData["sclientname"]
                    };
                    selectedRecord["nprojecttypecode"] ={
                        "value": editData["nprojecttypecode"],
                        "label": editData["sprojecttypename"]
                    };
                    selectedRecord["nprojectmastercode"] ={
                        "value": editData["nprojectmastercode"],
                        "label": editData["sprojectname"]
                    };
                    selectedRecord["ncouriercode"] ={
                        "value": editData["ncouriercode"],
                        "label": editData["scouriername"]
                    };            

                    selectedRecord = {...selectedRecord}
                }

            dispatch({
                type: DEFAULT_RETURN, payload: {
                    ClientCategory,
                    Client,
                    ProjectType,
                    Project,
                    Courier,
                    TimeZone,
                    selectedRecord, 
                    openModal: true,
                    operation: inputParam.operation, 
                    screenName: inputParam.screenName,
                    ncontrolCode: inputParam.ncontrolCode, 
                    loading: false,
                    selectedId
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



    //}
}

export function getClient(nclientcatcode,masterData, userInfo, selectedRecord) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("goodsin/getClient", {"nclientcatcode": nclientcatcode,"userinfo": userInfo})
            .then(response => {
                let Client = [];  
                let ProjectType =[];
                let Project = [];

                const ClientMap = constructOptionList(response.data.Client || [], "nclientcode","sclientname", undefined, undefined, false);
                Client = ClientMap.get("OptionList");
                selectedRecord["nclientcode"]="";

                const ProjectTypeMap = constructOptionList(response.data.ProjectType || [], "nprojecttypecode","sprojecttypename", undefined, undefined, false);
                ProjectType = ProjectTypeMap.get("OptionList");
                selectedRecord["nprojecttypecode"]="";

                 
                const ProjectMap = constructOptionList(response.data.ProjectMaster || [], "nprojectmastercode","sprojectname", undefined, undefined, false);
                Project = ProjectMap.get("OptionList");
                selectedRecord["nprojectmastercode"]=""; 

                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        Client,
                        ProjectType,
                        Project,
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

export function getProjectType(nclientcatcode,nclientcode,masterData, userInfo, selectedRecord) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("goodsin/getProjectType", {"nclientcatcode": nclientcatcode,"nclientcode":nclientcode,"userinfo": userInfo})
            .then(response => {
                let ProjectType = [];  
                let Project = [];
                const ProjectTypeMap = constructOptionList(response.data.ProjectType || [], "nprojecttypecode","sprojecttypename", undefined, undefined, false);
                ProjectType = ProjectTypeMap.get("OptionList");
                selectedRecord["nprojecttypecode"]="";

                const ProjectMap = constructOptionList(response.data.ProjectMaster || [], "nprojectmastercode","sprojectname", undefined, undefined, false);
                Project = ProjectMap.get("OptionList");
                selectedRecord["nprojectmastercode"]="";    

                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        ProjectType,
                        Project,
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

export function getProject(nclientcatcode,nclientcode,nprojecttypecode,masterData, userInfo, selectedRecord) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("goodsin/getProjectMaster", {"nclientcatcode":nclientcatcode,"nclientcode":nclientcode,"nprojecttypecode": nprojecttypecode,"userinfo": userInfo})
            .then(response => {
                let Project = []; 
                const ProjectMap = constructOptionList(response.data.ProjectMaster || [], "nprojectmastercode","sprojectname", undefined, undefined, false);
                Project = ProjectMap.get("OptionList");
                selectedRecord["nprojectmastercode"]="";        

                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        Project,
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

export const getGoodsInDetail = (goodsInItem, userInfo, masterData) => {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("/goodsin/getActiveGoodsInById", {ngoodsincode: goodsInItem.ngoodsincode,userinfo: userInfo })
            .then(response => {
                

                    let masterData1  = {...masterData, ...response.data }

                    masterData=masterData1
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

export function viewInformation(ngoodsincode, userInfo, masterData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("/goodsin/getActiveGoodsInById", {ngoodsincode:ngoodsincode,userinfo: userInfo })        
            .then(response => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData: {
                            ...masterData,
                            ...response.data,
                            selectedRecordView : response.data.selectedGoodsIn
                        },
                        loading: false,
                        operation: "view",
                        openModal: true,
                        screenName: "IDS_GOODSIN"
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

export function checkListGoodsIn(masterData,selectedGoodsIn,Checklist,ncontrolCode,userInfo) {
    return function (dispatch) {
        dispatch(initRequest(true));

        if(Checklist && Checklist.nchecklistversioncode !==undefined){
            rsapi().post("/goodsin/getChecklistDesign", {nchecklistversioncode:Checklist.nchecklistversioncode,ngoodsincode:selectedGoodsIn.ngoodsincode ,userinfo: userInfo })        
            .then(response => {
                let selectedRecord = {};
                let lsteditedQB = [];

                selectedRecord = {
                    sgoodsinid: selectedGoodsIn.sgoodsinid,
                    sclientname: selectedGoodsIn.sclientname,
                    ngoodsincode: selectedGoodsIn.ngoodsincode
                }

                response.data.ChecklistData.map(checklist => {
                    selectedRecord[checklist.nchecklistversionqbcode] = {
                        nchecklistqbcode: checklist.nchecklistqbcode,
                        nchecklistversioncode: checklist.nchecklistversioncode,
                        nchecklistversionqbcode: checklist.nchecklistversionqbcode,
                        sdefaultvalue: checklist.nchecklistcomponentcode ===7  ? rearrangeDateFormat(userInfo,checklist.sdefaultvalue) :checklist.sdefaultvalue,
                      //  sdefaultvalue: checklist.sdefaultvalue,

                        sgoodsinid: selectedGoodsIn.sgoodsinid,
                        sclientname: selectedGoodsIn.sclientname,
                    }
                    lsteditedQB.push(checklist.nchecklistversionqbcode);
                    return null;
                });
                response.data.ChecklistData.map(checklist => {
                    selectedRecord['jsondata'] = {
                        ...selectedRecord['jsondata'],
                        //[checklist.nchecklistversionqbcode]: checklist.sdefaultvalue
                        [checklist.nchecklistversionqbcode]:checklist.nchecklistcomponentcode ===7 ? rearrangeDateFormat(userInfo,checklist.sdefaultvalue) :checklist.sdefaultvalue
                    }
                    return null;
                });
                selectedRecord["editedQB"] = lsteditedQB;

                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData: {
                            ...masterData,
                            ...response.data
                        },
                        //selectedId: response.data.selectedId,
                        selectedRecord: selectedRecord,
                        loading: false,
                        screenName: "IDS_GOODSINCHECKLIST",
                        openTemplateModal: true,
                        needSaveButton: true,
                        operation: "checklist",
                        ncontrolCode:ncontrolCode
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
       
        }else{
            dispatch({
                type: DEFAULT_RETURN,
                payload: {
                    loading: false
                }
            })
            toast.warn(intl.formatMessage({ id: "IDS_CONFIGURETHECHECKLIST" }));

        }
        
    }
}

export function downloadGoodsIn(masterData,selectedRecord,userInfo,REPORTTYPE,ncontrolcode) {
    return (dispatch) => {
        if(selectedRecord.ntransactionstatus===transactionStatus.RECEIVED  || selectedRecord.ntransactionstatus===transactionStatus.APPROVED ){ //|| transactionStatus.APPROVED

        dispatch(initRequest(true));
        rsapi().post("/goodsin/goodsinReport", {masterData:masterData,ngoodsincode: selectedRecord.ngoodsincode,userinfo: userInfo, nreporttypecode: REPORTTYPE,ncontrolcode:ncontrolcode})        

       
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
        }else{
            toast.warn(intl.formatMessage({ id: "IDS_SELECTDOENLOADRECEIVEAPPROVE"}));
        }
    }
}



export function onSaveGoodsInCheckList(inputParam) {

    return function (dispatch) {

        let listResultCheckList = [];
        if (inputParam.selectedRecord && inputParam.selectedRecord.jsondata) {
            inputParam.selectedRecord.editedQB.map(qbcode =>
                listResultCheckList.push(inputParam.selectedRecord[qbcode]))

            let inputParamData = {

                ngoodsincode: inputParam.selectedRecord.ngoodsincode,
                GoodsInCheckList: {
                    nchecklistversioncode: listResultCheckList[0].nchecklistversioncode,
                    nchecklistqbcode: listResultCheckList[0].nchecklistqbcode,
                    jsondata: inputParam.selectedRecord.jsondata,
                    ngoodsincode: inputParam.selectedRecord.ngoodsincode,
                },
                userinfo: inputParam.inputData.userinfo,
                ndesigntemplatemappingcode: inputParam.inputData["ndesigntemplatemappingcode"],
                ncontrolcode: -1
            }

            dispatch(initRequest(true));
            rsapi().post("goodsin/createGoodsInChecklist", inputParamData)

                .then(response => {
                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {
                            selectedRecord: {},
                            templateData: undefined,
                            openTemplateModal: false,
                            openModal: false,
                            loading: false,
                            loadEsign: false
                        }
                    })
                })
                .catch(error => {
                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {
                            loading: false,
                            loadEsign: false
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
        } else {

            dispatch({
                type: DEFAULT_RETURN,
                payload: {
                    openTemplateModal: false,
                    selectedRecord: {},
                    loading: false,
                    loadEsign: false
                }
            })
        }
    }
}

export function validateEsignGoodsIn(inputParam) {
    return (dispatch) => {
        dispatch(initRequest(true));
        return rsapi().post("login/validateEsignCredential", inputParam.inputData)
            .then(response => {
                if (response.data.credentials === "Success") {

                    const methodUrl = inputParam.screenData.inputParam.methodUrl;
                    inputParam["screenData"]["inputParam"]["inputData"]["userinfo"] = inputParam.inputData.userinfo;

                    if (inputParam["screenData"]["inputParam"]["inputData"][methodUrl.toLowerCase()] &&
                        inputParam["screenData"]["inputParam"]["inputData"][methodUrl.toLowerCase()]["esignpassword"]) {
                        delete inputParam["screenData"]["inputParam"]["inputData"][methodUrl.toLowerCase()]["esignpassword"]
                        delete inputParam["screenData"]["inputParam"]["inputData"][methodUrl.toLowerCase()]["esigncomments"]
                        delete inputParam["screenData"]["inputParam"]["inputData"][methodUrl.toLowerCase()]["esignreason"]
                        delete inputParam["screenData"]["inputParam"]["inputData"][methodUrl.toLowerCase()]["agree"]
                    }
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
        let action = screenData.inputParam.operation
        switch (action) {
            case "checklist":
                dispatch(onSaveGoodsInCheckList(screenData.inputParam, screenData.masterData));
                break;                          
            default:
                break;
        }
    }
}   

// export function getEditGoodsInSampleService(goodsinSampleEditParam, columnList,selectedRecord1, childColumnList, comboComponents,
//     withoutCombocomponent) {
//     return function (dispatch) {

//         dispatch(initRequest(true));
//         const { userInfo, operation } = { ...goodsinSampleEditParam };
//         let masterData = goodsinSampleEditParam["masterData"];

//         if (masterData["selectedSample"].length > 1 ||
//             masterData["selectedSample"]
//                 .findIndex(x => x[goodsinSampleEditParam.primaryKeyName] === goodsinSampleEditParam["editrow"][goodsinSampleEditParam.primaryKeyName])
//             === -1) {
//             inputParam.editRegParam["getSampleChildDetail"] = true;
//         }
//         masterData["selectedSample"] = [];
//         masterData["selectedSample"].push(goodsinSampleEditParam["editrow"]);

//         const npreregno = inputParam.mastertoedit[inputParam.primaryKeyName];
//         let urlArray = [];

//         const timeZoneService = rsapi().post("timezone/getTimeZone");
       
//         // const selectedRegistration = rsapi().post("/registration/getEditRegistrationDetails", {
//         //     ...inputParam.editRegParam, npreregno, parentcolumnlist: columnList,
//         //     childcolumnlist: childColumnList,
//         //     userinfo: userInfo
//         // })

//         const dateService = rsapi().post("dynamicpreregdesign/dateValidation", {
//             datecolumnlist: withoutCombocomponent.filter(x => x.inputtype === "date"),
//             userinfo: userInfo
//         })

//         urlArray = [timeZoneService,  dateService]

//         Axios.all(urlArray)
//             .then(response => {
//                 let selectedRecord = { ...response[1].data["EditData"] };
//                 selectedRecord = { ...selectedRecord, ...selectedRecord['jsondata'] }
               


//                 const timeZoneMap = constructOptionList(response[0].data || [], "ntimezonecode", "stimezoneid", undefined, undefined, true);
//                 const timeZoneList = timeZoneMap.get("OptionList");
//                 const defaultTimeZone = { label: userInfo.stimezoneid, value: userInfo.ntimezonecode }              

               
//                     const languagetypeCode = undefined
//                     const comboData = response[1].data;
//                     delete comboData['EditData']
//                     let comboValues = {}
//                     if (columnList.length > 0) {
//                         columnList.map(x => {
//                             if (x.inputtype === 'combo') {
//                                 if (comboData[x.label] && comboData[x.label].length > 0) //&& comboData[x.label][0].hasOwnProperty(x.source) 
//                                 {
//                                     if (comboData[x.label].length > 0) {
//                                         if (comboData[x.label][0].label === undefined) {
//                                             const optionList = constructjsonOptionList(comboData[x.label] || [], x.valuemember,
//                                                 x.displaymember, false, false, true, undefined, x.source, x.isMultiLingual, languagetypeCode, x)
//                                             comboData[x.label] = optionList.get("OptionList");
//                                         } else {
//                                             comboData[x.label] = comboData[x.label]
//                                             const optionList = constructjsonOptionDefault(comboData[x.label] || [], x.valuemember,
//                                                 x.displaymember, false, false, true, undefined, x.source, x.isMultiLingual, languagetypeCode, x)
//                                         }
//                                     } else {
//                                         comboData[x.label] = []
//                                     }
//                                     //comboValues = childComboLoad(x, comboData, selectedRecord, 
//                                     //   childColumnList, withoutCombocomponent)\
//                                     comboValues = childComboLoadForEdit(x, comboData, selectedRecord,
//                                         childColumnList, withoutCombocomponent)
//                                 } else {
//                                     comboValues = {
//                                         "comboData": comboData,
//                                     }
//                                 }
//                             } else {
//                                 comboValues = {
//                                     comboData: comboData,
//                                     ...comboValues
//                                 }
//                             }
//                         })
//                     }
//                     else {
//                         comboValues = {
//                             "comboData": comboData,
//                         }
//                     }

//                     withoutCombocomponent.map(date => {
//                         if (date.inputtype === 'date') {
//                             selectedRecord[date.label] = selectedRecord[date.label] && selectedRecord[date.label] !== '-' ?
//                                 rearrangeDateFormat(userInfo, selectedRecord[date.label]) : ""

//                             if (date.nperiodcode) {
//                                 selectedRecord[date.label + "value"] = response[2].data[date.label] ?
//                                     new Date(response[2].data[date.label]["datevalue"]) : null;
//                             } else {
//                                 selectedRecord[date.label + "value"] = new Date();
//                             }

//                             if (date.hidebeforedate) {
//                                 selectedRecord[date.label + "min"] = selectedRecord[date.label + "value"]
//                             }
//                             if (date.hideafterdate) {
//                                 selectedRecord[date.label + "max"] = selectedRecord[date.label + "value"]
//                             }
//                         }
//                     })

                  
//                     dispatch({
//                         type: DEFAULT_RETURN,
//                         payload: {
                           
//                             operation: goodsinSampleEditParam.operation,
//                             screenName: goodsinSampleEditParam.screenName,
//                             timeZoneList,
//                             defaultTimeZone,
//                             selectedRecord,
//                             ncontrolCode: goodsinSampleEditParam.ncontrolCode,
//                             loadPreregister: true,
//                             parentPopUpSize: "xl",
//                             loading: false,
//                             showSample: undefined,
//                             comboData: comboValues.comboData,
//                             childColumnList, comboComponents,
//                             withoutCombocomponent,
//                             columnList,
//                             masterData

//                         }
//                     })
                
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
//                 } else {
//                     toast.info(intl.formatMessage({
//                         id: error.response.data
//                     }));
//                 }
//             })

//     }
// }

// export function getGoodsInComboService(goodsInParam) {
//     return function (dispatch) {

//         const manufacturerService = rsapi().post("manufacturer/getManufacturerListForCombo", { userinfo: goodsInParam.userInfo });
//         const courierService = rsapi().post("courier/getAllActiveCourier", { userinfo: goodsInParam.userInfo });
//         const recipientService = rsapi().post("users/getUserWithDeptForCombo", { userinfo: goodsInParam.userInfo });
//         const timeZoneService = rsapi().post("timezone/getTimeZone");
//         const UTCtimeZoneService = rsapi().post("timezone/getLocalTimeByZone", { userinfo: goodsInParam.userInfo });
//         let urlArray = [];
//         let selectedId = null;
//         if (goodsInParam.operation === "create") {
//             urlArray = [manufacturerService, courierService, recipientService, timeZoneService, UTCtimeZoneService];
//         }
//         else {
//             const url = goodsInParam.inputParam.classUrl + "/getActiveGoodsInById";

//             const goodsInById = rsapi().post(url, { [goodsInParam.primaryKeyField]: goodsInParam.primaryKeyValue, "userinfo": goodsInParam.userInfo });
//             urlArray = [manufacturerService, courierService, recipientService, timeZoneService, UTCtimeZoneService, goodsInById];
//             selectedId = goodsInParam.primaryKeyValue;
//         }
//         dispatch(initRequest(true));
//         Axios.all(urlArray)
//             .then(response => {
//                 const manufacturerMap = constructOptionList(response[0].data || [], "nmanufcode",
//                     "smanufname", undefined, undefined, true);

//                 const courierMap = constructOptionList(response[1].data || [], "ncouriercode",
//                     "scouriername", undefined, undefined, false);

//                 const recipientMap = constructOptionList(response[2].data || [], "nusercode",
//                     "susername", undefined, undefined, true);

//                 const timeZoneMap = constructOptionList(response[3].data || [], "ntimezonecode",
//                     "stimezoneid", undefined, undefined, true);

//                 const manufacturerList = manufacturerMap.get("OptionList");
//                 const courierList = courierMap.get("OptionList");
//                 const recipientList = recipientMap.get("OptionList");
//                 const timeZoneList = timeZoneMap.get("OptionList");
//                 //const currentTime = new Date(response[4].data);
//                 const currentTime = rearrangeDateFormat(goodsInParam.userInfo, response[4].data);

//                 let validRecord = true;
//                 let selectedRecord = {
//                     //"dgoodsindate": new Date(response[4].data),
//                     "ntzgoodsindate": {
//                         "value": goodsInParam.userInfo.ntimezonecode,
//                         "label": goodsInParam.userInfo.stimezoneid
//                     },
//                     "stzgoodsindate": goodsInParam.userInfo.stimezoneid
//                 };
//                 if (goodsInParam.operation === "update") {
//                     if (response[5].data["ntransactionstatus"] === transactionStatus.GOODS_RECEIVED) {
//                         validRecord = false;
//                     }
//                     else {
//                         let manufacturer = [];
//                         let courier = [];
//                         let user = [];
//                         let timeZone = [];
//                         selectedRecord = response[5].data;

//                         manufacturer.push({ "value": response[5].data["nmanufcode"], "label": response[5].data["smanufname"] });
//                         if (response[5].data["ncouriercode"] !== -1) {
//                             courier.push({ "value": response[5].data["ncouriercode"], "label": response[5].data["scouriername"] });
//                             selectedRecord["ncouriercode"] = courier[0];
//                         }
//                         else {
//                             selectedRecord["ncouriercode"] = undefined;
//                         }
//                         user.push({ "value": response[5].data["nrecipientcode"], "label": response[5].data["suserfullname"] });
//                         timeZone.push({ "value": response[5].data["ntzgoodsindate"], "label": response[5].data["stzgoodsindate"] });

//                         selectedRecord["nmanufcode"] = manufacturer[0];
//                         selectedRecord["nrecipientcode"] = user[0];
//                         //selectedRecord["ndeptcode"] = response[5].data["ndeptcode"];
//                         selectedRecord["sdeptname"] = response[5].data["sdeptname"];
//                         selectedRecord["ntzgoodsindate"] = timeZone[0];
//                         selectedRecord["stzgoodsindate"] = timeZone[0].label;

//                        //selectedRecord["dgoodsindate"] = new Date(response[5].data["sgoodsindate"]);

//                        selectedRecord["dgoodsindate"] = rearrangeDateFormat(goodsInParam.userInfo, response[5].data["sgoodsindate"]);
//                     }

//                 }
//                 else {
//                     //selectedRecord["dgoodsindate"]= new Date(response[4].data);
//                     selectedRecord["dgoodsindate"] = rearrangeDateFormat(goodsInParam.userInfo, response[4].data);
                  
                  
//                     selectedRecord["nmanufcode"] = manufacturerMap.get("DefaultValue");
//                     selectedRecord["ncouriercode"] = courierMap.get("DefaultValue");
//                     selectedRecord["nrecipientcode"] = recipientMap.get("DefaultValue");
//                     // selectedRecord["ntzgoodsindate"] = timeZoneMap.get("DefaultValue");
//                     //selectedRecord["stzgoodsindate"] = timeZoneMap.get("DefaultValue") ? timeZoneMap.get("DefaultValue").label :"";
//                 }
//                 if (validRecord) {
//                     dispatch({
//                         type: DEFAULT_RETURN, payload: {
//                             currentTime,
//                             manufacturerList,//:response[0].data || [], 
//                             courierList,//:response[1].data  || [], 
//                             recipientList,//:response[2].data  || [],   
//                             timeZoneList,//:response[3].data  || [],                                                                                     
//                             operation: goodsInParam.operation, screenName: goodsInParam.screenName,
//                             selectedRecord,
//                             openModal: true,
//                             ncontrolCode: goodsInParam.ncontrolCode,
//                             loading: false, selectedId
//                         }
//                     });
//                 }
//                 else {
//                     dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
//                     toast.warn(intl.formatMessage({ id: "IDS_GOODSINALREADYRECEIVED" }));
//                 }
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

// export function getGoodsInDetail(goodsIn, fromDate, toDate, userInfo, masterData) {
//     return function (dispatch) {
//         dispatch(initRequest(true));
//         return rsapi().post("goodsin/getGoodsIn", { nrmsno: goodsIn.nrmsno, fromDate, toDate, userinfo: userInfo })
//             .then(response => {

//                 masterData = { ...masterData, ...response.data };
//                 sortData(masterData);
//                 dispatch({ type: DEFAULT_RETURN, payload: { masterData, loading: false } });
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
//                     toast.error(intl.formatMessage({ id: error.message }));
//                 }
//                 else {
//                     toast.warn(intl.formatMessage({ id: error.response.data }));
//                 }

//             })
//     }
// }

// export function getChainCustodyComboDataService(chainCustodyParam) {
//     return function (dispatch) {

//         // if (chainCustodyParam.masterData.SelectedGoodsIn.ntransactionstatus === transactionStatus.GOODS_IN) {
//         //     toast.warn(intl.formatMessage({ id: "IDS_GOODSINNOTRECEIVED" }));
//         // }
//         // else {
//         let selectedId = null;
//         let selectedRecord = {
//             "dreceiveddate": new Date(),
//             "ntzreceiveddate": {
//                 "value": chainCustodyParam.userInfo.ntimezonecode,
//                 "label": chainCustodyParam.userInfo.stimezoneid
//             },
//             "stzreceiveddate": chainCustodyParam.userInfo.stimezoneid
//         };

//         if (chainCustodyParam.operation === "update") {
//             if (chainCustodyParam.editRow.nreceivedownercode === chainCustodyParam.userInfo.nusercode) {
//                 selectedId = chainCustodyParam.primaryKeyValue;
//                 const timeZoneService = rsapi().post("timezone/getTimeZone");
//                 const ccById = rsapi().post("goodsin/getActiveChainCustodyById", { [chainCustodyParam.primaryKeyField]: chainCustodyParam.primaryKeyValue, "userinfo": chainCustodyParam.userInfo });
//                 const UTCtimeZoneService = rsapi().post("timezone/getLocalTimeByZone", { userinfo: chainCustodyParam.userInfo });
           
//                 const urlArray = [timeZoneService, ccById, UTCtimeZoneService];

//                 dispatch(initRequest(true));
//                 Axios.all(urlArray)
//                     // dispatch(initRequest(true));
//                     // return rsapi().post("goodsin/getActiveChainCustodyById", { [chainCustodyParam.primaryKeyField] : chainCustodyParam.primaryKeyValue, "userinfo": chainCustodyParam.userInfo} )
//                     .then(response => {
//                         selectedRecord = response[1].data;

//                         let timeZone = [];
//                         timeZone.push({ "value": response[1].data["ntzreceiveddate"], "label": response[1].data["stzreceiveddate"] });

//                         const timeZoneMap = constructOptionList(response[0].data || [], "ntimezonecode",
//                             "stimezoneid", undefined, undefined, true);

//                         const timeZoneList = timeZoneMap.get("OptionList");

//                         selectedRecord["ntzreceiveddate"] = timeZone[0];
//                         selectedRecord["stzreceiveddate"] = timeZone[0].label;

//                         //selectedRecord["dreceiveddate"] = new Date(response[1].data["sreceiveddate"]);

//                         selectedRecord["dreceiveddate"] = rearrangeDateFormat(chainCustodyParam.userInfo, response[1].data["sreceiveddate"]);
//                         dispatch({
//                             type: DEFAULT_RETURN, payload: {
//                                 timeZoneList,//:response[0].data  || [],                                                                                 
//                                 operation: chainCustodyParam.operation,
//                                 screenName: chainCustodyParam.screenName,
//                                 selectedRecord,
//                                 openChildModal: true,
//                                 ncontrolCode: chainCustodyParam.ncontrolCode,
//                                 loading: false, selectedId,
//                                 //currentTime:new Date(response[2].data)
//                                 currentTime:rearrangeDateFormat(chainCustodyParam.userInfo, response[2].data)
//                             }
//                         });

//                     })
//                     .catch(error => {
//                         dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
//                         if (error.response?.status === 429) {
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
//                             toast.error(intl.formatMessage({ id: error.message }));
//                         }
//                         else {
//                             toast.warn(intl.formatMessage({ id: error.response.data }));
//                         }
//                     })
//             }
//             else {
//                 toast.warn(intl.formatMessage({ id: "IDS_INVALIDOWNERTOEDIT" }));
//             }
//         }
//         else {
//             dispatch(initRequest(true));
//             const timeZoneService = rsapi().post("timezone/getTimeZone");
//             const UTCtimeZoneService = rsapi().post("timezone/getLocalTimeByZone", { userinfo: chainCustodyParam.userInfo });
//             const validateGoodsIn = rsapi().post("goodsin/validateGoodsIn", {
//                 nrmsno: chainCustodyParam.masterData.SelectedGoodsIn.nrmsno,
//                 userinfo: chainCustodyParam.userInfo
//             });
//             let urlArray = [timeZoneService, UTCtimeZoneService,validateGoodsIn];
//             return Axios.all(urlArray)
//                 .then(response => {

//                     const timeZoneMap = constructOptionList(response[0].data || [], "ntimezonecode",
//                         "stimezoneid", undefined, undefined, true);

//                     const timeZoneList = timeZoneMap.get("OptionList");
//                     dispatch({
//                         type: DEFAULT_RETURN, payload: {
//                             timeZoneList,//:response.data  || [],
//                             operation: chainCustodyParam.operation,
//                             selectedRecord: { ...selectedRecord, 
//                                 //dreceiveddate: new Date(response[1].data) 
//                                 dreceiveddate: rearrangeDateFormat(chainCustodyParam.userInfo, response[1].data)
//                             },
//                             openChildModal: true,
//                             screenName: chainCustodyParam.screenName,
//                             ncontrolCode: chainCustodyParam.ncontrolCode,
//                             loading: false, selectedId,
//                             //currentTime:new Date(response[1].data)
//                             currentTime: rearrangeDateFormat(chainCustodyParam.userInfo, response[1].data)
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
//                         toast.error(intl.formatMessage({ id: error.message }));
//                     }
//                     else {
//                         toast.warn(intl.formatMessage({ id: error.response.data }));
//                     }
//                 })
//         }
//     }
//     // }
// }

// export function getGoodsInPrinterComboService(inputParam) {
//     return (dispatch) => {
//         dispatch(initRequest(true))
//         rsapi().post("barcode/getPrinter", inputParam.userInfo)
//             .then(response => {
//                 let selectedRecord = {
//                     sprintername: {
//                         value: response.data[0].sprintername,
//                         label: response.data[0].sprintername,
//                         item: response.data[0]
//                     }
//                 };
//                 const printerList = constructOptionList(response.data || [], "sprintername",
//                     "sprintername", undefined, undefined, true).get("OptionList");

//                 dispatch({
//                     type: DEFAULT_RETURN,
//                     payload: {
//                         printerList,
//                         selectedRecord,
//                         operation: "printer",
//                         screenName: "PrintBarcode",
//                         dataToPrint: inputParam.selectedGoodsIn.nrmsno,
//                         ncontrolcode: inputParam.ncontrolcode,
//                         loading: false,
//                         openModal: true
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
//                 } else {
//                     toast.warn(intl.formatMessage({ id: error.response.data }));
//                 }
//             });

//     }

// }

// export function reloadGoodsIn(inputParam) {
//     return function (dispatch) {
//         dispatch(initRequest(true));
//         rsapi().post("goodsin/getGoodsIn", {...inputParam.inputData})
//             .then(response => {
//                 let responseData = { ...response.data }
//                 responseData = sortData(responseData)
//                 let masterData = {
//                     ...inputParam.masterData,
//                     ...responseData,
//                 }
//                 if (inputParam.searchRef !== undefined && inputParam.searchRef.current !== null) {
//                     inputParam.searchRef.current.value = "";
//                     masterData['searchedData'] = undefined
//                 }
//                 dispatch({
//                     type: DEFAULT_RETURN, payload: {
//                         masterData,
//                         loading: false,
//                         showFilter: false
//                     }
//                 })
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