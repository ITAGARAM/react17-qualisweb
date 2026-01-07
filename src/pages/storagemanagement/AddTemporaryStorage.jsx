import React from 'react';
import { injectIntl } from 'react-intl';
import { Row, Col, Card, FormGroup, FormLabel } from 'react-bootstrap';
import FormInput from '../../components/form-input/form-input.component';
import DateTimePicker from '../../components/date-time-picker/date-time-picker.component';
import { transactionStatus } from '../../components/Enumeration';
import { ReadOnlyText } from '../../components/App.styles';
import FormTextarea from '../../components/form-textarea/form-textarea.component';

const AddTemporaryStorage = (props) => {
   
    return (
        <>
            <Row>
                <Col md={6}>
                    <Col md={12}>

                        <FormInput
                            label={props.formatMessage({ id: "IDS_PROJECTTYPE" })}
                            name={"nprojecttypecode"}
                            type="text"
                            placeholder={props.formatMessage({ id: "IDS_PROJECTTYPE" })}
                            onChange={(event) => props.onInputOnChange(event)}
                            isDisabled={true}
                            value={props.selectedProjectType.label}
                            isMandatory={true}
                            required={true}
                            maxLength={50}

                        />

                    </Col>
                    <Col md={12}>
                        <FormInput
                            label={props.formatMessage({ id: "IDS_BARCODEID" })}
                            name={"sbarcodeid"}
                            type="text"
                            //onBlur={(event) => props.autoSaveGetData(event)}
                            onKeyUp={(event) => props.autoSaveGetDataTempoaryStorage(event, "sbarcodeid")}
                            placeholder={props.formatMessage({ id: "IDS_BARCODEID" })}
                            onChange={(event) => props.onInputOnChange(event)}
                            isDisabled={props.operation === "update" ? true : false}
                            value={props.selectedRecord["sbarcodeid"]}
                            isMandatory={true}
                            required={true}
                            maxLength={20}

                        />
                    </Col>


                </Col>
                <Col md={6}>


                    <Col md={props.userInfo.istimezoneshow === transactionStatus.YES ? 12 : 12}>
                        <DateTimePicker
                            name={"dstoragedatetime"}
                            label={props.intl.formatMessage({ id: "IDS_STORAGEDATETIME" })}
                            className='form-control'
                            placeholderText={props.intl.formatMessage({ id: "IDS_SELECTDATE" })}
                            //dateFormat={props.userInfo["ssitedatetime"]}
                            dateFormat={props.userInfo.ssitedatetime}
                            timeInputLabel={props.intl.formatMessage({ id: "IDS_STORAGEDATETIME" })}
                            showTimeInput={true}
                            timeFormat={true}
                            isClearable={false}
                            isMandatory={true}
                            required={true}
                            // isDisabled={diableAllStatus === recordStatus}
                            minDate={props.currentTime}
                            minTime={props.currentTime}
                            onChange={date => props.handleDateChangeSlidout("dstoragedatetime", date)}
                            selected={props.selectedRecord ? props.selectedRecord["dstoragedatetime"] : new Date()} />
                    </Col>
                    <Col md={12}>
                        <FormTextarea
                            label={props.intl.formatMessage({ id: "IDS_COMMENTS" })}
                            name={"scomments"}
                            onChange={(event) => props.onInputOnChange(event)}
                            placeholder={props.intl.formatMessage({ id: "IDS_COMMENTS" })}
                            value={props.selectedRecord ? props.selectedRecord["scomments"] : ""}
                            rows="2"
                            isMandatory={false}
                            required={false}
                            maxLength={"255"}
                        >
                        </FormTextarea>
                    </Col>
                </Col>
                <Row>
                    {props.barcodedata && Object.entries(props.barcodedata).length !== 0 &&
                        <Col md={12} className=' mb-2'>
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
                        </Col>}
                </Row>

            </Row >
        </>


    )
}
export default injectIntl(AddTemporaryStorage);
