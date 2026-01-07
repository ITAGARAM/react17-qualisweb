import { toast } from 'react-toastify';
import Axios from 'axios';
import rsapi from '../rsapi';
import { initRequest } from './LoginAction';
import {DEFAULT_RETURN,UN_AUTHORIZED_ACCESS} from './LoginTypes';
import {sortData, fillRecordBasedOnCheckBoxSelection, getRecordBasedOnPrimaryKeyName, constructOptionList,filterRecordBasedOnPrimaryKeyName, rearrangeDateFormat, getSameRecordFromTwoArrays,sortDataByParent} from '../components/CommonScript';
import { intl } from '../components/App';
import {transactionStatus,checkBoxOperation} from '../components/Enumeration';

export function getSchedulerDetail (scheduler, userInfo, masterData,sscheduletype) {
    return function (dispatch) {   
    dispatch(initRequest(true));
    return rsapi().post("scheduler/getScheduler", {nschedulecode:scheduler.nschedulecode, userinfo:userInfo,sscheduletype:sscheduletype})
   .then(response=>{     
        masterData = {...masterData, ...response.data};       
        sortData(masterData);
        dispatch({type: DEFAULT_RETURN, payload:{masterData, operation:null, modalName:undefined, 
             loading:false}});   
   })
   .catch(error=>{
        dispatch({type: DEFAULT_RETURN, payload: {loading:false}})
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
               } else if (error.response.status === 500){
           toast.error(error.message);
       } 
       else{               
           toast.warn(error.response.data);
       }  
  
   })
}
}
// export function getSchedulerDetail (scheduler, userInfo, masterData) {
//     return function (dispatch) {   
//         const schedulerService = rsapi().post("scheduler/getScheduler", {nschedulecode:scheduler.nschedulecode, userinfo:userInfo});
//         const schedulerTypeService = rsapi().post("scheduler/getSchedulerType", {userinfo:userInfo});
//         let urlArray = [];
//         urlArray = [schedulerService,schedulerTypeService];
//     dispatch(initRequest(true));
//     //return rsapi().post("scheduler/getScheduler", {nschedulecode:scheduler.nschedulecode, userinfo:userInfo})
//     Axios.all(urlArray)
//    .then(response=>{     
//         masterData = {...masterData, ...response[0].data};       
//         sortData(masterData);
//         const schedulerTypeMap = constructOptionList(response[1].data['SchedulerType'] || [], "nschedulertypecode",
//                                           "sschedulertypename", undefined, undefined, false);  
//         const schedulerTypeList = schedulerTypeMap.get("OptionList");             
//         dispatch({type: DEFAULT_RETURN, payload:{masterData,schedulerTypeList, operation:null, modalName:undefined, 
//              loading:false}});   
//    })
//    .catch(error=>{
//         dispatch({type: DEFAULT_RETURN, payload: {loading:false}})
//        if (error.response.status === 500){
//            toast.error(error.message);
//        } 
//        else{               
//            toast.warn(error.response.data);
//        }  
  
//    })
// }
// }

export function getSchedulerComboService(inputParam){ 
    return function (dispatch) {    
        if (inputParam.operation === "create" || (inputParam.operation === "update" && inputParam.masterData.SelectedScheduler.ntransactionstatus === transactionStatus.DRAFT)) {
            const schedulerTypeService = rsapi().post("scheduler/getSchedulerType", {userinfo:inputParam.userInfo});
            const srecurringTypeService = rsapi().post("scheduler/getSchedulerTypeRecurring", {userinfo:inputParam.userInfo});
            const srecurringMonthlyService = rsapi().post("scheduler/getSchedulerRecurringMonthlyPeriod", {userinfo:inputParam.userInfo});
            //const UTCtimeZoneService = rsapi().post("timezone/getLocalTimeByZone", { userinfo: inputParam.userInfo });
                    
            let urlArray = [];
            if (inputParam.operation === "create"){
               urlArray = [schedulerTypeService,srecurringTypeService,srecurringMonthlyService];//, UTCtimeZoneService
            }
            else{                    
                const schedulerById =  rsapi().post("scheduler/getActiveSchedulerById", 
                                { [inputParam.primaryKeyName] :inputParam.masterData.SelectedScheduler[inputParam.primaryKeyName] , 
                                    "userinfo": inputParam.userInfo} );
                
                urlArray = [schedulerTypeService,srecurringTypeService,srecurringMonthlyService,schedulerById];
            }
            dispatch(initRequest(true));
            Axios.all(urlArray)
                .then(response=>{                   
                    let gender =[];
                 
                    const schedulerTypeMap = constructOptionList(response[0].data['SchedulerType'] || [], "nschedulertypecode",
                                          "sschedulertypename", undefined, undefined, false);               
                    const recurringMap = constructOptionList(response[1].data['SchedulerTypeRecurring'] || [], "ntyperecurringcode",
                                          "srecurringmodename", undefined, undefined, false);               
                    const recurringMonthlyMap = constructOptionList(response[2].data['SchedulerRecurringMonthlyPeriod'] || [], "nrecurringperiodcode",
                                          "srecurrenceperiod", undefined, undefined, false);               

                    const schedulerTypeList = schedulerTypeMap.get("OptionList");
                    const recurringList = recurringMap.get("OptionList");
                    const monthlyTypeList = recurringMonthlyMap.get("OptionList");
                    
                    let selectedRecord =  {};
                    let schedulertype =[];
                    let recurringtype =[];
                    let monthlytype =[];
                    //const currentTime = rearrangeDateFormat(inputParam.userInfo, response[1].data);
                   
                    if (inputParam.operation === "update"){
                         selectedRecord = response[3].data;
                         if(selectedRecord["sscheduletype"]==="O")
                         {
                            schedulertype.push({"value": 1,"label": "One Time"});
                            selectedRecord["nschedulertypecode"]= schedulertype[0];
                            recurringtype.push({"value": 1,"label": "Daily"})
                            selectedRecord["ntyperecurringcode"] = recurringtype[0]; 
                            monthlytype.push({"value": 1,"label": "Exact Day"});
                            selectedRecord["nrecurringperiodcode"] = monthlytype[0];
                         }
                         else if(selectedRecord["sscheduletype"]==="D")
                         {
                            schedulertype.push({"value": 2,"label": "Recurring"});
                            selectedRecord["nschedulertypecode"]= schedulertype[0];
                            recurringtype.push({"value": 1,"label": "Daily"})
                            selectedRecord["ntyperecurringcode"] = recurringtype[0]; 
                            monthlytype.push({"value": 1,"label": "Exact Day"});
                            selectedRecord["nrecurringperiodcode"] = monthlytype[0];
                            //selectedRecord["sstartdate"] = rearrangeDateFormat(inputParam.userInfo,selectedRecord["sstartdate"]);
                            let date=selectedRecord["sstartdate"];
                            date=date.substring(0,10);
                            let time=selectedRecord["soccurencehourwiseinterval"];
                             
                             date=date+" "+time+":00";
                             selectedRecord["soccurencehourwiseinterval"]=date;
                             selectedRecord["soccurencehourwiseinterval"]=rearrangeDateFormat(inputParam.userInfo,selectedRecord["soccurencehourwiseinterval"]);
                         }
                         else if(selectedRecord["sscheduletype"]==="W")
                         {
                            schedulertype.push({"value": 2,"label": "Recurring"});
                            selectedRecord["nschedulertypecode"]= schedulertype[0];
                            recurringtype.push({"value": 2,"label": "Weekly"})
                            selectedRecord["ntyperecurringcode"] = recurringtype[0]; 
                            monthlytype.push({"value": 1,"label": "Exact Day"});
                            selectedRecord["nrecurringperiodcode"] = monthlytype[0];
                         }
                         else if(selectedRecord["sscheduletype"]==="M")
                         {
                            schedulertype.push({"value": 2,"label": "Recurring"});
                            selectedRecord["nschedulertypecode"]= schedulertype[0];
                            recurringtype.push({"value": 3,"label": "Monthly"})
                            selectedRecord["ntyperecurringcode"] = recurringtype[0]; 
                            
                            if(selectedRecord["nmonthlyoccurrencetype"]===1)
                            {
                                monthlytype.push({"value": 1,"label": "Exact Day"});
                                selectedRecord["nrecurringperiodcode"] = monthlytype[0];
                            }
                            if(selectedRecord["nmonthlyoccurrencetype"]===2)
                            {
                                monthlytype.push({"value": 2,"label": "1st Week"});
                                selectedRecord["nrecurringperiodcode"] = monthlytype[0];
                            }
                            if(selectedRecord["nmonthlyoccurrencetype"]===3)
                            {
                                monthlytype.push({"value": 3,"label": "2nd Week"});
                                selectedRecord["nrecurringperiodcode"] = monthlytype[0];
                            }
                            if(selectedRecord["nmonthlyoccurrencetype"]===4)
                            {
                                monthlytype.push({"value": 4,"label": "3rd Week"});
                                selectedRecord["nrecurringperiodcode"] = monthlytype[0];
                            }
                            if(selectedRecord["nmonthlyoccurrencetype"]===5)
                            {
                                monthlytype.push({"value": 5,"label": "4th Week"});
                                selectedRecord["nrecurringperiodcode"] = monthlytype[0];
                            }
                            
                         }
                         selectedRecord["sstartdate"] = rearrangeDateFormat(inputParam.userInfo,selectedRecord["sstartdate"]);
                            selectedRecord["sstarttime"] = rearrangeDateFormat(inputParam.userInfo,selectedRecord["sstarttime"]);
                            selectedRecord["senddate"] = rearrangeDateFormat(inputParam.userInfo,selectedRecord["senddate"]);
                            selectedRecord["sendtime"] = rearrangeDateFormat(inputParam.userInfo,selectedRecord["sendtime"]);
                        //    let date= selectedRecord["sstartdate"];
                        //    let time= selectedRecord["soccurencehourwiseinterval"];
                        //    date=date.substring(0,10);
                        //    selectedRecord["soccurencehourwiseinterval"]=date+" "+time;

                        // gender.push({"value" : response[1].data["ngendercode"], "label" : response[1].data["sgendername"]});
                                             
                        // selectedRecord["ngendercode"] = gender[0];

                        // if (selectedRecord["ddob"] !== null){
                        //     selectedRecord["ddob"] = rearrangeDateFormat(inputParam.userInfo, selectedRecord["sdob"]);
                        // }                                          
                    }
                    else{        
                        if(inputParam.nfilterScheduleType)
                        {
                            selectedRecord["nschedulertypecode"] = inputParam.nfilterScheduleType;  
                        }
                        else
                        {
                        selectedRecord["nschedulertypecode"] = schedulerTypeMap.get("DefaultValue");  
                        }
                        selectedRecord["ntyperecurringcode"] = recurringMap.get("DefaultValue");  
                        selectedRecord["nrecurringperiodcode"] = recurringMonthlyMap.get("DefaultValue");  
                        //selectedRecord["ddob"] = rearrangeDateFormat(inputParam.userInfo, response[1].data);
                        //selectedRecord["sage"]  = ageCalculate(selectedRecord["ddob"])
                    }
                  
                    dispatch({type: DEFAULT_RETURN, payload:{schedulerTypeList,
                                                            recurringList,
                                                            monthlyTypeList,                         
                                                            operation:inputParam.operation, 
                                                            screenName:inputParam.screenName,   
                                                            selectedRecord,
                                                            openModal : true,
                                                            ncontrolCode:inputParam.ncontrolcode,
                                                            loading:false,
                                                            //currentTime
                                                            }});
                })
                .catch(error=>{
                    dispatch({type: DEFAULT_RETURN, payload: {loading:false}})
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
        } else if (error.response.status === 500){
                        toast.error(error.message);
                    } 
                    else{               
                        toast.warn(error.response.data);
                    }  
                }) 
            }
            else
            {
                let message = "IDS_SELECTDRAFTRECORDTOEDIT";
            
            toast.warn(intl.formatMessage({ id: message }));
            }
}
}

export const changeScheduleTypeFilter = (inputParam, filterScheduleType) => {
    return (dispatch) => {
        dispatch(initRequest(true));
        rsapi().post("/scheduler/get" + inputParam.methodUrl, inputParam.inputData)
            .then(response => {
                const masterData = response.data
                sortData(masterData);
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false,
                        masterData: {
                            ...masterData,
                            filterScheduleType,
                            nfilterScheduleType: inputParam.inputData.nfilterScheduleType
                        }
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