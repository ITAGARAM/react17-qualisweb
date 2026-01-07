import rsapi from '../rsapi';
import { DEFAULT_RETURN, UN_AUTHORIZED_ACCESS } from './LoginTypes';
//import { sortData, getComboLabelValue, searchData } from '../components/CommonScript'
import { toast } from 'react-toastify';
import Axios from 'axios';
import { initRequest } from './LoginAction';
import { intl } from '../components/App';


export function getPlasmaMasterFileComboService(plasmaparam) {
    return function (dispatch) {

        if (plasmaparam.operation === "create" || plasmaparam.operation === "update") {

            const manufService = rsapi().post("plasmamasterfile/getManufacturer", { userinfo: plasmaparam.userInfo });

            let urlArray = [];
            let selectedId = null;
            if (plasmaparam.operation === "create") {

                urlArray = [manufService];
            }
            else {
                const plasmaById = rsapi().post("plasmamasterfile/getActivePlasmaMasterFileById", { [plasmaparam.primaryKeyField]: plasmaparam.primaryKeyValue, "userinfo": plasmaparam.userInfo });

                urlArray = [manufService, plasmaById];
                selectedId = plasmaparam.primaryKeyValue;
            }
            dispatch(initRequest(true));
            Axios.all(urlArray)
                .then(response => {


                    let manufacturer = [];

                    let selectedRecord = {};

                    if (plasmaparam.operation === "update") {
                        selectedRecord = response[1].data;

                        manufacturer.push({ "value": response[1].data["nmanufcode"], "label": response[1].data["smanufname"] });


                        selectedRecord["nmanufcode"] = manufacturer[0];


                    }
                    else {
                        selectedRecord["ntransactionstatus"] = 1;


                    }


                    dispatch({
                        type: DEFAULT_RETURN, payload: {
                            manufList: response[0].data || [],

                            selectedRecord, openModal: true,
                            operation: plasmaparam.operation, screenName: plasmaparam.screenName,
                            ncontrolCode: plasmaparam.ncontrolCode, loading: false, selectedId
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