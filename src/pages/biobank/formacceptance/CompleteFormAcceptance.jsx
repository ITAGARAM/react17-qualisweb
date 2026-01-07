import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { updateStore } from '../../../actions';
import FormSelectSearch from '../../../components/form-select-search/form-select-search.component';
import FormTextarea from '../../../components/form-textarea/form-textarea.component';

const mapStateToProps = (state) => {
    return {
        Login: state.Login
    }
}

class CompleteFormAcceptance extends React.Component {
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
            operation: props.operation,
            selectedRecord: {
                ...props.selectedRecord,
            },
            controlMap: props.controlMap,
            userRoleControlRights: props.userRoleControlRights,
        }
    }

    render() {
        return (
            <><Row>
                <Col md={6}>
                    <FormSelectSearch
                        formLabel={this.props.intl.formatMessage({ id: "IDS_RECEIVINGTEMPERATURE" })}
                        isSearchable={true}
                        name={"nreceivingtemperaturecode"}
                        placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                        isMandatory={true}
                        options={this.state.lstStorageCondition}
                        optionId='nreceivingtemperaturecode'
                        optionValue='sreceivingtemperaturename'
                        value={this.state.selectedRecord ? this.state.selectedRecord.nreceivingtemperaturecode : ""}
                        onChange={(event) => this.onComboChange(event, 'nreceivingtemperaturecode')}
                        closeMenuOnSelect={true}
                        alphabeticalSort={true}
                        isClearable={false}
                    />
                </Col>
                <Col md={6}>
                    <FormSelectSearch
                        formLabel={this.props.intl.formatMessage({ id: "IDS_RECEIVINGOFFICER" })}
                        isSearchable={true}
                        name={"nreceivingofficercode"}
                        placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                        isMandatory={true}
                        options={this.state.lstUsers}
                        optionId='nreceivingofficercode'
                        optionValue='sreceivingofficername'
                        value={this.state.selectedRecord ? this.state.selectedRecord.nreceivingofficercode : ""}
                        onChange={(event) => this.onComboChange(event, 'nreceivingofficercode')}
                        closeMenuOnSelect={true}
                        alphabeticalSort={true}
                        isClearable={false}
                    />
                </Col>
                <Col md={12}>
                    <FormTextarea
                        label={this.props.intl.formatMessage({ id: "IDS_COMPLETIONREMARKS" })}
                        name={"scompletionremarks"}
                        type="text"
                        onChange={(event) => this.onInputOnChange(event, 'scompletionremarks')}
                        placeholder={this.props.intl.formatMessage({ id: "IDS_COMPLETIONREMARKS" })}
                        value={this.state.selectedRecord ? this.state.selectedRecord.scompletionremarks : ""}
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

export default connect(mapStateToProps, { updateStore })(injectIntl(CompleteFormAcceptance));