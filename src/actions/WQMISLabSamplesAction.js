import rsapi from '../rsapi';
import {DEFAULT_RETURN,UN_AUTHORIZED_ACCESS} from './LoginTypes';
import { toast } from 'react-toastify';
import { initRequest } from './LoginAction';
import { intl } from '../components/App';
 
export function viewSampleParameterDetails(masterData, userInfo, viewWQMISSampleData, screenName) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("wqmislabsamples/getWQMISLabSamplesParametersDetails",
             { ntestid:viewWQMISSampleData.ntestid,ssampleid:viewWQMISSampleData.ssampleid,userinfo:userInfo})
            .then(response => {
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                       SampleParameterDetails:[...response.data.SampleParameterDetails],
                        masterData,
                        selectedId:viewWQMISSampleData.npkid,
                        screenName,
                        loading: false,
                        openModal:true,                       
                    }
                })
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
