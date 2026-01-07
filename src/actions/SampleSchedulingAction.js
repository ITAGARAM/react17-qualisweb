import rsapi from "../rsapi";
import { DEFAULT_RETURN, UN_AUTHORIZED_ACCESS } from './LoginTypes';
import { toast } from 'react-toastify';
import { initRequest } from './LoginAction';
import Axios from 'axios';
import { rearrangeDateFormat, constructOptionList, } from '../components/CommonScript'
import { transactionStatus, attachmentType } from '../components/Enumeration';
import { intl } from '../components/App';



export function editSampleScheduling(screenName, operation, primaryKeyName, primaryKeyValue, masterData, userInfo, ncontrolcode) {
    return function (dispatch) {
//Added by Mullai Balaji V ATE_273 for check the record if it is Scheduled 
         // if (masterData.selectedSampleScheduling.stransdisplaystatus !== "Planned") 
            if( masterData.selectedSampleScheduling.ntransactionstatus !== transactionStatus.PLANNED
                &&  masterData.selectedSampleScheduling.ntransactionstatus !== transactionStatus.SCHEDULED
            )
            {

        let urlArray = [];
        const SampleSchedulingID = rsapi().post("samplescheduling/getActiveSampleSchedulingById", {
            nsampleschedulingcode: primaryKeyValue,
            userinfo: userInfo
        })
        urlArray = [SampleSchedulingID];
        Axios.all(urlArray)
            .then(response => {

                let selectedRecord = {};

                if (operation === "update") {
                    selectedRecord = response[0].data;
                    selectedRecord["sfromyear"] = new Date(response[0].data.sfromyear);
                }
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        operation, screenName, selectedRecord, openModal: true,
                        ncontrolcode: ncontrolcode, loading: false,
                    }
                });
               
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
            });
        }
        else {
            toast.warn(intl.formatMessage({ id: "IDS_SELECTDRAFTRECORD" }));

        }
    }
}


// export function editSampleSchedulingLocation(param) {
//     return function (dispatch) {

//         if (param.masterData.selectedSampleScheduling.stransdisplaystatus !== "Planned") {
//             let userInfo = param.userInfo;

//             const editRequest = rsapi().post("samplescheduling/getSampleSchedulingLocation", {
//                 nsampleschedulingcode: param.masterData.selectedSampleScheduling.nsampleschedulingcode,
//                 userinfo: userInfo
//             });

//             const addRequest = rsapi().post("samplescheduling/getRegion", { userinfo: userInfo });

//             dispatch(initRequest(true));

//             Axios.all([editRequest, addRequest])
//                 .then(Axios.spread((editResponse, addResponse) => {
//                     const editData = editResponse.data.sampleSchedulingLocation[0];

//                     const selectedRecord = {
//                         nstatelabcode: null,
//                         nregionallabcode: editData.nregioncode
//                             ? { value: editData.nregioncode, label: editData.sregionname }
//                             : null,
//                         ndistrictlabcode: editData.ndistrictcode
//                             ? { value: editData.ndistrictcode, label: editData.sdistrictname }
//                             : null,
//                         nsubdivisionallabcode: editData.ncitycode
//                             ? { value: editData.ncitycode, label: editData.scityname }
//                             : null,
//                         nvillagecode: editData.nvillagecode
//                             ? { value: editData.nvillagecode, label: editData.svillagename }
//                             : null,
//                         nsamplelocationcode: editData.nsamplelocationcode
//                             ? { value: editData.nsamplelocationcode, label: editData.ssamplelocationname }
//                             : null,
//                     };

//                     const data = addResponse.data;

//                     const toOption = (row) => ({
//                         value: row.nsitecode,
//                         label: row.ssitename,
//                         srelation: row.srelation,
//                         ssitetypename: (row.ssitetypename || "").toUpperCase(),
//                     });

//                     const normalizeType = (samplescheduling) => {
//                         const sampleScheduling = (samplescheduling || "").toUpperCase();
//                         if (sampleScheduling.includes("STATE")) return "STATE";
//                         if (sampleScheduling.includes("REGIONAL")) return "REGIONAL";
//                         if (sampleScheduling.includes("DISTRICT")) return "DISTRICT";
//                         if (sampleScheduling.includes("SUB DIVISIONAL")) return "SUBDIVISIONAL";
//                         return sampleScheduling;
//                     };

//                     let stateList = [];
//                     let regionalList = [];
//                     let districtList = [];
//                     let subDivisionalList = [];
//                     let villageList = [];
//                     let locationList = [];

//                     const typeHierarchy = ["STATE", "REGIONAL", "DISTRICT", "SUBDIVISIONAL"];

//                     const processList = (arr, relation) => {
//                         (arr || []).forEach(row => {
//                             const sample = normalizeType(row.ssitetypename);
//                             const opt = toOption(row);

//                             if (sample === "STATE") stateList.push(opt);
//                             else if (sample === "REGIONAL") regionalList.push(opt);
//                             else if (sample === "DISTRICT") districtList.push(opt);
//                             else if (sample === "SUBDIVISIONAL") subDivisionalList.push(opt);

//                             if (relation === "Parent" || relation === "Current") {
//                                 if (sample === "STATE") selectedRecord.nstatelabcode = opt;
//                                 else if (sample === "REGIONAL") selectedRecord.nregionallabcode = opt;
//                                 else if (sample === "DISTRICT") selectedRecord.ndistrictlabcode = opt;
//                                 else if (sample === "SUBDIVISIONAL") selectedRecord.nsubdivisionallabcode = opt;
//                             }
//                         });
//                     };

//                     processList(data.parentList, "Parent");
//                     processList(data.currentList, "Current");

//                     const currentType = data.currentList[0]?.ssitetypename?.toUpperCase();
//                     const currentIndex = typeHierarchy.indexOf(normalizeType(currentType));

//                     (data.childList || []).forEach(row => {
//                         const sample = normalizeType(row.ssitetypename);
//                         const sampleIndex = typeHierarchy.indexOf(sample);
//                         const opt = toOption(row);

//                         if (sample === "REGIONAL") regionalList.push(opt);
//                         else if (sample === "DISTRICT") districtList.push(opt);
//                         else if (sample === "SUBDIVISIONAL") subDivisionalList.push(opt);

//                         if (sample === "DISTRICT" && row.nsitecode === editData.ndistrictcode) {
//                             selectedRecord.ndistrictlabcode = opt;
//                         }
//                         if (sample === "SUBDIVISIONAL" && row.nsitecode === editData.ncitycode) {
//                             selectedRecord.nsubdivisionallabcode = opt;
//                         }
//                     });

//                     dispatch({
//                         type: DEFAULT_RETURN,
//                         payload: {
//                             loading: false,
//                             selectedRecord,
//                             stateList,
//                             regionalList,
//                             districtList, villageList, locationList,
//                             subDivisionalList,
//                             openModal: true,
//                             screenName: param.screenName,
//                             loadEsign: false,
//                             operation: "update",
//                             postParamList: param.postParamList,
//                             ncontrolcode: param.ncontrolcode
//                         }
//                     });
//                 }))
//                 .catch((error) => {
//                     dispatch({ type: DEFAULT_RETURN, payload: { loading: false } });
//                     if (error.response?.status === 500) {
//                         toast.error(error.message);
//                     } else {
//                         toast.warn(error.response?.data);
//                     }
//                 });
//         }

//         else {
//             toast.warn(intl.formatMessage({ id: "IDS_SELECTDRAFTRECORD" }));

//         }
//     }
// }


// export function editSampleSchedulingLocation(param) {
//   return function (dispatch) {
//     if (param.masterData.selectedSampleScheduling.stransdisplaystatus !== "Planned") {
//       let userInfo = param.userInfo;

//       const editRequest = rsapi().post("samplescheduling/getSampleSchedulingLocation", {
//         nsampleschedulingcode: param.masterData.selectedSampleScheduling.nsampleschedulingcode,
//         userinfo: userInfo
//       });

//       const regionRequest = rsapi().post("samplescheduling/getRegion", { userinfo: userInfo  });

//       dispatch(initRequest(true));

//       Axios.all([editRequest, regionRequest])
//         .then(Axios.spread((editResponse, regionResponse) => {
//           // --- STEP 1: Handle editResponse ---
//           const editData = editResponse.data.sampleSchedulingLocation[0] || {};

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

//           // --- STEP 2: Handle regionResponse ---
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

//           const uniqueLevels = [...new Set(allSites.map(site => Number(site.nlevel)))].sort((a, b) => a - b);

//           const stateOptions = [];
//           const regionalOptions = [];
//           const districtOptions = [];
//           const subDivisionalOptions = [];

//           const currentSite = regionData.currentList?.[0] || null;
//           const currentLevel = currentSite ? Number(currentSite.nlevel) : null;

//           const processSiteList = (siteList, isChildList = false) => {
//             siteList.forEach(site => {
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
//                   else if (site.nlevel === uniqueLevels[1]) selectedRecord.nregionallabcode = option;
//                   else if (site.nlevel === uniqueLevels[2]) selectedRecord.ndistrictlabcode = option;
//                   else if (site.nlevel === uniqueLevels[3]) selectedRecord.nsubdivisionallabcode = option;
//                 }
//               }

//               // Match with editData to prefill
//               if (site.nsitecode === editData.nregioncode) selectedRecord.nregionallabcode = option;
//               if (site.nsitecode === editData.ndistrictcode) selectedRecord.ndistrictlabcode = option;
//               if (site.nsitecode === editData.ncitycode) selectedRecord.nsubdivisionallabcode = option;
//             });
//           };

//           // Process parent and current sites
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

//           // --- STEP 3: Final dispatch ---
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
//       toast.warn(intl.formatMessage({ id: "IDS_SELECTDRAFTRECORD" }));
//     }
//   };
// }

// export function editSampleSchedulingLocation(param) {
//   return function (dispatch) {
//     if (param.masterData.selectedSampleScheduling.stransdisplaystatus !== "Planned") {
//       let userInfo = param.userInfo;

//       const editRequest = rsapi().post("samplescheduling/getSampleSchedulingLocation", {
//         nsampleschedulingcode: param.masterData.selectedSampleScheduling.nsampleschedulingcode,
//         userinfo: userInfo
//       });

//       const regionRequest = rsapi().post("samplescheduling/getRegion", { userinfo: userInfo });

//       dispatch(initRequest(true));

//       Axios.all([editRequest, regionRequest])
//         .then(Axios.spread((editResponse, regionResponse) => {
//           // --- STEP 1: Handle editResponse ---
//           const editData = editResponse.data.sampleSchedulingLocation[0] || {};

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

//           // --- STEP 2: Handle regionResponse ---
//           const regionData = regionResponse.data;

//           const createOption = (site, disable = false) => ({
//             value: site.nsitecode,
//             label: site.ssitename,
//             relation: site.srelation,
//             level: Number(site.nlevel),
//             isDisabled: disable
//           });

//           const stateOptions = [];
//           const regionalOptions = [];
//           const districtOptions = [];
//           const subDivisionalOptions = [];

//           const currentSite = regionData.currentList?.[0] || null;
//           const currentLevel = currentSite ? Number(currentSite.nlevel) : null;

//           // --- Determine which sites should be disabled ---
//           const disabledIds = new Set();
//           (regionData.parentList || []).forEach(s => disabledIds.add(s.nsitecode));  // only parents disabled

//           const processSiteList = (siteList, isChildList = false) => {
//             siteList.forEach(site => {
//               const option = createOption(site, disabledIds.has(site.nsitecode));

//               // Assign to correct dropdown
//               if (site.nlevel === 1) stateOptions.push(option);
//               else if (site.nlevel === 2) regionalOptions.push(option);
//               else if (site.nlevel === 3) districtOptions.push(option);
//               else if (site.nlevel === 4) subDivisionalOptions.push(option);

//               // Auto-select Current/Parent sites in selectedRecord
//               if (!isChildList && disabledIds.has(site.nsitecode)) {
//                 if (site.nlevel === 1) selectedRecord.nstatelabcode = option;
//                 else if (site.nlevel === 2) selectedRecord.nregionallabcode = option;
//                 else if (site.nlevel === 3) selectedRecord.ndistrictlabcode = option;
//                 else if (site.nlevel === 4) selectedRecord.nsubdivisionallabcode = option;
//               }

//               // Match with editData to prefill
//               if (site.nsitecode === editData.nregioncode) selectedRecord.nregionallabcode = option;
//               if (site.nsitecode === editData.ndistrictcode) selectedRecord.ndistrictlabcode = option;
//               if (site.nsitecode === editData.ncitycode) selectedRecord.nsubdivisionallabcode = option;
//             });
//           };

//           // Process parent and current sites
//           processSiteList(regionData.currentList || []);
//           processSiteList(regionData.parentList || []);

//           // Process child sites
//           if (currentSite) {
//             const nextLevel = currentLevel + 1;
//             const directChildren = (regionData.childList || []).filter(
//               site => Number(site.nlevel) === nextLevel
//             );
//             processSiteList(directChildren, true);
//           }

//           const sortByLabel = (a, b) => a.label.localeCompare(b.label);
//           stateOptions.sort(sortByLabel);
//           regionalOptions.sort(sortByLabel);
//           districtOptions.sort(sortByLabel);
//           subDivisionalOptions.sort(sortByLabel);

//           // --- STEP 3: Final dispatch ---
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
//       toast.warn(intl.formatMessage({ id: "IDS_SELECTDRAFTRECORD" }));
//     }
//   };
// }





// export function editSampleSchedulingLocation(param) {
//   return function (dispatch) {
//     if (param.masterData.selectedSampleScheduling.stransdisplaystatus !== "Planned") {
//       const userInfo = param.userInfo;

//       const editRequest = rsapi().post("samplescheduling/getSampleSchedulingLocation", {
//       //  nsampleschedulingcode: param.masterData.selectedSampleScheduling.nsampleschedulingcode,
//       nsampleschedulinglocationcode:param.primaryKeyValue,
//         userinfo: userInfo
//       });

//       const regionRequest = rsapi().post("samplescheduling/getRegion", { userinfo: userInfo });

//       dispatch(initRequest(true));

//       Axios.all([editRequest, regionRequest])
//         .then(Axios.spread((editResponse, regionResponse) => {
//           const editData = editResponse.data.sampleSchedulingLocation?.[0] || {};

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
//       toast.warn(intl.formatMessage({ id: "IDS_SELECTDRAFTRECORD" }));
//     }
//   };
// }


export function editSampleSchedulingLocation(param) {
    return function (dispatch) {
        if (param.masterData.selectedSampleScheduling.ntransactionstatus === transactionStatus.DRAFT) {
            const userInfo = param.userInfo;
            const editRequest = rsapi().post("samplescheduling/getSampleSchedulingLocation", {
                nsampleschedulinglocationcode: param.primaryKeyValue,
                userinfo: userInfo
            });
            const regionRequest = rsapi().post("samplescheduling/getRegion", { userinfo: userInfo });
            dispatch(initRequest(true));

            Axios.all([editRequest, regionRequest])
                .then(Axios.spread((editResponse, regionResponse) => {
                    const editData = editResponse.data.sampleSchedulingLocation?.[0] || {};
                    const regionData = regionResponse.data;

                    // Prefill selected record
                    const selectedRecord = {
                        // nstatelabcode: null,
                        nstatelabcode: editData.ncentralsitecode ? { value: editData.ncentralsitecode, label: editData.scentralsitename } : null,
                        nregionallabcode: editData.nregioncode ? { value: editData.nregioncode, label: editData.sregionname } : null,
                        ndistrictlabcode: editData.ndistrictcode ? { value: editData.ndistrictcode, label: editData.sdistrictname } : null,
                        nsubdivisionallabcode: editData.ncitycode ? { value: editData.ncitycode, label: editData.scityname } : null,
                        nvillagecode: editData.nvillagecode ? { value: editData.nvillagecode, label: editData.svillagename } : null,
                        nsamplelocationcode: editData.nsamplelocationcode ? { value: editData.nsamplelocationcode, label: editData.ssamplelocationname } : null,
						//added by sujatha ATE_274 SWWM-117 for getting villages by checking sitehierarchyconfig code 
                        nsitehierarchyconfigcode:regionData.currentList[0].nsitehierarchyconfigcode

                    };

                    const createOption = (site, disable = false) => ({
                        value: site.nsitecode,
                        label: site.ssitename,
                        relation: site.srelation,
                        level: Number(site.nlevel),
                        isDisabled: disable,
						//added by sujatha ATE_274 SWWM-117 for passing the nsitehierarchyconfigcode to the optionList to pass this to the backend to get data based on this code 
                        nsitehierarchyconfigcode:site.nsitehierarchyconfigcode
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
                    const currentLevel = currentSite ? Number(currentSite.nlevel) : null;

                    // --- Disable parent + current sites ALWAYS ---
                    const disabledIds = new Set();
                    (regionData.parentList || []).forEach(s => disabledIds.add(s.nsitecode));
                    if (currentSite) disabledIds.add(currentSite.nsitecode);

                    const processSiteList = (siteList, isChildList = false) => {
                        siteList.forEach(site => {
                            const option = createOption(site, disabledIds.has(site.nsitecode));

                            // Assign to correct dropdown
                            if (site.nlevel === uniqueLevels[0]) stateOptions.push(option);
                            else if (site.nlevel === uniqueLevels[1]) regionalOptions.push(option);
                            else if (site.nlevel === uniqueLevels[2]) districtOptions.push(option);
                            else if (site.nlevel === uniqueLevels[3]) subDivisionalOptions.push(option);

                            // Prefill selectedRecord based on editData
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
                                ncontrolcode: param.ncontrolcode
                            }
                        });
                    };

                    // Process child sites (next level only)
                    if (currentSite) {
                        const nextLevel = currentLevel + 1;
                        const directChildren = (regionData.childList || []).filter(
                            site => Number(site.nlevel) === nextLevel
                        );

                        if (directChildren.length > 0) {
                            processSiteList(directChildren, true);
                            dispatchPayload();
                        } else {
                            // If no child, call getVillage API
                            rsapi().post("samplescheduling/getVillage", {
                                userinfo: userInfo,
                                primarykey: currentSite?.nsitecode,
                                nsitehierarchyconfigcode: currentSite?.nsitehierarchyconfigcode
                            })
                                .then(response => {
                                    villageList = (response.data.villageList || []).map(row => ({
                                        value: row.nvillagecode,
                                        label: row.svillagename,
                                        srelation: row.srelation,
                                        ssitetypename: (row.ssitetypename || '').toUpperCase(),
                                        isDisabled: false
                                    }));

                                    // For next level (location) dropdown, prefill selectedRecord if exists
                                    locationList = editData.nsamplelocationcode
                                        ? [{ value: editData.nsamplelocationcode, label: editData.ssamplelocationname }]
                                        : [];

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
                .catch((error) => {
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
        else {
            toast.warn(intl.formatMessage({ id: "IDS_SELECTDRAFTRECORD" }));
        }
    };
}




export function getSampleSchedulingRecord(selectedsampleData, getParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("samplescheduling/getSampleSchedulingRecord", { nsampleschedulingcode: selectedsampleData.nsampleschedulingcode, userinfo: getParam.userInfo })
            .then(response => {

                let selectedRecord = response.data.selectedSampleScheduling;

                let masterDatadetails = { ...getParam.masterData };
                let sampleSchedulingFile = response.data.sampleSchedulingFile
                let sampleSchedulingLocation = response.data.sampleSchedulingLocation
                masterDatadetails['selectedSampleScheduling'] = selectedRecord;
                masterDatadetails['sampleSchedulingFile'] = sampleSchedulingFile;
                masterDatadetails['sampleSchedulingLocation'] = sampleSchedulingLocation;

                //Added By Mullai Balaji V ATE_273 for List Master side not changed properly 
                masterDatadetails['sampleSchedulingRecord'] =
                        (getParam.masterData.sampleSchedulingRecord || []).map(rec =>
                            rec.nsampleschedulingcode === response.data.selectedSampleScheduling.nsampleschedulingcode
                                ? { ...rec, ...response.data.selectedSampleScheduling }  // merge new values
                                : rec
                        );

                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        loading: false,
                        masterData: masterDatadetails,
                        selectedRecord,
                        screenName: getParam.screenName,
                        sampleSchedulingSkip: getParam.sampleSchedulingSkip,
                        sampleSchedulingTake: getParam.sampleSchedulingTake

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




export const addSampleSchedulingFile = (inputParam) => {
    return (dispatch) => {
        dispatch(initRequest(true));
        let urlArray = [rsapi().post("/linkmaster/getLinkMaster", {
            userinfo: inputParam.userInfo
        })];
        if (inputParam.operation === "update") {
            urlArray.push(rsapi().post("/samplescheduling/editSampleSchedulingFile", {
                userinfo: inputParam.userInfo,
                sampleschedulingfile: inputParam.selectedRecord
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
                        nsampleschedulingfilecode: editObject.nsampleschedulingfilecode,
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



export function getSampleScheduling(inputData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("samplescheduling/getSampleSchedulingData", { ...inputData.inputData })
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
                        sampleSchedulingSkip: 0,
                        sampleSchedulingTake: undefined,
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

// export function addSampleSchedulingLocation(addParam) {
//     return function (dispatch) {

//         if(addParam.masterData.sampleSchedulingLocation.length === 0)
//         {
//         let userInfo = addParam.userInfo;
//         const getRegion = rsapi().post("samplescheduling/getRegion", { userinfo: userInfo });
//         dispatch(initRequest(true));

//         Axios.all([getRegion])
//             .then(response => {
//                 const data = response[0].data;

//                 const toOption = (row) => ({
//                     value: row.nsitecode,
//                     label: row.ssitename,
//                     srelation: row.srelation,
//                     ssitetypename: (row.ssitetypename || "").toUpperCase(),
//                 });

//                 const normalizeType = (samplescheduling) => {
//                     const sampleScheduling = (samplescheduling || "").toUpperCase();
//                     if (sampleScheduling.includes("STATE")) return "STATE";
//                     if (sampleScheduling.includes("REGIONAL")) return "REGIONAL";
//                     if (sampleScheduling.includes("DISTRICT")) return "DISTRICT";
//                     if (sampleScheduling.includes("SUB DIVISIONAL")) return "SUBDIVISIONAL";
//                     return sampleScheduling;
//                 };

//                 let stateList = [];
//                 let regionalList = [];
//                 let districtList = [];
//                 let subDivisionalList = [];

//                 const typeHierarchy = ["STATE", "REGIONAL", "DISTRICT", "SUBDIVISIONAL"];
//                 const selectedRecord = {};

//                 const processList = (arr, relation) => {
//                     (arr || []).forEach(row => {
//                         const sample = normalizeType(row.ssitetypename);
//                         const opt = toOption(row);

//                         if (sample === "STATE") stateList.push(opt);
//                         else if (sample === "REGIONAL") regionalList.push(opt);
//                         else if (sample === "DISTRICT") districtList.push(opt);
//                         else if (sample === "SUBDIVISIONAL") subDivisionalList.push(opt);

//                         if (relation === "Parent" || relation === "Current") {
//                             if (sample === "STATE") selectedRecord.nstatelabcode = opt;
//                             else if (sample === "REGIONAL") selectedRecord.nregionallabcode = opt;
//                             else if (sample === "DISTRICT") selectedRecord.ndistrictlabcode = opt;
//                             else if (sample === "SUBDIVISIONAL") selectedRecord.nsubdivisionallabcode = opt;
//                         }
//                     });
//                 };

//                 processList(data.parentList, "Parent");
//                 processList(data.currentList, "Current");

//                 const currentType = data.currentList[0]?.ssitetypename?.toUpperCase();
//                 const currentIndex = typeHierarchy.indexOf(normalizeType(currentType));

//                 (data.childList || []).forEach(row => {
//                     const sample = normalizeType(row.ssitetypename);
//                     const sampleIndex = typeHierarchy.indexOf(sample);
//                     const opt = toOption(row);

//                     if (sampleIndex === currentIndex + 1) {
//                         if (sample === "REGIONAL") regionalList.push(opt);
//                         else if (sample === "DISTRICT") districtList.push(opt);
//                         else if (sample === "SUBDIVISIONAL") subDivisionalList.push(opt);
//                     }
//                 });

//                 dispatch({
//                     type: DEFAULT_RETURN,
//                     payload: {
//                         loading: false,
//                         selectedRecord,
//                         stateList,
//                         regionalList,
//                         districtList,
//                         subDivisionalList,
//                         openModal: true,
//                         screenName: addParam.screenName,
//                         loadEsign: false,
//                         operation: "create",
//                         postParamList: addParam.postParamList
//                     }
//                 });
//             })
//                       .catch(error => {
//                 dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
//                 if (error.response.status === 500) {
//                     toast.error(error.message);
//                 } else {
//                     toast.warn(error.response.data);
//                 }
//             })
//         }
//         else
//         {
//          toast.warn(intl.formatMessage({ id: "IDS_ALREADYREGISTERED" }));
//         }
//     };
// }
// export function addSampleSchedulingLocation(params) {
//   return function (dispatch) {
//     if (params.masterData.sampleSchedulingLocation.length === 0) {
//       dispatch(initRequest(true));

//       const fetchRegion = rsapi().post("samplescheduling/getRegion", { userinfo: params.userInfo });

//       Axios.all([fetchRegion])
//         .then(responses => {
//           const regionData = responses[0].data;

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

//           const uniqueLevels = [...new Set(allSites.map(site => Number(site.nlevel)))].sort((a, b) => a - b);

//           const stateOptions = [];
//           const regionalOptions = [];
//           const districtOptions = [];
//           const subDivisionalOptions = [];
//           const selectedSites = {};

//           const currentSite = regionData.currentList?.[0] || null;
//           const currentLevel = currentSite ? Number(currentSite.nlevel) : null;

//           const processSiteList = (siteList, isChildList = false) => {
//             siteList.forEach(site => {
//               const option = createOption(site);

//               // Assign to correct dropdown
//               if (site.nlevel === uniqueLevels[0]) stateOptions.push(option);
//               else if (site.nlevel === uniqueLevels[1]) regionalOptions.push(option);
//               else if (site.nlevel === uniqueLevels[2]) districtOptions.push(option);
//               else if (site.nlevel === uniqueLevels[3]) subDivisionalOptions.push(option);

//               // --- Auto-select current or parent sites ---
//               if (!isChildList) {
//                 if (
//                   site.srelation === "Current" ||
//                   site.srelation === "Parent" ||
//                   siteList === regionData.parentList
//                 ) {
//                   if (site.nlevel === uniqueLevels[0]) selectedSites.nstatelabcode = option;
//                   else if (site.nlevel === uniqueLevels[1]) selectedSites.nregionallabcode = option;
//                   else if (site.nlevel === uniqueLevels[2]) selectedSites.ndistrictlabcode = option;
//                   else if (site.nlevel === uniqueLevels[3]) selectedSites.nsubdivisionallabcode = option;
//                 }
//               }
//             });
//           };

//           // Process parent and current sites
//           processSiteList(regionData.currentList || []);
//           processSiteList(regionData.parentList || []);

//           // Process child sites for next level (if any)
//           if (currentSite) {
//             const nextLevel = currentLevel + 1;
//             const directChildren = (regionData.childList || []).filter(site =>
//               Number(site.parentkey) === Number(currentSite.nsitecode) &&
//               Number(site.nlevel) === nextLevel
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
//               selectedRecord: selectedSites,
//               stateList: stateOptions,
//               regionalList: regionalOptions,
//               districtList: districtOptions,
//               subDivisionalList: subDivisionalOptions,
//               villageList: [],
//               locationList: [],
//               openModal: true,
//               screenName: params.screenName,
//               loadEsign: false,
//               operation: "create",
//               postParamList: params.postParamList,
//             },
//           });
//         })
//         .catch(error => {
//           dispatch({ type: DEFAULT_RETURN, payload: { loading: false } });
//           if (error.response?.status === 500) {
//             toast.error(error.message);
//           }
//         });
//     } else {
//       toast.warn(intl.formatMessage({ id: "IDS_ALREADYREGISTERED" }));
//     }
//   };
// }


// export function addSampleSchedulingLocation(params) {
//     return function (dispatch) {
//         if (params.masterData.sampleSchedulingLocation.length === 0) {
//             dispatch(initRequest(true));

//             const fetchRegion = rsapi().post("samplescheduling/getRegion", { userinfo: params.userInfo });

//             Axios.all([fetchRegion])
//                 .then(async (responses) => {
//                     const regionData = responses[0].data;

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
//                     const selectedSites = {};

//                     const currentSite = regionData.currentList?.[0] || null;
//                     const currentLevel = currentSite ? Number(currentSite.nlevel) : null;

//                     const processSiteList = (siteList, isChildList = false) => {
//                         siteList.forEach(site => {
//                             const option = createOption(site);

//                             if (site.nlevel === uniqueLevels[0]) stateOptions.push(option);
//                             else if (site.nlevel === uniqueLevels[1]) regionalOptions.push(option);
//                             else if (site.nlevel === uniqueLevels[2]) districtOptions.push(option);
//                             else if (site.nlevel === uniqueLevels[3]) subDivisionalOptions.push(option);

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
//                                 }
//                             }
//                         });
//                     };

//                     // Process current + parent
//                     processSiteList(regionData.currentList || []);
//                     processSiteList(regionData.parentList || []);

//                     // Process child list OR fetch villages
//                     let villageList = [];
//                     if (currentSite) {
//                         const nextLevel = currentLevel + 1;
//                         const directChildren = (regionData.childList || []).filter(
//                             site => Number(site.nlevel) === nextLevel
//                         );

//                         if (directChildren.length > 0) {
//                             // process child dropdown
//                             processSiteList(directChildren, true);
//                         } else {
//                             // --- CHILD IS EMPTY => fetch villages ---
//                             try {
//                                 const villageResp = await rsapi().post("samplescheduling/getVillage", {
//                                     userinfo: params.userInfo,
//                                     primarykey: currentSite.nsitecode,
//                                 });

//                                 const data = villageResp.data.villageList || [];
//                                 villageList = data.map(row => ({
//                                     value: row.nvillagecode,
//                                     label: row.svillagename,
//                                     srelation: row.srelation,
//                                     ssitetypename: (row.ssitetypename || '').toUpperCase(),
//                                 }));

//                                 // reset village-related fields in selectedSites
//                                 selectedSites.nvillagecode = null;
//                                 selectedSites.nsamplelocationcode = null;
//                             } catch (err) {
//                                 toast.error(err.message);
//                             }
//                         }
//                     }

//                     // Sort dropdowns
//                     const sortByLabel = (a, b) => a.label.localeCompare(b.label);
//                     stateOptions.sort(sortByLabel);
//                     regionalOptions.sort(sortByLabel);
//                     districtOptions.sort(sortByLabel);
//                     subDivisionalOptions.sort(sortByLabel);

//                     // Dispatch processed data
//                     dispatch({
//                         type: DEFAULT_RETURN,
//                         payload: {
//                             loading: false,
//                             selectedRecord: selectedSites,
//                             stateList: stateOptions,
//                             regionalList: regionalOptions,
//                             districtList: districtOptions,
//                             subDivisionalList: subDivisionalOptions,
//                             villageList,
//                             locationList: [],
//                             openModal: true,
//                             screenName: params.screenName,
//                             loadEsign: false,
//                             operation: "create",
//                             postParamList: params.postParamList,
//                         },
//                     });
//                 })
//                 .catch(error => {
//                     dispatch({ type: DEFAULT_RETURN, payload: { loading: false } });
//                     if (error.response?.status === 500) {
//                         toast.error(error.message);
//                     }
//                 });
//         } else {
//             toast.warn(intl.formatMessage({ id: "IDS_ALREADYLOCATIONADDED" }));
//         }
//     };
// }

export function addSampleSchedulingLocation(params) {
    return function (dispatch) {
 //Added By Mullai Balaji V for jira swsm-102 only allow planned and draft records to create 
               if( params.masterData.selectedSampleScheduling.ntransactionstatus=== transactionStatus.PLANNED ||
                   params.masterData.selectedSampleScheduling.ntransactionstatus=== transactionStatus.DRAFT)          
{
        dispatch(initRequest(true));
        const fetchRegion = rsapi().post("samplescheduling/getRegion", { userinfo: params.userInfo });
        Axios.all([fetchRegion])
            .then((responses) => {
                const regionData = responses[0].data;
                const nsitehierarchyconfigcode = regionData.currentList[0].nsitehierarchyconfigcode;
                // helper to build dropdown option
                const createOption = (site, disable = false) => ({
                    value: site.nsitecode,
                    label: site.ssitename,
                    relation: site.srelation,
                    level: Number(site.nlevel),
                    isDisabled: disable,
				//added by sujatha ATE_274 SWSM-117 for passing this to the optionList for getting data from the backend 
                    nsitehierarchyconfigcode: site.nsitehierarchyconfigcode
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
                        rsapi().post("samplescheduling/getVillage", {
                            userinfo: params.userInfo,
                            primarykey: currentSite.nsitecode,
						//added by sujatha ATE_274 SWSM-117 for getting villages by checking sitehierarchyconfig code 
                            nsitehierarchyconfigcode:currentSite.nsitehierarchyconfigcode
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
                //added by sujatha ATE_274 SWSM-117 for throwing alert if the logged in site is not in approved site hierarchy
                } else {
                    toast.warn(error.response.data);
                }
            });
    }
     //Added By Mullai Balaji V for jira swsm-102 
    else
        {
            toast.warn(intl.formatMessage({ id: "IDS_SELECTDRAFTRECORD" }));
        }
    
     } ;

}

// export function addSampleSchedulingLocation(params) {
//     return function (dispatch) {
//         if (params.masterData.sampleSchedulingLocation.length === 0) {
//             dispatch(initRequest(true));

//             const fetchRegion = rsapi().post("samplescheduling/getRegion", { userinfo: params.userInfo });

//             Axios.all([fetchRegion])
//                 .then(responses => {
//                     const regionData = responses[0].data;

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
//                     const selectedSites = {};

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

//                     // Dispatch final processed data
//                     dispatch({
//                         type: DEFAULT_RETURN,
//                         payload: {
//                             loading: false,
//                             selectedRecord: selectedSites,
//                             stateList: stateOptions,
//                             regionalList: regionalOptions,
//                             districtList: districtOptions,
//                             subDivisionalList: subDivisionalOptions,
//                             villageList: [],
//                             locationList: [],
//                             openModal: true,
//                             screenName: params.screenName,
//                             loadEsign: false,
//                             operation: "create",
//                             postParamList: params.postParamList,
//                         },
//                     });
//                 })
//                 .catch(error => {
//                     dispatch({ type: DEFAULT_RETURN, payload: { loading: false } });
//                     if (error.response?.status === 500) {
//                         toast.error(error.message);
//                     }
//                 });
//         } else {
//             toast.warn(intl.formatMessage({ id: "IDS_ALREADYREGISTERED" }));
//         }
//     };
// }

export function getDistrictLab(addParam, selectedRecord) {
    return function (dispatch) {
        const { userinfo, primarykey } = addParam.inputData;

        dispatch(initRequest(true));

        rsapi().post("samplescheduling/getDistrictLab", {
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

export function getSubDivisionalLab(addParam, selectedRecord) {
    return function (dispatch) {
        const { userinfo, primarykey } = addParam.inputData;

        dispatch(initRequest(true));

        rsapi().post("samplescheduling/getSubDivisionalLab", {
            userinfo,
            primarykey
        })
            .then(response => {
                const data = response.data.villageList || [];

                const toOption = (row) => ({
                    value: row.nsitecode,
                    label: row.ssitename,
                    srelation: row.srelation,
                    ssitetypename: (row.ssitetypename || '').toUpperCase(),
					//added by sujatha ATE_274 SWSM-117 for passing this nsitehierarchyconfigcode to get the village data
                     nsitehierarchyconfigcode:row.nsitehierarchyconfigcode
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

export function getSampleSchedulingVillage(addParam, selectedRecord) {
    return function (dispatch) {
		//added nsitehierarchyconfigcode by sujatha ATE_274 SWSM-117 for getting village based on nsitehierarchyconfigcode
        const { userinfo, primarykey, nsitehierarchyconfigcode } = addParam.inputData;

        dispatch(initRequest(true));

        rsapi().post("samplescheduling/getVillage", {
            userinfo,
            primarykey, nsitehierarchyconfigcode    // passed nsitehierarchyconfigcode by sujatha ATE_274 SWSM-117 for getting village based on nsitehierarchyconfigcode
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

export function getLocation(addParam, selectedRecord) {
    return function (dispatch) {
        const { userinfo, primarykey } = addParam.inputData;

        dispatch(initRequest(true));

        rsapi().post("samplescheduling/getLocation", {
            userinfo,
            primarykey
        })
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


export function getPlanned(plannedParam) {
    return function (dispatch) {

         //Added By Mullai Balaji V for jira swsm-102 to check the scheduled Records 
        //if (plannedParam.masterData.selectedSampleScheduling.stransdisplaystatus !== "Planned")
          if(plannedParam.masterData.selectedSampleScheduling.ntransactionstatus !== transactionStatus.PLANNED
                && plannedParam. masterData.selectedSampleScheduling.ntransactionstatus !== transactionStatus.SCHEDULED
            )  
            
            {
            const getPlanned = rsapi().post("samplescheduling/plannedSampleScheduling", {
                primarykey: plannedParam.masterData.selectedSampleScheduling.nsampleschedulingcode,
                samplescheduling: plannedParam.masterData.selectedSampleScheduling, userinfo: plannedParam.userInfo
            });
            let urlArray = [getPlanned];
            dispatch(initRequest(true));
            Axios.all(urlArray)
                .then(responseArray => {
                    const response = responseArray[0];  // pick the first element
                    const data = response.data;         // actual backend payload

                    let masterDatadetails = { ...plannedParam.masterData };

                    masterDatadetails['selectedSampleScheduling'] = data.selectedSampleScheduling || {};
                    masterDatadetails['sampleSchedulingFile'] = data.sampleSchedulingFile || [];
                    masterDatadetails['sampleSchedulingLocation'] = data.sampleSchedulingLocation || [];

                    masterDatadetails['sampleSchedulingRecord'] =
                        (plannedParam.masterData.sampleSchedulingRecord || []).map(rec =>
                            rec.nsampleschedulingcode === data.selectedSampleScheduling.nsampleschedulingcode
                                ? { ...rec, ...data.selectedSampleScheduling }  // merge new values
                                : rec
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
            toast.warn(intl.formatMessage({ id: "IDS_SELECTDRAFTRECORD" }));
        }
    }
}



export function getSampleSchedulingData(inputData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("samplescheduling/getSampleSchedulingData", { ...inputData.inputData })
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