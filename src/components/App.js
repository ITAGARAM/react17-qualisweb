import React from 'react';
import {connect } from 'react-redux';
import { createIntl, createIntlCache, IntlProvider } from 'react-intl';
import { Switch, Route, Redirect, withRouter } from 'react-router';
import { toast } from 'react-toastify';
import { UN_AUTHORIZED_ACCESS } from '../actions/LoginTypes';
import { updateStore } from '../actions';
import 'react-toastify/dist/ReactToastify.min.css';

import messages_en from '../assets/translations/en.json';
import messages_ko from '../assets/translations/ko.json';
import messages_ru from '../assets/translations/ru.json';
import messages_tg from '../assets/translations/tg.json';
import messages_fr from '../assets/translations/fr.json';
import messages_id from '../assets/translations/id.json';
import messages_de from '../assets/translations/de.json';
import './App.css';

import Layout from './layout/layout.component.jsx';
import Login from '../pages/Login/Login.jsx'
 import rsapi from '../rsapi';
import PortalApp from '../PortalApp';
 
//component commented by L.Subashini 13/12/2025 while upgrading to React 17
//import ReactTooltip from 'react-tooltip';

//component used by L.Subashini 13/12/2025 while upgrading to React 17
import { Tooltip } from 'react-tooltip';
import "react-tooltip/dist/react-tooltip.css";

import GlobalTimer from './login/GlobalTimer.jsx';
const messages = {
  'en-US': messages_en,
  'ko-KR': messages_ko,
  'ru-RU': messages_ru,
  'tg-TG': messages_tg,
  'fr-FR': messages_fr,
  'id-ID': messages_id,
  'de-DE': messages_de

}

// This is optional but highly recommended
// since it prevents memory leak
const cache = createIntlCache()

// Call it once in your app. At the root of your app is the best place
toast.configure()

//Create the `intl` object
export let intl = createIntl(
  {
    // Locale of the application
    locale: 'en-US',
    // Locale of the fallback defaultMessage
    defaultLocale: 'en-US',
    messages: messages['en-US'],
  },
  cache,
)

const mapStateToProps = (state) => {
  return {
    Login: state.Login
  }
}

//ALPD-715 Fix
export function createIntlReinitilize(language)
{
  return  intl = createIntl(
    {
      locale: language,
      defaultLocale: language,
      messages: messages[language],
    },
    cache,
  )
}

class App extends React.Component {
    constructor(props) {
      super(props);
      this.handleUnload = this.handleUnload.bind(this);
      this.handleEndConcert = this.handleEndConcert.bind(this);
      // Store the previous pathname and search strings
      this.currentPathname = null;
      this.currentSearch = null;
    }
    
    componentDidMount() {
      window.addEventListener('beforeunload', this.handleUnload);
      window.addEventListener('unload', this.handleEndConcert)
      const { history } = this.props;
  
      history.listen((newLocation, action) => {
        if (action === "PUSH") {
          if (
            newLocation.pathname !== this.currentPathname ||
            newLocation.search !== this.currentSearch
          ) {
            // Save new location
            this.currentPathname = newLocation.pathname;
            this.currentSearch = newLocation.search;
  
            // Clone location object and push it to history
            history.push({
              pathname: newLocation.pathname,
              search: newLocation.search
            });
          }
        } 
        //If user tries to navigate to page by manually changing the URL in browsers Address Bar, the system will automatically navigates to the Login Page
        else if(action === "POP"){
          window.location.replace(window.location.origin+window.location.pathname);
        }
        
        else {
          // Send user back if they try to navigate back
          history.go(1);
        }
      });
    }

    componentWillUnmount() {
      window.removeEventListener('beforeunload', this.handleUnload);
      window.removeEventListener('unload', this.handleEndConcert)
      this.handleEndConcert()
    }

   handleUnload(e) {
      const message = "\o/";
      if (this.props.Login.userInfo.susername && this.props.Login.userInfo.susername !== "") {
        let uRL = "";
        let inputData = [];
        uRL = 'login/insertAuditAction';
        inputData = {
          userinfo: this.props.Login.userInfo,
          scomments: `User Name:${this.props.Login.userInfo.susername}, Login ID:${this.props.Login.userInfo.sloginid}`,
          sauditaction: "IDS_IMPROPERLOGOUT", nFlag: 2
        }

        rsapi().post(uRL, inputData)
          .then(response => {
            (e || window.event).returnValue = message; //Gecko + IE
            return message;
          })
          .catch(error => {
            if (error.response?.status === 429) {
                    toast.warn(intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
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
            } else {
              toast.warn(error.response.data);
            }
          })
      } else {
        (e || window.event).returnValue = message; //Gecko + IE
        return message;
      }
    }

    handleEndConcert = async () => {
      // Write a code to handle Leave button clicked
      // await fetcher({
      //   url: endConcert(concert.id),
      //   method: 'PUT'
      // })
    }
    

  render() {
    const { language, navigation } = this.props.Login;
    const currentTheme = this.props.Login.selectedUserUiConfig && this.props.Login.selectedUserUiConfig.sthemecolorname.toLowerCase(); 
    document.body.classList.remove("blue","purple","pink","green","orange");
    document.body.classList.add(currentTheme);
    return (
        <IntlProvider locale={language} messages={messages[language]}>

          
        {/* component commented by L.Subashini 13/12/2025 while upgrading to React 17 */}
        {/* <ReactTooltip place="top"   globalEventOff='click' className='react-tooltip'/> */}

        {/* Tooltip component changed by L.Subashini 13/12/2025 while upgrading to React 17 */}
        <Tooltip id="my-tooltip" place="top"   globalEventOff='click' className='react-tooltip'/>
        {/* <button data-tooltip-id="my-tooltip" data-tooltip-content="Hello!">
          Hover me
        </button> */}

          <Switch>
            <Route exact path="/login" name="Login" render={props=> <Login {...props} />} />
            {/* ALPD-5704 Added validation to avoid unwanted screen entering by changing url by Vishakh (09-04-2025) */}
            {this.props.Login.loginFlag ? <Route path="/" name="Home" render={props=> <Layout {...props}/>} /> 
            : <Redirect push exact to={"/" + navigation} />}
          </Switch>
          { this.props.Login.loginFlag && <GlobalTimer /> } {/* ALPDJ21-132 - Added by Ganesh on 27/11/2025 for every 15 min session time update */}
          <Redirect push exact to={"/" + navigation} />
          { navigation !== "login" && <PortalApp />}
        </IntlProvider>
      );
  }
}
export default connect(mapStateToProps, {updateStore})(withRouter(App));
