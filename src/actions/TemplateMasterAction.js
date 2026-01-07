import rsapi from "../rsapi";
import {
    toast
} from "react-toastify";
import {
    DEFAULT_RETURN,
    UN_AUTHORIZED_ACCESS
} from "./LoginTypes";
import {
    intl
} from '../components/App';
import {constructOptionList, sortData} from '../components/CommonScript';
import {
    transactionStatus
} from "../components/Enumeration";
import { initRequest } from './LoginAction';


export function addModel(operation, ncontrolCode, lstcategory, selectedInput) {
    return function (dispatch) {
        ///if (lstcategory && Object.keys(lstcategory).length > 0) {
            if (lstcategory && lstcategory[Object.keys(lstcategory)].length > 0) {
            
            if (selectedInput === undefined){
                selectedInput = {};
            }
            selectedInput["sversiondescription"] = "";
            dispatch({
                type: DEFAULT_RETURN,
                payload: {
                    openModal: true,
                    templateTreeData: [{
                        input: ""
                    }],
                    totalLevel: 1,
                    operation: operation,
                    selectedRecord: {},
                    selectedInput,
                    id: 0,
                    ncontrolCode
                }
            });
        } else {
            toast.warn(intl.formatMessage({
                id: "IDS_CONFIGCATEGROYFORSAMPLETYPE"
            }));
        }
    }
}


//to get the edit record
export function fetchRecordByTemplateID(primaryKeyName, primaryKeyValue, operation, selectedRecord, selectedInput, userInfo, ncontrolCode) {
    return function (dispatch) {
        if (selectedRecord["ntransactionstatus"] === transactionStatus.APPROVED || selectedRecord["ntransactionstatus"] === transactionStatus.RETIRED) {
            toast.warn(intl.formatMessage({
                id: "IDS_SELECTDRAFTRECORDTOEDIT"
            }));
        } else {
            dispatch(initRequest(true));
            rsapi().post("templatemaster/getTemplateMasterTree", {
                    [primaryKeyName]: primaryKeyValue,
                    "userinfo": userInfo
                })
                .then(response => {
                    selectedInput["sversiondescription"] = response.data.lstTemplateMasterlevel[0]["sversiondescription"];
                    response.data.lstTemplateMasterlevel.map((item, i) =>
                        selectedRecord[i] = (item["slabelname"]).toString(),
                    )

                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {
                            templateTreeData: response.data.lstTemplateMasterlevel,
                            openModal: true,
                            operation: operation,
                            selectedRecord: selectedRecord,
                            selectedInput,
                            totalLevel: response.data.lstTemplateMasterlevel.length,
                            id: response.data.lstTemplateMasterlevel.length - 1,
                            ncontrolCode,
                            loading: false
                        }
                    });
                })
                .catch(error => {
                    dispatch({type: DEFAULT_RETURN, payload: {loading: false}}); 
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
                        toast.error(intl.formatMessage({
                            id: error.message
                        }));
                    } else {
                        toast.warn(intl.formatMessage({
                            id: error.response.data
                        }));
                    }
                });
        }
    }
}




export function getTemplateMasterTree(TMvalue, masterData, userInfo) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("templatemaster/getTemplateMasterTree", {
                ntreeversiontempcode: TMvalue.ntreeversiontempcode,
                userinfo: userInfo,
            })
            .then(response => {
                masterData["lstTemplateMasterlevel"] = response.data["lstTemplateMasterlevel"];
                //masterData["selected"] = TMvalue;
                masterData["SelectedTreeVersionTemplate"] = TMvalue;
                const selectedRecord = {};
                const dummyNumber = -12;
                selectedRecord["ntransactionstatus"] = response.data["lstTemplateMasterlevel"] ? response.data["lstTemplateMasterlevel"].length > 0 ?
                    response.data["lstTemplateMasterlevel"][0]["ntransactionstatus"] : dummyNumber : dummyNumber;
                 

                // selectedRecord["ntransactionstatus"] = response.data["lstTemplateMasterlevel"] ? response.data["lstTemplateMasterlevel"].length > 0 ?
                //     response.data["lstTemplateMasterlevel"][0]["ntransactionstatus"] :
                //     this.props.Login.selectedRecord ? this.props.Login.selectedRecord["ntransactionstatus"] : [] : []

                dispatch({
                    type: DEFAULT_RETURN,
                    payload: { loading: false,
                        masterData,
                        selectedRecord
                    }
                });
            })
            .catch(error => {
                dispatch({type: DEFAULT_RETURN, payload: {loading: false}}); 
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
                    toast.error(intl.formatMessage({
                        id: error.message
                    }));
                } else {
                    toast.warn(intl.formatMessage({
                        id: error.response.data
                    }));
                }
            });
    }
}

export function getSampleTypeProductCategory(filterSelectedRecord, inputParam, masterData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post(inputParam.url, inputParam.inputData)
        .then(response => {
            let categoryValuemember;
            let categoryDisplaymemeber ;
            const categroyLable = response.data.lstcategory ? Object.keys(response.data.lstcategory)[0] : filterSelectedRecord.categroyLable;
           if(Object.keys(response.data.lstcategory).length>0){
            if(response.data.lstcategory[categroyLable].length>0){
                 categoryValuemember = response.data.lstcategory ? Object.keys(response.data.lstcategory[categroyLable][0])[0] : filterSelectedRecord.categoryValuemember;
             categoryDisplaymemeber = response.data.lstcategory ? Object.keys(response.data.lstcategory[categroyLable][0])[1] : filterSelectedRecord.categoryDisplaymemeber;
            }
        }
    
            // const lstCategory = response.data.lstcategory ? constructOptionList(response.data.lstcategory[categroyLable] || [], 
            //             categoryValuemember, categoryDisplaymemeber, categoryValuemember,
            //             "ascending", undefined).get("OptionList") : [];
            let Taglstcategory = [];
            if (response.data.lstcategory && response.data.lstcategory[categroyLable]) {
                const categoryTypeMap = constructOptionList(response.data.lstcategory[categroyLable]
                            || [], categoryValuemember, categoryDisplaymemeber, categoryValuemember, "ascending", undefined) ;
                Taglstcategory = categoryTypeMap.get("OptionList");
            }   
            masterData = {...masterData,  SelectedCategoryFilter:response.data.SelectedCategoryFilter,
                SelectedSampleFilter:response.data.SelectedSampleFilter,lstcategory:response.data.lstcategory
                        //SelectedSampleFilter:response.data["SelectedSampleFilter"],
                        //SelectedCategoryFilter:response.data["SelectedCategoryFilter"],
                        //lstcategory:lstCategory, 
                       // categroyLable, 
                       // categoryValuemember, categoryDisplaymemeber,
                      //  defaultCategoryType:{},
                        // defaultsampletype:{label:response.data["SelectedSampleFilter"].ssampletypename, 
                        //                     value:response.data["SelectedSampleFilter"].nsampletypecode,
                        //                     item:response.data["SelectedSampleFilter"]}

                        // selectedValues :{"ncategorycode": lstCategory.length > 0 ?  
                        //                                 lstCategory[0].item[categoryValuemember] : -2,                                            
                        //                 "nsampletypecode": filterSelectedRecord["sampleType"].value,
                        //                 "nformcode" :lstCategory.length >0? response.data["nformcode"]:-2}
                    };
                    filterSelectedRecord["masterData"]={...masterData,SelectedCategoryFilterTextLabel:response.data.SelectedCategoryFilterTextLabel,
                        SelectedCategoryFilterValueLabel:response.data.SelectedCategoryFilterValueLabel,
                        SelectedCategoryFilter:response.data.SelectedCategoryFilter,
                        SelectedSampleFilter:response.data.SelectedSampleFilter};
            filterSelectedRecord["sampletype"] = {label:response.data["SelectedSampleFilter"].ssampletypename, 
                                                    value:response.data["SelectedSampleFilter"].nsampletypecode,
                                                    item:response.data["SelectedSampleFilter"]}
           
            filterSelectedRecord["categorytype"] =  Taglstcategory.length > 0 ?  Taglstcategory[0] 
                                            // {"value": Taglstcategory[0][categoryValuemember],
                                            //     "label": Taglstcategory[0][categoryDisplaymemeber],
                                            //     "item":Taglstcategory[0]} 
                                                : undefined ;
            filterSelectedRecord["categroyLable"]= categroyLable;                                                  
            dispatch({type: DEFAULT_RETURN, payload: {loading:false, masterData, filterSelectedRecord, Taglstcategory}});             
        })
        .catch(error => {
            dispatch({type: DEFAULT_RETURN, payload: {loading: false}}); 
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
                toast.info(error.response.data);
            }
        })
    }
}

export function getStudyTemplateByCategoryType(inputParam, masterData, filterSelectedRecord, isFilterSubmit) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post(inputParam.url, inputParam.inputData)
        .then(response => {
            masterData = {...masterData, ...response.data};
            if (masterData.lstTemplateMasterlevel) {
                sortData(masterData.lstTemplateMasterlevel, "ascending", "nlevelno")
            }
            if (masterData.lstTreeversionTemplate) {
                sortData(masterData.lstTreeversionTemplate)
            }
            if (isFilterSubmit){
                masterData["SelectedSample"] = filterSelectedRecord["sampletype"] ? filterSelectedRecord["sampletype"].item :undefined;
                masterData["SelectedCategory"] = filterSelectedRecord["categorytype"] ? filterSelectedRecord["categorytype"].item :undefined;
                masterData["SelectedCategoryFilterTextLabel"] = filterSelectedRecord.masterData["SelectedCategoryFilterTextLabel"] ? filterSelectedRecord.masterData["SelectedCategoryFilterTextLabel"] :undefined;
                 masterData["SelectedCategoryFilterValueLabel"] = filterSelectedRecord.masterData["SelectedCategoryFilterValueLabel"] ? filterSelectedRecord.masterData["SelectedCategoryFilterValueLabel"] :undefined;
                masterData["searchedData"]=undefined;
            }

            dispatch({type: DEFAULT_RETURN, payload: {loading: false,masterData, breadCrumbCategroyLabel: filterSelectedRecord.categroyLable}});       // ALPD-5412 Added breadCrumbCategroyLabel by Vishakh for Breadcrumb issue         
        })
        .catch(error => {
            dispatch({type: DEFAULT_RETURN, payload: {loading: false}});        
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
                toast.info(error.response.data);
            }
        })
    }
}