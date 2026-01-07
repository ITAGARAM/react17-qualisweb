import React from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { process } from '@progress/kendo-data-query';
import SlideOutModal from '../../components/slide-out-modal/SlideOutModal';
import Esign from '../../pages/audittrail/Esign';
import AddDashBoardHomeConfig from '../dashboardtypes/AddDashBoardHomeConfig';
import DataGrid from '../../components/data-grid/data-grid.component';
import { ListWrapper } from '../../components/client-group.styles'
import { callService, crudMaster, getDashBoardHomePagesandTemplates, updateStore, validateEsignCredential } from '../../actions';
import { DEFAULT_RETURN } from '../../actions/LoginTypes';
import { showEsign, getControlMap } from '../../components/CommonScript';
import { transactionStatus } from '../../components/Enumeration';

const mapStateToProps = state => {
    return ({ Login: state.Login })
}

class DashBoardHomeConfig extends React.Component {
    constructor(props) {
        super(props)

        this.formRef = React.createRef();
        this.extractedColumnList = [];

        const dataState = {
            skip: 0,
            take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5,
        };
        this.state = {
            // addScreen: false, 
            data: [], masterStatus: "", error: "", selectedRecord: {},
            dataResult: [],
            dataState: dataState,
            testCategory: [], testMaster: [], ntestcode: [],
            isOpen: false, controlMap: new Map(), userRoleControlRights: [],
            childTemplate: []
        }
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

        if (props.Login.masterStatus !== state.masterStatus) {
            toast.warn(props.Login.masterStatus);
            props.Login.masterStatus = "";
        }

        if (props.Login.error !== state.error) {
            toast.error(props.Login.error)
            props.Login.error = "";
        }
        return null;//{ addScreen: props.Login.showScreen }
    }

    handleChange = (value, valueParam) => {

        if (value !== null) {
            const selectedRecord = this.state.selectedRecord || {};
            selectedRecord[valueParam] = value;
            this.setState({ selectedRecord });
        }
    }

    onDrop = (value, index) => {

        if (value !== null) {
            const data = JSON.parse(value["dashboardtype"]);
            const selectedRecord = this.state.selectedRecord || {};

            selectedRecord["dashboardtype" + index] = { sdashboardtypename: data.sdashboardtypename, ndashboardtypecode: data.ndashboardtypecode };
            this.setState({ selectedRecord });
        }
    }

    templateClick = (value) => {

        if (value !== undefined) {
            const selectedRecord = this.state.selectedRecord || {};

            selectedRecord["ndashboardhometemplatecode"] = value;

            for (let i = 1; i <= 4; i++) {
                if (selectedRecord["dashboardtype" + i] && selectedRecord["dashboardtype" + i] !== undefined) {
                    selectedRecord["dashboardtype" + i] = undefined;
                }
            }
            this.setState({ selectedRecord });
        }
    }
    render() {

        //console.log("this.props.Login.masterData.DashBoardHomeConfig:", this.props.Login.masterData.DashBoardHomeConfig);
        
        const addId = this.props.Login.inputParam && this.state.controlMap.has("Add".concat(this.props.Login.inputParam.methodUrl))
                        && this.state.controlMap.get("Add".concat(this.props.Login.inputParam.methodUrl)).ncontrolcode;
        const editId = this.props.Login.inputParam && this.state.controlMap.has("Edit".concat(this.props.Login.inputParam.methodUrl))
                        && this.state.controlMap.get("Edit".concat(this.props.Login.inputParam.methodUrl)).ncontrolcode;
        let primaryKeyField = "ndashboardhomeprioritycode";//"ndashboardhomepagecode";
        
        const addParam = {screenName: this.props.Login.screenName, primaryKeyField, undefined, 
                            operation: "create", inputParam: this.props.Login.inputParam, 
                            userInfo: this.props.Login.userInfo, addId, data: this.state.data
                        }

        this.mandatoryColumnList = [
            { "idsName": "IDS_USERROLE", "dataField": "nuserrolecode", "mandatory": true  , "mandatoryLabel":"IDS_SELECT", "controlType": "selectbox"},
            { "idsName": "IDS_PAGES", "dataField": "ndashboardhomepagecode", "mandatory": true  , "mandatoryLabel":"IDS_SELECT", "controlType": "selectbox"},
            { "idsName": "IDS_TEMPLATENAME", "dataField": "ndashboardhometemplatecode", "mandatory": true , "mandatoryLabel":"IDS_SELECT", "controlType": "selectbox" },
           
        ];
        this.extractedColumnList = [
            { "idsName": "IDS_PAGES", "dataField": "sdashboardhomepagename", "width": "200px" },
            { "idsName": "IDS_USERROLE", "dataField": "suserrolename", "width": "300px" }
        ];       
        const editParam = {
            screenName: this.props.Login.screenName, primaryKeyField: "ndashboardhomeprioritycode", operation: "update",
            inputParam: this.props.Login.inputParam, userInfo: this.props.Login.userInfo, ncontrolCode: editId
        };
        const deleteParam = { operation: "delete" };

        const mandatoryFields = [];
        this.mandatoryColumnList.forEach(item => item.mandatory === true ?
            mandatoryFields.push(item) : ""
        );

        return (
            <>
                <Row>
                    <Col>
                        <ListWrapper className="client-list-content">

                            {this.state.data ?
                                <DataGrid
                                    primaryKeyField={"ndashboardhomeprioritycode"}
                                    data={this.props.Login.masterData.DashBoardHomeConfig}
                                    dataResult={process(this.props.Login.masterData.DashBoardHomeConfig || [], this.state.dataState)}
                                    dataState={this.state.dataState}
                                    dataStateChange={this.dataStateChange}
                                    extractedColumnList={this.extractedColumnList}
                                    controlMap={this.state.controlMap}
                                    userRoleControlRights={this.state.userRoleControlRights}
                                    inputParam={this.props.Login.inputParam}
                                    // detailedFieldList={this.detailedFieldList}
                                    // expandField="expanded"
                                    userInfo={this.props.Login.userInfo}
                                    fetchRecord={this.props.getDashBoardHomePagesandTemplates}
                                    editParam={editParam}
                                    deleteParam={deleteParam}
                                    deleteRecord={this.deleteRecord}
                                    reloadData={this.reloadData}
                                    addRecord={() => this.props.getDashBoardHomePagesandTemplates(addParam)}

                                    gridHeight={"600px"}
                                    scrollable={"scrollable"}
                                    isActionRequired={true}
                                    isToolBarRequired={true}
                                    selectedId={this.props.Login.selectedId}
                                    pageable={true}
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
                                //formatMessage={this.props.intl.formatMessage}
                                onInputOnChange={this.onInputOnChange}
                                inputParam={this.props.Login.inputParam}
                                selectedRecord={this.state.selectedRecord || {}}
                            />
                            :
                            <AddDashBoardHomeConfig
                                selectedRecord={this.state.selectedRecord || {}}
                                onInputOnChange={this.onInputOnChange}
                                handleChange={this.handleChange}
                                onDrop={this.onDrop}
                                dashBoardHomePages={this.props.Login.dashBoardHomePages || []}
                                dashBoardHomeTemplate={this.props.Login.dashBoardHomeTemplate || []}
                                dashBoardType={this.props.Login.dashBoardType || []}
                                userRoleList={this.props.Login.userRoleList || []}
                                templateClick={this.templateClick}

                            />
                        }
                    />
                }
            </>
        );
    }

    componentDidUpdate(previousProps) {
        if (this.props.Login.masterData !== previousProps.Login.masterData) {

            let { dataState } = this.state;
            if (this.props.Login.dataState === undefined) {
                dataState = { skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5 }
            }

            if (this.props.Login.userInfo.nformcode !== previousProps.Login.userInfo.nformcode) {
                const userRoleControlRights = [];
                if (this.props.Login.userRoleControlRights) {
                    this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode] && Object.values(this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode]).map(item =>
                        userRoleControlRights.push(item.ncontrolcode))
                }
                const controlMap = getControlMap(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode)

                this.setState({  userRoleControlRights, controlMap,});
            }
            else {
                // let { dataState } = this.state;
                // if (this.props.Login.dataState === undefined) {
                //     dataState = { skip: 0, take: 10 }
                // }
                this.setState({ isOpen: false,dataState});
            }
        }
        if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord) {
            this.setState({ selectedRecord: this.props.Login.selectedRecord });
        }
    }

    onInputOnChange = (event) => {
        const selectedRecord = this.state.selectedRecord || {};
        if (event.target.type === 'checkbox') {
            if (event.target.name === "agree") {
                selectedRecord[event.target.name] = event.target.checked === true ? transactionStatus.YES : transactionStatus.NO;
            }
            else {
                selectedRecord[event.target.name] = event.target.checked === true ? transactionStatus.YES : transactionStatus.NO;
            }
        }
        else {
            selectedRecord[event.target.name] = event.target.value;
        }
        this.setState({ selectedRecord });
    }

    deleteRecord = (deleteParam) => {
        if (deleteParam.selectedRecord.expanded !== undefined) {
            delete deleteParam.selectedRecord.expanded;
        }
        const inputParam = {
            classUrl: this.props.Login.inputParam.classUrl,
            methodUrl: this.props.Login.inputParam.methodUrl,
            displayName: this.props.Login.inputParam.displayName,
            inputData: {
                "dashboardhomepriority": deleteParam.selectedRecord,
                "userinfo": this.props.Login.userInfo
            },
            operation: deleteParam.operation,
            dataState: this.state.dataState
        }
        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, deleteParam.ncontrolCode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData: this.props.Login.masterData },
                    openModal: true, screenName: this.props.intl.formatMessage({ id: this.props.Login.inputParam.displayName }),
                    operation: deleteParam.operation
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.crudMaster(inputParam, this.props.Login.masterData, "openModal");
        }
        //this.props.crudMaster(inputParam);
    }

    reloadData = () => {
        const inputParam = {
            inputData: { //"nsitecode": this.props.Login.userInfo.nmastersitecode 
                userinfo: this.props.Login.userInfo
            },
            classUrl: this.props.Login.inputParam.classUrl,
            methodUrl: this.props.Login.inputParam.methodUrl,
            displayName: this.props.Login.inputParam.displayName,
            userInfo: this.props.Login.userInfo
        };
        this.props.callService(inputParam);
    }

    onSaveClick = (saveType, formRef) => {
        //add / edit  
        let dataState = undefined;
        let operation = "";
        let inputData = [];
        let selectedId = null;

        inputData["userinfo"] = this.props.Login.userInfo;

        let data = [];

        // inputData["dashboardtype"] = { "nsitecode": this.props.Login.userInfo.nmastersitecode };
        inputData["dashboardhomepriority"] = {"ndashboardhometemplatecode": this.state.selectedRecord["ndashboardhometemplatecode"] ? this.state.selectedRecord["ndashboardhometemplatecode"] : -1};
        inputData["dashboardhomepriority"]["ndashboardhomepagecode"] = this.state.selectedRecord["ndashboardhomepagecode"] ? this.state.selectedRecord["ndashboardhomepagecode"].value : -1;
        inputData["dashboardhomepriority"]["nuserrolecode"] = this.state.selectedRecord["nuserrolecode"] ? this.state.selectedRecord["nuserrolecode"].value : -1;
        if (this.props.Login.operation !== "create") {
            inputData["dashboardhomepriority"]["ndashboardhomeprioritycode"] = this.state.selectedRecord["ndashboardhomeprioritycode"] ? this.state.selectedRecord["ndashboardhomeprioritycode"] : -1;
        }
        for (let i = 1; i <= 4; i++) {

            if (this.state.selectedRecord["dashboardtype" + i] && this.state.selectedRecord["dashboardtype" + i] !== undefined) {

                data.push({
                    "ndashboardtypecode": this.state.selectedRecord["dashboardtype" + i] ? this.state.selectedRecord["dashboardtype" + i].ndashboardtypecode : -1,
                    "nsorter": i                  
                });
            }
        }
        inputData["dashboardhometypes"] = data;

        if (this.props.Login.operation === "update") {

            operation = "update";
            dataState = this.state.dataState;
            selectedId = this.props.Login.selectedId;
        }
        else {

            operation = "create";
        }

        const inputParam = {
            classUrl: this.props.Login.inputParam.classUrl,
            methodUrl: this.props.Login.inputParam.methodUrl,
            displayName: this.props.Login.inputParam.displayName,
            inputData: inputData,
            operation: operation, saveType, formRef, dataState, selectedId
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
export default connect(mapStateToProps, { callService, crudMaster, getDashBoardHomePagesandTemplates, updateStore, validateEsignCredential })(injectIntl(DashBoardHomeConfig));