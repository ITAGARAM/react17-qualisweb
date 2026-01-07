import rsapi from '../rsapi';
import { DEFAULT_RETURN, UN_AUTHORIZED_ACCESS } from './LoginTypes';
import { sortData } from '../components/CommonScript'
import { toast } from 'react-toastify';
import { initRequest } from './LoginAction';
import {constructOptionList} from "../components/CommonScript";
import { intl } from '../components/App';

export function getPackageTestMappingDetails(testPackage, userInfo, masterData) {
  return function (dispatch) {
    dispatch(initRequest(true));
    return rsapi().post("packagetestmapping/getPackageTestMapping", {
      ntestpackagecode: testPackage.ntestpackagecode,
      userinfo: userInfo
    })
      .then(response => {
        masterData = { ...masterData, ...response.data };
        sortData(masterData);
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


export function getTestCategory(inputParam, masterData) {
  return function (dispatch) {

    dispatch(initRequest(true));

    return rsapi().post("packagetestmapping/getTestCategory", {
      "ntestpackagecode": masterData.SelectedTestPackage["ntestpackagecode"],
      userinfo: inputParam.userInfo
    })
      .then(response => {
        let selectedRecord={};
        const testCategoryMap = constructOptionList(response.data && response.data.TestCategory || [], "ntestcategorycode",
          "stestcategoryname", undefined, undefined, true);

        const testCategory = testCategoryMap.get("OptionList");

        selectedRecord['ntestcategorycode'] = testCategoryMap.get("DefaultValue") ? testCategoryMap.get("DefaultValue") : "";

        dispatch({
          type: DEFAULT_RETURN, payload: {
            operation: "create",
            openChildModal: true,
            screenName: inputParam.screenName,
            loading: false,
            selectedRecord:selectedRecord,
            testMaster: response.data && response.data.TestPackageTest && response.data.TestPackageTest.length>0 ?response.data.TestPackageTest : [],
            testCategory:testCategory
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


export function getTestPackageTest(inputParam) {
  return function (dispatch) {

    dispatch(initRequest(true));

    return rsapi().post("packagetestmapping/getTestPackageTest", {
      ...inputParam.inputData
    })
      .then(response => {    
     
      
        dispatch({
          type: DEFAULT_RETURN, payload: {
            loading: false,
            selectedRecord:{...inputParam.selectedRecord},
            testMaster:response.data && response.data.TestPackageTest,
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