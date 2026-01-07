import React from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Row, Col, Card } from 'react-bootstrap';
import { process } from '@progress/kendo-data-query';
import { toast } from 'react-toastify';
import DataGrid from '../../components/data-grid/data-grid.component';
import { ListWrapper, PrimaryHeader } from '../../components/client-group.styles';
import { callService, updateStore, crudMaster, ViewJsonExceptionLogs } from '../../actions';
import { getControlMap } from '../../components/CommonScript';
import { DEFAULT_RETURN } from '../../actions/LoginTypes';
import DateTimePicker from '../../../src/components/date-time-picker/date-time-picker.component';
import { getStartOfDay, getEndOfDay, convertDateValuetoString, rearrangeDateFormat } from '../../../src/components/CommonScript';
import SlideOutModal from '../../components/slide-out-modal/SlideOutModal';




const mapStateToProps = state => {
    return ({ Login: state.Login })
}

class JsonExceptionLogs extends React.Component {

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
            dataResult: process(this.state.data.JsonExceptionLogs || [], event.dataState),
            dataState: event.dataState
        });
    }

    closeModal = () => {
        let loadEsign = this.props.Login.loadEsign;
        let openModal = this.props.Login.openModal;
        let selectedRecord = this.props.Login.selectedRecord;
        let selectedId = this.props.Login.selectedId;
        if (this.props.Login.loadEsign) {
            if (this.props.Login.operation === "delete") {
                loadEsign = false;
                openModal = false;
                selectedRecord = {};
            } else {
                loadEsign = false;
                selectedRecord['esignpassword'] = ""
                selectedRecord['esigncomments'] = ""
            }
        } else {
            openModal = false;
            selectedRecord = {};
            selectedId=null;
        }
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { openModal, loadEsign, selectedRecord,selectedId }
        }
        this.props.updateStore(updateInfo);
    }

    reloadData = () => {
        let fromDate = this.props.Login.masterData.FromDate;
        let toDate = this.props.Login.masterData.ToDate;
        let obj = convertDateValuetoString(fromDate,toDate, this.props.Login.userInfo, true);
        const inputParam = {
            inputData: { "userinfo": this.props.Login.userInfo,
            fromDate:obj.fromDate, 
            toDate:obj.toDate, },

            classUrl: "jsonexceptionlogs",
            methodUrl: "JsonExceptionLogs",
            displayName: this.props.Login.displayName,
            userInfo: this.props.Login.userInfo
        };

        this.props.callService(inputParam);
    }

    handleDateChange = (dateName, dateValue) => {
        const { selectedRecord } = this.state;
        if (dateValue === null) {
            dateValue = new Date();
        }
        selectedRecord[dateName] = dateValue;
       // this.setState({ selectedRecord });
       // this.reloadData(selectedRecord, true);

       let dateObj = {};
       if (dateName === "fromdate") {
            dateObj = convertDateValuetoString(dateValue, this.props.Login.masterData.ToDate, this.props.Login.userInfo, true);
       }
       else{
            dateObj = convertDateValuetoString(this.props.Login.masterData.FromDate, dateValue, this.props.Login.userInfo, true);
       }

       const inputParam = {
                                inputData: {
                                    "userinfo": this.props.Login.userInfo,
                                    fromDate:dateObj.fromDate, 
                                    toDate:dateObj.toDate,
                                },
                                classUrl: 'jsonexceptionlogs',
                                methodUrl: "JsonExceptionLogs",
                                userInfo: this.props.Login.userInfo,
                                displayName: "IDS_JSONEXCEPTIONLOGS"
                            };
        this.props.callService(inputParam);
    }

    render() {

        const viewJsonExceptionLogs = this.state.controlMap.has("ViewJsonExceptionLogs") && this.state.controlMap.get("ViewJsonExceptionLogs").ncontrolcode;

        let primaryKeyField = "";

        let fromDate = "";
        let toDate = "";

        if (this.props.Login.masterData && this.props.Login.masterData.FromDate) {
            fromDate = (this.state.selectedRecord["fromdate"] && getStartOfDay(this.state.selectedRecord["fromdate"])) || rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.FromDate);
            toDate = (this.state.selectedRecord["todate"] && getEndOfDay(this.state.selectedRecord["todate"])) || rearrangeDateFormat(this.props.Login.userInfo,this.props.Login.masterData.ToDate);
        }

        this.fieldsForGrid =
                [
                    { "idsName": "IDS_STACKTRACE", "dataField": "sstacktrace", "width": "200px" },
                ];

        if (this.props.Login.inputParam !== undefined) {

            this.extractedColumnList = [
                { "idsName": "IDS_MODULENAME", "dataField": "smodulename", "width": "200px"},
                { "idsName": "IDS_FORMNAME", "dataField": "sformname", "width": "200px"},
                { "idsName": "IDS_MESSAGE", "dataField": "smessage", "width": "200px"},
                { "idsName": "IDS_USER", "dataField": "susername", "width": "200px"},
                { "idsName": "IDS_USERROLE", "dataField": "suserrolename", "width": "200px"},
                { "idsName": "IDS_EXCEPTIONDATE", "dataField": "sexceptiondate", "width": "200px", "componentName": "date"},
                { "idsName": "IDS_SITENAME", "dataField": "ssitename", "width": "200px"},
                // { "idsName": "IDS_STACKTRACE", "dataField": "sstacktrace", "width": "200px" },
            ]
            primaryKeyField = "njsonexceptioncode";
            this.detailedFieldList= [
                { "idsName": "IDS_STACKTRACE", "dataField": "sstacktrace", "width": "200px" }
            ]
           
        }
        return (
            <>
                <Row>
                    <Col>
                        <ListWrapper className="client-list-content">
                            <PrimaryHeader className="d-flex justify-content-between mb-3">
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
                            </PrimaryHeader>

                            <Row>
                                <Col md={3}>
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
                                <Col md={3}>
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
                                {/* <Col></Col> */}
                            </Row>

                            {this.state.data ?
                                <DataGrid
                                    primaryKeyField={"njsonexceptioncode"}
                                    selectedId={this.props.Login.selectedId}
                                    data={this.state.data.JsonExceptionLogs}
                                    dataResult={this.state.dataResult}
                                    dataState={this.state.dataState}
                                    dataStateChange={this.dataStateChange}
                                    extractedColumnList={this.extractedColumnList}
                                    detailedFieldList={this.detailedFieldList}
                                    controlMap={this.state.controlMap}
                                    userRoleControlRights={this.state.userRoleControlRights}
                                    inputParam={this.props.Login.inputParam}
                                    userInfo={this.props.Login.userInfo}
                                    reloadData={this.reloadData}
                                    scrollable={"scrollable"}
                                    gridHeight={"600px"}
                                    isActionRequired={true}
                                    isToolBarRequired={true}
                                    pageable={true}
                                    isAddRequired={false}
                                    isDownloadPDFRequired={false}
                                    actionIcons={[{
                                        title: this.props.intl.formatMessage({ id: "IDS_VIEW" }),
                                        controlname: "faEye",
                                        objectName: "ExceptionLogs",
                                        hidden: this.state.userRoleControlRights.indexOf(viewJsonExceptionLogs) === -1,
                                        onClick: (viewJsonExceptionLogs) => this.viewJsonExceptionLogs(viewJsonExceptionLogs)
                                    }]}
                                />
                                : ""}
                                {
                    this.props.Login.openModal &&
                    <SlideOutModal show={this.props.Login.openModal}
                        closeModal={this.closeModal}
                        inputParam={this.props.Login.inputParam}
                        screenName={'IDS_VIEWSTACKTRACE'}
                        hideSave={true}
                        addComponent={
                            <>
                                <Card className='one' >
                                    <Card.Body>
                                    {this.props.Login.masterData["JsonExceptionLogsDetails"][0].sstacktrace}
                                </Card.Body>
                                </Card>
                            </>
                        }
                    />
                }

                        </ListWrapper>
                    </Col>
                </Row>
            </>
        );
    }

    viewJsonExceptionLogs = (viewJsonExceptionLogs) => {
        // console.log('ewe', viewJsonExceptionLogs)
        let openModal = this.props.Login.openModal;
        openModal = true;
        let screenName = 'IDS_VIEWSTACKTRACE'
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                dataState: this.state.dataState
                }
        }
        this.props.updateStore(updateInfo);
        this.props.ViewJsonExceptionLogs(this.props.Login.masterData, this.props.Login.userInfo, viewJsonExceptionLogs, screenName);
    };

    componentDidUpdate(previousProps) {
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
                    //ALPD-2252
                    dataResult: process(this.props.Login.masterData.JsonExceptionLogs || [], this.state.dataState),
                });
            }
            else {
                let { dataState } = this.state;
                if (this.props.Login.dataState === undefined) {
                    dataState = { skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5 }
                }

                this.setState({
                    data: this.props.Login.masterData,
                    isOpen: false,
                    selectedRecord: this.props.Login.selectedRecord,
                    dataResult: process(this.props.Login.masterData.JsonExceptionLogs ? this.props.Login.masterData.JsonExceptionLogs : [], dataState),
                    //dataResult: process(this.props.Login.masterData, dataState),
                    dataState
                });
            }
        } else if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord) {
            this.setState({ selectedRecord: this.props.Login.selectedRecord });
        }
    }
}

export default connect(mapStateToProps, { callService, updateStore, crudMaster, ViewJsonExceptionLogs })(injectIntl(JsonExceptionLogs));