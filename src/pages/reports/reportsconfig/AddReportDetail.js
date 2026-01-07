import React from 'react'
import { Row, Col, Form } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import { transactionStatus, attachmentType ,REPORTTYPE} from '../../../components/Enumeration';
import CustomSwitch from '../../../components/custom-switch/custom-switch.component';
import DropZone from '../../../components/dropzone/dropzone.component';

const AddReportDetail = (props) => {

        const { sreportformatdetail, disabled } = props.selectedRecord;
        return (
                <Row>
                        <Col md={12}>
                                {/* {props.reportMaster["nreporttypecode"] &&
                            props.reportMaster["nreporttypecode"] !== reportTypeEnum.MIS && props.reportMaster["nreporttypecode"] !== reportTypeEnum.SCREENWISE ? <>             
                                            
                            <FormSelectSearch
                                        name={"ncoareporttypecode"}
                                        formLabel={ props.intl.formatMessage({ id:"IDS_COAREPORTTYPE"})}                              
                                        placeholder={ props.intl.formatMessage({ id:"IDS_SELECTRECORD"})}                              
                                        options={ props.coaReportTypeList || []}
                                        optionId={"ncoareporttypecode"}
                                        optionValue={"scoareporttypename"}
                                        value = { props.selectedRecord ? props.selectedRecord["ncoareporttypecode"]:""}
                                        isMandatory={true}
                                        isMulti={false}
                                        isClearable={false}
                                        isSearchable={true}                                
                                        isDisabled={false}
                                        closeMenuOnSelect={true}
                                        alphabeticalSort={true}
                                        onChange = {(event)=> props.onComboChange(event, "ncoareporttypecode")}                               
                                />                             */}
                                {/* {props.reportMaster["nreporttypecode"] &&
                            props.reportMaster["nreporttypecode"] === reportTypeEnum.SAMPLE ?<>
                                <FormSelectSearch
                                        name={"nreportdecisiontypecode"}
                                        formLabel={ props.intl.formatMessage({ id:"IDS_DECISIONTYPE"})}                              
                                        placeholder={ props.intl.formatMessage({ id:"IDS_SELECTRECORD"})}                              
                                        options={ props.decisionTypeList || []}
                                        value = { props.selectedRecord ? props.selectedRecord["nreportdecisiontypecode"]:""}
                                        isMandatory={true}
                                        isMulti={false}
                                        isClearable={false}
                                        isSearchable={true}                                
                                        isDisabled={false}
                                        closeMenuOnSelect={true}
                                        onChange = {(event)=> props.onComboChange(event, "nreportdecisiontypecode")}                               
                                />   */}
                                {/* {props.reportMaster["nreporttypecode"] &&
                            props.reportMaster["nreporttypecode"].isneedsection === transactionStatus.YES ? 
                                <FormSelectSearch
                                        name={"nsectioncode"}
                                        formLabel={ props.intl.formatMessage({ id:"IDS_LAB"})}                              
                                        placeholder={ props.intl.formatMessage({ id:"IDS_SELECTRECORD"})}                               
                                        options={ props.sectionList || []}
                                        optionId={"nsectioncode"}
                                        optionValue={"ssectionname"}
                                        value = { props.selectedRecord ? props.selectedRecord["nsectioncode"]:""}
                                        isMandatory={false}
                                        isMulti={false}
                                        isClearable={true}
                                        isSearchable={true}                                
                                        isDisabled={false}
                                        closeMenuOnSelect={true}
                                        alphabeticalSort={true}
                                        onChange = {(event)=> props.onComboChange(event, "nsectioncode")}                               
                                />  
                                : ""}  */}
                                {/* </> 
                                 :""}      */}

                                {/* {props.reportMaster["nreporttypecode"] &&
                            props.reportMaster["nreporttypecode"] === reportTypeEnum.BATCH ? 
                            <><FormSelectSearch
                                                name={"ncertificatetypecode"}
                                                formLabel={ props.intl.formatMessage({ id:"IDS_CERTIFICATETYPE"})}                              
                                                placeholder={ props.intl.formatMessage({ id:"IDS_SELECTRECORD"})}                               
                                                options={ props.certificateTypeList || []}
                                                value = { props.selectedRecord ? props.selectedRecord["ncertificatetypecode"]:""}
                                                isMandatory={true}
                                                isMulti={false}
                                                isClearable={false}
                                                isSearchable={true}                                
                                                isDisabled={false}
                                                closeMenuOnSelect={true}
                                                onChange = {(event)=> props.onComboChange(event, "ncertificatetypecode")}                               
                                        /> 
                                <FormInput
                                        label={props.intl.formatMessage({ id:"IDS_REPORTBATCHTYPE"})}
                                        name={"sbatchdisplayname"}
                                        type="text"
                                        placeholder={props.intl.formatMessage({ id:"sbatchdisplayname"})}
                                        value ={props.selectedRecord ? props.selectedRecord["sbatchdisplayname"] : ""}
                                        isMandatory = {false}
                                        required={false}
                                        readOnly={true}
                                        onChange={(event)=> props.onInputOnChange(event)}
                                />  </>  
                                         :""}                   
                       
                       </>
                    :""} */}


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
                                 {props.reportMaster.nreporttypecode &&
                                        (props.reportMaster.nreporttypecode === REPORTTYPE.CONTROLBASED
                                                //||  props.selectedRecord["nreporttypecode"].value === REPORTTYPE.COAPREVIEW
                                        ) ?

                                <Col md={12}>

                                        <Form.Check
                                                name="sreportformatdetail"
                                                type="radio"
                                                id="Addviewer"
                                                label={props.intl.formatMessage({ id: "IDS_VIEWER" })}
                                                inline={true}
                                                value='viewer'
                                                onChange={(event) => props.onInputOnChange(event)}
                                                checked={sreportformatdetail === "viewer" ? true : false}
                                                //disabled={props.operation == "update" ? ' ' : disabled}
                                                disabled={disabled}
                                        >
                                        </Form.Check>


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
                                                disabled={disabled}
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
                                                disabled={disabled}
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
                                                disabled={disabled}
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
                                                disabled={disabled}
                                        >
                                        </Form.Check>

                                </Col>
                                : ""}

                                <></>
                                {Object.keys(props.selectedRecord).length > 0 &&
                                        <DropZone
                                                label={props.intl.formatMessage({ id: "IDS_FILE" })}
                                                maxFiles={1}
                                                accept=".jrxml,.mrt"
                                                minSize={0}
                                                maxSize={10}
                                                fileNameLength={150}
                                                onDrop={(event) => props.onDropImage(event, "sfilename")}
                                                multiple={false}
                                                isMandatory={true}
                                                editFiles={props.selectedRecord ? props.selectedRecord : {}}
                                                attachmentTypeCode={props.operation === "update" ? attachmentType.OTHERS : ""}
                                                fileName="sfilename"
                                                deleteAttachment={() => props.deleteFile("sfilename")}
                                                actionType={props.actionType}
                                        />

                                }
                        </Col>


                </Row>
        )
}

export default injectIntl(AddReportDetail);