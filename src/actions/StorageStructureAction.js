import rsapi from '../rsapi';
import { DEFAULT_RETURN, REQUEST_FAILURE, UN_AUTHORIZED_ACCESS } from './LoginTypes';
import { initRequest } from './LoginAction';
import { sortData, constructOptionList } from '../components/CommonScript';
import { toast } from 'react-toastify';
import Axios from 'axios';
import { intl } from '../components/App';
import { transactionStatus } from '../components/Enumeration';

export function getSelectedSampleStorageLocation(inputParam, userInfo, masterData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("/samplestoragelocation/getSelectedSampleStorageLocation",
            { 'userinfo': userInfo, "nsamplestoragelocationcode": parseInt(inputParam.nsamplestoragelocationcode) })
            .then(response => {

                masterData = {
                    ...masterData, selectedSampleStorageLocation: response.data["selectedSampleStorageLocation"],
                    sampleStorageVersion: response.data["sampleStorageVersion"],
                    selectedSampleStorageVersion: response.data["selectedSampleStorageVersion"]
                };
                sortData(masterData);

                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData,
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
                    toast.error(error.message);
                } else {
                    toast.warn(error.response.data);
                }
            });
    }
}
export function getSelectedSampleStorageVersion(inputParam, userInfo, masterData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("/samplestoragelocation/getActiveSampleStorageVersion",
            { 'userinfo': userInfo, "nsamplestorageversioncode": parseInt(inputParam.nsamplestorageversioncode) })
            .then(response => {

                masterData = {
                    ...masterData, selectedSampleStorageVersion: response.data["selectedSampleStorageVersion"]
                };
                // sortData(masterData);

                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData,
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
                    toast.error(error.message);
                } else {
                    toast.warn(error.response.data);
                }
            });
    }
}
export function editSampleStorageLocation(inputParam, userInfo, isOnlyDraft, editId, instrumentBasedStorage) {
    return function (dispatch) {
        dispatch(initRequest(true));
        let selectedRecord = {};
        let urlArray = [];
        const getSampleStorageService = rsapi().post("/samplestoragelocation/getSampleStorageVersionByID",
            { 'userinfo': userInfo, "nsamplestorageversioncode": inputParam.nsamplestorageversioncode, "nsamplestoragelocationcode": inputParam.nsamplestoragelocationcode });

        const geStorageCategory = rsapi().post("/storagecategory/getStorageCategory",
            { 'userinfo': userInfo });
		
            //comment by vignesh(23-07-2025)-->There is no need to fetch the Site ID and Instrument ID.
            /*
		//ATE234 Janakumar BGSI-10->Storage Structure ? Instrument id & Site combo load based on Setting table.
        const getinstrumentID = rsapi().post("/samplestoragelocation/getinstrumentID",
            { nstoragecategorycode: inputParam.nstoragecategorycode, 'userinfo': userInfo });
      
        const getsite = rsapi().post("/samplestoragelocation/getsite",
            { nstoragecategorycode: inputParam.nstoragecategorycode, ninstrumentid: inputParam.ninstrumentcode, 'userinfo': userInfo });
        */
            //ALPD-3353

        // const getprojecttype = rsapi().post("/projecttype/getProjectType",
        //       { 'userinfo': userInfo });

        // const getProduct = rsapi().post("/product/getProduct",
        //       { 'userinfo': userInfo });

        // const url1 = rsapi().post("samplestoragemapping/addSampleStorageMapping", {
        //     nsamplestoragelocationcode: 0,
        //     userinfo: userInfo
        // });
        // const getUnit = rsapi().post("/unit/getUnit",
        //       { 'userinfo': userInfo });
              
//ATE234 Janakumar BGSI-10->Storage Structure ? Instrument id & Site combo load based on Setting table.
        urlArray = [getSampleStorageService, geStorageCategory//, getinstrumentID, getsite
            //,getprojecttype,getProduct,url1,getUnit
        ];
         if(instrumentBasedStorage !== transactionStatus.YES){
                        urlArray.push(rsapi().post("site/getSite", {'userinfo': userInfo}));
          }
        Axios.all(urlArray)
            .then(response => {

                // masterData = {
                //     ...masterData
                // };

                selectedRecord["ssamplestoragelocationname"] = response[0].data["selectedSampleStorageVersion"]["ssamplestoragelocationname"]
                selectedRecord["nneedautomapping"]=response[0].data["selectedSampleStorageVersion"]["nneedautomapping"]
                selectedRecord["ncontainerstructurecode"]=response[0].data["selectedSampleStorageVersion"]["ncontainerstructurecode"];
                          
                const storageCategoryMap = constructOptionList(response[1].data || [], "nstoragecategorycode",
                    "sstoragecategoryname", undefined, undefined, true);

                const storageCategoryList = storageCategoryMap.get("OptionList");

                storageCategoryList.map(item => item.value === response[0].data["selectedSampleStorageVersion"]["nstoragecategorycode"] ?
                    selectedRecord["nstoragecategorycode"] = {
                        "label": item.label,
                        "value": item.value,
                        "item": item.item
                    }
                    : "");

                    //uncommented by L.Subashini to revert back site in screen
                //comment by vignesh(23-07-2025)-->There is no need to fetch the Site ID and Instrument ID.

                    //ATE234 Janakumar BGSI-10->Storage Structure ? Instrument id & Site combo load based on Setting table.
               // let InstrumentList;
               let SiteList = [];
                if (instrumentBasedStorage !== 3) {
                    // const sampleStorageInstrumentList = constructOptionList(response[2].data || [], "ninstrumentcode",
                    //     "sinstrumentid", undefined, undefined, undefined);
                    // InstrumentList = sampleStorageInstrumentList.get("OptionList");

                    // selectedRecord['sinstrumentid'] = {};
                    // selectedRecord['sinstrumentid']['label'] = response[0].data["selectedSampleStorageVersion"]["ssamplestoragelocationname"];
                    // selectedRecord['sinstrumentid']['value'] = response[0].data["selectedSampleStorageVersion"]["ninstrumentcode"];


                    selectedRecord['ssitename'] = {};
                    selectedRecord['ssitename']['label'] = response[0].data["selectedSampleStorageVersion"]['ssitename'];
                    selectedRecord['ssitename']['value'] = response[0].data["selectedSampleStorageVersion"]['nsitecode'];

                       const sampleStorageSiteList = constructOptionList(response[2].data || [], "nsitecode",
                            "ssitename", undefined, undefined, undefined);
                        SiteList = sampleStorageSiteList.get("OptionList");
                }            


                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        // masterData,
                        SiteList,
                        loading: false,
                        //InstrumentList,
                        treeData: JSON.parse(response[0].data["selectedSampleStorageVersion"]["jsondata"].value).data,
                        selectedRecord, openModal: true, operation: "update", loadTreeProperties: false, storageCategoryList,
                        //sampleTypeList,projectTypeMapList,
                       // unitMapList,
                        isOnlyDraft, ncontrolcode: editId
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
                    toast.error(error.message);
                } else {
                    toast.warn(error.response.data);
                }
            });
    }
}

export function additionalInformationData(inputParam, userInfo, isOnlyDraft, addInfoId) {
    return function (dispatch) {
        dispatch(initRequest(true));
        let selectedRecord = {};
        let urlArray = [];
        const getSampleStorageService = rsapi().post("/samplestoragelocation/getSampleStorageVersionByID",
            { 'userinfo': userInfo, "nsamplestorageversioncode": inputParam.nsamplestorageversioncode, "nsamplestoragelocationcode": inputParam.nsamplestoragelocationcode });

    
        const getprojecttype = rsapi().post("/samplestoragelocation/getProjectType",
              { 'userinfo': userInfo });

        const getProduct = rsapi().post("/samplestoragelocation/getProduct",
              { 'userinfo': userInfo });

        const url1 = rsapi().post("samplestoragemapping/addSampleStorageMapping", {
            nsamplestoragelocationcode: 0,nalertvalidation:false,
            userinfo: userInfo
        });

        const getUnit = rsapi().post("/unit/getUnit",
              { 'userinfo': userInfo });
              

        urlArray = [getSampleStorageService,getprojecttype,getProduct,url1,getUnit];
        Axios.all(urlArray)
            .then(response => {       

                const projectTypeMap = constructOptionList(response[1].data || [], "nprojecttypecode","sprojecttypename", undefined, undefined, true);

                const projectTypeMapList = projectTypeMap.get("OptionList");

                projectTypeMapList.map(item => item.value === response[0].data["selectedSampleStorageVersion"]["nprojecttypecode"] ?
                selectedRecord["nprojecttypecode"] = {
                    "label": item.label,
                    "value": item.value,
                    "item": item.item
                }
                : "");


                const sampleTypeMap = constructOptionList(response[2].data  || [], "nproductcode","sproductname", undefined, undefined, true);

                const sampleTypeList = sampleTypeMap.get("OptionList");

                sampleTypeList.map(item => item.value === response[0].data["selectedSampleStorageVersion"]["nproductcode"] ?
                selectedRecord["nproductcode"] = {
                    "label": item.label,
                    "value": item.value,
                    "item": item.item
                }
                : "");

                const unitMap = constructOptionList(response[4].data || [], "nunitcode",
                "sunitname", undefined, undefined, true);

            const unitMapList = unitMap.get("OptionList");
            unitMapList.map(item => item.value === response[0].data["selectedSampleStorageVersion"]["nunitcode"] ?
            selectedRecord["nunitcode"] = {
                "label": item.label,
                "value": item.value,
                "item": item.item
            }
            : "");

            const containerTypeMap = constructOptionList(response[3].data['containerType'] || [],"ncontainertypecode","scontainertype", undefined, undefined, true);
            const containerTypeList = containerTypeMap.get("OptionList");
            containerTypeList.map(item => item.value === response[0].data["selectedSampleStorageVersion"]["ncontainertypecode"] ?
            selectedRecord["ncontainertypecode"] = {
                "label": item.label,
                "value": item.value,
                "item": item.item
            }
            : ""); 
            const directionmasterMap = constructOptionList(response[3].data['directionmaster'] || [],
                "ndirectionmastercode",
                "sdirection", undefined, undefined, true);
            const directionmasterList = directionmasterMap.get("OptionList");

            directionmasterList.map(item => item.value === response[0].data["selectedSampleStorageVersion"]["ndirectionmastercode"] ?
            selectedRecord["ndirectionmastercode"] = {
                "label": item.label,
                "value": item.value,
                "item": item.item
            }
            : "");

            const containerstructureMap = constructOptionList(response[0].data['containerStructure']
                || [],
                "ncontainerstructurecode",
                "scontainerstructurename", undefined, undefined, true);
            const containerstructureList = containerstructureMap.get("OptionList");

            containerstructureList.map(item => item.value === response[0].data["selectedSampleStorageVersion"]["ncontainerstructurecode"] ?
            selectedRecord["ncontainerstructurecode"] = {
                "label": item.label,
                "value": item.value,
                "item": item.item
            }
            : "");           
                selectedRecord = {
                    ...selectedRecord,
                nneedposition: response[0].data["selectedSampleStorageVersion"].nneedposition === 3 ? true : false, 
                nrow: response[0].data["selectedSampleStorageVersion"].nrow===0?1:response[0].data["selectedSampleStorageVersion"].nrow,
                ncolumn: response[0].data["selectedSampleStorageVersion"].ncolumn===0?1:response[0].data["selectedSampleStorageVersion"].ncolumn ,
                nquantity:  response[0].data["selectedSampleStorageVersion"].nquantity,
                nnoofcontainer: response[0].data["selectedSampleStorageVersion"].nnoofcontainer,
                nneedautomapping:  response[0].data["selectedSampleStorageVersion"].nneedautomapping===transactionStatus.YES?
                true:false,
                containerTypeOptions: containerTypeList,
                containerStructureOptions: containerstructureList,
                directionmasterOptions: directionmasterList
            }
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        //masterData,
                        loading: false,
                        treeData: JSON.parse(response[0].data["selectedSampleStorageVersion"]["jsondata"].value).data,
                        selectedRecord, openModal: true, operation: "addinfo", loadTreeProperties: false,
                        sampleTypeList,projectTypeMapList,unitMapList,

                        isOnlyDraft, ncontrolcode: addInfoId
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
                    toast.error(error.message);
                } else {
                    toast.warn(error.response.data);
                }
            });
    }
}

export function approveSampleStorageLocation(userInfo, masterData) {
    return function (dispatch) {

        dispatch(initRequest(true));
        rsapi().post("/samplestoragelocation/ApproveSampleStorageLocation",
            {
                'userinfo': userInfo, "approvalStatus": masterData.selectedSampleStorageVersion["napprovalstatus"], "sampleStorageVersionCode": masterData.selectedSampleStorageVersion["nsamplestorageversioncode"],
                "sampleStorageLocationCode": masterData.selectedSampleStorageVersion["nsamplestoragelocationcode"]
            })
            .then(response => {

                masterData = {
                    ...masterData, sampleStorageVersion: response.data["sampleStorageVersion"], selectedSampleStorageVersion: response.data["selectedSampleStorageVersion"]
                };
                // sortData(masterData);

                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData,
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
                    toast.error(error.message);
                } else {
                    toast.warn(error.response.data);
                }
            });
    }
}

// export const openPropertyModal = (clickedItem, editId) => (dispatch) => {
//     let selectedRecord = {};
//     selectedRecord["locationlastnode"] = clickedItem.item.locationlastnode === undefined ? false : clickedItem.item.locationlastnode;
//     selectedRecord["containerfirstnode"] = clickedItem.item.containerfirstnode === undefined ? false : clickedItem.item.containerfirstnode;
//     selectedRecord["containerlastnode"] = clickedItem.item.containerlastnode === undefined ? false : clickedItem.item.containerlastnode;


//     dispatch({
//         type: DEFAULT_RETURN,
//         payload: { selectedRecord, loadTreeProperties: true, openModal: true, clickedItem, operation: "update", ncontrolcode: editId }
//     });
// };

export function openPropertyModal(inputParam, userInfo, clickedItem, editId) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("/samplestoragelocation/getSampleStorageVersionByID",
            { 'userinfo': userInfo, "nsamplestorageversioncode": inputParam.nsamplestorageversioncode, "nsamplestoragelocationcode": inputParam.nsamplestoragelocationcode })
            .then(response => {

                // masterData = {
                //     ...masterData, selectedSampleStorageVersion: response.data["selectedSampleStorageVersion"]
                // };
                // sortData(masterData);

                // dispatch({
                //     type: DEFAULT_RETURN,
                //     payload: {                       
                //         loading: false

                //     }
                // });

                let selectedRecord = {};
                selectedRecord["locationlastnode"] = clickedItem.item.locationlastnode === undefined ? false : clickedItem.item.locationlastnode;
                selectedRecord["containerfirstnode"] = clickedItem.item.containerfirstnode === undefined ? false : clickedItem.item.containerfirstnode;
                selectedRecord["containerlastnode"] = clickedItem.item.containerlastnode === undefined ? false : clickedItem.item.containerlastnode;


                dispatch({
                    type: DEFAULT_RETURN,
                    payload: { selectedRecord, loadTreeProperties: true, openModal: true, clickedItem, operation: "update", ncontrolcode: editId, loading: false }
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
                    toast.error(error.message);
                } else {
                    toast.warn(error.response.data);
                }
            });
    }
}

export function fetchStorageCategory(param) {
    return function (dispatch) {
        dispatch(initRequest(true));
	//ATE234 Janakumar BGSI-10->Storage Structure ? Instrument id & Site combo load based on Setting table.
            const storagecategoryService = rsapi().post("/storagecategory/getStorageCategory",
             { 'userinfo': param.userInfo });

			/*
        const getinstrumentID = rsapi().post("/samplestoragelocation/getinstrumentID",
            { nstoragecategorycode: param.nfilterStorageCategory.value, 'userinfo': param.userInfo });

        const getsite = rsapi().post("/samplestoragelocation/getsite",
            { nstoragecategorycode: param.nfilterStorageCategory.value, ninstrumentid: param.ninstrumentcode === undefined ? -1 : param.ninstrumentcode, 'userinfo': param.userInfo });
                */

            //   const getProduct = rsapi().post("/product/getProduct",
            //   { 'userinfo': param.userInfo });

            
            //   const url1 = rsapi().post("samplestoragemapping/addSampleStorageMapping", { 
            //     nsamplestoragelocationcode:0, 
            //     userinfo:  param.userInfo 
            // });

         
        let urlArray = [storagecategoryService//, getinstrumentID, getsite//, getprojecttype,getProduct
            //,url1
        ];
          // if(this.props.Login.settings && this.props.Login.settings[84] &&
          //                       parseInt(this.props.Login.settings[84]) === transactionStatus.NO){
          if(param.nsettings !== transactionStatus.YES){
                        urlArray.push(rsapi().post("site/getSite", {'userinfo': param.userInfo}));
          }
            Axios.all(urlArray)

            .then(response => {
                const storageCategoryMap = constructOptionList(response[0].data || [], "nstoragecategorycode",
                    "sstoragecategoryname", undefined, undefined, true);

                const storageCategoryList = storageCategoryMap.get("OptionList");
			//ATE234 Janakumar BGSI-10->Storage Structure ? Instrument id & Site combo load based on Setting table.
              
            //comment by vignesh(23-07-2025)-->There is no need to fetch the Site ID and Instrument ID.

            /*const sampleStorageInstrumentList = constructOptionList(response[1].data || [], "ninstrumentcode",
                    "sinstrumentid", undefined, undefined, undefined);
                const InstrumentList = sampleStorageInstrumentList.get("OptionList");
*/
                let siteList = [];
                let selectedRecord={};
                if(param.nsettings !== 3){
                        siteList = constructOptionList(response[1].data || [], "nsitecode",
                            "ssitename", undefined, undefined, undefined);
                        siteList = siteList.get("OptionList");                       

                        selectedRecord['ssitename'] = {};
                        selectedRecord['ssitename']['label'] = param.userInfo['ssitename'];
                        selectedRecord['ssitename']['value'] = param.userInfo['ntranssitecode'];
                }



                // const projectTypeMap = constructOptionList(response[1].data || [], "nprojecttypecode",
                //     "sprojecttypename", undefined, undefined, true);

                // const projectTypeMapList = projectTypeMap.get("OptionList");

                // const sampleTypeMap = constructOptionList(response[2].data.Product || [], "nproductcode",
                // "sproductname", undefined, undefined, true);

                // const sampleTypeList = sampleTypeMap.get("OptionList");
            

                // const containerTypeMap = constructOptionList(response[3].data['containerType'] || [],
                //     "ncontainertypecode",
                //     "scontainertype", undefined, undefined, true);
                // const containerTypeList = containerTypeMap.get("OptionList");

                // let containerStructure = response[3].data['containerStructure'];
                // const directionmasterMap = constructOptionList(response[3].data['directionmaster'] || [],
                //     "ndirectionmastercode",
                //     "sdirection", undefined, undefined, true);
                // const directionmasterList = directionmasterMap.get("OptionList");
           

                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        storageCategoryList//,projectTypeMapList, sampleTypeList
                        ,openModal: true,
                        //InstrumentList,
                        SiteList:siteList,
                         selectedRecord: {    
                            ...selectedRecord,
                            // containerTypeOptions: containerTypeList,
                            // directionmasterOptions: directionmasterList, 
                            // nrow: containerStructure.length > 0 ? containerStructure[0].nrow : 1,
                            // ncolumn: containerStructure.length > 0 ? containerStructure[0].ncolumn : 1,  
                            nstoragecategorycode: param.nfilterStorageCategory                          
                        },
                        loadTreeProperties: false,
                        treeData: [
                            {
                                text: intl.formatMessage({ id: "IDS_ROOT" }),
                                expanded: true,
                                editable: true,
                                root: true,
                                id: param.id,
                            },
                        ], operation: "create",
                        loading: false,
                        isOnlyDraft: false,
                        ncontrolcode: param.addId
                    }
                });
            })
            // rsapi().post("/storagecategory/getStorageCategory",
            //     { 'userinfo': param.userInfo })
            //     .then(response => {

            //         const storageCategoryMap = constructOptionList(response.data || [], "nstoragecategorycode",
            //             "sstoragecategoryname", undefined, undefined, true);

            //         const storageCategoryList = storageCategoryMap.get("OptionList");


            //         dispatch({
            //             type: DEFAULT_RETURN,
            //             payload: {
            //                 storageCategoryList, openModal: true, selectedRecord: {nstoragecategorycode: param.nfilterStorageCategory}, loadTreeProperties: false,
            //                 treeData: [
            //                     {
            //                         text: "root",
            //                         expanded: true,
            //                         editable: true,
            //                         root: true,
            //                         id: param.id,
            //                     },
            //                 ], operation: "create",
            //                 loading: false,
            //                 isOnlyDraft: false,
            //                 ncontrolcode: param.addId
            //             }
            //         });
            //     })
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
                    toast.error(error.message);
                } else {
                    toast.warn(error.response.data);
                }
            });
    }
}

export const changeStorageCategoryFilter = (inputParam, filterStorageCategory) => {
    return (dispatch) => {
        dispatch(initRequest(true));
        rsapi().post("/samplestoragelocation/getSampleStorageLocationByCategory", inputParam.inputData)
            .then(response => {
                const masterData = response.data
                // sortData(masterData);
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false,
                        masterData: {
                            ...masterData,
                            filterStorageCategory,
                            nfilterStorageCategory: inputParam.inputData.nfilterStorageCategory,

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

export function copySampleStorageVersion(inputParam, userInfo, masterData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("/samplestoragelocation/copySampleStorageVersion",
            {
                'userinfo': userInfo, "sampleStorageVersionCode": parseInt(inputParam.nsamplestorageversioncode),
                "sampleStorageLocationCode": parseInt(inputParam.nsamplestoragelocationcode)
            })
            .then(response => {

                masterData = {
                    ...masterData, selectedSampleStorageLocation: response.data["selectedSampleStorageLocation"],
                    sampleStorageVersion: response.data["sampleStorageVersion"],
                    selectedSampleStorageVersion: response.data["selectedSampleStorageVersion"]
                };

                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData,
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
                    toast.error(error.message);
                } else {
                    toast.warn(error.response.data);
                }
            });
    }
}

export const crudSampleStorageLocation = (inputParam, masterData) => {
    return (dispatch) => {
        dispatch(initRequest(true));
        rsapi().post("/samplestoragelocation/" + inputParam.operation + "SampleStorageLocation", { ...inputParam.inputData })
            .then(response => {
                // sortData(masterData);
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false,
                        masterData: {
                            ...masterData, sampleStorageLocation: response.data["sampleStorageLocation"], selectedSampleStorageLocation: response.data["selectedSampleStorageLocation"],
                            sampleStorageVersion: response.data["sampleStorageVersion"], selectedSampleStorageVersion: response.data["selectedSampleStorageVersion"],
                            filterStorageCategory: response.data["filterStorageCategory"], selectedStorageCategoryName: response.data["selectedStorageCategoryName"]

                        },
                        openModal: false
                    }
                });
            })
            .catch(error => {
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
                    dispatch({
                        type: REQUEST_FAILURE,
                        payload: {
                            error: error.message,
                            loading: false
                        }
                    });
                } else {
                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {
                            masterStatus: error.response.data,
                            errorCode: error.response.status,
                            loadEsign: false,
                            loading: false
                        }
                    });
                }

                // toast.error(error.message);
            });
    }
}
//comment by vignesh(23-07-2025)-->There is no need to fetch the Site ID and Instrument ID.
/*
//ATE234 Janakumar BGSI-10->Storage Structure ? Instrument id & Site combo load based on Setting table.
export function getsite(inputparam, fieldName, comboData,selectedRecord) {

    return (dispatch) => {
        dispatch(initRequest(true));
        rsapi().post("/samplestoragelocation/getsite", { userInfo: inputparam.userInfo, nstoragecategorycode: inputparam.nstoragecategorycode, ninstrumentid: inputparam.ninstrumentid, nsettingscode: inputparam.nsettingscode })
            .then(response => {
                let sampleStorageSiteList = constructOptionList(response.data || [], "nregionalsitecode",
                    "sregionalsitename", undefined, undefined, undefined);
                const SiteList = sampleStorageSiteList.get("OptionList");
                let selectedRecordsite={};
                if(inputparam.nsettingscode===3){
                selectedRecordsite['sregionalsitename'] = {};
                selectedRecordsite['sregionalsitename']['label'] = SiteList[0].label;
                selectedRecordsite['sregionalsitename']['value'] = SiteList[0].value;
                }
                selectedRecordsite={...selectedRecord,...selectedRecordsite}
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false,
                        selectedRecord:selectedRecordsite,
                        SiteList,
                        openModal: true
                    }
                });
            })
            .catch(error => {
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
                    dispatch({
                        type: REQUEST_FAILURE,
                        payload: {
                            error: error.message,
                            loading: false
                        }
                    });
                } else {
                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {
                            masterStatus: error.response.data,
                            errorCode: error.response.status,
                            openModal: true,
                            loading: false
                        }
                    });
                }

                // toast.error(error.message);
            });
    }

}*/