import React, { Component } from 'react';
import { Row, Col, Card, Tab, Nav } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import { FormattedMessage } from 'react-intl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { process } from '@progress/kendo-data-query';
import SlideOutModal from '../../components/slide-out-modal/SlideOutModal';
import { DEFAULT_RETURN } from '../../actions/LoginTypes';
import { showEsign, validateEmail, validatePhoneNumber, onDropAttachFileList, create_UUID, deleteAttachmentDropZone, Lims_JSON_stringify } from '../../components/CommonScript';
import Esign from '../audittrail/Esign';
import { transactionStatus, attachmentType } from '../../components/Enumeration';
import CustomAccordion from '../../components/custom-accordion/custom-accordion.component';
import ClientTabsAccordion from './ClientTabsAccordion';
import { toast } from 'react-toastify';
import ConfirmMessage from '../../components/confirm-alert/confirm-message.component';
import AddClientContact from './AddClientContact';
import AddClientSite from './AddClientSite';
import AddClientFile from './AddClientFile';
import CustomTabs from '../../components/custom-tabs/custom-tabs.component';
import ClientFileTab from './ClientFileTabs';

class ClientSiteAddressTab extends Component {
    constructor(props) {
        super(props);

        const dataState = {
            skip: 0,
            take: this.props.settings ? parseInt(this.props.settings[14]) : 5
        };
        this.state = {
            isSiteOpen: false, isContactOpen: false, siteSelectedRecord: {}, contactSelectedRecord: {}, dataResult: [],
            dataState: dataState, ClientContact: this.props.masterData.ClientContact, Country: [],
            SiteCode: this.props.masterData.SiteCode, selectedRecord: {}, countryCode: [],

        };
        this.ContactColumns = [{ "idsName": "IDS_CLIENTCONTACTNAME", "mandatory": true, "dataField": "scontactname", "width": "150px", "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
        { dataField: "semail", idsName: "IDS_EMAILID", "width": "150px", "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
        { dataField: "sdefaultContact", idsName: "IDS_DEFAULT", "width": "150px", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" }


        ];

        this.siteColumns = [{ "idsName": "IDS_CLIENTSITENAME", "mandatory": true, "dataField": "sclientsitename", "width": "150px", "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
        { "idsName": "IDS_ADDRESS1", "mandatory": true, "dataField": "saddress1", "width": "150px", "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
        { "idsName": "IDS_COUNTRYNAME", "mandatory": true, "dataField": "ncountrycode", "width": "150px", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" }

        ];
        this.detailedFieldList = [
            { "dataField": "sphoneno", "idsName": "IDS_PHONE", columnSize: "4" },
            { "idsName": "IDS_MOBILE", "dataField": "smobileno", columnSize: "4" },
            { dataField: "sfaxno", idsName: "IDS_FAX", columnSize: "4" },
            { dataField: "scomments", idsName: "IDS_COMMENTS", columnSize: "12" }

        ];
        this.confirmMessage = new ConfirmMessage();
    }
    dataStateChange = (event) => {
        this.setState({
            dataResult: process(this.state.ClientContact, event.dataState),
            dataState: event.dataState
        });
    }
    openModalContact = (input) => {
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                openChildModal: true, operation: input.operation,
                selectedRecord: { "ndefaultstatus": transactionStatus.NO },
                defaultSite: undefined, ncontrolCode: input.ncontrolCode,
                screenName: "IDS_CLIENTCONTACT", loading: false
            }
        }
        this.props.updateStore(updateInfo);
    }
    render() {

        const addClientSiteId = this.props.controlMap.has("AddClientSite") && this.props.controlMap.get("AddClientSite").ncontrolcode
        let mandatoryFields = [];
        if (this.props.screenName === "IDS_CLIENTSITE") {
            this.siteColumns.forEach(item => item.mandatory === true ?
                mandatoryFields.push(item) : ""
            );
        }
        else if (this.props.screenName === "IDS_CLIENTCONTACT") {
            this.ContactColumns.forEach(item => item.mandatory === true ?
                mandatoryFields.push(item) : ""
            );
        } else {
            if (this.state.selectedRecord && this.state.selectedRecord.nattachmenttypecode === attachmentType.LINK) {
                mandatoryFields = [
                    { "idsName": "IDS_FILENAME", "dataField": "slinkfilename", "mandatory": true, "mandatoryLabel": "IDS_CHOOSE", "controlType": "file" },
                    { "idsName": "IDS_LINKNAME", "dataField": "nlinkcode", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" }
                ];
            } else {
                // if (this.props.operation !== 'update') {
                mandatoryFields = [{ "idsName": "IDS_FILE", "dataField": "sfilename", "mandatory": true, "mandatoryLabel": "IDS_CHOOSE", "controlType": "file" }];
                // }
            }
        }
        return (
            <>
                {/* <Row className="no-gutters">
                    <Col md={12}>
                        <Card className="at-tabs">
                            <CustomTabs tabDetail={this.tabDetail()} onTabChange={this.onTabChange} />
                        </Card>
                    </Col>
                </Row> */}
                <Row noGutters={true}>
                    <Col md='12'>
                        <Card className="at-tabs">
                            <Tab.Content>
                                <Tab.Pane aria-labelledby="Version-tab" className="p-0 active show">

                                    <Row className="no-gutters pt-2 pb-2 col-12 text-right border-bottom" >
                                        <Col md={12}>
                                            <div className="d-flex justify-content-end">
                                                <Nav.Link className="add-txt-btn" hidden={this.props.userRoleControlRights.indexOf(addClientSiteId) === -1}
                                                    onClick={() => this.props.getClientSiteForAddEdit("ClientSite", "create", this.props.masterData.selectedClient.nclientcode, undefined, addClientSiteId, this.props.userInfo)}>
                                                    <FontAwesomeIcon icon={faPlus} /> { }
                                                    <FormattedMessage id='IDS_CLIENTSITE' defaultMessage='Site' />
                                                </Nav.Link>
                                            </div>
                                        </Col>

                                    </Row>

                                    <Row className="no-gutters">
                                        <Col md={12}>
                                            {this.props.masterData.ClientSite && this.props.masterData.ClientSite.length > 0 ?
                                                <CustomAccordion key="filter"
                                                    accordionTitle={"sclientsitename"}
                                                    accordionComponent={this.clientSiteAccordion(this.props.masterData.ClientSite)}
                                                    inputParam={{ masterData: this.props.masterData, userInfo: this.props.userInfo }}
                                                    accordionClick={this.props.getClientSiteContactDetails}
                                                    accordionPrimaryKey={"nclientsitecode"}
                                                    accordionObjectName={"clientSite"}
                                                    selectedKey={this.props.masterData.selectedClientSite.nclientsitecode}
                                                />
                                                : ""}
                                        </Col>
                                    </Row>

                                </Tab.Pane >
                            </Tab.Content >
                        </Card >
                    </Col >
                </Row >

                <>
                    {this.props.openChildModal &&
                        <SlideOutModal show={this.props.openChildModal}
                            closeModal={this.closeModal}
                            operation={this.props.operation}
                            inputParam={this.props.inputParam}
                            screenName={this.props.screenName}
                            //ATE234 janakumar ALPD-5546All Master screen -> Copy & File remove the save&continue
                            showSaveContinue={ this.props.screenName==="IDS_CLIENTFILE"?false:true}
                            onSaveClick={this.onSaveClick}
                            updateStore={this.props.updateStore}
                            esign={this.props.loadEsign}
                            validateEsign={this.validateEsign}
                            selectedRecord={this.state.selectedRecord || {}}
                            mandatoryFields={mandatoryFields}
                            addComponent={this.props.loadEsign ?
                                <Esign operation={this.props.operation}
                                    onInputOnChange={this.onInputOnChange}
                                    inputParam={this.props.inputParam}
                                    selectedRecord={this.state.selectedRecord || {}}
                                /> :
                                this.props.screenName === "IDS_CLIENTSITE" ?
                                    <AddClientSite selectedRecord={this.state.selectedRecord || {}}
                                        onInputOnChange={this.onInputOnChange}
                                        onComboChange={this.onComboChange}
                                        Country={this.props.Country || []}
                                    //inputParam={this.props.inputParam}
                                    /> :
                                    this.props.screenName === "IDS_CLIENTCONTACT" ?
                                        <AddClientContact
                                            selectedRecord={this.state.selectedRecord || {}}
                                            onInputOnChange={this.onInputOnChange}
                                            onComboChange={this.onComboChange}
                                        />
                                        : <AddClientFile
                                            selectedRecord={this.state.selectedRecord || {}}
                                            onInputOnChange={this.onInputOnChange}
                                            onDrop={this.onDropClientFile}
                                            onDropAccepted={this.onDropAccepted}
                                            deleteAttachment={this.deleteAttachment}
                                            actionType={this.state.actionType}
                                            onComboChange={this.onComboChange}
                                            linkMaster={this.props.linkMaster}
                                            editFiles={this.props.editFiles}
                                            maxSize={20}
                                            // maxFiles={this.props.operation === "update" ? 1 : 3}
                                            // multiple={this.props.operation === "update" ? false : true}
                                            maxFiles={1}
                                            multiple={false}
                                            label={this.props.intl.formatMessage({ id: "IDS_CLIENTFILE" })}
                                            name="clientfilename"
                                            settings={this.props.settings}
                                        />
                            }
                        />

                    }

                </>
            </>
        );
    }

    // onTabChange = (tabProps) => {
    //     const screenName = tabProps.screenName;
    //     const updateInfo = {
    //         typeName: DEFAULT_RETURN,
    //         data: { screenName }
    //     }
    //     this.props.updateStore(updateInfo);
    // }
    onDropClientFile = (attachedFiles, fieldName, maxSize) => {

        let selectedRecord = this.state.selectedRecord || {};
        selectedRecord[fieldName] = onDropAttachFileList(selectedRecord[fieldName], attachedFiles, maxSize)
        this.setState({ selectedRecord, actionType: "new" });
    }
    // tabDetail =     () => {

    //     const tabMap = new Map();
    //     tabMap.set("IDS_CLIENTSITE&CONTACT",
    //     <ClientTabsAccordion
    //     userRoleControlRights={this.props.userRoleControlRights}
    //     controlMap={this.props.controlMap}
    //     inputParam={this.props.inputParam}
    //     userInfo={this.props.userInfo}
    //     masterData={this.props.masterData}
    //     clientSite={this.props.masterData.selectedClientSite}
    //     ClientContact={this.props.masterData.ClientContact}
    //     dataStateChange={(event) => this.setState({ dataState: event.dataState })}
    //     dataState={(this.props.screenName === undefined ||"Client Site&Contact" ) ? this.state.dataState : { skip: 0 }}
    //     screenName="Client Site&Contact"
    //     getClientSiteForAddEdit={this.props.getClientSiteForAddEdit}
    //     getClientSiteContactDetails={this.props.getClientSiteContactDetails}
    //     clientSiteAccordion={this.clientSiteAccordion}
    //     />)
    //     tabMap.set("IDS_FILE",
    //         <ClientFileTab
    //             controlMap={this.props.controlMap}
    //             userRoleControlRights={this.props.userRoleControlRights}
    //             userInfo={this.props.userInfo}
    //             inputParam={this.props.inputParam}
    //             deleteRecord={this.DeleteContact}
    //             clientFile={this.props.masterData.clientFile || []}
    //             getAvailableData={this.props.getAvailableData}
    //             addClientFile={this.props.addClientFile}
    //             viewClientFile={this.viewClientFile}
    //             defaultRecord={this.defaultRecord}
    //             screenName="Client File"
    //             settings={this.props.settings}
    //         />);
    //     return tabMap;
    // }

    viewClientFile = (filedata) => {
        const inputParam = {
            inputData: {
                clientfile: filedata,
                userinfo: this.props.userInfo
            },
            classUrl: "client",
            operation: "view",
            methodUrl: "AttachedClientFile",
            screenName: "Client File"
        }
        this.props.viewAttachment(inputParam);
    }


    clientSiteAccordion = (clientSite) => {
        let primaryKeyField = "nclientcontactcode";
        const addClientContactId = this.props.controlMap.has("AddClientContact") && this.props.controlMap.get("AddClientContact").ncontrolcode
        const editClientContactId = this.props.controlMap.has("EditClientContact") && this.props.controlMap.get("EditClientContact").ncontrolcode;
        const editContactParam = {
            screenName: "ClientContactInfo", primaryKeyField: "nclientcontactcode", operation: "update",
            inputParam: this.props.inputParam, userInfo: this.props.userInfo, ncontrolCode: editClientContactId
        };
        const AddContactParam = {
            screenName: "ClientContactInfo", primaryKeyField, undefined, operation: "create",
            inputParam: this.props.inputParam, userInfo: this.props.userInfo, ncontrolCode: addClientContactId
        };

        const accordionMap = new Map();
        clientSite.map((clientSite) =>
            accordionMap.set(clientSite.nclientsitecode,
                <ClientTabsAccordion clientSite={clientSite}
                    getClientSiteForAddEdit={this.props.getClientSiteForAddEdit}
                    masterData={this.props.masterData}
                    ConfirmDelete={this.ConfirmDelete}
                    addClientContactId={addClientContactId}
                    AddContactParam={AddContactParam}
                    openModalContact={this.openModalContact}
                    // tabDetail={this.tabDetail(userSite)}   

                    primaryKeyField={primaryKeyField}
                    expandField="expanded"
                    detailedFieldList={this.detailedFieldList}
                    extractedColumnList={this.ContactColumns}
                    inputParam={this.props.inputParam}
                    userInfo={this.props.userInfo}
                    data={this.state.ClientContact || []}
                    ClientContact={this.state.ClientContact || []}
                    dataState={this.state.dataState}
                    dataStateChange={this.dataStateChange}
                    controlMap={this.props.controlMap}
                    userRoleControlRights={this.props.userRoleControlRights || []}
                    methodUrl="ClientContact"
                    getClientContactForAddEdit={this.props.getClientContactForAddEdit}
                    editParam={editContactParam}
                    deleteParam={{ operation: "delete", screenName: "IDS_CLIENTCONTACT" }}
                    deleteRecord={this.DeleteContact}
                    scrollable={"scrollable"}
                    isActionRequired={true}
                    selectedId={this.props.selectedId}
                    hasDynamicColSize={true}
                    screenName={"IDS_CLIENTCONTACT"}
                />
            )
        )
        return accordionMap;
    }

    ConfirmDelete = (obj) => {
        this.confirmMessage.confirm("deleteMessage", this.props.intl.formatMessage({ id: "IDS_DELETE" }), this.props.intl.formatMessage({ id: "IDS_DEFAULTCONFIRMMSG" }),
            this.props.intl.formatMessage({ id: "IDS_OK" }), this.props.intl.formatMessage({ id: "IDS_CANCEL" }),
            () => this.Delete(obj));
    }

    onInputOnChange = (event, optional) => {

        const selectedRecord = this.state.selectedRecord || {};
        if (event.target.type === 'checkbox') {
            if (event.target.name === 'ntransactionstatus') {
                selectedRecord[event.target.name] = event.target.checked === true ? transactionStatus.ACTIVE : transactionStatus.DEACTIVE;
            }
            else
                if (event.target.name === "agree") {
                    selectedRecord[event.target.name] = event.target.checked === true ? transactionStatus.YES : transactionStatus.NO;
                }
                else {
                    selectedRecord[event.target.name] = event.target.checked === true ? transactionStatus.YES : transactionStatus.NO;
                }

        }
        else if (event.target.type === 'radio') {
            selectedRecord[event.target.name] = optional;
        }

        else {

            if (event.target.name === "sphoneno" || event.target.name === "smobileno"
                || event.target.name === "sfaxno") {

                if (event.target.value !== "") {
                    event.target.value = validatePhoneNumber(event.target.value);
                    selectedRecord[event.target.name] = event.target.value !== "" ? event.target.value : selectedRecord[event.target.name];
                }
                else {
                    selectedRecord[event.target.name] = event.target.value
                }
            }
            else {
                selectedRecord[event.target.name] = event.target.value;
            }
            // selectedRecord[event.target.name] = event.target.value;
        }
        this.setState({ selectedRecord });
    }
    onComboChange = (comboData, fieldName) => {
        if (comboData !== null) {
            const selectedRecord = this.state.selectedRecord || {};
            selectedRecord[fieldName] = comboData;//.value;

            this.setState({ selectedRecord });
        }

    }
    closeModal = () => {
        let loadEsign = this.props.loadEsign;
        let openChildModal = this.props.openChildModal;
        let selectedRecord = this.props.selectedRecord;
        if (this.props.loadEsign) {
            if (this.props.operation === "delete") {
                loadEsign = false;
                openChildModal = false;
                selectedRecord = {};

            }
            else {
                loadEsign = false;
                selectedRecord['esignpassword'] = ""
                selectedRecord['esigncomments'] = ""
                selectedRecord['esignreason'] = ""
            }
        }
        else {
            openChildModal = false;
            selectedRecord = {};
        }

        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { openChildModal, loadEsign, selectedRecord, selectedId: null }
        }
        this.props.updateStore(updateInfo);

    }

    onSaveClick = (saveType, formRef) => {
        if (this.state.selectedRecord['semail'] ? validateEmail(this.state.selectedRecord['semail']) : true) {
            let inputParam = {};
            let clearSelectedRecordField =[];
            if (this.props.screenName === "IDS_CLIENTSITE") {
                inputParam = this.SaveSiteDetails(saveType, formRef);
                clearSelectedRecordField =[
                    { "idsName": "IDS_CLIENTSITENAME", "dataField": "sclientsitename", "width": "200px" ,"controlType": "textbox","isClearField":true},
                    { "idsName": "IDS_ADDRESS1", "dataField": "saddress1", "width": "200px","controlType": "textbox","isClearField":true },
                    { "idsName": "IDS_ADDRESS2", "dataField": "saddress2", "width": "200px","controlType": "textbox","isClearField":true },
                    { "idsName": "IDS_ADDRESS3", "dataField": "saddress3", "width": "200px","controlType": "textbox","isClearField":true },
                    
                    
                    { "idsName": "IDS_DEFAULT", "dataField": "ndefaultstatus", "width": "100px","isClearField":true,"preSetValue":4},
                ]
            }
            else if (this.props.screenName === "IDS_CLIENTCONTACT") {

                inputParam = this.SaveContactInfo(saveType, formRef);

                clearSelectedRecordField =[
                    { "idsName": "IDS_CLIENTCONTACTNAME", "dataField": "scontactname", "width": "200px" ,"controlType": "textbox","isClearField":true},
                    { "idsName": "IDS_PHONE", "dataField": "sphoneno", "width": "200px","controlType": "textbox","isClearField":true },
                    { "idsName": "IDS_MOBILE", "dataField": "smobileno", "width": "200px","controlType": "textbox","isClearField":true },
                    { "idsName": "IDS_FAX", "dataField": "sfaxno", "width": "200px","controlType": "textbox","isClearField":true },
                    { "idsName": "IDS_EMAILID", "dataField": "semail", "width": "200px","controlType": "textbox","isClearField":true },
                    { "idsName": "IDS_COMMENTS", "dataField": "scomments", "width": "200px","controlType": "textbox","isClearField":true },
                    { "idsName": "IDS_DEFAULT", "dataField": "ndefaultstatus", "width": "100px","isClearField":true,"preSetValue":4},
                ]

                
            } else {
                inputParam = this.saveClientFile(saveType, formRef);

                clearSelectedRecordField =[
                    { "idsName": "IDS_FILENAME", "dataField": "slinkfilename", "width": "200px" ,"controlType": "textbox","isClearField":true},
                    { "idsName": "IDS_DESCRIPTION", "dataField": "sdescription", "width": "200px","controlType": "textbox","isClearField":true },
                    { "idsName": "IDS_DESCRIPTION", "dataField": "slinkdescription", "width": "200px","controlType": "textbox","isClearField":true },
                ]

            }

            if (showEsign(this.props.esignRights, this.props.userInfo.nformcode, this.props.ncontrolCode)) {
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        loadEsign: true, screenData: { inputParam, masterData: this.props.masterData }, saveType
                    }
                }
                this.props.updateStore(updateInfo);
            }
            else {
                this.props.crudMaster(inputParam, this.props.masterData, "openChildModal","","",clearSelectedRecordField);
            }
        }
        else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_ENTERVALIDEMAIL" }));
        }
    }
    SaveSiteDetails(saveType, formRef) {
        let inputData = [];
        let postParam = undefined;
        inputData["userinfo"] = this.props.userInfo;
        let fieldList = ["nclientsitecode", "ncountrycode", "sclientsitename",
            "saddress1", "saddress2", "saddress3", "ndefaultstatus"];

        if (this.props.operation === "update") {
            postParam = {
                inputListName: "ClientSiteAddress",
                selectedObject: "selectedClientSite",
                primaryKeyField: "nclientsitecode",
            };
            inputData["clientsiteaddress"] = {
                "nclientcode": this.props.masterData.selectedClient.nclientcode,
                "nclientsitecode": this.props.masterData.selectedClientSite.nclientsitecode
            };
            fieldList.map(item => {
                if (item === "ncountrycode") {
                    return inputData["clientsiteaddress"][item] = this.state.selectedRecord[item] ? this.state.selectedRecord[item].value : "";
                }
                else {
                    return inputData["clientsiteaddress"][item] = this.state.selectedRecord[item] ? this.state.selectedRecord[item] : "";
                }
            })
        }
        else {

            inputData["clientsiteaddress"] = { "nclientcode": this.props.masterData.selectedClient.nclientcode };

            fieldList.map(item => {
                if (item === "ncountrycode") {
                    return inputData["clientsiteaddress"][item] = this.state.selectedRecord[item].value
                }
                else {
                    return inputData["clientsiteaddress"][item] = this.state.selectedRecord[item]
                }
            })
        }
        const inputParam = {
            classUrl: this.props.inputParam.classUrl,
            methodUrl: "ClientSiteAddress",
            inputData: inputData,
            operation: this.props.operation, saveType, formRef,
            postParam: postParam,
            selectedRecord:{...this.state.selectedRecord}
        }
        return inputParam;
        //this.props.crudMaster(inputParam, this.props.masterData);
    }
    SaveContactInfo(saveType, formRef) {

        let dataState = undefined;
        let inputData = [];
        let postParam = undefined;
        inputData["userinfo"] = this.props.userInfo;
        let fieldList = ["nclientcontactcode", "scontactname",
            "sphoneno", "smobileno", "semail", "sfaxno", "scomments", "ndefaultstatus"];

        let selectedId = null;
        if (this.props.operation === "update") {
            postParam = {
                inputListName: "ClientContactInfo",
                selectedObject: "selectedClientContact",
                primaryKeyField: "nclientcontactcode",
            };
            inputData["clientcontactinfo"] = {
                "nclientcode": this.props.masterData.selectedClient.nclientcode,
                "nclientsitecode": this.props.masterData.selectedClientSite.nclientsitecode
            };

            selectedId = this.props.selectedRecord.nclientcontactcode;

            fieldList.map(item => {
                return inputData["clientcontactinfo"][item] = this.state.selectedRecord[item] ? this.state.selectedRecord[item] : "";
            })
            dataState = this.state.dataState;
        }
        else {

            inputData["clientcontactinfo"] = {
                "nclientcode": this.props.masterData.selectedClient.nclientcode,
                "nclientsitecode": this.props.masterData.selectedClientSite.nclientsitecode
            };
            fieldList.map(item => {
                return inputData["clientcontactinfo"][item] = this.state.selectedRecord[item] ? this.state.selectedRecord[item] : "";
            })
            inputData["clientcontactinfo"]['ndefaultstatus'] = this.state.selectedRecord && this.state.selectedRecord.ndefaultstatus ?
                this.state.selectedRecord.ndefaultstatus
                : transactionStatus.YES

        }
        const inputParam = {
            classUrl: this.props.inputParam.classUrl,
            methodUrl: "ClientContactInfo",
            inputData: inputData, selectedId,
            operation: this.props.operation, saveType, formRef, dataState,
            postParam: postParam,
            selectedRecord:{...this.state.selectedRecord}

        }
        return inputParam;

    }
    saveClientFile = (saveType, formRef) => {
        const selectedRecord = this.state.selectedRecord;
        const acceptedFiles = selectedRecord.sfilename;
        const nattachmenttypecode = selectedRecord.nattachmenttypecode;
        let isFileEdited = transactionStatus.NO;
        let clientFileArray = [];
        let clientFile = {
            nclientcode: this.props.masterData.selectedClient.nclientcode,
            nclientfilecode: selectedRecord.nclientfilecode ? selectedRecord.nclientfilecode : 0,
            nstatus: transactionStatus.ACTIVE,
            nattachmenttypecode,
            // ndefaultstatus: selectedRecord[nattachmenttypecode === attachmentType.LINK ? "nlinkdefaultstatus" : "ndefaultstatus"] ? selectedRecord[nattachmenttypecode === attachmentType.LINK ? "nlinkdefaultstatus" : "ndefaultstatus"] : 4
        };
        const formData = new FormData();
        if (nattachmenttypecode === attachmentType.FTP) {
            if (acceptedFiles && Array.isArray(acceptedFiles) && acceptedFiles.length > 0) {
                acceptedFiles.forEach((file, index) => {
                    const tempData = Object.assign({}, clientFile);
                    const splittedFileName = file.name.split('.');
                    const fileExtension = file.name.split('.')[splittedFileName.length - 1];
                    const ssystemfilename = selectedRecord.ssystemfilename ? selectedRecord.ssystemfilename.split('.') : "";
                    const filesystemfileext = selectedRecord.ssystemfilename ? file.name.split('.')[ssystemfilename.length - 1] : "";
                    const uniquefilename = nattachmenttypecode === attachmentType.FTP ? selectedRecord.nclientfilecode && selectedRecord.nclientfilecode > 0
                        && selectedRecord.ssystemfilename !== "" && selectedRecord.ssystemfilename !== undefined ? ssystemfilename[0] + '.' + filesystemfileext : create_UUID() + '.' + fileExtension : "";
                    tempData["sfilename"] = Lims_JSON_stringify(file.name.trim(), false);
                    tempData["sdescription"] = Lims_JSON_stringify(selectedRecord.sdescription ? selectedRecord.sdescription.trim() : "", false);
                    tempData["nlinkcode"] = transactionStatus.NA;
                    tempData["ssystemfilename"] = uniquefilename;
                    tempData["nfilesize"] = file.size;
                    formData.append("uploadedFile" + index, file);
                    formData.append("uniquefilename" + index, uniquefilename);
                    clientFileArray.push(tempData);
                });
                formData.append("filecount", acceptedFiles.length);
                isFileEdited = transactionStatus.YES;
            } else {
                clientFile["sfilename"] = Lims_JSON_stringify(selectedRecord.sfilename, false);
                clientFile["sdescription"] = Lims_JSON_stringify(selectedRecord.sdescription ? selectedRecord.sdescription.trim() : "", false);
                clientFile["nlinkcode"] = transactionStatus.NA;
                clientFile["ssystemfilename"] = selectedRecord.ssystemfilename;
                clientFile["nfilesize"] = selectedRecord.nfilesize;
                clientFileArray.push(clientFile);
            }
        } else {
            clientFile["sfilename"] = Lims_JSON_stringify(selectedRecord.slinkfilename.trim(), false);
            clientFile["sdescription"] = Lims_JSON_stringify(selectedRecord.slinkdescription ? selectedRecord.slinkdescription.trim() : "", false);
            clientFile["nlinkcode"] = selectedRecord.nlinkcode.value ? selectedRecord.nlinkcode.value : -1;
            clientFile["ssystemfilename"] = "";
            clientFile["nfilesize"] = 0;
            clientFileArray.push(clientFile);
        }
        formData.append("isFileEdited", isFileEdited);
        formData.append("clientfile", JSON.stringify(clientFileArray));
        // formData.append("userinfo", JSON.stringify(this.props.userInfo));



        let selectedId = null;
        let postParam = undefined;
        if (this.props.operation === "update") {
            // edit
            postParam = { inputListName: "Client", selectedObject: "selectedClient", primaryKeyField: "nclientcode" };
            selectedId = selectedRecord["nclientfilecode"];
        }
        const inputParam = {
            inputData: {
                "userinfo": {
                    ...this.props.userInfo,
                    sformname: Lims_JSON_stringify(this.props.userInfo.sformname),
                    smodulename: Lims_JSON_stringify(this.props.userInfo.smodulename),
                       //ALPD-1620(while saving the file and link,audit trail is not captured the respective language)
                    slanguagename: Lims_JSON_stringify(this.props.userInfo.slanguagename)
                }
            },
            formData: formData,
            isFileupload: true,
            operation: this.props.operation,
            classUrl: "client",
            saveType, formRef, methodUrl: "ClientFile", postParam,
            selectedRecord:{...this.state.selectedRecord}

        }
        return inputParam;
    }
    DeleteContact = (deleteParam) => {
        let inputData = [];
        let inputParam = {};
        if (deleteParam.selectedRecord.expanded !== undefined) {
            delete deleteParam.selectedRecord.expanded
        }
        if (deleteParam.screenName === "IDS_CLIENTCONTACT") {
            inputData["clientcontactinfo"] = deleteParam.selectedRecord;
            inputData["userinfo"] = this.props.userInfo;
            inputParam = {
                methodUrl: "ClientContactInfo",
                classUrl: this.props.inputParam.classUrl,
                inputData: inputData,
                operation: "delete",
                dataState: this.state.dataState
            }
        } else {
            inputParam = {
                classUrl: "client",
                methodUrl: deleteParam.methodUrl,
                inputData: {
                    [deleteParam.methodUrl]: deleteParam.selectedRecord,
                    "userinfo": this.props.userInfo,

                },
                operation: deleteParam.operation,
                dataState: this.state.dataState
            }
        }
        if (showEsign(this.props.esignRights, this.props.userInfo.nformcode, deleteParam.ncontrolCode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData: this.props.masterData },
                    openChildModal: true, screenName: "Contact", operation: "delete"
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            if (showEsign(this.props.userRoleControlRights, this.props.userInfo.nformcode, deleteParam.ncontrolCode)) {
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        loadEsign: true, screenData: { inputParam, masterData: this.props.masterData },
                        openChildModal: true, screenName: "Contact", operation: "delete"
                    }
                }
                this.props.updateStore(updateInfo);
            }
            else {
                this.props.crudMaster(inputParam, this.props.masterData, "openChildModal");
            }
        }
    }
    Delete = (deleteParam) => {
        let inputData = [];
        if (deleteParam.selectedRecord.expanded && deleteParam.selectedRecord.expanded !== undefined) {
            delete deleteParam.selectedRecord.expanded
        }
        inputData[deleteParam.Type] = deleteParam.selectedRecord;
        inputData["userinfo"] = this.props.userInfo;
        const inputParam = {
            methodUrl: deleteParam.methodURL,
            classUrl: this.props.inputParam.classUrl,
            inputData: inputData,
            operation: "delete"
        }
        if (showEsign(this.props.esignRights, this.props.userInfo.nformcode, deleteParam.ncontrolCode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData: this.props.masterData },
                    openChildModal: true, screenName: deleteParam.screenName, operation: deleteParam.operation
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            if (showEsign(this.props.userRoleControlRights, this.props.userInfo.nformcode, deleteParam.ncontrolCode)) {
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        loadEsign: true, screenData: { inputParam, masterData: this.props.masterData },
                        openChildModal: true, screenName: deleteParam.screenName, operation: deleteParam.operation
                    }
                }
                this.props.updateStore(updateInfo);
            }
            else {
                this.props.crudMaster(inputParam, this.props.masterData, "openChildModal");
            }
        }
    }

    componentDidUpdate(previousProps) {
        if (this.props.masterData !== previousProps.masterData) {

            let { dataState } = this.state;
            if (this.props.dataState === undefined) {
                dataState = { skip: 0, take: this.props.settings ? parseInt(this.props.settings[14]) : 5 }
            }

            this.setState({
                isSiteOpen: false, isContactOpen: false,
                ClientContact: this.props.masterData.ClientContact,
                SiteCode: this.props.masterData.SiteCode, Country: this.props.masterData.Country, dataState

            });
        }

        if (this.props.selectedRecord !== previousProps.selectedRecord) {
            this.setState({ selectedRecord: this.props.selectedRecord });
        }
    }
    deleteAttachment = (event, file, fieldName) => {
        let selectedRecord = this.state.selectedRecord || {};
        selectedRecord[fieldName] = deleteAttachmentDropZone(selectedRecord[fieldName], file)

        this.setState({
            selectedRecord, actionType: "delete" //fileToDelete:file.name 
        });
    }
    validateEsign = () => {
        const inputParam = {
            inputData: {
                "userinfo": {
                    ...this.props.userInfo,
                    sreason: this.state.selectedRecord["esigncomments"],
                    nreasoncode: this.state.selectedRecord["esignreason"] && this.state.selectedRecord["esignreason"].value,
                    spredefinedreason: this.state.selectedRecord["esignreason"] && this.state.selectedRecord["esignreason"].label,

                },
                password: this.state.selectedRecord["esignpassword"]
            },
            screenData: this.props.screenData
        }
        this.props.validateEsignCredential(inputParam, "openChildModal");
    }
}
export default (injectIntl(ClientSiteAddressTab));