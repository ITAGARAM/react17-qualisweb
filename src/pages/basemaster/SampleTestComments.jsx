import React from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { process } from '@progress/kendo-data-query';
import DataGrid from '../../components/data-grid/data-grid.component';
//import AddSampleTestComments from './AddSampleTestComments';
import Esign from '../audittrail/Esign';
import SlideOutModal from '../../components/slide-out-modal/SlideOutModal';
import { ListWrapper } from '../../components/client-group.styles';
import { callService, crudMaster, fetchSampleTestCommentsById, validateEsignCredential, openSampleTestCommentsModal, updateStore } from '../../actions';
import { transactionStatus } from '../../components/Enumeration';
import { constructOptionList, getControlMap, showEsign,validateEmail,validatePhoneNumber } from '../../components/CommonScript';
import { DEFAULT_RETURN } from '../../actions/LoginTypes';
import AddSampleTestComments from './AddSampleTestComments';

const mapStateToProps = state => {
    return ({ Login: state.Login })
}

class SampleTestComments extends React.Component {
    constructor(props) {
        super(props);
        this.formRef = React.createRef();
        this.closeModal = this.closeModal.bind(this);
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
            controlMap: new Map(),
            CommentType:[],
            CommentSubType:[]
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
        // console.log("selectedId :",selectedId);
        if (this.props.Login.loadEsign) {
            if (this.props.Login.operation === "delete") {
                selectedRecord['agree'] = 4;
                loadEsign = false;
                openModal = false;
                selectedRecord = {};
            } else {
                loadEsign = false;
                delete selectedRecord['esignpassword'] 
                delete selectedRecord['esigncomments'] 
                delete selectedRecord['esignreason']
            }
        } else {
            openModal = false;
            selectedRecord = {};
            selectedId=null;
        }
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { openModal, loadEsign, selectedRecord,selectedId
                //selectedId:null 
            }
        }
        this.props.updateStore(updateInfo);
    }

    render() {

        let primaryKeyField = "";
        if (this.props.Login.inputParam !== undefined) {

            this.extractedColumnList = [
                { "controlType": "textbox", "idsName": "IDS_COMMENTNAME", "dataField": "scommentsubtype", "width": "150px" },
                { "controlType": "textbox", "idsName": "IDS_ABBREVIATIONNAME", "dataField": "spredefinedname", "width": "150px" },
                { "controlType": "textbox", "idsName": "IDS_DESCRIPTION", "dataField": "sdescription", "width": "150px" },

            ]
                     
            primaryKeyField = "nsampletestcommentscode";
            this.fieldList = [
                "ncommentsubtypecode","spredefinedname","sdescription"
        ];
        }


        const mandatoryFields=[ 
                            { "controlType": "selectbox","mandatory": true, "idsName": "IDS_COMMENTNAME", "dataField": "ncommentsubtypecode", "mandatoryLabel":"IDS_SELECT"},
                            { "controlType": "textbox","mandatory": true, "idsName": "IDS_ABBREVIATIONNAME", "dataField": "spredefinedname", "mandatoryLabel":"IDS_ENTER"},
                            { "controlType": "textbox","mandatory": true, "idsName": "IDS_DESCRIPTION", "dataField": "sdescription", "mandatoryLabel":"IDS_ENTER" } ];

        const removeAbbreviationMandatoryFields=[ 
                            { "controlType": "selectbox","mandatory": true, "idsName": "IDS_COMMENTNAME", "dataField": "ncommentsubtypecode", "mandatoryLabel":"IDS_SELECT"},
                            { "controlType": "textbox","mandatory": true, "idsName": "IDS_DESCRIPTION", "dataField": "sdescription", "mandatoryLabel":"IDS_ENTER" } ];
       
        const addId = this.state.controlMap.has("AddSampleTestComments") && this.state.controlMap.get("AddSampleTestComments").ncontrolcode;
        const editId = this.state.controlMap.has("EditSampleTestComments") && this.state.controlMap.get("EditSampleTestComments").ncontrolcode;
        const deleteId = this.state.controlMap.has("DeleteSampleTestComments") && this.state.controlMap.get("DeleteSampleTestComments").ncontrolcode;

        // const editParam = {
        //     screenName: this.props.Login.inputParam && this.props.Login.inputParam.displayName && this.props.intl.formatMessage({ id: this.props.Login.inputParam.displayName }), primaryKeyField: "nsampletestcommentscode", operation: "update",
        //     inputParam: this.props.Login.inputParam, userInfo: this.props.Login.userInfo, ncontrolCode: editId
        // };
        const addParam = {
            screenName: "IDS_SAMPLETESTCOMMENTS", operation: "create", primaryKeyName: "nsampletestcommentscode",
            masterData: this.props.Login.masterData, userInfo: this.props.Login.userInfo,
            ncontrolcode: addId
            
        }

        const editParam = {
            screenName: "IDS_SAMPLETESTCOMMENTS", operation: "update", primaryKeyName: "nsampletestcommentscode",
            masterData: this.props.Login.masterData, userInfo: this.props.Login.userInfo,
            ncontrolcode: editId, inputListName: "SampleTestComments", selectedObject: "selectedRecord"
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
                                    formatMessage={this.props.intl.formatMessage}
                                    controlMap={this.state.controlMap}
                                    userRoleControlRights={this.state.userRoleControlRights}
                                    inputParam={this.props.Login.inputParam}
                                    userInfo={this.props.Login.userInfo}
                                    fetchRecord={this.props.fetchSampleTestCommentsById}
                                    deleteRecord={this.deleteRecord}
                                    reloadData={this.reloadData}
                                    editParam={editParam}
                                    deleteParam={deleteParam}
                                    addRecord = {() => this.props.openSampleTestCommentsModal("IDS_SAMPLETESTCOMMENTS", "create", "nsampletestcommentscode", this.props.Login.masterData, this.props.Login.userInfo, addId)}
                                    gridHeight = {"600px"}
                                    pageable={true}
                                    isAddRequired={true}
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
                        showSaveContinue={true}
                        closeModal={this.closeModal}
                        operation={this.props.Login.operation}
                        inputParam={this.props.Login.inputParam}
                        screenName={this.props.Login.screenName}
                        onSaveClick={this.onSaveClick}
                        esign={this.props.Login.loadEsign}
                        selectedRecord={this.state.selectedRecord || {}}
                        mandatoryFields={this.props.Login.isCommentSubType === 3 ? mandatoryFields : removeAbbreviationMandatoryFields}
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
                            : <AddSampleTestComments
                                selectedRecord={this.state.selectedRecord || {}}
                                onInputOnChange={this.onInputOnChange}
                                onComboChange={this.onComboChange}
                                CommentType={this.state.CommentType || []}
                                CommentSubType={this.state.CommentSubType || []}
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
                    selectedRecord:{}
                });
            }
        } else if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord 
            // ALPD-5385 - In Sample Test Comments Screen - Save & Continue hides 'Abbreviation' field
            || Object.keys(this.props.Login.selectedRecord) > Object.keys(this.state.selectedRecord)) {
            this.setState({ selectedRecord: this.props.Login.selectedRecord });
        }
        if(this.props.Login.CommentType!==previousProps.Login.CommentType){
            const CommentType=constructOptionList(this.props.Login.CommentType ||[], "ncommenttypecode",
            "scommenttype" , undefined, undefined, undefined);
            const CommentTypeList=CommentType.get("OptionList")
            this.setState({CommentType:CommentTypeList})
        }
        if(this.props.Login.CommentSubType!==previousProps.Login.CommentSubType){
            const CommentSubType=constructOptionList(this.props.Login.CommentSubType ||[], "ncommentsubtypecode",
            "scommentsubtype" , undefined, undefined, undefined);
            const CommentSubTypeList=CommentSubType.get("OptionList")
            this.setState({CommentSubType:CommentSubTypeList})
        }
        if(this.props.Login.isCommentSubType !== previousProps.Login.isCommentSubType){
            this.setState({selectedRecord:this.props.Login.selectedRecord , spredefinedenable:this.props.Login.spredefinedenable})
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
                if (event.target.value !== ""){
                    event.target.value = validatePhoneNumber(event.target.value);
                    selectedRecord[event.target.name] = event.target.value !== "" ? event.target.value:selectedRecord[event.target.name];
                }
                else{     
                    selectedRecord[event.target.name] = event.target.value;               
                }
            }  
            else{     
                selectedRecord[event.target.name] = event.target.value;               
            }         
        }     
        this.setState({selectedRecord});
        
    }

    onComboChange = (comboData, fieldName) => {
        if (comboData !== null) {
            const selectedRecord = this.state.selectedRecord || {};
            let spredefinedenable="false";
            let isCommentSubType = comboData.value;
            
            if(fieldName === "ncommentsubtypecode")
            {
               spredefinedenable=comboData.item.spredefinedenable;
               selectedRecord["spredefinedenable"]=spredefinedenable;
               selectedRecord[fieldName] = comboData;
               selectedRecord["sdescription"] = "";
               selectedRecord["spredefinedname"] = "";
            }
            else
            {
              selectedRecord[fieldName] = comboData;
            }
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: { selectedRecord, spredefinedenable, isCommentSubType}
            }
            this.props.updateStore(updateInfo);
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

        if (this.state.selectedRecord["ncommentsubtypecode"].value === 3) {
            if (this.state.selectedRecord["spredefinedname"] === undefined || 
                 this.state.selectedRecord["spredefinedname"] === "") {
                toast.info("Enter PreDefined Name");
                return;
            }
        }

        if (this.props.Login.operation === "update") {
            // edit
            postParam = { inputListName: "sampletestcomments", selectedObject: "selectedSampleTestComments", primaryKeyField: "nsampletestcommentscode" }
            inputData["sampletestcomments"] = JSON.parse(JSON.stringify(this.state.selectedRecord));
            this.fieldList.map(item => {
                return inputData["sampletestcomments"][item] = this.state.selectedRecord[item] ? this.state.selectedRecord[item] : "";
            })
            inputData["sampletestcomments"]["nsampletestcommentscode"] = this.state.selectedRecord.nsampletestcommentscode;
            if(this.state.selectedRecord["ncommentsubtypecode"] && this.state.selectedRecord["ncommentsubtypecode"].value !== 3)
            {
                inputData["sampletestcomments"]["spredefinedname"]="";
            }
            selectedId =  this.props.Login.selectedId;
        } else {
            inputData["sampletestcomments"] = { "nsitecode": this.props.Login.userInfo.nmastersitecode };
            this.fieldList.map(item => {
                return inputData["sampletestcomments"][item] = this.state.selectedRecord[item] ? this.state.selectedRecord[item] : "";
            });
            if(this.state.selectedRecord["ncommentsubtypecode"] && this.state.selectedRecord["ncommentsubtypecode"].value !== 3)
            {
                inputData["sampletestcomments"]["spredefinedname"]="";

            }
        }
        inputData["sampletestcomments"]["ncommenttypecode"] = this.state.selectedRecord["ncommenttypecode"] ? this.state.selectedRecord["ncommenttypecode"].value : 1;
        inputData["sampletestcomments"]["ncommentsubtypecode"] = this.state.selectedRecord["ncommentsubtypecode"] ? this.state.selectedRecord["ncommentsubtypecode"].value : -1;
        let clearSelectedRecordField = [
           // { "controlType": "textbox", "idsName": "IDS_COMMENTNAME", "dataField": "scommentsubtype", "width": "150px" },
            { "controlType": "textbox", "idsName": "IDS_ABBREVIATIONNAME", "dataField": "spredefinedname", "width": "150px","isClearField":true },
            { "controlType": "textbox", "idsName": "IDS_DESCRIPTION", "dataField": "sdescription", "width": "150px","isClearField":true },

        ]
        if(inputData["sampletestcomments"]){
            delete  inputData["sampletestcomments"]['esignpassword'] 
            delete  inputData["sampletestcomments"]['esigncomments']   
            delete  inputData["sampletestcomments"]['esignreason']  
            delete  inputData["sampletestcomments"]['agree']  
       }
        const inputParam = {
            classUrl: this.props.Login.inputParam.classUrl,
            methodUrl: this.props.Login.inputParam.methodUrl,
            displayName:"IDS_SAMPLETESTCOMMENTS",
            inputData: inputData, selectedId,
            operation: this.props.Login.operation,
            saveType, formRef, postParam, searchRef: this.searchRef,
            selectedRecord: {...this.state.selectedRecord}
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
    
    }
    deleteRecord = (inputData) => {
        const inputParam = {
            classUrl: this.props.Login.inputParam.classUrl,
            methodUrl: this.props.Login.inputParam.methodUrl,
            selectedRecord: {...this.state.selectedRecord},
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
                    operation: this.props.Login.operation
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.crudMaster(inputParam, this.props.Login.masterData, "openModal");
        }
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
export default connect(mapStateToProps, { callService, crudMaster,  validateEsignCredential, openSampleTestCommentsModal,fetchSampleTestCommentsById, updateStore })(injectIntl(SampleTestComments));
