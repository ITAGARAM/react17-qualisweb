
import rsapi from '../rsapi';
import {DEFAULT_RETURN,UN_AUTHORIZED_ACCESS} from './LoginTypes';
import {constructOptionList} from '../components/CommonScript'
import { toast } from 'react-toastify';
import { initRequest } from './LoginAction';
import { intl } from '../components/App';

export function addSiteAndBioBank(siteRecord,userInfo,ncontrolCode) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("sitehospitalmapping/editSiteAndBioBank",{"siteRecord":siteRecord,userinfo: userInfo})
           .then(response => {

                const constructType = constructOptionList(response.data['BioBanktype'] || [], "nsitetypecode",
                "ssitetypename", undefined, undefined, false);

                const bioBankList = constructType.get("OptionList");
                
                const selectedRecord =response.data['siteConfig']; 
                if(response.data['siteConfig'].ssitetypename!==null){
                selectedRecord['sbiobanktypename']={};
                selectedRecord['sbiobanktypename']['label']=response.data['siteConfig'].ssitetypename; 
                selectedRecord['sbiobanktypename']['value']=response.data['siteConfig'].nsitetypecode; 
                }
   
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        loading: false,
                        bioBankList:bioBankList,
                        selectedRecord:selectedRecord,
                        loadSiteBioBankConfig:true,
                        openChildModal:true,
                        loadhospitalcombo:false,
                        ncontrolcode:ncontrolCode,
                        operation:""
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


export function addHospitalMaster(userInfo,mastersiteData,ncontrolcode) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("sitehospitalmapping/getHospitalMaster",{nmappingsitecode:mastersiteData.nmappingsitecode,userinfo:userInfo})
           .then(response => {

                const constructType = constructOptionList(response.data || [], "nhospitalcode",
                "shospitalname", undefined, undefined, false);

                const hospitalList = constructType.get("OptionList");
                   
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        loading: false,
                        hospitalList:hospitalList,
                        loadSiteBioBankConfig:true,
                        openChildModal:true,
                        loadhospitalcombo:true,
                        loadEsign:false,
                        operation:'',
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



export function getSiteHospitalMappingRecord(selectedsiteData,userInfo,masterData) {
    return function (dispatch) {
        dispatch(initRequest(true));
		// modified by sujatha primary key passed as number type instead of string 
        return rsapi().post("sitehospitalmapping/getSiteHospitalMappingRecord",{nmappingsitecode:Number(selectedsiteData.nmappingsitecode),userinfo:userInfo})
           .then(response => {

                    let selectedRecord=response.data.selectedsiteMasterRecord;
                    let lsthospitalQuery=response.data.lsthospitalQuery;
                    let masterDatadetails={...masterData};
                    masterDatadetails['selectedsiteMasterRecord']=selectedRecord;
                    masterDatadetails['lsthospitalQuery']=lsthospitalQuery;

                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        loading: false, openChildModal:false,
                        loadSiteBioBankConfig:false,
                        loadhospitalcombo:false,
                        issitehospitalrecord:false,
                        masterData:masterDatadetails,
                        issitehospitalrecord:true
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
