import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import {
    callService, crudMaster, fetchRecordDashBoardType, getSqlQueryDataService,
    getSqlQueryColumns, getAddDashboardDesign, selectCheckBoxDashBoardTypes,
    selectCheckBoxDashBoardView, checkParametersAvailable, getReportViewChildDataListForDashBoard,
    getAllSelectionDashBoardView,
    updateStore, validateEsignCredential, filterColumnData
} from '../../actions';
import ListMaster from '../../components/list-master/list-master.component';
import { DEFAULT_RETURN } from '../../actions/LoginTypes';
import { ProductList } from '../../pages/product/product.styled';
import { getControlMap, formatInputDate, rearrangeDateFormat ,convertDateValuetoString} from '../../components/CommonScript';
import SlideOutModal from '../../components/slide-out-modal/SlideOutModal';
import { transactionStatus, designComponents } from '../../components/Enumeration';
import AreaChart from '../dashboardtypes/charts/AreaChart';
import PieChart from '../dashboardtypes/charts/PieChart';
import DashBoardDynamicControls from '../dashboardtypes/DashBoardDynamicControls';
import { chartType } from '../../components/Enumeration';
import BubbleChart from '../dashboardtypes/charts/BubbleChart';
//import ReactTooltip from 'react-tooltip';

const mapStateToProps = state => {
    return ({ Login: state.Login })
}


class DashBoardView extends React.Component {
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
            data: [], masterStatus: "", error: "", selectedRecord: {}, selectedRecord2: {},
            dataResult: [],
            dataState: dataState,
            isOpen: false, controlMap: new Map(), userRoleControlRights: [],
            sqlQueryCode: 0, chartTypeCode: 0, chartSeries: [{ xField: [], yField: [], chartTitle: "" }],
            displayColorPicker: false, color: { r: '241', g: '112', b: '19', a: '1' },
            sidebarview: false
        }
        this.searchRef = React.createRef();
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
        let openModal = this.props.Login.openModal;
        let selectedRecord = this.props.Login.selectedRecord;
        // if (this.props.Login.loadEsign) {
        //     if (this.props.Login.operation === "delete") {
        //         loadEsign = false;
        //         openModal = false;
        //         selectedRecord = {};
        //     }
        //     else {
        //         loadEsign = false;
        //     }
        // }
        // else {
            openModal = false;
            //selectedRecord = {};
        //}

        this.props.Login.masterData.viewDashBoardDesignConfigList.map(item => {

            if (item.ndesigncomponentcode === designComponents.DATEPICKER) {
                selectedRecord[item.sfieldname] = rearrangeDateFormat(this.props.Login.userInfo,item.dataList[0])
            }
            else if (item.ndesigncomponentcode === designComponents.COMBOBOX) {
                const comboList =  item.dataList;
            
                let getList = comboList.filter(lst => {
                    return lst.value === parseInt(item.sdefaultvalue);
                });

                if (getList.length > 0) {
                    selectedRecord[item.sfieldname] = { label: getList[0].label, value: getList[0].value };

                } else {
                    selectedRecord[item.sfieldname] = undefined;
                }
            }
            else {
                selectedRecord[item.sfieldname] = item.sdefaultvalue;
            }
        
            return null;
        })


        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { openModal, //loadEsign, 
                selectedRecord, selectedId: null }
        }
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
        if (state.selectedRecord === undefined) {
            return { openModal: false }
        }
        return null;
    }

    render() {

        const addId = this.props.Login.inputParam && this.state.controlMap.has("Add".concat(this.props.Login.inputParam.methodUrl))
            && this.state.controlMap.get("Add".concat(this.props.Login.inputParam.methodUrl)).ncontrolcode;

        const filterParam = {
            inputListName: "DashBoardView", selectedObject: "selectedDashBoardTypes", primaryKeyField: "ndashboardtypecode",
            fetchUrl: "dashboardview/getAllSelectionDashBoardView", fecthInputObject: { userinfo: this.props.Login.userInfo },
            masterData: this.props.Login.masterData,
            searchFieldList: ["sdashboardtypename", "schartname", "ssqlqueryname"]
        };
      //  console.log("Chart Property : ", this.props.ChartProperty);

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

       // console.log("props DV:", this.props.Login);
        const fieldList = this.props.Login.masterData.viewDashBoardDesignConfigList || [];
        fieldList.forEach(item => {
            if (item.nmandatory === transactionStatus.YES){
            //if (item.ndesigncomponentcode !== designComponents.PATH ){
                mandatoryFields.push({ "idsName": item.sdisplayname, "dataField": item.sfieldname  , "mandatoryLabel":"IDS_PROVIDE", "controlType": "textbox"})
            }
        });

        //console.log("masterdata: DV", this.props.Login.masterData);
        return (
            <>
                <div className="client-listing-wrap mtop-4">
                    <Row noGutters={true}>
                        <Col md={`${!this.props.sidebarview ? '4' : "2"}`}> 
                            <ListMaster //filterColumnData ={(e)=>this.filterColumnData(e)}
                                formatMessage={this.props.intl.formatMessage}
                                screenName={this.props.intl.formatMessage({ id: "IDS_DASHBOARDVIEW" })}
                                masterData={this.props.Login.masterData || []}
                                userInfo={this.props.Login.userInfo}
                                masterList={this.props.Login.masterData.searchedData || this.props.Login.masterData.DashBoardView}
                                getMasterDetail={(DashBoardTypes) => this.props.getAllSelectionDashBoardView(DashBoardTypes, this.props.Login.userInfo, this.props.Login.masterData)}
                                selectedMaster={this.props.Login.masterData.selectedDashBoardTypes}
                                primaryKeyField="ndashboardtypecode"
                                mainField="sdashboardtypename"
                                firstField="schartname"
                                // secondField="stransdisplaystatus"
                                // isIDSField="Yes"
                                filterColumnData={this.props.filterColumnData}
                                filterParam={filterParam}
                                userRoleControlRights={this.state.userRoleControlRights}
                                addId={addId}
                                searchRef={this.searchRef}
                                reloadData={this.reloadData}
                                hidePaging={true}
                            //allowDuplicateHits={true}
                            // openModal={() => this.props.fetchRecordDashBoardType(AddDashBoardtype, this.props.Login.masterData.selectedDashBoardTypes)}
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
                            {/* <div  className="d-flex product-category" style={{ float: "right" }}>
                            <ReactTooltip place="bottom" globalEventOff='click' id="tooltip_list_wrap" /> */}
                            <ProductList className="panel-main-content">
                                {this.props.Login.masterData.DashBoardView && this.props.Login.masterData.DashBoardView.length > 0 && this.props.Login.masterData.selectedDashBoardTypes ?
                                    <Card className="border-0">
                                        <Card.Body>
                                            {(this.props.Login.masterData.selectedDashBoardTypes.ncharttypecode === chartType.PIECHART ||
                                                this.props.Login.masterData.selectedDashBoardTypes.ncharttypecode === chartType.DONUT) ?
                                                <PieChart
                                                    series={this.props.Login.masterData.pieChart}
                                                    dashBoardType={this.props.Login.masterData}
                                                    masterData={this.props.Login.masterData}
                                                    userInfo={this.props.Login.userInfo}
                                                    checkParametersAvailable={this.props.checkParametersAvailable}
                                                    chartTypeName={this.props.Login.masterData.selectedDashBoardTypes.ncharttypecode === chartType.PIECHART ? "pie" : "donut"}
                                                    valueField={"valueField"}
                                                    categoryField={"categoryField"}
                                                    style={{ height: 550 }}
                                                    selectedRecord={this.state.selectedRecord}
                                                />
                                                :

                                                this.props.Login.masterData.selectedDashBoardTypes.ncharttypecode !== chartType.BUBBLE ?
                                                    < AreaChart
                                                        xSeries={this.props.Login.masterData.xSeries}
                                                        ySeries={this.props.Login.masterData.ySeries}
                                                        dashBoardType={this.props.Login.masterData}
                                                        masterData={this.props.Login.masterData}
                                                        userInfo={this.props.Login.userInfo}
                                                        checkParametersAvailable={this.props.checkParametersAvailable}
                                                        style={{ height: 550 }}
                                                        selectedRecord={this.state.selectedRecord}
                                                        //chartTypeName={"column"}
                                                        chartTypeName={this.props.Login.masterData.selectedDashBoardTypes.ncharttypecode === chartType.AREACHART ? "area" :
                                                            this.props.Login.masterData.selectedDashBoardTypes.ncharttypecode === chartType.COLUMNCHART ? "column" :
                                                                this.props.Login.masterData.selectedDashBoardTypes.ncharttypecode === chartType.BARCHART ? "bar" : "area"}
                                                    />
                                                    :
                                                    <BubbleChart
                                                        bubbleSeries={this.props.Login.masterData.bubbleSeries}
                                                        chartData={this.props.Login.masterData.chartData}
                                                        masterData={this.props.Login.masterData}
                                                        userInfo={this.props.Login.userInfo}
                                                        checkParametersAvailable={this.props.checkParametersAvailable}
                                                        style={{ height: 550 }}
                                                    />



                                            }

                                        </Card.Body>
                                    </Card> : ""}
                            </ProductList>
                            {/* </div> */}
                        </Col>
                    </Row>
                </div>
                {this.props.Login.openModal &&
                    <SlideOutModal show={this.props.Login.openModal}
                        closeModal={this.closeModal}
                        operation={"filter"}//this.props.Login.operation}
                        inputParam={this.props.Login.inputParam}
                        screenName={"IDS_PARAMETER"}//this.props.Login.screenName}
                        onSaveClick={this.onSaveClick}
                        esign={this.props.Login.loadEsign}
                        validateEsign={this.validateEsign}
                        masterStatus={this.props.Login.masterStatus}
                        updateStore={this.props.updateStore}
                        selectedRecord={this.state.selectedRecord || {}}
                        mandatoryFields={mandatoryFields}
                        addComponent={
                            // this.props.Login.loadEsign ?
                            // <Esign operation={this.props.Login.operation}
                            //     onInputOnChange={this.onInputOnChange}
                            //     inputParam={this.props.Login.inputParam}
                            //     selectedRecord={this.state.selectedRecord || {}}
                            // />
                            // :
                            <DashBoardDynamicControls
                                selectedRecord={this.props.Login.selectedRecord || {}}
                                onInputOnChange={this.onInputOnChange}
                                onNumericInputOnChange={this.onNumericInputOnChange}
                                onComboChange={this.onComboChange}
                                handleDateChange={this.handleDateChange}
                                viewDashBoardDesignConfigList={this.props.Login.masterData.viewDashBoardDesignConfigList || []}
                                operation={"filter"}//this.props.Login.operation}
                                inputParam={this.props.Login.inputParam}
                                userInfo={this.props.Login.userInfo}

                            />

                        }
                    />
                }
            </>
        );
    }

    reloadData = () => {
        this.searchRef.current.value = "";
        const inputParam = {
            inputData: { "userinfo": this.props.Login.userInfo },
            classUrl: "dashboardview",
            methodUrl: "DashBoardView",
            displayName: "IDS_DASHBOARDVIEW",
            userInfo: this.props.Login.userInfo
        };

        this.props.callService(inputParam);
    }

    onNumericInputOnChange = (value, name, item) => {
        const selectedRecord = this.state.selectedRecord || {};
        const selectedRecord2 = this.state.selectedRecord2 || {};
        selectedRecord[name] = value;
        selectedRecord2[name] = value;
        const inputData = {
            dashboarddesignconfig: item,
            inputfielddata: {
                ...this.props.Login.inputFieldData,
                [name]: value,
                [name.concat("_componentcode")]: item.ndesigncomponentcode,
                [name.concat("_componentname")]: item.sdesigncomponentname,

            },
            parentcode: value.toString(),
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

    onComboChange = (comboData, fieldName, item) => {
        //console.log("combo data:", comboData, fieldName, item);
        const selectedRecord = this.state.selectedRecord || {};
        const selectedRecord2 = this.state.selectedRecord2 || {};
        selectedRecord[fieldName] = comboData;
        selectedRecord2[fieldName] = comboData === null ? -1 : comboData.value;
        const inputData = {
            dashboarddesignconfig: item,
            inputfielddata: {
                ...this.props.Login.inputFieldData,
                [fieldName]: comboData === null ? -1 : comboData.value,
                [fieldName.concat("_componentcode")]: item.ndesigncomponentcode,
                [fieldName.concat("_componentname")]: item.sdesigncomponentname,

            },
            parentcode: comboData === null ? "-1" : comboData.value.toString(),
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
        const selectedRecord2 = this.state.selectedRecord2 || {};

        dateValue = rearrangeDateFormat(this.props.Login.userInfo,dateValue);

        if (dateValue === null){
            dateValue = rearrangeDateFormat(this.props.Login.userInfo,item.dataList[0]);
        }
  
        selectedRecord[dateName] = dateValue;
        selectedRecord2[dateName] = dateValue;

        const inputData = {
            dashboarddesignconfig: item,
            inputfielddata: {
                ...this.props.Login.inputFieldData,
                //[dateName]: formatInputDate(dateValue, true),
                [dateName]: dateValue,
                [dateName.concat("_componentcode")]: item.ndesigncomponentcode,
                [dateName.concat("_componentname")]: item.sdesigncomponentname,

            },
            //parentcode: formatInputDate(dateValue, true),
            parentcode: dateValue,
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

    onSaveClick = () => {
        const inputFieldData = this.props.Login.inputFieldData;

        let dateValue=convertDateValuetoString(inputFieldData.dfromdate,inputFieldData.dtodate,this.props.Login.userInfo);
        inputFieldData['dfromdate']=dateValue.fromDate+"Z";
        inputFieldData['dtodate']=dateValue.toDate+"Z";

        const inputParam = {
            dashboardtypes: this.props.Login.masterData.selectedDashBoardTypes,
            inputfielddata: inputFieldData,
            userinfo: this.props.Login.userInfo
        }

        this.props.selectCheckBoxDashBoardView("DashBoardView", this.state.selectedRecord, this.props.Login.masterData, inputParam);

     } 

    componentDidUpdate(previousProps) {
        if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord) {
            this.setState({ selectedRecord: this.props.Login.selectedRecord });
        }
        if (this.props.Login.masterData !== previousProps.Login.masterData) {

            if (this.props.Login.userInfo.nformcode !== previousProps.Login.userInfo.nformcode) {
                const userRoleControlRights = [];
                if (this.props.Login.userRoleControlRights) {
                    this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode] && Object.values(this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode]).map(item =>
                        userRoleControlRights.push(item.ncontrolcode))
                }
                const controlMap = getControlMap(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode)

                this.setState({
                    userRoleControlRights, controlMap, data: this.props.Login.masterData,
                });
            }

            else {
                this.setState({
                    data: this.props.Login.masterData, selectedRecord: this.props.Login.selectedRecord,
                    isOpen: false
                });
            }
            // let respObj = {};
            // if (this.props.Login.masterData.viewDashBoardDesignConfigList !== undefined && this.props.Login.masterData.viewDashBoardDesignConfigList.length > 0) {
            //     sortByField(this.props.Login.masterData.viewDashBoardDesignConfigList, "ascending", "ndashboarddesigncode");

            //     respObj["openModal"] = true;
            //     respObj["viewDashBoardDesignConfigList"] = this.props.Login.masterData.viewDashBoardDesignConfigList;
            //     let selectedRecord = {};           
            //     respObj["viewDashBoardDesignConfigList"].map(item => {
            //       if (item.ndesigncomponentcode === designComponents.DATEPICKER) {
            //         selectedRecord[item.sfieldname] = new Date(item.dataList[0])
            //       }
            //       else if (item.ndesigncomponentcode === designComponents.COMBOBOX) {
            //         const comboMap = constructOptionList(item.dataList || [], item.svaluemember,
            //           item.sdisplaymember, undefined, undefined, true);

            //         const comboList = comboMap.get("OptionList");
            //         item.dataList = comboList;
            //       }
            //       return null;

            //     });   
            //     respObj["selectedRecord"] = selectedRecord;

            // }
            // else{
            //     respObj["openModal"] = false;
            // }   
            // this.setState({ ...respObj });
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
        getSqlQueryColumns, getAddDashboardDesign, selectCheckBoxDashBoardView, checkParametersAvailable,
        getReportViewChildDataListForDashBoard, getAllSelectionDashBoardView, updateStore,
        validateEsignCredential, filterColumnData
    })(injectIntl(DashBoardView));