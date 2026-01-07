import rsapi from '../rsapi';
import { DEFAULT_RETURN, UN_AUTHORIZED_ACCESS } from './LoginTypes';
import { toast } from 'react-toastify';
import Axios from 'axios';
import { initRequest } from './LoginAction';
import { sortData, constructOptionList, formatInputDate, showEsign, rearrangeDateFormat } from '../components/CommonScript';
import { intl } from '../components/App';
import { crudMaster } from './ServiceAction';
import { transactionStatus } from '../components/Enumeration';


export function getBatchCreationComboService(batchParam) {
    return function (dispatch) {

        if (batchParam.operation === "update" && batchParam.masterData.SelectedBatchCreation.ntransactionstatus === transactionStatus.CANCELLED){
            toast.warn(intl.formatMessage({ id: "IDS_CANNOTEDITCANCELLEDBATCH"}));
        }
        else{
            let nreleasebatchcode = null;
            if (batchParam.operation === "update") {
                nreleasebatchcode = batchParam.primaryKeyValue;
            }

            const currentDate = formatInputDate(new Date(), true);
            const batchService = rsapi().post("batchcreation/getBatchCreationComboData",//"productcategory/getProductCategory", 
                {
                    userinfo: batchParam.userInfo, currentdate: currentDate,
                    nreleasebatchcode,
                    ncontrolcode: batchParam.ncontrolCode
                });

            const timeZoneService = rsapi().post("timezone/getTimeZone");

            let urlArray = [batchService, timeZoneService];

            dispatch(initRequest(true));
            Axios.all(urlArray)
                .then(response => {

                    const productCatMap = constructOptionList(response[0].data["ProductCategory"] || [], "nproductcatcode",
                        "sproductcatname", undefined, undefined, true);
                    const productCatList = productCatMap.get("OptionList");

                    const productMap = constructOptionList(response[0].data["Product"] || [], "nproductcode",
                        "sproductname", undefined, undefined, true);

                    const productList = productMap.get("OptionList");

                    const studyPlanMap = constructOptionList(response[0].data["StudyPlan"] || [], "nallottedspeccode",
                        "sspecname", undefined, undefined, true);

                    const studyPlanList = studyPlanMap.get("OptionList");

                    const timeZoneMap = constructOptionList(response[1].data || [], "ntimezonecode",
                        "stimezoneid", undefined, undefined, true);

                    const timeZoneList = timeZoneMap.get("OptionList");

                    let selectedRecord = {};
                    //let respObject = {};
                    if (batchParam.operation === "update") {

                        let validityTimeZone = [];
                        let expiryTimeZone = [];
                        const selectedBatch = response[0].data["SelectedBatchCreation"];
                     
                        selectedRecord = JSON.parse(JSON.stringify(response[0].data["SelectedBatchCreation"]));

                        selectedRecord["nproductcatcode"] = { "value": selectedBatch["nproductcatcode"], "label": selectedBatch["sproductcatname"] };
                        selectedRecord["nproductcode"] = { "value": selectedBatch["nproductcode"], "label": selectedBatch["sproductname"] };

                        selectedRecord["schargebandname"] = selectedBatch["schargebandname"];
                        selectedRecord["sdeptname"] = selectedBatch["sdeptname"];

                        selectedRecord["nallottedspeccode"] = { "value": selectedBatch["nallottedspeccode"], "label": selectedBatch["sspecname"] };

                        selectedRecord["smanufsitename"] = selectedBatch["smanufsitename"];
                        selectedRecord["slicencenumber"] = selectedBatch["slicencenumber"];
                        selectedRecord["scertificatetype"] = selectedBatch["scertificatetype"];
                        selectedRecord["scontainertype"] = selectedBatch["scontainertype"];
                        selectedRecord["saddress1"] = selectedBatch["saddress1"];

                        validityTimeZone.push({ "value": selectedBatch["ntzvaliditystartdate"], "label": selectedBatch["stzvaliditystartdate"] });
                        expiryTimeZone.push({ "value": selectedBatch["ntzexpirydate"], "label": selectedBatch["stzexpirydate"] });

                       
                        // selectedRecord["dvaliditystartdate"] = new Date(selectedBatch["svaliditystartdate"]);
                        // selectedRecord["dexpirydate"] = new Date(selectedBatch["sexpirydate"]);
                        selectedRecord["dvaliditystartdate"] = rearrangeDateFormat(batchParam.userInfo, selectedBatch["svaliditystartdate"]);
                        selectedRecord["dexpirydate"] = rearrangeDateFormat(batchParam.userInfo, selectedBatch["sexpirydate"]);

                        selectedRecord["ntzvaliditystartdate"] = validityTimeZone[0];
                        selectedRecord["stzvaliditystartdate"] = validityTimeZone[0].label;
                        selectedRecord["ntzexpirydate"] = expiryTimeZone[0];
                        selectedRecord["stzexpirydate"] = expiryTimeZone[0].label;

                    }
                    else {
                        //add operation 
                        
                        selectedRecord = {                     
                                            "dvaliditystartdate": rearrangeDateFormat(batchParam.userInfo, response[0].data["ValidityStartDate"]),
                                            "dexpirydate": rearrangeDateFormat(batchParam.userInfo, response[0].data["ExpiryDate"]),
                                            "ntzvaliditystartdate": {
                                                "value": batchParam.userInfo.ntimezonecode,
                                                "label": batchParam.userInfo.stimezoneid
                                            },
                                            "stzvaliditystartdate": batchParam.userInfo.stimezoneid,
                                            "ntzexpirydate": {
                                                "value": batchParam.userInfo.ntimezonecode,
                                                "label": batchParam.userInfo.stimezoneid
                                            },
                                            "stzexpirydate": batchParam.userInfo.stimezoneid
                                        };
                        if (response[0].data["SelectedProductCategory"] !== null)
                        {
                            selectedRecord["nproductcatcode"]= {    label: response[0].data["SelectedProductCategory"].sproductcatname,
                                                                    value: response[0].data["SelectedProductCategory"].nproductcatcode,
                                                                    item: response[0].data["SelectedProductCategory"]
                                                                }
                        }
                        if (response[0].data["SelectedProduct"] !== undefined) {
                            selectedRecord["nproductcode"] = {
                                label: response[0].data["SelectedProduct"].sproductname,
                                value: response[0].data["SelectedProduct"].nproductcode,
                                item: response[0].data["SelectedProduct"]
                            };
                            selectedRecord["schargebandname"] = response[0].data["SelectedProduct"].schargebandname;
                            selectedRecord["sdeptname"] = response[0].data["SelectedProduct"].sdeptname;
                        }

                        //selectedRecord["nproductcatcode"]= productCatMap.get("DefaultValue");
                        //selectedRecord["nproductcode"]= productMap.get("DefaultValue");

                    }

                    dispatch({
                        type: DEFAULT_RETURN, payload: {
                            productCategoryList: productCatList,
                            productList,
                            studyPlanList,
                            timeZoneList,
                            productManufacturerList: response[0].data["ProductManufacturer"] || [],
                            batchCreationEditStatusList:response[0].data["BatchCreationEditStatus"]|| [],
                            operation: batchParam.operation,
                            screenName: batchParam.screenName,
                            selectedRecord,
                            openModal: true,
                            ncontrolCode: batchParam.ncontrolCode,
                            loading: false, selectedId: nreleasebatchcode
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
}

export function getBatchProductCategoryComboChange(selectedRecord) {
    return function (dispatch) {

        dispatch(initRequest(true));
        rsapi().post("batchcreation/getProductCategoryComboChange", { nproductcatcode: selectedRecord.nproductcatcode.value })
            .then(response => {
                let productList = [];
                let studyPlanList = [];              

                const selected = {nproductcatcode: selectedRecord["nproductcatcode"],
                                    dvaliditystartdate:selectedRecord["dvaliditystartdate"],
                                    ntzvaliditystartdate:selectedRecord["ntzvaliditystartdate"],
                                    dexpirydate:selectedRecord["dexpirydate"],
                                    ntzexpirydate:selectedRecord["ntzexpirydate"],
                                    stzvaliditystartdate:selectedRecord["stzvaliditystartdate"],
                                    stzexpirydate:selectedRecord["stzexpirydate"]
                                };
                selectedRecord = selected;
            
                const productMap = constructOptionList(response.data["Product"] || [], "nproductcode",
                    "sproductname", undefined, undefined, true);
                productList = productMap.get("OptionList");
                selectedRecord["nproductcode"] = productMap.get("DefaultValue");

                const studyPlanMap = constructOptionList(response.data["StudyPlan"] || [], "nallottedspeccode",
                    "sspecname", undefined, undefined, true);

                studyPlanList = studyPlanMap.get("OptionList");

                if (response.data["SelectedProduct"] !== undefined) {
                    selectedRecord["nproductcode"] = {
                        label: response.data["SelectedProduct"].sproductname,
                        value: response.data["SelectedProduct"].nproductcode,
                        item: response.data["SelectedProduct"]
                    };
                    selectedRecord["schargebandname"] = response.data["SelectedProduct"].schargebandname;
                    selectedRecord["sdeptname"] = response.data["SelectedProduct"].sdeptname;
                }
                // }

                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        loading: false,
                        productList,
                        studyPlanList,
                        productManufacturerList: response.data["ProductManufacturer"] || [],
                        selectedRecord
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

export function getBatchProductComboChange(selectedRecord) {
    return function (dispatch) {

        dispatch(initRequest(true));
        rsapi().post("batchcreation/getProductComboChange", { nproductcode: selectedRecord.nproductcode.value })
            .then(response => {

                const selected = {nproductcatcode: selectedRecord["nproductcatcode"],
                                    nproductcode: selectedRecord["nproductcode"],
                                    dvaliditystartdate:selectedRecord["dvaliditystartdate"],
                                    ntzvaliditystartdate:selectedRecord["ntzvaliditystartdate"],
                                    dexpirydate:selectedRecord["dexpirydate"],
                                    ntzexpirydate:selectedRecord["ntzexpirydate"],
                                    stzvaliditystartdate:selectedRecord["stzvaliditystartdate"],
                                    stzexpirydate:selectedRecord["stzexpirydate"],
                                    schargebandname : selectedRecord.nproductcode.item.schargebandname,
                                    sdeptname : selectedRecord.nproductcode.item.sdeptname
                                };
                selectedRecord = selected;

                let studyPlanList = [];
                if (response.data["StudyPlan"] !== undefined && response.data["StudyPlan"].length > 0) {
                    const studyPlanMap = constructOptionList(response.data["StudyPlan"] || [], "nallottedspeccode",
                        "sspecname", undefined, undefined, true);

                    studyPlanList = studyPlanMap.get("OptionList");
                }

                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        loading: false,
                        studyPlanList,
                        productManufacturerList: response.data["ProductManufacturer"] || [],
                        selectedRecord
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

export function getBatchManufacturerComboChange(selectedRecord, userInfo) {
    return function (dispatch) {

        dispatch(initRequest(true));
        rsapi().post("batchcreation/getManufacturerComboChange", {
            nproductcode: selectedRecord.nproductcode.value,
            nproductmanufcode: selectedRecord.nproductmanufcode,
            userinfo: userInfo
        })
            .then(response => {

                // selectedRecord["smanufsitename"] = selectedRecord.smanufsitename;
                selectedRecord["nproductmahcode"] = "";
                selectedRecord["smahname"] = ""
                selectedRecord["slicencenumber"] = "";
                selectedRecord["scertificatetype"] = "";
                selectedRecord["scontainertype"] = "";
                selectedRecord["saddress1"] = "";

                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        loading: false,
                        maHolderList: response.data["ProductMAHolder"] || [],
                        selectedRecord
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

export function getBatchComponentComboService(batchParam) {
    return function (dispatch) {

        if (batchParam.masterData.SelectedBatchCreation.ntransactionstatus === transactionStatus.CANCELLED){
            if (batchParam.operation === "delete"){
                toast.warn(intl.formatMessage({ id: "IDS_CANNOTDELETECOMPONENTFORCANCELLEDBATCH"}));
            }
            else
            {
                toast.warn(intl.formatMessage({ id: "IDS_CANNOTADDCOMPONENTFORCANCELLEDBATCH"}));
            }
         
        }
        else{
            if (batchParam.operation === "delete"){
                dispatch(initRequest(true));
                rsapi().post("batchcreation/getBatchComponent", {nreleasebatchcode:batchParam.masterData.SelectedBatchCreation.nreleasebatchcode,
                                        userinfo:batchParam.userInfo})
                .then(response => {
                    if(response.data.length>0){
                        dispatch({
                            type: DEFAULT_RETURN, payload: {                           
                                operation: batchParam.operation,
                                screenName: batchParam.screenName,
                                //selectedRecord,
                                openChildModal: true,
                                ncontrolCode: batchParam.ncontrolCode,
                                loading: false, 
                                batchComponentDeleteList: response.data
                            }
                        });
                    }else{
                        dispatch({ type: DEFAULT_RETURN, payload: { loading: false ,multiLingualAlert:"IDS_NOCOMPONENTSTOREMOVE"} })
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
                    }
                    else {
                        toast.warn(error.response.data);
                    }
                })
            }
            else{
                const currentDate = formatInputDate(new Date(), true);
                const batchService = rsapi().post("batchcreation/getBatchComponentComboData",
                    {
                        userinfo: batchParam.userInfo, currentdate: currentDate,
                        batchcreation: batchParam.masterData.SelectedBatchCreation
                    });

                let urlArray = [batchService];

                dispatch(initRequest(true));
                Axios.all(urlArray)
                    .then(response => {

                        const productCatMap = constructOptionList(response[0].data["ProductCategory"] || [], "nproductcatcode",
                            "sproductcatname", undefined, undefined, true);
                        const productCatList = productCatMap.get("OptionList");

                        const productMap = constructOptionList(response[0].data["Product"] || [], "nproductcode",
                            "sproductname", undefined, undefined, true);

                        const productList = productMap.get("OptionList");

                        const componentMap = constructOptionList(response[0].data["ComponentList"] || [], "ncomponentcode",
                            "scomponentname", undefined, undefined, true);

                        const componentList = componentMap.get("OptionList");

                        let selectedRecord = {
                            "nproductcatcode": {
                                label: response[0].data["SelectedProductCategory"].sproductcatname,
                                value: response[0].data["SelectedProductCategory"].nproductcatcode,
                                item: response[0].data["SelectedProductCategory"]
                            },
                            "nproductcode": {
                                label: response[0].data["SelectedProduct"].sproductname,
                                value: response[0].data["SelectedProduct"].nproductcode,
                                item: response[0].data["SelectedProduct"]
                            },
                            "transdatefrom": rearrangeDateFormat(batchParam.userInfo, response[0].data["AddComponentDateFrom"]),
                            "transdateto": rearrangeDateFormat(batchParam.userInfo, response[0].data["AddComponentDateFrom"]),
                        };

                        dispatch({
                            type: DEFAULT_RETURN, payload: {
                                componentProductCatList: productCatList,
                                componentProductList: productList,
                                componentList,
                                componentDefaultSearchDate:rearrangeDateFormat(batchParam.userInfo, response[0].data["AddComponentDateFrom"]),
                                operation: batchParam.operation,
                                screenName: batchParam.screenName,
                                selectedRecord,
                                openChildModal: true,
                                ncontrolCode: batchParam.ncontrolCode,
                                loading: false, //selectedId:nreleasebatchcode
                                addComponentDataList: [],
                                selectedComponentList: []//response[0].data["BatchComponentCreation"]
                            }
                        });

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
                        }
                        else {
                            toast.warn(error.response.data);
                        }
                    })
                }
            }
    }
}

export function getDataForAddBatchComponent(searchParam) {
    return function (dispatch) {

        dispatch(initRequest(true));
        rsapi().post("batchcreation/refreshGetForAddComponent", {...searchParam.inputData })
            .then(response => {
           
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        loading: false,
                        addComponentDataList: response.data || [],
                        //selectedComponentList: [],
                        selectedComponentList:searchParam.selectedComponentList ||[],
                        addedComponentList:[],
                        deleteComponentSelectAll:false
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

export function getCopyBatchCreationComboService(batchParam) {
    return function (dispatch) {

        const currentDate = formatInputDate(new Date(), true);
        const batchService = rsapi().post("batchcreation/getCopyBatchCreationComboData",
            {
                userinfo: batchParam.userInfo, currentdate: currentDate,
                nreleasebatchcode: batchParam.primaryKeyValue
            });

        const timeZoneService = rsapi().post("timezone/getTimeZone");

        let urlArray = [batchService, timeZoneService];
        dispatch(initRequest(true));
        Axios.all(urlArray)
            .then(response => {

                const timeZoneMap = constructOptionList(response[1].data || [], "ntimezonecode",
                    "stimezoneid", undefined, undefined, true);

                const timeZoneList = timeZoneMap.get("OptionList");

                let selectedRecord = {
                    "dvaliditystartdate": rearrangeDateFormat(batchParam.userInfo, response[0].data["ValidityStartDate"]),
                    "dexpirydate": rearrangeDateFormat(batchParam.userInfo,response[0].data["ExpiryDate"]),
                    "ntzvaliditystartdate": {
                        "value": batchParam.userInfo.ntimezonecode,
                        "label": batchParam.userInfo.stimezoneid
                    },
                    "stzvaliditystartdate": batchParam.userInfo.stimezoneid,
                    "ntzexpirydate": {
                        "value": batchParam.userInfo.ntimezonecode,
                        "label": batchParam.userInfo.stimezoneid
                    },
                    "stzexpirydate": batchParam.userInfo.stimezoneid
                };


                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        timeZoneList,
                        operation: batchParam.operation,
                        screenName: batchParam.screenName,
                        selectedRecord,
                        openModal: true,
                        ncontrolCode: batchParam.ncontrolCode,
                        loading: false,
                        //selectedId:nreleasebatchcode
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

export function getBatchCreationDetail(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        //const batchParam = inputParam.batchParam;
        let masterData = inputParam.masterData;

        return rsapi().post("batchcreation/getBatchCreation", {
            nreleasebatchcode: parseInt(inputParam.nreleasebatchcode),
            userinfo: inputParam.userInfo, activeBCTab: inputParam.activeBCTab
        })
            .then(response => {

                masterData = { ...masterData, ...response.data };
                sortData(masterData);
                dispatch({ type: DEFAULT_RETURN, payload: { masterData, 
                                                            activeBCTab: inputParam.activeBCTab, 
                                                            loading: false,
                                                            dataState : {...inputParam.dataState, sort:undefined, filter:undefined},
                                                            sahDataState : {...inputParam.sahDataState, sort:undefined, filter:undefined},
                                                            bahDataState : {...inputParam.bahDataState, sort:undefined, filter:undefined},
                                                            chDataState: {...inputParam.chDataState, sort:undefined, filter:undefined}
                                                         } });
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


export function validateBatchComplete(batchParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("batchcreation/validateBatchComponentToComplete", {
            nreleasebatchcode: batchParam.nreleasebatchcode,userinfo:batchParam.userInfo
        })
            .then(response => {

                if (response.data.isValidForComplete === true) {
                    const postParam = {
                        inputListName: "BatchCreationList", selectedObject: "SelectedBatchCreation",
                        primaryKeyField: "nreleasebatchcode",
                        primaryKeyValue: batchParam.nreleasebatchcode,
                        fetchUrl: "batchcreation/getBatchCreation",
                        fecthInputObject: batchParam.userInfo,
                    }
                    const inputParam = {
                        classUrl: "batchcreation",
                        methodUrl: "BatchCreation", postParam,
                        inputData: {
                            "userinfo": batchParam.userInfo,
                            nreleasebatchcode: batchParam.nreleasebatchcode
                        },
                        operation: "complete"
                    }

                    const esignNeeded = showEsign(batchParam.userRoleControlRights, batchParam.userInfo.nformcode, batchParam.ncontrolCode);
                    if (esignNeeded) {
                        const data = {
                            loadEsign: true, screenData: { inputParam, masterData: batchParam.masterData },
                            openModal: true, screenName: "IDS_BATCHCREATION",
                            operation: "complete"
                        }
                        dispatch({
                            type: DEFAULT_RETURN, payload: {
                                ...data,
                                serverTime:rearrangeDateFormat(batchParam.userInfo, response.data.serverTime),
                                loading: false
                            }
                        });
                    }
                    else {
                        dispatch(crudMaster(inputParam, batchParam.masterData, "openModal", {}));
                    }
                }
                else {
                    dispatch({
                        type: DEFAULT_RETURN, payload: {
                            showConfirmAlert: true, loading: false, operation: "complete",
                            ncontrolCode: batchParam.ncontrolCode
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

export function getBatchSampleApprovalHistory(methodParam) {
    return function (dispatch) {
        dispatch(initRequest(true));

        return rsapi().post("batchapproval/getBASampleApprovalHistory",
            {
                npreregno: methodParam.primaryKeyValue,
                userinfo: methodParam.userInfo
            })
            .then(response => {
                let sampleApprovalMap = methodParam.masterData.sampleApprovalMap || new Map();
                sampleApprovalMap.set(parseInt(Object.keys(response.data["BA_SampleApprovalHistory"])[0]), Object.values(response.data["BA_SampleApprovalHistory"])[0]);
                const masterData = { ...methodParam.masterData, sampleApprovalMap };
                sortData(masterData);
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData,
                        data: methodParam.data, sampleApprovalMap,
                        dataState: methodParam.dataState,
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
    }
}


export function getBatchCreationChildTabDetail(inputData) {
    return function (dispatch) {
        if (inputData.nreleaseBatchCode) {
            let inputParamData = {
                nreleaseBatchCode: inputData.nreleaseBatchCode,
                activeBCTab: inputData.activeBCTab,
                userinfo: inputData.userinfo,

            }
            dispatch(initRequest(true));
            rsapi().post("batchcreation/getBatchCreationChildTab", inputParamData)
                .then(response => {
                    let responseData = { ...response.data }
                    responseData = sortData(responseData)
                    dispatch({
                        type: DEFAULT_RETURN, payload: {
                            masterData: {
                                ...inputData.masterData,
                                ...responseData,
                            },
                            loading: false,
                            activeBCTab: inputData.activeBCTab,
                            screenName: inputData.screenName
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
                    masterData: {
                        ...inputData.masterData
                    },
                    loading: false,
                    activeBATab: inputData.activeBATab
                }
            })
        }

    }
}
export function getProductByCategory(selectedRecord) {
    return function (dispatch) {

        dispatch(initRequest(true));
        rsapi().post("product/getProductByProductCategory", { nproductcatcode: selectedRecord.nproductcatcode.value })
            .then(response => {
                selectedRecord["nproductcode"]=null
                const productMap = constructOptionList(response.data || [], "nproductcode",
                "sproductname", undefined, undefined, true);
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        loading: false,
                        selectedRecord,
                        componentProductList:productMap.get("OptionList")
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


export function reloadBatchCreation(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("batchcreation/getBatchCreation", {...inputParam.inputData})
            .then(response => {
                let responseData = { ...response.data }
                responseData = sortData(responseData)
                let masterData = {
                    ...inputParam.masterData,
                    ...responseData,
                }
                if (inputParam.searchRef !== undefined && inputParam.searchRef.current !== null) {
                    inputParam.searchRef.current.value = "";
                    masterData['searchedData'] = undefined
                }
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData,
                        loading: false,
                        showFilter: false,
                        dataState : {...inputParam.dataState, sort:undefined, filter:undefined},
                        sahDataState : {...inputParam.sahDataState, sort:undefined, filter:undefined},
                        bahDataState : {...inputParam.bahDataState, sort:undefined, filter:undefined},
                        chDataState : {...inputParam.chDataState, sort:undefined, filter:undefined},
                        testCommentDataState : {...inputParam.testCommentDataState, sort:undefined, filter:undefined}
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