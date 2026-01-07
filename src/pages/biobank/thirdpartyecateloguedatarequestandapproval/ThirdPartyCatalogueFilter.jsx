import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { rearrangeDateFormat } from '../../../components/CommonScript';
import DateTimePicker from '../../../components/date-time-picker/date-time-picker.component';
import FormSelectSearch from '../../../components/form-select-search/form-select-search.component';

const mapStateToProps = state => {
    return ({ Login: state.Login })
}

class ThirdPartyCatalogueFilter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            lstFilterStatus: props.lstFilterStatus || [],
            ntranscode: props.selectedFilterStatus || {},
            fromDate: props.fromDate,
            toDate: props.toDate,
            selectedRecord: { fromDate: props.fromDate, toDate: props.toDate, ntranscode: props.selectedFilterStatus },
        };
    }

    render() {
        return (
            <>
                <Row>
                    <Col md={6}>
                        <DateTimePicker
                            name={"fromdate"}
                            label={this.props.intl.formatMessage({ id: "IDS_FROM" })}
                            className='form-control'
                            placeholderText="Select date.."
                            selected={this.state.selectedRecord.fromDate ? rearrangeDateFormat(this.props.userInfo, this.state.selectedRecord.fromDate) : new Date()}
                            dateFormat={this.props.userInfo["ssitedate"]}
                            isClearable={false}
                            onChange={date => this.handleFilterDateChange("fromDate", date)}
                            value={this.state.selectedRecord.fromDate ? rearrangeDateFormat(this.props.userInfo, this.state.selectedRecord.fromDate) : new Date()}
                        />
                    </Col>
                    <Col md={6}>
                        <DateTimePicker
                            name={"todate"}
                            label={this.props.intl.formatMessage({ id: "IDS_TO" })}
                            className='form-control'
                            placeholderText="Select date.."
                            selected={this.state.selectedRecord.toDate ? rearrangeDateFormat(this.props.userInfo, this.state.selectedRecord.toDate) : new Date()}
                            dateFormat={this.props.userInfo["ssitedate"]}
                            isClearable={false}
                            onChange={date => this.handleFilterDateChange("toDate", date)}
                            value={this.state.selectedRecord.toDate ? rearrangeDateFormat(this.props.userInfo, this.state.selectedRecord.toDate) : new Date()}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col md={12}>
                        <FormSelectSearch
                            formLabel={this.props.intl.formatMessage({ id: "IDS_FORMSTATUS" })}
                            name={"ntransactionstatus"}
                            placeholder={this.props.intl.formatMessage({ id: "IDS_PLEASESELECT" })}
                            optionId={"ntransactionstatus"}
                            optionValue={"stransdisplaystatus"}
                            options={this.state.lstFilterStatus || []}
                            showOption={true}
                            value={this.state.selectedRecord.ntranscode}
                            isSearchable={true}
                            onChange={(event) => this.onFilterComboChange(event, "ntranscode")}
                            sortOrder="ascending"
                        >
                        </FormSelectSearch>
                    </Col>
                </Row>
            </>
        );
    }

    handleFilterDateChange = (field, value) => {
        let selectedRecord = this.state.selectedRecord
        selectedRecord[field] = value;
        this.setState({ selectedRecord });
        this.props.childFilterDataChange(selectedRecord);
    }



    onFilterComboChange = (event, field) => {
        let selectedRecord = this.state.selectedRecord
        selectedRecord[field] = event;
        this.setState({ selectedRecord });
        this.props.childFilterDataChange(selectedRecord);
    }
}

export default connect(mapStateToProps, {})(injectIntl(ThirdPartyCatalogueFilter));