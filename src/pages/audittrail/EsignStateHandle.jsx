import React from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'react-bootstrap';
import FormInput from '../../components/form-input/form-input.component';
import FormTextarea from '../../components/form-textarea/form-textarea.component';
import CustomSwitch from '../../components/custom-switch/custom-switch.component';
import { FormattedMessage, injectIntl } from 'react-intl';
import DateTimePicker from '../../components/date-time-picker/date-time-picker.component';
import { TagLine } from "../../components/login/login.styles";
import { transactionStatus } from '../../components/Enumeration';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';

const mapStateToProps = state => {
    return ({ Login: state.Login })
}

class EsignStateHandle extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedRecord: {
                ...this.props.selectedRecord,
                'esignpassword': "",
                'esigncomments': "",
                'esignreason': ""
            }
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
                        onChange={(event) => this.onInputOnChange(event)}
                    />

                    <FormInput
                        name={"esignpassword"}
                        type="password"
                        label={this.props.intl.formatMessage({ id: "IDS_PASSWORD" })}
                        placeholder={this.props.intl.formatMessage({ id: "IDS_PASSWORD" })}
                        isMandatory={true}
                        required={true}
                        maxLength={50}
                        onChange={(event) => this.onInputOnChange(event)}
                    />

                    <FormSelectSearch
                        name={"esignreason"}
                        formLabel={this.props.intl.formatMessage({ id: "IDS_REASON" })}
                        placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                        options={this.props.Login.esignReasonList || []}
                        // value = {this.props.selectedRecord["esignreason"] ? this.props.selectedRecord["esignreason"] : ""}
                        isMandatory={true}
                        isMulti={false}
                        isClearable={false}
                        isSearchable={true}
                        isDisabled={false}
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
                        maxLength={255}
                        onChange={(event) => this.onInputOnChange(event)}
                    />

                    <DateTimePicker
                        name={"esigndate"}
                        label={this.props.intl.formatMessage({ id: "IDS_ESIGNDATE" })}
                        className='form-control'
                        placeholderText="Select date.."
                        selected={this.props.Login.serverTime}
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
                        checked={this.state.selectedRecord && this.state.selectedRecord.agree ? this.state.selectedRecord.agree === transactionStatus.YES ? true : false : true}
                        onChange={(event) => this.onInputOnChange(event)}
                    />
                </Col>
            </Row>
        )
    }

    onComboChange = (comboData, fieldName) => {
        const selectedRecord = this.state.selectedRecord || {};
        selectedRecord[fieldName] = comboData;
        this.setState({ selectedRecord });
        this.props.childDataChange(selectedRecord);
    }

    onInputOnChange = (event) => {
        let selectedRecord = this.state.selectedRecord;
        if (event.target.type === 'checkbox') {
            selectedRecord[event.target.name] = event.target.checked === true ? transactionStatus.YES : transactionStatus.NO;
        } else {
            selectedRecord[event.target.name] = event.target.value;
        }
        this.setState({ selectedRecord });
        this.props.childDataChange(selectedRecord);
    }

    componentWillUnmount() {
        let selectedRecord = this.state.selectedRecord;
        delete (selectedRecord['esignpassword'])
        delete (selectedRecord['esigncomments'])
        delete (selectedRecord['esignreason'])
        delete (selectedRecord['agree'])
        this.setState({ selectedRecord });
        this.props.childDataChange(selectedRecord);
    }
}
export default connect(mapStateToProps, {})(injectIntl(EsignStateHandle));