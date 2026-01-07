import rsapi from '../rsapi';
import { DEFAULT_RETURN, REQUEST_FAILURE } from './LoginTypes';
import { sortData, searchData, constructOptionList, fillRecordBasedOnCheckBoxSelection } from '../components/CommonScript'//getComboLabelValue,, searchData
import { toast } from 'react-toastify';
import Axios from 'axios';
import { initRequest } from './LoginAction';
import { intl } from '../components/App';


export function invoicecomboChangeUserRoleScreenRights(selectedcombo, data, userInfo) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("/invoicepreferencesetting/getpreferenceByUserRoleCode", { nuserrolecode: selectedcombo['nuserrolecode'].value, "userinfo": userInfo })
            .then(response => {
                const masterData = { ...data, ...response.data, searchedData: undefined }
                sortData(masterData);
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData, loading: false, skip: 0, take: 10
                    }
                });
            })
            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                toast.error(intl.formatMessage({ id: error.message }));
            });
    }
}

export function invoicegetPreferenceSettingsComboService(screenName, operation, userInfo, selectedcombo, nfieldcode) {
    return function (dispatch) {
        if (operation === "create") {
            let urlArray = [];
            let AvaliableScreen = [];
            const ScreenRightsAvaliablescreen = rsapi().post("invoicepreferencesetting/getAvailableScreen", { "nuserrolecode": selectedcombo["nuserrolecode"] ? selectedcombo["nuserrolecode"].value : null, "userinfo": userInfo });
            urlArray = [ScreenRightsAvaliablescreen];
            dispatch(initRequest(true));
            Axios.all(urlArray)
                .then(response => {
                    AvaliableScreen = response[0].data;
                    dispatch({
                        type: DEFAULT_RETURN, payload: {
                            operation, screenName, AvaliableScreen, openModal: true, selectedcombo,
                            nfieldcode, loading: false
                        }
                    });
                })
                .catch(error => {
                    dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                    if (error.response.status === 500) {
                        toast.error(intl.formatMessage({ id: error.message }));
                    }
                    else {
                        toast.warn(intl.formatMessage({ id: error.response.data }));
                    }
                })
        }

    }
}
export function invoicegetPreferenceSettingsDetail(inputData, isServiceRequired) {
    return function (dispatch) {
        if (isServiceRequired) {
            dispatch(initRequest(true));
            return rsapi().post("invoicepreferencesetting/getSingleSelectScreenRights", {
                "screenrights": inputData.SelectedScreenRights,
                "userinfo": inputData.userinfo,
                "nuserrolecode": inputData.masterData.SelectedUserRole.nuserrolecode

            })
                .then(response => {
                    let dataState = inputData.dataState
                    if (response.data.ControlRights.length < dataState.skip) {
                        dataState['skip'] = 0
                    }
                    const masterData = { ...inputData.masterData, ...response.data, SelectedScreenRights: inputData.SelectedScreenRights };
                    sortData(masterData);
                    dispatch({ type: DEFAULT_RETURN, payload: { masterData, loading: false, dataState, skip: inputData.skip, take: inputData.take } });
                }).catch(error => {
                    dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                    if (error.response.status === 500) {
                        toast.error(intl.formatMessage({ id: error.message }));
                    }
                    else {
                        toast.warn(intl.formatMessage({ id: error.response.data }));
                    }
                })
        } else {

            fillRecordBasedOnCheckBoxSelection(inputData.masterData, inputData.SelectedScreenRights, inputData.childTabsKey, inputData.checkBoxOperation, "nuserrolefieldcode", inputData.removeElementFromArray);
            let masterData = { ...inputData.masterData, SelectedScreenRights: inputData.SelectedScreenRights }
            dispatch({ type: DEFAULT_RETURN, payload: { masterData, loading: false, dataState: undefined } });
        }

    }
}
export function invoicecomboChangeUserRoleScreenRightshandleClickDelete(SelectedScreenRights, userInfo, masterData, selectedcombo) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("screenrights/deleteScreenRights", {
            "screenrights": SelectedScreenRights,
            "userinfo": userInfo, "nuserrolecode": selectedcombo["nuserrolecode"].value
        })
            .then(response => {
                masterData = { ...masterData, ...response.data };

                const dataState = { skip: 0, take: 10 }
                sortData(masterData);
                dispatch({ type: DEFAULT_RETURN, payload: { masterData, loading: false, dataState, skip: undefined, take: undefined } });
            })
            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                if (error.response.status === 500) {
                    toast.error(intl.formatMessage({ id: error.message }));
                }
                else {
                    toast.warn(intl.formatMessage({ id: error.response }));
                }
            })
    }
}

export function invoicecomboChangeUserRoleScreenRightsfilterColumnData(filterValue, filterParam) {
    return function (dispatch) {
        let masterData = filterParam.masterData;
        let primaryKeyValue = 0;
        let searchedData = undefined;
        if (filterValue === "") {
            if (masterData[filterParam.inputListName] && masterData[filterParam.inputListName].length > 0) {
                primaryKeyValue = masterData[filterParam.inputListName][0][filterParam.primaryKeyField];
            }
        }
        else {
            searchedData = searchData(filterValue, masterData[filterParam.inputListName]);

            if (searchedData.length > 0) {
                primaryKeyValue = searchedData[0][filterParam.primaryKeyField];
            }
        }
        if (primaryKeyValue !== 0) {
            masterData["searchedData"] = searchedData;
            dispatch(initRequest(true));
            return rsapi().post(filterParam.fetchUrl, { ...filterParam.fecthInputObject, [filterParam.primaryKeyField]: primaryKeyValue })
                .then(response => {
                    masterData = { ...masterData, ...response.data };
                    sortData(masterData);
                    dispatch({ type: DEFAULT_RETURN, payload: { masterData, loading: false } });
                })
                .catch(error => {
                    dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                    if (error.response.status === 500) {
                        toast.error(intl.formatMessage({ id: error.message }));
                    }
                    else {
                        toast.warn(intl.formatMessage({ id: error.response.data }));
                    }
                })
        }
        else {
            masterData[filterParam.selectedObject] = undefined;
            masterData["searchedData"] = [];
            Object.keys(masterData).forEach(item => {
                if (item !== filterParam.inputListName && item !== filterParam.selectedObject
                    && filterParam.unchangeList && filterParam.unchangeList.indexOf(item) === -1)
                    masterData[item] = [];
            })
            dispatch({
                type: DEFAULT_RETURN, payload: {
                    masterData, operation: null, modalName: undefined,
                    loading: false
                }
            });
        }
    }
}

export function invoicegetCopyUseRoleScreenRights(screenName, operation, nfieldcode, selectedcombo, userInfo, masterData, saveType) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("screenrights/getUserRole", {
            "userinfo": userInfo, "nuserrolecode": selectedcombo["nuserrolecode"].value
        })
            .then(response => {
                const roleMap = constructOptionList(response.data["Userrole"] || [], "nuserrolecode", "suserrolename", false, false, true);
                masterData = { ...masterData, Userrole: roleMap.get("OptionList") };
                sortData(masterData);
                dispatch({ type: DEFAULT_RETURN, payload: { masterData, loading: false, screenName, operation, openModal: true, nfieldcode, saveType: saveType, skip: undefined, take: undefined } });
            })
            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                if (error.response.status === 500) {
                    toast.error(intl.formatMessage({ id: error.message }));
                }
                else {
                    toast.warn(intl.formatMessage({ id: error.response }));
                }

            })
    }

}

export function invoicecopyScreenRights(userrolecode, nuserrolecode, userInfo, masterData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("screenrights/copyScreenRights", {
            "userrolecode": userrolecode,
            "nuserrolecode": nuserrolecode,
            "userinfo": userInfo
        })
            .then(response => {
                masterData = { ...masterData, ...response.data };
                sortData(masterData);
                dispatch({ type: DEFAULT_RETURN, payload: { masterData, loading: false, loadEsign: false, openModal: false, skip: undefined, take: undefined } });
            })
            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false, openModal: false, } })
                if (error.response.status === 500) {
                    toast.error(intl.formatMessage({ id: error.message }));
                }
                else {
                    toast.warn(intl.formatMessage({ id: error.response }));
                }

            })
    }
}
export function invoicecheckUserRoleScreenRights(nuserrolecode, data, userInfo, selectedRecord) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("/screenrights/getCopyUserRoleCode", { nuserrolecode: nuserrolecode, "userinfo": userInfo })
            .then(response => {
                const masterData = { ...data, ...response.data }
                sortData(masterData);
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData, loading: false, openModal: true, loadEsign: false, selectedRecord, skip: undefined, take: undefined
                    }
                });
            })
            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                toast.error(intl.formatMessage({ id: error.message }));
            });
    }
}

export const reloaddata = (inputParam) => {
    return (dispatch) => {
        dispatch(initRequest(true));
        return rsapi().post("/invoicepreferencesetting/getInvoicePreferenceSetting", { nuserrolecode: inputParam.nuserrolecode.nuserrolecode, "userinfo": inputParam.inputData.userinfo })
            .then(response => {

                let data = response.data;
                let masterData = { ...inputParam.masterData, ...data }
                sortData(masterData);

                let selectedcombo = {};
                selectedcombo["nuserrolecode"] = { value: inputParam.nuserrolecode.nuserrolecode, label: inputParam.nuserrolecode.suserrolename }

                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        selectedcombo,
                        comboitem: inputParam.comboitem,
                        masterData: masterData,
                        activeTestTab: data.activeTestTab,
                        inputParam: inputParam,
                        masterStatus: "",
                        userInfo: inputParam.inputData.userinfo,
                        loading: false, selectedId: null, selectedRecord: {},
                        dataState: undefined,
                        organisation: {
                            selectedNode: data.SelectedNode, selectedNodeName: data.SelectedNodeName,
                            primaryKeyValue: data.AddedChildPrimaryKey
                        },
                        displayName: inputParam.displayName,
                        reportFilePath: undefined, skip: 0, take: 10
                    }
                })
            })
            .catch(error => {
                if (error.response === undefined && error === "Network Error") {
                    dispatch({
                        type: REQUEST_FAILURE,
                        payload: {
                            error: "Network Error",
                            loading: false,
                        }
                    });
                }
            })
    };
};
