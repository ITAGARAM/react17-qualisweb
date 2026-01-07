import rsapi from '../rsapi';
import { DEFAULT_RETURN, UN_AUTHORIZED_ACCESS } from './LoginTypes';
import { toast } from 'react-toastify';
import Axios from 'axios';
import { initRequest } from './LoginAction';
import { constructOptionList, sortByField } from '../components/CommonScript';
import { intl } from '../components/App';
import { transactionStatus, attachmentType } from '../components/Enumeration';

export function getCustomerComboService(customerAddParam) {
    return function (dispatch) {
        if (customerAddParam.operation === "create" || customerAddParam.operation === "update") {
            const customerService = rsapi().post("invoicecustomermaster/getCustomerMaster", { userInfo: customerAddParam.userInfo });
            let urlArray = [];
            let selectedRecord = {};
            if (customerAddParam.operation === "create") {
                urlArray = [customerService];
            } else {
                const customerById = rsapi().post("invoicecustomermaster/getActiveInvoiceCustomerMasterById", { [customerAddParam.primaryKeyField]: customerAddParam.masterData.selectedCustomer[customerAddParam.primaryKeyField], "userinfo": customerAddParam.userInfo });
                urlArray = [customerById];
                selectedRecord = customerAddParam.primaryKeyValue;
            }
            dispatch(initRequest(true));
            Axios.all(urlArray)
                .then(response => {
                    let customerTypeCombo = [];
                    let selectedRecord = {};
                    if (customerAddParam.operation === "update") {

                      
                        selectedRecord["nuserrole"] = customerAddParam.userInfo.nuserrole;
                        selectedRecord = response[0].data.selectedCustomer;
                        selectedRecord['ntypecode'] = { "value": response[0].data.selectedCustomer.ntypecode, "label": response[0].data.selectedCustomer.scustomertypename }
                        selectedRecord["customerpoc"] = customerAddParam.masterData.customerpoc;
                        selectedRecord["customershipping"] = customerAddParam.masterData.customershipping;
                        selectedRecord["Customerreference2"] = customerAddParam.masterData.Customerreference2;
                        selectedRecord["Customerreference"] = customerAddParam.masterData.Customerreference;
                        selectedRecord["Projectreference"] = customerAddParam.masterData.Projectreference;
                        selectedRecord["Projectreference2"] = customerAddParam.masterData.Projectreference2;
                        selectedRecord["Otherdetails"] = customerAddParam.masterData.Otherdetails;
                        selectedRecord["Tinno"] = customerAddParam.masterData.Tinno;
                        selectedRecord["Accountdetails"] = customerAddParam.masterData.Accountdetails;   
                                    
                                    
                           // selectedRecord['scustomertypename'] = { "value": response[0].data.selectedCustomer.scustomertypename, "label": response[0].data.selectedCustomer.scustomertypename }
                       
                          // selectedRecord["nsameasaddress"] = transactionStatus.YES;

                            
                         

                           // selectedRecord['scustomertypename'] = response[0].data.selectedCustomer.scustomertypename ;
                       

                    }
                    else if (customerAddParam.operation === "create") {
                       
                            selectedRecord["ndiscountavailable"] = transactionStatus.YES;
                            selectedRecord["nuserrole"] = customerAddParam.userInfo.nuserrole;
                       
                           
                            selectedRecord["nsameasaddress"] = transactionStatus.YES;
                            selectedRecord["customerpoc"] = response[0].data.customerpoc;
                            selectedRecord["nuserrole"] = customerAddParam.userInfo.nuserrole;
                            selectedRecord["customershipping"] = response[0].data.customershipping;
                            selectedRecord["Customerreference2"] = response[0].data.Customerreference2;
                            selectedRecord["Customerreference"] = response[0].data.Customerreference;
                            selectedRecord["Projectreference"] = response[0].data.Projectreference;
                            selectedRecord["Projectreference2"] = response[0].data.Projectreference2;
                            selectedRecord["Otherdetails"] = response[0].data.Otherdetails;
                            selectedRecord["Tinno"] = response[0].data.Tinno;
                            selectedRecord["Accountdetails"] = response[0].data.Accountdetails;
                            selectedRecord = response[0].data.selectedCustomer;
                        
                        const customerTypeList = constructOptionList(response[0].data.customerTypeName || [], "ntypecode",
                            "scustomertypename", undefined, undefined, undefined);
                        customerTypeCombo = customerTypeList.get("OptionList");
                    }
                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {
                            customerTypeFinalList: customerTypeCombo,
                            openModal: true,
                            operation: customerAddParam.operation,
                            screenName: "IDS_CUSTOMERMASTER",
                            ncontrolCode: customerAddParam.ncontrolCode, loading: false,
                            selectedRecord,
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
        else {
            toast.warn(intl.formatMessage({
                id: "IDS_PRODUCTMASTERNOTAVAILABLE"
            }))
        }

    }
}

export function getCustomerDetail(cusmtomermasterlist, userInfo, masterData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("invoicecustomermaster/getSelectedCustomerDetail", { ncustomercode: cusmtomermasterlist.ncustomercode, userinfo: userInfo })
            .then(response => {
                masterData = { ...masterData, ...response.data };
                //sortByField(masterData, 'ascending', 'scustomername');
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData, operation: null, modalName: undefined,
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

export function invoicecheckfield(nuserrolecode, data, userInfo, selectedRecord) {
    return function (dispatch) {
        dispatch(initRequest(true));
         rsapi().post("/invoicepreferencesetting/updateControlRights", { nuserrolecode: nuserrolecode, "userinfo": userInfo })
            .then(response => {
                const masterData = { ...data, ...response.data }
                sortByField(masterData, 'ascending', 'scustomername');
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData, loading: false, openModal: true, loadEsign: false, selectedRecord, skip: undefined, take: undefined
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

export const addCustomerFile = (inputParam) => {
    return (dispatch) => {
        dispatch(initRequest(true));
        let urlArray = [rsapi().post("/linkmaster/getLinkMaster", {
            userinfo: inputParam.userInfo
        })];

        if (inputParam.operation === "update") {
            urlArray.push(rsapi().post("/invoicecustomermaster/editCustomerFile", {
                userinfo: inputParam.userInfo,
                customerfile: inputParam.selectedRecord
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
                        ncustomerfilecode: editObject.ncustomerfilecode,
                        nattachmenttypecode: editObject.nattachmenttypecode,
                        nlinkcode,
                    };
                }
                else {
                    selectedRecord = {
                        nattachmenttypecode: response[0].data.AttachmentType.length > 0 ?
                            response[0].data.AttachmentType[0].nattachmenttypecode : attachmentType.FTP,
                        nlinkcode: defaultLink.length > 0 ? defaultLink[0] : "",
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