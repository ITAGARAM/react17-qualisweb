import rsapi from '../rsapi';
import { DEFAULT_RETURN, UN_AUTHORIZED_ACCESS } from './LoginTypes';
import { constructOptionList, sortData } from '../components/CommonScript'//, getComboLabelValue, searchData
import { toast } from 'react-toastify';
import Axios from 'axios';
import { initRequest } from './LoginAction';
import { intl } from '../components/App';
import { transactionStatus, attachmentType } from '../components/Enumeration';

export function getSupplierDetail(supplier, userInfo, masterData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("supplier/getSupplier", {
            nsuppliercode: supplier.nsuppliercode,
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

                    toast.warn(intl.formatMessage({ id: error.response }));
                }

            })
    }
}

export function getSupplierComboService(screenName, operation, primaryKeyName, primaryKeyValue, masterData, userInfo, ncontrolCode) {
    return function (dispatch) {
      
        if (operation === "create" || operation === "update") {


            const countryService = rsapi().post("country/getCountry", { userinfo: userInfo });



            let urlArray = [];

            if (operation === "create") {



                urlArray = [countryService];

            }

            else {

                const supplierById = rsapi().post("supplier/getActiveSupplierById", { [primaryKeyName]: primaryKeyValue, "userinfo": userInfo });//this.props.Login.userInfo



                urlArray = [countryService, supplierById];

            }
            Axios.all(urlArray)
                .then(response => {
let napprovalstatus=[];
napprovalstatus=transactionStatus.DRAFT;
                    let country = [];

                    let selectedRecord = {};

                    if (operation === "update") {
                        selectedRecord = response[1].data;
                        napprovalstatus=response[1].data.napprovalstatus;
                         country.push({ "value": response[1].data["ncountrycode"], "label": response[1].data["scountryname"] });


                  selectedRecord["ncountrycode"] = country[0];


                    }
                    else {
                        selectedRecord["ntransactionstatus"] = 1;


                    }
                    if(napprovalstatus===transactionStatus.DRAFT){

                    


                    dispatch({
                        type: DEFAULT_RETURN, payload: {
                            countryList: response[0].data || [],

                            operation, screenName, selectedRecord, openModal: true,
                            ncontrolCode, loading: false
                        }
                    });
                }
                else{
                    toast.warn(intl.formatMessage({ id: "IDS_SELECTDRAFTRECORDTOEDIT" }));

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
        else {
            //toast.warn(this.props.formatMessage({ id: masterData.SelectedSupplier.stranstatus }));
            toast.warn(intl.formatMessage({ id: "IDS_SELECTDRAFTRECORDTOEDIT" }));
        }
    }
}


export function getSupplierCategoryComboDataService(supplierparam) {
    return function (dispatch) {
        if (supplierparam.masterData.SelectedSupplier.napprovalstatus === transactionStatus.DRAFT ) {

            const contactData = {
                "nsuppliercode": supplierparam.masterData.SelectedSupplier.nsuppliercode,
                "userinfo": supplierparam.userInfo

            };

            const contactService = rsapi().post("suppliercategory/getSupplierCategoryBySupplierCode", contactData);

            let urlArray = [];
            if (supplierparam.operation === "create") {

                urlArray = [contactService];
            }
            else {
                const contactById = rsapi().post("suppliercategory/getActiveSupplierCategoryById", { [supplierparam.primaryKeyField]: supplierparam.primaryKeyValue, "userinfo": supplierparam.userInfo });
                urlArray = [contactService, contactById];
            }
            dispatch(initRequest(true));
            Axios.all(urlArray)
                .then(response => {


                    let selectedRecord = {};
                    //let selectedSupplierCategory = {};
                    if (supplierparam.operation === "update") {
                        selectedRecord = response[1].data;


                        selectedRecord["nsuppliercatcode"] = response[1].data["nsuppliercatcode"];
                    }


                    dispatch({
                        type: DEFAULT_RETURN, payload: {
                            supplierCategory: response[0].data || [],
                            selectedSupplierCategory: [],

                            selectedRecord,
                            openChildModal: true,

                            operation: supplierparam.operation, screenName: supplierparam.screenName,
                            ncontrolCode: supplierparam.ncontrolCode, loading: false
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
                        toast.error(intl.formatMessage({ id: error.message }));
                    }
                    else {

                        toast.warn(intl.formatMessage({ id: error.response.data }));
                    }
                })
        }
        else {
            //toast.warn(this.props.formatMessage({ id: supplierparam.masterData.SelectedSupplier.stranstatus }));
            toast.warn(intl.formatMessage({ id: "IDS_SELECTDRAFTRECORD" }));
        }
    }
}


export function getMaterialCategoryComboDataService(materialparam) {
    return function (dispatch) {
        if (materialparam.masterData.SelectedSupplier.napprovalstatus === transactionStatus.DRAFT) {

            const materialData = {
                "nsuppliercode": materialparam.masterData.SelectedSupplier.nsuppliercode,
                "userinfo": materialparam.userInfo

            };

            const materialService = rsapi().post("materialcategory/getMaterialCategoryBYSupplierCode", materialData);

            let urlArray = [];
            if (materialparam.operation === "create") {

                urlArray = [materialService];
            }
            else {
                const contactById = rsapi().post("suppliercategory/getActiveSupplierCategoryById", { [materialparam.primaryKeyField]: materialparam.primaryKeyValue, "userinfo": materialparam.userInfo });
                urlArray = [materialService, contactById];
            }
            dispatch(initRequest(true));
            Axios.all(urlArray)
                .then(response => {


                    let selectedRecord = {};
                    if (materialparam.operation === "update") {
                        selectedRecord = response[1].data;


                        selectedRecord["nsuppliercatcode"] = response[1].data["nsuppliercatcode"];
                    }

                    dispatch({
                        type: DEFAULT_RETURN, payload: {
                            materialCategory: response[0].data || [],
                            selectedMaterialCategory: [],

                            selectedRecord,
                            openChildModal: true,

                            operation: materialparam.operation, screenName: materialparam.screenName,
                            ncontrolCode: materialparam.ncontrolCode, loading: false
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
                        toast.error(intl.formatMessage({ id: error.message }));
                    }
                    else {

                        toast.warn(intl.formatMessage({ id: error.response.data }));
                    }
                })
        }
        else {
            //toast.warn(this.props.formatMessage({ id: materialparam.masterData.SelectedSupplier.stranstatus }));
            toast.warn(intl.formatMessage({ id:"IDS_SELECTDRAFTRECORD" }));
        }
    }
}

export const addSupplierFile = (inputParam) => {
    return (dispatch) => {
        if(inputParam.masterData.SelectedSupplier.napprovalstatus === transactionStatus.DRAFT){
        dispatch(initRequest(true));
        let urlArray = [rsapi().post("/linkmaster/getLinkMaster", {
            userinfo: inputParam.userInfo
        })];
        if (inputParam.operation === "update") {
            urlArray.push(rsapi().post("/supplier/editSupplierFile", {
                userinfo: inputParam.userInfo,
                supplierfile: inputParam.selectedRecord
            }))
        }
        Axios.all(urlArray)
            .then(response => {
                if(response[1] && response[1].data.napprovalstatus  !== transactionStatus.DRAFT &&  inputParam.operation !== "create"){
                    toast.warn(intl.formatMessage({ id: "IDS_SELECTDRAFTRECORD" }));
                    dispatch({
                        type: DEFAULT_RETURN, payload: {
                          loading: false
                        }
                    });
                }else{
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
                            sdescription:editObject.sdescription,    //ALPD-855 Fix
                            ssystemfilename: editObject.ssystemfilename
                        }
                    }



                    selectedRecord = {
                        ...link,
                        nsupplierfilecode: editObject.nsupplierfilecode,
                        nattachmenttypecode: editObject.nattachmenttypecode,
                        // sdescription:editObject.sdescription,    //ALPD-855 Fix
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
            }
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
        }else{
            toast.warn(intl.formatMessage({ id:"IDS_SELECTDRAFTRECORD" }));
        }
    }

}
export function getSupplierContactComboDataService(supplierparam) {
    return function (dispatch) {
        if (supplierparam.masterData.SelectedSupplier.napprovalstatus === transactionStatus.DRAFT) {

            const contactData = {
                "nsuppliercode": supplierparam.masterData.SelectedSupplier.nsuppliercode,
                "userinfo": supplierparam.userInfo

            };
            const countryService = rsapi().post("country/getCountry", contactData);

            const contactService = rsapi().post("supplier/getSupplierContact", contactData);

            let urlArray = [];
            if (supplierparam.operation === "create") {

                urlArray = [contactService, countryService];
            }
            else {
                const contactById = rsapi().post("supplier/getActiveSupplierContactById", { [supplierparam.primaryKeyField]: supplierparam.primaryKeyValue, "userinfo": supplierparam.userInfo });
                urlArray = [countryService, contactById];
            }
            dispatch(initRequest(true));
            Axios.all(urlArray)
                .then(response => {

                    let selectedRecord = {};
                    let country = [];
                    if(response[1].data.napprovalstatus  !== transactionStatus.DRAFT &&  supplierparam.operation !== "create"){
                        toast.warn(intl.formatMessage({ id: "IDS_SELECTDRAFTRECORD" }));
                        dispatch({
                            type: DEFAULT_RETURN, payload: {
                              loading: false
                            }
                        });
                    }else{
                    selectedRecord = { countryList: response[1].data || [] };
                    //let selectedSupplierCategory = {};
                    if (supplierparam.operation === "update") {
                        selectedRecord = response[1].data;
                        country.push({ "value": response[1].data["ncountrycode"], "label": response[1].data["scountryname"] });
                        selectedRecord["ncountrycode"] = country[0];
                        selectedRecord["countryList"] = response[0].data;



                        selectedRecord["nsuppliercontactcode"] = response[1].data["nsuppliercontactcode"];
                    }

                    
                    dispatch({
                        type: DEFAULT_RETURN, payload: {
                            supplierContact: response[0].data.SupplierContact || [],
                            countryList: response[0].data || [],
                            selectedSupplierContact: [],
                            selectedId:supplierparam.primaryKeyValue,
                            selectedRecord,
                            openChildModal: true,

                            operation: supplierparam.operation, screenName: supplierparam.screenName,
                            ncontrolCode: supplierparam.ncontrolCode, loading: false
                        }
                    });
                }
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
        else {
            //toast.warn(this.props.formatMessage({ id: supplierparam.masterData.SelectedSupplier.stranstatus }));
            toast.warn(intl.formatMessage({ id: "IDS_SELECTDRAFTRECORD" }));
        }
    }
}
// export function filterColumnDataSupplier(filterValue, masterData, userInfo) {
//     return function (dispatch) {

//         let supplierCode = 0;
//         let searchedData = undefined;
//         if (filterValue === "") {
//             supplierCode = masterData["Supplier"][0].nsuppliercode;
//         }
//         else {

//             searchedData = searchData(filterValue, masterData["Supplier"], "ssuppliername");

//             if (searchedData.length > 0) {
//                 supplierCode = searchedData[0].nsuppliercode;
//             }
//             else {
//                 masterData["Supplier"] = [];
//                 masterData["SupplierCategory"] = [];
//                 masterData["MaterialCategory"] = [];
//                 masterData["SelectedSupplier"] = [];
//                 masterData["searchedData"] = [];
//                 dispatch({ type: DEFAULT_RETURN, payload: { masterData } });
//             }

//         }
//         dispatch(initRequest(true));
//         return rsapi().post("supplier/getSupplier", { nsuppliercode: supplierCode, userinfo: userInfo })
//             .then(response => {
//                 masterData["Supplier"] = response.data["Supplier"];
//                 masterData["SupplierCategory"] = response.data["SupplierCategory"];
//                 masterData["MaterialCategory"] = response.data["MaterialCategory"];
//                 masterData["SelectedSupplier"] = response.data["SelectedSupplier"];
//                 masterData["searchedData"] = searchedData;

//                 dispatch({ type: DEFAULT_RETURN, payload: { masterData, loading: false } });
//             })
//             .catch(error => {
//                 dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
//                 if (error.response?.status === 429) {
//                    toast.warn(intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
//                    dispatch({ type: DEFAULT_RETURN, payload: { loading: false } });
//                } else if (error.response?.status === 401 || error.response?.status === 403) {
//          dispatch({
//            type: UN_AUTHORIZED_ACCESS,
//                        payload: {
//                            navigation: 'forbiddenaccess',
//                            loading: false,
//                            responseStatus: error.response.status
//                        }
//            payload: {
//              navigation: 'forbiddenaccess',
//              loading: false,
//            }
//          });
//        } else if (error.response.status === 500) {
//                     toast.error(error.message);
//                 }
//                 else {
//                     toast.warn(error.response.data);
//                 }
//             })



//     }
// }

