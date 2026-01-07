import rsapi from '../rsapi';
import { DEFAULT_RETURN,REQUEST_FAILURE,UN_AUTHORIZED_ACCESS } from './LoginTypes';
import { sortData } from '../components/CommonScript';
import { initRequest } from './LoginAction';
import { toast } from 'react-toastify';
import { intl } from '../components/App';


export function sendRequest(obj) {
    return function (dispatch) {
        dispatch(initRequest(true));
        const newMap={...obj.inputData}
        const masterData=obj.masterData
        const selectedRecord=obj.selectedRecord
        const query = obj.sqlquery
        rsapi().post(obj.url, {...newMap , userinfo: obj.userinfo ,query , whereCondition: newMap.whereCondition,parameters:obj.parameters} )
            .then(response => {
                masterData['consoleData']=response.data
                newMap['whereCondition']=obj.inputData.whereCondition
                // selectedRecord['filterNew']
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData:{...masterData,selectedRecord,newMap}, loading: false
                        
                    }
                });
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
                } else {
                    dispatch({ type: DEFAULT_RETURN,payload: { loading: false }})
                }
            })
    }
}

export function getQualisForms(obj) {
    return function (dispatch) {     
        dispatch(initRequest(true));
       const userinfo=obj.userinfo
       let selectedRecord=obj.selectedRecord
       selectedRecord={...selectedRecord,"ParamValue":""}
    let Parameters=obj.Parameters
       let constructApiData = obj.constructApiData
       let masterData=obj.masterData
        rsapi().post('/apiservice/getQualisForms', {'userinfo':userinfo,'napiservicecode':selectedRecord.napiservicecode.value} )
            .then(response => {
                masterData={...masterData,
                    ...response.data,
                    // lstquerybilderColumns: response.data.lstquerybilderColumns.map((item, index) => {
                    //         return { label: item.scolumndisplayname, value: index, item: { ...item } }})
                }
                masterData['SelectedApi']=selectedRecord['napiservicecode']
                if(selectedRecord['napiservicecode'].value < 3){   
                    constructApiData = obj.constructApiData
                }
                else{
                    constructApiData = []
                }
             
                if(!response.data.needdisplayparam){
                    Parameters=undefined
                }
                
                masterData['consoleData']=[]
                masterData={...masterData,Parameters}
                selectedRecord['filterNew']=[]
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData:{...masterData},
                        loading: false,
                        selectedRecord,
                        userinfo,
                        //constructApiData:[]
                        constructApiData
                        
                       
                    }
                });
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
                } else {
                    dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                }
            })
    }
}

export function getQualisFormsFields(obj) {
    return function (dispatch) {
        dispatch(initRequest(true));
       const userinfo=obj.userinfo
       let selectedRecord={...obj.selectedRecord,'filterNew':[]}
       selectedRecord={...selectedRecord,"ParamValue":""}

       let masterData={...obj.masterData}
        rsapi().post('/apiservice/getQualisFormFields', {'userinfo':userinfo,'nformcode':selectedRecord.nformcode.value} )
            .then(response => {
                masterData={...masterData,'lstquerybilderColumns':response.data,
                'SelectedForm':{...selectedRecord['nformcode']},'consoleData':[]}
                selectedRecord['filterNew']=[]
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData:{...masterData} ,
                        loading: false,
                        selectedRecord
                    }
                });
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
                } else {
                    dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                }
            })
    }
}

export function getCustomQuery(obj) {
    return function (dispatch) {     
        dispatch(initRequest(true));
       const userinfo=obj.userinfo
       let selectedRecord=obj.selectedRecord
        selectedRecord={...selectedRecord,"ParamValue":""}
       let constructApiData = obj.constructApiData
       let masterData=obj.masterData
        rsapi().post('/apiservice/getCustomQuery', {'userinfo':userinfo,'napiservicecode':selectedRecord.napiservicecode.value} )
            .then(response => {
                masterData={...masterData,
                    ...response.data,
                }
                masterData['SelectedApi']=selectedRecord['napiservicecode']
                masterData['SelectedSQLQuery'] = response.data.SelectedSQLQuery
                masterData['Columns']=response.data.Columns
                masterData['Parameters']=response.data.Parameters
                constructApiData = obj.constructApiData
                masterData['consoleData']=[]
                selectedRecord['filterNew']=[]
				//ALPD-3801
                selectedRecord["nsqlquerycode"]={"item":response.data.SelectedSQLQuery.item,
                "label":response.data.SelectedSQLQuery.label,
                "value":response.data.SelectedSQLQuery.value
               }
               masterData['needdisplayparam']=response.data.needdisplayparam
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData:{...masterData},
                        loading: false,
                        selectedRecord,
                        userinfo,
                        constructApiData
                    }
                });
            })
            .catch(error => {
              //  console.log("error:", error);
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
                }
            })
    }
}
export function getCustomQueryName(obj) {
    return function (dispatch) {
        dispatch(initRequest(true));
       const userinfo=obj.userinfo
        //ALPD-3801
       let selectedRecord={...obj.selectedRecord,"ParamValue":""}
       let masterData={...obj.masterData}
        rsapi().post('/apiservice/getCustomQueryName', {'userinfo':userinfo,'nsqlquerycode':selectedRecord.nsqlquerycode.value} )
            .then(response => {
                masterData={...masterData}
                masterData['SelectedSQLQuery'] = response.data.SelectedSQLQuery
				//ALPD-3801
                masterData['Parameters'] = response.data.Parameters
                masterData['needdisplayparam'] = response.data.needdisplayparam
                masterData['Columns']=response.data.Columns
                masterData['consoleData']=[]
                selectedRecord['filterNew']=[]
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData:{...masterData} ,
                        loading: false,
                        selectedRecord
                    }
                });
            })
            .catch(error => {
                //console.log("error:", error);
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
                }            
            })
    }
}



