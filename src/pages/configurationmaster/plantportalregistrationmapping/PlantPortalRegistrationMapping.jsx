import React from 'react'
import { ListWrapper } from '../../../components/client-group.styles'
import { Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { process } from '@progress/kendo-data-query';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import {
    callService, crudMaster, getPortalRegistrationType, fetchinstituiondeptTypeById, updateStore,
    validateEsignCredential, getPlant, getActivePortalRegistrationType
} from '../../../actions';
import { DEFAULT_RETURN } from '../../../actions/LoginTypes';
import DataGrid from '../../../components/data-grid/data-grid.component';
import SlideOutModal from '../../../components/slide-out-modal/SlideOutModal';
import { showEsign, getControlMap } from '../../../components/CommonScript';
import Esign from '../../audittrail/Esign';
import FormSelectSearch from '../../../components/form-select-search/form-select-search.component';
import FormMultiSelect from '../../../components/form-multi-select/form-multi-select.component';


const mapStateToProps = state => {
    return ({ Login: state.Login })
}

class PlantPortalRegistrationMapping extends React.Component {
    constructor(props) {
        super(props)
        this.formRef = React.createRef();
        this.extractedColumnList = [];
        this.handleClose = this.handleClose.bind(this);
        const dataState = {
            skip: 0,
            take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5,
        };
        this.state = {
            data: [], masterStatus: "", error: "", selectedRecord: {}, userRoleControlRights: [], controlMap: new Map(),
            dataResult: [],
            dataState: dataState,
            mandatoryFields: [
                { "idsName": "IDS_PORTALREGISTRATIONTYPE", "dataField": "nportalregtypecode", "width": "150px", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
                { "idsName": "IDS_PLANT", "dataField": "ndeptcode", "width": "150px", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
            ]
        };
    }
    dataStateChange = (event) => {
        this.setState({
            dataResult: process(this.props.Login.masterData, event.dataState),
            dataState: event.dataState
        });
    }
    //to close side out
    handleClose() {

        let loadEsign = this.props.Login.loadEsign;
        let openModal = this.props.Login.openModal;
        let selectedRecord = this.props.Login.selectedRecord;
        let selectedId = this.props.Login.selectedId;
        if (this.props.Login.loadEsign) {
            if (this.props.Login.operation === "delete") {
                loadEsign = false;
                openModal = false;
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
            data: { openModal, loadEsign, selectedRecord, selectedId }
        }
        this.props.updateStore(updateInfo);
    };

    //to open side out

    //to perform save action for both add and edit
    onSaveClick = (saveType, formRef) => {
        let inputData = [];
        let selectedId = null;
        inputData["userinfo"] = this.props.Login.userInfo;
        let dataState = undefined;
        inputData["plantportalregistrationmapping"] = {};
        if (this.props.Login.operation === "update") {
            // edit
            inputData["plantportalregistrationmapping"] = {
                "nportalregtypecode": this.state.selectedRecord.nportalregtypecode.value,
                "ndeptcode": this.state.selectedRecord.ndeptcode.value,
                "nportalregmappingcode": this.props.Login.SelectedPortalRegistrationType.nportalregmappingcode
            }
        }
        else {
            inputData["plantportalregistrationmapping"] = {};

            let plantportalregistrationmapping = []
            plantportalregistrationmapping = this.state.selectedRecord.ndeptcode.map(item => {
                let map = {}
                map["nportalregtypecode"] = this.state.selectedRecord.nportalregtypecode.value;
                map["ndeptcode"] = item.value
                return map;
            });
            inputData['plantportalregistrationmapping'] = plantportalregistrationmapping;

        }
        const inputParam = {
            methodUrl: "PlantPortalRegistrationMapping",
            classUrl: "plantportalregistrationmapping",
            displayName: this.props.Login.inputParam.displayName,
            inputData: inputData,
            operation: this.props.Login.operation,
            saveType, formRef, dataState, selectedId,
            selectedRecord: { ...this.state.selectedRecord }
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

    //to delete a recoed
    deleteRecord = (deleteParam) => {
        const inputParam = {
            methodUrl: this.props.Login.inputParam.methodUrl,
            classUrl: 'plantportalregistrationmapping',
            dataState: this.state.dataState,
            displayName: this.props.Login.inputParam.displayName ? this.props.Login.inputParam.displayName : '',
            inputData: {
                'plantportalregistrationmapping': deleteParam.selectedRecord,//.dataItem,
                "userinfo": this.props.Login.userInfo
            },
            operation: deleteParam.operation,
            selectedRecord: { ...this.state.selectedRecord }
        }

        const masterData = this.props.Login.masterData;

        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, deleteParam.ncontrolCode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData }, operation: deleteParam.operation, openModal: true,
                    screenName: this.props.Login.inputParam.displayName
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.crudMaster(inputParam, masterData, "openModal");
        }
    }
    //to reload data
    reloadData = () => {
        const inputParam = {
            inputData: { userinfo: this.props.Login.userInfo },
            methodUrl: this.props.Login.inputParam.methodUrl,
            classUrl: this.props.Login.inputParam.classUrl,
            displayName: this.props.Login.inputParam.displayName ? this.props.Login.inputParam.displayName : '',
            userInfo: this.props.Login.userInfo
        };

        this.props.callService(inputParam);
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
    static getDerivedStateFromProps(props, state) {

        if (props.Login.masterStatus !== state.masterStatus) {
            toast.warn(props.Login.masterStatus);
            props.Login.masterStatus = "";
        }

        if (props.Login.error !== state.error) {
            toast.error(props.Login.error)
            props.Login.error = "";
        }
        return null;
    }

    render() {
        let primaryKeyField = "";
        if (this.props.Login.inputParam !== undefined) {
            this.extractedColumnList = [
                { "idsName": "IDS_PORTALREGISTRATIONTYPE", "dataField": "sportalregtypename", "width": "250px" },
                { "idsName": "IDS_PLANT", "dataField": "sdeptname", "width": "250px" },
            ]
            primaryKeyField = "nportalregmappingcode";
        }

        const addID = this.props.Login.inputParam && this.state.controlMap.has("AddPlantPortalRegistrationMapping")
            && this.state.controlMap.get('AddPlantPortalRegistrationMapping').ncontrolcode;
        const editId = this.props.Login.inputParam && this.state.controlMap.has("EditPlantPortalRegistrationMapping")
            && this.state.controlMap.get('EditPlantPortalRegistrationMapping').ncontrolcode;
        const editParam = {
            screenName: this.props.Login.inputParam && this.props.Login.inputParam.displayName, operation: "update", primaryKeyField: primaryKeyField,
            masterData: this.props.Login.masterData, userInfo: this.props.Login.userInfo, ncontrolCode: editId
        };

        const deleteParam = {
            screenName: this.props.Login.inputParam && this.props.Login.inputParam.displayName,
            methodUrl: "PlantPortalRegistrationMapping", operation: "delete"
        };

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
                                    fetchRecord={this.props.getActivePortalRegistrationType}
                                    deleteRecord={this.deleteRecord}
                                    reloadData={this.reloadData}
                                    controlMap={this.state.controlMap}
                                    userRoleControlRights={this.state.userRoleControlRights}
                                    inputParam={this.props.Login.inputParam}
                                    userInfo={this.props.Login.userInfo}
                                    editParam={editParam}
                                    deleteParam={deleteParam}
                                    pageable={true}
                                    isActionRequired={true}
                                    isToolBarRequired={true}
                                    gridHeight={'600px'}
                                    scrollable={"scrollable"}
                                    selectedId={this.props.Login.selectedId}
                                    addRecord={() => this.props.getPortalRegistrationType({ userInfo: this.props.Login.userInfo, ncontrolCode: addID, operation: "create", masterData: this.props.Login.masterData })}
                                />
                                : ""}

                        </ListWrapper>
                    </Col>
                </Row>
                {this.props.Login.openModal ?
                    <SlideOutModal
                        onSaveClick={this.onSaveClick}
                        operation={this.props.Login.operation}
                        screenName={this.props.Login.inputParam.displayName}
                        closeModal={this.handleClose}
                        show={this.props.Login.openModal}
                        inputParam={this.props.Login.inputParam}
                        esign={this.props.Login.loadEsign}
                        validateEsign={this.validateEsign}
                        selectedRecord={this.state.selectedRecord}
                        mandatoryFields={this.state.mandatoryFields}
                        addComponent={this.props.Login.loadEsign ?
                            <Esign operation={this.props.Login.operation ? this.props.Login.operation : ''}
                                onInputOnChange={this.onInputOnChange}
                                inputParam={this.props.Login.inputParam}
                                selectedRecord={this.state.selectedRecord || {}}
                            />
                            :
                            <Row>
                                <Col md={12}>
                                    <FormSelectSearch
                                        name={"nportalregtypecode"}
                                        formLabel={this.props.intl.formatMessage({ id: "IDS_PORTALREGISTRATIONTYPE" })}
                                        placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                        value={this.state.selectedRecord && this.state.selectedRecord["nportalregtypecode"] ? this.state.selectedRecord["nportalregtypecode"] || [] : []}
                                        options={this.props.Login.portalRegistrationTypeList || []}
                                        optionId="nportalregtypecode"
                                        optionValue="sportalregtypename"
                                        isMandatory={true}
                                        closeMenuOnSelect={true}
                                        alphabeticalSort={true}
                                        isSearchable={true}
                                        onChange={(event) => this.onComboChange(event, "nportalregtypecode")}
                                        isDisabled={this.props.Login.operation==='update'?true:false}
                                    >
                                    </FormSelectSearch>
                                </Col>


                                {this.props.Login.operation === 'update' ?
                                    <Col md={12}>
                                        <FormSelectSearch
                                            name={"ndeptcode"}
                                            formLabel={this.props.intl.formatMessage({ id: "IDS_PLANT" })}
                                            placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                            value={this.state.selectedRecord && this.state.selectedRecord["ndeptcode"] ? this.state.selectedRecord["ndeptcode"] || [] : []}
                                            options={this.props.Login.plantList || []}
                                            optionId="ndeptcode"
                                            optionValue="sdeptname"
                                            isMandatory={true}
                                            closeMenuOnSelect={true}
                                            alphabeticalSort={true}
                                            isSearchable={true}
                                            onChange={(event) => this.onComboChange(event, "ndeptcode")}
                                        >
                                        </FormSelectSearch>
                                    </Col> :
                                    <Col md={12}>
                                        <FormMultiSelect
                                            name={"ndeptcode"}
                                            label={this.props.intl.formatMessage({ id: "IDS_PLANT" })}
                                            options={this.props.Login.plantList || []}
                                            optionId="value"
                                            optionValue="label"
                                            value={this.state.selectedRecord && this.state.selectedRecord["ndeptcode"] ? this.state.selectedRecord["ndeptcode"] || [] : []}
                                            isMandatory={true}
                                            disableSearch={false}
                                            disabled={false}
                                            closeMenuOnSelect={false}
                                            alphabeticalSort={true}
                                            allItemSelectedLabel={this.props.intl.formatMessage({ id: "IDS_ALLITEMSAREMSELECTED" })}
                                            noOptionsLabel={this.props.intl.formatMessage({ id: "IDS_NOOPTION" })}
                                            searchLabel={this.props.intl.formatMessage({ id: "IDS_SEARCH" })}
                                            selectAllLabel={this.props.intl.formatMessage({ id: "IDS_SELECTALL" })}
                                            onChange={(event) => this.onComboChange(event, "ndeptcode")}
                                        />
                                    </Col>
                                }
                            </Row>
                        } />
                    : ""}
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
                    dataResult: process(this.props.Login.masterData, this.state.dataState)
                });
            }
            else {
                let { dataState } = this.state;
                if (this.props.Login.dataState === undefined) {
                    dataState = { skip: 0, take: this.state.dataState.take }
                }
                if (this.state.dataResult.data) {
                    if (this.state.dataResult.data.length === 1) {
                        let skipcount = this.state.dataState.skip > 0 ? (this.state.dataState.skip - this.state.dataState.take) :
                            this.state.dataState.skip
                        dataState = { skip: skipcount, take: this.state.dataState.take }
                    }
                }
                this.setState({
                    data: this.props.Login.masterData, selectedRecord: this.props.Login.selectedRecord,
                    dataResult: process(this.props.Login.masterData, dataState),
                    dataState
                });
            }
        }
        if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord) {

            this.setState({ selectedRecord: this.props.Login.selectedRecord });
        }
    }

    onComboChange = (comboData, fieldName) => {
        const selectedRecord = this.state.selectedRecord || {};
        selectedRecord[fieldName] = comboData;
        if (fieldName === "nportalregtypecode") {
            this.props.getPlant({
                inputData: {
                    userinfo: this.props.Login.userInfo,
                    nportalregtypecode: selectedRecord.nportalregtypecode && selectedRecord.nportalregtypecode.value,
                    SelectedPortalRegistrationType: selectedRecord.nportalregtypecode
                }
            });
        }
        this.setState({ selectedRecord });
    }
}
export default connect(mapStateToProps, {
    callService, crudMaster, getPortalRegistrationType, fetchinstituiondeptTypeById,
    updateStore, validateEsignCredential, getPlant, getActivePortalRegistrationType
})(injectIntl(PlantPortalRegistrationMapping));

