import rsapi from '../rsapi';
import { DEFAULT_RETURN, UN_AUTHORIZED_ACCESS } from './LoginTypes';
import { rearrangeDateFormat, constructOptionList } from '../components/CommonScript'
import { toast } from 'react-toastify';
import Axios from 'axios';
import { initRequest } from './LoginAction';
import { intl } from '../components/App';

export function getEmployeeAttendence(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("employeeattendence/getEmployeeAttendence", inputParam.inputData)
            .then(response => {
                let masterData = { ...inputParam.masterData, ...response.data }
                let selectedId = null;
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData, loading: false, selectedId
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

export function getComboEmployeeAttendence(addParam) {
    return function (dispatch) {

        let urlArray = [];
        const service1 = rsapi().post("timezone/getLocalTimeByZone", {
            userinfo: addParam.userInfo
        });

        const employee = rsapi().post("employeeattendence/getEmpByEmployeeType", {
            nemptypecode: addParam.selectedRecord["nemptypecode"].value,
            userinfo: addParam.userInfo
        });

        urlArray = [service1, employee]

        dispatch(initRequest(true));

        Axios.all(urlArray).then(response => {


            let selectedId = null;

            let date = rearrangeDateFormat(addParam.userInfo, response[0].data?.date);

            const employeeMap = constructOptionList(response[1].data || [], "nusercode",
                "susername", undefined, undefined, false);

            const employeeList = employeeMap.get("OptionList");

            let selectedRecord = { ...addParam.selectedRecord, "dattendencedate": date, "employeeList": employeeList }

            let masterData = { ...addParam.masterData }

            selectedId = addParam.primaryKeyField;
            dispatch({
                type: DEFAULT_RETURN, payload: {
                    employeeList: employeeList || [],
                    operation: addParam.operation, screenName: addParam.screenName,
                    selectedRecord: selectedRecord,
                    masterData,
                    openModal: true,
                    ncontrolcode: addParam.ncontrolCode,
                    loading: false, selectedId
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


export function saveEmployeeAttendence(inputParam, masterData) {
    return function (dispatch) {

        dispatch(initRequest(true));

        let urlArray = [];
        const service1 = rsapi().post("employeeattendence/" + inputParam.operation + "EmployeeAttendence", inputParam.inputData);
        const service2 = rsapi().post("timezone/getLocalTimeByZone", {
            userinfo: inputParam.inputData.userinfo
        });

        urlArray = [service1, service2]

        Axios.all(urlArray).then(response => {
            let openModal = false;
            if (inputParam.saveType === 2) {
                openModal = true;
            }
            let date = rearrangeDateFormat(inputParam.inputData.userinfo, response[0].data.attendenceDate);
            masterData = {
                ...masterData,
                EmployeeAttendence: response[0].data.EmployeeAttendence
            }
            let selectedRecord = { ...inputParam.selectedRecord, "nusercode": "", "nispresent": "", "sremarks": "", "dentrydatetime": "", "dexitdatetime": "", "attendenceDate": date }

            dispatch({
                type: DEFAULT_RETURN, payload: {
                    masterData,
                    selectedRecord,
                    openModal: openModal,
                    loading: false,
                    loadEsign: false
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


export function getActiveEmployeeAttendenceById(editParam) {
    return function (dispatch) {

        let selectedId = null;
        dispatch(initRequest(true));

        rsapi().post("employeeattendence/getActiveEmployeeAttendenceById", { [editParam.primaryKeyField]: editParam.editRow.nempattendencecode, "nemptypecode": editParam.editRow.nemptypecode, "userinfo": editParam.userInfo })
            .then(response => {
                selectedId = editParam.editRow.nempattendencecode;
                let instname = [];
                instname.push({
                    "value": response.data.activeEmployeeAttendenceById["nusercode"],
                    "label": response.data.activeEmployeeAttendenceById["susername"]
                });
                let date = rearrangeDateFormat(editParam.userInfo, response.data.activeEmployeeAttendenceById['sattendencedate']);
                let date1 = response.data.activeEmployeeAttendenceById['sentrydatetime'] ? rearrangeDateFormat(editParam.userInfo, response.data.activeEmployeeAttendenceById['sentrydatetime']) : undefined;
                let date2 = response.data.activeEmployeeAttendenceById['sexitdatetime'] ? rearrangeDateFormat(editParam.userInfo, response.data.activeEmployeeAttendenceById['sexitdatetime']) : undefined;
                let masterData = { ...editParam.masterData }
                let selectedRecord = {
                    ...editParam.selectedRecord, "dentrydatetime": date1, "nispresent": response.data.activeEmployeeAttendenceById['nispresent'],
                    "dexitdatetime": date2, "dattendencedate": date, "sremarks": response.data.activeEmployeeAttendenceById['sremarks']
                }
                selectedRecord["nusercode"] = instname[0];
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData,
                        selectedRecord,
                        operation: editParam.operation,
                        ncontrolcode: editParam.ncontrolCode,
                        openModal: true,
                        loading: false,
                        selectedId,
                        dataState: editParam.dataState,
                        screenName: editParam.screenName
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

