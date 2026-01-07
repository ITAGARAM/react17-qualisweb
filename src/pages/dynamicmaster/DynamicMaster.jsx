import React from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { process } from '@progress/kendo-data-query';
import DynamicDataGrid from '../../components/data-grid/data-grid.component';
import SlideOutModal from '../../components/slide-out-modal/SlideOutModal';
import Esign from '../../pages/audittrail/Esign';
import {
    callService, crudMaster, updateStore, validateEsignCredential,
    getEditDynamicMasterCombo,
    //fetchRecord,
    getDynamicMasterCombo, getChildValues,
    addMasterRecord, getAddMasterCombo, getDynamicMasterTempalte,
    getChildComboMaster, getChildValuesForAddMaster, getEditMaster, viewAttachment, openBarcodeModal,barcodeGeneration
} from '../../actions';
import { DEFAULT_RETURN } from '../../actions/LoginTypes';
import {
    showEsign, getControlMap, deleteAttachmentDropZone,
    getSameRecordFromTwoArrays, onDropAttachFileList, convertDateTimetoString, create_UUID,
    validateEmail, formatDate, sortData, ageCalculate, formatInputDate, extractFieldHeader, childComboClear, Lims_JSON_stringify, conditionBasedInput
} from '../../components/CommonScript';
import { ListWrapper } from '../../components/client-group.styles';
import DynamicSlideout from '../dynamicpreregdesign/DynamicSlideout.jsx';
import { designComponents, transactionStatus,formCode } from '../../components/Enumeration';
import { getFieldSpecification } from '../../components/type2component/Type2FieldSpecificationList';
import AddMasterRecords from '../dynamicpreregdesign/AddMasterRecords'
import { getFieldSpecification as getFieldSpecification1 } from '../../components/type1component/Type1FieldSpecificationList';
import { getFieldSpecification as getFieldSpecification3 } from '../../components/type3component/Type3FieldSpecificationList';
import ImportTemplate from './ImportTemplate';
import AddBarcode from '../BarcodeTemplate/AddBarcode';

const mapStateToProps = state => {
    return ({ Login: state.Login })
}

class DynamicMaster extends React.Component {
    constructor(props) {
        super(props)

        this.formRef = React.createRef();
        this.extractedColumnList = [];
        this.detailedColumnList = [];
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
            comboComponents: [],
            withoutCombocomponent: [],
            selectedMaster: []
        };
    }

    dataStateChange = (event) => {
        this.setState({
            dataResult: process(this.state.data || [], event.dataState),
            dataState: event.dataState
        });
    }

    removeIndex = (data, removeIndex) => {
        const data1 = [...data.splice(0, removeIndex), ...data.splice(removeIndex + 1)]
        return data1
    }

    closeModal = () => {
        let loadEsign = this.props.Login.loadEsign;
        let openModal = this.props.Login.openModal;
        let selectedRecord = this.props.Login.selectedRecord;
        let selectedMaster = this.props.Login.selectedMaster;
        let selectedControl = this.props.Login.selectedControl;
        let masterextractedColumnList = this.props.Login.masterextractedColumnList;
        let masterfieldList = this.props.Login.masterfieldList;
        let masterdataList = this.props.Login.masterfieldList;
        let mastercomboComponents = this.props.Login.masterfieldList;
        let masterwithoutCombocomponent = this.props.Login.masterfieldList;
        let masterComboColumnFiled = this.props.Login.masterComboColumnFiled;
        let masterOperation = this.props.Login.masterOperation
        let masterEditObject = this.props.Login.masterEditObject
        let masterDesign = this.props.Login.masterDesign;
        let addMaster = this.props.Login.addMaster
        let masterIndex = this.props.Login.masterIndex
        let screenName = this.props.Login.screenName

        if (this.props.Login.loadEsign) {
            if (this.props.Login.operation === "delete") {
                loadEsign = false;
                openModal = false;
                selectedRecord = {};
            }
            else {
                loadEsign = false;
                selectedRecord['esignpassword'] = ""
                selectedRecord['esigncomments'] = ""
                selectedRecord['esignreason'] = ""
            }
        } else if (this.props.Login.addMaster) {
            if (masterIndex !== 0) {
                screenName = selectedControl[masterIndex - 1].displayname[this.props.Login.userInfo.slanguagetypecode]
                selectedMaster = this.removeIndex(selectedMaster, masterIndex)
                selectedControl = this.removeIndex(selectedControl, masterIndex)
                masterextractedColumnList = masterextractedColumnList && this.removeIndex(masterextractedColumnList, masterIndex)
                masterfieldList = masterfieldList && this.removeIndex(masterfieldList, masterIndex)
                masterdataList = masterdataList && this.removeIndex(masterdataList, masterIndex)
                mastercomboComponents = mastercomboComponents && this.removeIndex(mastercomboComponents, masterIndex)
                masterComboColumnFiled = masterComboColumnFiled && this.removeIndex(masterComboColumnFiled, masterIndex)
                masterwithoutCombocomponent = masterwithoutCombocomponent && this.removeIndex(masterwithoutCombocomponent, masterIndex)
                masterDesign = masterDesign && this.removeIndex(masterDesign, masterIndex)
                masterOperation = masterOperation && this.removeIndex(masterOperation, masterIndex)
                masterEditObject = masterEditObject && this.removeIndex(masterEditObject, masterIndex)
                masterIndex = masterIndex - 1;
                //  masterprimaryKeyField = ""
                //addMaster = false
            } else {
                selectedMaster = []
                selectedControl = []
                masterextractedColumnList = []
                masterfieldList = []
                addMaster = false
                masterdataList = []
                mastercomboComponents = []
                masterwithoutCombocomponent = []
                masterComboColumnFiled = []
                masterDesign = []
                masterOperation = []
                masterEditObject = []
                masterIndex = undefined
                screenName = this.props.Login.inputParam.displayName
            }

        }
        else {
            openModal = false;
            selectedRecord = {};
            selectedMaster = []
            selectedControl = []
            masterextractedColumnList = []
            masterfieldList = []
            addMaster = false
            masterdataList = []
            mastercomboComponents = []
            masterwithoutCombocomponent = []
            masterComboColumnFiled = []
            masterDesign = []
            masterOperation = []
            masterEditObject = []
            masterIndex = undefined
        }

        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                openModal, loadEsign,
                selectedRecord, selectedId: null, selectedMaster, selectedControl,
                masterextractedColumnList, masterfieldList
                , addMaster, masterIndex, masterdataList,
                mastercomboComponents,
                masterwithoutCombocomponent,
                masterComboColumnFiled, masterDesign, screenName, masterOperation,
                masterEditObject,
            }
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

    render() {

        let primaryKeyField = "ndynamicmastercode";
        let viewFileURL = {
            "classUrl": "dynamicmaster",
            "methodUrl": "DynamicMaster", "screenName": "DynamicMaster"
        };

        const editId = this.props.Login.inputParam && this.state.controlMap.has("Edit")
            && this.state.controlMap.get("Edit").ncontrolcode;

        const editParam = {
            screenName: this.props.Login.inputParam && this.props.Login.inputParam.displayName
                && this.props.intl.formatMessage({ id: this.props.Login.inputParam.displayName }), operation: "update", primaryKeyField,
            inputParam: this.props.Login.inputParam, userInfo: this.props.Login.userInfo, ncontrolCode: editId
        };

        const deleteParam = { operation: "delete" };

        // const mandatoryFields=[];
        // this.extractedColumnList.forEach(item=>item.mandatory === true ? 
        //     mandatoryFields.push(item) :""
        // );   

        return (<>
            <Row>
                <Col>
                    <ListWrapper className="client-list-content">
                        {this.state.data ?
                            <DynamicDataGrid
                                primaryKeyField={primaryKeyField}
                                data={this.state.data}
                                dataResult={this.state.dataResult}
                                dataState={this.state.dataState}
                                dataStateChange={this.dataStateChange}
                                extractedColumnList={this.extractedColumnList}
                                detailedFieldList={this.detailedColumnList}
                                exportFieldList={this.extractedColumnList}
                                expandField={this.detailedColumnList.length > 0 ? "expanded" : false}
                                methodUrl={""}
                                controlMap={this.state.controlMap}
                                userRoleControlRights={this.state.userRoleControlRights}
                                inputParam={this.props.Login.inputParam}
                                userInfo={this.props.Login.userInfo}
                                fetchRecord={this.fetchRecord}
                                editParam={editParam}
                                deleteRecord={this.deleteRecord}
                                deleteParam={deleteParam}
                                reloadData={this.reloadData}
                                addRecord={this.openModal}
                                pageable={true}
                                scrollable={'scrollable'}
                                gridHeight={'600px'}
                                isActionRequired={true}
                                isToolBarRequired={true}
                                selectedId={this.props.Login.selectedId}
                                import={this.import}
                                screenName={this.props.Login.displayName}
                                isImportRequired={false}
                                viewFileURL={viewFileURL}
                                openBarcodeModal={this.props.openBarcodeModal}
                            />
                            : ""}
                    </ListWrapper>
                </Col>
            </Row>

            {/* Below Condition Added to avoid unwanted rendering of SlideOut */}
            {this.props.Login.openModal ?
                <SlideOutModal show={this.props.Login.openModal}
                    closeModal={this.closeModal}
                    operation={this.props.Login.addMaster ? this.props.Login.masterOperation[this.props.Login.masterIndex] : this.props.Login.operation ? this.props.Login.operation : "create"}
                    inputParam={this.props.Login.inputParam}
                    screenName={this.props.Login.screenName}
                    onSaveClick={this.props.Login.operation === 'barcode' ?
                        () => this.props.barcodeGeneration(this.props.Login.barcodeSelectedRecord,
                            this.props.Login.ncontrolcode, this.props.Login.userInfo, this.state.selectedRecord)
                        : this.props.Login.addMaster ?
                            this.onSaveMasterRecord : this.props.Login.operation === 'import' ?
                                this.onSaveClickImportFile : this.onSaveClick}
                    esign={this.props.Login.loadEsign}
                    validateEsign={this.validateEsign}
                    masterStatus={this.props.Login.masterStatus}
                    updateStore={this.props.updateStore}
                    selectedRecord={this.props.Login.addMaster ?
                        this.state.selectedMaster[this.props.Login.masterIndex] : this.state.selectedRecord || {}}
                    mandatoryFields={this.props.Login.operation === 'barcode' ?[]:this.props.Login.addMaster ?
                        this.props.Login.masterextractedColumnList[this.props.Login.masterIndex].filter(x => x.mandatory === true)
                        : this.props.Login.operation === 'import' ? [{
                            "mandatory": true,
                            "idsName": "IDS_FILE",
                            "dataField": 'stemplatefilename',
                            "mandatoryLabel": "IDS_SELECT",
                            "controlType": "textbox"
                        }] : this.state.mandatoryFields || []}
                    addComponent={this.props.Login.loadEsign ?
                        <Esign operation={this.props.Login.operation}
                            onInputOnChange={this.onInputOnChange}
                            inputParam={this.props.Login.inputParam}
                            selectedRecord={this.state.selectedRecord || {}}
                        /> : this.props.Login.addMaster ?
                            <AddMasterRecords
                                selectedControl={this.props.Login.selectedControl[this.props.Login.masterIndex]}
                                fieldList={this.props.Login.masterfieldList && this.props.Login.masterfieldList[this.props.Login.masterIndex]}
                                extractedColumnList={this.props.Login.masterextractedColumnList[this.props.Login.masterIndex]}
                                // primaryKeyField={this.props.Login.masterprimaryKeyField}
                                selectedRecord={this.state.selectedMaster[this.props.Login.masterIndex] || {}}
                                onInputOnChange={this.onInputOnChangeMaster}
                                onComboChange={this.onComboChangeMaster}
                                handleDateChange={this.handleDateChangeMaster}
                                dataList={this.props.Login.masterdataList && this.props.Login.masterdataList[this.props.Login.masterIndex]}
                                onNumericInputOnChange={this.onNumericInputOnChangeMaster}
                                masterDesign={this.props.Login.masterDesign && this.props.Login.masterDesign[this.props.Login.masterIndex]}
                                mastertimeZoneList={this.props.Login.mastertimeZoneList}
                                masterdefaultTimeZone={this.props.Login.masterdefaultTimeZone}
                                onComboChangeMasterDyanmic={this.onComboChangeMasterDyanmic}
                                handleDateChangeMasterDynamic={this.handleDateChangeMasterDynamic}
                                onInputOnChangeMasterDynamic={this.onInputOnChangeMasterDynamic}
                                onNumericInputChangeMasterDynamic={this.onNumericInputChangeMasterDynamic}
                                onNumericBlurMasterDynamic={this.onNumericBlurMasterDynamic}
                                userInfo={this.props.Login.userInfo}
                                Login={this.props.Login}
                                addMasterRecord={this.addMasterRecord}
                                editMasterRecord={this.editMasterRecord}
                                userRoleControlRights={this.props.Login.userRoleControlRights}
                                masterIndex={this.props.Login.masterIndex}
                            /> : this.props.Login.operation === 'barcode' ?
                                <AddBarcode
                                    selectedRecord={this.state.selectedRecord || {}}
                                    onInputOnChange={this.onInputOnChange}
                                    onNumericInputChange={this.onNumericInputChange}
                                    onComboChange={this.onComboChangeprinter}
                                    BarcodeList={this.props.Login.BarcodeList}
                                    Printer={this.props.Login.Printer}
                                    nbarcodeprint={this.props.Login.nbarcodeprint}
                                // selectedPrinterData={this.state.selectedPrinterData}

                                >
                                </AddBarcode>

                                : this.props.Login.operation === 'import' ?
                                    <ImportTemplate
                                        selectedRecord={this.state.selectedRecord || {}}
                                        //onInputOnChange={this.onInputOnChange}
                                        onDrop={this.onDropFile}
                                        deleteAttachment={this.deleteAttachment}
                                        actionType={this.state.actionType}
                                        settings={this.props.Login.settings}
                                    />
                                    :
                                    <DynamicSlideout
                                        selectedRecord={this.props.Login.selectedRecord}
                                        templateData={this.props.Login.masterData.DynamicMasterDesign &&
                                            this.props.Login.masterData.DynamicMasterDesign.slideoutdesign}
                                        // handleChange={this.handleChange}
                                        handleDateChange={this.handleDateChange}
                                        onInputOnChange={this.onInputOnChange}
                                        onNumericInputChange={this.onNumericInputChange}
                                        comboData={this.props.Login.comboData}
                                        onComboChange={this.onComboChange}
                                        onDropFile={this.onDropFile}
                                        deleteAttachment={this.deleteAttachment}
                                        onNumericBlur={this.onNumericBlur}
                                        userInfo={this.props.Login.userInfo}
                                        timeZoneList={this.props.Login.timeZoneList}
                                        defaultTimeZone={this.props.Login.defaultTimeZone}
                                        Login={this.props.Login}
                                        addMasterRecord={this.addMasterRecord}
                                        editMasterRecord={this.editMasterRecord}
                                        userRoleControlRights={this.props.Login.userRoleControlRights}
                                    />
                    }

                /> : ""}
        </>
        );
    }


    onSaveClickImportFile = (saveType, formRef) => {
        //add 
        let inputFileData = { nsitecode: this.props.Login.userInfo.nmastersitecode };
        let editData = {};
        const formData = new FormData();
        const selectedRecord = this.state.selectedRecord;
        const acceptedFiles = selectedRecord.stemplatefilename;
        if (acceptedFiles && acceptedFiles.length === 1) {
            inputFileData['userinfo'] = this.props.Login.userInfo
            if (acceptedFiles && acceptedFiles.length === 1) {
                acceptedFiles.forEach((file, index) => {
                    formData.append("uploadedFile", file);
                });
            }
            const dateList = [];
            this.props.Login.masterData.DynamicMasterDesign.screendesign.masterdatefields.map(x => {
                dateList.push(x['2'])
            })

            let mandatoryfields = {};
            this.state.mandatoryFields.map(x => {
                mandatoryfields[x.dataField] = x.mandatory;

            })
            formData.append('mandatoryFields', Lims_JSON_stringify(JSON.stringify(mandatoryfields), false))
            formData.append('comboComponents', Lims_JSON_stringify(JSON.stringify(this.state.comboComponents), false))
            formData.append('masterdateconstraints', Lims_JSON_stringify(JSON.stringify(this.props.Login.masterData.DynamicMasterDesign.screendesign.masterdateconstraints), false))
            formData.append('masterdatelist', Lims_JSON_stringify(JSON.stringify(dateList), false))
            formData.append('mastercombinationunique', Lims_JSON_stringify(JSON.stringify(this.props.Login.masterData.DynamicMasterDesign.screendesign.mastercombinationunique), false))
            formData.append('ndesigntemplatemappingcode', this.props.Login.masterData.DynamicMasterDesign.ndesigntemplatemappingcode)
            const inputParam = {
                classUrl: this.props.Login.inputParam.classUrl,
                methodUrl: this.props.Login.inputParam.methodUrl,
                inputData: { userinfo: this.props.Login.userInfo },
                formData: formData,
                editData: editData,
                isFileupload: true,
                operation: this.props.Login.operation,
                displayName: this.props.Login.inputParam.displayName,
                saveType, formRef

            }
            const esignNeeded = showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolCode);
            if (esignNeeded) {
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
        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_PLEASESELECTTHEFILE" }))
        }
    }

    onComboChangeMasterDyanmic = (comboData, control, customName) => {

        let comboName = customName || control.label;
        let selectedMaster = this.state.selectedMaster || [];
        const masterIndex = this.props.Login.masterIndex
        selectedMaster[masterIndex] = selectedMaster[masterIndex] && { ...selectedMaster[masterIndex] } || {}
        //if (comboData) {
        comboData["item"] = {
            ...comboData["item"], "pkey": control.valuemember, "nquerybuildertablecode": control.nquerybuildertablecode,
            "source": control.source
        };
        selectedMaster[masterIndex][comboName] = comboData;

        // console.log("selected:", selectedMaster, comboData, control, customName);
        if (control.child && control.child.length > 0) {
            const childComboList = getSameRecordFromTwoArrays(this.props.Login.mastercomboComponents[masterIndex], control.child, "label")
            let childColumnList = {};
            childComboList.map(columnList => {
                const val = this.comboChild(this.props.Login.mastercomboComponents[masterIndex], columnList, childColumnList, false);
                childColumnList = val.childColumnList
            })

            const parentList = getSameRecordFromTwoArrays(this.props.Login.masterwithoutCombocomponent[masterIndex], control.child, "label")

            if (comboData) {
                const inputParem = {
                    child: control.child,
                    source: control.source,
                    primarykeyField: control.valuemember,
                    value: comboData.value,
                    item: comboData.item
                }
                this.props.getChildValuesForAddMaster(inputParem,
                    this.props.Login.userInfo, selectedMaster, this.props.Login.masterdataList,
                    childComboList, childColumnList,
                    this.props.Login.masterwithoutCombocomponent,
                    [...childComboList, ...parentList], masterIndex)
            } else {
                let comboData = this.props.Login.masterdataList
                const withoutCombocomponent = this.props.Login.masterwithoutCombocomponent || []
                const inputParam = { control, comboComponents: this.props.Login.mastercomboComponents[masterIndex], withoutCombocomponent: withoutCombocomponent[masterIndex], selectedMaster: selectedMaster[masterIndex], comboData: comboData[masterIndex] }
                const childParam = childComboClear(inputParam)
                selectedMaster[masterIndex] = childParam.selectedRecord
                comboData[masterIndex] = childParam.comboData
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: { selectedMaster, mastedataList: comboData }
                }
                this.props.updateStore(updateInfo);
            }
        } else {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: { selectedMaster }
            }
            this.props.updateStore(updateInfo);
        }
    }


    onInputOnChangeMasterDynamic = (event, control, radiotext) => {
        let selectedMaster = this.state.selectedMaster || [];
        const masterIndex = this.props.Login.masterIndex
        selectedMaster[masterIndex] = selectedMaster[masterIndex] && { ...selectedMaster[masterIndex] } || {}

        if (event.target.type === 'toggle') {
            selectedMaster[masterIndex][event.target.name] = event.target.checked === true ? transactionStatus.YES : transactionStatus.NO;
        } else if (event.target.type === 'numeric') {
            if (/\D/.test(event.target.value))
                selectedMaster[masterIndex][event.target.name] = event.target.value;
        } else if (event.target.type === 'checkbox') {
            const value = selectedMaster[masterIndex][event.target.name];
            if (value !== '' && value !== undefined) {
                if (value.includes(radiotext)) {
                    const index = value.indexOf(radiotext);
                    if (index !== -1) {
                        if (index === 0) {
                            const indexcomma = value.indexOf(",")
                            if (indexcomma !== -1) {
                                selectedMaster[masterIndex][event.target.name] = value.slice(indexcomma + 1)
                            } else {
                                selectedMaster[masterIndex][event.target.name] = ""
                            }
                        } else {
                            if (value.slice(index).indexOf(",") !== -1) {
                                selectedMaster[masterIndex][event.target.name] = value.slice(0, index) + value.slice(index + value.slice(index).indexOf(",") + 1)
                            } else {
                                selectedMaster[masterIndex][event.target.name] = value.slice(0, index - 1)
                            }
                        }
                    }

                } else {
                    selectedMaster[masterIndex][event.target.name] = value + ',' + radiotext;
                }

            } else {
                selectedMaster[masterIndex][event.target.name] = radiotext;
            }
        } else if (event.target.type === 'radio') {
            selectedMaster[masterIndex][event.target.name] = radiotext
        } else {
            selectedMaster[masterIndex][event.target.name] = conditionBasedInput(control, event.target.value, radiotext,event.target.defaultValue)
            // selectedMaster[masterIndex][event.target.name] = event.target.value;
        }
        this.setState({ selectedMaster });
    }


    handleDateChangeMasterDynamic = (dateValue, dateName) => {
        let selectedMaster = this.state.selectedMaster || [];
        const masterIndex = this.props.Login.masterIndex
        selectedMaster[masterIndex] = selectedMaster[masterIndex] && { ...selectedMaster[masterIndex] } || {}

        selectedMaster[masterIndex][dateName] = dateValue;

        this.setState({ selectedMaster });
    }

    onNumericInputChangeMasterDynamic = (value, name) => {
        let selectedMaster = this.state.selectedMaster || [];
        const masterIndex = this.props.Login.masterIndex
        selectedMaster[masterIndex] = selectedMaster[masterIndex] && { ...selectedMaster[masterIndex] } || {}

        selectedMaster[masterIndex][name] = value;
        this.setState({ selectedMaster });
    }

    onNumericBlurMasterDynamic = (value, control) => {
        let selectedMaster = this.state.selectedMaster || [];
        const masterIndex = this.props.Login.masterIndex
        selectedMaster[masterIndex] = selectedMaster[masterIndex] && { ...selectedMaster[masterIndex] } || {}

        if (selectedMaster[masterIndex][control.label]) {
            if (control.max) {
                if (!(selectedMaster[masterIndex][control.label] < parseFloat(control.max))) {
                    selectedMaster[masterIndex][control.label] = control.precision ? parseFloat(control.max) : parseInt(control.max)
                }
            }
            if (control.min) {
                if (!(selectedMaster[masterIndex][control.label] > parseFloat(control.min))) {
                    selectedMaster[masterIndex][control.label] = control.precision ? parseFloat(control.min) : parseInt(control.min)
                }
            }


        }
        this.setState({ selectedMaster });
    }
    onComboChangeMaster = (comboData, fieldName, item) => {
        const selectedMaster = this.state.selectedMaster || [];
        const masterIndex = this.props.Login.masterIndex
        selectedMaster[masterIndex] = selectedMaster[masterIndex] && { ...selectedMaster[masterIndex] } || {}
        if (comboData !== null) {
            if (this.props.Login.selectedControl[masterIndex].table.item.nformcode === 137) {
                selectedMaster[masterIndex][item.tableDataField] = comboData.value;
            }
            else if (item.foreignDataField) {
                selectedMaster[masterIndex][item.foreignDataField] = comboData.value;
            }
        }
        selectedMaster[masterIndex][fieldName] = comboData;
        if (item.childIndex !== undefined) {
            this.props.getChildComboMaster(selectedMaster, fieldName, item,
                this.props.Login.selectedControl,
                this.props.Login.masterfieldList,
                this.props.Login.masterdataList, this.props.Login.userInfo, masterIndex)
        } else {
            this.setState({ selectedMaster });
        }

    }

    handleDateChangeMaster = (dateName, dateValue, item) => {
        //   const { selectedMaster } = this.state;
        const selectedMaster = this.state.selectedMaster || [];
        const masterIndex = this.props.Login.masterIndex
        selectedMaster[masterIndex] = selectedMaster[masterIndex] && { ...selectedMaster[masterIndex] } || {}

        selectedMaster[masterIndex][dateName] = dateValue;
        const age = ageCalculate(dateValue);
        selectedMaster[masterIndex]["sage"] = age;
        this.setState({ selectedMaster });

    }

    onNumericInputOnChangeMaster = (value, name, item) => {
        const selectedMaster = this.state.selectedMaster || [];
        const masterIndex = this.props.Login.masterIndex
        selectedMaster[masterIndex] = selectedMaster[masterIndex] && { ...selectedMaster[masterIndex] } || {}

        selectedMaster[masterIndex][name] = value;
        this.setState({ selectedMaster });
    }



    onInputOnChangeMaster = (event) => {
        const selectedMaster = this.state.selectedMaster || [];
        const masterIndex = this.props.Login.masterIndex
        selectedMaster[masterIndex] = selectedMaster[masterIndex] && { ...selectedMaster[masterIndex] } || {}

        if (event.target.type === 'checkbox') {
            selectedMaster[masterIndex][event.target.name] = event.target.checked === true ? 3 : 4;
            if (this.props.Login.selectedControl[masterIndex].table.item.nformcode === 137) {
                if (selectedMaster[masterIndex].nneedcurrentaddress === 3) {
                    selectedMaster[masterIndex].sflatnotemp = selectedMaster[masterIndex].sflatno;
                    selectedMaster[masterIndex].shousenotemp = selectedMaster[masterIndex].shouseno;
                    selectedMaster[masterIndex].spostalcodetemp = selectedMaster[masterIndex].spostalcode;
                    selectedMaster[masterIndex].sstreettemp = selectedMaster[masterIndex].sstreet;
                    selectedMaster[masterIndex].scitynametemp = selectedMaster[masterIndex].scityname;
                    selectedMaster[masterIndex].sdistrictnametemp = selectedMaster[masterIndex].sdistrictname;
                    selectedMaster[masterIndex].sregionnametemp = selectedMaster[masterIndex].sregionname;
                }
                else {
                    selectedMaster[masterIndex].sflatnotemp = "";
                    selectedMaster[masterIndex].shousenotemp = "";
                    selectedMaster[masterIndex].spostalcodetemp = "";
                    selectedMaster[masterIndex].sstreettemp = "";
                    selectedMaster[masterIndex].scitynametemp = "";
                    selectedMaster[masterIndex].sdistrictnametemp = "";
                    selectedMaster[masterIndex].sregionnametemp = "";
                }
            }
        }
        else {
            selectedMaster[masterIndex][event.target.name] = event.target.value;
        }
        this.setState({ selectedMaster });
    }

    onSaveMasterRecord = (saveType, formRef) => {
        //add / edit            
        const masterIndex = this.props.Login.masterIndex;
        let inputData = [];
        const selectedControl = this.props.Login.selectedControl
        const masterDesign = this.props.Login.masterDesign
        inputData["userinfo"] = { ...this.props.Login.userInfo, nformcode: selectedControl[masterIndex].table.item.nformcode };
        inputData[selectedControl[masterIndex].table.item.methodUrl.toLowerCase()] = { "nsitecode": this.props.Login.userInfo.nmastersitecode };
        const methodUrl = selectedControl[masterIndex].table.item.methodUrl.toLowerCase();
        let isFileupload = false;
        const formData = new FormData();
        if (this.props.Login.masterOperation[masterIndex] === 'update') {
            if (selectedControl[masterIndex].table.item.component === 'Dynamic') {
                inputData[methodUrl]["ndynamicmastercode"] = this.props.Login.masterEditObject[masterIndex].item ?
                    this.props.Login.masterEditObject[masterIndex].item.jsondata.ndynamicmastercode : this.props.Login.masterEditObject[masterIndex].ndynamicmastercode
            }
            else {
                inputData[methodUrl][selectedControl[masterIndex]["valuemember"]] = this.props.Login.masterEditObject[masterIndex].value
            }

        }


        if (selectedControl[masterIndex].table.item.component === 'Dynamic') {
            const selectedMaster = this.state.selectedMaster;
            inputData["userinfo"] = { ...this.props.Login.userInfo, nformcode: selectedControl[masterIndex].table.item.nformcode };
            inputData["masterdateconstraints"] = masterDesign[masterIndex].screendesign.masterdateconstraints;
            inputData["masterdatefields"] = masterDesign[masterIndex].screendesign.masterdatefields;
            inputData["mastercombinationunique"] = masterDesign[masterIndex].screendesign.mastercombinationunique;
            //add                          
            inputData["dynamicmaster"] = {
                ...inputData[methodUrl],
                nformcode: selectedControl[masterIndex].table.item.nformcode,
                ndesigntemplatemappingcode: masterDesign[masterIndex].ndesigntemplatemappingcode,
                jsondata: {}, jsonuidata: {}
            };

            const dateList = [];
            const defaulttimezone = this.props.Login.defaulttimezone;
            inputData["isFileupload"] = false;
            isFileupload = true;
            masterDesign[masterIndex] &&
                masterDesign[masterIndex].slideoutdesign.map(row => {
                    row.children.map(column => {
                        column.children.map(component => {
                            if (component.hasOwnProperty("children")) {

                                component.children.map(componentrow => {
                                    if (componentrow.inputtype === "combo") {
                                        inputData["dynamicmaster"]["jsondata"][componentrow.label] = selectedMaster[componentrow.label] ?
                                            {
                                                value: selectedMaster[masterIndex][componentrow.label].value,
                                                label: selectedMaster[masterIndex][componentrow.label].label,
                                                pkey: componentrow.valuemember,
                                                nquerybuildertablecode: componentrow.nquerybuildertablecode,
                                                source: componentrow.source,
                                                [componentrow.table.item.component === 'Dynamic' ? 'ndynamicmastercode' : componentrow.valuemember]: this.props.Login.masterOperation[masterIndex] === 'update' ?
                                                    selectedMaster[masterIndex][componentrow.label].item ? selectedMaster[masterIndex][componentrow.label].item.jsondata[componentrow.table.item.component === 'Dynamic' ? 'ndynamicmastercode' : componentrow.valuemember] :
                                                        selectedMaster[masterIndex][componentrow.label][componentrow.table.item.component === 'Dynamic' ? 'ndynamicmastercode' : componentrow.valuemember]
                                                    :
                                                    selectedMaster[masterIndex][componentrow.label].item.jsondata[componentrow.table.item.component === 'Dynamic' ? 'ndynamicmastercode' : componentrow.valuemember]
                                            } : -1

                                        inputData["dynamicmaster"]["jsonuidata"][componentrow.label] = selectedMaster[masterIndex][componentrow.label] ? selectedMaster[masterIndex][componentrow.label].label : ""

                                    }
                                    else if (componentrow.inputtype === "date") {
                                        if (componentrow.mandatory) {
                                            inputData["dynamicmaster"]["jsondata"][componentrow.label] = formatDate(selectedMaster[masterIndex][componentrow.label], false)

                                            inputData["dynamicmaster"]["jsonuidata"][componentrow.label] = inputData["dynamicmaster"]["jsondata"][componentrow.label]
                                            //inputData["dynamicmaster"]["jsonuidata"][componentrow.label] = convertDateTimetoString(selectedRecord[componentrow.label], userInfo);
                                        }
                                        else {
                                            inputData["dynamicmaster"]["jsondata"][componentrow.label] = componentrow.loadcurrentdate ?
                                                formatDate(selectedMaster[masterIndex][componentrow.label] || new Date(), false) :
                                                selectedMaster[masterIndex][componentrow.label] ? formatDate(selectedMaster[masterIndex][componentrow.label], false)
                                                    : "";

                                            inputData["dynamicmaster"]["jsonuidata"][componentrow.label] = inputData["dynamicmaster"]["jsondata"][componentrow.label];
                                            //convertDateTimetoString(selectedRecord[componentrow.label], userInfo);
                                        }
                                        if (componentrow.timezone) {
                                            inputData["dynamicmaster"]["jsondata"][`tz${componentrow.label}`] = selectedMaster[masterIndex][`tz${componentrow.label}`] ?
                                                { value: selectedMaster[masterIndex][`tz${componentrow.label}`].value, label: selectedMaster[masterIndex][`tz${componentrow.label}`].label } :
                                                defaulttimezone ? defaulttimezone : -1

                                            inputData["dynamicmaster"]["jsonuidata"][`tz${componentrow.label}`] = inputData["dynamicmaster"]["jsondata"][`tz${componentrow.label}`]
                                        }
                                        dateList.push(componentrow.label)
                                    }

                                    else {
                                        inputData["dynamicmaster"]["jsondata"][componentrow.label] = selectedMaster[masterIndex][componentrow.label] ?
                                            selectedMaster[masterIndex][componentrow.label] : ""

                                        inputData["dynamicmaster"]["jsonuidata"][componentrow.label] = inputData["dynamicmaster"]["jsondata"][componentrow.label]
                                        // inputData["dynamicmaster"]["jsondata"][componentrow.label]

                                    }
                                    return inputData["dynamicmaster"];
                                })
                            }
                            else {
                                if (component.inputtype === "combo") {
                                    inputData["dynamicmaster"]["jsondata"][component.label] = selectedMaster[masterIndex][component.label] ?
                                        {
                                            value: selectedMaster[masterIndex][component.label].value,
                                            label: selectedMaster[masterIndex][component.label].label,
                                            pkey: component.valuemember,
                                            nquerybuildertablecode: component.nquerybuildertablecode,
                                            source: component.source,
                                            [component.table.item.component === 'Dynamic' ? 'ndynamicmastercode' : component.valuemember]: this.props.Login.masterOperation[masterIndex] === 'update' ?
                                                selectedMaster[masterIndex][component.label].item ? selectedMaster[masterIndex][component.label].item.jsondata[component.table.item.component === 'Dynamic' ? 'ndynamicmastercode' : component.valuemember] : selectedMaster[masterIndex][component.label][component.table.item.component === 'Dynamic' ? 'ndynamicmastercode' : component.valuemember]
                                                :
                                                selectedMaster[masterIndex][component.label].item.jsondata[component.table.item.component === 'Dynamic' ? 'ndynamicmastercode' : component.valuemember]
                                        } : -1

                                    inputData["dynamicmaster"]["jsonuidata"][component.label] = inputData["dynamicmaster"]["jsondata"][component.label].label;
                                    //selectedRecord[component.label] ? selectedRecord[component.label].label : ""
                                }
                                else if (component.inputtype === "date") {
                                    if (component.mandatory) {
                                        inputData["dynamicmaster"]["jsondata"][component.label] = formatDate(selectedMaster[masterIndex][component.label], false);
                                        // convertDateTimetoString(selectedRecord[component.label] ?
                                        // selectedRecord[component.label] : new Date(), userInfo);

                                        inputData["dynamicmaster"]["jsonuidata"][component.label] = inputData["dynamicmaster"]["jsondata"][component.label]
                                        //convertDateTimetoString(selectedRecord[component.label], userInfo);

                                    } else {
                                        inputData["dynamicmaster"]["jsondata"][component.label] = component.loadcurrentdate ?
                                            //convertDateTimetoString(selectedRecord[component.label] ?                                      
                                            //    selectedRecord[component.label] : new Date(), userInfo) :
                                            formatDate(selectedMaster[masterIndex][component.label] || new Date(), false) :
                                            selectedMaster[masterIndex][component.label] ?
                                                // convertDateTimetoString(selectedRecord[component.label] ?
                                                //   selectedRecord[component.label] : new Date(), userInfo) : "";
                                                formatDate(selectedMaster[masterIndex][component.label], false) : "";
                                        inputData["dynamicmaster"]["jsonuidata"][component.label] = inputData["dynamicmaster"]["jsondata"][component.label]
                                        //convertDateTimetoString(selectedRecord[component.label], userInfo)

                                    }
                                    if (component.timezone) {
                                        inputData["dynamicmaster"]["jsondata"][`tz${component.label}`] = selectedMaster[masterIndex][`tz${component.label}`] ?
                                            { value: selectedMaster[masterIndex][`tz${component.label}`].value, label: selectedMaster[masterIndex][`tz${component.label}`].label } :
                                            defaulttimezone ? defaulttimezone : -1

                                        inputData["dynamicmaster"]["jsonuidata"][`tz${component.label}`] = inputData["dynamicmaster"]["jsondata"][`tz${component.label}`]
                                    }
                                    dateList.push(component.label)
                                }
                                else {
                                    inputData["dynamicmaster"]["jsondata"][component.label] = selectedMaster[masterIndex][component.label] ?
                                        selectedMaster[masterIndex][component.label] : ""

                                    inputData["dynamicmaster"]["jsonuidata"][component.label] = inputData["dynamicmaster"]["jsondata"][component.label]
                                }
                            }
                            return inputData["dynamicmaster"];
                        }
                        )
                        return inputData["dynamicmaster"];
                    })
                    return inputData["dynamicmaster"];
                })


            inputData["dynamicmaster"]["jsonstring"] = JSON.stringify(inputData["dynamicmaster"]["jsondata"]);
            inputData["dynamicmaster"]["jsonuistring"] = JSON.stringify(inputData["dynamicmaster"]["jsonuidata"]);
            inputData["masterdatelist"] = dateList;
            formData.append("Map", Lims_JSON_stringify(JSON.stringify({ ...inputData })));

        }
        else if (selectedControl[masterIndex].table.item.component === 'Type3Component'
            && selectedControl[masterIndex].table.item.nformcode === formCode.PATIENTMASTER) {
            //ALPD-3347   
			 inputData["noneedfilter"] = 1; //will dislplay all db records
                if (selectedControl[masterIndex].inputtype === 'backendsearchfilter' || selectedControl[masterIndex].inputtype === 'frontendsearchfilter') {
                    inputData["noneedfilter"] = 2; //will display will added record
                }
            this.props.Login.masterextractedColumnList[masterIndex].map(item => {
                let fieldName = item.dataField;
                if (item.isJsonField === true) {
                    return inputData[methodUrl][item.jsonObjectName] = { ...inputData[methodUrl][item.jsonObjectName], [fieldName]: this.state.selectedMaster[masterIndex][fieldName] ? this.state.selectedMaster[masterIndex][fieldName] : "" }
                }
                else {
                    if (item.controlType === "selectbox") {
                        // inputData[methodUrl][fieldName] = this.state.selectedMaster[fieldName] ? this.state.selectedMaster[fieldName].label ? this.state.selectedMaster[fieldName].label : "" : -1;
                        inputData[methodUrl][item.tableDataField] = this.state.selectedMaster[masterIndex][fieldName] ? this.state.selectedMaster[masterIndex][fieldName].value ? this.state.selectedMaster[masterIndex][fieldName].value : "" : -1;
                        return inputData;
                    }
                    else if (item.controlType === "datepicker") {
                        inputData[methodUrl][item.dateField] = formatInputDate(this.state.selectedMaster[masterIndex][fieldName] ? this.state.selectedMaster[masterIndex][fieldName] : "", false);
                    }
                    else if (item.controlType === "checkbox") {
                        inputData[methodUrl][item.controlName] = this.state.selectedMaster[masterIndex][item.controlName] ? this.state.selectedMaster[masterIndex][item.controlName] : transactionStatus.NO;
                    }
                    else {
                        inputData[methodUrl][fieldName] = this.state.selectedMaster[masterIndex][fieldName] ? this.state.selectedMaster[masterIndex][fieldName] : "";
                    }
                    // inputData[methodUrl][selectedRecordPrimarykey] = this.props.Login.selectedId;
                    return inputData;
                }
            })
        }
        else {

            this.props.Login.masterextractedColumnList[masterIndex].map(item => {
                let fieldName = item.dataField;
                if (item.isJsonField === true) {
                    return inputData[methodUrl][item.jsonObjectName] = { ...inputData[methodUrl][item.jsonObjectName], [fieldName]: this.state.selectedMaster[masterIndex][fieldName] ? this.state.selectedMaster[masterIndex][fieldName] : "" }
                }
                else {
                    if (item.controlType === "selectbox") {
                        inputData[methodUrl][fieldName] = this.state.selectedMaster[masterIndex][fieldName] ? this.state.selectedMaster[masterIndex][fieldName].label ? this.state.selectedMaster[masterIndex][fieldName].label : "" : -1;
                        inputData[methodUrl][item.foreignDataField] = this.state.selectedMaster[masterIndex][fieldName] ? this.state.selectedMaster[masterIndex][fieldName].value ? this.state.selectedMaster[masterIndex][fieldName].value : "" : -1;
                        return inputData;
                    }
                    else if (item.controlType === "datepicker") {
                        inputData[methodUrl][item.dateField] = formatInputDate(this.state.selectedMaster[masterIndex][fieldName] ? this.state.selectedMaster[masterIndex][fieldName] : "", false);
                    }
                    else if (item.controlType === "checkbox") {
                        inputData[methodUrl][item.controlName] = this.state.selectedMaster[masterIndex][item.controlName] ? this.state.selectedMaster[masterIndex][item.controlName] : transactionStatus.NO;
                    }
                    else {
                        inputData[methodUrl][fieldName] = this.state.selectedMaster[masterIndex][fieldName] ? this.state.selectedMaster[masterIndex][fieldName] : "";
                    }
                    // inputData[methodUrl][selectedRecordPrimarykey] = this.props.Login.selectedId;
                    return inputData;
                }
            })
        }
        // }

        const inputParam = {
            userinfo: this.props.Login.userInfo,
            withoutCombocomponent: this.state.withoutCombocomponent,
            comboComponents: this.state.comboComponents,
            selectedRecord: this.state.selectedRecord,
            selectedRecordName: 'selectedRecord',
            loadSubSample: false,
            selectedControl: this.props.Login.selectedControl,
            comboData: this.props.Login.comboData,
            comboName: 'comboData',
            classUrl: selectedControl[masterIndex].table.item.classUrl,
            methodUrl: selectedControl[masterIndex].table.item.methodUrl,
            displayName: this.props.Login.inputParam.displayName,// selectedControl[masterIndex].table.item.sdisplayname,
            screenName: masterIndex !== 0 ?
                selectedControl[masterIndex - 1].displayname[this.props.Login.userInfo.slanguagetypecode] : this.props.Login.inputParam.displayName,
            inputData: inputData,
            operation: this.props.Login.masterOperation[masterIndex],
            masterEditObject: this.props.Login.masterEditObject,
            masterOperation: this.props.Login.masterOperation, saveType, formRef,
            masterIndex,
            selectedMaster: this.state.selectedMaster,
            mastercomboComponents: this.props.Login.mastercomboComponents,
            masterwithoutCombocomponent: this.props.Login.masterwithoutCombocomponent,
            masterComboColumnFiled: this.props.Login.masterComboColumnFiled,
            masterextractedColumnList: this.props.Login.masterextractedColumnList,
            masterdataList: this.props.Login.masterdataList,
            masterDesign: this.props.Login.masterDesign,
            masterfieldList: this.props.Login.masterfieldList,
            formData: formData,
            isFileupload

        }

        this.props.addMasterRecord(inputParam, this.props.Login.masterData)



    }


    addMasterRecord = (control) => {
        let masterIndex = this.props.Login.masterIndex
        if (masterIndex !== undefined) {
            masterIndex = masterIndex + 1;
        } else {
            masterIndex = 0
        }
        let selectedControl = this.props.Login.selectedControl || []
        let selectedMaster = this.state.selectedMaster || []
        selectedMaster[masterIndex] = {}
        selectedControl[masterIndex] = control

        let fieldList = this.props.Login.masterfieldList || []
        fieldList[masterIndex] = []

        let masterComboColumnFiled = this.props.Login.masterComboColumnFiled || []
        masterComboColumnFiled[masterIndex] = []

        let extractedColumnList = this.props.Login.masterextractedColumnList || []
        extractedColumnList[masterIndex] = []

        let masterdataList = this.props.Login.masterdataList || []
        let masterDesign = this.props.Login.masterDesign || []
        let masterwithoutCombocomponent = this.props.Login.masterwithoutCombocomponent || []
        let mastercomboComponents = this.props.Login.mastercomboComponents || []
        let masterOperation = this.props.Login.masterOperation || []

        masterdataList[masterIndex] = []
        masterDesign[masterIndex] = []
        masterwithoutCombocomponent[masterIndex] = []
        mastercomboComponents[masterIndex] = []
        masterOperation[masterIndex] = 'create'

        if (control.table.item.component === 'Type2Component' || control.table.item.component === 'Type1Component') {
            if (control.table.item.component === 'Type2Component') {
                fieldList[masterIndex] = getFieldSpecification().get(control.table.item.methodUrl) || [];
            } else {
                fieldList[masterIndex] = getFieldSpecification1().get(control.table.item.methodUrl) || [];
            }


            extractedColumnList[masterIndex] = extractFieldHeader(Object.values(fieldList[masterIndex]));

            const primaryKeyField = Object.keys(fieldList[masterIndex]).length > 0 ? fieldList[masterIndex][0].dataField : "";
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    selectedControl,
                    addMaster: true,
                    masterfieldList: fieldList,
                    masterextractedColumnList: extractedColumnList,
                    masterprimaryKeyField: primaryKeyField,
                    masterComboColumnFiled: masterComboColumnFiled,
                    masterIndex,
                    masterdataList,
                    masterDesign,
                    masterwithoutCombocomponent,
                    mastercomboComponents,
                    masterOperation,
                    selectedMaster,
                    screenName: selectedControl[masterIndex].displayname[this.props.Login.userInfo.slanguagetypecode]
                }
            }
            this.props.updateStore(updateInfo)
        }
        else if (control.table.item.component === 'Type3Component') {
            fieldList[masterIndex] = getFieldSpecification3().get(control.table.item.methodUrl) || [];
            extractedColumnList[masterIndex] = extractFieldHeader(Object.values(fieldList[masterIndex]));
            masterComboColumnFiled[masterIndex] = extractedColumnList[masterIndex].filter(item =>
                item.ndesigncomponentcode === designComponents.COMBOBOX)
            const primaryKeyField = Object.keys(fieldList[masterIndex]).length > 0 ? fieldList[masterIndex][0].dataField : "";
            const inputParam = {
                userinfo: this.props.Login.userInfo,
                selectedControl,
                masterfieldList: fieldList,
                masterextractedColumnList: extractedColumnList,
                masterprimaryKeyField: primaryKeyField,
                masterComboColumnFiled: masterComboColumnFiled,
                masterIndex,
                masterdataList,
                masterDesign,
                masterwithoutCombocomponent,
                mastercomboComponents,
                selectedMaster,
                masterOperation,
                screenName: selectedControl[masterIndex].displayname[this.props.Login.userInfo.slanguagetypecode]
            }

            this.props.getAddMasterCombo(inputParam);

        }
        else if (control.table.item.component === 'Dynamic') {
            const inputParam = {
                userinfo: this.props.Login.userInfo,
                selectedControl,
                masterIndex,
                masterdataList,
                masterDesign,
                masterComboColumnFiled,
                masterwithoutCombocomponent,
                mastercomboComponents,
                masterfieldList: fieldList,
                masterextractedColumnList: extractedColumnList,
                masterComboColumnFiled,
                masterOperation,
                selectedMaster
            }
            this.props.getDynamicMasterTempalte(inputParam);
        }

        // this.props.getMasterRecord(control);
    }


    editMasterRecord = (control, editObject) => {
        if (editObject) {
            let masterIndex = this.props.Login.masterIndex
            if (masterIndex !== undefined) {
                masterIndex = masterIndex + 1;
            } else {
                masterIndex = 0
            }
            let selectedControl = this.props.Login.selectedControl || []
            let selectedMaster = this.state.selectedMaster || []
            selectedMaster[masterIndex] = {}
            selectedControl[masterIndex] = control

            let fieldList = this.props.Login.masterfieldList || []
            fieldList[masterIndex] = []

            let masterComboColumnFiled = this.props.Login.masterComboColumnFiled || []
            masterComboColumnFiled[masterIndex] = []

            let extractedColumnList = this.props.Login.masterextractedColumnList || []
            extractedColumnList[masterIndex] = []

            let masterdataList = this.props.Login.masterdataList || []
            let masterDesign = this.props.Login.masterDesign || []
            let masterwithoutCombocomponent = this.props.Login.masterwithoutCombocomponent || []
            let mastercomboComponents = this.props.Login.mastercomboComponents || []
            let masterOperation = this.props.Login.masterOperation || []
            let masterEditObject = this.props.Login.masterEditObject || []

            masterdataList[masterIndex] = []
            masterDesign[masterIndex] = []
            masterwithoutCombocomponent[masterIndex] = []
            mastercomboComponents[masterIndex] = []
            masterOperation[masterIndex] = 'update'
            masterEditObject[masterIndex] = editObject

            if (control.table.item.component === 'Type2Component' || control.table.item.component === 'Type1Component') {
                if (control.table.item.component === 'Type2Component') {
                    fieldList[masterIndex] = getFieldSpecification().get(control.table.item.methodUrl) || [];
                } else {
                    fieldList[masterIndex] = getFieldSpecification1().get(control.table.item.methodUrl) || [];
                }
                extractedColumnList[masterIndex] = extractFieldHeader(Object.values(fieldList[masterIndex]));

                const primaryKeyField = Object.keys(fieldList[masterIndex]).length > 0 ? fieldList[masterIndex][0].dataField : "";

                const updateInfo = {
                    userinfo: this.props.Login.userInfo,
                    selectedControl,
                    addMaster: true,
                    masterfieldList: fieldList,
                    masterextractedColumnList: extractedColumnList,
                    masterprimaryKeyField: primaryKeyField,
                    masterComboColumnFiled: masterComboColumnFiled,
                    masterIndex,
                    masterdataList,
                    masterDesign,
                    masterwithoutCombocomponent,
                    mastercomboComponents,
                    selectedMaster,
                    masterEditObject,
                    masterOperation
                    // editObject
                    //   screenName:selectedControl[masterIndex].displayname[this.props.Login.userInfo.slanguagetypecode]

                }
                this.props.getEditMaster(updateInfo)
            }
            else if (control.table.item.component === 'Type3Component') {
                fieldList[masterIndex] = getFieldSpecification3().get(control.table.item.methodUrl) || [];
                extractedColumnList[masterIndex] = extractFieldHeader(Object.values(fieldList[masterIndex]));
                masterComboColumnFiled[masterIndex] = extractedColumnList[masterIndex].filter(item =>
                    item.ndesigncomponentcode === designComponents.COMBOBOX)
                const primaryKeyField = Object.keys(fieldList[masterIndex]).length > 0 ? fieldList[masterIndex][0].dataField : "";
                const inputParam = {
                    userinfo: this.props.Login.userInfo,
                    selectedControl,
                    masterfieldList: fieldList,
                    masterextractedColumnList: extractedColumnList,
                    masterprimaryKeyField: primaryKeyField,
                    masterComboColumnFiled: masterComboColumnFiled,
                    masterIndex,
                    masterdataList,
                    masterDesign,
                    masterwithoutCombocomponent,
                    mastercomboComponents,
                    masterEditObject,
                    masterOperation,
                    selectedMaster,
                    screenName: selectedControl[masterIndex].displayname[this.props.Login.userInfo.slanguagetypecode],
                    // editObject
                }

                this.props.getEditMaster(inputParam);

            }
            else if (control.table.item.component === 'Dynamic') {
                const inputParam = {
                    userinfo: this.props.Login.userInfo,
                    selectedControl,
                    masterIndex,
                    masterdataList,
                    masterDesign,
                    masterComboColumnFiled,
                    masterwithoutCombocomponent,
                    mastercomboComponents,
                    masterfieldList: fieldList,
                    masterextractedColumnList: extractedColumnList,
                    masterComboColumnFiled,
                    masterEditObject,
                    masterOperation,
                    selectedMaster,
                    //  editObject
                }
                this.props.getEditMaster(inputParam);
            }

        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTTHERECORD" }))
        }

    }

    openModal = () => {

        const addId = this.props.Login.inputParam && this.state.controlMap.has("Add")
            && this.state.controlMap.get("Add").ncontrolcode;

        this.props.getDynamicMasterCombo(this.props.Login.masterData, this.props.Login.userInfo, addId,
            this.state.designData, this.state.selectedRecord, this.state.childColumnList,
            this.state.comboComponents, this.state.withoutCombocomponent,
            false, true, new Map(), true, "create", this.props.Login.displayName);
    }

    fetchRecord = (fetchRecordParam) => {

        this.props.getEditDynamicMasterCombo(fetchRecordParam,
            this.state.designData, this.state.selectedRecord, this.state.childColumnList,
            this.state.comboComponents, this.state.withoutCombocomponent)

    }


    onNumericBlur = (value, control) => {
        let selectedRecord = this.state.selectedRecord
        if (selectedRecord[control.label]) {
            if (control.max) {
                if (!(selectedRecord[control.label] < parseFloat(control.max))) {
                    selectedRecord[control.label] = control.precision ? parseFloat(control.max) : parseInt(control.max)
                }
            }
            if (control.min) {
                if (!(selectedRecord[control.label] > parseFloat(control.min))) {
                    selectedRecord[control.label] = control.precision ? parseFloat(control.min) : parseInt(control.min)
                }
            }


        }
        this.setState({ selectedRecord });
    }

    comboChild = (data, columnList, childColumnList, slice) => {
        let retunObj = {}
        // if (data.findIndex(x => x.label === columnList.label) !== -1) {
        if (!childColumnList.hasOwnProperty(columnList.label)) {
            if (childColumnList[columnList.label] === undefined) {
                if (columnList.hasOwnProperty("child")) {
                    let childList = []
                    columnList.child.map(childData => {
                        const index = data.findIndex(x => x.label === childData.label)
                        if (index !== -1) {
                            childList.push(data[index])
                            if (slice) {
                                data = [...data.slice(0, index), ...data.slice(index + 1)]
                            }
                        }
                    })
                    childColumnList[columnList.label] = childList;
                    if (childList.length > 0) {
                        childList.map(y => {
                            if (y.hasOwnProperty("child")) {
                                const val = this.comboChild(data, y, childColumnList, slice)
                                retunObj["data"] = val.data;
                                retunObj["childColumnList"] = val.childColumnList;
                            } else {
                                retunObj["data"] = data;
                                retunObj["childColumnList"] = childColumnList;
                            }
                        })
                    } else {
                        retunObj["data"] = data;
                        retunObj["childColumnList"] = childColumnList;
                    }
                } else {
                    retunObj["data"] = data;
                    retunObj["childColumnList"] = childColumnList;
                }
            } else {
                retunObj["data"] = data;
                retunObj["childColumnList"] = childColumnList;

            }
        } else {
            retunObj["data"] = data;
            retunObj["childColumnList"] = childColumnList;

        }
        return retunObj;
    }

    onComboChange = (comboData, control, customName) => {

        let comboName = customName || control.label;
        const selectedRecord = this.state.selectedRecord || {};
        if (comboData) {
            comboData["item"] = {
                ...comboData["item"], "pkey": control.valuemember, "nquerybuildertablecode": control.nquerybuildertablecode,
                "source": control.source
            };
            selectedRecord[comboName] = comboData;
        } else {
            selectedRecord[comboName] = [];
        }
        if (control.child && control.child.length > 0) {
            const childComboList = getSameRecordFromTwoArrays(this.state.comboComponents, control.child, "label")
            let childColumnList = {};
            childComboList.map(columnList => {
                const val = this.comboChild(this.state.comboComponents, columnList, childColumnList, false);
                childColumnList = val.childColumnList
            })

            const parentList = getSameRecordFromTwoArrays(this.state.withoutCombocomponent, control.child, "label")

            const inputParem = {
                child: control.child,
                source: control.source,
                primarykeyField: control.valuemember,
                value: comboData.value,
                item: comboData.item
            }
            this.props.getChildValues(inputParem,
                this.props.Login.userInfo, selectedRecord, this.props.Login.comboData,
                childComboList, childColumnList, this.state.withoutCombocomponent, [...childComboList, ...parentList])
        } else {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: { selectedRecord }
            }
            this.props.updateStore(updateInfo);
        }
    }

    onComboChangeprinter = (comboData, customName) => {

        let comboName = customName;
        const selectedRecord = this.state.selectedRecord || {};
        if (comboData) {
            selectedRecord[comboName] = comboData;
        } else {
            selectedRecord[comboName] = {};
        }
        this.setState({selectedRecord})
    }

    onNumericInputChange = (value, name) => {
        let selectedRecord = this.state.selectedRecord
        selectedRecord[name] = value;
        this.setState({ selectedRecord });
    }

    handleDateChange = (dateValue, dateName) => {
        const { selectedRecord } = this.state;
        selectedRecord[dateName] = dateValue;
        this.setState({ selectedRecord });
    }

    onDrop = (value, type, oldVlaue) => {
        const design = this.state.design;
        let columns = design[0].children;
        let designData = this.props.Login.ReactInputFields;
        value = JSON.parse(value.fields);
        value = { ...value, type: "component" }
        let designDataIndex = designData.findIndex(item => item.label === value.label);
        let firstIndex = columns[0] ? columns[0].children.findIndex(item => item.label === value.label) : -1;
        let secondIndex = columns[1] ? columns[1].children.findIndex(item => item.label === value.label) : -1;

        if (designDataIndex >= 0)
            designData.splice(designDataIndex, 1);
        if (firstIndex >= 0) {
            if (type !== 1) {
                columns[0].children.splice(firstIndex, 1);
                // columns[0].splice(to, 0, columns[0].splice(from, 1)[0]);
            } else {
                if (oldVlaue) {
                    oldVlaue = JSON.parse(oldVlaue);
                    let from = columns[0].children.findIndex(item => item.label === value.label);
                    let to = columns[0].children.findIndex(item => item.label === oldVlaue.label);
                    columns[0].children.splice(to, 0, columns[0].children.splice(from, 1)[0]);
                }
            }

        } else if (type === 1) {
            if (columns[0]) {
                columns[0].children.push(value);
            } else {
                columns[0] = {
                    id: "1",
                    type: "column",
                    children: []
                }

                columns[0].children.push(value);
            }
        }
        if (secondIndex >= 0) {
            if (type !== 2) {
                columns[1].splice(secondIndex, 1);
            } else {
                if (oldVlaue) {
                    oldVlaue = JSON.parse(oldVlaue);
                    let from = columns[1].children.findIndex(item => item.label === value.label);
                    let to = columns[1].children.findIndex(item => item.label === oldVlaue.label);
                    columns[1].children.splice(to, 0, columns[1].children.splice(from, 1)[0]);
                }
            }
        } else if (type === 2) {
            if (columns[1]) {
                columns[1].children.push(value);
            } else {
                columns[1] = {
                    id: "2",
                    type: "column",
                    children: []
                }
                columns[1].children.push(value);
            }
        }

        // design.push(columns)
        this.setState({ designData, design })
    }

    onDropFile = (attachedFiles, fieldName, maxSize) => {
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

    componentDidUpdate(previousProps) {

        if (this.props.Login.masterData !== previousProps.Login.masterData) {
            if (this.props.Login.userInfo.nformcode !== previousProps.Login.userInfo.nformcode) {
                const userRoleControlRights = [];

                if (this.props.Login.userRoleControlRights) {
                    this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode] && Object.values(this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode]).map(item =>
                        userRoleControlRights.push(item.ncontrolcode))
                }
                const controlMap = getControlMap(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode)
                this.extractedColumnList = [];
                this.detailedColumnList = [];



                let data = [];
                const withoutCombocomponent = [];
                const mandatoryFields = [];
                const Layout = (this.props.Login.masterData.DynamicMasterDesign && this.props.Login.masterData.DynamicMasterDesign.slideoutdesign) || [];
                Layout.map(row => {
                    row.children.map(column => {
                        column.children.map(component => {
                            if (component.hasOwnProperty("children")) {
                                component.children.map(componentrow => {
                                    if (componentrow.inputtype === "combo" || componentrow.inputtype === "backendsearchfilter"
                                        || componentrow.inputtype === "frontendsearchfilter") {
                                        data.push(componentrow)
                                    } else {
                                        withoutCombocomponent.push(componentrow)
                                    }
                                    if (componentrow.mandatory === true) {
                                        if (componentrow.inputtype === "email") {
                                            mandatoryFields.push({
                                                "mandatory": true, "idsName": componentrow.label,
                                                "dataField": componentrow.label,
                                                "alertPreFix": this.props.intl.formatMessage({ id: "IDS_VALID" }),
                                                "validateFunction": validateEmail,
                                                "mandatoryLabel": "IDS_ENTER",
                                                "controlType": "textbox"
                                            })
                                        }
                                        else {
                                            mandatoryFields.push({
                                                "mandatory": true,
                                                "idsName": componentrow.label,
                                                "dataField": componentrow.label,
                                                "mandatoryLabel": componentrow.inputtype === "combo" ?
                                                    "IDS_SELECT" : "IDS_ENTER",
                                                "controlType": componentrow.inputtype === "combo" ?
                                                    "selectbox" : "textbox"
                                            })
                                        }
                                    }
                                })
                            }
                            else {
                                component.inputtype === "combo" || component.inputtype === "backendsearchfilter"
                                    || component.inputtype === "frontendsearchfilter" ?
                                    data.push(component)
                                    : withoutCombocomponent.push(component)

                                if (component.mandatory === true) {
                                    if (component.inputtype === "email") {
                                        mandatoryFields.push({
                                            "mandatory": true, "idsName": component.label,
                                            "dataField": component.label,
                                            "alertPreFix": this.props.intl.formatMessage({ id: "IDS_VALID" }),
                                            "validateFunction": validateEmail,
                                            "mandatoryLabel": "IDS_ENTER",
                                            "controlType": "textbox"
                                        })
                                    }
                                    else {
                                        mandatoryFields.push({
                                            "mandatory": true,
                                            "idsName": component.label,
                                            "dataField": component.label,
                                            "mandatoryLabel": component.inputtype === "combo" ?
                                                "IDS_SELECT" : "IDS_ENTER",
                                            "controlType": component.inputtype === "combo" ?
                                                "selectbox" : "textbox"
                                        })
                                    }
                                }
                            }
                        })
                    })
                })

                if (this.props.Login.masterData && this.props.Login.masterData.DynamicMasterDesign &&
                    this.props.Login.masterData.DynamicMasterDesign.screendesign) {
                    this.props.Login.masterData.DynamicMasterDesign.screendesign.griditem.map(row => {
                    //ALPD-5639--Added by Vignesh R(02-04-2025)-->blank page occurs with multilingual language.
                    this.extractedColumnList.push({
                            "idsName": row["1"][this.props.Login.userInfo.slanguagetypecode] !==undefined ? row["1"][this.props.Login.userInfo.slanguagetypecode] : row["1"]['en-US'],
                            "dataField": row["2"],
                            "width": "150",
                            "dateField": withoutCombocomponent.findIndex(x => x.label === row["2"] && x.inputtype === 'date') !== -1 ? true : false,
                            "dataType": withoutCombocomponent.filter(x => x.label === row["2"]).map(x => x.inputtype)
                        });
                    })
                    //ALPD-5639--Added by Vignesh R(02-04-2025)-->blank page occurs with multilingual language.
                    this.props.Login.masterData.DynamicMasterDesign.screendesign.gridmoreitem.map(row => {
                        this.detailedColumnList.push({
                            "idsName": row["1"][this.props.Login.userInfo.slanguagetypecode] !==undefined ? row["1"][this.props.Login.userInfo.slanguagetypecode] : row["1"]['en-US'],
                            "dataField": row["2"],
                            "dateField": withoutCombocomponent.findIndex(x => x.label === row["2"] && x.inputtype === 'date') !== -1 ? true : false,
                            "dataType": withoutCombocomponent.filter(x => x.label === row["2"]).map(x => x.inputtype)
                        });
                    })

                }
                const comboComponents = data;
                let childColumnList = {};
                data.map(columnList => {
                    const val = this.comboChild(data, columnList, childColumnList, true);
                    data = val.data;
                    childColumnList = val.childColumnList
                })

                const masterData = this.props.Login.masterData.DynamicMasterData ? sortData(this.props.Login.masterData.DynamicMasterData, "descending", "ndynamicmastercode") : [];

                this.setState({
                    withoutCombocomponent, comboComponents, childColumnList, designData: data, mandatoryFields,
                    userRoleControlRights, controlMap, data: this.props.Login.masterData.DynamicMasterData || [],
                    dataResult: process(masterData || [], this.state.dataState),
                });
            }
            else {
                let { dataState } = this.state;
                if (this.props.Login.dataState === undefined) {
                    dataState = { skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5 }
                }

                const masterData = this.props.Login.masterData.DynamicMasterData ? sortData(this.props.Login.masterData.DynamicMasterData, "descending", "ndynamicmastercode") : [];

                this.setState({
                    data: this.props.Login.masterData.DynamicMasterData || [], selectedRecord: this.props.Login.selectedRecord,
                    dataResult: process(masterData || [], dataState),
                    dataState//, comboComponents, withoutCombocomponent
                });
            }
        }

        if (this.props.Login.selectedMaster !== previousProps.Login.selectedMaster) {
            this.setState({ selectedMaster: this.props.Login.selectedMaster });
        }
        if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord) {
            this.setState({ selectedRecord: this.props.Login.selectedRecord });
        }
    }

    onInputOnChange = (event, control, value) => {
        const selectedRecord = this.state.selectedRecord || {};

        if (event.target.type === 'toggle') {
            selectedRecord[event.target.name] = event.target.checked === true ? transactionStatus.YES : transactionStatus.NO;
        } else if (event.target.type === 'numeric') {
            if (/\D/.test(event.target.value))
                selectedRecord[event.target.name] = event.target.value;
        } else if (event.target.type === 'checkbox') {
            const value1 = selectedRecord[event.target.name];
            if (value1 !== '' && value1 !== undefined) {
                if (value1.toLowerCase().includes(value.toLowerCase())) {
                    const index = value1.toLowerCase().indexOf(value.toLowerCase());
                    if (index !== -1) {
                        if (index === 0) {
                            const indexcomma = value1.indexOf(",")
                            if (indexcomma !== -1) {
                                selectedRecord[event.target.name] = value1.slice(indexcomma + 1)
                            } else {
                                selectedRecord[event.target.name] = ""
                            }
                        } else {
                            if (value1.slice(index).indexOf(",") !== -1) {
                                selectedRecord[event.target.name] = value1.slice(0, index) + value1.slice(index + value1.slice(index).indexOf(",") + 1)
                            } else {
                                selectedRecord[event.target.name] = value1.slice(0, index - 1)
                            }
                        }
                    }

                } else {
                    selectedRecord[event.target.name] = value1 + ',' + value;
                }

            } else {
                selectedRecord[event.target.name] = value;
            }
        } else if (event.target.type === 'radio') {
            selectedRecord[event.target.name] = value
        } else {
            selectedRecord[event.target.name] = conditionBasedInput(control, event.target.value, control && control.label,event.target.defaultValue)
            // if (control.isnumeric === true
            //     && control.label===value) {
            // selectedRecord[event.target.name] = event.target.value.replace(/[^0-9]/g, '');
            //     } else {
            //         selectedRecord[event.target.name] = event.target.value;
            //     }
            // selectedRecord[event.target.name] = event.target.value;
        }
        this.setState({ selectedRecord });
    }

    import = () => {
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { openModal: true, screenName: this.props.Login.displayName, operation: "import" }
        }
        this.props.updateStore(updateInfo);
    }
    //deleteRecord = (selectedRecord, operation, ncontrolCode) => {
    deleteRecord = (deleteParam) => {
        const inputParam = {
            classUrl: "dynamicmaster",
            methodUrl: "DynamicMaster",
            displayName: this.props.Login.displayName,
            inputData: {
                ["dynamicmaster"]: { "ndynamicmastercode": deleteParam.selectedRecord.ndynamicmastercode },//.dataItem,
                "userinfo": this.props.Login.userInfo
            },
            operation: "delete",
            dataState: this.state.dataState
        }

        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, deleteParam.ncontrolCode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData: this.props.Login.masterData },
                    openModal: true, screenName: this.props.Login.displayName,
                    operation: "delete"
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.crudMaster(inputParam, this.props.Login.masterData, "openModal");
        }
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

    onSaveClick = (saveType, formRef) => {
        //add / edit  
        let isFileupload = true;
        let inputData = {};
        let dataState = undefined;
        let methodUrl = "DynamicMaster";
        inputData["userinfo"] = this.props.Login.userInfo;
        inputData["masterdateconstraints"] = this.props.Login.masterData.DynamicMasterDesign.screendesign.masterdateconstraints;
        inputData["masterdatefields"] = this.props.Login.masterData.DynamicMasterDesign.screendesign.masterdatefields;
        inputData["mastercombinationunique"] = this.props.Login.masterData.DynamicMasterDesign.screendesign.mastercombinationunique;
        inputData["isFileupload"] = false;
        let selectedId = null;
        let operation = "";
        let selectedRecord = this.state.selectedRecord;
        if (this.props.Login.operation === "update") {    // edit
            dataState = this.state.dataState
            inputData["dynamicmaster"] = { ndynamicmastercode: this.state.selectedRecord["ndynamicmastercode"] };//this.state.selectedRecord;
            inputData["dynamicmaster"]["jsondata"] = {};
            inputData["dynamicmaster"]["jsonuidata"] = {};
            selectedId = this.props.Login.selectedId;
            operation = "update";
        }
        else {
            //add                          
            inputData["dynamicmaster"] = { //"nsitecode": this.props.Login.userInfo.nmastersitecode, 
                nformcode: this.props.Login.userInfo.nformcode,
                ndesigntemplatemappingcode: this.props.Login.masterData.DynamicMasterDesign.ndesigntemplatemappingcode,
                jsondata: {}, jsonuidata: {}
            };

            operation = "create";

        }

        const dateList = [];
        const defaulttimezone = this.props.Login.defaulttimezone;
        const userInfo = this.props.Login.userInfo;

        this.props.Login.masterData.DynamicMasterDesign &&
            this.props.Login.masterData.DynamicMasterDesign.slideoutdesign.map(row => {
                row.children.map(column => {
                    column.children.map(component => {
                        if (component.hasOwnProperty("children")) {

                            component.children.map(componentrow => {
                                if (componentrow.inputtype === "combo") {
                                    inputData["dynamicmaster"]["jsondata"][componentrow.label] = selectedRecord[componentrow.label] ?
                                        {
                                            value: selectedRecord[componentrow.label].value,
                                            label: selectedRecord[componentrow.label].label,
                                            pkey: componentrow.valuemember,
                                            nquerybuildertablecode: componentrow.nquerybuildertablecode,
                                            source: componentrow.source,

                                            [componentrow.table.item.component === 'Dynamic' ? 'ndynamicmastercode' : componentrow.valuemember]: operation === "update" ?
                                                selectedRecord[componentrow.label].item ? selectedRecord[componentrow.label].item.jsondata[componentrow.table.item.component === 'Dynamic' ? 'ndynamicmastercode' : componentrow.valuemember] :
                                                    selectedRecord[componentrow.label][componentrow.table.item.component === 'Dynamic' ? 'ndynamicmastercode' : componentrow.valuemember]
                                                :
                                                selectedRecord[componentrow.label].item.jsondata[componentrow.table.item.component === 'Dynamic' ? 'ndynamicmastercode' : componentrow.valuemember]
                                        } : -1

                                    inputData["dynamicmaster"]["jsonuidata"][componentrow.label] = selectedRecord[componentrow.label] ? selectedRecord[componentrow.label].label : ""

                                }
                                else if (componentrow.inputtype === "date") {
                                    if (componentrow.mandatory) {
                                        inputData["dynamicmaster"]["jsondata"][componentrow.label] = formatDate(selectedRecord[componentrow.label], false)

                                        inputData["dynamicmaster"]["jsonuidata"][componentrow.label] = inputData["dynamicmaster"]["jsondata"][componentrow.label]
                                        //inputData["dynamicmaster"]["jsonuidata"][componentrow.label] = convertDateTimetoString(selectedRecord[componentrow.label], userInfo);
                                    }
                                    else {
                                        inputData["dynamicmaster"]["jsondata"][componentrow.label] = componentrow.loadcurrentdate ?
                                            formatDate(selectedRecord[componentrow.label] || new Date(), false) :
                                            selectedRecord[componentrow.label] ? formatDate(selectedRecord[componentrow.label], false)
                                                : "";

                                        inputData["dynamicmaster"]["jsonuidata"][componentrow.label] = inputData["dynamicmaster"]["jsondata"][componentrow.label];
                                        //convertDateTimetoString(selectedRecord[componentrow.label], userInfo);
                                    }
                                    if (componentrow.timezone) {
                                        inputData["dynamicmaster"]["jsondata"][`tz${componentrow.label}`] = selectedRecord[`tz${componentrow.label}`] ?
                                            { value: selectedRecord[`tz${componentrow.label}`].value, label: selectedRecord[`tz${componentrow.label}`].label } :
                                            defaulttimezone ? defaulttimezone : -1

                                        inputData["dynamicmaster"]["jsonuidata"][`tz${componentrow.label}`] = inputData["dynamicmaster"]["jsondata"][`tz${componentrow.label}`]
                                    }
                                    dateList.push(componentrow.label)
                                }

                                else {
                                    inputData["dynamicmaster"]["jsondata"][componentrow.label] = selectedRecord[componentrow.label] ?
                                        selectedRecord[componentrow.label] : ""

                                    inputData["dynamicmaster"]["jsonuidata"][componentrow.label] = inputData["dynamicmaster"]["jsondata"][componentrow.label]
                                    // inputData["dynamicmaster"]["jsondata"][componentrow.label]

                                }
                                return inputData["dynamicmaster"];
                            })
                        }
                        else {
                            if (component.inputtype === "combo") {
                                if (selectedRecord[component.label].length === 0) {
                                    inputData["dynamicmaster"]["jsondata"][component.label] = -1;
                                    inputData["dynamicmaster"]["jsonuidata"][component.label] = "";

                                } else {
                                    inputData["dynamicmaster"]["jsondata"][component.label] = selectedRecord[component.label] ?
                                        {
                                            value: selectedRecord[component.label].value,
                                            label: selectedRecord[component.label].label,
                                            pkey: component.valuemember,
                                            nquerybuildertablecode: component.nquerybuildertablecode,
                                            source: component.source,

                                            [component.table.item.component === 'Dynamic' ? 'ndynamicmastercode' : component.valuemember]
                                                : operation === "update" ?
                                                    selectedRecord[component.label].item ? selectedRecord[component.label].item.jsondata && selectedRecord[component.label].item.jsondata[component.table.item.component === 'Dynamic' ? 'ndynamicmastercode' : component.valuemember] :
                                                        selectedRecord[component.label][component.table.item.component === 'Dynamic' ? 'ndynamicmastercode' : component.valuemember]
                                                    :
                                                    selectedRecord[component.label].item.jsondata && selectedRecord[component.label].item.jsondata[component.table.item.component === 'Dynamic' ? 'ndynamicmastercode' : component.valuemember]
                                        } : -1


                                    inputData["dynamicmaster"]["jsonuidata"][component.label] = inputData["dynamicmaster"]["jsondata"][component.label].label ? inputData["dynamicmaster"]["jsondata"][component.label].label : -1;
                                }
                                //selectedRecord[component.label] ? selectedRecord[component.label].label : ""
                            }
                            else if (component.inputtype === "date") {
                                if (component.mandatory) {
                                    inputData["dynamicmaster"]["jsondata"][component.label] = formatDate(selectedRecord[component.label], false);
                                    // convertDateTimetoString(selectedRecord[component.label] ?
                                    // selectedRecord[component.label] : new Date(), userInfo);

                                    inputData["dynamicmaster"]["jsonuidata"][component.label] = inputData["dynamicmaster"]["jsondata"][component.label]
                                    //convertDateTimetoString(selectedRecord[component.label], userInfo);

                                } else {
                                    inputData["dynamicmaster"]["jsondata"][component.label] = component.loadcurrentdate ?
                                        //convertDateTimetoString(selectedRecord[component.label] ?                                      
                                        //    selectedRecord[component.label] : new Date(), userInfo) :
                                        formatDate(selectedRecord[component.label] || new Date(), false) :
                                        selectedRecord[component.label] ?
                                            // convertDateTimetoString(selectedRecord[component.label] ?
                                            //   selectedRecord[component.label] : new Date(), userInfo) : "";
                                            formatDate(selectedRecord[component.label], false) : "";
                                    inputData["dynamicmaster"]["jsonuidata"][component.label] = inputData["dynamicmaster"]["jsondata"][component.label]
                                    //convertDateTimetoString(selectedRecord[component.label], userInfo)

                                }
                                if (component.timezone) {
                                    inputData["dynamicmaster"]["jsondata"][`tz${component.label}`] = selectedRecord[`tz${component.label}`] ?
                                        { value: selectedRecord[`tz${component.label}`].value, label: selectedRecord[`tz${component.label}`].label } :
                                        defaulttimezone ? defaulttimezone : -1

                                    inputData["dynamicmaster"]["jsonuidata"][`tz${component.label}`] = inputData["dynamicmaster"]["jsondata"][`tz${component.label}`]
                                }
                                dateList.push(component.label)
                            }
                            else {
                                inputData["dynamicmaster"]["jsondata"][component.label] = selectedRecord[component.label] ?
                                    selectedRecord[component.label] : ""

                                inputData["dynamicmaster"]["jsonuidata"][component.label] = inputData["dynamicmaster"]["jsondata"][component.label].label ? inputData["dynamicmaster"]["jsondata"][component.label].label :
                                    inputData["dynamicmaster"]["jsondata"][component.label]
                            }
                        }
                        return inputData["dynamicmaster"];
                    }
                    )
                    return inputData["dynamicmaster"];
                })
                return inputData["dynamicmaster"];
            })
        let tempData = {}
        const formData = new FormData();
        this.props.Login.withoutCombocomponent.map(item => {
            if (item.inputtype === "files") {
                if (typeof selectedRecord[item && item.label] === "object") {
                    this.state.selectedRecord[item && item.label] && this.state.selectedRecord[item && item.label].forEach((item1, index) => {
                        const fileName = create_UUID();
                        const splittedFileName = item1.name.split('.');
                        const fileExtension = item1.name.split('.')[splittedFileName.length - 1];
                        const uniquefilename = fileName + '.' + fileExtension;

                        tempData[item && item.label + '_susername'] = this.props.Login.userInfo.susername
                        tempData[item && item.label + '_suserrolename'] = this.props.Login.userInfo.suserrolename
                        tempData[item && item.label + '_nfilesize'] = item1.size
                        tempData[item && item.label + '_ssystemfilename'] = uniquefilename
                        tempData[item && item.label] = Lims_JSON_stringify(item1.name.trim(), false)
                        formData.append("uploadedFile" + index, item1);
                        formData.append("uniquefilename" + index, uniquefilename);
                        formData.append("filecount", this.state.selectedRecord[item && item.label].length);
                        formData.append("isFileEdited", transactionStatus.YES);
                        formData.append("userinfo", JSON.stringify(this.props.Login.userInfo));
                        inputData["dynamicmaster"]["jsondata"] = {
                            ...inputData["dynamicmaster"]["jsondata"],
                            ...tempData
                        };
                        inputData["dynamicmaster"]["jsonuidata"] = {
                            ...inputData["dynamicmaster"]["jsonuidata"],
                            ...tempData
                        };
                        formData.append("userinfo", JSON.stringify(this.props.Login.userInfo));
                        inputData["isFileupload"] = true;
                        isFileupload = true;
                        //methodUrl="DynamicMasterWithFile"
                    }
                    )
                }
            }
            if (this.state.selectedRecord[this.state.selectedRecord[item && item.label] + '_ssystemfilename'] === undefined && item.inputtype === "files" && tempData[item && item.label + '_ssystemfilename'] == undefined) {
                inputData["dynamicmaster"]["jsondata"] = {
                    ...inputData["dynamicmaster"]["jsonuidata"],
                    ...this.state.selectedRecord
                }
                inputData["dynamicmaster"]["jsonuidata"][item.label] = inputData["dynamicmaster"]["jsondata"][item.label] // ALPD-5464 - Gowtham R - 19/02/2025 - Dynamic Master Screen fileupload input -> Blank screen issue
            }
        })
        inputData["dynamicmaster"]["jsonstring"] = JSON.stringify(inputData["dynamicmaster"]["jsondata"]);
        inputData["dynamicmaster"]["jsonuistring"] = JSON.stringify(inputData["dynamicmaster"]["jsonuidata"]);
        inputData["masterdatelist"] = dateList;
        formData.append("Map", Lims_JSON_stringify(JSON.stringify(inputData)));
        const inputParam = {
            classUrl: "dynamicmaster",
            methodUrl: methodUrl,
            displayName: this.props.Login.displayName,
            inputData: inputData, operation: operation,
            saveType, formRef, selectedId, dataState, formData: formData, isFileupload

        }
        const esignNeeded = showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolCode);
        if (esignNeeded) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData: this.props.Login.masterData },
                    openModal: true, screenName: this.props.Login.displayName,
                    operation: "create"
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.crudMaster(inputParam, this.props.Login.masterData, "openModal");
        }
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

}
export default connect(mapStateToProps, {
    callService, crudMaster, updateStore, validateEsignCredential,
    getChildValues, getEditDynamicMasterCombo,//fetchRecord,
    getDynamicMasterCombo,
    addMasterRecord, getAddMasterCombo, getDynamicMasterTempalte,
    getChildComboMaster, getChildValuesForAddMaster, getEditMaster,
     viewAttachment, openBarcodeModal,barcodeGeneration
})(injectIntl(DynamicMaster));
