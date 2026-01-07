import React, { Component } from 'react';
import AddProductManufacturer from './AddProductManufacturer';
import { Row, Col } from 'react-bootstrap';

import { toast } from 'react-toastify';
import { injectIntl } from 'react-intl';

import { process } from '@progress/kendo-data-query';
import SlideOutModal from '../../components/slide-out-modal/SlideOutModal';
import AddProductMAHolder from './AddProductMAHolder';

import './product.css'
import { DEFAULT_RETURN } from '../../actions/LoginTypes';
import Esign from '../audittrail/Esign';
import { constructOptionList, showEsign } from '../../components/CommonScript';
import DataGrid from '../../components/data-grid/data-grid.component';
import { transactionStatus } from '../../components/Enumeration';
import ProductManufacturerAccordion from './ProductManufacturerAccordion';
import CustomTabs from '../../components/custom-tabs/custom-tabs.component';
import ProductManufacturerTab from './ProductManufacturerTab';
import ConfirmMessage from '../../components/confirm-alert/confirm-message.component';

class ProductTabs extends Component {
    constructor(props) {
        super(props);
        const dataState = {
            skip: 0,
            take: this.props.settings ? parseInt(this.props.settings[14]) : 5,
        };
        this.state = {
            // isOpen: false, 
            selectedRecord: {}, dataResult: [],
            dataState: dataState,
            historyDataState :dataState,
            Productmaholder: this.props.masterData.Productmaholder
        };
        this.confirmMessage = new ConfirmMessage();
        this.onMultiColumnValue = this.onMultiColumnValue.bind(this);
        this.ProductmaholderFieldList = ['sproducttradename', 'sproductcertificatename', 'sdosagepercontainer', 'slicencenumber'];
        this.productManufacturerColumnList = [
            { "idsName": "IDS_MANUFACTURERNAME", "dataField": "nmanufcode", "mandatory": true , "mandatoryLabel":"IDS_SELECT", "controlType": "selectbox"},
            { "idsName": "IDS_MANUFACTURERSITENAME", "dataField": "nmanufsitecode", "mandatory": true, "mandatoryLabel":"IDS_SELECT", "controlType": "selectbox" },
            { "idsName": "IDS_EPROTOCOL", "dataField": "neprotocolcode", "mandatory": true, "mandatoryLabel":"IDS_SELECT", "controlType": "selectbox" }
        ]
        this.productMAHColumnList = [
            { "idsName": "IDS_PRODUCTCERTIFICATENAME", "dataField": "sproductcertificatename", "mandatory": true, "mandatoryLabel":"IDS_ENTER", "controlType": "textbox" },
            { "idsName": "IDS_CERTIFICATETYPE", "dataField": "ncertificatetypecode", "mandatory": true, "mandatoryLabel":"IDS_SELECT", "controlType": "selectbox" },
            { "idsName": "IDS_LICENCENUMBER", "dataField": "slicencenumber", "mandatory": true, "mandatoryLabel":"IDS_ENTER", "controlType": "textbox" },
            { "idsName": "IDS_DOSEPERCONTAINER", "dataField": "sdosagepercontainer", "mandatory": true , "mandatoryLabel":"IDS_ENTER", "controlType": "textbox"},
            { "idsName": "IDS_CONTAINERTYPE", "dataField": "ncontainertypecode", "mandatory": true, "mandatoryLabel":"IDS_SELECT", "controlType": "selectbox" },
            { "idsName": "IDS_LICENSEAUTHORITY", "dataField": "sauthorityshortname", "mandatory": true, "mandatoryLabel":"IDS_ENTER", "controlType": "textbox" },
            { "idsName": "IDS_MAHNAME", "dataField": "nmahcode", "mandatory": true, "mandatoryLabel":"IDS_SELECT", "controlType": "selectbox" },
        ]

    }
    dataStateChange = (event) => {
        this.setState({
            dataState: event.dataState
        });
    }
    // expandChange = (event) => {
    //     const isExpanded =
    //         event.dataItem.expanded === undefined ?
    //             event.dataItem.aggregates : event.dataItem.expanded;
    //     event.dataItem.expanded = !isExpanded;
    //     this.setState({ ...this.props });
    // }
    render() {
        const mandatoryFields = [];
        const mahmandatoryFields = [];
        this.productManufacturerColumnList.forEach(item => item.mandatory === true ?
            mandatoryFields.push(item) : ""
        );
        this.productMAHColumnList.forEach(item => item.mandatory === true ?
            mahmandatoryFields.push(item) : ""
        );
        return (
            <>
                <Row noGutters={true}>
                    <Col md='12'>
                        <CustomTabs tabDetail={this.tabDetail()} onTabChange={this.onTabOnChange} />

                    </Col>
                </Row>
                {this.props.openChildModal ?
                    <SlideOutModal show={this.props.openChildModal}
                        closeModal={this.closeModal}
                        operation={this.props.operation}
                        inputParam={this.props.inputParam}
                        screenName={this.props.screenName}
                        onSaveClick={this.onSaveClick}
                        updateStore={this.props.updateStore}
                        esign={this.props.loadEsign}
                        validateEsign={this.validateEsign}
                        selectedRecord={this.state.selectedRecord || {}}
                        mandatoryFields={this.props.screenName === "IDS_PRODUCTMANUFACTURER" ? mandatoryFields : this.props.screenName === "IDS_PRODUCTMAHOLDER" ? mahmandatoryFields : []}
                        addComponent={this.props.loadEsign ?
                            <Esign operation={this.props.operation}
                                onInputOnChange={this.onInputOnChange}
                                inputParam={this.props.inputParam}
                                selectedRecord={this.state.selectedRecord || {}}
                            /> : this.props.screenName === "IDS_PRODUCTMANUFACTURER" ?
                                <AddProductManufacturer selectedRecord={this.state.selectedRecord || {}}
                                    GetManufactureSite={this.GetManufactureSite}
                                    onComboChange={this.onComboChange}
                                    Eprotocol={this.state.Eprotocol || []}
                                    Manufacturer={this.state.Manufacturer || []}
                                    ManufacturerSite={this.state.ManufacturerSite || []}
                                    selectedProduct={this.props.masterData.selectedProduct || {}}
                                />
                                : this.props.screenName === "IDS_PRODUCTMAHOLDER" ? <AddProductMAHolder
                                    selectedRecord={this.state.selectedRecord || {}}
                                    onInputOnChange={this.onInputOnChange}
                                    onComboChange={this.onComboChange}
                                    onMultiColumnValue={this.onMultiColumnValue}
                                    onMAHChange={this.onMAHChange}
                                    formatMessage={this.props.intl.formatMessage}
                                    CertificateType={this.state.CertificateType || []}
                                    ContainerType={this.state.ContainerType || []}
                                    LicenseAuthority={this.props.LicenseAuthority || []}
                                    MAHolder={this.state.MAHolder || []}
                                    selectedProduct={this.props.masterData.selectedProduct || {}}
                                    operation={this.props.operation}
                                /> : null
                        }

                    /> : ""}
            </>
        );
    }

    productManufacturerAccordion = (productManufacturerList) => {

        const editProductMaholder = this.props.controlMap.has("EditProductMaholder") && this.props.controlMap.get("EditProductMaholder").ncontrolcode;
        const addProductMaholder = this.props.controlMap.has("AddProductMaholder") && this.props.controlMap.get("AddProductMaholder").ncontrolcode
        const editProductManufacturer = this.props.controlMap.has("EditProductManufacturer") && this.props.controlMap.get("EditProductManufacturer").ncontrolcode;
        const deleteProductManufacturer = this.props.controlMap.has("DeleteProductManufacturer") && this.props.controlMap.get("DeleteProductManufacturer").ncontrolcode;

        const editProductMaholderParam = {
            screenName: "IDS_PRODUCTMAHOLDER", operation: "update", primaryKeyField: "nproductmahcode",
            masterData: this.props.masterData, userInfo: this.props.userInfo, ncontrolCode: editProductMaholder
        };
        const addProductMaholderParam = {
            screenName: "IDS_PRODUCTMAHOLDER", operation: "create", primaryKeyField: "nproductmahcode",
            masterData: this.props.masterData, userInfo: this.props.userInfo, ncontrolCode: addProductMaholder
        };

        const accordionMap = new Map();
        productManufacturerList.map((objProductManufacturer) =>
            accordionMap.set(objProductManufacturer.nproductmanufcode,
                <ProductManufacturerAccordion objProductManufacturer={objProductManufacturer}
                    userRoleControlRights={this.props.userRoleControlRights}
                    controlMap={this.props.controlMap}
                    userInfo={this.props.userInfo}
                    getProductManufactureComboService={this.props.getProductManufactureComboService}
                    masterData={this.props.masterData}
                    ConfirmDelete={this.ConfirmDelete}
                    // tabDetail={this.tabDetail(userSite)} 
                    // objProductManufacturer={objProductManufacturer}
                    editProductManufacturer={editProductManufacturer}
                    deleteProductManufacturer={deleteProductManufacturer}
                    addProductMaholder={addProductMaholder}
                    getProductMAHComboService={this.props.getProductMAHComboService}
                    addProductMaholderParam={addProductMaholderParam}
                    detailedFieldList={this.detailedFieldList}
                    extractedColumnList={this.extractedColumnList}
                    inputParam={this.props.inputParam}
                    dataResult={process(this.props.masterData.Productmaholder || [], this.state.dataState)}
                    dataState={this.state.dataState}
                    dataStateChange={this.dataStateChange}
                    fetchRecord={this.props.getProductMAHComboService}
                    editProductMaholderParam={editProductMaholderParam}
                    dataGridDeleteRecord={this.deleteMAHRecord}
                    copyRecord={this.copyRecord}
                    completeRecord={this.completeRecord}
                    selectedId={this.props.selectedId}

                />)
        )
        return accordionMap;
    }

    ConfirmDelete = (screenName, methodUrl, operation, selectedRecord, key, ncontrolCode) => {
        this.confirmMessage.confirm("deleteMessage", this.props.intl.formatMessage({ id: "IDS_DELETE" }), this.props.intl.formatMessage({ id: "IDS_DEFAULTCONFIRMMSG" }),
            this.props.intl.formatMessage({ id: "IDS_OK" }), this.props.intl.formatMessage({ id: "IDS_CANCEL" }),
            () => this.deleteRecord(screenName, methodUrl, operation, selectedRecord, key, ncontrolCode));
    }

    tabDetail = () => {

        const addProductManufacturer = this.props.controlMap.has("AddProductManufacturer") && this.props.controlMap.get("AddProductManufacturer").ncontrolcode

        const tabMap = new Map();
        tabMap.set("IDS_MANUFACTURE", <ProductManufacturerTab userRoleControlRights={this.props.userRoleControlRights}
            controlMap={this.props.controlMap}
            inputParam={this.props.inputParam}
            userInfo={this.props.userInfo}
            getProductMaHolder={this.props.getProductMaHolder}
            getProductManufactureComboService={this.props.getProductManufactureComboService}
            masterData={this.props.masterData}
            selectedId={this.props.selectedId}
            addProductManufacturer={addProductManufacturer}
            productManufacturerAccordion={this.productManufacturerAccordion}
        />)
        tabMap.set("IDS_APPROVALHISTORY", <DataGrid
            extractedColumnList={this.extractedHistoryColumnList}
            primaryKeyField="nproductapprovalhistorycode"
            inputParam={this.props.inputParam}
            userInfo={this.props.userInfo}
            data={this.props.masterData.ProductApprovalHistory || []}
            dataResult={process(this.props.masterData.ProductApprovalHistory || [], this.state.historyDataState)}
            dataState={this.state.historyDataState}
            dataStateChange={(event)=> this.setState({historyDataState: event.dataState})}
            width="600px"
            pageable={true}
            controlMap={this.props.controlMap}
            userRoleControlRights={this.props.userRoleControlRights || []}
            scrollable={"auto"}
            //  isComponent={true}
            //  isActionRequired={false}
            isToolBarRequired={false}
        >
        </DataGrid>)
        return tabMap;
    }

    GetManufactureSite = (event, fieldName) => {
        if (event !== null) {
            let Map = {};
            Map["nmanufcode"] = parseInt(event.value);
            const selectedRecord = this.state.selectedRecord;
            selectedRecord[fieldName] = event;
            this.props.GetManufactureSiteByManuf(Map, selectedRecord, this.props.masterData, this.props.userInfo);
        }
    }
    // getProductMAHComboService = (displayname, primaryKeyField, primaryData, operation, inputParam, userInfo, ncontrolCode) => {
    //     this.props.getProductMAHComboService("ProductMAHolder", operation, primaryKeyField, primaryData, undefined, this.props.masterData, userInfo, ncontrolCode);
    // }
    deleteRecord = (screenName, methodUrl, operation, selectedRecord, key, ncontrolCode) => {
        const inputParam = {
            methodUrl: methodUrl,
            classUrl: this.props.inputParam.classUrl,
            inputData: { [key]: selectedRecord, "userinfo": this.props.userInfo },
            operation: "delete"
        }
        if (showEsign(this.props.esignRights, this.props.userInfo.nformcode, ncontrolCode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData: this.props.masterData },
                    openChildModal: true, screenName, operation
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.crudMaster(inputParam, this.props.masterData, "openChildModal");
        }
    }
    deleteMAHRecord = (inputData) => {
        if (inputData.selectedRecord.expanded !== undefined) {
            delete inputData.selectedRecord.expanded
        }
        const inputParam = {
            dataState: this.state.dataState,
            methodUrl: "ProductMaholder",
            classUrl: this.props.inputParam.classUrl,
            inputData: { "productmaholder": inputData.selectedRecord, "userinfo": this.props.userInfo },
            operation: "delete"
        }
        if (showEsign(this.props.esignRights, this.props.userInfo.nformcode, inputData.ncontrolCode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData: this.props.masterData },
                    openChildModal: true, screenName: "ProductMAHolder", operation: inputData.operation
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.crudMaster(inputParam, this.props.masterData, "openChildModal");
        }
    }
    copyRecord = (selectedRecord, operation, ncontrolCode) => {
        if (selectedRecord.expanded !== undefined) {
            delete selectedRecord.expanded
        }
        const inputParam = {
            dataState: this.state.dataState,
            methodUrl: "ProductMaHolder",
            classUrl: this.props.inputParam.classUrl,
            inputData: { "productmaholder": selectedRecord.dataItem, "userinfo": this.props.userInfo },
            operation: "copy"
        }
        if (showEsign(this.props.esignRights, this.props.userInfo.nformcode, ncontrolCode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData: this.props.masterData },
                    openChildModal: true, screenName: "ProductMAHolder", operation
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.crudMaster(inputParam, this.props.masterData, "openChildModal");
        }
    }
    completeRecord = (selectedRecord, operation, ncontrolCode) => {
        if (selectedRecord.ntransactionstatus === transactionStatus.DRAFT || selectedRecord.ntransactionstatus === transactionStatus.CORRECTION) {
            if (selectedRecord.sdosagepercontainer !== "") {
                if (selectedRecord.expanded !== undefined) {
                    delete selectedRecord.expanded
                }
                const inputParam = {
                    dataState: this.state.dataState,
                    methodUrl: "ProductMaHolder",
                    classUrl: this.props.inputParam.classUrl,
                    inputData: { "productmaholder": selectedRecord, "userinfo": this.props.userInfo },
                    operation: "complete"
                }
                if (showEsign(this.props.esignRights, this.props.userInfo.nformcode, ncontrolCode)) {
                    const updateInfo = {
                        typeName: DEFAULT_RETURN,
                        data: {
                            loadEsign: true, screenData: { inputParam, masterData: this.props.masterData },
                            openChildModal: true, screenName: "ProductMAHolder", operation:"complete"
                        }
                    }
                    this.props.updateStore(updateInfo);
                }
                else {
                    this.props.crudMaster(inputParam, this.props.masterData, "openChildModal");
                }
            } else {
                toast.warn(this.props.intl.formatMessage({ id: "IDS_ENTERDOSAGETOCOMPLETE" }));
            }
        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_ALREADYCOMPLETED" }));
        }
    }

    onMultiColumnValue = (value, key) => {
        if (value.length > 0) {
            const selectedRecord = this.state.selectedRecord || {};
            key.forEach(objarray => {
                selectedRecord[objarray] = value[0][objarray];
            });
            this.setState({ selectedRecord });
        }
    }
    onMAHChange = (event, fieldName) => {
        const selectedRecord = this.state.selectedRecord || {};
        selectedRecord[fieldName] = event;
        selectedRecord["saddress1"] = event.item.saddress1;
        selectedRecord["saddress2"] = event.item.saddress2;
        selectedRecord["saddress3"] = event.item.saddress3;
        selectedRecord["scountryname"] = event.item.scountryname;
        this.setState({ selectedRecord });
    }
    onInputOnChange = (event) => {
        const selectedRecord = this.state.selectedRecord || {};
        if (event.target.type === 'checkbox') {
            if (event.target.name === "agree") {
                selectedRecord[event.target.name] = event.target.checked === true ? 3 : 4;
            }
        }
        else {
            selectedRecord[event.target.name] = event.target.value;
        }
        this.setState({ selectedRecord });
    }
    onComboChange = (comboData, fieldName) => {
        if (comboData !== null) {
            const selectedRecord = this.state.selectedRecord || {};
            selectedRecord[fieldName] = comboData;
            this.setState({ selectedRecord });
        }
    }
    closeModal = () => {
        let loadEsign = this.props.loadEsign;
        let openChildModal = this.props.openChildModal;
        let selectedRecord = this.props.selectedRecord;
        if (this.props.loadEsign) {
            if (this.props.operation === "delete" || this.props.operation === "Copy" 
                        || this.props.operation === "complete") {
                loadEsign = false;
                openChildModal = false;
                selectedRecord = {}
            }
            else {
                loadEsign = false;
            }
        }
        else {
            openChildModal = false;
            selectedRecord = {};
        }

        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { openChildModal, loadEsign, selectedRecord }
        }
        this.props.updateStore(updateInfo);

    }


    onSaveClick = (saveType, formRef) => {
        let inputParam = {};
        if (this.props.screenName === "IDS_PRODUCTMANUFACTURER") {
            inputParam = this.saveProductManufacturer(saveType, formRef);
        }
        else if (this.props.screenName === "IDS_PRODUCTMAHOLDER") {
            inputParam = this.saveMAHolder(saveType, formRef);
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
            this.props.crudMaster(inputParam, this.props.masterData, "openChildModal");
        }
    }
    saveProductManufacturer(saveType, formRef) {
        let inputData = [];
        inputData["userinfo"] = this.props.userInfo;
        inputData["productmanufacturer"] = { "nstatus": 1 };
        let selectedId = "";
        let postParam = undefined
        if (this.props.operation === "update") {
            selectedId = this.state.selectedRecord.nproductmanufcode;
            postParam = { inputListName: "Product", selectedObject: "selectedProduct", primaryKeyField: "nproductcode" }
            inputData["productmanufacturer"] = JSON.parse(JSON.stringify(this.state.selectedRecord));
            inputData["productmanufacturer"]["seprotocolname"] = this.state.selectedRecord.neprotocolcode.label;
            inputData["productmanufacturer"]["smanufname"] = this.state.selectedRecord.nmanufcode.label;
            inputData["productmanufacturer"]["smanufsitename"] = this.state.selectedRecord.nmanufsitecode.label;
            inputData["productmanufacturer"]["nproductmanufcode"] = this.state.selectedRecord["nproductmanufcode"] ? this.state.selectedRecord["nproductmanufcode"] : -1;
        }
        inputData["productmanufacturer"]["nmanufsitecode"] = this.state.selectedRecord["nmanufsitecode"] ? this.state.selectedRecord["nmanufsitecode"].value : -1;
        inputData["productmanufacturer"]["neprotocolcode"] = this.state.selectedRecord["neprotocolcode"] ? this.state.selectedRecord["neprotocolcode"].value : -1;
        inputData["productmanufacturer"]["nmanufcode"] = this.state.selectedRecord["nmanufcode"] ? this.state.selectedRecord["nmanufcode"].value : -1;
        inputData["productmanufacturer"]["nproductcode"] = this.props.masterData.selectedProduct.nproductcode;
        const inputParam = {
            classUrl: this.props.inputParam.classUrl,
            methodUrl: "ProductManufacturer",
            inputData: inputData,
            operation: this.props.operation,
            displayName: this.props.inputParam.displayName,
            saveType, formRef, selectedId, postParam
        }
        return inputParam;
    }

    saveMAHolder(saveType, formRef) {
        let inputData = [];
        inputData["userinfo"] = this.props.userInfo;
        inputData["productmaholder"] = { "nstatus": 1 };
        let selectedId = null;
        let dataState = undefined;
        let postParam = undefined;
        if (this.props.operation === "update") {
            selectedId = this.state.selectedRecord.nproductmahcode;
            dataState = this.state.dataState;
            postParam = { inputListName: "Product", selectedObject: "selectedProduct", primaryKeyField: "nproductcode" }
            // edit
            // inputData["productmaholder"] = this.state.selectedRecord;
            inputData["productmaholder"] = JSON.parse(JSON.stringify(this.state.selectedRecord));
            this.ProductmaholderFieldList.map(item => {
                return inputData["productmaholder"][item] = this.state.selectedRecord[item] ? this.state.selectedRecord[item] : "";
            })
        } else {

            this.ProductmaholderFieldList.map(item => {
                return inputData["productmaholder"][item] = this.state.selectedRecord[item]
            });
            inputData["productmaholder"]["nproductcode"] = this.state.selectedRecord["nproductcode"] ? this.state.selectedRecord["nproductcode"] : -1;
            inputData["productmaholder"]["nauthoritycode"] = this.state.selectedRecord["nauthoritycode"] ? this.state.selectedRecord["nauthoritycode"] : -1;
            inputData["productmaholder"]["nproductmanufcode"] = this.state.selectedRecord["nproductmanufcode"] ? this.state.selectedRecord["nproductmanufcode"] : -1;
            inputData["productmaholder"]["nproductmahcode"] = this.state.selectedRecord["nproductmahcode"] ? this.state.selectedRecord["nproductmahcode"] : -1;
        }
        inputData["productmaholder"]["nmahcode"] = this.state.selectedRecord["nmahcode"] ? this.state.selectedRecord["nmahcode"].value : -1;
        inputData["productmaholder"]["ncertificatetypecode"] = this.state.selectedRecord["ncertificatetypecode"] ? this.state.selectedRecord["ncertificatetypecode"].value : -1;
        inputData["productmaholder"]["ncontainertypecode"] = this.state.selectedRecord["ncontainertypecode"] ? this.state.selectedRecord["ncontainertypecode"].value : -1;

        const inputParam = {
            classUrl: this.props.inputParam.classUrl,
            methodUrl: "ProductMaHolder",
            inputData: inputData,
            operation: this.props.operation,
            displayName: this.props.inputParam.displayName,
            saveType, formRef, selectedId, dataState, postParam
        }
        return inputParam;
    }

    componentDidUpdate(previousProps) {
        if (this.props.selectedRecord !== previousProps.selectedRecord) {
            this.setState({ selectedRecord: this.props.selectedRecord });
        }
        if (this.props.masterData !== previousProps.masterData) {
            let { dataState } = this.state;
            if (this.props.dataState === undefined) {
                dataState = { skip: 0, take: this.props.settings ? parseInt(this.props.settings[14]) : 5 }
                this.setState({ dataState,historyDataState:dataState });
            }
        }
        if (this.props.screenName === "IDS_PRODUCTMANUFACTURER") {
            if (this.props.Eprotocol !== previousProps.Eprotocol || this.props.Manufacturer !== previousProps.Manufacturer
                || this.props.ManufacturerSite !== previousProps.ManufacturerSite) {

                const Eprotocol = constructOptionList(this.props.Eprotocol || [], "neprotocolcode",
                    "seprotocolname", undefined, undefined, true);
                const EprotocolList = Eprotocol.get("OptionList");

                const Manufacturer = constructOptionList(this.props.Manufacturer || [], "nmanufcode",
                    "smanufname", undefined, undefined, true);
                const ManufacturerList = Manufacturer.get("OptionList");

                const ManufacturerSite = constructOptionList(this.props.ManufacturerSite || [], "nmanufsitecode",
                    "smanufsitename", undefined, undefined, true);
                const ManufacturerSiteList = ManufacturerSite.get("OptionList");

                this.setState({ Eprotocol: EprotocolList, Manufacturer: ManufacturerList, ManufacturerSite: ManufacturerSiteList });

            }
        }
        if (this.props.screenName === "IDS_PRODUCTMAHOLDER") {
            if (this.props.ContainerType !== previousProps.ContainerType
                || this.props.MAHolder !== previousProps.MAHolder || this.props.CertificateType !== previousProps.CertificateType) {

                const ContainerType = constructOptionList(this.props.ContainerType || [], "ncontainertypecode",
                    "scontainertype", undefined, undefined, true);
                const ContainerTypeList = ContainerType.get("OptionList");

                const MAHolder = constructOptionList(this.props.MAHolder || [], "nmahcode",
                    "smahname", undefined, undefined, true);
                const MAHolderList = MAHolder.get("OptionList");

                const CertificateType = constructOptionList(this.props.CertificateType || [], "ncertificatetypecode",
                    "scertificatetype", undefined, undefined, true);
                const CertificateTypeList = CertificateType.get("OptionList");

                this.setState({ ContainerType: ContainerTypeList, MAHolder: MAHolderList, CertificateType: CertificateTypeList });

            }

        }
    }
    onTabOnChange = (tabProps) => {
        const screenName = tabProps.screenName;
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { screenName }
        }
        this.props.updateStore(updateInfo);
    }
    validateEsign = () => {
        const inputParam = {
            inputData: {
                "userinfo": {
                    ...this.props.userInfo,
                    sreason: this.state.selectedRecord["esigncomments"],
                    nreasoncode:this.state.selectedRecord["esignreason"] && this.state.selectedRecord["esignreason"].value,
                    spredefinedreason:this.state.selectedRecord["esignreason"] && this.state.selectedRecord["esignreason"].label,
               
                },
                password: this.state.selectedRecord["esignpassword"]
            },
            screenData: this.props.screenData
        }
        this.props.validateEsignCredential(inputParam, "openChildModal");
    }
    detailedFieldList = [
        { dataField: "sproducttradename", idsName: "IDS_TRADENAME" },
        { dataField: "sdosagepercontainer", idsName: "IDS_DOSEPERCONTAINER" },
        { dataField: "scertificatetype", idsName: "IDS_CERTIFICATETYPE" },
        { dataField: "sauthorityshortname", idsName: "IDS_LICENSEAUTHORITY" },
        { dataField: "scontainertype", idsName: "IDS_CONTAINERTYPE" },
        { dataField: "smahname", idsName: "IDS_MAHNAME" },
        { dataField: "saddress1", idsName: "IDS_ADDRESS1" },
        { dataField: "saddress2", idsName: "IDS_ADDRESS2" },
        { dataField: "saddress3", idsName: "IDS_ADDRESS3" },
        { dataField: "scountryname", idsName: "IDS_COUNTRYNAME" }
    ];
    extractedColumnList = [{ "fieldLength": "40", "mandatory": true, "controlType": "textbox", "idsName": "IDS_PRODUCTCERTIFICATENAME", "dataField": "sproductcertificatename", "width": "200px" },
    { "fieldLength": "40", "mandatory": true, "controlType": "textbox", "idsName": "IDS_LICENCENUMBER", "dataField": "slicencenumber", "width": "110px" },
    { "fieldLength": "40", "mandatory": true, "controlType": "textbox", "idsName": "IDS_STATUS", "dataField": "stransdisplaystatus", "width": "110px" }
    ]

    extractedHistoryColumnList = [
        { "fieldLength": "40", "mandatory": true, "controlType": "textbox", "idsName": "IDS_APPROVALSTATUS", "dataField": "stransdisplaystatus", "width": "150px" },
        { "fieldLength": "40", "mandatory": true, "controlType": "textbox", "idsName": "IDS_USERNAME", "dataField": "sfirstname", "width": "150px" },
        { "fieldLength": "40", "mandatory": true, "controlType": "textbox", "idsName": "IDS_USERROLE", "dataField": "suserrolename", "width": "150px" },
        { "fieldLength": "40", "mandatory": true, "controlType": "textbox", "idsName": "IDS_APPROVALDATE", "dataField": "stransactiondate", "width": "150px" },
        { "fieldLength": "40", "mandatory": true, "controlType": "textbox", "idsName": "IDS_COMMENTS", "dataField": "scomments", "width": "100px" }
    ]
}

export default injectIntl(ProductTabs);