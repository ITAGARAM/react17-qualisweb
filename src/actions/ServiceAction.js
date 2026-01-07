import { toast } from 'react-toastify';
import rsapi from '../rsapi';
import { initRequest, updateStore } from './LoginAction';
import { DEFAULT_RETURN, REQUEST_FAILURE, UN_AUTHORIZED_ACCESS } from './LoginTypes';
import { sortData, searchData, searchJsonData, replaceUpdatedObject, constructOptionList, rearrangeDateFormat, Lims_JSON_stringify } from '../components/CommonScript';
import { intl } from '../components/App';
import { selectedDashBoardView } from './DashBoardTypeAction';
import Axios from "axios";
import { REPORTTYPE, designComponents, transactionStatus } from '../components/Enumeration';
import ConfirmMessage from '../components/confirm-alert/confirm-message.component';
import { viewReportDetailWithParametersReports } from './ReportDesignerAction';

// import { getValidComponent } from '../components/droparea/helpers';
//import { Engine } from 'json-rules-engine';
//import employee from '../rules/Employee-Salary.json';

export const callService = (inputParam) => {
  return (dispatch) => {
    dispatch(initRequest(true));
    if ((inputParam.layoutCall && inputParam.layoutCall == true) || ((inputParam.sidebarCall && inputParam.sidebarCall == true))) { 
    const updateInfo = {
      typeName: DEFAULT_RETURN,
      data: { masterData: [] }
    }
    dispatch(updateStore(updateInfo));
  }
    return rsapi().post(inputParam.classUrl + "/get" + inputParam.methodUrl, inputParam.inputData)
      .then(response => {

        // console.log("res:", response);

        ///Start of Rule Engine code///////////////////////

        // const decisions1 = [
        //   {
        //       "conditions": {
        //           "all": [
        //               {
        //                   "fact": "Designation",
        //                   "operator": "equal",
        //                   "value": "Manager"
        //               },
        //               {
        //                   "fact": "Experience",
        //                   "operator": "greaterThan",
        //                   "value": 10
        //               }
        //           ]
        //       },
        //       "event": {
        //           "type": "RS.1500000",
        //           "params": {message: 'Your Salary is 1500000/annum!'}
        //       }
        //   }
        // ];
        // console.log("decisions:",decisions1);  
        // const inputs1 = {Designation: 'Manager', Experience: 9 };

        // const engine = new Engine(employee.decisions);   

        // engine.run(inputs1)
        // .then(results => {       
        //   console.log("Rule output:", results.events);
        //   if ( results.events.length > 0){
        //     const events = results.events;
        //     events.map(event => console.log("Message:",event.params.message)); 


        //     rsapi().post("section/getSection" , inputParam.inputData)
        //     .then(response => {
        //       console.log("data:", response);
        //       let data = response.data;
        //       sortData(data);

        //       const updateInfo = {
        //         typeName: DEFAULT_RETURN,
        //         data: { masterData: [], organisation: undefined, }
        //       }
        //       dispatch(updateStore(updateInfo))

        //       dispatch({
        //         type: DEFAULT_RETURN,
        //         payload: {
        //           masterData: data,
        //           activeTestTab: data.activeTestTab,
        //           activeTestKey: data.activeTestKey,
        //           activeBCTab: data.activeBCTab,
        //           inputParam: inputParam,
        //           masterStatus: "",
        //           userInfo: inputParam.inputData.userinfo,
        //           loading: false, selectedId: null, selectedRecord: {},
        //           dataState: undefined,
        //           organisation: {
        //             selectedNode: data.SelectedNode, selectedNodeName: data.SelectedNodeName,
        //             primaryKeyValue: data.AddedChildPrimaryKey
        //           },
        //           displayName: inputParam.displayName,
        //           reportFilePath: undefined
        //         }
        //       })

        //     })
        //     .catch(error => {
        //       if (error.response === undefined && error === "Network Error") {
        //         dispatch({
        //           type: REQUEST_FAILURE,
        //           payload: {
        //             error: "Network Error",
        //             loading: false,
        //           }
        //         });
        //       } else if (error.response.status === 417) {
        //         toast.warning(error.response.data);
        //         dispatch({ type: DEFAULT_RETURN, payload: { loading: false, displayName: inputParam.displayName, userInfo: inputParam.inputData.userinfo } });
        //       } else {
        //         dispatch({ type: DEFAULT_RETURN, payload: { loading: false, displayName: inputParam.displayName, userInfo: inputParam.inputData.userinfo } })
        //       }
        //     })
        //   }
        //   else{
        //     console.log("Message:","Rules Failed");
        //     dispatch({ type: DEFAULT_RETURN, payload: { loading: false, displayName: inputParam.displayName, userInfo: inputParam.inputData.userinfo } });
        //   }         
        // })
        ///End of Rule Engine code///////////////////////

        ////uncomment below for Orginial Source start////////////////////

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

        if (response.data.rtn == "IDS_USERNOTINRESULTENTRYFLOW") {
          toast.warning(intl.formatMessage({ id: "IDS_USERNOTINRESULTENTRYFLOW" }));
        }

        dispatch({
          type: DEFAULT_RETURN,
          payload: {
            openExcelModal: false,
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
            //testtake: 5,
            testtake: inputParam.inputData.settings ? inputParam.inputData.settings[12] : 10,
            //  key:inputParam.key!==undefined?inputParam.key:""
          }
        })

        ///Uncomment till above for original source
      })
      .catch(error => {
        //console.log("error:", error);
        if (error.response === undefined && error === "Network Error") {
          dispatch({
            type: REQUEST_FAILURE,
            payload: {
              error: "Network Error",
              loading: false,
            }
          });
        } else if (error.response !== undefined && error.response.status === 417) {
          toast.warning(error.response.data);
          dispatch({ type: DEFAULT_RETURN, payload: { loading: false, displayName: inputParam.displayName, userInfo: inputParam.inputData.userinfo } });
        } else if (error.response?.status === 429) {
                    toast.warn(intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
                    dispatch({ type: DEFAULT_RETURN, payload: { loading: false } });
                } else if (error.response?.status === 401 || error.response?.status === 403) {
          let payloadData = {
            navigation: 'forbiddenaccess',
            loading: false,
            responseStatus: error.response.status
          }
          if(inputParam.history){
            if (inputParam.history) {
              inputParam.history.push('/home');
              payloadData['displayName'] = intl.formatMessage({id:"IDS_HOME"});
            }
            if(inputParam.getDetailHome){
              inputParam.getDetailHome({shomename: "home",sdisplayname:intl.formatMessage({id:"IDS_HOME"})})
            }
          }
          dispatch({
            type: UN_AUTHORIZED_ACCESS,
            payload: payloadData
          });
        } else {
          dispatch({ type: DEFAULT_RETURN, payload: { loading: false, displayName: inputParam.displayName, userInfo: inputParam.inputData.userinfo } })
        }
      })

  };
};

//Start- Add /Edit/Delete Master Data //INVOICE MODULE - 24-SEP-2025
export function crudMaster(inputParam, masterData, modalName, defaultInput,ConfirmMessage,clearSelectedRecordField) {

  return function (dispatch) {
    dispatch(initRequest(true));
    let requestUrl = '';
    if (inputParam.isFileupload && inputParam.isFileupload!=='undefined') {
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
            //ATE234 Janakumar ALPD-5589,ALPD-5436 Test approval---> When using the save filter button, 500 occurs in Specific scenario Release & Report -> Edit Report Template Slide out issues.
            //isFilterDetail is mainly use in the transaction save filter in all screen.
              isFilterDetail:false,
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
            if (!response.data.flag) {
            masterData = {
            ...masterData,
            ...retrievedData
          }
        }else{
            masterData = {
              ...masterData
            }
          }

            // added by sujatha ATE_274 completed and Scheduled for swsm-78 as of now
            if (modalName === "openModal" && inputParam.operation !== "delete" && inputParam.operation !== "prepare"
              && inputParam.operation !== "create" && inputParam.operation !== "copy" && inputParam.operation!=="completed" && inputParam.operation!=="scheduled") {

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
                response.data.
                masterData = { ...masterData, ...response.data };
                sortData(masterData);
              }
            }
          }
          // (masterData);

          //let openModal = false;
          let openModal = masterData.flag && masterData.flag==='true'  ? true :false;
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
            //ATE234 Janakumar ALPD-5589,ALPD-5436 Test approval---> When using the save filter button, 500 occurs in Specific scenario Release & Report -> Edit Report Template Slide out issues.
            //isFilterDetail is mainly use in the transaction save filter in all screen.
            isFilterDetail:false,
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
          }

          if (inputParam.operation === "create" || inputParam.operation === "copy") {
            if (inputParam.saveType === 2) {
              openModal = true;
              //ALPD-5063 added by Dhanushya RI,Enable save and continue option in Type3 component based screen
              Object.keys(inputParam.selectedRecord).map(item=>{
                clearSelectedRecordField&&clearSelectedRecordField.map(data=>{
                    if(data.controlType === "checkbox" ? (item===data.controlName || item===data.dataField): item===data.dataField){
                      selectedRecord= inputParam.selectedRecord;
                      selectedRecord[item]=data.preSetValue ? data.preSetValue:"";
                    } 
                    //Added by sonia on 04th Mar 2025 for  jira id:ALPD-5504
                    else {
                        selectedRecord= inputParam.selectedRecord;
                    }            
                })
              })
             // selectedRecord = defaultInput;
              
            }
            respObject = { ...respObject, [modalName]: openModal, selectedRecord };
          }
          if ((modalName === "openModal" || modalName === "openChildModal") && Object.keys(masterData).indexOf("searchedData") !== -1
            && masterData["searchedData"] !== undefined) {
            dispatch(postCRUDOrganiseSearch(inputParam.postParam, respObject))
          }
          else {
            //ALPD-5540--Added by vignesh R(07-03-2025)--Supplier-->When click the logout button, blank page occurs in specific scenario
            if (inputParam.saveType === 2) {
              dispatch({ type: DEFAULT_RETURN, payload: { ...respObject, [modalName]: openModal } })

            }
            else{
            dispatch({ type: DEFAULT_RETURN, payload: { ...respObject, [modalName]: undefined } })
            
            }
          }
        }
      })
      .catch(response => {
        // console.log("error:", response);
        if (response.response?.status === 429) {
          toast.warn(intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
          dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
        } else if (response.response.status === 401 || response.response.status === 403) {
          dispatch({
            type: UN_AUTHORIZED_ACCESS,
            payload: {
              navigation: 'forbiddenaccess',
              loading: false,
              responseStatus: response.response.status
            }
          });
        } else if (response.response.status === 500) {
          dispatch({
            type: REQUEST_FAILURE,
            payload: {
              error: response.message,
              loading: false,
              // openPortal:this.props.Login.openPortal,
              //openModal:inputParam.openPortal?false:true
            }
          });
        } 
        else if (response.response.status === 409 && response.response.data.flag) {
          dispatch({
            type: REQUEST_FAILURE,
            payload: {
              loading: false,
            }
          });
          let inputData={...inputParam.inputData,DeleteExistingRecord:true}
          ConfirmMessage.confirm(
            "deleteMessage",
            intl.formatMessage({ id: "IDS_INFOMATION" }),
            intl.formatMessage({ id: "IDS_REMOVEEXISTINGCONFIGUARTION" }),
            intl.formatMessage({ id: "IDS_OK" }),
            intl.formatMessage({ id: "IDS_CANCEL" }),
            () =>
            dispatch(crudMaster(inputParam={...inputParam,inputData}, masterData, modalName, defaultInput,ConfirmMessage))
          );
      }
        else {

          let obj = {}
          if (inputParam.openPortal === true) {
            obj = { openModal: false }
          }
          let selectedRecordObj = {}
          if (inputParam.selectedRecord) {
            selectedRecordObj = { selectedRecord: inputParam.selectedRecord }
          }

          if (inputParam.operation === "delete" || inputParam.operation === "prepare" || inputParam.operation === "receive" ||
            inputParam.operation === 'approve' || inputParam.operation === 'Approve' || inputParam.operation === "correction"
            || inputParam.operation === "complete" || inputParam.operation === "dynamic" 
            || inputParam.operation === "setDefault" || inputParam.operation === "reset" || inputParam.operation === "retire"
            || inputParam.operation === "xml" || inputParam.operation === 'blackList' || inputParam.operation === 'attendance'
            || inputParam.operation === 'certified' || inputParam.operation === 'competent' || inputParam.operation === "invite"
            || inputParam.operation === "cancel" || inputParam.operation === "cancel" || inputParam.operation === "conduct"
            || inputParam.operation === "attend" || inputParam.operation === "certify" || inputParam.operation === "Competent"
            || inputParam.operation === "Create" || inputParam.operation === "check") {
            dispatch({
              type: DEFAULT_RETURN,
              payload: {
                masterStatus: response.response.data,
                errorCode: response.response.status,
                loadEsign: false,
                [modalName]: false,
                loading: false,
                openPortal: false,
                ...selectedRecordObj
              }
            });
          } else {
            // console.log('dispatch',obj)
            if (inputParam.selectedRecord) {
              selectedRecordObj = { selectedRecord: inputParam.selectedRecord }
            }
            dispatch({
              type: DEFAULT_RETURN,
              payload: {
                masterStatus: response.response.data,
                errorCode: response.response.status,
                loadEsign: false, loading: false,
                ...obj,
                ...selectedRecordObj

          
              }
            });
          }

        }
      });
  }
}
//INVOICE MODULE - 24-SEP-2025
export const validateEsignCredential = (inputParam, modalName,confirmMessage) => {
  return (dispatch) => {
    dispatch(initRequest(true));
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
          //dispatch(crudMaster(inputParam["screenData"]["inputParam"], inputParam["screenData"]["masterData"], modalName,'',confirmMessage))

          if(inputParam["screenData"]["inputParam"]["operation"]&&inputParam["screenData"]["inputParam"]["operation"] === "sync"){
          dispatch(syncAction(inputParam["screenData"]["inputParam"]))

          }else{
            //dispatch(crudMaster(inputParam["screenData"]["inputParam"], inputParam["screenData"]["masterData"], modalName))
            //ALPD-5444 Test Group - Copy the spec in test group and do save continue loading issue occurs.
            dispatch(crudMaster(inputParam["screenData"]["inputParam"], inputParam["screenData"]["masterData"], modalName,'',confirmMessage,inputParam["screenData"]["clearSelectedRecordField"]))

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
        } else if (error.response.status === 500) {
          toast.error(intl.formatMessage({ id: error.message }));
        } else {
          toast.warn(intl.formatMessage({ id: error.response.data }));
        }
      })
  };
};

export const fetchRecord = (fetchRecordParam) => {
  return (dispatch) => {

    dispatch(initRequest(true));
    const url = fetchRecordParam.inputParam.classUrl + "/getActive" + fetchRecordParam.inputParam.methodUrl + "ById";
    rsapi().post(url, {
      [fetchRecordParam.primaryKeyField]: fetchRecordParam.primaryKeyValue, "userinfo": fetchRecordParam.userInfo
    })
      .then(response => {
        dispatch({
          type: DEFAULT_RETURN,
          payload: {
            selectedRecord: response.data,
            screenName: fetchRecordParam.screenName,
            operation: fetchRecordParam.operation,
            openModal: true,
            ncontrolCode: fetchRecordParam.ncontrolCode,
            loading: false,
            selectedId: fetchRecordParam.primaryKeyValue
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
          toast.error(intl.formatMessage({ id: error.message }));
        } else {
          toast.warn(intl.formatMessage({ id: error.response.data }));
        }
      })
  }
}

export function filterColumnData(filterValue, filterParam,filterOperator) {
  return function (dispatch) {

    let masterData = filterParam.masterData;

    let primaryKeyValue = 0;
    let searchedData = undefined;
    if (filterValue === "") {
      if (masterData[filterParam.inputListName] && masterData[filterParam.inputListName].length > 0) {
        // if(filterParam.isjsondata)
        // {
        //    primaryKeyValue = masterData[filterParam.inputListName][0]["jsondata"][filterParam.primaryKeyField]

        //  }
        //else
        // {
        primaryKeyValue = masterData[filterParam.inputListName][0][filterParam.primaryKeyField];
        // }
      }
    }
    else {
      if (filterParam.isjsondata) {
        searchedData = searchJsonData(filterValue, masterData[filterParam.inputListName], filterParam.searchFieldList || [],filterOperator);
      }
      else {
        searchedData = searchData(filterValue, masterData[filterParam.inputListName], filterParam.searchFieldList || [],filterOperator);

      }
      if (searchedData.length > 0) {
        //  if(filterParam.isjsondata)
        // {
        //  primaryKeyValue = searchedData[0]["jsondata"][filterParam.primaryKeyField];
        //  }
        // else{
        primaryKeyValue = searchedData[0][filterParam.primaryKeyField];
        //  }
      }
    }

    if (primaryKeyValue !== 0) {
      dispatch(initRequest(true));
      return rsapi().post(filterParam.fetchUrl, { ...filterParam.fecthInputObject, [filterParam.primaryKeyField]: primaryKeyValue })
        .then(response => {
          masterData["searchedData"] = searchedData;
          masterData = { ...masterData, ...response.data };

          if (filterParam.inputListName === "DashBoardView") {
            dispatch(selectedDashBoardView(response, masterData));
          }
          else {
            if (filterParam.sortField) {
              sortData(masterData, filterParam.sortOrder, filterParam.sortField);
            }
            else {
              sortData(masterData);
            }
            dispatch({ type: DEFAULT_RETURN, payload: { masterData, loading: false, skip: 0, take: 10, selectedId: null } });
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
          }
          else {
            toast.warn(intl.formatMessage({ id: error.response.data }));
          }
        })
    }
    else {
      masterData[filterParam.selectedObject] = undefined;
      masterData["searchedData"] = [];
      Object.keys(masterData).forEach(item => {
        if (item !== filterParam.inputListName && item !== filterParam.selectedObject
          && filterParam.unchangeList && filterParam.unchangeList.indexOf(item) === -1)
          masterData[item] = [];
      })
      dispatch({
        type: DEFAULT_RETURN, payload: {
          masterData, operation: null, modalName: undefined,
          loading: false
        }
      });
    }
  }
}

export function postCRUDOrganiseSearch(postParam, respObject) {
  return function (dispatch) {

    let masterData = respObject.masterData;

    if (respObject.inputParam.operation === "create" || respObject.inputParam.operation === "copy") {
      if (respObject.modalName === "openModal") {
        if (respObject.inputParam.isChild === undefined) {
          // ALPD-5605 Added by Abdul to handle front end collapse when current becomes null when unmounted
          if(respObject.inputParam.searchRef.current && respObject.inputParam.searchRef.current.value )
          // ALPD-5605 End 
            respObject.inputParam.searchRef.current.value = "";
          masterData["searchedData"] = undefined;
        }
      }
      dispatch({ type: DEFAULT_RETURN, payload: { ...respObject, masterData, modalName: undefined } })
    }
    else if (respObject.inputParam.operation === "delete" || respObject.inputParam.operation === "prepare") {

      if (masterData["searchedData"] !== undefined && respObject.modalName === "openModal") {
        let temp = masterData["searchedData"];
        let primaryKeyValue = respObject.masterData["searchedData"][0][postParam.primaryKeyField];
        if (respObject.inputParam.isChild === undefined) {

          temp = masterData["searchedData"].filter(item => Array.isArray(postParam.primaryKeyValue) ?
            !postParam.primaryKeyValue.includes(item[postParam.primaryKeyField])
            : item[postParam.primaryKeyField] !== postParam.primaryKeyValue);
          primaryKeyValue = temp.length > 0 ? temp[0][postParam.primaryKeyField] : 0;
        }
        else {
          primaryKeyValue = masterData[postParam.selectedObject][postParam.primaryKeyField];
        }
        masterData["searchedData"] = temp;
        respObject = { ...respObject, modalName: undefined };
        if (masterData["searchedData"].length > 0) {
          primaryKeyValue = masterData["searchedData"][0][postParam.primaryKeyField];

          return rsapi().post(postParam.fetchUrl, {
            ...postParam.fecthInputObject, [postParam.primaryKeyField]: primaryKeyValue
          })
            .then(response => {
              masterData = { ...masterData, ...response.data };
              sortData(masterData);
              dispatch({ type: DEFAULT_RETURN, payload: { ...respObject, masterData } });
            })
            .catch(error => {
              dispatch({ type: DEFAULT_RETURN, payload: { ...respObject } })
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
        else {
          masterData[postParam.selectedObject] = undefined;
          masterData["searchedData"] = [];
          Object.keys(masterData).forEach(item => {
            if (item !== postParam.inputListName && item !== postParam.selectedObject
              && postParam.unchangeList && postParam.unchangeList.indexOf(item) === -1)
              masterData[item] = masterData && Array.isArray(masterData[item])?[]:undefined;
          })

          dispatch({ type: DEFAULT_RETURN, payload: { ...respObject, masterData } });
        }
      }
      else {
        dispatch({ type: DEFAULT_RETURN, payload: { ...respObject, masterData, modalName: undefined } });
      }
    }
    else if (respObject.inputParam.filtercombochange) {

      respObject = { ...respObject, modalName: undefined };
      if (masterData["searchedData"] !== undefined) {
        masterData["searchedData"] = undefined;
        // ALPD-5605 Added by Abdul to handle front end collapse when current becomes null when unmounted
        if(respObject.inputParam.searchRef.current && respObject.inputParam.searchRef.current.value )
        // ALPD-5605 End 
          respObject.inputParam.searchRef.current.value = "";
      }

      let Map = {}
      if (postParam.selectedComboName !== undefined) {
        Map = { [postParam.selectedComboName]: { [postParam.selectedComboId]: postParam.selectedCombo } }
      }

      dispatch({
        type: DEFAULT_RETURN, payload: {
          ...respObject, masterData, ...Map
        }
      });
    }
    else {
      respObject = { ...respObject, modalName: undefined };
      if (masterData["searchedData"] !== undefined) {
        if (masterData[postParam.selectedObject][postParam.primaryKeyField]) {

          const foundIndex = masterData["searchedData"].findIndex(
            x => x[postParam.primaryKeyField] === masterData[postParam.selectedObject][postParam.primaryKeyField]
          );
          masterData["searchedData"][foundIndex] = masterData[postParam.selectedObject];
        } else {
          const foundIndex = masterData["searchedData"].findIndex(
            x => x[postParam.primaryKeyField] === masterData[postParam.selectedObject][0][postParam.primaryKeyField]
          );
          masterData["searchedData"][foundIndex] = masterData[postParam.selectedObject][0];
        }
      }
      dispatch({ type: DEFAULT_RETURN, payload: { ...respObject, masterData } });
    }

  }
}

export const viewAttachment = (inputParam) => {
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
        } else if (error.response.status === 500) {
          toast.error(error.message);
        } else {
          toast.warn(error.response.data);
        }
      });
  }
}
//INVOICE MODULE - 24-SEP-2025
export function filterTransactionList(filterValue, filterParam, filteredListName,param) {
  return function (dispatch) {
    let masterData = filterParam.masterData;
    filteredListName = filteredListName || "searchedData"
    let primaryKeyValue = 0;
    let searchedData = undefined;
    let selectedData = []
    filterParam.childRefs && filterParam.childRefs.map(childref => {
      if (childref.ref !== undefined && childref.ref.current !== null) {
        childref.ref.current.value = "";
        masterData[childref.childFilteredListName] = undefined
      }
      return null;
    })
    if (filterValue === "") {
      if (masterData[filterParam.inputListName] && masterData[filterParam.inputListName].length > 0) {
        primaryKeyValue = masterData[filterParam.inputListName][0][filterParam.primaryKeyField];
        selectedData.push(masterData[filterParam.inputListName][0])
      }
    }
    else {
      if (masterData[filterParam.inputListName]) {
        searchedData = searchData(filterValue, masterData[filterParam.inputListName], filterParam.searchFieldList || []);
      } else {
        searchedData = []
      }

      if (searchedData.length > 0) {
        primaryKeyValue = searchedData[0][filterParam.primaryKeyField];
        selectedData.push(searchedData[0])
      }
    }

    if (primaryKeyValue !== 0 && !filterParam.isService) {
      primaryKeyValue = filterParam.isSingleSelect ? primaryKeyValue : String(primaryKeyValue)
      dispatch(initRequest(true));
      return rsapi().post(filterParam.fetchUrl, { ...filterParam.fecthInputObject, [filterParam.primaryKeyField]: primaryKeyValue })
        .then(response => {
          const dataState = {
            skip: 0,
            take: 10
          }
          masterData[filteredListName] = searchedData;
          masterData[filterParam.selectedObject] = selectedData

          // ALPD-4130 for Addition Filter Config Data Clear ATE-241
          if(filterParam.primaryKeyField && filterParam.primaryKeyField === "npreregno"){
          masterData["kendoFilterList"]= undefined;
          }
          masterData = { ...masterData, ...response.data };
          if (filterParam.isSortable) {
            sortData(masterData[filterParam.sortList], 'descending', filterParam.sortValue);
          }
          if (filterParam.isMultiSort) {
            filterParam.multiSortData.forEach(item => {
              sortData(masterData[item.list], 'descending', item.pkey);
            })
          }
          dispatch({
            type: DEFAULT_RETURN, payload: {
              masterData, loading: false,
              // skip: 0, take: 10, testskip: 0, testtake: 10,dataState 
              skip: filterParam.skip, take: filterParam.take,
              sampleskip : filterParam.sampleskip,
              sampletake : filterParam.sampletake,
              subsampleskip: filterParam.subsampleskip, subsampletake: filterParam.subsampletake,
              testskip: filterParam.testskip, testtake: filterParam.testtake,
              dataState,
              // filterColumnActive:true,
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
            toast.error(intl.formatMessage({ id: error.message }));
          }
          else {
            toast.warn(intl.formatMessage({ id: error.response.data }));
          }
        })
    }
    else {
      masterData[filterParam.selectedObject] =  !filterParam.isService ?undefined:searchedData;
      masterData[filteredListName] =  !filterParam.isService?[]:searchedData;
      
      filterParam.changeList && filterParam.changeList.map(name => masterData[name] = [])
      param && param.map(item=>masterData[item]=[])
      // Object.keys(masterData).forEach(item=> {
      //   if (item !== filterParam.inputListName && item !== filterParam.selectedObject 
      //     && filterParam.unchangeList && filterParam.unchangeList.indexOf(item) ===-1)
      //       masterData[item] = [];
      //   })   
      dispatch({
        type: DEFAULT_RETURN, payload: {
          masterData, operation: null, modalName: undefined, 
          // |ilterColumnActive:true,
          loading: false
        }
      });
    }
  }

}

export function postCRUDOrganiseTransSearch(postParamList, respObject) {
  return function (dispatch) {
    let masterData = respObject.masterData;
    postParamList && Array.isArray(postParamList) && postParamList.map((postParam, index) => {
      if (postParam.clearFilter === 'yes') {

        if (postParam.searchRef.current) {
          postParam.searchRef.current.value = "";
        }
        masterData[postParam.filteredListName] = undefined;
        postParam.childRefs && postParam.childRefs.map(childref => {
          if (childref.ref !== undefined && childref.ref.current !== null) {
            childref.ref.current.value = "";
            masterData[childref.childFilteredListName] = undefined
          }
          return null;
        })

      }
      if (Object.keys(masterData).indexOf(postParam.filteredListName) !== -1 && masterData[postParam.filteredListName] !== undefined) {

        if (postParam.clearFilter === 'check') {
          if (masterData[postParam.filteredListName] !== undefined) {
            const temp = masterData[postParam.filteredListName].filter(item => !Array.isArray(postParam.primaryKeyValue) ? postParam.primaryKeyValue : postParam.primaryKeyValue.includes(item[postParam.primaryKeyField]));
            masterData[postParam.filteredListName] = temp;

            if (masterData[postParam.filteredListName].length > 0) {
              return rsapi().post(postParam.fetchUrl, { ...postParam.fecthInputObject.fecthInputObject, [postParam.primaryKeyField]: String(respObject.masterData[postParam.filteredListName][0][postParam.primaryKeyField]) })
                .then(response => {
                  masterData = { ...masterData, ...response.data };
                })
            }
          }
        }
        else {
          if (masterData[postParam.filteredListName] !== undefined) {
            masterData[postParam.filteredListName] = replaceUpdatedObject(masterData[postParam.updatedListname], masterData[postParam.filteredListName], postParam.primaryKeyField)
          }
        }
      }
      return null;
    })
    //sortData(masterData);
    dispatch({ type: DEFAULT_RETURN, payload: { ...respObject, masterData } })
  }
}

export function showUnderDevelopment() {
  return function (dispatch) {
    toast.info(intl.formatMessage({ id: "IDS_UNDERDEVELOPMENT" }));
  }
}

//Fetch record when clicking add button in Type3Component
// export function onComboLoad(operation, userInfo, inputParam, ncontrolCode, extractedColumnList,IntegrationSettings) {
//   return function (dispatch) {

//     dispatch(initRequest(true));
//     let urlArray = [];
//     extractedColumnList.map(item=>{
//       if(item.elnget){
//         //urlArray.push(rsapi().post("https://logilabelntest.azurewebsites.net"+"/"+item.classUrl+"/"+item.methodUrl,{}))
//         urlArray.push(rsapi().post(IntegrationSettings[0].slinkname+"/"+item.classUrl+"/"+item.methodUrl,{}))
//       }
//       else{
//         urlArray.push(rsapi().post(item.classUrl+"/"+item.methodUrl, { userinfo: userInfo }))
//       }

//     }

//       )

//           Axios.all(urlArray)
//               .then(response => {
//                 let ComboFieldData = [];
//                 let dataList = [];

//                     extractedColumnList.map((item, index)=> {
//                       if(item.ndesigncomponentcode == designComponents.COMBOBOX){
//                         ComboFieldData = constructOptionList(item.objectValue === null ? response[index].data || [] : response[index].data[item.objectValue], item.foreignDataField,
//                                 item.dataField, undefined, undefined, undefined);
//                            dataList[item.dataField] = ComboFieldData.get("OptionList");
//                       }
//     extractedColumnList.map(item =>
//       urlArray.push(rsapi().post(item.classUrl + "/" + item.methodUrl, { userinfo: userInfo }))
//     )

//     Axios.all(urlArray)
//       .then(response => {
//         let ComboFieldData = [];
//         let dataList = [];

//         extractedColumnList.map((item, index) => {
//           if (item.ndesigncomponentcode == designComponents.COMBOBOX) {
//             ComboFieldData = constructOptionList(item.objectValue === null ? response[index].data || [] : response[index].data[item.objectValue], item.foreignDataField,
//               item.dataField, undefined, undefined, undefined);
//             dataList[item.dataField] = ComboFieldData.get("OptionList");
//           }

//         });

//         dispatch({
//           type: DEFAULT_RETURN,
//           payload: {
//             dataList,
//             operation,
//             screenName: inputParam.displayName,
//             openModal: true,
//             ncontrolCode, loading: false
//           }
//         })
//       })
//       .catch(error => {
//         dispatch(initRequest(false));
//         if (error.response?.status === 429) {
//                    toast.warn(intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
//                    dispatch({ type: DEFAULT_RETURN, payload: { loading: false } });
//                } else if (error.response?.status === 401 || error.response?.status === 403) {
//          dispatch({
//            type: UN_AUTHORIZED_ACCESS,
//                        payload: {
//                            navigation: 'forbiddenaccess',
//                            loading: false,
//                            responseStatus: error.response.status
//                        }
//            payload: {
//              navigation: 'forbiddenaccess',
//              loading: false,
//            }
//          });
//        } else if (error.response.status === 500) {
//           toast.error(error.message);
//         } else {
//           toast.warn(intl.formatMessage({
//             id: error.response.data
//           }));
//         }
//       })
//   }
// }


//Fetch record when clicking add button in Type3Component

export function onComboLoad(operation, userInfo, inputParam, ncontrolCode, extractedColumnList, IntegrationSettings) {
  return function (dispatch) {
    dispatch(initRequest(true));
    let urlArray = [];
    extractedColumnList.map(item => {
      if(item.ndesigncomponentcode !== designComponents.CHECKBOX){
      if (item.elnget) {
        //urlArray.push(rsapi().post("https://logilabelntest.azurewebsites.net"+"/"+item.classUrl+"/"+item.methodUrl,{}))
        urlArray.push(rsapi().post(IntegrationSettings[0].slinkname + "/" + item.classUrl + "/" + item.methodUrl, {}))
      }
      else {
          urlArray.push(rsapi().post(item.classUrl + "/" + item.methodUrl, { userinfo: userInfo }))
      }

    }
    }
    )
    Axios.all(urlArray)
      .then(response => {
        let ComboFieldData = [];
        let dataList = [];
        let selectedRecord={};
        extractedColumnList.map((item, index) => {
          if (item.ndesigncomponentcode == designComponents.COMBOBOX) {
            ComboFieldData = constructOptionList(item.objectValue === null ? response[index].data || [] : response[index].data[item.objectValue], item.foreignDataField,
              item.dataField, undefined, undefined, undefined);
             dataList[item.dataField] = ComboFieldData.get("OptionList");
             // added by sujatha ATE_274 on 31-08-2025 for site sample retention default get
             item.defaultValueRequired === true && (dataList[`Default${item.dataField}`] = ComboFieldData.get("DefaultValue"));
            //  item.defaultValueRequired === true ? selectedRecord[item.dataField]= ComboFieldData.get("DefaultValue") : {};
            item.defaultValueRequired && (selectedRecord[item.dataField] = ComboFieldData.get("DefaultValue"));
          }else if(item.ndesigncomponentcode === designComponents.CHECKBOX  && item.defaultvalue){
            selectedRecord[item.controlName]= transactionStatus.YES;

          }
        });
        dispatch({
          type: DEFAULT_RETURN,
          payload: {
            dataList,
            operation,
            screenName: inputParam.displayName,
            openModal: true,
            ncontrolCode, loading: false,selectedRecord
          }
        })
      })

      .catch(error => {

        dispatch(initRequest(false));

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
        } else if (error.response !== undefined && error.response.status === 500) {
          toast.error(intl.formatMessage({ id: error.message }));
        } else if (error.response === undefined) {
          toast.error(intl.formatMessage({ id: error.message }));
        } else {
          toast.warn(intl.formatMessage({
            id: error.response.data
          }));

        }

      })

  }

}

// export const fetchBGSITransferRecord = (fetchRecordParam) => {
//   return (dispatch) => {

//     dispatch(initRequest(true));
//     let url;
//     let urlArray = [];
//     url = fetchRecordParam.inputParam.classUrl + "/getActiveBGSITransferById";
//     urlArray.push(rsapi().post(url, { [fetchRecordParam.primaryKeyField]: fetchRecordParam.primaryKeyValue, "userinfo": fetchRecordParam.userInfo }));
//     Axios.all(urlArray)
//       .then(response => {

//         //let ComboFieldData = [];
//        // let dataList = [];
//         let selectedRecordData = { ...response[0].data };
//         //let responseData = [...response];
//         //let extractedColumnData = [];
//         let bgsiTransferRecord = [];
//         //responseData.splice(0, 1);

//         bgsiTransferRecord = { ...response[0].data[0] };
        


//         dispatch({
//           type: DEFAULT_RETURN,
//           payload: {
//             selectedRecord: selectedRecordData,
//             screenName: fetchRecordParam.screenName,
//             operation: fetchRecordParam.operation,
//             openModal: true,
//             ncontrolCode: fetchRecordParam.ncontrolCode,
//             loading: false,
//             selectedId: fetchRecordParam.primaryKeyValue,
//             //dataList,
//             bgsiTransferRecord
//           }
//         });
//       })
//       .catch(error => {
//         dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
//         if (error.response?.status === 429) {
//                    toast.warn(intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
//                    dispatch({ type: DEFAULT_RETURN, payload: { loading: false } });
//                } else if (error.response?.status === 401 || error.response?.status === 403) {
//           dispatch({
//             type: UN_AUTHORIZED_ACCESS,
//                         payload: {
//                             navigation: 'forbiddenaccess',
//                             loading: false,
//                             responseStatus: error.response.status
//                         }
            
//           });
//         } else if (error.response !== undefined && error.response.status === 500) {
//           toast.error(intl.formatMessage({ id: error.message }));
//         } else if (error.response === undefined) {
//           toast.error(intl.formatMessage({ id: error.message }));
//         } else {
//           toast.warn(intl.formatMessage({ id: error.response.data }));
//         }
//       })
//   }
// }

//Fetch record when clicking edit button in Type3Component
export const fetchRecordCombo = (fetchRecordParam) => {
  return (dispatch) => {

    dispatch(initRequest(true));
    let urlArray = [];
    let url;
    {/* Ate234 janakumar -> BGSI-7 Screen Name -> Project And Site Hierarchy Mapping -> View tree was site hierarchy screen deisgn  */ }
    if (fetchRecordParam.operation === "treeView") {
      url = fetchRecordParam.inputParam.classUrl + "/view" + fetchRecordParam.inputParam.methodUrl;
    }
    else if(fetchRecordParam.operation === "view" )
    {
      url = fetchRecordParam.inputParam.classUrl + "/getActive" + fetchRecordParam.inputParam.methodUrl + "ById";
    }
     else {
      url = fetchRecordParam.inputParam.classUrl + "/getActive" + fetchRecordParam.inputParam.methodUrl + "ById";
    }
    
    urlArray.push(rsapi().post(url, { [fetchRecordParam.primaryKeyField]: fetchRecordParam.primaryKeyValue, "userinfo": fetchRecordParam.userInfo }));
    fetchRecordParam.extractedColumnList.map(item => {

      if (item.elnget) {
        urlArray.push(rsapi().post(fetchRecordParam.integrationSettings[0].slinkname + "/" + item.classUrl + "/" + item.methodUrl, {}))
      }
      else if (item.classUrl && item.methodUrl) {

        if (item.parentPrimaryField && item.parentPrimaryField !== null) {
          urlArray.push(rsapi().post(item.classUrl + "/" + item.methodUrl,
            {
              [item.foreignDataField]: fetchRecordParam.editRow[item.foreignDataField],
              [item.parentPrimaryField]: fetchRecordParam.editRow[item.parentPrimaryField] || undefined,
              "userinfo": fetchRecordParam.userInfo
            }))
        }
        else {
          {/* Ate234 janakumar -> BGSI-7 Screen Name -> Project And Site Hierarchy Mapping -> View tree was site hierarchy screen deisgn  */ }
          if (fetchRecordParam.operation !== "treeView" && fetchRecordParam.operation !== "view") {
            urlArray.push(rsapi().post(item.classUrl + "/" + item.methodUrl, {
            [item.foreignDataField]:
              fetchRecordParam.editRow[item.foreignDataField], "userinfo": fetchRecordParam.userInfo
          }))
        }

        }

        // urlArray.push(rsapi.post(item.classUrl + "/" + item.methodUrl, {[item.parentPrimaryField]: fetchRecordParam.editRow.nprojecttypecode , "userinfo": fetchRecordParam.userInfo}))
      }
    });
    
        //else {
        //  urlArray.push(rsapi().post(item.classUrl + "/" + item.methodUrl, {
          //  [item.foreignDataField]:
          //    fetchRecordParam.editRow[item.foreignDataField], "userinfo": fetchRecordParam.userInfo
         // }))
        //}

        //// urlArray.push(rsapi().post(item.classUrl + "/" + item.methodUrl, {[item.parentPrimaryField]: fetchRecordParam.editRow.nprojecttypecode , "userinfo": fetchRecordParam.userInfo}))
      //}
    //});

    Axios.all(urlArray)
      .then(response => {

        let ComboFieldData = [];
        let dataList = [];
        let selectedRecordData = { ...response[0].data };
        let responseData = [...response];
        let extractedColumnData = [];
        let treeViewRecord = [];
        let bgsiTransferRecord = [];
        responseData.splice(0, 1);

        {/* Ate234 janakumar -> BGSI-7 Screen Name -> Project And Site Hierarchy Mapping -> View tree was site hierarchy screen deisgn  */ }
        if (fetchRecordParam.operation !== "treeView" && fetchRecordParam.operation !== "view") {
        fetchRecordParam.extractedColumnList.map((item) => {
          if (item.ndesigncomponentcode === designComponents.COMBOBOX) {
            extractedColumnData.push(item);
            if (!item.hideNARecord || selectedRecordData[item.tableDataField]!==-1) {
              selectedRecordData[item.dataField] = {
                value: selectedRecordData[item.foreignDataField],
                label: selectedRecordData[item.dataField]
              }
            }
          }
          else if (item.ndesigncomponentcode === designComponents.DATEPICKER) {
            selectedRecordData[item.dataField] = rearrangeDateFormat(fetchRecordParam.userInfo, selectedRecordData[item.dataField]);
          }
        })

        extractedColumnData.map((field, index) => {
          responseData.map((item, indexValue) => {
            if (index === indexValue) {
              if ((field.classUrl === 'limselnusermapping' && field.methodUrl === 'getLimsUsers') || (field.classUrl === 'limselnsitemapping' && field.methodUrl === 'getLimsSite')) {
                responseData[index].data.push(response[0].data);
              }
              ComboFieldData = constructOptionList(field.objectValue === null ? responseData[index].data || [] : responseData[index].data[field.objectValue], field.foreignDataField,
                field.dataField, undefined, undefined, undefined);
              dataList[field.dataField] = ComboFieldData.get("OptionList");
              ////added by sujatha ATE_274 on 31-08-2025 for site sample retention default get period
              field.defaultValueRequired === true && (dataList[`Default${field.dataField}`] = ComboFieldData.get("DefaultValue"));
            //  item.defaultValueRequired === true ? selectedRecord[item.dataField]= ComboFieldData.get("DefaultValue") : {};
              field.defaultValueRequired && (selectedRecordData[field.dataField] = ComboFieldData.get("DefaultValue"));
            }
          })
        });
        }
        else if(fetchRecordParam.operation === "view")
        {
          bgsiTransferRecord = { ...response[0] };
        }
        else {
          {/* Ate234 janakumar -> BGSI-7 Screen Name -> Project And Site Hierarchy Mapping -> View tree was site hierarchy screen deisgn  */ }
          treeViewRecord = { ...response[0].data[0] };
        }


        dispatch({
          type: DEFAULT_RETURN,
          payload: {
            selectedRecord: selectedRecordData,
            screenName: fetchRecordParam.screenName,
            operation: fetchRecordParam.operation,
            openModal: true,
            ncontrolCode: fetchRecordParam.ncontrolCode,
            loading: false,
            selectedId: fetchRecordParam.primaryKeyValue,
            dataList,
            treeViewRecord,
            bgsiTransferRecord
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
        } else if (error.response !== undefined && error.response.status === 500) {
          toast.error(intl.formatMessage({ id: error.message }));
        } else if (error.response === undefined) {
          toast.error(intl.formatMessage({ id: error.message }));
        } else {
          toast.warn(intl.formatMessage({ id: error.response.data }));
        }
      })
  }
}




//Fetch record when clicking edit button in Type3Component
// export const fetchRecordCombo = (fetchRecordParam) => {
//   return (dispatch) => {

//     dispatch(initRequest(true));
//     let urlArray = [];
//     const url = fetchRecordParam.inputParam.classUrl + "/getActive" + fetchRecordParam.inputParam.methodUrl + "ById";
//     urlArray.push(rsapi().post(url, { [fetchRecordParam.primaryKeyField]: fetchRecordParam.primaryKeyValue, "userinfo": fetchRecordParam.userInfo }));
//     fetchRecordParam.extractedColumnList.map(item => {
//       if(item.classUrl && item.methodUrl){

//         if(item.elnget){
//           urlArray.push(rsapi().post("https://logilabelntest.azurewebsites.net"+"/"+item.classUrl+"/"+item.methodUrl,{}))
//         }
//         else{
//           urlArray.push(rsapi().post(item.classUrl+"/"+item.methodUrl, { "userinfo" : fetchRecordParam.userInfo }))
//         }
//         //urlArray.push(rsapi().post(item.classUrl+"/"+item.methodUrl, { "userinfo" : fetchRecordParam.userInfo }))
//       if (item.classUrl && item.methodUrl) {
//         urlArray.push(rsapi().post(item.classUrl + "/" + item.methodUrl, { "userinfo": fetchRecordParam.userInfo }))
//       }
//     });

//     Axios.all(urlArray)
//       .then(response => {

//       fetchRecordParam.extractedColumnList.map((item) => {
//         if(item.ndesigncomponentcode === designComponents.COMBOBOX){
//           extractedColumnData.push(item);
//           selectedRecordData[item.dataField] = {
//             value:selectedRecordData[item.foreignDataField],
//             label:selectedRecordData[item.dataField]
//           }                      
//         }
//         else if(item.ndesigncomponentcode === designComponents.DATEPICKER){
//           selectedRecordData[item.dataField] = rearrangeDateFormat(fetchRecordParam.userInfo, selectedRecordData[item.dataField]);
//         }
//       })

//       extractedColumnData.map((field, index) => {
//         responseData.map((item, indexValue) => {
//           if(index === indexValue){
//             if(field.classUrl==='limselnusermapping'&&field.methodUrl==='getLimsUsers'){
//             responseData[index].data.push(response[0].data);}
//             ComboFieldData = constructOptionList(field.objectValue === null ? responseData[index].data || [] : responseData[index].data[field.objectValue], field.foreignDataField,
//               field.dataField, undefined, undefined, undefined);
//          dataList[field.dataField] = ComboFieldData.get("OptionList");
//         let ComboFieldData = [];
//         let dataList = [];
//         let selectedRecordData = { ...response[0].data };
//         let responseData = [...response];
//         let extractedColumnData = [];
//         responseData.splice(0, 1);

//         fetchRecordParam.extractedColumnList.map((item) => {
//           if (item.ndesigncomponentcode === designComponents.COMBOBOX) {
//             extractedColumnData.push(item);
//             selectedRecordData[item.dataField] = {
//               value: selectedRecordData[item.foreignDataField],
//               label: selectedRecordData[item.dataField]
//             }
//           }
//           else if (item.ndesigncomponentcode === designComponents.DATEPICKER) {
//             selectedRecordData[item.dataField] = rearrangeDateFormat(fetchRecordParam.userInfo, selectedRecordData[item.dataField]);
//           }
//         })

//         extractedColumnData.map((field, index) => {
//           responseData.map((item, indexValue) => {
//             if (index === indexValue) {
//               ComboFieldData = constructOptionList(field.objectValue === null ? responseData[index].data || [] : responseData[index].data[field.objectValue], field.foreignDataField,
//                 field.dataField, undefined, undefined, undefined);
//               dataList[field.dataField] = ComboFieldData.get("OptionList");
//             }
//           })
//         });

//         dispatch({
//           type: DEFAULT_RETURN,
//           payload: {
//             selectedRecord: selectedRecordData,
//             screenName: fetchRecordParam.screenName,
//             operation: fetchRecordParam.operation,
//             openModal: true,
//             ncontrolCode: fetchRecordParam.ncontrolCode,
//             loading: false,
//             selectedId: fetchRecordParam.primaryKeyValue,
//             dataList
//           }
//         });
//       })
//       .catch(error => {
//         dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
//         if (error.response?.status === 429) {
//                    toast.warn(intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
//                    dispatch({ type: DEFAULT_RETURN, payload: { loading: false } });
//                } else if (error.response?.status === 401 || error.response?.status === 403) {
//          dispatch({
//            type: UN_AUTHORIZED_ACCESS,
//                        payload: {
//                            navigation: 'forbiddenaccess',
//                            loading: false,
//                            responseStatus: error.response.status
//                        }
//            payload: {
//              navigation: 'forbiddenaccess',
//              loading: false,
//            }
//          });
//        } else if (error.response.status === 500) {
//           toast.error(intl.formatMessage({ id: error.message }));
//         } else {
//           toast.warn(intl.formatMessage({ id: error.response.data }));
//         }
//       })
//   }
// }
export function onServiceLoad(userInfo, inputParam, ncontrolCode, comboColumnField, primarykeyvalue, inputData) {
  return function (dispatch) {
    dispatch(initRequest(true));
    let urlArray = [];


    comboColumnField.map(item => {
        urlArray.push(rsapi().post(item.classUrl + "/" + item.onChangeUrl, {
          userinfo: userInfo,
          [item.tableDataField]: primarykeyvalue[item.tableDataField], "parentPrimaryField": inputData.selectedRecord[item.parentPrimaryField]
        }))
    }  //dependentParentPrimaryField into parentPrimaryField

    )
    Axios.all(urlArray)
      .then(response => {

        let ComboFieldData = [];
        let dataList = [];
        let selectedRecord = { ...inputData.selectedRecord };
        comboColumnField.map((item, index) => {
          if (item.ndesigncomponentcode == designComponents.COMBOBOX) {
            ComboFieldData = constructOptionList(item.childObjectValue === null ? response[index].data || [] : response[index].data[item.childObjectValue], item.childPrimaryField,
              item.childdataField, undefined, undefined, undefined);
            dataList[item.childdataField] = ComboFieldData.get("OptionList");
            //Added by Sujatha for SWSM-5 on 26/07/2025 --> Added 2 fields in fieldspecification,
            //  in order to clear all child fields the below code is used
            if(item.clearAllChildField==true){
              item.clearFields.map((fieldList,index)=>{
                selectedRecord[fieldList] = undefined;
              //added by Sujatha for SWSM-5 on 05/08/2025 to clear the child dropdown's
                inputData.dataList[fieldList]=undefined;  
              })
            } else{
            selectedRecord[item.childdataField] = undefined;
          }
          }
        });

        dataList = { ...inputData.dataList, ...dataList }

        dispatch({
          type: DEFAULT_RETURN,
          payload: {
            dataList,
            //  operation,
            screenName: inputParam.displayName,
            openModal: true,
            ncontrolCode, loading: false,
            selectedRecord
          }
        })
      })

      .catch(error => {

        dispatch(initRequest(false));

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

          toast.warn(intl.formatMessage({

            id: error.response.data

          }));

        }

      })

  }

}

export function dynamicFileDownload(filedata) {
  return (dispatch) => {
    if (filedata.viewName === 'InfoView') {
      if (filedata && filedata[filedata.field[2] + ['_ssystemfilename_Sample']] !== undefined && filedata[filedata.field[2]] !== "") {
        const inputParam = {
          inputData: {
            viewFile: {
              ssystemfilename: filedata[filedata.field[2] + ['_ssystemfilename_Sample']],
              npreregno: filedata.npreregno,
              sarno: filedata.sarno,
              sfilename: filedata[filedata.field[2]]
            },
            userinfo: filedata.userInfo
          },
          classUrl: "registration",
          operation: "view",
          methodUrl: "RegistrationFile",
          //screenName: filedata.displayName
        }
        dispatch(viewAttachment(inputParam));
      } else {
        toast.warn(intl.formatMessage({ id: "IDS_FILENOTUPLOADED" }))
      }
    } else if (filedata.viewName === 'subSample') {
      if (filedata && filedata[filedata.field[2] + ['_ssystemfilename_subSample']] !== undefined && filedata[filedata.field[2]] !== "") {
        const inputParam = {
          inputData: {
            viewFile: {
              ssystemfilename: filedata[filedata.field[2] + ['_ssystemfilename_subSample']],
              npreregno: filedata.npreregno,
              ntransactionsamplecode: filedata.ntransactionsamplecode,
              ssamplearno: filedata.ssamplearno,
              sfilename: filedata[filedata.field[2]],
              sarno: filedata.sarno
            },
            userinfo: filedata.userInfo
          },
          classUrl: "registration",
          operation: "view",
          methodUrl: "RegistrationSubSampleFile",
          //screenName: filedata.displayName
        }
        dispatch(viewAttachment(inputParam));
      } else {
        toast.warn(intl.formatMessage({ id: "IDS_FILENOTUPLOADED" }))
      }
    } else {
      let isFileupload;
      if (filedata && filedata[filedata['dataField'] + ['_ssystemfilename']] !== undefined && filedata[filedata['dataField']] !== "") {
        isFileupload = true;
      }
      if (filedata && filedata[filedata.dataField + ['_ssystemfilename_Sample']] !== undefined && filedata[filedata.dataField] !== "") {
        isFileupload = true;
      }
      if (isFileupload) {
        const inputParam = {
          inputData: {
            viewFile: filedata.screenName === 'SampleRegistration' ?
              {
                ssystemfilename: filedata[filedata.dataField + ['_ssystemfilename_Sample']],
                npreregno: filedata.npreregno,
                sarno: filedata.sarno,
                sfilename: filedata[filedata.dataField]
              } :
              {
                ssystemfilename: filedata[filedata['dataField'] + ['_ssystemfilename']],
                ndynamicmastercode: filedata.ndynamicmastercode,
                ndesigntemplatemappingcode: filedata.ndesigntemplatemappingcode,
                sfieldname: filedata.dataField,
                sfilename: filedata[filedata.dataField]
              },
            userinfo: filedata.userInfo
          },
          classUrl: filedata.classUrl,
          operation: "view",
          methodUrl: filedata.methodUrl,
          //screenName: filedata.displayName
        }
        dispatch(viewAttachment(inputParam));
      } else {
        toast.warn(intl.formatMessage({ id: "IDS_FILENOTUPLOADED" }))
      }
    }
  }

}

export function modalSave(inputParam, masterData) {

  return function (dispatch) {
    dispatch(initRequest(true));
    rsapi().post(inputParam.classUrl + "/" + inputParam.operation + inputParam.methodUrl, inputParam.inputData).then(response => {

      masterData = {
        ...masterData,
        ...response.data
      }
      if (inputParam.postParam) {

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
        // sortData(masterData);
      }
      masterData = sortData(masterData);
      dispatch({
        type: DEFAULT_RETURN, payload: {
		//ALPD-4519-Vignesh R(06-08-2024)
          loadEsign: false,
          loading: false,
          masterData,
          modalShow: inputParam.modalShow,
          openModal: false,
          modalTitle: undefined,
          operation: inputParam.operation
        }
      }
      )
    })
      .catch(error => {

        dispatch({
          type: DEFAULT_RETURN,
          payload: {
            loadEsign: false,
            loading: false,
            modalShow: true,
            openModal: false
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
        }
        else {
          toast.warn(error.response.data);
        }
      })
  }

}

export function openBarcodeModal(selectedMaster, ncontrolCode, userinfo) {
  return function (dispatch) {
    dispatch(initRequest(true));


    let urlArray = [];
    const getPrinter = rsapi().post("barcode/getPrinter", userinfo);
    const getControlBasedBarcode = rsapi().post("barcodeconfiguration/checkConfiguration", { selectedMaster, ncontrolCode, userinfo, Multiselect:Array.isArray(selectedMaster) });
    urlArray = [getPrinter, getControlBasedBarcode]
    Axios.all(urlArray).then(response => {

      const printer = constructOptionList(response[0].data || [], "sprintername",
        "sprintername", undefined, undefined, true).get("OptionList");

      const barcode = constructOptionList(response[1].data.Barcode || [], "sbarcodename",
        "sbarcodename", undefined, undefined, true).get("OptionList");

       const selectedRecord={}

       if(printer.length>0)
       selectedRecord['sprintername']=printer[0];

        if(barcode.length>0)selectedRecord['nbarcode']=barcode[0];
        selectedRecord['nbarcodeprint']=1
       

      dispatch({
        type: DEFAULT_RETURN,
        payload: {
          openModal: true,
          operation: "barcode",
          BarcodeList: barcode,
          Printer: printer,
          loading: false,
          ncontrolcode: ncontrolCode,
          nbarcodeprint: response[1].data.nbarcodeprint,
          barcodeSelectedRecord: selectedMaster,
          selectedRecord:selectedRecord
        }
      })
    })

      .catch(error => {

        dispatch(initRequest(false));

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

          toast.warn(intl.formatMessage({

            id: error.response.data

          }));

        }

      })

  }

}


export function barcodeGeneration(selectedMaster, ncontrolCode, userinfo, selectedRecord) {
  return function (dispatch) {
    dispatch(initRequest(true));
    let list = []
    if (Array.isArray(selectedMaster)) {
      list = selectedMaster
    } else {
      list.push(selectedMaster)
    }
    rsapi().post("barcodeconfiguration/barcodeGeneration", {
      selectedMaster: list, ncontrolCode,
      userinfo, nbarcode: selectedRecord.nbarcode.item.nbarcode, sprintername: selectedRecord.sprintername.value,
      nbarcodeprintcount: selectedRecord.nbarcodeprintcount ? selectedRecord.nbarcodeprintcount : 1
    })
      .then(response => {
        toast.info(response.data)

        dispatch({
          type: DEFAULT_RETURN,
          payload: {
            openModal: false,
            operation: "barcode",
            loading: false,
            selectedRecord: {},
            barcodeSelectedRecord: undefined
          }
        })
      })

      .catch(error => {

        dispatch(initRequest(false));

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

          toast.warn(intl.formatMessage({

            id: error.response.data

          }));

        }

      })

  }

}

export const syncAction = (inputParam) => {
  return (dispatch) => {
    dispatch(initRequest(true));
    return rsapi().post(inputParam.classUrl + "/"+inputParam.operation+ inputParam.methodUrl, inputParam.inputData)
      .then(response => {       
 
        let data = response.data;
        sortData(data);
 
        const updateInfo = {
          typeName: DEFAULT_RETURN,
          data: { masterData: [],operation:inputParam.operation, organisation: undefined, }
        }
        dispatch(updateStore(updateInfo))
 
       
 
        dispatch({
          type: DEFAULT_RETURN,
          payload: {
            masterData: data,
            operation:inputParam.operation,
            activeTestTab: data.activeTestTab,
            activeTestKey: data.activeTestKey,
            activeBCTab: data.activeBCTab,
            inputParam: inputParam,
            masterStatus: "",
            userInfo: inputParam.inputData.userinfo,
            loading: false, 
            openModal :false,
            selectedId: null,
            selectedRecord: {},
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
        dispatch({ type: DEFAULT_RETURN, payload: { loading: false,openModal:false,loadEsign:false } })
        if (error.response.status === 503) {         
          toast.warn(intl.formatMessage({id:"IDS_SYNCUNABLEOATTEMPT"}));            
        } else if(error.response.status === 500){
          toast.error(error.message);
        } else if (error.response?.status === 429) {
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
          toast.warn(error.response.data);
        }
       
      })
 
  };
};


//export const generateControlBasedReport = (inputParam) => {
  export const generateControlBasedReport = (ncontrolCode, selectedRecord, Login, primaryKeyField, primaryKeyValue) => {
    return (dispatch) => {
      dispatch(initRequest(true));
      const inputParam = {
        primaryKeyField: primaryKeyField,
        nformcode: Login.userInfo.nformcode,
        sreportlink: Login.reportSettings[15],
        smrttemplatelink: Login.reportSettings[16],
        ncontrolcode: ncontrolCode,
        userinfo: Login.userInfo,
        selectedRecord: selectedRecord,
        ntranscode: selectedRecord.ntransactionstatus,
        primaryKeyValue: primaryKeyValue,
        nreporttypecode:REPORTTYPE.CONTROLBASED
      }
      rsapi().post("controlbasedreport/controlBasedReport", {
  
        ...inputParam
      })
        .then(response => {
  
          if (response.data.SelectedViewReportMaster && response.data.SelectedViewReportMaster.sreportformatdetail === 'viewer') {
  
            viewReportDetailWithParametersReports(response.data, inputParam);
            dispatch({
              type: DEFAULT_RETURN,
              payload: {
                loading: false,
                loadEsign: false,
                openModal: false,
                showConfirmAlert: false
              }
            })
          } else {
            dispatch({
              type: DEFAULT_RETURN,
              payload: {
                loading: false,
                loadEsign: false,
                openModal: false,
                showConfirmAlert: false
              }
            })
            document.getElementById("download_data").setAttribute("href", response.data.filepath);
            document.getElementById("download_data").click();
          }
        }).catch(error => {
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
        })
    }
  }
  
    export const dynamicExportTemplate = (inputParam) => {
      return (dispatch) => {
        dispatch(initRequest(true));
        return rsapi().post("exportimport/exportTemplate", inputParam)
        .then(response => {
          let value = "";
          if (response.data.rtn === "Success") {
              value = response.data["exportFileViewUrl"];
              const win = window.open(value);
              if (win) {
                  win.focus();
              } else {
                  toast.warn(intl.formatMessage("IDS_PLEASEALLOWPOPUPSFORTHISWEBSITE"));
              }
          } else {
              if (response.data.rtn) {
                  toast.warn(intl.formatMessage({ id: response.data.rtn }));
              }
          }
          dispatch({
              type: DEFAULT_RETURN, payload: {
                  loading: false,
                  loadEsign: false, openModal: false
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
    };
  
    export function dynamicImportTemplate(inputParam, masterData, modalName, defaultInput,ConfirmMessage) {
      return function (dispatch) {
        dispatch(initRequest(true));
        let requestUrl = '';
        if (inputParam.isFileupload && inputParam.isFileupload!=='undefined') {
          const formData = inputParam.formData;
          formData.append("userinfo", JSON.stringify(inputParam.inputData.userinfo));
          requestUrl = rsapi().post(inputParam.classUrl + "/" + inputParam.operation + inputParam.methodUrl, formData);
        } else {
          requestUrl = rsapi().post(inputParam.classUrl + "/" + inputParam.operation + inputParam.methodUrl, { ...inputParam.inputData });
        }
        return requestUrl
          .then(response => {
          if (response.data.rtn  === "Success") {
            let inputParams={
              classUrl:response.data.classUrl ,methodUrl:response.data.methodUrl ,inputData:{'userinfo':inputParam.inputData.userinfo},
              displayName:inputParam.displayName
            }
            // dispatch(callService(inputParams))
    
            let data = response.data.ResponseBody;
            sortData(data);
    
            const updateInfo = {
              typeName: DEFAULT_RETURN,
              data: { masterData: [], organisation: undefined, }
            }
            dispatch(updateStore(updateInfo))
    
    
            dispatch({
              type: DEFAULT_RETURN,
              payload: {
                openExcelModal: false,
                masterData: data,
                activeTestTab: data.activeTestTab,
                activeTestKey: data.activeTestKey,
                activeBCTab: data.activeBCTab,
                inputParam: inputParams,
                masterStatus: "",
                userInfo: inputParam.inputData.userinfo,
                loading: false, selectedId: null, selectedRecord: {},
                dataState: undefined,
                organisation: {
                  selectedNode: data.SelectedNode, selectedNodeName: data.SelectedNodeName,
                  primaryKeyValue: data.AddedChildPrimaryKey
                },
                displayName: inputParams.displayName,
                reportFilePath: undefined,
                skip: 0, take: undefined,
                testskip: 0,
                //testtake: 5,
                testtake: inputParams.inputData.settings ? inputParams.inputData.settings[12] : 10,
                //  key:inputParam.key!==undefined?inputParam.key:""
              }
            })
          } 
          dispatch({
              type: DEFAULT_RETURN, payload: {
                  loading: false,
                  loadEsign: false, openExcelModal: false
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
    };
  

