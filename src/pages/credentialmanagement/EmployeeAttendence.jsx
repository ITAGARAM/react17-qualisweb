import React from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Row, Col } from 'react-bootstrap';
import { process } from '@progress/kendo-data-query';
import { toast } from 'react-toastify';
import DataGrid from '../../components/data-grid/data-grid.component';
import AddEmployeeAttendence from './AddEmployeeAttendence';
import SlideOutModal from '../../components/slide-out-modal/SlideOutModal';
import Esign from '../audittrail/Esign';
import { ListWrapper, PrimaryHeader } from '../../components/client-group.styles';
import { callService, updateStore, crudMaster, validateEsignCredential } from '../../actions';
import { getControlMap, showEsign, getStartOfDay, rearrangeDateFormat, convertDateValuetoString, constructOptionList, Lims_JSON_stringify, formatInputDate, } from '../../components/CommonScript';
import DateTimePicker from '../../components/date-time-picker/date-time-picker.component';
import { DEFAULT_RETURN } from '../../actions/LoginTypes';
import { transactionStatus } from '../../components/Enumeration';
import { getEmployeeAttendence, getComboEmployeeAttendence, saveEmployeeAttendence, getActiveEmployeeAttendenceById } from '../../actions/EmployeeAttendenceAction';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';



const mapStateToProps = state => {
    return ({ Login: state.Login })
}

class EmployeeAttendence extends React.Component {

    constructor(props) {
        super(props)
        this.formRef = React.createRef();
        this.extractedColumnList = [];


        const dataState = {
            skip: 0,
            take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5,
        };

        this.state = {
            data: [], masterStatus: "", error: "", selectedRecord: {},
            dataResult: [],
            dataState: dataState,
            isOpen: false,
            userRoleControlRights: [],
            controlMap: new Map()
        };
    };


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

    dataStateChange = (event) => {
        this.setState({
            dataResult: process(this.state.data, event.dataState),
            dataState: event.dataState
        });
    }


    reloadData = () => {
        let attendenceDate = this.props.Login.masterData.attendenceDate || this.props.Login.masterData.attendenceDate;
        let obj = convertDateValuetoString(attendenceDate, null, this.props.Login.userInfo, true);
        const inputParam = {
            inputData: {
                "userinfo": this.props.Login.userInfo,
                attendenceDate: obj.fromDate,
                "nemptypecode": this.props.Login.masterData.selectedEmployeeType.nemptypecode || -1,
            },
            classUrl: this.props.Login.inputParam.classUrl,
            methodUrl: this.props.Login.inputParam.methodUrl,
            userInfo: this.props.Login.userInfo,
            displayName: this.props.Login.inputParam.displayName,
            selectedRecord: this.state.selectedRecord || {}
        };

        this.props.callService(inputParam);
    }

    onComboChange = (comboData, fieldName) => {
        let inputData = [];
        const selectedRecord = this.state.selectedRecord || {};
        if (fieldName == "nemptypecode") {
            let obj = convertDateValuetoString(selectedRecord.attendenceDate, null, this.props.Login.userInfo);
            let attendenceDate = obj.fromDate;
            inputData["attendenceDate"] = attendenceDate
            inputData = {
                userinfo: this.props.Login.userInfo,
                nemptypecode: parseInt(comboData.value),
                selectedEmployeeType: comboData,
                attendenceDate: attendenceDate
            }
            const masterData = { ...this.props.Login.masterData }
            const inputParam = { masterData, inputData }
            this.props.getEmployeeAttendence(inputParam)
        } else {
            selectedRecord[fieldName] = comboData;
            this.setState({ selectedRecord });
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

    handleDateChange = (dateName, dateValue) => {
        const { selectedRecord } = this.state;
        if (dateValue === null) {
            dateValue = new Date();
        }
        selectedRecord[dateName] = dateValue;
        this.setState({ selectedRecord });
        let obj = convertDateValuetoString(selectedRecord['attendenceDate'] && selectedRecord['attendenceDate'] || this.props.Login.masterData.attendenceDate, null, this.props.Login.userInfo, null);
        let attendenceDate = obj.fromDate;

        const inputParam = {
            inputData: {
                "userinfo": this.props.Login.userInfo,
                attendenceDate: attendenceDate,
                selectedEmployeeType: this.props.Login.masterData.selectedEmployeeType,
                nemptypecode: this.props.Login.masterData.selectedEmployeeType && this.props.Login.masterData.selectedEmployeeType.nemptypecode || -1

            }
        };
        this.props.getEmployeeAttendence(inputParam);

    }

    gridfillingColumn(data) {
        const temparray = [{ "controlType": "combobox", "idsName": "IDS_EMPLOYEES", "dataField": "susername", "width": "200px", "tablecolumnname": "nusercode" },
        { "controlType": "checkbox", "idsName": "IDS_ISPRESENT", "dataField": "sispresent", "width": "200px", "isIdsField": false, "controlName": "nispresent", "tablecolumnname": "nispresent" },
        { "idsName": "IDS_ENTRYDATETIME", "dataField": "sentrydatetime", "dateField": "dentrydatetime", "width": "150px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "selectbox" },
        { "idsName": "IDS_EXITDATETIME", "dataField": "sexitdatetime", "dateField": "dexitdatetime", "width": "150px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "selectbox" },
        { "controlType": "textarea", "idsName": "IDS_REMARKS", "dataField": "sremarks", "width": "200px", "tablecolumnname": "sremarks" }
        ];
        return temparray;
    }

    render() {
        let primaryKeyField = "";
        let attendenceDate = "";
        primaryKeyField = "nempattendencecode";
        const extractedColumnList = this.gridfillingColumn(this.props.Login.masterData.EmployeeAttendenceList && this.props.Login.masterData.EmployeeAttendenceList
            || []);
        this.extractedColumnList = extractedColumnList;
        let mandatoryFields = [];
        mandatoryFields.push(
            { "mandatory": true, "idsName": "IDS_ATTENDENCEDATE", "dataField": "dattendencedate", "mandatoryLabel": "IDS_ENTER", "fieldType": 'dateOnlyFormat', "controlType": "textinput", "width": "200px", "tablecolumnname": "dattendencedate" },
            { "mandatory": true, "idsName": "IDS_EMPLOYEES", "dataField": "nusercode", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox", "width": "200px", "tablecolumnname": "nusercode" },
        )
        if (this.state.selectedRecord && this.state.selectedRecord["nispresent"]) {
            if (this.state.selectedRecord["nispresent"] === transactionStatus.YES) {
                mandatoryFields.push(
                    { "mandatory": true, "idsName": "IDS_ENTRYDATETIME", "dataField": "dentrydatetime", "mandatoryLabel": "IDS_ENTER", "fieldType": 'dateOnlyFormat', "controlType": "textinput", "width": "200px", "tablecolumnname": "dentrydatetime" },
                )
            }
        }
        const addId = this.state.controlMap.has("AddEmployeeAttendence") && this.state.controlMap.get("AddEmployeeAttendence").ncontrolcode;
        const editId = this.state.controlMap.has("EditEmployeeAttendence") && this.state.controlMap.get("EditEmployeeAttendence").ncontrolcode;
        const deleteId = this.state.controlMap.has("DeleteEmployeeAttendence") && this.state.controlMap.get("DeleteEmployeeAttendence").ncontrolcode;

        const addParam = {
            screenName: this.props.Login.displayName, primaryKeyField: "nempattendencecode", primaryKeyValue: undefined,
            operation: "create", inputParam: this.props.Login.inputParam, userInfo: this.props.Login.userInfo, ncontrolcode: addId,
            selectedRecord: this.state.selectedRecord,
            masterData: this.props.Login.masterData
        };

        const editParam = {
            screenName: this.props.Login.displayName,
            operation: "update",
            userInfo: this.props.Login.userInfo,
            ncontrolcode: editId,
            masterData: this.props.Login.masterData,
            inputParam: this.props.Login.inputParam,
            primaryKeyField: "nemployeeattendencecode",
            selectedRecord: this.state.selectedRecord || {},
            dataState: this.state.dataState
        };

        const deleteParam = { operation: "delete", ncontrolcode: deleteId, selectedRecord: this.state.selectedRecord };

        if (this.props.Login.masterData && this.props.Login.masterData.AttendenceDate) {
            attendenceDate = (this.state.selectedRecord["attendenceDate"] && getStartOfDay(this.state.selectedRecord["attendenceDate"])) || rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.AttendenceDate);
        }
        return (
            <>
                <Row>
                    <Col>
                        <ListWrapper className="client-list-content">
                            {/* <PrimaryHeader className="d-flex justify-content-between mb-3"> */}
                            {/* <HeaderName className="header-primary-md">
                                {this.props.Login.inputParam && this.props.Login.inputParam.displayName ?
                                    <FormattedMessage id={this.props.Login.inputParam.displayName} /> : ""}
                            </HeaderName> */}
                            {/* <Button className="btn btn-user btn-primary-blue"
                                 hidden={this.props.Login.inputParam && this.state.userRoleControlRights.indexOf(addId) === -1}
                                onClick={() => this.props.getMaterialTypeComboService(addParam)}>
                                <FontAwesomeIcon icon={faPlus} /> {}
                                <FormattedMessage id="IDS_ADD" defaultMessage='Add' />
                            </Button> */}
                            {/* </PrimaryHeader> */}

                            <Row>
                                <Col md={2}>
                                    <DateTimePicker
                                        name={"attendenceDate"}
                                        label={this.props.intl.formatMessage({ id: "IDS_ATTENDENCEDATE" })}
                                        className='form-control'
                                        placeholderText="Select date.."
                                        selected={this.state.selectedRecord["attendenceDate"] || new Date()}
                                        dateFormat={this.props.Login.userInfo.ssitedate}
                                        isClearable={false}
                                        onChange={date => this.handleDateChange("attendenceDate", date)}
                                        value={this.state.selectedRecord["attendenceDate"] || attendenceDate}

                                    />
                                </Col>
                                <Col md={2}>
                                    <FormSelectSearch
                                        formLabel={this.props.intl.formatMessage({ id: "IDS_EMPLOYEETYPE" })}
                                        isSearchable={true}
                                        name={"nemptypecode"}
                                        isDisabled={false}
                                        placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                        isMandatory={true}
                                        isClearable={false}
                                        options={this.state.employeeType}
                                        optionId="nemptypecode"
                                        optionValue="semptypename"
                                        value={this.state.selectedRecord["nemptypecode"] && this.state.selectedRecord["nemptypecode"] || ""}
                                        //value={this.props.Login.masterData.selectedEmployeeType}
                                        defaultValue={this.state.selectedRecord["nemptypecode"] && this.state.selectedRecord["nemptypecode"].nemptypecode || ""}
                                        onChange={(event) => this.onComboChange(event, "nemptypecode")}
                                        closeMenuOnSelect={true}
                                    >
                                    </FormSelectSearch>
                                </Col>
                            </Row>
                            {this.state.data ?
                                <DataGrid
                                    primaryKeyField={primaryKeyField}
                                    data={this.state.data}
                                    dataResult={this.state.dataResult}
                                    dataState={this.state.dataState}
                                    dataStateChange={this.dataStateChange}
                                    extractedColumnList={this.extractedColumnList}
                                    controlMap={this.state.controlMap}
                                    userRoleControlRights={this.state.userRoleControlRights}
                                    inputParam={this.props.Login.inputParam}
                                    userInfo={this.props.Login.userInfo}
                                    fetchRecord={this.props.getActiveEmployeeAttendenceById}
                                    deleteRecord={this.deleteRecord}
                                    reloadData={this.reloadData}
                                    editParam={editParam}
                                    deleteParam={deleteParam}
                                    addRecord={() => this.props.getComboEmployeeAttendence(addParam)}
                                    scrollable={"scrollable"}
                                    gridHeight={"600px"}
                                    // formatMessage={this.props.intl.formatMessage}
                                    isComponent={true}
                                    expandField="expanded"
                                    isActionRequired={true}
                                    isToolBarRequired={true}
                                    pageable={{ buttonCount: 4, pageSizes: true }}
                                    hasDynamicColSize={true}
                                    selectedId={this.props.Login.selectedId}
                                    settings={this.props.Login.settings}
                                />
                                : ""}

                        </ListWrapper>
                    </Col>
                </Row>
                {this.props.Login.openModal &&
                    <SlideOutModal
                        show={this.props.Login.openModal}
                        closeModal={this.closeModal}
                        operation={this.props.Login.operation}
                        inputParam={this.props.Login.inputParam}
                        screenName={this.props.Login.screenName}
                        showSaveContinue={true}
                        onSaveClick={this.onSaveClick}
                        esign={this.props.Login.loadEsign}
                        validateEsign={this.validateEsign}
                        masterStatus={this.props.Login.masterStatus}
                        updateStore={this.props.updateStore}
                        mandatoryFields={mandatoryFields}
                        selectedRecord={this.state.selectedRecord || {}}
                        addComponent={this.props.Login.loadEsign ?
                            <Esign
                                operation={this.props.Login.operation}
                                formatMessage={this.props.intl.formatMessage}
                                onInputOnChange={this.onInputOnChange}
                                inputParam={this.props.Login.inputParam}
                                selectedRecord={this.state.selectedRecord || {}}
                            />
                            : <AddEmployeeAttendence
                                selectedRecord={this.state.selectedRecord || {}}
                                onInputOnChange={this.onInputOnChange}
                                onComboChange={this.onComboChange}
                                currentTime={this.props.Login.currentTime || new Date()}
                                handleDateChangeSlidout={this.handleDateChangeSlidout}
                                handleDateChange={this.handleDateChange}
                                // formatMessage={this.props.intl.formatMessage}
                                operation={this.props.Login.operation}
                                employeeList={this.state.employeeList}
                                userInfo={this.props.Login.userInfo}
                                inputParam={this.props.Login.inputParam}
                                selectedEmployeeType={this.props.Login.masterData.selectedEmployeeType}
                            />
                        }
                    />
                }
            </>
        );
    }

    closeModal = () => {
        let loadEsign = this.props.Login.loadEsign;
        let openModal = this.props.Login.openModal;
        let selectedRecord = this.props.Login.selectedRecord;
        if (this.props.Login.loadEsign) {
            if (this.props.Login.operation === "delete") {
                loadEsign = false;
                openModal = false;
                selectedRecord["nusercode"] = ""
                selectedRecord["nispresent"] = ""
                selectedRecord["dentrydatetime"] = ""
                selectedRecord["dexitdatetime"] = ""
                selectedRecord["sremarks"] = ""

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
            selectedRecord["nusercode"] = ""
            selectedRecord["nispresent"] = ""
            selectedRecord["dentrydatetime"] = ""
            selectedRecord["dexitdatetime"] = ""
            selectedRecord["sremarks"] = ""
        }

        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { openModal, loadEsign, selectedRecord }
        }
        this.props.updateStore(updateInfo);
    }

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

    handleDateChangeSlidout = (dateName, dateValue) => {
        const selectedRecord = this.state.selectedRecord || {};
        selectedRecord[dateName] = dateValue;
        this.setState({ selectedRecord });
    };

    onSaveClick = (saveType, formRef) => {
        let inputData = {};
        let selectedRecord = {
            ... this.state.selectedRecord
        }

        // added by sujatha v ATE_274 To check entry must equal to attendence date
        if (selectedRecord.dentrydatetime &&
            selectedRecord.dentrydatetime.toDateString() !== selectedRecord.dattendencedate.toDateString()) {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_ENTRYSHOULDMATCHATTENDENCEDATE" }));
            return;
        }

       // added by sujatha v ATE_274 To check exit date must equal to attendence date
        if (selectedRecord.dexitdatetime &&
            selectedRecord.dexitdatetime.toDateString() !== selectedRecord.dattendencedate.toDateString()) {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_EXITDATESHOULDMATCHATTENDENCEDATE" }));
            return;
        }


        inputData["employeeattendence"] = {}
        inputData["userinfo"] = this.props.Login.userInfo;
        let dataState = undefined;
        let selectedId = null;
        if (this.props.Login.operation === "update") {
            dataState = this.state.dataState;
            selectedId = this.props.Login.selectedRecord.nempattendencecode;
        }
        else {
            inputData[this.props.Login.inputParam.methodUrl.toLowerCase()] = { "nsitecode": this.props.Login.userInfo.nmastersitecode };
        }
        if (inputData["employeeattendence"].hasOwnProperty('esignpassword')) {
            if (inputData["employeeattendence"]['esignpassword'] === '') {
                delete inputData["employeeattendence"]['esigncomments']
                delete inputData["employeeattendence"]['esignpassword']
                delete inputData["employeeattendence"]['esignreason']
            }
        }
        inputData["employeeattendence"]["nemptypecode"] = selectedRecord["nemptypecode"] ? selectedRecord["nemptypecode"].value : transactionStatus.NA;
        inputData["employeeattendence"]["nusercode"] = selectedRecord["nusercode"] ? selectedRecord["nusercode"].value : transactionStatus.NA;
        inputData["employeeattendence"]["nispresent"] = selectedRecord["nispresent"] ? selectedRecord["nispresent"] : transactionStatus.NO;
        inputData["employeeattendence"]["dentrydatetime"] = selectedRecord["dentrydatetime"] && selectedRecord["dentrydatetime"] ? formatInputDate(selectedRecord["dentrydatetime"], false) : null;
        inputData["employeeattendence"]["ntzentrydatetime"] = selectedRecord["ntzentrydatetime"] && selectedRecord["ntzentrydatetime"].value || transactionStatus.NA
        inputData["employeeattendence"]["noffsetdentrydatetime"] = selectedRecord["noffsetdentrydatetime"] && selectedRecord["noffsetdentrydatetime"].value || transactionStatus.NA
        inputData["employeeattendence"]["dexitdatetime"] = selectedRecord["dexitdatetime"] && selectedRecord["dexitdatetime"] ? formatInputDate(selectedRecord["dexitdatetime"], false) : null;
        inputData["employeeattendence"]["ntzexitdatetime"] = selectedRecord["ntzexitdatetime"] && selectedRecord["ntzexitdatetime"].value || transactionStatus.NA
        inputData["employeeattendence"]["noffsetdexitdatetime"] = selectedRecord["noffsetdexitdatetime"] && selectedRecord["noffsetdexitdatetime"].value || transactionStatus.NA
        inputData["employeeattendence"]["dattendencedate"] = selectedRecord["dattendencedate"] && selectedRecord["dattendencedate"] ? formatInputDate(selectedRecord["dattendencedate"], false) : null;
        inputData["employeeattendence"]["ntzattendencedate"] = selectedRecord["ntzattendencedate"] && selectedRecord["ntzattendencedate"].value || transactionStatus.NA
        inputData["employeeattendence"]["noffsetdattendencedate"] = selectedRecord["noffsetdattendencedate"] && selectedRecord["noffsetdattendencedate"].value || transactionStatus.NA
        inputData["employeeattendence"]["sremarks"] = selectedRecord["sremarks"] ? selectedRecord["sremarks"] : "";
        if (this.props.Login.operation === "update") {
            inputData["employeeattendence"]["nempattendencecode"] = this.props.Login.selectedId;
        }

        let obj = convertDateValuetoString(this.props.Login.masterData.attendenceDate, null, this.props.Login.userInfo);
        let attendenceDate = obj.fromDate;
        inputData["attendenceDate"] = attendenceDate;
        inputData["nemptypecode"] = this.props.Login.masterData.selectedEmployeeType.nemptypecode || transactionStatus.NA;
        inputData["userinfo"] = {
            ...this.props.Login.userInfo,
            sformname: Lims_JSON_stringify(this.props.Login.userInfo.sformname),
            smodulename: Lims_JSON_stringify(this.props.Login.userInfo.smodulename)
        }

        const inputParam = {
            nformcode: this.props.Login.userInfo.nformcode,
            classUrl: this.props.Login.inputParam.classUrl,
            methodUrl: this.props.Login.inputParam.methodUrl,
            inputData: inputData,
            operation: this.props.Login.operation,
            displayName: this.props.Login.inputParam.displayName, selectedId, dataState,
            saveType, formRef,
            selectedRecord: selectedRecord || {}
        }

        const masterData = this.props.Login.masterData;
        const esignNeeded = showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolcode);
        if (esignNeeded) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData }, saveType,
                    openModal: true, screenName: this.props.intl.formatMessage({ id: this.props.Login.inputParam.displayName }),
                    operation: this.props.Login.operation,
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.saveEmployeeAttendence(inputParam, masterData);
        }
    }

    deleteRecord = (deleteParam) => {
        let obj = convertDateValuetoString(this.props.Login.masterData.attendenceDate, null, this.props.Login.userInfo);
        let attendenceDate = obj.fromDate;
        const inputParam = {
            classUrl: this.props.Login.inputParam.classUrl,
            methodUrl: this.props.Login.inputParam.methodUrl,
            displayName: this.props.Login.inputParam.displayName,
            inputData: {
                [this.props.Login.inputParam.methodUrl.toLowerCase()]: deleteParam.selectedRecord,
                "userinfo": this.props.Login.userInfo,

                "attendenceDate": attendenceDate,
                "nemptypecode": this.props.Login.masterData.selectedEmployeeType.nemptypecode || -1,
                "nemployeeattendencecode": deleteParam.selectedRecord['nemployeeattendencecode']

            },
            operation: deleteParam.operation,
            // dataState: this.state.dataState
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

        componentDidUpdate(previousProps) {
        let { EmployeeType, EmployeeTypeMap, controlMap, userRoleControlRights, selectedEmployeeType, selectedRecord } = this.state;
        let bool;
		//added by sujatha ATE_274 on 26-08-2025 for pagination issue
        let dataState = this.props.Login.dataState === undefined
        ? { skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5 }
        :  this.props.Login.dataState;


        if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord) {
            selectedRecord = this.props.Login.selectedRecord;
            bool = true;
        }

        if (this.props.Login.masterData.EmployeeType !== previousProps.Login.masterData.EmployeeType) {
            let EmployeeTypeMap = constructOptionList(this.props.Login.masterData.EmployeeType || [], "nemptypecode",
                "semptypename", undefined, undefined, undefined);
            EmployeeType = EmployeeTypeMap.get("OptionList");
            bool = true;

        }

        if (this.props.Login.masterData.selectedEmployeeType !== previousProps.Login.masterData.selectedEmployeeType) {
            let nemptypecode = this.props.Login.masterData.selectedEmployeeType ?
                {
                    label: this.props.Login.masterData.selectedEmployeeType.semptypename,
                    value: this.props.Login.masterData.selectedEmployeeType.nemptypecode,
                    item: this.props.Login.masterData.selectedEmployeeType
                } : undefined
            selectedRecord['nemptypecode'] = nemptypecode;
            bool = true;

        }


        if (this.props.Login.masterData.attendenceDate !== previousProps.Login.masterData.attendenceDate) {
            selectedRecord['attendenceDate'] = rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.attendenceDate);
            bool = true;
        }

        if (this.props.Login.masterData !== previousProps.Login.masterData) {
            if (this.props.Login.userInfo.nformcode !== previousProps.Login.userInfo.nformcode) {

                if (this.props.Login.userRoleControlRights) {
                    this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode] && Object.values(this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode]).map(item =>
                        userRoleControlRights.push(item.ncontrolcode))
                }
                controlMap = getControlMap(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode)

            }
            //modified by sujatha ATE_274 on 26-08-2025 for pagination and edit issue
            this.setState({
                data: this.props.Login.masterData.EmployeeAttendence, //modified by sujatha ATE_274 SWSM-114 for tooltip issue in the beginning
                 //modified by Mullai Balaji  ATE_273 SWSM-114 for data not show in excel and pdf while download
                userRoleControlRights,
                controlMap,
                EmployeeType,
                isOpen: false,
                selectedRecord,
                dataState,
                dataResult: process(this.props.Login.masterData.EmployeeAttendence || [],dataState),
                employeeTypeMap: EmployeeTypeMap,
                employeeType: EmployeeType,
                selectedEmployeeType,
                employeeList: selectedRecord.employeeList,
                employeeAttendenceList: this.props.Login.masterData.employeeAttendenceList
            });
        } else if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord) {
            this.setState({ selectedRecord: this.props.Login.selectedRecord });
        }
    }
}

export default connect(mapStateToProps, {
    callService, updateStore, crudMaster, getEmployeeAttendence, getComboEmployeeAttendence, saveEmployeeAttendence,
    getActiveEmployeeAttendenceById, validateEsignCredential
})(injectIntl(EmployeeAttendence));