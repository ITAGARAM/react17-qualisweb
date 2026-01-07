import React from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Row, Col } from 'react-bootstrap';
import { process } from '@progress/kendo-data-query';
import { toast } from 'react-toastify';

import AddCity from './AddCity';
import SlideOutModal from '../../../components/slide-out-modal/SlideOutModal';
import Esign from '../../audittrail/Esign';
import DataGrid from '../../../components/data-grid/data-grid.component';
import { callService,getCityService,updateStore,crudMaster,validateEsignCredential,viewAttachment} from '../../../actions';
import { DEFAULT_RETURN } from '../../../actions/LoginTypes';
import { getControlMap, showEsign, create_UUID, onDropAttachFileList, deleteAttachmentDropZone } from '../../../components/CommonScript';
import { transactionStatus } from '../../../components/Enumeration';
import { ListWrapper } from '../../../components/client-group.styles';

const mapStateToProps = state => {
    return ({ Login: state.Login })
}

class City extends React.Component{

    constructor(props){
        super(props)
        this.formRef=React.createRef();
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
        data: { openModal, loadEsign, selectedRecord,selectedId }
    }
    this.props.updateStore(updateInfo);
}

deleteRecord = (deleteParam) =>{
    const inputParam = {
        classUrl: this.props.Login.inputParam.classUrl,
        methodUrl: this.props.Login.inputParam.methodUrl,
        displayName: this.props.Login.inputParam.displayName,
        inputData: {
            [this.props.Login.inputParam.methodUrl.toLowerCase()]: deleteParam.selectedRecord,//.dataItem,
            "userinfo": this.props.Login.userInfo
        },
        operation:deleteParam.operation,
        dataState:this.state.dataState,
        selectedRecord: {...this.state.selectedRecord}
    }

    if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, deleteParam.ncontrolCode)) {
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                loadEsign: true, screenData: { inputParam, masterData: this.props.Login.masterData },
                openModal: true, screenName: this.props.intl.formatMessage({ id: this.props.Login.inputParam.displayName }),
                operation:deleteParam.operation
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

onSaveClick = (saveType, formRef) => {
    //add / edit  
    let inputData = [];
    let dataState =undefined;
    inputData["userinfo"] = this.props.Login.userInfo;
    let selectedId = null;
    if (this.props.Login.operation === "update") {    // edit
        dataState=this.state.dataState
        // inputData[this.props.Login.inputParam.methodUrl.toLowerCase()] = this.state.selectedRecord;
        // this.extractedColumnList.map(item => {
        //     return inputData[this.props.Login.inputParam.methodUrl.toLowerCase()][item.dataField] = this.state.selectedRecord[item.dataField] ? this.state.selectedRecord[item.dataField] : "";
        // })
        inputData["city"]={
        "ncitycode":this.state.selectedRecord.ncitycode,
       "scitycode":this.state.selectedRecord.scitycode,
        "nsitecode":this.state.selectedRecord.nsitecode,
       "scityname":this.state.selectedRecord.scityname,
      "sdistrictname":this.state.selectedRecord.sdistrictname,
        }
        selectedId = this.props.Login.selectedId; 
    }
    else {
        //add                          
        inputData[this.props.Login.inputParam.methodUrl.toLowerCase()] = { "nsitecode": this.props.Login.userInfo.nmastersitecode };

        this.extractedColumnList.map(item => {
            return inputData[this.props.Login.inputParam.methodUrl.toLowerCase()][item.dataField] = this.state.selectedRecord[item.dataField] ? this.state.selectedRecord[item.dataField]:""
        })
    }
    inputData["city"]["ndistrictcode"] = this.state.selectedRecord["ndistrictcode"] ? this.state.selectedRecord["ndistrictcode"].value
    : transactionStatus.NA;

   let clearSelectedRecordField =[
        { "idsName": "IDS_CITY", "dataField": "scityname", "width": "200px" ,"controlType": "textbox","isClearField":true},
        { "idsName": "IDS_CITYCODE", "dataField": "scitycode", "width": "200px","controlType": "textbox","isClearField":true },
        
    ]

    const inputParam = {
        classUrl: this.props.Login.inputParam.classUrl,
        methodUrl: this.props.Login.inputParam.methodUrl,
        displayName: this.props.Login.inputParam.displayName,
        inputData: inputData, operation: this.props.Login.operation,
        saveType, formRef,  selectedId,dataState,
        selectedRecord: {...this.state.selectedRecord}

    }
    const esignNeeded = showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolCode);
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
        this.props.crudMaster(inputParam, this.props.Login.masterData, "openModal","","",clearSelectedRecordField);
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

render() {
    let primaryKeyField = "";

        if (this.props.Login.inputParam !== undefined) {

            this.extractedColumnList = [ 
                { "controlType": "selectbox", "idsName": "IDS_DISTRICTNAME","dataField": "sdistrictname", "width": "150px" },             
                { "controlType": "textarea", "idsName": "IDS_CITY","dataField": "scityname", "width": "150px" },
                { "controlType": "textarea", "idsName": "IDS_CITYCODE","dataField": "scitycode", "width": "150px" },
            ]
            
            primaryKeyField = "ncitycode";
        }
        let mandatoryFields=[];
        mandatoryFields.push( 
            {  "mandatory": true,  "idsName":  "IDS_DISTRICTNAME", "dataField": "ndistrictcode" , "mandatoryLabel":"IDS_SELECT", "controlType": "selectbox"},
            {  "mandatory": true,  "idsName":  "IDS_CITY", "dataField": "scityname" , "mandatoryLabel":"IDS_ENTER", "controlType": "textbox"},
            {  "mandatory": true,  "idsName":  "IDS_CITYCODE", "dataField": "scitycode" , "mandatoryLabel":"IDS_ENTER", "controlType": "textbox"},          
        )


        const addId = this.props.Login.inputParam && this.state.controlMap.has("Add".concat(this.props.Login.inputParam.methodUrl))
         && this.state.controlMap.get("Add".concat(this.props.Login.inputParam.methodUrl)).ncontrolcode;
    
        const editID = this.props.Login.inputParam && this.state.controlMap.has("Edit".concat(this.props.Login.inputParam.methodUrl))
          && this.state.controlMap.get("Edit".concat(this.props.Login.inputParam.methodUrl)).ncontrolcode;

        const addParam = {screenName:this.props.intl.formatMessage({
            id: "IDS_CITY"}), primaryeyField: "ncitycode", primaryKeyValue:undefined,  
        operation:"create", inputParam:this.props.Login.inputParam, userInfo : this.props.Login.userInfo, ncontrolCode: addId};

        const editParam = {
        screenName: this.props.Login.inputParam && this.props.Login.inputParam.displayName && this.props.intl.formatMessage({ id: this.props.Login.inputParam.displayName }), primaryKeyField: "ncitycode", operation: "update",
        inputParam: this.props.Login.inputParam, userInfo: this.props.Login.userInfo, ncontrolCode: editID
        };

        const deleteParam = { operation: "delete" };
        const downloadPram = { operation: "download"};
            

        return(<>
                <Row>
                    <Col>
                        <ListWrapper className="client-list-content">
    
                            {this.state.data ?
                                    <DataGrid
                                        primaryKeyField={primaryKeyField}
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
                                        fetchRecord={this.props.getCityService}
                                        deleteRecord={this.deleteRecord}
                                        reloadData={this.reloadData}
                                        editParam={editParam}
                                        addRecord = {() => this.props.getCityService(addParam)}
                                        deleteParam={deleteParam}
                                        downloadPram={downloadPram}
                                        scrollable={"scrollable"}
                                        gridHeight = {"600px"}
                                        isActionRequired={true}
                                        isToolBarRequired={true}
                                        pageable={true}
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
                        showSaveContinue={true}
                        onSaveClick={this.onSaveClick}
                        esign={this.props.Login.loadEsign}
                        validateEsign={this.validateEsign}
                        masterStatus={this.props.Login.masterStatus}
                        selectedRecord={this.state.selectedRecord || {}}
                        updateStore={this.props.updateStore}
                        mandatoryFields={mandatoryFields}
                        addComponent={this.props.Login.loadEsign ?
                            <Esign
                                operation={this.props.Login.operation}
                                onInputOnChange={this.onInputOnChange}
                                inputParam={this.props.Login.inputParam}
                                selectedRecord={this.state.selectedRecord || {}}
                            />
                            :<AddCity
                            selectedRecord={this.state.selectedRecord || {}}
                            onInputOnChange={this.onInputOnChange}
                            operation={this.props.Login.operation}
                            districtList={this.props.Login.districtList || []}
                            inputParam={this.props.Login.inputParam} 
                            actionType={this.state.actionType}
                            onComboChange={this.onComboChange}

                        />}
                    />
                }
                            
        </>);
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
                isOpen: false,
                selectedRecord: this.props.Login.selectedRecord,
                dataResult: process(this.props.Login.masterData, dataState),
                dataState
            });
        }
    } else if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord) {
        this.setState({ selectedRecord: this.props.Login.selectedRecord });
    }
}
onComboChange = (comboData, fieldName) => {
    const selectedRecord = this.state.selectedRecord || {};
    selectedRecord[fieldName] = comboData;;

    this.setState({ selectedRecord });
}

onInputOnChange = (event) => {

    const selectedRecord = this.state.selectedRecord || {};
    if (event.target.type === 'checkbox') {
        selectedRecord[event.target.name] = event.target.checked === true ? 3 : 4;
    }
    else {
        selectedRecord[event.target.name] = event.target.value;
    }

    this.setState({ selectedRecord });
 }

}
export default connect(mapStateToProps, { callService,getCityService,updateStore,crudMaster,validateEsignCredential,viewAttachment})(injectIntl(City));
