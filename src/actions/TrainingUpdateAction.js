import rsapi from "../rsapi";
import {
    toast
} from "react-toastify";
import {
    constructOptionList,
    sortData
} from "../components/CommonScript";
import {
    DEFAULT_RETURN,
    UN_AUTHORIZED_ACCESS
} from "./LoginTypes";
import {
    initRequest
} from "./LoginAction";
import Axios from 'axios';
import {
    transactionStatus,
    attachmentType
} from "../components/Enumeration";
import { intl } from "../components/App";


export const getTrainingUpdate = (trainingupdate, userInfo, masterData) => {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("trainingupdate/getTrainingUpdateById", {
            ntrainingcode: trainingupdate.ntrainingcode,
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
                } else if (error.response.status === 500){
                    toast.error(error.message);
                } else{               
                    toast.warn(error.response.data);
                }  
            });
    }
}


export const changeTechniqueFilter = (inputParam, filterTechnique,selectedTechinque) => {
    return (dispatch) => {
        dispatch(initRequest(true));
        rsapi().post("/trainingupdate/get" + inputParam.methodUrl, inputParam.inputData)
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
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false,
                        masterData: {
                            ...masterData,
                            filterTechnique,
                            nfilterTechnique: inputParam.inputData.nfilterTechnique,
                            selectedTechinque:selectedTechinque.item

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
            });
    }
}

export function getParticipantsAccordion(versionObject) {
    let { version, masterData, userInfo } = versionObject
    return function (dispatch) {
        if (!(masterData.selectedParticipants.nparticipantcode === version.nparticipantcode)) {
            const inputData = { nparticipantcode: version.nparticipantcode, userinfo: userInfo }
            rsapi().post('trainingupdate/getParticipantsAccordion', inputData)
            
                .then(response => {
                    sortData(masterData)
                    masterData = {
                        ...masterData,
                        selectedParticipants: response.data.selectedParticipants,
                        TraineeDocuments: response.data.TraineeDocuments
                    }
                    sortData(masterData)
                    dispatch({
                        type: DEFAULT_RETURN, payload: {
                            masterData,
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
        } else {
            dispatch({
                type: DEFAULT_RETURN, payload: { masterData, loading: false }
            })
        }
    }
}

export function getTrainingParticipantsAttended(trainingUpdate,selectedRecord,userInfo,operation,attendanceId) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("trainingupdate/getInvitedParticipants", { "userinfo": userInfo,  "ntrainingcode": parseInt(trainingUpdate.ntrainingcode) })
            .then(response => {

                let nusercode = [];

                // const attendUsersMap = constructOptionList(response.data.InvitedParticipant || [], "nusercode",
                //     "sfullname", undefined, undefined, true);

                const attendUsersList =response.data.InvitedParticipant;

                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        ncontrolCode:attendanceId,
                        usersStatus: attendUsersList, nusercode: nusercode, loading: false,openChildModal: true,
                        screenName:"IDS_ATTENDPARTICIPANTSDETAILS",nFlag:2,selectedRecord:selectedRecord,operation:operation
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
                } else {
                    toast.warn(error.response.data);
                }
            })
    }
}
export function getTrainingParticipantsCertified(trainingUpdate,selectedRecord,userInfo,operation,certifiedId) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("trainingupdate/getAttendedParticipants", { "userinfo": userInfo,  "ntrainingcode": parseInt(trainingUpdate.ntrainingcode) })
            .then(response => {

                let nusercode = [];

                const certifyUsersMap = constructOptionList(response.data.AttendedParticipant || [], "nusercode",
                    "sfullname", undefined, undefined, true);

                const certifyUsersList = response.data.AttendedParticipant;

                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        ncontrolCode:certifiedId,
                        usersStatus: certifyUsersList, nusercode: nusercode, loading: false,openChildModal: true,
                        screenName:"IDS_CERTIFYPARTICIPANTSDETAILS",nFlag:3,selectedRecord:selectedRecord,operation:operation
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
                } else {
                    toast.warn(error.response.data);
                }
            })
    }
}
export function getTrainingParticipantsCompetent(trainingUpdate,selectedRecord,userInfo,operation,competentId) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("trainingupdate/getCertifiedParticipants", { "userinfo": userInfo,  "ntrainingcode": parseInt(trainingUpdate.ntrainingcode) })
            .then(response => {

                let nusercode = [];

                // const competentUsersMap = constructOptionList(response.data.CompetentParticipant || [], "nusercode",
                //     "sfullname", undefined, undefined, true);

                const competentUsersList = response.data.CompetentParticipant;

                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        ncontrolCode:competentId,
                        usersStatus: competentUsersList, nusercode: nusercode, loading: false,openChildModal: true,
                        screenName:"IDS_COMPETENTPARTICIPANTSDETAILS",nFlag:4,selectedRecord:selectedRecord,operation:operation
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
                } else {
                    toast.warn(error.response.data);
                }
            })
    }
}

export const addtrainingdocfile = (inputParam) => {
    return (dispatch) => {
        dispatch(initRequest(true));
        let urlArray = [rsapi().post("/linkmaster/getLinkMaster", {
            userinfo: inputParam.userInfo
        })];

        if (inputParam.operation === "update") {
            urlArray.push(rsapi().post("/trainingupdate/editTrainingFile", {
                userinfo: inputParam.userInfo,
                trainingfile: inputParam.selectedRecord
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
                            slinkdescription: editObject.sfiledesc,
                            nlinkdefaultstatus: editObject.ndefaultstatus,
                            sfilesize: '',
                            nfilesize: 0,
                            ndefaultstatus: 4,
                            sfilename: '',
                            sfiledesc:''
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
                            ...editObject
                        }
                    }



                    selectedRecord = {
                       // ...editObject,
                        ntrainingdoccode: editObject.ntrainingdoccode,
                        nattachmenttypecode: editObject.nattachmenttypecode,
                        ...link,
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
                
                // let selectedRecord = {
                //         nattachmenttypecode:response[0].data.AttachmentType.length>0?
                //         response[0].data.AttachmentType[0].nattachmenttypecode:attachmentType.FTP,
                //         nlinkcode: defaultLink.length > 0 ? defaultLink[0] : "", //{"label": defaultLink[0].slinkname, "value": defaultLink[0].nlinkcode}:"",
                //         disabled
                //     };

                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        openChildModal: true,
                        operation: inputParam.operation,
                        screenName: inputParam.screenName,
                        ncontrolCode: inputParam.ncontrolCode,
                        selectedRecord,
                        loading: false,
                        linkMaster: linkmaster,
                        showSaveContinue: false,
                        editFiles: editObject.nattachmenttypecode === "1" ? editObject : {}

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

export const addtraineedocfile = (inputParam) => {
    return (dispatch) => {
        dispatch(initRequest(true));
        let urlArray = [rsapi().post("/linkmaster/getLinkMaster", {
            userinfo: inputParam.userInfo
        })];

        if (inputParam.operation === "update") {
            urlArray.push(rsapi().post("/trainingupdate/editTraineeFile", {
                userinfo: inputParam.userInfo,
                traineefile: inputParam.selectedRecord
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
                            slinkdescription: editObject.sfiledesc,
                            nlinkdefaultstatus: editObject.ndefaultstatus,
                            sfilesize: '',
                            nfilesize: 0,
                            ndefaultstatus: 4,
                            sfilename: '',
                            sfiledesc:''
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
                            ...editObject
                        }
                    }



                    selectedRecord = {
                       // ...editObject,
                       ntraineedoccode: editObject.ntraineedoccode,
                        nattachmenttypecode: editObject.nattachmenttypecode,
                        ...link,
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
                // let selectedRecord = {
                //         nattachmenttypecode:response[0].data.AttachmentType.length>0?
                //         response[0].data.AttachmentType[0].nattachmenttypecode:attachmentType.FTP,
                //         nlinkcode: defaultLink.length > 0 ? defaultLink[0] : "", //{"label": defaultLink[0].slinkname, "value": defaultLink[0].nlinkcode}:"",
                //         disabled
                //     };

                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        openChildModal: true,
                        operation: inputParam.operation,
                        screenName: inputParam.screenName,
                        ncontrolCode: inputParam.ncontrolCode,
                        selectedRecord,
                        loading: false,
                        linkMaster: linkmaster,
                        showSaveContinue: false,
                        editFiles: editObject.nattachmenttypecode === "1" ? editObject : {}

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


                             
       
