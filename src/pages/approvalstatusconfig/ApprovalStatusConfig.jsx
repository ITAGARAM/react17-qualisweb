
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { process } from '@progress/kendo-data-query';
import {
    callService, crudMaster, getApprovalSubType, closeFilterService, changeFilterSubmit, getComboService, getTransactionForms, updateStore, getRegTypeBySampleType, getFilterSubmit, getRegSubTypeByRegtype, validateEsignCredential, filterColumnData
} from '../../actions'
import { Col, Row } from 'react-bootstrap';
import {
    SampleType

} from '../../components/Enumeration';

import SlideOutModal from '../../components/slide-out-modal/SlideOutModal';
import CustomSwitch from '../../components/custom-switch/custom-switch.component';

import { Affix } from "rsuite";
import { toast } from 'react-toastify';
import { injectIntl } from 'react-intl';
import 'react-perfect-scrollbar/dist/css/styles.css';
import { getControlMap, showEsign, constructOptionList } from '../../components/CommonScript';
import { DEFAULT_RETURN } from '../../actions/LoginTypes';
import Esign from '../audittrail/Esign';
import { transactionStatus } from '../../components/Enumeration';
import { ListWrapper } from '../../components/client-group.styles';
import DataGrid from '../../components/data-grid/data-grid.component';
import ApprovalStatusConfigFilter from '../../pages/approvalstatusconfig/ApprovalStatusConfigFilter';
import BreadcrumbComponentToolbar from '../../components/ToolbarBreadcrumb.Component';
import AddApprovalStatusConfig from './AddApprovalStatusConfig';
class ApprovalStatusConfig extends Component {
    constructor(props) {
        super(props);

        this.formRef = React.createRef();
        const dataState = {
            skip: 0,
            take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5

        };
        this.state = {
            data: [], masterStatus: "", error: "", selectedRecord: {},
            dataResult: [],
            dataState: dataState,
            userRoleControlRights: [],
            controlMap: new Map(),
            group: [],
            selectedSwitch:false
        };

        this.detailedFieldList = [
            { "idsName": "IDS_STATUSFUNCTION", "dataField": "sapprovalstatusfunctions", "width": "150px", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
            //   { "idsName": "IDS_TRANSACTIONSTATUS", "dataField": "sdisplaystatus", "width": "150px", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" }
        ]

        this.extractedColumnList = [
            { "idsName": "IDS_STATUSFUNCTION", "dataField": "sapprovalstatusfunctions", "width": "150px", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
            { "idsName": "IDS_TRANSACTIONSTATUS", "dataField": "sdisplaystatus", "width": "150px", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" }
        ]
    }
    dataStateChange = (event) => {
        this.setState({
            dataResult: process(this.state.data, event.dataState),
            dataState: event.dataState
        });
    }
  
    // switchGroupBy = (event)=>{

    //     const selectedSwitch = event.target.checked === true ? transactionStatus.YES : transactionStatus.NO;
    //     let dataState = this.state.dataState || {};
    //      if (selectedSwitch === transactionStatus.YES){
    //         dataState= {...dataState, group: [{ field: 'sapprovalstatusfunctions' }]} ;
    //      }
    //     else{
    //         dataState= {skip: dataState.skip,  take: dataState.take} 
    //     }
    //     this.setState({selectedSwitch, dataState});
    // }

    closeFilter = () => {
    

        const inputData = {
            userinfo: this.props.Login.userInfo,
            nformcode: this.props.Login.masterData.realdefaultForms ? this.props.Login.masterData.realdefaultForms.value : -1,
            napprovalsubtypecode: this.props.Login.masterData.realSampleType.value === SampleType.Masters ? (this.props.Login.masterData.realApprovalSubType ? this.props.Login.masterData.realApprovalSubType.item.napprovalsubtypecode : -1) : -1,
            nregsubtypecode: this.props.Login.masterData.realSampleType.value === SampleType.Masters ? -1 : this.props.Login.masterData.realRegSubType ? this.props.Login.masterData.realRegSubType.value : -1,
            nregtypecode: this.props.Login.masterData.realSampleType.value === SampleType.Masters ? -1 : this.props.Login.masterData.realRegType ? this.props.Login.masterData.realRegType.value : -1,
            nsampletypecode: this.props.Login.masterData.realSampleType ? this.props.Login.masterData.realSampleType.value : -1,
            defaultSample: this.props.Login.masterData.realSampleType ? this.props.Login.masterData.realSampleType : "",
            defaultRegType: this.props.Login.masterData.realRegType ? this.props.Login.masterData.realRegType : "",
            defaultRegSubType: this.props.Login.masterData.realRegSubType ? this.props.Login.masterData.realRegSubType : "",
            defaultApprovalSubType: this.props.Login.masterData.realApprovalSubType ? this.props.Login.masterData.realApprovalSubType : "",
            defaultForms: this.props.Login.masterData.realdefaultForms ? this.props.Login.masterData.realdefaultForms : ""
        }
     
        const masterData = { ...this.props.Login.masterData }
        const inputParam = { masterData, inputData }
        this.props.closeFilterService(inputParam);

    }


    closeModal = () => {
        let loadEsign = this.props.Login.loadEsign;
        let openModal = this.props.Login.openModal;
        let selectedRecord = this.props.Login.selectedRecord;
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
    // expandChange = event => {
    //     const item = event.dataItem;
    //     const isExpanded =
    //         event.dataItem.expanded === undefined
    //             ? event.dataItem.aggregates
    //             : event.dataItem.expanded;
    //     event.dataItem.expanded = !isExpanded;
    //     this.setState({ ...this.state });
    //     //this.setState({ ...this.state.dataState });
    // };

    switchGroupBy = (event) => {

        const selectedSwitch = event.target.checked === true ? transactionStatus.YES : transactionStatus.NO;
        let dataState = this.state.dataState || {};
        let dataResult = this.state.dataResult || {};
        if (selectedSwitch === transactionStatus.YES) {
            dataState = { skip: 0, take: this.state.dataState.take, group: [{ field: 'sapprovalstatusfunctions' }] };
            dataResult = process(this.props.Login.masterData.approvalstatsusconfig || [], dataState)
        }
        else {
            dataState = { skip: 0, take: this.state.dataState.take }
            dataResult = process(this.props.Login.masterData.approvalstatsusconfig || [], dataState)
        }
        this.setState({ selectedSwitch, dataState, dataResult });
    }

    onComboChange = (comboData, fieldName) => {
        let inputData = [];
        if (fieldName === "nsampletypecode") {
            inputData = {
                userinfo: this.props.Login.userInfo,
                nsampletypecode: parseInt(comboData.value),
                defaultSample: comboData
            }
            const masterData = { ...this.props.Login.masterData }
            const inputParam = { masterData, inputData }
            this.props.getRegTypeBySampleType(inputParam);

        }
        else if (fieldName === "nformcode") {

            const masterData = { ...this.props.Login.masterData, defaultForms: comboData }
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: { masterData }
            }
            this.props.updateStore(updateInfo);
        }
        else if (fieldName == "napprovalsubtypecode") {
            const masterData = { ...this.props.Login.masterData, defaultApprovalSubType: comboData }
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: { masterData }
            }
            this.props.updateStore(updateInfo);
        }

        else if (fieldName == "nregtypecode") {
            inputData = {
                userinfo: this.props.Login.userInfo,
                nregtypecode: parseInt(comboData.value),
                nsampletypecode: this.props.Login.masterData.defaultSample.value,
                defaultRegType: comboData
            }
            const masterData = { ...this.props.Login.masterData }
            const inputParam = { masterData, inputData }
            this.props.getRegSubTypeByRegtype(inputParam)
        }

        else if (fieldName == "nregsubtypecode") {
            inputData = {
                userinfo: this.props.Login.userInfo,
                nregtypecode: this.props.Login.masterData.defaultRegType.value,
                defaultRegSubType: comboData,
                nregsubtypecode: comboData.value
            }
            const masterData = { ...this.props.Login.masterData }
            const inputParam = { masterData, inputData }
            this.props.getTransactionForms(inputParam);

        }
        else if (fieldName === "ntranscode") {
            const selectedRecord = this.state.selectedRecord || {};
            selectedRecord["ntranscode"] = comboData;
            this.setState({ selectedRecord });
        }
        else if (fieldName === "nstatusfunctioncode") {
            const selectedRecord = this.state.selectedRecord || {};
            selectedRecord["nstatusfunctioncode"] = comboData;
            this.setState({ selectedRecord });
        }
    }
    onFilterSubmit = () => {
        let inputData = [];
        inputData = {
            userinfo: this.props.Login.userInfo,
            nregtypecode: this.props.Login.masterData.defaultSample.value === SampleType.Masters ? transactionStatus.NA : parseInt(this.props.Login.masterData.defaultRegType ? this.props.Login.masterData.defaultRegType.value : -1),
            nregsubtypecode: this.props.Login.masterData.defaultSample.value === SampleType.Masters ? transactionStatus.NA : parseInt(this.props.Login.masterData.defaultRegSubType ? this.props.Login.masterData.defaultRegSubType.value : -1),
            nsampletypecode: this.props.Login.masterData.defaultSample.value,
            nformcode: this.props.Login.masterData.defaultForms ? this.props.Login.masterData.defaultForms.value : -1,
            napprovalsubtypecode: this.props.Login.masterData.defaultApprovalSubType ? this.props.Login.masterData.defaultApprovalSubType.item.napprovalsubtypecode : -1
        }

        let masterData = {
            ...this.props.Login.masterData,
            realSampleType: this.props.Login.masterData.defaultSample,
            realdefaultForms: this.props.Login.masterData.defaultForms,
            realRegType: this.props.Login.masterData.defaultRegType,
            realRegSubType: this.props.Login.masterData.defaultRegSubType,
            realApprovalSubType: this.props.Login.masterData.defaultApprovalSubType
        }
        let inputParam = { masterData, inputData };
        this.props.getFilterSubmit(inputParam);

    }

    deleteRecord = (deleteParam) => {
        const inputParam = {
            classUrl: this.props.Login.inputParam.classUrl,
            methodUrl: this.props.Login.inputParam.methodUrl,
            displayName: this.props.Login.inputParam.displayName,
            inputData: {
                [this.props.Login.inputParam.methodUrl.toLowerCase()]: deleteParam.selectedRecord,
                "nsampletypecode": this.props.Login.masterData.defaultSample.value,
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

        let inputData = [];
        inputData["approvalstatusconfig"] = [];
        inputData["userinfo"] = this.props.Login.userInfo;
        let dataState = undefined;
        let selectedId = null;
        let selectedTrans = [];

        this.state.selectedRecord.ntranscode && this.state.selectedRecord.ntranscode.map(data => {
            selectedTrans.push({
                nformcode: this.props.Login.masterData.realdefaultForms ? this.props.Login.masterData.realdefaultForms.value : -1,
                nstatusfunctioncode: this.state.selectedRecord["nstatusfunctioncode"] ? this.state.selectedRecord["nstatusfunctioncode"].value : -1,
                napprovalsubtypecode: this.props.Login.masterData.realSampleType.value === SampleType.Masters ? (this.props.Login.masterData.realApprovalSubType ? this.props.Login.masterData.realApprovalSubType.item.napprovalsubtypecode : -1) : -1,
                nregsubtypecode: this.props.Login.masterData.realSampleType.value === SampleType.Masters ? -1 : this.props.Login.masterData.realRegSubType ? this.props.Login.masterData.realRegSubType.value : -1,
                nregtypecode: this.props.Login.masterData.realSampleType.value === SampleType.Masters ? -1 : this.props.Login.masterData.realRegType ? this.props.Login.masterData.realRegType.value : -1,
                nsampletypecode: this.props.Login.masterData.realSampleType ? this.props.Login.masterData.realSampleType.value : -1,
                ntranscode: data.item.ntranscode
            })

        })
        inputData["approvalstatusconfig"] = selectedTrans;
        const inputParam = {
            classUrl: this.props.Login.inputParam.classUrl,
            methodUrl: this.props.Login.inputParam.methodUrl,
            displayName: this.props.Login.inputParam.displayName,
            inputData: inputData, selectedId, dataState,
            operation: this.props.Login.operation, saveType, formRef
        }

        const esignNeeded = showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolCode);
        if (esignNeeded) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData: this.props.Login.masterData },
                    openModal: true, screenName: this.props.intl.formatMessage({ id: "IDS_APPROVALSTATUSCONFIG" }),
                    operation: this.props.Login.operation
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.crudMaster(inputParam, this.props.Login.masterData, "openModal");
        }

    }


    render() {
        
        const addId = this.props.Login.inputParam && this.state.controlMap.has("Add".concat(this.props.Login.inputParam.methodUrl))
            && this.state.controlMap.get("Add".concat(this.props.Login.inputParam.methodUrl)).ncontrolcode;

        const addParam = {
            screenName: this.props.Login.displayName, primaryeyField: "nstatusconfigcode", primaryKeyValue: undefined,
            operation: "create", inputParam: this.props.Login.inputParam, userInfo: this.props.Login.userInfo, ncontrolCode: addId,
            nsampletypecode: this.props.Login.masterData.realSampleType ? this.props.Login.masterData.realSampleType.value : -1,
            nregtypecode: this.props.Login.masterData.realRegType ? this.props.Login.masterData.realRegType.value : -1,
            nregsubtypecode: this.props.Login.masterData.realRegSubType ? this.props.Login.masterData.realRegSubType.value : -1,
            nformcode: this.props.Login.masterData.realdefaultForms ? this.props.Login.masterData.realdefaultForms.value : -1,
            napprovalsubtypecode: this.props.Login.masterData.realApprovalSubType ? this.props.Login.masterData.realApprovalSubType.value : -1
        };

        const deleteParam = { operation: "delete" };


        let breadCrumbData = [];
        this.props.Login.masterData.realSampleType && this.props.Login.masterData.realSampleType.value == 4 ?
            breadCrumbData = [
                {
                    "label": "IDS_SAMPLETYPE",
                    "value": this.props.Login.masterData.realSampleType ? this.props.Login.masterData.realSampleType.label : "-"
                },

                {
                    "label": "IDS_FORMNAME",
                    "value": this.props.Login.masterData.realdefaultForms ? this.props.Login.masterData.realdefaultForms.label : "-"
                }

            ]
            :
            breadCrumbData = [
                {
                    "label": "IDS_SAMPLETYPE",
                    "value": this.props.Login.masterData.realSampleType ? this.props.Login.masterData.realSampleType.label : "-"
                },
                {
                    "label": "IDS_REGTYPE",
                    "value": this.props.Login.masterData.realRegType ? this.props.Login.masterData.realRegType.label : "-"
                },

                {
                    "label": "IDS_REGSUBTYPE",
                    "value": this.props.Login.masterData.realRegSubType ? this.props.Login.masterData.realRegSubType.label : "-"
                },
                {
                    "label": "IDS_FORMNAME",
                    "value": this.props.Login.masterData.realdefaultForms ? this.props.Login.masterData.realdefaultForms.label : "-"
                }
            ]

        this.props.Login.masterData && this.props.Login.masterData.realdefaultForms && this.props.Login.masterData.realdefaultForms.value === 55 &&
            breadCrumbData.push(
                {

                    "label": "IDS_APPROVALSUBTYPE",
                    "value": this.props.Login.masterData.realApprovalSubType ? this.props.Login.masterData.realApprovalSubType.label : "-"
                }

            )
        return (
            <>

                <div className="client-listing-wrap mtop-fixed-breadcrumb fixed_breadcrumd">
                    <Affix top={53}>
                        <BreadcrumbComponentToolbar
                            showSearch={false}
                            showSwitch={true}
                            closeFilter={this.closeFilter}
                            callCloseFunction={true}
                            breadCrumbItem={breadCrumbData}
                            filterComponent={[
                                {
                                    "IDS_APPROVALSTATUSCONFIG": <ApprovalStatusConfigFilter
                                        formatMessage={this.props.intl.formatMessage}
                                        defaultForms={this.props.Login.masterData["defaultForms"] || []}
                                        defaultSample={this.props.Login.masterData["defaultSample"] || []}
                                        defaultRegType={this.props.Login.masterData["defaultRegType"] || []}
                                        defaultRegSubType={this.props.Login.masterData["defaultRegSubType"] || []}
                                        defaultApprovalSubType={this.props.Login.masterData["defaultApprovalSubType"] || []}
                                        userInfo={this.props.Login.userInfo || {}}
                                        SampleTypes={this.state.SampleTypes || []}
                                        approvalSubType={this.state.approvalSubType || []}
                                        qualisForms={this.state.qualisForms || []}
                                        registrationTypes={this.state.registrationTypes || []}
                                        regSubTypeList={this.state.regSubTypeList || []}
                                        onComboChange={this.onComboChange}
                                    />
                                }]}
                            onFilterSubmit={this.onFilterSubmit}
                            switchGroupBy={this.switchGroupBy}
                            selectedSwitch={this.state.selectedSwitch}
                            
                        />
                    </Affix>
                    <Row>
                    <Col>
                        <ListWrapper className="client-list-content">

                            {this.state.data ?
                                <DataGrid

                                    primaryKeyField={"nstatusconfigcode"}
                                    data={this.state.data}
                                    dataResult={this.state.dataResult}
                                    dataState={this.state.dataState}
                                    dataStateChange={this.dataStateChange}
                                    extractedColumnList={this.extractedColumnList}
                                    reloadData={this.reloadData}
                                    controlMap={this.state.controlMap}
                                    userRoleControlRights={this.state.userRoleControlRights}
                                    inputParam={this.props.Login.inputParam}
                                    userInfo={this.props.Login.userInfo}
                                    pageable={true}
                                    deleteParam={deleteParam}
                                    deleteRecord={this.deleteRecord}
                                    scrollable={'scrollable'}
                                    isToolBarRequired={true}
                                    gridHeight={'600px'}
                                    isActionRequired={true}
                                    selectedId={this.props.Login.selectedId}
                                    addRecord={() => this.props.getComboService(addParam)}

                                />
                                : ""}
                        </ListWrapper>
                    </Col>
                </Row>
                </div>
               
              
                { }
                {this.props.Login.openModal ?
                    <SlideOutModal
                        show={this.props.Login.openModal}
                        closeModal={this.closeModal}
                        operation={this.props.Login.operation}
                        inputParam={this.props.Login.inputParam}
                        screenName={this.props.Login.screenName}
                        validateEsign={this.validateEsign}
                        onSaveClick={this.onSaveClick}
                        esign={this.props.Login.loadEsign}
                        masterStatus={this.props.Login.masterStatus}
                        updateStore={this.props.updateStore}
                        selectedRecord={this.state.selectedRecord || {}}
                        mandatoryFields={[
                            { "mandatory": true, "idsName": "IDS_STATUSFUNCTION", "dataField": "nstatusfunctioncode", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
                            { "mandatory": true, "idsName": "IDS_TRANSACTIONSTATUS", "dataField": "ntranscode", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" }]}
                        addComponent={this.props.Login.loadEsign ?
                            <Esign operation={this.props.Login.operation}
                                onInputOnChange={this.onInputOnChange}
                                inputParam={this.props.Login.inputParam}
                                selectedRecord={this.state.selectedRecord || {}}
                            />
                            : <AddApprovalStatusConfig
                                selectedRecord={this.state.selectedRecord || {}}
                                onInputOnChange={this.onInputOnChange}
                                onComboChange={this.onComboChange}
                                statusFunctionList={this.props.Login.statusFunctionList || []}
                                transactionsList={this.props.Login.transactionsList || []}
                                operation={this.props.Login.operation}
                                inputParam={this.props.Login.inputParam}
                            />}
                    />
                    : ""}


            </>);

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

    reloadData = () => {

        const inputData = {
            userinfo: this.props.Login.userInfo,
            nformcode: this.props.Login.masterData.realdefaultForms ? this.props.Login.masterData.realdefaultForms.value : -1,
            napprovalsubtypecode: this.props.Login.masterData.realSampleType.value === SampleType.Masters ? (this.props.Login.masterData.realApprovalSubType ? this.props.Login.masterData.realApprovalSubType.item.napprovalsubtypecode : -1) : -1,
            nregsubtypecode: this.props.Login.masterData.realSampleType.value === SampleType.Masters ? -1 : this.props.Login.masterData.realRegSubType ? this.props.Login.masterData.realRegSubType.value : -1,
            nregtypecode: this.props.Login.masterData.realSampleType.value === SampleType.Masters ? -1 : this.props.Login.masterData.realRegType ? this.props.Login.masterData.realRegType.value : -1,
            nsampletypecode: this.props.Login.masterData.realSampleType ? this.props.Login.masterData.realSampleType.value : -1,
            defaultSample: this.props.Login.masterData.realSampleType ? this.props.Login.masterData.realSampleType : "",
            defaultRegType: this.props.Login.masterData.realRegType ? this.props.Login.masterData.realRegType : "",
            defaultRegSubType: this.props.Login.masterData.realRegSubType ? this.props.Login.masterData.realRegSubType : "",
            defaultApprovalSubType: this.props.Login.masterData.realApprovalSubType ? this.props.Login.masterData.realApprovalSubType : "",
            defaultForms: this.props.Login.masterData.realdefaultForms ? this.props.Login.masterData.realdefaultForms : ""
        }
        // console.log("close inputdata");
        // inputData["breadcrumdata"] = breadcrumdata;
        const masterData = { ...this.props.Login.masterData }
        const inputParam = { masterData, inputData }
        this.props.closeFilterService(inputParam);
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
                    userRoleControlRights, controlMap,
                    data: this.props.Login.masterData.approvalstatsusconfig,
                    dataResult: process(this.props.Login.masterData.approvalstatsusconfig,
                        this.state.dataState)
                });
            }
            else {
                let { dataState } = this.state;
                if (this.props.Login.dataState === undefined) {
                    if (this.state.selectedSwitch === transactionStatus.YES) {
                        dataState = { skip: 0, take: this.state.dataState.take, group: [{ field: 'sapprovalstatusfunctions' }] }
                    }
                    else {
                        dataState = { skip: 0, take: this.state.dataState.take }
                    }

                }

                if (this.state.selectedSwitch === transactionStatus.YES) {
                    if (this.state.dataResult.data) {
                        if (this.state.dataResult.data.length === 1) {
                            if (this.state.dataResult.data[0].items.length === 1) {
                                let skipcount = this.state.dataState.skip > 0 ? (this.state.dataState.skip - this.state.dataState.take) :
                                    this.state.dataState.skip
                                dataState = { skip: skipcount, take: this.state.dataState.take, group: [{ field: 'sapprovalstatusfunctions' }] }
                            }
                        }
                    }
                }
                else {
                    if (this.state.dataResult.data) {
                        if (this.state.dataResult.data.length === 1) {
                            let skipcount = this.state.dataState.skip > 0 ? (this.state.dataState.skip - this.state.dataState.take) :
                                this.state.dataState.skip
                            dataState = { skip: skipcount, take: this.state.dataState.take }
                        }
                    }
                }





                this.setState({
                    data: this.props.Login.masterData.approvalstatsusconfig || [], selectedRecord: this.props.Login.selectedRecord,
                    dataResult: process(this.props.Login.masterData.approvalstatsusconfig || [], dataState),
                    dataState
                });

            }
            let SampleTypes = this.state.SampleTypes || [];
            let qualisForms = this.state.qualisForms || [];
            let approvalSubType = this.state.approvalSubType || {};
            let registrationTypes = this.state.registrationTypes || {};
            let regSubTypeList = this.state.regSubTypeList || {};

            if (this.props.Login.masterData.SampleTypes !== previousProps.Login.masterData.SampleTypes) {
                SampleTypes = constructOptionList(this.props.Login.masterData.SampleTypes || [], "nsampletypecode",
                    "ssampletypename", undefined, undefined, false).get("OptionList");
            }

            if (this.props.Login.masterData.qualisForms !== previousProps.Login.masterData.qualisForms) {
                qualisForms = constructOptionList(this.props.Login.masterData.qualisForms || [], "nformcode",
                    "sdisplayname", undefined, undefined, false).get("OptionList");
            }

            if (this.props.Login.masterData.approvalSubType !== previousProps.Login.masterData.approvalSubType) {
                approvalSubType = constructOptionList(this.props.Login.masterData.approvalSubType || [], "napprovalsubtypecode",
                    "ssubtypename", undefined, undefined, false).get("OptionList");

            }

            if (this.props.Login.masterData.registrationTypes !== previousProps.Login.masterData.registrationTypes) {
                registrationTypes = constructOptionList(this.props.Login.masterData.registrationTypes || [], "nregtypecode",
                    "sregtypename", undefined, undefined, false).get("OptionList");

            }
            if (this.props.Login.masterData.regSubTypeList !== previousProps.Login.masterData.regSubTypeList) {
                regSubTypeList = constructOptionList(this.props.Login.masterData.regSubTypeList || [], "nregsubtypecode",
                    "sregsubtypename", undefined, undefined, false).get("OptionList");

            }


            this.setState({ SampleTypes, qualisForms, approvalSubType, registrationTypes, regSubTypeList });
        }
        else if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord) {
            this.setState({ selectedRecord: this.props.Login.selectedRecord });
        }

    }
}
const mapStateToProps = (state) => {
    return {
        Login: state.Login
    }
}


export default connect(mapStateToProps, {
    callService, crudMaster,
    updateStore, validateEsignCredential, closeFilterService, getComboService, getTransactionForms, getFilterSubmit, getRegSubTypeByRegtype, getRegSubTypeByRegtype, filterColumnData, getApprovalSubType, getRegTypeBySampleType, changeFilterSubmit,
})(injectIntl(ApprovalStatusConfig));