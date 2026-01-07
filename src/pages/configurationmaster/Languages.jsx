import React from 'react';
import { ListWrapper } from '../../components/client-group.styles'
import { Row, Col, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { process } from '@progress/kendo-data-query';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { callService, crudMaster, showRegTypeAddScreen, fetchById, comboService, updateStore, validateEsignCredential } from '../../actions';
import { DEFAULT_RETURN } from '../../actions/LoginTypes';
import DataGrid from '../../components/data-grid/data-grid.component';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import SlideOutModal from '../../components/slide-out-modal/SlideOutModal';
import { showEsign, getControlMap, constructOptionList } from '../../components/CommonScript';
import Esign from '../audittrail/Esign';
import AddLanguageSynonym from '../../components/AddLanguages';
// import ReactTooltip from 'react-tooltip';
import { Affix } from 'rsuite';
import { faSync, faLanguage, faFilePdf } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const mapStateToProps = state => {
    return ({ Login: state.Login })
}

class Languages extends React.Component {
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
            mandatoryFields: []

        };
    }
    dataStateChange = (event) => {
        this.setState({
            dataResult: process(this.state.data.listofItem, event.dataState),
            dataState: event.dataState
        });
    }
    reloadData = () => {
        const inputParam = {
            inputData: { userinfo: this.props.Login.userInfo },
            methodUrl: "Language",
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
            this.mandatoryFields = [
                { "idsName": "IDS_DEFAULTLANGUAGE", "dataField": this.props.Login.languageList[0].value == "en-US" ? "sdefaultname" : " ", "mandatoryLabel": "IDS_ENTER", "controlType": "text" }
            ]
            if (this.props.Login.masterData.headername == "Menu") {
                this.extractedColumnList = [
                    { "idsName": "IDS_MENUID", "dataField": "smenuname", "width": "250px" },
                    { "idsName": "IDS_MENUNAME", "dataField": "sdisplayname", "width": "250px" }
                ]
                primaryKeyField = "nmenucode";
            } else if (this.props.Login.masterData.headername == "Module") {
                this.extractedColumnList = [
                    { "idsName": "IDS_MODULEID", "dataField": "smodulename", "width": "250px" },
                    { "idsName": "IDS_MODULENAME", "dataField": "sdisplayname", "width": "250px" },
                ]
                primaryKeyField = "nmodulecode";
            } else if (this.props.Login.masterData.headername == "Forms") {
                this.extractedColumnList = [
                    { "idsName": "IDS_FORMID", "dataField": "sformname", "width": "250px" },
                    { "idsName": "IDS_FORMNAME", "dataField": "sdisplayname", "width": "250px" },
                ]
                primaryKeyField = "nformcode";
            } else if (this.props.Login.masterData.headername == "Transaction Status") {
                this.extractedColumnList = [
                    { "idsName": "IDS_TRANSACTIONSTATUSID", "dataField": "stransstatus", "width": "250px" },
                    { "idsName": "IDS_ACTIONDISPLAYSTATUS", "dataField": "sactiondisplaystatus", "width": "250px" },
                    { "idsName": "IDS_TRANSDISPLAYSTATUS", "dataField": "stransdisplaystatus", "width": "250px" },
                ]
                primaryKeyField = "ntranscode";
            } else if (this.props.Login.masterData.headername == "Control Master") {
                this.extractedColumnList = [
                    { "idsName": "IDS_SCREENNAME", "dataField": "sformname", "width": "250px" },
                    { "idsName": "IDS_CONTROLMASTERID", "dataField": "scontrolname", "width": "250px" },
                    { "idsName": "IDS_CONTROLMASTER", "dataField": "sdisplayname", "width": "250px" },
                ]
                primaryKeyField = "ncontrolcode";
            } else if (this.props.Login.masterData.headername == "Approval Sub Type") {
                this.extractedColumnList = [
                    { "idsName": "IDS_APPROVALSUBTYPEID", "dataField": "sdisplayname", "width": "250px" },
                    { "idsName": "IDS_APPROVALSUBTYPENAME", "dataField": "sapprovalsubtypename", "width": "250px" },
                ]
                primaryKeyField = "napprovalsubtypecode";
            } else if (this.props.Login.masterData.headername == "Sample Type") {
                this.extractedColumnList = [
                    { "idsName": "IDS_SAMPLETYPEID", "dataField": "sdisplayname", "width": "250px" },
                    { "idsName": "IDS_SAMPLETYPENAME", "dataField": "ssampletypename", "width": "250px" },
                ]
                primaryKeyField = "nsampletypecode";
            }
            // else if (this.props.Login.masterData.headername == "Template Design") {
            //     this.extractedColumnList = [
            //         { "idsName": "IDS_TEMPLATETYPEID", "dataField": "sdisplayname", "width": "250px" },
            //         { "idsName": "IDS_TEMPLATETYPENAME", "dataField": "stemplatetypename", "width": "250px" }
            //     ]
            //     primaryKeyField = "ntemplatetypecode";
            // }
            else if (this.props.Login.masterData.headername == "Period") {
                this.extractedColumnList = [
                    { "idsName": "IDS_PERIODID", "dataField": "sdisplayname", "width": "250px" },
                    { "idsName": "IDS_PERIODNAME", "dataField": "speriodname", "width": "250px" }
                ]
                primaryKeyField = "nperiodcode";
            } else if (this.props.Login.masterData.headername == "Gender") {
                this.extractedColumnList = [
                    { "idsName": "IDS_GENDERID", "dataField": "sdisplayname", "width": "250px" },
                    { "idsName": "IDS_GENDERNAME", "dataField": "sgendername", "width": "250px" }
                ]
                primaryKeyField = "ngendercode";
            } else if (this.props.Login.masterData.headername == "Grade") {
                this.extractedColumnList = [
                    { "idsName": "IDS_GRADEID", "dataField": "sgradename", "width": "250px" },
                    { "idsName": "IDS_GRADENAME", "dataField": "sdisplayname", "width": "250px" }
                ]
                primaryKeyField = "ngradecode";
            } else if (this.props.Login.masterData.headername == "Scheduler Type") {
                this.extractedColumnList = [
                    { "idsName": "IDS_SCHEDULERTYPEID", "dataField": "sdisplayname", "width": "250px" },
                    { "idsName": "IDS_SCHEDULERTYPENAME", "dataField": "sschedulertypename", "width": "250px" }
                ]
                primaryKeyField = "nschedulertypecode";
            } else if (this.props.Login.masterData.headername == "Query Builder Tables") {
                this.extractedColumnList = [
                    { "idsName": "IDS_FORMS", "dataField": "sformname", "width": "250px" },
                    { "idsName": "IDS_SQLQUERYBUILDERID", "dataField": "stablename", "width": "250px" },
                    { "idsName": "IDS_SQLQUERYBUILDERNAME", "dataField": "sdisplayname", "width": "250px" }
                ]
                primaryKeyField = "nquerybuildertablecode";
            } else if (this.props.Login.masterData.headername == "Query Builder Views") {
                this.extractedColumnList = [
                    { "idsName": "IDS_VIEWSQUERYBUILDERID", "dataField": "sviewname", "width": "250px" },
                    { "idsName": "IDS_VIEWSQUERYBUILDERNAME", "dataField": "sdisplayname", "width": "250px" }
                ]
                primaryKeyField = "nquerybuilderviewscode";
            } else if (this.props.Login.masterData.headername == "Query Builder Views Columns") {
                this.extractedColumnList = [
                    // { "idsName": "IDS_QUERYBUILDERVIEWSCOLUMNSNAME", "dataField": "sviewname", "width": "250px" },
                    { "idsName": "IDS_QUERYBUILDERVIEWSCOLUMNSID", "dataField": "sdisplayname", "width": "250px" }
                ]
                primaryKeyField = 'index';
            } else if (this.props.Login.masterData.headername == "Multilingual Masters") {
                this.extractedColumnList = [
                    { "idsName": "IDS_MULTILINGUALMASTERSID", "dataField": "sdisplayname", "width": "250px" },
                    { "idsName": "IDS_MULTILINGUALMASTERSAME", "dataField": "sdefaultname", "width": "250px" }
                ]
                primaryKeyField = "nmultilingualmasterscode";
            } else if (this.props.Login.masterData.headername == "Material Type") {
                this.extractedColumnList = [
                    { "idsName": "IDS_MATERIALTYPEID", "dataField": "smaterialtypename", "width": "250px" },
                    { "idsName": "IDS_MATERIALTYPENAME", "dataField": "sdisplayname", "width": "250px" }
                ]
                primaryKeyField = "nmaterialtypecode";
            } else if (this.props.Login.masterData.headername == "Interface Type") {
                this.extractedColumnList = [
                    { "idsName": "IDS_INTERFACETYPEID", "dataField": "sinterfacetypename", "width": "250px" },
                    { "idsName": "IDS_INTERFACETYPENAME", "dataField": "sdisplayname", "width": "250px" }
                ]
                primaryKeyField = "ninterfacetypecode";
            } else if (this.props.Login.masterData.headername == "Audit Action Filter") {
                this.extractedColumnList = [
                    { "idsName": "IDS_AUDITACTIONFILTERID", "dataField": "sauditactionfiltername", "width": "250px" },
                    { "idsName": "IDS_AUDITACTIONFILTERNAME", "dataField": "sdisplayname", "width": "250px" }
                ]
                primaryKeyField = "nauditactionfiltercode";
            } else if (this.props.Login.masterData.headername == "Attachment Type") {
                this.extractedColumnList = [
                    { "idsName": "IDS_ATTACHMENTTYPEID", "dataField": "sdefaultname", "width": "250px" },
                    { "idsName": "IDS_ATTACHMENTTYPENAME", "dataField": "sdisplayname", "width": "250px" }
                ]
                primaryKeyField = "nattachmenttypecode";
            } else if (this.props.Login.masterData.headername == "FTP Type") {
                this.extractedColumnList = [
                    { "idsName": "IDS_FTPTYPEID", "dataField": "sdefaultname", "width": "250px" },
                    { "idsName": "IDS_FTPTYPENAME", "dataField": "sdisplayname", "width": "250px" }
                ]
                primaryKeyField = "nftptypecode";
            } else if (this.props.Login.masterData.headername == "Report Type") {
                this.extractedColumnList = [
                    { "idsName": "IDS_REPORTTYPEID", "dataField": "sreporttypename", "width": "250px" },
                    { "idsName": "IDS_REPORTTYPENAME", "dataField": "sdisplayname", "width": "250px" }
                ]
                primaryKeyField = "nreporttypecode";
            } else if (this.props.Login.masterData.headername == "COAReport Type") {
                this.extractedColumnList = [
                    { "idsName": "IDS_COAREPORTTYPEID", "dataField": "scoareporttypename", "width": "250px" },
                    { "idsName": "IDS_COAREPORTTYPENAME", "dataField": "sdisplayname", "width": "250px" }
                ]
                primaryKeyField = "ncoareporttypecode";
            } else if (this.props.Login.masterData.headername == "React Components") {
                this.extractedColumnList = [
                    { "idsName": "IDS_REACTCOMPONENTID", "dataField": "componentname", "width": "250px" },
                    { "idsName": "IDS_REACTCOMPONENTNAME", "dataField": "sdisplayname", "width": "250px" }
                ]
                primaryKeyField = "nreactcomponentcode";
            }
            else if (this.props.Login.masterData.headername == "Functions") {
                this.extractedColumnList = [
                    { "idsName": "IDS_FUNCTIONSID", "dataField": "sfunctionname", "width": "250px" },
                    { "idsName": "IDS_FUNCTIONSNAME", "dataField": "sdisplayname", "width": "250px" }
                ]
                primaryKeyField = "nfunctioncode";
            }
            else if (this.props.Login.masterData.headername == "Dynamic Formula Fields") {
                this.extractedColumnList = [
                    { "idsName": "IDS_DYNAMICFORMULAFIELDSID", "dataField": "sdefaultname", "width": "250px" },
                    { "idsName": "IDS_DYNAMICFORMULAFIELDSNAME", "dataField": "sdisplayname", "width": "250px" }
                ]
                primaryKeyField = "ndynamicformulafieldcode";
            }
            else if (this.props.Login.masterData.headername == "Chart Type") {
                this.extractedColumnList = [
                    { "idsName": "IDS_CHARTTYPEID", "dataField": "sdefaultname", "width": "250px" },
                    { "idsName": "IDS_CHARTTYPENAME", "dataField": "sdisplayname", "width": "250px" }
                ]
                primaryKeyField = "ncharttypecode";
            }
            else if (this.props.Login.masterData.headername == "Design Components") {
                this.extractedColumnList = [
                    { "idsName": "IDS_DESIGNCOMPONENTSID", "dataField": "sdefaultname", "width": "250px" },
                    { "idsName": "IDS_DESIGNCOMPONENTSNAME", "dataField": "sdisplayname", "width": "250px" }
                ]
                primaryKeyField = "ndesigncomponentcode";
            }
            else if (this.props.Login.masterData.headername == "CheckList Component") {
                this.extractedColumnList = [
                    { "idsName": "IDS_CHECKLISTCOMPONENTID", "dataField": "scomponentname", "width": "250px" },
                    { "idsName": "IDS_CHECKLISTCOMPONENTNAME", "dataField": "sdisplayname", "width": "250px" }
                ]
                primaryKeyField = "nchecklistcomponentcode";
            }
            else if (this.props.Login.masterData.headername == "Generic Label") {
                this.extractedColumnList = [
                    { "idsName": "IDS_GENERICLABELID", "dataField": "sgenericlabel", "width": "250px" },
                    { "idsName": "IDS_GENERICLABELNAME", "dataField": "sdisplayname", "width": "250px" }
                ]
                primaryKeyField = "ngenericlabelcode";
            }
            else if (this.props.Login.masterData.headername == "Query Builder Table Columns") {
                this.extractedColumnList = [
                    // { "idsName": "IDS_QUERYBUILDERTABLECOLUMNSID", "dataField": "stablename", "width": "250px" },
                    { "idsName": "IDS_QUERYBUILDERTABLECOLUMNSNAME", "dataField": "sdisplayname", "width": "250px" }
                ]
                primaryKeyField = "index";
            }
            else if (this.props.Login.masterData.headername == "Dynamic Audit Table") {
                this.extractedColumnList = [
                    // { "idsName": "IDS_TABLE_NAME", "dataField": "stablename", "width": "250px" },
                    { "idsName": "IDS_FIELDNAME", "dataField": "sfieldname", "width": "250px" },
                    { "idsName": "IDS_MULTILINGUALFIELDS", "dataField": "sdisplayname", "width": "250px" }
                ]
                primaryKeyField = "index";
            }
            else if (this.props.Login.masterData.headername == "Mapped Template Field Props") {
                this.extractedColumnList = [
                    // { "idsName": "samplegriditems", "dataField": "sfieldname", "width": "250px" },
                    { "idsName": "IDS_MAPPEDTEMPLATEFIELDPROPSNAME", "dataField": "sdisplayname", "width": "250px" }
                ]
                primaryKeyField = "index";
            }
        }

        const languagesId = this.props.Login.inputParam && this.state.controlMap.has("UpdateLanguage")
            && this.state.controlMap.get('UpdateLanguage').ncontrolcode;
        const languagesParam = {
            screenName: "Language", operation: "update", primaryKeyField: primaryKeyField,
            masterData: this.props.Login.masterData, userInfo: this.props.Login.userInfo, ncontrolCode: languagesId, selectedRecord: this.state.selectedRecord
        };

        return (
            <>
                <Row>
                    <Col>
                        <ListWrapper className="client-list-content">
                            <Row noGutters>
                                <Col md={8}>
                                    <Affix top={85}>
                                        <Row>
                                            <Col md={12}>
                                                <Row>
                                                    <Col md={4}>
                                                        <FormSelectSearch
                                                            name={"nmultilingualmasterscode"}
                                                            formLabel={this.props.intl.formatMessage({ id: "IDS_MULTILINGUALMASTERS" })}
                                                            placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                                            options={this.state.multilingualmasters || []}
                                                            value={this.props.Login.masterData && this.props.Login.masterData.selectedmultilingualmasters
                                                                && {
                                                                value:
                                                                    this.props.Login.masterData.selectedmultilingualmasters.nmultilingualmasterscode ? this.props.Login.masterData.selectedmultilingualmasters.nmultilingualmasterscode :
                                                                        this.state.selectedRecord.nmultilingualmasterscode.value,
                                                                label: this.props.Login.masterData.selectedmultilingualmasters.sdisplayname ? this.props.Login.masterData.selectedmultilingualmasters.sdisplayname :
                                                                    this.state.selectedRecord.nmultilingualmasterscode.label
                                                            }}
                                                            isMandatory={false}
                                                            isMulti={false}
                                                            isClearable={false}
                                                            isSearchable={true}
                                                            isDisabled={false}
                                                            closeMenuOnSelect={true}
                                                            className="mb-2"
                                                            onChange={(event) => this.onComboChange(event, 'nmultilingualmasterscode')}
                                                        />
                                                    </Col>
                                                    {this.props.Login.masterData.headername == "Query Builder Views Columns" ?
                                                        <Col md={4} >
                                                            <FormSelectSearch
                                                                name={"nquerybuilderviewscode"}
                                                                formLabel={this.props.intl.formatMessage({ id: "IDS_VIEWNAME" })}
                                                                placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                                                options={this.state.QueryBuilderViewsName || []}
                                                                value={this.props.Login.masterData && this.props.Login.masterData.selectedQueryBuilderViewsName
                                                                    && {
                                                                    value: this.state.selectedRecord.nquerybuilderviewscode !== undefined
                                                                        ? this.state.selectedRecord.nquerybuilderviewscode.value : this.props.Login.masterData.selectedQueryBuilderViewsName.nquerybuilderviewscode,
                                                                    label: this.state.selectedRecord.nquerybuilderviewscode !== undefined ?
                                                                        this.state.selectedRecord.nquerybuilderviewscode.label : this.props.Login.masterData.selectedQueryBuilderViewsName.sdisplayname
                                                                }}
                                                                isMandatory={false}
                                                                isMulti={false}
                                                                isClearable={false}
                                                                isSearchable={true}
                                                                isDisabled={false}
                                                                closeMenuOnSelect={true}
                                                                className="mb-2"
                                                                onChange={(event) => this.onComboChange(event, 'nquerybuilderviewscode')}
                                                            />
                                                        </Col> : this.props.Login.masterData.headername == "Query Builder Table Columns" ?
                                                            <Col md={4} >
                                                                <FormSelectSearch
                                                                    name={"nquerybuilderviewscode"}
                                                                    formLabel={this.props.intl.formatMessage({ id: "IDS_TABLE_NAME" })}
                                                                    placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                                                    options={this.state.QueryBuilderStableName || []}
                                                                    // value={this.props.Login.masterData && this.props.Login.masterData.SelectedQueryBuilderStableName
                                                                    //     && {
                                                                    //     value: this.state.selectedRecord.nquerybuildertablecode !== undefined
                                                                    //         ? this.state.selectedRecord.nquerybuildertablecode.value : this.props.Login.masterData.SelectedQueryBuilderStableName[0].nquerybuildertablecode,
                                                                    //     label: this.state.selectedRecord.nquerybuildertablecode !== undefined ?
                                                                    //         this.state.selectedRecord.nquerybuildertablecode.label : this.props.Login.masterData.SelectedQueryBuilderStableName[0].stablename
                                                                    // }}
                                                                    value={this.state && this.state.SelectedQueryBuilderStableName && this.state.SelectedQueryBuilderStableName}
                                                                    isMandatory={false}
                                                                    isMulti={false}
                                                                    isClearable={false}
                                                                    isSearchable={true}
                                                                    isDisabled={false}
                                                                    closeMenuOnSelect={true}
                                                                    className="mb-2"
                                                                    onChange={(event) => this.onComboChange(event, 'nquerybuildertablecode')}
                                                                />
                                                            </Col> : this.props.Login.masterData.headername == "Dynamic Audit Table" ?
                                                                <Col md={4} >
                                                                    <FormSelectSearch
                                                                        name={"nformcode"}
                                                                        formLabel={this.props.intl.formatMessage({ id: "IDS_SCREENNAME" })}
                                                                        placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                                                        options={this.state.lstFormName || []}
                                                                        // value={this.props.Login.masterData && this.props.Login.masterData.SelectedQueryBuilderStableName
                                                                        //     && {
                                                                        //     value: this.state.selectedRecord.nquerybuildertablecode !== undefined
                                                                        //         ? this.state.selectedRecord.nquerybuildertablecode.value : this.props.Login.masterData.SelectedQueryBuilderStableName[0].nquerybuildertablecode,
                                                                        //     label: this.state.selectedRecord.nquerybuildertablecode !== undefined ?
                                                                        //         this.state.selectedRecord.nquerybuildertablecode.label : this.props.Login.masterData.SelectedQueryBuilderStableName[0].stablename
                                                                        // }}
                                                                        value={this.state && this.state.selectedLstFormName && this.state.selectedLstFormName}
                                                                        isMandatory={false}
                                                                        isMulti={false}
                                                                        isClearable={false}
                                                                        isSearchable={true}
                                                                        isDisabled={false}
                                                                        closeMenuOnSelect={true}
                                                                        className="mb-2"
                                                                        onChange={(event) => this.onComboChange(event, 'dynamicaudittableformcode')}
                                                                    />
                                                                </Col> : this.props.Login.masterData.headername == "Mapped Template Field Props" ?
                                                                    <Col md={4} >
                                                                        <FormSelectSearch
                                                                            name={"nquerybuilderviewscode"}
                                                                            formLabel={this.props.intl.formatMessage({ id: "IDS_REACTREGISTRATIONTEMPLATENAME" })}
                                                                            placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                                                            options={this.state.lstMappedTemplateFieldProps || []}
                                                                            // value={this.props.Login.masterData && this.props.Login.masterData.selectedQueryBuilderScolumnList
                                                                            //     && {
                                                                            //     value: this.state.selectedRecord.nquerybuilderviewscode !== undefined
                                                                            //         ? this.state.selectedRecord.nquerybuilderviewscode.value : this.props.Login.masterData.selectedQueryBuilderScolumnList.scolumnname,
                                                                            //     label: this.state.selectedRecord.nquerybuilderviewscode !== undefined ?
                                                                            //         this.state.selectedRecord.nquerybuilderviewscode.label : this.props.Login.masterData.selectedQueryBuilderScolumnList.scolumnname
                                                                            // }}
                                                                            value={this.state && this.state.selectedLstMappedTemplateFieldProps && this.state.selectedLstMappedTemplateFieldProps}
                                                                            isMandatory={false}
                                                                            isMulti={false}
                                                                            isClearable={false}
                                                                            isSearchable={true}
                                                                            isDisabled={false}
                                                                            closeMenuOnSelect={true}
                                                                            className="mb-2"
                                                                            onChange={(event) => this.onComboChange(event, 'nmappedtemplatefieldpropcode')}
                                                                        />
                                                                    </Col> : ""
                                                    }
                                                    {this.props.Login.masterData.headername == "Query Builder Table Columns" ?
                                                        <Col md={4} >
                                                            <FormSelectSearch
                                                                name={"nquerybuilderviewscode"}
                                                                formLabel={this.props.intl.formatMessage({ id: "IDS_COLUMNNAME" })}
                                                                placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                                                options={this.state.QueryBuilderScolumnList || []}
                                                                // value={this.props.Login.masterData && this.props.Login.masterData.selectedQueryBuilderScolumnList
                                                                //     && {
                                                                //     value: this.state.selectedRecord.nquerybuilderviewscode !== undefined
                                                                //         ? this.state.selectedRecord.nquerybuilderviewscode.value : this.props.Login.masterData.selectedQueryBuilderScolumnList.scolumnname,
                                                                //     label: this.state.selectedRecord.nquerybuilderviewscode !== undefined ?
                                                                //         this.state.selectedRecord.nquerybuilderviewscode.label : this.props.Login.masterData.selectedQueryBuilderScolumnList.scolumnname
                                                                // }}
                                                                value={this.state && this.state.SelectedQueryBuilderScolumnList && this.state.SelectedQueryBuilderScolumnList}
                                                                isMandatory={false}
                                                                isMulti={false}
                                                                isClearable={false}
                                                                isSearchable={true}
                                                                isDisabled={false}
                                                                closeMenuOnSelect={true}
                                                                className="mb-2"
                                                                onChange={(event) => this.onComboChange(event, 'scolumnname')}
                                                            />
                                                        </Col> : this.props.Login.masterData.headername == "Dynamic Audit Table" ?
                                                            <Col md={4} >
                                                                <FormSelectSearch
                                                                    name={"ndynamicaudittablecode"}
                                                                    formLabel={this.props.intl.formatMessage({ id: "IDS_TABLE_NAME" })}
                                                                    placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                                                    options={this.state.lstDynamicAuditTableStableName || []}
                                                                    // value={this.props.Login.masterData && this.props.Login.masterData.selectedQueryBuilderScolumnList
                                                                    //     && {
                                                                    //     value: this.state.selectedRecord.nquerybuilderviewscode !== undefined
                                                                    //         ? this.state.selectedRecord.nquerybuilderviewscode.value : this.props.Login.masterData.selectedQueryBuilderScolumnList.scolumnname,
                                                                    //     label: this.state.selectedRecord.nquerybuilderviewscode !== undefined ?
                                                                    //         this.state.selectedRecord.nquerybuilderviewscode.label : this.props.Login.masterData.selectedQueryBuilderScolumnList.scolumnname
                                                                    // }}
                                                                    value={this.state && this.state.selectedLstDynamicAuditTableStableName && this.state.selectedLstDynamicAuditTableStableName}
                                                                    isMandatory={false}
                                                                    isMulti={false}
                                                                    isClearable={false}
                                                                    isSearchable={true}
                                                                    isDisabled={false}
                                                                    closeMenuOnSelect={true}
                                                                    className="mb-2"
                                                                    onChange={(event) => this.onComboChange(event, 'ndynamicaudittablecode')}
                                                                />
                                                            </Col> : this.props.Login.masterData.headername == "Mapped Template Field Props" ?
                                                                <Col md={4} >
                                                                    <FormSelectSearch
                                                                        name={"nformcode"}
                                                                        formLabel={this.props.intl.formatMessage({ id: "IDS_FORMNAME" })}
                                                                        placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                                                        options={this.state.lstQualisForms || []} lstQualisForms
                                                                        // value={this.props.Login.masterData && this.props.Login.masterData.SelectedQueryBuilderStableName
                                                                        //     && {
                                                                        //     value: this.state.selectedRecord.nquerybuildertablecode !== undefined
                                                                        //         ? this.state.selectedRecord.nquerybuildertablecode.value : this.props.Login.masterData.SelectedQueryBuilderStableName[0].nquerybuildertablecode,
                                                                        //     label: this.state.selectedRecord.nquerybuildertablecode !== undefined ?
                                                                        //         this.state.selectedRecord.nquerybuildertablecode.label : this.props.Login.masterData.SelectedQueryBuilderStableName[0].stablename
                                                                        // }}
                                                                        value={this.state && this.state.selectedLstQualisForms && this.state.selectedLstQualisForms}
                                                                        isMandatory={false}
                                                                        isMulti={false}
                                                                        isClearable={false}
                                                                        isSearchable={true}
                                                                        isDisabled={false}
                                                                        closeMenuOnSelect={true}
                                                                        className="mb-2"
                                                                        onChange={(event) => this.onComboChange(event, 'indexQualisforms')}
                                                                    />
                                                                </Col> : ""
                                                    }
                                                    {this.props.Login.masterData.headername == "Mapped Template Field Props" && this.props.Login.masterData.selectedLstQualisforms && this.props.Login.masterData.selectedLstQualisforms[0].nformcode ?
                                                        <Col md={4} >
                                                            <FormSelectSearch
                                                                name={"ndynamicaudittablecode"}
                                                                formLabel={this.props.intl.formatMessage({ id: "IDS_PROPERTIES" })}
                                                                placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                                                options={this.state.lstSampleItems || []}
                                                                // value={this.props.Login.masterData && this.props.Login.masterData.selectedQueryBuilderScolumnList
                                                                //     && {
                                                                //     value: this.state.selectedRecord.nquerybuilderviewscode !== undefined
                                                                //         ? this.state.selectedRecord.nquerybuilderviewscode.value : this.props.Login.masterData.selectedQueryBuilderScolumnList.scolumnname,
                                                                //     label: this.state.selectedRecord.nquerybuilderviewscode !== undefined ?
                                                                //         this.state.selectedRecord.nquerybuilderviewscode.label : this.props.Login.masterData.selectedQueryBuilderScolumnList.scolumnname
                                                                // }}
                                                                value={this.state && this.state.selectedLstSampleItems && this.state.selectedLstSampleItems}
                                                                isMandatory={false}
                                                                isMulti={false}
                                                                isClearable={false}
                                                                isSearchable={true}
                                                                isDisabled={false}
                                                                closeMenuOnSelect={true}
                                                                className="mb-2"
                                                                onChange={(event) => this.onComboChange(event, 'indexPropertiesKey')}
                                                            />
                                                        </Col> : ""}
                                                    {this.props.Login.masterData.headername == "Mapped Template Field Props" && this.props.Login.masterData.selectedLstSampleItems && this.props.Login.masterData.selectedLstSampleItems[0].indexPropertiesValue === "testListFields" ?
                                                        <Col md={4} >
                                                            <FormSelectSearch
                                                                name={"ndynamicaudittablecode"}
                                                                formLabel={this.props.intl.formatMessage({ id: "IDS_FIELDNAME" })}
                                                                placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                                                options={this.state.lstSampleField || []}
                                                                // value={this.props.Login.masterData && this.props.Login.masterData.selectedQueryBuilderScolumnList
                                                                //     && {
                                                                //     value: this.state.selectedRecord.nquerybuilderviewscode !== undefined
                                                                //         ? this.state.selectedRecord.nquerybuilderviewscode.value : this.props.Login.masterData.selectedQueryBuilderScolumnList.scolumnname,
                                                                //     label: this.state.selectedRecord.nquerybuilderviewscode !== undefined ?
                                                                //         this.state.selectedRecord.nquerybuilderviewscode.label : this.props.Login.masterData.selectedQueryBuilderScolumnList.scolumnname
                                                                // }}
                                                                value={this.state && this.state.selectedLstSampleField && this.state.selectedLstSampleField}
                                                                isMandatory={false}
                                                                isMulti={false}
                                                                isClearable={false}
                                                                isSearchable={true}
                                                                isDisabled={false}
                                                                closeMenuOnSelect={true}
                                                                className="mb-2"
                                                                onChange={(event) => this.onComboChange(event, 'indexFieldKey')}
                                                            />
                                                        </Col> : ""}
                                                </Row>
                                            </Col>
                                        </Row>
                                    </Affix>
                                </Col>
                            </Row>
                            {this.state.data ?
                                <DataGrid
                                    primaryKeyField={primaryKeyField}
                                    data={this.state.data.listofItem}
                                    dataResult={this.state.dataResult}
                                    dataState={this.state.dataState}
                                    dataStateChange={this.dataStateChange}
                                    extractedColumnList={this.extractedColumnList}
                                    languagesRecord={this.props.fetchById}
                                    reloadData={this.reloadData}
                                    controlMap={this.state.controlMap}
                                    userRoleControlRights={this.state.userRoleControlRights}
                                    inputParam={this.props.Login.inputParam}
                                    userInfo={this.props.Login.userInfo}
                                    languagesParam={languagesParam}
                                    methodUrl="Language"
                                    pageable={true}
                                    isActionRequired={true}
                                    isToolBarRequired={true}
                                    isDownloadPDFRequired={true}
                                    isDownloadExcelRequired={true}
                                    gridHeight={'465px'}
                                    scrollable={"scrollable"}
                                    selectedId={this.props.Login.selectedId}
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
                        showSaveContinue={false}
                        hideSave={this.state.showSynonym}
                        inputParam={this.props.Login.inputParam}
                        esign={this.props.Login.loadEsign}
                        validateEsign={this.validateEsign}
                        selectedRecord={this.state.selectedRecord}
                        mandatoryFields={this.mandatoryFields}
                        addComponent={this.props.Login.loadEsign ?
                            <Esign operation={this.props.Login.operation ? this.props.Login.operation : ''}
                                onInputOnChange={this.onInputOnChange}
                                inputParam={this.props.Login.inputParam}
                                selectedRecord={this.state.selectedRecord || {}}
                            />
                            :
                            <AddLanguageSynonym
                                selectedFieldRecord={this.state.selectedRecord}
                                needheader={(this.props.Login.masterData.selectedmultilingualmasters || this.props.Login.masterData.sneedheader)}
                                onInputOnChange={this.onInputOnChange}
                                selectedJsondata={(this.props.Login.masterData.headername === "Query Builder Views Columns" || this.props.Login.masterData.headername === "Query Builder Table Columns" || this.props.Login.masterData.headername === "Dynamic Audit Table" || this.props.Login.masterData.headername === "Mapped Template Field Props") ? this.props.Login.selectedRecord.sjsondata : this.props.Login.selectedRecord && this.props.Login.selectedRecord.jsondata}
                                // selectedJsondata={this.props.Login.selectedRecord && this.props.Login.selectedRecord.jsondata}
                                languages={this.props.Login.languageList || []}
                                fieldName={this.props.Login.selectedRecord.fieldName}
                            />
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

                const multilingualmastersMap = constructOptionList(this.props.Login.masterData.multilingualmasters || [], "nmultilingualmasterscode",
                    "sdisplayname", "nsorter", 'ascending', undefined, true);
                const multilingualmasters = multilingualmastersMap.get("OptionList");
                this.setState({
                    userRoleControlRights, controlMap, multilingualmasters: multilingualmasters, data: this.props.Login.masterData,
                    dataResult: process(this.props.Login.masterData.listofItem ? this.props.Login.masterData.listofItem : [], this.state.dataState)
                });
            }
            else {
                let { dataState } = this.state;
                if (this.props.Login.dataState === undefined) {
                    dataState = { skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5 }
                }
                const FilterQueryMap = constructOptionList(this.props.Login.masterData.QueryBuilderViewsName || [], "nquerybuilderviewscode",
                    "sdisplayname", 'nquerybuilderviewscode', 'descending', true);
                const QueryBuilderViewsName = FilterQueryMap.get("OptionList");
                const formNameQueryMap = constructOptionList(this.props.Login.filterValue || [], "nformcode",
                    "sformname", undefined, undefined, true);
                const MaterialConfig = formNameQueryMap.get("OptionList");

                let FilterQueryColumnMap, QueryBuilderStableName, FilterColumnNameMap, QueryBuilderScolumnList, SelectedQueryBuilderStableName, SelectedQueryBuilderScolumnList;

                if (this.props.Login.masterData.headername === "Query Builder Table Columns") {
                    if (this.props.Login.masterData && this.props.Login.masterData.QueryBuilderStableName) {
                        FilterQueryColumnMap = constructOptionList(this.props.Login.masterData.QueryBuilderStableName || [], "nquerybuildertablecode",
                            "stablename", 'nquerybuildertablecode', 'ascending', true);
                        QueryBuilderStableName = FilterQueryColumnMap.get("OptionList");
                    }
                    if (this.props.Login.masterData && this.props.Login.masterData.SelectedQueryBuilderStableName) {
                        const FilterSelectedQueryColumnMap = constructOptionList(this.props.Login.masterData.SelectedQueryBuilderStableName || [], "nquerybuildertablecode",
                            "stablename", undefined, undefined, true);
                        SelectedQueryBuilderStableName = FilterSelectedQueryColumnMap.get("OptionList");
                    }
                    if (this.props.Login.masterData && this.props.Login.masterData.QueryBuilderScolumnList) {
                        FilterColumnNameMap = constructOptionList(this.props.Login.masterData.QueryBuilderScolumnList || [], "scolumnname",
                            "scolumnname", 'ordinal_position', 'descending', true);
                        QueryBuilderScolumnList = FilterColumnNameMap.get("OptionList");
                    }
                    if (this.props.Login.masterData && this.props.Login.masterData.selectedQueryBuilderScolumnList) {
                        const FilterSelectedColumnNameMap = constructOptionList(this.props.Login.masterData.selectedQueryBuilderScolumnList || [], "scolumnname",
                            "scolumnname", undefined, undefined, true);
                        SelectedQueryBuilderScolumnList = FilterSelectedColumnNameMap.get("OptionList");
                    }
                }

                let formName, lstFormName, DynamicAuditTableStableName, lstDynamicAuditTableStableName, selectedFormName, selectedLstFormName, selectedDynamicAuditTableStableName, selectedLstDynamicAuditTableStableName;

                if (this.props.Login.masterData.headername === "Dynamic Audit Table") {
                    if (this.props.Login.masterData && this.props.Login.masterData.lstFormName) {
                        formName = constructOptionList(this.props.Login.masterData.lstFormName || [], "nformcode",
                            "sformname", 'nformcode', 'ascending', true);
                        lstFormName = formName.get("OptionList");
                    }
                    if (this.props.Login.masterData && this.props.Login.masterData.lstDynamicAuditTable) {
                        DynamicAuditTableStableName = constructOptionList(this.props.Login.masterData.lstDynamicAuditTable || [], "ndynamicaudittablecode",
                            "stablename", 'ndynamicaudittablecode', 'descending', true);
                        lstDynamicAuditTableStableName = DynamicAuditTableStableName.get("OptionList");
                    }
                    if (this.props.Login.masterData && this.props.Login.masterData.SelectedFormName) {
                        selectedFormName = constructOptionList(this.props.Login.masterData.SelectedFormName || [], "nformcode",
                            "sformname", undefined, undefined, true);
                        selectedLstFormName = selectedFormName.get("OptionList");
                    }
                    if (this.props.Login.masterData && this.props.Login.masterData.selectedDynamicAuditTable) {
                        selectedDynamicAuditTableStableName = constructOptionList(this.props.Login.masterData.selectedDynamicAuditTable || [], "ndynamicaudittablecode",
                            "stablename", undefined, undefined, true);
                        selectedLstDynamicAuditTableStableName = selectedDynamicAuditTableStableName.get("OptionList");
                    }
                }

                let lstQualisForms, selectedLstQualisForms, qualisForms, selectedQualisForms, lstSampleItems, selectedLstSampleItems,
                    sampleItems, selectedSampleItems, mappedTemplateFieldProps, selectedMappedTemplateFieldProps, lstMappedTemplateFieldProps,
                    selectedLstMappedTemplateFieldProps, lstSampleField, selectedLstSampleField, sampleField, selectedSampleField;

                if (this.props.Login.masterData.headername === "Mapped Template Field Props") {
                    if (this.props.Login.masterData && this.props.Login.masterData.lstMappedTemplateFieldProps) {
                        mappedTemplateFieldProps = constructOptionList(this.props.Login.masterData.lstMappedTemplateFieldProps || [], "nmappedtemplatefieldpropcode",
                            "sregtemplatename", undefined, undefined, true);
                        lstMappedTemplateFieldProps = mappedTemplateFieldProps.get("OptionList");
                    }
                    if (this.props.Login.masterData && this.props.Login.masterData.selectedLstMappedTemplateFieldProps) {
                        selectedMappedTemplateFieldProps = constructOptionList(this.props.Login.masterData.selectedLstMappedTemplateFieldProps || [], "nmappedtemplatefieldpropcode",
                            "sregtemplatename", undefined, undefined, true);
                        selectedLstMappedTemplateFieldProps = selectedMappedTemplateFieldProps.get("OptionList");
                    }
                    if (this.props.Login.masterData && this.props.Login.masterData.lstQualisforms) {
                        qualisForms = constructOptionList(this.props.Login.masterData.lstQualisforms || [], "indexQualisforms",
                            "sformname", undefined, undefined, true);
                        lstQualisForms = qualisForms.get("OptionList");
                    }
                    if (this.props.Login.masterData && this.props.Login.masterData.selectedLstQualisforms) {
                        selectedQualisForms = constructOptionList(this.props.Login.masterData.selectedLstQualisforms || [], "indexQualisforms",
                            "sformname", undefined, undefined, true);
                        selectedLstQualisForms = selectedQualisForms.get("OptionList");
                    }
                    if (this.props.Login.masterData && this.props.Login.masterData.lstSampleItems) {
                        sampleItems = constructOptionList(this.props.Login.masterData.lstSampleItems || [], "indexPropertiesKey",
                            "indexPropertiesValue", undefined, undefined, true);
                        lstSampleItems = sampleItems.get("OptionList");
                    }
                    if (this.props.Login.masterData && this.props.Login.masterData.selectedLstSampleItems) {
                        selectedSampleItems = constructOptionList(this.props.Login.masterData.selectedLstSampleItems || [], "indexPropertiesKey",
                            "indexPropertiesValue", undefined, undefined, true);
                        selectedLstSampleItems = selectedSampleItems.get("OptionList");
                    }
                    if (this.props.Login.masterData && this.props.Login.masterData.lstSampleField) {
                        sampleField = constructOptionList(this.props.Login.masterData.lstSampleField || [], "indexFieldKey",
                            "indexFieldValue", undefined, undefined, true);
                        lstSampleField = sampleField.get("OptionList");
                    }
                    if (this.props.Login.masterData && this.props.Login.masterData.selectedLstSampleField) {
                        selectedSampleField = constructOptionList(this.props.Login.masterData.selectedLstSampleField || [], "indexFieldKey",
                            "indexFieldValue", undefined, undefined, true);
                        selectedLstSampleField = selectedSampleField.get("OptionList");
                    }
                }
                this.setState({
                    data: this.props.Login.masterData,
                    QueryBuilderViewsName: QueryBuilderViewsName,
                    QueryBuilderStableName: QueryBuilderStableName ? QueryBuilderStableName : this.state.QueryBuilderStableName,
                    SelectedQueryBuilderStableName: SelectedQueryBuilderStableName ? SelectedQueryBuilderStableName : this.state.SelectedQueryBuilderStableName,
                    QueryBuilderScolumnList: QueryBuilderScolumnList ? QueryBuilderScolumnList : this.state.QueryBuilderScolumnList,
                    SelectedQueryBuilderScolumnList: SelectedQueryBuilderScolumnList ? SelectedQueryBuilderScolumnList : this.state.SelectedQueryBuilderScolumnList,
                    lstFormName: lstFormName ? lstFormName : this.state.lstFormName,
                    lstDynamicAuditTableStableName: lstDynamicAuditTableStableName ? lstDynamicAuditTableStableName : this.state.lstDynamicAuditTableStableName,
                    selectedLstFormName: selectedLstFormName ? selectedLstFormName : this.state.selectedLstFormName,
                    selectedLstDynamicAuditTableStableName: selectedLstDynamicAuditTableStableName ? selectedLstDynamicAuditTableStableName : this.state.selectedLstDynamicAuditTableStableName,
                    lstQualisForms: lstQualisForms ? lstQualisForms : this.state.lstQualisForms,
                    selectedLstQualisForms: selectedLstQualisForms ? selectedLstQualisForms : this.state.selectedLstQualisForms,
                    lstSampleItems: lstSampleItems ? lstSampleItems : this.state.lstSampleItems,
                    selectedLstSampleItems: selectedLstSampleItems ? selectedLstSampleItems : this.state.selectedLstSampleItems,
                    lstMappedTemplateFieldProps: lstMappedTemplateFieldProps ? lstMappedTemplateFieldProps : this.state.lstMappedTemplateFieldProps,
                    selectedLstMappedTemplateFieldProps: selectedLstMappedTemplateFieldProps ? selectedLstMappedTemplateFieldProps : this.state.selectedLstMappedTemplateFieldProps,
                    lstSampleField: lstSampleField ? lstSampleField : this.state.lstSampleField,
                    selectedLstSampleField: selectedLstSampleField ? selectedLstSampleField : this.state.selectedLstSampleField,
                    MaterialConfig: MaterialConfig,
                    dataResult: process(this.props.Login.masterData.listofItem ? this.props.Login.masterData.listofItem : [], dataState),
                    dataState
                });
            }
        }
        else if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord) {
            let selectedRecord;
            if (this.props.Login.masterData.headername === "Query Builder Views Columns") {
                selectedRecord = {
                    ...this.props.Login.selectedRecord,
                    sdefaultname: this.props.Login.selectedRecord && this.props.Login.selectedRecord.sdefaultname && this.props.Login.selectedRecord.sdefaultname,
                }
            } else if (this.props.Login.masterData.headername === "Query Builder Table Columns") {
                selectedRecord = {
                    ...this.props.Login.selectedRecord,
                    sdefaultname: this.props.Login.selectedRecord && this.props.Login.selectedRecord.sdefaultname && this.props.Login.selectedRecord.sdefaultname,
                }
            }
            else {
                selectedRecord = {
                    ...this.props.Login.selectedRecord
                }
            }
            this.setState({ selectedRecord });
        }
    }


    onInputOnChange = (event, name, item, fieldName) => {

        const selectedRecord = this.state.selectedRecord || {};
        if (event.target.type === 'checkbox') {
            selectedRecord[event.target.name] = event.target.checked === true ? 3 : 4;
        }
        else {
            if (name == 'English') {
                if (this.props.Login.masterData.headername === "Query Builder Views Columns") {
                    selectedRecord['sjsondata'][fieldName] = { ...selectedRecord['sjsondata'][fieldName], [event.target.name]: event.target.value };
                    selectedRecord[fieldName] = { ...selectedRecord[fieldName], [event.target.name]: event.target.value };
                    selectedRecord["sdefaultname"] = event.target.value == "" ? undefined : event.target.value;
                }
                else if (item == 'sactiondisplaystatus') {
                    selectedRecord['sactiondisplaystatus'] = { ...selectedRecord['sactiondisplaystatus'], [event.target.name]: event.target.value };
                } else if (item === 'stransdisplaystatus') {
                    selectedRecord['stransdisplaystatus'] = { ...selectedRecord['stransdisplaystatus'], [event.target.name]: event.target.value }
                } else {
                    selectedRecord[fieldName] = { ...selectedRecord[fieldName], [event.target.name]: event.target.value };
                    selectedRecord['sdefaultname'] = event.target.value == "" ? undefined : event.target.value;
                }
            } else {
                if (this.props.Login.masterData.headername === "Query Builder Views Columns") {
                    selectedRecord['sjsondata'][fieldName] = { ...selectedRecord['sjsondata'][fieldName], [event.target.name]: event.target.value };
                    selectedRecord[fieldName] = { ...selectedRecord[fieldName], [event.target.name]: event.target.value };
                }
                else if (item == 'sactiondisplaystatus') {
                    selectedRecord['sactiondisplaystatus'] = { ...selectedRecord['sactiondisplaystatus'], [event.target.name]: event.target.value };
                } else if (item == 'stransdisplaystatus') {
                    selectedRecord['stransdisplaystatus'] = { ...selectedRecord['stransdisplaystatus'], [event.target.name]: event.target.value }
                } else {
                    selectedRecord[fieldName] = { ...selectedRecord[fieldName], [event.target.name]: event.target.value };
                    selectedRecord[event.target.name] = event.target.value;
                }
            }
        }
        this.setState({ selectedRecord });
    }


    onComboChange = (comboData, fieldName) => {
        const selectedRecord = this.state.selectedRecord || {};
        selectedRecord[fieldName] = comboData;
        this.setState({ selectedRecord });
        if (fieldName === "nquerybuilderviewscode") {
            this.props.comboService({
                inputData: {
                    userinfo: this.props.Login.userInfo,
                    sdisplayname: selectedRecord.nquerybuilderviewscode.item.sviewname,
                    primarykey: selectedRecord.nquerybuilderviewscode.value,
                    item: selectedRecord.nquerybuilderviewscode.item,
                    displayname: this.props.Login.masterData,
                },
                masterData: this.props.Login.masterData,
                userinfo: this.props.Login.userInfo,
                item: selectedRecord.nquerybuilderviewscode.item,
                sdisplayname: selectedRecord.nquerybuilderviewscode.label,
                displayname: this.props.Login.masterData,
            });
        } else if (fieldName === "nquerybuildertablecode" || fieldName === "scolumnname") {
            this.props.comboService({
                inputData: {
                    userinfo: this.props.Login.userInfo,
                    sdisplayname: (fieldName === "nquerybuildertablecode" ? selectedRecord.nquerybuildertablecode.item.stablename :
                        selectedRecord.scolumnname.item.scolumnname),
                    primarykey: (fieldName === "nquerybuildertablecode" ? selectedRecord.nquerybuildertablecode.value :
                        selectedRecord.scolumnname.value),
                    item: (fieldName === "nquerybuildertablecode" ? selectedRecord.nquerybuildertablecode.item :
                        selectedRecord.scolumnname.item),
                    displayname: this.props.Login.masterData,
                    selectedvalues: (fieldName === "nquerybuildertablecode" ? this.state.SelectedQueryBuilderScolumnList :
                        this.state.SelectedQueryBuilderStableName),
                    fieldName: fieldName
                },
                masterData: this.props.Login.masterData,
                userinfo: this.props.Login.userInfo,
                item: (fieldName === "nquerybuildertablecode" ? selectedRecord.nquerybuildertablecode.item :
                    selectedRecord.scolumnname.item),
                sdisplayname: (fieldName === "nquerybuildertablecode" ? selectedRecord.nquerybuildertablecode.label :
                    selectedRecord.scolumnname.label),
                displayname: this.props.Login.masterData,
            })
        } else if (fieldName === "dynamicaudittableformcode" || fieldName === "ndynamicaudittablecode") {
            this.props.comboService({
                inputData: {
                    userinfo: this.props.Login.userInfo,
                    sdisplayname: fieldName === "dynamicaudittableformcode" ? selectedRecord.dynamicaudittableformcode.item.sformname :
                        selectedRecord.ndynamicaudittablecode.item.stablename,
                    primarykey: fieldName === "ndynamicaudittablecode" ? selectedRecord.ndynamicaudittablecode.value :
                        null,
                    formPrimayKey: fieldName === "dynamicaudittableformcode" ? selectedRecord.dynamicaudittableformcode.value :
                        this.state.selectedLstFormName[0].value,
                    item: fieldName === "dynamicaudittableformcode" ? selectedRecord.dynamicaudittableformcode.item :
                        selectedRecord.ndynamicaudittablecode.item,
                    displayname: this.props.Login.masterData,
                    fieldName: fieldName
                },
                masterData: this.props.Login.masterData,
                userinfo: this.props.Login.userInfo,
                item: fieldName === "dynamicaudittableformcode" ? selectedRecord.dynamicaudittableformcode.item :
                    selectedRecord.ndynamicaudittablecode.item,
                sdisplayname: fieldName === "dynamicaudittableformcode" ? selectedRecord.dynamicaudittableformcode.label :
                    selectedRecord.ndynamicaudittablecode.label,
                displayname: this.props.Login.masterData,
            });
        } else if (fieldName === "nmappedtemplatefieldpropcode" || fieldName === "indexQualisforms" || fieldName === "indexPropertiesKey" || fieldName === "indexFieldKey") {
            this.props.comboService({
                inputData: {
                    userinfo: this.props.Login.userInfo,
                    sdisplayname: fieldName === "nmappedtemplatefieldpropcode" ? selectedRecord.nmappedtemplatefieldpropcode.item.sregtemplatename : fieldName === "indexQualisforms" ? selectedRecord.indexQualisforms.item.sformname : fieldName === "indexQualisforms" ? selectedRecord.indexFieldKey.item.indexFieldValue : selectedRecord.indexPropertiesKey.item.indexValue,
                    primarykey: fieldName === "nmappedtemplatefieldpropcode" ? selectedRecord.nmappedtemplatefieldpropcode.value : fieldName === "indexQualisforms" ? selectedRecord.indexQualisforms.value : fieldName === "indexFieldKey" ? selectedRecord.indexFieldKey.value : selectedRecord.indexPropertiesKey.value,
                    item: fieldName === "nmappedtemplatefieldpropcode" ? selectedRecord.nmappedtemplatefieldpropcode.item : fieldName === "indexQualisforms" ? selectedRecord.indexQualisforms.item : fieldName === "indexFieldKey" ? selectedRecord.indexFieldKey.item : selectedRecord.indexPropertiesKey.item,
                    displayname: this.props.Login.masterData,
                    fieldName: fieldName
                },
                masterData: this.props.Login.masterData,
                userinfo: this.props.Login.userInfo,
                item: fieldName === "nmappedtemplatefieldpropcode" ? selectedRecord.nmappedtemplatefieldpropcode.item : fieldName === "indexQualisforms" ? selectedRecord.indexQualisforms.item : fieldName === "indexFieldKey" ? selectedRecord.indexFieldKey.item : selectedRecord.indexPropertiesKey.item,
                sdisplayname: fieldName === "nmappedtemplatefieldpropcode" ? selectedRecord.nmappedtemplatefieldpropcode.label : fieldName === "indexQualisforms" ? selectedRecord.indexQualisforms.label : fieldName === "indexFieldKey" ? selectedRecord.indexFieldKey.label : selectedRecord.indexPropertiesKey.label,
                displayname: this.props.Login.masterData,
            });
        }
        else {
            if (fieldName === "nmultilingualmasterscode") {
                this.props.comboService({
                    inputData: {
                        userinfo: this.props.Login.userInfo,
                        sdisplayname: selectedRecord.nmultilingualmasterscode.label,
                        primarykey: selectedRecord.nmultilingualmasterscode.value,
                        item: selectedRecord.nmultilingualmasterscode.item,
                        displayname: this.props.Login.masterData
                    },
                    masterData: {
                        ...this.props.Login.masterData,
                        headername: {}
                    },
                    userinfo: this.props.Login.userInfo,
                    displayname: this.props.Login.masterData,
                    item: selectedRecord.nmultilingualmasterscode.item,
                    sdisplayname: selectedRecord.nmultilingualmasterscode.label,

                });
            }
        }
    }

    handleClose() {
        let loadEsign = this.props.Login.loadEsign;
        let openModal = this.props.Login.openModal;
        let selectedRecord = this.props.Login.selectedRecord;
        let selectedId = this.props.Login.selectedId;
        if (this.state.showSynonym) {
            this.setState({ showSynonym: false })
            return null;
        }
        if (this.props.Login.loadEsign) {
            loadEsign = false;
            //openModal = false;
        }
        else {
            openModal = false;
            selectedRecord = { ...this.props.Login.selectedRecord };
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
        let inputData = {};
        let selectedId = null;
        let methodUrl = "";
        inputData["userinfo"] = this.props.Login.userInfo;
        let dataState = undefined;
        if (this.state.showSynonym) {
            this.setState({ showSynonym: false })
            return null;
        }
        if (this.props.Login.operation === "update") {
            // edit
            if (this.props.Login.masterData.headername === "Menu") {
                selectedId = this.props.Login.selectedId;
                dataState = this.state.dataState
                inputData["language"] = {
                    "nmenucode": this.state.selectedRecord.nmenucode,
                    "jsondata": {
                        "sdisplayname": this.state.selectedRecord.sdisplayname
                    }
                }
                methodUrl = "MenuLanguage"
            } else if (this.props.Login.masterData.headername === "Module") {
                selectedId = this.props.Login.selectedId;
                dataState = this.state.dataState
                inputData["language"] = {
                    "nmodulecode": this.state.selectedRecord.nmodulecode,
                    "jsondata": {
                        "sdisplayname": this.state.selectedRecord.sdisplayname
                    }
                }
                methodUrl = "ModuleLanguage"
            } else if (this.props.Login.masterData.headername === "Forms") {
                dataState = this.state.dataState
                selectedId = this.props.Login.selectedId;
                inputData["language"] = {
                    "nformcode": this.state.selectedRecord.nformcode,
                    "jsondata": {
                        "sdisplayname": this.state.selectedRecord.sdisplayname
                    }
                }
                methodUrl = "FormLanguage"
            } else if (this.props.Login.masterData.headername === "Transaction Status") {
                dataState = this.state.dataState
                selectedId = this.props.Login.selectedId;
                inputData["language"] = {
                    "ntranscode": this.state.selectedRecord.ntranscode,
                    "jsondata": {
                        "salertdisplaystatus": this.state.selectedRecord.salertdisplaystatus,
                        "stransdisplaystatus": this.state.selectedRecord.stransdisplaystatus,
                        "sactiondisplaystatus": this.state.selectedRecord.sactiondisplaystatus
                    }
                }
                methodUrl = "TransactionStatusLanguage"
            } else if (this.props.Login.masterData.headername === "Control Master") {
                dataState = this.state.dataState
                selectedId = this.props.Login.selectedId;
                inputData["language"] = {
                    "ncontrolcode": this.state.selectedRecord.ncontrolcode,
                    "nformcode": this.state.selectedRecord.nformcode,
                    "jsondata": {
                        "scontrolids": this.state.selectedRecord.scontrolids
                    }
                }
                methodUrl = "ControlMasterLanguage"
            } else if (this.props.Login.masterData.headername === "Approval Sub Type") {
                dataState = this.state.dataState
                selectedId = this.props.Login.selectedId;
                inputData["language"] = {
                    "napprovalsubtypecode": this.state.selectedRecord.napprovalsubtypecode,
                    "jsondata": {
                        "approvalsubtypename": this.state.selectedRecord.approvalsubtypename
                    }
                }
                methodUrl = "ApprovalSubTypeLanguage"
            } else if (this.props.Login.masterData.headername === "Sample Type") {
                dataState = this.state.dataState
                selectedId = this.props.Login.selectedId;
                inputData["language"] = {
                    "nsampletypecode": this.state.selectedRecord.nsampletypecode,
                    "jsondata": {
                        "sampletypename": this.state.selectedRecord.sampletypename
                    }
                }
                methodUrl = "SampleTypeLanguage"
            }
            // else if (this.props.Login.masterData.headername === "Template Design") {
            //     dataState = this.state.dataState
            //     selectedId = this.props.Login.selectedId;
            //     inputData["language"] = {
            //         "ntemplatetypecode": this.state.selectedRecord.ntemplatetypecode,
            //         "jsondata": {
            //             "stemplatetypename": this.state.selectedRecord.stemplatetypename
            //         }
            //     }
            //     methodUrl = "TemplateTypeLanguage"
            // } 
            else if (this.props.Login.masterData.headername === "Period") {
                dataState = this.state.dataState
                selectedId = this.props.Login.selectedId;
                inputData["language"] = {
                    "nperiodcode": this.state.selectedRecord.nperiodcode,
                    "jsondata": {
                        "speriodname": this.state.selectedRecord.speriodname
                    }
                }
                methodUrl = "PeriodLanguage"
            } else if (this.props.Login.masterData.headername === "Gender") {
                dataState = this.state.dataState
                selectedId = this.props.Login.selectedId;
                inputData["language"] = {
                    "ngendercode": this.state.selectedRecord.ngendercode,
                    "jsondata": {
                        "sgendername": this.state.selectedRecord.sgendername
                    }
                }
                methodUrl = "GenderLanguage"
            } else if (this.props.Login.masterData.headername === "Grade") {
                dataState = this.state.dataState
                selectedId = this.props.Login.selectedId;
                inputData["language"] = {
                    "ngradecode": this.state.selectedRecord.ngradecode,
                    "jsondata": {
                        "sdisplayname": this.state.selectedRecord.sdisplayname
                    }
                }
                methodUrl = "GradeLanguage"
            } else if (this.props.Login.masterData.headername === "Scheduler Type") {
                dataState = this.state.dataState
                selectedId = this.props.Login.selectedId;
                inputData["language"] = {
                    "nschedulertypecode": this.state.selectedRecord.nschedulertypecode,
                    "jsondata": {
                        "sschedulertypename": this.state.selectedRecord.sschedulertypename
                    }
                }
                methodUrl = "SchedulerTypeLanguage"
            } else if (this.props.Login.masterData.headername === "Query Builder Tables") {
                dataState = this.state.dataState
                selectedId = this.props.Login.selectedId;
                inputData["language"] = {
                    "nquerybuildertablecode": this.state.selectedRecord.nquerybuildertablecode,
                    "jsondata": {
                        "tablename": this.state.selectedRecord.tablename
                    }
                }
                methodUrl = "QueryBuilderTablesLanguage"
            } else if (this.props.Login.masterData.headername === "Query Builder Views") {
                dataState = this.state.dataState
                selectedId = this.props.Login.selectedId;
                inputData["language"] = {
                    "nquerybuilderviewscode": this.state.selectedRecord.nquerybuilderviewscode,
                    "jsondata": {
                        "displayname": this.state.selectedRecord.displayname
                    }
                }
                methodUrl = "QueryBuilderViewsLanguage"
            } else if (this.props.Login.masterData.headername === "Multilingual Masters") {
                dataState = this.state.dataState
                selectedId = this.props.Login.selectedId;
                inputData["language"] = {
                    "nmultilingualmasterscode": this.state.selectedRecord.nmultilingualmasterscode,
                    "jsondata": {
                        "sdisplayname": this.state.selectedRecord.sdisplayname
                    }
                }
                methodUrl = "MultilingualMastersLanguage"
            } else if (this.props.Login.masterData.headername === "Query Builder Views Columns") {
                dataState = this.state.dataState
                selectedId = this.props.Login.selectedId;
                let replaceValue = this.state.selectedRecord.sjsondata.displayname;
                delete (this.state.selectedRecord.sdefaultname);
                let getIndexValue;
                inputData["findIndex"] = this.props.Login.selectedRecord.findIndex;
                inputData["keyvalue"] = this.props.Login.selectedRecord.keys;
                inputData.keyvalue === "conditionfields" ?
                    getIndexValue = inputData.findIndex - this.props.Login.selectedRecord.selectfields.length :
                    getIndexValue = inputData.findIndex
                inputData["jsondata"] = {
                    // "sjsondata":
                    //     { ...this.state.selectedRecord.sjsondata },
                    // "sviewname": this.props.Login.selectedRecord.sviewname
                    "sjsondata": {
                        ...this.props.Login.selectedRecord.jsondata,
                        ...this.props.Login.selectedRecord.jsondata[this.props.Login.selectedRecord.keys][getIndexValue].displayname = replaceValue
                    },
                    "sviewname": this.props.Login.selectedRecord.sviewname
                }
                delete (inputData["jsondata"].sjsondata["en-US"]);
                delete (inputData["jsondata"].sjsondata["ru-RU"]);
                delete (inputData["jsondata"].sjsondata["tg-TG"])
                methodUrl = "QueryBuilderViewsColumnsLanguage"
            } else if (this.props.Login.masterData.headername === "Material Type") {
                dataState = this.state.dataState
                selectedId = this.props.Login.selectedId;
                inputData["language"] = {
                    "nmaterialtypecode": this.state.selectedRecord.nmaterialtypecode,
                    "jsondata": {
                        "smaterialtypename": this.state.selectedRecord.smaterialtypename
                    }
                }
                methodUrl = "MaterialTypeLanguage"
            }
            else if (this.props.Login.masterData.headername === "Interface Type") {
                dataState = this.state.dataState
                selectedId = this.props.Login.selectedId;
                inputData["language"] = {
                    "ninterfacetypecode": this.state.selectedRecord.ninterfacetypecode,
                    "jsondata": {
                        "sinterfacetypename": this.state.selectedRecord.sinterfacetypename
                    }
                }
                methodUrl = "InterfaceTypeLanguage"
            } else if (this.props.Login.masterData.headername === "Audit Action Filter") {
                dataState = this.state.dataState
                selectedId = this.props.Login.selectedId;
                inputData["language"] = {
                    "nauditactionfiltercode": this.state.selectedRecord.nauditactionfiltercode,
                    "jsondata": {
                        "sdisplayname": this.state.selectedRecord.sdisplayname
                    }
                }
                methodUrl = "AuditActionFilterLanguage"
            }
            else if (this.props.Login.masterData.headername === "Attachment Type") {
                dataState = this.state.dataState
                selectedId = this.props.Login.selectedId;
                inputData["language"] = {
                    "nattachmenttypecode": this.state.selectedRecord.nattachmenttypecode,
                    "jsondata": {
                        "sattachmenttype": this.state.selectedRecord.sattachmenttype
                    }
                }
                methodUrl = "AttachmentTypeLanguage"
            }
            else if (this.props.Login.masterData.headername === "FTP Type") {
                dataState = this.state.dataState
                selectedId = this.props.Login.selectedId;
                inputData["language"] = {
                    "nftptypecode": this.state.selectedRecord.nftptypecode,
                    "jsondata": {
                        "sftptypename": this.state.selectedRecord.sftptypename
                    }
                }
                methodUrl = "FTPTypeLanguage"
            }
            else if (this.props.Login.masterData.headername === "Report Type") {
                dataState = this.state.dataState
                selectedId = this.props.Login.selectedId;
                inputData["language"] = {
                    "nreporttypecode": this.state.selectedRecord.nreporttypecode,
                    "jsondata": {
                        "sdisplayname": this.state.selectedRecord.sdisplayname
                    }
                }
                methodUrl = "ReportTypeLanguage"
            }
            else if (this.props.Login.masterData.headername === "COAReport Type") {
                dataState = this.state.dataState
                selectedId = this.props.Login.selectedId;
                inputData["language"] = {
                    "ncoareporttypecode": this.state.selectedRecord.ncoareporttypecode,
                    "jsondata": {
                        "sdisplayname": this.state.selectedRecord.sdisplayname
                    }
                }
                methodUrl = "COAReportTypeLanguage"
            }
            else if (this.props.Login.masterData.headername === "React Components") {
                dataState = this.state.dataState
                selectedId = this.props.Login.selectedId;
                inputData["language"] = {
                    "nreactcomponentcode": this.state.selectedRecord.nreactcomponentcode,
                    "jsondata": {
                        "componentname": this.state.selectedRecord.componentname
                    }
                }
                methodUrl = "ReactComponentsLanguage"
            } else if (this.props.Login.masterData.headername === "Functions") {
                dataState = this.state.dataState
                selectedId = this.props.Login.selectedId;
                inputData["language"] = {
                    "nfunctioncode": this.state.selectedRecord.nfunctioncode,
                    "jsondata": {
                        "sdisplayname": this.state.selectedRecord.sdisplayname
                    }
                }
                methodUrl = "FunctionsLanguage"
            } else if (this.props.Login.masterData.headername === "Dynamic Formula Fields") {
                dataState = this.state.dataState
                selectedId = this.props.Login.selectedId;
                inputData["language"] = {
                    "ndynamicformulafieldcode": this.state.selectedRecord.ndynamicformulafieldcode,
                    "jsondata": {
                        "sdisplayname": this.state.selectedRecord.sdisplayname
                    }
                }
                methodUrl = "DynamicFormulaFieldLanguage"
            } else if (this.props.Login.masterData.headername === "Chart Type") {
                dataState = this.state.dataState
                selectedId = this.props.Login.selectedId;
                inputData["language"] = {
                    "ncharttypecode": this.state.selectedRecord.ncharttypecode,
                    "jsondata": {
                        "sdisplayname": this.state.selectedRecord.sdisplayname
                    }
                }
                methodUrl = "ChartTypeLanguage"
            } else if (this.props.Login.masterData.headername === "Design Components") {
                dataState = this.state.dataState
                selectedId = this.props.Login.selectedId;
                inputData["language"] = {
                    "ndesigncomponentcode": this.state.selectedRecord.ndesigncomponentcode,
                    "jsondata": {
                        "sdisplayname": this.state.selectedRecord.sdisplayname
                    }
                }
                methodUrl = "DesignComponentLanguage"
            } else if (this.props.Login.masterData.headername === "CheckList Component") {
                dataState = this.state.dataState
                selectedId = this.props.Login.selectedId;
                inputData["language"] = {
                    "nchecklistcomponentcode": this.state.selectedRecord.nchecklistcomponentcode,
                    "jsondata": {
                        "sdisplayname": this.state.selectedRecord.sdisplayname
                    }
                }
                methodUrl = "CheckListComponentLanguage"
            } else if (this.props.Login.masterData.headername === "Generic Label") {
                dataState = this.state.dataState
                selectedId = this.props.Login.selectedId;
                inputData["language"] = {
                    "ngenericlabelcode": this.state.selectedRecord.ngenericlabelcode,
                    "jsondata": {
                        "sdisplayname": this.state.selectedRecord.sdisplayname
                    }
                }
                methodUrl = "GenericLabelLanguage"
            }
            else if (this.props.Login.masterData.headername === "Query Builder Table Columns") {
                dataState = this.state.dataState
                selectedId = this.props.Login.selectedId;
                let jsondata = JSON.parse(this.state.SelectedQueryBuilderStableName[0].item[this.state.SelectedQueryBuilderScolumnList[0].label].value);
                if (this.state.selectedRecord.columnname === jsondata[this.state.selectedRecord.index].columnname) {
                    jsondata[this.state.selectedRecord.index].displayname = this.state.selectedRecord.displayname;
                }
                inputData["language"] = {
                    "nquerybuildertablecode": this.state.SelectedQueryBuilderStableName[0].value,
                    "tablecolumnname": this.state.SelectedQueryBuilderScolumnList[0].label,
                    "scolumnname": this.state.selectedRecord.sjsondata.columnname,
                    "displayname": this.state.selectedRecord.displayname,
                    "jsondata": JSON.stringify(jsondata)
                }
                methodUrl = "QueryBuilderTableColumnsLanguage"
            } else if (this.props.Login.masterData.headername === "Dynamic Audit Table") {
                dataState = this.state.dataState
                selectedId = this.props.Login.selectedId;
                let subsampleenabledisable = this.state.selectedRecord.sfieldname;
                let jsondata = this.state.selectedRecord.jsondata;
                let index = this.state.selectedRecord.index;
                jsondata[subsampleenabledisable].multilingualfields[index][this.state.selectedRecord.fieldName] = this.state.selectedRecord[this.state.selectedRecord.fieldName];
                inputData["language"] = {
                    "ndynamicaudittablecode": this.state.selectedLstDynamicAuditTableStableName[0].value,
                    "subsampleenabledisable": subsampleenabledisable,
                    "keyname": this.state.selectedRecord.fieldName,
                    "jsondata": JSON.stringify(jsondata),
                    "conditioncheck": JSON.stringify(this.state.selectedRecord.sjsondata),
                    "nformcode": this.state.selectedRecord.nformcode
                }
                methodUrl = "DynamicAuditTableLanguage"
            } else if (this.props.Login.masterData.headername === "Mapped Template Field Props") {
                dataState = this.state.dataState
                selectedId = this.props.Login.selectedId;
                let fieldName = this.state.selectedRecord.fieldName;
                let jsondata = this.state.selectedRecord.jsondata && this.state.selectedRecord.jsondata.value && JSON.parse(this.state.selectedRecord.jsondata.value);
                let index = this.state.selectedRecord.index;
                if (this.props.Login.masterData.selectedLstSampleField === undefined && this.props.Login.masterData.selectedLstQualisforms && this.props.Login.masterData.selectedLstQualisforms[0].nformcode) {
                    jsondata[this.props.Login.masterData.selectedLstQualisforms[0].nformcode][this.props.Login.masterData.selectedLstSampleItems[0].indexPropertiesValue][index][fieldName] = this.state.selectedRecord[fieldName];
                } else if (this.props.Login.masterData.selectedLstSampleField === undefined && this.props.Login.masterData.selectedLstQualisforms && this.props.Login.masterData.selectedLstQualisforms[0].nformcode === undefined) {
                    jsondata[this.props.Login.masterData.selectedLstQualisforms[0].sformname][index][fieldName] = this.state.selectedRecord[fieldName];
                } else {
                    jsondata[this.props.Login.masterData.selectedLstQualisforms[0].nformcode][this.props.Login.masterData.selectedLstSampleItems[0].indexPropertiesValue][this.props.Login.masterData.selectedLstSampleField[0].indexFieldValue] !== undefined ?
                        jsondata[this.props.Login.masterData.selectedLstQualisforms[0].nformcode][this.props.Login.masterData.selectedLstSampleItems[0].indexPropertiesValue][this.props.Login.masterData.selectedLstSampleField[0].indexFieldValue][index][fieldName] = this.state.selectedRecord[fieldName] :
                        jsondata[this.props.Login.masterData.selectedLstQualisforms[0].nformcode][this.props.Login.masterData.selectedLstSampleItems[0].indexPropertiesValue][index][fieldName] = this.state.selectedRecord[fieldName];
                }
                inputData["language"] = {
                    "nmappedtemplatefieldpropcode": this.state.selectedRecord.nmappedtemplatefieldpropcode,
                    "jsondata": JSON.stringify(jsondata),
                    "indexQualisforms": this.props.Login.masterData.selectedLstQualisforms ? this.props.Login.masterData.selectedLstQualisforms[0].indexQualisforms : null,
                    "indexPropertiesKey": this.props.Login.masterData.selectedLstSampleItems ? this.props.Login.masterData.selectedLstSampleItems[0].indexPropertiesKey : null,
                    "indexFieldKey": this.props.Login.masterData.selectedLstSampleField ? this.props.Login.masterData.selectedLstSampleField[0].indexFieldKey : null,
                    "index": index,
                    "indexPropertiesValue": this.props.Login.masterData.selectedLstSampleItems ? this.props.Login.masterData.selectedLstSampleItems[0].indexPropertiesValue : null,
                    "indexFieldValue": this.props.Login.masterData.selectedLstSampleField ? this.props.Login.masterData.selectedLstSampleField[0].indexFieldValue : null,
                    "sformname": this.props.Login.masterData.selectedLstQualisforms && this.props.Login.masterData.selectedLstQualisforms[0].sformname ? this.props.Login.masterData.selectedLstQualisforms[0].sformname : null,
                    "nformcode": this.props.Login.masterData.selectedLstQualisforms && this.props.Login.masterData.selectedLstQualisforms[0].nformcode ? this.props.Login.masterData.selectedLstQualisforms[0].nformcode : null
                }
                methodUrl = "MappedTemplateFieldPropsLanguage"
            }
        }
        const inputParam = {
            methodUrl: methodUrl,
            classUrl: this.props.Login.inputParam.classUrl,
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
                    loadEsign: true, screenData: { inputParam, masterData }, saveType,
                    operation: this.props.Login.operation, openModal: true,
                    screenName: this.props.Login.inputParam.displayName
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.crudMaster(inputParam, masterData, "openModal");
        }
    }

}
export default connect(mapStateToProps, {
    callService, crudMaster, showRegTypeAddScreen, fetchById, comboService,
    updateStore, validateEsignCredential
})(injectIntl(Languages));