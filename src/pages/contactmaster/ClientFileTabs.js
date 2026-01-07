import React, { Component } from 'react';
import { Nav } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormattedMessage, injectIntl } from 'react-intl';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import ListAttachment from '../../components/ListAttachment';
import { designProperties } from '../../components/Enumeration';
import {  showEsign ,} from '../../components/CommonScript';
import { DEFAULT_RETURN } from '../../actions/LoginTypes';
import { intl } from '../../components/App';


class ClientFileTab extends Component {
    render() {
        const addFileId = this.props.controlMap.has("AddClientFile") && this.props.controlMap.get("AddClientFile").ncontrolcode;
        const editFileId = this.props.controlMap.has("EditClientFile") && this.props.controlMap.get("EditClientFile").ncontrolcode;
        const deleteFileId = this.props.controlMap.has("DeleteClientFile") && this.props.controlMap.get("DeleteClientFile").ncontrolcode;
        // const defaultFileId = this.props.controlMap.has("DefaultSupplierFile") && this.props.controlMap.get("DefaultSupplierFile").ncontrolcode;
        const viewFileId = this.props.controlMap.has("ViewClientFile") && this.props.controlMap.get("ViewClientFile").ncontrolcode;
        const editParam = {
            screenName: "IDS_CLIENTFILE", operation: "update", inputParam: this.props.inputParam,
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
                        <Nav.Link name="addclientfile" className="add-txt-btn" hidden={this.props.userRoleControlRights.indexOf(addFileId) === -1}
                            onClick={() => this.props.addClientFile({ userInfo: this.props.userInfo, operation: "create", ncontrolCode: addFileId, screenName: "IDS_CLIENTFILE", modalName: "openChildModal" })}>
                            <FontAwesomeIcon icon={faPlus} /> {" "}
                            <FormattedMessage id="IDS_ADDFILE" defaultMessage="File" />
                        </Nav.Link>
                    </div>
                </div>
                <ListAttachment
                    attachmentList={this.props.clientFile}
                    fileName="sfilename"
                    // filesize="nfilesize"
                    // linkname="slinkname"
                    // defaultStatusName="stransdisplaystatus"
                    deleteRecord={this.props.deleteRecord}
                    deleteParam={{ operation: "delete", methodUrl: "ClientFile"}}
                    editParam={editParam}
                    // defaultParam={defaultParam}
                    fetchRecord={this.props.addClientFile}
                    //defaultRecord={this.props.defaultRecord}
                    deleteId={deleteFileId}
                    editId={editFileId}
                    //defaultId={defaultFileId}
                    viewId={viewFileId}
                    userRoleControlRights={this.props.userRoleControlRights}
                    viewFile={this.props.viewClientFile}
                    subFields={subFields}
                    moreField={moreField}
                    settings={this.props.settings}
                    userInfo={this.props.userInfo}
                />
            </>
        );
    }
    DeleteContact = (deleteParam) => {
       
        deleteParam = {
            classUrl: "client",
            methodUrl: deleteParam.methodUrl,
            inputData: {
                [deleteParam.methodUrl]: deleteParam.selectedRecord,
                "userinfo": this.props.userInfo,

            },
            operation: deleteParam.operation,
           // dataState: this.state.dataState
    }

        if (showEsign(this.props.userRoleControlRights, this.props.userInfo.nformcode, deleteParam.ncontrolCode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { deleteParam, masterData: this.props.masterData },
                    openModal: true,
                    screenName: deleteParam.screenName, operation: deleteParam.operation
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.crudMaster(deleteParam, this.props.masterData, "openModal");
        }
    }
}

export default injectIntl(ClientFileTab);