import rsapi from "../rsapi";
import { toast } from "react-toastify";
import { DEFAULT_RETURN, UN_AUTHORIZED_ACCESS } from "./LoginTypes";
import Axios from "axios";
import { initRequest, updateStore } from "./LoginAction";
import { transactionStatus } from "../components/Enumeration";
import { constructOptionList, showEsign } from "../components/CommonScript";
import { crudMaster } from './ServiceAction'
import { intl } from "../components/App";

export function getCommentsCombo(inputParam) {
    return (dispatch) => {
        if (inputParam.masterList && inputParam.masterList.length > 0) {
            dispatch(initRequest(true));
            let urlArray = [rsapi().post("/sampletestcomments/getSampleTestComments", { userinfo: inputParam.userInfo })];
            urlArray.push(
                rsapi().post("/comments/getCommentSubType", {
                    userinfo: inputParam.userInfo, ncommentsubtypecode: inputParam.editRow && inputParam.editRow.jsondata && inputParam.editRow.jsondata.ncommentsubtypecode && inputParam.editRow.jsondata.ncommentsubtypecode.value
                })) 
                // if(inputParam.isSampleTestComment&&inputParam.isSampleTestComment===true) 
                // {
                //  urlArray.push(
                //      rsapi().post("/comments/getSampleTestCommentsListById", {
                //          ncommentsubtypecode:inputParam.ncommentsubtypecode,
                //          userinfo: inputParam.userInfo
                //      }))
                // }     
            if (inputParam.operation === "update") {
                urlArray.push(rsapi().post("/comments/getEdit".concat(inputParam.methodUrl), { userinfo: inputParam.userInfo, selectedrecord: inputParam.editRow }))
            }
            Axios.all(urlArray)
                .then(response => {
                    let predefcomments;
                    let sampleTestComments = response[0].data;
                    let CommentSubType = response[1].data['CommentSubType']; 
                    let isAbbrevationneeded;
                    let selectedId = null;

                    let selectedRecord = {};
                    const defaultLink = sampleTestComments.filter(item => item.ndefaultstatus === transactionStatus.YES);
                    const sampleTestCommentsMap  = constructOptionList(sampleTestComments || [], "nsampletestcommentcode","ssampletestcommentname" , undefined, undefined, true);
                    const CommentSubTypesMap  = constructOptionList(CommentSubType || [], "ncommentsubtypecode","scommentsubtype" , undefined, undefined, false);
                    sampleTestComments = sampleTestCommentsMap.get("OptionList");
                    CommentSubType = CommentSubTypesMap.get("OptionList");
                    // ALPD-4948 Commented because NA value for comment sub type and predefined comments not showing. Instead of showing '-' in jsondata
                    // if(inputParam.isSampleTestComment&&inputParam.isSampleTestComment===true)
                    // {
                         predefcomments = response[1].data['SampleTestComments']; 

                        const predefcommentssMap  = constructOptionList(predefcomments || [], "nsampletestcommentscode","spredefinedname" , undefined, undefined, false);
                    
                        predefcomments = predefcommentssMap.get("OptionList"); 
                        if(CommentSubType[0].value===3)
                        {
                            isAbbrevationneeded=true
                        }

                        selectedRecord={...inputParam.selectedRecord,ncommentsubtypecode:CommentSubType[0],
                            nsampletestcommentscode:predefcomments[0]&&predefcomments[0],spredefinedname:predefcomments[0]&&predefcomments[0].label
                            ,scomments:predefcomments[0]&&predefcomments[0].item.sdescription} 
                    // } 
               

                    let editObject = {};
                    if (inputParam.operation === "update") {
                        editObject =  response[2].data;
                        let nsamplecommentscode = {};
                        nsamplecommentscode = { "label": editObject.ssampletestcommentname, "value": editObject.nsamplecommentscode }
                        selectedRecord = {
                            ...editObject, nsamplecommentscode,scomments :editObject.jsondata.scomments,  
                            scommentsubtype:editObject.jsondata.scommentsubtype&&editObject.jsondata.scommentsubtype ,
                            spredefinedname:editObject.jsondata.spredefinedname&&editObject.jsondata.spredefinedname ,
                           // scomments: editObject.jsondata.sdescription&&editObject.jsondata.sdescription, 
                             ncommentsubtypecode:editObject.jsondata.ncommentsubtypecode&&editObject.jsondata.ncommentsubtypecode,
                             nsampletestcommentscode:editObject.jsondata.nsampletestcommentscode&&editObject.jsondata.nsampletestcommentscode
                        };
                        selectedId = inputParam.screenName === "IDS_TESTCOMMENTS" ? inputParam.editRow.ntestcommentcode : inputParam.screenName === "IDS_SUBSAMPLECOMMENTS" ? inputParam.editRow.nsamplecommentcode : inputParam.screenName === "IDS_SAMPLECOMMENTS" ? inputParam.editRow.nregcommentcode : null;
                    } else {
                        selectedRecord = {...selectedRecord,
                            nsamplecommentscode: defaultLink.length > 0 ? { "label": defaultLink[0].ssampletestcommentname, "value": defaultLink[0].nsampletestcommentcode } : "",

                        };
                    }
                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {
                            [inputParam.modalName]: true,
                            operation: inputParam.operation,
                            screenName: inputParam.screenName,
                            ncontrolCode: inputParam.ncontrolCode,
                            selectedRecord, loading: false,
                            sampleTestComments,
                            predefcomments,
                            CommentSubType,
                            isAbbrevationneeded,
                            modalType: 'comment',
                            modalName: [inputParam.modalName],
                            editObject,
                            selectedId
                          //  isSampleTestComment:inputParam.isSampleTestComment
                        }
                    });
                })
                .catch(error => {
                    dispatch({ type: DEFAULT_RETURN, payload: { loading: false } });
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
        } else {
            toast.warn(intl.formatMessage({ id: inputParam.masterAlertStatus }));
        }

    }
}

export function deleteComment(deleteParam) {
    return (dispatch) => {
        const methodUrl = deleteParam.methodUrl;
        const selected = deleteParam.selectedRecord;
const Map={}
Map["sprimarykey"]=deleteParam.screenName==="IDS_SAMPLECOMMENTS"?
"nregcommentcode":deleteParam.screenName==="IDS_SUBSAMPLECOMMENTS"?"nsamplecommentcode":"ntestcommentcode";
Map["nprimarykey"]=deleteParam.screenName==="IDS_SAMPLECOMMENTS"?selected.nregcommentcode:deleteParam.screenName==="IDS_SUBSAMPLECOMMENTS"?
selected.nsamplecommentcode:selected.ntestcommentcode;


        const inputParam = {
            inputData: {
                [methodUrl.toLowerCase()]: {[Map.sprimarykey]:Map.nprimarykey},
                npreregno: deleteParam.npreregno,
                ntransactiontestcode: deleteParam.ntransactiontestcode,
                ntransactionsamplecode: deleteParam.ntransactionsamplecode,
                userinfo: deleteParam.userInfo
            },
            classUrl: "comments",
            operation: 'delete',
            methodUrl: methodUrl,
            screenName: deleteParam.screenName
        }
        const masterData = deleteParam.masterData;
        if (showEsign(deleteParam.esignRights, deleteParam.userInfo.nformcode, deleteParam.ncontrolCode)) {
            // dispatch({
            //     type: DEFAULT_RETURN,
            //     payload: {
            //         loadEsign: true,
            //         screenData: { inputParam, masterData },
            //         openCommentModal: true,
            //         screenName: deleteParam.screenName,
            //         operation: 'delete',
            //         selectedRecord: {}
            //     }
            // });
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {   
                    loadEsign: true,
                    screenData: { inputParam, masterData },
                    openCommentModal: true,
                    screenName: deleteParam.screenName,
                    operation: 'delete',
                    selectedRecord: {},
                    selectedId: null}
            }
            dispatch(updateStore(updateInfo));
        } else {
            dispatch(crudMaster(inputParam, masterData, "openCommentModal", {}));
        }
    }
}
export function getSampleTestComments(selectedRecord, userInfo) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("/comments/getSampleTestCommentsListById",
            {
                userinfo:userInfo,
                ncommentsubtypecode:selectedRecord['ncommentsubtypecode'].value
            })
            .then(response => { 
                let predefcomments;
                let isAbbrevationneeded;
                predefcomments = response.data['SampleTestComments']; 
                const predefcommentssMap  = constructOptionList(predefcomments || [], "nsampletestcommentscode","spredefinedname" , undefined, undefined, false);
                if(selectedRecord['ncommentsubtypecode'].value===3)
                { 
                    // const predefcommentssMap  = constructOptionList(predefcomments || [], "nsampletestcommentscode","spredefinedname" , undefined, undefined, false);
                    isAbbrevationneeded=true
                    predefcomments = predefcommentssMap.get("OptionList"); 
                    selectedRecord={ ...selectedRecord,
                        nsampletestcommentscode:predefcomments[0]&&predefcomments[0],scomments:predefcomments[0]&&predefcomments[0].item && predefcomments[0].item.sdescription}
                }else{
                    // selectedRecord['nsampletestcommentscode']&&delete selectedRecord['nsampletestcommentscode']
                    // ALPD-4948    Modified code by Vishakh for showing commentsubtype field as 'NA' instead of showing '-'
                    const SampleTestComments = predefcommentssMap.get("OptionList"); 
                    selectedRecord['nsampletestcommentscode'] = SampleTestComments && SampleTestComments.length && SampleTestComments[0]
                    selectedRecord={ ...selectedRecord,scomments:predefcomments[0]&&predefcomments[0].sdescription}
                } 
              
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: { 
                        selectedRecord,
                        predefcomments,
                        isAbbrevationneeded,
                        loading: false

                    }
                });
            })
            .catch(error => {
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
            });
    }
}


export function getSampleTestCommentsDesc(selectedRecord, userInfo) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("/comments/getSampleTestCommentsDescById",
            {
                userinfo:userInfo,
                ncommentsubtypecode:selectedRecord['ncommentsubtypecode'].value,
                spredefinedname:selectedRecord['nsampletestcommentscode'].label
            })
            .then(response => { 
                let predefcomments;
                predefcomments = response.data['SampleTestComments']; 
                selectedRecord={ ...selectedRecord,scomments:predefcomments[0]&&predefcomments[0].sdescription}
              
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: { 
                        selectedRecord,
                        loading: false

                    }
                });
            })
            .catch(error => {
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
            });
    }
}