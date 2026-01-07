import React from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { process } from '@progress/kendo-data-query';
import DataGrid from '../../components/data-grid/data-grid.component';
import DateTimePicker from '../../components/date-time-picker/date-time-picker.component';
import { ListWrapper } from '../../components/client-group.styles';
import AddTemporaryStorage from '../storagemanagement//AddTemporaryStorage';
import SlideOutModal from '../../components/slide-out-modal/SlideOutModal';
import Esign from '../audittrail/Esign';
import { transactionStatus } from '../../components/Enumeration';
import { DEFAULT_RETURN } from '../../actions/LoginTypes';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';

import {
    callService, crudMaster,
    updateStore, validateEsignCredential, getComboTemporaryStorage, getBarcodeDataTemporaryStorage, saveTemporaryStorage, getActiveTemporaryStorageById, getTemporaryStorage, validateEsignCredentialTemporaryStorage
} from '../../actions';
// import { DEFAULT_RETURN } from '../../../actions/LoginTypes';
import { sortData,getControlMap, getStartOfDay, getEndOfDay, convertDateValuetoString, rearrangeDateFormat, constructOptionList, Lims_JSON_stringify, formatInputDate, showEsign } from '../../components/CommonScript'


const mapStateToProps = state => {
    return ({ Login: state.Login })
}

class TemporaryStorage extends React.Component {
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
            showSaveContinue: true
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

    gridfillingColumn(data, barcodeFields) {
        //  const tempArray = [];
        const temparray1 = [{ idsName: 'IDS_BARCODEID', dataField: 'sbarcodeid', width: '250px', mandatoryLabel: 'IDS_ENTER', controlType: 'textinput' },
        //  { idsName: 'IDS_SAMPLEQTY', dataField: 'nsampleqty', width: '250px', mandatoryLabel: 'IDS_ENTER', controlType: 'textinput' },
        //  { idsName: 'IDS_UNIT', dataField: 'sunitname', width: '250px', mandatoryLabel: 'IDS_SELECT', controlType: 'selectbox' },
        { idsName: 'IDS_STORAGEDATETIME', dataField: 'sstoragedatetime', width: '250px' }

        ];
        /*let temparray2 = []
        barcodeFields&&barcodeFields.forEach(item=>{
            data && data.forEach((item) => {
                const entries = Object.entries(item.jsondata);
                if (entries.length > 0) {
                    entries.forEach(([key]) => {
                        const keyExists = temparray2.some(column => column.idsName === key);
                        if (!keyExists) {
                            if(item.sfieldname===key){
                                temparray2.push({
                                    idsName: key,
                                    dataField: key,
                                    width: '250px'
                                });
                            }
                           
                        }
    
    
                    });
                }
            });
        });*/
        let temparray2 = [];
        barcodeFields && barcodeFields.forEach(barcodeItem => {
            data && data.forEach(dataItem => {
                const entries = Object.entries(dataItem.jsondata);
                if (entries.length > 0) {
                    entries.forEach(([key]) => {
                        const keyExists = temparray2.some(column => column.idsName === key);
                        if (!keyExists) {
                            if (barcodeItem.sfieldname === key) {
                                temparray2.push({
                                    idsName: key,
                                    dataField: key,
                                    width: '250px'
                                });
                            }
                        }
                    });
                }
            });
        });

        const newArray = [...temparray1, ...temparray2]
        newArray.push({ idsName: 'IDS_COMMENTS', dataField: 'scomments', width: '250px' });
        return newArray;
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
        if (this.props.Login.operation === 'update') {
            this.props.validateEsignCredentialTemporaryStorage(inputParam, "openModal");
        }

        else {
            this.props.validateEsignCredential(inputParam, "openModal");
        }
    }
    render() {
        // console.log("Temporary Storage", this.props.Login.masterData.TemporaryStorage)
        // console.log("masterData", this.props.Login.masterData)

        //console.log("controlMap", this.state.controlMap)

        let fromDate = "";
        let toDate = "";
        const extractedColumnList = this.gridfillingColumn(this.props.Login.masterData.TemporaryStorage && this.props.Login.masterData.TemporaryStorage || [], this.props.Login.masterData.jsondataBarcodeFields && this.props.Login.masterData.jsondataBarcodeFields);




        this.extractedColumnList = extractedColumnList;


        const addId = this.state.controlMap.has("AddTemporaryStorage") && this.state.controlMap.get("AddTemporaryStorage").ncontrolcode;
        const editId = this.state.controlMap.has("EditTemporaryStorage") && this.state.controlMap.get("EditTemporaryStorage").ncontrolcode;
        const deleteId = this.state.controlMap.has("DeleteTemporaryStorage") && this.state.controlMap.get("DeleteTemporaryStorage").ncontrolcode;
        const editParam = {
            screenName: this.props.Login.displayName,
            operation: "update",
            userInfo: this.props.Login.userInfo,
            ncontrolcode: editId,
            masterData: this.props.Login.masterData,
            inputParam: this.props.Login.inputParam,
            primaryKeyField: "ntemporarystoragecode",
            selectedRecord: this.state.selectedRecord || {},
            dataState: this.state.dataState

        };
        const addParam = {
            screenName: this.props.Login.displayName, primaryKeyField: "ntemporarystoragecode", primaryKeyValue: undefined,
            operation: "create", inputParam: this.props.Login.inputParam, userInfo: this.props.Login.userInfo, ncontrolcode: addId,
            selectedRecord: this.state.selectedRecord,
            masterData: this.props.Login.masterData
        };
        //ALPD-4618--Vignesh R(01-08-2024)
        const deleteParam = { operation: "delete", ncontrolcode: deleteId, selectedRecord: this.state.selectedRecord };

        if (this.props.Login.masterData && this.props.Login.masterData.FromDate) {
            fromDate = (this.state.selectedRecord["fromdate"] && getStartOfDay(this.state.selectedRecord["fromdate"])) || rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.FromDate);
            toDate = (this.state.selectedRecord["todate"] && getEndOfDay(this.state.selectedRecord["todate"])) || rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.ToDate);
        }
        return (
            <>
                {/* <Preloader loadng={this.props.Login.loading}/> */}
                <Row>
                    <Col>
                        <ListWrapper className="client-list-content">
                            <Row>
                                <Col md={2}>
                                    <DateTimePicker
                                        name={"fromdate"}
                                        label={this.props.intl.formatMessage({ id: "IDS_FROM" })}
                                        className='form-control'
                                        placeholderText="Select date.."
                                        selected={this.state.selectedRecord["fromdate"] || fromDate}
                                        dateFormat={this.props.Login.userInfo.ssitedate}
                                        isClearable={false}
                                        onChange={date => this.handleDateChange("fromdate", date)}
                                        value={this.state.selectedRecord["fromdate"] || fromDate}

                                    />
                                </Col>
                                <Col md={2}>
                                    <DateTimePicker
                                        name={"todate"}
                                        label={this.props.intl.formatMessage({ id: "IDS_TO" })}
                                        className='form-control'
                                        placeholderText="Select date.."
                                        selected={this.state.selectedRecord["todate"] || toDate}
                                        dateFormat={this.props.Login.userInfo.ssitedate}
                                        isClearable={false}
                                        onChange={date => this.handleDateChange("todate", date)}
                                        value={this.state.selectedRecord["todate"] || toDate}

                                    />
                                </Col>
                                <Col md={2}>
                                    <FormSelectSearch
                                        formLabel={this.props.intl.formatMessage({ id: "IDS_PROJECTTYPE" })}
                                        isSearchable={true}
                                        name={"nprojecttypecode"}
                                        isDisabled={false}
                                        placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                        isMandatory={true}
                                        isClearable={false}
                                        options={this.state.projectType}
                                        value={this.state.selectedRecord["nprojecttypecode"] && this.state.selectedRecord["nprojecttypecode"] || this.props.Login.masterData.selectedProjectType}
                                        defaultValue={this.state.selectedRecord["nprojecttypecode"]}
                                        onChange={(event) => this.onComboChange(event, "nprojecttypecode")}
                                        closeMenuOnSelect={true}
                                    >
                                    </FormSelectSearch>
                                </Col>    {/* <Col></Col> */}
                            </Row>

                            {this.state.data ?
                                <DataGrid
                                    primaryKeyField={"ntemporarystoragecode"}
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
                                    addRecord={() => this.props.getComboTemporaryStorage(addParam)}
                                    deleteParam={deleteParam}
                                    deleteRecord={this.deleteRecord}
                                    fetchRecord={this.props.getActiveTemporaryStorageById}
                                    editParam={editParam}
                                    //ATE234 Janakumar ALPD-5577 Sample Storage-->while download the pdf, screen getting freezed
                                    isDownloadPDFRequired={false}
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
                            { "mandatory": true, "idsName": "IDS_BARCODEID", "dataField": "sbarcodeid", "width": "250px", "mandatoryLabel": "IDS_ENTER", "controlType": "textinput" },
                            // { "mandatory": true, "idsName": "IDS_SAMPLEQTY", "dataField": "nsampleqty", "width": "250px", "mandatoryLabel": "IDS_ENTER", "controlType": "textinput" },
                            // { "mandatory": true, "idsName": "IDS_UNIT", "dataField": "nunitcode", "width": "250px", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" }]}
                            { "mandatory": true, "idsName": "IDS_STORAGEDATETIME", "dataField": "dstoragedatetime", "width": "250px", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" }]}
                        addComponent={this.props.Login.loadEsign ?
                            <Esign operation={this.props.Login.operation}
                                formatMessage={this.props.intl.formatMessage}
                                onInputOnChange={this.onInputOnChange}
                                inputParam={this.props.Login.inputParam}
                                selectedRecord={this.state.selectedRecord || {}}
                            />
                            : <AddTemporaryStorage
                                autoSaveGetDataTempoaryStorage={this.autoSaveGetDataTempoaryStorage}
                                barcodedata={this.props.Login.masterData.jsondataBarcodeData}
                                barcodeFields={this.props.Login.masterData.jsondataBarcodeFields}
                                selectedRecord={this.state.selectedRecord || {}}
                                onInputOnChange={this.onInputOnChange}
                                onComboChange={this.onComboChange}
                                formatMessage={this.props.intl.formatMessage}
                                operation={this.props.Login.operation}
                                //  unit={this.props.Login.unit}
                                userInfo={this.props.Login.userInfo}
                                handleDateChangeSlidout={this.handleDateChangeSlidout}
                                selectedProjectType={this.props.Login.masterData.selectedProjectType}

                            />}
                    />
                }
            </>
        );
    }
    deleteRecord = (deleteParam) => {
        let obj = convertDateValuetoString(this.props.Login.masterData.FromDate, this.props.Login.masterData.ToDate, this.props.Login.userInfo);
        let fromDate = obj.fromDate;
        let toDate = obj.toDate;
        const inputParam = {
            classUrl: this.props.Login.inputParam.classUrl,
            methodUrl: this.props.Login.inputParam.methodUrl,
            displayName: this.props.Login.inputParam.displayName,
            inputData: {
                [this.props.Login.inputParam.methodUrl.toLowerCase()]: deleteParam.selectedRecord,
                "userinfo": this.props.Login.userInfo,
                "fromDate": fromDate,
                "toDate": toDate,
                "nprojecttypecode": this.props.Login.masterData.selectedProjectType.value || -1,
                "ntemporarystoragecode": deleteParam.selectedRecord['ntemporarystoragecode']

            },
            operation: deleteParam.operation,
            dataState: this.state.dataState
        }

        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, deleteParam.ncontrolCode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData: this.props.Login.masterData },
                    openModal: true, screenName: this.props.intl.formatMessage({ id: "IDS_TEMPORARYSTOARGE" }),
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
        const sbarcodeid = this.props.Login.masterData.jsondataBarcodeData;

        if (selectedRecord["sbarcodeid"] && selectedRecord["sbarcodeid"].length === parseInt(this.props.Login.masterData.nbarcodelength && this.props.Login.masterData.nbarcodelength)) {

            if (sbarcodeid != undefined && sbarcodeid != '') {

                let inputData = {};
                inputData["temporarystorage"] = {};
                if (this.props.Login.operation === "create") {

                    inputData["temporarystorage"]["nunitcode"] = selectedRecord["nunitcode"] ? selectedRecord["nunitcode"].value : -1;
                    inputData["temporarystorage"]["nsampleqty"] = selectedRecord["nsampleqty"] ? Number(selectedRecord["nsampleqty"]) : -1;
                    inputData["temporarystorage"]["jsondata"] = Lims_JSON_stringify(JSON.stringify(this.props.Login.masterData.jsondataBarcodeData));
                }
                inputData["temporarystorage"]["nprojecttypecode"] = this.props.Login.masterData.selectedProjectType.value || transactionStatus.NA;
                if (this.props.Login.operation === "update") {
                    inputData["temporarystorage"]["ntemporarystoragecode"] = this.props.Login.selectedId;
                }
                inputData["temporarystorage"]["sbarcodeid"] = selectedRecord["sbarcodeid"] ? selectedRecord["sbarcodeid"] : -1;

                inputData["temporarystorage"]["dstoragedatetime"] = formatInputDate(selectedRecord["dstoragedatetime"], false);
                inputData["temporarystorage"]["scomments"] = selectedRecord["scomments"] && selectedRecord["scomments"] || "";
                inputData["temporarystorage"]["ntzstoragedatetime"] = selectedRecord["ntzstoragedatetime"] && selectedRecord["ntzstoragedatetime"].value || transactionStatus.NA
                inputData["temporarystorage"]["noffsetstoragedatetime"] = selectedRecord["noffsetstoragedatetime"] && selectedRecord["noffsetstoragedatetime"].value || transactionStatus.NA
                let obj = convertDateValuetoString(this.props.Login.masterData.FromDate, this.props.Login.masterData.ToDate, this.props.Login.userInfo);
                let fromDate = obj.fromDate;
                let toDate = obj.toDate;
                inputData["fromDate"] = fromDate;
                inputData["toDate"] = toDate;
                inputData["nprojecttypecode"] = this.props.Login.masterData.selectedProjectType.value || transactionStatus.NA;
                inputData["userinfo"] = {
                    ...this.props.Login.userInfo,
                    sformname: Lims_JSON_stringify(this.props.Login.userInfo.sformname),
                    smodulename: Lims_JSON_stringify(this.props.Login.userInfo.smodulename)
                }



                const inputParam = {
                    nformcode: this.props.Login.userInfo.nformcode,
                    classUrl: "temporarystorage",
                    methodUrl: "TemporaryStorage",
                    inputData: inputData,
                    operation: this.props.Login.operation,
                    saveType, formRef,
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
                    this.props.saveTemporaryStorage(inputParam, masterData);
                }
            } else {
                toast.warn(
                    this.props.intl.formatMessage({
                        id: "IDS_CLICKENTERTOJSONRECORD",
                    })
                );
            }
        } else {
            toast.warn(
                this.props.intl.formatMessage({
                    id: "IDS_INVALIDABARCODE",	//ALPD-4500 Changed IDS value to throw alert correctly by VISHAKH
                })
            );
        }

    }

    onComboChange = (comboData, fieldName) => {
        const selectedRecord = this.state.selectedRecord || {};

        if (fieldName === "nprojecttypecode") {
            let inputData = [];
            let obj = convertDateValuetoString(this.props.Login.masterData.FromDate, this.props.Login.masterData.ToDate, this.props.Login.userInfo);
            let fromDate = obj.fromDate;
            let toDate = obj.toDate;
            inputData["fromDate"] = fromDate;
            inputData["toDate"] = toDate;
            inputData = {
                userinfo: this.props.Login.userInfo,
                nprojecttypecode: parseInt(comboData.value),
                selectedProjectType: comboData,
                toDate: toDate,
                fromDate: fromDate
            }
            const masterData = { ...this.props.Login.masterData }
            const inputParam = { masterData, inputData }
            this.props.getTemporaryStorage(inputParam)
        } else {
            selectedRecord[fieldName] = comboData;
            this.setState({ selectedRecord });
        }

    }
    handleDateChangeSlidout = (dateName, dateValue) => {
        const selectedRecord = this.state.selectedRecord || {};
        selectedRecord[dateName] = dateValue;
        this.setState({ selectedRecord });
    };
    autoSaveGetDataTempoaryStorage = (event) => {
        let selectedRecord = this.state.selectedRecord || {}
        event.stopPropagation();
        //let invalidbarcode = event.target.value.substring(1, 2);
        if (parseInt(selectedRecord["sbarcodeid"] && selectedRecord["sbarcodeid"].length) === parseInt(this.props.Login.masterData.nbarcodelength && this.props.Login.masterData.nbarcodelength) && event.keyCode === 13) {

            // if (parseInt(invalidbarcode) === 3) {

            let inputParam = {
                nprojecttypecode: this.props.Login.masterData.selectedProjectType.value,
                spositionvalue: event.target.value,
                userinfo: this.props.Login.userInfo,
                nbarcodeLength: this.props.Login.settings && parseInt(this.props.Login.settings[37]),
                jsondata: {},
                masterData: this.props.Login.masterData,
                selectedRecord: selectedRecord || {}
            }
            this.props.getBarcodeDataTemporaryStorage(inputParam);
            /*}
            else {
                toast.warn(
                    this.props.intl.formatMessage({
                        id: "IDS_INVALIDBARCODEID",
                    })
                );
            }*/

        }
        /*  else {
             toast.warn(
                 this.props.intl.formatMessage({
                     id: "IDS_INVALIDBARCODELENGTH",
                 })
             );
         }*/
    };
    onInputOnChange = (event, fieldname) => {
        const selectedRecord = this.state.selectedRecord || {};
        if (fieldname === 'nsampleqty') {
            if (/^\d{0,3}(\.\d{0,2})?$/.test(event.target.value) || event.target.value === "") {

                selectedRecord[fieldname] = event.target.value;

            }
        }
        else if (event.target.type === 'checkbox') {
            selectedRecord[event.target.name] = event.target.checked === true ? transactionStatus.YES : transactionStatus.NO;
        }
        else {
            selectedRecord[event.target.name] = event.target.value;
        }
        this.setState({ selectedRecord });

    }
    componentDidUpdate(previousProps) {
        let { projectType } = this.state;
        let bool = false;
        if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord) {
            this.setState({ selectedRecord: this.props.Login.selectedRecord });
        }

        if (this.props.Login.masterData.projectType !== previousProps.Login.masterData.projectType) {
            const projectTypeMap = constructOptionList(this.props.Login.masterData.projectType || [], "nprojecttypecode",
                "sprojecttypename", undefined, undefined, undefined);
            projectType = projectTypeMap.get("OptionList");
            bool = true;
        }

        if (this.props.Login.masterData.selectedProjectType !== previousProps.Login.masterData.selectedProjectType) {
            const projectTypeMap = constructOptionList(this.props.Login.masterData.projectType || [], "nprojecttypecode",
                "sprojecttypename", undefined, undefined, undefined);
            projectType = projectTypeMap.get("OptionList");
            bool = true;

        }

        // if (this.props.Login.masterData.TemporaryStorage !== previousProps.Login.masterData.TemporaryStorage) {
        //     let temporaryStorage = [];
        //     temporaryStorage =
        //         this.props.Login.masterData.TemporaryStorage && this.props.Login.masterData.TemporaryStorage.map(sampleItem => {
        //             const entries = Object.entries(sampleItem.jsondata);
        //             if (entries.length > 0) {
        //                 const newItem = { ...sampleItem };
        //                 entries.forEach(([key, value]) => {

        //                     newItem[key] = value;

        //                 });
        //                 return newItem;
        //             }
        //             return sampleItem;
        //         });
        //     let { dataState } = this.state;
        //     if (dataState === undefined) {
        //         dataState = { skip: 0, take: this.state.dataState.take }
        //     }
        //     if (this.state.dataResult.data) {
        //         if (this.state.dataResult.data.length === 1) {
        //             let skipcount = this.state.dataState.skip > 0 ? (this.state.dataState.skip - this.state.dataState.take) :
        //                 this.state.dataState.skip
        //             dataState = { skip: skipcount, take: this.state.dataState.take }
        //         }
        //     }

        //     this.setState({
        //         data: temporaryStorage,
        //         dataState,
        //         dataResult: process(temporaryStorage || [], dataState),
        //     });
        // }

        if (this.props.Login.masterData !== previousProps.Login.masterData) {

            if (this.props.Login.userInfo.nformcode !== previousProps.Login.userInfo.nformcode) {
                const userRoleControlRights = [];
                if (this.props.Login.userRoleControlRights) {
                    this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode] && Object.values(this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode]).map(item =>
                        userRoleControlRights.push(item.ncontrolcode))
                }
                const controlMap = getControlMap(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode)

                let temporaryStorage = [];
                temporaryStorage =
                    this.props.Login.masterData.TemporaryStorage && this.props.Login.masterData.TemporaryStorage.map(sampleItem => {
                        const entries = Object.entries(sampleItem.jsondata);
                        if (entries.length > 0) {
                            const newItem = { ...sampleItem };
                            entries.forEach(([key, value]) => {

                                newItem[key] = value;

                            });
                            return newItem;
                        }
                        return sampleItem;
                    });
                // let { dataState } = this.state;
                // if (this.props.Login.dataState === undefined) {
                //     dataState = { skip: 0, take: this.state.dataState.take }
                // }
                // if (this.state.dataResult.data) {
                //     if (this.state.dataResult.data.length === 1 && this.props.Login.operation ==='delete') {
                //         let skipcount = this.state.dataState.skip > 0 ? (this.state.dataState.skip - this.state.dataState.take) :
                //             this.state.dataState.skip
                //         dataState = { skip: skipcount, take: this.state.dataState.take }
                //     }
                // }

                    this.setState({
                        userRoleControlRights, controlMap, data: temporaryStorage,
                        dataResult: process(temporaryStorage || [], this.state.dataState),
                    });
                }else {

                //jana ALPD-4694 Temporary Storage-->While Try to Delete the Records the Fields are Align Wrongly

                let temporaryStoragedata = [];
                temporaryStoragedata =
                    this.props.Login.masterData.TemporaryStorage && this.props.Login.masterData.TemporaryStorage.map(sampleItem => {
                        const entries = Object.entries(sampleItem.jsondata);
                        if (entries.length > 0) {
                            const newItem = { ...sampleItem };
                            entries.forEach(([key, value]) => {

                                newItem[key] = value;

                            });
                            return newItem;
                        }
                        return sampleItem;
                    });


                    let {dataState}=this.state;

                    if (this.props.Login.dataState === undefined || this.props.Login.masterData.selectedProjectType !== previousProps.Login.masterData.selectedProjectType) {
                        dataState = { skip: 0, take: this.state.dataState.take }
                    }
                    if (this.state.dataResult.data) {
                        if (this.state.dataResult.data.length === 1 && this.props.Login.operation ==='delete') {
                            let skipcount = this.state.dataState.skip > 0 ? (this.state.dataState.skip - this.state.dataState.take) :
                                this.state.dataState.skip
                            dataState = { skip: skipcount, take: this.state.dataState.take }
                        }
                    }
                    this.setState({
                        data: temporaryStoragedata, selectedRecord: this.props.Login.selectedRecord,
                        dataResult: process(temporaryStoragedata || [], dataState),
                        dataState
                    });

                }

                if (this.props.Login.masterData.jsondataBarcodeFields !== previousProps.Login.masterData.jsondataBarcodeFields) {
                    const retrievedData = sortData(this.props.Login.masterData.jsondataBarcodeFields,"ascending","nsorter");
                    this.setState({ jsondataBarcodeFields: retrievedData });
                }
                /*  else {
                      if (this.props.Login.masterData.TemporaryStorage) {
                          let temporaryStorage = [];
                          temporaryStorage =
                              this.props.Login.masterData.TemporaryStorage && this.props.Login.masterData.TemporaryStorage.map(sampleItem => {
                                  const entries = Object.entries(sampleItem.jsondata);
                                  if (entries.length > 0) {
                                      const newItem = { ...sampleItem };
                                      entries.forEach(([key, value]) => {
      
                                          newItem[key] = value;
      
                                      });
                                      return newItem;
                                  }
                                  return sampleItem;
                              });
      
                          this.setState({
                              data: temporaryStorage,
                              dataState: { skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5 },
                              dataResult: process(temporaryStorage || [], { skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5 }),
                          });
                      }
                  }*/
            } else if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord) {
                this.setState({ selectedRecord: this.props.Login.selectedRecord });
            }

            
            /*  else {
                  if (this.props.Login.masterData.TemporaryStorage) {
                      let temporaryStorage = [];
                      temporaryStorage =
                          this.props.Login.masterData.TemporaryStorage && this.props.Login.masterData.TemporaryStorage.map(sampleItem => {
                              const entries = Object.entries(sampleItem.jsondata);
                              if (entries.length > 0) {
                                  const newItem = { ...sampleItem };
                                  entries.forEach(([key, value]) => {
  
                                      newItem[key] = value;
  
                                  });
                                  return newItem;
                              }
                              return sampleItem;
                          });
  
                      this.setState({
                          data: temporaryStorage,
                          dataState: { skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5 },
                          dataResult: process(temporaryStorage || [], { skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5 }),
                      });
                  }
              }*/
             //ALPD-4993:while merging close barces not commented now  have commented by rukshana 
        //} 
        else if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord) {
            this.setState({ selectedRecord: this.props.Login.selectedRecord });
        }

        if (bool) {
            this.setState({
                projectType
            });
        }

    }

    handleDateChange = (dateName, dateValue) => {
        const { selectedRecord } = this.state;
        if (dateValue === null) {
            dateValue = new Date();
        }
        if (dateName === 'todate') {
            selectedRecord[dateName] = dateValue;

        }
        else {
            selectedRecord[dateName] = dateValue;

        }
        selectedRecord[dateName] = dateValue;
        // this.setState({ selectedRecord });
        // this.reloadData(selectedRecord, true);

        let dateObj = {};
        let obj = convertDateValuetoString(selectedRecord['fromdate'] && selectedRecord['fromdate'] || this.props.Login.masterData.FromDate, selectedRecord['todate'] && selectedRecord['todate'] || this.props.Login.masterData.ToDate, this.props.Login.userInfo);
        let fromDate = obj.fromDate;
        let toDate = obj.toDate;

        const inputParam = {
            inputData: {
                "userinfo": this.props.Login.userInfo,
                fromDate: fromDate,
                toDate: toDate,
                nprojecttypecode: this.props.Login.masterData.selectedProjectType && this.props.Login.masterData.selectedProjectType.value || -1,
                selectedProjectType: this.props.Login.masterData.selectedProjectType
            }

        };
        this.props.getTemporaryStorage(inputParam)
    }

    reloadData = () => {
        //this.searchRef.current.value = "";
        let fromDate = this.props.Login.masterData.FromDate;
        let toDate = this.props.Login.masterData.ToDate;

        let obj = convertDateValuetoString(fromDate, toDate, this.props.Login.userInfo, true);
        const inputParam = {
            inputData: {
                "userinfo": this.props.Login.userInfo,
                fromDate: obj.fromDate,
                toDate: obj.toDate,
                "nprojecttypecode": this.props.Login.masterData.selectedProjectType.value || -1
                // currentdate: isDateChange === true ? null : formatInputDate(new Date(), true)
            },
            classUrl: 'temporarystorage',
            methodUrl: "TemporaryStorage",
            displayName: "IDS_TEMPORARYSTOARGE",
            userInfo: this.props.Login.userInfo,
            selectedRecord: this.state.selectedRecord || {}
        };
        this.props.getTemporaryStorage(inputParam);
    }


}
export default connect(mapStateToProps, {
    callService, crudMaster,
    updateStore, validateEsignCredential, getComboTemporaryStorage, getBarcodeDataTemporaryStorage, saveTemporaryStorage, getTemporaryStorage, getActiveTemporaryStorageById, validateEsignCredentialTemporaryStorage
})(injectIntl(TemporaryStorage));