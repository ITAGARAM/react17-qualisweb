import React from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { process } from '@progress/kendo-data-query';
import DataGrid from '../../../components/data-grid/data-grid.component';
import AddEmailHost from './AddEmailHost';
import Esign from '../../audittrail/Esign';
import SlideOutModal from '../../../components/slide-out-modal/SlideOutModal';
import { ListWrapper } from '../../../components/client-group.styles';
import { callService, crudMaster, fetchEmailHostById, validateEsignCredential, openEmailHostModal, updateStore } from '../../../actions';
import { getControlMap, showEsign,validatePhoneNumber, validateEmail } from '../../../components/CommonScript';
import { DEFAULT_RETURN } from '../../../actions/LoginTypes';
import { transactionStatus } from '../../../components/Enumeration';

const mapStateToProps = state => {
    return ({ Login: state.Login })
}

class EmailHost extends React.Component {
    constructor(props) {
        super(props);
        this.formRef = React.createRef();
        // this.closeModal = this.closeModal.bind(this);
        this.extractedColumnList = [];
        this.fieldList = [];

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

    dataStateChange = (event) => {
        this.setState({
            dataResult: process(this.props.Login.masterData, event.dataState),
            dataState: event.dataState
        });
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
            } else {
                loadEsign = false;
            }
        } else {
            openModal = false;
            selectedRecord = {};
        }
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { openModal, loadEsign, selectedRecord ,selectedId:null}
        }
        this.props.updateStore(updateInfo);
    }


    render() {

        let primaryKeyField = "";

        if (this.props.Login.inputParam !== undefined) {

            this.extractedColumnList = [
                    { "controlType": "textbox", "idsName": "IDS_DISPLAYNAME", "dataField": "sprofilename", "width": "200px" },
                    { "controlType": "textbox", "idsName": "IDS_HOSTNAME", "dataField": "shostname", "width": "200px" },
                    { "controlType": "textbox", "idsName": "IDS_EMAILID", "dataField": "semail", "width": "200px" },
                    { "controlType": "numericinput", "idsName": "IDS_PORTNO", "dataField": "nportno", "width": "200px" },
                    { "controlType": "checkbox", "idsName": "IDS_DEFAULTSTATUS", "dataField": "sdisplaystatus", "width": "200px" },
               ]
       
            primaryKeyField = "nemailhostcode";
            this.fieldList = ["nemailhostcode","sprofilename", "shostname", "nportno", "semail", "spassword", "ndefaultstatus", "sauthenticationname"];
        }
        const mandatoryFields=[ { "mandatory": true, "idsName": "IDS_DISPLAYNAME", "dataField": "sprofilename" , "mandatoryLabel":"IDS_ENTER", "controlType": "textbox" },
                                 { "mandatory": true, "idsName": "IDS_HOSTNAME", "dataField": "shostname", "mandatoryLabel":"IDS_ENTER", "controlType": "textbox"},
                                 { "mandatory": true, "idsName": "IDS_EMAILID", "dataField": "semail", "alertPreFix": this.props.intl.formatMessage({ id: "IDS_VALID" }), "validateFunction": validateEmail ,"mandatoryLabel":"IDS_ENTER", "controlType": "textbox"},
                                 { "mandatory": true, "idsName": "IDS_PASSWORD", "dataField": "spassword", "mandatoryLabel":"IDS_ENTER", "controlType": "textbox"},
                                 { "mandatory": true, "idsName": "IDS_PORTNO", "dataField": "nportno", "mandatoryLabel":"IDS_ENTER", "controlType": "textbox"}

                                ];
        const addId = this.props.Login.inputParam && this.state.controlMap.has("Add".concat(this.props.Login.inputParam.methodUrl))
            && this.state.controlMap.get("Add".concat(this.props.Login.inputParam.methodUrl)).ncontrolcode;

        const editID = this.props.Login.inputParam && this.state.controlMap.has("Edit".concat(this.props.Login.inputParam.methodUrl))
            && this.state.controlMap.get("Edit".concat(this.props.Login.inputParam.methodUrl)).ncontrolcode;

            const deleteID = this.props.Login.inputParam && this.state.controlMap.has("Delete".concat(this.props.Login.inputParam.methodUrl))
            && this.state.controlMap.get("Delete".concat(this.props.Login.inputParam.methodUrl)).ncontrolcode;

        const editParam = {
            screenName: this.props.Login.inputParam && this.props.Login.inputParam.displayName && this.props.intl.formatMessage({ id: this.props.Login.inputParam.displayName }), primaryKeyField: "nemailhostcode", operation: "update",
            inputParam: this.props.Login.inputParam, userInfo: this.props.Login.userInfo, ncontrolCode: editID
        };
        const deleteParam = { operation: "delete",ncontrolCode:deleteID};
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
                                   // detailedFieldList={this.detailedFieldList}
                                    //expandField="expanded"
                                    formatMessage={this.props.intl.formatMessage}
                                    controlMap={this.state.controlMap}
                                    userRoleControlRights={this.state.userRoleControlRights}
                                    inputParam={this.props.Login.inputParam}
                                    userInfo={this.props.Login.userInfo}
                                    fetchRecord={this.props.fetchEmailHostById}
                                    deleteRecord={this.deleteRecord}
                                    reloadData={this.reloadData}
                                    editParam={editParam}
                                    deleteParam={deleteParam}
                                    addRecord={() => this.props.openEmailHostModal("IDS_MAILHOST", "create", "nemailhostcode", this.props.Login.masterData, this.props.Login.userInfo, addId)}
                                    // isComponent={true}
                                    pageable={true}
                                    isActionRequired={true}
                                    isToolBarRequired={true}
                                    scrollable={"scrollable"}
                                    selectedId={this.props.Login.selectedId}

                                />
                            : ""}
                        </ListWrapper>
                    </Col>
                </Row>
                {this.props.Login.openModal &&
                    <SlideOutModal
                        show={this.props.Login.openModal}
                        closeModal={this.closeModal}
                        operation={this.props.Login.operation}
                        inputParam={this.props.Login.inputParam}
                        screenName={this.props.Login.screenName}
                        onSaveClick={this.onSaveClick}
                        esign={this.props.Login.loadEsign}
                        validateEsign={this.validateEsign}
                        selectedRecord={this.state.selectedRecord || {}}
                        mandatoryFields={mandatoryFields}
                        masterStatus={this.props.Login.masterStatus}
                        updateStore={this.props.updateStore}
                        addComponent={this.props.Login.loadEsign ?
                            <Esign
                                operation={this.props.Login.operation}
                               // formatMessage={this.props.intl.formatMessage}
                                onInputOnChange={this.onInputOnChange}
                                inputParam={this.props.Login.inputParam}
                                selectedRecord={this.state.selectedRecord || {}}
                            />
                            : <AddEmailHost
                                selectedRecord={this.state.selectedRecord || {}}
                                onInputOnChange={this.onInputOnChange}
                                onComboChange={this.onComboChange}

                            />
                        }
                    />
                }
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
                    // isOpen: false,
                    dataResult: process(this.props.Login.masterData, dataState),
                    dataState//,
                    //selectedRecord:{ncalibrationreq:transactionStatus.NO,ncategorybasedflow:transactionStatus.NO,ndefaultstatus:transactionStatus.NO}
                });
            }
        } else if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord) {
            this.setState({ selectedRecord: this.props.Login.selectedRecord });
        }
    }

    onInputOnChange = (event) => {

        const selectedRecord = this.state.selectedRecord || {};
        if (event.target.type === 'checkbox') 
        {
           selectedRecord[event.target.name] = event.target.checked === true ? transactionStatus.YES : transactionStatus.NO;
        }
        else if (event.target.name === "nportno")
        {
           if (event.target.value !== ""){
                
                if(!isNaN(event.target.value)){
                    event.target.value = validatePhoneNumber(event.target.value);
                 if (event.target.value !== "")
                      selectedRecord[event.target.name] = event.target.value;
                 else
                     selectedRecord[event.target.name] = selectedRecord[event.target.name];
                }else{
                    selectedRecord[event.target.name] = selectedRecord[event.target.name]; 
                }
            }
            else{     
                selectedRecord[event.target.name] = event.target.value;               
            }
        } 
        else {
            selectedRecord[event.target.name] = event.target.value;
        }
        this.setState({ selectedRecord });

    }

    onComboChange = (comboData, fieldName) => {
        if (comboData !== null) {
            const selectedRecord = this.state.selectedRecord || {};
            selectedRecord[fieldName] = comboData;
            this.setState({ selectedRecord });
        }
    }

    deleteRecord = (inputData) => {
        const inputParam = {
            classUrl: this.props.Login.inputParam.classUrl,
            methodUrl: this.props.Login.inputParam.methodUrl,

            inputData: {
                [this.props.Login.inputParam.methodUrl.toLowerCase()]: inputData.selectedRecord,
                "userinfo": this.props.Login.userInfo
            },
            operation: inputData.operation,
            displayName: this.props.Login.inputParam.displayName,
            dataState: this.state.dataState
        }
        const esignNeeded = showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, inputData.ncontrolCode);
        if (esignNeeded) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData: this.props.Login.masterData },
                    openModal: true, screenName: this.props.intl.formatMessage({ id: this.props.Login.inputParam.displayName }),
                    operation: inputData.operation
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.crudMaster(inputParam, this.props.Login.masterData, "openModal");
        }
    }

    reloadData = () => {
        const inputParam = {
            inputData: { "userinfo": this.props.Login.userInfo },

            classUrl: this.props.Login.inputParam.classUrl,
            methodUrl: this.props.Login.inputParam.methodUrl,
            userInfo: this.props.Login.userInfo,
            displayName: this.props.Login.inputParam.displayName
        };

        this.props.callService(inputParam);
    }

    onSaveClick = (saveType, formRef) => {
        let inputData = [];
        inputData["userinfo"] = this.props.Login.userInfo;
        let postParam = undefined;
        let selectedId = null;

        if (this.props.Login.operation === "update") {
            // edit
            postParam = { inputListName: "emailhost", selectedObject: "selectedEmailHost", 
                          primaryKeyField: "nemailhostcode" }
            //inputData["emailhost"] = this.state.selectedRecord;

            inputData[this.props.Login.inputParam.methodUrl.toLowerCase()] = JSON.parse(JSON.stringify(this.state.selectedRecord));
            selectedId = this.props.Login.selectedRecord.nemailhostcode;
            this.fieldList.map(item => {
               return inputData["emailhost"][item] = this.state.selectedRecord[item] ? this.state.selectedRecord[item] : "";
              })
        } else {
            inputData["emailhost"] = { "nsitecode": this.props.Login.userInfo.nmastersitecode };
             this.fieldList.map(item => {
                return inputData["emailhost"][item] = this.state.selectedRecord[item]
              });
        }
        inputData["emailhost"]["sauthenticationname"] = this.state.selectedRecord["sauthenticationname"]? this.state.selectedRecord["sauthenticationname"]:"True";

        if (inputData["emailhost"]["agree"]){
            delete inputData["emailhost"]["agree"]
        }

        const inputParam = {
            classUrl: this.props.Login.inputParam.classUrl,
            methodUrl: this.props.Login.inputParam.methodUrl,
            displayName: this.props.Login.inputParam.displayName ? this.props.Login.inputParam.displayName : '',
            inputData: inputData,
            operation: this.props.Login.operation,
            saveType, formRef, postParam, searchRef: this.searchRef, selectedId
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
        // this.props.crudMaster(inputParam, this.props.Login.masterData,"openModal");
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

}
export default connect(mapStateToProps, { callService, crudMaster, fetchEmailHostById, validateEsignCredential, openEmailHostModal, updateStore })(injectIntl(EmailHost));