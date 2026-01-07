import rsapi from '../rsapi';
import Axios from 'axios';
import { toast } from 'react-toastify';
import { rearrangeDateFormat } from '../components/CommonScript'
import { DEFAULT_RETURN, UN_AUTHORIZED_ACCESS } from './LoginTypes';
import { initRequest } from './LoginAction';
import { intl } from '../components/App';

export function getComboSampleReceiving(addParam,masterData) {
    return function (dispatch) {
        let userInfo = addParam.userInfo;
        dispatch(initRequest(true));
        return rsapi().post("timezone/getLocalTimeByZone", { userinfo: userInfo })
            .then(response => {
                let date = rearrangeDateFormat(userInfo, response.data?.date);
                // masterData["barcodeFields"] ={};
                // masterData ["barcodedata"]={};
                // masterData ["jsondataBarcodeFields"]={};

                let selectedRecord = { ...addParam.selectedRecord, "dcollectiondate": date }

                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData:{...masterData,
                            "barcodeFields" :[],
                            "barcodedata":[]
                            //"jsondataBarcodeFields":[]
                        },
                        operation: addParam.operation,
                        screenName: addParam.screenName,
                        selectedRecord: selectedRecord,
                        openModal: true,
                        ncontrolcode: addParam.ncontrolCode,
                        loading: false,
                        barcodenorecord: false
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


export function getBarcodeDataRecord(inputParam) {
    return function (dispatch) {
        const obj1 = {};
       
            dispatch(initRequest(true));
            rsapi().post("samplereceiving/getBarcodeConfigData", {
                userinfo: inputParam.inputData.userinfo,
                nprojecttypecode: inputParam.masterData.selectedProjectType.value, spositionvalue: inputParam.inputData.selectedRecord.sbarcodeid,
                nbarcodeLength: inputParam.inputData.selectedRecord.sbarcodeid.length, jsondata: obj1
            }
            ).then(response => {


                // let b = [];
                // b[0] = { "sfieldname": "Unit Name", "nsorter": 9 };
                // b[1] = { "sfieldname": "Sample Quantity", "nsorter": 10 };
                // let str = [];
                // str = [...barcodeFields, ...b]
                //let barcodedata = { ...response.data.jsondataBarcodeData, "Unit Name": response.data.addValue[0].sunitname, "Sample Quantity": response.data.addValue[0].nsampleqty };
                
                let barcodeFields = response.data.jsondataBarcodeFields;
                let barcodedata = response.data.jsondataBarcodeData;
              
                inputParam.masterData["jsondataBarcodeFields"]=response.data.jsondataBarcodeFields;

                let masterData = { ...inputParam.masterData, "barcodedata": barcodedata, "barcodeFields": barcodeFields }
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData,
                        ...inputParam.inputData.selectedRecord,
                        loading: false,
                        barcodenorecord: false
                    }
                });
            }
            )
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

export function saveReceiving(inputParam, masterData) {
    return function (dispatch) {

        const service1 = rsapi().post("samplereceiving/" + inputParam.operation + "SampleReceiving", inputParam.inputData);
        const service2 = rsapi().post("timezone/getLocalTimeByZone", {
            userinfo: inputParam.inputData.userinfo
        });
        let urlArray = [];
        dispatch(initRequest(true));

        urlArray = [service1, service2]
        Axios.all(urlArray).then(response => {

            //let masterData = { ...inputParam.masterData, ...response.data, selectedProjectType: inputParam.inputData.selectedProjectType }
            masterData = { ...masterData, "SampleReceiving": response[0].data.SampleReceiving, "barcodedata": "" }
            let openModal = false;
            if (inputParam.saveType === 2) {
                openModal = true;
            }

            masterData["jsondataBarcodeFields"]=response[0].data.jsondataBarcodeFields;
 
            masterData = { ...masterData,"SampleReceiving": response[0].data.SampleReceiving, "barcodedata": "" }

            let date = rearrangeDateFormat(inputParam.inputData.userinfo, response[1].data?.date);

            let selectedRecord = { ...inputParam.selectedRecord, "sbarcodeid": "", "dcollectiondate": date, "scomments": "" }

            dispatch({
                type: DEFAULT_RETURN, payload: {
                    masterData,
                    selectedRecord,
                    barcodeFields:[],
                    barcodedata:[],
                    barcodenorecord:[],
                    openModal: openModal,
                    loading: false,
                    loadEsign: false
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

export function getActiveSampleReceivingById(editParam) {
    return function (dispatch) {

        let selectedId = null;
        rsapi().post("samplereceiving/getActiveSampleReceivingById",
            {
                [editParam.primaryKeyField]: editParam.primaryKeyValue, "nprojecttypecode": editParam.editRow.nprojecttypecode, "spositionvalue": editParam.editRow.sbarcodeid, "userinfo": editParam.userInfo
            }).then(response => {
                selectedId = editParam.primaryKeyValue;

                let date = rearrangeDateFormat(editParam.userInfo, response.data.activeSampleColletionByID['scollectiondate']);

                let selectedRecord = response.data && response.data.activeSampleColletionByID
                // let b = [];
                // b[0] = { "sfieldname": "Unit Name", "nsorter": 9 };
                // b[1] = { "sfieldname": "Sample Quantity", "nsorter": 10 };

                // let str = [];
                // str = [...barcodeFields, ...b]

                // let barcodedata = response.data && response.data.activeSampleColletionByID.jsondata;
                // let barcodeFields = response.data.jsondataBarcodeFields;

                let barcodeFields = response.data.jsondataBarcodeFields;
              
                let barcodedata = response.data && response.data.activeSampleColletionByID.jsondata;
                let masterData = { ...editParam.masterData, "barcodedata": barcodedata , "barcodeFields":barcodeFields}

                //let masterData = { ...editParam.masterData, "barcodedata": barcodedata, "barcodeFields": barcodeFields }

                selectedRecord = {
                    ...editParam.selectedRecord, "sbarcodeid": response.data.activeSampleColletionByID['sbarcodeid'],
                    "dcollectiondate": date, "scomments": response.data.activeSampleColletionByID['scomments']
                }
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData,
                        selectedRecord,
                        operation: editParam.operation,
                        ncontrolcode: editParam.ncontrolCode,
                        openModal: true,
                        loading: false,
                        barcodenorecord:false,
                        selectedId,
                        screenName: editParam.screenName,
                        dataState:editParam.dataState,
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


export function getSampleReceiving(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("samplereceiving/getSampleReceiving", inputParam.inputData)
            .then(response => {
                let masterData = { ...inputParam.masterData, ...response.data, selectedProjectType: inputParam.inputData.selectedProjectType }
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData, loading: false,
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




// export function SampleReceivingReportReadBarcode(SampleReceivingReportId, data) {

//     if (SampleReceivingReportId !== false) {
//         let obj = convertDateValuetoString(data.masterData.FromDate,
//             data.masterData.ToDate,
//             data.userInfo);
//         let fromDate = obj.fromDate;
//         let toDate = obj.toDate;

//         const filterTestParam = {
//             todate: toDate,
//             fromdate: fromDate
//         }


//         this.props.generateControlBasedReport(SampleReceivingReportId, filterTestParam, this.props.Login, "nsamplereceivingcode",
//             this.state.selectedRecord.nsamplereceivingcode);

//     }

// }
