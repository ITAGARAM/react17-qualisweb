import rsapi from '../rsapi';
import { DEFAULT_RETURN, UN_AUTHORIZED_ACCESS } from './LoginTypes';
import { constructOptionList } from '../components/CommonScript'
import { toast } from 'react-toastify';
import Axios from 'axios';
import { initRequest } from './LoginAction';
//import { intl } from '../components/App';
import {  getComboLabelValue } from "../components/CommonScript";
import { intl } from '../components/App';

export function projectytpe(addsampleprocesstypeId,userInfo) {
    return function (dispatch) {
        dispatch(initRequest(true));

        const getprojectytpe= rsapi().post("sampleprocesstype/getProjectType",{"addsampleprocesstypeId":addsampleprocesstypeId,userinfo: userInfo});

        const getperiod = rsapi().post("/period/getPeriodByControl", {"ncontrolcode": addsampleprocesstypeId,"userinfo": userInfo});

        let urlArray = [];
        urlArray = [getprojectytpe,getperiod];

        dispatch(initRequest(true));
        Axios.all(urlArray)
            .then(response => {
                let selectedRecord=[];

                const constructType = constructOptionList(response[0].data || [], "nprojectcode",
                "sprojecttypename", undefined, undefined, false);


                const periodconstructType = constructOptionList(response[1].data || [], "nperiodcode",
                "speriodname", undefined, undefined, false);

                selectedRecord["processperiodtime"]={label:response[1].data[0].speriodname,value:response[1].data[0].nperiodcode};

                selectedRecord["graceperiodtime"]={label:response[1].data[0].speriodname,value:response[1].data[0].nperiodcode};

                 const projecttypeList = constructType.get("OptionList");
                const periodList=periodconstructType.get("OptionList");
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        loading: false, openModal:true,
                        projecttypeList: projecttypeList,
                        periodList:periodList,
                        selectedRecord:selectedRecord,
                        screenName: "IDS_SAMPLEPROCESSTYPE",
                        operation: "create"

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


export function getSampleType(sampletypevalue, sampletypename, userInfo) {
    return function (dispatch) {
        
        const sampletypeList = rsapi().post("sampleprocesstype/getSampleType", { "sampletypevalue": sampletypevalue, "sampletypename": sampletypename, userinfo: userInfo });

        const collectiontubeList = rsapi().post("sampleprocesstype/getCollectionTubeType", { "sampletypevalue": sampletypevalue, "sampletypename": sampletypename, userinfo: userInfo });

        const processtypeList = rsapi().post("sampleprocesstype/getProcessType", { "sampletypevalue": sampletypevalue, "sampletypename": sampletypename, userinfo: userInfo });


        let urlArray = [];
        urlArray = [sampletypeList, collectiontubeList, processtypeList];

        dispatch(initRequest(true));
        Axios.all(urlArray)
            .then(response => {

                const sampletypeListconstruct = constructOptionList(response[0].data || [], "nproductsamplecode",
                    "sproductname", undefined, undefined, false);

                const collectiontubeListconstruct = constructOptionList(response[1].data || [], "ncollectiontubecode",
                    "stubename", undefined, undefined, false);

                const processtypeListconstruct = constructOptionList(response[2].data || [], "nprocesscode",
                    "sprocesstypename", undefined, undefined, false);

                const sampletypeListconstructList = sampletypeListconstruct.get("OptionList");
                const collectiontubeListconstructList = collectiontubeListconstruct.get("OptionList");
                const processtypeListconstructList = processtypeListconstruct.get("OptionList");

                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        loading: false, openModal: true,
                        sampletypeList: sampletypeListconstructList,
                        collectiontubeList: collectiontubeListconstructList,
                        processtypeList: processtypeListconstructList,
                        screenName: "IDS_SAMPLEPROCESSTYPE"
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


// export function getCollectionTubeType(sampletypevalue, sampletypename, userInfo) {
//     return function (dispatch) {
//         dispatch(initRequest(true));
//         return rsapi().post("sampleprocesstype/getCollectionTubeType", { "sampletypevalue": sampletypevalue, "sampletypename": sampletypename, userinfo: userInfo })
//             .then(response => {
//                 const constructType = constructOptionList(response.data || [], "ncollectiontubecode",
//                     "stubename", undefined, undefined, false);

//                 const collectiontubeList = constructType.get("OptionList");
//                 dispatch({
//                     type: DEFAULT_RETURN, payload: {
//                         loading: false, openModal: true,
//                         collectiontubeList: collectiontubeList

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

// export function getProcessType(sampletypevalue, sampletypename, userInfo) {
//     return function (dispatch) {
//         dispatch(initRequest(true));
//         return rsapi().post("sampleprocesstype/getProcessType", { "sampletypevalue": sampletypevalue, "sampletypename": sampletypename, userinfo: userInfo })
//             .then(response => {
//                 const constructType = constructOptionList(response.data || [], "nprocesscode",
//                     "sprocesstypename", undefined, undefined, false);

//                 const processtypeList = constructType.get("OptionList");
//                 dispatch({
//                     type: DEFAULT_RETURN, payload: {
//                         loading: false, openModal: true,
//                         processtypeList: processtypeList

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



export function getActiveSampleProcessTypeById(editParam, userInfo) {
    return function (dispatch) {
        dispatch(initRequest(true));
        const ncontrolCode = editParam.ncontrolCode;

        const sampletypevalue = editParam.editRow.nprojectcode;

        const sampletypename = editParam.editRow.sprojecttypename;

        const userInfoPass = editParam.userInfo;

        const projectytpe = rsapi().post("sampleprocesstype/getProjectType", { "editSampleProcessType": ncontrolCode, userinfo: userInfoPass });

        const sampletypeList = rsapi().post("sampleprocesstype/getSampleType", { "sampletypevalue": sampletypevalue, "sampletypename": sampletypename, userinfo: userInfoPass });

        const collectiontubeList = rsapi().post("sampleprocesstype/getCollectionTubeType", { "sampletypevalue": sampletypevalue, "sampletypename": sampletypename, userinfo: userInfoPass });

        const processtypeList = rsapi().post("sampleprocesstype/getProcessType", { "sampletypevalue": sampletypevalue, "sampletypename": sampletypename, userinfo: userInfoPass });

        const getActiveSampleProcessTypeById = rsapi().post("sampleprocesstype/getActiveSampleProcessTypeById",
            { nsampleprocesstypecode: editParam.editRow.nsampleprocesstypecode, userinfo: userInfoPass });

        let urlArray = [];
        urlArray = [getActiveSampleProcessTypeById, projectytpe, sampletypeList, collectiontubeList, processtypeList];

        dispatch(initRequest(true));
        Axios.all(urlArray)
            .then(response => {

                const selectedRecord = response[0].data;

                const projectytpeconstruct = constructOptionList(response[1].data || [], "nprojectcode",
                    "sprojecttypename", undefined, undefined, false);

                const sampletypeListconstruct = constructOptionList(response[2].data || [], "nproductsamplecode",
                    "sproductname", undefined, undefined, false);

                const collectiontubeListconstruct = constructOptionList(response[3].data || [], "ncollectiontubecode",
                    "stubename", undefined, undefined, false);

                const processtypeListconstruct = constructOptionList(response[4].data || [], "nprocesscode",
                    "sprocesstypename", undefined, undefined, false);

                selectedRecord["sprojecttypename"] = getComboLabelValue(response[0].data, response[1].data,
                    "nprojectcode", "sprojecttypename");

                selectedRecord["sproductname"] = getComboLabelValue(response[0].data, response[2].data,
                    "nproductsamplecode", "sproductname");

                selectedRecord["stubename"] = getComboLabelValue(response[0].data, response[3].data,
                    "ncollectiontubecode", "stubename");

                selectedRecord["sprocesstypename"] = getComboLabelValue(response[0].data, response[4].data,
                    "nprocesscode", "sprocesstypename");

                selectedRecord["processtime"] = response[0].data.nprocesstime;

                selectedRecord["gracetime"] = response[0].data.ngracetime;

                selectedRecord["executionorder"] = response[0].data.nexecutionorder;

                selectedRecord["sdescription"] = response[0].data.sdescription;

                selectedRecord["processperiodtime"]={label:response[0].data.ngracetimeresult,value:response[0].data.nperiodcode};

                selectedRecord["graceperiodtime"]={label:response[0].data.ngracetimeresult,value:response[0].data.nperiodcode};
                //response[0].data[0].ngracetimeresult;


                const projectytpeconstructList = projectytpeconstruct.get("OptionList");
                const sampletypeListconstructList = sampletypeListconstruct.get("OptionList");
                const collectiontubeListconstructList = collectiontubeListconstruct.get("OptionList");
                const processtypeListconstructList = processtypeListconstruct.get("OptionList");

                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        loading: false, openModal: true,
                        projecttypeList: projectytpeconstructList,
                        sampletypeList: sampletypeListconstructList,
                        collectiontubeList: collectiontubeListconstructList,
                        processtypeList: processtypeListconstructList,
                        selectedRecord: selectedRecord,
                        selectedId:editParam.editRow.nsampleprocesstypecode,
                        ncontrolCode: editParam.ncontrolCode,
                        screenName: "IDS_SAMPLEPROCESSTYPE",
                        operation: "update"
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
