import React from 'react';
import { injectIntl } from 'react-intl';
import { Row, Col, Card, FormGroup, FormLabel } from 'react-bootstrap';
import FormInput from '../../components/form-input/form-input.component';
import DateTimePicker from '../../components/date-time-picker/date-time-picker.component';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import { transactionStatus } from '../../components/Enumeration';
import { ReadOnlyText } from '../../components/App.styles';
import FormTextarea from '../../components/form-textarea/form-textarea.component';

const AddSampleCollection = (props) => {
    return (
        <>
            <Row>
                <Col md={6}>
                    <Row>
                        <Col md={12}>
                            <FormInput
                                label={props.formatMessage({ id: "IDS_BARCODEID" })}
                                name={"sbarcodeid"}
                                type="text"
                                //onBlur={(event) => props.autoSaveGetData(event)}
                                placeholder={props.formatMessage({ id: "IDS_BARCODEID" })}
                                onChange={(event) => props.onInputOnChange(event, "sbarcodeid")}
                                onKeyUp={(event) => props.barcodeEnter(event, "sbarcodeid")}
                                isDisabled={props.operation == "update" ? true : false}
                                value={props.selectedRecord["sbarcodeid"]}
                                isMandatory={true}
                                required={true}
                                maxLength={20}

                            />
                        </Col>

                        <Col md={props.userInfo.istimezoneshow === transactionStatus.YES ? 12 : 12}>
                            {/* <DateTimePicker
                            name={"dcollectiondate"}
                            label={props.intl.formatMessage({ id: "IDS_SAMPLERECEIVINGDATE" })}
                            className='form-control'
                            placeholderText={props.intl.formatMessage({ id: "IDS_SELECTDATE" })}
                            selected={props.selectedRecord["dcollectiondate"]}
                            //dateFormat={props.userInfo.ssitedate}
                            dateFormat={props.userInfo ? props.userInfo.ssitedate || [] : []}
                            timeInputLabel={props.intl.formatMessage({ id: "IDS_TIME" })}
                            showTimeInput={true}
                            timeFormat={true}
                            isMandatory={true}
                            required={true}
                            maxTime={props.currentTime}
                            //timeInputLabel={props.intl.formatMessage({ id: "IDS_STORAGEDATETIME" })}
                            isClearable={false}
                            // isDisabled={diableAllStatus === recordStatus}
                            minDate={props.currentTime}
                            minTime={props.currentTime}
                            onChange={date => props.handleDateChangeSlidout("dcollectiondate", date)} /> */}

                            <DateTimePicker
                                name={"dcollectiondate"}
                                label={props.intl.formatMessage({ id: "IDS_SAMPLERECEIVINGDATE" })}
                                className='form-control'
                                placeholderText={props.intl.formatMessage({ id: "IDS_SELECTDATE" })}
                                dateFormat={props.userInfo.ssitedatetime}
                                timeInputLabel={props.intl.formatMessage({ id: "IDS_STARTDATEANDTIME" })}
                                showTimeInput={true}
                                timeFormat={true}
                                isClearable={false}
                                isMandatory={true}
                                required={true}
                                minDate={props.currentTime}
                                minTime={props.currentTime}
                                onChange={date => props.handleDateChangeSlidout("dcollectiondate", date)}
                                selected={props.selectedRecord ? props.selectedRecord["dcollectiondate"] : new Date()} />

                        </Col>
                        <Col md={12}>
                            <FormTextarea
                                label={props.intl.formatMessage({ id: "IDS_COMMENTS" })}
                                name={"scomments"}
                                onChange={(event) => props.onInputOnChange(event, "scomments")}
                                placeholder={props.intl.formatMessage({ id: "IDS_COMMENTS" })}
                                value={props.selectedRecord ? props.selectedRecord["scomments"] : ""}
                                rows="2"
                                isMandatory={false}
                                required={false}
                                maxLength={"255"}
                            >
                            </FormTextarea>
                        </Col>
                    </Row>

                </Col>
            </Row>

            <Row>
                <Col md={12} className=' mb-2'>

                    {/*<Row>   //janakumar ALPD-4609  Storage Sample Receiving-->Can't able to submit the E-sign popup in Edit popup screen
                     {props.barcodenorecord === true &&
                        <div className=' mb-2'>
                            <Col md={12} >
                                <span style={{ display: "inline-block", marginTop: "10%" }} >
                                    <font size="5" face="verdana">
                                        {props.intl.formatMessage({ id: "IDS_BARCODENOTFOUND" })}
                                    </font>
                                </span>
                            </Col>
                        </div>}

                    </Row> && props.barcodenorecord === false   */}

                    {props.barcodedata && Object.entries(props.barcodedata).length !== 0 &&

                        <Card>
                            <Card.Header>
                                <span style={{ display: "inline-block", marginTop: "1%" }} >
                                    <h4>{props.intl.formatMessage({ id: "IDS_SAMPLEINFO" })}</h4>
                                </span>
                            </Card.Header>

                            <Card.Body>
                                <Row>
                                    {
                                        props.barcodeFields && props.barcodeFields.map(item => {
                                            return (
                                                props.barcodedata && Object.entries(props.barcodedata).map(([key, value]) => {
                                                    if (item.sfieldname === key) {
                                                        return (
                                                            <Col md={6} key={`specInfo_${key}`}>
                                                                <FormGroup>
                                                                    <FormLabel>
                                                                        {key}
                                                                    </FormLabel>
                                                                    <ReadOnlyText>{value}</ReadOnlyText>
                                                                </FormGroup>
                                                            </Col>
                                                        );
                                                    } else {
                                                        return null;
                                                    }
                                                })
                                            );
                                        })
                                    }

                                </Row>
                            </Card.Body>
                        </Card>
                    }
                </Col>
            </Row >
        </>
    )
}
export default injectIntl(AddSampleCollection);
