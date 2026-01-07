import React, { Component } from 'react';
import { Row, Col, Card, Nav } from 'react-bootstrap';
import { FormattedMessage, injectIntl } from 'react-intl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { process } from '@progress/kendo-data-query';
import SlideOutModal from '../../components/slide-out-modal/SlideOutModal';
import AddCommonHolidays from '../configurationmaster/AddCommonHolidays';
import AddPublicHolidays from '../configurationmaster/AddPublicHolidays';
import { DEFAULT_RETURN } from '../../actions/LoginTypes';
import { showEsign, formatInputDate } from '../../components/CommonScript';
import Esign from '../audittrail/Esign';
import CustomAccordion from '../../components/custom-accordion/custom-accordion.component';
import HolidayPlannerTabsAccordion from '../configurationmaster/HolidayPlannerTabsAccordion';
import CommonHolidaysTab from '../configurationmaster/CommonHolidaysTab';
import PublicHolidaysTab from '../configurationmaster/PublicHolidaysTab';
import UserBasedHolidays from '../configurationmaster/UserBasedHolidays';
import { transactionStatus } from '../../components/Enumeration';
import { toast } from 'react-toastify';
import ConfirmMessage from '../../components/confirm-alert/confirm-message.component';
import AddUserBasedHolidays from '../configurationmaster/AddUserBasedHolidays';

// import ReactTooltip from 'react-tooltip';

class HolidayPlannerTab extends Component {
    constructor(props) {
        super(props);

        const dataState = {
            skip: 0,
            take: this.props.settings ? parseInt(this.props.settings[14]) : 5,
        };
        this.state = {
            versionSelectedRecord: {}, dataResult: [],
            dataState: dataState, CommonHolidays: this.props.masterData.CommonHolidays,
            PublicHolidays: this.props.masterData.PublicHolidays, Country: [],
            CurrentYearVersion: this.props.masterData.CurrentYearVersion,
            activeTab: 'common-tab', selectedRecord: {},
            UserBasedHolidays: this.props.masterData.UserBasedHolidays, userBasedDataState: dataState, userBasedDataResult: []
        };
        this.publicHolidaysColumns = [
            { "idsName": "IDS_DATE", "dataField": "sdate", "width": "150px" },
            { "idsName": "IDS_DESCRIPTION", "dataField": "sdescription", "width": "400px" }
        ];
        this.userBasedHolidaysColumns = [
            { "idsName": "IDS_USERNAME", "dataField": "susername", "width": "150px" },
            { "idsName": "IDS_DATE", "dataField": "sdate", "width": "150px" },
            { "idsName": "IDS_DESCRIPTION", "dataField": "sdescription", "width": "400px" }
        ];
        this.confirmMessage = new ConfirmMessage();
    }

    dataStateChange = (event) => {
        this.setState({
            dataResult: process(this.state.PublicHolidays, event.dataState),
            dataState: event.dataState
        });
    }

    dataStateChangeUserBasedHolidays = (event) => {
        this.setState({
            userBasedDataResult: process(this.state.UserBasedHolidays, event.dataState),
            userBasedDataState: event.dataState
        });
    }


    render() {

        this.mandatoryPublicHolidaysColumns = [
            { "idsName": "IDS_DATE", "dataField": "ddate", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
            { "idsName": "IDS_TIMEZONE", "dataField": "ntzddate", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
            { "idsName": "IDS_DESCRIPTION", "dataField": "sdescription", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" }
        ];

        if(this.props.screenName === "IDS_USERBASEDHOLIDAYS"){
            this.mandatoryPublicHolidaysColumns.push({ "idsName": "IDS_USER", "dataField": "nusercode", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" })
        }

  

        const addYearVersionId = this.props.controlMap.has("AddHolidayYearVersion") && this.props.controlMap.get("AddHolidayYearVersion").ncontrolcode

        // const deleteYearVersionId = this.props.controlMap.has("DeleteHolidayYearVersion") && this.props.controlMap.get("DeleteHolidayYearVersion").ncontrolcode


        // const addCommonHolidaysId = this.props.controlMap.has("AddCommonHolidays") && this.props.controlMap.get("AddCommonHolidays").ncontrolcode
        // const editCommonHolidaysId = this.props.controlMap.has("EditCommonHolidays") && this.props.controlMap.get("EditCommonHolidays").ncontrolcode;
        // const deleteCommonHolidaysId = this.props.controlMap.has("DeleteCommonHolidays") && this.props.controlMap.get("DeleteCommonHolidays").ncontrolcode

        // const addPublicHolidaysId = this.props.controlMap.has("AddPublicHolidays") && this.props.controlMap.get("AddPublicHolidays").ncontrolcode
        // const editPublicHolidaysId = this.props.controlMap.has("EditPublicHolidays") && this.props.controlMap.get("EditPublicHolidays").ncontrolcode;
        // const deletePublicHolidaysId = this.props.controlMap.has("DeletePublicHolidays") && this.props.controlMap.get("DeletePublicHolidays").ncontrolcode

        const AddYearVersionParam = {
            screenName: "HolidayYearVersion", operation: "create",
            inputParam: this.props.inputParam, userInfo: this.props.userInfo, ncontrolCode: addYearVersionId,
            saveType: 1
        };

        const mandatoryFields = [];
        if (this.props.screenName === "IDS_PUBLICHOLIDAYS"||this.props.screenName === "IDS_USERBASEDHOLIDAYS") {
            this.mandatoryPublicHolidaysColumns.forEach(item => item.mandatory === true ?
                mandatoryFields.push(item) : ""
            );
        } 
        return (
            <>
                {/* <Row className="no-gutters">
                    <Col md={12}> */}
                <Card className="at-tabs border-0">
                    <Row noGutters={true} >
                        <Col md={12}>
                            <div className="d-flex justify-content-end">
                                {/* <ReactTooltip place="bottom" globalEventOff='click' /> */}
                                <Nav.Link className="add-txt-btn"
                                    // data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_ADDVERSION" })}
                                    hidden={this.props.userRoleControlRights.indexOf(addYearVersionId) === -1}
                                    onClick={(e) => this.addVersion(AddYearVersionParam)}
                                >
                                    <FontAwesomeIcon icon={faPlus} /> { }
                                    <FormattedMessage id='IDS_VERSION' defaultMessage='Version' />
                                </Nav.Link>
                            </div>
                        </Col>
                    </Row>

                    {/* <Row className="no-gutters text-right border-bottom pt-2 pb-2" > */}
                    {/* <Col md={4}> */}
                    {/* <Nav.Link className="add-txt-btn"
                                        onClick={(e) => this.addVersion(AddYearVersionParam)}
                                    >
                                        <FontAwesomeIcon icon={faPlus} /> { }
                                        <FormattedMessage id='IDS_ADDVERSION' defaultMessage='Add Version' />
                                    </Nav.Link> */}
                    {/* </Col> */}
                    {/* </Row> */}
                    <Row className="no-gutters">
                        <Col md={12}>
                            {this.props.masterData.YearVersion && this.props.masterData.YearVersion.length > 0 ?
                                <CustomAccordion key="filter"
                                    accordionTitle={"sversionno"}
                                    accordionComponent={this.holidayYearVersionAccordion(this.props.masterData.YearVersion)}
                                    inputParam={{ masterData: this.props.masterData, userInfo: this.props.userInfo }}
                                    accordionClick={this.props.getCommonAndPublicHolidays}
                                    accordionPrimaryKey={"nholidayyearversion"}
                                    accordionObjectName={"version"}
                                    selectedKey={this.props.masterData.selectedYearVersion.nholidayyearversion}
                                />
                                : ""}
                        </Col>
                    </Row>
                </Card>
                {/* </Col>
                </Row> */}
                {this.props.openChildModal &&
                    <SlideOutModal show={this.props.openChildModal}
                        closeModal={this.closeModal}
                        operation={this.props.operation}
                        inputParam={this.props.inputParam}
                        screenName={this.props.screenName}
                        onSaveClick={this.onSaveClick}
                        updateStore={this.props.updateStore}
                        esign={this.props.loadEsign}
                        showSaveContinue={this.props.screenName === "IDS_PUBLICHOLIDAYS"|| this.props.screenName === "IDS_USERBASEDHOLIDAYS"? true : false}
                        validateEsign={this.validateEsign}
                        selectedRecord={this.state.selectedRecord || {}}
                        mandatoryFields={mandatoryFields}
                        addComponent={this.props.loadEsign ?
                            <Esign operation={this.props.operation}
                                onInputOnChange={this.onInputOnChange}
                                inputParam={this.props.inputParam}
                                selectedRecord={this.state.selectedRecord || {}}
                            /> :
                            this.props.screenName === "IDS_COMMONHOLIDAYS" ?
                                <AddCommonHolidays selectedRecord={this.state.selectedRecord || {}}
                                    onInputOnChange={this.onInputOnChange}
                                    inputParam={this.props.inputParam}
                                />
                                : this.props.screenName === "IDS_PUBLICHOLIDAYS" ?
                                    <AddPublicHolidays
                                        selectedRecord={this.state.selectedRecord || {}}
                                        onInputOnChange={this.onInputOnChange}
                                        handleDateChange={this.handleDateChange}
                                        onComboChange={this.onComboChange}
                                        timeZoneList={this.props.timeZoneList || []}
                                        userInfo={this.props.userInfo}
                                        minDate={new Date("01-01-" + this.props.masterData.selectedYear.syear)}
                                        maxDate={new Date("12-31-" + this.props.masterData.selectedYear.syear)}
                                    />
                                    :
                                    <AddUserBasedHolidays
                                        selectedRecord={this.state.selectedRecord || {}}
                                        onInputOnChange={this.onInputOnChange}
                                        handleDateChange={this.handleDateChange}
                                        onComboChange={this.onComboChange}
                                        timeZoneList={this.props.timeZoneList || []}
                                        userInfo={this.props.userInfo}
                                        minDate={new Date("01-01-" + this.props.masterData.selectedYear.syear)}
                                        maxDate={new Date("12-31-" + this.props.masterData.selectedYear.syear)}
                                        Users={this.props.Users}
                                    />

                        }
                    />}
            </>
        );
    }
    ConfirmDelete = (obj) => {
        this.confirmMessage.confirm("deleteMessage", this.props.intl.formatMessage({ id: "IDS_DELETE" }), this.props.intl.formatMessage({ id: "IDS_DEFAULTCONFIRMMSG" }),
            this.props.intl.formatMessage({ id: "IDS_OK" }), this.props.intl.formatMessage({ id: "IDS_CANCEL" }),
            () => this.Delete(obj));
    }

    holidayYearVersionAccordion = (yearVersion) => {
        const accordionMap = new Map();
        yearVersion.map((version) =>
            accordionMap.set(version.nholidayyearversion,
                <HolidayPlannerTabsAccordion version={version}
                    userRoleControlRights={this.props.userRoleControlRights}
                    controlMap={this.props.controlMap}
                    userInfo={this.props.userInfo}
                    sendApproveYearVersion={this.approveVersion}
                    ConfirmDelete={this.ConfirmDelete}
                    masterData={this.props.masterData}
                    // deleteRecord={this.Delete}
                    tabDetail={this.tabDetail(version)}
                    onTabChange={this.onTabChange}
                />)
        )
        return accordionMap;
    }
    tabDetail = (version) => {
        const tabMap = new Map();
        tabMap.set("IDS_COMMONHOLIDAYS", <CommonHolidaysTab userRoleControlRights={this.props.userRoleControlRights}
            controlMap={this.props.controlMap}
            inputParam={this.props.inputParam}
            userInfo={this.props.userInfo}
            screenName={"IDS_COMMONHOLIDAYS"}
            getCommonHolidays={this.sendCommonHolidays}
            masterData={this.props.masterData}
            version={version}
        />)
        tabMap.set("IDS_PUBLICHOLIDAYS", <PublicHolidaysTab userRoleControlRights={this.props.userRoleControlRights}
            controlMap={this.props.controlMap}
            inputParam={this.props.inputParam}
            userInfo={this.props.userInfo}
            screenName={"IDS_PUBLICHOLIDAYS"}
            getPublicHolidays={this.getPublicHolidays}
            masterData={this.props.masterData}
            version={version}
            dataResult={process(this.state.PublicHolidays || [], this.state.dataState)}
            dataState={this.state.dataState}
            dataStateChange={this.dataStateChange}
            publicHolidaysColumns={this.publicHolidaysColumns}
            deleteRecord={this.Delete}
            selectedId={this.props.selectedId}
        />)
        tabMap.set("IDS_USERBASEDHOLIDAYS", <UserBasedHolidays userRoleControlRights={this.props.userRoleControlRights}
            controlMap={this.props.controlMap}
            inputParam={this.props.inputParam}
            userInfo={this.props.userInfo}
            screenName={"IDS_USERBASEDHOLIDAYS"}
            getUserBasedHolidays={this.getUserBasedHolidays}
            masterData={this.props.masterData}
            version={version}
            dataResult={process(this.state.UserBasedHolidays || [], this.state.userBasedDataState)}
            dataState={this.state.userBasedDataState}
            dataStateChange={this.dataStateChangeUserBasedHolidays}
            userBasedHolidaysColumns={this.userBasedHolidaysColumns}
            deleteRecord={this.Delete}
            selectedId={this.props.selectedId}
        />)
        return tabMap;
    }
    getPublicHolidays = (inputParam) => {

        if (this.props.masterData.selectedYearVersion.ntransactionstatus === transactionStatus.DRAFT) {
            this.props.getPublicHolidays(inputParam)
        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTDRAFTVERSION" }))
        }
    }


    



    getUserBasedHolidays = (inputParam) => {

        if (this.props.masterData.selectedYearVersion.ntransactionstatus === transactionStatus.DRAFT) {
            this.props.getUserBasedHolidays(inputParam)
        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTDRAFTVERSION" }))
        }
    }

    sendCommonHolidays = (screenName, operation, masterData, userInfo, editID) => {
        // if (masterData.selectedYearVersion && masterData.selectedYearVersion.ntransactionstatus === transactionStatus.APPROVED) {
        //     toast.warn(intl.formatMessage({ id: "IDS_SELECTEDYEARVERSIONMUSTBEDRAFT" }));
        // }
        // else {
        this.props.getCommonHolidays(screenName, operation, masterData, userInfo, editID);
        // }

    }
    onComboChange = (comboData, fieldName) => {
        const selectedRecord = this.state.selectedRecord || {};
        selectedRecord[fieldName] = comboData;
        if (fieldName === "ntzddate") {
            if (comboData === null) {
                selectedRecord["ntzddate"] = 0;
                selectedRecord["stzddate"] = "";
            }
            else {
                selectedRecord["stzddate"] = comboData.label;
            }
        }
        this.setState({ selectedRecord });
    }
    onTabChange = (tabProps) => {
        const screenName = tabProps.screenName;
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { screenName }
        }
        this.props.updateStore(updateInfo);
    }
    closeModal = () => {
        let loadEsign = this.props.loadEsign;
        let openChildModal = this.props.openChildModal;
        let selectedRecord = this.props.selectedRecord;
        if (this.props.loadEsign) {
            if (this.props.operation === "delete") {
                loadEsign = false;
                openChildModal = false;
            }
            else {
                if (this.props.screenName === "HolidayYearVersion") {
                    openChildModal = false;
                }
                loadEsign = false;
            }
        }
        else {
            openChildModal = false;
            selectedRecord = {};
        }

        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { openChildModal, loadEsign, selectedRecord, selectedId: null }
        }
        this.props.updateStore(updateInfo);

    }

    handleDateChange = (dateName, dateValue) => {
        const { selectedRecord } = this.state;
        selectedRecord[dateName] = dateValue;
        this.setState({ selectedRecord });
    }
    onInputOnChange = (event) => {

        const selectedRecord = this.state.selectedRecord || {};
        if (event.target.type === 'checkbox') {
            if (event.target.name === 'ntransactionstatus') {
                selectedRecord[event.target.name] = event.target.checked === true ? transactionStatus.ACTIVE : transactionStatus.DEACTIVE;
            }
            else if (event.target.name === "agree") {
                selectedRecord[event.target.name] = event.target.checked === true ? transactionStatus.YES : transactionStatus.NO;
            }
            else {
                selectedRecord[event.target.name] = event.target.checked === true ? transactionStatus.YES : transactionStatus.NO;
            }

        }

        else {
            selectedRecord[event.target.name] = event.target.value;
        }
        this.setState({ selectedRecord });
    }

    approveVersion = (yearVersion, approveYearVersion) => {

        let inputData = [];
        inputData["userinfo"] = this.props.userInfo;
        inputData["holidayyearversion"] = { "nyearcode": yearVersion.nyearcode, "nholidayyearversion": yearVersion.nholidayyearversion, "ntransactionstatus": yearVersion.ntransactionstatus };

        const inputParam = {
            classUrl: this.props.inputParam.classUrl,
            methodUrl: "HolidayYearVersion",
            inputData: inputData,
            operation: approveYearVersion.operation
        }

        if (showEsign(this.props.esignRights, this.props.userInfo.nformcode, approveYearVersion.ncontrolCode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData: this.props.masterData },
                    openChildModal: true, screenName: approveYearVersion.screenName, operation: approveYearVersion.operation
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.crudMaster(inputParam, this.props.masterData, "openChildModal");
        }
    }


    onSaveClick = (saveType, formRef) => {

        let inputParam = {};
        let validDate = false;
        let clearSelectedRecordField=[];
        // if (this.props.masterData.selectedYearVersion && this.props.masterData.selectedYearVersion.stransdisplaystatus === intl.formatMessage({ id: "IDS_APPROVED" })) {
        //     toast.warn(intl.formatMessage({ id: "IDS_SELECTEDYEARVERSIONMUSTBEDRAFT" }));
        // }
        // else {
        if (this.props.screenName === "IDS_COMMONHOLIDAYS") {
            validDate = true;
            inputParam = this.UpdateCommonHolidays(saveType, formRef);
        }
        else if (this.props.screenName === "IDS_PUBLICHOLIDAYS") {

            let year = new Date(this.state.selectedRecord["ddate"]).getFullYear()
            validDate = String(year).length === 4 && String(year) === this.props.masterData.selectedYear.syear ? true : false;
            inputParam = this.SavePublicHolidays(saveType, formRef);

           //ALPD-5262 Holiday Planner-add publicHoliday and UserHoliday Save&Continue--> Infinate Loading...
            clearSelectedRecordField=[
                {"idsName":"IDS_DESCRIPTION","dataField":"sdescription","width":"250px","isClearField":true},
                
              ];

        }
        else if (this.props.screenName === "IDS_USERBASEDHOLIDAYS") {

            let year = new Date(this.state.selectedRecord["ddate"]).getFullYear()
            validDate = String(year).length === 4 && String(year) === this.props.masterData.selectedYear.syear ? true : false;
            inputParam = this.SaveUserBasedHolidays(saveType, formRef);
            //ALPD-5262 Holiday Planner-add publicHoliday and UserHoliday Save&Continue--> Infinate Loading...
            clearSelectedRecordField=[
                {"idsName":"IDS_DESCRIPTION","dataField":"sdescription","width":"250px","isClearField":true},
                
              ];
        }
        if (validDate) {
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
                //ALPD-5262 Holiday Planner-add publicHoliday and UserHoliday Save&Continue--> Infinate Loading...
                if (this.props.screenName === "IDS_PUBLICHOLIDAYS" || this.props.screenName === "IDS_USERBASEDHOLIDAYS")
                {
                    this.props.crudMaster(inputParam, this.props.masterData, "openChildModal","","",clearSelectedRecordField);
                }
                else
                {
                   this.props.crudMaster(inputParam, this.props.masterData, "openChildModal");
                }
            }
        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_INVALIDDATE" }))
        }
        // }
    }
    addVersion = (addParam) => {
        let inputData = [];
        inputData["userinfo"] = this.props.userInfo;
        let fieldList = ["nholidayyearversion", "nversioncode"];
        if (this.props.operation === "update") {

            inputData["holidayyearversion"] = { "nyearcode": this.props.masterData.selectedYear.nyearcode };
            fieldList.map(item => {
                return inputData["holidayyearversion"][item] = this.state.selectedRecord[item] ? this.state.selectedRecord[item] : "";
            })
        }
        else {

            inputData["holidayyearversion"] = { "nyearcode": this.props.masterData.selectedYear.nyearcode, "nversioncode": 0 };

        }
        const inputParam = {
            classUrl: this.props.inputParam.classUrl,
            methodUrl: "HolidayYearVersion",
            inputData: inputData,
            operation: "create", saveType: addParam.saveType
        }


        if (showEsign(this.props.esignRights, this.props.userInfo.nformcode, addParam.ncontrolCode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData: this.props.masterData },
                    openChildModal: true, screenName: addParam.screenName, operation: addParam.operation, saveType: addParam.saveType
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.crudMaster(inputParam, this.props.masterData, "openChildModal");
        }
        // this.props.crudMaster(inputParam, this.props.masterData);
    }
    UpdateCommonHolidays(saveType, formRef) {

        let inputData = [];
        inputData["userinfo"] = this.props.userInfo;
        let fieldList = ["nmonday", "ntuesday", "nwednesday",
            "nthursday", "nfriday", "nsaturday", "nsunday"];

        if (this.props.operation === "update") {

            inputData["commonholidays"] = {
                "nyearcode": this.props.masterData.selectedYear.nyearcode,
                "nholidayyearversion": this.props.masterData.CommonHolidays[0].nholidayyearversion, "ncommonholidaycode": this.props.masterData.CommonHolidays[0].ncommonholidaycode
            };

            fieldList.map(item => {
                return inputData["commonholidays"][item] = this.state.selectedRecord[item] ? this.state.selectedRecord[item] : "";
            })
        }

        const inputParam = {
            classUrl: this.props.inputParam.classUrl,
            methodUrl: "CommonHolidays",
            inputData: inputData,
            operation: this.props.operation, saveType, formRef
        }
        return inputParam;

    }

    SaveUserBasedHolidays(saveType, formRef) {
        let inputData = [];
        inputData["userinfo"] = this.props.userInfo;
        // let fieldList = ["npublicholidaycode", "ddate", "sdescription"];

        if (this.props.operation === "update") {

            inputData["userbasedholidays"] = {
                "nyearcode": this.props.masterData.selectedYear.nyearcode,
                "nholidayyearversion": this.props.masterData.CommonHolidays[0].nholidayyearversion
            };
            // fieldList.map(item => {
            //     return inputData["publicholidays"][item] = this.state.selectedRecord[item] ? this.state.selectedRecord[item] : "";
            // })
            inputData["userbasedholidays"]["nuserbasedholidaycode"] = this.state.selectedRecord["nuserbasedholidaycode"] ? this.state.selectedRecord["nuserbasedholidaycode"] : 0;
            inputData["userbasedholidays"]["nusercode"] = this.state.selectedRecord["nusercode"] ? this.state.selectedRecord["nusercode"].value  : -1;
            inputData["userbasedholidays"]["ddate"] = this.state.selectedRecord["ddate"] ? this.state.selectedRecord["ddate"] : 0;
            inputData["userbasedholidays"]["sdescription"] = this.state.selectedRecord["sdescription"] ? this.state.selectedRecord["sdescription"] : 0;

            inputData["userbasedholidays"]["ntzddate"] = this.state.selectedRecord["ntzddate"] ? this.state.selectedRecord["ntzddate"].value : -1;
            inputData["userbasedholidays"]["stzddate"] = this.state.selectedRecord["stzddate"] || "";
        }
        else {

            inputData["userbasedholidays"] = {
                "nyearcode": this.props.masterData.selectedYear.nyearcode,
                "nholidayyearversion": this.props.masterData.CommonHolidays[0].nholidayyearversion
            };

            // fieldList.map(item => {
            //     return inputData["publicholidays"][item] = this.state.selectedRecord[item]
            // })

            inputData["userbasedholidays"]["nuserbasedholidaycode"] = this.state.selectedRecord["nuserbasedholidaycode"] ? this.state.selectedRecord["nuserbasedholidaycode"] : 0;
            inputData["userbasedholidays"]["ddate"] = this.state.selectedRecord["ddate"] ? this.state.selectedRecord["ddate"] : 0;
            inputData["userbasedholidays"]["sdescription"] = this.state.selectedRecord["sdescription"] ? this.state.selectedRecord["sdescription"] : 0;
            inputData["userbasedholidays"]["nusercode"] = this.state.selectedRecord["nusercode"] ? this.state.selectedRecord["nusercode"].value : -1;
            inputData["userbasedholidays"]["ntzddate"] = this.state.selectedRecord["ntzddate"] ? this.state.selectedRecord["ntzddate"].value : -1;
            inputData["userbasedholidays"]["stzddate"] = this.state.selectedRecord["stzddate"] || "";
        }

        const publicHolidayDate = inputData["userbasedholidays"]["ddate"];
        //need this conversion when the datatype of the field is 'Instant'
        inputData["userbasedholidays"]["ddate"] = formatInputDate(publicHolidayDate, false);

        const inputParam = {
            classUrl: this.props.inputParam.classUrl,
            methodUrl: "UserBasedHolidays",
            inputData: inputData,
            operation: this.props.operation, saveType, formRef,
            //ALPD-5262 Holiday Planner-add publicHoliday and UserHoliday Save&Continue--> Infinate Loading...
            selectedRecord: {...this.state.selectedRecord}
        }
        return inputParam;
        //this.props.crudMaster(inputParam, this.props.masterData);
    }
    SavePublicHolidays(saveType, formRef) {
        let inputData = [];
        inputData["userinfo"] = this.props.userInfo;
        // let fieldList = ["npublicholidaycode", "ddate", "sdescription"];

        if (this.props.operation === "update") {

            inputData["publicholidays"] = {
                "nyearcode": this.props.masterData.selectedYear.nyearcode,
                "nholidayyearversion": this.props.masterData.CommonHolidays[0].nholidayyearversion
            };
            // fieldList.map(item => {
            //     return inputData["publicholidays"][item] = this.state.selectedRecord[item] ? this.state.selectedRecord[item] : "";
            // })
            inputData["publicholidays"]["npublicholidaycode"] = this.state.selectedRecord["npublicholidaycode"] ? this.state.selectedRecord["npublicholidaycode"] : 0;
            inputData["publicholidays"]["ddate"] = this.state.selectedRecord["ddate"] ? this.state.selectedRecord["ddate"] : 0;
            inputData["publicholidays"]["sdescription"] = this.state.selectedRecord["sdescription"] ? this.state.selectedRecord["sdescription"] : 0;

            inputData["publicholidays"]["ntzddate"] = this.state.selectedRecord["ntzddate"] ? this.state.selectedRecord["ntzddate"].value : -1;
            inputData["publicholidays"]["stzddate"] = this.state.selectedRecord["stzddate"] || "";
        }
        else {

            inputData["publicholidays"] = {
                "nyearcode": this.props.masterData.selectedYear.nyearcode,
                "nholidayyearversion": this.props.masterData.CommonHolidays[0].nholidayyearversion
            };

            // fieldList.map(item => {
            //     return inputData["publicholidays"][item] = this.state.selectedRecord[item]
            // })

            inputData["publicholidays"]["npublicholidaycode"] = this.state.selectedRecord["npublicholidaycode"] ? this.state.selectedRecord["npublicholidaycode"] : 0;
            inputData["publicholidays"]["ddate"] = this.state.selectedRecord["ddate"] ? this.state.selectedRecord["ddate"] : 0;
            inputData["publicholidays"]["sdescription"] = this.state.selectedRecord["sdescription"] ? this.state.selectedRecord["sdescription"] : 0;

            inputData["publicholidays"]["ntzddate"] = this.state.selectedRecord["ntzddate"] ? this.state.selectedRecord["ntzddate"].value : -1;
            inputData["publicholidays"]["stzddate"] = this.state.selectedRecord["stzddate"] || "";
        }

        const publicHolidayDate = inputData["publicholidays"]["ddate"];
        //need this conversion when the datatype of the field is 'Instant'
        inputData["publicholidays"]["ddate"] = formatInputDate(publicHolidayDate, false);

        const inputParam = {
            classUrl: this.props.inputParam.classUrl,
            methodUrl: "PublicHolidays",
            inputData: inputData,
            operation: this.props.operation, saveType, formRef,
            //ALPD-5262 Holiday Planner-add publicHoliday and UserHoliday Save&Continue--> Infinate Loading...
            selectedRecord: {...this.state.selectedRecord}
        }
        return inputParam;
        //this.props.crudMaster(inputParam, this.props.masterData);
    }
    // Delete = (e, selectedRecord, Type, methodURL,operation,screenName, ncontrolCode) => {
    Delete = (deleteParam) => {
        let inputData = [];

        if (this.props.masterData.selectedYearVersion && this.props.masterData.selectedYearVersion.ntransactionstatus !== transactionStatus.DRAFT) {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTEDYEARVERSIONMUSTBEDRAFT" }));
        }
        else {
            inputData[deleteParam.methodUrl.toLowerCase()] = deleteParam.selectedRecord;
            inputData["userinfo"] = this.props.userInfo;
            const inputParam = {
                methodUrl: deleteParam.methodUrl,
                classUrl: this.props.inputParam.classUrl,
                inputData: inputData,
                operation: "delete",
                dataState: this.state.dataState
            }
            if (showEsign(this.props.esignRights, this.props.userInfo.nformcode, deleteParam.ncontrolCode)) {
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        loadEsign: true, screenData: { inputParam, masterData: this.props.masterData },
                        openChildModal: true, screenName: deleteParam.screenName, operation: deleteParam.operation
                    }
                }
                this.props.updateStore(updateInfo);
            }
            else {
                if (showEsign(this.props.userRoleControlRights, this.props.userInfo.nformcode, deleteParam.ncontrolCode)) {
                    const updateInfo = {
                        typeName: DEFAULT_RETURN,
                        data: {
                            loadEsign: true, screenData: { inputParam, masterData: this.props.masterData },
                            openChildModal: true, screenName: deleteParam.screenName, operation: deleteParam.operation
                        }
                    }
                    this.props.updateStore(updateInfo);
                }
                else {
                    this.props.crudMaster(inputParam, this.props.masterData, "openChildModal");
                }
            }
        }
        //this.props.crudMaster(inputParam, this.props.masterData);
    }
    componentDidUpdate(previousProps) {
        if (this.props.masterData !== previousProps.masterData) {

            let selectedRecord = this.props.selectedRecord || this.state.selectedRecord;
            let { dataState,userBasedDataState } = this.state;
            if (this.props.dataState === undefined) {
                dataState = { skip: 0, take: this.props.settings ? parseInt(this.props.settings[14]) : 5 }
                userBasedDataState={...dataState}
            }
            if (this.props.operation === "create" && this.props.inputParam.saveType === 2) {

                this.props.inputParam.formRef && this.props.inputParam.formRef.current.reset();
                selectedRecord = {
                    //ALPD-5262 Holiday Planner-add publicHoliday and UserHoliday Save&Continue--> Infinate Loading...
                    //ddate: new Date(),
                     sdescription: '',
                    ntzddate: {
                        "value": this.props.userInfo.ntimezonecode,
                        "label": this.props.userInfo.stimezoneid
                    },
                    stzddate: this.props.userInfo.stimezoneid
                };
            }
            this.setState({
                YearVersion: this.props.masterData.YearVersion,
                CommonHolidays: this.props.masterData.CommonHolidays,
                CurrentYearVersion: this.props.masterData.CurrentYearVersion, 
                PublicHolidays: this.props.masterData.PublicHolidays,
                UserBasedHolidays: this.props.masterData.UserBasedHolidays,
                dataState, selectedRecord,userBasedDataState

            });
        }
        else if (this.props.selectedRecord !== previousProps.selectedRecord) {
            this.setState({ selectedRecord: this.props.selectedRecord });
        }
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
export default injectIntl(HolidayPlannerTab);