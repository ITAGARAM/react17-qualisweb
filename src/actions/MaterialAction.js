import rsapi from '../rsapi';
import { DEFAULT_RETURN, UN_AUTHORIZED_ACCESS } from './LoginTypes';
import { sortData, constructOptionList, parentChildComboLoad, rearrangeDateFormat } from '../components/CommonScript'
import { toast } from 'react-toastify';
import Axios from 'axios';
import { initRequest } from './LoginAction';
import { intl } from '../components/App';
import { attachmentType, transactionStatus } from '../components/Enumeration';

export function initialcombochangeget(nmaterialtypecode, data, userInfo) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("/material/getMaterialcombo", { nmaterialtypecode, "userinfo": userInfo })
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

export function getAddMaterialPopup(operation, loginInfo, selectedcombo, ncontrolCode, masterData, selectedRecord,screenname) {
    return function (dispatch) {
        if (masterData.SelectedMaterialCategoryFilter) {
            if (operation === "create") {
                let urlArray = [];
                let templateData = [];
                let data = [];
                let toggleComponents = [];
                let radioComponents = [];
                let filterQueryComponents = [];
                let dataparent = [];
                const withoutCombocomponent = []
                const Layout = masterData.selectedTemplate[0].jsondata
                Layout.map(row => {
                    return row.children.map(column => {
                        return column.children.map(component => {
                            if (component.hasOwnProperty("parent")) {
                                dataparent.push(component)
                            }
                            if (component.inputtype === 'toggle') {
                                toggleComponents.push(component)
                            }
                            if (component.inputtype === 'radio') {
                                radioComponents.push(component)
                            }
                            if (component.hasOwnProperty("nsqlquerycode")) {
                                filterQueryComponents.push(component)
                            }
                            return component.hasOwnProperty("children") ? component.children.map(componentrow => {
                                if (componentrow.inputtype === 'toggle') {
                                    toggleComponents.push(componentrow)
                                }
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
                                : component.inputtype === "combo" && !(component.hasOwnProperty("parent")) ? 
                                data.push(component) : withoutCombocomponent.push(component)
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
                    valuemember: dataparent[0].valuemember,
                    nquerybuildertablecode: dataparent[0].nquerybuildertablecode
                }
                let filterQueryComponents1 = []
                filterQueryComponents.map(temp => {
                    //filterQueryComponents1.push({'nsqlquerycode':temp.nsqlquerycode})
                    filterQueryComponents1 += temp.nsqlquerycode + ','
                })
                const materialReq1 = rsapi().post("dynamicpreregdesign/getComboValues",
                    {
                        "nmaterialtypecode": masterData.SelectedMaterialTypeFilter[0].nmaterialtypecode
                        , "userinfo": loginInfo.userInfo, "parentcolumnlist": comboComponents,
                        "filterQueryComponents": filterQueryComponents1.substring(0, filterQueryComponents1.length - 1)
                    });
                const materialReq2 = rsapi().post('dynamicpreregdesign/getChildValues', {
                    //ALPD-2272
                    child: Layout[0].children[0].children[0].childValue || [],
                    parentdata: { nmaterialtypecode: masterData.SelectedMaterialTypeFilter[0].nmaterialtypecode },
                    parentsource: 'materialcategory',
                    'nmaterialtypecode':masterData.SelectedMaterialTypeFilter[0].nmaterialtypecode,
                    valuemember: 'nmaterialtypecode',
                    "userinfo": loginInfo.userInfo,
                    parentcolumnlist: dataparent
                });
                // const materialReq3 = rsapi().post("/material/getMaterialByTypeCode",  {
                //     nmaterialtypecode: selectedcombo['nmaterialtypecode'].value,
                //     nmaterialcatcode: masterData.SelectedMaterialCategory['nmaterialcatcode'].value
                //     , "userinfo": userInfo
                // });
                urlArray = [materialReq1, materialReq2
                    //,materialReq3
                ];
                dispatch(initRequest(true));
                Axios.all(urlArray)
                    .then(response => {
                        templateData = response[0].data;
                        data.splice(1, 0, dataparent[0])
                        const temp2 = { ...response[0].data, ...response[1].data }
                        templateData = parentChildComboLoad(data, temp2, selectedRecord, null, withoutCombocomponent, undefined, loginInfo.userInfo.slanguagetypecode, loginInfo.userInfo)
                        toggleComponents.map((temp) => {
                            if (temp.hasOwnProperty('defaultchecked') && temp.defaultchecked === transactionStatus.YES) {
                                templateData['selectedRecord'] = {
                                    ...templateData['selectedRecord'],
                                    [temp.label]: temp.defaultchecked
                                }
                            }
                        })
                        radioComponents.map((temp) => {
                            if (temp.hasOwnProperty('radioOptions')) {
                                let tags=temp.radioOptions.tags
                                tags.map((tag) => {
                                    if(tag.hasOwnProperty('defaultchecked'))
                                    //selectedRecord[temp.label] = tag['defaultchecked']
                                    templateData['selectedRecord'] = {
                                        ...templateData['selectedRecord'],
                                        [temp.label]: tag['defaultchecked']
                                    }
                                })
                            }
                        })
                        selectedRecord = templateData['selectedRecord']
                        if(masterData.SelectedMaterialCategoryFilter&&masterData.SelectedMaterialCategoryFilter.length!==0){
                            templateData['comboData']["Material Category"].map(item=>{
                                if (masterData.SelectedMaterialCategoryFilter.nmaterialcatcode === item.value) {
                                    selectedRecord = {
                                        "Material Category": {
                                            "label": masterData.SelectedMaterialCategoryFilter.smaterialcatname,
                                            "value": masterData.SelectedMaterialCategoryFilter.nmaterialcatcode,
                                            "item": { "jsondata": item.item.jsondata,"pkey": "nmaterialcatcode", "source": "materialcategory" }                               
                                        }
                                    }
                                }
                       })      
                     }
                       
                        // selectedRecord={
                        //     "Material Category":{
                        //         "label":masterData.SelectedMaterialCategoryFilter.smaterialcatname,
                        //         "value":masterData.SelectedMaterialCategoryFilter.nmaterialcatcode
                        //     }
                        // }
                        selectedRecord['Expiry'] = transactionStatus.NO;
                        selectedRecord['Need Expiry'] = transactionStatus.NO;
                        selectedRecord['Open Expiry Need'] = transactionStatus.NO;
                        selectedRecord['Quarantine'] = transactionStatus.NO;
                        selectedRecord['Next Validation Need'] = transactionStatus.NO;
                        selectedRecord['Expiry Policy Period'] = undefined
                        //selectedRecord['Expiry Validations'] = 'No Expiry'
                        // if(selectedRecord['IDS_EXPIRY'])
                        // {
                        //     if(selectedRecord['IDS_EXPIRY']===transactionStatus.NO)
                        //     {
                        //         selectedRecord['IDS_NEEDEXPIRY']=transactionStatus.NO
                        //     } 
                        // }
                        dispatch({
                            type: DEFAULT_RETURN, payload: {
                                operation, screenname: screenname,
                                //ismaterialSectionneed:response[2].data.ismaterialSectionneed,
                                selectedRecord, showMaterialSection: false, templateData, openModal: true, selectedcombo,
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
                let urlArray = [];
                let templateData = [];
                let data = [];
                let dataparent = [];
                let filterQueryComponents = [];
                const withoutCombocomponent = []
                const Layout = masterData.selectedTemplate[0].jsondata
                Layout.map(row => {
                    return row.children.map(column => {
                        return column.children.map(component => {
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
                const Material = rsapi().post("/material/getMaterialEdit", { 'nmaterialcode': masterData.SelectedMaterial.nmaterialcode,
                'nmaterialtypecode': masterData.SelectedMaterialType[0].nmaterialtypecode, "userinfo": loginInfo.userInfo });
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
                const materialReq1 = rsapi().post("dynamicpreregdesign/getComboValues",
                    {
                        "nmaterialtypecode": masterData.SelectedMaterialTypeFilter[0].nmaterialtypecode
                        ,"userinfo": loginInfo.userInfo, "parentcolumnlist": comboComponents,
                        "filterQueryComponents": filterQueryComponents1.substring(0, filterQueryComponents1.length - 1)
                    });
                const materialReq2 = rsapi().post('dynamicpreregdesign/getChildValues', {
                      //ALPD-2272
                    child: Layout[0].children[0].children[0].childValue||[],
                    parentdata: { nmaterialtypecode: masterData.SelectedMaterialTypeFilter[0].nmaterialtypecode },
                    parentsource: 'materialcategory',
                    'nmaterialtypecode':masterData.SelectedMaterialTypeFilter[0].nmaterialtypecode,
                    valuemember: 'nmaterialtypecode',
                    "userinfo": loginInfo.userInfo,
                    parentcolumnlist: dataparent
                });
                urlArray = [materialReq1, materialReq2, Material];
                dispatch(initRequest(true));
                Axios.all(urlArray)
                    .then(response => {
                        templateData = response[0].data;
                        data = [...data, ...dataparent]
                        templateData = parentChildComboLoad(data, { ...response[0].data, ...response[1].data }, selectedRecord, null, withoutCombocomponent, undefined, loginInfo.userInfo.slanguagetypecode, loginInfo.userInfo)
                        selectedRecord = response[2].data.EditedMaterial[0]
                     
                        if (response[2].data["EditedMaterial"].length > 0) {
                            if (response[2].data["MaterialDateFeild"]!==undefined) {
                                response[2].data["MaterialDateFeild"].map((temp) => {
                                    response[2].data["EditedMaterial"][0][temp] =
                                        rearrangeDateFormat( loginInfo.userInfo, response[2].data["EditedMaterial"][0][temp])
                                })
                                response[2].data["DateFeildsMaterial"].map((temp) => {
                                    if (response[2].data["EditedMaterial"][0].hasOwnProperty(temp)&&
                                    response[2].data["EditedMaterial"][0][temp]==='-') {
                                        delete response[2].data["EditedMaterial"][0][temp] 
                                    }
                                }) 
                            }
                            else {
                                response[2].data["DateFeildsMaterial"].map((temp) => {
                                    if (response[2].data["EditedMaterial"][0].hasOwnProperty(temp)&&
                                    response[2].data["EditedMaterial"][0][temp]==='-') {
                                        delete response[2].data["EditedMaterial"][0][temp] 
                                    }
                                })  
                            }
                        }
                     
                        selectedRecord['Material Category'] = {
                            ...selectedRecord['Material Category'],
                            needsectionwise: response[2].data.EditedMaterial[0].needsectionwise
                        }

                        dispatch({
                            type: DEFAULT_RETURN, payload: {
                                operation, screenname: 'IDS_MATERIAL', isSelectedRecordChange: false, showMaterialSection: false, templateData, openModal: true, selectedcombo, selectedRecord,
                                ncontrolCode, loading: false,showSectionWhileEdit:false
                                //,  ismaterialSectionneed:response[2].data.EditedMaterial[0].jsondata.needsectionwise
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
        else {
            toast.warn(intl.formatMessage({ id: "IDS_CONFIGMATERIALCAT" }));
        }
    }
}

export function getMaterialDetails(inputData, masterData, userInfo) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("material/getMaterialDetails", {
            "nmaterialcode": inputData.nmaterialcode,
            "nmaterialcatcode": masterData.SelectedMaterialCategoryFilter.nmaterialcatcode,
            "nmaterialtypecode": masterData.SelectedMaterialTypeFilter[0].nmaterialtypecode,
            "userinfo": userInfo,
            fromDate:masterData.fromDate,
            toDate:masterData.toDate
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

export function getMaterialEdit(screenName, operation, primaryKeyName, masterData, userInfo, ncontrolCode) {
    return function (dispatch) {
        let urlArray = [];
        if (operation === "create") {
            const EDQMManufacturer = rsapi().post("/edqmmanufacturer/getEDQMManufacturer", { "userinfo": userInfo });
            urlArray = [EDQMManufacturer];
        }
        else {
            const Material = rsapi().post("/material/getMaterialEdit", 
                {
                    [primaryKeyName]: masterData.SelectedMaterial.jsondata.nmaterialcode,
                    'nmaterialtypecode': masterData.SelectedMaterialType.nmaterialtypecode, "userinfo": userInfo
                });
            urlArray = [Material];
        }
        dispatch(initRequest(true));
        Axios.all(urlArray)
            .then(response => {
                let selectedRecord = {};
                if (operation === "update") {
                    selectedRecord = response[2].data.EditedMaterial[0].jsondata;
                }
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        isOpen: true,
                        selectedRecord: operation === "update" ? selectedRecord : { "ntransactionstatus": 1 },
                        operation: operation,
                        screenName: screenName,
                        openModal: true, ncontrolCode: ncontrolCode, loading: false
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

export function getMaterialByTypeCode(selectedcombo, selectedMaterialCat, Data, userInfo) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("/material/getMaterialByTypeCode", selectedMaterialCat !== undefined ? {
            nmaterialtypecode: selectedcombo['nmaterialtypecode'].value,
            nmaterialcatcode: selectedMaterialCat['nmaterialcatcode'].value,       
            fromDate:Data.fromDate,
            toDate:Data.toDate
           
            , "userinfo": userInfo,
            'nflag':1
        } : {
            nmaterialtypecode: selectedcombo['nmaterialtypecode'].value

            , "userinfo": userInfo
        })
            .then(response => {
                let masterData = {}
                let tabScreen;
                if (response["data"].ismaterialSectionneed === 3) {
                    tabScreen = 'IDS_MATERIALSECTION'
                }
                masterData = { ...Data, ...response.data, tabScreen, searchedData: undefined }

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
export function getMaterialReload(selectedcombo, selectedMaterialCat, Data, userInfo) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("/material/getMaterialByTypeCode", selectedMaterialCat !== undefined ? {
            nmaterialtypecode: selectedcombo[0]['nmaterialtypecode'],
            nmaterialcatcode: selectedMaterialCat['nmaterialcatcode'],
            fromDate:Data.fromDate,
            toDate:Data.toDate
            , "userinfo": userInfo,
            'nflag':1
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
export function getAddMaterialSectionPopup(Data, userInfo, updateInfo, ncontrolCode) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("/material/getMaterialSection", {
            "userinfo": userInfo,
            'nmaterialcode': Data["SelectedMaterial"]["nmaterialcode"]
            , 'needSectionwise': Data["SelectedMaterialCategory"].needSectionwise
        })
            .then(response => {
                let masterData = {}
                if (Array.isArray(response.data)) {
                    let MaterialSectionOptions = [];
                    MaterialSectionOptions = response.data
                    const productCatMap = constructOptionList(response.data || [], "nsectioncode",
                        "ssectionname", undefined, undefined, true);
                    const productCategoryList = { productCategoryList: productCatMap.get("OptionList") };
                    masterData = { ...Data, ...productCategoryList}
                    dispatch({
                        type: DEFAULT_RETURN, payload: {
                            operation: "create",
                            masterData, updateInfo, ncontrolCode, openModal: true, ismaterialsectionEdit: false, isneedcombomulti: false, screenname: "IDS_MATERIALSECTION", showMaterialSection: true, loading: false, skip: 0, take: 20
                        }
                    });
                }
                else {
                    toast.warn(response.data);
                    masterData = { ...Data }
                    dispatch({
                        type: DEFAULT_RETURN, payload: {
                            operation: "create",
                            masterData, updateInfo, openModal: false, ismaterialsectionEdit: false, isneedcombomulti: false, screenname: "IDS_MATERIALSECTION", showMaterialSection: true, loading: false, skip: 0, take: 20
                        }
                    });
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
            });
    }
}

export function getMaterialSectionEdit(inputparam) {
    return function (dispatch) {
        let urlArray = [];
        let selectedRecord = { ...inputparam.selectedRecord };
        dispatch(initRequest(true));
        const url1 = rsapi().post("/material/getActiveMaterialSectionById", {
            editRow: inputparam["editRow"],
            ncontrolCode: inputparam.ncontrolCode,
            operation: inputparam.operation,
            primaryKeyField: "nmaterialsectioncode",
            primaryKeyValue: inputparam.primaryKeyValue,
            selectedId: inputparam.primaryKeyValue,
            "userinfo": inputparam.userInfo
        })
        const url2 = rsapi().post("/material/getMaterialSection", {
            "userinfo": inputparam.userInfo,
            nmaterialcode: inputparam["editRow"].nmaterialcode, primaryKeyValue: inputparam.primaryKeyValue,
            needSectionwise: inputparam.masterData["SelectedMaterialCategory"].needSectionwise,
            nmaterialsectioncode: inputparam['editRow'].nmaterialsectioncode
            //,nflag:1
        })
        urlArray = [url1, url2]
        Axios.all(urlArray)
            .then(response => {
                const productCatMap = constructOptionList(response[0].data.MaterialSectionEditData || [], "nsectioncode",
                    "ssectionname", undefined, undefined, true);
                selectedRecord["nmaterialsectioncode"] = productCatMap.get("OptionList");
                selectedRecord["nreorderlevel"] = inputparam["editRow"].nreorderlevel;
                selectedRecord["nmaterialsectioncodeprimaryKeyValue"] = inputparam.primaryKeyValue;
                if (!Array.isArray(response[1].data)) {
                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {
                            isOpen: true,
                            selectedRecord,
                            operation: "update",
                            isneedcombomulti: true,
                            selectedId: inputparam.primaryKeyValue,
                            openModal: true, showMaterialSection: true, ismaterialsectionEdit: true, screenname: "IDS_MATERIALSECTION", ncontrolCode: inputparam.ncontrolCode, loading: false
                        }
                    });
                }
                const productCatMap1 = constructOptionList(response[1].data || [], "nsectioncode",
                    "ssectionname", undefined, undefined, true);
                const productCategoryList2 = { productCategoryList: productCatMap1.get("OptionList") };
                //productCategoryList2['productCategoryList']={...selectedRecord["nmaterialsectioncode"]}
                let masterData = {}
                masterData = { ...inputparam.masterData, ...productCategoryList2}

                if (Array.isArray(response[1].data)) {
                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {
                            isOpen: true,
                            selectedRecord,
                            masterData,
                            operation: "update",
                            isneedcombomulti: true,
                            selectedId: inputparam.primaryKeyValue,
                            openModal: true, showMaterialSection: true, ismaterialsectionEdit: true, screenname: "IDS_MATERIALSECTION", ncontrolCode: inputparam.ncontrolCode, loading: false
                        }
                    });
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
                    toast.error(intl.formatMessage({ id: error.message }));
                }
                else {
                    toast.warn(intl.formatMessage({ id: error.response.data }));
                }
            })
    }
}

export function addSafetyInstructions(Data, userInfo, ncontrolcode) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("/material/getMaterialSafetyInstructions", {
            'nmaterialcode': Data["SelectedMaterial"].nmaterialcode,
            "userinfo": userInfo, nflag: 1
        })
            .then(response => {
                if (Array.isArray(response.data["selectedTemplateSafetyInstructions"])) {
                    let selectedRecord = response.data["MaterialSafetyInstructions"].length > 0 ?
                        response.data["MaterialSafetyInstructions"][0].jsondata : []
                    let masterData = {}
                    const MaterialSafetyInstructions = { MaterialSafetyInstructions: response.data["MaterialSafetyInstructions"] }
                    masterData = {
                        ...Data, ...MaterialSafetyInstructions
                                 // ALPD-854
                                  // searchedData: undefined 
                                 }

                    dispatch({
                        type: DEFAULT_RETURN, payload: {
                            masterData, loading: false,
                            loadEsign: false,
                            selectedRecord,
                            ncontrolCode: ncontrolcode
                            , openModal: true, screenname: "IDS_MATERIALSAFETYINSTRUCTIONS"
                        }
                    });
                }
                else {
                    toast.warn(response.data);
                    dispatch({
                        type: DEFAULT_RETURN, payload: {
                            loading: false
                        }
                    });

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
            });
    }
}

export function addMaterialProperty(Data, userInfo, ncontrolcode, timeZone) {
    return function (dispatch) {
        dispatch(initRequest(true));
        let urlArray = [];
        let date;
        let timeZoneList;
        //const timezone = rsapi().post("timezone/getTimeZone");
        const getMaterialSafety = rsapi().post("/material/getMaterialSafetyInstructions", {
            'nmaterialcode': Data["SelectedMaterial"].nmaterialcode,
            "userinfo": userInfo, nflag: 2
        })
        urlArray = [getMaterialSafety]
        Axios.all(urlArray)
            .then(response => {
                if (Array.isArray(response[0].data["selectedTemplateProperties"])) {
                    let selectedRecord = response[0].data["MaterialProperties"].length > 0 ?
                        response[0].data["MaterialProperties"][0].jsondata : []
                    let masterData = {}
                    const MaterialProperties = { MaterialProperties: response[0].data["MaterialProperties"] }
                    // if (response[0].data["MaterialProperties"].length > 0) {
                    //     if (response[0].data["MaterialPropertiesDateFeild"]) {
                    //         response[0].data["MaterialPropertiesDateFeild"].map((temp) => {
                    //             response[0].data["MaterialProperties"][0].jsondata[temp] =
                    //                 rearrangeDateFormat(userInfo, response[0].data["MaterialProperties"][0].jsondata[temp])

                    //         })
                    //     }
                    // }
                    response[0].data['selectedTemplateProperties'][0]['jsondata'].map((row) => {
                        row.children.map((column) => {
                            column.children.map((component, i) => {

                                if (component.inputtype === 'date') {
                                    if (response[0].data["MaterialProperties"][0]) {
                                    if (response[0].data["MaterialProperties"][0].jsondata[component.label] !== "-") {
                                        if (response[0].data["MaterialProperties"][0]) {
                                            response[0].data["MaterialProperties"][0].jsondata[component.label] =
                                                rearrangeDateFormat(userInfo, response[0].data["MaterialProperties"][0].jsondata[component.label])
                                        }
                                    }else {
                                        if (response[0].data["MaterialProperties"][0]) {
                                        delete response[0].data["MaterialProperties"][0].jsondata[component.label]
                                        }
                                    }
                                }
                                    else {
                                        if (response[0].data["MaterialProperties"][0]) {
                                        delete response[0].data["MaterialProperties"][0].jsondata[component.label]
                                        }
                                    }

                                }
                            })
                        })
                    })
                    //   response[0].data["MaterialProperties"][0].jsondata['IDS_DATEOFSTANDARDIZATION'] =
                    // rearrangeDateFormat(userInfo, response[0].data["MaterialProperties"][0].jsondata['IDS_DATEOFSTANDARDIZATION'])
                    //new Date(response[0].data["MaterialProperties"][0].jsondata['IDS_DATEOFSTANDARDIZATION'])


                    masterData = {
                        ...Data, ...MaterialProperties,
                       // ALPD-854
                        // searchedData: undefined 
                    }
                    Data['selectedTemplateProperties'][0].jsondata.map((row) => {
                        row.children.map((column) => {
                            column.children.map((component) => {
                                if (component.inputtype === 'date') {
                                    if (userInfo.isutcenabled === transactionStatus.YES && 
                                        userInfo.istimezoneshow === transactionStatus.YES) {
                                        const timeZoneListMap = constructOptionList(timeZone || [], "ntimezonecode",
                                            "stimezoneid", undefined, undefined, true);
                                        timeZoneList = timeZoneListMap.get("OptionList");
                                        if(response[0].data["MaterialProperties"].length === 0) {
                                        const timezone=  timeZoneList.filter(x=>x.value===userInfo.ntimezonecode);
                                        selectedRecord[`tz${component.label}`] = timezone[0]
                                            }
                                    }
                                }
                            })
                        })
                    })

                    dispatch({
                        type: DEFAULT_RETURN, payload: {
                            masterData, loading: false,
                            loadEsign: false,
                            selectedRecord,
                            isSelectedRecordChange: false,
                            timeZoneList,
                            ncontrolCode: ncontrolcode
                            , openModal: true, screenname: "IDS_MATERIALPROPERTY"
                        }
                    });
                }
                else {
                    toast.warn(response.data||response[0].data);
                    dispatch({
                        type: DEFAULT_RETURN, payload: {
                            loading: false
                        }
                    });
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
            });
    }
}
export function addMaterialFile(inputParam, param) {
    return (dispatch) => {
        dispatch(initRequest(true));
        let urlArray = [rsapi().post("/material/getMaterialLinkMaster", {
            nmaterialcode: param.nmaterialcode && param.nmaterialcode,
            userinfo: inputParam.userInfo
        })];
        if (inputParam.operation === "update") {
            urlArray.push(rsapi().post("/material/editMaterialMsdsAttachment", {
                userinfo: inputParam.userInfo,
                nmaterialcode: param.nmaterialcode && param.nmaterialcode,
                nmaterialfilecode: inputParam.selectedRecord.nmaterialfilecode
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
                            ndefaultstatus: editObject["jsondata"].ndefaultstatus===3?3:4,
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
                            nlinkdefaultstatus: editObject["jsondata"].ndefaultstatus
                        }
                    }
                    selectedRecord = {
                        ...link,
                        sdescription: editObject["jsondata"].sdescription,
                        nmaterialfilecode: editObject["jsondata"].nmaterialfilecode,
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



export function addMaterialAccountingProperty(Data, userInfo, ncontrolcode) {
    return function (dispatch) {
        dispatch(initRequest(true));
        let urlArray = [];
        let date;
        let timeZoneList;
        const timezone = rsapi().post("timezone/getTimeZone");
        const getMaterialSafety = rsapi().post("/material/getMaterialAcountingProperties", {
            'nmaterialcode': Data["SelectedMaterial"].nmaterialcode,
            "userinfo": userInfo, nflag: 2
        })
        urlArray = [getMaterialSafety, timezone]
        Axios.all(urlArray)
            .then(response => {
                if (Array.isArray(response[0].data["selectedTemplateProperties"])) {
                    let selectedRecord = response[0].data["MaterialProperties"].length > 0 ?
                        response[0].data["MaterialProperties"][0].jsondata : []
                    let masterData = {}
                    const MaterialProperties = { MaterialProperties: response[0].data["MaterialProperties"] }
                    const selectedTemplateProperties=response[0].data["selectedTemplateProperties"]
                    // if (response[0].data["MaterialProperties"].length > 0) 
                    //     if (response[0].data["MaterialPropertiesDateFeild"]) {
                    //         response[0].data["MaterialPropertiesDateFeild"].map((temp) => {
                    //             response[0].data["MaterialProperties"][0].jsondata[temp] =
                    //                 rearrangeDateFormat(userInfo, response[0].data["MaterialProperties"][0].jsondata[temp])

                    //         })
                    //     }
                    // }
                    response[0].data['selectedTemplateProperties'][0]['jsondata'].map((row) => {
                        row.children.map((column) => {
                            column.children.map((component, i) => {

                                if (component.inputtype === 'date') {
                                    if (response[0].data["MaterialProperties"][0]) {
                                    if (response[0].data["MaterialProperties"][0].jsondata[component.label] !== "-") {
                                        if (response[0].data["MaterialProperties"][0]) {
                                            response[0].data["MaterialProperties"][0].jsondata[component.label] =
                                                rearrangeDateFormat(userInfo, response[0].data["MaterialProperties"][0].jsondata[component.label])
                                        }
                                    }else {
                                        if (response[0].data["MaterialProperties"][0]) {
                                        delete response[0].data["MaterialProperties"][0].jsondata[component.label]
                                        }
                                    }
                                }
                                    else {
                                        if (response[0].data["MaterialProperties"][0]) {
                                        delete response[0].data["MaterialProperties"][0].jsondata[component.label]
                                        }
                                    }

                                }
                            })
                        })
                    })
                    //   response[0].data["MaterialProperties"][0].jsondata['IDS_DATEOFSTANDARDIZATION'] =
                    // rearrangeDateFormat(userInfo, response[0].data["MaterialProperties"][0].jsondata['IDS_DATEOFSTANDARDIZATION'])
                    //new Date(response[0].data["MaterialProperties"][0].jsondata['IDS_DATEOFSTANDARDIZATION'])


                    masterData = {
                        ...Data, ...MaterialProperties, selectedTemplateProperties
                       // ALPD-854
                        // searchedData: undefined 
                    }
                    Data['selectedTemplateProperties'][0].jsondata.map((row) => {
                        row.children.map((column) => {
                            column.children.map((component) => {
                                if (component.inputtype === 'date') {
                                    if (component.hasOwnProperty('timezone')) {
                                        const timeZoneListMap = constructOptionList(response[1].data || [], "ntimezonecode",
                                            "stimezoneid", undefined, undefined, true);
                                        timeZoneList = timeZoneListMap.get("OptionList");

                                        response[0].data["DateFeildsProperties"].map((temp) => {
                                            if (!selectedRecord.hasOwnProperty(temp)) {
                                                selectedRecord[`tz${temp}`] = timeZoneList[0]
                                            }
                                        })
                                    }
                                }
                            })
                        })
                    })


                    dispatch({
                        type: DEFAULT_RETURN, payload: {
                            masterData, loading: false,
                            loadEsign: false,
                            selectedRecord,
                            isSelectedRecordChange: false,
                            timeZoneList,
                            ncontrolCode: ncontrolcode
                            , openModal: true, screenname: "IDS_MATERIALACCOUNTING"
                        }
                    });
                }
                else {
                    toast.warn(response.data||response[0].data);
                    dispatch({
                        type: DEFAULT_RETURN, payload: {
                            loading: false
                        }
                    });
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
            });
    }
}




export function getAddMaterialAccountingPopup(operation, loginInfo, selectedcombo, ncontrolCode, masterData, selectedRecord,screenname,samplestate) {
    return function (dispatch) {
        if (masterData.SelectedMaterialCategoryFilter) {
            if (operation === "create") {
                let urlArray = [];
                let templateData = [];
                let data = [];
                let toggleComponents = [];
                let radioComponents = [];
                let filterQueryComponents = [];
                let dataparent = [];
                const withoutCombocomponent = [];
                let selectedTemplate=[];
                let Layout = masterData.selectedTemplate[0].jsondata;
                if(samplestate==="powder" || samplestate==="Liquid"){
                     Layout = masterData.selectedTemplatepowder[0].jsondata
                     selectedTemplate=masterData.selectedTemplatepowder
                }
                // else if(samplestate==="Liquid"){
                //      Layout = masterData.selectedTemplatesolution[0].jsondata 
                //      selectedTemplate=masterData.selectedTemplatesolution
                // }
                else{
                    selectedTemplate=masterData.selectedTemplatePellet
                }
               
                masterData={
                    samplestate:samplestate,
                    ...masterData,
                    selectedTemplate
                }
                //const Layout = masterData.selectedTemplate[0].jsondata
                Layout.map(row => {
                    return row.children.map(column => {
                        return column.children.map(component => {
                            if (component.hasOwnProperty("parent")) {
                                dataparent.push(component)
                            }
                            if (component.inputtype === 'toggle') {
                                toggleComponents.push(component)
                            }
                            if (component.inputtype === 'radio') {
                                radioComponents.push(component)
                            }
                            if (component.hasOwnProperty("nsqlquerycode")) {
                                filterQueryComponents.push(component)
                            }
                            return component.hasOwnProperty("children") ? component.children.map(componentrow => {
                                if (componentrow.inputtype === 'toggle') {
                                    toggleComponents.push(componentrow)
                                }
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
                                : component.inputtype === "combo" && !(component.hasOwnProperty("parent")) ? 
                                data.push(component) : withoutCombocomponent.push(component)
                        })
                    })
                })
                const comboComponents = data
                const Material = rsapi().post("/material/getMaterialAvailableQty", { 'nmaterialcode': masterData.SelectedMaterial.nmaterialcode,
                 "userinfo": loginInfo.userInfo });

                dataparent[0] = {
                    displaymember: dataparent[0].displaymember,
                    inputtype: dataparent[0].inputtype,
                    label: dataparent[0].label,
                    source: dataparent[0].source,
                    type: dataparent[0].type,
                    valuemember: dataparent[0].valuemember,
                    nquerybuildertablecode: dataparent[0].nquerybuildertablecode
                }
                let filterQueryComponents1 = []
                filterQueryComponents.map(temp => {
                    filterQueryComponents1 += temp.nsqlquerycode + ','
                })
                const materialReq1 = rsapi().post("dynamicpreregdesign/getComboValues",
                    {
                        "nmaterialtypecode": masterData.SelectedMaterialTypeFilter[0].nmaterialtypecode
                        , "userinfo": loginInfo.userInfo, "parentcolumnlist": comboComponents,
                        "filterQueryComponents": filterQueryComponents1.substring(0, filterQueryComponents1.length - 1)
                    });
                const materialReq2 = rsapi().post('dynamicpreregdesign/getChildValues', {
                   
                    child: Layout[0].children[0].children[0].childValue || [],
                    parentdata: { nmaterialtypecode: masterData.SelectedMaterialTypeFilter[0].nmaterialtypecode },
                    parentsource: 'materialcategory',
                    'nmaterialtypecode':masterData.SelectedMaterialTypeFilter[0].nmaterialtypecode,
                    valuemember: 'nmaterialtypecode',
                    "userinfo": loginInfo.userInfo,
                    parentcolumnlist: dataparent
                });
                urlArray = [materialReq1, materialReq2,Material
                    //,materialReq3
                ];
                dispatch(initRequest(true));
                Axios.all(urlArray)
                    .then(response => {
                        templateData = response[0].data;
                        data.splice(1, 0, dataparent[0])
                        const temp2 = { ...response[0].data, ...response[1].data }
                        templateData = parentChildComboLoad(data, temp2, selectedRecord, null, withoutCombocomponent, undefined, loginInfo.userInfo.slanguagetypecode, loginInfo.userInfo)
                        toggleComponents.map((temp) => {
                            if (temp.hasOwnProperty('defaultchecked') && temp.defaultchecked === transactionStatus.YES) {
                                templateData['selectedRecord'] = {
                                    ...templateData['selectedRecord'],
                                    [temp.label]: temp.defaultchecked
                                }
                            }
                        })
                        radioComponents.map((temp) => {
                            if (temp.hasOwnProperty('radioOptions')) {
                                let tags=temp.radioOptions.tags
                                tags.map((tag) => {
                                    if(tag.hasOwnProperty('defaultchecked'))
                                    templateData['selectedRecord'] = {
                                        ...templateData['selectedRecord'],
                                        [temp.label]: tag['defaultchecked']
                                    }
                                })
                            }
                        })
                      
                        const defaultValue = [];
                        response[2].data.Productname.map(item => {
                            defaultValue.push({
                                label: item['sproductname'], value: item['sproductname'],
                                item: item
                              })
                            return defaultValue
                              
                            
                          });
                          templateData['comboData'] = {
                            ...templateData['comboData'],
                            'SampleName':defaultValue
                        }
                        selectedRecord = templateData['selectedRecord']
                        //delete templateData.selectedRecord["Material Category"]
                        if(masterData.SelectedMaterialCategoryFilter&&masterData.SelectedMaterialCategoryFilter.length!==0){
                            templateData['comboData']["Material Category"].map(item=>{
                                if (masterData.SelectedMaterialCategoryFilter.nmaterialcatcode === item.value) {
                                    selectedRecord = {
                                        "Material Category": {
                                            "label": masterData.SelectedMaterialCategoryFilter.smaterialcatname,
                                            "value": masterData.SelectedMaterialCategoryFilter.nmaterialcatcode,
                                            "item": { "jsondata": item.item.jsondata,"pkey": "nmaterialcatcode", "source": "materialcategory" }                               
                                        },
                                  
                                    }
                                }
                       })      
                     }

                    selectedRecord['AvailableQty'] = response[2].data.AvailableQty
                    selectedRecord['AvailableUraniumQty'] = response[2].data.AvailableUraniumQty
                    selectedRecord['MaterialName']= masterData.SelectedMaterial["Material Name"]
                    //selectedRecord['SampleName']= masterData.SelectedMaterial["Material Name"]
                    selectedRecord['suraniumconversionfactor'] = response[2].data.suraniumconversionfactor
                    selectedRecord['Transaction Date']=rearrangeDateFormat(loginInfo.userInfo,masterData.Currentdate)
                   
                    selectedRecord = {
                        "materialinventorytype": {
                            "label": response[2].data.Inventorytype.sinventorytypename,
                            "value": response[2].data.Inventorytype.ninventorytypecode,
                                                          
                        },
                        "SampleName": {
                            "label": masterData.SelectedMaterial["Material Name"],
                            "value": 0,
                                                          
                        },
                  ...selectedRecord
                    }
                  
                    
                        dispatch({
                            type: DEFAULT_RETURN, payload: {
                                operation, screenname: screenname,masterData:masterData,
                                //ismaterialSectionneed:response[2].data.ismaterialSectionneed,
                                selectedRecord, showMaterialSection: false, templateData, openModal: true, selectedcombo,
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
        }
        else {
            toast.warn(intl.formatMessage({ id: "IDS_CONFIGMATERIALCAT" }));
        }
    }
    
}


export function getReportDetails(masterData, userInfo) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("material/getUraniumContentType", {          
            "userinfo": userInfo
        })
            .then(response => {
                //let UraniumContentType=;
                const uraniumcontenttypeMap = constructOptionList(response.data.lstUraniumContentType || [], "nuraniumcontenttypecode",
                "suraniumcontenttype", undefined, undefined, false);
                const UraniumContentType = uraniumcontenttypeMap.get("OptionList");

                const accountingPlantGroupMap = constructOptionList(response.data.lstAccountingPlantGroup || [], "nmaterialaccountinggroupcode",
                "smaterialaccountinggroupname", undefined, undefined, false);
                const accountingPlantGroup = accountingPlantGroupMap.get("OptionList");

              //  const defaultValue = [];
                // response.data.month.map((item, index)=> {
                //     defaultValue.push({
                //         label: item[index],
                //         item: index
                //       })
                //     return defaultValue
                      
                    
                //   });
                const listOfMonth = Object.keys(response.data.month).map(key => ({
                    label: response.data.month[key],
                    value: parseInt(key)
                }));
                            
                masterData = { ...masterData, UraniumContentType,listOfMonth,accountingPlantGroup };
                //sortData(masterData);
                dispatch({ 
                    type: DEFAULT_RETURN, 
                    payload: { masterData, loading: false,modalShow:true } 
                });
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