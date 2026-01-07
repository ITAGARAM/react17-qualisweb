import { process } from '@progress/kendo-data-query';
import React from 'react'
import SlideOutModal from '../../components/slide-out-modal/SlideOutModal';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { DEFAULT_RETURN } from '../../actions/LoginTypes';
import { showEsign, getControlMap, Lims_JSON_stringify} from
    '../../components/CommonScript';
import { Col, Row } from 'react-bootstrap';
import { ListWrapper } from '../../components/client-group.styles';
import DataGrid from '../../components/data-grid/data-grid.component';
import Esign from '../audittrail/Esign';
import AddAliquotPlan from './AddAliquotPlan';
import { callService, updateStore, crudMaster, validateEsignCredential } from '../../actions';
import { toast } from 'react-toastify';
import { getprojectytpe, getSampleTypeandPatientCatgeroy, getUnit, getActiveAliquotPlanById } from '../../actions';




const mapStateToProps = state => {
    return ({ Login: state.Login })
}

class AliquotPlan extends React.Component {

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
            displayName: this.props.Login.displayName,
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
                { "mandatory": true, "idsName": "IDS_VISITNUMBER", "dataField": "svisitnumber", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
                { "mandatory": true, "idsName": "IDS_PATIENTCATEGORY", "dataField": "spatientcatname", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox", "width": 180 },
                // ALPD-5513 - added by Gowtham R on 10/3/25 - added sample donor field from sampledonor table
                { "mandatory": true, "idsName": "IDS_SAMPLEDONOR", "dataField": "ssampledonor", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
                { "mandatory": true, "idsName": "IDS_ALIQUOTNO", "dataField": "saliquotno", "mandatoryLabel": "IDS_ENTER", "controlType": "selectbox" },
                { "mandatory": true, "idsName": "IDS_QUANTITY", "dataField": "squantity", "mandatoryLabel": "IDS_ENTER", "controlType": "selectbox" },
                { "mandatory": true, "idsName": "IDS_UNIT", "dataField": "sunitname", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
                { "mandatory": true, "idsName": "IDS_DESCRIPTION", "dataField": "sdescription", "mandatoryLabel": "IDS_ENTER", "controlType": "selectbox" },

            ]

            primaryKeyField = "naliquotplancode";
        }
        let mandatoryFields = [];
        mandatoryFields.push(
            { "mandatory": true, "idsName": "IDS_PROJECTTYPE", "dataField": "sprojecttypename", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
            { "mandatory": true, "idsName": "IDS_SAMPLETYPE", "dataField": "sproductname", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
            { "mandatory": true, "idsName": "IDS_COLLECTIONTUBETYPEPROCESSTYPE", "dataField": "stubename", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
            { "mandatory": true, "idsName": "IDS_VISITNUMBER", "dataField": "svisitnumber", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
            { "mandatory": true, "idsName": "IDS_PATIENTCATEGORY", "dataField": "spatientcatname", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
            { "mandatory": true, "idsName": "IDS_ALIQUOTNO", "dataField": "saliquotno", "mandatoryLabel": "IDS_ENTER", "controlType": "selectbox" },
            //ALPD-4712--Vignesh R(21-08-2024)
            { "mandatory": true, "idsName": "IDS_QUANTITY", "dataField": "squantity", "mandatoryLabel": "IDS_ENTER", "controlType": "selectbox" },
            { "mandatory": true, "idsName": "IDS_UNIT", "dataField": "sunitname", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
            // ALPD-5513 - added by Gowtham R on 10/3/25 - added sample donor field from sampledonor table
            { "mandatory": true, "idsName": "IDS_SAMPLEDONOR", "dataField": "ssampledonor", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" }

        )


        const AddAliquotPlanId = this.state.controlMap.has("AddAliquotPlan") && this.state.controlMap.get("AddAliquotPlan").ncontrolcode;
        const EditAliquotPlanId = this.state.controlMap.has("EditAliquotPlan") && this.state.controlMap.get("EditAliquotPlan").ncontrolcode;
        const DeleteAliquotPlanId = this.state.controlMap.has("DeleteAliquotPlan") && this.state.controlMap.get("DeleteAliquotPlan").ncontrolcode;


        const editParam = {
            screenName: this.props.Login.inputParam && this.props.Login.inputParam.displayName && this.props.intl.formatMessage({ id: this.props.Login.inputParam.displayName }), primaryKeyField: "naliquotplancode", operation: "update",
            inputParam: this.props.Login.inputParam, userInfo: this.props.Login.userInfo,
            ncontrolCode: EditAliquotPlanId
        };

        const deleteParam = { operation: "delete", DeleteAliquotPlanId: DeleteAliquotPlanId };

        return (<>
            <Row>
                <Col>
                    <ListWrapper className="client-list-content">

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
                            fetchRecord={this.props.getActiveAliquotPlanById}
                            addRecord={() => this.props.getprojectytpe(AddAliquotPlanId, this.props.Login.userInfo) || []}
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
                        : <AddAliquotPlan
                            selectedRecord={this.state.selectedRecord || {}}
                            onInputOnChange={this.onInputOnChange}
                            onComboChange={this.onComboChange}
                            renalCheck={this.state.renalCheck}
                            donarCheck={this.state.donarCheck} // ALPD-5513 - added by Gowtham R on 10/3/25 - added sample donor field from sampledonor table
                            projecttypeList={this.state.projecttypeList || []}
                            sampletypeList={this.state.sampletypeList || []}
                            collectiontubeList={this.state.collectiontubeList || []}
                            patientcatgoryList={this.state.patientcatgoryList || []}
                            visitnameList={this.state.visitnameList || []}
                            unitList={this.state.unitList || []}
                            sampledonarList={this.state.sampledonarList || []} // ALPD-5513 - added by Gowtham R on 10/3/25 - added sample donor field from sampledonor table
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
                let {dataState}=this.state;
                if(this.props.Login.dataState===undefined){//Gtm
                    dataState={skip:0,take:this.state.dataState.take}
                }
                if(this.state.dataResult.data){
                    if(this.state.dataResult.data.length ===1 && this.props.Login.operation ==='delete'){  //&& this.props.Login.operation !=='update' && this.props.Login.operation ==='create'
                       let skipcount=this.state.dataState.skip>0?(this.props.Login.masterData.length-this.state.dataState.take):
                       this.state.dataState.skip
                        dataState={skip:skipcount,take:this.state.dataState.take}
                    }
                } 

                this.setState({
                    data: this.props.Login.masterData,
                    isOpen: false,
                    selectedRecord: this.props.Login.selectedRecord,
                    dataResult: process(this.props.Login.masterData, dataState),
                    dataState
                });
            }
            // let { dataState } = this.state;
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

        } else if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord) {
            this.setState({ selectedRecord: this.props.Login.selectedRecord });
        }

        if (this.props.Login.projecttypeList !== previousProps.Login.projecttypeList) {
            this.setState({ projecttypeList: this.props.Login.projecttypeList });
        }

        if (this.props.Login.sampletypeList !== previousProps.Login.sampletypeList) {
            this.setState({ sampletypeList: this.props.Login.sampletypeList });
        }

        if (this.props.Login.patientcatgoryList !== previousProps.Login.patientcatgoryList) {

            let selectedRecord = this.props.Login.selectedRecord;
            let renalCheck = false;
            if (this.props.Login.patientcatgoryList.length > 0) {
                renalCheck = true;
                if (this.props.Login.operation !== 'update') {
                    selectedRecord["spatientcatname"] = [];
                }

            } else {
                selectedRecord["spatientcatname"] = { value: -1 };
                renalCheck = false;   //, selectedRecord: selectedRecord
            }
            this.setState({ patientcatgoryList: this.props.Login.patientcatgoryList, renalCheck: renalCheck, selectedRecord: selectedRecord });
        }

        // ALPD-5513 - added by Gowtham R on 10/3/25 - added sample donor field from sampledonor table
        if (this.props.Login.sampledonarList !== previousProps.Login.sampledonarList) {

            let selectedRecord = this.props.Login.selectedRecord;
            let donarCheck = false;
            if (this.props.Login.sampledonarList.length > 0) {
                donarCheck = true;
                if (this.props.Login.operation !== 'update') {
                    selectedRecord["ssampledonor"] = [];
                }

            } else {
                selectedRecord["ssampledonor"] = { value: -1 };
                donarCheck = false; 
            }
            this.setState({ sampledonarList: this.props.Login.sampledonarList, donarCheck: donarCheck, selectedRecord: selectedRecord });
        }

        if (this.props.Login.collectiontubeList !== previousProps.Login.collectiontubeList) {
            this.setState({ collectiontubeList: this.props.Login.collectiontubeList });
        }

        if (this.props.Login.visitnameList !== previousProps.Login.visitnameList) {
            this.setState({ visitnameList: this.props.Login.visitnameList });
        }

        if (this.props.Login.unitList !== previousProps.Login.unitList) {
            this.setState({ unitList: this.props.Login.unitList });
        }

        // ALPD-5513 - added by Gowtham R on 10/3/25 - added sample donor field from sampledonor table
        if (this.props.Login.sampledonarList !== previousProps.Login.sampledonarList) {
            this.setState({ sampledonarList: this.props.Login.sampledonarList });
        }

    }


    onComboChange = (comboData, fieldName) => {

        const selectedRecord = this.state.selectedRecord || {};



        if (fieldName === "sprojecttypename") {
            selectedRecord[fieldName] = comboData;

            delete selectedRecord["sproductname"];
            delete selectedRecord["stubename"];
            delete selectedRecord["svisitnumber"];
            delete selectedRecord["spatientcatname"];
            delete selectedRecord["ssampledonor"]; // ALPD-5513 - added by Gowtham R on 10/3/25 - added sample donor field from sampledonor table
            this.props.getSampleTypeandPatientCatgeroy(
                this.state.selectedRecord.sprojecttypename.value,
                this.state.selectedRecord.sprojecttypename.label,
                this.props.Login.userInfo,
            )
        } else {
            selectedRecord[fieldName] = comboData;
            this.setState({ selectedRecord });
        }

    }


    onInputOnChange = (event, fieldName) => {

        const selectedRecord = this.state.selectedRecord || {};

        const values = event.target.value;  //.replace(/[^-^0-9]/g, '');

        //let parsedvalues;

        if (fieldName === "saliquotno") {

            if (/^\d+$/.test(values) && values !== "") {

                //values = parseInt(values, 10);
                selectedRecord[fieldName] = values;
            } else {
                selectedRecord[fieldName] = "";
            }

        } else if (fieldName === "squantity") {

            if (/^\d{0,3}(\.\d{0,2})?$/.test(values) && values !== "") {

                selectedRecord[fieldName] = values;
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
        // let patientcatgoryList;
        // let visitnameList;

        if (this.props.Login.loadEsign) { //true
            //ALPD-4713--Vignesh R(21-08-2024)
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
            // patientcatgoryList = [];
            // visitnameList = [];

        }
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                openModal, loadEsign, selectedRecord, selectedId, controlButton
            }
        }
        this.props.updateStore(updateInfo);

        //ate234 janakumar ALPD-5065 Aliquot Plan-->While doing Edit ,the dropdown records are not Showing.
        // this.setState({
        //     selectedRecord: selectedRecord, processtypeList: processtypeList, projecttypeList: projecttypeList,
        //     sampletypeList: sampletypeList, collectiontubeList: collectiontubeList, patientcatgoryList: patientcatgoryList, visitnameList: visitnameList
        // });

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
            this.onSaveAliquotPlan(saveType, formRef);
        } else if (this.props.Login.operation === "update") {
            this.updateAliquotPlan(saveType, formRef);
        }

    }


    onSaveAliquotPlan = (saveType, formRef) => {

        let selectedRecord = this.state.selectedRecord;
        let dataState=undefined;
        if (selectedRecord !== undefined) {

            const inputParam = {
                nformcode: this.props.Login.userInfo.nformcode,
                classUrl: "aliquotplan",
                methodUrl: "AliquotPlan",
                selectedRecord: {...this.state.selectedRecord},
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
                    patientcatvalue: this.state.selectedRecord.spatientcatname === undefined ? '-1' : this.state.selectedRecord.spatientcatname.value,
                    patientcatname: this.state.selectedRecord.spatientcatname === undefined ? 'NA' : this.state.selectedRecord.spatientcatname.label,
                    visitname: this.state.selectedRecord.svisitnumber.label,
                    visitnumber: this.state.selectedRecord.svisitnumber.value,
                    unitvalue: this.state.selectedRecord.sunitname.value,
                    unitname: this.state.selectedRecord.sunitname.label,
                    squantity: this.state.selectedRecord.squantity,
                    saliquotno: this.state.selectedRecord.saliquotno,
                    sdescription: this.state.selectedRecord.sdescription===undefined?"":this.state.selectedRecord.sdescription,
                    // ALPD-5513 - added by Gowtham R on 10/3/25 - added sample donor field from sampledonor table
                    nsampledonorcode: this.state.selectedRecord.ssampledonor.value,
                    ssampledonor: this.state.selectedRecord.ssampledonor.label,
                    operation: "create",


                },
                operation: "create",
                saveType, formRef,dataState,
            }

            const masterData = this.props.Login.masterData;


            this.props.crudMaster(inputParam, masterData, "openModal");
        }

    }

    updateAliquotPlan = (saveType, formRef) => {

        let {dataState}=this.state;
        
        const inputParam = {
            nformcode: this.props.Login.userInfo.nformcode,
            classUrl: "aliquotplan",
            methodUrl: "AliquotPlan",
            selectedRecord: {...this.state.selectedRecord},
            selectedId:this.state.selectedRecord.naliquotplancode,
            inputData: {
                userinfo: {
                    ...this.props.Login.userInfo,
                    sformname: Lims_JSON_stringify(this.props.Login.userInfo.sformname),
                    smodulename: Lims_JSON_stringify(this.props.Login.userInfo.smodulename),
                },
                //indexof:
                ncontrolCode: this.props.Login.userInfo.nformcode,
                naliquotplancode: this.state.selectedRecord.naliquotplancode,
                tubename: this.state.selectedRecord.stubename.label,
                tubevalue: this.state.selectedRecord.stubename.value,
                projecttypename: this.state.selectedRecord.sprojecttypename.label,
                projecttypevalue: this.state.selectedRecord.sprojecttypename.value,
                productname: this.state.selectedRecord.sproductname.label,
                productvalue: this.state.selectedRecord.sproductname.value,
                patientcatvalue: this.state.selectedRecord.spatientcatname.value === undefined ? '-1' : this.state.selectedRecord.spatientcatname.value,
                patientcatname: this.state.selectedRecord.spatientcatname.label,
                visitname: this.state.selectedRecord.svisitnumber.label,
                visitnumber: this.state.selectedRecord.svisitnumber.value,
                unitvalue: this.state.selectedRecord.sunitname.value,
                unitname: this.state.selectedRecord.sunitname.label,
                squantity: this.state.selectedRecord.squantity,
                saliquotno: this.state.selectedRecord.saliquotno,
                sdescription: this.state.selectedRecord.sdescription===undefined?"":this.state.selectedRecord.sdescription,
                // ALPD-5513 - added by Gowtham R on 10/3/25 - added sample donor field from sampledonor table
                nsampledonorcode: this.state.selectedRecord.ssampledonor.value,
                ssampledonor: this.state.selectedRecord.ssampledonor.label,
                operation: "update",


            },
            operation: "update",
            saveType, formRef,dataState,
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
    getprojectytpe, getSampleTypeandPatientCatgeroy, getUnit, getActiveAliquotPlanById
})(injectIntl(AliquotPlan));
