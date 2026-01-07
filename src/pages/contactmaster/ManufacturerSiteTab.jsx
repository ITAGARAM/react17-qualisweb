import React, { Component } from 'react';
import { Row, Col, Card, Tab, Nav } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import { FormattedMessage } from 'react-intl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { process } from '@progress/kendo-data-query';
import SlideOutModal from '../../components/slide-out-modal/SlideOutModal';
import AddContactInfoManufacturer from '../../pages/contactmaster/AddContactInfoManufacturer';
import AddSiteManufacturer from '../../pages/contactmaster/AddSiteManufacturer';
import { DEFAULT_RETURN } from '../../actions/LoginTypes';
import { showEsign, validateEmail, validatePhoneNumber, onDropAttachFileList, deleteAttachmentDropZone, create_UUID, Lims_JSON_stringify,replaceBackSlash } from '../../components/CommonScript';
import Esign from '../audittrail/Esign';
import { transactionStatus, attachmentType } from '../../components/Enumeration';
import CustomAccordion from '../../components/custom-accordion/custom-accordion.component';
import ManufacturerTabsAccordion from './ManufacturerTabsAccordion';
import { toast } from 'react-toastify';
import ConfirmMessage from '../../components/confirm-alert/confirm-message.component';
//import ReactTooltip from 'react-tooltip';
import AddManufacturerFile from './AddManufacturerFile';

class ManufacturerSiteTab extends Component {
    constructor(props) {
        super(props);

        const dataState = {
            skip: 0,
            take: this.props.settings ? parseInt(this.props.settings[14]) : 5
        };
        this.state = {
            isSiteOpen: false, isContactOpen: false, siteSelectedRecord: {}, contactSelectedRecord: {}, dataResult: [],
            dataState: dataState, ManufacturerContactInfo: this.props.masterData.ManufacturerContactInfo, Country: [],
            SiteCode: this.props.masterData.SiteCode, selectedRecord: {}, countryCode: [],

        };
        this.ContactColumns = [{ "idsName": "IDS_CONTACTNAME", "mandatory": true, "dataField": "scontactname", "width": "150px", "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
        { dataField: "semail", idsName: "IDS_EMAILID", "width": "150px", "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
        { dataField: "sdefaultContact", idsName: "IDS_DEFAULT", "width": "150px", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" }


        ];

        this.siteColumns = [{ "idsName": "IDS_MANUFSITENAME", "mandatory": true, "dataField": "smanufsitename", "width": "150px", "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
        { "idsName": "IDS_ADDRESS1", "mandatory": true, "dataField": "saddress1", "width": "150px", "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
        { "idsName": "IDS_COUNTRYNAME", "mandatory": true, "dataField": "ncountrycode", "width": "150px", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" }

        ];

        this.manufacturerFileFTP = [
            { "idsName": "IDS_FILE", "dataField": "sfilename", "mandatory": true, "mandatoryLabel": "IDS_CHOOSE", "controlType": "file" }
        ];

        this.manufacturerFileLink = [
            { "idsName": "IDS_FILENAME", "dataField": "slinkfilename", "mandatory": true, "mandatoryLabel": "IDS_CHOOSE", "controlType": "file" },
            { "idsName": "IDS_LINKNAME", "dataField": "nlinkcode", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" }
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
            dataResult: process(this.state.ManufacturerContactInfo, event.dataState),
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
                screenName: "IDS_SITECONTACT", loading: false
            }
        }
        this.props.updateStore(updateInfo);
    }
    render() {

        const addManufacturerSiteId = this.props.controlMap.has("AddManufacturerSiteAddress") && this.props.controlMap.get("AddManufacturerSiteAddress").ncontrolcode
        // const editManufacturerSiteId = this.props.controlMap.has("EditManufacturerSiteAddress") && this.props.controlMap.get("EditManufacturerSiteAddress").ncontrolcode;
        // const deleteManufacturerSiteId = this.props.controlMap.has("DeleteManufacturerSiteAddress") && this.props.controlMap.get("DeleteManufacturerSiteAddress").ncontrolcode


        //const editManufacturerContactId = this.props.controlMap.has("EditManufacturerContactInfo") && this.props.controlMap.get("EditManufacturerContactInfo").ncontrolcode;
        // const deleteManufacturerContactId = this.props.controlMap.has("DeleteManufacturerContactInfo") && this.props.controlMap.get("DeleteManufacturerContactInfo").ncontrolcode

        //let primaryKeyField = "nmanufcontactcode";

        // const editContactParam = {
        //     screenName: "ManufacturerContact", primaryKeyField: "nmanufcontactcode", operation: "update",
        //     inputParam: this.props.inputParam, userInfo: this.props.userInfo, ncontrolCode: editManufacturerContactId
        // };

        // const deleteParam = { operation: "delete" };
        const mandatoryFields = [];
        if (this.props.screenName === "IDS_MANUFACTURESITE") {
            this.siteColumns.forEach(item => item.mandatory === true ?
                mandatoryFields.push(item) : ""
            );
        }
        else if (this.props.screenName === "IDS_SITECONTACT") {
            this.ContactColumns.forEach(item => item.mandatory === true ?
                mandatoryFields.push(item) : ""
            );
        }
        else if (this.props.screenName === "IDS_MANUFACTURERFILE") {     //ALPD-898 Fix
            if (this.props.selectedRecord.nattachmenttypecode === attachmentType.FTP) {
                this.manufacturerFileFTP.forEach(item => item.mandatory === true ?
                    mandatoryFields.push(item) : ""
                );
            }
            else {
                this.manufacturerFileLink.forEach(item => item.mandatory === true ?
                    mandatoryFields.push(item) : ""
                );
            }

        }

        return (
            <>
                <Row noGutters={true}>
                    <Col md='12'>
                        <Card className="at-tabs">
                            <Tab.Content>
                                <Tab.Pane aria-labelledby="Version-tab" className="p-0 active show">

                                    <Row className="no-gutters pt-2 pb-2 col-12 text-right border-bottom" >
                                        <Col md={12}>
                                            <div className="d-flex justify-content-end">
                                                {/* <ReactTooltip place="bottom" globalEventOff='click' id="tooltip_list_wrap"/> */}
                                                <Nav.Link className="add-txt-btn" hidden={this.props.userRoleControlRights.indexOf(addManufacturerSiteId) === -1}
                                                    onClick={() => this.props.getSiteManufacturerLoadEdit("SiteManufacturer", "create", this.props.masterData.selectedManufacturer.nmanufcode, undefined, addManufacturerSiteId, this.props.userInfo)}>
                                                    <FontAwesomeIcon icon={faPlus} /> { }
                                                    <FormattedMessage id='IDS_MANUFACTURESITE' defaultMessage='Site Details' />
                                                </Nav.Link>
                                            </div>
                                        </Col>

                                    </Row>

                                    <Row className="no-gutters">
                                        <Col md={12}>
                                            {this.props.masterData.ManufacturerSiteAddress && this.props.masterData.ManufacturerSiteAddress.length > 0 ?
                                                <CustomAccordion key="filter"
                                                    accordionTitle={"smanufsitename"}
                                                    accordionComponent={this.manufacturerSiteAccordion(this.props.masterData.ManufacturerSiteAddress)}
                                                    inputParam={{ masterData: this.props.masterData, userInfo: this.props.userInfo }}
                                                    accordionClick={this.props.getContactInfo}
                                                    accordionPrimaryKey={"nmanufsitecode"}
                                                    accordionObjectName={"siteAddress"}
                                                    selectedKey={this.props.masterData.selectedSite.nmanufsitecode}
                                                />
                                                : ""}
                                        </Col>
                                    </Row>
                                    {/* <Row>
                                        <Col>
                                            <DataGrid
                                                primaryKeyField={primaryKeyField}
                                                expandField="expanded"
                                                detailedFieldList={this.detailedFieldList}
                                                extractedColumnList={this.ContactColumns}
                                                inputParam={this.props.inputParam}
                                                userInfo={this.props.userInfo}
                                                // width="600px"
                                                data={this.state.ManufacturerContactInfo || []}
                                                dataResult={process(this.state.ManufacturerContactInfo || [], this.state.dataState)}
                                                dataState={this.state.dataState}
                                                dataStateChange={this.dataStateChange}
                                                controlMap={this.props.controlMap}
                                                userRoleControlRights={this.props.userRoleControlRights || []}
                                                methodUrl="ManufacturerContactInfo"
                                                fetchRecord={this.props.getContactManufacturerLoadEdit}
                                                editParam={editContactParam}
                                                deleteParam={{ operation: "delete" }}
                                                deleteRecord={this.DeleteContact}
                                                //pageable={false}
                                                scrollable={"scrollable"}
                                                isActionRequired={true}
                                                selectedId={this.props.selectedId}
                                            // isComponent={true}
                                            >
                                            </DataGrid>
                                        </Col>
                                    </Row> */}

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
                            showSaveContinue={this.props.screenName==="IDS_MANUFACTURERFILE"?false: true}
                            onSaveClick={this.onSaveClick}
                            updateStore={this.props.updateStore}
                            esign={this.props.loadEsign}
                            validateEsign={this.validateEsign}
                            selectedRecord={this.state.selectedRecord || {}}
                            mandatoryFields={mandatoryFields}
                            addComponent={this.props.loadEsign ?
                                <Esign operation={this.props.operation}
                                    //  formatMessage={this.props.formatMessage}
                                    onInputOnChange={this.onInputOnChange}
                                    inputParam={this.props.inputParam}
                                    selectedRecord={this.state.selectedRecord || {}}
                                /> :
                                this.props.screenName === "IDS_MANUFACTURESITE" ?
                                    <AddSiteManufacturer selectedRecord={this.state.selectedRecord || {}}
                                        onInputOnChange={this.onInputOnChange}
                                        onComboChange={this.onComboChange}
                                        //   formatMessage={this.props.formatMessage}
                                        Country={this.props.Country || []}
                                        inputParam={this.props.inputParam}
                                    // defaultValue={this.props.countryCode}
                                    />
                                    :
                                    this.props.screenName === "IDS_SITECONTACT" ?
                                        <AddContactInfoManufacturer
                                            selectedRecord={this.state.selectedRecord || {}}
                                            onInputOnChange={this.onInputOnChange}
                                            onComboChange={this.onComboChange}
                                        //  formatMessage={this.props.formatMessage}

                                        />
                                        :
                                        this.props.screenName === "IDS_MANUFACTURERFILE" ?      //ALPD-898 Fix
                                            <AddManufacturerFile
                                                selectedRecord={this.state.selectedRecord || {}}
                                                onInputOnChange={this.onInputOnChange}
                                                onDrop={this.onDropManufacturerFile}
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
                                                label={this.props.intl.formatMessage({ id: "IDS_MANUFACTURERFILE" })}
                                                name="manufacturerfilename"
                                                settings={this.props.settings}
                                            /> : ""


                            }
                        />

                    }

                </>
            </>
        );
    }
    manufacturerSiteAccordion = (manufacturerSiteAddress) => {
        let primaryKeyField = "nmanufcontactcode";
        const addManufacturerContactId = this.props.controlMap.has("AddManufacturerContactInfo") && this.props.controlMap.get("AddManufacturerContactInfo").ncontrolcode
        const editManufacturerContactId = this.props.controlMap.has("EditManufacturerContactInfo") && this.props.controlMap.get("EditManufacturerContactInfo").ncontrolcode;
        const editContactParam = {
            screenName: "ManufacturerContact", primaryKeyField: "nmanufcontactcode", operation: "update",
            inputParam: this.props.inputParam, userInfo: this.props.userInfo, ncontrolCode: editManufacturerContactId
        };
        const AddContactParam = {
            screenName: "ManufacturerContact", primaryKeyField, undefined, operation: "create",
            inputParam: this.props.inputParam, userInfo: this.props.userInfo, ncontrolCode: addManufacturerContactId
        };

        const accordionMap = new Map();
        manufacturerSiteAddress.map((siteAddress) =>
            accordionMap.set(siteAddress.nmanufsitecode,
                <ManufacturerTabsAccordion siteAddress={siteAddress}
                    getSiteManufacturerLoadEdit={this.props.getSiteManufacturerLoadEdit}
                    masterData={this.props.masterData}
                    ConfirmDelete={this.ConfirmDelete}
                    addManufacturerContactId={addManufacturerContactId}
                    AddContactParam={AddContactParam}
                    openModalContact={this.openModalContact}
                    // tabDetail={this.tabDetail(userSite)}   

                    primaryKeyField={primaryKeyField}
                    expandField="expanded"
                    detailedFieldList={this.detailedFieldList}
                    extractedColumnList={this.ContactColumns}
                    inputParam={this.props.inputParam}
                    userInfo={this.props.userInfo}
                    data={this.state.ManufacturerContactInfo || []}
                    ManufacturerContactInfo={this.state.ManufacturerContactInfo || []}
                    dataState={this.state.dataState}
                    dataStateChange={this.dataStateChange}
                    controlMap={this.props.controlMap}
                    userRoleControlRights={this.props.userRoleControlRights || []}
                    methodUrl="ManufacturerContactInfo"
                    getContactManufacturerLoadEdit={this.props.getContactManufacturerLoadEdit}
                    editParam={editContactParam}
                    deleteParam={{ operation: "delete" }}
                    deleteRecord={this.DeleteContact}
                    scrollable={"scrollable"}
                    isActionRequired={true}
                    selectedId={this.props.selectedId}
                    hasDynamicColSize={true}
                />)
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
            else if (event.target.name === "agree") {
                selectedRecord[event.target.name] = event.target.checked === true ? transactionStatus.YES : transactionStatus.NO;
            } else {
                selectedRecord[event.target.name] = event.target.checked === true ? transactionStatus.YES : transactionStatus.NO;
            }

        }
        else if (event.target.type === "radio") {
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
            } else {
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
            if (this.props.screenName === "IDS_MANUFACTURESITE") {
                inputParam = this.SaveSiteDetails(saveType, formRef);

                clearSelectedRecordField =[
                    { "idsName": "IDS_SITENAME", "dataField": "smanufsitename", "width": "200px" ,"controlType": "textbox","isClearField":true},
                    { "idsName": "IDS_ADDRESS1", "dataField": "saddress1", "width": "200px","controlType": "textbox","isClearField":true },
                    { "idsName": "IDS_ADDRESS2", "dataField": "saddress2", "width": "200px","controlType": "textbox","isClearField":true },
                    { "idsName": "IDS_ADDRESS3", "dataField": "saddress3", "width": "200px","controlType": "textbox","isClearField":true },
                    { "idsName": "IDS_DEFAULT", "dataField": "ndefaultstatus", "width": "100px","isClearField":true,"preSetValue":4},
                    
                ]

            }
            else if (this.props.screenName === "IDS_SITECONTACT") {
                inputParam = this.SaveContactInfo(saveType, formRef);

                clearSelectedRecordField =[
                    { "idsName": "IDS_CONTACTNAME", "dataField": "scontactname", "width": "200px" ,"controlType": "textbox","isClearField":true},
                    { "idsName": "IDS_PHONE", "dataField": "sphoneno", "width": "200px","controlType": "textbox","isClearField":true },
                    { "idsName": "IDS_MOBILE", "dataField": "smobileno", "width": "200px","controlType": "textbox","isClearField":true },
                    { "idsName": "IDS_FAX", "dataField": "sfaxno", "width": "200px","controlType": "textbox","isClearField":true },
                    { "idsName": "IDS_EMAILID", "dataField": "semail", "width": "200px","controlType": "textbox","isClearField":true },
                    { "idsName": "IDS_COMMENTS", "dataField": "scomments", "width": "200px","controlType": "textbox","isClearField":true },
                    { "idsName": "IDS_DEFAULT", "dataField": "ndefaultstatus", "width": "100px","isClearField":true,"preSetValue":4},
                    
                ]
            }
            else {
                inputParam = this.SaveManufacturerFile(saveType, formRef);

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
        let fieldList = ["nmanufsitecode", "ncountrycode", "smanufsitename",
            "saddress1", "saddress2", "saddress3", "ndefaultstatus"];

        if (this.props.operation === "update") {
            postParam = {
                inputListName: "SiteAddress",
                selectedObject: "selectedSite",
                primaryKeyField: "nmanufsitecode",
            };

            inputData["manufacturersiteaddress"] = { "nmanufcode": this.props.masterData.selectedManufacturer.nmanufcode };
            fieldList.map(item => {
                if (item === "ncountrycode") {
                    return inputData["manufacturersiteaddress"][item] = this.state.selectedRecord[item] ? this.state.selectedRecord[item].value : "";
                }
                else {
                    return inputData["manufacturersiteaddress"][item] = this.state.selectedRecord[item] ? this.state.selectedRecord[item] : "";
                }
            })
        }
        else {

            inputData["manufacturersiteaddress"] = { "nmanufcode": this.props.masterData.selectedManufacturer.nmanufcode };

            fieldList.map(item => {
                if (item === "ncountrycode") {
                    return inputData["manufacturersiteaddress"][item] = this.state.selectedRecord[item].value
                }
                else {
                    return inputData["manufacturersiteaddress"][item] = this.state.selectedRecord[item]
                }
            })
        }
        const inputParam = {
            classUrl: this.props.inputParam.classUrl,
            methodUrl: "SiteAddress",
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
        let fieldList = ["nmanufcontactcode", "scontactname",
            "sphoneno", "smobileno", "semail", "sfaxno", "scomments", "ndefaultstatus"];

        let selectedId = null;
        if (this.props.operation === "update") {
            postParam = {
                inputListName: "ContactInfo",
                selectedObject: "selectedContact",
                primaryKeyField: "nmanufcontactcode",
            };

            inputData["manufacturercontactinfo"] = {
                "nmanufcode": this.props.masterData.selectedManufacturer.nmanufcode,
                "nmanufsitecode": this.props.masterData.SiteCode
            };

            selectedId = this.props.selectedRecord.nmanufcontactcode;

            fieldList.map(item => {
                return inputData["manufacturercontactinfo"][item] = this.state.selectedRecord[item] ? this.state.selectedRecord[item] : "";
            })
            dataState = this.state.dataState;
        }
        else {

            inputData["manufacturercontactinfo"] = {
                "nmanufcode": this.props.masterData.selectedManufacturer.nmanufcode,
                "nmanufsitecode": this.props.masterData.SiteCode
            };
            fieldList.map(item => {
                return inputData["manufacturercontactinfo"][item] = this.state.selectedRecord[item] ? this.state.selectedRecord[item] : "";
            })
            inputData["manufacturercontactinfo"]['ndefaultstatus'] = this.state.selectedRecord && this.state.selectedRecord.ndefaultstatus ?
                this.state.selectedRecord.ndefaultstatus
                : transactionStatus.YES

        }
        const inputParam = {
            classUrl: this.props.inputParam.classUrl,
            methodUrl: "ContactInfo",
            inputData: inputData, selectedId,
            operation: this.props.operation, saveType, formRef, dataState,
            postParam: postParam,
            selectedRecord:{...this.state.selectedRecord}

        }
        return inputParam;

        // this.props.crudMaster(inputParam, this.props.masterData);
    }

    SaveManufacturerFile(saveType, formRef) {
        const selectedRecord = this.state.selectedRecord;
        const acceptedFiles = selectedRecord.sfilename;
        const nattachmenttypecode = selectedRecord.nattachmenttypecode;
        let isFileEdited = transactionStatus.NO;
        let manufacturerFileArray = [];
        let manufacturerFile = {
            nmanufcode: this.props.masterData.selectedManufacturer.nmanufcode,
            nmanufacturerfilecode: selectedRecord.nmanufacturerfilecode ? selectedRecord.nmanufacturerfilecode : 0,
            nstatus: transactionStatus.ACTIVE,
            nattachmenttypecode,
            ndefaultstatus: selectedRecord[nattachmenttypecode === attachmentType.LINK ? "nlinkdefaultstatus" : "ndefaultstatus"] ? selectedRecord[nattachmenttypecode === attachmentType.LINK ? "nlinkdefaultstatus" : "ndefaultstatus"] : 4
        };
        const formData = new FormData();
        if (nattachmenttypecode === attachmentType.FTP) {
            if (acceptedFiles && Array.isArray(acceptedFiles) && acceptedFiles.length > 0) {
                acceptedFiles.forEach((file, index) => {
                    const tempData = Object.assign({}, manufacturerFile);
                    const splittedFileName = file.name.split('.');
                    const fileExtension = file.name.split('.')[splittedFileName.length - 1];
                    const ssystemfilename = selectedRecord.ssystemfilename && selectedRecord.ssystemfilename !== undefined ? selectedRecord.ssystemfilename.split('.') : create_UUID();
                    const filesystemfileext = selectedRecord.ssystemfilename && selectedRecord.ssystemfilename !== undefined ? file.name.split('.')[ssystemfilename.length - 1] : fileExtension;
                    const uniquefilename = nattachmenttypecode === attachmentType.FTP ? selectedRecord.nmanufacturerfilecode && selectedRecord.nmanufacturerfilecode > 0
                        && selectedRecord.ssystemfilename !== "" ? ssystemfilename[0] + '.' + filesystemfileext : create_UUID() + '.' + fileExtension : "";
                    tempData["sfilename"] = Lims_JSON_stringify(replaceBackSlash(file.name?file.name :""), false);
                    tempData["sdescription"] = Lims_JSON_stringify(replaceBackSlash(selectedRecord.sdescription ? selectedRecord.sdescription.trim() : ""), false);
                    tempData["nlinkcode"] = transactionStatus.NA;
                    tempData["ssystemfilename"] = uniquefilename;
                    tempData["nfilesize"] = file.size;
                    formData.append("uploadedFile" + index, file);
                    formData.append("uniquefilename" + index, uniquefilename);
                    manufacturerFileArray.push(tempData);
                });
                formData.append("filecount", acceptedFiles.length);
                isFileEdited = transactionStatus.YES;
            } else {
                manufacturerFile["sfilename"] = Lims_JSON_stringify(replaceBackSlash(selectedRecord.sfilename?selectedRecord.sfilename:""), false);
                manufacturerFile["sdescription"] = Lims_JSON_stringify(replaceBackSlash(selectedRecord.sdescription ? selectedRecord.sdescription.trim() : ""), false);
                manufacturerFile["nlinkcode"] = transactionStatus.NA;
                manufacturerFile["ssystemfilename"] = selectedRecord.ssystemfilename;
                manufacturerFile["nfilesize"] = selectedRecord.nfilesize;
                manufacturerFileArray.push(manufacturerFile);
            }
        } else {
            manufacturerFile["sfilename"] = Lims_JSON_stringify(replaceBackSlash(selectedRecord.slinkfilename ? selectedRecord.slinkfilename.trim() :""), false);
            manufacturerFile["sdescription"] = Lims_JSON_stringify(replaceBackSlash(selectedRecord.slinkdescription ? selectedRecord.slinkdescription.trim() : ""), false);
            manufacturerFile["nlinkcode"] = selectedRecord.nlinkcode.value ? selectedRecord.nlinkcode.value : -1;
            manufacturerFile["ssystemfilename"] = "";
            manufacturerFile["nfilesize"] = 0;
            manufacturerFileArray.push(manufacturerFile);
        }
        formData.append("isFileEdited", isFileEdited);
        formData.append("manufacturerfile", JSON.stringify(manufacturerFileArray));
        // formData.append("userinfo", JSON.stringify(this.props.userInfo));



      ///  let selectedId = null;
        let postParam = undefined;
        if (this.props.operation === "update") {
            // edit
            postParam = { inputListName: "Manufacturer", selectedObject: "selectedManufacturer", primaryKeyField: "nmanufcode" };
          //  selectedId = selectedRecord["nmanufacturerfilecode"];
        }
        const inputParam = {
            inputData: {
                "userinfo": {
                    ...this.props.userInfo,
                    sformname: Lims_JSON_stringify(this.props.userInfo.sformname),
                    smodulename: Lims_JSON_stringify(this.props.userInfo.smodulename),
                     //ALPD-1621(while saving the file and link,audit trail is not captured respective language)
                    slanguagename: Lims_JSON_stringify(this.props.userInfo.slanguagename)
                }
            },
            formData: formData,
            isFileupload: true,
            operation: this.props.operation,
            classUrl: "manufacturer",
            saveType, formRef, methodUrl: "ManufacturerFile", postParam,
            selectedRecord:{...this.state.selectedRecord}

        }
        return inputParam;
    }

    // DeleteContact = (e, selectedRecord, Type, methodURL,operation,screenName, ncontrolCode) => {
    DeleteContact = (deleteParam) => {
        let inputData = [];
        if (deleteParam.selectedRecord.expanded !== undefined) {
            delete deleteParam.selectedRecord.expanded
        }
        inputData["manufacturercontactinfo"] = deleteParam.selectedRecord;
        inputData["userinfo"] = this.props.userInfo;
        const inputParam = {
            methodUrl: "ContactInfo",
            classUrl: this.props.inputParam.classUrl,
            inputData: inputData,
            operation: "delete",
            dataState: this.state.dataState,
            selectedRecord:{...this.state.selectedRecord}

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
    //Delete = (e, selectedRecord, Type, methodURL, operation, screenName, ncontrolCode) => {
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
            operation: "delete",
            selectedRecord:{...this.state.selectedRecord}

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
        //this.props.crudMaster(inputParam, this.props.masterData);
    }
    componentDidUpdate(previousProps) {
        if (this.props.masterData !== previousProps.masterData) {

            let { dataState } = this.state;
            if (this.props.dataState === undefined) {
                dataState = { skip: 0, take: this.props.settings ? parseInt(this.props.settings[14]) : 5 }
            }

            this.setState({
                isSiteOpen: false, isContactOpen: false,
                ManufacturerContactInfo: this.props.masterData.ManufacturerContactInfo,
                SiteCode: this.props.masterData.SiteCode, Country: this.props.masterData.Country, dataState

            });
        }

        if (this.props.selectedRecord !== previousProps.selectedRecord) {
            this.setState({ selectedRecord: this.props.selectedRecord });
        }
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

    onDropManufacturerFile = (attachedFiles, fieldName, maxSize) => {

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
}
export default (injectIntl(ManufacturerSiteTab));