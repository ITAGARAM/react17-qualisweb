import React, { Component } from 'react';
import { Nav } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormattedMessage, injectIntl } from 'react-intl';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import ListAttachment from '../../../components/ListAttachment';
import { designProperties } from '../../../components/Enumeration';


class InstitutionFileTab extends Component {
    render() {
        const addFileId = this.props.controlMap.has("AddInstitutionFile") && this.props.controlMap.get("AddInstitutionFile").ncontrolcode;
        const editFileId = this.props.controlMap.has("EditInstitutionFile") && this.props.controlMap.get("EditInstitutionFile").ncontrolcode;
        const deleteFileId = this.props.controlMap.has("DeleteInstitutionFile") && this.props.controlMap.get("DeleteInstitutionFile").ncontrolcode;
        const viewFileId = this.props.controlMap.has("ViewInstitutionFile") && this.props.controlMap.get("ViewInstitutionFile").ncontrolcode;
        const editParam = {screenName:this.props.intl.formatMessage({id: "IDS_INSTITUTIONFILE"}), operation:"update", inputParam: this.props.inputParam, 
                    userInfo: this.props.userInfo, ncontrolCode:editFileId, modalName: "openChildModal"};
        const subFields=[
                     //   {[designProperties.LABEL]: "IDS_DESCRIPTION",[designProperties.VALUE]:"sfiledesc"}
                    ];
        const moreField=[
            { [designProperties.LABEL]: "IDS_LINK", [designProperties.VALUE]: "slinkname" },
            { [designProperties.LABEL]: "IDS_CREATEDDATE", [designProperties.VALUE]: "screateddate" },
            { [designProperties.LABEL]: "IDS_DESCRIPTION", [designProperties.VALUE]: "sfiledesc" }, 
                       
                    ];
        return (
            <>
                <div className="actions-stripe border-bottom">
                    <div className="d-flex justify-content-end">
                        <Nav.Link name="addinstitutionfile" className="add-txt-btn" hidden={this.props.userRoleControlRights.indexOf(addFileId) === -1}
                            onClick={()=>this.props.addInstitutionFile({userInfo: this.props.userInfo, operation: "create", ncontrolCode: addFileId, screenName:  this.props.intl.formatMessage({
                                id: "IDS_INSTITUTIONFILE"}), modalName: "openChildModal",openChildModal:"true"})}>
                            <FontAwesomeIcon icon={faPlus} /> {" "}
                            <FormattedMessage id="IDS_ADDFILE" defaultMessage="File" />
                        </Nav.Link>
                    </div>
                </div>
                <ListAttachment
                    attachmentList={this.props.InstitutionFile}
                    fileName="sfilename"
                    deleteRecord={this.props.deleteRecord}
                    deleteParam ={{operation:"delete", methodUrl: "InstitutionFile"}}
                    editParam={editParam}
                    fetchRecord={this.props.addInstitutionFile}
                    deleteId={deleteFileId}
                    editId={editFileId}
                    viewId={viewFileId}
                    userRoleControlRights={this.props.userRoleControlRights}
                    viewFile={this.props.viewInstitutionFile}
                    subFields={subFields}
                    moreField={moreField}
                    settings = {this.props.settings}
                    userInfo={this.props.userInfo}
                />
            </>
        );
    }
}

export default injectIntl(InstitutionFileTab);