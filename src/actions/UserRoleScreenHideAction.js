
import rsapi from '../rsapi';
import { DEFAULT_RETURN, REQUEST_FAILURE, UN_AUTHORIZED_ACCESS } from './LoginTypes';
import { sortData, searchData, constructOptionList, fillRecordBasedOnCheckBoxSelection } from '../components/CommonScript'//getComboLabelValue,, searchData
import { toast } from 'react-toastify';
import Axios from 'axios';
import { initRequest } from './LoginAction';
import { intl } from '../components/App';
export function initialcombochangeget(nuserrolecode,data,userInfo) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("/userscreenhide/getUserScreenhidecomboo", { nuserrolecode,"userinfo": userInfo})
            .then(response => {
                const masterData = {...data,...response.data ,searchedData: undefined}
                sortData(masterData);
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData,loading:false
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
                } else if (error.response.status===500){
                    toast.error(intl.formatMessage({id:error.message}));
                } else{
                      toast.warn(intl.formatMessage({id:error.response.data}));
                }
            });
    }
}
export function getUserScreenhideComboService(screenName, operation, userInfo, selectedcombo,selectedcombouser, ncontrolCode) {
    return function (dispatch) {
        if (operation === "create") {
            let urlArray = [];
            let AvaliableScreen = [];
            const ScreenRightsAvaliablescreen = rsapi().post("userscreenhide/getAvailableUserScreenhide",
             { "nuserrolecode": selectedcombo["nuserrolecode"] ?
              selectedcombo["nuserrolecode"].value : null, "nusercode": selectedcombouser["nusercode"] ?
              selectedcombouser["nusercode"].value : null, "userinfo": userInfo });
            urlArray = [ScreenRightsAvaliablescreen];
            dispatch(initRequest(true));
            Axios.all(urlArray)
                .then(response => {
                    // selectedRecord = response[0].data;
                    AvaliableScreen = response[0].data;
                    dispatch({
                        type: DEFAULT_RETURN, payload: {
                            operation, screenName, AvaliableScreen, openModal: true, selectedcombo,
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
                    } else {
                        toast.warn(intl.formatMessage({ id: error.response.data }));
                    }
                })
        }

    }
}

export function comboChangeUserRoleScreenRightsHide(selectedcombo,selectedcombouser, data, userInfo) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("/userscreenhide/createUserScreenhide", { nuserrolecode: selectedcombo['nuserrolecode'].value,nusercode: selectedcombouser["nusercode"].value, "userinfo": userInfo })
            .then(response => {
                const masterData = { ...data, ...response.data ,searchedData: undefined}
                sortData(masterData);
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData, loading: false,skip:0,take:20
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
                } else {
                    toast.warn(intl.formatMessage({ id: error.response.data }));
                }
            });
    }
}

export function getUserScreenhideDetail(inputData, isServiceRequired) {
    return function (dispatch) {
        //console.log("inputData:", inputData, isServiceRequired);
        if (isServiceRequired) {
            dispatch(initRequest(true));
          //  console.log('rrfggg',inputData)
            return rsapi().post("userscreenhide/getSingleSelectUserScreenhide", {
                "screenrights": inputData.SelectedScreenRights,
              "SelectedUserName":inputData.masterData.SelectedUserName.nusercode,
                "userinfo": inputData.userinfo,
                "nuserrolescreencode":inputData.nusersrolehidescreencode
            })
                .then(response => {
                    let dataState = inputData.dataState
                    if (response.data.ControlRights.length < dataState.skip) {
                        dataState['skip']=0
                    }
                    let masterData = inputData.masterData;
                   // sortData(masterData);
                    let controlRights = [];
                  
                    controlRights.push(...response.data.ControlRights);
                    sortData(controlRights);
                    // if ( inputData["checkBoxOperation"] === 1 || inputData["checkBoxOperation"] === 6){
                    //     controlRights.push(...masterData["ControlRights"]);
                    // }
                    masterData["ControlRights"] = controlRights;
                    masterData["SelectedScreenRights"] = inputData.SelectedScreenRights;
                    //sortData(masterData);
                    dispatch({ type: DEFAULT_RETURN, payload: { masterData, loading: false, dataState,skip:inputData.skip,take:inputData.take } });
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
                        toast.error(intl.formatMessage({ id: error.message }));
                    }
                    else {
                        toast.warn(intl.formatMessage({ id: error.response }));
                    }
                })
        } else {

            fillRecordBasedOnCheckBoxSelection(inputData.masterData, inputData.SelectedScreenRights, inputData.childTabsKey, inputData.checkBoxOperation, "nformcode",inputData.removeElementFromArray);
            let masterData={...inputData.masterData,SelectedScreenRights:inputData.SelectedScreenRights}
            dispatch({ type: DEFAULT_RETURN, payload: { masterData, loading: false, dataState: undefined } });
        }

    }
}

export function ListSwitchUpdate(inputParam,data, userInfo) {
    return function (dispatch) {
        dispatch(initRequest(true));
        let Avaliabledate = [];
        rsapi().post("/userscreenhide/updateListControlRights", {"needrights":inputParam.needrights,
        "nusersrolehidescreencode":inputParam.nusersrolehidescreencode,'nuserrolecode': inputParam.nuserrolecode,
        "nusercode": inputParam.nusercodemain,"userinfo": userInfo,"SelectedScreenRights":data.SelectedScreenRights  })
            .then(response => {
             //   let masterData = inputData.masterData;
             const masterData = { ...data, ...response.data ,searchedData: undefined}
            
             sortData(masterData);
               // sortData(masterData);
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData, loading: false
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
                } else {
                    toast.warn(intl.formatMessage({ id: error.response.data }));
                }
            });
    }
}