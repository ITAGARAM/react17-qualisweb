import { toast } from 'react-toastify';
import Axios from 'axios';
import rsapi from '../rsapi';
import { initRequest } from './LoginAction';
import { DEFAULT_RETURN, UN_AUTHORIZED_ACCESS } from './LoginTypes';
import { constructOptionList, sortData } from '../components/CommonScript';
import { transactionStatus } from '../components/Enumeration';
import { intl } from '../components/App';
import { crudMaster } from './ServiceAction';


export function getSiteHierarchy(inputParam) {
    return function (dispatch) {

        const siteHierarchyService = rsapi().post("sitehierarchyconfiguration/getSiteHierarchy", {
            userinfo: inputParam.inputData.userInfo,
            nsitetypecode: inputParam.selectedRecord.selectedNodeKey || -1, nsitecode: inputParam.inputData.nsitecode || "",
            nneedalltypesite:inputParam.selectedRecord.nneedalltypesite||4
        });

        let urlArray = [];
        if (inputParam.operation === "create") {
            urlArray = [siteHierarchyService];
        }
        else {
            urlArray = [siteHierarchyService];
        }
        dispatch(initRequest(true));
        Axios.all(urlArray)
            .then(response => {
                if (response[0].data['SiteHierarchy'].length > 0) {
                    const siteMap = constructOptionList(response[0].data['SiteHierarchy'] || [], "nsitecode",
                        "ssitename", undefined, undefined, false);
                    const siteConfigList = siteMap.get("OptionList");
                    let masterData = inputParam.masterData;
                    delete (inputParam.selectedRecord.nsitecode);
                    dispatch({
                        type: DEFAULT_RETURN, payload: {
                            selectedRecord: { ...inputParam.selectedRecord },
                            masterData: { ...masterData, siteConfigList: siteConfigList }, openModal: true, openAlertModal: true, loading: false
                        }
                    });
                } else {
                    dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                    toast.warn(intl.formatMessage({ id: "IDS_NOSITEAVAILABLE" }));
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
                } else if (error.response.status === 500) {
                    toast.error(error.message);
                }
                else {
                    toast.warn(error.response.data);
                }
            })

    }
}

export function getSiteHierarchyConfigDetail(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("sitehierarchyconfiguration/getSiteHierarchyConfiguration", {
            'userinfo': inputParam.userinfo,
            'nsitehierarchyconfigcode': inputParam.nsitehierarchyconfigcode || -1
        })
            .then(response => {
                let masterData = {};
//SWSM-54 - committed by rukshana on september 20-2025 for showing graph view in slideout modal in site hierarchy
                let selectedTreeNode = {};
                if(response.data.selectedSiteHierarchyConfig != null && response.data.selectedSiteHierarchyConfig != undefined)
                {
                    
                let arr = []
                arr.push(response.data.selectedSiteHierarchyConfig.jsondata)
                let pathList = buildLabelPaths(arr)
                selectedTreeNode = {
                        OpenNodes: pathList,
                        CompleteTreePath: pathList[0],
                        AgaramTree: arr,
                        selectedNodeKey: arr[0].item.selectedNodeDetail.nsitetypecode,
                        selectedNodePKey: arr[0].primaryKey
                    }

                }
                
                masterData = { ...inputParam.masterData, ...response.data };
                sortData(masterData);
               let nneedchange=inputParam.reload ?true:false;
//SWSM-54 - committed by rukshana on september 20-2025 for showing graph view in slideout modal in site hierarchy
                dispatch({ type: DEFAULT_RETURN, payload: { masterData, loading: false ,nneedchange,selectedTreeNode} });
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
                } else if (error.response.status === 500) {
                    toast.error(error.message);
                } else {
                    toast.warn(error.response.data);
                }

            })
    }
}
//SWSM-54 - committed by rukshana on september 20-2025 for showing graph view in slideout modal in site hierarchy
export function getTreeDetail(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("sitehierarchyconfiguration/getSiteHierarchyConfiguration", {
            'userinfo': inputParam.userinfo,
            'nsitehierarchyconfigcode': inputParam.nsitehierarchyconfigcode || -1
        })
            .then(response => {
                let masterData = {};
                masterData = { ...inputParam.masterData, ...response.data };
                sortData(masterData);
               let nneedchange=inputParam.reload ?true:false;
                dispatch({ type: DEFAULT_RETURN, payload: { masterData, loading: false ,openModal:true,nneedchange, graphView:true,
                    loadSiteHierarchyConfig:false,  //Added by sonia on 21st sept 2025 for jira id:swsm-54
                    screenName: "IDS_SITEHIERARCHY", operation: 'view'
 
                } });
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
                } else if (error.response.status === 500) {
                    toast.error(error.message);
                } else {
                    toast.warn(error.response.data);
                }

            })
    }
}

export function getEditSiteHierarchyData(nsitehierarchyconfigcode, userInfo, masterData, ncontrolcode, screenName) {
    return function (dispatch) {
        if (masterData.selectedSiteHierarchyConfig["ntransactionstatus"] === transactionStatus.APPROVED ||
            masterData.selectedSiteHierarchyConfig.ntransactionstatus === transactionStatus.RETIRED
        ) {
            toast.warn(intl.formatMessage({ id: "IDS_SELECTDRAFTRECORD" }));
        } else {
            const inputData = {
                nsitehierarchyconfigcode: nsitehierarchyconfigcode,
                userinfo: userInfo
            }
            dispatch(initRequest(true));
            rsapi().post("sitehierarchyconfiguration/getActiveSiteHierarchyConfigById", inputData)
                .then(response => {
                    let selectedRecord = {};
                    let arr = []
                    arr.push(response.data.jsondata)
                    let pathList = buildLabelPaths(arr)
                    selectedRecord = {
                        'sconfigname': response.data.sconfigname,
                        'nsitehierarchyconfigcode': response.data.nsitehierarchyconfigcode,
                        'nneedalltypesite':response.data.nneedalltypesite,
                        OpenNodes: pathList,
                        CompleteTreePath: pathList[0],
                        AgaramTree: arr,
                        selectedNodeKey: arr[0].item.selectedNodeDetail.nsitetypecode,
                        selectedNodePKey: arr[0].primaryKey
                    }


                    dispatch({
                        type: DEFAULT_RETURN, payload: {
                            openModal: true, selectedRecord, masterData,
                            ncontrolcode: ncontrolcode, loadSiteHierarchyConfig: true,
                            loading: false, screenName: screenName, operation: 'update',

                        }
                    })
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
}

export function approveSiteHierarchy(inputParam, masterData, modalName, ConfirmMessage) {
  return function (dispatch) {
    dispatch(initRequest(true));
    rsapi().post(inputParam.classUrl + "/" + inputParam.operation + inputParam.methodUrl, { ...inputParam.inputData })
        .then(response => {

            // Http Status code 202 block added by L.Subashini - Start
            if (response.status === 202) {
                 //HttpStatus:Accepted
                inputParam['inputData']['confirmation'] = true;
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } });
                ConfirmMessage.confirm(
                        "confirmationMessage",
                        intl.formatMessage({ id: "IDS_INFOMATION" }),
                        intl.formatMessage({ id: "IDS_RETIREEXISTINGCONFIGUARTION" }),
                        intl.formatMessage({ id: "IDS_OK" }),
                    intl.formatMessage({ id: "IDS_CANCEL" }),
                    () => dispatch(crudMaster(inputParam, masterData, modalName))
                );
               // toast.info(intl.formatMessage({ id: "IDS_RETIREEXISTINGCONFIGUARTION" }));
                //dispatch(crudMaster(inputParam, masterData, modalName));
            }
            // Http Status code 202 block added by L.Subashini - End
            else
            {
                const retrievedData = sortData(response.data);
                masterData = {
                    ...masterData,
                    ...retrievedData
                }
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
                dispatch({
                    type: DEFAULT_RETURN, 
                    payload: { 
                        masterData,
                        inputParam,
                        modalName,
                        isFilterDetail:false,
                        openModal: false,
                        operation: inputParam.operation,
                        masterStatus: "",
                        loadEsign: false,
                        showEsign: false,
                        selectedRecord: {},
                        loading: false,
                        design: [],
                        openPortal: false
                    } 
                });
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
        } else if (error.response.status === 500) {
            toast.error(error.message);
        } 
        //Commented 417 block by L.Subashini
        //Handled in then block with 202 status code--Start
        // else if (response.response.status === 417) {
        //     inputParam['inputData']['confirmation'] = true;
        //     // dispatch({ type: DEFAULT_RETURN, payload: { loading: false } });
        //     // ConfirmMessage.confirm(
        //         //     "confirmationMessage",
        //         //     intl.formatMessage({ id: "IDS_INFOMATION" }),
        //         //     intl.formatMessage({ id: "IDS_RETIREEXISTINGCONFIGUARTION" }),
        //         //     intl.formatMessage({ id: "IDS_OK" }),
        //     //     intl.formatMessage({ id: "IDS_CANCEL" }),
        //     //     () => dispatch(crudMaster(inputParam, masterData, modalName))
        //     // );
        //     toast.warn(intl.formatMessage({ id: "IDS_RETIREEXISTINGCONFIGUARTION" }));
        //     dispatch(crudMaster(inputParam, masterData, modalName));
        // } 
        // Handled in then block with 202 status code---End
        else {
            const selectedRecordObj = { selectedRecord: inputParam.selectedRecord }
            dispatch({
                type: DEFAULT_RETURN,
                payload: {
                    masterStatus: error.response.data,
                    errorCode: error.response.status,
                    loadEsign: false,
                    openModal: false,
                    loading: false,
                    openPortal: false,
                    ...selectedRecordObj
                }
            });
        }
    });
  }
}

export function retireSiteHierarchy(inputParam, masterData, modalName, ConfirmMessage, isMultiApproval) {
  return function (dispatch) {
    dispatch(initRequest(true));
    rsapi().post(inputParam.classUrl + "/" + inputParam.operation + inputParam.methodUrl, { ...inputParam.inputData })
        .then(response => {
            const retrievedData = sortData(response.data);
            masterData = {
                ...masterData,
                ...retrievedData
            }
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
            dispatch({
                type: DEFAULT_RETURN, 
                payload: { 
                    masterData,
                    inputParam,
                    modalName,
                    isFilterDetail:false,
                    openModal: false,
                    operation: inputParam.operation,
                    masterStatus: "",
                    loadEsign: false,
                    showEsign: false,
                    selectedRecord: {},
                    loading: false,
                    design: [],
                    openPortal: false
                } 
            });
        })
        
        //#SECURITY-VULNERABILITY-MERGING-START
        /*
      .catch(error => {
        if (error.response.status === 401 || error.response.status === 403) {
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
        // 417 Modified by Gowtham on 11 nov 2025
        } else if (error.response.status === 417) {
            dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
            toast.warn(intl.formatMessage({ id: error.response.data }));
            if (isMultiApproval === transactionStatus.NO) {
                // ConfirmMessage.confirm(
                //     "confirmationMessage",
                //     intl.formatMessage({ id: "IDS_INFOMATION" }),
                //     intl.formatMessage({ id: "IDS_RETIREEXISTINGCONFIGUARTION" }),
                //     intl.formatMessage({ id: "IDS_OK" }),
                //     intl.formatMessage({ id: "IDS_CANCEL" }),
                //     () => dispatch(crudMaster(inputParam, masterData, modalName))
                // );
                inputParam['inputData']['confirmation'] = true;
                dispatch(crudMaster(inputParam, masterData, modalName));
            }
            */
         
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
        } else if (error.response.status === 500) {
          toast.error(error.message);
        // 417 Modified by Gowtham on 11 nov 2025
        } else if (error.response?.status === 417) {
            inputParam['inputData']['confirmation'] = true;
            
                inputParam['inputData']['confirmation'] = true;
                dispatch(crudMaster(inputParam, masterData, modalName));
            }
        //#SECURITY-VULNERABILITY-MERGING-END      
        else {
            const selectedRecordObj = { selectedRecord: inputParam.selectedRecord }
            dispatch({
                type: DEFAULT_RETURN,
                payload: {
                    masterStatus: error.response.data,
                    errorCode: error.response.status,
                    loadEsign: false,
                    openModal: false,
                    loading: false,
                    openPortal: false,
                    ...selectedRecordObj
                }
            });
        }
    });
  }
}

export const buildLabelPaths = (tree) => {
    const result = [];

    const traverse = (nodes, pathSoFar = '', currentKey = null) => {
        for (let node of nodes) {
            // If parentKey matches, or it's root (no parentKey), then include in path
            const shouldJoin = !node.parentKey || node.parentKey === currentKey;
            const currentPath = shouldJoin
                ? pathSoFar
                    ? `${pathSoFar}/${node.key}`
                    : node.key
                : pathSoFar; // skip if parent doesn't match

            if (shouldJoin) result.push(currentPath);

            if (node.nodes && node.nodes.length > 0) {
                traverse(node.nodes, currentPath, node.primaryKey); // pass current node's primaryKey
            }
        }
    };

    traverse(tree);
    //return result;
    return result; // ⬅ reverse the result here
};