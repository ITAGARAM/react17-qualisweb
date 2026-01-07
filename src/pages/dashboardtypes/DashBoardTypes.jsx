import React from 'react';

import { Row, Col, Card, Nav } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import {
    callService, crudMaster, fetchRecordDashBoardType, getSqlQueryDataService,
    getSqlQueryColumns, getAddDashboardDesign, selectCheckBoxDashBoardTypes, getDashBoardParameterMappingComboService,
    updateStore, validateEsignCredential, filterColumnData, checkParametersAvailableForDefaultValue,
    getReportViewChildDataListForDashBoard, //showDefaultValueInDataGrid,
     updateDashBoarddesignDefaultValue
} from '../../actions';
import Esign from '../../pages/audittrail/Esign';
import ConfirmMessage from '../../components/confirm-alert/confirm-message.component';
import ListMaster from '../../components/list-master/list-master.component';
import { DEFAULT_RETURN } from '../../actions/LoginTypes';
import { ProductList, ContentPanel } from '../../pages/product/product.styled';
import { showEsign, getControlMap } from '../../components/CommonScript';
import SlideOutModal from '../../components/slide-out-modal/SlideOutModal';
import AddDashBoardTypes from '../../pages/dashboardtypes/AddDashBoardTypes'
import { transactionStatus, chartType } from '../../components/Enumeration';
import AddSeriesColors from '../../pages/dashboardtypes/AddSeriesColors';
//import ConfirmDialog from '../../components/confirm-alert/confirm-alert.component';
import DashBoardDesignConfig from '../../pages/dashboardtypes/DashBoardDesignConfig';
// import ReactTooltip from 'react-tooltip';

const mapStateToProps = state => {
    return ({ Login: state.Login })
}


class DashBoardTypes extends React.Component {
    constructor(props) {
        super(props)

        this.formRef = React.createRef();
        this.extractedColumnList = [];
        this.gridColumnList = [];


        const dataState = {
            skip: 0,
            take: 10,
        };
        this.state = {
            data: [], masterStatus: "", error: "", selectedRecord: {},
            dataResult: [],
            dataState: dataState,
            isOpen: false, controlMap: new Map(), userRoleControlRights: [],
            sqlQueryCode: 0, chartTypeCode: 0, chartSeries: [{ xField: [], yField: [], chartTitle: "" }],
            isChartSeries: false,
            displayColorPicker: false, color: { r: '241', g: '112', b: '19', a: '1' },
            pieCatagoryColumn: "", pieValueColumn: "",
            sqlColumns: [], xSeriesColumns: [], ySeriesColumns: [],
            sidebarview: false
        }
        this.searchRef = React.createRef();

        this.confirmMessage = new ConfirmMessage();
        
    }
    sidebarExpandCollapse = () => {
        this.setState({
            sidebarview: true
        })          
    }

    openModal = (input) => {
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                selectedRecord: {}, operation: input.operation,
                screenName: "IDS_DASHBOARDTYPES",
                openModal: true, ncontrolCode: input.ncontrolCode,
                loading: false
            }
        }
        this.props.updateStore(updateInfo);
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
            }
        }
        else {
            openModal = false;
            selectedRecord = {};
        }

        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { openModal, loadEsign, selectedRecord, selectedId: null }
        }
        this.setState({ isChartSeries: false });
        this.props.updateStore(updateInfo);

    }

    static getDerivedStateFromProps(props, state) {

        if (props.Login.masterStatus !== state.masterStatus) {
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

        let primaryKeyField = "ndashboardtypecode";

        const addId = this.props.Login.inputParam && this.state.controlMap.has("Add".concat(this.props.Login.inputParam.methodUrl))
            && this.state.controlMap.get("Add".concat(this.props.Login.inputParam.methodUrl)).ncontrolcode;

        const editId = this.props.Login.inputParam && this.state.controlMap.has("Edit".concat(this.props.Login.inputParam.methodUrl))
            && this.state.controlMap.get("Edit".concat(this.props.Login.inputParam.methodUrl)).ncontrolcode;

        const deleteId = this.props.Login.inputParam && this.state.controlMap.has("Delete".concat(this.props.Login.inputParam.methodUrl))
            && this.state.controlMap.get("Delete".concat(this.props.Login.inputParam.methodUrl)).ncontrolcode;


        const AddDashBoardtype = {
            screenName: this.props.Login.screenName, primaryKeyField, undefined, operation: "create",
            inputParam: this.props.Login.inputParam, userInfo: this.props.Login.userInfo, ncontrolCode: addId
        };
        const editParam = {
            screenName: this.props.Login.screenName, primaryKeyField: "ndashboardtypecode", operation: "update",
            inputParam: this.props.Login.inputParam, masterData: this.props.Login.masterData, userInfo: this.props.Login.userInfo, ncontrolCode: editId
        };
        // const deleteParam = { operation: "delete" };

        const filterParam = {
            inputListName: "DashBoardTypes", selectedObject: "selectedDashBoardTypes", primaryKeyField: "ndashboardtypecode",
           // fetchUrl: "dashboardtypes/getAllSelectionDashBoardTypes", 
            fetchUrl: "dashboardtypes/getDashBoardTypes",
            fecthInputObject: { userinfo: this.props.Login.userInfo },
            masterData: this.props.Login.masterData,
            searchFieldList: ["sdashboardtypename", "schartname", "ssqlqueryname"]
        };
        // console.log("Chart Property : ", this.props.ChartProperty);

        this.extractedColumnList = [
            { "idsName": "IDS_DASHBOARDNAME", "dataField": "sdashboardtypename", "width": "200px" },
            { "idsName": "IDS_INPUTTYPE", "dataField": "ndesigncomponentcode", "width": "200px" },
            { "idsName": "IDS_PARAMETERS", "dataField": "sfieldname", "width": "300px" },
            { "idsName": "IDS_EXISTINGLINKTABLE", "dataField": "nsqlquerycode", "width": "200px" },
            { "idsName": "IDS_DISPLAYNAME", "dataField": "sdisplayname", "width": "200px" },
            { "idsName": "IDS_DAYS", "dataField": "ndays", "width": "200px" }
        ];
        this.gridColumnList = [
            { "idsName": "IDS_PARAMETERS", "dataField": "sfieldname", "width": "300px" },
            { "idsName": "IDS_DISPLAYNAME", "dataField": "sdisplayname", "width": "200px" },
            { "idsName": "IDS_INPUTTYPE", "dataField": "ndesigncomponentcode", "width": "200px" },
        ];
        const mandatoryFields = [];

        mandatoryFields.push({ "idsName": "IDS_DASHBOARDTYPENAME", "dataField": "sdashboardtypename"  , "mandatoryLabel":"IDS_ENTER", "controlType": "textbox"})
        mandatoryFields.push({ "idsName": "IDS_CHARTTYPE", "dataField": "ncharttypecode" , "mandatoryLabel":"IDS_SELECT", "controlType": "selectbox" })
        mandatoryFields.push({ "idsName": "IDS_QUERY", "dataField": "nsqlquerycode" , "mandatoryLabel":"IDS_SELECT", "controlType": "selectbox" })

        const fieldList = this.props.Login.ChartProperty || [];
        fieldList.forEach(item => {
            if (item.schartpropertyname === "field") {
                mandatoryFields.push({ "idsName": "IDS_CATAEGORYFIELD", "dataField": item.schartpropertyname , "mandatoryLabel":"IDS_SELECT", "controlType": "selectbox" })
            }
            else if (item.schartpropertyname === "nameField") {
                mandatoryFields.push({ "idsName": "IDS_VALUEFIELD", "dataField": item.schartpropertyname , "mandatoryLabel":"IDS_SELECT", "controlType": "selectbox" })
            }
            else if (item.schartpropertyname === "yField") {
                mandatoryFields.push({ "idsName": "IDS_YSERIES", "dataField": "yColumnName" , "mandatoryLabel":"IDS_SELECT", "controlType": "selectbox" })
            }
            else if (item.schartpropertyname === "xField") {
                mandatoryFields.push({ "idsName": "IDS_XSERIES", "dataField": "xColumnName" , "mandatoryLabel":"IDS_SELECT", "controlType": "selectbox" })
            }
            else if (item.schartpropertyname === "xFieldBubble") {
                mandatoryFields.push({ "idsName": "IDS_XSERIES", "dataField": item.schartpropertyname , "mandatoryLabel":"IDS_SELECT", "controlType": "selectbox" })
            }
            else if (item.schartpropertyname === "yFieldBubble") {
                mandatoryFields.push({ "idsName": "IDS_YSERIES", "dataField": item.schartpropertyname , "mandatoryLabel":"IDS_SELECT", "controlType": "selectbox" })
            }
            else if (item.schartpropertyname === "sizeField") {
                mandatoryFields.push({ "idsName": "IDS_SIZEFIELD", "dataField": item.schartpropertyname , "mandatoryLabel":"IDS_SELECT", "controlType": "selectbox" })
            }
            else if (item.schartpropertyname === "categoryField") {
                mandatoryFields.push({ "idsName": "IDS_CATAEGORYFIELD", "dataField": item.schartpropertyname  , "mandatoryLabel":"IDS_SELECT", "controlType": "selectbox"})
            }
        });

   // console.log("props:", this.props.Login);
        return (
            <>
                <div className="client-listing-wrap mtop-4">
                    <Row noGutters={true}>
                        <Col md={`${!this.props.sidebarview ? '4' : "2"}`}> 
                            <ListMaster //filterColumnData ={(e)=>this.filterColumnData(e)}
                                formatMessage={this.props.intl.formatMessage}
                                screenName={this.props.intl.formatMessage({ id: "IDS_DASHBOARDTYPES" })}
                                masterData={this.props.Login.masterData || []}
                                userInfo={this.props.Login.userInfo}
                                masterList={this.props.Login.masterData.searchedData || this.props.Login.masterData.DashBoardTypes}
                                getMasterDetail={(DashBoardTypes) => this.props.selectCheckBoxDashBoardTypes(DashBoardTypes, this.props.Login.userInfo, this.props.Login.masterData)}
                                selectedMaster={this.props.Login.masterData.selectedDashBoardTypes}
                                primaryKeyField="ndashboardtypecode"
                                mainField="sdashboardtypename"
                                firstField="schartname"
                                //secondField="ssqlqueryname"
                                // isIDSField="Yes"
                                filterColumnData={this.props.filterColumnData}
                                filterParam={filterParam}
                                userRoleControlRights={this.state.userRoleControlRights}
                                addId={addId}
                                searchRef={this.searchRef}
                                reloadData={this.reloadData}
                                hidePaging={true}
                                openModal={() => this.props.fetchRecordDashBoardType(AddDashBoardtype, this.props.Login.masterData.selectedDashBoardTypes)}
                            // openModal={() => this.props.getAddDashboardDesign(this.props.Login.masterData.selectedDashBoardTypes,this.props.Login.userInfo)}
                            />
                        </Col>
                        <Col md={`${!this.props.sidebarview ? '8' : "10"}`} className="position-relative">
                            <div className="sidebar-view-btn-block">
                                <div className="sidebar-view-btn " onClick={this.props.parentFunction}>
                                    {!this.props.sidebarview ?                    
                                        <i class="fa fa-less-than"></i> :
                                        <i class="fa fa-greater-than"></i> 
                                    }
                                </div>
                            </div>
                            <ProductList className="panel-main-content">
                                {this.props.Login.masterData.DashBoardTypes && this.props.Login.masterData.DashBoardTypes.length > 0 && this.props.Login.masterData.selectedDashBoardTypes ?
                                    <Card className="border-0">
                                        <Card.Header>
                                            <Card.Title className="product-title-main">{this.props.Login.masterData.selectedDashBoardTypes.sdashboardtypename}</Card.Title>
                                            <ContentPanel className="d-flex product-category">
                                                <Col md='6' >
                                                {this.props.Login.masterData.selectedDashBoardTypes.ssqlqueryname}
                                                </Col>
                                                <Col md='6'>
                                                    <div  className="d-flex product-category" style={{ float: "right" }}>
                                                        {/* <ReactTooltip place="bottom" globalEventOff='click' id="tooltip_list_wrap" /> */}
                                                        <ProductList className="d-inline dropdown badget_menu">
                                                            <Nav.Link className="btn btn-circle outline-grey mr-2 " href="#"
                                                                hidden={this.state.userRoleControlRights.indexOf(editId) === -1}
                                                             //   data-for="tooltip_list_wrap"
                                                                onClick={() => this.props.fetchRecordDashBoardType(editParam)}

                                                                data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_EDIT" })}>
                                                                <FontAwesomeIcon icon={faPencilAlt} 
                                                                />
                                                            </Nav.Link>
                                                            <Nav.Link name="deleteDashboardType" className="btn btn-circle outline-grey mr-2"
                                                                    hidden={this.state.userRoleControlRights.indexOf(deleteId) === -1}
                                                                    data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_DELETE" })}
                                                                   // data-for="tooltip-common-wrap"
                                                                    onClick={() => this.confirmDelete( deleteId)}
                                                                >
                                                                    <FontAwesomeIcon icon={faTrashAlt} />
                                                            </Nav.Link>
                                                            {/* <Nav.Link className="btn btn-circle outline-grey mr-2 " href=""
                                                                hidden={this.state.userRoleControlRights.indexOf(deleteId) === -1} 
                                                                data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_DELETE" })}>
                                                                <ConfirmDialog
                                                                    name="deleteMessage"
                                                                    message={this.props.intl.formatMessage({ id: "IDS_DEFAULTCONFIRMMSG" })}
                                                                    doLabel={this.props.intl.formatMessage({ id: "IDS_OK" })}
                                                                    doNotLabel={this.props.intl.formatMessage({ id: "IDS_CANCEL" })}
                                                                    icon={faTrashAlt}
                                                                    // title={this.props.intl.formatMessage({ id: "IDS_DELETE" })}
                                                                    hidden={this.state.userRoleControlRights.indexOf(deleteId) === -1}
                                                                    handleClickDelete={() => this.DeleteDashBoardType("delete", deleteId)}
                                                                />
                                                            </Nav.Link> */}
                                                        </ProductList>
                                                    </div>
                                                </Col>
                                            </ContentPanel>
                                        </Card.Header>

                                        <Card.Body>
                                            <DashBoardDesignConfig
                                                operation={this.props.Login.operation}
                                                inputParam={this.props.Login.inputParam}
                                                screenName={this.props.Login.screenName}
                                                userInfo={this.props.Login.userInfo}
                                                masterData={this.props.Login.masterData}
                                                crudMaster={this.props.crudMaster}
                                                errorCode={this.props.Login.errorCode}
                                                masterStatus={this.props.Login.masterStatus}
                                                openChildModal={this.props.Login.openChildModal}
                                                updateStore={this.props.updateStore}
                                                selectedRecord={this.props.Login.selectedRecord}
                                                ncontrolCode={this.props.Login.ncontrolCode}
                                                userRoleControlRights={this.state.userRoleControlRights}
                                                esignRights={this.props.Login.userRoleControlRights}
                                                screenData={this.props.Login.screenData}
                                                validateEsignCredential={this.props.validateEsignCredential}
                                                loadEsign={this.props.Login.loadEsign}
                                                controlMap={this.state.controlMap}
                                                showAccordian={this.state.showAccordian}
                                                selectedId={this.props.Login.selectedId}
                                                designComponents={this.props.Login.designComponents || []}
                                                sqlQueryForParams={this.props.Login.sqlQueryForParams || []}
                                                sqlQueryForExistingLinkTable={this.props.Login.sqlQueryForExistingLinkTable || []}
                                                getAddDashboardDesign={this.props.getAddDashboardDesign}
                                                getDashBoardParameterMappingComboService={this.props.getDashBoardParameterMappingComboService}
                                                parentComponentList={this.props.Login.parentComponentList}
                                                childComponentList={this.props.Login.childComponentList}
                                                checkParametersAvailableForDefaultValue={this.props.checkParametersAvailableForDefaultValue}
                                                getReportViewChildDataListForDashBoard={this.props.getReportViewChildDataListForDashBoard}
                                                showDefaultValueInDataGrid={this.props.showDefaultValueInDataGrid}
                                                updateDashBoarddesignDefaultValue={this.props.updateDashBoarddesignDefaultValue}
                                           
                                                addDesignParam ={this.state.addDesignParam}
                                                gridData={this.state.gridData}
                                                addMappingParam={this.state.addMappingParam}
                                                mappingGridData={this.state.mappingGridData}
                                           />
                                        </Card.Body>
                                    </Card> : ""}
                            </ProductList>
                        </Col>
                    </Row>
                </div>
                {this.props.Login.openModal &&
                    <SlideOutModal show={this.props.Login.openModal}
                        closeModal={this.closeModal}
                        operation={this.props.Login.operation}
                        inputParam={this.props.Login.inputParam}
                        screenName={this.props.Login.screenName}
                        onSaveClick={this.onSaveClick}
                        esign={this.props.Login.loadEsign}
                        validateEsign={this.validateEsign}
                        masterStatus={this.props.Login.masterStatus}
                        updateStore={this.props.updateStore}
                        selectedRecord={this.state.selectedRecord || {}}
                        mandatoryFields={mandatoryFields}
                        addComponent={this.props.Login.loadEsign ?
                            <Esign operation={this.props.Login.operation}
                                onInputOnChange={this.onInputOnChange}
                                inputParam={this.props.Login.inputParam}
                                selectedRecord={this.state.selectedRecord || {}}
                            />
                            :
                            this.state.isChartSeries === false ?
                                <AddDashBoardTypes
                                    selectedRecord={this.state.selectedRecord || {}}
                                    onInputOnChange={this.onInputOnChange}
                                    handleChange={this.handleChange}
                                    chartType={this.props.Login.chartType || []}
                                    sqlQuery={this.props.Login.sqlQuery || []}
                                    // ncharttypecode={this.props.Login.ncharttypecode || []}
                                    // nsqlquerycode={this.props.Login.nsqlquerycode || []}
                                    getSqlQueryColumns={this.getQueryColumns}
                                    extractedColumnList={this.extractedColumnList}
                                    ChartProperty={this.props.Login.ChartProperty}
                                    // SqlColumns={this.props.Login.SqlColumns || []}
                                    SqlColumns={this.state.sqlColumns || []}
                                    Value={this.props.Login.Value}
                                    operation={this.props.Login.operation}
                                    xValue={this.props.Login.xValue}
                                    yValue={this.props.Login.yValue}
                                    xSeriesColumnList={this.props.Login.xSeriesColumnList || []}
                                    ySeriesColumnList={this.props.Login.ySeriesColumnList || []}
                                />
                                :
                                <AddSeriesColors
                                    displayColorPicker={this.state.displayColorPicker}
                                    color={this.state.color}
                                    // handleChange={this.handleColorChange}
                                    ySeries={this.state.chartSeries[0].yField}

                                />


                        }
                    />
                }
            </>
        );
    }

    confirmDelete = (ncontrolCode) => {
        this.confirmMessage.confirm("deleteMessage", 
                                    this.props.intl.formatMessage({ id: "IDS_DELETE" }),
                                    this.props.intl.formatMessage({ id: "IDS_DEFAULTCONFIRMMSG" }),
                                    this.props.intl.formatMessage({ id: "IDS_OK" }), 
                                    this.props.intl.formatMessage({ id: "IDS_CANCEL" }),                                   
                                    () =>  this.DeleteDashBoardType("delete", ncontrolCode));
    };

    reloadData = () => {
        this.searchRef.current.value = "";
        const inputParam = {
            inputData: { "userinfo": this.props.Login.userInfo },
            classUrl: "dashboardtypes",
            methodUrl: "DashBoardTypes",
            displayName: "IDS_DASHBOARDTYPES",
            userInfo: this.props.Login.userInfo
        };

        this.props.callService(inputParam);
    }
    DeleteDashBoardType = (operation, ncontrolCode) => {
        let inputData = [];

        let postParam = {
            inputListName: "DashBoardTypes",
            selectedObject: "selectedDashBoardTypes",
            primaryKeyField: "ndashboardtypecode",
            primaryKeyValue: this.props.Login.masterData.selectedDashBoardTypes.ndashboardtypecode,
            fetchUrl: "dashboardtypes/getAllSelectionDashBoardTypes",
            fecthInputObject: { userinfo: this.props.Login.userInfo }
        };
        inputData["dashboardtype"] = this.props.Login.masterData.selectedDashBoardTypes;
        inputData["userinfo"] = this.props.Login.userInfo;


        const inputParam = {
            methodUrl: "DashBoardTypes",
            classUrl: "dashboardtypes",
            inputData: inputData,
            operation: "delete", postParam, searchRef: this.searchRef
        }
        const masterData = this.props.Login.masterData;
        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, ncontrolCode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData },
                    openModal: true, screenName: "DashBoardTypes", operation: "delete",
                    methodUrl: "DashBoardTypes",
                    classUrl: "dashboardtypes"
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.crudMaster(inputParam, masterData, "openModal");
        }
    }
    onSaveClick = (saveType, formRef) => {

        // console.log("Save :", this.state.chartSeries);


        let dataState = undefined;
        let operation = this.props.Login.operation;
        let inputData = [];
        let selectedId = null;
        let data = [];
        let i = 0;
        let postParam = undefined;

        if (this.state.selectedRecord["ncharttypecode"] && (this.state.selectedRecord["ncharttypecode"].value === chartType.BUBBLE)
            && this.state.isChartSeries === false) {

            if ((this.state.selectedRecord["yFieldBubble"].length !== this.state.selectedRecord["sizeField"].length) ||
                (this.state.selectedRecord["yFieldBubble"].length !== this.state.selectedRecord["categoryField"].length)) {

                toast.warn(this.props.intl.formatMessage({ id: "IDS_SERIESSHOULDBESAMELENGTH" }));
                return;
            }
            if ((this.state.selectedRecord["sizeField"].length !== this.state.selectedRecord["categoryField"].length)) {
                toast.warn(this.props.intl.formatMessage({ id: "IDS_SERIESSHOULDBESAMELENGTH" }));
                return;
            }
        }
        this.setState({ isChartSeries: true });

        if (this.state.selectedRecord["ncharttypecode"] && (this.state.selectedRecord["ncharttypecode"].value === chartType.PIECHART
            || this.state.selectedRecord["ncharttypecode"].value === chartType.DONUT)) {

            postParam = { inputListName: "DashBoardTypes", selectedObject: "selectedDashBoardTypes", primaryKeyField: "ndashboardtypecode" };
            inputData["userinfo"] = this.props.Login.userInfo;

            inputData["dashboardtype"] = { "nsitecode": this.props.Login.userInfo.nmastersitecode };
            inputData["dashboardtype"]["sdashboardtypename"] = this.state.selectedRecord["sdashboardtypename"] ? this.state.selectedRecord["sdashboardtypename"] : "";
            inputData["dashboardtype"]["nquerycode"] = this.state.selectedRecord["nsqlquerycode"] ? this.state.selectedRecord["nsqlquerycode"].value : -1;
            inputData["dashboardtype"]["ncharttypecode"] = this.state.selectedRecord["ncharttypecode"] ? this.state.selectedRecord["ncharttypecode"].value : -1;
            if (operation !== "create") {
                inputData["dashboardtype"]["ndashboardtypecode"] = this.state.selectedRecord["ndashboardtypecode"] ? this.state.selectedRecord["ndashboardtypecode"] : -1;
            }

            this.props.Login.ChartProperty.forEach(prop => {
                if (prop.schartpropertyname === "field") {
                    data.push({
                        "ndashboardtypecode": 1,
                        "nchartpropertycode": prop.nchartpropertycode, "nseries": i, "schartpropvalue": this.state.selectedRecord["field"].item.Value
                    });
                }
                else if (prop.schartpropertyname === "nameField") {
                    data.push({
                        "ndashboardtypecode": 1,
                        "nchartpropertycode": prop.nchartpropertycode, "nseries": i, "schartpropvalue": this.state.selectedRecord["nameField"].item.Value
                    });
                }
            })

            inputData["chartproptransaction"] = data;

            const inputParam = {
                classUrl: this.props.Login.inputParam.classUrl,
                //methodUrl: this.props.Login.inputParam.methodUrl,
                methodUrl: "DashBoardTypes",
                displayName: this.props.Login.inputParam.displayName,
                inputData: inputData,
                operation: operation, saveType, formRef, dataState, selectedId,
                postParam, searchRef: this.searchRef
            }
            if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolCode)) {
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        loadEsign: true, screenData: { inputParam, masterData: this.props.Login.masterData },
                        openModal: true, screenName: this.props.intl.formatMessage({ id: this.props.Login.inputParam.displayName }),
                        operation: this.props.Login.operation
                    }
                }
                this.props.updateStore(updateInfo);
            }
            else {
                this.props.crudMaster(inputParam, this.props.Login.masterData, "openModal");
            }
            this.setState({ isChartSeries: false });
        }
        else if (this.state.isChartSeries === true) {

            postParam = { inputListName: "DashBoardTypes", selectedObject: "selectedDashBoardTypes", primaryKeyField: "ndashboardtypecode" };
            inputData["userinfo"] = this.props.Login.userInfo;

            inputData["dashboardtype"] = { "nsitecode": this.props.Login.userInfo.nmastersitecode };
            inputData["dashboardtype"]["sdashboardtypename"] = this.state.selectedRecord["sdashboardtypename"] ? this.state.selectedRecord["sdashboardtypename"] : "";
            inputData["dashboardtype"]["nquerycode"] = this.state.selectedRecord["nsqlquerycode"] ? this.state.selectedRecord["nsqlquerycode"].value : -1;
            inputData["dashboardtype"]["ncharttypecode"] = this.state.selectedRecord["ncharttypecode"] ? this.state.selectedRecord["ncharttypecode"].value : -1;
            if (operation !== "create") {
                inputData["dashboardtype"]["ndashboardtypecode"] = this.state.selectedRecord["ndashboardtypecode"] ? this.state.selectedRecord["ndashboardtypecode"] : -1;
            }
            if (this.state.selectedRecord["ncharttypecode"] && this.state.selectedRecord["ncharttypecode"].value !== chartType.BUBBLE) {

                i++;
                this.props.Login.ChartProperty.forEach(prop => {

                    if (prop.schartpropertyname === "xField") {
                        data.push({
                            "ndashboardtypecode": 1,
                            "nchartpropertycode": prop.nchartpropertycode, "nseries": i, "schartpropvalue": this.state.selectedRecord["xColumnName"].item.Value
                        });
                    }
                    else if (prop.schartpropertyname === "displayName") {
                        data.push({
                            "ndashboardtypecode": 1,
                            "nchartpropertycode": prop.nchartpropertycode, "nseries": i, "schartpropvalue": this.state.selectedRecord["xColumnName"].item.Value
                        });
                    }
                })

                this.state.selectedRecord["yColumnName"] && this.state.selectedRecord["yColumnName"].map(item => {
                    i++;
                    this.props.Login.ChartProperty.forEach(prop => {
                        if (prop.schartpropertyname === "yField") {
                            data.push({
                                "ndashboardtypecode": 1,
                                "nchartpropertycode": prop.nchartpropertycode, "nseries": i, "schartpropvalue": item.item.Value
                            });
                        }
                        else if (prop.schartpropertyname === "displayName") {
                            data.push({
                                "ndashboardtypecode": 1,
                                "nchartpropertycode": prop.nchartpropertycode, "nseries": i, "schartpropvalue": item.item.Value
                            });
                        }
                        else if (prop.schartpropertyname === "areaFill") {
                            data.push({
                                "ndashboardtypecode": 1,
                                "nchartpropertycode": prop.nchartpropertycode, "nseries": i, "schartpropvalue": item.item.Color
                            });
                        }
                    });
                    return null;
                })

            }
            else {

                i++;
                this.props.Login.ChartProperty.filter((field) => field.schartpropertyname === "xFieldBubble").forEach(prop => {
                    data.push({
                        "ndashboardtypecode": 1,
                        "nchartpropertycode": prop.nchartpropertycode, "nseries": i, "schartpropvalue": this.state.selectedRecord["xFieldBubble"].item.Value
                    });
                });

                this.state.selectedRecord["sizeField"] && this.state.selectedRecord["sizeField"].forEach((item, index) => {
                    i++;
                    this.props.Login.ChartProperty.filter((field) => field.schartpropertyname !== "xFieldBubble").forEach(prop => {
                        if (prop.schartpropertyname === "colorFill") {
                            data.push({
                                "ndashboardtypecode": 1,
                                "nchartpropertycode": prop.nchartpropertycode, "nseries": i, "schartpropvalue": item.item.Color
                            });
                        }
                        else {
                            data.push({
                                "ndashboardtypecode": 1,
                                "nchartpropertycode": prop.nchartpropertycode, "nseries": i, "schartpropvalue": this.state.selectedRecord[prop.schartpropertyname][index].item.Value
                            });
                        }
                    });
                });
            }
            inputData["chartproptransaction"] = data;

            const inputParam = {
                classUrl: this.props.Login.inputParam.classUrl,
                methodUrl: "DashBoardTypes",//this.props.Login.inputParam.methodUrl,
                displayName: this.props.Login.inputParam.displayName,
                inputData: inputData,
                operation: operation, saveType, formRef, dataState, selectedId,
                postParam, searchRef: this.searchRef
            }
            if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolCode)) {
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        loadEsign: true, screenData: { inputParam, masterData: this.props.Login.masterData },
                        openModal: true, screenName: this.props.intl.formatMessage({ id: this.props.Login.inputParam.displayName }),
                        operation: this.props.Login.operation
                    }
                }
                this.props.updateStore(updateInfo);
            }
            else {
                this.props.crudMaster(inputParam, this.props.Login.masterData, "openModal");
            }
            this.setState({ isChartSeries: false });
        }
    }

    getQueryColumns = () => {
        this.props.getSqlQueryColumns(this.state.sqlQueryCode, this.state.chartTypeCode, this.props.Login.userInfo);
    }

    handleChange = (item, fieldName, isXField) => {

        if (item !== null) {
            const selectedRecord = this.state.selectedRecord || {};          
            let xSeriesColumns = this.state.xSeriesColumns || {};
            let ySeriesColumns = this.state.ySeriesColumns || {};

            if (fieldName === "ncharttypecode") {
                selectedRecord[fieldName] = item;
                selectedRecord.nsqlquerycode = "";
                this.props.getSqlQueryDataService(item.value, selectedRecord, this.props.Login.userInfo);
             //   this.setState({ chartTypeCode: item.value, selectedRecord });
            }
            else if (fieldName === "nsqlquerycode") {
                selectedRecord[fieldName] = item;
                this.props.getSqlQueryColumns(item.value, selectedRecord["ncharttypecode"].value, this.props.Login.userInfo, selectedRecord);

            }
            else {
                selectedRecord[fieldName] = item;
            }
            if (isXField !== "ChartType") {
                
                let chartSeries = [...this.state.chartSeries];
                // let index = 0;
                let newXCols = [];
                let newYCols = [];

                if (this.props.Login.SqlColumns && this.props.Login.SqlColumns.xSeriesColumns) {
                   // console.log(" xSeriesColumns 1 : ", this.props.Login.SqlColumns.xSeriesColumns);

                    if (selectedRecord["ncharttypecode"] && (selectedRecord["ncharttypecode"].value !== chartType.PIECHART
                        && selectedRecord["ncharttypecode"].value !== chartType.DONUT)) {

                        if (selectedRecord["xColumnName"] && [selectedRecord["xColumnName"]].length >= 0) {

                            newYCols = this.props.Login.SqlColumns.ySeriesColumns.filter(item => ![selectedRecord["xColumnName"].value].includes(item.value))
                        }
                        else {
                            newYCols = this.props.Login.SqlColumns.ySeriesColumns
                        }

                        if (selectedRecord["yColumnName"] && selectedRecord["yColumnName"].length >= 0) {

                            newXCols = this.props.Login.SqlColumns.xSeriesColumns.filter(item => !selectedRecord["yColumnName"].some(itemValue => itemValue.value === item.value))
                        }
                        else {
                            newXCols = this.props.Login.SqlColumns.xSeriesColumns
                        }
                        if (isXField === "xField") {
                            chartSeries[0].xField = item;
                        }
                        else if (isXField === "yField" || isXField === "sizeField") {
                            chartSeries[0].yField = item;
                        }
                    }
                    else {
                        if (selectedRecord["field"] && [selectedRecord["field"]].length >= 0) {

                            newYCols = this.props.Login.SqlColumns.ySeriesColumns.filter(item => ![selectedRecord["field"].value].includes(item.value))
                        }
                        else {
                            newYCols = this.props.Login.SqlColumns.ySeriesColumns
                        }

                        if (selectedRecord["nameField"] && [selectedRecord["nameField"]].length >= 0) {

                            newXCols = this.props.Login.SqlColumns.xSeriesColumns.filter(item => ![selectedRecord["nameField"].value].includes(item.value))
                        }
                        else {
                            newXCols = this.props.Login.SqlColumns.xSeriesColumns
                        }

                    }
                }

                this.setState({
                    selectedRecord, sqlQueryCode: item.value,
                    sqlColumns: { xSeriesColumns: newXCols, ySeriesColumns: newYCols },
                    xSeriesColumns, ySeriesColumns
                });
            }

        }
    }

    onInputOnChange = (event) => {
        const selectedRecord = this.state.selectedRecord || {};
        if (event.target.type === 'checkbox') {
            if (event.target.name === "agree") {
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

    componentDidUpdate(previousProps) {
        if (this.props.Login.masterData !== previousProps.Login.masterData) {

            if (this.props.Login.userInfo.nformcode !== previousProps.Login.userInfo.nformcode) {
                const userRoleControlRights = [];
                if (this.props.Login.userRoleControlRights) {
                    this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode] && Object.values(this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode]).map(item =>
                        userRoleControlRights.push(item.ncontrolcode))
                }
                const controlMap = getControlMap(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode)

                const addDesignParam = [];
                const gridData = [];
    
                this.props.Login.masterData.selectedDesignConfig &&
                    this.props.Login.masterData.selectedDesignConfig.forEach(item => {
                        addDesignParam.push({
                            ...item,
                            ndesigncomponentcode: { label: item.sdesigncomponentname, value: item.ndesigncomponentcode },
                            nsqlquerycode: { label: item.ssqlqueryname, value: item.nsqlquerycode }
                        });
                        gridData.push({
                            ...item,
                            ndesigncomponentcode: { label: item.sdesigncomponentname, value: item.ndesigncomponentcode },
                            nsqlquerycode: { label: item.ssqlqueryname, value: item.nsqlquerycode }
                        });
                    });
    
                const addMappingParam = [];
                const mappingGridData = [];
    
                this.props.Login.masterData.DashBoardParameterMapping &&
                    this.props.Login.masterData.DashBoardParameterMapping.forEach(item => {
                        addMappingParam.push({ ...item });
                        mappingGridData.push({ ...item });
                    });
                
                this.setState({addDesignParam, gridData,
                    addMappingParam, mappingGridData,
                    userRoleControlRights, controlMap, data: this.props.Login.masterData,
                    // dataResult: process(this.props.Login.masterData, this.state.dataState),
                });
            }
            else {
               
                const addDesignParam = [];
                const gridData = [];
    
                this.props.Login.masterData.selectedDesignConfig &&
                    this.props.Login.masterData.selectedDesignConfig.forEach(item => {
                        addDesignParam.push({
                            ...item,
                            ndesigncomponentcode: { label: item.sdesigncomponentname, value: item.ndesigncomponentcode },
                            nsqlquerycode: { label: item.ssqlqueryname, value: item.nsqlquerycode }
                        });
                        gridData.push({
                            ...item,
                            ndesigncomponentcode: { label: item.sdesigncomponentname, value: item.ndesigncomponentcode },
                            nsqlquerycode: { label: item.ssqlqueryname, value: item.nsqlquerycode }
                        });
                    });
    
                const addMappingParam = [];
                const mappingGridData = [];
    
                this.props.Login.masterData.DashBoardParameterMapping &&
                    this.props.Login.masterData.DashBoardParameterMapping.forEach(item => {
                        addMappingParam.push({ ...item });
                        mappingGridData.push({ ...item });
                    });
                              
                this.setState({  addDesignParam, gridData,
                    addMappingParam, mappingGridData,
                    data: this.props.Login.masterData, selectedRecord: this.props.Login.selectedRecord,
                    isOpen: false
                });
            }
        }
        if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord) {

            let chartSeries = [...this.state.chartSeries];

            chartSeries[0].xField = this.props.Login.selectedRecord.xColumnName;
            if (this.props.Login.selectedRecord["ncharttypecode"] && this.props.Login.selectedRecord["ncharttypecode"].value === chartType.BUBBLE) {
                chartSeries[0].yField = this.props.Login.selectedRecord.sizeField;
            }
            else {
                chartSeries[0].yField = this.props.Login.selectedRecord.yColumnName;
            }


            this.setState({ selectedRecord: this.props.Login.selectedRecord });
        }
        if (this.props.Login.SqlColumns !== previousProps.Login.SqlColumns) {
            let newXCols = [];
            let newYCols = [];

            if (this.props.Login.operation === "update") {
                if (this.props.Login.selectedRecord["ncharttypecode"] && (this.props.Login.selectedRecord["ncharttypecode"].value === chartType.PIECHART ||
                    this.props.Login.selectedRecord["ncharttypecode"].value === chartType.DONUT)) {

                    this.props.Login.selectedRecord["field"] && this.props.Login.selectedRecord["field"].value !== undefined ?

                        newYCols = this.props.Login.SqlColumns.ySeriesColumns.filter(item => ![this.props.Login.selectedRecord["field"].value].includes(item.value))
                        :
                        newYCols = this.props.Login.SqlColumns.ySeriesColumns

                    if (this.props.Login.selectedRecord["nameField"] && this.props.Login.selectedRecord["nameField"].value !== undefined) {

                        newXCols = this.props.Login.SqlColumns.xSeriesColumns.filter(item => ![this.props.Login.selectedRecord["nameField"].value].includes(item.value))
                    }
                    else {
                        newXCols = this.props.Login.SqlColumns.xSeriesColumns
                    }
                }
                else {

                    this.props.Login.selectedRecord["xColumnName"] && this.props.Login.selectedRecord["xColumnName"].value !== undefined ?

                        newYCols = this.props.Login.SqlColumns.ySeriesColumns.filter(item => ![this.props.Login.selectedRecord["xColumnName"].value].includes(item.value))
                        :
                        newYCols = this.props.Login.SqlColumns.ySeriesColumns

                    if (this.props.Login.selectedRecord["yColumnName"] && this.props.Login.selectedRecord["yColumnName"].length >= 0) {
                        newXCols = this.props.Login.SqlColumns.xSeriesColumns.filter(item => !this.props.Login.selectedRecord["yColumnName"].some(itemValue => itemValue.value === item.value))
                    }
                    else {
                        newXCols = this.props.Login.SqlColumns.xSeriesColumns
                    }

                }
                this.setState({ sqlColumns: { xSeriesColumns: newXCols, ySeriesColumns: newYCols } });
            }
            else {
                this.setState({ sqlColumns: this.props.Login.SqlColumns });
            }

        }
        if (this.props.Login.xSeriesColumns !== previousProps.Login.xSeriesColumns) {
            this.setState({ xSeriesColumns: this.props.Login.xSeriesColumns });
        }
        if (this.props.Login.ySeriesColumns !== previousProps.Login.ySeriesColumns) {
            this.setState({ ySeriesColumns: this.props.Login.ySeriesColumns });
        }
    }

    validateEsign = () => {
        const inputParam = {
            inputData: {
                "userinfo": {
                    ...this.props.Login.userInfo,
                    sreason: this.state.selectedRecord["esigncomments"],
                    nreasoncode:this.state.selectedRecord["esignreason"] && this.state.selectedRecord["esignreason"].value,
                    spredefinedreason:this.state.selectedRecord["esignreason"] && this.state.selectedRecord["esignreason"].label,
               
                },
                password: this.state.selectedRecord["esignpassword"]
            },
            screenData: this.props.Login.screenData
        }
        this.props.validateEsignCredential(inputParam, "openModal");
    }
}

export default connect(mapStateToProps,
    {
        callService, crudMaster, fetchRecordDashBoardType, selectCheckBoxDashBoardTypes, getSqlQueryDataService,
        getSqlQueryColumns, getAddDashboardDesign, getDashBoardParameterMappingComboService, updateStore,
        validateEsignCredential, filterColumnData, checkParametersAvailableForDefaultValue,
        getReportViewChildDataListForDashBoard, //showDefaultValueInDataGrid, 
        updateDashBoarddesignDefaultValue
    })(injectIntl(DashBoardTypes));