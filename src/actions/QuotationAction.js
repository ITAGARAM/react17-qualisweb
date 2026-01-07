import rsapi from '../rsapi';
import Axios from 'axios';
import {toast} from 'react-toastify';
import { DEFAULT_RETURN, UN_AUTHORIZED_ACCESS } from './LoginTypes';
import { initRequest } from './LoginAction';
import { sortData ,constructOptionList,rearrangeDateFormat,formatInputDate } from '../components/CommonScript';
import { transactionStatus } from '../components/Enumeration';
import { intl } from "../components/App"; 

export const getreloadQuotation = (inputParam) => {
    return (dispatch) => {
        dispatch(initRequest(true));
        rsapi().post("/quotation/get" + inputParam.methodUrl, inputParam.inputData)
            .then(response => {
                const masterData = response.data
                sortData(masterData);
                    
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false,
                        dataState: undefined,
                        masterData: {
                            ...masterData,
                            // quotation: inputParam.inputData.quotation
                            
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

export function getQuotationClientCategoryComboService(methodParam,selectedRecord) {

    return function (dispatch) {

        let URL = [];

            URL=rsapi().post("/client/getClientByCategory", { "userinfo": methodParam.inputData.userinfo, "nclientcatcode":  methodParam.inputData.primarykey  })

         dispatch(initRequest(true));

        Axios.all([URL])

            .then(response => {

                let Client,sclientsiteaddress,ClientSite,ClientContact;
                
                const ClientMap = constructOptionList(response[0].data.Client || [], "nclientcode","sclientname", undefined, undefined, false);              
                // const ClientSiteMap = constructOptionList(response[0].data.ClientSite || [], "nclientsitecode","sclientsitename", undefined, undefined, false);              
                // const ClientContactMap = constructOptionList(response[0].data.ClientContact || [], "nclientcontactcode","scontactname", undefined, undefined, false);              

                Client = ClientMap.get("OptionList");
                // ClientSite = ClientSiteMap.get("OptionList");
                // ClientContact = ClientContactMap.get("OptionList");

                // let ActiveClientSite = response[0].data.ClientSite.filter(x => x.ndefaultstatus === 3);
                // let ActiveClientContact = response[0].data.ClientContact.filter(x => x.ndefaultstatus === 3);

          
                // if(Client.length>0){
                    
                //     selectedRecord["nclientcode"]=  {
                //         label: response[0].data.selectedClient.sclientname,
                //         value: response[0].data.selectedClient.nclientcode,
                //         item: response[0].data.selectedClient
                //     }

                //     selectedRecord["nclientsitecode"]=  {
                //         label: ActiveClientSite[0].sclientsitename,
                //         value: ActiveClientSite[0].nclientsitecode,
                //         item:  ActiveClientSite[0]
                //     }

                //     selectedRecord["nclientcontactcode"]=  {
                //         label: ActiveClientContact[0].scontactname,
                //         value: ActiveClientContact[0].nclientcontactcode,
                //         item: ActiveClientContact[0].selectedClientContact
                //     }

                // }
                
               selectedRecord = {...selectedRecord}

                dispatch({
                    type: DEFAULT_RETURN, payload:

                        { Client, selectedRecord, ClientSite, ClientContact, loading: false, data: undefined, dataState: undefined, sclientsiteaddress }
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

export function getQuotaionClientComboService(methodParam,selectedRecord) {

    return function (dispatch) {

        let URL = [];

            URL=rsapi().post("/quotation/getSelectedClientDetail", { "userinfo": methodParam.inputData.userinfo, "nclientcode":  methodParam.inputData.primarykey  })

         dispatch(initRequest(true));

        Axios.all([URL])

            .then(response => {

                let ClientSite,ClientContact;

                // let ActiveClientSite =response[0].data.ClientSite.filter(x => x.ndefaultstatus === 3);
                // let ActiveClientSite =response[0].data.ClientSite;
                // let ActiveClientContact = response[0].data.ClientContact.filter(x => x.ndefaultstatus === 3);
                // let ActiveClientContact = response[0].data.ClientContact;


                const ClientSiteMap = constructOptionList(response[0].data.ClientSite || [], "nclientsitecode","sclientsitename", undefined, undefined, false);              
                const ClientContactMap = constructOptionList(response[0].data.ClientContact || [], "nclientcontactcode","scontactname", undefined, undefined, false);  
                
                ClientSite = ClientSiteMap.get("OptionList");
                ClientContact = ClientContactMap.get("OptionList");

                let ActiveClientSite =response[0].data.ClientSite.filter(x => x.ndefaultstatus === 3);
                let ActiveClientContact = response[0].data.ClientContact.filter(x => x.ndefaultstatus === 3);

                if(ActiveClientSite.length>0){

                    selectedRecord["nclientsitecode"]=  {
                        label: ActiveClientSite[0].sclientsitename,
                        value: ActiveClientSite[0].nclientsitecode,
                        item:  ActiveClientSite[0]
                    }
              }

              if(ActiveClientContact.length>0){

                selectedRecord["nclientcontactcode"]=  {
                    label: ActiveClientContact[0].scontactname,
                    value: ActiveClientContact[0].nclientcontactcode,
                    item:  ActiveClientContact[0]
                }

            }
                dispatch({
                    type: DEFAULT_RETURN, payload:

                        { selectedRecord, ClientSite, ClientContact, loading: false, data: undefined, dataState: undefined }
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

export function getQuotaionClientSiteComboService(methodParam,selectedRecord) {

    return function (dispatch) {

        let URL = [];

            URL=rsapi().post("/client/getClientContactInfoBySite", { "userinfo": methodParam.inputData.userinfo, "nclientcode":  methodParam.inputData.nclientcode,"nclientsitecode":  methodParam.inputData.primarykey  })

         dispatch(initRequest(true));

        Axios.all([URL])

            .then(response => {

                let ClientContact;
                const ClientContactMap = constructOptionList(response[0].data || [], "nclientcontactcode","scontactname", undefined, undefined, false);  
                
                ClientContact = ClientContactMap.get("OptionList");

                  let ActiveClientContact = response[0].data.filter(x => x.ndefaultstatus === 3);
                //  let ActiveClientContact = response[0].data;


              if(ActiveClientContact.length>0){

                // ClientContact = ClientContactMap.get("OptionList");
                
                selectedRecord["nclientcontactcode"]=  {
                    label: ActiveClientContact[0].scontactname,
                    value: ActiveClientContact[0].nclientcontactcode,
                    item:  ActiveClientContact[0]
                }

              }
            //   else{
            //     selectedRecord["nclientcontactcode"]=  {
            //         label: "",
            //         value: "",
            //         item:  ""
            //     }

            //   }
               

                dispatch({
                    type: DEFAULT_RETURN, payload:

                        { selectedRecord, ClientContact, loading: false, data: undefined, dataState: undefined }
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

export function getQuotaionProductCategoryComboService(methodParam,selectedRecord) {

    return function (dispatch) {

        let URL = [];

            URL=rsapi().post("/quotation/getProductByCategory", { "userinfo": methodParam.inputData.userinfo, "nproductcatcode":  methodParam.inputData.primarykey  })

         dispatch(initRequest(true));

        Axios.all([URL])

            .then(response => {

                let Product;
               
                const usertMap = constructOptionList(response[0].data.Product || [], "nproductcode","sproductname", undefined, undefined, false);              

                Product = usertMap.get("OptionList");

                if(Product.length>0){
                    
                    selectedRecord["nproductcode"]=  {
                        label: response[0].data.Product[0].sproductname,
                        value: response[0].data.Product[0].nproductcode,
                        item: response[0].data.Product[0]
                    }

                }
                
               selectedRecord = {...selectedRecord}

                dispatch({
                    type: DEFAULT_RETURN, payload:

                        { Product, selectedRecord, loading: false, data: undefined, dataState: undefined }
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

export function getProjectTypeComboService(methodParam,selectedRecord) {

    return function (dispatch) {

        let URL = [];

            URL=rsapi().post("/projectmaster/getApprovedProjectMasterByProjectType", { "userinfo": methodParam.inputData.userinfo, "nprojecttypecode":  methodParam.inputData.primarykey  })

         dispatch(initRequest(true));

        Axios.all([URL])

            .then(response => {

                let ProjectCode,ProjectMaster=[];    
                // let srfwdate;

                const usertMap = constructOptionList(response[0].data.ProjectCode || [], "nprojectmastercode","sprojectcode", undefined, undefined, false);              

                ProjectCode = usertMap.get("OptionList");
    
                if(ProjectCode.length>0){

                    selectedRecord["nprojectmastercode"]=  {
                                label: response[0].data.SelectedProjectCode.sprojectcode,
                                value: response[0].data.SelectedProjectCode.nprojectmastercode,
                        item: response[0].data.SelectedProjectCode
                    }

                // srfwdate= rearrangeDateFormat( methodParam.inputData.userinfo, response[0].data.Projectmaster[0].srfwdate); --  New
                //  srfwdate=response[0].data.Projectmaster[0].srfwdate;
                    selectedRecord["sprojecttitle"]=response[0].data.Projectmaster[0].sprojecttitle;
                // selectedRecord["srfwdate"]=srfwdate; -- New
                    selectedRecord["suserrolename"]=response[0].data.Projectmaster[0].suserrolename;
                    selectedRecord["susername"]=response[0].data.Projectmaster[0].susername;
                    // selectedRecord["nuserrolecode"]=response[0].data.Projectmaster[0].nuserrolecode;
                    selectedRecord["nusercode"]=response[0].data.Projectmaster[0].nusercode;
                    // ProjectMaster={...response[0].data.Projectmaster[0],srfwdate:srfwdate};
                }
               


                dispatch({
                    type: DEFAULT_RETURN, payload:

                        { selectedRecord, loading: false, data: undefined, dataState: undefined, ProjectCode, ProjectMaster }
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

export function getProjectCodeComboService(methodParam,selectedRecord) {

    return function (dispatch) {

        let URL = [];

            URL=rsapi().post("/projectmaster/getActiveProjectMasterById", { "userinfo": methodParam.inputData.userinfo, "nprojectmastercode":  methodParam.inputData.primarykey  })

         dispatch(initRequest(true));

        Axios.all([URL])

            .then(response => {

                // let ProjectMaster=[];  
                // let srfwdate;  
               
                // srfwdate= rearrangeDateFormat( methodParam.inputData.userinfo, response[0].data.Projectmaster[0].srfwdate);
                
                // ProjectMaster=response[0].data.SelectedProjectMaster;

                selectedRecord["nprojectmastercode"]=  {
                    label: response[0].data.SelectedProjectMaster.sprojectcode,
                    value: response[0].data.SelectedProjectMaster.nprojectmastercode,
                    item: response[0].data.SelectedProjectMaster
                }

                // srfwdate=response[0].data.SelectedProjectMaster.srfwdate;
                // ProjectMaster={...response[0].data.SelectedProjectMaster,srfwdate:srfwdate};

                // srfwdate= rearrangeDateFormat( methodParam.inputData.userinfo, response[0].data.SelectedProjectMaster.srfwdate); -- New
                selectedRecord["sprojecttitle"]=response[0].data.SelectedProjectMaster.sprojecttitle;
                // selectedRecord["srfwdate"]=srfwdate; -- New
                selectedRecord["suserrolename"]=response[0].data.SelectedProjectMaster.suserrolename;
                selectedRecord["susername"]=response[0].data.SelectedProjectMaster.susername;
                // selectedRecord["nuserrolecode"]=response[0].data.SelectedProjectMaster.nuserrolecode;
                selectedRecord["nusercode"]=response[0].data.SelectedProjectMaster.nusercode;

                dispatch({
                    type: DEFAULT_RETURN, payload:

                        { selectedRecord, loading: false, data: undefined, dataState: undefined }
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

//Add Quotation
export const addQuotation = (operation, userInfo, ncontrolCode, selectedQuotation, timeZone) => {
    return function (dispatch) {
        if (operation === "create" || (operation === "update" && (selectedQuotation.ntransactionstatus !== transactionStatus.APPROVED && selectedQuotation.ntransactionstatus !== transactionStatus.RETIRED))) {
                dispatch(initRequest(true));
            const urlArray = [
            ];
            let selectedRecord = {};

             if (operation === "create" || operation === "update") {

                // urlArray.push(rsapi().post("clientcategory/getClientCategory", {
                //     "userinfo": userInfo
                // }));

                urlArray.push(rsapi().post("quotation/getClientCategory", {
                    "userinfo": userInfo
                }));

                // urlArray.push(rsapi().post("client/getClientByCategory", {
                //     "nclientcatcode": selectedQuotation.nclientcatcode,
                //     "userinfo": userInfo
                // })); 


                urlArray.push(rsapi().post("projecttype/getProjectType", {
                    "userinfo": userInfo 
                    
                })); 
         
                urlArray.push(rsapi().post("quotation/getQuotationType", {
                    "userinfo": userInfo 
                    
                })); 

                // urlArray.push(rsapi().post("productcategory/getProductCategory", {
                //     "userinfo": userInfo 
                    
                // })); 

                urlArray.push(rsapi().post("quotation/getProductCategory", {
                    "userinfo": userInfo 
                    
                })); 

                urlArray.push(rsapi().post("quotation/getProductByCategory", {
                    "nproductcatcode": selectedQuotation  === null?-1:selectedQuotation.nproductcatcode,
                    "userinfo": userInfo 
                    
                })); 

                urlArray.push(rsapi().post("oem/getOEM", {
                    "nproductcode": null,
                    "userinfo": userInfo 
                    
                }));
            } 
             if (operation === "update"){

                urlArray.push(rsapi().post("quotation/getActiveQuotationById", {
                    "userinfo": userInfo,
                    "nquotationcode": selectedQuotation.nquotationcode
                }));

                urlArray.push(rsapi().post("quotation/getSelectedClientDetail", {
                    "userinfo": userInfo,
                    "nclientcode": selectedQuotation.nclientcode
                }));

                urlArray.push(rsapi().post("client/getClientByCategory", {
                    "nclientcatcode": selectedQuotation.nclientcatcode,
                    "userinfo": userInfo
                })); 

            }

            urlArray.push(rsapi.post("/timezone/getLocalTimeByZone", {//6,9
                "userinfo": userInfo
            }))

            Axios.all(urlArray)
                .then(response => {

               
                let testData = {};
                    let timeZoneList=[];

                let ClientCategory,Client,ProjectType,ProjectMaster,sclientsiteaddress,
                    QuotationType,Product,ProductCategory,OEM,ClientSite,ClientContact;
                
             const TimeZoneMap = constructOptionList(timeZone || [], "ntimezonecode", "stimezoneid", undefined, undefined, true);
                            timeZoneList = TimeZoneMap.get("OptionList");
              if (operation === "create") {
                   
                   
                     ClientCategory = constructOptionList(response[0].data || [], "nclientcatcode", "sclientcatname", false, false, true).get("OptionList");
                   
              //       Client = constructOptionList(response[1].data || [], "nclientcode", "sclientname", false, false, true).get("OptionList");

                     ProjectType = constructOptionList(response[1].data || [], "nprojecttypecode", "sprojecttypename", false, false, true).get("OptionList");
                     QuotationType = constructOptionList(response[2].data || [], "nquotationtypecode", "squotationname", false, false, true).get("OptionList");

                        // selectedRecord["dquotationdate"] = new Date();
                    ProductCategory = constructOptionList(response[3].data || [], "nproductcatcode", "sproductcatname", false, false, true).get("OptionList");
                    OEM = constructOptionList(response[5].data || [], "noemcode", "soemname", false, false, true).get("OptionList");
                    // Product = constructOptionList(response[5].data.Product || [], "nproductcode", "sproductname", false, false, true).get("OptionList");

                        selectedRecord["dquotationdate"] = rearrangeDateFormat(userInfo, response[6].data?.date);
                        if (userInfo.isutcenabled === transactionStatus.YES && userInfo.istimezoneshow === transactionStatus.YES) {
                            const timezone = timeZoneList.filter(x => x.value === userInfo.ntimezonecode);
                            selectedRecord["ntzquotationdate"] = timezone[0];
                        }
                     

                }else if (operation === "update") {
                    
                    
                    const editData = response[6].data.SelectedQuotation;
                    // ProjectMaster=response[5].data.SelectedQuotation;

                    // sclientsiteaddress = editData.sclientsiteaddress;
                    selectedRecord["sclientsiteaddress"]=editData.sclientsiteaddress;
                    // selectedRecord["sinvoiceaddress"] = editData.sinvoiceaddress;
                    // selectedRecord["sprojecttitle"] = editData.sprojecttitle;
                    selectedRecord["sdescription"] = editData.sdescription;
                    selectedRecord["sdeviationremarks"] = editData.sdeviationremarks;
                    // selectedRecord["suserrolename"] = editData.suserrolename;
                    // selectedRecord["susername"] = editData.susername;
                    // selectedRecord["nuserrolecode"] = editData.nuserrolecode;
                    // selectedRecord["nusercode"] = editData.nusercode;
                    selectedRecord["soem"] = editData.soem;
                    selectedRecord["squotationleadtime"] = editData.squotationleadtime;
                
                    selectedRecord = {...selectedRecord}

                    const ClientCategoryMap = constructOptionList(response[0].data || [], "nclientcatcode", "sclientcatname", false, false, true);
                    const ClientMap = constructOptionList(response[8].data.Client || [], "nclientcode", "sclientname", false, false, true);
                    // ProjectType = constructOptionList(response[2].data || [], "nprojecttypecode", "sprojecttypename", false, false, true);
                    // QuotationType = constructOptionList(response[3].data || [], "nquotationtypecode", "squotationname", false, false, true)
                    const ProductCategoryMap = constructOptionList(response[3].data || [], "nproductcatcode", "sproductcatname", false, false, true);
                    const ProductMap = constructOptionList(response[4].data.Product || [], "nproductcode", "sproductname", false, false, true);
                    const OEMMap = constructOptionList(response[5].data || [], "noemcode", "soemname", false, false, true);
                    const ClientSiteMap= constructOptionList(response[7].data.ClientSite || [], "nclientsitecode","sclientsitename", undefined, undefined, false);        
                    const ClientContactMap = constructOptionList(response[7].data.ClientContact || [], "nclientcontactcode","scontactname", undefined, undefined, false);
                          

                    ClientCategory = ClientCategoryMap.get("OptionList");
                    Client = ClientMap.get("OptionList");
                    ProductCategory = ProductCategoryMap.get("OptionList");
                    Product = ProductMap.get("OptionList");
                    OEM = OEMMap.get("OptionList");
                    ClientSite = ClientSiteMap.get("OptionList");
                    ClientContact = ClientContactMap.get("OptionList");

                    // selectedRecord["nprojecttypecode"] = {
                    //     "value": editData["nprojecttypecode"],
                    //     "label":  editData["sprojecttypename"]
                    // };

                    selectedRecord["nclientcatcode"] = {
                        "value": editData["nclientcatcode"],
                        "label": editData["sclientcatname"]
                    };

                    selectedRecord["nclientcode"] = {
                        "value": editData["nclientcode"],
                        "label": editData["sclientname"]
                    };
                    
                    // selectedRecord["nquotationtypecode"] = {
                    //     "value": editData["nquotationtypecode"],
                    //     "label": editData["squotationname"]
                    // };

                    // selectedRecord["nprojectmastercode"] = {
                    //     "value": editData["nprojectmastercode"],
                    //     "label": editData["sprojectcode"]
                    // };
                  
                    selectedRecord["nproductcatcode"] = {
                        "value": editData["nproductcatcode"],
                        "label": editData["sproductcatname"]
                    };

                    selectedRecord["nproductcode"] = {
                        "value": editData["nproductcode"],
                        "label": editData["sproductname"]
                    };

                    selectedRecord["noemcode"] = {
                        "value": editData["noemcode"],
                        "label": editData["soemname"]
                    };

                    selectedRecord["nclientsitecode"] = {
                        "value": editData["nclientsitecode"],
                        "label": editData["sclientsitename"]
                    };
    
                    selectedRecord["nclientcontactcode"] = {
                        "value": editData["nclientcontactcode"],
                        "label": editData["scontactname"]
                    };
                // selectedRecord["srfwdate"] = rearrangeDateFormat(userInfo,editData.srfwdate);
                selectedRecord["dquotationdate"] = rearrangeDateFormat(userInfo,editData.squotationdate);
                
                           selectedRecord["ntzquotationdate"] = {
                            "value": editData["ntzquotationdate"],
                            "label": editData["stzquotationdate"]
                        };


                }
                   
                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {
  
                            openModal: true,
                            ProjectType,
                            operation: operation,ClientCategory,Client,ProjectMaster,sclientsiteaddress,QuotationType,
                            Product,ProductCategory,OEM,ClientSite,ClientContact,
                            screenName: "IDS_QUOTATION",modalScreenSize:false,
                            selectedRecord,
                            ncontrolCode,
                            testData,
                            loading: false,timeZoneList
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
                        toast.warn(error.response.data["rtn"]);
                    }
                });
            }
        else if(selectedQuotation.ntransactionstatus === transactionStatus.APPROVED){

            toast.warn(intl.formatMessage({ id: "IDS_CANNOTEDITAPPROVEDQUOTATION" }));
  
        }else if(selectedQuotation.ntransactionstatus === transactionStatus.RETIRED){

            toast.warn(intl.formatMessage({ id: "IDS_CANNOTEDITRETIREDQUOTATION" }));
  
        }else {
                          
            toast.warn(intl.formatMessage({id: "IDS_SELECTDRAFTVERSION"}));

        }
    }
}

export const GrossQuotation = (operation, userInfo, ncontrolCode,selectedQuotation ) => {
    return function (dispatch) {
    //  if (operation === "create" || (operation === "update" && selectedQuotation.ntransactionstatus !== transactionStatus.RETIRED)) {
                dispatch(initRequest(true));
            const urlArray = [
            ];
            let selectedRecord = {};

                urlArray.push(rsapi().post("discountband/getDiscountBand", {
                    "userinfo": userInfo
                }));

                urlArray.push(rsapi().post("vatband/getVATBand", {
                    "userinfo": userInfo
                })); 

                urlArray.push(rsapi().post("quotation/getQuotationGrossAmount", {
                    "nquotationcode": selectedQuotation.nquotationcode,
                    "userinfo": userInfo
                })); 

            
            Axios.all(urlArray)
                .then(response => {

                let {DiscountBand,VATBand}=[]
                
                DiscountBand = constructOptionList(response[0].data || [], "ndiscountbandcode", "sdiscountbandname", false, false, true).get("OptionList");
                VATBand = constructOptionList(response[1].data || [], "nvatbandcode", "svatbandname", false, false, true).get("OptionList");
                const QuotationGrossAmount= response[2].data;

                if(QuotationGrossAmount[0].ndiscountpercentage >0 || QuotationGrossAmount[0].nvatpercentage >0){

                   
                //  selectedRecord["ndiscountamount"] = QuotationGrossAmount[0].ndiscountamount; 
               //   selectedRecord["nvatamount"] = QuotationGrossAmount[0].nvatamount; 
                     
               selectedRecord["ndiscountpercentage"]= QuotationGrossAmount[0].ndiscountpercentage;
               selectedRecord["DiscountAmount"] = QuotationGrossAmount[0].ndiscountamount;

               selectedRecord["nvatpercentage"] = QuotationGrossAmount[0].nvatpercentage;  
               selectedRecord["VatAmount"] = QuotationGrossAmount[0].nvatamount;
               selectedRecord["TotalNetAmount"]=(QuotationGrossAmount[0].ntotalgrossamount+selectedRecord["VatAmount"])-selectedRecord["DiscountAmount"];

                   if(QuotationGrossAmount[0].ndiscountpercentage >0) {

                    selectedRecord["ndiscountbandcode"] = {
                        "value": QuotationGrossAmount[0]["ndiscountbandcode"],
                        "label": QuotationGrossAmount[0]["sdiscountbandname"]
                    }
                   }
                    
                   if(QuotationGrossAmount[0].nvatpercentage >0) {

                    selectedRecord["nvatbandcode"] = {
                        "value": QuotationGrossAmount[0]["nvatbandcode"],
                        "label":  QuotationGrossAmount[0]["svatbandname"]
                      }
                    }
                   
                }else {

   /*                 selectedRecord["ndiscountpercentage"]= DiscountBand[0].item.namount;
                    selectedRecord["nvatpercentage"] = VATBand[0].item.namount;

                    selectedRecord["nvatbandcode"] = {
                        "value": VATBand[0]["value"],
                        "label": VATBand[0]["label"]
                    };

                    selectedRecord["ndiscountbandcode"] = {
                        "value": DiscountBand[0]["value"],
                        "label": DiscountBand[0]["label"]
                    }; 

                    selectedRecord["DiscountAmount"]=QuotationGrossAmount[0].ntotalgrossamount * (DiscountBand[0].item.namount/100);
                    selectedRecord["VatAmount"]=QuotationGrossAmount[0].ntotalgrossamount * (VATBand[0].item.namount/100);
     //             selectedRecord["TotalNetAmount"]=QuotationGrossAmount[0].ntotalgrossamount+(selectedRecord["DiscountAmount"]-selectedRecord["VatAmount"]);
                    selectedRecord["TotalNetAmount"]=(QuotationGrossAmount[0].ntotalgrossamount+selectedRecord["VatAmount"])-selectedRecord["DiscountAmount"];

*/
                    selectedRecord["ndiscountpercentage"]= 0;
                    selectedRecord["nvatpercentage"] = 0;
                    selectedRecord["nvatbandcode"] ="";
                    selectedRecord["ndiscountbandcode"] = "";
                    selectedRecord["DiscountAmount"]=0;
                    selectedRecord["VatAmount"]=0;
                    selectedRecord["TotalNetAmount"]=QuotationGrossAmount[0].ntotalgrossamount;

                }

                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {
  
                            openChildModal: true,
                            DiscountBand,modalScreenSize:false,
                            operation: operation,VATBand,QuotationGrossAmount,
                            screenName: "IDS_CALCULATEPRICING",
                            selectedRecord,
                            ncontrolCode,
                            loading: false
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
        //  } else {
                          
        //         toast.warn(intl.formatMessage({id: "IDS_SELECTDRAFTVERSION"}));

        //  }
    }
}

//Quotation Record Click 
export const getQuotation = (quotationItem, userInfo, masterData) => {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("/quotation/getActiveQuotationById", {
            nquotationcode: quotationItem.nquotationcode,
                userinfo: userInfo
            })
            .then(response => {
                

                let masterData1 = {
                    ...masterData,

                    ...response.data
                }

                    // ...masterData,
                    // ...response.data
                    masterData=masterData1
                sortData(masterData);
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                       // masterData,
                        loading: false,
                        dataState: undefined,
                        masterData
                        
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
                    //status 417
                    toast.warn(intl.formatMessage({
          
                      id: error.response.data["rtn"]
          
                    }));
          
                  }
            });
    }
}

export function getQuotationAddTestService(screenName, operation, masterData, userInfo, ncontrolCode){
    return function (dispatch) {    
        if (masterData.SelectedQuotation.ntransactionstatus === transactionStatus.DRAFT){     
        
        dispatch(initRequest(true));
        rsapi().post("quotation/getQuotationUnmappedTest",{
            "nquotationcode":masterData.SelectedQuotation["nquotationcode"], 
                userinfo: userInfo
            })

        .then(response=>{

                    let masterData1 = {
                        ...masterData,

                        ...response.data
                    }
                masterData=masterData1                       
                    dispatch({
                        type: DEFAULT_RETURN, payload: {
                                                        QuotationTestList:response.data,
                                                        masterData,modalScreenSize:false,
                                                        openChildModal:true,
                                                        operation, screenName, ncontrolCode,
                                                        //selectedRecord, 
                            loading: false
                        }
                    });
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
        toast.warn(intl.formatMessage({id: "IDS_SELECTDRAFTVERSION"}));
    }
    }
}


export function getQuotationPricingEditService(editParam){
    return function (dispatch) {    
       // screenName, operation, masterData, userInfo, ncontrolCode
       //console.log("editParam:", editParam);
        if (editParam.masterData.SelectedQuotation.ntransactionstatus === transactionStatus.DRAFT){     
        
        dispatch(initRequest(true));
        const urlArray = [
        ];
        

            urlArray.push(rsapi().post("discountband/getDiscountBand", {
                "userinfo": editParam.userInfo
            }));

            urlArray.push( rsapi().post("quotation/getQuotationPrice",{"nquotationcode":editParam.masterData.SelectedQuotation["nquotationcode"], 
            "nquotationtestcode":editParam.editRow ? editParam.editRow.nquotationtestcode :null,
                userinfo: editParam.userInfo
            }));

        
        Axios.all(urlArray)
        .then(response=>{

            let {DiscountBand}=[];
            let selectedRecord =[];

            DiscountBand = constructOptionList(response[0].data || [], "ndiscountbandcode", "sdiscountbandname", false, false, true).get("OptionList");
            
            // selectedRecord["namount"]= response[0].data[0].namount;
            // selectedRecord["ndiscountbandcode"]= response[0].data[0].ndiscountbandcode;

                
                if (editParam.editRow){

                    selectedRecord.push(response[1].data["SelectedQuotationPrice"]);
                        selectedRecord[0]["ndiscountbandcode"] = {
                            ...selectedRecord[0]["ndiscountbandcode"],
    
                            label: selectedRecord[0].sdiscountbandname,
                            value: selectedRecord[0].ndiscountbandcode
                        }
                  
                }
                else{  

                    selectedRecord = sortData(response[1].data["QuotationPrice"]);   
                    response[1].data["QuotationPrice"].forEach((item, index) => {
                
                            selectedRecord[index]["ndiscountbandcode"] = {
                                ...selectedRecord[index]["ndiscountbandcode"],
    
                            label: item.sdiscountbandname,
                            value: item.ndiscountbandcode
                            
                        }
                    });
                }
                    dispatch({
                        type: DEFAULT_RETURN, payload: {//pricingTestList:testList, 
                                                        //testPriceList:response.data["TestPrice"],
                                                        openChildModal:true,modalScreenSize:true,
                                                        operation:editParam.operation,
                                                        screenName:editParam.screenName, 
                                                        ncontrolCode:editParam.ncontrolCode,
                                                        selectedRecord, 
                                                        selectedId:editParam.editRow ? editParam.editRow.nquotationtestcode :null,
                                                        loading:false,
                                                        quotationDataState:editParam.quotationDataState,
                            DiscountBand
                        }
                    });
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
        toast.warn(intl.formatMessage({id: "IDS_SELECTDRAFTVERSION"}));
    }
    }
}

export const handleRetireQuotation = (operation, userInfo, ncontrolCode,selectedQuotation) => {
    return function (dispatch) {
        if (operation === "retire" && (selectedQuotation.ntransactionstatus === transactionStatus.APPROVED)) {
                dispatch(initRequest(true));
            let urlArray = [];
            urlArray.push(rsapi().post("timezone/getTimeZone"));
            urlArray.push(rsapi().post("timezone/getLocalTimeByZone", {
                userinfo: userInfo
            }));
            

            Axios.all(urlArray)
                .then(response => {

               
                let selectedRecord = {};
                const timezoneMap = constructOptionList(response[0].data || [], "ntimezonecode",
                "stimezoneid", undefined, undefined, false);
                selectedRecord = {
                    "ntzretiredatetime": {
                        "value": userInfo.ntimezonecode,
                        "label": userInfo.stimezoneid
                    },
                    "stzretiredatetime": userInfo.stimezoneid,
                };
                const TimeZoneList = timezoneMap.get("OptionList");
                const popUp="IDS_RETIREQUOTATION";
                const date = rearrangeDateFormat(userInfo, response[1].data?.date);
                    selectedRecord["dretiredatetime"] = date;

                
                    const operation = "retire";
                    const modalTitle = "IDS_RETIREQUOTATION";

                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {
  
                            modalShow: true,
                            operation: operation,
                            modalTitle: modalTitle,
                            screenName: "IDS_QUOTATION",
                            modalScreenSize:false,
                            TimeZoneList: TimeZoneList,
                            selectedRecord,
                            ncontrolCode,
                            popUp:popUp,
                            loading: false
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
        else {
                          
            toast.warn(intl.formatMessage({id: "IDS_SELECTAPPROVEDQUOTATION"}));

        }
    }
}

