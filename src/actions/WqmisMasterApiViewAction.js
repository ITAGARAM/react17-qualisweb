import rsapi from '../rsapi';
import { DEFAULT_RETURN, UN_AUTHORIZED_ACCESS } from './LoginTypes';
import { toast } from 'react-toastify';
import { initRequest } from './LoginAction';
import { callService } from './ServiceAction';
import { intl } from '../components/App';

export function syncWqmisMasterApiView(syncParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        const baseURL = "wqmismasterapiview"
        rsapi().post(baseURL + "/" + syncParam.editRow.smethodurl, {
            stokenid: syncParam.editRow.stokenid, surl: syncParam.editRow.surl,
            userinfo: syncParam.userInfo, sprimarykey: syncParam.editRow.nwqmisapicode
        })
            .then(response => {
                if (response.status === 200 ) {
                    response.data=="IDS_DATASYNCFROMSERVER"? toast.success(intl.formatMessage({ id: response.data })):
                             toast.info(intl.formatMessage({ id: response.data }))
                } else if(response.status === 204){
                    toast.info(intl.formatMessage({ id: "IDS_NODATATOSYNCFROMSERVER" }));
                }
                else {
                    toast.info(intl.formatMessage({ id: response.data }));
                }
                dispatch(callService(syncParam.inputParam));
            })
            .catch(error => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false
                    }
                })
                if (error.response?.status === 429) {
                    toast.warn(intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
                    dispatch({ type: DEFAULT_RETURN, payload: { loading: false } });
                } else if (error.response?.status === 401 || error.response?.status === 403) {
                    dispatch({
                        type: UN_AUTHORIZED_ACCESS,
                        payload: {
                            navigation: 'forbiddenaccess',
                           // loading: false,
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