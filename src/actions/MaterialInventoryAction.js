

import rsapi from '../rsapi';
import { DEFAULT_RETURN, UN_AUTHORIZED_ACCESS } from './LoginTypes';
import { sortData, constructOptionList, parentChildComboLoad, rearrangeDateFormat, constructjsonOptionList } from '../components/CommonScript'
import { toast } from 'react-toastify';
import Axios from 'axios';
import { initRequest } from './LoginAction';
import { intl } from '../components/App';
import { attachmentType, transactionStatus } from '../components/Enumeration';


export function initialcombochangeMaterialInvget(nmaterialtypecode, nmaterialcatcode, data, userInfo) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("/materialinventory/getMaterialInventorycombo", { nmaterialtypecode, nmaterialcatcode: nmaterialcatcode && nmaterialcatcode, "userinfo": userInfo })
            .then(response => {
                const masterData = { ...data, ...response.data, searchedData: undefined }
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
                    toast.error(error.message);
                } else {
                    toast.warn(error.response.data);
                }
            });
    }
}

export function getMaterialInventoryByID(selectedcombo, selectedcombouser, selectedMaterialcombo, Data, userInfo) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("/materialinventory/getMaterialInventoryByID", selectedcombouser !== undefined ? {
            nmaterialtypecode: selectedcombo['nmaterialtypecode'].value !== undefined ?
                selectedcombo['nmaterialtypecode'].value : selectedcombo['nmaterialtypecode'],
            nmaterialcatcode: selectedcombouser['nmaterialcatcode'].value !== undefined ?
                selectedcombouser['nmaterialcatcode'].value : selectedcombouser['nmaterialcatcode'],
            nmaterialcode: selectedMaterialcombo["nmaterialcode"].value !== undefined ?
                selectedMaterialcombo["nmaterialcode"].value : selectedMaterialcombo["nmaterialcode"]
            , "userinfo": userInfo
        } : {
            nmaterialtypecode: selectedcombo['nmaterialtypecode'].value

            , "userinfo": userInfo
        })
            .then(response => {
                let masterData = {}

                masterData = { ...Data, ...response.data, searchedData: undefined }

                sortData(masterData);
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData, loading: false, skip: 0, take: 20
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
                } else {
                    toast.warn(error.response.data);
                }
            });
    }
}
export function getAddMaterialInventoryPopup(operation, loginInfo, selectedcombo,
    ncontrolCode, masterData, selectedRecord) {
    return function (dispatch) {
        if (operation === "create") {
            if (selectedcombo !== undefined) {
                let urlArray = [];
                let timeZoneList;
                let templateData = [];
                let data = [];
                let dataparent = [];
                const withoutCombocomponent = []
                let filterQueryComponents = [];
                const Layout = masterData.selectedTemplate[0].jsondata
                Layout.map(row => {
                    row.children.map(column => {
                        column.children.map(component => {
                            if (component.hasOwnProperty("parent")) {
                                dataparent.push(component)
                            }
                            if (component.hasOwnProperty("nsqlquerycode")) {
                                filterQueryComponents.push(component)
                            }
                            return component.hasOwnProperty("children") ? component.children.map(componentrow => {
                                if (componentrow.inputtype === "combo" && !(component.hasOwnProperty("parent"))) {
                                    if (componentrow.hasOwnProperty("parent")) {
                                        dataparent.push(componentrow)
                                    }
                                    else {
                                        data.push(componentrow)
                                    }
                                }
                                if (componentrow.hasOwnProperty("nsqlquerycode")) {
                                    filterQueryComponents.push(componentrow)
                                }
                            })
                                : component.inputtype === "combo" && !(component.hasOwnProperty("parent")) ? data.push(component) : withoutCombocomponent.push(component)
                        })
                    })
                })
                const comboComponents = data
                dataparent[0] = {
                    displaymember: dataparent[0].displaymember,
                    inputtype: dataparent[0].inputtype,
                    label: dataparent[0].label,
                    source: dataparent[0].source,
                    type: dataparent[0].type,
                    valuemember: dataparent[0].valuemember
                }
                let filterQueryComponents1 = []
                filterQueryComponents.map(temp => {
                    // filterQueryComponents1.push({'nsqlquerycode':temp.nsqlquerycode})
                    filterQueryComponents1 += temp.nsqlquerycode + ','
                })
                const MaterialInvreq = rsapi().post("dynamicpreregdesign/getComboValues",
                    {
                        "nunitcode": selectedcombo['jsondata']["nunitcode"].value
                        , "userinfo": loginInfo.userInfo, "parentcolumnlist": comboComponents,
                        "filterQueryComponents": filterQueryComponents1.substring(0, filterQueryComponents1.length - 1),
                        "parameters": { 'nmaterialcode': masterData['SelectedMaterialCrumb']['jsondata'].nmaterialcode }
                    });
                const MaterialInvreq1 = rsapi().post('dynamicpreregdesign/getChildValues', {
                      //ALPD-2272
                    child: Layout[0].children[0].children[0].childValue || [],
                    parentdata: { nunitcode: selectedcombo['jsondata']["nunitcode"].value },
                    parentsource: 'unit',
                    'nunitcode': selectedcombo['jsondata']["nunitcode"].value,
                    valuemember: 'nunitcode',
                    'userinfo': loginInfo.userInfo,
                    parentcolumnlist: dataparent
                });
                const materialReq3 = rsapi().post('materialinventory/getMaterialInventoryByID', {
                    'nmaterialcatcode': masterData['SelectedMaterialCategory'].nmaterialcatcode,
                    'nmaterialtypecode': masterData['SelectedMaterialType'][0].nmaterialtypecode,
                    'nmaterialcode': masterData['SelectedMaterialCrumb']['jsondata'].nmaterialcode,
                    'userinfo': loginInfo.userInfo
                });
                const timezone = rsapi().post("timezone/getTimeZone");
                urlArray = [MaterialInvreq, MaterialInvreq1, timezone, materialReq3];
                dispatch(initRequest(true));
                Axios.all(urlArray)
                    .then(response => {
                        templateData = response[0].data;
                        data.splice(1, 0, dataparent[0])
                        let temp1 = []
                        const temp2 = { ...response[0].data, ...response[1].data }
                        templateData = parentChildComboLoad(data, temp2, selectedRecord, null, withoutCombocomponent, undefined, loginInfo.userInfo.slanguagetypecode, loginInfo.userInfo)
                        let dateLables = []
                        const Layout = masterData.selectedTemplate[0].jsondata
                        Layout.map((row) => {
                            row.children.map((column) => {
                                column.children.map((component) => {
                                    // if (component.inputtype === 'combo') {
                                    //     selectedRecord[component.label] = templateData["comboData"][component.label]
                                    //         && templateData["comboData"][component.label][0]
                                    // }
                                    // else
                                    if (component.inputtype === 'date') {
                                        if (component.hasOwnProperty('timezone'))
                                            dateLables.push(component.label)

                                    }
                                    component.hasOwnProperty("children") && component.children.map(
                                        (componentrow) => {
                                            if (componentrow.inputtype === 'combo') {
                                                if (componentrow.label === 'Unit')
                                                    selectedRecord[componentrow.label] = templateData["comboData"][componentrow.label]
                                                        && templateData["comboData"][componentrow.label][0]
                                            }
                                            else
                                                if (componentrow.inputtype === 'date') {
                                                    if (componentrow.hasOwnProperty('timezone'))
                                                        dateLables.push(componentrow.label)

                                                }

                                        }
                                    )
                                })
                            })
                        })
                        if (dateLables) {
                            const timeZoneListMap = constructOptionList(response[2].data || [], "ntimezonecode",
                                "stimezoneid", undefined, undefined, true);
                            timeZoneList = timeZoneListMap.get("OptionList");
                            dateLables.map((temp) => {
                                selectedRecord[`tz${temp}`] = timeZoneList[0]
                            })
                        }
                        masterData['SelectedMaterialCrumb'] = response[3].data.SelectedMaterialCrumb
                        dispatch({

                            type: DEFAULT_RETURN, payload: {
                                operation, timeZoneList, screenname: 'IDS_MATERIALINVENTORY', masterData, selectedRecord, showMaterialSection: false, templateData, openModal: true,
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
                        }
                        else {
                            toast.warn(intl.formatMessage({ id: error.response.data }));
                        }
                    })
            }
            else {
                if (masterData.MaterialCategoryMain === undefined) {
                    toast.warn(intl.formatMessage({ id: 'IDS_CONFIGMATERIALCATANDMATERIAL' }));
                }
                if (masterData.MaterialCombo) {
                    if (masterData.MaterialCombo.length === 0) {
                        toast.warn(intl.formatMessage({ id: 'IDS_CONFIGMATERIAL' }));
                    }
                }

            }
        }
        else {
            let urlArray = [];
            let templateData = [];
            let data = [];
            let filterQueryComponents = [];
            let dataparent = [];
            let dateLables = [];
            let timeZoneList;
            const withoutCombocomponent = []
            const Layout = masterData.selectedTemplate[0].jsondata
            if (masterData["SelectedMaterialInventory"].ntranscode !== transactionStatus.RETIRED &&
                masterData["SelectedMaterialInventory"].ntranscode !== transactionStatus.RELEASED
                && masterData["SelectedMaterialInventory"].ntranscode !== transactionStatus.EXPIRED) {
                Layout.map(row => {
                    row.children.map(column => {
                        column.children.map(component => {
                            if (component.hasOwnProperty("parent")) {
                                dataparent.push(component)
                            }
                            if (component.hasOwnProperty("nsqlquerycode")) {
                                filterQueryComponents.push(component)
                            }
                            if (component.hasOwnProperty('timezone')) {
                                dateLables.push(component.label)
                            }
                            return component.hasOwnProperty("children") ? component.children.map(componentrow => {
                                if (componentrow.inputtype === "combo" && !(component.hasOwnProperty("parent"))) {
                                    if (componentrow.hasOwnProperty("parent")) {
                                        dataparent.push(componentrow)
                                    }
                                    else {
                                        data.push(componentrow)
                                    }
                                }
                                if (componentrow.hasOwnProperty("nsqlquerycode")) {
                                    filterQueryComponents.push(componentrow)
                                }
                                if (component.hasOwnProperty('timezone')) {
                                    dateLables.push(component.label)
                                }
                            })
                                : component.inputtype === "combo" && !(component.hasOwnProperty("parent")) ? data.push(component) : withoutCombocomponent.push(component)
                        })
                    })
                })
                const comboComponents = data
                const MaterialInv = rsapi().post("/materialinventory/getMaterialInventoryEdit",
                    {
                        'nmaterialtypecode': masterData.SelectedMaterialInventory.nmaterialtypecode,
                        'nmaterialinventorycode': masterData.SelectedMaterialInventory.nmaterialinventorycode, "userinfo": loginInfo.userInfo
                    });
                dataparent[0] = {
                    displaymember: dataparent[0].displaymember,
                    inputtype: dataparent[0].inputtype,
                    label: dataparent[0].label,
                    source: dataparent[0].source,
                    type: dataparent[0].type,
                    valuemember: dataparent[0].valuemember
                }
                let filterQueryComponents1 = []
                filterQueryComponents.map(temp => {
                    // filterQueryComponents1.push({'nsqlquerycode':temp.nsqlquerycode})
                    filterQueryComponents1 += temp.nsqlquerycode + ','
                })
                const Materialinvreq = rsapi().post("dynamicpreregdesign/getComboValues",
                    {
                        "nunitcode": selectedcombo['jsondata']["nunitcode"].value
                        , "userinfo": loginInfo.userInfo, "parentcolumnlist": comboComponents,
                        "filterQueryComponents": filterQueryComponents1.substring(0, filterQueryComponents1.length - 1),
                        "parameters": { 'nmaterialcode': masterData['SelectedMaterialCrumb']['jsondata'].nmaterialcode }
                    });
                const MaterialInvreq1 = rsapi().post('dynamicpreregdesign/getChildValues', {
                      //ALPD-2272
                    child: Layout[0].children[0].children[0].childValue||[],
                    parentdata: { nunitcode: selectedcombo['jsondata']["nunitcode"].value },
                    parentsource: 'unit',
                    'nunitcode': selectedcombo['jsondata']["nunitcode"].value,
                    valuemember: 'nunitcode',
                    "userinfo": loginInfo.userInfo,
                    parentcolumnlist: dataparent
                });
                const timezone = rsapi().post("timezone/getTimeZone");
                const materialReq3 = rsapi().post('materialinventory/getMaterialInventoryByID', {
                    'nmaterialcatcode': masterData['SelectedMaterialCategory'].nmaterialcatcode,
                    'nmaterialtypecode': masterData['SelectedMaterialType'][0].nmaterialtypecode,
                    'nmaterialcode': masterData['SelectedMaterialCrumb']['jsondata'].nmaterialcode,
                    "userinfo": loginInfo.userInfo
                });
                urlArray = [Materialinvreq, MaterialInvreq1, MaterialInv, timezone, materialReq3];

                dispatch(initRequest(true));
                Axios.all(urlArray)
                    .then(response => {
                        templateData = response[0].data;
                        data = [...data, ...dataparent]
                        templateData = parentChildComboLoad(data, { ...response[0].data, ...response[1].data }, selectedRecord, null, withoutCombocomponent, undefined, loginInfo.userInfo.slanguagetypecode, loginInfo.userInfo)

                        if (response[2].data["EditedMaterialInventory"].length > 0) {
                            if (response[2].data["MaterialInventoryDateFeild"] !== undefined) {
                                response[2].data["MaterialInventoryDateFeild"].map((temp) => {
                                    response[2].data["EditedMaterialInventory"][0][temp] =
                                        rearrangeDateFormat(loginInfo.userInfo, response[2].data["EditedMaterialInventory"][0][temp])
                                })
                                response[2].data["DateFeildsInventory"].map((temp) => {
                                    if (response[2].data["EditedMaterialInventory"][0].hasOwnProperty(temp) &&
                                        response[2].data["EditedMaterialInventory"][0][temp] === '-') {
                                        delete response[2].data["EditedMaterialInventory"][0][temp]
                                    }
                                })
                            }
                            else {
                                response[2].data["DateFeildsInventory"].map((temp) => {
                                    if (response[2].data["EditedMaterialInventory"][0].hasOwnProperty(temp) &&
                                        response[2].data["EditedMaterialInventory"][0][temp] === '-') {
                                        delete response[2].data["EditedMaterialInventory"][0][temp]
                                    }
                                })
                            }
                        }
                        selectedRecord = { ...selectedRecord, ...response[2].data.EditedMaterialInventory[0] }
                        if (dateLables) {
                            const timeZoneListMap = constructOptionList(response[3].data || [], "ntimezonecode",
                                "stimezoneid", undefined, undefined, true);
                            timeZoneList = timeZoneListMap.get("OptionList");

                            response[2].data["DateFeildsInventory"].map((temp) => {
                                if (!selectedRecord.hasOwnProperty(temp)) {
                                    selectedRecord[`tz${temp}`] = timeZoneList[0]
                                }
                            })
                        }
                        masterData['SelectedMaterialCrumb'] = response[4].data.SelectedMaterialCrumb
                        dispatch({
                            type: DEFAULT_RETURN, payload: {
                                operation, screenname: 'IDS_MATERIALINVENTORY', timeZoneList, masterData, isSelectedRecordChange: false, showMaterialSection: false, templateData, openModal: true, selectedcombo, selectedRecord,
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
                        }
                        else {
                            toast.warn(intl.formatMessage({ id: error.response.data }));
                        }
                    })
            }
            else {
                toast.warn(intl.formatMessage({ id: "IDS_SELECTQUARENTINEINVENTORY" }));
            }
        }

    }
}
export function getMaterialInventoryDetails(inputData, masterData, userInfo) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("materialinventory/getMaterialInventoryDetails", {
            "nmaterialcode": inputData.nmaterialcode,
            "nmaterialcatcode": inputData.nmaterialcatcode,
            "nmaterialtypecode": inputData.nmaterialtypecode,
            "nmaterialinventorycode": inputData.nmaterialinventorycode,
            "userinfo": userInfo
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
                    toast.warn(intl.formatMessage({ id: error.response.data }));
                }
            })

    }
}

export function updateMaterialStatus(masterData, userInfo, ncontrolcode, nflag) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("materialinventory/updateMaterialStatus", {
            nflag: nflag,
            nmaterialinventorycode: masterData["SelectedMaterialInventory"].nmaterialinventorycode,
            nmaterialcode: masterData["SelectedMaterialInventory"].nmaterialcode,
            nmaterialtypecode: masterData["SelectedMaterialInventory"].nmaterialtypecode,
            nmaterialcatcode: masterData["SelectedMaterialInventory"].nmaterialcatcode,
            nsectioncode: masterData["SelectedMaterialInventory"].nsectioncode,
            "userinfo": userInfo
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
                    toast.warn(intl.formatMessage({ id: error.response.data }));
                }
            })

    }
}


export function openDatePopup(masterData, ncontrolCode) {
    return function (dispatch) {
        if (masterData.SelectedMaterialCrumb['jsondata']['Open Expiry Need'] !== transactionStatus.NO) {
            dispatch(initRequest(true));
            return rsapi().post("timezone/getTimeZone")
                .then(response => {
                    let selectedRecord = {};
                    // const timeZoneListMap = constructOptionList(response.data || [], "ntimezonecode",
                    //     "stimezoneid", undefined, undefined, true);
                    // const timeZoneList = timeZoneListMap.get("OptionList");
                    // selectedRecord = { 'tzIDS_OPENDATE': timeZoneList[0] }
                    //  dispatch({ type: DEFAULT_RETURN, payload: { timeZoneList, ncontrolCode, selectedRecord, ModaTitle: 'IDS_OPENDATE', showModalPopup: true, masterData, loading: false } });

                    dispatch({ type: DEFAULT_RETURN, payload: { operation: 'IDS_OPENDATE', ncontrolCode, selectedRecord, ModaTitle: 'IDS_OPENDATE', showModalPopup: true, masterData, loading: false } });
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
                        toast.warn(intl.formatMessage({ id: error.response.data }));
                    }
                })
        }
        else {
            toast.warn(intl.formatMessage({ id: 'IDS_OPENDATEISDISABLEDFORTHISMATERIAL' }));
        }

    }
}


export function getQuantityTransactionPopup(Data, userInfo, updateInfo, ncontrolCode) {
    return function (dispatch) {
        dispatch(initRequest(true));
        let urlArray = [];
        let timeZoneList;
        const getQuantityTransaction = rsapi().post("/materialinventory/getQuantityTransaction",
            {
                "userinfo": userInfo, 'nmaterialtypecode': Data["SelectedMaterialType"]["nmaterialtypecode"],
                nmaterialinventorycode: Data["SelectedMaterialInventory"]["nmaterialinventorycode"]
                , nflag: 1, sprecision: Data.sprecision, needsectionwise: Data.SelectedMaterialCategory.needSectionwise
            })
        const timezone = rsapi().post("timezone/getTimeZone");
        urlArray = [getQuantityTransaction, timezone]
        Axios.all(urlArray)
            .then(response => {
                // if (Array.isArray(response[0].data)) {
                let masterData = {}
                let isSectionneed;
                let templateData = [];
                let selectedRecord = {};
                let arr1 = []
                let arr2 = []
                arr1.push(response[0].data.parentcolumnlist[0])
                arr2.push(response[0].data.parentcolumnlist[1])
                masterData = { ...Data, ...response[0].data, searchedData: Data.searchedData != undefined ? Data.searchedData : undefined }
                templateData[0] = parentChildComboLoad(arr1, response[0].data, selectedRecord,
                    response[0].data.childcolumnlist[0], undefined, undefined, userInfo.slanguagetypecode, userInfo)
                templateData[1] = parentChildComboLoad(arr2, response[0].data, selectedRecord,
                    response[0].data.childcolumnlist[1], undefined, undefined, userInfo.slanguagetypecode, userInfo)

                    templateData[0]['comboData']['Transaction Type'].forEach((x,index)=> {
                        if(x['value']==64&&masterData.SelectedMaterialCategory.needSectionwise===transactionStatus.YES){
                                 templateData[0]['comboData']['Transaction Type'].splice(index,1)  
                        }
                    });
                selectedRecord = {
                    ...templateData[0].selectedRecord, ...templateData[1].selectedRecord,
                    //'IDS_SECTION': Data['SelectedMaterialInventory']['jsondata']['IDS_SECTION'],
                    'Available Quantity/Unit': response[0].data.navailableqty,
                    'Unit':Data.SelectedMaterialCrumb.jsondata.nunitcode.label,
                    'Received Quantity': 0,'Transaction Type':response[0].data["Transaction Type"][0]
                }
                if (selectedRecord.Site) {
                    if (selectedRecord.Site.value === userInfo.nsitecode) {
                        isSectionneed = 3;
                    }
                }

                // const timeZoneListMap = constructOptionList(response[1].data || [], "ntimezonecode",
                //     "stimezoneid", undefined, undefined, true);
                // const timeZoneList = timeZoneListMap.get("OptionList");
                // response[0].data["DateFeildsProperties"].map((temp) => {
                //     if (!selectedRecord.hasOwnProperty(temp)) {
                //         selectedRecord[`tz${temp}`] = timeZoneList[0]
                //     }
                // })
                // masterData['QuantityTransactionTemplate'][0].jsondata.map((row) => {
                //     row.children.map((column) => {
                //         column.children.map((component,i) => {
                //             if (component.inputtype === 'combo') {
                //                 if(selectedRecord.hasOwnProperty(component.label))
                //                 if (selectedRecord[component.label] === undefined) {
                //                     if(templateData[0]!==undefined)
                //                     selectedRecord[component.label] = templateData[0].comboData[component.label][0]
                //                 }
                //             }
                //             if (component.inputtype === 'date') {
                //                 if (component.hasOwnProperty('timezone')) {
                //                     const timeZoneListMap = constructOptionList(response[1].data || [], "ntimezonecode",
                //                         "stimezoneid", undefined, undefined, true);
                //                      timeZoneList = timeZoneListMap.get("OptionList");
                //                     response[0].data["DateFeildsProperties"].map((temp) => {
                //                         if (!selectedRecord.hasOwnProperty(temp)) {
                //                             selectedRecord[`tz${temp}`] = timeZoneList[0]
                //                         }
                //                     })
                //                 }
                //             }
                //         })
                //      })
                //  }) 
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        operation: "create", selectedRecord, templateData: templateData[0], timeZoneList, navailableqty: response[0].data.navailableqty,
                        masterData, updateInfo, ncontrolCode, openModal: true, screenname: "IDS_QUANTITYTRANSACTION",
                        loading: false, skip: 0, take: 20, isSectionneed
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
                }
                else {
                    toast.warn(intl.formatMessage({ id: error.response.data }));
                }
            })
    }
}

export function getMaterialChildValues(inputParem, userInfo, selectedRecord,
    parentcolumnlist, childcolumnlist, comboData, childKeyname, parentDependentChild, masterData) {
   // if (selectedRecord["Transaction Type"] !== undefined) {
        return function (dispatch) {
            dispatch(initRequest(true));
            rsapi().post('materialinventory/getChildValuesMaterial', {
                child: inputParem.child,
                parentdata: inputParem.item.jsondata,
                parentsource: inputParem.source,
                [inputParem.primarykeyField]: inputParem.value,
                valuemember: inputParem.primarykeyField,
                userInfo,
                parentcolumnlist: childcolumnlist[childKeyname],
                childcolumnlist: childcolumnlist[childKeyname][0],
                parameters: childcolumnlist[childKeyname][0].hasOwnProperty('nsqlquerycode') ? {
                    nmaterialinventorycode: masterData.SelectedMaterialInventory['nmaterialinventorycode'],
                    nsitecode: selectedRecord.Site.value, nusercode: userInfo.nusercode
                } : null,
                userinfo: userInfo
            })
                .then(response => {
                    let templateData = [];
                    let temp = selectedRecord[childKeyname]
                    let returnObj = { ...comboData, ...response.data }
                    //const x=returnObj['Section'] 
                    templateData = parentChildComboLoad(parentcolumnlist, returnObj, selectedRecord, childcolumnlist, undefined, undefined, userInfo.slanguagetypecode, userInfo)

                    if (templateData.comboData['Section'] === undefined) {
                        const optionlist = constructjsonOptionList(response.data['Section'] || [], 'nsectioncode',
                            'ssectionname', false, false, true, undefined, 'section', false, userInfo.slanguagetypecode)
                        templateData.comboData['Section'] = optionlist.get("OptionList");
                    }
                    templateData['comboData']['Transaction Type'].forEach((x,index)=> {
                        if(x['value']==64&&masterData.SelectedMaterialCategory.needSectionwise===transactionStatus.YES){
                                 templateData['comboData']['Transaction Type'].splice(index,1)  
                        }
                    });
                    //  templateData.comboData={...templateData.comboData,...returnObj }
                    selectedRecord[childKeyname] = temp
                    selectedRecord = { ...selectedRecord, [parentDependentChild]: templateData['comboData'][parentDependentChild][0] }
               
                    const comboData1 = { value: selectedRecord['Transaction Type'] && selectedRecord['Transaction Type'].value }

                    dispatch(getQuantityTransactionOnchange(comboData1, masterData, userInfo, selectedRecord, templateData));
                    // dispatch( type: DEFAULT_RETURN, payload: {templateData,selectedRecord});
                    //  dispatch({
                    //     type: DEFAULT_RETURN,
                    //     payload: {
                    //         templateData,selectedRecord,loading: false
                    //     }
                    // });
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
                } else {
                    toast.warn(error.response.data);
                }
                });
        }
    // } else {
    //     toast.warn(intl.formatMessage({
    //         id: "IDS_SELECTTRANSACTIONTYPE"
    //     }))
    // }
}
// export function getQuantityTransactionOnchange( ) {
//     return function (dispatch) {
//         dispatch(initRequest(true));
//         rsapi().post("/materialinventory/getQuantityTransaction",
//             {
//                 "userinfo": userInfo, 'nmaterialtypecode': Data["SelectedMaterialType"]["nmaterialtypecode"],
//                 nmaterialinventorycode: Data["SelectedMaterialInventory"]["nmaterialinventorycode"]
//                 , nflag: selectedRecord['Inventory Transaction Type'].value === transactionStatus.ACTIVE ? 2 : 3,
//                 ntransactiontype: ntransactiontype?selectedRecord['Transaction Type'].value:
//                 comboData.value,sourceSection:selectedRecord['Section']&&selectedRecord['Section'].value,
//                 needsectionwise:Data.SelectedMaterialCrumb&&Data.SelectedMaterialCrumb.jsondata.needsectionwise,
//                 sprecision:Data.sprecision
//             })
//             .then(response => { 
//                 dispatch(getQuantityTransactionOnchange(comboData1, masterData, userInfo, selectedRecord, templateData));
//             })
//             .catch(error => {
//                 dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
//                 if (error.response?.status === 429) {
//                    toast.warn(intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
//                    dispatch({ type: DEFAULT_RETURN, payload: { loading: false } });
//                } else if (error.response?.status === 401 || error.response?.status === 403) {
//          dispatch({
//            type: UN_AUTHORIZED_ACCESS,
//                        payload: {
//                            navigation: 'forbiddenaccess',
//                            loading: false,
//                            responseStatus: error.response.status
//                        }
//            
//          });
//        } else if (error.response.status === 500) {
//                    toast.error(error.message);
//                } else {
//                    toast.warn(error.response.data);
//                }
//             });
//     }
// }
export function getSiteonchange(comboData, Data, userInfo, selectedRecord, templateData, ntransactiontype) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post('dynamicpreregdesign/getcombovalues', {
            // "nunitcode": selectedcombo['jsondata']["nunitcode"].value
            // , "userinfo": loginInfo.userInfo, "parentcolumnlist": comboComponents,
            // "filterQueryComponents": filterQueryComponents1.substring(0, filterQueryComponents1.length - 1),
            // "parameters":{'nmaterialcode': masterData['SelectedMaterialCrumb']['jsondata'].nmaterialcode}
        })
            .then(response => {
                // let templateData = [];
                // let temp = selectedRecord[childKeyname]
                // let returnObj = { ...comboData, ...response.data }
                // templateData = parentChildComboLoad(parentcolumnlist, returnObj, selectedRecord, childcolumnlist, undefined, undefined, userInfo.slanguagetypecode,userInfo)
                // selectedRecord[childKeyname] = temp
                // selectedRecord = { ...selectedRecord, [parentDependentChild]: templateData['comboData'][parentDependentChild][0] }
                // const comboData1 = { value: selectedRecord['Transaction Type'].value }
                // dispatch(getQuantityTransactionOnchange(comboData1, masterData, userInfo, selectedRecord, templateData)); 
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
                } else {
                    toast.warn(error.response.data);
                }
            });
    }
}
export function getQuantityTransactionOnchange(comboData, Data, userInfo, selectedRecord, templateData, ntransactiontype) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("/materialinventory/getQuantityTransaction",
            {
                "userinfo": userInfo, 'nmaterialtypecode': Data["SelectedMaterialType"]["nmaterialtypecode"] || Data["SelectedMaterialType"][0]["nmaterialtypecode"],
                nmaterialinventorycode: Data["SelectedMaterialInventory"]["nmaterialinventorycode"]
                , nflag: selectedRecord['Inventory Transaction Type'].value === transactionStatus.ACTIVE ? 2 : 3,
                ntransactiontype: ntransactiontype ? selectedRecord['Transaction Type'] && selectedRecord['Transaction Type'].value :
                    comboData.value && comboData.value, sourceSection: selectedRecord['Section'] && selectedRecord['Section'].value,
                needsectionwise: Data.SelectedMaterialCrumb && Data.SelectedMaterialCrumb.jsondata.needsectionwise,
                sprecision: Data.sprecision, nsitecode: selectedRecord.Site && selectedRecord.Site.value
            })
            .then(response => {
                let isSectionneed;
                let masterData = {}
                let navailableqtyref = {}
                masterData = { ...Data, ...response.data }
                selectedRecord = {
                    ...selectedRecord
                }
                navailableqtyref = response.data.navailableqtyref
                if (selectedRecord['Transaction Type']) {
                    selectedRecord = {
                        ...selectedRecord,
                        'Available Quantity/Unit': response.data.navailableqty,
                    }
                    if (selectedRecord['Transaction Type'].value === transactionStatus.RECEIVED) {
                        masterData['QuantityTransactionTemplate'][0].jsondata.map((row) => {
                            row.children.map((column) => {
                                column.children.map((component, i) => {
                                    if (component.label === 'Available Quantity/Unit') {
                                        delete column.children[i]
                                    }

                                    component.hasOwnProperty("children") && component.children.map(

                                        (componentrow,j) => {
    
                                            if (componentrow.label === 'Available Quantity/Unit'||componentrow.label === 'Unit') {
    
                                                delete component.children[j]
    
                                            }
    
    
    
                                        }
    
                                    )
                                })
                            })
                        })
                    }
                }
                if (selectedRecord.Site) {
                    if (selectedRecord.Site.value === userInfo.nsitecode) {
                        isSectionneed = 3;
                        //    selectedRecord['Transaction Type']=templateData.comboData['Transaction Type'][1]
                    }
                    else {
                            if(masterData.SelectedMaterialCategory.needSectionwise===transactionStatus.NO){
                          isSectionneed = 4; 

                          selectedRecord.Section&&delete selectedRecord.Section
                    }
                    }
                }

                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        operation: "create", selectedRecord, templateData, navailableqtyref,
                        masterData, openModal: true, screenname: "IDS_QUANTITYTRANSACTION",
                        loading: false, skip: 0, take: 20, isSectionneed
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
                } else {
                    toast.warn(error.response.data);
                }
            });
    }
}

export function addMaterialInventoryFile(inputParam, param) {
    return (dispatch) => {
        dispatch(initRequest(true));
        let urlArray = [rsapi().post("/materialinventory/getMaterialInventoryLinkMaster", {
            nmaterialinventorycode: param.nmaterialinventorycode && param.nmaterialinventorycode,
            userinfo: inputParam.userInfo
        })];
        if (inputParam.operation === "update") {
            urlArray.push(rsapi().post("/materialinventory/editMaterialInventoryFile", {
                userinfo: inputParam.userInfo,
                nmaterialinventorycode: param.nmaterialinventorycode && param.nmaterialinventorycode,
                nmaterialinventoryfilecode: inputParam.selectedRecord.nmaterialinventoryfilecode
            }))
        }
        Axios.all(urlArray)
            .then(response => {
                const linkMap = constructOptionList(response[0].data.LinkMaster, "nlinkcode", "slinkname", false, false, true);
                const linkmaster = linkMap.get("OptionList");
                let selectedRecord = {};
                const defaultLink = linkmaster.filter(items => items.item.ndefaultlink === transactionStatus.YES);
                let disabled = false;
                let editObject = {};
                if (inputParam.operation === "update") {
                    editObject = response[1].data;
                    let nlinkcode = {};
                    let link = {};
                    if (editObject["jsondata"].nattachmenttypecode === attachmentType.LINK) {
                        nlinkcode = {
                            "label": editObject["jsondata"].slinkname,
                            "value": editObject["jsondata"].nlinkcode
                        }

                        link = {
                            slinkfilename: editObject["jsondata"].sfilename,
                            slinkdescription: editObject["jsondata"].sdescription,
                            nlinkdefaultstatus: editObject["jsondata"].ndefaultstatus,
                            sfilesize: '',
                            nfilesize: 0,
                            ndefaultstatus: 4,
                            sfilename: '',
                        }

                    } else {
                        nlinkcode = defaultLink.length > 0 ? defaultLink[0] : ""
                        link = {
                            slinkfilename: '',
                            slinkdescription: '',
                            nlinkdefaultstatus: 4,
                            sfilesize: editObject["jsondata"].sfilesize,
                            nfilesize: editObject["jsondata"].nfilesize,
                            ndefaultstatus: editObject["jsondata"].ndefaultstatus,
                            ssystemfilename: editObject["jsondata"].ssystemfilename,
                            sfilename: editObject["jsondata"].sfilename,
                        }
                    }
                    selectedRecord = {
                        ...link,
                        sdescription: editObject["jsondata"].sdescription,
                        nmaterialinventoryfilecode: editObject["jsondata"].nmaterialinventoryfilecode,
                        nattachmenttypecode: editObject["jsondata"].nattachmenttypecode,
                        nlinkcode,
                    };
                } else {
                    selectedRecord = {
                        nattachmenttypecode: response[0].data.AttachmentType.length > 0 ?
                            response[0].data.AttachmentType[0].nattachmenttypecode : attachmentType.FTP,
                        nlinkcode: defaultLink.length > 0 ? defaultLink[0] : "",
                        disabled
                    };
                }
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                       // openChildModal: true,
                       openModal: true,
                        dcreateddate: inputParam.selectedRecord && rearrangeDateFormat(inputParam.userInfo, inputParam.selectedRecord.dcreateddate),
                        operation: inputParam.operation,
                        screenname: inputParam.screenName,
                        ncontrolCode: inputParam.ncontrolCode,
                        selectedRecord,
                        loading: false,
                        linkMaster: linkmaster,
                        showSaveContinue: false,
                        editFiles: editObject.nattachmenttypecode === attachmentType.FTP ? editObject : {}
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
