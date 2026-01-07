import React from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { process } from '@progress/kendo-data-query';
import DataGrid from '../../components/data-grid/data-grid.component';
import DateTimePicker from '../../components/date-time-picker/date-time-picker.component';
import { ListWrapper } from '../../components/client-group.styles';
import AddSampleReceiving from '../storagemanagement//AddSampleReceiving';
import SlideOutModal from '../../components/slide-out-modal/SlideOutModal';
import Esign from '../audittrail/Esign';
import { transactionStatus } from '../../components/Enumeration';
import { DEFAULT_RETURN } from '../../actions/LoginTypes';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';



import {
    callService, crudMaster,
    updateStore, validateEsignCredential, getComboSampleReceiving, getBarcodeDataRecord,
    saveReceiving, getActiveSampleReceivingById, getSampleReceiving,generateControlBasedReport
} from '../../actions';
import {sortData,
    getControlMap, getStartOfDay, getEndOfDay, convertDateValuetoString, rearrangeDateFormat,
    constructOptionList, Lims_JSON_stringify, formatInputDate, showEsign
} from '../../components/CommonScript'


const mapStateToProps = state => {
    return ({ Login: state.Login })
}

class SampleReceivingStorage extends React.Component {
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
        let extractedColumnList1 = [];
        extractedColumnList1 = [
            { idsName: 'IDS_BARCODEID', dataField: 'sbarcodeid', width: '250px', mandatoryLabel: 'IDS_ENTER', controlType: 'textinput' },
            { idsName: "IDS_SAMPLETYPE", "dataField": "sproductname", mandatoryLabel: "IDS_ENTER", controlType: "selectbox" },
            { idsName: "IDS_COLLECTIONTUBETYPEPROCESSTYPE", "dataField": "stubename", mandatoryLabel: "IDS_ENTER", controlType: "selectbox" },
            { idsName: "IDS_VISITNUMBER", "dataField": "svisitnumber", mandatoryLabel: "IDS_ENTER", controlType: "selectbox" },
            //{ idsName: 'IDS_SAMPLEQTY', dataField: 'nsampleqty', width: '250px', mandatoryLabel: 'IDS_ENTER', controlType: 'textinput' },
            //{ idsName: 'IDS_UNIT', dataField: 'sunitname', width: '250px', mandatoryLabel: 'IDS_SELECT', controlType: 'selectbox' },
            { idsName: 'IDS_SAMPLERECEIVINGDATE', dataField: 'scollectiondate', width: '250px'},
            { idsName: 'IDS_COMMENTS', dataField: 'scomments', width: '250px' }
        ];


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





    // closeModal = () => {
    //     let loadEsign = this.props.Login.loadEsign;
    //     let openModal = this.props.Login.openModal;
    //     let selectedRecord = this.props.Login.selectedRecord;
    //     let jsondataBarcodeFields = this.props.Login.masterData.jsondataBarcodeFields;
    //     let barcodeFields = this.props.Login.masterData.barcodeFields;
    //     let barcodedata = this.props.Login.masterData.barcodedata;



    //     if (this.props.Login.loadEsign) {
    //         if (this.props.Login.operation === "delete") {
    //             loadEsign = false;
    //             openModal = false;
    //             selectedRecord = {};
    //         }
    //         else {
    //             loadEsign = false;
    //             selectedRecord['esignpassword'] = ""
    //             selectedRecord['esigncomments'] = ""
    //         }
    //     }
    //     else {
    //         openModal = false;
    //         selectedRecord = {};
    //         jsondataBarcodeFields = {};
    //         barcodeFields = {};
    //         barcodedata = {};
    //     }

    //     const updateInfo = {
    //         typeName: DEFAULT_RETURN,
    //         data: { openModal, loadEsign, selectedRecord }
    //     }

    //     this.setState({ jsondataBarcodeFields: jsondataBarcodeFields, barcodeFields: jsondataBarcodeFields, barcodedata: jsondataBarcodeFields });

    //     this.props.updateStore(updateInfo);
    // }
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
        
        const temparray1 = [
            { idsName: 'IDS_BARCODEID', dataField: 'sbarcodeid', width: '250px', mandatoryLabel: 'IDS_ENTER', controlType: 'textinput' },
            //{ idsName: 'IDS_SAMPLEQTY', dataField: 'nsampleqty', width: '250px', mandatoryLabel: 'IDS_ENTER', controlType: 'textinput' },
            //{ idsName: 'IDS_UNIT', dataField: 'sunitname', width: '250px', mandatoryLabel: 'IDS_SELECT', controlType: 'selectbox' },
            { idsName: 'IDS_SAMPLERECEIVINGDATE', dataField: 'scollectiondate', width: '250px'},
            { idsName: 'IDS_COMMENTS', dataField: 'scomments', width: '250px' }

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
            this.props.validateEsignCredential(inputParam, "openModal");
        }

        else {
            this.props.validateEsignCredential(inputParam, "openModal");
        }
    }
    render() {


        let fromDate = "";
        let toDate = "";
        const extractedColumnList = this.gridfillingColumn(this.props.Login.masterData.SampleReceiving
            && this.props.Login.masterData.SampleReceiving || [], this.props.Login.masterData.jsondataBarcodeFields
        && this.props.Login.masterData.jsondataBarcodeFields);

        this.extractedColumnList = extractedColumnList;

        const addId = this.state.controlMap.has("AddSampleReceiving") && this.state.controlMap.get("AddSampleReceiving").ncontrolcode;
        const editId = this.state.controlMap.has("EditSampleReceiving") && this.state.controlMap.get("EditSampleReceiving").ncontrolcode;
        const deleteId = this.state.controlMap.has("DeleteSampleReceiving") && this.state.controlMap.get("DeleteSampleReceiving").ncontrolcode;
        const SampleReceivingReportId = this.state.controlMap.has("SampleReceivingReport") && this.state.controlMap.get("SampleReceivingReport").ncontrolcode;


        const editParam = {
            screenName: this.props.Login.displayName,
            operation: "update",
            userInfo: this.props.Login.userInfo,
            ncontrolcode: editId,
            masterData: this.props.Login.masterData,
            inputParam: this.props.Login.inputParam,
            primaryKeyField: "nstoragesamplereceivingcode",
            selectedRecord: this.state.selectedRecord || {},
            dataState:this.state.dataState

        };
        const addParam = {
            screenName: this.props.Login.displayName, primaryKeyField: "nstoragesamplereceivingcode", primaryKeyValue: undefined,
            operation: "create", inputParam: this.props.Login.inputParam, userInfo: this.props.Login.userInfo, ncontrolcode: addId,
            selectedRecord: this.state.selectedRecord,
            masterData: this.props.Login.masterData
        };
        const deleteParam = { deleteId: deleteId, operation: "delete", selectedRecord: this.state.selectedRecord };

        const samplereceivingreportParam = { SampleReceivingReportId: SampleReceivingReportId,masterData: this.props.Login.masterData,  selectedRecord: this.state.selectedRecord };

        if (this.props.Login.masterData && this.props.Login.masterData.FromDate) {
            fromDate = (this.state.selectedRecord["fromdate"] && getStartOfDay(this.state.selectedRecord["fromdate"])) || rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.FromDate);
            toDate = (this.state.selectedRecord["todate"] && getEndOfDay(this.state.selectedRecord["todate"])) || rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.ToDate);
        }
        return (
            <>
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
                                        value={this.props.Login.masterData.selectedProjectType}
                                        defaultValue={this.state.selectedRecord["nprojecttypecode"]}
                                        onChange={(event) => this.onComboChange(event, "nprojecttypecode")}
                                        closeMenuOnSelect={true}
                                    >
                                    </FormSelectSearch>
                                </Col>
                            </Row>
                           
                            {this.state.data ?


                                <DataGrid
                                    primaryKeyField={"nstoragesamplereceivingcode"}
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
                                    gridHeight={'530px'}
                                    isToolBarRequired={true}
                                    isActionRequired={true}
                                    expandField="expanded"
                                    selectedId={0}
                                    addRecord={() => this.props.getComboSampleReceiving(addParam,this.props.Login.masterData)}
                                    isDownloadButtonOn={true} //report 
                                    samplereceivingData={this.samplereceivingData}   //report
                                    deleteParam={deleteParam}
                                    deleteRecord={this.deleteRecord}
                                    fetchRecord={this.props.getActiveSampleReceivingById}
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
                            { "mandatory": true, "idsName": "IDS_SAMPLERECEIVINGDATE", "dataField": "dcollectiondate", "width": "250px", "fieldType": 'dateOnlyFormat', "controlType": "textinput" },
                        ]}
                        addComponent={this.props.Login.loadEsign ?
                            <Esign operation={this.props.Login.operation}
                                formatMessage={this.props.intl.formatMessage}
                                onInputOnChange={this.onInputOnChange}
                                inputParam={this.props.Login.inputParam}
                                selectedRecord={this.state.selectedRecord || {}}
                            />
                            : <AddSampleReceiving

                                barcodedata={this.state.barcodedata}
                                barcodeFields={this.state.barcodeFields}
                                //barcodenorecord={this.state.barcodenorecord}
                                selectedRecord={this.state.selectedRecord || {}}
                                onInputOnChange={this.onInputOnChange}
                                onComboChange={this.onComboChange}
                                barcodeEnter={this.barcodeEnter}
                                formatMessage={this.props.intl.formatMessage}
                                operation={this.props.Login.operation}
                                unit={this.props.Login.unit}
                                userInfo={this.props.Login.userInfo}
                                handleDateChangeSlidout={this.handleDateChangeSlidout}
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
            displayName: "IDS_STORAGESAMPLERECEIVING",
            inputData: {
                [this.props.Login.inputParam.methodUrl.toLowerCase()]: deleteParam.selectedRecord,
                "userinfo": this.props.Login.userInfo,


                "fromDate": fromDate,
                "toDate": toDate,
                "nprojecttypecode": this.props.Login.masterData.selectedProjectType.value || -1,
                "nstoragesamplereceivingcode": deleteParam.selectedRecord['nstoragesamplereceivingcode'],
                "scollectiondate": deleteParam.selectedRecord['scollectiondate'],
                "scomments": deleteParam.selectedRecord['scomments']

            },
            operation: deleteParam.operation,
            dataState: this.state.dataState
        }

        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, deleteParam.ncontrolCode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData: this.props.Login.masterData },
                    openModal: true, screenName: this.props.intl.formatMessage({ id: "IDS_STORAGESAMPLERECEIVING" }),
                    operation: deleteParam.operation
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.crudMaster(inputParam, this.props.Login.masterData, "openModal");
        }
    }

    checkNoRecord = (inputData) => {
     
        if (inputData?.SampleReceiving?.jsondata) {
            try {
              
                const jsonData = JSON.parse(inputData.SampleReceiving.jsondata);
               
                return jsonData.hasOwnProperty("NoRecord");
            } catch (error) {
           
                console.error("Invalid JSON string:", error);
                return false;
            }
        }
        // Return false if jsondata does not exist
        return false;
    }



    onSaveClick = (saveType, formRef) => {
        let selectedRecord = this.state.selectedRecord || {};
        let inputData = {};
        //ATE234 Janakumar ALPD-4728 Sample Receiving-->While edit the pagination 2 record its automatically changed pagination 1
        let datastate=undefined;
        const jsonDataCheck = this.state.barcodedata;

        if (selectedRecord["sbarcodeid"] && selectedRecord["sbarcodeid"].length === parseInt(this.props.Login.masterData.nbarcodelength && this.props.Login.masterData.nbarcodelength) ) {
            if(jsonDataCheck !== undefined && jsonDataCheck !== '' && jsonDataCheck !=0){

            inputData["SampleReceiving"] = {};
            if (this.props.Login.operation === "create") {

                inputData["SampleReceiving"]["jsondata"] = Lims_JSON_stringify(JSON.stringify(this.state.barcodedata));
            }
            inputData["SampleReceiving"]["nprojecttypecode"] = this.props.Login.masterData.selectedProjectType.value || transactionStatus.NA;
            if (this.props.Login.operation === "update") {
                inputData["SampleReceiving"]["nstoragesamplereceivingcode"] = this.props.Login.selectedId;
                datastate=this.state.dataState;
            }
            inputData["SampleReceiving"]["sbarcodeid"] = selectedRecord["sbarcodeid"] ? selectedRecord["sbarcodeid"] : -1;

            inputData["SampleReceiving"]["dcollectiondate"] = formatInputDate(selectedRecord["dcollectiondate"], false);
            inputData["SampleReceiving"]["scomments"] = selectedRecord["scomments"] && selectedRecord["scomments"] || "";
            inputData["SampleReceiving"]["ntzcollectiondatetime"] = selectedRecord["ntzcollectiondatetime"] && selectedRecord["ntzcollectiondatetime"].value || transactionStatus.NA
            inputData["SampleReceiving"]["noffsetdcollectiondatetime"] = selectedRecord["noffsetdcollectiondatetime"] && selectedRecord["noffsetdcollectiondatetime"].value || transactionStatus.NA
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
                classUrl: "samplereceiving",
                methodUrl: "SampleReceiving",
                inputData: inputData,
                operation: this.props.Login.operation,
                displayName:"IDS_STORAGESAMPLERECEIVING",
                saveType, formRef,datastate,
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
                this.props.saveReceiving(inputParam, masterData);
            }
        }
            else {
                toast.warn(
                    this.props.intl.formatMessage({
                        id: "IDS_CLICKENTERTOJSONRECORD",
                    })
                );
            }
        
        } else {
           

                toast.warn(
                    this.props.intl.formatMessage({
                        id: "IDS_INVALIDABARCODE",
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
            this.props.getSampleReceiving(inputParam)
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

    onInputOnChange = (event, fieldname) => {

        const value = event.target.value;
        //const { selectedRecord } = this.state;
        const selectedRecord = this.state.selectedRecord || {};

        if (fieldname === 'sbarcodeid') {
            
            if (!/^\s*$/.test(value) && value.length >= parseInt(this.props.Login.settings[37])) {
                
                if (event.target.name === "sbarcodeid") {
                    selectedRecord[event.target.name] = value;
                } else {
                    selectedRecord[event.target.name] = value;
                }
                const barcodenorecord = false;
                this.setState({ selectedRecord: selectedRecord, barcodenorecord: barcodenorecord });
            } else {

                const str = true;
                this.setState({ barcodenorecord: str });
            }

        }

        selectedRecord[event.target.name] = value;
        this.setState({ selectedRecord });
    }

    barcodeEnter = (event, fieldName) => {
        const value = this.state.selectedRecord.sbarcodeid;

        if (!/^\s*$/.test(value) && value.length === parseInt(this.props.Login.masterData.nbarcodelength && this.props.Login.masterData.nbarcodelength) && event.keyCode === 13) {

            let inputData = [];
            let obj = convertDateValuetoString(this.props.Login.masterData.FromDate,
                this.props.Login.masterData.ToDate,
                this.props.Login.userInfo);
            let fromDate = obj.fromDate;
            let toDate = obj.toDate;
            inputData["fromDate"] = fromDate;
            inputData["toDate"] = toDate;
            inputData = {
                userinfo: this.props.Login.userInfo,
                selectedRecord: this.state.selectedRecord,
                toDate: toDate,
                fromDate: fromDate
            }
            const masterData = { ...this.props.Login.masterData }
            const inputParam = { masterData, inputData }
            this.props.getBarcodeDataRecord(inputParam)

        }

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

        // if (this.props.Login.masterData.SampleReceiving !== previousProps.Login.masterData.SampleReceiving) {
        //     let samplecollect = [];
        //     samplecollect =
        //         this.props.Login.masterData.SampleReceiving && this.props.Login.masterData.SampleReceiving.map(sampleItem => {
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

        //         let { dataState } = this.state;
        //         if (dataState === undefined) {
        //             dataState = { skip: 0, take: this.state.dataState.take }
        //         }
        //         if (this.state.dataResult.data) {
        //             if (this.state.dataResult.data.length === 1) {
        //                 let skipcount = this.state.dataState.skip > 0 ? (this.state.dataState.skip - this.state.dataState.take) :
        //                     this.state.dataState.skip
        //                 dataState = { skip: skipcount, take: this.state.dataState.take }
        //             }
        //         }
        //         this.setState({
        //             data: samplecollect,
        //             dataState,
        //             dataResult: process(samplecollect || [], dataState),
        //         });
        // }

        if (this.props.Login.masterData !== previousProps.Login.masterData) {

            if (this.props.Login.userInfo.nformcode !== previousProps.Login.userInfo.nformcode) {
                const userRoleControlRights = [];
                if (this.props.Login.userRoleControlRights) {
                    this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode] && Object.values(this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode]).map(item =>
                        userRoleControlRights.push(item.ncontrolcode))
                }
                const controlMap = getControlMap(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode)
                let samplecollect = [];
                samplecollect =
                    this.props.Login.masterData.SampleReceiving && this.props.Login.masterData.SampleReceiving.map(sampleItem => {
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
                //     let { dataState } = this.state;
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
                    userRoleControlRights, controlMap, data: samplecollect,
                    dataResult: process(samplecollect || [],this.state.dataState),
                });
            }else {

                //jana ALPD-4694 Temporary Storage-->While Try to Delete the Records the Fields are Align Wrongly

                let samplereceiving = [];
                samplereceiving =
                    this.props.Login.masterData.SampleReceiving && this.props.Login.masterData.SampleReceiving.map(sampleItem => {
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
                if(this.props.Login.dataState===undefined  || (this.props.Login.masterData.selectedProjectType && 
                    this.props.Login.masterData.selectedProjectType.value !== previousProps.Login.masterData.selectedProjectType.value)){
                        dataState={skip:0,take:this.state.dataState.take}
                }
                if(this.state.dataResult.data){
                    if(this.state.dataResult.data.length ===1 && this.props.Login.operation ==='delete'){
                       let skipcount=this.state.dataState.skip>0?(this.props.Login.masterData.length-this.state.dataState.take):
                       this.state.dataState.skip
                        dataState={skip:skipcount,take:this.state.dataState.take}
                    }
                }
                 this.setState({
                    data: samplereceiving, selectedRecord: this.props.Login.selectedRecord,
                    dataResult: process(samplereceiving || [],dataState),
                    dataState
                });
            }
            // else {
            //     if (this.props.Login.masterData.SampleReceiving) {
            //         let samplecollect = [];
            //         samplecollect =
            //             this.props.Login.masterData.SampleReceiving && this.props.Login.masterData.SampleReceiving.map(sampleItem => {
            //                 const entries = Object.entries(sampleItem.jsondata);
            //                 if (entries.length > 0) {
            //                     const newItem = { ...sampleItem };
            //                     entries.forEach(([key, value]) => {

            //                         newItem[key] = value;

            //                     });
            //                     return newItem;
            //                 }
            //                 return sampleItem;
            //             });

            //         this.setState({
            //             data: samplecollect,
            //             dataState: { skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5 },
            //             dataResult: process(samplecollect || [], { skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5 }),
            //         });
            //     }
            // }
        }

        else if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord) {
            this.setState({ selectedRecord: this.props.Login.selectedRecord });
        }

        // if (this.props.Login.masterData.barcodenorecord !== previousProps.Login.masterData.barcodenorecord) {
        //     this.setState({ barcodenorecord: this.props.Login.masterData.barcodenorecord });
        // }
        if (this.props.Login.masterData.jsondataBarcodeFields !== previousProps.Login.masterData.jsondataBarcodeFields) {
            const retrievedData = sortData(this.props.Login.masterData.jsondataBarcodeFields,"ascending","nsorter");
            this.setState({ jsondataBarcodeFields: retrievedData });
        }


        if (this.props.Login.masterData.jsondataBarcodeFields !== previousProps.Login.masterData.jsondataBarcodeFields) {
            this.setState({ jsondataBarcodeFields: this.props.Login.masterData.jsondataBarcodeFields });
        }

        if (this.props.Login.masterData.barcodeFields !== previousProps.Login.masterData.barcodeFields) {
            this.setState({ barcodeFields: this.props.Login.masterData.barcodeFields });
        }

        if (this.props.Login.masterData.barcodedata !== previousProps.Login.masterData.barcodedata) {
            this.setState({ barcodedata: this.props.Login.masterData.barcodedata });
        }

        // if (this.props.Login.barcodenorecord !== previousProps.Login.barcodenorecord) {
        //     this.setState({ barcodenorecord: false });
        // }

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
            },
            classUrl: 'samplereceiving',
            methodUrl: "SampleReceiving",
            displayName: "IDS_STORAGESAMPLERECEIVING",
            userInfo: this.props.Login.userInfo, selectedRecord
        };
        this.props.callService(inputParam);
    }

    reloadData = (selectedRecord, isDateChange) => {
        //this.searchRef.current.value = "";
        let fromDate = this.props.Login.masterData.FromDate;
        let toDate = this.props.Login.masterData.ToDate;

        let obj = convertDateValuetoString(fromDate, toDate, this.props.Login.userInfo, true);
        const inputParam = {
            inputData: {
                "userinfo": this.props.Login.userInfo,
                //ALPD-4684-Vignesh R(20-08-2024)
                nprojecttypecode: this.props.Login.masterData.selectedProjectType.value || -1,
                fromDate: obj.fromDate,
                toDate: obj.toDate
            },
            classUrl: 'samplereceiving',
            methodUrl: "SampleReceiving",
            displayName: "IDS_STORAGESAMPLERECEIVING",
            userInfo: this.props.Login.userInfo,
            selectedRecord: this.state.selectedRecord || {}

        };
        this.props.callService(inputParam);
    }
    samplereceivingData = (SampleReceivingReportId) => {

        let obj = convertDateValuetoString(this.props.Login.masterData.FromDate,
            this.props.Login.masterData.ToDate,
            this.props.Login.userInfo);
        let fromDate = obj.fromDate;
        let toDate = obj.toDate;

        const filterTestParam = {
            todate: toDate,
            fromdate: fromDate,
            nprojecttypecode:this.props.Login.masterData.selectedProjectType.value || -1,
            nsitecode:this.props.Login.userInfo.nsitecode
        }


        this.props.generateControlBasedReport(SampleReceivingReportId, filterTestParam, this.props.Login, "nsamplereceivingcode",
            this.state.selectedRecord.nsamplereceivingcode);

    }




}
export default connect(mapStateToProps, {
    callService, crudMaster, getActiveSampleReceivingById, getSampleReceiving,generateControlBasedReport,
    updateStore, validateEsignCredential, getComboSampleReceiving, getBarcodeDataRecord, saveReceiving
})(injectIntl(SampleReceivingStorage));