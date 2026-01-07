import React, { Component } from 'react';
import { Col, Row } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import 'react-perfect-scrollbar/dist/css/styles.css';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import {
    addFile,
    callService, crudMaster, getSubContractorComboService,
    saveSubcontractorTestFile,
    updateReceiveResultSubContractTest,
    updateReceiveSTTSubContractTest,
    updateStore, updateSubContractSamplesdetails,
    viewDetail, viewAttachment
} from '../../actions';
import { DEFAULT_RETURN } from '../../actions/LoginTypes';
import { create_UUID, deleteAttachmentDropZone, getControlMap, Lims_JSON_stringify, onDropAttachFileList, showEsign } from '../../components/CommonScript';
import { attachmentType, transactionStatus } from '../../components/Enumeration';
import ConfirmMessage from '../../components/confirm-alert/confirm-message.component';
import SlideOutModal from '../../components/slide-out-modal/SlideOutModal';
import Esign from '../audittrail/Esign';
// import './product.css';
import { process } from '@progress/kendo-data-query';
import DataGrid from '../../components/data-grid/data-grid.component';
import { ListWrapper } from '../userroletemplate/userroletemplate.styles';
import AddSubContractorTestAttchment from './AddSubContractorTestAttchment';
import SendSubContractor from './SendSubContractor';
import ViewRecord from './viewRecord';
import { faChevronCircleDown } from '@fortawesome/free-solid-svg-icons';
import CustomPopover from '../../components/customPopover';

class SubContractTestDetail extends Component {

    constructor(props) {
        super(props);
        this.formRef = React.createRef();

        const dataState = {
            skip: 0,
            take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5,
        };
        this.state = {
            data: [], masterStatus: "", error: "", selectedRecord: {},
            dataResult: [],
            dataState: dataState,
            userRoleControlRights: [],
            controlMap: new Map()
        };
        this.searchRef = React.createRef();
        this.confirmMessage = new ConfirmMessage();
        this.extractedColumnList = [
            { "idsName": "IDS_TEST", "dataField": "stestname", "width": "200px" },
            { "idsName": "IDS_SUBCONTRACTOR", "dataField": "ssuppliername", "width": "200px" },
            { "idsName": "IDS_EXPECTEDDATE", "dataField": "sexpecteddate", "width": "200px" },
            { "idsName": "IDS_CONTROLLEADTIME", "dataField": "scontrolleaddate", "width": "200px" },
            { "idsName": "IDS_FILENAME", "dataField": "sfilename", "width": "200px", "fieldType": "attachment" },
            { "idsName": "IDS_ARNO", "dataField": "sarno", "width": "200px" },
            { "idsName": "IDS_SAMPLEARNO", "dataField": "ssamplearno", "width": "200px" },
            { "idsName": "IDS_DISPLAYSTATUS", "dataField": "stransdisplaystatus", "width": "200px" }
        ];
    }



    closeModal = () => {
        let loadEsign = this.props.Login.loadEsign;
        let openModal = this.props.Login.openModal;
        let openChildModal = this.props.Login.openChildModal;
        let selectedRecord = this.props.Login.selectedRecord;
        let selectedId = this.props.Login.selectedId;
        if (this.props.Login.loadEsign) {
            if (this.props.Login.operation === "sendsubcontractor") {
                loadEsign = false;
                openModal = false;
                openChildModal = false;
                selectedRecord = {};
            }
            else {
                loadEsign = false;
                selectedRecord['esignpassword'] = ""
                selectedRecord['esigncomments'] = ""
                selectedRecord['esignreason'] = ""
                selectedRecord = {};
            }
        }
        else {
            openModal = false;
            openChildModal = false;
            selectedRecord = {};
            selectedId = null;
        }

        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { openModal, openChildModal, loadEsign, selectedRecord, selectedId }
        }
        this.props.updateStore(updateInfo);

    }

    static getDerivedStateFromProps(props, state) {

        if (props.Login.masterStatus !== "" && props.Login.masterStatus !== state.masterStatus) {
            toast.warn(props.Login.masterStatus);
            props.Login.masterStatus = "";
        }

        if (props.Login.error !== state.error) {
            toast.error(props.Login.error)
            props.Login.error = "";
        }
        return null;
    }

    dataStateChange = (event) => {
        this.setState({
            dataResult: process(this.state.data, event.dataState),
            dataState: event.dataState
        });
    }

    /*actionMethod = (value) => {
        if (value.method === templateMappingAction.CONFIGSAMPLEDISPLAY) {
            this.openFieldConfiguration(value.controlId, "configure");
        }
        else if (value.method === templateMappingAction.CONFIGSAMPLEEDIT) {
            this.editFieldConfiguration(value.controlId, 'configureedit')
        }
        else if (value.method === templateMappingAction.CONFIGSUBSAMPLEDISPLAY) {
            this.openFieldConfiguration(value.controlId, 'configuresubsample')
        }
        else if (value.method === templateMappingAction.CONFIGSUBSAMPLEEDIT) {
            this.editFieldConfiguration(value.controlId, 'configuresubsampleedit')
        }
        else if (value.method === templateMappingAction.CONFIGUNIQUE) {
            this.openCombinationUniqueFieldConfiguration(value.controlId)
        }
        else if (value.method === templateMappingAction.CONFIGSAMPLEAUDIT) {
            this.auditFieldConfiguration(value.controlId, 'configureaudit')
        }
        // else if (value.method === templateMappingAction.CONFIGSENDTOSTORE) {
        //     this.mappingFieldConfiguration(value.controlId, 'configuresendtostore')
        // }
        else if (value.method === templateMappingAction.CONFIGEXPORTFIELDS) {
            this.exportFieldConfiguration(value.controlId, 'configureexportfields')
        }
        else if (value.method === templateMappingAction.CONFIGURECHECKLIST) {
            this.configureCheckList(value.controlId, 'configurechecklist')
        }
        else if (value.method === templateMappingAction.CONFIGURERELEASESAMPLEFILTER) {
            this.configureReportFilterType(value.controlId, 'configurereleasesamplefilter')
        }
    } */

    render() {

  
        const SendToSubContractorId = this.props.Login.inputParam && this.state.controlMap.has("SendToSubContractor")
            && this.state.controlMap.get("SendToSubContractor").ncontrolcode;

        const ReceivedBySTTId = this.props.Login.inputParam && this.state.controlMap.has("ReceivedBySTT")
            && this.state.controlMap.get("ReceivedBySTT").ncontrolcode;

        const ResultReceivedId = this.props.Login.inputParam && this.state.controlMap.has("ResultReceived")
            && this.state.controlMap.get("ResultReceived").ncontrolcode;

        const SubContTestAttachmentId = this.props.Login.inputParam && this.state.controlMap.has("SubContTestAttachment")
            && this.state.controlMap.get("SubContTestAttachment").ncontrolcode;

        const viewDetailId = this.props.Login.inputParam && this.state.controlMap.has("ViewSubContractorTestDetail")
            && this.state.controlMap.get("ViewSubContractorTestDetail").ncontrolcode;

        const attachmentParam = {
            operation: "view",
            classUrl: "subcontracttestdetail",
            methodUrl: "SubcontractorTestFile",
        }

       /* let actionList = []

        if (SendToSubContractorId) {
            actionList.push({ "method": 1, "value": this.props.intl.formatMessage({ id: "IDS_SEND" }), "controlId": SendToSubContractorId })

        }
        if (ReceivedBySTTId) {
            actionList.push({ "method": 2, "value": this.props.intl.formatMessage({ id: "IDS_RECEIVEDBYSTT" }), "controlId": ReceivedBySTTId })

        }
        if (ResultReceivedId) {
            actionList.push({ "method": 3, "value": this.props.intl.formatMessage({ id: "IDS_RESULTRECEIVEDBY" }), "controlId": ResultReceivedId })

        }
        if (SubContTestAttachmentId) {
            actionList.push({ "method": 4, "value": this.props.intl.formatMessage({ id: "IDS_ATTCHMENT" }), "controlId": SubContTestAttachmentId })

        }
        if (viewDetailId) {
            actionList.push({ "method": 5, "value": this.props.intl.formatMessage({ id: "IDS_VIEWDETAIL" }), "controlId": viewDetailId })

        }*/



        return (
            <>
                <Row>
                    <Col>
                        <ListWrapper className="client-list-content">

                            {this.state.data ?
                                <DataGrid
                                    primaryKeyField={"nsubcontractortestdetailcode"}
                                    data={this.state.data}
                                    dataResult={this.state.dataResult}
                                    dataState={this.state.dataState}
                                    dataStateChange={this.dataStateChange}
                                    extractedColumnList={this.extractedColumnList}
                                    fetchRecord={this.props.getProductComboService}
                                    editParam={[]}
                                    deleteRecord={this.deleteRecord}
                                    deleteParam={[]}
                                    reloadData={this.reloadData}
                                    controlMap={this.state.controlMap}
                                    userRoleControlRights={this.state.userRoleControlRights}
                                    inputParam={this.props.Login.inputParam}
                                    userInfo={this.props.Login.userInfo}
                                    pageable={true}
                                    scrollable={'scrollable'}
                                    gridHeight={'600px'}
                                    isActionRequired={true}
                                    isToolBarRequired={true}
                                    selectedId={this.props.Login.selectedId}
                                    masterdata={this.props.Login.masterData || []}
                                    sendRecord={this.props.getSubContractorComboService}
                                    updateReceiveSTTSubContractTest={this.props.updateReceiveSTTSubContractTest}
                                    updateReceiveResultSubContractTest={this.props.updateReceiveResultSubContractTest}
                                    addFile={this.props.addFile}
                                    attahmentID={SubContTestAttachmentId}
                                    viewDetailID={viewDetailId}
                                    viewDetail={this.props.viewDetail}
                                    viewFile={this.viewFile}
                                    attachmentParam={attachmentParam}
                                    groupIconAction={true}
                                    listMasterShowIcon={3}
                                    clickIconGroup={true}
                                    //actionList = {actionList}
                                   // clicOnMoreList = {this.onClicOnMoreList}
                                    moreActionIcons={
                                        [
                                            {
                                                title: this.props.intl.formatMessage({ id: "IDS_SEND" }),
                                                controlname: "faPaperPlane",
                                                objectName: "mastersendtostore",
                                                hidden: !this.state.userRoleControlRights.indexOf(SendToSubContractorId) === -1,
                                                onClick: this.props.getSubContractorComboService,
                                                inputData: {
                                                    masterData: this.props.Login.masterData,
                                                    userInfo: this.props.Login.userInfo,
                                                    ncontrolCode: SendToSubContractorId
                                                },
                                            },
                                            {
                                                title: this.props.intl.formatMessage({ id: "IDS_RECEIVEBYSTT" }),
                                                controlname: "faHandHoldingWater",
                                                objectName: "mastersendtostore",
                                                hidden: !this.state.userRoleControlRights.indexOf(ReceivedBySTTId) === -1,
                                                onClick: this.props.updateReceiveSTTSubContractTest,
                                                inputData: {
                                                    masterData: this.props.Login.masterData,
                                                    userInfo: this.props.Login.userInfo,
                                                    ncontrolCode: ReceivedBySTTId
                                                },
                                            },
                                            {
                                                title: this.props.intl.formatMessage({ id: "IDS_RESULTRECEIVED" }),
                                                controlname: "faInbox",
                                                objectName: "mastersendtostore",
                                                hidden: !this.state.userRoleControlRights.indexOf(ResultReceivedId) === -1,
                                                onClick: this.props.updateReceiveResultSubContractTest,
                                                inputData: {
                                                    masterData: this.props.Login.masterData,
                                                    userInfo: this.props.Login.userInfo,
                                                    ncontrolCode: ResultReceivedId
                                                },
                                            },
                                            {
                                                title: this.props.intl.formatMessage({ id: "IDS_ATTACHMENT" }),
                                                controlname: "faPaperclip",
                                                objectName: "mastersendtostore",
                                                hidden: !this.state.userRoleControlRights.indexOf(SubContTestAttachmentId) === -1,
                                                onClick: this.props.addFile,
                                                inputData: {
                                                    masterData: this.props.Login.masterData,
                                                    userInfo: this.props.Login.userInfo,
                                                    ncontrolCode: SubContTestAttachmentId
                                                },
                                            },
                                            {
                                                title: this.props.intl.formatMessage({ id: "IDS_VIEWDETAILS" }), // ALPD-5419 - Gowtham R - 14/02/2025 - SubContractor - Screen Bugs
                                                controlname: "faEye",
                                                objectName: "mastersendtostore",
                                                hidden: !this.state.userRoleControlRights.indexOf(viewDetailId) === -1,
                                                onClick: this.props.viewDetail,
                                                inputData: {
                                                    masterData: this.props.Login.masterData,
                                                    userInfo: this.props.Login.userInfo,
                                                    ncontrolCode: viewDetailId
                                                },
                                            }

                                        ]

                                    }
                                />
                                : ""}
                        </ListWrapper>
                    </Col>
                </Row>
                
                {/* Below Condition Added to avoid unwanted rendering of SlideOut */}
                {this.props.Login.openModal || this.props.Login.openChildModal ?
                    <SlideOutModal
                        show={this.props.Login.screenName === this.props.Login.genericLabel["Product"]["jsondata"]["sdisplayname"][this.props.Login.userInfo.slanguagetypecode].concat(" " + this.props.intl.formatMessage({ id: "IDS_FILE" })) ?
                            this.props.Login.openChildModal :
                            this.props.Login.openModal}
                        closeModal={this.closeModal}
                        needClose={this.props.Login.operation === "viewRecord"} // ALPD-5419 - Gowtham R - 14/02/2025 - SubContractor - Screen Bugs
                        operation={this.props.Login.operation}
                        inputParam={this.props.Login.inputParam}
                        showSaveContinue={true}
                        screenName={"IDS_SUBCONTRACTOR"}
                        onSaveClick={this.onSaveClick}
                        hideSave={this.props.Login.operation === "viewRecord"} // ALPD-5419 - Gowtham R - 14/02/2025 - SubContractor - Screen Bugs
                        esign={this.props.Login.loadEsign}
                        validateEsign={this.validateEsign}
                        masterStatus={this.props.Login.masterStatus}
                        updateStore={this.props.updateStore}
                        mandatoryFields={[
                            { "mandatory": true, "idsName": "IDS_SUBCONTRACTOR", "dataField": "nsuppliercode", "width": "250px", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
                        ]}
                        selectedRecord={this.state.selectedRecord || {}}
                        addComponent={this.props.Login.loadEsign ?
                            <Esign operation={this.props.Login.operation}
                                onInputOnChange={this.onInputOnChange}
                                inputParam={this.props.Login.inputParam}
                                selectedRecord={this.state.selectedRecord || {}}
                            />
                            :
                            this.props.Login.operation === "sendsubcontractor" ?
                                <SendSubContractor
                                    selectedRecord={this.state.selectedRecord || {}}
                                    onInputOnChange={this.onInputOnChange}
                                    onComboChange={this.onComboChange}
                                    subContracorMapList={this.props.Login.subContracorMapList || []}
                                    operation={this.props.Login.operation}
                                    userInfo={this.props.Login.userInfo}
                                />
                                : this.props.Login.operation === "fileattachment" ?
                                    <AddSubContractorTestAttchment
                                        selectedRecord={this.state.selectedRecord || {}}
                                        onInputOnChange={this.onInputOnChange}
                                        onComboChange={this.onComboChange}
                                        subContracorMapList={this.props.Login.subContracorMapList || []}
                                        operation={this.props.Login.operation}
                                        userInfo={this.props.Login.userInfo}
                                        linkMaster={this.props.Login.linkMaster}
                                        onDrop={this.onDropFile}
                                        deleteAttachment={this.deleteAttachment}
                                        settings={this.props.Login.settings}
                                        label={this.props.intl.formatMessage({ id: "IDS_FILE" })} // ALPD-5410 - Gowtham 13/02/2025 - SubContractor - no label for file upload in attachment
                                    />
                                    : this.props.Login.operation === "viewRecord" && Object.keys(this.state.selectedRecord).length > 0 ?
                                        // <ViewRecord
                                        //     selectedRecord={this.props.Login.selectedRecord || {}}
                                        //     operation={this.props.Login.operation}
                                        //     userInfo={this.props.Login.userInfo}

                                        // />
                                        <ViewRecord
                                            data={this.state.selectedRecord && this.state.selectedRecord['subcontractortestdetail'] ?
                                                JSON.parse(this.state.selectedRecord['subcontractortestdetail'].jsonsample.value) : {}}
                                            values={this.state.selectedRecord && this.state.selectedRecord['subcontractortestdetail'] ?
                                                [JSON.parse(this.state.selectedRecord['subcontractortestdetail'].jsonsample.value), JSON.parse(this.state.selectedRecord['subcontractortestdetail'].jsonsubsample.value)] : {}}
                                            SingleItem={this.state.DynamicSampleColumns}
                                            displayFields={[this.state.DynamicSampleColumns, this.state.DynamicSubSampleColumns]}
                                            screenName="IDS_SAMPLEINFO"
                                            userInfo={this.props.Login.userInfo}
                                        />
                                        : ""
                        }
                    />                    
                    : ""}

            </>
        );
    }
  


    viewFile = (inputParam) => {
        //let inputData = {}
        let inputParamData = {

            ...inputParam,
            inputData: { ...inputParam.inputData, subcontractortestdetail: inputParam.inputData.selectedRecord }
        }
        this.props.viewAttachment(inputParamData)
    }

    onSaveSubContractorTestFile = (saveType, formRef) => {
        const selectedRecord = this.state.selectedRecord;
        const acceptedFiles = selectedRecord.sfilename;
        const nattachmenttypecode = selectedRecord.nattachmenttypecode;
        let isFileEdited = selectedRecord.editable ? selectedRecord.editable : transactionStatus.ALL;
        let FileArray = [];

        if (isFileEdited == 1) {
            let subcontractorTestFile = {
                nsubcontractortestdetailcode: selectedRecord.subcontractortestdetail.nsubcontractortestdetailcode,
                nattachmenttypecode
            };
            const formData = new FormData();
            if (nattachmenttypecode === attachmentType.FTP) {
                if (acceptedFiles && Array.isArray(acceptedFiles) && acceptedFiles.length > 0) {
                    acceptedFiles.forEach((file, index) => {
                        const tempData = Object.assign({}, subcontractorTestFile);
                        const splittedFileName = file.name.split('.');
                        const fileExtension = file.name.split('.')[splittedFileName.length - 1];
                        const ssystemfilename = selectedRecord.ssystemfilename ? selectedRecord.ssystemfilename.split('.') : "";
                        const filesystemfileext = selectedRecord.ssystemfilename ? file.name.split('.')[ssystemfilename.length - 1] : "";
                        const uniquefilename = nattachmenttypecode === attachmentType.FTP ? selectedRecord.nsupplierfilecode && selectedRecord.nsupplierfilecode > 0
                            && selectedRecord.ssystemfilename !== "" && selectedRecord.ssystemfilename !== undefined ? ssystemfilename[0] + '.' + filesystemfileext : create_UUID() + '.' + fileExtension : "";
                        tempData["sfilename"] = Lims_JSON_stringify(file.name, false);
                        //tempData["sdescription"] = Lims_JSON_stringify(selectedRecord.sdescription ? selectedRecord.sdescription.trim() : "", false);
                        tempData["nlinkcode"] = transactionStatus.NA;
                        tempData["ssystemfilename"] = uniquefilename;
                        tempData["nfilesize"] = file.size;
                        formData.append("uploadedFile" + index, file);
                        formData.append("uniquefilename" + index, uniquefilename);
                        FileArray.push(tempData);
                    });
                    formData.append("filecount", acceptedFiles.length);
                    isFileEdited = transactionStatus.YES;
                } else {
                    subcontractorTestFile["sfilename"] = Lims_JSON_stringify(selectedRecord.sfilename, false);
                    // subcontractorTestFile["sdescription"] = Lims_JSON_stringify(selectedRecord.sdescription ? selectedRecord.sdescription.trim() : "", false);
                    subcontractorTestFile["nlinkcode"] = transactionStatus.NA;
                    subcontractorTestFile["ssystemfilename"] = selectedRecord.ssystemfilename;
                    subcontractorTestFile["nfilesize"] = selectedRecord.nfilesize;
                    FileArray.push(subcontractorTestFile);
                }
            } else {
                subcontractorTestFile["sfilename"] = Lims_JSON_stringify(selectedRecord.slinkfilename.trim(), false);
                //subcontractorTestFile["sdescription"] = Lims_JSON_stringify(selectedRecord.slinkdescription ? selectedRecord.slinkdescription.trim() : "", false);
                subcontractorTestFile["nlinkcode"] = selectedRecord.nlinkcode.value ? selectedRecord.nlinkcode.value : -1;
                subcontractorTestFile["ssystemfilename"] = "";
                subcontractorTestFile["nfilesize"] = 0;
                FileArray.push(subcontractorTestFile);
            }
            formData.append("isFileEdited", isFileEdited);
            formData.append("subcontractorFile", JSON.stringify(FileArray));
            formData.append("userinfo", JSON.stringify(this.props.Login.userInfo));

            const inputParam = {
                inputData: {
                    "userinfo": {
                        ...this.props.Login.userInfo,
                        sformname: Lims_JSON_stringify(this.props.Login.userInfo.sformname),
                        smodulename: Lims_JSON_stringify(this.props.Login.userInfo.smodulename),
                        slanguagename: Lims_JSON_stringify(this.props.Login.userInfo.slanguagename)
                    }
                },
                formData: formData,
                isFileupload: true,
                operation: "fileattachment",
                classUrl: "subcontracttestdetail",
                saveType, formRef, methodUrl: "updateSubcontractorTestFile",
                selectedRecord: { ...this.state.selectedRecord }
            }
            this.props.saveSubcontractorTestFile(inputParam, this.props.Login.masterData);
        }
        else {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: { loading: false, openModal: false, selectedRecord: {} }
            }
            return this.props.updateStore(updateInfo);
        }
    }

    deleteAttachment = (event, file, fieldName) => {
        let selectedFile = this.state.selectedRecord || {};
        selectedFile[fieldName] = deleteAttachmentDropZone(selectedFile[fieldName], file)
        this.setState({
            selectedFile, actionType: "delete"
        });
    }

    onDropFile = (attachedFiles, fieldName, maxSize, editable) => {
        let selectedRecord = this.state.selectedRecord || {};
        let neditable = 0
        if (neditable != undefined) {
            selectedRecord[editable] = 1;
        }

        selectedRecord[fieldName] = onDropAttachFileList(selectedRecord[fieldName], attachedFiles, maxSize)
        this.setState({ selectedRecord, actionType: "new" });
    }

    componentDidUpdate(previousProps) {

        let { DynamicSampleColumns, DynamicSubSampleColumns } = this.state;

        if (this.props.Login.masterData !== previousProps.Login.masterData) {
            if (this.props.Login.userInfo.nformcode !== previousProps.Login.userInfo.nformcode) {
                const userRoleControlRights = [];
                if (this.props.Login.userRoleControlRights) {
                    this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode] && Object.values(this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode]).map(item =>
                        userRoleControlRights.push(item.ncontrolcode))
                }
                const controlMap = getControlMap(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode)
                let dataState = { skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5,group: [{ field: 'stestname'}] }

                this.setState({
                    userRoleControlRights, controlMap, data: this.props.Login.masterData["SubContractSamples"],
                    dataResult: process(this.props.Login.masterData["SubContractSamples"] || [], dataState), dataState
                });
            }
            else {

                if (this.props.Login.masterData.DynamicDesign && this.props.Login.masterData.DynamicDesign !== previousProps.Login.masterData.DynamicDesign) {

                    const dynamicColumn = JSON.parse(this.props.Login.masterData.DynamicDesign.jsondata.value)
                    DynamicSampleColumns = dynamicColumn.sampledisplayfields ? dynamicColumn.sampledisplayfields : [];
                    DynamicSubSampleColumns = dynamicColumn.subsamplelistitem ? dynamicColumn.subsamplelistitem : [];

                }
                let { dataState } = this.state;
                if (this.props.Login.dataState === undefined && dataState === undefined) {
                    dataState = { skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5,group: [{ field: 'stestname' }] }
                }
                this.setState({
                    DynamicSampleColumns, DynamicSubSampleColumns,
                    data: this.props.Login.masterData["SubContractSamples"], selectedRecord: this.props.Login.selectedRecord,
                    dataResult: this.props.Login.masterData["SubContractSamples"] && process(this.props.Login.masterData["SubContractSamples"], dataState || []), dataState
                });
            }
        }
        else if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord) {
            this.setState({ DynamicSampleColumns, DynamicSubSampleColumns, selectedRecord: this.props.Login.selectedRecord });
        }
    }

    onInputOnChange = (event, optional, editfield) => {

        const selectedRecord = this.state.selectedRecord || {};
        if (editfield != undefined) {
            selectedRecord[editfield] = 1;
        }
        if (event.target.type === 'checkbox') {
            selectedRecord[event.target.name] = event.target.checked === true ? transactionStatus.YES : transactionStatus.NO;
        }
        else if (event.target.type === "radio") {
            selectedRecord[event.target.name] = optional;
        }
        else {
            selectedRecord[event.target.name] = event.target.value;
        }

        this.setState({ selectedRecord });
    }

    onComboChange = (comboData, fieldName, editfield) => {
        const selectedRecord = this.state.selectedRecord || {};
        selectedRecord[fieldName] = comboData;
        if (editfield != undefined) {
            selectedRecord[editfield] = 1;
        }

        this.setState({ selectedRecord });
    }



    reloadData = () => {

        const inputParam = {
            inputData: { "userinfo": this.props.Login.userInfo },
            classUrl: this.props.Login.inputParam.classUrl,
            methodUrl: this.props.Login.inputParam.methodUrl,
            displayName: this.props.Login.displayName,
            userInfo: this.props.Login.userInfo
        };
        this.props.callService(inputParam);
    }

    onSaveClick = (saveType, formRef) => {

        if (this.props.Login.operation == "fileattachment") {
            return this.onSaveSubContractorTestFile(saveType, formRef);
        }
        let inputData = [];
        let dataState = undefined;
        let selectedId = null;
        dataState = this.state.dataState;
        selectedId = this.props.Login.selectedRecord['subcontractortestdetail'].nsubcontractortestdetailcode;


        inputData["userinfo"] = this.props.Login.userInfo;
        inputData["subcontractortestdetail"] = this.state.selectedRecord['subcontractortestdetail'];
        inputData["subcontractortestdetail"]['nsuppliercode'] = this.state.selectedRecord['nsuppliercode'].value;
        inputData["subcontractortestdetail"]['ncontrolleadtime'] = this.state.selectedRecord['nsuppliercode'].item.ncontrolleadtime;
        inputData["subcontractortestdetail"]['nperiodcode'] = this.state.selectedRecord['nsuppliercode'].item.nperiodcode;
        inputData["subcontractortestdetail"]['sremarks'] = this.state.selectedRecord['sremarks'];

        // if (inputData["subcontractordetails"].hasOwnProperty('esignpassword')) {
        //     if (inputData["subcontractordetails"]['esignpassword'] === '') {
        //         delete inputData["subcontractordetails"]['esigncomments']
        //         delete inputData["subcontractordetails"]['esignpassword']
        //     }
        // }


        const inputParam = {
            classUrl: this.props.Login.inputParam.classUrl,
            methodUrl: "updateSubContractSamplesdetails",
            displayName: this.props.Login.inputParam.displayName,
            inputData: inputData, selectedId, dataState,
            operation: this.props.Login.operation, saveType, formRef, searchRef: this.searchRef,
            selectedRecord: { ...this.state.selectedRecord }
        }

        const esignNeeded = showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolCode);
        if (esignNeeded) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData: this.props.Login.masterData },
                    openModal: true, screenName: "IDS_SENDSUBCONTRACTOR",
                    operation: this.props.Login.operation
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.updateSubContractSamplesdetails(inputParam, this.props.Login.masterData, "openModal", "", "");
        }

    }
    validateEsign = () => {
        let modalName = this.props.Login.screenName === this.props.Login.genericLabel["Product"]["jsondata"]["sdisplayname"][this.props.Login.userInfo.slanguagetypecode].concat(" " + this.props.intl.formatMessage({ id: "IDS_FILE" })) ? "openChildModal" : "openModal";
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
        this.props.validateEsignCredential(inputParam, modalName);
    }
    componentWillUnmount() {
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                masterData: [], inputParam: undefined, operation: null, modalName: undefined
            }
        }
        this.props.updateStore(updateInfo);
    }
}



const mapStateToProps = (state) => {
    return {
        Login: state.Login
    }
}
export default connect(mapStateToProps, {
    callService, crudMaster, updateStore, getSubContractorComboService, updateSubContractSamplesdetails,
    updateReceiveSTTSubContractTest, updateReceiveResultSubContractTest, addFile, saveSubcontractorTestFile, viewDetail, viewAttachment
})(injectIntl(SubContractTestDetail));