import React from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { process } from '@progress/kendo-data-query';
import DataGrid from '../../components/data-grid/data-grid.component';
import DateTimePicker from '../../components/date-time-picker/date-time-picker.component';
import { ListWrapper } from '../../components/client-group.styles';
import AddSampleCollection from '../storagemanagement//AddSampleCollection';
import SlideOutModal from '../../components/slide-out-modal/SlideOutModal';
import Esign from '../audittrail/Esign';
import { SampleCycle,transactionStatus } from '../../components/Enumeration';
import { DEFAULT_RETURN } from '../../actions/LoginTypes';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';

import {
    callService, crudMaster,
    updateStore, validateEsignCredential, getComboSampleCollection, getBarcodeDataCollection, saveCollection, getActiveSampleCollectionById, getSampleCollection, validateEsignCredentialSampleCollection
} from '../../actions';
import { sortData,getControlMap, getStartOfDay, getEndOfDay, convertDateValuetoString, rearrangeDateFormat, constructOptionList, Lims_JSON_stringify, formatInputDate, showEsign } from '../../components/CommonScript'


const mapStateToProps = state => {
    return ({ Login: state.Login })
}

class SampleCollection extends React.Component {
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

    gridfillingColumn(data, barcodeFields) {
        //  const tempArray = [];
        const temparray1 = [{ idsName: 'IDS_BARCODEID', dataField: 'sbarcodeid', width: '250px', mandatoryLabel: 'IDS_ENTER', controlType: 'textinput' },
        { idsName: 'IDS_SAMPLEQTY', dataField: 'nsampleqty', width: '200px', mandatoryLabel: 'IDS_ENTER', controlType: 'textinput' },
        { idsName: 'IDS_UNIT', dataField: 'sunitname', width: '200px', mandatoryLabel: 'IDS_SELECT', controlType: 'selectbox' },
        { idsName: 'IDS_SAMPLECOLLECTIONDATE', dataField: 'scollectiondatetime', width: '200px' } //Modified by sonia on 18th July 2025 for jira id:ALPDJ21-18
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
        newArray.push({ idsName: 'IDS_COMMENTS', dataField: 'scomments', width: '250px' })
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
            this.props.validateEsignCredentialSampleCollection(inputParam, "openModal");
        } else {
            this.props.validateEsignCredential(inputParam, "openModal");
        }
    }

    render() {

        let fromDate = "";
        let toDate = "";
        const extractedColumnList = this.gridfillingColumn(this.props.Login.masterData.SampleCollection && this.props.Login.masterData.SampleCollection 
            || [], this.props.Login.masterData.jsondataBarcodeFields && this.props.Login.masterData.jsondataBarcodeFields);
        this.extractedColumnList = extractedColumnList;


        const addId = this.state.controlMap.has("AddStorageSampleCollection") && this.state.controlMap.get("AddStorageSampleCollection").ncontrolcode;
        const editId = this.state.controlMap.has("EditStorageSampleCollection") && this.state.controlMap.get("EditStorageSampleCollection").ncontrolcode;
        const deleteId = this.state.controlMap.has("DeleteStorageSampleCollection") && this.state.controlMap.get("DeleteStorageSampleCollection").ncontrolcode;

        const editParam = {
            screenName: this.props.Login.displayName,
            operation: "update",
            userInfo: this.props.Login.userInfo,
            ncontrolcode: editId,
            masterData: this.props.Login.masterData,
            inputParam: this.props.Login.inputParam,
            primaryKeyField: "nsamplecollectioncode",
            selectedRecord: this.state.selectedRecord || {},
            dataState:this.state.dataState


        };
        const addParam = {
            screenName: this.props.Login.displayName, primaryKeyField: "nsamplecollectioncode", primaryKeyValue: undefined,
            operation: "create", inputParam: this.props.Login.inputParam, userInfo: this.props.Login.userInfo, ncontrolcode: addId,
            selectedRecord: this.state.selectedRecord,
            masterData: this.props.Login.masterData
        };
//ALPD-4618--Vignesh R(01-08-2024)
        const deleteParam = { operation: "delete",ncontrolcode:deleteId,  selectedRecord: this.state.selectedRecord };

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
                                    primaryKeyField={"nsamplecollectioncode"}
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
                                    addRecord={() => this.props.getComboSampleCollection(addParam)}
                                    deleteParam={deleteParam}
                                    deleteRecord={this.deleteRecord}
                                    fetchRecord={this.props.getActiveSampleCollectionById}
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
                            { "mandatory": true, "idsName": "IDS_SAMPLEQTY", "dataField": "nsampleqty", "width": "250px", "mandatoryLabel": "IDS_ENTER", "controlType": "textinput" },
                            { "mandatory": true, "idsName": "IDS_UNIT", "dataField": "nunitcode", "width": "250px", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
							// Added by sujatha on 10/06/2025 - ALPD-5981 - Transaction Screen - Sample Collection, Processing -> While add & edit the Samples with removing the date field - Application Crashed.
                            { "mandatory": true, "idsName": "IDS_SAMPLECOLLECTIONDATE", "dataField": "dcollectiondatetime", "width": "250px", "fieldType": 'dateOnlyFormat', "controlType": "textinput" }]} //Modified by sonia on 18th July 2025 for jira id:ALPDJ21-18

                        addComponent={this.props.Login.loadEsign ?
                            <Esign
                                operation={this.props.Login.operation}
                                formatMessage={this.props.intl.formatMessage}
                                onInputOnChange={this.onInputOnChange}
                                inputParam={this.props.Login.inputParam}
                                selectedRecord={this.state.selectedRecord || {}}
                            />
                            : <AddSampleCollection
                                autoSaveGetDataCollection={this.autoSaveGetDataCollection}
                                barcodedata={this.props.Login.masterData.barcodedata}
                                barcodeFields={this.props.Login.masterData.jsondataBarcodeFields}
                                selectedRecord={this.state.selectedRecord || {}}
                                onInputOnChange={this.onInputOnChange}
                                onComboChange={this.onComboChange}
                                formatMessage={this.props.intl.formatMessage}
                                operation={this.props.Login.operation}
                                unit={this.props.Login.unit}
                                timeZone={this.props.Login.timeZone || []} //Added by sonia on 18th July 2025 for jira id:ALPDJ21-18
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
                "nsamplecollectioncode": deleteParam.selectedRecord['nsamplecollectioncode']

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
        const sbarcodeid = this.props.Login.masterData.barcodedata;
        if (selectedRecord["sbarcodeid"] && selectedRecord["sbarcodeid"].length === parseInt(this.props.Login.masterData.nbarcodelength && this.props.Login.masterData.nbarcodelength)) {

            let invalidbarcode = selectedRecord["sbarcodeid"].substring(1, 2);
            if (parseInt(invalidbarcode) === SampleCycle.COLLECTION) {

                if (sbarcodeid != undefined && sbarcodeid != '') {

                    let inputData = {};
                    inputData["storagesamplecollection"] = {};
                    if (this.props.Login.operation === "create") {

                        inputData["storagesamplecollection"]["nunitcode"] = selectedRecord["nunitcode"] ? selectedRecord["nunitcode"].value : -1;
                        inputData["storagesamplecollection"]["nsampleqty"] = selectedRecord["nsampleqty"] ? Number(selectedRecord["nsampleqty"]) : -1;
                        inputData["storagesamplecollection"]["jsondata"] = Lims_JSON_stringify(JSON.stringify(this.props.Login.masterData.barcodedata));
                    }
                    inputData["storagesamplecollection"]["nprojecttypecode"] = this.props.Login.masterData.selectedProjectType.value || transactionStatus.NA;
                    if (this.props.Login.operation === "update") {
                        inputData["storagesamplecollection"]["nsamplecollectioncode"] = this.props.Login.selectedId;
                    }
                    inputData["storagesamplecollection"]["sbarcodeid"] = selectedRecord["sbarcodeid"] ? selectedRecord["sbarcodeid"] : -1;

                    inputData["storagesamplecollection"]["dcollectiondatetime"] = formatInputDate(selectedRecord["dcollectiondatetime"], false); //Modified by sonia on 18th July 2025 for jira id:ALPDJ21-18
                    inputData["storagesamplecollection"]["scomments"] = selectedRecord["scomments"] && selectedRecord["scomments"] || "";
                    inputData["storagesamplecollection"]["ntzcollectiondatetime"] = selectedRecord["ntzcollectiondatetime"] && selectedRecord["ntzcollectiondatetime"].value || transactionStatus.NA
                    inputData["storagesamplecollection"]["noffsetdcollectiondatetime"] = selectedRecord["noffsetdcollectiondatetime"] && selectedRecord["noffsetdcollectiondatetime"].value || transactionStatus.NA
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
                        classUrl: "storagesamplecollection",
                        methodUrl: "SampleCollection",
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
                        this.props.saveCollection(inputParam, masterData);
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
                        id: "IDS_INVALIDBARCODEID", //ALPD-4498 Changed IDS to throw alert correctly by VISHAKH
                    })
                );
            }
        } else {
            toast.warn(
                this.props.intl.formatMessage({
                    id: "IDS_INVALIDABARCODE",  //ALPD-4498 Changed IDS to throw alert correctly by VISHAKH
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
            this.props.getSampleCollection(inputParam)
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
    autoSaveGetDataCollection = (event) => {
        let selectedRecord = this.state.selectedRecord || {}
      /*  let nsamplecyclestartpostion=this.props.Login.masterData&&this.props.Login.masterData.samplecyclestartpostion || -1;
        let samplecyclenfieldlength=this.props.Login.masterData&&this.props.Login.masterData.samplecyclenfieldlength || -1;*/

        event.stopPropagation();
        let invalidbarcode = event.target.value.substring(1, 2);
      
        if (parseInt(selectedRecord["sbarcodeid"] && selectedRecord["sbarcodeid"].length) === parseInt(this.props.Login.masterData.nbarcodelength && this.props.Login.masterData.nbarcodelength)
            && event.keyCode === 13) {

            if (parseInt(invalidbarcode) === SampleCycle.COLLECTION) {

                let inputParam = {
                    nprojecttypecode: this.props.Login.masterData.selectedProjectType.value,
                    spositionvalue: event.target.value,
                    userinfo: this.props.Login.userInfo,
                    nbarcodeLength: parseInt(this.props.Login.masterData.nbarcodelength && this.props.Login.masterData.nbarcodelength),
                    jsondata: {},
                    masterData: this.props.Login.masterData,
                    selectedRecord: selectedRecord || {}
                }
                this.props.getBarcodeDataCollection(inputParam);
            }
            else {
                toast.warn(
                    this.props.intl.formatMessage({
                        id: "IDS_INVALIDBARCODEID",
                    })
                );
            }
        }
        // else {
        //     toast.warn(
        //         this.props.intl.formatMessage({
        //             id: "IDS_INVALIDBARCODELENGTH",
        //         })
        //     );
        // }
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

        // if (this.props.Login.masterData.SampleCollection !== previousProps.Login.masterData.SampleCollection) {
        //     let samplecollect = [];
        //     samplecollect =
        //         this.props.Login.masterData.SampleCollection && this.props.Login.masterData.SampleCollection.map(sampleItem => {
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

        //     // let { dataState } = this.state;
        //     // if (dataState === undefined) {
        //     //     dataState = { skip: 0, take: this.state.dataState.take }
        //     // }
        //     // if (this.state.dataResult.data) {
        //     //     if (this.state.dataResult.data.length === 1) {
        //     //         let skipcount = this.state.dataState.skip > 0 ? (this.state.dataState.skip - this.state.dataState.take) :
        //     //             this.state.dataState.skip
        //     //         dataState = { skip: skipcount, take: this.state.dataState.take }
        //     //     }
        //     // }

        //     this.setState({
        //         data: samplecollect,
        //         dataResult: process(samplecollect || []),
        //     });
        // }

        if (this.props.Login.masterData !== previousProps.Login.masterData) {
            let temporaryStorage = [];
            if (this.props.Login.userInfo.nformcode !== previousProps.Login.userInfo.nformcode) {
                const userRoleControlRights = [];
                if (this.props.Login.userRoleControlRights) {
                    this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode] && Object.values(this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode]).map(item =>
                        userRoleControlRights.push(item.ncontrolcode))
                }
                const controlMap = getControlMap(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode)

                temporaryStorage =
                    this.props.Login.masterData.SampleCollection && this.props.Login.masterData.SampleCollection.map(sampleItem => {
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
                //     if (this.state.dataResult.data.length === 1) {
                //         let skipcount = this.state.dataState.skip > 0 ? (this.state.dataState.skip - this.state.dataState.take) :
                //             this.state.dataState.skip
                //         dataState = { skip: skipcount, take: this.state.dataState.take }
                //     }
                // }

                this.setState({
                    userRoleControlRights, controlMap, data: temporaryStorage,
                    dataResult: process(temporaryStorage || [],this.state.dataState),
                });
            }else {
                //jana ALPD-4694 Temporary Storage-->While Try to Delete the Records the Fields are Align Wrongly
                let samplecollect = [];
                samplecollect =
                    this.props.Login.masterData.SampleCollection && this.props.Login.masterData.SampleCollection.map(sampleItem => {
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
                    if(this.props.Login.dataState===undefined  || this.props.Login.masterData.selectedProjectType !== previousProps.Login.masterData.selectedProjectType){
                        dataState={skip:0,take:this.state.dataState.take}
                    }
                     if(this.state.dataResult.data){
                         if(this.state.dataResult.data.length ===1){
                            let skipcount=this.state.dataState.skip>0?(this.state.dataState.skip-this.state.dataState.take):
                            this.state.dataState.skip
                             dataState={skip:skipcount,take:this.state.dataState.take}
                         }
                     
                }
            
                 this.setState({
                    data: samplecollect, selectedRecord: this.props.Login.selectedRecord,
                    dataResult: process(samplecollect || [],dataState),
                    dataState
                });
            }
            /*  else {
                  if (this.props.Login.masterData.SampleCollection) {
                      let samplecollect = [];
                      samplecollect =
                          this.props.Login.masterData.SampleCollection && this.props.Login.masterData.SampleCollection.map(sampleItem => {
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
                          dataState: { skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5 },
                          dataResult: process(samplecollect || [], { skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5 }),
                      });
                  }
              }*/
        }else if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord) {
            this.setState({ selectedRecord: this.props.Login.selectedRecord });
        }

        if (this.props.Login.masterData.jsondataBarcodeFields !== previousProps.Login.masterData.jsondataBarcodeFields) {
            const retrievedData = sortData(this.props.Login.masterData.jsondataBarcodeFields,"ascending","nsorter");
            this.setState({ jsondataBarcodeFields: retrievedData });
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
                selectedProjectType: this.props.Login.masterData.selectedProjectType,
                nprojecttypecode: this.props.Login.masterData.selectedProjectType && this.props.Login.masterData.selectedProjectType.value || -1
            }
        };
        this.props.getSampleCollection(inputParam);
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
            classUrl: 'storagesamplecollection',
            methodUrl: "SampleCollection",
            displayName: "IDS_SAMPLECOLLECTION",
            userInfo: this.props.Login.userInfo,
            selectedRecord: this.state.selectedRecord || {}
        };
        this.props.getSampleCollection(inputParam);
    }


}
export default connect(mapStateToProps, {
    callService, crudMaster,
    updateStore, validateEsignCredential, getComboSampleCollection, getBarcodeDataCollection, saveCollection, getActiveSampleCollectionById, getSampleCollection, validateEsignCredentialSampleCollection
})(injectIntl(SampleCollection));