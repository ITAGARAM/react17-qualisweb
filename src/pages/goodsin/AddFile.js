import React from 'react';
import { injectIntl } from 'react-intl';
import DropzoneComponent from '../../components/dropzone/dropzone.component';


const AddFile = (props) => {
    return (
        <DropzoneComponent
            name='AttachmentFile'
            label={props.intl.formatMessage({ id: "IDS_FILE" })}
            isMandatory={true}
            maxFiles={1}           
            accept={".xlsx, .xls"}
            minSize={0}
            maxSize={10}
            onDrop={(event)=>props.onDrop(event,'stemplatefilename',1)}
            editFiles={props.selectedRecord?props.selectedRecord:{}}
            multiple={1}
            fileSizeName="nfilesize"
            fileName="stemplatefilename"
            deleteAttachment={props.deleteAttachment}
            actionType={props.actionType}
            fileNameLength={100}
            attachmentTypeCode={props.editFiles && props.editFiles.nattachmenttypecode}


        />
    )
}
export default injectIntl(AddFile);