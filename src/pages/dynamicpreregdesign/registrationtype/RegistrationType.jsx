import React from 'react'
import { ListWrapper } from '../../../components/client-group.styles'
import { Row, Col, Nav } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { process } from '@progress/kendo-data-query';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { callService, crudMaster, showRegTypeAddScreen, fetchRegTypeById, updateStore, validateEsignCredential } from '../../../actions';
import { DEFAULT_RETURN } from '../../../actions/LoginTypes';
import DataGrid from '../../../components/data-grid/data-grid.component';
import FormTextarea from '../../../components/form-textarea/form-textarea.component';
import FormSelectSearch from '../../../components/form-select-search/form-select-search.component';
import SlideOutModal from '../../../components/slide-out-modal/SlideOutModal';
import { showEsign, getControlMap } from '../../../components/CommonScript';
import Esign from '../../audittrail/Esign';
import FormInput from '../../../components/form-input/form-input.component';
import { faLanguage } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AddSynonym from '../../../components/droparea/AddSynonym';

const mapStateToProps = state => {
    return ({ Login: state.Login })
}

class RegistrationType extends React.Component {
    constructor(props) {
        super(props)
        this.formRef = React.createRef();
        this.extractedColumnList = [];
        this.handleClose = this.handleClose.bind(this);
        const dataState = {
            skip: 0,
            take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5,
        };
        this.state = {
            data: [], masterStatus: "", error: "", selectedRecord: {}, userRoleControlRights: [], controlMap: new Map(),
            dataResult: [],
            dataState: dataState,
            action: "",
            mandatoryFields: [
                { "idsName": "IDS_SAMPLETYPE", "dataField": "SampleTypes", "mandatoryLabel": "IDS_SELECT", "controlType": "textbox" },
                { "idsName": "IDS_REGISTRATIONTYPE", "dataField": "sregtypename", "mandatoryLabel": "IDS_ENTER", "controlType": "textbox","ismultilingual":"true" },
                //{"idsName":"IDS_DESCRIPTION","dataField":"sdescription" , "mandatoryLabel":"IDS_ENTER", "controlType": "textbox"},
            ]
        };
    }
    dataStateChange = (event) => {
        this.setState({
            dataResult: process(this.props.Login.masterData, event.dataState),
            dataState: event.dataState
        });
    }

    //to close side out
    handleClose() {

        let loadEsign = this.props.Login.loadEsign;
        let openModal = this.props.Login.openModal;
        let selectedRecord = this.props.Login.selectedRecord;
        let selectedId = this.props.Login.selectedId;
        if (this.state.showSynonym) {
            this.setState({ showSynonym: false })
            return null;
        }
        if (this.props.Login.loadEsign) {
            if (this.props.Login.operation === "delete") {
                loadEsign = false;
                openModal = false;
            }
            else {
                loadEsign = false;
            }
        }
        else {
            openModal = false;
            selectedRecord = {};
            selectedId = null;
        }

        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { openModal, loadEsign, selectedRecord, optionsChecklistComponent: [], optionsSampleType: [],selectedId }
        }
        this.props.updateStore(updateInfo);
    };

    //to open side out

    //to perform save action for both add and edit
    onSaveClick = (saveType, formRef) => {
        let inputData = [];
        let selectedId = null;
        inputData["userinfo"] = this.props.Login.userInfo;
        let dataState = undefined;
        if (this.state.showSynonym) {
            this.setState({ showSynonym: false })
            return null;
        }
        const languageData={}
        Object.keys(this.state.selectedRecord.sregtypename).map(item=>{
            languageData[item]= this.state.selectedRecord.sregtypename[item]
        })
        if (this.props.Login.operation === "update") {
            // edit
            selectedId = this.state.selectedRecord.nregtypecode
            dataState = this.state.dataState
            inputData["registrationtype"] = {
                "nregtypecode": this.state.selectedRecord.nregtypecode ? this.state.selectedRecord.nregtypecode : -1,
                "nsampletypecode": this.state.selectedRecord.nsampletypecode,
                "jsondata": {
                    "sregtypename": this.state.selectedRecord.sregtypename,
                    "sdescription": this.state.selectedRecord.sdescription,
                }
            }
            inputData["registrationtypeaudit"] =
            {
                "jsonuidata": {
                    "sregtypename": this.state.selectedRecord.sregtypename['en-US'],
                    "sdescription": this.state.selectedRecord.sdescription,
                    "ssampletypename": this.state.selectedRecord.SampleTypes.label,
                    ...languageData,
                },
            }
        }
        else {
            //add               
            inputData["registrationtype"] =
            {
                "nsampletypecode": this.state.selectedRecord.nsampletypecode ? this.state.selectedRecord.nsampletypecode : -1,
                "jsondata": {
                    "sregtypename": this.state.selectedRecord.sregtypename,
                    "sdescription": this.state.selectedRecord.sdescription,
                },
            }

            inputData["registrationtypeaudit"] =
            {
                "jsonuidata": {
                    "sregtypename": this.state.selectedRecord.sregtypename['en-US'],
                    "sdescription": this.state.selectedRecord.sdescription,
                    "ssampletypename": this.state.selectedRecord.SampleTypes.item.ssampletypename,
                    ...languageData,
                    // this.props.Login.languageList.map(item=>item.value:this.state.selectedRecord.sregtypename[item.value])
                },
            }
        }

        const inputParam = {
            methodUrl: this.props.Login.inputParam.methodUrl,
            classUrl: this.props.Login.inputParam.classUrl,
            displayName: this.props.Login.inputParam.displayName ? this.props.Login.inputParam.displayName : '',
            inputData: inputData,
            operation: this.props.Login.operation,
            saveType, formRef, dataState, selectedId,
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
    //to get the edit record

    //to delete a recoed
    deleteRecord = (deleteParam) => {
        const inputParam = {
            methodUrl: this.props.Login.inputParam.methodUrl,
            classUrl: this.props.Login.inputParam.classUrl,
            dataState: this.state.dataState,
            displayName: this.props.Login.inputParam.displayName ? this.props.Login.inputParam.displayName : '',
            inputData: {
                "registrationtype": deleteParam.selectedRecord,
                "userinfo": this.props.Login.userInfo
            },
            operation: deleteParam.operation,
            selectedRecord:{...this.state.selectedRecord}
        }

        const masterData = this.props.Login.masterData;

        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, deleteParam.ncontrolCode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData }, operation: deleteParam.operation, openModal: true,
                    screenName: this.props.Login.inputParam.displayName, optionsSampleType: this.props.Login.optionsSampleType//,
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.crudMaster(inputParam, masterData, "openModal");
        }
    }

    //to reload data
    reloadData = () => {
        const inputParam = {
            inputData: { userinfo: this.props.Login.userInfo },
            methodUrl: this.props.Login.inputParam.methodUrl,
            classUrl: this.props.Login.inputParam.classUrl,
            displayName: this.props.Login.inputParam.displayName ? this.props.Login.inputParam.displayName : '',
            userInfo: this.props.Login.userInfo
        };

        this.props.callService(inputParam);
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
        let primaryKeyField = "";
        if (this.props.Login.inputParam !== undefined) {
            this.extractedColumnList = [
                { "idsName": "IDS_SAMPLETYPE", "dataField": "ssampletypename", "width": "250px" },
                { "idsName": "IDS_REGISTRATIONTYPE", "dataField": "sregtypename", "width": "250px" },
                { "idsName": "IDS_DESCRIPTION", "dataField": "sdescription", "width": "150px" },
            ]
            primaryKeyField = "nregtypecode";
        }

        const addID = this.props.Login.inputParam && this.state.controlMap.has("AddRegistrationType")
            && this.state.controlMap.get('AddRegistrationType').ncontrolcode;
        const editId = this.props.Login.inputParam && this.state.controlMap.has("EditRegistrationType")
            && this.state.controlMap.get('EditRegistrationType').ncontrolcode;
        const editParam = {
            screenName: "RegistrationType", operation: "update", primaryKeyField: primaryKeyField,
            masterData: this.props.Login.masterData, userInfo: this.props.Login.userInfo, ncontrolCode: editId
        };

        const deleteParam = { screenName: "RegistrationType", methodUrl: "RegistrationType", operation: "delete", key: 'registrationtype' };

        return (
            <>
                <Row>
                    <Col>
                        <ListWrapper className="client-list-content">
                            {this.state.data ?
                                <DataGrid
                                    primaryKeyField={primaryKeyField}
                                    data={this.state.data}
                                    dataResult={this.state.dataResult}
                                    dataState={this.state.dataState}
                                    dataStateChange={this.dataStateChange}
                                    extractedColumnList={this.extractedColumnList}
                                    fetchRecord={this.props.fetchRegTypeById}
                                    deleteRecord={this.deleteRecord}
                                    reloadData={this.reloadData}
                                    controlMap={this.state.controlMap}
                                    userRoleControlRights={this.state.userRoleControlRights}
                                    inputParam={this.props.Login.inputParam}
                                    userInfo={this.props.Login.userInfo}
                                    editParam={editParam}
                                    deleteParam={deleteParam}
                                    pageable={true}
                                    isActionRequired={true}
                                    isToolBarRequired={true}
                                    gridHeight={'600px'}
                                    scrollable={"scrollable"}
                                    selectedId={this.props.Login.selectedId}
                                    addRecord={() => this.props.showRegTypeAddScreen(this.props.Login.userInfo, addID)}
                                />
                                : ""}

                        </ListWrapper>
                    </Col>
                </Row>
                {this.props.Login.openModal ?
                    <SlideOutModal
                        onSaveClick={this.onSaveClick}
                        operation={this.props.Login.operation}
                        screenName={this.props.Login.inputParam.displayName}
                        closeModal={this.handleClose}
                        show={this.props.Login.openModal}
                        showSaveContinue={false}
                        hideSave={this.state.showSynonym}
                        closeLabel={this.state.showSynonym ? "IDS_CLOSE" : undefined}
                        inputParam={this.props.Login.inputParam}
                        esign={this.props.Login.loadEsign}
                        validateEsign={this.validateEsign}
                        selectedRecord={this.state.selectedRecord}
                        mandatoryFields={this.state.mandatoryFields}
                        addComponent={this.props.Login.loadEsign ?
                            <Esign operation={this.props.Login.operation ? this.props.Login.operation : ''}
                                onInputOnChange={this.onInputOnChange}
                                inputParam={this.props.Login.inputParam}
                                selectedRecord={this.state.selectedRecord || {}}
                            />
                            : this.state.showSynonym ?
                                <AddSynonym
                                    selectedFieldRecord={this.state.selectedRecord}
                                    onInputOnChange={this.onInputOnChange}
                                    languages={this.props.Login.languageList || []}
                                    fieldName="sregtypename"
                                    maxLength={100}
                                />
                                :
                                <Row>
                                    <Col md={12}>
                                        <FormSelectSearch
                                            name={"nsampletypecode"}
                                            formLabel={this.props.intl.formatMessage({ id: "IDS_SAMPLETYPE" })}
                                            placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                            value={this.state.selectedRecord.SampleTypes ? this.state.selectedRecord.SampleTypes : []}
                                            options={this.props.Login.optionsSampleType ? this.props.Login.optionsSampleType : []}
                                            optionId="nsampletypecode"
                                            optionValue="ssampletypename"
                                            isMandatory={true}
                                            required={true}
                                            as={"select"}
                                            onChange={(event) => this.onComboChange(event, "nsampletypecode")}
                                        />
                                    </Col>
                                    <Col md={11}>
                                        <FormInput
                                            name={this.props.Login.language}
                                            placeholder={this.props.intl.formatMessage({ id: "IDS_REGISTRATIONTYPE" })}
                                            onChange={(event) => this.onInputOnChange(event, 'sregtypename')}
                                            className=""
                                            isMandatory={true}
                                            label={this.props.intl.formatMessage({ id: "IDS_REGISTRATIONTYPE" })}
                                            required={true}
                                            value={this.state.selectedRecord.sregtypename ? this.state.selectedRecord.sregtypename[this.props.Login.language] : ""}
                                            maxLength={"100"}
                                        />
                                    </Col>
                                    <Col md={1} className="p-0">
                                        <Nav.Link name="addsynonym"
                                            data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_ADDSYNONYMN" })}
                                            // data-for="tooltip_list_wrap"
                                            // hidden={this.state.userRoleControlRights.indexOf(this.state.previewId) === -1}
                                            className="btn btn-circle outline-grey mr-2"
                                            onClick={(e) => this.setState({ showSynonym: true })}
                                        >
                                            <FontAwesomeIcon icon={faLanguage} />
                                        </Nav.Link>
                                    </Col>
                                    <Col md={12}>
                                        <FormTextarea
                                            name={"sdescription"}
                                            placeholder={this.props.intl.formatMessage({ id: "IDS_DESCRIPTION" })}
                                            onChange={(event) => this.onInputOnChange(event)}
                                            isMandatory={false}
                                            rows="1"
                                            label={this.props.intl.formatMessage({ id: "IDS_DESCRIPTION" })}
                                            type="textarea"
                                            value={this.state.selectedRecord ? this.state.selectedRecord.sdescription : ""}
                                            maxLength={"255"}
                                        />

                                    </Col>
                                </Row>
                        } />
                    : ""}
            </>

        );
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
                    dataResult: process(this.props.Login.masterData, this.state.dataState)
                });
            }
            else {
                //ALPD-3788 Blank page occurs while click the registration type screen for specific scenario..
                if (this.props.Login.operation === "create" && this.props.Login.inputParam !== undefined && 
                    this.props.Login.inputParam.saveType === 2) {
                    this.props.Login.inputParam.formRef.current.reset();
                }
                let { dataState } = this.state;
                if (this.props.Login.dataState === undefined) {
                    dataState = { skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5 }
                }
                this.setState({
                    data: this.props.Login.masterData,
                    dataResult: process(this.props.Login.masterData, dataState),
                    dataState,
                    selectedRecord: { sregtypename: '', sdescription: '' }
                });
            }
        }
        else if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord) {
            let mandatoryFields = this.props.Login.mandatoryFields ? (this.props.Login.mandatoryFields) : [
                { "idsName": "IDS_SAMPLETYPE", "dataField": "SampleTypes", "mandatoryLabel": "IDS_SELECT", "controlType": "textbox","ismultilingual":"false" },
                { "idsName": "IDS_REGISTRATIONTYPE", "dataField": "sregtypename", "mandatoryLabel": "IDS_ENTER", "controlType": "textbox","ismultilingual":"true"},
                //{"idsName":"IDS_DESCRIPTION","dataField":"sdescription" , "mandatoryLabel":"IDS_ENTER", "controlType": "textbox"},
            ]
            this.setState({ selectedRecord: this.props.Login.selectedRecord, mandatoryFields });
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

    onInputOnChange = (event, name) => {
        let selectedRecord = this.state.selectedRecord || {};
        if (event.target.type === 'checkbox') {
            selectedRecord[event.target.name] = event.target.checked === true ? 3 : 4;
        }
        else {
            if (name === 'synonym') {               
                selectedRecord['sregtypename'] = {
                    ...selectedRecord['sregtypename'],
                    [event.target.name]: event.target.value
                }
            } 
            else if (name === 'sregtypename'){
                const langArray =  this.props.Login.languageList;
                const langDataObject = {};
                langArray.map(item=>
                    langDataObject[item.value] = event.target.value);

                selectedRecord['sregtypename'] = {
                    ...selectedRecord['sregtypename'],
                    ...langDataObject
                }
            }
            else {
                selectedRecord[event.target.name] = event.target.value;
            }
        }
        this.setState({ selectedRecord });
    }

    onComboChange = (comboData, fieldName) => {
        const { selectedRecord } = this.state || {};
        if (comboData) {

            fieldName = 'nsampletypecode';
            selectedRecord['SampleTypes'] = comboData;
            selectedRecord[fieldName] = comboData.value;
        }
        else {
            fieldName = 'nsampletypecode';
            selectedRecord['SampleTypes'] = comboData;
            selectedRecord[fieldName] = "";
        }

        this.setState({ selectedRecord });
    }
}
export default connect(mapStateToProps, {
    callService, crudMaster, showRegTypeAddScreen, fetchRegTypeById,
    updateStore, validateEsignCredential
})(injectIntl(RegistrationType));