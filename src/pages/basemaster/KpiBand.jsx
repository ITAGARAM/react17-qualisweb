import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Row, Col, FormGroup, FormLabel } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { process } from '@progress/kendo-data-query';
import DataGrid from '../../components/data-grid/data-grid.component';
import SlideOutModal from '../../components/slide-out-modal/SlideOutModal';
import Esign from '../audittrail/Esign';
import AddKpiBand from './AddKpiBand';
import { callService, crudMaster, updateStore, validateEsignCredential, getKpiBandComboService } from '../../actions';
import { DEFAULT_RETURN } from '../../actions/LoginTypes';
import {constructOptionList, getControlMap, showEsign } from '../../components/CommonScript';
import { ListWrapper } from '../../components/client-group.styles';
import { MediaLabel } from '../../components/add-client.styles';

const mapStateToProps = state => {
    return ({ Login: state.Login })
}

class KpiBand extends React.Component {
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
            kpiBandData: [],
            userRoleControlRights: [],
            controlMap: new Map(),
            selectedRecord: {},
            periodList:[],productList:[]
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
        let selectedId = this.props.Login.selectedId;
        let selectedRecord = this.state.selectedRecord; //this.props.Login.selectedRecord;
        if (this.props.Login.loadEsign) {
            if (this.props.Login.operation === "delete") {
                loadEsign = false;
                openModal = false;
                selectedRecord = {};
                selectedId = null;
            }
            else {
                loadEsign = false;

            }
        }
        else {
            openModal = false;
            selectedId = null;
            selectedRecord = {};
        }

        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { openModal, loadEsign, selectedRecord, selectedId }
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
        if (props.Login.selectedRecord === undefined) {
            return { selectedRecord: {} }
        }
        return null;
    }

    render() {

        this.extractedColumnList = [
            { "idsName": "IDS_PRODUCTNAME", "dataField": "sproductname", "width": "200px" },
            { "idsName": "IDS_KPIBANDNAME", "dataField": "skpibandname", "width": "200px" },
            { "idsName": "IDS_NUMBEROFDAYS", "dataField": "nnumberofdays", "width": "200px" },
            { "idsName": "IDS_BEFOREWINDOWPERIOD", "dataField": "nbeforewindowperiod", "width": "200px" },
            { "idsName": "IDS_AFTERWINDOWPERIOD", "dataField": "nafterwindowperiod", "width": "200px" },
            // { "idsName": "IDS_BEFOREWINDOWPERIOD", "dataField": "nbeforewindowperiod", "width": "200px" },
            // { "idsName": "IDS_BEFOREPERIODCODE", "dataField": "sbeforeperiodname", "width": "200px" },
            // { "idsName": "IDS_AFTERWINDOWPERIOD", "dataField": "nafterwindowperiod", "width": "200px" },
            // { "idsName": "IDS_AFTERPERIODCODE", "dataField": "safterperiodname", "width": "200px" },

        ]
        //primaryKeyField = "nkpibandcode";

        this.validationColumnList = [
            { "idsName": "IDS_PRODUCTNAME", "dataField": "nproductcode", "width": "200px","mandatory": true  , "mandatoryLabel":"IDS_SELECT", "controlType": "selectbox"},
            { "idsName": "IDS_KPIBANDNAME", "dataField": "skpibandname", "width": "200px","mandatory": true  , "mandatoryLabel":"IDS_ENTER", "controlType": "textbox"},
            { "idsName": "IDS_NUMBEROFDAYS", "dataField": "nnumberofdays", "width": "200px","mandatory": true  , "mandatoryLabel":"IDS_ENTER", "controlType": "textbox"},
             { "idsName": "IDS_BEFOREWINDOWPERIOD", "dataField": "nbeforewindowperiod", "width": "200px","mandatory": true  , "mandatoryLabel":"IDS_ENTER", "controlType": "textbox"},
             { "idsName": "IDS_BEFOREPERIODCODE", "dataField": "nbeforeperiodcode", "width": "200px","mandatory": true , "mandatoryLabel":"IDS_ENTER", "controlType": "textbox" },
             { "idsName": "IDS_AFTERWINDOWPERIOD", "dataField": "nafterwindowperiod", "width": "200px","mandatory": true  , "mandatoryLabel":"IDS_ENTER", "controlType": "textbox"},
             { "idsName": "IDS_AFTERPERIODCODE", "dataField": "nafterperiodcode", "width": "200px","mandatory": true , "mandatoryLabel":"IDS_ENTER", "controlType": "textbox" },

        ]

        this.fieldList = ["skpibandname", "nnumberofdays", "nbeforewindowperiod", "nbeforeperiodcode", "nafterwindowperiod", "nafterperiodcode", "nproductcode"];

        const addId = this.state.controlMap.has("AddKpiBand") && this.state.controlMap.get("AddKpiBand").ncontrolcode;
        const editId = this.state.controlMap.has("EditKpiBand") && this.state.controlMap.get("EditKpiBand").ncontrolcode;
        const deleteId = this.state.controlMap.has("DeleteKpiBand") && this.state.controlMap.get("DeleteKpiBand").ncontrolcode;

        const kpiBandAddParam = {
            screenName: "KPI Band", operation: "create", primaryKeyField: "nkpibandcode",
            userInfo: this.props.Login.userInfo, ncontrolCode: addId
        };

        const kpiBandEditParam = {
            screenName: "KPI Band", operation: "update", primaryKeyField: "nkpibandcode",
            userInfo: this.props.Login.userInfo, ncontrolCode: editId
        };

        const kpiBandDeleteParam = { screenName: "KpiBand", methodUrl: "KpiBand", operation: "delete", ncontrolCode: deleteId };
        const mandatoryFields = [];
        this.validationColumnList.forEach(item => item.mandatory === true ?
            mandatoryFields.push(item) : ""
        );

        return (<>
                <Row>
                    <Col>
                        <ListWrapper className="client-list-content">
                            {/* <PrimaryHeader className="d-flex justify-content-between mb-3">
                                <HeaderName className="header-primary-md">
                                    {this.props.Login.inputParam && this.props.Login.inputParam.displayName ?
                                        <FormattedMessage id={this.props.Login.inputParam.displayName} /> : ""}
                                </HeaderName>

                                <Button className="btn btn-user btn-primary-blue"
                                    hidden={this.props.Login.inputParam && this.state.userRoleControlRights.indexOf(addId) === -1}
                                    onClick={() => this.props.getKpiBandComboService(kpiBandAddParam)} role="button">
                                    <FontAwesomeIcon icon={faPlus} /> { }
                                    <FormattedMessage id={"IDS_ADD"} defaultMessage='Add' />
                                </Button>
                            </PrimaryHeader> */}

                            {this.state.data ?
                                <DataGrid
                                    primaryKeyField={"nkpibandcode"}
                                    expandField="expanded"
                                    detailedFieldList={this.detailedFieldList}
                                    data={this.state.data}
                                    dataResult={this.state.dataResult}
                                    dataState={this.state.dataState}
                                    dataStateChange={this.dataStateChange}
                                    extractedColumnList={this.extractedColumnList}
                                    controlMap={this.state.controlMap}
                                    userRoleControlRights={this.state.userRoleControlRights}
                                    inputParam={this.props.Login.inputParam}
                                    userInfo={this.props.Login.userInfo}
                                    fetchRecord={this.props.getKpiBandComboService} //fetchRecord}
                                    editParam={kpiBandEditParam}
                                    deleteRecord={this.deleteRecord}
                                    deleteParam={kpiBandDeleteParam}
                                    reloadData={this.reloadData}
                                    addRecord={() => this.props.getKpiBandComboService(kpiBandAddParam)}
                                    pageable={{ buttonCount: 4, pageSizes: true }}
                                    // scrollable={"auto"}
                                    scrollable={'scrollable'}
                                    gridHeight = {"600px"}
                                    isActionRequired={true}
                                    isToolBarRequired={true}
                                    selectedId={this.props.Login.selectedId}
                                    // isComponent={true}
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
                            : <AddKpiBand
                                selectedRecord={this.state.selectedRecord || {}}
                                onInputOnChange={this.onInputOnChange}
                                onNumericInputOnChange={this.onNumericInputOnChange}
                                onComboChange={this.onComboChange}
                                formatMessage={this.props.intl.formatMessage}
                                productList={this.state.productList || []}//{this.props.Login.productList || []}
                                periodList={this.state.periodList || []}//{this.props.Login.periodList || []}
                                operation={this.props.Login.operation}
                                inputParam={this.props.Login.inputParam}
                            />}
                    />
                }
            </>);
    }

    expandChange = (event) => {
        const isExpanded =
            event.dataItem.expanded === undefined ?
                event.dataItem.aggregates : event.dataItem.expanded;
        event.dataItem.expanded = !isExpanded;
        this.setState({ ...this.props });
    }
    detailBand = (props) => {

        const Dataitem = props.dataItem
        const OptionalFieldList = [
            { datafield: "nbeforewindowperiod", Column: "Before Window Period" },
            { datafield: "sbeforeperiodname", Column: "Before Period Code" },
            { datafield: "nafterwindowperiod", Column: "After Window Period" },
            { datafield: "safterperiodname", Column: "After Period Code" },
        ];
        return (<Row>
            {OptionalFieldList.map((fields) => {
                return (
                    <Col md='6'>
                        <FormGroup>
                            <FormLabel><FormattedMessage id={fields.Column} message={fields.Column} /></FormLabel>
                            <MediaLabel className="readonly-text font-weight-normal">{Dataitem[fields.datafield]}</MediaLabel>
                        </FormGroup>
                    </Col>
                )
            })
            }
        </Row>)
    }
    detailedFieldList = [
        { dataField: "nbeforewindowperiod", idsName: "IDS_BEFOREWINDOWPERIOD" },
        { dataField: "sbeforeperiodname", idsName: "IDS_BEFOREPERIODCODE" },
        { dataField: "nafterwindowperiod", idsName: "IDS_AFTERWINDOWPERIOD" },
        { dataField: "safterperiodname", idsName: "IDS_AFTERPERIODCODE" },
        //{ "idsName": "IDS_DISPLAYSTATUS", "dataField": "sdisplaystatus", "width": "20%", "isIdsField": true, "controlName": "ndefaultstatus" }

    ];

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
        if(this.props.Login.periodList !== previousProps.Login.periodList || this.props.Login.productList !== previousProps.Login.productList ){

                const  periodList  = constructOptionList(this.props.Login.periodList ||[], "nperiodcode",
                "speriodname" , undefined, undefined, undefined);
            const  periodListKPI  = periodList.get("OptionList");

            const  productList  = constructOptionList(this.props.Login.productList ||[], "nproductcode",
                "sproductname" , undefined, undefined, undefined);
            const  productListKPI  = productList.get("OptionList");

            this.setState({ periodList: periodListKPI, productList: productListKPI});
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

    onNumericInputOnChange = (value, name) => {
        const selectedRecord = this.state.selectedRecord || {};
        if (value < 0) { //|| value === 0.0) {
            selectedRecord[name] = '';
            this.setState({ selectedRecord });
        }
        else {
            selectedRecord[name] = value;
            this.setState({ selectedRecord });
        }
    }

    deleteRecord = (deleteparam) => {
        if (deleteparam.selectedRecord.expanded !== undefined) {
            delete deleteparam.selectedRecord.expanded
        }
        const inputParam = {
            classUrl: this.props.Login.inputParam.classUrl,
            methodUrl: deleteparam.methodUrl,
            displayName: this.props.Login.inputParam.displayName,
            selectedId: deleteparam.selectedRecord.nkpibandcode,
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
                    screenName: deleteparam.screenName,
                    operation: deleteparam.operation,
                    selectedId: deleteparam.selectedRecord.nkpibandcode
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
        let selectedId = null;
        if (this.props.Login.operation === "update") {
            // edit
            inputData[this.props.Login.inputParam.methodUrl.toLowerCase()] = JSON.parse(JSON.stringify(this.state.selectedRecord));

            this.fieldList.map(item => {
                return inputData[this.props.Login.inputParam.methodUrl.toLowerCase()][item] = this.state.selectedRecord[item]
            })

            inputData["kpiband"]["nproductcode"] = this.state.selectedRecord["nproductcode"] ? this.state.selectedRecord["nproductcode"].value : -1;
            inputData["kpiband"]["nbeforeperiodcode"] = this.state.selectedRecord["nbeforeperiodcode"] ? this.state.selectedRecord["nbeforeperiodcode"].value : -1;
            inputData["kpiband"]["nafterperiodcode"] = this.state.selectedRecord["nafterperiodcode"] ? this.state.selectedRecord["nafterperiodcode"].value : -1;
            dataState = this.state.dataState;
            selectedId = this.props.Login.selectedId
        }
        else {
            //add               
            inputData[this.props.Login.inputParam.methodUrl.toLowerCase()] = { "nsitecode": this.props.Login.userInfo.nmastersitecode };


            this.fieldList.map(item => {
                return inputData[this.props.Login.inputParam.methodUrl.toLowerCase()][item] = this.state.selectedRecord[item]
            })

            inputData["kpiband"]["nproductcode"] = this.state.selectedRecord["nproductcode"] ? this.state.selectedRecord["nproductcode"].value : -1;
            inputData["kpiband"]["nbeforeperiodcode"] = this.state.selectedRecord["nbeforeperiodcode"] ? this.state.selectedRecord["nbeforeperiodcode"].value : -1;
            inputData["kpiband"]["nafterperiodcode"] = this.state.selectedRecord["nafterperiodcode"] ? this.state.selectedRecord["nafterperiodcode"].value : -1;
        }

        const inputParam = {
            classUrl: this.props.Login.inputParam.classUrl,
            methodUrl: this.props.Login.inputParam.methodUrl,
            displayName: this.props.Login.inputParam.displayName,
            selectedId,
            inputData: inputData,
            operation: this.props.Login.operation, saveType, formRef, dataState
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
            // let selectedRecord = {};
            // this.setState({ selectedRecord });
        }
        else {
            this.props.crudMaster(inputParam, this.props.Login.masterData, "openModal");
            // let selectedRecord = {};
            // this.setState({ selectedRecord });
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

export default connect(mapStateToProps, {
    callService, crudMaster, updateStore, validateEsignCredential,
    getKpiBandComboService
})(injectIntl(KpiBand));