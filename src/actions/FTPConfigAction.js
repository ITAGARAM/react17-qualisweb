import rsapi from '../rsapi';
import {DEFAULT_RETURN,UN_AUTHORIZED_ACCESS} from './LoginTypes';
import { toast } from 'react-toastify';
import Axios from 'axios'
import { initRequest } from './LoginAction';
import { transactionStatus } from '../components/Enumeration';
import { constructOptionList } from '../components/CommonScript';
import { intl } from '../components/App';

export function openFTPConfigModal  (userInfo,ncontrolcode)  {

    return function(dispatch){
    dispatch(initRequest(true));
   const uiArray=[rsapi().post("site/getSiteForFTP",{"userinfo": userInfo})]
   uiArray.push(rsapi().post("ftpconfig/getFTPType",{"userinfo": userInfo}))
   Axios.all(uiArray).then(response=> { 
        const selectedRecord={};
        //const siteList = response[0].data["SiteList"] || [];
        // const siteListMap = constructOptionList(response[0].data.SiteList,'nsitecode','ssitename',undefined, undefined, undefined,
        // 'ndefaultstatus') || [];
        const ftpTypeListMap =constructOptionList(response[1].data,'nftptypecode','sftptypename',undefined, undefined, undefined,
        'ndefaultstatus') || [];
        const ftpTypeList =ftpTypeListMap.get("OptionList");
        const defaultftpTypeList =ftpTypeListMap.get("DefaultValue");

        //const siteList = siteListMap.get("OptionList");
      
        selectedRecord['nftptypecode']=defaultftpTypeList

        // selectedRecord['siteValue']=siteList.length>0? siteList[0].ndefaultstatus===transactionStatus.YES?  
        //                             [{value:siteList[0].nsitecode,label:siteList[0].ssitename,item:siteList[0]}]
        //                             :[]:[]
        selectedRecord["sphysicalpath"]= response[0].data["CheckSumDefaultPath"];
        dispatch({
            type: DEFAULT_RETURN, payload:{
                openModal:true,
                operation:"create",
               // siteOptions:siteList,
                ftpTypeList,
                checkSumDefaultPath: response[0].data["CheckSumDefaultPath"],
                selectedRecord,ncontrolcode    
                ,loading:false           
                }
            }) 
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
};

export function fetchFTPConfigByID(editParam){

    return function(dispatch){
    const url1=rsapi().post("site/getSiteForFTP",{"userinfo": editParam.userInfo})
    const url2=rsapi().post("ftpconfig/getActiveFTPConfigById",
            { [editParam.primaryKeyField] :editParam.primaryKeyValue,"userinfo":editParam.userInfo} )
     const url3=rsapi().post("ftpconfig/getFTPType",{"userinfo": editParam.userInfo})
    dispatch(initRequest(true));
    Axios.all([url1,url2,url3])
    .then(response=> { 
        let selectedId=editParam.primaryKeyValue
        let selectedRecord=response[1].data
        // const siteListMap = constructOptionList(response[0].data.SiteList,'nsitecode','ssitename',undefined, undefined, undefined,
        // false) || [];
        // const siteList = siteListMap.get("OptionList");
        selectedRecord['nsitecode']={value:response[1].data.nsitecode,label:response[1].data.ssitename}
        selectedRecord['nftptypecode']={value:response[1].data.nftptypecode,label:response[1].data.sftptypename}
        
        dispatch({
            type: DEFAULT_RETURN, payload:{
            openModal:true, 
            selectedRecord ,
            ftpTypeList:constructOptionList(response[2].data,'nftptypecode','sftptypename').get("OptionList"),
            operation:editParam.operation,
            screenName:editParam.screenName,
            //siteOptions:response[0].data,
            siteOptions:constructOptionList(response[0].data.SiteList,'nsitecode','ssitename').get("OptionList"),//:siteList,
            ncontrolcode:editParam.ncontrolCode,
            inputparam:editParam.inputparam,
            loading:false,selectedId
        }}) 
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