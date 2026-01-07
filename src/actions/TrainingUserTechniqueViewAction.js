import { toast } from "react-toastify";
import { intl } from "../components/App";
import { constructOptionList,sortData } from "../components/CommonScript";
import rsapi from "../rsapi";
import { initRequest } from "./LoginAction";
import { DEFAULT_RETURN, UN_AUTHORIZED_ACCESS } from "./LoginTypes";

export function getUserTechniqueViewDetail(inputData, userInfo,masterData) {
    return function (dispatch) {

        dispatch(initRequest(true));
        return rsapi().post("usertechniqueview/getUserTechniqueViewDetails", {
            "userinfo": userInfo,"ntrainingcode": inputData.ntrainingcode,
            "nparticipantcode":inputData.nparticipantcode

        })
            .then(response => {

                masterData = { ...masterData, ...response.data };

                sortData(masterData);
                dispatch({ type: DEFAULT_RETURN, payload: { masterData, loading: false } });
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

    }
}

export const changeUserTechniqueViewFilter = (inputParam, filterTechnique,filterUsers) => {
    return (dispatch) => {
        dispatch(initRequest(true));
        rsapi().post("/usertechniqueview/get" + inputParam.methodUrl, inputParam.inputData)
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
                            filterUsers

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


export function getUserTechniqueViewFilterChange(ntechniquecode, data, userInfo) {
    return function (dispatch) { dispatch(initRequest(true));
     rsapi().post("usertechniqueview/getUserForUserTechniqueView1", { ntechniquecode, "userinfo": userInfo })
     .then(response => {
    const masterData = { ...data, ...response.data, searchedData: undefined }
     dispatch({ type: DEFAULT_RETURN, payload: {
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
        } else if (error.response.status === 500){
            toast.error(error.message);
        } else{               
            toast.warn(error.response.data);
        }  
     });
     }}
    

