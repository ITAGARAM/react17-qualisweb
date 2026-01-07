import React, { Component } from 'react';
import { Nav } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormattedMessage, injectIntl } from 'react-intl';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import ListAttachment from '../../components/ListAttachment';
import { designProperties } from '../../components/Enumeration';


class ManufacturerFileTab extends Component {
    render() {
        const addFileId = this.props.controlMap.has("AddManufacturerFile") && this.props.controlMap.get("AddManufacturerFile").ncontrolcode;
        const editFileId = this.props.controlMap.has("EditManufacturerFile") && this.props.controlMap.get("EditManufacturerFile").ncontrolcode;
        const deleteFileId = this.props.controlMap.has("DeleteManufacturerFile") && this.props.controlMap.get("DeleteManufacturerFile").ncontrolcode;
        // const defaultFileId = this.props.controlMap.has("DefaultSupplierFile") && this.props.controlMap.get("DefaultSupplierFile").ncontrolcode;
        const viewFileId = this.props.controlMap.has("ViewManufacturerFile") && this.props.controlMap.get("ViewManufacturerFile").ncontrolcode;
        const editParam = {
            screenName: "IDS_MANUFACTURERFILE", operation: "update", inputParam: this.props.inputParam,     //ALPD-898 Fix
            userInfo: this.props.userInfo, ncontrolCode: editFileId, modalName: "openChildModal"
        };
        //  const defaultParam = {operation:"Default", methodUrl: "TestFile", userInfo: this.props.userInfo, ncontrolCode:defaultFileId};
        const subFields = [
            // {[designProperties.VALUE]:"stransdisplaystatus"}, 
            // { [designProperties.LABEL]: "IDS_DEFAULTSTATUS", [designProperties.VALUE]: "stransdisplaystatus" }
            //{[designProperties.VALUE]:"screateddate"}, 
            //{[designProperties.VALUE]:"sfilesize","fieldType":"size"}
        ];
        const moreField = [
            { [designProperties.LABEL]: "IDS_LINK", [designProperties.VALUE]: "slinkname" },
            { [designProperties.LABEL]: "IDS_CREATEDDATE", [designProperties.VALUE]: "screateddate" },
            { [designProperties.LABEL]: "IDS_DESCRIPTION", [designProperties.VALUE]: "sdescription" },
            //{[designProperties.VALUE]:"sfilesize","fieldType":"size"}
        ];
        return (
            <>
                <div className="actions-stripe border-bottom">
                    <div className="d-flex justify-content-end">
                        <Nav.Link name="addmanufacturerfile" className="add-txt-btn" hidden={this.props.userRoleControlRights.indexOf(addFileId) === -1}    //ALPD-898 Fix
                            onClick={() => this.props.addManufacturerFile({ userInfo: this.props.userInfo, operation: "create", ncontrolCode: addFileId, screenName: "IDS_MANUFACTURERFILE", modalName: "openChildModal" })}>
                            <FontAwesomeIcon icon={faPlus} /> {" "}
                            <FormattedMessage id="IDS_ADDFILE" defaultMessage="File" />
                        </Nav.Link>
                    </div>
                </div>
                <ListAttachment
                    attachmentList={this.props.manufacturerFile}
                    fileName="sfilename"
                    // filesize="nfilesize"
                    // linkname="slinkname"
                    // defaultStatusName="stransdisplaystatus"
                    deleteRecord={this.props.deleteRecord}
                    deleteParam={{ operation: "delete", methodUrl: "ManufacturerFile" }}
                    editParam={editParam}
                    // defaultParam={defaultParam}
                    fetchRecord={this.props.addManufacturerFile}
                    //defaultRecord={this.props.defaultRecord}
                    deleteId={deleteFileId}
                    editId={editFileId}
                    //defaultId={defaultFileId}
                    viewId={viewFileId}
                    userRoleControlRights={this.props.userRoleControlRights}
                    viewFile={this.props.viewManufacturerFile}
                    subFields={subFields}
                    moreField={moreField}
                    settings={this.props.settings}
                    userInfo={this.props.userInfo}
                />
            </>
        );
    }
}

export default injectIntl(ManufacturerFileTab);