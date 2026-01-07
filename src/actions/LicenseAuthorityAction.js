import rsapi from '../rsapi';
import { DEFAULT_RETURN, UN_AUTHORIZED_ACCESS } from './LoginTypes';
import { toast } from 'react-toastify';
import Axios from 'axios';
import { initRequest } from './LoginAction';
import { constructOptionList } from '../components/CommonScript';
import { intl } from '../components/App';

export function openLicenseAuthorityModal(userInfo, ncontrolcode) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post('country/getCountry', { "userinfo": userInfo })
            .then(response => {
                const countryOptionsMap = constructOptionList(response.data || [], "ncountrycode", "scountryname", undefined, undefined, true);
                const countryOptions = countryOptionsMap.get("OptionList");
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        selectedRecord: {},
                        operation: "create",
                        countryOptions,
                        openModal: true,
                        ncontrolcode,
                        loading: false
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
};

export function fetchLicenseAuthorityById(editParam) {
    return function (dispatch) {
        const URL1 = rsapi().post('country/getCountry', { "userinfo": editParam.userInfo })
        const URL2 = rsapi().post("licenseauthority/getActiveLicenseAuthorityById", { [editParam.primaryKeyField]: editParam.primaryKeyValue, "userinfo": editParam.userInfo })
        dispatch(initRequest(true));
        Axios.all([URL1, URL2])
            .then(response => {
                let selectedId = editParam.primaryKeyValue
                let selectedRecord = response[1].data;
                const countryOptionsMap = constructOptionList(response[0].data || [], "ncountrycode", "scountryname", undefined, undefined, true);
                const countryOptions = countryOptionsMap.get("OptionList");
                selectedRecord['countryValue'] = { value: response[1].data.ncountrycode, label: response[1].data.scountryname }
                selectedRecord['countryShortName'] = response[1].data.scountryshortname
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        selectedRecord,
                        operation: "update",
                        countryOptions ,
                        screenName: editParam.screenName,
                        inputparam: editParam.inputparam,
                        ncontrolcode: editParam.ncontrolCode,
                        openModal: true,
                        loading: false,
                        selectedId
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