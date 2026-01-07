import React from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Row, Col } from 'react-bootstrap';
import { process } from '@progress/kendo-data-query';
import { toast } from 'react-toastify';

import AddBarcode from './AddBarcode';
import SlideOutModal from '../../components/slide-out-modal/SlideOutModal';
import Esign from '../audittrail/Esign';
import DataGrid from '../../components/data-grid/data-grid.component';
import { callService, getBarcodeComboService, updateStore, crudMaster, validateEsignCredential, viewAttachment } from '../../actions';
import { DEFAULT_RETURN } from '../../actions/LoginTypes';
import { getControlMap, showEsign, create_UUID, onDropAttachFileList, deleteAttachmentDropZone, Lims_JSON_stringify } from '../../components/CommonScript';
import { transactionStatus } from '../../components/Enumeration';
import { ListWrapper } from '../../components/client-group.styles';

const mapStateToProps = state => {
    return ({ Login: state.Login })
}

class Barcode extends React.Component {

    constructor(props) {
        super(props)
        this.formRef = React.createRef();
        this.extractedColumnList = [];

        const dataState = {
            skip: 0,
            take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5,
        };

        this.state = {
            data: [], masterStatus: "", error: "", selectedRecord: {},
            dataResult: [],
            dataState: dataState,
            //isOpen: false,
            userRoleControlRights: [],
            controlMap: new Map()
        };

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


    closeModal = () => {
        let loadEsign = this.props.Login.loadEsign;
        let openModal = this.props.Login.openModal;
        let selectedRecord = this.props.Login.selectedRecord;
        if (this.props.Login.loadEsign) {
            if (this.props.Login.operation === "delete") {
                loadEsign = false;
                openModal = false;
                selectedRecord = {};
            } else {
                loadEsign = false;
                selectedRecord['esignpassword'] = ""
                selectedRecord['esigncomments'] = ""
            }
        } else {
            openModal = false;
            selectedRecord = {};
        }
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { openModal, loadEsign, selectedRecord }
        }
        this.props.updateStore(updateInfo);
    }

    deleteRecord = (inputData) => {
        const inputParam = {
            classUrl: this.props.Login.inputParam.classUrl,
            methodUrl: this.props.Login.inputParam.methodUrl,
            selectedRecord: {...this.state.selectedRecord},
            inputData: {
                [this.props.Login.inputParam.methodUrl.toLowerCase()]: inputData.selectedRecord,
                "userinfo": this.props.Login.userInfo
            },
            operation: inputData.operation,
            displayName: this.props.Login.inputParam.displayName,
            dataState: this.state.dataState
        }
        const esignNeeded = showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, inputData.ncontrolCode);
        if (esignNeeded) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData: this.props.Login.masterData },
                    openModal: true, screenName: this.props.intl.formatMessage({ id: this.props.Login.inputParam.displayName }),
                    operation: inputData.operation
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.crudMaster(inputParam, this.props.Login.masterData, "openModal");
        }
    }


    closeModal = () => {
        let loadEsign = this.props.Login.loadEsign;
        let openModal = this.props.Login.openModal;
        let selectedRecord = this.props.Login.selectedRecord;
        let selectedId = this.props.Login.selectedId;
        if (this.props.Login.loadEsign) {
            if (this.props.Login.operation === "delete") {
                // selectedRecord['agree'] = 4
                loadEsign = false;
                openModal = false;
                selectedRecord = {}
            } else {
                loadEsign = false;
                selectedRecord.agree = false;
                selectedRecord['esignpassword'] = ""
                selectedRecord['esigncomments'] = ""
                selectedRecord['esignreason'] = ""
            }
        } else {
            openModal = false;
            selectedRecord = {};
            selectedId = null;
        }
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { openModal, loadEsign, selectedRecord, selectedId }
        }
        this.props.updateStore(updateInfo);
    }

    validateEsign = () => {
        const inputParam = {
            inputData: {
                "userinfo": {
                    ...this.props.Login.userInfo,
                    sreason: this.state.selectedRecord["esigncomments"]
                },
                password: this.state.selectedRecord["esignpassword"]
            },
            screenData: this.props.Login.screenData
        }
        this.props.validateEsignCredential(inputParam, "openModal");
    }

    onInputOnChange = (event) => {
        const selectedRecord = this.state.selectedRecord || {};
        if (event.target.type === 'checkbox') {
            selectedRecord[event.target.name] = event.target.checked === true ? 3 : 4;
        }
        else {
            selectedRecord[event.target.name] = event.target.value;
        }

        this.setState({ selectedRecord });
    }


    onComboChange = (comboData, fieldName) => {
        const selectedRecord = this.state.selectedRecord || {};
        selectedRecord[fieldName] = comboData;;

        this.setState({ selectedRecord });
    }


    onDropTestFile = (attachedFiles, fieldName, maxSize) => {
        let selectedRecord = this.state.selectedRecord || {};
        selectedRecord[fieldName] = onDropAttachFileList(selectedRecord[fieldName], attachedFiles, maxSize)
        this.setState({ selectedRecord, actionType: "new" });
    }


    deleteAttachment = (event, file, fieldName) => {
        let selectedRecord = this.state.selectedRecord || {};
        selectedRecord[fieldName] = deleteAttachmentDropZone(selectedRecord[fieldName], file)

        this.setState({
            selectedRecord, actionType: "delete" //fileToDelete:file.name 
        });
    }



    onSaveClick = (saveType, formRef) => {
        //add 
        let inputFileData = { nsitecode: this.props.Login.userInfo.nmastersitecode };
        let editData = {};
        //inputData["userinfo"] = this.props.Login.userInfo;
        let dataState = undefined;
        let selectedId = null;
        // const nattachmenttypecode =  this.state.selectedRecord.nattachmenttypecode;
        const formData = new FormData();
        const selectedRecord = this.state.selectedRecord;
        const acceptedFiles = selectedRecord.sfilename;
        if (this.props.Login.operation === "update") {
            // edit
            dataState = this.state.dataState;
            editData["barcodeFiles"] = JSON.parse(JSON.stringify(this.state.selectedRecord));
            selectedId = this.props.Login.selectedRecord.nbarcode;
        }
        else {
            //add     
            selectedRecord["ssystemfilename"] = "";
        }

        if (acceptedFiles && acceptedFiles.length === 1) {
            acceptedFiles.forEach((file, index) => {
                //const tempData = Object.assign({}, testFile);
                const splittedFileName = file.name.split('.');
                const fileExtension = file.name.split('.')[splittedFileName.length - 1];
                const uniquefilename = this.state.selectedRecord["ssystemfilename"] === "" ? create_UUID() + '.' + fileExtension : selectedRecord.ssystemfilename
                inputFileData["sfilename"] = Lims_JSON_stringify(file.name, false);
                formData.append("uploadedFile" + index, file);
                formData.append("uniquefilename" + index, uniquefilename);


                inputFileData["nquerycode"] = this.state.selectedRecord["nsqlquerycode"] ? this.state.selectedRecord["nsqlquerycode"].value : transactionStatus.NA;
                inputFileData["nbarcode"] = this.state.selectedRecord["nbarcode"] ? this.state.selectedRecord["nbarcode"] : "";
                inputFileData["ncontrolcode"] = this.state.selectedRecord["ncontrolcode"] ? this.state.selectedRecord["ncontrolcode"].value : "";
                inputFileData["nlabelformattypecode"] = this.state.selectedRecord["nlabelformattypecode"] ? this.state.selectedRecord["nlabelformattypecode"].value : "";
                inputFileData["sdescription"] = Lims_JSON_stringify(this.state.selectedRecord["sdescription"] ? this.state.selectedRecord["sdescription"] : "", false);
                inputFileData["sbarcodename"] = Lims_JSON_stringify(this.state.selectedRecord["sbarcodename"] ? this.state.selectedRecord["sbarcodename"] : "", false);
                //inputData["sfilename"] = this.state.selectedRecord["acceptedTestFiles"]? this.state.selectedRecord.acceptedTestFiles[0].name:"";
                inputFileData["ssystemfilename"] = uniquefilename;
                formData.append("filecount", acceptedFiles.length);
            });
        } else {
            inputFileData["nquerycode"] = this.state.selectedRecord["nsqlquerycode"] ? this.state.selectedRecord["nsqlquerycode"].value : transactionStatus.NA;
            inputFileData["nbarcode"] = this.state.selectedRecord["nbarcode"] ? this.state.selectedRecord["nbarcode"] : "";
            inputFileData["ncontrolcode"] = this.state.selectedRecord["ncontrolcode"] ? this.state.selectedRecord["ncontrolcode"].value : "";
            inputFileData["nlabelformattypecode"] = this.state.selectedRecord["nlabelformattypecode"] ? this.state.selectedRecord["nlabelformattypecode"].value : "";
            inputFileData["sdescription"] = Lims_JSON_stringify(this.state.selectedRecord["sdescription"] ? this.state.selectedRecord["sdescription"] : "", false);
            inputFileData["sbarcodename"] = Lims_JSON_stringify(this.state.selectedRecord["sbarcodename"] ? this.state.selectedRecord["sbarcodename"] : "", false);
            inputFileData["sfilename"] = "";
            inputFileData["ssystemfilename"] = "";

        }

        formData.append("barcodeFile", JSON.stringify(inputFileData));


        const inputParam = {
            classUrl: this.props.Login.inputParam.classUrl,
            methodUrl: this.props.Login.inputParam.methodUrl,
            inputData: {
                "userinfo": {
                    ...this.props.Login.userInfo,
                    sformname: Lims_JSON_stringify(this.props.Login.userInfo.sformname),
                    smodulename: Lims_JSON_stringify(this.props.Login.userInfo.smodulename)
                }
            },
            formData: formData,
            editData: editData,
            isFileupload: true,
            operation: this.props.Login.operation,
            displayName: this.props.Login.inputParam.displayName, saveType, formRef, selectedId, dataState,
            selectedRecord: {...this.state.selectedRecord}

        }
        const esignNeeded = showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolCode);
        if (esignNeeded) {
            //inputData["userinfo"]= this.props.Login.userInfo
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData: this.props.Login.masterData },
                    openModal: true, screenName: this.props.intl.formatMessage({ id: this.props.Login.inputParam.displayName }),
                    operation: this.props.Login.operation,
                },

            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.crudMaster(inputParam, this.props.Login.masterData, "openModal");
        }
    }

    viewDownloadFile = (filedata) => {
        let downloadfile = filedata.inputData
        delete downloadfile["userinfo"]
        const inputParam = {
            inputData: {
                downloadfile: downloadfile,
                userinfo: this.props.Login.userInfo
            },
            classUrl: "barcode",
            operation: "view",
            methodUrl: "AttachedDownloadFile",
            screenName: "IDS_BARCODE"
        }
        this.props.viewAttachment(inputParam);
    }




    reloadData = () => {
        const inputParam = {
            inputData: { "userinfo": this.props.Login.userInfo },

            classUrl: this.props.Login.inputParam.classUrl,
            methodUrl: this.props.Login.inputParam.methodUrl,
            userInfo: this.props.Login.userInfo,
            displayName: this.props.Login.inputParam.displayName
        };

        this.props.callService(inputParam);
    }

    render() {
        let primaryKeyField = "";

        if (this.props.Login.inputParam !== undefined) {

            this.extractedColumnList = [
                { "controlType": "textarea", "idsName": "IDS_BARCODENAME", "dataField": "sbarcodename", "width": "150px" },
                { "controlType": "combobox", "idsName": "IDS_QUERY", "dataField": "ssqlqueryname", "width": "150px" },
                { "controlType": "textarea", "idsName": "IDS_DESCRIPTION", "dataField": "sdescription", "width": "200px" },
                { "controlType": "combobox", "idsName": "IDS_CONTROLTYPE", "dataField": "scontrolids", "width": "150px" },
                { "controlType": "combobox", "idsName": "IDS_LABELFORMATTYPE", "dataField": "slabelformattypename", "width": "150px" },
                { "controlType": "textarea", "idsName": "IDS_FILENAME", "dataField": "sfilename", "width": "200px" }
            ]
            primaryKeyField = "nbarcode";
        }
        let mandatoryFields = [];
        mandatoryFields.push(
            { "mandatory": true, "idsName": "IDS_BARCODENAME", "dataField": "sbarcodename", "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
            { "mandatory": true, "idsName": "IDS_QUERY", "dataField": "nsqlquerycode", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
            { "mandatory": true, "idsName": "IDS_CONTROLTYPE", "dataField": "ncontrolcode", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
            { "mandatory": true, "idsName": "IDS_LABELFORMATTYPE", "dataField": "nlabelformattypecode", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
            { "mandatory": true, "idsName": "IDS_BARCODE", "dataField": "sfilename", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },

        )


        const addId = this.props.Login.inputParam && this.state.controlMap.has("Add".concat(this.props.Login.inputParam.methodUrl))
            && this.state.controlMap.get("Add".concat(this.props.Login.inputParam.methodUrl)).ncontrolcode;

        const editID = this.props.Login.inputParam && this.state.controlMap.has("Edit".concat(this.props.Login.inputParam.methodUrl))
            && this.state.controlMap.get("Edit".concat(this.props.Login.inputParam.methodUrl)).ncontrolcode;

        const addParam = {
            screenName: 'IDS_BARCODE', primaryeyField: "nbarcode", primaryKeyValue: undefined,
            operation: "create", inputParam: this.props.Login.inputParam, userInfo: this.props.Login.userInfo, ncontrolCode: addId
        };

        const editParam = {
            screenName: this.props.Login.inputParam && this.props.Login.inputParam.displayName && this.props.intl.formatMessage({ id: this.props.Login.inputParam.displayName }), primaryKeyField: "nbarcode", operation: "update",
            inputParam: this.props.Login.inputParam, userInfo: this.props.Login.userInfo, ncontrolCode: editID
        };

        // const downloadId = this.props.Login.inputParam && this.state.controlMap.has("Edit".concat(this.props.Login.inputParam.methodUrl))
        // && this.state.controlMap.get("Edit".concat(this.props.Login.inputParam.methodUrl)).ncontrolcode;
        const deleteParam = { operation: "delete" };
        const downloadPram = { operation: "download" };

        // const mandatoryFields=[];
        // this.extractedColumnList.forEach(item=>item.mandatory === true ? 
        // mandatoryFields.push(item) :""
        // ); 


        return (<>
            <Row>
                <Col>
                    <ListWrapper className="client-list-content">
                        {/* <PrimaryHeader className="d-flex justify-content-between mb-3">
                                <HeaderName className="header-primary-md">
                                    {this.props.Login.inputParam && this.props.Login.inputParam.displayName ?
                                        <FormattedMessage id={this.props.Login.inputParam.displayName} /> : ""}
                                </HeaderName>
                                <Button className="btn btn-user btn-primary-blue"
                                     hidden={this.props.Login.inputParam && this.state.userRoleControlRights.indexOf(addId) === -1}
                                    onClick={() => this.props.getBarcodeComboService(addParam)}>
                                    <FontAwesomeIcon icon={faPlus} /> {}
                                    <FormattedMessage id="IDS_ADD" defaultMessage='Add' />
                                </Button>
                            </PrimaryHeader> */}

                        {this.state.data ?
                            <DataGrid
                                primaryKeyField={primaryKeyField}
                                selectedId={this.props.Login.selectedId}
                                data={this.state.data}
                                dataResult={this.state.dataResult}
                                dataState={this.state.dataState}
                                dataStateChange={this.dataStateChange}
                                extractedColumnList={this.extractedColumnList}
                                controlMap={this.state.controlMap}
                                userRoleControlRights={this.state.userRoleControlRights}
                                inputParam={this.props.Login.inputParam}
                                userInfo={this.props.Login.userInfo}
                                fetchRecord={this.props.getBarcodeComboService}
                                deleteRecord={this.deleteRecord}
                                reloadData={this.reloadData}
                                editParam={editParam}
                                addRecord={() => this.props.getBarcodeComboService(addParam)}
                                deleteParam={deleteParam}
                                downloadPram={downloadPram}
                                scrollable={"scrollable"}
                                gridHeight={"600px"}
                                //formatMessage={this.props.intl.formatMessage}
                                // isComponent={true}
                                isActionRequired={true}
                                isToolBarRequired={true}
                                pageable={true}
                                viewDownloadFile={this.viewDownloadFile}
                            />
                            : ""}
                    </ListWrapper>
                </Col>
            </Row>

            {this.props.Login.openModal &&
                <SlideOutModal
                    show={this.props.Login.openModal}
                    closeModal={this.closeModal}
                    operation={this.props.Login.operation}
                    inputParam={this.props.Login.inputParam}
                    screenName={this.props.Login.screenName}
                    onSaveClick={this.onSaveClick}
                    esign={this.props.Login.loadEsign}
                    validateEsign={this.validateEsign}
                    masterStatus={this.props.Login.masterStatus}
                    selectedRecord={this.state.selectedRecord || {}}
                    updateStore={this.props.updateStore}
                    mandatoryFields={mandatoryFields}
                    addComponent={this.props.Login.loadEsign ?
                        <Esign
                            operation={this.props.Login.operation}
                            //formatMessage={this.props.intl.formatMessage}
                            onInputOnChange={this.onInputOnChange}
                            inputParam={this.props.Login.inputParam}
                            selectedRecord={this.state.selectedRecord || {}}
                        />
                        : <AddBarcode
                            selectedRecord={this.props.Login.selectedRecord || {}}
                            onInputOnChange={this.onInputOnChange}
                            onComboChange={this.onComboChange}
                            //formatMessage={this.props.intl.formatMessage}
                            barcodeData={this.props.Login.barcodeData}
                            queryMapList={this.props.Login.queryMapList}
                            controlMapList={this.props.Login.controlMapList}
                            labelFormatTypeList={this.props.Login.labelFormatTypeList}
                            operation={this.props.Login.operation}
                            inputParam={this.props.Login.inputParam}
                            onDropTestFile={this.onDropTestFile}
                            deleteAttachment={this.deleteAttachment}
                            actionType={this.state.actionType}

                        />}
                />
            }

        </>);
    }

    componentDidUpdate(previousProps) {
        if (this.props.Login.masterData !== previousProps.Login.masterData) {
            if (this.props.Login.userInfo.nformcode !== previousProps.Login.userInfo.nformcode) {
                const userRoleControlRights = [];
                if (this.props.Login.userRoleControlRights) {
                    this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode] && Object.values(this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode]).map(item =>
                        userRoleControlRights.push(item.ncontrolcode))
                }
                const controlMap = getControlMap(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode)
                this.setState({
                    userRoleControlRights, controlMap, data: this.props.Login.masterData,
                    dataResult: process(this.props.Login.masterData, this.state.dataState),
                });
            }
            else {
                let { dataState } = this.state;
                if (this.props.Login.dataState === undefined) {
                    dataState = { skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5 }
                }

                this.setState({
                    data: this.props.Login.masterData,
                    isOpen: false,
                    selectedRecord: this.props.Login.selectedRecord,
                    dataResult: process(this.props.Login.masterData, dataState),
                    dataState
                });
            }
        } else if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord) {
            this.setState({ selectedRecord: this.props.Login.selectedRecord });
        }
    }
}
export default connect(mapStateToProps, { callService, getBarcodeComboService, updateStore, crudMaster, validateEsignCredential, viewAttachment })(injectIntl(Barcode));
