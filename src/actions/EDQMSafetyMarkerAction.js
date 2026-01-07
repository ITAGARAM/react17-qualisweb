import rsapi from '../rsapi';
import { DEFAULT_RETURN, UN_AUTHORIZED_ACCESS } from './LoginTypes';
import Axios from 'axios';
import { toast } from 'react-toastify';
import {constructOptionList} from '../components/CommonScript';
import { initRequest } from './LoginAction';
import { intl } from '../components/App';



//export function fetchRecordSafetyMarker (screenName, primaryKeyName, primaryKeyValue, operation, inputParam, userInfo, ncontrolCode, masterData){
export function fetchRecordSafetyMarker(fetchRecordParam) {
    return function (dispatch) {

        const testCategory = rsapi().post("testcategory/getTestCategory", { "userinfo": fetchRecordParam.userInfo });

        let urlArray = [];
        let nTestCategoryCode = 0;
        let selectedId = null;
        if (fetchRecordParam.operation === "update") {

            fetchRecordParam.data.map(item => {
                if (item.nsafetymarkercode === parseInt(fetchRecordParam.primaryKeyValue)) {
                    return nTestCategoryCode = item.ntestcategorycode;
                }
                return nTestCategoryCode;
            })
            const safetyMarker = rsapi().post(fetchRecordParam.inputParam.classUrl + "/getActiveSafetyMarkerById", { [fetchRecordParam.primaryKeyField]: fetchRecordParam.primaryKeyValue, "userinfo": fetchRecordParam.userInfo });
            const testMasterData = rsapi().post("testmaster/getTestMasterBasedOnTestCategory", { "userinfo": fetchRecordParam.userInfo, "ntestcategorycode": parseInt(nTestCategoryCode) });

            urlArray = [testCategory, testMasterData, safetyMarker];
            selectedId = fetchRecordParam.primaryKeyValue;
        }
        else {
            urlArray = [testCategory];
        }
        dispatch(initRequest(true));
        Axios.all(urlArray)
            .then(Axios.spread((...response) => {

                let selectedRecord = {};
                let ntestcategorycode = [];
                let ntestcode = [];
                // const testmasterMap = [];
                let testmasterList = [];

                const testCategoryMap = constructOptionList(response[0].data || [], "ntestcategorycode",
                    "stestcategoryname", undefined, undefined, true);

                const testCategoryList = testCategoryMap.get("OptionList");

                if (fetchRecordParam.operation === "update") {

                    selectedRecord = response[2].data;
                    selectedRecord["ntestcategorycode"] = {
                        label: response[2].data["stestcategoryname"],
                        value: response[2].data["ntestcategorycode"]
                    };
                    selectedRecord["ntestcode"] = {
                        label: response[2].data["stestname"],
                        value: response[2].data["ntestcode"]
                    };

                    const testmasterMap = constructOptionList(response[1].data || [], "ntestcode",
                        "stestname", undefined, undefined, true);

                    testmasterList = testmasterMap.get("OptionList");
                    // ntestcategorycode.push({
                    //     label: response[2].data["stestcategoryname"],
                    //     value: response[2].data["ntestcategorycode"]
                    // });

                    // ntestcode.push({
                    //     label: response[2].data["stestname"],
                    //     value: response[2].data["ntestcode"]
                    // });
                }

                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        testCategory: testCategoryList, testMaster: fetchRecordParam.operation === "update" ? testmasterList : [],
                        ntestcategorycode: ntestcategorycode, ntestcode: ntestcode,
                        selectedRecord: fetchRecordParam.operation === "update" ? selectedRecord : undefined, operation: fetchRecordParam.operation,
                        screenName: "IDS_EDQMSAFETYMARKER",
                        openModal: true, ncontrolCode: fetchRecordParam.ncontrolCode,
                        loading: false, selectedId
                    }
                });
            }))

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
}

export function getTestMasterDataService(nTestCategoryCode, selectedRecord, userInfo) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("testmaster/getTestMasterBasedOnTestCategory", { "userinfo": userInfo, "ntestcategorycode": parseInt(nTestCategoryCode) })
            .then(response => {

                let ntestcode = [];

               const testmasterMap = constructOptionList(response.data || [], "ntestcode",
                "stestname", undefined, undefined, true);

                const testmasterList = testmasterMap.get("OptionList");

                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        testMaster: testmasterList, ntestcode: ntestcode, selectedRecord, loading: false
                    }
                });
             //   console.log("Checking Here : ", response.data);
            }).catch(error => {
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
                } else {
                    dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                }
                //console.log('error: ', error);
            })
    }
}