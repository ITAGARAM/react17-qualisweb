import React from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { ListWrapper } from '../../components/client-group.styles';
import { Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { process } from '@progress/kendo-data-query';
import { callService, crudMaster, validateEsignCredential, updateStore } from '../../actions';
import DataGrid from '../../components/data-grid/data-grid.component';
import { getControlMap, showEsign, validateLoginId } from '../../components/CommonScript';
import Esign from '../audittrail/Esign';
import SlideOutModal from '../../components/slide-out-modal/SlideOutModal';
import { DEFAULT_RETURN } from '../../actions/LoginTypes';
import AddADSUsers from './AddADSUsers';

const mapStateToProps = state => {
    return ({ Login: state.Login })
}

class ADSUsers extends React.Component {
    constructor(props) {
        super(props);
        this.formRef = React.createRef();
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
        this.extractedColumnList = [
            { "controlType": "textbox","idsName": "IDS_LOGINID", "dataField": "sloginid", "width": "400px","mandatory": true, "mandatoryLabel": "IDS_ENTER"},
            { "controlType": "textbox","idsName": "IDS_EMPID", "dataField": "necno", "width": "150px","mandatory": true, "mandatoryLabel": "IDS_ENTER" }
        ]
        this.primaryKeyField = "nadsusercode";
        this.fieldList = ["suserid", "spassword"];
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

            dataResult: process(this.state.data, event.dataState),
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
                selectedRecord['esignreason']=""
            }
        } else {
            openModal = false;
            selectedRecord = {};
            selectedId=null;
        }
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { openModal, loadEsign, selectedRecord, selectedId }
        }
        this.props.updateStore(updateInfo);
    }


    render() {

        const syncId = this.props.Login.inputParam && this.state.controlMap.has("ManualSync".concat(this.props.Login.inputParam.methodUrl))
            && this.state.controlMap.get("ManualSync".concat(this.props.Login.inputParam.methodUrl)).ncontrolcode;

        const mandatoryFields = [
        { "controlType": "textbox","idsName": "IDS_USERID", "dataField": "suserid", "width": "400px","mandatory": true, "mandatoryLabel": "IDS_ENTER"},
        { "controlType": "textbox","idsName": "IDS_PASSWORD", "dataField": "spassword", "width": "150px","mandatory": true, "mandatoryLabel": "IDS_ENTER" }]
       
        return (
            <>
                <Row>
                    <Col>
                        <ListWrapper className="client-list-content">
                            {this.state.data ?
                                <DataGrid
                                    primaryKeyField={this.primaryKeyField}
                                    selectedId={this.props.Login.selectedId}
                                    data={this.state.data}
                                    dataResult={this.state.dataResult}
                                    dataState={this.state.dataState}
                                    dataStateChange={this.dataStateChange}
                                    extractedColumnList={this.extractedColumnList}
                                    controlMap={this.state.controlMap}
                                    userRoleControlRights={this.state.userRoleControlRights}
                                    inputParam={this.props.Login.inputParam}
                                    userInfo={this.props.Login.userInfo}
                                    reloadData={this.reloadData}
                                    syncData={() => this.syncADSUsers(syncId)}
                                    scrollable={'scrollable'}
                                    gridHeight={'600px'}
                                    isToolBarRequired={true}
                                    isRefreshRequired={false}
                                    pageable={true}
                                />
                                : ""}
                        </ListWrapper>
                    </Col>
                </Row>
                {
                    this.props.Login.openModal &&
                    <SlideOutModal
                        show={this.props.Login.openModal}
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
                            <Esign
                                operation={this.props.Login.operation}
                                formatMessage={this.props.intl.formatMessage}
                                onInputOnChange={this.onInputOnChange}
                                inputParam={this.props.Login.inputParam}
                                selectedRecord={this.state.selectedRecord || {}}
                            />
                            : <AddADSUsers
                                selectedRecord={this.state.selectedRecord || {}}
                                onInputOnChange={this.onInputOnChange}
                                onLoginInputChange={this.onLoginInputChange}
                                onComboChange={this.onComboChange}
                                formatMessage={this.props.intl.formatMessage}
                                userInfo={this.props.Login.userInfo}
                                settings={this.props.Login.settings}
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
                    dataState = {skip:0,take:this.state.dataState.take }
                }
                if(this.state.dataResult.data){
                    if(this.state.dataResult.data.length ===1){
                       let skipcount=this.state.dataState.skip>0?(this.state.dataState.skip-this.state.dataState.take):
                       this.state.dataState.skip
                        dataState={skip:skipcount,take:this.state.dataState.take}
                    }
                }

                this.setState({
                    data: this.props.Login.masterData,
                    isOpen: false,
                    dataResult: process(this.props.Login.masterData, dataState),
                    dataState
                });
            }
        } else if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord) {
            this.setState({ selectedRecord: this.props.Login.selectedRecord });
        }
    }

    onInputOnChange = (event) => {

        const selectedRecord = this.state.selectedRecord || {};
       // if(event.target.name === ""){
        selectedRecord[event.target.name] = event.target.value;
        this.setState({ selectedRecord });
    }
    onLoginInputChange=(event) =>{
        const selectedRecord = this.state.selectedRecord || {};
        const loginid = validateLoginId(event.target.value);
        if (loginid) {
            selectedRecord[event.target.name] = event.target.value;
        } else {
            selectedRecord[event.target.name] = this.state.selectedRecord[event.target.name];
        }
        this.setState({ selectedRecord });
    }
    syncADSUsers = (syncId) => {
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                ncontrolCode:syncId,
                openModal: true, screenName: this.props.Login.inputParam.displayName ,
                operation: "sync",
                selectedRecord:{}
            }
        }
        this.props.updateStore(updateInfo);
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
        //add 
        let inputData = [];
        inputData["userinfo"] = this.props.Login.userInfo;
        let dataState = undefined;
        let selectedId = null;
                     
            inputData[this.props.Login.inputParam.methodUrl.toLowerCase()] = { "nsitecode": this.props.Login.userInfo.nmastersitecode };
            this.fieldList.map(item => {
                return inputData[this.props.Login.inputParam.methodUrl.toLowerCase()][item] = this.state.selectedRecord[item]
            })
        
        const inputParam = {
            classUrl: this.props.Login.inputParam.classUrl,
            methodUrl: this.props.Login.inputParam.methodUrl,
            inputData: inputData,
            operation: this.props.Login.operation,
            displayName: this.props.Login.inputParam.displayName, saveType, formRef, selectedId, dataState
        }
        const esignNeeded = showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolCode);
        if (esignNeeded) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData: this.props.Login.masterData },
                    openModal: true, screenName: this.props.Login.inputParam.displayName ,
                    operation: this.props.Login.operation
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.crudMaster(inputParam, this.props.Login.masterData, "openModal");
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

}
export default connect(mapStateToProps, { callService, crudMaster, validateEsignCredential,updateStore })(injectIntl(ADSUsers));