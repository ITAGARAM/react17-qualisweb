import rsapi from '../rsapi';
import { DEFAULT_RETURN, UN_AUTHORIZED_ACCESS } from './LoginTypes';
import { toast } from 'react-toastify';
import Axios from 'axios';
import { initRequest } from './LoginAction';
import { constructOptionList, sortData } from '../components/CommonScript';
import { intl } from '../components/App';
import { transactionStatus ,attachmentType} from '../components/Enumeration';


export function getClientComboService(clientparam) {
    return function (dispatch) {
        if (clientparam.nfilterClientCategory && Object.values(clientparam.nfilterClientCategory).length > 0) {
        if (clientparam.operation === "create" || clientparam.operation === "update") {
            const countryService = rsapi().post("country/getCountry", { userinfo: clientparam.userInfo });
            const clientCatService = rsapi().post("clientcategory/getClientCategory", { userinfo: clientparam.userInfo });
            let urlArray = [];
            let selectedId = null;
            if (clientparam.operation === "create") {

                urlArray = [countryService,clientCatService];
            }
            else {
                const clientById = rsapi().post("client/getActiveClientById", { [clientparam.primaryKeyField]: clientparam.masterData.selectedClient[clientparam.primaryKeyField], "userinfo": clientparam.userInfo });

                urlArray = [countryService, clientById,clientCatService];
                selectedId = clientparam.primaryKeyValue;
            }
            dispatch(initRequest(true));
            Axios.all(urlArray)
                .then(response => {
                    let country = [];
                    let clientCaegory = [];
                    let selectedRecord = {};
                    if (clientparam.operation === "update") {
                        selectedRecord = response[1].data;
                        country.push({ "value": response[1].data["ncountrycode"], "label": response[1].data["scountryname"] });
                        selectedRecord["ncountrycode"] = country[0];

                        const clientCatList = constructOptionList(response[2].data || [], "nclientcatcode",
                        "sclientcatname", undefined, undefined, undefined);
                        clientCaegory = clientCatList.get("OptionList");
                        selectedRecord['nclientcatcode']={ "value": response[1].data["nclientcatcode"], "label": response[1].data["sclientcatname"] }
                    } else {
                        selectedRecord["ntransactionstatus"] = 1;
                        const clientCatList = constructOptionList(response[1].data || [], "nclientcatcode",
                        "sclientcatname", undefined, undefined, undefined);
                        clientCaegory = clientCatList.get("OptionList");
                        selectedRecord["nclientcatcode"]= clientparam.nfilterClientCategory.value === -2 ? (clientCaegory.length > 0 ?
                            clientCaegory[0] : "") : clientparam.nfilterClientCategory
                    }

                    dispatch({
                        type: DEFAULT_RETURN, payload: {
                            countryList: response[0].data || [],
                            clientCategoryList:clientCaegory,
                            selectedRecord, openModal: true,
                            operation: clientparam.operation, screenName: clientparam.screenName,
                            ncontrolCode: clientparam.ncontrolCode, loading: false, selectedId
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
    } else {
            toast.warn(intl.formatMessage({
                id: "IDS_CLIENTCATEGORYNOTAVAILABLE"
            }))
        }
    }
 
}


export const changeClientCategoryFilter = (inputParam, filterClientCategory, nfilterClientCategory) => {
    return (dispatch) => {
        dispatch(initRequest(true));
        rsapi().post("/client/get" + inputParam.methodUrl, inputParam.inputData)
            .then(response => {
                const masterData = response.data
                sortData(masterData);
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false,
                        masterData: {
                            ...masterData,
                            filterClientCategory,
                            nfilterClientCategory
                            // nfilterClientCategory: inputParam.inputData.nfilterClientCategory
                        }
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
            });
    }
}

export function getClientDetail (client, userInfo, masterData) {
    return function (dispatch) {   
    dispatch(initRequest(true));
    return rsapi().post("client/getSelectedClientDetail", {nclientcode:client.nclientcode, userinfo:userInfo})
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
}}
export function getClientSiteForAddEdit(screenName, operation, nclientcode, nclientsitecode, ncontrolCode, userInfo){
    return function(dispatch){ 
    let urlArray = [];
    let selectedRecord = {};

    if (operation === "create") {
        const Country = rsapi().post("/country/getCountry", { "userinfo": userInfo });
        urlArray = [Country];
    }
    else {

        const Country = rsapi().post("/country/getCountry", { "userinfo": userInfo });
        const clientSiteByID = rsapi().post("/client/getClientSiteAddressById", { "nclientcode": nclientcode, "nclientsitecode": nclientsitecode ,"userinfo": userInfo});
        urlArray = [Country, clientSiteByID];
    }

    dispatch(initRequest(true));
    Axios.all(urlArray)
        .then(response => {

            let countryCode = [];

            const countryMap = constructOptionList(response[0].data || [], "ncountrycode",
            "scountryname", undefined, undefined, true);

            const countryList = countryMap.get("OptionList");


            if (operation === "update") {

                selectedRecord = response[1].data;
                selectedRecord["ncountrycode"] = {
                    label: response[1].data["scountryname"],
                    value: response[1].data["ncountrycode"]
                };
            
            }

            dispatch({type: DEFAULT_RETURN, payload:{
                Country: countryList, openChildModal:true, operation, 
                selectedRecord: operation === "update" ? selectedRecord : {"ntransactionstatus": transactionStatus.ACTIVE,"ndefaultstatus":transactionStatus.NO}, countryCode: countryCode, ncontrolCode,
                screenName: "IDS_CLIENTSITE", loading:false
             }});
        })
        .catch(error => {
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
        } else if (error.response.status === 500) {
                toast.error(intl.formatMessage({ id: error.message }));
            }
            else {
                toast.warn(intl.formatMessage({ id: error.response.data }));
            }
        })
    }
}

export function getClientSiteContactDetails(inputParam){
    return function(dispatch){ 
    let Map={};
 
    Map["nclientcode"]=inputParam.clientSite.nclientcode;
    Map["nclientsitecode"]=inputParam.clientSite.nclientsitecode;
    Map["userinfo"]=inputParam.userInfo;
    dispatch(initRequest(true));
    rsapi().post("/client/getClientContactInfoBySite",Map)
    .then(response =>{          
       let masterData = {...inputParam.masterData, ClientContact: response.data,
            selectedClientSite:  inputParam.clientSite,
            };     
        sortData(masterData);
        dispatch({type: DEFAULT_RETURN, payload:{masterData, loading:false, dataState: undefined}}); 

    })
    .catch(error =>{
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
        } else if (error.response.status === 500) {
                toast.error(error.message);
        }
    })
}
}
export function getClientContactForAddEdit(fetchRecord){
    return function(dispatch){ 
    let urlArray = [];
    let selectedId = null;
    const ClientContactByID = rsapi().post("/client/getClientContactInfoById", { "nclientcode": fetchRecord.editRow.nclientcode, "nclientsitecode": fetchRecord.editRow.nclientsitecode, "nclientcontactcode": fetchRecord.editRow.nclientcontactcode,"userinfo": fetchRecord.userInfo });
    urlArray = [ClientContactByID];
    selectedId = fetchRecord.editRow.nclientcontactcode;

    dispatch(initRequest(true));
    Axios.all(urlArray)
        .then(response => {            
            dispatch({type: DEFAULT_RETURN, payload:{
                openChildModal:true, operation:fetchRecord.operation, 
                selectedRecord: fetchRecord.operation === "update" ? response[0].data : undefined,
          defaultSite: fetchRecord.editRow.nclientsitecode, ncontrolCode:fetchRecord.ncontrolCode ,
          screenName: "IDS_CLIENTCONTACT", loading:false, selectedId
        }});
        })
        .catch(error => {
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
        } else if (error.response.status === 500) {
                toast.error(intl.formatMessage({ id: error.message }));
            }
            else {
                toast.warn(intl.formatMessage({ id: error.response.data }));
            }
        })
    }
    
}



export const addClientFile = (inputParam) => {
    return (dispatch) => {
        dispatch(initRequest(true));
        let urlArray = [rsapi().post("/linkmaster/getLinkMaster", {
            userinfo: inputParam.userInfo
        })];
        if (inputParam.operation === "update") {
            urlArray.push(rsapi().post("/client/editClientFile", {
                userinfo: inputParam.userInfo,
                clientfile: inputParam.selectedRecord
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
                    if (editObject.nattachmenttypecode === attachmentType.LINK) {
                        nlinkcode = {
                            "label": editObject.slinkname,
                            "value": editObject.nlinkcode
                        }

                        link = {
                            slinkfilename: editObject.sfilename,
                            slinkdescription: editObject.sdescription,
                            nlinkdefaultstatus: editObject.ndefaultstatus,
                            sfilesize: '',
                            nfilesize: 0,
                            ndefaultstatus: 4,
                            sfilename: '',
                        }

                    } else {
                        nlinkcode = defaultLink.length > 0 ? defaultLink[0] : "" //{"label": defaultLink[0].slinkname, "value": defaultLink[0].nlinkcode}:""
                        link = {
                            slinkfilename: '',
                            slinkdescription: '',
                            nlinkdefaultstatus: 4,
                            sfilesize: editObject.sfilesize,
                            nfilesize: editObject.nfilesize,
                            ndefaultstatus: editObject.ndefaultstatus,
                            sfilename: editObject.sfilename,
                            sdescription:editObject.sdescription,
                            ssystemfilename: editObject.ssystemfilename
                        }
                    }



                    selectedRecord = {
                        ...link,
                        nclientfilecode: editObject.nclientfilecode,
                        nattachmenttypecode: editObject.nattachmenttypecode,
                        // sdescription:editObject.sdescription,
                        nlinkcode,

                        // disabled: true
                    };
                } else {
                    selectedRecord = {
                        nattachmenttypecode: response[0].data.AttachmentType.length > 0 ?
                            response[0].data.AttachmentType[0].nattachmenttypecode : attachmentType.FTP,
                        nlinkcode: defaultLink.length > 0 ? defaultLink[0] : "", //{"label": defaultLink[0].slinkname, "value": defaultLink[0].nlinkcode}:"",
                        disabled
                    };
                }
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        [inputParam.modalName]: true,
                        operation: inputParam.operation,
                        screenName: inputParam.screenName,
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