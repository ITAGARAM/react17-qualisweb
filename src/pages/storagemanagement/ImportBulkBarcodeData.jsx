import React from 'react';
import { injectIntl } from 'react-intl';
import DropZone from '../../components/dropzone/dropzone.component';
import { Row, Col } from 'react-bootstrap';
import FormTextarea from '../../components/form-textarea/form-textarea.component';
import FormInput from '../../components/form-input/form-input.component';

const ImportBulkBarcodeData = props => {

    return (
        <Row>
            <Col md="12">
                    <DropZone
                        name={"sfilename"}
                        label={props.intl.formatMessage({ id: "IDS_ADDFILE" })}
                        isMandatory={true}
                        maxFiles={"1"}
                        minSize={0}
                        maxSize={10}
                        accept={".xlsx, .xls"}
                        onDrop={(event) => props.onDropFile(event, "sfilename", "1")}
                        actionType={props.actionType}
                        deleteAttachment={props.deleteAttachment}
                        multiple={props.multiple}
                       editFiles={props.selectedRecord ? props.selectedRecord : {}}
                       attachmentTypeCode={props.editFiles && props.editFiles.nattachmenttypecode}
                        fileSizeName="nfilesize"
                        fileName="sfilename"
                    />
            </Col>
            <Col md={12}>
                        <FormInput
                            label={props.intl.formatMessage({ id: "IDS_FILENAME" })}
                            name={"simportfilename"}
                            type="text"
                            onChange={(event) => props.onInputOnChange(event)}
                            placeholder={props.intl.formatMessage({ id: "IDS_FILENAME" })}
                            value={props.selectedRecord ? props.selectedRecord["simportfilename"] : ""}
                            isMandatory={true}
                            required={true}
                            maxLength={"100"}
                        />
                    </Col>

                     <Col md={12}>
                        <FormTextarea
                            label={props.intl.formatMessage({ id: "IDS_DESCRIPTION" })}
                            name={"sdescription"}
                            onChange={(event) => props.onInputOnChange(event)}
                            placeholder={props.intl.formatMessage({ id: "IDS_DESCRIPTION" })}
                            value={props.selectedRecord ? props.selectedRecord["sdescription"] : ""}
                            rows="2"
                            isMandatory={false}
                            required={false}
                            maxLength={"255"}
                        >
                        </FormTextarea>
            </Col>
           
        </Row>
    );
};

export default injectIntl(ImportBulkBarcodeData);

