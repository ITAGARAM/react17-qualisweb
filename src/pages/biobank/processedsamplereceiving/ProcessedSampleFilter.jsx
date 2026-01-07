import React from 'react';
import DateTimePicker from '../../../components/date-time-picker/date-time-picker.component';
import { Row, Col } from 'react-bootstrap';
import FormSelectSearch from '../../../components/form-select-search/form-select-search.component';
import { injectIntl } from 'react-intl';


class RegistrationFilter extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="side_more_filter_wrap">
                <Row>
                    <Col md={6}>
                        <DateTimePicker
                            name={"fromdate"}
                            label={this.props.intl.formatMessage({ id: "IDS_FROM" })}
                            className='form-control'
                            placeholderText="Select date.."
                            selected={this.props.FromDate}
                            dateFormat={this.props.userInfo["ssitedate"]}
                            isClearable={false}
                            onChange={date => this.props.handleFilterDateChange("fromdate", date)}
                            value={this.props.FromDate}

                        />
                    </Col>
                    <Col md={6}>
                        <DateTimePicker
                            name={"todate"}
                            label={this.props.intl.formatMessage({ id: "IDS_TO" })}
                            className='form-control'
                            placeholderText="Select date.."
                            selected={this.props.ToDate}
                            dateFormat={this.props.userInfo["ssitedate"]}
                            isClearable={false}
                            onChange={date => this.props.handleFilterDateChange("todate", date)}
                            value={this.props.ToDate}

                        />
                    </Col>

                    <Col md={12}>
                        <FormSelectSearch
                            formLabel={this.props.intl.formatMessage({ id: "IDS_SAMPLESTATUS" })}
                            isSearchable={true}
                            name={"ntransactionstatus"}
                            isDisabled={false}
                            placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                            isMandatory={true}
                            options={this.props.FilterStatus}
                            optionId="ntransactionstatus"
                            optionValue="stransdisplaystatus"
                            value={this.props.FilterStatusValue ? { "label": this.props.FilterStatusValue.stransdisplaystatus, "value": this.props.FilterStatusValue.ntransactionstatus } : ""}
                            showOption={true}
                            sortField="stransdisplaystatus"
                            sortOrder="ascending"
                            onChange={(event) => this.props.onFilterChange(event, 'FilterStatusValue')}
                        >
                        </FormSelectSearch>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default injectIntl(RegistrationFilter);