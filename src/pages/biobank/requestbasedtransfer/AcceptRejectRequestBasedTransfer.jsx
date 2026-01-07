import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import FormSelectSearch from '../../../components/form-select-search/form-select-search.component';

const mapStateToProps = state => {
    return ({ Login: state.Login })
}

class AcceptRejectRequestBasedTransfer extends React.Component {
    constructor(props) {
        super(props)
        const dataState = {
            skip: 0,
            take: this.props.settings ? parseInt(this.props.settings[14]) : 10,
        };
        this.state = {
            loading: false,
            dataState: dataState,
            operation: props.operation,
            lstSampleCondition: props.lstSampleCondition,
            lstReason: props.lstReason,
            controlMap: props.controlMap,
            userRoleControlRights: props.userRoleControlRights,
            selectedRecord: this.props.Login.selectedChildRecord
        }
    }

    render() {
        return (
            <>
                <Row>
                    <Col md={12}>
                        <FormSelectSearch
                            formLabel={this.props.intl.formatMessage({ id: "IDS_SAMPLECONDITION" })}
                            isSearchable={true}
                            name={"nsamplecondition"}
                            isDisabled={false}
                            placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                            isMandatory={true}
                            options={this.state.lstSampleCondition}
                            optionId='nsamplecondition'
                            optionValue='ssamplecondition'
                            value={this.state.selectedRecord ? this.state.selectedRecord.nsamplecondition : ""}
                            onChange={(event) => this.onComboChange(event, 'nsamplecondition')}
                            closeMenuOnSelect={true}
                            alphabeticalSort={true}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col md={12}>
                        <FormSelectSearch
                            formLabel={this.props.intl.formatMessage({ id: "IDS_REASON" })}
                            isSearchable={true}
                            name={"nreasoncode"}
                            isDisabled={false}
                            placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                            isMandatory={true}
                            options={this.state.lstReason}
                            optionId='nreasoncode'
                            optionValue='sreason'
                            value={this.state.selectedRecord ? this.state.selectedRecord.nreasoncode : ""}
                            onChange={(event) => this.onComboChange(event, 'nreasoncode')}
                            closeMenuOnSelect={true}
                            alphabeticalSort={true}
                        />
                    </Col>
                </Row>
            </>
        );
    }

    onComboChange = (event, field) => {
        let selectedRecord = this.state.selectedRecord;
        if (field === 'sremarks') {
            selectedRecord[field] = event.target.value;
            this.setState({ selectedRecord });
            this.props.childDataChange(selectedRecord);
        } else {
            selectedRecord[field] = event;
            this.setState({ selectedRecord });
            this.props.childDataChange(selectedRecord);
        }
    }
}

export default connect(mapStateToProps, {})(injectIntl(AcceptRejectRequestBasedTransfer));