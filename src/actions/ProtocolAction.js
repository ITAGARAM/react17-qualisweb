import rsapi from '../rsapi';
import Axios from 'axios';
import { toast } from 'react-toastify';
import { DEFAULT_RETURN, UN_AUTHORIZED_ACCESS } from './LoginTypes';
import { initRequest } from './LoginAction';
import { intl } from '../components/App';
import { sortData,constructOptionList,replaceUpdatedObject,constructjsonOptionList,constructjsonOptionDefault,childComboLoadForEdit
    ,rearrangeDateFormat } from '../components/CommonScript';
import { transactionStatus, attachmentType } from '../components/Enumeration';
import { postCRUDOrganiseTransSearch,viewAttachment,crudMaster } from './ServiceAction';

export function getProtocolTemplateByConfigVersion(inputData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("protocol/getProtocolTemplateList", inputData)
            .then(response => {
                let responseData = { ...response.data }
                responseData = sortData(responseData)
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData: {
                            ...inputData.masterData,
                            ...responseData,
                            defaultApprovalVersionValue: inputData.defaultApprovalVersionValue                           
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

export function ProtocolFilterSubmit(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("protocol/getProtocolData", inputParam.inputData)
            .then(response => {
                let responseData = { ...response.data }
                
                let masterData = {
                    ...inputParam.masterData,
                    ...responseData,
                }
                if (inputParam.searchRef !== undefined && inputParam.searchRef.current !== null) {
                    inputParam.searchRef.current.value = "";
                    masterData['searchedProtocol'] = undefined
                }
                
                sortData(masterData);
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData,
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

export const getProtocolDetail = (protocolItem) => {
    return function (dispatch) {
        dispatch(initRequest(true));
       
        rsapi().post("/protocol/getActiveProtocolById", {ndesigntemplatemappingcode:protocolItem.masterData.realDesignTemplateMappingValue.ndesigntemplatemappingcode,
            napprovalconfigversioncode:protocolItem.masterData.realApprovalVersionValue.napprovalconfigversioncode,
            ntranscode:protocolItem.masterData.realStatusValue.ntransactionstatus,
            nprotocolcode: protocolItem.nprotocolcode,userinfo: protocolItem.userinfo })
            .then(response => {                
                    let masterData = {...protocolItem.masterData, ...response.data };

                //sortData(masterData);
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
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

export function completeProtocolAction(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("protocol/completeProtocol", inputParam.inputData)
            .then(response => {
                if (response.data) {
                    replaceUpdatedObject(response.data["protocol"], inputParam.inputData.masterData.protocol, "nprotocolcode");

                    delete response.data["protocol"];
                    let masterData = {
                        ...inputParam.inputData.masterData, ...response.data,                       
                    }

                    let respObject = {                        
                        ...inputParam.inputData,
                        masterData, //Added by sonia on 13th Feb 2025 for jira id:ALPD-5403
                        loading: false,
                        loadEsign: false,
                        openModal: false
                    }
                    dispatch(postCRUDOrganiseTransSearch(inputParam.postParamList, respObject))

                   
                    // dispatch({
                    //     type: DEFAULT_RETURN,
                    //     payload: {
                    //         masterData,
                    //         loading: false,
                    //         loadEsign: false,
                    //         openModal: false,
                    //     }    
                    // })
                } else {
                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {
                            loading: false,
                            loadEsign: false,
                            openModal: false
                        }
                    });
                    toast.warn(response.data.rtn);
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

export function dynamicAction(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("protocol/dynamicActionProtocol", inputParam.inputData)
            .then(response => {
                if (response.data) {
                    replaceUpdatedObject(response.data["protocol"], inputParam.inputData.masterData.protocol, "nprotocolcode");

                    delete response.data["protocol"];
                    let masterData = {
                        ...inputParam.inputData.masterData, ...response.data,
                    }
                    
                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {
                            masterData,
                            loading: false,
                            loadEsign: false,
                            openModal: false,
                        }    
                    })
                } else {
                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {
                            loading: false,
                            loadEsign: false,
                            openModal: false
                        }
                    });
                    toast.warn(response.data.rtn);
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

export function rejectProtocolAction(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("protocol/rejectProtocol", inputParam.inputData)
            .then(response => {
                if (response.data) {
                    replaceUpdatedObject(response.data["protocol"], inputParam.inputData.masterData.protocol, "nprotocolcode");

                    delete response.data["protocol"];
                    let masterData = {
                        ...inputParam.inputData.masterData, ...response.data,
                       
                    }
                   
                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {
                            masterData,
                            loading: false,
                            loadEsign: false,
                            openModal: false,
                        }    
                    })
                } else {
                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {
                            loading: false,
                            loadEsign: false,
                            openModal: false
                        }
                    });
                    toast.warn(response.data.rtn);
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

export const addProtocolFile = (inputParam) => {
    return (dispatch) => {
        //if(inputParam.masterData.selectedProtocol[0].ntransactionstatus === transactionStatus.DRAFT || inputParam.masterData.selectedProtocol[0].ntransactionstatus === transactionStatus.CORRECTION){
            dispatch(initRequest(true));
            let urlArray = [rsapi().post("/linkmaster/getLinkMaster", {
                userinfo: inputParam.userInfo
            })];
            if (inputParam.operation === "update") {
                urlArray.push(rsapi().post("/protocol/getActiveProtocolFileById", {
                    userinfo: inputParam.userInfo,
                    genericlabel:inputParam.genericLabel,
                    "nprotocolcode": inputParam.selectedRecord.nprotocolcode,
                    "nprotocolfilecode" : inputParam.selectedRecord.nprotocolfilecode,
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
                        editObject = response[1].data.ProtocolFile[0];
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
								//ALPD-5615-->Added bu Vignesh R(08-04-2025)
                                ssystemfilename:editObject.ssystemfilename
                            }
                        }
    
                        selectedRecord = {
                            ...link,
                            nprotocolfilecode: editObject.nprotocolfilecode,
                            nattachmenttypecode: editObject.nattachmenttypecode,
                            sdescription:editObject.sdescription,
                            nlinkcode,
    
                            // disabled: true
                        };
                    } else {
                        selectedRecord = {
                            nattachmenttypecode: response[0].data.AttachmentType.length > 0 ?
                                response[0].data.AttachmentType[0].nattachmenttypecode : attachmentType.FTP,
                            nlinkcode: defaultLink.length > 0 ? defaultLink[0] : "", 
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
        // }else{
        //     toast.warn(intl.formatMessage({ id:"IDS_SELECTDRAFTCORRECTIONRECORD" }));

        // }
      
    }
}

export function validateEsignforProtocol(inputParam) {
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
        let action = screenData.inputParam.action
        switch (action) {
            case "editprotocol":
                dispatch(updateProtocolAction(screenData.inputParam, screenData.masterData, "openModal"));
                break;
            case "deleteprotocol":
                dispatch(crudMaster(screenData.inputParam, screenData.masterData,"openModal"));
                break; 
            case "editprotocolfile":
                dispatch(crudMaster(screenData.inputParam, screenData.masterData,"openChildModal"));
                break; 
            case "deleteprotocolfile":
                dispatch(crudMaster(screenData.inputParam, screenData.masterData,"openChildModal"));
                break;     
            case "complete":
                dispatch(completeProtocolAction(screenData.inputParam, screenData.masterData));
                break;
            case "dynamicAction":
                dispatch(dynamicAction(screenData.inputParam, screenData.masterData));
                break;
            case "reject":
                dispatch(rejectProtocolAction(screenData.inputParam, screenData.masterData));
                break;
            case "copy":
                dispatch(crudMaster(screenData.inputParam, screenData.masterData, "openModal"));
                break;    
            default:
                break;
        }
    }
}


export function getEditComboService(inputParam, columnList,
    selectedRecord1, childColumnList, comboComponents,
    withoutCombocomponent, editableComboList) {
    return function (dispatch) {

        dispatch(initRequest(true));
        const { userInfo } = { ...inputParam };
        let masterData = inputParam["masterData"];
        let parentColumnList = [...columnList, ...editableComboList];
        
        masterData["selectedProtocol"] = [];
        masterData["selectedProtocol"].push(inputParam["toedit"]);

        const nprotocolcode = inputParam.toedit[inputParam.primaryKeyField];
        const ndesigntemplatemappingcode = inputParam.masterData.defaultDesignTemplateMappingValue.ndesigntemplatemappingcode;

        let urlArray = [];

        const timeZoneService = rsapi().post("timezone/getTimeZone");
        
        const selectedProtocolData = rsapi().post("/protocol/getEditProtocolDetails", {
            nprotocolcode,ndesigntemplatemappingcode, parentcolumnlist: parentColumnList,
            childcolumnlist: childColumnList,userinfo: userInfo
        })

        const dateService = rsapi().post("dynamicpreregdesign/dateValidation", {
            datecolumnlist: withoutCombocomponent.filter(x => x.inputtype === "date"),
            userinfo: userInfo
        })

        urlArray = [timeZoneService, selectedProtocolData, dateService]

        Axios.all(urlArray)
            .then(response => {
                let selectedRecord = { ...response[1].data["EditData"] };
                selectedRecord = { ...selectedRecord, ...selectedRecord['jsondata'] }
                
                const timeZoneMap = constructOptionList(response[0].data || [], "ntimezonecode", "stimezoneid", undefined, undefined, true);
                const timeZoneList = timeZoneMap.get("OptionList");
                const defaultTimeZone = { label: userInfo.stimezoneid, value: userInfo.ntimezonecode }

                
                    const languagetypeCode = undefined
                    const comboData = response[1].data;
                    delete comboData['EditData']
                    let comboValues = {}
                    if (columnList.length > 0) {
                        columnList.map(x => {
                            if (x.inputtype === 'combo') {
                                if (comboData[x.label] && comboData[x.label].length > 0) 
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
                                if (comboData[x.label] && comboData[x.label].length > 0) 
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

                   

                    
                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {
                           
                            operation: "update",
                            screenName:"IDS_PROTOCOL",                           
                            timeZoneList,
                            defaultTimeZone,
                            selectedRecord,
                            ncontrolCode: inputParam.ncontrolCode,
                            openModal: true,                           
                            loading: false,                            
                            comboData: comboValues.comboData,
                            childColumnList, comboComponents,
                            withoutCombocomponent,
                            columnList,
                            masterData
                        }
                    })
                //}
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
                    toast.info(intl.formatMessage({ id: error.response.data }));
                }
            })

    }
}

export function insertProtocolAction(inputParam, masterData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        let requestUrl = '';
        if (inputParam.isFileupload) {
            requestUrl = rsapi().post("/protocol/createProtocolWithFile", inputParam.formData);
        } else {
            requestUrl = rsapi().post("/protocol/createProtocol", inputParam.inputData);
        }
        return requestUrl
            .then(response => {
                if (response.data) {
                    // let Protocol = updatedObjectWithNewElement(response.data["Protocol"], masterData.Protocol, 'Protocol');
                    let protocol = response.data["protocol"];
                    let selectedProtocol = response.data["selectedProtocol"];    
                    masterData = {
                        ...masterData, ...response.data,
                        selectedProtocol,protocol,
                    }
                    
                    let respObject = {
                        masterData,
                        ...inputParam.inputData,
                        openModal: false,
                        loadEsign: false,                     
                        selectedRecord: undefined,
                        loading: false,                       
                        selectedRecord: {},                      
                        protocolSkip: 0,                       
                    }

                     inputParam.postParamList[0]['clearFilter'] = 'yes';
                    dispatch(postCRUDOrganiseTransSearch(inputParam.postParamList, respObject))
                    // dispatch({
                    //     type: DEFAULT_RETURN, 
                    //     payload: { 
                    //         masterData,
                    //        ...inputParam.inputData,
                    //        openModal: false,
                    //        loadEsign: false,                     
                    //        selectedRecord: undefined,
                    //        loading: false,                       
                    //        selectedRecord: {},                      
                    //        protocolSkip: 0,                       
                    //     } 
                    // })


                } else {
                    toast.warn(response.data.rtn);
                    dispatch({ 
                        type: DEFAULT_RETURN, 
                        payload: { 
                            loading: false                            
                        } 
                    })
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
                    dispatch({ 
                        type: DEFAULT_RETURN,
                        payload: {
                            loading: false
                        } })
                    toast.error(error.message);
                }
                else {                    
                    toast.warn(error.response.data);
                    dispatch({
                        type: DEFAULT_RETURN, payload: {
                            loading: false
                        }
                    });                    
                }
            })
    }
}

export function updateProtocolAction(inputParam, masterData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        let requestUrl = '';
        if (inputParam.isFileupload) {
            requestUrl = rsapi().post("/protocol/updateProtocolWithFile", inputParam.formData);
        } else {
            requestUrl = rsapi().post("/protocol/updateProtocol", inputParam.inputData);
        }
        return requestUrl
            .then(response => {
                if (response.data) {
                  
                    replaceUpdatedObject(response.data["protocol"], masterData.protocol, "nprotocolcode");
                    masterData = {
                        ...masterData,
                        selectedProtocol: response.data["selectedProtocol"],               
                    }

                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {
                            masterData,  loading: false, 
                            loadEsign: false, openModal: false,
                             selectedRecord: {}
                        }
                    });
                   
                } else {
                    toast.warn(response.data.rtn);
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
                            openModal:false
                        }
                    });
                }
                else {
                    toast.warn(error.response.data);
                    dispatch({ type: DEFAULT_RETURN, payload: { loading: false} })
                }
            })
    }
}


export function copyProtocolAction(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("protocol/getCopyProtocol", inputParam.inputData)
            .then(response => {

                const produtCategoryMap = constructOptionList(response.data && response.data.productCategory || [], "nproductcatcode",
                    "sproductcatname", undefined, undefined, false);

                const productMap = constructOptionList(response.data && response.data.product || [], "nproductcode",
                    "sproductname", undefined, undefined, false);

                const productCategory = produtCategoryMap.get("OptionList");
                const product = productMap.get("OptionList");

                const copyData = response.data && response.data.copyProtocol;
                const productCategoryName = copyData[0]["sproductcatname"];
                const productName = copyData[0]["sproductname"];
                const protocolName = copyData[0]["sprotocolname"];

                let selectedRecord = {};
                selectedRecord["sprotocolname"] = "";
                
                selectedRecord["nproductcatcode"] = {
                    "value": copyData[0]["nproductcatcode"],
                    "label": copyData[0]["sproductcatname"]
                };

                selectedRecord["nproductcode"] = {
                    "value": copyData[0]["nproductcode"],
                    "label": copyData[0]["sproductname"]
                };


                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                      
                        productCategory,
                        product,                       
                        selectedRecord,
                        productCategoryName,
                        productName,
                        protocolName,
                        operation: inputParam.inputData.operation,
                        screenName: inputParam.inputData.screenName,
                        openModal: true,
                        loading: false,
                        ncontrolCode:inputParam.inputData.ncontrolCode,
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

export function dynamicFileDownload(filedata) {
    return (dispatch) => {
        if (filedata.viewName === 'InfoView') {
            if (filedata && filedata[filedata.field[2] + ['_ssystemfilename_Protocol']] !== undefined && filedata[filedata.field[2]] !== "") {
                const inputParam = {
                    inputData: {
                    viewFile: {
                        ssystemfilename: filedata[filedata.field[2] + ['_ssystemfilename_Protocol']],
                        nprotocolcode: filedata.nprotocolcode,
                        sfilename: filedata[filedata.field[2]]
                    },
                    userinfo: filedata.userInfo
                    },
                    classUrl: "protocol",
                    operation: "view",
                    methodUrl: "ProtocolWithFile",
                }
                dispatch(viewAttachment(inputParam));
            } else {
                toast.warn(intl.formatMessage({ id: "IDS_FILENOTUPLOADED" }))
            }      
        }  
    }
}

export function getProduct(nproductcatcode,userInfo, selectedRecord) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("protocol/getProduct", {"nproductcatcode": nproductcatcode,"userinfo": userInfo})
            .then(response => {
                let product = [];                
                const productMap = constructOptionList(response.data && response.data.product || [], "nproductcode","sproductname",
                     undefined, undefined, false);
                product = productMap.get("OptionList");
                selectedRecord["nproductcode"]="";
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        product,                      
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
