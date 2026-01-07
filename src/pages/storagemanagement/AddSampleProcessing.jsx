import React from 'react';
import { injectIntl } from 'react-intl';
import { Row, Col, Card, FormGroup, FormLabel } from 'react-bootstrap';
import FormInput from '../../components/form-input/form-input.component';
import DateTimePicker from '../../components/date-time-picker/date-time-picker.component';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import { transactionStatus } from '../../components/Enumeration';
import { ReadOnlyText } from '../../components/App.styles';
import FormTextarea from '../../components/form-textarea/form-textarea.component';

const AddSampleProcessing = (props) => {
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
                            value={props.masterData.selectedProjectType.label}
                            isMandatory={true}
                            required={true}
                            maxLength={50}

                        />

                    </Col>
                    <Col md={12}>
                        <FormSelectSearch
                            formLabel={props.intl.formatMessage({ id: "IDS_SAMPLETYPE" })}
                            isSearchable={true}
                            name={"nproductcode"}
                            isDisabled={props.operation == "update" ? true : false}
                            placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                            isMandatory={true}
                            isClearable={false}
                            options={props.sampletype}
                            value={props.selectedRecord["nproductcode"] || ""}
                            onChange={(event) => props.onComboChange(event, "nproductcode")}

                            closeMenuOnSelect={true}
                        >
                        </FormSelectSearch>
                    </Col>
                    <Col md={12}>
                        <FormSelectSearch
                            formLabel={props.intl.formatMessage({ id: "IDS_COLLECTIONTUBETYPENAME" })}
                            isSearchable={true}
                            name={"ncollectiontubetypecode"}
                            isDisabled={props.operation == "update" ? true : false}
                            placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                            isMandatory={true}
                            isClearable={false}
                            options={props.collectiontubetype}
                            value={props.selectedRecord["ncollectiontubetypecode"] || ""}
                            defaultValue={props.selectedRecord["ncollectiontubetypecode"]}
                            onChange={(event) => props.onComboChange(event, "ncollectiontubetypecode")}
                            closeMenuOnSelect={true}
                        >
                        </FormSelectSearch>
                    </Col>
                    <Col md={12}>
                        <FormSelectSearch
                            formLabel={props.intl.formatMessage({ id: "IDS_PROCESSTYPENAME" })}
                            isSearchable={true}
                            name={"nprocesstypecode"}
                            isDisabled={props.operation == "update" ? true : false}
                            placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                            isMandatory={true}
                            isClearable={false}
                            options={props.selectedRecord["processtype"]}
                            value={props.selectedRecord["ncollectiontubetypecode"] && props.selectedRecord["nprocesstypecode"] && props.selectedRecord["nprocesstypecode"] || ""}
                            onChange={(event) => props.onComboChange(event, "nprocesstypecode")}
                            closeMenuOnSelect={true}
                        >
                        </FormSelectSearch>
                    </Col>
                    <Col md={12}>
                        <FormInput
                            label={props.formatMessage({ id: "IDS_PROCESSDURATION" })}
                            name={"sprocessduration"}
                            type="text"
                            placeholder={props.formatMessage({ id: "IDS_PROCESSDURATION" })}
                            isDisabled={true}
                            value={props.selectedRecord["sprocessduration"]}
                            isMandatory={false}
                            required={false}
                            maxLength={20}

                        />
                    </Col>
                    <Col md={12}>
                        <FormInput
                            label={props.formatMessage({ id: "IDS_GRACEDURATION" })}
                            name={"sgraceduration"}
                            type="text"
                            placeholder={props.formatMessage({ id: "IDS_GRACEDURATION" })}
                            isDisabled={true}
                            value={props.selectedRecord["sgraceduration"]}
                            isMandatory={false}
                            required={false}
                            maxLength={20}

                        />
                    </Col>
                </Col>
                <Col md={6}>
                    <Col md={12}>
                        <FormInput
                            label={props.formatMessage({ id: "IDS_BARCODEID" })}
                            name={"sbarcodeid"}
                            type="text"
                            //onBlur={(event) => props.autoSaveGetData(event)}
                            onKeyUp={(event) => props.autoSaveGetDataProcessing(event, "sbarcodeid")}
                            placeholder={props.formatMessage({ id: "IDS_BARCODEID" })}
                            onChange={(event) => props.onInputOnChange(event)}
                            isDisabled={props.operation == "update" ? true : false}
                            value={props.selectedRecord["sbarcodeid"]}
                            isMandatory={true}
                            required={true}
                            maxLength={20}

                        />
                    </Col>

                    <Col md={props.userInfo.istimezoneshow === transactionStatus.YES ? 6 : 12}>
                        <DateTimePicker
                            name={"dprocessstartdate"}
                            label={props.intl.formatMessage({ id: "IDS_STARTDATEANDTIME" })}
                            className='form-control'
                            placeholderText={props.intl.formatMessage({ id: "IDS_SELECTDATE" })}
                            //dateFormat={props.userInfo["ssitedatetime"]}
                            dateFormat={props.userInfo.ssitedatetime}
                            timeInputLabel={props.intl.formatMessage({ id: "IDS_STARTDATEANDTIME" })}
                            showTimeInput={true}
                            timeFormat={true}
                            isClearable={false}
                            isMandatory={!props.masterData.sprocessstartdatesecondtime}
                            required={true}
                            // isDisabled={diableAllStatus === recordStatus}
                            //  minDate={props.currentTime}
                            //   minTime={props.currentTime}
                            onChange={date => props.handleDateChangeSlidout("dprocessstartdate", date)}
                            selected={props.selectedRecord ? props.selectedRecord["dprocessstartdate"] : new Date()} />
                    </Col>

                    <Col md={props.userInfo.istimezoneshow === transactionStatus.YES ? 12 : 12}>
                        <DateTimePicker
                            name={"dprocessenddate"}
                            label={props.intl.formatMessage({ id: "IDS_ENDDATEANDTIME" })}
                            className='form-control'
                            placeholderText={props.intl.formatMessage({ id: "IDS_SELECTDATE" })}
                            //dateFormat={props.userInfo["ssitedatetime"]}
                            dateFormat={props.userInfo.ssitedatetime}
                            timeInputLabel={props.intl.formatMessage({ id: "IDS_ENDDATEANDTIME" })}
                            showTimeInput={true}
                            timeFormat={true}
                            isClearable={!props.masterData.sprocessstartdatesecondtime}
                            isMandatory={props.masterData.sprocessstartdatesecondtime}
                            required={true}
                            //    minDate={props.currentTime}
                            //    minTime={props.currentTime}
                            onChange={date => props.handleDateChangeSlidout("dprocessenddate", date)}
                            selected={props.selectedRecord ? props.selectedRecord["dprocessenddate"] : new Date()} />
                    </Col>
                    <Col md={12}>
                        <FormTextarea
                            label={props.intl.formatMessage({ id: "IDS_COMMENTS" })}
                            name={"scomments"}
                            onChange={(event) => props.onInputOnChange(event)}
                            placeholder={props.intl.formatMessage({ id: "IDS_COMMENTS" })}
                            value={props.selectedRecord ? props.selectedRecord["scomments"] : ""}
                            rows="2"
                            //   isMandatory={props.masterData.iscommentsrequired?true:props.masterData.isdevaiationrequired?true:false}
                            // required={props.masterData.iscommentsrequired?true:props.masterData.isdevaiationrequired?true:false}
                            isMandatory={false}
                            required={false}

                            maxLength={"255"}
                        >
                        </FormTextarea>
                    </Col>

                    <Col md={12}>
                        <FormTextarea
                            label={props.intl.formatMessage({ id: "IDS_DEVIATIONCOMMENTS" })}
                            name={"sdeviationcomments"}
                            onChange={(event) => props.onInputOnChange(event)}
                            placeholder={props.intl.formatMessage({ id: "IDS_DEVIATIONCOMMENTS" })}
                            value={props.selectedRecord ? props.selectedRecord["sdeviationcomments"] : ""}
                            rows="2"
                            //    isMandatory={props.masterData.isdevaiationrequired}
                            //   required={props.masterData.isdevaiationrequired}
                            isMandatory={false}
                            required={false}

                            maxLength={"255"}
                        >
                        </FormTextarea>
                    </Col>


                </Col>



            </Row>
            <Row>
                {props.masterData.barcodedata && Object.entries(props.masterData.barcodedata).length !== 0 &&
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
                                        props.masterData.jsondataBarcodeFields && props.masterData.jsondataBarcodeFields.map(item => {
                                            return (
                                                props.masterData.barcodedata && Object.entries(props.masterData.barcodedata).map(([key, value]) => {
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
        </>

    )
}
export default injectIntl(AddSampleProcessing);
