import rsapi from '../rsapi';
import Axios from 'axios';
import {
    toast
} from 'react-toastify';
import {
    sortData,
    getComboLabelValue,
    constructOptionList
} from '../components/CommonScript'
import {
    DEFAULT_RETURN,
    UN_AUTHORIZED_ACCESS
} from './LoginTypes';
import { intl } from '../components/App'
import { initRequest } from './LoginAction';
export function selectProductMaholderDetail(productmaholder, masterData, userInfo) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("/productmaholder/getProductMaHolderByProductMahcode", {
            "nproductmanufcode": parseInt(productmaholder.nproductmanufcode),
            "nproductmahcode": parseInt(productmaholder.nproductmahcode),
            'userinfo': userInfo
        })
            .then(response => {
                masterData = {
                    ...masterData,
                    ...response.data
                };
                sortData(masterData);
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData, loading: false
                    }
                });
            })
            .catch(error => {
                dispatch(initRequest(false));
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
export function getProductMAHolderComboService(screenName, operation, primaryKeyName, primaryKeyValue, selectedFilter, masterData, userInfo, ncontrolCode) {
    return function (dispatch) {

        if ((operation === "create" && selectedFilter.nproductcode && selectedFilter.nproductmanufcode > 0) || (operation === "update")) {

            const MarketAuthorisationService = rsapi().post("/product/getMarketAuthorisationHolder", {
                "userinfo": userInfo
            });
            const CertificateLicenseContainertypeService = rsapi().post("/product/getCertificateLicenseContainertype", {
                "userinfo": userInfo
            });

            let urlArray = [];
            if (operation === "create") {
                urlArray = [MarketAuthorisationService, CertificateLicenseContainertypeService];
            } else {
                const ProductMAHolderByIDService = rsapi().post("/product/getProductMaHolderByProductMahcode", {
                    "userinfo": userInfo,
                    [primaryKeyName]: primaryKeyValue
                })
                urlArray = [MarketAuthorisationService, CertificateLicenseContainertypeService, ProductMAHolderByIDService];
            }
            dispatch(initRequest(true));
            Axios.all(urlArray)
                .then(response => {

                    const MAHolder = response[0].data;
                    const { CertificateType,
                        ContainerType,
                        LicenseAuthority
                    } = response[1].data;

                    const ContainerTypeList = constructOptionList(response[1].data["ContainerType"] || [], "ncontainertypecode",
                        "scontainertype", undefined, undefined, undefined);
                    const ContainerType1 = ContainerTypeList.get("OptionList");

                    const MAHolderList = constructOptionList(response[0].data || [], "nmahcode",
                        "smahname", undefined, undefined, undefined);
                    const MAHolder1 = MAHolderList.get("OptionList");

                    const CertificateTypeList = constructOptionList(response[1].data["CertificateType"] || [], "ncertificatetypecode",
                        "scertificatetype", undefined, undefined, undefined);
                    const CertificateType1 = CertificateTypeList.get("OptionList");


                    let selectedRecord = {};
                    if (operation === "update") {
                        selectedRecord = response[2].data["ProductMaHolder"];
                        getComboLabelValue(selectedRecord, MAHolder, "nmahcode", "smahname");
                        let index = MAHolder.findIndex(x => x.nmahcode === selectedRecord.nmahcode.value);
                        selectedRecord["saddress1"] = MAHolder && MAHolder.length > 0 && MAHolder[index].saddress1;
                        selectedRecord["saddress2"] = MAHolder && MAHolder.length > 0 && MAHolder[index].saddress2;
                        selectedRecord["saddress3"] = MAHolder && MAHolder.length > 0 && MAHolder[index].saddress3;
                        selectedRecord["scountryname"] = MAHolder && MAHolder.length > 0 && MAHolder[index].scountryname;
                        getComboLabelValue(selectedRecord, CertificateType, "ncertificatetypecode", "scertificatetype");
                        getComboLabelValue(selectedRecord, ContainerType, "ncontainertypecode", "scontainertype");
                        // getComboLabelValue(selectedRecord, LicenseAuthority, "nauthoritycode", "sauthorityname");
                    } else {
                        selectedRecord["nstatus"] = 1;
                        selectedRecord["sproducttradename"] = "";
                        selectedRecord["nproductcode"] = selectedFilter.nproductcode.value;
                        selectedRecord["nproductmanufcode"] = selectedFilter.nproductmanufcode.value;
                    }

                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {
                            MAHolder: MAHolder1 || [],
                            CertificateType: CertificateType1 || [],
                            ContainerType: ContainerType1 || [],
                            LicenseAuthority: LicenseAuthority || [],
                            operation,
                            screenName,
                            selectedRecord,
                            openModal: true,
                            masterData,
                            ncontrolCode,
                            loading: false
                        }
                    });
                })
                .catch(error => {
                    dispatch(initRequest(false));
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
                        toast.warn(intl.formatMessage({
                            id: error.response.data
                        }));
                    }
                })
        } else if (selectedFilter.nproductcode === undefined) {
            toast.warn(intl.formatMessage({
                id: "IDS_SELECTPRODUCT"
            }));
        } else if (selectedFilter.nproductmanufcode === undefined) {
            toast.warn(intl.formatMessage({
                id: "IDS_SELECTPRODUCTMANUFACTURER"
            }));
        }
    }
}
export function getProductChange(Map, selectedFilter, masterData, searchRef) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("/productmaholder/getProductMaHolderByProductcode", Map)
            .then(response => {
                const MAHProductManufacturer = response.data["MAHProductManufacturer"];
                sortData(response.data)
                // MAHProductManufacturer.length > 0 ?
                //     selectedFilter["nproductmanufcode"] = {
                //         "value": MAHProductManufacturer[0].nproductmanufcode,
                //         "label": MAHProductManufacturer[0].smanufname
                //     } : selectedFilter["nproductmanufcode"] = "";
                selectedFilter["smanufname"] = MAHProductManufacturer && MAHProductManufacturer.length > 0 ?
                    MAHProductManufacturer[0].smanufname : ""

                selectedFilter["nproductmanufcode"] = MAHProductManufacturer && MAHProductManufacturer.length > 0 ?
                    MAHProductManufacturer[0].nproductmanufcode : -1

                    let selectedRecord={};
                    selectedRecord=selectedFilter;

                masterData = {
                    ...masterData,
                    ...response.data
                };
                if(searchRef!== undefined &&searchRef.current !== null){
                    searchRef.current.value='';
                    masterData['searchedData']=undefined;
                }
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData,
                        selectedFilter,
                        selectedRecord,
                        loading: false
                    }
                });

            })
            .catch(error => {
                dispatch(initRequest(false));
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
export function getProductManufactureChange(userInfo, selectedFilter, masterData, searchRef) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("/productmaholder/getProductMaHolderByProductManufcode", {"userinfo":userInfo,"nproductmanufcode":parseInt(selectedFilter["nproductmanufcode"])})
            .then(response => {
                // const MAHProductManufacturer = response.data["MAHProductManufacturer"];
                sortData(response.data)
                let SelectedMahProduct={}
                SelectedMahProduct['sproductname']=selectedFilter["nproductcode"].label
                masterData = {
                    ...masterData,
                    ...response.data,
                    SelectedMahProduct
                };
                if(searchRef!== undefined &&searchRef.current !== null){
                    searchRef.current.value='';
                    masterData['searchedData']=undefined;
                }
                
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData,
                        selectedFilter,
                        loading: false
                    }
                });

            })
            .catch(error => {
                dispatch(initRequest(false));
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

