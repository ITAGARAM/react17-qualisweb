import rsapi from '../rsapi';
import Axios from 'axios';
import {toast} from 'react-toastify';
import { DEFAULT_RETURN,UN_AUTHORIZED_ACCESS} from './LoginTypes';
import { intl } from '../components/App';
import { initRequest } from './LoginAction';
import { constructOptionList, sortData } from '../components/CommonScript';



export function getBarcodePrinter(inputParam) {
    return (dispatch) => {
        dispatch(initRequest(true))
        let urlArray = [];
        const getPrinter = rsapi().post("parentsamplebarcode/getPrinter", inputParam);

        const getControlBasedBarcode = rsapi().post("parentsamplebarcode/getControlBasedBarcode", inputParam);

        urlArray = [getPrinter, getControlBasedBarcode]
        // rsapi().post("barcode/getPrinter", inputParam.userInfo)
        Axios.all(urlArray).then(response => {
            let selectedRecord = {
                sprintername: {
                    // BGSI-287 Added validation by Vishakh for error due to printer not available
                    value: response[0]?.data[0]?.sprintername,
                    label: response[0]?.data[0]?.sprintername,
                    item: response[0]?.data[0]
                },
                ncount: 1
            };
            const printer = constructOptionList(response[0].data || [], "sprintername",
                "sprintername", undefined, undefined, true).get("OptionList");
            const barcode = constructOptionList(response[1].data || [], "sbarcodename",
                "sbarcodename", undefined, undefined, true).get("OptionList");
            dispatch({
                type: DEFAULT_RETURN,
                payload: {
                    masterData: {
                        ...inputParam.masterData, control: inputParam.control,
                    },
                    printer,
                    barcode,
                    selectedRecord,
                    operation: "printer",
                    screenName: "IDS_PRINTBARCODE",
                    //dataToPrint: inputParam.selectedGoodsIn.nrmsno,
                    ncontrolcode: inputParam.ncontrolcode,
                    loading: false,
                    openModal: true,
                    loadPrinter: true,dataState:inputParam.dataState
                }
            });
        })
            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                if (error.response.status === 401 || error.response.status === 403) {
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
                    toast.warn(intl.formatMessage({ id: error.response.data }));
                }
            });

    }
}


export function getParentSampleBarcodedata(inputParam) {
    return (dispatch) => {
        dispatch(initRequest(true))
        let urlArray = [];
        const getParentSampleBarcodedata = rsapi().post("parentsamplebarcode/getParentSampleBarcodedata", inputParam);

        urlArray = [getParentSampleBarcodedata]
        Axios.all(urlArray).then(response => {
            let data = response[0].data;
            sortData(data);
            dispatch({
                type: DEFAULT_RETURN,
                payload: {
                    masterData: {
                        ...inputParam.masterData, ...data
                    },loading: false,dataState:inputParam.dataState,selectedSampleData:[]
                }
            });
        })
            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                if (error.response.status === 401 || error.response.status === 403) {
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
                    toast.warn(intl.formatMessage({ id: error.response.data }));
                }
            });

    }
}

export function printBarcodes(inputParam,masterData,openModal) {
    return (dispatch) => {
        dispatch(initRequest(true))
        let urlArray = [];
        const printBarcode = rsapi().post("parentsamplebarcode/printBarcode", { ...inputParam.inputData });

        urlArray = [printBarcode]
        Axios.all(urlArray).then(response => {

            if(response[0].data==="Success")
             toast.warn(intl.formatMessage({ id: "IDS_PRINTSUCCESSFULLY" }));

            dispatch({
                type: DEFAULT_RETURN,
                payload: {
                    masterData: {
                        ...masterData
                    },loading: false,[openModal]:false,dataState:inputParam.dataState
                }
            });
        })
            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                if (error.response.status === 401 || error.response.status === 403) {
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
                    toast.warn(intl.formatMessage({ id: error.response.data }));
                }
            });

    }
}