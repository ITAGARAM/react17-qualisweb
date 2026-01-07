import rsapi from '../rsapi';
import { DEFAULT_RETURN, UN_AUTHORIZED_ACCESS } from './LoginTypes';
import { constructjsonOptionList, constructOptionList, getComboLabelValue } from '../components/CommonScript'
import { toast } from 'react-toastify';
import Axios from 'axios';
import { initRequest } from './LoginAction';
import { intl } from '../components/App';

//export function getMethodComboService (screenName, primaryKeyName, primaryKeyValue, operation, inputParam , userInfo, ncontrolCode) {            
export function getMaterialTypeComboService(methodParam) {
    return function (dispatch) {
        const methodTypeService = rsapi().post("materialcategory/getMaterialType",
            { userinfo: methodParam.userInfo });
        const barcodeService = rsapi().post("barcode/getBarcode",
            { userinfo: methodParam.userInfo });
        let urlArray = [];
        let selectedId = null;
        if (methodParam.operation === "create") {
            urlArray = [methodTypeService,barcodeService];
        }
        else {
            const url = methodParam.inputParam.classUrl + "/getActive" + methodParam.inputParam.methodUrl + "ById";   //"method/getActiveMethodById"      
            const methodById = rsapi().post(url, { [methodParam.primaryKeyField]: methodParam.primaryKeyValue, "userinfo": methodParam.userInfo });
            urlArray = [methodTypeService,barcodeService, methodById];
            selectedId = methodParam.primaryKeyValue;
        }
        dispatch(initRequest(true));
        Axios.all(urlArray)
            .then(response => {

                let selectedRecord = {};

                const materialCatgeoryList = constructjsonOptionList(response[0].data,
                    "nmaterialtypecode", "smaterialtypename", undefined, undefined,
                    undefined, undefined,
                    undefined, true, methodParam.userInfo.slanguagetypecode)
                    const barcodeList = constructOptionList(response[1].data,
                        "nbarcode", "sbarcodename", undefined, undefined,
                        undefined, undefined,
                        undefined, true, methodParam.userInfo.slanguagetypecode)

                // const materialCatgeoryList = constructOptionList(response[0].data  ||[], "nmaterialtypecode",
                // "smaterialtypename" , undefined, undefined, undefined);
                const materialCatgeoryList1 = materialCatgeoryList.get("OptionList");
                const barcodeList1 = barcodeList.get("OptionList");
                const materialCatgeorydefault = materialCatgeoryList.get("DefaultValue");


                if (methodParam.operation === "update") {
                   selectedRecord = response[2].data; 
                    selectedRecord["nmaterialtypecode"] = getComboLabelValue(selectedRecord, response[0].data,
                        "nmaterialtypecode", "smaterialtypename", 'jsondata', methodParam.userInfo.slanguagetypecode);
                        selectedRecord["nbarcode"] = getComboLabelValue(selectedRecord, response[1].data,
                            "nbarcode", "sbarcodename", 'jsondata', methodParam.userInfo.slanguagetypecode);

                } else {
                    selectedRecord["nmaterialtypecode"] = materialCatgeorydefault;
                }

                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        materialCatgeoryList: materialCatgeoryList1 || [],
                        barcodeList:barcodeList1 || [],
                        operation: methodParam.operation, screenName: methodParam.screenName, selectedRecord,
                        openModal: true,
                        ncontrolCode: methodParam.ncontrolCode,
                        loading: false, selectedId,
                        needSectionwisedisabled: selectedRecord.needSectionwisedisabled
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
                    toast.error(intl.formatMessage({ id: error.message }));
                }
                else {
                    toast.warn(intl.formatMessage({ id: error.response.data }));
                }
            })
    }
}