import React, { Component } from 'react';
import { Nav } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormattedMessage, injectIntl } from 'react-intl';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import ListAttachment from '../../components/ListAttachment';
import { designProperties } from '../../components/Enumeration';


class InstrumentValidationFile extends Component {
    render() {
        const addFileId = this.props.controlMap.has("AddInstrumentValidationFile") && this.props.controlMap.get("AddInstrumentValidationFile").ncontrolcode;
        const editFileId = this.props.controlMap.has("EditInstrumentValidationFile") && this.props.controlMap.get("EditInstrumentValidationFile").ncontrolcode;
        const deleteFileId = this.props.controlMap.has("DeleteInstrumentValidationFile") && this.props.controlMap.get("DeleteInstrumentValidationFile").ncontrolcode;
        const viewFileId = this.props.controlMap.has("ViewInstrumentValidationFile") && this.props.controlMap.get("ViewInstrumentValidationFile").ncontrolcode;

       const editParam = {screenName:"IDS_INSTRUMENTVALIDATIONFILE", operation:"update", inputParam: this.props.inputParam, 
       userInfo: this.props.userInfo, ncontrolCode:editFileId, modalName: "openChildModal"};
    
        const subFields=[
            {[designProperties.LABEL]: "IDS_FILESIZE",[designProperties.VALUE]:"sfilesize","fieldType":"size"},];

        const moreField=[
            {[designProperties.LABEL]: "IDS_LINK",[designProperties.VALUE]:"slinkname"}, 
            {[designProperties.LABEL]: "IDS_CREATEDDATE",[designProperties.VALUE]:"screateddate"}, 
            {[designProperties.LABEL]: "IDS_DESCRIPTION",[designProperties.VALUE]:"sfiledesc"}
            // {[designProperties.LABEL]: "IDS_DESCRIPTION",[designProperties.VALUE]:"sfiledesc"},
            //{[designProperties.VALUE]:"sfilesize","fieldType":"size"}
        ];

        return (
            <>
                       
                <div className="actions-stripe border-bottom">
                    <div className="d-flex justify-content-end">

                        <Nav.Link name="addinstrumentvalidationfile" className="add-txt-btn" hidden={this.props.userRoleControlRights.indexOf(addFileId) === -1}
                      
                      onClick={()=>this.props.addfilecllick( {ncontrolCode: addFileId, screenName: "IDS_INSTRUMENTVALIDATIONFILE"})}>
                            <FontAwesomeIcon icon={faPlus} /> {" "}
                            <FormattedMessage id="IDS_ADDINSTRUMENTVALIDATIONFILE" defaultMessage="File" />
                        </Nav.Link>
                    </div>
                </div>
            <ListAttachment
                      attachmentList={this.props.FileData&&this.props.FileData}
                      fileName="sfilename"
                      viewId={viewFileId}
                      viewFile={this.props.viewInstrumentFile}
                      editParam={editParam}
                      editId={editFileId}
                      fetchRecord={this.props.addInstrumentFile}
                      userRoleControlRights={this.props.userRoleControlRights}
                      deleteId={deleteFileId}
                      deleteRecord={this.props.deleteTabFileRecord}
                      deleteParam ={{operation:"delete",screenName:"IDS_INSTRUMENTVALIDATIONFILE"}}
                      subFields={subFields}
                      userInfo={this.props.userInfo}
                      moreField={moreField}
                />  
            </>
        );
    }
}

export default injectIntl(InstrumentValidationFile);