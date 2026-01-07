import rsapi from '../rsapi';
import {DEFAULT_RETURN,UN_AUTHORIZED_ACCESS} from './LoginTypes';
import {sortData, constructOptionList} from '../components/CommonScript';
import Axios from 'axios';
import { initRequest } from './LoginAction';
import { intl } from '../components/App';
import { toast } from 'react-toastify';
import { transactionStatus, attachmentType } from '../components/Enumeration';

export function getManfacturerCombo(screenName, operation, primaryKeyName,  masterData, userInfo, ncontrolCode) {
 return function(dispatch){ 
    let urlArray = [];
    if (operation === "create") {
        // const EDQMManufacturer = rsapi().post("/edqmmanufacturer/getEDQMManufacturer", { "userinfo": userInfo });
        const CountryService = rsapi().post("country/getCountry", { "userinfo" : userInfo });
        urlArray = [CountryService];
    }
    else {

        //const EDQMManufacturer = rsapi().post("/edqmmanufacturer/getEDQMManufacturer", { "userinfo": userInfo });
        const ManufacturerByID = rsapi().post("/manufacturer/getManufacturerById", { [primaryKeyName] :masterData.selectedManufacturer[primaryKeyName], "userinfo": userInfo });
        urlArray = [//EDQMManufacturer,
                     ManufacturerByID];
    }

    dispatch(initRequest(true));
    Axios.all(urlArray)
        .then(response => {
        let countryCode = [];
        let countryList = {};
        if (operation === "create") {
            const countryMap = constructOptionList(response[0].data || [], "ncountrycode",
            "scountryname", undefined, undefined, true);
             countryList = countryMap.get("OptionList");
        }

            //let edqmManufacturer = [];
            let selectedRecord = {};

            // const edqmManufacturerMap = constructOptionList(response[0].data || [], "nofficialmanufcode",
            // "sofficialmanufname", undefined, undefined, false);

            // const edqmManufacturerList = edqmManufacturerMap.get("OptionList");

            if (operation === "update") {

                selectedRecord = response[0].data;
                // selectedRecord["nofficialmanufcode"] = {
                //     label: response[1].data["sofficialmanufname"],
                //     value: response[1].data["nofficialmanufcode"]
                // };
                // edqmManufacturer.push({
                //     label: response[1].data["sofficialmanufname"],
                //     value: response[1].data["nofficialmanufcode"]
                // });
            }
            dispatch({type: DEFAULT_RETURN, 
                payload:{  
                //edqmManufacturerList,
                Country: countryList,
                countryCode: countryCode,  isOpen: true,  
                selectedRecord: operation === "update" ? selectedRecord : {"ntransactionstatus": 1}, 
                //edqmManufacturer: edqmManufacturer ,
                operation: operation,
                     screenName: screenName,
                    openModal : true, ncontrolCode: ncontrolCode, loading:false
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

export function selectCheckBoxManufacturer(Manufacturer, userInfo, masterData){
    return function(dispatch){ 
    dispatch(initRequest(true));
    rsapi().post("/manufacturer/getManufacturerWithSiteAndContactDetails", { 'userinfo': userInfo, "nmanufcode": Manufacturer.nmanufcode })
        
    .then(response=>{      
        masterData = {...masterData, ...response.data};        
        sortData(masterData);
        // console.log(" Select Checked : ", masterData);
        dispatch({type: DEFAULT_RETURN, payload:{masterData, loading:false,selectedId:null}});   
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

export function getContactInfo(SiteDetails, masterData){
    return function(dispatch){ 
    let Map={};
 
    Map["nmanufcode"]=parseInt(SiteDetails.siteAddress.nmanufcode);
    Map["nmanufsitecode"]=parseInt(SiteDetails.siteAddress.nmanufsitecode);
    Map["userinfo"]=SiteDetails.userInfo
    dispatch(initRequest(true));
    rsapi().post("/manufacturer/getContactManufacturerBySite",Map)
    .then(response =>{
        // dispatch({type: DEFAULT_RETURN, payload:{
        //     ManufacturerContactInfo :response.data,
        //     SiteCode: SiteDetails.nmanufsitecode, loading:false
        // }});   
         
        masterData = {...SiteDetails.masterData, ManufacturerContactInfo: response.data,
            selectedSite: SiteDetails.siteAddress,
             SiteCode:SiteDetails.siteAddress.nmanufsitecode};     
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
                } else {
                    toast.warn(error.response.data);
                }
    })
}
}

export function getSiteManufacturerLoadEdit(screenName, operation, manufCode, manufSiteCode, ncontrolCode, userInfo){
    return function(dispatch){ 
    let urlArray = [];
    let selectedRecord = {};

    if (operation === "create") {
        const Country = rsapi().post("/country/getCountry", { "userinfo": userInfo });
        urlArray = [Country];
    }
    else {

        const Country = rsapi().post("/country/getCountry", { "userinfo": userInfo });
        const ManufacturerSiteByID = rsapi().post("/manufacturer/getSiteManufacturerById", { "nmanufcode": manufCode, "nmanufsitecode": manufSiteCode ,"userinfo": userInfo});
        urlArray = [Country, ManufacturerSiteByID];
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
                // countryCode.push({
                //     label: response[1].data["scountryname"],
                //     value: response[1].data["ncountrycode"]
                // });
            }

            dispatch({type: DEFAULT_RETURN, payload:{
                Country: countryList, openChildModal:true, operation, 
                selectedRecord: operation === "update" ? selectedRecord : {"ntransactionstatus": transactionStatus.ACTIVE,"ndefaultstatus":transactionStatus.NO}, countryCode: countryCode, ncontrolCode,
                screenName: "IDS_MANUFACTURESITE", loading:false
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
export function getContactManufacturerLoadEdit(fetchRecord){
    return function(dispatch){ 
    let urlArray = [];
    let selectedId = null;
    const ManufacturerContactByID = rsapi().post("/manufacturer/getContactManufacturerById", { "nmanufcode": fetchRecord.editRow.nmanufcode, "nmanufsitecode": fetchRecord.editRow.nmanufsitecode, "nmanufcontactcode": fetchRecord.editRow.nmanufcontactcode,"userinfo": fetchRecord.userInfo });
    urlArray = [ManufacturerContactByID];
    selectedId = fetchRecord.editRow.nmanufcontactcode;

    dispatch(initRequest(true));
    Axios.all(urlArray)
        .then(response => {            
            dispatch({type: DEFAULT_RETURN, payload:{
                openChildModal:true, operation:fetchRecord.operation, 
                selectedRecord: fetchRecord.operation === "update" ? response[0].data : undefined,
          defaultSite: fetchRecord.editRow.nmanufsitecode, ncontrolCode:fetchRecord.ncontrolCode ,
          screenName: "IDS_SITECONTACT", loading:false, selectedId
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


// export function filterColumnDataManufacturer(filterValue, masterData, userInfo) {
//     return function (dispatch) {  
      
//         let manuFCode = 0;   
//         let searchedData = undefined;
//         if (filterValue === ""){
//             manuFCode = masterData["Manufacturer"][0].nmanufcode;
//         }
//         else{
//             // if (filterValue.length > 2)
//             // {
//                 searchedData = searchData(filterValue, masterData["Manufacturer"]);
            
//                 if (searchedData.length > 0){
//                     manuFCode = searchedData[0].nmanufcode; 
//                 }
//             // }
//         }
     
//         if (manuFCode !== 0){
//             dispatch(initRequest(true));
//             return rsapi().post("manufacturer/getManufacturerWithSiteAndContactDetails", {userInfo, nmanufcode:manuFCode})
//             .then(response=>{         
//                         masterData["ManufacturerSiteAddress"] = response.data["ManufacturerSiteAddress"];
//                         masterData["ManufacturerContactInfo"] = response.data["ManufacturerContactInfo"];
//                         masterData["selectedManufacturer"] = response.data["selectedManufacturer"];
//                         masterData["SiteCode"] = response.data["SiteCode"];
//                         masterData["searchedData"] = searchedData;

//                         dispatch({type: DEFAULT_RETURN, payload:{masterData, loading:false}});       
//             })
//             .catch(error=>{
//                 dispatch({type: DEFAULT_RETURN, payload: {loading:false}})
//                 if (error.response.status === 500){
//                     toast.error(error.message);
//                 } 
//                 else{               
//                     toast.warn(error.response.data);
//                 }  
//             }) 
//         } 
//         else{        
//             masterData["ManufacturerSiteAddress"] = [];
//             masterData["ManufacturerContactInfo"] = undefined;
//             masterData["selectedManufacturer"] = [];
//             masterData["searchedData"] = [];
//             masterData["SiteCode"]  = 0;
//             dispatch({type: DEFAULT_RETURN, payload:{masterData, loading:false}}); 
//         }           
//     }   
// } 

export const addManufacturerFile = (inputParam) => {
    return (dispatch) => {
        dispatch(initRequest(true));
        let urlArray = [rsapi().post("/linkmaster/getLinkMaster", {
            userinfo: inputParam.userInfo
        })];
        if (inputParam.operation === "update") {
            urlArray.push(rsapi().post("/manufacturer/editManufacturerFile", {
                userinfo: inputParam.userInfo,
                manufacturerfile: inputParam.selectedRecord
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
                            sdescription:editObject.sdescription    //ALPD-899 Fix
                        }
                    }

                    selectedRecord = {
                        ...link,
                        nmanufacturerfilecode: editObject.nmanufacturerfilecode,
                        nattachmenttypecode: editObject.nattachmenttypecode,
                        // sdescription:editObject.sdescription,    //ALPD-899 Fix
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