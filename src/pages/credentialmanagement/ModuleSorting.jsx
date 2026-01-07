import React from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Row, Col } from 'react-bootstrap';
import { process } from '@progress/kendo-data-query';

import AddModuleSorting from '../credentialmanagement/AddModuleSorting';
import SlideOutModal from '../../components/slide-out-modal/SlideOutModal';
import Esign from '../audittrail/Esign';
import DataGrid from '../../components/data-grid/data-grid.component';
import { callService,updateStore,crudMaster,validateEsignCredential,viewAttachment, getModuleSortingComboService} from '../../actions';
import { DEFAULT_RETURN } from '../../actions/LoginTypes';
import { getControlMap, showEsign, sortData } from '../../components/CommonScript';
import { ListWrapper } from '../../components/client-group.styles';

const mapStateToProps = state => {
    return ({ Login: state.Login })
}

class ModuleSorting extends React.Component{

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
            loadEsign = false;
            selectedRecord['esignpassword'] = ""
            selectedRecord['esigncomments'] = ""
            selectedRecord['esignreason']=""
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

 onComboChange = (comboData, fieldName) => {      
    const selectedRecord = this.state.selectedRecord || {};
    selectedRecord[fieldName] = comboData;;   
 
    this.setState({selectedRecord});        
}

onSaveClick = (saveType, formRef) => {
    let dataState = undefined;
    let selectedId = null;
    let inputData = [];
    const selectedRecord = this.state.selectedRecord;
    let prevRecord = this.state.selectedRecord[0].nmodulecode.value;
    if (this.props.Login.operation === "update") {
        dataState = this.state.dataState;
        selectedId = this.props.Login.selectedId;
    }
    inputData["nformcode"] = this.state.selectedRecord.nformcode.value;
    inputData["nmodulecode"] = this.state.selectedRecord.nmodulecode.value;
  
if(prevRecord !== inputData.nmodulecode){
    inputData["nmenucode"] = this.state.selectedRecord.nmodulecode.item.nmenucode;
} else{
    inputData["nmenucode"] = this.state.selectedRecord.nmenucode.value;
}
    const inputParam = {
        classUrl: "modulesorting",
        methodUrl: "ModuleSorting",
        inputData: {userinfo: this.props.Login.userInfo, ...inputData},
        operation: this.props.Login.operation,
        displayName: this.props.Login.inputParam.displayName, saveType, formRef, selectedId, dataState,
        selectedRecord
       
    }

    if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolCode)) {
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                loadEsign: true, screenData: { inputParam, masterData: this.props.Login.masterData },
                openModal: true, screenName: this.props.intl.formatMessage({ id: this.props.Login.inputParam.displayName }),
                operation: this.props.Login.operation, selectedId
            }
        }
        this.props.updateStore(updateInfo);
    }
    else {
        this.props.crudMaster(inputParam, this.props.Login.masterData, "openModal");
    }
    
// }
// else{
//     let openModal = false;
    
//     const updateInfo = {
//         typeName: DEFAULT_RETURN,
//         data: { openModal }
//     }
//     this.props.updateStore(updateInfo);
//}

    
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

render() {
    let primaryKeyField = "";


        if (this.props.Login.inputParam !== undefined) {

            this.extractedColumnList = [        
                { "controlType": "combobox", "idsName": "IDS_FORMNAME","dataField": "sformdisplayname", "width": "150px" },     
                { "controlType": "combobox", "idsName": "IDS_MODULENAME","dataField": "smoduledisplayname", "width": "150px" },
            ]
            primaryKeyField = "nformcode";
        }
        let mandatoryFields=[];
  
        const editID = this.props.Login.inputParam && this.state.controlMap.has("Edit".concat(this.props.Login.inputParam.methodUrl))
          && this.state.controlMap.get("Edit".concat(this.props.Login.inputParam.methodUrl)).ncontrolcode;

        const editParam = {
        screenName: this.props.Login.inputParam && this.props.Login.inputParam.displayName && this.props.intl.formatMessage({ id: this.props.Login.inputParam.displayName }), primaryKeyField: "nformcode", operation: "update",
        inputParam: this.props.Login.inputParam, userInfo: this.props.Login.userInfo, ncontrolCode: editID
        };

        sortData(this.props.Login.masterData,'ascending','nformcode');

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
                                        fetchRecord={this.props.getModuleSortingComboService}
                                        reloadData={this.reloadData}
                                        editParam={editParam}
                                        scrollable={"scrollable"}
                                        gridHeight = {"600px"}
                                        isDownloadExcelRequired={false}
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
                        onSaveClick={this.onSaveClick}
                        validateEsign={this.validateEsign}
                        masterStatus={this.props.Login.masterStatus}
                        selectedRecord={this.state.selectedRecord || {}}
                        updateStore={this.props.updateStore}
                        mandatoryFields={mandatoryFields}
                        esign={this.props.Login.loadEsign}
                        addComponent={
                            this.props.Login.loadEsign ?
                            <Esign
                                operation={this.props.Login.operation}
                                onInputOnChange={this.onInputOnChange}
                                inputParam={this.props.Login.inputParam}
                                selectedRecord={this.state.selectedRecord || {}}
                            />
                            :
                            <AddModuleSorting
                            selectedRecord={this.props.Login.selectedRecord || {}}
                            onComboChange={this.onComboChange}
                            moduleSortingData={this.props.Login.moduleSortingData} 
                            formMapList={this.props.Login.formMapList}
                            moduleMapList={this.props.Login.moduleMapList}
                            menuMapList={this.props.Login.menuMapList}
                            operation={this.props.Login.operation}
                            inputParam={this.props.Login.inputParam} 
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

}
export default connect(mapStateToProps, { callService,updateStore,crudMaster,validateEsignCredential,viewAttachment, getModuleSortingComboService})(injectIntl(ModuleSorting));
