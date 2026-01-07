 import { Lims_JSON_stringify, sortData } from '../components/CommonScript';
import rsapi from '../rsapi';
import { initRequest } from './LoginAction';
import {DEFAULT_RETURN, REQUEST_FAILURE, UN_AUTHORIZED_ACCESS} from './LoginTypes'; 
import { toast } from 'react-toastify';   
import { postCRUDOrganiseSearch } from './ServiceAction';
import { intl } from '../components/App';

export const validateEsignCredentialStorage = (inputParam, modalName,action) => {
    return (dispatch) => {
      //dispatch(initRequest(true));
      if (inputParam && inputParam.inputData && inputParam.inputData.userinfo) {
        inputParam.inputData["userinfo"] = {
          ...inputParam.inputData.userinfo,
          sformname: Lims_JSON_stringify(inputParam.inputData.userinfo.sformname),
          smodulename: Lims_JSON_stringify(inputParam.inputData.userinfo.smodulename),
        }
      }
      return rsapi().post("login/validateEsignCredential", inputParam.inputData)
        .then(response => {
          if (response.data.credentials === "Success") {
  
            const methodUrl = inputParam["screenData"]["inputParam"]["methodUrl"];
            inputParam["screenData"]["inputParam"]["inputData"]["userinfo"] = inputParam.inputData.userinfo;
  
            if (inputParam["screenData"]["inputParam"]["inputData"][methodUrl.toLowerCase()]) {
  
              delete inputParam["screenData"]["inputParam"]["inputData"][methodUrl.toLowerCase()]["esignreason"];
  
              if (inputParam["screenData"]["inputParam"]["inputData"][methodUrl.toLowerCase()]) {
                delete inputParam["screenData"]["inputParam"]["inputData"][methodUrl.toLowerCase()]["esignpassword"];
                delete inputParam["screenData"]["inputParam"]["inputData"][methodUrl.toLowerCase()]["esigncomments"];
                delete inputParam["screenData"]["inputParam"]["inputData"][methodUrl.toLowerCase()]["agree"];
  
  
              }
  
              // ALPD-2437 added for Type3 Component. Use selected record to clear esign values
              if (inputParam["screenData"]["inputParam"]["selectedRecord"]) {
  
                delete inputParam["screenData"]["inputParam"]["selectedRecord"]["esignreason"];
                delete inputParam["screenData"]["inputParam"]["selectedRecord"]["esignpassword"];
                delete inputParam["screenData"]["inputParam"]["selectedRecord"]["esigncomments"];
                delete inputParam["screenData"]["inputParam"]["selectedRecord"]["agree"];
              }
            }
            dispatch(crudMasterstorage(inputParam["screenData"]["inputParam"], inputParam["screenData"]["masterData"], modalName,undefined,action))  
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
        } else if (error.response.status === 500) {
            toast.error(intl.formatMessage({ id: error.message }));
          } else {
            if(error.response.data==='IDS_SOURCEANDDESTINATIONMISMATCH'){
                action()
            }else{
                toast.warn(intl.formatMessage({ id: error.response.data }));
            } 
          }
        })
    };
  }


  export function crudMasterstorage(inputParam, masterData, modalName, defaultInput,action) {

    return function (dispatch) {
      dispatch(initRequest(true));
      let requestUrl = '';
      if (inputParam.isFileupload) {
        const formData = inputParam.formData;
        formData.append("userinfo", JSON.stringify(inputParam.inputData.userinfo));
        requestUrl = rsapi().post(inputParam.classUrl + "/" + inputParam.operation + inputParam.methodUrl, formData);
      } else {
        requestUrl = rsapi().post(inputParam.classUrl + "/" + inputParam.operation + inputParam.methodUrl, { ...inputParam.inputData });
      }
      return requestUrl
        .then(response => {
          if (response.status === 202) {
            //HttpStatus:Accepted
            //Use this block when u need to display any success message
            let selectedRecordObj = {}
            if (inputParam.selectedRecord) {
              selectedRecordObj = { selectedRecord: inputParam.selectedRecord }
            }
  
            dispatch({
              type: DEFAULT_RETURN, payload: {
                loadEsign: false,
                [modalName]: false,
                loading: false,
                ...selectedRecordObj
              }
            })
            toast.success(response.data);
          }
          else if (response.status === 208) {
            //HttpStatus:Accepted
            //208-Already Reported
            let selectedRecordObj = {}
            if (inputParam.selectedRecord) {
              selectedRecordObj = { selectedRecord: inputParam.selectedRecord }
            }
            dispatch({
              type: DEFAULT_RETURN, payload: {
                loadEsign: false,
                [modalName]: false,
                loading: false,
                ...selectedRecordObj
  
              }
            })
            toast.warn(response.data);
          }
          else {
            const retrievedData = sortData(response.data);
            if (masterData === undefined || Array.isArray(retrievedData)) {
              masterData = retrievedData;
            }
            else {
              masterData = {
                ...masterData,
                ...retrievedData
              };
              if (modalName === "openModal" && inputParam.operation !== "delete" && inputParam.operation !== "prepare"
                && inputParam.operation !== "create" && inputParam.operation !== "copy") {
  
                if (inputParam.postParam) {
                  if (masterData[inputParam.postParam.selectedObject][inputParam.postParam.primaryKeyField]) {
                    const foundIndex = masterData[inputParam.postParam.inputListName].findIndex(
                      x => x[inputParam.postParam.primaryKeyField] === masterData[inputParam.postParam.selectedObject][inputParam.postParam.primaryKeyField]
                    );
                    masterData[inputParam.postParam.inputListName][foundIndex] = masterData[inputParam.postParam.selectedObject];
                  } else {
                    const foundIndex = masterData[inputParam.postParam.inputListName].findIndex(
                      x => x[inputParam.postParam.primaryKeyField] === masterData[inputParam.postParam.selectedObject][0][inputParam.postParam.primaryKeyField]
                    );
                    masterData[inputParam.postParam.inputListName][foundIndex] = masterData[inputParam.postParam.selectedObject][0];
                  }
                }
              }
              else if (modalName === "openModal" && inputParam.operation === "create") {
                if (inputParam.postParam && inputParam.postParam.isSingleGet) {
                  masterData[inputParam.postParam.inputListName].push(response.data[inputParam.postParam.selectedObject]);
                  //masterData[inputParam.postParam.selectedObject] = response.data;
                  sortData(masterData);
                }
              }
              else if (modalName === "openChildModal" && inputParam.operation === "create") {//searchedData
                if (inputParam.postParam && inputParam.postParam.isSingleGet) {
                  const foundIndex = masterData[inputParam.postParam.inputListName].findIndex(
                    x => x[inputParam.postParam.primaryKeyField] === masterData[inputParam.postParam.selectedObject][inputParam.postParam.primaryKeyField]
                  );
                  masterData[inputParam.postParam.inputListName][foundIndex] = masterData[inputParam.postParam.selectedObject];
  
                  if (masterData["searchedData"] !== undefined) {
                    const foundIndex = masterData["searchedData"].findIndex(
                      x => x[inputParam.postParam.primaryKeyField] === masterData[inputParam.postParam.selectedObject][inputParam.postParam.primaryKeyField]
                    );
                    masterData["searchedData"][foundIndex] = masterData[inputParam.postParam.selectedObject];
  
                  }
                  sortData(masterData);
                }
              }
              else if (modalName === "openModal" && inputParam.operation === "copy") {
                if (inputParam.postParam && inputParam.postParam.isSingleGet) {
                  masterData[inputParam.postParam.inputListName].push(response.data[inputParam.postParam.selectedObject]);
                  masterData = { ...masterData, ...response.data };
                  sortData(masterData);
                }
              }
              else if (modalName === "openModal" && (inputParam.operation === "delete" || inputParam.operation === "prepare")) {
                if (inputParam.postParam && inputParam.postParam.isSingleGet) {
                  if (inputParam.postParam.task === "cancel") {
                    const foundIndex = masterData[inputParam.postParam.inputListName].findIndex(
                      x => x[inputParam.postParam.primaryKeyField] === masterData[inputParam.postParam.selectedObject][inputParam.postParam.primaryKeyField]
                    );
                    masterData[inputParam.postParam.inputListName][foundIndex] = masterData[inputParam.postParam.selectedObject];
                  }
                  else {
                    const list = masterData[inputParam.postParam.inputListName]
                      .filter(item => item[inputParam.postParam.primaryKeyField] !== inputParam.postParam.primaryKeyValue)
                    masterData[inputParam.postParam.inputListName] = list;
  
                    // const foundIndex = masterData[inputParam.postParam.inputListName].findIndex(
                    //   x => x[inputParam.postParam.primaryKeyField] === inputParam.postParam.primaryKeyField
                    // );
                    // masterData[inputParam.postParam.inputListName].splice(foundIndex, 1)         
  
                  }
                  masterData = { ...masterData, ...response.data };
                  sortData(masterData);
                }
              }
            }
            // (masterData);
  
            let openModal = false;
            // let openChildModal= false;
  
            let selectedRecord = {};
            let activeSampleTab = inputParam.activeSampleTab ? { activeSampleTab: inputParam.activeSampleTab } : ''
            let activeTestKey = inputParam.activeTestKey ? { activeTestKey: inputParam.activeTestKey } : ''
            let showSample = inputParam.showSample ? inputParam.showSample : ''
            let respObject = {
              masterData,
              inputParam,
              modalName,
              //   openChildModal,
              //modalName:undefined,
              [modalName]: openModal,
              operation: inputParam.operation,
              masterStatus: "",
              errorCode: undefined,
              loadEsign: false,
              showEsign: false,
              selectedRecord,
              loading: false,
              dataState: inputParam.dataState,
              selectedId: inputParam.selectedId,
              ...activeSampleTab,
              ...activeTestKey,
              showSample,
              design: [],
  
              //organisation: undefined
              organisation: inputParam.nextNode ? {
                selectedNode: inputParam.nextNode,
                selectedNodeName: masterData.SelectedNodeName,
                primaryKeyValue: masterData.AddedChildPrimaryKey,
  
              } : undefined,
              showConfirmAlert: inputParam.showConfirmAlert,
              loadPoolSource: inputParam.loadPoolSource,
              skip: inputParam.skip || undefined,
              take: inputParam.take || undefined,
              openPortal: false,
              importRetrieveOrDispose:false,
              isRetrieveOrDispose:false
            }
  
            if (inputParam.operation === "create" || inputParam.operation === "copy") {
              if (inputParam.saveType === 2) {
                openModal = true;
                selectedRecord = defaultInput;
  
              }
              respObject = { ...respObject, [modalName]: openModal, selectedRecord };
            }
            if ((modalName === "openModal" || modalName === "openChildModal") && Object.keys(masterData).indexOf("searchedData") !== -1
              && masterData["searchedData"] !== undefined) {
              dispatch(postCRUDOrganiseSearch(inputParam.postParam, respObject))
            }
            else {
              dispatch({ type: DEFAULT_RETURN, payload: { ...respObject, modalName: undefined } })
            }
          }
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
                loading: false,
                // openPortal:this.props.Login.openPortal,
                //openModal:inputParam.openPortal?false:true
              }
            });
          } else { 
            dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
            if(error.response.data==='IDS_SOURCEANDDESTINATIONMISMATCH'){
                action()
            }else{
                toast.warn( intl.formatMessage({ id: error.response.data }));
            } 
  
          }
        });
    }
  }