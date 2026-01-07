import rsapi from '../rsapi';
import { DEFAULT_RETURN, UN_AUTHORIZED_ACCESS } from './LoginTypes';
import { toast } from 'react-toastify';
import { initRequest } from './LoginAction';
import Axios from 'axios';
import { rearrangeDateFormat, constructOptionList, } from '../components/CommonScript'
import { intl } from '../components/App';
import { transactionStatus, attachmentType } from '../components/Enumeration';

// export function addGetRegion(addParam) {
//     return function (dispatch) {
//         let userInfo = addParam.userInfo;
//         const getRegion = rsapi.post("customercomplaint/getRegion", { userinfo: userInfo });
//         const getDate = rsapi.post("timezone/getLocalTimeByZone", { userinfo: userInfo });
//         let urlArray = [getRegion, getDate];
//         dispatch(initRequest(true));
//         Axios.all(urlArray)
//             .then(response => {
//                   const regionData = response[0].data;
//                 //const constructType = constructOptionList(response[0].data || [], "nregioncode", "sregionname", undefined, undefined, false);
//                // const regionList = constructType.get("OptionList");
//                // let districtList;
//                // let cityList;
//                // let villageList;
//                 let date = rearrangeDateFormat(userInfo, response[1].data);
//                 let selectedRecord = { "dcomplaintdate": date }
//                 let postParamList = addParam.postParamList

//   //const regionData = responses[0].data;

//                     const createOption = (site) => ({
//                         value: site.nsitecode,
//                         label: site.ssitename,
//                         relation: site.srelation,
//                         level: Number(site.nlevel),
//                     });

//                     const allSites = [
//                         ...(regionData.currentList || []),
//                         ...(regionData.parentList || []),
//                         ...(regionData.childList || []),
//                     ];

//                     const uniqueLevels = [...new Set(allSites.map(site => Number(site.nlevel)))].sort((a, b) => a - b);

//                     const stateOptions = [];
//                     const regionalOptions = [];
//                     const districtOptions = [];
//                     const subDivisionalOptions = [];
//                  const selectedSites = {};

//                     const currentSite = regionData.currentList?.[0] || null;
//                     const currentLevel = currentSite ? Number(currentSite.nlevel) : null;

//                     const processSiteList = (siteList, isChildList = false) => {
//                         siteList.forEach(site => {
//                             const option = createOption(site);

//                             // Assign to correct dropdown
//                             if (site.nlevel === uniqueLevels[0]) stateOptions.push(option);
//                             else if (site.nlevel === uniqueLevels[1]) regionalOptions.push(option);
//                             else if (site.nlevel === uniqueLevels[2]) districtOptions.push(option);
//                             else if (site.nlevel === uniqueLevels[3]) subDivisionalOptions.push(option);

//                             //SWSM-19 to add two additional Field
//                             //   else if (site.nlevel === uniqueLevels[4]) CityOptions.push(option);
//                             //   else if (site.nlevel === uniqueLevels[5]) VillageOptions.push(option);


//                             // Auto-select current or parent sites
//                             if (!isChildList) {
//                                 if (
//                                     site.srelation === "Current" ||
//                                     site.srelation === "Parent" ||
//                                     siteList === regionData.parentList
//                                 ) {
//                                     if (site.nlevel === uniqueLevels[0]) selectedSites.nstatelabcode = option;
//                                     else if (site.nlevel === uniqueLevels[1]) selectedSites.nregionallabcode = option;
//                                     else if (site.nlevel === uniqueLevels[2]) selectedSites.ndistrictlabcode = option;
//                                     else if (site.nlevel === uniqueLevels[3]) selectedSites.nsubdivisionallabcode = option;
//                                      //SWSM-19 to add two additional Field
//                                  //   else if (site.nlevel === uniqueLevels[4]) CityOptions.push(option);
//                                   //   else if (site.nlevel === uniqueLevels[5]) VillageOptions.push(option);
//                                 }
//                             }
//                         });
//                     };

//                     // Process parent and current sites
//                     processSiteList(regionData.currentList || []);
//                     processSiteList(regionData.parentList || []);

//                     // --- CHILD DROPDOWN FIX (only next level below current) ---
//                     if (currentSite) {
//                         const nextLevel = currentLevel + 1; // only next level
//                         const directChildren = (regionData.childList || []).filter(
//                             site => Number(site.nlevel) === nextLevel
//                         );
//                         processSiteList(directChildren, true); // true = do not auto-select
//                     }

//                     // Sort dropdowns alphabetically
//                     const sortByLabel = (a, b) => a.label.localeCompare(b.label);
//                     stateOptions.sort(sortByLabel);
//                     regionalOptions.sort(sortByLabel);
//                     districtOptions.sort(sortByLabel);
//                     subDivisionalOptions.sort(sortByLabel);

//                 dispatch({
//                     type: DEFAULT_RETURN, payload: {
//                     //     loading: false,
//                     //     openModal: true,
//                     //     screenName: "IDS_CUSTOMERCOMPLAINT",
//                     //     loadEsign: false,
//                     //     selectedRecord,
//                     //     operation: 'create',
//                     //     districtList,
//                     //     cityList,
//                     //     villageList,
//                     //     date,
//                     //    postParamList

//                             loading: false,
//                             selectedRecord: selectedRecord,
//                            selectedRecord :selectedSites,
//                             stateList: stateOptions,
//                             regionalList: regionalOptions,
//                             districtList: districtOptions,
//                             subDivisionalList: subDivisionalOptions,
//                             villageList: [],
//                             locationList: [],
//                             openModal: true,
//                              screenName: "IDS_CUSTOMERCOMPLAINT",
//                              loadEsign: false,
//                             operation: "create",
//                             date,
//                             postParamList
//                     }
//                 });
//             })
//             .catch(error => {
//                 dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
//                 if (error.response.status === 500) {
//                     toast.error(error.message);
//                 }
//                 else {
//                     toast.warn(error.response.data);
//                 }

//             })
//     }
// }


// export function addGetRegion(addParam) {
//     return function (dispatch) {
//         let userInfo = addParam.userInfo;
//         const getRegion = rsapi.post("customercomplaint/getRegion", { userinfo: userInfo });
//         const getDate = rsapi.post("timezone/getLocalTimeByZone", { userinfo: userInfo });
//         let urlArray = [getRegion, getDate];

//         dispatch(initRequest(true));

//         Axios.all(urlArray)
//             .then(async (response) => {
//                 const regionData = response[0].data;
//                 let date = rearrangeDateFormat(userInfo, response[1].data);

//                 // complaint date record
//                 let complaintRecord = { dcomplaintdate: date };
//                 let postParamList = addParam.postParamList;

//                 // helper for dropdown options
//                 const createOption = (site) => ({
//                     value: site.nsitecode,
//                     label: site.ssitename,
//                     relation: site.srelation,
//                     level: Number(site.nlevel),
//                 });

//                 const allSites = [
//                     ...(regionData.currentList || []),
//                     ...(regionData.parentList || []),
//                     ...(regionData.childList || []),
//                 ];

//                 const uniqueLevels = [...new Set(allSites.map(site => Number(site.nlevel)))].sort((a, b) => a - b);

//                 const stateOptions = [];
//                 const regionalOptions = [];
//                 const districtOptions = [];
//                 const subDivisionalOptions = [];
//                 const selectedSites = {};

//                 const currentSite = regionData.currentList?.[0] || null;
//                 const currentLevel = currentSite ? Number(currentSite.nlevel) : null;

//                 const processSiteList = (siteList, isChildList = false) => {
//                     siteList.forEach(site => {
//                         const option = createOption(site);

//                         if (site.nlevel === uniqueLevels[0]) stateOptions.push(option);
//                         else if (site.nlevel === uniqueLevels[1]) regionalOptions.push(option);
//                         else if (site.nlevel === uniqueLevels[2]) districtOptions.push(option);
//                         else if (site.nlevel === uniqueLevels[3]) subDivisionalOptions.push(option);

//                         if (!isChildList) {
//                             if (
//                                 site.srelation === "Current" ||
//                                 site.srelation === "Parent" ||
//                                 siteList === regionData.parentList
//                             ) {
//                                 if (site.nlevel === uniqueLevels[0]) selectedSites.nstatelabcode = option;
//                                 else if (site.nlevel === uniqueLevels[1]) selectedSites.nregionallabcode = option;
//                                 else if (site.nlevel === uniqueLevels[2]) selectedSites.ndistrictlabcode = option;
//                                 else if (site.nlevel === uniqueLevels[3]) selectedSites.nsubdivisionallabcode = option;
//                             }
//                         }
//                     });
//                 };

//                 // process parent + current
//                 processSiteList(regionData.currentList || []);
//                 processSiteList(regionData.parentList || []);

//                 // village & location placeholders
//                 let villageList = [];
//                 let locationList = [];

//                 // only next-level children OR fallback to village API
//                 if (currentSite) {
//                     const nextLevel = currentLevel + 1;
//                     const directChildren = (regionData.childList || []).filter(
//                         site => Number(site.nlevel) === nextLevel
//                     );

//                     if (directChildren.length > 0) {
//                         // process child dropdown
//                         processSiteList(directChildren, true);
//                     } else {
//                         // --- CHILD EMPTY => fetch villages ---
//                         try {
//                             const villageResp = await rsapi.post("customercomplaint/getVillage", {
//                                 userinfo: userInfo,
//                                 primarykey: currentSite.nsitecode
//                             });

//                             const data = villageResp.data.villageList || [];
//                             villageList = data.map(row => ({
//                                 value: row.nvillagecode,
//                                 label: row.svillagename,
//                                 srelation: row.srelation,
//                                 ssitetypename: (row.ssitetypename || '').toUpperCase(),
//                             }));

//                             locationList = null;

//                             // reset village-related fields in selectedSites
//                             selectedSites.nvillagecode = null;
//                             selectedSites.nsamplelocationcode = null;
//                         } catch (err) {
//                             toast.error(err.message);
//                         }
//                     }
//                 }

//                 // sort dropdowns alphabetically
//                 const sortByLabel = (a, b) => a.label.localeCompare(b.label);
//                 stateOptions.sort(sortByLabel);
//                 regionalOptions.sort(sortByLabel);
//                 districtOptions.sort(sortByLabel);
//                 subDivisionalOptions.sort(sortByLabel);

//                 // merge complaint record + selected sites
//                 const finalSelectedRecord = { ...selectedSites, ...complaintRecord };

//                 // final dispatch
//                 dispatch({
//                     type: DEFAULT_RETURN,
//                     payload: {
//                         loading: false,
//                         selectedRecord: finalSelectedRecord,
//                         stateList: stateOptions,
//                         regionalList: regionalOptions,
//                         districtList: districtOptions,
//                         subDivisionalList: subDivisionalOptions,
//                         villageList,
//                         locationList,
//                         openModal: true,
//                         screenName: "IDS_CUSTOMERCOMPLAINT",
//                         loadEsign: false,
//                         operation: "create",
//                         date,
//                         postParamList,
//                     },
//                 });
//             })
//             .catch(error => {
//                 dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
//                 if (error.response.status === 500) {
//                     toast.error(error.message);
//                 }
//                 else {
//                     toast.warn(error.response.data);
//                 }
//             });
//     };
// }

// export function addGetRegion(addParam) {
//     return function (dispatch) {
//         let userInfo = addParam.userInfo;
//         const getRegion = rsapi.post("customercomplaint/getRegion", { userinfo: userInfo });
//         const getDate = rsapi.post("timezone/getLocalTimeByZone", { userinfo: userInfo });
//         let urlArray = [getRegion, getDate];

//         dispatch(initRequest(true));

//         Axios.all(urlArray)
//             .then(async (response) => {
//                 const regionData = response[0].data;
//                 let date = rearrangeDateFormat(userInfo, response[1].data);

//                 // complaint date record
//                 let complaintRecord = { dcomplaintdate: date };
//                 let postParamList = addParam.postParamList;

//                 // helper for dropdown options with disabled for current/parent
//                 const createOption = (site) => ({
//                     value: site.nsitecode,
//                     label: site.ssitename,
//                     relation: site.srelation,
//                     level: Number(site.nlevel),
//                     isDisabled: site.srelation === "Current" || site.srelation === "Parent",
//                 });

//                 const allSites = [
//                     ...(regionData.currentList || []),
//                     ...(regionData.parentList || []),
//                     ...(regionData.childList || []),
//                 ];

//                 const uniqueLevels = [...new Set(allSites.map(site => Number(site.nlevel)))].sort((a, b) => a - b);

//                 const stateOptions = [];
//                 const regionalOptions = [];
//                 const districtOptions = [];
//                 const subDivisionalOptions = [];
//                 const selectedSites = {};

//                 const currentSite = regionData.currentList?.[0] || null;
//                 const currentLevel = currentSite ? Number(currentSite.nlevel) : null;

//                 const processSiteList = (siteList, isChildList = false) => {
//                     siteList.forEach(site => {
//                         const option = createOption(site);

//                         if (site.nlevel === uniqueLevels[0]) stateOptions.push(option);
//                         else if (site.nlevel === uniqueLevels[1]) regionalOptions.push(option);
//                         else if (site.nlevel === uniqueLevels[2]) districtOptions.push(option);
//                         else if (site.nlevel === uniqueLevels[3]) subDivisionalOptions.push(option);

//                         // auto-select current/parent sites
//                         if (!isChildList) {
//                             if (
//                                 site.srelation === "Current" ||
//                                 site.srelation === "Parent" ||
//                                 siteList === regionData.parentList
//                             ) {
//                                 if (site.nlevel === uniqueLevels[0]) selectedSites.nstatelabcode = option;
//                                 else if (site.nlevel === uniqueLevels[1]) selectedSites.nregionallabcode = option;
//                                 else if (site.nlevel === uniqueLevels[2]) selectedSites.ndistrictlabcode = option;
//                                 else if (site.nlevel === uniqueLevels[3]) selectedSites.nsubdivisionallabcode = option;
//                             }
//                         }
//                     });
//                 };

//                 // process parent + current
//                 processSiteList(regionData.currentList || []);
//                 processSiteList(regionData.parentList || []);

//                 // village & location placeholders
//                 let villageList = [];
//                 let locationList = [];

//                 // only next-level children OR fallback to village API
//                 if (currentSite) {
//                     const nextLevel = currentLevel + 1;
//                     const directChildren = (regionData.childList || []).filter(
//                         site => Number(site.nlevel) === nextLevel
//                     );

//                     if (directChildren.length > 0) {
//                         // process child dropdown
//                         processSiteList(directChildren, true);
//                     } else {
//                         // --- CHILD EMPTY => fetch villages ---
//                         try {
//                             const villageResp = await rsapi.post("customercomplaint/getVillage", {
//                                 userinfo: userInfo,
//                                 primarykey: currentSite.nsitecode
//                             });

//                             const data = villageResp.data.villageList || [];
//                             villageList = data.map(row => ({
//                                 value: row.nvillagecode,
//                                 label: row.svillagename,
//                                 srelation: row.srelation,
//                                 ssitetypename: (row.ssitetypename || '').toUpperCase(),
//                             }));

//                             locationList = null;

//                             // reset village-related fields in selectedSites
//                             selectedSites.nvillagecode = null;
//                             selectedSites.nsamplelocationcode = null;
//                         } catch (err) {
//                             toast.error(err.message);
//                         }
//                     }
//                 }

//                 // sort dropdowns alphabetically
//                 const sortByLabel = (a, b) => a.label.localeCompare(b.label);
//                 stateOptions.sort(sortByLabel);
//                 regionalOptions.sort(sortByLabel);
//                 districtOptions.sort(sortByLabel);
//                 subDivisionalOptions.sort(sortByLabel);

//                 // merge complaint record + selected sites
//                 const finalSelectedRecord = { ...selectedSites, ...complaintRecord };

//                 // final dispatch
//                 dispatch({
//                     type: DEFAULT_RETURN,
//                     payload: {
//                         loading: false,
//                         selectedRecord: finalSelectedRecord,
//                         stateList: stateOptions,
//                         regionalList: regionalOptions,
//                         districtList: districtOptions,
//                         subDivisionalList: subDivisionalOptions,
//                         villageList,
//                         locationList,
//                         openModal: true,
//                         screenName: "IDS_CUSTOMERCOMPLAINT",
//                         loadEsign: false,
//                         operation: "create",
//                         date,
//                         postParamList,
//                     },
//                 });
//             })
//             .catch(error => {
//                 dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
//                 if (error.response.status === 500) {
//                     toast.error(error.message);
//                 } else {
//                     toast.warn(error.response?.data);
//                 }
//             });
//     };
// }

export function addGetRegion(addParam) {
    return function (dispatch) {
        let userInfo = addParam.userInfo;
        const getRegion = rsapi().post("customercomplaint/getRegion", { userinfo: userInfo });
        const getDate = rsapi().post("timezone/getLocalTimeByZone", { userinfo: userInfo });
        let urlArray = [getRegion, getDate];

        dispatch(initRequest(true));

        Axios.all(urlArray)
            .then(async (response) => {
                const regionData = response[0].data;
                let date = rearrangeDateFormat(userInfo, response[1].data?.date);

                // complaint date record
                let complaintRecord = { dcomplaintdate: date };
                let postParamList = addParam.postParamList;

                // helper for dropdown options with disabled for current/parent
                const createOption = (site, isParent = false) => ({
                    value: site.nsitecode,
                    label: site.ssitename,
                    relation: site.srelation,
                    level: Number(site.nlevel),
                    // disable if Current OR Parent
                    isDisabled: site.srelation === "Current" || isParent,
                    nsitehierarchyconfigcode: site.nsitehierarchyconfigcode || 0, //added by sujatha ATE_274 23-09-2025 for getting the villages based on hierarchyconfigcode
                });

                const stateOptions = [];
                const regionalOptions = [];
                const districtOptions = [];
                const subDivisionalOptions = [];
                const selectedSites = {};

                const currentSite = regionData.currentList?.[0] || null;
                const currentLevel = currentSite ? Number(currentSite.nlevel) : null;

                const processSiteList = (siteList, isParent = false, isChildList = false) => {
                    siteList.forEach(site => {
                        const option = createOption(site, isParent);

                        if (site.nlevel === 1) stateOptions.push(option);
                        else if (site.nlevel === 2) regionalOptions.push(option);
                        else if (site.nlevel === 3) districtOptions.push(option);
                        else if (site.nlevel === 4) subDivisionalOptions.push(option);

                        // auto-select current + parent
                        if (!isChildList) {
                            if (site.srelation === "Current" || isParent) {
                                if (site.nlevel === 1) selectedSites.nstatelabcode = option;
                                else if (site.nlevel === 2) selectedSites.nregionallabcode = option;
                                else if (site.nlevel === 3) selectedSites.ndistrictlabcode = option;
                                else if (site.nlevel === 4) selectedSites.nsubdivisionallabcode = option;
                            }
                        }
                    });
                };

                //  process parent + current
                processSiteList(regionData.currentList || []);
                processSiteList(regionData.parentList || [], true); // mark all parent as disabled

                // village & location placeholders
                let villageList = [];
                let locationList = [];

                if (currentSite) {
                    const nextLevel = currentLevel + 1;
                    const directChildren = (regionData.childList || []).filter(
                        site => Number(site.nlevel) === nextLevel
                    );

                    if (directChildren.length > 0) {
                        processSiteList(directChildren, false, true);
                    } else {
                        // try { // no need of try and catch , already when we have catch
                        const villageResp = await rsapi().post("customercomplaint/getVillage", {
                            userinfo: userInfo,
                            primarykey: currentSite.nsitecode,
                            //added by sujatha ATE_274 23-09-2025 for getting the villages based on hierarchyconfigcode & issue with try and catch before while click add slideout region without district
                            // nsitehierarchyconfigcode: subDivisionalOptions[0].nsitehierarchyconfigcode
                            nsitehierarchyconfigcode: (subDivisionalOptions && subDivisionalOptions.length > 0) ? subDivisionalOptions[0].nsitehierarchyconfigcode : 0
                        });

                        const data = villageResp.data.villageList || [];
                        villageList = data.map(row => ({
                            value: row.nvillagecode,
                            label: row.svillagename,
                        }));

                        locationList = null;
                        selectedSites.nvillagecode = null;
                        selectedSites.nsamplelocationcode = null;
                        // } catch (err) {
                        // //   toast.error(err.message);    //commeted by sujatha for getting alert while opening the add slideout without having district or region
                        // }
                    }
                }

                // sort dropdowns
                const sortByLabel = (a, b) => a.label.localeCompare(b.label);
                stateOptions.sort(sortByLabel);
                regionalOptions.sort(sortByLabel);
                districtOptions.sort(sortByLabel);
                subDivisionalOptions.sort(sortByLabel);

                // merge complaint record + selected sites
                const finalSelectedRecord = { ...selectedSites, ...complaintRecord };

                // final dispatch
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false,
                        selectedRecord: finalSelectedRecord,
                        stateList: stateOptions,
                        regionalList: regionalOptions,
                        districtList: districtOptions,
                        subDivisionalList: subDivisionalOptions,
                        villageList,
                        locationList,
                        openModal: true,
                        screenName: "IDS_CUSTOMERCOMPLAINT",
                        loadEsign: false,
                        operation: "create",
                        date,
                        postParamList,
                    },
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
                } else if (error.response?.status === 500) {
                  toast.error(error.message);
                } else {
                  toast.warn(intl.formatMessage({ id: error.response.data }));
                }
            });
    };
}

// export function addGetRegion(addParam) {
//     return function (dispatch) {
//         let userInfo = addParam.userInfo;
//         const getRegion = rsapi.post("customercomplaint/getRegion", { userinfo: userInfo });
//         const getDate = rsapi.post("timezone/getLocalTimeByZone", { userinfo: userInfo });
//         let urlArray = [getRegion, getDate];

//         dispatch(initRequest(true));

//         Axios.all(urlArray)
//             .then(response => {
//                 const regionData = response[0].data;
//                 let date = rearrangeDateFormat(userInfo, response[1].data);

//                 // complaint date record
//                 let complaintRecord = { dcomplaintdate: date };
//                 let postParamList = addParam.postParamList;

//                 // helper for dropdown options
//                 const createOption = (site) => ({
//                     value: site.nsitecode,
//                     label: site.ssitename,
//                     relation: site.srelation,
//                     level: Number(site.nlevel),
//                 });

//                 const allSites = [
//                     ...(regionData.currentList || []),
//                     ...(regionData.parentList || []),
//                     ...(regionData.childList || []),
//                 ];

//                 const uniqueLevels = [...new Set(allSites.map(site => Number(site.nlevel)))].sort((a, b) => a - b);

//                 const stateOptions = [];
//                 const regionalOptions = [];
//                 const districtOptions = [];
//                 const subDivisionalOptions = [];
//                 const selectedSites = {};

//                 const currentSite = regionData.currentList?.[0] || null;
//                 const currentLevel = currentSite ? Number(currentSite.nlevel) : null;

//                 const processSiteList = (siteList, isChildList = false) => {
//                     siteList.forEach(site => {
//                         const option = createOption(site);

//                         // Assign to correct dropdown
//                         if (site.nlevel === uniqueLevels[0]) stateOptions.push(option);
//                         else if (site.nlevel === uniqueLevels[1]) regionalOptions.push(option);
//                         else if (site.nlevel === uniqueLevels[2]) districtOptions.push(option);
//                         else if (site.nlevel === uniqueLevels[3]) subDivisionalOptions.push(option);

//                         // Auto-select current or parent sites
//                         if (!isChildList) {
//                             if (
//                                 site.srelation === "Current" ||
//                                 site.srelation === "Parent" ||
//                                 siteList === regionData.parentList
//                             ) {
//                                 if (site.nlevel === uniqueLevels[0]) selectedSites.nstatelabcode = option;
//                                 else if (site.nlevel === uniqueLevels[1]) selectedSites.nregionallabcode = option;
//                                 else if (site.nlevel === uniqueLevels[2]) selectedSites.ndistrictlabcode = option;
//                                 else if (site.nlevel === uniqueLevels[3]) selectedSites.nsubdivisionallabcode = option;
//                             }
//                         }
//                     });
//                 };

//                 // process parent + current
//                 processSiteList(regionData.currentList || []);
//                 processSiteList(regionData.parentList || []);

//                 // only next-level children
//                 if (currentSite) {
//                     const nextLevel = currentLevel + 1;
//                     const directChildren = (regionData.childList || []).filter(
//                         site => Number(site.nlevel) === nextLevel
//                     );
//                     processSiteList(directChildren, true);
//                 }

//                 // sort dropdowns alphabetically
//                 const sortByLabel = (a, b) => a.label.localeCompare(b.label);
//                 stateOptions.sort(sortByLabel);
//                 regionalOptions.sort(sortByLabel);
//                 districtOptions.sort(sortByLabel);
//                 subDivisionalOptions.sort(sortByLabel);

//                 // merge complaint record + selected sites
//                 const finalSelectedRecord = { ...selectedSites, ...complaintRecord };

//                 // final dispatch
//                 dispatch({
//                     type: DEFAULT_RETURN,
//                     payload: {
//                         loading: false,
//                         selectedRecord: finalSelectedRecord,
//                         stateList: stateOptions,
//                         regionalList: regionalOptions,
//                         districtList: districtOptions,
//                         subDivisionalList: subDivisionalOptions,
//                         villageList: [],
//                         locationList: [],
//                         openModal: true,
//                         screenName: "IDS_CUSTOMERCOMPLAINT",
//                         loadEsign: false,
//                         operation: "create",
//                         date,
//                         postParamList,
//                     },
//                 });
//             })
//               .catch(error => {
//                 dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
//                 if (error.response.status === 500) {
//                     toast.error(error.message);
//                 }
//                 else {
//                     toast.warn(error.response.data);
//                 }

//             })
//     }
// }


export function getInitiate(initiateParam) {
    return function (dispatch) {
        if (initiateParam.masterData.selectedCustomerComplaint.stransdisplaystatus !== "Initiated" && initiateParam.masterData.selectedCustomerComplaint.stransdisplaystatus !== "Closed") {
            const getDate = rsapi().post("timezone/getLocalTimeByZone", { userinfo: initiateParam.userInfo });
            let urlArray = [getDate];
            dispatch(initRequest(true));
            Axios.all(urlArray)
                .then(response => {
                    let date = rearrangeDateFormat(initiateParam.userInfo, response[0].data?.date);
                    let selectedRecord = { "dtransactiondate": date }
                    dispatch({
                        type: DEFAULT_RETURN, payload: {
                            loading: false,
                            openModal: true,
                            screenName: "IDS_INITIATECUSTOMERCOMPLAINT",
                            loadEsign: false,
                            selectedRecord: selectedRecord,
                            date,
                            operation: 'initiate',
                            ncontrolcode: initiateParam.ncontrolcode
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
                    } else if (error.response?.status === 500) {
                      toast.error(error.message);
                    } else {
                      toast.warn(intl.formatMessage({ id: error.response.data }));
                    }
                })
        }
        else {
            toast.warn(intl.formatMessage({ id: "IDS_SELECTDRAFTRECORD" }));
        }
    }
}

export function getClose(closeparam) {
    return function (dispatch) {
        if (closeparam.masterData.selectedCustomerComplaint.stransdisplaystatus === "Initiated") {
            const getDate = rsapi().post("timezone/getLocalTimeByZone", { userinfo: closeparam.userInfo });
            let urlArray = [getDate];
            dispatch(initRequest(true));
            Axios.all(urlArray)
                .then(response => {
                    let date = rearrangeDateFormat(closeparam.userInfo, response[0].data?.date);
                    let selectedRecord = { "dtransactiondate": date }
                    dispatch({
                        type: DEFAULT_RETURN, payload: {
                            loading: false,
                            openModal: true,
                            screenName: "IDS_CLOSECUSTOMERCOMPLAINT",
                            loadEsign: false,
                            selectedRecord: selectedRecord,
                            date,
                            operation: 'close',
                            ncontrolcode: closeparam.ncontrolcode
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
                    } else if (error.response?.status === 500) {
                      toast.error(error.message);
                    } else {
                      toast.warn(intl.formatMessage({ id: error.response.data }));
                    }
                })
        }
        else {

            toast.warn(intl.formatMessage({ id: "IDS_SELECTINITIATERECORD" }));
        }
    }
}

// export function getDistrict(methodParam, selectedRecord) {
//     return function (dispatch) {
//         let URL = [];
//         URL = rsapi.post("/customercomplaint/getDistrict", {
//             "userinfo": methodParam.inputData.userinfo, "nregioncode": methodParam.inputData.primarykey, "ncustomercomplaintcode": methodParam.inputData.selectedCustomerComplaint.ncustomercomplaintcode
//         })
//         dispatch(initRequest(true));
//         Axios.all([URL])
//             .then(response => {
//                 let districtList;
//                 let cityList;
//                 const districtMap = constructOptionList(response[0].data || [], "ndistrictcode",
//                     "sdistrictname", undefined, undefined, false);
//                 districtList = districtMap.get("OptionList");
//                 dispatch({
//                     type: DEFAULT_RETURN, payload:

//                         { districtList, selectedRecord, loading: false, cityList }
//                 })
//             })
//             .catch(error => {
//                 dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
//                 if (error.response.status === 500) {
//                     toast.error(error.message);
//                 }
//                 else {
//                     toast.warn(error.response.data);
//                 }
//             })
//     }
// }

// export function getCity(methodParam, selectedRecord) {
//     return function (dispatch) {
//         let URL = [];
//         URL = rsapi.post("/customercomplaint/getCity", {
//             "userinfo": methodParam.inputData.userinfo, "ndistrictcode": methodParam.inputData.primarykey, "ncustomercomplaintcode": methodParam.inputData.selectedCustomerComplaint.ncustomercomplaintcode
//         })
//         dispatch(initRequest(true));
//         Axios.all([URL])
//             .then(response => {
//                 let cityList;
//                 const userMap = constructOptionList(response[0].data || [], "ncitycode",
//                     "scityname", undefined, undefined, false);
//                 cityList = userMap.get("OptionList");
//                 dispatch({
//                     type: DEFAULT_RETURN, payload:

//                         { cityList, selectedRecord, loading: false }
//                 })
//             })
//             .catch(error => {
//                 dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
//                 if (error.response.status === 500) {
//                     toast.error(error.message);
//                 }
//                 else {
//                     toast.warn(error.response.data);
//                 }
//             })
//     }
// }



// export function getVillage(methodParam, selectedRecord) {
//     return function (dispatch) {
//         let URL = [];
//         URL = rsapi.post("/customercomplaint/getVillage", {
//             "userinfo": methodParam.inputData.userinfo, "ncitycode": methodParam.inputData.primarykey, "ncustomercomplaintcode": methodParam.inputData.selectedCustomerComplaint.ncustomercomplaintcode
//         })
//         dispatch(initRequest(true));
//         Axios.all([URL])
//             .then(response => {
//                 let villageList;
//                 const userMap = constructOptionList(response[0].data || [], "nvillagecode",
//                     "svillagename", undefined, undefined, false);
//                 villageList = userMap.get("OptionList");
//                 dispatch({
//                     type: DEFAULT_RETURN, payload:

//                         { villageList, selectedRecord, loading: false }
//                 })
//             })
//             .catch(error => {
//                 dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
//                 if (error.response.status === 500) {
//                     toast.error(error.message);
//                 }
//                 else {
//                     toast.warn(error.response.data);
//                 }
//             })
//     }
// }


export function editCustomerComplaint(
    screenName,
    operation,
    primaryKeyName,
    primaryKeyValue,
    masterData,
    userInfo,
    ncontrolCode
) {
    return function (dispatch) {
        // Allow editing only if record is not Initiated/Closed
        if (
            masterData.selectedCustomerComplaint.stransdisplaystatus !== "Initiated" &&
            masterData.selectedCustomerComplaint.stransdisplaystatus !== "Closed"
        ) {
            // --- API Requests ---
            const editRequest = rsapi().post("customercomplaint/getActiveCustomerComplaintById", {
                ncustomercomplaintcode: masterData.selectedCustomerComplaint.ncustomercomplaintcode,
                userinfo: userInfo
            });

            const regionRequest = rsapi().post("customercomplaint/getRegion", { userinfo: userInfo });

            dispatch(initRequest(true));

            Axios.all([editRequest, regionRequest])
                .then(
                    Axios.spread((editResponse, regionResponse) => {
                        const editData = editResponse.data || {};

                        // --- Build selectedRecord for prefill ---

                        let date = rearrangeDateFormat(userInfo, editData.scomplaintdate);
                        const selectedRecord = {
                            sreceivedfrom: editData.sreceivedfrom || "",
                            scomplaintdetails: editData.scomplaintdetails || "",
                            semail: editData.semail || "",
                            scontactnumber: editData.scontactnumber || "",
                            slocation: editData.slocation || "",
                            // added by sujatha ATE_274 26-09-2025 for not getting the added latitude and longitude in the edit popup
                            slatitude: editData.slatitude || "",
                            slongitude: editData.slongitude || "",
                            // svillagename:editData.svillagename || "",
                            // nvillagecode:editData.nvillagecode || " ",
                            dcomplaintdate: rearrangeDateFormat(userInfo, editData.scomplaintdate),
                            nstatelabcode: null,
                            ntzcomplaintdate: editData.ntzcomplaintdate,
                            nregionallabcode: editData.nregioncode
                                ? { value: editData.nregioncode, label: editData.sregionname }
                                : null,
                            ndistrictlabcode: editData.ndistrictcode
                                ? { value: editData.ndistrictcode, label: editData.sdistrictname }
                                : null,
                            nsubdivisionallabcode: editData.ncitycode
                                ? { value: editData.ncitycode, label: editData.scityname }
                                : null,
                            nvillagecode: editData.nvillagecode
                                ? { value: editData.nvillagecode, label: editData.svillagename }
                                : null,
                        };

                        // --- Process regionResponse into dropdown options ---
                        const regionData = regionResponse.data;

                        const createOption = (site, disable = false) => ({
                            value: site.nsitecode,
                            label: site.ssitename,
                            relation: site.srelation,
                            level: Number(site.nlevel),
                            isDisabled: disable,
                            nsitehierarchyconfigcode: site.nsitehierarchyconfigcode,   // sujatha 28-09-2025 for the 500 issue in edit
                        });

                        const allSites = [
                            ...(regionData.currentList || []),
                            ...(regionData.parentList || []),
                            ...(regionData.childList || []),
                        ];

                        const uniqueLevels = [...new Set(allSites.map(site => Number(site.nlevel)))].sort(
                            (a, b) => a - b
                        );

                        const stateOptions = [];
                        const regionalOptions = [];
                        const districtOptions = [];
                        const subDivisionalOptions = [];

                        const currentSite = regionData.currentList?.[0] || null;
                        const currentLevel = currentSite ? Number(currentSite.nlevel) : null;

                        const disabledIds = new Set();
                        (regionData.parentList || []).forEach(s => disabledIds.add(s.nsitecode));
                        //commented by sujatha ATE_274 28-09-2025 for disabling current site not working
                        // if ((regionData.childList || []).length > 0 && currentSite) {
                        //     disabledIds.add(currentSite.nsitecode);
                        // }
                        //added by sujatha ATE_274 28-09-2025 for disabling current site(bug)
                        if (currentSite) {
                            disabledIds.add(currentSite.nsitecode);
                        }

                        const processSiteList = (siteList, isChildList = false) => {
                            siteList.forEach(site => {
                                const option = createOption(site, disabledIds.has(site.nsitecode));

                                if (site.nlevel === uniqueLevels[0]) stateOptions.push(option);
                                else if (site.nlevel === uniqueLevels[1]) regionalOptions.push(option);
                                else if (site.nlevel === uniqueLevels[2]) districtOptions.push(option);
                                else if (site.nlevel === uniqueLevels[3]) subDivisionalOptions.push(option);

                                // Auto-select disabled parents
                                if (!isChildList && disabledIds.has(site.nsitecode)) {
                                    if (site.nlevel === uniqueLevels[0]) selectedRecord.nstatelabcode = option;
                                    else if (site.nlevel === uniqueLevels[1]) selectedRecord.nregionallabcode = option;
                                    else if (site.nlevel === uniqueLevels[2]) selectedRecord.ndistrictlabcode = option;
                                    else if (site.nlevel === uniqueLevels[3])
                                        selectedRecord.nsubdivisionallabcode = option;
                                }

                                // Prefill based on editData
                                if (site.nsitecode === editData.nregioncode)
                                    selectedRecord.nregionallabcode = option;
                                if (site.nsitecode === editData.ndistrictcode)
                                    selectedRecord.ndistrictlabcode = option;
                                if (site.nsitecode === editData.ncitycode)
                                    selectedRecord.nsubdivisionallabcode = option;
                            });
                        };

                        processSiteList(regionData.currentList || []);
                        processSiteList(regionData.parentList || []);
                        //added by sujatha ATE_274 for added villageList to use globally
                        let villageList=[];
                        if (currentSite) {
                            const nextLevel = currentLevel + 1;
                            const directChildren = (regionData.childList || []).filter(
                                site => Number(site.nlevel) === nextLevel
                            );

                            //   processSiteList(directChildren, true);
                            // added by sujatha ATE_274 28-09-2025 for an issue .. not getting villages by default when the login site is taluka
                            if (directChildren.length > 0) {
                                processSiteList(directChildren, true);

                            }
                            // added by sujatha ATE_274 28-09-2025 for getting village data by default when login site is taluka's
                            else {
                                rsapi().post("customercomplaint/getVillage", {
                                    userinfo: userInfo,
                                    primarykey: currentSite.nsitecode,
                                    nsitehierarchyconfigcode: (subDivisionalOptions && subDivisionalOptions.length > 0)
                                        ? subDivisionalOptions[0].nsitehierarchyconfigcode
                                        : 0
                                })
                                    .then(villageResp => {
                                        const data = villageResp.data.villageList || [];
                                         villageList = data.map(row => ({
                                            value: row.nvillagecode,
                                            label: row.svillagename,
                                        }));

                                        dispatch({
                                            type: DEFAULT_RETURN,
                                            payload: {
                                                loading: false,
                                                selectedRecord: {
                                                    ...selectedRecord,
                                                    nvillagecode: editData.nvillagecode
                                                        ? { value: editData.nvillagecode, label: editData.svillagename }
                                                        : null,
                                                },
                                                stateList: stateOptions,
                                                regionalList: regionalOptions,
                                                districtList: districtOptions,
                                                subDivisionalList: subDivisionalOptions,
                                                villageList,
                                                locationList: [],
                                                openModal: true,
                                                screenName,
                                                operation: "update",
                                                ncontrolcode: ncontrolCode,
                                                date
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
                                        } else if (error.response?.status === 500) {
                                          toast.error(error.message);
                                        } else {
                                          toast.warn(intl.formatMessage({ id: error.response.data }));
                                        }
                                    });
                                return; // exit to avoid reaching the default dispatch below
                            }
                        }

                        const sortByLabel = (a, b) => a.label.localeCompare(b.label);
                        stateOptions.sort(sortByLabel);
                        regionalOptions.sort(sortByLabel);
                        districtOptions.sort(sortByLabel);
                        subDivisionalOptions.sort(sortByLabel);

                        dispatch({
                            type: DEFAULT_RETURN,
                            payload: {
                                loading: false,
                                selectedRecord,
                                stateList: stateOptions,
                                regionalList:
                                //commented and added by sujatha ATE_274 28-09-2025 for get the field's, selected value in the drop down as disabled
                                     //regionalOptions,
                                    [
                                        ...regionalOptions,
                                        ...(selectedRecord.nregionallabcode &&
                                            !regionalOptions.some(opt => opt.value === selectedRecord.nregionallabcode.value)
                                            ? [{
                                                ...selectedRecord.nregionallabcode,
                                                isDisabled: true
                                            }]
                                            : [])
                                    ],
                                districtList: 
                                //commented and added by sujatha ATE_274 28-09-2025 for get the field's selected value in the drop down as disabled
                                //districtOptions,
                                    [
                                        ...districtOptions,
                                        ...(selectedRecord.ndistrictlabcode &&
                                            !districtOptions.some(opt => opt.value === selectedRecord.ndistrictlabcode.value)
                                            ? [{
                                                ...selectedRecord.ndistrictlabcode,
                                                isDisabled: true
                                            }]
                                            : [])
                                    ],
                                subDivisionalList: 
                                //commented and added by sujatha ATE_274 28-09-2025 for get the field's, selected value in the drop down as disabled
                                // subDivisionalOptions,
                                    [
                                        ...subDivisionalOptions,
                                        ...(selectedRecord.nsubdivisionallabcode &&
                                            !subDivisionalOptions.some(opt => opt.value === selectedRecord.nsubdivisionallabcode.value)
                                            ? [{
                                                ...selectedRecord.nsubdivisionallabcode,
                                                isDisabled: true
                                            }]
                                            : [])
                                    ],
                                villageList: 
                                //commented and added by sujatha ATE_274 28-09-2025 for get the field's, selected value in the drop down as disabled
                                //[], // left empty for now
                                    [
                                        ...(selectedRecord.nvillagecode &&
                                            !villageList.some(opt => opt.value === selectedRecord.nvillagecode.value)
                                            ? [{
                                                ...selectedRecord.nvillagecode,
                                                isDisabled: true
                                            }]
                                            : [])
                                    ],
                                locationList: [],
                                openModal: true,
                                screenName,
                                operation: "update",
                                ncontrolcode: ncontrolCode,
                                date
                            }
                        });
                    })
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
                    } else if (error.response?.status === 500) {
                      toast.error(error.message);
                    } else {
                      toast.warn(intl.formatMessage({ id: error.response.data }));
                    }
                });
        } else {
            toast.warn(intl.formatMessage({ id: "IDS_SELECTDRAFTRECORDTOEDIT" }));
        }
    };
}


// export function editCustomerComplaint(screenName, operation, primaryKeyName, primaryKeyValue, masterData, userInfo, ncontrolCode) {
//     return function (dispatch) {
//         const getRegion = rsapi.post("customercomplaint/getRegion", { userinfo: userInfo });
//         const getDistrict = rsapi.post("/customercomplaint/getDistrict", {
//             "userinfo": userInfo, "nregioncode": masterData.
//                 selectedCustomerComplaint.nregioncode, "ncustomercomplaintcode": primaryKeyValue
//         })
//         const getCity = rsapi.post("/customercomplaint/getCity", {
//             "userinfo": userInfo, "ndistrictcode": masterData.
//                 selectedCustomerComplaint.ndistrictcode, "ncustomercomplaintcode": primaryKeyValue
//         })
//         const getVillage = rsapi.post("/customercomplaint/getVillage", {
//             "userinfo": userInfo, "ncitycode": masterData.
//                 selectedCustomerComplaint.ncitycode, "ncustomercomplaintcode": primaryKeyValue
//         })
//         let urlArray = [];
//         const CustomerComplaintID = rsapi.post("customercomplaint/getActiveCustomerComplaintById", {
//             ncustomercomplaintcode: primaryKeyValue,
//             userinfo: userInfo
//         })
//         urlArray = [getRegion, getDistrict, getCity, getVillage, CustomerComplaintID];
//         Axios.all(urlArray)
//             .then(response => {
//                 if (response[4]?.data?.stransdisplaystatus !== "Initiated" && response[4]?.data?.stransdisplaystatus !== "Closed") {
//                     let region = [];
//                     let district = [];
//                     let city = [];
//                     let village = [];
//                     let selectedRecord = {};
//                     const regionMap = constructOptionList(response[0].data || [], "nregioncode",
//                         "sregionname", undefined, undefined, false);
//                     const districtMap = constructOptionList(response[1].data || [], "ndistrictcode",
//                         "sdistrictname", undefined, undefined, true);
//                     const cityMap = constructOptionList(response[2].data || [], 'ncitycode',
//                         'scityname', undefined, undefined, true);
//                     const villageMap = constructOptionList(response[3].data || [], "nvillagecode",
//                         "svillagename", undefined, undefined, true);
//                     const regionList = regionMap.get("OptionList");
//                     const districtList = districtMap.get("OptionList");
//                     const cityList = cityMap.get("OptionList");
//                     const villageList = villageMap.get("OptionList");
//                     if (operation === "update") {
//                         selectedRecord = response[4].data;
//                         region.push({ "value": response[4].data["nregioncode"], "label": response[4].data["sregionname"] });
//                         district.push({ "value": response[4].data["ndistrictcode"], "label": response[4].data["sdistrictname"] });
//                         city.push({ "value": response[4].data["ncitycode"], "label": response[4].data["scityname"] });
//                         village.push({ "value": response[4].data["nvillagecode"], "label": response[4].data["svillagename"] });
//                         selectedRecord["nregioncode"] = region[0];
//                         selectedRecord["ndistrictcode"] = district[0];
//                         selectedRecord["ncitycode"] = city[0];
//                         selectedRecord["nvillagecode"] = village[0];
//                         if (selectedRecord["dcomplaintdate"] !== null) {
//                             selectedRecord["dcomplaintdate"] = rearrangeDateFormat(userInfo, selectedRecord["scomplaintdate"]);

//                         }
//                     }
//                     dispatch({
//                         type: DEFAULT_RETURN, payload: {
//                             regionList: regionList,
//                             districtList: districtList,
//                             cityList: cityList,
//                             villageList: villageList,
//                             operation, screenName, selectedRecord, openModal: true,
//                             ncontrolcode: ncontrolCode, loading: false,
//                         }
//                     });
//                 }
//                 else {

//                     toast.warn(intl.formatMessage({ id: "IDS_SELECTDRAFTRECORDTOEDIT" }));
//                 }
//             }
//             )
//             .catch(error => {
//                 dispatch({ type: DEFAULT_RETURN, payload: { loading: false } });
//                 if (error.response?.status === 500) {
//                     toast.error(error.message);
//                 } else {
//                     toast.warn(error.response?.data);
//                 }
//             });
//     }
// }




// export function editCustomerComplaint(
//   screenName,
//   operation,
//   primaryKeyName,
//   primaryKeyValue,
//   masterData,
//   userInfo,
//   ncontrolCode
// ) {
//   return function (dispatch) {
//     const getRegion = rsapi.post("customercomplaint/getRegion", { userinfo: userInfo });

//     const getCustomerComplaintById = rsapi.post("customercomplaint/getActiveCustomerComplaintById", {
//       ncustomercomplaintcode: primaryKeyValue,
//       userinfo: userInfo,
//     });

//     // Collect API calls
//     const urlArray = [getRegion, getCustomerComplaintById];

//     Axios.all(urlArray)
//       .then((response) => {
//         const regionResponse = response[0];
//         const complaintResponse = response[1];

//         // --- Step 1: check status ---
//         if (
//           complaintResponse?.data?.stransdisplaystatus !== "Initiated" &&
//           complaintResponse?.data?.stransdisplaystatus !== "Closed"
//         ) {
//           // --- Step 2: Extract editData ---
//           const editData = complaintResponse.data || {};

//           // --- Step 3: Build selected record ---
//            //selectedRecord=complaintResponse.data;
//           let selectedRecord = {
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

//               sreceivedfrom:editData.sreceivedfrom,
//               scomplaintdetails:editData.scomplaintdetails,
//               scomplaintdate:editData.scomplaintdate,
//               slocation:editData.slocation,
//               semail:editData.semail,
//               scontactnumber:editData.scontactnumber,
//               slatitude:editData.slatitude,
//               slongitude:editData.slongitude,
//               ncustomercomplaintcode:editData.ncustomercomplaintcode

//           };

//           // --- Step 4: Process region data ---
//           const regionData = regionResponse.data;

//           const createOption = (site) => ({
//             value: site.nsitecode,
//             label: site.ssitename,
//             relation: site.srelation,
//             level: Number(site.nlevel),
//           });

//           const allSites = [
//             ...(regionData.currentList || []),
//             ...(regionData.parentList || []),
//             ...(regionData.childList || []),
//           ];

//           const uniqueLevels = [...new Set(allSites.map((site) => Number(site.nlevel)))].sort(
//             (a, b) => a - b
//           );

//           const stateOptions = [];
//           const regionalOptions = [];
//           const districtOptions = [];
//           const subDivisionalOptions = [];

//           const currentSite = regionData.currentList?.[0] || null;
//           const currentLevel = currentSite ? Number(currentSite.nlevel) : null;

//           const processSiteList = (siteList, isChildList = false) => {
//             siteList.forEach((site) => {
//               const option = createOption(site);

//               // Assign to correct dropdown
//               if (site.nlevel === uniqueLevels[0]) stateOptions.push(option);
//               else if (site.nlevel === uniqueLevels[1]) regionalOptions.push(option);
//               else if (site.nlevel === uniqueLevels[2]) districtOptions.push(option);
//               else if (site.nlevel === uniqueLevels[3]) subDivisionalOptions.push(option);

//               // Auto-select Current/Parent sites
//               if (!isChildList) {
//                 if (
//                   site.srelation === "Current" ||
//                   site.srelation === "Parent" ||
//                   siteList === regionData.parentList
//                 ) {
//                   if (site.nlevel === uniqueLevels[0]) selectedRecord.nstatelabcode = option;
//                   else if (site.nlevel === uniqueLevels[1])
//                     selectedRecord.nregionallabcode = option;
//                   else if (site.nlevel === uniqueLevels[2])
//                     selectedRecord.ndistrictlabcode = option;
//                   else if (site.nlevel === uniqueLevels[3])
//                     selectedRecord.nsubdivisionallabcode = option;
//                 }
//               }

//               // Match with editData to prefill
//               if (site.nsitecode === editData.nregioncode)
//                 selectedRecord.nregionallabcode = option;
//               if (site.nsitecode === editData.ndistrictcode)
//                 selectedRecord.ndistrictlabcode = option;
//               if (site.nsitecode === editData.ncitycode)
//                 selectedRecord.nsubdivisionallabcode = option;
//             });
//           };

//           // Process parent/current sites
//           processSiteList(regionData.currentList || []);
//           processSiteList(regionData.parentList || []);

//           // Process children (next level only)
//           if (currentSite) {
//             const nextLevel = currentLevel + 1;
//             const directChildren = (regionData.childList || []).filter(
//               (site) => Number(site.nlevel) === nextLevel
//             );
//             processSiteList(directChildren, true);
//           }

//           // Sort dropdowns alphabetically
//           const sortByLabel = (a, b) => a.label.localeCompare(b.label);
//           stateOptions.sort(sortByLabel);
//           regionalOptions.sort(sortByLabel);
//           districtOptions.sort(sortByLabel);
//           subDivisionalOptions.sort(sortByLabel);

//           // --- Step 5: Handle update ---
//           if (operation === "update") {
//             if (selectedRecord.dcomplaintdate !== null) {
//               selectedRecord.dcomplaintdate = rearrangeDateFormat(
//                 userInfo,
//                 selectedRecord.scomplaintdate
//               );
//             }
//           }

//           // --- Step 6: Dispatch final result ---
//           dispatch({
//             type: DEFAULT_RETURN,
//             payload: {
//               stateList: stateOptions,
//               regionalList: regionalOptions,
//               districtList: districtOptions,
//               subDivisionalList: subDivisionalOptions,
//               villageList: [],
//               operation,
//               screenName,
//               selectedRecord,
//               openModal: true,
//               ncontrolcode: ncontrolCode,
//               loading: false,
//             },
//           });
//         } else {
//           toast.warn(intl.formatMessage({ id: "IDS_SELECTDRAFTRECORDTOEDIT" }));
//         }
//       })
//       .catch((error) => {
//         dispatch({ type: DEFAULT_RETURN, payload: { loading: false } });
//         if (error.response?.status === 500) {
//           toast.error(error.message);
//         } else {
//           toast.warn(error.response?.data);
//         }
//       });
//   };
// }



export function getCustomerComplaintRecord(selectedcomplaintData, getParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("customercomplaint/getCustomerComplaintRecord", { ncustomercomplaintcode: selectedcomplaintData.ncustomercomplaintcode, userinfo: getParam.userInfo })
            .then(response => {

                let selectedRecord = response.data.selectedCustomerComplaint;
                let masterDatadetails = { ...getParam.masterData };
                let complaintHistory = response.data.complaintHistory
                let customerComplaintFile = response.data.customerComplaintFile
                masterDatadetails['selectedCustomerComplaint'] = selectedRecord;
                masterDatadetails['complaintHistory'] = complaintHistory;
                masterDatadetails['customerComplaintFile'] = customerComplaintFile;
                let selectedId = selectedRecord.ncustomercomplainthistorycode
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        loading: false,
                        masterData: masterDatadetails,
                        selectedId,
                        complaintHistory
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
                } else if (error.response?.status === 500) {
                  toast.error(error.message);
                } else {
                  toast.warn(intl.formatMessage({ id: error.response.data }));
                }
            })
    }
}

export function getCustomerComplaintData(inputData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("customercomplaint/getCustomerComplaintData", { ...inputData.inputData })
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
                        customercomplaintSkip: 0,
                        customercomplaintTake: undefined,
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
                } else if (error.response?.status === 500) {
                  toast.error(error.message);
                } else {
                  toast.warn(intl.formatMessage({ id: error.response.data }));
                }
            });
    };
}


export const addCustomerComplaintFile = (inputParam) => {
    return (dispatch) => {
        dispatch(initRequest(true));
        let urlArray = [rsapi().post("/linkmaster/getLinkMaster", {
            userinfo: inputParam.userInfo
        })];
        if (inputParam.operation === "update") {
            urlArray.push(rsapi().post("/customercomplaint/editCustomerComplaintFile", {
                userinfo: inputParam.userInfo,
                customercomplaintfile: inputParam.selectedRecord
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
                        ncustomercomplaintfilecode: editObject.ncustomercomplaintfilecode,
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
                } else if (error.response?.status === 500) {
                  toast.error(error.message);
                } else {
                  toast.warn(intl.formatMessage({ id: error.response.data }));
                }
            });
    }

}

// modified by sujatha ATE_274 modified action name to fix calling the action with the same name in service action
export const viewAttachmentCustomerComplaint = (inputParam) => {
    return (dispatch) => {
        let inputData = { ...inputParam.inputData }
        if (inputData['selectedRecord']) {
            delete inputData['selectedRecord']['expanded'];
        }
        dispatch(initRequest(true));
        rsapi().post(inputParam.classUrl + "/" + inputParam.operation + inputParam.methodUrl, inputData)
            .then(response => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                let value = "";
                if (response.data["AttachFile"]) {
                    document.getElementById("download_data").setAttribute("href", response.data.FilePath);
                    document.getElementById("download_data").click();
                } else if (response.data["AttachLink"]) {
                    value = response.data["AttachLink"];
                    var win = window.open(value, '_blank');
                    if (win) {
                        win.focus();
                    } else {
                        intl.warn('IDS_PLEASEALLOWPOPUPSFORTHISWEBSITE');
                    }
                }
                else {
                    if (response.data["rtn"]) {
                        toast.warn(intl.formatMessage({ id: response.data.rtn }));
                    }
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
                } else if (error.response?.status === 500) {
                    toast.error(error.message);
                } else {
                    toast.warn(error.response.data);
                }
            });
    }
}

// modified by sujatha ATE_274 modified action name to fix calling the action with the same name in sample scheduling
export function getCustomerComplaintDistrictLab(addParam, selectedRecord) {
    return function (dispatch) {
        const { userinfo, primarykey } = addParam.inputData;

        dispatch(initRequest(true));

        rsapi().post("customercomplaint/getDistrictLab", {
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
                } else if (error.response?.status === 500) {
                  toast.error(error.message);
                } else {
                  toast.warn(intl.formatMessage({ id: error.response.data }));
                }
            })
    };
}

// modified by sujatha ATE_274 modified action name to fix calling the action with the same name in sample scheduling
export function getCustomerComplaintSubDivisionalLab(addParam, selectedRecord) {
    return function (dispatch) {
        const { userinfo, primarykey } = addParam.inputData;

        dispatch(initRequest(true));

        rsapi().post("customercomplaint/getCustomerComplaintSubDivisionalLab", {
            userinfo,
            primarykey,
        })
            .then(response => {
                const data = response.data.villageList || [];

                const toOption = (row) => ({
                    value: row.nsitecode,
                    label: row.ssitename,
                    srelation: row.srelation,
                    ssitetypename: (row.ssitetypename || '').toUpperCase(),
                    nsitehierarchyconfigcode: row.nsitehierarchyconfigcode || 0 //added by sujatha ATE_274 23-09-2025 for getting the villages based on hierarchyconfigcode
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
                } else if (error.response?.status === 500) {
                  toast.error(error.message);
                } else {
                  toast.warn(intl.formatMessage({ id: error.response.data }));
                }
            })
    };
}


// modified by sujatha ATE_274 modified action name to fix calling the action with the same name in sample scheduling
export function getCustomerComplaintVillage(addParam, selectedRecord) {
    return function (dispatch) {
        const { userinfo, primarykey, nsitehierarchyconfigcode } = addParam.inputData;

        dispatch(initRequest(true));

        rsapi().post("customercomplaint/getVillage", {
            userinfo,
            primarykey, nsitehierarchyconfigcode        //added by sujatha ATE_274 23-09-2025 for getting the villages based on hierarchyconfigcode
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
                        selectedRecord,
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
                } else if (error.response?.status === 500) {
                  toast.error(error.message);
                } else {
                  toast.warn(intl.formatMessage({ id: error.response.data }));
                }
            })
    };
}