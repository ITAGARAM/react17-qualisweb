import { process } from '@progress/kendo-data-query';
import React from 'react'
import SlideOutModal from '../../components/slide-out-modal/SlideOutModal';
import { projectytpe, getSampleType, getActiveSampleProcessTypeById } from '../../actions';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { DEFAULT_RETURN } from '../../actions/LoginTypes';
import { showEsign, getControlMap, Lims_JSON_stringify } from
    '../../components/CommonScript';
import { ListWrapper } from '../../components/client-group.styles';
import DataGrid from '../../components/data-grid/data-grid.component';
import Esign from '../audittrail/Esign';
import AddSampleProcessType from './AddSampleProcessType';
import { callService, updateStore, crudMaster, validateEsignCredential } from '../../actions';
import { toast } from 'react-toastify';




const mapStateToProps = state => {
    return ({ Login: state.Login })
}

class SampleProcessType extends React.Component {

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



    reloadData = () => {
        const inputParam = {
            inputData: { "userinfo": this.props.Login.userInfo },
            classUrl: this.props.Login.inputParam.classUrl,
            methodUrl: this.props.Login.inputParam.methodUrl,
            userInfo: this.props.Login.userInfo,
            displayName: this.props.Login.displayName
        };

        this.props.callService(inputParam);
    }



    render() {
        let primaryKeyField = "";

        if (this.props.Login.inputParam !== undefined) {

            this.extractedColumnList = [
                { "mandatory": true, "idsName": "IDS_PROJECTTYPE", "dataField": "sprojecttypename", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
                { "mandatory": true, "idsName": "IDS_SAMPLETYPE", "dataField": "sproductname", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
                { "mandatory": true, "idsName": "IDS_COLLECTIONTUBETYPEPROCESSTYPE", "dataField": "stubename", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox", "width": 180 },
                { "mandatory": true, "idsName": "IDS_PROCESSTYPENAME", "dataField": "sprocesstypename", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
                { "mandatory": true, "idsName": "IDS_PROCESSTIME", "dataField": "nprocesstimeresult", "mandatoryLabel": "IDS_ENTER", "controlType": "selectbox" },
                { "mandatory": true, "idsName": "IDS_GRACETIME", "dataField": "ngracetimeresult", "mandatoryLabel": "IDS_ENTER", "controlType": "selectbox" },
                { "mandatory": true, "idsName": "IDS_EXECTIONORDER", "dataField": "nexecutionorder", "mandatoryLabel": "IDS_ENTER", "controlType": "selectbox" },
                { "mandatory": true, "idsName": "IDS_DESCRIPTION", "dataField": "sdescription", "mandatoryLabel": "IDS_ENTER", "controlType": "selectbox" },

            ]

            primaryKeyField = "nsampleprocesstypecode";
        }
        let mandatoryFields = [];
        mandatoryFields.push(
            { "mandatory": true, "idsName": "IDS_PROJECTTYPE", "dataField": "sprojecttypename", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
            { "mandatory": true, "idsName": "IDS_SAMPLETYPE", "dataField": "sproductname", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
            { "mandatory": true, "idsName": "IDS_COLLECTIONTUBETYPEPROCESSTYPE", "dataField": "stubename", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
            { "mandatory": true, "idsName": "IDS_PROCESSTYPENAME", "dataField": "sprocesstypename", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
            { "mandatory": true, "idsName": "IDS_PROCESSTIME", "dataField": "processtime", "mandatoryLabel": "IDS_ENTER", "controlType": "selectbox" },
            { "mandatory": true, "idsName": "IDS_GRACETIME", "dataField": "gracetime", "mandatoryLabel": "IDS_ENTER", "controlType": "selectbox" },
            { "mandatory": true, "idsName": "IDS_EXECTIONORDER", "dataField": "executionorder", "mandatoryLabel": "IDS_ENTER", "controlType": "selectbox" },
            { "mandatory": true, "idsName": "IDS_PROCESSPERIODTIME", "dataField": "processperiodtime", "mandatoryLabel": "IDS_ENTER", "controlType": "selectbox" },
            { "mandatory": true, "idsName": "IDS_GRACEPERIODTIME", "dataField": "graceperiodtime", "mandatoryLabel": "IDS_ENTER", "controlType": "selectbox" },


        )


        const addsampleprocesstypeId = this.state.controlMap.has("AddSampleProcessType") && this.state.controlMap.get("AddSampleProcessType").ncontrolcode;
        const editsampleprocesstypeId = this.state.controlMap.has("EditSampleProcessType") && this.state.controlMap.get("EditSampleProcessType").ncontrolcode;
        const deletesampleprocesstypeId = this.state.controlMap.has("DeleteSampleProcessType") && this.state.controlMap.get("DeleteSampleProcessType").ncontrolcode;


        const editParam = {
            screenName: this.props.Login.inputParam && this.props.Login.inputParam.displayName && this.props.intl.formatMessage({ id: this.props.Login.inputParam.displayName }), primaryKeyField: "nsampleprocesstypecode", operation: "update",
            inputParam: this.props.Login.inputParam, userInfo: this.props.Login.userInfo,
            ncontrolCode: editsampleprocesstypeId
        };

        const deleteParam = { operation: "delete" };

        return (<>

            <ListWrapper className="client-list-content">


                <DataGrid
                    primaryKeyField={primaryKeyField}
                    selectedId={this.props.Login.selectedId}
                    data={this.state.data}
                    dataResult={this.state.dataResult || []}
                    dataState={this.state.dataState}
                    dataStateChange={this.dataStateChange}
                    extractedColumnList={this.extractedColumnList}
                    controlMap={this.state.controlMap}
                    userRoleControlRights={this.state.userRoleControlRights}
                    inputParam={this.props.Login.inputParam}
                    userInfo={this.props.Login.userInfo}
                    fetchRecord={this.props.getActiveSampleProcessTypeById}
                    addRecord={() => this.props.projectytpe(addsampleprocesstypeId, this.props.Login.userInfo) || []}
                    deleteRecord={this.deleteRecord}
                    reloadData={this.reloadData}
                    editParam={editParam}
                    deleteParam={deleteParam}
                    scrollable={"scrollable"}
                    gridHeight={"600px"}
                    isActionRequired={true}
                    isToolBarRequired={true}
                    pageable={true}
                    groupable={false}
                    //ATE234 Janakumar ALPD-5577 Sample Storage-->while download the pdf, screen getting freezed
                    isDownloadPDFRequired={false}
                    isDownloadExcelRequired={true}
                />

            </ListWrapper>

            {this.props.Login.openModal &&
                <SlideOutModal
                    show={this.props.Login.openModal}
                    closeModal={this.closeModal}
                    operation={this.props.Login.operation}
                    inputParam={this.props.Login.inputParam}
                    screenName={this.props.Login.screenName}
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
                        : <AddSampleProcessType
                            selectedRecord={this.state.selectedRecord || {}}
                            onInputOnChange={this.onInputOnChange}
                            onComboChange={this.onComboChange}
                            projecttypeList={this.state.projecttypeList || []}
                            sampletypeList={this.state.sampletypeList || []}
                            collectiontubeList={this.state.collectiontubeList || []}
                            processtypeList={this.state.processtypeList || []}
                            periodList={this.state.periodList || []}
                            inputParam={this.props.Login.inputParam}
                            actionType={this.state.actionType}
                            operation={this.props.Login.operation}
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
                //ALPD-4699Sample Process mapping-->While try to delete the already used records in other Modules alert validation captured Wrongly " This Record is Used in Storage Sample Processing""

                let { dataState } = this.state;
                if (dataState === undefined) {
                    dataState = { skip: 0, take: this.state.dataState.take }
                }
                if (this.state.dataResult.data) {
                    //if(this.state.dataResult.data.length >0 && this.props.Login.operation !=='update' && this.props.Login.operation ==='create'){
                    if (this.state.dataResult.data.length === 1) {
                        //let skipcount=this.state.dataState.skip>0?(this.props.Login.masterData.length-this.state.dataState.take):
                        let skipcount = this.state.dataState.skip > 0 ? (this.state.dataState.skip - this.state.dataState.take) :
                            this.state.dataState.skip
                        dataState = { skip: skipcount, take: this.state.dataState.take }
                    }
                }

                this.setState({
                    data: this.props.Login.masterData,
                    isOpen: false,
                    selectedRecord: this.props.Login.selectedRecord,
                    dataResult: process(this.props.Login.masterData, dataState),
                    dataState
                });


                //     let { dataState } = this.state;
                // if (this.props.Login.dataState === undefined) {
                //     dataState = { skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5 }
                // }

                // this.setState({
                //     data: this.props.Login.masterData,
                //     isOpen: false,
                //     selectedRecord: this.props.Login.selectedRecord,
                //     dataResult: process(this.props.Login.masterData, dataState),
                //     dataState
                // });
            }
        } else if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord) {
            this.setState({ selectedRecord: this.props.Login.selectedRecord });
        }

        if (this.props.Login.projecttypeList !== previousProps.Login.projecttypeList) {
            this.setState({ projecttypeList: this.props.Login.projecttypeList });
        }

        if (this.props.Login.sampletypeList !== previousProps.Login.sampletypeList) {
            this.setState({ sampletypeList: this.props.Login.sampletypeList });
        }

        if (this.props.Login.collectiontubeList !== previousProps.Login.collectiontubeList) {
            this.setState({ collectiontubeList: this.props.Login.collectiontubeList });
        }

        if (this.props.Login.processtypeList !== previousProps.Login.processtypeList) {
            this.setState({ processtypeList: this.props.Login.processtypeList });
        }

        if (this.props.Login.periodList !== previousProps.Login.periodList) {
            this.setState({ periodList: this.props.Login.periodList });
        }

    }


    onComboChange = (comboData, fieldName) => {

        const selectedRecord = this.state.selectedRecord || {};


        if (fieldName === "sprojecttypename") {
            selectedRecord[fieldName] = comboData;

            delete selectedRecord["sproductname"];
            delete selectedRecord["stubename"];
            delete selectedRecord["sprocesstypename"];

            this.props.getSampleType(
                this.state.selectedRecord.sprojecttypename.value,
                this.state.selectedRecord.sprojecttypename.label,
                this.props.Login.userInfo,
            )
        }
        else {
            selectedRecord[fieldName] = comboData;
            this.setState({ selectedRecord });
        }

    }


    onInputOnChange = (event, fieldName) => {

        const selectedRecord = this.state.selectedRecord || {};

        const values = event.target.value;

        let parsedvalues;

        parsedvalues = parseInt(values, 10);

        if (fieldName === "processtime" || fieldName === "gracetime") {

            if (/^\d*?$/.test(values) && values !== "") {

                selectedRecord[fieldName] = parsedvalues;
            } else {
                selectedRecord[fieldName] = [];
            }

        } else if (fieldName === "executionorder") {

            if (/^\d*?$/.test(values) && values !== "") {

                selectedRecord[fieldName] = parsedvalues;
            } else {
                selectedRecord[fieldName] = [];
            }


        } else {
            selectedRecord[event.target.name] = event.target.value;
        }

        this.setState({ selectedRecord });
    }


    closeModal = () => {
        let loadEsign = this.props.Login.loadEsign;
        let openModal = this.props.Login.openModal;
        let selectedRecord = this.props.Login.selectedRecord;
        let controlButton = this.props.Login.controlButton;
        let selectedId = this.props.Login.selectedId;
        // let processtypeList;
        // let projecttypeList;
        // let sampletypeList;
        // let collectiontubeList;

        if (this.props.Login.loadEsign) {
            if (this.props.Login.operation === "delete") {
                loadEsign = false;
                openModal = false;
                selectedRecord = {};

            }
            else {
                loadEsign = false;
                selectedRecord['esignpassword'] = ""
                selectedRecord['esignreason'] = ""
                selectedRecord['esigncomments'] = ""
            }
        }
        else {
            openModal = false;
            selectedRecord = {};
            controlButton = [];
            // processtypeList = [];
            // projecttypeList = [];
            // sampletypeList = [];
            // collectiontubeList = [];

        }
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                openModal, loadEsign, selectedRecord, selectedId, controlButton
            }
        }
        this.props.updateStore(updateInfo);

        //ate234 janakumar ALPD-5065 Aliquot Plan-->While doing Edit ,the dropdown records are not Showing.
        //this.setState({ selectedRecord: selectedRecord, processtypeList: processtypeList, projecttypeList: projecttypeList, sampletypeList: sampletypeList, collectiontubeList: collectiontubeList });


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


    onSaveClick = (saveType, formRef) => {
        if (this.props.Login.operation === "create") {
            this.onSaveSampleProcessType(saveType, formRef);
        } else if (this.props.Login.operation === "update") {
            this.updateSampleProcessType(saveType, formRef);
        }



    }


    onSaveSampleProcessType = (saveType, formRef) => {


        let selectedRecord = this.state.selectedRecord;

        if (selectedRecord !== undefined) {

            const inputParam = {
                nformcode: this.props.Login.userInfo.nformcode,
                classUrl: "sampleprocesstype",
                methodUrl: "SampleProcessType",
                inputData: {
                    userinfo: {
                        ...this.props.Login.userInfo,
                        sformname: Lims_JSON_stringify(this.props.Login.userInfo.sformname),
                        smodulename: Lims_JSON_stringify(this.props.Login.userInfo.smodulename),
                    },

                    ncontrolCode: this.props.Login.userInfo.nformcode,
                    tubename: this.state.selectedRecord.stubename.label,
                    tubevalue: this.state.selectedRecord.stubename.value,
                    projecttypename: this.state.selectedRecord.sprojecttypename.label,
                    projecttypevalue: this.state.selectedRecord.sprojecttypename.value,
                    productname: this.state.selectedRecord.sproductname.label,
                    productvalue: this.state.selectedRecord.sproductname.value,
                    processtypename: this.state.selectedRecord.sprocesstypename.label,
                    processtypevalue: this.state.selectedRecord.sprocesstypename.value,
                    processtime: this.state.selectedRecord.processtime,
                    processperiodtime: this.state.selectedRecord.processperiodtime.value,
                    graceperiodtime: this.state.selectedRecord.graceperiodtime.value,
                    gracetime: this.state.selectedRecord.gracetime,
                    executionorder: this.state.selectedRecord.executionorder,
                    sdescription: this.state.selectedRecord.sdescription,
                    commonPeriod: this.state.selectedRecord.graceperiodtime.label,

                    operation: "create",


                },
                operation: "create",
                saveType, formRef,
            }

            const masterData = this.props.Login.masterData;


            this.props.crudMaster(inputParam, masterData, "openModal");

        }

    }

    updateSampleProcessType = (saveType, formRef) => {


        const inputParam = {
            nformcode: this.props.Login.userInfo.nformcode,
            classUrl: "sampleprocesstype",
            methodUrl: "SampleProcessType",
            selectedRecord: { ...this.state.selectedRecord },
            selectedId: this.state.selectedRecord.nsampleprocesstypecode,
            inputData: {
                userinfo: {
                    ...this.props.Login.userInfo,
                    sformname: Lims_JSON_stringify(this.props.Login.userInfo.sformname),
                    smodulename: Lims_JSON_stringify(this.props.Login.userInfo.smodulename),
                },

                ncontrolCode: this.props.Login.userInfo.nformcode,
                nsampleprocesstypecode: this.state.selectedRecord.nsampleprocesstypecode,
                tubename: this.state.selectedRecord.stubename.label,
                tubevalue: this.state.selectedRecord.stubename.value,
                projecttypename: this.state.selectedRecord.sprojecttypename.label,
                projecttypevalue: this.state.selectedRecord.sprojecttypename.value,
                productname: this.state.selectedRecord.sproductname.label,
                productvalue: this.state.selectedRecord.sproductname.value,
                processtypename: this.state.selectedRecord.sprocesstypename.label,
                processtypevalue: this.state.selectedRecord.sprocesstypename.value,
                processtime: this.state.selectedRecord.processtime,
                gracetime: this.state.selectedRecord.gracetime,
                executionorder: this.state.selectedRecord.executionorder,
                sdescription: this.state.selectedRecord.sdescription,
                commonPeriod: this.state.selectedRecord.graceperiodtime.label,
                operation: "update",


            },
            operation: "update",
            saveType, formRef,
        }

        const masterData = this.props.Login.masterData;

        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolCode)) {
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
            classUrl: this.props.Login.inputParam.classUrl,
            methodUrl: this.props.Login.inputParam.methodUrl,
            displayName: this.props.Login.inputParam.displayName,
            inputData: {
                [this.props.Login.inputParam.methodUrl.toLowerCase()]: deleteParam.selectedRecord,//.dataItem,
                "userinfo": this.props.Login.userInfo
            },
            operation: deleteParam.operation,
            dataState: this.state.dataState,
            selectedRecord: deleteParam.selectedRecord
        }

        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, deleteParam.ncontrolCode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData: this.props.Login.masterData },
                    openModal: true, screenName: this.props.intl.formatMessage({ id: this.props.Login.displayName }),
                    operation: deleteParam.operation
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.crudMaster(inputParam, this.props.Login.masterData, "openModal");
        }
    }




}
export default connect(mapStateToProps, {
    updateStore, callService, crudMaster, validateEsignCredential,
    projectytpe, getSampleType, getActiveSampleProcessTypeById
})(injectIntl(SampleProcessType));
