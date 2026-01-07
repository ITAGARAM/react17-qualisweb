import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import DropzoneComponent from '../../components/dropzone/dropzone.component';

const ImportTemplate = (props) => {
    return (
        <Row>
            <Col md={12}>
            <DropzoneComponent
                    name = 'AttachmentFile'
                    label = {props.intl.formatMessage({id:"IDS_FILE"})}
                    isMandatory = {true}
                    maxFiles={1}
                    minSize={0}
                    maxSize={10}
                    onDrop={(event)=>props.onDrop(event,'stemplatefilename',1)}
                    deleteAttachment={props.deleteAttachment}
                    actionType={props.actionType}
                    fileNameLength={100}
                    multiple={1}
                    editFiles={props.selectedRecord?props.selectedRecord:{}}
                    attachmentTypeCode={props.editFiles && props.editFiles.nattachmenttypecode}
                    fileSizeName="nfilesize"
                    fileName="stemplatefilename"
                    accept={props.settings[97]}
                />
            </Col>

        </Row>
    );
};

export default injectIntl(ImportTemplate);