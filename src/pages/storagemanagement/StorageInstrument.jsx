import React from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { process } from '@progress/kendo-data-query';
import DataGrid from '../../components/data-grid/data-grid.component';
import { ListWrapper } from '../../components/client-group.styles';
import AddStorageInstrument from '../storagemanagement/AddStorageInstrument';
import SlideOutModal from '../../components/slide-out-modal/SlideOutModal';
import Esign from '../audittrail/Esign';
import { DEFAULT_RETURN } from '../../actions/LoginTypes';

import {
    callService, crudMaster,
    updateStore, validateEsignCredential, getStorageStructure, getActiveStorageInstrument, getInstrumentByCategory, addComServiceStorageInstrument, getBarcodeDataCollection, saveCollection, getActiveSampleCollectionById, getSampleCollection, validateEsignCredentialSampleCollection,getStorageInstrumentCategoryByInstrumentType
} from '../../actions';
import { getControlMap, Lims_JSON_stringify,showEsign } from '../../components/CommonScript'


const mapStateToProps = state => {
    return ({ Login: state.Login })
}

class StorageInstrument extends React.Component {
    constructor(props) {
        super(props);
        this.searchRef = React.createRef();

        const dataState = {
            skip: 0,
            take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5,
        };
        this.state = {
            data: [], masterStatus: "", error: "", selectedRecord: {},
            dataResult: [],
            dataState: dataState,
            userRoleControlRights: [],
            controlMap: new Map(),
        };
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
            }
            else {
                loadEsign = false;
                selectedRecord['esignpassword'] = ""
                selectedRecord['esignreason'] = ""
                selectedRecord['esigncomments'] = ""
            }
        }
        else {
            openModal = false;
            selectedRecord = {};
        }

        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { openModal, loadEsign, selectedRecord }
        }

        this.props.updateStore(updateInfo);
    }


    dataStateChange = (event) => {
        this.setState({
            dataResult: process(this.state.data, event.dataState),
            dataState: event.dataState
        });
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


        this.props.validateEsignCredential(inputParam, "openModal");
    }


    render() {



        this.extractedColumnList = [
            { "idsName": "IDS_STORAGECATEGORY", "dataField": "sstoragecategoryname", "width": "200px" },
            { "idsName": "IDS_STORAGESTRUCTURE", "dataField": "ssamplestoragelocationname", "width": "200px" },
            { "idsName": "IDS_STORAGECONDITION", "dataField": "sstorageconditionname", "width": "200px" },
             { "idsName": "IDS_INSTRUMENTTYPE", "dataField": "sinstrumenttype", "width": "200px" },
            { "idsName": "IDS_INSTRUMENTCATEGORY", "dataField": "sinstrumentcatname", "width": "200px" },
            { "idsName": "IDS_INSTRUMENT", "dataField": "sinstrumentid", "width": "200px" }

        ]

        const addId = this.state.controlMap.has("AddStorageInstrument") && this.state.controlMap.get("AddStorageInstrument").ncontrolcode;
        const editId = this.state.controlMap.has("EditStorageInstrument") && this.state.controlMap.get("EditStorageInstrument").ncontrolcode;
        const deleteId = this.state.controlMap.has("DeleteStorageInstrument") && this.state.controlMap.get("DeleteStorageInstrument").ncontrolcode;

        const editParam = {
            screenName: this.props.Login.displayName,
            operation: "update",
            userInfo: this.props.Login.userInfo,
            ncontrolcode: editId,
            masterData: this.props.Login.masterData,
            inputParam: this.props.Login.inputParam,
            primaryKeyField: "nstorageinstrumentcode",
            selectedRecord: this.state.selectedRecord || {},
            dataState: this.state.dataState


        };
        const addParam = {
            screenName: this.props.Login.displayName, primaryKeyField: "nstorageinstrumentcode", primaryKeyValue: undefined,
            operation: "create", inputParam: this.props.Login.inputParam, userInfo: this.props.Login.userInfo, ncontrolcode: addId,
            selectedRecord: this.state.selectedRecord,
            masterData: this.props.Login.masterData
        };
        //ALPD-4618--Vignesh R(01-08-2024)
        const deleteParam = { operation: "delete", ncontrolcode: deleteId, selectedRecord: this.state.selectedRecord };


        return (
            <>
                <Row>
                    <Col>
                        <ListWrapper className="client-list-content">
                            {this.state.data ?
                                <DataGrid
                                    primaryKeyField={"nstorageinstrumentcode"}
                                    data={this.state.data}
                                    dataResult={this.state.dataResult}
                                    dataState={this.state.dataState}
                                    dataStateChange={this.dataStateChange}
                                    extractedColumnList={this.extractedColumnList}
                                    reloadData={this.reloadData}
                                    controlMap={this.state.controlMap}
                                    userRoleControlRights={this.state.userRoleControlRights}
                                    inputParam={this.props.Login.inputParam}
                                    userInfo={this.props.Login.userInfo}
                                    scrollable={"scrollable"}
                                    pageable={true}
                                    isComponent={true}
                                    gridHeight={'600px'}
                                    isToolBarRequired={true}
                                    isActionRequired={true}
                                    expandField="expanded"
                                    selectedId={this.props.Login.selectedId}
                                    addRecord={() => this.props.addComServiceStorageInstrument(addParam)}
                                    deleteParam={deleteParam}
                                    deleteRecord={this.deleteRecord}
                                    fetchRecord={this.props.getActiveStorageInstrument}
                                    editParam={editParam}
                                    //ATE234 Janakumar ALPD-5577 Sample Storage-->while download the pdf, screen getting freezed
                                    isDownloadPDFRequired={true}
                                    isDownloadExcelRequired={true}
                                />
                                : ""}
                        </ListWrapper>
                    </Col>
                </Row>


                {this.props.Login.openModal &&
                    <SlideOutModal show={this.props.Login.openModal}
                        closeModal={this.closeModal}
                        operation={this.props.Login.operation}
                        inputParam={this.props.Login.inputParam}
                        screenName={this.props.Login.screenName}
                        onSaveClick={this.onSaveClick}
                        size={'lg'}
                        esign={this.props.Login.loadEsign}
                        validateEsign={this.validateEsign}
                        masterStatus={this.props.Login.masterStatus}
                        updateStore={this.props.updateStore}
                        selectedRecord={this.state.selectedRecord || {}}
                        showSaveContinue={true}
                        mandatoryFields={[
                            { "mandatory": true, "idsName": "IDS_STORAGECATEGORY", "dataField": "nstoragecategorycode", "width": "250px", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
                            { "mandatory": true, "idsName": "IDS_STORAGESTRUCTURE", "dataField": "nsamplestoragelocationcode", "width": "250px", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
                            { "mandatory": true, "idsName": "IDS_STORAGECONDITION", "dataField": "nstorageconditioncode", "width": "250px", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
                            { "mandatory": true, "idsName": "IDS_INSTRUMENTTYPE", "dataField": "ninstrumenttypecode", "width": "250px", "controlType": "selectbox", "mandatoryLabel": "IDS_SELECT" },
                            { "mandatory": true, "idsName": "IDS_INSTRUMENTCATNAME", "dataField": "ninstrumentcatcode", "width": "250px", "controlType": "selectbox", "mandatoryLabel": "IDS_SELECT" },
                            { "mandatory": true, "idsName": "IDS_INSTRUMENT", "dataField": "ninstrumentcode", "width": "250px", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" }

                        ]}

                        addComponent={this.props.Login.loadEsign ?
                            <Esign
                                operation={this.props.Login.operation}
                                //formatMessage={this.props.intl.formatMessage}
                                onInputOnChange={this.onInputOnChange}
                                inputParam={this.props.Login.inputParam}
                                selectedRecord={this.state.selectedRecord || {}}
                            />
                            : <AddStorageInstrument
                                // autoSaveGetDataCollection={this.autoSaveGetDataCollection}
                                //barcodedata={this.props.Login.masterData.barcodedata}
                                //barcodeFields={this.props.Login.masterData.jsondataBarcodeFields}
                                instruemntCategory={this.props.Login.instruemntCategory}
                                instrument={this.props.Login.instrument}
                                storageCondition={this.props.Login.storageCondition}
                                selectedRecord={this.state.selectedRecord || {}}
                                onInputOnChange={this.onInputOnChange}
                                onComboChange={this.onComboChange}
                                formatMessage={this.props.intl.formatMessage}
                                operation={this.props.Login.operation}
                                storageCategory={this.props.Login.storageCategory}
                                storageStructure={this.props.Login.storageStructure}
                                instrumentType={this.props.Login.instrumentType}
                                userInfo={this.props.Login.userInfo}
                            // handleDateChangeSlidout={this.handleDateChangeSlidout}
                            //selectedProjectType={this.props.Login.masterData.selectedProjectType}

                            />}
                    />
                }
            </>
        );
    }
    deleteRecord = (deleteParam) => {
        const inputParam = {
            classUrl: this.props.Login.inputParam.classUrl,
            methodUrl: this.props.Login.inputParam.methodUrl,
            displayName: this.props.Login.displayName,
            inputData: {
                [this.props.Login.inputParam.methodUrl.toLowerCase()]: { ...deleteParam.selectedRecord },
                "userinfo": this.props.Login.userInfo,
            },
            operation: deleteParam.operation,
            dataState: this.state.dataState
        }

        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, deleteParam.ncontrolCode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData: this.props.Login.masterData },
                    openModal: true, screenName: this.props.intl.formatMessage({ id: this.props.Login.displayName }),
                    operation: deleteParam.operation
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.crudMaster(inputParam, this.props.Login.masterData, "openModal");
        }
    }


    onSaveClick = (saveType, formRef) => {
        let selectedRecord = this.state.selectedRecord || {};
        let dataState = undefined;
        let selectedId = null;

        let inputData = {};
        inputData["storageinstrument"] = {};
        inputData["userinfo"] = {
            ...this.props.Login.userInfo,
            sformname: Lims_JSON_stringify(this.props.Login.userInfo.sformname),
            smodulename: Lims_JSON_stringify(this.props.Login.userInfo.smodulename)
        }
        if (this.props.Login.operation === "create") {


            inputData["storageinstrument"]["nstoragecategorycode"] = selectedRecord && selectedRecord["nstoragecategorycode"] && selectedRecord["nstoragecategorycode"].value || -1;
            inputData["storageinstrument"]["nsamplestoragelocationcode"] = selectedRecord && selectedRecord["nsamplestoragelocationcode"] && selectedRecord["nsamplestoragelocationcode"].value || -1;
            inputData["storageinstrument"]["nsamplestorageversioncode"] = selectedRecord && selectedRecord["nsamplestoragelocationcode"] && selectedRecord["nsamplestoragelocationcode"].item.nsamplestorageversioncode || -1;
            inputData["storageinstrument"]["nstorageconditioncode"] = selectedRecord && selectedRecord["nstorageconditioncode"] && selectedRecord["nstorageconditioncode"].value || -1;
            inputData["storageinstrument"]["ninstrumentcatcode"] = selectedRecord && selectedRecord["ninstrumentcatcode"] && selectedRecord["ninstrumentcatcode"].value || -1;
            inputData["storageinstrument"]["ninstrumenttypecode"] = selectedRecord && selectedRecord["ninstrumenttypecode"] && selectedRecord["ninstrumenttypecode"][0].value || -1;
            inputData["storageinstrument"]["sinstrumentcode"] = selectedRecord.ninstrumentcode.map(item => item.value).join(",");
            inputData["storageinstrument"]["sinstrumentid"] = selectedRecord.ninstrumentcode.map(item => item.label).join(",");

        }
        else if (this.props.Login.operation === "update") {

            inputData["storageinstrument"]["nstorageinstrumentcode"] = this.props.Login.selectedId || -1;
            inputData["storageinstrument"]["nstoragecategorycode"] = selectedRecord && selectedRecord["nstoragecategorycode"] && selectedRecord["nstoragecategorycode"].value || -1;
            inputData["storageinstrument"]["nsamplestoragelocationcode"] = selectedRecord && selectedRecord["nsamplestoragelocationcode"] && selectedRecord["nsamplestoragelocationcode"].value || -1;
            inputData["storageinstrument"]["nstorageconditioncode"] = selectedRecord && selectedRecord["nstorageconditioncode"] && selectedRecord["nstorageconditioncode"].value || -1;
            inputData["storageinstrument"]["ninstrumentcatcode"] = selectedRecord && selectedRecord["ninstrumentcatcode"] && selectedRecord["ninstrumentcatcode"].value || -1;
             inputData["storageinstrument"]["ninstrumenttypecode"] = selectedRecord && selectedRecord["ninstrumenttypecode"] && selectedRecord["ninstrumenttypecode"].value || -1;
            inputData["storageinstrument"]["sinstrumentid"] = selectedRecord.ninstrumentcode.label;

        }
        let clearSelectedRecordField = [];

        if (this.props.Login.operation == "update") {
            dataState = this.state.dataState;
            selectedId = this.props.Login.selectedId;
        }

        const inputParam = {
            nformcode: this.props.Login.userInfo.nformcode,
            classUrl: "storageinstrument",
            methodUrl: "StorageInstrument",
            inputData: inputData,
            operation: this.props.Login.operation,
            saveType, formRef, dataState, selectedId,
            selectedRecord: this.state.selectedRecord || {}
        }

        const masterData = this.props.Login.masterData;

        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolcode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData }, saveType
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.crudMaster(inputParam, masterData, "openModal");
        }




    }

    onComboChange = (comboData, fieldName) => {
        const selectedRecord = this.state.selectedRecord || {};

        if (fieldName === "nstoragecategorycode") {
            let inputData = [];
            selectedRecord[fieldName] = comboData;
            inputData = {
                userinfo: this.props.Login.userInfo,
                nstoragecategorycode: parseInt(comboData.value),
				selectedRecord: selectedRecord
            }
            this.props.getStorageStructure(inputData);

        }
        else if (fieldName === "ninstrumentcatcode") {
            let inputData = [];
            selectedRecord[fieldName] = comboData;
            inputData = {
                userinfo: this.props.Login.userInfo,
                ninstrumentcatcode: parseInt(comboData.value),
                nsamplestoragelocationcode: selectedRecord && selectedRecord["nsamplestoragelocationcode"] && selectedRecord["nsamplestoragelocationcode"].value || -1,
                nsamplestorageversioncode: selectedRecord && selectedRecord["nsamplestoragelocationcode"] && selectedRecord["nsamplestoragelocationcode"].item.nsamplestorageversioncode || -1,

            }
            this.props.getInstrumentByCategory(inputData, selectedRecord);

        }
        else if (fieldName === "ninstrumenttypecode") {
            let inputData = [];
            selectedRecord[fieldName] = comboData;
            inputData = {
                userinfo: this.props.Login.userInfo,
                ninstrumenttypecode: parseInt(comboData.value),
                nsamplestoragelocationcode: selectedRecord && selectedRecord["nsamplestoragelocationcode"] && selectedRecord["nsamplestoragelocationcode"].value || -1,
                nsamplestorageversioncode: selectedRecord && selectedRecord["nsamplestoragelocationcode"] && selectedRecord["nsamplestoragelocationcode"].item.nsamplestorageversioncode || -1,

            }
            this.props.getStorageInstrumentCategoryByInstrumentType(inputData, selectedRecord);

        }

        else {
            selectedRecord[fieldName] = comboData;

            this.setState({ selectedRecord });
        }
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
                    userRoleControlRights, controlMap, data: this.props.Login.masterData.StorageInstrument,
                    dataResult: process(this.props.Login.masterData.StorageInstrument || [], this.state.dataState),
                });
            } else {


                let { dataState } = this.state;
                if (this.props.Login.dataState === undefined || this.props.Login.masterData.selectedProjectType !== previousProps.Login.masterData.selectedProjectType) {
                    dataState = { skip: 0, take: this.state.dataState.take }
                }
                if (this.state.dataResult.data) {
                    if (this.state.dataResult.data.length === 1) {
                        let skipcount = this.state.dataState.skip > 0 ? (this.state.dataState.skip - this.state.dataState.take) :
                            this.state.dataState.skip
                        dataState = { skip: skipcount, take: this.state.dataState.take }
                    }

                }

                this.setState({
                    data: this.props.Login.masterData.StorageInstrument, selectedRecord: this.props.Login.selectedRecord,
                    dataResult: process(this.props.Login.masterData.StorageInstrument || [], dataState),
                    dataState
                });
            }
        }

        if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord) {
            //Get selected value when clicking edit button
            if (this.props.Login.selectedRecord) {
                this.setState({ selectedRecord: { ...this.props.Login.selectedRecord } });
            }
        }
    }

    onInputOnChange = (event) => {
        const selectedRecord = this.state.selectedRecord || {};
        if (event.target.name === "agree") {
            selectedRecord[event.target.name] = event.target.checked === true ? 3 : 4;
        } else {
            selectedRecord[event.target.name] = event.target.value;
        }
        this.setState({ selectedRecord });
    }


    reloadData = () => {
        const inputParam = {
            inputData: { "userinfo": this.props.Login.userInfo },
            classUrl: this.props.Login.inputParam.classUrl,
            methodUrl: this.props.Login.inputParam.methodUrl,
            //ALPDJ21-33--Added by Vignesh(22-09-2025)--Screen name disappears when add the data and refresh the screen.
            displayName: this.props.Login.screenName,
            userInfo: this.props.Login.userInfo
        };

        this.props.callService(inputParam);
    }


}
export default connect(mapStateToProps, {
    callService, crudMaster,
    updateStore, validateEsignCredential, getInstrumentByCategory, getActiveStorageInstrument, addComServiceStorageInstrument, getStorageStructure, getBarcodeDataCollection, saveCollection, getActiveSampleCollectionById, getSampleCollection, validateEsignCredentialSampleCollection,getStorageInstrumentCategoryByInstrumentType
})(injectIntl(StorageInstrument));