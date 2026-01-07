import { toast } from 'react-toastify';
import Axios from 'axios';
import rsapi from '../rsapi';
import { initRequest } from './LoginAction';
import { DEFAULT_RETURN, UN_AUTHORIZED_ACCESS } from './LoginTypes';
import { sortData, constructOptionList, rearrangeDateFormat, ageCalculate } from '../components/CommonScript';
import { transactionStatus } from '../components/Enumeration';
import { intl } from '../components/App';
import { Utils as QbUtils } from "@react-awesome-query-builder/ui";
const { checkTree, loadTree, uuid } = QbUtils;

export function getPatientDetail(patient, userInfo, masterData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("patient/getPatient", { spatientid: patient.spatientid, userinfo: userInfo })
            .then(response => {
                masterData = { ...masterData, ...response.data };
                sortData(masterData);
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData, operation: null, modalName: undefined,
                        loading: false,patientHistory:false,patientReportHistory:false
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


export function getPatientComboService(inputParam) {
    return function (dispatch) {

        const genderService = rsapi().post("patient/getGender", { userinfo: inputParam.userInfo });
        const UTCtimeZoneService = rsapi().post("timezone/getLocalTimeByZone", { userinfo: inputParam.userInfo });
        const countryService = rsapi().post("patient/getCountry", { userinfo: inputParam.userInfo });
        const regionService = rsapi().post("patient/getRegion", { userinfo: inputParam.userInfo });

        let urlArray = [];
        if (inputParam.operation === "create") {
            urlArray = [genderService, UTCtimeZoneService, countryService, regionService];
        }
        else {
            const patientById = rsapi().post("patient/getActivePatientById",
                {
                    [inputParam.primaryKeyName]: inputParam.masterData.SelectedPatient[inputParam.primaryKeyName],
                    "userinfo": inputParam.userInfo
                });
            const citySer = rsapi().post("/patient/getCity", { "userinfo": inputParam.userInfo, "ndistrictcode": inputParam.masterData.SelectedPatient.ndistrictcode });
            const districtSer = rsapi().post("/patient/getDistrict", { "userinfo": inputParam.userInfo, "nregioncode": inputParam.masterData.SelectedPatient.nregioncode })
            const citySertemp = rsapi().post("/patient/getCity", { "userinfo": inputParam.userInfo, "ndistrictcode": inputParam.masterData.SelectedPatient.ndistrictcodetemp });
            const districtSertemp = rsapi().post("/patient/getDistrict", { "userinfo": inputParam.userInfo, "nregioncode": inputParam.masterData.SelectedPatient.nregioncodetemp });
            urlArray = [genderService, UTCtimeZoneService, countryService, regionService, patientById, citySer, districtSer, citySertemp, districtSertemp];
        }
        dispatch(initRequest(true));
        Axios.all(urlArray)
            .then(response => {
                let gender = [];
                let city = [];
                let country = [];
                let region = [];
                let regionTemp = [];
                let districtTemp = [];
                let district = [];
                let cityTemp = [];
                let districtList = [];
                let cityList = [];
                let cityListTemp = [];
                let districtListTemp = [];
                const genderMap = constructOptionList(response[0].data['genderList'] || [], "ngendercode",
                    "sgendername", undefined, undefined, false);
                const genderList = genderMap.get("OptionList");

                const countryMap = constructOptionList(response[2].data['countryList'] || [], "ncountrycode",
                    "scountryname", undefined, undefined, false);
                const countryList = countryMap.get("OptionList");

                const regionMap = constructOptionList(response[3].data['regionList'] || [], "nregioncode",
                    "sregionname", undefined, undefined, false);
                const regionList = regionMap.get("OptionList");
                if (inputParam.operation === "update") {
                    const cityserMap = constructOptionList(response[5].data['cityList'] || [], "ncitycode",
                        "scityname", undefined, undefined, false);
                    cityList = cityserMap.get("OptionList");

                    const distMap = constructOptionList(response[6].data['districtList'] || [], "ndistrictcode",
                        "sdistrictname", undefined, undefined, false);
                    districtList = distMap.get("OptionList");

                    const cityserTempMap = constructOptionList(response[7].data['cityList'] || [], "ncitycode",
                        "scityname", undefined, undefined, false);
                    cityListTemp = cityserTempMap.get("OptionList");

                    const distTempMap = constructOptionList(response[8].data['districtList'] || [], "ndistrictcode",
                        "sdistrictname", undefined, undefined, false);
                    districtListTemp = distTempMap.get("OptionList");
                }

                let selectedRecord = {};
                const currentTime = rearrangeDateFormat(inputParam.userInfo, response[1].data?.date);

                if (inputParam.operation === "update") {
                    selectedRecord = response[4].data;

                    gender.push({ "value": response[4].data["ngendercode"], "label": response[4].data["sgendername"] });
                    city.push({ "value": response[4].data["ncitycode"], "label": response[4].data["scityname"] });
                    country.push({ "value": response[4].data["ncountrycode"], "label": response[4].data["scountryname"] });
                    region.push({ "value": response[4].data["nregioncode"], "label": response[4].data["sregionname"] });
                    regionTemp.push({ "value": response[4].data["nregioncodetemp"], "label": response[4].data["sregionnametemp"] });
                    districtTemp.push({ "value": response[4].data["ndistrictcodetemp"], "label": response[4].data["sdistrictnametemp"] });
                    district.push({ "value": response[4].data["ndistrictcode"], "label": response[4].data["sdistrictname"] });
                    cityTemp.push({ "value": response[4].data["ncitycodetemp"], "label": response[4].data["scitynametemp"] });
                    selectedRecord["ngendercode"] = gender[0];
                    selectedRecord["ncitycode"] = city[0];
                    selectedRecord["ncountrycode"] = country[0];
                    selectedRecord["nregioncode"] = region[0];
                    selectedRecord["nregioncodetemp"] = regionTemp[0];
                    selectedRecord["ndistrictcodetemp"] = districtTemp[0];
                    selectedRecord["ndistrictcode"] = district[0];
                    selectedRecord["ncitycodetemp"] = cityTemp[0];

                    if (selectedRecord["ddob"] !== null) {
                        selectedRecord["ddob"] = rearrangeDateFormat(inputParam.userInfo, selectedRecord["sdob"]);
                    }
                }
                else {

                    selectedRecord["ngendercode"] = genderMap.get("DefaultValue");
                    //ALPD-3267
                    //selectedRecord["ddob"] = rearrangeDateFormat(inputParam.userInfo, response[1].data);
                    selectedRecord["ddob"] = "";
                    selectedRecord["sage"] = ageCalculate(selectedRecord["ddob"])
                    selectedRecord["nneedcurrentaddress"] = transactionStatus.NO;
                    selectedRecord["today"] = inputParam.userInfo;
                }

                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        genderList,
                        cityListTemp,
                        districtListTemp,
                        districtList,
                        cityList,
                        countryList,
                        operation: inputParam.operation,
                        screenName: inputParam.screenName,
                        selectedRecord,
                        openModal: true,
                        ncontrolCode: inputParam.ncontrolcode,
                        loading: false,
                        currentTime,
                        regionList,
                        patientHistory:false,patientReportHistory:false
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


export function getPatientReport(patient, userInfo, ncontrolCode) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("patient/patientReportGenerate", {
            patient, userinfo: userInfo,
            ncontrolcode: ncontrolCode
        })
            .then(response => {
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        loading: false,
                        loadEsign: false, openModal: false
                    }
                })
                document.getElementById("download_data").setAttribute("href", response.data.filepath);
                document.getElementById("download_data").click();
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

export function getPatientDetailsByFilterQuery(inputParam, masterData, SelectedPatientCaseType) {
    return function (dispatch) {
        let URL = [];
        let filterData;
        let filterData1;
        if (inputParam.displayname === "Filter") {
            filterData = rsapi().post("/patient/getFilterByDate", {
                "userinfo": inputParam.inputData.userinfo,
                "formdate": inputParam.inputData.date.fromDate, "todate": inputParam.inputData.date.toDate, "casetype": inputParam.inputData.casetype
            })
        }
        else {
            filterData = rsapi().post("/patient/filterByPatient", {
                "filterquery": inputParam.inputData.filterquery
                , "userinfo": inputParam.inputData.userinfo
            })
            if (masterData.QueryName === "Create New Query") {
                filterData1 = rsapi().post("/patient/createFilterQuery", { ...inputParam.inputData.patientfilter, userinfo: inputParam.inputData.userinfo })
            }
        }

        URL = [filterData, filterData1];
        dispatch(initRequest(true));
        Axios.all(URL)
            .then(response => {
                let slideResult = response[0].data.PatientList;
                let selectedRecord = response[0].data.PatientList;
                selectedRecord["fromdate"] = rearrangeDateFormat(inputParam.inputData.userinfo, response[0].data.filterFromdate);
                selectedRecord["ToDay"] = rearrangeDateFormat(inputParam.inputData.userinfo, response[0].data.filterToDay);
                masterData = {
                    ...masterData, SelectedPatientCaseType: SelectedPatientCaseType,
                    ...response[0].data, searchedData: undefined
                };
                sortData(masterData);
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData,
                        loading: false, skip: 0, take: 20, slideResult: false,
                        openModal: false, openSolidAdvFilter: false, selectedRecord,patientHistory:false,patientReportHistory:false,
                        loadEsign:false
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
            });
    }
}
export function getDistrictComboServices(methodParam) {
    return function (dispatch) {
        let URL = [];
        URL = rsapi().post("/patient/getDistrict", { "userinfo": methodParam.inputData.userinfo, "nregioncode": methodParam.inputData.primarykey })
        dispatch(initRequest(true));
        Axios.all([URL])
            .then(response => {
                let districtList;
                const districtMap = constructOptionList(response[0].data['districtList'] || [], "ndistrictcode",
                    "sdistrictname", undefined, undefined, false);

                districtList = districtMap.get("OptionList");
                let districtListTemp;
                const districtMapTemp = constructOptionList(response[0].data['districtList'] || [], "ndistrictcode",
                    "sdistrictname", undefined, undefined, false);

                districtListTemp = districtMapTemp.get("OptionList");

                const cityList = undefined;
                const cityListTemp = undefined;
                dispatch({
                    type: DEFAULT_RETURN, payload:
                    {
                        [methodParam.inputData.optionlistname]: districtList, [methodParam.inputData.optionlistname]: districtListTemp,
                        loading: false, data: undefined, dataState: undefined, cityList, cityListTemp
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

export function getCityComboServices(methodParam) {
    return function (dispatch) {
        let URL = [];
        URL = rsapi().post("/patient/getCity", { "userinfo": methodParam.inputData.userinfo, "ndistrictcode": methodParam.inputData.primarykey })
        dispatch(initRequest(true));
        Axios.all([URL])
            .then(response => {
                const cityMap = constructOptionList(response[0].data['cityList'] || [], "ncitycode",
                    "scityname", undefined, undefined, false);

                const cityList = cityMap.get("OptionList");
                const cityMapTemp = constructOptionList(response[0].data['cityList'] || [], "ncitycode",
                    "scityname", undefined, undefined, false);

                const cityListTemp = cityMapTemp.get("OptionList");
                dispatch({
                    type: DEFAULT_RETURN, payload:
                        { [methodParam.inputData.optionlistname]: cityList, [methodParam.inputData.optionlistname]: cityListTemp, loading: false, data: undefined, dataState: undefined }
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

export function filtercomboService(methodParam) {
    return function (dispatch) {
        let URL = [];
        let URL1 = [];
        if (methodParam.displayname === "onSubmit") {
            URL = rsapi().post("/patient/createFilterQuery", { ...methodParam.inputParam.inputData })
            URL1 = rsapi().post("/patient/filterByPatient", {
                "filterquery": methodParam.inputParam.inputData.patientfilter.filterquery
                , "userinfo": methodParam.inputParam.inputData.userinfo
            })
        } else if (methodParam.displayname === "ComboList") {
            URL = rsapi().post("/patient/getFilterQueryList", { "userinfo": methodParam.inputData.userinfo })

        }
        else {
            URL = rsapi().post("/patient/getFilterQuery", { "userinfo": methodParam.inputData.userinfo, "npatientfiltercode": methodParam.inputData.primarykey })
        }
        dispatch(initRequest(true));
        Axios.all([URL, URL1])
            .then(response => {
                let filterquery;
                let selectedRecord;
                let QueryName;
                let jsonTree;
                let openSolidAdvFilter;
                let openAlertModal;
                let openModal;
                let masterData = {};
                let slideResult;
                let patientFilerList;
                if (methodParam.displayname === "onSubmit") {
                    //selectedRecord =response[1].data.PatientList;   
                    masterData = {
                        ...methodParam.masterData,
                        ...response[1].data,
                    };
                    openSolidAdvFilter = false
                    openAlertModal = false
                    openModal = false
                    selectedRecord={};
                } else if (methodParam.displayname === "ComboList") {
                    const patcaseFiltertypeMap = constructOptionList(response[0].data.patientFilterType || [], "npatientfiltercode",
                        "spatientfiltername", undefined, undefined, false);
                    patientFilerList = patcaseFiltertypeMap.get("OptionList");
                    openSolidAdvFilter = true
                    openModal = true
                    selectedRecord = {};
                    masterData = {
                        ...methodParam.masterData,
                        ...response[0].data, patientFilerList: patientFilerList
                    };
                }
                else {
                    masterData = {
                        ...methodParam.masterData,
                    };
                    selectedRecord = {
                        ...methodParam.masterData.selectedRecord
                    }
                    filterquery = response[0].data.SelectedPatientFilterType.filterquery === null ? undefined : response[0].data.SelectedPatientFilterType.filterquery;
                  //  QueryName = response[0].data.SelectedPatientFilterType.spatientfiltername;
                    QueryName = response[0].data.SelectedPatientFilterType.spatientfiltername !=="Create New Query" ? response[0].data.SelectedPatientFilterType.spatientfiltername:undefined;
                    const emptyInitValue = { "id": uuid(), "type": "group" };
                    const queryFilter = JSON.parse((response[0].data.SelectedPatientFilterType.tree))
                    const initValue = queryFilter && Object.keys(queryFilter).length > 0 ? queryFilter : emptyInitValue;
                    jsonTree = checkTree(loadTree(initValue), methodParam.Patconfigs);
                    openSolidAdvFilter = true;
                    openModal = true;
                   
                }
                dispatch({
                    type: DEFAULT_RETURN, payload:
                    {
                        loading: false, data: undefined, masterData, dataState: undefined, tree: jsonTree, filterquery, QueryName,
                        openSolidAdvFilter, openAlertModal,selectedRecord , openModal, slideResult, patientFilerList,loadEsign:false
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
export function getFilterStatusCombo(methodParam) {
    return function (dispatch) {
        let URL = [];
        URL = rsapi().post("/patient/getFilterQueryList", { "userinfo": methodParam.inputData.userinfo, "nfilterstatus": methodParam.inputData.primarykey })
        dispatch(initRequest(true));
        Axios.all([URL])
            .then(response => {
                const patcaseFiltertypeMap = constructOptionList(response[0].data.patientFilterType || [], "npatientfiltercode",
                    "spatientfiltername", undefined, undefined, false);
                const patientFilerList = patcaseFiltertypeMap.get("OptionList");
                const openSolidAdvFilter = true
                const openModal = true
                const masterData = {
                    ...methodParam.masterData,
                    ...response[0].data, patientFilerList: patientFilerList
                };
                const filterquery = response[0].data.SelectedPatientFilterType.filterquery === null ? undefined : response[0].data.SelectedPatientFilterType.filterquery;
               // const QueryName = response[0].data.SelectedPatientFilterType.spatientfiltername;
                const   QueryName = response[0].data.SelectedPatientFilterType.spatientfiltername !=="Create New Query" ? response[0].data.SelectedPatientFilterType.spatientfiltername:undefined;
                const emptyInitValue = { "id": uuid(), "type": "group" };
                const queryFilter = JSON.parse((response[0].data.SelectedPatientFilterType.tree))
                const initValue = queryFilter && Object.keys(queryFilter).length > 0 ? queryFilter : emptyInitValue;
                const jsonTree = checkTree(loadTree(initValue), methodParam.Patconfigs);
                dispatch({
                    type: DEFAULT_RETURN, payload:
                    {
                        openSolidAdvFilter, openModal, tree: jsonTree, filterquery, QueryName,
                        loading: false, data: undefined, dataState: undefined, masterData,screenName:undefined,loadEsign:false
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
export function getPatientHistory(patient, userInfo, masterData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("patient/getPatientHistory", { spatientid: patient.spatientid, userinfo: userInfo })
            .then(response => {
                let patienthist=[];
                patienthist=response.data;
                masterData = { ...masterData, ...response.data };
                sortData(masterData);
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData, operation: null, modalName: undefined,patienthist,
                        loading: false,patientHistory:true ,openModal:true,loadEsign:false,openSolidAdvFilter:false,patientReportHistory:false
                    }
                });
            })
            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false} })
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

export function getpatientReportHistoryInfo(patient, userInfo, masterData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("patient/getPatientReportHistory", { spatientid: patient.spatientid, userinfo: userInfo })
            .then(response => {
                let patientReports=[];
                patientReports=response.data;
                masterData = { ...masterData, ...response.data };
                sortData(masterData);
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData, operation: null, modalName: undefined,patientReports,
                        loading: false,patientReportHistory:true ,openModal:true,loadEsign:false,openSolidAdvFilter:false,patientHistory:false
                    }
                });
            })
            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false} })
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


