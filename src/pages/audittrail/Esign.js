import React from 'react';
import { connect } from 'react-redux';
import { Row, Col, Button } from 'react-bootstrap';
import FormInput from '../../components/form-input/form-input.component';
import FormTextarea from '../../components/form-textarea/form-textarea.component';
import CustomSwitch from '../../components/custom-switch/custom-switch.component';
import { FormattedMessage, injectIntl } from 'react-intl';
import DateTimePicker from '../../components/date-time-picker/date-time-picker.component';
import { TagLine } from "../../components/login/login.styles";
import { transactionStatus } from '../../components/Enumeration';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import { updateStore } from '../../actions';
import { DEFAULT_RETURN } from '../../actions/LoginTypes';
import { sendOTPMail,resendOTP,confirmOTP } from '../../actions'
import onVerifyOTP from '../../components/sign-in/sign-in.component';
import Countdown from 'react-countdown';
import { toast } from 'react-toastify';

const mapStateToProps = state => {
    return ({ Login: state.Login })
}

class Esign extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            agree: transactionStatus.YES,
            countdownKey: 0,
            showResend: false,
            targetTime: null
        }
    }

    static getDerivedStateFromProps(props, state) {
        state.agree = props.selectedRecord.agree === transactionStatus.NO ? false : true
    }

    // SWSM-48 - Added by gowtham(18-09-2025) - to get user email for E-sign mail authentication(ONLY FOR RELEASE)
    onVerifyOTP=()=> {
      if (this.state.targetTime > Date.now()) {
        const failedControls = [];
        let mandatoryField=[];
        const selectedAuthRecord = this.props.Login.selectedAuthRecord;
        mandatoryField.push({  idsName: "IDS_OTPALERTVALIDATION",  dataField: "sonetimepassword",  mandatory: true });
  
        mandatoryField.map(item => {
          if (this.props.selectedRecord[item.dataField] === undefined) {
            failedControls.push(this.props.intl.formatMessage({ id: item.idsName }));
          } else if (typeof this.props.selectedRecord[item.dataField] === "string") {
            //to handle string field -- added trim function
            if (this.props.selectedRecord[item.dataField].trim().length === 0) {
              failedControls.push(this.props.intl.formatMessage({ id: item.idsName }));
            }
          }
          return null;
        });
        if (failedControls.length === 0) {
          let inputParam={
            "inputData":{
              // "nmfatypecode":selectedAuthRecord ? selectedAuthRecord.nmfatypecode && selectedAuthRecord.nmfatypecode.value : 1,
              "nmfatypecode": 1,
              "sonetimepasswordcode": selectedAuthRecord ? selectedAuthRecord.sonetimepasswordcode : -1,
              "userinfo": this.props.Login.userInfo && this.props.Login.userInfo,
              "nFlag": 1,
              "isEsignOTP": true,
              "onSaveClick": this.props.onSaveClick,
              "screenData": this.props.screenData,
              "sonetimepassword": this.props.selectedRecord ? this.props.selectedRecord.sonetimepassword : -1,
              "nactivestatus": selectedAuthRecord ? selectedAuthRecord.nactivestatus : transactionStatus.NO
            }
          }
          this.props.confirmOTP(inputParam);
        } else {
            toast.info(`${this.props.intl.formatMessage({ id: "IDS_ENTER" })} ${failedControls[0]}`);
        }
      } else {
        toast.info(this.props.intl.formatMessage({ id: "IDS_OTPTIMEOUT" }));
      }
    }

    // SWSM-48 - Added by gowtham(18-09-2025) - to get user email for E-sign mail authentication(ONLY FOR RELEASE)
    componentDidUpdate(prevProps, prevState) {
      // console.log("🔹 componentDidUpdate");
        if (this.props.Login.selectedAuthRecord &&
          this.props.Login.selectedAuthRecord !== prevProps.Login.selectedAuthRecord
        ) {
          // console.log("🔹 notpexpiredtime changed, resetting countdown");
          this.setInitialCountdown();
        }
        if (this.state.countdownKey !== prevState.countdownKey){
          document.getElementsByName('sonetimepassword')[0].focus();
        }
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
    
      // SWSM-48 - Added by gowtham(18-09-2025) - to get user email for E-sign mail authentication(ONLY FOR RELEASE)
      setInitialCountdown = () => {
    
        if (this.props.Login.selectedAuthRecord && this.props.Login.selectedAuthRecord.notpexpiredtime) {
        
          const targetTime = this.props.Login.selectedAuthRecord ? Date.now() + this.props.Login.selectedAuthRecord.notpexpiredtime * 60 * 1000 : null;
          
          this.setState({ targetTime,countdownKey: this.state.countdownKey + 1 });
        }
      };

      // SWSM-48 - Added by gowtham(18-09-2025) - to get user email for E-sign mail authentication(ONLY FOR RELEASE)
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
    
      // SWSM-48 - Added by gowtham(18-09-2025) - to get user email for E-sign mail authentication(ONLY FOR RELEASE)
      onResendOTP = () => {
        if (this.state.targetTime <= Date.now() || this.props.Login.isValidOtp) {
          const inputData = {
            userinfo: this.props.Login.userInfo,
          };
          // Reset target time and flag
          const targetTime = Date.now() + this.props.Login.selectedAuthRecord.notpexpiredtime * 60 * 1000;
          this.setState((prevState) => ({
            targetTime,
            countdownKey: prevState.countdownKey + 1,
            showResend: true,
          }));
          this.props.onInputOnChange({ target: 
            {
              name: 'sonetimepassword',
              value: ''
            }
          })
          // Call the resend OTP prop function
          this.props.resendOTP(inputData, this.props.Login.selectedAuthRecord);
        } else {
          toast.info(this.props.intl.formatMessage({ id: "IDS_PLEASEWAITFORTHECOUNTDOWN" }));
        }
      };

     // SWSM-48 - Added by gowtham(18-09-2025) - to get user email for E-sign mail authentication(ONLY FOR RELEASE)
     onInputOnChangeAuthentication(eventValues) {
        //otp field length validation
        if (/^\d*$/.test(eventValues.target.value) && eventValues.target.value.length <= 6) {
            const selectedAuthRecord = this.state.selectedAuthRecord || {};
            selectedAuthRecord[eventValues.target.name] = eventValues.target.value;
            this.setState({ selectedAuthRecord });
          }
      }

    render() {
        return (
            <Row>
                <Col md={12}>
                    <FormInput
                        name={"sloginid"}
                        type="text"
                        label={this.props.intl.formatMessage({ id: "IDS_LOGINID" })}
                        placeholder={this.props.intl.formatMessage({ id: "IDS_LOGINID" })}
                        defaultValue={this.props.inputParam && this.props.inputParam.inputData
                            && (this.props.inputParam.inputData.userinfo["sdeputyid"] || "")}
                        isMandatory={false}
                        required={false}
                        maxLength={20}
                        readOnly={true}
                        onChange={(event) => this.props.onInputOnChange(event)}
                    />

                    <FormInput
                        name={"esignpassword"}
                        type="password"
                        label={this.props.intl.formatMessage({ id: "IDS_PASSWORD" })}
                        placeholder={this.props.intl.formatMessage({ id: "IDS_PASSWORD" })}
                        isMandatory={true}
                        required={true}
                        readOnly={this.state.countdownKey > 0}
                        maxLength={50}
                        onChange={(event) => this.props.onInputOnChange(event)}
                    />

                    <FormSelectSearch
                        name={"esignreason"}
                        formLabel={this.props.intl.formatMessage({ id: "IDS_REASON" })}
                        placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                        options={this.props.esignReasonList || this.props.Login.esignReasonList || []}
                        // value = {this.props.selectedRecord["esignreason"] ? this.props.selectedRecord["esignreason"] : ""}
                        isMandatory={true}
                        isMulti={false}
                        isClearable={false}
                        isSearchable={true}
                        isDisabled={this.state.countdownKey > 0}
                        closeMenuOnSelect={true}
                        onChange={(event) => this.onComboChange(event, "esignreason")}
                    />

                    <FormTextarea
                        name={"esigncomments"}
                        label={this.props.intl.formatMessage({ id: "IDS_COMMENTS" })}
                        placeholder={this.props.intl.formatMessage({ id: "IDS_COMMENTS" })}
                        rows="2"
                        isMandatory={true}
                        required={true}
                        readOnly={this.state.countdownKey > 0}
                        maxLength={255}
                        onChange={(event) => this.props.onInputOnChange(event)}
                    />

                    <DateTimePicker
                        name={"esigndate"}
                        label={this.props.intl.formatMessage({ id: "IDS_ESIGNDATE" })}
                        className='form-control'
                        placeholderText="Select date.."
                        //selected={this.props.Login.serverTime}
                        /* ALPD-5120 : Added by rukshana this.state.serverTime for Sample Retrieval and Disposal screen : E-signature's date and time not displayed in popup   */
                        selected={this.props.Login.serverTime || this.props.serverTime}
                        dateFormat={this.props.Login.userInfo.ssitedatetime}
                        isClearable={false}
                        readOnly={true}
                    />
             
                    <TagLine>
                        <FormattedMessage id="IDS_ELECTRONICSIGN"></FormattedMessage><br />
                        <FormattedMessage id="IDS_ESIGNTEXT"></FormattedMessage>
                    </TagLine>

                    <CustomSwitch
                      name={"agree"}
                      type="switch"
                      label={this.props.intl.formatMessage({ id: "IDS_AGREE" })}
                      placeholder={this.props.intl.formatMessage({ id: "IDS_AGREE" })}
                      // defaultValue ={ this.props.selectedRecord["agree"] === transactionStatus.NO ? false :true }
                      isMandatory={true}
                      required={true}
                      disabled={this.state.countdownKey > 0}
                      checked={this.state.agree}
                      onChange={(event) => this.toggleChange(event)}
                    />

                    {/* SWSM-48 - Added by gowtham(18-09-2025) - to get user email for E-sign mail authentication(ONLY FOR RELEASE)
                      start */
                      this.state.countdownKey > 0 &&
                        <>
                          <FormInput
                            name="sreceivermailid"
                            label={this.props.intl.formatMessage({ id: 'IDS_OTPSENTTOEMAIL' })}
                            type="text"
                            onChange={(event) => this.props.onInputOnChange(event)}
                            value={this.props.Login.userInfo.semail}
                            isDisabled={true} 
                          />

                          {/* this.state.countdownKey === 0 &&
                            <Button className="btn-user btn-primary-blue"
                              onClick={() => this.props.sendOTPMail(this.props.Login.userInfo, "", true)}>
                              <FormattedMessage id= { this.props.intl.formatMessage({ id: 'IDS_SENDOTP' }) }/>
                            </Button> */}
                          
                            <FormInput
                              name="sonetimepassword"
                              label={`${this.props.intl.formatMessage({ id: 'IDS_OTP' })} ${this.props.Login.selectedAuthRecord.sonetimepasswordcode ? this.props.Login.selectedAuthRecord.sonetimepasswordcode:""}`}
                              type="text"
                              required
                              isMandatory
                              isDisabled={!this.state.countdownKey}
                              onChange={(event) => this.props.onInputOnChange(event)}
                              onKeyUp={(event) => event.keyCode === 13 ? this.onVerifyOTP() : "" }
                              value={this.props.selectedRecord.sonetimepassword || ''}
                              style={{ width: "100%", marginTop: "30px" }}
                           />

                          {
                            !this.props.Login.isValidOtp &&
                              <Row>
                                <Col md="2">
                                  <Countdown
                                    key={this.state.countdownKey}
                                    date={this.state.targetTime}
                                    renderer={this.countdownRenderer}
                                    onComplete={() => this.setState({ showResend: true })}
                                  />
                                </Col>
                              </Row>
                          }
                          
                          { !this.props.Login.isValidOtp && this.state.targetTime >= Date.now() &&
                                <Button className="btn-user btn-primary-blue"
                                  onClick={()=>this.onVerifyOTP()}>
                                  {this.props.intl.formatMessage({ id: 'IDS_VERIFY' })}
                                </Button>
                          }
                            
                          { this.state.targetTime <= Date.now() && !this.props.Login.isValidOtp &&
                              <Button className="btn-user btn-primary-blue"
                                onClick={this.onResendOTP}>
                                  {this.props.intl.formatMessage({ id: 'IDS_RESEND' })}
                              </Button> 
                          }

                          <TagLine>
                            <br/><FormattedMessage id="IDS_ELECTRONICSIGNOTP"></FormattedMessage>
                          </TagLine>

                        </>
                      /* end */}

                </Col>
            </Row>
        )
    }

    onComboChange = (comboData, fieldName) => {
        const selectedRecord = this.props.selectedRecord || {};
        selectedRecord[fieldName] = comboData;
        // this.setState({ selectedRecord });  
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { selectedRecord }
        }
        this.props.updateStore(updateInfo);
    }

    toggleChange = (event) => {
        let agree = event.target.checked === true ? transactionStatus.YES : transactionStatus.NO;
        this.setState({ agree })
        this.props.onInputOnChange(event);
    }
}
//export default injectIntl(Esign);
export default connect(mapStateToProps, { updateStore, sendOTPMail, confirmOTP, resendOTP })(injectIntl(Esign));