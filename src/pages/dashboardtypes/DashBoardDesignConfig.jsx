import React from 'react'
import { Row, Col } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import { process } from '@progress/kendo-data-query';
import SlideOutModal from '../../components/slide-out-modal/SlideOutModal';
import { toast } from 'react-toastify';
import Esign from '../audittrail/Esign';
import { DEFAULT_RETURN } from '../../actions/LoginTypes';
import CustomTabs from '../../components/custom-tabs/custom-tabs.component';
import { designComponents, transactionStatus } from '../../components/Enumeration';
import { showEsign, formatInputDate, sortData } from '../../components/CommonScript';
import AddDesign from '../../components/add-design/add-design.component';
import ParameterMapping from '../../components/add-design/parameter-mapping.component';
import { intl } from '../../components/App';
import DashBoardDynamicControls from './DashBoardDynamicControls';
import DesignParameterTab from './DesignParameterTab';
import ParameterMappingTab from './ParameterMappingTab';
import DefaultValueTab from './DefaultValueTab';

//import AddDesign from '../dashboardtypes/AddDesign';

class DashBoardDesignConfig extends React.Component {

    constructor(props) {
        super(props);
        const dataState = {
            skip: 0,
            take: 10,
        };
        this.state = {
            isOpen: false, selectedRecord: {}, dataResult: [],
            dataState: dataState, addDesignParam: [], gridData: [],
            addMappingParam: [], mappingGridData: []
        };
        this.extractedColumnList = [
            { "idsName": "IDS_DASHBOARDNAME", "dataField": "sdashboardtypename", "width": "200px" },
            {
                "idsName": "IDS_INPUTTYPE", "dataField": "ndesigncomponentcode", "width": "200px", "listName": "designComponentList",
                "optionId": "ndesigncomponentcode", "optionValue": "sdesigncomponentname"
            },
            {
                "idsName": "IDS_PARAMETERS", "dataField": "sfieldname", "width": "300px", "listName": "reportParameterList",
                "optionId": "sqlQueryParams", "optionValue": "sqlQueryParams"
            },
            {
                "idsName": "IDS_EXISTINGLINKTABLE", "dataField": "nsqlquerycode", "width": "200px", "listName": "sqlQueryList",
                "optionId": "nsqlquerycode", "optionValue": "ssqlqueryname"
            },
            { "idsName": "IDS_DISPLAYNAME", "dataField": "sdisplayname", "width": "200px" },
            { "idsName": "IDS_DAYS", "dataField": "ndays", "width": "200px" },
            { "idsName": "IDS_MANDATORY", "dataField": "nmandatory" }
        ];
        this.gridColumnList = [
            { "idsName": "IDS_PARAMETERS", "dataField": "sfieldname", "width": "250px" },
            { "idsName": "IDS_DISPLAYNAME", "dataField": "sdisplayname", "width": "250px" },
            { "idsName": "IDS_INPUTTYPE", "dataField": "sdesigncomponentname", "width": "200px" },
            { "idsName": "IDS_DAYS", "dataField": "ndays", "width": "150px" },
        ];

        this.mappingInputFieldList = [
            {
                "idsName": "IDS_PARAMETER", "dataField": "nchilddashboarddesigncode", "listName": "childComponentList",
                "optionId": "ndashboarddesigncode", "optionValue": "sdisplayname"
            },
            {
                "idsName": "IDS_FIELDNAME", "dataField": "sfieldname", "listName": "optionalParameterList",
                "optionId": "value", "optionValue": "label"
            },
            {
                "idsName": "IDS_PARENTPARAMETER", "dataField": "nparentdashboarddesigncode", "listName": "parentComponentList",
                "optionId": "ndashboarddesigncode", "optionValue": "sdisplayname"
            },


        ];
        this.mappingGridFieldList = [
            { "idsName": "IDS_PARAMETERS", "dataField": "schildparametername", "width": "200px" },
            { "idsName": "IDS_FIELDNAME", "dataField": "sfieldname", "width": "200px" },
            { "idsName": "IDS_PARENTPARAMETER", "dataField": "sparentparametername", "width": "300px" },
            { "idsName": "IDS_ACTIONPARAMETER", "dataField": "sisactionparent", "width": "200px" }
        ];
        this.defaultValueGridFieldList = [
            { "idsName": "IDS_DISPLAYNAME", "dataField": "sdisplayname", "width": "300px" },
            { "idsName": "IDS_DEFAULTVALUE", "dataField": "sdisplaymember", "width": "300px" }
        ];
        this.detailedGridFieldList = [
            { "idsName": "IDS_FIELDNAME", "dataField": "sfieldname", "width": "200px" },
            { "idsName": "IDS_PARENTPARAMETER", "dataField": "sparentparametername", "width": "200px" },
            {
                "idsName": "IDS_ACTIONPARAMETER", "dataField": "nisactionparent", "width": "200px",
                "componentName": "switch", "switchFieldName": "nisactionparent",
                "switchStatus": transactionStatus.YES, "needRights": false, //"controlName": "DefaultTestSection"
            },

        ];
    }
    dataStateChange = (event) => {
        this.setState({
            dataResult: process(this.props.masterData["selectedDesignConfig"], event.data),
            dataState: event.data
        });
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
            }
        }
        else {
            openChildModal = false;
            selectedRecord = {};
        }

        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { openChildModal, loadEsign, selectedRecord, selectedId: null, gridData: {}, addDesignParam: {} }
        }
        this.props.updateStore(updateInfo);

    }
    render() {
        // const addDesignId = this.props.controlMap.has("AddDashBoardDesignConfig") && this.props.controlMap.get("AddDashBoardDesignConfig").ncontrolcode
        // const parameterMapId = this.props.controlMap.has("AddDashBoardParameterMapping") && this.props.controlMap.get("AddDashBoardParameterMapping").ncontrolcode;
        // const addDesignParam = {
        //     screenName: "Add Design", operation: "create", primaryKeyField: "ndashboarddesigncode",
        //     masterData: this.props.masterData, userInfo: this.props.userInfo, ncontrolCode: addDesignId
        // };
        //console.log("master data:", this.props.masterData, this.props.screenName);
        const mandatoryFields = [];

        if (this.props.screenName === "IDS_DEFAULTVALUE") {
            const fieldList = this.props.masterData.viewDashBoardDesignConfigList || [];
            fieldList.forEach(item => {
                if (item.nmandatory === transactionStatus.YES) {
                    mandatoryFields.push({ "idsName": item.sdisplayname, "dataField": item.sfieldname, "mandatoryLabel": "IDS_PROVIDE", "controlType": "textbox" })
                }
            });
        }
        //Saravanan - ALPD-6083 Dashboard types --> When config the dashboard type with default query 500 occurs.
        if (this.props.screenName === "IDS_PARAMETERMAPPING") {
            mandatoryFields.push({ "idsName": "IDS_PARAMETER", "dataField": "nchilddashboarddesigncode", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" })
            mandatoryFields.push({ "idsName": "IDS_FIELDNAME", "dataField": "sfieldname", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" })
            mandatoryFields.push({ "idsName": "IDS_PARENTPARAMETER", "dataField": "nparentdashboarddesigncode", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" })
        }


        return (
            <>
                <Row className="no-gutters">
                    <Col md={12}>
                        {/* <Card>
                            <Card.Header className="add-txt-btn">
                                <strong> <FormattedMessage id="IDS_ADDDESIGN" defaultMessage="Add Design" /></strong>
                            </Card.Header>
                            <Card.Body>                               
                                <Row className="no-gutters">
                                    <Col md={12}> */}
                        {this.props.masterData["DashBoardTypes"] &&

                            // (this.props.screenName === "" ||  this.props.screenName === "IDS_DASHBOARDTYPES")?
                            // <CustomTabs tabDetail={this.tabDetail()} activeKey="IDS_DESIGNPARAMETERS" onTabChange={this.onTabChange} />
                            // :
                            <CustomTabs tabDetail={this.tabDetail()} //activeKey={this.props.screenName}
                                onTabChange={this.onTabChange} />

                        }
                        {/* </Col>
                                </Row>
                            </Card.Body>
                        </Card> */}
                    </Col>
                </Row>
                {
                    this.props.openChildModal &&
                    <SlideOutModal show={this.props.openChildModal}
                        closeModal={this.closeModal}
                        operation={this.props.operation}
                        inputParam={this.props.inputParam}
                        screenName={this.props.screenName}
                        onSaveClick={this.onSaveClick}
                        updateStore={this.props.updateStore}
                        esign={this.props.loadEsign}
                        validateEsign={this.validateEsign}
                        selectedRecord={this.state.selectedRecord || {}}
                        mandatoryFields={mandatoryFields}
                        ignoreFormValidation={this.props.screenName === "IDS_DESIGNPARAMETERS"}
                        addComponent={this.props.loadEsign ?
                            <Esign operation={this.props.operation}
                                formatMessage={this.props.formatMessage}
                                onInputOnChange={this.onInputOnChange}
                                inputParam={this.props.inputParam}
                                selectedRecord={this.state.selectedRecord || {}}
                            />
                            :
                            this.props.screenName === "IDS_PARAMETERMAPPING" ?
                                <ParameterMapping
                                    operation={this.props.operation}
                                    parentComponentList={this.props.parentComponentList || []}
                                    childComponentList={this.props.childComponentList || []}
                                    optionalParameterList={this.state.optionalParameterList || []}
                                    onInputOnChange={this.onInputOnChangeDesign}
                                    handleChange={this.onComboChange}
                                    selectedRecord={this.state.selectedRecord || {}}
                                    addMappingParam={this.state.addMappingParam || this.props.masterData.DashBoardParameterMapping}
                                    mappingGridData={this.state.mappingGridData || this.props.masterData.DashBoardParameterMapping}
                                    addParametersInDataGrid={this.bindMappingParametersToDataGrid}
                                    deleteRecordWORights={this.unbindMappingParametersFromDataGrid}
                                    inputColumnList={this.mappingInputFieldList}
                                    mappingGridColumnList={this.mappingGridFieldList}
                                    controlMap={this.props.controlMap}
                                    userRoleControlRights={this.props.userRoleControlRights}
                                    detailedFieldList={this.detailedGridFieldList}
                                    bindActionParameter={this.bindActionParameter}
                                />
                                : this.props.screenName === "IDS_DEFAULTVALUE" ?

                                    <DashBoardDynamicControls
                                        selectedRecord={this.state.selectedRecord || {}}
                                        onInputOnChange={this.onInputOnChangeDefault}
                                        onNumericInputOnChange={this.onNumericInputOnChange}
                                        onComboChange={this.onComboChangeDefaultValue}
                                        handleDateChange={this.handleDateChange}
                                        viewDashBoardDesignConfigList={this.props.masterData.viewDashBoardDesignConfigList || []}
                                        operation={this.props.operation}
                                        userInfo={this.props.userInfo}
                                    />
                                    : this.props.screenName === "IDS_DESIGNPARAMETERS" ?
                                        <AddDesign
                                            designName={this.props.masterData.selectedDashBoardTypes.sdashboardtypename}
                                            gridPrimaryKey={"ndesigncomponentcode"}
                                            operation={this.props.operation}
                                            //selectedReportMaster={this.props.Login.masterData.SelectedReportMaster || {}}
                                            reportParameterList={this.props.sqlQueryForParams || []}
                                            designComponentList={this.props.designComponents || []}
                                            sqlQueryList={this.props.sqlQueryForExistingLinkTable || []}
                                            onInputOnChange={this.onInputOnChangeDesign}
                                            handleChange={this.handleChangeDesign}
                                            selectedRecord={this.state.selectedRecord || {}}
                                            //handleChange={this.handleChangeDesign}
                                            addDesignParam={this.state.addDesignParam || []}
                                            gridData={this.state.gridData || []}
                                            addParametersInDataGrid={this.addParametersInDataGrid}
                                            deleteRecordWORights={this.removeParametersInDataGrid}
                                            inputColumnList={this.extractedColumnList}
                                            gridColumnList={this.gridColumnList}
                                            controlMap={this.props.controlMap}
                                            userRoleControlRights={this.props.userRoleControlRights}
                                        />
                                        :
                                        <></>
                        }

                    />
                }
            </>
        )

    }

    // onTabChange = (tabProps) => {
    //     const screenName = tabProps.name;
    //     const updateInfo = {
    //         typeName: DEFAULT_RETURN,
    //         data: { screenName }
    //     }
    //     if (screenName === "IDS_DEFAULTVALUE") {
    //         this.props.showDefaultValueInDataGrid(
    //             this.props.masterData.selectedDashBoardTypes,
    //             this.props.userInfo,
    //             this.props.masterData)
    //     }
    //     this.props.updateStore(updateInfo);
    // }

    onTabChange = (tabProps) => {
        const screenName = tabProps.screenName;
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { screenName }
        }
        this.props.updateStore(updateInfo);
    }


    tabDetail = () => {
        const tabMap = new Map();

        tabMap.set("IDS_DESIGNPARAMETERS",
            <DesignParameterTab
                masterData={this.props.masterData}
                dataResult={sortData(this.props.masterData["selectedDesignConfig"] || [], "ascending", "ndashboarddesigncode")}
                dataState={{
                    skip: 0, take: this.props.masterData["selectedDesignConfig"]
                        ? this.props.masterData["selectedDesignConfig"].length : 10
                }}

                // dataState={this.state.dataState}
                //dataStateChange={this.dataStateChange}
                extractedColumnList={this.gridColumnList}
                controlMap={this.props.controlMap}
                userRoleControlRights={this.props.userRoleControlRights}
                inputParam={this.props.inputParam}
                userInfo={this.props.userInfo}
                //selectedId={this.props.selectedId}
                getAddDashboardDesign={this.props.getAddDashboardDesign}
                name="IDS_DESIGNPARAMETERS"

            />)

        tabMap.set("IDS_PARAMETERMAPPING",
            <ParameterMappingTab
                masterData={this.props.masterData}
                dataResult={this.props.masterData["DashBoardParameterMapping"] || []}
                dataState={{
                    skip: 0, take: this.props.masterData["DashBoardParameterMapping"]
                        ? this.props.masterData["DashBoardParameterMapping"].length : 0
                }}
                // dataState={this.state.dataState}
                // dataStateChange={this.dataStateChange}
                extractedColumnList={this.mappingGridFieldList}
                controlMap={this.props.controlMap}
                userRoleControlRights={this.props.userRoleControlRights}
                inputParam={this.props.inputParam}
                userInfo={this.props.userInfo}
                // selectedId={this.props.selectedId} 
                getDashBoardParameterMappingComboService={this.props.getDashBoardParameterMappingComboService}
                name="IDS_PARAMETERMAPPING"
            />);
        tabMap.set("IDS_DEFAULTVALUE",
            <DefaultValueTab
                masterData={this.props.masterData}
                // dataResult={this.state["dashBoardDefaultValue"] || []}
                // dataState={{skip:0, take: this.state["dashBoardDefaultValue"] 
                //     ? this.state["dashBoardDefaultValue"].length:0}}     
                dataResult={sortData(this.props.masterData["DashboardDesignDefaultList"] || [], "ascending", "ndashboarddesigncode")}
                dataState={{
                    skip: 0, take: this.props.masterData["DashboardDesignDefaultList"]
                        ? this.props.masterData["DashboardDesignDefaultList"].length : 0
                }}
                // dataState={this.state.dataState}
                extractedColumnList={this.defaultValueGridFieldList}
                controlMap={this.props.controlMap}
                userRoleControlRights={this.props.userRoleControlRights}
                inputParam={this.props.inputParam}
                userInfo={this.props.userInfo}
                //  selectedId={this.props.selectedId}  
                checkParametersAvailableForDefaultValue={this.props.checkParametersAvailableForDefaultValue}
                name="IDS_DEFAULTVALUE"

            />);
        return tabMap;
    }

    bindActionParameter = (rowItem, event) => {

        const gridMappingParam = this.state.mappingGridData;
        if (event.target.checked) {
            gridMappingParam.forEach(item => {
                if (item.nchilddashboarddesigncode === rowItem.selectedRecord.nchilddashboarddesigncode) {
                    if (item.nparentdashboarddesigncode === rowItem.selectedRecord.nparentdashboarddesigncode) {
                        return item.nisactionparent = transactionStatus.YES;
                    }
                    else {
                        return item.nisactionparent = transactionStatus.NO;
                    }
                }
            })

        }
        else {
            const index = gridMappingParam.findIndex(item => item.nchilddashboarddesigncode === rowItem.selectedRecord.nchilddashboarddesigncode
                && item.nparentdashboarddesigncode === rowItem.selectedRecord.nparentdashboarddesigncode);
            gridMappingParam[index]["nisactionparent"] = transactionStatus.NO
        }


        this.setState({ mappingGridData: gridMappingParam });
    }

    unbindMappingParametersFromDataGrid = (selectedItem) => {

        const addMappingParamNew = this.state.addMappingParam.filter(item => {
            if (typeof item.nchilddashboarddesigncode === "number") {
                if (item.nchilddashboarddesigncode === selectedItem.nchilddashboarddesigncode) {
                    return (item.nparentdashboarddesigncode !== selectedItem.nparentdashboarddesigncode)
                }
                else
                    return item;
            }
            else {
                if (item.nchilddashboarddesigncode.value === selectedItem.nchilddashboarddesigncode) {
                    return (item.nparentdashboarddesigncode.value !== selectedItem.nparentdashboarddesigncode)
                }
                else
                    return item;
            }
        });
        const mappingGridDataNew = this.state.mappingGridData.filter(item => {
            if (typeof item.nchilddashboarddesigncode === "number") {
                if (item.nchilddashboarddesigncode === selectedItem.nchilddashboarddesigncode) {
                    return (item.nparentdashboarddesigncode !== selectedItem.nparentdashboarddesigncode)
                }
                else
                    return item;
            }
            else {
                if (item.nchilddashboarddesigncode.value === selectedItem.nchilddashboarddesigncode) {
                    return (item.nparentdashboarddesigncode.value !== selectedItem.nparentdashboarddesigncode)
                }
                else
                    return item;
            }
        });

        this.setState({ addMappingParam: addMappingParamNew, mappingGridData: mappingGridDataNew });

    }

    bindMappingParametersToDataGrid = (selectedRecord) => {

        if (selectedRecord["sfieldname"] && selectedRecord["nparentdashboarddesigncode"]
            && selectedRecord["nchilddashboarddesigncode"]) {
            if (selectedRecord && selectedRecord.nparentdashboarddesigncode !== undefined) {
                let copySelected = { ...selectedRecord };

                const addMappingParam = this.state.addMappingParam;
                const index = addMappingParam.findIndex(item =>
                    item.nparentdashboarddesigncode === copySelected.nparentdashboarddesigncode.value
                    && item.nchilddashboarddesigncode === copySelected.nchilddashboarddesigncode.value
                    && item.sfieldname === copySelected.sfieldname.value);
                if (index === -1) {
                    addMappingParam.push(copySelected);
                    const mappingGridData = this.state.mappingGridData;;
                    mappingGridData.push({
                        nparentdashboarddesigncode: copySelected.nparentdashboarddesigncode.value,
                        nchilddashboarddesigncode: copySelected.nchilddashboarddesigncode.value,
                        sparentparametername: copySelected.nparentdashboarddesigncode.label,
                        schildparametername: copySelected.nchilddashboarddesigncode.label,
                        sfieldname: copySelected.sfieldname.value,
                        nactionparameter: transactionStatus.NO
                    })

                    this.setState({
                        addMappingParam,
                        //actionGridData,
                        selectedRecord: {
                            // nactionreportdesigncode:{label:"", value:-1},
                            nparentdashboarddesigncode: { label: "", value: -1 },
                            sfieldname: { label: "", value: -1 },
                            nchilddashboarddesigncode: { label: "", value: -1 }
                        },
                        mappingGridData
                    });
                }
                else {
                    toast.warn(this.props.intl.formatMessage({ id: "IDS_DUPLICATEMAPPING" }));
                    this.setState({
                        selectedRecord: {
                            nparentdashboarddesigncode: { label: "", value: -1 },
                            sfieldname: { label: "", value: -1 },
                            nchilddashboarddesigncode: { label: "", value: -1 }
                        },
                    });
                }
            }
        }
        else {
            //toast.warn(this.props.intl.formatMessage({id:"IDS_FILLMANDATORY"}));

            if (selectedRecord["nchilddashboarddesigncode"] === undefined
                || selectedRecord["nchilddashboarddesigncode"].length === 0) {
                toast.info(`${this.props.intl.formatMessage({ id: "IDS_ENTER" })} ${this.props.intl.formatMessage({ id: "IDS_PARAMETER" })}`);
            }
            else if (selectedRecord["sfieldname"] === undefined
                || selectedRecord["sfieldname"].length === 0) {
                toast.info(`${this.props.intl.formatMessage({ id: "IDS_ENTER" })} ${this.props.intl.formatMessage({ id: "IDS_FIELDNAME" })}`);
            }
            else if (selectedRecord["nparentdashboarddesigncode"] === undefined
                || selectedRecord["nparentdashboarddesigncode"].length === 0) {
                toast.info(`${this.props.intl.formatMessage({ id: "IDS_ENTER" })} ${this.props.intl.formatMessage({ id: "IDS_PARENTPARAMETER" })}`);
            }
        }

    }

    removeParametersInDataGrid = (selectedItem) => {
        const addDesignParamNew = this.state.addDesignParam.filter
            (item => item.sfieldname !== selectedItem.sfieldname);

        const gridDataNew = this.state.gridData.filter
            (item => item.sfieldname !== selectedItem.sfieldname);

        this.setState({ addDesignParam: addDesignParamNew, gridData: gridDataNew });

    }

    addParametersInDataGrid = (selectedRecord) => {

        // if (this.state.addDesignParam.length === this.props.sqlQueryForParams.length)
        // {   
        //     toast.warn("You cannot add more than Dashboard Parameters count");
        // }
        // if  {
        let validData = false;
        if (selectedRecord["sdisplayname"] && selectedRecord["sdisplayname"].trim().length !== 0
            && selectedRecord["sfieldname"] && selectedRecord["ndesigncomponentcode"]) {
            validData = true;
            if (selectedRecord["ndesigncomponentcode"].value === designComponents.COMBOBOX) {
                if (selectedRecord["nsqlquerycode"] && selectedRecord["nsqlquerycode"].length !== 0) {
                    validData = true;
                }
                else {
                    validData = false;
                }
            }
            if (selectedRecord["ndesigncomponentcode"].value === designComponents.DATEPICKER) {
                if (selectedRecord["ndays"] && selectedRecord["ndays"].length !== 0) {
                    validData = true;
                } else {
                    validData = false;
                }
            }
        }
        if (validData) {
            if (selectedRecord && selectedRecord.sfieldname !== undefined) {

                const check = this.state.gridData.filter
                    (item => item.sfieldname === selectedRecord.sfieldname.label);

                if (check && check.length > 0) {

                    toast.warn(intl.formatMessage({ id: "IDS_PARAMETERALREADYEXIST" }));
                    return;
                }

                let copySelected = { ...selectedRecord };
                let addDesignParam = this.state.addDesignParam || [];

                addDesignParam.push(copySelected);
                const gridData = this.state.gridData;;
                gridData.push({
                    sfieldname: copySelected.sfieldname.label, sdisplayname: copySelected.sdisplayname,
                    sdesigncomponentname: copySelected.ndesigncomponentcode.label,
                    ndesigncomponentcode: copySelected.ndesigncomponentcode.value,
                    ndays: selectedRecord["ndesigncomponentcode"].value === designComponents.DATEPICKER ? copySelected.ndays : 0
                });

                this.setState({
                    addDesignParam,
                    selectedRecord: {
                        ndays: "",
                        // nsqlquerycode: { label: "", value: -1 },
                        //  sfieldname: { label: "", value: "" },
                        sdisplayname: "",
                        //  ndesigncomponentcode: { label: "", value: -1 }
                    },
                    gridData: gridData
                });
            }
        }
        else {
            if (selectedRecord["sfieldname"] === undefined ||
                selectedRecord["sfieldname"].label === "") {
                toast.info(`${this.props.intl.formatMessage({ id: "IDS_ENTER" })} ${this.props.intl.formatMessage({ id: "IDS_PARAMETERS" })}`);
            }
            else if (selectedRecord["sdisplayname"] === undefined
                || selectedRecord["sdisplayname"] === "") {
                toast.info(`${this.props.intl.formatMessage({ id: "IDS_ENTER" })} ${this.props.intl.formatMessage({ id: "IDS_DISPLAYNAME" })}`);
            }
            else if (selectedRecord["ndesigncomponentcode"] === undefined
                || selectedRecord["ndesigncomponentcode"].value === 0) {
                toast.info(`${this.props.intl.formatMessage({ id: "IDS_ENTER" })} ${this.props.intl.formatMessage({ id: "IDS_INPUTTYPE" })}`);
            }
            else {
                if (selectedRecord["ndesigncomponentcode"].value === designComponents.COMBOBOX) {
                    if (selectedRecord["nsqlquerycode"] === undefined || selectedRecord["nsqlquerycode"].length === 0) {
                        toast.info(`${this.props.intl.formatMessage({ id: "IDS_ENTER" })} ${this.props.intl.formatMessage({ id: "IDS_EXISTINGLINKTABLE" })}`);
                    }
                }
                else if (selectedRecord["ndesigncomponentcode"].value === designComponents.DATEPICKER) {
                    if (selectedRecord["ndays"] === undefined || selectedRecord["ndays"].length === 0) {
                        toast.info(`${this.props.intl.formatMessage({ id: "IDS_ENTER" })} ${this.props.intl.formatMessage({ id: "IDS_DAYS" })}`);
                    }
                }
            }
        }
        // }

    }

    handleChangeDesign = (value, valueParam) => {

        if (value !== null) {
            const selectedRecord = this.state.selectedRecord || {};

            selectedRecord[valueParam] = value;

            this.setState({ selectedRecord });

        }
    }

    onInputOnChangeDesign = (event) => {
        const selectedRecord = this.state.selectedRecord || {};

        if (event.target.type === 'checkbox') {
            selectedRecord[event.target.name] = event.target.checked === true ? transactionStatus.YES : transactionStatus.NO;
        }
        else {
            selectedRecord[event.target.name] = event.target.value;
        }
        this.setState({ selectedRecord });
    }

    onComboChange = (comboData, fieldName) => {
        const selectedRecord = this.state.selectedRecord || {};
        if (fieldName === "nchilddashboarddesigncode") {


            selectedRecord[fieldName] = comboData;

            const sqlquery = comboData.item.ssqlquery;
            const param = [];
            const param1 = [];

            let query = sqlquery;
            while (query.indexOf("<@") !== -1 || query.indexOf("<#") !== -1) {
                let index1 = query.indexOf("<@");
                let index2 = query.indexOf("@>");
                let check = false;
                if (query.indexOf("<@") !== -1) {
                    index1 = query.indexOf("<@");
                    index2 = query.indexOf("@>");
                    check = true;
                }
                else if (query.indexOf("<#") !== -1) {
                    index1 = query.indexOf("<#");
                    index2 = query.indexOf("#>");
                }

                const parameter = query.substring(index1 + 2, index2);
                if (!param1.includes(parameter)) {
                    param.push({ label: parameter, value: parameter });
                    param1.push(parameter);
                }
                if (check) {
                    query = query.replace("<@", "").replace("@>", "");
                } else {
                    query = query.replace("<#", "").replace("#>", "");
                }

            }
            this.setState({ selectedRecord, optionalParameterList: param });

            // selectedRecord[fieldName] = comboData;

            // const sqlquery = comboData.item.ssqlquery;
            // let firstIndex = sqlquery.indexOf("P$");
            // const lastIndex = sqlquery.lastIndexOf("P$");

            // const param = [];
            // let first = sqlquery.indexOf("P$");
            // let endFirst = sqlquery.indexOf("$P");
            // do {

            //     let second = sqlquery.indexOf("P$", first + 1);
            //     let endSecond = sqlquery.indexOf("$P", endFirst + 1);
            //     const parameter = sqlquery.substring(first + 2, endFirst);
            //     param.push({ label: parameter, value: parameter });

            //     first = second;
            //     endFirst = endSecond;
            //     firstIndex = second;
            // }
            // while (firstIndex === lastIndex)

            // this.setState({ selectedRecord, optionalParameterList: param });
        }
        else {
            selectedRecord[fieldName] = comboData;
            this.setState({ selectedRecord });
        }
    }

    onNumericInputOnChange = (value, name, item) => {
        const selectedRecord = this.state.selectedRecord || {};
        selectedRecord[name] = value;

        const inputData = {
            dashboarddesignconfig: item,
            inputfielddata: {
                ...this.props.inputFieldData,
                [name]: value,
                [name.concat("_componentcode")]: item.ndesigncomponentcode,
                [name.concat("_componentname")]: item.sdesigncomponentname,

            },
            parentcode: value.toString(),
            parentid: item.ndashboarddesigncode,
            userinfo: this.props.userInfo,
            ndashboardtypecode: this.props.masterData.selectedDashBoardTypes.ndashboardtypecode,

        }
        const inputParam = {
            viewDashBoardDesignConfigList: this.props.masterData.viewDashBoardDesignConfigList,
            selectedRecord,
            inputData
        }

        this.props.getReportViewChildDataListForDashBoard(inputParam);
    }

    onInputOnChange = (event, item) => {
        const selectedRecord = this.state.selectedRecord || {};

        if (event.target.type === 'checkbox') {
            selectedRecord[event.target.name] = event.target.checked === true ? transactionStatus.YES : transactionStatus.NO;
        }
        else {
            selectedRecord[event.target.name] = event.target.value;
        }

        const inputData = {
            dashboarddesignconfig: item,
            inputfielddata: {
                ...this.props.Login.inputFieldData,
                [event.target.name]: selectedRecord[event.target.name],
                [event.target.name.concat("_componentcode")]: item.ndesigncomponentcode,
                [event.target.name.concat("_componentname")]: item.sdesigncomponentname,

            },
            parentcode: selectedRecord[event.target.name].toString(),
            parentid: item.ndashboarddesigncode,
            userinfo: this.props.Login.userInfo,
            ndashboardtypecode: this.props.Login.masterData.selectedDashBoardTypes.ndashboardtypecode,

        }
        const inputParam = {
            viewDashBoardDesignConfigList: this.props.Login.masterData.viewDashBoardDesignConfigList,
            selectedRecord,
            inputData
        }

        this.props.getReportViewChildDataListForDashBoard(inputParam);
    }

    handleDateChange = (dateName, dateValue, item) => {
        const { selectedRecord } = this.state;
        selectedRecord[dateName] = dateValue;

        const inputData = {
            dashboarddesignconfig: item,
            inputfielddata: {
                ...this.props.inputFieldData,
                [dateName]: formatInputDate(dateValue, true),
                [dateName.concat("_componentcode")]: item.ndesigncomponentcode,
                [dateName.concat("_componentname")]: item.sdesigncomponentname,

            },
            parentcode: formatInputDate(dateValue, true),
            parentid: item.ndashboarddesigncode,
            userinfo: this.props.userInfo,
            ndashboardtypecode: this.props.masterData.selectedDashBoardTypes.ndashboardtypecode,

        }
        const inputParam = {
            viewDashBoardDesignConfigList: this.props.masterData.viewDashBoardDesignConfigList,
            selectedRecord,
            inputData
        }

        this.props.getReportViewChildDataListForDashBoard(inputParam);
    }

    onInputOnChangeDefault = (event, item) => {
        const selectedRecord = this.state.selectedRecord || {};

        if (event.target.type === 'checkbox') {
            selectedRecord[event.target.name] = event.target.checked === true ? transactionStatus.YES : transactionStatus.NO;
        }
        else {
            selectedRecord[event.target.name] = event.target.value;
        }

        const inputData = {
            dashboarddesignconfig: item,
            inputfielddata: {
                ...this.props.inputFieldData,
                [event.target.name]: selectedRecord[event.target.name],
                [event.target.name.concat("_componentcode")]: item.ndesigncomponentcode,
                [event.target.name.concat("_componentname")]: item.sdesigncomponentname,

            },
            parentcode: selectedRecord[event.target.name].toString(),
            parentid: item.ndashboarddesigncode,
            userinfo: this.props.userInfo,
            ndashboardtypecode: this.props.masterData.selectedDashBoardTypes.ndashboardtypecode,

        }
        const inputParam = {
            viewDashBoardDesignConfigList: this.props.masterData.viewDashBoardDesignConfigList,
            selectedRecord,
            inputData
        }

        this.props.getReportViewChildDataListForDashBoard(inputParam);
    }

    onComboChangeDefaultValue = (comboData, fieldName, item) => {
        const selectedRecord = this.state.selectedRecord || {};
        if (comboData !== null) {

            selectedRecord[fieldName] = comboData;

            const inputData = {
                dashboarddesignconfig: item,
                inputfielddata: {
                    ...this.props.inputFieldData,
                    [fieldName]: comboData.value,
                    [fieldName.concat("_componentcode")]: item.ndesigncomponentcode,
                    [fieldName.concat("_componentname")]: item.sdesigncomponentname,

                },
                parentcode: comboData.value.toString(),
                parentid: item.ndashboarddesigncode,
                userinfo: this.props.userInfo,
                ndashboardtypecode: this.props.masterData.selectedDashBoardTypes.ndashboardtypecode,

            }
            const inputParam = {
                viewDashBoardDesignConfigList: this.props.masterData.viewDashBoardDesignConfigList,
                selectedRecord,
                inputData
            }

            this.props.getReportViewChildDataListForDashBoard(inputParam);
        }
        else {
            selectedRecord[fieldName] = "";
            this.setState({ selectedRecord });
        }

    }

    componentDidUpdate(previousProps) {
        if (this.props.masterData !== previousProps.masterData) {
            let { dataState } = this.state;
            if (this.props.dataState === undefined) {
                dataState = { skip: 0, take: 10 }
            }

            let isOpen = false;
            if (this.props.errorCode !== undefined && (this.state.operation === "create" || this.state.operation === "update")) {
                isOpen = true;
            }

            // const addDesignParam = [];
            // const gridData = [];

            // this.props.masterData.selectedDesignConfig &&
            //     this.props.masterData.selectedDesignConfig.forEach(item => {
            //         addDesignParam.push({
            //             ...item,
            //             ndesigncomponentcode: { label: item.sdesigncomponentname, value: item.ndesigncomponentcode },
            //             nsqlquerycode: { label: item.ssqlqueryname, value: item.nsqlquerycode }
            //         });
            //         gridData.push({
            //             ...item,
            //             ndesigncomponentcode: { label: item.sdesigncomponentname, value: item.ndesigncomponentcode },
            //             nsqlquerycode: { label: item.ssqlqueryname, value: item.nsqlquerycode }
            //         });
            //     });

            // const addMappingParam = [];
            // const mappingGridData = [];

            // this.props.masterData.DashBoardParameterMapping &&
            //     this.props.masterData.DashBoardParameterMapping.forEach(item => {
            //         addMappingParam.push({ ...item });
            //         mappingGridData.push({ ...item });
            //     });
            this.setState({
                isOpen, dataState,
                //addDesignParam, gridData,
                //addMappingParam, mappingGridData, 
                //dashBoardDefaultValue 
            });
        }
        if (this.props.addDesignParam !== previousProps.addDesignParam || this.props.gridData !== previousProps.gridData) {
            this.setState({
                addDesignParam: this.props.addDesignParam, gridData: this.props.gridData,
                addMappingParam: this.props.addMappingParam, mappingGridData: this.props.mappingGridData
            });
        }
        if (this.props.selectedRecord !== previousProps.selectedRecord) {
            this.setState({ selectedRecord: this.props.selectedRecord });
        }

    }

    onSaveClick = (saveType, formRef) => {
        if (this.props.screenName === "IDS_PARAMETERMAPPING") {

            //Saravanan - ALPD-6083 Dashboard types --> When config the dashboard type with default query 500 occurs.
            if (this.state.addMappingParam && this.state.addMappingParam.length === 0) {
                toast.warn(this.props.intl.formatMessage({ id: "IDS_PLEASEADDPARAMETER" }));
            }
            else {
                this.onSaveParameterMapping(saveType, formRef);
            }
            //this.onSaveParameterMapping(saveType, formRef);
        }
        else if (this.props.screenName === "IDS_DEFAULTVALUE") {
            this.onSaveClickDefaultValue(saveType, formRef);
        }
        else {
            if (this.state.addDesignParam && this.state.addDesignParam.length === 0) {
                toast.warn(this.props.intl.formatMessage({ id: "IDS_PLEASEADDPARAMETER" }));
            }
            else {
                this.onSaveClickAddDesign(saveType, formRef);
            }
        }
    }

    onSaveParameterMapping = (saveType, formRef) => {
        //Saravanan --ALPD-6083 Dashboard types --> When config the dashboard type with default query 500 occurs.
        if (this.state.mappingGridData.length > 0) {
            let operation = this.props.operation;
            let inputData = [];
            let selectedId = null;

            inputData["userinfo"] = this.props.userInfo;
            inputData["dashboardparametermapping"] = [];
            //inputData["reportparameteraction"] = [];

            this.state.mappingGridData.forEach(item => {
                inputData["dashboardparametermapping"].push({
                    "ndashboardtypecode": this.props.masterData.selectedDashBoardTypes.ndashboardtypecode,
                    "nparentdashboarddesigncode": item.nparentdashboarddesigncode,
                    "nchilddashboarddesigncode": item.nchilddashboarddesigncode,
                    "sfieldname": item.sfieldname,
                    "nisactionparent": item.nisactionparent
                });
            })

            const inputParam = {
                classUrl: this.props.inputParam.classUrl,
                methodUrl: "DashBoardParameterMapping",
                displayName: this.props.inputParam.displayName,
                inputData: inputData,
                operation: operation, saveType, formRef, dataState: undefined, selectedId
            }
            if (showEsign(this.props.userRoleControlRights, this.props.userInfo.nformcode, this.props.ncontrolCode)) {
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        loadEsign: true, screenData: { inputParam, masterData: this.props.masterData }, saveType
                        //openModal: true, screenName: this.props.intl.formatMessage({ id: this.props.Login.inputParam.displayName }),
                        ///operation: this.props.Login.operation
                    }
                }
                this.props.updateStore(updateInfo);
            }
            else {
                this.props.crudMaster(inputParam, this.props.masterData, "openChildModal");
            }
        }
    }

    onSaveClickAddDesign = (saveType, formRef) => {

        let dataState = undefined;
        let operation = this.props.operation;
        let inputData = [];
        let selectedId = null;
        let data = [];

        if (this.state.addDesignParam.length === this.props.sqlQueryForParams.length) {
            inputData["userinfo"] = this.props.userInfo;
            this.state.addDesignParam.map(item => {
                data.push({
                    "ndashboardtypecode": this.props.masterData.selectedDashBoardTypes.ndashboardtypecode,
                    "ndesigncomponentcode": item.ndesigncomponentcode && item.ndesigncomponentcode.value ? item.ndesigncomponentcode.value : item.ndesigncomponentcode,
                    "sfieldname": item.sfieldname.label && item.sfieldname.label ? item.sfieldname.label : item.sfieldname,
                    "nsqlquerycode": item.nsqlquerycode && item.nsqlquerycode.value ? item.nsqlquerycode.value : -1,
                    "sdisplayname": item.sdisplayname,
                    "ndays": item.ndays ? item.ndays : 0,
                    "nmandatory": item.nmandatory && item.nmandatory ? item.nmandatory : item.sfieldname.item.Mandatory
                });
                return null;
            })
            inputData["dashboarddesignconfig"] = data;
            inputData["ndashboardtypecode"] = this.props.masterData.selectedDashBoardTypes.ndashboardtypecode;

            const inputParam = {
                classUrl: this.props.inputParam.classUrl,
                methodUrl: "DashBoardDesignConfig",
                displayName: this.props.inputParam.displayName,
                inputData: inputData,
                operation: operation, saveType, formRef, dataState, selectedId
            }
            if (showEsign(this.props.userRoleControlRights, this.props.userInfo.nformcode, this.props.ncontrolCode)) {
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        loadEsign: true, screenData: { inputParam, masterData: this.props.masterData },
                        openChildModal: true, screenName: this.props.intl.formatMessage({ id: this.props.inputParam.displayName }),
                        operation: this.props.operation
                    }
                }
                this.props.updateStore(updateInfo);
            }
            else {
                this.props.crudMaster(inputParam, this.props.masterData, "openChildModal");
            }
        }
        else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_CONFIGUREALLPARAMETERS" }))
        }
    }

    onSaveClickDefaultValue = () => {

        // let dataState = undefined;
        // let operation = this.props.operation;
        let inputData = [];
        // let selectedId = null;
        let data = [];
        inputData["userinfo"] = this.props.userInfo;

        this.props.masterData.viewDashBoardDesignConfigList.map(item => {
            data.push({
                "ndashboarddesigncode": item.ndashboarddesigncode,
                "ndashboardtypecode": item.ndashboardtypecode,
                "ndesigncomponentcode": item.ndesigncomponentcode,
                "sfieldname": item.sfieldname,
                "nsqlquerycode": item.nsqlquerycode ? item.nsqlquerycode : -1,
                "sdisplayname": item.sdisplayname,
                "ndays": item.ndays ? item.ndays : 0,
                ////Need to check the build merge
                "sdefaultvalue": item.ndesigncomponentcode === designComponents.COMBOBOX ?
                    this.state.selectedRecord[item.sfieldname] && (this.state.selectedRecord[item.sfieldname].value ||
                        (this.state.selectedRecord[item.sfieldname].value === 0)) ? this.state.selectedRecord[item.sfieldname].value : ""
                    : this.state.selectedRecord[item.sfieldname] === undefined ? "" : this.state.selectedRecord[item.sfieldname]

            });
            return null;
        })
        inputData["dashboarddesignconfig"] = data;
        inputData["ndashboardtypecode"] = this.props.masterData.selectedDashBoardTypes.ndashboardtypecode;

        this.props.updateDashBoarddesignDefaultValue(inputData, this.props.masterData);
        // const inputParam = {
        //     classUrl: this.props.inputParam.classUrl,
        //     methodUrl: "DashBoardDesignConfig",
        //     displayName: this.props.inputParam.displayName,
        //     inputData: inputData,
        //     operation: operation, saveType, formRef, dataState, selectedId
        // }
        // if (showEsign(this.props.userRoleControlRights, this.props.userInfo.nformcode, this.props.ncontrolCode)) {
        //     const updateInfo = {
        //         typeName: DEFAULT_RETURN,
        //         data: {
        //             loadEsign: true, screenData: { inputParam, masterData: this.props.masterData },
        //             openChildModal: true, screenName: this.props.intl.formatMessage({ id: this.props.inputParam.displayName }),
        //             operation: this.props.operation
        //         }
        //     }
        //     this.props.updateStore(updateInfo);
        // }
        // else {
        //     this.props.crudMaster(inputParam, this.props.masterData, "openChildModal");
        // }

    }
}
export default injectIntl(DashBoardDesignConfig);