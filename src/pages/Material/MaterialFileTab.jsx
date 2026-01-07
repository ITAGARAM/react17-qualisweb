import React, { Component } from 'react';
import { Nav } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormattedMessage, injectIntl } from 'react-intl';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { designProperties } from '../../components/Enumeration';
import ListAttachment from '../../components/ListAttachment';

class MaterialFileTab extends Component {

    render() {
        const addFileId = this.props.controlMap.has("AddMaterialFile") && this.props.controlMap.get("AddMaterialFile").ncontrolcode;
        const editFileId = this.props.controlMap.has("EditMaterialFile") && this.props.controlMap.get("EditMaterialFile").ncontrolcode;
        const deleteFileId = this.props.controlMap.has("DeleteMaterialFile") && this.props.controlMap.get("DeleteMaterialFile").ncontrolcode;
        const viewFileId = this.props.controlMap.has("ViewMaterialFile") && this.props.controlMap.get("ViewMaterialFile").ncontrolcode;

        const editParam = {
            screenName: "IDS_MATERIALFILE", operation: "update", inputParam: this.props.inputParam,
            userInfo: this.props.userInfo, ncontrolCode: editFileId, modalName: "openChildModal"
        };
        const subFields = [
            { [designProperties.VALUE]: "stransdisplaystatus" },
        ];
        const moreField = [{ [designProperties.LABEL]: "IDS_LINK", [designProperties.VALUE]: "slinkname" },
        { [designProperties.LABEL]: "IDS_CREATEDDATE", [designProperties.VALUE]: "dcreateddate" },
        { [designProperties.LABEL]: "IDS_DESCRIPTION", [designProperties.VALUE]: "sdescription" },
        ];
        return (
            <>
                <div className="actions-stripe border-bottom">
                    <div className="d-flex justify-content-end">
                        <Nav.Link name="AddMaterialFile" className="add-txt-btn" hidden={this.props.userRoleControlRights.indexOf(addFileId) === -1}
                            onClick={() => this.props.addMaterialFile({
                                userInfo: this.props.userInfo,
                                operation: "create", ncontrolCode: addFileId, screenName: "IDS_MATERIALFILE",
                                modalName: "openChildModal"
                            })}>
                            <FontAwesomeIcon icon={faPlus} /> {" "}
                            <FormattedMessage id="IDS_ADDFILE" defaultMessage="File" />
                        </Nav.Link>
                    </div>
                </div>
                <ListAttachment
                    attachmentList={this.props.MaterialFile}
                    fileName="sfilename"
                    jsonfield="jsondata"
                    isjsonfield={true}
                    deleteRecord={this.props.deleteRecord}
                    deleteParam={{ operation: "delete", methodUrl: "MaterialFile" }}
                    editParam={editParam}
                    fetchRecord={this.props.addMaterialFile}
                    deleteId={deleteFileId}
                    editId={editFileId}
                    viewId={viewFileId}
                    userRoleControlRights={this.props.userRoleControlRights}
                    viewFile={this.props.viewMaterialFile}
                    subFields={subFields}
                    moreField={moreField}
                    settings={this.props.settings}
                    userInfo={this.props.userInfo}
                />
            </>
        );
    }
}

export default injectIntl(MaterialFileTab);