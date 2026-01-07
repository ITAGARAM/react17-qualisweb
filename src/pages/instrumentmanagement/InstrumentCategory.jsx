import React from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { process } from '@progress/kendo-data-query';
import DataGrid from '../../components/data-grid/data-grid.component';
import AddInstrumentCategory from './AddInstrumentCategory';
import Esign from '../audittrail/Esign';
import SlideOutModal from '../../components/slide-out-modal/SlideOutModal';
import { ListWrapper } from '../../components/client-group.styles';
import { callService, crudMaster, fetchInstrumentCategoryById, validateEsignCredential, updateStore,addComboService  } from '../../actions';
import { transactionStatus } from '../../components/Enumeration';
import { constructOptionList, getControlMap, showEsign } from '../../components/CommonScript';
import { DEFAULT_RETURN } from '../../actions/LoginTypes';
// import DocViewer from '../../components/doc-viewer/doc-viewer.component'
// import samplePdf from '../../assets/pdf/BatchStudyReport_202100008.pdf';
// import sampleExcel from '../../assets/excel/Export.xlsx';
// import sampleTxt from '../../assets/text/file-sample_100kB.docx';
// import rsapi, { fileViewUrl } from '../../rsapi';
// import samplePng from '../../assets/image/Samplepng.png';

const mapStateToProps = state => {
    return ({ Login: state.Login })
}

class InstrumentCategory extends React.Component {
    constructor(props) {
        super(props);
        this.formRef = React.createRef();
        // this.closeModal = this.closeModal.bind(this);
        this.extractedColumnList = [];
        this.fieldList = [];


        const dataState = {
            skip: 0,
            take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5,
        };
        this.state = {
            //ATE234 Janakumar BGSI-10->Storage Structure → Instrument id & Site combo load based on Setting table.
            enablerequiredstorage: this.props.Login.settings && this.props.Login.settings[84] ? parseInt(this.props.Login.settings[84]) : 4,
            data: [], masterStatus: "", error: "", selectedRecord: {},
            dataResult: [],
            dataState: dataState,
            isOpen: false,
            userRoleControlRights: [],
            Interfacetype: [],
            Technique: [],
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
            dataResult: process(this.props.Login.masterData, event.dataState),
            dataState: event.dataState
        });
    }



    // openModal = (ncontrolCode) => {
    //     return (dispatch) => {
    //         dispatch({type: DEFAULT_RETURN, payload:{selectedRecord : {}, screenName: this.props.Login.screenName,
    //             operation: "create", openModal: true, ncontrolCode}}); 
    //     }
    // };

    // closeModal = () => this.setState({ isOpen: false });

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
                selectedRecord['esignpassword'] = undefined;
                selectedRecord['esigncomments'] = undefined;
                selectedRecord['esignreason'] = undefined;
                ;
            }
        } else {
            openModal = false;
            selectedRecord = {};
            selectedId = null;
        }
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { openModal, loadEsign, selectedRecord, selectedId }
        }
        this.props.updateStore(updateInfo);
    }

    openModal = (screenName, operation, ncontrolcode) => {
        let selectedRecord = {};
        selectedRecord["nstatus"] = transactionStatus.ACTIVE;
        selectedRecord["ninstrumentcatcode"] = 0;
        selectedRecord["ncalibrationreq"] = transactionStatus.NO;
        selectedRecord["ncategorybasedflow"] = transactionStatus.NO;
        selectedRecord["ndefaultstatus"] = transactionStatus.NO;

        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                selectedRecord, openModal: true, operation,
                screenName, ncontrolcode, loading: false
            }
        }
        this.props.updateStore(updateInfo);
    }


    render() {

        let primaryKeyField = "";

        if (this.props.Login.inputParam !== undefined) {

            this.extractedColumnList = [
                { "controlType": "textbox", "idsName": "IDS_INSTRUMENTCATEGORY", "dataField": "sinstrumentcatname", "width": "200px" },
                { "controlType": "checkbox", "idsName": "IDS_CATEGORYBASEDFLOW", "dataField": "scategorybasedflow", "width": "200px", "controlName": "ncategorybasedflow" },
                { "controlType": "checkbox", "idsName": "IDS_CALIBRATIONREQUIRED", "dataField": "scalibrationrequired", "width": "200px", "controlName": "ncalibrationreq" },
                { "controlType": "selectbox", "idsName": "IDS_INSTRUMENTTYPE", "dataField": "sinstrumenttype", "width": "200px" },

                { "controlType": "checkbox", "idsName": "IDS_DEFAULTSTATUS", "dataField": "sdisplaystatus", "width": "200px", "controlName": "ndefaultstatus" },
            ]
            //ATE234 Janakumar BGSI-10->Storage Structure → Instrument id & Site combo load based on Setting table.
        //    this.state.enablerequiredstorage && this.state.enablerequiredstorage === transactionStatus.YES &&
        //         this.extractedColumnList.push({ "controlType": "checkbox", "idsName": "IDS_STORAGETYPE", "dataField": "srequiredstorage", "width": "200px", "controlName": "nrequiredstorage" });


            this.extractedFormList = [

            ]
            this.detailedFieldList = [
                // { "idsName": "IDS_TECHNIQUE", "dataField": "stechniquename", "width": "300px" },
                // { "idsName": "IDS_INTERFACETYPE", "dataField": "sinterfacetypename", "width": "250px" },
                { "idsName": "IDS_DESCRIPTION", "dataField": "sdescription", "width": "250px" }

            ];



            primaryKeyField = "ninstrumentcatcode";
            this.fieldList = ["sinstrumentcatname", "sdescription", "ntechniquecode", "ninterfacetypecode", "ncalibrationreq", "ncategorybasedflow", "ndefaultstatus"];
        }

        const mandatoryFields = [{ "mandatory": true, "idsName": "IDS_INSTRUMENTCATEGORY", "dataField": "sinstrumentcatname", "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
            //  { "mandatory": true, "idsName": "IDS_TECHNIQUE", "dataField": "ntechniquecode"  , "mandatoryLabel":"IDS_SELECT", "controlType": "selectbox"},
            // { "mandatory": true, "idsName": "IDS_INTERFACETYPE", "dataField": "ninterfacetypecode" , "mandatoryLabel":"IDS_SELECT", "controlType": "selectbox" },
            { "mandatory": true, "idsName": "IDS_INSTRUMENTTYPE", "dataField": "ninstrumenttypecode" , "mandatoryLabel":"IDS_SELECT", "controlType": "selectbox" },

        ];

        const addId = this.props.Login.inputParam && this.state.controlMap.has("Add".concat(this.props.Login.inputParam.methodUrl))
            && this.state.controlMap.get("Add".concat(this.props.Login.inputParam.methodUrl)).ncontrolcode;

        const editID = this.props.Login.inputParam && this.state.controlMap.has("Edit".concat(this.props.Login.inputParam.methodUrl))
            && this.state.controlMap.get("Edit".concat(this.props.Login.inputParam.methodUrl)).ncontrolcode;

        const editParam = {
            screenName: this.props.Login.inputParam && this.props.Login.inputParam.displayName && this.props.intl.formatMessage({ id: this.props.Login.inputParam.displayName }), primaryKeyField: "ninstrumentcatcode", operation: "update",
            inputParam: this.props.Login.inputParam, userInfo: this.props.Login.userInfo, ncontrolCode: editID
        };

        //ALPDJ21-31-->Added by Vignesh(23-07-2025)-->Added the new dropdown Instrument Type-Standard, Storage
        const addParam = { screenName: this.props.Login.inputParam && this.props.Login.inputParam.displayName && this.props.intl.formatMessage({ id: this.props.Login.inputParam.displayName }), 
                            primaryKeyField: "ninstrumentcatcode", 
                            operation: "create",
                            userInfo: this.props.Login.userInfo,
                            ncontrolCode: addId };

        const deleteParam = { operation: "delete" };

        return (
            <>
                <Row>
                    <Col>
                        <ListWrapper className="client-list-content">

                            {/* <DocViewer file={samplePdf} type={"pdf"}></DocViewer> */}
                            {/* <DocViewer file={sampleExcel} type={"xlsx"} isDownloadable={true}></DocViewer>
                            <DocViewer file={sampleTxt} type={"docx"}></DocViewer>
                            <DocViewer file={fileViewUrl() + '//SharedFolder//UserProfile//83b8bc7b-6d43-41f2-bc6c-90e1a93733334'} type={"png"}></DocViewer>  */}
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
                                    //formatMessage={this.props.intl.formatMessage}
                                    controlMap={this.state.controlMap}
                                    userRoleControlRights={this.state.userRoleControlRights}
                                    inputParam={this.props.Login.inputParam}
                                    userInfo={this.props.Login.userInfo}
                                    fetchRecord={this.props.fetchInstrumentCategoryById}
                                    deleteRecord={this.deleteRecord}
                                    reloadData={this.reloadData}
                                    editParam={editParam}
                                    deleteParam={deleteParam}
                                    // addRecord={() => this.props.openInstrumentCategoryModal("IDS_INSTRUMENTCATEGORY", "create", 
                                    // "ninstrumentcatcode", this.props.Login.masterData, this.props.Login.userInfo, addId)}
                                    // isComponent={true}
                                   // addRecord={() => this.openModal("IDS_INSTRUMENTCATEGORY", "create", addId)}
                                   
                                   //ALPDJ21-31-->Added by Vignesh(23-07-2025)-->Added the new dropdown Instrument Type-Standard, Storage
                                    addRecord={() => this.props.addComboService(addParam)}
                                    pageable={true}
                                    isActionRequired={true}
                                    isToolBarRequired={true}
                                    //isDownloadPDFRequired={true}
                                    scrollable={"scrollable"}
                                    selectedId={this.props.Login.selectedId}
                                    gridHeight={'600px'}

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
                            : <AddInstrumentCategory
                                selectedRecord={this.state.selectedRecord || {}}
                                onInputOnChange={this.onInputOnChange}
                                enablerequiredstorage={this.state.enablerequiredstorage}
                                instrumentType={this.props.Login.instrumentType}
                            //ATE234 Janakumar BGSI-10->Storage Structure → Instrument id & Site combo load based on Setting table.
                             onComboChange={this.onComboChange}
                            // Technique={this.state.Technique || []}
                            //  Interfacetype={this.state.Interfacetype || []}

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
                    selectedRecord: this.props.Login.selectedRecord
                    //selectedRecord:{ncalibrationreq:transactionStatus.NO,ncategorybasedflow:transactionStatus.NO,ndefaultstatus:transactionStatus.NO}
                });
            }
        } else if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord) {
            this.setState({ selectedRecord: this.props.Login.selectedRecord });
        }
        // if (this.props.Login.Interfacetype !== previousProps.Login.Interfacetype) {

        //     const Technique = constructOptionList(this.props.Login.Technique || [], "ntechniquecode",
        //         "stechniquename", undefined, undefined, undefined);
        //     const TechniqueList = Technique.get("OptionList");

        //     const Interfacetype = constructOptionList(this.props.Login.Interfacetype || [], "ninterfacetypecode",
        //         "sinterfacetypename", undefined, undefined, undefined);
        //     const InterfacetypeList = Interfacetype.get("OptionList");

        //     this.setState({ Technique: TechniqueList, Interfacetype: InterfacetypeList });
        // }
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
        const selectedRecord = this.state.selectedRecord || {};
        if (comboData !== null) {
            selectedRecord[fieldName] = comboData;
            this.setState({ selectedRecord });
        }
        // else
        // {
        //    if(selectedRecord["ntechniquecode"]) {
        //     delete selectedRecord["ntechniquecode"];
        //     this.setState({ selectedRecord });

        //    }
        // }

    }
    deleteRecord = (inputData) => {
        if (inputData.selectedRecord.expanded !== undefined) {
            delete inputData.selectedRecord.expanded
        }
        const inputParam = {
            classUrl: this.props.Login.inputParam.classUrl,
            methodUrl: this.props.Login.inputParam.methodUrl,

            inputData: {
                [this.props.Login.inputParam.methodUrl.toLowerCase()]: inputData.selectedRecord,
                "userinfo": this.props.Login.userInfo
            },
            operation: inputData.operation,
            displayName: this.props.Login.inputParam.displayName,
            dataState: this.state.dataState,
            selectedRecord: { ...this.state.selectedRecord }
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
        let selectedId = null;
        if (this.props.Login.operation === "update") {
            // edit
            postParam = { inputListName: "instrumentcategory", selectedObject: "selectedInstrumentCategory", primaryKeyField: "ninstrumentcatcode" }
            // inputData["instrumentcategory"] = this.state.selectedRecord;
            inputData[this.props.Login.inputParam.methodUrl.toLowerCase()] = JSON.parse(JSON.stringify(this.state.selectedRecord));
            selectedId = this.props.Login.selectedRecord.ninstrumentcatcode;
            //this.fieldList.map(item => {
            //   return inputData["instrumentcategory"][item] = this.state.selectedRecord[item] ? this.state.selectedRecord[item] : "";
            //  })
        } else {
            inputData["instrumentcategory"] = { "nsitecode": this.props.Login.userInfo.nmastersitecode };
            // this.fieldList.map(item => {
            //    return inputData["instrumentcategory"][item] = this.state.selectedRecord[item]
            //  });
        }
        //inputData["instrumentcategory"]["ninstrumentcatcode"] = this.state.selectedRecord["ninstrumentcatcode"]? this.state.selectedRecord["ninstrumentcatcode"]:0;
        inputData["instrumentcategory"]["sinstrumentcatname"] = this.state.selectedRecord.sinstrumentcatname ? this.state.selectedRecord.sinstrumentcatname : "";
        inputData["instrumentcategory"]["sdescription"] = this.state.selectedRecord["sdescription"] ? this.state.selectedRecord["sdescription"] : "";
        // inputData["instrumentcategory"]["ntechniquecode"] = this.state.selectedRecord["ntechniquecode"] ? this.state.selectedRecord["ntechniquecode"].value : -1;
        //  inputData["instrumentcategory"]["ninterfacetypecode"] = this.state.selectedRecord["ninterfacetypecode"] ? this.state.selectedRecord["ninterfacetypecode"].value : -1;
        inputData["instrumentcategory"]["nstatus"] = this.state.selectedRecord["nstatus"];
        inputData["instrumentcategory"]["ndefaultstatus"] = this.state.selectedRecord["ndefaultstatus"] ? this.state.selectedRecord["ndefaultstatus"] : transactionStatus.NO;
        inputData["instrumentcategory"]["ncategorybasedflow"] = this.state.selectedRecord["ncategorybasedflow"] ? this.state.selectedRecord["ncategorybasedflow"] : transactionStatus.NO;
        inputData["instrumentcategory"]["ncalibrationreq"] = this.state.selectedRecord["ncalibrationreq"] ? this.state.selectedRecord["ncalibrationreq"] : transactionStatus.NO;
        inputData["instrumentcategory"]["nrequiredstorage"] = this.state.selectedRecord["nrequiredstorage"] ? this.state.selectedRecord["nrequiredstorage"] : transactionStatus.NO;
        inputData["instrumentcategory"]["ninstrumenttypecode"] = this.state.selectedRecord["ninstrumenttypecode"] ? this.state.selectedRecord["ninstrumenttypecode"].value : transactionStatus.NAL;


        let clearSelectedRecordField = [
            { "idsName": "IDS_INSTRUMENTCATEGORY", "dataField": "sinstrumentcatname", "width": "200px", "controlType": "textbox", "isClearField": true },
            { "idsName": "IDS_DESCRIPTION", "dataField": "sdescription", "width": "200px", "controlType": "textbox", "isClearField": true },
            { "idsName": "IDS_CATEGORYBASEDFLOW", "dataField": "ncategorybasedflow", "width": "100px", "isClearField": true, "preSetValue": 4 },
            { "idsName": "IDS_CALIBRATIONREQUIRED", "dataField": "ncalibrationreq", "width": "100px", "isClearField": true, "preSetValue": 4 },
            { "idsName": "IDS_DEFAULTSTATUS", "dataField": "ndefaultstatus", "width": "100px", "isClearField": true, "preSetValue": 4 },
            { "idsName": "IDS_STORAGECATEGORY", "dataField": "v", "width": "100px", "isClearField": true, "preSetValue": 4 },

        ]

        const inputParam = {
            classUrl: this.props.Login.inputParam.classUrl,
            methodUrl: this.props.Login.inputParam.methodUrl,
            displayName: this.props.Login.inputParam.displayName ? this.props.Login.inputParam.displayName : '',
            inputData: inputData,
            selectedRecord: { ...this.state.selectedRecord },
            operation: this.props.Login.operation,
            saveType, formRef, postParam, searchRef: this.searchRef, selectedId
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

            this.props.crudMaster(inputParam, masterData, "openModal", "", "", clearSelectedRecordField);
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
                    nreasoncode: this.state.selectedRecord["esignreason"] && this.state.selectedRecord["esignreason"].value,
                    spredefinedreason: this.state.selectedRecord["esignreason"] && this.state.selectedRecord["esignreason"].label,

                },
                password: this.state.selectedRecord["esignpassword"]
            },
            screenData: this.props.Login.screenData
        }
        this.props.validateEsignCredential(inputParam, "openModal");
    }

}
export default connect(mapStateToProps, { callService, crudMaster, addComboService ,fetchInstrumentCategoryById, validateEsignCredential, updateStore })(injectIntl(InstrumentCategory));