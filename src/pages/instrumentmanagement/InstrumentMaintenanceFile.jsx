import React, { Component } from 'react';
import { Nav } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormattedMessage, injectIntl } from 'react-intl';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import ListAttachment from '../../components/ListAttachment';
import { designProperties } from '../../components/Enumeration';

class InstrumentMaintenanceFile extends Component {
    render() {
        const addFileId = this.props.controlMap.has("AddInstrumentMaintenanceFile") && this.props.controlMap.get("AddInstrumentMaintenanceFile").ncontrolcode;
        const editFileId = this.props.controlMap.has("EditInstrumentMaintenanceFile") && this.props.controlMap.get("EditInstrumentMaintenanceFile").ncontrolcode;
        const deleteFileId = this.props.controlMap.has("DeleteInstrumentMaintenanceFile") && this.props.controlMap.get("DeleteInstrumentMaintenanceFile").ncontrolcode;
        const viewFileId = this.props.controlMap.has("ViewInstrumentMaintenanceFile") && this.props.controlMap.get("ViewInstrumentMaintenanceFile").ncontrolcode;
       const editParam = {screenName:"IDS_INSTRUMENTMAINTENANCEFILE", operation:"update", inputParam: this.props.inputParam, 
       userInfo: this.props.userInfo, ncontrolCode:editFileId, modalName: "openChildModal"};
    
        const subFields=[
            {[designProperties.LABEL]: "IDS_FILESIZE",[designProperties.VALUE]:"sfilesize","fieldType":"size"},];

        const moreField=[
            {[designProperties.LABEL]: "IDS_LINK",[designProperties.VALUE]:"slinkname"}, 
            {[designProperties.LABEL]: "IDS_CREATEDDATE",[designProperties.VALUE]:"screateddate"}, 
            {[designProperties.LABEL]: "IDS_DESCRIPTION",[designProperties.VALUE]:"sfiledesc"}
            //{[designProperties.VALUE]:"sfilesize","fieldType":"size"}
        ];

        return (
            <>
                       
                <div className="actions-stripe border-bottom">
                    <div className="d-flex justify-content-end">

                        <Nav.Link name="addinstrumentmaintenancefile" className="add-txt-btn" hidden={this.props.userRoleControlRights.indexOf(addFileId) === -1}
                      
                      onClick={()=>this.props.addfilecllick( {ncontrolCode: addFileId, screenName: "IDS_INSTRUMENTMAINTENANCEFILE"})}>
                            <FontAwesomeIcon icon={faPlus} /> {" "}
                            <FormattedMessage id="IDS_ADDINSTRUMENTMAINTENANCEFILE" defaultMessage="File" />
                        </Nav.Link>
                    </div>
                </div>
             <ListAttachment
                      attachmentList={this.props.FileData&&this.props.FileData}
                      fileName="sfilename"
                      viewId={viewFileId}
                      editParam={editParam}
                      editId={editFileId}
                      fetchRecord={this.props.addInstrumentFile}
                      viewFile={this.props.viewInstrumentFile}
                      userRoleControlRights={this.props.userRoleControlRights}
                      deleteId={deleteFileId}
                      deleteRecord={this.props.deleteTabFileRecord}
                      deleteParam ={{operation:"delete",screenName:"IDS_INSTRUMENTMAINTENANCEFILE"}}
                      subFields={subFields}
                      userInfo={this.props.userInfo}
                      moreField={moreField}
                />   
            </>
        );
    }
}

export default injectIntl(InstrumentMaintenanceFile);