import React from 'react'
import { Row, Col } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import { transactionStatus, attachmentType, reportTypeEnum, REPORTTYPE, SampleType } from '../../../components/Enumeration';
import CustomSwitch from '../../../components/custom-switch/custom-switch.component';
import DropZone from '../../../components/dropzone/dropzone.component';
import FormTextarea from '../../../components/form-textarea/form-textarea.component';
import FormInput from '../../../components/form-input/form-input.component';
import FormSelectSearch from '../../../components/form-select-search/form-select-search.component';
import ReactSelectAddEdit from '../../../components/react-select-add-edit/react-select-add-edit-component'
import { Form } from 'react-bootstrap';




const AddReportMaster = (props) => {
        //console.log("propsiin reportmaster:", props.selectedRecord)
        const { sreportformatdetail, disabled } = props.selectedRecord;

        let isReportTypeDisabled = false;
        if (props.operation === "update") {
                isReportTypeDisabled = true;
        }
        else {
                if (props.filterReportType && props.filterReportType.nreporttypecode !== 0) {
                        isReportTypeDisabled = true;
                }
        }
        return (
                <Row>
                        <Col md={12}>
                                <FormSelectSearch
                                        name={"nreporttypecode"}
                                        formLabel={props.intl.formatMessage({ id: "IDS_REPORTTYPE" })}
                                        placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                        options={props.reportTypeList || []}
                                        value={props.selectedRecord["nreporttypecode"] || ""}
                                        isMandatory={true}
                                        isMulti={false}
                                        isClearable={false}
                                        isSearchable={true}
                                        //isDisabled={props.operation === "update"}
                                        isDisabled={isReportTypeDisabled}
                                        closeMenuOnSelect={true}
                                        onChange={(event) => props.onComboChange(event, "nreporttypecode")}
                                />
                                {props.selectedRecord["nreporttypecode"] &&
                                        props.selectedRecord["nreporttypecode"]['item'].isneedregtype === transactionStatus.YES ?
                                        <Row>
                                                <Col md={6}>
                                                        <FormSelectSearch
                                                                name={"nsampletypecode"}
                                                                formLabel={props.intl.formatMessage({ id: "IDS_SAMPLETYPE" })}
                                                                placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                                                options={props.sampleTypeList || []}
                                                                //options={ props.selectedRecord["nreporttypecode"]['item'].nreporttypecode === reportTypeEnum.SAMPLE?props.regType:props.regTypeList || []}
                                                                value={props.selectedRecord["nsampletypecode"] || ""}
                                                                isMandatory={true}
                                                                isMulti={false}
                                                                isClearable={false}
                                                                isSearchable={true}
                                                                isDisabled={props.operation === "update" && props.reportVersionStatus === transactionStatus.APPROVED}
                                                                closeMenuOnSelect={true}
                                                                onChange={(event) => props.onComboChange(event, "nsampletypecode")}
                                                        />

                                                </Col>

                                                <Col md={6}>
                                                        <FormSelectSearch
                                                                name={"nregtypecode"}
                                                                formLabel={props.intl.formatMessage({ id: "IDS_REGTYPE" })}
                                                                placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                                                options={props.regTypeList || []}
                                                                //options={ props.selectedRecord["nreporttypecode"]['item'].nreporttypecode === reportTypeEnum.SAMPLE?props.regType:props.regTypeList || []}
                                                                value={props.selectedRecord["nregtypecode"] || ""}
                                                                isMandatory={true}
                                                                isMulti={false}
                                                                isClearable={false}
                                                                isSearchable={true}
                                                                isDisabled={props.operation === "update" && props.reportVersionStatus === transactionStatus.APPROVED}
                                                                closeMenuOnSelect={true}
                                                                onChange={(event) => props.onComboChange(event, "nregtypecode")}
                                                        />

                                                </Col>

                                                <Col md={6}>

                                                        <FormSelectSearch
                                                                name={"nregsubtypecode"}
                                                                formLabel={props.intl.formatMessage({ id: "IDS_REGSUBTYPE" })}
                                                                placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                                                options={props.regSubTypeList || []}
                                                                value={props.selectedRecord["nregsubtypecode"] || ""}
                                                                isMandatory={true}
                                                                isMulti={false}
                                                                isClearable={false}
                                                                isSearchable={true}
                                                                isDisabled={props.operation === "update" && props.reportVersionStatus === transactionStatus.APPROVED}
                                                                closeMenuOnSelect={true}
                                                                onChange={(event) => props.onComboChange(event, "nregsubtypecode")}
                                                        />

                                                </Col>
                                                <Col md={6}>

                                                        <FormSelectSearch
                                                                name={"napproveconfversioncode"}
                                                                formLabel={props.intl.formatMessage({ id: "IDS_APPROVECONFIGVERSION" })}
                                                                placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                                                options={props.ApproveConfigList || []}
                                                                value={props.selectedRecord["napproveconfversioncode"] || ""}
                                                                isMandatory={true}
                                                                isMulti={false}
                                                                isClearable={false}
                                                                isSearchable={true}
                                                                isDisabled={props.operation === "update" && props.reportVersionStatus === transactionStatus.APPROVED}
                                                                closeMenuOnSelect={true}
                                                                onChange={(event) => props.onComboChange(event, "napproveconfversioncode")}
                                                        />
                                                </Col>
                                                <Col md={6}>
                                                        <FormSelectSearch
                                                                name={"ncoareporttypecode"}
                                                                formLabel={props.intl.formatMessage({ id: "IDS_REPORTSUBTYPE" })}
                                                                placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                                                options={props.coaReportTypeList || []}
                                                                value={props.selectedRecord["ncoareporttypecode"] || ""}
                                                                isMandatory={true}
                                                                isMulti={false}
                                                                isClearable={false}
                                                                isSearchable={true}
                                                                isDisabled={props.operation === "update" && props.reportVersionStatus === transactionStatus.APPROVED}
                                                                closeMenuOnSelect={true}
                                                                onChange={(event) => props.onComboChange(event, "ncoareporttypecode")}
                                                        />
                                                </Col>

                                                {/* <Col md={6}>
                                                <CustomSwitch
                                                name={"isneedsection"}
                                                type="switch"
                                                label={props.intl.formatMessage({ id: "IDS_NEEDSECTION" })}
                                                placeholder={props.intl.formatMessage({ id: "IDS_NEEDSECTION" })}
                                                value={(props.selectedRecord["isneedsection"] || props.selectedRecord["ncoareporttypecode"] &&
                                                props.selectedRecord["ncoareporttypecode"].item && props.selectedRecord["ncoareporttypecode"].item.isneedsection) === transactionStatus.YES ? true : false}
                                                isMandatory={false}
                                                required={false}
                                                checked={(props.selectedRecord["isneedsection"] || props.selectedRecord["ncoareporttypecode"] &&
                                                props.selectedRecord["ncoareporttypecode"].item && props.selectedRecord["ncoareporttypecode"].item.isneedsection) === transactionStatus.YES ? true : false}
                                                disabled={(props.selectedRecord["isneedsection"] || props.selectedRecord["ncoareporttypecode"] &&
                                                props.selectedRecord["ncoareporttypecode"].item && props.selectedRecord["ncoareporttypecode"].item.isneedsection) === transactionStatus.YES ? false : true}
                                                onChange={(event) => props.onInputOnChange(event)}
                                        />
                                                </Col> */}
                                                
                                                
                                               {/* ALPD-5271 Report Designer - Add Report not showing section field and save & Approve the report then click edit button section field showing. */} 
                                               {/* ATE234 Janakumar ALPD-5271 -> Report Designer - Add Report not showing section field and save & Approve the report then click edit button section field showing. */}
                                                {(props.selectedRecord["ncoareporttypecode"] && props.selectedRecord["ncoareporttypecode"].item !== undefined ? props.selectedRecord["ncoareporttypecode"].item.isneedsection === transactionStatus.YES : (props.selectedRecord["isneedsection"] && props.selectedRecord["isneedsection"]=== transactionStatus.YES)) ?
                                                        <Col md={6}>
                                                                <FormSelectSearch
                                                                        name={"nsectioncode"}
                                                                        formLabel={props.intl.formatMessage({ id: "IDS_SECTION" })}
                                                                        placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                                                        options={props.sectionList || []}
                                                                        value={props.selectedRecord["nsectioncode"] || ""}
                                                                        isMandatory={true}
                                                                        isMulti={false}
                                                                        isClearable={false}
                                                                        isSearchable={true}
                                                                        isDisabled={props.operation === "update" && props.reportVersionStatus === transactionStatus.APPROVED}
                                                                        closeMenuOnSelect={true}
                                                                        onChange={(event) => props.onComboChange(event, "nsectioncode")}
                                                                />

                                                        </Col> : ""}
                                        </Row>
                                        : ""}

                                {/* {props.selectedRecord["nreporttypecode"] && props.selectedRecord["nreporttypecode"].value === reportTypeEnum.COA
                                        && props.selectedRecord["ncoareporttypecode"] && props.selectedRecord["ncoareporttypecode"].value === reportCOAType.PROJECTWISE
                                        || props.selectedRecord["nreporttypecode"] && props.selectedRecord["nreporttypecode"].value === reportTypeEnum.COAPREVIEW
                                        && props.selectedRecord["ncoareporttypecode"] && props.selectedRecord["ncoareporttypecode"].value === reportCOAType.PROJECTWISE
                                        || props.selectedRecord["nreporttypecode"] && props.selectedRecord["nreporttypecode"].value === reportTypeEnum.COAPRELIMINARY
                                        && props.selectedRecord["ncoareporttypecode"] && props.selectedRecord["ncoareporttypecode"].value === reportCOAType.PROJECTWISE ? */}
                                { (props.selectedRecord["nreporttypecode"] && (props.selectedRecord["nreporttypecode"].value === reportTypeEnum.COA 
                                        || props.selectedRecord["nreporttypecode"].value === reportTypeEnum.COAPREVIEW 
                                        || props.selectedRecord["nreporttypecode"].value === reportTypeEnum.COAPRELIMINARY ))?
                                       // && props.selectedRecord["nsampletypecode"] && props.selectedRecord["nsampletypecode"].value !== SampleType.CLINICALTYPE ?
                                        <FormSelectSearch
                                                name={"nreporttemplatecode"}
                                                formLabel={props.intl.formatMessage({ id: "IDS_REPORTTEMPLATE" })}
                                                placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                                options={props.reportTemplateList || []}
                                                value={props.selectedRecord["nreporttemplatecode"] || ""}
                                                isMandatory={true}
                                                isMulti={false}
                                                isClearable={false}
                                                isSearchable={true}
                                                isDisabled={props.operation === "update" && props.reportVersionStatus === transactionStatus.APPROVED}
                                                closeMenuOnSelect={true}
                                                onChange={(event) => props.onComboChange(event, "nreporttemplatecode")}
                                        />
                                        : ""
                                }
                                        {/* : ""
                                } */}


                                {props.selectedRecord["nreporttypecode"] &&
                                        props.selectedRecord["nreporttypecode"].value === reportTypeEnum.SCREENWISE ?
                                        <><FormSelectSearch
                                                name={"nformcode"}
                                                formLabel={props.intl.formatMessage({ id: "IDS_SCREENNAME" })}
                                                placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                                options={props.controlScreen || []}
                                                value={props.selectedRecord["nformcode"] || ""}
                                                isMandatory={true}
                                                isMulti={false}
                                                isClearable={false}
                                                isSearchable={true}
                                                isDisabled={props.operation === "update" && props.reportVersionStatus === transactionStatus.APPROVED}
                                                closeMenuOnSelect={true}
                                                onChange={(event) => props.onComboChange(event, "nformcode")}
                                        />
                                                <FormSelectSearch
                                                        name={"ncontrolcode"}
                                                        formLabel={props.intl.formatMessage({ id: "IDS_CONTROLNAME" })}
                                                        placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                                        options={props.controlButton || []}
                                                        value={props.selectedRecord["ncontrolcode"] || ""}
                                                        isMandatory={true}
                                                        isMulti={false}
                                                        isClearable={false}
                                                        isSearchable={true}
                                                        isDisabled={props.operation === "update" && props.reportVersionStatus === transactionStatus.APPROVED}
                                                        closeMenuOnSelect={true}
                                                        onChange={(event) => props.onComboChange(event, "ncontrolcode")}
                                                />
                                        </>
                                        : ""}


                                {props.selectedRecord["nreporttypecode"] &&
                                        props.selectedRecord["nreporttypecode"].value === reportTypeEnum.MIS ?

                                        <ReactSelectAddEdit
                                                name="nreportmodulecode"
                                                label={props.intl.formatMessage({ id: "IDS_MODULENAME" })}
                                                className="color-select"
                                                classNamePrefix="react-select"
                                                optionId="nreportmodulecode"
                                                optionValue="sdisplayname"
                                                options={props.reportModuleList || []}
                                                isMandatory={true}
                                                getValue={value => props.onComboChange(value, "nreportmodulecode")}
                                                value={props.selectedRecord["nreportmodulecode"] ? props.selectedRecord["nreportmodulecode"] : ""}
                                        // defaultValue={props.selectedRecord? props.selectedRecord["sparametername"]:""}
                                        />
                                        : ""}

                                {props.selectedRecord["nreporttypecode"] &&
                                        (props.selectedRecord["nreporttypecode"].value === reportTypeEnum.BATCH
                                                || props.selectedRecord["nreporttypecode"].value === reportTypeEnum.SAMPLE) ?
                                        <Row>
                                                <Col md={6}>
                                                        <FormSelectSearch
                                                                name={"ncertificatetypecode"}
                                                                formLabel={props.intl.formatMessage({ id: "IDS_CERTIFICATETYPE" })}
                                                                placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                                                options={props.certificateTypeList || []}
                                                                value={props.selectedRecord["ncertificatetypecode"] || ""}
                                                                isMandatory={true}
                                                                isMulti={false}
                                                                isClearable={false}
                                                                isSearchable={true}
                                                                isDisabled={props.operation === "update" && props.reportVersionStatus === transactionStatus.APPROVED}
                                                                closeMenuOnSelect={true}
                                                                onChange={(event) => props.onComboChange(event, "ncertificatetypecode")}
                                                        />
                                                </Col>
                                                <Col md={6}>
                                                        <FormInput
                                                                label={props.intl.formatMessage({ id: "IDS_REPORTBATCHTYPE" })}
                                                                name={"sbatchdisplayname"}
                                                                type="text"
                                                                placeholder={props.intl.formatMessage({ id: "IDS_REPORTBATCHTYPE" })}
                                                                value={props.selectedRecord ? props.selectedRecord["sbatchdisplayname"] : ""}
                                                                isMandatory={false}
                                                                required={false}
                                                                readOnly={true}
                                                                onChange={(event) => props.onInputOnChange(event)}
                                                        />
                                                </Col>
                                        </Row>

                                        : ""}

                                <FormInput
                                        label={props.intl.formatMessage({ id: "IDS_REPORTNAME" })}
                                        name={"sreportname"}
                                        type="text"
                                        placeholder={props.intl.formatMessage({ id: "IDS_REPORTNAME" })}
                                        value={props.selectedRecord ? props.selectedRecord["sreportname"] : ""}
                                        isMandatory={true}
                                        required={true}
                                        maxLength={100}
                                        readOnly={props.operation === "update" && props.reportVersionStatus === transactionStatus.APPROVED}
                                        onChange={(event) => props.onInputOnChange(event)}
                                />

                                <FormTextarea
                                        name={"sdescription"}
                                        label={props.intl.formatMessage({ id: "IDS_DESCRIPTION" })}
                                        placeholder={props.intl.formatMessage({ id: "IDS_DESCRIPTION" })}
                                        value={props.selectedRecord["sdescription"] || ""}
                                        rows="2"
                                        isMandatory={false}
                                        required={false}
                                        maxLength={255}
                                        isDisabled={props.operation === "update" && props.reportVersionStatus === transactionStatus.APPROVED}
                                        onChange={(event) => props.onInputOnChange(event)}
                                />

                                {/* {props.selectedRecord["nreporttypecode"] &&
                                (props.selectedRecord["nreporttypecode"].value === REPORTTYPE.COAREPORT || 
                                props.operation !=='update'
                                //props.selectedRecord["nreporttypecode"].value === REPORTTYPE.CONTROLBASED ||
                                //props.selectedRecord["nreporttypecode"].value === REPORTTYPE.COAPREVIEW
                                ) ? */}

                                {props.selectedRecord["nreporttypecode"] &&
                                        (props.selectedRecord["nreporttypecode"].value === REPORTTYPE.CONTROLBASED && props.operation !== 'update'
                                                //||  props.selectedRecord["nreporttypecode"].value === REPORTTYPE.COAPREVIEW
                                        ) ?

                                        <Form.Group>

                                                <Form.Check
                                                        name="sreportformatdetail"
                                                        type="radio"
                                                        id="Addviewer"
                                                        label={props.intl.formatMessage({ id: "IDS_VIEWER" })}
                                                        inline={true}
                                                        value='viewer'
                                                        onChange={(event) => props.onInputOnChange(event)}
                                                        checked={sreportformatdetail === "viewer" ? true : false}
                                                        disabled={props.operation === "update" ? ' ' : disabled}
                                                >
                                                </Form.Check>

                                                {/* {props.selectedRecord["nreporttypecode"] &&
                                props.selectedRecord["nreporttypecode"].value !== REPORTTYPE.COAPREVIEW ? 
                                <> 
                                 {props.selectedRecord["nreporttypecode"] &&
                                (props.selectedRecord["nreporttypecode"].value === REPORTTYPE.CONTROLBASED 
                                || props.operation !=='update'
                                //||  props.selectedRecord["nreporttypecode"].value === REPORTTYPE.COAPREVIEW
                                ) ? <>  */}
                                                <Form.Check
                                                        name="sreportformatdetail"
                                                        type="radio"
                                                        id="AddPDF"
                                                        label={props.intl.formatMessage({ id: "IDS_PDF" })}
                                                        inline={true}
                                                        value='pdf'
                                                        defaultChecked
                                                        onChange={(event) => props.onInputOnChange(event)}
                                                        //checked={sreportformat === "pdf" ? true : false}
                                                        checked={sreportformatdetail === "pdf" ? true : sreportformatdetail === undefined ? true : false}
                                                        readOnly={props.operation === "update" ? true : false}
                                                        disabled={props.operation === "update" ? ' ' : disabled}
                                                >
                                                </Form.Check>

                                                <Form.Check
                                                        name="sreportformatdetail"
                                                        type="radio"
                                                        id="Addhtml"
                                                        label={props.intl.formatMessage({ id: "IDS_HTML" })}
                                                        inline={true}
                                                        value='html'
                                                        onChange={(event) => props.onInputOnChange(event)}
                                                        checked={sreportformatdetail === "html" ? true : false}
                                                        disabled={props.operation === "update" ? ' ' : disabled}
                                                >
                                                </Form.Check>

                                                <Form.Check
                                                        name="sreportformatdetail"
                                                        type="radio"
                                                        id="AddXLS"
                                                        label={props.intl.formatMessage({ id: "IDS_XLS" })}
                                                        inline={true}
                                                        value='xls'
                                                        onChange={(event) => props.onInputOnChange(event)}
                                                        checked={sreportformatdetail === "xls" ? true : false}
                                                        disabled={props.operation === "update" ? ' ' : disabled}
                                                >
                                                </Form.Check>

                                                <Form.Check
                                                        name="sreportformatdetail"
                                                        type="radio"
                                                        id="AddDOC"
                                                        label={props.intl.formatMessage({ id: "IDS_DOC" })}
                                                        inline={true}
                                                        value='doc'
                                                        onChange={(event) => props.onInputOnChange(event)}
                                                        checked={sreportformatdetail === "doc" ? true : false}
                                                        disabled={props.operation === "update" ? ' ' : disabled}
                                                >
                                                </Form.Check>

                                        </Form.Group>
                                        : ""}
                                        
                                        

                                {/* <Form.Group>
                    <Form.Check
                        name="nattachmenttypecode"
                        type="radio"
                        id="AddFiles"
                        label={props.intl.formatMessage({ id: "IDS_FTP" })}
                        inline={true}
                        onChange={(event) => props.onInputOnChange(event, 1, attachmentType.FTP)}
                        checked={nattachmenttypecode === attachmentType.FTP ? true : false}
                        disabled={disabled}
                    >
                    </Form.Check>
                    <Form.Check
                        name="nattachmenttypecode"
                        type="radio"
                        id="AddLink"
                        label={props.intl.formatMessage({ id: "IDS_LINK" })}
                        inline={true}
                        onChange={(event) => props.onInputOnChange(event,  attachmentType.LINK)}
                        checked={nattachmenttypecode === attachmentType.LINK ? true : false}
                        disabled={disabled}
                    >
                    </Form.Check>
                </Form.Group> */}




                                <CustomSwitch
                                        name={"ntransactionstatus"}
                                        type="switch"
                                        label={props.intl.formatMessage({ id: "IDS_ISACTIVE" })}
                                        placeholder={props.intl.formatMessage({ id: "IDS_ISACTIVE" })}
                                        value={props.selectedRecord["ntransactionstatus"] === transactionStatus.ACTIVE ? true : false}
                                        isMandatory={false}
                                        required={false}
                                        checked={props.selectedRecord["ntransactionstatus"] === transactionStatus.ACTIVE ? true : false}
                                        onChange={(event) => props.onInputOnChange(event)}
                                />
                                {props.operation === "create" ? <>

                                        <CustomSwitch
                                                name={"nisplsqlquery"}
                                                type="switch"
                                                label={props.intl.formatMessage({ id: "IDS_ISPLSQLQUERY" })}
                                                placeholder={props.intl.formatMessage({ id: "IDS_ISPLSQLQUERY" })}
                                                value={props.selectedRecord["nisplsqlquery"] === transactionStatus.YES ? true : false}
                                                isMandatory={false}
                                                required={false}
                                                checked={props.selectedRecord["nisplsqlquery"] === transactionStatus.YES ? true : false}
                                                onChange={(event) => props.onInputOnChange(event)}
                                        />

                                        {Object.keys(props.selectedRecord).length > 0 &&

                                                <DropZone
                                                        label={props.intl.formatMessage({ id: "IDS_FILE" })}
                                                        maxFiles={1}
                                                        accept=".jrxml,.mrt"
                                                        minSize={0}
                                                        maxSize={10}
                                                        fileNameLength={150}
                                                        onDrop={(event) => props.onDropImage(event, "sfilename", 1)}
                                                        multiple={false}
                                                        isMandatory={true}
                                                        editFiles={props.selectedRecord ? props.selectedRecord : {}}
                                                        attachmentTypeCode={props.operation === "update" ? attachmentType.OTHERS : ""}
                                                        fileName="sfilename"
                                                        deleteAttachment={() => props.deleteFile("sfilename")}
                                                        actionType={props.actionType}
                                                />

                                        }
                                </>
                                        : ""}
                        </Col>
                </Row>
        )
}

export default injectIntl(AddReportMaster);