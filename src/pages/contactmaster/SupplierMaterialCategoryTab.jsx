import React from 'react'
import { Row, Col, Card } from 'react-bootstrap';//, Nav, Tab
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
//import { faPlus } from '@fortawesome/free-solid-svg-icons';//,faPencilAlt, faTrash
import { injectIntl } from 'react-intl';//FormattedMessage,
//import { Grid, GridColumn } from '@progress/kendo-react-grid';
import { process } from '@progress/kendo-data-query';
import SlideOutModal from '../../components/slide-out-modal/SlideOutModal';
//import Axios from 'axios';
//import rsapi from '../../rsapi';
import { toast } from 'react-toastify';
import AddSupplierCategory from './AddSupplierCategory';
import AddMaterialCategory from './AddMaterialCategory';
import Esign from '../audittrail/Esign';
import { DEFAULT_RETURN } from '../../actions/LoginTypes';
import {
    constructOptionList, showEsign, onDropAttachFileList, create_UUID, validatePhoneNumber,
    validateEmail, deleteAttachmentDropZone, Lims_JSON_stringify
} from '../../components/CommonScript';
//import DataGrid from '../../components/DataGrid';
import SupplierTabs from './SupplierTabs';
import SupplierFileTab from './SupplierFileTabs';
import { transactionStatus, attachmentType } from '../../components/Enumeration';
import CustomTabs from '../../components/custom-tabs/custom-tabs.component';
import AddSupplierFile from './AddSupplierFile';
import AddSupplierContact from './AddSupplierContact';

class SupplierMaterialCategoryTab extends React.Component {

    constructor(props) {
        super(props);
        const dataState = {
            skip: 0,
            take: this.props.settings ? parseInt(this.props.settings[14]) : 5
        };
        const dataStateMaterial = {
            skip: 0,
            take: this.props.settings ? parseInt(this.props.settings[14]) : 5
        };
        this.state = {
            isOpen: false, selectedRecord: {}, dataResult: [],
            activeTab: 'SupplierCategory-tab',
            dataState: dataState,
            dataStateMaterial: dataStateMaterial, supplierCategory: [], materialCategory: [], countryList: []
        };
        this.supplerCategoryFieldList = ['nsuppliercode', 'ncategorycode', 'ntypecode', 'ssuppliercatname', 'smaterialcatname',
            'sremarks', 'ntransactionstatus'];
        this.supplierContactFieldList = ['ssuppliercontactname', 'sdescription', 'sdesignation', 'saddress1', 'saddress2', 'saddress3',
            'sphoneno', 'smobileno', 'sfaxno', 'semail', 'ndefaultstatus', 'ncountrycode'];
        this.suppliercatColumnList = [{ "idsName": "IDS_SUPPLIERCATNAME", "dataField": "ssuppliercatname", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" }];
        this.materialcatColumnList = [{ "idsName": "IDS_MATERIALCATNAME", "dataField": "smaterialcatname", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" }];
        this.supplierContactColumnList = [{ "idsName": "IDS_SUPPLIERCONTACTNAME", "dataField": "ssuppliercontactname", "width": "150px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
        { "idsName": "IDS_DEFAULTSTATUS", "dataField": "sdisplaystatus", "width": "250px", "mandatory": false, "controlType": "checkbox" }
        ]
        this.validationSuppliercatColumnList = [{ "idsName": "IDS_SUPPLIERCATNAME", "dataField": "nsuppliercatcode", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" }];
        this.validationMaterialcatColumnList = [{ "idsName": "IDS_MATERIALCATNAME", "dataField": "nmaterialcatcode", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" }];


    }
    supplierDataStateChange = (event) => {
        this.setState({
            dataState: event.dataState
        });
    }
    materialDataStateChange = (event) => {
        this.setState({
            dataStateMaterial: event.dataState
        });
    }
    render() {
        const mandatoryFields = [];
        let matmandatoryFields = [];

        this.validationSuppliercatColumnList.forEach(item => item.mandatory === true ?
            mandatoryFields.push(item) : ""
        );
        if (this.props.screenName === "IDS_MATERIALCATEGORY") {
            this.validationMaterialcatColumnList.forEach(item => item.mandatory === true ?
                matmandatoryFields.push(item) : ""
            );
        }
        else if (this.props.screenName === "IDS_SUPPLIERFILE") {
            if (this.state.selectedRecord && this.state.selectedRecord.nattachmenttypecode === attachmentType.LINK) {
                matmandatoryFields = [
                    { "idsName": "IDS_FILENAME", "dataField": "slinkfilename", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "file" },
                    { "idsName": "IDS_LINKNAME", "dataField": "nlinkcode", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" }
                ];
            } else {
                // if (this.props.operation !== 'update') {
                matmandatoryFields = [{ "idsName": "IDS_FILE", "dataField": "sfilename", "mandatory": true, "mandatoryLabel": "IDS_CHOOSE", "controlType": "file" }];
                // }
            }
        }
        else if (this.props.screenName === "IDS_SUPPLIERCONTACT") {
            matmandatoryFields = [{ "idsName": "IDS_SUPPLIERCONTACT", "dataField": "ssuppliercontactname", "width": "150px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
            ]
        }

        return (
            <>
                <Row className="no-gutters">
                    <Col md={12}>
                        <Card className="at-tabs">
                            <CustomTabs tabDetail={this.tabDetail()} onTabChange={this.onTabChange} />
                        </Card>
                    </Col>
                </Row>
                {this.props.openChildModal &&
                    <SlideOutModal show={this.props.openChildModal}
                        closeModal={this.closeModal}
                        operation={this.props.operation}
                        inputParam={this.props.inputParam}
                        screenName={this.props.screenName}
                        //ATE234 janakumar ALPD-5546All Master screen -> Copy & File remove the save&continue
                        showSaveContinue={this.props.screenName === "IDS_SUPPLIERCONTACT" ? true:false}
                        onSaveClick={this.onSaveClick}
                        updateStore={this.props.updateStore}
                        esign={this.props.loadEsign}
                        validateEsign={this.validateEsign}
                        selectedRecord={this.state.selectedRecord || {}}
                        mandatoryFields={this.props.screenName === "IDS_SUPPLIERCATEGORY" ? mandatoryFields : matmandatoryFields || []}
                        addComponent={this.props.loadEsign ?
                            <Esign operation={this.props.operation}
                                onInputOnChange={this.onInputOnChange}
                                inputParam={this.props.inputParam}
                                selectedRecord={this.state.selectedRecord || {}}
                            /> :
                            this.props.screenName === "IDS_SUPPLIERCATEGORY" ?
                                <AddSupplierCategory selectedRecord={this.state.selectedRecord || {}}
                                    onInputOnChange={this.onInputOnChange}
                                    onComboChange={this.onComboChange}
                                    selectedSupplierCategory={this.props.masterData.selectedSupplierCategory}
                                    supplierCategory={this.state.supplierCategory || []} //{this.props.supplierCategory || []}
                                /> :
                                this.props.screenName === "IDS_MATERIALCATEGORY" ?
                                    <AddMaterialCategory selectedRecord={this.state.selectedRecord || {}}
                                        onInputOnChange={this.onInputOnChange}
                                        onComboChange={this.onComboChange}
                                        operation={this.props.operation}
                                        selectedMaterialCategory={this.props.masterData.selectedMaterialCategory}
                                        materialCategory={this.state.materialCategory}//{this.props.materialCategory}
                                    /> :
                                    this.props.screenName === "IDS_SUPPLIERCONTACT" ?
                                        <AddSupplierContact
                                            selectedRecord={this.state.selectedRecord || {}}
                                            onInputOnChange={this.onInputOnChange}
                                            onComboChange={this.onComboChange}
                                            operation={this.props.operation}
                                            formatMessage={this.props.intl.formatMessage}
                                            selectedSupplierContact={this.props.masterData.selectedSupplierContact}
                                            countryList={this.state.countryList || []}
                                        /> :
                                        this.props.screenName === "IDS_SUPPLIERFILE" ?
                                            <AddSupplierFile
                                                selectedRecord={this.state.selectedRecord || {}}
                                                onInputOnChange={this.onInputOnChange}
                                                onDrop={this.onDropSupplierFile}
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
                                                label={this.props.intl.formatMessage({ id: "IDS_SUPPLIERFILE" })}
                                                name="supplierfilename"
                                                settings={this.props.settings}
                                            /> : ""
                        }

                    />
                }
            </>

        )

    }

    onTabChange = (tabProps) => {
        const screenName = tabProps.screenName;
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { screenName }
        }
        this.props.updateStore(updateInfo);
    }
    onDropSupplierFile = (attachedFiles, fieldName, maxSize) => {

        let selectedRecord = this.state.selectedRecord || {};
        selectedRecord[fieldName] = onDropAttachFileList(selectedRecord[fieldName], attachedFiles, maxSize)
        this.setState({ selectedRecord, actionType: "new" });
    }


    tabDetail = () => {
        const addSupCatId = this.props.controlMap.has("AddSupplierCategory") && this.props.controlMap.get("AddSupplierCategory").ncontrolcode

        const deleteSupCatId = this.props.controlMap.has("DeleteSupplierCategory") && this.props.controlMap.get("DeleteSupplierCategory").ncontrolcode

        const addMatCatId = this.props.controlMap.has("AddMaterialCategory") && this.props.controlMap.get("AddMaterialCategory").ncontrolcode

        const deleteMatCatId = this.props.controlMap.has("DeleteMaterialCategory") && this.props.controlMap.get("DeleteMaterialCategory").ncontrolcode

        const addSupCotId = this.props.controlMap.has("AddSupplierContact") && this.props.controlMap.get("AddSupplierContact").ncontrolcode

        const editSupCotId = this.props.controlMap.has("EditSupplierContact") && this.props.controlMap.get("EditSupplierContact").ncontrolcode

        const deleteSupCotId = this.props.controlMap.has("DeleteSupplierContact") && this.props.controlMap.get("DeleteSupplierContact").ncontrolcode

        const supcatAddParam = {
            screenName: "IDS_SUPPLIERCATEGORY", operation: "create", primaryKeyField: "nsuppliercatcode",
            masterData: this.props.masterData, userInfo: this.props.userInfo, ncontrolCode: addSupCatId
        };

        const supcatDeleteParam = { screenName: "IDS_SUPPLIERCATEGORY", methodUrl: "SupplierMatrix", operation: "delete", ncontrolCode: deleteSupCatId };

        const matericatAddParam = {
            screenName: "IDS_MATERIALCATEGORY", operation: "create", primaryKeyField: "nmaterialcatcode",
            masterData: this.props.masterData, userInfo: this.props.userInfo, ncontrolCode: addMatCatId
        };

        const materialcatDeleteParam = { screenName: "IDS_MATERIALCATEGORY", methodUrl: "SupplierMatrix", operation: "delete", ncontrolCode: deleteMatCatId };

        const supcotAddParam = {
            screenName: "IDS_SUPPLIERCONTACT", operation: "create", primaryKeyField: "nsuppliercontactcode",
            masterData: this.props.masterData, userInfo: this.props.userInfo, ncontrolCode: addSupCotId
        };
        const editcotAddParam = {
            screenName: "IDS_SUPPLIERCONTACT", operation: "update", primaryKeyField: "nsuppliercontactcode",
            masterData: this.props.masterData, userInfo: this.props.userInfo, ncontrolCode: editSupCotId
        };


        const supcotDeleteParam = { screenName: "IDS_SUPPLIERCONTACT", methodUrl: "Supplier", operation: "delete", ncontrolCode: deleteSupCotId };

        const tabMap = new Map();
        const detailedFieldList = [
            { "idsName": "IDS_DESIGNATION", "dataField": "sdesignation", "width": "150px", "mandatory": false, "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
            { "idsName": "IDS_MOBILENO", "dataField": "smobileno", "width": "150px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
            { "idsName": "IDS_TELEPHONENO", "dataField": "stelephoneno", "width": "150px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
            { "idsName": "IDS_EMAIL", "dataField": "semail", "width": "150px", "mandatory": false, "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
            { "idsName": "IDS_DESCRIPTION", "dataField": "sdescription", "width": "150px", "mandatory": false, "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
            { "idsName": "IDS_DEFAULTSTATUS", "dataField": "sdisplaystatus", "width": "250px" },

        ];

        tabMap.set("IDS_SUPPLIERCATEGORY", <SupplierTabs userRoleControlRights={this.props.userRoleControlRights}
            controlMap={this.props.controlMap}
            inputParam={this.props.inputParam}
            userInfo={this.props.userInfo}
            addId={addSupCatId}
            addParam={supcatAddParam}
            comboDataService={this.props.getSupplierCategoryComboDataService}
            addTitleIDS={"IDS_SUPPLIERCATEGORY"}
            addTitleDefaultMsg={'SupplierCategory'}
            primaryKeyField={"nsuppliermatrixcode"}
            masterData={this.props.masterData}
            primaryList={"SupplierCategory"}
            dataResult={process(this.props.masterData["SupplierCategory"] || [], this.state.dataState)}
            // dataState={this.state.dataState}
            // dataStateChange={this.supplierDataStateChange}
            dataState={(this.props.screenName === undefined || this.props.screenName === '' || this.props.screenName === "SupplierCategory" || this.props.screenName === "IDS_SUPPLIERCATEGORY") ? this.state.dataState : { skip: 0 }}
            dataStateChange={(event) => this.setState({ dataState: event.dataState })}
            columnList={this.suppliercatColumnList}
            methodUrl={"SupplierMatrix"}
            deleteRecord={this.deleteRecord}
            deleteParam={supcatDeleteParam}
        //selectedId={this.props.selectedId}
        />)
        tabMap.set("IDS_MATERIALCATEGORY", <SupplierTabs userRoleControlRights={this.props.userRoleControlRights}
            controlMap={this.props.controlMap}
            inputParam={this.props.inputParam}
            userInfo={this.props.userInfo}
            addId={addMatCatId}
            addParam={matericatAddParam}
            comboDataService={this.props.getMaterialCategoryComboDataService}
            addTitleIDS={"IDS_MATERIALCATEGORY"}
            addTitleDefaultMsg={'MaterialCategory'}
            primaryKeyField={"nsuppliermatrixcode"}
            masterData={this.props.masterData}
            primaryList={"MaterialCategory"}
            dataResult={process(this.props.masterData["MaterialCategory"] || [], this.state.dataStateMaterial)}
            // dataState={this.state.dataStateMaterial}
            // dataStateChange={this.materialDataStateChange}
            dataState={(this.props.screenName === undefined || this.props.screenName === "MaterialCategory" || this.props.screenName === "IDS_MATERIALCATEGORY") ? this.state.dataStateMaterial : { skip: 0 }}
            dataStateChange={(event) => this.setState({ dataStateMaterial: event.dataState })}
            columnList={this.materialcatColumnList}
            methodUrl={"SupplierMatrix"}
            deleteRecord={this.deleteRecord}
            deleteParam={materialcatDeleteParam}
        //selectedId={this.props.selectedId}
        />)
        tabMap.set("IDS_SUPPLIERCONTACT", <SupplierTabs userRoleControlRights={this.props.userRoleControlRights}
            selectedId={this.props.selectedId}
            controlMap={this.props.controlMap}
            inputParam={this.props.inputParam}
            userInfo={this.props.userInfo}
            fetchRecord={this.props.getSupplierContactComboDataService}
            addId={addSupCotId}
            editId={editSupCotId}
            editParam={editcotAddParam}
            addParam={supcotAddParam}
            comboDataService={this.props.getSupplierContactComboDataService}
            addTitleIDS={"IDS_SUPPLIERCONTACT"}
            addTitleDefaultMsg={'SupplierContact'}
            primaryKeyField={"nsuppliercontactcode"}
            masterData={this.props.masterData}
            primaryList={"SupplierContact"}
            dataResult={process(this.props.masterData["SupplierContact"] || [], this.state.dataState)}
            // dataState={this.state.dataStateMaterial}
            // dataStateChange={this.materialDataStateChange}
            dataState={(this.props.screenName === undefined || supcotAddParam.screenName === "IDS_SUPPLIERCONTACT") ? this.state.dataState : { skip: 0 }}
            dataStateChange={(event) => this.setState({ dataState: event.dataState })}
            columnList={this.supplierContactColumnList}
            methodUrl={"SupplierContact"}
            deleteRecord={this.deleteRecord}
            deleteParam={supcotDeleteParam}
            detailedFieldList={detailedFieldList}
        //selectedId={this.props.selectedId}
        />)

        tabMap.set("IDS_FILE",
            <SupplierFileTab
                controlMap={this.props.controlMap}
                userRoleControlRights={this.props.userRoleControlRights}
                userInfo={this.props.userInfo}
                inputParam={this.props.inputParam}
                deleteRecord={this.deleteRecord}
                supplierFile={this.props.masterData.supplierFile || []}
                getAvailableData={this.props.getAvailableData}
                addSupplierFile={this.props.addSupplierFile}
                viewSupplierFile={this.viewSupplierFile}
                defaultRecord={this.defaultRecord}
                screenName={"IDS_SUPPLIERFILE"}
                settings={this.props.settings}
                masterData={this.props.masterData}
            />);
        return tabMap;
    }


    closeModal = () => {
        let loadEsign = this.props.loadEsign;
        let openChildModal = this.props.openChildModal;
        let selectedRecord = this.props.selectedRecord;
        let selectedId = this.props.selectedId;
        if (this.props.loadEsign) {
            if (this.props.operation === "delete") {
                loadEsign = false;
                openChildModal = false;
                selectedRecord = {};
            }
            else {
                loadEsign = false;
                selectedRecord['esignpassword'] = '';
                selectedRecord['esigncomments'] = '';
            }
        }
        else {
            openChildModal = false;
            selectedId = null;
            selectedRecord = {};
        }

        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { openChildModal, loadEsign, selectedRecord, selectedId }
        }
        this.props.updateStore(updateInfo);

    }

    onComboChange = (comboData, fieldName) => {
        const selectedRecord = this.state.selectedRecord || {};
        selectedRecord[fieldName] = comboData;;


        if (fieldName === "nsuppliercatcode") {
            let selectedSupplierCategory = comboData;
            this.setState({ selectedRecord, selectedSupplierCategory });
        }
        if (fieldName === "nmaterialcatcode") {
            let selectedMaterialCategory = comboData;
            this.setState({ selectedRecord, selectedMaterialCategory });
        }
        if (fieldName === "ncountrycode") {
            let selectedSupplierContact = comboData;
            this.setState({ selectedRecord, selectedSupplierContact });
        }
    }
    viewSupplierFile = (filedata) => {
        const inputParam = {
            inputData: {
                supplierfile: filedata,
                userinfo: this.props.userInfo
            },
            classUrl: "supplier",
            operation: "view",
            methodUrl: "AttachedSupplierFile",
            screenName: "Supplier File"
        }
        this.props.viewAttachment(inputParam);
    }

    onInputOnChange = (event, optional) => {
        const selectedRecord = this.state.selectedRecord || {};
        if (event.target.type === 'checkbox') {
            if (event.target.name === "ntransactionstatus")
                selectedRecord[event.target.name] = event.target.checked === true ? transactionStatus.ACTIVE : transactionStatus.DEACTIVE;
            // else if (event.target.name === "nlockmode")
            //     selectedRecord[event.target.name] = event.target.checked === true ? transactionStatus.UNLOCK : transactionStatus.LOCK;
            else
                selectedRecord[event.target.name] = event.target.checked === true ? transactionStatus.YES : transactionStatus.NO;
        }
        else if (event.target.type === 'radio') {
            selectedRecord[event.target.name] = optional;
        }
        else {
            if (event.target.name === "stelephoneno" || event.target.name === "smobileno") {
                if (event.target.value !== "") {
                    event.target.value = validatePhoneNumber(event.target.value);
                    selectedRecord[event.target.name] = event.target.value !== "" ? event.target.value : selectedRecord[event.target.name];
                }
                else {
                    selectedRecord[event.target.name] = event.target.value;
                }
            }
            else
                selectedRecord[event.target.name] = event.target.value;
        }
        this.setState({ selectedRecord });
    }


    componentDidUpdate(previousProps) {
        if (this.props.masterData !== previousProps.masterData) {

            let isOpen = false;
            if (this.props.errorCode !== undefined && (this.state.operation === "create" || this.state.operation === "update")) {
                isOpen = true;
            }
            let { dataState, dataStateMaterial } = this.state;
            if (this.props.dataState === undefined) {
                dataState = { skip: 0, take: this.props.settings ? parseInt(this.props.settings[14]) : 5, filter: undefined, sort: undefined }
                dataStateMaterial = { skip: 0, take: this.props.settings ? parseInt(this.props.settings[14]) : 5, filter: undefined, sort: undefined }
            }
            this.setState({ isOpen, activeTab: 'SupplierCategory-tab', dataState, dataStateMaterial });
        }

        if (this.props.selectedRecord !== previousProps.selectedRecord) {
			//ALPD-5540--Vignesh(07-03-2025)-->Supplier-->When click the logout button, blank page occurs in specific scenario
            const countryList = constructOptionList(this.props.selectedRecord && this.props.selectedRecord.countryList || [], "ncountrycode",
                "scountryname", undefined, undefined, undefined);
            const countryListSupplier = countryList.get("OptionList");
            this.setState({ selectedRecord: this.props.selectedRecord, countryList: countryListSupplier });
        }
        let { dataState, dataStateMaterial } = this.state;
        if (this.props.dataState !== previousProps.dataState && this.props.dataState !== dataState) {
            dataState = { skip: 0, take: this.props.settings ? parseInt(this.props.settings[14]) : 5 }
            dataStateMaterial = { skip: 0, take: this.props.settings ? parseInt(this.props.settings[14]) : 5 }
            this.setState({ dataState, dataStateMaterial });
        }

        // {
        //     dataState={...dataState,filter:undefined,sort:undefined}
        //     dataStateMaterial={...dataStateMaterial,filter:undefined,sort:undefined}
        //     this.setState({ dataState, dataStateMaterial });
        // }
        if (this.props.supplierCategory !== previousProps.supplierCategory || this.props.materialCategory !== previousProps.materialCategory) {

            const supplierCategory = constructOptionList(this.props.supplierCategory || [], "nsuppliercatcode",
                "ssuppliercatname", undefined, undefined, undefined);
            const supplierCategoryList = supplierCategory.get("OptionList");

            const materialCategory = constructOptionList(this.props.materialCategory || [], "nmaterialcatcode",
                "smaterialcatname", undefined, undefined, undefined);
            const materialCategoryList = materialCategory.get("OptionList");

            this.setState({ supplierCategory: supplierCategoryList, materialCategory: materialCategoryList });
        }
    }


    onSaveClick = (saveType, formRef) => {
        //add / edit  
        if (this.state.selectedRecord['semail'] ? validateEmail(this.state.selectedRecord['semail']) : true) {

            let inputParam = {};
            let clearSelectedRecordField =[];
            if (this.props.screenName === "IDS_SUPPLIERCATEGORY") {
                inputParam = this.saveSupplierCategory(saveType, formRef);
            }
            else if (this.props.screenName === "IDS_MATERIALCATEGORY") {
                inputParam = this.saveMaterial(saveType, formRef);
            }
            else if (this.props.screenName === "IDS_SUPPLIERCONTACT") {
                inputParam = this.saveSupplierContact(saveType, formRef);
                clearSelectedRecordField =  [
                    { "idsName": "IDS_SUPPLIERCONTACTNAME", "dataField": "ssuppliercontactname", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "textbox","isClearField":true },
                    { "idsName": "IDS_DESIGNATION", "dataField": "sdesignation", "width": "150px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "textbox","isClearField":true },
                    { "idsName": "IDS_MOBILENO", "dataField": "smobileno", "width": "150px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "textbox","isClearField":true }, 
                    { "idsName": "IDS_TELEPHONENO", "dataField": "stelephoneno", "width": "150px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "textbox","isClearField":true },
                    { "idsName": "IDS_EMAIL", "dataField": "semail", "width": "150px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "textbox","isClearField":true },
                    { "idsName": "IDS_DESCRIPTION", "dataField": "sdescription", "width": "150px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "textbox","isClearField":true },
                     {"idsName":"IDS_DEFAULTSTATUS","dataField":"ndefaultstatus","width":"200px","isClearField":true,"preSetValue":4},
                      ];
            }
            else if (this.props.screenName === "IDS_SUPPLIERFILE") {
                inputParam = this.onSaveSupplierFile(saveType, formRef);
                clearSelectedRecordField =  [
                    { "idsName": "IDS_FILENAME", "dataField": "slinkfilename", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "textbox","isClearField":true },
                    { "idsName": "IDS_DESCRIPTION", "dataField": "sdescription", "width": "150px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "textbox","isClearField":true },
                    { "idsName": "IDS_DESCRIPTION", "dataField": "slinkdescription", "width": "150px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "textbox","isClearField":true },
                    
                      ];
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
                if(this.props.screenName === "IDS_SUPPLIERCONTACT" || this.props.screenName === "IDS_SUPPLIERFILE")
                {
                this.props.crudMaster(inputParam, this.props.masterData, "openChildModal","","",clearSelectedRecordField);
                }
                else
                {
                    this.props.crudMaster(inputParam, this.props.masterData, "openChildModal");
                }
            }
        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_ENTERVALIDEMAIL" }));
        }

    }

    saveSupplierCategory(saveType, formRef) {
        let inputData = [];
        inputData["userinfo"] = this.props.userInfo;
        inputData["supplier"] = this.props.masterData.SelectedSupplier;
        inputData["suppliermatrix"] = {};
        let dataState = { skip: 0, take: this.props.settings ? parseInt(this.props.settings[14]) : 5 };

        let suppliermatrixArray = []
        suppliermatrixArray = this.state.selectedRecord.nsuppliercatcode.map(item => {
            let suppliermat = {}
            suppliermat["nsuppliercode"] = this.props.masterData.SelectedSupplier.nsuppliercode; //this.state.selectedRecord["nmahcode"] ? this.state.selectedRecord["nmahcode"].value : "";
            suppliermat["ntypecode"] = 1;
            suppliermat["sremarks"] = "";
            suppliermat["ntransactionstatus"] = transactionStatus.ACTIVE;
            suppliermat["ncategorycode"] = item.value
         
            //suppliermatrixArray.push(suppliermat);
            return suppliermat;
        });
        inputData['suppliermatrix'] = suppliermatrixArray;
        inputData["napprovalstatus"]=this.props.masterData.SelectedSupplier.napprovalstatus;
        const inputParam = {
            classUrl: "suppliermatrix",
            methodUrl: "SupplierMatrix",
            inputData: inputData,
            operation: this.props.operation, saveType, formRef, dataState
        }
        return inputParam;
    }

    saveMaterial(saveType, formRef) {
        let inputData = [];
        inputData["userinfo"] = this.props.userInfo;
        inputData["supplier"] = this.props.masterData.SelectedSupplier;
        inputData["suppliermatrix"] = {};
        let dataStateMaterial = undefined;

        let suppliermatrixArray = []
        suppliermatrixArray = this.state.selectedRecord.nmaterialcatcode.map(item => {
            let suppliermat = {}
            suppliermat["nsuppliercode"] = this.props.masterData.SelectedSupplier.nsuppliercode; //this.state.selectedRecord["nmahcode"] ? this.state.selectedRecord["nmahcode"].value : "";
            suppliermat["ntypecode"] = 2;
            suppliermat["sremarks"] = "";
            suppliermat["ntransactionstatus"] = transactionStatus.ACTIVE;
            suppliermat["ncategorycode"] = item.value
            //suppliermatrixArray.push(suppliermat);
            return suppliermat;
        });
        inputData['suppliermatrix'] = suppliermatrixArray;

        const inputParam = {
            classUrl: "suppliermatrix",
            methodUrl: "SupplierMatrix",
            inputData: inputData,
            operation: this.props.operation, saveType, formRef, dataStateMaterial
        }
        return inputParam;
    }
    saveSupplierContact(saveType, formRef) {
        let inputData = [];
        let postParam = {};
        inputData["userinfo"] = this.props.userInfo;
        inputData["supplier"] = this.props.masterData.SelectedSupplier;
        inputData["suppliercontact"] = {};
        let dataState ;
        // let suppliercontactArray = []   

 
        let suppliermat = {}
        if (this.props.operation === "update") {
            postParam = { inputListName: "Suppliercontact", selectedObject: "SupplierContact", primaryKeyField: "nsuppliercontactcode" };

            inputData["nsuppliercontactcode"] = this.state.selectedRecord.nsuppliercontactcode;
            suppliermat["nsuppliercode"] = this.props.masterData.SelectedSupplier.nsuppliercode; //this.state.selectedRecord["nmahcode"] ? this.state.selectedRecord["nmahcode"].value : "";
            suppliermat["sdescription"] = this.state.selectedRecord.sdescription;
            suppliermat["sdesignation"] = this.state.selectedRecord.sdesignation;
            suppliermat["smobileno"] = this.state.selectedRecord.smobileno;
            suppliermat["stelephoneno"] = this.state.selectedRecord.stelephoneno;
            suppliermat["semail"] = this.state.selectedRecord.semail;
            suppliermat["ndefaultstatus"] = this.state.selectedRecord.ndefaultstatus ? this.state.selectedRecord.ndefaultstatus : "4";
            suppliermat["ssuppliercontactname"] = this.state.selectedRecord.ssuppliercontactname;
            suppliermat["nsuppliercontactcode"] = this.state.selectedRecord.nsuppliercontactcode;
            inputData['suppliercontact'] = suppliermat;

            dataState = this.state.dataState;

        }
        else {
            suppliermat["nsuppliercode"] = this.props.masterData.SelectedSupplier.nsuppliercode; //this.state.selectedRecord["nmahcode"] ? this.state.selectedRecord["nmahcode"].value : "";
            suppliermat["sdescription"] = this.state.selectedRecord.sdescription;
            suppliermat["sdesignation"] = this.state.selectedRecord.sdesignation;
            suppliermat["smobileno"] = this.state.selectedRecord.smobileno;
            suppliermat["stelephoneno"] = this.state.selectedRecord.stelephoneno;
            suppliermat["semail"] = this.state.selectedRecord.semail;
            suppliermat["ndefaultstatus"] = this.state.selectedRecord.ndefaultstatus ? this.state.selectedRecord.ndefaultstatus : "4";
            suppliermat["ssuppliercontactname"] = this.state.selectedRecord.ssuppliercontactname;

            //suppliermat["ncategorycode"] = item.value
            //   suppliercontactArray.push(suppliermat);
            //  return suppliermat;

            inputData['suppliercontact'] = suppliermat;
            dataState = { skip: 0, take: this.props.settings ? parseInt(this.props.settings[14]) : 5 };
        }
        let inputParam = {
            classUrl: "supplier",
            methodUrl: "SupplierContact",
            inputData: inputData,
            operation: this.props.operation, postParam, saveType, formRef, dataState,
            selectedRecord:{...this.state.selectedRecord}

        }
        return inputParam;
    }



    onSaveSupplierFile = (saveType, formRef) => {
        const selectedRecord = this.state.selectedRecord;
        const acceptedFiles = selectedRecord.sfilename;
        const nattachmenttypecode = selectedRecord.nattachmenttypecode;
        let isFileEdited = transactionStatus.NO;
        let supplierFileArray = [];
        let supplierFile = {
            nsuppliercode: this.props.masterData.SelectedSupplier.nsuppliercode,
            nsupplierfilecode: selectedRecord.nsupplierfilecode ? selectedRecord.nsupplierfilecode : 0,
            nstatus: transactionStatus.ACTIVE,
            nattachmenttypecode,
            // ndefaultstatus: selectedRecord[nattachmenttypecode === attachmentType.LINK ? "nlinkdefaultstatus" : "ndefaultstatus"] ? selectedRecord[nattachmenttypecode === attachmentType.LINK ? "nlinkdefaultstatus" : "ndefaultstatus"] : 4
        };
        const formData = new FormData();
        if (nattachmenttypecode === attachmentType.FTP) {
            if (acceptedFiles && Array.isArray(acceptedFiles) && acceptedFiles.length > 0) {
                acceptedFiles.forEach((file, index) => {
                    const tempData = Object.assign({}, supplierFile);
                    const splittedFileName = file.name.split('.');
                    const fileExtension = file.name.split('.')[splittedFileName.length - 1];
                    const ssystemfilename = selectedRecord.ssystemfilename ? selectedRecord.ssystemfilename.split('.') : "";
                    const filesystemfileext = selectedRecord.ssystemfilename ? file.name.split('.')[ssystemfilename.length - 1] : "";
                    const uniquefilename = nattachmenttypecode === attachmentType.FTP ? selectedRecord.nsupplierfilecode && selectedRecord.nsupplierfilecode > 0
                        && selectedRecord.ssystemfilename !== "" && selectedRecord.ssystemfilename !== undefined ? ssystemfilename[0] + '.' + filesystemfileext : create_UUID() + '.' + fileExtension : "";
                    tempData["sfilename"] = Lims_JSON_stringify(file.name, false);
                    tempData["sdescription"] = Lims_JSON_stringify(selectedRecord.sdescription ? selectedRecord.sdescription.trim() : "", false);
                    tempData["nlinkcode"] = transactionStatus.NA;
                    tempData["ssystemfilename"] = uniquefilename;
                    tempData["nfilesize"] = file.size;
                    formData.append("uploadedFile" + index, file);
                    formData.append("uniquefilename" + index, uniquefilename);
                    supplierFileArray.push(tempData);
                });
                formData.append("filecount", acceptedFiles.length);
                isFileEdited = transactionStatus.YES;
            } else {
                supplierFile["sfilename"] = Lims_JSON_stringify(selectedRecord.sfilename, false);
                supplierFile["sdescription"] = Lims_JSON_stringify(selectedRecord.sdescription ? selectedRecord.sdescription.trim() : "", false);
                supplierFile["nlinkcode"] = transactionStatus.NA;
                supplierFile["ssystemfilename"] = selectedRecord.ssystemfilename;
                supplierFile["nfilesize"] = selectedRecord.nfilesize;
                supplierFileArray.push(supplierFile);
            }
        } else {
            supplierFile["sfilename"] = Lims_JSON_stringify(selectedRecord.slinkfilename.trim(), false);
            supplierFile["sdescription"] = Lims_JSON_stringify(selectedRecord.slinkdescription ? selectedRecord.slinkdescription.trim() : "", false);
            supplierFile["nlinkcode"] = selectedRecord.nlinkcode.value ? selectedRecord.nlinkcode.value : -1;
            supplierFile["ssystemfilename"] = "";
            supplierFile["nfilesize"] = 0;
            supplierFileArray.push(supplierFile);
        }
        formData.append("isFileEdited", isFileEdited);
        formData.append("supplierfile", JSON.stringify(supplierFileArray));
        // formData.append("userinfo", JSON.stringify(this.props.userInfo));



        let selectedId = null;
        let postParam = undefined;
        if (this.props.operation === "update") {
            // edit
            postParam = { inputListName: "Supplier", selectedObject: "SelectedSupplier", primaryKeyField: "nsuppliercode" };
            selectedId = selectedRecord["nsupplierfilecode"];
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
            classUrl: "supplier",
            saveType, formRef, methodUrl: "SupplierFile", postParam,
            selectedRecord:{...this.state.selectedRecord}
        }
        return inputParam;
    }

    deleteRecord = (supplierparam) => {
        if (this.props.masterData.SelectedSupplier.napprovalstatus !== transactionStatus.DRAFT) {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTDRAFTRECORD" }));
        }
        else {
            if (supplierparam.selectedRecord.expanded !== undefined) {
                delete (supplierparam.selectedRecord.expanded);
            }
            let inputParam = {};

            let dataResultRecord;
            let skipDataRecords;
            let dataStateRecord;

            if (this.props.screenName === "IDS_SUPPLIERFILE") {
                inputParam = {
                    classUrl: "supplier",
                    methodUrl: supplierparam.methodUrl,
                    inputData: {
                        [supplierparam.methodUrl.toLowerCase()]: supplierparam.selectedRecord,
                        	//ALPD-1620(while saving the file and link,audit trail is not captured the respective language)
                        "userinfo": {...this.props.userInfo, slanguagename: Lims_JSON_stringify(this.props.userInfo.slanguagename)},
                    },
                    operation: supplierparam.operation,
                    //dataState: this.state.dataState,
                    //dataStateMaterial: this.state.dataStateMaterial
                }
                dataResultRecord=process(this.props.masterData['supplierFile'], this.state.dataState );
                dataStateRecord= this.state.dataState
            } else if (supplierparam.screenName === "IDS_SUPPLIERCONTACT") {
                inputParam = {
                    classUrl: "supplier",
                    methodUrl: "SupplierContact",
                    inputData: {
                        [supplierparam.methodUrl.toLowerCase()]:{ ...supplierparam.selectedRecord,
                        napprovalstatus:this.props.masterData.SelectedSupplier.napprovalstatus},
                        "userinfo": this.props.userInfo,

                    },
                    operation: supplierparam.operation,
                    //dataState: this.state.dataState,
                    //dataStateMaterial: this.state.dataStateMaterial
                    //dataState: this.state.dataState
                }
                dataResultRecord=process(this.props.masterData['SupplierContact'], this.state.dataState );
                dataStateRecord=this.state.dataState;
            }else if (supplierparam.screenName === "IDS_SUPPLIERCATEGORY") {
                inputParam = {
                    classUrl: "suppliermatrix",
                    methodUrl: "SupplierMatrix",
                    inputData: {
                        [supplierparam.methodUrl.toLowerCase()]:{ ...supplierparam.selectedRecord,
                        napprovalstatus:this.props.masterData.SelectedSupplier.napprovalstatus},
                        "userinfo": this.props.userInfo,

                    },
                    operation: supplierparam.operation,
                    //dataState: this.state.dataState,
                    //dataStateMaterial: this.state.dataStateMaterial
                    //dataState: this.state.dataState
                }
                dataResultRecord=process(this.props.masterData['SupplierCategory'], this.state.dataState );
                dataStateRecord= this.state.dataState;
            }
            else if (supplierparam.screenName === "IDS_MATERIALCATEGORY") {
                inputParam = {
                    classUrl: "suppliermatrix",
                    methodUrl: "SupplierMatrix",
                    inputData: {
                        [supplierparam.methodUrl.toLowerCase()]:{ ...supplierparam.selectedRecord,
                        napprovalstatus:this.props.masterData.SelectedSupplier.napprovalstatus},
                        "userinfo": this.props.userInfo,

                    },
                    operation: supplierparam.operation,
                    //dataState: this.state.dataState,
                    //dataStateMaterial: this.state.dataStateMaterial
                    //dataState: this.state.dataState
                }
                dataResultRecord=process(this.props.masterData['MaterialCategory'], this.state.dataStateMaterial );
                dataStateRecord=this.state.dataStateMaterial;
            }
            else {
                inputParam = {
                    classUrl: "suppliermatrix",
                    methodUrl: supplierparam.methodUrl,
                    inputData: {
                        [supplierparam.methodUrl.toLowerCase()]: supplierparam.selectedRecord,
                        "userinfo": this.props.userInfo,

                    },
                    operation: supplierparam.operation,
                    //dataState: this.state.dataState,
                    //dataStateMaterial: this.state.dataStateMaterial
                    //dataState: this.state.dataState
                }
            }

            // if(dataResultRecord.data){
            //     if(dataResultRecord.data.length ===1){
            //        let skipcount=this.state.dataState.skip>0?(this.state.dataState.skip-this.state.dataState.take):
            //        this.state.dataState.skip
            //        skipDataRecords={skip:skipcount,take:this.state.dataState.take}
            //     }else{
            //         skipDataRecords=this.state.dataState;
            //     }
            // }

            if(dataResultRecord.data){
                if(dataResultRecord.data.length ===1){
                   let skipcount=dataStateRecord.skip>0?(dataStateRecord.skip-dataStateRecord.take):
                   dataStateRecord.skip
                   skipDataRecords={skip:skipcount,take:dataStateRecord.take}
                }else{
                    skipDataRecords=dataStateRecord;
                }
            }

            inputParam["dataState"]= skipDataRecords;

            if (showEsign(this.props.esignRights, this.props.userInfo.nformcode, supplierparam.ncontrolCode)) {
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        loadEsign: true, screenData: { inputParam, masterData: this.props.masterData },
                        openChildModal: true, screenName: supplierparam.screenName, operation: supplierparam.operation
                    }
                }
                this.props.updateStore(updateInfo);
            }
            else {
                this.props.crudMaster(inputParam, this.props.masterData, "openChildModal");
            }
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

export default injectIntl(SupplierMaterialCategoryTab);

