import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Navbar, Nav, Dropdown, Image, Media, NavLink, NavDropdown, NavItem, Badge } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { submitUserTheme, getChangeUserRole, submitChangeRole, getPassWordPolicy, confirmOTP,sendOTPMail, resendOTP,updateActiveStatusMFA, updateStore, changepassword, getAuthenticationMFA, changeOwner, logOutAuditAction, getListAlert, getDigitalSign, saveDigitalSign, crudMaster, validateEsignforDigitalSignature, getcolorMaster, getAboutInfo } from '../../actions'
import rsapi from '../../rsapi';
import { AtHeader, NavPrimaryHeader, ProfileImage, DashboardIcon } from '../header/header.styles';
import { faSearch, faSignature,faCamera, faEdit} from '@fortawesome/free-solid-svg-icons';
import '../../assets/styles/login.css';
import { ReactComponent as SearchIcon } from '../../assets/image/icon-search.svg';
import { ReactComponent as BellIcon } from '../../assets/image/icon-bell.svg';
 import { ReactComponent as DashboardHeader } from '../../assets/image/dashboard-header.svg';
import SlideOutModal from '../slide-out-modal/SlideOutModal';
import ChangePassWord from '../../pages/Login/ChangePassWord';
import { DEFAULT_RETURN, UN_AUTHORIZED_ACCESS } from '../../actions/LoginTypes';
import { changePasswordValidation, fnPassMessage } from '../../pages/Login/LoginCommonFunction';
import { LOGINTYPE, transactionStatus } from '../Enumeration';
import PortalModal from '../../PortalModal';
import SliderPage from '../slider-page/slider-page-component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKey, faPowerOff, faUserCog, faUsersCog,faPalette,faFont,faMinus,faPlus,faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { createImageFromInitials } from './headerutils';
// import { Tooltip } from '@progress/kendo-react-tooltip';
import { getSelectedAlert } from '../../actions/AlertViewAction';
import '../../pages/dashboardtypes/Alert.css';
import AddDigitalSignature from '../../pages/Login/AddDigitalSignature';
import { Lims_JSON_stringify, create_UUID, onSaveMandatoryValidation } from '../../components/CommonScript';
import Esign from '../../pages/audittrail/Esign';
import AddorUpdateProfileImage from '../../pages/credentialmanagement/AddorUpdateProfileImage';
import {getUserProfileImage,updateUserProfilePicture,closeProfilePictureDialog} from '../../actions/UserAction'
import { intl } from '../App';
import About  from '../../pages/credentialmanagement/About';
import AddUserAuthentication from '../../pages/Login/AddUserAuthentication';
import {getDashBoardForHome} from '../../actions/LoginAction';
//syed testing

const mapStateToProps = (state) => {
  return {
    Login: state.Login
  }
}

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {      
      createPwdRecord: {},
      createSecurityKey: {},
      selectedAuthRecord:{},
      alert: [],
      sliderOpen: false,
      nflag: 2,
      quickSettingOpen: false.valueOf,
      fontSize: this.props.Login.selectedUserUiConfig? this.props.Login.selectedUserUiConfig.nfontsize : 3,
      show: true,
      max:6,
      min:0,
      openProfilePictureDialog:false,
      profiledata:{},
      uploadedProfileImage:{}
    }

  }
  IncrementItem = () => {
    let selectedUserUiConfig = this.props.Login.selectedUserUiConfig? this.props.Login.selectedUserUiConfig : {};
    let increasefontvalue = this.props.Login.settings && this.props.Login.settings[51];
    if(this.state.fontSize > 9) {
    }else {
        this.setState({
        fontSize: parseInt(this.state.fontSize) + parseInt(increasefontvalue)
    });
        selectedUserUiConfig["nfontsize"] = parseInt(this.state.fontSize) + parseInt(increasefontvalue);
        selectedUserUiConfig["nthemecolorcode"] = this.props.Login.selectedUserUiConfig && this.props.Login.selectedUserUiConfig !== null ?
        this.props.Login.selectedUserUiConfig.nthemecolorcode : 1;
        selectedUserUiConfig["sthemecolorhexcode"] = this.props.Login.selectedUserUiConfig && this.props.Login.selectedUserUiConfig !== null ?
        this.props.Login.selectedUserUiConfig.sthemecolorhexcode : '#1268e3';
        delete selectedUserUiConfig["dmodifieddate"];
        this.props.submitUserTheme(selectedUserUiConfig,this.props.Login.userInfo);
    }
  }
  DecreaseItem = () => {
    let selectedUserUiConfig = this.props.Login.selectedUserUiConfig? this.props.Login.selectedUserUiConfig : {};    
    let increasefontvalue = this.props.Login.settings && this.props.Login.settings[51];
    if(this.state.fontSize > 1) {      
      this.setState({ fontSize: parseInt(this.state.fontSize) - parseInt(increasefontvalue) });
    }
    selectedUserUiConfig["nfontsize"] = this.state.fontSize - parseInt(increasefontvalue)
    selectedUserUiConfig["nthemecolorcode"] = this.props.Login.selectedUserUiConfig && this.props.Login.selectedUserUiConfig !== null ?
    this.props.Login.selectedUserUiConfig.nthemecolorcode : 1;
    selectedUserUiConfig["sthemecolorhexcode"] = this.props.Login.selectedUserUiConfig && this.props.Login.selectedUserUiConfig !== null ?
        this.props.Login.selectedUserUiConfig.sthemecolorhexcode : '#1268e3';
    delete selectedUserUiConfig["dmodifieddate"];
    this.props.submitUserTheme(selectedUserUiConfig,this.props.Login.userInfo);
  }

  onChangeRole() {
    rsapi().post("/login/getchangerole", { "userInfo": this.props.Login.userInfo })
      .then(response => {
        const responseData = response.data;
        this.setState({
          show: true,
          UserMultiRole: responseData.UserMultiRole,
          nusermultirolecode: {
            label: responseData.UserMultiRole[0].suserrolename, value: responseData.UserMultiRole[0].nusermultirolecode,
            item: responseData.UserMultiRole[0]
          }
        });
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
        } else if (error.status === 205) {
          toast.warn(error.message)
        } else {
          toast.error(error.message)
        }
      });
  }

  onLogout() {
    const inputData = {
      userinfo: this.props.Login.userInfo,
      scomments: this.props.intl.formatMessage({ id: "IDS_LOGOUT" }),
      sauditaction: "IDS_LOGOUT"
    };
    this.props.logOutAuditAction(inputData, this.props.Login.languageList);
  }

  openAlert = () => {
    this.setState({ showDashboard: !this.state.showDashboard, nflag: 2 });
  }

  openQuickSetting = () => {
    this.setState({ quickSettingOpen: !this.state.quickSettingOpen })
  }

  openDashBoard = () => {
    if(this.state.showDashboard === undefined || this.state.showDashboard === false){
      const userInfo = {
        ...this.props.Login.userInfo
      }
      const updateInfo = {
        typeName: DEFAULT_RETURN,
        data: {  userInfo, loading: false, }
      }
      this.props.getDashBoardForHome(updateInfo)
    }
    this.setState({ showDashboard: !this.state.showDashboard, nflag: 1 })
  }

  // openDashBoardbyHittingBackend = () =>{
  //   const userInfo = {
  //     ...this.props.Login.userInfo
  //   }
  //   const updateInfo = {
  //     typeName: DEFAULT_RETURN,
  //     data: {  userInfo, loading: false, }
  //   }
  //   this.props.getDashBoardForHome(updateInfo);
  //   this.setState({ showDashboard: !this.state.showDashboard, nflag: 1 })
  // }

  onInput() {
    var input = document.getElementById("typeinp");
    var currentVal = input.value;
    this.setState({
      value: currentVal
    })
    document.body.classList.remove('font-1','font-2','font-3','font-4','font-5'); 
    document.body.classList.add('font-'+this.state.fontSize); 
}
  onhandleOpenProfilePicDialog(){    this.props.getUserProfileImage(this.props.Login.userInfo);
 }
  onUploadingImage=(event,uploadedImagefile)=>{
    const formData = new FormData(); 
    formData.append("uploadedFile0", uploadedImagefile);
    formData.append("filename",uploadedImagefile.name);
    formData.append("uniquefilename0", create_UUID() + '.' +uploadedImagefile.name.split('.')[1]);
    formData.append("filecount",1);
    formData.append("userinfo",JSON.stringify(this.props.Login.userInfo));    
    this.setState({uploadedProfileImage:formData});
    //console.log(this.state.uploadedProfileImage);
}

  uploadProfileImage=()=>{
   this.props.updateUserProfilePicture(this.state.uploadedProfileImage)
  }

  onCloseProfilePictureDialog=()=>{   
  this.props.closeProfilePictureDialog()
  }
  //ALPD-4102
  closeAbout = () => {

    const updateInfo = {
      typeName: DEFAULT_RETURN,
      data: {
        screenName: "IDS_ABOUT",
        openAboutModal: false

      },
    };

    this.props.updateStore(updateInfo);
  };
  render() {
    const { susername, suserrolename, nuserrole, nlogintypecode, ssitename, nusercode,sdeputyusername,sdeputyuserrolename,sdeputyid} = this.props.Login.userInfo;
    const { deputyUser, userMultiRole, isDeputyLogin, userImagePath, settings, profileColor,colortheme,mfaAuthentication } = this.props.Login;
    const currentTheme = this.props.Login.selectedUserUiConfig && this.props.Login.selectedUserUiConfig.sthemecolorname;

    document.body.classList.remove('font-1','font-2','font-3','font-4','font-5','font-6','font-7','font-8','font-9','font-10'); 
    document.body.classList.add('font-'+this.state.fontSize); 


    // const url1 = "https://www.google.com/search?q=javascript";
    // const urlObject = new URL(url1);
    // console.log("Url:",urlObject.hostname);

    //const url2 = "https://www.google.com/search?q=javascript";
    // const urlObject1 = new URL(Window.location.origin);
    // console.log("Url2:",urlObject1.hostname);
    
    return (
        <>
          {/* <ReactTooltip place="bottom" id="tooltip-grid-wrap" globalEventOff='click' /> */}
          <AtHeader>
            <Navbar className="p-0" bg="light" fixed="top">
              <Navbar.Brand>
                <NavPrimaryHeader className="at-nav-brand">
                  {this.props.Login && this.props.Login.displayName ?
                    <FormattedMessage id={this.props.Login.displayName} /> : ""}
                </NavPrimaryHeader>
              </Navbar.Brand>
              {/* <div style={{ "margin-left": this.props.Login.displayName!==""?"-20%":"-40px"}}>
              {this.props.searchBar}
            </div> */}
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav" className="d-flex align-items-center justify-content-end">
                {/* <ReactTooltip/> onClick={this.setFullview} */}
  
                <Nav>
  
  
                {/* <input id="typeinp" type="range" min="1" className='text-range' max="5" step="1" defaultValue="3" onInput={this.onInput.bind(this)}/> */}
  
                  {this.props.showSearch ?
                    <DashboardIcon className='mr-2'>
                      <span>
                        {this.props.searchBar}
                      </span>
                    </DashboardIcon> : ""
  
  
                  }
                  <Nav.Item className='d-flex'>
                    <DashboardIcon className='position-relative topbar-search  ml-0'>
                      {this.props.showSearch ?
                        <div className="search-icon search-icon-header position-absolute search-close-icon" onClick={this.props.layOutGetHomeCancel}><i class="fa fa-times" aria-hidden="true"></i></div> :
                        <SearchIcon className="search-icon search-icon-header position-absolute zoom" onClick={this.props.toggleSearch}
                        >
                          <FontAwesomeIcon icon={faSearch} />
                        </SearchIcon>
  
                      }
                       
                    </DashboardIcon>
                    {this.props.showAlertDashBoard ?
                        <>
                    {/* Uncommented by Vishakh */}
                    <DashboardIcon >
                    <Nav.Link data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_DASHBOARD" })}
                      onClick={
                        // this.openDashBoardbyHittingBackend
                        this.openDashBoard
                      } 
                      className="zoom dashboard-icon">                
                      <DashboardHeader width='26px' height='26px' />
                    </Nav.Link>
                  </DashboardIcon>
        
                  <DashboardIcon className='position-relative  mr-1'>
                    <div className="fa_stack fa-2x the-wrapper" data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_ALERTS" })}
                      onClick={this.openAlert} class="zoom">
                        <BellIcon></BellIcon>
                      {/* <FontAwesomeIcon icon={faBell} style={{ 'font-size': '23px' }} /> */}
                    </div>
                    <div className="icon icon_Badge position-absolute" style={{ "width": this.state.alert && this.state.alert.length > 9 ? "52%" : "46%" }}>
                      {this.state.alert && this.state.alert.length > 0 ?
                        <Badge pill variant="danger">{this.state.alert && this.state.alert.length}</Badge>
                        : ""}
  
                    </div>
                  </DashboardIcon> 
    
                     </>
                :""}
                    </Nav.Item>
  
                  
                  {/* <ListView
                data={alert}
                openslide={this.openDashBoard}
                getSelectedAlert={getSelectedAlert}
                userInfo={this.props.Login.userInfo}
                > */}
                  {/* </ListView> */}
                  {/* <Button className="btn btn-circle outline-grey ml-2" style={{ "border-color": " rgba(187, 194, 203, 0.41)!important" }} variant="link" role="button"
                                          title={this.props.intl.formatMessage({ id: "IDS_ALERT" })}
                                          onClick={this.openAlert}>
                                          <FontAwesomeIcon icon={faBell}  style={{ "width": "0.6!important" }}/>
                                          <div style={{"margin-bottom":"11px"}}>
                    <Badge pill variant="secondary">{alert&&alert.length}</Badge>
                    </div>
                     </Button> */}
                  {/* <DashboardIcon className='position-relative'>
                    <div className="fa_stack fa-2x the-wrapper" data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_ALERTS" })}
                      onClick={this.openAlert} class="zoom">
                      <FontAwesomeIcon icon={faBell} style={{ 'font-size': '26px' }} />
                    </div>
                    <div className="icon icon_Badge position-absolute" style={{ "width": this.state.alert && this.state.alert.length > 9 ? "52%" : "46%" }}>
                      {this.state.alert && this.state.alert.length > 0 ?
                        <Badge pill variant="danger">{this.state.alert && this.state.alert.length}</Badge>
                        : ""}
  
                    </div>
                  </DashboardIcon> */}
                  {/* <DashboardIcon className='mr-0'>
                    <Nav.Link data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_DASHBOARD" })}
                      onClick={this.openDashBoard} className="zoom dashboard-icon">                
                      <DashboardHeader width='26px' height='26px' />
                    </Nav.Link>
                  </DashboardIcon> */} 
  
  
                  {/* {this.props.history.location.pathname !='/home' &&                                                             
                        <DashboardIcon className='mr-0'>   
                            <Nav.Link className='zoom'>       
                            {this.props.fullView &&      
                                  <FullviewExpand width='26px' height='26px' onClick={this.props.menuFullview} /> 
                              }
                            {!this.props.fullView &&     
                                  <FullviewCollapse width='26px' height='26px' onClick={this.props.menuFullview} />
                            }
                            </Nav.Link>  
                          </DashboardIcon> 
                      } */}
                  {/* <Tooltip position="bottom" anchorElement="target" openDelay={100} parentTitle={true}> */}
  
                  <NavDropdown className="no-arrow" alignRight title={<Media >
                    <ProfileImage>
                      {settings && settings[5] && userImagePath && userImagePath !== "" ?
                        <Image src={settings[5] + userImagePath}
                          alt="avatar" className="rounded-circle mr-2" width="36" height="36" /> : <Image className="rounded-circle mr-2"
                            src={createImageFromInitials(32, susername ? susername.charAt(0).toUpperCase() : "", !currentTheme  ? profileColor : currentTheme)}
                        />}
                    </ProfileImage>
                    {/* {<Media.Body bsPrefix="media-profileinfo">
                        <span className="user-name user-role" data-tooltip-id="my-tooltip" data-tooltip-content={susername} data-place="bottom">{susername}</span>
                        <span className="role user-role" data-tooltip-id="my-tooltip" data-tooltip-content={suserrolename} data-place="bottom">{suserrolename}</span>
                      </Media.Body> } */}
                    {/* :
                      <Image src={userImagePath === "" ? userImg : fileViewURL + "/SharedFolder/UserProfile/" + userImagePath}
                        alt="avatar" className="img-profile rounded-circle mr-2" />
                    } */}
  
                    {/* <FontAwesomeIcon className="align-self-center down-icon ml-2" icon={faChevronDown} /> */}
                  </Media>}>
                    {/* <ProfileLayer>
                      <ProfileImageLayer>
                        {userImagePath === "" ?
                          <Image className="rounded-circle mr-2"
                            src={createImageFromInitials(80, susername ? susername.charAt(0).toUpperCase() : "", profileColor)}
                          /> : <Image src={fileViewURL + "/SharedFolder/UserProfile/" + userImagePath}
                            alt="avatar" className="rounded-circle mr-2" width="80" height="80" />}
                      </ProfileImageLayer>
                      <Profile>
                        <ProfileName>{susername}</ProfileName>
                        <ProfileRole>{suserrolename}</ProfileRole>
                      </Profile>
                    </ProfileLayer> */}
                    {/* <Media className="dropdown-menu-animated">
                    <ProfileImage>
                              {settings && settings[5] && userImagePath && userImagePath !== "" ?
                                <Image src={settings[5] + userImagePath}
                                  alt="avatar" className="ml-2" width="36" height="36" /> : <Image className="rounded-circle ml-2 mr-3"
                                    style = {{width:"3rem",height:"3rem"}} src={createImageFromInitials(32, susername ? susername.charAt(0).toUpperCase() : "", profileColor)}
                                />}
                          </ProfileImage>
                      <Media.Body bsPrefix="media-profileinfo">
                        <span className="user-name user-role" data-tooltip-id="my-tooltip" data-tooltip-content={susername} data-place="bottom">{susername}</span>
                        <span className="role user-role" data-tooltip-id="my-tooltip" data-tooltip-content={suserrolename} data-place="bottom">{suserrolename}</span>
                      </Media.Body>
                      </Media> */}
                    <div class="profile-img-block pt-2">
                      <ProfileImage className="mx-3 mb-3 pt-2 text-center position-relative">
                        {settings && settings[5] && userImagePath && userImagePath !== "" ?
                          <Image src={settings[5] + userImagePath}
                            alt="avatar" className="profile-img rounded-circle mr-2" /> : <Image className="profile-img rounded-circle mr-2"
                              src={createImageFromInitials(32, susername ? susername.charAt(0).toUpperCase() : "", !currentTheme ? profileColor : currentTheme)}                            
                          />
                           }
                            {nlogintypecode && nlogintypecode === LOGINTYPE.INTERNAL && !isDeputyLogin &&
                              <span className='profile-image-edit' onClick={()=>this.onhandleOpenProfilePicDialog()}>
                                <FontAwesomeIcon icon={faEdit} />
                              </span>
                            }
                      </ProfileImage>
  
                      <div class="d-block text-center">
                        <span className="user-name d-block mb-1" data-tooltip-id="my-tooltip" data-tooltip-content={susername} data-place="bottom">{susername}</span>
                        <span className="role d-block mb-1" data-tooltip-id="my-tooltip" data-tooltip-content={suserrolename} data-place="bottom">{suserrolename}</span>
                        {//ALPD-4262(04-06-2024)--Vigensh R--Can't able to login in session logout appear while using the deputy user in specific scenario.
                        }
                         {isDeputyLogin&&isDeputyLogin?
                          <span className="role d-block mb-1" data-tooltip-id="my-tooltip" data-tooltip-content={sdeputyusername} data-place="bottom"><FormattedMessage id="IDS_DEPUTEDFOR" defaultMessage="Deputed for" />
  {` : ${sdeputyusername}[${sdeputyid}]-${sdeputyuserrolename}`}</span>  //Added  by sonia on  Added by sonia on 6th Aug 2024 for JIRA ID:ALPD-4181
  :""} 
                        
                        <span className="role d-block mb-3" data-tooltip-id="my-tooltip" data-tooltip-content={ssitename} data-place="bottom">{ssitename}</span>
                      </div>
                      <div class="dropdown-divider"></div>
                    </div>
                   <div className='theme-text'>
                    {/* Janakumar ATE234 -> ALPD-5207 LIMS Header Dark Mode & Light Mode shows in same English. */}
                    <div onClick={()=> this.props.darkMode()} className='mode-change'>
                        {this.props.isDark?
                        <><i class="fa fa-sun mr-1" aria-hidden="true"></i> {<FormattedMessage id="IDS_DARKMODE" defaultMessage="Dark Mode" />}</>:
                        <><i class="fa fa-moon mr-1" aria-hidden="true"></i> {<FormattedMessage id="IDS_LIGHTMODE" defaultMessage="Light Mode" />}</>
                      }      
                    </div>
                   </div>
                    {colortheme && colortheme.length > 0 &&
                   <>
                   {!this.props.isDark?
                   <>
                   <div class="dropdown-divider"></div>
                   <div className='theme-text'>
                    <div>
                      <FontAwesomeIcon icon={faPalette} className="mr-2" />
                      <FormattedMessage id="IDS_THEME" defaultMessage="Theme" />
                    </div>                  
                      {colortheme.map((item, index) => { 
                            return (                           
                              <div key={`themeindex_${index}`} onClick={() => this.submitUserTheme(item)} 
                              style={{
                                background: item.sthemecolorhexcode,
                              }}
                              className={`theme-change-menu-item ${currentTheme !=null ? item.sthemecolorname === currentTheme ? "active theme-nav" : "" :item.nthemecolorcode === 1 ? "active theme-nav":""
                            }`}><span className="role-change d-block" data-place="bottom">{item.sthemecolorname}</span></div>
                            )
                          })}                      
                   </div>
                   </> : ''}
                  
                      <Dropdown as={NavItem} drop={"left"} className="ml-2 ">
                        {/* <Dropdown.Toggle as={NavLink}>
                          <FontAwesomeIcon icon={faUserCog} className="mr-2" />
                          <FormattedMessage id="IDS_THEME" defaultMessage="Theme" /><br/>
                          {colortheme.map((item, index) => { 
                             console.log(item.scolorhexcode)
                            return (                           
                              <div key={`themeindex_${index}`} onClick={() => this.submitUserTheme(item)} 
                              style={{
                                background: item.scolorhexcode,
                              }}
                              className={`theme-change-menu-item ${item.scolorname == currentTheme ? "active theme-nav" : ""
                            }`}><span className="role-change d-block" data-tooltip-id="my-tooltip" data-tooltip-content={item.scolorname} data-place="bottom">{item.scolorname}</span></div>
                            )
                          })}
                        </Dropdown.Toggle> */}
                        {/* <Dropdown.Menu>
                          {colortheme.map((item, index) => { 
                             console.log(item.scolorhexcode)
                            return (                           
                              <div key={`themeindex_${index}`} onClick={() => this.submitUserTheme(item)} 
                              style={{
                                background: item.scolorhexcode,
                              }}
                              className={`theme-change-menu-item ${item.scolorname == currentTheme ? "active theme-nav" : ""
                            }`}><span className="role-change d-block" data-tooltip-id="my-tooltip" data-tooltip-content={item.scolorname} data-place="bottom">{item.scolorname}</span></div>
                            )
                          })}
                        </Dropdown.Menu> */}
                      </Dropdown>
                      </>
                      }                            
                    {this.props.isDesktop?
                     <>
                    <div class="dropdown-divider"></div>       
                  <div className='text-range'>
                    <div className='mb-2'>
                      <FontAwesomeIcon icon={faFont} className="mr-2" />
                      <FormattedMessage id="IDS_FONTSIZE" defaultMessage="Font Size" />
                      <span  onClick={() =>this.DecreaseItem()}
                      className={`btn btn-circle ml-2 nav-link font-sizer-icon ${this.state.fontSize && this.state.fontSize === 1 ? "disabled" : ""  }`}
                      ><FontAwesomeIcon icon={faMinus} /></span>
                      <span className='ml-2'>
                          {this.state.fontSize/2+.5}
                      </span>
                      <span onClick={() =>this.IncrementItem()}
                      className={`btn btn-circle ml-2 nav-link font-sizer-icon ${this.state.fontSize && this.state.fontSize === 9 ? "disabled" : ""  }`}
                      ><FontAwesomeIcon icon={faPlus} /></span>
                    </div>
                    {/* <Button onClick={() =>this.DecreaseItem ()} className='font-sizer-icon mr-2' >A<sup>-</sup></Button>
                    <Button onClick={() =>this.IncrementItem ()} className='font-sizer-icon' >A<sup>+</sup></Button> */}
                    
                  </div>
                    </> 
                     : '' }  
                    
                  
                  <div class="dropdown-divider"></div>
                    {userMultiRole && userMultiRole.length > 0 &&
                      <Dropdown as={NavItem} drop={"left"} className="ml-2 ">
                        <Dropdown.Toggle as={NavLink}>
                          <FontAwesomeIcon icon={faUserCog} className="mr-2" />
                          <FormattedMessage id="IDS_CHANGEROLE" defaultMessage="Change Role" />
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          {userMultiRole.map((item, index) => {
                            return (
                              <Dropdown.Item key={`roleindex_${index}`} onClick={() => this.submitChangeRole(item)}><span className="role-change d-block" data-tooltip-id="my-tooltip" data-tooltip-content={item.suserrolename} data-place="bottom">{item.suserrolename}</span></Dropdown.Item>
                            )
                          })}
                        </Dropdown.Menu>
                      </Dropdown>}
                    {!isDeputyLogin && deputyUser && deputyUser.length > 0 &&
                      <Dropdown as={NavItem} drop={"left"} className="ml-2">
                        <Dropdown.Toggle as={NavLink}>
                          <FontAwesomeIcon icon={faUsersCog} className="mr-2" />
                          <FormattedMessage id="IDS_CHANGEOWNER" defaultMessage="Change Owner" />
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          {this.props.Login.deputyUser.map((item, index) => {
                            return (
                              item.lstUserMultiDeputy && item.lstUserMultiDeputy.length > 1 ?
                                <Dropdown as={NavItem} drop={"left"} className="ml-2">
                                  <Dropdown.Toggle as={NavLink}>{`${item.sdeputyname}[${item.sdeputyid}]-${item.suserrolename}`}</Dropdown.Toggle>
                                  <Dropdown.Menu>
                                    {item.lstUserMultiDeputy.map((role, index) => {
                                      return <Dropdown.Item key={`roleIndex_${index}`} className="text-truncate d-block" onClick={() => this.submitChangeOwner(item, role)}>{role.suserrolename}</Dropdown.Item>
                                    })}
                                  </Dropdown.Menu>
                                </Dropdown>
                                : <Dropdown.Item key={`deptuserindex_${index}`} className="text-truncate d-block" onClick={() => this.submitChangeOwner(item, item.lstUserMultiDeputy[0])}>{item.sdeputyname + "[" + item.sdeputyid + "]" + "-" + item.suserrolename}</Dropdown.Item>
                            )
                          })}
                        </Dropdown.Menu>
                      </Dropdown>
                    }
                   
                    { 
                    (nusercode !== -1) && settings && settings[33] && parseInt(settings[33]) === transactionStatus.YES && 
                      <NavDropdown.Item onClick={() => this.props.getDigitalSign(nusercode, this.props.Login.userInfo)}>
                        <FontAwesomeIcon icon={faSignature} className="mr-2" />
                        <FormattedMessage id="IDS_DIGITALSIGNATURE" defaultMessage="Digital Signature" />
                      </NavDropdown.Item>
                    }
                    {nlogintypecode && nlogintypecode === LOGINTYPE.INTERNAL && !isDeputyLogin &&
                      <NavDropdown.Item onClick={() => this.props.getPassWordPolicy(nuserrole)}>
                        <FontAwesomeIcon icon={faKey} className="mr-2" />
                        <FormattedMessage id="IDS_CHANGEPASSWORD" defaultMessage="Change Password" />
                      </NavDropdown.Item>}
                       {/*ALPDJ21-19--Added by vignesh(21-07-2025)--for Email Authentication.*/}
                  { 
                  (nusercode !== -1) && settings && settings[83] && parseInt(settings[83]) === transactionStatus.NO && 
                    <NavDropdown.Item onClick={() => this.props.getAuthenticationMFA(parseInt(settings[83]), this.props.Login.userInfo,this.state.selectedAuthRecord)}>
                      <FontAwesomeIcon icon={faSignature} className="mr-2" />
                      <FormattedMessage id="IDS_AUTHENTICATION" defaultMessage="Authentication" />
                    </NavDropdown.Item>
                  }
                 
                       {nlogintypecode && nlogintypecode === LOGINTYPE.INTERNAL && !isDeputyLogin &&
                      <NavDropdown.Item onClick={()=>this.onhandleOpenProfilePicDialog()}>
                        <FontAwesomeIcon icon={faCamera} className="mr-2" />
                        <FormattedMessage id="IDS_UPDATEUSERPROFILEIMAGE" defaultMessage="Update Profile Photo" />
                      </NavDropdown.Item>} 
            
                      <NavDropdown.Item onClick={() => this.props.getAboutInfo(this.props.Login.userInfo)}>
                        <FontAwesomeIcon icon={faInfoCircle} className="mr-2" />
                        <FormattedMessage id="IDS_ABOUT" defaultMessage="About" />
                      </NavDropdown.Item>
                  
  
                    <NavDropdown.Item onClick={() => this.onLogout()}>
                      <FontAwesomeIcon icon={faPowerOff} className="mr-2" />
                      <FormattedMessage id="IDS_LOGOUT" defaultMessage="Logout" />
                    </NavDropdown.Item>
                    </NavDropdown>
                    
  
                  
                  {/* </Tooltip> */}
                  {/* <PortalModal>
                    <SliderPage sliderOpen={this.state.sliderOpen} openDashBoard={this.openDashBoard}
                      component={<h1>Dash Board</h1>}>
                    </SliderPage>
                  </PortalModal>
  
                  <PortalModal>
                    <SliderPage sliderOpen={this.state.quickSettingOpen} openQuickSetting={this.openQuickSetting}
                      component={<h1>Alert</h1>}>
                    </SliderPage>
                  </PortalModal> */}
  
                  {/* <Dropdown alignRight className="no-arrow">
  
                    <Dropdown.Toggle id="dropdown-basic" as={NavLink}>
                      <Media>
                        <Image  src={userImg} alt="avatar" className="img-profile rounded-circle mr-2" />
                          <Media.Body>
                            <span className="user-name">{susername}</span>
                            <span className="role">{suserrolename}</span>
                          </Media.Body>
                          <FontAwesomeIcon className="align-self-center down-icon ml-2" icon={faChevronDown} />
                      </Media>
                    </Dropdown.Toggle>
  
                    <Dropdown.Menu>
                      {this.props.Login.nchangerolecount > 0 && 
                      <>
                        <Dropdown.Item onClick={()=>this.props.getChangeUserRole(this.props.Login.userInfo)}>
                            <FormattedMessage id="IDS_CHANGEROLE" defaultMessage="Change Role" />
                        </Dropdown.Item>
                        <Dropdown as={NavItem} drop={"left"}>
                          <Dropdown.Toggle as={NavLink}>
                            <FormattedMessage id="IDS_CHANGEROLE" defaultMessage="Change Role" />
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Item>Hello there!</Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                        </>}
                      {this.props.Login.ndeputyCount > 0 && 
                        <Dropdown.Item onClick={ () => this.onChangeOwner() }>
                            <FormattedMessage id="IDS_CHANGEOWNER" defaultMessage="Change Owner" />
                        </Dropdown.Item>}
                        <Dropdown.Item>
                            <FormattedMessage id="IDS_CHANGEPASSWORD" defaultMessage="Change Password" />
                        </Dropdown.Item>
                        <Dropdown.Item>
                            <FormattedMessage id="IDS_LOCK" defaultMessage="Lock" />
                        </Dropdown.Item>
                        <Dropdown.Item onClick={ () => this.onLogout()}>
                            <FormattedMessage id="IDS_LOGOUT" defaultMessage="Log Out" />
                        </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown> */}
                </Nav>
              </Navbar.Collapse>
  
            </Navbar>
  
          </AtHeader>
  
          <PortalModal>
            <SliderPage show={this.state.showDashboard} nflag={this.state.nflag} closeModal={this.openDashBoard} />
          </PortalModal>
          {this.props.Login.openCPModal && (this.props.Login.screenName === "IDS_CHANGEPASSWORD" || this.props.Login.screenName === "IDS_DIGITALSIGNATURE" 
                || this.props.Login.screenName === "IDS_AUTHENTICATION") &&
            <SlideOutModal
              show={this.props.Login.openCPModal}
              closeModal={this.props.Login.screenName === "IDS_AUTHENTICATION" ? this.closeModalEmail : this.closeModal}
              loginoperation={true}
              hideSave={this.props.Login.screenName === "IDS_AUTHENTICATION"}
              inputParam={{}}
              screenName={this.props.Login.screenName}
              onSaveClick={this.props.Login.screenName === "IDS_CHANGEPASSWORD" ? this.onChangePassword :this.onDigitalSignatureSaveClick}
              selectedRecord={this.props.Login.screenName === "IDS_CHANGEPASSWORD" ? this.state.createPwdRecord || {} : this.state.selectedDigiSign || {}}
              mandatoryFields={this.mandatoryFieldFunction()}
              validateEsign={this.validateEsign}
              esign={this.props.Login.loadEsign}
              addComponent={this.props.Login.loadEsign === true ?
                <Esign operation={"update"}
                  // onInputOnChange={this.onInputChange.bind(this)}
                  onInputOnChange={(event) => {this.onInputChange(event)}}
                  inputParam={this.props.Login.screenData.inputParam}
                  selectedRecord={this.state.selectedDigiSign || {}}
                />
                :
                this.props.Login.screenName === "IDS_CHANGEPASSWORD" ?
                  <ChangePassWord
                    sloginid={this.props.Login.userInfo.sloginid}
                    createPwdRecord={this.state.createPwdRecord}
                    msg={fnPassMessage(this.props.Login.passwordPolicy)}
                    onInputChange={(event) => this.onInputChange(event)}
                  />:
			//ALPD-6042--Added by vignesh(09-07-2025)--for Email Authentication.
              this.props.Login.screenName === "IDS_AUTHENTICATION" ?

                 <AddUserAuthentication
                  selectedAuthRecord={this.state.selectedAuthRecord}
                 // showEmailOTPModal={this.props.Login.showEmailOTPModal}
                  onInputChange={(event) => this.onInputChange(event)}
                  onVerifyOTP={this.onVerifyOTP}
                  sendOTPMail={this.sendOTPMail}
                  onCompleteEmailOTP={this.onCompleteEmailOTP}
                  mfaType={this.props.Login.mfaType}
                  onComboChange={this.onComboChange}
                  userInfo={this.props.Login.userInfo}
                />
                :
                  <AddDigitalSignature
                    maxSize={20}
                    maxFiles={1}
                    multiple={false}
                    onDropAccepted={this.onDropAccepted}
                    selectedDigiSign={this.state.selectedDigiSign || {}}
                    deleteAttachment={this.deleteAttachment}
                    onDrop={this.onDropFile}
                    actionType={this.state.actionType}
                    userInfo={this.props.Login.userInfo}
                    createSecurityKey={this.state.createSecurityKey}
                    onInputChange={(event) => this.onInputChange(event)}
                    label={this.props.intl.formatMessage({ id: "IDS_DIGITALSIGNATURE" })}
                    name="digitalsignature"
                    onDropImage={this.onDropImage}
                    operation={this.props.Login.operation}
                    childDataChange={this.childDataChange}
                    login={this.props.Login}
                  />
              }
            />}
             { this.props.Login.screenName === "IDS_UPDATEUSERPROFILEIMAGE" && this.props.Login.openProfilePictureDialog?
        <AddorUpdateProfileImage
          srcImage={(settings!=='' && settings!==undefined && settings[5]!=='' && settings[5]!== undefined &&
                     this.props.Login.profiledata && this.props.Login.profiledata['suserimgftp']!==''&& this.props.Login.profiledata['suserimgftp']!==undefined
                     && this.props.Login.profiledata['suserimgftp']!==null
                     )?
                        settings[5]+this.props.Login.profiledata['suserimgftp']:
                        createImageFromInitials(32, susername ? susername.charAt(0).toUpperCase() : "",!currentTheme ? profileColor : currentTheme)
                    } 
  
          width={190} 
          height={180}
          children={<>
            <i style={{fontSize:'14px'}}><sup>&#8432;</sup>  {intl.formatMessage({id:"IDS_PROFILE_PHOTO_SIZE"})}</i>
          </>}
          onUploadingImage={this.onUploadingImage}
          onSubmitDialog={this.uploadProfileImage}
          dialogTitle={this.props.Login.screenName}
          isOpen={this.props.Login.openProfilePictureDialog}
          onhandleClosedDialog={this.onCloseProfilePictureDialog}
        />:null
        }
           { this.props.Login.screenName === "IDS_ABOUT" && this.props.Login.openAboutModal?
        <About
          width={190} 
          height={180}
          isOpen={this.props.Login.openAboutModal}
          closeAbout={this.closeAbout}
          aboutInfo={this.props.Login.aboutInfo}
        />:null
        }
        </> 
    );
  }


  submitUserTheme = item => {
    item['nfontsize'] =  this.state.fontSize;
    this.props.submitUserTheme(item,this.props.Login.userInfo);
  }

  submitChangeOwner = (item, role) => {
    this.props.onChangeOwer(item,role);
    // const parameterInfo = {
    //   typeName: DEFAULT_RETURN,
    //   data: { menuDesign: [], navigation: "" }
    // }
    // this.props.updateStore(parameterInfo);
    // const inputData = {
    //   nuserrolecode: item.nuserrolecode,
    //   suserrolename: item.suserrolename,
    //   nusercode: item.nusercode,
    //   sdeputyid: item.sdeputyid,
    //   userinfo: this.props.Login.userInfo
    // }
    // this.props.changeOwner(inputData);
  }

  onChangePassword = () => {
    const createPwdRecord = this.state.createPwdRecord;
    const returnMsg = changePasswordValidation(createPwdRecord, this.props.Login.passwordPolicy, this.props.Login.userInfo.sloginid);
    if (returnMsg === 0) {
      const inputParam = {
        spassword: createPwdRecord.snewpassword.trim(),
        sOldPassword: createPwdRecord.soldpassword.trim(),
        nusersitecode: this.props.Login.userInfo.nusersitecode,
        isPasswordExpiry: false,
        userInfo: this.props.Login.userInfo
      };
      this.props.changepassword(inputParam);
    } else {
      toast.info(returnMsg);
    }
  }

  onSaveDigitalSign = (saveType, formRef) => {
    let digiSignData = [];
    digiSignData["userinfo"] = this.props.Login.userInfo;

    const digiSignImageFile = this.state.selectedDigiSign.sdigisignname;

    let isDigiSignFileEdited = transactionStatus.NO;
    const formData = new FormData();
    let digiSignImageCount = 0;
    let digisignfile = {};
    digiSignData["digiSign"] = { "nsitecode": this.props.Login.userInfo.nmastersitecode };
    digiSignData["digiSign"]["sdigisignname"] = this.state.selectedDigiSign["sdigisignname"];

    if (digiSignImageFile && Array.isArray(digiSignImageFile) && digiSignImageFile.length > 0) {
      const splittedFileName = digiSignImageFile[0].name.split('.');
      const fileExtension = digiSignImageFile[0].name.split('.')[splittedFileName.length - 1];
      const uniquefilename = this.state.selectedDigiSign.sdigisignname === "" ?
        this.state.selectedDigiSign.sdigisignname : create_UUID() + '.' + fileExtension;

      digisignfile["sdigisignname"] = Lims_JSON_stringify(digiSignImageFile[0].name, false);
      digisignfile["sdigisignftp"] = uniquefilename;
      digisignfile["ssecuritykey"] = this.state.selectedDigiSign["ssecuritykey"];
      formData.append("uploadedFile" + digiSignImageCount, digiSignImageFile[0]);
      formData.append("uniquefilename" + digiSignImageCount, uniquefilename);
      digiSignImageCount++;
      isDigiSignFileEdited = transactionStatus.YES;
      digiSignData["digiSign"]["sdigisignname"] = "";
    } else {
      if (digiSignImageFile === undefined || digiSignImageFile === "" || (digiSignImageFile.hasOwnProperty("length") && digiSignImageFile.length === 0)) {
        if (digiSignData["digiSign"]["sdigisignftp"] !== null && digiSignData["digiSign"]["sdigisignftp"] !== "") {
          isDigiSignFileEdited = transactionStatus.YES;
        }
        digisignfile["sdigisignname"] = null;
        digisignfile["sdigisignftp"] = null;
        digiSignData["digiSign"]["sdigisignname"] = "";
      }
      else {
        digisignfile["sdigisignname"] = Lims_JSON_stringify(this.state.selectedDigiSign.sdigisignname, false);
        digisignfile["sdigisignftp"] = this.state.selectedDigiSign.sdigisignftp;
        digisignfile["ssecuritykey"] = this.state.selectedDigiSign.ssecuritykey
      }
    }

    formData.append("isDigiSignFileEdited", isDigiSignFileEdited);
    formData.append("DigiSignImage_filecount", digiSignImageCount);
    formData.append("filecount", digiSignImageCount);
    formData.append("controlcodelist", JSON.stringify(this.props.Login.uploadControlList));
    formData.append("digisignfile", JSON.stringify(digisignfile));
    formData.append("digiSign", JSON.stringify(digiSignData["digiSign"]));
    // }
    const inputParam = {
      operation: this.props.Login.operation,
      formData: formData,
      classUrl: "digitalsignature",
      methodUrl: "DigitalSignature",
      inputData: {
        "userinfo": {
          ...this.props.Login.userInfo,
          slanguagename: Lims_JSON_stringify(this.props.Login.userInfo.slanguagename)
        }
      },
      isFileupload: true,
      saveType, formRef
    }
    const updateInfo = {
      typeName: DEFAULT_RETURN,
      data: {
        loadEsign: true, screenData: { inputParam }, saveType
      }
    }
    this.props.updateStore(updateInfo);
    // this.props.saveDigitalSign(inputParam);
  }

  validateEsign = () => {
    const inputParam = {
      inputData: {
        "userinfo": {
          ...this.props.Login.userInfo,
          sreason: this.state.selectedDigiSign["esigncomments"],
          nreasoncode: this.state.selectedDigiSign["esignreason"] && this.state.selectedDigiSign["esignreason"].value,
          spredefinedreason: this.state.selectedDigiSign["esignreason"] && this.state.selectedDigiSign["esignreason"].label,

        },
        password: this.state.selectedDigiSign["esignpassword"]
      },
      screenData: this.props.Login.screenData
    }
    this.props.validateEsignforDigitalSignature(inputParam);
  }

   sendOTPMail=()=>{
       const selectedAuthRecord=this.state.selectedAuthRecord||{};
       const selectedRecord=this.state.selectedRecord||{};
   
        //selectedAuthRecord[fieldName] = comboData;
           //  this.setState({...selectedAuthRecord,showEmailOTPModal:true});
   
               // let inputData = {
               //       nmfatypecode: selectedAuthRecord.nmfatypecode.value,
               //       nusercode: selectedRecord.nusercode ? selectedRecord.nusercode : this.props.Login.nusercode,
               //       sloginid: selectedRecord.sloginid,
               //       userinfo:
               //   }
               //selectedAuthRecord["notpexpiredtime"]="";
               selectedAuthRecord["showEmailOTPModal"]=true;
              // delete selectedAuthRecord["notpexpiredtime"];
               this.setState(selectedAuthRecord);
   
                 this.props.sendOTPMail(
                     this.props.Login.userInfo && this.props.Login.userInfo,
                     selectedAuthRecord
                 );
                }

  onInputChange(event) {
    if (this.props.Login.screenName === "IDS_CHANGEPASSWORD") {
      const createPwdRecord = this.state.createPwdRecord || {};
      createPwdRecord[event.target.name] = event.target.value;
      this.setState({ createPwdRecord });
    }
	//ALPD-6042--Added by vignesh(09-07-2025)--for Email Authentication.
	else if (this.props.Login.screenName === "IDS_AUTHENTICATION") {
      let selectedAuthRecord = this.state.selectedAuthRecord || {};
      if(event.target.type==='checkbox'){
      
      selectedAuthRecord[event.target.name] = event.target.checked === true ? transactionStatus.YES : transactionStatus.NO;
      if(selectedAuthRecord[event.target.name]===transactionStatus.NO && selectedAuthRecord.nmfatype===transactionStatus.NA){
     selectedAuthRecord={...selectedAuthRecord,newUserAuth:false}
     this.setState({ selectedAuthRecord });
      }else{
      this.props.updateActiveStatusMFA(this.props.Login.userInfo,selectedAuthRecord);
      }
    }else{
      if(/^\d*$/.test(event.target.value) && event.target.value.length <= 6){
    selectedAuthRecord[event.target.name]=event.target.value;
    this.setState({ selectedAuthRecord });
      }
    }
      
    }
    else {
      const selectedDigiSign = this.state.selectedDigiSign || {};
      if (event.target.type === 'checkbox') {
        selectedDigiSign[event.target.name] = event.target.checked === true ? transactionStatus.YES : transactionStatus.NO;
      } else {
        selectedDigiSign[event.target.name] = event.target.value;
      }
      this.setState({ selectedDigiSign });
    }
  }
//ALPD-6042--Added by vignesh(09-07-2025)--for Email Authentication.
   onVerifyOTP=()=> {

      const failedControls = [];
      let mandatoryField=[];
      //const startLabel = [];
      const selectedAuthRecord = this.state.selectedAuthRecord;
      mandatoryField.push({  idsName: "IDS_OTP",  dataField: "sonetimepassword",  mandatory: true, "mandatoryLabel": "IDS_ENTER" , "controlType": "textbox"});

      mandatoryField.map(item => {
            if (selectedAuthRecord[item.dataField] === undefined) {
                failedControls.push(this.props.intl.formatMessage({ id: item.idsName }));
            } else if (typeof selectedAuthRecord[item.dataField] === "string") {
                //to handle string field -- added trim function
                if (selectedAuthRecord[item.dataField].trim().length === 0) {
                    failedControls.push(this.props.intl.formatMessage({ id: item.idsName }));
                     // startLabel.push(item.mandatoryLabel)
                }
            }
            return null;
        });
            if (failedControls.length === 0) {
                  let inputParam={
                    "inputData":{
                      "nmfatypecode":this.state.selectedAuthRecord?this.state.selectedAuthRecord.nmfatypecode && this.state.selectedAuthRecord.nmfatypecode.value : -1,
                      "sonetimepasswordcode":this.state.selectedAuthRecord ? this.state.selectedAuthRecord.sonetimepasswordcode : -1,
                      "userinfo":this.props.Login.userInfo && this.props.Login.userInfo,
                      "nFlag":1,
                      "sonetimepassword":this.state.selectedAuthRecord ? this.state.selectedAuthRecord.sonetimepassword : -1,
                      "nactivestatus":this.state.selectedAuthRecord?this.state.selectedAuthRecord.nactivestatus:transactionStatus.NO

                    }
            }
          this.props.confirmOTP(inputParam);

       } else {
              toast.info(`${this.props.intl.formatMessage({ id: "IDS_ENTER" })} ${failedControls[0]}`);
          }
      
  }

 
  onComboChange = (comboData, fieldName) => {
          const selectedAuthRecord = this.state.selectedAuthRecord || {};
              selectedAuthRecord[fieldName]=comboData;
            this.setState(selectedAuthRecord);
              }



    closeModalEmail=()=>{
    const updateInfo = {
      typeName: DEFAULT_RETURN,
      data: { openCPModal:false,showEmailOTPModal:false, selectedAuthRecord:{},
        screenName:"" }
    }
    this.props.updateStore(updateInfo);
  }

  closeModal = () => {
    let selectedDigiSign = this.props.Login.selectedDigiSign;
    let loadEsign = this.props.Login.loadEsign;
    let openCPModal = this.props.Login.openCPModal;
    if (this.props.Login.loadEsign) {
      loadEsign = false;
      selectedDigiSign['esignpassword'] = ""
      selectedDigiSign['esigncomments'] = ""
      selectedDigiSign['esignreason'] = ""
    } else {
      openCPModal = false;
    }
    const updateInfo = {
      typeName: DEFAULT_RETURN,
      data: { openCPModal, loadEsign, selectedDigiSign,
         // ALPD-4794 -Changed by Neeraj 
        screenName:"" }
    }
    this.props.updateStore(updateInfo);
  }

  mandatoryFieldFunction() {
    let mandatoryField = [];
    this.props.Login.screenName === "IDS_CHANGEPASSWORD" ?
      mandatoryField = [
        { "idsName": "IDS_OLDPASSWORD", "dataField": "soldpassword", "mandatory": false },
        { "idsName": "IDS_NEWPASSWORD", "dataField": "snewpassword", "mandatory": false },
        { "idsName": "IDS_CONFIRMPASSWORD", "dataField": "sconfirmpassword", "mandatory": true }
      ]
      :
      mandatoryField = [];
    ;
    return mandatoryField;
  }

  submitChangeRole = (roleItem) => {
    this.props.onChangeRol(roleItem);
    // const parameterInfo = {
    //   typeName: DEFAULT_RETURN,
    //   data: { menuDesign: [], navigation: "" }
    // }
    // this.props.updateStore(parameterInfo);
    // const userInfo = this.props.Login.userInfo;
    // const inputParam = {
    //   nusermultisitecode: userInfo.nusersitecode,
    //   slanguagetypecode: userInfo.slanguagetypecode,
    //   nusermultirolecode: roleItem.nusermultirolecode,
    //   nuserrolecode: roleItem.nuserrolecode,
    //   nmastersitecode: userInfo.nmastersitecode,
    //   nlogintypecode: userInfo.nlogintypecode,
    //   userinfo: userInfo
    // }
    // this.props.submitChangeRole(inputParam);
  }

  childDataChange = (selectedRecord, mandatoryFieldCheck) => {
    let isInitialRender = false;
    this.setState({
      selectedDigiSign: {
        ...selectedRecord
      },
      isInitialRender
    });
  }

  componentDidUpdate(prevProps) {
    //   if (this.props.Login.isDeputyLogin === true) {

    //   if (this.props.Login.navigation === "home") {
    //      this.props.history.push('/');
    //  }
    // }
    if (this.props.Login.createPwdRecord !== prevProps.Login.createPwdRecord) {
      this.setState({ createPwdRecord: this.props.Login.createPwdRecord })
    }
//ALPD-6042--Added by vignesh(09-07-2025)--for Email Authentication.
    if (this.props.Login.selectedAuthRecord !== prevProps.Login.selectedAuthRecord) {
      this.setState({ selectedAuthRecord: this.props.Login.selectedAuthRecord })
    }

    if (this.props.Login.alert !== prevProps.Login.alert) {
      this.setState({ alert: this.props.Login.alert })
    }
    if (this.props.Login.selectedDigiSign !== prevProps.Login.selectedDigiSign) {
      this.setState({ selectedDigiSign: this.props.Login.selectedDigiSign })
    }
    if (this.props.Login.isInitialRender !== prevProps.Login.isInitialRender) {
      this.setState({ isInitialRender: this.props.Login.isInitialRender })
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.Login.openCPModal && nextState.isInitialRender === false &&
      (nextState.selectedDigiSign !== this.state.selectedDigiSign)) {
      return false;
    }
    else if(this.state.userImagePath!==nextState.userImagePath){
      return this.state.userImagePath!==nextState.userImagePath;
    }    
    
    else {
      return true;
    }
  }


  onDigitalSignatureSaveClick = () => {
    let mandatoryField = [];
    (this.state.selectedDigiSign && this.state.selectedDigiSign["sdigisignname"] && (this.state.selectedDigiSign["sdigisignname"].hasOwnProperty("length") ?
      this.state.selectedDigiSign["sdigisignname"].length > 0 : this.state.selectedDigiSign["sdigisignname"] !== "") ?
      mandatoryField = [
        { "idsName": "IDS_SECURITYKEY", "dataField": "ssecuritykey", "mandatory": false },
      ]
      :
      mandatoryField = []
    );
    onSaveMandatoryValidation(this.state.selectedDigiSign, mandatoryField, this.onSaveDigitalSign)
  }

}

export default connect(mapStateToProps, {
  submitUserTheme,getChangeUserRole, submitChangeRole, getPassWordPolicy,sendOTPMail,
  updateStore, changepassword, changeOwner, logOutAuditAction, getSelectedAlert, getListAlert, resendOTP,
  getDigitalSign, saveDigitalSign, crudMaster, validateEsignforDigitalSignature,updateActiveStatusMFA, getDashBoardForHome,
  getcolorMaster,getUserProfileImage,updateUserProfilePicture,getAuthenticationMFA,closeProfilePictureDialog,getAboutInfo,confirmOTP,
})(injectIntl(Header));
//syed