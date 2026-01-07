import React from 'react'
import { ListWrapper } from '../../../components/client-group.styles'
import { Row, Col} from 'react-bootstrap';
import { toast } from 'react-toastify';
import { process } from '@progress/kendo-data-query';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { callService, crudMaster, showInstitutionDepartmentAddScreen, fetchinstituiondeptTypeById, updateStore, validateEsignCredential } from '../../../actions';
import { DEFAULT_RETURN } from '../../../actions/LoginTypes';
import DataGrid from '../../../components/data-grid/data-grid.component';
import SlideOutModal from '../../../components/slide-out-modal/SlideOutModal';
import { showEsign, getControlMap } from '../../../components/CommonScript';
import Esign from '../../audittrail/Esign';
import FormInput from '../../../components/form-input/form-input.component';

const mapStateToProps = state => {
    return ({ Login: state.Login })
}

class InstitutionDepartment extends React.Component {
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
            mandatoryFields: [
                { "idsName": "IDS_INSTITUTIONDEPARTMENTNAME", "dataField": "sinstitutiondeptname", "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
                { "idsName": "IDS_INSTITUTIONDEPARTMENTCODE", "dataField": "sinstitutiondeptcode", "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },

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
            data: { openModal, loadEsign, selectedRecord, selectedId}
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
        if (this.props.Login.operation === "update") {
            // edit
            selectedId = this.state.selectedRecord.ninstitutiondeptcode
            dataState=this.state.dataState
            inputData[this.props.Login.inputParam.methodUrl.toLowerCase()] = this.state.selectedRecord;
            this.extractedColumnList.map(item => {
                return inputData[this.props.Login.inputParam.methodUrl.toLowerCase()][item.dataField] = this.state.selectedRecord[item.dataField] ? this.state.selectedRecord[item.dataField] : "";
            })
        }
        else {
            //add                                
          inputData[this.props.Login.inputParam.methodUrl.toLowerCase()] = { "nsitecode": this.props.Login.userInfo.nmastersitecode };
          this.extractedColumnList.map(item => {
              return inputData[this.props.Login.inputParam.methodUrl.toLowerCase()][item.dataField] = this.state.selectedRecord[item.dataField] ? this.state.selectedRecord[item.dataField]:""
          })
            }               
        const inputParam = {
            methodUrl: this.props.Login.inputParam.methodUrl,
            classUrl: this.props.Login.inputParam.classUrl,
            displayName: this.props.Login.inputParam.displayName ? this.props.Login.inputParam.displayName : '',
            inputData: inputData,
            operation: this.props.Login.operation,
            saveType, formRef, dataState, selectedId,
            selectedRecord: {...this.state.selectedRecord}
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

    //to delete a recoed
    deleteRecord = (deleteParam) => {
        const inputParam = {
            methodUrl: this.props.Login.inputParam.methodUrl,
            classUrl: this.props.Login.inputParam.classUrl,
            dataState: this.state.dataState,
            displayName: this.props.Login.inputParam.displayName ? this.props.Login.inputParam.displayName : '',
            inputData: {
                [this.props.Login.inputParam.methodUrl.toLowerCase()]: deleteParam.selectedRecord,//.dataItem,
                "userinfo": this.props.Login.userInfo
            },
            operation: deleteParam.operation,
            selectedRecord: {...this.state.selectedRecord}
        }

        const masterData = this.props.Login.masterData;

        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, deleteParam.ncontrolCode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData }, operation: deleteParam.operation, openModal: true,
                    screenName: this.props.Login.inputParam.displayName
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
                { "idsName": "IDS_INSTITUTIONDEPARTMENTNAME", "dataField": "sinstitutiondeptname", "width": "250px" },
                { "idsName": "IDS_INSTITUTIONDEPARTMENTCODE", "dataField": "sinstitutiondeptcode", "width": "250px" },
            ]
            primaryKeyField = "ninstitutiondeptcode";
        }

        const addID = this.props.Login.inputParam && this.state.controlMap.has("AddInstitutionDepartment")
            && this.state.controlMap.get('AddInstitutionDepartment').ncontrolcode;
        const editId = this.props.Login.inputParam && this.state.controlMap.has("EditInstitutionDepartment")
            && this.state.controlMap.get('EditInstitutionDepartment').ncontrolcode;
        const editParam = {
            screenName: "InstitutionDepartment", operation: "update", primaryKeyField: primaryKeyField,
            masterData: this.props.Login.masterData, userInfo: this.props.Login.userInfo, ncontrolCode: editId
        };

        const deleteParam = { screenName: "InstitutionDepartment", methodUrl: "InstitutionDepartment", operation: "delete", key: 'institutiondepartment' };

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
                                    fetchRecord={this.props.fetchinstituiondeptTypeById}
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
                                    addRecord={() => this.props.showInstitutionDepartmentAddScreen(this.props.Login.userInfo, addID)}
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
                                :
                                <Row>
                                    <Col md={12}>
                                        <FormInput
                                            name={"sinstitutiondeptname"}
                                            placeholder={this.props.intl.formatMessage({ id: "IDS_INSTITUTIONDEPARTMENTNAME" })}
                                            label={this.props.intl.formatMessage({ id: "IDS_INSTITUTIONDEPARTMENTNAME" })}
                                            value={this.state.selectedRecord.sinstitutiondeptname ? this.state.selectedRecord.sinstitutiondeptname : ""}
                                            isMandatory={true}
                                            required={true}
                                            type="text"
                                            onChange={(event) => this.onInputOnChange(event)}
                                            maxLength={100}
                                        />
                                    </Col>
                                   
                                    <Col md={12}>
                                        <FormInput
                                            name={"sinstitutiondeptcode"}
                                            placeholder={this.props.intl.formatMessage({ id: "IDS_INSTITUTIONDEPARTMENTCODE" })}
                                            onChange={(event) => this.onInputOnChange(event)}
                                            isMandatory={true}
                                            required={true}
                                            rows="1"
                                            label={this.props.intl.formatMessage({ id: "IDS_INSTITUTIONDEPARTMENTCODE" })}
                                            type="text"
                                            value={this.state.selectedRecord.sinstitutiondeptcode ? this.state.selectedRecord.sinstitutiondeptcode : ""}
                                            maxLength={"5"}
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
                if (this.props.Login.operation === "create" && this.props.Login.inputParam.saveType === 2) {
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
           
            this.setState({ selectedRecord: this.props.Login.selectedRecord });
        }
    }
    onInputOnChange = (event) => {
        const selectedRecord = this.state.selectedRecord || {};
        selectedRecord[event.target.name] = event.target.value;
        if (event.target.type === 'checkbox') {
            if (event.target.name === "agree") {
                selectedRecord[event.target.name] = event.target.checked === true ? 3 : 4;
            }
        }
        else {
            selectedRecord[event.target.name] = event.target.value;
        }
        this.setState({ selectedRecord });
    }
    
}    
export default connect(mapStateToProps,{
    callService, crudMaster, showInstitutionDepartmentAddScreen, fetchinstituiondeptTypeById,
    updateStore, validateEsignCredential
})(injectIntl(InstitutionDepartment));
    
