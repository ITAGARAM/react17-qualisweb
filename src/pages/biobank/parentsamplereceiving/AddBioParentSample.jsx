import React from 'react'
import { Row, Col, Button } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import FormInput from '../../../components/form-input/form-input.component';
import FormSelectSearch from '../../../components/form-select-search/form-select-search.component';
import DateTimePicker from '../../../components/date-time-picker/date-time-picker.component';
import { ReactComponent as Circlecheck } from '../../../assets/image/circle-check-regular.svg';
import { ReactComponent as Circlecheckgreen } from '../../../assets/image/circle-check-regular-green.svg'
import { transactionStatus } from '../../../components/Enumeration';

const AddBioParentSample = (props) => {
    const { selectedRecord, intl } = props;

    return (
        <>
            <Row>
                {/* -------- Left Column -------- */}
                <Col md={6}>
                    {/* 1. Subject ID + Validate Button */}
                    <Row className="align-items-end">
                        <Col xs={8}>
                            <FormInput
                                label={intl.formatMessage({ id: "IDS_SUBJECTID" })}
                                name="ssubjectid"
                                value={selectedRecord["ssubjectid"] || ""}
                                onChange={(e) => props.operation !== 'update' ? props.onInputOnChange(e, "ssubjectid") : ''}
                                isMandatory={true}
                                maxLength={50}
                                readOnly={props.operation === 'update' ? true : false}
                            />
                            {
                                props.operation === 'create' &&

                                <Button
                                    variant=""
                                    onClick={props.onValidateSubjectId}
                                    className="mt-2 tick-circle"
                                    data-tooltip-id="my-tooltip" data-tooltip-content={props.intl.formatMessage({ id: "IDS_VALIDATESUBJECTID" })}
                                    data-place="right"
                                >
                                    {props.isValidated ?
                                        <Circlecheckgreen className="custom_icons" width="25" height="25" /> :
                                        <Circlecheck className="custom_icons" width="25" height="25" />
                                    }
                                    {/* {intl.formatMessage({ id: "IDS_VALIDATE" })} */}
                                </Button>
                            }
                        </Col>

                    </Row>

                    {/* 2. Case Type */}
                    <FormInput
                        label={intl.formatMessage({ id: "IDS_CASETYPE" })}
                        name="scasetype"
                        value={selectedRecord["scasetype"] || ""}
                        readOnly
                    />

                    {/* 3. Third Party Sharable - Added by Gowtham on nov 14 2025 for jira.id:BGSI-216*/}
                    <FormInput
                        label={intl.formatMessage({ id: "IDS_THIRDPARTYSHARABLE" })}
                        name="nisthirdpartysharable"
                        value={selectedRecord["nisthirdpartysharable"] ? selectedRecord["nisthirdpartysharable"]===3 ? intl.formatMessage({ id: "IDS_YES" }) : intl.formatMessage({ id: "IDS_NO" }) : ''}
                        readOnly
                    />

                    {/* 4. Sample Accesable - Added by Gowtham on nov 14 2025 for jira.id:BGSI-216*/}
                    <FormInput
                        label={intl.formatMessage({ id: "IDS_SAMPLEACCESABLE" })}
                        name="nissampleaccesable"
                        value={selectedRecord["nissampleaccesable"] ? selectedRecord["nissampleaccesable"]===3 ? intl.formatMessage({ id: "IDS_YES" }) : intl.formatMessage({ id: "IDS_NO" }) : ''}
                        readOnly
                    />

                    {/* 5. Disease */}
                    <FormSelectSearch
                        formLabel={intl.formatMessage({ id: "IDS_DISEASE" })}
                        name="ndiseasecode"
                        options={props.diseaseList}
                        value={selectedRecord["ndiseasecode"] || ""}
                        onChange={(e) => props.onComboChange(e, "ndiseasecode")}
                        isMandatory={true}
                        isDisabled={props.operation === 'update' ? true : false}
                    />

                    {/* 6. Bio-Project Title */}
                    <FormSelectSearch
                        formLabel={intl.formatMessage({ id: "IDS_BIOPROJECTTITLE" })}
                        name="nbioprojectcode"
                        options={props.bioprojectList}
                        optionId="nbioprojectcode"
                        optionValue="sprojecttitle"
                        value={selectedRecord["nbioprojectcode"] || ""}
                        onChange={(e) => props.onComboChange(e, "nbioprojectcode")}
                        isMandatory={true}
                        isDisabled={props.operation === 'update' ? true : false}
                    />

                    {/* 7. Bio-Project Code (read-only) */}
                    <FormInput
                        label={intl.formatMessage({ id: "IDS_BIOPROJECTCODE" })}
                        name="sprojectcode"
                        value={selectedRecord["nbioprojectcode"] && selectedRecord["nbioprojectcode"].item && selectedRecord["nbioprojectcode"].item.sprojectcode || ""}
                        readOnly
                    />

                    {/* 8. PI (read-only) */}
                    <FormInput
                        label={intl.formatMessage({ id: "IDS_PI" })}
                        name="sprincipalinvestigator"
                        value={selectedRecord["nbioprojectcode"] && selectedRecord["nbioprojectcode"].item && selectedRecord["nbioprojectcode"].item.suserName || ""}
                        readOnly
                    />
                </Col>

                {/* -------- Right Column -------- */}
                <Col md={6}>
                    {/* 9. Collection Site */}
                    <FormSelectSearch
                        formLabel={intl.formatMessage({ id: "IDS_COLLECTIONSITE" })}
                        name="ncollectionsitecode"
                        options={props.collectionsiteList}
                        value={selectedRecord["ncollectionsitecode"] || ""}
                        onChange={(e) => props.onComboChange(e, "ncollectionsitecode")}
                        isMandatory={true}
                    />

                    {/* 10. Collected Hospital */}
                    <FormSelectSearch
                        formLabel={intl.formatMessage({ id: "IDS_COLLECTEDHOSPITAL" })}
                        name="nhospitalcode"
                        options={props.collectedHospitalList}
                        value={selectedRecord["nhospitalcode"] || ""}
                        onChange={(e) => props.onComboChange(e, "nhospitalcode")}
                        isMandatory={true}
                    />

                    {/* 11. Arrival Date & Time */}
                    {/* 
                    <DateTimePicker
                        name="darrivaldatetime"
                        label={intl.formatMessage({ id: "IDS_ARRIVALDATETIME" })}
                        selected={selectedRecord["darrivaldatetime"] || null}
                        onChange={(date) => props.handleDateChange("darrivaldatetime", date)}
                        isMandatory={true}
                        className={'form-control'}
                    /> */}
                    {/* //Added by ATE-234 Janakumar BGSI-13 */}
                    <DateTimePicker
                        name={"darrivaldatetime"}
                        label={props.intl.formatMessage({ id: "IDS_ARRIVALDATETIME" })}
                        className='form-control'
                        placeholderText={props.intl.formatMessage({ id: "IDS_SELECTDATE" })}
                        dateFormat={props.userInfo.ssitedate}
                        timeInputLabel={props.intl.formatMessage({ id: "IDS_STARTDATEANDTIME" })}
                        showTimeInput={false} // modified by sujatha ATE_274 into false bgsi-218
                        timeFormat={false}  // modified by sujatha ATE_274 into false bgsi-218
                        isClearable={false}
                        isMandatory={true}
                        required={true}
                        minDate={props.currentTime}
                        minTime={props.currentTime}
                        onChange={(date) => props.handleDateChange("darrivaldatetime", date)}
                        selected={selectedRecord["darrivaldatetime"] ? selectedRecord["darrivaldatetime"] || null : new Date()}
                    />

                    {/* 12. Suggested Storage */}
                    <FormSelectSearch
                        formLabel={intl.formatMessage({ id: "IDS_SUGGESTEDSTORAGE" })}
                        name="nstoragelocationcode"
                        options={props.storagestructureList}
                        value={(selectedRecord["nstoragelocationcode"] && selectedRecord["nstoragelocationcode"].value) ? (selectedRecord["nstoragelocationcode"].value == -1) ? "" : selectedRecord["nstoragelocationcode"] : ""}
                        onChange={(e) => props.onComboChange(e, "nstoragelocationcode")}
                        isMandatory={false}
                        isClearable={true}
                    />

                    {/* 13. Storage Temperature (read-only) */}
                    <FormInput
                        label={intl.formatMessage({ id: "IDS_STORAGE_TEMPERATURE" })}
                        name="sstoragetemperature"
                        value={(selectedRecord["nstoragelocationcode"] && selectedRecord["nstoragelocationcode"].item && selectedRecord["nstoragelocationcode"].value) ? (selectedRecord["nstoragelocationcode"].value == -1) ? "" : selectedRecord["nstoragelocationcode"].item.sstoragetemperature : ""}
                        readOnly
                    />
                </Col>
            </Row>


        </>
    );
};

export default injectIntl(AddBioParentSample);
