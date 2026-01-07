import Axios from 'axios';
import {
    toast
} from 'react-toastify';
import {
    constructOptionList
} from '../components/CommonScript';
import { attachmentType, transactionStatus } from '../components/Enumeration';
import rsapi from '../rsapi';
import { initRequest } from './LoginAction';
import {
    DEFAULT_RETURN,
    UN_AUTHORIZED_ACCESS
} from "./LoginTypes";
import { intl } from '../components/App';

export function getSubContractorComboService(testdetail, userInfo) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("subcontracttestdetail/getSubcontractorBytest", {
            ntestcode: testdetail.ntestcode,
            nsubcontractortestdetailcode: testdetail.nsubcontractortestdetailcode, userinfo: userInfo
        })
            .then(response => {
                let selectedRecord = {}
                selectedRecord["subcontractortestdetail"] = testdetail;

                const subContracorMap = constructOptionList(response.data['TestSubContract'] || [], "nsuppliercode",
                    "ssubcontractor", undefined, undefined, true);
                const subContracorMapList = subContracorMap.get("OptionList");

                //sortData(masterData);
                dispatch({
                    type: DEFAULT_RETURN, payload:
                    {
                        selectedRecord,
                        subContracorMapList,
                        operation: "sendsubcontractor",
                        openModal: true,
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

export function updateSubContractSamplesdetails(inputData, masterData, modalName) {

    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("subcontracttestdetail/updateSentSubContractTestdetails",
            { subcontractortestdetail: inputData.inputData['subcontractortestdetail'], userinfo: inputData.inputData["userinfo"] })
            .then(response => {
                masterData = { ...masterData, ...response.data }


                dispatch({
                    type: DEFAULT_RETURN, payload:
                    {
                        masterData,
                        operation: "sendsubcontractor",
                        openModal: false,
                        loading: false,
                        selectedRecord: {} // ALPD-5409 - Gowtham - 13/2/2025 - SubContractor - Previous record is displayed in the slide out
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

export function updateReceiveSTTSubContractTest(inputData, userInfo, masterData) {

    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("subcontracttestdetail/updateReceiveSTTSubContractTest",
            { subcontractortestdetail: inputData, userinfo: userInfo, })
            .then(response => {

                masterData = { ...masterData, ...response.data }


                dispatch({
                    type: DEFAULT_RETURN, payload:
                    {
                        masterData,
                        operation: "ReceiveSTTSubContractor",
                        openModal: false,
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

export function updateReceiveResultSubContractTest(inputData, userInfo, masterData) {

    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("subcontracttestdetail/updateReceiveResultSubContractTest",
            { subcontractortestdetail: inputData, userinfo: userInfo, })
            .then(response => {

                masterData = { ...masterData, ...response.data }


                dispatch({
                    type: DEFAULT_RETURN, payload:
                    {
                        masterData,
                        operation: "ReceiveSTTSubContractor",
                        openModal: false,
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

export const addFile = (inputParam, userInfo) => {
    return (dispatch) => {
        dispatch(initRequest(true));
        let urlArray = [rsapi().post("/linkmaster/getLinkMaster", {
            userinfo: userInfo
        })];

        urlArray.push(rsapi().post("/subcontracttestdetail/editSubcontractorTestFile", {
            userinfo: userInfo,
            subcontractortestdetail: inputParam
        }))
        Axios.all(urlArray)
            .then(response => {

                const linkMap = constructOptionList(response[0].data.LinkMaster, "nlinkcode", "slinkname", false, false, true);
                const linkmaster = linkMap.get("OptionList");
                let selectedRecord = {};

                const defaultLink = linkmaster.filter(items => items.item.ndefaultlink === transactionStatus.YES);
                let disabled = false;
                let editObject = {};
                if (response[1].data && response[1].data.nattachmenttypecode > 0) {
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
                            sdescription: editObject.sdescription,    //ALPD-855 Fix
                            ssystemfilename: editObject.ssystemfilename
                        }
                    }
                    selectedRecord = {
                        ...link,
                        subcontractortestdetail: inputParam,
                        nattachmenttypecode: editObject.nattachmenttypecode,
                        // sdescription:editObject.sdescription,    //ALPD-855 Fix
                        nlinkcode,
                        // disabled: true
                    };
                } else {
                    selectedRecord = {
                        nattachmenttypecode: response[0].data.AttachmentType.length > 0 ?
                            response[0].data.AttachmentType[0].nattachmenttypecode : attachmentType.FTP,
                        nlinkcode: defaultLink.length > 0 ? defaultLink[0] : "",
                        disabled,
                        subcontractortestdetail: inputParam
                    };
                }
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        openModal: true,
                        operation: "fileattachment",
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

export function saveSubcontractorTestFile(inputParam, masterData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        const formData = inputParam.formData;
        return rsapi().post(inputParam.classUrl + "/" + inputParam.methodUrl, formData)
            .then(response => {
                let selectedRecord = {}
                //selectedRecord["subcontractortestdetail"] = testdetail;
                masterData = { ...response.data }

                //sortData(masterData);
                dispatch({
                    type: DEFAULT_RETURN, payload:
                    {
                        masterData,
                        selectedRecord,
                        operation: "fileattachment",
                        modalName: undefined,
                        openModal: false,
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

export function viewDetail(inputParam, userInfo, masterData) {
    return function (dispatch) {
        dispatch(initRequest(true));

        return rsapi().post("/subcontracttestdetail/viewSubcontractorSampleDetail", { subcontractortestdetail: inputParam, userinfo: userInfo })
            .then(response => {
                let selectedRecord = {}
                selectedRecord["subcontractortestdetail"] = inputParam;
                masterData = { ...masterData, ...response.data }

                //sortData(masterData);
                dispatch({
                    type: DEFAULT_RETURN, payload:
                    {
                        masterData,
                        selectedRecord,
                        operation: "viewRecord",
                        openModal: true,
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

export function viewFile(inputParam, userInfo, masterData) {
    return function (dispatch) {
        dispatch(initRequest(true));

        return rsapi().post("/subcontracttestdetail/viewSubcontractorTestFile", { subcontractortestdetail: inputParam, userinfo: userInfo })
            .then(response => {
                let selectedRecord = {}
                selectedRecord["subcontractortestdetail"] = inputParam;
                masterData = { ...masterData, ...response.data }

                //sortData(masterData);
                dispatch({
                    type: DEFAULT_RETURN, payload:
                    {
                        masterData,
                        selectedRecord,
                        operation: "viewRecord",
                        openModal: true,
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
