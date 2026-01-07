import React from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { process } from '@progress/kendo-data-query';
import DataGrid from '../../../components/data-grid/data-grid.component';
import AddTemplate from './AddTemplate';
import Esign from '../../audittrail/Esign';
import SlideOutModal from '../../../components/slide-out-modal/SlideOutModal';
import { ListWrapper } from '../../../components/client-group.styles';
import { callService, crudMaster, fetchEmailTemplateById, validateEsignCredential, openEmailTemplateModal, updateStore, comboChangeEmailTag } from '../../../actions';
import { transactionStatus } from '../../../components/Enumeration';
import { constructOptionList, getControlMap, showEsign } from '../../../components/CommonScript';
import { DEFAULT_RETURN } from '../../../actions/LoginTypes';
// import './Drag.css';

import { EditorUtils, ProseMirror } from '@progress/kendo-react-editor';


const mapStateToProps = state => {
    return ({ Login: state.Login })
}

class EmailTemplate extends React.Component {

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
            data: [], masterStatus: "", error: "", Tag: [], selectedRecord: {

            },
            dataResult: [],
            dataState: dataState,
            isOpen: false,
            userRoleControlRights: [],
            controlMap: new Map(),
            emailParam: [],
            content: {},
            //  value: EditorUtils.createDocument(
            //      new ProseMirror.Schema({ nodes: EditorUtils.nodes, marks: EditorUtils.marks })
            //  )
            value:''
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
        if (this.props.Login.loadEsign) {
            if (this.props.Login.operation === "delete") {
                loadEsign = false;
                openModal = false;
            } else {
                loadEsign = false;
            }
        } else {
            openModal = false;
            selectedRecord = {};
        }
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { openModal, loadEsign, selectedRecord,selectedId:null }
        }
        this.props.updateStore(updateInfo);
    }


    render() {

        let primaryKeyField = "";

        if (this.props.Login.inputParam !== undefined) {

            this.extractedColumnList = [
                { "controlType": "textbox", "idsName": "IDS_TEMPLATENAME", "dataField": "stemplatename", "width": "200px" },
                { "controlType": "textbox", "idsName": "IDS_SUBJECT", "dataField": "ssubject", "width": "200px" },
                //{ "controlType": "textarea", "idsName": "IDS_TEMPLATEBODY", "dataField": "stemplatebody", "width": "200px" },
                { "controlType": "selectbox", "idsName": "IDS_EMAILTAG", "dataField": "stagname", "width": "200px" }
            ]
            this.detailedFieldList = [
                                        { "idsName": "IDS_TEMPLATEBODY", "dataField": "stemplatebody", "width": "300px", "isHTML": true,"columnSize":"12" }
                                    ];
            primaryKeyField = "nemailtemplatecode";
            this.fieldList = ["stemplatename", "ssubject", "stemplatebody"];
        }

        const mandatoryFields = [{ "mandatory": true, "idsName": "IDS_TEMPLATENAME", "dataField": "stemplatename", "mandatoryLabel":"IDS_ENTER", "controlType": "textbox" },
                                { "mandatory": true, "idsName": "IDS_SUBJECT", "dataField": "ssubject", "mandatoryLabel":"IDS_ENTER", "controlType": "textbox" },
                                { "mandatory": true, "idsName": "IDS_EMAILTAG", "dataField": "nemailtagcode" , "mandatoryLabel":"IDS_SELECT", "controlType": "selectbox"}
                            ];


        const addId = this.props.Login.inputParam && this.state.controlMap.has("Add".concat(this.props.Login.inputParam.methodUrl))
            && this.state.controlMap.get("Add".concat(this.props.Login.inputParam.methodUrl)).ncontrolcode;

        const editID = this.props.Login.inputParam && this.state.controlMap.has("Edit".concat(this.props.Login.inputParam.methodUrl))
            && this.state.controlMap.get("Edit".concat(this.props.Login.inputParam.methodUrl)).ncontrolcode;

        const editParam = {
            screenName: this.props.Login.inputParam && this.props.Login.inputParam.displayName && this.props.intl.formatMessage({ id: this.props.Login.inputParam.displayName }), primaryKeyField: "nemailtemplatecode", operation: "update",
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
                                    fetchRecord={this.props.fetchEmailTemplateById}
                                    deleteRecord={this.deleteRecord}
                                    reloadData={this.reloadData}
                                    editParam={editParam}
                                    deleteParam={deleteParam}
                                    addRecord={() => this.props.openEmailTemplateModal("IDS_MAILTEMPLATE", "create", "nemailtemplatecode", this.props.Login.masterData, this.props.Login.userInfo, addId)}
                                    isComponent={true}
                                    pageable={true}
                                    isActionRequired={true}
                                    isToolBarRequired={true}
                                    scrollable={"scrollable"}
                                    hasDynamicColSize={true}
                                    selectedId={this.props.Login.selectedId}

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
                            : <AddTemplate
                                selectedRecord={this.state.selectedRecord || {}}
                                onInputOnChange={this.onInputOnChange}
                                onComboChange={this.onComboChange}
                                Tag={this.state.Tag || []}
                                EmailTagParameter={this.props.Login.EmailTagParameter || []}
                                onkendoChange={this.onkendoChange}
                                value={this.state.value}

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
                    isOpen: false,  dataState,
                    dataResult: process(this.props.Login.masterData, dataState)

                });
            }
        } else if (this.props.Login.value !== previousProps.Login.value) {
            this.setState({
                value: this.props.Login.selectedRecord["stemplatebody"] ? this.props.Login.selectedRecord["stemplatebody"] : "",
                selectedRecord: this.props.Login.selectedRecord
            });
        }


        else if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord) {
            this.setState({
                selectedRecord: this.props.Login.selectedRecord, value:
                this.props.Login.selectedRecord && this.props.Login.selectedRecord["stemplatebody"] ? this.props.Login.selectedRecord["stemplatebody"] : ""
            });
        }

        if (this.props.Login.Tag !== previousProps.Login.Tag) {

            const Tag = constructOptionList(this.props.Login.Tag || [], "nemailtagcode",
                "stagname", undefined, undefined, undefined);
            const TagList = Tag.get("OptionList");

            this.setState({
                Tag: TagList
            });
        }

    }

    onkendoChange = (event) => {
        this.setState({ value: event.html });
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

    onComboChange = (comboData, fieldName) => {
        if (comboData !== null) {
            const selectedRecord = this.state.selectedRecord || {};
            selectedRecord[fieldName] = comboData;
            selectedRecord["stemplatebody"] = "";
            let Map = {};
            Map["userinfo"] = this.props.Login.userInfo;
            Map["nemailtagcode"] = comboData.value;
            // this.setState({ selectedRecord, value: "" });
            this.props.comboChangeEmailTag(Map, this.props.Login.masterData, selectedRecord, this.state.value);
        }
    }

    deleteRecord = (inputData) => {
        delete inputData.selectedRecord.expanded;
        const inputParam = {
            classUrl: this.props.Login.inputParam.classUrl,
            methodUrl: this.props.Login.inputParam.methodUrl,

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
        let inputData = [];
        inputData["userinfo"] = this.props.Login.userInfo;
        let postParam = undefined;
        const selectedRecord = JSON.parse(JSON.stringify(this.state.selectedRecord));
        if (this.props.Login.operation === "update") {
            // edit
            postParam = { inputListName: "emailtemplate", selectedObject: "selectedEmailTemplate", primaryKeyField: "nemailtemplatecode" }
            inputData["emailtemplate"] = selectedRecord;
            this.fieldList.map(item => {
                return inputData["emailtemplate"][item] = selectedRecord[item] ? selectedRecord[item] : "";
            })
        } else {
            inputData["emailtemplate"] = { "nsitecode": this.props.Login.userInfo.nmastersitecode };
            this.fieldList.map(item => {
                return inputData["emailtemplate"][item] = selectedRecord[item] ? selectedRecord[item] : "";
            });
        }
        inputData["emailtemplate"]["nemailtagcode"] = selectedRecord["nemailtagcode"] ? selectedRecord["nemailtagcode"].value : -1;
        //  inputData["emailtemplate"]["ninterfacetype"] = this.state.selectedRecord["ninterfacetype"] ? this.state.selectedRecord["ninterfacetype"].value : -1;
        inputData["emailtemplate"]["nstatus"] = selectedRecord["nstatus"];
        inputData["emailtemplate"]["stemplatebody"] = this.state.value ? this.state.value : "";
        inputData["emailtemplate"]["nregtypecode"] = selectedRecord["nregtypecode"] ? selectedRecord["nregtypecode"] : -1;
        inputData["emailtemplate"]["nregsubtypecode"] = selectedRecord["nregtypecode"] ? selectedRecord["nregtypecode"] : -1;
        
        const inputParam = {
            classUrl: this.props.Login.inputParam.classUrl,
            methodUrl: this.props.Login.inputParam.methodUrl,
   
            displayName: this.props.Login.inputParam.displayName ? this.props.Login.inputParam.displayName : '',
            inputData: inputData,
            operation: this.props.Login.operation,
            saveType, formRef, postParam, searchRef: this.searchRef
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
        // this.props.crudMaster(inputParam, this.props.Login.masterData,"openModal");
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
export default connect(mapStateToProps, { callService, crudMaster, fetchEmailTemplateById, validateEsignCredential, openEmailTemplateModal, updateStore, comboChangeEmailTag })(injectIntl(EmailTemplate));