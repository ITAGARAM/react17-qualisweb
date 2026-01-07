import { DEFAULT_RETURN } from "./LoginTypes";
import { transactionStatus } from '../components/Enumeration';

export const openProductCategoryModal = (screenName, ncontrolCode) => {
    return (dispatch) => {
        dispatch({type: DEFAULT_RETURN, payload:{selectedRecord:{"ncategorybasedflow":transactionStatus.YES},
          screenName: screenName,
            operation: "create", openModal: true, ncontrolCode}});
    }
}