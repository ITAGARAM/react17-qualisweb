import rsapi from '../rsapi';
import Axios from 'axios';
import {
    toast
} from 'react-toastify';
import {
    getComboLabelValue,
    constructOptionList
} from '../components/CommonScript'
import {
    DEFAULT_RETURN,
    UN_AUTHORIZED_ACCESS
} from './LoginTypes';
import { initRequest } from './LoginAction';
import { sortData} from '../components/CommonScript';
import { transactionStatus, attachmentType } from '../components/Enumeration';
import { intl } from '../components/App';


export function getProductDetail (product, userInfo, masterData) {
    return function (dispatch) {   
    dispatch(initRequest(true));
    return rsapi().post("product/getProduct", {nproductcode:product.nproductcode, 
                                                          userinfo:userInfo})
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

export function getProductComboService (productParam) {            
    return function (dispatch) {   
    const productCategoryService = rsapi().post("/productcategory/getProductCategory", 
                                    {userinfo:productParam.userInfo});
    let urlArray = [];
    let selectedId = null;
    if (productParam.operation === "create"){
        urlArray = [productCategoryService];
    }
    else{           
        const url = productParam.inputParam.classUrl+ "/getActiveProductById";   // productParam.inputParam.methodUrl "product/getActiveproductById"      
        //const productById =  rsapi().post(url, { [productParam.primaryKeyField] :productParam.primaryKeyValue, "userinfo": productParam.userInfo} );
        const productById =  rsapi().post(url, { [productParam.primaryKeyName] :productParam.masterData.SelectedProduct[productParam.primaryKeyName], "userinfo": productParam.userInfo} );
        
        urlArray = [productCategoryService, productById];
        selectedId = productParam.primaryKeyValue;
    }
    dispatch(initRequest(true));
    Axios.all(urlArray)
        .then(response=>{                  
            
            let selectedRecord =  {};

            const productCatMap = constructOptionList(response[0].data || [], "nproductcatcode",
                                "sproductcatname", undefined, undefined, true);
            const productCategoryList = productCatMap.get("OptionList");
           
           
            
            if (productParam.operation === "update"){
                selectedRecord = response[1].data;
                selectedRecord["nproductcatcode"] = getComboLabelValue(selectedRecord, response[0].data, 
                    "nproductcatcode", "sproductcatname");                   
            }
           else
           {
 			const  productCatdefault  = productCatMap.get("DefaultValue");
            selectedRecord["nproductcatcode"] = productCatdefault; 
           }
            dispatch({type: DEFAULT_RETURN, payload:{productCategoryList,//:response[0].data || [],                               
                        operation:productParam.operation, screenName:productParam.screenName, selectedRecord, 
                        openModal : true,
                        ncontrolCode:productParam.ncontrolcode,
                        loading:false,selectedId
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
}

export const addProductFile = (inputParam) => {
    return (dispatch) => {
        dispatch(initRequest(true));
        let urlArray = [rsapi().post("/linkmaster/getLinkMaster", {
            userinfo: inputParam.userInfo
        })];
        if (inputParam.operation === "update") {
            urlArray.push(rsapi().post("/product/editProductFile", {
                userinfo: inputParam.userInfo,
                genericlabel:inputParam.genericLabel,
                productfile: inputParam.selectedRecord
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
                        }
                    }

                    selectedRecord = {
                        ...link,
                        nproductfilecode: editObject.nproductfilecode,
                        nattachmenttypecode: editObject.nattachmenttypecode,
                        sdescription:editObject.sdescription,
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
