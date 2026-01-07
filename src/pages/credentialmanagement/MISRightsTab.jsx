import React, { Component } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import { process } from '@progress/kendo-data-query';
import { DEFAULT_RETURN } from '../../actions/LoginTypes';
import MISRightsTabs from './MISRightsTabs'
import CustomTabs from '../../components/custom-tabs/custom-tabs.component';
import SlideOutModal from '../../components/slide-out-modal/SlideOutModal';
import Esign from '../audittrail/Esign';
import AddDashBoardRights from './AddDashBoardRights';
import AddReportRights from './AddReportRights';
import { showEsign } from '../../components/CommonScript';
import { transactionStatus } from '../../components/Enumeration';
import AddAlertRights from './AddAlertRights';
import AddDashBoardHomeRights from './AddDashBoardHomeRights';
import AddAlertHomeRights from './AddAlertHomeRights';


class MISRightsTab extends Component {
    constructor(props) {
        super(props);
        const dataState = {
            skip: 0,
            take: 5,
        };

        const dataStateReports = {
            skip: 0,
            take: 5,
        };
        const dataStateAlert = {
            skip: 0,
            take: 5,
        };

        const dataStateHome = {
            skip: 0,
            take: 5,
        };

        const dataStateAlertHomeRIghts = {
            skip: 0,
            take: 5,
        };

        this.state = {
            isOpen: false,
            activeTab: 'IDS_DASHBOARDRIGHTS-tab',
            selectedRecord: {}, dataResult: [],
            dataState: dataState,
            dataStateReports: dataStateReports,
            dataStateAlert: dataStateAlert,
            dataStateHome: dataStateHome,
            dataStateAlertHomeRights: dataStateAlertHomeRIghts,
            listReport: [],
            listDashBoard: [],
            listAlert: [], listHome: [],lstAlertHomeRIghts:[]
        };
        //this.onMultiColumnValue = this.onMultiColumnValue.bind(this);
        // this.ProductmaholderFieldList = ['sdashboardtypename']
    }
    dataStateChange = (event) => {
        this.setState({
            dataState: event.dataState
        });
    }




    render() {
        const mandatoryFieldsDB = [
            { "mandatory": true, "idsName": "IDS_DASHBOARDTYPENAME", "dataField": "ndashboardtypecode", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" }
        ];

        const mandatoryFieldsRR = [{ "mandatory": true, "idsName": "IDS_REPORTNAME", "dataField": "nreportcode", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" }
        ];

        const mandatoryFieldsAR = [{ "mandatory": true, "idsName": "IDS_ALERTNAME", "dataField": "nsqlquerycode", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" }
        ];

        const mandatoryFieldsHR = [{ "mandatory": true, "idsName": "IDS_PAGES", "dataField": "ndashboardhomeprioritycode", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" }
        ];

        const mandatoryFieldsAHR = [{ "mandatory": true, "idsName": "IDS_ALERTNAME", "dataField": "nalerthomerightscode", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" }
    ];
        return (
            <>
                <Row className="no-gutters">
                    <Col md={12}>
                        <Card className="at-tabs">
                            <CustomTabs tabDetail={this.tabDetail()} onTabChange={this.props.onTabChange} />
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
                        selectedRecord={this.state.selectedRecord || {}}
                        mandatoryFields={this.props.screenName === "IDS_DASHBOARDRIGHTS" ? 
                        mandatoryFieldsDB : this.props.screenName === "IDS_REPORTRIGHTS" ?
                         mandatoryFieldsRR : this.props.screenName === "IDS_DASHBOARDHOMERIGHTS" ?
                          mandatoryFieldsHR : this.props.screenName === "IDS_ALERTHOMERIGHTS" ?
                          mandatoryFieldsAHR: mandatoryFieldsAR}
                        updateStore={this.props.updateStore}
                        esign={this.props.loadEsign}
                        validateEsign={this.validateEsign}
                        addComponent={this.props.loadEsign ?
                            <Esign operation={this.props.operation}
                                onInputOnChange={this.onInputOnChange}
                                inputParam={this.props.inputParam}
                                selectedRecord={this.state.selectedRecord || {}}
                            /> :
                            this.props.screenName === "IDS_DASHBOARDRIGHTS" ?
                                <AddDashBoardRights selectedRecord={this.state.selectedRecord || {}}
                                    onInputOnChange={this.onInputOnChange}
                                    onComboChange={this.onComboChange}
                                    selectedDashBoardRights={this.props.masterData.selectedDashBoardRights}
                                    DashBoardType={this.props.DashBoardType || []}
                                />
                                : this.props.screenName === "IDS_REPORTRIGHTS" ? <AddReportRights selectedRecord={this.state.selectedRecord || {}}
                                    onInputOnChange={this.onInputOnChange}
                                    onComboChange={this.onComboChange}
                                    operation={this.props.operation}
                                    selectedReportRights={this.props.masterData.selectedReportRights}
                                    Reports={this.props.Reports}
                                /> :
                                    this.props.screenName === "IDS_DASHBOARDHOMERIGHTS" ?
                                        <AddDashBoardHomeRights selectedRecord={this.state.selectedRecord || {}}
                                            onInputOnChange={this.onInputOnChange}
                                            onComboChange={this.onComboChange}
                                            operation={this.props.operation}
                                            selectedHomeRights={this.props.masterData.selectedHomeRights}
                                            HomeRights={this.props.HomeRights}
                                        /> :
                                        this.props.screenName === "IDS_ALERTHOMERIGHTS" ?
                                        <AddAlertHomeRights selectedRecord={this.state.selectedRecord || {}}
                                            onInputOnChange={this.onInputOnChange}
                                            onComboChange={this.onComboChange}
                                            operation={this.props.operation}
                                            selectedAlertHomeRights={this.props.masterData.selectedAlertHomeRights}
                                            AlertHomeRights={this.props.AlertHomeRights}
                                        />
                                        :
                                        <AddAlertRights selectedRecord={this.state.selectedRecord || {}}
                                            onInputOnChange={this.onInputOnChange}
                                            onComboChange={this.onComboChange}
                                            operation={this.props.operation}
                                            selectedAlertRights={this.props.masterData.selectedAlertRights}
                                            Alert={this.props.Alert}
                                        />

                        }

                    />
                }
            </>

        )

    }



    tabDetail = () => {
        const addDashBoardId = this.props.controlMap.has("AddDashBoardRights") && this.props.controlMap.get("AddDashBoardRights").ncontrolcode

        const deleteDashBoardId = this.props.controlMap.has("DeleteDashBoardRights") && this.props.controlMap.get("DeleteDashBoardRights").ncontrolcode

        const addReportId = this.props.controlMap.has("AddReportRights") && this.props.controlMap.get("AddReportRights").ncontrolcode

        const deleteReportId = this.props.controlMap.has("DeleteReportRights") && this.props.controlMap.get("DeleteReportRights").ncontrolcode

        const addAlertId = this.props.controlMap.has("AddAlertRights") && this.props.controlMap.get("AddAlertRights").ncontrolcode

        const deleteAlertId = this.props.controlMap.has("DeleteAlertRights") && this.props.controlMap.get("DeleteAlertRights").ncontrolcode

        const addHomeId = this.props.controlMap.has("AddHomeRights") && this.props.controlMap.get("AddHomeRights").ncontrolcode

        const deleteHomeId = this.props.controlMap.has("DeleteHomeRights") && this.props.controlMap.get("DeleteHomeRights").ncontrolcode

        const addAlertHomeId = this.props.controlMap.has("AddAlertHomeRights") && this.props.controlMap.get("AddAlertHomeRights").ncontrolcode

        const deleteAlertHomeId = this.props.controlMap.has("DeleteAlertHomeRights") && this.props.controlMap.get("DeleteAlertHomeRights").ncontrolcode



        const dboardAddParam = {
            screenName: "IDS_DASHBOARDRIGHTS", operation: "create", primaryKeyField: "ndashboardtranscode",
            masterData: this.props.masterData, userInfo: this.props.userInfo, ncontrolCode: addDashBoardId
        };

        const dboardDeleteParam = { screenName: "IDS_DASHBOARDRIGHTS", methodUrl: "DashBoardRights", operation: "delete", ncontrolCode: deleteDashBoardId };

        const reportAddParam = {
            screenName: "IDS_REPORTRIGHTS", operation: "create", primaryKeyField: "nmaterialcatcode",
            masterData: this.props.masterData, userInfo: this.props.userInfo, ncontrolCode: addReportId
        };

        const reportDeleteParam = { screenName: "IDS_REPORTRIGHTS", methodUrl: "ReportRights", operation: "delete", ncontrolCode: deleteReportId };


        const alertAddParam = {
            screenName: "IDS_ALERTRIGHTS", operation: "create", primaryKeyField: "nalertrightscode",
            masterData: this.props.masterData, userInfo: this.props.userInfo, ncontrolCode: addAlertId
        };

        const alertHomeAddParam = {
            screenName: "IDS_ALERTHOMERIGHTS", operation: "create", primaryKeyField: "nalerthomerightscode",
            masterData: this.props.masterData, userInfo: this.props.userInfo, ncontrolCode: addAlertHomeId
        };

        const homeAddParam = {
            screenName: "IDS_DASHBOARDHOMERIGHTS", operation: "create", primaryKeyField: "ndashboardhomerightscode",
            masterData: this.props.masterData, userInfo: this.props.userInfo, ncontrolCode: addHomeId
        };
        const homeDeleteParam = { screenName: "IDS_DASHBOARDHOMERIGHTS", methodUrl: "HomeRights", operation: "delete", ncontrolCode: deleteHomeId };
        const alertDeleteParam = { screenName: "IDS_ALERTRIGHTS", methodUrl: "AlertRights", operation: "delete", ncontrolCode: deleteAlertId };

        const alertHomeDeleteParam = { screenName: "IDS_ALERTHOMERIGHTS", methodUrl: "AlertHomeRights", operation: "delete", ncontrolCode: deleteAlertHomeId };

        const tabMap = new Map();
        tabMap.set("IDS_REPORTRIGHTS", <MISRightsTabs userRoleControlRights={this.props.userRoleControlRights}
        controlMap={this.props.controlMap}
        inputParam={this.props.inputParam}
        userInfo={this.props.userInfo}
        addId={addReportId}
        addParam={reportAddParam}
        comboDataService={this.props.getReportRightsComboDataService}
        addTitleIDS={"IDS_REPORTRIGHTS"}
        addTitleDefaultMsg={'Report Rights'}
        primaryKeyField={"nreportrightscode"}
        masterData={this.props.masterData}
        primaryList={"ReportRights"}
        dataResult={process(this.props.masterData["ReportRights"], this.state.dataStateReports)}
        // dataState={this.state.dataStateMaterial}
        // dataStateChange={this.materialDataStateChange}
        dataState={(this.props.screenName === undefined || this.props.screenName === "IDS_REPORTRIGHTS") ? this.state.dataStateReports : { skip: 0, take: 5 }}
        dataStateChange={(event) => this.setState({ dataStateReports: event.dataState })}
        columnList={this.extractedReportList}
        methodUrl={"ReportRights"}
        deleteRecord={this.deleteRecord}
        deleteParam={reportDeleteParam}
        selectedId={0}
    />)
        tabMap.set("IDS_DASHBOARDRIGHTS", <MISRightsTabs userRoleControlRights={this.props.userRoleControlRights}
            controlMap={this.props.controlMap}
            inputParam={this.props.inputParam}
            userInfo={this.props.userInfo}
            addId={addDashBoardId}
            addParam={dboardAddParam}
            comboDataService={this.props.getDashBoardRightsComboDataService}
            addTitleIDS={"IDS_DASHBOARDRIGHTS"}
            addTitleDefaultMsg={'DashBoard Rights'}
            primaryKeyField={"ndashboardtypecode"}
            masterData={this.props.masterData}
            primaryList={"DashBoardType"}
            dataResult={process(this.props.masterData["DashBoardRights"], this.state.dataState)}
            // dataState={this.state.dataState}
            // dataStateChange={this.supplierDataStateChange}
            dataState={(this.props.screenName === undefined || this.props.screenName === "IDS_DASHBOARDRIGHTS") ? this.state.dataState : { skip: 0, take: 5 }}
            dataStateChange={(event) => this.setState({ dataState: event.dataState })}
            columnList={this.extractedDashBoardColumnList}
            methodUrl={"DashBoardRights"}
            deleteRecord={this.deleteRecord}
            deleteParam={dboardDeleteParam}
            selectedId={0}
            onChangeHomeChart={this.onChangeHomeChart}
        />)
        tabMap.set("IDS_DASHBOARDHOMERIGHTS", <MISRightsTabs userRoleControlRights={this.props.userRoleControlRights}
            controlMap={this.props.controlMap}
            inputParam={this.props.inputParam}
            userInfo={this.props.userInfo}
            addId={addHomeId}
            addParam={homeAddParam}
            comboDataService={this.props.getHomeRightsComboDataService}
            addTitleIDS={"IDS_DASHBOARDHOMERIGHTS"}
            addTitleDefaultMsg={'DashBoard Home Rights'}
            primaryKeyField={"ndashboardhomerightscode"}
            masterData={this.props.masterData}
            primaryList={"HomeRights"}
            dataResult={process(this.props.masterData["HomeRights"], this.state.dataStateHome)}
            // dataState={this.state.dataStateMaterial}
            // dataStateChange={this.materialDataStateChange}
            dataState={(this.props.screenName === undefined || this.props.screenName === "IDS_DASHBOARDHOMERIGHTS") ? this.state.dataStateHome : { skip: 0, take: 5 }}
            dataStateChange={(event) => this.setState({ dataStateHome: event.dataState })}
            columnList={this.extractedHomeList}
            methodUrl={"HomeRights"}
            deleteRecord={this.deleteRecord}
            deleteParam={homeDeleteParam}
            selectedId={0}
        />)
      
        tabMap.set("IDS_ALERTRIGHTS", <MISRightsTabs userRoleControlRights={this.props.userRoleControlRights}
            controlMap={this.props.controlMap}
            inputParam={this.props.inputParam}
            userInfo={this.props.userInfo}
            addId={addAlertId}
            addParam={alertAddParam}
            comboDataService={this.props.getAlertRightsComboDataService}
            addTitleIDS={"IDS_ALERTRIGHTS"}
            addTitleDefaultMsg={'Alert Rights'}
            primaryKeyField={"nalertrightscode"}
            masterData={this.props.masterData}
            primaryList={"AlertRights"}
            dataResult={process(this.props.masterData["AlertRights"], this.state.dataStateAlert)}
            // dataState={this.state.dataStateMaterial}
            // dataStateChange={this.materialDataStateChange}
            dataState={(this.props.screenName === undefined || this.props.screenName === "IDS_ALERTRIGHTS") ? this.state.dataStateAlert : { skip: 0, take: 5 }}
            dataStateChange={(event) => this.setState({ dataStateAlert: event.dataState })}
            columnList={this.extractedAlertList}
            methodUrl={"AlertRights"}
            deleteRecord={this.deleteRecord}
            deleteParam={alertDeleteParam}
            selectedId={0}
        />)
        tabMap.set("IDS_ALERTHOMERIGHTS", <MISRightsTabs userRoleControlRights={this.props.userRoleControlRights}
            controlMap={this.props.controlMap}
            inputParam={this.props.inputParam}
            userInfo={this.props.userInfo}
            addId={addAlertHomeId}
            addParam={alertHomeAddParam}
            comboDataService={this.props.getAlertHomeRightsComboDataService}
            addTitleIDS={"IDS_ALERTHOMERIGHTS"}
            addTitleDefaultMsg={'AlertHome Rights'}
            primaryKeyField={"nalerthomerightscode"}
            masterData={this.props.masterData}
            primaryList={"AlertHomeRights"}
            dataResult={process(this.props.masterData["AlertHomeRights"], this.state.dataStateAlertHomeRights)}
            // dataState={this.state.dataStateMaterial}
            // dataStateChange={this.materialDataStateChange}
            dataState={(this.props.screenName === undefined || this.props.screenName === "IDS_ALERTHOMERIGHTS") ? this.state.dataStateAlertHomeRights : { skip: 0, take: 5 }}
            dataStateChange={(event) => this.setState({ dataStateAlertHomeRights: event.dataState })}
            columnList={this.extractedAlertHomeList}
            methodUrl={"AlertHomeRights"}
            deleteRecord={this.deleteRecord}
            deleteParam={alertHomeDeleteParam}
            selectedId={0}
        />)


        return tabMap;
    }

    closeModal = () => {
        let loadEsign = this.props.loadEsign;
        let openChildModal = this.props.openChildModal;
        let selectedRecord = this.props.selectedRecord;

        if (this.props.loadEsign) {
            if (this.props.operation === "delete") {
                loadEsign = false;
                openChildModal = false;
                selectedRecord = {};

            }
            else {
                loadEsign = false;
                selectedRecord['esignpassword'] = ""
                selectedRecord['esigncomments'] = ""
                selectedRecord['esignreason']=""
            }
        }
        else {
            openChildModal = false;
            selectedRecord = {};

        }

        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { openChildModal, loadEsign,selectedRecord }
        }
        this.props.updateStore(updateInfo);

    }

    onComboChange = (comboData, fieldName) => {
        const selectedRecord = this.state.selectedRecord || {};
        selectedRecord[fieldName] = comboData;;


        if (fieldName === "ndashboardtypecode") {
            let selectedDashBoardRights = comboData;
            let listDashBoard = [];
            selectedRecord.ndashboardtypecode.map(item => {
                listDashBoard.push(item.item)
                return listDashBoard;
            })

            this.setState({ selectedRecord, selectedDashBoardRights, listDashBoard });
        }
        if (fieldName === "nreportcode") {
            let selectedReportRights = comboData;
            let listReport = [];
            selectedRecord.nreportcode.map(item => {
                listReport.push(item.item)
                return listReport;
            })
            this.setState({ selectedRecord, selectedReportRights, listReport });
        }
        if (fieldName === "nsqlquerycode") {
            let listAlert = [];
            let selectedAlertRights = comboData
            selectedRecord.nsqlquerycode.map(item => {
                listAlert.push(item.item)
                return listAlert;
            })
            this.setState({ selectedRecord, selectedAlertRights, listAlert });
        }

        if (fieldName === "nalerthomerightscode") {
            let listAlertHome = [];
            let selectedAlertHomeRights = comboData
            selectedRecord.nalerthomerightscode.map(item => {
                listAlertHome.push(item.item)
                return listAlertHome;
            })
            this.setState({ selectedRecord, selectedAlertHomeRights, listAlertHome });
        }

        if (fieldName === "ndashboardhomeprioritycode") {
            let selectedHomeRights = comboData;
            let listHome = [];
            selectedRecord.ndashboardhomeprioritycode.map(item => {
                listHome.push(item.item)
                return listHome;
            })
            this.setState({ selectedRecord, selectedHomeRights, listHome });
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
        let { isOpen, activeTab, selectedRecord, dataState, dataStateAlert, dataStateHome, dataStateReports ,dataStateAlertHomeRights} = this.state;
        let updateState = false;
        if (this.props.masterData !== previousProps.masterData) {

            isOpen = false;
            if (this.props.errorCode !== undefined && (this.state.operation === "create" || this.state.operation === "update")) {
                isOpen = true;
            }
            updateState = true
            activeTab = 'IDS_REPORTRIGHTS-tab'
            if (this.props.masterData.DashBoardRights && this.props.masterData.DashBoardRights.length < dataState.skip) {
                dataState = { skip: 0, take: 5 }
            }
            if (this.props.masterData.AlertRights && this.props.masterData.AlertRights.length < dataStateAlert.skip) {
                dataStateAlert = { skip: 0, take: 5 }
            }
            if (this.props.masterData.HomeRights && this.props.masterData.HomeRights.length < dataStateHome.skip) {
                dataStateHome = { skip: 0, take: 5 }
            }
            if (this.props.masterData.ReportRights && this.props.masterData.ReportRights.length < dataStateReports.skip) {
                dataStateReports = { skip: 0, take: 5 }
            }
            if (this.props.masterData.AlertHomeRights && this.props.masterData.AlertHomeRights.length < dataStateAlertHomeRights.skip) {
                dataStateAlertHomeRights = { skip: 0, take: 5 }
            }
        }

        if (this.props.selectedRecord !== previousProps.selectedRecord) {
            selectedRecord = this.props.selectedRecord;
            updateState = true
        }
        if (this.props.updateDataState && this.props.updateDataState !== previousProps.updateDataState) {
            updateState = true
            dataState = { skip: 0, take: 5 }
            dataStateAlert = { skip: 0, take: 5 }
            dataStateHome = { skip: 0, take: 5 }
            dataStateReports = { skip: 0, take: 5 }
            dataStateAlertHomeRights = { skip: 0, take: 5 }
        }
        if (updateState) {
            this.setState({ isOpen, activeTab, selectedRecord, dataState, dataStateAlert, dataStateHome, dataStateReports ,dataStateAlertHomeRights});
        }

    }


    onSaveClick = (saveType, formRef) => {
        //add / edit  
        let inputParam = {};

        if (this.props.screenName === "IDS_DASHBOARDRIGHTS") {
            inputParam = this.saveDashBoardRights(saveType, formRef);
        }
        else if (this.props.screenName === "IDS_REPORTRIGHTS") {
            inputParam = this.saveReportRights(saveType, formRef);
        } else if (this.props.screenName === "IDS_DASHBOARDHOMERIGHTS") {
            inputParam = this.saveHomeRights(saveType, formRef);
        }
        else if (this.props.screenName === "IDS_ALERTHOMERIGHTS") {
            inputParam = this.saveAlertHomeRights(saveType, formRef);
        }
        else {
            inputParam = this.saveAlertRights(saveType, formRef);
        }


        if (showEsign(this.props.esignRights, this.props.userInfo.nformcode, this.props.ncontrolCode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData: { ...this.props.masterData, updateDataState: true } }, saveType
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.crudMaster(inputParam, { ...this.props.masterData, updateDataState: true }, "openChildModal");
        }

    }

    saveDashBoardRights(saveType, formRef) {
        let inputData = [];
        inputData["userinfo"] = this.props.userInfo;
        let dataState = { skip: 0, take: 5 };


        inputData['dashboardrights'] = this.state.listDashBoard;


        const inputParam = {
            classUrl: "misrights",
            methodUrl: "DashBoardRights",
            inputData: inputData,
            operation: this.props.operation, saveType, formRef, dataState, searchRef: this.props.searchRef
        }
        return inputParam;
    }

    saveHomeRights(saveType, formRef) {
        let inputData = [];
        inputData["userinfo"] = this.props.userInfo;
        let dataState = { skip: 0, take: 5 };


        inputData['homeRights'] = this.state.listHome;

        const inputParam = {
            classUrl: "misrights",
            methodUrl: "HomeRights",
            inputData: inputData,
            operation: this.props.operation, saveType, formRef, dataState, searchRef: this.props.searchRef
        }
        return inputParam;
    }

    saveAlertRights(saveType, formRef) {
        let inputData = [];
        inputData["userinfo"] = this.props.userInfo;
        let dataState = { skip: 0, take: 5 };


        inputData['alertrights'] = this.state.listAlert;

        const inputParam = {
            classUrl: "misrights",
            methodUrl: "AlertRights",
            inputData: inputData,
            operation: this.props.operation, saveType, formRef, dataState, searchRef: this.props.searchRef
        }
        return inputParam;
    }

    saveAlertHomeRights(saveType, formRef) {
        let inputData = [];
        inputData["userinfo"] = this.props.userInfo;
        let dataState = { skip: 0, take: 5 };


        inputData['alerthomerights'] = this.state.listAlertHome;

        const inputParam = {
            classUrl: "misrights",
            methodUrl: "AlertHomeRights",
            inputData: inputData,
            operation: this.props.operation, saveType, formRef, dataState, searchRef: this.props.searchRef
        }
        return inputParam;
    }

    saveReportRights(saveType, formRef) {
        let inputData = [];
        inputData["userinfo"] = this.props.userInfo;
        inputData["report"] = {};
        let dataStateReports = undefined;


        inputData['reportrights'] = this.state.listReport;

        const inputParam = {
            classUrl: "misrights",
            methodUrl: "ReportRights",
            inputData: inputData,
            operation: this.props.operation, saveType, formRef, dataStateReports, searchRef: this.props.searchRef
        }
        return inputParam;
    }


    onChangeHomeChart = (event, rowItem, columnName, rowIndex, saveType) => {
        const selectedRecord = rowItem || {};
        selectedRecord[columnName] = event.target.checked === true ? transactionStatus.YES : transactionStatus.NO;
        this.saveHomeChart(selectedRecord, saveType);
    }

    saveHomeChart = (selectedRecord, saveType) => {
        let operation = "create";
        let dataState = { skip: 0, take: 5 };
        let inputData = [];
        inputData["userinfo"] = this.props.userInfo;
        inputData["UserRole"] = this.props.masterData.SelectedMIS;
        inputData["homechart"] = selectedRecord;
        inputData["nhomechartview"] = selectedRecord["nhomechartview"];

        const inputParam = {
            classUrl: "misrights",
            methodUrl: "HomeChart",
            inputData: inputData,
            operation: operation, saveType, searchRef: this.props.searchRef, dataState
        }

        this.props.crudMaster(inputParam, this.props.masterData, "openChildModal");

    }

    deleteAlertRights = (param) => {

        const inputParam = {
            classUrl: "misrights",
            methodUrl: "AlertRights",
            inputData: {
                "alertrights": param.selectedRecord,
                "userinfo": this.props.userInfo,

            },
            operation: param.operation,
            dataState: this.state.dataStateAlert,
            searchRef: this.props.searchRef,
            selectedRecord:{...this.state.selectedRecord}

        }

        return inputParam;
    }


    deleteAlertHomeRights = (param) => {

        const inputParam = {
            classUrl: "misrights",
            methodUrl: "AlertHomeRights",
            inputData: {
                "alerthomerights": param.selectedRecord,
                "userinfo": this.props.userInfo,

            },
            operation: param.operation,
            dataState: this.state.dataStateAlertHomeRIghts,
            searchRef: this.props.searchRef,
            selectedRecord:{...this.state.selectedRecord}

        }

        return inputParam;
    }

    deleteHomeRights = (param) => {

        const inputParam = {
            classUrl: "misrights",
            methodUrl: "HomeRights",
            inputData: {
                "homeRights": param.selectedRecord,
                "userinfo": this.props.userInfo,

            },
            operation: param.operation,
            dataState: this.state.dataState,
            searchRef: this.props.searchRef,
            selectedRecord:{...this.state.selectedRecord}

        }

        return inputParam;
    }


    deleteReportRights = (param) => {

        const inputParam = {
            classUrl: "misrights",
            methodUrl: "ReportRights",
            inputData: {
                "reportrights": param.selectedRecord,
                "userinfo": this.props.userInfo,

            },
            operation: param.operation,
            dataState: this.state.dataStateReports,
            searchRef: this.props.searchRef,
            selectedRecord:{...this.state.selectedRecord}
        }

        return inputParam;
    }

    deleteDashBoardRights = (param) => {

        const inputParam = {
            classUrl: "misrights",
            methodUrl: "DashBoardRights",
            inputData: {
                "dashboardrights": param.selectedRecord,
                "userinfo": this.props.userInfo,

            },
            operation: param.operation,
            dataState: this.state.dataState,
            searchRef: this.props.searchRef,
            selectedRecord:{...this.state.selectedRecord}

        }

        return inputParam;
    }


    deleteRecord = (param) => {
        let inputParam = {};
        if (param.screenName === 'IDS_DASHBOARDRIGHTS') {
            inputParam = this.deleteDashBoardRights(param);
        }
        else if (param.screenName === 'IDS_REPORTRIGHTS') {
            inputParam = this.deleteReportRights(param);
        }
        else if (param.screenName === 'IDS_DASHBOARDHOMERIGHTS') {
            inputParam = this.deleteHomeRights(param);
        }
        else if (param.screenName === 'IDS_ALERTHOMERIGHTS') {
            inputParam = this.deleteAlertHomeRights(param);
        }
        else {
            inputParam = this.deleteAlertRights(param);
        }


        if (showEsign(this.props.esignRights, this.props.userInfo.nformcode, param.ncontrolCode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData: { ...this.props.masterData, updateDataState: false } },
                    openChildModal: true, screenName: param.screenName, operation: param.operation
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.crudMaster(inputParam, { ...this.props.masterData, updateDataState: false }, "openChildModal");
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

    extractedReportList = [{ "controlType": "textbox", "idsName": "IDS_REPORTNAME", "dataField": "sreportname", "width": "200px" }
    ]
    extractedAlertList = [{ "controlType": "textbox", "idsName": "IDS_ALERTNAME", "dataField": "sscreenheader", "width": "200px" }
    ]

    extractedHomeList = [{ "controlType": "textbox", "idsName": "IDS_PAGES", "dataField": "sdashboardhomepagename", "width": "200px" }
    ]
    extractedDashBoardColumnList = [{ "controlType": "textbox", "idsName": "IDS_DASHBOARDNAME", "dataField": "sdashboardtypename", "width": "150px" },
    ]
    extractedAlertHomeList = [{ "controlType": "textbox", "idsName": "IDS_ALERTNAME", "dataField": "sscreenheader", "width": "200px" }
]
}

export default injectIntl(MISRightsTab);