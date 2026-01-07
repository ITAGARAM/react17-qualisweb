import rsapi from '../rsapi';
import {DEFAULT_RETURN,UN_AUTHORIZED_ACCESS} from './LoginTypes';
import {constructOptionList} from '../components/CommonScript'
import { toast } from 'react-toastify';
import Axios from 'axios';
import { initRequest } from './LoginAction';
//import { intl } from '../components/App';
import { getComboLabelValue } from "../components/CommonScript";
import { intl } from '../components/App';
 
export function plantgroupsite(nformcode,userInfo) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("plantgroup/getPlantGroupSite",{"nformcode":nformcode,userinfo: userInfo})
            .then(response => {
                const constructType = constructOptionList(response.data || [], "nsitecode",
                "ssitecode", undefined, undefined, false);

                const fustionsite = constructType.get("OptionList");
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        loading: false, openModal:true,
                        fusionplantSite:fustionsite,
                        screenName:"IDS_FUSIONPLANT",
                        operation: "create"

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



export function plantgroupdepartment(nsitecode,userInfo) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("plantgroup/getPlantGroupDepartment",{"nsitecode":nsitecode,userinfo: userInfo})
            .then(response => {
                const constructType = constructOptionList(response.data || [], "nplantcode",
                "splantshortdesc", undefined, undefined, false);

                const fusionplant = constructType.get("OptionList");
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        loading: false, openModal:true,
                        fusionparentplants:fusionplant,
                        screenName:"IDS_FUSIONPLANT"
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



export function fusionplantchild(ssitecode,splantparentcode,userInfo) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("plantgroup/getPlantGroupDepartmentchild",{"ssitecode":ssitecode,"splantparentcode":splantparentcode,update:0,userinfo: userInfo})
            .then(response => {
                const constructType = constructOptionList(response.data || [], "nplantcode",
                "splantshortdesc", undefined, undefined, false);

                const fusionplant = constructType.get("OptionList");
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        loading: false, openModal:true,
                        fusionchildplants:fusionplant,
                        screenName:"IDS_FUSIONPLANT",
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



export function getActivePlantGroupById(editplantgroupId,userInfo) {
    return function (dispatch) {
        dispatch(initRequest(true));
        const nformcode=editplantgroupId.ncontrolCode;
        const ssitecode=editplantgroupId.editRow.nmappingsite;
        const splantparentcode=editplantgroupId.editRow.nparentcode;
        const getActivePlantGroupById = rsapi().post("/plantgroup/getActivePlantGroupById",{editplantgroupId:editplantgroupId,
            nplantgroupcode:editplantgroupId.editRow.nplantgroupcode,userinfo: editplantgroupId.userInfo});
        
        const fustionsite = rsapi().post("/plantgroup/getPlantGroupSite", {"nformcode":nformcode,
            "userinfo": userInfo
        });

        const fusionparentplant = rsapi().post("/plantgroup/getPlantGroupDepartment", {"nsitecode":ssitecode,
            "userinfo": userInfo
        });
        const fusionchildplant = rsapi().post("/plantgroup/getPlantGroupDepartmentchild", {"ssitecode":ssitecode,
        "splantparentcode":splantparentcode,update:1,userinfo: userInfo});

        let urlArray = [];
        urlArray = [getActivePlantGroupById, fustionsite, fusionparentplant, fusionchildplant];

        dispatch(initRequest(true));
        Axios.all(urlArray)
            .then(response => {
                let splantchildcode=[];
                let selectedRecord =  {};

                const fustionsiteconstruct = constructOptionList(response[1].data || [], "nmappingsite",
                "ssitecode", undefined, undefined, false);

                const fustionplantconstruct = constructOptionList(response[2].data || [], "nplantcode",
                "splantshortdesc", undefined, undefined, false);

                const fustionchildconstruct = constructOptionList(response[3].data || [], "nplantcode",
                "splantshortdesc", undefined, undefined, false);

                const fustionsite = fustionsiteconstruct.get("OptionList");
                const fusionparent = fustionplantconstruct.get("OptionList");
                const fustionchild = fustionchildconstruct.get("OptionList");

                selectedRecord =response[0].data;    
                selectedRecord["ssitecode"] = getComboLabelValue(response[0].data,response[1].data, 
                "nmappingsite", "ssitecode");      
                selectedRecord["splantparentcode"] = getComboLabelValue(response[0].data,response[2].data, 
                "nparentcode", "sparentsplantname"); 

                splantchildcode.push({
                        
                    "value":response[0].data.nchildcode,
                    "label":response[0].data.schildsplantname

                });
                selectedRecord["splantchildcode"] = splantchildcode[0];

                // selectedRecord["splantchildcode"] =[getComboLabelValue(response[0].data[0],response[3].data, 
                // "schildcode", "childsplantcode")];     
                
                // ssitecode.push({
                //     "value": response[0].data["ssitecode"],
                //     "label": response[0].data["ssitecode"]
                // });

                 //selectedRecord["ssitecode"]=ssitecode;
                // selectedRecord["splantparentcode"]=selectedRecord [0].parentsplantcode;
                // selectedRecord["splantchildcode"]=selectedRecord [0].childsplantcode;

                //const fusionplant = constructType.get("OptionList");
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        loading: false, openModal:true, 
                        fusionplantSite:fustionsite,
                        fusionparentplants:fusionparent,
                        fusionchildplants:fustionchild,
                        selectedRecord:selectedRecord,
                        ncontrolCode: editplantgroupId.ncontrolCode,
                        screenName:"IDS_FUSIONPLANT",
                        operation:"update"
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





// export function getActivePlantGroupById(editplantgroupId,nplantgroupcode,userInfo) {
//     return function (dispatch) {
//         dispatch(initRequest(true));
//         return rsapi().post("plantgroup/getActivePlantGroupById",{editplantgroupId:editplantgroupId,nplantgroupcode:editplantgroupId.editRow.nplantgroupcode,userinfo: userInfo})
//             .then(response => {
//                 const constructType = constructOptionList(response.data || [], "ssitecode",
//                 "ssitecode", undefined, undefined, false);

//                 const fustionsite = constructType.get("OptionList");
//                 let selectedRecord =  {};

//                 selectedRecord = response.data;    
//                 selectedRecord["fusionplantSite"] = getComboLabelValue(selectedRecord,selectedRecord [0].ssitecod, 
//                 "ssitecod", "ssitecod");      

//                 selectedRecord["ssitecode"]=selectedRecord [0].ssitecode;
//                 selectedRecord["splantparentcode"]=selectedRecord [0].parentsplantcode;
//                 selectedRecord["splantchildcode"]=selectedRecord [0].childsplantcode;

//                 //const fusionplant = constructType.get("OptionList");
//                 dispatch({
//                     type: DEFAULT_RETURN, payload: {
//                         loading: false, openModal:true, 
//                         fusionplantSite:fustionsite,
//                         selectedRecord:selectedRecord,
//                         screenName:"IDS_FUSIONPLANT"
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