import React from 'react';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';

import Iframe from 'react-iframe';
import { injectIntl } from 'react-intl';
import { Row, Col, Nav } from 'react-bootstrap';
//import { Tooltip } from '@progress/kendo-react-tooltip';
// import ReactTooltip from 'react-tooltip';
// import DocViewer from '../../../components/doc-viewer/doc-viewer.component'
import ListMaster from '../../../components/list-master/list-master.component';
import SlideOutModal from '../../../components/slide-out-modal/SlideOutModal';
import { formatInputDate, constructOptionList, sortByField, rearrangeDateFormat, convertDateValuetoString } from '../../../components/CommonScript';
import { fileViewUrl, reportUrl,serverUrl } from '../../../rsapi'  //SWSM-121 Start - added the code for security vulnerability - by rukshana
import {
    viewReportDetail, updateStore, getReportViewChildDataList, viewReportDetailWithParameters,
    getReportsByModule, filterColumnData, callService
} from '../../../actions';
import FormSelectSearch from '../../../components/form-select-search/form-select-search.component';
import DynamicControl from './DynamicControl';
import { transactionStatus } from '../../../components/Enumeration'
import 'react-perfect-scrollbar/dist/css/styles.css';
import { ReactComponent as ReportViewIcon } from '../../../assets/image/reports-view.svg';
import { designComponents } from '../../../components/Enumeration';
import DocViewer from '../../../components/doc-viewer/doc-viewer.component';
import { faExpandArrowsAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
//import { Stimulsoft } from 'stimulsoft-reports-js/Scripts/stimulsoft.viewer';

const mapStateToProps = state => {
    return ({ Login: state.Login })
}

class Reports extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            masterStatus: "",
            error: "",
            selectedRecord: {},
            operation: "",
            screenName: undefined,
            userRoleControlRights: [],
            controlMap: new Map(),
            selectedReportModule: undefined,
            sidebarview: false
        };
        this.searchRef = React.createRef();

        this.searchFieldList = ["sactivestatus", "sdescription", "sregsubtypename", "sregtypename",
            "sreportmodulename", "smoduledisplayname", "sreportname", "sreporttypename"];
    }
    sidebarExpandCollapse = () => {
        this.setState({
            sidebarview: true
        })
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
        if (props.Login.selectedRecord === undefined) {
            return { selectedRecord: {} }
        }
        if (state.reportFilePath !== undefined) {
            return { openModal: false }
        }
        return null;
    }

    render() {

        const filterParam = {
            inputListName: "ViewReportMaster", selectedObject: "SelectedViewReportMaster", primaryKeyField: "nreportcode",
            fetchUrl: "reportview/searchViewReport", fecthInputObject: { userinfo: this.props.Login.userInfo },
            masterData: this.props.Login.masterData, searchFieldList: this.searchFieldList,
            unchangeList: ["SelectedReportModule", "ViewReportModuleList"], selectedRecord: {}
        };

        // const filePath = fileViewURL + "/SharedFolder/FileUpload/" + this.props.Login.reportFilePath;
        let filePath = "";
        //filePath = fileViewUrl() + "/Connecting_to_Databases01/" 
        if (this.props.Login.masterData.filetype == "mrt") {
            filePath = reportUrl()
                //"https://hsp.qualislims.com/JavaReportingTool/"
                // Added btoa() to encode the sapi and srepotlink values by Gowtham on dec 2 2025 for SWSM-125 JavaReportingTool sensetive data hide through url
                // Added btoa() to encode the For ALl Parameter values by Neeraj on dec 4 2025 for SWSM-125 JavaReportingTool sensetive data hide through url
                + "?name=" + btoa(this.props.Login.userInfo.sreportingtoolfilename)
                + "&slanguagetypecode=" + btoa(this.props.Login.userInfo.sreportlanguagecode)
                + "&foldername=" + btoa(this.props.Login.masterData.SelectedReportDetails.sreportname)
                + "&filename=" + btoa(this.props.Login.masterData.SelectedReportDetails.ssystemfilename)
                + "&sconnectionstring=" + this.props.Login.userInfo.sconnectionString  
                + "&sapi=" + btoa(serverUrl() + "/reststimulsoft/urljson") //SWSM-121 Start - added the code for security vulnerability - by rukshana
                + "&sreportlink=" + btoa(this.props.Login.reportSettings[15]) //this.props.Login.userInfo.sreportLink  
                // + "&smrttemplatelink=" + this.props.Login.reportSettings[16]//this.props.Login.userInfo.smrttemplateLink 
                + "&sourceparameter=" + btoa(this.props.Login.masterData.sourceparameter);
        } else {
            filePath = fileViewUrl() + "/SharedFolder/ReportView/" + this.state.reportFilePath;
        }

       // filePath="https://hsp.qualislims.com/SharedFolder/ReportView/0b3a30ec-1132-384d-94f4-6ed5058abb7e_88.pdf"
       
       // console.log("filePath:", filePath);
        // const docPath = this.props.Login.masterData.ReportPDFPath && (this.props.Login.masterData.ReportPDFPath+this.state.reportFilePath);

        // const filePath1 = this.props.Login.settings && this.props.Login.settings[6] + this.state.reportFilePath;

        const fieldList = this.state.viewReportDesignConfigList || [];

        const mandatoryFields = [];
        fieldList.forEach(item => item.ndesigncomponentcode !== designComponents.PATH ?
            mandatoryFields.push({ "idsName": item.sdisplayname, "dataField": item.sreportparametername, "mandatoryLabel": item.ndesigncomponentcode === 5 ? "IDS_ENTER" : (item.ndesigncomponentcode === 8 ? "IDS_UNAVAILABLEREPORTPARAMETER" : "IDS_PROVIDE"), "controlType": "textbox", "alertSuffix": item.ndesigncomponentcode === 8 ? "IDS_INUSERINFO" : "" }) : ""
        );

        //console.log("file:", window.location.origin, filePath, this.state.reportFilePath);
        // console.log("docPath:", this.props.Login.masterData, this.props.Login.masterData.ReportPDFPath, docPath);
        return (<>
            {/* Start of get display*/}
            <div className="client-listing-wrap mtop-4">
                <Row noGutters={true}>
                    <Col md={`${!this.props.sidebarview ? '4' : "2"}`}>
                        <Row noGutters={true}><Col md={12}>
                            <div className="list-fixed-wrap">
                                <ListMaster
                                    screenName={this.props.intl.formatMessage({ id: "IDS_REPORTS" })}
                                    masterData={this.props.Login.masterData}
                                    userInfo={this.props.Login.userInfo}
                                    masterList={this.props.Login.masterData.searchedData || this.props.Login.masterData.ViewReportMaster}
                                    getMasterDetail={(report) => this.props.viewReportDetail(report, this.props.Login.userInfo, this.props.Login.masterData)}
                                    selectedMaster={this.props.Login.masterData.SelectedViewReportMaster}
                                    primaryKeyField="nreportcode"
                                    mainField="sreportname"
                                    firstField="sreporttypename"
                                    secondField="sactivestatus"
                                    filterColumnData={this.props.filterColumnData}
                                    filterParam={filterParam}
                                    userRoleControlRights={this.state.userRoleControlRights}
                                    // addId = {addId}
                                    searchRef={this.searchRef}
                                    reloadData={this.reloadData}
                                    //openModal = {()=>this.props.getUserComboService(addParam)}
                                    isMultiSelecct={false}
                                    needAccordianFilter={true}
                                    hidePaging={true}
                                    //allowDuplicateHits={true}
                                    filterComponent={[
                                        {
                                            "IDS_FILTER":
                                                <Row>
                                                    <Col md={12}>
                                                        <FormSelectSearch
                                                            name={"nreportmodulecode"}
                                                            formLabel={this.props.intl.formatMessage({ id: "IDS_MODULENAME" })}
                                                            placeholder="Please Select..."
                                                            options={this.state.reportModuleList || []}
                                                            value={this.state.selectedReportModule ? this.state.selectedReportModule :
                                                                this.props.Login.masterData.SelectedReportModule &&
                                                                {
                                                                    label: this.props.Login.masterData.SelectedReportModule.sdisplayname,
                                                                    value: this.props.Login.masterData.SelectedReportModule.nreportmodulecode
                                                                }}
                                                            isMandatory={true}
                                                            isMulti={false}
                                                            isClearable={false}
                                                            isSearchable={true}
                                                            isDisabled={false}
                                                            closeMenuOnSelect={true}
                                                            menuPosition="fixed"
                                                            onChange={(event) => this.onfilterChange(event, "nreportmodulecode")}
                                                        />
                                                    </Col>
                                                </Row>
                                        }
                                    ]}
                                />
                            </div>
                        </Col></Row>
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
                        {/* <ReactTooltip place="bottom" globalEventOff='click' /> */}
                        {/* <Tooltip position="bottom" anchorElement="target" openDelay={100} parentTitle={true}> */}
                        <div className="d-flex justify-content-end pad-15">
                            {/* {this.props.Login.masterData.ReportPDFFile && this.props.Login.masterData.ReportPDFFile.length > 0
                             && this.state.reportFilePath &&
                            <Nav.Link name={"fullscreenreport"}
                                className="btn btn-circle outline-grey mr-2 action-icons-wrap"
                                data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_FULLSCREENREPORT" })}>
                                <DocViewer file={filePath} type={"pdf"} ></DocViewer>
                            </Nav.Link> 
                        } */}
                            <Nav.Link className="btn btn-circle outline-grey mr-2"
                                //  data-for="tooltip_list_wrap"
                                data-place="left"
                                data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_RESETREPORTPARAMETER" })}
                                onClick={() => this.props.viewReportDetail(this.props.Login.masterData.SelectedViewReportMaster, this.props.Login.userInfo, this.props.Login.masterData)}>
                                <ReportViewIcon className="custom_icons" width="20" height="20"
                                    name="resetreporticon"
                                //title={this.props.intl.formatMessage({ id: "IDS_RESETREPORTPARAMETER" })} 
                                />
                            </Nav.Link>
                            {this.props.Login.masterData.filetype === "mrt" ? ""
                                : <Nav.Link className="btn btn-circle outline-grey mr-2"
                                    //   data-for="tooltip_list_wrap"
                                    data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_VIEWREPORT" })}
                                    onClick={() => this.viewReport()}>
                                    <FontAwesomeIcon icon={faExpandArrowsAlt} />
                                </Nav.Link>}
                        </div>
                        {/* </Tooltip> */}
                        {this.props.Login.masterData.ReportPDFFile && this.props.Login.masterData.ReportPDFFile.length > 0
                            && this.state.reportFilePath ?
                            <Iframe //url="https://arxiv.org/pdf/quant-ph/0410100.pdf"
                                url={filePath}
                                // url={this.state.reportFilePath}
                                width="98%"
                                height="1000px"
                                id="reportviewID"
                                className="reportview"
                                display="initial"
                                position="relative" /> :
                            <Iframe //url="https://arxiv.org/pdf/quant-ph/0410100.pdf"
                                url={filePath}
                                // url={this.state.reportFilePath}
                                width="98%"
                                height="1000px"
                                id="reportviewID"
                                className="reportview"
                                display="initial"
                                position="relative" />
                        }

                        {/* </Col>
                    </Row> */}
                    </Col>
                </Row>
            </div>
            {/* Start of Modal Sideout for Creation */}
            {/* Below Condition Added to avoid unwanted rendering of SlideOut */}
            {this.state.showReport ?
                <DocViewer file={filePath}
                    showReport={this.state.showReport}
                    closeModal={this.closeModal}
                    type={"pdf"}>
                </DocViewer>
                : ""
            }
            {this.state.openModal ?
                <SlideOutModal show={this.state.openModal}
                    closeModal={this.closeModal}
                    operation={this.state.operation}
                    inputParam={this.state.inputParam}
                    screenName={this.state.screenName}
                    onSaveClick={this.onSaveClick}
                    masterStatus={this.props.Login.masterStatus}
                    updateStore={this.props.updateStore}
                    selectedRecord={this.state.selectedRecord || {}}
                    mandatoryFields={mandatoryFields}
                    buttonLabel={"Submit"}
                    addComponent={
                        <DynamicControl
                            selectedRecord={this.state.selectedRecord || {}}
                            onInputOnChange={this.onInputOnChange}
                            onNumericInputOnChange={this.onNumericInputOnChange}
                            onComboChange={this.onComboChange}
                            handleDateChange={this.handleDateChange}
                            viewReportDesignConfigList={this.state.viewReportDesignConfigList || []}
                            operation={this.props.Login.operation}
                            inputParam={this.props.Login.inputParam}
                            userInfo={this.props.Login.userInfo}
                            intl={this.props.intl}
                        // screenName={this.props.intl.formatMessage({id:"IDS_FILTERPARAMETER"})}
                        />

                    }
                /> : ""}
            {/* End of Modal Sideout for Creation */}
        </>
        );
    }

    componentDidUpdate(previousProps) {

        if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord) {
            this.setState({
                selectedRecord: this.props.Login.selectedRecord,
                inputFieldData: this.props.Login.inputFieldData,
                viewReportDesignConfigList: this.props.Login.viewReportDesignConfigList
            });
        }
        else {
            if (this.props.Login.inputFieldData !== previousProps.Login.inputFieldData) {
                this.setState({
                    inputFieldData: this.props.Login.inputFieldData,
                    viewReportDesignConfigList: this.props.Login.viewReportDesignConfigList
                });
            }
        }

        if (this.props.Login.masterData !== previousProps.Login.masterData) {
            const reportModuleMap = constructOptionList(this.props.Login.masterData.ViewReportModuleList || [], "nreportmodulecode",
                "sdisplayname", undefined, undefined, true);
            const reportModuleList = reportModuleMap.get("OptionList");

            const masterData = this.props.Login.masterData;
            sortByField(masterData["ViewReportDesignConfig"], "ascending", "nreportdesigncode");

            let respObj = { reportFilePath: masterData["ReportPDFFile"] };
            if (masterData["ReportPDFFile"] === "") {
                respObj["reportFilePath"] = undefined;
            }
            if (masterData["ViewReportDesignConfig"] !== undefined && Object.keys(masterData["ViewReportDesignConfig"]).length !== 0) {
                respObj["viewReportDesignConfigList"] = masterData["ViewReportDesignConfig"];
                let selectedRecord = {};
                let inputFieldData = {};
                respObj["viewReportDesignConfigList"].map(item => {
                    if (item.ndesigncomponentcode === designComponents.DATEPICKER) {
                        selectedRecord[item.sreportparametername] = rearrangeDateFormat(this.props.Login.userInfo, item.dataList[0]);
                        inputFieldData = {
                            ...inputFieldData,
                            [item.sreportparametername]: rearrangeDateFormat(this.props.Login.userInfo, item.dataList[0]),
                            [item.sreportparametername.concat("_componentcode")]: item.ndesigncomponentcode,
                            [item.sreportparametername.concat("_componentname")]: item.sdesigncomponentname,
                        };

                    }
                    else if (item.ndesigncomponentcode === designComponents.COMBOBOX) {
                        const comboMap = constructOptionList(item.dataList || [], item.svaluemember,
                            item.sdisplaymember, undefined, undefined, true);

                        const comboList = comboMap.get("OptionList");
                        item.dataList = comboList;
                    }
                    // ALPD-3987
                    else if (item.ndesigncomponentcode === designComponents.USERINFO) {
                        selectedRecord[item.sreportparametername] = (this.props.Login.userInfo && this.props.Login.userInfo[item.sreportparametername.toLowerCase()]) || "";
                        inputFieldData = {
                            ...inputFieldData,
                            [item.sreportparametername]: (this.props.Login.userInfo && this.props.Login.userInfo[item.sreportparametername.toLowerCase()]) || "",
                            [item.sreportparametername.concat("_componentcode")]: item.ndesigncomponentcode,
                            [item.sreportparametername.concat("_componentname")]: item.sdesigncomponentname,
                        };
                    }

                    return null;

                });
                // ALPD-3987
                const hasNonUserInfoComponent = respObj["viewReportDesignConfigList"].some(parameter => parameter.sdesigncomponentname !== "UserInfo");
                if (hasNonUserInfoComponent) {
                    respObj["openModal"] = true;
                } else {
                    respObj["openModal"] = false;
                }
                respObj["inputFieldData"] = inputFieldData;
                respObj["selectedRecord"] = selectedRecord;
                respObj["operation"] = "filter";
                respObj["screenName"] = "IDS_PARAMETER";
                respObj["inputParam"] = this.props.Login.inputParam;
            }
            else {
                respObj["openModal"] = false;
            }
            this.setState({ reportModuleList, ...respObj });
        }
        // if (this.props.Login.masterData !== previousProps.Login.masterData && 
        //     this.props.Login.SelectedReportDetails!==previousProps.Login.SelectedReportDetails) {
        //         Stimulsoft.Base.StiLicense.loadFromFile("license.key");
        //         const params = new URLSearchParams(window.location.search);
        // 	let clanguagefile = params.get('name')
        // 	let paramfilename = params.get('filename')
        // 	let paramfoldername = params.get('foldername')
        // 	let paramsourceparameter = params.get('sourceparameter')
        //     //StiOptions.WebServer.url = "JSDataAdapter/";
        //     var report = Stimulsoft.Report.StiReport.createNewReport();
        // 	if (!paramfilename){
        // 		//report.loadFile("reports/R_users.mrt");
        // 	}
        // 	else{
        // 		report.loadFile("//localhost:8090/SharedFolder/QuaLISjrxml/" + paramfoldername + "/" + paramfilename);
        // 	}
        // 	// Parameter begin
        // 	if(paramsourceparameter){
        // 	let jsonparse = JSON.parse(paramsourceparameter);
        // 	// console.log(jsonparse);
        // 	// console.log("----");

        // 	Object.entries(jsonparse).forEach(([key, value]) => 
        // 	report[key] = value);

        // 	//Object.entries(jsonparse).forEach(([key, value]) => 
        // 	//console.log(`${key}: ${value}`));
        // 	}
        //     //((StiSqlDatabase)report.Dictionary.Databases["Connection"]).ConnectionString = ""
        //     var dbMySQL = report.dictionary.databases.getByName("Connection");
        // 	dbMySQL.connectionString = "Server=agl92; Database=LIMSDB20230420;User=postgres; Pwd=admin@123;";
        //     var options = new Stimulsoft.Viewer.StiViewerOptions();
        //     var viewer = new Stimulsoft.Viewer.StiViewer(options, "StiViewer", false);
        //     viewer.report = report;
        //     }
    }

    closeModal = () => {
        let openModal = false;
        let showReport = false;
        let selectedRecord = {};
        this.setState({ showReport, openModal, selectedRecord });
    }

    viewReport = () => {
        if (this.props.Login.masterData.ReportPDFFile && this.props.Login.masterData.ReportPDFFile.length > 0) {
            let showReport = true;
            this.setState({ showReport });
        }
        else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_GENERATETHEREPORT" }));
        }
    }

    onfilterChange = (comboData, fieldName, item) => {
        const selectedRecord = this.state.selectedRecord || {};
        selectedRecord[fieldName] = comboData;

        this.props.getReportsByModule({
            userInfo: this.props.Login.userInfo, nreportmodulecode: comboData.value,
            selectedRecord, masterData: this.props.Login.masterData
        });
    }

    onComboChange = (comboData, fieldName, item) => {
        const selectedRecord = this.state.selectedRecord || {};
        selectedRecord[fieldName] = comboData;
        const inputData = {
            reportdesignconfig: item,
            inputfielddata: {
                ...this.state.inputFieldData,
                [fieldName]: comboData.value,
                [fieldName.concat("_componentcode")]: item.ndesigncomponentcode,
                [fieldName.concat("_componentname")]: item.sdesigncomponentname,

            },
            parentcode: comboData.value.toString(),
            parentid: item.nreportdesigncode,
            userinfo: this.props.Login.userInfo,
            nreportdetailcode: this.props.Login.masterData.SelectedReportDetails.nreportdetailcode,

        }
        const inputParam = {
            viewReportDesignConfigList: this.state.viewReportDesignConfigList,
            selectedRecord,
            inputData
        }

        this.props.getReportViewChildDataList(inputParam);
    }

    handleDateChange = (dateName, dateValue, item) => {
        const { selectedRecord } = this.state;
        selectedRecord[dateName] = dateValue;

        dateValue = rearrangeDateFormat(this.props.Login.userInfo, dateValue);


        const inputData = {
            reportdesignconfig: item,
            inputfielddata: {
                ...this.state.inputFieldData,
                // [dateName]: formatInputDate(dateValue, true),
                [dateName]: dateValue,
                [dateName.concat("_componentcode")]: item.ndesigncomponentcode,
                [dateName.concat("_componentname")]: item.sdesigncomponentname,
                [dateName.concat("_days")]: item.ndays

            },
            //parentcode: formatInputDate(dateValue, true),
            parentcode: dateValue,
            parentid: item.nreportdesigncode,
            userinfo: this.props.Login.userInfo,
            nreportdetailcode: this.props.Login.masterData.SelectedReportDetails.nreportdetailcode,

        }
        const inputParam = {
            viewReportDesignConfigList: this.state.viewReportDesignConfigList,
            selectedRecord,
            inputData
        }

        this.props.getReportViewChildDataList(inputParam);
    }

    onNumericInputOnChange = (value, name, item) => {
        const selectedRecord = this.state.selectedRecord || {};
        selectedRecord[name] = value;

        const inputData = {
            reportdesignconfig: item,
            inputfielddata: {
                ...this.state.inputFieldData,
                [name]: value,
                [name.concat("_componentcode")]: item.ndesigncomponentcode,
                [name.concat("_componentname")]: item.sdesigncomponentname,

            },
            parentcode: value.toString(),
            parentid: item.nreportdesigncode,
            userinfo: this.props.Login.userInfo,
            nreportdetailcode: this.props.Login.masterData.SelectedReportDetails.nreportdetailcode,

        }
        const inputParam = {
            viewReportDesignConfigList: this.state.viewReportDesignConfigList,
            selectedRecord,
            inputData
        }

        this.props.getReportViewChildDataList(inputParam);
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
            reportdesignconfig: item,
            inputfielddata: {
                ...this.state.inputFieldData,
                [event.target.name]: selectedRecord[event.target.name],
                [event.target.name.concat("_componentcode")]: item.ndesigncomponentcode,
                [event.target.name.concat("_componentname")]: item.sdesigncomponentname,

            },
            parentcode: selectedRecord[event.target.name].toString(),
            parentid: item.nreportdesigncode,
            userinfo: this.props.Login.userInfo,
            nreportdetailcode: this.props.Login.masterData.SelectedReportDetails.nreportdetailcode,

        }
        const inputParam = {
            viewReportDesignConfigList: this.state.viewReportDesignConfigList,
            selectedRecord,
            inputData
        }

        this.props.getReportViewChildDataList(inputParam);
    }

    onSaveClick = (saveType, formRef) => {
        // const selectedRecord = this.props.Login.selectedRecord;        
        const inputFieldData = this.state.inputFieldData;

        if (inputFieldData.fromdate_componentname === 'Date Picker' || inputFieldData.todate_componentname === 'Date Picker') {
            let dateValue = convertDateValuetoString(inputFieldData.fromdate, inputFieldData.todate, this.props.Login.userInfo);
            inputFieldData['fromdate'] = dateValue.fromDate + "Z";
            inputFieldData['todate'] = dateValue.toDate + "Z";
        }

        const inputParam = {
            reportmaster: this.props.Login.masterData.SelectedViewReportMaster,
            inputfielddata: inputFieldData,
            userinfo: this.props.Login.userInfo,
            masterData: this.props.Login.masterData
        }
        this.props.viewReportDetailWithParameters(inputParam);

    }

    reloadData = () => {
        this.searchRef.current.value = "";
        const inputParam = {
            inputData: { "userinfo": this.props.Login.userInfo },
            classUrl: "reportview",
            methodUrl: "ReportView",
            displayName: "IDS_REPORTS",
            userInfo: this.props.Login.userInfo
        };

        this.props.callService(inputParam);
    }
}

export default connect(mapStateToProps, {
    viewReportDetail, updateStore, filterColumnData, callService,
    getReportViewChildDataList, viewReportDetailWithParameters, getReportsByModule
})(injectIntl(Reports));

