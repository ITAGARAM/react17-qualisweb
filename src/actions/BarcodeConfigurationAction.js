import { toast } from "react-toastify";
import { DEFAULT_RETURN, UN_AUTHORIZED_ACCESS } from "./LoginTypes";
import rsapi from "../rsapi";
import { constructOptionList, constructjsonOptionList } from "../components/CommonScript";
import { initRequest } from "./LoginAction";
import axios from "axios";
import { intl } from "../components/App";

export function getBarcodeDynamicChange(inputParem, selectedRecordFilter, control, masterData,
    parentcolumnlist, childcolumnlist, userinfo, listData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("barcodeconfiguration/getChildValuesForBarcodeConfiguration", {
            child: inputParem.child,
            parentdata: inputParem.item.jsondata,
            parentsource: inputParem.source,
            [inputParem.primarykeyField]: inputParem.value,
            valuemember: inputParem.primarykeyField,
            childcolumnlist,
            userinfo,
            parentcolumnlist
        })
            .then(response => {

                let returnObj = parentChildComboLoadForBarcode(parentcolumnlist, response.data,
                    selectedRecordFilter, childcolumnlist,
                    userinfo.slanguagetypecode, userinfo)

                let masterData1 = { ...masterData, ...response.data }
                listData = { ...listData, ...returnObj.comboData }

                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        loading: false, selectedRecordFilter: returnObj.selectedRecord, masterData: masterData1, listData
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



export function getBarcodeTemplateControlBC(map) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("barcodeconfiguration/getBarcodeDynamicChange", { 'nformcode': map.selectedRecordFilter.nformcode.value, 'nbarcodetemplatecode': map.nbarcodetemplatecode, 'userinfo': map.userInfo })
            .then(response => {
                let masterData = { ...map.masterData, ...response.data, ComboComponnet: [] }
                const listData = { ...map.listData }
                const selectedRecordFilter = { ...map.selectedRecordFilter }

                selectedRecordFilter['ncontrolcode'] = undefined
                if (response.data.Control) {
                    const data = constructOptionList(response.data.Control || [], 'ncontrolcode', 'scontrolname').get("OptionList");
                    listData['ncontrolcode'] = data
                }

                Object.keys(listData).map(x => {
                    if (x !== 'nformcode' && x !== 'ncontrolcode') {
                        listData[x] = []
                        selectedRecordFilter[x] = undefined
                    }
                })

                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        loading: false, masterData, selectedRecordFilter: selectedRecordFilter, listData
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


export function getBarcodeTemplateControlCombo(map) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("barcodeconfiguration/getBarcodeDynamicCombo", {
            'ncontrolcode': map.selectedRecordFilter.ncontrolcode.value,
            nbarcodetemplatecode: map.nbarcodetemplatecode, 'userinfo': map.userInfo
        })
            .then(response => {
                const selectedRecordFilter = { ...map.selectedRecordFilter }
                let masterData = { ...map.masterData, ...response.data }
                const listData = { ...map.listData }

                response.data.ComboComponnet
                    && response.data.ComboComponnet
                        .map(x => {

                            const data = constructjsonOptionList(response.data[x.label] || [], x.valuemember, x.displaymember, false, false, true, undefined, x.source, x.isMultiLingual, map.userInfo.slanguagetypecode, x).get("OptionList");

                            selectedRecordFilter[x.label] = undefined
                            // if (data.length !== 0) {
                            //     selectedRecordFilter[x.label] = { ...data.filter(y => y.value === response.data["Selected" + x.label][x.valuemember])[0] }
                            // }else{
                            //     selectedRecordFilter[x.label]=
                            // }
                            listData[x.label] = data
                        })

                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        loading: false, masterData, selectedRecordFilter: selectedRecordFilter,
                        listData: listData
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


export function getBarcodeConfigFilterSubmit(map) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("barcodeconfiguration/getBarcodeConfigurationFilterSubmit", { ...map })
            .then(response => {
                let masterData = { ...map.masterData, ...response.data }

                Object.keys(map.selectedRecordFilter).map(x => {

                    if (x === "nformcode") {
                        masterData = { ...masterData, SelecetedScreen: { ...map.selectedRecordFilter[x].item } }
                    } else if (x === "ncontrolcode") {
                        masterData = { ...masterData, SelecetedControl: { ...map.selectedRecordFilter[x].item } }
                    } else {
                        if (map.selectedRecordFilter[x])
                            masterData = { ...masterData, ["Selected" + x]: { ...map.selectedRecordFilter[x].item.jsondata } }
                    }

                })

                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        loading: false, masterData, selectedRecordFilter: { ...map.selectedRecordFilter }
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


export function parentChildComboLoadForBarcode(columnList, comboData, selectedRecord,
    childColumnList, ParentComboValues,
    languagetypeCode, userinfo) {
    let comboValues = {}
    if (columnList.length > 0) {
        columnList.map((x, index) => {
            if (x.inputtype === 'combo') {
                if (comboData[x.label] && comboData[x.label].length > 0) {
                    selectedRecord[x.label] = undefined;
                    if (comboData[x.label].length > 0) {
                        if (comboData[x.label][0].label === undefined) {
                            const optionList = constructjsonOptionList(comboData[x.label] || [], x.valuemember,
                                x.displaymember, false, false, true, undefined, x.source, x.isMultiLingual, languagetypeCode, x)
                            comboData[x.label] = optionList.get("OptionList");

                        }
                    } else {
                        comboData[x.label] = []
                    }
                    comboValues = childComboLoadForBarcode(x, comboData, selectedRecord, childColumnList,
                        languagetypeCode, userinfo, selectedRecord[x.label])
                } else {
                    selectedRecord[x.label] = undefined

                    comboValues = childComboLoadForBarcode(x, comboData, selectedRecord, childColumnList,
                        languagetypeCode, userinfo, selectedRecord[x.label])

                }
            }
        })
    }
    else {
        comboValues = {
            "comboData": comboData,
            "selectedRecord": selectedRecord
        }
    }

    return comboValues;
}



export function childComboLoadForBarcode(x, comboData, selectedRecord, childColumnList,
    languagetypeCode, userinfo, ParentComboValues) {
    if (selectedRecord[x.label] !== undefined) {
        if (x.hasOwnProperty("child")) {
            x.child.map(y => {
                const index = childColumnList[x.label].findIndex(z => z.label === y.label)
                if (index !== -1) {
                    if (childColumnList[x.label][index].inputtype === 'combo' && childColumnList[x.label][index].readonly === true) {
                        selectedRecord = {
                            ...selectedRecord,
                            [childColumnList[x.label][index].label]: {
                                label: ParentComboValues.item.jsondata ?
                                    ParentComboValues.item.jsondata[childColumnList[x.label][index].displaymember] :
                                    ParentComboValues.item[childColumnList[x.label][index].displaymember] || "",
                                value: ParentComboValues.item.jsondata ?
                                    ParentComboValues.item.jsondata[childColumnList[x.label][index].valuemember] :
                                    ParentComboValues.item[childColumnList[x.label][index].valuemember] || -1
                            }
                        }
                    }
                    else if (comboData[y.label] && comboData[y.label].length > 0) {
                        if (comboData[y.label][0].label === undefined) {
                            const optionChildList = constructjsonOptionList(comboData[y.label] || [], childColumnList[x.label][index].valuemember,
                                childColumnList[x.label][index].displaymember, false, false, true, undefined, childColumnList[x.label][index].source, y.isMultiLingual, languagetypeCode, y)
                            comboData[y.label] = optionChildList.get("OptionList");

                            selectedRecord[y.label] = undefined

                        } else {
                            selectedRecord[y.label] = undefined
                        }
                    } else {
                        selectedRecord[y.label] = undefined
                        comboData[y.label] = []
                        const newRecord1 = childComboLoadForBarcode(childColumnList[x.label][index], comboData, selectedRecord, childColumnList, userinfo.slanguagetypecode, userinfo, selectedRecord[y.label])
                        selectedRecord = { ...selectedRecord, ...newRecord1.selectedRecord }
                        comboData = { ...comboData, ...newRecord1.comboData }
                    }
                }

            })
        }
    }
    else {
        if (x.hasOwnProperty("child")) {
            x.child.map(y => {
                selectedRecord[y.label] = undefined
                const index = childColumnList[x.label] && childColumnList[x.label].findIndex(z => z.label === y.label)
                if (index !== undefined && index !== -1) {
                    comboData[y.label] = undefined
                    const newRecord1 = childComboLoadForBarcode(childColumnList[x.label][index], comboData, selectedRecord, childColumnList)
                    selectedRecord = { ...selectedRecord, ...newRecord1.selectedRecord }
                    comboData = { ...comboData, ...newRecord1.comboData }
                }
            })
        }
    }
    const newRecord = {
        "comboData": comboData,
        "selectedRecord": selectedRecord
    }
    return newRecord;
}



export function getOpenModalForBarcodeConfig(map) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("barcodeconfiguration/getOpenModalForBarcodeConfig", {
            'nformcode': map.nformcode, 'ncontrolcode': map.ncontrolcode,
            'nquerybuildertablecode': map.nquerybuildertablecode,
            'userinfo': map.userInfo, nbarcodetemplatecode: map.nbarcodetemplatecode,
            lastLevelCode: map.lastLevelCode
        })
            .then(response => {

                const barcodeList = constructOptionList(response.data.Barcode || [], 'nbarcode', 'sbarcodename').get('OptionList');
                // if (map.nsqlqueryneed) {

                //     const masterData = { ...map.masterData, Barcode: barcodeList, BarcodeParameter: [] }

                //     map={...map,masterData, ndesigntemplatemappingcode: response.data.DesignTempateMapping.ndesigntemplatemappingcode}

                //     dispatch(getSqlColumns(map))

                // } else {

                let masterData = {}
                if (map.nfiltersqlqueryneed) {
                    const SqlQuery = constructOptionList(response.data.SqlQuery || [], 'nsqlquerycode', 'ssqlqueryname').get('OptionList');
                    masterData = { ...map.masterData, Barcode: barcodeList, SqlQuery: SqlQuery, BarcodeParameter: [] }
                } else {
                    const mappingList = constructOptionList(response.data.MappingFileds || [], 'columnname', 'columnname').get('OptionList');
                    masterData = { ...map.masterData, Barcode: barcodeList, MappingFileds: mappingList, BarcodeParameter: [] }
                }

                if (map.nsqlqueryneed) {

                    const mappingList = constructOptionList(response.data.SqlQueryParamMappingFileds || [], 'columnname', 'columnname').get('OptionList');

                    if (map.nfiltersqlqueryneed === false) {

                        // const SqlQueryParam = constructOptionList(response.data.SqlQueryParam || [], 'columnname', 'columnname').get('OptionList');

                        const SqlQueryParam = response.data.SqlQueryParam ||[] //.map(x => { return { "label": x, "value": x } }) || []

                        masterData = { ...map.masterData,...masterData, SqlQueryParam: SqlQueryParam, SqlQueryParamMappingFileds: mappingList }

                    } else masterData = { ...map.masterData,...masterData, SqlQueryParam: [], SqlQueryParamMappingFileds: mappingList }
                } else masterData = { ...map.masterData,...masterData, SqlQueryParam: [], SqlQueryParamMappingFileds: [] }


                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        loading: false, openModal: true, masterData,
                        operation: "create",
                        ndesigntemplatemappingcode: response.data.DesignTempateMapping.ndesigntemplatemappingcode,
                        selectedRecord: {},
                        screenName: map.screenName
                    }
                })
                //  }


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



export function getSqlColumns(map) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("barcodeconfiguration/createsqltable", {
            nsqlquerycode: map.nsqlquerycode
            , 'userinfo': map.userInfo
        }).then(response => {
            const mappingList = constructOptionList(response.data.MappingFileds || [], 'columnname', 'columnname').get('OptionList');

            const masterData = { ...map.masterData, MappingFileds: mappingList }
            dispatch({
                type: DEFAULT_RETURN, payload: {
                    loading: false, openModal: true, masterData,
                    operation: "create", ndesigntemplatemappingcode: map.ndesigntemplatemappingcode, selectedRecord: {}
                }
            })

        })
            .catch(error => {
                //console.log(error)
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



export function getBarcodeFileParameter(map) {
    return function (dispatch) {
        dispatch(initRequest(true));

        let data = {}
        if (map.nfiltersqlqueryneed) {
            data = { nsqlquerycode: map.selectedRecord.nsqlquerycode.value }
        }

        rsapi().post("barcodeconfiguration/getBarcodeFileParameter", {
            'nbarcode': map.selectedRecord.nbarcode.value, 'ssystemfilename': map.selectedRecord.nbarcode.item.ssystemfilename,
            'userinfo': map.userinfo, nfiltersqlqueryneed: map.nfiltersqlqueryneed, ...data
        })
            .then(response => {
                let masterData = { ...map.masterData, BarcodeParameter: response.data.Parameter }

                const selectedRecord={...map.selectedRecord}

                if (map.nfiltersqlqueryneed) {

                    const mappingList = constructOptionList(response.data.MappingFileds || [], 'columnname', 'columnname').get('OptionList');

                    const SqlQueryParam = response.data.SqlQueryParam ||[] //.map(x => { return { "label": x, "value": x } }) || []


                    SqlQueryParam.map(x => { selectedRecord[x]="" }) 

                    masterData = { ...masterData, MappingFileds: mappingList, SqlQueryParam: SqlQueryParam }

                }

                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        loading: false, masterData, selectedRecord: map.selectedRecord
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


export function getEditBarcodeConfigurationComboService(addParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("barcodeconfiguration/getEditBarcodeConfigurationModal", {
            nbarcodeconfigurationcode: addParam.nbarcodeconfigurationcode
            , 'userinfo': addParam.userinfo
        }).then(response => {
            let selectedRecord = {};

            const barcodeConfiguration = response.data.SelectedBarcodeConfig

            selectedRecord['nbarcode'] = { label: barcodeConfiguration.sbarcodename, value: barcodeConfiguration.nbarcode, item: { ssystemfilename: barcodeConfiguration.ssystemfilename } }

            const mappingList = constructOptionList(response.data.MappingFileds || [], 'columnname', 'columnname').get('OptionList');

            const BarcodeParameter = []

            if (barcodeConfiguration.jsondata.parameterMapping) {
                selectedRecord['columnname'] = barcodeConfiguration.jsondata.parameterMapping

                Object.keys(barcodeConfiguration.jsondata.parameterMapping
                ).map(x => {
                    BarcodeParameter.push(x)
                    selectedRecord[x] = { ...mappingList.filter(y => y.value === barcodeConfiguration.jsondata.parameterMapping[x])[0] }
                })

            }

            let SqlQuery = []
            if (barcodeConfiguration.jsondatabt.nfiltersqlqueryneed) {
                selectedRecord['nsqlquerycode'] = { label: barcodeConfiguration.ssqlqueryname, value: barcodeConfiguration.nfiltersqlquerycode, item: {} }
                SqlQuery = constructOptionList(response.data.SqlQuery || [], 'nsqlquerycode', 'ssqlqueryname').get('OptionList');
            }


            let SqlQueryParamMappingFileds = []
            let SqlQueryParam = []

            if (barcodeConfiguration.jsondatabt.nsqlqueryneed) {

                SqlQueryParamMappingFileds = constructOptionList(response.data.SqlQueryParamMappingFileds || [], 'columnname', 'columnname').get('OptionList');

                if (barcodeConfiguration.jsondatabt.nfiltersqlqueryneed === false) {

                    SqlQueryParam = response.data.SqlQueryParam ||[] //.map(x => { return { "label": x, "value": x } }) || []
                   
                    SqlQueryParam.map(x => { 

                        if( SqlQueryParamMappingFileds.filter(y=>y.value === barcodeConfiguration.jsondata["SqlQueryParamMapping"][x]).length>0){

                            selectedRecord[x]=SqlQueryParamMappingFileds.filter(y=>y.value === barcodeConfiguration.jsondata["SqlQueryParamMapping"][x])[0]
                        }

                     }) 
                  
                }
            }

            const masterData = { ...addParam.masterData, Barcode: [], MappingFileds: mappingList, BarcodeParameter, SqlQuery: SqlQuery, SqlQueryParamMappingFileds, SqlQueryParam }
            dispatch({
                type: DEFAULT_RETURN, payload: {
                    loading: false,
                    ncontrolcode: addParam.controlId,
                    openModal: true,
                    operation: 'update',
                    masterData,
                    selectedRecord,
                    ndesigntemplatemappingcode: response.data.ndesigntemplatemappingcode,

                }
            })
        })
            .catch(error => {
               // console.log(error)
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







export function getBarcodeConfigurationDetail(barcodeConfiguration, userinfo, masterData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("barcodeconfiguration/getBarcodeConfiguration", {
            nbarcodeconfigurationcode: barcodeConfiguration.nbarcodeconfigurationcode
            , 'userinfo': userinfo
        }).then(response => {
            masterData = { ...masterData, ...response.data }
            dispatch({
                type: DEFAULT_RETURN, payload: {
                    loading: false,
                    masterData,
                }
            })
        })
            .catch(error => {
                //console.log(error)
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
