import { toast } from "react-toastify";
import { replaceUpdatedObject, sortData } from "../components/CommonScript";
import { transactionStatus } from "../components/Enumeration";
import rsapi from "../rsapi";
import { initRequest, updateStore } from "./LoginAction";
import { DEFAULT_RETURN, UN_AUTHORIZED_ACCESS } from "./LoginTypes";
import { postCRUDOrganiseTransSearch } from "./ServiceAction";
import { intl } from "../components/App";

export function getBAFilterStatus(filterRecord,masterData,userinfo){
    return function (dispatch){
        let inputData={napprovalversioncode:filterRecord.napproveconfversioncode.value,userinfo};
        dispatch(initRequest(true));
        rsapi().post("batchapproval/getFilterStatus", inputData)
            .then(response => {
                masterData = {
                    ...masterData,
                    BA_FilterStatus:response.data.BA_FilterStatus,
                }
                filterRecord={
                    ...filterRecord,
                    ntransactionstatus:{label:response.data.BA_FilterStatusValue.sfilterstatus,value:response.data.BA_FilterStatusValue.ntransactionstatus,item:response.data.BA_FilterStatusValue}
                }
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData,
                        loading: false,
                        filterRecord
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
export function getBatchCreation(inputParam) {
    return function (dispatch) {
        let inputData = {};
        if (inputParam.inputData) {
            inputData = inputParam.inputData
        } else {
            inputData = {
                nreleasebatchcode: parseInt(inputParam.nreleasebatchcode),
                dfrom: inputParam.dfrom,
                dto: inputParam.dto,
                napprovalversioncode: inputParam.napprovalversioncode,
                ntransactionstatus: inputParam.ntransactionstatus,
                activeBATab: inputParam.activeBATab,
                userinfo: inputParam.userinfo
            }
        }
        let {componentDataState,parameterDataState,testCommentDataState,sampleHistoryDataState,
            batchApprovalDataState,decisionDataState,batchClockDataState,checklistDataState,
            batchAttachmentDataState,sampleapprovalDataState} = inputParam
        dispatch(initRequest(true));
        rsapi().post("batchapproval/getBatchCreation", inputData)
            .then(response => {
                let responseData = { ...response.data }
                responseData = sortData(responseData)
                let masterData = {
                    ...inputParam.masterData,
                    ...responseData,
                }
                if (inputParam.searchRef !== undefined && inputParam.searchRef.current !== null) {
                    inputParam.searchRef.current.value = "";
                    masterData['searchedData'] = undefined
                }
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData,
                        loading: false,
                        showFilter: false,
                        updateDataState :true,
                        componentDataState:{...componentDataState,skip:0,take:5,sort:undefined,filter:undefined},
                        parameterDataState:{...parameterDataState,skip:0,take:5,sort:undefined,filter:undefined},
                        testCommentDataState:{...testCommentDataState,skip:0,take:5,sort:undefined,filter:undefined},
                        sampleHistoryDataState:{...sampleHistoryDataState,skip:0,take:5,sort:undefined,filter:undefined},
                        batchApprovalDataState:{...batchApprovalDataState,skip:0,take:5,sort:undefined,filter:undefined},
                        decisionDataState:{...decisionDataState,skip:0,take:5,sort:undefined,filter:undefined},
                        batchClockDataState:{...batchClockDataState,skip:0,take:5,sort:undefined,filter:undefined},
                        checklistDataState:{...checklistDataState,skip:0,take:5,sort:undefined,filter:undefined},
                        batchAttachmentDataState:{...batchAttachmentDataState,skip:0,take:5,sort:undefined,filter:undefined},
                        sampleapprovalDataState:{...sampleapprovalDataState,skip:0,take:5,sort:undefined,filter:undefined},
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
export function getRoleChecklist(nchecklistversioncode, nreleasebatchcode, userinfo) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("batchapproval/viewBatchTemplate", { nchecklistversioncode, nreleasebatchcode,nuserrolecode:userinfo.nuserrole, userinfo })
            .then(response => {
                let selectedRecord = {}
                let editedQB = []
                response.data && response.data.map(qb => {
                    if (qb.sdefaultvalue !== null) {
                        selectedRecord[qb.nchecklistversionqbcode] = { nchecklistversioncode: qb.nchecklistversioncode, nchecklistversionqbcode: qb.nchecklistversionqbcode, nchecklistqbcode: qb.nchecklistqbcode, sdefaultvalue: qb.sdefaultvalue }
                        editedQB.push(qb.nchecklistversionqbcode)
                        selectedRecord['editedQB'] = editedQB
                    }
                    return null;
                })

                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        templateData: response.data,
                        loading: false,
                        openTemplateModal: true,
                        selectedRecord: { ...selectedRecord, nreleasebatchcode },
                        needSaveButton:true
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
export function onSaveBatchChecklist(selectedRecord, userInfo) {

    return function (dispatch) {

        let listChecklistVersionTemplate = [];
        if (selectedRecord && selectedRecord.editedQB) {
            selectedRecord.editedQB.map(qbcode =>
                listChecklistVersionTemplate.push(selectedRecord[qbcode]))
            dispatch(initRequest(true));
            rsapi().post("batchapproval/createUpdateBatchChecklist",
                { checklistversiontemplate: listChecklistVersionTemplate, nreleasebatchcode: selectedRecord["nreleasebatchcode"], "userinfo": userInfo })

                .then(response => {

                    dispatch({
                        type: DEFAULT_RETURN, payload: {
                            selectedRecord: {},
                            templateData: undefined,
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
        } else {

            dispatch({
                type: DEFAULT_RETURN, payload: {
                    openTemplateModal: false, selectedRecord: {}, loading: false
                }
            })
        }
    }
}

export function validateBatchTest(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("batchapproval/validateBatchTests", inputParam.inputData)
            .then(response => {
                if (response.data) {
                    if (inputParam.action.nesignneed === transactionStatus.YES) {

                        const updateInfo = {
                            typeName: DEFAULT_RETURN,
                            data: {
                                loadEsign: true,  screenData: { inputParam, masterData: inputParam.masterData },
                                openChildModal: true,
                                screenName: "performaction",
                                operation: "dynamic",
                                showConfirmAlert: false,
                                loading: false
                            }
                        }
                         dispatch(updateStore(updateInfo));
                        // dispatch({
                        //     type: DEFAULT_RETURN, payload: {
                        //         loadEsign: true,
                        //         screenData: { inputParam, masterData: inputParam.masterData },
                        //         openChildModal: true,
                        //         screenName: "performaction",
                        //         operation: "dynamic",
                        //         showConfirmAlert: false,
                        //         loading: false
                        //     }
                        // })
                    } else {
                        dispatch(performBatchAction(inputParam,true));
                    }
                }
                else {
                    dispatch({
                        type: DEFAULT_RETURN, payload: {
                            showConfirmAlert: true,
                            loading: false,
                            inputParam
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
export function performBatchAction(inputParam) {
    return function (dispatch) {
        
            let URL = "batchapproval/updateApproval";
            if (inputParam.type === 1) {
                URL = "batchapproval/updateDecision";
            }
            dispatch(initRequest(true));
            rsapi().post(URL, inputParam.inputData)
                .then(response => {
                    const responseData={...response.data}
                    sortData(responseData);
                    let masterData = {
                        ...inputParam.masterData,
                        ...responseData,
                        BA_BatchCreation: replaceUpdatedObject(response.data.updatedBatchCreation, inputParam.masterData.BA_BatchCreation, 'nreleasebatchcode'),
                    }
                    let respObject = {
                        masterData,
                        inputParam,
                        openChildModal: false,
                        operation: "dynamic",
                        masterStatus: "",
                        errorCode: undefined,
                        loadEsign: false,
                        showEsign: false,
                        selectedRecord: {},
                        loading: false,
                        showConfirmAlert: false,
                    }

                    dispatch(postCRUDOrganiseTransSearch(inputParam.postParamList, respObject))
                    // dispatch({ type: DEFAULT_RETURN, payload: { ...respObject } })


                })
                .catch(error => {
                    dispatch({ type: DEFAULT_RETURN, payload: { loading: false, showConfirmAlert: false } })
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
export function getBAChildTabDetail(inputData) {
    return function (dispatch) {
        if (inputData.nreleasebatchcode) {
            let inputParamData = {
                nreleasebatchcode: parseInt(inputData.nreleasebatchcode),
                activeBATab: inputData.activeBATab,
                userinfo: inputData.userinfo,
                nflag: inputData.nflag,
                napprovalversioncode: inputData.napprovalversioncode

            }
            let {componentDataState,parameterDataState,testCommentDataState,sampleHistoryDataState,
                batchApprovalDataState,decisionDataState,batchClockDataState,checklistDataState,
                batchAttachmentDataState,sampleapprovalDataState} = inputData
            dispatch(initRequest(true));
            rsapi().post("batchapproval/getBAChildTab", inputParamData)
                .then(response => {
                    let responseData = { ...response.data }
                    responseData = sortData(responseData)
                    dispatch({
                        type: DEFAULT_RETURN, payload: {
                            masterData: {
                                ...inputData.masterData,
                                ...responseData,
                                BA_SelectedBatchCreation:inputData.BA_SelectedBatchCreation
                            },
                            loading: false,
                            activeBATab: inputData.activeBATab,
                            screenName: inputData.screenName,
                            updateDataState :inputData.updateDataState !==undefined ? inputData.updateDataState :true,
                            componentDataState:{...componentDataState,skip:0,take:5,sort:undefined,filter:undefined},
                            parameterDataState:{...parameterDataState,skip:0,take:5,sort:undefined,filter:undefined},
                            testCommentDataState:{...testCommentDataState,skip:0,take:5,sort:undefined,filter:undefined},
                            sampleHistoryDataState:{...sampleHistoryDataState,skip:0,take:5,sort:undefined,filter:undefined},
                            batchApprovalDataState:{...batchApprovalDataState,skip:0,take:5,sort:undefined,filter:undefined},
                            decisionDataState:{...decisionDataState,skip:0,take:5,sort:undefined,filter:undefined},
                            batchClockDataState:{...batchClockDataState,skip:0,take:5,sort:undefined,filter:undefined},
                            checklistDataState:{...checklistDataState,skip:0,take:5,sort:undefined,filter:undefined},
                            batchAttachmentDataState:{...batchAttachmentDataState,skip:0,take:5,sort:undefined,filter:undefined},
                            sampleapprovalDataState:{...sampleapprovalDataState,skip:0,take:5,sort:undefined,filter:undefined},
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
        } else {
            dispatch({
                type: DEFAULT_RETURN, payload: {
                    masterData: {
                        ...inputData.masterData
                    },
                    loading: false,
                    activeBATab: inputData.activeBATab
                }
            })
        }

    }
}
export function getBASampleApprovalHistory(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("batchapproval/getBASampleApprovalHistory", inputParam.inputData)
            .then(response => {
                let historyMap = inputParam.historyMap
                historyMap = { ...historyMap, ...response.data.BA_SampleApprovalHistory }
                const masterData = {
                    ...inputParam.masterData,
                    BA_SampleApprovalHistory: historyMap
                };
                sortData(masterData);
                dispatch(
                    {
                        type: DEFAULT_RETURN,
                        payload: {
                            masterData,
                            loading: false
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
export function BA_viewCheckList(inputData) {

    return function (dispatch) {
        let inputParamData = {
            nreleasebatchcode: inputData.selectedRecord.nreleasebatchcode,
            nchecklistversioncode: inputData.selectedRecord.nchecklistversioncode,
            nuserrolecode:inputData.selectedRecord.nuserrolecode,
            userinfo: inputData.userInfo,
        }
        dispatch(initRequest(true));
        rsapi().post("batchapproval/viewBatchTemplate", inputParamData)
            .then(response => {
                let selectedRecord = {}
                let editedQB = []
                response.data && response.data.map(qb => {
                    if (qb.sdefaultvalue !== null) {
                        selectedRecord[qb.nchecklistversionqbcode] = { nchecklistversioncode: qb.nchecklistversioncode, nchecklistversionqbcode: qb.nchecklistversionqbcode, nchecklistqbcode: qb.nchecklistqbcode, sdefaultvalue: qb.sdefaultvalue }
                        editedQB.push(qb.nchecklistversionqbcode)
                        selectedRecord['editedQB'] = editedQB
                    }
                    return null;
                })

                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        templateData: response.data,
                        loading: false,
                        openTemplateModal: true,
                        selectedRecord: { ...selectedRecord },
                        needSaveButton:false
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
export function validateEsignforBatchApproval(inputParam) {
    return (dispatch) => {
        dispatch(initRequest(true));
        return rsapi().post("login/validateEsignCredential", inputParam.inputData)
            .then(response => {
                if (response.data.credentials === "Success") {

                    const methodUrl = "performaction"
                    inputParam["screenData"]["inputParam"]["inputData"]["userinfo"] = inputParam.inputData.userinfo;

                    if (inputParam["screenData"]["inputParam"]["inputData"][methodUrl.toLowerCase()] &&
                        inputParam["screenData"]["inputParam"]["inputData"][methodUrl.toLowerCase()]["esignpassword"]) {
                        delete inputParam["screenData"]["inputParam"]["inputData"][methodUrl.toLowerCase()]["esignpassword"];
                        delete inputParam["screenData"]["inputParam"]["inputData"][methodUrl.toLowerCase()]["esigncomments"];
                        delete inputParam["screenData"]["inputParam"]["inputData"][methodUrl.toLowerCase()]["esignreason"];                        
                        delete inputParam["screenData"]["inputParam"]["inputData"][methodUrl.toLowerCase()]["agree"];
                    }
                    dispatch(performBatchAction(inputParam["screenData"]["inputParam"], inputParam["screenData"]["masterData"]))
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
export function getSpecComponentView(inputParam) {

    return function (dispatch) {
        let inputData = {
            testgroupspecification:{nallottedspeccode:inputParam.nallottedspeccode},
            userinfo:inputParam.userInfo,
        }
        dispatch(initRequest(true));
        rsapi().post("testgroup/getTestGroupSampleType", inputData)
            .then(response => {
                let selectedRecord = {
                    sproductname:inputParam.sproductname,
                    sspecname:inputParam.sspecname,
                }
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        loading: false,
                        [inputParam.modalName]: true,
                        selectedRecord: { ...selectedRecord },
                        SpecComponents:response.data,
                        operation:"view",
                        screenName:"IDS_TESTGROUP",
                        noSave:true
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