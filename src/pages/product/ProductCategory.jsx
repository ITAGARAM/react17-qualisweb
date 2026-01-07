import React from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { ListWrapper } from '../../components/client-group.styles';
import { Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { process } from '@progress/kendo-data-query';
import { callService, crudMaster, fetchRecord, validateEsignCredential, openProductCategoryModal, updateStore } from '../../actions';
import DataGrid from '../../components/data-grid/data-grid.component';
import { getControlMap, showEsign } from '../../components/CommonScript';
import AddProductCategory from './AddProductCategory';
import Esign from '../audittrail/Esign';
import SlideOutModal from '../../components/slide-out-modal/SlideOutModal';
import { DEFAULT_RETURN } from '../../actions/LoginTypes';
import { transactionStatus } from '../../components/Enumeration';

const mapStateToProps = state => {
    return ({ Login: state.Login })
}

class ProductCategory extends React.Component {
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
            { "controlType": "textbox", "idsName":this.props.Login.genericLabel ? this.props.Login.genericLabel["ProductCategory"]["jsondata"]["sdisplayname"][this.props.Login.userInfo.slanguagetypecode] : "IDS_PRODUCTCATEGORY", "dataField": "sproductcatname", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_ENTER" },

           // { "controlType": "textbox", "idsName": "IDS_PRODUCTCATEGORY", "dataField": "sproductcatname", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_ENTER" },
            { "controlType": "textarea", "idsName": "IDS_DESCRIPTION", "dataField": "sdescription", "width": "400px", "mandatoryLabel": "IDS_ENTER" },
            { "controlType": "checkbox", "idsName": "IDS_CATEGORYBASEDFLOW", "dataField": "scategorybasedflow", "width": "200px", "controlName": "ncategorybasedflow" },
            { "controlType": "checkbox", "idsName": "IDS_CATEGORYBASEDPROTOCOL", "dataField": "scategorybasedprotocol", "width": "200px", "controlName": "ncategorybasedprotocol" },    // Added by sonia on 8th OCT 2024 for jira id:ALPD-5023  
            { "controlType": "checkbox", "idsName": "IDS_SCHEDULERREQUIRED", "dataField": "sschedulerrequired", "width": "200px", "controlName": "nschedulerrequired" },                 // ALPD-5321 Sample Category - nschedulerrequired field added to table, to check add, edit, delete.
            { "controlType": "checkbox", "idsName": "IDS_DEFAULTSTATUS", "dataField": "sdisplaystatus", "width": "150px","controlName": "ndefaultstatus", "mandatoryLabel": "IDS_SELECT" }
        ]
        this.primaryKeyField = "nproductcatcode";
        this.fieldList = ["sproductcatname", "sdescription", "ndefaultstatus","ncategorybasedflow","ncategorybasedprotocol","nschedulerrequired"]; // ALPD-5321 Sample Category - nschedulerrequired field added to table, to check add, edit, delete.  // Added by sonia on 8th OCT 2024 for jira id:ALPD-5023  
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

        const addId = this.props.Login.inputParam && this.state.controlMap.has("Add".concat(this.props.Login.inputParam.methodUrl))
            && this.state.controlMap.get("Add".concat(this.props.Login.inputParam.methodUrl)).ncontrolcode;

        const editID = this.props.Login.inputParam && this.state.controlMap.has("Edit".concat(this.props.Login.inputParam.methodUrl))
            && this.state.controlMap.get("Edit".concat(this.props.Login.inputParam.methodUrl)).ncontrolcode;

        const editParam = {
            screenName: this.props.Login.inputParam && this.props.Login.inputParam.displayName && this.props.Login.genericLabel["ProductCategory"]["jsondata"]["sdisplayname"][this.props.Login.userInfo.slanguagetypecode], primaryKeyField: "nproductcatcode", operation: "update",
            inputParam: this.props.Login.inputParam, userInfo: this.props.Login.userInfo, ncontrolCode: editID
        };
        const deleteParam = { operation: "delete" };

        const mandatoryFields = [];
        this.extractedColumnList.forEach(item => item.mandatory === true ?
            mandatoryFields.push(item) : ""
        );
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
                                    fetchRecord={this.props.fetchRecord}
                                    deleteRecord={this.deleteRecord}
                                    reloadData={this.reloadData}
                                    addRecord={() => this.props.openProductCategoryModal("IDS_PRODUCTCATEGORY", addId,this.props.Login.settings)}
                                    editParam={editParam}
                                    deleteParam={deleteParam}
                                    scrollable={'scrollable'}
                                    gridHeight={'600px'}
                                    isActionRequired={true}
                                    isToolBarRequired={true}
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
                        showSaveContinue={true}
                        closeModal={this.closeModal}
                        operation={this.props.Login.operation}
                        inputParam={this.props.Login.inputParam}
                        // screenName={this.props.Login.screenName}
                        screenName={this.props.Login.genericLabel["ProductCategory"]["jsondata"]["sdisplayname"][this.props.Login.userInfo.slanguagetypecode]}
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
                            : <AddProductCategory
                                selectedRecord={this.state.selectedRecord || {}}
                                onInputOnChange={this.onInputOnChange}
                                onComboChange={this.onComboChange}
                                formatMessage={this.props.intl.formatMessage}
                                genericLabel={this.props.Login.genericLabel}
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
                    dataState,
                    selectedRecord: this.props.Login.selectedRecord
                });
            }
        } else if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord) {
            this.setState({ selectedRecord: this.props.Login.selectedRecord });
        }
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

    deleteRecord = (inputData) => {
        const inputParam = {
            classUrl: this.props.Login.inputParam.classUrl,
            methodUrl: this.props.Login.inputParam.methodUrl,

            inputData: {
                [this.props.Login.inputParam.methodUrl.toLowerCase()]: inputData.selectedRecord,
                "userinfo": this.props.Login.userInfo,"genericlabel":this.props.Login.genericLabel
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
                    openModal: true, screenName: this.props.Login.inputParam.displayName && this.props.Login.genericLabel["ProductCategory"]["jsondata"]["sdisplayname"][this.props.Login.userInfo.slanguagetypecode],
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
        //add 
        let inputData = [];
        inputData["userinfo"] = this.props.Login.userInfo;
        inputData["genericlabel"] =this.props.Login.genericLabel;

        let dataState = undefined;
        let selectedId = null;
        if (this.props.Login.operation === "update") {
            // edit
            dataState = this.state.dataState;
            selectedId = this.props.Login.selectedId;
            inputData[this.props.Login.inputParam.methodUrl.toLowerCase()] = this.state.selectedRecord;
          //  inputData[this.props.Login.inputParam.methodUrl.toLowerCase()] = { "ncategorybasedflow": this.props.Login.settings&&parseInt(this.props.Login.settings[20])===transactionStatus.YES?transactionStatus.YES:transactionStatus.NO};

            this.fieldList.map(item => {
                return inputData[this.props.Login.inputParam.methodUrl.toLowerCase()][item] = this.state.selectedRecord[item] ? this.state.selectedRecord[item] : "";
            })
            
        }
        else {
            //add               
            inputData[this.props.Login.inputParam.methodUrl.toLowerCase()] = { "nsitecode": this.props.Login.userInfo.nmastersitecode };
           // inputData[this.props.Login.inputParam.methodUrl.toLowerCase()] = { "ncategorybasedflow": this.props.Login.settings&&parseInt(this.props.Login.settings[20])===transactionStatus.YES?transactionStatus.YES:transactionStatus.NO};
            this.fieldList.map(item => {
                return inputData[this.props.Login.inputParam.methodUrl.toLowerCase()][item] = this.state.selectedRecord[item]
            })
        }
        let clearSelectedRecordField = [
            { "controlType": "textbox", "idsName":"IDS_PRODUCTCATEGORY", "dataField": "sproductcatname", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_ENTER","isClearField":true },
            { "controlType": "textarea", "idsName": "IDS_DESCRIPTION", "dataField": "sdescription", "width": "200px", "mandatoryLabel": "IDS_ENTER","isClearField":true },
            { "controlType": "checkbox", "idsName": "IDS_CATEGORYBASEDFLOW", "dataField": "ncategorybasedflow", "width": "200px", "controlName": "ncategorybasedflow","isClearField":true,"preSetValue":3 },
            { "controlType": "checkbox", "idsName": "IDS_CATEGORYBASEDPROTOCOL", "dataField": "ncategorybasedprotocol", "width": "200px", "controlName": "ncategorybasedprotocol","isClearField":true,"preSetValue":4 },
            { "controlType": "checkbox", "idsName": "IDS_SCHEDULERREQUIRED", "dataField": "nschedulerrequired", "width": "200px", "controlName": "nschedulerrequired","isClearField":true,"preSetValue":4 },        //ALPD-5321 Sample Category - nschedulerrequired field added to table, to check add, edit, delete.
            { "controlType": "checkbox", "idsName": "IDS_DEFAULTSTATUS", "dataField": "ndefaultstatus", "width": "150px","controlName": "ndefaultstatus", "mandatoryLabel": "IDS_SELECT","isClearField":true,"preSetValue":4 }
        ]
        const inputParam = {
            classUrl: this.props.Login.inputParam.classUrl,
            methodUrl: this.props.Login.inputParam.methodUrl,
            inputData: inputData,
            operation: this.props.Login.operation,
            displayName: this.props.Login.inputParam.displayName, saveType, formRef, selectedId, dataState,
            selectedRecord:{...this.state.selectedRecord}
        }
        const esignNeeded = showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolCode);
        if (esignNeeded) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData: this.props.Login.masterData },
                    openModal: true, screenName: this.props.Login.inputParam.displayName && this.props.Login.genericLabel["ProductCategory"]["jsondata"]["sdisplayname"][this.props.Login.userInfo.slanguagetypecode],
                    operation: this.props.Login.operation
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.crudMaster(inputParam, this.props.Login.masterData, "openModal","","",clearSelectedRecordField);
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
export default connect(mapStateToProps, { callService, crudMaster, fetchRecord, validateEsignCredential, openProductCategoryModal, updateStore })(injectIntl(ProductCategory));