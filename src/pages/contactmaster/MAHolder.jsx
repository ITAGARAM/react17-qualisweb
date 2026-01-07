import React from 'react'
import { Row, Col, Card, Nav, FormGroup, FormLabel } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faTrashAlt } from '@fortawesome/free-solid-svg-icons';//faUserTimes, faTrash
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import { toast } from 'react-toastify';
// import { Tooltip } from '@progress/kendo-react-tooltip';
//import rsapi from '../../rsapi';
//import { callService, crudMaster } from '../../actions';
import {
    callService, crudMaster, validateEsignCredential, updateStore, getMAHolderDetail,
    getMAHolderComboService, getMAHContactComboDataService, filterColumnData
} from '../../actions';
import { ContentPanel, ReadOnlyText} from '../../components/App.styles';
import { constructOptionList, getControlMap, showEsign } from '../../components/CommonScript';//searchData, sortData,
import ListMaster from '../../components/list-master/list-master.component';
import SlideOutModal from '../../components/slide-out-modal/SlideOutModal';
//import Axios from 'axios';
import AddMAHolder from './AddMAHolder';
import MAHContact from './MAHContact';
import Esign from '../audittrail/Esign';
import { DEFAULT_RETURN } from '../../actions/LoginTypes';
// import ConfirmDialog from '../../components/confirm-alert/confirm-alert.component';
import { transactionStatus } from '../../components/Enumeration';
import ConfirmMessage from '../../components/confirm-alert/confirm-message.component';
// import ReactTooltip from 'react-tooltip';

const mapStateToProps = state => {
    return ({ Login: state.Login })
}

class MAHolder extends React.Component {
    constructor(props) {
        super(props);

        // const dataState = {
        //     skip: 0,
        //     take: 10,
        // };

        this.state = {

            isOpen: false,
            maHolderData: [], maHContactData: [],

            masterStatus: "",
            error: "",
            selectedRecord: {},
            operation: "",

            screenName: undefined,
            userLogged: true,
            selectedmaHolder: undefined,
            userRoleControlRights: [],
            controlMap: new Map(), countryList: []
        };
        this.searchRef = React.createRef();
        this.userFieldList = ['smahname', 'saddress1',
            'saddress2', 'saddress3', 'ntransactionstatus', 'ncountrycode'];//'nmahcode',
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

    ConfirmDelete = (deleteId) => {
        this.confirmMessage.confirm("deleteMessage", this.props.intl.formatMessage({ id: "IDS_DELETE" }), this.props.intl.formatMessage({ id: "IDS_DEFAULTCONFIRMMSG" }),
            this.props.intl.formatMessage({ id: "IDS_OK" }), this.props.intl.formatMessage({ id: "IDS_CANCEL" }), () => this.deleteRecord("MarketAuthorisationHolder", this.props.Login.masterData.SelectedMAHolder,
                "delete", deleteId));
    }

    render() {
        this.confirmMessage = new ConfirmMessage();

        let userStatusCSS = "outline-secondary";
        if (this.props.Login.masterData.SelectedMAHolder && this.props.Login.masterData.SelectedMAHolder.ntransactionstatus === transactionStatus.ACTIVE) {
            userStatusCSS = "outline-success";
        }
        // else if (this.state.selectedmaHolder && this.state.selectedmaHolder.ntransactionstatus === 7) {
        //     userStatusCSS = "outline-danger";
        // }

        this.validationColumnList = [
            { "idsName": "IDS_MAHNAME", "dataField": "smahname", "width": "200px", "mandatory": true, "mandatoryLabel":"IDS_ENTER", "controlType": "textbox" },
            { "idsName": "IDS_ADDRESS1", "dataField": "saddress1", "width": "150px", "mandatory": true, "mandatoryLabel":"IDS_ENTER", "controlType": "textbox" },
            { "idsName": "IDS_COUNTRY", "dataField": "ncountrycode", "width": "150px", "mandatory": true , "mandatoryLabel":"IDS_SELECT", "controlType": "selectbox"},

        ]

        const addId = this.state.controlMap.has("AddMAHolder") && this.state.controlMap.get("AddMAHolder").ncontrolcode;
        const editId = this.state.controlMap.has("EditMAHolder") && this.state.controlMap.get("EditMAHolder").ncontrolcode;
        const deleteId = this.state.controlMap.has("DeleteMAHolder") && this.state.controlMap.get("DeleteMAHolder").ncontrolcode

        const filterParam = {
            inputListName: "MAHolder", selectedObject: "SelectedMAHolder", primaryKeyField: "nmahcode",
            fetchUrl: "marketauthorisationholder/getMarketAuthorisationHolder", fecthInputObject: { userinfo: this.props.Login.userInfo },
            masterData: this.props.Login.masterData, searchFieldList: this.userFieldList
        };
        const mandatoryFields = [];
        this.validationColumnList.forEach(item => item.mandatory === true ?
            mandatoryFields.push(item) : ""
        );
        return (
            <>
                {/* Start of get display*/}
                <div className="client-listing-wrap mtop-4">
                    <Row noGutters={true}>
                        <Col md={4}>
                            <ListMaster
                                formatMessage={this.props.intl.formatMessage}
                                screenName={this.props.intl.formatMessage({ id: "IDS_MAHOLDER" })}
                                masterData={this.props.Login.masterData}
                                userInfo={this.props.Login.userInfo}
                                masterList={this.props.Login.masterData.searchedData || this.props.Login.masterData.MAHolder}
                                getMasterDetail={(maHolder) => this.props.getMAHolderDetail(maHolder, this.props.Login.userInfo, this.props.Login.masterData)}
                                selectedMaster={this.props.Login.masterData.SelectedMAHolder}
                                primaryKeyField="nmahcode"
                                mainField="smahname"
                                firstField="scountryname"
                                secondField="sdisplaystatus"
                                isIDSField="Yes"
                                filterColumnData={this.props.filterColumnData}
                                filterParam={filterParam}
                                userRoleControlRights={this.state.userRoleControlRights}
                                addId={addId}
                                reloadData={this.reloadData}
                                searchRef={this.searchRef}
                                hidePaging={false}
                                openModal={() => this.props.getMAHolderComboService("MA Holder", "create", "nmahcode", null, this.props.Login.masterData, this.props.Login.userInfo, addId)}
                            />
                        </Col>
                        <Col md={8}>
                            <ContentPanel className="panel-main-content">
                                <Card className="border-0">
                                    {this.props.Login.masterData.MAHolder && this.props.Login.masterData.MAHolder.length > 0 && this.props.Login.masterData.SelectedMAHolder ?
                                        <>
                                            <Card.Header>
                                                <Card.Title>
                                                    <h1 className="product-title-main">{this.props.Login.masterData.SelectedMAHolder.smahname}</h1>
                                                </Card.Title>
                                                <Card.Subtitle className="text-muted font-weight-normal">
                                                    {/* <Row>
                                                        <Col md={10} className="d-flex"> */}
                                                    <div className="d-flex product-category">
                                                        <h2 className="product-title-sub flex-grow-1">

                                                            <span className={`btn btn-outlined ${userStatusCSS} btn-sm ml-3`}>
                                                                {this.props.Login.masterData && this.props.Login.masterData.SelectedMAHolder.ntransactionstatus === transactionStatus.ACTIVE ? <i class="fas fa-check "></i> : ""}
                                                                <FormattedMessage id={this.props.Login.masterData.SelectedMAHolder.sdisplaystatus} />
                                                            </span>

                                                        </h2>
                                                        {/* </Col>
                                                        <Col md={2}> */}
                                                        <div className="d-flex product-category" style={{ float: "right" }}>
                                                            {/* <Tooltip position="bottom" anchorElement="target" openDelay={100} parentTitle={true}> */}
                                                            {/* <ReactTooltip place="bottom" globalEventOff='click' id="tooltip_list_wrap" /> */}
                                                            <Nav.Link className="btn btn-circle outline-grey mr-2"
                                                                hidden={this.state.userRoleControlRights.indexOf(editId) === -1}
                                                                onClick={() => this.props.getMAHolderComboService("MA Holder", "update", "nmahcode",
                                                                    this.props.Login.masterData.SelectedMAHolder.nmahcode, this.props.Login.masterData, this.props.Login.userInfo,
                                                                    editId)}
                                                                data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_EDIT" })}
                                                              //  data-for="tooltip_list_wrap"
                                                            >
                                                                <FontAwesomeIcon icon={faPencilAlt} />
                                                            </Nav.Link>

                                                            {/* <Nav.Link className="btn btn-circle outline-grey mr-2 action-icons-wrap"

                                                                    hidden={this.state.userRoleControlRights.indexOf(deleteId) === -1}
                                                                    onClick={() => this.deleteRecord("MarketAuthorisationHolder", this.props.Login.masterData.SelectedMAHolder,
                                                                        "delete", deleteId)}>
                                                                    <FontAwesomeIcon icon={faTrash} />
                                                                </Nav.Link> */}


                                                            <Nav.Link name="deleteMAHolder" className="btn btn-circle outline-grey mr-2"
                                                                hidden={this.state.userRoleControlRights.indexOf(deleteId) === -1}
                                                                data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_DELETE" })}
                                                            //    data-for="tooltip_list_wrap"
                                                                onClick={() => this.ConfirmDelete(deleteId)}>
                                                                <FontAwesomeIcon icon={faTrashAlt} />
                                                                {/* <ConfirmDialog
                                                                            name="deleteMessage"
                                                                            message={this.props.intl.formatMessage({ id: "IDS_DEFAULTCONFIRMMSG" })}
                                                                            doLabel={this.props.intl.formatMessage({ id: "IDS_OK" })}
                                                                            doNotLabel={this.props.intl.formatMessage({ id: "IDS_CANCEL" })}
                                                                            icon={faTrashAlt}
                                                                            title={this.props.intl.formatMessage({ id: "IDS_DELETE" })}

                                                                            handleClickDelete={() => this.deleteRecord("MarketAuthorisationHolder", this.props.Login.masterData.SelectedMAHolder,
                                                                                "delete", deleteId)}
                                                                        /> */}
                                                            </Nav.Link>

                                                            {/* <Nav.Link name="deleteMAHolder" className="btn btn-circle outline-grey mr-2 action-icons-wrap"
                                                                        hidden={this.state.userRoleControlRights.indexOf(deleteId) === -1}
                                                                        title={this.props.intl.formatMessage({ id: "IDS_DELETE" })}>
                                                                        <ConfirmDialog
                                                                            name="deleteMessage"
                                                                            message={this.props.intl.formatMessage({ id: "IDS_DEFAULTCONFIRMMSG" })}
                                                                            doLabel={this.props.intl.formatMessage({ id: "IDS_OK" })}
                                                                            doNotLabel={this.props.intl.formatMessage({ id: "IDS_CANCEL" })}
                                                                            icon={faTrashAlt}
                                                                            title={this.props.intl.formatMessage({ id: "IDS_DELETE" })}

                                                                            handleClickDelete={() => this.deleteRecord("MarketAuthorisationHolder", this.props.Login.masterData.SelectedMAHolder,
                                                                                "delete", deleteId)}
                                                                        />
                                                                    </Nav.Link> */}
                                                            {/* </Tooltip> */}
                                                        </div>
                                                    </div>
                                                    {/* </Col>
                                                    </Row> */}
                                                </Card.Subtitle>
                                            </Card.Header>
                                            <Card.Body>
                                                {/* <Card.Text> */}
                                                <Row>
                                                    <Col md={4}>
                                                        <FormGroup>
                                                            <FormLabel><FormattedMessage id="IDS_COUNTRY" message="Country" /></FormLabel>
                                                            <ReadOnlyText>{this.props.Login.masterData.SelectedMAHolder.scountryname}</ReadOnlyText>
                                                        </FormGroup>
                                                    </Col>
                                                    <Col md={4}>
                                                        <FormGroup>
                                                            <FormLabel><FormattedMessage id="IDS_ADDRESS1" message="Address 1" /></FormLabel>
                                                            <ReadOnlyText>{this.props.Login.masterData.SelectedMAHolder.saddress1}</ReadOnlyText>
                                                        </FormGroup>
                                                    </Col>
                                                    <Col md={4}>
                                                        <FormGroup>
                                                            <FormLabel><FormattedMessage id="IDS_ADDRESS2" message="Address 2" /></FormLabel>
                                                            <ReadOnlyText>
                                                            {this.props.Login.masterData.SelectedMAHolder.saddress2 === null || this.props.Login.masterData.SelectedMAHolder.saddress2.length === 0 ? '-' :
                                                               this.props.Login.masterData.SelectedMAHolder.saddress2}</ReadOnlyText>
                                                        </FormGroup>
                                                    </Col>
                                                    <Col md={4}>
                                                        <FormGroup>
                                                            <FormLabel><FormattedMessage id="IDS_ADDRESS3" message="Address 3" /></FormLabel>
                                                            <ReadOnlyText> {this.props.Login.masterData.SelectedMAHolder.saddress3 === null || this.props.Login.masterData.SelectedMAHolder.saddress3.length === 0 ? '-' :
                                                               this.props.Login.masterData.SelectedMAHolder.saddress3}</ReadOnlyText>
                                                        </FormGroup>
                                                    </Col>
                                                </Row>
                                                {/* </Card.Text> */}

                                                <MAHContact formatMessage={this.props.intl.formatMessage}
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
                                                    getMAHContactComboDataService={this.props.getMAHContactComboDataService}
                                                    ncontrolCode={this.props.Login.ncontrolCode}
                                                    userRoleControlRights={this.state.userRoleControlRights}
                                                    esignRights={this.props.Login.userRoleControlRights}
                                                    screenData={this.props.Login.screenData}
                                                    validateEsignCredential={this.props.validateEsignCredential}
                                                    loadEsign={this.props.Login.loadEsign}
                                                    controlMap={this.state.controlMap}
                                                    showAccordian={this.state.showAccordian}
                                                    dataState={this.props.Login.dataState}
                                                    selectedId={this.props.Login.selectedId}
                                                    settings = {this.props.Login.settings}
                                                />
                                            </Card.Body>
                                        </>
                                        : ""
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
                            : <AddMAHolder
                                selectedRecord={this.state.selectedRecord || {}}
                                onInputOnChange={this.onInputOnChange}
                                onComboChange={this.onComboChange}
                                formatMessage={this.props.intl.formatMessage}
                                countryList={this.state.countryList || []}//{this.props.Login.countryList || []}
                                selectedmaHolder={this.props.Login.masterData.SelectedMAHolder || {}}
                                operation={this.props.Login.operation}
                                userLogged={this.props.Login.userLogged}
                                inputParam={this.props.Login.inputParam}
                                selectedId={this.props.Login.selectedId}
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
            const countryListMAHolder = countryList.get("OptionList");

            this.setState({ countryList: countryListMAHolder });
        }
    }

    closeModal = () => {
        let loadEsign = this.props.Login.loadEsign;
        let openModal = this.props.Login.openModal;
        let selectedRecord = this.props.Login.selectedRecord;
        if (this.props.Login.loadEsign) {
            if (this.props.Login.operation === "delete" || this.props.Login.operation === "retire") {
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


    onComboChange = (comboData, fieldName) => {
        const selectedRecord = this.state.selectedRecord || {};
        selectedRecord[fieldName] = comboData;;

        this.setState({ selectedRecord });
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


    onSaveClick = (saveType, formRef) => {

        let inputData = [];
        inputData["userinfo"] = this.props.Login.userInfo;
        let postParam = undefined;
        if (this.props.Login.operation === "update") {
            // edit
            postParam = { inputListName: "MAHolder", selectedObject: "SelectedMAHolder", primaryKeyField: "nmahcode" };
            //inputData["marketauthorisationholder"] = this.state.selectedRecord;
            inputData["marketauthorisationholder"] = JSON.parse(JSON.stringify(this.state.selectedRecord));
            this.userFieldList.map(item => {
                return inputData["marketauthorisationholder"][item] = this.state.selectedRecord[item] ? this.state.selectedRecord[item] : "";
            })
        }
        else {
            //add               
            inputData["marketauthorisationholder"] = { "nsitecode": this.props.Login.userInfo.nmastersitecode };

            this.userFieldList.map(item => {
                return inputData["marketauthorisationholder"][item] = this.state.selectedRecord[item]
            });
        }
        inputData["marketauthorisationholder"]["ncountrycode"] = this.state.selectedRecord["ncountrycode"] ? this.state.selectedRecord["ncountrycode"].value : "-1";

        const inputParam = {
            classUrl: "marketauthorisationholder", //this.props.Login.inputParam.classUrl,
            methodUrl: "MarketAuthorisationHolder",
            inputData: inputData,
            operation: this.props.Login.operation,
            saveType, formRef, postParam, searchRef: this.searchRef
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
            this.props.crudMaster(inputParam, masterData, "openModal");
        }

    }

    deleteRecord = (methodUrl, selectedRecord, operation, ncontrolCode) => {
        if (this.props.Login.masterData.SelectedMAHolder.ntransactionstatus === transactionStatus.RETIRED) {
            toast.warn(this.props.intl.formatMessage({ id: this.props.Login.masterData.SelectedMAHolder.stransstatus }));
        }
        else {

            const postParam = {
                inputListName: "MarketAuthorisationHolder", selectedObject: "SelectedMAHolder",
                primaryKeyField: "nmahcode",
                primaryKeyValue: this.props.Login.masterData.SelectedMAHolder.nmahcode,
                fetchUrl: "marketauthorisationholder/getMarketAuthorisationHolder",
                fecthInputObject: { userInfo: this.props.Login.userInfo },
            }

            const inputParam = {
                classUrl: "marketauthorisationholder", //this.props.Login.inputParam.classUrl,
                methodUrl, postParam,
                inputData: {
                    [methodUrl.toLowerCase()]: selectedRecord,
                    "userinfo": this.props.Login.userInfo,
                    "marketauthorisationholder": this.props.Login.masterData.SelectedMAHolder
                },
                operation
            }

            const masterData = this.props.Login.masterData;


            if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, ncontrolCode)) {
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        loadEsign: true, screenData: { inputParam, masterData },
                        openModal: true, screenName: "marketauthorisationholder", operation
                    }
                }
                this.props.updateStore(updateInfo);
            }
            else {
                this.props.crudMaster(inputParam, masterData, "openModal");
            }
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

    reloadData = () => {
        this.searchRef.current.value = "";
        const inputParam = {
            inputData: { "userinfo": this.props.Login.userInfo },
            displayName: "IDS_MAHOLDER",
            classUrl: "marketauthorisationholder",
            methodUrl: "MarketAuthorisationHolder",
            userInfo: this.props.Login.userInfo
        };

        this.props.callService(inputParam);
    }
}
export default connect(mapStateToProps, {
    callService, crudMaster, validateEsignCredential,
    updateStore, getMAHolderDetail, getMAHolderComboService, getMAHContactComboDataService, filterColumnData
})(injectIntl(MAHolder));

