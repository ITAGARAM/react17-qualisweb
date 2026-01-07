import rsapi from '../rsapi';
import { DEFAULT_RETURN, UN_AUTHORIZED_ACCESS } from './LoginTypes';
import { toast } from 'react-toastify';
import Axios from 'axios';
import { initRequest } from './LoginAction';
import { intl } from '../components/App';

export function addSampleLocation(params) {
    return async function (dispatch) {
        dispatch(initRequest(true));

        const fetchRegion = rsapi().post("samplelocation/getRegion", {
            userinfo: params.userInfo
        });

        // try {
        //     const responses = await Axios.all([fetchRegion]);
        //     const regionData = responses[0].data;

        Axios.all([fetchRegion])
            .then((responses) => {
                const regionData = responses[0].data;
                //    const sitehierarchyconfigcode = regionData.currentList[0].nsitehierarchyconfigcode;
                const sitehierarchyconfigcode = regionData.currentList && regionData.currentList[0].nsitehierarchyconfigcode || null;

                const createOption = (site, disable = false) => ({
                    value: site.nsitecode,
                    label: site.ssitename,
                    relation: site.srelation,
                    level: Number(site.nlevel),
                    nsitehierarchyconfigcode: site.nsitehierarchyconfigcode,
                    isDisabled: disable
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
                const cityOptions = [];
                const selectedSites = {};

                const currentSite = regionData.currentList?.[0] || null;
                const currentLevel = currentSite ? Number(currentSite.nlevel) : null;

                if (!currentSite) {
                    const createPayload = {
                        // ...commonPayload,
                        openModal: true,
                        selectedRecord: selectedSites,
                        screenName: params.screenName,
                        loadEsign: false,
                        operation: "create",
                        loading: false,
                        // postParamList: params.postParamList,
                        villageList: [],
                        stateList: [],
                        regionList: [],
                        districtList: [],
                        cityList: [],
                    };
                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: createPayload,
                    });
                    return
                }

                //  disable set: all parents + current
                const disabledIds = new Set();
                (regionData.currentList || []).forEach(s => disabledIds.add(s.nsitecode));
                (regionData.parentList || []).forEach(s => disabledIds.add(s.nsitecode));

                const processSiteList = (siteList, isChildList = false) => {
                    siteList.forEach(site => {
                        const option = createOption(site, disabledIds.has(site.nsitecode));

                        if (site.nlevel === uniqueLevels[0]) stateOptions.push(option);
                        else if (site.nlevel === uniqueLevels[1]) regionalOptions.push(option);
                        else if (site.nlevel === uniqueLevels[2]) districtOptions.push(option);
                        else if (site.nlevel === uniqueLevels[3]) cityOptions.push(option);

                        if (!isChildList && disabledIds.has(site.nsitecode)) {
                            // if (
                            //     site.srelation === "Current" ||
                            //     site.srelation === "Parent" ||
                            //     siteList === regionData.parentList
                            // ) {
                            if (site.nlevel === uniqueLevels[0]) selectedSites.ncentralsitecode = option;
                            else if (site.nlevel === uniqueLevels[1]) selectedSites.nregioncode = option;
                            else if (site.nlevel === uniqueLevels[2]) selectedSites.ndistrictcode = option;
                            else if (site.nlevel === uniqueLevels[3]) selectedSites.ncitycode = option;
                            // }
                        }
                    });
                };

                // Process current and parent lists
                processSiteList(regionData.currentList || []);
                processSiteList(regionData.parentList || []);

                let villageList = [];

                // Handle child sites or fetch village list
                if (currentSite) {
                    const nextLevel = currentLevel + 1;
                    const directChildren = (regionData.childList || []).filter(
                        site => Number(site.nlevel) === nextLevel
                    );

                    if (directChildren.length > 0) {
                        processSiteList(directChildren, true);

                        const commonPayload = {
                            loading: false,
                            villageList,
                            stateList: stateOptions,
                            regionList: regionalOptions,
                            districtList: districtOptions,
                            cityList: cityOptions,
                            sitehierarchyconfigcode
                        };

                        const createPayload = {
                            ...commonPayload,
                            openModal: true,
                            selectedRecord: selectedSites,
                            screenName: params.screenName,
                            loadEsign: false,
                            operation: "create",
                            postParamList: params.postParamList,
                        };

                        dispatch({
                            type: DEFAULT_RETURN,
                            payload: createPayload,
                        });

                    }
                    else {
                        // try {
                        //     const villageResp = await rsapi().post("samplelocation/getVillage", {
                        //         userinfo: params.userInfo,
                        //         primarykey: currentSite.nsitecode,
                        //         nsitehierarchyconfigcode: cityOptions[0].nsitehierarchyconfigcode
                        //     });

                        rsapi().post("samplelocation/getVillage", {
                            userinfo: params.userInfo,
                            primarykey: currentSite.nsitecode,
                            // commented and added by sujatha SWSM-5 render once when the district for the region is not there.. to fix that the below code 
                            // nsitehierarchyconfigcode: cityOptions[0].nsitehierarchyconfigcode
                            nsitehierarchyconfigcode: (cityOptions && cityOptions.length > 0) ? cityOptions[0].nsitehierarchyconfigcode : 0
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

                                // const data = villageResp.data.villageList || [];
                                // villageList = data.map(row => ({
                                //     value: row.nvillagecode,
                                //     label: row.svillagename,
                                //     srelation: row.srelation,
                                //     ssitetypename: (row.ssitetypename || '').toUpperCase(),
                                //     isDisabled: false
                                // }));

                                selectedSites.nvillagecode = null;
                                // } catch (err) {
                                //     toast.error(err.message);
                                // }

                                const commonPayload = {
                                    loading: false,
                                    villageList,
                                    stateList: stateOptions,
                                    regionList: regionalOptions,
                                    districtList: districtOptions,
                                    cityList: cityOptions,
                                    sitehierarchyconfigcode
                                };

                                const createPayload = {
                                    ...commonPayload,
                                    openModal: true,
                                    selectedRecord: selectedSites,
                                    screenName: params.screenName,
                                    loadEsign: false,
                                    operation: "create",
                                    postParamList: params.postParamList,
                                };

                                dispatch({
                                    type: DEFAULT_RETURN,
                                    payload: createPayload,
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
            // const sortByLabel = (a, b) => a.label.localeCompare(b.label);
            // stateOptions.sort(sortByLabel);
            // regionalOptions.sort(sortByLabel);
            // districtOptions.sort(sortByLabel);
            // cityOptions.sort(sortByLabel);



            // }
            //  catch (error) {
            //     dispatch({ type: DEFAULT_RETURN, payload: { loading: false } });

            //     const errorMsg =
            //         error.response?.data?.message ||
            //         error.message || "";

            //     toast.error(errorMsg);
            // }
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


export function getDistrict(addParam, selectedRecord) {
    return function (dispatch) {
        const { userinfo, primarykey } = addParam.inputData;

        dispatch(initRequest(true));

        rsapi().post("samplelocation/getDistrict", {
            userinfo,
            primarykey
        })
            .then(response => {
                const data = response.data.talukaList || [];

                const toOption = (row) => ({
                    value: row.nsitecode,
                    label: row.ssitename,
                    srelation: row.srelation,
                    ssitetypename: (row.ssitetypename || '').toUpperCase(),
                });

                let districtList = data.map(toOption);
                // let cityList = null;
                // let locationList = null;
                // let villageList = null;

                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false,
                        selectedRecord,
                        districtList,
                        cityList: [],
                        // locationList,
                        villageList: [],
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

export function getTaluka(addParam, selectedRecord) {
    return function (dispatch) {
        const { userinfo, primarykey } = addParam.inputData;

        dispatch(initRequest(true));

        rsapi().post("samplelocation/getTaluka", {
            userinfo,
            primarykey
        })
            .then(response => {
                const data = response.data.talukaList || [];

                const toOption = (row) => ({
                    value: row.nsitecode,
                    label: row.ssitename,
                    srelation: row.srelation,
                    ssitetypename: (row.ssitetypename || '').toUpperCase(),
                    nsitehierarchyconfigcode: row.nsitehierarchyconfigcode
                });

                let cityList = data.map(toOption);
                // let locationList = null;
                // let villageList = null;


                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false,
                        selectedRecord,
                        cityList,
                        // locationList,
                        villageList: [],
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


export function getVillage(addParam, selectedRecord) {
    return function (dispatch) {
        const { userinfo, primarykey, scityname, nsitehierarchyconfigcode } = addParam.inputData;

        dispatch(initRequest(true));

        rsapi().post("samplelocation/getVillage", {
            userinfo,
            primarykey, scityname, nsitehierarchyconfigcode
        })
            .then(response => {
                const data = response.data.villageList || [];

                const toOption = (row) => ({
                    value: row.nvillagecode,
                    label: row.svillagename,
                });
                let villageList = data.map(toOption);
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false,
                        selectedRecord,
                        villageList,
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

export function saveSampleLocation(inputParam, masterData) {
    return function (dispatch) {

        dispatch(initRequest(true));

        let urlArray = [];
        const service1 = rsapi().post("samplelocation/" + inputParam.operation + "SampleLocation", inputParam.inputData);
        const service2 = rsapi().post("timezone/getLocalTimeByZone", {
            userinfo: inputParam.inputData.userinfo
        });

        urlArray = [service1, service2]

        Axios.all(urlArray).then(response => {
            let openModal = false;
            if (inputParam.saveType === 2) {
                openModal = true;
            }
            // let date = rearrangeDateFormat(inputParam.inputData.userinfo, response[0].data.attendenceDate);
            masterData = {
                ...masterData,
                SampleLocation: response[0].data.SampleLocation
            }
            let selectedRecord = { ...inputParam.selectedRecord, "ssamplelocationname": "", "slatitude": "", "slongitude": "", "sdescription": "" }

            dispatch({
                type: DEFAULT_RETURN, payload: {
                    masterData,
                    selectedRecord,
                    openModal: openModal,
                    loading: false,
                    loadEsign: false
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
                    toast.error(error.message);
                }
                else {
                    toast.warn(error.response.data);
                }
            })
    }
}

//modified by sujatha ATE_274 SWSM-78 for changed from dispatching the addsamplelocation in the edit action to separtely calling that service call in the same edit action 
//this changes done while want to fix from No option value in the drop down to get the selected value in the drop down
// export function getActiveSampleLocationById(editParam) {
//     return function (dispatch) {

//         let selectedId = null;
//         dispatch(initRequest(true));

//         // const addParam = {
//         //     userInfo: editParam.userInfo,
//         //     screenName: editParam.screenName,
//         // };
//         // dispatch(addSampleLocation(addParam, true));

//         // let villageList = [];
//         rsapi().post("samplelocation/getActiveSampleLocationById", { [editParam.primaryKeyField]: editParam.editRow.nsamplelocationcode, "userinfo": editParam.userInfo })
//             .then(response => {
//                 selectedId = editParam.editRow.nsamplelocationcode;
//                 let slname = [];
//                 slname.push({
//                     "value": response.data.activeSampleLocationById["ncentralsitecode"],
//                     "label": response.data.activeSampleLocationById["scentralsitename"]
//                 });
//                 slname.push({
//                     "value": response.data.activeSampleLocationById["nregioncode"],
//                     "label": response.data.activeSampleLocationById["sregionname"]
//                 });
//                 slname.push({
//                     "value": response.data.activeSampleLocationById["ndistrictcode"],
//                     "label": response.data.activeSampleLocationById["sdistrictname"]
//                 });
//                 slname.push({
//                     "value": response.data.activeSampleLocationById["ncitycode"],
//                     "label": response.data.activeSampleLocationById["scityname"]
//                 });
//                 slname.push({
//                     "value": response.data.activeSampleLocationById["nvillagecode"],
//                     "label": response.data.activeSampleLocationById["svillagename"]
//                 });

//                 let masterData = { ...editParam.masterData }
//                 let selectedRecord = {
//                     ...editParam.selectedRecord, "ssamplelocationname": response.data.activeSampleLocationById['ssamplelocationname'],
//                     "slatitude": response.data.activeSampleLocationById['slatitude'],
//                     "slongitude": response.data.activeSampleLocationById['slongitude'],
//                     "sdescription": response.data.activeSampleLocationById['sdescription']
//                 }
//                 selectedRecord["ncentralsitecode"] = slname[0];
//                 selectedRecord["nregioncode"] = slname[1];
//                 selectedRecord["ndistrictcode"] = slname[2];
//                 selectedRecord["ncitycode"] = slname[3];
//                 selectedRecord["nvillagecode"] = slname[4];
//                 dispatch({
//                     type: DEFAULT_RETURN, payload: {
//                         masterData,
//                         selectedRecord,
//                         operation: editParam.operation,
//                         ncontrolcode: editParam.ncontrolCode,
//                         openModal: true,
//                         loading: false,
//                         selectedId,
//                         // villageList,
//                         dataState: editParam.dataState,
//                         screenName: editParam.screenName
//                     }
//                 });
//             })
//             .catch(error => {
//                 dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
//                 if (error.response?.status === 429) {
//                    toast.warn(intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
//                    dispatch({ type: DEFAULT_RETURN, payload: { loading: false } });
//                } else if (error.response?.status === 401 || error.response?.status === 403) {
//                     dispatch({
//                         type: UN_AUTHORIZED_ACCESS,
//                         payload: {
//                             navigation: 'forbiddenaccess',
//                             loading: false,
//                             responseStatus: error.response.status
//                         }

//                     });
//                 } else if (error.response.status === 500) {
//                     toast.error(error.message);
//                 }
//                 else {
//                     toast.warn(error.response.data);
//                 }
//             })
//     }

// }

// modifed by sujatha ATE_274 SWSM-78  03-10-2025 for getting drop down with the selected value instead of no option, for that instead of dispatching addSampleLocation
// getRegion called here and processed the Option List
export function getActiveSampleLocationById(editParam) {
    return function (dispatch) {
        let selectedId = null;
        dispatch(initRequest(true));

        const service1 = rsapi().post("samplelocation/getActiveSampleLocationById", {
            [editParam.primaryKeyField]: editParam.editRow.nsamplelocationcode,
            userinfo: editParam.userInfo
        });

        const service2 = rsapi().post("samplelocation/getRegion", {
            userinfo: editParam.userInfo
        });

        Axios.all([service1, service2])
            .then(([response, regionResp]) => {
                selectedId = editParam.editRow.nsamplelocationcode;
                const active = response.data.activeSampleLocationById;
                const regionData = regionResp.data;

                // Process region data (same logic as in addSampleLocation)
                const createOption = (site, disable = false) => ({
                    value: site.nsitecode,
                    label: site.ssitename,
                    relation: site.srelation,
                    level: Number(site.nlevel),
                    nsitehierarchyconfigcode: site.nsitehierarchyconfigcode,
                    isDisabled: disable
                });

                const allSites = [
                    ...(regionData.currentList || []),
                    ...(regionData.parentList || []),
                    ...(regionData.childList || []),
                ];

                const uniqueLevels = [...new Set(allSites.map(site => Number(site.nlevel)))].sort((a, b) => a - b);

                const stateList = [];
                const regionList = [];
                const districtList = [];
                const cityList = [];
                const selectedSites = {};

                const currentSite = regionData.currentList?.[0] || null;
                const currentLevel = currentSite ? Number(currentSite.nlevel) : null;

                const disabledIds = new Set();
                (regionData.currentList || []).forEach(s => disabledIds.add(s.nsitecode));
                (regionData.parentList || []).forEach(s => disabledIds.add(s.nsitecode));

                const processSiteList = (siteList, isChildList = false) => {
                    siteList.forEach(site => {
                        const option = createOption(site, disabledIds.has(site.nsitecode));

                        if (site.nlevel === uniqueLevels[0]) stateList.push(option);
                        else if (site.nlevel === uniqueLevels[1]) regionList.push(option);
                        else if (site.nlevel === uniqueLevels[2]) districtList.push(option);
                        else if (site.nlevel === uniqueLevels[3]) cityList.push(option);

                        if (!isChildList && disabledIds.has(site.nsitecode)) {
                            if (site.nlevel === uniqueLevels[0]) selectedSites.ncentralsitecode = option;
                            else if (site.nlevel === uniqueLevels[1]) selectedSites.nregioncode = option;
                            else if (site.nlevel === uniqueLevels[2]) selectedSites.ndistrictcode = option;
                            else if (site.nlevel === uniqueLevels[3]) selectedSites.ncitycode = option;
                        }
                    });
                };

                processSiteList(regionData.currentList || []);
                processSiteList(regionData.parentList || []);
                const nextLevel = currentLevel + 1;
                const directChildren = (regionData.childList || []).filter(
                    site => Number(site.nlevel) === nextLevel
                );

                let villageList = [];

                const finalDispatch = () => {
                    // Format for existing slname list
                    const slname = [
                        { value: active.ncentralsitecode, label: active.scentralsitename },
                        { value: active.nregioncode, label: active.sregionname },
                        { value: active.ndistrictcode, label: active.sdistrictname },
                        { value: active.ncitycode, label: active.scityname },
                        { value: active.nvillagecode, label: active.svillagename }
                    ];

                    const selectedRecord = {
                        ...editParam.selectedRecord,
                        ssamplelocationname: active.ssamplelocationname,
                        slatitude: active.slatitude,
                        slongitude: active.slongitude,
                        sdescription: active.sdescription,
                        ncentralsitecode: slname[0],
                        nregioncode: slname[1],
                        ndistrictcode: slname[2],
                        ncitycode: slname[3],
                        nvillagecode: slname[4]
                    };

                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {
                            masterData: { ...editParam.masterData },
                            selectedRecord,
                            operation: editParam.operation,
                            ncontrolcode: editParam.ncontrolCode,
                            openModal: true,
                            loading: false,
                            selectedId,
                            dataState: editParam.dataState,
                            screenName: editParam.screenName,
                            // Injected lists from region processing
                            stateList,
                            regionList:
                                [
                                    ...regionList,
                                    ...(selectedRecord.nregioncode &&
                                        !regionList.some(opt => opt.value === selectedRecord.nregioncode.value)
                                        ? [{
                                            ...selectedRecord.nregioncode,
                                            isDisabled: true
                                        }]
                                        : [])
                                ],
                            districtList:
                                [
                                    ...districtList,
                                    ...(selectedRecord.ndistrictcode &&
                                        !districtList.some(opt => opt.value === selectedRecord.ndistrictcode.value)
                                        ? [{
                                            ...selectedRecord.ndistrictcode,
                                            isDisabled: true
                                        }]
                                        : [])
                                ],
                            cityList:[
                                    ...cityList,
                                    ...(selectedRecord.ncitycode &&
                                        !cityList.some(opt => opt.value === selectedRecord.ncitycode.value)
                                        ? [{
                                            ...selectedRecord.ncitycode,
                                            isDisabled: true
                                        }]
                                        : [])
                                ],
                            villageList:
                                [
                                    ...villageList,
                                    ...(selectedRecord.nvillagecode &&
                                        !villageList.some(opt => opt.value === selectedRecord.nvillagecode.value)
                                        ? [{
                                            ...selectedRecord.nvillagecode,
                                            isDisabled: true
                                        }]
                                        : [])
                                ],
                            // selectedSites
                        }
                    });
                };

                if (directChildren.length > 0) {
                    processSiteList(directChildren, true);
                    finalDispatch(); // No village call needed
                } else {
                    // Fetch villages if no direct children
                    rsapi().post("samplelocation/getVillage", {
                        userinfo: editParam.userInfo,
                        primarykey: currentSite.nsitecode,
                        nsitehierarchyconfigcode: (cityList && cityList.length > 0) ? cityList[0].nsitehierarchyconfigcode : 0
                    }).then(villageResp => {
                        villageList = (villageResp.data.villageList || []).map(row => ({
                            value: row.nvillagecode,
                            label: row.svillagename,
                            srelation: row.srelation,
                            ssitetypename: (row.ssitetypename || '').toUpperCase(),
                            isDisabled: false
                        }));
                        finalDispatch();
                    }).catch(err => {
                        // Fail gracefully if getVillage fails
                        finalDispatch();
                    });
                }
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
                } else if (error.response?.status === 500) {
                    toast.error(error.message);
                } else {
                    toast.warn(error.response.data);
                }
            });
    };
}
