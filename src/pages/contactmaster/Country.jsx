import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Row, Col, FormGroup, FormLabel } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { process } from '@progress/kendo-data-query';
import DataGrid from '../../components/data-grid/data-grid.component';
import AddCountry from './AddCountry';
import Esign from '../../pages/audittrail/Esign';
import SlideOutModal from '../../components/slide-out-modal/SlideOutModal';
import { ListWrapper, PrimaryHeader } from '../../components/client-group.styles';
import { MediaLabel } from '../../components/add-client.styles';
import rsapi from '../../rsapi';
import { callService, crudMaster, updateStore, validateEsignCredential, fetchRecord } from '../../actions';
import { DEFAULT_RETURN, UN_AUTHORIZED_ACCESS } from '../../actions/LoginTypes';
import { getControlMap, showEsign } from '../../components/CommonScript';
import { intl } from '../../components/App';
//import FirstFile from '../rulespackage/FirstFile';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';

const mapStateToProps = state => {
    return ({ Login: state.Login })
}

class Country extends React.Component {
    constructor(props) {
        super(props);
        this.formRef = React.createRef();
        this.extractedColumnList = [];
        this.fieldList = [];

        const dataState = {
            skip: 0,
            take: this.props.settings ? parseInt(this.props.settings[14]) : 5,
        };
        this.state = {
            data: [], masterStatus: "", error: "", selectedRecord: {},
            dataResult: [],
            dataState: dataState,
            isOpen: false,
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
        let selectedRecord = { "ndefaultstatus": 4 };
        //let selectedRecord = {};
        if (this.props.Login.userInfo.nformcode === 12) {
            selectedRecord = { "nsafetymarkermand": 4 }
        }
        else if (this.props.Login.userInfo.nformcode === 13) {
            selectedRecord = { "nproducttypemand": 4 }
        }
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                selectedRecord, operation: "create", ncontrolCode, selectedId: null,
                openModal: true, screenName: this.props.Login.inputParam.displayName
            }
        }
        this.props.updateStore(updateInfo);
    }


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
                selectedId = null;
            }
            else {
                loadEsign = false;
                selectedRecord['esignpassword'] = ""
                selectedRecord['esigncomments'] = ""
                selectedRecord['esignreason']=""
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
            { "idsName": "IDS_COUNTRYNAME", "dataField": "scountryname", "width": "200px","mandatory": true , "mandatoryLabel":"IDS_ENTER", "controlType": "textbox"},
            { "idsName": "IDS_COUNTRYABBREVIATION", "dataField": "scountryshortname", "width": "200px" , "mandatoryLabel":"IDS_ENTER", "controlType": "textbox"},
            // { "idsName": "IDS_TWOCHARCOUNTRY", "dataField": "stwocharcountry", "width": "200px" , "mandatoryLabel":"IDS_ENTER", "controlType": "textbox"},
            // { "idsName": "IDS_THREECHARCOUNTRY", "dataField": "sthreecharcountry", "width": "200px", "mandatoryLabel":"IDS_ENTER", "controlType": "textbox" },
            // { "idsName": "IDS_POOLCOUNTRY", "dataField": "spoolcountrystatus", "width": "200px", "isIdsField": true, "controlName": "npoolcountry", "mandatoryLabel":"IDS_ENTER", "controlType": "textbox" },
            // { "idsName": "IDS_BATCHCOUNTRY", "dataField": "sbatchcountrystatus", "width": "200px", "isIdsField": true, "controlName": "nbatchcountry" , "mandatoryLabel":"IDS_ENTER", "controlType": "textbox"}
        ]

        this.validationColumnList = [
            { "idsName": "IDS_COUNTRYNAME", "dataField": "scountryname", "width": "200px","mandatory": true , "mandatoryLabel":"IDS_ENTER", "controlType": "textbox"},
            { "idsName": "IDS_COUNTRYABBREVIATION", "dataField": "scountryshortname", "width": "150px","mandatory": true, "mandatoryLabel":"IDS_ENTER", "controlType": "textbox" },
            // { "idsName": "IDS_TWOCHARCOUNTRY", "dataField": "stwocharcountry", "width": "150px","mandatory": true , "mandatoryLabel":"IDS_ENTER", "controlType": "textbox"},
            // { "idsName": "IDS_THREECHARCOUNTRY", "dataField": "sthreecharcountry", "width": "200px", "mandatoryLabel":"IDS_ENTER", "controlType": "textbox" },
            // { "idsName": "IDS_POOLCOUNTRY", "dataField": "spoolcountrystatus", "width": "200px", "isIdsField": true, "controlName": "npoolcountry" , "mandatoryLabel":"IDS_ENTER", "controlType": "textbox"},
            // { "idsName": "IDS_BATCHCOUNTRY", "dataField": "sbatchcountrystatus", "width": "200px", "isIdsField": true, "controlName": "nbatchcountry", "mandatoryLabel":"IDS_ENTER", "controlType": "textbox" }
        ]
        
        this.fieldList = ["scountryname", "scountryshortname", "stwocharcountry", "sthreecharcountry"];



        const addId = this.props.Login.inputParam && this.state.controlMap.has("Add".concat(this.props.Login.inputParam.methodUrl))
            && this.state.controlMap.get("Add".concat(this.props.Login.inputParam.methodUrl)).ncontrolcode;

        const editId = this.props.Login.inputParam && this.state.controlMap.has("Edit".concat(this.props.Login.inputParam.methodUrl))
            && this.state.controlMap.get("Edit".concat(this.props.Login.inputParam.methodUrl)).ncontrolcode;

        const editParam = {
            screenName: this.props.Login.inputParam && this.props.Login.inputParam.displayName && this.props.intl.formatMessage({ id: this.props.Login.inputParam.displayName }), operation: "update",
            primaryKeyField: "ncountrycode", inputParam: this.props.Login.inputParam, userInfo: this.props.Login.userInfo, ncontrolCode: editId
        };

        const deleteParam = { screenName: "Country", methodUrl: "Country", operation: "delete" };
        const mandatoryFields = [];
        this.validationColumnList.forEach(item => item.mandatory === true ?
            mandatoryFields.push(item) : ""
        );
        return (
            <>
              
                <Row>
                    <Col>
                        <ListWrapper className="client-list-content">
                            <PrimaryHeader className="d-flex justify-content-between mb-3">
                              
                            </PrimaryHeader>
                           

                            {this.state.data ?
                                <DataGrid
                                    primaryKeyField={"ncountrycode"}
                                    // expandField="expanded"
								//ALPD-5235--Vignesh R(21-01-2025)-->In export pdf -> Extra columns are present which is not present in actual Screen
                                   // detailedFieldList={this.detailedFieldList}
                                    data={this.state.data}
                                    dataResult={this.state.dataResult}
                                    dataState={this.state.dataState}
                                    dataStateChange={this.dataStateChange}
                                    extractedColumnList={this.extractedColumnList}
                                    controlMap={this.state.controlMap}
                                    userRoleControlRights={this.state.userRoleControlRights}
                                    inputParam={this.props.Login.inputParam}
                                    userInfo={this.props.Login.userInfo}
                                    fetchRecord={this.props.fetchRecord}
                                    editParam={editParam}
                                    deleteRecord={this.deleteRecord}
                                    deleteParam={deleteParam}
                                    reloadData={this.reloadData}
                                    addRecord={() => this.openModal(addId)}
                                    pageable={{ buttonCount: 4, pageSizes: true }}
                                    scrollable={"scrollable"}
                                    gridHeight={600}
                                    isActionRequired={true}
                                    isToolBarRequired={true}
                                    hideColumnFilter={false}
                                    selectedId={this.props.Login.selectedId}
                                    hasDynamicColSize={true}
                                //isComponent={true}

                                />
                                : ""}
                        </ListWrapper>
                    </Col>
                </Row>
                {this.props.Login.openModal &&
                    <SlideOutModal show={this.props.Login.openModal}
                        showSaveContinue={true}
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
                            : <AddCountry
                                selectedRecord={this.state.selectedRecord || {}}
                                onInputOnChange={this.onInputOnChange}
                                formatMessage={this.props.intl.formatMessage}

                            />}
                    />
                }
            </>
        );
    }

    // render(){
    //     return(<>
          
    //         <Row>
    //             <Col>
    //                 <ListWrapper className="client-list-content">
    //                 <Row>  
    //                 <Col md={4}>
    //                     <FormSelectSearch
    //                         formLabel={this.props.intl.formatMessage({ id: "IDS_SCREEN" })}
    //                         name={"ncountrycode"} 
    //                         placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
    //                         value={this.state.selectedRecord ? this.state.selectedRecord["ncountrycode"] : ""}
    //                         options={[{label:"Unit", value:1}, {label:"Study Plan", value:2},{label:"Storage Condition", value:3},]}
    //                         isMandatory={true}
    //                         isMulti={false}
    //                         isSearchable={false}
    //                         closeMenuOnSelect={true}
    //                         alphabeticalSort={true}
    //                         as={"select"}
    //                         onChange={(event) => this.onComboChange(event, "ncountrycode")}
                            
    //                     />
    //                 </Col>
    //                 <Col md={4}>
    //                     <FormSelectSearch
    //                         formLabel={this.props.intl.formatMessage({ id: "IDS_SPEC" })}
    //                         name={"ntestcode"} 
    //                         placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
    //                         value={this.state.selectedRecord ? this.state.selectedRecord["ntestcode"] : ""}
    //                         options={[{label:"Spec1", value:1}, {label:"Spec2", value:2},{label:"Spec3", value:3},]}
    //                         isMandatory={true}
    //                         isMulti={false}
    //                         isSearchable={false}
    //                         closeMenuOnSelect={true}
    //                         alphabeticalSort={true}
    //                         as={"select"}
    //                         onChange={(event) => this.onComboChange(event, "ntestcode")}
                            
    //                     />
    //                 </Col>
    //                 <Col md={4}>
    //                     <FormSelectSearch
    //                         formLabel={this.props.intl.formatMessage({ id: "IDS_TEST" })}
    //                         name={"nparamcode"} 
    //                         placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
    //                         value={this.state.selectedRecord ? this.state.selectedRecord["nparamcode"] : ""}
    //                         options={[{label:"Test1", value:1}, {label:"Test2", value:2},{label:"Test3", value:3},]}
    //                         isMandatory={true}
    //                         isMulti={false}
    //                         isSearchable={false}
    //                         closeMenuOnSelect={true}
    //                         alphabeticalSort={true}
    //                         as={"select"}
    //                         onChange={(event) => this.onComboChange(event, "nparamcode")}
                            
    //                     />
    //                 </Col>
    //                 </Row>
    //                     <FirstFile/>
    //                 </ListWrapper>
    //             </Col>
    //         </Row>
    //         </>
    //     )
    // }

    onComboChange = (comboData, fieldName) => {
        if (comboData !== null) {
            const selectedRecord = this.state.selectedRecord || {};
            selectedRecord[fieldName] = comboData;
            this.setState({ selectedRecord });
        }

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
            { datafield: "scountryshortname", Column: "Country Short Name" },
            { datafield: "stwocharcountry", Column: "Two Char Country" },
            { datafield: "sthreecharcountry", Column: "Three Char Country" },

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
        { dataField: "scountryshortname", idsName: "IDS_COUNTRYABBREVIATION", columnSize:"4"},
        { dataField: "stwocharcountry", idsName: "IDS_TWOCHARCOUNTRY",columnSize:"4" },
        { dataField: "sthreecharcountry", idsName: "IDS_THREECHARCOUNTRY",columnSize:"4" },

    ];

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
                    dataState = { skip: 0, take: this.props.settings ? parseInt(this.props.settings[14]) : 5 }
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
    }

    fetchRecord = (primaryKeyName, primaryKeyValue, operation) => {


        const url = this.props.Login.inputParam.classUrl + "/getActive" + this.props.Login.inputParam.methodUrl + "ById";
        rsapi().post(url, { [primaryKeyName]: primaryKeyValue, "userinfo": this.props.Login.userInfo })
            .then(response => {

                this.setState({ selectedRecord: response.data, operation, isOpen: true });
            })
            .catch(error => {

                if (error.response?.status === 429) {
                    toast.warn(intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
                    this.props.updateStore({ typeName: DEFAULT_RETURN, data: { loading: false } });
                } else if (error.response?.status === 401 || error.response?.status === 403) {
                    const UnAuthorizedAccess = {
                        typeName: UN_AUTHORIZED_ACCESS,
                        data: {
                            navigation: 'forbiddenaccess',
                            loading: false,
                            responseStatus: error.response.status
                        }

                    }
                    this.props.updateStore(UnAuthorizedAccess);
                } else if (error.response.status === 500) {
                    toast.error(error.message);
                }
                else {
                    toast.warn(error.response.data);
                }
            })
    }


    onInputOnChange = (event) => {

        const selectedRecord = this.state.selectedRecord || {};
        if (event.target.type === 'checkbox') {
            //if (event.target.name === "agree") {
            selectedRecord[event.target.name] = event.target.checked === true ? 3 : 4;
            //}
        }
        else {
            selectedRecord[event.target.name] = event.target.value;
        }
        this.setState({ selectedRecord });
    }



    deleteRecord = (deleteParam) => {
        if (deleteParam.selectedRecord.expanded !== undefined) {
            delete deleteParam.selectedRecord.expanded
        }
        const inputParam = {
            classUrl: this.props.Login.inputParam.classUrl,
            methodUrl: deleteParam.methodUrl,
            displayName: this.props.Login.inputParam.displayName,
            inputData: {

                [deleteParam.methodUrl.toLowerCase()]: deleteParam.selectedRecord,
                "userinfo": this.props.Login.userInfo
            },
            operation: deleteParam.operation,
            selectedRecord:{...this.state.selectedRecord}

        }

        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, deleteParam.ncontrolCode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData: this.props.Login.masterData },
                    openModal: true, selectedId: deleteParam.selectedRecord.ncountrycode,

                    screenName: deleteParam.screenName, operation: deleteParam.operation
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
        //add / edit      
        let dataState = undefined;
        let inputData = [];
        inputData["userinfo"] = this.props.Login.userInfo;
        let selectedId = null;
        if (this.props.Login.operation === "update") {
            // edit
            selectedId = this.props.Login.selectedId;
            inputData[this.props.Login.inputParam.methodUrl.toLowerCase()] = this.state.selectedRecord;
            // this.extractedColumnList.map(item => {
            //     let fieldName = item.dataField;
            //     if (item.controlType === "checkbox") {
            //         fieldName = item.controlName
            //     }
            //     return inputData[this.props.Login.inputParam.methodUrl.toLowerCase()][fieldName] = this.state.selectedRecord[fieldName] ? this.state.selectedRecord[fieldName] : "";
            // })

            this.fieldList.map(item => {
                return inputData[this.props.Login.inputParam.methodUrl.toLowerCase()][item] = this.state.selectedRecord[item]
            })
            dataState = this.state.dataState;
        }
        else {
            //add               
            inputData[this.props.Login.inputParam.methodUrl.toLowerCase()] = { "nsitecode": this.props.Login.userInfo.nmastersitecode };

            // this.extractedColumnList.map(item => {
            //     let fieldName = item.dataField;
            //     if (item.controlType === "checkbox") {
            //         fieldName = item.controlName
            //     }
            //     return inputData[this.props.Login.inputParam.methodUrl.toLowerCase()][fieldName] = this.state.selectedRecord[fieldName] ? this.state.selectedRecord[fieldName] : "";
            // })

            this.fieldList.map(item => {
                return inputData[this.props.Login.inputParam.methodUrl.toLowerCase()][item] = this.state.selectedRecord[item]
            })
        }
        let clearSelectedRecordField = [
            { "idsName": "IDS_COUNTRYNAME", "dataField": "scountryname", "width": "200px","mandatory": true , "mandatoryLabel":"IDS_ENTER", "controlType": "textbox","isClearField":true},
            { "idsName": "IDS_COUNTRYABBREVIATION", "dataField": "scountryshortname", "width": "200px" , "mandatoryLabel":"IDS_ENTER", "controlType": "textbox","isClearField":true},
            //{ "idsName": "IDS_COUNTRYSHORTNAME", "dataField": "scountryshortname", "width": "200px" , "mandatoryLabel":"IDS_ENTER", "controlType": "textbox","isClearField":true},
            //{ "idsName": "IDS_COUNTRYSHORTNAME", "dataField": "scountryshortname", "width": "200px" , "mandatoryLabel":"IDS_ENTER", "controlType": "textbox","isClearField":true},
            
        ]
        const inputParam = {
            classUrl: this.props.Login.inputParam.classUrl,
            methodUrl: this.props.Login.inputParam.methodUrl,
            displayName: this.props.Login.inputParam.displayName,
            inputData: inputData, selectedId,
            operation: this.props.Login.operation, saveType, formRef, dataState,
            selectedRecord:{...this.state.selectedRecord}
        }

        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolCode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData: this.props.Login.masterData },
                    openModal: true, screenName: this.props.intl.formatMessage({ id: this.props.Login.inputParam.displayName }),
                    operation: this.props.Login.operation, selectedId
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.crudMaster(inputParam, this.props.Login.masterData, "openModal","","",clearSelectedRecordField);
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
    fetchRecord
})(injectIntl(Country));