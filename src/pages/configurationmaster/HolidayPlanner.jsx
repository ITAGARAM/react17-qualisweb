import React, { Component } from 'react';
import { Row, Col, Card, Nav, FormGroup, FormLabel } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { FormattedMessage } from 'react-intl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { ReadOnlyText } from '../../components/App.styles';
import SlideOutModal from '../../components/slide-out-modal/SlideOutModal';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import {
    callService, crudMaster, validateEsignCredential, updateStore, getHoildaysYear, selectCheckBoxYear,
    getCommonHolidays, filterColumnData,
    getPublicHolidays, sendApproveYearVersion, getCommonAndPublicHolidays,getUserBasedHolidays
} from '../../actions';
import ListMaster from '../../components/list-master/list-master.component';
import { ContentPanel } from '../../pages/product/product.styled';
import { showEsign, getControlMap } from '../../components/CommonScript';
import Esign from '../audittrail/Esign';
import { DEFAULT_RETURN } from '../../actions/LoginTypes';
import HolidayPlannerTab from '../../pages/configurationmaster/HolidayPlannerTab';
import AddYear from '../../pages/configurationmaster/AddYear';
import { transactionStatus } from '../../components/Enumeration';
// import ConfirmDialog from '../../components/confirm-alert/confirm-alert.component';
// import { Tooltip } from '@progress/kendo-react-tooltip';
import ConfirmMessage from '../../components/confirm-alert/confirm-message.component';
// import ReactTooltip from 'react-tooltip';

const mapStateToProps = state => {
    return ({ Login: state.Login })
}

class HolidayPlanner extends Component {
    constructor(props) {
        super(props);
        const dataState = {
            skip: 0,
            take: 10,
        };
        this.state = {
            selectedRecord: {}, dataResult: [],
            dataState: dataState,
            masterStatus: "",
            error: "",
            HolidayYear: [],
            operation: "",
            selectedYear: undefined,
            screenName: "HolidayPlanner",
            CurrentYearVersion: 0,
            userRoleControlRights: [],
            controlMap: new Map(),

        };

        this.searchRef = React.createRef();
        this.confirmMessage = new ConfirmMessage();
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
        return null;
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
        this.props.updateStore(updateInfo);

    }
    render() {

        // let userStatusCSS = "";
        // if (this.props.Login.masterData.selectedYear && this.props.Login.masterData.selectedYear.ntransactionstatus === 8) {
        //     userStatusCSS = "outline-secondary";
        // }
        // else if (this.props.Login.masterData.selectedYear && this.props.Login.masterData.selectedYear.ntransactionstatus === 22) {
        //     userStatusCSS = "outline-success";
        // }
        // else if (this.props.Login.masterData.selectedYear && this.props.Login.masterData.selectedYear.ntransactionstatus === 53) {
        //     userStatusCSS = "outline-correction";
        // } else {
        //     userStatusCSS = "outline-Final";
        // }
        this.extractedColumnList = [
            { "idsName": "IDS_YEAR", "mandatory": true, "dataField": "syear" , "mandatoryLabel":"IDS_SELECT", "controlType": "selectbox"}
        ];

        const addId = this.state.controlMap.has("AddHolidaysYear") && this.state.controlMap.get("AddHolidaysYear").ncontrolcode;
        const editId = this.state.controlMap.has("EditHolidaysYear") && this.state.controlMap.get("EditHolidaysYear").ncontrolcode;
        const deleteId = this.state.controlMap.has("DeleteHolidaysYear") && this.state.controlMap.get("DeleteHolidaysYear").ncontrolcode;

        const filterParam = {
            inputListName: "HolidayYear", selectedObject: "selectedYear", primaryKeyField: "nyearcode",
            fetchUrl: "holidayplanner/getSelectionAllHolidayPlanner", fecthInputObject: { userinfo: this.props.Login.userInfo },
            masterData: this.props.Login.masterData,
            searchFieldList: ["syear", "sdescription"]
        };

        const mandatoryFields = [];
        this.extractedColumnList.forEach(item => item.mandatory === true ?
            mandatoryFields.push(item) : ""
        );
        return (
            <>
                <div className="client-listing-wrap mtop-fixed-breadcrumb">
                    <Row noGutters={true}>
                        <Col md={4}>
                            <ListMaster //filterColumnData ={(e)=>this.filterColumnData(e)}
                                formatMessage={this.props.intl.formatMessage}
                                screenName={this.props.intl.formatMessage({ id: "IDS_HOLIDAYPLANNER" })}
                                masterData={this.props.Login.masterData}
                                userInfo={this.props.Login.userInfo}
                                masterList={this.props.Login.masterData.searchedData || this.props.Login.masterData.HolidayYear}
                                getMasterDetail={(HolidayYear) => this.props.selectCheckBoxYear(HolidayYear, this.props.Login.masterData, this.props.Login.userInfo)}
                                selectedMaster={this.props.Login.masterData.selectedYear}
                                primaryKeyField="nyearcode"
                                mainField="syear"
                                // firstField="sdescription"
                                filterColumnData={this.props.filterColumnData}
                                filterParam={filterParam}
                                userRoleControlRights={this.state.userRoleControlRights}
                                addId={addId}
                                searchRef={this.searchRef}
                                reloadData={this.reloadData}
                                openModal={() => this.props.getHoildaysYear("IDS_HOLIDAYPLANNER", "create", "nyearcode", this.props.Login.masterData, this.props.Login.userInfo, 779)}
                                isMultiSelecct={false}
                                hideCheckLabel={true}
                                hidePaging={true}
                            />
                        </Col>
                        <Col md='8'>
                            <Row><Col md={12}>
                                <ContentPanel className="panel-main-content">
                                    {this.props.Login.masterData.HolidayYear && this.props.Login.masterData.HolidayYear.length > 0 && this.props.Login.masterData.selectedYear ?
                                        <Card className="border-0">
                                            <Card.Header>
                                                {/* <ReactTooltip place="bottom" globalEventOff='click' id="tooltip-list-wrap" /> */}
                                                <Card.Title className="product-title-main">{this.props.Login.masterData.selectedYear.syear}</Card.Title>
                                                <Card.Subtitle>

                                                    <div className="d-flex product-category">
                                                        <h2 className="product-title-sub flex-grow-1">
                                                        </h2>
                                                        {/* <Col md='6'> */}
                                                        {/* <Tooltip position="bottom" anchorElement="target" openDelay={100} parentTitle={true}> */}

                                                        <div className="d-inline ">

                                                            {/* <ProductList className="d-inline dropdown badget_menu"> */}
                                                            <Nav.Link className="btn btn-circle outline-grey mr-2 " href="#"
                                                                hidden={this.state.userRoleControlRights.indexOf(editId) === -1}
                                                                data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_EDIT" })}
                                                              //  data-for="tooltip-list-wrap"
                                                                onClick={(e) => this.editHolidayYear(editId)}
                                                            >
                                                                <FontAwesomeIcon icon={faPencilAlt}
                                                                />
                                                            </Nav.Link>
                                                            <Nav.Link className="btn btn-circle outline-grey mr-2" href=""
                                                                hidden={this.state.userRoleControlRights.indexOf(deleteId) === -1}
                                                                data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_DELETE" })}
                                                             //   data-for="tooltip-list-wrap"
                                                                onClick={() => this.ConfirmDelete(deleteId)}>
                                                                <FontAwesomeIcon icon={faTrashAlt} />
                                                                {/* <ConfirmDialog
                                                                    name="deleteMessage"
                                                                    message={this.props.intl.formatMessage({ id: "IDS_DEFAULTCONFIRMMSG" })}
                                                                    doLabel={this.props.intl.formatMessage({ id: "IDS_OK" })}
                                                                    doNotLabel={this.props.intl.formatMessage({ id: "IDS_CANCEL" })}
                                                                    icon={faTrashAlt}
                                                                    title={this.props.intl.formatMessage({ id: "IDS_DELETE" })}
                                                                    hidden={this.state.userRoleControlRights.indexOf(deleteId) === -1}
                                                                    handleClickDelete={() => this.DeleteHolidaysYear("delete", deleteId)}
                                                                /> */}
                                                            </Nav.Link>
                                                            {/* </ProductList> */}

                                                        </div>
                                                        {/* </Tooltip> */}
                                                        {/* </Col> */}
                                                    </div>
                                                </Card.Subtitle>
                                            </Card.Header>
                                            <Card.Body>
                                                <Row>
                                                    <Col md={12}>
                                                        <FormGroup>
                                                            <FormLabel><FormattedMessage id={'IDS_DESCRIPTION'} message="Description" /></FormLabel>
                                                            <ReadOnlyText>{this.props.Login.masterData.selectedYear.sdescription && this.props.Login.masterData.selectedYear.sdescription}</ReadOnlyText>
                                                        </FormGroup>
                                                    </Col>
                                                </Row>
                                                {/* </Card.Body>
                                            <Card.Body> */}
                                                <HolidayPlannerTab
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
                                                    CurrentYearVersion={this.props.Login.CurrentYearVersion}
                                                    getCommonHolidays={this.props.getCommonHolidays}
                                                    getPublicHolidays={this.props.getPublicHolidays}
                                                    getUserBasedHolidays={this.props.getUserBasedHolidays}
                                                    sendApproveYearVersion={this.props.sendApproveYearVersion}
                                                    getCommonAndPublicHolidays={this.props.getCommonAndPublicHolidays}
                                                    selectedId={this.props.Login.selectedId}
                                                    timeZoneList={this.props.Login.timeZoneList || []}
                                                    setting = {this.props.Login.settings}
                                                    Users={this.props.Login.Users}
                                                />
                                            </Card.Body>
                                        </Card> : ""}
                                </ContentPanel>
                            </Col></Row>
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
                            : <AddYear
                                selectedRecord={this.state.selectedRecord || {}}
                                onInputOnChange={this.onInputOnChange}
                                handleFilterDateChange={this.handleFilterDateChange}
                                operation={this.props.operation}
                                inputParam={this.props.inputParam}
                            />}
                    />}
            </>

        );
    }
    ConfirmDelete = (deleteId) => {
        this.confirmMessage.confirm("deleteMessage", this.props.intl.formatMessage({ id: "IDS_DELETE" }), this.props.intl.formatMessage({ id: "IDS_DEFAULTCONFIRMMSG" }),
            this.props.intl.formatMessage({ id: "IDS_OK" }), this.props.intl.formatMessage({ id: "IDS_CANCEL" }), () => this.DeleteHolidaysYear("delete", deleteId));
    }
    handleFilterDateChange = (dateName, dateValue) => {
        const { selectedRecord } = this.state;
        if (dateValue === null) {
            dateValue = new Date();
        }
        selectedRecord[dateName] = dateValue;
        this.setState({ selectedRecord });
    }
    editHolidayYear = (editId) => {

        // let checkApproved = 0;
        // this.props.Login.masterData.YearVersion.forEach(item => {
        //     if (item.ntransactionstatus === transactionStatus.APPROVED) {
        //         checkApproved = 1;
        //     }
        // }
        // )
        // if (checkApproved === 0) {
        this.props.getHoildaysYear("IDS_HOLIDAYPLANNER", "update", "nyearcode", this.props.Login.masterData, this.props.Login.userInfo, editId)
        // }
        // else {
        //     toast.warn(intl.formatMessage({ id: "IDS_CANNOTEDITONEOFTHEVERSIONISAPPROVED" }));
        // }
    }
    reloadData = () => {
        this.searchRef.current.value = "";
        const inputParam = {
            inputData: { "userinfo": this.props.Login.userInfo },
            classUrl: "holidayplanner",
            methodUrl: "HolidayPlanner",
            userInfo: this.props.Login.userInfo,
            displayName: "IDS_HOLIDAYPLANNER"
        };

        this.props.callService(inputParam);
    }
    onSaveClick = (saveType, formRef) => {

        // if (this.state.selectedRecord["syear"] === 0 || this.state.selectedRecord["syear"].toString().length < 4) {
        //     toast.warn(intl.formatMessage({ id: "IDS_INVALIDYEAR" }));
        // }
        // else {
        let inputData = [];

        let postParam = undefined;

        inputData["userinfo"] = this.props.Login.userInfo;
        let fieldList = ["nyearcode", "sdescription"];
        const holidayYear = this.state.selectedRecord["syear"]
        if (this.props.Login.operation === "update") {

            postParam = { inputListName: "HolidayYear", selectedObject: "selectedYear", primaryKeyField: "nyearcode" };

            inputData["holidaysyear"] = {};
            fieldList.map(item => {
                return inputData["holidaysyear"][item] = this.state.selectedRecord[item] ? this.state.selectedRecord[item] : "";
            })
            inputData["holidaysyear"]["syear"] = holidayYear.getFullYear();
        }
        else {
            inputData["holidaysyear"] = { "nsitecode": this.props.Login.userInfo.nmastersitecode };

            fieldList.map(item => {
                return inputData["holidaysyear"][item] = this.state.selectedRecord[item]?this.state.selectedRecord[item] : "";
            })
            inputData["holidaysyear"]["syear"] = holidayYear.getFullYear();
        }
        const inputParam = {
            classUrl: "holidayplanner",
            methodUrl: "HolidaysYear",
            inputData: inputData,
            operation: this.props.Login.operation, saveType, formRef, postParam, searchRef: this.searchRef
        }
        const masterData = this.props.Login.masterData;
        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolCode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData }, saveType
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.crudMaster(inputParam, masterData, "openModal");
        }

    }

    DeleteHolidaysYear = (operation, ncontrolCode) => {
        let inputData = [];

        inputData["holidaysyear"] = this.props.Login.masterData.selectedYear;
        inputData["userinfo"] = this.props.Login.userInfo;
        const inputParam = {
            methodUrl: "HolidaysYear",
            classUrl: this.props.Login.inputParam.classUrl,
            inputData: inputData,
            operation: "delete"
        }
        const masterData = this.props.Login.masterData;
        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, ncontrolCode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData },
                    openModal: true, screenName: "HolidayPlanner", operation
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.crudMaster(inputParam, masterData, "openModal");
        }
    }
    onNumericInputOnChange = (value, name) => {
        const selectedRecord = this.state.selectedRecord || {};

        selectedRecord[name] = value;
        this.setState({ selectedRecord });

    }
    onInputOnChange = (event) => {

        const selectedRecord = this.state.selectedRecord || {};
        if (event.target.type === 'checkbox') {
            if (event.target.name === "agree") {
                selectedRecord[event.target.name] = event.target.checked === true ? transactionStatus.YES : transactionStatus.NO;
            }
            else {
                selectedRecord[event.target.name] = event.target.checked === true ? transactionStatus.ACTIVE : transactionStatus.DEACTIVE;
            }
        }
        else {
            selectedRecord[event.target.name] = event.target.value;
        }
        this.setState({ selectedRecord });
    }

    componentDidUpdate(previousProps) {
        if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord) {

            this.setState({ selectedRecord: this.props.Login.selectedRecord });

        }
        if (this.props.Login.userInfo.nformcode !== previousProps.Login.userInfo.nformcode) {
            const userRoleControlRights = [];
            if (this.props.Login.userRoleControlRights) {
                this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode] && Object.values(this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode]).map(item =>
                    userRoleControlRights.push(item.ncontrolcode))
            }
            const controlMap = getControlMap(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode)
            this.setState({ userRoleControlRights, controlMap });
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
    componentWillUnmount() {
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                masterData: [], inputParam: undefined, operation: null, modalName: undefined
            }
        }
        this.props.updateStore(updateInfo);
    }
}

export default connect(mapStateToProps, {
    callService, crudMaster, validateEsignCredential, updateStore, getHoildaysYear, selectCheckBoxYear,
    getCommonHolidays, filterColumnData,
    getPublicHolidays, sendApproveYearVersion, getCommonAndPublicHolidays,getUserBasedHolidays
})(injectIntl(HolidayPlanner));