import rsapi from '../rsapi';
import { DEFAULT_RETURN } from './LoginTypes';
import { toast } from 'react-toastify';
import Axios from 'axios';
import { initRequest } from './LoginAction';
import { constructOptionList, sortData, sortByField } from '../components/CommonScript';
import { intl } from '../components/App';
import { transactionStatus, attachmentType } from '../components/Enumeration';
import { useRef, useState } from 'react';

export function getProductComboServicecallService(productparam) {
    return function (dispatch) {
        if (productparam.nfilterProductType && Object.values(productparam.nfilterProductType).length > 0) {
            if (productparam.operation === "create" || productparam.operation === "update") {
                const productTypeService = rsapi().post("invoiceproductmaster/getProductType1", { userinfo: productparam.userInfo, ntypecode:productparam.nfilterProductType.item.ntypecode });
                let urlArray = [];
                let selectedId = null;
                let nProductPk = { "label": 'NA' };
                let nTreeTemplatePk = { "label": 'NA' };
                let nSpecificationPk = { "label": 'NA' };
                let nProductTypePk = { "label": 'NA' };
                let nSpecificationPk1 = { "label": 'NA' };
               if (productparam.operation === "create") {
                    urlArray = [productTypeService];
                }
                else {
                    const productById = rsapi().post("invoiceproductmaster/getActiveProductMasterById", { [productparam.primaryKeyField]: productparam.masterData.SelectedProductMaster[productparam.primaryKeyField], "userinfo": productparam.userInfo });
                    urlArray = [productById, productTypeService];
                    selectedId = productparam.primaryKeyValue;
                }
                dispatch(initRequest(true));
                Axios.all(urlArray)
                    .then(response => {
                        let productCategory = [];
                        let selectedRecord = {};
                        if (productparam.operation === "update") {
                            //if (productparam.userInfo.nuserrole == -1) {
                                selectedRecord['nuserrole'] =productparam.userInfo.nuserrole
                               // selectedRecord = response[0].data;
                               // const productTypeList = constructOptionList(response[1].data || [], "ntypecode",
                                  //  "stypename", undefined, undefined, undefined);

                               // productCategory = productTypeList.get("OptionList");
                               // selectedRecord['ntypecode'] = { "value": response[0].data["ntypecode"], "label": response[0].data["stypename"] }
                           // }
                           // else {

                                selectedRecord = response[0].data;
                                const productTypeList = constructOptionList(response[1].data || [], "ntypecode",
                                    "stypename", undefined, undefined, undefined);
                                // selectedRecord["stext"] = productparam.Addtext.Stext;
                                // selectedRecord["stext2"] = productparam.Addtext.Stext2;
                                // selectedRecord["nuserrole"] = productparam.userInfo.nuserrole;
                                selectedRecord["userrolecode"] = productparam.Addtext.Userrolecode;
                                productCategory = productTypeList.get("OptionList");
                                selectedRecord['ntypecode'] = { "value": response[0].data["ntypecode"], "label": response[0].data["stypename"] }

                           // }
                        }
                        else {
                            if (productparam.userInfo.nuserrole == -1) {
                                selectedRecord["ntaxavailable"] = transactionStatus.YES;
                                response[0].data.map((productType, index) => {
                                    if (productType.stypename === "All") {
                                        response[0].data.splice(index, 1);
                                        selectedRecord['nuserrole'] =productparam.userInfo.nuserrole
                                    }
                                });
                                const productTypeList = constructOptionList(response[0].data || [], "ntypecode",
                                    "stypename", undefined, undefined, undefined);
                                productCategory = productTypeList.get("OptionList");
                                selectedRecord["ntypecode"] = productCategory[0];
                            }

                            else {
                                selectedRecord["ntaxavailable"] = transactionStatus.YES;
                                response[0].data.map((productType, index) => {
                                    if (productType.stypename === "All") {
                                        response[0].data.splice(index, 1);
                                    }
                                });
                                const productTypeList = constructOptionList(response[0].data || [], "ntypecode",
                                    "stypename", undefined, undefined, undefined);
                                selectedRecord["stext"] = productparam.Addtext.Stext;
                                selectedRecord["stext2"] = productparam.Addtext.Stext2;
                                selectedRecord["nuserrole"] = productparam.userInfo.nuserrole;
                                selectedRecord["userrolecode"] = productparam.Addtext.Userrolecode;
                                productCategory = productTypeList.get("OptionList");
                                selectedRecord["ntypecode"] = productCategory[0];
                            }
                        }

                        dispatch({
                            type: DEFAULT_RETURN, payload: {
                                productCategoryList: productCategory,
                                selectedRecord, openModal: true,
                                operation: productparam.operation, screenName: productparam.screenName,
                                ncontrolCode: productparam.ncontrolCode, loading: false, selectedId,
                                nProductTypePk,
                            //    masterData: {
                            //      nProductPk,
                            //      nTreeTemplatePk,
                            //      nSpecificationPk1,
                            //      nSpecificationPk
                            //  }
                            }
                        });
                    })
                    .catch(error => {
                        dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                        if (error.response.status === 500) {
                            toast.error(error.message);
                        }
                        else {

                            toast.warn(error.response.data);
                        }
                    })
            }
        } else {
            toast.warn(intl.formatMessage({
                id: "IDS_PRODUCTMASTERNOTAVAILABLE"
            }))
        }
    }
}

export function getProductMasterDetails(productmaster, userInfo, masterData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("invoiceproductmaster/getSelectedProductMasterDetail", { nproductcode: productmaster.nproductcode, userinfo: userInfo })
            .then(response => {
                masterData = { ...masterData, ...response.data };
                //sortByField(masterData, 'ascending', 'sproductname');
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData, operation: null, modalName: undefined,
                        loading: false
                    }
                });
            })
            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                if (error.response.status === 500) {
                    toast.error(error.message);
                }
                else {
                    toast.warn(error.response.data);
                }

            })
    }
}

export const changeProductTypeFilter = (inputParam, filterProductType, nfilterProductType) => {
    return (dispatch) => {

        dispatch(initRequest(true));
      
        rsapi().post("/invoiceproductmaster/get" + inputParam.methodUrl, inputParam.inputData)
            .then(response => {
                let masterData = response.data;
                let nProductPk = "";
                let productsDataLst = "";
                let TreeTemplateLst = [];
                let nTreeTemplatePk = "";
                let TreeVersionTemplateLst = "";
                let nTreeVersTemplatePk = "";
                let specificationLst = "";
                let nSpecificationPk = "";
                let nProductTypePk = "";
                let nSpecificationPk1 = "";
                let nsampletype="";
                let nfilterProductType1="";
                let nallottedspeccode = 0; 
                let selectedRecord = {};
                const ProductTypeData1 = Array.isArray(response.data.ProductTypeData) ? response.data.ProductTypeData : [];
                
              
                let productType = constructOptionList(ProductTypeData1, "nproductcatcode", "sproductcatname", undefined, undefined, true);
                let productTypeData = productType.get("OptionList");
                let product = constructOptionList(response.data.ProductList || [], "nproductcode", "sproductname", undefined, undefined, true);
                
                  if (!inputParam.inputData.nproductcatcode) {
                  nProductTypePk = productTypeData.length > 0
                            ? { value: productTypeData[0].item.nproductcatcode, label: productTypeData[0].item.sproductcatname }
                            : { value: null, label: null };
                  }
                            if (!inputParam.inputData.nallottedspeccode) 
                    {
                      
                    if (inputParam.methodUrl !== "ProductByType"){
                        
                   
                        if (inputParam.methodUrl == "SampleTypeByProduct" && inputParam.param === undefined) {
                            nProductTypePk = inputParam.inputData.label !== undefined
                                ? {
                                    "value": inputParam.inputData.label.value,
                                    "label": inputParam.inputData.label.label
                                }
                                : {
                                    "value": response.data.ProductTypeData[0].nproductcatcode,
                                    "label": response.data.ProductTypeData[0].sproductcatname
                                };
        
                            }

                        const productList = Array.isArray(response.data.ProductList) ? response.data.ProductList : [];
                        
                        let productItems = constructOptionList(productList, "nproductcode", "sproductname", undefined, undefined, true);
                       productsDataLst = productItems.get("OptionList");
                        nProductPk = productList.length > 0
                            ? { value: productList[0].nproductcode, label: productList[0].sproductname }
                            : { value: null, label: null };
                           
                           
                       if  (inputParam.methodUrl == "TreeTemplateByProduct" ){
                       nProductPk = inputParam.inputData.label !== undefined
                                ? {
                                    "value": inputParam.inputData.label.value,
                                    "label": inputParam.inputData.label.label
                                }
                                : {
                                    "value": response.data.productList[0].nproductcode,
                                    "label": response.data.productList[0].sproductname
                                };
        
                            }
                            if (inputParam.inputData.nproductcode !== undefined) {
                                nProductTypePk = { "value": response.data.selectedProductType[0].nproductcatcode, "label": response.data.selectedProductType[0].sproductcatname }
                            }
                           
                         
                            let sleveldescription = response.data.sleveldescription;
                            if (sleveldescription !== undefined && sleveldescription !== null) {
                                let lines = sleveldescription.split('\n');
                                
                            
                            //let lines = sleveldescription.split('\n');
                            
                            if (response.data.TreeListByProduct.length > 0) {
                            let treeItems = constructOptionList(response.data.TreeListByProduct, "ntreeversiontempcode", "sleveldescription", undefined, undefined, true);
           
                            selectedRecord["ntemplate"] = response.data.TreeListByProduct[0].ntemplatemanipulationcode;
                            
                            let segments = sleveldescription.split('\n');
                            let accumulatedCount = 0;
                            
                            segments.forEach((segment, index) => {
                              let segmentParts = segment.split(',');
                              let count = segmentParts.length;
                              let ncode = accumulatedCount + count - 1;
                              accumulatedCount += count;
                            
                           
                              if (index === 0) {
                                nTreeTemplatePk = {
                                  "value": response.data.TreeListByProduct[0].ntemplatemanipulationcode,
                                  "label": lines[0]
                                };
                              }

                               let trimmedSegment = segment.trim();
  
  
                            if (trimmedSegment === "") {
                                TreeTemplateLst.push({
                                "label": segment  
                                })
                            }
                            
                            else{
                              TreeTemplateLst.push({
                                "value": response.data.TreeListByProduct[ncode].ntemplatemanipulationcode,
                                "label": segment 
                              });
                            }
                            });
                        
                            }
                        }
                              
                            if(inputParam.methodUrl=="SpecificationByTreetemplate")   {
                                nTreeTemplatePk = inputParam.inputData.label !== undefined
                                         ? {
                                             "value": inputParam.inputData.label.value,
                                             "label": inputParam.inputData.label.label
                                         }
                                         : {
                                             "value": inputParam.inputData.label.value,
                                             "label": inputParam.inputData.label.label
                                         };
                 
                                     }
                                     if (response.data && Array.isArray(response.data.SpecificationByRootlst)) {
                                        if (response.data.SpecificationByRootlst.length > 0 && response.data.TreeListByProduct.length > 0 ) {
                                let specificationItems = constructOptionList(response.data.SpecificationByRootlst || [], "nallottedspeccode", "sspecname", undefined, undefined, true);
                                specificationLst = specificationItems.get("OptionList");
                                nSpecificationPk = { "value": response.data.SpecificationByRootlst[0].nallottedspeccode, "label": response.data.SpecificationByRootlst[0].sspecname }
                                     }
                                    }
                                if (inputParam.inputData.nproductcatcode !== undefined) {
                                nProductPk = { "value": response.data.selectedProduct[0].nproductcode, "label": response.data.selectedProduct[0].sproductname }
                                if(inputParam.inputData.ntreeTemplatecode !== undefined){
                                nfilterProductType1 = { "value": response.data.selectedProductType[0].nproductcatcode, "label": response.data.selectedProductType[0].sproductcatname }
                                nfilterProductType = { "value": response.data.SelectedProductType[0].ntypecode, "label": response.data.SelectedProductType[0].stypename }
                                }
                            }
                        
                    }
                   
            
                }
                
                
                if (
                    inputParam &&
                    inputParam.methodUrl === "ProductByType" &&
                    inputParam.inputData &&
                    inputParam.inputData.masterData &&
                    inputParam.inputData.masterData.productTypeData !== undefined
                  )  {
                
                    const productTypeData = inputParam.inputData.masterData.productTypeData;
                    const nProductTypePk = inputParam.inputData.masterData.nProductTypePk;
                    const productsDataLst = inputParam.inputData.masterData.productsDataLst;
                    const nProductPk = inputParam.inputData.masterData.nProductPk;
                    const TreeTemplateLst = inputParam.inputData.masterData.TreeTemplateLst;
                    const nTreeTemplatePk = inputParam.inputData.masterData.nTreeTemplatePk;
                    const specificationLst = inputParam.inputData.masterData.specificationLst;
                    const nSpecificationPk = inputParam.inputData.masterData.nSpecificationPk;
                dispatch({
                   
                    type: DEFAULT_RETURN,
                    payload: {
                       
                        loading: false,
                        masterData: inputParam.inputData.masterData,
                        nfilterProductType,
                        product,
                        
                        masterData: {
                            ...masterData,
                            selectedRecord,
                        
                            filterProductType,
                            nfilterProductType,
                            nfilterProductType1,
                            productTypeData,
                            nProductTypePk,
                            productsDataLst,
                            nProductPk,
                            product,
                            nsampletype,
                            TreeTemplateLst,
                            nTreeTemplatePk,
                            TreeVersionTemplateLst,
                            nTreeVersTemplatePk,
                            specificationLst,
                            nSpecificationPk,
                            nSpecificationPk1
                        }
                    }
                         });
                        
                    }
                   else{

                   
                    dispatch({
                        type: DEFAULT_RETURN,
                    payload: {
                        loading: false,
                        masterData,
                        nfilterProductType,
                        product,
                        
                        masterData: {
                            ...masterData,
                            selectedRecord,
                        
                            filterProductType,
                            nfilterProductType,
                            nfilterProductType1,
                            productTypeData,
                            nProductTypePk,
                            productsDataLst,
                            nProductPk,
                            product,
                            nsampletype,
                            TreeTemplateLst,
                            nTreeTemplatePk,
                            TreeVersionTemplateLst,
                            nTreeVersTemplatePk,
                            specificationLst,
                            nSpecificationPk,
                            nSpecificationPk1
                        }
                    }
                });
            }
            })
        
            .catch(error => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        
                        
                        loading: false
                    }
                });
                toast.error(error.message);
            });
    }

}

export function getTaxProductDetails(inputParam) {
    return function (dispatch) {
        let Map = {};
        Map["ntaxproductcode"] = inputParam.taxProduct.ntaxproductcode;
        Map["nproductcode"] = inputParam.taxProduct.nproductcode;
        Map["userinfo"] = inputParam.userInfo;
        dispatch(initRequest(true));
        rsapi().post("/invoiceproductmaster/getTaxProductById", Map)
            .then(response => {
                let masterData = {
                    ...inputParam.masterData,
                    selectedTaxProduct: inputParam.taxProduct,
                };
                //sortData(masterData);
                dispatch({ type: DEFAULT_RETURN, payload: { masterData, loading: false, dataState: undefined } });

            })
            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
            })
    }
}

export function getTaxProductForAddEdit(screenName, operation, nproductcode, ntaxproductcode, ncontrolCode, userInfo) {
    return function (dispatch) {
        let urlArray = [];
        let selectedRecord = {};
        const getTaxtype = rsapi().post("/invoiceproductmaster/getInvoiceTaxtype", { "userinfo": userInfo, "nproductcode": nproductcode, "ntaxproductcode": ntaxproductcode });
        if (operation === "create") {
            urlArray = [getTaxtype];
        }
        else {
            const Taxtype = rsapi().post("/invoiceproductmaster/getTaxProductById", { "nproductcode": nproductcode, "ntaxproductcode": ntaxproductcode, "userinfo": userInfo });
            urlArray = [Taxtype, getTaxtype];
        }

        dispatch(initRequest(true));
        Axios.all(urlArray)
            .then(response => {
                let ProductList = [];
                let TaxList = [];
                let TaxListversion = [];
                let Taxcaltype = [];
                let selectedRecord = {};
                if (operation === "create") {
                    const TaxMap = constructOptionList(response[0].data || [], "ntaxcode",
                        "staxname", undefined, undefined, true);
                    TaxList = TaxMap.get("OptionList");
                    const Tax = constructOptionList(response[0].data || [], "ntaxcode",
                        "sversionno", undefined, undefined, true);
                    TaxListversion = Tax.get("OptionList");
                    const TaxMap1 = constructOptionList(response[0].data || [], "ntaxcode",
                        "ncaltypecode", undefined, undefined, true);
                    Taxcaltype = TaxMap1.get("OptionList");
                }
                if (operation === "update") {
               
                    // Main record from DB
                    selectedRecord = response[0].data;

                    const taxData = response[1].data || [];

                    // Build dropdown list (correct key is ntaxcode)
                    TaxList = constructOptionList(
                        taxData,
                        "ntaxcode",
                        "staxname",
                        undefined,
                        undefined,
                        true
                    ).get("OptionList");

                    // Find exact selected tax item
                    const taxItem = taxData.find(
                        x => x.ntaxcode === selectedRecord.ntaxcode
                    );

                    if (taxItem) {
                        selectedRecord["ntaxproductcode"] = {
                            value: taxItem.ntaxcode,
                            label: taxItem.staxname,
                            item: taxItem
                        };

                        // Set additional fields for UI
                        selectedRecord["sversionno"] = taxItem.sversionno;
                        selectedRecord["ncaltypecode"] = taxItem.ncaltypecode;
                    }
                }

                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        Taxlist: TaxListversion, Product: ProductList, Tax: TaxList, openChildModal: true, operation,
                        selectedRecord, Taxcal: Taxcaltype,
                        ncontrolCode,
                        screenName: "IDS_TAXPRODUCT"
                        , loading: false
                    }
                });
            })
            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                if (error.response.status === 500) {
                    toast.error(intl.formatMessage({ id: error.message }));
                }
                else {
                    toast.warn(intl.formatMessage({ id: error.response.data }));
                }
            })
    }
}

export const addProductMasterFile = (inputParam) => {
    return (dispatch) => {
        dispatch(initRequest(true));
        let urlArray = [rsapi().post("/linkmaster/getLinkMaster", {
            userinfo: inputParam.userInfo
        })];

        if (inputParam.operation === "update") {
            urlArray.push(rsapi().post("/invoiceproductmaster/editInvoiceProductFile", {
                userinfo: inputParam.userInfo,
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
                        nlinkcode = defaultLink.length > 0 ? defaultLink[0] : ""
                        link = {
                            slinkfilename: '',
                            slinkdescription: '',
                            nlinkdefaultstatus: 4,
                            sfilesize: editObject.sfilesize,
                            nfilesize: editObject.nfilesize,
                            ndefaultstatus: editObject.ndefaultstatus,
                            sfilename: editObject.sfilename,
                            sdescription: editObject.sdescription,
                            ssystemfilename: editObject.ssystemfilename
                        }
                    }
                    selectedRecord = {
                        ...link,
                        nproductmasterfilecode: editObject.nproductmasterfilecode,
                        nattachmenttypecode: editObject.nattachmenttypecode,
                        nlinkcode,
                    };
                }
                else {
                    selectedRecord = {
                        nattachmenttypecode: response[0].data.AttachmentType.length > 0 ?
                            response[0].data.AttachmentType[0].nattachmenttypecode : attachmentType.FTP,
                        nlinkcode: defaultLink.length > 0 ? defaultLink[0] : "",
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
                if (error.response.status === 500) {
                    toast.error(error.message);
                } else {
                    toast.warn(error.response.data);
                }
            });
    }
}