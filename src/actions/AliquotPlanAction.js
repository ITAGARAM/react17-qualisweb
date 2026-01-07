import rsapi from '../rsapi';
import {DEFAULT_RETURN,UN_AUTHORIZED_ACCESS} from './LoginTypes';
import {constructOptionList} from '../components/CommonScript'
import { toast } from 'react-toastify';
import Axios from 'axios';
import { initRequest } from './LoginAction';
import { intl } from '../components/App';
import { getComboLabelValue } from "../components/CommonScript";



export function getprojectytpe(addAliqutoplanId,userInfo) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("aliquotplan/getProjectType",{"addAliqutoplanId":addAliqutoplanId,userinfo: userInfo})
            .then(response => {
                const constructType = constructOptionList(response.data || [], "nprojectcode",
                "sprojecttypename", undefined, undefined, false);

                const projecttypeList = constructType.get("OptionList");
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        loading: false, openModal:true,
                        projecttypeList:projecttypeList,
                        processtypeList : [],
                        sampletypeList : [],
                        collectiontubeList : [],
                        patientcatgoryList: [],
                        visitnameList:[],
                        selectedRecord : {},
                        screenName:"IDS_ALIQUOTPLAN",
                        operation: "create"
                        
                    }
                });
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



export function getSampleTypeandPatientCatgeroy(sampletypevalue,sampletypename,userInfo) {
    return function (dispatch) {

        const getPatientCatgory = rsapi().post("aliquotplan/getPatientCatgory",{"sampletypevalue":sampletypevalue,"sampletypename":sampletypename,userinfo: userInfo});
        
        const getSampleType = rsapi().post("aliquotplan/getSampleType",{"sampletypevalue":sampletypevalue,"sampletypename":sampletypename,userinfo: userInfo});

        const collectiontubeList = rsapi().post("aliquotplan/getCollectionTubeType",{"sampletypevalue":sampletypevalue,"sampletypename":sampletypename,userinfo: userInfo});
                
        const getVisitName = rsapi().post("aliquotplan/getVisitName",{"sampletypevalue":sampletypevalue,"sampletypename":sampletypename,userinfo: userInfo});

        const getUnitList= rsapi().post("aliquotplan/getUnit",{"sampletypevalue":sampletypevalue,"sampletypename":sampletypename,userinfo: userInfo});

        // ALPD-5513 - added by Gowtham R on 10/3/25 - added sample donor field from sampledonor table
        const getSampleDonarList= rsapi().post("aliquotplan/getSampleDonor",{"sampletypevalue":sampletypevalue, userinfo: userInfo});


        let urlArray = [];
        urlArray = [getPatientCatgory,getSampleType,collectiontubeList,getVisitName,getUnitList,getSampleDonarList];

        dispatch(initRequest(true));
        Axios.all(urlArray)
            .then(response => {

                const patientcatgoryconstructType = constructOptionList(response[0].data || [], "npatientcode",
                "spatientcatname", undefined, undefined, false);

                const sampletypeconstructType = constructOptionList(response[1].data || [], "nproductsamplecode",
                "sproductname", undefined, undefined, false);

                const collectiontubeListconstruct = constructOptionList(response[2].data || [], "ncollectiontubecode",
                    "stubename", undefined, undefined, false);
    
                const VisitNameconstruct = constructOptionList(response[3].data || [], "nvisitcode",
                    "svisitnumber", undefined, undefined, false);

                const getUnitList = constructOptionList(response[4].data || [], "nunitbasiccode",
                        "sunitname", undefined, undefined, false);
                
                // ALPD-5513 - added by Gowtham R on 10/3/25 - added sample donor field from sampledonor table
                const getSampleDonarList = constructOptionList(response[5].data || [], "nsampledonorcode",
                    "ssampledonor", undefined, undefined, false);

                const patientcatgoryList = patientcatgoryconstructType.get("OptionList");
                const sampletypeList = sampletypeconstructType.get("OptionList");
                const collectiontubeListconstructList=collectiontubeListconstruct.get("OptionList");
                const visitnameList=VisitNameconstruct.get("OptionList");
                const unitList = getUnitList.get("OptionList");
                const sampledonarList = getSampleDonarList.get("OptionList");


                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        loading: false, openModal:true,
                        sampletypeList:sampletypeList,
                        patientcatgoryList:patientcatgoryList,
                        collectiontubeList:collectiontubeListconstructList,
                        visitnameList:visitnameList,
                        unitList:unitList,
                        sampledonarList:sampledonarList
                        
                    }
                });
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


// export function getCollectionTubeType(sampletypevalue,sampletypename,userInfo) {
//     return function (dispatch) {
//         dispatch(initRequest(true));
//         return rsapi().post("aliquotplan/getCollectionTubeType",{"sampletypevalue":sampletypevalue,"sampletypename":sampletypename,userinfo: userInfo})
//             .then(response => {
//                 const constructType = constructOptionList(response.data || [], "ncollectiontubecode",
//                 "stubename", undefined, undefined, false);

//                 const collectiontubeList = constructType.get("OptionList");
//                 dispatch({
//                     type: DEFAULT_RETURN, payload: {
//                         loading: false, openModal:true,
//                         collectiontubeList:collectiontubeList,
//                         patientcatgoryList: [],
//                         visitnameList:[]
                        
//                     }
//                 });
//             })
//             .catch(error => {
//                 dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
//                 if (error.response?.status === 429) {
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
//                     toast.error(error.message);
//                 }
//                 else {
//                     toast.warn(error.response.data);
//                 }

//             })
//     }  
// }

// export function getVisitName(sampletypevalue,sampletypename,userInfo) {
//     return function (dispatch) {
//         dispatch(initRequest(true));
        
//         return rsapi().post("aliquotplan/getVisitName",{"sampletypevalue":sampletypevalue,"sampletypename":sampletypename,userinfo: userInfo})
//         .then(response => {
//             const constructType = constructOptionList(response.data || [], "nvisitcode",
//             "svisitnumber", undefined, undefined, false);

//                 const visitnameList=constructType.get("OptionList");
//                 dispatch({
//                     type: DEFAULT_RETURN, payload: {
//                         loading: false, openModal:true,
//                         visitnameList:visitnameList
//                     }
//                 });
//             })
//             .catch(error => {
//                 dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
//                 if (error.response?.status === 429) {
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
//                     toast.error(error.message);
//                 }
//                 else {
//                     toast.warn(error.response.data);
//                 }

//             })
//     }  
// }


export function getUnit(sampletypevalue,sampletypename,userInfo) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("aliquotplan/getUnit",{"sampletypevalue":sampletypevalue,"sampletypename":sampletypename,userinfo: userInfo})
            .then(response => {
                const constructType = constructOptionList(response.data || [], "nunitbasiccode",
                "sunitname", undefined, undefined, false);

                const unitList = constructType.get("OptionList");
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        loading: false, openModal:true,
                        unitList:unitList
                        
                    }
                });
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


export function getActiveAliquotPlanById(editParam,userInfo) {
    return function (dispatch) {
        dispatch(initRequest(true));
        const ncontrolCode=editParam.ncontrolCode;

        const sampletypevalue=editParam.editRow.nprojectcode;

        const sampletypename=editParam.editRow.sprojecttypename;

        const userInfoPass=editParam.userInfo;

        const projectytpe = rsapi().post("aliquotplan/getProjectType",{"editAliquotplan":ncontrolCode,userinfo: userInfoPass});
        
        const sampletypeList = rsapi().post("aliquotplan/getSampleType",{"sampletypevalue":sampletypevalue,"sampletypename":sampletypename,userinfo: userInfoPass});

        const collectiontubeList = rsapi().post("aliquotplan/getCollectionTubeType",{"sampletypevalue":sampletypevalue,"sampletypename":sampletypename,userinfo: userInfoPass});
        
        const getPatientCatgory = rsapi().post("aliquotplan/getPatientCatgory",{"sampletypevalue":sampletypevalue,"sampletypename":sampletypename,userinfo: userInfoPass});
        
        const getVisitName = rsapi().post("aliquotplan/getVisitName",{"sampletypevalue":sampletypevalue,"sampletypename":sampletypename,userinfo: userInfoPass});

        const getUnitList = rsapi().post("aliquotplan/getUnit",{"sampletypevalue":sampletypevalue,"sampletypename":sampletypename,userinfo: userInfoPass});

        // ALPD-5513 - added by Gowtham R on 10/3/25 - added sample donor field from sampledonor table
        const getSampleDonarList= rsapi().post("aliquotplan/getSampleDonor",{"sampletypevalue":sampletypevalue, userinfo: userInfoPass});
        
        const getActiveAliquotplanById = rsapi().post("aliquotplan/getActiveAliquotPlanById",
        {naliquotplancode:editParam.editRow.naliquotplancode,userinfo: userInfoPass});

        let urlArray = [];
        urlArray = [getActiveAliquotplanById,projectytpe, sampletypeList, collectiontubeList, getPatientCatgory,getVisitName,getUnitList,getSampleDonarList];

        dispatch(initRequest(true));
        Axios.all(urlArray)
            .then(response => {

                const selectedRecord =response[0].data; 

                const projectytpeconstruct = constructOptionList(response[1].data || [], "nprojectcode",
                "sprojecttypename", undefined, undefined, false);

                const sampletypeListconstruct = constructOptionList(response[2].data || [], "nproductsamplecode",
                "sproductname", undefined, undefined, false);

                const collectiontubeListconstruct = constructOptionList(response[3].data || [], "ncollectiontubecode",
                "stubename", undefined, undefined, false);

                const patientcatgoryconstruct = constructOptionList(response[4].data || [], "npatientcode",
                "spatientcatname", undefined, undefined, false);

                const VisitNameconstruct = constructOptionList(response[5].data || [], "nvisitcode",
                "svisitnumber", undefined, undefined, false);

                const Unitconstruct = constructOptionList(response[6].data|| [], "nunitbasiccode",
                "sunitname", undefined, undefined, false);

                // ALPD-5513 - added by Gowtham R on 10/3/25 - added sample donor field from sampledonor table
                const SampleDonarconstruct = constructOptionList(response[7].data || [], "nsampledonorcode",
                "ssampledonor", undefined, undefined, false);

                selectedRecord["sprojecttypename"] = getComboLabelValue(response[0].data,response[1].data, 
                "nprojectcode", "sprojecttypename");  
                    
                selectedRecord["sproductname"] = getComboLabelValue(response[0].data,response[2].data, 
                "nproductsamplecode", "sproductname");

                selectedRecord["stubename"] = getComboLabelValue(response[0].data,response[3].data, 
                "ncollectiontubecode", "stubename");

                selectedRecord["spatientcatname"] = getComboLabelValue(response[0].data,response[4].data, 
                "npatientcode", "spatientcatname");

                selectedRecord["svisitnumber"] = getComboLabelValue(response[0].data,response[5].data, 
                "nvisitcode", "svisitnumber");

                selectedRecord["sunitname"] = getComboLabelValue(response[0].data,response[6].data, 
                "nunitbasiccode", "sunitname");

                // ALPD-5513 - added by Gowtham R on 10/3/25 - added sample donor field from sampledonor table
                selectedRecord["ssampledonor"] = getComboLabelValue(response[0].data,response[7].data, 
                "nsampledonorcode", "ssampledonor");
         
                selectedRecord["saliquotno"]=response[0].data.saliquotno;

                selectedRecord["squantity"]=response[0].data.squantity;

                selectedRecord["sdescription"]=response[0].data.sdescription;

                //selectedRecord["spatientcatname"]=response[0].data.spatientcatname.label;

                const projectytpeconstructList=projectytpeconstruct.get("OptionList");
                const sampletypeListconstructList=sampletypeListconstruct.get("OptionList");
                const collectiontubeListconstructList=collectiontubeListconstruct.get("OptionList");
                const patientcatgoryList = patientcatgoryconstruct.get("OptionList");
                const visitnameList=VisitNameconstruct.get("OptionList");
                const unitList=Unitconstruct.get("OptionList");
                // ALPD-5513 - added by Gowtham R on 10/3/25 - added sample donor field from sampledonor table
                const SampleDonarList=SampleDonarconstruct.get("OptionList");

                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        loading: false, openModal:true, 
                        projecttypeList:projectytpeconstructList,
                        sampletypeList:sampletypeListconstructList,
                        collectiontubeList:collectiontubeListconstructList,
                        patientcatgoryList:patientcatgoryList,
                        visitnameList:visitnameList,
                        unitList:unitList,
                        sampledonarList:SampleDonarList,
                        selectedRecord:selectedRecord,
                        selectedId:editParam.editRow.naliquotplancode,
                        ncontrolCode: editParam.ncontrolCode,
                        screenName:"IDS_ALIQUOTPLAN",
                        operation:"update"
                    }
                });
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
