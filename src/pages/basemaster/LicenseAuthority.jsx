import React from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import DataGrid from '../../components/data-grid/data-grid.component';
import { callService, crudMaster ,validateEsignCredential,updateStore,openLicenseAuthorityModal,fetchLicenseAuthorityById} from '../../actions';
import {Row, Col} from 'react-bootstrap';
import { toast } from 'react-toastify';
import { process } from '@progress/kendo-data-query';
import {ListWrapper } from '../../components/client-group.styles'
import FormInput from '../../components/form-input/form-input.component';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import SlideOutModal from '../../components/slide-out-modal/SlideOutModal';
import Esign from '../audittrail/Esign';
import {showEsign,getControlMap} from '../../components/CommonScript'
import {DEFAULT_RETURN} from '../../actions/LoginTypes'
import { transactionStatus } from '../../components/Enumeration';

const mapStateToProps = state => {
    return ({ Login: state.Login })
}
class LicenseAuthority extends React.Component{
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
            selectedRecord:{},userRoleControlRights:[],controlMap:new Map()
        };
    }
    dataStateChange = (event) => {
        this.setState({
            dataResult: process(this.state.data, event.dataState),
            dataState: event.dataState
        });
    }
    
    closeModal = () =>{
        let loadEsign = this.props.Login.loadEsign;
        let openModal = this.props.Login.openModal;
        let selectedRecord = this.props.Login.selectedRecord;
        if (this.props.Login.loadEsign){          
            if (this.props.Login.operation === "delete"){
                loadEsign = false;
                openModal =  false;
                selectedRecord ={};
            }
            else{
                loadEsign = false;
            }
        }
        else{
            openModal =  false;
            selectedRecord ={};
        }

        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {openModal, loadEsign, selectedRecord, selectedId:null}
        }
        this.props.updateStore(updateInfo);
    }
    static getDerivedStateFromProps(props, state){
    
        if (props.Login.masterStatus !== ""  && props.Login.masterStatus !== state.masterStatus) {
            toast.warn(props.Login.masterStatus);
            props.Login.masterStatus = "";           
        } 
         
        if (props.Login.error !== state.error){
            toast.error(props.Login.error)
            props.Login.error = "";
        }   
        if (props.Login.selectedRecord === undefined){
            return {selectedRecord:{}}
        }
        return null;
     }  
     reloadData = () =>{
        const inputParam = {
            inputData : { userinfo: this.props.Login.userInfo},
            methodUrl: this.props.Login.inputParam.methodUrl,
            classUrl: this.props.Login.inputParam.classUrl,
            displayName:this.props.Login.inputParam.displayName,
            userInfo: this.props.Login.userInfo
            };
                            
        this.props.callService(inputParam);
    }
    onSaveClick = (saveType,formRef) => {
        
        //add 

        let inputData = [];
        let selectedId=null;
        inputData["userinfo"] = this.props.Login.userInfo;
        let dataState=undefined;
        if (this.props.Login.operation === "update") {
            // edit
            selectedId=this.state.selectedRecord.nauthoritycode
            dataState=this.state.dataState;
            inputData[this.props.Login.inputParam.methodUrl.toLowerCase()] = {
                nauthoritycode:this.state.selectedRecord.nauthoritycode,
                sauthorityname: this.state.selectedRecord.sauthorityname,
                sauthorityshortname:this.state.selectedRecord.sauthorityshortname,
                ncountrycode:this.state.selectedRecord.ncountrycode,
                nsitecode:this.props.Login.userInfo.nmastersitecode,
                nstatus:1

            }
            
        }
        else {
            //add               
            inputData[this.props.Login.inputParam.methodUrl.toLowerCase()] = {
                sauthorityname: this.state.selectedRecord.sauthorityname,
                sauthorityshortname:this.state.selectedRecord.sauthorityshortname,
                ncountrycode:this.state.selectedRecord.ncountrycode,
                nsitecode:this.props.Login.userInfo.nmastersitecode,
                nstatus:1

            }
        }

        const inputParam = {
            classUrl: this.props.Login.inputParam.classUrl,
            methodUrl: this.props.Login.inputParam.methodUrl,
            displayName:this.props.Login.inputParam.displayName,
            inputData: inputData,
            operation: this.props.Login.operation,
            dataState,saveType,formRef,selectedId
        }

        const masterData = this.props.Login.masterData;
        
        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolcode)){
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign:true, screenData:{inputParam, masterData}, saveType,
                    operation:this.props.Login.operation,openModal:true,
                    screenName:this.props.Login.inputParam.displayName
                }
            }
            this.props.updateStore(updateInfo);
        }
        else{
            this.props.crudMaster(inputParam, masterData, "openModal");
       }
        
    }
    deleteRecord = (deleteParam) =>{
        const inputParam = {
            methodUrl: this.props.Login.inputParam.methodUrl,
            classUrl: this.props.Login.inputParam.classUrl,
            displayName:this.props.Login.inputParam.displayName,
            dataState:this.state.dataState,
            inputData: {
                "licenseauthority" :deleteParam.selectedRecord,
                "userinfo": this.props.Login.userInfo},
            operation:deleteParam.operation     
            }       
            const masterData = this.props.Login.masterData;

            if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, deleteParam.ncontrolCode)){
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        loadEsign:true, screenData:{inputParam, masterData}, 
                        operation:this.props.Login.operation,openModal:true,
                        screenName:this.props.Login.inputParam.displayName
                    }
                }
                this.props.updateStore(updateInfo);
            }
            else{
                this.props.crudMaster(inputParam, masterData, "openModal");
            }
    }
    validateEsign = () =>{
        const inputParam = {
            inputData: {"userinfo": {...this.props.Login.userInfo, 
                                    sreason: this.state.selectedRecord["esigncomments"] ,
                                    nreasoncode:this.state.selectedRecord["esignreason"] && this.state.selectedRecord["esignreason"].value,
                                    spredefinedreason:this.state.selectedRecord["esignreason"] && this.state.selectedRecord["esignreason"].label,
                               },
                            password : this.state.selectedRecord["esignpassword"]
                        },
            screenData : this.props.Login.screenData
        }        
        this.props.validateEsignCredential(inputParam, "openModal");
    }
    render(){
        let primaryKeyField = "";
        if (this.props.Login.inputParam !== undefined){
            //this.extractedColumnList =["sauthorityname","sauthorityshortname","scountryname","scountryshortname"]
            this.extractedColumnList=[
                {"idsName":"IDS_AUTHORITYNAME","dataField":"sauthorityname","width":"200px"},
                {"idsName":"IDS_AUTHORITYSHORTNAME","dataField":"sauthorityshortname","width":"200px"},
                {"idsName":"IDS_COUNTRY","dataField":"scountryname","width":"200px"},
                {"idsName":"IDS_COUNTRYSHORTNAME","dataField":"scountryshortname","width":"200px"}
            ]
            primaryKeyField = "nauthoritycode";
        }
        const addID = this.props.Login.inputParam && this.state.controlMap.has("AddLicenseAuthority")
                        && this.state.controlMap.get('AddLicenseAuthority').ncontrolcode;
        const editID = this.props.Login.inputParam && this.state.controlMap.has("EditLicenseAuthority")
                        && this.state.controlMap.get('EditLicenseAuthority').ncontrolcode;
        const editParam={
            screenName:this.props.Login.inputParam?this.props.Login.inputParam.displayName:'', 
            operation:"update", 
            primaryKeyField,
            masterData:this.props.Login.masterData,
            userInfo:this.props.Login.userInfo,
            ncontrolCode:editID,
            inputparam:this.props.Login.inputparam,
        }
        const deleteParam={
            screenName:this.props.Login.inputParam?this.props.Login.inputParam.displayName:'',
            methodUrl: this.props.Login.inputParam? this.props.Login.inputParam.methodUrl:'', 
            operation:"delete"
        }
        const mandatoryFields=[
            {"idsName":"IDS_AUTHORITYNAME","dataField":"sauthorityname" , "mandatoryLabel":"IDS_ENTER", "controlType": "textbox"},
            {"idsName":"IDS_AUTHORITYSHORTNAME","dataField":"sauthorityshortname" , "mandatoryLabel":"IDS_ENTER", "controlType": "textbox"},
            {"idsName":"IDS_COUNTRY","dataField":"countryValue" , "mandatoryLabel":"IDS_ENTER", "controlType": "textbox"}
        ]
        return(
            <>
            <Row>
                <Col>
                    <ListWrapper className="client-list-content">
                        {/*<PrimaryHeader className="d-flex justify-content-between mb-3">
                             <HeaderName className="header-primary-md">
                                {this.props.Login.inputParam ? 
                                <FormattedMessage id={this.props.Login.inputParam.displayName} /> :""}
                            </HeaderName> 
                            <Button className="btn btn-user btn-primary-blue" 
                                hidden={this.state.userRoleControlRights.indexOf(addID) === -1} 
                                onClick={()=>this.props.openLicenseAuthorityModal(this.props.Login.userInfo,addID)} role="button">
                                <FontAwesomeIcon icon={faPlus} /> { }                          
                                <FormattedMessage id="IDS_ADD" defaultMessage='Add'/> 
                                </Button>
                        </PrimaryHeader>*/}
                        {this.state.data ? 
                            <DataGrid
                                primaryKeyField = {primaryKeyField}
                                data = {this.state.data}
                                dataResult = {this.state.dataResult}
                                dataState = {this.state.dataState}
                                dataStateChange = {this.dataStateChange}
                                extractedColumnList = {this.extractedColumnList}
                                fetchRecord = {this.props.fetchLicenseAuthorityById}
                                deleteRecord = {this.deleteRecord}
                                reloadData = {this.reloadData}
                                pageable={{ buttonCount: 4, pageSizes: true }}
                                gridHeight = {'600px'}
                                // isComponent={true}
                                //pageable={false}
                                controlMap = {this.state.controlMap}
                                userRoleControlRights={this.state.userRoleControlRights}
                                inputParam={this.props.Login.inputParam}
                                userInfo={this.props.Login.userInfo}
                                isActionRequired={true}
                                isToolBarRequired={true}
                                editParam={editParam}
                                deleteParam={deleteParam}
                                scrollable={'scrollable'}
                                selectedId={this.props.Login.selectedId}
                                addRecord = {() => this.props.openLicenseAuthorityModal(this.props.Login.userInfo,addID)}
                            />
                        :""}    
                        
                    </ListWrapper>
                </Col>
            </Row>
            {this.props.Login.openModal ? 
                <SlideOutModal
                onSaveClick={this.onSaveClick}
                operation={this.props.Login.operation}
                screenName="IDS_LICENSEAUTHORITY"
                closeModal={this.closeModal}
                show={this.props.Login.openModal}
                inputParam={this.props.Login.inputParam}
                esign={this.props.Login.loadEsign}
                validateEsign={this.validateEsign}
                selectedRecord={this.state.selectedRecord || {}}
                mandatoryFields={mandatoryFields}
                addComponent={this.props.Login.loadEsign ? 
                        <Esign  operation={this.props.Login.operation}
                            onInputOnChange={(event)=>this.onInputOnChange(event)}
                            inputParam={this.props.Login.inputParam}                                               
                            selectedRecord={this.state.selectedRecord ||{}}
                            />
                        :
                        <Row>                                
                            <Col md={12}>
                                <FormInput
                                    label={this.props.intl.formatMessage({ id:"IDS_AUTHORITYNAME"})}
                                    name={"sauthorityname"}
                                    type="text"
                                    onChange={(event)=>this.onInputOnChange(event)}
                                    placeholder={this.props.intl.formatMessage({ id:"IDS_AUTHORITYNAME"})}
                                    value ={this.state.selectedRecord ? this.state.selectedRecord["sauthorityname"] : ""}
                                    isMandatory={true}
                                    required={ true}
                                    maxLength={100}
                                />
                                <FormInput
                                    label={this.props.intl.formatMessage({ id:"IDS_AUTHORITYSHORTNAME"})}
                                    name={"sauthorityshortname"}
                                    type="text"
                                    onChange={(event)=>this.onInputOnChange(event)}
                                    placeholder={this.props.intl.formatMessage({ id:"IDS_AUTHORITYSHORTNAME"})}
                                    value ={this.state.selectedRecord ? this.state.selectedRecord["sauthorityshortname"] : ""}
                                    isMandatory={true}
                                    required={ true}
                                    maxLength={10}
                                />
                                <FormSelectSearch
                                    name={"ncountrycode"}
                                    formLabel={this.props.intl.formatMessage({ id:"IDS_COUNTRY"})}
                                    placeholder={this.props.intl.formatMessage({ id:"IDS_SELECTRECORD"})}
                                    value={this.state.selectedRecord.countryValue?this.state.selectedRecord.countryValue:[]}
                                    options={this.props.Login.countryOptions?this.props.Login.countryOptions:[]}
                                    optionId="ncountrycode"
                                    optionValue="scountryname"
                                    isMandatory={true}
                                    required={true}
                                    as={"select"}
                                    onChange={(event)=>this.onComboChange(event,"ncountrycode")}
                                />
                                <FormInput
                                    label={this.props.intl.formatMessage({ id:"IDS_COUNTRYSHORTNAME"})}
                                    name={"scountryshortname"}
                                    type="text"
                                    placeholder={this.props.intl.formatMessage({ id:"IDS_COUNTRYSHORTNAME"})}
                                    value ={this.state.selectedRecord.countryShortName?this.state.selectedRecord.countryShortName:""}
                                    isMandatory={false}
                                    required={ false}
                                    isDisabled={true}
                                />
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
                    dataResult: process(this.props.Login.masterData, this.state.dataState),});
            }
            else{
                let {dataState}=this.state;
                if(this.props.Login.dataState===undefined){
                    dataState={skip:0,take:this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5}
                } 
                this.setState({data:this.props.Login.masterData, 
                    dataResult: process(this.props.Login.masterData, dataState),
                    dataState
                });
            }
         }
         if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord ){    
            this.setState({selectedRecord:this.props.Login.selectedRecord});
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
    onComboChange(comboData,fieldName)  {
        const selectedRecord = this.state.selectedRecord || {};
        if(comboData){     
            selectedRecord['countryValue']=comboData;
            selectedRecord['countryShortName']=comboData.item.scountryshortname;
            selectedRecord[fieldName] = comboData.value;
        }else{
            selectedRecord['countryValue']=[];
            selectedRecord['countryShortName']="";
            selectedRecord[fieldName] = "";
        }
        this.setState({selectedRecord});
    }
}
export default connect(mapStateToProps, { callService, crudMaster,validateEsignCredential,updateStore,openLicenseAuthorityModal,fetchLicenseAuthorityById})(injectIntl(LicenseAuthority));