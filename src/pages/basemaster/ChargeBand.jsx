import React from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import DataGrid from '../../components/data-grid/data-grid.component';
import { callService, crudMaster, updateStore, validateEsignCredential, fetchChargeBandById } from '../../actions';
import { Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { process } from '@progress/kendo-data-query';
import { ListWrapper } from '../../components/client-group.styles'
import FormInput from '../../components/form-input/form-input.component';
import SlideOutModal from '../../components/slide-out-modal/SlideOutModal';
import FormTextarea from '../../components/form-textarea/form-textarea.component';
import Esign from '../audittrail/Esign';
import { showEsign, getControlMap } from '../../components/CommonScript'
import { DEFAULT_RETURN } from '../../actions/LoginTypes'
import { transactionStatus } from '../../components/Enumeration';


const mapStateToProps = state => {
    return ({ Login: state.Login })
}
class ChargeBand extends React.Component {
    constructor(props) {
        super(props);
        this.extractedColumnList = [];
        this.fieldList = [];
        const dataState = {
            skip: 0,
            take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5,
        };
        this.state = {
            data: [], masterStatus: "", error: "",
            dataResult: [],
            dataState: dataState,
            selectedRecord: {}, userRoleControlRights: [], controlMap: new Map()
        };
    }
    dataStateChange = (event) => {
        this.setState({
            dataResult: process(this.state.data, event.dataState),
            dataState: event.dataState
        });
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
    openModal = (ncontrolcode) => {
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                openModal: true,
                operation: "create",
                selectedRecord: {},
                ncontrolcode: ncontrolcode
            }
        }
        this.props.updateStore(updateInfo);
    }
    //this.setState({ openModal: true, selectedRecord :undefined, operation:"create" });
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
                selectedRecord['esignpassword'] = ""
                selectedRecord['esigncomments'] = ""
                selectedRecord['esignreason']=""
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
    reloadData = () => {
        const inputParam = {
            inputData: { userinfo: this.props.Login.userInfo },
            methodUrl: this.props.Login.inputParam.methodUrl,
            classUrl: this.props.Login.inputParam.classUrl,
            displayName: this.props.Login.inputParam.displayName,
            userInfo: this.props.Login.userInfo
        };

        this.props.callService(inputParam);
    }
    onSaveClick = (saveType, formRef) => {
        //add 
        let inputData = [];
        let dataState = undefined;
        let fieldList = ["schargebandname", "sdescription", "nprice"]
        inputData["userinfo"] = this.props.Login.userInfo;
        let selectedId = null;
        if (this.props.Login.operation === "update") {
            // edit
            selectedId = this.state.selectedRecord.nchargebandcode
            dataState = this.state.dataState;
            inputData[this.props.Login.inputParam.methodUrl.toLowerCase()] = this.state.selectedRecord;
            fieldList.map(item => {
                return inputData[this.props.Login.inputParam.methodUrl.toLowerCase()][item] = 
                this.state.selectedRecord[item]!==undefined?item==='nprice'?
                this.state.selectedRecord[item] ==='.'?'0.0':
                this.state.selectedRecord[item]  : this.state.selectedRecord[item] : "";
            })
        }
        else {
            //add               
            inputData[this.props.Login.inputParam.methodUrl.toLowerCase()] = { "nsitecode": this.props.Login.userInfo.nmastersitecode };

            fieldList.map(item => {
                return inputData[this.props.Login.inputParam.methodUrl.toLowerCase()][item] = 
                this.state.selectedRecord[item]?item==='nprice'?
                this.state.selectedRecord[item] ==='.'?'0.0':
                this.state.selectedRecord[item]  : this.state.selectedRecord[item] : "";
            })
        }
        const inputParam = {
            classUrl: this.props.Login.inputParam.classUrl,
            methodUrl: this.props.Login.inputParam.methodUrl,
            displayName: this.props.Login.inputParam.displayName,
            inputData: inputData,
            operation: this.props.Login.operation,
            dataState, saveType, formRef, selectedId
        }
        const masterData = this.props.Login.masterData;
        const esignNeeded = showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolcode);
        if (esignNeeded) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData }, saveType,
                    operation: this.props.Login.operation, openModal: true,
                    screenName: this.props.Login.inputParam.displayName
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
            displayName: this.props.Login.inputParam.displayName,
            inputData: {
                "chargeband": deleteParam.selectedRecord,
                "userinfo": this.props.Login.userInfo
            },
            operation: "delete"
        }
        const masterData = this.props.Login.masterData;

        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, deleteParam.ncontrolCode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData }, operation: "delete", openModal: true,
                    screenName: this.props.Login.inputParam.displayName
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.crudMaster(inputParam, masterData, "openModal");
        }
    }
    render() {
        let primaryKeyField = "";
        if (this.props.Login.inputParam !== undefined) {
            //this.extractedColumnList =["schargebandname","sdescription","nprice"]
            this.extractedColumnList = [
                { "idsName": "IDS_CHARGEBANDNAME", "dataField": "schargebandname", "width": "200px" },
                { "idsName": "IDS_DESCRIPTION", "dataField": "sdescription", "width": "400px" },
                { "idsName": "IDS_PRICE", "dataField": "nprice", "width": "150px" }
            ];
            primaryKeyField = "nchargebandcode";
        }
        const addID = this.props.Login.inputParam && this.state.controlMap.has("AddChargeBand")
            && this.state.controlMap.get('AddChargeBand').ncontrolcode;
        const editID = this.props.Login.inputParam && this.state.controlMap.has("EditChargeBand")
            && this.state.controlMap.get('EditChargeBand').ncontrolcode;
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
            methodUrl: this.props.Login.inputParam ? this.props.Login.inputParam.methodUrl : '',
            operation: "delete"
        };
        const mandatoryFields = [
            { "idsName": "IDS_CHARGEBANDNAME", "dataField": "schargebandname" , "mandatoryLabel":"IDS_ENTER", "controlType": "textbox" },
            { "idsName": "IDS_PRICE", "dataField": "nprice" , "mandatoryLabel":"IDS_ENTER", "controlType": "textbox" }
        ];
        return (
            <>
                <Row>
                    <Col>
                        <ListWrapper className="client-list-content">
                            {/* <PrimaryHeader className="d-flex justify-content-between mb-3">
                            <HeaderName className="header-primary-md">
                                {this.props.Login.inputParam ? 
                                <FormattedMessage id={this.props.Login.inputParam.displayName} /> :""}
                            </HeaderName>
                            <Button className="btn btn-user btn-primary-blue" 
                            hidden={this.state.userRoleControlRights.indexOf(addID) === -1} 
                            onClick={()=>this.openModal(addID)} role="button">
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
                                    fetchRecord={this.props.fetchChargeBandById}
                                    deleteRecord={this.deleteRecord}
                                    reloadData={this.reloadData}
                                    pageable={{ buttonCount: 4, pageSizes: true }}
                                    // isComponent={true}
                                    //pageable={false}
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
                                    addRecord={() => this.openModal(addID)}
                                />
                                : ""}

                        </ListWrapper>
                    </Col>
                </Row>
                {this.props.Login.openModal ?
                    <SlideOutModal
                        onSaveClick={this.onSaveClick}
                        operation={this.props.Login.operation}
                        screenName="IDS_CHARGEBAND"
                        closeModal={this.closeModal}
                        show={this.props.Login.openModal}
                        inputParam={this.props.Login.inputParam}
                        esign={this.props.Login.loadEsign}
                        validateEsign={this.validateEsign}
                        selectedRecord={this.state.selectedRecord || {}}
                        mandatoryFields={mandatoryFields}
                        addComponent={this.props.Login.loadEsign ?
                            <Esign operation={this.props.Login.operation}
                                onInputOnChange={(event) => this.onInputOnChange(event)}
                                inputParam={this.props.Login.inputParam}
                                selectedRecord={this.state.selectedRecord || {}}
                            />
                            :
                            <Row>
                                <Col md={12}>
                                    <FormInput
                                        label={this.props.intl.formatMessage({ id: "IDS_CHARGEBANDNAME" })}
                                        name={"schargebandname"}
                                        type="text"
                                        onChange={(event) => this.onInputOnChange(event)}
                                        placeholder={this.props.intl.formatMessage({ id: "IDS_CHARGEBANDNAME" })}
                                        value={this.state.selectedRecord ? this.state.selectedRecord["schargebandname"] : ""}
                                        isMandatory={true}
                                        required={true}
                                        maxLength={100}
                                    />
                                    <FormTextarea
                                        label={this.props.intl.formatMessage({ id: "IDS_DESCRIPTION" })}
                                        name={"sdescription"}
                                        type="text"
                                        onChange={(event) => this.onInputOnChange(event)}
                                        placeholder={this.props.intl.formatMessage({ id: "IDS_DESCRIPTION" })}
                                        value={this.state.selectedRecord ? this.state.selectedRecord["sdescription"] : ""}
                                        isMandatory={false}
                                        required={false}
                                        maxLength={255}
                                    />
                                    {/* <FormNumericInput
                                    name="nprice"
                                    label={this.props.intl.formatMessage({ id:"IDS_PRICE"})}
                                    placeholder={this.props.intl.formatMessage({ id:"IDS_PRICE"})}
                                    type="number"
                                    value={this.state.selectedRecord ? this.state.selectedRecord["nprice"] : ""}
                                    //max={100000}
                                    min={0}
                                    strict={true}
                                    maxLength={6}
                                    onChange={(event)=>this.onNumericInputOnChange(event,'nprice')}
                                    noStyle={true}
                                    precision={2}
                                    className="form-control"
                                    // isInvalid={!!errors.numeric}
                                    isMandatory={true}
                                    errors="Please provide a valid number."
                                /> */}
                                    <FormInput
                                        name="nprice"
                                        type="text"
                                        required={true}
                                        isMandatory={true}
                                        value={this.state.selectedRecord["nprice"] !==undefined ? this.state.selectedRecord["nprice"] : ""}
                                        // value={Object.values(this.state.selectedRecord).length > 0 ? this.state.selectedRecord["nprice"] : ""}
                                        label={this.props.intl.formatMessage({ id: "IDS_PRICE" })}
                                        placeholder={this.props.intl.formatMessage({ id: "IDS_PRICE" })}
                                        onChange={(event) => this.onNumericInputOnChange(event, 'nprice')}
                                        maxLength={9}
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

    onNumericInputOnChange = (event, name) => {
        const selectedRecord = this.state.selectedRecord || {};
        if (/^-?\d*?\.?\d*?$/.test(event.target.value) || event.target.value === "") {
            selectedRecord[name] = event.target.value;

        } else {
            //selectedRecord[name] = event.target.value;
        }
        this.setState({ selectedRecord });
        // if (value===0 || value===0.0) {
        //     selectedRecord[name] = '';
        //     this.setState({selectedRecord});
        // }else{
        //     selectedRecord[name] = value;
        //     this.setState({selectedRecord});
        // }
    }
}
export default connect(mapStateToProps, { callService, crudMaster, fetchChargeBandById, updateStore, validateEsignCredential })(injectIntl(ChargeBand));