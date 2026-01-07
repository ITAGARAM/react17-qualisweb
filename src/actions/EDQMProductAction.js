import rsapi from '../rsapi';
import { DEFAULT_RETURN, UN_AUTHORIZED_ACCESS } from './LoginTypes';
//import { sortData, getComboLabelValue, searchData } from '../components/CommonScript'
import { toast } from 'react-toastify';
import Axios from 'axios';
import { initRequest } from './LoginAction';
import { intl } from '../components/App';

export function edqmProductFetchRecord(inputParam) {

    return function (dispatch) {

        const productDomainData = rsapi().post("edqmproductdomain/getEDQMProductDomain", { "userinfo": inputParam.userInfo });//this.props.Login.userInfo
        const productDescData = rsapi().post("edqmproductdescription/getEDQMProductDescription", { "userinfo": inputParam.userInfo });//this.props.Login.userInfo
        const productTypeData = rsapi().post("edqmproducttype/getAllEDQMProductType", { "userinfo": inputParam.userInfo });//this.props.Login.userInfo
        const bulkTypeData = rsapi().post("edqmbulktype/getAllEDQMBulkType", { "userinfo": inputParam.userInfo });//this.props.Login.userInfo
        const componentBulkData = rsapi().post("edqmcomponentbulkgroup/getAllEDQMComponentBulkGroup", { "userinfo": inputParam.userInfo });//this.props.Login.userInfo
        const masterFileData = rsapi().post("edqmmasterfiletype/getAllEDQMMasterFileType", { "userinfo": inputParam.userInfo });//this.props.Login.userInfo
        const safetyFileData = rsapi().post("edqmsafetymarker/getAllEDQMSafetyMarker", { "userinfo": inputParam.userInfo });//this.props.Login.userInfo
//this.props.Login.userInfo
        let urlArray = [];
        let selectedId = null;
        if (inputParam.operation === "update") {

            const productData = rsapi().post("edqmproduct/getActiveEDQMProductById", { [inputParam.primaryKeyField]: inputParam.primaryKeyValue, "userinfo": inputParam.userInfo });
            const safetyFil= rsapi().post("edqmsafetymarker/getSafetyMarkersEdit",  { [inputParam.primaryKeyField]: inputParam.primaryKeyValue, "userinfo": inputParam.userInfo });

            urlArray = [productDomainData, productDescData, productTypeData, bulkTypeData, componentBulkData, masterFileData, safetyFileData, productData,safetyFil];
            selectedId = inputParam.primaryKeyValue;
        }
        else {
            urlArray = [productDomainData, productDescData, productTypeData, bulkTypeData, componentBulkData, masterFileData, safetyFileData];

        }
        dispatch(initRequest(true));
        Axios.all(urlArray)
            .then(Axios.spread((...response) => {

                let nproductdomaincode = [];
                let nproductdesccode = [];
                let nproducttypecode = [];
                let nbulktypecode = [];
                let ncomponentbulkgroupcode = [];
                let nmasterfiletypecode = [];
                let nsafetymarkercode = [];
               let safetyFileData=[];
                //let selectedRecord = {};
                if (inputParam.operation === "update") {

                    nproductdomaincode.push({
                        label: response[7].data["sproductdomain"],
                        value: response[7].data["nproductdomaincode"]
                    });

                    nproductdesccode.push({
                        label: response[7].data["sproductclass"],
                        value: response[7].data["nproductdesccode"]
                    });

                    if (response[7].data["nproducttypecode"] !== -1)
                    {
                        nproducttypecode.push({
                            label: response[7].data["sproducttype"],
                            value: response[7].data["nproducttypecode"]
                        });
                    }
                    if (response[7].data["nbulktypecode"] !== -1)
                    {
                        nbulktypecode.push({
                            label: response[7].data["sbulktype"],
                            value: response[7].data["nbulktypecode"]
                        });
                    }

                    if (response[7].data["ncomponentbulkgroupcode"] !== -1)
                    {
                        ncomponentbulkgroupcode.push({
                            label: response[7].data["scomponentbulkgroup"],
                            value: response[7].data["ncomponentbulkgroupcode"]
                        });
                    }

                    if (response[7].data["nmasterfiletypecode"] !== -1)
                    {
                        nmasterfiletypecode.push({
                            label: response[7].data["smasterfiletype"],
                            value: response[7].data["nmasterfiletypecode"]
                        });
                    }

                    if (response[7].data["nsafetymarkercode"] !== -1)
                    {
                        nsafetymarkercode.push({
                            label: response[7].data["ssafetymarkername"],
                            value: response[7].data["nsafetymarkercode"]
                        });
                    }
                    safetyFileData=response[8].data;
                }else{
                    safetyFileData=response[6].data;
                }

              

                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        productDomainData: response[0].data, productDescData: response[1].data,
                        productTypeData: response[2].data, bulkTypeData: response[3].data,
                        componentBulkData: response[4].data, masterFileData: response[5].data,
                        safetyFileData: safetyFileData,
                        nproductdomaincode, nproductdesccode, nproducttypecode, nbulktypecode,
                        ncomponentbulkgroupcode, nmasterfiletypecode, nsafetymarkercode,
                        operation: inputParam.operation, screenName: inputParam.screenName,

                        selectedRecord: inputParam.operation === "update" ? response[7].data : {},
                        openModal: true,
                        ncontrolCode: inputParam.ncontrolCode, loading: false, selectedId
                    }
                });


            }))

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
                    toast.error(intl.formatMessage({ id: error.message }));
                }
                else {
                    toast.warn(intl.formatMessage({ id: error.response.data }));
                }
            })

    }//
}