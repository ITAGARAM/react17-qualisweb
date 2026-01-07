import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import DateTimePicker from '../../components/date-time-picker/date-time-picker.component';


const RetrievalCertificateFilter = (props) => {
  return (
    <Row>
            <Col md={12}>
                    <DateTimePicker
                                  name={"fromdate"}
                                  label={props.intl.formatMessage({ id: "IDS_FROM" })}
                                  className="form-control"
                                  placeholderText="Select date.."
                                  selected={props.selectedRecord["fromdate"] || props.fromDate?new Date(props.fromDate):new Date()}
                                  dateFormat={props.userInfo.ssitedate}            
                                  isClearable={false}
                                  onChange={(date) => props.handleDateChange("fromdate", date)}
                                  value={props.selectedRecord["fromdate"] ||props.fromDate?new Date(props.fromDate):new Date()}
                    />
            {/* </Col>
            <Col md={6}> */}
                    <DateTimePicker
                                    name={"todate"}
                                    label={props.intl.formatMessage({ id: "IDS_TO" })}
                                    className="form-control"
                                    placeholderText="Select date.."
                                    selected={props.selectedRecord["todate"] || props.toDate ? new Date(props.toDate) :new Date()}
                                    dateFormat={props.userInfo.ssitedate}
                                    isClearable={false}
                                    onChange={(date) => props.handleDateChange("todate", date)}              
                                    value={props.selectedRecord["todate"] || props.toDate ? new Date(props.toDate) :new Date()}
                    />          
        </Col>
  </Row>
);
};

export default injectIntl(RetrievalCertificateFilter);