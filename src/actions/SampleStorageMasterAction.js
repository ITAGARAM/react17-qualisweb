import rsapi from '../rsapi';
import { DEFAULT_RETURN, UN_AUTHORIZED_ACCESS } from './LoginTypes';
import { initRequest } from './LoginAction';
import { sortData, constructOptionList } from '../components/CommonScript';
import { toast } from 'react-toastify';
import { transactionStatus } from '../components/Enumeration';
import Axios from 'axios';
import { intl } from '../components/App';

export function getSampleMaster(selectedItem, userInfo, masterData, sampleLocation, sampleHierarchyIndex) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("/samplestoragemaster/getSampleMaster",
            { 'userinfo': userInfo, "sampleTrayCode": selectedItem.id })
            .then(response => {

                masterData = {
                    ...masterData, sampleStorageMaster: response.data["sampleStorageMaster"],
                    selectedSampleStorageMaster: response.data["selectedSampleStorageMaster"]
                };
                sortData(masterData);

                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData,
                        loading: false,
                        sampleTrayCode: selectedItem.id,
                        selectedItem,
                        sampleLocation,
                        sampleHierarchyIndex
                    }
                });
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
                            loading: false,
                            responseStatus: error.response.status
                        }
            
          });
        } else if (error.response.status === 500) {
                    toast.error(error.message);
                } else {
                    toast.warn(error.response.data);
                }
            });
    }
}
export function getSelectedApprovedStorageVersion(inputParam, userInfo, masterData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("/samplestoragelocation/getActiveSampleStorageVersion",
            { 'userinfo': userInfo, "nsamplestorageversioncode": parseInt(inputParam.nsamplestorageversioncode) })
            .then(response => {

                masterData = {
                    ...masterData, selectedSampleStorageVersion: response.data["selectedSampleStorageVersion"], storageContainer: undefined,
                    containers: undefined, sampleStorageMaster: undefined
                };
                // sortData(masterData);

                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData,
                        loading: false,
                        containerLocation: undefined,
                        activeTabIndex: undefined
                    }
                });
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
                            loading: false,
                            responseStatus: error.response.status
                        }
            
          });
        } else if (error.response.status === 500) {
                    toast.error(error.message);
                } else {
                    toast.warn(error.response.data);
                }
            });
    }
}

export function getSampleMasterDetails(masterData) {
    return function (dispatch) {
        dispatch({
            type: DEFAULT_RETURN,
            payload: {
                masterData,
            }
        });
    }
}
export function getselectedContainer(masterData) {
    return function (dispatch) {

        dispatch({
            type: DEFAULT_RETURN,
            payload: {
                masterData,
            }
        });
    }
}
export function getContainers(selectedItem, masterData, containers, locationText) {
    return function (dispatch) {

        masterData = {
            ...masterData, containers: containers, selectedContainer: containers.length > 0 ? [containers[0]] : []
        };

        dispatch({
            type: DEFAULT_RETURN,
            payload: {
                masterData,
                locationCode: selectedItem.id,
                selectedItem,
                locationText
            }
        });
    }
}
export function getContainerStorageCondition(selectedItem, userInfo, masterData, containerLocation) {
    return function (dispatch) {
        dispatch(initRequest(true));
        let operation = "";
        rsapi().post("/samplestoragemaster/getContainerStorageCondition",
            { 'userinfo': userInfo, "containerCode": selectedItem.id })
            .then(response => {

                if (response.data["storageContainer"] !== null) {
                    operation = "update";
                } else {
                    operation = "create";
                }
                masterData = {
                    ...masterData, storageContainer: response.data["storageContainer"]
                };
                // sortData(masterData);

                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData,
                        loading: false,
                        containerCode: selectedItem.id,
                        containerLocation,
                        operation,
                        selectedItem
                    }
                });
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
                            loading: false,
                            responseStatus: error.response.status
                        }
            
          });
        } else if (error.response.status === 500) {
                    toast.error(error.message);
                } else {
                    toast.warn(error.response.data);
                }
            });
    }
}

export function getStorageConditionFromMaster(userInfo, masterData, editContainerID) {
    return function (dispatch) {
        dispatch(initRequest(true));
        let selectedRecord = {};
        let urlArray = [];
        let operation = "";
        if (masterData["storageContainer"] && masterData["storageContainer"] !== null) {

            const geStorageCondition = rsapi().post("/storagecondition/getStorageCondition",
                { 'userinfo': userInfo })

            const getSampleStorageCondition = rsapi().post("/samplestoragemaster/getContainerStorageConditionByID",
                { 'userinfo': userInfo, "containerStorageCode": masterData["storageContainer"].ncontainerstoragecode });

            urlArray = [geStorageCondition, getSampleStorageCondition];
            operation = "update"
        } else {


            const geStorageCondition = rsapi().post("/storagecondition/getStorageCondition",
                { 'userinfo': userInfo })

            urlArray = [geStorageCondition];
            operation = "create"
        }
        Axios.all(urlArray)
            .then(response => {

                const conditionMap = constructOptionList(response[0].data, "nstorageconditioncode", "sstorageconditionname", false, false, true);
                const conditionMaster = conditionMap.get("OptionList");

                if (masterData["storageContainer"] && masterData["storageContainer"] !== null) {
                    conditionMaster.map(item => item.value === response[1].data["nstorageconditioncode"] ?
                        selectedRecord["nstorageconditioncode"] = {
                            "label": item.label,
                            "value": item.value,
                            "item": item
                        }
                        : "");

                    masterData = {
                        ...masterData, storageCondition: conditionMaster, storageContainer: response[1].data
                    };
                } else {

                    const defaultCondition = conditionMaster.filter(items => items.item.ndefaultstatus === transactionStatus.YES);
                    if (defaultCondition.length > 0) {
                        selectedRecord["nstorageconditioncode"] = {
                            "label": defaultCondition[0].label,
                            "value": defaultCondition[0].value,
                            "item": defaultCondition
                        }
                    }
                    masterData = {
                        ...masterData, storageCondition: conditionMaster
                    };
                }
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData,
                        loading: false,
                        selectedRecord,
                        openModal: true,
                        operation,
                        ncontrolcode: editContainerID
                    }
                });
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
                            loading: false,
                            responseStatus: error.response.status
                        }
            
          });
        } else if (error.response.status === 500) {
                    toast.error(error.message);
                } else {
                    toast.warn(error.response.data);
                }
            });
    }
}
export const changeStorageCategoryFilterOnSampleMaster = (inputParam, filterStorageCategory) => {
    return (dispatch) => {
        dispatch(initRequest(true));
        rsapi().post("/samplestoragemaster/getSampleStorageMasterByCategory", inputParam.inputData)
            .then(response => {
                const masterData = response.data
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false,
                        masterData: {
                            ...masterData,
                            filterStorageCategory,
                            nfilterStorageCategory: inputParam.inputData.nfilterStorageCategory.value,
                            storageContainer: undefined,
                            containers: undefined, sampleStorageMaster: undefined
                        },
                        containerLocation: undefined,
                        activeTabIndex: undefined
                    }
                });
            })
            .catch(error => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false
                    }
                });
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
                } else {
                    toast.warn(error.response.data);
                }
            });
    }
}

export function openSampleStorageApprovedLocation(userInfo, masterData, moveId) {
    return function (dispatch) {
        dispatch(initRequest(true));
        let selectedRecord = {};
        let urlArray = [];


        const geStorageCategory = rsapi().post("/storagecategory/getStorageCategory",
            { 'userinfo': userInfo })

        const getApprovedLocation = rsapi().post("/samplestoragemaster/getSampleStorageMasterByCategory",
            {
                'userinfo': userInfo, "nstoragecategorycode": masterData["selectedSampleStorageVersion"].nstoragecategorycode
            });

        urlArray = [geStorageCategory, getApprovedLocation];


        Axios.all(urlArray)
            .then(response => {

                const conditionMap = constructOptionList(response[0].data, "nstoragecategorycode", "sstoragecategoryname", false, false, true);
                const conditionMaster = conditionMap.get("OptionList");

                const locationMap = constructOptionList(response[1].data["approvedSampleStorageLocation"], "nsamplestoragelocationcode", "ssamplestoragelocationname", false, false, true);
                const locationMaster = locationMap.get("OptionList");


                conditionMaster.map(item => item.value === masterData["selectedSampleStorageVersion"].nstoragecategorycode ?
                    selectedRecord["nstoragecategorycode"] = {
                        "label": item.label,
                        "value": item.value,
                        "item": item.item
                    }
                    : "");

                let approvedTreeData = [];
                locationMaster.map(item => item.value === masterData["selectedSampleStorageVersion"].nsamplestoragelocationcode ?
                    selectedRecord["nsamplestoragelocationcode"] = {
                        "label": item.label,
                        "value": item.value,
                        "item": item.item
                    }
                    : "");

                locationMaster.map(item => item.value === masterData["selectedSampleStorageVersion"].nsamplestoragelocationcode ?
                    approvedTreeData = item.item
                    : "");

                masterData = {
                    ...masterData, storageCategory: conditionMaster, approvedLocation: locationMaster, approvedTreeData: JSON.parse(approvedTreeData["jsondata"].value).data
                };

                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData,
                        loading: false,
                        selectedRecord,
                        openChildModal: true,
                        operation: "move",
                        ncontrolcode: moveId

                    }
                });
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
                            loading: false,
                            responseStatus: error.response.status
                        }
            
          });
        } else if (error.response.status === 500) {
                    toast.error(error.message);
                } else {
                    toast.warn(error.response.data);
                }
            });
    }
}

export function loadApprovedLocationOnCombo(userInfo, masterData, selectedRecord) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("/samplestoragemaster/getSampleStorageMasterByCategory",
            {
                'userinfo': userInfo, "nstoragecategorycode": selectedRecord.nstoragecategorycode.value
            })
            .then(response => {

                const locationMap = constructOptionList(response.data["approvedSampleStorageLocation"], "nsamplestoragelocationcode", "ssamplestoragelocationname", false, false, true);
                const locationMaster = locationMap.get("OptionList");

                selectedRecord["nsamplestoragelocationcode"] = [];
                let approvedTreeData = [];

                masterData = {
                    ...masterData, approvedLocation: locationMaster, approvedTreeData
                };

                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData,
                        loading: false,
                        selectedRecord
                    }
                });
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
                            loading: false,
                            responseStatus: error.response.status
                        }
            
          });
        } else if (error.response.status === 500) {
                    toast.error(error.message);
                } else {
                    toast.warn(error.response.data);
                }
            });
    }
}

export function loadApprovedLocationOnTreeData(userInfo, masterData, selectedRecord) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("/samplestoragemaster/getApprovedSampleStorageLocationByID",
            {
                'userinfo': userInfo, "nstoragecategorycode": selectedRecord.nstoragecategorycode.value, "nsamplestoragelocationcode": selectedRecord.nsamplestoragelocationcode.value
            })
            .then(response => {

                masterData = {
                    ...masterData, approvedTreeData: JSON.parse(response.data[0]["jsondata"].value).data
                };

                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData,
                        loading: false,
                        selectedRecord
                    }
                });
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
                            loading: false,
                            responseStatus: error.response.status
                        }
            
          });
        } else if (error.response.status === 500) {
                    toast.error(error.message);
                } else {
                    toast.warn(error.response.data);
                }
            });
    }
}
export function moveItems(inputParam, masterData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("/samplestoragemaster/moveItems", inputParam)
            .then(response => {

                // if (inputParam.moveContainers === true) {
                masterData = {
                    ...masterData, selectedSampleStorageVersion: response.data[0]
                };
                // } else {
                //     masterData = {
                //         ...masterData, selectedSampleStorageVersion: response.data[0]
                //     };
                // }

                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false,
                        openChildModal: false,
                        masterData,
                        activeTabIndex: undefined,
                        loadEsign: false
                    }
                });
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
                            loading: false,
                            responseStatus: error.response.status
                        }
            
          });
        } else if (error.response.status === 500) {
                    toast.error(error.message);
                } else {
                    toast.warn(error.response.data);
                }
            });
    }
}

export function saveSampleStorageMaster(userInfo, masterData, selectedRecord, inputParam) {
    return function (dispatch) {

        dispatch(initRequest(true));
        rsapi().post("/samplestoragemaster/createSampleStorageMaster",
            {
                'userinfo': userInfo, "sampleStorageMaster": inputParam.inputData["sampleStorageMaster"]
            })
            .then(response => {

                selectedRecord["ssamplearno"] = "";
                selectedRecord["nsampleqty"] = "";
                masterData = {
                    ...masterData, sampleStorageMaster: response.data["sampleStorageMaster"],
                    selectedSampleStorageMaster: response.data["selectedSampleStorageMaster"]
                };

                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData,
                        loading: false,
                        selectedRecord,
                        openModal: inputParam.saveType === 2 ? true : false,
                        loadEsign: false
                    }
                });
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
                            loading: false,
                            responseStatus: error.response.status
                        }
            
          });
        } else if (error.response.status === 500) {
                    toast.error(error.message);
                } else {
                    toast.warn(error.response.data);
                }
            });
    }
}

export function validateEsignCredentialSampleStorageMaster(inputParam) {
    return (dispatch) => {
        dispatch(initRequest(true));
        return rsapi().post("login/validateEsignCredential", inputParam.inputData)
            .then(response => {
                if (response.data.credentials === "Success") {



                    const methodUrl = inputParam["screenData"]["inputParam"]["methodUrl"];
                    inputParam["screenData"]["inputParam"]["inputData"]["userinfo"] = inputParam.inputData.userinfo;

                    if (inputParam["screenData"]["inputParam"]["inputData"][methodUrl.toLowerCase()] &&
                        inputParam["screenData"]["inputParam"]["inputData"][methodUrl.toLowerCase()]["esignpassword"]) {
                        delete inputParam["screenData"]["inputParam"]["inputData"][methodUrl.toLowerCase()]["esignpassword"];
                        delete inputParam["screenData"]["inputParam"]["inputData"][methodUrl.toLowerCase()]["esigncomments"];
                        delete inputParam["screenData"]["inputParam"]["inputData"][methodUrl.toLowerCase()]["esignreason"];
                        delete inputParam["screenData"]["inputParam"]["inputData"][methodUrl.toLowerCase()]["agree"];
                    }
                    let { selectedRecord, //userInfo, 
                        masterData } = inputParam["screenData"];
                    delete selectedRecord.esignpassword;
                    delete selectedRecord.esigncomments;
                    delete selectedRecord.esignreason;
                    delete selectedRecord.agree;
                    delete inputParam.inputData.password;
                    //userInfo = inputParam.inputData.userinfo;
                    if (inputParam["screenData"].inputParam.operation === "move") {
                        dispatch(moveItems(inputParam["screenData"].inputParam, masterData));
                    } else {
                        dispatch(saveSampleStorageMaster(inputParam.inputData.userinfo, masterData, selectedRecord, inputParam["screenData"].inputParam))
                    }
                }
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
                            loading: false,
                            responseStatus: error.response.status
                        }
            
          });
        } else if (error.response.status === 500) {
                    toast.error(error.message);
                } else {
                    toast.warn(error.response.data);
                }
            })
    };
}

export function sendToStoreSampleStorageMaster(userInfo, inputParam) {
    return function (dispatch) {

        dispatch(initRequest(true));
        rsapi().post("/samplestoragemaster/createSampleStorageMaster", inputParam.inputData
            // {
            //     'userinfo': userInfo, "sampleStorageMaster": inputParam.inputData["sampleStorageMaster"]
            // }
        )
            .then(response => {


                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {

                        loading: false,
                        openChildModal: false,
                        loadEsign: false
                    }
                });
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
                            loading: false,
                            responseStatus: error.response.status
                        }
            
          });
        } else if (error.response.status === 500) {
                    toast.error(error.message);
                } else {
                    toast.warn(error.response.data);
                }
            });
    }
}


export function addSample(addID, masterData, userInfo) {
    return function (dispatch) {
        dispatch(initRequest(true));

        let urlArray = [];


        const getUnit = rsapi().post("/unit/getUnit",
            { 'userinfo': userInfo })

        const getSettings = rsapi().post("/samplestoragemaster/getSettingsForSubSampleQty",
            {
                'userinfo': userInfo });

        urlArray = [getUnit, getSettings];


        Axios.all(urlArray)      
            .then(response => {
                let isneedSubSampleQty = false;
                if(response[1].data !== null){
                    if(response[1].data && response[1].data["ssettingvalue"] === '3'){
                        isneedSubSampleQty = true;
                    }
                }
                const conditionUnitMap = constructOptionList(response[0].data, "nunitcode", "sunitname", false, false, true);
                const conditionUnitMaster = conditionUnitMap.get("OptionList");
                let selectedRecord = {};
                const defaultUnit = conditionUnitMaster.filter(function (item) {
                    return item.item.ndefaultstatus === transactionStatus.YES;
                });
                if (defaultUnit.length > 0) {
                    selectedRecord["nunitcode"] = {
                        value: defaultUnit[0].value,
                        label: defaultUnit[0].label,
                        item: defaultUnit[0].item
                    };
                }
                masterData = {
                    ...masterData, unitMaster: conditionUnitMaster
                };

                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData,
                        openModal: true, selectedRecord,
                        operation: "create", ncontrolcode: addID,
                        loading: false, isneedSubSampleQty

                    }
                });
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
                            loading: false,
                            responseStatus: error.response.status
                        }
            
          });
        } else if (error.response.status === 500) {
                    toast.error(error.message);
                } else {
                    toast.warn(error.response.data);
                }
            });
    }
}