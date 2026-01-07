import React from "react";
import './slider-page-component.css';
import { Button, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { connect } from 'react-redux';
import { DEFAULT_RETURN } from '../../actions/LoginTypes';
import { updateStore } from '../../actions';
import HomeDashBoard from "../../pages/dashboardtypes/HomeDashBoard";
import StaticHomeDashBoard from '../../pages/dashboardtypes/StaticHomeDashBoard';
import AlertSlide from "../../pages/dashboardtypes/AlertSlide";
import { ReactComponent as RefreshIcon } from '../../assets/image/refresh.svg';
import {
  getListAlert
} from '../../actions';
import { injectIntl } from "react-intl";
import {getDashBoardForHome} from '../../actions/LoginAction';
// import ReactTooltip from 'react-tooltip';

const mapStateToProps = state => {
  return ({ Login: state.Login })
}

class SliderPage extends React.Component {
  constructor(Props) {
    super(Props);
    this.state = { ...Props, SliderOpen: false, loader: false }
  }

  toggleSilde = () => {
     this.setState({ SliderOpen: !this.state.SliderOpen, loader: !this.state.loader })
  }
  render() {
    let initialPage = this.props.Login.homeDashBoard && this.props.Login.homeDashBoard.length > 0
                      && Object.keys(this.props.Login.homeDashBoard)[0];
    if (this.props.Login.masterDataStatic && Object.values(this.props.Login.masterDataStatic).length > 0) 
    {
        initialPage = -1;
    }
    return (
      <>
        <div>
          <Modal
            centered
            scrollable
            bsPrefix = "model model_zindex"
            show={this.props.show}
            onHide={this.props.closeModal}
            dialogClassName={`${this.props.nflag && this.props.nflag === 2 ? 'alert-popup':''} modal-fullscreen`}
            backdrop="static"
            keyboard={false}
                enforceFocus={false}
            aria-labelledby="example-custom-modal-styling-title"
          >
            <Modal.Header closeButton>
              <Modal.Title style={{ "line-height": "1.0" }} id="example-custom-modal-styling-title">
                      {this.props.intl.formatMessage({id: this.props.nflag && this.props.nflag === 1 ?"IDS_DASHBOARD" : "IDS_ALERTS"})}
              </Modal.Title>
              {/* <ReactTooltip globalEventOff="true"/> */}
              {this.props.nflag && this.props.nflag === 2 ?
                  <Button className="solid-blue btn btn-circle btn-primary buttonstyle p-0" variant="link"
                    onClick={() => this.getListAlert()}
                    //title={this.props.intl.formatMessage({id:"IDS_REFRESH"})} 
                    data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({id:"IDS_REFRESH"})}
                    >
                    <RefreshIcon className='custom_icons'/>
                  </Button>
                  
                  // <Button className="btn-user btn-primary-blue" onClick={() => this.getListAlert()}>
                  //   <FontAwesomeIcon icon={faSync} /> { }
                  //   <FormattedMessage id='IDS_REFRESH' defaultMessage='Refresh' />
                  // </Button>

                  : this.props.nflag && this.props.nflag === 1 ?
                  <Button className="solid-blue btn btn-circle btn-primary buttonstyle p-0" variant="link"
                    onClick={() => this.getDashBoard()}
                    //title={this.props.intl.formatMessage({id:"IDS_REFRESH"})} 
                    data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({id:"IDS_REFRESH"})}
                    >
                    <RefreshIcon className='custom_icons'/>
                  </Button>: ""}
            </Modal.Header>
            <Modal.Body>
              <div className="modal-inner-content">
                {this.props.nflag && this.props.nflag === 1 ?
                  <>
                    <>
                      {this.props.Login.currentPageNo === -1 
                        && (this.props.Login.masterDataStatic  && Object.values(this.props.Login.masterDataStatic).length > 0) 
                        ? <StaticHomeDashBoard />
                        : <HomeDashBoard />
                      }
                    </>

                    {/* Arrow Left and Right */}
                    {this.props.Login.currentPageNo > initialPage ?
                      <a href={() => false} class="left-arrow" onClick={this.getPreviousPage}>
                        <FontAwesomeIcon icon={faArrowLeft} />
                      </a>
                      :
                      <></>
                    }
                    {this.props.Login.homeDashBoard && this.props.Login.homeDashBoard.length > 0
                      && (this.props.Login.homeDashBoard.length - 1) !== this.props.Login.currentPageNo
                      // && (this.props.Login.masterDataStatic 
                      //   && Object.values(this.props.Login.masterDataStatic).length > 0)  
                        ?
                      <a href={() => false} class="right-arrow" onClick={this.getNextPage}>
                        <FontAwesomeIcon icon={faArrowRight} />
                      </a>
                      :
                      <></>
                    }
                  </>
                  : <AlertSlide />
                }
              </div>
            </Modal.Body>
          </Modal>
        </div>
      </>
    )
  }

  getListAlert = () => {
    this.props.getListAlert(this.props.Login.userInfo,true)
  }

  getListAlert1 = () => {
    this.props.getListAlert(this.props.Login.userInfo,false)
  }

  getDashBoard = () =>{
    const userInfo = {
      ...this.props.Login.userInfo
    }
    const updateInfo = {
      typeName: DEFAULT_RETURN,
      data: {  userInfo, loading: false, }
    }
    this.props.getDashBoardForHome(updateInfo);
  }

  getPreviousPage = () => {
      if (this.props.Login.homeDashBoard && this.props.Login.homeDashBoard.length > 0) 
      {
          let initialPage = Object.keys(this.props.Login.homeDashBoard)[0];
          if (this.props.Login.masterDataStatic && Object.values(this.props.Login.masterDataStatic).length > 0) 
          {
              initialPage = -1;
          }
          //console.log("initial page:", initialPage, this.props.Login.currentPageNo);
          if (this.props.Login.currentPageNo > initialPage) {
                const currentPageNo = this.props.Login.currentPageNo - 1;

                const updateInfo = {  typeName: DEFAULT_RETURN,
                                      data: { currentPageNo }
                                    }
                this.props.updateStore(updateInfo);
          }
      }
  }

  getNextPage = () => {
    if (this.props.Login.homeDashBoard && this.props.Login.homeDashBoard.length - 1 > this.props.Login.currentPageNo) 
    {
          const currentPageNo = this.props.Login.currentPageNo + 1;
          const updateInfo = {typeName: DEFAULT_RETURN,
                              data: { currentPageNo }
                            }
          this.props.updateStore(updateInfo);
    }
  }

  // componentDidMount() {
  //   const thisBoundedIncrementer = this.getListAlert1.bind(this);
  //   setInterval(thisBoundedIncrementer, 100000);
  // }

}
export default connect(mapStateToProps, { updateStore, getListAlert, getDashBoardForHome })(injectIntl(SliderPage));

