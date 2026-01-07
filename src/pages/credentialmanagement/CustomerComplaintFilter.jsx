import React from 'react';
import DateTimePicker from '../../components/date-time-picker/date-time-picker.component';
import { Row, Col } from 'react-bootstrap';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import { injectIntl } from 'react-intl';

class CustomerComplaintFilter extends React.Component {
    constructor(props) {
        super(props)  
    } 
    
    render() {
        return (
            <div className="side_more_filter_wrap">
                <Row>
                    <Col md={12}>
                        <DateTimePicker
                            name={"fromdate"}
                            label={this.props.intl.formatMessage({ id: "IDS_FROM" })}
                            className='form-control'
                            placeholderText="Select date.."
                            selected={this.props.fromDate}
                            dateFormat={this.props.userInfo["ssitedate"]}
                            isClearable={false}
                            onChange={date => this.props.handleFilterDateChange("fromDate", date)}
                            value={this.props.fromDate}

                        />
                    </Col>
                    <Col md={12}>
                        <DateTimePicker
                            name={"todate"}
                            label={this.props.intl.formatMessage({ id: "IDS_TO" })}
                            className='form-control'
                            placeholderText="Select date.."
                            selected={this.props.toDate}
                            dateFormat={this.props.userInfo["ssitedate"]}
                            isClearable={false}
                            onChange={date => this.props.handleFilterDateChange("toDate", date)}
                            value={this.props.toDate}

                        />
                    </Col>
                      <Col md={12}>        
                                <FormSelectSearch
                                    formLabel={this.props.intl.formatMessage({ id:"IDS_STATUS"})}
                                    placeholder={this.props.intl.formatMessage({ id:"IDS_STATUS"})}
                                    name="ntransactionstatus"
                                    optionId="ntransactionstatus"
                                    optionValue="stransdisplaystatus"
                                    className='form-control'
                                    options={this.props.status}
                                    value={this.props.statusValue? { "label": this.props.statusValue.stransdisplaystatus, "value":this.props.statusValue.ntranscode } : ""}
                                    isMandatory={false}
                                    isMulti={false}
                                    isSearchable={true}
                                    isDisabled={false}
                                    alphabeticalSort={false}
                                    isClearable={false}
                                    onChange={(event)=>this.props.onFilterComboChange(event,"ntranscode")}
                                />
   </Col>
                </Row>
            </div>
        )
    }
}

export default injectIntl(CustomerComplaintFilter);