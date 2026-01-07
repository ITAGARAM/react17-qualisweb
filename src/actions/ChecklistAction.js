import rsapi from '../rsapi';
import { DEFAULT_RETURN, UN_AUTHORIZED_ACCESS } from './LoginTypes';
import { constructOptionList, sortData,rearrangeDateFormat } from '../components/CommonScript'
import { toast } from 'react-toastify';
import Axios from 'axios';
import { initRequest } from './LoginAction';
import { intl } from '../components/App';

export function getChecklistVersion(checklist, userInfo, masterData) {

    return function (dispatch) {
        const inputData = { "nchecklistcode": checklist.nchecklistcode, userinfo: userInfo }
        dispatch(initRequest(true));
        rsapi().post("checklist/getChecklistVersion", inputData)
            .then(response => {

                masterData = {
                    ...masterData,
                    ...response.data,
                    selectedchecklist: checklist,
                }
                sortData(masterData)
                dispatch({
                    type: DEFAULT_RETURN, payload: { masterData, loading: false }
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

export function getVersionQB(versionObject) {
    let { version, masterData, userInfo } = versionObject
    return function (dispatch) {
        if (!(masterData.selectedversion.nchecklistversioncode === version.nchecklistversioncode)) {
            const inputData = { nchecklistversioncode: version.nchecklistversioncode, userinfo: userInfo }
            //const url1=rsapi().post('checklist/getActiveChecklistVersionById',inputData)
            const url2 = rsapi().post('checklist/getChecklistVersionQB', inputData)
            dispatch(initRequest(true));
            Axios.all([url2])
                .then(response => {
                    masterData = {
                        ...masterData,
                        checklistversionqb: response[0].data.checklistversionqb,
                        selectedversion: version
                    }
                    sortData(masterData)
                    dispatch({
                        type: DEFAULT_RETURN, payload: {
                            masterData,
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
        } else {
            dispatch({
                type: DEFAULT_RETURN, payload: { masterData, loading: false }
            })
        }
    }
}

export function viewVersionTemplate(version, userInfo, ncontrolCode) {

    return function (dispatch) {

        dispatch(initRequest(true));
        rsapi().post("checklist/viewTemplate", {
            "nchecklistversioncode": version.nchecklistversioncode, "flag": 1, "ntransactionresultcode": 1
            , "userinfo": userInfo
        })
            .then(response => {

                let selectedRecord = {};
                let lsteditedQB = [];

                response.data.map(checklist => {
                    selectedRecord[checklist.nchecklistversionqbcode] = {
                        nchecklistqbcode: checklist.nchecklistqbcode,
                        nchecklistversioncode: checklist.nchecklistversioncode,
                        nchecklistversionqbcode: checklist.nchecklistversionqbcode,
                        //ALPD-3850 issue : if date field is empty try to convert format.Solution: date field is empty not format.
		                //Query changed by Saravanan 13-11-2024
                        sdefaultvalue: checklist.nchecklistcomponentcode === 7 && (checklist.sdefaultvalue!==null && checklist.sdefaultvalue.lengh>0)  ? rearrangeDateFormat(userInfo,checklist.sdefaultvalue) :checklist.sdefaultvalue === 'null' ? undefined : checklist.sdefaultvalue ,
                     
                    }
                    lsteditedQB.push(checklist.nchecklistversionqbcode);
                    return null;
                });
                response.data.map(checklist => {
                    selectedRecord['jsondata'] = {
                        ...selectedRecord['jsondata'],
                        [checklist.nchecklistversionqbcode]:checklist.nchecklistcomponentcode ===7 && (checklist.sdefaultvalue!==null && checklist.sdefaultvalue.lengh>0) ? rearrangeDateFormat(userInfo,checklist.sdefaultvalue) :checklist.sdefaultvalue === 'null' ? undefined : checklist.sdefaultvalue 
                    }
                    return null;
                });
                selectedRecord["editedQB"] = lsteditedQB;


                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        openTemplateModal: true,
                        templateData: response.data,
                        loading: false,
                        ncontrolcode:ncontrolCode,
                        selectedRecord: selectedRecord
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
// export function filterChecklistColumnData(filterValue, masterData, userInfo) {
//     return function(dispatch){
//         let checklistCode = 0;   
//         let searchedData = undefined;
//         if (filterValue === ""){
//             checklistCode = masterData["checklist"][0].nchecklistcode;
//         } 
//         else{

//             searchedData = searchData(filterValue, masterData["checklist"]);

//             if (searchedData.length > 0){
//                 checklistCode = searchedData[0].nchecklistcode; 
//             }

//         }
//         if (checklistCode !== 0){

//             dispatch(initRequest(true));
//             rsapi().post("checklist/getChecklistVersion", {nchecklistcode:checklistCode,userinfo:userInfo})
//             .then(response=>{                
//                 masterData["checklistversion"] = sortData(response.data["checklistversion"]);
//                 masterData["selectedversion"] = response.data["selectedversion"];
//                 masterData["checklistversionqb"] =  sortData(response.data["checklistversionqb"]);
//                 masterData["selectedchecklist"] =searchedData?searchedData[0]:masterData["checklist"][0];
//                 masterData["searchedData"] = searchedData;
//                 dispatch({type: DEFAULT_RETURN, payload:{masterData,   loading:false}});
//             })
//             .catch(error=>{
//                 dispatch({type: DEFAULT_RETURN, payload: {loading:false}})
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
//        } else if (error.response.status === 500){
//                     toast.error(error.message);
//                 } 
//                 else{               
//                     toast.warn(error.response.data);
//                 }  
//             }) 

//         }else{
//             masterData["checklistversion"] = [];
//             masterData["selectedversion"] = [];
//             masterData["checklistversionqb"] = [];
//             masterData["selectedchecklist"] =[];
//             masterData["searchedData"] = [];
//             dispatch({type: DEFAULT_RETURN, payload:{masterData,   loading:false}});

//         }
//     }
// }   

export function onSaveTemplate(selectedRecord, userInfo) {

    return function (dispatch) {

        
        let listChecklistVersionTemplate = [];
        if (selectedRecord && selectedRecord.editedQB) {
            selectedRecord.editedQB.map(qbcode =>
                listChecklistVersionTemplate.push(selectedRecord[qbcode] && selectedRecord[qbcode].sdefaultvalue !=null ? selectedRecord[qbcode]:
                     selectedRecord[qbcode]={
                        "nchecklistqbcode":selectedRecord[qbcode].nchecklistqbcode,
                        "nchecklistversioncode":selectedRecord[qbcode].nchecklistversioncode,
                        "nchecklistversionqbcode":selectedRecord[qbcode].nchecklistversionqbcode,
                        "sdefaultvalue":""

                     }  ))

              //  listChecklistVersionTemplate.push(selectedRecord[qbcode]))
            dispatch(initRequest(true));
            rsapi().post("checklist/createUpdateChecklistVersionTemplate",
                { checklistversiontemplate: listChecklistVersionTemplate, "userinfo": userInfo })

                .then(response => {

                    dispatch({
                        type: DEFAULT_RETURN, payload: {
                            selectedRecord: {},
                            templateData: undefined,
                            openTemplateModal: false,
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
                    }
                    else {
                        toast.warn(error.response.data);
                    }
                })
        } else {

            dispatch({
                type: DEFAULT_RETURN, payload: {
                    openTemplateModal: false, selectedRecord: {},templateData: undefined, loading: false
                }
            })
        }
    }
}


export function showChecklistAddScreen(nchecklistversioncode, id, ncontrolcode, userInfo) {
    return function (dispatch) {
        let modalName = (id === 'checklist') ? 'openModal' : 'openChildModal'
        if (id === "checklistversionqb") {
            dispatch(initRequest(true));
            rsapi().post("checklist/getVersionQBAddEditData",
                { "nchecklistversioncode": nchecklistversioncode, "userinfo": userInfo })
                .then(response => {
                    const optionsQBCategoryMap = constructOptionList(response.data.qbcategory || [], "nchecklistqbcategorycode", "schecklistqbcategoryname", undefined, undefined, true);
                    const availableQBCategory = optionsQBCategoryMap.get("OptionList");
                    let listQbObj={listQb:{}};
                    let optionsChecklistComponentMap;
                    availableQBCategory.map(cat=>
                        {
                        optionsChecklistComponentMap = constructOptionList(response.data.checklistqb[cat.label] || [], "nchecklistqbcode", "squestion", undefined, undefined, true);
                        listQbObj={listQb:{...listQbObj.listQb,[cat.label]: optionsChecklistComponentMap.get("OptionList")}};
                        return null;
                        }
                    )
                    
                    dispatch({
                        type: DEFAULT_RETURN, payload: {
                            [modalName]: true,
                            selectedRecord: {},
                            operation: "create",
                            id, 
                            QBCategory: undefined, 
                            QB: undefined,
                            availableQBCategory,
                            listQb:listQbObj.listQb,
                            availableQB: [],
                            ncontrolcode, loading: false
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
        } else {
            dispatch({
                type: DEFAULT_RETURN, payload: {
                    [modalName]: true,
                    selectedRecord: {},
                    operation: "create",
                    id,
                    ncontrolcode,
                    loading: false
                }
            })
        }
    }
}

export function fetchChecklistRecordByID(editParam) {
    return function (dispatch) {

        if (editParam.screenName.toLowerCase() === "checklist" || editParam.screenName.toLowerCase() === "checklistversion") {
            let modalName = editParam.screenName.toLowerCase() === "checklist" ? 'openModal' : 'openChildModal'
            dispatch(initRequest(true));
            rsapi().post("checklist/getActive" + editParam.screenName + "ById",
                { [editParam.primaryKeyField]: editParam.primaryKeyValue, "userinfo": editParam.userInfo })

                .then(response => {
                    dispatch({
                        type: DEFAULT_RETURN, payload: {
                            [modalName]: true,
                            selectedRecord: response.data,
                            operation: editParam.operation,
                            id: editParam.screenName.toLowerCase(),
                            ncontrolcode: editParam.ncontrolCode,
                            masterData: editParam.masterData,
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
                    }
                    else {
                        toast.warn(error.response.data);
                    }
                })
        } else {
            const url1 = rsapi().post("checklist/getVersionQBAddEditData",
                { "nchecklistversioncode": editParam.masterData.selectedversion.nchecklistversioncode, "userinfo": editParam.userInfo })
            const url2 = rsapi().post("checklist/getActive" + editParam.screenName + "ById",
                { [editParam.primaryKeyField]: editParam.primaryKeyValue, "userinfo": editParam.userInfo })
            dispatch(initRequest(true));
            Axios.all([url1, url2])
                .then(response => {
                    let selectedId = editParam.primaryKeyValue
                    // const optionsQBCategoryMap = constructOptionList(response[0].data.qbcategory || [], "nchecklistqbcategorycode", "schecklistqbcategoryname", undefined, undefined, true);
                    // const optionsChecklistComponentMap = constructOptionList(response[0].data.checklistqb || [], "nchecklistqbcode", "squestion", undefined, undefined, true);
                    // const availableQBCategory = optionsQBCategoryMap.get("OptionList");
                    // const availableQB = optionsChecklistComponentMap.get("OptionList");
                    dispatch({
                        type: DEFAULT_RETURN, payload: {
                            masterData: editParam.masterData,
                            openChildModal: true,
                            selectedRecord: response[1].data,
                            operation: "update",
                            id: editParam.screenName.toLowerCase(),
                            // availableQBCategory ,
                            // availableQB ,
                            QBCategory: { "value": response[1].data["nchecklistqbcategorycode"], "label": response[1].data["schecklistqbcategoryname"] },
                            QB: { "value": response[1].data["nchecklistqbcode"], "label": response[1].data["squestion"] },
                            ncontrolcode: editParam.ncontrolCode, loading: false, selectedId
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
}