import React, { Component } from 'react';
import { Nav } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormattedMessage, injectIntl } from 'react-intl';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import ListAttachment from '../../components/ListAttachment';

class CustomerComplaintFileTab extends Component {
    render() {
        const addFileId = this.props.controlMap.has("AddCustomerComplaintFile") && this.props.controlMap.get("AddCustomerComplaintFile").ncontrolcode;
        const editFileId = this.props.controlMap.has("EditCustomerComplaintFile") && this.props.controlMap.get("EditCustomerComplaintFile").ncontrolcode;
        const deleteFileId = this.props.controlMap.has("DeleteCustomerComplaintFile") && this.props.controlMap.get("DeleteCustomerComplaintFile").ncontrolcode;
        const viewFileId = this.props.controlMap.has("ViewCustomerComplaintFile") && this.props.controlMap.get("ViewCustomerComplaintFile").ncontrolcode;
        const editParam = {
            screenName: "IDS_CUSTOMERCOMPLAINTFILE", operation: "update", inputParam: this.props.inputParam,
            userInfo: this.props.userInfo, ncontrolcode: editFileId, modalName: "openChildModal", masterData: this.props.masterData
        };
        return (
            <>
                <div className="actions-stripe border-bottom">
                    <div className="d-flex justify-content-end">
                        <Nav.Link name="addsupplierfile" className="add-txt-btn" hidden={this.props.userRoleControlRights.indexOf(addFileId) === -1}
                            onClick={() => this.props.addCustomerComplaintFile({ userInfo: this.props.userInfo, operation: "create", ncontrolCode: addFileId, screenName: "IDS_CUSTOMERCOMPLAINTFILE", modalName: "openChildModal", masterData: this.props.masterData })}>
                            <FontAwesomeIcon icon={faPlus} /> {" "}
                            <FormattedMessage id="IDS_ADDFILE" defaultMessage="File" />
                        </Nav.Link>
                    </div>
                </div>
                <ListAttachment
                    attachmentList={this.props.customerComplaintFile}
                    fileName="sfilename"
                    filesize="nfilesize"
                    linkname="slinkname"
                    defaultStatusName="stransdisplaystatus"
                    deleteRecord={this.props.deleteRecord}
                    deleteParam={{ operation: "delete", methodUrl: "CustomerComplaintFile" }}
                    editParam={editParam}
                    fetchRecord={this.props.addCustomerComplaintFile}
                    deleteId={deleteFileId}
                    editId={editFileId}
                    viewId={viewFileId}
                    userRoleControlRights={this.props.userRoleControlRights}
                    viewFile={this.props.viewCustomerComplaintFile}
                    settings={this.props.settings}
                    userInfo={this.props.userInfo}
                    hidePaging={false}
                />
            </>
        );
    }
}

export default injectIntl(CustomerComplaintFileTab);