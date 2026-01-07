import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { updateStore } from '../../../actions';
import { rearrangeDateFormat } from '../../../components/CommonScript';
import DateTimePicker from '../../../components/date-time-picker/date-time-picker.component';
import FormInput from '../../../components/form-input/form-input.component';
import FormTextarea from '../../../components/form-textarea/form-textarea.component';

const mapStateToProps = (state) => {
    return {
        Login: state.Login
    }
}

class ReceiveFormAcceptance extends React.Component {
    constructor(props) {
        super(props)
        const dataState = {
            skip: 0,
            take: this.props.settings ? parseInt(this.props.settings[14]) : 10,
        };
        this.state = {
            loading: false,
            dataState: dataState,
            lstStorageCondition: props.lstStorageCondition,
            lstUsers: props.lstUsers,
            lstCourier: props.lstCourier,
            operation: props.operation,
            selectedRecord: {
                ...props.selectedRecord,
                sformnumber: props.sformnumber ? props.sformnumber : "",
                soriginsitename: props.soriginsitename ? props.soriginsitename : "",
                ddeliverydate: props.ddeliverydate ? props.ddeliverydate : new Date(),
                scouriername: props.scouriername ? props.scouriername : "",
                scourierno: props.scourierno ? props.scourierno : "",
                sremarks: props.sremarks ? props.sremarks : "",
                dreceiveddate: props.dreceiveddate ? props.dreceiveddate : new Date(),
                svalidationremarks: props.svalidationremarks ? props.svalidationremarks : ""
            },
            controlMap: props.controlMap,
            userRoleControlRights: props.userRoleControlRights,
        }
    }

    render() {
        return (
            <><Row>
                <Col md={12}>
                    <FormInput
                        label={this.props.intl.formatMessage({ id: "IDS_FORMNUMBER" })}
                        name="sformnumber"
                        type="text"
                        onChange={(event) => this.onInputOnChange(event)}
                        placeholder={this.props.intl.formatMessage({ id: "IDS_FORMNUMBER" })}
                        value={this.state.selectedRecord ? this.state.selectedRecord.sformnumber : ""}
                        isMandatory={true}
                        required={true}
                        isDisabled={true}
                        maxLength={100}
                    />
                </Col>
                <Col md={12}>
                    <FormInput
                        label={this.props.intl.formatMessage({ id: "IDS_SENDERBIOBANK" })}
                        name="soriginsitename"
                        type="text"
                        onChange={(event) => this.onInputOnChange(event)}
                        placeholder={this.props.intl.formatMessage({ id: "IDS_SENDERBIOBANK" })}
                        value={this.state.selectedRecord ? this.state.selectedRecord.soriginsitename : ""}
                        isMandatory={true}
                        required={true}
                        isDisabled={true}
                        maxLength={100}
                    />
                </Col>
                <Col md={6}>
                    <DateTimePicker
                        name={"deliverydate"}
                        label={this.props.intl.formatMessage({ id: "IDS_DELIVERYDATE" })}
                        className='form-control'
                        placeholderText="Select date.."
                        selected={this.state.selectedRecord.ddeliverydate ? rearrangeDateFormat(this.props.Login.userInfo, this.state.selectedRecord.ddeliverydate) : new Date()}
                        dateFormat={this.props.Login.userInfo["ssitedate"]}
                        isClearable={false}
                        isMandatory={true}
                        isDisabled={true}
                        onChange={date => this.handleDateChange("ddeliverydate", date)}
                        value={this.state.selectedRecord.ddeliverydate ? rearrangeDateFormat(this.props.Login.userInfo, this.state.selectedRecord.ddeliverydate) : new Date()}
                    />
                </Col>
                <Col md={12}>
                    <FormInput
                        label={this.props.intl.formatMessage({ id: "IDS_COURIERNAME" })}
                        name="scouriername"
                        type="text"
                        onChange={(event) => this.onInputOnChange(event)}
                        placeholder={this.props.intl.formatMessage({ id: "IDS_COURIERNAME" })}
                        value={this.state.selectedRecord ? this.state.selectedRecord.scouriername : ""}
                        isMandatory={true}
                        required={true}
                        isDisabled={true}
                        maxLength={100}
                    />
                </Col>
                {this.state.selectedRecord?.scourierno && this.state.selectedRecord.scourierno !== "" && this.state.selectedRecord.scourierno !== null &&
                    <Col md={12}>
                        <FormInput
                            label={this.props.intl.formatMessage({ id: "IDS_COURIERNO" })}
                            name="scourierno"
                            type="text"
                            onChange={(event) => this.onInputOnChange(event, "scourierno")}
                            placeholder={this.props.intl.formatMessage({ id: "IDS_COURIERNO" })}
                            value={this.state.selectedRecord ? this.state.selectedRecord.scourierno : ""}
                            isMandatory={false}
                            required={false}
                            isDisabled={true}
                            maxLength={100}
                        />
                    </Col>
                }

                {this.state.selectedRecord?.svalidationremarks && this.state.selectedRecord.svalidationremarks !== "" && this.state.selectedRecord.svalidationremarks !== null &&
                    <Col md={12}>
                        <FormTextarea
                            label={this.props.intl.formatMessage({ id: "IDS_VALIDATIONREMARKS" })}
                            name={"sremarks"}
                            type="text"
                            onChange={(event) => this.onInputOnChange(event, 'svalidationremarks')}
                            placeholder={this.props.intl.formatMessage({ id: "IDS_VALIDATIONREMARKS" })}
                            value={this.state.selectedRecord ? this.state.selectedRecord.svalidationremarks : ""}
                            rows="2"
                            isMandatory={false}
                            required={false}
                            isDisabled={true}
                            maxLength={"255"}
                        />
                    </Col>
                }
                <Col md={12}>
                    <FormInput
                        label={this.props.intl.formatMessage({ id: "IDS_RECIPIENTNAME" })}
                        name="srecipientname"
                        type="text"
                        onChange={(event) => this.onInputOnChange(event, "srecipientname")}
                        placeholder={this.props.intl.formatMessage({ id: "IDS_RECIPIENTNAME" })}
                        value={this.state.selectedRecord ? this.state.selectedRecord.srecipientname : ""}
                        isMandatory={true}
                        required={true}
                        maxLength={100}
                    />
                </Col>
                <Col md={6}>
                    <DateTimePicker
                        name={"receiveddate"}
                        label={this.props.intl.formatMessage({ id: "IDS_RECEIVEDDATE" })}  // modified by sujatha to omit time in the received date
                        className='form-control'
                        placeholderText="Select date.."
                        selected={this.state.selectedRecord.dreceiveddate ? rearrangeDateFormat(this.props.Login.userInfo, this.state.selectedRecord.dreceiveddate) : new Date()}
                        dateFormat={this.props.Login.userInfo["ssitedate"]}
                        isClearable={false}
                        isMandatory={true}
                        onChange={date => this.handleDateChange("dreceiveddate", date)}
                        value={this.state.selectedRecord.dreceiveddate ? rearrangeDateFormat(this.props.Login.userInfo, this.state.selectedRecord.dreceiveddate) : new Date()}
                    />
                </Col>
            </Row>
            </>)
    }

    onComboChange = (event, field) => {
        let selectedRecord = this.state.selectedRecord;
        selectedRecord[field] = event;
        this.setState({ selectedRecord });
        this.props.childDataChange(selectedRecord);
    }

    onInputOnChange = (event, field) => {
        let selectedRecord = this.state.selectedRecord;
        selectedRecord[field] = event.target.value;
        this.setState({ selectedRecord });
        this.props.childDataChange(selectedRecord);
    }

    handleDateChange = (field, value) => {
        let selectedRecord = this.state.selectedRecord
        selectedRecord[field] = value;
        this.setState({ selectedRecord });
        this.props.childDataChange(selectedRecord);
    }

}

export default connect(mapStateToProps, { updateStore })(injectIntl(ReceiveFormAcceptance));