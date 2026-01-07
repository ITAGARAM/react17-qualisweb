import rsapi from '../rsapi';
import {DEFAULT_RETURN,UN_AUTHORIZED_ACCESS} from './LoginTypes';
import { toast } from 'react-toastify';
import {  sortData } from '../components/CommonScript';
import { intl } from '../components/App';

export function formSortingService1(methodParam){
    return function (dispatch) {  
    return rsapi().post(methodParam.url, methodParam.inputData)
    .then(response=>{     
                let nFlag = 1;
                const masterData = {
                    ...response.data, nFlag};
                sortData(masterData,'ascending','nsorter');  

                dispatch({type: DEFAULT_RETURN, payload:{   masterData,
                                                            formsorting :methodParam.formsorting,
                                                            loading:false
                                                        }});                
        })
        .catch(error=>{
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

export function moduleSortingOrder1(methodParam){
    return function (dispatch) {
        return rsapi().post(methodParam.url, methodParam.inputData)
        .then(response=>{     
                let nFlag = 1;
                const masterData = {
                    ...response.data, nFlag};
                sortData(masterData,'ascending','nsorter');  

                dispatch({type: DEFAULT_RETURN, payload:{   masterData,
                                                            modulesorting :methodParam.modulesorting,
                                                            loading:false
                                                        }});                
        })
        .catch(error=>{
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

export function formModuleGetSorting(methodParam){
    return function (dispatch) {  
    return rsapi().post(methodParam.url, methodParam.inputData)
    .then(response=>{   
        let nFlag = 0;  
                const masterData = {
                    ...response.data, nFlag};

                dispatch({type: DEFAULT_RETURN, payload:{   masterData,
                                                            formsorting :methodParam.formsorting,
                                                            loading:false
                                                        }});                
        })
        .catch(error=>{
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

