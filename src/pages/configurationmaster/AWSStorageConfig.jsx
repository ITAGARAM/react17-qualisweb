import React from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import DataGrid from '../../components/data-grid/data-grid.component'
import SlideOutModal from '../../components/slide-out-modal/SlideOutModal';
import { callService, crudMaster,  fetchAWSStorageConfigByID, updateStore, validateEsignCredential } from '../../actions';
import { toast } from 'react-toastify';
import { Row, Col } from 'react-bootstrap';
import { process } from '@progress/kendo-data-query';
import { ListWrapper } from '../../components/client-group.styles'
import { showEsign, getControlMap } from '../../components/CommonScript';
import { DEFAULT_RETURN } from '../../actions/LoginTypes'
import Esign from '../audittrail/Esign';
import { transactionStatus } from '../../components/Enumeration';
import AddAWSStorageConfig from './AddAWSStorageConfig';

const mapStateToProps = state => {
    return ({ Login: state.Login })
}
class AWSConfigStorage extends React.Component {
    constructor(props) {
        super(props)
        this.formRef = React.createRef();
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
        }
    }
    dataStateChange = (event) => {
        this.setState({
            dataResult: process(this.state.data, event.dataState),
            dataState: event.dataState
        });
    }

    reloadData = () => {
        const inputParam = {
            inputData: { userinfo: this.props.Login.userInfo },
            methodUrl: this.props.Login.inputParam.methodUrl,
            displayName: this.props.Login.inputParam.displayName ? this.props.Login.inputParam.displayName : '',
            classUrl: this.props.Login.inputParam.classUrl,
            userInfo: this.props.Login.userInfo
        };

        this.props.callService(inputParam);
    }
 openModal = (ncontrolCode) => {
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                selectedRecord: {}, operation: "create", ncontrolCode, selectedId:null,
                openModal: true, screenName: this.props.Login.inputParam.displayName
            }
        }
        this.props.updateStore(updateInfo);
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
                data: { openModal, loadEsign, selectedRecord, optionsChecklistComponent: [], optionsQBCategory: [], selectedId }
            }
            this.props.updateStore(updateInfo);
        };


     onSaveClick = (saveType, formRef) => {
            let inputData = [];
            inputData["userinfo"] = this.props.Login.userInfo;
            let dataState = undefined;
            let selectedId = null;
           
           inputData["awsstorageconfig"] ={
           "nawsstorageconfigcode":this.state.selectedRecord.nawsstorageconfigcode,
           "saccesskeyid":this.state.selectedRecord.saccesskeyid,
           "ssecretpasskey":this.state.selectedRecord.ssecretpasskey,
           "sbucketname":this.state.selectedRecord.sbucketname,
           "sregion":this.state.selectedRecord.sregion,
           "ndefaultstatus":this.state.selectedRecord.ndefaultstatus,



           };
    
            
            const inputParam = {
                methodUrl: this.props.Login.inputParam.methodUrl,
                classUrl: this.props.Login.inputParam.classUrl,
                displayName: this.props.Login.inputParam.displayName ? this.props.Login.inputParam.displayName : "",
                inputData: inputData,
                operation: this.props.Login.operation,
                formRef, saveType, dataState, selectedId,
                selectedRecord:{...this.state.selectedRecord}
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
    

    deleteRecord = (deleteParam) => {

        const inputParam = {
            methodUrl: this.props.Login.inputParam.methodUrl,
            classUrl: this.props.Login.inputParam.classUrl,
            displayName: this.props.Login.inputParam.displayName ? this.props.Login.inputParam.displayName : "",
            inputData: { "awsstorageconfig": deleteParam.selectedRecord, "userinfo": this.props.Login.userInfo },
            operation: deleteParam.operation,
            dataState: this.state.dataState,
            selectedRecord: { ...this.state.selectedRecord }
        }
        const masterData = this.props.Login.masterData;
        if (
            showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, deleteParam.ncontrolCode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true,
                    screenData: { inputParam, masterData },
                    operation: deleteParam.operation,
                    openModal: true,
                    screenName: this.props.Login.inputParam.displayName,
                    optionsQBCategory: this.props.Login.optionsQBCategory,
                    optionsChecklistComponent: this.props.Login.optionsChecklistComponent
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.crudMaster(inputParam, masterData, "openModal");
        }
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

    validateEsign = () => {
        const inputParam = {
            inputData: {
                "userinfo": {
                    ...this.props.Login.userInfo,
                    sreason: this.state.selectedRecord["esigncomments"],
                    nreasoncode: this.state.selectedRecord["esignreason"] && this.state.selectedRecord["esignreason"].value,
                    spredefinedreason: this.state.selectedRecord["esignreason"] && this.state.selectedRecord["esignreason"].label,
                },
                password: this.state.selectedRecord["esignpassword"]
            },
            screenData: this.props.Login.screenData
        }
        this.props.validateEsignCredential(inputParam, "openModal");
    }


    render() {
        let primaryKeyField = "";
        this.extractedColumnList = [

            { "idsName": "IDS_ACCESSKEYID", "dataField": "saccesskeyid","mandatoryLabel": "IDS_ACCESSKEYID", "controlType": "textbox"  },
            //{ "idsName": "IDS_SECRETPASSKEY", "dataField": "ssecretpasskey", "mandatoryLabel": "IDS_SECRETPASSKEY", "controlType": "textbox"},
            { "idsName": "IDS_BUCKETNAME", "dataField": "sbucketname", "mandatoryLabel": "IDS_BUCKETNAME", "controlType": "textbox" },
            { "idsName": "IDS_REGIONS", "dataField": "sregion", "mandatoryLabel": "IDS_REGIONS", "controlType": "textbox" },
            { "idsName": "IDS_DEFAULTSTATUS", "dataField": "sdefaultstatus","mandatoryLabel": "IDS_DEFAULTSTATUS", "controlType": "textbox" }

        ]
        primaryKeyField = "nawsstorageconfigcode";
        const addID = this.props.Login.inputParam && this.state.controlMap.has("AddAWSStorageConfig")
            && this.state.controlMap.get('AddAWSStorageConfig').ncontrolcode;

             const editID = this.props.Login.inputParam && this.state.controlMap.has("EditAWSStorageConfig")
            && this.state.controlMap.get('EditAWSStorageConfig').ncontrolcode;
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
            methodUrl: "UserMultiRole",
            operation: "delete"
        };


        const mandatoryFields =[
            { "idsName": "IDS_ACCESSKEYID", "dataField": "saccesskeyid", "width": "200px" },
            { "idsName": "IDS_SECRETPASSKEY", "dataField": "ssecretpasskey", "width": "200px" },
            { "idsName": "IDS_BUCKETNAME", "dataField": "sbucketname", "width": "200px" },
            { "idsName": "IDS_REGIONS", "dataField": "sregion", "width": "200px" },
            //{ "idsName": "IDS_DEFAULTSTATUS", "dataField": "sdefaultstatus", "width": "200px" }



        ]
        return (
            <>
                <Row>
                    <Col>
                        <ListWrapper className="client-list-content">


                            {this.state.data ? <DataGrid
                                primaryKeyField={primaryKeyField}
                                data={this.state.data}
                                dataResult={this.state.dataResult}
                                dataState={this.state.dataState}
                                dataStateChange={this.dataStateChange}
                                extractedColumnList={this.extractedColumnList}
                                fetchRecord={this.props.fetchAWSStorageConfigByID}
                                deleteRecord={this.deleteRecord}
                                reloadData={this.reloadData}
                                pageable={{ buttonCount: 4, pageSizes: true }}
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
                               addRecord = {() => this.openModal(addID)}

                            /> : ""}
                        </ListWrapper>
                    </Col>
                </Row>
                {this.props.Login.openModal ?
                    <SlideOutModal
                        onSaveClick={this.onSaveClick}
                        operation={this.props.Login.operation}
                        screenName="IDS_AWSSTORAGECONFIG"
                        closeModal={this.closeModal}
                        show={this.props.Login.openModal}
                        inputParam={this.props.Login.inputParam}
                        esign={this.props.Login.loadEsign}
                        validateEsign={this.validateEsign}
                        selectedRecord={this.state.selectedRecord || {}}
                        mandatoryFields={mandatoryFields}
                        addComponent={this.props.Login.loadEsign ?
                            <Esign operation={this.props.Login.operation}
                                onInputOnChange={this.onInputOnChange}
                                inputParam={this.props.Login.inputParam}
                                selectedRecord={this.state.selectedRecord || {}}
                            />
                            : <AddAWSStorageConfig
                                selectedRecord={this.state.selectedRecord || {}}
                                onInputOnChange={this.onInputOnChange}
                                onComboChange={this.onComboChange}
                                TimeZoneList={this.props.Login.TimeZoneList || []}
                                dateFormatList={this.props.Login.dateFormatList || []}
                                operation={this.props.Login.operation}
                                regionList={this.props.Login.regionList}
                                districtList={this.props.Login.districtList}
                                siteTypeList={this.props.Login.siteTypeList}
                                NeedUTCConversation={parseInt(this.props.Login.settings[21])}
                                siteAdditionalInfo={parseInt(this.props.Login.settings[23])}
                                sitecodemaxlength={5}
                           />
                          
                            } /> : ""}
                        </>
        )
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
                                if (this.state.dataResult.data) {
                    if (this.state.dataResult.data.length === 1) {
                        let skipcount = this.state.dataState.skip > 0 ? (this.state.dataState.skip - this.state.dataState.take) :
                            this.state.dataState.skip
                        dataState = { skip: skipcount, take: this.state.dataState.take }
                    }
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


}

export default connect(mapStateToProps, { callService, crudMaster, fetchAWSStorageConfigByID, updateStore, validateEsignCredential })(injectIntl(AWSConfigStorage));