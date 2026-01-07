import { initRequest } from "./LoginAction";
import rsapi from "../rsapi";
import { sortData,getComboLabelValue } from "../components/CommonScript";
import { DEFAULT_RETURN, UN_AUTHORIZED_ACCESS } from "./LoginTypes";
import { toast } from 'react-toastify';
import Axios from "axios";
import { constructOptionList } from "../components/CommonScript";
import { intl} from '../components/App';
import { attachmentType,transactionStatus } from "../components/Enumeration";

export function getInstitutionDetail (institution, userInfo, masterData) {
    return function (dispatch) {   
    dispatch(initRequest(true));
    return rsapi().post("institution/getSelectedInstitutionDetail", {ninstitutioncode:institution.ninstitutioncode, userinfo:userInfo})
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
export function getInstitutionCombo(screenName, operation, primaryKeyName, masterData, userInfo, ncontrolCode) {
    return function (dispatch) {
        if (masterData.SelectedInstitutionCategory!==null) {
        let urlArray = [];
        const InstitutionCategory = rsapi().post("/institution/getInstitutionCategory", {"userinfo": userInfo});
        if (operation === "create") {
            urlArray = [InstitutionCategory];

        } else {
            const Institution = rsapi().post("/institution/getActiveInstitutionById", {
                [primaryKeyName]: masterData.selectedInstitution[primaryKeyName],
                "userinfo": userInfo
            });
            urlArray = [InstitutionCategory,Institution];
        }
        dispatch(initRequest(true));
        Axios.all(urlArray)
            .then(response => {
                let selectedRecord ={};
                const institutioncategoryMap = constructOptionList(response[0].data || [], "ninstitutioncatcode",
                    "sinstitutioncatname", undefined, undefined, false);        

                const InstitutionCategory = institutioncategoryMap.get("OptionList");              

                 selectedRecord = {"ninstitutioncatcode": {
                            "value": masterData.SelectedInstitutionCategory.ninstitutioncatcode,
                             "label": masterData.SelectedInstitutionCategory.sinstitutioncatname
                         }};                
                let institutionCategory = [];
                if (operation === "update") {
                    selectedRecord = response[1].data;
                    selectedRecord["ninstitutioncatcode"] ={label:selectedRecord.sinstitutioncatname,value:selectedRecord.ninstitutioncatcode}
                    institutionCategory.push({
                        "value": response[0].data["ninstitutioncatcode"],
                        "label": response[0].data["sinstitutioncatname"]
                    });
                    //selectedRecord["ninstitutioncatcode"] = institutionCategory[0];
                }

                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        InstitutionCategory,                       
                        isOpen: true,
                        selectedRecord: selectedRecord,
                        operation: operation,
                        screenName: screenName,
                        openModal: true,
                        ncontrolCode: ncontrolCode,
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
                })
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
            })
        }
        else{
            toast.warn(intl.formatMessage({ id: "IDS_CONFIGINSTITUTIONCATAGORY" }));
        }
    }
}

export const getInstitutionSiteData = (methodParam) => {
    return function (dispatch) {
        dispatch(initRequest(true));
        let url = ''
        let urlArray = [];
        let selectedRecord = {};
        const institutionSiteService = rsapi().post("institution/getInstitutionSiteCombo",{userinfo:methodParam.userInfo,ninstitutioncode:methodParam.instItem.ninstitutioncode});

        // url = "/institution/getInstitutionSiteCombo";

        // return rsapi().post(url, {"userinfo": methodParam.userInfo})
        if(methodParam.operation === "create"){
            urlArray=[institutionSiteService];
        }else{
            const url = methodParam.inputParam.classUrl+ "/getActiveInstitutionSiteById";       
            const institutionSiteById =  rsapi().post(url, {"ninstitutioncode":methodParam.instItem.ninstitutioncode, [methodParam.primaryKeyField] :methodParam.primaryKeyValue, "userinfo": methodParam.userInfo} );
            const cityService =  rsapi().post("institution/getCity", {"ndistrictcode":methodParam.editRow.ndistrictcode,  "userinfo": methodParam.userInfo} );
            const districtService =  rsapi().post("institution/getDistrict", {"nregioncode":methodParam.editRow.nregioncode,  "userinfo": methodParam.userInfo} );
            urlArray = [institutionSiteService, institutionSiteById,cityService,districtService];
            //selectedId = methodParam.primaryKeyValue;
        }
        Axios.all(urlArray)
            .then(response => {
              let cityMap=[];
              let districtMap=[];
              let cityList=[];
              let districtList=[];
                const siteMap = constructOptionList(response[0].data.Site || [], "nsitecode",
                    "ssitename", undefined, undefined, false);                

                const regionMap =    constructOptionList(response[0].data.Region || [], "nregioncode",
                "sregionname", undefined, undefined, false);

                const countryMap = constructOptionList(response[0].data.Country || [], "ncountrycode",
                    "scountryname", undefined, undefined, false);
                    if(methodParam.operation === "update"){
               cityMap = constructOptionList(response[2].data.cityList || [], "ncitycode",
                    "scityname", undefined, undefined, false);
              districtMap = constructOptionList(response[3].data.districtList || [], "ndistrictcode",
                    "sdistrictname", undefined, undefined, false);
                    cityList = cityMap.get("OptionList");
                    districtList = districtMap.get("OptionList");
                    }
                const Site = siteMap.get("OptionList");
                const Region = regionMap.get("OptionList");               
                const Country = countryMap.get("OptionList");
                
                
                
                if(methodParam.operation === "update"){
                    selectedRecord =response[1].data;
                    selectedRecord["ncountrycode"] = getComboLabelValue(selectedRecord, response[0].data.Country, 
                        "ncountrycode", "scountryname");  
                        selectedRecord["ndistrictcode"] = getComboLabelValue(selectedRecord, response[3].data.districtList, 
                            "ndistrictcode", "sdistrictname");
                         selectedRecord["ncitycode"] = getComboLabelValue(selectedRecord, response[2].data.cityList, 
                                "ncitycode", "scityname");
                    selectedRecord["nsitecode"] = {"label":selectedRecord.ssitename,"value":selectedRecord.nregionalsitecode}
                    selectedRecord["nregioncode"] = getComboLabelValue(selectedRecord, response[0].data.Region, 
                        "nregioncode", "sregionname");    
                }else{
                    selectedRecord =methodParam.selectedRecord;
                    selectedRecord["nsitecode"] = siteMap.get("DefaultValue"); 
                    selectedRecord["ssitecode"] = siteMap.get("DefaultValue") ? siteMap.get("DefaultValue")['item']['ssitecode'] : siteMap.get("DefaultValue")
                }
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        cityList,
                        districtList,
                        Site,
                        Region,
                        Country,
                        isOpen: true,
                        selectedRecord,
                        operation: methodParam.operation,
                        screenName: methodParam.screenName,
                        //openModal: true,
                        ncontrolCode: methodParam.ncontrolCode,
                        instItem: methodParam.instItem,
                        loading: false,openChildModal:true,
                        selectedId:methodParam.primaryKeyValue,
                       // displayName: methodParam.screenName
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
                if (error.response.status === 417) {
                    toast.info(error.response.data)
                } else if (error.response?.status === 429) {
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
        } else  {
                    toast.error(error.message)
                }
            });
    }
}

export const addInstitutionFile = (inputParam) => {
    return (dispatch) => {
        dispatch(initRequest(true));
        let urlArray = [rsapi().post("/linkmaster/getLinkMaster", {
            userinfo: inputParam.userInfo
        })];
        if (inputParam.operation === "update") {
            urlArray.push(rsapi().post("/institution/getInstitutionFileById", {
                userinfo: inputParam.userInfo,
                institutionfile: inputParam.selectedRecord
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
                            slinkfilename:editObject.sfilename,
                            slinkdescription:editObject.sfiledesc,
                            nlinkdefaultstatus:editObject.ndefaultstatus,
                            sfilesize:'',
                            nfilesize:0,
                            ndefaultstatus:4,
                            sfilename:'',
                        }

                    } else {
                        nlinkcode = defaultLink.length > 0 ? defaultLink[0] : "" //{"label": defaultLink[0].slinkname, "value": defaultLink[0].nlinkcode}:""
                        link = {
                            slinkfilename:'',
                            slinkdescription:'',
                            nlinkdefaultstatus:4,
                            sfilesize:editObject.sfilesize,
                            nfilesize:editObject.nfilesize,
                            ndefaultstatus:editObject.ndefaultstatus,
                            sfilename:editObject.sfilename,
                            sfiledesc:editObject.sfiledesc
                        }
                    }



                    selectedRecord = {
                        ...link,
                        ninstitutionfilecode:editObject.ninstitutionfilecode,
                        nattachmenttypecode:editObject.nattachmenttypecode,
                       // sfiledesc:editObject.sfiledesc,
                        //...editObject,
                        nlinkcode,
                       // disabled: true
                    };
                } else {
                    selectedRecord = {
                        nattachmenttypecode:response[0].data.AttachmentType.length>0?
                        response[0].data.AttachmentType[0].nattachmenttypecode:attachmentType.FTP,
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
                       // openModal: true
                        openChildModal:true,
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
export const changeInstitutionCategoryFilter = (inputParam,FilterInstitutionCategory,defaultInstitutionCategory) => {
    return (dispatch) => {
        dispatch(initRequest(true));
        rsapi().post("/institution/get" + inputParam.methodUrl, inputParam.inputData)
            .then(response => {
                const masterData = response.data
                sortData(masterData);
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false,
                        masterData: {
                            ...masterData,
                            FilterInstitutionCategory,
                            defaultInstitutionCategory:defaultInstitutionCategory.ninstitutioncatcode.item?defaultInstitutionCategory.ninstitutioncatcode.item:defaultInstitutionCategory,
                            SelectedInstitutionCategory:defaultInstitutionCategory.ninstitutioncatcode.item?defaultInstitutionCategory.ninstitutioncatcode.item:defaultInstitutionCategory
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
export function getDistComboServices(methodParam) {
    return function (dispatch) {
        let URL = []; 
            URL=rsapi().post("/institution/getDistrict", { "userinfo": methodParam.inputData.userinfo, "nregioncode":  methodParam.inputData.primarykey  })
         dispatch(initRequest(true));
        Axios.all([URL])
            .then(response => {
                let districtList; 
                const districtMap = constructOptionList(response[0].data['districtList'] || [], "ndistrictcode",
                "sdistrictname", undefined, undefined, false);               
                  districtList = districtMap.get("OptionList"); 
                  const cityList =undefined;
                dispatch({ type: DEFAULT_RETURN, payload:
                     { districtList, loading: false, data: undefined, dataState: undefined ,cityList} })
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

export function getCitComboServices(methodParam) {
    return function (dispatch) {
        let URL=[];
            URL = rsapi().post("/institution/getCity", { "userinfo": methodParam.inputData.userinfo, "ndistrictcode":  methodParam.inputData.primarykey  })
         dispatch(initRequest(true));
        Axios.all([URL])
            .then(response => {
                 const cityMap = constructOptionList(response[0].data['cityList'] || [], "ncitycode",
                 "scityname", undefined, undefined, false);               
                 const  cityList = cityMap.get("OptionList"); 
                dispatch({ type: DEFAULT_RETURN, payload:
                     { cityList,loading: false, data: undefined, dataState: undefined } })
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
