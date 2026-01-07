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
import { showEsign } from '../../components/CommonScript';
//import DataGrid from '../../components/DataGrid';
import SupplierTabs from './SupplierTabs';
import { transactionStatus } from '../../components/Enumeration';
import CustomTabs from '../../components/custom-tabs/custom-tabs.component';

class SupplierCategory extends React.Component {

    constructor(props) {
        super(props);
        const dataState = {
            skip: 0,
            take: 10,
        };
        const dataStateMaterial = {
            skip: 0,
            take: 10,
        };
        this.state = {
            isOpen: false, selectedRecord: {}, dataResult: [],
            activeTab: 'SupplierCategory-tab',
            dataState: dataState,
            dataStateMaterial: dataStateMaterial
        };
        this.supplerCategoryFieldList = ['nsuppliercode', 'ncategorycode', 'ntypecode', 'ssuppliercatname', 'smaterialcatname',
            'sremarks', 'ntransactionstatus'];
        this.suppliercatColumnList = [{ "idsName": "IDS_SUPPLIERCATNAME", "dataField": "ssuppliercatname", "width": "200px" }];
        this.materialcatColumnList = [{ "idsName": "IDS_MATERIALCATNAME", "dataField": "smaterialcatname", "width": "200px" }];
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
        return (
            <>
                <Row className="no-gutters">
                    <Col md={12}>
                        <Card className="at-tabs">
                            <CustomTabs tabDetail={this.tabDetail()} />
                        </Card>
                    </Col>
                </Row>
                {this.props.openChildModal &&
                    <SlideOutModal show={this.props.openChildModal}
                        closeModal={this.closeModal}
                        operation={this.props.operation}
                        inputParam={this.props.inputParam}
                        screenName={this.props.screenName}
                        onSaveClick={this.onSaveClick}
                        updateStore={this.props.updateStore}
                        esign={this.props.loadEsign}
                        validateEsign={this.validateEsign}
                        addComponent={this.props.loadEsign ?
                            <Esign operation={this.props.operation}
                                onInputOnChange={this.onInputOnChange}
                                inputParam={this.props.inputParam}
                                selectedRecord={this.state.selectedRecord || {}}
                            /> :
                            this.props.screenName === "SupplierCategory" ?
                                <AddSupplierCategory selectedRecord={this.state.selectedRecord || {}}
                                    onInputOnChange={this.onInputOnChange}
                                    onComboChange={this.onComboChange}
                                    selectedSupplierCategory={this.props.masterData.selectedSupplierCategory}
                                    supplierCategory={this.props.supplierCategory || []}
                                />
                                : <AddMaterialCategory selectedRecord={this.state.selectedRecord || {}}
                                    onInputOnChange={this.onInputOnChange}
                                    onComboChange={this.onComboChange}
                                    operation={this.props.operation}
                                    selectedMaterialCategory={this.props.masterData.selectedMaterialCategory}
                                    materialCategory={this.props.materialCategory}
                                />

                        }

                    />
                }
            </>

        )

    }

    tabDetail = () => {
        const addSupCatId = this.props.controlMap.has("AddSupplierCategory") && this.props.controlMap.get("AddSupplierCategory").ncontrolcode

        const deleteSupCatId = this.props.controlMap.has("DeleteSupplierCategory") && this.props.controlMap.get("DeleteSupplierCategory").ncontrolcode

        const addMatCatId = this.props.controlMap.has("AddMaterialCategory") && this.props.controlMap.get("AddMaterialCategory").ncontrolcode

        const deleteMatCatId = this.props.controlMap.has("DeleteMaterialCategory") && this.props.controlMap.get("DeleteMaterialCategory").ncontrolcode

        const supcatAddParam = {
            screenName: "SupplierCategory", operation: "create", primaryKeyField: "nsuppliercatcode",
            masterData: this.props.masterData, userInfo: this.props.userInfo, ncontrolCode: addSupCatId
        };

        const supcatDeleteParam = { screenName: "SupplierCategory", methodUrl: "SupplierMatrix", operation: "delete", ncontrolCode: deleteSupCatId };

        const matericatAddParam = {
            screenName: "MaterialCategory", operation: "create", primaryKeyField: "nmaterialcatcode",
            masterData: this.props.masterData, userInfo: this.props.userInfo, ncontrolCode: addMatCatId
        };

        const materialcatDeleteParam = { screenName: "MaterialCategory", methodUrl: "SupplierMatrix", operation: "delete", ncontrolCode: deleteMatCatId };

        const tabMap = new Map();
        tabMap.set("IDS_SUPPLIERCATEGORY", <SupplierTabs userRoleControlRights={this.props.userRoleControlRights}
            controlMap={this.props.controlMap}
            inputParam={this.props.inputParam}
            userInfo={this.props.userInfo}
            addId={addSupCatId}
            addParam={supcatAddParam}
            comboDataService={this.props.getSupplierCategoryComboDataService}
            addTitleIDS={"IDS_ADDSUPPLIERCATEGORY"}
            addTitleDefaultMsg={'Add SupplierCategory'}
            primaryKeyField={"nsuppliercatcode"}
            masterData={this.props.masterData}
            primaryList={"SupplierCategory"}
            dataResult={process(this.props.masterData["SupplierCategory"], this.state.dataStateMaterial)}
            dataState={this.state.dataState}
            dataStateChange={this.supplierDataStateChange}
            columnList={this.suppliercatColumnList}
            methodUrl={"SupplierMatrix"}
            deleteRecord={this.deleteRecord}
            deleteParam={supcatDeleteParam}
            selectedId={this.props.selectedId}
        />)
        tabMap.set("IDS_MATERIALCATEGORY", <SupplierTabs userRoleControlRights={this.props.userRoleControlRights}
            controlMap={this.props.controlMap}
            inputParam={this.props.inputParam}
            userInfo={this.props.userInfo}
            addId={addMatCatId}
            addParam={matericatAddParam}
            comboDataService={this.props.getMaterialCategoryComboDataService}
            addTitleIDS={"IDS_ADDMATERIALCATEGORY"}
            addTitleDefaultMsg={'Add MaterialCategory'}
            primaryKeyField={"nmaterialcatcode"}
            masterData={this.props.masterData}
            primaryList={"MaterialCategory"}
            dataResult={process(this.props.masterData["MaterialCategory"], this.state.dataStateMaterial)}
            dataState={this.state.dataStateMaterial}
            dataStateChange={this.materialDataStateChange}
            columnList={this.materialcatColumnList}
            methodUrl={"SupplierMatrix"}
            deleteRecord={this.deleteRecord}
            deleteParam={materialcatDeleteParam}
            selectedId={this.props.selectedId}
        />)
        return tabMap;
    }


    closeModal = () => {
        let loadEsign = this.props.loadEsign;
        let openChildModal = this.props.openChildModal;
        if (this.props.loadEsign) {
            if (this.props.operation === "delete") {
                loadEsign = false;
                openChildModal = false;
            }
            else {
                loadEsign = false;
            }
        }
        else {
            openChildModal = false;
        }

        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { openChildModal, loadEsign }
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
    }

    onInputOnChange = (event) => {
        const selectedRecord = this.state.selectedRecord || {};
        if (event.target.type === 'checkbox') {
            if (event.target.name === "ntransactionstatus")
                selectedRecord[event.target.name] = event.target.checked === true ? transactionStatus.ACTIVE : transactionStatus.DEACTIVE;
            // else if (event.target.name === "nlockmode")
            //     selectedRecord[event.target.name] = event.target.checked === true ? transactionStatus.UNLOCK : transactionStatus.LOCK;
            else
                selectedRecord[event.target.name] = event.target.checked === true ? transactionStatus.YES : transactionStatus.NO;
        }
        else {
            selectedRecord[event.target.name] = event.target.value;
        }
        this.setState({ selectedRecord });
    }


    componentDidUpdate(previousProps) {
        if (this.props.masterData !== previousProps.masterData) {

            let { dataState, dataStateMaterial } = this.state;
            if (this.props.dataState === undefined) {
                if (this.props.screenName === 'SupplierCategory') {
                    dataState = { skip: 0, take: 10 }
                }
                if (this.props.screenName === 'MaterialCategory') {

                    dataStateMaterial = { skip: 0, take: 10 }
                }
                this.setState({ dataState, dataStateMaterial });
            }

            let isOpen = false;
            if (this.props.errorCode !== undefined && (this.state.operation === "create" || this.state.operation === "update")) {
                isOpen = true;
            }
            this.setState({ isOpen, activeTab: 'SupplierCategory-tab', dataState, dataStateMaterial });
        }

        if (this.props.selectedRecord !== previousProps.selectedRecord) {
            this.setState({ selectedRecord: this.props.selectedRecord });
        }

    }


    onSaveClick = (saveType, formRef) => {
        //add / edit  
        let inputParam = {};

        if (this.props.screenName === "SupplierCategory") {
            inputParam = this.saveSupplierCategory(saveType, formRef);
        }
        else if (this.props.screenName === "MaterialCategory") {
            inputParam = this.saveMaterial(saveType, formRef);
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

    saveSupplierCategory(saveType, formRef) {
        let inputData = [];
        inputData["userinfo"] = this.props.userInfo;
        inputData["supplier"] = this.props.masterData.SelectedSupplier;
        inputData["suppliermatrix"] = {};
        let dataState = undefined;

        let suppliermatrixArray = []
        suppliermatrixArray = this.state.selectedRecord.nsuppliercatcode.map(item => {
            let suppliermat = {}
            suppliermat["nsuppliercode"] = this.props.masterData.SelectedSupplier.nsuppliercode; //this.state.selectedRecord["nmahcode"] ? this.state.selectedRecord["nmahcode"].value : "";
            suppliermat["ntypecode"] = 1;
            suppliermat["sremarks"] = "a";
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
            suppliermat["sremarks"] = "b";
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


    deleteRecord = (supplierparam) => {
        if (this.props.masterData.SelectedSupplier.ntransactionstatus === transactionStatus.RETIRED) {
            toast.warn(this.props.intl.formatMessage({ id: this.props.masterData.SelectedSupplier.stranstatus }));
        }
        else {
            const inputParam = {
                classUrl: "suppliermatrix",
                methodUrl: supplierparam.methodUrl,
                inputData: {
                    [supplierparam.methodUrl.toLowerCase()]: supplierparam.selectedRecord,
                    "userinfo": this.props.userInfo,

                },
                operation: supplierparam.operation,
                //dataState: this.state.dataState,
                //dataStateMaterial: this.state.dataStateMaterial
                dataState: this.props.screenName === 'SupplierCategory' ? this.state.dataState :
                    this.props.screenName === 'MaterialCategory' ? this.state.dataStateMaterial : ''
            }

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
}

export default injectIntl(SupplierCategory);

