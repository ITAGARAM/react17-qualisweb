import rsapi from '../rsapi';
import Axios from 'axios';
import {
    toast
} from 'react-toastify';
import {
    getComboLabelValue
} from '../components/CommonScript'
import {
    DEFAULT_RETURN,
    UN_AUTHORIZED_ACCESS
} from './LoginTypes';
import { initRequest } from './LoginAction';
import { intl } from '../components/App';
import { transactionStatus } from './../components/Enumeration';


    export function openSampleTestCommentsModal(screenName, operation, primaryKeyName, masterData, userInfo, ncontrolcode) {
        return function (dispatch) {
            if (operation === "create" || operation === "update" ) {
                const CommentType = rsapi().post("/sampletestcomments/getCommentType", {
                    "userinfo": userInfo
                });
                const CommentSubType = rsapi().post("/sampletestcomments/getCommentSubType", {
                    "userinfo": userInfo
                });
                let urlArray = [];
                if (operation === "create") {
                   
                    urlArray = [CommentType,CommentSubType];
                } 
                dispatch(initRequest(true));
                Axios.all(urlArray)
                    .then(response => {
                          let selectedRecord = {};
                          let CommentSubType = response[1].data.CommentSubType;
                            // selectedRecord["nstatus"] = transactionStatus.ACTIVE;
                            // selectedRecord["ncommenttypevisible"] = 0;
                            // selectedRecord["ncommenttypecode"] = 0;
                            // // selectedRecord["ncommentsubtypecode"] = 0;
                            // selectedRecord["ndefaultstatus"] = 4;
                            selectedRecord = response[1].data.SelectedCommentSubType;
                            getComboLabelValue(selectedRecord, CommentSubType, "ncommentsubtypecode", "scommentsubtype");
                        dispatch({
                            type: DEFAULT_RETURN,
                            payload: {
                                CommentType: response[0].data.CommentType || [],
                                CommentSubType: response[1].data.CommentSubType || [],
                                operation,
                                screenName,
                                selectedRecord,
                                openModal: true,
                                ncontrolcode, loading: false,
                                isCommentSubType : response[1].data.SelectedCommentSubType.ncommentsubtypecode.value
                                // isCommentSubTypeTrue : response[1].data.SelectedCommentSubType.ncommentsubtypecode.value === 3
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
    }
    
    export function fetchSampleTestCommentsById (editParam){  
        return function(dispatch){
            const URL1= rsapi().post('/sampletestcomments/getCommentType',{"userinfo":editParam.userInfo});
            const URL2= rsapi().post('/sampletestcomments/getCommentSubType',{"userinfo":editParam.userInfo});
            const URL3=rsapi().post("/sampletestcomments/getActiveSampleTestCommentsById", { [editParam.primaryKeyName] :editParam.editRow.nsampletestcommentscode , "userinfo": editParam.userInfo} )
            dispatch(initRequest(true));
            Axios.all([URL1,URL2,URL3])
            .then(response=> { 
                let selectedRecord={}
                let selectedId = editParam.editRow.nsampletestcommentscode;
                selectedRecord=response[2].data;
                let CommentType = response[0].data.CommentType;
                let CommentSubType = response[1].data.CommentSubType;
               getComboLabelValue(selectedRecord, CommentType, "ncommenttypecode", "scommenttype");
               getComboLabelValue(selectedRecord, CommentSubType, "ncommentsubtypecode", "scommentsubtype");
                dispatch({
                    type: DEFAULT_RETURN, payload:{
                    selectedRecord ,
                    CommentType: response[0].data.CommentType || [],
                    CommentSubType: response[1].data.CommentSubType || [],
                    operation:editParam.operation,
                    openModal: true,
                    screenName:editParam.screenName,
                    ncontrolcode:editParam.ncontrolCode,
                    loading:false,selectedId
                }
                }); 
                
            })
            .catch(error => {
                dispatch({type: DEFAULT_RETURN, payload: {loading:false}})
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
        } else if (error.response.status === 500){
                    toast.error(error.message);
                } 
                else{               
                    toast.warn(error.response.data);
                }         
            })
        }
     }
