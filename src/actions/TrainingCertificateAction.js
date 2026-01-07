import rsapi from '../rsapi';
import { DEFAULT_RETURN, UN_AUTHORIZED_ACCESS } from './LoginTypes';
import { sortData, constructOptionList,convertDateValuetoString, rearrangeDateFormat } from '../components/CommonScript'//, getComboLabelValue, searchData
import { toast } from 'react-toastify';
import Axios from 'axios';
import { initRequest } from './LoginAction';
import { intl } from '../components/App';
import { transactionStatus } from '../components/Enumeration';

export function getTrainingCertificateDetail(trainingcertificate, fromDate, toDate, userInfo, masterData) {
    return function (dispatch) {
        dispatch(initRequest(true));

        return rsapi().post("trainingcertificate/getTrainingCertificate", {
            ntrainingcode: trainingcertificate.ntrainingcode, fromDate, toDate,
            "userinfo": userInfo
        })
            .then(response => {

                masterData = { ...masterData, ...response.data };
                sortData(masterData);
                dispatch({ type: DEFAULT_RETURN, payload: { masterData, loading: false } });
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

export function getTrainingCertificateComboService(screenName, operation, primaryKeyName, primaryKeyValue, masterData, userInfo, ncontrolCode) {
    return function (dispatch) {
        if (operation === "create" || (operation === "update" || operation === "reschedule")) {

            const trainingcategoryService = rsapi().post("traningcategory/getTrainingCategory", { userinfo: userInfo });
            const techniqueService = rsapi().post("trainingcertificate/getTechnique", { userinfo: userInfo });
            const timeZoneService = rsapi().post("timezone/getTimeZone");
            const UTCtimeZoneService = rsapi().post("timezone/getLocalTimeByZone", { userinfo: userInfo });
            let urlArray = [techniqueService, trainingcategoryService, timeZoneService, UTCtimeZoneService];
            if (operation === "update" || operation === "reschedule") {

                const trainingcertificateServiceById = rsapi().post("trainingcertificate/getActiveTrainingCertificateById", { [primaryKeyName]: primaryKeyValue, "userinfo": userInfo });//this.props.Login.userInfo
                urlArray.push(trainingcertificateServiceById)
                const trainingparticipantsById = rsapi().post("trainingcertificate/getTrainingParticipants", { [primaryKeyName]: primaryKeyValue, "userinfo": userInfo });//this.props.Login.userInfo
                urlArray.push(trainingparticipantsById)
            }

            dispatch(initRequest(true));
            Axios.all(urlArray)
                .then(response => {
                let status = true;
                let index ;
                if(operation === "update" || operation === "reschedule"){
                     index = response[5].data.TrainingParticipants.findIndex( item => 
                       (item.ntransactionstatus === transactionStatus.INVITED) 
                      );
                    if(index !== -1){
                      status = operation === "update" ? false :  true;
                    } else{
                        status = operation === "reschedule" ? false : true;
                    }
                    status = response[4].data && response[4].data.ntransactionstatus === transactionStatus.COMPLETED ? false : 
                        response[4].data && response[4].data.ntransactionstatus === transactionStatus.CONDUCTED ? false : status ;
                }
              
                    if(status){

                    let selectedRecord = {
                        "ntztrainingdate": {
                            "value": userInfo.ntimezonecode,
                            "label": userInfo.stimezoneid
                        },
                        "stztrainingdate": userInfo.stimezoneid
                    };

                    const techniqueMap = constructOptionList(response[0].data || [], "ntechniquecode",
                        "stechniquename", undefined, undefined, true);
                    const trainingcategoryMap = constructOptionList(response[1].data || [], "ntrainingcategorycode",
                        "strainingcategoryname", undefined, undefined, true);
                    const timeZoneMap = constructOptionList(response[2].data || [], "ntimezonecode",
                        "stimezoneid", undefined, undefined, true);
                    const trainingcategoryList = trainingcategoryMap.get("OptionList");
                    const techniqueList = techniqueMap.get("OptionList");
                    const timeZoneList = timeZoneMap.get("OptionList");
                    const currentTime = rearrangeDateFormat(userInfo, response[3].data?.date);
                    if (operation === "update" || operation === "reschedule") {
                        selectedRecord = response[4].data;

                        selectedRecord["dtrainingdatetime"] = rearrangeDateFormat(userInfo, response[4].data.strainingdatetime)
                        selectedRecord["ntrainingcategorycode"] = { "value": response[4].data.ntrainingcategorycode, "label": response[4].data.strainingcategoryname };
                        selectedRecord["ntechniquecode"] = { "value": response[4].data.ntechniquecode, "label": response[4].data.stechniquename };
                        selectedRecord["ntztrainingdate"] = { "value": response[4].data.ntztrainingdate, "label": response[4].data.stimezoneid };
                    }
                    else {
                        selectedRecord["ntransactionstatus"] = transactionStatus.ACTIVE;
                        selectedRecord["ntrainingcategorycode"] = trainingcategoryMap.get("DefaultValue");
                    }

                    dispatch({
                        type: DEFAULT_RETURN, payload: {
                            currentTime,
                            trainingcategoryList, techniqueList, timeZoneList,
                            operation, screenName, selectedRecord, openModal: true,
                            ncontrolCode, loading: false
                        }
                    });
                }
                else{
                    dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                    toast.warn(intl.formatMessage({ id: response[4].data.ntransactionstatus !== transactionStatus.COMPLETED ? 
                        response[4].data.ntransactionstatus !== transactionStatus.CONDUCTED ? (operation === "update" ? "IDS_INVITEDPARTICIPANTSCANNOTBEEDITED" : "IDS_INVITEPARTICIPANTS") : "IDS_TESTTRAININGALREADYCONDUCTED" : "IDS_TESTTRAININGALREADYCOMPLETED"}));
                }
            }
            )
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
}


export function getTrainingParticipantsComboDataService(trainingparam, masterData) {
    return function (dispatch) {

        if (masterData.SelectedTrainingCertificate.ntransactionstatus !== transactionStatus.CANCELLED) {

            const getActiveTrainingCertificateById = rsapi().post("trainingcertificate/getActiveTrainingCertificateById", { "userinfo": trainingparam.userInfo,"ntrainingcode":trainingparam.masterData.SelectedTrainingCertificate.ntrainingcode});

            const section = rsapi().post("section/getSection", { "userinfo": trainingparam.userInfo });

            let urlArray = [];

            let selectedId = null;

            urlArray = [section,getActiveTrainingCertificateById];

            dispatch(initRequest(true));
            Axios.all(urlArray)
                .then(Axios.spread((...response) => {
                    if(response && response[1] && response[1].data.ntransactionstatus !== transactionStatus.COMPLETED){

                    let selectedRecord = {};
                    let nsectioncode = [];
                    let nsitecode = [];

                    let sectionusersList = [];

                    const SectionMap = constructOptionList(response[0].data || [], "nsectioncode",
                        "ssectionname", undefined, undefined, true);

                    const sectionList = SectionMap.get("OptionList");



                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {
                            section: sectionList, sectionUsers: trainingparam.operation === "update" ? sectionusersList : [],
                            nsectioncode: nsectioncode, nsitecode: nsitecode,
                            selectedRecord: trainingparam.operation === "update" ? selectedRecord : undefined, operation: trainingparam.operation,
                            screenName: "IDS_PARTICIPANTSDETAILS",
                            openChildModal: true, ncontrolCode: trainingparam.ncontrolCode,
                            loading: false, selectedId
                        }
                    });
                }
                else{
                    dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                    toast.warn(intl.formatMessage({ id: "IDS_TESTTRAININGALREADYCOMPLETED"}));
                }
                }))

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

            toast.warn(intl.formatMessage({ id: "IDS_TRAININGCANCELED" }));
        }
    }

}


export function reloadTrainingCertificate(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("trainingcertificate/getTrainingCertificate", { ...inputParam.inputData })
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

export function getSectionUsersDataService(nSectionCode, selectedRecord, userInfo, SelectedTrainingCertificate) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("trainingcertificate/getSectionUsers", { "userinfo": userInfo, "nsectioncode": parseInt(nSectionCode), "ntrainingcode": parseInt(SelectedTrainingCertificate) })
            .then(response => {

                let nusercode = [];

                // const sectionusersMap = constructOptionList(response.data.SectionUsers || [], "nusercode",
                //     "sfullname", undefined, undefined, true);

                const sectionusersList = response.data.SectionUsers;

                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        sectionUsers: sectionusersList, nusercode: nusercode, selectedRecord, loading: false
                    }
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
                    toast.error(error.message);
                }
                else {
                    toast.warn(error.response.data);
                }
            })
    }
}
export function getTrainingParticipantsInvite(trainingparam, selectedRecord, masterData, operation) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("trainingcertificate/getInviteParticipants", { "userinfo": trainingparam.userInfo, "ntrainingcode": parseInt(masterData.SelectedTrainingCertificate.ntrainingcode) })
            .then(response => {

                let nusercode = [];

                // const inviteUsersMap = constructOptionList(response.data.InvitedParticipants || [], "nusercode",
                //     "sfullname", undefined, undefined, true);

                // const inviteUsersList = inviteUsersMap.get("OptionList");
                const inviteUsersList = response.data.InvitedParticipants;

                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        usersStatus: inviteUsersList, nusercode: nusercode, loading: false, openChildModal: true,
                        screenName: "IDS_INVITEDPARTICIPANTSDETAILS", nFlag: 2, selectedRecord: selectedRecord, operation: operation,
                        ncontrolCode:trainingparam.ncontrolCode
                    }
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
                    toast.error(error.message);
                } else {
                    toast.warn(error.response.data);
                }
            })
    }
}
export function getTrainingParticipantsCancel(trainingparam, selectedRecord, masterData, operation) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("trainingcertificate/getCancelParticipants", { "userinfo": trainingparam.userInfo, "ntrainingcode": parseInt(masterData.SelectedTrainingCertificate.ntrainingcode) })
            .then(response => {

                let nusercode = [];

                // const cancelUsersMap = constructOptionList(response.data.CancelParticipants || [], "nusercode",
                //     "sfullname", undefined, undefined, true);

                const cancelUsersList = response.data.CancelParticipants;

                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        usersStatus: cancelUsersList, nusercode: nusercode, loading: false, openChildModal: true,
                        screenName: "IDS_CANCELPARTICIPANTSDETAILS", nFlag: 3, selectedRecord: selectedRecord, operation: operation
                    }
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
                    toast.error(error.message);
                } else {
                    toast.warn(error.response.data);
                }
            })
    }
}

export function rescheduleTrainingCertificate(inputParam, masterData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("trainingcertificate/rescheduleTrainingCertificate", { ...inputParam.inputData })
            .then(response => {
                let masterData = { ...response.data }

                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData,
                        loading: false,
                        showFilter: false,
                        openModal: false
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

export function getAddValidityExpiry(screenName, operation, masterData, userInfo, ncontrolCode){
    return function (dispatch) {    
        //if (masterData.SelectedTestPriceVersion.ntransactionstatus === transactionStatus.DRAFT){     
            if (masterData.SelectedTrainingCertificate.ntransactionstatus !== transactionStatus.CONDUCTED &&
                masterData.SelectedTrainingCertificate.ntransactionstatus !== transactionStatus.COMPLETED &&
                masterData.SelectedTrainingCertificate.ntransactionstatus !== transactionStatus.CANCELLED) {
        dispatch(initRequest(true));
        

        let obj= convertDateValuetoString(masterData.SelectedTrainingCertificate.strainingdatetime ? masterData.SelectedTrainingCertificate.strainingdatetime: new Date(),masterData.SelectedTrainingCertificate.strainingdatetime ? masterData.SelectedTrainingCertificate.strainingdatetime : new Date(),userInfo);
        masterData.SelectedTrainingCertificate.stemptrainingdatetime=obj.toDate+"Z";
        
        let objdate = convertDateValuetoString(masterData.FromDate, masterData.ToDate, userInfo);

        let fromDate = objdate.fromDate;
        let toDate = objdate.toDate;
       

        rsapi().post("trainingcertificate/validateConductAndTrainingDate",{"trainingcertificate":masterData.SelectedTrainingCertificate, 
        "fromDate":fromDate,"toDate":toDate,userinfo:userInfo})
        
        .then(response=>{
        
        
            dispatch({type: DEFAULT_RETURN, payload:{
                operation, screenName, ncontrolCode,
                
                loading:false}});

                //rsapi().post("trainingcertificate/getPeriod",{userinfo:userInfo})
                rsapi().post("/period/getPeriodByControl", {
                    "ncontrolcode": ncontrolCode,
                    "userinfo": userInfo
                })
    
            .then(response=>{
                                      
                
                const PeriodMap = constructOptionList(response.data || [], "nperiodcode",
                        "speriodname", undefined, undefined, true);

                    const periodList = PeriodMap.get("OptionList");

                    dispatch({type: DEFAULT_RETURN, payload:{
                                                            period:periodList,
                                                           
                                                            openModal:true,
                                                            operation, screenName, ncontrolCode,
                                                            
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
                    } else{               
                        toast.warn(error.response.data);
                    }      
                })
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
                } else{               
                    toast.warn(error.response.data);
                }   
            })
            }
            else
            {
                if(masterData.SelectedTrainingCertificate.ntransactionstatus === transactionStatus.CONDUCTED)
                {
                   toast.warn(intl.formatMessage({id: "IDS_TESTTRAININGALREADYCONDUCTED"}));
                }
                if(masterData.SelectedTrainingCertificate.ntransactionstatus === transactionStatus.COMPLETED)
                {
                   toast.warn(intl.formatMessage({id: "IDS_TESTTRAININGALREADYCOMPLETED"}));
                }
                if(masterData.SelectedTrainingCertificate.ntransactionstatus === transactionStatus.CANCELLED)
                {
                   toast.warn(intl.formatMessage({id: "IDS_TESTTRAININGALREADYCANCELLED"}));
                }
            }
              }}
    
               
          

    
         
    

