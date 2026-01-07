import React from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from "react-router-dom";
import IdleTimer from 'react-idle-timer';
import PropTypes from 'prop-types';
import IdleTimeOutModal from '../confirm-alert/IdleTimeOutModal';
import Sidebar from '../sidebar/sidebar.component';
import SidebarTablet from '../sidebar/sidebar.tablet';
import Header from '../header/header.component';
import routes from '../../routes';
import { navPage, updateStore, callService, getDashBoardForHome,getListAlert ,submitChangeRole,changeOwner} from '../../actions'
import rsapi from '../../rsapi';
import { toast } from 'react-toastify';
import ConfirmMessage from '../../components/confirm-alert/confirm-message.component';
import { IDLE_LOGOUT,DEFAULT_RETURN,UN_AUTHORIZED_ACCESS } from '../../actions/LoginTypes';
import { injectIntl } from 'react-intl';
// import { updateStore } from '../../actions/LoginAction';
import ScrollToTop from '../../actions/ScrollToTop';
import SearchBar from '../searchbarcomponent/SearchBar';
import { formatInputDate } from '../CommonScript';
import iconScreenSize from '../../assets/image/product-image@3x.png'
import { PostgreSQLMaintenance } from '../Enumeration';
import { intl } from '../App';

const mapStateToProps = (state) => {
    return {
        Login: state.Login
    }
}

class Layout extends React.Component {

    constructor(props) {
        super(props);
        this.parentFunction = this.parentFunction.bind(this);
        this.pinMenu = this.pinMenu.bind(this);
        this.darkMode = this.darkMode.bind(this);
        this.carRef = React.createRef()
        this.carRef1 = React.createRef()
        this.state = {
            //timeout: this.props.Login.idleTimeout,
            //added by Syed on 27-SEP-2024
            timeout: this.props.Login.idleTimeout * (this.props.Login.settings && parseInt(this.props.Login.settings[1])),
            showIdleModal: false,
            userLoggedIn: false,
            isTimedOut: false,
            password: "",
            sessionExpired: this.props.Login.sessionExpired,
            defaultSearch: [],
            searchText: '',
            menuClick: false,
            showSearch: false,
            fullView: true,
            lenghtDvv:null,
            sidebarview: false,
            isPinned: false,
            isDark: false,
            isDesktop: (window.innerWidth) >= 1280,
            isPortrait: (window.innerWidth) >= 1024,
            windowSize : window.innerWidth,

            handleResize: this.handleResize.bind(this)
        }
        this.inputRef = React.createRef();
        this.idleTimer = null
        this.password = React.createRef();
        this.searchValue = null;
        this.date = new Date();
    }

    parentFunction() {
        this.setState({sidebarview:!this.state.sidebarview});
    }
    
    pinMenu() {
        this.setState({isPinned:!this.state.isPinned});
    }
    darkMode() {        
        this.setState({isDark:!this.state.isDark});
        if(!this.state.isDark){                
            document.body.classList.add('dark'); 
        }else{
            document.body.classList.remove('dark'); 
        }        
    }

    _onAction = (e) => {

    }

    _onActive = (e) => {

    }

    _onIdle = (e) => {
        if (this.state.showIdleModal !== true) {
            let uRL = "";
            let inputData = [];
            uRL = 'login/insertAuditAction';
            inputData = {
                userinfo: this.props.Login.userInfo,
                // scomments: `UserName:${this.props.Login.userInfo.susername}, 
                // LoginID:${this.props.Login.userInfo.sloginid}`,
                scomments: `User Name:${this.props.Login.userInfo.susername}; User Role:${this.props.Login.userInfo.suserrolename}; Login ID:${this.props.Login.userInfo.sloginid}`,
                sauditaction: "IDS_IDLETIMELOCK"
            }
            rsapi().post(uRL, inputData)
                .then(response => {
                    this.setState({ showIdleModal: true, sessionExpired: Date.now() + 600000 });
                })
                .catch(error => {
                    if (error.response?.status === 429) {
                    toast.warn(intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
                    this.props.updateStore({ typeName: DEFAULT_RETURN, data: { loading: false } });
                } else if (error.response?.status === 401 || error.response?.status === 403) {
                        const UnAuthorizedAccess = {
                            typeName: UN_AUTHORIZED_ACCESS,
                        data: {
                            navigation: 'forbiddenaccess',
                            loading: false,
                            responseStatus: error.response.status
                        }
                        }
                        this.props.updateStore(UnAuthorizedAccess);
                    } else if (error.response.status === 500) {
                        toast.error(error.message);
                    }
                    else {
                        toast.warn(error.response.data);
                    }
                });
        }
    }


    handleLogin = (event) => {
        if (event) {
            if (this.password.current !== null && this.password.current.elements[0].value === "") {
                toast.info(this.props.intl.formatMessage({ id: "IDS_ENTERPASSWORD" }));
                return;
            }
            else {
                event.preventDefault();
                let uRL = "";
                let inputData = [];
                uRL = 'login/idleTimeAuditAction';
                inputData = {
                    userinfo: this.props.Login.userInfo,
                    //password: this.state.password,
                    password: this.password.current.elements[0].value,
                    flag: true, nFlag: 1
                }

                rsapi().post(uRL, inputData)
                    .then(response => {
                        if (response.data['PassFlag'] === this.props.intl.formatMessage({ id: "IDS_SUCCESS" })) {
                            const UnAuthorizedAccess = {
                                typeName: UN_AUTHORIZED_ACCESS,
                                data: {
                                    navigation: 'forbiddenaccess',
                                    loading: false,
                                    showForbiddenModal: false,
                                }
                            }
                            this.props.updateStore(UnAuthorizedAccess);
                            const updateInfo = {
                                typeName: DEFAULT_RETURN,
                                data: { token: response.data.token } // ALPDJ21-27 - Implementation of JWT into QuaLIS LIMS product
                            }
                            this.props.updateStore(updateInfo);
                            this.password.current.elements[0].value = ""
                            this.setState({ showIdleModal: false, openModal: false })
                        }
                        else {
                            toast.info(response.data['PassFlag']);
                        }
                    })
                    .catch(error => {
                        if (error.response?.status === 429) {
                    toast.warn(intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
                    this.props.updateStore({ typeName: DEFAULT_RETURN, data: { loading: false } });
                } else if (error.response?.status === 401 || error.response?.status === 403) {
                            const UnAuthorizedAccess = {
                                typeName: UN_AUTHORIZED_ACCESS,
                                data: {
                                    navigation: 'forbiddenaccess',
                                    loading: false,
                                    responseStatus: error.response.status
                                }
                            }
                            this.props.updateStore(UnAuthorizedAccess);
                        } else if (error.response.status === 500) {
                            toast.warn(error.message);
                        }
                        else {
                            toast.warn(error.response.data);
                        }
                    })
            }
        }
    }

    enterKeyLogin = (event) => {
        if (event.keyCode === 13) {
            this.handleLogin(event);
            event.preventDefault();
        }
    }


    handleLogout = (event) => {
        if (event) {
            let uRL = "";
            let inputData = [];
            uRL = 'login/idleTimeAuditAction';
            inputData = {
                userinfo: this.props.Login.userInfo,
                //password: this.state.password,
                //password: this.password.current.elements[0].value,
                flag: false, nFlag: 2
            }

            rsapi().post(uRL, inputData)
                .then(response => {

                    const updateInfo = {
                        typeName: IDLE_LOGOUT,
                        data: {
                            masterData: [], inputParam: undefined, idleneed: false, token: undefined
                        }
                    }
                    this.props.updateStore(updateInfo);

                    //this.password.current.elements[0].value = ""
                    //this.setState({ showIdleModal: false })
                    this.props.navPage("login");
                })
                .catch(error => {
                    if (error.response?.status === 429) {
                    toast.warn(intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
                    this.props.updateStore({ typeName: DEFAULT_RETURN, data: { loading: false } });
                } else if (error.response?.status === 401 || error.response?.status === 403) {
                            const UnAuthorizedAccess = {
                                typeName: UN_AUTHORIZED_ACCESS,
                        data: {
                            navigation: 'forbiddenaccess',
                            loading: false,
                            responseStatus: error.response.status
                        }
                            }
                            this.props.updateStore(UnAuthorizedAccess);
                    } else if (error.response.status === 500) {
                        toast.error(error.message);
                    }
                    else {
                        toast.warn(error.response.data);
                    }
                })
        }
    }

    renderer = (event) => {
        // event.preventDefault();
        const { minutes, seconds, completed } = event;
        if (completed) {
            // Render a completed state
            let uRL = "";
            let inputData = [];
            uRL = 'login/insertAuditAction';
            inputData = {
                userinfo: this.props.Login.userInfo,
                // scomments: `UserName:${this.props.Login.userInfo.susername}, 
                // LoginID:${this.props.Login.userInfo.sloginid}`,
                scomments: `User Name:${this.props.Login.userInfo.susername}; User Role:${this.props.Login.userInfo.suserrolename}; Login ID:${this.props.Login.userInfo.sloginid}`,
                sauditaction: "IDS_SESSIONEXPIRED", nFlag: 2
            }

            rsapi().post(uRL, inputData)
                .then(response => {

                    const updateInfo = {
                        typeName: IDLE_LOGOUT,
                        data: {
                            masterData: [], inputParam: undefined, idleneed: false, token: undefined
                        }
                    }
                    //this.props.navPage("login");
                    this.props.updateStore(updateInfo);

                })
                .catch(error => {
                    if (error.response?.status === 429) {
                    toast.warn(intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
                    this.props.updateStore({ typeName: DEFAULT_RETURN, data: { loading: false } });
                } else if (error.response?.status === 401 || error.response?.status === 403) {
                        const UnAuthorizedAccess = {
                            typeName: UN_AUTHORIZED_ACCESS,
                        data: {
                            navigation: 'forbiddenaccess',
                            loading: false,
                            responseStatus: error.response.status
                        }
                        }
                        this.props.updateStore(UnAuthorizedAccess);
                    } else if (error.response.status === 500) {
                        toast.error(error.message);
                    }
                    else {
                        toast.warn(error.response.data);
                    }
                })
        } else {
            // Render a countdown
            //console.log("minutes" + minutes + "seconds" + seconds)
            return <span style={{ 'margin-left': '0.3rem', color: 'red' }}>{minutes} minutes {seconds} seconds..!</span>;

        }
        return null;
    };


    onInputChangeSearch = (event) => {       
        let defaultSearch = []
        this.props.Login.menuDesign.map((menuItem, index) => {
            menuItem.lstmodule && menuItem.lstmodule.map((moduleItem, moduleIndex) => {
                moduleItem.lstforms && moduleItem.lstforms.map((formItem, formIndex) => {

                    //   console.log(formItem.sdisplayname.toLowerCase(),event.target.value,formItem.sdisplayname.toLowerCase().includes(event.target.value))
                    if (formItem.sdisplayname.toLowerCase().includes(event.target.value.toLowerCase())) {
                        defaultSearch.push({ ...formItem, smodulename: moduleItem.sdisplayname })
                    }
                })
            })
        })
        this.setState({ defaultSearch, searchText: event.target.value.toLowerCase(),showSearch:true, menuClick: false })
    }
    onInputChangeSearch1 = (event) => {     
        this.setState({ 
            showSearch:false,
            defaultSearch: [],
            menuClick: false, 
            nmenucode: undefined, 
            searchText:''});
        this.myDiv.focus();
    }
    onClickBackToMenu = (e) => {
        e.preventDefault();
        e.stopPropagation()
        this.setState({
            defaultSearch: [],
            menuClick: false, nmenucode: undefined
        })
    }

    onClickSearchMenu = (menu, inputRef) => {
        let defaultSearch = []
        this.props.Login.menuDesign.map((menuItem, index) => {
            if (menu.nmenucode === menuItem.nmenucode) {
                menuItem.lstmodule && menuItem.lstmodule.map((moduleItem, moduleIndex) => {
                    moduleItem.lstforms && moduleItem.lstforms.map((formItem, formIndex) => {
                        //   console.log(formItem.sdisplayname.toLowerCase(),event.target.value,formItem.sdisplayname.toLowerCase().includes(event.target.value))
                        //  if (formItem.sdisplayname.toLowerCase().includes(event.target.value.toLowerCase())) {
                        defaultSearch.push({ ...formItem, smodulename: moduleItem.sdisplayname })
                        //   }
                    })
                })
            }
        })
        this.setState({
            defaultSearch,
            menuClick: true, nmenucode: menu.nmenucode
        })
    }

    getDetail = (classUrl, methodUrl, formCode, displayName, moduleCode, formname, nmenucode, smodulename, history) => {

        if (this.props.Login.userInfo.nformcode !== formCode) {
           
            const userInfo = {
                ...this.props.Login.userInfo, "nformcode": formCode,
                "nmodulecode": moduleCode, "sformname": formname.sdisplayname, smodulename: smodulename
            }
            const inputParam = {
                inputData: { "userinfo": userInfo,
                settings : this.props.Login.settings,
                currentdate: formatInputDate(new Date(), true) },
                classUrl, methodUrl, displayName, key: "MenuId_" + nmenucode, history,
                layoutCall:true
            };

            this.props.callService(inputParam);
        }
    }

    onClickButton = (forms) => {
        const { history } = this.props;
        history.push('/' + forms.sclassname);
        if (this.inputRef.current)
            this.inputRef.current.value = ""
        this.setState({ defaultSearch: [], searchText: "", menuClick: false, showSearch: false, fullView: false ,showAlertDashBoard:true})
        this.getDetail(forms.sclassname.toLowerCase(), forms.surl,
            forms.nformcode, forms.sdisplayname, forms.nmodulecode, forms, forms.nmenucode, forms.smodulename, history)
    }
    menuHide = () => {
        this.setState({ fullView: false,showAlertDashBoard:true })
    }
    layOutGetHome = (updateInfo, form) => {
        const { history } = this.props;
        history.push('/' + updateInfo.data.shomename);
        if (this.inputRef.current)
            this.inputRef.current.value = ""
        this.setState({ defaultSearch: [], searchText: "", menuClick: false, fullView: true,showAlertDashBoard:false })
        if (updateInfo.data.shomename === 'dashboard') {
            this.props.updateStore(updateInfo);
            this.props.getDashBoardForHome(updateInfo);
            this.props.getListAlert(updateInfo.data.userInfo, true)
        } else if (updateInfo.data.shomename === 'apiservice') {
            const inputParam = {
                inputData: { 
                 settings : this.props.Login.settings,
                 currentdate: formatInputDate(new Date(), true) ,"userinfo": updateInfo.data.userInfo},
                 serviceNeed: true,...updateInfo.data, "userinfo": updateInfo.data.userInfo,
            };
            this.props.callService(inputParam);
            this.props.getListAlert(updateInfo.data.userInfo, true)
        }
        else {
            this.props.updateStore(updateInfo);
            this.props.getListAlert(updateInfo.data.userInfo, true)
        }
        // ALPD-4794- Changed by Neeraj
        this.myDiv.addEventListener('onKeyPress', this.handleKey);
        this.myDiv.focus();
    }
    layOutGetHomeCancel = () => {
        const { history } = this.props;
        let { menuClick, defaultSearch, searchText } = this.state

        if (this.inputRef.current && this.inputRef.current.value !== "") {
            if (this.props.history.location.pathname === '/home') {
                history.push('/home');
            }
            this.inputRef.current.value = ""
            menuClick = false
            defaultSearch = []
            searchText = ""
        } else {
            if (menuClick) {
                menuClick = true
            }

            if (this.inputRef.current) {
                this.inputRef.current.value = ""
            }

        }
        this.setState({ defaultSearch, searchText, showSearch: false, menuClick })
        //this.props.updateStore(updateInfo);
        //  this.props.layOutGetHome(updateInfo)
    }
    menuFullview = () => {
        let { fullView } = this.state;
        this.setState({ fullView: !this.state.fullView })
    }
    toggleSearch = () => {
        this.setState({
            showSearch: !this.state.showSearch
        })
    }
    onChangeRol = (roleItem) => {
        this.setState({ menuClick:false,showAlertDashBoard:false  ,showSearch:false,searchText:"" })
        const parameterInfo = {
            typeName: DEFAULT_RETURN,
            //#SECURITY-VULNERABILITY-MERGING-START
            //data: { navigation: "" } // Modified by Vignesh(06-12-2025) for screen was not closing when changing the role.
            data: { navigation: 'home' } // Modified by Gowtham on nov 29 2025 for jira-id:SWSM-124
            //#SECURITY-VULNERABILITY-MERGING-END
          }
          this.props.updateStore(parameterInfo);
          const userInfo = this.props.Login.userInfo;
          const inputParam = {
            nusermultisitecode: userInfo.nusersitecode,
            slanguagetypecode: userInfo.slanguagetypecode,
            nusermultirolecode: roleItem.nusermultirolecode,
            nuserrolecode: roleItem.nuserrolecode,
            nmastersitecode: userInfo.nmastersitecode,
            nlogintypecode: userInfo.nlogintypecode,
            userinfo: userInfo
          }
          this.props.submitChangeRole(inputParam);
    }

    onChangeOwer=(item, role)=>{
        this.setState({ menuClick:false ,showAlertDashBoard:false,showSearch:false,searchText:"" })
        const parameterInfo = {
            typeName: DEFAULT_RETURN,
            //#SECURITY-VULNERABILITY-MERGING-START
            //data: { navigation: "" } // Modified by Vignesh(06-12-2025) for screen was not closing when changing the owner.
            data: { navigation: 'home' } // Modified by Gowtham on nov 29 2025 for jira-id:SWSM-124
            //#SECURITY-VULNERABILITY-MERGING-END
          }
          this.props.updateStore(parameterInfo);
          const inputData = {
            nuserrolecode: item.nuserrolecode,
            suserrolename: item.suserrolename,
            nusercode: item.nusercode,
            sdeputyid: item.sdeputyid,
            userinfo: this.props.Login.userInfo
          }
          this.props.changeOwner(inputData);
    }


    // selectInputOnChange = (event) => {
    //     let password = ""
    //     if (event !== null) {
    //         password = event.target.value
    //     }
    //     this.setState({ password: password })
    // }
    handleResize = () => {
        this.setState({          
            isDesktop: (window.innerWidth) >= 1280,
            isPortrait: (window.innerWidth) >= 1024,
        });
      }
      // Gowtham R -- ALPD-5190 -- 14/12/2024 -- for Vacuum Start
    // maintenanceBreakPopUp(breakTime){
    //     this.confirmMessage.confirm(
    //         "MaintainceBreakMessage",
    //         intl.formatMessage({
    //             id: "IDS_MAINTAINCEBREAK"
    //         }),
    //         intl.formatMessage({
    //             id: "IDS_MAINTAINCEBREAKMESSAGE"
    //         }),
    //         undefined,
    //         undefined,
    //         undefined,
    //         false,
    //         undefined,
    //         breakTime
    //     );
    // }

    // Gowtham R -- ALPD-5190 -- 14/12/2024 -- for Vacuum Start
    // maintenanceBreakTrigger() {
    //     let MaintenanceBreak = 0;
    //     if (PostgreSQLMaintenance.STARTHOUR > PostgreSQLMaintenance.ENDHOUR) {
    //         const minutesLeftToday = (60 - PostgreSQLMaintenance.STARTMINUTE) + ((23 - PostgreSQLMaintenance.STARTHOUR) * 60);
    //         const minutesNextDay = (PostgreSQLMaintenance.ENDHOUR * 60) + PostgreSQLMaintenance.ENDMINUTE;
    //         MaintenanceBreak = minutesLeftToday + minutesNextDay;
    //     } else if (PostgreSQLMaintenance.STARTHOUR < PostgreSQLMaintenance.ENDHOUR) {
    //         MaintenanceBreak = ((PostgreSQLMaintenance.ENDHOUR - PostgreSQLMaintenance.STARTHOUR) * 60)
    //             - PostgreSQLMaintenance.STARTMINUTE + PostgreSQLMaintenance.ENDMINUTE;
    //     } else {
    //         MaintenanceBreak = PostgreSQLMaintenance.ENDMINUTE - PostgreSQLMaintenance.STARTMINUTE;
    //     }    
    
    //     rsapi().post("/login/getJavaTime", {})
    //         .then(response => {
                
    //             this.date.setHours(response.data.Hours);
    //             this.date.setMinutes(response.data.Minutes);
    //             this.date.setSeconds(response.data.Seconds);

    //             const isMaintenanceTime = () => {
    //                 if (
    //                     (this.date.getHours() > PostgreSQLMaintenance.STARTHOUR || 
    //                     (this.date.getHours() === PostgreSQLMaintenance.STARTHOUR && this.date.getMinutes() >= PostgreSQLMaintenance.STARTMINUTE)) &&
    //                     (this.date.getHours() < PostgreSQLMaintenance.ENDHOUR || 
    //                     (this.date.getHours() === PostgreSQLMaintenance.ENDHOUR && this.date.getMinutes() < PostgreSQLMaintenance.ENDMINUTE))
    //                 ) {
    //                     MaintenanceBreak = PostgreSQLMaintenance.ENDMINUTE - this.date.getMinutes();
    //                     return true;
    //                 } else {
    //                     return false;
    //                 }
    //             };
                
    //             const incrementTimeByMinute = () => {
    //                 this.date.setMinutes(this.date.getMinutes() + 1);
    //                 if (this.date.getMinutes() === 60) {
    //                     this.date.setMinutes(0);
    //                     this.date.setHours(this.date.getHours() + 1);
    //                 }
    //                 if (this.date.getHours() === 24) {
    //                     this.date.setHours(0);
    //                 }
    //             };
                
    //             const maintenanceCheck = () => {
    //                 if (isMaintenanceTime()) {
    //                     this.maintenanceBreakPopUp(60000 * MaintenanceBreak);
    //                 }
    //             };

    //             maintenanceCheck();
                
    //             setTimeout(() => {
    //                 incrementTimeByMinute();
    //                 maintenanceCheck();

    //                 setInterval(() => {
    //                     incrementTimeByMinute();
    //                     maintenanceCheck();
    //                 }, 60000);

    //             }, (60 - (this.date.getSeconds() + 1)) * 1000);
    //         })
    //         .catch(error => {
    //           //  console.error("Error fetching login info", error);
    //             if (error.response?.status === 429) {
    //                toast.warn(intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
    //                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } });
    //            } else if (error.response?.status === 401 || error.response?.status === 403) {
    //                 const UnAuthorizedAccess = {
    //                     typeName: UN_AUTHORIZED_ACCESS,
    //                     data: {
    //                         navigation: 'forbiddenaccess',
    //                         loading: false,
    //                         responseStatus: error.response.status
    //                     }
    //                 }
    //                 this.props.updateStore(UnAuthorizedAccess);
    //             } else if (error.response.status === 500) {
    //                 toast.error(error.message);
    //             } else {
    //                 toast.warn(error.response.data);
    //             }
    //         });
    
    // }
    componentDidMount() {
        if(this.state.isPortrait){
            this.myDiv.addEventListener('onKeyPress', this.handleKey);
            this.myDiv.focus();
        }  
        window.addEventListener("resize", this.handleResize);
         // Gowtham R -- ALPD-5190 -- 14/12/2024 -- for Vacuum Start
        //  this.maintenanceBreakTrigger();
    }

    
    componentWillUnmount() {
        if(this.state.isPortrait){
            this.myDiv.removeEventListener('onKeyPress', this.handleKey);        
            this.setState({isDark:false});
            document.body.classList.remove('dark'); 
        }
        window.removeEventListener("resize", this.handleResize);
    }
    
    handleKey = e => {
        if(this.props.history.location.pathname === "/home" && e.target.name === undefined) {
            let defaultSearch = [] 
            this.props.Login.menuDesign.map((menuItem, index) => {
                menuItem.lstmodule && menuItem.lstmodule.map((moduleItem, moduleIndex) => {
                    moduleItem.lstforms && moduleItem.lstforms.map((formItem, formIndex) => {                    
                        if (formItem.sdisplayname.toLowerCase().includes(e.key.toLowerCase())) {
                            defaultSearch.push({ ...formItem, smodulename: moduleItem.sdisplayname })
                        }
                    })
                })
            })
            // ALPD-5296    Modified code for Enter value display when click enter button in the home page search box by Vishakh
            this.setState({ defaultSearch, searchText: e.charCode === 13 ? '' : e.key.toLowerCase(), menuClick: false,showSearch: !this.state.showSearch }) 
        }         
    }

    render() {
        this.confirmMessage = new ConfirmMessage();
        let modal = null;
        const commonProps = {
            //selectInputOnChange={this.selectInputOnChange}
            //commented by Syed on 27-SEP-2024
            //idealTime={this.props.Login.idleTimeout}
            //Added by Syed on 27-SEP-2024 - IDLE TIME OUT FROM SETTINGS TABLE
            handleLogin: this.handleLogin,
            handleLogout: this.handleLogout,
            UserInfo: this.props.Login.userInfo,
            passwordref: this.password,
            idealTime: this.props.Login.idleTimeout * (this.props.Login.settings && parseInt(this.props.Login.settings[1])),
            Login: this.props.Login,
            enterKeyLogin: this.enterKeyLogin,
            renderer: this.renderer
        };
        if (this.props.Login.showForbiddenModal === true) {
            modal = (
              <IdleTimeOutModal
                {...commonProps}
                showIdleModal={this.props.Login.showForbiddenModal}
                sessionExpired={Date.now() + 600000}
                showForbiddenModal={true}
                responseStatus={this.props.Login.responseStatus}
              />
            );
        } else {
            modal = (
              <IdleTimeOutModal
                {...commonProps}
                sessionExpired={this.state.sessionExpired}
                showIdleModal={this.state.showIdleModal}
              />
            );
        }
        return (
            <>
                <div id="app-wrapper">
                    {!this.props.Login.showForbiddenModal && (
                        <IdleTimer
                            ref={ref => { this.idleTimer = ref }}
                            element={document}
                            onActive={this._onActive}
                            onAction={this._onAction}
                            onIdle={this._onIdle}
                            debounce={250}
                            timeout={this.state.timeout}
                        />
                    )}
                    {this.props.Login.idleneed ? modal : ""}
                    
                    {this.state.isDesktop ?
                        <Sidebar history={this.props} layOutGetHome={this.layOutGetHome} inputRef={this.inputRef} fullView={this.state.fullView} menuHide={this.menuHide} menuFullview={this.menuFullview}
                        pinMenu={this.pinMenu} data={this.state.lenghtDvv} sidebarview={this.state.sidebarview} isPinned={this.state.isPinned}
                        />: <SidebarTablet history={this.props} layOutGetHome={this.layOutGetHome} inputRef={this.inputRef} fullView={this.state.fullView} menuHide={this.menuHide} menuFullview={this.menuFullview}
                        pinMenu={this.pinMenu} data={this.state.lenghtDvv} sidebarview={this.state.sidebarview} isPinned={this.state.isPinned}/>
                    }
                  {/* change password by Neeraj */}
                    <div id="content-wrapper" className={`d-flex flex-column`} ref={ref => this.myDiv = ref} tabIndex="0"  
                    //// ALPD-4794- Changed by Neeraj
                    onKeyPress={ this.props.Login.screenName ==="IDS_CHANGEPASSWORD"?"":this.handleKey} 
                        >
                        <div id="content">
                            <Header history={this.props} layOutGetHomeCancel={this.layOutGetHomeCancel} fullView={this.state.fullView} 
                            darkMode={this.darkMode} isDark={this.state.isDark} isDesktop={this.state.isDesktop}
                            visible={this.state.visible} menuFullview={this.menuFullview} toggleSearch={this.toggleSearch} showSearch={this.state.showSearch} searchBar={
                                <SearchBar options={this.state.defaultSearch}
                                    optionDisplayMember={'sdisplayname'}
                                    onClickButton={this.onClickButton}
                                    onInputChange={this.onInputChangeSearch}
                                    onInputChange1={this.onInputChangeSearch1}
                                    pathname={this.props.history.location.pathname}
                                    inputRef={this.inputRef}
                                    intl={this.props.intl}
                                    searchText={this.state.searchText}

                                /> } 
                                onChangeRol={this.onChangeRol} 
                                onChangeOwer={this.onChangeOwer} 
                                showAlertDashBoard={this.state.showAlertDashBoard}/>
                            <div className={`container-fluid px-0  ${!this.state.fullView ? 'sidebar-fullview':''}`}>
                                <ScrollToTop>
                                    <Switch>
                                        {routes.map((route, index) => {
                                            return route.component ? (
                                                <Route
                                                    key={index}
                                                    path={route.path}
                                                    exact={route.exact}
                                                    name={route.name}
                                                    render={props => (
                                                        <route.component
                                                            onClickSearchMenu={this.onClickSearchMenu}
                                                            onClickSearchForm={this.onClickButton}
                                                            menuClick={this.state.menuClick}
                                                            onClickBackToMenu={this.onClickBackToMenu}
                                                            searchText={this.state.searchText} defaultSearch={this.state.defaultSearch} {...props}
                                                            parentFunction={this.parentFunction}
                                                            carRef={this.carRef}
                                                            carRef1={this.carRef1}
                                                            data={this.state.lenghtDvv}
                                                            sidebarview={this.state.sidebarview} 
                                                            isPinned={this.state.isPinned}
                                                              />
                                                    )} />
                                            ) : (null);
                                        })}
                                    </Switch>
                                </ScrollToTop>
                            </div>
                        </div>
                    </div>
                </div>
                   <>
                  <div class="align-items-center login-info-portrait">
                    <img src={iconScreenSize} className="img-fluid border"  />
                    <h5 className='m-4 p-4 text-center'>"This message typically indicates that the application or website you're trying to access requires a screen resolution of 1024 pixels or wider to display properly. If you're using a tablet, please turn it to landscape mode. This requirement ensures a good user experience and proper layout."</h5>
                  </div>
                  </>
            </>
        );
    }
}

Layout.propTypes = {
    match: PropTypes.any.isRequired,
    history: PropTypes.func.isRequired
}

export default connect(mapStateToProps, { navPage, updateStore, callService, getDashBoardForHome,getListAlert,submitChangeRole,changeOwner })(injectIntl(Layout));