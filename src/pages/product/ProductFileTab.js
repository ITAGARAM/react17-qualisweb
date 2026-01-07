import React, { Component } from 'react';
import { Nav } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormattedMessage, injectIntl } from 'react-intl';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import ListAttachment from '../../components/ListAttachment';
import { designProperties } from '../../components/Enumeration';


class ProductFileTab extends Component {
    render() {
        const addFileId = this.props.controlMap.has("AddProductFile") && this.props.controlMap.get("AddProductFile").ncontrolcode;
        const editFileId = this.props.controlMap.has("EditProductFile") && this.props.controlMap.get("EditProductFile").ncontrolcode;
        const deleteFileId = this.props.controlMap.has("DeleteProductFile") && this.props.controlMap.get("DeleteProductFile").ncontrolcode;
        
        const viewFileId = this.props.controlMap.has("ViewProductFile") && this.props.controlMap.get("ViewProductFile").ncontrolcode;
        const editParam = {
            screenName: this.props.genericLabel["Product"]["jsondata"]["sdisplayname"][this.props.userInfo.slanguagetypecode].concat(" "+this.props.intl.formatMessage({id : "IDS_FILE"})), operation: "update", inputParam: this.props.inputParam,
            userInfo: this.props.userInfo, genericLabel:this.props.genericLabel, ncontrolCode: editFileId, modalName: "openChildModal"
        };
        
        const subFields = [
            // {[designProperties.VALUE]:"stransdisplaystatus"}, 
            { [designProperties.LABEL]: "IDS_DEFAULTSTATUS", [designProperties.VALUE]: "stransdisplaystatus" }
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
                        <Nav.Link name="addproductfile" className="add-txt-btn" hidden={this.props.userRoleControlRights.indexOf(addFileId) === -1}
                            onClick={() => this.props.addProductFile({ userInfo: this.props.userInfo,genericLabel:this.props.genericLabel,  operation: "create", ncontrolCode: addFileId, screenName: this.props.genericLabel["Product"]["jsondata"]["sdisplayname"][this.props.userInfo.slanguagetypecode].concat(" "+this.props.intl.formatMessage({id : "IDS_FILE"})), modalName: "openChildModal" })}>
                            <FontAwesomeIcon icon={faPlus} /> {" "}
                            <FormattedMessage id="IDS_ADDFILE" defaultMessage="File" />
                        </Nav.Link>
                    </div>
                </div>
                <ListAttachment
                    attachmentList={this.props.productFile}
                    fileName="sfilename"
                    // filesize="nfilesize"
                    // linkname="slinkname"
                    // defaultStatusName="stransdisplaystatus"
                    deleteRecord={this.props.deleteRecord}
                    deleteParam={{ operation: "delete", methodUrl: "ProductFile" }}
                    editParam={editParam}
                    // defaultParam={defaultParam}
                    fetchRecord={this.props.addProductFile}
                    //defaultRecord={this.props.defaultRecord}
                    deleteId={deleteFileId}
                    editId={editFileId}
                    //defaultId={defaultFileId}
                    viewId={viewFileId}
                    userRoleControlRights={this.props.userRoleControlRights}
                    viewFile={this.props.viewProductFile}
                    subFields={subFields}
                    moreField={moreField}
                    settings={this.props.settings}
                    userInfo={this.props.userInfo}
                    genericLabel={this.props.genericLabel} 
                />
            </>
        );
    }
}

export default injectIntl(ProductFileTab);