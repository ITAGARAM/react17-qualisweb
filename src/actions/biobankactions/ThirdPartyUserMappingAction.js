import rsapi from '../../rsapi';
import { DEFAULT_RETURN } from './../LoginTypes';
import { toast } from 'react-toastify';
import { initRequest } from './../LoginAction';
import {constructOptionList} from '../../components/CommonScript'
import Axios from 'axios';

export function addGetUserRole(userInfo, ncontrolCode) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("thirdpartyusermapping/ThirdPartyUserMapping", { userinfo: userInfo })
            .then(response => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false,
                       loadSiteBioBankConfig:true,
                        openModal: true,
                        loadthirdpartyusermapingcombo: false,
                        ncontrolcode: ncontrolCode,
                        operation: "create",
                        selectedRecord: {}
                    }
                });
            })
            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } });
                if (error.response?.status === 500) {
                    toast.error(error.message);
                } else {
                    toast.warn(error.response?.data);
                }
            });
    };
}

export function editEditThirdPartyUserMapping(inputParam, userInfo, masterData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("thirdpartyusermapping/getActiveThirdPartyUserMappingById", {
            nthirdpartycode: inputParam.mastertoedit.nthirdpartycode,
            userinfo: userInfo
        })
        .then(response => {
            const selectedRecord = response.data || {};
            dispatch({
                type: DEFAULT_RETURN,
                payload: {
                    loading: false,
                    openModal: true,
                    selectedRecord: selectedRecord,
                    screenName: "IDS_THIRDPARTYUSERMAPPING",
                    loadSiteBioBankConfig:true,
                    masterData: masterData,
                    loadthirdpartyusermapingcombo: false,
                    operation: "update",
                    ncontrolcode:inputParam.editId,
                    nisngsConfirmed:false   //added by sujatha ATE_274 BGSI-185 as a flag for the delete validation
                }
            });
        })
        .catch(error => {
            dispatch({ type: DEFAULT_RETURN, payload: { loading: false } });
            if (error.response?.status === 500) {
                toast.error(error.message);
            } else {
                toast.warn(error.response?.data);
            }
        });
    };
}


export function updateThirdPartyUserMapping(selectedRecord, userInfo, ncontrolCode, formRef, saveType, searchRef) {
 return function (dispatch) {
        dispatch(initRequest(true));
 dispatch(initRequest(true));
   return rsapi().post("thirdpartyusermapping/updateThirdPartyUserMapping", { thirdpartyusermapping:selectedRecord,userinfo: userInfo })
            .then(response => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false,
                        openModal: true,
                        loadthirdpartyusermapingcombo: false,
                        ncontrolcode: ncontrolCode,
                        operation: "update",
                        selectedRecord: {}
                    }
                });
            })
            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } });
                if (error.response?.status === 500) {
                    toast.error(error.message);
                } else {
                    toast.warn(error.response?.data);
                }
            });
    };
}



export function addGetUsers(userInfo,mastersiteData,ncontrolcode) {
    return function (dispatch) {
        dispatch(initRequest(true));
		//modified by sujatha ATE_274 BGSI-185 to fix issue of passing the master site data 0th record hard coded ly to selected record's data  from the jsx
        return rsapi().post("thirdpartyusermapping/getUserRole",{nthirdpartycode:mastersiteData.nthirdpartycode,userinfo:userInfo})
           .then(response => {
                const constructType = constructOptionList(response.data || [], "nuserrolecode",
                "suserrolename", undefined, undefined, false);

                const userRoleList = constructType.get("OptionList");
                   
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        loading: false,
                        userRoleList:userRoleList,
                        loadSiteBioBankConfig:true,
                        openChildModal:true,
                        loadthirdpartyusermapingcombo:true,
                        screenName: "IDS_THIRDPARTYUSERMAPPING",
                        loadEsign:false,
                        operation:'',
                        userList:null
                    }
                });
            })
            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                if (error.response.status === 500) {
                    toast.error(error.message);
                }
                else {
                    toast.warn(error.response.data);
                }

            })
    }
}



export function getuserThirdParty(methodParam, selectedRecord) {

    return function (dispatch) {

        let URL = [];

        URL = rsapi().post("/thirdpartyusermapping/getUsers", { "userinfo": methodParam.inputData.userinfo, "nuserrolecode": methodParam.inputData.primarykey ,"nthirdpartycode":methodParam.inputData.selectedThirdPartyMasterRecord.nthirdpartycode})

        dispatch(initRequest(true));

        Axios.all([URL])

            .then(response => {

                let userList;

                const userMap = constructOptionList(response[0].data || [], "nusercode",

                    "susername", undefined, undefined, false);

                userList = userMap.get("OptionList");



                dispatch({
                    type: DEFAULT_RETURN, payload:

                        { userList, selectedRecord, loading: false }
                })

            })

            .catch(error => {

                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })

                if (error.response.status === 500) {

                    toast.error(error.message);

                }

                else {

                    toast.warn(error.response.data);

                }

            })

    }

}

export function getThirdPartySelectedRecord(selectedpartyData,userInfo,masterData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("thirdpartyusermapping/getThirdPartySelectedRecord",{nthirdpartycode:selectedpartyData.nthirdpartycode,userinfo:userInfo})
           .then(response => {

                    let selectedRecord=response.data.selectedThirdPartyMasterRecord;
                    let lstThirdPartyMapping=response.data.lstThirdPartyMapping;
                    let masterDatadetails={...masterData};
                    masterDatadetails['selectedThirdPartyMasterRecord']=selectedRecord;
                    masterDatadetails['lstThirdPartyMapping']=lstThirdPartyMapping;

                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        loading: false, openChildModal:false,
                        loadSiteBioBankConfig:false,
                        loadthirdpartyusermapingcombo:false,
                        masterData:masterDatadetails,
                    }
                });
            })
            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                if (error.response.status === 500) {
                    toast.error(error.message);
                }
                else {
                    toast.warn(error.response.data);
                }

            })
    }
}
