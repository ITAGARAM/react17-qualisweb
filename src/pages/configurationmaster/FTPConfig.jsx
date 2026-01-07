import React from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import DataGrid from '../../components/data-grid/data-grid.component';
import SlideOutModal from '../../components/slide-out-modal/SlideOutModal';
import CustomSwitch from '../../components/custom-switch/custom-switch.component';
import FormInput from '../../components/form-input/form-input.component';
import { callService, crudMaster, openFTPConfigModal, fetchFTPConfigByID, updateStore, validateEsignCredential } from '../../actions';
import { toast } from 'react-toastify';
import { Row, Col } from 'react-bootstrap';
import { process } from '@progress/kendo-data-query';
import { ListWrapper } from '../../components/client-group.styles'
import { showEsign, getControlMap } from '../../components/CommonScript';
import { DEFAULT_RETURN } from '../../actions/LoginTypes'
import Esign from '../audittrail/Esign';
import { transactionStatus } from '../../components/Enumeration';
import FormNumericInput from '../../components/form-numeric-input/form-numeric-input.component';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';

const mapStateToProps = state => {
    return ({ Login: state.Login })
}

class FTPConfig extends React.Component {

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
            userRoleControlRights: [],
            controlMap: new Map()
        }
    }
    dataStateChange = (event) => {
        this.setState({
            dataResult: process(this.state.data, event.dataState),
            dataState: event.dataState
        });
    }
    reloadData = () => {
        const inputParam = {
            inputData: { userinfo: this.props.Login.userInfo },
            methodUrl: this.props.Login.inputParam.methodUrl,
            displayName: this.props.Login.inputParam.displayName ? this.props.Login.inputParam.displayName : '',
            classUrl: this.props.Login.inputParam.classUrl,
            userInfo: this.props.Login.userInfo
        };

        this.props.callService(inputParam);
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
            }
            else {
                loadEsign = false;
                selectedRecord['esignpassword'] = ""
                selectedRecord['esigncomments'] = ""
                selectedRecord['esignreason'] = ""
            }
        }
        else {
            openModal = false;
            selectedRecord = {};
            selectedId = null;
        }

        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { openModal, loadEsign, selectedRecord, optionsChecklistComponent: [], optionsQBCategory: [], selectedId }
        }
        this.props.updateStore(updateInfo);
    };

    onSaveClick = (saveType, formRef) => {
        let inputData = [];
        inputData["userinfo"] = this.props.Login.userInfo;
        let dataState = undefined;
        let selectedId = null;
        if (this.props.Login.operation === "update") {
            // edit
            selectedId = this.state.selectedRecord.nftpno
            dataState = this.state.dataState
            inputData["ftpconfig"] = {
                "nftpno": this.state.selectedRecord.nftpno,
                "susername": this.state.selectedRecord.susername,
                "spassword": this.state.selectedRecord.spassword,
                "nsitecode": this.props.Login.userInfo.nmastersitecode,//this.state.selectedRecord.nsitecode,
                "shost": this.state.selectedRecord.shost,
                "nportno": this.state.selectedRecord.nportno,
                "nsslrequired": this.state.selectedRecord.nsslrequired,
                "nchecksumrequired": this.state.selectedRecord.nchecksumrequired,
                "ndefaultstatus": this.state.selectedRecord.ndefaultstatus,
                "sphysicalpath": this.state.selectedRecord.sphysicalpath,
                "nftptypecode": this.state.selectedRecord.nftptypecode.value,
                //"nregionsitecode":this.state.selectedRecord.nsitecode.value,
            }
        }
        else {
            //add               
            inputData["ftpconfig"] =
            {
                "susername": this.state.selectedRecord.susername,
                "spassword": this.state.selectedRecord.spassword,
                "nsitecode": this.props.Login.userInfo.nmastersitecode,//this.state.selectedRecord.nsitecode,
                "shost": this.state.selectedRecord.shost,
                "nportno": this.state.selectedRecord.nportno,
                "nsslrequired": this.state.selectedRecord.nsslrequired,
                "nchecksumrequired": this.state.selectedRecord.nchecksumrequired,
                "ndefaultstatus": this.state.selectedRecord.ndefaultstatus,
                "sphysicalpath": this.state.selectedRecord.sphysicalpath,
                "nftptypecode": this.state.selectedRecord.nftptypecode.value,
               // "nregionsitecode":this.state.selectedRecord.nsitecode.value,
            };
        }

        //   inputData["ftpconfig"]["sphysicalpath"] =this.state.selectedRecord.sphysicalpath+"\\";
        const inputParam = {
            methodUrl: this.props.Login.inputParam.methodUrl,
            classUrl: this.props.Login.inputParam.classUrl,
            displayName: this.props.Login.inputParam.displayName ? this.props.Login.inputParam.displayName : "",
            inputData: inputData,
            operation: this.props.Login.operation,
            formRef, saveType, dataState, selectedId,
            selectedRecord:{...this.state.selectedRecord}
        }
        const masterData = this.props.Login.masterData;

        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolcode)) {
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

    deleteRecord = (deleteParam) => {

        const inputParam = {
            methodUrl: this.props.Login.inputParam.methodUrl,
            classUrl: this.props.Login.inputParam.classUrl,
            displayName: this.props.Login.inputParam.displayName ? this.props.Login.inputParam.displayName : "",
            inputData: { "ftpconfig": deleteParam.selectedRecord, "userinfo": this.props.Login.userInfo },
            operation: deleteParam.operation,
            dataState: this.state.dataState,
            selectedRecord:{...this.state.selectedRecord}
        }
        const masterData = this.props.Login.masterData;
        if (
            showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, deleteParam.ncontrolCode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true,
                    screenData: { inputParam, masterData },
                    operation: deleteParam.operation,
                    openModal: true,
                    screenName: this.props.Login.inputParam.displayName,
                    optionsQBCategory: this.props.Login.optionsQBCategory,
                    optionsChecklistComponent: this.props.Login.optionsChecklistComponent
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.crudMaster(inputParam, masterData, "openModal");
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
        return null;
    }
    validateEsign = () => {
        const inputParam = {
            inputData: {
                "userinfo": {
                    ...this.props.Login.userInfo,
                    sreason: this.state.selectedRecord["esigncomments"],
                    nreasoncode: this.state.selectedRecord["esignreason"] && this.state.selectedRecord["esignreason"].value,
                    spredefinedreason: this.state.selectedRecord["esignreason"] && this.state.selectedRecord["esignreason"].label,
                },
                password: this.state.selectedRecord["esignpassword"]
            },
            screenData: this.props.Login.screenData
        }
        this.props.validateEsignCredential(inputParam, "openModal");
    }
    render() {
        let primaryKeyField = "";
        this.extractedColumnList = [
           // {"idsName":"IDS_SITE","dataField":"ssitename","width":"200px"},
            { "idsName": "IDS_FTPTYPE", "dataField": "sftptypename", "width": "200px" },
            { "idsName": "IDS_USERNAME", "dataField": "susername", "width": "200px" },            
            { "idsName": "IDS_HOST", "dataField": "shost", "width": "200px" },
            { "idsName": "IDS_PORTNO", "dataField": "nportno", "width": "200px" },
            { "idsName": "IDS_DEFAULTSTATUS", "dataField": "sdefaultstatus", "width": "200px" }
        ];
        primaryKeyField = "nftpno";
        const addID = this.props.Login.inputParam && this.state.controlMap.has("AddFTPConfig")
            && this.state.controlMap.get('AddFTPConfig').ncontrolcode;
        const editID = this.props.Login.inputParam && this.state.controlMap.has("EditFTPConfig")
            && this.state.controlMap.get('EditFTPConfig').ncontrolcode;
        const editParam = {
            screenName: this.props.Login.inputParam ? this.props.Login.inputParam.displayName : '',
            operation: "update",
            primaryKeyField,
            masterData: this.props.Login.masterData,
            userInfo: this.props.Login.userInfo,
            ncontrolCode: editID,
            inputparam: this.props.Login.inputparam,
        };
        const deleteParam = {
            screenName: this.props.Login.inputParam ? this.props.Login.inputParam.displayName : '',
            methodUrl: "UserMultiRole",
            operation: "delete"
        };
        const mandatoryFields = [{ "idsName": "IDS_FTPTYPE", "dataField": "nftptypecode", "mandatoryLabel": "IDS_SELECT", "controlType": "combo" },
       // {"idsName": "IDS_SITE", "dataField": "nsitecode", "mandatoryLabel": "IDS_SELECT", "controlType": "combo" },
        { "idsName": "IDS_USERNAME", "dataField": "susername", "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
        { "idsName": "IDS_PASSWORD", "dataField": "spassword", "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
        { "idsName": "IDS_HOST", "dataField": "shost", "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
        { "idsName": "IDS_PORTNO", "dataField": "nportno", "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
        { "idsName": "IDS_PHYSICALPATH", "dataField": "sphysicalpath", "mandatoryLabel": "IDS_ENTER", "controlType": "textbox"}
        ]

        return (
            <>
                <Row>
                    <Col>
                        <ListWrapper className="client-list-content">
                            {/* <PrimaryHeader className="d-flex justify-content-between mb-3">
                            <HeaderName className="header-primary-md">
                                {this.props.Login.inputParam&&this.props.Login.inputParam.displayName ?
                                    <FormattedMessage id={this.props.Login.inputParam.displayName} /> : ""}
                            </HeaderName>
                            <Button className="btn btn-user btn-primary-blue" 
                             hidden={this.state.userRoleControlRights.indexOf(addID) === -1}
                            onClick={()=>this.props.openFTPConfigModal(this.props.userInfo,addID)} 
                            role="button">
                                <FontAwesomeIcon icon={faPlus} /> { }                          
                                <FormattedMessage id="IDS_ADD" defaultMessage='Add'/> 
                            </Button>
                        </PrimaryHeader> */}

                            {this.state.data ?
                                <DataGrid
                                    primaryKeyField={primaryKeyField}
                                    data={this.state.data}
                                    dataResult={this.state.dataResult}
                                    dataState={this.state.dataState}
                                    dataStateChange={this.dataStateChange}
                                    extractedColumnList={this.extractedColumnList}
                                    fetchRecord={this.props.fetchFTPConfigByID}
                                    deleteRecord={this.deleteRecord}
                                    reloadData={this.reloadData}
                                    pageable={{ buttonCount: 4, pageSizes: true }}
                                    controlMap={this.state.controlMap}
                                    userRoleControlRights={this.state.userRoleControlRights}
                                    inputParam={this.props.Login.inputParam}
                                    userInfo={this.props.Login.userInfo}
                                    isActionRequired={true}
                                    isToolBarRequired={true}
                                    editParam={editParam}
                                    deleteParam={deleteParam}
                                    scrollable={"scrollable"}
                                    gridHeight={"600px"}
                                    selectedId={this.props.Login.selectedId}
                                    addRecord={() => this.props.openFTPConfigModal(this.props.Login.userInfo, addID)}

                                />
                                : ""}
                        </ListWrapper>
                    </Col>
                </Row>
                {this.props.Login.openModal ?
                    <SlideOutModal
                        onSaveClick={this.onSaveClick}
                        operation={this.props.Login.operation}
                        screenName="IDS_FTPCONFIG"
                        closeModal={this.closeModal}
                        show={this.props.Login.openModal}
                        inputParam={this.props.Login.inputParam}
                        esign={this.props.Login.loadEsign}
                        validateEsign={this.validateEsign}
                        selectedRecord={this.state.selectedRecord || {}}
                        mandatoryFields={mandatoryFields}
                        addComponent={this.props.Login.loadEsign ?
                            <Esign operation={this.props.Login.operation}
                                onInputOnChange={this.onInputOnChange}
                                inputParam={this.props.Login.inputParam}
                                selectedRecord={this.state.selectedRecord || {}}
                            />
                            :
                            <Row>
                                {/* <Col md={12}>
                                    <FormSelectSearch
                                        name={"nsitecode"}
                                        formLabel={this.props.intl.formatMessage({ id: "IDS_SITE" })}
                                        placeholder={this.props.intl.formatMessage({ id: "IDS_SITE" })}
                                        value={this.state.selectedRecord ? this.state.selectedRecord.nsitecode : []}
                                        options={this.props.Login.siteOptions ? this.props.Login.siteOptions : []}
                                        // optionId="nsitecode"
                                        // optionValue="ssitename"
                                        isMandatory={true}
                                        isMulti={false}
                                        isDisabled={false}
                                        isSearchable={false}
                                        isClearable={false}
                                        as={"select"}
                                        onChange={(event) => this.onComboChange(event, "nsitecode")}
                                    />
                                </Col> */}


                                <Col md={12}>
                                    <FormSelectSearch
                                        name={"nsitecode"}
                                        formLabel={this.props.intl.formatMessage({ id: "IDS_FTPTYPE" })}
                                        placeholder={this.props.intl.formatMessage({ id: "IDS_FTPTYPE" })}
                                        value={this.state.selectedRecord.nftptypecode ? this.state.selectedRecord.nftptypecode : ""}
                                        options={this.props.Login.ftpTypeList ? this.props.Login.ftpTypeList : []}
                                        // optionId="nsitecode"
                                        // optionValue="ssitename"
                                        isMandatory={true}
                                        isMulti={false}
                                        isDisabled={false}
                                        isSearchable={false}
                                        isClearable={false}
                                        as={"select"}
                                        onChange={(event) => this.onComboChange(event, "nftptypecode")}
                                    />
                                </Col>
                                <Col md={12}>
                                    <FormInput
                                        label={this.props.intl.formatMessage({ id: "IDS_USERNAME" })}
                                        name={"susername"}
                                        type="text"
                                        onChange={(event) => this.onInputOnChange(event)}
                                        placeholder={this.props.intl.formatMessage({ id: "IDS_USERNAME" })}
                                        value={this.state.selectedRecord ? this.state.selectedRecord["susername"] : ""}
                                        isMandatory={true}
                                        required={true}
                                        maxLength={100}
                                    />
                                    <FormInput
                                        label={this.props.intl.formatMessage({ id: "IDS_PASSWORD" })}
                                        name={"spassword"}
                                        type="password"
                                        onChange={(event) => this.onInputOnChange(event)}
                                        placeholder={this.props.intl.formatMessage({ id: "IDS_PASSWORD" })}
                                        isMandatory={true}
                                        required={true}
                                        value={this.state.selectedRecord ? this.state.selectedRecord["spassword"] : ""}
                                        maxLength={100}
                                    />
                                    {/* <Col md={12}>/site commented/
                            <FormSelectSearch
                                name={"nsitecode"}
                                formLabel={this.props.intl.formatMessage({ id:"IDS_SITE"})}
                                placeholder={this.props.intl.formatMessage({ id:"IDS_SITE"})}
                                value={this.state.selectedRecord?this.state.selectedRecord.siteValue:[]}
                                options={this.props.Login.siteOptions?this.props.Login.siteOptions:[]}
                                optionId="nsitecode"
                                optionValue="ssitename"
                                isMandatory={true}
                                isMulti={false}
                                isDisabled={false}
                                isSearchable={false}
                                isClearable={false}
                                as={"select"}
                                onChange={(event)=>this.onComboChange(event,"nsitecode")}
                            />
                        </Col> */}
                                    <FormInput
                                        label={this.props.intl.formatMessage({ id: "IDS_HOST" })}
                                        name={"shost"}
                                        type="text"
                                        onChange={(event) => this.onInputOnChange(event)}
                                        placeholder={this.props.intl.formatMessage({ id: "IDS_HOST" })}
                                        value={this.state.selectedRecord ? this.state.selectedRecord["shost"] : ""}
                                        isMandatory={true}
                                        required={true}
                                        maxLength={100}
                                    />
                                    <FormNumericInput
                                        label={this.props.intl.formatMessage({ id: "IDS_PORTNO" })}
                                        name={"nportno"}
                                        type="number"
                                        onChange={(event) => this.onNumericInputOnChange(event, "nportno")}
                                        placeholder={this.props.intl.formatMessage({ id: "IDS_PORTNO" })}
                                        isMandatory={true}
                                        required={true}
                                        noStyle={true}
                                        strict={true}
                                        className="form-control"
                                        // max={10000000}
                                        errors="Please provide a valid number."
                                        // min={0}
                                        maxLength={5} // Changed by Abdul to match Table Column
                                        //maxLength={100}
                                        value={this.state.selectedRecord["nportno"]}
                                    />
                                    <FormInput
                                        label={this.props.intl.formatMessage({ id: "IDS_PHYSICALPATH" })}
                                        name={"sphysicalpath"}
                                        type="text"
                                        onChange={(event) => this.onInputOnChange(event)}
                                        placeholder={this.props.intl.formatMessage({ id: "IDS_PHYSICALPATH" })}
                                        value={this.state.selectedRecord ? this.state.selectedRecord["sphysicalpath"] : ""}
                                        isMandatory={true}
                                        required={false}
                                        maxLength={100}
                                    />
                                </Col>
                                <Col md={6}>
                                    <CustomSwitch
                                        name={"ndefaultstatus"}
                                        type="switch"
                                        label={this.props.intl.formatMessage({ id: "IDS_DEFAULTSTATUS" })}
                                        placeholder={this.props.intl.formatMessage({ id: "IDS_DEFAULTSTATUS" })}
                                        defaultValue={this.state.selectedRecord ? this.state.selectedRecord["ndefaultstatus"] === transactionStatus.YES ? true : false : false}
                                        isMandatory={false}
                                        required={false}
                                        checked={this.state.selectedRecord ? this.state.selectedRecord["ndefaultstatus"] === transactionStatus.YES ? true : false : false}
                                        onChange={(event) => this.onInputOnChange(event)}
                                    />
                                </Col>
                                {this.state.selectedRecord.nftptypecode && this.state.selectedRecord.nftptypecode.value === 1 ?
                                    <Col md={6}>
                                        <CustomSwitch
                                            name={"nsslrequired"}
                                            type="switch"
                                            label={this.props.intl.formatMessage({ id: "IDS_SSL" })}
                                            placeholder={this.props.intl.formatMessage({ id: "IDS_SSL" })}
                                            defaultValue={this.state.selectedRecord ? this.state.selectedRecord["nsslrequired"] === transactionStatus.YES ? true : false : false}
                                            isMandatory={false}
                                            required={false}
                                            checked={this.state.selectedRecord ? this.state.selectedRecord["nsslrequired"] === transactionStatus.YES ? true : false : false}
                                            onChange={(event) => this.onInputOnChange(event)}
                                        />
                                    </Col>
                                    : ""}

                                <Col md={6}>
                                    <CustomSwitch
                                        name={"nchecksumrequired"}
                                        type="switch"
                                        label={this.props.intl.formatMessage({ id: "IDS_CHECKSUM" })}
                                        placeholder={this.props.intl.formatMessage({ id: "IDS_CHECKSUM" })}
                                        defaultValue={this.state.selectedRecord ? this.state.selectedRecord["nchecksumrequired"] === transactionStatus.YES ? true : false : false}
                                        isMandatory={false}
                                        required={false}
                                        checked={this.state.selectedRecord ? this.state.selectedRecord["nchecksumrequired"] === transactionStatus.YES ? true : false : false}
                                        onChange={(event) => this.onInputOnChange(event)}
                                    />
                                </Col>
                            </Row>
                        } /> : ""}

            </>
        );
    }

    onNumericInputOnChange = (value, name) => {
        const selectedRecord = this.state.selectedRecord || {};
        selectedRecord[name] = value;
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
                this.setState({
                    userRoleControlRights, controlMap, data: this.props.Login.masterData,
                    dataResult: process(this.props.Login.masterData, this.state.dataState),
                });
            }
            else {
                let { dataState } = this.state;
                if (this.props.Login.dataState === undefined) {
                    dataState = { skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5 }
                }
                this.setState({
                    data: this.props.Login.masterData,
                    dataResult: process(this.props.Login.masterData, dataState),
                    dataState
                });
            }
        }
        if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord) {
            this.setState({ selectedRecord: this.props.Login.selectedRecord });
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
        const selectedRecord = this.state.selectedRecord || {};
        if (fieldName === 'nftptypecode') {
            selectedRecord[fieldName] = comboData;
        } else {
            if (comboData) {
                selectedRecord['siteValue'] = comboData
                //selectedRecord[fieldName] = comboData.value;
                selectedRecord[fieldName] = comboData;
            } else {
                selectedRecord['siteValue'] = []
                selectedRecord[fieldName] = "";
            }
        }

        this.setState({ selectedRecord });
    }
}
export default connect(mapStateToProps, { callService, crudMaster, openFTPConfigModal, fetchFTPConfigByID, updateStore, validateEsignCredential })(injectIntl(FTPConfig));