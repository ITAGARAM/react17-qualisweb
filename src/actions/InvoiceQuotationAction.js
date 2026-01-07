import rsapi from '../rsapi';
import { DEFAULT_RETURN, UN_AUTHORIZED_ACCESS } from './LoginTypes';
import { constructOptionList, rearrangeDateFormat, sortData } from '../components/CommonScript'
import Axios from 'axios';
import { initRequest } from './LoginAction';
import { toast } from 'react-toastify';
import { intl } from '../components/App';
import { transactionStatus } from '../components/Enumeration';

export function getQuotationService(quotationParam) {
    return function (dispatch) {
        let urlArray = [];
        const paymentDetailCombo = rsapi().post("invoicequotation/getPayment", { userinfo: quotationParam.userInfo });
        const currencyTypeCombo = rsapi().post("invoicequotation/getCurrencyType", { userinfo: quotationParam.userInfo });
        const productTestCombo = rsapi().post("invoicequotation/getProductTestDetails", { userinfo: quotationParam.userInfo });
        const customerData = rsapi().post("invoicequotation/getCustomerQuotation", { userinfo: quotationParam.userInfo });
        const schemeData = rsapi().post("invoicequotation/getSchemesDetails", { userinfo: quotationParam.userInfo });
        const projectData = rsapi().post("invoicequotation/getProjectDetails", { userinfo: quotationParam.userInfo });
        if (quotationParam.operation === "create") {
            urlArray = [paymentDetailCombo, currencyTypeCombo, customerData, productTestCombo, schemeData, projectData];
        } else if (quotationParam.operation === "update") {
            const quotationById = rsapi().post("invoicequotation/getSeletedQuotation", { quotationid: quotationParam.masterData.selectedQuotation[0][quotationParam.primaryKey], userinfo: quotationParam.userInfo });
            urlArray = [paymentDetailCombo, currencyTypeCombo, customerData, productTestCombo, schemeData, quotationById, projectData];
        } else if (quotationParam.operation === "delete") {
            const quotationid = rsapi().post("invoicequotation/deleteInvoiceQuotation", { quotationid: quotationParam.masterData.selectedQuotation[0][quotationParam.primaryKey], userinfo: quotationParam.userInfo });
            urlArray = [quotationid];
        }
        Axios.all(urlArray)
            .then(response => {
                var productList = quotationParam.productList;
                let selectedProduct = [];
                let amountinwords = [];
                let selectedRecord = {};
                let productEditList = [];
                let projectCodeList=[];
                let projectNameList=[];
                let paymentDetailList = [];
                let schemeList = [];
                let productTestList = [];
                let productTest = {};
                let projectCode={};
                let projectName={};
                let schemes = {};
                let currencyTypeList = [];
                let customerList = {};
                let paymentMode = {};
                let currencyType = {};
                let openModal = false;
                let masterData = quotationParam.masterData;
                let operation = quotationParam.operation1;
                if (response[0].data.length !== 0 && response[1].data["Currency"].length !== 0) {
                    if (quotationParam.operation === "create") {
                        if (quotationParam.userInfo.nuserrole == -1) {
                            selectedRecord['nuserrole'] =quotationParam.userInfo.nuserrole
                            paymentMode = constructOptionList(response[0].data || [], "npaymentcode", "spaymentmode", undefined, undefined, true);
                            paymentDetailList = paymentMode.get("OptionList");
                            currencyType = constructOptionList(response[1].data["Currency"] || [], "ncurrencycode", "ssymbol", undefined, undefined, true);
                            currencyTypeList = currencyType.get("OptionList");
                            productTest = constructOptionList(response[3].data["ProductTest"] || [], "nproducttestcode", "sproducttestdetail", undefined, undefined, true);
                            productTestList = productTest.get("OptionList");
                            //selectedRecord['npaymentcode'] = { "value": response[0].data[0]["npaymentcode"], "label": response[0].data[0]["spaymentmode"] }
                           // selectedRecord['ncurrencycode'] = { "value": response[1].data["Currency"][0]["ncurrencycode"], "label": response[1].data["Currency"][0]["ssymbol"] }
                            selectedRecord['nproducttestcode'] = { "value": response[3].data["ProductTest"][0]["nproducttestcode"], "label": response[3].data["ProductTest"][0]["sproducttestdetail"] }
                            selectedRecord["dquotationtodate"] = rearrangeDateFormat(quotationParam.userInfo, response[1].data["dquotationtodate"]);
                            customerList = response[2].data;
                            schemes = constructOptionList(response[4].data || [], "nschemecode", "sschemename", undefined, undefined, true);
                            schemeList = schemes.get("OptionList");
                            selectedRecord['nschemecode'] = { "value": -1, "label": 'No Schemes' }
                            projectCode = constructOptionList(response[5].data || [], "nprojectmastercode", "sprojectcode", undefined, undefined, true);
                            projectCodeList = projectCode.get("OptionList");
                            selectedRecord['nprojectmastercode'] = { "value": -1, "label": 'NA' }
                            projectName = constructOptionList(response[5].data || [], "nprojectmastercode", "sprojectname", undefined, undefined, true);
                            projectNameList = projectName.get("OptionList");
                            selectedRecord['nproject'] = { "value": -1, "label": 'NA' }
                            openModal = true;
                            operation = 'Add';
                        } else {
                            paymentMode = constructOptionList(response[0].data || [], "npaymentcode", "spaymentmode", undefined, undefined, true);
                            paymentDetailList = paymentMode.get("OptionList");
                            currencyType = constructOptionList(response[1].data["Currency"] || [], "ncurrencycode", "ssymbol", undefined, undefined, true);
                            currencyTypeList = currencyType.get("OptionList");
                            productTest = constructOptionList(response[3].data["ProductTest"] || [], "nproducttestcode", "sproducttestdetail", undefined, undefined, true);
                            productTestList = productTest.get("OptionList");
                           // selectedRecord['npaymentcode'] = { "value": response[0].data[0]["npaymentcode"], "label": response[0].data[0]["spaymentmode"] }
                            //selectedRecord['ncurrencycode'] = { "value": response[1].data["Currency"][0]["ncurrencycode"], "label": response[1].data["Currency"][0]["ssymbol"] }
                            selectedRecord['nproducttestcode'] = { "value": response[3].data["ProductTest"][0]["nproducttestcode"], "label": response[3].data["ProductTest"][0]["sproducttestdetail"] }
                            selectedRecord["dquotationtodate"] = rearrangeDateFormat(quotationParam.userInfo, response[1].data["dquotationtodate"]);
                            selectedRecord["nuserrole"] = quotationParam.userInfo.nuserrole;
                            selectedRecord["userrolecode"] = quotationParam.userInfo.nuserrole;
                            selectedRecord["orderrefno"] = quotationParam.ntenderrefno.Orderrefno;
                            selectedRecord["orderrefdate"] = quotationParam.ntenderrefno.Orderrefdate;
                            selectedRecord["projectcode"] = quotationParam.ntenderrefno.Projectcode;
                            selectedRecord["tenderrefno"] = quotationParam.ntenderrefno.Tenderrefno;
                            selectedRecord["tenderdate"] = quotationParam.ntenderrefno.Tenderdate;
                            selectedRecord["totalfright"] = quotationParam.ntenderrefno.Totalfrightchanges;
                            selectedRecord["remarks2"] = quotationParam.ntenderrefno.Remarks2;
                            selectedRecord["remarks1"] = quotationParam.ntenderrefno.Remarks1;
                            selectedRecord["producttestcode"] = quotationParam.ntenderrefno.producttestcode;
                            schemes = constructOptionList(response[4].data || [], "nschemecode", "sschemename", undefined, undefined, true);
                            schemeList = schemes.get("OptionList");
                            selectedRecord['nschemecode'] = { "value": -1, "label": 'No Schemes' }
                            projectCode = constructOptionList(response[5].data || [], "nprojectmastercode", "sprojectcode", undefined, undefined, true);
                            projectCodeList = projectCode.get("OptionList");
                            selectedRecord['nprojectmastercode'] = { "value": -1, "label": 'NA' }
                            projectName = constructOptionList(response[5].data || [], "nprojectmastercode", "sprojectname", undefined, undefined, true);
                            projectNameList = projectName.get("OptionList");
                            selectedRecord['nproject'] = { "value": -1, "label": 'NA' }
                            customerList = response[2].data;
                            openModal = true;
                            operation = 'Add';
                        }
                    }
                    if (quotationParam.operation === "update") {
                       // if (quotationParam.userInfo.nuserrole == -1) {
                            amountinwords = response[5].data["selectedQuotation"][0].jsondata["TotalAmountInWords"];
                            selectedRecord["ncustomercode"] = response[5].data["selectedQuotation"][0]['ncustomercode'];
                            selectedRecord["scustomername"] = response[5].data["selectedQuotation"][0].jsondata["CustomerName"];
                            selectedRecord["semailid"] = response[5].data["selectedQuotation"][0].jsondata["EmailId"];
                            selectedRecord["scustgst"] = response[5].data["selectedQuotation"][0].jsondata["CustomerGST"];
                            selectedRecord["scustomertypename"] = response[5].data["selectedQuotation"][0].jsondata["CustomerType"];
                            selectedRecord["scustomeraddress"] = response[5].data["selectedQuotation"][0].jsondata["Address"];
                            selectedRecord["sphone"] = response[5].data["selectedQuotation"][0].jsondata["PhoneNo"];
                            selectedRecord["scustomerreference1"] =  response[5].data["selectedQuotation"][0].jsondata["MobileNo"];
                            selectedRecord["scustomerreference2"] =  response[5].data["selectedQuotation"][0].jsondata["ContactPerson"];
                            selectedRecord["dquotationdate"] = rearrangeDateFormat(quotationParam.userInfo, response[5].data["selectedQuotation"][0]["squotationdate"]);
                            selectedRecord["dquotationfromdate"] = rearrangeDateFormat(quotationParam.userInfo, response[5].data["selectedQuotation"][0]["squotationfromdate"]);
                            selectedRecord["dquotationtodate"] = rearrangeDateFormat(quotationParam.userInfo, response[5].data["selectedQuotation"][0]["squotationtodate"]);
                            selectedRecord["dorderrefdate"] = rearrangeDateFormat(quotationParam.userInfo, response[5].data["selectedQuotation"][0]["sorderrefdate"]);
                            selectedRecord["dtenderrefdate"] = rearrangeDateFormat(quotationParam.userInfo, response[5].data["selectedQuotation"][0]["stenderrefdate"]);
                            selectedRecord["stenderrefno"] = response[5].data["selectedQuotation"][0]["stenderrefno"] ? response[5].data["selectedQuotation"][0]["stenderrefno"] : "";
                            selectedRecord["nschemecode"] = response[5].data["selectedQuotation"][0]["sschemename"] ? { "value": response[5].data["selectedQuotation"][0]["nschemecode"], "label": response[5].data["selectedQuotation"][0]["sschemename"] } : "";
                            selectedRecord["ntotalamount"] = response[5].data["selectedQuotation"][0]["ntotalamount"] ? response[5].data["selectedQuotation"][0]["ntotalamount"] : "";
                            selectedRecord["ntotaltaxamount"] = response[5].data["selectedQuotation"][0]["ntotaltaxamount"] ? response[5].data["selectedQuotation"][0]["ntotaltaxamount"] : "";
                            selectedRecord["ntotalfrightcharges"] = response[5].data["selectedQuotation"][0]["ntotalfrightcharges"] ? response[5].data["selectedQuotation"][0]["ntotalfrightcharges"] : "";
                            selectedRecord["sremarks2"] = response[5].data["selectedQuotation"][0]["sremarks2"] ? response[5].data["selectedQuotation"][0]["sremarks2"] : "";
                            selectedRecord["sremarks1"] = response[5].data["selectedQuotation"][0]["sremarks1"] ? response[5].data["selectedQuotation"][0]["sremarks1"] : "";
                            selectedRecord["nquotationseqcode"] = response[5].data["selectedQuotation"][0]["nquotationseqcode"] ? response[5].data["selectedQuotation"][0]["nquotationseqcode"] : "";
                            selectedRecord["sprojectcode"] = response[5].data["selectedQuotation"][0]["sprojectcode"] ? response[5].data["selectedQuotation"][0]["sprojectcode"] : "";
                            paymentMode = constructOptionList(response[0].data || [], "npaymentcode", "spaymentmode", undefined, undefined, true);
                            paymentDetailList = paymentMode.get("OptionList");
                            currencyType = constructOptionList(response[1].data["Currency"] || [], "ncurrencycode", "ssymbol", undefined, undefined, true);
                            currencyTypeList = currencyType.get("OptionList");
                            productTest = constructOptionList(response[3].data["ProductTest"] || [], "nproducttestcode", "sproducttestdetail", undefined, undefined, true);
                            productTestList = productTest.get("OptionList");
                            schemes = constructOptionList(response[4].data || [], "nschemecode", "sschemename", undefined, undefined, true);
                            schemeList = schemes.get("OptionList");
                            paymentDetailList.map((item) => {
                                if (item.label === response[5].data["selectedQuotation"][0]["spaymentdetails"]) {
                                    selectedRecord['npaymentcode'] = { "value": item.value, "label": item.label }
                                }
                            })
                            currencyTypeList.map((item) => {
                                if (item.value === response[5].data["selectedQuotation"][0]["ncurrencytype"]) {
                                    selectedRecord['ncurrencycode'] = { "value": item.value, "label": item.label }
                                }
                            })
                            productTestList.map((item) => {
                                if (item.value === response[5].data["selectedQuotation"][0]["nproducttestcode"]) {
                                    selectedRecord['nproducttestcode'] = { "value": item.value, "label": item.label }
                                }
                            })
                            projectCode = constructOptionList(response[6].data || [], "nprojectmastercode", "sprojectcode", undefined, undefined, true);
                            projectCodeList = projectCode.get("OptionList");
                            selectedRecord['nprojectmastercode'] = { "value": response[5].data["selectedQuotation"][0]["nprojectmastercode"], "label": response[5].data["selectedQuotation"][0]["sprojectcode"] }
                            projectName = constructOptionList(response[6].data || [], "nprojectmastercode", "sprojectname", undefined, undefined, true);
                            projectNameList = projectName.get("OptionList");
                            selectedRecord['nproject'] = { "value": response[5].data["selectedQuotation"][0]["nprojectmastercode"] , "label": response[5].data["selectedQuotation"][0]["sprojectname"] }
                            customerList = response[2].data;
                            response[5].data["selectedProduct"].map((item) => {
                                item["testList"] = item.jsondata1;
                                productList.push(item);
                            })
                            openModal = true;
                            operation = 'Edit';
                        //}
                        //else {
                            amountinwords = response[5].data["selectedQuotation"][0].jsondata["TotalAmountInWords"];
                            selectedRecord["ncustomercode"] = response[5].data["selectedQuotation"][0]['ncustomercode'];
                            selectedRecord["scustomername"] = response[5].data["selectedQuotation"][0].jsondata["CustomerName"];
                            selectedRecord["semailid"] = response[5].data["selectedQuotation"][0].jsondata["EmailId"];
                            selectedRecord["scustgst"] = response[5].data["selectedQuotation"][0].jsondata["CustomerGST"];
                            selectedRecord["scustomertypename"] = response[5].data["selectedQuotation"][0].jsondata["CustomerType"];
                            selectedRecord["scustomeraddress"] = response[5].data["selectedQuotation"][0].jsondata["Address"];
                            selectedRecord["sphone"] = response[5].data["selectedQuotation"][0].jsondata["PhoneNo"];
                            selectedRecord["scustomerreference1"] =  response[5].data["selectedQuotation"][0].jsondata["MobileNo"];
                            selectedRecord["scustomerreference2"] =  response[5].data["selectedQuotation"][0].jsondata["ContactPerson"];
                            selectedRecord["nschemecode"] = response[5].data["selectedQuotation"][0]["sschemename"] ? { "value": response[5].data["selectedQuotation"][0]["nschemecode"], "label": response[5].data["selectedQuotation"][0]["sschemename"] } : "";
                            selectedRecord["dquotationdate"] = rearrangeDateFormat(quotationParam.userInfo, response[5].data["selectedQuotation"][0]["squotationdate"]);
                            selectedRecord["dquotationfromdate"] = rearrangeDateFormat(quotationParam.userInfo, response[5].data["selectedQuotation"][0]["squotationfromdate"]);
                            selectedRecord["dquotationtodate"] = rearrangeDateFormat(quotationParam.userInfo, response[5].data["selectedQuotation"][0]["squotationtodate"]);
                            selectedRecord["dorderrefdate"] = rearrangeDateFormat(quotationParam.userInfo, response[5].data["selectedQuotation"][0]["sorderrefdate"]);
                            selectedRecord["dtenderrefdate"] = rearrangeDateFormat(quotationParam.userInfo, response[5].data["selectedQuotation"][0]["stenderrefdate"]);
                            selectedRecord["stenderrefno"] = response[5].data["selectedQuotation"][0]["stenderrefno"] ? response[5].data["selectedQuotation"][0]["stenderrefno"] : "";
                            selectedRecord["sorderrefno"] = response[5].data["selectedQuotation"][0]["sorderrefno"] ? response[5].data["selectedQuotation"][0]["sorderrefno"] : "";
                            selectedRecord["ntotalamount"] = response[5].data["selectedQuotation"][0]["ntotalamount"] ? response[5].data["selectedQuotation"][0]["ntotalamount"] : "";
                            selectedRecord["ntotaltaxamount"] = response[5].data["selectedQuotation"][0]["ntotaltaxamount"] ? response[5].data["selectedQuotation"][0]["ntotaltaxamount"] : "";
                            selectedRecord["ntotalfrightcharges"] = response[5].data["selectedQuotation"][0]["ntotalfrightcharges"] ? response[5].data["selectedQuotation"][0]["ntotalfrightcharges"] : "";
                            selectedRecord["sremarks2"] = response[5].data["selectedQuotation"][0]["sremarks2"] ? response[5].data["selectedQuotation"][0]["sremarks2"] : "";
                            selectedRecord["sremarks1"] = response[5].data["selectedQuotation"][0]["sremarks1"] ? response[5].data["selectedQuotation"][0]["sremarks1"] : "";
                            selectedRecord["nquotationseqcode"] = response[5].data["selectedQuotation"][0]["nquotationseqcode"] ? response[5].data["selectedQuotation"][0]["nquotationseqcode"] : "";
                            selectedRecord["sprojectcode"] = response[5].data["selectedQuotation"][0]["sprojectcode"] ? response[5].data["selectedQuotation"][0]["sprojectcode"] : "";
                            paymentMode = constructOptionList(response[0].data || [], "npaymentcode", "spaymentmode", undefined, undefined, true);
                            selectedRecord["nuserrole"] = quotationParam.userInfo.nuserrole;
                            selectedRecord["userrolecode"] = quotationParam.userInfo.nuserrole;
                            selectedRecord["orderrefno"] = quotationParam.ntenderrefno.Orderrefno;
                            selectedRecord["orderrefdate"] = quotationParam.ntenderrefno.Orderrefdate;
                            selectedRecord["projectcode"] = quotationParam.ntenderrefno.Projectcode;
                            selectedRecord["tenderrefno"] = quotationParam.ntenderrefno.Tenderrefno;
                            selectedRecord["tenderdate"] = quotationParam.ntenderrefno.Tenderdate;
                            selectedRecord["totalfright"] = quotationParam.ntenderrefno.Totalfrightchanges;
                            selectedRecord["producttestcode"] = quotationParam.ntenderrefno.producttestcode;
                            selectedRecord["remarks2"] = quotationParam.ntenderrefno.Remarks2;
                            selectedRecord["remarks1"] = quotationParam.ntenderrefno.Remarks1;
                            paymentDetailList = paymentMode.get("OptionList");
                            currencyType = constructOptionList(response[1].data["Currency"] || [], "ncurrencycode", "ssymbol", undefined, undefined, true);
                            currencyTypeList = currencyType.get("OptionList");
                            paymentDetailList.map((item) => {
                                if (item.label === response[5].data["selectedQuotation"][0]["spaymentdetails"]) {
                                    selectedRecord['npaymentcode'] = { "value": item.value, "label": item.label }
                                }
                            })
                            currencyTypeList.map((item) => {
                                if (item.value === response[5].data["selectedQuotation"][0]["ncurrencytype"]) {
                                    selectedRecord['ncurrencycode'] = { "value": item.value, "label": item.label }
                                }
                            })
                              productTest = constructOptionList(response[3].data["ProductTest"] || [], "nproducttestcode", "sproducttestdetail", undefined, undefined, true);
                                                       productTestList = productTest.get("OptionList");
                            productTestList.map((item) => {
                                if (item.value === response[5].data["selectedQuotation"][0]["nproducttestcode"]) {
                                    selectedRecord['nproducttestcode'] = { "value": item.value, "label": item.label }
                                }
                            })
                            schemes = constructOptionList(response[4].data || [], "nschemecode", "sschemename", undefined, undefined, true);
                            schemeList = schemes.get("OptionList");
                            projectCode = constructOptionList(response[6].data || [], "nprojectmastercode", "sprojectcode", undefined, undefined, true);
                            projectCodeList = projectCode.get("OptionList");
                            selectedRecord['nprojectmastercode'] = { "value": response[5].data["selectedQuotation"][0]["nprojectmastercode"], "label": response[5].data["selectedQuotation"][0]["sprojectcode"] }
                            projectName = constructOptionList(response[6].data || [], "nprojectmastercode", "sprojectname", undefined, undefined, true);
                            projectNameList = projectName.get("OptionList");
                            selectedRecord['nproject'] = { "value": response[5].data["selectedQuotation"][0]["nprojectmastercode"] , "label": response[5].data["selectedQuotation"][0]["sprojectname"] }
                            customerList = response[2].data;
                           // response[5].data["selectedProduct"].map((item) => {
                              //  item["testList"] = item.jsondata1;
                                //productList.push(item);
                            //})
                            openModal = true;
                            operation = 'Edit';
                       // }
                    } else if (quotationParam.operation === "delete") {
                        masterData = response[0].data;
                    }

                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {
                            currencyTypeList,
                            productTestList,
                            paymentDetailList,
                            selectedRecord,
                            customerList, masterData,
                            openModal, operation,
                            nneedproducttab: true,
                            openproductTab: false,
                            screenName: 'Quotation',
                            openChildModal: false,
                            productList,
                            selectedProduct,
                            productEditList: productList,
                            amountinwords,
                            schemeList,
                            projectNameList,
                            projectCodeList 
                        }
                    });
                } else {
                    toast.warn(intl.formatMessage({ id: "IDS_FILLTHEDATA" }))
                }
            }

            )
    }
}


export function getProductSetQuotation(filterValue, userInfo, selectedRecord, ncustomercode, nschemecode) {
    return function (dispatch) {
        const productTypeCombo = rsapi().post("invoicequotation/getProducts", { products: filterValue, userinfo: userInfo, ncustomercode, nschemecode: nschemecode });
        let urlArray = [productTypeCombo];
        let selectedRecordProduct = {};
        let testList = [];
        Axios.all(urlArray)
            .then(response => {
                // Parse the response
                selectedRecordProduct["nlimsproduct"] = response[0].data["selectedProduct"]["nlimsproduct"];
                selectedRecordProduct["nproductcode"] = response[0].data["selectedProduct"]["nproductcode"];
                selectedRecordProduct["sproductname"] = response[0].data["selectedProduct"]["sproductname"];
                selectedRecord["ncost"] = response[0].data["selectedProduct"]["ncost"];
                selectedRecordProduct["ntotalcost"] = "";
                selectedRecordProduct["ntaxvalue"] = response[0].data["selectedProduct"]["ntax"];
                selectedRecordProduct["ntaxamount"] = "";
                selectedRecordProduct["nindirectax"] = response[0].data["selectedProduct"]["nindirectax"];
                selectedRecordProduct["sindirecttaxname"] = response[0].data["selectedProduct"]["sindirecttaxname"];

                selectedRecord["nquantity"] = response[0].data["selectedProduct"]["nquantity"];
                if (selectedRecord["nquantity"] !== undefined && selectedRecord["nquantity"] !== "" && parseInt(selectedRecord["nquantity"]) < 1) {
                    selectedRecord["nquantity"] = 1;
                }
                selectedRecord["nunit"] = response[0].data["selectedProduct"]["nunit"];
                if (selectedRecord["nunit"] !== undefined && selectedRecord["nunit"] !== "" && parseInt(selectedRecord["nunit"]) < 1) {
                    selectedRecord["nunit"] = 1;
                }
                selectedRecordProduct["staxname"] = response[0].data["selectedProduct"]["staxname"];
                selectedRecordProduct["ndiscountedamount"] = "";
                selectedRecord["ndiscountpercentage"] = response[0].data["selectedProduct"]["ndiscountpercentage"];
                if (selectedRecord["ndiscountpercentage"] !== undefined && selectedRecord["ndiscountpercentage"] !== "" && parseInt(selectedRecord["ndiscountpercentage"]) < 1) {
                    selectedRecord["ndiscountpercentage"] = "";
                }
                selectedRecordProduct["ntotalcostforproductonly"] = "";
                if (parseInt(selectedRecord["nquantity"]) >= 1 && selectedRecord["ndiscountpercentage"] !== "" && selectedRecord["ndiscountpercentage"] !== 0) {
                    selectedRecordProduct["ntotalcost"] = selectedRecord["nquantity"] * selectedRecord["ncost"];
                    selectedRecordProduct["ntaxamount"] = parseFloat(((selectedRecordProduct['ntaxvalue'] / 100) * selectedRecordProduct["ntotalcost"]).toFixed(2));
                    selectedRecordProduct["noverallcost"] = parseFloat(Number(selectedRecordProduct['ntotalcost']) + Number(selectedRecordProduct['ntaxamount'])).toFixed(2);
                    selectedRecordProduct["noverallcost"] = Number(selectedRecordProduct["ntotalcost"]) - (Number(selectedRecordProduct["ntotalcost"] * (selectedRecord["ndiscountpercentage"]) / 100));
                    selectedRecordProduct["ntaxamount"] = parseFloat(((selectedRecordProduct['ntaxvalue'] / 100) * selectedRecordProduct["noverallcost"]).toFixed(2));
                    selectedRecordProduct["noverallcost"] = parseFloat(Number(selectedRecordProduct['noverallcost']) + Number(selectedRecordProduct['ntaxamount'])).toFixed(2);
                }
                else if (parseInt(selectedRecord["nquantity"]) >= 1 && selectedRecord["ndiscountpercentage"] == "" && selectedRecord["ndiscountpercentage"] == 0) {
                    selectedRecordProduct["ntotalcost"] = selectedRecord["nquantity"] * selectedRecord["ncost"];
                    selectedRecordProduct["ntaxamount"] = parseFloat(((selectedRecordProduct['ntaxvalue'] / 100) * selectedRecordProduct["ntotalcost"]).toFixed(2));
                    selectedRecordProduct["noverallcost"] = parseFloat(Number(selectedRecordProduct['ntotalcost']) + Number(selectedRecordProduct['ntaxamount'])).toFixed(2);
                }
                else if (selectedRecordProduct["noverallcost"] == "" || selectedRecordProduct["noverallcost"] == undefined) {
                    selectedRecordProduct["ntotalcost"] = selectedRecord["ncost"];
                    selectedRecordProduct["noverallcost"] = selectedRecord["ncost"];
                    selectedRecordProduct["ntaxamount"] = parseFloat(((selectedRecordProduct['ntaxvalue'] / 100) * selectedRecordProduct['noverallcost']).toFixed(2));
                    selectedRecordProduct["noverallcost"] = parseFloat(Number(selectedRecordProduct['noverallcost']) + Number(selectedRecordProduct['ntaxamount'])).toFixed(2);
                }
                else {
                    selectedRecordProduct["noverallcost"] = "";
                }
                selectedRecord["nquantity"] = 1;
                selectedRecordProduct["nschemecode"] = response[0].data["selectedProduct"]["nschemecode"];
                
                // Automatically select all tests if they are available
                testList = response[0].data["selectedTest"] !== undefined ? response[0].data["selectedTest"].map(e => { return { ...e, selected: true } }) : testList;

                // Dispatch the action with the updated state
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        selectedRecordProduct,
                        selectedRecord,
                        selectedTest: testList,
                        openModal: true
                    }
                });
            });
    }
}


export function getFilterService(filterValue, userInfo, selectedRecord) {
    return function (dispatch) {

        const customerTypeCombo = rsapi().post("invoicequotation/getSearchFieldData", { customerid: filterValue, userinfo: userInfo });
        let urlArray = [customerTypeCombo];
        Axios.all(urlArray)
            .then(response => {
                selectedRecord["scustomername"] = response[0].data[0]["scustomername"];
                selectedRecord["semailid"] = response[0].data[0]["semailid"];
                selectedRecord["scustgst"] = response[0].data[0]["scustgst"];
                selectedRecord["scustomertypename"] = response[0].data[0]["scustomertypename"];
                selectedRecord["scustomeraddress"] = response[0].data[0]["scustomeraddress"];
                selectedRecord["sphone"] = response[0].data[0]["sphone"];
                selectedRecord["ncustomercode"] = response[0].data[0]["ncustomercode"];
                selectedRecord["scustomerreference1"] = response[0].data[0]["scustomerreference1"];
                selectedRecord["scustomerreference2"] = response[0].data[0]["scustomerreference2"];

                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        selectedRecord,
                        openModal: true
                    }
                });
            }
            )
    }
}
export function getQuotationDetail(quotationlist, userInfo, masterData) {
    return function (dispatch) {
        dispatch(initRequest(true));

        return rsapi().post("invoicequotation/getSeletedQuotation", { quotationid: quotationlist.nquotationseqcode, userinfo: userInfo })
            .then(response => {
                masterData = { ...masterData, ...response.data };

                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData,
                        loading: false
                    }
                });
            })
            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                if (error.response?.status === 429) {
                    toast.warn(intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
                } else if (error.response?.status === 401 || error.response?.status === 403) {
                    dispatch({
                        type: UN_AUTHORIZED_ACCESS,
                        payload: {
                            navigation: 'forbiddenaccess',
                            loading: false,
                            responseStatus: error.response.status
                        }
                    });
                } else if (error.response?.status === 500) {
                    toast.error(error.message);
                } else {
                    toast.warn(error.response.data);
                }
            })
    }
}

export function getProductForQuotation(productListQuoation) {
    return function (dispatch) {

        let testList = [];
        if (productListQuoation.Displayname == 'Product') {
            const productMasterList = rsapi().post("/invoicequotation/getProductforQuotation", {
                userinfo: productListQuoation.userInfo,
                ncustomercode: productListQuoation.selectedRecord.ncustomercode,
                nschemecode: productListQuoation.selectedRecord.nschemecode.value,
                nquotationitemdetailscode: productListQuoation.selectedRecord.nquotationitemdetailscode,
                productlist:productListQuoation.productlist
            });
            let urlArray = [productMasterList];

            Axios.all(urlArray)
                .then(response => {
                    const productMasterList = response[0].data.filteredList;
                    const discount = response[0].data.Discount;

                    const updatedSelectedRecord = {
                        ...productListQuoation.selectedRecord,
                        Discount: discount
                    };
                    testList = response[0].data.selectedTest.length !== 0 && productListQuoation.selectedRecord.nquotationitemdetailscode !== 0 ? response[0].data.selectedTest : productListQuoation.testList;
                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {
                            productMasterList,
                            selectedRecord: updatedSelectedRecord,
                            openModal: true,
                            selectedTest: testList
                        }
                    });
                });
        }
    }
}

export function getTotalAmountInWords(totalAmount, userInfo) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("invoicequotation/getActivecurrency", { ntotalamount: totalAmount, userinfo: userInfo })
            .then(response => {
                let amountinwords = response.data;
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        amountinwords,
                        loading: false
                    }
                });
            })
            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                if (error.response?.status === 429) {
                    toast.warn(intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
                } else if (error.response?.status === 401 || error.response?.status === 403) {
                    dispatch({
                        type: UN_AUTHORIZED_ACCESS,
                        payload: {
                            navigation: 'forbiddenaccess',
                            loading: false,
                            responseStatus: error.response.status
                        }
                    });
                } else if (error.response?.status === 500) {
                    toast.error(error.message);
                } else {
                    toast.warn(error.response.data);
                }
            })
    }
}

export const fetchProductRecord = (fetchRecordParam) => {
    return (dispatch) => {
        if (fetchRecordParam.masterData[0].ntransactionstatus === transactionStatus.APPROVED) {
            toast.warn(intl.formatMessage({ id: "IDS_SELECTDRAFTRECORDFOREDIT" }))
        } else {
            dispatch(initRequest(true));
            let testList = [];
            let urlArray = [];
            let selectedRecordProduct = {};
            let selectedRecord = {};
            let productMasterList = [];
            const productMaster = rsapi().post("/invoicequotation/getProductforQuotation", { userinfo: fetchRecordParam.fetchRecord.userInfo, ncustomercode: fetchRecordParam.masterData[0].ncustomercode, nschemecode: fetchRecordParam.masterData[0].nschemecode, nquotationitemdetailscode: fetchRecordParam.fetchRecord.editRow.nquotationitemdetailscode });
            const url = rsapi().post("/invoicequotation/getActiveInvoiceQuotationById", {
                "QuotationId": fetchRecordParam.masterData[0].squotationno, "ProductName": fetchRecordParam.fetchRecord.editRow.sproductname, "Quantity": fetchRecordParam.fetchRecord.editRow.nquantity,
                "userInfo": fetchRecordParam.fetchRecord.userInfo
            });
            urlArray = [productMaster, url];
            Axios.all(urlArray)
                .then(response => {
                    selectedRecordProduct["sproductname"] = response[1].data[0].sproductname;
                    selectedRecord["nunit"] = response[1].data[0].nunit;
                    selectedRecord["nquantity"] = response[1].data[0].nquantity;
                    selectedRecord["ncost"] = response[1].data[0].ncost;
                    selectedRecord["ndiscountpercentage"] = response[1].data[0].ndiscountpercentage;
                    selectedRecordProduct["ntaxvalue"] = response[1].data[0].ntaxpercentage;
                    selectedRecordProduct["ntaxamount"] = response[1].data[0].ntaxamount;
                    selectedRecordProduct["noverallcost"] = response[1].data[0].noverallcost;
                    selectedRecord["nquotationitemdetailscode"] = response[1].data[0].nquotationitemdetailscode
                    selectedRecord["slno"] = response[1].data[0].nserialno;
                    selectedRecordProduct["ntotalcost"] = response[1].data[0].ntotalcost
                    selectedRecordProduct["staxname"] = response[1].data[0].staxname
                    selectedRecord["squotationseqno"] = response[1].data[0].squotationseqno
                    selectedRecordProduct["nproductcode"] = response[1].data[0].nproductcode
                    selectedRecordProduct["previousntaxvalue"] = response[1].data[0].ntaxvalue;
                    selectedRecordProduct["previoussproductname"] = response[1].data[0].sproductname;
                    selectedRecordProduct["previousntaxamount"] = response[1].data[0].ntaxamount;
                    selectedRecordProduct["previousnproductcode"] = response[1].data[0].nproductcode;
                    selectedRecordProduct["nindirectax"] = response[1].data[0].nindirectax;
                    selectedRecordProduct["sindirectaxname"] = response[1].data[0].sindirectaxname;
                    selectedRecord["Discount"] = response[0].data.Discount;
                    productMasterList = response[0].data.filteredList;

                    const updatedSelectedRecords = {
                        ...fetchRecordParam.masterData,
                        Discount: response[0].data.Discount
                    };

                    if (response[0].data.selectedTest.length !== 0 && response[0].data.selectedTest[0].sproducttestname !== null) {
                        testList = response[0].data.selectedTest;
                    }
                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {
                            operation: "Edit",
                            selectedRecord,
                            selectedRecordProduct,
                            screenName: "Product",
                            openModal: true,
                            openproductTab: true,
                            loading: false,
                            nneedproducttab: false,
                            outside: true,
                            productMasterList,
                            updatedSelectedRecords,
                            productMaster,
                            selectedTest: testList

                        }
                    });
                })
                .catch(error => {
                    dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                    if (error.response?.status === 429) {
                        toast.warn(intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
                    } else if (error.response?.status === 401 || error.response?.status === 403) {
                        dispatch({
                            type: UN_AUTHORIZED_ACCESS,
                            payload: {
                                navigation: 'forbiddenaccess',
                                loading: false,
                                responseStatus: error.response.status
                            }
                        });
                    } else if (error.response?.status === 500) {
                        toast.error(error.message);
                    } else {
                        toast.warn(error.response.data);
                    }
                });
        }
    }
}


export const deleteRecord = (deleteParam) => {
    return (dispatch) => {

        if (deleteParam.masterData.selectedQuotation[0].ntransactionstatus === transactionStatus.APPROVED) {
            toast.warn(intl.formatMessage({ id: "IDS_SELECTDRAFTRECORDFORDELETE" }))
        } else {
            let urlArray = [];
            let parameter = {};
            if (!deleteParam.deleteList) {
                parameter["QuotationId"] = deleteParam.masterData.selectedQuotation[0].squotationno;
                parameter["nquotationitemdetailscode"] = deleteParam.selectedRecord.nquotationitemdetailscode;
                parameter["userinfo"] = deleteParam.userInfo;
            } else {
                parameter["QuotationSeqNo"] = deleteParam.deleteList[0].squotationseqno;
                parameter["nquotationitemdetailscode"] = deleteParam.deleteList[0].nquotationitemdetailscode;
                parameter["userinfo"] = deleteParam.userInfo;
            }
            const paymentDetailCombo = rsapi().post("/invoicequotation/deleteProductInvoiceQuotation", { parameter })

            urlArray = [paymentDetailCombo];
            Axios.all(urlArray)
                .then(response => {
                    if (response[0].data !== "") {
                        dispatch({
                            type: DEFAULT_RETURN, payload: {
                                loading: false,
                                masterData: response[0].data
                            }
                        })
                        toast.success(response.data);
                    }
                }
                )
                .catch(error => {
                    dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                    if (error.response?.status === 429) {
                        toast.warn(intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
                    } else if (error.response?.status === 401 || error.response?.status === 403) {
                        dispatch({
                            type: UN_AUTHORIZED_ACCESS,
                            payload: {
                                navigation: 'forbiddenaccess',
                                loading: false,
                                responseStatus: error.response.status
                            }
                        });
                    } else if (error.response?.status === 500) {
                        toast.error(error.message);
                    } else {
                        toast.warn(error.response.data);
                    }
                })
        }
    }
}

export const reloadData = (param) => {
    return (dispatch) => {
        dispatch(initRequest(true));
        let masterData = param.masterData;
        return rsapi().post("invoicequotation/getInvoiceQuotation", { userinfo: param.userInfo,...param.inputData })
            .then(response => {
                masterData = response.data;
                sortData(masterData);
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData,
                        loading: false
                    }
                });
            })
    }
}

export function getFilteredRecords(inputData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("invoicequotation/getFilteredRecords", { ...inputData.inputData })
            .then(response => {
                const { fromDate, toDate } = response.data;
                let masterData = {
                    ...inputData.masterData,
                    ...response.data,
                    fromDate,                // ✅ keep filtered FromDate
                    toDate,                  // ✅ keep filtered ToDate
                    breadCrumbFrom: fromDate,
                    breadCrumbTo: toDate,
                    ViewType:inputData.selectedQuotation
                }
                // let resetDataGridPage = false;
                // if(masterData.AuditDetails&&masterData.AuditDetails.length<inputData.detailSkip){
                //     resetDataGridPage=true
                // }else{
                //     resetDataGridPage = false
                // }
                let respObject = {
                    
                    masterData,
                    loading: false,
                    showFilter: false,
                    //resetDataGridPage
                }
                // dispatch(postCRUDOrganiseTransSearch(inputData.inputData.postParamList, respObject))
                dispatch({ type: DEFAULT_RETURN, payload: { ...respObject ,skip:0,take:20} })

            })
            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                if (error.response?.status === 429) {
                    toast.warn(intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
                } else if (error.response?.status === 401 || error.response?.status === 403) {
                    dispatch({
                        type: UN_AUTHORIZED_ACCESS,
                        payload: {
                            navigation: 'forbiddenaccess',
                            loading: false,
                            responseStatus: error.response.status
                        }
                    });
                } else if (error.response?.status === 500) {
                        toast.error(error.message);
                    } else {
                        toast.warn(error.response.data);
                    }
            });
            
    }
}
            
export const reportGenerator = (inputParam) => {
    return (dispatch) => {
        dispatch(initRequest(true));
        rsapi().post("invoicequotation/quotationReportGenerate", {
            ...inputParam
        })
            .then(response => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false,
                    }
                })
                let timer = setTimeout(() => {
                    document.getElementById("download_data").setAttribute("href", response.data.filepath);
                    document.getElementById("download_data").click();
                }, 1000); 
            }).catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                if (error.response?.status === 429) {
                    toast.warn(intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
                } else if (error.response?.status === 401 || error.response?.status === 403) {
                dispatch({
                        type: UN_AUTHORIZED_ACCESS,
                    payload: {
                            navigation: 'forbiddenaccess',
                            loading: false,
                            responseStatus: error.response.status
                    }
                    });
                } else if (error.response?.status === 500) {
                    toast.error(error.message);
                } else {
                    toast.warn(error.response.data);
                }
            })
    }

}

export const updateUsercode = (inputParam) => {
    return (dispatch) => {
        dispatch(initRequest(true));
        rsapi().post("invoicequotation/updateUsercode", {
            userinfo: inputParam.userinfo, nquotationseqcode: inputParam.nquotationseqcode
        })
            .then(response => {
            }).catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                if (error.response?.status === 429) {
                    toast.warn(intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
                } else if (error.response?.status === 401 || error.response?.status === 403) {
                dispatch({
                        type: UN_AUTHORIZED_ACCESS,
                    payload: {
                            navigation: 'forbiddenaccess',
                            loading: false,
                            responseStatus: error.response.status
                    }
                    });
                } else if (error.response?.status === 500) {
                    toast.error(error.message);
                } else {
                    toast.warn(error.response.data);
                }
            })
    }
}

export const costUpdate = (productcode,cost,userinfo) => {
    return (dispatch) => {
        rsapi().post("invoicequotation/costUpdate", {
            nproductcode: productcode, ncost: cost,userInfo:userinfo
        })
            .then(response => {
            }).catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                if (error.response?.status === 429) {
                    toast.warn(intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
                } else if (error.response?.status === 401 || error.response?.status === 403) {
                dispatch({
                        type: UN_AUTHORIZED_ACCESS,
                    payload: {
                            navigation: 'forbiddenaccess',
                            loading: false,
                            responseStatus: error.response.status
                    }
                    });
                } else if (error.response?.status === 500) {
                    toast.error(error.message);
                } else {
                    toast.warn(error.response.data);
                }
            })
    }
}
