import React, { Component } from 'react';
import { Nav } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormattedMessage, injectIntl } from 'react-intl';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import ListAttachment from '../../../components/ListAttachment';
import SlideOutModal from '../../../components/slide-out-modal/SlideOutModal';
import { DEFAULT_RETURN } from '../../../actions/LoginTypes';
import AddAttachment from './AddAttachment';
import {
    updateStore, getAttachmentCombo, validateEsignCredential, crudMaster, viewAttachment, deleteAttachment
} from '../../../actions'
import { connect } from 'react-redux';
import { attachmentType, designProperties, transactionStatus } from '../../../components/Enumeration';
import Esign from '../../audittrail/Esign';
import { QUALISFORMS } from '../../../components/Enumeration';
import { deleteAttachmentDropZone, onDropAttachFileList,  Lims_JSON_stringify } from '../../../components/CommonScript';

const mapStateToProps = state => {
    return ({ Login: state.Login })
}
class Attachments extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showMore: {},
            selectedRecord: {}
        }
    }

    render() {

        let subFields = this.props.subFields ? this.props.subFields : [
            ({
                [designProperties.LABEL]: `${this.props.Login.screenName === 'IDS_TESTATTACHMENTS' ? 'IDS_TESTNAME' :
                    this.props.Login.screenName === 'IDS_SUBSAMPLEATTACHMENTS'
                        ? this.props.Login.genericLabel ? this.props.Login.genericLabel["SubARNo"]["jsondata"]["sdisplayname"][this.props.Login.userInfo.slanguagetypecode]:"IDS_SAMPLEARNO" 
                        : this.props.Login.genericLabel ? this.props.Login.genericLabel["ARNo"]["jsondata"]["sdisplayname"][this.props.Login.userInfo.slanguagetypecode]:"IDS_ARNO"}`
            }),
            {
                [designProperties.VALUE]: `${this.props.screenName === 'IDS_SAMPLEATTACHMENTS'
                    ? this.props.Login.userInfo && this.props.Login.userInfo.nformcode === QUALISFORMS.SAMPLEREGISTRATION
                        ? "groupingField" : "sarno"
                    : this.props.Login.screenName === 'IDS_SUBSAMPLEATTACHMENTS'
                        ? this.props.Login.userInfo && this.props.Login.userInfo.nformcode === QUALISFORMS.SAMPLEREGISTRATION ?
                            "groupingField2" : "ssamplearno" :
                        "stestsynonym"}`
            },
            { [designProperties.VALUE]: "screateddate" },
            // { [designProperties.VALUE]: "nfilesize", "fieldType": "size" }
        ];
        let moreField = this.props.moreField ? this.props.moreField : [
            { [designProperties.LABEL]: "IDS_SCREENNAME", [designProperties.VALUE]: "sdisplayname" },
            { [designProperties.LABEL]: "IDS_USERNAME", [designProperties.VALUE]: "susername" },
            { [designProperties.LABEL]: "IDS_USERROLE", [designProperties.VALUE]: "suserrolename" },
            this.props.isneedHeader  ? this.props.isneedHeader &&
            { [designProperties.LABEL]: "IDS_HEADER", [designProperties.VALUE]: "sheader" } :"",
            { [designProperties.LABEL]: "IDS_DESCRIPTION", [designProperties.VALUE]: "sdescription" },
            this.props.isneedReport  ? this.props.isneedReport &&
            { [designProperties.LABEL]: "IDS_INCULDEINREPORT", [designProperties.VALUE]: "sneedreport" } :""
        ];
        if (this.props.screenName === 'IDS_TESTATTACHMENTS') {
            if (this.props.nsubsampleneed === true) {
                if (this.props.moreField === undefined  ) {
                    moreField.unshift({
                        [designProperties.LABEL]: this.props.Login.genericLabel ? this.props.Login.genericLabel["SubARNo"]["jsondata"]["sdisplayname"][this.props.Login.userInfo.slanguagetypecode]:"IDS_SAMPLEARNO",
                        [designProperties.VALUE]: "groupingField2"
                    })
                };
            }

            if (this.props.moreField === undefined ) {
                moreField.unshift({
                    //  [designProperties.LABEL]: this.props.nsubsampleneed && `${this.props.nsubsampleneed.nneedsubsample ? "IDS_SAMPLEARNO" : "IDS_ARNO"}`, 
                    //  [designProperties.VALUE]: this.props.nsubsampleneed && `${this.props.nsubsampleneed.nneedsubsample ? "ssamplearno" : "sarno"}`
                    [designProperties.LABEL]: this.props.Login.genericLabel ? this.props.Login.genericLabel["ARNo"]["jsondata"]["sdisplayname"][this.props.Login.userInfo.slanguagetypecode]:"IDS_ARNO",
                    [designProperties.VALUE]: "groupingField1"
                })
            };
        }
        let addFileId = this.props.controlMap.has(this.props.addName) && this.props.controlMap.get(this.props.addName).ncontrolcode;
        let editFileId = this.props.controlMap.has(this.props.editName) && this.props.controlMap.get(this.props.editName).ncontrolcode;
        let deleteFileId = this.props.controlMap.has(this.props.deleteName) && this.props.controlMap.get(this.props.deleteName).ncontrolcode;
        let viewFileId = this.props.controlMap.has(this.props.viewName) && this.props.controlMap.get(this.props.viewName).ncontrolcode;
        let mandatoryFields = [];
        if (this.state.selectedRecord && this.state.selectedRecord.nattachmenttypecode === attachmentType.LINK) {
            mandatoryFields.push(
                { "idsName": "IDS_FILENAME", "dataField": "slinkfilename", "mandatoryLabel": "IDS_CHOOSE", "controlType": "file" },
                { "idsName": "IDS_LINKNAME", "dataField": "nlinkcode", "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" })
        } else {
            // if (this.props.Login.operation !== 'update') {
            mandatoryFields.push(
                { "idsName": "IDS_FILE", "dataField": "sfilename", "mandatoryLabel": "IDS_CHOOSE", "controlType": "file" },
            );
            // if(this.props.isneedHeader){
            //     mandatoryFields.push(
            //         { "idsName": "IDS_HEADER", "dataField": "sheader", "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" })       
            // }
            // }
        }
        return (
            <>
                <div className="actions-stripe border-bottom">
                    <div className="d-flex justify-content-end">
                        <Nav.Link name={`add_${this.props.Login.screenName}_file`} className="add-txt-btn" hidden={this.props.userRoleControlRights.indexOf(addFileId) === -1}
                            onClick={() => this.props.getAttachmentCombo({ userInfo: this.props.Login.userInfo, operation: "create", ncontrolCode: addFileId, screenName: this.props.screenName, modalName: "openAttachmentModal", masterList: this.props.masterList, masterAlertStatus: this.props.masterAlertStatus })}>
                            <FontAwesomeIcon icon={faPlus} /> { }
                            <FormattedMessage id="IDS_ATTACHMENT" defaultMessage="Attachment" />
                        </Nav.Link>
                    </div>
                </div>
                <ListAttachment
                    attachmentList={this.props.attachments}
                    fileName="sfilename"
                    filesize="nfilesize"
                    linkname="slinkname"
                    isjsonfield={true}
                    jsonfield="jsondata"
                    deleteRecord={this.props.deleteAttachment}
                    deleteParam={this.props.deleteParam}
                    editParam={{ ...this.props.editParam, operation: "update", ncontrolCode: editFileId, screenName: this.props.screenName, modalName: "openAttachmentModal", masterList: this.props.masterList, masterAlertStatus: this.props.masterAlertStatus }}
                    fetchRecord={this.props.fetchRecord}
                    deleteId={deleteFileId}
                    editId={editFileId}
                    viewId={viewFileId}
                    userRoleControlRights={this.props.userRoleControlRights}
                    viewFile={this.viewFile}
                    mainField={this.props.mainField}
                    subFields={subFields}
                    moreField={moreField}
                    hidePaging={false}
                    userInfo={this.props.Login.userInfo}
                    // skip={this.props.skip}
                    // take={this.props.take}
                    settings={this.props.Login.settings}
                />
                {
                    this.props.Login.openAttachmentModal ?
                        <SlideOutModal
                            onSaveClick={this.onSaveClick}
                            operation={this.props.Login.operation}
                            screenName={this.props.Login.screenName}
                            closeModal={this.handleClose}
                            show={this.props.Login.openAttachmentModal}
                            inputParam={this.props.Login.inputParam}
                            esign={this.props.Login.loadEsign}
                            validateEsign={this.validateEsign}
                            masterStatus={this.props.Login.masterStatus}
                            updateStore={this.props.updateStore}
                            selectedRecord={this.state.selectedRecord || {}}
                            mandatoryFields={mandatoryFields}
                            addComponent={this.props.Login.loadEsign ?
                                <Esign
                                    operation={this.props.Login.operation}
                                    onInputOnChange={this.onInputOnChange}
                                    inputParam={this.props.Login.inputParam}
                                    selectedRecord={this.state.selectedRecord || {}}
                                />
                                :
                                <AddAttachment
                                    selectedRecord={this.state.selectedRecord || {}}
                                    onDrop={this.onDropFiles}
                                    deleteAttachment={this.deleteAttachment}
                                    jsonField={'jsondata'}
                                    actionType={this.state.actionType}
                                    linkMaster={this.props.Login.linkMaster}
                                    onInputOnChange={this.onAttachmentInputChange}
                                    editFiles={this.props.Login.editFiles}
                                    onComboChange={this.onComboChange}
                                    maxSize={20}
                                    fileNameLength={this.props.screenName === 'IDS_TESTATTACHMENTS' ? 255 : 150}
                                    maxFiles={this.props.Login.operation === "update" ? 1 : 3}
                                    operation={this.props.Login.operation}
                                    selectedListName={this.props.selectedListName}
                                    displayName={this.props.displayName}
                                    masterList={this.props.masterList}
                                    multiple={this.props.Login.operation === "update" ? false : true}
                                    isneedReport={this.props.isneedReport || false}
                                    isneedHeader={this.props.isneedHeader||false}
                                    settings={this.props.settings}
                                />
                            }
                        />
                        : ""}
            </>
        );
    }

    deleteAttachment = (event, file, fieldName) => {
        let selectedRecord = this.state.selectedRecord || {};
        selectedRecord[fieldName] = deleteAttachmentDropZone(selectedRecord[fieldName], file)

        this.setState({
            selectedRecord, actionType: "delete" //fileToDelete:file.name 
        });
    }


    onDropFiles = (attachedFiles, fieldName, maxSize) => {
        let selectedRecord = this.state.selectedRecord || {};
        selectedRecord[fieldName] = onDropAttachFileList(selectedRecord[fieldName], attachedFiles, maxSize)
        this.setState({ selectedRecord, actionType: "new" });
    }


    onAttachmentInputChange = (event, caseNo, optional) => {
        const selectedRecord = this.state.selectedRecord || {};
        switch (caseNo) {
            case 1:
                if (event.target.type === 'radio') {
                    selectedRecord[event.target.name] = event.target.checked === true && optional;
                    // selectedRecord["sfilename"] = "";
                } 
                else if(event.target.type === 'checkbox')
                {
                    selectedRecord[event.target.name] = event.target.checked == true ? transactionStatus.YES : transactionStatus.NO;
                }
                else {
                    selectedRecord[event.target.name] = event.target.value;
                }
                this.setState({ selectedRecord });
                break;

            default:
                selectedRecord[event.target.name] = event.target.value;
                this.setState({ selectedRecord });
                break;
        }
    }
    onInputOnChange = (event) => {
        let selectedRecord = this.state.selectedRecord || {};
        if (event.target.type === 'checkbox') {
            selectedRecord[event.target.name] = event.target.checked === true ? transactionStatus.YES : transactionStatus.NO;
        }
        else {
            selectedRecord[event.target.name] = event.target.value;
        }
        this.setState({ selectedRecord });
    }
    onComboChange = (comboData, comboName) => {
        const selectedRecord = this.state.selectedRecord || {};

        if (comboData) {
            selectedRecord[comboName] = comboData;
            this.setState({ selectedRecord });
        } else {
            selectedRecord[comboName] = []
            this.setState({ selectedRecord });
        }
    }
    componentDidUpdate(previousProps) {
        if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord) {
            this.setState({ selectedRecord: this.props.Login.selectedRecord });
        }
    }
    onSaveClick = (saveType, formRef) => {
        // const masterData = this.props.Login.masterData;
        // let inputData = {}
        // let inputParam = {}
        // inputData["userinfo"] = this.props.Login.userInfo;
        // if(this.props.Login.screenName === "IDS_SAMPLEATTACHMENTS") {
        //     let saveParam={userInfo:this.props.Login.userInfo,
        //         selectedRecord:this.state.selectedRecord,
        //         masterData:this.props.Login.masterData,
        //         saveType, formRef,
        //         operation:this.props.Login.operation,
        //         selectedMaster:this.props.selectedMaster
        //     }
        //     inputParam = onSaveSampleAttachment(saveParam,this.props.selectedMaster);
        // }else if(this.props.Login.screenName === "IDS_TESTATTACHMENTS") {
        //     let saveParam={userInfo:this.props.Login.userInfo,
        //         selectedRecord:this.state.selectedRecord,
        //         masterData:this.props.Login.masterData,
        //         saveType, formRef,
        //         operation:this.props.Login.operation,
        //         selectedMaster:this.props.selectedMaster
        //     }
        //     inputParam = onSaveTestAttachment(saveParam,this.props.selectedMaster);
        this.props.onSaveClick(saveType, formRef, this.state.selectedRecord)
        // }
        // if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolCode)) {
        //     const updateInfo = {
        //         typeName: DEFAULT_RETURN,
        //         data: {
        //             loadEsign: true,
        //             screenData: { inputParam, masterData },
        //             operation: this.props.Login.operation,
        //             screenName: this.props.Login.screenName,
        //         }
        //     }
        //     this.props.updateStore(updateInfo);
        // }
        // else {
        //     this.props.crudMaster(inputParam, masterData, "openAttachmentModal");
        // }
    }
    handleClose = () => {
        let loadEsign = this.props.Login.loadEsign;
        let openAttachmentModal = this.props.Login.openAttachmentModal
        let selectedRecord = this.props.Login.selectedRecord;
        let operation = this.props.Login.operation;
        if (this.props.Login.loadEsign) {
            if (this.props.Login.operation === "delete") {
                loadEsign = false;
                openAttachmentModal = false;
                selectedRecord = {};
                operation = undefined;
            }
            else {
                loadEsign = false;
                selectedRecord["esigncomments"] = "";
                selectedRecord["esignpassword"] = "";
                selectedRecord['esignreason'] = '';

            }
        }
        else {
            openAttachmentModal = false;
            selectedRecord = {};
        }

        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { openAttachmentModal, loadEsign, selectedRecord, selectedParamId: null, operation }
        }
        this.props.updateStore(updateInfo);
    }
    validateEsign = () => {
        const inputParam = {
            inputData: {
                "userinfo": {
                    ...this.props.Login.userInfo, 
                    sformname: Lims_JSON_stringify(this.props.Login.userInfo.sformname),
                    smodulename: Lims_JSON_stringify(this.props.Login.userInfo.smodulename),
                    slanguagename: Lims_JSON_stringify(this.props.Login.userInfo.slanguagename),
                    sreason: this.state.selectedRecord["esigncomments"],
                    nreasoncode:this.state.selectedRecord["esignreason"] && this.state.selectedRecord["esignreason"].value,
                    spredefinedreason:this.state.selectedRecord["esignreason"] && this.state.selectedRecord["esignreason"].label,
               
                },
                password: this.state.selectedRecord["esignpassword"]
            },
            screenData: this.props.Login.screenData
        }
        if (this.props.Login.operation === 'dynamic') {
            this.props.validateEsignforApproval(inputParam, "openChildModal");
        } else {
            this.props.validateEsignCredential(inputParam, "openAttachmentModal");
        }
    }
    viewFile = (filedata) => {
        const inputParam = {
            inputData: {
                file: filedata,
                userinfo: this.props.Login.userInfo
            },
            classUrl: "attachment",
            operation: "view",
            methodUrl: this.props.methodUrl,
            screenName: this.props.Login.screenName
        }
        this.props.viewAttachment(inputParam);
    }
}

export default connect(mapStateToProps, {
    updateStore, viewAttachment, validateEsignCredential, crudMaster, getAttachmentCombo, deleteAttachment
})(injectIntl(Attachments));