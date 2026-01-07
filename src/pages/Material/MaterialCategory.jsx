import React from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Row, Col } from 'react-bootstrap';
import { process } from '@progress/kendo-data-query';
import { toast } from 'react-toastify';
import DataGrid from '../../components/data-grid/data-grid.component';
import AddMaterialCategory from './AddMaterialCategory';
import SlideOutModal from '../../components/slide-out-modal/SlideOutModal';
import Esign from '../audittrail/Esign';
import { ListWrapper, PrimaryHeader } from '../../components/client-group.styles';
import { callService, getMaterialTypeComboService, updateStore, crudMaster, validateEsignCredential } from '../../actions';
import { getControlMap, showEsign } from '../../components/CommonScript';
import { DEFAULT_RETURN } from '../../actions/LoginTypes';
import { transactionStatus } from '../../components/Enumeration';

const mapStateToProps = state => {
    return ({ Login: state.Login })
}

class MaterialCategory extends React.Component {

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
            isOpen: false,
            userRoleControlRights: [],
            controlMap: new Map()
        };
    };


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
                { "controlType": "combobox", "idsName": "IDS_MATERIALTYPE", "dataField": "smaterialtypename", "width": "200px","tablecolumnname":"nmaterialtypecode" },
                { "controlType": "textbox", "idsName": "IDS_MATERIALCATEGORY", "dataField": "smaterialcatname", "width": "200px","tablecolumnname":"smaterialcatname" },
                { "controlType": "combobox", "idsName": "IDS_BARCODE", "dataField": "sbarcodename", "width": "200px","tablecolumnname":"nbarcode" },
                { "controlType": "textarea", "idsName": "IDS_DESCRIPTION", "dataField": "sdescription", "width": "200px" ,"tablecolumnname":"sdescription"},
                { "controlType": "checkbox", "idsName": "IDS_CATEGORYBASEDFLOW", "dataField": "scategorybasedflow", "width": "200px", "isIdsField": false, "controlName": "ncategorybasedflow","tablecolumnname":"ncategorybasedflow" },
                { "controlType": "checkbox", "idsName": "IDS_DEFAULTSTATUS", "dataField": "sdisplaystatus", "width": "200px", "isIdsField": false, "controlName": "ndefaultstatus","tablecolumnname":"ndefaultstatus" },
                { "controlType": "checkbox", "idsName": "IDS_NEEDSECTIONWISE", "dataField": "sneedSectionwise", "width": "200px", "isIdsField": false, "controlName": "needSectionwise","tablecolumnname":"needsectionwise" }
            ]
            primaryKeyField = "nmaterialcatcode";
        }
        let mandatoryFields = [];
        mandatoryFields.push(
            { "mandatory": true, "idsName": "IDS_MATERIALTYPE", "dataField": "nmaterialtypecode", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
            { "mandatory": true, "idsName": "IDS_MATERIALCATEGORY", "dataField": "smaterialcatname", "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" }//,
          //  { "mandatory": true, "idsName": "IDS_BARCODE", "dataField": "nbarcode", "mandatoryLabel": "IDS_SELECT", "controlType": "textbox" },

        )
        const addId = this.props.Login.inputParam && this.state.controlMap.has("Add".concat(this.props.Login.inputParam.methodUrl))
            && this.state.controlMap.get("Add".concat(this.props.Login.inputParam.methodUrl)).ncontrolcode;

        const editID = this.props.Login.inputParam && this.state.controlMap.has("Edit".concat(this.props.Login.inputParam.methodUrl))
            && this.state.controlMap.get("Edit".concat(this.props.Login.inputParam.methodUrl)).ncontrolcode;

        const addParam = {
            screenName: this.props.intl.formatMessage({ id: "IDS_MATERIALCATEGORY" }), primaryeyField: "nmaterialcatcode", primaryKeyValue: undefined,
            operation: "create", inputParam: this.props.Login.inputParam, userInfo: this.props.Login.userInfo, ncontrolCode: addId
        };

        const editParam = {
            screenName: this.props.Login.inputParam && this.props.Login.inputParam.displayName && this.props.intl.formatMessage({ id: this.props.Login.inputParam.displayName }), primaryKeyField: "nmaterialcatcode", operation: "update",
            inputParam: this.props.Login.inputParam, userInfo: this.props.Login.userInfo, ncontrolCode: editID
        };


        const deleteParam = { operation: "delete" };
        return (
            <>
                <Row>
                    <Col>
                        <ListWrapper className="client-list-content">
                            <PrimaryHeader className="d-flex justify-content-between mb-3">
                                {/* <HeaderName className="header-primary-md">
                                {this.props.Login.inputParam && this.props.Login.inputParam.displayName ?
                                    <FormattedMessage id={this.props.Login.inputParam.displayName} /> : ""}
                            </HeaderName> */}
                                {/* <Button className="btn btn-user btn-primary-blue"
                                 hidden={this.props.Login.inputParam && this.state.userRoleControlRights.indexOf(addId) === -1}
                                onClick={() => this.props.getMaterialTypeComboService(addParam)}>
                                <FontAwesomeIcon icon={faPlus} /> {}
                                <FormattedMessage id="IDS_ADD" defaultMessage='Add' />
                            </Button> */}
                            </PrimaryHeader>

                            {this.state.data ?
                                <DataGrid
                                    primaryKeyField={primaryKeyField}
                                    //selectedId={this.props.Login.selectedId}
                                    data={this.state.data}
                                    dataResult={this.state.dataResult}
                                    dataState={this.state.dataState}
                                    dataStateChange={this.dataStateChange}
                                    extractedColumnList={this.extractedColumnList}
                                    controlMap={this.state.controlMap}
                                    userRoleControlRights={this.state.userRoleControlRights}
                                    inputParam={this.props.Login.inputParam}
                                    userInfo={this.props.Login.userInfo}
                                    fetchRecord={this.props.getMaterialTypeComboService}
                                    deleteRecord={this.deleteRecord}
                                    reloadData={this.reloadData}
                                    editParam={editParam}
                                    deleteParam={deleteParam}
                                    addRecord={() => this.props.getMaterialTypeComboService(addParam)}
                                    scrollable={"scrollable"}
                                    gridHeight={"600px"}
                                    // formatMessage={this.props.intl.formatMessage}
                                    //isComponent={true}
                                    isActionRequired={true}
                                    isToolBarRequired={true}
                                    //pageable={true}
                                    pageable={{ buttonCount: 4, pageSizes: true }}
                                    hasDynamicColSize={true}
                                    selectedId={this.props.Login.selectedId}
                                    settings={this.props.Login.settings}
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
                        updateStore={this.props.updateStore}
                        mandatoryFields={mandatoryFields}
                        selectedRecord={this.state.selectedRecord || {}}
                        addComponent={this.props.Login.loadEsign ?
                            <Esign
                                operation={this.props.Login.operation}
                                formatMessage={this.props.intl.formatMessage}
                                onInputOnChange={this.onInputOnChange}
                                inputParam={this.props.Login.inputParam}
                                selectedRecord={this.state.selectedRecord || {}}
                            />
                            : <AddMaterialCategory
                                selectedRecord={this.state.selectedRecord || {}}
                                onInputOnChange={this.onInputOnChange}
                                onComboChange={this.onComboChange}
                                needSectionwisedisabled={this.props.Login.needSectionwisedisabled}
                                // formatMessage={this.props.intl.formatMessage}
                                materialCatgeoryList={this.props.Login.materialCatgeoryList || []}
                                barcodeList={this.props.Login.barcodeList || []}
                                operation={this.props.Login.operation}
                                materialtypeListype={this.props.Login.materialtypeListype}
                                inputParam={this.props.Login.inputParam}

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

    deleteRecord = (inputData) => {
        const inputParam = {
            classUrl: this.props.Login.inputParam.classUrl,
            methodUrl: this.props.Login.inputParam.methodUrl,

            inputData: {
                [this.props.Login.inputParam.methodUrl.toLowerCase()]: inputData.selectedRecord,
                "userinfo": this.props.Login.userInfo
            },
            operation: inputData.operation,
            displayName: this.props.Login.inputParam.displayName,
            selectedRecord:{...this.state.selectedRecord}
            //dataState: this.state.dataState
        }
        const esignNeeded = showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, inputData.ncontrolCode);
        if (esignNeeded) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData: this.props.Login.masterData },
                    openModal: true, screenName: this.props.intl.formatMessage({ id: this.props.Login.inputParam.displayName }),
                    operation: inputData.operation
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.crudMaster(inputParam, this.props.Login.masterData, "openModal");
        }
    }

    onSaveClick = (saveType, formRef) => {
        //add 
        let inputData = [];
        inputData["userinfo"] = this.props.Login.userInfo;
        let dataState = undefined;
        let selectedId = null;
        if (this.props.Login.operation === "update") {
            // edit
            dataState = this.state.dataState;
            inputData[this.props.Login.inputParam.methodUrl.toLowerCase()] = JSON.parse(JSON.stringify(this.state.selectedRecord));
            selectedId = this.props.Login.selectedRecord.nmaterialcatcode;

        }
        else {
            //add               
            inputData[this.props.Login.inputParam.methodUrl.toLowerCase()] = { "nsitecode": this.props.Login.userInfo.nmastersitecode };
            inputData[this.props.Login.inputParam.methodUrl.toLowerCase()] = { "nuserrolecode": this.props.Login.userInfo.nuserrole };

        }
        if (inputData["materialcategory"].hasOwnProperty('esignpassword')) {
        if (inputData["materialcategory"]['esignpassword'] === '') {
            delete inputData["materialcategory"]['esigncomments']
            delete inputData["materialcategory"]['esignpassword']
            delete inputData["materialcategory"]['esignreason']
        }
    }

        inputData["materialcategory"]["nmaterialtypecode"] = this.state.selectedRecord["nmaterialtypecode"] ? this.state.selectedRecord["nmaterialtypecode"].value : transactionStatus.NA;
        inputData["materialcategory"]["nbarcode"] = this.state.selectedRecord["nbarcode"] ? this.state.selectedRecord["nbarcode"].value : transactionStatus.NA;

        inputData["materialcategory"]["smaterialcatname"] = this.state.selectedRecord["smaterialcatname"] ? this.state.selectedRecord["smaterialcatname"] : transactionStatus.NO;
        inputData["materialcategory"]["sdescription"] = this.state.selectedRecord["sdescription"] ? this.state.selectedRecord["sdescription"] : "";
        inputData["materialcategory"]["ndefaultstatus"] = this.state.selectedRecord["ndefaultstatus"] ? this.state.selectedRecord["ndefaultstatus"] : transactionStatus.NO;
        inputData["materialcategory"]["ncategorybasedflow"] = this.state.selectedRecord["ncategorybasedflow"] ? this.state.selectedRecord["ncategorybasedflow"] : transactionStatus.NO;
        inputData["materialcategory"]["needSectionwise"] = this.state.selectedRecord["needSectionwise"] ? this.state.selectedRecord["needSectionwise"] : transactionStatus.NO;
        let clearSelectedRecordField =[
            { "idsName": "IDS_MATERIALCATEGORY", "dataField": "smaterialcatname", "width": "200px" ,"controlType": "textbox","isClearField":true},
            { "idsName": "IDS_DESCRIPTION", "dataField": "sdescription", "width": "200px","controlType": "textbox","isClearField":true },
            { "idsName": "IDS_CATEGORYBASEDFLOW", "dataField": "ncategorybasedflow", "width": "100px","isClearField":true,"preSetValue":4},
            { "idsName": "IDS_DEFAULTSTATUS", "dataField": "ndefaultstatus", "width": "100px","isClearField":true,"preSetValue":4},
            { "idsName": "IDS_NEEDSECTIOWISE", "dataField": "needSectionwise", "width": "100px","isClearField":true,"preSetValue":4},
            
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
                    openModal: true, screenName: this.props.intl.formatMessage({ id: this.props.Login.inputParam.displayName }),
                    operation: this.props.Login.operation,
                    
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.crudMaster(inputParam, this.props.Login.masterData, "openModal","","",clearSelectedRecordField);
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
            selectedRecord[event.target.name] = event.target.checked === true ? 3 : 4;
        }
        else {
            selectedRecord[event.target.name] = event.target.value;
        }

        this.setState({ selectedRecord });
    }


    onComboChange = (comboData, fieldName) => {
        const selectedRecord = this.state.selectedRecord || {};
        selectedRecord[fieldName] = comboData;;

        this.setState({ selectedRecord });
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

export default connect(mapStateToProps, { callService, getMaterialTypeComboService, updateStore, crudMaster, validateEsignCredential })(injectIntl(MaterialCategory));