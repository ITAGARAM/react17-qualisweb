import React, { Component } from 'react';
import { Col, Row, Button, FormGroup, FormLabel, Nav } from 'react-bootstrap';
import { injectIntl, FormattedMessage } from 'react-intl';
import FormInput from '../../components/form-input/form-input.component';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import Countdown from 'react-countdown';
import { authenticatioType, transactionStatus } from '../../components/Enumeration';
import { resendOTP } from '../../actions'
import { connect } from 'react-redux';

const mapStateToProps = (state) => {
  return {
    Login: state.Login
  }
}
class MFAEmailOTP extends Component {
  constructor(props) {
    super(props);
    this.state = {
      targetTime: null,
      countdownKey: 0,
      showResend: false
    };
  }

  componentDidMount() {
    this.setInitialCountdown();
  }

  componentDidUpdate(prevProps) {
    let selectedAuthRecord = this.props;

    if (this.props.selectedAuthRecord.notpexpiredtime !== prevProps.selectedAuthRecord.notpexpiredtime) {
      this.setInitialCountdown();
    }
    //comment by vignesh for once resend response comes then timer reset.
    /*
        if (
          this.props.selectedAuthRecord.isResentOTP &&
          this.props.selectedAuthRecord.isResentOTP !== prevProps.selectedAuthRecord.isResentOTP
        ) {
          const targetTime = Date.now() + 2 * 60 * 1000;
          this.setState((prevState) => ({
            targetTime,
            countdownKey: prevState.countdownKey + 1,
          }));
    
          // 🔁 Notify parent to reset isResentOTP
          this.props.resetResentOTPFlag();
        }
        */


  }

  setInitialCountdown = () => {

    if (this.props.selectedAuthRecord.notpexpiredtime) {
      const targetTime = Date.now() + this.props.selectedAuthRecord.notpexpiredtime * 60 * 1000;
      this.setState({ targetTime });
    }
  };

  countdownRenderer = ({ minutes, seconds, completed }) => {
    if (completed && !this.state.showResend) {
      // Delay state update to next tick to avoid React update loop
      setTimeout(() => {
        this.setState({ showResend: true });
      }, 0);
      return null;
    }
    const pad = (val) => String(val).padStart(2, '0');
    return (
      <span style={{ color: 'red', marginLeft: '0.5rem' }}>
        {pad(minutes)}:{pad(seconds)}
      </span>
    );
  };

  onResendOTP = () => {
    const inputData = {
      userinfo: this.props.userInfo,
    };
    // Reset target time and flag
    const targetTime = Date.now() + this.props.selectedAuthRecord.notpexpiredtime * 60 * 1000;
    this.setState((prevState) => ({
      targetTime,
      countdownKey: prevState.countdownKey + 1,
      showResend: false,
    }));
    // Call the resend OTP prop function
    this.props.resendOTP(inputData, this.props.selectedAuthRecord);



  };

  render() {
    //console.log("this.props.selectedAuthRecord:", this.props.selectedAuthRecord);
    //  const { selectedAuthRecord, showEmailOTPModal, intl } = this.props;
    // console.log("SelectedAuthRecord",this.state.selectedAuthRecord);
    return (
      <>
            <Row>
               
                  <Col md={12}>
                      {/* Select MFA Type */}
                      {this.props.selectedAuthRecord.newUserAuth && (
                        <FormSelectSearch
                          formLabel={this.props.intl.formatMessage({ id: 'IDS_AUTHENTICATIONTYPE' })}
                          isSearchable
                          name="nmfatypecode"
                          placeholder={this.props.intl.formatMessage({ id: 'IDS_SELECTRECORD' })}
                          isMandatory={true}
                          options={this.props.mfaType}
                          value={this.props.selectedAuthRecord.nmfatypecode || ''}
                          onChange={(e) => this.props.onComboChange(e, 'nmfatypecode', 1)}
                          isDisabled={
                            this.props.selectedAuthRecord.nactivestatus &&
                            !this.props.showEmailOTPModal &&
                            this.props.selectedAuthRecord.nmfatype &&
                            this.props.selectedAuthRecord.nmfatype !== transactionStatus.NA
                          }
                        />
                      )}
                      
                      {/* Email Input + Send + Edit */}          
                      {((this.props.selectedAuthRecord.newUserAuth && this.props.selectedAuthRecord.nmfatypecode
                        && this.props.selectedAuthRecord.nmfatypecode.value === authenticatioType.EMAIL) || (this.props.selectedAuthRecord.nmfatype === authenticatioType.EMAIL))
                        && !this.props.selectedAuthRecord.showActiveStatus
                        && ( 
                          <FormGroup>  
                            <FormInput
                                    name="sreceivermailid"
                                    label={this.props.intl.formatMessage({ id: 'IDS_OTPSENTTOEMAIL' })} 
                                    type="text"
                                    onChange={this.props.onInputOnChangeAuthentication}
                                    value={this.props.selectedAuthRecord?.sreceivermailid || ''}
                                    isDisabled={true}
                                    // style={{
                                    //   overflow: 'hidden',
                                    //   textOverflow: 'ellipsis',
                                    //   whiteSpace: 'nowrap',
                                    // }}
                                    title={this.props.selectedAuthRecord?.sreceivermailid}
                                  />
                                            
                                    {!this.props.selectedAuthRecord.showEmailOTPModal && (
                                      <Button onClick={this.props.sendOTPMail}>
                                        <FormattedMessage id="IDS_SENDOTP" />                                        
                                      </Button>
                                    )}

                                {this.props.selectedAuthRecord && parseInt(this.props.selectedAuthRecord.nNeedEmailEdit) === transactionStatus.YES && (
                                  <Nav.Link
                                    style={{
                                      padding: '6px 10px',
                                      borderRadius: '50%',
                                      height: 40,
                                      width: 40,
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      border: '1px solid #ccc',
                                      backgroundColor: '#fff',
                                    }}
                                    title={this.props.intl.formatMessage({ id: 'IDS_EDIT' })}
                                    onClick={this.props.editEmail}
                                  >
                                    <FontAwesomeIcon icon={faPencilAlt} />
                                  </Nav.Link>
                                )}
                            </FormGroup>
                      )}
                  

                  {this.props.selectedAuthRecord.showEmailOTPModal &&
                              
                      <FormInput
                            name="sonetimepassword"
                            label={`${this.props.intl.formatMessage({ id: 'IDS_OTP' })} ${this.props.selectedAuthRecord.sonetimepasswordcode ? this.props.selectedAuthRecord.sonetimepasswordcode:""}`}
                            type="text"
                            required
                            isMandatory
                            onChange={this.props.onInputOnChangeAuthentication}
                            value={this.props.selectedAuthRecord?.sonetimepassword || ''}
                            style={{ width: '100%' }}
                          />
                  }
                  <Row>                   
                      <Col md="2">                 
                        {this.props.selectedAuthRecord.showEmailOTPModal 
                            && this.state.targetTime && 
                        
                            <Countdown
                              key={this.state.countdownKey}
                              date={this.state.targetTime}
                              renderer={this.countdownRenderer}
                            />   
                        } 
                      </Col>
                      <Col md="4">             
                        {this.props.selectedAuthRecord.showEmailOTPModal 
                          && this.state.targetTime && 
                            <Button onClick={this.props.onVerifyOTP}>
                                {this.props.intl.formatMessage({ id: 'IDS_VERIFY' })}
                            </Button>
                        }
                      </Col>
                      <Col md="4">
                          {this.state.showResend && this.state.showResend && (
                    
                            <Button onClick={this.onResendOTP}>
                              {this.props.intl.formatMessage({ id: 'IDS_RESEND' })}
                            </Button>)
                    
                          }   
                      </Col>
                    </Row>
                  </Col>
            </Row>
            {/* OTP Input + Verify + Resend + Countdown */}   
             
      </>
       
    );
  }
}

export default connect(mapStateToProps, {
  resendOTP
})(injectIntl(MFAEmailOTP));
