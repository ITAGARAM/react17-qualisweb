import React from "react";
import { Row, Col, FormGroup, FormLabel, Card } from "react-bootstrap";
import FormInput from "../../../components/form-input/form-input.component";
import FormSelectSearch from "../../../components/form-select-search/form-select-search.component";
import DateTimePicker from "../../../components/date-time-picker/date-time-picker.component";
import FormTextarea from "../../../components/form-textarea/form-textarea.component";
import { ReadOnlyText } from "../../../components/App.styles";
import "../../../assets/styles/login.css";

const AddParentSampleCollection = (props) => {
  let masterData = props.masterData;
  return (
    <>
      <Row className="mb-2" style={{ marginTop: "-20px", paddingBottom: "10px" }}>
        <Col md={12}>
          {/* chaged by sathish 11-aug-2025 the title theme */}
          <Card
            className="parent-info mb-2"
            style={{ boxShadow: "-1px 1px 8px #ccccccb0", borderColor: "rgb(0 0 0 / 0%)" }}
          >
            {/* <FormLabel  className="user-name d-block mb-1" style={{ marginLeft: "4%", marginTop: "5px" }} > */}
            <span className="user-name" style={{ marginLeft: "2%", marginTop: "5px" }}>
              {<h4>{props.formatMessage({ id: "IDS_PARENTSAMPLEINFO" })}</h4>}
            </span>
            {/* </FormLabel> */}
            {/* chaged by sathish 11-aug-2025 the title theme */}
            <Card.Body style={{ "margin-bottom": "-5%", "margin-top": "-5%", paddingLeft: "16px" }}>
              <Row>
                <Col md={4}>
                  <FormGroup>
                    <FormLabel>{props.formatMessage({ id: "IDS_PARENTSAMPLECODE" })}</FormLabel>
                    <ReadOnlyText>
                      {masterData.selectedBioParentSampleReceiving &&
                        masterData.selectedBioParentSampleReceiving["sparentsamplecode"]}
                    </ReadOnlyText>
                  </FormGroup>

                  <FormGroup>
                    <FormLabel>{props.formatMessage({ id: "IDS_RECEIVINGSITE" })}</FormLabel>
                    <ReadOnlyText>{props.userInfo.ssitename}</ReadOnlyText>
                  </FormGroup>
                </Col>
                <Col md={4}>
                  <FormGroup>
                    <FormLabel>{props.formatMessage({ id: "IDS_COHORTNUMBER" })}</FormLabel>
                    <ReadOnlyText>
                      {masterData.selectedBioParentSampleReceiving &&
                        masterData.selectedBioParentSampleReceiving["ncohortno"]}
                    </ReadOnlyText>
                  </FormGroup>
                  <FormGroup>
                    <FormLabel>{props.formatMessage({ id: "IDS_BIOPROJECTTITLE" })}</FormLabel>
                    <ReadOnlyText>
                      {masterData.selectedBioParentSampleReceiving &&
                        masterData.selectedBioParentSampleReceiving["sprojecttitle"]}
                    </ReadOnlyText>
                  </FormGroup>
                </Col>
                <Col md={4}>
                  <FormGroup>
                    <FormLabel>{props.formatMessage({ id: "IDS_COLLECTIONSITE" })}</FormLabel>
                    <ReadOnlyText>
                      {masterData.selectedBioParentSampleReceiving &&
                        masterData.selectedBioParentSampleReceiving["scollectionsitename"]}
                    </ReadOnlyText>
                  </FormGroup>
                  <FormGroup>
                    <FormLabel>{props.formatMessage({ id: "IDS_PI" })}</FormLabel>
                    <ReadOnlyText>
                      {masterData.selectedBioParentSampleReceiving &&
                        masterData.selectedBioParentSampleReceiving["sprojectincharge"]}
                    </ReadOnlyText>
                  </FormGroup>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* <Col md={12}>
                    <FormInput
                        label={props.formatMessage({ id: "IDS_PARENTSAMPLECODE" })}
                        name={"sparentsamplecode"}
                        type="text"
                        placeholder={props.formatMessage({ id: "IDS_PARENTSAMPLECODE" })}
                        value={masterData.selectedBioParentSampleReceiving && masterData.selectedBioParentSampleReceiving["sparentsamplecode"]}
                        isMandatory={true}
                        required={true}
                        maxLength={100}
                        readOnly={true}
                    />
                </Col> 
                <Col md={12}>
                    <FormInput
                        label={props.formatMessage({ id: "IDS_COHORTNUMBER" })}
                        name={"ncohortno"}
                        type="text"
                        placeholder={props.formatMessage({ id: "IDS_COHORTNUMBER" })}
                        value={masterData.selectedBioParentSampleReceiving && masterData.selectedBioParentSampleReceiving["scollectionsitename"]}
                        isMandatory={true}
                        required={true}
                        maxLength={100}
                        readOnly={true}
                    />
                </Col>
                <Col md={12}>
                    <FormInput
                        label={props.formatMessage({ id: "IDS_RESEARHCER" })}
                        name={"sprojectincharge"}
                        type="text"
                        placeholder={props.formatMessage({ id: "IDS_RESEARHCER" })}
                        value={masterData.selectedBioParentSampleReceiving && masterData.selectedBioParentSampleReceiving["sprojectincharge"]}
                        isMandatory={true}
                        required={true}
                        maxLength={100}
                        readOnly={true}
                    />
                </Col>
                <Col md={12}>
                    <FormInput
                        label={props.formatMessage({ id: "IDS_COLLECTIONSITE" })}
                        name={"scollectionsitename"}
                        type="text"
                        placeholder={props.formatMessage({ id: "IDS_COLLECTIONSITE" })}
                        value={masterData.selectedBioParentSampleReceiving && masterData.selectedBioParentSampleReceiving["scollectionsitename"]}
                        isMandatory={true}
                        required={true}
                        maxLength={100}
                        readOnly={true}
                    />
                </Col>
                <Col md={12}>
                    <FormInput
                        label={props.formatMessage({ id: "IDS_RECEIVINGSITE" })}
                        name={"sreceivingsitename"}
                        type="text"
                        placeholder={props.formatMessage({ id: "IDS_RECEIVINGSITE" })}
                        value={props.userInfo.ssitename}
                        isMandatory={true}
                        required={true}
                        maxLength={100}
                        readOnly={true}
                    />
                </Col> */}

      <Row style={{ paddingTop: "2%" }}>
        <Col md={6}>
          <Col md={12}>
            <FormSelectSearch
              formLabel={props.formatMessage({ id: "IDS_SAMPLETYPE" })}
              isSearchable={true}
              name={"nproductcatcode"}
              isDisabled={props.operation === "update" ? true : false} // Added condition by Gowtham on nov 14 2025 for jira.id:BGSI-216
              placeholder={props.formatMessage({ id: "IDS_SELECTRECORD" })}
              isMandatory={true}
              options={masterData.sampleTypeList || []}
              optionId="nproductcatcode"
              optionValue="sproductcatname"
              value={props.selectedChildRecord ? props.selectedChildRecord["nproductcatcode"] : ""}
              onChange={(event) => props.onComboChange(event, "nproductcatcode")}
              closeMenuOnSelect={true}
            />
          </Col>
          <Col md={12}>
            <FormInput
              label={props.formatMessage({ id: "IDS_NUMBEROFSAMPLES" })}
              name={"nnoofsamples"}
              type="text"
              onChange={(event) => props.onInputOnChange(event, "nnoofsamples")}
              placeholder={props.formatMessage({ id: "IDS_NUMBEROFSAMPLES" })}
              value={
                (props.selectedChildRecord &&
                  props.selectedChildRecord.nnoofsamples &&
                  props.selectedChildRecord["nnoofsamples"]) ||
                1
              }
              isMandatory={true}
              required={true}
              maxLength={2}
              readOnly={false}
              onFocus={props.onFocus}
              onBlur={(event) => {
                const value = event.target.value;
                if (value === "" || value === "0" || value === null || value === undefined) {
                  // Force value to 1
                  props.onInputOnChange(
                    {
                      target: { name: "nnoofsamples", value: 1 },
                    },
                    "nnoofsamples"
                  );
                }
              }}
            />
          </Col>
          <Col md={12}>
            <DateTimePicker
              name={"dsamplecollectiondate"}
              label={props.formatMessage({ id: "IDS_SAMPLECOLLECTIONDATEONLY" })}
              className="form-control"
              placeholderText="Select date.."
              selected={props.selectedChildRecord["dsamplecollectiondate"] || ""}
              dateFormat={props.userInfo.ssitedate}
              isClearable={false}
              onChange={(date) => props.handleDateChange("dsamplecollectiondate", date)}
              value={props.selectedChildRecord["dsamplecollectiondate"]}
              isMandatory={true}
            />
          </Col>
          <Col md={12}>
            {/* //Added by ATE-141 Sathish default date BGSI-13 */}
            <DateTimePicker
              name={"dbiobankarrivaldate"}
              label={props.formatMessage({ id: "IDS_ARRIVINGATBIOBANKDATE" })}
              className="form-control"
              placeholderText="Select date.."
              selected={
                props.selectedChildRecord["dbiobankarrivaldate"]
                  ? props.selectedChildRecord["dbiobankarrivaldate"] || null
                  : new Date()
              }
              dateFormat={props.userInfo.ssitedate}
              isClearable={false}
              onChange={(date) => props.handleDateChange("dbiobankarrivaldate", date)}
              //value={props.selectedChildRecord["dbiobankarrivaldate"] ? props.selectedChildRecord["dbiobankarrivaldate"] || null : new Date()}
              isMandatory={true}
            />
          </Col>
          <Col md={12}>
            <FormSelectSearch
              formLabel={props.formatMessage({ id: "IDS_RECIPIENTSNAME" })}
              isSearchable={true}
              name={"nrecipientusercode"}
              isDisabled={false}
              placeholder={props.formatMessage({ id: "IDS_SELECTRECORD" })}
              isMandatory={true}
              options={masterData.recipientsList || []}
              optionId="nrecipientusercode"
              optionValue="srecipientusername"
              value={props.selectedChildRecord ? props.selectedChildRecord["nrecipientusercode"] : ""}
              onChange={(event) => props.onComboChange(event, "nrecipientusercode")}
              closeMenuOnSelect={true}
            />
          </Col>
          {/* changed input data to storagecondition master by sathish -> 06-AUG-2025 */}
          <Col md={12}>
            <FormSelectSearch
              formLabel={props.formatMessage({ id: "IDS_TEMPERATUREDEG" })}
              isSearchable={true}
              name={"nstorageconditioncode"}
              isDisabled={false}
              placeholder={props.formatMessage({ id: "IDS_SELECTRECORD" })}
              isMandatory={true}
              options={masterData.storageConditionListDetails || []}
              optionId="nstorageconditioncode"
              optionValue="sstorageconditionname"
              value={props.selectedChildRecord ? props.selectedChildRecord["nstorageconditioncode"] : ""}
              onChange={(event) => props.onComboChange(event, "nstorageconditioncode")}
              closeMenuOnSelect={true}
            />
          </Col>
          {/* <Col md={12}>
                        <FormInput
                            label={props.formatMessage({ id: "IDS_TEMPERATUREDEG" })}
                            name={"ntemperature"}
                            type="text"
                            onChange={(event) => {
                                const value = event.target.value;
                                const regex = /^-?\d*$/;
                                if (regex.test(value) || value === "") {
                                    props.onInputOnChange(event, 'ntemperature');
                                }
                            }}
                            placeholder={props.formatMessage({ id: "IDS_TEMPERATUREDEG" })}
                            value={
                                (props.selectedChildRecord && props.selectedChildRecord.ntemperature !== undefined)
                                    ? props.selectedChildRecord["ntemperature"]
                                    : 0
                            }
                            isMandatory={false}
                            required={true}
                            maxLength={(props.selectedChildRecord &&
                                props.selectedChildRecord.ntemperature !== undefined &&
                                props.selectedChildRecord["ntemperature"].toString().startsWith("-"))
                                ? 4
                                : 3}
                            readOnly={false}
                            onFocus={props.onFocus}
                        />
                    </Col> */}
        </Col>
        <Col md={6}>
          <Col md={12}>
            <FormInput
              label={props.formatMessage({ id: "IDS_COLLECTORNAME" })}
              name={"scollectorname"}
              type="text"
              onChange={(event) => props.onInputOnChange(event, "scollectorname")}
              placeholder={props.formatMessage({ id: "IDS_COLLECTORNAME" })}
              value={props.selectedChildRecord && props.selectedChildRecord.scollectorname}
              isMandatory={false}
              required={true}
              maxLength={100}
              readOnly={false}
            />
          </Col>
          <Col md={12}>
            <DateTimePicker
              name={"dtemporarystoragedate"}
              label={props.formatMessage({ id: "IDS_TEMPORARYSTORAGEDATE" })}
              className="form-control"
              placeholderText="Select date.."
              selected={props.selectedChildRecord["dtemporarystoragedate"] || ""}
              dateFormat={props.userInfo.ssitedate}
              isClearable={false}
              onChange={(date) => props.handleDateChange("dtemporarystoragedate", date)}
              // value={props.selectedChildRecord["dtemporarystoragedate"] || ""}
              isMandatory={false}
            />
          </Col>
          <Col md={12}>
            <FormInput
              label={props.formatMessage({ id: "IDS_TEMPORARYSTORAGENAME" })}
              name={"stemporarystoragename"}
              type="text"
              onChange={(event) => props.onInputOnChange(event, "stemporarystoragename")}
              placeholder={props.formatMessage({ id: "IDS_TEMPORARYSTORAGENAME" })}
              value={props.selectedChildRecord && props.selectedChildRecord.stemporarystoragename}
              isMandatory={false}
              required={true}
              maxLength={100}
              readOnly={false}
            />
          </Col>
          <Col md={12}>
            <FormInput
              label={props.formatMessage({ id: "IDS_SENDERNAME" })}
              name={"ssendername"}
              type="text"
              onChange={(event) => props.onInputOnChange(event, "ssendername")}
              placeholder={props.formatMessage({ id: "IDS_SENDERNAME" })}
              value={props.selectedChildRecord && props.selectedChildRecord.ssendername}
              isMandatory={false}
              required={true}
              maxLength={100}
              readOnly={false}
            />
          </Col>
          <Col md={12}>
            <FormTextarea
              name={"sinformation"}
              label={props.formatMessage({ id: "IDS_INFORMATION" })}
              onChange={(event) => props.onInputOnChange(event, "sinformation")}
              placeholder={props.formatMessage({ id: "IDS_INFORMATION" })}
              value={props.selectedChildRecord && props.selectedChildRecord.sinformation}
              rows="2"
              required={false}
              maxLength={255}
            ></FormTextarea>
          </Col>
        </Col>
      </Row>
    </>
  );
};
export default AddParentSampleCollection;
