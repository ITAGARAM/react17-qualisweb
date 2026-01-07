import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { updateStore } from '../../../actions';
import { rearrangeDateFormat } from '../../../components/CommonScript';
import DateTimePicker from '../../../components/date-time-picker/date-time-picker.component';
import FormInput from '../../../components/form-input/form-input.component';
import FormSelectSearch from '../../../components/form-select-search/form-select-search.component';
import FormTextarea from '../../../components/form-textarea/form-textarea.component';

const mapStateToProps = (state) => {
    return {
        Login: state.Login
    }
}

class ValidateDirectTransfer extends React.Component {
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
                sformnumber: props.sformnumber ? props.sformnumber : [],
                ddeliverydate: props.selectedRecord?.ddeliverydate || new Date()
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
                <Col md={6}>
                    <FormSelectSearch
                        formLabel={this.props.intl.formatMessage({ id: "IDS_TEMPERATUREDEG" })}
                        isSearchable={true}
                        name={"nstorageconditioncode"}
                        placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                        isMandatory={true}
                        options={this.state.lstStorageCondition}
                        optionId='nstorageconditioncode'
                        optionValue='sstorageconditionname'
                        value={this.state.selectedRecord ? this.state.selectedRecord.nstorageconditioncode : ""}
                        onChange={(event) => this.onComboChange(event, 'nstorageconditioncode')}
                        closeMenuOnSelect={true}
                        alphabeticalSort={true}
                        isClearable={false}
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
                        isDisabled={this.props.isChildSlideOut ? this.props.isChildSlideOut : false}
                        onChange={date => this.handleDateChange("ddeliverydate", date)}
                        value={this.state.selectedRecord.ddeliverydate ? rearrangeDateFormat(this.props.Login.userInfo, this.state.selectedRecord.ddeliverydate) : new Date()}
                    />
                </Col>
                <Col md={6}>
                    <FormSelectSearch
                        formLabel={this.props.intl.formatMessage({ id: "IDS_DISPATCHER" })}
                        isSearchable={true}
                        name={"ndispatchercode"}
                        placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                        isMandatory={true}
                        options={this.state.lstUsers}
                        optionId='ndispatchercode'
                        optionValue='sdispatchername'
                        value={this.state.selectedRecord ? this.state.selectedRecord.ndispatchercode : ""}
                        onChange={(event) => this.onComboChange(event, 'ndispatchercode')}
                        closeMenuOnSelect={true}
                        alphabeticalSort={true}
                        isClearable={false}
                    />
                </Col>
                <Col md={6}>
                    <FormSelectSearch
                        formLabel={this.props.intl.formatMessage({ id: "IDS_COURIERNAME" })}
                        isSearchable={true}
                        name={"ncouriercode"}
                        placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                        isMandatory={true}
                        options={this.state.lstCourier}
                        optionId='ncouriercode'
                        optionValue='scouriername'
                        value={this.state.selectedRecord ? this.state.selectedRecord.ncouriercode : ""}
                        onChange={(event) => this.onComboChange(event, 'ncouriercode')}
                        closeMenuOnSelect={true}
                        alphabeticalSort={true}
                        isClearable={false}
                    />
                </Col>
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
                        maxLength={100}
                    />
                </Col>
                <Col md={12}>
                    <FormInput
                        label={this.props.intl.formatMessage({ id: "IDS_TRIPLEPACKAGE" })}
                        name="striplepackage"
                        type="text"
                        onChange={(event) => this.onInputOnChange(event, "striplepackage")}
                        placeholder={this.props.intl.formatMessage({ id: "IDS_TRIPLEPACKAGE" })}
                        value={this.state.selectedRecord ? this.state.selectedRecord.striplepackage : ""}
                        isMandatory={true}
                        required={true}
                        maxLength={100}
                    />
                </Col>
                <Col md={12}>
                    <FormTextarea
                        label={this.props.intl.formatMessage({ id: "IDS_REMARKS" })}
                        name={"svalidationremarks"}
                        type="text"
                        onChange={(event) => this.onInputOnChange(event, 'svalidationremarks')}
                        placeholder={this.props.intl.formatMessage({ id: "IDS_REMARKS" })}
                        value={this.state.selectedRecord ? this.state.selectedRecord.svalidationremarks : ""}
                        rows="2"
                        isMandatory={false}
                        required={false}
                        maxLength={"255"}
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

export default connect(mapStateToProps, { updateStore })(injectIntl(ValidateDirectTransfer));