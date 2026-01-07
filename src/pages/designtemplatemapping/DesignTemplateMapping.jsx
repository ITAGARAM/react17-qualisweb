import React from 'react'
import { Row, Col, Card, Nav, FormGroup, FormLabel } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faThumbsUp, faChevronCircleDown } from '@fortawesome/free-solid-svg-icons';//,faUserTimes, faTrash
//import { falistUl } from '@fortawesome/free-regular-svg-icons';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import { toast } from 'react-toastify';

import {
    callService, crudMaster, validateEsignCredential, updateStore, getDesignTemplateMappingDetail,
    getMappedFieldProps, editFieldConfigService, auditFieldConfigService, mappingFieldConfigService,
    getDesignTemplateMappingComboService, filterColumnData, reloadDesignTemplateMapping,
    getTMPFilterRegType, getTMPFilterRegSubType, getTMPFilterSubmit, combinationUniqueConfigService,
    exportFieldConfigService, configureCheckList, getConfigureCheckListLatestVersion,reportFilterType
} from '../../actions';
import TemplateFilter from './TemplateFilter';
import { ContentPanel, ReadOnlyText } from '../../components/App.styles';
import { getControlMap, showEsign, constructOptionList, validateCreateView,getFilterConditionsBasedonDataType 
    ,queryBuilderfillingColumns,checkFilterIsEmptyQueryBuilder} from '../../components/CommonScript';//searchData, sortData,
import ListMaster from '../../components/list-master/list-master.component';
// import DateTimePicker from '../../components/date-time-picker/date-time-picker.component';
import SlideOutModal from '../../components/slide-out-modal/SlideOutModal';
import AddDesignTemplateMapping from './AddDesignTemplateMapping'
import Esign from '../../pages/audittrail/Esign';
import { DEFAULT_RETURN } from '../../actions/LoginTypes';
import BreadcrumbComponent from '../../components/Breadcrumb.Component';
import { ListWrapper } from '../../components/client-group.styles';
import {
    designProperties, formCode, SampleType, transactionStatus,
    templateMappingAction, //SAMPLEAUDITFIELDS, SAMPLEAUDITEDITABLE, SAMPLEAUDITMULTILINGUALFIELDS,
    // SUBSAMPLEAUDITFIELDS, SUBSAMPLEAUDITEDITABLE, SUBSAMPLEAUDITMULTILINGUALFIELDS,
    //SAMPLETEMPLATEFIELDS, 
    //SUBSAMPLETEMPLATEFIELDS, 
    designComponents,
    QUALISFORMS,
    //ARNOMULTILINGUAL, SUBARNOMULTILINGUAL
} from '../../components/Enumeration';

import AddSynonym from '../../components/droparea/AddSynonym';
import { Affix } from 'rsuite';
import ConfirmMessage from '../../components/confirm-alert/confirm-message.component';
// import ReactTooltip from 'react-tooltip';
import ConfigureScreenFields from './ConfigureScreenFields';
import ConfigureEditFields from './ConfigureEditFields';
import ConfigureUniqueFields from './ConfigureUniqueFields.jsx';
import ConfigureAuditFields from './ConfigureAuditFields';
import CustomPopover from '../../components/customPopover';
import ConfigureSendToStoreFields from './configureSendToStoreFields'
//import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import FormInput from '../../components/form-input/form-input.component';
import CustomTabs from '../../components/custom-tabs/custom-tabs.component';
import ConfigureExportFields from './ConfigureExportFields';
import ConfigureCheckList from './ConfigureCheckList';
import ConfigureCheckListAdd from './ConfigureCheckListAdd';
import { process } from '@progress/kendo-data-query';
import ConfigureReportFilterType from './ConfigureReportFilterType';
//import {Utils as QbUtils,} from "@react-awesome-query-builder/ui";

const mapStateToProps = state => {
    return ({ Login: state.Login })
}

class DesignTemplateMapping extends React.Component {
    constructor(props) {
        super(props);

        const dataStateCL = {
            skip: 0,
            take: 10,
        };

        this.state = {
            isOpen: false,
            designtemplatemappingData: [],
            masterStatus: "",
            error: "",
            //selectedRecord: {},
            operation: "",
            dataStateCL,
            screenName: undefined,
            userLogged: true,
            selectedDesignTemplateMapping: undefined,
            sidebarview: false,
            userRoleControlRights: [],
            controlMap: new Map(),
            showAccordian: true,
            selectedInput: "",
            masterTypeArray: [{ label: this.props.intl.formatMessage({ id: "IDS_NEWMASTER" }), value: 1, item: { nmastertypecode: 1, smastertype: this.props.intl.formatMessage({ id: "IDS_NEWMASTER" }) } },
            { label: this.props.intl.formatMessage({ id: "IDS_EXISTINGMASTER" }), value: 2, item: { nmastertypecode: 2, smastertype: this.props.intl.formatMessage({ id: "IDS_EXISTINGMASTER" }) } }],
            newMasterForm: { value: -2, label: "-" },
            moduleTypeArray: [{ label: this.props.intl.formatMessage({ id: "IDS_NEWMODULE" }), value: 3 },
            { label: this.props.intl.formatMessage({ id: "IDS_EXISTINGMODULE" }), value: 4 }]

        };
        this.searchRef = React.createRef();
        this.confirmMessage = new ConfirmMessage();
        this.searchFieldList = ["sregtemplatename", "sversionno", "stransdisplaystatus"];

        this.designtemplatemappingFieldList = ['ndesigntemplatemappingcode', 'nsampletypecode', 'nformcode',
            'nregtypecode', 'nregsubtypecode', 'nformwisetypecode', 'nreactregtemplatecode', 'ntransactionstatus', 'nversionno'];//'nmahcode',
    }
    
    sidebarExpandCollapse = () => {
        this.setState({
            sidebarview: true
        })
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

    filterComboChange = (event, fieldname) => {
        if (event !== null) {
            // let uRL = "";
            let inputData = [];
            if (fieldname === "sampleType") {

                inputData = {
                    userinfo: this.props.Login.userInfo,
                    nflag: 1,
                    nsampletypecode: parseInt(event.value),

                }
                let masterData = { ...this.props.Login.masterData, defaultsampletype: event }
                let inputParam = { masterData, inputData }
                if (event.value === SampleType.Masters) {
                    const masterTypeArray = this.state.masterTypeArray

                    const updateInfo = {
                        typeName: DEFAULT_RETURN,
                        data: {
                            masterData: {
                                ...masterData,
                                masterTypeArray,
                                defaultMasterType: masterTypeArray[0],
                                qualisforms: [], defaultform: this.state.newMasterForm,
                                nregtypecode: -1, nregsubtypecode: -1
                            }
                        }
                    }

                    this.props.updateStore(updateInfo);
                //Added by sonia on 11th NOV 2024 for jira id:ALPD-5025  
                } else if (event.value === SampleType.GOODSIN || event.value === SampleType.PROTOCOL) {
                    let masterData = { ...this.props.Login.masterData, defaultsampletype: event }
                    const updateInfo = {
                        typeName: DEFAULT_RETURN,
                        data: {
                            masterData: {
                                ...masterData,
                                nregtypecode: -1, nregsubtypecode: -1,defaultform: { value: -1, label: "-" }
                            }
                        }
                    }
                    this.props.updateStore(updateInfo);
                }
                else {
                    inputParam["masterData"]["defaultform"] = { value: -1, label: "-" };
                    this.props.getTMPFilterRegType(inputParam)
                }
            }
            else if (fieldname === "registrationType") {

                inputData = {
                    userinfo: this.props.Login.userInfo,

                    nregtypecode: parseInt(event.value),
                    nsampletypecode: this.props.Login.masterData.defaultsampletype.value,

                }
                let masterData = { ...this.props.Login.masterData, defaultregtype: event }
                let inputParam = { masterData, inputData }
                this.props.getTMPFilterRegSubType(inputParam)

            } else if (fieldname === "registrationSubType") {

                let masterData = { ...this.props.Login.masterData, defaultregsubtype: event }
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: { masterData }
                }

                this.props.updateStore(updateInfo);
            }
            else if (fieldname === "masterType") {

                let masterData = { ...this.props.Login.masterData, defaultMasterType: event }

                inputData = {
                    userinfo: this.props.Login.userInfo,
                    nflag: 1,
                    nsampletypecode: SampleType.Masters,
                }

                let inputParam = { masterData, inputData }
                if (event.value === 1) {
                    const updateInfo = {
                        typeName: DEFAULT_RETURN,
                        data: { masterData: { ...masterData, qualisforms: [], defaultform: this.state.newMasterForm } }
                    }

                    this.props.updateStore(updateInfo);
                }
                else {
                    this.props.getTMPFilterRegType(inputParam)
                }

            } else {
                let masterData = { ...this.props.Login.masterData, defaultform: event }
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: { masterData }
                }

                this.props.updateStore(updateInfo);
            }
        }
    }

    // Below method commented by L. Subashini as the condition for returning false or true (to avoid rerender) 
    // needs to be optimised. Commenting this provides fix for ALPDJ21-11    
    // shouldComponentUpdate(nextProps, nextState) {
    //     let fieldName=this.props.Login.masterData && this.props.Login.masterData.fieldName;
    //     let fieldIndex=this.props.Login.masterData && this.props.Login.masterData.fieldIndex;
    //     if (fieldName && this.props.Login.sampleReportFilterTypeData[fieldName][fieldIndex] === nextProps.Login.sampleReportFilterTypeData[fieldName][fieldIndex] 
    //         && this.props.Login.openModal === nextProps.Login.openModal && nextProps.Login.isInitialRender === false ) {
    //         return false;
    //     }  else {
    //         return true;
    //     }
    // }


    onChangeExportFields = (event, dataItem, field, dataIndex, formCode, operation) => {

        const sampleexportdataResult = this.props.Login.sampleexportdataResult
        sampleexportdataResult[formCode][dataIndex] = { ...sampleexportdataResult[formCode][dataIndex], sampleexportfields: event.target.checked }

        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { sampleexportdataResult }
        }
        this.props.updateStore(updateInfo);
    }
    onChangeReportFilterTypeFields = (event, dataItem, field, dataIndex, formCode, operation) => {

        let count=0;
        //let reportFilterType=[];
        const sampleReportFilterTypeData = this.props.Login.sampleReportFilterTypeData
        sampleReportFilterTypeData[formCode][dataIndex] = { ...sampleReportFilterTypeData[formCode][dataIndex], samplefiltertypefields: event.target.checked }

        sampleReportFilterTypeData.sample.map(x=>{
            if(x.samplefiltertypefields===true){
                count++
                //reportFilterType.push(x);
            }
        })
        if(count>parseInt(this.props.Login.settings && this.props.Login.settings['48'])){
            sampleReportFilterTypeData[formCode][dataIndex] = { ...sampleReportFilterTypeData[formCode][dataIndex], samplefiltertypefields: false }
            toast.warn(this.props.intl.formatMessage({ id: "IDS_MAXIMUMSELECTIONEXCEEDSFILTEERTYPE" })) 
         }else{
            let  extractedColumnList=queryBuilderfillingColumns(this.props.Login.sampleReportFilterTypeData["sample"],this.props.Login.userInfo.slanguagetypecode)
            let fields =getFilterConditionsBasedonDataType(extractedColumnList,this.props.Login.comboValues);
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { sampleReportFilterTypeData,fields}//,reportFilterType }
        }
        this.props.updateStore(updateInfo);
    }
    }


    onClickAddCheckList = () => {

        this.props.getConfigureCheckListLatestVersion(this.props.Login.userInfo);

    }

    onComboChangeCheckList = (event, field) => {
        const selectedRecord = this.state.selectedRecord || {}
        selectedRecord[field] = event
        this.setState({ selectedRecord })
    }

    render() {
        const Layout = this.props.Login.masterData.selectedDesignTemplateMapping &&
            this.props.Login.masterData.selectedDesignTemplateMapping.jsondata;

        const subSampleLayout = this.props.Login.masterData.selectedDesignTemplateMapping &&
            this.props.Login.masterData.selectedDesignTemplateMapping.subsamplejsondata

        const addId = this.state.controlMap.has("AddDesignTemplateMapping") && this.state.controlMap.get("AddDesignTemplateMapping").ncontrolcode;
        const deleteId = this.state.controlMap.has("DeleteDesignTemplateMapping") && this.state.controlMap.get("DeleteDesignTemplateMapping").ncontrolcode;
        const approveId = this.state.controlMap.has("ApproveDesignTemplateMapping") && this.state.controlMap.get("ApproveDesignTemplateMapping").ncontrolcode;
        const sampleFieldId = this.state.controlMap.has("ConfigureSampleDisplayFields") && this.state.controlMap.get("ConfigureSampleDisplayFields").ncontrolcode;
        const sampleEditFieldId = this.state.controlMap.has("ConfigureSampleEditableFields") && this.state.controlMap.get("ConfigureSampleEditableFields").ncontrolcode;
        const subSampleFieldId = this.state.controlMap.has("ConfigureSubSampleDisplayFields") && this.state.controlMap.get("ConfigureSubSampleDisplayFields").ncontrolcode;
        const subSampleEditFieldId = this.state.controlMap.has("ConfigureSubSampleEditableFields") && this.state.controlMap.get("ConfigureSubSampleEditableFields").ncontrolcode;
        const combinationUniqueFieldId = this.state.controlMap.has("ConfigureCombinationUniqueFields") && this.state.controlMap.get("ConfigureCombinationUniqueFields").ncontrolcode;
        const sendToStoreId = this.state.controlMap.has("ConfigureSendToStore") && this.state.controlMap.get("ConfigureSendToStore").ncontrolcode;
        //const sampleAuditConfigId = this.state.controlMap.has("ConfigureSampleAuditFields") && this.state.controlMap.get("ConfigureSampleAuditFields").ncontrolcode;
        const exportFieldsID = this.state.controlMap.has("ConfigureExportFields") && this.state.controlMap.get("ConfigureExportFields").ncontrolcode;
        const checkListId = this.state.controlMap.has("ConfigureCheckList") && this.state.controlMap.get("ConfigureCheckList").ncontrolcode;
        const reportFilterTypeId = this.state.controlMap.has("ConfigureReportFilterType") && this.state.controlMap.get("ConfigureReportFilterType").ncontrolcode;
        const actionList = [];
        let validationColumnList=[];
        if (this.state.userRoleControlRights.indexOf(sampleFieldId) !== -1) {
            actionList.push({ "method": templateMappingAction.CONFIGSAMPLEDISPLAY, "value": this.props.intl.formatMessage({ id: "IDS_CONFIGUREDISPLAYFIELDS" }), "controlId": sampleFieldId })
        }
        if (this.props.Login.masterData.realSampleValue && this.props.Login.masterData.realSampleValue.value !== SampleType.Masters && this.props.Login.masterData.realSampleValue.value !== SampleType.GOODSIN &&
            this.state.userRoleControlRights.indexOf(sampleEditFieldId) !== -1) {
            actionList.push({ "method": templateMappingAction.CONFIGSAMPLEEDIT, "value": this.props.intl.formatMessage({ id: "IDS_CONFIGUREEDITFIELDS" }), "controlId": sampleEditFieldId })

            //Added by sonia on 11th NOV 2024 for jira id:ALPD-5025    
            if (this.props.Login.masterData.realSampleValue.value !== SampleType.Masters && 
                this.props.Login.masterData.realSampleValue.value !== SampleType.GOODSIN &&
                this.props.Login.masterData.realSampleValue.value !== SampleType.PROTOCOL &&
                this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.item.nneedsubsample === true) {
                if (this.state.userRoleControlRights.indexOf(subSampleFieldId) !== -1) {
                    actionList.push({ "method": templateMappingAction.CONFIGSUBSAMPLEDISPLAY, "value": this.props.intl.formatMessage({ id: "IDS_CONFIGURESUBSAMPLEDISPLAYFIELDS" }), "controlId": subSampleFieldId })
                }

                if (this.state.userRoleControlRights.indexOf(subSampleEditFieldId) !== -1) {
                    actionList.push({ "method": templateMappingAction.CONFIGSUBSAMPLEEDIT, "value": this.props.intl.formatMessage({ id: "IDS_CONFIGURSUBSAMPLEEEDITFIELDS" }), "controlId": subSampleEditFieldId })
                }
            }
        }
        if (this.state.userRoleControlRights.indexOf(combinationUniqueFieldId) !== -1) {
            actionList.push({ "method": templateMappingAction.CONFIGUNIQUE, "value": this.props.intl.formatMessage({ id: "IDS_CONFIGURECOMBINATIONUNIQUEFIELDS" }), "controlId": combinationUniqueFieldId })
        }
        if (this.state.userRoleControlRights.indexOf(combinationUniqueFieldId) !== -1) {//sampleAuditConfigId
            actionList.push({ "method": templateMappingAction.CONFIGSAMPLEAUDIT, "value": this.props.intl.formatMessage({ id: "IDS_CONFIGUREAUDITFIELDS" }), "controlId": combinationUniqueFieldId })
        }
        // if (this.props.Login.masterData.realSampleValue && this.props.Login.masterData.realSampleValue.value !== SampleType.Masters && this.props.Login.masterData.realSampleValue.value !== SampleType.GOODSIN &&
        //     this.state.userRoleControlRights.indexOf(sendToStoreId) !== -1) {
        //     actionList.push({ "method": templateMappingAction.CONFIGSENDTOSTORE, "value": this.props.intl.formatMessage({ id: "IDS_CONFIGURESENDTOSTORE" }), "controlId": sendToStoreId })
        // }

        if (this.props.Login.masterData.realSampleValue && this.props.Login.masterData.realSampleValue.value === SampleType.GOODSIN &&
            this.state.userRoleControlRights.indexOf(checkListId) !== -1) {
            actionList.push({ "method": templateMappingAction.CONFIGURECHECKLIST, "value": this.props.intl.formatMessage({ id: "IDS_CONFIGURECHECKLIST" }), "controlId": checkListId })
        }
        if (this.props.Login.masterData.realSampleValue && this.props.Login.masterData.realSampleValue.value !== SampleType.PROTOCOL &&
            this.state.userRoleControlRights.indexOf(exportFieldsID) !== -1) {
            actionList.push({ "method": templateMappingAction.CONFIGEXPORTFIELDS, "value": this.props.intl.formatMessage({ id: "IDS_CONFIGUREEXPORTFIELD" }), "controlId": exportFieldsID })
        }
        //Added by sonia on 11th NOV 2024 for jira id:ALPD-5025    
        if (this.props.Login.masterData.realSampleValue && this.props.Login.masterData.realSampleValue.value !== SampleType.Masters && this.props.Login.masterData.realSampleValue.value !== SampleType.GOODSIN 
            && this.props.Login.masterData.realSampleValue.value !== SampleType.PROTOCOL &&
            this.state.userRoleControlRights.indexOf(reportFilterTypeId) !== -1) {
            actionList.push({ "method": templateMappingAction.CONFIGURERELEASESAMPLEFILTER, "value": this.props.intl.formatMessage({ id: "IDS_CONFIGURERELEASESAMPLEFILTER" }), "controlId": reportFilterTypeId })
        }        const filterParam = {
            inputListName: "DesignTemplateMapping",
            selectedObject: "selectedDesignTemplateMapping",
            primaryKeyField: "ndesigntemplatemappingcode",
            fetchUrl: "designtemplatemapping/getDesignTemplateMapping",
            fecthInputObject: {
                nregtypecode: this.props.Login.masterData.realSampleValue ?
                    this.props.Login.masterData.realSampleValue.value === SampleType.Masters ? transactionStatus.NA : parseInt(this.props.Login.masterData.realRegTypeValue ? this.props.Login.masterData.realRegTypeValue.value || -1 : -1) : -1,
                nregsubtypecode: this.props.Login.masterData.realSampleValue ? this.props.Login.masterData.realSampleValue.value === SampleType.Masters ? transactionStatus.NA : parseInt(this.props.Login.masterData.realRegSubTypeValue ? this.props.Login.masterData.realRegSubTypeValue.value || -1 : -1) : -1,

                userinfo: this.props.Login.userInfo,
                nsampletypecode: this.props.Login.masterData["realSampleValue"] ? this.props.Login.masterData["realSampleValue"].value : -1,
                //nregtypecode: this.props.Login.masterData["realRegTypeValue"] ? this.props.Login.masterData["realRegTypeValue"].value : -1,
                //nregsubtypecode: this.props.Login.masterData["realRegSubTypeValue"] ? this.props.Login.masterData["realRegSubTypeValue"].value : -1,
                nformcode: this.props.Login.masterData["realFormValue"] ? this.props.Login.masterData["realFormValue"].value : -1,
            },
            masterData: this.props.Login.masterData,
            searchFieldList: this.searchFieldList

        };
      this.props.Login.masterData.realFormValue  && this.props.Login.masterData.realFormValue.value==-2 ?
       // Object.keys(this.props.Login.masterData.length > 0) && this.props.Login.masterData.realFormValue  !== undefined && this.props.Login.masterData.realFormValue.value==-2 ?
         validationColumnList.push( 
            { "idsName": "IDS_FORMNAME", "dataField": "sformname", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
            { "idsName": "IDS_MODULENAME", "dataField": "nmodulecode", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
            { "idsName": "IDS_TEMPLATENAME", "dataField": "nreactregtemplatecode", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
        )
        :validationColumnList.push(
            { "idsName": "IDS_TEMPLATENAME", "dataField": "nreactregtemplatecode", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
           )
        //ALPD-903

        //Added by sonia on 11th NOV 2024 for jira id:ALPD-5025  
        if (this.props.Login.masterData["realSampleValue"] && this.props.Login.masterData["realSampleValue"].value !== SampleType.Masters 
            && this.props.Login.masterData["realSampleValue"] && this.props.Login.masterData["realSampleValue"].value !== SampleType.GOODSIN
            && this.props.Login.masterData["realSampleValue"] && this.props.Login.masterData["realSampleValue"].value !== SampleType.PROTOCOL
            && this.props.Login.masterData.realRegSubTypeValue && this.props.Login.masterData.realRegSubTypeValue.item.nneedsubsample === true) {
            validationColumnList.push({ "idsName": "IDS_SUBSAMPLETEMPLATE", "dataField": "nsubsampletemplatecode", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },);
        }

        const mandatoryFields = [];
           validationColumnList.forEach(item => item.mandatory === true ?
            mandatoryFields.push(item) : ""
        );
        // let breadCrumbDataDate = convertDateValuetoString(this.props.Login.masterData && this.props.Login.masterData.FromDate,
        //     this.props.Login.masterData && this.props.Login.masterData.ToDate,
        //     this.props.Login.userInfo)

        // const breadCrumbData = [

        let breadCrumbData = [];
        this.props.Login.masterData["realSampleValue"] && this.props.Login.masterData["realSampleValue"].value === 4 ?
            breadCrumbData = [
                {
                    "label": "IDS_SAMPLETYPE",
                    "value": this.props.Login.masterData.realSampleValue ? this.props.Login.masterData.realSampleValue.label : "-"
                },
                //defaultMasterType
                // {
                //     "label": "IDS_MASTERTYPE",
                //     "value": this.props.Login.masterData.realFormValue ? this.props.Login.masterData.realFormValue.label : "-"
                // },
                {
                    "label": "IDS_SCREEN",
                    "value": this.props.Login.masterData.realFormValue ? this.props.Login.masterData.realFormValue.label : "-"
                }
            ] :
            //Added by sonia on 11th NOV 2024 for jira id:ALPD-5025   
            this.props.Login.masterData["realSampleValue"] && (this.props.Login.masterData["realSampleValue"].value === SampleType.GOODSIN 
            || this.props.Login.masterData["realSampleValue"].value === SampleType.PROTOCOL 
           // ||this.props.Login.masterData["realSampleValue"].value === SampleType.STABILITY
             )  ?
                breadCrumbData = [
                    {
                        "label": "IDS_SAMPLETYPE",
                        "value": this.props.Login.masterData.realSampleValue ? this.props.Login.masterData.realSampleValue.label : "-"
                    }
                ] :
             
                breadCrumbData = [
                    {
                        "label": "IDS_SAMPLETYPE",
                        "value": this.props.Login.masterData.realSampleValue ? this.props.Login.masterData.realSampleValue.label : "-"
                    }, {
                        "label": "IDS_REGTYPE",
                        "value": this.props.Login.masterData.realRegTypeValue ? this.props.Login.masterData.realRegTypeValue.label : "-"
                    }, {
                        "label": "IDS_REGSUBTYPE",
                        "value": this.props.Login.masterData.realRegSubTypeValue ? this.props.Login.masterData.realRegSubTypeValue.label : "-"
                    }
                ];

        const addParam = {
            screenName: this.props.intl.formatMessage({ id: "IDS_DESIGNTEMPLATEMAPPING" }),
            operation: "create",
            userInfo: this.props.Login.userInfo,
            realSampleValue: this.props.Login.masterData.realSampleValue ? this.props.Login.masterData.realSampleValue.value : -1,
            realRegTypeValue: this.props.Login.masterData.realRegTypeValue ? this.props.Login.masterData.realRegTypeValue.value : -1,
            realRegSubTypeValue: this.props.Login.masterData.realRegSubTypeValue ? this.props.Login.masterData.realRegSubTypeValue.value : -1,
            controlId: addId,
            moduleTypeArray: this.state.moduleTypeArray
        }

       

        // console.log("render, props, state:", this.props.Login);
        return (
            <>
                <ListWrapper className="client-listing-wrap mtop-fixed-breadcrumb fixed_breadcrumd">
                    {/* <ReactTooltip place="bottom" globalEventOff='click' id="tooltip_list_wrap" /> */}
                    {breadCrumbData.length > 0 ?
                        <Affix top={53}>
                            <BreadcrumbComponent breadCrumbItem={breadCrumbData} />
                        </Affix> : ""
                    }
                    {/* Start of get display*/}
                    {/* <div className="client-listing-wrap mtop-4"> */}
                    {/* <ReactTooltip place="bottom" globalEventOff='click' id="tooltip_list_wrap" /> */}
                    <Row noGutters={true}>
                        <Col md={`${!this.props.sidebarview ? '4' : "2"}`}> 
                            <ListMaster
                                formatMessage={this.props.intl.formatMessage}
                                screenName={this.props.intl.formatMessage({ id: "IDS_DESIGNTEMPLATEMAPPING" })}
                                masterData={this.props.Login.masterData}
                                userInfo={this.props.Login.userInfo}
                                masterList={this.props.Login.masterData.searchedData || this.props.Login.masterData.DesignTemplateMapping}
                                getMasterDetail={(designtemplatemapping) => this.props.getDesignTemplateMappingDetail(designtemplatemapping, this.props.Login.userInfo, this.props.Login.masterData)}
                                selectedMaster={this.props.Login.masterData.selectedDesignTemplateMapping}
                                primaryKeyField="ndesigntemplatemappingcode"
                                mainField="sregtemplatename"
                                firstField="sversionno"
                                secondField="stransdisplaystatus"
                                filterColumnData={this.props.filterColumnData}
                                filterParam={filterParam}
                                userRoleControlRights={this.state.userRoleControlRights}
                                addId={addId}
                                searchRef={this.searchRef}
                                reloadData={this.reloadData}
                                hidePaging={true}
                                openModal={() => this.props.getDesignTemplateMappingComboService(addParam)}
                                showFilterIcon={true}
                                showFilter={this.props.Login.showFilter}
                                openFilter={this.openFilter}
                                closeFilter={this.closeFilter}
                                onFilterSubmit={this.onFilterSubmit}

                                filterComponent={[
                                    {
                                        "IDS_TEMPLATEFILTER":
                                            <TemplateFilter
                                                formatMessage={this.props.intl.formatMessage}
                                                filterSampletype={this.state.listSampletype || []}
                                                filterRegistrationType={this.state.listRegistrationType || []}
                                                filterRegistrationSubType={this.state.listRegistrationSubType || []}
                                                filterForms={this.state.listForms || []}
                                                defaultsampletype={this.props.Login.masterData["defaultsampletype"] || {}}
                                                defaultregsubtype={this.props.Login.masterData["defaultregsubtype"] || []}
                                                defaultregtype={this.props.Login.masterData["defaultregtype"] || []}
                                                defaultform={this.props.Login.masterData.defaultform || []}
                                                filterComboChange={this.filterComboChange}
                                                masterTypeArray={this.props.Login.masterData.masterTypeArray || []}
                                                defaultMasterType={this.props.Login.masterData.defaultMasterType || {}}
                                            />
                                    }
                                ]}
                            />
                        </Col>
                        <Col md={`${!this.props.sidebarview ? '8' : "10"}`} className="position-relative">
                            <div className="sidebar-view-btn-block">
                                <div className="sidebar-view-btn " onClick={this.props.parentFunction}>
                                    {!this.props.sidebarview ?                    
                                        <i class="fa fa-less-than"></i> :
                                        <i class="fa fa-greater-than"></i> 
                                    }
                                </div>
                            </div>
                            <ContentPanel className="panel-main-content">
                                <Card className="border-0">
                                    {this.props.Login.masterData.DesignTemplateMapping && this.props.Login.masterData.DesignTemplateMapping.length > 0 && this.props.Login.masterData.selectedDesignTemplateMapping ?
                                        <>
                                            <Card.Header>
                                                <Card.Title>
                                                    <h1 className="product-title-main">{this.props.Login.masterData.selectedDesignTemplateMapping.sregtemplatename}</h1>
                                                </Card.Title>
                                                <Card.Subtitle className="text-muted font-weight-normal">
                                                    <Row>
                                                        <Col md={10} className="d-flex">
                                                            <h2 className="product-title-sub flex-grow-1">
                                                                {`${this.props.intl.formatMessage({ id: "IDS_VERSION" })} : ${this.props.Login.masterData.selectedDesignTemplateMapping.sversionno}`}
                                                                <span className={`btn btn-outlined ${this.props.Login.masterData.selectedDesignTemplateMapping.ntransactionstatus === transactionStatus.DRAFT ? "outline-secondary" : this.props.Login.masterData.selectedDesignTemplateMapping.ntransactionstatus === transactionStatus.APPROVED ? "outline-success" : "outline-danger"} btn-sm mx-md-3 mx-sm-2`}>
                                                                    {this.props.Login.masterData.selectedDesignTemplateMapping.stransdisplaystatus}
                                                                </span>

                                                            </h2>
                                                        </Col>
                                                        <Col md={2}>
                                                            <div className="d-flex product-category float-right icon-group-wrap">
                                                                <Nav.Link className="btn btn-circle outline-grey mr-2"
                                                                    hidden={this.state.userRoleControlRights.indexOf(approveId) === -1}
                                                                    data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_APPROVE" })}
                                                                    // data-for="tooltip_list_wrap"
                                                                    // onClick={() => this.onApproveClick()}
                                                                    onClick={(e) => this.props.Login.masterData.realSampleValue && 
                                                                        this.props.Login.masterData.realSampleValue.value === SampleType.Masters 
                                                                         || this.props.Login.masterData.realSampleValue.value === SampleType.GOODSIN
                                                                        // || this.props.Login.masterData.realSampleValue.value === SampleType.STABILITY
                                                                          ? this.openModal(approveId, 'Approve') : this.onApproveClick()}
                                                                >
                                                                    <FontAwesomeIcon icon={faThumbsUp} 
                                                                        // title={this.props.intl.formatMessage({ id: "IDS_APPROVE" })} - ALPD-5396 - commented by gowtham - Template Mapping Approve Button shows 2 tool tip
                                                                    />
                                                                </Nav.Link>

                                                                <Nav.Link className=" btn btn-circle outline-grey mr-2"
                                                                    data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_DELETE" })}
                                                                    //    data-for="tooltip_list_wrap"
                                                                    hidden={this.state.userRoleControlRights.indexOf(deleteId) === -1}
                                                                    // onClick={() => this.ConfirmDelete(this.state.approveId)}>
                                                                    onClick={() => this.ConfirmDelete()}>
                                                                    <FontAwesomeIcon icon={faTrashAlt} />
                                                                </Nav.Link>

                                                                {actionList.length > 0 ?
                                                                    <CustomPopover
                                                                        nav={true}
                                                                        data={actionList}
                                                                        Button={false}
                                                                        hideIcon={true}
                                                                        btnClasses="btn-circle btn_grey ml-2"
                                                                        textKey="value"
                                                                        icon={faChevronCircleDown}
                                                                        // toolTip={this.props.intl.formatMessage({ id: "IDS_CONFIGURE" })}
                                                                        dynamicButton={(value) => this.actionMethod(value)}
                                                                        userRoleControlRights={this.state.userRoleControlRights}
                                                                    />
                                                                    :
                                                                    ""}

                                                            </div>

                                                        </Col>
                                                    </Row>
                                                </Card.Subtitle>
                                            </Card.Header>
                                            <Card.Body>
                                                {this.props.Login.masterData.selectedDesignTemplateMapping &&
                                                    this.props.Login.masterData.selectedDesignTemplateMapping.nformcode > 0 &&
                                                    <Row>
                                                        <Col md={6}>
                                                            <FormGroup>
                                                                <FormLabel><FormattedMessage id="IDS_MODULENAME" message="Module Name" /></FormLabel>
                                                                <ReadOnlyText>   {this.props.Login.masterData.selectedDesignTemplateMapping.smodulename}
                                                                </ReadOnlyText>
                                                            </FormGroup>

                                                        </Col>
                                                        <Col md={6}>
                                                            <FormLabel><FormattedMessage id="IDS_FORMNAME" message="Form Name" /></FormLabel>
                                                            <ReadOnlyText>
                                                                {this.props.Login.masterData.selectedDesignTemplateMapping.sformname}
                                                            </ReadOnlyText>

                                                        </Col>
                                                    </Row>}

                                                <Row>
                                                    <Col md={12} >
                                                        <CustomTabs tabDetail={this.tabDetail()} onTabChange={this.onTabChange} />
                                                    </Col>
                                                </Row>

                                            </Card.Body>

                                        </>
                                        : ""
                                    }
                                </Card>
                            </ContentPanel>
                        </Col>
                    </Row>
                </ListWrapper>


                {this.props.Login.openModal &&
                    <SlideOutModal
                        show={this.props.Login.openModal}
                        // size={(this.props.Login.operation === 'configure'
                        //     || this.props.Login.operation === 'configuresubsample'
                        //     || this.props.Login.operation === 'configureaudit') ? "xl" : "lg"}
                        size={this.props.Login.screenName === "" || this.props.Login.screenName === 'Template Mapping' || this.props.Login.operation === 'Approve' ? 'lg' : "xl"}//"xl"
                        closeModal={this.closeModal}
                        operation={this.props.Login.operation}
                        inputParam={this.props.Login.inputParam}
                        screenName={this.props.Login.screenName}
                        onSaveClick={this.onSaveClick}
                        hideSave={this.props.Login.operation === 'configurechecklist'}
                        esign={this.props.Login.loadEsign}
                        validateEsign={this.validateEsign}
                        masterStatus={this.props.Login.masterStatus}
                        updateStore={this.props.updateStore}
                        selectedRecord={this.state.selectedRecord || {}}

                        mandatoryFields={this.props.Login.operation === 'Approve' ? [{ "idsName": "IDS_VIEWNAME", "dataField": "sviewname", "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" }
                        ] : this.props.Login.operation === 'configurechecklistadd' ? [{ "idsName": "IDS_CHECKLIST", "dataField": "nchecklistversioncode", "mandatoryLabel": "IDS_SELECT", "controlType": "textbox" }
                        ] : (this.props.Login.operation === 'configure'
                            || this.props.Login.operation === 'configuresubsample'
                            || this.props.Login.operation === 'configureedit'
                            || this.props.Login.operation === 'configuresubsampleedit'
                            || this.props.Login.operation === 'configureunique'
                            || this.props.Login.operation === 'configureaudit'
                            || this.props.Login.operation === 'configuresendtostore'
                            || this.props.Login.operation === 'configureexportfields'
                            ||this.props.Login.operation === 'configurereleasesamplefilter') ? [] : mandatoryFields}

                        addComponent={this.props.Login.loadEsign ?
                            <Esign operation={this.props.Login.operation}
                                formatMessage={this.props.intl.formatMessage}
                                onInputOnChange={this.onInputOnChange}
                                inputParam={this.props.Login.inputParam}
                                selectedRecord={this.state.selectedRecord || {}}
                            />
                            : this.props.Login.operation === 'Approve' ?
                                <Row>
                                    <Col md={12}>
                                        <FormInput
                                            label={this.props.intl.formatMessage({ id: "IDS_VIEWNAME" })}
                                            name={"sviewname"}
                                            type="text"
                                            onChange={(event) => this.onInputOnChange(event)}
                                            placeholder={this.props.intl.formatMessage({ id: "IDS_VIEWNAME" })}
                                           // value={this.state.selectedRecord["sviewname"]}
                                            value={this.props.Login.selectedRecord["sviewname"]}
                                            isMandatory={true}
                                            maxLength={30}
                                            onPaste={true}
                                        />
                                    </Col>
                                </Row>

                                : this.props.Login.operation === 'configure' || this.props.Login.operation === 'configuresubsample' ?
                                    <ConfigureScreenFields
                                        operation={this.props.Login.operation}
                                        designData={this.props.Login.designData || {}}
                                        inputParam={this.props.Login.inputParam}
                                        dataResult={this.props.Login.masterData.selectedDesignTemplateMapping.nsampletypecode === SampleType.Masters ?
                                            this.props.Login.dataResult || [] :
                                            this.props.Login.dataResult || {}}
                                        onChangeToggle={this.onChangeToggle}
                                        approvedRegSubTypeVersion={this.props.Login.approvedRegSubTypeVersion}
                                        selectedSampleType={this.props.Login.masterData.selectedDesignTemplateMapping.nsampletypecode}
                                    />
                                    : (this.props.Login.operation === 'configureedit'
                                        || this.props.Login.operation === 'configuresubsampleedit') ?
                                        <ConfigureEditFields
                                            operation={this.props.Login.operation}
                                            designData={this.props.Login.editFieldDesignData || {}}
                                            inputParam={this.props.Login.inputParam}
                                            dataResult={this.props.Login.masterData.selectedDesignTemplateMapping.nsampletypecode === SampleType.Masters ?
                                                this.props.Login.editFieldDataResult || [] :
                                                this.props.Login.editFieldDataResult || {}}
                                            selectedRecord={this.state.selectedRecord || {}}
                                            // onChangeToggle={this.onChangeToggle}
                                            onComboChange={this.onConfigureComboChange}
                                            // approvedRegSubTypeVersion={this.props.Login.approvedRegSubTypeVersion}
                                            selectedSampleType={this.props.Login.masterData.selectedDesignTemplateMapping.nsampletypecode}
                                        />
                                        : (this.props.Login.operation === 'configureaudit') ?
                                            <ConfigureAuditFields
                                                operation={this.props.Login.operation}
                                                needSubSample={this.props.Login.masterData.realRegSubTypeValue ?
                                                    this.props.Login.masterData.realRegSubTypeValue.item.nneedsubsample : false}
                                                designData={this.props.Login.auditFieldDesignData || {}}
                                                auditTable={this.props.Login.auditTable || {}}
                                                auditData={this.props.Login.auditData || {}}
                                                inputParam={this.props.Login.inputParam}
                                                formName={this.props.Login.masterData.realFormValue && this.props.Login.masterData.realFormValue.label}
                                                dataResult={this.props.Login.masterData.selectedDesignTemplateMapping.nsampletypecode === SampleType.Masters ?
                                                    this.props.Login.auditFieldDataResult || [] :
                                                    this.props.Login.auditFieldDataResult || {}}
                                                selectedRecord={this.state.selectedRecord || {}}
                                                onChangeToggle={this.onChangeToggle}
                                                selectedSampleType={this.props.Login.masterData.selectedDesignTemplateMapping.nsampletypecode}
                                            />
                                            : this.props.Login.operation === 'configureunique' ?
                                                <ConfigureUniqueFields
                                                    designData={this.props.Login.designData || {}}
                                                    inputParam={this.props.Login.inputParam}
                                                    // dataResult={this.props.Login.masterData.selectedDesignTemplateMapping.nsampletypecode === SampleType.Masters ?
                                                    //     this.props.Login.dataResult || [] :
                                                    //     this.props.Login.dataResult || {}}
                                                    dataList={this.props.Login.dataList || []}
                                                    dataListCount={this.props.Login.dataListCount || []}
                                                    dataListsubsample={this.props.Login.dataListSubSample || []}
                                                    dataListCountsubsample={this.props.Login.dataListCountSubSample || []}
                                                    onInputOnChange={this.onInputOnChangeForUnique}
                                                    addCombinatonUnique={this.addCombinatonUnique}
                                                    deleteCombinationUnique={this.deleteCombinationUnique}
                                                    slanguagetypecode={this.props.Login.userInfo.slanguagetypecode}
                                                    approvedRegSubTypeVersion={this.props.Login.approvedRegSubTypeVersion}
                                                    selectedTemplateType={this.props.Login.masterData.selectedDesignTemplateMapping.nsampletypecode}
                                                /> : this.props.Login.operation === 'configureexportfields' ?
                                                    <ConfigureExportFields
                                                        operation={this.props.Login.operation}
                                                        needSubSample={this.props.Login.masterData.realRegSubTypeValue ?
                                                            this.props.Login.masterData.realRegSubTypeValue.item.nneedsubsample : false}
                                                        designData={this.props.Login.designData || {}}
                                                        inputParam={this.props.Login.inputParam}
                                                        formName={this.props.Login.masterData.realFormValue && this.props.Login.masterData.realFormValue.label}
                                                        dataResult={this.props.Login.sampleexportdataResult || {}}
                                                        selectedRecord={this.state.selectedRecord || {}}
                                                        onChangeToggle={this.onChangeExportFields}
                                                        selectedSampleType={this.props.Login.masterData.selectedDesignTemplateMapping.nsampletypecode}
                                                    />
                                                    : this.props.Login.operation === 'configurechecklist' ?
                                                        <ConfigureCheckList
                                                            operation={this.props.Login.operation}
                                                            version={this.props.Login.checkListData || {}}
                                                            checkListQB={this.props.Login.checkListQB || {}}
                                                            onClickAddCheckList={this.onClickAddCheckList}
                                                            dataResult={process(this.props.Login.checkListQB ? this.props.Login.checkListQB : [], this.state.dataStateCL)}
                                                            dataState={this.state.dataStateCL}
                                                            dataStateChange={this.dataStateChange}
                                                            userInfo={this.props.Login.userInfo}
                                                        />


                                                        : this.props.Login.operation === 'configurechecklistadd' ?
                                                            <ConfigureCheckListAdd
                                                                checkList={this.props.Login.checkList || {}}
                                                                selectedRecord={this.state.selectedRecord || {}}
                                                                onComboChange={this.onComboChangeCheckList}

                                                            />

                                                            :
                                                            // this.props.Login.operation === 'configuresendtostore' ?
                                                            //     <ConfigureSendToStoreFields
                                                            //         operation={this.props.Login.operation}
                                                            //         SampleName={this.props.Login.samplename || {}}
                                                            //         needSubSample={this.props.Login.needsubsample || {}}
                                                            //         MainSampleList={this.props.Login.SampleTemplateNumber || []}
                                                            //         MainSubSampleList={this.props.Login.SampleTemplatecombobox}
                                                            //         SampleList={this.props.Login.subSampleTemplateNumber || []}
                                                            //         SubSampleList={this.props.Login.subSampleTemplateCombobox}
                                                            //         selectedRecord={this.state.selectedRecord || {}}
                                                            //         // onChangeToggle={this.onChangeToggle}
                                                            //         onComboChange={this.onComboChange}
                                                            //         selectedValue={this.props.Login.selectedValue[0]}
                                                            //     />
                                                            //     :
                                                                this.state.showSynonym ?
                                                                    <AddSynonym
                                                                        selectedFieldRecord={this.state.selectedRecord}
                                                                        onInputOnChange={this.onInputOnChange}
                                                                        languages={this.props.Login.languageList || []}
                                                                        fieldName="nmodulecode"
                                                                    />
                                                                    :this.props.Login.operation === 'configurereleasesamplefilter'?

                                                                    <ConfigureReportFilterType
                                                                    operation={this.props.Login.operation}
                                                                    needSubSample={this.props.Login.masterData.realRegSubTypeValue ?
                                                                        this.props.Login.masterData.realRegSubTypeValue.item.nneedsubsample : false}
                                                                    designData={this.props.Login.designData || {}}
                                                                    inputParam={this.props.Login.inputParam}
                                                                    formName={this.props.Login.masterData.realFormValue && this.props.Login.masterData.realFormValue.label}
                                                                    dataResult={this.props.Login.sampleReportFilterTypeData || {}}
                                                                    selectedRecord={this.state.selectedRecord || {}}
                                                                    onChangeToggle={this.onChangeReportFilterTypeFields}
                                                                    selectedSampleType={this.props.Login.masterData.selectedDesignTemplateMapping.nsampletypecode}
                                                                    onChangeAwesomeQueryBuilder={this.onChangeAwesomeQueryBuilder}
                                                                    awesomeTree={this.props.Login.awesomeTree}
                                                                    userInfo={this.props.Login.userInfo}
                                                                    //fields={ this.state.fields}
                                                                    fields={this.props.Login.fields||{}}
                                                                    sampleReportFilterTypeData = {this.state.sampleReportFilterTypeData}
                                                                    settingsCount={parseInt(this.props.Login.settings && this.props.Login.settings['48'])}
                                                                    childDataChange={this.childDataChange}
                                                                    updateStore={this.props.updateStore}
                                                                />
                                                                    : <AddDesignTemplateMapping
                                                                        selectedRecord={this.state.selectedRecord || {}}
                                                                        onInputOnChange={this.onInputOnChange}
                                                                        onComboChange={this.onComboChange}
                                                                        handleDateChange={this.handleDateChange}
                                                                        formatMessage={this.props.intl.formatMessage}
                                                                        designtemplatemappingList={this.props.Login.designtemplatemappingList}
                                                                        subSampleTemplateList={this.props.Login.subSampleTemplateList}
                                                                        selectedDesignTemplateMapping={this.props.Login.masterData.selectedDesignTemplateMapping || {}}
                                                                        operation={this.props.Login.operation}
                                                                        userLogged={this.props.Login.userLogged}
                                                                        inputParam={this.props.Login.inputParam}
                                                                        userInfo={this.props.Login.userInfo}
                                                                        nformcode={this.props.Login.masterData.realFormValue ? 
                                                                            this.props.Login.masterData.realFormValue.value : -1}
                                                                        needSubSample={this.props.Login.masterData.realSampleValue.value === SampleType.Masters 
                                                                            || this.props.Login.masterData.realSampleValue.value === SampleType.GOODSIN 
                                                                            || this.props.Login.masterData.realSampleValue.value === SampleType.PROTOCOL ? false  //Added by sonia on 11th NOV 2024 for jira id:ALPD-5025    
                                                                            : this.props.Login.masterData.realRegSubTypeValue ? this.props.Login.masterData.realRegSubTypeValue.item.nneedsubsample : false}
                                                                        designTemplateQualisModule={this.props.Login.designTemplateQualisModule}
                                                                        language={this.props.Login.language}
                                                                        moduleTypeArray={this.state.moduleTypeArray || []}
                                                                        sampleTypeValue={ this.props.Login.masterData.realSampleValue ? this.props.Login.masterData.realSampleValue.value : -1}
                                                                    />}
                    />
                }

            </>
        );
    }
    queryBuilderfillingColumns=(data)=>{
        const temparray =[];
         data && data.map((option) => {  
           if(option.samplefiltertypefields ===true) { 
            temparray.push( {
                "idsName": option.realData[designProperties.LABEL][this.props.Login.userInfo.slanguagetypecode],
                "dataField": option.realData[designProperties.LISTITEM]==='combo'? "(r.jsondata->'"+option.realData[designProperties.VALUE]+"'->>'"+option.realData[designProperties.PRIMARYKEY]+"')::int" : option.realData[designProperties.LISTITEM]==='Numeric'?"(r.jsondata->>'"+option.realData[designProperties.VALUE]+"')::int":"(r.jsondata->>'"+option.realData[designProperties.VALUE]+"')", "width": "200px", "filterinputtype": option.realData[designProperties.LISTITEM]
            })
        };
        });
        return temparray;
    }
    openModal = (ncontrolcode, operation) => {     
              const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                selectedRecord: {}, operation: operation, ncontrolcode, selectedId: null,
                openModal: true, screenName: this.props.Login.inputParam.displayName
            }
        }
        this.props.updateStore(updateInfo);
    }

    onTabChange = (tabProps) => {
        const screenName = tabProps.screenName;
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { screenName }
        }
        this.props.updateStore(updateInfo);
    }

    tabDetail = () => {

        // console.log("this.props.Login.masterData:", this.props.Login.masterData);
        const Layout = this.props.Login.masterData.selectedDesignTemplateMapping &&
            this.props.Login.masterData.selectedDesignTemplateMapping.jsondata;

        const subSampleLayout = this.props.Login.masterData.selectedDesignTemplateMapping &&
            this.props.Login.masterData.selectedDesignTemplateMapping.subsamplejsondata;

        const sampleType = this.props.Login.masterData.realSampleValue.value;

        const needsubsample = this.props.Login.masterData.realRegSubTypeValue ? this.props.Login.masterData.realRegSubTypeValue.item.nneedsubsample : false;

        const tabMap = new Map();
        tabMap.set("IDS_TEMPLATE", <Card>
            {/* <Card.Header><FormattedMessage id="IDS_TEMPLATE" message="Template" /></Card.Header> */}
            <Card.Body>
                {
                    Layout ?
                        Layout.map((item) =>
                            <Row>
                                {item.children.length > 0 ?
                                    item.children.map((column) =>
                                        <Col md={12 / item.children.length}>
                                            {
                                                column.children.map((component) => {
                                                    return (
                                                        component.hasOwnProperty("children") ?
                                                            <Row>
                                                                {component.children.map(componentrow =>
                                                                    componentrow.inputtype !== "frontendsearchfilter" && componentrow.inputtype !== "backendsearchfilter" &&
                                                                    <Col md={componentrow && componentrow.length || 4}>
                                                                        <FormGroup>
                                                                            <FormLabel>{componentrow.displayname ? componentrow.displayname[this.props.Login.userInfo.slanguagetypecode] || componentrow.label : componentrow.label}</FormLabel>
                                                                            <ReadOnlyText>{"-"}</ReadOnlyText>
                                                                        </FormGroup>
                                                                    </Col>
                                                                )
                                                                }
                                                            </Row>
                                                            :
                                                            component.inputtype !== "frontendsearchfilter" && component.inputtype !== "backendsearchfilter" &&
                                                            <FormGroup>
                                                                <FormLabel>{component.displayname ? component.displayname[this.props.Login.userInfo.slanguagetypecode] || component.label : component.label}</FormLabel>
                                                                <ReadOnlyText> {"-"}</ReadOnlyText>
                                                            </FormGroup>
                                                    )
                                                })
                                            }

                                        </Col>
                                    )
                                    : ""}
                            </Row>
                        )
                        :
                        ""
                }
            </Card.Body>
        </Card>);
        //Added by sonia on 11th NOV 2024 for jira id:ALPD-5025
        if (sampleType !== SampleType.Masters && sampleType !== SampleType.GOODSIN && sampleType !== SampleType.PROTOCOL && (needsubsample||sampleType===SampleType.STABILITY)) {
            tabMap.set("IDS_SUBSAMPLETEMPLATE", <Card>
                {/* <Card.Header><FormattedMessage id="IDS_SUBSAMPLETEMPLATE" message="Sub Sample Template" /></Card.Header> */}
                <Card.Body>
                    {
                        subSampleLayout ?
                            subSampleLayout.map((item) =>
                                <Row>
                                    {item.children.length > 0 ?
                                        item.children.map((column) =>
                                            <Col md={12 / item.children.length}>
                                                {
                                                    column.children.map((component) => {
                                                        return (
                                                            component.hasOwnProperty("children") ?
                                                                <Row>
                                                                    {component.children.map(componentrow =>
                                                                        componentrow.inputtype !== "frontendsearchfilter" && componentrow.inputtype !== "backendsearchfilter" &&
                                                                        <Col md={componentrow && componentrow.length || 4}>
                                                                            <FormGroup>
                                                                                <FormLabel>{componentrow.displayname ? componentrow.displayname[this.props.Login.userInfo.slanguagetypecode] || componentrow.label : componentrow.label}</FormLabel>
                                                                                <ReadOnlyText>{"-"}</ReadOnlyText>
                                                                            </FormGroup>
                                                                        </Col>
                                                                    )
                                                                    }
                                                                </Row>
                                                                :
                                                                component.inputtype !== "frontendsearchfilter" && component.inputtype !== "backendsearchfilter" &&
                                                                <FormGroup>
                                                                    <FormLabel>{component.displayname ? component.displayname[this.props.Login.userInfo.slanguagetypecode] || component.label : component.label}</FormLabel>
                                                                    <ReadOnlyText> {"-"}</ReadOnlyText>
                                                                </FormGroup>
                                                        )
                                                    })
                                                }

                                            </Col>
                                        )
                                        : ""}
                                </Row>
                            )
                            :
                            ""
                    }
                </Card.Body>
            </Card>);
        }

        return tabMap;
    }

    dataStateChange = (event) => {
        this.setState({
            dataStateCL: event.dataState
        });
    }

    actionMethod = (value) => {
        if (value.method === templateMappingAction.CONFIGSAMPLEDISPLAY) {
            this.openFieldConfiguration(value.controlId, "configure");
        }
        else if (value.method === templateMappingAction.CONFIGSAMPLEEDIT) {
            this.editFieldConfiguration(value.controlId, 'configureedit')
        }
        else if (value.method === templateMappingAction.CONFIGSUBSAMPLEDISPLAY) {
            this.openFieldConfiguration(value.controlId, 'configuresubsample')
        }
        else if (value.method === templateMappingAction.CONFIGSUBSAMPLEEDIT) {
            this.editFieldConfiguration(value.controlId, 'configuresubsampleedit')
        }
        else if (value.method === templateMappingAction.CONFIGUNIQUE) {
            this.openCombinationUniqueFieldConfiguration(value.controlId)
        }
        else if (value.method === templateMappingAction.CONFIGSAMPLEAUDIT) {
            this.auditFieldConfiguration(value.controlId, 'configureaudit')
        }
        // else if (value.method === templateMappingAction.CONFIGSENDTOSTORE) {
        //     this.mappingFieldConfiguration(value.controlId, 'configuresendtostore')
        // }
        else if (value.method === templateMappingAction.CONFIGEXPORTFIELDS) {
            this.exportFieldConfiguration(value.controlId, 'configureexportfields')
        }
        else if (value.method === templateMappingAction.CONFIGURECHECKLIST) {
            this.configureCheckList(value.controlId, 'configurechecklist')
        }
        else if (value.method === templateMappingAction.CONFIGURERELEASESAMPLEFILTER) {
            this.configureReportFilterType(value.controlId, 'configurereleasesamplefilter')
        }
    }


    configureCheckList = (controlCode, operation) => {
        let ncontrolcode = controlCode;
        let screenName = "";
        let inputParam = {
            inputData: {
                designtemplatemapping: {
                    ndesigntemplatemappingcode: this.props.Login.masterData.selectedDesignTemplateMapping.ndesigntemplatemappingcode
                },
                nregtypecode: this.props.Login.masterData.realSampleValue.value === SampleType.Masters
                    ? -1 : this.props.Login.masterData.defaultregtype
                        ? this.props.Login.masterData.defaultregtype.value : -1,
                nregsubtypecode: this.props.Login.masterData.realSampleValue.value === SampleType.Masters
                    ? -1 : this.props.Login.masterData.defaultregsubtype
                        ? this.props.Login.masterData.defaultregsubtype.value : -1,
                userinfo: this.props.Login.userInfo,
                //  nneedsubsample: this.props.Login.masterData.defaultregsubtype && this.props.Login.masterData.defaultregsubtype.item.nneedsubsample
            },
            operation,
            ncontrolcode,
            screenName
        }
        inputParam["SampleType"] = this.props.Login.masterData.realSampleValue.value;

        this.props.configureCheckList(inputParam)
    }

    exportFieldConfiguration = (controlCode, operation) => {
        let ncontrolcode = controlCode;
        let screenName = "IDS_FIELDS";
        let inputParam = {
            inputData: {
                designtemplatemapping: {
                    ndesigntemplatemappingcode: this.props.Login.masterData.selectedDesignTemplateMapping.ndesigntemplatemappingcode
                },
                nregtypecode: this.props.Login.masterData.realSampleValue.value === SampleType.Masters && this.props.Login.masterData.realSampleValue.value === SampleType.GOODSIN
                    ? -1 : this.props.Login.masterData.defaultregtype
                        ? this.props.Login.masterData.defaultregtype.value : -1,
                nregsubtypecode: this.props.Login.masterData.realSampleValue.value === SampleType.Masters && this.props.Login.masterData.realSampleValue.value === SampleType.GOODSIN
                    ? -1 : this.props.Login.masterData.defaultregsubtype
                        ? this.props.Login.masterData.defaultregsubtype.value : -1,
                userinfo: this.props.Login.userInfo,
                nneedsubsample: this.props.Login.masterData.defaultregsubtype && this.props.Login.masterData.defaultregsubtype.item.nneedsubsample
            },
            operation,
            ncontrolcode,
            screenName
        }
        inputParam["SampleType"] = this.props.Login.masterData.realSampleValue.value;

        this.props.exportFieldConfigService(inputParam)
    }

    configureReportFilterType = (controlCode, operation) => {
        let ncontrolcode = controlCode;
        let screenName = "IDS_FIELDS";
        let inputParam = {
            inputData: {
                designtemplatemapping: {
                    ndesigntemplatemappingcode: this.props.Login.masterData.selectedDesignTemplateMapping.ndesigntemplatemappingcode
                },
                nregtypecode: this.props.Login.masterData.realSampleValue.value === SampleType.Masters && this.props.Login.masterData.realSampleValue.value === SampleType.GOODSIN
                    ? -1 : this.props.Login.masterData.defaultregtype
                        ? this.props.Login.masterData.defaultregtype.value : -1,
                nregsubtypecode: this.props.Login.masterData.realSampleValue.value === SampleType.Masters && this.props.Login.masterData.realSampleValue.value === SampleType.GOODSIN
                    ? -1 : this.props.Login.masterData.defaultregsubtype
                        ? this.props.Login.masterData.defaultregsubtype.value : -1,
                userinfo: this.props.Login.userInfo,
                nneedsubsample: this.props.Login.masterData.defaultregsubtype && this.props.Login.masterData.defaultregsubtype.item.nneedsubsample
            },
            operation,
            ncontrolcode,
            screenName
        }
        inputParam["SampleType"] = this.props.Login.masterData.realSampleValue.value;

        this.props.reportFilterType(inputParam)
    }

    // onFilterSubmit = () => {
    //     this.reloadData()
    // }
    reloadData = () => {
        //ALPD-4803 done by Dhanushya RI,To check searchref key is present or not
        if (this.searchRef && this.searchRef.current) {
            this.searchRef.current.value = "";
          }
        let inputData = {
            userinfo: this.props.Login.userInfo,
            //Added by sonia on 11th NOV 2024 for jira id:ALPD-5025  
            nregtypecode: this.props.Login.masterData.realSampleValue.value === SampleType.Masters  || 
                          this.props.Login.masterData.realSampleValue.value === SampleType.GOODSIN  || 
                          this.props.Login.masterData.realSampleValue.value === SampleType.PROTOCOL ?
                          transactionStatus.NA : parseInt(this.props.Login.masterData.realRegTypeValue ? 
                          this.props.Login.masterData.realRegTypeValue.value || -1 : -1),

            nregsubtypecode: this.props.Login.masterData.realSampleValue.value === SampleType.Masters || 
                             this.props.Login.masterData.realSampleValue.value === SampleType.GOODSIN ||
                             this.props.Login.masterData.realSampleValue.value === SampleType.PROTOCOL ?
                             transactionStatus.NA : parseInt(this.props.Login.masterData.realRegSubTypeValue ?
                             this.props.Login.masterData.realRegSubTypeValue.value || -1 : -1),

            // nregtypecode: parseInt(this.props.Login.masterData.realRegTypeValue ? this.props.Login.masterData.realRegTypeValue.value || -1 : -1),
            //nregsubtypecode: parseInt(this.props.Login.masterData.realRegSubTypeValue ? this.props.Login.masterData.realRegSubTypeValue.value || -1 : -1),
            nsampletypecode: this.props.Login.masterData.realSampleValue.value,
            nformcode: this.props.Login.masterData.realSampleValue.value === SampleType.GOODSIN ? formCode.GOODSIN 
            : this.props.Login.masterData.defaultsampletype.value === SampleType.PROTOCOL ? formCode.PROTOCOL 
            : this.props.Login.masterData.defaultsampletype.value === SampleType.STABILITY ? formCode.STUDYALLOCATION 
            : parseInt(this.props.Login.masterData.realFormValue ? this.props.Login.masterData["realFormValue"].value : -1)
        };

        let inputParam = { masterData: this.props.Login.masterData, inputData };
        this.props.reloadDesignTemplateMapping(inputParam);


    }

    componentDidUpdate(previousProps) {
        let updateState = false;

        let { selectedRecord, userRoleControlRights, controlMap,
            listSampletype, listRegistrationType, listRegistrationSubType, listForms,fields ,sampleReportFilterTypeData} = this.state;


        if (this.props.Login.userInfo.nformcode !== previousProps.Login.userInfo.nformcode) {
            if (this.props.Login.userRoleControlRights) {
                this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode]
                    && Object.values(this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode]).map(item =>
                        userRoleControlRights.push(item.ncontrolcode))
                controlMap = getControlMap(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode)

                updateState = true;
            }

        }
        if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord) {
            updateState = true;
            selectedRecord = this.props.Login.selectedRecord
        }

        const selectedInput = {};
        let Taglstsampletype;
        let TaglistRegistrationType;
        let TaglistRegistrationSubType;
        let ListFormsMap;

        if (this.props.Login.masterData !== previousProps.Login.masterData) {

            updateState = true;
            if (this.props.Login.masterData.SampleTypes) {
                Taglstsampletype = constructOptionList(this.props.Login.masterData.SampleTypes || [], "nsampletypecode", "ssampletypename", "nsorter", "ascending", undefined);
                listSampletype = Taglstsampletype.get("OptionList");
            }
            if (this.props.Login.masterData.registrationTypes) {
                TaglistRegistrationType = constructOptionList(this.props.Login.masterData.registrationTypes || [], "nregtypecode", "sregtypename", undefined, undefined, undefined);
                listRegistrationType = TaglistRegistrationType.get("OptionList");
            }
            if (this.props.Login.masterData.registrationSubTypes) {
                TaglistRegistrationSubType = constructOptionList(this.props.Login.masterData.registrationSubTypes || [], "nregsubtypecode", "sregsubtypename", "nsorter", "ascending", undefined);
                listRegistrationSubType = TaglistRegistrationSubType.get("OptionList");
            }
            if (this.props.Login.masterData.qualisforms) {
                ListFormsMap = constructOptionList(this.props.Login.masterData.qualisforms || [], "nformcode", "sdisplayname", undefined, undefined, undefined);
                listForms = ListFormsMap.get("OptionList");
            }
        }
        if (this.props.Login.fields !== previousProps.Login.fields) {
            updateState = true;
            fields=this.props.Login.fields
        }
        if (this.props.Login.sampleReportFilterTypeData !== previousProps.Login.sampleReportFilterTypeData) {
            updateState = true;
            sampleReportFilterTypeData=this.props.Login.sampleReportFilterTypeData
        }
        
        if (updateState) {
            this.setState({
                selectedRecord, controlMap, userRoleControlRights,
                listSampletype, listRegistrationType, listRegistrationSubType,
                selectedInput, listForms,fields,sampleReportFilterTypeData
            })
        }
    }

    openFilter = () => {
        let showFilter = !this.props.Login.showFilter
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { showFilter }
        }
        this.props.updateStore(updateInfo);
    }

    closeFilter = () => {

        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { showFilter: false }
        }
        this.props.updateStore(updateInfo);
    }

    onFilterSubmit = () => {
        //Added by sonia on 11th NOV 2024 for jira id:ALPD-5025   
        let inputData = {
            userinfo: this.props.Login.userInfo,
            nregtypecode: (this.props.Login.masterData.defaultsampletype.value === SampleType.Masters
             || this.props.Login.masterData.defaultsampletype.value === SampleType.GOODSIN 
             || this.props.Login.masterData.defaultsampletype.value === SampleType.PROTOCOL) ?
              transactionStatus.NA : parseInt(this.props.Login.masterData.defaultregtype ? this.props.Login.masterData.defaultregtype.value
                 || -1 : -1),
            nregsubtypecode: (this.props.Login.masterData.defaultsampletype.value === SampleType.Masters ||
             this.props.Login.masterData.defaultsampletype.value === SampleType.GOODSIN || 
             this.props.Login.masterData.defaultsampletype.value === SampleType.PROTOCOL) ?
              transactionStatus.NA : parseInt(this.props.Login.masterData.defaultregsubtype ? 
                this.props.Login.masterData.defaultregsubtype.value || -1 : -1),
            nsampletypecode: this.props.Login.masterData.defaultsampletype.value,
            nformcode: this.props.Login.masterData.defaultsampletype.value === SampleType.GOODSIN ? formCode.GOODSIN 
            : this.props.Login.masterData.defaultsampletype.value === SampleType.PROTOCOL ? formCode.PROTOCOL 
            : this.props.Login.masterData.defaultsampletype.value === SampleType.STABILITY ? formCode.STUDYALLOCATION
            : parseInt(this.props.Login.masterData.defaultform ? this.props.Login.masterData.defaultform.value || -1 : -1)

        };
        let masterData = {
            ...this.props.Login.masterData,
            realSampleValue: this.props.Login.masterData.defaultsampletype,
            realFormValue: this.props.Login.masterData.defaultform,
            realRegTypeValue: this.props.Login.masterData.defaultregtype,
            realRegSubTypeValue: this.props.Login.masterData.defaultregsubtype
        }
        let inputParam = { masterData, inputData };
        this.props.getTMPFilterSubmit(inputParam);
    }

    onApproveClick = () => {
        if (this.props.Login.masterData.selectedDesignTemplateMapping.ntransactionstatus !== transactionStatus.RETIRED) {
            const ncontrolCode = this.state.controlMap.has("ApproveDesignTemplateMapping") && this.state.controlMap.get("ApproveDesignTemplateMapping").ncontrolcode
            // if (this.props.Login.masterData.realSampleValue.value === SampleType.Masters) {
            //     const updateInfo = {
            //         typeName: DEFAULT_RETURN,
            //         data: {
            //              openModal: true,
            //             operation: "approve", ncontrolCode: ncontrolCode
            //         }
            //     }
            //     this.props.updateStore(updateInfo);

            // } else {


            let inputData ={};

            //Modified by sonia on 13-JUN-2024 for JIRA ID:4386 ComboBox Selection Issue
           
		//ALPD-5264--Vignesh R(27-01-2025)--->Sample Category-->Cant able to delete the record 500 error occurs
		 if((this.props.Login.masterData.realSampleValue && this.props.Login.masterData.realSampleValue.value !== SampleType.GOODSIN )
                &&( this.props.Login.masterData.realSampleValue && this.props.Login.masterData.realSampleValue.value !== SampleType.PROTOCOL)){
               let { jsondata, jdynamiccolumns, jnumericcolumns, templatePrimaryKey, deleteValidation, jsqlquerycolumns, sampleQuerybuilderViewCondition, sampleQuerybuilderViewSelect }=  this.getGridJsondata(this.props.Login.masterData.selectedDesignTemplateMapping &&
                    this.props.Login.masterData.selectedDesignTemplateMapping.jsondata, "DeleteValidation");

                inputData = { jdynamiccolumns, jnumericcolumns, jsqlquerycolumns, sprimarykeyname: templatePrimaryKey, sampleQuerybuilderViewCondition, sampleQuerybuilderViewSelect };

                inputData["deletevalidationlist"] = deleteValidation;


            }else if(this.props.Login.masterData.realSampleValue && this.props.Login.masterData.realSampleValue.value === SampleType.GOODSIN){
                let { jsondata, jdynamiccolumns, jnumericcolumns, templatePrimaryKey, deleteValidation, jsqlquerycolumns, sampleQuerybuilderViewCondition, sampleQuerybuilderViewSelect } =
                 this.getGoodsInJsondata(this.props.Login.masterData.selectedDesignTemplateMapping &&
                    this.props.Login.masterData.selectedDesignTemplateMapping.jsondata, "DeleteValidation");

                inputData = { jdynamiccolumns, jnumericcolumns, jsqlquerycolumns, sprimarykeyname: templatePrimaryKey, sampleQuerybuilderViewCondition, sampleQuerybuilderViewSelect };

                inputData["deletevalidationlist"] = deleteValidation;

    
            }
            else if(this.props.Login.masterData.realSampleValue && this.props.Login.masterData.realSampleValue.value === SampleType.STABILITY){
                let { jsondata, jdynamiccolumns, jnumericcolumns, templatePrimaryKey, deleteValidation, jsqlquerycolumns, sampleQuerybuilderViewCondition, sampleQuerybuilderViewSelect } =
                 this.getStabilityJsondata(this.props.Login.masterData.selectedDesignTemplateMapping &&
                    this.props.Login.masterData.selectedDesignTemplateMapping.jsondata, "DeleteValidation");

                inputData = { jdynamiccolumns, jnumericcolumns, jsqlquerycolumns, sprimarykeyname: templatePrimaryKey, sampleQuerybuilderViewCondition, sampleQuerybuilderViewSelect };

                inputData["deletevalidationlist"] = deleteValidation;

    
            }
            //Added by sonia on 11th NOV 2024 for jira id:ALPD-5025
            else if(this.props.Login.masterData.realSampleValue && this.props.Login.masterData.realSampleValue.value === SampleType.PROTOCOL){
                let { jsondata, jdynamiccolumns, jnumericcolumns, templatePrimaryKey, deleteValidation, jsqlquerycolumns, sampleQuerybuilderViewCondition, sampleQuerybuilderViewSelect } = this.getProtocolJsondata(this.props.Login.masterData.selectedDesignTemplateMapping &&
                    this.props.Login.masterData.selectedDesignTemplateMapping.jsondata, "DeleteValidation");

                inputData = { jdynamiccolumns, jnumericcolumns, jsqlquerycolumns, sprimarykeyname: templatePrimaryKey, sampleQuerybuilderViewCondition, sampleQuerybuilderViewSelect };

                inputData["deletevalidationlist"] = deleteValidation;

    
            }
            // console.log("deleteValidation 2:", deleteValidation);

            //let inputData = { jdynamiccolumns, jnumericcolumns, jsqlquerycolumns, sprimarykeyname: templatePrimaryKey, sampleQuerybuilderViewCondition, sampleQuerybuilderViewSelect };
            inputData["userinfo"] = this.props.Login.userInfo;

            let postParam = undefined;
            inputData["designtemplatemapping"] = { "ndesigntemplatemappingcode": this.props.Login.masterData.selectedDesignTemplateMapping["ndesigntemplatemappingcode"] ? this.props.Login.masterData.selectedDesignTemplateMapping["ndesigntemplatemappingcode"].Value : "" };
            inputData["designtemplatemapping"] = this.props.Login.masterData.selectedDesignTemplateMapping;
           // inputData["deletevalidationlist"] = deleteValidation;
            inputData["sviewname"] = this.state.selectedRecord.sviewname;
            postParam = {
                inputListName: "DesignTemplateMapping",
                selectedObject: "selectedDesignTemplateMapping",
                primaryKeyField: "ndesigntemplatemappingcode"
            };

            const inputParam = {
                inputData: {
                    ...inputData
                },
                classUrl: 'designtemplatemapping',
                methodUrl: "DesignTemplateMapping",
                inputData: inputData,
                screenName: 'Template Mapping',
                operation: "Approve", postParam,
                selectedRecord: { ...this.state.selectedRecord }
            }
            let saveType;

            // console.log("approve:", inputParam);
            const masterData = this.props.Login.masterData;

            const esignNeeded = showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, ncontrolCode);
            if (esignNeeded) {
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        loadEsign: true, screenData: { inputParam, masterData }, saveType, openModal: true, operation: "Approve", screenName: 'Template Mapping'
                    }
                }
                this.props.updateStore(updateInfo);
            }
            else {
                this.props.crudMaster(inputParam, masterData, "openModal");
            }

        }

        //  }
        else {

            toast.warn(this.props.intl.formatMessage({ id: "IDS_TEMPLATERETIRED" }));
        }
    }
    configureunique=()=>{
        let inputData = [];

        let operation = this.props.Login.operation;
        let designData = this.props.Login.designData;
        //  let formCodeArray = Object.keys(this.state.selectedRecord);
        let isCheckedSampleMandatory=false
        let isCheckedSubSampleMandatory=this.props.Login.dataListSubSample.length===0?true:false
        const dataList = []
        const dataListsubsample = []
        let dataListKeyvalue=[];
        let dataListsubsampleKeyvalue=[];
        this.props.Login.dataListSubSample.map(x => {
            if (Object.keys(x).length !== 0) {
                dataListsubsample.push(x);
                dataListsubsampleKeyvalue=Object.keys(x);
            }
        })
        this.props.Login.dataList.map(x => {
            if (Object.keys(x).length !== 0) {
                dataList.push(x);
                dataListKeyvalue=Object.keys(x);
            }
        })
        designData.sampletemplatemandatoryfields && designData.sampletemplatemandatoryfields.map(item=>{
            dataListKeyvalue.map(value=>{
                if(value===item[2])
                    {isCheckedSampleMandatory=true;}
        })});

        designData.subsampletemplatemandatoryfields && designData.subsampletemplatemandatoryfields.map(item=>{
            dataListsubsampleKeyvalue.map(value=>{
                if(value===item[2])
                    {isCheckedSubSampleMandatory=true;}
         })});

        designData.templatemandatoryfields && designData.templatemandatoryfields.map(item=>{
            dataListKeyvalue.map(value=>{
                    if(value===item[2])
                        {isCheckedSampleMandatory=true;}
        })});


            
        if(isCheckedSampleMandatory && isCheckedSubSampleMandatory) {
        if (this.props.Login.masterData.realSampleValue.value === SampleType.Masters) {
            designData['mastercombinationunique'] = dataList
        }
        //Added by sonia on 11th NOV 2024 for jira id:ALPD-5025
        else  if(this.props.Login.masterData.realSampleValue.value === SampleType.GOODSIN
             || this.props.Login.masterData.realSampleValue.value === SampleType.PROTOCOL) {
            designData['combinationunique'] = dataList
        }else {
            designData['samplecombinationunique'] = dataList
            designData[formCode.SAMPLEREGISTRATION]['samplecombinationunique'] = dataList
            // this.props.Login.dataListSubSample.map(x => {
            //     if (Object.keys(x).length !== 0) {
            //         dataListsubsample.push(x);
            //     }
            // })
            designData['subsamplecombinationunique'] = dataListsubsample
            designData[formCode.SAMPLEREGISTRATION]['subsamplecombinationunique'] = dataListsubsample
        }


        inputData = {
            designtemplatemapping: {
                ndesigntemplatemappingcode: this.props.Login.masterData.selectedDesignTemplateMapping.ndesigntemplatemappingcode,
                jsondataobj: designData
            },
            userinfo: this.props.Login.userInfo
        }

        operation = 'configure';
        let postParam = undefined;
        const inputParam = {
            classUrl: "designtemplatemapping",
            methodUrl: "DesignTemplateMapping",
            inputData: inputData,
            operation,
             postParam, searchRef: this.searchRef, dataList: [], dataListCount: [], dataListCountSubSample: [], dataListSubSample: []
        }
        const masterData = this.props.Login.masterData;
        if (
            showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolCode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData }, dataList: [], dataListCount: [], dataListCountSubSample: [], dataListSubSample: []
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.crudMaster(inputParam, masterData, "openModal");
        }
    }else{
        if(!isCheckedSampleMandatory){
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTANYONEMANDATORYFIELD" }));
        }else{
        toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTANYONEMANDATORYFIELDINSUBSAMPLE" }));
        }
    }
    }
    configurereportfiltertype=()=>{
        let inputData = [];

        let operation = this.props.Login.operation;
       
        let isMandatoryTree=this.checkMandatoryFilter(this.props.Login.filterQueryTreeStr,this.props.Login.awesomeConfig);
        if(isMandatoryTree){
            let isFilterEmpty = checkFilterIsEmptyQueryBuilder(this.props.Login.filterQueryTreeStr);
            let ismandatory=false;
        if(isFilterEmpty){
        let designData = this.props.Login.designData;

                    const dataList = []
                    this.state.sampleReportFilterTypeData.sample.map(x => {
                        if (x.samplefiltertypefields === true) {
                            dataList.push({...x.realData,"ismandatory":x.ismandatory});
                            if(x.ismandatory){
                                ismandatory=true
                            }
                        }
                    })
                    if(ismandatory && (this.props.Login.filterquery==="" || this.props.Login.filterquery===undefined)){
                        toast.warn(this.props.intl.formatMessage({ id: "IDS_PROVIDEVALUESFORINPUTS" }));
                    }else{
                    designData[formCode.SAMPLEREGISTRATION]['samplefiltertypefields'] = dataList;
                    designData[formCode.RELEASE]['samplefiltertypefields'] = dataList;
                    designData[formCode.RELEASE]['defaultstructure']={
                        nregsubtypecode:this.props.Login.masterData.realRegSubTypeValue.value,
                        nsampletypecode:this.props.Login.masterData.realSampleValue.value,
                        nregtypecode:this.props.Login.masterData.realRegTypeValue.value,
                        awesomeTree:this.props.Login.awesomeTree,
                        awesomeConfig:this.props.Login.awesomeConfig,
                        filterquery:this.props.Login.filterquery,
                        filterQueryTreeStr:this.props.Login.filterQueryTreeStr}
                   

                inputData = {
                    designtemplatemapping: {
                        ndesigntemplatemappingcode: this.props.Login.masterData.selectedDesignTemplateMapping.ndesigntemplatemappingcode,
                        jsondataobj: designData
                    },
                    userinfo: this.props.Login.userInfo
                }

                operation = 'configure';
         

              let postParam = undefined;
              const inputParam = {
                  classUrl: "designtemplatemapping",
                  methodUrl: "DesignTemplateMapping",
                  inputData: inputData,
                  operation,
                   postParam, searchRef: this.searchRef,
                   dataList: [], dataListCount: [], dataListCountSubSample: [], dataListSubSample: []
              }
              const masterData = this.props.Login.masterData;
              if (
                  showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolCode)) {
                  const updateInfo = {
                      typeName: DEFAULT_RETURN,
                      data: {
                          loadEsign: true, screenData: { inputParam, masterData }, dataList: [], dataListCount: [], dataListCountSubSample: [], dataListSubSample: []
                      }
                  }
                  this.props.updateStore(updateInfo);
              }
              else {
                  this.props.crudMaster(inputParam, masterData, "openModal");
              }
            }
          }
         else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_PROVIDEVALUESFORINPUTS" }));
          }
        }else{
            toast.warn(this.props.intl.formatMessage({ id: "IDS_CONFIGUREMANDATORYFIELDS" })); 
        }
    }

    checkMandatoryFilter =(treeData,config)=> {
        let ParentItem = { ...treeData };
        let mandatoryList=[];
        let treeDateList=[];
        let isFilterEmpty=false;
            let childArray = ParentItem.children1;
            this.state.sampleReportFilterTypeData.sample.map(x=>{
                if( x['ismandatory']){
                mandatoryList.push(x);
                }
            if (childArray && childArray.length > 0 && childArray !== undefined) {
                for (var i = 0; i < childArray.length; i++) {
                    let childData = childArray[i]
                    if (!childData.hasOwnProperty('children1')) {
                       if(config && config.fields[childData.properties.field]['label']===x['label'] && x['ismandatory']){
                        isFilterEmpty=true;
                        treeDateList.push(childData.properties.field);
                       }
                    } else {
                        if (childData) {
                            ParentItem = checkFilterIsEmptyQueryBuilder(childData)
                            if(!ParentItem){
                                return ParentItem;
                            }
                        } 
                    }
                }
            }
        })
        let uniqueSet = new Set(treeDateList);
        let uniqueArray = Array.from(uniqueSet);
        if(uniqueArray.length !== mandatoryList.length){
            isFilterEmpty=false;
        }
        if(mandatoryList.length === 0){
            isFilterEmpty=true;
        }
            return isFilterEmpty;
      }

    ConfirmDelete = () => {
        this.confirmMessage.confirm("deleteMessage", this.props.intl.formatMessage({ id: "IDS_DELETE" }), this.props.intl.formatMessage({ id: "IDS_DEFAULTCONFIRMMSG" }),
            this.props.intl.formatMessage({ id: "IDS_OK" }), this.props.intl.formatMessage({ id: "IDS_CANCEL" }),
            () => this.deleteTemplate());
    }

    deleteTemplate = () => {
        if ((this.props.Login.masterData.selectedDesignTemplateMapping.ntransactionstatus === transactionStatus.DRAFT)) {
            const ncontrolCode = this.state.controlMap.has("DeleteDesignTemplateMapping") && this.state.controlMap.get("DeleteDesignTemplateMapping").ncontrolcode
            let inputData = [];
            inputData["userinfo"] = this.props.Login.userInfo;

            let postParam = undefined;
            inputData["designtemplatemapping"] = { "ndesigntemplatemappingcode": this.props.Login.masterData.selectedDesignTemplateMapping["ndesigntemplatemappingcode"] ? this.props.Login.masterData.selectedDesignTemplateMapping["ndesigntemplatemappingcode"].Value : "" };
            inputData["designtemplatemapping"] = this.props.Login.masterData.selectedDesignTemplateMapping;
            postParam = {
                inputListName: "DesignTemplateMapping",
                selectedObject: "selectedDesignTemplateMapping",
                primaryKeyField: "ndesigntemplatemappingcode",
                primaryKeyValue: this.props.Login.masterData.selectedDesignTemplateMapping.ndesigntemplatemappingcode,
                fetchUrl: "designtemplatemapping/getDesignTemplateMappingById",
                fecthInputObject: { userinfo: this.props.Login.userInfo },
            };


            const inputParam = {
                inputData: {
                    ...inputData,
                    "userinfo": this.props.Login.userInfo,

                },
                classUrl: 'designtemplatemapping',
                methodUrl: "DesignTemplateMapping",
                inputData: inputData,
                screenName: 'Template Mapping',
                operation: "delete", postParam,
                selectedRecord: { ...this.state.selectedRecord }
            }
            let saveType;

            const masterData = this.props.Login.masterData;

            const esignNeeded = showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, ncontrolCode);
            if (esignNeeded) {
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        loadEsign: true, screenData: { inputParam, masterData }, saveType, openModal: true, operation: "delete", screenName: 'Template Mapping'
                    }
                }
                this.props.updateStore(updateInfo);
            }
            else {
                this.props.crudMaster(inputParam, masterData, "openModal");
            }

        }
        else {

            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTDRAFTRECORDTODELETE" }));
        }
    }

    deleteCombinationUnique = (index, eventKey) => {
        if (eventKey === "subsample") {
            let dataList = this.props.Login.subsampledataList || []
            let dataListCount = this.props.Login.subsampledataListCount || []
            dataListCount = [...dataListCount.slice(0, index), ...dataListCount.slice(index + 1)]
            //   delete dataListCount[index]
            if (dataList[index] || dataList[index] === null) {
                dataList = [...dataList.slice(0, index), ...dataList.slice(index + 1)]

                // delete dataList[index]
            }
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: { subsampledataListCount: dataListCount, subsampledataList: dataList }
            }
            this.props.updateStore(updateInfo);
        } else {
            let dataList = this.props.Login.dataList || []
            let dataListCount = this.props.Login.dataListCount || []
            dataListCount = [...dataListCount.slice(0, index), ...dataListCount.slice(index + 1)]
            //   delete dataListCount[index]
            if (dataList[index] || dataList[index] === null) {
                dataList = [...dataList.slice(0, index), ...dataList.slice(index + 1)]

                // delete dataList[index]
            }
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: { dataListCount, dataList }
            }
            this.props.updateStore(updateInfo);
        }

    }

    addCombinatonUnique = (designData, eventKey) => {
        if (eventKey === "subsample") {
            const dataList = this.props.Login.dataListSubSample || []
            //    const obj={}
            //     designData.map(item=>{
            //         obj[item["2"]]={...item}
            //     })
            //dataList.push({})
            const dataListCount = this.props.Login.dataListCountSubSample || []
            dataListCount.push(dataListCount.length + 1)
            dataList.push({})
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: { dataListCountSubSample: dataListCount, dataListSubSample: dataList }
            }
            this.props.updateStore(updateInfo);
        } else {
            const dataList = this.props.Login.dataList || []
            //    const obj={}
            //     designData.map(item=>{
            //         obj[item["2"]]={...item}
            //     })
            //dataList.push({})
            const dataListCount = this.props.Login.dataListCount || []
            dataListCount.push(dataListCount.length + 1)
            dataList.push({})
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: { dataListCount, dataList }
            }
            this.props.updateStore(updateInfo);
        }

    }

    openCombinationUniqueFieldConfiguration = (controlCode) => {
        let openModal = true;
        let operation = 'configureunique';
        let ncontrolcode = controlCode;
        let screenName = "IDS_FIELDS";
        let inputParam = {
            inputData: {
                designtemplatemapping: {
                    ndesigntemplatemappingcode: this.props.Login.masterData.selectedDesignTemplateMapping.ndesigntemplatemappingcode
                },
                userinfo: this.props.Login.userInfo,
            },
            operation,
            ncontrolcode,
            screenName
        }
        //Added by sonia on 11th NOV 2024 for jira id:ALPD-5025
        if (this.props.Login.masterData.realSampleValue 
            && this.props.Login.masterData.realSampleValue.value !== SampleType.Masters 
            && this.props.Login.masterData.realSampleValue.value !== SampleType.GOODSIN 
            && this.props.Login.masterData.realSampleValue.value !== SampleType.PROTOCOL
            && this.props.Login.masterData.realSampleValue.value !== SampleType.STABILITY) {
            inputParam.inputData["napprovalconfigcode"] = this.props.Login.masterData.defaultregsubtype.item.napprovalconfigcode;
        }
        inputParam["SampleType"] = this.props.Login.masterData.realSampleValue.value;

        this.props.combinationUniqueConfigService(inputParam)
    }

    openFieldConfiguration = (controlCode, operation) => {
        let openModal = true;
        //let operation = 'configure';
        let ncontrolcode = controlCode;
        let screenName = "IDS_FIELDS";
        let inputParam = {
            inputData: {
                designtemplatemapping: {
                    ndesigntemplatemappingcode: this.props.Login.masterData.selectedDesignTemplateMapping.ndesigntemplatemappingcode
                },
                userinfo: this.props.Login.userInfo,

            },
            operation,
            ncontrolcode,
            screenName
        }
        //Added by sonia on 11th NOV 2024 for jira id:ALPD-5025
        if (this.props.Login.masterData.realSampleValue 
            && this.props.Login.masterData.realSampleValue.value !== SampleType.Masters
            && this.props.Login.masterData.realSampleValue.value !== SampleType.GOODSIN 
            && this.props.Login.masterData.realSampleValue.value !== SampleType.PROTOCOL
           // && this.props.Login.masterData.realSampleValue.value !== SampleType.STABILITY
        ) {
            inputParam.inputData["napprovalconfigcode"] = this.props.Login.masterData.defaultregsubtype.item.napprovalconfigcode;
        }
        inputParam["SampleType"] = this.props.Login.masterData.realSampleValue.value;

        this.props.getMappedFieldProps(inputParam)
    }

    editFieldConfiguration = (controlCode, operation) => {

        //console.log("edit config:", this.props.Login);
        // let operation = 'configureedit';
        let ncontrolcode = controlCode;
        let screenName = "IDS_FIELDS";
        let inputParam = {
            inputData: {
                designtemplatemapping: {
                    ndesigntemplatemappingcode: this.props.Login.masterData.selectedDesignTemplateMapping.ndesigntemplatemappingcode
                },
                //Added by sonia on 11th NOV 2024 for jira id:ALPD-5025
                nregtypecode: this.props.Login.masterData.realSampleValue && 
                              this.props.Login.masterData.realSampleValue.value !== SampleType.Masters && 
                              this.props.Login.masterData.realSampleValue.value !== SampleType.GOODSIN && 
                              this.props.Login.masterData.realSampleValue.value !== SampleType.PROTOCOL ?
                              this.props.Login.masterData.defaultregtype.value :-1 ,
                nregsubtypecode: this.props.Login.masterData.realSampleValue && 
                                 this.props.Login.masterData.realSampleValue.value !== SampleType.Masters && 
                                 this.props.Login.masterData.realSampleValue.value !== SampleType.GOODSIN && 
                                 this.props.Login.masterData.realSampleValue.value !== SampleType.PROTOCOL ?
                                 this.props.Login.masterData.defaultregsubtype.value:-1,
                userinfo: this.props.Login.userInfo,
            },
            operation,
            ncontrolcode,
            screenName
        }
        // if (this.props.Login.masterData.realSampleValue && this.props.Login.masterData.realSampleValue.value !== SampleType.Masters){
        //     inputParam.inputData["napprovalconfigcode"] = this.props.Login.masterData.defaultregsubtype.item.napprovalconfigcode;
        //  }
        inputParam["SampleType"] = this.props.Login.masterData.realSampleValue.value;

        this.props.editFieldConfigService(inputParam)
    }

    mappingFieldConfiguration = (controlCode, operation) => {

        //console.log("edit config:", this.props.Login);
        // let operation = 'configureedit';
        let ncontrolcode = controlCode;
        let screenName = "IDS_FIELDS";
        let displayname = "ConfigSendTOStore";
        let inputParam = {
            inputData: {
                designtemplatemapping: {
                    ndesigntemplatemappingcode: this.props.Login.masterData.selectedDesignTemplateMapping
                },
                userinfo: this.props.Login.userInfo,
                masterData: this.props.Login.masterData
            },
            operation,
            ncontrolcode,
            screenName, displayname
        }
        if (this.props.Login.masterData.realSampleValue && this.props.Login.masterData.realSampleValue.value !== SampleType.Masters) {
            inputParam.inputData["napprovalconfigcode"] = this.props.Login.masterData.defaultregsubtype.item.napprovalconfigcode;
        }
        inputParam["SampleType"] = this.props.Login.masterData.realSampleValue.value;
        this.props.mappingFieldConfigService(inputParam)
    }

    //Added by sonia on 11th NOV 2024 for jira id:ALPD-5025
    auditFieldConfiguration = (controlCode, operation) => {

        //console.log("edit config:", this.props.Login);
        let ncontrolcode = controlCode;
        let screenName = "IDS_FIELDS";
        let inputParam = {
            inputData: {
                designtemplatemapping: {
                    ndesigntemplatemappingcode: this.props.Login.masterData.selectedDesignTemplateMapping.ndesigntemplatemappingcode
                },
                nregtypecode: this.props.Login.masterData.realSampleValue.value === SampleType.Masters || 
                this.props.Login.masterData.realSampleValue.value === SampleType.GOODSIN || 
                this.props.Login.masterData.realSampleValue.value === SampleType.PROTOCOL
                    ? -1 : this.props.Login.masterData.defaultregtype
                        ? this.props.Login.masterData.defaultregtype.value : -1,
                nregsubtypecode: this.props.Login.masterData.realSampleValue.value === SampleType.Masters ||
                this.props.Login.masterData.realSampleValue.value === SampleType.GOODSIN || 
                this.props.Login.masterData.realSampleValue.value === SampleType.PROTOCOL
                    ? -1 : this.props.Login.masterData.defaultregsubtype
                        ? this.props.Login.masterData.defaultregsubtype.value : -1,
                //nregtypecode: this.props.Login.masterData.defaultregtype.value,
                //nregsubtypecode: this.props.Login.masterData.defaultregsubtype.value,
                userinfo: this.props.Login.userInfo,
                nneedsubsample: this.props.Login.masterData.defaultregsubtype && this.props.Login.masterData.defaultregsubtype.item.nneedsubsample
            },
            operation,
            ncontrolcode,
            screenName
        }
        inputParam["SampleType"] = this.props.Login.masterData.realSampleValue.value;

        this.props.auditFieldConfigService(inputParam)
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

    closeModal = () => {
        let loadEsign = this.props.Login.loadEsign;
        let openModal = this.props.Login.openModal;
        let selectedRecord = this.props.Login.selectedRecord;
        let operation = this.props.Login.operation;
        if (this.props.Login.loadEsign) {
            if (operation === "configurechecklistadd") {
                selectedRecord = {}
                loadEsign = false;
                operation = "configurechecklist"
            }
            else if (operation === "Approve"
                || operation === "delete") {
                loadEsign = false;
                openModal = this.props.Login.masterData.realSampleValue && this.props.Login.masterData.realSampleValue.value === SampleType.Masters ? true : false;
                selectedRecord = this.props.Login.masterData.realSampleValue && this.props.Login.masterData.realSampleValue.value === SampleType.Masters ? this.state.selectedRecord : {};
            }
            else {
                loadEsign = false;
            }
        }
        else if (operation === "configurechecklistadd") {
            selectedRecord = {}
            operation = "configurechecklist"
        }
        else {
            openModal = false;
            selectedRecord = {};
        }

        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { operation, openModal, loadEsign, selectedRecord, selectedId: null, dataList: [], dataListCount: [], dataListSubSample: [], dataListCountSubSample: [] }
        }
        this.props.updateStore(updateInfo);

    }

    onComboChange = (comboData, fieldName, screenName) => {
        const selectedRecord = this.state.selectedRecord || {};
        if (screenName === "Sample") {
            if (fieldName == "Quantity") {
                selectedRecord["Quantity"] = comboData;
            } else {
                selectedRecord["Unit"] = comboData;
            }
        }
        else if (screenName === "SubSample") {
            if (fieldName == "Quantity") {
                selectedRecord["SubQuantity"] = comboData;
            } else {
                selectedRecord["SubUnit"] = comboData;
            }
        }
        else if(screenName === "Masters"){
           selectedRecord["nnewmodule"] = comboData;
           selectedRecord["nmodulecode"]= [];
        }
        else {
            selectedRecord[fieldName] = comboData;
        }
        this.setState({ selectedRecord });
    }
//Added by sonia on 11th NOV 2024 for jira id:ALPD-5025
    onConfigureComboChange = (comboData, formCode, item) => 
    {
        let selectedRecord = this.state.selectedRecord || {};
        if (item === "Quantity" || item === "Unit") {
            const fieldName = item;
            selectedRecord[fieldName] = comboData;
        } else {
            const fieldName = item.label;
            if( this.props.Login.masterData.realSampleValue.value === SampleType.PROTOCOL){
                selectedRecord = { ...selectedRecord, [fieldName]: comboData };  
            }else {
                selectedRecord[formCode] = { ...selectedRecord[formCode], [fieldName]: comboData };
                if(selectedRecord[244])
                {
                    selectedRecord[244] = { ...selectedRecord[244], [fieldName]: comboData };
                }
            }
            this.setState({ selectedRecord });
        }
    }
//   commented by sonia on 11th NOV 2024 for jira id:ALPD-5025
    // onConfigureComboChange = (comboData, formCode, item) => {
    //     if (item === "Quantity") {
    //         const fieldName = item;
    //         const selectedRecord = this.state.selectedRecord || {};
    //         selectedRecord[fieldName] = comboData;
    //         this.setState({ selectedRecord });
    //     } else if (item === "Unit") {
    //         const fieldName = item;
    //         const selectedRecord = this.state.selectedRecord || {};
    //         selectedRecord[fieldName] = comboData;
    //         this.setState({ selectedRecord });
    //     } else {
    //         const fieldName = item.label;
    //         const selectedRecord = this.state.selectedRecord || {};
    //         selectedRecord[formCode] = { ...selectedRecord[formCode], [fieldName]: comboData };

    //         this.setState({ selectedRecord });
    //     }
        // let designData = this.props.Login.editFieldDesignData;
        // let dataResult = this.props.Login.editFieldDataResult;
        // if (formCode === undefined){
        //     dataResult[dataIndex][field] = event.target.checked;
        //     if (event.target.checked) {
        //         designData[field].splice(dataIndex, 0, dataItem.realData)

        //     } else {
        //         designData[field].splice(designData[field].findIndex(x => x[designProperties.VALUE] === dataItem.label), 1)
        //     }
        // }
        // else{
        //     dataResult[formCode]["sampleeditable"] = comboData;
        //     if (event.target.checked) {
        //         if (field === 'samplelistitem' && designData[formCode][field].length >= 6) {
        //             return toast.warn(this.props.intl.formatMessage({ id: "IDS_MAXIMUMSELECTIONEXCEEDS" }))
        //         } else {
        //             designData[formCode][field].splice(dataIndex, 0, dataItem.realData)
        //         }
        //         if (field === 'sampledisplayfields') {
        //             designData[formCode]['samplesearchfields'].splice(dataIndex, 0, dataItem.label)
        //         }
        //     } else {
        //         if (field === 'sampledisplayfields') {
        //             designData[formCode]['samplesearchfields'].splice(designData[formCode]['samplesearchfields'].findIndex(x => x === dataItem.label), 1)
        //         }
        //         designData[formCode][field].splice(designData[formCode][field].findIndex(x => x[designProperties.VALUE] === dataItem.label), 1)
        //     }
        // }
        // const updateInfo = {
        //     typeName: DEFAULT_RETURN,
        //     data: { designData, dataResult }
        // }
        // this.props.updateStore(updateInfo);

    //}

    onInputOnChange = (event) => {
        const selectedRecord = this.state.selectedRecord || {};
        if (event.target.type === 'checkbox') {
            selectedRecord[event.target.name] = event.target.checked === true ? transactionStatus.YES : transactionStatus.NO;
        }
        else {
            if (event.target.name === "sviewname") {

                if (event.target.value !== "") {
                    event.target.value = validateCreateView(event.target.value);
                    selectedRecord[event.target.name] = event.target.value !== "" ? event.target.value : selectedRecord[event.target.name];
                } else {
                    selectedRecord[event.target.name] = event.target.value;
                }
                //  selectedRecord[event.target.name] =  event.target.value.replace(/[^a-z]/g, '');
            } else {
                selectedRecord[event.target.name] = event.target.value;
            }

        }

        this.setState({ selectedRecord });
    }

    onInputOnChangeForUnique = (event, radiotext, index, multilinguallabel, eventKey) => {
        if (eventKey === "subsample") {
            const dataList = this.props.Login.dataListSubSample || []
            if (dataList[index]) {
                const value = dataList[index] && dataList[index][event.target.name];
                if (value !== '' && value !== undefined) {
                    delete dataList[index][event.target.name]
                } else {

                    dataList[index][event.target.name] = {
                        [designProperties.LABEL]: { ...multilinguallabel },
                        [designProperties.VALUE]: radiotext
                    };
                }
            } else {
                dataList[index] = {
                    [event.target.name]: { [designProperties.LABEL]: { ...multilinguallabel }, [designProperties.VALUE]: radiotext }
                }
            }
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: { dataListSubSample: dataList }
            }
            this.props.updateStore(updateInfo);
        } else {
            const dataList = this.props.Login.dataList || []
            if (dataList[index]) {
                const value = dataList[index] && dataList[index][event.target.name];
                if (value !== '' && value !== undefined) {
                    delete dataList[index][event.target.name]
                } else {

                    dataList[index][event.target.name] = {
                        [designProperties.LABEL]: { ...multilinguallabel },
                        [designProperties.VALUE]: radiotext
                    };
                }
            } else {
                dataList[index] = {
                    [event.target.name]: { [designProperties.LABEL]: { ...multilinguallabel }, [designProperties.VALUE]: radiotext }
                }
            }
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: { dataList }
            }
            this.props.updateStore(updateInfo);

        }



    }

    handleDateChange = (dateName, dateValue) => {
        const { selectedRecord } = this.state;
        selectedRecord[dateName] = dateValue;
        this.setState({ selectedRecord });
    }

    getGridJsondata = (templatedata, task) => {
        let gridItem = [];
        let gridMoreItem = [];
        let masterdatefields = [];
        let masterdateconstraints = [];
        let masteruniquevalidation = [];
        let mastercombinationunique = [];
        let editable = [];
        let jdynamiccolumns = [];
        let jnumericcolumns = [];
        let templatePrimaryKey = "";
        let mastertemplatefields = [];
        let sampleAuditFields = [];
        let sampleAuditEditable = [];
        let sampleAuditMultilingualFields = [];
        let sampleQuerybuilderViewCondition = [];
        let sampleQuerybuilderViewSelect = [];
        let templatemandatoryfields =[];
        const masterexportfields = []
        let deleteValidation = [];
        let jsqlquerycolumns = [{
            "columnname": "ndynamicmastercode",
            "displayname": {
                "en-US": "DynamicMaster Code PK",
                "ru-RU": "Код DynamicMaster ПК",
                "tg-TG": "Рамзи DynamicMaster PK"
            },
            "columndatatype": "numeric"
        },
        {
            "columnname": "nstatus",
            "displayname": {
                "en-US": "Status",
                "ru-RU": "Статус",
                "tg-TG": "Статус"
            },
            "columndatatype": "numeric"
        }];
        templatedata && templatedata.map(row =>
            row.children && row.children.map(column => {
                column.children && column.children.map((component, index) => {
                    if (component.hasOwnProperty('children')) {
                        component.children.map(componentRow => {

                            if (componentRow.isExportField) {
                                masterexportfields.push(componentRow)
                            }

                            if(componentRow.mandatory){
                                templatemandatoryfields.push({
                                    [designProperties.LABEL]: componentRow.displayname,
                                    [designProperties.VALUE]: componentRow.label,
                                    [designProperties.LISTITEM]: componentRow.inputtype //ALPD-5328 added by Dhanushya RI,to hide label input type in template mapping screen
                                })
                            }

                            jsqlquerycolumns.push({
                                "columnname": componentRow.label,
                                "displayname": componentRow.displayname,
                                "isjsoncolumn": true,
                                "columndatatype": "string",
                                "jsoncolumnname": "jsonuidata"
                            })
                            componentRow.unique && masteruniquevalidation.push({ [designProperties.LABEL]: componentRow.label });
                            componentRow.unique && mastercombinationunique.push({ [componentRow.label]: { [designProperties.LABEL]: componentRow.displayname, [designProperties.VALUE]: componentRow.label,[designProperties.LISTITEM]: componentRow.inputtype } })

                            templatePrimaryKey = templatePrimaryKey === "" && componentRow.unique ? componentRow.label : templatePrimaryKey;

                            let filterinputtype = "text";
                            let comboDataInputObject = {};

                            if (componentRow.componentcode === designComponents.COMBOBOX) {
                                deleteValidation.push({
                                    "smastertablename": componentRow.table.item.stablename,
                                    "smasterprimarykeyname": componentRow.valuemember,
                                    "stranstablename": this.props.Login.masterData.realSampleValue.value === SampleType.Masters ? "dynamicmaster" : "registration",
                                    "stranstableforeignkeyname": componentRow.valuemember,
                                    "sjsonfieldname": "jsondata",
                                    "nisdynamicmaster": this.props.Login.masterData.realSampleValue.value === SampleType.Masters ? transactionStatus.YES : transactionStatus.NO,
                                    "nquerybuildertablecode": componentRow.nquerybuildertablecode
                                });

                                sampleQuerybuilderViewCondition.push({
                                    "columnname": componentRow.label,
                                    "displayname": componentRow.displayname,
                                    "columntype": 1,
                                    "viewvaluemember": componentRow.label,
                                    "valuemember": componentRow.valuemember,
                                    "displaymember": componentRow.displaymember,
                                    "mastertablename": componentRow.source,
                                    "needmasterdata": true,
                                    "columntypedesc": "textinput",
                                })

                                sampleQuerybuilderViewSelect.push({
                                    "columnname": componentRow.label,
                                    "displayname": componentRow.displayname,
                                    "languagecode": false
                                })
                            }

                            if (componentRow.inputtype === 'combo') {

                                comboDataInputObject = {
                                    "predefinedtablename": componentRow.source,
                                    "predefinedvaluemember": componentRow.valuemember,
                                    "predefineddisplaymember": componentRow.displaymember,
                                    "predefinedismultilingual": componentRow.isMultiLingual ? componentRow.isMultiLingual : false,
                                    "predefinedconditionalString": "\"" + componentRow.valuemember + "\"" + " > '0' "
                                };
                                jnumericcolumns.push({
                                    "columnname": componentRow.displaymember,
                                    "foreigntableformcode": componentRow.table.item.nformcode,
                                    "displayname": componentRow.displayname,
                                    "foriegntablePK": componentRow.valuemember,
                                    "tablecolumnname": componentRow.label,
                                    "foriegntablename": componentRow.source,
                                    "parentforeignPK": componentRow.displaymember,
                                    ...comboDataInputObject
                                })
                                filterinputtype = "predefinednumeric";
                            }
                            if (componentRow.inputtype === 'date') {
                                filterinputtype = "date";
                                masterdatefields.push({ [designProperties.VALUE]: componentRow.label, dateonly: componentRow.dateonly || false });
                                masterdateconstraints = componentRow.dateConstraintArraySQL ? [...componentRow.dateConstraintArraySQL, ...masterdateconstraints] : masterdateconstraints;

                                sampleQuerybuilderViewCondition.push({
                                    "columnname": componentRow.label,
                                    "displayname": componentRow.displayname,
                                    "columntype": 2,
                                    "columntypedesc": "datetime",
                                })

                                sampleQuerybuilderViewSelect.push({
                                    "columnname": componentRow.label,
                                    "displayname": componentRow.displayname,
                                    "languagecode": false
                                })

                            }
                            if (componentRow.inputtype === 'Numeric' || componentRow.inputtype === 'radio') {
                                filterinputtype = "numeric";

                                if (componentRow.inputtype === 'Numeric') {
                                    sampleQuerybuilderViewCondition.push({
                                        "columnname": componentRow.label,
                                        "displayname": componentRow.displayname,
                                        "columntype": 5,
                                        "columntypedesc": "numericinput",
                                    })

                                    sampleQuerybuilderViewSelect.push({
                                        "columnname": componentRow.label,
                                        "displayname": componentRow.displayname,
                                        "languagecode": false
                                    })
                                }
                            }

                            if (componentRow.inputtype === 'textinput' || componentRow.inputtype === 'email'
                                || componentRow.inputtype === 'textarea' || componentRow.inputtype === 'radio') {

                                sampleQuerybuilderViewCondition.push({
                                    "columnname": componentRow.label,
                                    "displayname": componentRow.displayname,
                                    "columntype": 1,
                                    "columntypedesc": "textinput",
                                })

                                sampleQuerybuilderViewSelect.push({
                                    "columnname": componentRow.label,
                                    "displayname": componentRow.displayname,
                                    "languagecode": false
                                })

                            }

                            jdynamiccolumns.push({
                                default: componentRow.unique ? true : false,
                                filterinputtype,
                                columnname: componentRow.label,
                                displayname: componentRow.displayname,
                                ...comboDataInputObject
                            })
                            if (componentRow.mandatory || componentRow.templatemandatory) {
                                gridItem.push({ [designProperties.LABEL]: componentRow.displayname, [designProperties.VALUE]: componentRow.label ,[designProperties.LISTITEM] : componentRow.inputtype }) //ALPD-5328 added by Dhanushya RI,to hide label input type in template mapping screen
                                sampleAuditEditable.push(componentRow.label);
                            }
                            else {
                                gridMoreItem.push({ [designProperties.LABEL]: componentRow.displayname, [designProperties.VALUE]: componentRow.label,[designProperties.LISTITEM] : componentRow.inputtype  }); //ALPD-5328 added by Dhanushya RI,to hide label input type in template mapping screen
                            }
                            mastertemplatefields.push({ [designProperties.LABEL]: componentRow.displayname, [designProperties.VALUE]: componentRow.label ,[designProperties.LISTITEM] : componentRow.inputtype }) //ALPD-5328 added by Dhanushya RI,to hide label input type in template mapping screen
                            sampleAuditFields.push(componentRow.label);
                            sampleAuditMultilingualFields.push({ [componentRow.label]: componentRow.displayname });


                            if (componentRow.templatemandatory) {
                                editable.push({ label: componentRow.label, editableuntill: [] })
                            }
                            else {
                                editable.push({ label: componentRow.label, editableuntill: [transactionStatus.DRAFT] })
                            }

                            return null;
                        })
                    } else {
                        if (component.isExportField) {
                            masterexportfields.push(component)
                        }

                        if(component.mandatory){
                            templatemandatoryfields.push({
                                [designProperties.LABEL]: component.displayname,
                                [designProperties.VALUE]: component.label,
                                [designProperties.LISTITEM]: component.inputtype //ALPD-5328 added by Dhanushya RI,to hide label input type in template mapping screen
                            })
                        }

                        component.unique && masteruniquevalidation.push({ [designProperties.LABEL]: component.label });
                        component.unique && mastercombinationunique.push({ [component.label]: { [designProperties.LABEL]: component.displayname, [designProperties.VALUE]: component.label,[designProperties.LISTITEM]: component.inputtype } }) //ALPD-5328 added by Dhanushya RI,to hide label input type in template mapping screen
                        templatePrimaryKey = templatePrimaryKey === "" && component.unique ? component.label : templatePrimaryKey;
                        jsqlquerycolumns.push({
                            "columnname": component.label,
                            "displayname": component.displayname,
                            "isjsoncolumn": true,
                            "columndatatype": "string",
                            "jsoncolumnname": "jsonuidata"
                        })

                        let filterinputtype = "text";
                        let comboDataInputObject = {};

                        mastertemplatefields.push({ [designProperties.LABEL]: component.displayname, [designProperties.VALUE]: component.label,[designProperties.LISTITEM]: component.inputtype }) //ALPD-5328 added by Dhanushya RI,to hide label input type in template mapping screen
                        sampleAuditFields.push(component.label);
                        sampleAuditMultilingualFields.push({ [component.label]: component.displayname });

                        if (component.componentcode === designComponents.COMBOBOX) {
                            deleteValidation.push({
                                "smastertablename": component.table.item.stablename,
                                "smasterprimarykeyname": component.valuemember,
                                "stranstablename": this.props.Login.masterData.realSampleValue.value === SampleType.Masters ? "dynamicmaster" : "registration",
                                "stranstableforeignkeyname": component.valuemember,
                                "sjsonfieldname": "jsondata",
                                "nisdynamicmaster": this.props.Login.masterData.realSampleValue.value === SampleType.Masters ? transactionStatus.YES : transactionStatus.NO,
                                "nquerybuildertablecode": component.nquerybuildertablecode
                            });
                        }

                        if (component.inputtype === 'combo') {
                            filterinputtype = "predefinednumeric";
                            comboDataInputObject = {
                                "predefinedtablename": component.source,
                                "predefinedvaluemember": component.valuemember,
                                "predefineddisplaymember": component.displaymember,
                                "predefinedismultilingual": component.isMultiLingual ? component.isMultiLingual : false,
                                "predefinedconditionalString": "\"" + component.valuemember + "\"" + " > '0'"
                            };
                            jnumericcolumns.push({
                                "columnname": component.label,
                                "foreigntableformcode": component.table.item.nformcode,
                                "displayname": component.displayname,
                                "foriegntablePK": component.valuemember,
                                // "ismultilingual": true,
                                //"conditionstring": " and nformcode in (" + component.table.item.nformcode + ") ",
                                "tablecolumnname": component.label,
                                "foriegntablename": component.source,
                                "parentforeignPK": component.displaymember,
                                ...comboDataInputObject
                            })

                            sampleQuerybuilderViewCondition.push({
                                "columnname": component.label,
                                "displayname": component.displayname,
                                "columntype": 1,
                                "viewvaluemember": component.label,
                                "valuemember": component.valuemember,
                                "displaymember": component.displaymember,
                                "mastertablename": component.source,
                                "needmasterdata": true,
                                "columntypedesc": "textinput",
                            })

                            sampleQuerybuilderViewSelect.push({
                                "columnname": component.label,
                                "displayname": component.displayname,
                                "languagecode": false
                            })
                        }
                        if (component.inputtype === 'date') {
                            filterinputtype = "date";
                            masterdatefields.push({ [designProperties.VALUE]: component.label, dateonly: component.dateonly || false });
                            masterdateconstraints = component.dateConstraintArraySQL ? [...component.dateConstraintArraySQL, ...masterdateconstraints] : masterdateconstraints;

                            sampleQuerybuilderViewCondition.push({
                                "columnname": component.label,
                                "displayname": component.displayname,
                                "columntype": 2,
                                "columntypedesc": "datetime",
                            })

                            sampleQuerybuilderViewSelect.push({
                                "columnname": component.label,
                                "displayname": component.displayname,
                                "languagecode": false
                            })
                        }
                        if (component.inputtype === 'Numeric' || component.inputtype === 'radio') {
                            filterinputtype = "numeric";

                            if (component.inputtype === 'Numeric') {
                                sampleQuerybuilderViewCondition.push({
                                    "columnname": component.label,
                                    "displayname": component.displayname,
                                    "columntype": 5,
                                    "columntypedesc": "numericinput",
                                })

                                sampleQuerybuilderViewSelect.push({
                                    "columnname": component.label,
                                    "displayname": component.displayname,
                                    "languagecode": false
                                })
                            }
                        }

                        if (component.inputtype === 'textinput' || component.inputtype === 'email'
                            || component.inputtype === 'textarea' || component.inputtype === 'radio') {

                            sampleQuerybuilderViewCondition.push({
                                "columnname": component.label,
                                "displayname": component.displayname,
                                "columntype": 1,
                                "columntypedesc": "textinput",
                            })

                            sampleQuerybuilderViewSelect.push({
                                "columnname": component.label,
                                "displayname": component.displayname,
                                "languagecode": false
                            })

                        }

                        jdynamiccolumns.push({
                            default: component.unique ? true : false,
                            columnname: component.label,
                            displayname: component.displayname,
                            filterinputtype,
                            ...comboDataInputObject
                        });

                        if (component.mandatory || component.templatemandatory) {
                            gridItem.push({ [designProperties.LABEL]: component.displayname, [designProperties.VALUE]: component.label,[designProperties.LISTITEM]: component.inputtype }) //ALPD-5328 added by Dhanushya RI,to hide label input type in template mapping screen
                            sampleAuditEditable.push(component.label);
                        } else {
                            gridMoreItem.push({ [designProperties.LABEL]: component.displayname, [designProperties.VALUE]: component.label,[designProperties.LISTITEM]: component.inputtype }); //ALPD-5328 added by Dhanushya RI,to hide label input type in template mapping screen
                        }
                        if (component.templatemandatory) {
                            editable.push({ label: component.label, editableuntill: [] });

                        }
                        else {
                            editable.push({ label: component.label, editableuntill: [transactionStatus.DRAFT] })
                        }
                        return null;
                    }

                })
            })
        );

        if (task === "DeleteValidation" && this.props.Login.masterData.realSampleValue.value !== SampleType.Masters) {

            const selectedSubSampleTemplate = this.props.Login.masterData.selectedDesignTemplateMapping.subsamplejsondata;

            const needsubsample = this.props.Login.masterData.realRegSubTypeValue ? this.props.Login.masterData.realRegSubTypeValue.item.nneedsubsample : false;

            if (needsubsample) {
                selectedSubSampleTemplate.map(row =>
                    row.children && row.children.map(column => {
                        column.children && column.children.map(component => {
                            if (component.hasOwnProperty('children')) {
                                component.children.map(componentRow => {


                                    if (componentRow.componentcode === designComponents.COMBOBOX) {
                                        deleteValidation.push({
                                            "smastertablename": componentRow.table.item.stablename,
                                            "smasterprimarykeyname": componentRow.valuemember,
                                            "stranstablename": "registrationsample",
                                            "stranstableforeignkeyname": componentRow.valuemember,
                                            // "salertmessage":"IDS_REGISTRATIONSAMPLE",	
                                            "sjsonfieldname": "jsondata",
                                            "nisdynamicmaster": this.props.Login.masterData.realSampleValue.value === SampleType.Masters ? transactionStatus.YES : transactionStatus.NO,
                                            "nquerybuildertablecode": componentRow.nquerybuildertablecode
                                            //"nformcode":componentRow.table.item.nformcode
                                        });
                                    }
                                }
                                )
                            } else {


                                if (component.componentcode === designComponents.COMBOBOX) {
                                    deleteValidation.push({
                                        "smastertablename": component.table.item.stablename,
                                        "smasterprimarykeyname": component.valuemember,
                                        "stranstablename": "registrationsample",
                                        "stranstableforeignkeyname": component.valuemember,
                                        //"salertmessage":"IDS_REGISTRATIONSAMPLE",	
                                        "sjsonfieldname": "jsondata",
                                        "nisdynamicmaster": this.props.Login.masterData.realSampleValue.value === SampleType.Masters ? transactionStatus.YES : transactionStatus.NO,
                                        //"nformcode":component.table.item.nformcode,
                                        "nquerybuildertablecode": component.nquerybuildertablecode
                                    });
                                }
                            }
                        })
                    })
                )
            }
        }


        let jsondata = {
            griditem: gridItem,
            gridmoreitem: gridMoreItem,
            masterdatefields,
            masterdateconstraints,
            masteruniquevalidation,
            editable,
            mastertemplatefields,
            mastercombinationunique,
            sampleAuditFields,
            sampleAuditEditable,
            sampleAuditMultilingualFields,
            masterexportfields,
            templatemandatoryfields,
        }
        return { jsondata, jdynamiccolumns, jnumericcolumns, templatePrimaryKey: "ndynamicmastercode", deleteValidation, jsqlquerycolumns, sampleQuerybuilderViewCondition, sampleQuerybuilderViewSelect };
    }

    getGoodsInJsondata = (templatedata, task) => {
        let gridItem = [];
        let gridMoreItem = [];
        let datefields = [];
        let dateconstraints = [];
        let uniquevalidation = [];
        let combinationunique = [];
        let editable = [];
        let jdynamiccolumns = [];
        let jnumericcolumns = [];
        let templatePrimaryKey = "";
        let templatefields = [];
        let nonmandatoryExportFields = [];
        let sampleAuditFields = [];
        let sampleAuditEditable = [];
        let sampleAuditMultilingualFields = [];
        let sampleQuerybuilderViewCondition = [];
        let sampleQuerybuilderViewSelect = [];
        let deleteValidation = [];
        let exportFields =[];
        let templatemandatoryfields =[];
        let jsqlquerycolumns = [{
            "columnname": "ngoodsinsamplecode",
            "displayname": {
                "en-US": "GoodsIn Sample Code PK",
                "ru-RU": "Товары в коде PK",
                "tg-TG": "МолҳоДар Кодекси PK"
            },
            "columndatatype": "numeric"
        },
        {
            "columnname": "nstatus",
            "displayname": {
                "en-US": "Status",
                "ru-RU": "Статус",
                "tg-TG": "Статус"
            },
            "columndatatype": "numeric"
        }];
        templatedata && templatedata.map(row =>
            row.children && row.children.map(column => {
                column.children && column.children.map((component, index) => {
                    if (component.hasOwnProperty('children')) {
                        component.children.map(componentRow => {

                            // if (componentRow.isExportField) {
                            //     exportFields.push(componentRow)
                            // }

                            if(componentRow.mandatory === true){
                               exportFields.push({ [designProperties.LABEL]: componentRow.displayname, [designProperties.VALUE]: componentRow.label,[designProperties.LISTITEM]: componentRow.inputtype });
                            }else {
                                nonmandatoryExportFields.push({ [designProperties.LABEL]: componentRow.displayname, [designProperties.VALUE]: componentRow.label,[designProperties.LISTITEM]: componentRow.inputtype });
                            }


                            if(componentRow.mandatory){
                                templatemandatoryfields.push({
                                    [designProperties.LABEL]: componentRow.displayname,
                                    [designProperties.VALUE]: componentRow.label,
                                    [designProperties.LISTITEM]: componentRow.inputtype //ALPD-5328 added by Dhanushya RI,to hide label input type in template mapping screen
                                })
                            }

                            // if(componentRow.mandatory === false){
                            //     nonmandatoryExportFields.push({ [designProperties.LABEL]: componentRow.displayname, [designProperties.VALUE]: componentRow.label });
                            // }

                            jsqlquerycolumns.push({
                                "columnname": componentRow.label,
                                "displayname": componentRow.displayname,
                                "isjsoncolumn": true,
                                "columndatatype": "string",
                                "jsoncolumnname": "jsonuidata"
                            })
                            componentRow.unique && uniquevalidation.push({ [designProperties.LABEL]: componentRow.label });
                            componentRow.unique && combinationunique.push({ [componentRow.label]: { [designProperties.LABEL]: componentRow.displayname, [designProperties.VALUE]: componentRow.label,[designProperties.LISTITEM]: componentRow.inputtype } })

                            templatePrimaryKey = templatePrimaryKey === "" && componentRow.unique ? componentRow.label : templatePrimaryKey;

                            let filterinputtype = "text";
                            let comboDataInputObject = {};

                            if (componentRow.componentcode === designComponents.COMBOBOX) {
                                deleteValidation.push({
                                    "smastertablename": componentRow.table.item.stablename,
                                    "smasterprimarykeyname": componentRow.valuemember,
                                    "stranstablename": this.props.Login.masterData.realSampleValue.value === SampleType.GOODSIN ? "goodsinsample" : "registration",
                                    "stranstableforeignkeyname": componentRow.valuemember,
                                    "sjsonfieldname": "jsondata",
                                    "nisdynamicmaster": this.props.Login.masterData.realSampleValue.value !== SampleType.GOODSIN ? transactionStatus.YES : transactionStatus.NO,
                                    "nquerybuildertablecode": componentRow.nquerybuildertablecode
                                });

                                sampleQuerybuilderViewCondition.push({
                                    "columnname": componentRow.label,
                                    "displayname": componentRow.displayname,
                                    "columntype": 1,
                                    "viewvaluemember": componentRow.label,
                                    "valuemember": componentRow.valuemember,
                                    "displaymember": componentRow.displaymember,
                                    "mastertablename": componentRow.source,
                                    "needmasterdata": true,
                                    "columntypedesc": "textinput",
                                })

                                sampleQuerybuilderViewSelect.push({
                                    "columnname": componentRow.label,
                                    "displayname": componentRow.displayname,
                                    "languagecode": false
                                })
                            }

                            if (componentRow.inputtype === 'combo') {

                                comboDataInputObject = {
                                    "predefinedtablename": componentRow.source,
                                    "predefinedvaluemember": componentRow.valuemember,
                                    "predefineddisplaymember": componentRow.displaymember,
                                    "predefinedismultilingual": componentRow.isMultiLingual ? componentRow.isMultiLingual : false,
                                    "predefinedconditionalString": "\"" + componentRow.valuemember + "\"" + " > '0' "
                                };
                                jnumericcolumns.push({
                                    "columnname": componentRow.displaymember,
                                    "foreigntableformcode": componentRow.table.item.nformcode,
                                    "displayname": componentRow.displayname,
                                    "foriegntablePK": componentRow.valuemember,
                                    "tablecolumnname": componentRow.label,
                                    "foriegntablename": componentRow.source,
                                    "parentforeignPK": componentRow.displaymember,
                                    ...comboDataInputObject
                                })
                                filterinputtype = "predefinednumeric";
                            }
                            if (componentRow.inputtype === 'date') {
                                filterinputtype = "date";
                                datefields.push({ [designProperties.VALUE]: componentRow.label, dateonly: componentRow.dateonly || false });
                                dateconstraints = componentRow.dateConstraintArraySQL ? [...componentRow.dateConstraintArraySQL, ...dateconstraints] : dateconstraints;

                                sampleQuerybuilderViewCondition.push({
                                    "columnname": componentRow.label,
                                    "displayname": componentRow.displayname,
                                    "columntype": 2,
                                    "columntypedesc": "datetime",
                                })

                                sampleQuerybuilderViewSelect.push({
                                    "columnname": componentRow.label,
                                    "displayname": componentRow.displayname,
                                    "languagecode": false
                                })

                            }
                            if (componentRow.inputtype === 'Numeric' || componentRow.inputtype === 'radio') {
                                filterinputtype = "numeric";

                                if (componentRow.inputtype === 'Numeric') {
                                    sampleQuerybuilderViewCondition.push({
                                        "columnname": componentRow.label,
                                        "displayname": componentRow.displayname,
                                        "columntype": 5,
                                        "columntypedesc": "numericinput",
                                    })

                                    sampleQuerybuilderViewSelect.push({
                                        "columnname": componentRow.label,
                                        "displayname": componentRow.displayname,
                                        "languagecode": false
                                    })
                                }
                            }

                            if (componentRow.inputtype === 'textinput' || componentRow.inputtype === 'email'
                                || componentRow.inputtype === 'textarea' || componentRow.inputtype === 'radio') {

                                sampleQuerybuilderViewCondition.push({
                                    "columnname": componentRow.label,
                                    "displayname": componentRow.displayname,
                                    "columntype": 1,
                                    "columntypedesc": "textinput",
                                })

                                sampleQuerybuilderViewSelect.push({
                                    "columnname": componentRow.label,
                                    "displayname": componentRow.displayname,
                                    "languagecode": false
                                })

                            }

                            jdynamiccolumns.push({
                                default: componentRow.unique ? true : false,
                                filterinputtype,
                                columnname: componentRow.label,
                                displayname: componentRow.displayname,
                                ...comboDataInputObject
                            })
                            if (componentRow.mandatory || componentRow.templatemandatory) {
                                gridItem.push({ [designProperties.LABEL]: componentRow.displayname, [designProperties.VALUE]: componentRow.label,[designProperties.LISTITEM]: componentRow.inputtype })
                                sampleAuditEditable.push(componentRow.label);
                            }
                            else {
                                gridMoreItem.push({ [designProperties.LABEL]: componentRow.displayname, [designProperties.VALUE]: componentRow.label,[designProperties.LISTITEM]: componentRow.inputtype });
                            }
                            templatefields.push({ [designProperties.LABEL]: componentRow.displayname, [designProperties.VALUE]: componentRow.label,[designProperties.LISTITEM]: componentRow.inputtype })
                            sampleAuditFields.push(componentRow.label);
                            sampleAuditMultilingualFields.push({ [componentRow.label]: componentRow.displayname });


                            if (componentRow.templatemandatory) {
                                editable.push({ label: componentRow.label, editableuntill: [] })
                            }
                            else {
                                editable.push({ label: componentRow.label, editableuntill: [transactionStatus.DRAFT] })
                            }

                            return null;
                        })
                    } else {

                        // if (component.isExportField) {
                        //     exportFields.push(component)
                        // }

                        if(component.mandatory === true){
                           exportFields.push({ [designProperties.LABEL]: component.displayname, [designProperties.VALUE]: component.label,[designProperties.LISTITEM]: component.inputtype })
                        }else{
                            nonmandatoryExportFields.push({ [designProperties.LABEL]: component.displayname, [designProperties.VALUE]: component.label,[designProperties.LISTITEM]: component.inputtype });

                        }

                        if(component.mandatory){
                            templatemandatoryfields.push({
                                [designProperties.LABEL]: component.displayname,
                                [designProperties.VALUE]: component.label,
                                [designProperties.LISTITEM]: component.inputtype
                            })
                        }

                        // if(component.mandatory === false){
                        //     nonmandatoryExportFields.push({ [designProperties.LABEL]: component.displayname, [designProperties.VALUE]: component.label });
                        // }


                        component.unique && uniquevalidation.push({ [designProperties.LABEL]: component.label });
                        component.unique && combinationunique.push({ [component.label]: { [designProperties.LABEL]: component.displayname, [designProperties.VALUE]: component.label,[designProperties.LISTITEM]: component.inputtype } })
                        templatePrimaryKey = templatePrimaryKey === "" && component.unique ? component.label : templatePrimaryKey;
                        jsqlquerycolumns.push({
                            "columnname": component.label,
                            "displayname": component.displayname,
                            "isjsoncolumn": true,
                            "columndatatype": "string",
                            "jsoncolumnname": "jsonuidata"
                        })

                        let filterinputtype = "text";
                        let comboDataInputObject = {};

                        templatefields.push({ [designProperties.LABEL]: component.displayname, [designProperties.VALUE]: component.label,[designProperties.LISTITEM]: component.inputtype })
                        sampleAuditFields.push(component.label);
                        sampleAuditMultilingualFields.push({ [component.label]: component.displayname });

                        if (component.componentcode === designComponents.COMBOBOX) {
                            deleteValidation.push({
                                "smastertablename": component.table.item.stablename,
                                "smasterprimarykeyname": component.valuemember,
                                "stranstablename": this.props.Login.masterData.realSampleValue.value === SampleType.GOODSIN ? "goodsinsample" : "registration",
                                "stranstableforeignkeyname": component.valuemember,
                                "sjsonfieldname": "jsondata",
                                "nisdynamicmaster": this.props.Login.masterData.realSampleValue.value !== SampleType.GOODSIN ? transactionStatus.YES : transactionStatus.NO,
                                "nquerybuildertablecode": component.nquerybuildertablecode
                            });
                        }

                        if (component.inputtype === 'combo') {
                            filterinputtype = "predefinednumeric";
                            comboDataInputObject = {
                                "predefinedtablename": component.source,
                                "predefinedvaluemember": component.valuemember,
                                "predefineddisplaymember": component.displaymember,
                                "predefinedismultilingual": component.isMultiLingual ? component.isMultiLingual : false,
                                "predefinedconditionalString": "\"" + component.valuemember + "\"" + " > '0'"
                            };
                            jnumericcolumns.push({
                                "columnname": component.label,
                                "foreigntableformcode": component.table.item.nformcode,
                                "displayname": component.displayname,
                                "foriegntablePK": component.valuemember,
                                // "ismultilingual": true,
                                //"conditionstring": " and nformcode in (" + component.table.item.nformcode + ") ",
                                "tablecolumnname": component.label,
                                "foriegntablename": component.source,
                                "parentforeignPK": component.displaymember,
                                ...comboDataInputObject
                            })

                            sampleQuerybuilderViewCondition.push({
                                "columnname": component.label,
                                "displayname": component.displayname,
                                "columntype": 1,
                                "viewvaluemember": component.label,
                                "valuemember": component.valuemember,
                                "displaymember": component.displaymember,
                                "mastertablename": component.source,
                                "needmasterdata": true,
                                "columntypedesc": "textinput",
                            })

                            sampleQuerybuilderViewSelect.push({
                                "columnname": component.label,
                                "displayname": component.displayname,
                                "languagecode": false
                            })
                        }
                        if (component.inputtype === 'date') {
                            filterinputtype = "date";
                            datefields.push({ [designProperties.VALUE]: component.label, dateonly: component.dateonly || false });
                            dateconstraints = component.dateConstraintArraySQL ? [...component.dateConstraintArraySQL, ...dateconstraints] : dateconstraints;

                            sampleQuerybuilderViewCondition.push({
                                "columnname": component.label,
                                "displayname": component.displayname,
                                "columntype": 2,
                                "columntypedesc": "datetime",
                            })

                            sampleQuerybuilderViewSelect.push({
                                "columnname": component.label,
                                "displayname": component.displayname,
                                "languagecode": false
                            })
                        }
                        if (component.inputtype === 'Numeric' || component.inputtype === 'radio') {
                            filterinputtype = "numeric";

                            if (component.inputtype === 'Numeric') {
                                sampleQuerybuilderViewCondition.push({
                                    "columnname": component.label,
                                    "displayname": component.displayname,
                                    "columntype": 5,
                                    "columntypedesc": "numericinput",
                                })

                                sampleQuerybuilderViewSelect.push({
                                    "columnname": component.label,
                                    "displayname": component.displayname,
                                    "languagecode": false
                                })
                            }
                        }

                        if (component.inputtype === 'textinput' || component.inputtype === 'email'
                            || component.inputtype === 'textarea' || component.inputtype === 'radio') {

                            sampleQuerybuilderViewCondition.push({
                                "columnname": component.label,
                                "displayname": component.displayname,
                                "columntype": 1,
                                "columntypedesc": "textinput",
                            })

                            sampleQuerybuilderViewSelect.push({
                                "columnname": component.label,
                                "displayname": component.displayname,
                                "languagecode": false
                            })

                        }

                        jdynamiccolumns.push({
                            default: component.unique ? true : false,
                            columnname: component.label,
                            displayname: component.displayname,
                            filterinputtype,
                            ...comboDataInputObject
                        });

                        if (component.mandatory || component.templatemandatory) {
                            gridItem.push({ [designProperties.LABEL]: component.displayname, [designProperties.VALUE]: component.label,[designProperties.LISTITEM]: component.inputtype })
                            sampleAuditEditable.push(component.label);
                        } else {
                            gridMoreItem.push({ [designProperties.LABEL]: component.displayname, [designProperties.VALUE]: component.label,[designProperties.LISTITEM]: component.inputtype });
                        }
                        if (component.templatemandatory) {
                            editable.push({ label: component.label, editableuntill: [] });

                        }
                        else {
                            editable.push({ label: component.label, editableuntill: [transactionStatus.DRAFT] })
                        }
                        return null;
                    }

                })
            })
        );

        if (task === "DeleteValidation" && this.props.Login.masterData.realSampleValue.value !== SampleType.Masters) {

            const selectedSubSampleTemplate = this.props.Login.masterData.selectedDesignTemplateMapping.subsamplejsondata;

            const needsubsample = this.props.Login.masterData.realRegSubTypeValue ? this.props.Login.masterData.realRegSubTypeValue.item.nneedsubsample : false;

            if (needsubsample) {
                selectedSubSampleTemplate.map(row =>
                    row.children && row.children.map(column => {
                        column.children && column.children.map(component => {
                            if (component.hasOwnProperty('children')) {
                                component.children.map(componentRow => {

                                    if (componentRow.componentcode === designComponents.COMBOBOX) {
                                        deleteValidation.push({
                                            "smastertablename": componentRow.table.item.stablename,
                                            "smasterprimarykeyname": componentRow.valuemember,
                                            "stranstablename": "registrationsample",
                                            "stranstableforeignkeyname": componentRow.valuemember,
                                            // "salertmessage":"IDS_REGISTRATIONSAMPLE",	
                                            "sjsonfieldname": "jsondata",
                                            "nisdynamicmaster": this.props.Login.masterData.realSampleValue.value === SampleType.Masters ? transactionStatus.YES : transactionStatus.NO,
                                            "nquerybuildertablecode": componentRow.nquerybuildertablecode
                                            //"nformcode":componentRow.table.item.nformcode
                                        });
                                    }
                                }
                                )
                            } else {

                                if (component.componentcode === designComponents.COMBOBOX) {
                                    deleteValidation.push({
                                        "smastertablename": component.table.item.stablename,
                                        "smasterprimarykeyname": component.valuemember,
                                        "stranstablename": "registrationsample",
                                        "stranstableforeignkeyname": component.valuemember,
                                        //"salertmessage":"IDS_REGISTRATIONSAMPLE",	
                                        "sjsonfieldname": "jsondata",
                                        "nisdynamicmaster": this.props.Login.masterData.realSampleValue.value === SampleType.Masters ? transactionStatus.YES : transactionStatus.NO,
                                        //"nformcode":component.table.item.nformcode,
                                        "nquerybuildertablecode": component.nquerybuildertablecode
                                    });
                                }
                            }
                        })
                    })
                )
            }
        }


        let jsondata = {
            griditem: gridItem,
            gridmoreitem: gridMoreItem,
            datefields,
            dateconstraints,
            uniquevalidation,
            editable,
            templatefields,
            combinationunique,
            sampleAuditFields,
            sampleAuditEditable,
            sampleAuditMultilingualFields,
            exportFields,
            nonmandatoryExportFields,
            templatemandatoryfields,
        }
        return { jsondata, jdynamiccolumns, jnumericcolumns, templatePrimaryKey: "ngoodsinsamplecode", deleteValidation, jsqlquerycolumns, sampleQuerybuilderViewCondition, sampleQuerybuilderViewSelect };
    }

    //Added by sonia on 11th NOV 2024 for jira id:ALPD-5025
    getProtocolJsondata = (templatedata, task) => {
        let maximumCount=parseInt(this.props.Login.settings && this.props.Login.settings['60']);
        let gridItem = [{
            [designProperties.LABEL]: this.props.Login.genericLabel["ProtocolId"] && this.props.Login.genericLabel["ProtocolId"]["jsondata"]["sdisplayname"],
            [designProperties.VALUE]: 'sprotocolid'

        }];
        let gridMoreItem = [];
        let datefields = [];
        let dateconstraints = [];
        let uniquevalidation = [];
        let combinationunique = [];
        let editable = [];
        let jdynamiccolumns = [];
        let jnumericcolumns = [];
        let templatePrimaryKey = "";
        let templatefields = [];
        let nonmandatoryExportFields = [];
        let sampleAuditFields = ["sprotocolid","stransactionstatus"];
        let sampleAuditEditable = ["sprotocolid","stransactionstatus"];
        let sampleAuditMultilingualFields = [{
            "sprotocolid": this.props.Login.genericLabel["ProtocolId"] && this.props.Login.genericLabel["ProtocolId"]["jsondata"]["sdisplayname"],
            "stransactionstatus": this.props.Login.genericLabel["TransactionStatus"] && this.props.Login.genericLabel["TransactionStatus"]["jsondata"]["sdisplayname"]
        }];
        let sampleQuerybuilderViewCondition = [];
        let sampleQuerybuilderViewSelect = [];
        let deleteValidation = [];
        let exportFields =[];
        let templatemandatoryfields =[];
        let searchfields = ["sprotocolid","stransdisplaystatus","sactivestatus"];
        let listItem = [ ];
        let displayFields = [{
            [designProperties.LABEL]: this.props.Login.genericLabel["ProtocolId"] && this.props.Login.genericLabel["ProtocolId"]["jsondata"]["sdisplayname"],
            [designProperties.VALUE]: 'sprotocolid'

        } ];
        
        let jsqlquerycolumns = [{
            "columnname": "nprotocolcode",
            "displayname": {
                "en-US": "Protocol Code PK",
                "ru-RU": "Protocol Code PK",
                "tg-TG": "Protocol Code PK"
            },
            "columndatatype": "numeric"
        },
        {
            "columnname": "nstatus",
            "displayname": {
                "en-US": "Status",
                "ru-RU": "Статус",
                "tg-TG": "Статус"
            },
            "columndatatype": "numeric"
        }];
        templatedata && templatedata.map(row =>
            row.children && row.children.map(column => {
                column.children && column.children.map((component, index) => {
                    if (component.hasOwnProperty('children')) {
                        component.children.map(componentRow => {

                            // if (componentRow.isExportField) {
                            //     exportFields.push(componentRow)
                            // }

                            if(componentRow.mandatory === true){
                               exportFields.push({ [designProperties.LABEL]: componentRow.displayname, [designProperties.VALUE]: componentRow.label,[designProperties.LISTITEM]: componentRow.inputtype });
                            }else {
                                nonmandatoryExportFields.push({ [designProperties.LABEL]: componentRow.displayname, [designProperties.VALUE]: componentRow.label,[designProperties.LISTITEM]: componentRow.inputtype });
                            }


                            if(componentRow.mandatory){
                                templatemandatoryfields.push({
                                    [designProperties.LABEL]: componentRow.displayname,
                                    [designProperties.VALUE]: componentRow.label,
                                    [designProperties.LISTITEM]: componentRow.inputtype
                                })
                            }

                            // if(componentRow.mandatory === false){
                            //     nonmandatoryExportFields.push({ [designProperties.LABEL]: componentRow.displayname, [designProperties.VALUE]: componentRow.label });
                            // }

                            jsqlquerycolumns.push({
                                "columnname": componentRow.label,
                                "displayname": componentRow.displayname,
                                "isjsoncolumn": true,
                                "columndatatype": "string",
                                "jsoncolumnname": "jsonuidata"
                            })
                            componentRow.unique && uniquevalidation.push({ [designProperties.LABEL]: componentRow.label });
                            componentRow.unique && combinationunique.push({ [componentRow.label]: { [designProperties.LABEL]: componentRow.displayname, [designProperties.VALUE]: componentRow.label,[designProperties.LISTITEM]: componentRow.inputtype  } })

                            if(componentRow.name === undefined){
                                searchfields.push(componentRow.label)

                            }

                            displayFields.push({ [designProperties.LABEL]: component.displayname, [designProperties.VALUE]: component.label, [designProperties.LISTITEM]: component.inputtype });

                            if(!(listItem.length >= maximumCount)){
                                componentRow.mandatory && 
                               listItem.push({ [designProperties.LABEL]: componentRow.displayname,
                                    [designProperties.VALUE]: componentRow.label,
                                    [designProperties.LISTITEM]: componentRow.inputtype })
                            }

                            templatePrimaryKey = templatePrimaryKey === "" && componentRow.unique ? componentRow.label : templatePrimaryKey;

                            let filterinputtype = "text";
                            let comboDataInputObject = {};

                            if (componentRow.componentcode === designComponents.COMBOBOX) {
                                deleteValidation.push({
                                    "smastertablename": componentRow.table.item.stablename,
                                    "smasterprimarykeyname": componentRow.valuemember,
                                    "stranstablename": this.props.Login.masterData.realSampleValue.value === SampleType.PROTOCOL ? "protocol" : "registration",
                                    "stranstableforeignkeyname": componentRow.valuemember,
                                    "sjsonfieldname": "jsondata",
                                    "nisdynamicmaster": this.props.Login.masterData.realSampleValue.value !== SampleType.PROTOCOL ? transactionStatus.YES : transactionStatus.NO,
                                    "nquerybuildertablecode": componentRow.nquerybuildertablecode
                                });

                                sampleQuerybuilderViewCondition.push({
                                    "columnname": componentRow.label,
                                    "displayname": componentRow.displayname,
                                    "columntype": 1,
                                    "viewvaluemember": componentRow.label,
                                    "valuemember": componentRow.valuemember,
                                    "displaymember": componentRow.displaymember,
                                    "mastertablename": componentRow.source,
                                    "needmasterdata": true,
                                    "columntypedesc": "textinput",
                                })

                                sampleQuerybuilderViewSelect.push({
                                    "columnname": componentRow.label,
                                    "displayname": componentRow.displayname,
                                    "languagecode": false
                                })
                            }

                            if (componentRow.inputtype === 'combo') {

                                comboDataInputObject = {
                                    "predefinedtablename": componentRow.source,
                                    "predefinedvaluemember": componentRow.valuemember,
                                    "predefineddisplaymember": componentRow.displaymember,
                                    "predefinedismultilingual": componentRow.isMultiLingual ? componentRow.isMultiLingual : false,
                                    "predefinedconditionalString": "\"" + componentRow.valuemember + "\"" + " > '0' "
                                };
                                jnumericcolumns.push({
                                    "columnname": componentRow.displaymember,
                                    "foreigntableformcode": componentRow.table.item.nformcode,
                                    "displayname": componentRow.displayname,
                                    "foriegntablePK": componentRow.valuemember,
                                    "tablecolumnname": componentRow.label,
                                    "foriegntablename": componentRow.source,
                                    "parentforeignPK": componentRow.displaymember,
                                    ...comboDataInputObject
                                })
                                filterinputtype = "predefinednumeric";
                            }
                            if (componentRow.inputtype === 'date') {
                                filterinputtype = "date";
                                datefields.push({ [designProperties.VALUE]: componentRow.label, dateonly: componentRow.dateonly || false });
                                dateconstraints = componentRow.dateConstraintArraySQL ? [...componentRow.dateConstraintArraySQL, ...dateconstraints] : dateconstraints;

                                sampleQuerybuilderViewCondition.push({
                                    "columnname": componentRow.label,
                                    "displayname": componentRow.displayname,
                                    "columntype": 2,
                                    "columntypedesc": "datetime",
                                })

                                sampleQuerybuilderViewSelect.push({
                                    "columnname": componentRow.label,
                                    "displayname": componentRow.displayname,
                                    "languagecode": false
                                })

                            }
                            if (componentRow.inputtype === 'Numeric' || componentRow.inputtype === 'radio') {
                                filterinputtype = "numeric";

                                if (componentRow.inputtype === 'Numeric') {
                                    sampleQuerybuilderViewCondition.push({
                                        "columnname": componentRow.label,
                                        "displayname": componentRow.displayname,
                                        "columntype": 5,
                                        "columntypedesc": "numericinput",
                                    })

                                    sampleQuerybuilderViewSelect.push({
                                        "columnname": componentRow.label,
                                        "displayname": componentRow.displayname,
                                        "languagecode": false
                                    })
                                }
                            }

                            if (componentRow.inputtype === 'textinput' || componentRow.inputtype === 'email'
                                || componentRow.inputtype === 'textarea' || componentRow.inputtype === 'radio') {

                                sampleQuerybuilderViewCondition.push({
                                    "columnname": componentRow.label,
                                    "displayname": componentRow.displayname,
                                    "columntype": 1,
                                    "columntypedesc": "textinput",
                                })

                                sampleQuerybuilderViewSelect.push({
                                    "columnname": componentRow.label,
                                    "displayname": componentRow.displayname,
                                    "languagecode": false
                                })

                            }

                            jdynamiccolumns.push({
                                default: componentRow.unique ? true : false,
                                filterinputtype,
                                columnname: componentRow.label,
                                displayname: componentRow.displayname,
                                ...comboDataInputObject
                            })
                            if (componentRow.mandatory || componentRow.templatemandatory) {
                                gridItem.push({ [designProperties.LABEL]: componentRow.displayname, [designProperties.VALUE]: componentRow.label,[designProperties.LISTITEM]: componentRow.inputtype })
                                sampleAuditEditable.push(componentRow.label);
                            }
                            else {
                                gridMoreItem.push({ [designProperties.LABEL]: componentRow.displayname, [designProperties.VALUE]: componentRow.label,[designProperties.LISTITEM]: componentRow.inputtype });
                            }
                            templatefields.push({ [designProperties.LABEL]: componentRow.displayname, [designProperties.VALUE]: componentRow.label,[designProperties.LISTITEM]: componentRow.inputtype  })
                            sampleAuditFields.push(componentRow.label);
                            sampleAuditMultilingualFields.push({ [componentRow.label]: componentRow.displayname });


                            if (componentRow.templatemandatory) {
                                editable.push({ label: componentRow.label, editableuntill: [] })
                            }
                            else {
                                editable.push({ label: componentRow.label, editableuntill: [transactionStatus.DRAFT] })
                            }

                            return null;
                        })
                    } else {

                        // if (component.isExportField) {
                        //     exportFields.push(component)
                        // }

                        if(component.mandatory === true){
                           exportFields.push({ [designProperties.LABEL]: component.displayname, [designProperties.VALUE]: component.label,[designProperties.LISTITEM]: component.inputtype })
                        }else{
                            nonmandatoryExportFields.push({ [designProperties.LABEL]: component.displayname, [designProperties.VALUE]: component.label });

                        }

                        if(component.mandatory){
                            templatemandatoryfields.push({
                                [designProperties.LABEL]: component.displayname,
                                [designProperties.VALUE]: component.label,
                                [designProperties.LISTITEM]: component.inputtype 
                            })
                        }

                        // if(component.mandatory === false){
                        //     nonmandatoryExportFields.push({ [designProperties.LABEL]: component.displayname, [designProperties.VALUE]: component.label });
                        // }


                        component.unique && uniquevalidation.push({ [designProperties.LABEL]: component.label });
                        component.unique && combinationunique.push({ [component.label]: { [designProperties.LABEL]: component.displayname, [designProperties.VALUE]: component.label,[designProperties.LISTITEM]: component.inputtype } })
                        templatePrimaryKey = templatePrimaryKey === "" && component.unique ? component.label : templatePrimaryKey;
                        jsqlquerycolumns.push({
                            "columnname": component.label,
                            "displayname": component.displayname,
                            "isjsoncolumn": true,
                            "columndatatype": "string",
                            "jsoncolumnname": "jsonuidata"
                        })

                        if(component.name === undefined){
                            searchfields.push(component.label)

                        }
                        displayFields.push({ [designProperties.LABEL]: component.displayname, [designProperties.VALUE]: component.label, [designProperties.LISTITEM]: component.inputtype });

                        if(!(listItem.length >= maximumCount)){
                            component.mandatory && 
                           listItem.push({ [designProperties.LABEL]: component.displayname,
                                [designProperties.VALUE]: component.label,
                                [designProperties.LISTITEM]: component.inputtype })
                        }

                        let filterinputtype = "text";
                        let comboDataInputObject = {};

                        templatefields.push({ [designProperties.LABEL]: component.displayname, [designProperties.VALUE]: component.label ,[designProperties.LISTITEM]: component.inputtype })
                        sampleAuditFields.push(component.label);
                        sampleAuditMultilingualFields.push({ [component.label]: component.displayname });

                        if (component.componentcode === designComponents.COMBOBOX) {
                            deleteValidation.push({
                                "smastertablename": component.table.item.stablename,
                                "smasterprimarykeyname": component.valuemember,
                                "stranstablename": this.props.Login.masterData.realSampleValue.value === SampleType.PROTOCOL ? "protocolversion" : "registration",
                                "stranstableforeignkeyname": component.valuemember,
                                "sjsonfieldname": "jsondata",
                                "nisdynamicmaster": this.props.Login.masterData.realSampleValue.value !== SampleType.PROTOCOL ? transactionStatus.YES : transactionStatus.NO,
                                "nquerybuildertablecode": component.nquerybuildertablecode
                            });
                        }

                        if (component.inputtype === 'combo') {
                            filterinputtype = "predefinednumeric";
                            comboDataInputObject = {
                                "predefinedtablename": component.source,
                                "predefinedvaluemember": component.valuemember,
                                "predefineddisplaymember": component.displaymember,
                                "predefinedismultilingual": component.isMultiLingual ? component.isMultiLingual : false,
                                "predefinedconditionalString": "\"" + component.valuemember + "\"" + " > '0'"
                            };
                            jnumericcolumns.push({
                                "columnname": component.label,
                                "foreigntableformcode": component.table.item.nformcode,
                                "displayname": component.displayname,
                                "foriegntablePK": component.valuemember,
                                // "ismultilingual": true,
                                //"conditionstring": " and nformcode in (" + component.table.item.nformcode + ") ",
                                "tablecolumnname": component.label,
                                "foriegntablename": component.source,
                                "parentforeignPK": component.displaymember,
                                ...comboDataInputObject
                            })

                            sampleQuerybuilderViewCondition.push({
                                "columnname": component.label,
                                "displayname": component.displayname,
                                "columntype": 1,
                                "viewvaluemember": component.label,
                                "valuemember": component.valuemember,
                                "displaymember": component.displaymember,
                                "mastertablename": component.source,
                                "needmasterdata": true,
                                "columntypedesc": "textinput",
                            })

                            sampleQuerybuilderViewSelect.push({
                                "columnname": component.label,
                                "displayname": component.displayname,
                                "languagecode": false
                            })
                        }
                        if (component.inputtype === 'date') {
                            filterinputtype = "date";
                            datefields.push({ [designProperties.VALUE]: component.label, dateonly: component.dateonly || false });
                            dateconstraints = component.dateConstraintArraySQL ? [...component.dateConstraintArraySQL, ...dateconstraints] : dateconstraints;

                            sampleQuerybuilderViewCondition.push({
                                "columnname": component.label,
                                "displayname": component.displayname,
                                "columntype": 2,
                                "columntypedesc": "datetime",
                            })

                            sampleQuerybuilderViewSelect.push({
                                "columnname": component.label,
                                "displayname": component.displayname,
                                "languagecode": false
                            })
                        }
                        if (component.inputtype === 'Numeric' || component.inputtype === 'radio') {
                            filterinputtype = "numeric";

                            if (component.inputtype === 'Numeric') {
                                sampleQuerybuilderViewCondition.push({
                                    "columnname": component.label,
                                    "displayname": component.displayname,
                                    "columntype": 5,
                                    "columntypedesc": "numericinput",
                                })

                                sampleQuerybuilderViewSelect.push({
                                    "columnname": component.label,
                                    "displayname": component.displayname,
                                    "languagecode": false
                                })
                            }
                        }

                        if (component.inputtype === 'textinput' || component.inputtype === 'email'
                            || component.inputtype === 'textarea' || component.inputtype === 'radio') {

                            sampleQuerybuilderViewCondition.push({
                                "columnname": component.label,
                                "displayname": component.displayname,
                                "columntype": 1,
                                "columntypedesc": "textinput",
                            })

                            sampleQuerybuilderViewSelect.push({
                                "columnname": component.label,
                                "displayname": component.displayname,
                                "languagecode": false
                            })

                        }

                        jdynamiccolumns.push({
                            default: component.unique ? true : false,
                            columnname: component.label,
                            displayname: component.displayname,
                            filterinputtype,
                            ...comboDataInputObject
                        });

                        if (component.mandatory || component.templatemandatory) {
                            gridItem.push({ [designProperties.LABEL]: component.displayname, [designProperties.VALUE]: component.label,[designProperties.LISTITEM]: component.inputtype })
                            sampleAuditEditable.push(component.label);
                        } else {
                            gridMoreItem.push({ [designProperties.LABEL]: component.displayname, [designProperties.VALUE]: component.label,[designProperties.LISTITEM]: component.inputtype });
                        }
                        if (component.templatemandatory) {
                            editable.push({ label: component.label, editableuntill: [] });

                        }
                        else {
                            editable.push({ label: component.label, editableuntill: [transactionStatus.DRAFT] })
                        }
                        return null;
                    }

                })
            })
        );

        if (task === "DeleteValidation" && this.props.Login.masterData.realSampleValue.value !== SampleType.Masters) {

            const selectedSubSampleTemplate = this.props.Login.masterData.selectedDesignTemplateMapping.subsamplejsondata;

            const needsubsample = this.props.Login.masterData.realRegSubTypeValue ? this.props.Login.masterData.realRegSubTypeValue.item.nneedsubsample : false;

            if (needsubsample) {
                selectedSubSampleTemplate.map(row =>
                    row.children && row.children.map(column => {
                        column.children && column.children.map(component => {
                            if (component.hasOwnProperty('children')) {
                                component.children.map(componentRow => {

                                    if (componentRow.componentcode === designComponents.COMBOBOX) {
                                        deleteValidation.push({
                                            "smastertablename": componentRow.table.item.stablename,
                                            "smasterprimarykeyname": componentRow.valuemember,
                                            "stranstablename": "registrationsample",
                                            "stranstableforeignkeyname": componentRow.valuemember,
                                            // "salertmessage":"IDS_REGISTRATIONSAMPLE",	
                                            "sjsonfieldname": "jsondata",
                                            "nisdynamicmaster": this.props.Login.masterData.realSampleValue.value === SampleType.Masters ? transactionStatus.YES : transactionStatus.NO,
                                            "nquerybuildertablecode": componentRow.nquerybuildertablecode
                                            //"nformcode":componentRow.table.item.nformcode
                                        });
                                    }
                                }
                                )
                            } else {

                                if (component.componentcode === designComponents.COMBOBOX) {
                                    deleteValidation.push({
                                        "smastertablename": component.table.item.stablename,
                                        "smasterprimarykeyname": component.valuemember,
                                        "stranstablename": "registrationsample",
                                        "stranstableforeignkeyname": component.valuemember,
                                        //"salertmessage":"IDS_REGISTRATIONSAMPLE",	
                                        "sjsonfieldname": "jsondata",
                                        "nisdynamicmaster": this.props.Login.masterData.realSampleValue.value === SampleType.Masters ? transactionStatus.YES : transactionStatus.NO,
                                        //"nformcode":component.table.item.nformcode,
                                        "nquerybuildertablecode": component.nquerybuildertablecode
                                    });
                                }
                            }
                        })
                    })
                )
            }
        }


        let jsondata = {
            griditem: gridItem,
            gridmoreitem: gridMoreItem,
            datefields,
            dateconstraints,
            uniquevalidation,
            editable,
            templatefields,
            combinationunique,
            sampleAuditFields,
            sampleAuditEditable,
            sampleAuditMultilingualFields,
            exportFields,
            nonmandatoryExportFields,
            templatemandatoryfields,
            searchfields,
            listItem,
            displayFields,
        }
        return { jsondata, jdynamiccolumns, jnumericcolumns, templatePrimaryKey: "nprotocolcode", deleteValidation, jsqlquerycolumns, sampleQuerybuilderViewCondition, sampleQuerybuilderViewSelect };
    }

    getJsondata = (templatedata) => {
        let maximumCount=parseInt(this.props.Login.settings && this.props.Login.settings['60']);
        //let displayFields = [];
        //ALPD-533
        let displayFields = [{
            [designProperties.LABEL]: this.props.Login.genericLabel["ARNo"] && this.props.Login.genericLabel["ARNo"]["jsondata"]["sdisplayname"],
            //{ ...ARNOMULTILINGUAL },
            [designProperties.VALUE]: 'sarno'
        },
            //Below commented code only for NFC project
    // {
    //     [designProperties.LABEL]: this.props.Login.genericLabel["TestCount"] && this.props.Login.genericLabel["TestCount"]["jsondata"]["sdisplayname"],
    //     [designProperties.VALUE]: 'ntestcount'  
    //         }
        ];
        let listItem = [ ]
        // let gridItem = [];
        let gridItem = [{
            [designProperties.LABEL]: this.props.Login.genericLabel["ARNo"] && this.props.Login.genericLabel["ARNo"]["jsondata"]["sdisplayname"],
            //{ ...ARNOMULTILINGUAL }, 
            [designProperties.VALUE]: "sarno"
        }];
        let gridMoreItem = []
        let editable = []
        let subsampleeditable = [];
        let subsamplelistitem = [];
        let sampledatefields = [{ [designProperties.VALUE]: 'dregdate', dateonly: false }];
        let sampledateconstraints = [];
        let subsampledatefields = [];
        let subsampledateconstraints = [];
        let samplesearchfields = ["dregdate", "sarno", "stransdisplaystatus", "sspecname"];
        let subsamplesearchfields = ["sarno", "ssamplearno", "stransdisplaystatus"];
        let sampletemplatefields = [];
        let subsampletemplatefields = [];
        let sampleuniquevalidation = [];
        let subsampleuniquevalidation = [];
        let jdynamiccolumns = [];
        let jnumericcolumns = [];
        let samplecombinationunique = [];
        let subsamplecombinationunique = [];

        let sampleAuditFields = [];
        let sampleAuditEditable = [];
        let sampleAuditMultilingualFields = [];
        let subSampleAuditFields = [];
        let subSampleAuditEditable = [];
        let subSampleAuditMultilingualFields = [];
        let deleteValidation = [];
        let sampletemplatemandatoryfields = [];
        let subsampletemplatemandatoryfields = [];

        const sampleExportFields = []
        const subSampleExportFields = []
        const sampletemplatemandatory = []

        //if(this.props.Login.masterData.realSampleValue.value !== SampleType.Masters){        

        sampleAuditFields = ["sarno"];
        sampleAuditEditable = ["sarno"];
        sampleAuditMultilingualFields = [{
            "sarno": this.props.Login.genericLabel["ARNo"] && this.props.Login.genericLabel["ARNo"]["jsondata"]["sdisplayname"],
            //{ ...ARNOMULTILINGUAL } 
        }];
        subSampleAuditFields = ["sarno", "ssamplearno"];
        subSampleAuditEditable = ["sarno", "ssamplearno"];
        subSampleAuditMultilingualFields = [{
            "sarno": this.props.Login.genericLabel["ARNo"] && this.props.Login.genericLabel["ARNo"]["jsondata"]["sdisplayname"],
            //{ ...ARNOMULTILINGUAL } 
        },
        {
            "ssamplearno": this.props.Login.genericLabel["SubARNo"] && this.props.Login.genericLabel["SubARNo"]["jsondata"]["sdisplayname"]//{ ...SUBARNOMULTILINGUAL } 
        }];
        //}

        ////////////////////////////////////////////
        // let sampleAuditFields = SAMPLEAUDITFIELDS;
        // let sampleAuditEditable = SAMPLEAUDITEDITABLE
        // let sampleAuditMultilingualFields = SAMPLEAUDITMULTILINGUALFIELDS
        // let subSampleAuditFields = SUBSAMPLEAUDITFIELDS
        // let subSampleAuditEditable = SUBSAMPLEAUDITEDITABLE
        // let subSampleAuditMultilingualFields = SUBSAMPLEAUDITMULTILINGUALFIELDS;

        let testdatefields = [{ [designProperties.VALUE]: 'dtransactiondate', dateonly: false },
        { [designProperties.VALUE]: 'dregdate', dateonly: false }];
        //console.log("this.state.selectedRecord:", this.state.selectedRecord);
        this.state.selectedRecord.nsubsampletemplatecode && this.state.selectedRecord.nsubsampletemplatecode.item.jsondata.map(row =>
            row.children && row.children.map(column => {
                column.children && column.children.map(component => {
                    if (component.hasOwnProperty('children')) {
                        component.children.map(componentRow => {

                            if (componentRow.isExportField) {
                                subSampleExportFields.push(componentRow.label)
                            }



                            componentRow.unique && subsampleuniquevalidation.push({ [designProperties.LABEL]: componentRow.label });
                            componentRow.unique && subsamplecombinationunique.push({ [componentRow.label]: { [designProperties.LABEL]: componentRow.displayname, [designProperties.VALUE]: componentRow.label,[designProperties.LISTITEM]: componentRow.inputtype } })
                            subsamplesearchfields.push(componentRow.label);

                            subsampletemplatefields.push({
                                [designProperties.LABEL]: componentRow.displayname,
                                [designProperties.VALUE]: componentRow.label,
                                [designProperties.LISTITEM]: componentRow.inputtype,
                                [designProperties.PRIMARYKEY]: componentRow.valuemember,
                                [designProperties.QUERYBUILDERTABLECODE]: componentRow.nquerybuildertablecode,
                                [designProperties.COLUMNDETAILS]:componentRow 
                            })
                            if(componentRow.mandatory){
                                subsampletemplatemandatoryfields.push({
                                    [designProperties.LABEL]: componentRow.displayname,
                                    [designProperties.VALUE]: componentRow.label,
                                    [designProperties.LISTITEM]: componentRow.inputtype
                            })
                        }
                            if (componentRow.componentcode === designComponents.COMBOBOX) {
                                deleteValidation.push({
                                    "smastertablename": componentRow.table.item.stablename,
                                    "smasterprimarykeyname": componentRow.table.valuemember,
                                    "stranstablename": this.props.Login.masterData.realSampleValue.value === SampleType.Masters ? "dynamicmaster" : "registrationsample",
                                    "stranstableforeignkeyname": componentRow.table.valuemember,
                                    "sjsonfieldname": "jsondata",
                                    "nisdynamicmaster": this.props.Login.masterData.realSampleValue.value === SampleType.Masters ? transactionStatus.YES : transactionStatus.NO,
                                    "nquerybuildertablecode": componentRow.nquerybuildertablecode
                                });
                            }
                            subSampleAuditFields.push(componentRow.label);
                            subSampleAuditMultilingualFields.push({ [componentRow.label]: componentRow.displayname });

                            if (componentRow.mandatory) {
                                subSampleAuditEditable.push(componentRow.label);
                            }

                            if (componentRow.readonly)
                                subsampleeditable.push({ label: componentRow.label, editableuntill: [] })
                            else
                                subsampleeditable.push({ label: componentRow.label, editableuntill: [transactionStatus.PREREGISTER] })

                            if (componentRow.inputtype === 'date') {
                                subsampledatefields.push({ [designProperties.VALUE]: componentRow.label, dateonly: componentRow.dateonly || false });
                                subsampledateconstraints = componentRow.dateConstraintArraySQL ? [...componentRow.dateConstraintArraySQL, ...subsampledateconstraints] : subsampledateconstraints;
                            }
                            subsamplelistitem.push({ [designProperties.LABEL]: componentRow.displayname, [designProperties.VALUE]: componentRow.label, [designProperties.LISTITEM]: componentRow.inputtype })
                        }
                        )
                    } else {

                        if (component.templatemandatory) {
                            sampletemplatemandatory.push(component.label)
                        }
                        if (component.isExportField) {
                            subSampleExportFields.push(component.label)
                        }
                        component.unique && subsampleuniquevalidation.push({ [designProperties.LABEL]: component.label });
                        component.unique && subsamplecombinationunique.push({ [component.label]: { [designProperties.LABEL]: component.displayname, [designProperties.VALUE]: component.label ,[designProperties.LISTITEM]: component.inputtype} })
                        subsamplesearchfields.push(component.label);

                        subsampletemplatefields.push({
                            [designProperties.LABEL]: component.displayname,
                            [designProperties.VALUE]: component.label,
                            [designProperties.LISTITEM]: component.inputtype,
                            [designProperties.PRIMARYKEY]: component.valuemember,
                            [designProperties.QUERYBUILDERTABLECODE]: component.nquerybuildertablecode,
                            [designProperties.COLUMNDETAILS]:component 
                        })
                        if(component.mandatory){
                            subsampletemplatemandatoryfields.push({
                                [designProperties.LABEL]: component.displayname,
                                [designProperties.VALUE]: component.label,
                                [designProperties.LISTITEM]: component.inputtype
                        })
                    }

                        if (component.componentcode === designComponents.COMBOBOX) {
                            deleteValidation.push({
                                "smastertablename": component.table.item.stablename,
                                "smasterprimarykeyname": component.table.valuemember,
                                "stranstablename": this.props.Login.masterData.realSampleValue.value === SampleType.Masters ? "dynamicmaster" : "registrationsample",
                                "stranstableforeignkeyname": component.table.valuemember,
                                // "salertmessage":"IDS_REGISTRATIONSAMPLE",	
                                "sjsonfieldname": "jsondata",
                                "nisdynamicmaster": this.props.Login.masterData.realSampleValue.value === SampleType.Masters ? transactionStatus.YES : transactionStatus.NO,
                                //"nformcode":component.table.item.nformcode,
                                "nquerybuildertablecode": component.nquerybuildertablecode
                            });
                        }
                        subSampleAuditFields.push(component.label);
                        subSampleAuditMultilingualFields.push({ [component.label]: component.displayname });

                        if (component.mandatory) {
                            subSampleAuditEditable.push(component.label);
                        }
                        if (component.readonly)
                            subsampleeditable.push({ label: component.label, editableuntill: [] })
                        else
                            subsampleeditable.push({ label: component.label, editableuntill: [transactionStatus.PREREGISTER] })

                        if (component.inputtype === 'date') {
                            subsampledatefields.push({ [designProperties.VALUE]: component.label, dateonly: component.dateonly || false });
                            subsampledateconstraints = component.dateConstraintArraySQL ? [...component.dateConstraintArraySQL, ...subsampledateconstraints] : subsampledateconstraints;
                        }
                        subsamplelistitem.push({ [designProperties.LABEL]: component.displayname, [designProperties.VALUE]: component.label, [designProperties.LISTITEM]: component.inputtype });
                    }
                })
            })
        )
        templatedata && templatedata.map(row =>
            row.children && row.children.map(column => {
                column.children && column.children.map(component => {


                    if (component.inputtype !== 'frontendsearchfilter' && component.inputtype !== 'backendsearchfilter') {
                        if (component.hasOwnProperty('children')) {
                            if (component.inputtype !== 'frontendsearchfilter' && component.inputtype !== 'backendsearchfilter') {
                                // let combinedField = [];
                                component.children.map(componentRow => {

                                    if (componentRow.templatemandatory) {
                                        sampletemplatemandatory.push(componentRow.label)
                                    }


                                    if (componentRow.isExportField) {
                                        sampleExportFields.push(componentRow.label)
                                    }
                                    // combinedField.push(componentRow.label)
                                    jdynamiccolumns.push({
                                        columnname: componentRow.label,
                                        displayname: componentRow.displayname
                                    })
                                    if (componentRow.hasOwnProperty('child')) {
                                        componentRow.child.map(childData => {
                                            jnumericcolumns.push({
                                                "columnname": componentRow.label,
                                                "displayname": componentRow.displayname,
                                                "foriegntablePK": componentRow.label,
                                                // "ismultilingual": true,
                                                // "conditionstring": " and nformcode in (140) ",
                                                "tablecolumnname": childData.tablecolumnname,
                                                "foriegntablename": "dynamicmaster"
                                            })
                                        })
                                    }
                                    if (componentRow.componentcode === designComponents.COMBOBOX) {
                                        deleteValidation.push({
                                            "smastertablename": componentRow.table.item.stablename,
                                            "smasterprimarykeyname": componentRow.table.valuemember,
                                            "stranstablename": this.props.Login.masterData.realSampleValue.value === SampleType.Masters ? "dynamicmaster" : "registration",
                                            "stranstableforeignkeyname": componentRow.table.valuemember,
                                            //"salertmessage":this.props.Login.masterData.realSampleValue.value === SampleType.Masters? "IDS_DYNAMICMASTER" :"IDS_REGISTRATION",	
                                            "sjsonfieldname": "jsondata",
                                            "nisdynamicmaster": this.props.Login.masterData.realSampleValue.value === SampleType.Masters ? transactionStatus.YES : transactionStatus.NO,
                                            //"nformcode":componentRow.table.item.nformcode,
                                            "nquerybuildertablecode": componentRow.nquerybuildertablecode
                                        });
                                    }
                                    componentRow.unique && sampleuniquevalidation.push({ [designProperties.LABEL]: componentRow.label });
                                    componentRow.unique && samplecombinationunique.push({ [componentRow.label]: { [designProperties.LABEL]: componentRow.displayname, [designProperties.VALUE]: componentRow.label } })
                                    if (componentRow.name === undefined || componentRow.name !== 'manualsampleid') {
                                        samplesearchfields.push(componentRow.label)
                                        sampletemplatefields.push({
                                            [designProperties.LABEL]: componentRow.displayname,
                                            [designProperties.VALUE]: componentRow.label,
                                            [designProperties.LISTITEM]: componentRow.inputtype,    
                                            [designProperties.PRIMARYKEY]: componentRow.valuemember,
                                            [designProperties.QUERYBUILDERTABLECODE]: componentRow.nquerybuildertablecode,
                                            [designProperties.TABLENAME]: componentRow.table && componentRow.table.item && componentRow.table.item.stablename,
                                            [designProperties.COLUMNNAME]: componentRow.column && componentRow.column.item &&  componentRow.column.item.columnname,
                                            [designProperties.component]:  componentRow.isMultiLingual ?"isMultiLingual" :undefined ,
                                            [designProperties.RECORDTYPE]: "dynamic" ,
                                            [designProperties.COLUMNDETAILS]:componentRow 
                                        })
                                        if(componentRow.mandatory){
                                            sampletemplatemandatoryfields.push({
                                                [designProperties.LABEL]: componentRow.displayname,
                                                [designProperties.VALUE]: componentRow.label,
                                            })
                                        }
                                        displayFields.push({ [designProperties.LABEL]: componentRow.displayname, [designProperties.VALUE]: componentRow.label, [designProperties.LISTITEM]: componentRow.inputtype });

                                        if(!(listItem.length >= maximumCount)){
                                         componentRow.mandatory && 
                                        listItem.push({ [designProperties.LABEL]: componentRow.displayname,
                                             [designProperties.VALUE]: componentRow.label,
                                              [designProperties.LISTITEM]: componentRow.inputtype })
                                        }


                                        if (componentRow.mandatory || componentRow.templatemandatory) {
                                            gridItem.push({ [designProperties.LABEL]: componentRow.displayname, [designProperties.VALUE]: componentRow.label,[designProperties.LISTITEM]: componentRow.inputtype })
                                            sampleAuditEditable.push(componentRow.label);
                                        }
                                        else {
                                            gridMoreItem.push({ [designProperties.LABEL]: componentRow.displayname, [designProperties.VALUE]: componentRow.label, [designProperties.LISTITEM]: componentRow.inputtype });
                                        }
                                        if (componentRow.templatemandatory) {
                                            editable.push({ label: componentRow.label, editableuntill: [] })
                                        }
                                        else {
                                            if (componentRow.readonly)
                                                editable.push({ label: componentRow.label, editableuntill: [] })
                                            else
                                                editable.push({ label: componentRow.label, editableuntill: [transactionStatus.PREREGISTER] })

                                        }
                                    }

                                    sampleAuditFields.push(componentRow.label);
                                    sampleAuditMultilingualFields.push({ [componentRow.label]: componentRow.displayname });
                                    if (componentRow.inputtype === 'date') {
                                        sampledatefields.push({ [designProperties.VALUE]: componentRow.label, dateonly: componentRow.dateonly || false });
                                        sampledateconstraints = componentRow.dateConstraintArraySQL ? [...componentRow.dateConstraintArraySQL, ...sampledateconstraints] : sampledateconstraints;
                                    }




                                    return null;
                                })
                                // let fieldSet = combinedField.join("&")
                                // displayFields.push(fieldSet);
                                // componentRow.templatemandatory && listItem.push(fieldSet)
                                // gridMoreItem.push(fieldSet);
                            }
                        }
                        else {



                            if (component.templatemandatory) {
                                sampletemplatemandatory.push(component.label)
                            }
                            if (component.isExportField) {
                                sampleExportFields.push(component.label)
                            }
                            if (component.inputtype !== 'frontendsearchfilter' && component.inputtype !== 'backendsearchfilter') {
                                //console.log("componentRow main:", component);
                                jdynamiccolumns.push({
                                    columnname: component.label,
                                    displayname: component.displayname
                                });
                                if (component.componentcode === designComponents.COMBOBOX) {
                                    deleteValidation.push({
                                        "smastertablename": component.table.item.stablename,
                                        "smasterprimarykeyname": component.table.valuemember,
                                        "stranstablename": this.props.Login.masterData.realSampleValue.value === SampleType.Masters ? "dynamicmaster" : "registration",
                                        "stranstableforeignkeyname": component.table.valuemember,
                                        //"salertmessage":this.props.Login.masterData.realSampleValue.value === SampleType.Masters? "IDS_DYNAMICMASTER" :"IDS_REGISTRATION",	
                                        "sjsonfieldname": "jsondata",
                                        "nisdynamicmaster": this.props.Login.masterData.realSampleValue.value === SampleType.Masters ? transactionStatus.YES : transactionStatus.NO,
                                        //"nformcode":component.table.item.nformcode,
                                        "nquerybuildertablecode": component.nquerybuildertablecode
                                    });
                                }
                                if (component.hasOwnProperty('child')) {
                                    component.child.map(childData => {
                                        jnumericcolumns.push({
                                            "columnname": component.label,
                                            "displayname": component.displayname,
                                            "foriegntablePK": component.label,
                                            // "ismultilingual": true,
                                            // "conditionstring": " and nformcode in (140) ",
                                            "tablecolumnname": childData.tablecolumnname,
                                            "foriegntablename": "dynamicmaster"
                                        })
                                    })
                                }
                                component.unique && sampleuniquevalidation.push({ [designProperties.LABEL]: component.label });
                                component.unique && samplecombinationunique.push({ [component.label]: { [designProperties.LABEL]: component.displayname, [designProperties.VALUE]: component.label,[designProperties.LISTITEM]: component.inputtype } })



                                if (component.name === undefined || component.name !== 'manualsampleid') {

                                    samplesearchfields.push(component.label)
                                    sampletemplatefields.push({
                                        [designProperties.LABEL]: component.displayname,
                                        [designProperties.VALUE]: component.label,
                                        [designProperties.LISTITEM]: component.inputtype,
                                        [designProperties.PRIMARYKEY]: component.valuemember,
                                        [designProperties.QUERYBUILDERTABLECODE]: component.nquerybuildertablecode,
                                        [designProperties.TABLENAME]: component.table && component.table.item && component.table.item.stablename,
                                        [designProperties.COLUMNNAME]: component.column && component.column.item && component.column.item.columnname,
                                        [designProperties.MULTILINGUAL]: component.isMultiLingual ?"isMultiLingual" :undefined ,
                                        [designProperties.RECORDTYPE]: "dynamic" ,
                                        [designProperties.COLUMNDETAILS]:component
                                    })
                                    if(component.mandatory){
                                        sampletemplatemandatoryfields.push({
                                            [designProperties.LABEL]: component.displayname,
                                            [designProperties.VALUE]: component.label,
                                        })
                                    }

                                    displayFields.push({ [designProperties.LABEL]: component.displayname, [designProperties.VALUE]: component.label, [designProperties.LISTITEM]: component.inputtype })
                                    if (component.mandatory ) {
                                        gridItem.push({ [designProperties.LABEL]: component.displayname, [designProperties.VALUE]: component.label, [designProperties.LISTITEM]: component.inputtype })
                                        if(!(listItem.length >= maximumCount)){
                                        listItem.push({ [designProperties.LABEL]: component.displayname, [designProperties.VALUE]: component.label, [designProperties.LISTITEM]: component.inputtype, mandatory: true })
                                        }
                                        sampleAuditEditable.push(component.label);
                                    } else {
                                        gridMoreItem.push({ [designProperties.LABEL]: component.displayname, [designProperties.VALUE]: component.label, [designProperties.LISTITEM]: component.inputtype });
                                    }
                                    if (component.templatemandatory) {
                                        editable.push({ label: component.label, editableuntill: [] })
                                    }
                                    else {
                                        // editable.push({ label: component.label, editableuntill: [17] })
                                        if (component.readonly)
                                            editable.push({ label: component.label, editableuntill: [] })
                                        else
                                            editable.push({ label: component.label, editableuntill: [transactionStatus.PREREGISTER] })

                                    }

                                }
                                sampleAuditFields.push(component.label);
                                sampleAuditMultilingualFields.push({ [component.label]: component.displayname })
                                if (component.inputtype === 'date') {
                                    sampledatefields.push({ [designProperties.VALUE]: component.label, dateonly: component.dateonly || false });
                                    sampledateconstraints = component.dateConstraintArraySQL ? [...component.dateConstraintArraySQL, ...sampledateconstraints] : sampledateconstraints;
                                }

                                return null;
                            }
                        }
                    }
                })
            }
            )
        )

        displayFields.push({
            [designProperties.LABEL]: this.props.Login.genericLabel["RegistrationDate"] && this.props.Login.genericLabel["RegistrationDate"]["jsondata"]["sdisplayname"],
            [designProperties.VALUE]: 'dregdate'
        });
        const testListFields = { ...this.props.Login.testListFields };

        testListFields.testlistitem.push({
            "1": this.props.Login.genericLabel["AnalyserName"] && this.props.Login.genericLabel["AnalyserName"]["jsondata"]["sdisplayname"],
            "2": "AnalyserName"
        })
    
        //Below commented code only for NFC
    //     if(!(listItem.length >= maximumCount)){
    //     listItem.push({
    //         [designProperties.LABEL]: this.props.Login.genericLabel["TestCount"] && this.props.Login.genericLabel["TestCount"]["jsondata"]["sdisplayname"],
    //         [designProperties.VALUE]: 'ntestcount'  
    //     })
    // }

        let obj = {
            sampledisplayfields: displayFields,
            samplelistitem: listItem,
            samplegriditem: gridItem,
            samplegridmoreitem: gridMoreItem,
            subsamplelistitem,
            sampledatefields,
            subsampledatefields,
            samplesearchfields,
            subsamplesearchfields,
            testdatefields,
            sampledateconstraints,
            subsampledateconstraints,
            samplecombinationunique,
            testListFields,
            deleteValidation,samplefilteritem:[]
        }


        sampleAuditFields.push("dregdate", "stransdisplaystatus");
        sampleAuditEditable.push("stransdisplaystatus");
        subSampleAuditFields.push("stransdisplaystatus");
        subSampleAuditEditable.push("stransdisplaystatus");
        sampleAuditMultilingualFields.push({ "dregdate": this.props.Login.genericLabel && this.props.Login.genericLabel["RegistrationDate"]["jsondata"]["sdisplayname"] },
            { "stransdisplaystatus": this.props.Login.genericLabel && this.props.Login.genericLabel["TransactionStatus"]["jsondata"]["sdisplayname"] });
        subSampleAuditMultilingualFields.push({
            "stransdisplaystatus": this.props.Login.genericLabel && this.props.Login.genericLabel["TransactionStatus"]["jsondata"]["sdisplayname"]//{ "en-US": "Transaction Status", "ru-RU": "Статус транзакции", "tg-TG": "Ҳолати транзаксия" } 
        });
        let SAMPLETEMPLATEFIELDS =[{
                "1": this.props.Login.genericLabel["ARNo"] && this.props.Login.genericLabel["ARNo"]["jsondata"]["sdisplayname"],
                "2": "sarno",
                "3":"textinput"
            },
            {
                "1": this.props.Login.genericLabel["Specification"] && this.props.Login.genericLabel["Specification"]["jsondata"]["sdisplayname"],
                "2": "sspecname",
                "3":"textinput"
            },
            {
                "1": this.props.Login.genericLabel["RegistrationDate"] && this.props.Login.genericLabel["RegistrationDate"]["jsondata"]["sdisplayname"],
                "2": "dregdate",
                "3":"date"
            },
            {
                "1": this.props.Login.genericLabel["TransactionStatus"] && this.props.Login.genericLabel["TransactionStatus"]["jsondata"]["sdisplayname"],
                "2": "stransdisplaystatus",
                "3":"textinput"
            }
            // ,
            // {
            //     "1": this.props.Login.genericLabel["TestCount"] && this.props.Login.genericLabel["TestCount"]["jsondata"]["sdisplayname"],
            //     "2": "ntestcount",
            //     "3":"numeric"
            // }
        ];

    let  SUBSAMPLETEMPLATEFIELDS=[
            {
                "1": this.props.Login.genericLabel["ARNo"] && this.props.Login.genericLabel["ARNo"]["jsondata"]["sdisplayname"],
                "2": "sarno"
            },
            {
                "1": this.props.Login.genericLabel["SubARNo"] && this.props.Login.genericLabel["SubARNo"]["jsondata"]["sdisplayname"],
                "2": "ssamplearno"
            },
            {
                "1": this.props.Login.genericLabel["TransactionStatus"] && this.props.Login.genericLabel["TransactionStatus"]["jsondata"]["sdisplayname"],
                "2": "stransdisplaystatus"
            }
        ];

        let RELEASESAMPLETEMPLATEFIELDS=[
            {
                "1": this.props.Login.genericLabel && this.props.Login.genericLabel["ReleaseNo."]["jsondata"]["sdisplayname"],
                "2": "sreportno"
            }
        ];

        let jsondata = {

            subsamplecombinationunique,
            samplecombinationunique,
            sampletemplatefields: [...RELEASESAMPLETEMPLATEFIELDS, ...SAMPLETEMPLATEFIELDS, ...sampletemplatefields],
            sampletemplatemandatoryfields:[...SAMPLETEMPLATEFIELDS, ...sampletemplatemandatoryfields],
            subsampletemplatefields: [...SUBSAMPLETEMPLATEFIELDS, ...subsampletemplatefields],//: subsamplesearchfields,
            subsampletemplatemandatoryfields: [...SUBSAMPLETEMPLATEFIELDS, ...subsampletemplatemandatoryfields],
            [formCode.SAMPLEREGISTRATION]: {
                ...obj,
                sampleeditable: editable,
                subsampleeditable,
                samplecombinationunique,
                subsamplecombinationunique,
                sampleExportFields,
                subSampleExportFields,

            },
            [formCode.STUDYALLOCATION]: {
                ...obj,
                sampleeditable: editable,
                subsampleeditable,
                samplecombinationunique,
                subsamplecombinationunique,
                sampleExportFields,
                subSampleExportFields,

            },
            // ALPD-4914 Added codes for scheduler configuration screen
            [formCode.SCHEDULERCONFIGURATION]: {
                ...obj,
                sampleeditable: editable,
                subsampleeditable,
                samplecombinationunique,
                subsamplecombinationunique,
                sampleExportFields,
                subSampleExportFields,

            },
            [formCode.RESULTENTRY]: { ...obj, },
            [formCode.APPROVAL]: { ...obj, },
            [formCode.JOBALLOCATION]: {
                ...obj,
                samplegriditem: [
                    ...obj.samplegriditem,
                    {
                        "1": this.props.Login.genericLabel["Section"] && this.props.Login.genericLabel["Section"]["jsondata"]["sdisplayname"],
                        "2": "Section"
                    },
                ],
                samplesearchfields: [
                    ...obj.samplesearchfields,
                    "Section"
                ],
                subsamplesearchfields: [
                    ...obj.subsamplesearchfields,
                    "ssectionname"
                ],    

                testgriditem: [
                    {
                        "1": this.props.Login.genericLabel["TestSynonym"] && this.props.Login.genericLabel["TestSynonym"]["jsondata"]["sdisplayname"],
                        "2": "stestsynonym"
                    },
                    {

                        "1": this.props.Login.genericLabel["Section"] && this.props.Login.genericLabel["Section"]["jsondata"]["sdisplayname"],
                        "2": "ssectionname"
                    },
                    {
                        "1": this.props.Login.genericLabel["Technique"] && this.props.Login.genericLabel["Technique"]["jsondata"]["sdisplayname"],
                        "2": "Technique"
                    },
                    {
                        "1": this.props.Login.genericLabel["Users"] && this.props.Login.genericLabel["Users"]["jsondata"]["sdisplayname"],
                        "2": "Users"
                    },
                    {
                        "1": this.props.Login.genericLabel && this.props.Login.genericLabel["InstrumentCategory"]["jsondata"]["sdisplayname"],
                        "2": "InstrumentCategory"
                    },
                    {
                        "1": this.props.Login.genericLabel && this.props.Login.genericLabel["InstrumentName"]["jsondata"]["sdisplayname"],
                        "2": "InstrumentName"
                    },
                    {
                        "1": this.props.Login.genericLabel && this.props.Login.genericLabel["InstrumentId"]["jsondata"]["sdisplayname"],
                        "2": "InstrumentId"
                    }
                ],
                samplelistitem: [
                    ...obj.samplelistitem,
                    {
                        "1": this.props.Login.genericLabel && this.props.Login.genericLabel["Section"]["jsondata"]["sdisplayname"],
                        "2": "Section"
                    }
                    //Below commented code only for NFC
                    // ,
                    // {
                    //     [designProperties.LABEL]: this.props.Login.genericLabel["TestCount"] && this.props.Login.genericLabel["TestCount"]["jsondata"]["sdisplayname"],
                    //     [designProperties.VALUE]: 'ntestcount'  
                    // }
                ],
                subsamplelistitem: [
                    ...obj.subsamplelistitem,
                    {

                        "1": this.props.Login.genericLabel && this.props.Login.genericLabel["Section"]["jsondata"]["sdisplayname"],
                        "2": "ssectionname"
                    },
                ],
                testdisplayfields: [
                    {

                        "1": this.props.Login.genericLabel && this.props.Login.genericLabel["TestSynonym"]["jsondata"]["sdisplayname"],
                        "2": "stestsynonym"
                    },
                    {

                        "1": this.props.Login.genericLabel && this.props.Login.genericLabel["Section"]["jsondata"]["sdisplayname"],
                        "2": "ssectionname"
                    },
                    {
                        "1": this.props.Login.genericLabel && this.props.Login.genericLabel["Technique"]["jsondata"]["sdisplayname"],
                        "2": "Technique"
                    },
                    {

                        "1": this.props.Login.genericLabel && this.props.Login.genericLabel["Users"]["jsondata"]["sdisplayname"],
                        "2": "Users"
                    },
                    {

                        "1": this.props.Login.genericLabel && this.props.Login.genericLabel["InstrumentCategory"]["jsondata"]["sdisplayname"],
                        "2": "InstrumentCategory"
                    },
                    {
                        "1": this.props.Login.genericLabel && this.props.Login.genericLabel["InstrumentName"]["jsondata"]["sdisplayname"],
                        "2": "InstrumentName"
                    },
                    {
                        "1": this.props.Login.genericLabel && this.props.Login.genericLabel["InstrumentId"]["jsondata"]["sdisplayname"],
                        "2": "InstrumentId"
                    }
                ],
                testgridmoreitem: [
                    {
                        "1": this.props.Login.genericLabel && this.props.Login.genericLabel["UserStartDate"]["jsondata"]["sdisplayname"],
                        "2": "UserStartDate"
                    },
                    {
                        "1": this.props.Login.genericLabel && this.props.Login.genericLabel["UserEndDate"]["jsondata"]["sdisplayname"],
                        "2": "UserEndDate"
                    },
                    {
                        "1": this.props.Login.genericLabel && this.props.Login.genericLabel["UserDuration"]["jsondata"]["sdisplayname"],
                        "2": "UserDuration"
                    },
                    {
                        "1": this.props.Login.genericLabel && this.props.Login.genericLabel["InstrumentStartDate"]["jsondata"]["sdisplayname"],
                        "2": "InstrumentStartDate"
                    },
                    {
                        "1": this.props.Login.genericLabel && this.props.Login.genericLabel["InstrumentEndDate"]["jsondata"]["sdisplayname"],
                        "2": "InstrumentEndDate"
                    },
                    {
                        "1": this.props.Login.genericLabel && this.props.Login.genericLabel["InstrumentDuration"]["jsondata"]["sdisplayname"],
                        "2": "InstrumentDuration"
                    },
                    {
                        "1": this.props.Login.genericLabel && this.props.Login.genericLabel["Comments"]["jsondata"]["sdisplayname"],
                        "2": "Comments"
                    }
                ]

            },
            [formCode.MYJOBS]: { ...obj, },
            [formCode.WORKLIST]: { ...obj, },
            [formCode.BATCHCREATION]: {

                samplegriditem: [
                    {
                        "1": this.props.Login.genericLabel && this.props.Login.genericLabel["ARNo"]["jsondata"]["sdisplayname"],
                        "2": "sarno"
                    },
                    ...obj.samplegriditem,

                ],

                subsamplelistitem: [{
                    "1": this.props.Login.genericLabel && this.props.Login.genericLabel["SubARNo"]["jsondata"]["sdisplayname"],
                    "2": "ssamplearno"
                },
                ...obj.subsamplelistitem,
                ],
                ...obj,
            },
            [formCode.TESTWISEMYJOBS]: { ...obj, },
            [formCode.RELEASE]: {
                ...obj,
                subsamplelistitem: [{
                    "1": this.props.Login.genericLabel && this.props.Login.genericLabel["SubARNo"]["jsondata"]["sdisplayname"],
                    "2": "ssamplearno"
                },
                ...obj.subsamplelistitem],
                sampledisplayfields: [{
                    "1": this.props.Login.genericLabel && this.props.Login.genericLabel["ReleaseNo."]["jsondata"]["sdisplayname"],
                    "2": "sreportno"
                }, ...obj.sampledisplayfields],
                samplegriditem: [{
                    "1": this.props.Login.genericLabel && this.props.Login.genericLabel["ReleaseNo."]["jsondata"]["sdisplayname"],
                    "2": "sreportno"
                }, ...obj.samplegriditem]
                //Below commented code only for NFC
                //     ,
                // {
                //     "1": this.props.Login.genericLabel["TestCount"] && this.props.Login.genericLabel["TestCount"]["jsondata"]["sdisplayname"],
                //     "2": "ntestcount"
                // }
            },
            sampleAuditEditable,
            sampleAuditFields,
            sampleAuditMultilingualFields,
            subSampleAuditEditable,
            subSampleAuditFields,
            subSampleAuditMultilingualFields,
            deleteValidation,
            sampletemplatemandatory
        }
        return jsondata;
    }

    getStabilityJsondata= (templatedata) => {
        let maximumCount=parseInt(this.props.Login.settings && this.props.Login.settings['60']);
        let displayFields = [];
        let listItem = [ ]
        let gridItem = [];
        let gridMoreItem = []
        let editable = []
        let subsampleeditable = [];
        let subsamplelistitem = [];
        let sampledatefields = [];
        let sampledateconstraints = [];
        let subsampledatefields = [];
        let subsampledateconstraints = [];
        let samplesearchfields = ["dregdate", "sarno", "stransdisplaystatus", "sspecname"];
        let subsamplesearchfields = ["sarno", "ssamplearno", "stransdisplaystatus"];
        let sampletemplatefields = [];
        let subsampletemplatefields = [];
        let sampleuniquevalidation = [];
        let subsampleuniquevalidation = [];
        let jdynamiccolumns = [];
        let jnumericcolumns = [];
        let samplecombinationunique = [];
        let subsamplecombinationunique = [];
        let sampleAuditFields = [];
        let sampleAuditEditable = [];
        let sampleAuditMultilingualFields = [];
        let subSampleAuditFields = [];
        let subSampleAuditEditable = [];
        let subSampleAuditMultilingualFields = [];
        let deleteValidation = [];
        let sampletemplatemandatoryfields = [];
        let subsampletemplatemandatoryfields = [];

        const sampleExportFields = []
        const subSampleExportFields = []
        const sampletemplatemandatory = []
    
        this.state.selectedRecord.nsubsampletemplatecode && this.state.selectedRecord.nsubsampletemplatecode.item.jsondata.map(row =>
            row.children && row.children.map(column => {
                column.children && column.children.map(component => {
                    if (component.hasOwnProperty('children')) {
                        component.children.map(componentRow => {
                            if (componentRow.isExportField) {
                                subSampleExportFields.push(componentRow.label)
                            }
                            componentRow.unique && subsampleuniquevalidation.push({ [designProperties.LABEL]: componentRow.label });
                            componentRow.unique && subsamplecombinationunique.push({ [componentRow.label]: { [designProperties.LABEL]: componentRow.displayname, [designProperties.VALUE]: componentRow.label } })
                            subsamplesearchfields.push(componentRow.label);

                            subsampletemplatefields.push({
                                [designProperties.LABEL]: componentRow.displayname,
                                [designProperties.VALUE]: componentRow.label,
                                [designProperties.PRIMARYKEY]: componentRow.valuemember,
                                [designProperties.QUERYBUILDERTABLECODE]: componentRow.nquerybuildertablecode
                            })
                            if(componentRow.mandatory){
                                subsampletemplatemandatoryfields.push({
                                    [designProperties.LABEL]: componentRow.displayname,
                                    [designProperties.VALUE]: componentRow.label,
                            })
                        }
                            if (componentRow.componentcode === designComponents.COMBOBOX) {
                                deleteValidation.push({
                                    "smastertablename": componentRow.table.item.stablename,
                                    "smasterprimarykeyname": componentRow.table.valuemember,
                                    "stranstablename": this.props.Login.masterData.realSampleValue.value === SampleType.Masters ? "dynamicmaster" : "stbregistrationsample",
                                    "stranstableforeignkeyname": componentRow.table.valuemember,
                                    "sjsonfieldname": "jsondata",
                                    "nisdynamicmaster": this.props.Login.masterData.realSampleValue.value === SampleType.Masters ? transactionStatus.YES : transactionStatus.NO,
                                    "nquerybuildertablecode": componentRow.nquerybuildertablecode
                                });
                            }
                            subSampleAuditFields.push(componentRow.label);
                            subSampleAuditMultilingualFields.push({ [componentRow.label]: componentRow.displayname });

                            if (componentRow.mandatory) {
                                subSampleAuditEditable.push(componentRow.label);
                            }

                            if (componentRow.readonly)
                                subsampleeditable.push({ label: componentRow.label, editableuntill: [] })
                            else
                                subsampleeditable.push({ label: componentRow.label, editableuntill: [transactionStatus.PREREGISTER] })

                            if (componentRow.inputtype === 'date') {
                                subsampledatefields.push({ [designProperties.VALUE]: componentRow.label, dateonly: componentRow.dateonly || false });
                                subsampledateconstraints = componentRow.dateConstraintArraySQL ? [...componentRow.dateConstraintArraySQL, ...subsampledateconstraints] : subsampledateconstraints;
                            }
                            subsamplelistitem.push({ [designProperties.LABEL]: componentRow.displayname, [designProperties.VALUE]: componentRow.label, [designProperties.LISTITEM]: componentRow.inputtype })
                        }
                        )
                    } else {

                        if (component.templatemandatory) {
                            sampletemplatemandatory.push(component.label)
                        }
                        if (component.isExportField) {
                            subSampleExportFields.push(component.label)
                        }
                        component.unique && subsampleuniquevalidation.push({ [designProperties.LABEL]: component.label });
                        component.unique && subsamplecombinationunique.push({ [component.label]: { [designProperties.LABEL]: component.displayname, [designProperties.VALUE]: component.label } })
                        subsamplesearchfields.push(component.label);

                        subsampletemplatefields.push({
                            [designProperties.LABEL]: component.displayname,
                            [designProperties.VALUE]: component.label,
                            [designProperties.PRIMARYKEY]: component.valuemember,
                            [designProperties.QUERYBUILDERTABLECODE]: component.nquerybuildertablecode
                        })
                        if(component.mandatory){
                            subsampletemplatemandatoryfields.push({
                                [designProperties.LABEL]: component.displayname,
                                [designProperties.VALUE]: component.label,
                        })
                    }
                        if (component.componentcode === designComponents.COMBOBOX) {
                            deleteValidation.push({
                                "smastertablename": component.table.item.stablename,
                                "smasterprimarykeyname": component.table.valuemember,
                                "stranstablename": this.props.Login.masterData.realSampleValue.value === SampleType.Masters ? "dynamicmaster" : "stbregistrationsample",
                                "stranstableforeignkeyname": component.table.valuemember,
                                "sjsonfieldname": "jsondata",
                                "nisdynamicmaster": this.props.Login.masterData.realSampleValue.value === SampleType.Masters ? transactionStatus.YES : transactionStatus.NO,
                                "nquerybuildertablecode": component.nquerybuildertablecode
                            });
                        }
                        subSampleAuditFields.push(component.label);
                        subSampleAuditMultilingualFields.push({ [component.label]: component.displayname });

                        if (component.mandatory) {
                            subSampleAuditEditable.push(component.label);
                        }
                        if (component.readonly)
                            subsampleeditable.push({ label: component.label, editableuntill: [] })
                        else
                            subsampleeditable.push({ label: component.label, editableuntill: [transactionStatus.PREREGISTER] })

                        if (component.inputtype === 'date') {
                            subsampledatefields.push({ [designProperties.VALUE]: component.label, dateonly: component.dateonly || false });
                            subsampledateconstraints = component.dateConstraintArraySQL ? [...component.dateConstraintArraySQL, ...subsampledateconstraints] : subsampledateconstraints;
                        }
                        subsamplelistitem.push({ [designProperties.LABEL]: component.displayname, [designProperties.VALUE]: component.label, [designProperties.LISTITEM]: component.inputtype });
                    }
                })
            })
        )

        templatedata && templatedata.map(row =>
            row.children && row.children.map(column => {
                column.children && column.children.map(component => {
                    if (component.inputtype !== 'frontendsearchfilter' && component.inputtype !== 'backendsearchfilter') {
                        if (component.hasOwnProperty('children')) {
                            if (component.inputtype !== 'frontendsearchfilter' && component.inputtype !== 'backendsearchfilter') {
                                component.children.map(componentRow => {

                                    if (componentRow.templatemandatory) {
                                        sampletemplatemandatory.push(componentRow.label)
                                    }


                                    if (componentRow.isExportField) {
                                        sampleExportFields.push(componentRow.label)
                                    }
                                    jdynamiccolumns.push({
                                        columnname: componentRow.label,
                                        displayname: componentRow.displayname
                                    })
                                    if (componentRow.hasOwnProperty('child')) {
                                        componentRow.child.map(childData => {
                                            jnumericcolumns.push({
                                                "columnname": componentRow.label,
                                                "displayname": componentRow.displayname,
                                                "foriegntablePK": componentRow.label,
                                                "tablecolumnname": childData.tablecolumnname,
                                                "foriegntablename": "dynamicmaster"
                                            })
                                        })
                                    }
                                    if (componentRow.componentcode === designComponents.COMBOBOX) {
                                        deleteValidation.push({
                                            "smastertablename": componentRow.table.item.stablename,
                                            "smasterprimarykeyname": componentRow.table.valuemember,
                                            "stranstablename": this.props.Login.masterData.realSampleValue.value === SampleType.Masters ? "dynamicmaster" : "stbregistration",
                                            "stranstableforeignkeyname": componentRow.table.valuemember,
                                            //"salertmessage":this.props.Login.masterData.realSampleValue.value === SampleType.Masters? "IDS_DYNAMICMASTER" :"IDS_REGISTRATION",	
                                            "sjsonfieldname": "jsondata",
                                            "nisdynamicmaster": this.props.Login.masterData.realSampleValue.value === SampleType.Masters ? transactionStatus.YES : transactionStatus.NO,
                                            //"nformcode":componentRow.table.item.nformcode,
                                            "nquerybuildertablecode": componentRow.nquerybuildertablecode
                                        });
                                    }
                                    componentRow.unique && sampleuniquevalidation.push({ [designProperties.LABEL]: componentRow.label });
                                    componentRow.unique && samplecombinationunique.push({ [componentRow.label]: { [designProperties.LABEL]: componentRow.displayname, [designProperties.VALUE]: componentRow.label } })
                                    if (componentRow.name === undefined || componentRow.name !== 'manualsampleid') {
                                        samplesearchfields.push(componentRow.label)
                                        sampletemplatefields.push({
                                            [designProperties.LABEL]: componentRow.displayname,
                                            [designProperties.VALUE]: componentRow.label,
                                            [designProperties.LISTITEM]: componentRow.inputtype,    
                                            [designProperties.PRIMARYKEY]: componentRow.valuemember,
                                            [designProperties.QUERYBUILDERTABLECODE]: componentRow.nquerybuildertablecode,
                                            [designProperties.TABLENAME]: componentRow.table && componentRow.table.item && componentRow.table.item.stablename,
                                            [designProperties.COLUMNNAME]: componentRow.column && componentRow.column.item &&  componentRow.column.item.columnname,
                                            [designProperties.component]:  componentRow.isMultiLingual ?"isMultiLingual" :undefined ,
                                            [designProperties.RECORDTYPE]: "dynamic"  
                                        })
                                        if(componentRow.mandatory){
                                            sampletemplatemandatoryfields.push({
                                                [designProperties.LABEL]: componentRow.displayname,
                                                [designProperties.VALUE]: componentRow.label,
                                            })
                                        }
                                        displayFields.push({ [designProperties.LABEL]: componentRow.displayname, [designProperties.VALUE]: componentRow.label, [designProperties.LISTITEM]: componentRow.inputtype });

                                        if(!(listItem.length >= maximumCount)){
                                         componentRow.mandatory && 
                                        listItem.push({ [designProperties.LABEL]: componentRow.displayname,
                                             [designProperties.VALUE]: componentRow.label,
                                              [designProperties.LISTITEM]: componentRow.inputtype })
                                        }


                                        if (componentRow.mandatory || componentRow.templatemandatory) {
                                            gridItem.push({ [designProperties.LABEL]: componentRow.displayname, [designProperties.VALUE]: componentRow.label })
                                            sampleAuditEditable.push(componentRow.label);
                                        }
                                        else {
                                            gridMoreItem.push({ [designProperties.LABEL]: componentRow.displayname, [designProperties.VALUE]: componentRow.label, [designProperties.LISTITEM]: componentRow.inputtype });
                                        }
                                        if (componentRow.templatemandatory) {
                                            editable.push({ label: componentRow.label, editableuntill: [] })
                                        }
                                        else {
                                            if (componentRow.readonly)
                                                editable.push({ label: componentRow.label, editableuntill: [] })
                                            else
                                                editable.push({ label: componentRow.label, editableuntill: [transactionStatus.PREREGISTER] })

                                        }
                                    }

                                    sampleAuditFields.push(componentRow.label);
                                    sampleAuditMultilingualFields.push({ [componentRow.label]: componentRow.displayname });
                                    if (componentRow.inputtype === 'date') {
                                        sampledatefields.push({ [designProperties.VALUE]: componentRow.label, dateonly: componentRow.dateonly || false });
                                        sampledateconstraints = componentRow.dateConstraintArraySQL ? [...componentRow.dateConstraintArraySQL, ...sampledateconstraints] : sampledateconstraints;
                                    }




                                    return null;
                                })
                            }
                        }
                        else {
                            if (component.templatemandatory) {
                                sampletemplatemandatory.push(component.label)
                            }
                            if (component.isExportField) {
                                sampleExportFields.push(component.label)
                            }
                            if (component.inputtype !== 'frontendsearchfilter' && component.inputtype !== 'backendsearchfilter') {
                                //console.log("componentRow main:", component);
                                jdynamiccolumns.push({
                                    columnname: component.label,
                                    displayname: component.displayname
                                });
                                if (component.componentcode === designComponents.COMBOBOX) {
                                    deleteValidation.push({
                                        "smastertablename": component.table.item.stablename,
                                        "smasterprimarykeyname": component.table.valuemember,
                                        "stranstablename": this.props.Login.masterData.realSampleValue.value === SampleType.Masters ? "dynamicmaster" : "stbregistration",
                                        "stranstableforeignkeyname": component.table.valuemember,
                                        //"salertmessage":this.props.Login.masterData.realSampleValue.value === SampleType.Masters? "IDS_DYNAMICMASTER" :"IDS_REGISTRATION",	
                                        "sjsonfieldname": "jsondata",
                                        "nisdynamicmaster": this.props.Login.masterData.realSampleValue.value === SampleType.Masters ? transactionStatus.YES : transactionStatus.NO,
                                        //"nformcode":component.table.item.nformcode,
                                        "nquerybuildertablecode": component.nquerybuildertablecode
                                    });
                                }
                                if (component.hasOwnProperty('child')) {
                                    component.child.map(childData => {
                                        jnumericcolumns.push({
                                            "columnname": component.label,
                                            "displayname": component.displayname,
                                            "foriegntablePK": component.label,
                                            // "ismultilingual": true,
                                            // "conditionstring": " and nformcode in (140) ",
                                            "tablecolumnname": childData.tablecolumnname,
                                            "foriegntablename": "dynamicmaster"
                                        })
                                    })
                                }
                                component.unique && sampleuniquevalidation.push({ [designProperties.LABEL]: component.label });
                                component.unique && samplecombinationunique.push({ [component.label]: { [designProperties.LABEL]: component.displayname, [designProperties.VALUE]: component.label } })
                                if (component.name === undefined || component.name !== 'manualsampleid') {
                                    samplesearchfields.push(component.label)
                                    sampletemplatefields.push({
                                        [designProperties.LABEL]: component.displayname,
                                        [designProperties.VALUE]: component.label,
                                        [designProperties.LISTITEM]: component.inputtype,
                                        [designProperties.PRIMARYKEY]: component.valuemember,
                                        [designProperties.QUERYBUILDERTABLECODE]: component.nquerybuildertablecode,
                                        [designProperties.TABLENAME]: component.table && component.table.item && component.table.item.stablename,
                                        [designProperties.COLUMNNAME]: component.column && component.column.item && component.column.item.columnname,
                                        [designProperties.MULTILINGUAL]: component.isMultiLingual ?"isMultiLingual" :undefined ,
                                        [designProperties.RECORDTYPE]: "dynamic"  
                                    })
                                    if(component.mandatory){
                                        sampletemplatemandatoryfields.push({
                                            [designProperties.LABEL]: component.displayname,
                                            [designProperties.VALUE]: component.label,
                                        })
                                    }

                                    displayFields.push({ [designProperties.LABEL]: component.displayname, [designProperties.VALUE]: component.label, [designProperties.LISTITEM]: component.inputtype })
                                    if (component.mandatory ) {
                                        gridItem.push({ [designProperties.LABEL]: component.displayname, [designProperties.VALUE]: component.label, [designProperties.LISTITEM]: component.inputtype })
                                        if(!(listItem.length >= maximumCount)){
                                        listItem.push({ [designProperties.LABEL]: component.displayname, [designProperties.VALUE]: component.label, [designProperties.LISTITEM]: component.inputtype, mandatory: true })
                                        }
                                        sampleAuditEditable.push(component.label);
                                    } else {
                                        gridMoreItem.push({ [designProperties.LABEL]: component.displayname, [designProperties.VALUE]: component.label, [designProperties.LISTITEM]: component.inputtype });
                                    }
                                    if (component.templatemandatory) {
                                        editable.push({ label: component.label, editableuntill: [] })
                                    }
                                    else {
                                        // editable.push({ label: component.label, editableuntill: [17] })
                                        if (component.readonly)
                                            editable.push({ label: component.label, editableuntill: [] })
                                        else
                                            editable.push({ label: component.label, editableuntill: [transactionStatus.PREREGISTER] })

                                    }

                                }
                                sampleAuditFields.push(component.label);
                                sampleAuditMultilingualFields.push({ [component.label]: component.displayname })
                                if (component.inputtype === 'date') {
                                    sampledatefields.push({ [designProperties.VALUE]: component.label, dateonly: component.dateonly || false });
                                    sampledateconstraints = component.dateConstraintArraySQL ? [...component.dateConstraintArraySQL, ...sampledateconstraints] : sampledateconstraints;
                                }

                                return null;
                            }
                        }
                    }
                })
            }
            )
        )

        const testListFields = { ...this.props.Login.testListFields };


        let obj = {
            sampledisplayfields: displayFields,
            samplelistitem: listItem,
            samplegriditem: gridItem,
            samplegridmoreitem: gridMoreItem,
            subsamplelistitem,
            sampledatefields,
            subsampledatefields,
            samplesearchfields,
            subsamplesearchfields,
            sampledateconstraints,
            subsampledateconstraints,
            samplecombinationunique,
            testListFields,
            deleteValidation,samplefilteritem:[]
        }

        let jsondata = {
            subsamplecombinationunique,
            samplecombinationunique,
            sampletemplatefields: [  ...sampletemplatefields],
            sampletemplatemandatoryfields:[ ...sampletemplatemandatoryfields],
            subsampletemplatefields: [ ...subsampletemplatefields],
            subsampletemplatemandatoryfields: [ ...subsampletemplatemandatoryfields],
           
            [formCode.STUDYALLOCATION]: {
                ...obj,
                sampleeditable: editable,
                subsampleeditable,
                samplecombinationunique,
                subsamplecombinationunique,
                sampleExportFields,
                subSampleExportFields,

            },
            sampleAuditEditable,
            sampleAuditFields,
            sampleAuditMultilingualFields,
            subSampleAuditEditable,
            subSampleAuditFields,
            subSampleAuditMultilingualFields,
            deleteValidation,
            sampletemplatemandatory
        }
        return jsondata;
    }


    onChangeToggle = (event, dataItem, field, dataIndex, formCode, operation) => {

        let designData = this.props.Login.designData;
        let dataResult = this.props.Login.dataResult;
        if (operation === 'configureaudit') {
            designData = this.props.Login.auditFieldDesignData;
            dataResult = this.props.Login.auditFieldDataResult;
        }

        let tableName = "registration";
        if (this.props.Login.masterData.realSampleValue.value === SampleType.Masters) {
            tableName = "dynamicmaster";
        }

        if (this.props.Login.masterData.realSampleValue.value === SampleType.GOODSIN) {
            tableName = "goodsinsample"
        }

        //Added by sonia on 11th NOV 2024 for jira id:ALPD-5025
        if (this.props.Login.masterData.realSampleValue.value === SampleType.PROTOCOL) {
            tableName = "protocol"
        }


        if (formCode === undefined) {
            dataResult[dataIndex][field] = event.target.checked;
            if (event.target.checked) {
                designData[field].splice(dataIndex, 0, dataItem.realData)

            } else {
                designData[field].splice(designData[field].findIndex(x => x[designProperties.VALUE] === dataItem.label), 1)
            }
        }
        else {
            //dataResult[formCode][dataIndex][field] = event.target.checked;
            if (event.target.checked) {
                let maximumCount=parseInt(this.props.Login.settings && this.props.Login.settings['60']);
                if (field === 'samplelistitem' && designData[formCode][field].length >= maximumCount) {
                    return toast.warn(this.props.intl.formatMessage({ id: "IDS_MAXIMUMSELECTIONEXCEEDS" }))
                }
                else {

                    if (field === 'sampledisplayfields') {
                        dataResult[formCode][dataIndex][field] = event.target.checked;
                        designData[formCode]['samplesearchfields'].splice(dataIndex, 0, dataItem.label);
                        designData[formCode][field].splice(dataIndex, 0, dataItem.realData);
                        if(formCode === 43 && dataResult[244])
                        {
                            dataResult[244][dataIndex][field] = event.target.checked;
                            designData[244]['samplesearchfields'].splice(dataIndex, 0, dataItem.label);
                            designData[244][field].splice(dataIndex, 0, dataItem.realData);
                        }

                    }
                    else if (field === 'sampleauditfields') {
                        dataResult[formCode][tableName][dataIndex][field] = event.target.checked;
                        if (designData[formCode][tableName]['sampleauditfields'].indexOf(dataItem.realData[designProperties.VALUE]) === -1) {
                            designData[formCode][tableName]['sampleauditfields'].splice(dataIndex, 0, dataItem.realData[designProperties.VALUE]);
                            designData[formCode][tableName]['multilingualfields'].splice(dataIndex, 0, { [dataItem.realData[designProperties.VALUE]]: dataItem.realData[designProperties.LABEL] });
                        }
                    }
                    else if (field === 'sampleauditeditfields') {
                        dataResult[formCode][tableName][dataIndex]["sampleauditfields"] = event.target.checked;
                        dataResult[formCode][tableName][dataIndex]["sampleauditeditfields"] = event.target.checked;
                        if (designData[formCode][tableName]['sampleauditeditfields'].indexOf(dataItem.realData[designProperties.VALUE]) === -1) {

                            designData[formCode][tableName][field].splice(dataIndex, 0, dataItem.realData[designProperties.VALUE]);
                            if (designData[formCode][tableName]['sampleauditfields'].indexOf(dataItem.realData[designProperties.VALUE]) === -1) {
                                designData[formCode][tableName]['sampleauditfields'].splice(dataIndex, 0, dataItem.realData[designProperties.VALUE]);
                                designData[formCode][tableName]['multilingualfields'].splice(dataIndex, 0, { [dataItem.realData[designProperties.VALUE]]: dataItem.realData[designProperties.LABEL] });
                            }
                        }
                    }
                    else if (field === 'subsampleauditfields') {
                        dataResult[formCode]['registrationsample'][dataIndex][field] = event.target.checked;
                        if (designData[formCode]['registrationsample']['subsampleauditfields'].indexOf(dataItem.realData[designProperties.VALUE]) === -1) {
                            designData[formCode]['registrationsample']['subsampleauditfields'].splice(dataIndex, 0, dataItem.realData[designProperties.VALUE]);
                            designData[formCode]['registrationsample']['multilingualfields'].splice(dataIndex, 0, { [dataItem.realData[designProperties.VALUE]]: dataItem.realData[designProperties.LABEL] });
                        }
                    }
                    else if (field === 'subsampleauditeditfields') {
                        dataResult[formCode]['registrationsample'][dataIndex]["subsampleauditfields"] = event.target.checked;
                        dataResult[formCode]['registrationsample'][dataIndex]["subsampleauditeditfields"] = event.target.checked;
                        if (designData[formCode]['registrationsample']['subsampleauditeditfields'].indexOf(dataItem.realData[designProperties.VALUE]) === -1) {

                            designData[formCode]['registrationsample'][field].splice(dataIndex, 0, dataItem.realData[designProperties.VALUE]);
                            if (designData[formCode]['registrationsample']['subsampleauditfields'].indexOf(dataItem.realData[designProperties.VALUE]) === -1) {
                                designData[formCode]['registrationsample']['subsampleauditfields'].splice(dataIndex, 0, dataItem.realData[designProperties.VALUE]);
                                designData[formCode]['registrationsample']['multilingualfields'].splice(dataIndex, 0, { [dataItem.realData[designProperties.VALUE]]: dataItem.realData[designProperties.LABEL] });
                            }
                        }
                    }
                    else if (field === 'samplefilteritem') {
                         if(dataResult[formCode][dataIndex]['sampledisplayfields']){
                            let maximumCount=parseInt(this.props.Login.settings && this.props.Login.settings['55']);
                            if(designData[formCode]['samplefilteritem'].length>=maximumCount){
                                toast.warn(this.props.intl.formatMessage({ id: "IDS_MAXIMUMSELECTIONFORTHISFILTERITEM"})+maximumCount)  
                            }else{
                                let index=designData['sampletemplatefields'].findIndex(x => x[designProperties.VALUE] === dataItem.realData[designProperties.VALUE])
                                dataResult[formCode][dataIndex][field] = event.target.checked;
                                designData[formCode]['samplefilteritem'].push(designData['sampletemplatefields'][index]);
                                if(designData[244]){
                                    designData[244]['samplefilteritem'].push(designData['sampletemplatefields'][index]);
                                }
                            }
                         }else{
                            toast.warn(this.props.intl.formatMessage({ id: "IDS_ENABLEDISPLAYFIELDSFORTHISFIELD" })) 
                         }
                    }
                    else {
                        dataResult[formCode][dataIndex][field] = event.target.checked;
                        designData[formCode][field].splice(dataIndex, 0, dataItem.realData);
                        if(formCode === 43 && dataResult[244]){
                            dataResult[244][dataIndex][field] = event.target.checked;
                            designData[244][field].splice(dataIndex, 0, dataItem.realData);
                        }
                    }
                }
            }
            else {

                if (field === 'sampledisplayfields') {
                    dataResult[formCode][dataIndex][field] = event.target.checked;
                    
                    designData[formCode][field].splice(designData[formCode][field].findIndex(x => x[designProperties.VALUE] === dataItem.label), 1)

                    const index = designData[formCode]['samplesearchfields'].findIndex(x => x === dataItem.realData[designProperties.VALUE]);
			//ALPD-4941--Vignesh R(09-12-2024)---Sample configuration screen Audit
                     if(formCode === 43 && dataResult[244]){
                        dataResult[244][dataIndex][field] = event.target.checked;
                        designData[244][field].splice(designData[formCode][field].findIndex(x => x[designProperties.VALUE] === dataItem.label), 1)
                    }
    
                    if (index !== -1) {
                        designData[formCode]['samplesearchfields'].splice(index, 1);
                        if(formCode === 43 && dataResult[244])
                        {
                            const index1 = designData[244]['samplesearchfields'].findIndex(x => x === dataItem.realData[designProperties.VALUE]);

                            designData[244]['samplesearchfields'].splice(index1, 1);
                        }

                    }
                }
                else if (field === 'sampleauditfields') {
                    dataResult[formCode][tableName][dataIndex][field] = event.target.checked;
                    const index = designData[formCode][tableName][field].findIndex(x => x === dataItem.realData[designProperties.VALUE]);
                    if (index !== -1) {
                        designData[formCode][tableName][field].splice(index, 1);
                    }

                    const index1 = designData[formCode][tableName]['multilingualfields'].map(object => Object.keys(object)[0]).indexOf(dataItem.label);
                    if (index1 !== -1) {
                        designData[formCode][tableName]['multilingualfields'].splice(index1, 1);
                    }

                    const index3 = designData[formCode][tableName]["sampleauditeditfields"].findIndex(x => x === dataItem.realData[designProperties.VALUE]);
                    if (index3 !== -1) {
                        designData[formCode][tableName]["sampleauditeditfields"].splice(index3, 1)
                    }
                    dataResult[formCode][tableName][dataIndex]["sampleauditeditfields"] = event.target.checked;
                }
                else if (field === 'sampleauditeditfields') {
                    dataResult[formCode][tableName][dataIndex][field] = event.target.checked;
                    const index4 = designData[formCode][tableName][field].findIndex(x => x === dataItem.realData[designProperties.VALUE]);
                    if (index4 !== -1) {
                        designData[formCode][tableName][field].splice(index4, 1);
                    }
                }
                else if (field === 'subsampleauditfields') {
                    dataResult[formCode]['registrationsample'][dataIndex][field] = event.target.checked;
                    const index1 = designData[formCode]['registrationsample'][field].findIndex(x => x === dataItem.realData[designProperties.VALUE]);
                    if (index1 !== -1) {
                        designData[formCode]["registrationsample"][field].splice(index1, 1)
                    }

                    const index2 = designData[formCode]["registrationsample"]['multilingualfields'].map(object => Object.keys(object)[0]).indexOf(dataItem.label);
                    if (index2 !== -1) {
                        designData[formCode]["registrationsample"]['multilingualfields'].splice(index2, 1);
                    }
                    const index3 = designData[formCode]['registrationsample']["subsampleauditeditfields"].findIndex(x => x === dataItem.realData[designProperties.VALUE]);
                    if (index3 !== -1) {
                        designData[formCode]["registrationsample"]["subsampleauditeditfields"].splice(index3, 1)
                    }
                    dataResult[formCode]["registrationsample"][dataIndex]["subsampleauditeditfields"] = event.target.checked;
                }
                else if (field === 'subsampleauditeditfields') {
                    dataResult[formCode]['registrationsample'][dataIndex][field] = event.target.checked;
                    const index1 = designData[formCode]['registrationsample'][field].findIndex(x => x === dataItem.realData[designProperties.VALUE]);
                    if (index1 !== -1) {
                        designData[formCode]["registrationsample"][field].splice(index1, 1);
                    }
                }
                else {
                    dataResult[formCode][dataIndex][field] = event.target.checked;
                    designData[formCode][field].splice(designData[formCode][field].findIndex(x => x[designProperties.VALUE] === dataItem.realData[designProperties.VALUE]), 1)

                    if(formCode === 43 && dataResult[244]){
                        dataResult[244][dataIndex][field] = event.target.checked;
                        designData[244][field].splice(designData[244][field].findIndex(x => x[designProperties.VALUE] === dataItem.realData[designProperties.VALUE]), 1)
                    }

                }
            }
        }

        let data = { designData, dataResult };
        if (operation === 'configureaudit') {
            data = {
                auditFieldDesignData: designData,
                auditFieldDataResult: dataResult
            };
        }
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { ...data }
        }
        this.props.updateStore(updateInfo);

    }
    onApproveSaveClick = () => {
        this.onApproveClick();
    }

    onSaveClick = (saveType, formRef) => {

        // console.log("save:", this.props.Login.masterData.realRegSubTypeValue);
        //console.log("data:", this.props.Login.editFieldDesignData)
        let inputData = [];

        let operation = this.props.Login.operation;
        //const needsubsample = this.props.Login.masterData.realRegSubTypeValue ? this.props.Login.masterData.realRegSubTypeValue.item.nneedsubsample : false;
        //Added by sonia on 11th NOV 2024 for jira id:ALPD-5025
        const needsubsample = this.props.Login.masterData.realSampleValue.value === SampleType.GOODSIN 
        || this.props.Login.masterData.realSampleValue.value === SampleType.PROTOCOL ? false 
        : this.props.Login.masterData.realRegSubTypeValue ? this.props.Login.masterData.realRegSubTypeValue.item.nneedsubsample : false;

        if (operation === 'Approve') {
            this.onApproveClick()
        } 
        else if (operation === 'configureunique') {
            this.configureunique();
        }
        else if (operation === 'configurereleasesamplefilter') {
                this.configurereportfiltertype();
        }
        else {
            if (operation === 'configure' || operation === 'configuresubsample') {
                inputData = {
                    designtemplatemapping: {
                        ndesigntemplatemappingcode: this.props.Login.masterData.selectedDesignTemplateMapping.ndesigntemplatemappingcode,
                        jsondataobj: this.props.Login.designData
                    },
                    userinfo: this.props.Login.userInfo
                }
                operation = 'configure'
            }
            else if (operation === 'configureedit' || operation === 'configuresubsampleedit') {

                let designData = this.props.Login.editFieldDesignData;
                let formCodeArray = Object.keys(this.state.selectedRecord);
                //Added by sonia on 11th NOV 2024 for jira id:ALPD-5025
                if(this.props.Login.masterData.realSampleValue.value === SampleType.PROTOCOL){                    
                        const data = this.state.selectedRecord;    
                        let editableData = designData['editable'];
                        Object.keys(data).map(label => {
                            const editableuntil = [];
                            data[label].map(statusItem =>
                                editableuntil.push(statusItem.value)
                            )
                            const index = editableData.findIndex(item => item.label === label);
                            if (index === -1) {
                                editableData.push({ "label": label, "editableuntill": editableuntil });
                            }
                            else {
                                editableData[index] = { "label": label, "editableuntill": editableuntil };
                            }
                        })

                
                }else {
                formCodeArray.forEach(formCode => {
                    const data = this.state.selectedRecord[formCode];

                    let editableData = designData[formCode]['sampleeditable'];;
                    if (operation === 'configuresubsampleedit') {
                        editableData = designData[formCode]['subsampleeditable'];;
                    }

                    Object.keys(data).map(label => {
                        const editableuntil = [];
                        data[label].map(statusItem =>
                            editableuntil.push(statusItem.value)
                        )
                        const index = editableData.findIndex(item => item.label === label);
                        if (index === -1) {
                            editableData.push({ "label": label, "editableuntill": editableuntil });
                        }
                        else {
                            editableData[index] = { "label": label, "editableuntill": editableuntil };
                        }
                        //designData[formCode]['sampleeditable'].push({"label":label, "editableuntill":editableuntil});
                    })

                })
                }

                
                inputData = {
                    designtemplatemapping: {
                        ndesigntemplatemappingcode: this.props.Login.masterData.selectedDesignTemplateMapping.ndesigntemplatemappingcode,
                        jsondataobj: designData
                    },
                    userinfo: this.props.Login.userInfo
                }

                operation = 'configure';
            }
            // else if (operation === 'configureunique') {
            //     let designData = this.props.Login.designData;
            //     //  let formCodeArray = Object.keys(this.state.selectedRecord);
            //     const dataList = []
            //     const dataListsubsample = []
            //     this.props.Login.dataList.map(x => {
            //         if (Object.keys(x).length !== 0) {
            //             dataList.push(x);
            //         }
            //     })
            //     if (this.props.Login.masterData.realSampleValue.value === SampleType.Masters) {
            //         designData['mastercombinationunique'] = dataList
            //     }else  if(this.props.Login.masterData.realSampleValue.value === SampleType.GOODSIN) {
            //         designData['combinationunique'] = dataList
            //     } 
            //     else {
            //         designData['samplecombinationunique'] = dataList
            //         designData[formCode.SAMPLEREGISTRATION]['samplecombinationunique'] = dataList
            //         this.props.Login.dataListSubSample.map(x => {
            //             if (Object.keys(x).length !== 0) {
            //                 dataListsubsample.push(x);
            //             }
            //         })
            //         designData['subsamplecombinationunique'] = dataListsubsample
            //         designData[formCode.SAMPLEREGISTRATION]['subsamplecombinationunique'] = dataListsubsample
            //     }



            //     inputData = {
            //         designtemplatemapping: {
            //             ndesigntemplatemappingcode: this.props.Login.masterData.selectedDesignTemplateMapping.ndesigntemplatemappingcode,
            //             jsondataobj: designData
            //         },
            //         userinfo: this.props.Login.userInfo
            //     }

            //     operation = 'configure';
            // }
            else if (operation === 'configureexportfields') {
                let designData = this.props.Login.designData;

                if (this.props.Login.masterData.realSampleValue.value === SampleType.Masters) {
                    const dataList = []
                    this.props.Login.sampleexportdataResult.master.map(x => {
                        if (x.sampleexportfields === true) {
                            dataList.push(x.realData[designProperties.VALUE]);
                        }
                    })
                    designData['masterexportfields'] = dataList
                }else  if(this.props.Login.masterData.realSampleValue.value === SampleType.GOODSIN){
                    this.props.Login.sampleexportdataResult.master.map(x => {
                    if(x.sampleexportfields === true){                        
                        let checkArray=designData['exportFields'].map(item=>item['2'])
                        if((checkArray.includes(x.realData['2']))=== false) {
                            designData['exportFields'].push(x.realData)
                        }

                    }else{
                        let index=designData['exportFields'].findIndex(y=>y['2']===x.realData['2'])
                        if(index!==-1){
                            designData['exportFields'].splice(index, 1);                           
                        }
                    }                    
                    })   
                } 
                else {
                    const dataList = []
                    this.props.Login.sampleexportdataResult.sample.map(x => {
                        if (x.sampleexportfields === true) {
                            dataList.push(x.realData[designProperties.VALUE]);
                        }
                    })
                    if(this.props.Login.masterData.realSampleValue.value === SampleType.STABILITY){
                    designData[formCode.STUDYALLOCATION]['sampleExportFields'] = dataList
                    const dataListSub = []
                    this.props.Login.sampleexportdataResult.subsample.map(x => {
                        if (x.sampleexportfields === true) {
                            dataListSub.push(x.realData[designProperties.VALUE]);
                        }
                    })
                    designData[formCode.STUDYALLOCATION]['subSampleExportFields'] = dataListSub
                    }else{
                    designData[formCode.SAMPLEREGISTRATION]['sampleExportFields'] = dataList

                    }

                    if(this.props.Login.masterData && this.props.Login.masterData.defaultregsubtype &&
                        this.props.Login.masterData.defaultregsubtype.item && this.props.Login.masterData.defaultregsubtype.item.nneedsubsample ){
                        const dataListSub = []
                            
                        //Added by Vignesh(15-11-2025)-->The subSampleExportFields key was overridden after the export fields were added.
                        designData[formCode.SAMPLEREGISTRATION]['subSampleExportFields']
                             .map(item => dataListSub.push(item));

                            this.props.Login.sampleexportdataResult.subsample.map(x => {
                            if (x.sampleexportfields === true) {
                                dataListSub.push(x.realData[designProperties.VALUE]);
                            }
                        })
                        designData[formCode.SAMPLEREGISTRATION]['subSampleExportFields'] = dataListSub
                    }
                    
                }

                inputData = {
                    designtemplatemapping: {
                        ndesigntemplatemappingcode: this.props.Login.masterData.selectedDesignTemplateMapping.ndesigntemplatemappingcode,
                        jsondataobj: designData
                    },
                    userinfo: this.props.Login.userInfo
                }

                operation = 'configure';
            }
            // else if (operation === 'configurereportfiltertype') {
            //     let designData = this.props.Login.designData;

            //         const dataList = []
            //         this.state.sampleReportFilterTypeData.sample.map(x => {
            //             if (x.samplefiltertypefields === true) {
            //                 dataList.push(x.realData);
            //             }
            //         })
            //         designData[formCode.SAMPLEREGISTRATION]['samplefiltertypefields'] = dataList;
            //         designData[formCode.RELEASE]['samplefiltertypefields'] = dataList;
            //         let isFilterEmpty = checkFilterIsEmptyQueryBuilder(this.props.Login.filterQueryTreeStr);
            //         if(isFilterEmpty){
            //         designData[formCode.RELEASE]['defaultstructure']={
            //             nregsubtypecode:this.props.Login.masterData.realRegSubTypeValue.value,
            //             nsampletypecode:this.props.Login.masterData.realSampleValue.value,
            //             nregtypecode:this.props.Login.masterData.realRegTypeValue.value,
            //             awesomeTree:this.props.Login.awesomeTree,
            //             awesomeConfig:this.props.Login.awesomeConfig}
                   

            //     inputData = {
            //         designtemplatemapping: {
            //             ndesigntemplatemappingcode: this.props.Login.masterData.selectedDesignTemplateMapping.ndesigntemplatemappingcode,
            //             jsondataobj: designData
            //         },
            //         userinfo: this.props.Login.userInfo
            //     }

            //     operation = 'configure';
            // } else {
            //     toast.warn(this.props.intl.formatMessage({ id: "IDS_PROVIDEVALUESFORINPUTS" }));
            //   }
            // }
            else if (operation === 'configurechecklistadd') {
                let designData = this.props.Login.designData;


                if (this.props.Login.masterData.realSampleValue.value === SampleType.GOODSIN) {
                    designData['checklist'] = { "nchecklistversioncode": this.state.selectedRecord.nchecklistversioncode.value }
                }

                inputData = {
                    designtemplatemapping: {
                        ndesigntemplatemappingcode: this.props.Login.masterData.selectedDesignTemplateMapping.ndesigntemplatemappingcode,
                        jsondataobj: designData
                    },
                    userinfo: this.props.Login.userInfo
                }

                operation = 'configure';
            }
            else if (operation === 'configureaudit') {
                //console.log("auditFieldDesignData:", this.props.Login);

                inputData = {
                    //dynamicaudit: {
                    ndesigntemplatemappingcode: this.props.Login.masterData.selectedDesignTemplateMapping.ndesigntemplatemappingcode,
                    auditdata: this.props.Login.auditData,
                    //nregtypecode:this.props.Login.masterData.realRegTypeValue.value, 
                    //nregsubtypecode:this.props.Login.masterData.realRegSubTypeValue.value, 
                    //nformcode:43, stablename:'registration',

                    // },
                    userinfo: this.props.Login.userInfo
                }

                //operation = 'configure';
            } 
            else if (operation === 'configuresendtostore') {
                // const sampleQty = new Map();
                //  const sampleUnit = new Map();
                // let inputData=[];
                //  let subsamplefields = [];
                //  let senttostoragefields=[];

                let samqty = {
                    "1": this.state.selectedRecord.Quantity !== undefined && this.state.selectedRecord.Quantity !== null ? this.state.selectedRecord.Quantity.item.displayname : "",
                    "2": this.state.selectedRecord.Quantity !== undefined && this.state.selectedRecord.Quantity !== null ? this.state.selectedRecord.Quantity.label : ""
                }
                let samunit = {
                    "1": this.state.selectedRecord.Unit !== undefined && this.state.selectedRecord.Unit !== null ? this.state.selectedRecord.Unit.item.displayname : "",
                    "2": this.state.selectedRecord.Unit !== undefined && this.state.selectedRecord.Unit !== null ? this.state.selectedRecord.Unit.label : ""
                }
                let subsamqty = {
                    "1": this.state.selectedRecord.SubQuantity !== undefined && this.state.selectedRecord.SubQuantity !== null ? this.state.selectedRecord.SubQuantity.item.displayname : "",
                    "2": this.state.selectedRecord.SubQuantity !== undefined && this.state.selectedRecord.SubQuantity !== null ? this.state.selectedRecord.SubQuantity.label : ""
                }
                let subsamunit = {
                    "1": this.state.selectedRecord.SubUnit !== undefined && this.state.selectedRecord.SubUnit !== null ? this.state.selectedRecord.SubUnit.item.displayname : "",
                    "2": this.state.selectedRecord.SubUnit !== undefined && this.state.selectedRecord.SubUnit !== null ? this.state.selectedRecord.SubUnit.label : ""
                }
                let sample = { "nsampleqty": samqty, "nunitcode": samunit };
                let subsample = { "nsampleqty": subsamqty, "nunitcode": subsamunit };
                let str = { "samplefields": sample, "subsamplefields": subsample };
                let senttostoragefields = { "senttostoragefields": str };
                // console.log(JSON.stringify(senttostoragefields));
                inputData = {
                    "userinfo": this.props.Login.userInfo, "senttostoragefields": senttostoragefields, "updatesendtostore": senttostoragefields.senttostoragefields,
                    "ndesigntemplatemappingcode": this.props.Login.masterData.selectedDesignTemplateMapping.ndesigntemplatemappingcode
                };
            }
            else if (operation === 'approve') {
                let { jsondata, jdynamiccolumns, jnumericcolumns, templatePrimaryKey, deleteValidation, jsqlquerycolumns, sampleQuerybuilderViewCondition, sampleQuerybuilderViewSelect } = this.getGridJsondata(this.props.Login.masterData.selectedDesignTemplateMapping &&
                    this.props.Login.masterData.selectedDesignTemplateMapping.jsondata, "DeleteValidation");

                // console.log("deleteValidation 2:", deleteValidation);

                inputData = { jdynamiccolumns, jnumericcolumns, jsqlquerycolumns, sprimarykeyname: templatePrimaryKey, sampleQuerybuilderViewCondition, sampleQuerybuilderViewSelect };
                inputData["userinfo"] = this.props.Login.userInfo;
                inputData["designtemplatemapping"] = { "ndesigntemplatemappingcode": this.props.Login.masterData.selectedDesignTemplateMapping["ndesigntemplatemappingcode"] ? this.props.Login.masterData.selectedDesignTemplateMapping["ndesigntemplatemappingcode"].Value : "" };
                inputData["designtemplatemapping"] = this.props.Login.masterData.selectedDesignTemplateMapping;
                inputData["deletevalidationlist"] = deleteValidation;
                inputData["sviewname"] = this.state.selectedRecord.sviewname;
            }
            else {
                // console.log("this.state.selectedRecord:", this.state.selectedRecord);
                let { jsondata, jdynamiccolumns, jnumericcolumns, templatePrimaryKey } = this.props.Login.masterData.realSampleValue.value === SampleType.Masters ?
                    this.getGridJsondata(this.state.selectedRecord.nreactregtemplatecode.item.jsondata)
                    : this.props.Login.masterData.realSampleValue.value === SampleType.GOODSIN ? this.getGoodsInJsondata(this.state.selectedRecord.nreactregtemplatecode.item.jsondata)
                    : this.props.Login.masterData.realSampleValue.value === SampleType.PROTOCOL ? this.getProtocolJsondata(this.state.selectedRecord.nreactregtemplatecode.item.jsondata)  //Added by sonia on 11th NOV 2024 for jira id:ALPD-5025
                        : {};

                let auditData = {};

                let dataObject = {};
                if (this.props.Login.masterData.realSampleValue.value !== SampleType.Masters && 
                    this.props.Login.masterData.realSampleValue.value !== SampleType.GOODSIN &&
                    this.props.Login.masterData.realSampleValue.value !== SampleType.PROTOCOL //&&
                    //this.props.Login.masterData.realSampleValue.value !== SampleType.STABILITY
                ) { //Added by sonia on 11th NOV 2024 for jira id:ALPD-5025
                    dataObject = this.getJsondata(this.state.selectedRecord.nreactregtemplatecode.item.jsondata);
                    // console.log("json:",dataObject);

                    auditData = {
                        "registration": {
                            editmandatoryfields: dataObject["sampleAuditEditable"],
                            auditcapturefields: dataObject["sampleAuditFields"],
                            multilingualfields: dataObject["sampleAuditMultilingualFields"]
                        },
			//ALPD-4941--Vignesh R(09-12-2024)---Sample configuration screen Audit
                        "schedulersampledetail": {
                            editmandatoryfields: dataObject["sampleAuditEditable"],
                            auditcapturefields: dataObject["sampleAuditFields"],
                            multilingualfields: dataObject["sampleAuditMultilingualFields"]
                        },
                    };

                    if (needsubsample) {
                        auditData = {
                            ...auditData,
                            registrationsample: {
                                editmandatoryfields: dataObject["subSampleAuditEditable"],
                                auditcapturefields: dataObject["subSampleAuditFields"],
                                multilingualfields: dataObject["subSampleAuditMultilingualFields"]
                            },
			//ALPD-4941--Vignesh R(09-12-2024)---Sample configuration screen Audit
                            schedulersubsampledetail: {
                                editmandatoryfields: dataObject["subSampleAuditEditable"],
                                auditcapturefields: dataObject["subSampleAuditFields"],
                                multilingualfields: dataObject["subSampleAuditMultilingualFields"]
                            },
                        }
                        delete dataObject["subSampleAuditEditable"];
                        delete dataObject["subSampleAuditFields"];
                        delete dataObject["subSampleAuditMultilingualFields"];
                    }
                    delete dataObject["sampleAuditEditable"];
                    delete dataObject["sampleAuditFields"];
                    delete dataObject["sampleAuditMultilingualFields"];
                }
               
                else {
                     if(this.props.Login.masterData.realSampleValue.value === SampleType.Masters){
                    auditData = {
                        "dynamicmaster": {
                            editmandatoryfields: jsondata["sampleAuditEditable"],
                            auditcapturefields: jsondata["sampleAuditFields"],
                            multilingualfields: jsondata["sampleAuditMultilingualFields"]
                        },
                    };
                    } else if(this.props.Login.masterData.realSampleValue.value === SampleType.GOODSIN){
                    auditData = {
                        "goodsinsample": {
                            editmandatoryfields: jsondata["sampleAuditEditable"],
                            auditcapturefields: jsondata["sampleAuditFields"],
                            multilingualfields: jsondata["sampleAuditMultilingualFields"]
                        },
                    };
                //Added by sonia on 11th NOV 2024 for jira id:ALPD-5025    
                } else if(this.props.Login.masterData.realSampleValue.value === SampleType.PROTOCOL){
                    auditData = {
                        "protocol": {
                            editmandatoryfields: jsondata["sampleAuditEditable"],
                            auditcapturefields: jsondata["sampleAuditFields"],
                            multilingualfields: jsondata["sampleAuditMultilingualFields"]
                        },
                    };
                }
                // else if(this.props.Login.masterData.realSampleValue.value === SampleType.STABILITY){
                //     dataObject=this.getStabilityJsondata(this.state.selectedRecord.nreactregtemplatecode.item.jsondata)  
                //     auditData = {
                //         "stbregistration": {
                //             editmandatoryfields: dataObject["sampleAuditEditable"],
                //             auditcapturefields: dataObject["sampleAuditFields"],
                //             multilingualfields: dataObject["sampleAuditMultilingualFields"]
                //         }
                //     }
                //         auditData = {
                //             ...auditData,
                //             stbregistrationsample: {
                //                 editmandatoryfields: dataObject["subSampleAuditEditable"],
                //                 auditcapturefields: dataObject["subSampleAuditFields"],
                //                 multilingualfields: dataObject["subSampleAuditMultilingualFields"]
                //             },
			
                //         }
                //         delete dataObject["subSampleAuditEditable"];
                //         delete dataObject["subSampleAuditFields"];
                //         delete dataObject["subSampleAuditMultilingualFields"];
                //     //}
                //     delete dataObject["sampleAuditEditable"];
                //     delete dataObject["sampleAuditFields"];
                //     delete dataObject["sampleAuditMultilingualFields"];
                //     };
                }

                inputData = {
                    "userinfo": this.props.Login.userInfo,
                    "ncontrolcode": this.props.Login.ncontrolCode,
                    "nreactregtemplatecode": this.state.selectedRecord.nreactregtemplatecode.value,
                    "nsampletypecode": this.props.Login.masterData.realSampleValue.value,
                    "nregtypecode": this.props.Login.masterData.realSampleValue.value === SampleType.Masters 
                    || this.props.Login.masterData.realSampleValue.value === SampleType.GOODSIN 
                    || this.props.Login.masterData.realSampleValue.value === SampleType.PROTOCOL ? -1 
                    : this.props.Login.masterData.realRegTypeValue ? this.props.Login.masterData.realRegTypeValue.value : -1,
                    "nregsubtypecode": this.props.Login.masterData.realSampleValue.value === SampleType.Masters || this.props.Login.masterData.realSampleValue.value === SampleType.GOODSIN || this.props.Login.masterData.realSampleValue.value === SampleType.PROTOCOL ? -1 : this.props.Login.masterData.realRegSubTypeValue ? this.props.Login.masterData.realRegSubTypeValue.value : -1,
                    "sregsubtypename": this.props.Login.masterData.realSampleValue.value === SampleType.Masters
                     || this.props.Login.masterData.realSampleValue.value === SampleType.GOODSIN
                      || this.props.Login.masterData.realSampleValue.value === SampleType.PROTOCOL ? "" :
                       this.props.Login.masterData.realRegSubTypeValue ? this.props.Login.masterData.realRegSubTypeValue.label : "",
                    "nformcode": this.props.Login.masterData.realSampleValue.value ===SampleType.GOODSIN ? 
                    formCode.GOODSIN : this.props.Login.masterData.realSampleValue.value === SampleType.PROTOCOL?
                     formCode.PROTOCOL  :this.props.Login.masterData.realSampleValue.value === SampleType.STABILITY? formCode.STUDYALLOCATION : this.props.Login.masterData.realFormValue ? this.props.Login.masterData.realFormValue.value : -1,
                    "nsubsampletemplatecode": this.state.selectedRecord.nsubsampletemplatecode ? this.state.selectedRecord.nsubsampletemplatecode.value : -1,
                    "jsondataobj": this.props.Login.masterData.realSampleValue.value === SampleType.Masters
                     || this.props.Login.masterData.realSampleValue.value === SampleType.GOODSIN 
                     || this.props.Login.masterData.realSampleValue.value === SampleType.PROTOCOL ? jsondata
                        : dataObject,
                    auditdata: auditData,
                    needsubsample: this.props.Login.masterData.realSampleValue.value === SampleType.GOODSIN 
                    || this.props.Login.masterData.realSampleValue.value === SampleType.PROTOCOL
                    ? false : this.props.Login.masterData.realRegSubTypeValue ? 
                    this.props.Login.masterData.realRegSubTypeValue.item.nneedsubsample : false
                    //needsubsample: this.props.Login.masterData.realRegSubTypeValue ? this.props.Login.masterData.realRegSubTypeValue.item.nneedsubsample : false
                }

                inputData["designtemplatemapping"] = { "nsitecode": this.props.Login.userInfo.nmastersitecode };
                if (this.props.Login.masterData.realFormValue && this.props.Login.masterData.realFormValue.value === -2) {
                    let qf_jsonData = { sdisplayname: {} };
                    let qbt_jsonData = { tablename: {} };

                    this.props.Login.languageList.map(lang => {
                        qf_jsonData['sdisplayname'][lang.value] = this.state.selectedRecord.sformname;
                        qbt_jsonData['tablename'][lang.value] = this.state.selectedRecord.sformname
                    })

                    let qm_jsonData = { sdisplayname: {} };

                    let nmodulecode = 0;
                    let smoduledisplayname = "";

                    if (this.state.selectedRecord["nnewmodule"].value === transactionStatus.YES) {
                        smoduledisplayname = this.state.selectedRecord["nmodulecode"];
                        this.props.Login.languageList.map(lang => {
                            qm_jsonData['sdisplayname'][lang.value] = this.state.selectedRecord["nmodulecode"];
                        })
                    }
                    else {
                        nmodulecode = this.state.selectedRecord["nmodulecode"].value;
                    }
                    inputData = {
                        ...inputData,
                        sformname: this.state.selectedRecord.sformname,
                        sregtemplatename: this.state.selectedRecord.nreactregtemplatecode.label,
                        nmodulecode,
                        smoduledisplayname,
                        qm_jsonData,
                        qf_jsonData,
                        qbt_jsonData,
                        sprimarykeyname: templatePrimaryKey,
                        jdynamiccolumns,
                        jnumericcolumns
                    }
                } else {
                    inputData = {
                        ...inputData,
                        sformname: this.props.Login.masterData.realFormValue && this.props.Login.masterData.realFormValue.label,
                        sregtemplatename: this.state.selectedRecord.nreactregtemplatecode.label,
                        ssubregtemplatename: this.state.selectedRecord.nsubsampletemplatecode && this.state.selectedRecord.nsubsampletemplatecode.label,
                        sprimarykeyname: templatePrimaryKey,
                        jdynamiccolumns,
                        jnumericcolumns

                    }
                }
                // this.designtemplatemappingFieldList.map(item => {
                //     return inputData["designtemplatemapping"][item] = this.state.selectedRecord[item]
                // });
            }

            //console.log("input:", inputData);
            let postParam = undefined;
            const inputParam = {
                classUrl: "designtemplatemapping",
                methodUrl: "DesignTemplateMapping",
                inputData: inputData,
                operation,
                saveType, formRef, postParam, searchRef: this.searchRef, dataList: [], dataListCount: [], dataListCountSubSample: [], dataListSubSample: []
            }
            if (operation === 'configureaudit') {
                inputParam["methodUrl"] = "DynamicAudit";
                inputParam["operation"] = "configure";
                //operation = 'configure';
            }
            if (operation === 'configuresendtostore') {
                inputParam["methodUrl"] = "ConfigureSendToStore";
                inputParam["operation"] = "update";
                //operation = 'configure';
            }
            const masterData = this.props.Login.masterData;
            if (
                showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolCode)) {
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        loadEsign: true, screenData: { inputParam, masterData }, saveType, dataList: [], dataListCount: [], dataListCountSubSample: [], dataListSubSample: []
                    }
                }
                this.props.updateStore(updateInfo);
            }
            else {
                this.props.crudMaster(inputParam, masterData, "openModal");
            }
        }
    }

    componentWillUnmount() {
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                masterData: [], inputParam: undefined, operation: null, modalName: undefined,isInitialRender:true
            }
        }
        this.props.updateStore(updateInfo);
    }

    onTabChange = (tabProps) => {
        const screenName = tabProps.screenName;
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { screenName }
        }
        this.props.updateStore(updateInfo);
    }
    // onChangeAwesomeQueryBuilder = (immutableTree, config) => {
    //     const filterquery = QbUtils.sqlFormat(immutableTree, config);
    //     const filterQueryTreeStr = QbUtils.getTree(immutableTree);

    //     const updateInfo = {
    //         typeName: DEFAULT_RETURN,
    //         data: {
    //             awesomeTree: immutableTree, awesomeConfig: config, filterquery, filterQueryTreeStr
    //         }
    //     }
    //     this.props.updateStore(updateInfo)


    // };
    childDataChange=(datas)=>{
        let masterData = this.props.Login.masterData;
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
            ...datas,masterData:{...masterData,fieldName:datas.fieldName,fieldIndex:datas.fieldIndex},isInitialRender:false
        }
    }
    this.props.updateStore(updateInfo)
    }
}

export default connect(mapStateToProps, {
    callService, crudMaster, validateEsignCredential, editFieldConfigService,
    updateStore, getDesignTemplateMappingDetail, getMappedFieldProps,
    getDesignTemplateMappingComboService, filterColumnData, auditFieldConfigService,
    reloadDesignTemplateMapping, getTMPFilterRegType, getTMPFilterRegSubType, getTMPFilterSubmit,
    combinationUniqueConfigService, mappingFieldConfigService, exportFieldConfigService, configureCheckList, getConfigureCheckListLatestVersion,reportFilterType
})(injectIntl(DesignTemplateMapping));

