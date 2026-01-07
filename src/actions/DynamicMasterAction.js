
import rsapi from '../rsapi';
import { DEFAULT_RETURN, UN_AUTHORIZED_ACCESS } from './LoginTypes';
import { toast } from 'react-toastify';
import { intl } from '../components/App';
import { initRequest } from './LoginAction';
import {
    constructOptionList, parentChildComboLoad, constructjsonOptionList,
     rearrangeDateFormatforUI, childComboLoadForEdit
} from '../components/CommonScript';
import Axios from 'axios';
import { getTreeByProduct } from './RegistrationAction';

export function getDynamicMasterCombo(masterData, userinfo,
    editId, columnList, selectedRecord, childColumnList, comboComponents,
    withoutCombocomponent, openPortal, openModal, mapOfFilterRegData, preview, operation,
    screenName) {
    return function (dispatch) {
        dispatch(initRequest(true));
        const timeZoneService = rsapi().post("timezone/getTimeZone");
        const actualService = rsapi().post("dynamicpreregdesign/getComboValues", {
            parentcolumnlist: columnList.filter(x=>(x.inputtype!=='backendsearchfilter'&&x.inputtype!=='frontendsearchfilter')&&(x.readonly!==true)),
            childcolumnlist: childColumnList,
            userinfo
        })
        let urlArray = [timeZoneService, actualService];
        //const operation = fetchRecordParam.operation;
        // if (operation === "update"){
        //     const url = "dynamicmaster/getActiveDynamicMasterById";
        //     urlArray.push(rsapi().post(url, {
        //       [fetchRecordParam.primaryKeyField]: fetchRecordParam.primaryKeyValue, "userinfo": fetchRecordParam.userInfo
        //     }));
        // }
        Axios.all(urlArray)
            .then(response => {
                const timeZoneMap = constructOptionList(response[0].data || [], "ntimezonecode", "stimezoneid", undefined, undefined, true);
                const timeZoneList = timeZoneMap.get("OptionList");
                const defaultTimeZone = { label: userinfo.stimezoneid, value: userinfo.ntimezonecode }
                // if (operation === "update"){
                //     selectedRecord = response[2].data;
                // }
                const newcomboData = parentChildComboLoad(columnList.filter(x=>(x.inputtype!=='backendsearchfilter'&&x.inputtype!=='frontendsearchfilter')&&(x.readonly!==true)), response[1].data, selectedRecord, childColumnList,
                    withoutCombocomponent, undefined, userinfo.slanguagetypecode, userinfo)
                // sortData(masterData)

                const comboData1 = newcomboData.comboData
                const selectedRecord1 = newcomboData.selectedRecord
                withoutCombocomponent.map(componentrow => {
                    if (componentrow.inputtype === "date") {
                        if (componentrow.mandatory) {
                            selectedRecord1[componentrow.label] = componentrow.loadcurrentdate ? new Date() : "";
                        }
                    }
                    else if (componentrow.inputtype === "radio"
                    ||componentrow.inputtype === "checkbox"
                    ||componentrow.inputtype === "predefineddropdown") {

                        if(componentrow['radiodefaultvalue']){
                            if(componentrow.inputtype === "checkbox"){

                                let val= ''
                                componentrow.radiodefaultvalue &&
                                componentrow.radiodefaultvalue.length>0&& componentrow.radiodefaultvalue.map((x,i)=>{
                                    val=val+ (i===componentrow.radiodefaultvalue.length-1?x.label: x.label+',')
                                }) 

                                selectedRecord1[componentrow.label]= val

                            }else if(componentrow.inputtype === "predefineddropdown"){
                                selectedRecord1[componentrow.label] = componentrow.radiodefaultvalue ?
                                componentrow.radiodefaultvalue : "";
                            }else{
                                selectedRecord1[componentrow.label] = componentrow.radiodefaultvalue ?
                                componentrow.radiodefaultvalue.label : "";
                            }

                        }else{
                            if(componentrow.inputtype === "radio"){
                                selectedRecord1[componentrow.label] = componentrow.radioOptions ?
                                componentrow.radioOptions.tags[0].text : "";
                            }
                        }
                          
                        }
                    return null;
                })

                if (preview) {
                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {
                            timeZoneList,
                            defaultTimeZone,
                            masterData,
                            ncontrolcode: editId,
                            openModal,
                            loading: false,
                            comboData: comboData1,
                            selectedRecord: selectedRecord1,
                            comboComponents,
                            withoutCombocomponent,
                            openPortal,
                            columnList,
                            childColumnList,
                            screenName,
                            operation
                        }
                    })
                }
                else {
                    if (mapOfFilterRegData.nsampletypecode === 1) {
                        const ProductCategory = comboComponents.filter(x => x.name === 'Product Category');
                        if (ProductCategory.length > 0) {
                            const nproductcatcode = newcomboData.selectedRecord[ProductCategory[0].label] &&
                                newcomboData.selectedRecord[ProductCategory[0].label].value
                            const ncategorybasedFlow = newcomboData.selectedRecord[ProductCategory[0].label]
                                && newcomboData.selectedRecord[ProductCategory[0].label]['item']['jsondata']['ncategorybasedflow'];
                            if (ncategorybasedFlow !== undefined) {
                                if (ncategorybasedFlow === 3) {
                                    mapOfFilterRegData['nproductcode'] = -1;
                                    mapOfFilterRegData['nproductcatcode'] = nproductcatcode
                                    const inputParam = {
                                        timeZoneList,
                                        defaultTimeZone,
                                        masterData,
                                        ncontrolcode: editId,
                                        openModal,
                                        comboComponents,
                                        withoutCombocomponent,
                                        openPortal,
                                        columnList,
                                        childColumnList,
                                        operation,
                                        screenName
                                    }
                                    dispatch(getTreeByProduct(mapOfFilterRegData,
                                        newcomboData.selectedRecord,
                                        newcomboData.comboData, inputParam))
                                }
                                else {
                                    const Product = comboComponents.filter(x => x.name === 'Product');
                                    if (Product.length > 0) {
                                        const nproductcode = newcomboData.selectedRecord[Product[0].label]
                                            && newcomboData.selectedRecord[Product[0].label].value;

                                        mapOfFilterRegData['nproductcode'] = nproductcode !== undefined ? nproductcode : -1;
                                        mapOfFilterRegData['nproductcatcode'] = nproductcatcode

                                        const inputParam = {
                                            timeZoneList,
                                            defaultTimeZone,
                                            masterData,
                                            ncontrolcode: editId,
                                            openModal,
                                            comboComponents,
                                            withoutCombocomponent,
                                            openPortal,
                                            columnList,
                                            childColumnList,
                                            operation,
                                            screenName
                                        }
                                        dispatch(getTreeByProduct(mapOfFilterRegData,
                                            newcomboData.selectedRecord,
                                            newcomboData.comboData, inputParam))
                                    } else {
                                        dispatch({
                                            type: DEFAULT_RETURN,
                                            payload: {
                                                timeZoneList,
                                                defaultTimeZone,
                                                masterData,
                                                ncontrolcode: editId,
                                                openModal,
                                                loading: false,
                                                comboData: newcomboData.comboData,
                                                selectedRecord: newcomboData.selectedRecord,
                                                comboComponents,
                                                withoutCombocomponent,
                                                openPortal,
                                                columnList,
                                                childColumnList,
                                                operation,
                                                screenName
                                            }
                                        })
                                    }
                                }

                            } else {
                                dispatch({
                                    type: DEFAULT_RETURN,
                                    payload: {
                                        timeZoneList,
                                        defaultTimeZone,
                                        masterData,
                                        ncontrolcode: editId,
                                        openModal,
                                        loading: false,
                                        comboData: newcomboData.comboData,
                                        selectedRecord: newcomboData.selectedRecord,
                                        comboComponents,
                                        withoutCombocomponent,
                                        openPortal,
                                        columnList,
                                        childColumnList,
                                        operation,
                                        screenName
                                    }
                                })
                            }
                        } else {
                            dispatch({
                                type: DEFAULT_RETURN,
                                payload: {
                                    timeZoneList,
                                    defaultTimeZone,
                                    masterData,
                                    ncontrolcode: editId,
                                    openModal,
                                    loading: false,
                                    comboData: newcomboData.comboData,
                                    selectedRecord: newcomboData.selectedRecord,
                                    comboComponents,
                                    withoutCombocomponent,
                                    openPortal,
                                    operation,
                                    screenName
                                }
                            })
                        }
                    } else if (mapOfFilterRegData.nsampletypecode === 2) {
                        const InstrumentCategory = comboComponents.filter(x => x.name === 'Instrument Category');
                        if (InstrumentCategory.length > 0) {
                            const ninstrumentcatcode = newcomboData.selectedRecord[InstrumentCategory[0].label] &&
                                newcomboData.selectedRecord[InstrumentCategory[0].label].value
                            const ncategorybasedFlow = newcomboData.selectedRecord[InstrumentCategory[0].label]
                                && newcomboData.selectedRecord[InstrumentCategory[0].label]['item']['jsondata']['ncategorybasedflow'];
                            if (ncategorybasedFlow !== undefined) {
                                if (ncategorybasedFlow === 3) {
                                    mapOfFilterRegData['nproductcode'] = -1;
                                    mapOfFilterRegData['nproductcatcode'] = ninstrumentcatcode
                                    const inputParam = {
                                        timeZoneList,
                                        defaultTimeZone,
                                        masterData,
                                        ncontrolcode: editId,
                                        openModal,
                                        comboComponents,
                                        withoutCombocomponent,
                                        openPortal,
                                        columnList,
                                        childColumnList,
                                        operation,
                                        screenName
                                    }
                                    dispatch(getTreeByProduct(mapOfFilterRegData,
                                        newcomboData.selectedRecord,
                                        newcomboData.comboData, inputParam))
                                }
                                else {
                                    const Instrument = comboComponents.filter(x => x.name === 'Instrument');
                                    if (Instrument.length > 0) {
                                        const ninstrumentcode = newcomboData.selectedRecord[Instrument[0].label]
                                            && newcomboData.selectedRecord[Instrument[0].label].value;

                                        mapOfFilterRegData['nproductcode'] = ninstrumentcode !== undefined ? ninstrumentcode : -1;
                                        mapOfFilterRegData['nproductcatcode'] = ninstrumentcatcode

                                        const inputParam = {
                                            timeZoneList,
                                            defaultTimeZone,
                                            masterData,
                                            ncontrolcode: editId,
                                            openModal,
                                            comboComponents,
                                            withoutCombocomponent,
                                            openPortal,
                                            columnList,
                                            childColumnList,
                                            operation,
                                            screenName
                                        }
                                        dispatch(getTreeByProduct(mapOfFilterRegData,
                                            newcomboData.selectedRecord,
                                            newcomboData.comboData, inputParam))
                                    } else {
                                        dispatch({
                                            type: DEFAULT_RETURN,
                                            payload: {
                                                timeZoneList,
                                                defaultTimeZone,
                                                masterData,
                                                ncontrolcode: editId,
                                                openModal,
                                                loading: false,
                                                comboData: newcomboData.comboData,
                                                selectedRecord: newcomboData.selectedRecord,
                                                comboComponents,
                                                withoutCombocomponent,
                                                openPortal,
                                                columnList,
                                                childColumnList,
                                                operation,
                                                screenName
                                            }
                                        })
                                    }
                                }

                            } else {
                                dispatch({
                                    type: DEFAULT_RETURN,
                                    payload: {
                                        timeZoneList,
                                        defaultTimeZone,
                                        masterData,
                                        ncontrolcode: editId,
                                        openModal,
                                        loading: false,
                                        comboData: newcomboData.comboData,
                                        selectedRecord: newcomboData.selectedRecord,
                                        comboComponents,
                                        withoutCombocomponent,
                                        openPortal,
                                        columnList,
                                        childColumnList,
                                        operation,
                                        screenName
                                    }
                                })
                            }
                        } else {
                            dispatch({
                                type: DEFAULT_RETURN,
                                payload: {
                                    timeZoneList,
                                    defaultTimeZone,
                                    masterData,
                                    ncontrolcode: editId,
                                    openModal,
                                    loading: false,
                                    comboData: newcomboData.comboData,
                                    selectedRecord: newcomboData.selectedRecord,
                                    comboComponents,
                                    withoutCombocomponent,
                                    openPortal,
                                    operation,
                                    screenName
                                }
                            })
                        }
                    } else if (mapOfFilterRegData.nsampletypecode === 3) {
                        const MaterialType = comboComponents.filter(x => x.name === 'Material Type');
                        if (MaterialType.length > 0) {
                            const nmaterialtypecode = newcomboData.selectedRecord[MaterialType[0].label] &&
                                newcomboData.selectedRecord[MaterialType[0].label].value
                            if (nmaterialtypecode !== undefined) {
                                const MaterialCategory = comboComponents.filter(x => x.name === 'Material Category');
                                if (MaterialCategory.length > 0) {
                                    const nmaterialcatcode = newcomboData.selectedRecord[MaterialCategory[0].label] &&
                                        newcomboData.selectedRecord[MaterialCategory[0].label].value
                                    const ncategorybasedFlow = newcomboData.selectedRecord[MaterialCategory[0].label]
                                        && newcomboData.selectedRecord[MaterialCategory[0].label]['item']['jsondata']['ncategorybasedflow'];
                                    if (ncategorybasedFlow !== undefined) {
                                        if (ncategorybasedFlow === 3) {
                                            mapOfFilterRegData['nproductcode'] = -1;
                                            mapOfFilterRegData['nproductcatcode'] = nmaterialcatcode
                                            const inputParam = {
                                                timeZoneList,
                                                defaultTimeZone,
                                                masterData,
                                                ncontrolcode: editId,
                                                openModal,
                                                comboComponents,
                                                withoutCombocomponent,
                                                openPortal,
                                                columnList,
                                                childColumnList,
                                                operation,
                                                screenName
                                            }
                                            dispatch(getTreeByProduct(mapOfFilterRegData,
                                                newcomboData.selectedRecord,
                                                newcomboData.comboData, inputParam))
                                        }
                                        else {
                                            const Material = comboComponents.filter(x => x.name === 'Material');
                                            if (Material.length > 0) {
                                                const nmaterialcode = newcomboData.selectedRecord[Material[0].label]
                                                    && newcomboData.selectedRecord[Material[0].label].value;

                                                mapOfFilterRegData['nproductcode'] = nmaterialcode !== undefined ? nmaterialcode : -1;
                                                mapOfFilterRegData['nproductcatcode'] = nmaterialcatcode

                                                const inputParam = {
                                                    timeZoneList,
                                                    defaultTimeZone,
                                                    masterData,
                                                    ncontrolcode: editId,
                                                    openModal,
                                                    comboComponents,
                                                    withoutCombocomponent,
                                                    openPortal,
                                                    columnList,
                                                    childColumnList,
                                                    operation,
                                                    screenName
                                                }
                                                dispatch(getTreeByProduct(mapOfFilterRegData,
                                                    newcomboData.selectedRecord,
                                                    newcomboData.comboData, inputParam))
                                            } else {
                                                dispatch({
                                                    type: DEFAULT_RETURN,
                                                    payload: {
                                                        timeZoneList,
                                                        defaultTimeZone,
                                                        masterData,
                                                        ncontrolcode: editId,
                                                        openModal,
                                                        loading: false,
                                                        comboData: newcomboData.comboData,
                                                        selectedRecord: newcomboData.selectedRecord,
                                                        comboComponents,
                                                        withoutCombocomponent,
                                                        openPortal,
                                                        columnList,
                                                        childColumnList,
                                                        operation,
                                                        screenName
                                                    }
                                                })
                                            }
                                        }

                                    } else {
                                        dispatch({
                                            type: DEFAULT_RETURN,
                                            payload: {
                                                timeZoneList,
                                                defaultTimeZone,
                                                masterData,
                                                ncontrolcode: editId,
                                                openModal,
                                                loading: false,
                                                comboData: newcomboData.comboData,
                                                selectedRecord: newcomboData.selectedRecord,
                                                comboComponents,
                                                withoutCombocomponent,
                                                openPortal,
                                                columnList,
                                                childColumnList,
                                                operation,
                                                screenName
                                            }
                                        })
                                    }
                                } else {
                                    dispatch({
                                        type: DEFAULT_RETURN,
                                        payload: {
                                            timeZoneList,
                                            defaultTimeZone,
                                            masterData,
                                            ncontrolcode: editId,
                                            openModal,
                                            loading: false,
                                            comboData: newcomboData.comboData,
                                            selectedRecord: newcomboData.selectedRecord,
                                            comboComponents,
                                            withoutCombocomponent,
                                            openPortal,
                                            operation,
                                            screenName
                                        }
                                    })
                                }

                            }

                        } else {
                            dispatch({
                                type: DEFAULT_RETURN,
                                payload: {
                                    timeZoneList,
                                    defaultTimeZone,
                                    masterData,
                                    ncontrolcode: editId,
                                    openModal,
                                    loading: false,
                                    comboData: newcomboData.comboData,
                                    selectedRecord: newcomboData.selectedRecord,
                                    comboComponents,
                                    withoutCombocomponent,
                                    openPortal,
                                    columnList,
                                    childColumnList,
                                    operation,
                                    screenName
                                }
                            })
                        }

                    }
                    else {
                    }
                }
            })
            .catch(error => {
               // console.log("error:", error);
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
            })
    }
}

export function getEditDynamicMasterCombo(inputParam, columnList,
    selectedRecord1, childColumnList, comboComponents, withoutCombocomponent) {
    return function (dispatch) {

       // console.log("input:", inputParam);
        dispatch(initRequest(true));
        const { userInfo } = { ...inputParam };

        let urlArray = [];

        const timeZoneService = rsapi().post("timezone/getTimeZone");
        // const actualService = rsapi().post("dynamicpreregdesign/getComboValues", {
        //     parentcolumnlist: columnList,
        //     childcolumnlist: childColumnList,
        //     userinfo: inputParam.userInfo
        // })
        const selectedMaster = rsapi().post("/dynamicmaster/getActiveDynamicMasterById", {
            "userinfo": inputParam.userInfo,
            [inputParam.primaryKeyField]: inputParam.primaryKeyValue,
            parentcolumnlist: columnList,
            childcolumnlist: childColumnList,
        })

        urlArray = [timeZoneService, selectedMaster]

        Axios.all(urlArray)
            .then(response => {
               // let selectedRecord = { ...response[1].data };
                let selectedRecord = { ...response[1].data["EditData"] };
                // selectedRecord = { ...selectedRecord, ...selectedRecord['jsondata'] }
               // console.log("selectedRecord:", selectedRecord);

                const timeZoneMap = constructOptionList(response[0].data || [], "ntimezonecode", "stimezoneid", undefined, undefined, true);
                const timeZoneList = timeZoneMap.get("OptionList");
                const defaultTimeZone = { label: userInfo.stimezoneid, value: userInfo.ntimezonecode };

                const languagetypeCode = undefined;
                const comboData = response[1].data;
                delete comboData['EditData']
                let comboValues = {}
                if (columnList.length > 0) {
                    columnList.map(x => {
                        if (x.inputtype === 'combo') {
                            if (comboData[x.label] && comboData[x.label].length > 0) //&& comboData[x.label][0].hasOwnProperty(x.source) 
                            {
                                if (comboData[x.label].length > 0) {
                                    if (comboData[x.label][0].label === undefined) {
                                        const optionList = constructjsonOptionList(comboData[x.label] || [], x.valuemember,
                                            x.displaymember, false, false, true, undefined, x.source, x.isMultiLingual, languagetypeCode, x)
                                        comboData[x.label] = optionList.get("OptionList");
                                    } else {
                                        comboData[x.label] = comboData[x.label]
                                        // const optionList = constructjsonOptionDefault(comboData[x.label] || [], x.valuemember,
                                        //     x.displaymember, false, false, true, undefined, x.source, x.isMultiLingual, languagetypeCode, x)
                                    }
                                } else {
                                    comboData[x.label] = []
                                }

                                comboValues = childComboLoadForEdit(x, comboData, selectedRecord,
                                    childColumnList, withoutCombocomponent)
                            } else {
                                comboValues = {
                                    "comboData": comboData,
                                }
                            }
                        } else {
                            comboValues = {
                                comboData: comboData,
                                ...comboValues
                            }
                        }
                    })
                }
                else {
                    comboValues = {
                        "comboData": comboData,
                    }
                }

                if (withoutCombocomponent.length > 0) {
                    withoutCombocomponent.map(item => {
                        if (item.inputtype === "date") {
                            if (selectedRecord[item.label]) {
                                selectedRecord = { ...selectedRecord, [item.label]: rearrangeDateFormatforUI(userInfo, selectedRecord[item.label]) }
                            }
                        }
                    })
                }

                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        operation: "update",
                        screenName: inputParam.screenName,
                        timeZoneList,
                        defaultTimeZone,
                        selectedRecord,
                        openModal: true,
                        ncontrolCode: inputParam.ncontrolCode,
                        loading: false,
                        comboData: comboValues.comboData,
                        childColumnList, comboComponents,
                        withoutCombocomponent,
                        columnList,
                        selectedId: inputParam.primaryKeyValue

                    }
                })

            })
            .catch(error => {
               // console.log("error:", error);
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
                    toast.warn(intl.formatMessage({
                        id: error.response.data
                    }));
                }
            })

    }
}