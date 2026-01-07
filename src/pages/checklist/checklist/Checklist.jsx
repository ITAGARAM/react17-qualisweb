import React from 'react'
import { Row, Col, Card, Nav, FormGroup, FormLabel } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faPencilAlt, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import {
    callService, crudMaster, validateEsignCredential, updateStore, getChecklistVersion, getVersionQB, viewVersionTemplate, onSaveTemplate,
    showChecklistAddScreen, fetchChecklistRecordByID, filterColumnData
} from '../../../actions';
import { process } from '@progress/kendo-data-query';
import { toast } from 'react-toastify';
import TemplateForm from './TemplateForm';
import ListMaster from '../../../components/list-master/list-master.component';
import ChecklistForms from './ChecklistForms';
import { getSaveInputData, versionCreate, templateChangeHandler } from './checklistMethods'
import { DEFAULT_RETURN } from '../../../actions/LoginTypes';
import { showEsign, getControlMap } from '../../../components/CommonScript';
// import ConfirmDialog from '../../../components/confirm-alert/confirm-alert.component';
import { ProductList } from '../../testmanagement/testmaster-styled';
import { transactionStatus } from '../../../components/Enumeration';
import CustomAccordion from '../../../components/custom-accordion/custom-accordion.component';
import ChecklistVersionAccordion from './ChecklistVersionAccordion';
import { ContentPanel, ReadOnlyText } from '../../../components/App.styles';
// import { Tooltip } from '@progress/kendo-react-tooltip';
import ConfirmMessage from '../../../components/confirm-alert/confirm-message.component';
// import ReactTooltip from 'react-tooltip';

const mapStateToProps = state => {
    return ({ Login: state.Login })
}

class Checklist extends React.Component {
    constructor(props) {
        super(props)
        this.formRef = React.createRef();
        this.searchRef = React.createRef();
        const dataState = {
            skip: 0,
            take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5
        };
        this.state = {

            masterStatus: "", error: "",
            dataState: dataState,
            selectedRecord: {},
            availableQB: [], QBCategory: undefined, QB: undefined, listQb: {},
            userRoleControlRights: [],
            controlMap: new Map(),
            sidebarview: false
        };
        this.confirmMessage = new ConfirmMessage();
    }
    sidebarExpandCollapse = () => {
        this.setState({
            sidebarview: true
        })          
    }

    handleClose = () => {
        let loadEsign = this.props.Login.loadEsign;
        let openModal = this.props.Login.openModal;
        let openChildModal = this.props.Login.openChildModal
        let selectedRecord = this.props.Login.selectedRecord;
        let templateData = this.props.Login.templateData;
        let operation = this.props.Login.operation
        if (this.props.Login.loadEsign) {
            if (this.props.Login.operation === "delete" || this.props.Login.operation === "approve") {
                loadEsign = false;
                openModal = false;
                openChildModal = false;
                selectedRecord = {};
                templateData = {};
                operation = undefined
            }
            else {
                loadEsign = false;
                selectedRecord['esignpassword'] = ""
                selectedRecord['esigncomments'] = ""
                selectedRecord['esignreason']=""
            }
        }
        else {
            openModal = false;
            openChildModal = false;
            selectedRecord = {};
            templateData = {}
        }

        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { openModal, openChildModal, loadEsign, selectedRecord, templateData, selectedId: null, operation }
        }
        this.props.updateStore(updateInfo);
    };
    validateEsign = () => {
        let modalName = this.props.Login.id === 'checklist' ? 'openModal' : 'openChildModal'
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
    onSaveClick = (saveType, formRef) => {
        let modalName = "";
        if (this.props.Login.id === 'checklistversion') {
            if (this.props.Login.masterData.selectedchecklist) {

                let inputParam = versionCreate(this.state.selectedRecord, this.props.Login.masterData.selectedchecklist, this.props.Login)

                const masterData = this.props.Login.masterData;

                if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolcode)) {
                    const updateInfo = {
                        typeName: DEFAULT_RETURN,
                        data: {
                            loadEsign: true, screenData: { inputParam, masterData }, openChildModal: true, operation: this.props.Login.operation, screenName: '', id: this.props.Login.id
                        }
                    }
                    this.props.updateStore(updateInfo);
                }
                else {
                    this.props.crudMaster(inputParam, masterData, "openChildModal");
                }
            }
        } else {
            modalName = this.props.Login.id === 'checklist' ? 'openModal' : 'openChildModal'
            let inputParam = getSaveInputData(this.props.Login.id, this.props.Login.operation, this.props.Login,
                this.props.Login.availableQBCategory, this.state.selectedRecord, this.props.Login.masterData.selectedversion, formRef, this.searchRef, this.state.dataState)


            const masterData = this.props.Login.masterData;

            if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolcode)) {
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        loadEsign: true, screenData: { inputParam, masterData }, saveType,
                        operation: this.props.Login.operation, id: this.props.Login.id
                    }
                }
                this.props.updateStore(updateInfo);
            }
            else {
                this.props.crudMaster(inputParam, masterData, modalName);
            }
        }

    }


    approveVersion = (version, ncontrolCode) => {

        let inputData = [];
        inputData["userinfo"] = this.props.Login.userInfo;
        inputData["checklistversion"] = {
            "schecklistversionname": version.schecklistversionname,
            "nchecklistversioncode": version.nchecklistversioncode,
            "nchecklistcode": version.nchecklistcode
        }
        const postParam = {
            inputListName: "checklist", selectedObject: "selectedchecklist",
            primaryKeyField: "nchecklistcode",
            primaryKeyValue: this.props.Login.masterData.selectedchecklist.nchecklistcode,
            fetchUrl: "checklist/getChecklistVersion",
            fecthInputObject: { userinfo: this.props.Login.userInfo },
        }
        const inputParam = {
            methodUrl: "ChecklistVersion",
            classUrl: this.props.Login.inputParam.classUrl,
            inputData: inputData, postParam,
            operation: "approve"
        }
        const masterData = this.props.Login.masterData;

        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, ncontrolCode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData }, openChildModal: true, operation: 'approve', screenName: '', id: 'checklistversion'
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.crudMaster(inputParam, masterData, "openChildModal");
        }
    }


    //to delete a recoed
    deleteRecord = (qbDeleteParam) => {
        let modalName = 'openChildModal'
        let selectedRecord = qbDeleteParam.selectedRecord
        delete selectedRecord.expanded
        let postParam = undefined
        if (qbDeleteParam.methodUrl === 'Checklist') {
            postParam = {
                inputListName: "checklist", selectedObject: "selectedchecklist",
                primaryKeyField: "nchecklistcode",
                primaryKeyValue: this.props.Login.masterData.selectedchecklist.nchecklistcode,
                fetchUrl: "checklist/getChecklistVersion",
                fecthInputObject: { userinfo: this.props.Login.userInfo },

            }
            modalName = 'openModal'
        }
        const inputParam = {
            methodUrl: qbDeleteParam.methodUrl,
            classUrl: this.props.Login.inputParam.classUrl,
            inputData: { [qbDeleteParam.key]: selectedRecord, "userinfo": this.props.Login.userInfo },
            operation: "delete", postParam,
            displayName: qbDeleteParam.methodUrl,
            dataState: this.state.dataState,
            selectedRecord: {...this.state.selectedRecord}
        }
        const masterData = this.props.Login.masterData;

        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, qbDeleteParam.ncontrolCode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData }, [modalName]: true,
                    operation: 'delete', screenName: qbDeleteParam.methodUrl, id: qbDeleteParam.methodUrl.toLowerCase()
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.crudMaster(inputParam, masterData, modalName);
        }
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
        const filterParam = {
            inputListName: "checklist", selectedObject: "selectedchecklist", primaryKeyField: "nchecklistcode",
            fetchUrl: "checklist/getChecklistVersion",
            fecthInputObject: { userinfo: this.props.Login.userInfo },
            masterData: this.props.Login.masterData,
            searchFieldList: ["schecklistname", "sdescription"]
        }

        const addChecklistId = this.state.controlMap.has("AddChecklist") && this.state.controlMap.get("AddChecklist").ncontrolcode;
        const editChecklistId = this.state.controlMap.has("EditChecklist") && this.state.controlMap.get("EditChecklist").ncontrolcode;
        const deleteChecklistId = this.state.controlMap.has("DeleteChecklist") && this.state.controlMap.get("DeleteChecklist").ncontrolcode
        const createVersionId = this.state.controlMap.has("CreateChecklistVersion") && this.state.controlMap.get("CreateChecklistVersion").ncontrolcode


        this.props.Login.showAccordion = true;
        const checklistEditParam = {
            screenName: "Checklist", operation: "update", primaryKeyField: "nchecklistcode",
            masterData: this.props.Login.masterData, userInfo: this.props.Login.userInfo,
            primaryKeyValue: this.props.Login.masterData.selectedchecklist ? this.props.Login.masterData.selectedchecklist.nchecklistcode : -1,
            ncontrolCode: editChecklistId
        };

        const checklistDeleteParam = {
            screenName: "Checklist", methodUrl: "Checklist", operation: "delete", key: 'checklist', ncontrolCode: deleteChecklistId,
            selectedRecord: this.props.Login.masterData.selectedchecklist ? this.props.Login.masterData.selectedchecklist : {}
        };


        return (
            <>
                <div className="client-listing-wrap mtop-4">
                    <Row noGutters={true}>
                        <Col md={`${!this.props.sidebarview ? '4' : "2"}`}> 
                            <ListMaster
                                screenName={this.props.intl.formatMessage({ id: "IDS_CHECKLIST" })}
                                masterData={this.props.Login.masterData}
                                userInfo={this.props.Login.userInfo}
                                masterList={this.props.Login.masterData.searchedData || this.props.Login.masterData.checklist}
                                getMasterDetail={(checklist) => this.props.getChecklistVersion(checklist, this.props.Login.userInfo, this.props.Login.masterData)}
                                selectedMaster={this.props.Login.masterData.selectedchecklist}
                                primaryKeyField={"nchecklistcode"}
                                mainField="schecklistname"
                                filterColumnData={this.props.filterColumnData}
                                openModal={() => this.props.showChecklistAddScreen(null, 'checklist', addChecklistId, this.props.Login.userInfo)}
                                userRoleControlRights={this.state.userRoleControlRights}
                                addId={addChecklistId}
                                searchRef={this.searchRef}
                                filterParam={filterParam}
                                hidePaging={true}
                                reloadData={this.reloadData}
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
                            {this.props.Login.masterData.selectedchecklist ? Object.entries(this.props.Login.masterData.selectedchecklist).length > 0 ?
                                <Row>
                                    <Col md={12}>
                                        <ContentPanel className="panel-main-content">
                                            <Card className="border-0">
                                                <Card.Header>
                                                    <Card.Title className="product-title-main">
                                                        {this.props.Login.masterData.selectedchecklist.schecklistname}
                                                    </Card.Title>
                                                    <Card.Subtitle>
                                                        {/* <Tooltip position="bottom" anchorElement="target" openDelay={100} parentTitle={true}> */}
                                                        {/* <ReactTooltip place="bottom" globalEventOff='click' id="tooltip_list_wrap" /> */}
                                                        <ProductList className="d-flex justify-content-end">
                                                            <Nav.Link className="btn btn-circle outline-grey mr-2"
                                                                data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_EDIT" })}
                                                            //    data-for="tooltip_list_wrap"
                                                                hidden={this.state.userRoleControlRights.indexOf(editChecklistId) === -1}
                                                                onClick={() => this.props.fetchChecklistRecordByID(checklistEditParam)

                                                                    //"Checklist","nchecklistcode",this.props.Login.masterData.selectedchecklist.nchecklistcode)
                                                                }>
                                                                <FontAwesomeIcon icon={faPencilAlt} title={this.props.intl.formatMessage({ id: "IDS_EDIT" })} />
                                                            </Nav.Link>

                                                            <Nav.Link className="btn btn-circle outline-grey mr-2 action-icons-wrap"
                                                                data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_DELETE" })}
                                                              //  data-for="tooltip_list_wrap"
                                                                hidden={this.state.userRoleControlRights.indexOf(deleteChecklistId) === -1}
                                                                onClick={() => this.ConfirmDelete(checklistDeleteParam)}>
                                                                <FontAwesomeIcon icon={faTrashAlt} />
                                                                {/* <ConfirmDialog
                                                                        name="deleteMessage"
                                                                        message={this.props.intl.formatMessage({ id: "IDS_DEFAULTCONFIRMMSG" })}
                                                                        doLabel={this.props.intl.formatMessage({ id: "IDS_OK" })}
                                                                        doNotLabel={this.props.intl.formatMessage({ id: "IDS_CANCEL" })}
                                                                        icon={faTrashAlt}
                                                                        //title={this.props.intl.formatMessage({ id: "IDS_DELETE" })}
                                                                        hidden={this.state.userRoleControlRights.indexOf(deleteChecklistId) === -1}
                                                                        handleClickDelete={() => this.deleteRecord(checklistDeleteParam)}
                                                                    /> */}
                                                            </Nav.Link>
                                                        </ProductList>
                                                        {/* </Tooltip> */}
                                                    </Card.Subtitle>
                                                </Card.Header>
                                                <Card.Body>
                                                    {/* <Card.Text> */}
                                                    <Row>
                                                        <Col md={12}>
                                                            <FormGroup>
                                                                <FormLabel><FormattedMessage id="IDS_DESCRIPTION" message="Description" /></FormLabel>
                                                                <ReadOnlyText>{this.props.Login.masterData.selectedchecklist.sdescription}</ReadOnlyText>
                                                            </FormGroup>
                                                        </Col>
                                                    </Row>
                                                    {/* </Card.Text> */}
                                                    <Row noGutters={true}>
                                                        <Col md={12}>
                                                            <Card id="checklistvsersion" className="at-tabs border-0">
                                                                <Row noGutters={true} >
                                                                    <Col md={12}>
                                                                        <div className="d-flex justify-content-end">
                                                                            {/* <ReactTooltip place="bottom" globalEventOff='click' /> */}
                                                                            <Nav.Link className="add-txt-btn"
                                                                                hidden={this.state.userRoleControlRights.indexOf(createVersionId) === -1}
                                                                                onClick={() => this.props.showChecklistAddScreen(null, 'checklistversion', createVersionId, this.props.Login.userInfo)}
                                                                            >
                                                                                <FontAwesomeIcon icon={faPlus} /> { }
                                                                                <FormattedMessage id='IDS_VERSION' defaultMessage='Version' />
                                                                            </Nav.Link>
                                                                        </div>
                                                                    </Col>
                                                                </Row>
                                                                <Row noGutters={true}>
                                                                    <Col md={12}>
                                                                        {this.props.Login.masterData.checklistversion && this.props.Login.masterData.checklistversion.length > 0 ?
                                                                            <CustomAccordion
                                                                                key="ChecklistVersion"
                                                                                accordionTitle={"schecklistversionname"}
                                                                                accordionComponent={this.checklistVersionAccordion(this.props.Login.masterData.checklistversion)}
                                                                                inputParam={{ masterData: this.props.Login.masterData, userInfo: this.props.Login.userInfo }}
                                                                                accordionClick={this.props.getVersionQB}
                                                                                accordionPrimaryKey={"nchecklistversioncode"}
                                                                                accordionObjectName={"version"}
                                                                                genericLabel ={this.props.Login.genericLabel}
                                                                                selectedKey={this.props.Login.masterData.selectedversion.nchecklistversioncode}
                                                                            />
                                                                            : ""}
                                                                    </Col>
                                                                </Row>

                                                            </Card>
                                                        </Col>
                                                    </Row>
                                                </Card.Body>
                                            </Card>
                                        </ContentPanel>
                                    </Col>
                                </Row>
                                : "" : ""}
                        </Col>
                    </Row>
                </div>

                {this.props.Login.operation && this.props.Login.inputParam && this.props.Login.id &&
                    <ChecklistForms
                        Login={this.props.Login}
                        isOpen={this.props.Login.id ? this.props.Login.id === 'checklist' ? this.props.Login.openModal : this.props.Login.openChildModal : false}
                        onInputOnChange={this.onInputOnChange}
                        handleClose={this.handleClose}
                        onSaveClick={this.onSaveClick}
                        onComboChange={this.onComboChange}
                        id={this.props.Login.id ? this.props.Login.id : ""}
                        operation={this.props.Login.operation ? this.props.Login.operation : ''}
                        selectedRecord={this.state.selectedRecord}
                        QBCategory={this.props.Login.QBCategory}
                        availableQBCategory={this.props.Login.availableQBCategory}
                        QB={this.props.Login.QB}
                        availableQB={this.state.selectedRecord ? this.state.availableQB : []}
                        validateEsign={this.validateEsign}
                    />
                }
                {this.props.Login.templateData && this.props.Login.templateData.length > 0 ?
                    <TemplateForm
                        templateData={this.props.Login.templateData}
                        needSaveButton={this.props.Login.masterData.selectedversion.ntransactionstatus === transactionStatus.DRAFT ? true : false}
                        formRef={this.formRef}
                        onTemplateInputChange={this.onTemplateInputChange}
                        handleClose={this.handleClose}
                        onTemplateComboChange={this.onTemplateComboChange}
                        onSaveClick={this.props.onSaveTemplate}
                        Login={this.props.Login}
                        viewScreen={this.props.Login.openTemplateModal}
                        selectedRecord={this.state.selectedRecord}
                        genericLabel ={this.props.Login.genericLabel}
                        onTemplateDateChange={this.onTemplateDateChange}
                        needValidation= {true}
                    /> : ""
                }
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
        if (this.props.Login.masterData !== previousProps.Login.masterData) {
            let { dataState } = this.state;
            if (this.props.Login.dataState === undefined) {
                dataState = { skip: 0 , take:this.state.dataState.take}
                this.setState({ dataState });
            }

        }
    }

    ConfirmDelete = (deleteParam) => {
        this.confirmMessage.confirm("deleteMessage", this.props.intl.formatMessage({ id: "IDS_DELETE" }), this.props.intl.formatMessage({ id: "IDS_DEFAULTCONFIRMMSG" }),
            this.props.intl.formatMessage({ id: "IDS_OK" }), this.props.intl.formatMessage({ id: "IDS_CANCEL" }),
            () => this.deleteRecord(deleteParam));
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
    checklistVersionAccordion = (versionList) => {
        const accordionMap = new Map();
        versionList.map((version) =>
            accordionMap.set(version.nchecklistversioncode,
                <ChecklistVersionAccordion
                    version={version}
                    userRoleControlRights={this.state.userRoleControlRights}
                    controlMap={this.state.controlMap}
                    userInfo={this.props.Login.userInfo}
                    masterData={this.props.Login.masterData}
                    inputParam={this.props.Login.inputParam}
                    showChecklistAddScreen={this.props.showChecklistAddScreen}
                    dataResult={process(this.props.Login.masterData.checklistversionqb ? this.props.Login.masterData.checklistversionqb : [], this.state.dataState)}
                    dataState={this.state.dataState}
                    dataStateChange={this.dataStateChange}
                    fetchChecklistRecordByID={this.props.fetchChecklistRecordByID}
                    ConfirmDelete={this.ConfirmDelete}
                    selectedId={this.props.Login.selectedId}
                    approveVersion={this.approveVersion}
                    deleteRecord={this.deleteRecord}
                    genericLabel ={this.props.Login.genericLabel}
                    viewVersionTemplate={this.props.viewVersionTemplate}
                />)
        )
        return accordionMap;
    }
    dataStateChange = (event) => {
        this.setState({
            dataState: event.dataState
        });
    }

    onInputOnChange = (event) => {
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
        let selectedRecord = this.state.selectedRecord || {};
//ALPD-4428-Vignesh R(06-08-2024)
        if(comboData!==null){
        if(selectedRecord["nchecklistqbcategoryvalue"] !== (comboData && comboData.value)){
        if (fieldName === "nchecklistqbcategorycode") {
            //only go inside when combo has value
            if (comboData) {
                delete selectedRecord[selectedRecord["schecklistqbcategoryname"]];
                selectedRecord["schecklistqbcategoryname"] = comboData.label;
                selectedRecord["nchecklistqbcategoryvalue"] = comboData.value;
                selectedRecord[selectedRecord["schecklistqbcategoryname"]] = this.state.selectedRecord ? this.state.selectedRecord[comboData.label] ?
                    this.state.selectedRecord[comboData.label] : "" : ""
                this.setState({ availableQB: this.props.Login.listQb[comboData.label], selectedRecord });
            } else {
                selectedRecord["schecklistqbcategoryname"] = ""
                selectedRecord["nchecklistqbcategoryvalue"] = "";
                this.setState({ selectedRecord, availableQB: [] });
            }
        } else {
            selectedRecord[this.state.selectedRecord.schecklistqbcategoryname] = comboData
            this.setState({ selectedRecord })
        }
    }else{
        selectedRecord[selectedRecord["schecklistqbcategoryname"]] = this.state.selectedRecord ? this.state.selectedRecord[comboData.label] ?
                    this.state.selectedRecord[comboData.label] : "" : ""
        this.setState({ selectedRecord });
    }
    }
    else{
//ALPD-4428-Vignesh R(06-08-2024)
    selectedRecord[this.state.selectedRecord.schecklistqbcategoryname] = comboData
    this.setState({selectedRecord});
    }
    }
    onTemplateInputChange = (event, control) => {
        let selectedRecord = templateChangeHandler(1, this.state.selectedRecord, event, control)
        this.setState({ selectedRecord });
    }
    onTemplateComboChange = (comboData, control) => {
        let selectedRecord = templateChangeHandler(2, this.state.selectedRecord, comboData, control)
        this.setState({ selectedRecord });
    }
    onTemplateDateChange = (dateData, control) => {
        let selectedRecord = templateChangeHandler(3, this.state.selectedRecord, dateData, control)
        this.setState({ selectedRecord });
    }
    reloadData = () => {
    //ALPD-4803 done by Dhanushya RI,To check searchref key is present or not
if (this.searchRef && this.searchRef.current) {
            this.searchRef.current.value = "";
          }        
        const inputParam = {
            inputData: { "userinfo": this.props.Login.userInfo },
            classUrl: "checklist",
            methodUrl: "Checklist",
            displayName: "IDS_CHECKLIST",
            userInfo: this.props.Login.userInfo
        };

        this.props.callService(inputParam);
    }
}
export default connect(mapStateToProps, {
    callService, crudMaster, validateEsignCredential, updateStore, getChecklistVersion, getVersionQB, viewVersionTemplate, onSaveTemplate,
    showChecklistAddScreen, fetchChecklistRecordByID, filterColumnData
})(injectIntl(Checklist));