import { toast } from "react-toastify";
import { intl } from "../components/App";
import rsapi from "../rsapi";
import { initRequest } from './LoginAction';
import { DEFAULT_RETURN, UN_AUTHORIZED_ACCESS } from "./LoginTypes";


export function getCerHisDetail(CerGen, fromDate, toDate,userInfo, masterData){
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("certificatehistory/getCertificateHistory", {
            "ncertificateversionhistorycode": CerGen["ncertificateversionhistorycode"],
            "userinfo": userInfo
        })
            .then(response => {
                masterData = { ...masterData, ...response.data };
              //  sortData(masterData);
                dispatch({ type: DEFAULT_RETURN, payload: { masterData, loading: false ,dataState:undefined} });
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




 