import { process } from '@progress/kendo-data-query';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { DEFAULT_RETURN } from '../../../actions/LoginTypes';
import DataGrid from '../../../components/data-grid/data-grid.component';
import { transactionStatus } from '../../../components/Enumeration';
import SlideOutModal from '../../../components/slide-out-modal/SlideOutModal';
import Esign from '../../audittrail/Esign';
import AddComment from './AddComment';
import { updateStore, viewAttachment, validateEsignCredential, crudMaster, getCommentsCombo, deleteComment, getSampleTestComments, getSampleTestCommentsDesc } from '../../../actions'
import { connect } from 'react-redux';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Nav } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
const mapStateToProps = state => {
    return ({ Login: state.Login })
}
class Comments extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedRecord: {}
        }
    }
    render() {
        let extractedColumnList = []
        if (this.props.Login.activeTestTab === "IDS_SAMPLECOMMENTS") {
            // if (this.props.masterData && this.props.masterData["RegSubTypeValue"] && 
            //    this.props.masterData["RegSubTypeValue"].nneedsubsample || this.props.masterData["nneedsubsample"]){
            //     extractedColumnList.push({"idsName":"IDS_SAMPLEARNO","dataField":"ssamplearno", "width": "155px"} );
            // }
            // else{
            extractedColumnList.push({ "idsName": this.props.Login.genericLabel ? this.props.Login.genericLabel["ARNo"]["jsondata"]["sdisplayname"][this.props.Login.userInfo.slanguagetypecode] : "IDS_ARNUMBER", "dataField": "sarno", "width": "155px" });
            //}
            extractedColumnList.push(
                //  {"idsName":"IDS_ARNUMBER","dataField":"sarno","width":"150px"},
                // { "idsName": "IDS_SAMPLEARNO", "dataField": "ssamplearno", "width": "200px" },
                { "idsName": "IDS_COMMENTS", "dataField": "scomments", "width": "200px", jsonField: true },
                // { "idsName": "IDS_SAMPLETESTCOMMENTS", "dataField": "ssampletestcommentname", "width": "400px" },
                { "idsName": "IDS_SCREENNAME", "dataField": "sdisplayname", "width": "150px" },
                { "idsName": "IDS_USERNAME", "dataField": "susername", "width": "200px" },
                { "idsName": "IDS_USERROLE", "dataField": "suserrolename", "width": "200px" },
            );
        }
        else if (this.props.Login.activeTestTab === "IDS_SUBSAMPLECOMMENTS") {
            extractedColumnList.push({ "idsName": this.props.Login.genericLabel ? this.props.Login.genericLabel["ARNo"]["jsondata"]["sdisplayname"][this.props.Login.userInfo.slanguagetypecode] : "IDS_ARNUMBER", "dataField": "sarno", "width": "155px" });
            if (this.props.masterData["RegSubTypeValue"] &&
                this.props.masterData["RegSubTypeValue"].nneedsubsample
                || this.props.masterData["nneedsubsample"]
            ) {
                extractedColumnList.push({ "idsName": this.props.Login.genericLabel ? this.props.Login.genericLabel["SubARNo"]["jsondata"]["sdisplayname"][this.props.Login.userInfo.slanguagetypecode] : "IDS_SAMPLEARNO", "dataField": "ssamplearno", "width": "155px" });
            }
            //else{
            //    extractedColumnList.push({"idsName":"IDS_ARNUMBER","dataField":"sarno", "width": "155px"});
            //}
            extractedColumnList.push(
                //  {"idsName":"IDS_ARNUMBER","dataField":"sarno","width":"100px"},
                // { "idsName": "IDS_SAMPLEARNO", "dataField": "ssamplearno", "width": "200px" },
                { "idsName": "IDS_COMMENTS", "dataField": "scomments", "width": "200px", jsonField: true },
                // { "idsName": "IDS_SAMPLETESTCOMMENTS", "dataField": "ssampletestcommentname", "width": "400px" },
                { "idsName": "IDS_SCREENNAME", "dataField": "sdisplayname", "width": "150px" },
                { "idsName": "IDS_USERNAME", "dataField": "susername", "width": "200px" },
                { "idsName": "IDS_USERROLE", "dataField": "suserrolename", "width": "200px" },
            );
        }
        else {
            if (this.props.Login.activeTestTab === "IDS_TESTCOMMENTS") {
                extractedColumnList.push({ "idsName": this.props.Login.genericLabel ? this.props.Login.genericLabel["ARNo"]["jsondata"]["sdisplayname"][this.props.Login.userInfo.slanguagetypecode] : "IDS_ARNUMBER", "dataField": "sarno", "width": "155px" });
                if (this.props.masterData && this.props.masterData["RealRegSubTypeValue"] &&
                    this.props.masterData["RealRegSubTypeValue"].nneedsubsample || this.props.masterData["nneedsubsample"]) {
                    extractedColumnList.push({ "idsName": this.props.Login.genericLabel ? this.props.Login.genericLabel["SubARNo"]["jsondata"]["sdisplayname"][this.props.Login.userInfo.slanguagetypecode] : "IDS_SAMPLEARNO", "dataField": "ssamplearno", "width": "155px" });
                }
                // else{
                //     extractedColumnList.push({"idsName":"IDS_ARNUMBER","dataField":"sarno", "width": "155px"});
                // }
                extractedColumnList.push(
                    // extractedColumnList = [
                    // {"idsName":"IDS_ARNUMBER","dataField":"sarno","width":"100px"},
                    // {"idsName":"IDS_SAMPLEARNO","dataField":"ssamplearno","width":"150px"},
                    { "idsName": "IDS_TESTNAME", "dataField": "stestsynonym", "width": "200px", jsonField: true },
                    { "idsName": "IDS_COMMENTS", "dataField": "scomments", "width": "200px", jsonField: true });

                this.props.isneedReport &&
                    extractedColumnList.push({ "idsName": "IDS_INCULDEINREPORT", "dataField": "sneedreport", "width": "200px" });

                // { "idsName": "IDS_SAMPLETESTCOMMENTS", "dataField": "ssampletestcommentname", "width": "400px" },
                extractedColumnList.push({ "idsName": "IDS_SCREENNAME", "dataField": "sdisplayname", "width": "150px" },
                    { "idsName": "IDS_USERNAME", "dataField": "susername", "width": "200px" },
                    { "idsName": "IDS_USERROLE", "dataField": "suserrolename", "width": "200px" });
                // ];
            }
        }

        let addFileId = this.props.controlMap.has(this.props.addName) && this.props.controlMap.get(this.props.addName).ncontrolcode;
        let mandatoryFields = [];
        if (this.props.isTestComment) {
            if (this.props.masterData && this.props.masterData["RegSubTypeValue"] && this.props.masterData["RegSubTypeValue"].nneedsubsample) {
                extractedColumnList.push({ "idsName": this.props.Login.genericLabel ? this.props.Login.genericLabel["SubARNo"]["jsondata"]["sdisplayname"][this.props.Login.userInfo.slanguagetypecode] : "IDS_SAMPLEARNO", "dataField": "ssamplearno", "width": "155px" });
            }
            else {
                extractedColumnList.push({ "idsName": this.props.Login.genericLabel ? this.props.Login.genericLabel["ARNo"]["jsondata"]["sdisplayname"][this.props.Login.userInfo.slanguagetypecode] : "IDS_ARNUMBER", "dataField": "sarno", "width": "155px" });
            }
            extractedColumnList.push(
                //  { "idsName": "IDS_SAMPLEARNO", "dataField": "ssamplearno", "width": "200px" },
                { "idsName": "IDS_TESTNAME", "dataField": "stestsynonym", "width": "200px", jsonField: true },
                { "idsName": "IDS_COMMENTS", "dataField": "scomments", "width": "200px", jsonField: true });

            this.props.isneedReport &&
                extractedColumnList.push({ "idsName": "IDS_INCULDEINREPORT", "dataField": "sneedreport", "width": "200px" });

            extractedColumnList.push(
                { "idsName": "IDS_SAMPLETESTCOMMENTS", "dataField": "ssampletestcommentname", "width": "400px" },
                { "idsName": "IDS_SCREENNAME", "dataField": "sdisplayname", "width": "150px" },
                { "idsName": "IDS_USERNAME", "dataField": "susername", "width": "200px" },
                { "idsName": "IDS_USERROLE", "dataField": "suserrolename", "width": "200px" });
            //]
            mandatoryFields = [
                { "idsName": "IDS_SAMPLETESTCOMMENTS", "dataField": "nsamplecommentscode", "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
                { "idsName": "IDS_COMMENT", "dataField": "scomments", "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" }
            ];
        } else if (this.props.isSampleTestComment && this.props.isSampleTestComment === true) {
            extractedColumnList = []
            mandatoryFields = []
            if (this.props.Login.activeTestTab === "IDS_TESTCOMMENTS") {
                extractedColumnList.push({ "idsName": this.props.Login.genericLabel ? this.props.Login.genericLabel["ARNo"]["jsondata"]["sdisplayname"][this.props.Login.userInfo.slanguagetypecode] : "IDS_ARNUMBER", "dataField": "sarno", "width": "155px" });
            }
            if (this.props.masterData && this.props.masterData["RealRegSubTypeValue"] &&
                this.props.masterData["RealRegSubTypeValue"].nneedsubsample || this.props.masterData["nneedsubsample"]) {
                extractedColumnList.push({ "idsName": this.props.Login.genericLabel ? this.props.Login.genericLabel["SubARNo"]["jsondata"]["sdisplayname"][this.props.Login.userInfo.slanguagetypecode] : "IDS_SAMPLEARNO", "dataField": "ssamplearno", "width": "155px" });
            }
            extractedColumnList.push(
                { "idsName": "IDS_TESTNAME", "dataField": "stestsynonym", "width": "200px" },
                { "idsName": "IDS_COMMENTNAME", "dataField": "scommentsubtype", "width": "200px" },
                { "idsName": "IDS_ABBREVIATIONNAME", "dataField": "spredefinedname", "width": "200px" },
                { "idsName": "IDS_COMMENT", "dataField": "scomments", "width": "200px" });

            this.props.isneedReport &&
                extractedColumnList.push({ "idsName": "IDS_INCULDEINREPORT", "dataField": "sneedreport", "width": "200px" });

            extractedColumnList.push({ "idsName": "IDS_SCREENNAME", "dataField": "sdisplayname", "width": "150px" },
                { "idsName": "IDS_USERNAME", "dataField": "susername", "width": "200px" },
                { "idsName": "IDS_USERROLE", "dataField": "suserrolename", "width": "200px" });
            if (this.props.Login.isAbbrevationneeded) {
                mandatoryFields = [
                    { "idsName": "IDS_COMMENTNAME", "dataField": "ncommentsubtypecode", "mandatoryLabel": "IDS_SELECT", "controlType": "combo" },
                    { "idsName": "IDS_ABBREVIATIONNAME", "dataField": "nsampletestcommentscode", "mandatoryLabel": "IDS_SELECT", "controlType": "combo" },
                    { "idsName": "IDS_COMMENT", "dataField": "scomments", "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" }

                ];
            }
            else {
                mandatoryFields = [
                    { "idsName": "IDS_COMMENTNAME", "dataField": "ncommentsubtypecode", "mandatoryLabel": "IDS_SELECT", "controlType": "combo" },
                    { "idsName": "IDS_COMMENT", "dataField": "scomments", "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" }
                ];
            }

        }
        else {

            mandatoryFields = [
                { "idsName": "IDS_COMMENT", "dataField": "scomments", "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
            ];

        }

        return (

            <>
                <div className="actions-stripe border-bottom">
                    <div className="d-flex justify-content-end">
                        <Nav.Link name={`add_${this.props.Login.screenName}_comment`} className="add-txt-btn" hidden={this.props.userRoleControlRights.indexOf(addFileId) === -1}
                            onClick={() => this.props.getCommentsCombo({
                                userInfo: this.props.Login.userInfo, operation: "create", ncontrolCode: addFileId, screenName: this.props.screenName, modalName: "openCommentModal", masterList: this.props.masterList, masterAlertStatus: this.props.masterAlertStatus,
                                isSampleTestComment: this.props.isSampleTestComment
                            })}>
                            <FontAwesomeIcon icon={faPlus} /> { }
                            <FormattedMessage id="IDS_COMMENT" defaultMessage=" Comment" />
                        </Nav.Link>
                    </div>
                </div>
                <DataGrid
                    primaryKeyField={this.props.primaryKeyField}
                    data={this.props.Comments}
                    dataResult={process(this.props.Comments || [], this.props.dataState)}
                    dataState={this.props.dataState}
                    dataStateChange={this.props.dataStateChange}
                    extractedColumnList={extractedColumnList}
                    userInfo={this.props.userInfo}
                    controlMap={this.props.controlMap}
                    userRoleControlRights={this.props.userRoleControlRights}
                    inputParam={this.props.inputParam}
                    pageable={true}
                    expandField="expanded"
                    hideDetailBand={true}
                    isActionRequired={this.props.isActionRequired !== undefined ? this.props.isActionRequired : true}
                    deleteParam={this.props.deleteParam || ""}
                    fetchRecord={this.props.fetchRecord || ""}
                    editParam={{ ...this.props.editParam, isSampleTestComment: this.props.isSampleTestComment, modalName: "openCommentModal" } || ""}
                    deleteRecord={this.props.deleteComment || ""}
                    selectedId={this.props.selectedId}
                    isToolBarRequired={false}
                    scrollable={"scrollable"}
                    gridHeight={"500px"}
                    methodUrl={this.props.methodUrl}
                    jsonField={"jsondata"}
                />
                {
                    this.props.Login.openCommentModal ?
                        <SlideOutModal
                            onSaveClick={this.onSaveClick}
                            operation={this.props.Login.operation}
                            screenName={this.props.Login.screenName}
                            closeModal={this.handleClose}
                            show={this.props.Login.openCommentModal}
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
                                <AddComment
                                    selectedRecord={this.state.selectedRecord}
                                    jsonField={"jsondata"}
                                    SampleTestComments={this.props.Login.sampleTestComments}
                                    predefcomments={this.props.Login.predefcomments && this.props.Login.predefcomments}
                                    CommentSubType={this.props.Login.CommentSubType && this.props.Login.CommentSubType}
                                    onInputOnChange={this.onInputOnChange}
                                    onComboChange={this.onComboChange}
                                    isTestComment={this.props.isTestComment}
                                    isSampleTestComment={this.props.isSampleTestComment}
                                    maxSize={20}
                                    maxFiles={3}
                                    operation={this.props.Login.operation}
                                    selectedListName={this.props.selectedListName}
                                    displayName={this.props.displayName}
                                    masterList={this.props.masterList}
                                    isneedReport={this.props.isneedReport}
                                />
                            }
                        />
                        : ""
                }
            </>
        )
    }
    componentDidUpdate(previousProps) {
        if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord) {
            this.setState({ selectedRecord: this.props.Login.selectedRecord });
        }
    }
    onComboChange = (comboData, comboName) => {
        let addFileId = this.props.controlMap.has(this.props.addName) && this.props.controlMap.get(this.props.addName).ncontrolcode;
        if (comboData) {
            let selectedRecord = this.state.selectedRecord || {};
            if (comboName === 'ncommentsubtypecode') {
                selectedRecord[comboName] = comboData
                this.props.getSampleTestComments(selectedRecord, this.props.Login.userInfo)
            }
            else {
                if (comboName === 'nsampletestcommentscode') {
                    selectedRecord['scomments'] = comboData.item.scomments;
                    selectedRecord[comboName] = comboData
                    this.props.getSampleTestCommentsDesc(selectedRecord, this.props.Login.userInfo)
                }
                // selectedRecord[comboName] = comboData
                this.setState({ selectedRecord });
            }

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
    onSaveClick = (saveType, formRef) => {
        // const masterData = this.props.Login.masterData;
        // let inputData = {}
        // let inputParam = {}
        // inputData["userinfo"] = this.props.Login.userInfo;
        // if(this.props.Login.screenName === "IDS_SAMPLECOMMENTS") {
        //     // let saveParam={userInfo:this.props.Login.userInfo,
        //     //     selectedRecord:this.state.selectedRecord,
        //     //     masterData:this.props.Login.masterData,
        //     //     saveType, formRef,
        //     //     operation:this.props.Login.operation
        //     // }
        //     // inputParam = onSaveSampleAttachment(saveParam);
        // }else if(this.props.Login.screenName === "IDS_TESTCOMMENTS") {
        //     let saveParam={
        //         userInfo:this.props.Login.userInfo,
        //         isTestComment:this.props.isTestComment,
        //         selectedRecord:this.state.selectedRecord,
        //         masterData:this.props.Login.masterData,
        //         saveType, formRef,
        //         operation:this.props.Login.operation,
        //         selectedMaster:this.props.selectedMaster
        //     }
        //     inputParam = onSaveTestComments(saveParam);
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
        //     this.props.crudMaster(inputParam, masterData, "openCommentModal");
        // }
        this.props.onSaveClick(saveType, formRef, this.state.selectedRecord)
    }
    handleClose = () => {
        let loadEsign = this.props.Login.loadEsign;
        let openCommentModal = this.props.Login.openCommentModal
        let selectedRecord = this.props.Login.selectedRecord;
        let selectedId = this.props.Login.selectedId;
        let operation = this.props.Login.operation;
        if (this.props.Login.loadEsign) {
            if (this.props.Login.operation === "delete") {
                loadEsign = false;
                openCommentModal = false;
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
            openCommentModal = false;
            selectedRecord = {};
            selectedId = null;
        }

        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { openCommentModal, loadEsign, selectedRecord, selectedParamId: null, operation, selectedId }
        }
        this.props.updateStore(updateInfo);
    }
    validateEsign = () => {
        const inputParam = {
            inputData: {
                "userinfo": {
                    ...this.props.Login.userInfo,
                    sreason: this.state.selectedRecord["esigncomments"],
                    nreasoncode: this.state.selectedRecord["esignreason"] && this.state.selectedRecord["esignreason"].value,
                    spredefinedreason: this.state.selectedRecord["esignreason"] && this.state.selectedRecord["esignreason"].label,

                },
                password: this.state.selectedRecord["esignpassword"]
            },
            screenData: this.props.Login.screenData
        }
        if (this.props.Login.operation === 'dynamic') {
            this.props.validateEsignforApproval(inputParam, "openChildModal");
        } else {
            this.props.validateEsignCredential(inputParam, "openCommentModal");
        }
    }
}
export default connect(mapStateToProps, { updateStore, viewAttachment, validateEsignCredential, crudMaster, getCommentsCombo, deleteComment, getSampleTestComments, getSampleTestCommentsDesc })(injectIntl(Comments));