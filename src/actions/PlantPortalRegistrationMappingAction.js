import rsapi from '../rsapi';
import { DEFAULT_RETURN, UN_AUTHORIZED_ACCESS } from './LoginTypes';
import { toast } from 'react-toastify';
import Axios from 'axios'
import { initRequest } from './LoginAction';
import { constructOptionList, getComboLabelValue } from '../components/CommonScript';
import { intl } from '../components/App';

export function getPortalRegistrationType(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post('plantportalregistrationmapping/getPortalRegistrationType', { "userinfo": inputParam.userInfo })
            .then(response => {
                let selectedRecord = {};
                let plantList = {};
                let portalRegistrationTypeList = {};
                let SelectedPortalRegistrationType = {};
                let masterData = {};
                const portalRegistrationType = constructOptionList(response.data.PortalRegistrationType || [], "nportalregtypecode",
                    "sportalregtypename", undefined, undefined, false);
                portalRegistrationTypeList = portalRegistrationType.get("OptionList");
                const plant = constructOptionList(response.data.PlantList || [], "ndeptcode",
                    "sdeptname", undefined, undefined, false);
                plantList = plant.get("OptionList");
                selectedRecord = {
                    nportalregtypecode: { 'label': response.data.SelectedPortalRegistrationType.sportalregtypename, 'value': response.data.SelectedPortalRegistrationType.nportalregtypecode }
                }
                SelectedPortalRegistrationType = response.data.SelectedPortalRegistrationType

                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        openModal: true,
                        selectedRecord,
                        operation: inputParam.operation,
                        ncontrolcode: inputParam.ncontrolCode, loading: false, portalRegistrationTypeList, plantList, SelectedPortalRegistrationType
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

export function getPlant(methodParam) {
    return function (dispatch) {
        let URL = [];
        URL = rsapi().post("/plantportalregistrationmapping/getPlant", { "userinfo": methodParam.inputData.userinfo, "nportalregtypecode": methodParam.inputData.nportalregtypecode })
        dispatch(initRequest(true));
        Axios.all([URL])
            .then(response => {
                let plantList = {};
                const plant = constructOptionList(response[0].data.PlantList || [], "ndeptcode",
                    "sdeptname", undefined, undefined, false);
                plantList = plant.get("OptionList");
                let selectedRecord = {
                    nportalregtypecode: methodParam.inputData.SelectedPortalRegistrationType,
                }
                dispatch({
                    type: DEFAULT_RETURN, payload:
                        { plantList, SelectedPortalRegistrationType: methodParam.inputData.SelectedPortalRegistrationType, selectedRecord, loading: false, data: undefined, dataState: undefined }
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

export function getActivePortalRegistrationType(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        let urlArray = [];
        const getPortalregType = rsapi().post('plantportalregistrationmapping/getPortalRegistrationTypeFromActiveID', { "plantportalregistrationmapping": { ...inputParam.editRow }, "userinfo": inputParam.userInfo })
        const getActiveValue = rsapi().post('plantportalregistrationmapping/getActivePlantPortalRegistrationMappingById', { "userinfo": inputParam.userInfo, nportalregmappingcode: inputParam.primaryKeyValue })
        urlArray = [getPortalregType, getActiveValue]

        Axios.all(urlArray)
            .then(response => {
                let selectedRecord = {};
                let plantList = {};
                let portalRegistrationTypeList = {};
                let SelectedPortalRegistrationType = {};
                const portalRegistrationType = constructOptionList(response[0].data.PortalRegistrationType || [], "nportalregtypecode",
                    "sportalregtypename", undefined, undefined, false);
                portalRegistrationTypeList = portalRegistrationType.get("OptionList");
                const plant = constructOptionList(response[0].data.PlantList || [], "ndeptcode",
                    "sdeptname", undefined, undefined, false);
                plantList = plant.get("OptionList");
                selectedRecord = {
                    nportalregtypecode: { 'label': response[1].data.sportalregtypename, 'value': response[1].data.nportalregtypecode },
                    ndeptcode: { 'label': response[1].data.sdeptname, 'value': response[1].data.ndeptcode }
                }
                SelectedPortalRegistrationType = response[1].data

                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        openModal: true,
                        selectedRecord,
                        operation: inputParam.operation,
                        ncontrolcode: inputParam.ncontrolCode, loading: false, portalRegistrationTypeList, plantList, SelectedPortalRegistrationType,
                        selectedId: inputParam.primaryKeyValue
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