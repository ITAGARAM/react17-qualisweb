import React from 'react';
import { injectIntl } from 'react-intl';
import DropZone from '../../../components/dropzone/dropzone.component';
import { Row, Col, Form } from 'react-bootstrap';
import FormTextarea from '../../../components/form-textarea/form-textarea.component';
import FormInput from '../../../components/form-input/form-input.component';
import FormSelectSearch from '../../../components/form-select-search/form-select-search.component';
import { attachmentType, transactionStatus } from '../../../components/Enumeration';
import { MediaHeader } from '../../../components/App.styles';
import TestPopOver from '../../ResultEntryBySample/TestPopOver';
import CustomSwitch from '../../../components/custom-switch/custom-switch.component';

const AddAttachment = props => {
    const { nattachmenttypecode, disabled } = props.selectedRecord;
    // let nameString = props.operation === 'update'? props.selectedRecord && props.selectedRecord[props.displayName] && [props.selectedRecord[props.displayName]] : props.masterList ? props.masterList.map(obj=>obj[props.displayName]||obj[props.jsonField][props.displayName]) : []

    let nameString = [];
    if (props.operation === 'update') {
        if (props.selectedRecord && props.selectedRecord[props.displayName] && props.selectedRecord[props.displayName] !== "-") {
            nameString = [props.selectedRecord[props.displayName]];
        }
        else if (props.masterList) {
            nameString = props.masterList.map(obj => obj[props.displayName] || obj[props.jsonField][props.displayName]);
        }
    } else if (props.operation === 'create') {
        if (props.masterList) {
            nameString = props.masterList.map(obj => obj[props.displayName] || obj[props.jsonField][props.displayName]);
        }
    }

    let message = `${nameString.length} ${props.intl.formatMessage({ id: props.selectedListName || "IDS_TESTS" })} ${props.intl.formatMessage({ id: "IDS_SELECTED" })}`
    const sdescrption = nattachmenttypecode === attachmentType.LINK ? "slinkdescription" : "sdescription";
    //console.log("props in file:", props, nameString);

    return (
        <>
            <Row>
                {props.masterList && Object.values(props.masterList).length > 0 ?
                    <div>
                        <Row className="mb-4">
                            <Col md={12}>
                                <MediaHeader className={`labelfont`}>
                                    {nameString.length === 1 ?
                                        `${props.intl.formatMessage({ id: props.selectedListName || "IDS_TESTS" })}: ${nameString[0]}` :
                                        <TestPopOver stringList={nameString} message={message}></TestPopOver>

                                    }
                                </MediaHeader>
                            </Col>
                        </Row>
                    </div>
                    : ""}
            </Row>
            <Row>
                <Col md="12">
                    <Form.Group>
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
                            onChange={(event) => props.onInputOnChange(event, 1, attachmentType.LINK)}
                            checked={nattachmenttypecode === attachmentType.LINK ? true : false}
                            disabled={disabled}
                        >
                        </Form.Check>
                    </Form.Group>
                </Col>
                {props.selectedRecord && nattachmenttypecode === attachmentType.FTP &&

                    <Col md={12}>
                        <DropZone
                            name='AttachmentFile'
                            label={props.intl.formatMessage({ id: "IDS_FILE" })}
                            isMandatory={true}
                            maxFiles={props.maxFiles}
                            minSize={0}
                            maxSize={props.maxSize}
                            onDrop={(event) => props.onDrop(event, 'sfilename', props.maxFiles)}
                            deleteAttachment={props.deleteAttachment}
                            actionType={props.actionType}
                            fileNameLength={props.fileNameLength}
                            multiple={props.multiple !== undefined ? props.multiple : true}
                            editFiles={props.selectedRecord ? props.selectedRecord : {}}
                            attachmentTypeCode={props.editFiles && props.editFiles.nattachmenttypecode}
                            fileSizeName="nfilesize"
                            fileName="sfilename"
                            accept={props.settings[97]}
                        //disabled={disabled}
                        />
                    </Col>
                }
                {props.selectedRecord && nattachmenttypecode === attachmentType.LINK &&
                    <>
                        <Col md="12">
                            <FormInput
                                name={"slinkfilename"}
                                label={props.intl.formatMessage({ id: "IDS_FILENAME" })}
                                type="text"
                                onChange={(event) => props.onInputOnChange(event, 1)}
                                placeholder={props.intl.formatMessage({ id: "IDS_FILENAME" })}
                                value={props.selectedRecord ? props.selectedRecord["slinkfilename"] : ""}
                                isMandatory="*"
                                required={true}
                                maxLength={100}
                            />
                        </Col>
                        <Col md="12">
                            <FormSelectSearch
                                formLabel={props.intl.formatMessage({ id: "IDS_LINKNAME" })}
                                isSearchable={true}
                                name={"nlinkcode"}
                                isDisabled={false}
                                placeholder={props.intl.formatMessage({ id: "IDS_PLEASESELECT" })}
                                isMandatory={true}
                                showOption={true}
                                options={props.linkMaster || []}
                                optionId='nlinkcode'
                                optionValue='slinkname'
                                value={props.selectedRecord["nlinkcode"]}
                                onChange={value => props.onComboChange(value, "nlinkcode", 1)}
                                alphabeticalSort={true}
                            >
                            </FormSelectSearch>
                        </Col>
                    </>
                }
                {props.selectedRecord && nattachmenttypecode === attachmentType.FTP && props.isneedHeader ?

                    <Col md="12" className="mt-4">
                        <FormTextarea
                            name={"sheader"}
                            label={props.intl.formatMessage({ id: "IDS_HEADER" })}
                            onChange={(event) => props.onInputOnChange(event, 1)}
                            placeholder={props.intl.formatMessage({ id: "IDS_HEADER" })}
                            value={props.selectedRecord["sheader"] ? props.selectedRecord["sheader"] : ""}
                            rows="2"
                            required={false}
                            maxLength={255}
                        >
                        </FormTextarea>
                    </Col> : ""
                }

                <Col md="12" className="mt-4">
                    <FormTextarea
                        name={sdescrption}
                        label={props.intl.formatMessage({ id: "IDS_DESCRIPTION" })}
                        onChange={(event) => props.onInputOnChange(event, 1)}
                        placeholder={props.intl.formatMessage({ id: "IDS_DESCRIPTION" })}
                        value={props.selectedRecord[sdescrption] ? props.selectedRecord[sdescrption] : ""}
                        rows="2"
                        required={false}
                        maxLength={1000}
                    >
                    </FormTextarea>
                </Col>

                {props.selectedRecord && nattachmenttypecode === attachmentType.FTP && props.isneedReport ?
                    <Col md="12" className="mt-4">
                        <CustomSwitch
                            label={props.intl.formatMessage({ id: "IDS_INCULDEINREPORT" })}
                            type="switch"
                            name={"nneedreport"}
                            onChange={(event) => props.onInputOnChange(event, 1)}
                            defaultValue={false}
                            isMandatory={false}
                            required={true}
                            checked={props.selectedRecord ? props.selectedRecord.nneedreport == transactionStatus.YES ? true : false : false}
                        />
                    </Col>
                    : ""}
            </Row>
        </>
    );
};

export default injectIntl(AddAttachment);