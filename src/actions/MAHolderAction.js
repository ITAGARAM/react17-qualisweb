import rsapi from '../rsapi';
import { DEFAULT_RETURN, UN_AUTHORIZED_ACCESS } from './LoginTypes';
import { sortData } from '../components/CommonScript'//, getComboLabelValue, searchData
import { toast } from 'react-toastify';
import Axios from 'axios';
import { initRequest } from './LoginAction';
import { intl } from '../components/App';
import { transactionStatus } from '../components/Enumeration';

export function getMAHolderDetail(maHolder, userInfo, masterData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("marketauthorisationholder/getMarketAuthorisationHolder", {
            nmahcode: maHolder.nmahcode,
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

                    toast.warn(intl.formatMessage({ id: error.response }));
                }

            })
    }
}

export function getMAHolderComboService(screenName, operation, primaryKeyName, primaryKeyValue, masterData, userInfo, ncontrolCode) {
    return function (dispatch) {

        if (operation === "create" || (operation === "update" && masterData.SelectedMAHolder.ntransactionstatus !== transactionStatus.RETIRED)) {



            const countryService = rsapi().post("country/getCountry", { userinfo: userInfo });


            let urlArray = [];
            if (operation === "create") {

                urlArray = [countryService];
            }
            else {
                const holderById = rsapi().post("marketauthorisationholder/getActiveMarketAuthorisationHolderById", { [primaryKeyName]: primaryKeyValue, "userinfo": userInfo });

                urlArray = [countryService, holderById];
            }
            dispatch(initRequest(true));
            Axios.all(urlArray)
                .then(response => {


                    let country = [];

                    let selectedRecord = {};

                    if (operation === "update") {
                        selectedRecord = response[1].data;

                        country.push({ "value": response[1].data["ncountrycode"], "label": response[1].data["scountryname"] });


                        selectedRecord["ncountrycode"] = country[0];


                    }
                    else {
                        selectedRecord["ntransactionstatus"] = 1;


                    }


                    dispatch({
                        type: DEFAULT_RETURN, payload: {
                            countryList: response[0].data || [],

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
            //toast.warn(this.props.formatMessage({ id: masterData.SelectedMAHolder.stranstatus }));
            toast.warn(intl.formatMessage({ id: masterData.SelectedMAHolder.stranstatus }));
        }
    }
}


export function getMAHContactComboDataService(inputparam) {
    return function (dispatch) {
        if (inputparam.masterData.SelectedMAHolder.ntransactionstatus !== transactionStatus.RETIRED) {

            const contactData = {
                "nmahcontactcode": inputparam.primaryKeyValue, nmahcode: inputparam.masterData.SelectedMAHolder.nmahcode,
                "userinfo": inputparam.userInfo

            };
            const contactService = rsapi().post("marketauthorisationholdercontact/getMarketAuthorisationHolderContact", contactData);

            let urlArray = [];
            let selectedId = null;
            if (inputparam.operation === "create") {
                urlArray = [contactService];
            }
            else {
                const contactById = rsapi().post("marketauthorisationholdercontact/getActiveMarketAuthorisationHolderContactById", { [inputparam.primaryKeyField]: inputparam.primaryKeyValue, "userinfo": inputparam.userInfo });
                urlArray = [contactService, contactById];
                selectedId = inputparam.primaryKeyValue;
            }
            dispatch(initRequest(true));
            Axios.all(urlArray)
                .then(response => {

                    //let role = [];
                    let selectedRecord = {};
                    if (inputparam.operation === "update") {
                        selectedRecord = response[1].data;


                        selectedRecord["nmahcontactcode"] = response[1].data["nmahcontactcode"];

                    } else {
                        selectedRecord["sphoneno"] = "";
                        selectedRecord["smobileno"] = "";
                        selectedRecord["sfaxno"] = "";
                    }

                    dispatch({
                        type: DEFAULT_RETURN, payload: {

                            selectedRecord, openChildModal: true,
                            operation: inputparam.operation, screenName: inputparam.screenName,
                            ncontrolCode: inputparam.ncontrolCode, loading: false, selectedId
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
            //toast.warn(this.props.formatMessage({ id: inputparam.masterData.SelectedMAHolder.stranstatus }));
            toast.warn(intl.formatMessage({ id: inputparam.masterData.SelectedMAHolder.stranstatus }));
        }
    }
}

// export function filterColumnDataMAHolder(filterValue, masterData, userInfo) {
//     return function (dispatch) {

//         let mahCode = 0;
//         let searchedData = undefined;
//         if (filterValue === "") {
//             mahCode = masterData["MAHolder"][0].nmahcode;
//         }
//         else {

//             searchedData = searchData(filterValue, masterData["MAHolder"], "smahname");

//             if (searchedData.length > 0) {
//                 mahCode = searchedData[0].nmahcode;
//             }
//             else {
//                 masterData["MAHolder"] = [];
//                 masterData["MAHContact"] = [];
//                 masterData["SelectedMAHolder"] = [];

//                 masterData["searchedData"] = [];
//                 dispatch({ type: DEFAULT_RETURN, payload: { masterData } });
//             }

//         }
//         dispatch(initRequest(true));
//         return rsapi().post("marketauthorisationholder/getMarketAuthorisationHolder", { nmahcode: mahCode, userinfo: userInfo })
//             .then(response => {
//                 masterData["MAHolder"] = response.data["MAHolder"];
//                 masterData["MAHContact"] = response.data["MAHContact"];
//                 masterData["SelectedMAHolder"] = response.data["SelectedMAHolder"];

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