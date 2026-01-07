import {
    UPDATE_LANGUAGE,
    DEFAULT_RETURN,
    REQUEST_FAILURE,
    POST_CRUD,
    REQUEST_INIT,
    IDLE_LOGOUT,
    UPDATE_PROFILE_IMAGE,
    UN_AUTHORIZED_ACCESS,
    SET_TIMER_START,
    CLEAR_TIMER_START
} from '../actions/LoginTypes';

const initialState = {
    language: 'en-US',
    loading: false,
    navigation: 'login',
    masterData: {},
    masterStatus: "",
    errorStatus: "",
    idleneed:true,
    idleTimeout: 1000 * 60, //added by Syed on 27-SEP-2024
    sessionExpired: Date.now() + 600000,
    timerStart: null, // ALPDJ21-132--Added by Ganesh(27-11-2025)--for every 15 min session time update.
    //inputParam:{}
    userInfo: {
        susername: '',
        suserrolename: ''
    },

}

const LoginReducer = (state = initialState, action) => {
    switch (action.type) {

        case REQUEST_INIT:
            return {
                ...state,
                loading: action.payload
            }

            case UPDATE_LANGUAGE:
                return {
                    ...state,
                    ...action.payload
                }

                case DEFAULT_RETURN:
                    // console.log("DEFAULT_RETURN action.payload:", action.payload);
                    return {
                        ...state,
                        ...action.payload
                    }

                    case REQUEST_FAILURE:
                        return {
                            ...state,
                            error: action.payload.error,
                                loading: action.payload.loading
                        }

                        case POST_CRUD:
                            // let {selectedId, filterValue} = state;            
                            // if (action.payload.operation === "create"){
                            //     selectedId =null;
                            //     //filterValue ="";
                            // }
                            return {
                                ...state,
                                ...action.payload,
                                    //selectedId//, filterValue
                            }
                            case IDLE_LOGOUT:
                                return{
                                    ...initialState,
                                    ...action.payload
                                }
                                  case UPDATE_PROFILE_IMAGE:
                                        state.userImagePath = action.payload.profiledata['UserProfileImage']? action.payload.profiledata['UserProfileImage'] :"";                           
                                        
                                        return {
                                                 ...state,
                                                 ...action.payload
                                               }      
                                               case UN_AUTHORIZED_ACCESS:
                                                    // state.navigation = action.payload.navigation;
                                                    return{
                                                        ...state,
                                                        responseStatus: action.payload.responseStatus,
                                                        loading: action.payload.loading,
                                                        loginFlag: true,
                                                        showForbiddenModal: action.payload.showForbiddenModal === false ? false : true
                                                    }
                                                    // Added by Ganesh on 27/11/2025 - For session time update
                                                    // Start --- 
                                                    case SET_TIMER_START:
                                                        return {
                                                            ...state,
                                                            timerStart: action.payload
                                                        };
                                                    case CLEAR_TIMER_START:
                                                        return {
                                                            ...state,
                                                            timerStart: null
                                                        };
                                                    // End ---
                                            default:
                                                return state
    }
}

export default LoginReducer;