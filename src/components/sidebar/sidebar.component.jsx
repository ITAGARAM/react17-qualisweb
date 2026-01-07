import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { Tab, Nav, Image, Badge,Accordion } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { FormattedMessage,injectIntl } from 'react-intl';
import Preloader from '../preloader/preloader.component';
import { callService, navPage, elnLoginAction, sdmsLoginAction, updateStore, getDashBoardForHome } from '../../actions'
import { SidebarNav, SidebarBrand, SidebarBrandTxt, NavHeader, CollapseInner } from '../../components/sidebar/sidebar.styles';
import MenuExpand from '../../assets/image/menu-expand.svg';
import MenuCollapse from '../../assets/image/menu-collapse.svg';
import PrimaryLogo from '../../assets/image/sidebar-logo.png';
//import Logo from '../../assets/image/qualis-lims@3x.png';
import 'react-perfect-scrollbar/dist/css/styles.css';
import { formatInputDate } from '../CommonScript';
//import LogiLabLogo from '../../assets/image/logilablogo.png'
//import SDMSLogo from '../../assets/image/sdmslogo.png'
import { toast } from 'react-toastify';
import { DEFAULT_RETURN } from '../../actions/LoginTypes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faHome, faServer } from '@fortawesome/free-solid-svg-icons';
//import ContextAwareToggle from './ContextAwareToggle';
import PerfectScrollbar from 'react-perfect-scrollbar'
const mapStateToProps = (state) => {
    return { Login: state.Login }
}
class Menu extends PureComponent {
    constructor(props) {
        super(props);
        this.formRef = React.createRef();
        this.state = {
            show: false,
            nusermultirolecode: -1,
            selectedRecord: {},
            isSidebarActive: false,
            isPinned: false,
            MenuVisible: false,
            HomeMenuVisible: false,
            key: this.props.Login.defaultMenuHome &&
                this.props.Login.defaultMenuHome ?
                `MenuId_${this.props.Login.defaultMenuHome.nhomedesigncode}` :
                "MenuId_1",
                keyMenu: this.props.Login.menuDesign &&
                this.props.Login.menuDesign ?
                `MenuId_${this.props.Login.menuDesign[0].nmenucode}` :
                "MenuId_-2",
            alert: []
        }
        this.toggleMenu = this.toggleMenu.bind(this);
    }
    toggleMenu() {
        this.setState({ HomeMenuVisible: !this.state.HomeMenuVisible })
    }


    getDetail = (classUrl, methodUrl, formCode, displayName, moduleCode, formname, modulename, history) => {
        if (this.props.inputRef.current)
            this.props.inputRef.current.value = ""
        if (this.props.Login.userInfo.nformcode !== formCode) {
            const userInfo = {
                ...this.props.Login.userInfo, "nformcode": formCode,
                "nmodulecode": moduleCode, "sformname": formname.sdisplayname, "smodulename": modulename.sdisplayname
            }
            const inputParam = {
                inputData: { "userinfo": userInfo, 
                settings : this.props.Login.settings,
                currentdate: formatInputDate(new Date(), true) }, history, getDetailHome:this.getDetailHome,
                classUrl, methodUrl, displayName, key: `MenuId_${formname.nmenucode}`, serviceNeed: true, sidebarCall: true
            };
            this.props.menuHide();
            this.props.callService(inputParam);
        }
    }

    onELNLoginClick = () => {
        if (this.props.Login.sdmselnsettings && this.props.Login.sdmselnsettings[3]) {
            const serverUrl = this.props.Login.sdmselnsettings[3] + "Login/Validateuser";
            const uiUrl = this.props.Login.sdmselnsettings[4];
            const userInfo = this.props.Login.userInfo;
            const inputParam = {
                username: userInfo.sloginid,
                lssitemaster: { "sitecode": "1" },
                password: userInfo.spassword,
                lsusergroup: { "usergroupname": userInfo.suserrolename }
            };
            this.props.elnLoginAction(inputParam, serverUrl, uiUrl);
        } else {
            toast.info(this.intl.FormattedMessage({ id: "IDS_ELNSERVERURLNOTAVAILABLE" }));
        }
    }

    onSDMSLoginClick = () => {
        if (this.props.Login.sdmselnsettings && this.props.Login.sdmselnsettings[1]) {
            const serverUrl = this.props.Login.sdmselnsettings[1] + "/Login/validatelinkUser";
            const uiUrl = this.props.Login.sdmselnsettings[2];
            const userInfo = this.props.Login.userInfo;
            const inputParam = {
                sUserName: userInfo.sloginid,
                sSiteCode: "DEFAULT",
                sGroupName: userInfo.suserrolename
            };
            this.props.sdmsLoginAction(inputParam, serverUrl, uiUrl);
        } else {
            toast.info(this.intl.FormattedMessage({ id: "IDS_ELNSERVERURLNOTAVAILABLE" }));
        }
    }
    setKey = (k) => {
        this.setState({ key: k })
    }

    setKeyMenu = (k) => {
        this.setState({ keyMenu: k })
    }

    componentDidUpdate(prevProps) {
        if (this.props.Login.menuDesign !== prevProps.Login.menuDesign) {
            this.setState({
                key: this.props.Login.HomeDesign && this.props.Login.HomeDesign[0] ?
                    `MenuId_${this.props.Login.defaultMenuHome.nhomedesigncode}` : "MenuId_1"
            })
        }

    }


    getDetailHome = (menu) => {
        const userInfo = {
            ...this.props.Login.userInfo
        }
        userInfo['nformcode'] = -1
        userInfo['nmodulecode'] = -1
        userInfo['sformname'] = null
        userInfo['smodulename'] = null

        let inputParam = {}

        if (menu.shomename === 'apiservice') {
            inputParam = { classUrl: menu.shomename, methodUrl: menu.smethodurl }
        }
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { masterData: {}, userInfo, organisation: undefined, loading: false, displayName: menu.sdisplayname, shomename: menu.shomename, ...inputParam }
        }
        this.props.layOutGetHome(updateInfo)



    }
    toggleSearch = () => {

        this.setState({
            showSearch: !this.state.showSearch
        })
    }


    render() {

        //const { isSidebarActive } = this.state;
        const { HomeDesign, loading,menuDesign } = this.props.Login;
        const activePage = this.props.Login.userInfo.nmodulecode;
        return (
            <div style={{position:"relative"}}>
                <>     
                  
                    {(this.props.history.history.location.pathname === "/home" || this.props.history.history.location.pathname === "/dashboard" || this.props.history.history.location.pathname === "/alert" || this.props.history.history.location.pathname === "/apiservice") ?
                        <Nav.Link className="text-center menu-toggle-btn"
                        onMouseEnter={() => this.setState({ HomeMenuVisible: true })}     
                        onMouseLeave={() => this.setState({ HomeMenuVisible: false })}  
                        >
                            <img src={MenuExpand} alt="Lims-Logo" width="40" height="40" />
                        </Nav.Link> : 
                        <>
                            {/* {!this.props.isPinned ?
                                <Nav.Link className="text-center menu-toggle-btn"
                                onMouseEnter={() => this.setState({ MenuVisible: true })} 
                                onMouseLeave={() => this.setState({ MenuVisible: false })}
                                onClick={() => this.setState({ isPinned: !this.state.isPinned})}>
                                    <img src={MenuExpand} alt="Lims-Logo" width="40" height="40" />
                                </Nav.Link>
                                :
                                <Nav.Link className="text-center menu-toggle-btn" onClick={() => this.setState({ isPinned: !this.state.isPinned })}>
                                    <img src={MenuCollapse} alt="Lims-Logo" width="40" height="40" />
                                </Nav.Link>
                            }  */}
                              {!this.props.isPinned ?    
                                <Nav.Link className="text-center menu-toggle-btn"  style={{ zIndex: 1079 }}
                                    onClick={this.props.pinMenu}            
                                    onMouseEnter={() => this.setState({ MenuVisible: true })} 
                                    onMouseLeave={() => this.setState({ MenuVisible: false })}
                                    ref={this.props.carRef1}>
                                    <img src={MenuExpand} alt="Lims-Logo" width="40" height="40" />
                                </Nav.Link>  :
                                <Nav.Link className="text-center menu-toggle-btn"  style={{ zIndex: 1079 }}
                                    onClick={this.props.pinMenu}            
                                    ref={this.props.carRef1}>
                                    <img src={MenuCollapse} alt="Lims-Logo" width="40" height="40" />
                                </Nav.Link>
                                }
                        </>
                    }   
                    {(this.props.history.history.location.pathname === "/home" || this.props.history.history.location.pathname === "/dashboard" || this.props.history.history.location.pathname === "/alert" || this.props.history.history.location.pathname === "/apiservice")?
                        <>
                        {this.state.HomeMenuVisible ?
                           <div className={`sidebar-block ${this.props.isPinned ? "pinned-sidebar" :''} ${this.state.keyMenu==='MenuId_-2' && 'toggled'}` }> 
                           <SidebarNav 
                               className={`d-flex side-nav sidebar sidebar-dark bg-gradient-primary ${this.props.isPinned ? "pinned-sidebar" :''} ${this.state.keyMenu==='MenuId_-2' && 'toggled'}  ${this.props.fullView && 'sidebar-fullview'}`} 
                               onMouseEnter={() => this.setState({ HomeMenuVisible: true })} 
                               onMouseLeave={() => this.setState({ HomeMenuVisible: false })} >
                               <Tab.Container
                                   activeKey={this.state.keyMenu}
                                   onSelect={(k) => this.setKeyMenu(k)}>
                                   <Nav className="nav flex-column side-nav" variant="pills" key='MenuIcon'>
                                       {menuDesign && menuDesign.map((menu) => {
                                           return(menu.nmenucode !== -2 ?
                                               <Nav.Link key={menu.nmenucode} eventKey={`MenuId_${menu.nmenucode}`} >
                                                   <Image src={require(`../../assets/image/${menu.smenuname.toLowerCase()}.svg`)} alt="sidebar" width="34" height="34" />
                                                   <span>{menu.sdisplayname}</span>
                                               </Nav.Link> : <Nav.Link to={'/home'} key={menu.nmenucode} eventKey={`MenuId_${menu.nmenucode}`}  
                                               onClick={(e) => this.getDetailHome(HomeDesign.filter(x=>x.shomename==='home')[0])}  >
                                                   {/* <Image src={PrimaryLogo} alt="Primary-Logo" width="45" height="60" /> */}
                                                   <FontAwesomeIcon icon={faHome} size="2x" />                                                        
                                                   <span>{this.props.intl.formatMessage({id: "IDS_HOME"})}</span>
                                               </Nav.Link>
                                           )
                                       })}
                                               {/* <Nav.Link key={6} onClick={() => this.onELNLoginClick()}>
                                                   <Image src={LogiLabLogo} alt="logilablogo" width="45" height="55" />
                                               </Nav.Link>
                                               <Nav.Link key={7} onClick={() => this.onSDMSLoginClick()}>
                                                   <Image src={SDMSLogo} alt="sdmslogo" width="45" height="55" />
                                               </Nav.Link> */}
                                               {/* //key={this.state.key} eventKey={this.state.key}  */}
                                               
                                       <Nav.Link className="mt-auto">
                                           <Image src={PrimaryLogo} alt="Primary-Logo" width="45" height="60" />
                                       </Nav.Link>                    
                                   </Nav>
                                           {/* <Button className="rounded-circle border-0" id="sidebarToggle" ></Button> */}
                                   <Tab.Content>   
                                       {menuDesign && menuDesign.map(menu => {
                                           return (
                                               <Tab.Pane key={menu.nmenucode} eventKey={`MenuId_${menu.nmenucode}`}>
                                                   <Accordion className="navbar-nav position-relative" as="ul" defaultActiveKey={activePage} >
                                                       {/* onClick={() => this.pinnedEvent()} */}
                                                       <SidebarBrand className="sidebar-brand d-flex align-items-center">
                                                           <SidebarBrandTxt>
                                                               <FormattedMessage id={menu.sdisplayname}
                                                                   defaultMessage={menu.sdisplayname} />
                                                           </SidebarBrandTxt>
                                                       </SidebarBrand>
                                                       <PerfectScrollbar className="sidebar-scroll">
                                                           {
                                                               menu.nmenucode!==-2&&(menu.lstmodule).map(module => {
                                                               return (
                                                                       <>
                                                                       <Nav.Item key={module.nmodulecode} as="li">
                                                                           <Card.Header className='pr-0'>
                                                                               <Accordion.Toggle as={Button} className={`${activePage === module.nmodulecode  ? 'show' : ''}`}
                                                                               variant="link" eventKey={module.nmodulecode}  >
                                                                                   <NavHeader >
                                                                                       <FormattedMessage id={module.sdisplayname} defaultMessage={module.sdisplayname} />
                                                                                   </NavHeader>
                                                                                   <Accordion.Collapse eventKey={module.nmodulecode}>
                                                                                       <Card.Body></Card.Body>
                                                                                   </Accordion.Collapse>
                                                                               </Accordion.Toggle>
                                                                               
                                                                           </Card.Header>
                                                                               {/* <ContextAwareToggle eventKey={module.nmodulecode}>
                                                                                   <NavHeader >
                                                                                       <FormattedMessage id={module.sdisplayname}
                                                                                           defaultMessage={module.sdisplayname} />
                                                                                   </NavHeader>
                                                                               </ContextAwareToggle> */}                    
                                                                           <Accordion.Collapse eventKey={module.nmodulecode}  >
                                                                               <CollapseInner className="bg-transparent py-2 collapse-inner rounded">
                                                                                   {module.lstforms!==null&& (module.lstforms).map(forms => {
                                                                                       return (
                                                                                           <NavLink className={`collapse-item ${forms.nformcode === this.props.Login.userInfo.nformcode ? 'active-form' : ''}`} key={forms.nformcode}
                                                                                               nformcode={forms.nformcode} to={'/' + forms.sclassname}
                                                                                               onClick={() => this.getDetail(forms.sclassname.toLowerCase(), forms.surl,
                                                                                                   forms.nformcode, forms.sdisplayname, module.nmodulecode, forms, module, this.props.history.history)}
                                                                                           >
                                                                                               <FormattedMessage id={forms.sdisplayname}
                                                                                                   defaultMessage={forms.sdisplayname} />
                                                                                           </NavLink>
                                                                                       )
                                                                                   })}
                                                                               </CollapseInner>
                                                                           </Accordion.Collapse>
                                                                       </Nav.Item>
                                                                       </>
                                                                   )
                                                               })
                                                           }
                                                       </PerfectScrollbar>                    
                                                   </Accordion>
                                               </Tab.Pane>)
                                       })}            
                                   </Tab.Content>
                               </Tab.Container>
                           </SidebarNav>
                       </div>:
                            <SidebarNav className={`d-flex side-nav sidebar sidebar-dark bg-gradient-primary toggled ${this.props.fullView && 'sidebar-fullview'}`}>
                            <Tab.Container activeKey={this.state.key} onSelect={(k) => this.setKey(k)}>
                                {/* Left Menu Icon */}
                                < Nav className="nav flex-column side-nav" variant="pills" key='MenuIcon'>                                  
                                    {HomeDesign && HomeDesign.map((menu) => {
                                        return (menu.shomename === 'dashboard' ?
                                            <Nav.Link key={menu.nhomedesigncode} eventKey={`MenuId_${menu.nhomedesigncode}`} onClick={(e) => this.getDetailHome(menu)}  >
                                                <Image src={require(`../../assets/image/${menu.shomename.toLowerCase()}.svg`)} alt="sidebar" width="34" height="34" />
                                                <span>{menu.sdisplayname}</span>
                                            </Nav.Link>
                                            : menu.shomename === 'home' ?
                                                <Nav.Link to={'/home'} key={menu.nhomedesigncode} eventKey={`MenuId_${menu.nhomedesigncode}`}
                                                    onClick={(e) => this.getDetailHome(menu)} >
                                                    <FontAwesomeIcon icon={faHome} size="2x" />
                                                    <span>{menu.sdisplayname}</span>
                                                </Nav.Link>
                                            : menu.shomename === 'apiservice' ?
                                                <Nav.Link to={'/apiservice'} key={menu.nhomedesigncode} eventKey={`MenuId_${menu.nhomedesigncode}`}
                                                    onClick={(e) => this.getDetailHome(menu)}  >
                                                    <FontAwesomeIcon icon={faServer} size="2x" />
                                                    <span>{menu.sdisplayname}</span>
                                                </Nav.Link>
                                            : 
                                                <Nav.Link to={'/alert'} key={menu.nhomedesigncode} eventKey={`MenuId_${menu.nhomedesigncode}`}
                                                    onClick={(e) => this.getDetailHome(menu)}  >
                                                    <FontAwesomeIcon icon={faBell} size="2x" />
                                                        <span>{menu.sdisplayname}</span>
                                                        {this.props.Login.alert && this.props.Login.alert.length > 0 ?
                                                            <Badge style={{
                                                                "position": "relative",
                                                                "bottom": "56px",
                                                                "font-size": "0.7rem",
                                                                "width": "20px",
                                                                "left": "30px"
                                                            }} pill variant="danger">{this.props.Login.alert && this.props.Login.alert.length}</Badge>
                                                            : ""}
                                                </Nav.Link>
                                        )
                                    })}
                                    <Nav.Link className="mt-auto">
                                        <Image src={PrimaryLogo} alt="Primary-Logo" width="45" height="60" />
                                        <span>11.0.0.2</span>
                                    </Nav.Link>
                                </Nav>
                            </Tab.Container>                                      
                        </SidebarNav>
                        }
                        </> :
                        <>
                         {this.state.MenuVisible && 
                        <div className={`sidebar-block ${this.props.isPinned ? "pinned-sidebar" :''} ${this.state.keyMenu==='MenuId_-2' && 'toggled'}` }> 
                            <SidebarNav 
                                className={`d-flex side-nav sidebar sidebar-dark bg-gradient-primary ${this.props.isPinned ? "pinned-sidebar" :''} ${this.state.keyMenu==='MenuId_-2' && 'toggled'}  ${this.props.fullView && 'sidebar-fullview'}`} 
                                onMouseEnter={() => this.setState({ MenuVisible: true })} 
                                onMouseLeave={() => this.props.isPinned? this.setState({ MenuVisible: true }):this.setState({ MenuVisible: false })} >
                                <Tab.Container
                                    activeKey={this.state.keyMenu}
                                    onSelect={(k) => this.setKeyMenu(k)}>
                                    <Nav className="nav flex-column side-nav" variant="pills" key='MenuIcon'>
                                        {menuDesign && menuDesign.map((menu) => {
                                            return(menu.nmenucode !== -2 ?
                                                <Nav.Link key={menu.nmenucode} eventKey={`MenuId_${menu.nmenucode}`} >
                                                    <Image src={require(`../../assets/image/${menu.smenuname.toLowerCase()}.svg`)} alt="sidebar" width="34" height="34" />
                                                    <span>{menu.sdisplayname}</span>
                                                </Nav.Link> 
                                                :                                                 
                                                <Nav.Link to={'/home'} key={menu.nmenucode} eventKey={`MenuId_${menu.nmenucode}`}  
                                                onClick={(e) => this.getDetailHome(HomeDesign.filter(x=>x.shomename==='home')[0],this.props.isPinned? this.setState({ MenuVisible: true }):this.setState({ MenuVisible: false }))}  >
                                                    {/* <Image src={PrimaryLogo} alt="Primary-Logo" width="45" height="60" /> */}
                                                    <FontAwesomeIcon icon={faHome} size="2x" />                                                        
                                                    <span>{this.props.intl.formatMessage({id: "IDS_HOME"})}</span>
                                                </Nav.Link>
                                            )
                                        })}
                                                {/* <Nav.Link key={6} onClick={() => this.onELNLoginClick()}>
                                                    <Image src={LogiLabLogo} alt="logilablogo" width="45" height="55" />
                                                </Nav.Link>
                                                <Nav.Link key={7} onClick={() => this.onSDMSLoginClick()}>
                                                    <Image src={SDMSLogo} alt="sdmslogo" width="45" height="55" />
                                                </Nav.Link> */}
                                                {/* //key={this.state.key} eventKey={this.state.key}  */}
                                                
                                        <Nav.Link className="mt-auto">
                                            <Image src={PrimaryLogo} alt="Primary-Logo" width="45" height="60" />
                                        </Nav.Link>                    
                                    </Nav>
                                            {/* <Button className="rounded-circle border-0" id="sidebarToggle" ></Button> */}
                                    <Tab.Content>   
                                        {menuDesign && menuDesign.map(menu => {
                                            return (
                                                <Tab.Pane key={menu.nmenucode} eventKey={`MenuId_${menu.nmenucode}`}>
                                                    <Accordion className="navbar-nav position-relative" as="ul" defaultActiveKey={activePage} >
                                                        {/* onClick={() => this.pinnedEvent()} */}
                                                        <SidebarBrand className="sidebar-brand d-flex align-items-center">
                                                            <SidebarBrandTxt>
                                                                <FormattedMessage id={menu.sdisplayname}
                                                                    defaultMessage={menu.sdisplayname} />
                                                            </SidebarBrandTxt>
                                                        </SidebarBrand>
                                                        <PerfectScrollbar className="sidebar-scroll">
                                                            {
                                                                menu.nmenucode!==-2&&(menu.lstmodule).map(module => {
                                                                return (
                                                                        <>
                                                                        <Nav.Item key={module.nmodulecode} as="li">
                                                                            <Card.Header className='pr-0'>
                                                                                <Accordion.Toggle as={Button} className={`${activePage === module.nmodulecode  ? 'show' : ''}`}
                                                                                variant="link" eventKey={module.nmodulecode}  >
                                                                                    <NavHeader >
                                                                                        <FormattedMessage id={module.sdisplayname} defaultMessage={module.sdisplayname} />
                                                                                    </NavHeader>
                                                                                    <Accordion.Collapse eventKey={module.nmodulecode}>
                                                                                        <Card.Body></Card.Body>
                                                                                    </Accordion.Collapse>
                                                                                </Accordion.Toggle>
                                                                                
                                                                            </Card.Header>
                                                                                {/* <ContextAwareToggle eventKey={module.nmodulecode}>
                                                                                    <NavHeader >
                                                                                        <FormattedMessage id={module.sdisplayname}
                                                                                            defaultMessage={module.sdisplayname} />
                                                                                    </NavHeader>
                                                                                </ContextAwareToggle> */}                    
                                                                            <Accordion.Collapse eventKey={module.nmodulecode}  >
                                                                                <CollapseInner className="bg-transparent py-2 collapse-inner rounded">
                                                                                    {module.lstforms!==null&& (module.lstforms).map(forms => {
                                                                                        return (
                                                                                            <NavLink className={`collapse-item ${forms.nformcode === this.props.Login.userInfo.nformcode ? 'active-form' : ''}`} key={forms.nformcode}
                                                                                                nformcode={forms.nformcode} to={'/' + forms.sclassname}
                                                                                                onClick={() => this.getDetail(forms.sclassname.toLowerCase(), forms.surl,
                                                                                                    forms.nformcode, forms.sdisplayname, module.nmodulecode, forms, module, this.props.history.history)}
                                                                                            >
                                                                                                <FormattedMessage id={forms.sdisplayname}
                                                                                                    defaultMessage={forms.sdisplayname} />
                                                                                            </NavLink>
                                                                                        )
                                                                                    })}
                                                                                </CollapseInner>
                                                                            </Accordion.Collapse>
                                                                        </Nav.Item>
                                                                        </>
                                                                    )
                                                                })
                                                            }
                                                        </PerfectScrollbar>                    
                                                    </Accordion>
                                                </Tab.Pane>)
                                        })}            
                                    </Tab.Content>
                                </Tab.Container>
                            </SidebarNav>
                        </div>
                        }
                        </>
                    }  
                
                </>
                <Preloader loading={loading} />
            </div>
        );
    }
    ToggleAction = (value) => {
        if(!this.state.isPinned){
            this.setState({
                isSidebarActive: value,
                MenuVisible: !value
            })
        }
    }
    pinnedEvent = () => {
        let { isPinned } = this.state;
        this.setState({
            isPinned: !isPinned
        })
    }
}

export default connect(mapStateToProps, { callService, navPage, elnLoginAction, sdmsLoginAction, updateStore, getDashBoardForHome })(injectIntl(Menu));


