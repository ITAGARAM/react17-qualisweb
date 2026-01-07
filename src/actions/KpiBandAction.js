import rsapi from '../rsapi';
import { DEFAULT_RETURN, UN_AUTHORIZED_ACCESS } from './LoginTypes';
//import { sortData, getComboLabelValue, searchData } from '../components/CommonScript'
import { toast } from 'react-toastify';
import Axios from 'axios';
import { initRequest } from './LoginAction';
import { intl } from '../components/App';


export function getKpiBandComboService(kpibandparam) {
    return function (dispatch) {

        if (kpibandparam.operation === "create" || kpibandparam.operation === "update") {

            const productService = rsapi().post("kpiband/getProduct", { userinfo: kpibandparam.userInfo });
            const periodService = rsapi().post("kpiband/getPeriod", 
            { ncontrolcode:kpibandparam.ncontrolCode,userinfo: kpibandparam.userInfo });
            // const periodService =  rsapi().post("period/getPeriodByControl", {
            //     "ncontrolcode": kpibandparam.ncontrolCode,
            //     "userinfo": kpibandparam.userInfo
            // })

            let urlArray = [];
            let selectedId = null;
            if (kpibandparam.operation === "create") {

                urlArray = [productService, periodService];
            }
            else {
                const kpiBandById = rsapi().post("kpiband/getActiveKpiBandById", { [kpibandparam.primaryKeyField]: kpibandparam.primaryKeyValue, "userinfo": kpibandparam.userInfo });

                urlArray = [productService, periodService, kpiBandById];
                selectedId = kpibandparam.primaryKeyValue;
            }
            dispatch(initRequest(true));
            Axios.all(urlArray)
                .then(response => {


                    let product = [];
                    let periodBefore = [];
                    let periodAfter = [];

                    let selectedRecord = {};

                    if (kpibandparam.operation === "update") {
                        selectedRecord = response[2].data;

                        product.push({ "value": response[2].data["nproductcode"], "label": response[2].data["sproductname"] });
                        periodBefore.push({ "value": response[2].data["nbeforeperiodcode"], "label": response[2].data["sbeforeperiodname"] });
                        periodAfter.push({ "value": response[2].data["nafterperiodcode"], "label": response[2].data["safterperiodname"] });


                        selectedRecord["nproductcode"] = product[0];
                        selectedRecord["nbeforeperiodcode"] = periodBefore[0];
                        selectedRecord["nafterperiodcode"] = periodAfter[0];


                    }
                    // else {
                    //     selectedRecord["ntransactionstatus"] = 1;


                    // }


                    dispatch({
                        type: DEFAULT_RETURN, payload: {
                            productList: response[0].data || [],
                            periodList: response[1].data || [],
                            selectedRecord, openModal: true,
                            operation: kpibandparam.operation, screenName: kpibandparam.screenName,
                            ncontrolCode: kpibandparam.ncontrolCode, loading: false, selectedId
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
        // else {
        //     toast.warn(this.props.formatMessage({ id: masterData.SelectedMAHolder.stranstatus }));
        // }
    }
}