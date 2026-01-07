import React from 'react';
import { ListWrapper } from '../../components/client-group.styles';
import { Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { process } from '@progress/kendo-data-query';

import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { callService, crudMaster, getSiteCombo, updateStore, validateEsignCredential, getDistrictByRegion } from '../../actions';

import DataGrid from '../../components/data-grid/data-grid.component';

import Esign from '../../pages/audittrail/Esign';
import { DEFAULT_RETURN } from '../../actions/LoginTypes';
import SlideOutModal from '../../components/slide-out-modal/SlideOutModal';
import AddSite from './AddSite';

import { showEsign, getControlMap, validateEmail, validatePhoneNumber } from '../../components/CommonScript';
import { transactionStatus } from '../../components/Enumeration';


const mapStateToProps = state => {
    return ({ Login: state.Login })
}

class Site extends React.Component {
    constructor(props) {
        super(props);
        this.formRef = React.createRef();

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

        this.extractedColumnList = [{ "idsName": "IDS_SITE", "dataField": "ssitename", "width": "200px" },
        //  { "idsName": "IDS_SITECODE", "dataField": "ssitecode", "width": "200px" },
        { "idsName": "IDS_SCONTACTPERSON", "dataField": "scontactperson", "width": "200px" },
        { "idsName": "IDS_DEFAULTSTATUS", "dataField": "stransdisplaystatus", "width": "250px" },
        { "idsName": "IDS_SITECODE", "dataField": "ssitecode", "width": "300px", "columnSize": "4" },

        ];


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
            this.props.Login.districtList = [];
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
        return null;
    }


    render() {

        const addId = this.state.controlMap.has("AddSite") && this.state.controlMap.get("AddSite").ncontrolcode;
        const editId = this.state.controlMap.has("EditSite") && this.state.controlMap.get("EditSite").ncontrolcode;

        const addParam = {
            screenName: "IDS_SITE", primaryeyField: "nsitecode", primaryKeyValue: undefined,
            operation: "create", inputParam: this.props.Login.inputParam, userInfo: this.props.Login.userInfo, ncontrolCode: addId
        };

        const editParam = {
            screenName: "IDS_SITE", operation: "update",
            primaryKeyField: "nsitecode", inputParam: this.props.Login.inputParam, userInfo: this.props.Login.userInfo, ncontrolCode: editId
        };

        const deleteParam = { operation: "delete" };

        // this.detailedFieldList = [
        //     { "idsName": "IDS_SITEADDRESS", "dataField": "ssiteaddress", "width": "200px","columnSize": "4" },
        //     { "idsName": "IDS_PHONENO", "dataField": "sphoneno", "width": "300px","columnSize": "4" },
        //     { "idsName": "IDS_FAXNO", "dataField": "sfaxno", "width": "250px" ,"columnSize": "4"},
        //     { "idsName": "IDS_EMAIL", "dataField": "semail", "width": "250px" ,"columnSize": "4"},
        //     //{ "idsName": "IDS_NEEDUTCCONVERSATION", "dataField": "sutcconversationstatus", "width": "250px", "columnSize": "4" },
        //     { "idsName": "IDS_TIMEZONE", "dataField": "stimezoneid", "width": "250px" ,"columnSize": "4"},
        //     { "idsName": "IDS_SITEDATE", "dataField": "sdateformat", "width": "250px","columnSize": "4" },
        //     { "idsName": "IDS_NEEDDISTRIBUTED", "dataField": "sdistributedstatus", "width": "250px", "columnSize": "4" },
        //     { "idsName": "IDS_SITECODE", "dataField": "ssitecode", "width": "300px","columnSize": "4" },
        //     { "idsName": "IDS_REGION", "dataField": "sregionname", "width": "300px","columnSize": "4" },
        //     { "idsName": "IDS_DISTRICT", "dataField": "sdistrictname", "width": "300px","columnSize": "4" },
        //     { "idsName": "IDS_PRIMAEYSERVER", "dataField": "sprimarysereverstatus", "width": "300px","columnSize": "4" },
        // ];
        const detailedFieldList = [];
        detailedFieldList.push(

            { "idsName": "IDS_SITEADDRESS", "dataField": "ssiteaddress", "width": "200px", "columnSize": "4" },
            { "idsName": "IDS_PHONENO", "dataField": "sphoneno", "width": "300px", "columnSize": "4" },
            { "idsName": "IDS_FAXNO", "dataField": "sfaxno", "width": "250px", "columnSize": "4" },
            { "idsName": "IDS_EMAIL", "dataField": "semail", "width": "250px", "columnSize": "4" },
            { "idsName": "IDS_SITETYPE", "dataField": "ssitetypename", "width": "300px", "columnSize": "4" },


        );
        //if (this.props.Login.settings && parseInt(this.props.Login.settings['21']) === transactionStatus.YES) {

            detailedFieldList.push(
                { "idsName": "IDS_TIMEZONE", "dataField": "stimezoneid", "width": "250px", "columnSize": "4" },
                { "idsName": "IDS_INPUTTIMEZONE", "dataField": "sinputtimezoneid", "width": "250px", "columnSize": "4" },
                { "idsName": "IDS_SITEDATE", "dataField": "sdateformat", "width": "250px", "columnSize": "4" }
            );
            // if (this.props.Login.settings && parseInt(this.props.Login.settings['23']) === transactionStatus.YES) {
            //     detailedFieldList.push(
            //         { "idsName": "IDS_NEEDDISTRIBUTED", "dataField": "sdistributedstatus", "width": "250px", "columnSize": "4" },
            //         { "idsName": "IDS_SITECODE", "dataField": "ssitecode", "width": "300px", "columnSize": "4" },
            //         { "idsName": "IDS_REGION", "dataField": "sregionname", "width": "300px", "columnSize": "4" },
            //         { "idsName": "IDS_DISTRICT", "dataField": "sdistrictname", "width": "300px", "columnSize": "4" },
            //         { "idsName": "IDS_PRIMAEYSERVER", "dataField": "sprimarysereverstatus", "width": "300px", "columnSize": "4" }
            //     );
            // }

       // }
         if (this.props.Login.settings && parseInt(this.props.Login.settings['23']) === transactionStatus.YES) {
            detailedFieldList.push(
                { "idsName": "IDS_NEEDDISTRIBUTED", "dataField": "sdistributedstatus", "width": "250px", "columnSize": "4" },
                { "idsName": "IDS_SITECODE", "dataField": "ssitecode", "width": "300px", "columnSize": "4" },
                { "idsName": "IDS_REGION", "dataField": "sregionname", "width": "300px", "columnSize": "4" },
                { "idsName": "IDS_DISTRICT", "dataField": "sdistrictname", "width": "300px", "columnSize": "4" },
                { "idsName": "IDS_PRIMAEYSERVER", "dataField": "sprimarysereverstatus", "width": "300px", "columnSize": "4" }
            );
        }
       
        let mandatoryFields = []
        mandatoryFields.push(
            { "mandatory": true, "idsName": "IDS_SITENAME", "dataField": "ssitename", "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },)
        //if (this.props.Login.settings && parseInt(this.props.Login.settings['21']) === transactionStatus.YES) {
            mandatoryFields.push(
                { "mandatory": true, "idsName": "IDS_TIMEZONE", "dataField": "ntimezonecode", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
                { "mandatory": true, "idsName": "IDS_INPUTTIMEZONE", "dataField": "ninputtimezonecode", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
                { "mandatory": true, "idsName": "IDS_SITEDATE", "dataField": "ndateformatcode", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
                //added by sujatha V ATE_274 on 12-09-2025 SWSM-19 for fixing bug -> allows to save without Site Code Mandatory Field
                { "mandatory": true, "idsName": "IDS_SITECODE", "dataField": "ssitecode", "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" }
            )
        //}
        //commented by sujatha V ATE_274 on 12-09-2025 SWSM-19 for fixing bug -> allows to save without Site Code Mandatory Field
        // if (this.props.Login.settings && parseInt(this.props.Login.settings['23']) === transactionStatus.YES) {
        //     mandatoryFields.push({ "mandatory": true, "idsName": "IDS_SITECODE", "dataField": "ssitecode", "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" }
        //     )
        // }

        return (
            <>
                <Row>
                    <Col>
                        <ListWrapper className="client-list-content">

                            {this.state.data ?
                                <DataGrid
                                    primaryKeyField={"nsitecode"}
                                    data={this.state.data}
                                    dataResult={this.state.dataResult}
                                    dataState={this.state.dataState}
                                    dataStateChange={this.dataStateChange}
                                    methodUrl="Site"
                                    extractedColumnList={this.extractedColumnList}
                                    detailedFieldList={detailedFieldList}
                                    expandField="expanded"
                                    fetchRecord={this.props.getSiteCombo}
                                    editParam={editParam}
                                    deleteRecord={this.deleteRecord}
                                    deleteParam={deleteParam}
                                    reloadData={this.reloadData}
                                    controlMap={this.state.controlMap}
                                    userRoleControlRights={this.state.userRoleControlRights}
                                    inputParam={this.props.Login.inputParam}
                                    userInfo={this.props.Login.userInfo}
                                    pageable={true}
                                    scrollable={'scrollable'}
                                    gridHeight={'600px'}
                                    isActionRequired={true}
                                    isToolBarRequired={true}
                                    selectedId={this.props.Login.selectedId}
                                    addRecord={() => this.props.getSiteCombo(addParam)}
                                    hasDynamicColSize={true}
                                    handleExpandChange= {this.handleExpandChange}
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
                        mandatoryFields={mandatoryFields}
                        addComponent={this.props.Login.loadEsign ?
                            <Esign operation={this.props.Login.operation}
                                onInputOnChange={this.onInputOnChange}
                                inputParam={this.props.Login.inputParam}
                                selectedRecord={this.state.selectedRecord || {}}
                            />
                            : <AddSite
                                selectedRecord={this.state.selectedRecord || {}}
                                onInputOnChange={this.onInputOnChange}
                                onComboChange={this.onComboChange}
                                TimeZoneList={this.props.Login.TimeZoneList || []}
                                dateFormatList={this.props.Login.dateFormatList || []}
                                operation={this.props.Login.operation}
                                regionList={this.props.Login.regionList}
                                districtList={this.props.Login.districtList}
                                siteTypeList={this.props.Login.siteTypeList}
                                NeedUTCConversation={parseInt(this.props.Login.settings[21])}
                                siteAdditionalInfo={parseInt(this.props.Login.settings[23])}
                                sitecodemaxlength={5}
                                //ATE234 Janakumar BGSI-8 Screen Name -> Site Hospital Mapping
                               
                            />}
                    />
                    : ""}
            </>
        );
    }

    //L.Subashini - 02/Jan/2026 - Updated method by adding additional method param,  setState and dataItem
    // as a fix for ReactVersion upgrade to 17 and kendo grid 5 to expand grid item
    handleExpandChange = (fullDataset, dataItem, dataState) => {
        this.setState(prevState => ({
            dataResult: fullDataset,
            dataState: dataState || prevState.dataState
        }));
        };

    componentDidUpdate(previousProps) {
        if (this.props.Login.masterData !== previousProps.Login.masterData) {
            if (this.props.Login.userInfo.nformcode !== previousProps.Login.userInfo.nformcode) {
                const userRoleControlRights = [];
                if (this.props.Login.userRoleControlRights) {
                    this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode] && Object.values(this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode]).map(item =>
                        userRoleControlRights.push(item.ncontrolcode))
                }
                const controlMap = getControlMap(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode)
               // let { selectedRecord } = this.state;
                const nisdistributed = this.props.Login.masterData.map(item => item.nisdistributed);
                const nutcconversation = this.props.Login.masterData.map(item => item.nutcconversation);
                this.setState({
                    userRoleControlRights, controlMap, data: this.props.Login.masterData,
                    dataResult: process(this.props.Login.masterData, this.state.dataState),
                    selectedRecord: { nisdistributed, nutcconversation }
                });
            }
            else {
                let { dataState,// selectedRecord 
                                        } = this.state;
                if (this.props.Login.dataState === undefined) {
                    dataState = { skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5 }
                }
                const nisdistributed = this.props.Login.masterData.map(item => item.nisdistributed);
                const nutcconversation = this.props.Login.masterData.map(item => item.nutcconversation);
                this.setState({
                    data: this.props.Login.masterData, 
                    //selectedRecord: this.props.Login.selectedRecord,
                    dataResult: process(this.props.Login.masterData, dataState), dataState,
                    selectedRecord: { nisdistributed, nutcconversation }
                });
            }
        }
        else if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord) {
            this.setState({ selectedRecord: this.props.Login.selectedRecord });
        }
    }
    //ATE234 Janakumar BGSI-8 Screen Name -> Site Hospital Mapping
    onInputOnChange = (event,secondField,sitecodemaxlength) => {

        const selectedRecord = this.state.selectedRecord || {};
        if (event.target.type === 'checkbox') {
            selectedRecord[event.target.name] = event.target.checked === true ? transactionStatus.YES : transactionStatus.NO;
        }
        else {
            if (event.target.name === "sphoneno") {
                if (event.target.value !== "") {
                    event.target.value = validatePhoneNumber(event.target.value);
                    selectedRecord[event.target.name] = event.target.value !== "" ? event.target.value : selectedRecord[event.target.name];
                } else {
                    selectedRecord[event.target.name] = event.target.value
                }
            }else if(event.target.name === "ssitename"){
                selectedRecord[event.target.name] = event.target.value;
                if(secondField==='ssitecode'){
                   selectedRecord['ssitecode'] = event.target.value.substring(0, sitecodemaxlength);
                }
            }
            else {
                selectedRecord[event.target.name] = event.target.value;
            }
        }
        this.setState({ selectedRecord });
    }
    onComboChange = (comboData, fieldName) => {
        const selectedRecord = this.state.selectedRecord || {};

        if (comboData !== null) {
            selectedRecord[fieldName] = comboData;
            if (fieldName === "nregioncode") {
                this.props.getDistrictByRegion({
                    inputData: {
                        userinfo: this.props.Login.userInfo,
                        sdisplayname: selectedRecord.nregioncode.label,
                        primarykey: selectedRecord.nregioncode.value
                    }
                })
                selectedRecord["ndistrictcode"] = "";
            }
            this.setState({ selectedRecord });
        }
        else{
            if(fieldName === "nsitetypecode")
            {
                selectedRecord[fieldName] = comboData;
                this.setState({ selectedRecord });
            }
            else 
                {
            if (selectedRecord["nregioncode"]) {
                delete selectedRecord["nregioncode"];
                delete selectedRecord["ndistrictcode"];
              }

              const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: { selectedRecord }
              }
              this.props.updateStore(updateInfo);
        }

    }

    }

    deleteRecord = (deleteParam) => {
        let inputData = [];
        delete deleteParam.selectedRecord.expanded;
        inputData["site"]=deleteParam.selectedRecord;
        
        inputData["site"]["needutcconversation"] =parseInt(this.props.Login.settings[21]) === transactionStatus.YES ? true : false;
        inputData[ "userinfo"]= this.props.Login.userInfo
        const inputParam = {
            classUrl: this.props.Login.inputParam.classUrl,
            methodUrl: this.props.Login.inputParam.methodUrl,
            displayName: this.props.Login.inputParam.displayName,
            inputData: inputData,
            operation: deleteParam.operation,
            dataState: this.state.dataState,
            selectedRecord:{...this.state.selectedRecord}

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

    reloadData = () => {
        const inputParam = {
            inputData: { "userinfo": this.props.Login.userInfo },
            classUrl: this.props.Login.inputParam.classUrl,
            methodUrl: this.props.Login.inputParam.methodUrl,
            displayName: "IDS_SITE",
            userInfo: this.props.Login.userInfo
        };

        this.props.callService(inputParam);
    }

    onSaveClick = (saveType, formRef) => {
        //add / edit
        const isValidateEmail = this.state.selectedRecord["semail"] ? validateEmail(this.state.selectedRecord["semail"]) : true;
        if (isValidateEmail) {
            let dataState = undefined;
            let operation = "";
            let inputData = [];
            let selectedId = null;
            inputData["userinfo"] = this.props.Login.userInfo;
            let postParam = {
                selectedObject: "selectedSite",
                primaryKeyField: "nsitecode",
                inputListName: "Site",
                fecthInputObject: { userinfo: this.props.Login.userInfo }
            }
            if (this.props.Login.operation === "update") {
                selectedId = this.props.Login.selectedRecord.nsitecode;

                inputData["site"] = {
                    "nsitecode": this.props.Login.selectedRecord.nsitecode,
                    "nmastersitecode": this.props.Login.userInfo.nmastersitecode,
                    "scontactperson": this.state.selectedRecord.scontactperson !== null ? this.state.selectedRecord.scontactperson : "",
                    "ssiteaddress": this.state.selectedRecord.ssiteaddress,
                    "sphoneno": this.state.selectedRecord.sphoneno,
                    "ssitename": this.state.selectedRecord.ssitename,
                    "ssitecode": this.state.selectedRecord.ssitecode !== undefined ? this.state.selectedRecord.ssitecode : "NA",
                    "sfaxno": this.state.selectedRecord.sfaxno,
                    "semail": this.state.selectedRecord.semail !== null ? this.state.selectedRecord.semail : "",
                    "ndefaultstatus": this.state.selectedRecord.ndefaultstatus,
                    "ndateformatcode": this.state.selectedRecord.ndateformatcode !== undefined ? this.state.selectedRecord.ndateformatcode.value : "-1",
                     //added by sujatha ATE_274 SWSM-21 22-09-2025 not recorded site type in audit trial after editing a site with a different site type
                    "nsitetypecode": this.state.selectedRecord !==undefined?this.state.selectedRecord['nsitetypecode'] && this.state.selectedRecord['nsitetypecode'].value:-1
                }
                // if (this.state.selectedRecord.ndateformatcode.label !== undefined) {
                inputData["sitedateformat"] = {
                    "ssitereportdatetime": this.state.selectedRecord.ndateformatcode !== undefined && this.state.selectedRecord.ndateformatcode.label !== 'NA' ? this.state.selectedRecord.ndateformatcode.label + ' HH:mm:ss' : this.props.Login.userInfo.ssitereportdatetime,
                    "ssitereportdate": this.state.selectedRecord.ndateformatcode !== undefined && this.state.selectedRecord.ndateformatcode.label !== 'NA' ? this.state.selectedRecord.ndateformatcode.label : this.props.Login.userInfo.ssitereportdate,
                    "ssitedate": this.state.selectedRecord.ndateformatcode !== undefined && this.state.selectedRecord.ndateformatcode.label !== 'NA' ? this.state.selectedRecord.ndateformatcode.label : this.props.Login.userInfo.ssitereportdate,
                    "spgdatetime": this.state.selectedRecord.ndateformatcode !== undefined && this.state.selectedRecord.ndateformatcode.label !== 'NA' ? this.state.selectedRecord.ndateformatcode.label + ' HH24:mi:ss' : this.props.Login.userInfo.spgsitedatetime,
                    "spgreportdatetime": this.state.selectedRecord.ndateformatcode !== undefined && this.state.selectedRecord.ndateformatcode.label !== 'NA' ? this.state.selectedRecord.ndateformatcode.label + ' HH24:mi:ss' : this.props.Login.userInfo.spgsitedatetime,
                    "ssitedatetime": this.state.selectedRecord.ndateformatcode !== undefined && this.state.selectedRecord.ndateformatcode.label !== 'NA' ? this.state.selectedRecord.ndateformatcode.label + ' HH:mm:ss' : this.props.Login.userInfo.ssitedatetime,
                    "nisstandaloneserver": this.state.selectedRecord.nisstandaloneserver !== null ? this.state.selectedRecord.nisstandaloneserver : 4,
                    "nsitecode": this.state.selectedRecord.nsitecode,
                    "nissyncserver": this.state.selectedRecord.nissyncserver !== null ? this.state.selectedRecord.nissyncserver : 4,
                    //"nsitetypecode": this.state.selectedRecord !==undefined?this.state.selectedRecord['nsitetypecode'].value:-1
                    "nsitetypecode": this.state.selectedRecord['nsitetypecode'] ?this.state.selectedRecord['nsitetypecode'].value:transactionStatus.NA,
                                             
                    "ninputtimezonecode":this.state.selectedRecord.ninputtimezonecode?.value || transactionStatus.NA //Added by sonia on 18th July 2025 for jira id:ALPDJ21-18                    // "nutcconversation": this.state.selectedRecord.nutcconversation !== null ? this.state.selectedRecord.nutcconversation : 4
                }
                //    }

                operation = "update";
                dataState = this.state.dataState;
                selectedId = this.props.Login.selectedId;
            }
            else {

                inputData["site"] = {
                    "nmastersitecode": this.props.Login.userInfo.nmastersitecode,
                    "scontactperson": this.state.selectedRecord.scontactperson !== null ? this.state.selectedRecord.scontactperson : "",
                    "ssiteaddress": this.state.selectedRecord.ssiteaddress,
                    "sphoneno": this.state.selectedRecord.sphoneno,
                    "ssitename": this.state.selectedRecord.ssitename,
                    "ssitecode": this.state.selectedRecord.ssitecode !== undefined ? this.state.selectedRecord.ssitecode : "NA",
                    "sfaxno": this.state.selectedRecord.sfaxno,
                    "semail": this.state.selectedRecord.semail !== null ? this.state.selectedRecord.semail : "",
                    "ndefaultstatus": this.state.selectedRecord.ndefaultstatus,
                    "ndateformatcode": this.state.selectedRecord.ndateformatcode !== undefined ? this.state.selectedRecord.ndateformatcode.value : "-1",
                    "nisstandaloneserver": this.state.selectedRecord.nisstandaloneserver !== undefined ? this.state.selectedRecord.nisstandaloneserver : 4,
                    // "nutcconversation": this.state.selectedRecord.nutcconversation !== undefined ? this.state.selectedRecord.nutcconversation : 4
                    "nsitetypecode": this.state.selectedRecord['nsitetypecode']? this.state.selectedRecord['nsitetypecode'].value:transactionStatus.NA

                };
                //  if (this.state.selectedRecord.ndateformatcode && this.state.selectedRecord.ndateformatcode.label !== undefined) {
                inputData["sitedateformat"] = {
                    "ssitereportdatetime": this.state.selectedRecord.ndateformatcode !== undefined ? this.state.selectedRecord.ndateformatcode.label + ' HH:mm:ss' : this.props.Login.userInfo.ssitereportdatetime,
                    "ssitereportdate": this.state.selectedRecord.ndateformatcode !== undefined ? this.state.selectedRecord.ndateformatcode.label : this.props.Login.userInfo.ssitereportdate,
                    "ssitedate": this.state.selectedRecord.ndateformatcode !== undefined ? this.state.selectedRecord.ndateformatcode.label : this.props.Login.userInfo.ssitereportdate,
                    "spgdatetime": this.state.selectedRecord.ndateformatcode !== undefined ? this.state.selectedRecord.ndateformatcode.label + ' HH24:mi:ss' : this.props.Login.userInfo.spgsitedatetime,
                    "spgreportdatetime": this.state.selectedRecord.ndateformatcode !== undefined ? this.state.selectedRecord.ndateformatcode.label + ' HH24:mi:ss' : this.props.Login.userInfo.spgsitedatetime,
                    "ssitedatetime": this.state.selectedRecord.ndateformatcode !== undefined ? this.state.selectedRecord.ndateformatcode.label + ' HH:mm:ss' : this.props.Login.userInfo.ssitedatetime,
                    "nisstandaloneserver": this.state.selectedRecord.nisstandaloneserver !== null ? this.state.selectedRecord.nisstandaloneserver : 4,
                    "needutcconversation": parseInt(this.props.Login.settings[21]) === transactionStatus.YES ? true : false,
                    "nsitecode": this.state.selectedRecord.nsitecode,
                    "nissyncserver": this.state.selectedRecord.nissyncserver !== null ? this.state.selectedRecord.nissyncserver : 4,
                    "nsitetypecode": this.state.selectedRecord['nsitetypecode'] ? this.state.selectedRecord['nsitetypecode'].value:transactionStatus.NA,
                    "ninputtimezonecode":this.state.selectedRecord.ninputtimezonecode?.value || transactionStatus.NA //Added by sonia on 18th July 2025 for jira id:ALPDJ21-18
                }
                // }


                operation = "create";
            }
            inputData["site"]["ntimezonecode"] = this.state.selectedRecord["ntimezonecode"] ? this.state.selectedRecord["ntimezonecode"].value : "-1";
            inputData["site"]["nregioncode"] = this.state.selectedRecord["nregioncode"] ? this.state.selectedRecord["nregioncode"].value : transactionStatus.NA;
            inputData["site"]["ndistrictcode"] = this.state.selectedRecord["ndistrictcode"] ? this.state.selectedRecord["ndistrictcode"].value : transactionStatus.NA;

            const inputParam = {
                classUrl: "site",
                methodUrl: "SiteScreen",
                displayName: this.props.Login.inputParam.displayName,
                inputData: inputData,
                postParam,
                searchRef: this.searchRef,
                operation: operation, saveType, formRef, dataState, selectedId,
                selectedRecord:{...this.state.selectedRecord}

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
                this.props.crudMaster(inputParam, this.props.Login.masterData, "openModal");
            }
        }
        else {
            toast.info(this.props.intl.formatMessage({ id: "IDS_ENTERVALIDEMAIL" }))
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
export default connect(mapStateToProps, { callService, crudMaster, getSiteCombo, updateStore, validateEsignCredential, getDistrictByRegion })(injectIntl(Site));