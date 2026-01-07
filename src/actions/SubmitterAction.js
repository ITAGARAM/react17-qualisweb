import { initRequest } from "./LoginAction";
import rsapi from "../rsapi";
import { sortData,getComboLabelValue } from "../components/CommonScript";
import { DEFAULT_RETURN, UN_AUTHORIZED_ACCESS } from "./LoginTypes";
import { toast } from 'react-toastify';
import Axios from "axios";
import { constructOptionList } from "../components/CommonScript";
import { intl} from '../components/App';
import { transactionStatus } from "../components/Enumeration";

export function getSubmitterDetail (submitter, userInfo, masterData) {
    return function (dispatch) {   
    dispatch(initRequest(true));
    return rsapi().post("submitter/getSelectedSubmitterDetail", {ssubmittercode:submitter.ssubmittercode, userinfo:userInfo})
   .then(response=>{     
        masterData = {...masterData, ...response.data};       
        sortData(masterData);
        dispatch({type: DEFAULT_RETURN, payload:{masterData, operation:null, modalName:undefined, 
             loading:false}});   
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
}}  

export function getSubmitterCombo(screenName, operation, primaryKeyName, masterData, userInfo, ncontrolCode) {
    return function (dispatch) {
        if(masterData.selectedInstitutionCategory!==null){
            if(masterData.selectedInstitution!==null){
                if(masterData.selectedInstitutionSite!==null){
                    let urlArray = [];
                    const InstitutionDepartment = rsapi().post("/submitter/getInstitutionDepartment", {"userinfo": userInfo});
                    if (operation === "create") {
                        urlArray = [InstitutionDepartment];

                    } else {
                        const Submitter = rsapi().post("/submitter/getActiveSubmitterById", {
                                          [primaryKeyName]: masterData.selectedSubmitter[primaryKeyName],
                                          "userinfo": userInfo
                        });
                        urlArray = [InstitutionDepartment,Submitter];
                    }
                    dispatch(initRequest(true));
                    Axios.all(urlArray)
                    .then(response => {
                        let selectedRecord ={};
                        const institutionDepartmentMap = constructOptionList(response[0].data.InstitutionDepartment || [], "ninstitutiondeptcode",
                             "sinstitutiondeptname", undefined, undefined, false);        

                        const InstitutionDepartment = institutionDepartmentMap.get("OptionList");              
                        selectedRecord["ntransactionstatus"]  = transactionStatus.ACTIVE;

                 
                        if (operation === "update") {
                            selectedRecord = response[1].data;
                            selectedRecord["ninstitutiondeptcode"] = getComboLabelValue(selectedRecord, response[0].data.InstitutionDepartment, 
                                "ninstitutiondeptcode", "sinstitutiondeptname");      
                        }

                        dispatch({
                            type: DEFAULT_RETURN,
                            payload: {
                                InstitutionDepartment,                       
                                isOpen: true,
                                masterData:masterData,
                                selectedRecord,
                                operation: operation,
                                screenName: screenName,
                                openModal: true,
                                ncontrolCode: ncontrolCode,
                                loading: false,
                       
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
                            toast.error(intl.formatMessage({ id: error.message  }));
                        } else {
                        toast.warn(intl.formatMessage({id: error.response.data }));
                        }
                    })

                }else{
                    toast.warn(intl.formatMessage({ id: "IDS_CONFIGINSTITUTIONSITE" }));
                }
            }else{
                toast.warn(intl.formatMessage({ id: "IDS_CONFIGINSTITUTION" }));
            }
        }else{
            toast.warn(intl.formatMessage({ id: "IDS_CONFIGINSTITUTIONCATEGORY" }));
        }
    }

}
export function getInstitution(inputData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("submitter/getInstitutionByCategory", inputData)
            .then(response => {
                let responseData = { ...response.data }
                responseData = sortData(responseData)
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData: {
                            ...inputData.masterData,
                            ...responseData,
                            defaultInstitutionCategory: inputData.defaultInstitutionCategory,
                        },
                        loading: false
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
}

export function getInstitutionSite(inputData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("submitter/getInstitutionSiteByInstitution", inputData)
            .then(response => {
                let responseData = { ...response.data }
                responseData = sortData(responseData)
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData: {
                            ...inputData.masterData,
                            ...responseData,
                            defaultInstitution: inputData.defaultInstitution,
                        },
                        loading: false
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
}


export const changeInstitutionCategoryFilterSubmit = (inputParam,FilterInstitutionCategory,defaultInstitutionCategory,FilterInstitution,defaultInstitution,FilterInstitutionSite,defaultInstitutionSite) => {
    return (dispatch) => {
        dispatch(initRequest(true));
        rsapi().post("/submitter/get" + inputParam.methodUrl, inputParam.inputData)
            .then(response => {
                const masterData = response.data
                sortData(masterData);
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false,
                        masterData: {
                            ...masterData,
                            FilterInstitutionCategory,
                            defaultInstitutionCategory,
                            selectedInstitutionCategory:defaultInstitutionCategory,
                            FilterInstitution,
                            defaultInstitution,
                            selectedInstitution:defaultInstitution,
                            FilterInstitutionSite,
                            defaultInstitutionSite,
                            selectedInstitutionSite:defaultInstitutionSite

                        }
                    }
                });
            })
            .catch(error => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false
                    }
                });
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

export function updateSubmitter (inputParam,masterDataInput){
    return (dispatch) => {
        dispatch(initRequest(true));
        rsapi().post("/submitter/update" + inputParam.methodUrl, {...inputParam.inputData})
        .then(response => {

            
            masterDataInput && masterDataInput["Submitter"].map((oldmasterData,index)=>{
              if(oldmasterData.ssubmitterid === response.data.selectedSubmitter.ssubmitterid){
                masterDataInput["Submitter"].splice(index, 1, response.data.selectedSubmitter)
              }
            })

            const masterData = {...masterDataInput,...response.data}
            sortData(masterData);
            dispatch({
                type: DEFAULT_RETURN,
                payload: {
                    loading: false,
                    masterData: {
                        ...masterData,
                    },selectedRecord:undefined,
                    openModal:false
                }
            });
        })
        .catch(error => {
            dispatch({
                type: DEFAULT_RETURN,
                payload: {
                    loading: false
                }
            });
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
            } else if (error.response.status === 417) {
                toast.warn(error.response.data)
            } else {
                toast.error(error.message)
            }
        });


    }
}



export const getInstitutionCategory = (instItem, url, key, screenName, userInfo, ncontrolCode, selectedRecord,masterData) => {
    return function (dispatch) {
        dispatch(initRequest(true));
        let url = ''
        const  FilterInstitution=[];
        const FilterInstitutionSite=[];
        url = "/submitter/getSubmitterInstitutionCategoryCombo";

        return rsapi().post(url, {
                "userinfo": userInfo,
                "ssubmittercode":instItem.ssubmittercode
            })
            .then(response => {

            const institutionCategoryMap = constructOptionList(response.data.FilterInstitutionCategory || [], "ninstitutioncatcode",
                    "sinstitutioncatname", undefined, undefined, false);
           
                const institutionCategory= institutionCategoryMap.get("OptionList");
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {

                        
                        institutionCategory,
                        FilterInstitution,
                        FilterInstitutionSite:[],
                        //Users,
                        isOpen: true,
                        selectedRecord,
                        operation: "create",
                        screenName: screenName,
                        // openModal: true,
                        openModal: true,
                        ncontrolCode: ncontrolCode,
                        instItem: instItem,
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
                });
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
                } else if (error.response.status === 417) {
                    toast.info(error.response.data)
                } else {
                    toast.error(error.message)
                }
            });
    }
}


export function getSubmitterInstitution(ninstitutioncatcode,userInfo, selectedRecord, screenName) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("submitter/getSubmitterInstitutionCombo", {
                "ninstitutioncatcode": ninstitutioncatcode,userinfo: userInfo,nflag:0})
            .then(response => {
         

                const FilterInstitutionMap = constructOptionList(response.data.FilterInstitution || [], "ninstitutioncode",
                "sinstitutionname", undefined, undefined, false);
       
            const FilterInstitution= FilterInstitutionMap.get("OptionList");

                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        selectedSupplierCategory:undefined,selectedInstitutionSite:undefined,
                        FilterInstitution,
                        FilterInstitutionSite:undefined,
                        selectedRecord,
                        loading: false

                    }
                });

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



export function getSubmitterSite(ninstitutioncode,selectedSubmitter,userInfo, selectedRecord, screenName) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("submitter/getSubmitterInstitutionSiteCombo", {
                "ninstitutioncode": ninstitutioncode,ssubmittercode:selectedSubmitter.ssubmittercode,userinfo: userInfo,nflag:0})
            .then(response => {
         

                const FilterInstitutionSiteMap = constructOptionList(response.data.FilterInstitutionSite || [], "ninstitutionsitecode",
                "sinstitutionsitename", undefined, undefined, false);
       
            const FilterInstitutionSite= FilterInstitutionSiteMap.get("OptionList");

                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        FilterInstitutionSite,
                        selectedRecord,
                        loading: false

                    }
                });

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