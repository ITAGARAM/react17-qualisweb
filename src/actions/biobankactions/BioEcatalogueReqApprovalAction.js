
import rsapi from '../../../src/rsapi';
import {DEFAULT_RETURN,UN_AUTHORIZED_ACCESS} from '../../../src/actions/LoginTypes'
import { toast } from 'react-toastify';
import { initRequest } from '../../../src/actions/LoginAction'


export function getSelectedBioEcatalogueReqApproval(lstBioEcatalogueReqApproval, userInfo, masterData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("bioecataloguereqapproval/getSelectedBioEcatalogueReqApproval", {
            necatrequestreqapprovalcode: lstBioEcatalogueReqApproval.necatrequestreqapprovalcode,
            ntransfertype: masterData.realselectedTransferType.value,
            ntransactionstatus:masterData.realSelectedFilterStatus.value,
            userinfo: userInfo
        })
        .then(response => {
            let selectedBioEcatalogueReqApproval = response.data.selectedBioEcatalogueReqApproval;
            let lstBioEcatalogueRequestDetails = response.data.lstBioEcatalogueRequestDetails;
            let realLstBioEcatalogueRequestDetails = response.data.realLstBioEcatalogueRequestDetails; // Added by Gowtham R on nov 18 2025 for jira.id:BGSI-180

            let masterDatadetails = { ...masterData };
            masterDatadetails['selectedBioEcatalogueReqApproval'] = selectedBioEcatalogueReqApproval;
            masterDatadetails['lstBioEcatalogueRequestDetails'] = lstBioEcatalogueRequestDetails;
            masterDatadetails['realLstBioEcatalogueRequestDetails'] = realLstBioEcatalogueRequestDetails; // Added by Gowtham R on nov 18 2025 for jira.id:BGSI-180

            dispatch({
                type: DEFAULT_RETURN,
                payload: {
                    loading: false,
                    masterData: masterDatadetails
                }
            });
        })
        .catch(error => {
            dispatch({ type: DEFAULT_RETURN, payload: { loading: false } });

            if (error.response?.status === 401 || error.response?.status === 403) {
                dispatch({
                    type: UN_AUTHORIZED_ACCESS,
                    payload: {
                        navigation: 'forbiddenaccess',
                        loading: false,
                        responseStatus: error.response.status
                    }
                });
            } else if (error.response?.status === 500) {
                toast.error(error.message);
            } else if (error.response?.data) {
                toast.warn(error.response.data);
            } else {
                toast.error(error.message || "An unknown error occurred");
            }
        });
    };
}
