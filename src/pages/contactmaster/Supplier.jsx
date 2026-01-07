import React from 'react'
import { Row, Col, Card, Nav, FormGroup, FormLabel } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faTrashAlt, faThumbsUp, faUserLock } from '@fortawesome/free-solid-svg-icons';//,faUserTimes, faTrash
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import { toast } from 'react-toastify';
import {
    callService, crudMaster, validateEsignCredential, updateStore, getSupplierDetail,
    getSupplierComboService, getSupplierCategoryComboDataService, getMaterialCategoryComboDataService, getSupplierContactComboDataService, filterColumnData, addSupplierFile,viewAttachment
} from '../../actions';

import { ReadOnlyText, ContentPanel } from '../../components/App.styles';
import { constructOptionList, getControlMap, showEsign, validateEmail, validatePhoneNumber } from '../../components/CommonScript';//searchData, sortData,
import ListMaster from '../../components/list-master/list-master.component';
import SlideOutModal from '../../components/slide-out-modal/SlideOutModal';
//import Axios from 'axios';
import AddSupplier from './AddSupplier';
import SupplierMaterialCategoryTab from './SupplierMaterialCategoryTab';
import Esign from '../audittrail/Esign';
import { DEFAULT_RETURN } from '../../actions/LoginTypes';
//import MAHContact from './MAHContact';
// import ConfirmDialog from '../../components/confirm-alert/confirm-alert.component';
import { transactionStatus } from '../../components/Enumeration';
// import { Tooltip } from '@progress/kendo-react-tooltip';
import ConfirmMessage from '../../components/confirm-alert/confirm-message.component';
// import ReactTooltip from 'react-tooltip';

const mapStateToProps = state => {
    return ({ Login: state.Login })
}

class Supplier extends React.Component {
    constructor(props) {
        super(props);

        // const dataState = {
        //     skip: 0,
        //     take: 10,
        // };

        this.state = {
            isOpen: false,
            supplierData: [], supplierCategoryData: [], materialCategoryData: [],

            masterStatus: "",
            error: "",
            selectedRecord: {},
            operation: "",

            screenName: undefined,
            userLogged: true,
            selectedSupplier: undefined,
            supplierCategory: [], selectedSupplierCategory: [],
            materialCategory: [], selectMaterialCategory: [],
            userRoleControlRights: [],
            controlMap: new Map(),
            showAccordian: true,
            supplierCategorycombo: [], countryList: [],
            sidebarview: false
        };
        this.searchRef = React.createRef();
        this.confirmMessage = new ConfirmMessage();
        this.supplierFieldList = ['ssuppliername', 'saddress1', 'saddress2', 'saddress3',
            'sphoneno', 'smobileno', 'sfaxno', 'semail', 'ntransactionstatus','napprovalstatus', 'ncountrycode'];//'nmahcode',
      //  this.supplierFieldList = ['ssuppliername', 'ntransactionstatus'];
        this.supplierContactFieldList = ['ssuppliercontactname'];
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
        return null;
    }

    render() {


        let userStatusCSS = "outline-secondary";

        if (this.props.Login.masterData.SelectedSupplier ? this.props.Login.masterData.SelectedSupplier.napprovalstatus === transactionStatus.ACTIVE

            || this.props.Login.masterData.SelectedSupplier.napprovalstatus === transactionStatus.APPROVED : false) {

            userStatusCSS = "outline-success";

        }

        else if (this.props.Login.masterData.SelectedSupplier && this.props.Login.masterData.SelectedSupplier.napprovalstatus === transactionStatus.BLACKLIST) {

            userStatusCSS = "outline-danger";

        }

        const addId = this.state.controlMap.has("AddSupplier") && this.state.controlMap.get("AddSupplier").ncontrolcode;
        const editId = this.state.controlMap.has("EditSupplier") && this.state.controlMap.get("EditSupplier").ncontrolcode;
        const deleteId = this.state.controlMap.has("DeleteSupplier") && this.state.controlMap.get("DeleteSupplier").ncontrolcode
        const approveId = this.state.controlMap.has("ApproveSupplier") && this.state.controlMap.get("ApproveSupplier").ncontrolcode
        const blackListId = this.state.controlMap.has("BlackListSupplier") && this.state.controlMap.get("BlackListSupplier").ncontrolcode
        const filterParam = {
            inputListName: "Supplier",
            selectedObject: "SelectedSupplier",
            primaryKeyField: "nsuppliercode",
            fetchUrl: "supplier/getSupplier",
            fecthInputObject: { userinfo: this.props.Login.userInfo },
            masterData: this.props.Login.masterData,
            searchFieldList: ["ssuppliername", "saddress1", "saddress2", "saddress3", "sphoneno", "scountryname", "smobileno", "sfaxno", "semail", "sdisplaystatus"]

        };
        this.validationColumnList = [
                   { "idsName": "IDS_SUPPLIERNAME", "dataField": "ssuppliername", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
                   ( this.props.Login.operation != "update" ?
                    { "idsName": "IDS_SUPPLIERCONTACTNAME", "dataField": "ssuppliercontactname", "width": "150px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" }: ""),
                    { "idsName": "IDS_ADDRESS1", "dataField": "saddress1", "width": "150px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
                    { "idsName": "IDS_COUNTRY", "dataField": "ncountrycode", "width": "150px", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
                    
        ]
        const mandatoryFields = [];
        this.validationColumnList.forEach(item => item.mandatory === true ?
            mandatoryFields.push(item) : ""
        );
        return (
            <>
                {/* Start of get display*/}
                <div className="client-listing-wrap mtop-4">
                    <Row noGutters={true}>
                        <Col md={`${!this.props.sidebarview ? '4' : "2"}`}> 
                            <ListMaster
                               // formatMessage={this.props.intl.formatMessage}
                                screenName={"IDS_SUPPLIER"}
                                masterData={this.props.Login.masterData}
                                userInfo={this.props.Login.userInfo}
                                masterList={this.props.Login.masterData.searchedData || this.props.Login.masterData.Supplier}
                                getMasterDetail={(supplier) => this.props.getSupplierDetail(supplier, this.props.Login.userInfo, this.props.Login.masterData)}
                                selectedMaster={this.props.Login.masterData.SelectedSupplier}
                                primaryKeyField="nsuppliercode"
                                mainField="ssuppliername"
                                firstField="scountryname"
                                secondField="sdisplaystatus"
                                isIDSField="Yes"
                                //filterColumnData={this.props.filterColumnDataSupplier}
                                filterColumnData={this.props.filterColumnData}
                                filterParam={filterParam}
                                userRoleControlRights={this.state.userRoleControlRights}
                                addId={addId}
                                searchRef={this.searchRef}
                                reloadData={this.reloadData}
                                hidePaging={false}
                                openModal={() => this.props.getSupplierComboService("IDS_SUPPLIER" , "create", "nsuppliercode", null, this.props.Login.masterData, this.props.Login.userInfo, addId)} 
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
                            <ContentPanel className="panel-main-content">
                                <Card className="border-0">
                                    {this.props.Login.masterData ? this.props.Login.masterData.Supplier && this.props.Login.masterData.Supplier.length > 0 && this.props.Login.masterData.SelectedSupplier ?
                                        <>
                                            <Card.Header>
                                                <Card.Title>
                                                    <h1 className="product-title-main">{this.props.Login.masterData.SelectedSupplier.ssuppliername}</h1>
                                                </Card.Title>
                                                <Card.Subtitle className="text-muted font-weight-normal">
                                                    <Row>
                                                        <Col md={10} className="d-flex">
                                                            <h2 className="product-title-sub flex-grow-1">

                                                                <span className={`btn btn-outlined ${userStatusCSS} btn-sm ml-3`}>
                                                                    {this.props.Login.masterData.SelectedSupplier && this.props.Login.masterData.SelectedSupplier.napprovalstatus === transactionStatus.ACTIVE ? <i class="fas fa-check "></i> : ""}
                                                                    <FormattedMessage id={this.props.Login.masterData ?
                                                                         this.props.Login.masterData.SelectedSupplier ? 
                                                                         this.props.Login.masterData.SelectedSupplier.sapprovalstatus:"":""} />
                                                                </span>

                                                            </h2>
                                                        </Col>
                                                        <Col md={2}>
                                                            {/* <Tooltip position="bottom" anchorElement="target" openDelay={100} parentTitle={true}> */}
                                                            {/* <ReactTooltip place="bottom" globalEventOff='click' id="tooltip_list_wrap" /> */}
                                                            <div className="d-flex product-category" style={{ float: "right" }}>
                                                                <Nav.Link className="btn btn-circle outline-grey mr-2"
                                                                    hidden={this.state.userRoleControlRights.indexOf(editId) === -1}
                                                                    data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_EDIT" })}
                                                                    //    data-for="tooltip_list_wrap"
                                                                    onClick={() => this.props.getSupplierComboService("IDS_SUPPLIER", "update", "nsuppliercode", this.props.Login.masterData.SelectedSupplier.nsuppliercode, 
                                                                        this.props.Login.masterData, this.props.Login.userInfo, editId)}
                                                                >
                                                                    <FontAwesomeIcon icon={faPencilAlt} title={this.props.intl.formatMessage({ id: "IDS_EDIT" })} />
                                                                </Nav.Link>
                                                                {/* <Nav.Link className="btn btn-circle outline-grey mr-2 action-icons-wrap"
                                                                onClick={() => this.deleteRecord("Supplier", this.props.Login.masterData.SelectedSupplier, "delete", deleteId)}>
                                                                <FontAwesomeIcon icon={faTrash} />
                                                            </Nav.Link> */}
                                                                <Nav.Link name="deleteSupplier" className="btn btn-circle outline-grey mr-2 action-icons-wrap"
                                                                    hidden={this.state.userRoleControlRights.indexOf(deleteId) === -1}
                                                                    data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_DELETE" })}
                                                                    //   data-for="tooltip_list_wrap"
                                                                    onClick={() => this.ConfirmDelete(deleteId)}
                                                                >
                                                                    <FontAwesomeIcon icon={faTrashAlt} />
                                                                    {/* <ConfirmDialog
                                                                            name="deleteMessage"
                                                                            message={this.props.intl.formatMessage({ id: "IDS_DEFAULTCONFIRMMSG" })}
                                                                            doLabel={this.props.intl.formatMessage({ id: "IDS_OK" })}
                                                                            doNotLabel={this.props.intl.formatMessage({ id: "IDS_CANCEL" })}
                                                                            icon={faTrashAlt}
                                                                            title={this.props.intl.formatMessage({ id: "IDS_DELETE" })}

                                                                            handleClickDelete={() => this.deleteRecord("Supplier", this.props.Login.masterData.SelectedSupplier,
                                                                                "delete", deleteId)}
                                                                        /> */}
                                                                </Nav.Link>
                                                                <Nav.Link className="btn btn-circle outline-grey mr-2"
                                                                    hidden={this.state.userRoleControlRights.indexOf(approveId) === -1}
                                                                    data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_APPROVE" })}
                                                                    // data-for="tooltip_list_wrap"
                                                                    onClick={() => this.onApproveClick()}
                                                                >
                                                                    <FontAwesomeIcon icon={faThumbsUp} title={this.props.intl.formatMessage({ id: "IDS_APPROVE" })} />
                                                                </Nav.Link>
                                                                <Nav.Link className="btn btn-circle outline-grey mr-2"
                                                                    hidden={this.state.userRoleControlRights.indexOf(blackListId) === -1}
                                                                    data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_BLACKLIST" })}
                                                                    //   data-for="tooltip_list_wrap"
                                                                    onClick={() => this.onBlackListClick()}
                                                                >
                                                                    <FontAwesomeIcon icon={faUserLock} title={this.props.intl.formatMessage({ id: "IDS_BLACKLIST" })} />
                                                                </Nav.Link>
                                                            </div>
                                                            {/* </Tooltip> */}
                                                        </Col>
                                                    </Row>
                                                </Card.Subtitle>
                                            </Card.Header>
                                            <Card.Body>
                                                {/* <Card.Text> */}
                                                <Row>
                                                    <Col md={4}>
                                                        <FormGroup>
                                                            <FormLabel><FormattedMessage id="IDS_COUNTRY" message="Country" /></FormLabel>
                                                            <ReadOnlyText>{this.props.Login.masterData.SelectedSupplier.scountryname}</ReadOnlyText>
                                                        </FormGroup>
                                                    </Col>
                                                    <Col md={4}>
                                                        <FormGroup>
                                                            <FormLabel><FormattedMessage id="IDS_ADDRESS1" message="Address1" /></FormLabel>
                                                            <ReadOnlyText>{this.props.Login.masterData.SelectedSupplier.saddress1}</ReadOnlyText>
                                                        </FormGroup>
                                                    </Col>
                                                    <Col md={4}>
                                                        <FormGroup>
                                                            <FormLabel><FormattedMessage id="IDS_ADDRESS2" message="Address2" /></FormLabel>
                                                            <ReadOnlyText> {this.props.Login.masterData.SelectedSupplier.saddress2 === null || this.props.Login.masterData.SelectedSupplier.saddress2.length === 0 ? '-' :
                                                               this.props.Login.masterData.SelectedSupplier.saddress2}</ReadOnlyText>
                                                        </FormGroup>
                                                    </Col>
                                                    <Col md={4}>
                                                        <FormGroup>
                                                            <FormLabel><FormattedMessage id="IDS_ADDRESS3" message="Address3" /></FormLabel>
                                                            <ReadOnlyText> {this.props.Login.masterData.SelectedSupplier.saddress3 === null || this.props.Login.masterData.SelectedSupplier.saddress3.length === 0 ? '-' :
                                                               this.props.Login.masterData.SelectedSupplier.saddress3}</ReadOnlyText>
                                                        </FormGroup>
                                                    </Col>
                                                    <Col md={4}>
                                                        <FormGroup>
                                                            <FormLabel><FormattedMessage id="IDS_PHONENO" message="Phone No" /></FormLabel>
                                                            <ReadOnlyText> {this.props.Login.masterData.SelectedSupplier.sphoneno === null || this.props.Login.masterData.SelectedSupplier.sphoneno.length === 0 ? '-' :
                                                               this.props.Login.masterData.SelectedSupplier.sphoneno}</ReadOnlyText>
                                                        </FormGroup>
                                                    </Col>
                                                    <Col md={4}>
                                                        <FormGroup>
                                                            <FormLabel><FormattedMessage id="IDS_MOBILENO" message="Mobile No" /></FormLabel>
                                                            <ReadOnlyText>{this.props.Login.masterData.SelectedSupplier.smobileno=== null || this.props.Login.masterData.SelectedSupplier.smobileno.length === 0 ? '-' :
                                                             this.props.Login.masterData.SelectedSupplier.smobileno}</ReadOnlyText>
                                                        </FormGroup>
                                                    </Col>
                                                    <Col md={4}>
                                                        <FormGroup>
                                                            <FormLabel><FormattedMessage id="IDS_FAXNO" message="Fax No" /></FormLabel>
                                                            <ReadOnlyText> {this.props.Login.masterData.SelectedSupplier.sfaxno === null || this.props.Login.masterData.SelectedSupplier.sfaxno.length === 0 ? '-' :
                                                               this.props.Login.masterData.SelectedSupplier.sfaxno}</ReadOnlyText>
                                                        </FormGroup>
                                                    </Col>
                                                    <Col md={4}>
                                                        <FormGroup>
                                                            <FormLabel><FormattedMessage id="IDS_EMAIL" message="Email" /></FormLabel>
                                                            <ReadOnlyText>{this.props.Login.masterData.SelectedSupplier.semail=== null || this.props.Login.masterData.SelectedSupplier.semail.length === 0 ? '-' :
                                                             this.props.Login.masterData.SelectedSupplier.semail}</ReadOnlyText>
                                                        </FormGroup>
                                                    </Col>
                                                </Row>
                                                {/* </Card.Text> */}


                                                <SupplierMaterialCategoryTab formatMessage={this.props.intl.formatMessage}
                                                    selectedId = {this.props.Login.selectedId}
                                                    operation={this.props.Login.operation}
                                                    inputParam={this.props.Login.inputParam}
                                                    screenName={this.props.Login.screenName}
                                                    userInfo={this.props.Login.userInfo}
                                                    masterData={this.props.Login.masterData}
                                                    crudMaster={this.props.crudMaster}
                                                    errorCode={this.props.Login.errorCode}
                                                    masterStatus={this.props.Login.masterStatus}
                                                    openChildModal={this.props.Login.openChildModal}
                                                    supplierCategory={this.props.Login.supplierCategory}
                                                    materialCategory={this.props.Login.materialCategory}
                                                    updateStore={this.props.updateStore}
                                                    selectedRecord={this.props.Login.selectedRecord}
                                                    getSupplierCategoryComboDataService={this.props.getSupplierCategoryComboDataService}
                                                    getMaterialCategoryComboDataService={this.props.getMaterialCategoryComboDataService}
                                                    getSupplierContactComboDataService={this.props.getSupplierContactComboDataService}
                                                    ncontrolCode={this.props.Login.ncontrolCode}
                                                    userRoleControlRights={this.state.userRoleControlRights}
                                                    esignRights={this.props.Login.userRoleControlRights}
                                                    screenData={this.props.Login.screenData}
                                                    validateEsignCredential={this.props.validateEsignCredential}
                                                    loadEsign={this.props.Login.loadEsign}
                                                    controlMap={this.state.controlMap}
                                                    showAccordian={this.state.showAccordian}
                                                    //selectedId={this.props.Login.selectedId}
                                                    dataState={this.props.Login.dataState}
                                                    onTabChange={this.onTabChange}
                                                    settings={this.props.Login.settings}
                                                    addSupplierFile={this.props.addSupplierFile}
                                                    viewAttachment={this.props.viewAttachment}
                                                    linkMaster = {this.props.Login.linkMaster}

                                                />
                                            </Card.Body>
                                        </>
                                        : "":""
                                    }
                                </Card>
                            </ContentPanel>
                        </Col>
                    </Row>
                </div>

                {/* End of get display*/}

                {/* Start of Modal Sideout for User Creation */}

                {this.props.Login.openModal &&
                    <SlideOutModal show={this.props.Login.openModal}
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
                        selectedRecord={this.state.selectedRecord || {}}
                        mandatoryFields={mandatoryFields}
                        addComponent={this.props.Login.loadEsign ?
                            <Esign operation={this.props.Login.operation}
                                formatMessage={this.props.intl.formatMessage}
                                onInputOnChange={this.onInputOnChange}
                                inputParam={this.props.Login.inputParam}
                                selectedRecord={this.state.selectedRecord || {}}
                            />
                            : <AddSupplier
                                selectedRecord={this.state.selectedRecord || {}}
                                onInputOnChange={this.onInputOnChange}
                                onComboChange={this.onComboChange}
                                handleDateChange={this.handleDateChange}
                                formatMessage={this.props.intl.formatMessage}
                                countryList={this.state.countryList || []}//{this.props.Login.countryList || []}
                                selectedSupplier={this.props.Login.masterData.SelectedSupplier || {}}
                                operation={this.props.Login.operation}
                                userLogged={this.props.Login.userLogged}
                                inputParam={this.props.Login.inputParam}
                            />}
                    />
                }
                {/* End of Modal Sideout for User Creation */}
            </>
        );
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
        if (this.props.Login.countryList !== previousProps.Login.countryList) {

            const countryList = constructOptionList(this.props.Login.countryList || [], "ncountrycode",
                "scountryname", undefined, undefined, undefined);
            const countryListSupplier = countryList.get("OptionList");

            this.setState({ countryList: countryListSupplier });
        }
    }

    ConfirmDelete = (deleteId) => {
        this.confirmMessage.confirm("deleteMessage", this.props.intl.formatMessage({ id: "IDS_DELETE" }), this.props.intl.formatMessage({ id: "IDS_DEFAULTCONFIRMMSG" }),
            this.props.intl.formatMessage({ id: "IDS_OK" }), this.props.intl.formatMessage({ id: "IDS_CANCEL" }),
            () => this.deleteRecord("Supplier", this.props.Login.masterData.SelectedSupplier, "delete", deleteId));
    }
    deleteRecord = (methodUrl, selectedRecord, operation, ncontrolCode) => {
        if (this.props.Login.masterData.SelectedSupplier.napprovalstatus === transactionStatus.RETIRED ||
            this.props.Login.masterData.SelectedSupplier.napprovalstatus === transactionStatus.APPROVED ||
            this.props.Login.masterData.SelectedSupplier.napprovalstatus === transactionStatus.BLACKLIST) {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_CANNOTDELETEAPPROVESUPPLIER" }));
        }
        else {

            const postParam = {
                inputListName: "Supplier", selectedObject: "SelectedSupplier",
                primaryKeyField: "nsuppliercode",
                primaryKeyValue: this.props.Login.masterData.SelectedSupplier.nsuppliercode,
                fetchUrl: "supplier/getSupplier",
                fecthInputObject: { userinfo: this.props.Login.userInfo },
            }

            const inputParam = {
                classUrl: "supplier", //this.props.Login.inputParam.classUrl,
                methodUrl, postParam,
                inputData: {
                    [methodUrl.toLowerCase()]: selectedRecord,
                    "userinfo": this.props.Login.userInfo,
                    "supplier": this.props.Login.masterData.SelectedSupplier
                },
                operation,
                selectedRecord:{...this.state.selectedRecord}
            }

            const masterData = this.props.Login.masterData;


            if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, ncontrolCode)) {
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        loadEsign: true, screenData: { inputParam, masterData },
                        openModal: true, screenName: "supplier", operation
                    }
                }
                this.props.updateStore(updateInfo);
            }
            else {
                this.props.crudMaster(inputParam, masterData, "openModal");
            }
        }
    }

    onApproveClick = () => {
        //if (this.props.Login.masterData.SelectedSupplier.ntransactionstatus === transactionStatus.DRAFT) {
        const ncontrolCode = this.state.controlMap.has("ApproveSupplier") && this.state.controlMap.get("ApproveSupplier").ncontrolcode
        let inputData = [];
        inputData["userinfo"] = this.props.Login.userInfo;
        //add               
        let postParam = undefined;
        inputData["supplier"] = { "nsuppliercode": this.props.Login.masterData.SelectedSupplier["nsuppliercode"] ? this.props.Login.masterData.SelectedSupplier["nsuppliercode"].Value : "" };
        inputData["supplier"] = this.props.Login.masterData.SelectedSupplier;
        postParam = { inputListName: "Supplier", selectedObject: "SelectedSupplier", primaryKeyField: "nsuppliercode" };
        const inputParam = {
            classUrl: 'supplier',
            methodUrl: "Supplier",
            inputData: inputData,
            operation: "approve", postParam,
            selectedRecord:{...this.state.selectedRecord}
        }
        let saveType;

        const masterData = this.props.Login.masterData;

        const esignNeeded = showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, ncontrolCode);
        if (esignNeeded) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData }, saveType, openModal: true, operation: "approve"
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.crudMaster(inputParam, masterData, "openModal");
        }

        // }
        // else {
        //     toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTDRAFTRECORDTOAPPROVE" }));
        // }
    }

    onBlackListClick = () => {
        //if (this.props.Login.masterData.SelectedSupplier.ntransactionstatus === transactionStatus.DRAFT) {
        const ncontrolCode = this.state.controlMap.has("BlackListSupplier") && this.state.controlMap.get("BlackListSupplier").ncontrolcode
        let inputData = [];
        inputData["userinfo"] = this.props.Login.userInfo;
        //add               
        let postParam = undefined;
        inputData["supplier"] = { "nsuppliercode": this.props.Login.masterData.SelectedSupplier["nsuppliercode"] ? this.props.Login.masterData.SelectedSupplier["nsuppliercode"].Value : "" };
        inputData["supplier"] = this.props.Login.masterData.SelectedSupplier;
        postParam = { inputListName: "Supplier", selectedObject: "SelectedSupplier", primaryKeyField: "nsuppliercode" };
        const inputParam = {
            classUrl: 'supplier',
            methodUrl: "Supplier",
            inputData: inputData,
            operation: "blackList", postParam,
            selectedRecord:{...this.state.selectedRecord}
        }
        let saveType;

        const masterData = this.props.Login.masterData;

        const esignNeeded = showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, ncontrolCode);
        if (esignNeeded) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData }, saveType, openModal: true, operation: "blackList"
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.crudMaster(inputParam, masterData, "openModal");
        }

        // }
        // else {
        //     toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTDRAFTRECORDTOAPPROVE" }));
        // }
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



    closeModal = () => {
        let loadEsign = this.props.Login.loadEsign;
        let openModal = this.props.Login.openModal;
        let selectedRecord = this.props.Login.selectedRecord;
        if (this.props.Login.loadEsign) {
            if (this.props.Login.operation === "delete" || this.props.Login.operation === "approve"
                || this.props.Login.operation === "blackList") {
                loadEsign = false;
                openModal = false;
                selectedRecord = {};
            }
            else {
                loadEsign = false;
                selectedRecord['esignpassword'] = undefined;
                selectedRecord['esigncomments'] = undefined;
                selectedRecord['esignreason']=undefined;
                
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

    onComboChange = (comboData, fieldName) => {
        const selectedRecord = this.state.selectedRecord || {};
        selectedRecord[fieldName] = comboData;;

        this.setState({ selectedRecord });
    }

    onInputOnChange = (event, optional) => {
        const selectedRecord = this.state.selectedRecord || {};
        if (event.target.type === 'checkbox') {
            if (event.target.name === "ntransactionstatus")
                selectedRecord[event.target.name] = event.target.checked === true ? transactionStatus.ACTIVE : transactionStatus.DEACTIVE;
            else
                selectedRecord[event.target.name] = event.target.checked === true ? transactionStatus.YES : transactionStatus.NO;
        }
        else if (event.target.type === 'radio') {
            selectedRecord[event.target.name] = optional;
        }
        // if (event.target.type === 'checkbox') {
        //     if (event.target.name === "ntransactionstatus")
        //         selectedRecord[event.target.name] = event.target.checked === true ? transactionStatus.ACTIVE : transactionStatus.DEACTIVE;
        //     // else if (event.target.name === "nlockmode")
        //     //     selectedRecord[event.target.name] = event.target.checked === true ? transactionStatus.UNLOCK : transactionStatus.LOCK;
        //     else
        //         selectedRecord[event.target.name] = event.target.checked === true ? transactionStatus.YES : transactionStatus.NO;
        // }
        else {
            if (event.target.name === "sphoneno" || event.target.name === "smobileno") {
                if (event.target.value !== "") {
                    event.target.value = validatePhoneNumber(event.target.value);
                    selectedRecord[event.target.name] = event.target.value !== "" ? event.target.value : selectedRecord[event.target.name];
                } else {
                    selectedRecord[event.target.name] = event.target.value
                }
            }

            else {
                selectedRecord[event.target.name] = event.target.value;
            }
        }
        //}
        this.setState({ selectedRecord });
    }


    onSaveClick = (saveType, formRef) => {
        if (this.state.selectedRecord['semail'] ? validateEmail(this.state.selectedRecord['semail']) : true) {
            let inputData = [];
            inputData["userinfo"] = this.props.Login.userInfo;
            let postParam = undefined;
            if (this.props.Login.operation === "update") {
                // edit
                postParam = { inputListName: "Supplier", selectedObject: "SelectedSupplier", primaryKeyField: "nsuppliercode" };
                inputData["supplier"] = JSON.parse(JSON.stringify(this.props.Login.selectedRecord));

                this.supplierFieldList.map(item => {
                    return inputData["supplier"][item] = this.state.selectedRecord[item] ? this.state.selectedRecord[item] : "";
                })
                if (this.props.Login.operation != "update") {
                    this.supplierContactFieldList.map(item => {
                        return inputData["suppliercontact"][item] = this.state.selectedRecord[item] ? this.state.selectedRecord[item] : "";
                    })
                }
            }
            else {
                //add               
                inputData["supplier"] = { "nsitecode": this.props.Login.userInfo.nmastersitecode };
                inputData["suppliercontact"] = { "nsitecode": this.props.Login.userInfo.nmastersitecode };

                this.supplierFieldList.map(item => {
                    return inputData["supplier"][item] = this.state.selectedRecord[item]
                });

                this.supplierContactFieldList.map(item => {
                    return inputData["suppliercontact"][item] = this.state.selectedRecord[item]
                });
                inputData["suppliercontact"]["ndefaultstatus"]=transactionStatus.YES;
                inputData["supplier"]["napprovalstatus"] = "8";
            }
            inputData["supplier"]["ncountrycode"] = this.state.selectedRecord["ncountrycode"] ? this.state.selectedRecord["ncountrycode"].value : "-1";

            if(inputData["supplier"]){
                delete  inputData["supplier"]['esignpassword'] 
                delete  inputData["supplier"]['esigncomments']   
                delete  inputData["supplier"]['esignreason']  
                delete  inputData["supplier"]['agree']  
           }
  
           let clearSelectedRecordField =  [
            { "idsName": "IDS_SUPPLIERNAME", "dataField": "ssuppliername", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "textbox","isClearField":true },
            { "idsName": "IDS_SUPPLIERCONTACTNAME", "dataField": "ssuppliercontactname", "width": "150px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "textbox","isClearField":true },
             { "idsName": "IDS_ADDRESS1", "dataField": "saddress1", "width": "150px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "textbox","isClearField":true },
             { "idsName": "IDS_ADDRESS2", "dataField": "saddress2", "width": "150px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "textbox","isClearField":true },
             { "idsName": "IDS_ADDRESS3", "dataField": "saddress3", "width": "150px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "textbox","isClearField":true },
             { "idsName": "IDS_PHONENO", "dataField": "sphoneno", "width": "150px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "textbox","isClearField":true },
             { "idsName": "IDS_MOBILENO", "dataField": "smobileno", "width": "150px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "textbox","isClearField":true },
             { "idsName": "IDS_FAXNO", "dataField": "sfaxno", "width": "150px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "textbox","isClearField":true },
             { "idsName": "IDS_EMAIL", "dataField": "semail", "width": "150px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "textbox","isClearField":true },
             {"idsName":"IDS_TRANSACTIONSTATUSACTIVE","dataField":"ntransactionstatus","width":"200px","isClearField":true,"preSetValue":1},
              ];

            const inputParam = {
                classUrl: "supplier", //this.props.Login.inputParam.classUrl,
                methodUrl: "Supplier",
                inputData: inputData,
                operation: this.props.Login.operation,
                saveType, formRef, postParam, searchRef: this.searchRef,
                selectedRecord:{...this.state.selectedRecord}

            }
            const masterData = this.props.Login.masterData;

            if (
                showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolCode)) {
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        loadEsign: true, screenData: { inputParam, masterData }, saveType
                    }
                }
                this.props.updateStore(updateInfo);
            }
            else {
                this.props.crudMaster(inputParam, masterData, "openModal","","",clearSelectedRecordField);
            }
        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_ENTERVALIDEMAIL" }));
        }
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
    reloadData = () => {
    //ALPD-4803 done by Dhanushya RI,To check searchref key is present or not
if (this.searchRef && this.searchRef.current) {
            this.searchRef.current.value = "";
          }        
        const inputParam = {
            inputData: { "userinfo": this.props.Login.userInfo },
            classUrl: "supplier",
            methodUrl: "Supplier",
            displayName: "IDS_SUPPLIER",
            userInfo: this.props.Login.userInfo
        };

        this.props.callService(inputParam);
    }
    onTabChange = (tabProps) => {
        const screenName = tabProps.screenName;
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { screenName }
        }
        this.props.updateStore(updateInfo);
    }
}
export default connect(mapStateToProps, {
    callService, crudMaster, validateEsignCredential,
    updateStore, getSupplierDetail, getSupplierComboService,viewAttachment, getSupplierCategoryComboDataService, getMaterialCategoryComboDataService, getSupplierContactComboDataService, filterColumnData, addSupplierFile
})(injectIntl(Supplier));

