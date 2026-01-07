import rsapi from '../rsapi';
import { DEFAULT_RETURN,UN_AUTHORIZED_ACCESS } from './LoginTypes';
import { constructOptionList, rearrangeDateFormat, sortData } from '../components/CommonScript'
import Axios from 'axios';
import { initRequest } from './LoginAction';
import { toast } from 'react-toastify';
import { intl } from '../components/App';
import { transactionStatus } from '../components/Enumeration';

export function getHeaderService(invoiceParam) {
    return function (dispatch) {
        let urlArray = [];
        const paymentDetailCombo = rsapi().post("invoicequotation/getPayment", { userinfo: invoiceParam.userInfo });
        const currencyTypeCombo = rsapi().post("invoicequotation/getCurrencyType", { userinfo: invoiceParam.userInfo });
        const productTestCombo = rsapi().post("invoiceheader/getProductTestDetails", { userinfo: invoiceParam.userInfo });
        const customerData = rsapi().post("invoicequotation/getCustomerQuotation", { userinfo: invoiceParam.userInfo });
        const patientData = rsapi().post("invoiceheader/getPatientDetails", { userinfo: invoiceParam.userInfo });
        const schemeData = rsapi().post("invoiceheader/getSchemes", { userinfo: invoiceParam.userInfo });

        if (invoiceParam.operation === "create") {
            urlArray = [paymentDetailCombo, currencyTypeCombo, customerData, productTestCombo, patientData, schemeData];
        } else if (invoiceParam.operation === "update") {

            const invoiceById = rsapi().post("invoiceheader/getSeletedInvoice", { invoiceid: invoiceParam.masterData.selectedInvoice[0].ninvoiceseqcode, userinfo: invoiceParam.userInfo });
            urlArray = [paymentDetailCombo, currencyTypeCombo, customerData, productTestCombo, patientData, schemeData, invoiceById];
        } else {
            const invoiceid = rsapi().post("invoiceheader/deleteInvoice", { invoiceid: invoiceParam.masterData.selectedInvoice[0].ninvoiceseqcode, userinfo: invoiceParam.userInfo });
            urlArray = [invoiceid];
        }

        Axios.all(urlArray)
            .then(response => {
                var productList = invoiceParam.productList;
                let selectedRecord = {};
                let paymentDetailList = {};
                let currencyTypeList = {};
                let customerList = {};
                let patientList = {};
                let productTest = {};
                let schemes = {};
                let schemeList = [];
                let productTestList = [];
                let productEditList = [];
                let currencyType = {};
                let paymentMode = {};
                let openModal = false;
                let amountinwords = [];
                let masterData = invoiceParam.masterData;
                let operation = invoiceParam.operation1;
                if (response[0].data.length !== 0 && response[1].data["Currency"].length !== 0) {
                    if (invoiceParam.operation === "create") {
                        if (invoiceParam.userInfo.nuserrole === -1) {
                            selectedRecord['nuserrole'] = invoiceParam.userInfo.nuserrole;
                            const paymentMode = constructOptionList(response[0].data || [], "npaymentcode", "spaymentmode", undefined, undefined, true);
                            paymentDetailList = paymentMode.get("OptionList");
                            const currencyType = constructOptionList(response[1].data["Currency"] || [], "ncurrencycode", "ssymbol", undefined, undefined, true);
                            currencyTypeList = currencyType.get("OptionList");
                            productTest = constructOptionList(response[3].data["ProductTest"] || [], "nproducttestcode", "sproducttestdetail", undefined, undefined, true);
                            productTestList = productTest.get("OptionList");
                            schemes = constructOptionList(response[5].data || [], "nschemecode", "sschemename", undefined, undefined, true);
                            schemeList = schemes.get("OptionList");
                            selectedRecord['nschemecode'] = { "value": -1, "label": 'No Schemes' }
                           // selectedRecord['npaymentcode'] = { "value": response[0].data[0]["npaymentcode"], "label": response[0].data[0]["spaymentmode"] }
                            selectedRecord['nproducttestcode'] = { "value": response[3].data["ProductTest"][0]["nproducttestcode"], "label": response[3].data["ProductTest"][0]["sproducttestdetail"] }
                           // selectedRecord['ncurrencycode'] = { "value": response[1].data["Currency"][0]["ncurrencycode"], "label": response[1].data["Currency"][0]["ssymbol"] }
                            selectedRecord["dquotationtodate"] = rearrangeDateFormat(invoiceParam.userInfo, response[1].data["dquotationtodate"]);
                            customerList = response[2].data;
                            patientList = response[4].data;
                            openModal = true;
                            operation = 'Add';
                            selectedRecord["invoicepatientfield"] = 3;
                        } else {
                            const paymentMode = constructOptionList(response[0].data || [], "npaymentcode", "spaymentmode", undefined, undefined, true);
                            paymentDetailList = paymentMode.get("OptionList");
                            const currencyType = constructOptionList(response[1].data["Currency"] || [], "ncurrencycode", "ssymbol", undefined, undefined, true);
                            currencyTypeList = currencyType.get("OptionList");
                            productTest = constructOptionList(response[3].data["ProductTest"] || [], "nproducttestcode", "sproducttestdetail", undefined, undefined, true);
                            productTestList = productTest.get("OptionList");
                            //selectedRecord['npaymentcode'] = { "value": response[0].data[0]["npaymentcode"], "label": response[0].data[0]["spaymentmode"] }
                            selectedRecord['nproducttestcode'] = { "value": response[3].data["ProductTest"][0]["nproducttestcode"], "label": response[3].data["ProductTest"][0]["sproducttestdetail"] }
                           // selectedRecord['ncurrencycode'] = { "value": response[1].data["Currency"][0]["ncurrencycode"], "label": response[1].data["Currency"][0]["ssymbol"] }
                            selectedRecord["dquotationtodate"] = rearrangeDateFormat(invoiceParam.userInfo, response[1].data["dquotationtodate"]);
                            customerList = response[2].data;
                            patientList = response[4].data;
                            selectedRecord["totalfright"] = invoiceParam.quotation.Totalfrightchanges;
                            selectedRecord["totalpackage"] = invoiceParam.quotation.PackageDetails;
                            selectedRecord["Orderrefno"] = invoiceParam.quotation.Orderrefno;
                            selectedRecord["Packdoref"] = invoiceParam.quotation.Packdoref;
                            selectedRecord["Packrefdate"] = invoiceParam.quotation.Packrefdate;
                            selectedRecord["nuserrole"] = invoiceParam.userInfo.nuserrole;
                            selectedRecord["producttestcode"] = invoiceParam.quotation.producttestcode;
                            selectedRecord["invoicepatientfield"] = invoiceParam.quotation.PatientDetails;
                            schemes = constructOptionList(response[5].data || [], "nschemecode", "sschemename", undefined, undefined, true);
                            schemeList = schemes.get("OptionList");
                            selectedRecord['nschemecode'] = { "value": -1, "label": 'No Schemes' }
                            operation = 'Add';
                            openModal = true;
                        }
                    }
                    if (invoiceParam.operation === "update") {
                       // if (invoiceParam.userInfo.nuserrole === -1) {
                            amountinwords = response[6].data["selectedInvoice"][0].jsondata["TotalAmountInWords"];
                            selectedRecord["scustomername"] = response[6].data["selectedInvoice"][0].jsondata["CustomerName"];
                            selectedRecord["semailid"] = response[6].data["selectedInvoice"][0].jsondata["EmailId"];
                            selectedRecord["scustgst"] = response[6].data["selectedInvoice"][0].jsondata["CustomerGST"];
                            selectedRecord["scustomertypename"] = response[6].data["selectedInvoice"][0].jsondata["CustomerType"];
                            selectedRecord["scustomeraddress"] = response[6].data["selectedInvoice"][0].jsondata["Address"];
                            selectedRecord["sphone"] = response[6].data["selectedInvoice"][0].jsondata["PhoneNo"];
                            selectedRecord["scustomerreference1"] =  response[6].data["selectedInvoice"][0].jsondata["MobileNo"];
                            selectedRecord["scustomerreference2"] =  response[6].data["selectedInvoice"][0].jsondata["ContactPerson"];
                            selectedRecord["spatientname"] = response[6].data["selectedInvoice"][0].jsondata["PatientName"];
                            selectedRecord["sdob"] = response[6].data["selectedInvoice"][0].jsondata["PDOB"];
                            selectedRecord["sage"] = response[6].data["selectedInvoice"][0].jsondata["PAge"];
                            selectedRecord["sfathername"] = response[6].data["selectedInvoice"][0].jsondata["PFatherName"];
                            selectedRecord["smobileno"] = response[6].data["selectedInvoice"][0].jsondata["PMobileNo"];
                            selectedRecord["semail"] = response[6].data["selectedInvoice"][0].jsondata["PEmail"];
                            selectedRecord["npatientid"] = response[6].data["selectedInvoice"][0].jsondata["PatientId"];
                            selectedRecord["ncustomercode"] = response[6].data['selectedInvoice'][0]['ncustomercode'];
                            selectedRecord["nschemecode"] = response[6].data["selectedInvoice"][0]["sschemename"] ? { "value": response[6].data["selectedInvoice"][0]["nschemecode"], "label": response[6].data["selectedInvoice"][0]["sschemename"] } : "";
                            selectedRecord["dquotationdate"] = rearrangeDateFormat(invoiceParam.userInfo, response[6].data["selectedInvoice"][0]["squotationdate"]);
                            selectedRecord["dinvoicedate"] = rearrangeDateFormat(invoiceParam.userInfo, response[6].data["selectedInvoice"][0]["sinvoicedate"]);
                            selectedRecord["dorderreferencedate"] = rearrangeDateFormat(invoiceParam.userInfo, response[6].data["selectedInvoice"][0]["sorderreferencedate"]);
                            selectedRecord["dpackdocrefdate"] = rearrangeDateFormat(invoiceParam.userInfo, response[6].data["selectedInvoice"][0]["spackdocrefdate"]);
                            selectedRecord["dprocessdate"] = rearrangeDateFormat(invoiceParam.userInfo, response[6].data["selectedInvoice"][0]["sprocessdate"]);
                            selectedRecord["dmodifieddate"] = rearrangeDateFormat(invoiceParam.userInfo, response[6].data["selectedInvoice"][0]["smodifieddate"]);
                            selectedRecord["sprocessno"] = response[6].data["selectedInvoice"][0]["sprocessno"] ? response[6].data["selectedInvoice"][0]["sprocessno"] : "";
                            selectedRecord["spackdoctrefno"] = response[6].data["selectedInvoice"][0]["spackdoctrefno"] ? response[6].data["selectedInvoice"][0]["spackdoctrefno"] : "";
                            selectedRecord["ntotalamount"] = response[6].data["selectedInvoice"][0]["ntotalamount"] ? response[6].data["selectedInvoice"][0]["ntotalamount"] : "";
                            selectedRecord["ntotaltaxamount"] = response[6].data["selectedInvoice"][0]["ntotaltaxamount"] ? response[6].data["selectedInvoice"][0]["ntotaltaxamount"] : "";
                            selectedRecord["ntotalfrightcharges"] = response[6].data["selectedInvoice"][0]["ntotalfrightcharges"] ? response[6].data["selectedInvoice"][0]["ntotalfrightcharges"] : "";
                            selectedRecord["spackagerefdetails"] = response[6].data["selectedInvoice"][0]["spackagerefdetails"] ? response[6].data["selectedInvoice"][0]["spackagerefdetails"] : "";
                            selectedRecord["ninvoiceseqcode"] = response[6].data["selectedInvoice"][0]["ninvoiceseqcode"] ? response[6].data["selectedInvoice"][0]["ninvoiceseqcode"] : "";
                            selectedRecord["sprojectcode"] = response[6].data["selectedInvoice"][0]["sprojectcode"] ? response[6].data["selectedInvoice"][0]["sprojectcode"] : "";
                            paymentMode = constructOptionList(response[0].data || [], "npaymentcode", "spaymentmode", undefined, undefined, true);
                            paymentDetailList = paymentMode.get("OptionList");
                            currencyType = constructOptionList(response[1].data["Currency"] || [], "ncurrencycode", "ssymbol", undefined, undefined, true);
                            currencyTypeList = currencyType.get("OptionList");
                            schemes = constructOptionList(response[4].data || [], "nschemecode", "sschemename", undefined, undefined, true);
                            schemeList = schemes.get("OptionList");
                            productTest = constructOptionList(response[3].data["ProductTest"] || [], "nproducttestcode", "sproducttestdetail", undefined, undefined, true);
                            productTestList = productTest.get("OptionList");
                            paymentDetailList.map((item) => {
                                if (item.label === response[6].data["selectedInvoice"][0]["spaymentdetails"]) {
                                    selectedRecord['npaymentcode'] = { "value": item.value, "label": item.label }
                                }
                            })
                            currencyTypeList.map((item) => {
                                if (item.value === response[6].data["selectedInvoice"][0]["ncurrencytype"]) {
                                    selectedRecord['ncurrencycode'] = { "value": item.value, "label": item.label }
                                }

                            })
                            productTestList.map((item) => {
                                if (item.value === response[6].data["selectedInvoice"][0]["nproducttestcode"]) {
                                    selectedRecord['nproducttestcode'] = { "value": item.value, "label": item.label }
                                }
                            })
                            customerList = response[2].data;
                            patientList = response[6].data;
                            response[6].data["selectedProduct"].map((item) => {
                                item["testList"] = item.jsondata1;
                                productList.push(item);
                            })
                            openModal = true;
                            operation = 'Edit';
                            selectedRecord["invoicepatientfield"] = 3;
                        //} else {
                            amountinwords = response[6].data["selectedInvoice"][0].jsondata["TotalAmountInWords"];
                            selectedRecord["amountInWord"] = response[6].data["selectedInvoice"][0].jsondata["TotalAmountInWords"];
                            selectedRecord["scustomername"] = response[6].data["selectedInvoice"][0].jsondata["CustomerName"];
                            selectedRecord["semailid"] = response[6].data["selectedInvoice"][0].jsondata["EmailId"];
                            selectedRecord["scustgst"] = response[6].data["selectedInvoice"][0].jsondata["CustomerGST"];
                            selectedRecord["scustomertypename"] = response[6].data["selectedInvoice"][0].jsondata["CustomerType"];
                            selectedRecord["scustomeraddress"] = response[6].data["selectedInvoice"][0].jsondata["Address"];
                            selectedRecord["sphone"] = response[6].data["selectedInvoice"][0].jsondata["PhoneNo"];
                            selectedRecord["scustomerreference1"] =  response[6].data["selectedInvoice"][0].jsondata["MobileNo"];
                            selectedRecord["scustomerreference2"] =  response[6].data["selectedInvoice"][0].jsondata["ContactPerson"];
                            selectedRecord["ncustomercode"] = response[6].data['selectedInvoice'][0]['ncustomercode'];
                            selectedRecord["sprocessno"] = response[6].data["selectedInvoice"][0]["sprocessno"] ? response[6].data["selectedInvoice"][0]["sprocessno"] : "";
                            selectedRecord["dquotationdate"] = rearrangeDateFormat(invoiceParam.userInfo, response[6].data["selectedInvoice"][0]["squotationdate"]);
                            selectedRecord["dinvoicedate"] = rearrangeDateFormat(invoiceParam.userInfo, response[6].data["selectedInvoice"][0]["sinvoicedate"]);
                            selectedRecord["dorderreferencedate"] = rearrangeDateFormat(invoiceParam.userInfo, response[6].data["selectedInvoice"][0]["sorderreferencedate"]);
                            selectedRecord["dpackdocrefdate"] = rearrangeDateFormat(invoiceParam.userInfo, response[6].data["selectedInvoice"][0]["spackdocrefdate"]);
                            selectedRecord["dprocessdate"] = rearrangeDateFormat(invoiceParam.userInfo, response[6].data["selectedInvoice"][0]["sprocessdate"]);
                            selectedRecord["dmodifieddate"] = rearrangeDateFormat(invoiceParam.userInfo, response[6].data["selectedInvoice"][0]["smodifieddate"]);
                            selectedRecord["sorderreferenceno"] = response[6].data["selectedInvoice"][0]["sorderreferenceno"] ? response[6].data["selectedInvoice"][0]["sorderreferenceno"] : "";
                            selectedRecord["spackdoctrefno"] = response[6].data["selectedInvoice"][0]["spackdoctrefno"] ? response[6].data["selectedInvoice"][0]["spackdoctrefno"] : "";
                            selectedRecord["ntotalamount"] = response[6].data["selectedInvoice"][0]["ntotalamount"] ? response[6].data["selectedInvoice"][0]["ntotalamount"] : "";
                            selectedRecord["ntotaltaxamount"] = response[6].data["selectedInvoice"][0]["ntotaltaxamount"] ? response[6].data["selectedInvoice"][0]["ntotaltaxamount"] : "";
                            selectedRecord["ntotalfrightcharges"] = response[6].data["selectedInvoice"][0]["ntotalfrightcharges"] ? response[6].data["selectedInvoice"][0]["ntotalfrightcharges"] : "";
                            selectedRecord["spackagerefdetails"] = response[6].data["selectedInvoice"][0]["spackagerefdetails"] ? response[6].data["selectedInvoice"][0]["spackagerefdetails"] : "";
                            selectedRecord["ninvoiceseqcode"] = response[6].data["selectedInvoice"][0]["ninvoiceseqcode"] ? response[6].data["selectedInvoice"][0]["ninvoiceseqcode"] : "";
                            selectedRecord["sprojectcode"] = response[6].data["selectedInvoice"][0]["sprojectcode"] ? response[6].data["selectedInvoice"][0]["sprojectcode"] : "";
                            selectedRecord["totalfright"] = invoiceParam.quotation.Totalfrightchanges;
                            selectedRecord["totalpackage"] = invoiceParam.quotation.PackageDetails;
                            selectedRecord["Orderrefno"] = invoiceParam.quotation.Orderrefno;
                            selectedRecord["Packdoref"] = invoiceParam.quotation.Packdoref;
                            selectedRecord["Packrefdate"] = invoiceParam.quotation.Packrefdate;
                            selectedRecord["producttestcode"] = invoiceParam.quotation.producttestcode;
                            selectedRecord["nuserrole"] = invoiceParam.userInfo.nuserrole;
                            selectedRecord["invoicepatientfield"] = invoiceParam.quotation.PatientDetails;
                            selectedRecord["nschemecode"] = response[6].data["selectedInvoice"][0]["sschemename"] ? { "value": response[6].data["selectedInvoice"][0]["nschemecode"], "label": response[6].data["selectedInvoice"][0]["sschemename"] } : "";
                            paymentMode = constructOptionList(response[0].data || [], "npaymentcode", "spaymentmode", undefined, undefined, true);
                            paymentDetailList = paymentMode.get("OptionList");
                            currencyType = constructOptionList(response[1].data["Currency"] || [], "ncurrencycode", "ssymbol", undefined, undefined, true);
                            currencyTypeList = currencyType.get("OptionList");
                            paymentDetailList.map((item) => {
                                if (item.label === response[6].data["selectedInvoice"][0]["spaymentdetails"]) {
                                    selectedRecord['npaymentcode'] = { "value": item.value, "label": item.label }
                                }
                            })
                            currencyTypeList.map((item) => {
                                if (item.value === response[6].data["selectedInvoice"][0]["ncurrencytype"]) {
                                    selectedRecord['ncurrencycode'] = { "value": item.value, "label": item.label }
                                }
                            })
                            productTest = constructOptionList(response[3].data["ProductTest"] || [], "nproducttestcode", "sproducttestdetail", undefined, undefined, true);
                            productTestList = productTest.get("OptionList");
                            productTestList.map((item) => {
                                if (item.value === response[6].data["selectedInvoice"][0]["nproducttestcode"]) {
                                    selectedRecord['nproducttestcode'] = { "value": item.value, "label": item.label }
                                }
                            })
                            schemes = constructOptionList(response[5].data || [], "nschemecode", "sschemename", undefined, undefined, true);
                            schemeList = schemes.get("OptionList");
                            customerList = response[2].data;
                            patientList = response[4].data;
                           // response[6].data["selectedProduct"].map((item) => {
                              // item["testList"] = item.jsondata1;
                               // productList.push(item);
                            //})
                            openModal = true;
                            operation = 'Edit';
                       // }
                    } else if (invoiceParam.operation === "delete") {
                        masterData = response[0].data;
                        openModal = false;
                    }

                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {
                            amountinwords, productEditList: productList,
                            currencyTypeList,
                            productTestList,
                            paymentDetailList,
                            openModal, operation,
                            selectedRecord,
                            customerList, masterData,
                            patientList,
                            productList,
                            schemes,
                            schemeList
                        }
                    });
                } else {
                    toast.warn(intl.formatMessage({ id: "IDS_FILLTHEDATA" }))
                }
            }
            )
    }
}

export function getInvoiceDetail(invoicelist, userInfo, masterData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("invoiceheader/getSeletedInvoice", { invoiceid: invoicelist.ninvoiceseqcode, userinfo: userInfo })
            .then(response => {
                masterData = { ...masterData, ...response.data };
                const selectedRecord = response.data.selectedInvoice;
                selectedRecord["Discount"] = response.data.selectedInvoice.Discount;
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

export function addQuotationService(ncustomercode, userInfo,quotation) {
    return function (dispatch) {
        let urlArray = [];
        const customerData = rsapi().post("invoiceheader/getQuotationTab", { ncustomercode: ncustomercode, userInfo: userInfo,quotationno:quotation });
        urlArray = [customerData];
        dispatch(initRequest(true));
        Axios.all(urlArray)

            .then(response => {
                let addQuotationList = response[0].data["quotationList"];
                let productSortedList = response[0].data["productList"];
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false,
                        addQuotationList,
                        openModal: true,
                        nneedproducttab: false,
                        openproductTab: true,
                        screenName: 'Quotation',
                        productSortedList

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
}

export function addArno(scustomername, userInfo,arno) {
    return function (dispatch) {
        let urlArray = [];
        const customerData = rsapi().post("invoiceheader/getArnoTab", { scustomername: scustomername, userInfo: userInfo ,arno:arno});
        urlArray = [customerData];
        dispatch(initRequest(true));
        Axios.all(urlArray)
            .then(response => {
                const addArnoList = response[0].data;
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false,
                        addArnoList,
                        openModal: true,
                        nneedproducttab: false,
                        openproductTab: true,
                        screenName: 'Arno'

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
}

export function getFilterServiceInvoice(filterValue, userInfo, selectedRecord) {
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

export function getPatientFilterSearch(filterValue, userInfo, selectedRecord) {
    return function (dispatch) {
        const patientSearchField = rsapi().post("invoiceheader/getSearchPatientFieldData", { npatientno: filterValue, userinfo: userInfo });
        let urlArray = [patientSearchField];
        Axios.all(urlArray)
            .then(response => {
                selectedRecord["spatientname"] = response[0].data[0]["spatientname"];
                selectedRecord["sdob"] = response[0].data[0]["sdob"];
                selectedRecord["sage"] = response[0].data[0]["sage"];
                selectedRecord["sfathername"] = response[0].data[0]["sfathername"];
                selectedRecord["smobileno"] = response[0].data[0]["smobileno"];
                selectedRecord["semail"] = response[0].data[0]["semail"];
                selectedRecord["npatientid"] = response[0].data[0]["npatientid"];

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

export function getProductSetInvoice(filterValue, userInfo, selectedRecord, ncustomercode, nschemecode) {
    return function (dispatch) {
        const productTypeCombo = rsapi().post("invoiceheader/getProducts", { products: filterValue, userinfo: userInfo, ncustomercode, nschemecode: nschemecode });
        let urlArray = [productTypeCombo];
        let selectedRecordProduct = {};
        let testList = [];
        Axios.all(urlArray)
            .then(response => {
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
                selectedRecordProduct["nschemecode"] = response[0].data["selectedProduct"]["nschemecode"];
                testList = response[0].data["selectedTest"] !== undefined ? response[0].data["selectedTest"].map(e => { return { ...e, selected: true } }) : testList;
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        selectedRecordProduct, selectedRecord,
                        selectedTest: testList,
                        openModal: true
                    }
                });
            }
            )
    }
}

export function getProductForInvoice(productListInvoice) {
    return function (dispatch) {
        let testList = [];
        if (productListInvoice.Displayname == 'Product') {
            const productMasterList = rsapi().post("/invoiceheader/getProductforInvoice", {
                userinfo: productListInvoice.userInfo
                , ncustomercode: productListInvoice.selectedRecord.ncustomercode,
                nschemecode: productListInvoice.selectedRecord.nschemecode.value,
                ninvoiceproductitemdetailscode: productListInvoice.selectedRecord.ninvoiceproductitemdetailscode,
                productlist:productListInvoice.productlist
            });
            let urlArray = [productMasterList];
            Axios.all(urlArray)
                .then(response => {
                    const productMasterList = response[0].data.filteredList;
                    const discount = response[0].data.Discount;

                    const updatedSelectedRecord = {
                        ...productListInvoice.selectedRecord,
                        Discount: discount,
                    };
                    testList = response[0].data.selectedTest.length !== 0 && productListInvoice.selectedRecord.ninvoiceproductitemdetailscode !== 0 ? response[0].data.selectedTest : productListInvoice.testList;
                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {
                            productMasterList, selectedRecord: updatedSelectedRecord,
                            openModal: true,
                            selectedTest: testList
                        }
                    });
                });
        }
    }
}

export const fetchInvoiceProductRecord = (fetchRecordParam) => {
    return (dispatch) => {
        if (fetchRecordParam.masterData[0].ntransactionstatus === transactionStatus.APPROVED) {
            toast.warn(intl.formatMessage({ id: "IDS_SELECTDRAFTRECORDFOREDIT" }))
        } else {
            dispatch(initRequest(true));
            let urlArray = [];
            let testList = [];
            let selectedRecordProduct = {};
            let selectedRecord = {};
            let productMasterList = [];
            const productMaster = rsapi().post("/invoiceheader/getProductforInvoice", { userinfo: fetchRecordParam.fetchRecord.userInfo, ncustomercode: fetchRecordParam.masterData[0].ncustomercode, nschemecode: fetchRecordParam.masterData[0].nschemecode, ninvoiceproductitemdetailscode: fetchRecordParam.fetchRecord.editRow.ninvoiceproductitemdetailscode });
            const url = rsapi().post("/invoiceheader/getActiveInvoiceById", {
                "InvoiceId": fetchRecordParam.masterData[0].ninvoiceseqcode, "ProductName": fetchRecordParam.fetchRecord.editRow.sproductname,
                "Quantity": fetchRecordParam.fetchRecord.editRow.nquantity, ProductID: fetchRecordParam.fetchRecord.editRow.ninvoiceproductitemdetailscode,
                "userInfo": fetchRecordParam.fetchRecord.userInfo
            },
                { ProductID: fetchRecordParam.fetchRecord.editRow.ninvoiceproductitemdetailscode });
            urlArray = [productMaster, url];
            Axios.all(urlArray)
                .then(response => {
                    
                    const responseData = JSON.parse(response[1].config.data); // Parse the JSON string
                    selectedRecordProduct["sproductname"] = responseData.ProductName; // Assign value
                    
                    selectedRecord["nunit"] = response[1].data[0].nunit;
                    selectedRecord["nquantity"] = response[1].data[0].nquantity;
                    selectedRecord["ncost"] = response[1].data[0].ncost;
                    selectedRecord["ndiscountpercentage"] = response[1].data[0].ndiscountpercentage;
                    selectedRecordProduct["ntaxvalue"] = response[1].data[0].ntaxpercentage;
                    selectedRecordProduct["ntaxamount"] = response[1].data[0].ntaxamount;
                    selectedRecordProduct["staxname"] = response[1].data[0].staxname;
                    selectedRecordProduct["noverallcost"] = response[1].data[0].noverallcost;
                    selectedRecord["ninvoiceproductitemdetailscode"] = response[1].data[0].ninvoiceproductitemdetailscode
                    selectedRecord["slno"] = response[1].data[0].nserialno;
                    selectedRecordProduct["ntotalcost"] = response[1].data[0].ntotalcost
                    selectedRecord["sinvoiceseqno"] = response[1].data[0].sinvoiceseqno
                    selectedRecordProduct["nproductcode"] = response[1].data[0].nproductcode
                    selectedRecordProduct["previousntaxvalue"] = response[1].data[0].ntaxvalue;
                    selectedRecordProduct["previoussproductname"] = response[1].data[0].sproductname;
                    selectedRecordProduct["previousntaxamount"] = response[1].data[0].ntaxamount;
                    selectedRecordProduct["previousnproductcode"] = response[1].data[0].nproductcode;
                    selectedRecordProduct["nindirectax"] = response[1].data[0].nindirectax;
                    selectedRecordProduct["sindirectaxname"] = response[1].data[0].sindirectaxname;
                    selectedRecordProduct["squotationseqno"] = response[1].data[0].squotationseqno;
                    productMasterList = response[0].data.filteredList;
                    selectedRecord["Discount"] = response[0].data.Discount;

                    const updatedSelectedRecords = {
                        ...fetchRecordParam.masterData,
                        Discount: response[0].data.Discount
                    };

                    if (response[0].data.selectedTest.length !== 0) {
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
                            outside: true, productMasterList,
                            updatedSelectedRecords,
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
                        toast.error(intl.formatMessage({ id: error.message }));
                    } else {
                        toast.warn(intl.formatMessage({ id: error.response.data }));
                    }
                })
        }
    }
}

export const deleteRecordProduct = (deleteParam) => {
    return (dispatch) => {
        if (deleteParam.masterData.selectedInvoice[0].ntransactionstatus === transactionStatus.APPROVED) {
            toast.warn(intl.formatMessage({ id: "IDS_SELECTDRAFTRECORDFORDELETE" }))
        } else {
            let urlArray = [];
            let parameter = {};
            if (!deleteParam.deleteList) {
                parameter["InvoiceId"] = deleteParam.masterData.selectedInvoice[0].sinvoiceno;
                parameter["ninvoiceproductitemdetailscode"] = deleteParam.selectedRecord.ninvoiceproductitemdetailscode;
                parameter["userinfo"] = deleteParam.userInfo;
            } else {
                parameter["InvoiceSeqNo"] = deleteParam.deleteList[0].sinvoiceseqno;
                parameter["ninvoiceproductitemdetailscode"] = deleteParam.deleteList[0].ninvoiceproductitemdetailscode;
                parameter["userinfo"] = deleteParam.userInfo;
                parameter["slno"] = deleteParam.deleteList[0].slno;
            }
            const paymentDetailCombo = rsapi().post("/invoiceheader/deleteProductInvoiceHeader", { parameter })
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
                        toast.error(intl.formatMessage({ id: error.message }));
                    } else {
                        toast.warn(intl.formatMessage({ id: error.response.data }));
                    }
                })
        }
    }
}

export const getInvoiceArnoService = (Arnonrecord, productValue, selectedRecord, userInfo) => {
    return (dispatch) => {
        dispatch(initRequest(true));
        const url = rsapi().post("/invoiceheader/getInvoiceProductArno", { "Arno": Arnonrecord, userinfo: userInfo,selectedRecord });
        let urlArray = [url];
        let productListValue = [];
        let slno = {};
        if (productValue) {
            productValue.map((productItem) => {
                productListValue.push(productItem);
            })
        }
        slno = productValue.length !== 0 ? Math.max(...productValue.map(slnoList => slnoList.slno)) : 0;
        slno = (slno + 1);
        Axios.all(urlArray)
            .then(response => {
                if (response[0].data["ProductDetails"] !== undefined) {
                    response[0].data["ProductDetails"].map((productItem) => {
                        productItem.slno = slno;
                        productItem.testList.map((testItem) => {testItem["selected"] = true;})
                        productItem["testList"] = { TestList:productItem.testList };
                        productListValue.push(productItem);
                        slno = (slno + 1);
                    })
                    if (selectedRecord.ncurrencycode && selectedRecord.ncurrencycode.label !== undefined) {
                        selectedRecord["ntotalamount"] = selectedRecord.ncurrencycode.label + ' ' + response[0].data["ntotalamount"];
                        selectedRecord["ntotaltaxamount"] = selectedRecord.ncurrencycode.label + ' ' + response[0].data["ntotaltaxamount"];
                    } else {
                        // Display the toast warning if the currency label is undefined
                        toast.error(" Add payment and currency details");
                    }
                    dispatch({
                        type: DEFAULT_RETURN, payload: {
                            loading: false,
                            productList: productListValue,
                            amountinwords: response[0].data["TotalAmountInWords"],
                            selectedRecord
                        }
                    })
                } else {
                    dispatch({
                        type: DEFAULT_RETURN, payload: {
                            loading: false
                        }
                    })
                    toast.info("No Products");
                }
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
                    toast.error(intl.formatMessage({ id: error.message }));
                } else {
                    toast.warn(intl.formatMessage({ id: error.response.data }));
                }
            })
    }
}

export const reportGeneratorInvoice = (inputParam) => {
    return (dispatch) => {
        dispatch(initRequest(true));
        rsapi().post("invoiceheader/invoiceReportGenerate", {
            ...inputParam
        })
            .then(response => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false,
                    }
                });
                
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


export const reloadInvoiceData = (param) => {
    return (dispatch) => {
        dispatch(initRequest(true));
        let masterData = param.masterData;
        return rsapi().post("invoiceheader/getInvoiceHeader", { userinfo: param.userInfo,...param.inputData})
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

export const updateUsercodeForReport = (inputParam) => {
    return (dispatch) => {
        dispatch(initRequest(true));
        rsapi().post("invoiceheader/updateUsercodeForReport", {
            userinfo: inputParam.userinfo, ninvoiceseqcode: inputParam.ninvoiceseqcode
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

export function getTotalAmountInWords1(totalAmount, userInfo) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("/invoiceheader/getActivecurrencyvalue", { ntotalamount: totalAmount, userinfo: userInfo })
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


export function getFilteredRecord(inputData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("invoiceheader/getFilteredRecord", { ...inputData.inputData })
            .then(response => {
                const { fromDate, toDate } = response.data;
                let masterData = {
                    ...inputData.masterData,
                    ...response.data,
                    fromDate,                // ✅ keep filtered FromDate
                    toDate,                  // ✅ keep filtered ToDate
                    breadCrumbFrom: fromDate,
                    breadCrumbTo: toDate,
                    ViewType:inputData.selectedInvoice
                }
   
                let respObject = {
                    
                    masterData,
                    loading: false,
                    showFilter: false,
                }
       
                dispatch({ type: DEFAULT_RETURN, payload: { ...respObject ,skip:0,take:20} })

            })
            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } });
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
                } else if (error.response) {
                    // Server responded with a status code
                    if (error.response.status === 500) {
                        toast.error(error.message);
                    } else {
                        toast.warn(error.response.data);
                    }
                } else if (error.request) {
                    // Request was made but no response was received
                    toast.error("No response from server. Please check your network connection.");
                } else {
                    // Something happened in setting up the request
                    toast.error("An unexpected error occurred: " + error.message);
                }
            });
            
    }
}

export const costUpdateCost = (productcode,cost) => {
    return (dispatch) => {
        rsapi().post("invoiceheader/costUpdateCost", {
            nproductcode: productcode, ncost: cost
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
//Added by sonia on 16th Oct 2025 for jira id:SWSM-104
export function sendReportByMailInvoice(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("invoiceheader/sendReportByMail", inputParam.inputData)
            .then(response => {
                const returnStr = response.data["rtn"];
                if (returnStr.toUpperCase() === "SUCCESS") {
                    toast.success(intl.formatMessage({ id: "IDS_MAILINITIATED" }));
                } else {
                    toast.warn(intl.formatMessage({ id: response.data.rtn }));
                }
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        loading: false,
                        loadEsign: false,
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