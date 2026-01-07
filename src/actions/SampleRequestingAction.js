import rsapi from "../rsapi";
import { DEFAULT_RETURN, UN_AUTHORIZED_ACCESS } from './LoginTypes';
import { toast } from 'react-toastify';
import { initRequest } from './LoginAction';
import Axios from 'axios';
import { rearrangeDateFormat, constructOptionList, } from '../components/CommonScript'
import { transactionStatus, attachmentType } from '../components/Enumeration';
import { intl } from '../components/App';

// export function addGetRegion(params) {
//     return function (dispatch) {
//         dispatch(initRequest(true));


//         const fetchRegion = rsapi().post("samplerequesting/getRegion", { userinfo: params.userInfo });

//         Axios.all([fetchRegion])
//             .then(regionResp => {
//                 const regionData = regionResp.data;
//                 const nsitehierarchyconfigcode = regionData.currentList?.[0]?.nsitehierarchyconfigcode;

//                 // helper for dropdown
//                 const createOption = (site, disable = false) => ({
//                     value: site.nsitecode,
//                     label: site.ssitename,
//                     relation: site.srelation,
//                     level: Number(site.nlevel),
//                     isDisabled: disable
//                 });

//                 // collect all site lists
//                 const allSites = [
//                     ...(regionData.currentList || []),
//                     ...(regionData.parentList || []),
//                     ...(regionData.childList || []),
//                 ];
//                 const uniqueLevels = [...new Set(allSites.map(site => Number(site.nlevel)))].sort((a, b) => a - b);

//                 // dropdown arrays
//                 const stateOptions = [];
//                 const regionalOptions = [];
//                 const districtOptions = [];
//                 const subDivisionalOptions = [];
//                 const selectedSites = {};

//                 const currentSite = regionData.currentList?.[0] || null;
//                 const currentLevel = currentSite ? Number(currentSite.nlevel) : null;

//                 // disable parents + current site
//                 const disabledIds = new Set();
//                 (regionData.currentList || []).forEach(s => disabledIds.add(s.nsitecode));
//                 (regionData.parentList || []).forEach(s => disabledIds.add(s.nsitecode));

//                 // helper to process site lists
//                 const processSiteList = (siteList, isChildList = false) => {
//                     siteList.forEach(site => {
//                         const option = createOption(site, disabledIds.has(site.nsitecode));

//                         // push into correct list
//                         if (site.nlevel === uniqueLevels[0]) stateOptions.push(option);
//                         else if (site.nlevel === uniqueLevels[1]) regionalOptions.push(option);
//                         else if (site.nlevel === uniqueLevels[2]) districtOptions.push(option);
//                         else if (site.nlevel === uniqueLevels[3]) subDivisionalOptions.push(option);

//                         // auto-select disabled ones
//                         if (!isChildList && disabledIds.has(site.nsitecode)) {
//                             if (site.nlevel === uniqueLevels[0]) selectedSites.nstatelabcode = option;
//                             else if (site.nlevel === uniqueLevels[1]) selectedSites.nregionallabcode = option;
//                             else if (site.nlevel === uniqueLevels[2]) selectedSites.ndistrictlabcode = option;
//                             else if (site.nlevel === uniqueLevels[3]) selectedSites.nsubdivisionallabcode = option;
//                         }
//                     });
//                 };

//                 // process current + parents
//                 processSiteList(regionData.currentList || []);
//                 processSiteList(regionData.parentList || []);

//                 // prepare village list
//                 let villageList = [];
//                 if (currentSite) {
//                     const nextLevel = currentLevel + 1;
//                     const directChildren = (regionData.childList || []).filter(
//                         site => Number(site.nlevel) === nextLevel
//                     );

//                     if (directChildren.length > 0) {
//                         processSiteList(directChildren, true);

//                         dispatch({
//                             type: DEFAULT_RETURN,
//                             payload: {
//                                 loading: false,
//                                 selectedRecord: selectedSites,
//                                 stateList: stateOptions.sort((a, b) => a.label.localeCompare(b.label)),
//                                 regionalList: regionalOptions.sort((a, b) => a.label.localeCompare(b.label)),
//                                 districtList: districtOptions.sort((a, b) => a.label.localeCompare(b.label)),
//                                 subDivisionalList: subDivisionalOptions.sort((a, b) => a.label.localeCompare(b.label)),
//                                 villageList,
//                                 locationList: [],
//                                 nsitehierarchyconfigcode,
//                                 openModal: true,
//                                 screenName: params.screenName,
//                                 loadEsign: false,
//                                 operation: "create",
//                                 postParamList: params.postParamList,
//                                 inputParam: params.inputParam
//                             },
//                         });
//                     } else {
//                         // fetch village if no direct children
//                         rsapi().post("samplerequesting/getVillages", {
//                             userinfo: params.userInfo,
//                             primarykey: currentSite.nsitecode,
//                         })
//                             .then(villageResp => {
//                                 const data = villageResp.data.villageList || [];
//                                 villageList = data.map(row => ({
//                                     value: row.nvillagecode,
//                                     label: row.svillagename,
//                                     srelation: row.srelation,
//                                     ssitetypename: (row.ssitetypename || "").toUpperCase(),
//                                     isDisabled: false
//                                 }));

//                                 selectedSites.nvillagecode = null;
//                                 selectedSites.nsamplelocationcode = null;

//                                 dispatch({
//                                     type: DEFAULT_RETURN,
//                                     payload: {
//                                         loading: false,
//                                         selectedRecord: selectedSites,
//                                         stateList: stateOptions.sort((a, b) => a.label.localeCompare(b.label)),
//                                         regionalList: regionalOptions.sort((a, b) => a.label.localeCompare(b.label)),
//                                         districtList: districtOptions.sort((a, b) => a.label.localeCompare(b.label)),
//                                         subDivisionalList: subDivisionalOptions.sort((a, b) => a.label.localeCompare(b.label)),
//                                         villageList,
//                                         locationList: [],
//                                         nsitehierarchyconfigcode,
//                                         openModal: true,
//                                         screenName: params.screenName,
//                                         loadEsign: false,
//                                         operation: "create",
//                                         postParamList: params.postParamList,
//                                         inputParam: params.inputParam
//                                     },
//                                 });
//                             })
//                             .catch(err => {
//                                 if (err.response?.status === 500) {
//                                     toast.error(err.message);
//                                 }
//                                 dispatch({ type: DEFAULT_RETURN, payload: { loading: false } });
//                             });
//                     }
//                 }
//             })
//             .catch(error => {
//                 dispatch({ type: DEFAULT_RETURN, payload: { loading: false } });
//                 if (error.response?.status === 500) {
//                     toast.error(error.message);
//                 }
//             });
//     };
// }






export function addSampleRequestingGetRegion(params) {
    return function (dispatch) {
        dispatch(initRequest(true));

        const fetchRegion = rsapi().post("samplerequesting/getRegion", { userinfo: params.userInfo });
        const getDate = rsapi().post("timezone/getLocalTimeByZone", { userinfo: params.userInfo });

        Axios.all([fetchRegion, getDate])
            .then(([regionResp, dateResp]) => {
                const regionData = regionResp.data;
                const nsitehierarchyconfigcode = regionData.currentList?.[0]?.nsitehierarchyconfigcode;

                let date = rearrangeDateFormat(params.userInfo, dateResp.data?.date);
                let selectedSites = { dcollectiondate: date }; // Changed scollectiondate to dcollectiondate by Gowtham R on Oct 2 jira id: SWSM-78

                // added by sujatha ATE_274 SWSM-78 for loader issue in sample requesting when login with the site which is not mapped in the site hierarchy config

                  if (
                    (!regionData.currentList || regionData.currentList.length === 0) &&
                    (!regionData.parentList || regionData.parentList.length === 0) &&
                    (!regionData.childList || regionData.childList.length === 0)
                ) {
                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {
                            loading: false,
                            selectedRecord: selectedSites,
                            stateList: [],
                            regionalList: [],
                            districtList: [],
                            subDivisionalList: [],
                            villageList: [],
                            locationList: [],
                            nsitehierarchyconfigcode,
                            openModal: true,
                            screenName: params.screenName,
                            loadEsign: false,
                            operation: "create",
                            postParamList: params.postParamList,
                            inputParam: params.inputParam
                        }
                    });
 
                }
                // helper for dropdown
                const createOption = (site, disable = false) => ({
                    value: site.nsitecode,
                    label: site.ssitename,
                    relation: site.srelation,
                    level: Number(site.nlevel),
                    isDisabled: disable,
                    sitehierarchyconfigcode:site.nsitehierarchyconfigcode || -1    // added by sujatha ATE_274 SWSM-78 for passing siteheriarchyconfig code to the optionlist
                });

                // collect all site lists
                const allSites = [
                    ...(regionData.currentList || []),
                    ...(regionData.parentList || []),
                    ...(regionData.childList || []),
                ];
                const uniqueLevels = [...new Set(allSites.map(site => Number(site.nlevel)))].sort((a, b) => a - b);

                // dropdown arrays
                const stateOptions = [];
                const regionalOptions = [];
                const districtOptions = [];
                const subDivisionalOptions = [];

                const currentSite = regionData.currentList?.[0] || null;
                const currentLevel = currentSite ? Number(currentSite.nlevel) : null;

                // disable parents + current site
                const disabledIds = new Set();
                (regionData.currentList || []).forEach(s => disabledIds.add(s.nsitecode));
                (regionData.parentList || []).forEach(s => disabledIds.add(s.nsitecode));

                // helper to process site lists
                const processSiteList = (siteList, isChildList = false) => {
                    siteList.forEach(site => {
                        const option = createOption(site, disabledIds.has(site.nsitecode));

                        // push into correct list
                        if (site.nlevel === uniqueLevels[0]) stateOptions.push(option);
                        else if (site.nlevel === uniqueLevels[1]) regionalOptions.push(option);
                        else if (site.nlevel === uniqueLevels[2]) districtOptions.push(option);
                        else if (site.nlevel === uniqueLevels[3]) subDivisionalOptions.push(option);

                        // auto-select disabled ones
                        if (!isChildList && disabledIds.has(site.nsitecode)) {
                            if (site.nlevel === uniqueLevels[0]) selectedSites.nstatelabcode = option;
                            else if (site.nlevel === uniqueLevels[1]) selectedSites.nregionallabcode = option;
                            else if (site.nlevel === uniqueLevels[2]) selectedSites.ndistrictlabcode = option;
                            else if (site.nlevel === uniqueLevels[3]) selectedSites.nsubdivisionallabcode = option;
                        }
                    });
                };

                // process current + parents
                processSiteList(regionData.currentList || []);
                processSiteList(regionData.parentList || []);

                // prepare village list
                let villageList = [];
                if (currentSite) {
                    const nextLevel = currentLevel + 1;
                    const directChildren = (regionData.childList || []).filter(
                        site => Number(site.nlevel) === nextLevel
                    );

                    // if (directChildren.length > 0) {
                        processSiteList(directChildren, true);

                        dispatch({
                            type: DEFAULT_RETURN,
                            payload: {
                                loading: false,
                                selectedRecord: selectedSites,
                                stateList: stateOptions.sort((a, b) => a.label.localeCompare(b.label)),
                                regionalList: regionalOptions.sort((a, b) => a.label.localeCompare(b.label)),
                                districtList: districtOptions.sort((a, b) => a.label.localeCompare(b.label)),
                                subDivisionalList: subDivisionalOptions.sort((a, b) => a.label.localeCompare(b.label)),
                                villageList,
                                locationList: [],
                                periodList: [], // Added by Gowtham on Oct 2 jira id:SWSM-78
                                nsitehierarchyconfigcode,
                                openModal: true,
                                screenName: params.screenName,
                                loadEsign: false,
                                operation: "create",
                                postParamList: params.postParamList,
                                inputParam: params.inputParam
                            },
                        });
                    // Commented by Gowtham on Oct  2 jira id:SWSM-78
                    // } else {
                    //     // fetch village if no direct children
                    //     rsapi().post("samplerequesting/getVillages", {
                    //         userinfo: params.userInfo,
                    //         primarykey: currentSite.nsitecode,
                    //     })
                    //         .then(villageResp => {
                    //             const data = villageResp.data.villageList || [];
                    //             villageList = data.map(row => ({
                    //                 value: row.nvillagecode,
                    //                 label: row.svillagename,
                    //                 srelation: row.srelation,
                    //                 ssitetypename: (row.ssitetypename || "").toUpperCase(),
                    //                 isDisabled: false
                    //             }));

                    //             selectedSites.nvillagecode = null;
                    //             selectedSites.nsamplelocationcode = null;

                    //             dispatch({
                    //                 type: DEFAULT_RETURN,
                    //                 payload: {
                    //                     loading: false,
                    //                     selectedRecord: selectedSites,
                    //                     stateList: stateOptions.sort((a, b) => a.label.localeCompare(b.label)),
                    //                     regionalList: regionalOptions.sort((a, b) => a.label.localeCompare(b.label)),
                    //                     districtList: districtOptions.sort((a, b) => a.label.localeCompare(b.label)),
                    //                     subDivisionalList: subDivisionalOptions.sort((a, b) => a.label.localeCompare(b.label)),
                    //                     villageList,
                    //                     locationList: [],
                    //                     nsitehierarchyconfigcode,
                    //                     openModal: true,
                    //                     screenName: params.screenName,
                    //                     loadEsign: false,
                    //                     operation: "create",
                    //                     postParamList: params.postParamList,
                    //                     inputParam: params.inputParam
                    //                 },
                    //             });
                    //         })
                    //         .catch(err => {
                    //             if (err.response?.status === 500) {
                    //                 toast.error(err.message);
                    //             }
                    //             dispatch({ type: DEFAULT_RETURN, payload: { loading: false } });
                    //         });
                    // }
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
                    toast.error(error.message);
                } else {
                    toast.warn(error.response.data);
                }
            });
    };
}



export function getSampleRequestingDistrictLabs(addParam, selectedRecord) {
    return function (dispatch) {
        const { userinfo, regionCode } = addParam.inputData;

        dispatch(initRequest(true));

        rsapi().post("samplerequesting/getDistrictLab", {
            userinfo,
            regionCode
        })
            .then(response => {
                const data = response.data.talukaList || [];

                const toOption = (row) => ({
                    value: row.ndistrictcode,
                    label: row.sdistrictname,
                    srelation: row.srelation,
                    ssitetypename: (row.ssitetypename || '').toUpperCase(),
                });

                let districtList = data.map(toOption);
                let subDivisionalList = null;
                let locationList = null;
                let villageList = null;

                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false,
                        selectedRecord,
                        districtList,
                        subDivisionalList,
                        locationList, villageList,
                        ncontrolcode: addParam.inputData.ncontrolcode
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
    };
}

export function getSampleRequestingSubDivisionalLabs(addParam, selectedRecord) {
    return function (dispatch) {
        const { userinfo, regionCode, districtCode } = addParam.inputData;

        dispatch(initRequest(true));

        rsapi().post("samplerequesting/getSubDivisionalLab", {
            userinfo,
            regionCode, districtCode
        })
            .then(response => {
                const data = response.data.cityList || [];

                const toOption = (row) => ({
                    value: row.ncitycode,
                    label: row.scityname,
                    srelation: row.srelation,
                    ssitetypename: (row.ssitetypename || '').toUpperCase(),
                });

                let subDivisionalList = data.map(toOption);
                let locationList = null;
                let villageList = null;


                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false,
                        selectedRecord,
                        subDivisionalList,
                        locationList, villageList,
                        ncontrolcode: addParam.inputData.ncontrolcode
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
    };
}

export function getSampleRequestingVillages(addParam, selectedRecord) {
    return function (dispatch) {
		// added sampleschedulingcode, operation for passing these fields to the below method for getting villages using these fields
        const { userinfo, regionCode, districtCode, cityCode, sampleschedulingcode, operation } = addParam.inputData;
        
        dispatch(initRequest(true));
	
		// added sampleschedulingcode by sujatha ATE_274 for one more check while getting village 
        rsapi().post("samplerequesting/getVillageBasedOnSiteHierarchy", {
            userinfo,regionCode, districtCode, cityCode, sampleschedulingcode
        })
            .then(response => {
                const data = response.data.villageList || [];

                const toOption = (row) => ({
                    value: row.nvillagecode,
                    label: row.svillagename,
                    srelation: row.srelation,
                    ssitetypename: (row.ssitetypename || '').toUpperCase(),
                });

                let villageList = data.map(toOption);
                let locationList = null

                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false,
						//commentted and added sujatha ATE_274 for the drop down & selected record(village & location) not clear while adding requesting and requesting location
                        // selectedRecord,
                        selectedRecord: {
                            ...selectedRecord,         
                            nvillagecode: operation=="create"? undefined: selectedRecord.nvillagecode,
                            nsamplelocationcode:operation=="create"? undefined: selectedRecord.nsamplelocationcode   
                        },
                        villageList,
                        locationList,
                        ncontrolcode: addParam.inputData.ncontrolcode
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
    };
}

export function getSampleRequestingLocations(addParam, selectedRecord) {
    return function (dispatch) {
		// added  sitehierarchyconfigcode, sampleschedulingcode by sujatha ATE_274 SWSM-78 for passing this for the query for getting location
        const { userinfo, regionCode, districtCode, cityCode, villageCode, sitehierarchyconfigcode, sampleschedulingcode } = addParam.inputData;

        dispatch(initRequest(true));
		
		// added  sitehierarchyconfigcode, sampleschedulingcode by sujatha ATE_274 SWSM-78 for passing this for the query for getting location
        rsapi().post("samplerequesting/getLocation", {userinfo,regionCode, districtCode, cityCode, villageCode, sitehierarchyconfigcode, sampleschedulingcode})
            .then(response => {
                const data = response.data.LocationList || [];

                const toOption = (row) => ({
                    value: row.nsamplelocationcode,
                    label: row.ssamplelocationname,
                });

                let locationList = data.map(toOption);

                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false,
                        selectedRecord,
                        locationList,
                        ncontrolcode: addParam.inputData.ncontrolcode
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
    };
}


export function getSampleRequestingPeriods(addParam, selectedRecord) {
    return function (dispatch) {
		//added operation by sujatha ATE_274 swsm-78 for updating selected record loading based on that operation  
        const { userinfo, date, operation } = addParam.inputData;

        dispatch(initRequest(true));

        rsapi().post("samplerequesting/getPeriod", {userinfo,date,operation:'create'})
            .then(response => {
                const data = response.data.periodList || [];

                const toOption = (row) => ({
                    value: row.nsampleschedulingcode,
                    label: row.speriod,
                });

                let periodList = data.map(toOption);

                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false,
						//added operation by sujatha ATE_274 swsm-78 for updating selected record & List's loading based on that operation  
                        //selectedRecord,
                         selectedRecord: {
                            ...selectedRecord,         
                            nvillagecode: operation=="create"? undefined: selectedRecord.nvillagecode,
                            nsamplelocationcode:operation=="create"? undefined: selectedRecord.nsamplelocationcode , 
                        },
                        villageList: operation=="create" && [],
                        locationList:  operation=="create" && [],
                        periodList,
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
    };
}




export function getSampleRequestingData(inputData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("samplerequesting/getSampleRequestingData", { ...inputData.inputData })
            .then(response => {
                let responseData = { ...response.data }

                let masterData = {
                    ...inputData.masterData,
                    ...responseData,


                }
                if (inputData.searchRef !== undefined && inputData.searchRef.current !== null) {
                    inputData.searchRef.current.value = "";
                    masterData['searchedData'] = undefined
                }
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false,
                        masterData,
                        showFilter: false,
                        sampleRequestingSkip: 0,
                        sampleRequestingTake: undefined,
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
    };
}




export function getSampleRequestingRecord(selectedsampleData, getParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("samplerequesting/getSampleRequestingRecord", { nsamplerequestingcode: selectedsampleData.nsamplerequestingcode, userinfo: getParam.userInfo })
            .then(response => {

                // Changed let to const by Gowtham R on Oct 2 jira id: SWSM-78
                const selectedRecord = response.data.selectedSampleRequesting;
                const masterDatadetails = { ...getParam.masterData };
                const sampleRequestingFile = response.data.sampleRequestingFile
                const sampleRequestingLocation = response.data.sampleRequestingLocation
                masterDatadetails['selectedSampleRequesting'] = selectedRecord;
                masterDatadetails['sampleRequestingFile'] = sampleRequestingFile;
                masterDatadetails['sampleRequestingLocation'] = sampleRequestingLocation;

                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        loading: false,
                        masterData: masterDatadetails,
                        selectedRecord,
                        screenName: getParam.screenName,
                        sampleRequestingSkip: getParam.sampleRequestingSkip,
                        sampleRequestingTake: getParam.sampleRequestingTake
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


// export function editSampleRequesting(screenName, operation, primaryKeyName, primaryKeyValue, masterData, userInfo, ncontrolcode) {
//     return function (dispatch) {

//         if (masterData.selectedSampleRequesting.stransdisplaystatus !== "Scheduled") {

//             let urlArray = [];
//             const SampleRequestingID = rsapi().post("samplerequesting/getActiveSampleRequestingById", {
//                 nsamplerequestingcode: primaryKeyValue,
//                 userinfo: userInfo
//             })
//             urlArray = [SampleRequestingID];
//             Axios.all(urlArray)
//                 .then(response => {
//                     //  if (response[4]?.data?.stransdisplaystatus !== "Initiated" && response[4]?.data?.stransdisplaystatus !== "Closed") {

//                     let selectedRecord = {};

//                     if (operation === "update") {
//                         selectedRecord = response[0].data;
//                         selectedRecord["sfromyear"] = new Date(response[0].data.sfromyear);
//                     }

//                     const periodList = [{
//                         value: selectedRecord.nsampleschedulingcode,
//                         label: selectedRecord.speriod
//                     }];


//                     dispatch({
//                         type: DEFAULT_RETURN, payload: {
//                             operation, screenName, selectedRecord, openModal: true,
//                             ncontrolcode: ncontrolcode, loading: false,periodList
//                         }
//                     });
//                     // }
//                     // else {

//                     //     toast.warn(intl.formatMessage({ id: "IDS_SELECTDRAFTRECORDTOEDIT" }));
//                     // }
//                 }
//                 )
//                 .catch(error => {
//                     dispatch({ type: DEFAULT_RETURN, payload: { loading: false } });
//                     if (error.response?.status === 500) {
//                         toast.error(error.message);
//                     } else {
//                         toast.warn(error.response?.data);
//                     }
//                 });
//         }
//         else {
//             toast.warn(intl.formatMessage({ id: "IDS_SELECTPLANNEDRECORD" }));

//         }
//     }
// }




// export function editSampleRequesting(
//   screenName,
//   operation,
//   primaryKeyName,
//   primaryKeyValue,
//   masterData,
//   userInfo,
//   ncontrolcode
// ) {
//   return function (dispatch) {
//     if (masterData.selectedSampleRequesting.stransdisplaystatus === "Planned") {
//       const SampleRequestingID = rsapi().post(
//         "samplerequesting/getActiveSampleRequestingById",
//         {
//           nsamplerequestingcode: primaryKeyValue,
//           userinfo: userInfo,
//         }
//       );

//       Axios.all([SampleRequestingID])
//         .then((response) => {
//           let selectedRecord = {};

//           if (operation === "update") {
//             const editData = response[0].data;

//             selectedRecord = {
//               ...editData,
//               // convert year string into Date object if needed
//               sfromyear: editData.sfromyear ? new Date(editData.sfromyear) : null,

//               //  build dropdown-friendly object for period
//               nsampleschedulingcode: editData.nsampleschedulingcode
//                 ? {
//                     value: editData.nsampleschedulingcode,
//                     label: editData.speriod,
//                   }
//                 : null,
//             };
//           }

//           //  if you also want a periodList for dropdown options
//           const periodList = selectedRecord.nsampleschedulingcode
//             ? [selectedRecord.nsampleschedulingcode]
//             : [];

//           dispatch({
//             type: DEFAULT_RETURN,
//             payload: {
//               operation,
//               screenName,
//               selectedRecord,
//               openModal: true,
//               ncontrolcode: ncontrolcode,
//               loading: false,
//               periodList,
//             },
//           });
//         })
//         .catch((error) => {
//           dispatch({ type: DEFAULT_RETURN, payload: { loading: false } });
//           if (error.response?.status === 500) {
//             toast.error(error.message);
//           } else {
//             toast.warn(error.response?.data);
//           }
//         });
//     } else {
//       toast.warn(intl.formatMessage({ id: "IDS_SELECTPLANNEDRECORD" }));
//     }
//   };
// }
// export function editSampleRequesting( screenName,operation,primaryKeyName,primaryKeyValue, masterData, userInfo,ncontrolcode) {
//   return function (dispatch) {
//     if (masterData.selectedSampleRequesting.ntransactionstatus === transactionStatus.PLANNED) {
//       const SampleRequestingID = rsapi().post(
//         "samplerequesting/getActiveSampleRequestingById",
//         {
//           nsamplerequestingcode: primaryKeyValue,
//           userinfo: userInfo,
//         }
//       );

//       const getDate = rsapi().post("timezone/getLocalTimeByZone", {
//         userinfo: userInfo,
//       });

//       // Fetch both together
//       Axios.all([SampleRequestingID, getDate])
//         .then(([sampleResp, dateResp]) => {
//           let selectedRecord = {};

//           if (operation === "update") {
//             const editData = sampleResp.data;

//             selectedRecord = {
//               ...editData,

//               // convert year string into Date object if needed
//               sfromyear: editData.sfromyear
//                 ? new Date(editData.sfromyear)
//                 : null,

//               // build dropdown-friendly object for period
//               nsampleschedulingcode: editData.nsampleschedulingcode
//                 ? {
//                     value: editData.nsampleschedulingcode,
//                     label: editData.speriod,
//                   }
//                 : null,
//             };
//           }

//           // build periodList if period exists
//           const periodList = selectedRecord.nsampleschedulingcode
//             ? [selectedRecord.nsampleschedulingcode]
//             : [];

//           // rearrange date from timezone service
//           let date = rearrangeDateFormat(userInfo, dateResp.data);

//           // attach date to selectedRecord (like in getScheduled)
          
//           selectedRecord.scollectiondate = date;

//           dispatch({
//             type: DEFAULT_RETURN,
//             payload: {
//               operation,
//               screenName,
//               selectedRecord,
//               openModal: true,
//               ncontrolcode: ncontrolcode,
//               loading: false,
//               periodList,
//               date, // keep raw date also in payload
//             },
//           });
//         })
//         .catch((error) => {
//           dispatch({ type: DEFAULT_RETURN, payload: { loading: false } });
//           if (error.response?.status === 500) {
//             toast.error(error.message);
//           } else {
//             toast.warn(error.response?.data);
//           }
//         });
//     } else {
//       toast.warn(intl.formatMessage({ id: "IDS_SELECTPLANNEDRECORD" }));
//     }
//   };
// }


export function editSampleRequesting(screenName,operation,primaryKeyName,primaryKeyValue,masterData,userInfo,ncontrolcode) {
  return function (dispatch) {
      if ( masterData.selectedSampleRequesting.ntransactionstatus === transactionStatus.PLANNED) {
        // Modified scollectiondate and single service call by Gowtham R on Oct 2 jira id: SWSM-78
        dispatch(initRequest(true));
        const sampleRequestingById = rsapi().post("samplerequesting/getActiveSampleRequestingById", {
            nsamplerequestingcode: primaryKeyValue,
            userinfo: userInfo,
        });
        const getPeriod = rsapi().post("samplerequesting/getPeriod", {
                userinfo: userInfo,
                date: masterData.selectedSampleRequesting.sfromyear, operation:'update'
            });
        Axios.all([sampleRequestingById, getPeriod])
        .then((response) => {
            let selectedRecord = {};

            if (operation === "update") {
                const editData = response[0].data;

                selectedRecord = {
                    ...editData,

                    sfromyear: editData.sfromyear
                        ? new Date(editData.sfromyear)
                        : null,

                    nsampleschedulingcode: editData.nsampleschedulingcode ? 
                        {
                            value: editData.nsampleschedulingcode,
                            label: editData.speriod,
                        }
                    : null
                };
            }
            const data = response[1].data.periodList || [];

            const toOption = (row) => ({
                value: row.nsampleschedulingcode,
                label: row.speriod,
            });

            const periodList = data.map(toOption);

            const [day, month, year] = selectedRecord.scollectiondate.split("/").map(Number);
            const date =  new Date(year, month - 1, day);

            selectedRecord.dcollectiondate = date;

            dispatch({
                type: DEFAULT_RETURN,
                payload: {
                    operation,
                    screenName,
                    selectedRecord,
                    openModal: true,
                    ncontrolcode: ncontrolcode,
                    loading: false,
                    periodList
                }
            });

        })
        .catch((error) => {
            if (error.response) {
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
                }
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } });
                if (error.response.status === 500) {
                    toast.error(error.message);
                } else {
                    toast.warn(error.response.data);
                }
            }
        });
    } else {
      toast.warn(intl.formatMessage({ id: "IDS_SELECTPLANNEDRECORD" }));
    }
  };
}


// export function editSampleRequestingLocation(param) {
//   return function (dispatch) {
//     if (param.masterData.selectedSampleRequesting.stransdisplaystatus === "Planned") {
//       const userInfo = param.userInfo;

//       const editRequest = rsapi().post("samplerequesting/getSampleRequestingLocation", {
//       //  nsampleschedulingcode: param.masterData.selectedSampleScheduling.nsampleschedulingcode,
//       nsamplerequestinglocationcode:param.primaryKeyValue,
//         userinfo: userInfo
//       });

//       const regionRequest = rsapi().post("samplerequesting/getRegion", { userinfo: userInfo });

//       dispatch(initRequest(true));

//       Axios.all([editRequest, regionRequest])
//         .then(Axios.spread((editResponse, regionResponse) => {
//           const editData = editResponse.data.sampleRequestingLocation?.[0] || {};

//           const selectedRecord = {
//             nstatelabcode: null,
//             nregionallabcode: editData.nregioncode
//               ? { value: editData.nregioncode, label: editData.sregionname }
//               : null,
//             ndistrictlabcode: editData.ndistrictcode
//               ? { value: editData.ndistrictcode, label: editData.sdistrictname }
//               : null,
//             nsubdivisionallabcode: editData.ncitycode
//               ? { value: editData.ncitycode, label: editData.scityname }
//               : null,
//             nvillagecode: editData.nvillagecode
//               ? { value: editData.nvillagecode, label: editData.svillagename }
//               : null,
//             nsamplelocationcode: editData.nsamplelocationcode
//               ? { value: editData.nsamplelocationcode, label: editData.ssamplelocationname }
//               : null,
//           };

//           const regionData = regionResponse.data;

//           const createOption = (site, disable = false) => ({
//             value: site.nsitecode,
//             label: site.ssitename,
//             relation: site.srelation,
//             level: Number(site.nlevel),
//             isDisabled: disable
//           });

//           const allSites = [
//             ...(regionData.currentList || []),
//             ...(regionData.parentList || []),
//             ...(regionData.childList || []),
//           ];

//           const uniqueLevels = [...new Set(allSites.map(site => Number(site.nlevel)))].sort((a, b) => a - b);

//           const stateOptions = [];
//           const regionalOptions = [];
//           const districtOptions = [];
//           const subDivisionalOptions = [];

//           const currentSite = regionData.currentList?.[0] || null;
//           const currentLevel = currentSite ? Number(currentSite.nlevel) : null;

//           // --- Determine which sites should be disabled ---
//           const disabledIds = new Set();

//           // Always disable parent sites
//           (regionData.parentList || []).forEach(s => disabledIds.add(s.nsitecode));

//           // Disable current only if childList exists
//           if ((regionData.childList || []).length > 0 && currentSite) {
//             disabledIds.add(currentSite.nsitecode);
//           }

//           const processSiteList = (siteList, isChildList = false) => {
//             siteList.forEach(site => {
//               const option = createOption(site, disabledIds.has(site.nsitecode));

//               // Assign to correct dropdown
//               if (site.nlevel === uniqueLevels[0]) stateOptions.push(option);
//               else if (site.nlevel === uniqueLevels[1]) regionalOptions.push(option);
//               else if (site.nlevel === uniqueLevels[2]) districtOptions.push(option);
//               else if (site.nlevel === uniqueLevels[3]) subDivisionalOptions.push(option);

//               // Auto-select parent sites
//               if (!isChildList && disabledIds.has(site.nsitecode)) {
//                 if (site.nlevel === uniqueLevels[0]) selectedRecord.nstatelabcode = option;
//                 else if (site.nlevel === uniqueLevels[1]) selectedRecord.nregionallabcode = option;
//                 else if (site.nlevel === uniqueLevels[2]) selectedRecord.ndistrictlabcode = option;
//                 else if (site.nlevel === uniqueLevels[3]) selectedRecord.nsubdivisionallabcode = option;
//               }

//               // Prefill based on editData
//               if (site.nsitecode === editData.nregioncode) selectedRecord.nregionallabcode = option;
//               if (site.nsitecode === editData.ndistrictcode) selectedRecord.ndistrictlabcode = option;
//               if (site.nsitecode === editData.ncitycode) selectedRecord.nsubdivisionallabcode = option;
//             });
//           };

//           // Process current and parent sites
//           processSiteList(regionData.currentList || []);
//           processSiteList(regionData.parentList || []);

//           // Process child sites (only next level below current)
//           if (currentSite) {
//             const nextLevel = currentLevel + 1;
//             const directChildren = (regionData.childList || []).filter(
//               site => Number(site.nlevel) === nextLevel
//             );
//             processSiteList(directChildren, true);
//           }

//           // Sort dropdowns alphabetically
//           const sortByLabel = (a, b) => a.label.localeCompare(b.label);
//           stateOptions.sort(sortByLabel);
//           regionalOptions.sort(sortByLabel);
//           districtOptions.sort(sortByLabel);
//           subDivisionalOptions.sort(sortByLabel);

//           dispatch({
//             type: DEFAULT_RETURN,
//             payload: {
//               loading: false,
//               selectedRecord,
//               stateList: stateOptions,
//               regionalList: regionalOptions,
//               districtList: districtOptions,
//               subDivisionalList: subDivisionalOptions,
//               villageList: [],
//               locationList: [],
//               openModal: true,
//               screenName: param.screenName,
//               loadEsign: false,
//               operation: "update",
//               postParamList: param.postParamList,
//               ncontrolcode: param.ncontrolcode
//             }
//           });
//         }))
//         .catch((error) => {
//           dispatch({ type: DEFAULT_RETURN, payload: { loading: false } });
//           if (error.response?.status === 500) {
//             toast.error(error.message);
//           } else {
//             toast.warn(error.response?.data);
//           }
//         });
//     } else {
//       toast.warn(intl.formatMessage({ id: "IDS_SELECTPLANNEDDRECORD" }));
//     }
//   };
// }





// export function editSampleRequestingLocation(param) {
//   return function (dispatch) {
//     if (param.masterData.selectedSampleRequesting.stransdisplaystatus === "Planned") {
//       const userInfo = param.userInfo;

//       const editRequest = rsapi().post("samplerequesting/getSampleRequestingLocation", {
//         nsamplerequestinglocationcode: param.primaryKeyValue,
//         userinfo: userInfo
//       });

//       const regionRequest = rsapi().post("samplerequesting/getRegion", { userinfo: userInfo });

//       dispatch(initRequest(true));

//       Axios.all([editRequest, regionRequest])
//         .then(Axios.spread((editResponse, regionResponse) => {
//           const editData = editResponse.data.sampleRequestingLocation?.[0] || {};

//           // Selected record prefill
//           const selectedRecord = {
//             nstatelabcode: editData.ncentralsitecode ? { value: editData.ncentralsitecode, label: editData.sstatename } : null,
//             nregionallabcode: editData.nregioncode ? { value: editData.nregioncode, label: editData.sregionname } : null,
//             ndistrictlabcode: editData.ndistrictcode ? { value: editData.ndistrictcode, label: editData.sdistrictname } : null,
//             nsubdivisionallabcode: editData.ncitycode ? { value: editData.ncitycode, label: editData.scityname } : null,
//             nvillagecode: editData.nvillagecode ? { value: editData.nvillagecode, label: editData.svillagename } : null,
//             nsamplelocationcode: editData.nsamplelocationcode ? { value: editData.nsamplelocationcode, label: editData.ssamplelocationname } : null,
//           };

//           const regionData = regionResponse.data;

//           // Helper to create option object
//           const createOption = (site, disable = false) => ({
//             value: site.nsitecode,
//             label: site.ssitename,
//             relation: site.srelation,
//             level: Number(site.nlevel),
//             isDisabled: disable
//           });

//           // Combine all sites for processing
//           const allSites = [
//             ...(regionData.currentList || []),
//             ...(regionData.parentList || []),
//             ...(regionData.childList || []),
//           ];

//           const uniqueLevels = [...new Set(allSites.map(site => Number(site.nlevel)))].sort((a, b) => a - b);

//           const stateOptions = [];
//           const regionalOptions = [];
//           const districtOptions = [];
//           const subDivisionalOptions = [];

//           const currentSite = regionData.currentList?.[0] || null;

//           // --- Determine disabled sites ---
//           const disabledIds = new Set();

//           // Always disable parent sites
//           (regionData.parentList || []).forEach(s => disabledIds.add(s.nsitecode));

//           // Always disable current site
//           if (currentSite) disabledIds.add(currentSite.nsitecode);

//           // Process sites into dropdowns
//           const processSiteList = (siteList) => {
//             siteList.forEach(site => {
//               const option = createOption(site, disabledIds.has(site.nsitecode));

//               // Assign to correct dropdown
//               if (site.nlevel === uniqueLevels[0]) stateOptions.push(option);
//               else if (site.nlevel === uniqueLevels[1]) regionalOptions.push(option);
//               else if (site.nlevel === uniqueLevels[2]) districtOptions.push(option);
//               else if (site.nlevel === uniqueLevels[3]) subDivisionalOptions.push(option);

//               // Prefill selectedRecord if matches editData
//               if (site.nsitecode === editData.nregioncode) selectedRecord.nregionallabcode = option;
//               if (site.nsitecode === editData.ndistrictcode) selectedRecord.ndistrictlabcode = option;
//               if (site.nsitecode === editData.ncitycode) selectedRecord.nsubdivisionallabcode = option;
//             });
//           };

//           // Process all sites
//           processSiteList(regionData.currentList || []);
//           processSiteList(regionData.parentList || []);
//           processSiteList(regionData.childList || []);

//           // Sort dropdowns alphabetically
//           const sortByLabel = (a, b) => a.label.localeCompare(b.label);
//           stateOptions.sort(sortByLabel);
//           regionalOptions.sort(sortByLabel);
//           districtOptions.sort(sortByLabel);
//           subDivisionalOptions.sort(sortByLabel);

//           // Dispatch final payload
//           dispatch({
//             type: DEFAULT_RETURN,
//             payload: {
//               loading: false,
//               selectedRecord,
//               stateList: stateOptions,
//               regionalList: regionalOptions,
//               districtList: districtOptions,
//               subDivisionalList: subDivisionalOptions,
//               villageList: [],
//               locationList: [],
//               openModal: true,
//               screenName: param.screenName,
//               loadEsign: false,
//               operation: "update",
//               postParamList: param.postParamList,
//               ncontrolcode: param.ncontrolcode
//             }
//           });
//         }))
//         .catch((error) => {
//           dispatch({ type: DEFAULT_RETURN, payload: { loading: false } });
//           if (error.response?.status === 500) {
//             toast.error(error.message);
//           } else {
//             toast.warn(error.response?.data);
//           }
//         });
//     } else {
//       toast.warn(intl.formatMessage({ id: "IDS_SELECTPLANNEDDRECORD" }));
//     }
//   };
// }





// export function editSampleRequestingLocation(param) {
//   return function (dispatch) {
//     if (param.masterData.selectedSampleRequesting.stransdisplaystatus !== "Planned") {
//       toast.warn(intl.formatMessage({ id: "IDS_SELECTPLANNEDDRECORD" }));
//       return;
//     }

//     const userInfo = param.userInfo;

//     const editRequest = rsapi().post("samplerequesting/getSampleRequestingLocation", {
//       nsamplerequestinglocationcode: param.primaryKeyValue,
//       userinfo: userInfo
//     });

//     const regionRequest = rsapi().post("samplerequesting/getRegion", { userinfo: userInfo });

//     dispatch(initRequest(true));

//     Axios.all([editRequest, regionRequest])
//       .then(Axios.spread((editResponse, regionResponse) => {
//         const editData = editResponse.data.sampleRequestingLocation?.[0] || {};
//         const regionData = regionResponse.data;

//         // Prefill selected record
//         const selectedRecord = {
//           nstatelabcode: editData.ncentralsitecode ? { value: editData.ncentralsitecode, label: editData.sstatename } : null,
//           nregionallabcode: editData.nregioncode ? { value: editData.nregioncode, label: editData.sregionname } : null,
//           ndistrictlabcode: editData.ndistrictcode ? { value: editData.ndistrictcode, label: editData.sdistrictname } : null,
//           nsubdivisionallabcode: editData.ncitycode ? { value: editData.ncitycode, label: editData.scityname } : null,
//           nvillagecode: editData.nvillagecode ? { value: editData.nvillagecode, label: editData.svillagename } : null,
//           nsamplelocationcode: editData.nsamplelocationcode ? { value: editData.nsamplelocationcode, label: editData.ssamplelocationname } : null,
//         };

//         const createOption = (site, disable = false) => ({
//           value: site.nsitecode,
//           label: site.ssitename,
//           relation: site.srelation,
//           level: Number(site.nlevel),
//           isDisabled: disable
//         });

//         const allSites = [
//           ...(regionData.currentList || []),
//           ...(regionData.parentList || []),
//           ...(regionData.childList || [])
//         ];

//         const uniqueLevels = [...new Set(allSites.map(site => Number(site.nlevel)))].sort((a, b) => a - b);

//         const stateOptions = [];
//         const regionalOptions = [];
//         const districtOptions = [];
//         const subDivisionalOptions = [];

//         const currentSite = regionData.currentList?.[0] || null;

//         // Disable parent + current sites
//         const disabledIds = new Set();
//         (regionData.parentList || []).forEach(s => disabledIds.add(s.nsitecode));
//         if (currentSite) disabledIds.add(currentSite.nsitecode);

//         const processSiteList = (siteList, isChild = false) => {
//           siteList.forEach(site => {
//             const option = createOption(site, disabledIds.has(site.nsitecode));

//             // Push into correct dropdown
//             if (site.nlevel === uniqueLevels[0]) stateOptions.push(option);
//             else if (site.nlevel === uniqueLevels[1]) regionalOptions.push(option);
//             else if (site.nlevel === uniqueLevels[2]) districtOptions.push(option);
//             else if (site.nlevel === uniqueLevels[3]) subDivisionalOptions.push(option);

//             // Prefill selectedRecord if matches editData
//             if (site.nsitecode === editData.nregioncode) selectedRecord.nregionallabcode = option;
//             if (site.nsitecode === editData.ndistrictcode) selectedRecord.ndistrictlabcode = option;
//             if (site.nsitecode === editData.ncitycode) selectedRecord.nsubdivisionallabcode = option;
//           });
//         };

//         // Process current + parent sites
//         processSiteList(regionData.currentList || []);
//         processSiteList(regionData.parentList || []);

//         // Helper to dispatch final payload
//         const dispatchPayload = (villageList = [], locationList = []) => {
//           dispatch({
//             type: DEFAULT_RETURN,
//             payload: {
//               loading: false,
//               selectedRecord,
//               stateList: stateOptions.sort((a, b) => a.label.localeCompare(b.label)),
//               regionalList: regionalOptions.sort((a, b) => a.label.localeCompare(b.label)),
//               districtList: districtOptions.sort((a, b) => a.label.localeCompare(b.label)),
//               subDivisionalList: subDivisionalOptions.sort((a, b) => a.label.localeCompare(b.label)),
//               villageList,
//               locationList,
//               openModal: true,
//               screenName: param.screenName,
//               loadEsign: false,
//               operation: "update",
//               postParamList: param.postParamList,
//               ncontrolcode: param.ncontrolcode
//             }
//           });
//         };

//         // Process children if exist
//         if (currentSite) {
//           const nextLevel = Number(currentSite.nlevel) + 1;
//           const directChildren = (regionData.childList || []).filter(site => Number(site.nlevel) === nextLevel);

//           let villageList = [];
//           let locationList = [];

//           // Always push below-child selectedRecord values
//           if (selectedRecord.ndistrictlabcode) districtOptions.push(selectedRecord.ndistrictlabcode);
//           if (selectedRecord.nsubdivisionallabcode) subDivisionalOptions.push(selectedRecord.nsubdivisionallabcode);
//           if (selectedRecord.nvillagecode) villageList.push(selectedRecord.nvillagecode);
//           if (selectedRecord.nsamplelocationcode) locationList.push(selectedRecord.nsamplelocationcode);

//           if (directChildren.length > 0) {
//             processSiteList(directChildren); // child selectable
//             dispatchPayload(villageList, locationList); // include below-child selected values
//           } else {
//             // Call getVillage API if children empty
//             rsapi().post("samplerequesting/getVillage", {
//               userinfo: userInfo,
//               regionCode: editData.nregioncode,
//               districtCode: editData.ndistrictcode,
//               cityCode: editData.ncitycode
//             })
//             .then(response => {
//               villageList = (response.data.villageList || []).map(row => ({
//                 value: row.nvillagecode,
//                 label: row.svillagename,
//                 srelation: row.srelation,
//                 ssitetypename: (row.ssitetypename || '').toUpperCase()
//               }));
//               dispatchPayload(villageList, locationList); // below-child selected values included
//             })
//             .catch(error => {
//               dispatch({ type: DEFAULT_RETURN, payload: { loading: false } });
//               if (error.response?.status === 500) toast.error(error.message);
//               else toast.warn(error.response?.data);
//             });
//           }
//         }

//       }))
//       .catch(error => {
//         dispatch({ type: DEFAULT_RETURN, payload: { loading: false } });
//         if (error.response?.status === 500) toast.error(error.message);
//       });
//   };
// }





export function editSampleRequestingLocation(param) {
  return function (dispatch) {
    if (param.masterData.selectedSampleRequesting.ntransactionstatus !== transactionStatus.PLANNED) {
      toast.warn(intl.formatMessage({ id: "IDS_SELECTPLANNEDRECORD" }));
      return;
    }

    const userInfo = param.userInfo;

    const editRequest = rsapi().post("samplerequesting/getSampleRequestingLocation", {
      nsamplerequestinglocationcode: param.editRow.nsamplerequestinglocationcode,
      userinfo: userInfo
    });

    const regionRequest = rsapi().post("samplerequesting/getRegion", { userinfo: userInfo,
        nsamplerequestingcode: param.masterData.selectedSampleRequesting.nsamplerequestingcode });

    dispatch(initRequest(true));

    //spread->to split the response 1st_parameter for edit and 2nd_parameter for siteheierarchy
    Axios.all([editRequest, regionRequest])
      .then(Axios.spread((editResponse, regionResponse) => {
        const editData = editResponse.data.sampleRequestingLocation?.[0] || {};
        const regionData = regionResponse.data;

        // Prefill selected record
        const selectedRecord = {
          nstatelabcode: editData.ncentralsitecode ? { value: editData.ncentralsitecode, label: editData.sstatename } : null,
          nregionallabcode: editData.nregioncode ? { value: editData.nregioncode, label: editData.sregionname } : null,
          ndistrictlabcode: editData.ndistrictcode ? { value: editData.ndistrictcode, label: editData.sdistrictname } : null,
          nsubdivisionallabcode: editData.ncitycode ? { value: editData.ncitycode, label: editData.scityname } : null,
          nvillagecode: editData.nvillagecode ? { value: editData.nvillagecode, label: editData.svillagename } : null,
          nsamplelocationcode: editData.nsamplelocationcode ? { value: editData.nsamplelocationcode, label: editData.ssamplelocationname } : null,
        };

        const createOption = (site, disable = false) => ({
          value: site.nsitecode,
          label: site.ssitename,
          relation: site.srelation,
          level: Number(site.nlevel),
          isDisabled: disable,
          sitehierarchyconfigcode:site.nsitehierarchyconfigcode || -1   //added by sujatha ATE_274 swsm=78 for passing it to the optionList
        });

        const allSites = [
          ...(regionData.currentList || []),
          ...(regionData.parentList || []),
          ...(regionData.childList || [])
        ];

        const uniqueLevels = [...new Set(allSites.map(site => Number(site.nlevel)))].sort((a, b) => a - b);

        const stateOptions = [];
        const regionalOptions = [];
        const districtOptions = [];
        const subDivisionalOptions = [];
        let villageList = [];
        let locationList = [];

        const currentSite = regionData.currentList?.[0] || null;

        // Disable parent + current sites
        const disabledIds = new Set();
        (regionData.parentList || []).forEach(s => disabledIds.add(s.nsitecode));
        if (currentSite) disabledIds.add(currentSite.nsitecode);

        const processSiteList = (siteList, isChild = false) => {
          siteList.forEach(site => {
            const option = createOption(site, disabledIds.has(site.nsitecode));

            // Push into correct dropdown
            if (site.nlevel === uniqueLevels[0]) stateOptions.push(option);
            else if (site.nlevel === uniqueLevels[1]) regionalOptions.push(option);
            else if (site.nlevel === uniqueLevels[2]) districtOptions.push(option);
            else if (site.nlevel === uniqueLevels[3]) subDivisionalOptions.push(option);

            // Prefill selectedRecord if matches editData
            if (site.nsitecode === editData.nregioncode) selectedRecord.nregionallabcode = option;
            if (site.nsitecode === editData.ndistrictcode) selectedRecord.ndistrictlabcode = option;
            if (site.nsitecode === editData.ncitycode) selectedRecord.nsubdivisionallabcode = option;
          });
        };

        // Process current + parent sites
        processSiteList(regionData.currentList || []);
        processSiteList(regionData.parentList || []);

        // Helper to avoid duplicate options
        const pushIfNotExist = (option, list) => {
          if (option && !list.find(o => o.value === option.value)) list.push(option);
        };

        // Helper to dispatch final payload
        const dispatchPayload = () => {
          // Push selectedRecord values below child (if not exist)
          pushIfNotExist(selectedRecord.ndistrictlabcode, districtOptions);
          pushIfNotExist(selectedRecord.nsubdivisionallabcode, subDivisionalOptions);
          pushIfNotExist(selectedRecord.nvillagecode, villageList);
          pushIfNotExist(selectedRecord.nsamplelocationcode, locationList);

          dispatch({
            type: DEFAULT_RETURN,
            payload: {
              loading: false,
              selectedRecord,
              stateList: stateOptions.sort((a, b) => a.label.localeCompare(b.label)),
              regionalList: regionalOptions.sort((a, b) => a.label.localeCompare(b.label)),
              districtList: districtOptions.sort((a, b) => a.label.localeCompare(b.label)),
              subDivisionalList: subDivisionalOptions.sort((a, b) => a.label.localeCompare(b.label)),
              villageList: villageList.sort((a, b) => a.label.localeCompare(b.label)),
              locationList: locationList.sort((a, b) => a.label.localeCompare(b.label)),
              openModal: true,
              screenName: param.screenName,
              loadEsign: false,
              operation: "update",
              postParamList: param.postParamList,
              ncontrolcode: param.ncontrolcode,
              nsamplerequestinglocationcode:param.editRow.nsamplerequestinglocationcode,
            }
          });
        };

        // Process children if exist
        if (currentSite) {
          const nextLevel = Number(currentSite.nlevel) + 1;
          const directChildren = (regionData.childList || []).filter(site => Number(site.nlevel) === nextLevel);

          if (directChildren.length > 0) {
            processSiteList(directChildren, true);
            dispatchPayload();
          } else {
            // Call getVillage API if children empty
            rsapi().post("samplerequesting/getVillageBasedOnSiteHierarchy", {
              userinfo: userInfo,
              regionCode: editData.nregioncode,
              districtCode: editData.ndistrictcode,
              cityCode: editData.ncitycode,
			//added by sujatha ATE_274 SWSM-78 for query validation
              sampleschedulingcode:param.masterData.selectedSampleRequesting &&
                        param.masterData.selectedSampleRequesting.nsampleschedulingcode
            })
            .then(response => {
              villageList = (response.data.villageList || []).map(row => ({
                value: row.nvillagecode,
                label: row.svillagename,
                srelation: row.srelation,
                ssitetypename: (row.ssitetypename || '').toUpperCase()
              }));
              dispatchPayload();
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

      }))
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
  };
}







export const addSampleRequestingFile = (inputParam) => {
    return (dispatch) => {
        dispatch(initRequest(true));
        let urlArray = [rsapi().post("/linkmaster/getLinkMaster", {
            userinfo: inputParam.userInfo
        })];
        if (inputParam.operation === "update") {
            urlArray.push(rsapi().post("/samplerequesting/editSampleRequestingFile", {
                userinfo: inputParam.userInfo,
                samplerequestingfile: inputParam.selectedRecord
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
                        nsamplerequestingfilecode: editObject.nsamplerequestingfilecode,
                        nattachmenttypecode: editObject.nattachmenttypecode,
                        nlinkcode,
                    };
                } else {
                    selectedRecord = {
                        nattachmenttypecode: response[0].data.AttachmentType.length > 0 ?
                            response[0].data.AttachmentType[0].nattachmenttypecode : attachmentType.FTP,
                        nlinkcode: defaultLink.length > 0 ? defaultLink[0] : "",
                        disabled
                    };
                }
                if (inputParam.operation === "update") {
                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {
                            [inputParam.modalName]: true,
                            operation: inputParam.operation,
                            screenName: inputParam.screenName,
                            ncontrolcode: inputParam.ncontrolcode,
                            selectedRecord,
                            loading: false,
                            linkMaster: linkmaster,
                            showSaveContinue: false,
                            editFiles: editObject.nattachmenttypecode === attachmentType.FTP ? editObject : {},
                            openChildModal: false,
                            openModal: true
                        }
                    });
                }
                else {
                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {
                            [inputParam.modalName]: true,
                            operation: inputParam.operation,
                            screenName: inputParam.screenName,
                            ncontrolcode: inputParam.ncontrolcode,
                            selectedRecord,
                            loading: false,
                            linkMaster: linkmaster,
                            showSaveContinue: false,
                            editFiles: editObject.nattachmenttypecode === attachmentType.FTP ? editObject : {},
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
    }


}





export function getSampleRequesting(inputData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("samplerequesting/getSampleRequestingData", { ...inputData.inputData })
            .then(response => {
                let responseData = { ...response.data }

                let masterData = {
                    ...inputData.masterData,
                    ...responseData,


                }
                if (inputData.searchRef !== undefined && inputData.searchRef.current !== null) {
                    inputData.searchRef.current.value = "";
                    masterData['searchedData'] = undefined
                }
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false,
                        masterData,
                        showFilter: false,
                        sampleRequestingSkip: 0,
                        sampleRequestingTake: undefined,
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
    };
}



export function getSampleRequestingScheduled(scheduledParam) {
    return function (dispatch) {
        if (scheduledParam.masterData.selectedSampleRequesting.ntransactionstatus !==  transactionStatus.SCHEDULED && scheduledParam.masterData.selectedSampleRequesting.ntransactionstatus !== transactionStatus.COMPLETED) {
            const getDate = rsapi().post("timezone/getLocalTimeByZone", { userinfo: scheduledParam.userInfo });
            let urlArray = [getDate];
            dispatch(initRequest(true));
            Axios.all(urlArray)
                .then(response => {
                    let date = rearrangeDateFormat(scheduledParam.userInfo, response[0].data?.date);
                    let selectedRecord = { "dcollectiondate": date } // Changed scollectiondate to dcollectiondate by Gowtham R on Oct 2 jira id: SWSM-78
                    dispatch({
                        type: DEFAULT_RETURN, payload: {
                            loading: false,
                            openModal: true,
                            screenName: "IDS_SCHEDULEDSAMPLEREQUESTING",
                            loadEsign: false,
                            selectedRecord: selectedRecord,
                            date,
                            operation: 'scheduled',
                            ncontrolcode: scheduledParam.ncontrolcode
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
            toast.warn(intl.formatMessage({ id: "IDS_SELECTPLANNEDRECORD" }));
        }
    }
}




export function getSampleRequestingCompleted(completedParam) {
    return function (dispatch) {
        if (completedParam.masterData.selectedSampleRequesting.ntransactionstatus ===  transactionStatus.SCHEDULED) {
            const getDate = rsapi().post("timezone/getLocalTimeByZone", { userinfo: completedParam.userInfo });
            let urlArray = [getDate];
            dispatch(initRequest(true));
            Axios.all(urlArray)
                .then(response => {
                    let date = rearrangeDateFormat(completedParam.userInfo, response[0].data?.date);
                    let selectedRecord = { "dcollectiondate": date } // Changed scollectiondate to dcollectiondate by Gowtham R on Oct 2 jira id: SWSM-78
                    dispatch({
                        type: DEFAULT_RETURN, payload: {
                            loading: false,
                            openModal: true,
                            screenName: "IDS_COMPLETEDSAMPLEREQUESTING",
                            loadEsign: false,
                            selectedRecord: selectedRecord,
                            date,
                            operation: 'completed',
                            ncontrolcode: completedParam.ncontrolcode
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

            toast.warn(intl.formatMessage({ id: "IDS_SELECTSCHEDULEDRECORD" }));
        }
    }
}



export function revertScheduling(plannedParam) {
    return function (dispatch) {
        if (plannedParam.masterData.selectedSampleRequesting.ntransactionstatus ===  transactionStatus.SCHEDULED) {
            const getPlanned = rsapi().post("samplerequesting/plannedSampleRequesting", {
                primarykey: plannedParam.masterData.selectedSampleRequesting.nsamplerequestingcode,
                samplerequesting: plannedParam.masterData.selectedSampleRequesting, userinfo: plannedParam.userInfo
            });
            let urlArray = [getPlanned];
            dispatch(initRequest(true));
            Axios.all(urlArray)
                .then(responseArray => {
                    const response = responseArray[0];  // pick the first element
                    const data = response.data;         // actual backend payload

                    let masterDatadetails = { ...plannedParam.masterData };

                    masterDatadetails['selectedSampleRequesting'] = data.selectedSampleRequesting || {};
                    masterDatadetails['sampleRequestingFile'] = data.sampleRequestingFile || [];
                    masterDatadetails['sampleRequestingLocation'] = data.sampleRequestingLocation || [];

                    masterDatadetails['sampleRequestingRecord'] =
                        (plannedParam.masterData.sampleRequestingRecord || []).map(record =>
                            record.nsamplerequestingcode === data.selectedSampleRequesting.nsamplerequestingcode
                                ? { ...record, ...data.selectedSampleRequesting }  // merge new values
                                : record
                        );
                    dispatch({
                        type: DEFAULT_RETURN, payload: {
                            loading: false,
                            masterData: masterDatadetails,
                            //selectedId,
                            // complaintHistory
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
            toast.warn(intl.formatMessage({ id: "IDS_SELECTSCHEDULEDRECORD" }));
        }
    }
}




export function addSampleRequestingLocation(params) {
    return function (dispatch) {
  
   if(params.masterData.selectedSampleRequesting.ntransactionstatus ===  transactionStatus.PLANNED) {
    // SWSM-78 below line commented by rukshana as of now...once uncomment after checking with negativ scenario
      //dispatch(initRequest(true));
       return rsapi().post("samplerequesting/getRegion", 
            { userinfo: params.userInfo,
             nsamplerequestingcode:params.masterData.selectedSampleRequesting.nsamplerequestingcode})
       // Axios.all([fetchRegion])
            .then((response) => {
                const regionData = response.data;
                const nsitehierarchyconfigcode = regionData.currentList[0].nsitehierarchyconfigcode; 
                // helper to build dropdown option
                const createOption = (site, disable = false) => ({
                    value: site.nsitecode,
                    label: site.ssitename,
                    relation: site.srelation,
                    level: Number(site.nlevel),
                    isDisabled: disable,
                    sitehierarchyconfigcode:site.nsitehierarchyconfigcode || -1 // added by sujatha ATE_274 SWSM-78 for passing into the dropdown to use in the backend get query
                });
 
                const allSites = [
                    ...(regionData.currentList || []),
                    ...(regionData.parentList || []),
                    ...(regionData.childList || []),
                ];
                const uniqueLevels = [...new Set(allSites.map(site => Number(site.nlevel)))].sort((a, b) => a - b);
 
                const stateOptions = [];
                const regionalOptions = [];
                const districtOptions = [];
                const subDivisionalOptions = [];
                const selectedSites = {};
 
                const currentSite = regionData.currentList?.[0] || null;
                const currentLevel = currentSite ? Number(currentSite.nlevel) : null;
 
                // disable set: all parents + current
                const disabledIds = new Set();
                (regionData.currentList || []).forEach(s => disabledIds.add(s.nsitecode));
                (regionData.parentList || []).forEach(s => disabledIds.add(s.nsitecode));
                
 //need to make it as separate method 
                const processSiteList = (siteList, isChildList = false) => {
                    siteList.forEach(site => {
                        const option = createOption(site, disabledIds.has(site.nsitecode));
 
                        // push into correct dropdown
                        if (site.nlevel === uniqueLevels[0]) stateOptions.push(option);
                        else if (site.nlevel === uniqueLevels[1]) regionalOptions.push(option);
                        else if (site.nlevel === uniqueLevels[2]) districtOptions.push(option);
                        else if (site.nlevel === uniqueLevels[3]) subDivisionalOptions.push(option);
 
                        // auto-select if disabled
                        if (!isChildList && disabledIds.has(site.nsitecode)) {
                            if (site.nlevel === uniqueLevels[0]) selectedSites.nstatelabcode = option;
                            else if (site.nlevel === uniqueLevels[1]) selectedSites.nregionallabcode = option;
                            else if (site.nlevel === uniqueLevels[2]) selectedSites.ndistrictlabcode = option;
                            else if (site.nlevel === uniqueLevels[3]) selectedSites.nsubdivisionallabcode = option;
                        }
                    });
                };
 
                // process current + parents
                processSiteList(regionData.currentList || []);
                processSiteList(regionData.parentList || []);
 
                // process child list OR villages
                let villageList = [];
                if (currentSite) {
                    const nextLevel = currentLevel + 1;
                    const directChildren = (regionData.childList || []).filter(
                        site => Number(site.nlevel) === nextLevel
                    );
 
                    if (directChildren.length > 0) {
                        processSiteList(directChildren, true);
 
                        // dispatch immediately since no village call is needed
                        dispatch({
                            type: DEFAULT_RETURN,
                            payload: {
                                loading: false,
                                selectedRecord: selectedSites,
                                stateList: stateOptions.sort((a, b) => a.label.localeCompare(b.label)),
                                regionalList: regionalOptions.sort((a, b) => a.label.localeCompare(b.label)),
                                districtList: districtOptions.sort((a, b) => a.label.localeCompare(b.label)),
                                subDivisionalList: subDivisionalOptions.sort((a, b) => a.label.localeCompare(b.label)),
                                villageList,
                                locationList: [],
                                nsitehierarchyconfigcode,
                                openModal: true,
                                screenName: params.screenName,
                                loadEsign: false,
                                operation: "create",
                                postParamList: params.postParamList,
                            },
                        });
                    } else {
                        // need to call getVillage
                        rsapi().post("samplerequesting/getVillages", {
                            userinfo: params.userInfo,
                            primarykey: currentSite.nsitecode,
							//added by sujatha ATE_274 swsm-117 for validation getVillage script with districtcode & regioncode
                            ndistrictcode:selectedSites.ndistrictlabcode.value,
                            nregioncode:selectedSites.nregionallabcode.value,
                            nsampleschedulingcode: params.masterData.selectedSampleRequesting.nsampleschedulingcode   // added by sujatha ATE_274 SWSM_78 for query validation
                        })
                        .then(villageResp => {
                            const data = villageResp.data.villageList || [];
                            villageList = data.map(row => ({
                                value: row.nvillagecode,
                                label: row.svillagename,
                                srelation: row.srelation,
                                ssitetypename: (row.ssitetypename || '').toUpperCase(),
                                isDisabled: false
                            }));
 
                            selectedSites.nvillagecode = null;
                            selectedSites.nsamplelocationcode = null;
 
                            // dispatch after villages are fetched
                            dispatch({
                                type: DEFAULT_RETURN,
                                payload: {
                                    loading: false,
                                    selectedRecord: selectedSites,
                                    stateList: stateOptions.sort((a, b) => a.label.localeCompare(b.label)),
                                    regionalList: regionalOptions.sort((a, b) => a.label.localeCompare(b.label)),
                                    districtList: districtOptions.sort((a, b) => a.label.localeCompare(b.label)),
                                    subDivisionalList: subDivisionalOptions.sort((a, b) => a.label.localeCompare(b.label)),
                                    villageList,
                                    locationList: [],
                                    openModal: true,
                                    screenName: params.screenName,
                                    loadEsign: false,
                                    operation: "create",
                                    postParamList: params.postParamList,
                                },
                            });
                        })
                        .catch(err => {
                            dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                            if (err.response?.status === 429) {
                                toast.warn(intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
                            } else if (err.response?.status === 401 || err.response?.status === 403) {
                                dispatch({
                                    type: UN_AUTHORIZED_ACCESS,
                                    payload: {
                                        navigation: 'forbiddenaccess',
                                        loading: false,
                                        responseStatus: err.response.status
                                    }
                                });
                            } else if (err.response?.status === 500) {
                                toast.err(err.message);
                            } else {
                                toast.warn(err.response.data);
                            }
                        });
                    }
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
                    toast.error(error.message);
                } else {
                    toast.warn(error.response.data);
                }
            });
        } else {
            toast.warn(intl.formatMessage({ id: "IDS_SELECTPLANNEDRECORD" }));
        }
    }

}

//Added by sonia on 2nd oct 2025 for jira id:SWSM-77
export function sendReportByMailSampleRequesting(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("samplerequesting/sendReportByMail", inputParam.inputData)
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