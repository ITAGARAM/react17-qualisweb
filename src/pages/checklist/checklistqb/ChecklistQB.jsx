import React from 'react'
import {ListWrapper} from  '../../../components/client-group.styles'
import {Row, Col} from 'react-bootstrap';
import { toast } from 'react-toastify';
import { process } from '@progress/kendo-data-query';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { callService, crudMaster ,showChecklistQBAddScreen,fetchChecklistQBById,updateStore,validateEsignCredential} from '../../../actions';
import {DEFAULT_RETURN} from '../../../actions/LoginTypes';
import DataGrid from '../../../components/data-grid/data-grid.component';
import FormTextarea from '../../../components/form-textarea/form-textarea.component';
import CustomSwitch from '../../../components/custom-switch/custom-switch.component';
import FormSelectSearch from '../../../components/form-select-search/form-select-search.component';
import SlideOutModal from '../../../components/slide-out-modal/SlideOutModal';
import {showEsign,getControlMap} from '../../../components/CommonScript';
import Esign from '../../../pages/audittrail/Esign';
import { transactionStatus } from '../../../components/Enumeration';

const mapStateToProps = state => {
    return ({ Login: state.Login })
}

class ChecklistQB extends React.Component
{
    constructor(props){
        super(props)
        this.formRef = React.createRef();
        this.extractedColumnList = [];
        this.handleClose = this.handleClose.bind(this);
        const dataState = {
            skip: 0,
            take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5,
        };
        this.state = {
            data:[], masterStatus:"", error:"", selectedRecord:{},userRoleControlRights:[],controlMap:new Map(),
            dataResult: [],
            dataState: dataState,
            action:"",
            mandatoryFields:[
                {"idsName":"IDS_QBCATEGORYNAME","dataField":"valueQBCategory", "mandatoryLabel":"IDS_ENTER", "controlType": "textbox"},
                {"idsName":"IDS_QUESTION","dataField":"squestion", "mandatoryLabel":"IDS_ENTER", "controlType": "textbox"},
                {"idsName":this.props.intl.formatMessage({ id:"IDS_CHECKLIST"}).concat(" " +(this.props.Login.genericLabel ? this.props.Login.genericLabel["Component"]["jsondata"]["sdisplayname"][this.props.Login.userInfo.slanguagetypecode] : "Component")),"dataField":"valueChecklistComponent" , "mandatoryLabel":"IDS_ENTER", "controlType": "textbox"},
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
    handleClose (){
        
        let loadEsign = this.props.Login.loadEsign;
        let openModal = this.props.Login.openModal;
        let selectedRecord = this.props.Login.selectedRecord;
        let selectedId = this.props.Login.selectedId;
        if (this.props.Login.loadEsign){          
            if (this.props.Login.operation === "delete"){
                loadEsign = false;
                openModal =  false;
                selectedRecord = {};
            }
            else{
                loadEsign = false;
                selectedRecord['esignpassword'] = ""
                selectedRecord['esigncomments'] = ""
                selectedRecord['esignreason']=""
            }
        }
        else{
            openModal =  false;
            selectedRecord ={};
            selectedId=null;
        }

        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {openModal, loadEsign, selectedRecord,selectedId}
        }
        this.props.updateStore(updateInfo);
    };

    //to open side out
   
    //to perform save action for both add and edit
    onSaveClick = (saveType, formRef) => {
        let inputData = [];
        let selectedId=null;
        inputData["userinfo"] = this.props.Login.userInfo;
        let dataState=undefined;
        if ( this.props.Login.operation === "update"){
            // edit
            selectedId=this.state.selectedRecord.nchecklistqbcode
            dataState=this.state.dataState
            inputData["checklistqb"] = {
                "nchecklistqbcode":this.state.selectedRecord.nchecklistqbcode?this.state.selectedRecord.nchecklistqbcode:-1,
                "nchecklistqbcategorycode":this.state.selectedRecord.nchecklistqbcategorycode,
                "squestion":this.state.selectedRecord.squestion,
                "nmandatory":this.state.selectedRecord.nmandatory,
                //"ndefaultstatus":this.state.selectedRecord.ndefaultstatus,
                "nchecklistcomponentcode":this.state.selectedRecord.nchecklistcomponentcode?this.state.selectedRecord.nchecklistcomponentcode:-1,
                "squestiondata":parseInt(this.state.selectedRecord.nchecklistcomponentcode)===1||
                                parseInt(this.state.selectedRecord.nchecklistcomponentcode)===4||
                                parseInt(this.state.selectedRecord.nchecklistcomponentcode)===8?
                                this.state.selectedRecord.squestiondata
                                :"",
                "nsitecode":this.props.Login.userInfo.nmastersitecode
            }   
        }
        else{
            //add               
            inputData["checklistqb"] =
                {
                "nchecklistqbcategorycode":this.state.selectedRecord.nchecklistqbcategorycode?this.state.selectedRecord.nchecklistqbcategorycode:-1,
                "squestion":this.state.selectedRecord.squestion,
                "nmandatory":this.state.selectedRecord.nmandatory,
                //"ndefaultstatus":this.state.selectedRecord.ndefaultstatus,
                "nchecklistcomponentcode":this.state.selectedRecord.nchecklistcomponentcode?this.state.selectedRecord.nchecklistcomponentcode:-1,
                "squestiondata":parseInt(this.state.selectedRecord.nchecklistcomponentcode)===1||
                                parseInt(this.state.selectedRecord.nchecklistcomponentcode)===4||
                                parseInt(this.state.selectedRecord.nchecklistcomponentcode)===8?
                                this.state.selectedRecord.squestiondata
                                :"",
                "nsitecode":this.props.Login.userInfo.nmastersitecode
            };         
        }   
       //ALPD-5255-QB Screen - Fill inputs and click save & Continue , it's take long time to save and not refresh the screen.
        let clearSelectedRecordField=[
            {"idsName":"IDS_MANDATORY","dataField":"smandatory","width":"150px","isClearField":true,"preSetValue":4},
            
            {"idsName":"IDS_QUESTION","dataField":"squestion","width":"250px","isClearField":true},
            
            {"idsName":"IDS_QUESTIONDATA","dataField":"squestiondata","width":"200px","isClearField":true},
            
            
            
        ];

           
        const inputParam = {
            methodUrl: this.props.Login.inputParam.methodUrl,
            classUrl:this.props.Login.inputParam.classUrl,
            displayName:this.props.Login.inputParam.displayName?this.props.Login.inputParam.displayName:'',
            inputData: inputData,
            operation: this.props.Login.operation,
            saveType, formRef,dataState,selectedId,
            selectedRecord: {...this.state.selectedRecord}   
        }
        const masterData = this.props.Login.masterData;
        
        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolcode)){
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign:true, screenData:{inputParam, masterData}, saveType
                }
            }
            this.props.updateStore(updateInfo);
        }
        else{
            //ALPD-5255-QB Screen - Fill inputs and click save & Continue , it's take long time to save and not refresh the screen.
            this.props.crudMaster(inputParam, masterData, "openModal","","",clearSelectedRecordField);
       }
              
    }
    //to get the edit record
    
    //to delete a recoed
    deleteRecord = (deleteParam) =>{
        const inputParam = {
            methodUrl: this.props.Login.inputParam.methodUrl,
            classUrl: this.props.Login.inputParam.classUrl,
            dataState:this.state.dataState,
            displayName:this.props.Login.inputParam.displayName?this.props.Login.inputParam.displayName:'',
            selectedRecord: {...this.state.selectedRecord},
            inputData: {"checklistqb" :deleteParam.selectedRecord,
                        "userinfo": this.props.Login.userInfo},
                        operation :deleteParam.operation     
                    }       
                            
            const masterData = this.props.Login.masterData;

            if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode,deleteParam.ncontrolCode)){
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        loadEsign:true, screenData:{inputParam, masterData},operation:deleteParam.operation,openModal:true,
                        screenName:this.props.Login.inputParam.displayName,optionsQBCategory:this.props.Login.optionsQBCategory,
                        optionsChecklistComponent:this.props.Login.optionsChecklistComponent
                    }
                }
                this.props.updateStore(updateInfo);
            }
            else{
                this.props.crudMaster(inputParam, masterData, "openModal");
            }
    }

    //to reload data
    reloadData = () =>{
        const inputParam = {
            inputData : {userinfo: this.props.Login.userInfo},
            methodUrl: this.props.Login.inputParam.methodUrl,
            classUrl: this.props.Login.inputParam.classUrl,
            displayName:this.props.Login.inputParam.displayName?this.props.Login.inputParam.displayName:'',
            userInfo: this.props.Login.userInfo
            };
                            
        this.props.callService(inputParam);
    }

    validateEsign = () =>{
        const inputParam = {
                                inputData: {"userinfo": {...this.props.Login.userInfo, 
                                                        sreason: this.state.selectedRecord["esigncomments"],
                                                        nreasoncode:this.state.selectedRecord["esignreason"] && this.state.selectedRecord["esignreason"].value,
                                                        spredefinedreason:this.state.selectedRecord["esignreason"] && this.state.selectedRecord["esignreason"].label,
                                                    },
                                             password : this.state.selectedRecord["esignpassword"]
                                            },
                                screenData : this.props.Login.screenData
                            }        
        this.props.validateEsignCredential(inputParam, "openModal");
    }
    static getDerivedStateFromProps(props, state){
    
        if (props.Login.masterStatus !== state.masterStatus) {
            toast.warn(props.Login.masterStatus);
            props.Login.masterStatus = "";           
        } 
         
        if (props.Login.error !== state.error){
            toast.error(props.Login.error)
            props.Login.error = "";
        }   
        return null;
     }
     
     render(){
        let primaryKeyField = "";
        if (this.props.Login.inputParam !== undefined){
            //this.extractedColumnList =["schecklistqbcategoryname","squestion","scomponentname","smandatory","squestiondata"]
            this.extractedColumnList=[
                    {"idsName":"IDS_QBCATEGORYNAME","dataField":"schecklistqbcategoryname","width":"150px"},
                    {"idsName":"IDS_QUESTION","dataField":"squestion","width":"250px"},
                    {"idsName":this.props.intl.formatMessage({ id:"IDS_CHECKLIST"}).concat(" " +(this.props.Login.genericLabel ? this.props.Login.genericLabel["Component"]["jsondata"]["sdisplayname"][this.props.Login.userInfo.slanguagetypecode] : "Component")),"dataField":"scomponentname","width":"250px"},
                    {"idsName":"IDS_MANDATORY","dataField":"smandatory","width":"150px"},
                   // {"idsName":"IDS_DEFAULTSTATUS","dataField":"sdisplaystatus","width":"150px"},
                    {"idsName":"IDS_QUESTIONDATA","dataField":"squestiondata","width":"200px"},
                    
                ]
            primaryKeyField = "nchecklistqbcode";
        }
        
        
        const addID = this.props.Login.inputParam && this.state.controlMap.has("AddChecklistQB")
                        && this.state.controlMap.get('AddChecklistQB').ncontrolcode;
        const editId = this.props.Login.inputParam && this.state.controlMap.has("EditChecklistQB")
                        && this.state.controlMap.get('EditChecklistQB').ncontrolcode;
        const editParam = {screenName:"ChecklistQB", operation:"update",  primaryKeyField:primaryKeyField, 
                        masterData:this.props.Login.masterData,   userInfo:this.props.Login.userInfo, ncontrolCode:editId};

        const deleteParam ={screenName:"ChecklistQB", methodUrl:"ChecklistQB", operation:"delete",key:'checklistqb'};
        
        return(
            <>
            <Row>
                <Col>
                    <ListWrapper className="client-list-content">
                        {this.state.data ?
                            <DataGrid
                                primaryKeyField = {primaryKeyField}
                                data={this.state.data}
                                dataResult = {this.state.dataResult}
                                dataState = {this.state.dataState}
                                dataStateChange = {this.dataStateChange}
                                extractedColumnList = {this.extractedColumnList}
                                fetchRecord = {this.props.fetchChecklistQBById}
                                deleteRecord = {this.deleteRecord}
                                reloadData = {this.reloadData}
                                controlMap = {this.state.controlMap}
                                userRoleControlRights={this.state.userRoleControlRights}
                                inputParam={this.props.Login.inputParam}
                                userInfo={this.props.Login.userInfo} 
                                editParam={editParam}
                                deleteParam={deleteParam}
                                pageable={true}
                                isActionRequired={true}
                                isToolBarRequired={true}
                                gridHeight = {'600px'}
                                scrollable={"scrollable"}
                               
                                selectedId={this.props.Login.selectedId}
                                addRecord={()=>this.props.showChecklistQBAddScreen(this.props.Login.userInfo,addID)}
                            />
                        :""}    
                    
                    </ListWrapper>
                </Col>
            </Row>
            {this.props.Login.openModal?
            <SlideOutModal
                onSaveClick={this.onSaveClick}
                operation={this.props.Login.operation}
                screenName={this.props.Login.inputParam.displayName}
                closeModal={this.handleClose}
                show={this.props.Login.openModal}
                showSaveContinue={true}
                inputParam={this.props.Login.inputParam}
                esign={this.props.Login.loadEsign}
                validateEsign={this.validateEsign}
                selectedRecord={this.state.selectedRecord}
                mandatoryFields={this.state.mandatoryFields}
                addComponent={this.props.Login.loadEsign ? 
                    <Esign  operation={this.props.Login.operation?this.props.Login.operation:''}
                            onInputOnChange={this.onInputOnChange}
                            inputParam={this.props.Login.inputParam}                                               
                            selectedRecord={this.state.selectedRecord ||{}}
                            />
                  :
                    <Row> 
                        <Col md={12}>
                            <FormSelectSearch
                            name={"nchecklistqbcategorycode"}
                            formLabel={this.props.intl.formatMessage({ id:"IDS_QBCATEGORYNAME"})}
                            placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                            value={this.state.selectedRecord.valueQBCategory?this.state.selectedRecord.valueQBCategory:[]}
                            options={this.props.Login.optionsQBCategory?this.props.Login.optionsQBCategory:[]}
                            optionId="nchecklistqbcategorycode"
                            optionValue="schecklistqbcategoryname"
                            isMandatory={true}
                            required={true}
                            as={"select"}
                            onChange={(event)=>this.onComboChange(event,"nchecklistqbcategorycode")}
                            />
                            <FormTextarea
                            name={"squestion"}
                            placeholder={this.props.intl.formatMessage({ id:"IDS_QUESTION"})}
                            onChange={(event)=>this.onInputOnChange(event)}
                            className=""
                            isMandatory={true}
                            rows="1"
                            label={this.props.intl.formatMessage({ id:"IDS_QUESTION"})}
                            value={this.state.selectedRecord["squestion"] ? this.state.selectedRecord["squestion"] : ""}
                            type="textarea"
                            required={true}
                           //defaultValue ={this.state.selectedRecord?this.state.selectedRecord.squestion:""}
                            maxLength={"255"}
                            />
                           
                            <FormSelectSearch
                            name={ "nchecklistcomponentcode"}
                            formLabel={this.props.intl.formatMessage({ id:"IDS_CHECKLIST"}).concat(" " +(this.props.Login.genericLabel ? this.props.Login.genericLabel["Component"]["jsondata"]["sdisplayname"][this.props.Login.userInfo.slanguagetypecode] : "Component"))}
                            placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                            as="select"
                            value={this.state.selectedRecord.valueChecklistComponent?this.state.selectedRecord.valueChecklistComponent:[]}
                            options={this.props.Login.optionsChecklistComponent?this.props.Login.optionsChecklistComponent:[]}
                            optionId="nchecklistcomponentcode"
                            optionValue="scomponentname"
                            isMandatory={true}
                            onChange={(event)=>this.onComboChange(event,"nchecklistcomponentcode")}
                            />

                            <CustomSwitch
                            label={this.props.intl.formatMessage({ id:"IDS_MANDATORY"})}
                            type="switch"
                            name={"nmandatory"}
                            onChange={(event)=>this.onInputOnChange(event)}
                            placeholder={this.props.intl.formatMessage({ id:"IDS_MANDATORY"})}
                            defaultValue ={this.state.selectedRecord ? this.state.selectedRecord["nmandatory"] === transactionStatus.YES ? true :false  : false}
                            isMandatory={false}
                            required={false}
                            checked={this.state.selectedRecord ? this.state.selectedRecord.nmandatory === transactionStatus.YES ? true :false  : false}
                            disabled={false}
                            />
                            {this.state.selectedRecord ? 
                            parseInt(this.state.selectedRecord.nchecklistcomponentcode)===1||
                            parseInt(this.state.selectedRecord.nchecklistcomponentcode)===4||
                            parseInt(this.state.selectedRecord.nchecklistcomponentcode)===8?
                        
                                <FormTextarea
                                name={"squestiondata"}
                                placeholder={this.props.intl.formatMessage({ id:"IDS_QUESTIONDATA"})}//"IDS_QUESTIONDATA"
                                onChange={(event)=>this.onInputOnChange(event)}
                                className=""
                                rows="1"
                                label={this.props.intl.formatMessage({ id:"IDS_QUESTIONDATA"})}
                                type="textarea"
                                defaultValue ={this.state.selectedRecord ? this.state.selectedRecord["squestiondata"] : ""}
                                maxLength={"255"}
                                isMandatory={true}
                                required={true}
                                />
                            :"":""}
                            {/* <CustomSwitch
                            label={this.props.intl.formatMessage({ id:"IDS_DEFAULTSTATUS"})}
                            type="switch"
                            name={"ndefaultstatus"}
                            onChange={(event)=>this.onInputOnChange(event)}
                            placeholder={this.props.intl.formatMessage({ id:"IDS_DEFAULTSTATUS"})}
                            defaultValue ={this.state.selectedRecord ? this.state.selectedRecord["ndefaultstatus"] === transactionStatus.YES ? true :false  : false}
                            isMandatory={false}
                            required={false}
                            checked={this.state.selectedRecord ? this.state.selectedRecord.ndefaultstatus === transactionStatus.YES ? true :false  : false}
                            disabled={false}
                            /> */}
                        </Col>
                    </Row>
                }/>
                :""}
            </>
            
          );
     }
     
     componentDidUpdate(previousProps){
        if (this.props.Login.masterData !== previousProps.Login.masterData){            
            if (this.props.Login.userInfo.nformcode !== previousProps.Login.userInfo.nformcode){
                const userRoleControlRights = [];
                if (this.props.Login.userRoleControlRights){
                    this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode] && Object.values(this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode]).map(item=>
                        userRoleControlRights.push(item.ncontrolcode))
                }
                const controlMap = getControlMap(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode)
                this.setState({userRoleControlRights, controlMap, data:this.props.Login.masterData, 
                    dataResult: process(this.props.Login.masterData, this.state.dataState)});
            }
            else{
                // if (this.props.Login.operation === "create" && this.props.Login.inputParam.saveType === 2){
                //     this.props.Login.inputParam.formRef.current.reset();
                // } 
                let {dataState}=this.state;
                if(this.props.Login.dataState===undefined){
                    dataState={skip:0,take:this.state.dataState.take}
                } 

                if(this.state.dataResult.data){
                    if(this.state.dataResult.data.length ===1){
                       let skipcount=this.state.dataState.skip>0?(this.state.dataState.skip-this.state.dataState.take):
                       this.state.dataState.skip
                        dataState={skip:skipcount,take:this.state.dataState.take}
                    }
                }

                this.setState({data:this.props.Login.masterData, 
                    dataResult: process(this.props.Login.masterData,dataState),
                    dataState,
                    selectedRecord:{squestion:'',squestiondata:'',nmandatory:transactionStatus.NO}
                });
            }
         }
         else if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord ){    
            let mandatoryFields=this.props.Login.mandatoryFields?(this.props.Login.mandatoryFields):[
                {"idsName":"IDS_QBCATEGORYNAME","dataField":"valueQBCategory", "mandatoryLabel":"IDS_ENTER", "controlType": "textbox"},
                {"idsName":"IDS_QUESTION","dataField":"squestion", "mandatoryLabel":"IDS_ENTER", "controlType": "textbox"},
                {"idsName":this.props.intl.formatMessage({ id:"IDS_CHECKLIST"}).concat(" " +(this.props.Login.genericLabel ? this.props.Login.genericLabel["Component"]["jsondata"]["sdisplayname"][this.props.Login.userInfo.slanguagetypecode] : "Component")),"dataField":"valueChecklistComponent", "mandatoryLabel":"IDS_ENTER", "controlType": "textbox"},
            ]
            this.setState({selectedRecord:this.props.Login.selectedRecord,mandatoryFields});
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
    onInputOnChange=(event)=>  {
        
        const selectedRecord = this.state.selectedRecord || {};
        if (event.target.type === 'checkbox')
        {
            selectedRecord[event.target.name] = event.target.checked === true ? transactionStatus.YES : transactionStatus.NO;
        }
        else{
            selectedRecord[event.target.name] = event.target.value;
        }
        this.setState({selectedRecord});
        
    }
    onComboChange=(comboData,fieldName)=>  {
        const {selectedRecord,mandatoryFields} = this.state || {};
        if(comboData){     
            
            fieldName==='nchecklistqbcategorycode'?selectedRecord['valueQBCategory']=comboData:selectedRecord['valueChecklistComponent']=comboData
            selectedRecord[fieldName] = comboData.value;
        }else{
            fieldName==='nchecklistqbcategorycode'?selectedRecord['valueQBCategory']=comboData:selectedRecord['valueChecklistComponent']=comboData
            selectedRecord[fieldName] = "";
        }
        if(fieldName==='nchecklistcomponentcode'){
           if(comboData.value===1||comboData.value===4||comboData.value===8){
                let index=-1;
                mandatoryFields.map((x,i)=>{if(x.idsName==="IDS_QUESTIONDATA"){ index=i} return null})
                if(index===-1)
                    mandatoryFields.push({"idsName":"IDS_QUESTIONDATA","dataField":"squestiondata", "mandatoryLabel":"IDS_ENTER", "controlType": "textbox"})
                
           }else{
                
                mandatoryFields.map((x,index)=>{if(x.idsName==="IDS_QUESTIONDATA"){ mandatoryFields.splice(index,1);} return null})
               
           }
        }

        this.setState({selectedRecord});
        
    }
}
export default connect(mapStateToProps, {callService, crudMaster,showChecklistQBAddScreen,fetchChecklistQBById,
    updateStore,validateEsignCredential})(injectIntl(ChecklistQB));