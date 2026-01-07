import React from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { process } from '@progress/kendo-data-query';
import DataGrid from '../../components/data-grid/data-grid.component';
import DateTimePicker from '../../components/date-time-picker/date-time-picker.component';
import { ListWrapper } from '../../components/client-group.styles';
import AddSampleProcessing from '../storagemanagement//AddSampleProcessing';
import SlideOutModal from '../../components/slide-out-modal/SlideOutModal';
import Esign from '../audittrail/Esign';
import { SampleCycle, transactionStatus } from '../../components/Enumeration';
import { DEFAULT_RETURN } from '../../actions/LoginTypes';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';

import {
    callService, crudMaster,
    updateStore, validateEsignCredential, getComboSampleProcessing, getBarcodeDataDetails,
    getSampleProcessType, getProcessduration, saveSampleProcessing, getActiveSampleProcessingById, getSampleProcessing, validateEsignCredentialSampleProcessing
} from '../../actions';
import {sortData, getControlMap, getStartOfDay, getEndOfDay, convertDateValuetoString, rearrangeDateFormat, constructOptionList, Lims_JSON_stringify, formatInputDate, showEsign } from '../../components/CommonScript'


const mapStateToProps = state => {
    return ({ Login: state.Login })
}

class SampleProcessing extends React.Component {
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
        const temparray1 = [
            { idsName: 'IDS_BARCODEID', dataField: 'sbarcodeid', width: '250px', controlType: 'textinput' },
            { idsName: 'IDS_SAMPLETYPE', dataField: 'sproductname', width: '250px', controlType: 'selectbox' },
            { idsName: 'IDS_COLLECTIONTUBETYPENAME', dataField: 'stubename', width: '250px', controlType: 'selectbox' },
            { idsName: 'IDS_PROCESSTYPENAME', dataField: 'sprocesstypename', width: '250px', controlType: 'selectbox' },
            { idsName: 'IDS_PROCESSDURATION', dataField: 'sprocessduration', width: '250px', controlType: 'selectbox' },
            { idsName: 'IDS_GRACEDURATION', dataField: 'sgraceduration', width: '250px', controlType: 'selectbox' },
            { idsName: 'IDS_STARTDATEANDTIME', dataField: 'sprocessstartdate', width: '250px' },
            { idsName: 'IDS_ENDDATEANDTIME', dataField: 'sprocessenddate', width: '250px' },
        ];
        
        this.mandatoryColumns = [
            { "mandatory": true, "idsName": 'IDS_SAMPLETYPE', dataField: 'nproductcode', width: '250px', mandatoryLabel: 'IDS_SELECT', controlType: 'selectbox' },
            { "mandatory": true, "idsName": 'IDS_COLLECTIONTUBETYPENAME', dataField: 'ncollectiontubetypecode', width: '250px', mandatoryLabel: 'IDS_SELECT', controlType: 'selectbox' },
            { "mandatory": true, "idsName": 'IDS_PROCESSTYPENAME', dataField: 'nprocesstypecode', width: '250px', mandatoryLabel: 'IDS_SELECT', controlType: 'selectbox' },
            { "mandatory": true, "idsName": "IDS_BARCODEID", "dataField": "sbarcodeid", "width": "250px", "mandatoryLabel": "IDS_ENTER", "controlType": "textinput" }

        ]
        this.mandatoryColumns.push(
            !(this.props.Login.masterData.sprocessstartdatesecondtime && this.props.Login.masterData.sprocessstartdatesecondtime)
                ? { "mandatory": true, "idsName": "IDS_STARTDATEANDTIME", "dataField": "dprocessstartdate", "width": "250px", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" }
                : { "mandatory": true, "idsName": "IDS_ENDDATEANDTIME", "dataField": "dprocessenddate", "width": "250px", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" }
        );

        let temparray2 = [];
        //ALPD-5139--Vignesh R(24-12-2024)---added the collection tube type in datagrid
        let scollectiontubetype=this.props.Login.masterData.sfieldnameCollection&& this.props.Login.masterData.sfieldnameCollection;
        let sfieldnameSampleType=this.props.Login.masterData.sfieldnameSampleType&& this.props.Login.masterData.sfieldnameSampleType;

        barcodeFields && barcodeFields.forEach(barcodeItem => {
            data && data.forEach(dataItem => {
                const entries = Object.entries(dataItem.jsondata);
                if (entries.length > 0) {
                    entries.forEach(([key]) => {
                        const keyExists = temparray2.some(column => column.idsName === key);
                        if (!keyExists) {
                            //    if ('Visit Number' === key || 'Participant ID' === key) {
                                    //ALPD-5139--Vignesh R(24-12-2024)---added the collection tube type in datagrid

                            if (barcodeItem.sfieldname === key && barcodeItem.sfieldname!==scollectiontubetype && barcodeItem.sfieldname!==sfieldnameSampleType) {
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
        newArray.push(
            { idsName: 'IDS_COMMENTS', dataField: 'scomments', width: '250px' },
            { idsName: 'IDS_DEVIATIONCOMMENTS', dataField: 'sdeviationcomments', width: '250px' }
        );
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
            this.props.validateEsignCredentialSampleProcessing(inputParam, "openModal");
        }

        else {
            this.props.validateEsignCredential(inputParam, "openModal");
        }
    }
    render() {
        /* console.log("SampleProcessing", this.props.Login.masterData.SampleProcessing);
         console.log("extractedColumnList", this.extractedColumnList);
         console.log("SampleProcessing-Data", this.state.data);*/


        let fromDate = "";
        let toDate = "";
        const extractedColumnList = this.gridfillingColumn(this.props.Login.masterData.SampleProcessing && this.props.Login.masterData.SampleProcessing || [], this.props.Login.masterData.jsondataBarcodeFields && this.props.Login.masterData.jsondataBarcodeFields);




        this.extractedColumnList = extractedColumnList;


        const addId = this.state.controlMap.has("AddSampleProcessing") && this.state.controlMap.get("AddSampleProcessing").ncontrolcode;
        const editId = this.state.controlMap.has("EditSampleProcessing") && this.state.controlMap.get("EditSampleProcessing").ncontrolcode;
        const deleteId = this.state.controlMap.has("DeleteSampleProcessing") && this.state.controlMap.get("DeleteSampleProcessing").ncontrolcode;
        const editParam = {
            screenName: this.props.Login.displayName,
            operation: "update",
            userInfo: this.props.Login.userInfo,
            ncontrolcode: editId,
            masterData: this.props.Login.masterData,
            inputParam: this.props.Login.inputParam,
            primaryKeyField: "nsampleprocessingcode",
            selectedRecord: this.state.selectedRecord || {},
            dataState:this.state.dataState

        };
        const addParam = {
            screenName: this.props.Login.displayName, primaryKeyField: "nsampleprocessingcode", primaryKeyValue: undefined,
            operation: "create", inputParam: this.props.Login.inputParam, userInfo: this.props.Login.userInfo, ncontrolcode: addId,
            selectedRecord: this.state.selectedRecord,
            masterData: this.props.Login.masterData
        };
//		//ALPD-4618--Vignesh R(01-08-2024)
        const deleteParam = { operation: "delete", ncontrolcode:deleteId, selectedRecord: this.state.selectedRecord };

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
                                    primaryKeyField={"nsampleprocessingcode"}
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
                                    addRecord={() => this.props.getComboSampleProcessing(addParam)}
                                    deleteParam={deleteParam}
                                    deleteRecord={this.deleteRecord}
                                    fetchRecord={this.props.getActiveSampleProcessingById}
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
                        mandatoryFields={this.mandatoryColumns}
                        showSaveContinue={true}
                        addComponent={this.props.Login.loadEsign ?
                            <Esign operation={this.props.Login.operation}
                                formatMessage={this.props.intl.formatMessage}
                                onInputOnChange={this.onInputOnChange}
                                inputParam={this.props.Login.inputParam}
                                selectedRecord={this.state.selectedRecord || {}}
                            />
                            : <AddSampleProcessing
                                autoSaveGetDataProcessing={this.autoSaveGetDataProcessing}
                                selectedRecord={this.state.selectedRecord || {}}
                                onInputOnChange={this.onInputOnChange}
                                onComboChange={this.onComboChange}
                                formatMessage={this.props.intl.formatMessage}
                                operation={this.props.Login.operation}
                                sampletype={this.props.Login.sampletype}
                                collectiontubetype={this.props.Login.collectiontubetype}
                                userInfo={this.props.Login.userInfo}
                                handleDateChangeSlidout={this.handleDateChangeSlidout}
                                projectType={this.state.projectType}
                                masterData={this.props.Login.masterData}


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
                "nsampleprocessingcode": deleteParam.selectedRecord['nsampleprocessingcode'],
                "sbarcodeid": deleteParam.selectedRecord['sbarcodeid']

            },
            operation: deleteParam.operation,
            dataState: this.state.dataState
        }

        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, deleteParam.ncontrolCode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData: this.props.Login.masterData },
                    openModal: true, screenName: this.props.intl.formatMessage({ id: this.props.Login.inputParam.displayName }),
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
        let alertMessage;
        const sbarcodeid = this.props.Login.masterData.barcodedata;

        //ALPD-5139--Vignesh R(24-12-2024)---added the collection tube type in datagrid
             let checkCollectionTubeType=true;
            let checkSampleType=true;

        //ALPD-5139--Vignesh R(26-12-2024)---while updating this condition,this can't apply
            if(this.props.Login.operation!=='update'){
            let jsonPrimaryKeyValue=this.props.Login.masterData.jsonPrimaryKeyValue;

            // added jsonPrimaryKeyValue condition by sujatha on 10/06/2025 - ALPD-5983 - Transaction Screen - Sample Processing - > While try to Save the newly added Sample Without clicking Enter Key (Without getting sample Info) 
            if(jsonPrimaryKeyValue && jsonPrimaryKeyValue.nsamplecollectiontypecode){
                if(jsonPrimaryKeyValue.nsamplecollectiontypecode !== selectedRecord['nproductcode'].item.nsamplecollectiontypecode){
                    checkSampleType=false;
                }
            }
            // added jsonPrimaryKeyValue condition by sujatha on 10/06/2025 - ALPD-5983 - Transaction Screen - Sample Processing - > While try to Save the newly added Sample Without clicking Enter Key (Without getting sample Info) 
            if(jsonPrimaryKeyValue && jsonPrimaryKeyValue.ncollectiontubetypecode){
            if(jsonPrimaryKeyValue.ncollectiontubetypecode !== selectedRecord['ncollectiontubetypecode'].value){
                checkCollectionTubeType=false;
            }
        }

    }
    if(checkSampleType){
    if(checkCollectionTubeType){
        if (selectedRecord["sbarcodeid"] && selectedRecord["sbarcodeid"].length === parseInt(this.props.Login.masterData.nbarcodelength && this.props.Login.masterData.nbarcodelength)) {
            let invalidbarcode = selectedRecord["sbarcodeid"].substring(1, 2);
            if (parseInt(invalidbarcode) === SampleCycle.PROCESSING) {
                if (sbarcodeid != undefined && sbarcodeid != '') {

                    let date1;
                    let date2;
                    let diffenecemill;
                    let differenceInMinutes;

                    let flag = false;

                    if (selectedRecord["dprocessenddate"] !== undefined && selectedRecord["dprocessenddate"] !== ""&&selectedRecord["dprocessenddate"] !==null) {

                        date1 = new Date(formatInputDate(selectedRecord["dprocessstartdate"], false));
                        date2 = new Date(formatInputDate(selectedRecord["dprocessenddate"], false));

                        diffenecemill = date2 - date1;
                        differenceInMinutes = diffenecemill / (1000 * 60);

                        let nngracetimetime;
                        let nprocesstime;

                        nngracetimetime = parseInt(selectedRecord['ngracetime']) + parseInt(selectedRecord['nprocesstime']);
                        nprocesstime = parseInt(selectedRecord['nprocesstime']);
                        if (differenceInMinutes > nngracetimetime) {
                            if (selectedRecord["sdeviationcomments"] === undefined || selectedRecord["sdeviationcomments"] === "") {
                                flag = true;
                                alertMessage = "IDS_DEVIATIONCOMMENTS"
                            }
                        }
                        else if (differenceInMinutes > nprocesstime) {
                            if (selectedRecord["scomments"] === undefined || selectedRecord["scomments"] === "") {
                                flag = true;
                                alertMessage = "IDS_COMMENTS"
                            }
                        }
                    }

                    if (!flag) {
                        let inputData = {};
                        inputData["sampleprocessing"] = {};
                        if (this.props.Login.operation === "create") {
                            inputData["sampleprocessing"]["nsamplecollectiontypecode"] = selectedRecord["nsamplecollectiontypecode"] ? selectedRecord["nsamplecollectiontypecode"] : -1;
                            inputData["sampleprocessing"]["nproductcode"] = selectedRecord["nproductcode"] ? selectedRecord["nproductcode"].value : -1;
                            inputData["sampleprocessing"]["ncollectiontubetypecode"] = selectedRecord["ncollectiontubetypecode"] ? selectedRecord["ncollectiontubetypecode"].value : -1;
                            inputData["sampleprocessing"]["jsondata"] = Lims_JSON_stringify(JSON.stringify(this.props.Login.masterData.barcodedata));
                        
                        let listProcessType=[...this.state.selectedRecord["processtype"]];

                        
                        const removeIndex = listProcessType.findIndex(item => {
                            return item.value === parseInt(selectedRecord["nprocesstypecode"].value);
                        });
                        
                        if (removeIndex !== -1) {
                            listProcessType.splice(removeIndex, listProcessType.length);
                            if(listProcessType.length>0){

                                inputData={...inputData,"listOfnsampleprocesstypecode":listProcessType.map(item => item.item.nsampleprocesstypecode).join(','),"nsampleprocesstypecode":selectedRecord["nsampleprocesstypecode"],"nprocesstypelength":listProcessType.length}
                            }else{
                                inputData={...inputData,"listOfnsampleprocesstypecode":selectedRecord["nsampleprocesstypecode"],"nsampleprocesstypecode":selectedRecord["nsampleprocesstypecode"],"isSingleProcesstype":true,"nprocesstypelength":1}

                            }

                        }
                        
                        }
                        inputData["sampleprocessing"]["nprojecttypecode"] = this.props.Login.masterData.selectedProjectType.value || transactionStatus.NA;
                        if (this.props.Login.operation === "update") {
                            inputData["sampleprocessing"]["nsampleprocessingcode"] = this.props.Login.selectedId;
                        }
                        inputData["sampleprocessing"]["sbarcodeid"] = selectedRecord["sbarcodeid"] ? selectedRecord["sbarcodeid"] : -1;

                inputData["sampleprocessing"]["nsamplecollectiontypecode"] = selectedRecord["nsamplecollectiontypecode"] ? selectedRecord["nsamplecollectiontypecode"] : -1;

                        inputData["sampleprocessing"]["scomments"] = selectedRecord["scomments"] && selectedRecord["scomments"] || "";

                        inputData["sampleprocessing"]["sdeviationcomments"] = selectedRecord["sdeviationcomments"] && selectedRecord["sdeviationcomments"] || "";

                        inputData["sampleprocessing"]["dprocessstartdate"] = formatInputDate(selectedRecord["dprocessstartdate"], false);
                        inputData["sampleprocessing"]["ntzprocessstartdate"] = selectedRecord["ntzprocessstartdate"] && selectedRecord["ntzprocessstartdate"].value || transactionStatus.NA
                        inputData["sampleprocessing"]["noffsetdprocessstartdate"] = selectedRecord["noffsetdprocessenddate"] && selectedRecord["noffsetdprocessenddate"].value || transactionStatus.NA

                        inputData["sampleprocessing"]["nsampleprocesstypecode"] = selectedRecord["nsampleprocesstypecode"] ? selectedRecord["nsampleprocesstypecode"] : -1;
                        inputData["sampleprocessing"]["noffsetdprocessenddate"] = selectedRecord["noffsetdprocessenddate"] && selectedRecord["noffsetdprocessenddate"].value || transactionStatus.NA
                        inputData["sampleprocessing"]["ntzprocessenddate"] = selectedRecord["ntzprocessenddate"] && selectedRecord["ntzprocessenddate"].value || transactionStatus.NA
                        if (selectedRecord["dprocessenddate"] !== undefined && selectedRecord["dprocessenddate"] !== "" && selectedRecord["dprocessenddate"]!==null) {
                            inputData["sampleprocessing"]["dprocessenddate"] = formatInputDate(selectedRecord["dprocessenddate"], false);

                        }


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
                            classUrl: "storagesampleprocessing",
                            methodUrl: "SampleProcessing",
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
                            this.props.saveSampleProcessing(inputParam, masterData);
                        }
                    }
                    else {
                        toast.warn(this.props.intl.formatMessage({
                            id: "IDS_ENTER",
                        }) + " " +
                            this.props.intl.formatMessage({
                                id: alertMessage,
                            })
                        );
                    }
                }
                else {
                    toast.warn(
                        this.props.intl.formatMessage({
                            id: "IDS_CLICKENTERTOJSONRECORD",
                        })
                    );
                }
            }
            else {
                toast.warn(
                    this.props.intl.formatMessage({
                        id: "IDS_INVALIDBARCODEID",
                    })
                );
            }
        } else {
            toast.warn(
                this.props.intl.formatMessage({
                    id: "IDS_INVALIDABARCODE",	//ALPD-4750 Changed IDS value to throw alert correctly by VISHAKH
                })
            );
        }
    }
    else {
        toast.warn(
            this.props.intl.formatMessage({
                id: "IDS_INVALIDCOLLECTIONTUBETYPE",
            })
        );
    }
}
    else {
        toast.warn(
            this.props.intl.formatMessage({
                id: "IDS_INVALIDSAMPLETYPE",
            })
        );
    }

    }

    onComboChange = (comboData, fieldName) => {
        let selectedRecord = this.state.selectedRecord || {};

        if (fieldName === 'nprojecttypecode') {
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
            delete selectedRecord["nproductcode"];
            delete selectedRecord["ncollectiontubetypecode"];
            delete selectedRecord["nprocesstypecode"];
            const masterData = { ...this.props.Login.masterData }
            const inputParam = { masterData, inputData }
            this.props.getSampleProcessing(inputParam)
        }
        /*  if (fieldName === "nproductcode") {
              let inputData = [];
              let obj = convertDateValuetoString(this.props.Login.masterData.FromDate, this.props.Login.masterData.ToDate, this.props.Login.userInfo);
              let fromDate = obj.fromDate;
              let toDate = obj.toDate;
              inputData["fromDate"] = fromDate;
              inputData["toDate"] = toDate;
              inputData = {
                  userinfo: this.props.Login.userInfo,
                  nprojecttypecode: this.props.Login.masterData.selectedProjectType.value,
                  toDate: toDate,
                  fromDate: fromDate
              }
              const masterData = { ...this.props.Login.masterData }
              selectedRecord={...selectedRecord,"nproductcode":comboData}
              const inputParam = { masterData, inputData,selectedRecord }
              this.props.getCollectionTubeType(inputParam)
          } else {*/
        if (fieldName === "ncollectiontubetypecode" && selectedRecord['nproductcode'] !== undefined) {
            let inputData = [];
            let obj = convertDateValuetoString(this.props.Login.masterData.FromDate, this.props.Login.masterData.ToDate, this.props.Login.userInfo);
            let fromDate = obj.fromDate;
            let toDate = obj.toDate;
            inputData["fromDate"] = fromDate;
            inputData["toDate"] = toDate;
            inputData = {
                userinfo: this.props.Login.userInfo,
                nprojecttypecode: this.props.Login.masterData.selectedProjectType.value,
                nproductcode: selectedRecord['nproductcode'] && selectedRecord['nproductcode'].value || -1,
                nsamplecollectiontypecode: selectedRecord['nsamplecollectiontypecode'] && selectedRecord['nsamplecollectiontypecode'] || -1,
                ncollectiontubetypecode: parseInt(comboData.value),
                toDate: toDate,
                fromDate: fromDate
            }

            delete selectedRecord["ncollectiontubetypecode"];
            delete selectedRecord["nprocesstypecode"];
            const masterData = { ...this.props.Login.masterData }
            selectedRecord = { ...selectedRecord, [fieldName]: comboData }
            const inputParam = { masterData, inputData, selectedRecord }


            this.props.getSampleProcessType(inputParam)
        }
        else if (fieldName === "nproductcode" && selectedRecord['ncollectiontubetypecode'] !== undefined) {
            let inputData = [];
            let obj = convertDateValuetoString(this.props.Login.masterData.FromDate, this.props.Login.masterData.ToDate, this.props.Login.userInfo);
            let fromDate = obj.fromDate;
            let toDate = obj.toDate;
            inputData["fromDate"] = fromDate;
            inputData["toDate"] = toDate;
            inputData = {
                userinfo: this.props.Login.userInfo,
                nprojecttypecode: this.props.Login.masterData.selectedProjectType.value,
                nproductcode: parseInt(comboData.value),
                nsamplecollectiontypecode: parseInt(comboData.item.nsamplecollectiontypecode),
                ncollectiontubetypecode: selectedRecord['ncollectiontubetypecode'] && selectedRecord['ncollectiontubetypecode'].value || -1,
                toDate: toDate,
                fromDate: fromDate
            }
            delete selectedRecord["ncollectiontubetypecode"];
            delete selectedRecord["nprocesstypecode"];
            const masterData = { ...this.props.Login.masterData }
            selectedRecord = {
                ...selectedRecord, [fieldName]: comboData, "nsamplecollectiontypecode": parseInt(comboData.item.nsamplecollectiontypecode)
            }
            const inputParam = { masterData, inputData, selectedRecord }
            this.props.getSampleProcessType(inputParam)
        }
        else if (fieldName === "nprocesstypecode") {
            let inputData = [];
            let obj = convertDateValuetoString(this.props.Login.masterData.FromDate, this.props.Login.masterData.ToDate, this.props.Login.userInfo);
            let fromDate = obj.fromDate;
            let toDate = obj.toDate;
            inputData["fromDate"] = fromDate;
            inputData["toDate"] = toDate;

            inputData = {
                userinfo: this.props.Login.userInfo,
                nprojecttypecode: this.props.Login.masterData.selectedProjectType.value,
                nproductcode: selectedRecord['nproductcode'] && selectedRecord['nproductcode'].value || -1,
                ncollectiontubetypecode: selectedRecord['ncollectiontubetypecode'] && selectedRecord['ncollectiontubetypecode'].value,
                nsamplecollectiontypecode: selectedRecord['nsamplecollectiontypecode'] && selectedRecord['nsamplecollectiontypecode'] || -1,
                nprocesstypecode: parseInt(comboData.value),
                toDate: toDate,
                fromDate: fromDate
            }

            const masterData = { ...this.props.Login.masterData }
            selectedRecord = { ...selectedRecord, "nprocesstypecode": comboData }
            const inputParam = { masterData, inputData, selectedRecord }
            this.props.getProcessduration(inputParam)
        }
        else {
            selectedRecord[fieldName] = comboData;
            if (fieldName === "nproductcode") {
                selectedRecord = { ...selectedRecord, "nsamplecollectiontypecode": comboData.item.nsamplecollectiontypecode }
            }
            this.setState({ selectedRecord });
        }

        //  }

    }
    handleDateChangeSlidout = (dateName, dateValue) => {
        let selectedRecord = this.state.selectedRecord || {};
        selectedRecord[dateName] = dateValue;
        this.setState({ selectedRecord });
        /* if (selectedRecord["sbarcodeid"] !== undefined) {
              let inputData = {};
              inputData["sampleprocessing"] = {};
            if (dateName === "dprocessenddate") {
                  inputData["sampleprocessing"]["dprocessenddate"] = formatInputDate(dateValue, false);
                  inputData["sampleprocessing"]["nsampleprocesstypecode"] = selectedRecord["nsampleprocesstypecode"] ? selectedRecord["nsampleprocesstypecode"] : -1;
                  inputData["sampleprocessing"]["sbarcodeid"] = selectedRecord["sbarcodeid"] ? selectedRecord["sbarcodeid"] : -1;
                  inputData["userinfo"] = {
                      ...this.props.Login.userInfo,
                      sformname: Lims_JSON_stringify(this.props.Login.userInfo.sformname),
                      smodulename: Lims_JSON_stringify(this.props.Login.userInfo.smodulename)
                  }
                  selectedRecord = { ...selectedRecord, [dateName]: dateValue }
  
                  const inputParam = {
                      nformcode: this.props.Login.userInfo.nformcode,
                      inputData: inputData,
                      operation: this.props.Login.operation,
                      selectedRecord: selectedRecord,
                      masterData: this.props.Login.masterData
  
                  }
                  this.props.getCommentsDeviation(inputParam)
              }
              else {
  
                
              }
          } else {
  
              toast.warn(this.props.intl.formatMessage({
                  id: "IDS_ENTER",
              }) +
                  this.props.intl.formatMessage({
                      id: "IDS_BARCODEID",
                  })
              );
  
          }
  */
    };
    autoSaveGetDataProcessing = (event) => {
        let selectedRecord = this.state.selectedRecord || {}

        event.stopPropagation();
        //ALPD-4701--Vignesh R(21-08-2024)
        if(event.keyCode === 13){
        if (selectedRecord['ncollectiontubetypecode'] && selectedRecord['nproductcode'] && selectedRecord['nprocesstypecode']) {
            if (parseInt(selectedRecord["sbarcodeid"] && selectedRecord["sbarcodeid"].length) === parseInt(this.props.Login.masterData.nbarcodelength && this.props.Login.masterData.nbarcodelength) && event.keyCode === 13) {

                let invalidbarcode = event.target.value.substring(1, 2);
                if (parseInt(invalidbarcode) === SampleCycle.PROCESSING) {
                    let checkCollectionTubeType=false;
                    let checkSampleType=false;

                   

                //if(checkCollectionTubeType){
                    let inputParam = {
                        nprojecttypecode: this.props.Login.masterData.selectedProjectType.value,
                        spositionvalue: event.target.value,
                        userinfo: this.props.Login.userInfo,
                        nbarcodeLength:  parseInt(this.props.Login.masterData.nbarcodelength && this.props.Login.masterData.nbarcodelength),
                        jsondata: {},
                        masterData: this.props.Login.masterData,
                        selectedRecord: selectedRecord || {}
                    }
                    this.props.getBarcodeDataDetails(inputParam);
                //}
                // else {
                //     toast.warn(
                //         this.props.intl.formatMessage({
                //             id: "IDS_INVALIDCOLLECTIONTUBETYPE",
                //         })
                //     );
                // }
                }
                else {
                    toast.warn(
                        this.props.intl.formatMessage({
                            id: "IDS_INVALIDBARCODEID",
                        })
                    );
                }
            } 
        }
        else {
            event.stopPropagation();    
            if (selectedRecord['nproductcode'] === undefined) {
                toast.warn(this.props.intl.formatMessage({
                    id: "IDS_SELECT",
                }) +
                    this.props.intl.formatMessage({
                        id: "IDS_SAMPLETYPE",
                    })
                );
            } else if (selectedRecord['ncollectiontubetypecode'] === undefined) {
                toast.warn(this.props.intl.formatMessage({
                    id: "IDS_SELECT",
                }) +
                    this.props.intl.formatMessage({
                        id: "IDS_COLLECTIONTUBETYPENAME",
                    })
                );
            }
            else {
                toast.warn(this.props.intl.formatMessage({
                    id: "IDS_SELECT",
                }) +
                    this.props.intl.formatMessage({
                        id: "IDS_PROCESSTYPENAME",
                    })
                );
            }
        }
    }

    };
    onInputOnChange = (event, fieldname) => {
        const selectedRecord = this.state.selectedRecord || {};

        if (event.target.type === 'checkbox') {
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

        // if (this.props.Login.masterData.SampleProcessing !== previousProps.Login.masterData.SampleProcessing) {
        //     let samplecollect = [];
        //     samplecollect = this.props.Login.masterData.SampleProcessing && this.props.Login.masterData.SampleProcessing.map(sampleItem => {
        //         const entries = Object.entries(sampleItem.jsondata);
        //         if (entries.length > 0) {
        //             const newItem = { ...sampleItem };
        //             entries.forEach(([key, value]) => {

        //                 newItem[key] = value;

        //             });
        //             return newItem;
        //         }
        //         return sampleItem;
        //     });
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
        //         data: samplecollect,
        //         dataState,
        //         dataResult: process(samplecollect || [], dataState),
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
                let sampleProcessing = [];
                sampleProcessing =
                    this.props.Login.masterData.SampleProcessing && this.props.Login.masterData.SampleProcessing.map(sampleItem => {
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
                // if (dataState === undefined) {
                //     dataState = { skip: 0, take: this.state.dataState.take }
                // }
                // if (this.state.dataResult.data) {
                //     if (this.state.dataResult.data.length === 1  && this.props.Login.operation ==='delete' ) {
                //     
                //         let skipcount=this.state.dataState.skip>0?(this.props.Login.masterData.SampleProcessing.length-this.state.dataState.take):
                //        this.state.dataState.skip
                //         dataState = { skip: skipcount, take: this.state.dataState.take }
                //     }
                // }

                this.setState({
                    userRoleControlRights, controlMap, data: sampleProcessing,
                    dataResult: process(sampleProcessing || [], this.state.dataState),
                });
            }else { 
                //jana ALPD-4694 Temporary Storage-->While Try to Delete the Records the Fields are Align Wrongly

            let {dataState}=this.state;
            let sampleProcessingdata = [];
            sampleProcessingdata =
                this.props.Login.masterData.SampleProcessing && this.props.Login.masterData.SampleProcessing.map(sampleItem => {
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

            if(this.props.Login.dataState===undefined  || this.props.Login.masterData.selectedProjectType !== previousProps.Login.masterData.selectedProjectType){
                dataState={skip:0,take:this.state.dataState.take}
            }
             if(this.state.dataResult.data){
                 if(this.state.dataResult.data.length ===1  && this.props.Login.operation ==='delete'){
                   
                        let skipcount=this.state.dataState.skip>0?(this.props.Login.masterData.SampleProcessing.length-this.state.dataState.take):
                       this.state.dataState.skip
                     dataState={skip:skipcount,take:this.state.dataState.take}
                 }
             } 
             this.setState({
                data: sampleProcessingdata, selectedRecord: this.props.Login.selectedRecord,
                dataResult: process(sampleProcessingdata || [],dataState),
                dataState
            });
            }

            
            if (this.props.Login.masterData.jsondataBarcodeFields !== previousProps.Login.masterData.jsondataBarcodeFields) {
                const retrievedData = sortData(this.props.Login.masterData.jsondataBarcodeFields,"ascending","nsorter");
                this.setState({ jsondataBarcodeFields: retrievedData });
            }
            /* else {
                 if (this.props.Login.masterData.SampleProcessing) {
                     let {dataState}=this.state;
                     if(dataState===undefined){
                         dataState={skip:0,take:this.state.dataState.take}
                     }
                      if(this.state.dataResult.data){
                          if(this.state.dataResult.data.length ===1){
                             let skipcount=this.state.dataState.skip>0?(this.state.dataState.skip-this.state.dataState.take):
                             this.state.dataState.skip
                              dataState={skip:skipcount,take:this.state.dataState.take}
                          }
                      } 
                     
                     let samplecollect = [];
                     samplecollect = this.props.Login.masterData.SampleProcessing && this.props.Login.masterData.SampleProcessing.map(sampleItem => {
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
                         data: samplecollect,
                         dataState,
                         dataResult: process(samplecollect || [], dataState),
                     });
                 }
             }*/
        }else if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord) {
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
                nprojecttypecode: this.props.Login.masterData.selectedProjectType && this.props.Login.masterData.selectedProjectType.value || -1
            }

        };
        this.props.getSampleProcessing(inputParam);
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
            classUrl: 'storagesampleprocessing',
            methodUrl: "SampleProcessing",
            displayName: this.props.Login.inputParam.displayName,
            userInfo: this.props.Login.userInfo,
            selectedRecord: this.state.selectedRecord || {}
        };
        this.props.getSampleProcessing(inputParam);
    }


}
export default connect(mapStateToProps, {
    callService, crudMaster,
    updateStore, validateEsignCredential, getComboSampleProcessing, getBarcodeDataDetails, getSampleProcessType, getProcessduration, saveSampleProcessing,
    getActiveSampleProcessingById, getSampleProcessing, validateEsignCredentialSampleProcessing
})(injectIntl(SampleProcessing));