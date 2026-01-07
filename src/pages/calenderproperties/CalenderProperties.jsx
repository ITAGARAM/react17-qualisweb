import React from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { process } from '@progress/kendo-data-query';
import DataGrid from '../../components/data-grid/data-grid.component';
import SlideOutModal from '../../components/slide-out-modal/SlideOutModal';
import Esign from '../../pages/audittrail/Esign';
import { callService, crudMaster, updateStore, validateEsignCredential, editCalenderProperties } from '../../actions';
import { DEFAULT_RETURN } from '../../actions/LoginTypes';
import { showEsign, getControlMap } from '../../components/CommonScript';
import { ListWrapper } from '../../components/client-group.styles';
import AddCalenderProperties from './AddCalenderProperties'

const mapStateToProps = state => {
    return ({ Login: state.Login })
}

class CalenderProperties extends React.Component {
    constructor(props) {
        super(props)
        this.formRef = React.createRef();
        this.extractedColumnList = [
            //{ "fieldLength": "NA", "dataField": "ncalendersettingcode", "mandatory": false, "controlType": "NA" },
            { "fieldLength": "100", "mandatory": true, "controlType": "textbox", "idsName": "IDS_CALENDERSETTINGNAME", "dataField": "scalendersettingname", "width": "200px", "mandatoryLabel": "IDS_ENTER" },
            { "fieldLength": "100", "mandatory": true, "controlType": "textbox", "idsName": "IDS_CALENDERSETTINGVALUE", "dataField": "stransdisplaystatus", "width": "400px", "mandatoryLabel": "IDS_ENTER" }
        ];
        const dataState = {
            skip: 0,
            take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5,
        };
        this.state = {
            data: [],
            masterStatus: "",
            error: "",
            selectedRecord: {},
            dataResult: [],
            dataState: dataState,
            userRoleControlRights: [],
            controlMap: new Map(),
        };
    }

    dataStateChange = (event) => {
        this.setState({
            dataResult: process(this.state.data, event.dataState),
            dataState: event.dataState
        });
    }

    openModal = (ncontrolCode) => {
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                selectedRecord: {}, operation: "create", ncontrolCode, selectedId: null,
                openModal: true, screenName: this.props.Login.inputParam.displayName
            }
        }
        this.props.updateStore(updateInfo);
    }


    // oncomboChange = (value, column) => {
    //     const selectedRecord = this.state.selectedRecord;
    //     selectedRecord[column] = value
    //     this.setState({ selectedRecord })
    // }

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
                selectedRecord['esignpassword'] = ""
                selectedRecord['esigncomments'] = ""
                selectedRecord['esignreason'] = ""
            }
        }
        else {
            openModal = false;
            selectedRecord = {};
            selectedId = null;
        }

        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                openModal, loadEsign, selectedRecord, //selectedId:null
                selectedId
            }
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

    render() {

        const editId = this.props.Login.inputParam && this.state.controlMap.has("Edit".concat(this.props.Login.inputParam.methodUrl))
            && this.state.controlMap.get("Edit".concat(this.props.Login.inputParam.methodUrl)).ncontrolcode;

        const editParam = {
            screenName: this.props.Login.inputParam && this.props.Login.inputParam.displayName
                && this.props.intl.formatMessage({ id: this.props.Login.inputParam.displayName }), operation: "update", primaryKeyField: "ncalendersettingcode",
            inputParam: this.props.Login.inputParam, userInfo: this.props.Login.userInfo, ncontrolCode: editId
        };


        return (<>
            <Row>
                <Col>
                    <ListWrapper className="client-list-content">
                        {this.state.data ?
                            <DataGrid
                                primaryKeyField={"ncalendersettingcode"}
                                data={this.state.data}
                                dataResult={this.state.dataResult}
                                dataState={this.state.dataState}
                                dataStateChange={this.dataStateChange}
                                extractedColumnList={this.extractedColumnList}
                                controlMap={this.state.controlMap}
                                userRoleControlRights={this.state.userRoleControlRights}
                                inputParam={this.props.Login.inputParam}
                                userInfo={this.props.Login.userInfo}
                                fetchRecord={this.props.editCalenderProperties}
                                editParam={editParam}
                                reloadData={this.reloadData}
                                pageable={true}
                                scrollable={'scrollable'}
                                // isComponent={true}
                                gridHeight={'1000px'}
                                isActionRequired={true}
                                isToolBarRequired={true}
                                selectedId={this.props.Login.selectedId}
                            />
                            : ""}
                    </ListWrapper>
                </Col>
            </Row>

            {/* Below Condition Added to avoid unwanted rendering of SlideOut */}
            {this.props.Login.openModal ?
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
                    mandatoryFields={[]}
                    addComponent={this.props.Login.loadEsign ?
                        <Esign operation={this.props.Login.operation}
                            onInputOnChange={this.onInputOnChange}
                            inputParam={this.props.Login.inputParam}
                            selectedRecord={this.state.selectedRecord || {}}
                        />
                        : <AddCalenderProperties
                            selectedRecord={this.state.selectedRecord || {}}
                            userInfo={this.props.Login.userInfo}
                            onInputOnChange={this.onInputOnChange}
                            onComboChange={this.onComboChange}
                            masterData={this.props.Login.masterData}

                        />}
                /> : ""}
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
                    //ALPD-2162 L.Subashini
                    dataResult: process(this.props.Login.masterData || [], this.state.dataState),
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
        else if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord) {
            this.setState({ selectedRecord: this.props.Login.selectedRecord });
        }
    }

    onInputOnChange = (event) => {
        const selectedRecord = this.state.selectedRecord || {};
        selectedRecord[event.target.name] = event.target.value;
        if (event.target.type === 'checkbox') {
            // if (event.target.name === "agree") {
            selectedRecord[event.target.name] = event.target.checked === true ? '3' : '4';
            // }
        }
        else {
            selectedRecord[event.target.name] = event.target.value;
        }
        this.setState({ selectedRecord });
    }

    onComboChange = (value, column) => {
        const selectedRecord = this.state.selectedRecord;
        selectedRecord[column] = value;
        this.setState({ selectedRecord });
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
        let dataState = undefined;
        inputData["userinfo"] = this.props.Login.userInfo;
        let selectedId = null;
        if (this.props.Login.operation === "update") {    // edit
            dataState = this.state.dataState
            inputData[this.props.Login.inputParam.methodUrl.toLowerCase()] = { ...this.state.selectedRecord };
            this.extractedColumnList.map(item => {
                return inputData[this.props.Login.inputParam.methodUrl.toLowerCase()][item.dataField] = this.state.selectedRecord[item.dataField] ? this.state.selectedRecord[item.dataField] : "";
            })
            inputData[this.props.Login.inputParam.methodUrl.toLowerCase()]["scalendersettingvalue"] = this.state.selectedRecord["scalendersettingvalue"] ? this.state.selectedRecord["scalendersettingvalue"] : "";
            selectedId = this.props.Login.selectedId;
        }
        else {
            //add                          
            inputData[this.props.Login.inputParam.methodUrl.toLowerCase()] = { "nsitecode": this.props.Login.userInfo.nmastersitecode };

            this.extractedColumnList.map(item => {
                return inputData[this.props.Login.inputParam.methodUrl.toLowerCase()][item.dataField] = this.state.selectedRecord[item.dataField] ? this.state.selectedRecord[item.dataField] : ""
            })
        }

        const inputParam = {
            classUrl: this.props.Login.inputParam.classUrl,
            methodUrl: this.props.Login.inputParam.methodUrl,
            displayName: this.props.Login.inputParam.displayName,
            inputData: inputData, operation: this.props.Login.operation,
            saveType, formRef, selectedId, dataState,
            selectedRecord: { ...this.state.selectedRecord }

        }
        const esignNeeded = showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolCode);
        if (esignNeeded) {
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
export default connect(mapStateToProps, {
    callService, crudMaster, updateStore, validateEsignCredential,
    editCalenderProperties
})(injectIntl(CalenderProperties));
