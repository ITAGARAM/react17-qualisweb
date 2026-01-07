import { process } from '@progress/kendo-data-query';
import React from 'react'
import SlideOutModal from '../../components/slide-out-modal/SlideOutModal';
import { plantgroupsite, plantgroupdepartment, fusionplantchild, getActivePlantGroupById } from '../../actions';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import { DEFAULT_RETURN } from '../../actions/LoginTypes';
import { showEsign, getControlMap, Lims_JSON_stringify } from
    '../../components/CommonScript';
import { Col, Row,  Nav } from 'react-bootstrap';
import { faPlus} from '@fortawesome/free-solid-svg-icons';
import { ListWrapper } from '../../components/client-group.styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DataGrid from '../../../src/components/data-grid/data-grid.component';
import Esign from '../audittrail/Esign';
import AddPlantGroup from '../../pages/configurationmaster/AddPlantGroup';
import { callService, updateStore, crudMaster, validateEsignCredential } from '../../actions';
import { toast } from 'react-toastify';

const mapStateToProps = state => {
    return ({ Login: state.Login })
}

class PlantGroup extends React.Component {

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
                { "controlType": "selectbox", "idsName": "IDS_FUSIONPRANENTPLANT", "dataField": "sparentsplantname", "width": "150px" }, //parentsplantcode
                { "controlType": "selectbox", "idsName": "IDS_FUSIONCHILDPLANTS", "dataField": "schildsplantname", "width": "150px" }, //childsplantcode
                { "controlType": "selectbox", "idsName": "IDS_FUSIONSITE", "dataField": "ssitecode", "width": "150px" },
            ]

            primaryKeyField = "nsiteprimarykey";
        }
        let mandatoryFields = [];
        mandatoryFields.push(
            { "mandatory": true, "idsName": "IDS_FUSIONSITE", "dataField": "ssitecode", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
            { "mandatory": true, "idsName": "IDS_FUSIONPRANENTPLANT", "dataField": "splantparentcode", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
            { "mandatory": true, "idsName": "IDS_FUSIONCHILDPLANTS", "dataField": "splantchildcode", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
        )


        const addplantgroupId = this.state.controlMap.has("AddPlantGroup") && this.state.controlMap.get("AddPlantGroup").ncontrolcode;
        const editplantgroupId = this.state.controlMap.has("EditPlantGroup") && this.state.controlMap.get("EditPlantGroup").ncontrolcode;
       // const deleteplantgroupId = this.state.controlMap.has("DeletePlantGroup") && this.state.controlMap.get("DeletePlantGroup").ncontrolcode;


        const editParam = {
            screenName: this.props.Login.inputParam && this.props.Login.inputParam.displayName && this.props.intl.formatMessage({ id: this.props.Login.inputParam.displayName }), primaryKeyField: "nplantgroupcode", operation: "update",
            inputParam: this.props.Login.inputParam, userInfo:this.props.Login.userInfo,
            ncontrolCode: editplantgroupId
        };

        const deleteParam = { operation: "delete" };

        return (<>
            <Row>
                <Col>
                    <ListWrapper className="client-list-content">

                        <div className="actions-stripe d-flex justify-content-end">
                            <Nav.Link name="addplantgroupId" className="add-txt-btn"
                                hidden={this.state.userRoleControlRights.indexOf(AddPlantGroup) === -1}
                                onClick={() => this.props.plantgroupsite(AddPlantGroup)}
                            >
                                <FontAwesomeIcon icon={faPlus} /> { }
                                <FormattedMessage id='IDS_FUSIONPLANT' defaultMessage='Validation Status' />
                            </Nav.Link>
                        </div>
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
                            fetchRecord={this.props.getActivePlantGroupById}
                            deleteRecord={this.deleteRecord}
                            reloadData={this.reloadData}
                            editParam={editParam}
                            //editParam={() => this.props.getActivePlantGroupById(editplantgroupId,"nplantgroupcode", this.props.Login.userInfo) || []}
                            addRecord={() => this.props.plantgroupsite(addplantgroupId, this.props.Login.userInfo) || []}
                            deleteParam={deleteParam}
                            scrollable={"scrollable"}
                            gridHeight={"600px"}
                            isActionRequired={true}
                            isToolBarRequired={true}
                            pageable={true}
                            groupable={true}
                            group={this.state.group}
                            groupPanelCell={() => null}

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
                        : <AddPlantGroup
                            selectedRecord={this.state.selectedRecord || {}}
                            onInputOnChange={this.onInputOnChange}
                            onComboChange={this.onComboChange}
                            onClick={() => this.openModal("IDS_FUSIONPLANT")}
                            fusionplantSite={this.state.fusionplantSite || []}
                            fusionparentplants={this.state.fusionparentplants || []}
                            fusionchildplants={this.state.fusionchildplants}
                            inputParam={this.props.Login.inputParam}
                            deleteFile={this.deleteFile}
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
                let { dataState } = this.state;
                if (this.props.Login.dataState === undefined) {
                    dataState = {
                    skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5 
                    }
                }
                let group=[];
                group=[{field: "sparentsplantname" }]
                dataState = {group}
                this.setState( {dataState} );

                this.setState({
                    data: this.props.Login.masterData,
                    isOpen: false,
                    selectedRecord: this.props.Login.selectedRecord,
                    dataResult: process(this.props.Login.masterData, dataState),
                    dataState });
            }

 
        } else if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord) {
            this.setState({ selectedRecord: this.props.Login.selectedRecord });
        }

        // if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord) {
        //     this.setState({ selectedRecord: this.props.Login.selectedRecord });
        // }


        if (this.props.Login.fusionplantSite !== previousProps.Login.fusionplantSite) {
            this.setState({ fusionplantSite: this.props.Login.fusionplantSite });
        }

        if (this.props.Login.fusionparentplants !== previousProps.Login.fusionparentplants) {
            this.setState({ fusionparentplants: this.props.Login.fusionparentplants });
        }

        if (this.props.Login.fusionchildplants !== previousProps.Login.fusionchildplants) {
            this.setState({ fusionchildplants: this.props.Login.fusionchildplants });
        }



        // if (this.props.Login.userInfo.nformcode !== previousProps.Login.userInfo.nformcode) {
        //     const userRoleControlRights = [];
        //     if (this.props.Login.userRoleControlRights) {
        //         this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode] && Object.values(this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode]).map(item =>
        //             userRoleControlRights.push(item.ncontrolcode))
        //     }

        //     const controlMap = getControlMap(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode)
        //     let skip = this.state.skip;
        //     let take = this.state.take;
        //     // if (reportTypeList.length < take) {
        //     //     skip = 0;
        //     //     take = take;
        //     // }

        //     this.setState({ userRoleControlRights,
        //        controlMap,skip, take
        //     });


        // }

    }

    closeModal = () => {
        let loadEsign = this.props.Login.loadEsign;
        let openModal = this.props.Login.openModal;
        let selectedRecord = this.props.Login.selectedRecord;
        let controlButton = this.props.Login.controlButton;
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
            controlButton = [];

        }
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                openModal, loadEsign, selectedRecord, selectedId: [], controlButton
            }
        }
        this.props.updateStore(updateInfo);


    }


    onComboChange = (comboData, fieldName) => {

        const selectedRecord = this.state.selectedRecord || {};


        if (fieldName === "ssitecode") {
            selectedRecord[fieldName] = comboData;
            delete selectedRecord["splantchildcode"];
            delete selectedRecord["splantparentcode"];

            //this.setState({ selectedRecord });
            this.props.plantgroupdepartment(
                this.state.selectedRecord.ssitecode.value,
                // this.props.Login.masterData.SelectedReportMaster.nformcode,
                this.props.Login.userInfo,
            )
        } else if (fieldName === "splantparentcode") {
            selectedRecord[fieldName] = comboData;
            delete selectedRecord["splantchildcode"];

            //this.setState({ selectedRecord });
            this.props.fusionplantchild(
                this.state.selectedRecord.ssitecode.value,
                this.state.selectedRecord.splantparentcode.value,
                this.props.Login.userInfo
            );

        }
        else if (fieldName === "splantchildcode") {
            selectedRecord[fieldName] = comboData;

            this.setState({ selectedRecord });
        }
        else {
            selectedRecord[fieldName] = comboData;
            this.setState({ selectedRecord });
        }
        //selectedRecord[fieldName] = comboData;;
        // this.setState({ selectedRecord });
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


    closeModal = () => {
        let loadEsign = this.props.Login.loadEsign;
        let openModal = this.props.Login.openModal;
        let selectedRecord = this.props.Login.selectedRecord;
        let controlButton = this.props.Login.controlButton;
        let selectedId = this.props.Login.selectedId;
        let fusionchildplants;
        let fusionparentplants;
        let fusionplantSite;

        if (this.props.Login.loadEsign) {
            if (this.props.Login.operation === "delete" || this.props.Login.operation === "create" || this.props.Login.operation === "update") {
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
            controlButton = [];
            selectedId = null;
            fusionchildplants = [];
            fusionparentplants = [];
            fusionplantSite = [];

        }
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                openModal, loadEsign, selectedRecord, selectedId, controlButton, fusionchildplants, fusionparentplants, fusionplantSite
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


    onSaveClick = (saveType, formRef) => {
        if (this.props.Login.operation === "create") {
            this.onSavefusionPlantGroup(saveType, formRef);
        } else if (this.props.Login.operation === "update") {
            this.updatefusionPlantGroup(saveType, formRef);
        }



    }


    onSavefusionPlantGroup = (saveType, formRef) => {

        let childparameter = [];
        this.state.selectedRecord.splantchildcode &&
            this.state.selectedRecord.splantchildcode.map(data => {
                return childparameter.push({
                    nchildcode: "'" + data.value + "'",
                    splantcode: "'" + data.value + "'"
                    // childplantname : data.item,
                    // ssitecode:this.state.selectedRecord.ssitecode.value,
                })
            })

        const inputParam = {
            nformcode: this.props.Login.userInfo.nformcode,
            classUrl: "plantgroup",
            methodUrl: "PlantGroup",
            inputData: {
                userinfo: {
                    ...this.props.Login.userInfo,
                    sformname: Lims_JSON_stringify(this.props.Login.userInfo.sformname),
                    smodulename: Lims_JSON_stringify(this.props.Login.userInfo.smodulename),
                },
                //indexof:

                ncontrolCode: this.props.Login.userInfo.nformcode,
                nmappingsite: this.state.selectedRecord.ssitecode.value,
                ssitecode: this.state.selectedRecord.ssitecode.label,
                splantparentcode: this.state.selectedRecord.splantparentcode.value,
                splantparentcodeLable: this.state.selectedRecord.splantparentcode.label,
                splantchildcode: this.state.selectedRecord.splantchildcode.map(function (el) { return el.value ; }).join(",") || null,
                splantchildcodeLable: this.state.selectedRecord.splantchildcode.map(function (el) { return  el.label; }).join(",") || null,
                childparameterlist: childparameter
            },
            operation: "create",
            saveType, formRef,
        }

        //inputData["completetreepath"] = masterData.CompleteTreePath;
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

    updatefusionPlantGroup = (saveType, formRef) => {


        const inputParam = {
            nformcode: this.props.Login.userInfo.nformcode,
            classUrl: "plantgroup",
            methodUrl: "PlantGroup",
            inputData: {
                userinfo: {
                    ...this.props.Login.userInfo,
                    sformname: Lims_JSON_stringify(this.props.Login.userInfo.sformname),
                    smodulename: Lims_JSON_stringify(this.props.Login.userInfo.smodulename),
                },
                //indexof:
                ncontrolCode: this.props.Login.userInfo.nformcode,
                nplantgroupcode: this.state.selectedRecord.nplantgroupcode,
                nmappingsite: this.state.selectedRecord.ssitecode.value,
                ssitecode: this.state.selectedRecord.ssitecode.label,
                splantparentcode: this.state.selectedRecord.splantparentcode.value,
                splantparentcodeLable: this.state.selectedRecord.splantparentcode.label,
                //splantchildcode: this.state.selectedRecord.splantchildcode.map(function (el) { return "'"+el.value+"'"; }).join(",") || null,
                //splantchildcodeLable: this.state.selectedRecord.splantchildcode.map(function (el) { return  "'"+el.label+"'"; }).join(",") || null,
                splantchildcode:  this.state.selectedRecord.splantchildcode.value ,
                splantchildcodeLable:  this.state.selectedRecord.splantchildcode.label 

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
                    openModal: true, screenName: this.props.intl.formatMessage({ id:this.props.Login.displayName }),
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
export default connect(mapStateToProps, { updateStore, callService, crudMaster, validateEsignCredential, plantgroupsite, plantgroupdepartment, fusionplantchild, getActivePlantGroupById })(injectIntl(PlantGroup));
