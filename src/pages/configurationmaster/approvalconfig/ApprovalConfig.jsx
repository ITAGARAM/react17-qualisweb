import React from 'react'
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import { toast } from 'react-toastify';
import { callService, crudMaster } from '../../../actions';
import { Row, Col, Card, Nav, FormGroup, FormLabel } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faCopy, faThumbsUp, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { sortData, getControlMap, showEsign, constructOptionList } from '../../../components/CommonScript'
import { process } from '@progress/kendo-data-query';
import ListMaster from '../../../components/list-master/list-master.component';
import Esign from '../../audittrail/Esign';
import SampleFilter from './SampleFilter';
import AddApprovalConfig from './AddApprovalConfig';
import SlideOutModal from '../../../components/slide-out-modal/SlideOutModal';
import { ReadOnlyText, ContentPanel } from '../../../components/App.styles';
import {
    openModal, updateStore, getApprovalConfigVersion, getApprovalConfigEditData, copyVersion, setDefault, validateEsignCredential,
    getFilterChange, getRoleDetails, getCopySubType, filterColumnData, getApprovalConfigurationVersion, approveVersion
} from '../../../actions'
import { DEFAULT_RETURN } from '../../../actions/LoginTypes';
import { ApprovalSubType, designProperties, transactionStatus } from '../../../components/Enumeration';
import FilterStatusTab from './FilterStatusTab';
import ValidationStatusTab from './ValidationStatusTab';
import UserRoleAccordion from './UserRoleAccordion';
import CustomAccordion from '../../../components/custom-accordion/custom-accordion.component';
import DecisionStatusTab from './DecisionStatusTab';
import ActionStatusTab from './ActionStatusTab';
// import { Tooltip } from '@progress/kendo-react-tooltip';
import BreadcrumbComponent from '../../../components/Breadcrumb.Component';
import ConfirmMessage from '../../../components/confirm-alert/confirm-message.component';
import { Affix } from 'rsuite';
import FormInput from '../../../components/form-input/form-input.component';
import FormSelectSearch from '../../../components/form-select-search/form-select-search.component';
// import ReactTooltip from 'react-tooltip';

const mapStateToProps = state => {
    return ({ Login: state.Login })
}

class ApprovalConfig extends React.Component {
    constructor(props) {
        super(props)
        const dataState = {
            skip: 0,
            take: 10,
        };
        const filterStatusState = { skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5 };
        const validationStatusState = { skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5 };

        this.state = {
            userRoleControlRights: [],
            controlMap: new Map(),
            openModal: false, masterStatus: "", error: "",
            approvalConfigCode: -1,
            dataResult: [], dataState: dataState, selectedRecord: {},
            ApprovalsubtypeList: [],
            RegistrationTypeList: [],
            RegistrationSubTypeList: [],
            UserRoleTemplateList: [],
            filterStatusState,
            validationStatusState,
            sidebarview: false

        };
        this.searchRef = React.createRef();
        this.confirmMessage = new ConfirmMessage();
    }
    sidebarExpandCollapse = () => {
        this.setState({
            sidebarview: true
        })
    }
    static getDerivedStateFromProps(props, state) {

        if (props.Login.masterStatus !== "") {
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
    validateEsign = () => {
        const inputParam = {
            inputData: {
                "userinfo":
                {
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

    handleClose = () => {
        let loadEsign = this.props.Login.loadEsign;
        let openModal = this.props.Login.openModal;
        let selectedRecord = this.props.Login.selectedRecord;
        if (this.props.Login.loadEsign) {
            if (this.props.Login.operation === "delete" || this.props.Login.operation === "approve") {
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
        } else {
            openModal = false;
            selectedRecord = {}
        }

        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { openModal, loadEsign, selectedRecord, selectedId: null }
        }
        this.props.updateStore(updateInfo);
    }

    deleteApprovalConfigVersion = (deleteId) => {

        if (this.props.Login.masterData.selectedVersion.ntransactionstatus === transactionStatus.APPROVED ||
            this.props.Login.masterData.selectedVersion.ntransactionstatus === transactionStatus.RETIRED) {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTDRAFTVERSION" }))
        }
        else {
            const postParam = {
                inputListName: "versionData", selectedObject: "selectedVersion",
                primaryKeyField: "napproveconfversioncode",
                primaryKeyValue: this.props.Login.masterData.selectedVersion.napproveconfversioncode,
                fetchUrl: "approvalconfig/getApprovalConfigVersion",
                fecthInputObject: { napprovalsubtypecode: this.approvalSubTypeValue.value, userinfo: this.props.Login.userInfo },
                // unchangeList: ["approvalsubtype", "approvalSubTypeValue", "registrationType",
                //  "registrationTypeValue", "registrationSubType", "registrationSubTypeValue",
                //     "ApprovalsubtypeList", "RegistrationTypeList", "RegistrationSubTypeList"]
            }
            const inputData = {
                'approvalconfigversion': {
                    napprovalconfigversioncode: this.props.Login.masterData.selectedVersion.napproveconfversioncode,
                    napprovalconfigcode: this.props.Login.masterData.realApprovalConfigCode,
                    napprovalsubtypecode: this.approvalSubTypeValue.value,
                    ntreeversiontempcode: this.props.Login.masterData.realTreeVersionTemplateValue.value,
                    userinfo: this.props.Login.userInfo
                }
            }
            inputData['userinfo'] = this.props.Login.userInfo
            const inputParam = {
                methodUrl: 'ApprovalConfigVersion',
                classUrl: this.props.Login.inputParam.classUrl,
                displayName: "IDS_APPROVALCONFIG",
                inputData: inputData, postParam,
                operation: "delete",
                selectedRecord: { ...this.state.selectedRecord }

            }

            const masterData = this.props.Login.masterData;
            if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, deleteId)) {
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        loadEsign: true, screenData: { inputParam, masterData }, operation: "delete",
                        openModal: true, screenName: this.props.intl.formatMessage({ id: "IDS_APPROVALCONFIG" })
                    }
                }
                this.props.updateStore(updateInfo);
            }
            else {
                this.props.crudMaster(inputParam, masterData, "openModal");
            }
        }

    }

    approveVersion = (approveId) => {
        if (this.props.Login.masterData.selectedVersion.ntransactionstatus === transactionStatus.APPROVED ||
            this.props.Login.masterData.selectedVersion.ntransactionstatus === transactionStatus.RETIRED) {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTDRAFTVERSION" }))
        } else {

            if (this.approvalSubTypeValue.value === 2) {
                const inputData = {
                    // 'approvalconfigversion': {
                    napprovalconfigversioncode: this.props.Login.masterData.selectedVersion.napproveconfversioncode,
                    napprovalconfigcode: this.props.Login.masterData.realApprovalConfigCode,
                    napprovalsubtypecode: this.approvalSubTypeValue.value,
                    ntreeversiontempcode: this.props.Login.masterData.realTreeVersionTemplateValue ? this.props.Login.masterData.realTreeVersionTemplateValue.value : -1,
                    userinfo: this.props.Login.userInfo,
                    nregsubtypecode: this.props.Login.masterData.registrationSubTypeValue ? this.props.Login.masterData.registrationSubTypeValue.value : -1,
                    sregsubtypename: this.props.Login.masterData.registrationSubTypeValue ? this.props.Login.masterData.registrationSubTypeValue.label : "",
                    nregtypecode: this.props.Login.masterData.registrationTypeValue ? this.props.Login.masterData.registrationTypeValue.value : -1,
                    // nregtypecode:this.props.Login.masterData.registrationTypeValue ? this.props.Login.masterData.registrationTypeValue.value : -1,
                    // }

                }
                inputData['userinfo'] = this.props.Login.userInfo
                //  inputData['userinfo'] = this.props.Login.userInfo
                const inputParam = {
                    methodUrl: 'ApprovalConfigVersion',
                    classUrl: this.props.Login.inputParam.classUrl,
                    displayName: "IDS_APPROVALCONFIG",
                    inputData: inputData,
                    operation: "approve", ncontrolcode: approveId
                }
                //const masterData = this.props.Login.masterData;
                this.props.approveVersion(inputParam);

                // if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, approveId)) {
                //     const updateInfo = {
                //         typeName: DEFAULT_RETURN,
                //         data: {
                //             loadEsign: true, screenData: { inputParam, masterData },
                //             openModal: true, screenName: this.props.intl.formatMessage({ id: "IDS_APPROVALCONFIG" }), operation: "approve"
                //         }
                //     }
                //     this.props.updateStore(updateInfo);
                // }
                // else {
                //     this.props.crudMaster(inputParam, masterData, "openModal");
                // }
            } else if (this.approvalSubTypeValue.value === ApprovalSubType.PROTOCOLAPPROVAL) {
                const inputData = {
                    napprovalconfigversioncode: this.props.Login.masterData.selectedVersion.napproveconfversioncode,
                    napprovalconfigcode: this.props.Login.masterData.realApprovalConfigCode,
                    napprovalsubtypecode: this.approvalSubTypeValue.value,
                    ntreeversiontempcode: this.props.Login.masterData.realTreeVersionTemplateValue ? this.props.Login.masterData.realTreeVersionTemplateValue.value : -1,
                    userinfo: this.props.Login.userInfo,

                }
                inputData['userinfo'] = this.props.Login.userInfo
                const inputParam = {
                    methodUrl: 'ApprovalConfigVersion',
                    classUrl: this.props.Login.inputParam.classUrl,
                    displayName: "IDS_APPROVALCONFIG",
                    inputData: inputData,
                    operation: "approve", ncontrolcode: approveId
                }
                this.props.approveVersion(inputParam);

            } else {
                const inputData = {
                    'approvalconfigversion': {
                        napprovalconfigversioncode: this.props.Login.masterData.selectedVersion.napproveconfversioncode,
                        napprovalconfigcode: this.props.Login.masterData.realApprovalConfigCode,
                        napprovalsubtypecode: this.approvalSubTypeValue.value,
                        ntreeversiontempcode: this.props.Login.masterData.realTreeVersionTemplateValue ? this.props.Login.masterData.realTreeVersionTemplateValue.value : -1,
                        userinfo: this.props.Login.userInfo,
                        nregsubtypecode: this.props.Login.masterData.registrationSubTypeValue ? this.props.Login.masterData.registrationSubTypeValue.value || -1 : -1,
                        sregsubtypename: this.props.Login.masterData.registrationSubTypeValue ? this.props.Login.masterData.registrationSubTypeValue.label || "" : "",
                        nregtypecode: this.props.Login.masterData.registrationTypeValue ? this.props.Login.masterData.registrationTypeValue.value : -1,
                    }

                }
                inputData['userinfo'] = this.props.Login.userInfo
                const inputParam = {
                    methodUrl: 'ApprovalConfigVersion',
                    classUrl: this.props.Login.inputParam.classUrl,
                    displayName: "IDS_APPROVALCONFIG",
                    inputData: inputData,
                    operation: "updateapprove", ncontrolcode: approveId,
                    selectedRecord: { ...this.state.selectedRecord }
                }
                if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, approveId)) {
                    const updateInfo = {
                        typeName: DEFAULT_RETURN,
                        data: {
                            loadEsign: true, screenData: { inputParam, masterData: this.props.Login.masterData },
                            openModal: true, screenName: this.props.intl.formatMessage({ id: "IDS_APPROVALCONFIG" }), operation: "approve"
                        }
                    }
                    this.props.updateStore(updateInfo);
                }
                else {
                    this.props.crudMaster(inputParam, this.props.Login.masterData, "openModal");
                }
            }
        }

    }
    getGridJsondata = (templatedata, subSampleCheck, subSampleTemplate) => {
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
        let jsqlquerycolumns = [];
        let jsqlquerycolumnssub = [];

        templatedata && templatedata.map(row =>
            row.children && row.children.map(column => {
                column.children && column.children.map((component, index) => {
                    //console.log("component2:", component);
                    if (component.hasOwnProperty('children')) {
                        component.children.map(componentRow => {

                            if (componentRow.inputtype !== 'frontendsearchfilter'
                                && componentRow.inputtype !== 'backendsearchfilter') {
                                jsqlquerycolumns.push({
                                    "tablename": "registration",
                                    "columnname": componentRow.label,
                                    "displayname": componentRow.displayname,
                                    "isjsoncolumn": false,
                                    "columndatatype": componentRow.inputtype === 'date' ? "date" : "string",
                                    "jsoncolumnname": "jsonuidata"
                                })
                            }


                            // console.log("component row2:", componentRow);
                            componentRow.unique && masteruniquevalidation.push({ [designProperties.LABEL]: componentRow.label });
                            componentRow.unique && mastercombinationunique.push({ [componentRow.label]: { [designProperties.LABEL]: componentRow.displayname, [designProperties.VALUE]: componentRow.label } })


                            templatePrimaryKey = templatePrimaryKey === "" && componentRow.unique ? componentRow.label : templatePrimaryKey;

                            let filterinputtype = "text";
                            let comboDataInputObject = {};

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
                                    "displayname": componentRow.displayname,
                                    "foriegntablePK": componentRow.valuemember,
                                    // "ismultilingual": true,
                                    // "conditionstring": " and nformcode in ("+componentRow.table.item.nformcode+") ",
                                    "tablecolumnname": componentRow.label,
                                    "foriegntablename": componentRow.source,
                                    ...comboDataInputObject
                                })
                                if (!componentRow.ismultilingual === true) {
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
                                }
                                else {
                                    sampleQuerybuilderViewCondition.push({
                                        "columnname": component.label,
                                        "columntype": 4,
                                        "columntypedesc": "combo",
                                        "isjsondisplayname": true,
                                        "displayname": component.displayname,
                                        "sforeigntablename": component.source,
                                        "sforeigncolumnname": component.valuemember,
                                        "sforeigndisplayname": "jsondata->[" + component.displaymember + "]->>"
                                    })

                                }

                                sampleQuerybuilderViewSelect.push({
                                    "columnname": componentRow.label,
                                    "displayname": componentRow.displayname,
                                    "languagecode": false
                                })

                                filterinputtype = "predefinednumeric";
                            }
                            // samplesearchfields.push(componentRow.label)
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
                            // displayFields.push({ [designProperties.LABEL]: componentRow.displayname, [designProperties.VALUE]: componentRow.label });
                            // componentRow.templatemandatory && listItem.push({ [designProperties.LABEL]: componentRow.displayname, [designProperties.VALUE]: componentRow.label })
                            if (componentRow.mandatory || componentRow.templatemandatory) {
                                gridItem.push({ [designProperties.LABEL]: componentRow.displayname, [designProperties.VALUE]: componentRow.label })
                                sampleAuditEditable.push(componentRow.label);
                            }
                            else {
                                gridMoreItem.push({ [designProperties.LABEL]: componentRow.displayname, [designProperties.VALUE]: componentRow.label });
                            }
                            mastertemplatefields.push({ [designProperties.LABEL]: componentRow.displayname, [designProperties.VALUE]: componentRow.label })
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
                        if (component.inputtype !== 'frontendsearchfilter'
                            && component.inputtype !== 'backendsearchfilter') {
                            jsqlquerycolumns.push({
                                "tablename": "registration",
                                "columnname": component.label,
                                "displayname": component.displayname,
                                "isjsoncolumn": false,
                                "columndatatype": component.inputtype === 'date' ? 'date' : "string",
                                "jsoncolumnname": "jsondata"
                            })
                        }
                        //console.log("component2:", component);
                        component.unique && masteruniquevalidation.push({ [designProperties.LABEL]: component.label });
                        component.unique && mastercombinationunique.push({ [component.label]: { [designProperties.LABEL]: component.displayname, [designProperties.VALUE]: component.label } })
                        templatePrimaryKey = templatePrimaryKey === "" && component.unique ? component.label : templatePrimaryKey;


                        let filterinputtype = "text";
                        let comboDataInputObject = {};

                        mastertemplatefields.push({ [designProperties.LABEL]: component.displayname, [designProperties.VALUE]: component.label })
                        sampleAuditFields.push(component.label);
                        sampleAuditMultilingualFields.push({ [component.label]: component.displayname });

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
                                "displayname": component.displayname,
                                "foriegntablePK": component.valuemember,
                                // "ismultilingual": true,
                                //"conditionstring": " and nformcode in (" + component.table.item.nformcode + ") ",
                                "tablecolumnname": component.label,
                                "foriegntablename": component.source,
                                ...comboDataInputObject
                            })
                            if (!component.ismultilingual === true) {
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
                            }
                            else {
                                sampleQuerybuilderViewCondition.push({
                                    "columnname": component.label,
                                    "columntype": 4,
                                    "columntypedesc": "combo",
                                    "isjsondisplayname": true,
                                    "displayname": component.displayname,
                                    "sforeigntablename": component.source,
                                    "sforeigncolumnname": component.valuemember,
                                    "sforeigndisplayname": "jsondata->[" + component.displaymember + "]->>"
                                })


                            }


                            sampleQuerybuilderViewSelect.push({
                                "columnname": component.label,
                                "displayname": component.displayname,
                                "languagecode": false
                            })
                        }
                        // samplesearchfields.push(component.label)
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
                            gridItem.push({ [designProperties.LABEL]: component.displayname, [designProperties.VALUE]: component.label })
                            sampleAuditEditable.push(component.label);
                        } else {
                            gridMoreItem.push({ [designProperties.LABEL]: component.displayname, [designProperties.VALUE]: component.label });
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


        if (subSampleCheck) {
            subSampleTemplate && subSampleTemplate.jsondata.map(row =>
                row.children && row.children.map(column => {
                    column.children && column.children.map((component, index) => {
                        //console.log("component2:", component);
                        if (component.hasOwnProperty('children')) {
                            component.children.map(componentRow => {
                                if (componentRow.inputtype !== 'frontendsearchfilter'
                                    && componentRow.inputtype !== 'backendsearchfilter') {
                                    jsqlquerycolumnssub.push({
                                        "tablename": "registrationsample",
                                        "columnname": componentRow.label,
                                        "displayname": componentRow.displayname,
                                        "isjsoncolumn": true,
                                        "columndatatype": componentRow.inputtype === 'date' ? "date" : "string",
                                        "jsoncolumnname": "jsonuidata"
                                    })
                                }


                                if (componentRow.inputtype === 'combo') {
                                    if (!componentRow.ismultilingual === true) {
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
                                    }

                                    else {
                                        sampleQuerybuilderViewCondition.push({
                                            "columnname": component.label,
                                            "columntype": 1,
                                            "displayname": componentRow.displayname,
                                            "columntypedesc": "textinput",
                                            "isjsondisplayname": true,
                                            "sforeigntablename": component.source,
                                            "sforeigncolumnname": component.valuemember,
                                            "sforeigndisplayname": "jsondata->[" + component.displaymember + "]->>"
                                        })
                                    }
                                    sampleQuerybuilderViewSelect.push({
                                        "columnname": componentRow.label,
                                        "displayname": componentRow.displayname,
                                        "languagecode": false
                                    })
                                }

                                if (componentRow.inputtype === 'date') {
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
                                return null;
                            })
                        } else {

                            if (component.inputtype !== 'frontendsearchfilter'
                                && component.inputtype !== 'backendsearchfilter') {
                                jsqlquerycolumnssub.push({
                                    "tablename": "registrationsample",
                                    "columnname": component.label,
                                    "displayname": component.displayname,
                                    "isjsoncolumn": true,
                                    "columndatatype": component.inputtype === 'date' ? "date" : "string",
                                    "jsoncolumnname": "jsonuidata"
                                })
                            }
                            if (component.inputtype === 'combo') {
                                if (!component.ismultilingual === true) {

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
                                }
                                else {
                                    sampleQuerybuilderViewCondition.push({
                                        "columnname": component.label,
                                        "columntype": 4,
                                        "displayname": component.displayname,
                                        "columntypedesc": "combo",
                                        "isjsondisplayname": true,
                                        "sforeigntablename": component.source,
                                        "sforeigncolumnname": component.valuemember,
                                        "sforeigndisplayname": "jsondata->[" + component.displaymember + "]->>"
                                    })
                                }

                                sampleQuerybuilderViewSelect.push({
                                    "columnname": component.label,
                                    "displayname": component.displayname,
                                    "languagecode": false
                                })
                            }
                            if (component.inputtype === 'date') {

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
                            return null;
                        }

                    })
                })
            );


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
            sampleAuditMultilingualFields
        }

        //console.log("dynamiccolumns:", jdynamiccolumns);
        return { jsondata, jdynamiccolumns, jnumericcolumns, templatePrimaryKey, sampleQuerybuilderViewCondition, sampleQuerybuilderViewSelect, jsqlquerycolumns, jsqlquerycolumnssub };
    }


    approveVersion1 = (approveId) => {
        if (this.props.Login.masterData.selectedVersion.ntransactionstatus === transactionStatus.APPROVED ||
            this.props.Login.masterData.selectedVersion.ntransactionstatus === transactionStatus.RETIRED) {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTDRAFTVERSION" }))
        } else {
            const postParam = {
                inputListName: "versionData", selectedObject: "selectedVersion",
                primaryKeyField: "napproveconfversioncode",
                primaryKeyValue: this.props.Login.masterData.selectedVersion.napproveconfversioncode,
                fetchUrl: "approvalconfig/getApprovalConfigVersion",
                fecthInputObject: { napprovalsubtypecode: this.approvalSubTypeValue.value, userinfo: this.props.Login.userInfo },
                unchangeList: ["approvalsubtype", "approvalSubTypeValue", "registrationType", "registrationTypeValue", "registrationSubType",
                    "registrationSubTypeValue", "ApprovalsubtypeList", "RegistrationTypeList", "RegistrationSubTypeList"]
            }

            let { jdynamiccolumns, jnumericcolumns, templatePrimaryKey, sampleQuerybuilderViewCondition, sampleQuerybuilderViewSelect, jsqlquerycolumns, jsqlquerycolumnssub } = this.getGridJsondata(this.props.Login.selectedTemplate &&
                this.props.Login.selectedTemplate, this.props.Login.subSampleCheck, this.props.Login.subSampleTemplate);
            const inputData = {
                'approvalconfigversion': {
                    napprovalconfigversioncode: this.props.Login.masterData.selectedVersion.napproveconfversioncode,
                    napprovalconfigcode: this.props.Login.masterData.realApprovalConfigCode,
                    napprovalsubtypecode: this.approvalSubTypeValue.value,
                    ntreeversiontempcode: this.props.Login.masterData.realTreeVersionTemplateValue ? this.props.Login.masterData.realTreeVersionTemplateValue.value : -1,
                    userinfo: this.props.Login.userInfo,
                    nregsubtypecode: this.props.Login.masterData.registrationSubTypeValue && this.props.Login.masterData.registrationSubTypeValue.value ? this.props.Login.masterData.registrationSubTypeValue.value : -1,
                    sregsubtypename: this.props.Login.masterData.registrationSubTypeValue && this.props.Login.masterData.registrationSubTypeValue.label ? this.props.Login.masterData.registrationSubTypeValue.label : "",
                    sviewname: this.state.selectedRecord.sviewname,
                    ndesigntemplatemappingcode: this.state.selectedRecord.ndesigntemplatemappingcode.value,
                    sregtemplatename: this.state.selectedRecord.ndesigntemplatemappingcode.label,
                }, jdynamiccolumns, jnumericcolumns, sprimarykey: templatePrimaryKey,
                sampleQuerybuilderViewCondition, sampleQuerybuilderViewSelect, jsqlquerycolumns, jsqlquerycolumnssub

            }
            inputData['userinfo'] = this.props.Login.userInfo


            // inputData['jsondata'] = this.props.Login.userInfo
            const inputParam = {
                methodUrl: 'ApprovalConfigVersion',
                classUrl: this.props.Login.inputParam.classUrl,
                displayName: "IDS_APPROVALCONFIG",
                inputData: inputData, postParam,
                operation: "updateapprove",
                selectedRecord: { ...this.state.selectedRecord }
            }
            const masterData = this.props.Login.masterData;

            if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, approveId)) {
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        loadEsign: true, screenData: { inputParam, masterData },
                        openModal: true, screenName: this.props.intl.formatMessage({ id: "IDS_APPROVALCONFIG" }), operation: "approve"
                    }
                }
                this.props.updateStore(updateInfo);
            }
            else {
                this.props.crudMaster(inputParam, masterData, "openModal");
            }
        }

    }

    onSaveClick = (saveType, formRef) => {
        let postParam = undefined;
        if (this.props.Login.operation === "copy") {

            const subTypeCode = this.approvalSubTypeValue.value;

            const inputData = {
                approvalconfigversion: {
                    napprovalconfigversioncode: this.props.Login.masterData.selectedVersion.napproveconfversioncode,
                    napprovalconfigcode: this.props.Login.masterData.realApprovalConfigCode,
                    napprovalsubtypecode: subTypeCode,
                    sversionname: this.state.selectedRecord.sversionname,
                    nregtypecode: subTypeCode === ApprovalSubType.TESTRESULTAPPROVAL ? this.state.selectedRecord['regtype'] ? this.state.selectedRecord['regtype'].value : this.state.registrationTypeValue[0].value : -1,
                    nregsubtypecode: subTypeCode === ApprovalSubType.TESTRESULTAPPROVAL ? this.state.selectedRecord['regsubtype'] ? this.state.selectedRecord['regsubtype'].value : this.state.registrationSubTypeValue[0].value : -1,
                    userinfo: this.props.Login.userInfo,
                    ntreeversiontempcode: this.props.Login.masterData.realTreeVersionTemplateValue ? this.props.Login.masterData.realTreeVersionTemplateValue.value : -1
                }

            }
            inputData['userinfo'] = this.props.Login.userInfo
            const inputParam = {
                methodUrl: 'ApprovalConfigVersion',
                classUrl: this.props.Login.inputParam.classUrl,
                displayName: "IDS_APPROVALCONFIG",
                inputData: inputData, postParam, searchRef: this.searchRef,
                operation: "copy",
                selectedRecord: { ...this.state.selectedRecord }
            }

            const masterData = this.props.Login.masterData;

            if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolcode)) {

                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        loadEsign: true, screenData: { inputParam, masterData },
                        openModal: true, screenName: this.props.intl.formatMessage({ id: "IDS_APPROVALCONFIG" }), operation: "copy"
                    }
                }

                this.props.updateStore(updateInfo);

            } else {

                this.props.crudMaster(inputParam, masterData, "openModal");

            }

        } else if (this.props.Login.operation === 'approve') {
            this.approveVersion1(this.props.Login.ncontrolcode);
        }
        else {

            let bool = true;
            let errormessage = [];
            let inputData = {};
            let approvalconfigrole = [];
            let filterDetailCount = 0;
            let validationDetailCount = 0;
            let decisionDetailCount = 0;
            let actionDetailCount = 0;
            inputData["userinfo"] = this.props.Login.userInfo;
            inputData['napprovalconfigcode'] = this.props.Login.masterData.realApprovalConfigCode
            inputData['ntreeversiontempcode'] = this.props.Login.userRoleTree[0].ntreeversiontempcode
            inputData['napprovalsubtypecode'] = this.approvalSubTypeValue.value
            let isAutoApprovalVersion = this.state.selectedRecord['IDS_AUTOAPPROVAL'] && this.state.selectedRecord['IDS_AUTOAPPROVAL'] === transactionStatus.YES ? true : false;

            const userRoleTree = this.props.Login.userRoleTree;//.reverse();
            userRoleTree.map(role => {
                let approvalconfigrolefilterdetail = [];
                let approvalconfigrolevalidationdetail = [];
                let approvalconfigroledecisiondetail = [];
                let approvalconfigroleactiondetail = [];
                //to fill role details
                if (this.state.selectedRecord[role.nuserrolecode]) {
                    approvalconfigrole.push({
                        napprovalconfigrolecode: this.props.Login.operation === 'create' ? 0 : role.napprovalconfigrolecode,
                        napprovalconfigcode: role.napprovalconfigcode,
                        ntreeversiontempcode: role.ntreeversiontempcode,
                        nuserrolecode: role.nuserrolecode,
                        nchecklistversioncode: this.state.selectedRecord[role.nuserrolecode] ? this.state.selectedRecord[role.nuserrolecode].checklist ?
                            this.state.selectedRecord[role.nuserrolecode].checklist : transactionStatus.NA : transactionStatus.NA,
                        npartialapprovalneed: this.state.selectedRecord[role.nuserrolecode]['Partial Approval_' + role.nuserrolecode] ?
                            this.state.selectedRecord[role.nuserrolecode]['Partial Approval_' + role.nuserrolecode] : transactionStatus.YES,
                        nsectionwiseapprovalneed: this.state.selectedRecord[role.nuserrolecode]['IDS_PARTIALAPPROVAL'] && this.state.selectedRecord[role.nuserrolecode]['IDS_PARTIALAPPROVAL'] === transactionStatus.NO ?
                            this.state.selectedRecord[role.nuserrolecode]['IDS_SECTIONWISEAPPROVE'] ?
                                this.state.selectedRecord[role.nuserrolecode]['IDS_SECTIONWISEAPPROVE'] : transactionStatus.NO
                            : transactionStatus.NO,
                        // nrecomretestneed: this.state.selectedRecord[role.nuserrolecode]['IDS_RECOMMENDRETEST'] ?
                        //     this.state.selectedRecord[role.nuserrolecode]['IDS_RECOMMENDRETEST'] : transactionStatus.NO,
                        // nrecomrecalcneed: this.state.selectedRecord[role.nuserrolecode]['IDS_RECOMMENDRECALC'] ?
                        //     this.state.selectedRecord[role.nuserrolecode]['IDS_RECOMMENDRECALC'] : transactionStatus.NO,
                        // nretestneed: this.state.selectedRecord[role.nuserrolecode]['IDS_RETEST'] ?
                        //     this.state.selectedRecord[role.nuserrolecode]['IDS_RETEST'] : transactionStatus.NO,
                        // nrecalcneed: this.state.selectedRecord[role.nuserrolecode]['IDS_RECALC'] ?
                        //     this.state.selectedRecord[role.nuserrolecode]['IDS_RECALC'] : transactionStatus.NO,
                        // nlevelno: role.nlevelno,
                        nrecomretestneed: this.state.selectedRecord[role.nuserrolecode]['Recommend Retest_' + role.nuserrolecode] ?
                            this.state.selectedRecord[role.nuserrolecode]['Recommend Retest_' + role.nuserrolecode] : transactionStatus.NO,
                        nrecomrecalcneed: this.state.selectedRecord[role.nuserrolecode]['Recommend Recalc_' + role.nuserrolecode] ?
                            this.state.selectedRecord[role.nuserrolecode]['Recommend Recalc_' + role.nuserrolecode] : transactionStatus.NO,
                        nretestneed: this.state.selectedRecord[role.nuserrolecode]['ReTest_' + role.nuserrolecode] ?
                            this.state.selectedRecord[role.nuserrolecode]['ReTest_' + role.nuserrolecode] : transactionStatus.NO,
                        nrecalcneed: this.state.selectedRecord[role.nuserrolecode]['ReCalc_' + role.nuserrolecode] ?
                            this.state.selectedRecord[role.nuserrolecode]['ReCalc_' + role.nuserrolecode] : transactionStatus.NO,
                        nlevelno: role.nlevelno,
                        napprovalstatuscode: this.state.selectedRecord[role.nuserrolecode].approvalstatus ? this.state.selectedRecord[role.nuserrolecode].approvalstatus : transactionStatus.NA,

                        nautoapproval: this.state.selectedRecord['IDS_AUTOAPPROVAL'] && this.state.selectedRecord['IDS_AUTOAPPROVAL'] === transactionStatus.YES ? transactionStatus.YES :
                            this.state.selectedRecord[role.nuserrolecode]['IDS_AUTOAPPROVAL'] ? this.state.selectedRecord[role.nuserrolecode]['IDS_AUTOAPPROVAL'] : transactionStatus.NO,

                        nautoapprovalstatuscode: this.state.selectedRecord['IDS_AUTOAPPROVAL'] && this.state.selectedRecord['IDS_AUTOAPPROVAL'] === transactionStatus.YES ?
                            this.state.selectedRecord[this.props.Login.userRoleTree[0].nuserrolecode].approvalstatus
                            : this.state.selectedRecord[role.nuserrolecode]['IDS_AUTOAPPROVAL'] && this.state.selectedRecord[role.nuserrolecode].approvalstatus ?
                                this.state.selectedRecord[role.nuserrolecode].approvalstatus
                                : transactionStatus.NA
                        ,
                        nautodescisionstatuscode: this.state.selectedRecord['IDS_AUTOAPPROVAL'] && this.state.selectedRecord['IDS_AUTOAPPROVAL'] === transactionStatus.YES ?
                            this.state.selectedRecord[this.props.Login.userRoleTree[0].nuserrolecode].decisionstatus && this.state.selectedRecord[this.props.Login.userRoleTree[0].nuserrolecode].decisionstatus[0] ? this.state.selectedRecord[this.props.Login.userRoleTree[0].nuserrolecode].decisionstatus[0] : transactionStatus.PASS
                            : this.state.selectedRecord[role.nuserrolecode]['IDS_AUTOAPPROVAL'] && this.state.selectedRecord[role.nuserrolecode].decisionstatus && this.state.selectedRecord[role.nuserrolecode].decisionstatus.length > 0 ?
                                this.state.selectedRecord[role.nuserrolecode].decisionstatus[0] : transactionStatus.DRAFT
                        // :this.state.selectedRecord[this.props.Login.userRoleTree[0].nuserrolecode].decisionstatus&&this.state.selectedRecord[this.props.Login.userRoleTree[0].nuserrolecode].decisionstatus.length>0 ?
                        // :transactionStatus.NA
                        ,
                        ncorrectionneed: this.state.selectedRecord[role.nuserrolecode]['Correction_' + role.nuserrolecode] ?
                            this.state.selectedRecord[role.nuserrolecode]['Correction_' + role.nuserrolecode] : transactionStatus.NO,
                        nesignneed: this.state.selectedRecord[role.nuserrolecode]['Esign_' + role.nuserrolecode] ?
                            this.state.selectedRecord[role.nuserrolecode]['Esign_' + role.nuserrolecode] : transactionStatus.NO,
                        ntransactionstatus: transactionStatus.DRAFT,
                        nsitecode: this.props.Login.userInfo.nmastersitecode,
                        nstatus: transactionStatus.ACTIVE

                    })


                    if (this.state.selectedRecord[role.nuserrolecode].filterstatus) {
                        this.state.selectedRecord[role.nuserrolecode].filterstatus.map(filterValue => {
                            filterDetailCount++;
                            approvalconfigrolefilterdetail.push({
                                napprovalconfigcode: role.napprovalconfigcode,
                                nuserrolecode: role.nuserrolecode,
                                nlevelno: role.nlevelno,
                                ntransactionstatus: filterValue,
                                nstatus: transactionStatus.ACTIVE
                            })
                            return null;
                        })
                    }

                    if (this.state.selectedRecord[role.nuserrolecode].validationstatus) {
                        this.state.selectedRecord[role.nuserrolecode].validationstatus.map(validationValue => {
                            validationDetailCount++;
                            approvalconfigrolevalidationdetail.push({
                                napprovalconfigcode: role.napprovalconfigcode,
                                nuserrolecode: role.nuserrolecode,
                                nlevelno: role.nlevelno,
                                ntransactionstatus: validationValue,
                                nstatus: transactionStatus.ACTIVE
                            })
                            return null;
                        })
                    }

                    if (this.state.selectedRecord[role.nuserrolecode].decisionstatus) {
                        this.state.selectedRecord[role.nuserrolecode].decisionstatus.map(decisionValue => {
                            decisionDetailCount++;
                            approvalconfigroledecisiondetail.push({
                                napprovalconfigcode: role.napprovalconfigcode,
                                nuserrolecode: role.nuserrolecode,
                                nlevelno: role.nlevelno,
                                ntransactionstatus: decisionValue,
                                nstatus: transactionStatus.ACTIVE
                            });
                            return null;
                        })
                    }

                    this.state.selectedRecord[`actionStatus_${role.nuserrolecode}`] ? this.state.selectedRecord[`actionStatus_${role.nuserrolecode}`].map(actionValue => {
                        actionDetailCount++;
                        approvalconfigroleactiondetail.push({
                            napprovalconfigcode: role.napprovalconfigcode,
                            nuserrolecode: role.nuserrolecode,
                            nlevelno: role.nlevelno,
                            ntransactionstatus: actionValue,
                            nstatus: transactionStatus.ACTIVE
                        });
                        return null;
                    }) : approvalconfigroleactiondetail.push();
                    actionDetailCount++;
                    approvalconfigroleactiondetail.push({
                        napprovalconfigcode: role.napprovalconfigcode,
                        nuserrolecode: role.nuserrolecode,
                        nlevelno: role.nlevelno,
                        ntransactionstatus: this.state.selectedRecord[role.nuserrolecode].approvalstatus ? this.state.selectedRecord[role.nuserrolecode].approvalstatus : -1,
                        nstatus: transactionStatus.ACTIVE
                    });

                    inputData[`approvalconfigrolefilterdetail_${[role.nuserrolecode]}`] = approvalconfigrolefilterdetail
                    inputData[`approvalconfigrolevalidationdetail_${[role.nuserrolecode]}`] = approvalconfigrolevalidationdetail
                    inputData[`approvalconfigroledecisiondetail_${[role.nuserrolecode]}`] = approvalconfigroledecisiondetail
                    inputData[`approvalconfigroleactiondetail_${[role.nuserrolecode]}`] = approvalconfigroleactiondetail
                    bool = bool ? true : false
                    return null;
                } else {
                    bool = false
                    errormessage.push(role.suserrolename)
                    return false;
                }
            })//role map

            inputData['approvalconfigrole'] = approvalconfigrole
            inputData['rolecount'] = this.props.Login.userRoleTree.length
            inputData['filterdetailcount'] = filterDetailCount
            inputData['validationdetailcount'] = validationDetailCount
            inputData['decisiondetailcount'] = decisionDetailCount
            inputData['actioncount'] = actionDetailCount
            inputData['ntreeversiontempcode'] = this.props.Login.masterData.realTreeVersionTemplateValue ? this.props.Login.masterData.realTreeVersionTemplateValue.value : -1;
            let finalInputData = {}
            let inputParam = {}
            if (bool) {
                if (this.props.Login.operation === "update") {
                    // edit
                    postParam = { inputListName: "versionData", selectedObject: "selectedVersion", primaryKeyField: "napproveconfversioncode" };

                    const temp1 = {};
                    this.props.Login.versionConfig.map(temp => {
                        if (temp.ntranscode === transactionStatus.AUTOAPPROVAL) {
                            temp1['nneedautoapproval'] = this.state.selectedRecord[temp.stransdisplaystatus] ? this.state.selectedRecord[temp.stransdisplaystatus] : transactionStatus.NO
                        }
                        else if (temp.ntranscode === transactionStatus.AUTOCOMPLETE) {
                            temp1['nneedautocomplete'] = this.state.selectedRecord[temp.stransdisplaystatus] ? this.state.selectedRecord[temp.stransdisplaystatus] : transactionStatus.NO
                        }



                    })


                    inputData['approvalconfigautoapproval'] = {
                        napprovalconfigversioncode: this.props.Login.masterData.selectedVersion.napproveconfversioncode,
                        napprovalconfigcode: this.props.Login.masterData.realApprovalConfigCode,
                        sversionname: this.state.selectedRecord.sversionname,
                        //  nneedautocomplete: this.state.selectedRecord['Auto Complete'] ? this.state.selectedRecord['Auto Complete'] : transactionStatus.NO,
                        //  nneedautoapproval: this.state.selectedRecord['Auto Approval'] ? this.state.selectedRecord['Auto Approval'] : transactionStatus.NO,
                        nautoapprovalstatus: this.props.Login.userRoleTree && this.props.Login.userRoleTree.length > 0 && this.state.selectedRecord[this.props.Login.userRoleTree[0].nuserrolecode].approvalstatus ? this.state.selectedRecord[this.props.Login.userRoleTree[0].nuserrolecode].approvalstatus : transactionStatus.NA,
                        nautodescisionstatus: isAutoApprovalVersion ? transactionStatus.PASS : this.props.Login.userRoleTree && this.props.Login.userRoleTree.length > 0 && this.state.selectedRecord[this.props.Login.userRoleTree[0].nuserrolecode].decisionstatus ? (this.state.selectedRecord[this.props.Login.userRoleTree[0].nuserrolecode].decisionstatus[0] || transactionStatus.DRAFT) : transactionStatus.DRAFT,
                        nautoallot: this.state.selectedRecord['IDS_AUTOALLOT'] ? this.state.selectedRecord['IDS_AUTOALLOT'] : transactionStatus.NO,
                        nneedjoballocation: this.state.selectedRecord['IDS_JOBALLOCATION'] ? this.state.selectedRecord['IDS_JOBALLOCATION'] : transactionStatus.NO,
                        nstatus: transactionStatus.ACTIVE,
                        nneedautoouterband: this.state.selectedRecord['nneedautoouterband'] ? this.state.selectedRecord['nneedautoouterband'] : transactionStatus.NO,
                        nneedautoinnerband: this.state.selectedRecord['nneedautoinnerband'] ? this.state.selectedRecord['nneedautoinnerband'] : transactionStatus.NO,
                        ...temp1
                    }
                }
                else {


                    inputData['approveconfigversion'] = {
                        napprovalconfigcode: this.props.Login.masterData.realApprovalConfigCode,
                        napproveconfversionno: -1,
                        ntransactionstatus: transactionStatus.DRAFT,
                        ntreeversiontempcode: this.props.Login.userRoleTree[0].ntreeversiontempcode,
                        sapproveconfversiondesc: '-',
                        nsitecode: this.props.Login.userInfo.nmastersitecode,
                        nstatus: transactionStatus.ACTIVE
                    }
                    const temp1 = {};
                    this.props.Login.versionConfig.map(temp => {
                        if (temp.ntranscode === transactionStatus.AUTOAPPROVAL) {
                            temp1['nneedautoapproval'] = this.state.selectedRecord[temp.stransdisplaystatus] ? this.state.selectedRecord[temp.stransdisplaystatus] : transactionStatus.NO
                        }
                        else if (temp.ntranscode === transactionStatus.AUTOCOMPLETE) {
                            temp1['nneedautocomplete'] = this.state.selectedRecord[temp.stransdisplaystatus] ? this.state.selectedRecord[temp.stransdisplaystatus] : transactionStatus.NO
                        }



                    })
                    inputData['approvalconfigautoapproval'] = {
                        napprovalconfigcode: this.props.Login.masterData.realApprovalConfigCode,
                        sversionname: this.state.selectedRecord.sversionname,
                        // nneedautocomplete: this.state.selectedRecord['Auto Complete'] ? this.state.selectedRecord['Auto Complete'] : transactionStatus.NO,
                        //  nneedautoapproval: this.state.selectedRecord['Auto Approval'] ? this.state.selectedRecord['Auto Approval'] : transactionStatus.NO,
                        nautoapprovalstatus: this.props.Login.userRoleTree && this.props.Login.userRoleTree.length > 0 && this.state.selectedRecord[this.props.Login.userRoleTree[0].nuserrolecode].approvalstatus ? this.state.selectedRecord[this.props.Login.userRoleTree[0].nuserrolecode].approvalstatus : transactionStatus.NA,
                        nautodescisionstatus: isAutoApprovalVersion ? transactionStatus.PASS : this.props.Login.userRoleTree && this.props.Login.userRoleTree.length > 0 && this.state.selectedRecord[this.props.Login.userRoleTree[0].nuserrolecode].decisionstatus ? (this.state.selectedRecord[this.props.Login.userRoleTree[0].nuserrolecode].decisionstatus[0] || transactionStatus.DRAFT) : transactionStatus.DRAFT,
                        nautoallot: this.state.selectedRecord['IDS_AUTOALLOT'] ? this.state.selectedRecord['IDS_AUTOALLOT'] : transactionStatus.NO,
                        nneedjoballocation: this.state.selectedRecord['IDS_JOBALLOCATION'] ? this.state.selectedRecord['IDS_JOBALLOCATION'] : transactionStatus.NO,
                        nneedautoouterband: this.state.selectedRecord['nneedautoouterband'] ? this.state.selectedRecord['nneedautoouterband'] : transactionStatus.NO,
                        nneedautoinnerband: this.state.selectedRecord['nneedautoinnerband'] ? this.state.selectedRecord['nneedautoinnerband'] : transactionStatus.NO,
                        nstatus: transactionStatus.ACTIVE,
                        ...temp1
                    }
                }
                finalInputData['approvalconfigversion'] = inputData
                finalInputData['userinfo'] = this.props.Login.userInfo
                inputParam = {
                    methodUrl: 'ApprovalConfigVersion',
                    classUrl: this.props.Login.inputParam.classUrl,
                    displayName: "IDS_APPROVALCONFIG",
                    inputData: finalInputData, saveType, formRef,
                    operation: this.props.Login.operation,
                    postParam, searchRef: this.searchRef,
                    selectedRecord: { ...this.state.selectedRecord }
                }
                const masterData = this.props.Login.masterData;
                if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolcode)) {
                    const updateInfo = {
                        typeName: DEFAULT_RETURN,
                        data: {
                            loadEsign: true, screenData: { inputParam, masterData }, saveType,
                            openModal: true, operation: this.props.Login.operation, screenName: this.props.intl.formatMessage({ id: "IDS_APPROVALCONFIG" })
                        }
                    }
                    this.props.updateStore(updateInfo);
                }
                else {
                    this.props.crudMaster(inputParam, masterData, "openModal");
                }
            } else {
                toast.warn(this.props.intl.formatMessage({ id: "IDS_FILLDETAILSFOR" }) + " " + errormessage.join(","))
            }
        }
    }
    render() {

        let versionStatusCSS = "outline-secondary";
        if (this.props.Login.masterData.selectedVersion && this.props.Login.masterData.selectedVersion.ntransactionstatus === transactionStatus.APPROVED) {
            versionStatusCSS = "outline-success";
        }
        else if (this.props.Login.masterData.selectedVersion && this.props.Login.masterData.selectedVersion.ntransactionstatus === transactionStatus.RETIRED) {
            versionStatusCSS = "outline-danger";
        }
        const editId = this.state.controlMap.has("EditApprovalConfig") && this.state.controlMap.get("EditApprovalConfig").ncontrolcode;
        const deleteId = this.state.controlMap.has("DeleteApprovalConfig") && this.state.controlMap.get("DeleteApprovalConfig").ncontrolcode
        const approveId = this.state.controlMap.has("ApproveApprovalConfig") && this.state.controlMap.get("ApproveApprovalConfig").ncontrolcode
        const copyId = this.state.controlMap.has("CopyApprovalConfig") && this.state.controlMap.get("CopyApprovalConfig").ncontrolcode
        const addId = this.state.controlMap.has("AddApprovalConfig") && this.state.controlMap.get("AddApprovalConfig").ncontrolcode

        this.approvalSubTypeValue = this.props.Login.masterData.realApprovalSubTypeValue ?
            this.props.Login.masterData.realApprovalSubTypeValue
            : this.props.Login.masterData.approvalSubTypeValue ?
                this.props.Login.masterData.approvalSubTypeValue
                : this.props.Login.masterData.approvalsubtype ? this.props.Login.masterData.approvalsubtype.length > 0 ?
                    {
                        value: sortData(this.props.Login.masterData.approvalsubtype, 'ascending', 'napprovalsubtypecode')[0].napprovalsubtypecode,
                        label: sortData(this.props.Login.masterData.approvalsubtype, 'ascending', 'napprovalsubtypecode')[0].ssubtypename
                    } : {} : {};

        const filterParam = {
            inputListName: "versionData",
            selectedObject: "selectedVersion",
            primaryKeyField: "napproveconfversioncode",
            searchFieldList: ["sversionname", "sversionstatus", "sapproveconfversiondesc"],
            fetchUrl: "approvalconfig/getApprovalConfigVersion",
            fecthInputObject: { napprovalsubtypecode: this.approvalSubTypeValue.value, userinfo: this.props.Login.userInfo },
            masterData: this.props.Login.masterData,
            sortField: "napproveconfversioncode", sortOrder: "descending",

            //NIBSCRT-2294
            unchangeList: ["approvalsubtype", "approvalSubTypeValue", "registrationType", "registrationTypeValue",
                "registrationSubType", "registrationSubTypeValue", "ApprovalsubtypeList",
                "RegistrationTypeList", "RegistrationSubTypeList", "treeVersionTemplate", "userroleTemplateValue",
                "realApprovalSubTypeValue", "realRegistrationTypeValue", "realRegistrationSubTypeValue",
                "realTreeVersionTemplateValue", "approvalConfigCode", "realApprovalConfigCode"]
        };
        const selectedRole = this.props.Login.masterData.selectedRole ? this.props.Login.masterData.selectedRole : this.props.Login.masterData.approvalconfigRoleNames && this.props.Login.masterData.approvalconfigRoleNames.length > 0 && sortData(this.props.Login.masterData.approvalconfigRoleNames, 'ascending', 'nlevelno')[0]

        const mandatoryFields = [{ "idsName": "IDS_VERSIONNAME", "dataField": "sversionname", "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" }]
        this.props.Login.operation !== 'copy' && this.props.Login.userRoleTree && this.props.Login.userRoleTree.map(role => {
            mandatoryFields.push({ "idsName": "IDS_APPROVALSTATUS", "alertSuffix": ` - ${role.suserrolename}`, "dataField": `approvalstatus_${role.nuserrolecode}`, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" });
            mandatoryFields.push({ "idsName": "IDS_FILTERSTATUS", "alertSuffix": ` - ${role.suserrolename}`, "dataField": `filterstatus_${role.nuserrolecode}`, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" });
            mandatoryFields.push({ "idsName": "IDS_VALIDATIONSTATUS", "alertSuffix": ` - ${role.suserrolename}`, "dataField": `validationstatus_${role.nuserrolecode}`, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" });
            //ALPD-5334 added by Dhanushya RI,Enable mandatory field to non mandatory field
            // if (this.props.Login.decisionStatusOptions && this.props.Login.decisionStatusOptions.length > 0) {
            //     mandatoryFields.push({ "idsName": "IDS_DECISIONSTATUS", "alertSuffix": ` - ${role.suserrolename}`, "dataField": `decisionstatus_${role.nuserrolecode}` });
            // }
            return null;
        });
        let breadCrumbData = []
        if (this.props.Login.masterData.realApprovalSubTypeValue && this.props.Login.masterData.realApprovalSubTypeValue.value === ApprovalSubType.TESTRESULTAPPROVAL) {
            breadCrumbData = [
                {
                    "label": "IDS_APPROVALSUBTYPE",
                    "value": this.props.Login.masterData.realApprovalSubTypeValue ? this.props.Login.masterData.realApprovalSubTypeValue.label : "NA"
                }, {
                    "label": "IDS_REGISTRATIONTYPE",
                    "value": this.props.Login.masterData.realRegistrationTypeValue ? this.props.Login.masterData.realRegistrationTypeValue.label : "NA"
                }, {
                    "label": "IDS_REGISTRATIONSUBTYPE",
                    "value": this.props.Login.masterData.realRegistrationSubTypeValue ? this.props.Login.masterData.realRegistrationSubTypeValue.label : "NA"
                }, {
                    "label": "IDS_USERROLETEMPLATE",
                    "value": this.props.Login.masterData.realTreeVersionTemplateValue ? this.props.Login.masterData.realTreeVersionTemplateValue.label : "NA"
                }
            ];
        } else {
            breadCrumbData = [
                {
                    "label": "IDS_APPROVALSUBTYPE",
                    "value": this.props.Login.masterData.realApprovalSubTypeValue ? this.props.Login.masterData.realApprovalSubTypeValue.label : "NA"
                }, {
                    "label": "IDS_USERROLETEMPLATE",
                    "value": this.props.Login.masterData.realTreeVersionTemplateValue ? this.props.Login.masterData.realTreeVersionTemplateValue.label : "NA"
                }
            ]
        }
        // console.log("this.approvalSubTypeValue:", Object.keys(this.approvalSubTypeValue).length);
        // console.log("this.props.Login.masterData.:", this.props.Login.masterData);
        const masterList = sortData((this.props.Login.masterData.searchedData || this.props.Login.masterData.versionData), "descending", "napproveconfversioncode");
        //console.log("masterList:", masterList);
        return (
            <>
                <div className="client-listing-wrap mtop-fixed-breadcrumb fixed_breadcrumd">
                    <Affix top={53}>
                        <BreadcrumbComponent breadCrumbItem={breadCrumbData} />
                    </Affix>
                    <Row noGutters={true}>
                        <Col md={`${!this.props.sidebarview ? '4' : "2"}`}>
                            <ListMaster
                                filterColumnData={this.props.filterColumnData}
                                masterData={this.props.Login.masterData}
                                userInfo={this.props.Login.userInfo}
                                screenName={this.props.intl.formatMessage({ id: "IDS_APPROVALCONFIG" })}
                                masterList={masterList}
                                getMasterDetail={(version) => this.props.getApprovalConfigVersion(version, this.approvalSubTypeValue.value, this.props.Login.userInfo, this.props.Login.masterData)}
                                selectedMaster={this.props.Login.masterData.selectedVersion}
                                primaryKeyField="napproveconfversioncode"
                                mainField="sversionname"
                                firstField="sapproveconfversiondesc"
                                secondField="sversionstatus"
                                isIDSField="Yes"
                                searchRef={this.searchRef}
                                filterParam={filterParam}
                                userRoleControlRights={this.state.userRoleControlRights}
                                addId={addId}
                                openModal={() => this.props.openModal("create", this.props.Login.masterData.realApprovalConfigCode, this.approvalSubTypeValue.value,
                                    this.props.Login.userInfo, addId, this.props.Login.masterData.realTreeVersionTemplateValue ? this.props.Login.masterData.realTreeVersionTemplateValue.value : -10)}
                                needAccordianFilter={false}
                                reloadData={this.reloadData}
                                hidePaging={true}
                                showFilterIcon={true}
                                //ALPD-5195--Vignesh R(21-01-2025)-->reg sub type and approval config-- filter issue, check description
                                onFilterSubmit={this.onFilterSubmit}
                               // callCloseFunction={true}
                                //closeFilter={this.closeFilter}
                                filterComponent={[
                                    {
                                        "IDS_SAMPLEFILTER":
                                            <SampleFilter
                                                selectedRecord={this.state.selectedRecord || {}}
                                                filterComboChange={this.onFilterComboChange}
                                                approvalSubTypeOptions={this.state.ApprovalsubtypeList}
                                                approvalSubTypeValue={this.props.Login.masterData.approvalSubTypeValue}
                                                registrationTypeOptions={this.state.RegistrationTypeList}
                                                registrationTypeValue={this.props.Login.masterData.registrationTypeValue}
                                                registrationSubTypeOptions={this.state.RegistrationSubTypeList}
                                                registrationSubTypeValue={this.props.Login.masterData.registrationSubTypeValue}
                                                userroleTemplateOptions={this.state.UserRoleTemplateList}
                                                userroleTemplateValue={this.props.Login.masterData.userroleTemplateValue}
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
                                    {this.props.Login.masterData.selectedVersion ? Object.entries(this.props.Login.masterData.selectedVersion).length > 0 ?
                                        <>
                                            <Card.Header>
                                                {/* <ReactTooltip place="bottom" globalEventOff='click' id="tooltip_list_wrap" /> */}
                                                <Card.Title>
                                                    <h1 className="product-title-main">{this.props.Login.masterData.selectedVersion.sversionname}</h1>
                                                </Card.Title>
                                                <Card.Subtitle className="readonly-text font-weight-normal">
                                                    <Row>
                                                        <Col md={8} >
                                                            <h2 className="product-title-sub flex-grow-1">
                                                                {`${this.props.intl.formatMessage({ id: "IDS_VERSIONNO" })}:${this.props.Login.masterData.selectedVersion.sapproveconfversiondesc}`}
                                                                <span className={`btn btn-outlined ${versionStatusCSS} btn-sm ml-3`}>
                                                                    {/* <i class="fas fa-check "></i>  */}
                                                                    {this.props.Login.masterData.selectedVersion.sversionstatus}
                                                                </span>
                                                            </h2>
                                                        </Col>
                                                        <Col md={4}>
                                                            <>
                                                                <div className="d-flex product-category" style={{ float: "right" }}>
                                                                    {/* <Tooltip position="bottom" anchorElement="target" openDelay={100} parentTitle={true}> */}
                                                                    <div className="d-inline ">
                                                                        <Nav.Link
                                                                            hidden={this.state.userRoleControlRights.indexOf(editId) === -1}
                                                                            className="btn btn-circle outline-grey mr-2"
                                                                            data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_EDIT" })}
                                                                            //  data-for="tooltip_list_wrap"
                                                                            onClick={() => this.props.getApprovalConfigEditData(this.props.Login.masterData.selectedVersion.napproveconfversioncode, this.approvalSubTypeValue.value, this.props.Login.userInfo, this.props.Login.masterData, editId)}>
                                                                            <FontAwesomeIcon icon={faPencilAlt} title={this.props.intl.formatMessage({ id: "IDS_EDIT" })} />
                                                                        </Nav.Link>
                                                                        <Nav.Link className="btn btn-circle outline-grey mr-2"
                                                                            data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_DELETE" })}
                                                                            //  data-for="tooltip_list_wrap"
                                                                            hidden={this.state.userRoleControlRights.indexOf(deleteId) === -1}
                                                                            onClick={() => this.ConfirmDelete(deleteId)}>
                                                                            <FontAwesomeIcon icon={faTrashAlt} />
                                                                            {/* <ConfirmDialog
                                                                        name="deleteMessage"
                                                                        message={this.props.intl.formatMessage({ id: "IDS_DEFAULTCONFIRMMSG" })}
                                                                        doLabel={this.props.intl.formatMessage({ id: "IDS_OK" })}
                                                                        doNotLabel={this.props.intl.formatMessage({ id: "IDS_CANCEL" })}
                                                                        icon={faTrashAlt}
                                                                        //title={this.props.intl.formatMessage({ id: "IDS_DELETE" })}
                                                                        hidden={this.state.userRoleControlRights.indexOf(deleteId) === -1}
                                                                        handleClickDelete={() => this.deleteApprovalConfigVersion(deleteId)}
                                                                    /> */}
                                                                        </Nav.Link>
                                                                        <Nav.Link
                                                                            hidden={this.state.userRoleControlRights.indexOf(approveId) === -1}
                                                                            className="btn btn-circle outline-grey mr-2"
                                                                            data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_APPROVE" })}
                                                                            // data-for="tooltip_list_wrap"
                                                                            onClick={() => this.approveVersion(approveId)}>
                                                                            <FontAwesomeIcon icon={faThumbsUp} />
                                                                        </Nav.Link>
                                                                        <Nav.Link
                                                                            hidden={this.state.userRoleControlRights.indexOf(copyId) === -1}
                                                                            className="btn btn-circle outline-grey mr-2"
                                                                            data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_COPY" })}
                                                                            //  data-for="tooltip_list_wrap"
                                                                            onClick={() => this.props.copyVersion(this.approvalSubTypeValue.value, this.props.Login.userInfo, this.props.Login.masterData, copyId)}>
                                                                            <FontAwesomeIcon icon={faCopy} title={this.props.intl.formatMessage({ id: "IDS_COPY" })} />
                                                                        </Nav.Link>
                                                                    </div>
                                                                    {/* </Tooltip> */}
                                                                </div>
                                                            </>
                                                        </Col>
                                                    </Row>
                                                </Card.Subtitle>
                                            </Card.Header>
                                            <Card.Body>

                                                <Card.Text>
                                                    <Row>
                                                        {this.props.Login.masterData.approvalSubTypeValue && this.props.Login.masterData.approvalSubTypeValue !== undefined
                                                            && (this.props.Login.masterData.approvalSubTypeValue.value === ApprovalSubType.TESTRESULTAPPROVAL
                                                                || this.props.Login.masterData.approvalSubTypeValue.value === ApprovalSubType.PROTOCOLAPPROVAL) ?
                                                            <>
                                                                <Col md="6">
                                                                    <FormGroup>
                                                                        <FormLabel><FormattedMessage id={"IDS_VIEWNAME"} /></FormLabel>
                                                                        <ReadOnlyText>{
                                                                            this.props.Login.masterData.selectedVersion.sviewname === "" ? '-'
                                                                                : this.props.Login.masterData.selectedVersion.sviewname}</ReadOnlyText>
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="6">
                                                                    <FormGroup>
                                                                        <FormLabel><FormattedMessage id={"IDS_TEMPLATEMAPPINGVERSION"} /></FormLabel>
                                                                        <ReadOnlyText>{this.props.Login.masterData.selectedVersion.stemplatemappingversion}</ReadOnlyText>
                                                                    </FormGroup>
                                                                </Col>
                                                            </>
                                                            : ""}
                                                    </Row>
                                                    <Row>
                                                        <Col>

                                                            <Card>
                                                                <Card.Header><FormattedMessage id="IDS_AUTOAPPROVAL" message="Auto Approval" /></Card.Header>
                                                                <Card.Body>
                                                                    <Row>
                                                                        { /*Added by sonia on 14th NOV 2024 for jira id: ALPD-5086	*/}


                                                                        {this.props.Login.masterData.approvalSubTypeValue &&
                                                                            this.props.Login.masterData.approvalSubTypeValue !== undefined &&
                                                                            this.props.Login.masterData.approvalSubTypeValue.value === ApprovalSubType.TESTRESULTAPPROVAL ?
                                                                            <>
                                                                                <Col md="4">
                                                                                    <FormGroup>
                                                                                        <FormLabel><FormattedMessage id={'IDS_AUTOINNERBAND'} /></FormLabel>
                                                                                        <ReadOnlyText>{this.props.Login.masterData.selectedVersion.sneedautoinnerband}</ReadOnlyText>
                                                                                    </FormGroup>
                                                                                </Col>
                                                                                <Col md="4">
                                                                                    <FormGroup>
                                                                                        <FormLabel><FormattedMessage id={'IDS_AUTOOUTERBAND'} /></FormLabel>
                                                                                        <ReadOnlyText>{this.props.Login.masterData.selectedVersion.sneedautoouterband}</ReadOnlyText>
                                                                                    </FormGroup>
                                                                                </Col>
                                                                            </>

                                                                            : ""}
                                                                        {this.props.Login.masterData.versionConfig ? this.props.Login.masterData.versionConfig.map(item =>
                                                                            <Col md="4">
                                                                                <FormGroup>
                                                                                    <FormLabel>
                                                                                        {this.props.Login.masterData.approvalSubTypeValue &&
                                                                                            this.props.Login.masterData.approvalSubTypeValue !== undefined &&
                                                                                            this.props.Login.masterData.approvalSubTypeValue.value === ApprovalSubType.TESTRESULTAPPROVAL ?
                                                                                            <FormattedMessage id={'IDS_ANYCASE'} />
                                                                                            : ""//<FormattedMessage id={'IDS_AUTOAPPROVAL'} /> 
                                                                                        }

                                                                                    </FormLabel>
                                                                                    <ReadOnlyText>{this.props.Login.masterData.selectedVersion[`${item.ntranscode}`]}</ReadOnlyText>
                                                                                </FormGroup>
                                                                            </Col>
                                                                        ) : ""}

                                                                    </Row>

                                                                </Card.Body>
                                                            </Card>
                                                        </Col>
                                                    </Row>



                                                </Card.Text>
                                                <Row oGutters={true}>
                                                    <Col md={12}>
                                                        <Card className="at-tabs">
                                                            {this.props.Login.masterData ? this.props.Login.masterData.approvalconfigRoleNames && this.props.Login.masterData.approvalconfigRoleNames.length > 0 ?
                                                                <CustomAccordion
                                                                    key="UserRoles"
                                                                    accordionTitle="suserrolename"
                                                                    accordionComponent={this.userRoleAccordion(this.props.Login.masterData.approvalconfigRoleNames)}
                                                                    inputParam={{ masterData: this.props.Login.masterData, userinfo: this.props.Login.userInfo, napprovalsubtypecode: this.approvalSubTypeValue.value }}
                                                                    accordionClick={this.props.getRoleDetails}
                                                                    accordionPrimaryKey={"napprovalconfigrolecode"}
                                                                    accordionObjectName={"role"}
                                                                    selectedKey={selectedRole.napprovalconfigrolecode}

                                                                />
                                                                : "" : ""}
                                                        </Card>
                                                    </Col>
                                                </Row>
                                            </Card.Body>
                                        </>
                                        : "" : ""}
                                </Card>
                            </ContentPanel>
                        </Col>
                    </Row>
                </div>
                {this.props.Login.openModal ?
                    <SlideOutModal
                        onSaveClick={this.onSaveClick}
                        operation={this.props.Login.operation}
                        screenName={"IDS_APPROVALCONFIG"}
                        closeModal={this.handleClose}
                        show={this.props.Login.openModal}
                        inputParam={this.props.Login.inputParam}
                        esign={this.props.Login.loadEsign}
                        validateEsign={this.validateEsign}
                        masterStatus={this.props.Login.masterStatus}
                        updateStore={this.props.updateStore}
                        selectedRecord={this.state.selectedRecord || {}}
                        mandatoryFields={this.props.Login.operation === 'approve' ? [{ "idsName": "IDS_VIEWNAME", "dataField": "sviewname", "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
                        { "idsName": "IDS_TEMPLATEMAPPING", "dataField": "ndesigntemplatemappingcode", "mandatoryLabel": "IDS_SELECT", "controlType": "combo" }] : mandatoryFields}
                        addComponent={this.props.Login.loadEsign ?
                            <Esign operation={this.props.Login.operation}
                                onInputOnChange={this.onInputOnChange}
                                inputParam={this.props.Login.inputParam}
                                selectedRecord={this.state.selectedRecord || {}}
                            />
                            : this.props.Login.operation === 'approve' ?
                                <>
                                    <Row>
                                        <Col md={12}>
                                            <FormSelectSearch
                                                name={"ndesigntemplatemappingcode"}
                                                formLabel={this.props.intl.formatMessage({ id: "IDS_TEMPLATEMAPPING" })}
                                                placeholder="Please Select..."
                                                options={this.props.Login.designTemplateMapping}
                                                // optionId="ntimezonecode"
                                                // optionValue="stimezoneid"
                                                value={this.state.selectedRecord["ndesigntemplatemappingcode"]}
                                                //defaultValue={props.selectedRecord["ndesigntemplatemapping"]}
                                                isMandatory={true}
                                                isMulti={false}
                                                isSearchable={false}
                                                isClearable={false}
                                                isDisabled={true}
                                                closeMenuOnSelect={true}
                                                onChange={(event) => this.onComboChange(event, 'ndesigntemplatemappingcode')}
                                            />
                                            <FormInput
                                                label={this.props.intl.formatMessage({ id: "IDS_VIEWNAME" })}
                                                name={"sviewname"}
                                                type="text"
                                                onChange={(event) => this.onInputOnChange(event)}
                                                placeholder={this.props.intl.formatMessage({ id: "IDS_VIEWNAME" })}
                                                value={this.state.selectedRecord["sviewname"]}
                                                isMandatory={true}
                                                //required={true}
                                                maxLength={30}
                                                onPaste={true}
                                            />

                                        </Col>
                                    </Row>
                                </>
                                :
                                <AddApprovalConfig
                                    selectedRecord={this.state.selectedRecord ? this.state.selectedRecord : {}}
                                    userRoleTree={this.props.Login.userRoleTree}
                                    approvalSubTypeValue={this.approvalSubTypeValue}//filter
                                    onInputOnChange={this.onInputOnChange}
                                    onComboChange={this.onComboChange}
                                    approvalStatusOptions={this.props.Login.approvalStatusOptions}
                                    approvalStatusValue={this.props.Login.approvalStatusValue}
                                    filterStatusOptions={this.props.Login.filterStatusOptions}
                                    filterStatusValues={this.props.Login.filterStatusValues}
                                    topLevelValidStatusOptions={this.props.Login.topLevelValidStatusOptions}
                                    validationStatusOptions={this.props.Login.validationStatusOptions}
                                    validationStatusValues={this.props.Login.validationStatusValues}
                                    decisionStatusOptions={this.props.Login.decisionStatusOptions}
                                    decisionStatusValues={this.props.Login.decisionStatusValues}
                                    actionStatus={this.props.Login.actionStatus}
                                    checklistOptions={this.props.Login.checklistOptions}
                                    checklistValues={this.props.Login.checklistValues}
                                    roleConfig={this.props.Login.roleConfig}
                                    versionConfig={this.props.Login.versionConfig}
                                    operation={this.props.Login.operation}
                                    nsubType={this.approvalSubTypeValue.value}
                                    registrationTypeOptions={this.props.Login.optCopyRegType}
                                    registrationTypeValue={this.state.registrationTypeValue}//filter
                                    registrationSubTypeOptions={this.props.Login.optCopyRegSubType}
                                    registrationSubTypeValue={this.state.registrationSubTypeValue}//filter
                                    selectedVersion={this.props.Login.masterData.selectedVersion}
                                    masterData={this.props.Login.masterData}

                                />}
                    />
                    : ""}
            </>
        );
    }
    ConfirmDelete = (deleteId) => {
        this.confirmMessage.confirm("deleteMessage", this.props.intl.formatMessage({ id: "IDS_DELETE" }), this.props.intl.formatMessage({ id: "IDS_DEFAULTCONFIRMMSG" }),
            this.props.intl.formatMessage({ id: "IDS_OK" }), this.props.intl.formatMessage({ id: "IDS_CANCEL" }),
            () => this.deleteApprovalConfigVersion(deleteId));
    }
    componentDidUpdate(previousProps) {
        let { selectedRecord, userRoleControlRights, controlMap, ApprovalsubtypeList,
            RegistrationTypeList, RegistrationSubTypeList, UserRoleTemplateList, filterStatusState, validationStatusState } = this.state;
        let updateState = false;
        if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord) {
            selectedRecord = this.props.Login.selectedRecord;
            updateState = true;
        }
        if (this.props.Login.userInfo.nformcode !== previousProps.Login.userInfo.nformcode) {
            userRoleControlRights = [];
            if (this.props.Login.userRoleControlRights) {
                this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode] && Object.values(this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode]).map(item =>
                    userRoleControlRights.push(item.ncontrolcode))
            }
            controlMap = getControlMap(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode)
            // const ApprovalsubtypeListMap = constructOptionList(this.props.Login.masterData.approvalsubtype || [], "napprovalsubtypecode", "ssubtypename", 'ntemplatecode','ascending', false);
            // const RegistrationTypeListMap = constructOptionList(this.props.Login.masterData.registrationType || [], "nregtypecode", "sregtypename", 'ascending', 'nregtypecode', false);
            // const RegistrationSubTypeListMap = constructOptionList(this.props.Login.masterData.registrationSubType || [], "nregsubtypecode", "sregsubtypename", 'ascending', 'nregsubtypecode', false);
            const ApprovalsubtypeListMap = constructOptionList(this.props.Login.masterData.approvalsubtype || [], "napprovalsubtypecode", "ssubtypename", 'ntemplatecode', 'ascending', false);
            const RegistrationTypeListMap = constructOptionList(this.props.Login.masterData.registrationType || [], "nregtypecode", "sregtypename", 'nsorter', 'ascending', false);
            const RegistrationSubTypeListMap = constructOptionList(this.props.Login.masterData.registrationSubType || [], "nregsubtypecode", "sregsubtypename", 'nsorter', 'ascending', false);
            const UserRoleTemplateListMap = constructOptionList(this.props.Login.masterData.treeVersionTemplate || [], "ntreeversiontempcode", "sversiondescription", 'ntransactionstatus', 'descending', false);

            ApprovalsubtypeList = ApprovalsubtypeListMap.get("OptionList");
            RegistrationTypeList = RegistrationTypeListMap.get("OptionList");
            RegistrationSubTypeList = RegistrationSubTypeListMap.get("OptionList");
            UserRoleTemplateList = UserRoleTemplateListMap.get("OptionList");
            updateState = true;
        }
        if (this.props.Login.masterData !== previousProps.Login.masterData) {
            //this.setState({  RegistrationTypeList,RegistrationSubTypeList,templateVersionOptionList});  
            // RegistrationTypeList=this.props.Login.masterData.RegistrationTypeList
            // RegistrationSubTypeList=this.props.Login.masterData.RegistrationSubTypeList

            const RegistrationTypeListMap = constructOptionList(this.props.Login.masterData.registrationType || [], "nregtypecode", "sregtypename", 'nsorter', 'ascending', false);
            const RegistrationSubTypeListMap = constructOptionList(this.props.Login.masterData.registrationSubType || [], "nregsubtypecode", "sregsubtypename", 'nsorter', 'ascending', false);
            const UserRoleTemplateListMap = constructOptionList(this.props.Login.masterData.treeVersionTemplate || [], "ntreeversiontempcode", "sversiondescription", 'ntransactionstatus', 'descending', false);

            RegistrationTypeList = RegistrationTypeListMap.get("OptionList");
            RegistrationSubTypeList = RegistrationSubTypeListMap.get("OptionList");
            UserRoleTemplateList = UserRoleTemplateListMap.get("OptionList");
            updateState = true;

            // if (this.props.dataState === undefined) {
            //     filterStatusState = { skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5 };
            //     validationStatusState = { skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5 };
            // }
        }
        if (updateState) {
            this.setState({
                selectedRecord, userRoleControlRights, controlMap, ApprovalsubtypeList,
                RegistrationTypeList, RegistrationSubTypeList, UserRoleTemplateList, filterStatusState, validationStatusState
            })
        }
    }
    onInputOnChange = (event, role, action) => {

        const selectedRecord = this.state.selectedRecord || {};
        if (role) {
            let roleDetails = this.state.selectedRecord[role.nuserrolecode] || {}
            const fieldName = event.target.name.split('_')[0] + '_' + event.target.name.split('_')[1]
            let actionArray = selectedRecord[`actionStatus_${role.nuserrolecode}`] || [];
            if (event.target.type === 'checkbox') {
                if (action) {
                    if (event.target.checked) {
                        actionArray.push(action.ntranscode);
                    } else {
                        actionArray.splice(actionArray.indexOf(action.ntranscode), 1)
                    }
                    selectedRecord[`actionStatus_${role.nuserrolecode}`] = actionArray
                }
                roleDetails[fieldName] = event.target.checked === true ? transactionStatus.YES : transactionStatus.NO
                if (fieldName === 'IDS_PARTIALAPPROVAL' && roleDetails["IDS_PARTIALAPPROVAL"] && roleDetails["IDS_PARTIALAPPROVAL"] === transactionStatus.YES) {
                    roleDetails['IDS_SECTIONWISEAPPROVE'] = transactionStatus.NO
                }
                selectedRecord[role.nuserrolecode] = roleDetails
            }
            else {
                roleDetails[fieldName] = event.target.value
                selectedRecord[role.nuserrolecode] = roleDetails
            }
        }
        else {
            if (event.target.type === 'checkbox') {
                selectedRecord[event.target.name] = event.target.checked === true ? transactionStatus.YES : transactionStatus.NO;
                if (selectedRecord[event.target.name]) {
                    if (event.target.name === "nneedautoinnerband" && (selectedRecord["Auto Approval"] === transactionStatus.YES || selectedRecord["nneedautoouterband"] === transactionStatus.YES)) {
                        delete selectedRecord["Auto Approval"]
                        delete selectedRecord["nneedautoouterband"]

                    }
                    else if (event.target.name === "Auto Approval" && (selectedRecord["nneedautoinnerband"] === transactionStatus.YES || selectedRecord["nneedautoouterband"] === transactionStatus.YES)) {
                        delete selectedRecord["nneedautoinnerband"]
                        delete selectedRecord["nneedautoouterband"]

                    }
                    else if (event.target.name === "nneedautoouterband" && (selectedRecord["Auto Approval"] === transactionStatus.YES || selectedRecord["nneedautoinnerband"] === transactionStatus.YES)) {
                        delete selectedRecord["Auto Approval"]
                        delete selectedRecord["nneedautoinnerband"]
                    }

                }

            }
            else {
                if (event.target.name === 'sviewname') {
                    if (event.target.value !== "") {
                        // selectedRecord[event.target.name] =   event.target.value.replace(/[^a-z]/gi, '')
                        //event.target.value =  validateCreateView(event.target.value);
                        //Janakumar -> ALPD-5184 Approval configuration - In view name field ( when enter french lang 500 error is occurring ) (Both Normal & French)
                        const regex = /^[a-z0-9]+$/;
                        const regexNum = /^[0-9]+$/;
                        const value = regex.test(event.target.value);
                        if (value) {
                            selectedRecord[event.target.name] = event.target.value !== "" ? regexNum.test(event.target.value.charAt(0))
                                ? event.target.defaultValue : event.target.value : selectedRecord[event.target.name];
                        } else {
                            selectedRecord[event.target.name] = regexNum.test(event.target.value.charAt(0))
                                ? event.target.defaultValue : event.target.value.replace(/[^a-z0-9]/g, '');
                        }
                    } else {
                        selectedRecord[event.target.name] = event.target.value;
                    }
                } else {
                    selectedRecord[event.target.name] = event.target.value;
                }

            }
        }
        this.setState({ selectedRecord });
    }
    onComboChange = (comboData, role, comboName) => {
        const selectedRecord = this.state.selectedRecord || {};
        if (role) {
            let roleDetails = this.state.selectedRecord[role.nuserrolecode] || {}
            const fieldName = comboName.split('_')[0]
            let filterArray = [];
            roleDetails[fieldName] = [];
            if (comboData) {
                selectedRecord[comboName] = comboData
                if (fieldName === 'checklist') {
                    selectedRecord[`checklistVersion_${role.nuserrolecode}`] = { label: comboData.item.schecklistversionname, value: comboData.item.nchecklistversioncode }
                    filterArray = comboData.item.nchecklistversioncode;

                } else {
                    if (Array.isArray(comboData)) {
                        comboData.map(item => {
                            return (filterArray.push(item.value))
                        })
                    } else {
                        filterArray = comboData.value;
                    }
                }
                roleDetails[fieldName] = filterArray
                selectedRecord[role.nuserrolecode] = roleDetails
            } else {
                selectedRecord[comboName] = []
                filterArray = []
                roleDetails[fieldName] = filterArray
                selectedRecord[role.nuserrolecode] = roleDetails
            }
            this.setState({ selectedRecord });
        } else {
            selectedRecord[comboName] = comboData

            if (comboName === 'regtype') {
                this.props.getCopySubType(comboData, selectedRecord, this.props.Login.userInfo, this.props.Login.masterData, this.props.Login.optCopyRegType)
            } else {
                this.setState({ selectedRecord });
            }

        }
    }
    onFilterComboChange = (comboData, fieldName) => {

        const selectedRecord = this.state.selectedRecord || {};

        let approvalSubTypeValue = this.props.Login.masterData.approvalSubTypeValue;
        let registrationTypeValue = this.props.Login.masterData.registrationTypeValue;
        let registrationSubTypeValue;

        if (comboData) {

            selectedRecord[fieldName] = comboData.value;
            let inputData = {};
            if (fieldName === 'napprovalsubtypecode') {

                approvalSubTypeValue = comboData
                inputData = { nFlag: 2, napprovalsubtypecode: comboData.value, userinfo: this.props.Login.userInfo };

            } else if (fieldName === 'nregtypecode') {

                registrationTypeValue = comboData
                inputData = { nFlag: 3, napprovalsubtypecode: approvalSubTypeValue.value, nregtypecode: comboData.value, userinfo: this.props.Login.userInfo }

            } else if (fieldName === 'nregsubtypecode') {

                registrationSubTypeValue = comboData
                inputData = {
                    nFlag: 4, napprovalsubtypecode: approvalSubTypeValue.value,
                    nregtypecode: registrationTypeValue.value,
                    nregsubtypecode: comboData.value,
                    userinfo: this.props.Login.userInfo
                }
            }
            if (fieldName === 'ntreeversiontempcode') {
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        masterData: {
                            ...this.props.Login.masterData,
                            userroleTemplateValue: comboData
                        }
                    }
                }
                this.props.updateStore(updateInfo);
            } else {
                const oldState = {
                    approvalsubtype: this.props.Login.masterData.approvalsubtype,
                    registrationtype: this.props.Login.masterData.registrationType,
                    registrationsubtype: this.props.Login.masterData.registrationSubType,
                    approvalSubTypeValue,
                    registrationTypeValue,
                    registrationSubTypeValue,
                    RegistrationTypeList: this.state.RegistrationTypeList,
                    RegistrationSubTypeList: this.state.RegistrationSubTypeList,
                }
                let inputParamData = { inputData, masterData: this.props.Login.masterData }
                this.props.getFilterChange(inputParamData, oldState)
            }

        } else {
            selectedRecord[fieldName] = "";
            if (fieldName === 'napprovalsubtypecode') {

                this.approvalSubTypeValue = []
                registrationTypeValue = []
                registrationSubTypeValue = []

            } else if (fieldName === 'nregtypecode') {

                registrationTypeValue = []
                registrationSubTypeValue = []

            } else {

                registrationSubTypeValue = []

            }


            this.setState({ selectedRecord });
        }
        // this.searchRef.current.value = ""

    }
    getApprovalConfigurationVersion = () => {
        if (this.props.Login.masterData.approvalSubTypeValue) {
            //this.searchRef.current.value = ""
            let masterData = {
                ...this.props.Login.masterData,
                //ALPD-5195--Vignesh R(21-01-2025)-->reg sub type and approval config-- filter issue, check description
                //realApprovalSubTypeValue: this.props.Login.masterData.approvalSubTypeValue ? this.props.Login.masterData.approvalSubTypeValue : -1,
                //realRegistrationTypeValue: this.props.Login.masterData.registrationTypeValue ? this.props.Login.masterData.registrationTypeValue : -1,
                // realRegistrationSubTypeValue: this.props.Login.masterData.registrationSubTypeValue ? this.props.Login.masterData.registrationSubTypeValue : -1,
                //realApprovalConfigCode: this.props.Login.masterData.approvalConfigCode || -1,
                //realTreeVersionTemplateValue: this.props.Login.masterData.userroleTemplateValue || -1,

            }
            const inputData = {
                napprovalsubtypecode: this.props.Login.masterData.approvalSubTypeValue ?
                    this.props.Login.masterData.approvalSubTypeValue.value : -1,
                napprovalconfigcode: this.props.Login.masterData.realApprovalConfigCode,
                ntreeversiontempcode: this.props.Login.masterData.realTreeVersionTemplateValue.value,
                userinfo: this.props.Login.userInfo
            }
            let inputParamData = { inputData, masterData, searchRef: this.searchRef }
            this.props.getApprovalConfigurationVersion(inputParamData);
        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_APPROVALSUBTYPENOTAVAILABLE" }))
        }
    }
    //ATE234 janakumar -> ALPD-5616 Approval Configuration -->Copy Approval Configuration grid data displaying wrongly in specific scenario.
  //ALPD-5616--comment  by Vignesh R(04-04-2025)-->Copy Approval Configuration grid data displaying wrongly in specific scenario.
    /*closeFilter = () => {

        if (this.props.Login.masterData.approvalSubTypeValue) {

            let masterData = {
                ...this.props.Login.masterData,
                approvalSubTypeValue: this.props.Login.masterData.realApprovalSubTypeValue ? this.props.Login.masterData.realApprovalSubTypeValue : -1,
                registrationTypeValue: this.props.Login.masterData.realRegistrationTypeValue ? this.props.Login.masterData.realRegistrationTypeValue : -1,
                registrationSubTypeValue: this.props.Login.masterData.realRegistrationSubTypeValue ? this.props.Login.masterData.realRegistrationSubTypeValue : -1,
                userroleTemplateValue: this.props.Login.masterData.realTreeVersionTemplateValue || -1,

            }

            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    masterData,
                }
            }
            this.props.updateStore(updateInfo);
        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTALLINFILTER" }))
        }
    }*/
    //ALPD-5195--Vignesh R(21-01-2025)-->reg sub type and approval config-- filter issue, check description
    onFilterSubmit = () => {
        if (this.props.Login.masterData.approvalSubTypeValue) {

            let check = false;

            if (this.props.Login.masterData.approvalSubTypeValue.value === ApprovalSubType.TESTGROUPAPPROVAL) {
                if (this.props.Login.masterData.userroleTemplateValue.value === undefined) {
                    check = true;
                }

            } else if (this.props.Login.masterData.approvalSubTypeValue.value === ApprovalSubType.TESTRESULTAPPROVAL) {
                if (this.props.Login.masterData.userroleTemplateValue.value === undefined || this.props.Login.masterData.registrationSubTypeValue.value === undefined ||
                    this.props.Login.masterData.registrationTypeValue.value === undefined) {
                    check = true;
                }
            }
            if (!check) {

                //this.searchRef.current.value = ""
                let masterData = {
                    ...this.props.Login.masterData,
                    realApprovalSubTypeValue: this.props.Login.masterData.approvalSubTypeValue ? this.props.Login.masterData.approvalSubTypeValue : -1,
                    realRegistrationTypeValue: this.props.Login.masterData.registrationTypeValue ? this.props.Login.masterData.registrationTypeValue : -1,
                    realRegistrationSubTypeValue: this.props.Login.masterData.registrationSubTypeValue ? this.props.Login.masterData.registrationSubTypeValue : -1,
                    realApprovalConfigCode: this.props.Login.masterData.approvalConfigCode || -1,
                    realTreeVersionTemplateValue: this.props.Login.masterData.userroleTemplateValue || -1,

                }
                const inputData = {
                    napprovalsubtypecode: this.props.Login.masterData.approvalSubTypeValue ?
                        this.props.Login.masterData.approvalSubTypeValue.value : -1,
                    napprovalconfigcode: this.props.Login.masterData.approvalConfigCode,
                    ntreeversiontempcode: this.props.Login.masterData.userroleTemplateValue.value,
                    userinfo: this.props.Login.userInfo
                }
                let inputParamData = { inputData, masterData, searchRef: this.searchRef }
                this.props.getApprovalConfigurationVersion(inputParamData);
            }
            else {
                toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTALLINFILTER" }))
            }
        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_APPROVALSUBTYPENOTAVAILABLE" }))
        }
    }

    componentWillUnmount() {
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                masterData: [], inputParam: undefined, operation: null, modalName: undefined
            }
        }
        this.props.updateStore(updateInfo);
    }
    reloadData = () => {
        // this.searchRef.current.value = "";
        // const inputParam = {
        //     inputData: { "userinfo": this.props.Login.userInfo },
        //     classUrl: "approvalconfig",
        //     methodUrl: "ApprovalConfigFilter",
        //     userInfo: this.props.Login.userInfo,
        //     displayName: "IDS_APPROVALCONFIG"
        // };
        // this.props.callService(inputParam);
        this.getApprovalConfigurationVersion()
    }
    userRoleAccordion = (userRoleList) => {
        const accordionMap = new Map();
        userRoleList = sortData(userRoleList, 'ascending', 'nlevelno')
        userRoleList.map((role) =>
            accordionMap.set(role.napprovalconfigrolecode,
                <UserRoleAccordion
                    role={role}
                    roleConfig={this.props.Login.masterData.roleConfig}
                    userRoleControlRights={this.state.userRoleControlRights}
                    controlMap={this.state.controlMap}
                    userInfo={this.props.Login.userInfo}
                    masterData={this.props.Login.masterData}
                    deleteRecord={this.deleteRecord}
                    tabDetail={this.tabDetail(role)}
                    onTabOnChange={this.onTabOnChange}
                    approvalSubTypeValue={this.props.Login.masterData.approvalSubTypeValue}
                />)
        )
        return accordionMap;
    }
    tabDetail = () => {
        const selectedRole = this.props.Login.masterData.selectedRole ? this.props.Login.masterData.selectedRole : this.props.Login.masterData.approvalconfigRoleNames && this.props.Login.masterData.approvalconfigRoleNames.length > 0 && sortData(this.props.Login.masterData.approvalconfigRoleNames, 'ascending', 'nlevelno')[0]
        const tabMap = new Map();
        tabMap.set("IDS_FILTERSTATUS",
            <FilterStatusTab
                filterData={process(this.props.Login.masterData.roleFilters ?
                    // sortData(this.props.Login.masterData.roleFilters) : [],
                    // { skip: this.state.dataState.skip, take: this.state.dataState.take })}
                    sortData(this.props.Login.masterData.roleFilters) : [], this.state.filterStatusState)}
                setDefault={this.props.setDefault}
                selectedRole={selectedRole}
                napprovalsubtypecode={this.approvalSubTypeValue.value}
                userInfo={this.props.Login.userInfo}
                masterData={this.props.Login.masterData}
                dataState={this.state.filterStatusState}
                dataStateChange={(event) => this.setState({ filterStatusState: event.dataState })}
                screenName="IDS_FILTERSTATUS"
            />
        )

        tabMap.set("IDS_VALIDATIONSTATUS",
            <ValidationStatusTab
                validationStatus={process(this.props.Login.masterData.roleValidations ?
                    sortData(this.props.Login.masterData.roleValidations) : [], this.state.validationStatusState)}
                // sortData(this.props.Login.masterData.roleValidations) : [],
                // { skip: this.state.dataState.skip, take: this.state.dataState.take })}
                selectedRole={selectedRole}
                napprovalsubtypecode={this.approvalSubTypeValue.value}
                userInfo={this.props.Login.userInfo}
                masterData={this.props.Login.masterData}
                dataState={this.state.validationStatusState}
                dataStateChange={(event) => this.setState({ validationStatusState: event.dataState })}
                screenName="IDS_VALIDATIONSTATUS"
            />)
        //ATE234 Janakumar ALPD-5316 Test Approval -> Decision Status there have based on sample type.
        // if (this.props.Login.masterData.roleDecisions && this.props.Login.masterData.roleDecisions.length > 0) {
        //ALPD-5394 added by Dhanushya RI,Decision Status tab and combo should hide for testgroup and protocol subtype
        if (this.props.Login.masterData.realApprovalSubTypeValue
            && this.props.Login.masterData.realApprovalSubTypeValue.value !== ApprovalSubType.TESTGROUPAPPROVAL
            && this.props.Login.masterData.realApprovalSubTypeValue.value !== ApprovalSubType.PROTOCOLAPPROVAL) {
            tabMap.set("IDS_DECISIONSTATUS",
                <DecisionStatusTab
                    decisionData={process(this.props.Login.masterData.roleDecisions ? sortData(this.props.Login.masterData.roleDecisions) : [],
                        { skip: this.state.dataState.skip, take: this.state.dataState.take })}
                    setDefault={this.props.setDefault}
                    selectedRole={selectedRole}
                    napprovalsubtypecode={this.approvalSubTypeValue.value}
                    userInfo={this.props.Login.userInfo}
                    masterData={this.props.Login.masterData}
                    screenName="IDS_DECISIONSTATUS"
                />)
        }
        // }
        tabMap.set("IDS_ACTIONSTATUS",
            <ActionStatusTab
                actionData={process(this.props.Login.masterData.roleActions ? sortData(this.props.Login.masterData.roleActions) : [],
                    { skip: this.state.dataState.skip, take: this.state.dataState.take })}
                setDefault={this.props.setDefault}
                selectedRole={selectedRole}
                napprovalsubtypecode={this.approvalSubTypeValue.value}
                userInfo={this.props.Login.userInfo}
                masterData={this.props.Login.masterData}
                screenName="IDS_ACTIONSTATUS"
            />)
        return tabMap;
    }
    onTabOnChange = (tabProps) => {
        const screenName = tabProps.screenName;
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { screenName }
        }
        this.props.updateStore(updateInfo);
    }
}
export default connect(mapStateToProps,
    {
        callService, crudMaster, openModal, updateStore, getApprovalConfigVersion, getApprovalConfigEditData, copyVersion, getFilterChange
        , validateEsignCredential, getCopySubType, getRoleDetails, setDefault, filterColumnData,
        getApprovalConfigurationVersion, approveVersion
    })
    (injectIntl(ApprovalConfig));