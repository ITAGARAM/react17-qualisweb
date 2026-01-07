import React from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { ListWrapper } from '../../components/client-group.styles';
import { Row, Col } from 'react-bootstrap'; 
import { toast } from 'react-toastify';
import { process } from '@progress/kendo-data-query';
import { callService, crudMaster, updateStore, validateEsignCredential, getPlasmaMasterFileComboService } from '../../actions';
import DataGrid from '../../components/data-grid/data-grid.component';
import SlideOutModal from '../../components/slide-out-modal/SlideOutModal';
import Esign from '../audittrail/Esign';
import AddPlasmaMasterFile from './AddPlasmaMasterFile';
import { DEFAULT_RETURN } from '../../actions/LoginTypes';
import {constructOptionList, getControlMap, showEsign } from '../../components/CommonScript';

const mapStateToProps = state => {
    return ({ Login: state.Login })
}

class PlasmaMasterFile extends React.Component {
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
            addScreen: false, data: [], masterStatus: "", error: "", operation: "create",
            dataResult: [],
            dataState: dataState,
            plasmaData: [],
            userRoleControlRights: [],
            controlMap: new Map(),
            selectedRecord: {},manufList:[]

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
        }

        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { openModal, loadEsign, selectedRecord, selectedId: null }
        }
        this.props.updateStore(updateInfo);

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

    getNestedFieldData = (nestedColumnArray, data) =>
        nestedColumnArray.reduce((xs, x) => (xs && xs[x]) ? xs[x] : null, data);

    render() {

        //let primaryKeyField = "";


        this.extractedColumnList = [
            { "idsName": "IDS_MANUFNAME", "dataField": "smanufname", "width": "200px" },
            { "idsName": "IDS_PLASMAFILENUMBER", "dataField": "splasmafilenumber", "width": "200px" },
            { "idsName": "IDS_DESCRIPTION", "dataField": "sdescription", "width": "400px" },

        ]
        //primaryKeyField = "nplasmafilecode";
        this.validationColumnList = [
            { "idsName": "IDS_MANUFNAME", "dataField": "nmanufcode", "width": "200px","mandatory": true, "mandatoryLabel":"IDS_SELECT", "controlType": "selectbox"  },
            { "idsName": "IDS_PLASMAFILENUMBER", "dataField": "splasmafilenumber", "width": "200px","mandatory": true, "mandatoryLabel":"IDS_ENTER", "controlType": "textbox"  },

        ]
        this.fieldList = ["splasmafilenumber", "sdescription", "nmanufcode"];



        const addId = this.state.controlMap.has("AddPlasmaMasterFile") && this.state.controlMap.get("AddPlasmaMasterFile").ncontrolcode;
        const editId = this.state.controlMap.has("EditPlasmaMasterFile") && this.state.controlMap.get("EditPlasmaMasterFile").ncontrolcode;
        const deleteId = this.state.controlMap.has("DeletePlasmaMasterFile") && this.state.controlMap.get("DeletePlasmaMasterFile").ncontrolcode;

        const PlasmaMasterFileAddParam = {
            screenName: "Plasma Master File", operation: "create", primaryKeyField: "nplasmafilecode",
            userInfo: this.props.Login.userInfo, ncontrolCode: addId
        };

        const PlasmaMasterFileEditParam = {
            screenName: "Plasma Master File", operation: "update", primaryKeyField: "nplasmafilecode",
            userInfo: this.props.Login.userInfo, ncontrolCode: editId
        };

        const PlasmaMasterFileDeleteParam = { screenName: "PlasmaMasterFile", methodUrl: "PlasmaMasterFile", operation: "delete", ncontrolCode: deleteId };

        const mandatoryFields = [];
        this.validationColumnList.forEach(item => item.mandatory === true ?
            mandatoryFields.push(item) : ""
        );
        return (

            <>
                <Row>
                    <Col>
                        <ListWrapper className="client-list-content">
                            {this.state.data ?
                                <DataGrid
                                    gridHeight = {"600px"}
                                    primaryKeyField={"nplasmafilecode"}
                                    data={this.state.data}
                                    dataResult={this.state.dataResult}
                                    dataState={this.state.dataState}
                                    dataStateChange={this.dataStateChange}
                                    extractedColumnList={this.extractedColumnList}
                                    controlMap={this.state.controlMap}
                                    userRoleControlRights={this.state.userRoleControlRights}
                                    inputParam={this.props.Login.inputParam}
                                    userInfo={this.props.Login.userInfo}
                                    fetchRecord={this.props.getPlasmaMasterFileComboService} //fetchRecord}
                                    editParam={PlasmaMasterFileEditParam}
                                    deleteRecord={this.deleteRecord}
                                    addRecord={() => this.props.getPlasmaMasterFileComboService(PlasmaMasterFileAddParam)}
                                    deleteParam={PlasmaMasterFileDeleteParam}
                                    reloadData={this.reloadData}
                                    pageable={{ buttonCount: 4, pageSizes: true }}
                                    scrollable={"scrollable"}
                                    isActionRequired={true}
                                    isToolBarRequired={true}
                                    selectedId={this.props.Login.selectedId}
                                />
                                : ""}
                        </ListWrapper>
                    </Col>
                </Row>
                {this.props.Login.openModal &&
                    <SlideOutModal show={this.props.Login.openModal}
                        closeModal={this.closeModal}
                        operation={this.props.Login.operation}
                        inputParam={this.props.Login.inputParam}
                        screenName={this.props.Login.screenName}
                        onSaveClick={this.onSaveClick}
                        esign={this.props.Login.loadEsign}
                        validateEsign={this.validateEsign}
                        masterStatus={this.props.Login.masterStatus}
                        updateStore={this.props.updateStore}
                        selectedRecord={this.state.selectedRecord || {}}
                        mandatoryFields={mandatoryFields}
                        addComponent={this.props.Login.loadEsign ?
                            <Esign operation={this.props.Login.operation}
                                formatMessage={this.props.intl.formatMessage}
                                onInputOnChange={this.onInputOnChange}
                                inputParam={this.props.Login.inputParam}
                                selectedRecord={this.state.selectedRecord || {}}
                            />
                            : <AddPlasmaMasterFile
                                selectedRecord={this.state.selectedRecord || {}}
                                onInputOnChange={this.onInputOnChange}
                                onComboChange={this.onComboChange}
                                formatMessage={this.props.intl.formatMessage}
                                manufList={this.state.manufList || []}//{this.props.Login.manufList || []}
                                operation={this.props.Login.operation}
                                inputParam={this.props.Login.inputParam}

                            />}
                    />
                }
            </>
        );
    }



    onComboChange = (comboData, fieldName) => {
        if (comboData != null) {
            const selectedRecord = this.state.selectedRecord || {};
            selectedRecord[fieldName] = comboData;//.value;


            this.setState({ selectedRecord });
        }
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
                    dataResult: process(this.props.Login.masterData, dataState),
                    dataState
                });
            }
        }
        if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord) {
            this.setState({ selectedRecord: this.props.Login.selectedRecord });
        }
        if(this.props.Login.manufList !== previousProps.Login.manufList ){

            const  manufList  = constructOptionList(this.props.Login.manufList ||[], "nmanufcode",
            "smanufname" , undefined, undefined, undefined);
        const  manufListFile  = manufList.get("OptionList");

        this.setState({ manufList: manufListFile});
    }
    }


    onInputOnChange = (event) => {

        const selectedRecord = this.state.selectedRecord || {};
        if (event.target.type === 'checkbox') {
            if (event.target.name === "agree") {
                selectedRecord[event.target.name] = event.target.checked === true ? 3 : 4;
            }
        }
        else if (event.target.type === 'select-one') {

            selectedRecord[event.target.name] = event.target.value;

        }
        else {
            selectedRecord[event.target.name] = event.target.value;
        }

        this.setState({ selectedRecord });


    }

    // onNumericInputOnChange = (value, name) => {
    //     const selectedRecord = this.state.selectedRecord || {};
    //     if (value === 0 || value === 0.0) {
    //         selectedRecord[name] = '';
    //         this.setState({ selectedRecord });
    //     } else {
    //         selectedRecord[name] = value;
    //         this.setState({ selectedRecord });
    //     }
    // }

    deleteRecord = (deleteparam) => {
        const inputParam = {
            classUrl: this.props.Login.inputParam.classUrl,
            methodUrl: deleteparam.methodUrl,
            displayName: this.props.Login.inputParam.displayName,
            inputData: {
                //[this.props.Login.inputParam.methodUrl.toLowerCase()]: selectedRecord.dataItem,
                [deleteparam.methodUrl.toLowerCase()]: deleteparam.selectedRecord,//.dataItem,
                "userinfo": this.props.Login.userInfo
            },
            operation: deleteparam.operation
        }

        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, deleteparam.ncontrolCode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData: this.props.Login.masterData },
                    openModal: true, //screenName: this.props.intl.formatMessage({ id: this.props.Login.inputParam.displayName }),
                    //operation
                    screenName: deleteparam.screenName, operation: deleteparam.operation
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
            displayName: this.props.Login.inputParam.displayName,
            userInfo: this.props.Login.userInfo
        };

        this.props.callService(inputParam);
    }


    onSaveClick = (saveType, formRef) => {

        let inputData = [];
        inputData["userinfo"] = this.props.Login.userInfo;
        let dataState = undefined;
        let selectedId=null
        if (this.props.Login.operation === "update") {
            // edit
            selectedId=this.state.selectedRecord.nplasmafilecode
            inputData[this.props.Login.inputParam.methodUrl.toLowerCase()] = JSON.parse(JSON.stringify(this.state.selectedRecord));

            this.fieldList.map(item => {
                return inputData[this.props.Login.inputParam.methodUrl.toLowerCase()][item] = this.state.selectedRecord[item]
            })

            inputData["plasmamasterfile"]["nmanufcode"] = this.state.selectedRecord["nmanufcode"] ? this.state.selectedRecord["nmanufcode"].value : "";
            dataState = this.state.dataState;
        }
        else {
            //add               
            inputData[this.props.Login.inputParam.methodUrl.toLowerCase()] = { "nsitecode": this.props.Login.userInfo.nmastersitecode };


            this.fieldList.map(item => {
                return inputData[this.props.Login.inputParam.methodUrl.toLowerCase()][item] = this.state.selectedRecord[item]?this.state.selectedRecord[item]:""
            })

            inputData["plasmamasterfile"]["nmanufcode"] = this.state.selectedRecord["nmanufcode"] ? this.state.selectedRecord["nmanufcode"].value : "";
        }

        const inputParam = {
            classUrl: this.props.Login.inputParam.classUrl,
            methodUrl: this.props.Login.inputParam.methodUrl,
            displayName: this.props.Login.inputParam.displayName,
            inputData: inputData,
            operation: this.props.Login.operation, saveType, formRef, dataState,selectedId
        }

        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolCode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData: this.props.Login.masterData },
                    openModal: true, screenName: this.props.intl.formatMessage({ id: this.props.Login.inputParam.displayName }),
                    operation: this.props.Login.operation
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.crudMaster(inputParam, this.props.Login.masterData, "openModal");
        }
        //let selectedRecord = {};
        //this.setState({ selectedRecord });

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

export default connect(mapStateToProps, {
    callService, crudMaster, updateStore, validateEsignCredential,
    getPlasmaMasterFileComboService
})(injectIntl(PlasmaMasterFile));