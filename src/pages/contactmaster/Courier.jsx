import React from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { process } from '@progress/kendo-data-query';
import DataGrid from '../../components/data-grid/data-grid.component';
import AddCourier from './AddCourier';
import Esign from '../audittrail/Esign';
import SlideOutModal from '../../components/slide-out-modal/SlideOutModal';
import { ListWrapper } from '../../components/client-group.styles';
import { callService, crudMaster, fetchCourierById, validateEsignCredential, openCourierModal, updateStore } from '../../actions';
import { transactionStatus } from '../../components/Enumeration';
import { constructOptionList, getControlMap, showEsign,validateEmail,validatePhoneNumber } from '../../components/CommonScript';
import { DEFAULT_RETURN } from '../../actions/LoginTypes';

const mapStateToProps = state => {
    return ({ Login: state.Login })
}

class Courier extends React.Component {
    constructor(props) {
        super(props);
        this.formRef = React.createRef();
        this.closeModal = this.closeModal.bind(this);
        this.extractedColumnList = [];
        this.extractedColumnListClear = [];
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
            controlMap: new Map(),
            Country:[]
            //clearSelectedRecordField:[]
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
        let selectedId = this.props.Login.selectedId;
        if (this.props.Login.loadEsign) {
            if (this.props.Login.operation === "delete") {
                //selectedRecord['agree'] = 4;
                loadEsign = false;
                openModal = false;
                selectedRecord = {};
                selectedId = null;
            } else {
                loadEsign = false;
                selectedRecord['esignpassword'] = "";
                selectedRecord['esigncomments'] = "";
                selectedRecord['esignreason']="";
            }
        } else {
            openModal = false;
            selectedRecord = {};
            selectedId=null;
        }
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { openModal, loadEsign, selectedRecord,selectedId }
        }
        this.props.updateStore(updateInfo);
    }
    
    render() {

        let primaryKeyField = "";

        if (this.props.Login.inputParam !== undefined) {

            this.extractedColumnList = [
                { "controlType": "textbox", "idsName": "IDS_COURIERNAME", "dataField": "scouriername", "width": "200px" },
                { "controlType": "textbox", "idsName": "IDS_COUNTRY", "dataField": "scountryname", "width": "150px" },
                { "controlType": "textbox", "idsName": "IDS_PHONENO", "dataField": "sphoneno", "width": "150px" },
                { "idsName": "IDS_CONTACTPERSON", "dataField": "scontactperson", "width": "250px" },

            ]
            this.detailedFieldList = [
                //{ "idsName": "IDS_CONTACTPERSON", "dataField": "scontactperson", "width": "250px", columnSize:"3" },
               
                { "idsName": "IDS_EMAIL", "dataField": "semail", "width": "250px", columnSize:"4" },
                { "idsName": "IDS_MOBILENO", "dataField": "smobileno", "width": "250px", columnSize:"4" },
                { "idsName": "IDS_FAXNO", "dataField": "sfaxno", "width": "250px", columnSize:"4" },
                { "idsName": "IDS_ADDRESS1", "dataField": "saddress1", "width": "250px", columnSize:"4" },
                { "idsName": "IDS_ADDRESS2", "dataField": "saddress2", "width": "250px", columnSize:"4" },              
                { "idsName": "IDS_ADDRESS3", "dataField": "saddress3", "width": "250px", columnSize:"4" } ,               
              
            ];
            
            primaryKeyField = "ncouriercode";
            this.fieldList = ["scouriername", "scontactperson","saddress1","saddress2","saddress3","ncountrycode","sphoneno", "smobileno", "semail","sfaxno"];
        }

        const mandatoryFields=[ { "controlType": "textbox","mandatory": true, "idsName": "IDS_COURIERNAME", "dataField": "scouriername", "mandatoryLabel":"IDS_ENTER" },
                             { "controlType": "selectbox","mandatory": true, "idsName": "IDS_COUNTRY", "dataField": "ncountrycode", "mandatoryLabel":"IDS_SELECT"}
     
          ];
       
        const addId = this.props.Login.inputParam && this.state.controlMap.has("Add".concat(this.props.Login.inputParam.methodUrl))
            && this.state.controlMap.get("Add".concat(this.props.Login.inputParam.methodUrl)).ncontrolcode;

        const editID = this.props.Login.inputParam && this.state.controlMap.has("Edit".concat(this.props.Login.inputParam.methodUrl))
            && this.state.controlMap.get("Edit".concat(this.props.Login.inputParam.methodUrl)).ncontrolcode;

        const editParam = {
            screenName: this.props.Login.inputParam && this.props.Login.inputParam.displayName && this.props.intl.formatMessage({ id: this.props.Login.inputParam.displayName }), primaryKeyField: "ncouriercode", operation: "update",
            inputParam: this.props.Login.inputParam, userInfo: this.props.Login.userInfo, ncontrolCode: editID
        };
        const deleteParam = { operation: "delete" };
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
                                    detailedFieldList={this.detailedFieldList}
                                    expandField="expanded"
                                    formatMessage={this.props.intl.formatMessage}
                                    controlMap={this.state.controlMap}
                                    userRoleControlRights={this.state.userRoleControlRights}
                                    inputParam={this.props.Login.inputParam}
                                    userInfo={this.props.Login.userInfo}
                                    fetchRecord={this.props.fetchCourierById}
                                    deleteRecord={this.deleteRecord}
                                    reloadData={this.reloadData}
                                    editParam={editParam}
                                    deleteParam={deleteParam}
                                    addRecord = {() => this.props.openCourierModal("IDS_COURIER", "create", "ncouriercode", this.props.Login.masterData, this.props.Login.userInfo, addId)}
                                    // isComponent={true}
                                    gridHeight = {"600px"}
                                    pageable={true}
                                    isActionRequired={true}
                                    isToolBarRequired={true}
                                    scrollable={"scrollable"}
                                    selectedId={this.props.Login.selectedId}
                                    hasDynamicColSize={true}
                                   
                                />
                                : ""}
                        </ListWrapper>
                    </Col>
                </Row>
                {this.props.Login.openModal &&
                    <SlideOutModal
                        show={this.props.Login.openModal}
                        showSaveContinue={true}
                        closeModal={this.closeModal}
                        operation={this.props.Login.operation}
                        inputParam={this.props.Login.inputParam}
                        screenName={this.props.Login.screenName}
                        onSaveClick={this.onSaveClick}
                        esign={this.props.Login.loadEsign}
                        selectedRecord={this.state.selectedRecord || {}}
                        mandatoryFields={mandatoryFields}
                        validateEsign={this.validateEsign}
                        masterStatus={this.props.Login.masterStatus}
                        updateStore={this.props.updateStore}
                        addComponent={this.props.Login.loadEsign ?
                            <Esign
                                operation={this.props.Login.operation}
                                formatMessage={this.props.intl.formatMessage}
                                onInputOnChange={this.onInputOnChange}
                                inputParam={this.props.Login.inputParam}
                                selectedRecord={this.state.selectedRecord || {}}
                            />
                            : <AddCourier
                                selectedRecord={this.state.selectedRecord || {}}
                                onInputOnChange={this.onInputOnChange}
                                onComboChange={this.onComboChange}
                                Country={this.state.Country || []}
                               
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
                    dataState,
                    //commentted and below selected record added by sujatha ATE_274 for save & Continue issue
                    // selectedRecord:{}
                    selectedRecord: this.props.Login.selectedRecord,
                });
            }
        } else if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord) {
            this.setState({ selectedRecord: this.props.Login.selectedRecord });
        }
        if(this.props.Login.Country!==previousProps.Login.Country){
            const Country=constructOptionList(this.props.Login.Country ||[], "ncountrycode",
            "scountryname" , undefined, undefined, undefined);
            const CountryList=Country.get("OptionList")
            this.setState({Country:CountryList})
        }
    }

    onInputOnChange=(event)=>  {
        
        const selectedRecord = this.state.selectedRecord || {};
        if (event.target.type === 'checkbox')
        {
            selectedRecord[event.target.name] = event.target.checked === true ? transactionStatus.YES : transactionStatus.NO;
        }
        else  {
            if (event.target.name === "sphoneno" || event.target.name === "smobileno"){
                //event.target.value = validatePhoneNumber(event.target.value);
                if (event.target.value !== ""){
                    event.target.value = validatePhoneNumber(event.target.value);
                    selectedRecord[event.target.name] = event.target.value !== "" ? event.target.value:selectedRecord[event.target.name];
                   // selectedRecord[event.target.name] = event.target.value;                    
                }
                else{     
                    selectedRecord[event.target.name] = event.target.value;               
                }
            }  
            else{     
                selectedRecord[event.target.name] = event.target.value;               
            }
            //this.state.clearSelectedRecordField.length === 0 ||
            // if( this.state.clearSelectedRecordField.includes(event.target.name)===false )
            //     {
            //         this.state.clearSelectedRecordField.push(event.target.name); 
            //     }         
        }     
        this.setState({selectedRecord});
        
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
            
            operation: "delete",
            displayName: this.props.Login.inputParam.displayName,
            dataState: this.state.dataState,
            selectedRecord:{...this.state.selectedRecord}

        }
        delete inputParam.inputData["courier"]['expanded']
        const esignNeeded = showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, inputData.ncontrolCode);
        if (esignNeeded) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData: this.props.Login.masterData },
                    openModal: true, screenName: this.props.intl.formatMessage({ id: this.props.Login.inputParam.displayName }),
                    operation:'delete'
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
        if(this.state.selectedRecord['semail']? validateEmail(this.state.selectedRecord['semail']):true){
        let inputData = [];
        inputData["userinfo"] = this.props.Login.userInfo;
        let postParam = undefined;
        if (this.props.Login.operation === "update") {
            // edit
            postParam = { inputListName: "courier", selectedObject: "selectedCourier", primaryKeyField: "ncouriercode" }
            inputData["courier"] = JSON.parse(JSON.stringify(this.state.selectedRecord));
            this.fieldList.map(item => {
                return inputData["courier"][item] = this.state.selectedRecord[item] ? this.state.selectedRecord[item] : "";
            })
        } else {
            inputData["courier"] = { "nsitecode": this.props.Login.userInfo.nmastersitecode };
            this.fieldList.map(item => {
                return inputData["courier"][item] = this.state.selectedRecord[item] ? this.state.selectedRecord[item] : "";
            });
        }

        //let clearSelectedRecordField=["scouriername","scontactperson","saddress1","saddress2","saddress3","semail","smobileno","sphoneno","sfaxno"];
        let clearSelectedRecordField = [
            { "controlType": "textbox", "idsName": "IDS_COURIERNAME", "dataField": "scouriername", "width": "200px","isClearField":true },
            { "controlType": "textbox", "idsName": "IDS_PHONENO", "dataField": "sphoneno", "width": "150px","isClearField":true },
            { "idsName": "IDS_CONTACTPERSON", "dataField": "scontactperson", "width": "250px","isClearField":true },
            { "idsName": "IDS_ADDRESS", "dataField": "saddress1", "width": "255px","isClearField":true },
            { "idsName": "IDS_ADDRESS", "dataField": "saddress2", "width": "255px","isClearField":true },
            { "idsName": "IDS_ADDRESS", "dataField": "saddress3", "width": "255px","isClearField":true },
            { "idsName": "IDS_EMAIL", "dataField": "semail", "width": "150px","isClearField":true },
            { "idsName": "IDS_MOBILENO", "dataField": "smobileno", "width": "150px","isClearField":true },
            { "idsName": "IDS_FAXNO", "dataField": "sfaxno", "width": "150px","isClearField":true }
           ];
        inputData["courier"]["ncountrycode"] = this.state.selectedRecord["ncountrycode"] ? this.state.selectedRecord["ncountrycode"].value : -1;
       // inputData["courier"]["saddress"] = this.state.selectedRecord["ninterfacetype"] ? this.state.selectedRecord["ninterfacetype"].value : -1;
        inputData["courier"]["nstatus"] = this.state.selectedRecord["nstatus"] ;
        const inputParam = {
            classUrl: this.props.Login.inputParam.classUrl,
            methodUrl: this.props.Login.inputParam.methodUrl,
            displayName:"IDS_COURIER",
            inputData: inputData,
            operation: this.props.Login.operation,
            saveType, formRef, postParam, searchRef: this.searchRef,
            selectedRecord:{...this.state.selectedRecord}
        }
        const masterData = this.props.Login.masterData;
        const esignNeeded  = showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolcode)
        if (esignNeeded) {
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
    }else{
        toast.warn(this.props.intl.formatMessage({id:"IDS_ENTERVALIDEMAIL"}));
    }
        // this.props.crudMaster(inputParam, this.props.Login.masterData,"openModal");
    }
    componentWillUnmount(){
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                 masterData :[], inputParam:undefined, operation:null,modalName:undefined
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
export default connect(mapStateToProps, { callService, crudMaster, fetchCourierById, validateEsignCredential, openCourierModal, updateStore })(injectIntl(Courier));