import React from 'react'
import { Row, Col, Card, Nav, FormGroup, FormLabel } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faPencilAlt, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import {
    callService, crudMaster, validateEsignCredential, updateStore, filterColumnData, fetchRecordCertificateType,
    getCertificateTypeVersion, getReportMasterByCertificateType, getReportDetailByReport, fetchCertificateTypeVersionById
} from '../../../actions';
import { process } from '@progress/kendo-data-query';
import { toast } from 'react-toastify';
import ListMaster from '../../../components/list-master/list-master.component';
import { DEFAULT_RETURN } from '../../../actions/LoginTypes';
import { showEsign, getControlMap } from '../../../components/CommonScript';
import { transactionStatus } from '../../../components/Enumeration';
import { ContentPanel, ReadOnlyText } from '../../../components/App.styles';
// import { Tooltip } from '@progress/kendo-react-tooltip';
import ConfirmMessage from '../../../components/confirm-alert/confirm-message.component';
import SlideOutModal from '../../../components/slide-out-modal/SlideOutModal';
import Esign from '../../audittrail/Esign';
import AddCertificateType from './AddCertificateType';
import DataGrid from '../../../components/data-grid/data-grid.component';
import AddCertificateTypeVersion from './AddCertificateTypeVersion';
// import ReactTooltip from 'react-tooltip';
const mapStateToProps = state => {
    return ({ Login: state.Login })
}
class CertificateType extends React.Component {
    constructor(props) {
        super(props)
        this.formRef = React.createRef();
        this.searchRef = React.createRef();
        this.state = {
            masterStatus: "",
            error: "",
            selectedRecord: {},
            dataState: { skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5 },
            userRoleControlRights: [],
            controlMap: new Map(),
        };
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
    render() {
        const addCTId = this.state.controlMap.has("AddCertificateType") && this.state.controlMap.get("AddCertificateType").ncontrolcode
        const editID = this.state.controlMap.has("EditCertificateType") && this.state.controlMap.get("EditCertificateType").ncontrolcode
        const deleteId = this.state.controlMap.has("DeleteCertificateType") && this.state.controlMap.get("DeleteCertificateType").ncontrolcode
        const createVersionId = this.state.controlMap.has("AddCertificateTypeVersion") && this.state.controlMap.get("AddCertificateTypeVersion").ncontrolcode
        const editVersionId = this.state.controlMap.has("EditCertificateTypeVersion") && this.state.controlMap.get("EditCertificateTypeVersion").ncontrolcode
        let extractedColumnList = [
            { "idsName": "IDS_CERTIFICATETYPEVERSION", "dataField": "ncertificatetypeversionno", "width": "180px" },
            { "idsName": "IDS_STATUS", "dataField": "stransdisplaystatus", "width": "180px" },
            { "idsName": "IDS_REPORTNAME", "dataField": "sreportname", "width": "300px" },
            { "idsName": "IDS_REPORTVERSIONNO", "dataField": "nversionno", "width": "180px" }
        ];

        const AddCertificateType1 = {
            screenName: this.props.Login.screenName, primaryKeyField: "ncertificatetypecode", undefined, operation: "create",
            inputParam: this.props.Login.inputParam, userInfo: this.props.Login.userInfo, ncontrolCode: addCTId
        };
        const editParam = {
            screenName: this.props.Login.screenName, primaryKeyField: "ncertificatetypecode", operation: "update",
            inputParam: this.props.Login.inputParam, userInfo: this.props.Login.userInfo, ncontrolCode: editID
        };
        const deleteParam = { operation: "delete", ncontrolCode: deleteId };
        const editVersionParam = {
            userInfo: this.props.Login.userInfo,
            primaryKeyField: "ncertificatetypeversioncode",
            ncontrolCode: editVersionId
        };
        const mandatoryFields = [
            { "idsName": "IDS_CERTIFICATETYPE", "dataField": "scertificatetype", "mandatoryLabel":"IDS_ENTER", "controlType": "textbox" },
            // { "idsName": "IDS_VERSIONNO", "dataField": "sversionno" },
            { "idsName": "IDS_REPORTBATCHTYPE", "dataField": "ncertificatereporttypecode", "mandatoryLabel":"IDS_SELECT", "controlType": "selectbox" },
        ];
        const mandatoryVersionFields = [
            { "idsName": "IDS_REPORTNAME", "dataField": "nreportcode", "mandatoryLabel":"IDS_SELECT", "controlType": "selectbox" },
            { "idsName": "IDS_REPORTVERSIONNO", "dataField": "nreportdetailcode", "mandatoryLabel":"IDS_SELECT", "controlType": "selectbox" },
            { "idsName": "IDS_PREVIEWREPORTNAME", "dataField": "npreviewreportcode" , "mandatoryLabel":"IDS_SELECT", "controlType": "selectbox"},
            { "idsName": "IDS_PREVIEWREPORTVERSIONNO", "dataField": "npreviewreportdetailcode" , "mandatoryLabel":"IDS_SELECT", "controlType": "selectbox"}
        ];

        const filterParam = {
            inputListName: "certificatetype",
            selectedObject: "selectedCertificateType",
            primaryKeyField: "ncertificatetypecode",
            fetchUrl: "certificatetype/getCertificateTypeByClick",
            fecthInputObject: { userinfo: this.props.Login.userInfo },
            masterData: this.props.Login.masterData,
            searchFieldList: ["scertificatetype", "sdescription", "sbatchdisplayname", "saccreditedCertificate", "sdisplaystatus"]
        }

        let userStatusCSS = "outline-secondary";
        if (this.props.Login.masterData.selectedCertificateType && this.props.Login.masterData.selectedCertificateType.ntransactionstatus === transactionStatus.YES) {
            userStatusCSS = "outline-success";
        }
        return (
            <>
                <div className="client-listing-wrap mtop-4">
                    <Row noGutters={true}>
                        <Col md={4}>
                            <ListMaster
                                screenName={this.props.intl.formatMessage({ id: "IDS_CERTIFICATETYPE" })}
                                masterData={this.props.Login.masterData}
                                userInfo={this.props.Login.userInfo}
                                masterList={this.props.Login.masterData.searchedData || this.props.Login.masterData.certificatetype || []}
                                getMasterDetail={(certificatetype) => this.props.getCertificateTypeVersion(certificatetype, this.props.Login.userInfo, this.props.Login.masterData)}
                                selectedMaster={this.props.Login.masterData.selectedCertificateType}
                                primaryKeyField={"ncertificatetypecode"}
                                mainField="scertificatetype"
                                firstField="saccreditedCertificate"
                                filterColumnData={this.props.filterColumnData}
                                openModal={() => this.props.fetchRecordCertificateType(AddCertificateType1)}
                                userRoleControlRights={this.state.userRoleControlRights}
                                addId={addCTId}
                                searchRef={this.searchRef}
                                filterParam={filterParam}
                                hidePaging={true}
                                reloadData={this.reloadData}
                            />
                        </Col>
                        <Col md={8}>
                            <Row>
                                <Col md={12}>
                                    <ContentPanel className="panel-main-content">
                                        <Card className="border-0">
                                            {this.props.Login.masterData.certificatetype && this.props.Login.masterData.certificatetype.length > 0 && this.props.Login.masterData.selectedCertificateType ?
                                                <>
                                                    <Card.Header>
                                                        {/* <ReactTooltip place="bottom" globalEventOff='click' /> */}
                                                        <Card.Title className="product-title-main">
                                                            {this.props.Login.masterData.selectedCertificateType.scertificatetype}
                                                        </Card.Title>
                                                        <Card.Subtitle>
                                                            <div className="d-flex product-category justify-content-end">
                                                                <h2 className="product-title-sub flex-grow-1">
                                                                    <span className={`btn btn-outlined ${userStatusCSS} btn-sm ml-3`}>
                                                                        {this.props.Login.masterData.selectedCertificateType.sdisplaystatus}
                                                                    </span>
                                                                </h2>
                                                                {/* <Tooltip position="bottom" anchorElement="target" openDelay={100} parentTitle={true}> */}
                                                                <div className="d-inline">
                                                                    <Nav.Link name="editUser" hidden={this.state.userRoleControlRights.indexOf(editID) === -1}
                                                                        className="btn btn-circle outline-grey mr-2"
                                                                        data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_EDIT" })}
                                                                      //  data-for="tooltip_list_wrap"
                                                                        onClick={() => this.props.fetchRecordCertificateType({ ...editParam, primaryKeyValue: this.props.Login.masterData.selectedCertificateType.ncertificatetypecode })}
                                                                    >
                                                                        <FontAwesomeIcon icon={faPencilAlt} />
                                                                    </Nav.Link>

                                                                    <Nav.Link name="deleteUser" className="btn btn-circle outline-grey mr-2 action-icons-wrap"
                                                                        data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_DELETE" })}
                                                                   //     data-for="tooltip_list_wrap"
                                                                        hidden={this.state.userRoleControlRights.indexOf(deleteId) === -1}
                                                                        onClick={() => this.ConfirmDelete(deleteParam)}>
                                                                        <FontAwesomeIcon icon={faTrashAlt} />
                                                                    </Nav.Link>
                                                                </div>
                                                                {/* </Tooltip> */}
                                                            </div>
                                                        </Card.Subtitle>
                                                    </Card.Header>
                                                    <Card.Body className="form-static-wrap">
                                                        <Row>
                                                            <Col md={6}>
                                                                <FormGroup>
                                                                    <FormLabel>
                                                                        <FormattedMessage id="IDS_REPORTBATCHTYPE" />
                                                                    </FormLabel>
                                                                    <ReadOnlyText>
                                                                        {this.props.Login.masterData.selectedCertificateType.sbatchdisplayname}
                                                                    </ReadOnlyText>
                                                                </FormGroup>
                                                            </Col>
                                                            <Col md={6}>
                                                                <FormGroup>
                                                                    <FormLabel>
                                                                        <FormattedMessage id="IDS_EDQM" />
                                                                    </FormLabel>
                                                                    <ReadOnlyText>
                                                                        {this.props.Login.masterData.selectedCertificateType.sedqmCertificate}
                                                                    </ReadOnlyText>
                                                                </FormGroup>
                                                            </Col>
                                                            {/* <Col md={3}>
                                                                <FormGroup>
                                                                    <FormLabel>
                                                                        <FormattedMessage id="IDS_ACCREDITED" />
                                                                    </FormLabel>
                                                                    <ReadOnlyText>
                                                                        {this.props.Login.masterData.selectedCertificateType.saccreditedCertificate}
                                                                    </ReadOnlyText>
                                                                </FormGroup>
                                                            </Col>
                                                            <Col md={3}>
                                                                <FormGroup>
                                                                    <FormLabel>
                                                                        <FormattedMessage id="IDS_ACTIVE" />
                                                                    </FormLabel>
                                                                    <ReadOnlyText>
                                                                        {this.props.Login.masterData.selectedCertificateType.sdisplaystatus}
                                                                    </ReadOnlyText>
                                                                </FormGroup>
                                                            </Col> */}
                                                            <Col md={12}>
                                                                <FormGroup>
                                                                    <FormLabel>
                                                                        <FormattedMessage id="IDS_DESCRIPTION" message="Report Type" />
                                                                    </FormLabel>
                                                                    <ReadOnlyText>
                                                                        {this.props.Login.masterData.selectedCertificateType.sdescription ?
                                                                            this.props.Login.masterData.selectedCertificateType.sdescription === "" ?
                                                                                "-"
                                                                                : this.props.Login.masterData.selectedCertificateType.sdescription
                                                                            : "-"}
                                                                    </ReadOnlyText>
                                                                </FormGroup>
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col md={12}>
                                                                <Card id="certificateversion" className="at-tabs border-0">
                                                                    <Row>
                                                                        <Col md={12}>
                                                                            <div className="d-flex justify-content-end">
                                                                                {/* <ReactTooltip place="bottom" globalEventOff='click' /> */}
                                                                                <Nav.Link className="add-txt-btn"
                                                                                    data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_ADDVERSION" })}
                                                                                   // data-for="tooltip_list_wrap"
                                                                                    hidden={this.state.userRoleControlRights.indexOf(createVersionId) === -1}
                                                                                    onClick={() => this.props.getReportMasterByCertificateType(this.props.Login.masterData.selectedCertificateType.ncertificatetypecode, this.props.Login.userInfo)}
                                                                                >
                                                                                    <FontAwesomeIcon icon={faPlus} /> { }
                                                                                    <FormattedMessage id='IDS_VERSION' />
                                                                                </Nav.Link>
                                                                            </div>
                                                                        </Col>
                                                                    </Row>
                                                                    <Row>
                                                                        <Col md={12}>
                                                                            <DataGrid
                                                                                primaryKeyField={"ncertificatetypeversioncode"}
                                                                                data={this.props.Login.masterData.cerificateTypeVersion || []}
                                                                                dataResult={process(this.props.Login.masterData.cerificateTypeVersion, this.state.dataState)}
                                                                                dataState={this.state.dataState}
                                                                                dataStateChange={(event) => this.setState({ dataState: event.dataState })}
                                                                                extractedColumnList={extractedColumnList}
                                                                                controlMap={this.state.controlMap}
                                                                                userRoleControlRights={this.state.userRoleControlRights}
                                                                                inputParam={this.props.Login.inputParam}
                                                                                userInfo={this.props.Login.userInfo}
                                                                                methodUrl="CertificateTypeVersion"
                                                                                gridHeight={"450px"}
                                                                                pageable={true}
                                                                                fetchRecord={this.props.fetchCertificateTypeVersionById}
                                                                                editParam={editVersionParam}
                                                                                selectedId={this.props.Login.selectedId}
                                                                                isComponent={true}
                                                                                isActionRequired={true}
                                                                                isToolBarRequired={false}
                                                                                scrollable={"scrollable"}
                                                                            />
                                                                        </Col>
                                                                    </Row>
                                                                </Card>
                                                            </Col>
                                                        </Row>
                                                    </Card.Body>
                                                </>
                                                : ""}
                                        </Card>
                                    </ContentPanel>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </div>
                {
                    (this.props.Login.openModal || this.props.Login.openChildModal) &&
                    <SlideOutModal
                        show={this.props.Login.openModal || this.props.Login.openChildModal}
                        closeModal={this.closeModal}
                        operation={this.props.Login.operation}
                        inputParam={this.props.Login.inputParam}
                        screenName={this.props.Login.screenName}
                        onSaveClick={this.props.Login.openModal ? this.onSaveClick : this.onSaveVersion}
                        esign={this.props.Login.loadEsign}
                        validateEsign={this.validateEsign}
                        masterStatus={this.props.Login.masterStatus}
                        updateStore={this.props.updateStore}
                        selectedRecord={this.state.selectedRecord || {}}
                        mandatoryFields={this.props.Login.openModal ? mandatoryFields : mandatoryVersionFields}
                        addComponent={this.props.Login.loadEsign ?
                            <Esign operation={this.props.Login.operation}
                                onInputOnChange={this.onInputOnChange}
                                inputParam={this.props.Login.inputParam}
                                selectedRecord={this.state.selectedRecord || {}}
                            />
                            : this.props.Login.openChildModal ?
                                <AddCertificateTypeVersion
                                    selectedRecord={this.state.selectedRecord || {}}
                                    onInputOnChange={this.onInputChangeVersion}
                                    onComboChange={this.onComboChange}
                                    reportMasterList={this.props.Login.reportMasterList || []}
                                    reportDetailsList={this.props.Login.reportDetailsList || []}
                                    previewReportMasterList={this.props.Login.previewReportMasterList || []}
                                    previewReportDetailsList={this.props.Login.previewReportDetailsList || []}
                                />
                                : <AddCertificateType
                                    selectedRecord={this.state.selectedRecord || {}}
                                    onInputOnChange={this.onInputOnChange}
                                    onComboChange={this.onComboChange}
                                    reportBatchTypeList={this.props.Login.reportBatchTypeList}
                                />
                        }
                    />
                }
            </>
        )
    }

    componentDidUpdate(previousProps) {
        let updateState = false;
        let { controlMap, selectedRecord, userRoleControlRights,dataState } = this.state;
        if (this.props.Login.masterData !== previousProps.Login.masterData) {

            if (this.props.Login.userInfo.nformcode !== previousProps.Login.userInfo.nformcode) {
                userRoleControlRights = [];
                if (this.props.Login.userRoleControlRights) {
                    this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode] && Object.values(this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode]).map(item =>
                        userRoleControlRights.push(item.ncontrolcode))
                }
                controlMap = getControlMap(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode)

                
            }
            dataState = {skip:0,take:this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5}
            updateState = true;
        }
        else if (this.props.Login.selectedRecord !== this.state.selectedRecord) {

            selectedRecord = this.props.Login.selectedRecord;
            updateState = true;

        }

        if (updateState) {
            this.setState({
                userRoleControlRights, controlMap, selectedRecord,dataState
            });
        }
    }

    onInputOnChange = (event) => {
        let selectedRecord = this.state.selectedRecord || {};
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

    onInputChangeVersion = (event) => {
        let selectedRecord = this.state.selectedRecord || {};
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

    onComboChange = (comboData, fieldName) => {
        const selectedRecord = this.state.selectedRecord || {};
        if (fieldName === 'nreportcode' || fieldName === 'npreviewreportcode') {
            selectedRecord[fieldName] = comboData;
            this.props.getReportDetailByReport(comboData.value,
                this.props.Login.masterData.selectedCertificateType.ncertificatetypecode,
                selectedRecord, this.props.Login.userInfo, fieldName)

        } else if (fieldName === 'nreportdetailcode') {
            selectedRecord[fieldName] = comboData;
            selectedRecord['sdisplaystatus'] = comboData.item.sdisplaystatus
            selectedRecord['nversionno'] = comboData.item.nversionno
            this.setState({ selectedRecord });
        }
        else if (fieldName === 'npreviewreportdetailcode') {
            selectedRecord[fieldName] = comboData;
            selectedRecord['spreviewdisplaystatus'] = comboData.item.sdisplaystatus
            selectedRecord['npreviewversionno'] = comboData.item.nversionno
            this.setState({ selectedRecord });
        }
        else {
            selectedRecord[fieldName] = comboData;
            this.setState({ selectedRecord });
        }
    }
    closeModal = () => {
        let loadEsign = this.props.Login.loadEsign;
        let openModal = this.props.Login.openModal;
        let openChildModal = this.props.Login.openChildModal;
        let selectedRecord = this.state.selectedRecord;
        if (this.props.Login.loadEsign) {
            if (this.props.Login.operation === "delete") {
                loadEsign = false;
                openModal = false;
                openChildModal = false;
                selectedRecord = {};
            }
            else {
                loadEsign = false;
            }
        }
        else {
            openModal = false;
            openChildModal = false;
            selectedRecord = {};
        }

        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { openModal, openChildModal, loadEsign, selectedRecord, selectedId: null }
        }
        this.props.updateStore(updateInfo);

    }
    onSaveClick = (saveType, formRef) => {

        //add / edit  
        let dataState = undefined;
        let operation = "";
        let inputData = [];
        let selectedId = null;
        inputData["userinfo"] = this.props.Login.userInfo;
        let postParam = {
            selectedObject: "selectedCertificateType",
            primaryKeyField: "ncertificatetypecode",
            inputListName: "certificatetype",
            fetchUrl: "certificatetype/getCertificateTypeByClick",
            fecthInputObject: { userinfo: this.props.Login.userInfo }
        }
        if (this.props.Login.operation === "update") {
            // edit    
            postParam['primaryKeyValue'] = this.props.Login.masterData.selectedCertificateType.ncertificatetypecode;
            let selectedRecord = this.state.selectedRecord ? this.state.selectedRecord : {};
            inputData["certificatetype"] ={'ncertificatetypecode':selectedRecord.ncertificatetypecode};
            inputData["certificatetype"]['nedqm'] =  selectedRecord['nedqm']||transactionStatus.YES
            inputData["certificatetype"]['naccredited'] =  selectedRecord['naccredited']||transactionStatus.YES
            inputData["certificatetype"]['ntransactionstatus'] =  selectedRecord['ntransactionstatus']||transactionStatus.YES
            inputData["certificatetype"]['scertificatetype'] =  selectedRecord['scertificatetype']
            inputData["certificatetype"]['sdescription'] =  selectedRecord['sdescription']||""
            inputData["certificatetype"]["ncertificatereporttypecode"] = selectedRecord["ncertificatereporttypecode"].value;

            operation = "update";
            dataState = this.state.dataState;
            selectedId = this.props.Login.selectedId;
        }
        else {
            //add             
            inputData["certificatetype"] = { "nsitecode": this.props.Login.userInfo.nmastersitecode };
            inputData["certificatetype"]['nedqm'] = this.state.selectedRecord['nedqm']||transactionStatus.YES
            inputData["certificatetype"]['naccredited'] = this.state.selectedRecord['naccredited']||transactionStatus.YES
            inputData["certificatetype"]['ntransactionstatus'] = this.state.selectedRecord['ntransactionstatus']||transactionStatus.YES
            inputData["certificatetype"]['scertificatetype'] = this.state.selectedRecord['scertificatetype']
            inputData["certificatetype"]['sdescription'] = this.state.selectedRecord['sdescription']||""

            inputData["certificatetype"]["ncertificatereporttypecode"] = this.state.selectedRecord["ncertificatereporttypecode"].value;
            operation = "create";
        }

        const inputParam = {
            classUrl: "certificatetype",
            methodUrl: "CertificateType",
            displayName: this.props.Login.inputParam.displayName,
            inputData: inputData,
            postParam,
            searchRef: this.searchRef,
            operation: operation, saveType, formRef, dataState, selectedId
        }
        const esignNeeded = showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolCode);
        if (esignNeeded) {
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
    }

    onSaveVersion = (saveType, formRef) => {
        let dataState = undefined;
        let operation = "";
        let inputData = [];
        let selectedId = null;


        inputData["userinfo"] = this.props.Login.userInfo;

        if (this.props.Login.operation === "update") {
            // edit    
            selectedId = this.props.Login.selectedId;
            inputData["certificatetypeversion"] = {};
            inputData["certificatetypeversion"]["ncertificatetypeversioncode"] = selectedId
            inputData["certificatetypeversion"]["ncertificatetypecode"] = this.props.Login.masterData.selectedCertificateType.ncertificatetypecode;
            inputData["certificatetypeversion"]["nreportdetailcode"] = this.state.selectedRecord["nreportdetailcode"].value;
            inputData["certificatetypeversion"]["npreviewreportdetailcode"] = this.state.selectedRecord["npreviewreportdetailcode"].value;
            inputData["certificatetypeversion"]["ncertificatetypeversionno"] = this.state.selectedRecord["ncertificatetypeversionno"];
            inputData["certificatetypeversion"]["ntransactionstatus"] = this.state.selectedRecord["ntransactionstatus"];
            inputData["certificatetypeversion"]["nversionno"] = this.state.selectedRecord["nversionno"];
            inputData["certificatetypeversion"]["nstatus"] = transactionStatus.ACTIVE;

            operation = "update";
            dataState = this.state.dataState;

        }
        else {
            //add             
            inputData["certificatetypeversion"] = {};
            inputData["certificatetypeversion"]["ncertificatetypecode"] = this.props.Login.masterData.selectedCertificateType.ncertificatetypecode;
            inputData["certificatetypeversion"]["nreportdetailcode"] = this.state.selectedRecord["nreportdetailcode"].value;
            inputData["certificatetypeversion"]["npreviewreportdetailcode"] = this.state.selectedRecord["npreviewreportdetailcode"].value;
            inputData["certificatetypeversion"]["ntransactionstatus"] = this.state.selectedRecord["ntransactionstatus"] || transactionStatus.DEACTIVE;
            inputData["certificatetypeversion"]["nstatus"] = transactionStatus.ACTIVE;
            inputData["certificatetypeversion"]["nversionno"] = this.state.selectedRecord["nversionno"];
            operation = "create";
        }

        const inputParam = {
            classUrl: 'certificatetype',
            methodUrl: 'CertificateTypeVersion',
            displayName: this.props.Login.inputParam.displayName,
            inputData: inputData,
            operation: operation, saveType, formRef, dataState, selectedId
        }
        const esignNeeded = showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolCode);
        if (esignNeeded) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData: this.props.Login.masterData },
                    openChildModal: true, screenName: this.props.intl.formatMessage({ id: this.props.Login.inputParam.displayName }),
                    operation: this.props.Login.operation
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.crudMaster(inputParam, this.props.Login.masterData, "openChildModal");
        }
    }

    ConfirmDelete = (deleteParam) => {
        this.confirmMessage.confirm("deleteMessage", this.props.intl.formatMessage({ id: "IDS_DELETE" }), this.props.intl.formatMessage({ id: "IDS_DEFAULTCONFIRMMSG" }),
            this.props.intl.formatMessage({ id: "IDS_OK" }), this.props.intl.formatMessage({ id: "IDS_CANCEL" }),
            () => this.deleteRecord({ ...deleteParam, selectedRecord: this.props.Login.masterData.selectedCertificateType }));
    }
    deleteRecord = (deleteParam) => {
        //deleteRecord = (selectedRecord, operation, ncontrolCode) => {       
        if (deleteParam.selectedRecord.expanded !== undefined) {
            delete deleteParam.selectedRecord.expanded;
        }
        const inputParam = {
            classUrl: this.props.Login.inputParam.classUrl,
            methodUrl: "CertificateType",
            displayName: this.props.Login.inputParam.displayName,
            inputData: {
                certificatetype: deleteParam.selectedRecord,
                userinfo: this.props.Login.userInfo
            },
            operation: "delete",
            dataState: this.state.dataState
        }
        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, deleteParam.ncontrolCode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData: this.props.Login.masterData },
                    openModal: true, screenName: this.props.intl.formatMessage({ id: this.props.Login.inputParam.displayName }),
                    operation: "delete"
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.crudMaster(inputParam, this.props.Login.masterData, "openModal");
        }
        //this.props.crudMaster(inputParam);
    }

    validateEsign = () => {
        let modalName = this.props.Login.openModal ? 'openModal' : 'openChildModal'
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
        this.props.validateEsignCredential(inputParam, modalName);
    }

    reloadData = () => {
        this.searchRef.current.value = "";
        const inputParam = {
            inputData: { "userinfo": this.props.Login.userInfo },
            classUrl: "certificatetype",
            methodUrl: "CertificateType",
            displayName: "IDS_CERTIFICATETYPE",
            userInfo: this.props.Login.userInfo
        };

        this.props.callService(inputParam);
    }
}
export default connect(mapStateToProps,
    {
        callService, crudMaster, fetchRecordCertificateType, updateStore, getReportDetailByReport, fetchCertificateTypeVersionById,
        validateEsignCredential, filterColumnData, getCertificateTypeVersion, getReportMasterByCertificateType
    })(injectIntl(CertificateType));