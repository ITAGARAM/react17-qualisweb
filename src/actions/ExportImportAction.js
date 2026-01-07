import { toast } from 'react-toastify';
import rsapi from '../rsapi';
import { initRequest, updateStore } from './LoginAction';
import { DEFAULT_RETURN, REQUEST_FAILURE } from './LoginTypes';
import { sortData } from '../components/CommonScript';

export function mergeData(inputParam, masterData) {

  return function (dispatch) {
    dispatch(initRequest(true));
    rsapi().post(inputParam.classUrl + "/" + inputParam.operation + inputParam.methodUrl, { ...inputParam.inputData })
      .then(response => {
        if (response.data.credentials === "Success") {
          masterData = {
            ...masterData, ...response.data
          }
        } else {
          toast.info(response.data.rtn);
        }
        dispatch({
          type: DEFAULT_RETURN, payload: {
            loading: false,
            loadImportFileData: false,
            openModal: false,
            loadEsign: false,
            masterData
          }
        })

      })
      .catch(error => {
        dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
        if (error.response.status === 500) {
          toast.error(error.message);
        }
        else {
          toast.warn(error.response.data);
        }
      })
  }

}

export function getExportData(inputParam) {

  return function (dispatch) {
    dispatch(initRequest(true));
    let requestUrl = '';
    requestUrl = rsapi().post(inputParam.classUrl + "/" + inputParam.operation + inputParam.methodUrl, { ...inputParam.inputData });
    return requestUrl
      .then(response => {
        dispatch({
          type: DEFAULT_RETURN, payload: {
            resultStatus: response.data["ExportExcel"] || '',
            loading: false,

          }
        })
        if (response.data["ExportExcel"] === "Success") {
          document.getElementById("download_data").setAttribute("href", response.data["ExportExcelPath"]);
          document.getElementById("download_data").click();
        }
        else {
          toast.warn(response.data["ExportExcel"]);
        }
      })
      .catch(error => {
        dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
        if (error.response.status === 500) {
          toast.error(error.message);
        }
        else {
          toast.warn(error.response.data);
        }
      })
  }
}

export function insertData(inputParam, masterData) {
  return function (dispatch) {
    dispatch(initRequest(true));
    rsapi().post(inputParam.classUrl + "/" + inputParam.operation + inputParam.methodUrl, inputParam.formData)
      .then(response => {
        if (response.data.rtn === "Success") {
          masterData = {
            ...masterData, ...response.data

          }

        } else {
          toast.info(response.data.rtn);
          dispatch({
            type: DEFAULT_RETURN, payload: {
              loading: false,
              openModal: false,
              loadEsign: false,
            }
          })
        }
      })
      .catch(error => {
        dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
        if (error.response.status === 500) {
          toast.error(error.message);
        }
        else {
          toast.warn(error.response.data);
        }
      })
  }

}


export const mergeStatus = (inputParam) => {

  return function (dispatch) {
    dispatch(initRequest(true));
   
  rsapi().post(inputParam.classUrl + "/" + inputParam.operation + inputParam.methodUrl, { ...inputParam.inputData })
      .then(response => {
        if (response.data["Success"]) {
          toast.warn(response.data.Success);
        }
        let data = response.data;
        sortData(data);
        const updateInfo = {
          typeName: DEFAULT_RETURN,
          data: { masterData: [], organisation: undefined, }
        }
        dispatch(updateStore(updateInfo))
        dispatch({
          type: DEFAULT_RETURN,
          payload: {
            masterData: data,
            activeTestTab: data.activeTestTab,
            activeTestKey: data.activeTestKey,
            activeBCTab: data.activeBCTab,
            inputParam: inputParam,
            masterStatus: "",
            userInfo: inputParam.inputData.userinfo,
            loading: false, selectedId: null, selectedRecord: {},
            dataState: undefined,
            organisation: {
              selectedNode: data.SelectedNode, selectedNodeName: data.SelectedNodeName,
              primaryKeyValue: data.AddedChildPrimaryKey
            },
            displayName: inputParam.displayName,
            reportFilePath: undefined,
            skip: 0, take: undefined,
            testskip: 0,
            testtake: inputParam.inputData.settings ? inputParam.inputData.settings[12] : 10,
          }
        })
      })
      .catch(error => {
        if (error.response === undefined && error === "Network Error") {
          dispatch({
            type: REQUEST_FAILURE,
            payload: {
              error: "Network Error",
              loading: false,
            }
          });
        } else if (error.response.status === 417) {
          toast.warning(error.response.data);
          dispatch({ type: DEFAULT_RETURN, payload: { loading: false, displayName: inputParam.displayName, userInfo: inputParam.inputData.userinfo } });
        } else {
          dispatch({ type: DEFAULT_RETURN, payload: { loading: false, displayName: inputParam.displayName, userInfo: inputParam.inputData.userinfo } })
        }
      })

  };
};