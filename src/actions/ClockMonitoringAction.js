import rsapi from '../rsapi';
import { DEFAULT_RETURN, UN_AUTHORIZED_ACCESS } from './LoginTypes';
import { toast } from 'react-toastify';
import Axios from 'axios';
import { initRequest } from './LoginAction';
import {sortData, constructOptionList, rearrangeDateFormat} from '../components/CommonScript';
import { intl } from '../components/App';
import {transactionStatus} from '../components/Enumeration';

export function getClockMonitoringComboService(inputParam){   
    return function (dispatch) {          

        // if (inputParam.selectedBatch.ntransactionstatus === transactionStatus.CERTIFIED){
        //     toast.warn(intl.formatMessage({id: "IDS_ALREADYCERTIFIED"}));
        // }
        if (inputParam.selectedBatch.ntransactionstatus === transactionStatus.CERTIFIED
            || inputParam.selectedBatch.ntransactionstatus === transactionStatus.NULLIFIED
            || inputParam.selectedBatch.ntransactionstatus === transactionStatus.SENT)
        {
            //const message = "IDS_CANNOTDELETE"+inputParam.selectedBatch.stransactionstatus.toUpperCase() +"RECORD";
            toast.warn(intl.formatMessage({id:"IDS_CANNOTEDITCERTIFIEDCLOCK"}));
        }
        else
        {
            const timeZoneService = rsapi().post("timezone/getTimeZone"); 
            const utcTimeZoneService = rsapi().post("timezone/getLocalTimeByZone", { userinfo: inputParam.userInfo });      
            let urlArray = [];

            //let selectedId = null;
            let valid = true;
            let msg = "IDS_CANNOTCREATEAUTOCLOCK";;
            if (inputParam.operation === "create"){
                urlArray = [timeZoneService, utcTimeZoneService];
            }
            else{
                const editRow = inputParam.editRow;
                if (editRow.nactiontype === transactionStatus.AUTO){
                    valid = false;
                    msg ="IDS_CANNOTEDITAUTOCLOCK";
                }
                else{
                    const activeClockById =  rsapi().post("clockmonitoring/getActiveClockHistoryById", 
                                { [inputParam.primaryKeyField] :inputParam.primaryKeyValue , 
                                    "userinfo": inputParam.userInfo} );
                    urlArray = [timeZoneService, utcTimeZoneService, activeClockById];
                    //selectedId = inputParam.primaryKeyValue;
                }
            }
            if(valid){
                dispatch(initRequest(true));
                Axios.all(urlArray)
            
                .then(response=>{   

                    const timeZoneMap = constructOptionList(response[0].data || [], "ntimezonecode",
                                        "stimezoneid", undefined, undefined, true);

                    const timeZoneList = timeZoneMap.get("OptionList");

                    let selectedRecord =  {}; 

                    if (inputParam.operation === "update"){
                    
                        const selectedClock = response[2].data; 
                        selectedRecord = JSON.parse(JSON.stringify(response[2].data));

                        const selectedTimeZone = response[0].data.filter(item=>item.ntimezonecode === selectedRecord.ntzapproveddate);

                    
                        selectedRecord["dapproveddate"] = rearrangeDateFormat(inputParam.userInfo, selectedClock["sapproveddate"]);
                        selectedRecord["ntzapproveddate"] = {"value": selectedTimeZone[0].ntimezonecode, 
                                                            "label": selectedTimeZone[0].stimezoneid};
                        selectedRecord["stzapproveddate"] = selectedTimeZone[0].stimezoneid;
                    }
                    else{
                        selectedRecord =  {"dapproveddate" : rearrangeDateFormat(inputParam.userInfo,response[1].data?.date),
                                        "ntzapproveddate":{"value": inputParam.userInfo.ntimezonecode, 
                                                            "label": inputParam.userInfo.stimezoneid},
                                        "stzapproveddate":inputParam.userInfo.stimezoneid
                                    };
                    }
                                    
                    dispatch({type: DEFAULT_RETURN, payload:{  
                                        timeZoneList,                                                                                     
                                        operation:inputParam.operation, screenName:inputParam.screenName,   
                                        selectedRecord, 
                                        openModal : true,
                                        clockAction:inputParam.clockAction,
                                        ncontrolCode:inputParam.ncontrolCode,
                                        loading:false, selectedId:inputParam.primaryKeyValue
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
            else{
                toast.warn(intl.formatMessage({id: msg}));
            }
        }
        
}}

export function getClockBatchCreationDetail(inputParam) {
    return function (dispatch) {   
    dispatch(initRequest(true)); 
    //const batchParam = inputParam.batchParam;
    let masterData = inputParam.masterData;
   
    return rsapi().post("clockmonitoring/getClockMonitoring", {nreleasebatchcode:parseInt(inputParam.nreleasebatchcode), 
                    userinfo:inputParam.userInfo})
   .then(response=>{ 
      
        masterData = {...masterData, ...response.data};        
        sortData(masterData);     
        dispatch({type: DEFAULT_RETURN, payload:{masterData, loading:false}});   
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
           toast.error(intl.formatMessage({id: error.message}));
       } 
       else{               
           toast.warn(intl.formatMessage({id: error.response.data}));
       }  
  
   })
}}


export function reloadClockMonitoring(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("clockmonitoring/getClockMonitoring", {...inputParam.inputData})
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
                        showFilter: false
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


