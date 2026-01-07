import rsapi from '../rsapi';
import { DEFAULT_RETURN, UN_AUTHORIZED_ACCESS } from './LoginTypes';
import { sortData } from '../components/CommonScript'//getComboLabelValue,, searchData
import { toast } from 'react-toastify';
import Axios from 'axios';
import { initRequest } from './LoginAction';
import { intl } from '../components/App';
import { transactionStatus } from '../components/Enumeration';

export function getPasswordPolicyDetail(passwordPolicy, userInfo, masterData, selectedcombo) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("passwordpolicy/getPasswordPolicy", {
            npolicycode: passwordPolicy.npolicycode,
            "userinfo": userInfo
        })
            .then(response => {

                masterData = { ...masterData, ...response.data };
                sortData(masterData);
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
                    toast.error(intl.formatMessage({ id: error.message }));
                }
                else {

                    toast.warn(intl.formatMessage({ id: error.response.data }));
                }

            })
    }
}

export function getPasswordPolicyComboService(screenName, operation, primaryKeyName, primaryKeyValue, masterData, userInfo, ncontrolCode) {
    return function (dispatch) {

        if(masterData.UserRole.length >0)
        {
        if (operation === "create" || (operation === "update" && masterData.SelectedPasswordPolicy.ntransactionstatus !== transactionStatus.RETIRED && masterData.SelectedPasswordPolicy.ntransactionstatus !== transactionStatus.APPROVED)) {
            let selectedRecord = {};
            let urlArray = [];
            if (operation === "update") {
                const policyById = rsapi().post("passwordpolicy/getActivePasswordPolicyById", { [primaryKeyName]: primaryKeyValue, "userinfo": userInfo });

                urlArray = [policyById];
                dispatch(initRequest(true));
                Axios.all(urlArray)
                    .then(response => {
                        selectedRecord = response[0].data;
                       dispatch({
                            type: DEFAULT_RETURN, payload: {

                                operation, screenName, selectedRecord, openModal: true,
                                ncontrolCode, loading: false
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
                            toast.error(intl.formatMessage({ id: error.message }));
                        }
                        else {

                            toast.warn(intl.formatMessage({ id: error.response.data }));
                        }
                    })
            }
            else {

                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        operation, screenName, selectedRecord, openModal: true,
                        ncontrolCode
                    }
                });
            }


        }
        else {

            //toast.warn(intl.formatMessage({ id: masterData.SelectedPasswordPolicy.stransstatus }));
            //toast.warn(intl.formatMessage({ id: masterData.SelectedPasswordPolicy.stransstatus }));
           // let message = "IDS_SELECTDRAFTRECORDTOEDIT";
            // if (masterData.SelectedPasswordPolicy.ntransactionstatus === transactionStatus.APPROVED) {
            //     message = "IDS_CANNOTEDITAPPROVEPOLICY";
            // }

            // toast.warn(intl.FormattedMessage({
            //     id: "IDS_PLSSELECTASAMPLE"
            // }));

            // toast.warn(intl.formatMessage({
            //     id: "IDS_SELECTPRODUCT"
            // }));
            toast.warn(intl.formatMessage({ id: "IDS_SELECTDRAFTRECORDTOEDITS" }));

        }
    }
    else{
        //  let message = "";
            toast.warn(intl.formatMessage({ id: "IDS_SELECTUSERROLEFROMFILTER" }));
    } 
    }
}

export function getCopyUseRolePolicy(screenName, operation, ncontrolCode) {
    return function (dispatch) {
        let selectedRecord = {};

        dispatch({
            type: DEFAULT_RETURN, payload: {
                operation, screenName, openModal: true,selectedRecord,
                ncontrolCode
            }
        });
    }

}

export function comboChangeUserRolePolicy(userrolecode, data, userInfo) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("/passwordpolicy/getPasswordPolicyByUserRoleCode", { nuserrolecode: userrolecode, "userinfo": userInfo })
            .then(response => {

                const masterData = { ...data, ...response.data, searchedData: undefined }

                sortData(masterData);

                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData, loading: false
                    }
                });
            })
            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } });
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
            });
    }
}

// export function filterColumnDataPasswordPolicy(filterValue, masterData, userInfo) {
//     return function (dispatch) {

//         let policyCode = 0;
//         let searchedData = undefined;
//         if (filterValue === "") {
//             policyCode = masterData["PasswordPolicy"][0].npolicycode;
//         }
//         else {

//             searchedData = searchData(filterValue, masterData["PasswordPolicy"], "spolicyname");

//             if (searchedData.length > 0) {
//                 policyCode = searchedData[0].npolicycode;
//             }
//             else {
//                 masterData["PasswordPolicy"] = [];
//                 masterData["UserRole"] = [];
//                 masterData["SelectedPasswordPolicy"] = [];
//                 masterData["searchedData"] = [];
//                 dispatch({ type: DEFAULT_RETURN, payload: { masterData } });
//             }

//         }
//         dispatch(initRequest(true));
//         return rsapi().post("passwordpolicy/getPasswordPolicy", { npolicycode: policyCode, userinfo: userInfo })
//             .then(response => {
//                 masterData["PasswordPolicy"] = response.data["PasswordPolicy"];
//                 masterData["UserRole"] = response.data["UserRole"];
//                 masterData["SelectedPasswordPolicy"] = response.data["SelectedPasswordPolicy"];
//                 masterData["searchedData"] = searchedData;

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
//                     toast.error(error.message);
//                 }
//                 else {
//                     toast.warn(error.response.data);
//                 }
//             })


//     }
// }