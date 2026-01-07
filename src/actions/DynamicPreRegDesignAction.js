import rsapi from '../rsapi';
import { DEFAULT_RETURN, UN_AUTHORIZED_ACCESS } from './LoginTypes';
import { toast } from 'react-toastify';
import { initRequest } from './LoginAction';
import { sortData, constructOptionList, parentChildComboLoad, rearrangeDateFormat, ageCalculate, comboChild, validateEmail, getSameRecordFromTwoArrays, removeIndex, childSpecLoadCheck, constructjsonOptionList, constructjsonOptionDefault, rearrangeDateFormatforUI, childComboLoadForEdit } from '../components/CommonScript';
import { getcomponentdata, getValidComponent, replaceChildFromChildren } from '../components/droparea/helpers';
import { ReactComponents, SampleType, transactionStatus,formCode } from '../components/Enumeration';
import Axios from 'axios';
import { getTreeByProduct } from './RegistrationAction';
import { intl } from '../components/App';

export function getReactInputFields(userinfo, operation, respObj, ncontrolCode) {

    return function (dispatch) {
        dispatch(initRequest(true));
        // console.log("respObj:", respObj);
        const listURL = [];
        listURL[0] = rsapi().post("dynamicpreregdesign/getReactComponents", { userinfo })
        listURL[1] = rsapi().post("dynamicpreregdesign/getReactInputFields", { userinfo })
        listURL[2] = rsapi().post("registrationsubtype/getPeriods", { userinfo })
        listURL[3] = rsapi().post("dynamicpreregdesign/getReactStaticFilterTables", { userinfo })
        Axios.all(listURL)
            .then(response => {
                respObj = respObj ? { ...respObj } : {}
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        ReactInputFields: response[1].data,
                        ReactComponents: response[0].data.components,
                        Period: constructOptionList(response[2].data, 'nperiodcode', 'speriodname').get("OptionList"),
                        ReactTables: constructOptionList(response[0].data.tables, 'nquerybuildertablecode', 'sdisplayname').get("OptionList"),
                        staticfiltertables: constructOptionList(response[3].data, 'nquerybuilderstaticfiltercode', 'displayname').get("OptionList"),
                        selectedFieldRecord: {},
                        openModal: false,
                        loading: false,
                        openPortal: true,
                        operation,
                        showFilter: false,
                        ncontrolcode: ncontrolCode,
                        ...respObj
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
                } else {
                    toast.warn(error.response.data);
                }
            })
    }
}

export function selectRegistrationTemplate(template, masterData, userinfo) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("dynamicpreregdesign/getRegistrationTemplateById", {
            nreactregtemplatecode: template.nreactregtemplatecode,
            userinfo
        })
            .then(response => {

                dispatch({
                    type: DEFAULT_RETURN,
                    payload: { masterData: { ...masterData, selectedTemplate: response.data }, loading: false }
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
                } else {
                    toast.warn(error.response.data);
                }
            })
    }
}

export function getDefaultTemplate(ComboData, sampleType, userInfo, masterData) {
    return function (dispatch) {
        // dispatch(initRequest(true));
        // rsapi().post("dynamicpreregdesign/getDefaultTemplate", {
        //     nsampletypecode: sampleType.value,
        //     userinfo: userInfo,
        //     SubSample:false
        // })
        let url = [];
        if (ComboData.value === SampleType.SUBSAMPLE) {
            const str = rsapi().post("dynamicpreregdesign/getDefaultSampleType", {
                userinfo: userInfo,
                nsampletypecode: sampleType.SampleType && sampleType.SampleType.value
            })
            url = [str];
        } else {
            const str = rsapi().post("dynamicpreregdesign/getDefaultTemplate", {
                nsubsampletypecode: sampleType.SubSampleType && sampleType.SubSampleType.value,
                userinfo: userInfo,
                nsampletypecode: sampleType.SampleType && sampleType.SampleType.value || masterData.selectedSampleType.nsampletypecode,
                SubSample: String(sampleType.SampleType && sampleType.SampleType.value || masterData.selectedSampleType.nsampletypecode) === '-1' ? true : false

            })
            url = [str];
        }
        dispatch(initRequest(true));
        Axios.all(url)
            .then(response => {

                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData: ComboData.value === SampleType.SUBSAMPLE ? {
                            ...masterData,
                            DefaultTemplateList: response[0].data["DefaultTemplateList"],
                            selectedDefaultTemplate: response[0].data["selectedDefaultTemplate"],
                            selectedSampleType: sampleType.SampleType.item,
                            DefaultSampleTypeList: response[0].data["SampleTypeList"],
                            selectedSampleTypeList: response[0].data["selectedSampleTypeList"],
                            // selectedSampleTypeList:sampleType.item,
                        } : {
                            ...masterData,
                            DefaultTemplateList: response[0].data["DefaultTemplateList"],
                            selectedDefaultTemplate: response[0].data["selectedDefaultTemplate"],
                            selectedSampleTypeList: sampleType.SubSampleType && sampleType.SubSampleType.item,
                            selectedSampleType: sampleType.SampleType && sampleType.SampleType.item || masterData.selectedSampleType,
                        },
                        // realSampleType: [{
                        //     "label": "IDS_SAMPLETYPE",
                        //     "value": sampleType.label,
                        //     "item": sampleType
                        // }],

                        loading: false
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
                } else {
                    toast.warn(error.response.data);
                }
            })
    }
}
// export function getDefaultSampleType(sampleType, userInfo, masterData,SampleTypeName,selectedSampleType) {
//     return function (dispatch) {
//     let url=[];
//         if(sampleType.label==="Sub Sample"){
//       const str=  rsapi().post("dynamicpreregdesign/getDefaultSampleType", {
//             userinfo: userInfo,
//             nsampletypecode: sampleType.value
//         })
//         url=[str];
//     }else{
//         const str=  rsapi().post("dynamicpreregdesign/getDefaultTemplate", {
//             nsubsampletypecode: sampleType.value,
//             userinfo: userInfo,SubSample:true,nsampletypecode:selectedSampleType.value
//         })
//         url=[str];
//     }
//     dispatch(initRequest(true));
//     Axios.all(url)
//          .then(response => {
//                 dispatch({
//                     type: DEFAULT_RETURN,
//                     payload: { masterData: sampleType.label==="Sub Sample"?{ ...masterData, 
//                                             DefaultSampleTypeList :response[0].data["SampleTypeList"],
//                                             selectedSampleTypeList: response[0].data["selectedSampleTypeList"],SampleTypeName,
//                                             selectedSampleType:sampleType.item,
//                                             DefaultTemplateList :response[0].data["DefaultTemplateList"],
//                                             selectedDefaultTemplate: response[0].data["selectedDefaultTemplate"],
//                                             //defaultTemplateOptions:[],selectedDefaultTemplate:[],DefaultTemplateList:[]
//                                             }:{ ...masterData, 
//                                                 DefaultTemplateList :response[0].data["DefaultTemplateList"],
//                                                 selectedDefaultTemplate: response[0].data["selectedDefaultTemplate"],
//                                                 selectedSampleTypeList:sampleType.item,
//                                                 }, 

//                                 loading: false }
//                 })
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
//            payload: {
//              navigation: 'forbiddenaccess',
//              loading: false,
//            }
//          });
//        } else if (error.response.status === 500) {
//                     toast.error(error.message);
//                 } else {
//                     toast.warn(error.response.data);
//                 }
//             })
//     }
// }


export function getRegistrationTemplate(selectedSampleType, selectedDefaultTemplate, masterData, userinfo, selectedDefaultSampleType) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("dynamicpreregdesign/getDynamicPreRegDesign", {
            nsampletypecode: selectedSampleType.value,
            SampleType: selectedSampleType.label,
            ndefaulttemplatecode: selectedDefaultTemplate.value,
            userinfo, SubSample: selectedSampleType.label === "Sub Sample" ? true : false,
            nsubsampletypecode: selectedDefaultSampleType.value
        })
            .then(response => {
                masterData = { ...masterData, ...response.data, searchedData: undefined,selectedDefaultTemplate:selectedDefaultTemplate.item }
                sortData(masterData)
                let realSampleTypes = [{
                    "label": "IDS_SAMPLETYPE",
                    "value": selectedSampleType.label,
                    "item": selectedSampleType
                },
                // realDefaultTemplate: [
                selectedSampleType.value === SampleType.SUBSAMPLE ? {
                    "label": "IDS_SUBSAMPLEBASEDSAMPLETYPE",
                    "value": selectedDefaultSampleType.label,
                    "item": selectedDefaultSampleType
                } : "", {
                    "label": "IDS_TEMPLATETYPE",
                    "value": selectedDefaultTemplate.label,
                    "item": selectedDefaultTemplate
                }]
                let realSampleType = [];
                realSampleTypes.map((item, index) => {
                    if (item === "") {
                        delete (realSampleTypes[index])
                    } else {
                        realSampleType.push(item)
                    }
                })
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData,
                        realSampleType,
                        loading: false,

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
                } else {
                    toast.warn(error.response.data);
                }
            })
    }
}

export function getEditRegTemplate(masterData, userinfo, editId) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("dynamicpreregdesign/getRegistrationTemplateById", {
            nreactregtemplatecode: masterData.selectedTemplate.nreactregtemplatecode,
            userinfo
        })
            .then(response => {
                let jsonData = response.data.jsondata;
                sortData(masterData)

                const respObj = {
                    masterData,
                    ncontrolcode: editId,
                    openPortal: true,
                    loading: false,
                    openModal: false,
                    design: jsonData,
                    selectedRecord: { templatename: response.data.sregtemplatename }
                }
                if (response.data.ntransactionstatus === transactionStatus.DRAFT) {
                    // let jsonData = response.data.jsondata;
                    // sortData(masterData)

                    // const respObj = {
                    //     masterData,
                    //     ncontrolcode: editId,
                    //     openPortal: true,
                    //     loading: false,
                    //     openModal: false,
                    //     design: jsonData,
                    //     selectedRecord: { templateName: response.data.sregtemplatename }
                    // }                
                    dispatch(getReactInputFields(userinfo, "update", respObj))
                }
                else {
                    dispatch(getReactInputFields(userinfo, "viewdesign", respObj))
                    // dispatch({ type: DEFAULT_RETURN, payload: { loading: false, masterStatus: "IDS_SELECTDRAFTRECORD" } })
                }
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
            })
    }
}

export function getJsonValue(PGjsonData) {

    if (Array.isArray(PGjsonData)) {
        let JSONData = [];
        PGjsonData.map(data => {
            return JSONData.push(JSON.parse(data.jsondata))
        })
        return JSONData;
    } else {
        return JSON.parse(PGjsonData);
    }

}

export function getTableColumns(design, selectedFieldRecord, stablename,
    userinfo, path, columnInfo, componentData, updateComponents, showFilter) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("dynamicpreregdesign/getTableColumns", { "nquerybuildertablecode": stablename || 0, userinfo })
            .then(response => {
                columnInfo = columnInfo || {}
                const staicColumns = response.data.jstaticcolumns || []
                const dynamicColumns = response.data.jdynamiccolumns || []
                const multilingualColumns = response.data.jmultilingualcolumn || []
                const numericColumns = response.data.jnumericcolumns || []
                const primaryKeyName = response.data.sprimarykeyname
                columnInfo = {
                    ...columnInfo,
                    [stablename]: {
                        staicColumns,
                        dynamicColumns,
                        multilingualColumns,
                        numericColumns,
                        primaryKeyName
                    }
                }
                let defaultColumn = {};
                let comboData = []
                let filterColumns = [];
               
                //  let selectedComponentpath=componentData.selectedComponentpath
                staicColumns.map(item => {
                    comboData.push({
                        label: item.displayname[userinfo.slanguagetypecode] || item.displayname['en-US'],
                        value: item.columnname,
                        type: "static",
                        item
                    })
                    if (item.default) {
                        defaultColumn = {
                            label: item.displayname[userinfo.slanguagetypecode] || item.displayname['en-US'],
                            value: item.columnname,
                            type: "static",
                            item
                        }
                    }
                })
                dynamicColumns.map(item => {
                    comboData.push({
                        label: item.displayname[userinfo.slanguagetypecode] || item.displayname['en-US'],
                        value: item.columnname,
                        type: "dynamic",
                        item
                    })
                    if (item.default) {
                        defaultColumn = {
                            label: item.displayname[userinfo.slanguagetypecode] || item.displayname['en-US'],
                            value: item.columnname,
                            type: "dynamic",
                            item
                        }
                    }
                })
                multilingualColumns.map(item => {
                    comboData.push({
                        label: item.displayname[userinfo.slanguagetypecode] || item.displayname['en-US'],
                        value: item.columnname,
                        type: "static",
                        item
                    })
                    if (item.default) {
                        defaultColumn = {
                            label: item.displayname[userinfo.slanguagetypecode] || item.displayname['en-US'],
                            value: item.columnname,
                            type: "static",
                            item
                        }
                    }
                })
                filterColumns = [...comboData];
                numericColumns.map(item => {
                    filterColumns.push({
                        label: item.displayname[userinfo.slanguagetypecode] || item.displayname['en-US'],
                        value: item.tablecolumnname,
                        type: "numeric",
                        item
                    })
                })
                if (defaultColumn.item && defaultColumn.item.ismultilingual) {
                    selectedFieldRecord['isMultiLingual'] = true;
                }
                if (updateComponents) {
                    componentData = componentData || {}
                    selectedFieldRecord = { ...selectedFieldRecord, column: defaultColumn, displaymember: defaultColumn.value, valuemember: primaryKeyName };
                    design = replaceChildFromChildren(design, path, selectedFieldRecord)
                    if (selectedFieldRecord.componentcode !== ReactComponents.COMBO
                        && selectedFieldRecord.componentcode !== ReactComponents.FRONTENDSEARCHFILTER
                        && selectedFieldRecord.componentcode !== ReactComponents.BACKENDSEARCHFILTER) {
                        let validComponents = getValidComponent(selectedFieldRecord, componentData.components, columnInfo);
                        componentData = { ...componentData, validComponents }
                    }
                } else if (componentData === undefined || componentData.components === undefined) {
                    componentData = componentData || {}
                    if (selectedFieldRecord.componentcode === ReactComponents.FRONTENDSEARCHFILTER
                        || selectedFieldRecord.componentcode === ReactComponents.BACKENDSEARCHFILTER) {
                         let  isdefaultColumn= Object.keys(defaultColumn).length>0 ? true : false;  
                        selectedFieldRecord = { ...selectedFieldRecord, filterfields:isdefaultColumn ? [{ type: defaultColumn.type, ...defaultColumn.item }] :[], customsearchfilter:isdefaultColumn?  [defaultColumn] : undefined, displaymember: defaultColumn.value, valuemember: primaryKeyName,kendoFilter:{
                            logic: "and",
                            filters: []
                        }};
                    } else {
                        selectedFieldRecord = { ...selectedFieldRecord, column: defaultColumn, displaymember: defaultColumn.value, valuemember: primaryKeyName };
                    }

                    design = replaceChildFromChildren(design, path, selectedFieldRecord)

                    if (selectedFieldRecord.componentcode !== ReactComponents.COMBO
                        && selectedFieldRecord.componentcode !== ReactComponents.FRONTENDSEARCHFILTER
                        && selectedFieldRecord.componentcode !== ReactComponents.BACKENDSEARCHFILTER) {
                        let validComponents = getValidComponent(selectedFieldRecord, componentData.components, columnInfo);
                        componentData = { ...componentData, validComponents }
                    }
                } else {
                    let validComponents = getValidComponent(selectedFieldRecord, componentData.components, columnInfo);
                    let parentRadioValue = []
                    if (selectedFieldRecord.componentcode === ReactComponents.FRONTENDSEARCHFILTER || selectedFieldRecord.componentcode === ReactComponents.BACKENDSEARCHFILTER) {
                        if (selectedFieldRecord.parentPath) {
                            let oldParentData = getcomponentdata(design, selectedFieldRecord.parentPath.split("-"))
                            if (oldParentData.hasOwnProperty('child')) {
                                oldParentData.child.map(item => {
                                    if (item.label === selectedFieldRecord.label) {
                                        parentRadioValue = oldParentData.radioOptions.tags.map(item => {
                                            return { value: item.id, label: item.text, item }
                                        })
                                    }
                                })
                            }
                        }
                    }
                    componentData = { ...componentData, validComponents, parentRadioValue }
                }

                
                columnInfo = {
                    ...columnInfo,
                    [stablename]: { ...columnInfo[stablename], tableColumn: comboData, filterColumns }
                }
                let optionalPayload = {
                    selectedComponentpath: Array.isArray(path) ? path.join("-") : undefined,
                }
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false,
                        design,
                        // selectedComponentpath,
                        selectedFieldRecord,
                        ...optionalPayload,
                        tableColumn: comboData,
                        filterColumns,
                        columnInfo,
                        primaryKeyName,
                        selectedComponentpath: componentData.path,
                        ...componentData,
                        showFilter: showFilter,
                        
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
                } else {
                    toast.warn(error.response.data);
                }
            })
    }
}

export function getForeignTableData(design, selectedFieldRecord, stablename, userinfo, path, columnInfo, componentData, updateComponents) {
    return function (dispatch) {
        let parentcolumnlist = [{
            source: selectedFieldRecord.filtercolumn.item.foriegntablename,
            valuemember: selectedFieldRecord.filtercolumn.item.foriegntablePK,
            displaymember: selectedFieldRecord.filtercolumn.item.columnname,
            conditionstring: selectedFieldRecord.filtercolumn.item.conditionstring,
            label: "filterData",
            inputtype: "combo",
            isMultiLingual: selectedFieldRecord.filtercolumn.item.ismultilingual
        }]
        rsapi().post("dynamicpreregdesign/getComboValues", { parentcolumnlist, userinfo })
            .then(response => {
                let comboData = [];
                let selectedRecord = {};
                const newcomboData = parentChildComboLoad(parentcolumnlist, response.data,
                    selectedRecord, [], [], undefined, userinfo.slanguagetypecode, userinfo)
                // sortData(masterData)

                const comboData1 = newcomboData.comboData
                const selectedRecord1 = newcomboData.selectedRecord
                if (updateComponents) {
                    componentData = componentData || {}
                    // selectedFieldRecord = { ...selectedFieldRecord };
                    design = replaceChildFromChildren(design, path, selectedFieldRecord)
                    if (selectedFieldRecord.componentcode !== ReactComponents.COMBO) {
                        let validComponents = getValidComponent(selectedFieldRecord, componentData.components, columnInfo);
                        componentData = { ...componentData, validComponents }
                    }
                }
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false,
                        design,
                        selectedFieldRecord,
                        masterDataValue: comboData,
                        columnInfo,
                        ...componentData,
                        ...comboData1
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
                } else {
                    toast.warn(error.response.data);
                }
            })
    }
}

export function getPreviewTemplate(masterData, userinfo,
    editId, columnList, selectedRecord, childColumnList, comboComponents,
    withoutCombocomponent, openPortal, openModal, mapOfFilterRegData, preview, operation, screenName,importData) {
    return function (dispatch) {
        if(mapOfFilterRegData["userInfo"]===undefined){
        mapOfFilterRegData["userInfo"]=userinfo;
        }
        dispatch(initRequest(true));
        const timeZoneService = rsapi().post("timezone/getTimeZone");
        const actualService = rsapi().post("dynamicpreregdesign/getComboValues", {
            parentcolumnlist: columnList ? columnList.filter(x => (x.inputtype !== 'backendsearchfilter' && x.inputtype !== 'frontendsearchfilter') && (x.readonly !== true)) : [],
            childcolumnlist: childColumnList ? childColumnList : [],
            userinfo
        })
        const dateService = rsapi().post("dynamicpreregdesign/dateValidation", {
            datecolumnlist: withoutCombocomponent.filter(x => x.inputtype === "date"),
            userinfo
        })

        const currentDate = rsapi().post("timezone/getLocalTimeByZone", {
            userinfo
        })
        let siteService={};
        let schedulerMasterService={};
        if(userinfo.nformcode===formCode.SCHEDULERCONFIGURATION){
             siteService = rsapi().post("schedulerconfiguration/getSiteByUser", {
                userinfo
            })

            schedulerMasterService = rsapi().post("schedulerconfiguration/getSchedulerMaster", {
                userinfo
            })
        }
        
        Axios.all([timeZoneService, actualService, dateService, currentDate,siteService,schedulerMasterService])
            .then(response => {
                const timeZoneMap = constructOptionList(response[0].data || [], "ntimezonecode", "stimezoneid", undefined, undefined, true);
                const timeZoneList = timeZoneMap.get("OptionList");
                const defaultTimeZone = { label: userinfo.stimezoneid, value: userinfo.ntimezonecode }
                const newcomboData = parentChildComboLoad(columnList.filter(x => (x.inputtype !== 'backendsearchfilter' && x.inputtype !== 'frontendsearchfilter') && (x.readonly !== true)), response[1].data, selectedRecord,
                    childColumnList, withoutCombocomponent, undefined, userinfo.slanguagetypecode, userinfo)
                // sortData(masterData)
                let siteMap=[];
                let siteList=[];
                let schedulerMap=[];
                let schedulerList=[];
                const comboData1 = newcomboData.comboData
                let selectedRecord1 = newcomboData.selectedRecord

                if(userinfo.nformcode===formCode.SCHEDULERCONFIGURATION){
                    siteMap = constructOptionList(response[4].data.userSite || [], "nsitecode", "ssitename", undefined, undefined, true);
                     siteList = siteMap.get("OptionList");


                    let SchedulerSite= siteList.filter(item=>item.value===userinfo.nsitecode);

                    if(SchedulerSite.length>0){
                        selectedRecord1={...selectedRecord1,"SchedulerSite":SchedulerSite[0]}
                    }
                    schedulerMap = constructOptionList(response[5].data.ScheduleMaster || [], "nschedulecode", "sschedulename", undefined, undefined, true);
                    schedulerList = schedulerMap.get("OptionList");


                }
                withoutCombocomponent.map(componentrow => {
                    if (componentrow.inputtype === "date") {
                        //  if (componentrow.mandatory) {
                        if (componentrow.loadcurrentdate) {
                            selectedRecord1[componentrow.label] = componentrow.loadcurrentdate ? rearrangeDateFormat(userinfo, response[3].data?.date) : "";
                            if (masterData.selectedTemplate && masterData.selectedTemplate.nsampletypecode === SampleType.CLINICALTYPE) {
                                const Age = withoutCombocomponent.filter(item =>
                                    item.name === "Age");
                                selectedRecord[Age[0].label] = ageCalculate(selectedRecord1[componentrow.label])
                            }
                            selectedRecord1[componentrow.label + "value"] = selectedRecord1[componentrow.label];
                        } else if (componentrow.nperiodcode) {
                            selectedRecord1[componentrow.label + "value"] = response[2].data[componentrow.label] ?
                                new Date(response[2].data[componentrow.label]["datevalue"]) : null;
                            if (componentrow.loadselecteddate) {
                                selectedRecord1[componentrow.label] = response[2].data[componentrow.label] ?
                                    new Date(response[2].data[componentrow.label]["datevalue"]) : null;
                            }
                            //    selectedRecord1[componentrow.label]=response[2].data[componentrow.label]?
                            //    new Date(response[2].data[componentrow.label]):null;
                        } else {
                            selectedRecord1[componentrow.label + "value"] = new Date();
                        }

                        if (componentrow.hidebeforedate) {
                            selectedRecord1[componentrow.label + "min"] = selectedRecord1[componentrow.label + "value"]
                        }
                        if (componentrow.hideafterdate) {
                            selectedRecord1[componentrow.label + "max"] = selectedRecord1[componentrow.label + "value"]
                        }

                        // }else{
                        //     selectedRecord1[componentrow.label] = componentrow.loadcurrentdate ? new Date() : "";
                        // }
                        // if (componentrow.timezone) {
                        //     sampleRegistration["jsondata"][`tz${componentrow.label}`] = selectedRecord[`tz${componentrow.label}`] ?
                        //         { value: selectedRecord[`tz${componentrow.label}`].value, label: selectedRecord[`tz${componentrow.label}`].label } :
                        //         defaulttimezone ? defaulttimezone : -1
                        // }
                    }
                    else if (componentrow.inputtype === "radio"
                        || componentrow.inputtype === "checkbox"
                        || componentrow.inputtype === "predefineddropdown") {

                        if (componentrow['radiodefaultvalue']) {
                            if (componentrow.inputtype === "checkbox") {

                                let val = ''
                                componentrow.radiodefaultvalue &&
                                    componentrow.radiodefaultvalue.length > 0 && componentrow.radiodefaultvalue.map((x, i) => {
                                        val = val + (i === componentrow.radiodefaultvalue.length - 1 ? x.label : x.label + ',')
                                    })

                                selectedRecord1[componentrow.label] = val

                            } else if (componentrow.inputtype === "predefineddropdown") {
                                selectedRecord1[componentrow.label] = componentrow.radiodefaultvalue ?
                                    componentrow.radiodefaultvalue : "";
                            } else {
                                selectedRecord1[componentrow.label] = componentrow.radiodefaultvalue ?
                                    componentrow.radiodefaultvalue.label : "";
                            }

                        } else {
                            if (componentrow.inputtype === "radio") {
                                selectedRecord1[componentrow.label] = componentrow.radioOptions ?
                                    componentrow.radioOptions.tags[0].text : "";
                            }
                        }

                    }



                })
                //console.log("selectedRecord1 action1:", selectedRecord1);
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
                            operation: "preview",
                            importData,
                            siteList,
                            schedulerList

                            // childOperation:true
                        }
                    })
                }
                else {
                    if (mapOfFilterRegData.nsampletypecode === SampleType.PRODUCT) {
                        const ProductCategory = comboComponents.filter(x => x.name === 'Product Category');
                        if (ProductCategory.length > 0) {
                            const nproductcatcode = selectedRecord1[ProductCategory[0].label] &&
                                selectedRecord1[ProductCategory[0].label].value;
                            let ncategorybasedFlow = selectedRecord1[ProductCategory[0].label]
                                && selectedRecord1[ProductCategory[0].label]['item'] && selectedRecord1[ProductCategory[0].label]['item']['jsondata']['ncategorybasedflow'];
                            if (mapOfFilterRegData.sampletypecategorybasedflow === transactionStatus.YES) {
                                ncategorybasedFlow = transactionStatus.YES;
                            }
                            if (ncategorybasedFlow !== undefined) {
                                if (ncategorybasedFlow === transactionStatus.YES) {
                                    mapOfFilterRegData['nproductcode'] = -1;
                                    mapOfFilterRegData['nproductcatcode'] = nproductcatcode;
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
                                        screenName,
                                        importData,
                                        siteList,
                                        schedulerList
                                        // loadPreregister:true
                                    }
                                    dispatch(getTreeByProduct(mapOfFilterRegData,
                                        selectedRecord1,
                                        newcomboData.comboData, inputParam))
                                }
                                else {
                                    const Product = comboComponents.filter(x => x.name === 'Product');
                                    if (Product.length > 0) {
                                        const nproductcode = selectedRecord1[Product[0].label]
                                            && selectedRecord1[Product[0].label].value;

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
                                            screenName,
                                            importData
                                            // loadPreregister:true
                                        }
                                        dispatch(getTreeByProduct(mapOfFilterRegData,
                                            selectedRecord1,
                                            newcomboData.comboData, inputParam))
                                    } else {
                                        mapOfFilterRegData['nproductcode'] = -1;
                                        mapOfFilterRegData['nproductcatcode'] = -1
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
                                            screenName,
                                            importData
                                            //loadPreregister:true
                                        }
                                        dispatch(getTreeByProduct(mapOfFilterRegData,
                                            selectedRecord1,
                                            newcomboData.comboData, inputParam))
                                    }
                                }

                            } else {
                                mapOfFilterRegData['nproductcode'] = -1;
                                mapOfFilterRegData['nproductcatcode'] = -1
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
                                    screenName,
                                    importData,
                                    siteList,
                                    schedulerList
                                    //loadPreregister:true
                                }
                                dispatch(getTreeByProduct(mapOfFilterRegData,
                                    selectedRecord1,
                                    newcomboData.comboData, inputParam))
                            }
                        } else {
                            mapOfFilterRegData['nproductcode'] = -1;
                            mapOfFilterRegData['nproductcatcode'] = -1
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
                                screenName,
                                importData
                                //loadPreregister:true
                            }
                            //console.log("selectedRecord1 action2:", selectedRecord1);
                            dispatch(getTreeByProduct(mapOfFilterRegData,
                                selectedRecord1,
                                newcomboData.comboData, inputParam))
                        }
                    } else if (mapOfFilterRegData.nsampletypecode === SampleType.INSTRUMENT) {
                        const InstrumentCategory = comboComponents.filter(x => x.name === 'Instrument Category');
                        if (InstrumentCategory.length > 0) {
                            const ninstrumentcatcode = selectedRecord1[InstrumentCategory[0].label] &&
                                selectedRecord1[InstrumentCategory[0].label].value
                            let ncategorybasedFlow = selectedRecord1[InstrumentCategory[0].label]
                                && selectedRecord1[InstrumentCategory[0].label]['item']['jsondata']['ncategorybasedflow'];

                            if (mapOfFilterRegData.sampletypecategorybasedflow === transactionStatus.YES) {
                                ncategorybasedFlow = transactionStatus.YES;
                            }
                            if (ncategorybasedFlow !== undefined) {
                                if (ncategorybasedFlow === transactionStatus.YES) {
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
                                        screenName,
                                        importData,siteList,
                                        schedulerList
                                        // loadPreregister:true
                                    }
                                    dispatch(getTreeByProduct(mapOfFilterRegData,
                                        selectedRecord1,
                                        newcomboData.comboData, inputParam))
                                }
                                else {
                                    const Instrument = comboComponents.filter(x => x.name === 'Instrument');
                                    if (Instrument.length > 0) {
                                        const ninstrumentcode = selectedRecord1[Instrument[0].label]
                                            && selectedRecord1[Instrument[0].label].value;

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
                                            screenName,
                                            importData,
                                            siteList,
                                            schedulerList
                                            //loadPreregister:true
                                        }
                                        dispatch(getTreeByProduct(mapOfFilterRegData,
                                            selectedRecord1,
                                            newcomboData.comboData, inputParam))
                                    } else {
                                        mapOfFilterRegData['nproductcode'] = -1;
                                        mapOfFilterRegData['nproductcatcode'] = -1
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
                                            screenName,
                                            importData
                                            //loadPreregister:true
                                        }
                                        dispatch(getTreeByProduct(mapOfFilterRegData,
                                            selectedRecord1,
                                            newcomboData.comboData, inputParam))
                                    }
                                }

                            } else {
                                mapOfFilterRegData['nproductcode'] = -1;
                                mapOfFilterRegData['nproductcatcode'] = -1
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
                                    screenName,
                                    importData,
                                    siteList,
                                    schedulerList
                                    // loadPreregister:true
                                }
                                dispatch(getTreeByProduct(mapOfFilterRegData,
                                    selectedRecord1,
                                    newcomboData.comboData, inputParam))
                            }
                        } else {
                            mapOfFilterRegData['nproductcode'] = -1;
                            mapOfFilterRegData['nproductcatcode'] = -1
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
                                screenName,
                                importData,
                                siteList,
                                schedulerList
                                // loadPreregister:true
                            }
                            dispatch(getTreeByProduct(mapOfFilterRegData,
                                selectedRecord1,
                                newcomboData.comboData, inputParam))
                        }
                    } else if (mapOfFilterRegData.nsampletypecode === SampleType.MATERIAL) {
                        const MaterialType = comboComponents.filter(x => x.name === 'Material Type');
                        if (MaterialType.length > 0) {
                            const nmaterialtypecode = selectedRecord1[MaterialType[0].label] &&
                                selectedRecord1[MaterialType[0].label].value
                            if (nmaterialtypecode !== undefined) {
                                const MaterialCategory = comboComponents.filter(x => x.name === 'Material Category');
                                if (MaterialCategory.length > 0) {
                                    const nmaterialcatcode = selectedRecord1[MaterialCategory[0].label] &&
                                        selectedRecord1[MaterialCategory[0].label].value
                                    let ncategorybasedFlow = selectedRecord1[MaterialCategory[0].label]
                                        && selectedRecord1[MaterialCategory[0].label]['item']['jsondata']['ncategorybasedflow'];

                                    if (mapOfFilterRegData.sampletypecategorybasedflow === transactionStatus.YES) {
                                        ncategorybasedFlow = transactionStatus.YES;
                                    }
                                    if (ncategorybasedFlow !== undefined) {
                                        if (ncategorybasedFlow === transactionStatus.YES) {
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
                                                screenName,
                                                importData
                                                // loadPreregister:true
                                            }
                                            dispatch(getTreeByProduct(mapOfFilterRegData,
                                                selectedRecord1,
                                                newcomboData.comboData, inputParam))
                                        }
                                        else {
                                            const Material = comboComponents.filter(x => x.name === 'Material');
                                            if (Material.length > 0) {
                                                const nmaterialcode = selectedRecord1[Material[0].label]
                                                    && selectedRecord1[Material[0].label].value;

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
                                                    screenName,
                                                    importData
                                                    // loadPreregister:true
                                                }
                                                dispatch(getTreeByProduct(mapOfFilterRegData,
                                                    selectedRecord1,
                                                    newcomboData.comboData, inputParam))
                                            } else {
                                                mapOfFilterRegData['nproductcode'] = -1;
                                                mapOfFilterRegData['nproductcatcode'] = -1
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
                                                    screenName,
                                                    importData
                                                    //loadPreregister:true
                                                }
                                                dispatch(getTreeByProduct(mapOfFilterRegData,
                                                    selectedRecord1,
                                                    newcomboData.comboData, inputParam))
                                            }
                                        }

                                    } else {
                                        mapOfFilterRegData['nproductcode'] = -1;
                                        mapOfFilterRegData['nproductcatcode'] = -1
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
                                            screenName,
                                            importData
                                            // loadPreregister:true
                                        }
                                        dispatch(getTreeByProduct(mapOfFilterRegData,
                                            selectedRecord1,
                                            newcomboData.comboData, inputParam))
                                    }
                                } else {
                                    mapOfFilterRegData['nproductcode'] = -1;
                                    mapOfFilterRegData['nproductcatcode'] = -1
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
                                        screenName,
                                        importData
                                        //loadPreregister:true
                                    }
                                    dispatch(getTreeByProduct(mapOfFilterRegData,
                                        selectedRecord1,
                                        newcomboData.comboData, inputParam))
                                }

                            }

                        } else {
                            mapOfFilterRegData['nproductcode'] = -1;
                            mapOfFilterRegData['nproductcatcode'] = -1
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
                                screenName,
                                importData
                                // loadPreregister:true
                            }
                            dispatch(getTreeByProduct(mapOfFilterRegData,
                                selectedRecord1,
                                newcomboData.comboData, inputParam))
                        }

                    }
                    else if (mapOfFilterRegData.nsampletypecode === SampleType.CLINICALTYPE) {
                        const ProductCategory = comboComponents.filter(x => x.name === 'Product Category');
                        const dateComp = withoutCombocomponent.filter(item => item.name === "Date Of Birth");
                        if (dateComp[0].label !== undefined) {
                            const ageComp = withoutCombocomponent.filter(item => item.name === "Age");
                            const age = ageCalculate(selectedRecord1[dateComp[0].label]);
                            selectedRecord1[ageComp[0].label] = age;
                        }
                        if (ProductCategory.length > 0) {
                            const nproductcatcode = selectedRecord1[ProductCategory[0].label] ?
                                selectedRecord1[ProductCategory[0].label].value : -1;
                            let ncategorybasedFlow = selectedRecord1[ProductCategory[0].label]
                                ? selectedRecord1[ProductCategory[0].label]['item']['jsondata']['ncategorybasedflow']
                                : undefined;
                            if (mapOfFilterRegData.sampletypecategorybasedflow === transactionStatus.YES) {
                                ncategorybasedFlow = transactionStatus.YES;
                            }
                            if (ncategorybasedFlow !== undefined) {
                                if (ncategorybasedFlow === transactionStatus.YES) {
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
                                        screenName,
                                        importData
                                        // loadPreregister:true
                                    }
                                    dispatch(getTreeByProduct(mapOfFilterRegData,
                                        selectedRecord1,
                                        newcomboData.comboData, inputParam))
                                }
                                else {
                                    const Product = comboComponents.filter(x => x.name === 'Product');
                                    if (Product.length > 0) {
                                        const nproductcode = selectedRecord1[Product[0].label]
                                            && selectedRecord1[Product[0].label].value;

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
                                            screenName,
                                            importData
                                            // loadPreregister:true
                                        }
                                        dispatch(getTreeByProduct(mapOfFilterRegData,
                                            selectedRecord1,
                                            newcomboData.comboData, inputParam))
                                    } else {
                                        mapOfFilterRegData['nproductcode'] = -1;
                                        mapOfFilterRegData['nproductcatcode'] = -1
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
                                            screenName,
                                            importData
                                            //loadPreregister:true
                                        }
                                        dispatch(getTreeByProduct(mapOfFilterRegData,
                                            selectedRecord1,
                                            newcomboData.comboData, inputParam))
                                    }
                                }

                            } else {
                                mapOfFilterRegData['nproductcode'] = -1;
                                mapOfFilterRegData['nproductcatcode'] = -1
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
                                    screenName,
                                    importData
                                    //loadPreregister:true
                                }
                                dispatch(getTreeByProduct(mapOfFilterRegData,
                                    selectedRecord1,
                                    newcomboData.comboData, inputParam))
                            }
                        } else {
                            mapOfFilterRegData['nproductcode'] = -1;
                            mapOfFilterRegData['nproductcatcode'] = -1
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
                                screenName,
                                importData
                                //loadPreregister:true
                            }
                            //console.log("selectedRecord1 action2:", selectedRecord1);
                            dispatch(getTreeByProduct(mapOfFilterRegData,
                                selectedRecord1,
                                newcomboData.comboData, inputParam))
                        }
                    }
                    else if (mapOfFilterRegData.nsampletypecode === SampleType.PROJECTSAMPLETYPE) {
                        const ProductCategory = comboComponents.filter(x => x.name === 'Product Category');
                        const project = comboComponents.filter(x => x.name === 'Project Code');
                        let nprojectMasterCode = -1;
                        if (project && project.length > 0 && mapOfFilterRegData['nprojectSpecReqd'] == transactionStatus.YES) {
                            nprojectMasterCode = selectedRecord1[project[0].label] &&
                                selectedRecord1[project[0].label].value;
                        }

                        if (ProductCategory.length > 0) {
                            const nproductcatcode = selectedRecord1[ProductCategory[0].label] &&
                                selectedRecord1[ProductCategory[0].label].value;
                            let ncategorybasedFlow = selectedRecord1[ProductCategory[0].label]
                                && selectedRecord1[ProductCategory[0].label]['item']['jsondata']['ncategorybasedflow'];
                            if (mapOfFilterRegData.sampletypecategorybasedflow === transactionStatus.YES) {
                                ncategorybasedFlow = transactionStatus.YES;
                            }

                            if (ncategorybasedFlow !== undefined) {
                                if (ncategorybasedFlow === 3) {
                                    mapOfFilterRegData['nproductcode'] = -1;
                                    mapOfFilterRegData['nproductcatcode'] = nproductcatcode;
                                    mapOfFilterRegData['nprojectmastercode'] = nprojectMasterCode || -1;
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
                                        screenName,
                                        importData
                                        // loadPreregister:true
                                    }
                                    dispatch(getTreeByProduct(mapOfFilterRegData,
                                        selectedRecord1,
                                        newcomboData.comboData, inputParam))
                                }
                                else {
                                    const Product = comboComponents.filter(x => x.name === 'Product');
                                    if (Product.length > 0) {
                                        const nproductcode = selectedRecord1[Product[0].label]
                                            && selectedRecord1[Product[0].label].value;

                                        mapOfFilterRegData['nproductcode'] = nproductcode !== undefined ? nproductcode : -1;
                                        mapOfFilterRegData['nproductcatcode'] = nproductcatcode;
                                        mapOfFilterRegData['nprojectmastercode'] = nprojectMasterCode || -1;

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
                                            screenName,
                                            importData
                                            // loadPreregister:true
                                        }
                                        dispatch(getTreeByProduct(mapOfFilterRegData,
                                            selectedRecord1,
                                            newcomboData.comboData, inputParam))
                                    } else {
                                        mapOfFilterRegData['nproductcode'] = -1;
                                        mapOfFilterRegData['nproductcatcode'] = -1;
                                        mapOfFilterRegData['nprojectmastercode'] = nprojectMasterCode || -1;
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
                                            screenName,
                                            importData
                                            //loadPreregister:true
                                        }
                                        dispatch(getTreeByProduct(mapOfFilterRegData,
                                            selectedRecord1,
                                            newcomboData.comboData, inputParam))
                                    }
                                }

                            } else {
                                mapOfFilterRegData['nproductcode'] = -1;
                                mapOfFilterRegData['nproductcatcode'] = -1;
                                mapOfFilterRegData['nprojectmastercode'] = nprojectMasterCode || -1;
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
                                    screenName,
                                    importData
                                    //loadPreregister:true
                                }
                                dispatch(getTreeByProduct(mapOfFilterRegData,
                                    selectedRecord1,
                                    newcomboData.comboData, inputParam))
                            }
                        }
                        else {
                            mapOfFilterRegData['nproductcode'] = -1;
                            mapOfFilterRegData['nproductcatcode'] = -1;
                            mapOfFilterRegData['nprojectmastercode'] = nprojectMasterCode || -1;
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
                                screenName,
                                importData
                                //loadPreregister:true
                            }
                            //console.log("selectedRecord1 action2:", selectedRecord1);
                            dispatch(getTreeByProduct(mapOfFilterRegData,
                                selectedRecord1,
                                newcomboData.comboData, inputParam))
                        }
                    }else if(mapOfFilterRegData.nsampletypecode === SampleType.GOODSIN){

                        

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
                            operation,
                            importData

                        }
                        })
                    //Added by sonia on 11th NOV 2024 for jira id:ALPD-5025    
                    }else if(mapOfFilterRegData.nsampletypecode === SampleType.PROTOCOL){                         

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
                            operation,
                            importData

                    }
                        })
                    }
                    else if(mapOfFilterRegData.nsampletypecode === SampleType.STABILITY){   
                        const ProductCategory = comboComponents.filter(x => x.name === 'Product Category');
                        if (ProductCategory.length > 0) {
                            const nproductcatcode = selectedRecord1[ProductCategory[0].label] &&
                                selectedRecord1[ProductCategory[0].label].value;
                            let ncategorybasedFlow = selectedRecord1[ProductCategory[0].label]
                                && selectedRecord1[ProductCategory[0].label]['item'] && selectedRecord1[ProductCategory[0].label]['item']['jsondata']['ncategorybasedflow'];
                            if (mapOfFilterRegData.sampletypecategorybasedflow === transactionStatus.YES) {
                                ncategorybasedFlow = transactionStatus.YES;
                            }
                            if (ncategorybasedFlow !== undefined) {
                                if (ncategorybasedFlow === transactionStatus.YES) {
                                    mapOfFilterRegData['nproductcode'] = -1;
                                    mapOfFilterRegData['nproductcatcode'] = nproductcatcode;
                                    mapOfFilterRegData['nsampletypecode']=SampleType.PRODUCT;
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
                                        screenName,
                                        importData,
                                        siteList,
                                        schedulerList
                                        // loadPreregister:true
                                    }
                                    dispatch(getTreeByProduct(mapOfFilterRegData,
                                        selectedRecord1,
                                        newcomboData.comboData, inputParam))
                                }
                                else {
                                    const Product = comboComponents.filter(x => x.name === 'Product');
                                    if (Product.length > 0) {
                                        const nproductcode = selectedRecord1[Product[0].label]
                                            && selectedRecord1[Product[0].label].value;

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
                                            screenName,
                                            importData
                                            // loadPreregister:true
                }
                                        dispatch(getTreeByProduct(mapOfFilterRegData,
                                            selectedRecord1,
                                            newcomboData.comboData, inputParam))
                                    } else {
                                        mapOfFilterRegData['nproductcode'] = -1;
                                        mapOfFilterRegData['nproductcatcode'] = -1
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
                                            screenName,
                                            importData
                                            //loadPreregister:true
                                        }
                                        dispatch(getTreeByProduct(mapOfFilterRegData,
                                            selectedRecord1,
                                            newcomboData.comboData, inputParam))
                                    }
                                }

                            } else {
                                mapOfFilterRegData['nproductcode'] = -1;
                                mapOfFilterRegData['nproductcatcode'] = -1
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
                                    screenName,
                                    importData,
                                    siteList,
                                    schedulerList
                                    //loadPreregister:true
                                }
                                dispatch(getTreeByProduct(mapOfFilterRegData,
                                    selectedRecord1,
                                    newcomboData.comboData, inputParam))
                            }
                        } else {
                            mapOfFilterRegData['nproductcode'] = -1;
                            mapOfFilterRegData['nproductcatcode'] = -1
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
                                screenName,
                                importData
                                //loadPreregister:true
                            }
                            //console.log("selectedRecord1 action2:", selectedRecord1);
                            dispatch(getTreeByProduct(mapOfFilterRegData,
                                selectedRecord1,
                                newcomboData.comboData, inputParam))
                        }
                    }


                }
            })
            .catch(error => {
                //console.log("error:", error);
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

export function getChildValues(inputParem,
    userinfo, selectedRecord, comboData, parentcolumnlist,
    childcolumnlist, withoutCombocomponent, parentListWithReadonly,
    productCategory, product, mapOfRegFilterData,
    instrumentCategory, instrument, materialCategory,
    material, materialType, subsample, project, comboComponents) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post('dynamicpreregdesign/getChildValues', {
            child: inputParem.child,
            parentdata: inputParem.item.jsondata,
            parentsource: inputParem.source,
            [inputParem.primarykeyField]: inputParem.value,
            valuemember: inputParem.primarykeyField,
            childcolumnlist,
            userinfo,
            parentcolumnlist,
            isInstrumentScheduler:(userinfo.nformcode===formCode.SCHEDULERCONFIGURATION && mapOfRegFilterData.nsampletypecode===2 &&inputParem.primarykeyField==='ninstrumentcatcode' )
            ?true:false,
            nregionalsitecode:(userinfo.nformcode===formCode.SCHEDULERCONFIGURATION && mapOfRegFilterData.nsampletypecode===2&&inputParem.primarykeyField==='ninstrumentcatcode')?selectedRecord.SchedulerSite.value:-1
           // dependedMemberValue:inputParem.parentDataValue
        })
            .then(response => {
                let returnObj = { ...comboData, ...response.data }
                // ALPD-3793 
                if(mapOfRegFilterData == undefined){
                 mapOfRegFilterData = {}
                }
                // ALPD-3673 VISHAKH
                mapOfRegFilterData["userInfo"] = userinfo; 
                returnObj = parentChildComboLoad(parentListWithReadonly, returnObj,
                    selectedRecord, childcolumnlist,
                    withoutCombocomponent, inputParem,
                    userinfo.slanguagetypecode, userinfo, comboComponents)
                selectedRecord = { ...selectedRecord, ...returnObj.selectedRecord }
                if (subsample) {
                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {
                            loading: false,
                            SubSamplecomboData: { ...returnObj.comboData },
                            selectComponent: selectedRecord,
                            screenName: inputParem.screenName,
                            selectedMaster: [],
                            addMaster: false,
                            selectedControl: [],
                            masterComboColumnFiled: [],
                            masterDesign: [],
                            masterextractedColumnList: [],
                            masterfieldList: [],
                            masterdataList: [],
                            mastercomboComponents: [],
                            masterwithoutCombocomponent: [],
                            masterIndex: undefined,
                            loadCustomSearchFilter: false,
                        }
                    })
                }
                // else if (childSpec) {

                //     if (mapOfRegFilterData.nsampletypecode === SampleType.PROJECTSAMPLETYPE && mapOfRegFilterData.nprojectSpecReqd === 3) {

                //     }
                //     else if (mapOfRegFilterData.nsampletypecode === SampleType.CLINICALTYPE) {
                //         if (mapOfRegFilterData.childSpecBasedAddMaster
                //             && mapOfRegFilterData.childSpecBasedAddMaster) {
                //             if (mapOfRegFilterData.ProductCategory[0]
                //                 && selectedRecord[mapOfRegFilterData.ProductCategory[0].label]===undefined) {

                //                 selectedRecord[mapOfRegFilterData.ProductCategory[0].label]=returnObj[mapOfRegFilterData.ProductCategory[0].label]&&returnObj[mapOfRegFilterData.ProductCategory[0].label][0]

                //             }
                //             const label = mapOfRegFilterData.ProductCategory[0].label

                //             let ncategorybasedflow = selectedRecord[label] &&
                //                 selectedRecord[label]['item']['jsondata']['ncategorybasedflow'];

                //             if (ncategorybasedflow === transactionStatus.YES) {
                //                 mapOfRegFilterData['nproductcatcode'] = selectedRecord[label].value
                //                 mapOfRegFilterData['nproductcode'] = -1
                //                 dispatch(getTreeByProduct(mapOfRegFilterData, selectedRecord, { ...returnObj.comboData }));
                //             }

                //         }
                //         else if (mapOfRegFilterData.ProductCategory && mapOfRegFilterData.ProductCategory[0]
                //             && selectedRecord[mapOfRegFilterData.ProductCategory[0].label]) {
                //             const label = mapOfRegFilterData.ProductCategory[0].label

                //             let ncategorybasedflow = selectedRecord[label] &&
                //                 selectedRecord[label]['item']['jsondata']['ncategorybasedflow'];

                //             if (ncategorybasedflow === transactionStatus.YES) {
                //                 mapOfRegFilterData['nproductcatcode'] = selectedRecord[label].value
                //                 mapOfRegFilterData['nproductcode'] = -1
                //                 dispatch(getTreeByProduct(mapOfRegFilterData, selectedRecord, { ...returnObj.comboData }));
                //             }
                //             else {
                //                 if (mapOfRegFilterData.ProductCategory[0].child && mapOfRegFilterData.ProductCategory[0].child) {
                //                     let pt = []
                //                     mapOfRegFilterData.ProductCategory[0].child.map(x =>
                //                         pt = comboComponents1.filter(y => y.label === x.label && y.name === 'Product')
                //                     )
                //                     if (pt.length > 0) {
                //                         if (pt && pt[0]) {
                //                             const pclabel = mapOfRegFilterData.ProductCategory[0].label
                //                             const label = pt[0].label
                //                             if (selectedRecord[pclabel] && selectedRecord[pclabel].value &&
                //                                 selectedRecord[label] && selectedRecord[label].value) {
                //                                 mapOfRegFilterData['nproductcatcode'] = selectedRecord[pclabel].value
                //                                 mapOfRegFilterData['nproductcode'] = selectedRecord[label].value
                //                                 dispatch(getTreeByProduct(mapOfRegFilterData, selectedRecord, { ...returnObj.comboData }));
                //                             }
                //                         }
                //                     }

                //                 }

                //             }
                //         } else if (mapOfRegFilterData.childSpec && mapOfRegFilterData.childSpec) {
                //             if (selectedRecord[inputParem.label] && selectedRecord[inputParem.label]) {
                //                 const TemplateChild = parentcolumnlist && parentcolumnlist.filter(x => x.child && x.child.length > 0)
                //                 if (TemplateChild && TemplateChild.length > 0) {
                //                     let pc = {}
                //                     TemplateChild.map(x => {
                //                         x.child && x.child.map(y => {
                //                             const data = comboComponents1.filter(x => x.label === y.label)
                //                             if (data && data[0].templatemandatory) {
                //                                 const name = data[0].name
                //                                 if (name === "Product Category") {
                //                                     pc = data[0]
                //                                 }
                //                             }
                //                         })
                //                     })

                //                     if (pc && pc.label) {
                //                         if (selectedRecord[pc.label]
                //                             && selectedRecord[pc.label].value) {

                //                             let ncategorybasedflow = selectedRecord[pc.label] &&
                //                                 selectedRecord[pc.label]['item']['jsondata']['ncategorybasedflow'];

                //                             if (ncategorybasedflow === transactionStatus.YES) {
                //                                 mapOfRegFilterData['nproductcatcode'] = selectedRecord[pc.label].value
                //                                 mapOfRegFilterData['nproductcode'] = -1
                //                                 dispatch(getTreeByProduct(mapOfRegFilterData, selectedRecord, { ...returnObj.comboData }));
                //                             } else {
                //                                 if (pc.child && pc.child > 0) {
                //                                     let pt = []
                //                                     pc.child.map(x =>
                //                                         pt = comboComponents1.filter(y => y.label === x.label && y.name === 'Product')
                //                                     )
                //                                     if (pt.length > 0) {
                //                                         if (selectedRecord[pt[0].label] && selectedRecord[pt[0].label].value) {
                //                                             mapOfRegFilterData['nproductcatcode'] = selectedRecord[pc.label].value
                //                                             mapOfRegFilterData['nproductcode'] = selectedRecord[pt[0].label].value
                //                                             dispatch(getTreeByProduct(mapOfRegFilterData, selectedRecord, { ...returnObj.comboData }));
                //                                         }
                //                                     }
                //                                 }

                //                             }

                //                         }
                //                     }
                //                 } else {
                //                     selectedRecord["nallottedspeccode"] = ""
                //                     selectedRecord["sversion"] = ""
                //                     dispatch({
                //                         type: DEFAULT_RETURN,
                //                         payload: {
                //                             loading: false,
                //                             comboData: { ...returnObj.comboData },
                //                             selectedRecord,
                //                             AgaramTree: [],
                //                             ActiveKey: [],
                //                             FocusKey: [],
                //                             OpenNodes: [],
                //                             Test: [],
                //                             SelectedTest: [],
                //                             selectedSpec: {},
                //                             Component: [],
                //                             selectComponent: {},
                //                             selectedComponent: {},
                //                             Specification: [],
                //                             selectedMaster: [],
                //                             subSampleDataGridList: []
                //                         }
                //                     })
                //                 }
                //             } else {
                //                 selectedRecord["nallottedspeccode"] = ""
                //                 selectedRecord["sversion"] = ""
                //                 dispatch({
                //                     type: DEFAULT_RETURN,
                //                     payload: {
                //                         loading: false,
                //                         comboData: { ...returnObj.comboData },
                //                         selectedRecord,
                //                         AgaramTree: [],
                //                         ActiveKey: [],
                //                         FocusKey: [],
                //                         OpenNodes: [],
                //                         Test: [],
                //                         SelectedTest: [],
                //                         selectedSpec: {},
                //                         Component: [],
                //                         selectComponent: {},
                //                         selectedComponent: {},
                //                         Specification: [],
                //                         selectedMaster: [],
                //                         subSampleDataGridList: []
                //                     }
                //                 })
                //             }


                //         }
                //         else {
                //             selectedRecord["nallottedspeccode"] = ""
                //             selectedRecord["sversion"] = ""
                //             dispatch({
                //                 type: DEFAULT_RETURN,
                //                 payload: {
                //                     loading: false,
                //                     comboData: { ...returnObj.comboData },
                //                     selectedRecord,
                //                     AgaramTree: [],
                //                     ActiveKey: [],
                //                     FocusKey: [],
                //                     OpenNodes: [],
                //                     Test: [],
                //                     SelectedTest: [],
                //                     selectedSpec: {},
                //                     Component: [],
                //                     selectComponent: {},
                //                     selectedComponent: {},
                //                     Specification: [],
                //                     selectedMaster: [],
                //                     subSampleDataGridList: []
                //                 }
                //             })
                //         }
                //     }
                // }
                else if (project) {
                    //console.log("data:", mapOfRegFilterData, selectedRecord );
                    dispatch(getTreeByProduct(mapOfRegFilterData, selectedRecord, { ...returnObj.comboData }));
                }
                else if (productCategory) {
                    dispatch(getTreeByProduct(mapOfRegFilterData, selectedRecord, { ...returnObj.comboData }));
                }
                else if (product) {
                    if (selectedRecord[inputParem.nameofdefaultcomp === "Product" ? inputParem.label : inputParem.ProductName]) {
                        mapOfRegFilterData["nproductcode"] = selectedRecord[inputParem.nameofdefaultcomp === "Product" ? inputParem.label : inputParem.ProductName] ? selectedRecord[inputParem.nameofdefaultcomp === "Product" ? inputParem.label : inputParem.ProductName].value : -1
                        dispatch(getTreeByProduct(mapOfRegFilterData, selectedRecord, { ...returnObj.comboData }))
                    } else {
                        selectedRecord["nallottedspeccode"] = ""
                        selectedRecord["sversion"] = ""
                        dispatch({
                            type: DEFAULT_RETURN,
                            payload: {
                                loading: false,
                                comboData: { ...returnObj.comboData },
                                selectedRecord,
                                AgaramTree: [],
                                ActiveKey: [],
                                FocusKey: [],
                                OpenNodes: [],
                                Test: [],
                                SelectedTest: [],
                                selectedSpec: {},
                                Component: [],
                                selectComponent: {},
                                selectedComponent: {},
                                Specification: [],
                                selectedMaster: [],
                                subSampleDataGridList: []
                            }
                        })
                    }
                }
                else if (instrumentCategory) {
                    dispatch(getTreeByProduct(mapOfRegFilterData, selectedRecord, { ...returnObj.comboData }))
                }
                else if (materialCategory) {
                    dispatch(getTreeByProduct(mapOfRegFilterData, selectedRecord, { ...returnObj.comboData }))
                }
                else if (instrument) {
                    if (selectedRecord[inputParem.nameofdefaultcomp === "Instrument Name" ? inputParem.label : inputParem.InstrumentName]) {
                        mapOfRegFilterData["nproductcode"] = selectedRecord[inputParem.nameofdefaultcomp === "Instrument Name" ?
                            inputParem.label : inputParem.InstrumentName] ? selectedRecord[inputParem.nameofdefaultcomp === "Instrument Name" ? inputParem.label : inputParem.InstrumentName].value : -1
                        dispatch(getTreeByProduct(mapOfRegFilterData, selectedRecord, { ...returnObj.comboData }))
                    } else {
                        selectedRecord["nallottedspeccode"] = ""
                        selectedRecord["sversion"] = ""
                        dispatch({
                            type: DEFAULT_RETURN,
                            payload: {
                                loading: false,
                                comboData: { ...returnObj.comboData },
                                selectedRecord,
                                AgaramTree: [],
                                ActiveKey: [],
                                FocusKey: [],
                                OpenNodes: [],
                                Test: [],
                                SelectedTest: [],
                                selectedSpec: {},
                                Component: [],
                                selectComponent: {},
                                selectedComponent: {},
                                Specification: [],
                                selectedMaster: [],
                                addMaster: false
                            }
                        })
                    }
                }
                else if (material) {
                    if (selectedRecord[inputParem.nameofdefaultcomp === "Material" ? inputParem.label : inputParem.MaterialName]) {
                        mapOfRegFilterData["nproductcode"] = selectedRecord[inputParem.nameofdefaultcomp === "Material" ?
                            inputParem.label : inputParem.MaterialName] ? selectedRecord[inputParem.nameofdefaultcomp === "Material" ? inputParem.label : inputParem.MaterialName].value : -1
                        dispatch(getTreeByProduct(mapOfRegFilterData, selectedRecord, { ...returnObj.comboData }))
                    } else {
                        selectedRecord["nallottedspeccode"] = ""
                        selectedRecord["sversion"] = ""
                        dispatch({
                            type: DEFAULT_RETURN,
                            payload: {
                                loading: false,
                                comboData: { ...returnObj.comboData },
                                selectedRecord,
                                AgaramTree: [],
                                ActiveKey: [],
                                FocusKey: [],
                                OpenNodes: [],
                                Test: [],
                                SelectedTest: [],
                                selectedSpec: {},
                                Component: [],
                                selectComponent: {},
                                selectedComponent: {},
                                Specification: [],
                                selectedMaster: [],
                                addMaster: false
                            }
                        })
                    }
                }
                else if (materialType) {
                    if (selectedRecord[inputParem.nameofdefaultcomp === "Material Type" ? inputParem.MaterialCategoryName : inputParem.label]) {
                        const productCategory = selectedRecord[inputParem.nameofdefaultcomp === "Material Type" ?
                            inputParem.MaterialCategoryName : inputParem.label] ? selectedRecord[inputParem.nameofdefaultcomp === "Material Type" ?
                                inputParem.MaterialCategoryName : inputParem.label] : undefined

                        //  mapOfRegFilterData["nproductcatcode"]
                        if (productCategory !== undefined) {
                            if (productCategory.item.ncategorybasedflow === 3||
                               // ALPD-5474 added the condition by neeraj 
                                //Sample Registration and Schedular Configuration --> In spefic scenario spec is not loading.
                                (productCategory.item.jsondata &&productCategory.item.jsondata.ncategorybasedflow === 3)) {
                                mapOfRegFilterData["nproductcatcode"] = productCategory.value
                                mapOfRegFilterData["nproductcode"] = -1
                                dispatch(getTreeByProduct(mapOfRegFilterData, selectedRecord, { ...returnObj.comboData }))
                            } else {

                                const product = selectedRecord[inputParem.nameofdefaultcomp === "Material Type" ?
                                    inputParem.MaterialName : inputParem.label] ? selectedRecord[inputParem.nameofdefaultcomp === "Material Type" ?
                                        inputParem.MaterialName : inputParem.label] : undefined
                                if (product !== undefined) {
                                    mapOfRegFilterData["nproductcatcode"] = productCategory.value
                                    mapOfRegFilterData["nproductcode"] = product.value
                                    dispatch(getTreeByProduct(mapOfRegFilterData, selectedRecord, { ...returnObj.comboData }))
                                } else {

                                    const product = selectedRecord[inputParem.nameofdefaultcomp === "MaterialType" ?
                                        inputParem.MaterialName : inputParem.label] ? selectedRecord[inputParem.nameofdefaultcomp === "MaterialType" ?
                                            inputParem.MaterialName : inputParem.label] : undefined
                                    if (product !== undefined) {
                                        mapOfRegFilterData["nproductcatcode"] = productCategory.value
                                        mapOfRegFilterData["nproductcode"] = product.value
                                        dispatch(getTreeByProduct(mapOfRegFilterData, selectedRecord, { ...returnObj.comboData }))
                                    } else {
                                        selectedRecord["nallottedspeccode"] = ""
                                        selectedRecord["sversion"] = ""
                                        dispatch({
                                            type: DEFAULT_RETURN,
                                            payload: {
                                                loading: false,
                                                comboData: { ...returnObj.comboData },
                                                selectedRecord,
                                                AgaramTree: [],
                                                ActiveKey: [],
                                                FocusKey: [],
                                                OpenNodes: [],
                                                Test: [],
                                                SelectedTest: [],
                                                selectedSpec: {},
                                                Component: [],
                                                selectComponent: {},
                                                selectedComponent: {},
                                                Specification: [],
                                                selectedMaster: [],
                                                addMaster: false
                                            }
                                        })
                                    }
                                }

                            }
                        } else {
                            selectedRecord["nallottedspeccode"] = ""
                            selectedRecord["sversion"] = ""
                            dispatch({
                                type: DEFAULT_RETURN,
                                payload: {
                                    loading: false,
                                    comboData: { ...returnObj.comboData },
                                    selectedRecord,
                                    AgaramTree: [],
                                    ActiveKey: [],
                                    FocusKey: [],
                                    OpenNodes: [],
                                    Test: [],
                                    SelectedTest: [],
                                    selectedSpec: {},
                                    Component: [],
                                    selectComponent: {},
                                    selectedComponent: {},
                                    Specification: [],
                                    selectedMaster: [],
                                    addMaster: false
                                }
                            })
                        }
                    } else {
                        selectedRecord["nallottedspeccode"] = ""
                        selectedRecord["sversion"] = ""
                        dispatch({
                            type: DEFAULT_RETURN,
                            payload: {
                                loading: false,
                                comboData: { ...returnObj.comboData },
                                selectedRecord,
                                AgaramTree: [],
                                ActiveKey: [],
                                FocusKey: [],
                                OpenNodes: [],
                                Test: [],
                                SelectedTest: [],
                                selectedSpec: {},
                                Component: [],
                                selectComponent: {},
                                selectedComponent: {},
                                Specification: [],
                                selectedMaster: [],
                                addMaster: false
                            }
                        })
                    }
                }
                else {

                    let productCategory = false
                    let map = {}
                    if (userinfo.nformcode === 43) {
                        if (mapOfRegFilterData.nsampletypecode === SampleType.CLINICALTYPE || mapOfRegFilterData.nsampletypecode === SampleType.PRODUCT ) {
                            if (inputParem.child && inputParem.child.length > 0) {
                                inputParem.child.map(y => {
                                    const indexTemplateMandatory = parentcolumnlist.findIndex(z => z.label === y.label && z.templatemandatory && (z.name === 'Product Category' || z.name === 'Product'))
                                    if (indexTemplateMandatory !== -1) {
                                        const templateManRecord = parentcolumnlist[indexTemplateMandatory]
                                        //  if (inputParem.nsampletypecode === SampleType.CLINICALTYPE) {
                                        if (templateManRecord.name === 'Product Category') {
                                            productCategory = true
                                            if (selectedRecord[templateManRecord.label]) {
                                                map = {
                                                    nproductcatcode: selectedRecord[templateManRecord.label].value,
                                                    nproductcode: map.nproductcode ||-1
                                                }
                                            } 
                                        }
                                            else if (templateManRecord.name === 'Product') {
                                                productCategory = true
                                                if (selectedRecord[templateManRecord.label]) {
                                                    map = {
                                                        nproductcatcode: map.nproductcatcode || -1,
                                                        nproductcode: selectedRecord[templateManRecord.label].value,
                                                    }
                                                }
                                            }
                                                else {
                                                map = {
                                                    nproductcatcode: -1,
                                                    nproductcode: -1
                                                }
                                            }
                                            //  }
                                        

                                    } else {
                                        const indexTemplateMandatory = parentcolumnlist.findIndex(z => z.label === y.label)
                                        if (indexTemplateMandatory !== -1) {
                                            const templateManRecord = parentcolumnlist[indexTemplateMandatory]
                                            if (templateManRecord.child && templateManRecord.child.length > 0) {
                                                const val = childSpecLoadCheck(templateManRecord, childcolumnlist, productCategory, map, y.label, selectedRecord)
                                                if (val.productCategory) {
                                                    productCategory = val.productCategory
                                                    map = { ...map, ...val.map }
                                                }
                                            }
                                        }
                                    }

                                })
                            }

                            if (productCategory) {
								//ALPD-5678--Added by Vignesh R(10-04-2025)-->Sample Registration --> In Etica clinical type --> default spec is loaded.
                                mapOfRegFilterData = { ...mapOfRegFilterData, nproductcatcode: map.nproductcatcode, nproductcode: map.nproductcode }
                                dispatch(getTreeByProduct(mapOfRegFilterData, selectedRecord, { ...returnObj.comboData },inputParem));
                            } else {
                                dispatch({
                                    type: DEFAULT_RETURN,
                                    payload: {
                                        loading: false,
                                        comboData: { ...returnObj.comboData },
                                        selectedRecord,
                                        selectedMaster: [],
                                        addMaster: false,
                                        selectedControl: [],
                                        masterComboColumnFiled: [],
                                        masterDesign: [],
                                        masterextractedColumnList: [],
                                        masterfieldList: [],
                                        masterdataList: [],
                                        mastercomboComponents: [],
                                        masterwithoutCombocomponent: [],
                                        masterIndex: undefined,
                                        screenName: inputParem.screenName,
                                        loadCustomSearchFilter: false,
                                       
                                    }
                                })
                            }
                        } else {
                            dispatch({
                                type: DEFAULT_RETURN,
                                payload: {
                                    loading: false,
                                    comboData: { ...returnObj.comboData },
                                    selectedRecord,
                                    selectedMaster: [],
                                    addMaster: false,
                                    selectedControl: [],
                                    masterComboColumnFiled: [],
                                    masterDesign: [],
                                    masterextractedColumnList: [],
                                    masterfieldList: [],
                                    masterdataList: [],
                                    mastercomboComponents: [],
                                    masterwithoutCombocomponent: [],
                                    masterIndex: undefined,
                                    screenName: inputParem.screenName,
                                    loadCustomSearchFilter: false,
                                  
                                }
                            })
                        }

                    } else {
                        dispatch({
                            type: DEFAULT_RETURN,
                            payload: {
                                loading: false,
                                comboData: { ...returnObj.comboData },
                                selectedRecord,
                                selectedMaster: [],
                                addMaster: false,
                                selectedControl: [],
                                masterComboColumnFiled: [],
                                masterDesign: [],
                                masterextractedColumnList: [],
                                masterfieldList: [],
                                masterdataList: [],
                                mastercomboComponents: [],
                                masterwithoutCombocomponent: [],
                                masterIndex: undefined,
                                screenName: inputParem.screenName,
                                loadCustomSearchFilter: false,
                               
                            }
                        })
                    }


                }
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
            })
    }
}


export function validatePreview(inputParam) {
    return function (dispatch) {

        rsapi().post("dynamicpreregdesign/validatePreview", { ...inputParam })
            .then(response => {
                if (response.data.rtn === "Success") {
                    toast.info(intl.formatMessage({
                        id: "IDS_SUCCESSFULLYVALIDATE"
                    }));
                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {
                            loading: false,
                        }
                    })
                } else {
                    toast.warn(response.data.rtn);
                    dispatch({ type: DEFAULT_RETURN, payload: { loading: false, showConfirmAlert: false } })
                }
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
            })
    }
}



export function addMasterRecord(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        let requestUrl = '';
        if (inputParam.isFileupload) {
          const formData = inputParam.formData;
          formData.append("userinfo", JSON.stringify(inputParam.inputData.userinfo));
          requestUrl = rsapi().post(inputParam.classUrl + "/" + inputParam.operation + inputParam.methodUrl, formData);
        } else {
          requestUrl = rsapi().post(inputParam.classUrl + "/" + inputParam.operation + inputParam.methodUrl, { ...inputParam.inputData });
        }
       return requestUrl
            .then(response => {
                if (response.status === 202) {
                    //HttpStatus:Accepted
                    //Use this block when u need to display any success message

                    dispatch({
                        type: DEFAULT_RETURN, payload: {
                            loading: false
                        }
                    })
                    toast.success(response.data);
                }
                else if (response.status === 208) {
                    //HttpStatus:Accepted
                    //208-Already Reported
                    dispatch({
                        type: DEFAULT_RETURN, payload: {
                            loading: false
                        }
                    })
                    toast.warn(response.data);
                } else {
                    let masterIndex = inputParam.masterIndex
                    let data = []
                    const data1 = sortData(response.data);
                    if (inputParam.selectedControl[masterIndex].table.item.component === 'Dynamic') {
                        data = constructOptionList(data1.DynamicMasterData, inputParam.selectedControl[masterIndex].valuemember, inputParam.selectedControl[masterIndex].displaymember).get("OptionList")
                    }
                    else if (inputParam.selectedControl[masterIndex].table.item.nformcode === 137) {
                        if (inputParam.selectedControl[masterIndex].inputtype === 'backendsearchfilter'
                            || inputParam.selectedControl[masterIndex].inputtype === 'frontendsearchfilter') {
                            //   data = constructOptionList(data1.PatientList, inputParam.selectedControl[masterIndex].valuemember, inputParam.selectedControl[masterIndex].displaymember).get("OptionList")
                            data = [{ label: data1.SelectedPatient[inputParam.selectedControl[masterIndex].displaymember], value: data1.SelectedPatient[inputParam.selectedControl[masterIndex].valuemember], item: data1.SelectedPatient }]
                        } else {
                            data = constructOptionList(data1.PatientList, inputParam.selectedControl[masterIndex].valuemember, inputParam.selectedControl[masterIndex].displaymember).get("OptionList")
                        }

                    }
                    else if (inputParam.selectedControl[masterIndex].table.item.nformcode === 43) {
                        if (inputParam.selectedControl[masterIndex].inputtype === 'backendsearchfilter'
                            || inputParam.selectedControl[masterIndex].inputtype === 'frontendsearchfilter') {
                            //   data = constructOptionList(data1.PatientList, inputParam.selectedControl[masterIndex].valuemember, inputParam.selectedControl[masterIndex].displaymember).get("OptionList")
                            data = [{ label: data1.ExternalOrder[inputParam.selectedControl[masterIndex].displaymember], value: data1.ExternalOrder[inputParam.selectedControl[masterIndex].valuemember], item: data1.ExternalOrder }]
                        } else {
                            data = constructOptionList(data1.ExternalOrder, inputParam.selectedControl[masterIndex].valuemember, inputParam.selectedControl[masterIndex].displaymember).get("OptionList")
                        }
                        
                    }
                    else {
                        data = constructOptionList(data1, inputParam.selectedControl[masterIndex].valuemember, inputParam.selectedControl[masterIndex].displaymember).get("OptionList")
                    }

                    const newdata = data.map((item1, index) => {
                        item1 = { ...item1, item: { jsondata: { ...item1.item, jsondata: { ...item1.item } } } }
                        return item1;
                    })
                    if (masterIndex === 0) {
                        const selectedRecord = inputParam.selectedRecord || {}
                        const selectedControl = inputParam.selectedControl || {}
                        let comboData1 = {}
                        if (inputParam.operation === 'create') {
                            comboData1 = {
                                ...newdata[0], item: {
                                    ...newdata[0].item, "pkey": selectedControl[masterIndex].valuemember,
                                    "nquerybuildertablecode": selectedControl[masterIndex].nquerybuildertablecode,
                                    "source": selectedControl[masterIndex].source
                                }
                            }
                        } else {
                            const value = inputParam.selectedControl[masterIndex].table.item.component === 'Dynamic' ?
                                inputParam.masterEditObject[masterIndex].item ? inputParam.masterEditObject[masterIndex].item.jsondata.ndynamicmastercode : inputParam.masterEditObject[masterIndex].ndynamicmastercode : inputParam.masterEditObject[masterIndex].value
                            let combodata = []
                            if (inputParam.selectedControl[masterIndex].table.item.component === 'Dynamic') {
                                combodata = newdata.filter(x => x.item.jsondata.ndynamicmastercode === value)
                            } else {
                                combodata = newdata.filter(x => x.value === value)
                            }


                            comboData1 = {
                                ...combodata[0], item: {
                                    ...combodata[0].item, "pkey": selectedControl[masterIndex].valuemember,
                                    "nquerybuildertablecode": selectedControl[masterIndex].nquerybuildertablecode,
                                    "source": selectedControl[masterIndex].source
                                }
                            }
                        }


                        selectedRecord[selectedControl[masterIndex].label] = comboData1
                        if (inputParam.selectedControl[masterIndex].table.item.nformcode === 137) {
                            selectedRecord['spatientid'] = comboData1.item['jsondata']['spatientid']
                        }
                        if (inputParam.selectedControl[masterIndex].table.item.nformcode === 43) {
                            selectedRecord['nexternalordercode'] = comboData1.item['nexternalordercode']
                        }
                        const comboData = inputParam.comboData
                        comboData[selectedControl[masterIndex].label] = newdata

                        if (selectedControl[masterIndex].child && selectedControl[masterIndex].child.length > 0) {
                            const childComboList = getSameRecordFromTwoArrays(inputParam.comboComponents, selectedControl[masterIndex].child, "label")
                            let childColumnList = {};
                            childComboList.map(columnList => {
                                const val = comboChild(inputParam.comboComponents, columnList, childColumnList, false);
                                childColumnList = val.childColumnList
                            })

                            const parentList = getSameRecordFromTwoArrays(inputParam.withoutCombocomponent, selectedControl[masterIndex].child, "label")


                            const inputParem = {
                                child: selectedControl[masterIndex].child,
                                source: selectedControl[masterIndex].source,
                                primarykeyField: selectedControl[masterIndex].valuemember,
                                value: comboData1.value,
                                item: comboData1.item,
                                screenName: inputParam.screenName,
                                nsampletypecode: inputParam.nsampletypecode ? inputParam.nsampletypecode : -1,
                                loginProps: inputParam.loginProps,
								//ALPD-5678--Added by Vignesh R(10-04-2025)-->Sample Registration --> In Etica clinical type --> default spec is loaded.
                                ntestgroupspecrequired:inputParam.ntestgroupspecrequired
                            }

                            
                            if (inputParam.loadSubSample) {
                                dispatch(getChildValues(inputParem,
                                    inputParam.inputData.userinfo, selectedRecord, comboData,
                                    childComboList, childColumnList,
                                    inputParam.withoutCombocomponent,
                                    [...childComboList, ...parentList], false, false, {ntestgroupspecrequired:inputParem.ntestgroupspecrequired},
                                    false, false, false,
                                    false, false, true, false))
                            } else {
                                dispatch(getChildValues(inputParem,
                                    inputParam.inputData.userinfo, selectedRecord, comboData,
                                    childComboList, childColumnList,
                                    inputParam.withoutCombocomponent,
                                    [...childComboList, ...parentList], false, false, inputParam.nsampletypecode === 5 ? { nportalrequired: inputParam.nportalrequired && inputParam.nportalrequired, nsampletypecode: inputParam.nsampletypecode, nneedsubsample: inputParam.nneedsubsample,ntestgroupspecrequired:inputParem.ntestgroupspecrequired } : {},
                                    false, false, false,
                                    false, false, false, false, inputParam.comboComponents))
                            }


                        } else {
                            dispatch({
                                type: DEFAULT_RETURN,
                                payload: {
                                    loading: false,
                                    addMaster: false,
                                    [inputParam.comboName]: comboData,
                                    selectedMaster: [],
                                    [inputParam.selectedRecordName]: selectedRecord,
                                    screenName: inputParam.screenName,
                                    masterIndex: undefined,
                                    mastercomboComponents: [],
                                    masterwithoutCombocomponent: [],
                                    masterComboColumnFiled: [],
                                    masterextractedColumnList: [],
                                    masterdataList: [],
                                    masterDesign: [],
                                    masterfieldList: [],
                                    masterOperation: [],
                                    masterEditObject: [],
                                }
                            })
                        }
                    }
                    else {

                        let selectedMaster = inputParam.selectedMaster || []
                        let selectedControl = inputParam.selectedControl || []
                        let comboData1 = {}

                        if (inputParam.operation === 'create') {
                            comboData1 = {
                                ...newdata[0], item: {
                                    ...newdata[0].item, "pkey": selectedControl[masterIndex].valuemember,
                                    "nquerybuildertablecode": selectedControl[masterIndex].nquerybuildertablecode,
                                    "source": selectedControl[masterIndex].source
                                }
                            }
                        } else {
                            const value = inputParam.selectedControl[masterIndex].table.item.component === 'Dynamic' ?
                                inputParam.masterEditObject[masterIndex].item ? inputParam.masterEditObject[masterIndex].item.jsondata.ndynamicmastercode : inputParam.masterEditObject[masterIndex].ndynamicmastercode : inputParam.masterEditObject[masterIndex].value
                            let combodata = []
                            if (inputParam.selectedControl[masterIndex].table.item.component === 'Dynamic') {
                                combodata = newdata.filter(x => x.item.jsondata.ndynamicmastercode === value)
                            } else {
                                combodata = newdata.filter(x => x.value === value)
                            }

                            comboData1 = {
                                ...combodata[0], item: {
                                    ...combodata[0].item, "pkey": selectedControl[masterIndex].valuemember,
                                    "nquerybuildertablecode": selectedControl[masterIndex].nquerybuildertablecode,
                                    "source": selectedControl[masterIndex].source
                                }
                            }
                        }

                        selectedMaster[masterIndex - 1][selectedControl[masterIndex].label] = comboData1

                        // const comboData = inputParam.comboData
                        // comboData[selectedControl[masterIndex].label] = newdata

                        let masterdataList = inputParam.masterdataList || []
                        masterdataList[masterIndex - 1] = { ...masterdataList[masterIndex - 1], [selectedControl[masterIndex].label]: newdata }

                        if (selectedControl[masterIndex].child && selectedControl[masterIndex].child.length > 0) {
                            const childComboList = getSameRecordFromTwoArrays(inputParam.mastercomboComponents[masterIndex - 1], selectedControl[masterIndex].child, "label")
                            let childColumnList = {};
                            childComboList.map(columnList => {
                                const val = comboChild(inputParam.mastercomboComponents[masterIndex - 1], columnList, childColumnList, false);
                                childColumnList = val.childColumnList
                            })

                            const parentList = getSameRecordFromTwoArrays(inputParam.masterwithoutCombocomponent[masterIndex - 1], selectedControl[masterIndex].child, "label")

                            const inputParem = {
                                child: selectedControl[masterIndex].child,
                                source: selectedControl[masterIndex].source,
                                primarykeyField: selectedControl[masterIndex].valuemember,
                                value: comboData1.value,
                                item: comboData1.item,
                                screenName: inputParam.screenName
                            }

                            dispatch(getChildValuesForMasterAdd(inputParem,
                                inputParam.inputData.userinfo, selectedMaster, inputParam.masterdataList,
                                childComboList, childColumnList,
                                inputParam.masterwithoutCombocomponent,
                                [...childComboList, ...parentList], masterIndex, inputParam))



                        } else {

                            selectedControl = selectedControl && removeIndex(selectedControl, masterIndex)
                            selectedMaster = selectedMaster && removeIndex(selectedMaster, masterIndex)

                            const mastercomboComponents = inputParam.mastercomboComponents && removeIndex(inputParam.mastercomboComponents, masterIndex)
                            const masterwithoutCombocomponent = inputParam.masterwithoutCombocomponent && removeIndex(inputParam.masterwithoutCombocomponent, masterIndex)
                            const masterComboColumnFiled = inputParam.masterComboColumnFiled && removeIndex(inputParam.masterComboColumnFiled, masterIndex)
                            const masterextractedColumnList = inputParam.masterextractedColumnList && removeIndex(inputParam.masterextractedColumnList, masterIndex)
                            masterdataList = masterdataList && removeIndex(masterdataList, masterIndex)
                            const masterDesign = inputParam.masterDesign && removeIndex(inputParam.masterDesign, masterIndex)
                            const masterfieldList = inputParam.masterfieldList && removeIndex(inputParam.masterfieldList, masterIndex)
                            const masterOperation = inputParam.masterOperation && removeIndex(inputParam.masterOperation, masterIndex)
                            const masterEditObject = inputParam.masterEditObject && removeIndex(inputParam.masterEditObject, masterIndex)
                            const screenName = selectedControl[masterIndex - 1].displayname[inputParam.userinfo.slanguagetypecode]
                            masterIndex = (parseInt(masterIndex) - 1)

                            dispatch({
                                type: DEFAULT_RETURN,
                                payload: {
                                    selectedControl,
                                    selectedMaster,
                                    mastercomboComponents,
                                    masterwithoutCombocomponent,
                                    masterComboColumnFiled,
                                    masterextractedColumnList,
                                    masterdataList,
                                    masterDesign,
                                    masterfieldList,
                                    masterOperation,
                                    masterEditObject,
                                    loading: false,
                                    // addMaster: false,
                                    // masterdataList,
                                    // selectedMaster: {},
                                    //  selectedMaster: selectedMaster,

                                    screenName,
                                    masterIndex,

                                }
                            })
                        }

                    }


                }

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
            })
    }
}


// export function removeIndex(data, removeIndex) {
//     const data1 = [...data.splice(0, removeIndex), ...data.splice(removeIndex + 1)]
//     return data1
// }

export function getAddMasterCombo(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        let urlArray = [];
        let masterIndex = inputParam.masterIndex
        inputParam.masterComboColumnFiled[masterIndex].map(item => {
            if (item.needService === undefined) {
                urlArray.push(rsapi().post(item.classUrl + "/" + item.methodUrl, { userinfo: inputParam.userinfo }));
                item["fetchIndex"] = urlArray.length - 1;
            }
        }
        )
        if (inputParam.selectedControl[masterIndex].table.item.nformcode === 137) {
            urlArray.push(rsapi().post("timezone/getLocalTimeByZone", { userinfo: inputParam.userinfo }));
        }
        Axios.all(urlArray)
            .then(response => {
                let ComboFieldData = [];
                let masterdataList = inputParam.masterdataList;

                inputParam.masterComboColumnFiled[masterIndex].map((item, index) => {
                    if (item.needService === undefined) {

                        ComboFieldData = constructOptionList(item.objectValue === null ? response[item.fetchIndex].data || [] : response[item.fetchIndex].data[item.objectValue],
                            item.foreignDataField, item.dataField, undefined, undefined, undefined,);
                        masterdataList[masterIndex][item.dataField] = ComboFieldData.get("OptionList");
                        //selectedMaster[masterIndex][item.dataField] = ComboFieldData.get("DefaultValue");

                    } else {
                        if (item.child !== undefined) {
                            masterdataList[masterIndex][item.dataField] = []
                        } else if (item.useService !== undefined) {
                            masterdataList[masterIndex][item.dataField] = masterdataList[masterIndex][inputParam.masterComboColumnFiled[masterIndex][item.useService].dataField]
                        }

                    }
                });
                let currentTime = ''
                let selectedMaster = inputParam.selectedMaster || []
                if (inputParam.selectedControl[masterIndex].table.item.nformcode === 137) {
                    //const data=inputParam.masterComboColumnFiled.filter(x=>x.needService===undefined)
                    currentTime = rearrangeDateFormat(inputParam.userinfo, response[urlArray.length - 1].data?.date);
                    selectedMaster[masterIndex]["ddob"] = rearrangeDateFormat(inputParam.userinfo, response[urlArray.length - 1].data?.date);
                    selectedMaster[masterIndex]["sage"] = ageCalculate(selectedMaster["ddob"])
                    selectedMaster[masterIndex]["nneedcurrentaddress"] = transactionStatus.NO;
                    selectedMaster[masterIndex]["today"] = inputParam.userinfo;
                }

                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterIndex,
                        selectedMaster,
                        masterdataList,
                        addMaster: true,
                        loading: false,
                        selectedControl: inputParam.selectedControl,
                        masterfieldList: inputParam.masterfieldList,
                        masterextractedColumnList: inputParam.masterextractedColumnList,
                        masterprimaryKeyField: inputParam.masterprimaryKeyField,
                        masterComboColumnFiled: inputParam.masterComboColumnFiled,
                        screenName: inputParam.selectedControl[masterIndex].displayname[inputParam.userinfo.slanguagetypecode],
                        mastercomboComponents: inputParam.mastercomboComponents,
                        masterwithoutCombocomponent: inputParam.masterwithoutCombocomponent,
                        masterDesign: inputParam.masterDesign,
                        masterOperation: inputParam.masterOperation,
                       
                    }
                })
            })
            .catch(error => {
                dispatch(initRequest(false));
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

export function getDynamicMasterTempalte(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        const masterIndex = inputParam.masterIndex
        rsapi().post(inputParam.selectedControl[masterIndex].table.item.classUrl + "/getMasterDesign",
            { userinfo: { ...inputParam.userinfo, nformcode: inputParam.selectedControl[inputParam.masterIndex].table.item.nformcode } })
            .then(response => {
                const design = response.data
                const masterwithoutCombocomponent = inputParam.masterwithoutCombocomponent || []
                let data = inputParam.masterdesignData || []
                const masterextractedColumnList = inputParam.masterextractedColumnList || []

                //masterwithoutCombocomponent[masterIndex] = []
                // masterextractedColumnList[masterIndex] = []
                data[masterIndex] = []
                design.slideoutdesign.map(row => {
                    row.children.map(column => {
                        column.children.map(component => {
                            if (component.hasOwnProperty("children")) {
                                component.children.map(componentrow => {
                                    if (componentrow.inputtype === "combo") {
                                        data[masterIndex].push(componentrow)
                                    } else {
                                        masterwithoutCombocomponent[masterIndex].push(componentrow)
                                    }
                                    if (componentrow.mandatory === true) {
                                        if (componentrow.inputtype === "email") {
                                            masterextractedColumnList[masterIndex].push({
                                                "mandatory": true, "idsName": componentrow.label,
                                                "dataField": componentrow.label,
                                                "alertPreFix": this.props.intl.formatMessage({ id: "IDS_VALID" }),
                                                "validateFunction": validateEmail,
                                                "mandatoryLabel": "IDS_ENTER",
                                                "controlType": "textbox"
                                            })
                                        }
                                        else {
                                            masterextractedColumnList[masterIndex].push({
                                                "mandatory": true,
                                                "idsName": componentrow.label,
                                                "dataField": componentrow.label,
                                                "mandatoryLabel": componentrow.inputtype === "combo" ?
                                                    "IDS_SELECT" : "IDS_ENTER",
                                                "controlType": componentrow.inputtype === "combo" ?
                                                    "selectbox" : "textbox"
                                            })
                                        }
                                    }
                                })
                            }
                            else {
                                component.inputtype === "combo" ?
                                    data[masterIndex].push(component)
                                    : masterwithoutCombocomponent[masterIndex].push(component)

                                if (component.mandatory === true) {
                                    if (component.inputtype === "email") {
                                        masterextractedColumnList[masterIndex].push({
                                            "mandatory": true, "idsName": component.label,
                                            "dataField": component.label,
                                            "alertPreFix": this.props.intl.formatMessage({ id: "IDS_VALID" }),
                                            "validateFunction": validateEmail,
                                            "mandatoryLabel": "IDS_ENTER",
                                            "controlType": "textbox"
                                        })
                                    }
                                    else {
                                        masterextractedColumnList[masterIndex].push({
                                            "mandatory": true,
                                            "idsName": component.label,
                                            "dataField": component.label,
                                            "mandatoryLabel": component.inputtype === "combo" ?
                                                "IDS_SELECT" : "IDS_ENTER",
                                            "controlType": component.inputtype === "combo" ?
                                                "selectbox" : "textbox"
                                        })
                                    }
                                }
                            }
                        })
                    })
                })
                const comboComponents = inputParam.mastercomboComponents || []
                comboComponents[masterIndex] = data[masterIndex];
                let childColumnList = {};
                data[masterIndex].map(columnList => {
                    const val = comboChild(data[masterIndex], columnList, childColumnList, true);
                    data[masterIndex] = val.data;
                    childColumnList = val.childColumnList
                })

                const masterdesignData = inputParam.masterdesignData || []
                masterdesignData[masterIndex] = [...data[masterIndex]]
                const masterDesign = inputParam.masterDesign || []
                masterDesign[masterIndex] = design
                inputParam = {
                    ...inputParam,
                    masterchildColumnList: childColumnList,
                    mastercomboComponents: comboComponents,
                    masterextractedColumnList,
                    masterwithoutCombocomponent,
                    masterDesign,
                    masterdesignData,
                    masterOperation: inputParam.masterOperation
                }


                if (inputParam.masterOperation[masterIndex] === 'create') {

                    dispatch(getDynamicMasterComboForAdd(inputParam, true))
                } else {
                    dispatch(getEditMasterCombo(inputParam))
                }
            })
            .catch(error => {
                dispatch(initRequest(false));
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


export function getDynamicMasterComboForAdd(inputParam, preview) {
    return function (dispatch) {
        dispatch(initRequest(true));
        const masterIndex = inputParam.masterIndex
        const timeZoneService = rsapi().post("timezone/getTimeZone");
        const actualService = rsapi().post("dynamicpreregdesign/getComboValues", {
            parentcolumnlist: inputParam.masterdesignData[masterIndex],
            childcolumnlist: inputParam.masterchildColumnList,
            userinfo: inputParam.userinfo
        })
        const dateService = rsapi().post("dynamicpreregdesign/dateValidation", {
            datecolumnlist: inputParam.masterwithoutCombocomponent[masterIndex].filter(x => x.inputtype === "date"),
            userinfo: inputParam.userinfo
        })
        let urlArray = [timeZoneService, actualService, dateService];

        Axios.all(urlArray)
            .then(response => {
                const timeZoneMap = constructOptionList(response[0].data || [], "ntimezonecode", "stimezoneid", undefined, undefined, true);
                const timeZoneList = timeZoneMap.get("OptionList");
                const defaultTimeZone = { label: inputParam.userinfo.stimezoneid, value: inputParam.userinfo.ntimezonecode }
                let selectedMaster = inputParam.selectedMaster || []
                selectedMaster[masterIndex] = selectedMaster[masterIndex] && { ...selectedMaster[masterIndex] } || {}
                const newcomboData = parentChildComboLoad(inputParam.masterdesignData[masterIndex], response[1].data, selectedMaster[masterIndex], inputParam.masterchildColumnList,
                    inputParam.masterwithoutCombocomponent[masterIndex], undefined, inputParam.userinfo.slanguagetypecode, inputParam.userinfo)

                const comboData1 = newcomboData.comboData
                const selectedRecord1 = newcomboData.selectedRecord
                inputParam.masterwithoutCombocomponent[masterIndex].map(componentrow => {
                    if (componentrow.inputtype === 'date') {
                        selectedRecord1[selectedRecord1.label] = selectedRecord1[selectedRecord1.label] && selectedRecord1[componentrow.label] !== '-' ?
                            rearrangeDateFormat(inputParam.userinfo, selectedRecord1[componentrow.label]) : ""

                        if (selectedRecord1.nperiodcode) {
                            selectedRecord1[componentrow.label + "value"] = response[2].data[componentrow.label] ?
                                new Date(response[2].data[componentrow.label]["datevalue"]) : null;
                        } else {
                            selectedRecord1[componentrow.label + "value"] = new Date();
                        }

                        if (componentrow.hidebeforedate) {
                            selectedRecord1[componentrow.label + "min"] = selectedRecord1[componentrow.label + "value"]
                        }
                        if (componentrow.hideafterdate) {
                            selectedRecord1[componentrow.label + "max"] = selectedRecord1[componentrow.label + "value"]
                        }
                    }
                    else if (componentrow.inputtype === "radio"
                        || componentrow.inputtype === "checkbox"
                        || componentrow.inputtype === "predefineddropdown") {

                        if (componentrow['radiodefaultvalue']) {
                            if (componentrow.inputtype === "checkbox") {

                                let val = ''
                                componentrow.radiodefaultvalue &&
                                    componentrow.radiodefaultvalue.length > 0 && componentrow.radiodefaultvalue.map((x, i) => {
                                        val = val + (i === componentrow.radiodefaultvalue.length - 1 ? x.label : x.label + ',')
                                    })

                                selectedRecord1[componentrow.label] = val

                            } else if (componentrow.inputtype === "predefineddropdown") {
                                selectedRecord1[componentrow.label] = componentrow.radiodefaultvalue ?
                                    componentrow.radiodefaultvalue : "";
                            } else {
                                selectedRecord1[componentrow.label] = componentrow.radiodefaultvalue ?
                                    componentrow.radiodefaultvalue.label : "";
                            }

                        } else {
                            if (componentrow.inputtype === "radio") {
                                selectedRecord1[componentrow.label] = componentrow.radioOptions ?
                                    componentrow.radioOptions.tags[0].text : "";
                            }
                        }

                    }

                })
                //const masterchildColumnList=inputParam.masterchildColumnList || []
                // masterchildColumnList[masterIndex] = comboData1
                const masterdataList = inputParam.masterdataList || []
                masterdataList[masterIndex] = comboData1
                selectedMaster[masterIndex] = { ...selectedMaster[masterIndex], selectedRecord1 }
                if (preview) {
                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {
                            ...inputParam,
                            mastertimeZoneList: timeZoneList,
                            masterdefaultTimeZone: defaultTimeZone,
                            loading: false,
                            addMaster: true,
                            masterdataList,
                            selectedMaster,
                            mastercomboComponents: inputParam.mastercomboComponents,
                            masterwithoutCombocomponent: inputParam.masterwithoutCombocomponent,
                            masterdesignData: inputParam.masterdesignData,
                            masterIndex,
                            // masterchildColumnList: inputParam.masterchildColumnList,
                            screenName: inputParam.selectedControl[masterIndex].displayname[inputParam.userinfo.slanguagetypecode],
                            // operation: inputParam.masterOperation[masterIndex],
                        }
                    })
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

export function getChildValuesForAddMaster(inputParam,
    userinfo, selectedMaster, comboData, parentcolumnlist,
    childcolumnlist, withoutCombocomponent, parentListWithReadonly, masterIndex
) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post('dynamicpreregdesign/getChildValues', {
            child: inputParam.child,
            parentdata: inputParam.item.jsondata,
            parentsource: inputParam.source,
            [inputParam.primarykeyField]: inputParam.value,
            valuemember: inputParam.primarykeyField,
            childcolumnlist,
            userinfo,
            parentcolumnlist
        })
            .then(response => {
                let returnObj = { ...comboData[masterIndex], ...response.data }
                returnObj = parentChildComboLoad(parentListWithReadonly, returnObj, selectedMaster[masterIndex], childcolumnlist, withoutCombocomponent[masterIndex], inputParam, userinfo.slanguagetypecode, userinfo)
                selectedMaster[masterIndex] = { ...selectedMaster[masterIndex], ...returnObj.selectedRecord }
                const masterdataList = comboData || []
                masterdataList[masterIndex] = returnObj.comboData
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false,
                        masterdataList,
                        selectedMaster
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
                } else {
                    toast.warn(error.response.data);
                }
            })
    }

}

export function getChildComboMaster(selectedMaster, filedName,
    item, selectedControl, masterComboColumnFiled, masterdataList, userInfo, masterIndex) {
    return function (dispatch) {
        dispatch(initRequest(true));
        let urlArray = [];
        const obj = masterComboColumnFiled[masterIndex][item.childIndex]
        if(obj.ismutipleparent){
            let inputData={
                [item.foreignDataField]: selectedMaster[masterIndex][item.tableDataField], 
                [obj.parentMutipleTableDataField]: selectedMaster[masterIndex][obj.parentMutipleTableDataField], 
            }
        urlArray.push(rsapi().post(obj.classUrl + "/" + obj.methodUrl, { ...inputData, userinfo: userInfo }))
        }else{
            urlArray.push(rsapi().post(obj.classUrl + "/" + obj.methodUrl, { [item.foreignDataField]: selectedMaster[masterIndex][item.tableDataField], userinfo: userInfo }))
        }
        Axios.all(urlArray)
            .then(response => {
                selectedMaster[masterIndex][obj.dataField] = undefined
                const ComboFieldData = constructOptionList(obj.objectValue === null ? response[0].data || [] : response[0].data[obj.objectValue], obj.foreignDataField,
                    obj.foreignDisplayMember, undefined, undefined, undefined);
                masterdataList[masterIndex][obj.dataField] = ComboFieldData.get("OptionList");


                if (item.childFieldToClear) {
                    item.childFieldToClear.forEach(item1 => (

                        selectedMaster[masterIndex] = {
                            ...selectedMaster[masterIndex],
                            [item1.label]: undefined,
                            [item1.tablecolumnname]: undefined
                        },
                        masterdataList[masterIndex] = {
                            ...masterdataList[masterIndex],
                            [item1.label]: []
                        }
                    )
                    );

                }

                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        selectedMaster,
                        masterdataList,
                        loading: false,

                    }
                })
            })
            .catch(error => {
                dispatch(initRequest(false));
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



export function getChildValuesForMasterAdd(inputParem,
    userinfo, selectedMaster, masterdataList, parentcolumnlist,
    childcolumnlist, withoutCombocomponent, parentListWithReadonly,
    masterIndex, inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post('dynamicpreregdesign/getChildValues', {
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
                let returnObj = { ...masterdataList[masterIndex - 1], ...response.data }
                returnObj = parentChildComboLoad(parentListWithReadonly, returnObj,
                    selectedMaster[masterIndex - 1],
                    childcolumnlist, withoutCombocomponent[masterIndex - 1], inputParem,
                    userinfo.slanguagetypecode, userinfo)
                selectedMaster[masterIndex - 1] = { ...selectedMaster[masterIndex - 1], ...returnObj.selectedRecord }
                masterdataList[masterIndex - 1] = returnObj.comboData


                // const dataList = {

                // }
                const selectedControl = inputParam.selectedControl && removeIndex(inputParam.selectedControl, masterIndex)
                selectedMaster = selectedMaster && removeIndex(selectedMaster, masterIndex)

                const mastercomboComponents = inputParam.mastercomboComponents && removeIndex(inputParam.mastercomboComponents, masterIndex)
                const masterwithoutCombocomponent = inputParam.masterwithoutCombocomponent && removeIndex(inputParam.masterwithoutCombocomponent, masterIndex)
                const masterComboColumnFiled = inputParam.masterComboColumnFiled && removeIndex(inputParam.masterComboColumnFiled, masterIndex)
                const masterextractedColumnList = inputParam.masterextractedColumnList && removeIndex(inputParam.masterextractedColumnList, masterIndex)
                masterdataList = masterdataList && removeIndex(masterdataList, masterIndex)
                const masterDesign = inputParam.masterDesign && removeIndex(inputParam.masterDesign, masterIndex)
                const masterfieldList = inputParam.masterfieldList && removeIndex(inputParam.masterfieldList, masterIndex)
                const screenName = selectedControl[masterIndex - 1].displayname[inputParam.userinfo.slanguagetypecode]
                masterIndex = (parseInt(masterIndex) - 1)

                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        // selectedControl: inputParam.selectedControl && removeIndex(inputParam.selectedControl, masterIndex),
                        // selectedMaster: selectedMaster && removeIndex(selectedMaster, masterIndex),
                        // mastercomboComponents: inputParam.mastercomboComponents && removeIndex(inputParam.mastercomboComponents, masterIndex),
                        // masterwithoutCombocomponent: inputParam.masterwithoutCombocomponent && removeIndex(inputParam.masterwithoutCombocomponent, masterIndex),
                        // masterComboColumnFiled: inputParam.masterComboColumnFiled && removeIndex(inputParam.masterComboColumnFiled, masterIndex),
                        // masterextractedColumnList: inputParam.masterextractedColumnList && removeIndex(inputParam.masterextractedColumnList, masterIndex),
                        // masterdataList: masterdataList && removeIndex(masterdataList, masterIndex),
                        // masterDesign: inputParam.masterDesign && removeIndex(inputParam.masterDesign, masterIndex),
                        // masterfieldList: inputParam.masterfieldList && removeIndex(inputParam.masterfieldList, masterIndex),
                        // screenName: inputParam.selectedControl[masterIndex - 1].displayname[userinfo.slanguagetypecode],
                        // loading: false,
                        //masterdataList,
                        //selectedMaster,
                        // ...dataList,
                        //   masterIndex: (parseInt(masterIndex) - 1),
                        // screenName: inputParem.screenName


                        selectedControl,
                        selectedMaster,
                        mastercomboComponents,
                        masterwithoutCombocomponent,
                        masterComboColumnFiled,
                        masterextractedColumnList,
                        masterdataList,
                        masterDesign,
                        masterfieldList,
                        loading: false,
                        // addMaster: false,
                        // masterdataList,
                        // selectedMaster: {},
                        //  selectedMaster: selectedMaster,

                        screenName,
                        masterIndex,
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
                } else {
                    toast.warn(error.response.data);
                }
            })
    }
}

export function viewExternalportalDetail(selectedControl, comboData, userinfo) {
    return function (dispatch) {
        if (selectedControl.table.item.nquerybuildertablecode === 222) {
            dispatch(initRequest(true));
            rsapi().post('dynamicpreregdesign/getExternalportalDetail', {
                nexternalordercode: comboData.value,
                nquerybuildertablecode: selectedControl.table.item.nquerybuildertablecode,
                userinfo,
            })
                .then(response => {
                    let Map1 = new Map();
                    response.data.Sample.map((item) => {
                        const newData = response.data.Test.filter(x => x.nexternalordersamplecode === item.nexternalordersamplecode)
                        Map1.set(item.nexternalordersamplecode, Object.values(newData))
                    })
                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {
                            isDynamicViewSlideOut: true,
                            dynamicExternalSample: response.data.Sample,
                            dynamicExternalTestChild: Map1,
                            dynamicGridSelectedId: response.data.Sample.length > 0 ? Object.keys(response.data.Sample[0].nexternalordersamplecode) : null,
                            loading: false,
                            selectedDynamicViewControl: selectedControl
                            // dynamicExternalSubSample:[],
                            // dynamicExternalTest:[]

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
                    } else {
                        toast.warn(error.response.data);
                    }
                })
        }

    }
}


export function getEditMaster(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        let masterIndex = inputParam.masterIndex
        const componentName = inputParam.selectedControl[masterIndex].table.item.component;
        const valueMember = inputParam.selectedControl[masterIndex].valuemember;

        if (componentName === 'Type1Component' || componentName === 'Type2Component') {
            rsapi().post(inputParam.selectedControl[masterIndex].table.item.classUrl + "/getActive" + inputParam.selectedControl[masterIndex].table.item.methodUrl + "ById", { userinfo: inputParam.userinfo, [valueMember]: inputParam.masterEditObject[masterIndex]['value'] })
                .then(response => {
                    if (response.status === 202) {
                        dispatch({
                            type: DEFAULT_RETURN, payload: {
                                loading: false
                            }
                        })
                        toast.success(response.data);
                    }
                    else if (response.status === 208) {
                        dispatch({
                            type: DEFAULT_RETURN, payload: {
                                loading: false
                            }
                        })
                        toast.warn(response.data);
                    } else {
                        let masterIndex = inputParam.masterIndex
                        const data = response.data;
                        let selectedMaster = inputParam.selectedMaster || []

                        inputParam.masterextractedColumnList[masterIndex].map(item => {
                            let fieldName = item.dataField;
                            if (item.controlType === "checkbox") {
                                selectedMaster[masterIndex][item.controlName] = data[item.controlName] ? data[item.controlName] : transactionStatus.NO;
                            }
                            else {
                                selectedMaster[masterIndex][fieldName] = data[fieldName] ? data[fieldName] : "";
                            }
                        });
                        dispatch({
                            type: DEFAULT_RETURN, payload: {
                                masterIndex,
                                selectedMaster,
                                masterdataList: inputParam.masterdataList,
                                addMaster: true,
                                loading: false,
                                selectedControl: inputParam.selectedControl,
                                masterfieldList: inputParam.masterfieldList,
                                masterextractedColumnList: inputParam.masterextractedColumnList,
                                masterprimaryKeyField: inputParam.masterprimaryKeyField,
                                masterComboColumnFiled: inputParam.masterComboColumnFiled,
                                screenName: inputParam.selectedControl[masterIndex].displayname[inputParam.userinfo.slanguagetypecode],
                                mastercomboComponents: inputParam.mastercomboComponents,
                                masterwithoutCombocomponent: inputParam.masterwithoutCombocomponent,
                                masterDesign: inputParam.masterDesign, masterEditObject: inputParam.masterEditObject, masterOperation: inputParam.masterOperation
                            }
                        })
                    }

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
                })


        } else if (componentName === 'Type3Component') {
            let urlArray = [];
            urlArray.push(rsapi().post(inputParam.selectedControl[masterIndex].table.item.classUrl + "/getActive" + inputParam.selectedControl[masterIndex].table.item.methodUrl + "ById", { userinfo: inputParam.userinfo, [valueMember]: inputParam.masterEditObject[masterIndex]['value'] }))


            inputParam.masterComboColumnFiled[masterIndex].map(item => {
                // if (item.needService === undefined) {
                let input = {}
                if (item.needService === false) {
                    if(item.ismutipleparent){
                        input = { [item["parenttableDataField"]]: inputParam.masterEditObject[masterIndex].item.jsondata ? inputParam.masterEditObject[masterIndex].item.jsondata[item["parenttableDataField"]] : inputParam.masterEditObject[masterIndex].item[item["parenttableDataField"]],
                        [item["parentMutipleTableDataField"]]: inputParam.masterEditObject[masterIndex].item.jsondata ? inputParam.masterEditObject[masterIndex].item.jsondata[item["parentMutipleTableDataField"]] : inputParam.masterEditObject[masterIndex].item[item["parentMutipleTableDataField"]]
                    }
    
                            }else{
                       input = { [item["parenttableDataField"]]: inputParam.masterEditObject[masterIndex].item.jsondata ? inputParam.masterEditObject[masterIndex].item.jsondata[item["parenttableDataField"]] : inputParam.masterEditObject[masterIndex].item[item["parenttableDataField"]] }
     
                            }
                    // input = { [item["parenttableDataField"]]: inputParam.masterEditObject[masterIndex].item.jsondata ? inputParam.masterEditObject[masterIndex].item.jsondata[item["parenttableDataField"]] : inputParam.masterEditObject[masterIndex].item[item["parenttableDataField"]] }
                }
                urlArray.push(rsapi().post(item.classUrl + "/" + item.methodUrl, { userinfo: inputParam.userinfo, ...input }));
                item["fetchIndex"] = urlArray.length - 1;
                // }
            }
            )
            if (inputParam.selectedControl[masterIndex].table.item.nformcode === 137) {
                urlArray.push(rsapi().post("timezone/getLocalTimeByZone", { userinfo: inputParam.userinfo }));
            }
            Axios.all(urlArray)
                .then(response => {
                    let ComboFieldData = [];
                    let masterdataList = inputParam.masterdataList;
                    const data = response[0].data;
                    let selectedMaster = inputParam.selectedMaster || []


                    inputParam.masterextractedColumnList[masterIndex].map(item => {
                        let fieldName = item.dataField;
                        let fieldNamePK = item.tableDataField;

                        // if (item.controlType === "selectbox") {
                        //     // inputData[methodUrl][fieldName] = this.state.selectedMaster[fieldName] ? this.state.selectedMaster[fieldName].label ? this.state.selectedMaster[fieldName].label : "" : -1;
                        //     selectedMaster[masterIndex][fieldName]= {lable:data[item.dataField],value:data[item.tableDataField]};

                        // }
                        if (item.controlType === "datepicker") {
                            selectedMaster[masterIndex][fieldName] = rearrangeDateFormat(inputParam.userinfo, data[item.dateField] ? data[item.dateField] : "");
                        }
                        else if (item.controlType === "checkbox") {
                            selectedMaster[masterIndex][item.controlName] = data[item.controlName] ? data[item.controlName] : transactionStatus.NO;
                        }
                        else {
                            selectedMaster[masterIndex][fieldName] = data[fieldName] ? data[fieldName] : "";
                            selectedMaster[masterIndex][fieldNamePK] = data[fieldNamePK] ? data[fieldNamePK] : -1;
                        }


                    })


                    inputParam.masterComboColumnFiled[masterIndex].map((item, index) => {
                        //  if (item.needService === undefined) {
                        let fieldName = item.dataField;
                        ComboFieldData = constructOptionList(item.objectValue === null ? response[item.fetchIndex].data || [] : response[item.fetchIndex].data[item.objectValue], item.foreignDataField,
                            item.dataField, undefined, undefined, undefined);
                        masterdataList[masterIndex][item.dataField] = ComboFieldData.get("OptionList");

                        if (masterdataList[masterIndex][item.dataField].length > 0) {
                            selectedMaster[masterIndex][fieldName] = { ...masterdataList[masterIndex][item.dataField].filter(x => x.item[item.foreignDataField] === data[item.tableDataField])[0] }
                        }




                        // } else {
                        //     if (item.child !== undefined) {
                        //         masterdataList[masterIndex][item.dataField] = []
                        //     } else if (item.useService !== undefined) {
                        //         masterdataList[masterIndex][item.dataField] = masterdataList[masterIndex][inputParam.masterComboColumnFiled[masterIndex][item.useService].dataField]
                        //     }

                        // }
                    });
                    let currentTime = ''

                    if (inputParam.selectedControl[masterIndex].table.item.nformcode === 137) {
                        //const data=inputParam.masterComboColumnFiled.filter(x=>x.needService===undefined)
                        currentTime = rearrangeDateFormat(inputParam.userinfo, response[urlArray.length - 1].data?.date);
                        selectedMaster[masterIndex]["ddob"] = rearrangeDateFormat(inputParam.userinfo, response[urlArray.length - 1].data?.date);
                        selectedMaster[masterIndex]["sage"] = ageCalculate(selectedMaster["ddob"])
                        selectedMaster[masterIndex]["nneedcurrentaddress"] = transactionStatus.NO;
                        selectedMaster[masterIndex]["today"] = inputParam.userinfo;
                    }

                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {
                            masterIndex,
                            selectedMaster,
                            masterdataList,
                            addMaster: true,
                            loading: false,
                            selectedControl: inputParam.selectedControl,
                            masterfieldList: inputParam.masterfieldList,
                            masterextractedColumnList: inputParam.masterextractedColumnList,
                            masterprimaryKeyField: inputParam.masterprimaryKeyField,
                            masterComboColumnFiled: inputParam.masterComboColumnFiled,
                            screenName: inputParam.selectedControl[masterIndex].displayname[inputParam.userinfo.slanguagetypecode],
                            mastercomboComponents: inputParam.mastercomboComponents,
                            masterwithoutCombocomponent: inputParam.masterwithoutCombocomponent,
                            masterDesign: inputParam.masterDesign, masterOperation: inputParam.masterOperation, masterEditObject: inputParam.masterEditObject
                        }
                    })
                })
                .catch(error => {
                    dispatch(initRequest(false));
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
        else if (componentName === 'Dynamic') {

            dispatch(getDynamicMasterTempalte(inputParam))

        }


    }
}

export function getEditMasterCombo(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        let urlArray = [];
        let masterIndex = inputParam.masterIndex
        const timeZoneService = rsapi().post("timezone/getTimeZone");
        const selectedMaster1 = rsapi().post("/dynamicmaster/getActiveDynamicMasterById", {
            ndynamicmastercode: inputParam.masterEditObject[masterIndex].item ? inputParam.masterEditObject[masterIndex].item.jsondata.ndynamicmastercode : inputParam.masterEditObject[masterIndex].ndynamicmastercode,
            parentcolumnlist: inputParam.masterdesignData[masterIndex],
            childcolumnlist: inputParam.masterchildColumnList,
            userinfo: inputParam.userinfo
        })
        urlArray = [timeZoneService, selectedMaster1]
        Axios.all(urlArray)
            .then(response => {
                let data = { ...response[1].data["EditData"] };
                let selectedMaster = inputParam.selectedMaster || []
                selectedMaster[masterIndex] = selectedMaster[masterIndex] && { ...selectedMaster[masterIndex] } || {}

                const timeZoneMap = constructOptionList(response[0].data || [], "ntimezonecode", "stimezoneid", undefined, undefined, true);
                const timeZoneList = timeZoneMap.get("OptionList");
                const defaultTimeZone = { label: inputParam.userinfo.stimezoneid, value: inputParam.userinfo.ntimezonecode };
                const selectedRecord1 = { ...data }
                const languagetypeCode = undefined;
                const comboData = response[1].data;
                delete comboData['EditData']
                let comboValues = {}
                if (inputParam.masterdesignData[masterIndex].length > 0) {
                    inputParam.masterdesignData[masterIndex].map(x => {
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
                                        const optionList = constructjsonOptionDefault(comboData[x.label] || [], x.valuemember,
                                            x.displaymember, false, false, true, undefined, x.source, x.isMultiLingual, languagetypeCode, x)
                                    }
                                } else {
                                    comboData[x.label] = []
                                }

                                comboValues = childComboLoadForEdit(x, comboData, selectedRecord1,
                                    inputParam.masterchildColumnList, inputParam.masterwithoutCombocomponent[masterIndex])
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

                if (inputParam.masterwithoutCombocomponent[masterIndex].length > 0) {
                    inputParam.masterwithoutCombocomponent[masterIndex].map(item => {
                        if (item.inputtype === "date") {
                            if (selectedRecord1[item.label]) {
                                selectedRecord1 = { ...selectedRecord1, [item.label]: rearrangeDateFormatforUI(inputParam.userinfo, selectedRecord1[item.label]) }
                            }
                        }
                    })
                }
                const masterdataList = inputParam.masterdataList || []
                masterdataList[masterIndex] = comboValues.comboData
                selectedMaster[masterIndex] = { ...selectedMaster[masterIndex], ...selectedRecord1 }


                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        ...inputParam,
                        mastertimeZoneList: timeZoneList,
                        masterdefaultTimeZone: defaultTimeZone,
                        loading: false,
                        addMaster: true,
                        masterdataList,
                        selectedMaster,
                        mastercomboComponents: inputParam.mastercomboComponents,
                        masterwithoutCombocomponent: inputParam.masterwithoutCombocomponent,
                        masterdesignData: inputParam.masterdesignData,
                        masterIndex,
                        screenName: inputParam.selectedControl[masterIndex].displayname[inputParam.userinfo.slanguagetypecode],
                        masterOperation: inputParam.masterOperation,
                        masterEditObject: inputParam.masterEditObject,

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