import React from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import {
    updateStore, getReactInputFields, selectRegistrationTemplate, filterColumnData,
    getRegistrationTemplate, getEditRegTemplate, crudMaster,
    getPreviewTemplate, getChildValues, getDynamicFilter, getDynamicFilterExecuteData,
    rearrangeDateFormatforKendoDataTool, validateEsignCredential, getDefaultTemplate,
    validatePreview, addMasterRecord, getAddMasterCombo, getDynamicMasterTempalte,
    getChildComboMaster, getChildValuesForAddMaster, viewExternalportalDetail, getEditMaster
} from '../../actions/index'
import { DEFAULT_RETURN } from '../../actions/LoginTypes';
import { Row, Col, FormGroup, FormLabel, Card, Nav } from 'react-bootstrap';
import ListMaster from '../../components/list-master/list-master.component';
import { ContentPanel, MediaLabel, ReadOnlyText } from '../../components/App.styles';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
    ageCalculate,
    childComboClear,
    constructOptionList, convertDateTimetoStringDBFormat, deleteAttachmentDropZone,
    extractFieldHeader,
    formatDate,
    formatInputDate,
    getControlMap, getSameRecordFromTwoArrays, onDropAttachFileList,
    removeSpaceFromFirst,
    showEsign, validateEmail, validatePhoneNumber, validateCreateView, conditionBasedInput,rearrangeDateFormat,checkFilterIsEmptyQueryBuilder,Lims_JSON_stringify
} from '../../components/CommonScript';
import { toast } from 'react-toastify';
import PreRegDesignPopUp from './PreRegDesignPopUp';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import BreadcrumbComponent from '../../components/Breadcrumb.Component';
import { Affix } from 'rsuite';
import PortalModal from '../../PortalModal';
import { faCopy, faEye, faPencilAlt, faThumbsUp, faTrashAlt ,faFileExcel,faFileImport} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ConfirmMessage from '../../components/confirm-alert/confirm-message.component';
import DynamicSlideout from './DynamicSlideout.jsx'
import SlideOutModal from '../../components/slide-out-modal/SlideOutModal';
import Esign from '../audittrail/Esign';
import { designProperties, transactionStatus, SampleType, designComponents, formCode } from '../../components/Enumeration';
import FormInput from '../../components/form-input/form-input.component';
import KendoDatatoolFilter from '../contactmaster/KendoDatatoolFilter';
import FilterQueryBuilder from '../../components/FilterQueryBuilder';
import {
    Utils as QbUtils,
} from "@react-awesome-query-builder/ui";
import { getFieldSpecification } from '../../components/type2component/Type2FieldSpecificationList';
import AddMasterRecords from './AddMasterRecords'
import { getFieldSpecification as getFieldSpecification1 } from '../../components/type1component/Type1FieldSpecificationList';
import { getFieldSpecification as getFieldSpecification3 } from '../../components/type3component/Type3FieldSpecificationList';
import ExternalOrderSlideout from './ExternalOrderSlideout';

import { ExcelExport, ExcelExportColumn } from '@progress/kendo-react-excel-export';
import { LocalizationProvider } from '@progress/kendo-react-intl';
import { process } from '@progress/kendo-data-query';
import AddFile from '../../../src/pages/goodsin/AddFile.js';

const mapStateToProps = state => {
    return ({ Login: state.Login })
}
class DynamicPreRegDesign extends React.Component {
    constructor(props) {
        super(props);
        this.searchRef = React.createRef();
        this.confirmMessage = new ConfirmMessage();
        this.state = {
            userRoleControlRights: [],
            controlMap: new Map(),
            addTemplateId: -1,
            editId: -1, deleteId: -1, approveID: -1, previewId: -1, copyID: -1,
            selectedRecord: {},
            sampleTypeOptions: [],
            defaultTemplateOptions: [],
            selectedSampleType: {},
            selectedDefaultTemplate: {},
            breadCrumbData: [],
            design: [],
            comboComponents: [],
            withoutCombocomponent: [],
            selectedMaster: [],
            dataState: { skip: 0, take: 10 }
        };
    }
    static getDerivedStateFromProps(props, state) {
        if (props.Login.masterStatus !== "" && props.Login.masterStatus !== state.masterStatus) {
            toast.warn(props.intl.formatMessage({ id: props.Login.masterStatus }));
            props.Login.masterStatus = "";
        }

        if (props.Login.error !== "" && props.Login.error !== state.error) {
            toast.error(props.Login.error)
            props.Login.error = "";
        }
        return null;
    }

    custombuttonclick = (event, component) => {
        event.preventDefault();
        event.stopPropagation();
        const inputparam = {
            component, userinfo: this.props.Login.userInfo,
            selectedRecord: this.state.selectedRecord
        }
        this.props.getDynamicFilter(inputparam)
    }

    onChangeAwesomeQueryBuilder = (immutableTree, config) => {
        //  let selectedRecord = this.state.selectedRecord || {};
        const filterquery = QbUtils.sqlFormat(immutableTree, config);
        const filterQueryTreeStr = QbUtils.getTree(immutableTree);
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                awesomeTree: immutableTree, awesomeConfig: config, filterquery,filterQueryTreeStr
            }
        }
        this.props.updateStore(updateInfo)
        // this.setState({ awesomeTree: immutableTree, awesomeConfig: config, selectedRecord: selectedRecord });

    };

    handlePageChange = (event) => {
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                kendoSkip: event.skip, kendoTake: event.take
            }
        }
        this.props.updateStore(updateInfo)
        //this.setState({ kendoSkip: event.skip, kendoTake: event.take });
    };
    handleFilterChange = (event) => {
        // event.preventDefault();
        //event.stopPropagation();
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                kendoFilter: event.filter
                // screenName: this.props.Login.masterData.RealRegSubTypeValue.sregsubtypename
            }
        }
        this.props.updateStore(updateInfo)
        // this.setState({ kendoFilter: event.filter });
    };
    // removeInvalidDate = (filterquery) => {

    //     if (filterquery.inclues("Invalid Date")) {

    //         let startIndex = filterquery.indexOf("Invalid Date");
    //         let endIndex = startIndex + 12;
    //         const str = filterquery.subString(0, startIndex)
    //         if (startIndex > 3) {
    //             if (str.subString(startIndex - 4, startIndex) === 'AND') {

    //             } else if (str.subString(startIndex - 3, startIndex) === 'OR') {

    //             }
    //             else if (str.subString(startIndex - 4, startIndex) === 'NOT') {

    //             }

    //         }


    //     }

    // }





    handleExecuteClick = (event) => {
        //const selectedRecord = this.state.selectedRecord
        const filterquery = this.props.Login.filterquery
        const filterQueryTreeStr = this.props.Login.filterQueryTreeStr;
        let isFilterEmpty=checkFilterIsEmptyQueryBuilder(filterQueryTreeStr);
        if (filterquery !== "" && filterquery !== undefined && !filterquery.includes('Invalid date') && isFilterEmpty) {
            const val = removeSpaceFromFirst(filterquery, '')

            //  const array = filterquery.split(" ");
            // let array1 = "";
            // for (let i = 0; i < array.length; i++) {

            //     if (array[i] === "'") {

            //         const newArray = [...array.splice(i)];
            //         const index = newArray.findIndex(x => x === "'");

            //         if (index > 2) {
            //             for (let j = 0; j < newArray.length; j++) {
            //                 if (j<=index) {
            //                     if(newArray[j]!=="'"){
            //                         array1 = array1 +' '+ newArray[j] 
            //                     }
            //                     i = i + 1;
            //                 }

            //             } 
            //         } else {
            //             array1 = array1 + array[i];
            //         }
            //     } else {
            //         array1 = array1 + array[i];
            //     }

            // }
            const inputparam = {
                component: this.props.Login.seletedFilterComponent,
                userinfo: this.props.Login.userInfo,
                filterquery: val,
                // selectedRecord:this.state.selectedRecord

            }
            this.props.getDynamicFilterExecuteData(inputparam)
        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_PROVIDEVALUESFORINPUTS" }));
        }
    }

    // handleKendoRowClick = (event) => {
    //     let selecteddata = event.dataItem;
    //     const component = this.props.Login.seletedFilterComponent
    //     if (component.hasOwnProperty("child")) {
    //         const selectedRecord = this.state.selectedRecord;
    //         component.child.map(y => {
    //             // component.filterfields.filter(x=>x.)
    //             const withoutCombocomponent = this.state.withoutCombocomponent;
    //             const readonlyfields = withoutCombocomponent.findIndex(k => k.label === y.label);
    //             if (readonlyfields !== -1) {

    //                 if (withoutCombocomponent[readonlyfields]['inputtype'] === "date") {
    //                     selectedRecord[y.label] = selecteddata[withoutCombocomponent[readonlyfields]["displaymember"]] ?
    //                         rearrangeDateFormatforKendoDataTool(this.props.Login.userInfo, selecteddata[withoutCombocomponent[readonlyfields]["displaymember"]]) : ""
    //                     selectedRecord[y.label + 'value'] = selectedRecord[y.label]

    //                     if (withoutCombocomponent[readonlyfields].child) {
    //                         const Age = withoutCombocomponent.filter(x => x.name === 'Age');
    //                         withoutCombocomponent[readonlyfields].child.map(k => {
    //                             if (k.label === Age[0].label) {
    //                                 const age = ageCalculate(selectedRecord[y.label]);

    //                                 selectedRecord[Age[0].label] = age
    //                             }
    //                         })


    //                     }



    //                 } else {
    //                     if (withoutCombocomponent[readonlyfields]["isMultiLingual"]) {
    //                         selectedRecord[y.label] = selecteddata[withoutCombocomponent[readonlyfields]["displaymember"]] ?
    //                             selecteddata[withoutCombocomponent[readonlyfields]["displaymember"]][this.props.Login.userInfo.languagetypeCode] ?
    //                                 selecteddata[withoutCombocomponent[readonlyfields]["displaymember"]][this.props.Login.userInfo.languagetypeCode] : selecteddata[withoutCombocomponent[readonlyfields]["displaymember"]] : ""
    //                     } else {
    //                         selectedRecord[y.label] = selecteddata[withoutCombocomponent[readonlyfields]["displaymember"]] ? selecteddata[withoutCombocomponent[readonlyfields]["displaymember"]] : ""
    //                     }
    //                 }


    //             } else {
    //                 const comboComponents = this.state.comboComponents;
    //                 const readonlyfields = comboComponents.findIndex(k => k.label === y.label);
    //                 if (readonlyfields !== -1) {
    //                     if (this.props.Login.comboData[y.label]) {
    //                         const val = this.props.Login.comboData[y.label].filter(item => item.value === selecteddata[y.foriegntablePK])
    //                         if (val.length > 0)
    //                             selectedRecord[y.label] = val[0]
    //                         //selectedRecord[y.label]=this.props.Login.comboData[y.label].filter(item=>item.value===selecteddata[y.foriegntablePK])
    //                     }

    //                 }

    //             }

    //         })
    //         const updateInfo = {
    //             typeName: DEFAULT_RETURN,
    //             data: {
    //                 selectedRecord,
    //                 loadCustomSearchFilter: false,
    //                 // screenName: this.props.Login.masterData.RealRegSubTypeValue.sregsubtypename
    //             }
    //         }
    //         this.props.updateStore(updateInfo)
    //         // }
    //     }
    // };



    handleKendoRowClick = (event) => {
        let item1 = event.dataItem;
        const component = this.props.Login.seletedFilterComponent;

        if (component["childFields"]) {
            const index = this.props.Login.masterIndex;
            let selectedRecord = this.state.selectedMaster || {};

            component["childFields"].map(item => {
                let data = item1[item.columnname];
                if (item.ndesigncomponentcode === designComponents.COMBOBOX) {
                    //combocontrol
                    data = { label: item1[item.sdisplaymember], value: item1[item.svaluemember] };
                }
                else if (item.ndesigncomponentcode === designComponents.DATEPICKER) {
                    //Date picker control
                    data = rearrangeDateFormatforKendoDataTool(this.props.Login.userInfo, data);
                }
                selectedRecord[index][item.columnname] = data;
                return null;
            })


            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: { selectedMaster: selectedRecord, loadCustomSearchFilter: false, }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            const newdata = {
                label: item1[component['displaymember']],
                value: item1[component['valuemember']], item: { jsondata: { ...item1, jsondata: { ...item1 } } }
            };

            this.onComboChange(newdata, component, component['label']);
        }

    };

    render() {
        // console.log("this.state.selectedDefaultTemplate:", this.state, this.props.Login);
        const Layout = this.props.Login.masterData.selectedTemplate &&
            this.props.Login.masterData.selectedTemplate.jsondata;

        const filterParam = {
            inputListName: "RegistrationTemplate",
            selectedObject: "selectedTemplate",
            primaryKeyField: "nreactregtemplatecode",
            fetchUrl: "dynamicpreregdesign/getDynamicPreRegDesign",
            fecthInputObject: {
                userinfo: this.props.Login.userInfo,
                nsampletypecode: this.state.breadCrumbData[0] ? this.state.breadCrumbData[0].item.value : -1,
                ndefaulttemplatecode: this.state.breadCrumbData[1] ? this.state.breadCrumbData[1].item.value : -1
            },
            masterData: this.props.Login.masterData,
            unchangeList: ["realSampleType", "SampleTypes", "DefaultTemplateList"],
            searchFieldList: ["sregtemplatename", "stransdisplaystatus"]
        };
        return (
            <>
                <div className="client-listing-wrap mtop-fixed-breadcrumb fixed_breadcrumd">
                    {this.state.breadCrumbData.length > 0 ?
                        <Affix top={53}>
                            <BreadcrumbComponent breadCrumbItem={this.state.breadCrumbData} />
                        </Affix> : ""
                    }
                    <Row noGutters={true}>
                        <Col md={4}>
                            <ListMaster
                                filterColumnData={this.props.filterColumnData}
                                screenName={"Dynamic Pre-Reg Design"}
                                masterList={this.props.Login.masterData.searchedData || this.props.Login.masterData.RegistrationTemplate || []}
                                masterData={this.props.Login.masterData}
                                userInfo={this.props.Login.userInfo}
                                getMasterDetail={(template) => this.props.selectRegistrationTemplate(template, this.props.Login.masterData, this.props.Login.userInfo)}
                                selectedMaster={this.props.Login.masterData.selectedTemplate}
                                primaryKeyField="nreactregtemplatecode"
                                mainField="sregtemplatename"
                                firstField="stransdisplaystatus"
                                // secondField="stransdisplaystatus"
                                userRoleControlRights={this.state.userRoleControlRights}
                                addId={this.state.addTemplateId}
                                filterParam={filterParam}
                                hidePaging={true}
                                searchRef={this.searchRef}
                                reloadData={this.reloadData}
                                openModal={() => this.props.getReactInputFields(this.props.Login.userInfo, 'create',
                                    // { design: this.state.selectedDefaultTemplate && this.state.selectedDefaultTemplate.item && 
                                    //     this.state.selectedDefaultTemplate.item.jsondata }
                                    {
                                        design: this.state.breadCrumbData[1] && this.state.breadCrumbData[1].label === "IDS_TEMPLATETYPE" ? this.state.breadCrumbData[1]
                                            && this.state.breadCrumbData[1].item.item.jsondata : this.state.breadCrumbData[2] && this.state.breadCrumbData[2].item.item.jsondata
                                    }, this.state.addTemplateId)}
                                openFilter={this.openFilter}
                                closeFilter={this.closeFilter}
                                onFilterSubmit={this.onFilterSubmit}
                                showFilterIcon={true}
                                showFilter={this.props.Login.showFilter}
                                filterComponent={[
                                    {
                                        "IDS_SAMPLETYPEFILTER":
                                            <Row>
                                                <Col md={12}>
                                                    <FormSelectSearch
                                                        name={"nsampletypecode"}
                                                        formLabel={this.props.intl.formatMessage({ id: "IDS_SAMPLETYPE" })}
                                                        isSearchable={false}
                                                        placeholder="Please Select..."
                                                        options={this.state.sampleTypeOptions}
                                                        value={this.state.selectedSampleType ? this.state.selectedSampleType : ""}
                                                        onChange={value => this.filterComboChange(value, 'SampleType')}
                                                    >
                                                    </FormSelectSearch>
                                                </Col>
                                                {this.state.selectedSampleType.value === SampleType.SUBSAMPLE ?
                                                    <Col md={12}>
                                                        <FormSelectSearch
                                                            name={"nsampletypecode"}
                                                            formLabel={this.props.intl.formatMessage({ id: "IDS_SUBSAMPLEBASEDSAMPLETYPE" })}
                                                            isSearchable={false}
                                                            placeholder="Please Select..."
                                                            options={this.state.defaultSampleType}
                                                            value={this.state.selectedSampleTypeList ? this.state.selectedSampleTypeList : ""}
                                                            onChange={value => this.filterComboChange(value, 'SubSampleType')}
                                                        >
                                                        </FormSelectSearch>
                                                    </Col> : ""}
                                                <Col md={12}>
                                                    <FormSelectSearch
                                                        name={"ndefaulttemplatecode"}
                                                        formLabel={this.props.intl.formatMessage({ id: "IDS_TEMPLATETYPE" })}
                                                        isSearchable={false}
                                                        placeholder={this.props.intl.formatMessage({ id: "IDS_TEMPLATETYPE" })}
                                                        options={this.state.defaultTemplateOptions}
                                                        value={this.state.selectedDefaultTemplate ? this.state.selectedDefaultTemplate : ""}
                                                        onChange={value => this.templateComboChange(value)}
                                                    >
                                                    </FormSelectSearch>
                                                </Col>
                                            </Row>
                                    }
                                ]}
                            />
                        </Col>
                        <Col md='8'>
                            {this.props.Login.masterData.selectedTemplate ?
                                <ContentPanel className="panel-main-content">
                                    <Card className="border-0">
                                        <Card.Header>
                                            <Card.Title className="product-title-main">
                                                {this.props.Login.masterData.selectedTemplate.sregtemplatename}
                                            </Card.Title>
                                            <Card.Subtitle>
                                                <div className="d-flex product-category">
                                                    <h2 className="product-title-sub flex-grow-1">
                                                        <MediaLabel className={`btn-outlined ${this.props.Login.masterData.selectedTemplate.ntransactionstatus === transactionStatus.APPROVED ? "outline-success"
                                                            : "outline-secondary"} btn-sm mr-3`}>
                                                            {this.props.Login.masterData.selectedTemplate.stransdisplaystatus}
                                                        </MediaLabel>
                                                    </h2>
                                                    <div className="d-inline">
                                                        <Nav.Link name="editInstrument"
                                                            data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_PREVIEW" })}
                                                            // data-for="tooltip_list_wrap"
                                                            // hidden={this.state.userRoleControlRights.indexOf(this.state.previewId) === -1}
                                                            className="btn btn-circle outline-grey mr-2"
                                                            onClick={(e) => this.getPreviewTemplate(this.props.Login.masterData,
                                                                this.props.Login.userInfo, this.state.previewId
                                                            )}
                                                        >
                                                            <FontAwesomeIcon icon={faEye} />
                                                        </Nav.Link>
                                                        <Nav.Link name="editInstrument"
                                                            data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_VIEWOREDIT" })}
                                                            // data-for="tooltip_list_wrap"
                                                            hidden={this.state.userRoleControlRights.indexOf(this.state.editId) === -1}
                                                            className="btn btn-circle outline-grey mr-2"
                                                            onClick={(e) => this.props.getEditRegTemplate(this.props.Login.masterData, this.props.Login.userInfo, this.state.editId)}
                                                        >
                                                            <FontAwesomeIcon icon={faPencilAlt} />
                                                        </Nav.Link>
                                                        <Nav.Link name="delete" className="btn btn-circle outline-grey mr-2 action-icons-wrap"
                                                            data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_DELETE" })}
                                                            //   data-for="tooltip_list_wrap"
                                                            hidden={this.state.userRoleControlRights.indexOf(this.state.deleteId) === -1}
                                                            onClick={() => this.ConfirmDelete(this.state.approveID)}>
                                                            <FontAwesomeIcon icon={faTrashAlt} />
                                                        </Nav.Link>
                                                        <Nav.Link name="approve" className="btn btn-circle outline-grey mr-2 action-icons-wrap"
                                                            data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_APPROVE" })}
                                                            // data-for="tooltip_list_wrap"
                                                            hidden={this.state.userRoleControlRights.indexOf(this.state.approveID) === -1}
                                                          onClick={() => this.deleteApproveTemplate('approve', this.state.approveID)}> 
                                                            <FontAwesomeIcon icon={faThumbsUp} />
                                                        </Nav.Link>
                                                        <Nav.Link name="copy"
                                                            data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_COPY" })}
                                                            //  data-for="tooltip_list_wrap"
                                                            hidden={this.state.userRoleControlRights.indexOf(this.state.copyID) === -1}
                                                            className="btn btn-circle outline-grey mr-2"
                                                            onClick={(e) => this.openModal(this.state.copyID,'copy')}
                                                        >
                                                            <FontAwesomeIcon icon={faCopy} />
                                                        </Nav.Link>
                                                        <Nav.Link name="copy"
                                                            data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_EXPORTTEMPLATE" })}
                                                            //  data-for="tooltip_list_wrap"
                                                            hidden={this.state.userRoleControlRights.indexOf(this.state.exportTemplateID) === -1}
                                                            className="btn btn-circle outline-grey mr-2"
                                                            onClick={(e) => this.exportExcel(this.state.exportTemplateID,'Export')}
                                                        >
                                                            <FontAwesomeIcon icon={faFileExcel} />
                                                        </Nav.Link>
                                                        <Nav.Link name="copy"
                                                            data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_IMPORTTEMPLATE" })}
                                                            //  data-for="tooltip_list_wrap"
                                                            hidden={this.state.userRoleControlRights.indexOf(this.state.importTemplateID) === -1}
                                                            className="btn btn-circle outline-grey mr-2"
                                                            onClick={(e) => this.excelModal(this.state.importTemplateID,'Import')}
                                                        >
                                                            <FontAwesomeIcon icon={faFileImport} />
                                                        </Nav.Link>
                                                    </div>
                                                </div>
                                            </Card.Subtitle>
                                        </Card.Header>
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
                                                                                                //<Col md={12 / componentrow.length}>
                                                                                                componentrow.inputtype !== "frontendsearchfilter" && componentrow.inputtype !== "backendsearchfilter" &&
                                                                                                <Col md={componentrow && (componentrow.length || 4)}>
                                                                                                    <FormGroup>
                                                                                                        <FormLabel>{componentrow.displayname ? componentrow.displayname[this.props.Login.userInfo.slanguagetypecode] || componentrow.label : componentrow.label}</FormLabel>
                                                                                                        {componentrow.inputtype !== "label" &&
                                                                                                         <ReadOnlyText>{"-"}</ReadOnlyText>
                                                                                                        }
                                                                                                    </FormGroup>
                                                                                                </Col>
                                                                                            )
                                                                                            }
                                                                                        </Row>
                                                                                        :
                                                                                        component.inputtype !== "frontendsearchfilter" && component.inputtype !== "backendsearchfilter" &&
                                                                                        <FormGroup>
                                                                                            <FormLabel>
                                                                                                {component.displayname ? component.displayname[this.props.Login.userInfo.slanguagetypecode] 
                                                                                                    || component.label : component.label}
                                                                                            </FormLabel>
                                                                                            {component.inputtype !== "label" &&
                                                                                                <ReadOnlyText> {"-"}</ReadOnlyText>                                                                                               
                                                                                            }
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
                                    </Card>
                                </ContentPanel>
                                : ""}
                        </Col>
                    </Row>
                </div>


                {this.props.Login.openModal ?
                    <SlideOutModal
                        size={(this.props.Login.operation === 'copy'||this.props.Login.operation === 'Import') ? 'lg' : "xl"}
                        onSaveClick={this.props.Login.addMaster ? this.onSaveMasterRecord :
                          this.props.Login.operation === 'copy'? this.onSaveClick :this.props.Login.operation === 'Import'?
                          this.onSaveImportClick:
                                this.props.Login.operation === "preview" ?
                                    this.onExecuteClick : this.closeModal}
                        hideSave={
                            this.props.Login.addMaster ? true : (this.props.Login.operation === 'copy'
                                || this.props.Login.operation === "viewdesign"||this.props.Login.operation==='Import') ? false : true}
                        loginoperation={this.props.Login.operation === 'copy' ? false : true}
                        operation={this.props.Login.addMaster ? this.props.Login.masterOperation[this.props.Login.masterIndex] : this.props.Login.operation}
                        showValidate={
                            this.props.Login.addMaster ? false : this.props.Login.loadCustomSearchFilter ? false :
                                this.props.Login.operation === "preview" ? true : false}
                        screenName={this.props.Login.operation === 'copy' ? "IDS_TEMPLATE" :this.props.Login.operation==='Import'?"IDS_IMPORT": "IDS_PREVIEW"}
                        closeModal={this.closeModal}
                        show={this.props.Login.openModal}
                        onExecuteClick={this.onExecuteClick}
                        inputParam={this.props.Login.inputParam}
                        esign={this.props.Login.loadEsign}
                        validateEsign={this.validateEsign}
                        selectedRecord={this.props.Login.addMaster ?
                            this.state.selectedMaster[this.props.Login.masterIndex] : this.state.selectedRecord || {}}
                        mandatoryFields={this.props.Login.addMaster ?
                            this.props.Login.masterextractedColumnList[this.props.Login.masterIndex].filter(x => x.mandatory === true)
                            : this.props.Login.operation === 'copy' ?
                                [{ "idsName": "IDS_TEMPLATENAME", "dataField": "sregtemplatename", "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" }]
                                 : this.props.Login.operation === "preview" ? this.mandatoryValidation() : []}
                        addComponent={this.props.Login.loadEsign ?
                            <Esign
                                operation={this.props.Login.operation}
                                onInputOnChange={(event) => this.onInputOnChange(event)}
                                inputParam={this.props.Login.inputParam}
                                selectedRecord={this.state.selectedRecord || {}}
                            />
                            : this.props.Login.operation === 'copy' ?
                                <Row>
                                    <Col md={12}>
                                        <FormInput
                                            label={this.props.intl.formatMessage({ id: "IDS_TEMPLATENAME" })}
                                            name={"sregtemplatename"}
                                            type="text"
                                           // onChange={(event) => this.onInputOnChange(event)}
                                            onChange={(event) => this.setState({ selectedRecord: { ...this.state.selectedRecord, sregtemplatename: event.target.value } })}
                                            placeholder={this.props.intl.formatMessage({ id: "IDS_TEMPLATENAME" })}
                                            value={this.state.selectedRecord.sregtemplatename ? this.state.selectedRecord.sregtemplatename : ""}
                                            isMandatory={true}
                                            required={true}
                                            maxLength={"30"}
                                        />
                                    </Col>
                                </Row>
                                : this.props.Login.isDynamicViewSlideOut ?
                                    <ExternalOrderSlideout
                                        dynamicExternalSample={this.props.Login.dynamicExternalSample}
                                        dynamicExternalTestChild={this.props.Login.dynamicExternalTestChild}
                                        dynamicGridSelectedId={this.props.Login.dynamicGridSelectedId || null}
                                        selectedRecord={this.state.selectedRecord}
                                        selectedDynamicViewControl={this.props.Login.selectedDynamicViewControl}
                                    />

                                    : this.props.Login.loadCustomSearchFilter ?

                                        this.props.Login.seletedFilterComponent &&
                                            this.props.Login.seletedFilterComponent.inputtype === 'frontendsearchfilter' ?
                                            <KendoDatatoolFilter
                                                filter={this.props.Login.kendoFilter}
                                                handleFilterChange={this.handleFilterChange}
                                                filterData={this.props.Login.lstPatient || []}
                                                skip={this.props.Login.kendoSkip}
                                                take={this.props.Login.kendoTake}
                                                handlePageChange={this.handlePageChange}
                                                fields={this.props.Login.fields || []}
                                                gridColumns={this.props.Login.gridColumns || []}
                                                onRowClick={this.handleKendoRowClick}
                                                userInfo={this.props.Login.userInfo}

                                            /> :
                                            <PerfectScrollbar><div className='pb-4'><FilterQueryBuilder
                                                fields={this.props.Login.fields || {}}
                                                onChange={this.onChangeAwesomeQueryBuilder}
                                                tree={this.props.Login.awesomeTree}
                                                //   config={this.props.Login.awesomeConfig}
                                                skip={this.props.Login.kendoSkip}
                                                take={this.props.Login.kendoTake}
                                                handlePageChange={this.handlePageChange}
                                                gridColumns={this.props.Login.gridColumns || []}
                                                filterData={this.props.Login.lstPatient}
                                                onRowClick={this.handleKendoRowClick}
                                                handleExecuteClick={this.handleExecuteClick}
                                                userInfo={this.props.Login.userInfo}
                                            // static={true}
                                            // controlMap={this.state.controlMap}
                                            // dataState={this.state.dataState}
                                            // dataStateChange={this.dataStateChange}
                                            />
                                            </div>
                                            </PerfectScrollbar>
                                        : this.props.Login.addMaster ?
                                            <AddMasterRecords
                                                selectedControl={this.props.Login.selectedControl[this.props.Login.masterIndex]}
                                                fieldList={this.props.Login.masterfieldList && this.props.Login.masterfieldList[this.props.Login.masterIndex]}
                                                extractedColumnList={this.props.Login.masterextractedColumnList[this.props.Login.masterIndex]}
                                                // primaryKeyField={this.props.Login.masterprimaryKeyField}
                                                selectedRecord={this.state.selectedMaster[this.props.Login.masterIndex] || {}}
                                                onInputOnChange={this.onInputOnChangeMaster}
                                                onComboChange={this.onComboChangeMaster}
                                                handleDateChange={this.handleDateChangeMaster}
                                                dataList={this.props.Login.masterdataList && this.props.Login.masterdataList[this.props.Login.masterIndex]}
                                                onNumericInputOnChange={this.onNumericInputOnChangeMaster}
                                                masterDesign={this.props.Login.masterDesign && this.props.Login.masterDesign[this.props.Login.masterIndex]}
                                                mastertimeZoneList={this.props.Login.mastertimeZoneList}
                                                masterdefaultTimeZone={this.props.Login.masterdefaultTimeZone}
                                                onComboChangeMasterDyanmic={this.onComboChangeMasterDyanmic}
                                                handleDateChangeMasterDynamic={this.handleDateChangeMasterDynamic}
                                                onInputOnChangeMasterDynamic={this.onInputOnChangeMasterDynamic}
                                                onNumericInputChangeMasterDynamic={this.onNumericInputChangeMasterDynamic}
                                                onNumericBlurMasterDynamic={this.onNumericBlurMasterDynamic}
                                                userInfo={this.props.Login.userInfo}
                                                Login={this.props.Login}
                                                addMasterRecord={this.addMasterRecord}
                                                userRoleControlRights={this.props.Login.userRoleControlRights}
                                                masterIndex={this.props.Login.masterIndex}
                                                custombuttonclick={this.custombuttonclick}
                                                editMasterRecord={this.editMasterRecord}
                                                currentTime={rearrangeDateFormat(this.props.Login.userInfo,new Date())}
                                            />
                                            :this.props.Login.operation==="Import" ?
                                           <AddFile
                                           selectedRecord={this.state.selectedRecord}
                                           onDrop={this.onDropFile}
                                           deleteAttachment={this.deleteAttachment}
                                           />
                                            :<DynamicSlideout
                                                selectedRecord={this.props.Login.selectedRecord}
                                                templateData={this.props.Login.masterData.selectedTemplate &&
                                                    this.props.Login.masterData.selectedTemplate.jsondata}
                                                //handleChange={this.handleChange}
                                                handleDateChange={this.handleDateChange}
                                                onInputOnChange={this.onInputOnChange}
                                                onNumericInputChange={this.onNumericInputChange}
                                                comboData={this.props.Login.comboData}
                                                onComboChange={this.onComboChange}
                                                onDropFile={this.onDropFile}
                                                deleteAttachment={this.deleteAttachment}
                                                userInfo={this.props.Login.userInfo}
                                                timeZoneList={this.props.Login.timeZoneList}
                                                defaultTimeZone={this.props.Login.defaultTimeZone}
                                                Login={this.props.Login}
                                                addMasterRecord={this.addMasterRecord}
                                                custombuttonclick={this.custombuttonclick}
                                                onNumericBlur={this.onNumericBlur}
                                                userRoleControlRights={this.props.Login.userRoleControlRights}
                                                onClickView={this.onClickView}
                                                sampleType={this.state.selectedSampleType}
                                                comboComponents={this.state.comboComponents}
                                                editMasterRecord={this.editMasterRecord}
                                            />
                        } />
                    : ""}

                {this.props.Login.openPortal ?
                    <PortalModal>
                        <PreRegDesignPopUp
                            closeModal={this.closeModal}
                            nsampletypecode={this.state.breadCrumbData.length ? this.state.breadCrumbData[0].item.value : -1}
                            sampleType={this.state.breadCrumbData.length ? this.state.breadCrumbData[0].item : undefined}
                            defaultTemplate={this.state.breadCrumbData.length ? this.state.breadCrumbData[1].label === "IDS_TEMPLATETYPE" ? this.state.breadCrumbData[1].item : this.state.breadCrumbData[2].item : undefined}
                            ncategorybasedflowrequired={this.state.breadCrumbData.length ? this.state.breadCrumbData[0].item.item.ncategorybasedflowrequired : 4}
                            searchRef={this.searchRef}
                        />
                    </PortalModal> : ""}
                    {
                    this.state.export?
                                            
                         <LocalizationProvider>
                          <ExcelExport
                              data={process(this.state.selectedTemplate||[],
                                { sort: this.state.dataState.sort, filter: this.state.dataState.filter, group: this.state.dataState.group }).data}
                              collapsible={true}
                              fileName={(this.props.Login.masterData.selectedTemplate && this.props.Login.masterData.selectedTemplate.sregtemplatename)}
                              ref={(exporter) => {
                                this._excelExport =exporter;
                            }}>
                              {[...this.state.exportFiled].map((item) =>
                                  <ExcelExportColumn
                                      field={item.dataField} title={this.props.intl.formatMessage({ id: item.idsName })} width={200}
                                     />
                              )

                              }
                          </ExcelExport>
                      </LocalizationProvider >:""
                    }
                    
            </>
        );
    }

     
    exportExcel = () => {
            let exportFiled = [
                {"idsName": "IDS_SAMPLETYPENAME", "dataField": "ssampletypename", "width": "200px", "staticField": true },
                {"idsName": "IDS_TEMPLATETYPE", "dataField": "sdefaulttemplatename", "width": "200px", "staticField": true },
                { "idsName": "IDS_JSONDATA", "dataField": "jsontext", "width": "200px", "staticField": true },
                {"idsName": "IDS_SAMPLETYPECODE", "dataField": "nsampletypecode", "width": "200px", "staticField": true},
                {"idsName": "IDS_DEFAULTTEMPLATECODE", "dataField": "ndefaulttemplatecode", "width": "200px", "staticField": true },
              
        ];
        let selectedTemplate=[];
        selectedTemplate.push({...this.props.Login.masterData.selectedTemplate});
        this.setState({export:true,exportFiled,selectedTemplate})
    }
    excelModal = (ncontrolcode,operation) => {
        if(this.props.Login.masterData.selectedTemplate.ntransactionstatus!==transactionStatus.APPROVED){
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                selectedRecord: {}, operation:operation, ncontrolcode, selectedId: null,
                openModal: true, screenName: this.props.Login.inputParam.displayName
            }
        }
        this.props.updateStore(updateInfo);
    }else{
        toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTDRAFTRECORD" }));
    }
    }
    onDropFile = (attachedFiles, fieldName, maxSize) => {
        let selectedRecord = this.state.selectedRecord || {};
        selectedRecord[fieldName] = onDropAttachFileList(selectedRecord[fieldName], attachedFiles, maxSize)
        this.props.childDataChange(selectedRecord);
        this.setState({ selectedRecord, actionType: "new" });
    }

    deleteAttachment = (event, file, fieldName) => {
        let selectedRecord = this.state.selectedRecord || {};
        selectedRecord[fieldName] = deleteAttachmentDropZone(selectedRecord[fieldName], file)
        this.props.childDataChange(selectedRecord);
        this.setState({
            selectedRecord, actionType: "delete" //fileToDelete:file.name 
        });
    }

    onClickView = (selectedControl) => {
        const selectedRecord = this.state.selectedRecord;
        if (selectedRecord[selectedControl.label] !== undefined && selectedRecord[selectedControl.label] !== '') {
            this.props.viewExternalportalDetail(selectedControl, selectedRecord[selectedControl.label], this.props.Login.userInfo)
        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECT" }) + " " + selectedControl.label);
        }

    }

    onComboChangeMaster = (comboData, fieldName, item) => {
        const selectedMaster = this.state.selectedMaster || [];
        const masterIndex = this.props.Login.masterIndex
        selectedMaster[masterIndex] = selectedMaster[masterIndex] && ({ ...selectedMaster[masterIndex] } || {})
        if (comboData !== null) {
            if (this.props.Login.selectedControl[masterIndex].table.item.nformcode === 137
                || this.props.Login.selectedControl[masterIndex].table.item.nformcode === 43) {
                selectedMaster[masterIndex][item.tableDataField] = comboData.value;
            }
            else if (item.foreignDataField) {
                selectedMaster[masterIndex][item.foreignDataField] = comboData.value;
            }
        }
        selectedMaster[masterIndex][fieldName] = comboData;

        if (item.childIndex !== undefined) {
            this.props.getChildComboMaster(selectedMaster, fieldName, item,
                this.props.Login.selectedControl,
                this.props.Login.masterfieldList,
                this.props.Login.masterdataList, this.props.Login.userInfo, masterIndex)
        } else {
            this.setState({ selectedMaster });
        }

    }

    handleDateChangeMaster = (dateName, dateValue, item) => {
        //   const { selectedMaster } = this.state;
        const selectedMaster = this.state.selectedMaster || [];
        const masterIndex = this.props.Login.masterIndex
        selectedMaster[masterIndex] = selectedMaster[masterIndex] && ({ ...selectedMaster[masterIndex] } || {})

        selectedMaster[masterIndex][dateName] = dateValue;
        const age = ageCalculate(dateValue);
        selectedMaster[masterIndex]["sage"] = age;
        this.setState({ selectedMaster });

    }

    onNumericInputOnChangeMaster = (value, name, item) => {
        const selectedMaster = this.state.selectedMaster || [];
        const masterIndex = this.props.Login.masterIndex
        selectedMaster[masterIndex] = selectedMaster[masterIndex] && ({ ...selectedMaster[masterIndex] } || {})

        selectedMaster[masterIndex][name] = value;
        this.setState({ selectedMaster });
    }

    onInputOnChangeMaster = (event) => {
        const selectedMaster = this.state.selectedMaster || [];
        const masterIndex = this.props.Login.masterIndex
        selectedMaster[masterIndex] = selectedMaster[masterIndex] && ({ ...selectedMaster[masterIndex] } || {})

        if (event.target.type === 'checkbox') {
            selectedMaster[masterIndex][event.target.name] = event.target.checked === true ? 3 : 4;
            if (this.props.Login.selectedControl[masterIndex].table.item.nformcode === 137) {
                if (selectedMaster[masterIndex].nneedcurrentaddress === 3) {
                    selectedMaster[masterIndex].sflatnotemp = selectedMaster[masterIndex].sflatno;
                    selectedMaster[masterIndex].shousenotemp = selectedMaster[masterIndex].shouseno;
                    selectedMaster[masterIndex].spostalcodetemp = selectedMaster[masterIndex].spostalcode;
                    selectedMaster[masterIndex].sstreettemp = selectedMaster[masterIndex].sstreet;
                    selectedMaster[masterIndex].scitynametemp = selectedMaster[masterIndex].scityname;
                    selectedMaster[masterIndex].sdistrictnametemp = selectedMaster[masterIndex].sdistrictname;
                    selectedMaster[masterIndex].sregionnametemp = selectedMaster[masterIndex].sregionname;
                }
                else {
                    selectedMaster[masterIndex].sflatnotemp = "";
                    selectedMaster[masterIndex].shousenotemp = "";
                    selectedMaster[masterIndex].spostalcodetemp = "";
                    selectedMaster[masterIndex].sstreettemp = "";
                    selectedMaster[masterIndex].scitynametemp = "";
                    selectedMaster[masterIndex].sdistrictnametemp = "";
                    selectedMaster[masterIndex].sregionnametemp = "";
                }
            }
        }
        else {
            // selectedMaster[masterIndex][event.target.name] = event.target.value;
            if (event.target.name === "smobileno" || event.target.name === "sphoneno") {
                if (event.target.value !== "") {
                    event.target.value = validatePhoneNumber(event.target.value);
                    selectedMaster[masterIndex][event.target.name] = event.target.value !== "" ?
                        event.target.value : selectedMaster[masterIndex][event.target.name];
                }
                else {
                    selectedMaster[masterIndex][event.target.name] = event.target.value;
                }
            } else {
                selectedMaster[masterIndex][event.target.name] = event.target.value;
            }
        }
        this.setState({ selectedMaster });
    }

    onSaveMasterRecord = (saveType, formRef) => {
        //add / edit            

        //add / edit            
        const masterIndex = this.props.Login.masterIndex;
        let inputData = [];
        const selectedControl = this.props.Login.selectedControl
        const masterDesign = this.props.Login.masterDesign
        inputData["userinfo"] = { ...this.props.Login.userInfo, nformcode: selectedControl[masterIndex].table.item.nformcode };
        inputData[selectedControl[masterIndex].table.item.methodUrl.toLowerCase()] = {
            "nsitecode": this.props.Login.userInfo.nmastersitecode
        };

        let isEmailCheck = true;
        let isFileupload=false;
        const dateList = [];
        const methodUrl = selectedControl[masterIndex].table.item.methodUrl.toLowerCase()
        const formData = new FormData();

        if (this.props.Login.masterOperation[masterIndex] === 'update') {
            if (selectedControl[masterIndex].table.item.component === 'Dynamic') {
                inputData[methodUrl]["ndynamicmastercode"] = this.props.Login.masterEditObject[masterIndex].item ?
                    this.props.Login.masterEditObject[masterIndex].item.jsondata.ndynamicmastercode : this.props.Login.masterEditObject[masterIndex].ndynamicmastercode
            }
            else {
                inputData[methodUrl][selectedControl[masterIndex]["valuemember"]] = this.props.Login.masterEditObject[masterIndex].value
            }

        }

        if (selectedControl[masterIndex].table.item.component === 'Dynamic') {
            const selectedMaster = this.state.selectedMaster;
            inputData["userinfo"] = { ...this.props.Login.userInfo, nformcode: selectedControl[masterIndex].table.item.nformcode };
            inputData["masterdateconstraints"] = masterDesign[masterIndex].screendesign.masterdateconstraints;
            inputData["masterdatefields"] = masterDesign[masterIndex].screendesign.masterdatefields;
            inputData["mastercombinationunique"] = masterDesign[masterIndex].screendesign.mastercombinationunique;
            inputData["isFileupload"] = false;
             isFileupload=true;

            //add                          
            inputData[methodUrl] = {
                ...inputData[methodUrl],
                nformcode: selectedControl[masterIndex].table.item.nformcode,
                ndesigntemplatemappingcode: masterDesign[masterIndex].ndesigntemplatemappingcode,
                jsondata: {}, jsonuidata: {}
            };

           
            const defaulttimezone = this.props.Login.defaulttimezone;

            masterDesign[masterIndex] &&
                masterDesign[masterIndex].slideoutdesign.map(row => {
                    row.children.map(column => {
                        column.children.map(component => {
                            if (component.hasOwnProperty("children")) {

                                component.children.map(componentrow => {
                                    if (componentrow.inputtype === "combo") {
                                        inputData["dynamicmaster"]["jsondata"][componentrow.label] = selectedMaster[componentrow.label] ?
                                            {
                                                value: selectedMaster[masterIndex][componentrow.label].value,
                                                label: selectedMaster[masterIndex][componentrow.label].label,
                                                pkey: componentrow.valuemember,
                                                nquerybuildertablecode: componentrow.nquerybuildertablecode,
                                                source: componentrow.source,
                                                [componentrow.table.item.component === 'Dynamic' ? 'ndynamicmastercode' : componentrow.valuemember]: this.props.Login.masterOperation[masterIndex] === 'update' ?
                                                    selectedMaster[masterIndex][componentrow.label].item ? selectedMaster[masterIndex][componentrow.label].item.jsondata[componentrow.table.item.component === 'Dynamic' ? 'ndynamicmastercode' : componentrow.valuemember] :
                                                        selectedMaster[masterIndex][componentrow.label][componentrow.table.item.component === 'Dynamic' ? 'ndynamicmastercode' : componentrow.valuemember]
                                                    :
                                                    selectedMaster[masterIndex][componentrow.label].item.jsondata[componentrow.table.item.component === 'Dynamic' ? 'ndynamicmastercode' : componentrow.valuemember]

                                            } : -1

                                        inputData["dynamicmaster"]["jsonuidata"][componentrow.label] = selectedMaster[masterIndex][componentrow.label] ? selectedMaster[masterIndex][componentrow.label].label : ""

                                    }
                                    else if (componentrow.inputtype === "date") {
                                        if (componentrow.mandatory) {
                                            inputData["dynamicmaster"]["jsondata"][componentrow.label] = formatDate(selectedMaster[masterIndex][componentrow.label], false)

                                            inputData["dynamicmaster"]["jsonuidata"][componentrow.label] = inputData["dynamicmaster"]["jsondata"][componentrow.label]
                                            //inputData["dynamicmaster"]["jsonuidata"][componentrow.label] = convertDateTimetoString(selectedRecord[componentrow.label], userInfo);
                                        }
                                        else {
                                            inputData["dynamicmaster"]["jsondata"][componentrow.label] = componentrow.loadcurrentdate ?
                                                formatDate(selectedMaster[masterIndex][componentrow.label] || new Date(), false) :
                                                selectedMaster[masterIndex][componentrow.label] ? formatDate(selectedMaster[masterIndex][componentrow.label], false)
                                                    : "";

                                            inputData["dynamicmaster"]["jsonuidata"][componentrow.label] = inputData["dynamicmaster"]["jsondata"][componentrow.label];
                                            //convertDateTimetoString(selectedRecord[componentrow.label], userInfo);
                                        }
                                        if (componentrow.timezone) {
                                            inputData["dynamicmaster"]["jsondata"][`tz${componentrow.label}`] = selectedMaster[masterIndex][`tz${componentrow.label}`] ?
                                                { value: selectedMaster[masterIndex][`tz${componentrow.label}`].value, label: selectedMaster[masterIndex][`tz${componentrow.label}`].label } :
                                                defaulttimezone ? defaulttimezone : -1

                                            inputData["dynamicmaster"]["jsonuidata"][`tz${componentrow.label}`] = inputData["dynamicmaster"]["jsondata"][`tz${componentrow.label}`]
                                        }
                                        dateList.push(componentrow.label)
                                    }

                                    else {
                                        inputData["dynamicmaster"]["jsondata"][componentrow.label] = selectedMaster[masterIndex][componentrow.label] ?
                                            selectedMaster[masterIndex][componentrow.label] : ""

                                        inputData["dynamicmaster"]["jsonuidata"][componentrow.label] = inputData["dynamicmaster"]["jsondata"][componentrow.label]
                                        // inputData["dynamicmaster"]["jsondata"][componentrow.label]

                                    }
                                    return inputData["dynamicmaster"];
                                })
                            }
                            else {
                                if (component.inputtype === "combo") {
                                    inputData["dynamicmaster"]["jsondata"][component.label] = selectedMaster[masterIndex][component.label] ?
                                        {
                                            value: selectedMaster[masterIndex][component.label].value,
                                            label: selectedMaster[masterIndex][component.label].label,
                                            pkey: component.valuemember,
                                            nquerybuildertablecode: component.nquerybuildertablecode,
                                            source: component.source,
                                            [component.table.item.component === 'Dynamic' ? 'ndynamicmastercode' : component.valuemember]: this.props.Login.masterOperation[masterIndex] === 'update' ?
                                                selectedMaster[masterIndex][component.label].item ? selectedMaster[masterIndex][component.label].item.jsondata[component.table.item.component === 'Dynamic' ? 'ndynamicmastercode' : component.valuemember] : selectedMaster[masterIndex][component.label][component.table.item.component === 'Dynamic' ? 'ndynamicmastercode' : component.valuemember]
                                                :
                                                selectedMaster[masterIndex][component.label].item.jsondata[component.table.item.component === 'Dynamic' ? 'ndynamicmastercode' : component.valuemember]

                                        } : -1

                                    inputData["dynamicmaster"]["jsonuidata"][component.label] = inputData["dynamicmaster"]["jsondata"][component.label].label;
                                    //selectedRecord[component.label] ? selectedRecord[component.label].label : ""
                                }
                                else if (component.inputtype === "date") {
                                    if (component.mandatory) {
                                        inputData["dynamicmaster"]["jsondata"][component.label] = formatDate(selectedMaster[masterIndex][component.label], false);
                                        // convertDateTimetoString(selectedRecord[component.label] ?
                                        // selectedRecord[component.label] : new Date(), userInfo);

                                        inputData["dynamicmaster"]["jsonuidata"][component.label] = inputData["dynamicmaster"]["jsondata"][component.label]
                                        //convertDateTimetoString(selectedRecord[component.label], userInfo);

                                    } else {
                                        inputData["dynamicmaster"]["jsondata"][component.label] = component.loadcurrentdate ?
                                            //convertDateTimetoString(selectedRecord[component.label] ?                                      
                                            //    selectedRecord[component.label] : new Date(), userInfo) :
                                            formatDate(selectedMaster[masterIndex][component.label] || new Date(), false) :
                                            selectedMaster[masterIndex][component.label] ?
                                                // convertDateTimetoString(selectedRecord[component.label] ?
                                                //   selectedRecord[component.label] : new Date(), userInfo) : "";
                                                formatDate(selectedMaster[masterIndex][component.label], false) : "";
                                        inputData["dynamicmaster"]["jsonuidata"][component.label] = inputData["dynamicmaster"]["jsondata"][component.label]
                                        //convertDateTimetoString(selectedRecord[component.label], userInfo)

                                    }
                                    if (component.timezone) {
                                        inputData["dynamicmaster"]["jsondata"][`tz${component.label}`] = selectedMaster[masterIndex][`tz${component.label}`] ?
                                            { value: selectedMaster[masterIndex][`tz${component.label}`].value, label: selectedMaster[masterIndex][`tz${component.label}`].label } :
                                            defaulttimezone ? defaulttimezone : -1

                                        inputData["dynamicmaster"]["jsonuidata"][`tz${component.label}`] = inputData["dynamicmaster"]["jsondata"][`tz${component.label}`]
                                    }
                                    dateList.push(component.label)
                                }
                                else {
                                    inputData["dynamicmaster"]["jsondata"][component.label] = selectedMaster[masterIndex][component.label] ?
                                        selectedMaster[masterIndex][component.label] : ""

                                    inputData["dynamicmaster"]["jsonuidata"][component.label] = inputData["dynamicmaster"]["jsondata"][component.label]
                                }
                            }
                            return inputData["dynamicmaster"];
                        }
                        )
                        return inputData["dynamicmaster"];
                    })
                    return inputData["dynamicmaster"];
                })

                inputData["dynamicmaster"]["jsonstring"] = JSON.stringify(inputData["dynamicmaster"]["jsondata"]);
                inputData["dynamicmaster"]["jsonuistring"] = JSON.stringify(inputData["dynamicmaster"]["jsonuidata"]);
                inputData["masterdatelist"] = dateList;
                formData.append("Map", Lims_JSON_stringify(JSON.stringify({...inputData})));
        


        }
        else if (selectedControl[masterIndex].table.item.component === 'Type3Component'
            && selectedControl[masterIndex].table.item.nformcode === formCode.PATIENTMASTER) {
            inputData["noneedfilter"] = 1; //will disl=play all db records
            if (selectedControl[masterIndex].inputtype === 'backendsearchfilter' || selectedControl[masterIndex].inputtype === 'frontendsearchfilter') {
                inputData["noneedfilter"] = 2; //will display will added record
            }

            this.props.Login.masterextractedColumnList[masterIndex].map(item => {
                let fieldName = item.dataField;
                if (fieldName === "semail") {
                    isEmailCheck = this.state.selectedMaster[masterIndex][fieldName] && this.state.selectedMaster[masterIndex][fieldName] !== "" && this.state.selectedMaster[masterIndex][fieldName] !== "null" ? validateEmail(this.state.selectedMaster[masterIndex][fieldName]) : true;
                }
                if (item.isJsonField === true) {
                    return inputData[methodUrl][item.jsonObjectName] = { ...inputData[methodUrl][item.jsonObjectName], [fieldName]: this.state.selectedMaster[masterIndex][fieldName] ? this.state.selectedMaster[masterIndex][fieldName] : "" }
                }
                else {
                    if (item.controlType === "selectbox") {
                        // inputData[methodUrl][fieldName] = this.state.selectedMaster[fieldName] ? this.state.selectedMaster[fieldName].label ? this.state.selectedMaster[fieldName].label : "" : -1;
                        inputData[methodUrl][item.tableDataField] = this.state.selectedMaster[masterIndex][fieldName] ? this.state.selectedMaster[masterIndex][fieldName].value ? this.state.selectedMaster[masterIndex][fieldName].value : "" : -1;
                        return inputData;
                    }
                    else if (item.controlType === "datepicker") {
                        inputData[methodUrl][item.dateField] = formatInputDate(this.state.selectedMaster[masterIndex][fieldName] ? this.state.selectedMaster[masterIndex][fieldName] : "", false);
                    }
                    else if (item.controlType === "checkbox") {
                        inputData[methodUrl][item.controlName] = this.state.selectedMaster[masterIndex][item.controlName] ? this.state.selectedMaster[masterIndex][item.controlName] : transactionStatus.NO;
                    }
                    else {
                        inputData[methodUrl][fieldName] = this.state.selectedMaster[masterIndex][fieldName] ? this.state.selectedMaster[masterIndex][fieldName] : "";
                    }
                    // inputData[methodUrl][selectedRecordPrimarykey] = this.props.Login.selectedId;
                    return inputData;
                }
            })
        }
        else if (selectedControl[masterIndex].table.item.component === 'Type3Component'
            && selectedControl[masterIndex].table.item.nformcode === 43) {
            inputData["noneedfilter"] = 2; //will disl=play all db records
            if (selectedControl[masterIndex].inputtype === 'backendsearchfilter' || selectedControl[masterIndex].inputtype === 'frontendsearchfilter') {
                inputData["noneedfilter"] = 2; //will display will added record
            }

            this.props.Login.masterextractedColumnList[masterIndex].map(item => {
                let fieldName = item.dataField;
                if (fieldName === "semail") {
                    isEmailCheck = this.state.selectedMaster[masterIndex][fieldName] && this.state.selectedMaster[masterIndex][fieldName] !== "" && this.state.selectedMaster[masterIndex][fieldName] !== "null" ? validateEmail(this.state.selectedMaster[masterIndex][fieldName]) : true;
                }
                if (item.isJsonField === true) {
                    let fieldData = this.state.selectedMaster[masterIndex][fieldName] ? this.state.selectedMaster[masterIndex][fieldName] : "";
                    if (item.controlType === "datepicker") {
                        fieldData = formatInputDate(this.state.selectedMaster[masterIndex][fieldName] ? this.state.selectedMaster[masterIndex][fieldName] : "", false);

                    }
                    else if (item.controlType === "selectbox") {
                        fieldData = this.state.selectedMaster[masterIndex][fieldName] ? this.state.selectedMaster[masterIndex][fieldName].value ? this.state.selectedMaster[masterIndex][fieldName].value : "" : -1;
                        inputData[methodUrl][item.tableDataField] = this.state.selectedMaster[masterIndex][fieldName] ? this.state.selectedMaster[masterIndex][fieldName].value ? this.state.selectedMaster[masterIndex][fieldName].value : "" : -1;
                        fieldName = item.tableDataField;
                    }
                    inputData[methodUrl][item.jsonObjectName] = {
                        ...inputData[methodUrl][item.jsonObjectName],
                        [fieldName]: fieldData
                    };
                    return inputData[methodUrl];
                }
                else {
                    if (item.controlType === "selectbox") {
                        // inputData[methodUrl][fieldName] = this.state.selectedMaster[fieldName] ? this.state.selectedMaster[fieldName].label ? this.state.selectedMaster[fieldName].label : "" : -1;
                        inputData[methodUrl][item.tableDataField] = this.state.selectedMaster[masterIndex][fieldName] ? this.state.selectedMaster[masterIndex][fieldName].value ? this.state.selectedMaster[masterIndex][fieldName].value : "" : -1;
                        return inputData;
                    }
                    else if (item.controlType === "datepicker") {
                        inputData[methodUrl][item.dateField] = formatInputDate(this.state.selectedMaster[masterIndex][fieldName] ? this.state.selectedMaster[masterIndex][fieldName] : "", false);
                    }
                    else if (item.controlType === "checkbox") {
                        inputData[methodUrl][item.controlName] = this.state.selectedMaster[masterIndex][item.controlName] ? this.state.selectedMaster[masterIndex][item.controlName] : transactionStatus.NO;
                    }
                    else {
                        inputData[methodUrl][fieldName] = this.state.selectedMaster[masterIndex][fieldName] ? this.state.selectedMaster[masterIndex][fieldName] : "";
                    }
                    // inputData[methodUrl][selectedRecordPrimarykey] = this.props.Login.selectedId;
                    return inputData;
                }
            })
            inputData[methodUrl]["nproductcode"] = -1;
            // inputData[methodUrl]["ndiagnosticcasecode"] = -1;
            // inputData[methodUrl]["sexternalorderid"] = 1;
            inputData[methodUrl]["nordertypecode"] = 1;
        }
        else {

            this.props.Login.masterextractedColumnList[masterIndex].map(item => {
                let fieldName = item.dataField;
                if (item.isJsonField === true) {
                    let fieldData = this.state.selectedMaster[masterIndex][fieldName] ? this.state.selectedMaster[masterIndex][fieldName] : "";
                    if (item.controlType === "datepicker") {
                        fieldData = formatInputDate(this.state.selectedMaster[masterIndex][fieldName] ? this.state.selectedMaster[masterIndex][fieldName] : "", false);

                    }
                    return inputData[methodUrl][item.jsonObjectName] = {
                        ...inputData[methodUrl][item.jsonObjectName],
                        [fieldName]: fieldData
                    }
                }
                else {
                    if (item.controlType === "selectbox") {
                        inputData[methodUrl][fieldName] = this.state.selectedMaster[masterIndex][fieldName] ? this.state.selectedMaster[masterIndex][fieldName].label ? this.state.selectedMaster[masterIndex][fieldName].label : "" : -1;
                        inputData[methodUrl][item.foreignDataField] = this.state.selectedMaster[masterIndex][fieldName] ? this.state.selectedMaster[masterIndex][fieldName].value ? this.state.selectedMaster[masterIndex][fieldName].value : "" : -1;

                        return inputData;
                    }
                    else if (item.controlType === "datepicker") {
                        inputData[methodUrl][item.dateField] = formatInputDate(this.state.selectedMaster[masterIndex][fieldName] ? this.state.selectedMaster[masterIndex][fieldName] : "", false);
                    }
                    else if (item.controlType === "checkbox") {
                        inputData[methodUrl][item.controlName] = this.state.selectedMaster[masterIndex][item.controlName] ? this.state.selectedMaster[masterIndex][item.controlName] : transactionStatus.NO;
                    }
                    else {
                        inputData[methodUrl][fieldName] = this.state.selectedMaster[masterIndex][fieldName] ? this.state.selectedMaster[masterIndex][fieldName] : "";
                    }
                    // inputData[methodUrl][selectedRecordPrimarykey] = this.props.Login.selectedId;

                    return inputData;
                }
            });

            //inputData[methodUrl]["jsondata"] = {...inputData[methodUrl]};
        }
        // }
        
        const inputParam = {
            withoutCombocomponent: this.state.withoutCombocomponent,
            comboComponents: this.state.comboComponents,
            selectedRecord: this.state.selectedRecord,
            selectedRecordName: 'selectedRecord',
            loadSubSample: false,
            selectedControl: this.props.Login.selectedControl,
            comboData: this.props.Login.comboData,
            comboName: 'comboData',
            classUrl: selectedControl[masterIndex].table.item.classUrl,
            methodUrl: selectedControl[masterIndex].table.item.methodUrl,
            displayName: this.props.Login.inputParam.displayName,// selectedControl[masterIndex].table.item.sdisplayname,
            inputData: inputData,
            operation: this.props.Login.masterOperation[masterIndex], saveType, formRef,
            masterIndex,
            selectedMaster: this.state.selectedMaster,
            mastercomboComponents: this.props.Login.mastercomboComponents,
            masterwithoutCombocomponent: this.props.Login.masterwithoutCombocomponent,
            masterComboColumnFiled: this.props.Login.masterComboColumnFiled,
            masterextractedColumnList: this.props.Login.masterextractedColumnList,
            masterdataList: this.props.Login.masterdataList,
            masterDesign: this.props.Login.masterDesign,
            masterfieldList: this.props.Login.masterfieldList,
            userinfo: this.props.Login.userInfo,
            masterEditObject: this.props.Login.masterEditObject,
            masterOperation: this.props.Login.masterOperation,
            formData: formData,
            isFileupload
        }

        if (isEmailCheck) {
            this.props.addMasterRecord(inputParam, this.props.Login.masterData)
        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_ENTERVALIDEMAIL" }));
        }


        // if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolCode)) {

        //     const updateInfo = {
        //         typeName: DEFAULT_RETURN,
        //         data: {
        //             loadEsign: true, screenData: { inputParam, masterData: this.props.Login.masterData },
        //             openModal: true, screenName: this.props.intl.formatMessage({ id: this.props.Login.inputParam.displayName }),
        //             operation: this.props.Login.operation
        //         }
        //     }
        //     this.props.updateStore(updateInfo);
        // }
        // else {
        //  this.props.crudMaster(inputParam, this.props.Login.masterData, "openModal");
        //  }

    }

    mandatoryValidation = () => {
        const mandatoryFields = []
        const selectedRecord = this.state.selectedRecord;
        this.props.Login.masterData.selectedTemplate &&
            this.props.Login.masterData.selectedTemplate.jsondata.map(row => {
                return row.children.map(column => {
                    return column.children.map(component => {
                        return component.hasOwnProperty("children") ?
                            component.children.map(componentrow => {
                                if (componentrow.mandatory === true) {
                                    if (componentrow.recordbasedshowhide) {
                                        if (this.state.selectedRecord[componentrow.parentLabel]
                                            === componentrow.recordbasedhide) {
                                            if (componentrow.inputtype === "email") {
                                                mandatoryFields.push({
                                                    "mandatory": true, 
                                                    //"idsName": componentrow.label,
                                                     "idsName": componentrow.displayname[this.props.Login.userInfo.slanguagetypecode],
                                                    "dataField": componentrow.label,
                                                    "alertPreFix": this.props.intl.formatMessage({ id: "IDS_VALID" }),
                                                    "validateFunction": validateEmail,
                                                    "mandatoryLabel": "IDS_ENTER",
                                                    "controlType": "textbox"
                                                })
                                            } else {
                                                mandatoryFields.push({
                                                    "mandatory": true,
                                                    //"idsName": componentrow.label,
                                                    "idsName": componentrow.displayname[this.props.Login.userInfo.slanguagetypecode],
                                                    "dataField": componentrow.label,
                                                    "mandatoryLabel": componentrow.inputtype === "combo" ?
                                                        "IDS_SELECT" : "IDS_ENTER",
                                                    "controlType": componentrow.inputtype === "combo" ?
                                                        "selectbox" : "textbox"
                                                })
                                            }
                                        }

                                    } else {
                                        if (componentrow.inputtype === "email") {
                                            mandatoryFields.push({
                                                "mandatory": true,
                                                // "idsName": componentrow.label,
                                                 "idsName": componentrow.displayname[this.props.Login.userInfo.slanguagetypecode],
                                                "dataField": componentrow.label,
                                                "alertPreFix": this.props.intl.formatMessage({ id: "IDS_VALID" }),
                                                "validateFunction": validateEmail,
                                                "mandatoryLabel": "IDS_ENTER",
                                                "controlType": "textbox"
                                            })
                                        } else {
                                            mandatoryFields.push({
                                                "mandatory": true,
                                                //"idsName": componentrow.label,
                                                "idsName": componentrow.displayname[this.props.Login.userInfo.slanguagetypecode],
                                                "dataField": componentrow.label,
                                                "mandatoryLabel": componentrow.inputtype === "combo" ?
                                                    "IDS_SELECT" : "IDS_ENTER",
                                                "controlType": componentrow.inputtype === "combo" ?
                                                    "selectbox" : "textbox"
                                            })
                                        }
                                    }
                                } else {
                                    if (componentrow.inputtype === "email") {

                                        selectedRecord[componentrow.label] &&
                                            selectedRecord[componentrow.label] !== "" &&
                                            mandatoryFields.push({
                                                "mandatory": true,
                                                // "idsName": componentrow.label,
                                                 "idsName": componentrow.displayname[this.props.Login.userInfo.slanguagetypecode],
                                                "dataField": componentrow.label,
                                                "alertPreFix": this.props.intl.formatMessage({ id: "IDS_VALID" }),
                                                "validateFunction": validateEmail,
                                                "mandatoryLabel": "IDS_ENTER",
                                                "controlType": "textbox"
                                            })
                                    }
                                }
                                return null;
                            })
                            : component.mandatory === true ?
                                component.recordbasedshowhide ?
                                    this.state.selectedRecord[component.parentLabel]
                                        === component.recordbasedhide ?
                                        component.inputtype === "email" ?
                                            mandatoryFields.push({
                                                "mandatory": true,
                                                //"idsName": component.label, 
                                                 "idsName": component.displayname[this.props.Login.userInfo.slanguagetypecode],
                                                "dataField": component.label,
                                                "alertPreFix": this.props.intl.formatMessage({ id: "IDS_VALID" }),
                                                "validateFunction": validateEmail,
                                                "mandatoryLabel": "IDS_ENTER",
                                                "controlType": "textbox"
                                            })
                                            :
                                            mandatoryFields.push({
                                                "mandatory": true,
                                                //"idsName": component.label,
                                                "idsName": component.displayname[this.props.Login.userInfo.slanguagetypecode],                                              
                                                 "dataField": component.label,
                                                "mandatoryLabel": component.inputtype === "combo" ?
                                                    "IDS_SELECT" : "IDS_ENTER",
                                                "controlType": component.inputtype === "combo" ? "selectbox" : "textbox"
                                            }) : "" :
                                    component.inputtype === "email" ?
                                        mandatoryFields.push({
                                            "mandatory": true,
                                            //"idsName": component.label, 
                                            "idsName": component.displayname[this.props.Login.userInfo.slanguagetypecode], 
                                            "dataField": component.label,
                                            "alertPreFix": this.props.intl.formatMessage({ id: "IDS_VALID" }),
                                            "validateFunction": validateEmail,
                                            "mandatoryLabel": "IDS_ENTER",
                                            "controlType": "textbox"
                                        })
                                        :
                                        mandatoryFields.push({
                                            "mandatory": true,
                                            //"idsName": component.label, 
                                            "idsName": component.displayname[this.props.Login.userInfo.slanguagetypecode], 
                                            "dataField": component.label,
                                            "mandatoryLabel": component.inputtype === "combo" ?
                                                "IDS_SELECT" : "IDS_ENTER",
                                            "controlType": component.inputtype === "combo" ? "selectbox" : "textbox"
                                        })
                                : selectedRecord[component.label] ?
                                    component.inputtype === "email" ?
                                        mandatoryFields.push({
                                            "mandatory": true,
                                            //"idsName": component.label, 
                                             "idsName": component.displayname[this.props.Login.userInfo.slanguagetypecode],
                                            "dataField": component.label,
                                            "alertPreFix": this.props.intl.formatMessage({ id: "IDS_VALID" }),
                                            "validateFunction": validateEmail,
                                            "mandatoryLabel": "IDS_ENTER",
                                            "controlType": "textbox"
                                        }) : "" : ""
                    })
                })
            })

        return mandatoryFields;
    }

    addMasterRecord = (control) => {
        let masterIndex = this.props.Login.masterIndex
        if (masterIndex !== undefined) {
            masterIndex = masterIndex + 1;
        } else {
            masterIndex = 0
        }
        let selectedControl = this.props.Login.selectedControl || []
        let selectedMaster = this.state.selectedMaster || []
        selectedMaster[masterIndex] = {}
        selectedControl[masterIndex] = control

        let fieldList = this.props.Login.masterfieldList || []
        fieldList[masterIndex] = []

        let masterComboColumnFiled = this.props.Login.masterComboColumnFiled || []
        masterComboColumnFiled[masterIndex] = []

        let extractedColumnList = this.props.Login.masterextractedColumnList || []
        extractedColumnList[masterIndex] = []

        let masterdataList = this.props.Login.masterdataList || []
        let masterDesign = this.props.Login.masterDesign || []
        let masterwithoutCombocomponent = this.props.Login.masterwithoutCombocomponent || []
        let mastercomboComponents = this.props.Login.mastercomboComponents || []
        let masterOperation = this.props.Login.masterOperation || []

        masterdataList[masterIndex] = []
        masterDesign[masterIndex] = []
        masterwithoutCombocomponent[masterIndex] = []
        mastercomboComponents[masterIndex] = []
        masterOperation[masterIndex] = 'create'

        if (control.table.item.component === 'Type2Component' || control.table.item.component === 'Type1Component') {
            if (control.table.item.component === 'Type2Component') {
                fieldList[masterIndex] = getFieldSpecification().get(control.table.item.methodUrl) || [];
            } else {
                fieldList[masterIndex] = getFieldSpecification1().get(control.table.item.methodUrl) || [];
            }


            extractedColumnList[masterIndex] = extractFieldHeader(Object.values(fieldList[masterIndex]));

            const primaryKeyField = Object.keys(fieldList[masterIndex]).length > 0 ? fieldList[masterIndex][0].dataField : "";

            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    selectedControl,
                    addMaster: true,
                    masterfieldList: fieldList,
                    masterextractedColumnList: extractedColumnList,
                    masterprimaryKeyField: primaryKeyField,
                    masterComboColumnFiled: masterComboColumnFiled,
                    masterIndex,
                    masterdataList,
                    masterDesign,
                    masterwithoutCombocomponent,
                    mastercomboComponents,
                    masterOperation,
                    selectedMaster,
                    //   screenName:selectedControl[masterIndex].displayname[this.props.Login.userInfo.slanguagetypecode]
                }
            }
            this.props.updateStore(updateInfo)
        }
        else if (control.table.item.component === 'Type3Component') {
            fieldList[masterIndex] = getFieldSpecification3().get(control.table.item.methodUrl) || [];
            extractedColumnList[masterIndex] = extractFieldHeader(Object.values(fieldList[masterIndex]));
            masterComboColumnFiled[masterIndex] = extractedColumnList[masterIndex].filter(item =>
                item.ndesigncomponentcode === designComponents.COMBOBOX)
            const primaryKeyField = Object.keys(fieldList[masterIndex]).length > 0 ? fieldList[masterIndex][0].dataField : "";
            const inputParam = {
                userinfo: this.props.Login.userInfo,
                selectedControl,
                masterfieldList: fieldList,
                masterextractedColumnList: extractedColumnList,
                masterprimaryKeyField: primaryKeyField,
                masterComboColumnFiled: masterComboColumnFiled,
                masterIndex,
                masterdataList,
                masterDesign,
                masterwithoutCombocomponent,
                mastercomboComponents,
                masterOperation,
                selectedMaster,
                screenName: selectedControl[masterIndex].displayname[this.props.Login.userInfo.slanguagetypecode]
            }

            this.props.getAddMasterCombo(inputParam);

        }
        else if (control.table.item.component === 'Dynamic') {
            const inputParam = {
                userinfo: this.props.Login.userInfo,
                selectedControl,
                masterIndex,
                masterdataList,
                masterDesign,
                masterComboColumnFiled,
                masterwithoutCombocomponent,
                mastercomboComponents,
                masterfieldList: fieldList,
                masterextractedColumnList: extractedColumnList,               
                masterOperation,
                selectedMaster
            }
            this.props.getDynamicMasterTempalte(inputParam);
        }

        // this.props.getMasterRecord(control);
    }


    editMasterRecord = (control, editObject) => {
        if (editObject) {
            let masterIndex = this.props.Login.masterIndex
            if (masterIndex !== undefined) {
                masterIndex = masterIndex + 1;
            } else {
                masterIndex = 0
            }
            let selectedControl = this.props.Login.selectedControl || []
            let selectedMaster = this.state.selectedMaster || []
            selectedMaster[masterIndex] = {}
            selectedControl[masterIndex] = control

            let fieldList = this.props.Login.masterfieldList || []
            fieldList[masterIndex] = []

            let masterComboColumnFiled = this.props.Login.masterComboColumnFiled || []
            masterComboColumnFiled[masterIndex] = []

            let extractedColumnList = this.props.Login.masterextractedColumnList || []
            extractedColumnList[masterIndex] = []

            let masterdataList = this.props.Login.masterdataList || []
            let masterDesign = this.props.Login.masterDesign || []
            let masterwithoutCombocomponent = this.props.Login.masterwithoutCombocomponent || []
            let mastercomboComponents = this.props.Login.mastercomboComponents || []
            let masterOperation = this.props.Login.masterOperation || []
            let masterEditObject = this.props.Login.masterEditObject || []

            masterdataList[masterIndex] = []
            masterDesign[masterIndex] = []
            masterwithoutCombocomponent[masterIndex] = []
            mastercomboComponents[masterIndex] = []
            masterOperation[masterIndex] = 'update'
            masterEditObject[masterIndex] = editObject

            if (control.table.item.component === 'Type2Component' || control.table.item.component === 'Type1Component') {
                if (control.table.item.component === 'Type2Component') {
                    fieldList[masterIndex] = getFieldSpecification().get(control.table.item.methodUrl) || [];
                } else {
                    fieldList[masterIndex] = getFieldSpecification1().get(control.table.item.methodUrl) || [];
                }
                extractedColumnList[masterIndex] = extractFieldHeader(Object.values(fieldList[masterIndex]));

                const primaryKeyField = Object.keys(fieldList[masterIndex]).length > 0 ? fieldList[masterIndex][0].dataField : "";

                const updateInfo = {
                    userinfo: this.props.Login.userInfo,
                    selectedControl,
                    addMaster: true,
                    masterfieldList: fieldList,
                    masterextractedColumnList: extractedColumnList,
                    masterprimaryKeyField: primaryKeyField,
                    masterComboColumnFiled: masterComboColumnFiled,
                    masterIndex,
                    masterdataList,
                    masterDesign,
                    masterwithoutCombocomponent,
                    mastercomboComponents,
                    selectedMaster,
                    masterEditObject,
                    masterOperation
                    // editObject
                    //   screenName:selectedControl[masterIndex].displayname[this.props.Login.userInfo.slanguagetypecode]

                }
                this.props.getEditMaster(updateInfo)
            }
            else if (control.table.item.component === 'Type3Component') {
                fieldList[masterIndex] = getFieldSpecification3().get(control.table.item.methodUrl) || [];
                extractedColumnList[masterIndex] = extractFieldHeader(Object.values(fieldList[masterIndex]));
                masterComboColumnFiled[masterIndex] = extractedColumnList[masterIndex].filter(item =>
                    item.ndesigncomponentcode === designComponents.COMBOBOX)
                const primaryKeyField = Object.keys(fieldList[masterIndex]).length > 0 ? fieldList[masterIndex][0].dataField : "";
                const inputParam = {
                    userinfo: this.props.Login.userInfo,
                    selectedControl,
                    masterfieldList: fieldList,
                    masterextractedColumnList: extractedColumnList,
                    masterprimaryKeyField: primaryKeyField,
                    masterComboColumnFiled: masterComboColumnFiled,
                    masterIndex,
                    masterdataList,
                    masterDesign,
                    masterwithoutCombocomponent,
                    mastercomboComponents,
                    masterEditObject,
                    masterOperation,
                    selectedMaster,
                    screenName: selectedControl[masterIndex].displayname[this.props.Login.userInfo.slanguagetypecode],
                    // editObject
                }

                this.props.getEditMaster(inputParam);

            }
            else if (control.table.item.component === 'Dynamic') {
                const inputParam = {
                    userinfo: this.props.Login.userInfo,
                    selectedControl,
                    masterIndex,
                    masterdataList,
                    masterDesign,
                    masterComboColumnFiled,
                    masterwithoutCombocomponent,
                    mastercomboComponents,
                    masterfieldList: fieldList,
                    masterextractedColumnList: extractedColumnList,
                    masterComboColumnFiled,
                    masterEditObject,
                    masterOperation,
                    selectedMaster,
                    //  editObject
                }
                this.props.getEditMaster(inputParam);
            }

        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTTHERECORD" }))
        }

    }

    onExecuteClick = () => {
        const selectedRecord = this.state.selectedRecord || {}
        const userInfo = this.props.Login.userInfo
        const sampleRegistration = {}
        sampleRegistration["jsondata"] = {}
        const dateList = []
        const defaulttimezone = this.props.Login.defaultTimeZone

        this.props.Login.masterData.selectedTemplate &&
            this.props.Login.masterData.selectedTemplate.jsondata.map(row => {
                return row.children.map(column => {
                    return column.children.map(component => {
                        if (component.hasOwnProperty("children")) {
                            return component.children.map(componentrow => {

                                if (componentrow.inputtype === "date") {
                                    if (componentrow.mandatory) {
                                        sampleRegistration["jsondata"][componentrow.label] = typeof selectedRecord[componentrow.label] === "object" ?
                                            convertDateTimetoStringDBFormat(selectedRecord[componentrow.label] ?
                                                selectedRecord[componentrow.label] : new Date(), userInfo) : selectedRecord[componentrow.label] ?
                                                selectedRecord[componentrow.label] : "";
                                    } else {
                                        sampleRegistration["jsondata"][componentrow.label] = componentrow.loadcurrentdate ?
                                            typeof selectedRecord[componentrow.label] === "object" ? convertDateTimetoStringDBFormat(selectedRecord[componentrow.label] ?
                                                selectedRecord[componentrow.label] : new Date(), userInfo) : selectedRecord[componentrow.label] ?
                                                selectedRecord[componentrow.label] : "" :
                                            selectedRecord[componentrow.label] ? typeof selectedRecord[componentrow.label] === "object" ? convertDateTimetoStringDBFormat(selectedRecord[componentrow.label] ?
                                                selectedRecord[componentrow.label] : new Date(), userInfo) : selectedRecord[componentrow.label] ?
                                                selectedRecord[componentrow.label] : "" : "";

                                    }
                                    if (componentrow.timezone) {
                                        sampleRegistration["jsondata"][`tz${componentrow.label}`] = selectedRecord[`tz${componentrow.label}`] ?
                                            { value: selectedRecord[`tz${componentrow.label}`].value, label: selectedRecord[`tz${componentrow.label}`].label } :
                                            defaulttimezone ? defaulttimezone : -1
                                    }
                                    dateList.push(componentrow.label)
                                }
                                return sampleRegistration;
                            })
                           // return sampleRegistration;
                        }
                        else {

                            if (component.inputtype === "date") {
                                if (component.mandatory) {
                                    sampleRegistration["jsondata"][component.label] = typeof selectedRecord[component.label] === "object" ?
                                        convertDateTimetoStringDBFormat(selectedRecord[component.label] ?
                                            selectedRecord[component.label] : new Date(), userInfo) :
                                        selectedRecord[component.label] ?
                                            selectedRecord[component.label] : "";
                                } else {
                                    sampleRegistration["jsondata"][component.label] = component.loadcurrentdate ?
                                        typeof selectedRecord[component.label] === "object" ? convertDateTimetoStringDBFormat(selectedRecord[component.label] ?
                                            selectedRecord[component.label] : new Date(), userInfo) : selectedRecord[component.label] ?
                                            selectedRecord[component.label] : "" :
                                        selectedRecord[component.label] ? typeof selectedRecord[component.label] === "object" ? convertDateTimetoStringDBFormat(selectedRecord[component.label] ?
                                            selectedRecord[component.label] : new Date(), userInfo) : selectedRecord[component.label] ?
                                            selectedRecord[component.label] : "" : "";
                                }
                                if (component.timezone) {
                                    sampleRegistration["jsondata"][`tz${component.label}`] = selectedRecord[`tz${component.label}`] ?
                                        { value: selectedRecord[`tz${component.label}`].value, label: selectedRecord[`tz${component.label}`].label } :
                                        defaulttimezone ? defaulttimezone : -1
                                }
                                dateList.push(component.label)
                            }
                            return sampleRegistration;
                        }
                    }
                    )
                })
            })

        const { dateconstraints, combinationunique } = this.getJsondata(this.props.Login.masterData.selectedTemplate.jsondata)

        const inputParam = {
            Registration: sampleRegistration,
            DateList: dateList,
            dateconstraints: dateconstraints,
            userinfo: userInfo,
            combinationunique: combinationunique,
        }

        this.props.validatePreview(inputParam);

    }


    getJsondata = (templatedata) => {

        let dateconstraints = [];
        let combinationunique = []
        templatedata && templatedata.map(row =>
            row.children && row.children.map(column => {
                column.children && column.children.map(component => {
                    if (component.hasOwnProperty('children')) {
                        component.children.map(componentRow => {
                            // componentRow.unique && sampleuniquevalidation.push({ [designProperties.LABEL]: componentRow.label });
                            componentRow.unique && combinationunique.push({ [componentRow.label]: { [designProperties.LABEL]: componentRow.displayname, [designProperties.VALUE]: componentRow.label } })
                            if (componentRow.inputtype === 'date') {
                                // sampledatefields.push({ [designProperties.VALUE]: componentRow.label, dateonly: componentRow.dateonly || false });
                                dateconstraints = componentRow.dateConstraintArraySQL ? [...componentRow.dateConstraintArraySQL, ...dateconstraints] : dateconstraints;
                            }
                            return null;
                        })
                    } else {
                        component.unique && combinationunique.push({ [component.label]: { [designProperties.LABEL]: component.displayname, [designProperties.VALUE]: component.label } })
                        if (component.inputtype === 'date') {
                            dateconstraints = component.dateConstraintArraySQL ? [...component.dateConstraintArraySQL, ...dateconstraints] : dateconstraints;
                        }
                        return null;
                    }
                })
            }
            )
        )
        let jsondata = {
            combinationunique,
            dateconstraints,
        }
        return jsondata;
    }

    componentDidUpdate(previousProps) {
        let updateState = false;
        let { userRoleControlRights, controlMap, addTemplateId,
            sampleTypeOptions, breadCrumbData, selectedSampleType,
            editId, deleteId, approveID, copyID, selectedRecord, comboComponents,
            previewId, withoutCombocomponent, selectedMaster,
            selectedDefaultTemplate, defaultTemplateOptions,
            awesomeConfig, awesomeTree, kendoFilter, kendoSkip, kendoTake, defaultSampleType, selectedSampleTypeList,importTemplateID,exportTemplateID
        } = this.state;
        if (this.props.Login.userInfo.nformcode !== previousProps.Login.userInfo.nformcode) {
            userRoleControlRights = [];
            if (this.props.Login.userRoleControlRights) {
                this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode] && Object.values(this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode]).map(item =>
                    userRoleControlRights.push(item.ncontrolcode))
            }
            controlMap = getControlMap(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode)
            updateState = true;
            addTemplateId = controlMap.has("AddTemplate") && controlMap.get("AddTemplate").ncontrolcode;
            editId = controlMap.has("EditTemplate") && controlMap.get("EditTemplate").ncontrolcode;
            deleteId = controlMap.has("DeleteTemplate") && controlMap.get("DeleteTemplate").ncontrolcode;
            approveID = controlMap.has("ApproveTemplate") && controlMap.get("ApproveTemplate").ncontrolcode;
            copyID = controlMap.has("CopyTemplate") && controlMap.get("CopyTemplate").ncontrolcode;
            previewId = controlMap.has("PreviewTemplate") && controlMap.get("PreviewTemplate").ncontrolcode;
            importTemplateID = controlMap.has("ImportTemplate") && controlMap.get("ImportTemplate").ncontrolcode;
            exportTemplateID = controlMap.has("ExportTemplate") && controlMap.get("ExportTemplate").ncontrolcode;
        }
        if (this.props.Login.masterData.SampleTypes !== previousProps.Login.masterData.SampleTypes) {
            sampleTypeOptions = constructOptionList(this.props.Login.masterData.SampleTypes || [], 'nsampletypecode', 'ssampletypename', 'nsorter', "ascending").get("OptionList")
            selectedSampleType = sampleTypeOptions.length > 0 ? sampleTypeOptions[0] : {};
            defaultTemplateOptions = constructOptionList(this.props.Login.masterData.DefaultTemplateList || [], 'ndefaulttemplatecode', 'sdefaulttemplatename', 'ndefaulttemplatecode', "ascending").get("OptionList")
            // selectedDefaultTemplate = defaultTemplateOptions.length > 0 ? defaultTemplateOptions[0] : {};

            selectedDefaultTemplate = this.props.Login.masterData.selectedDefaultTemplate
                ? {
                    "label": this.props.Login.masterData.selectedDefaultTemplate.sdefaulttemplatename,
                    "value": this.props.Login.masterData.selectedDefaultTemplate.ndefaulttemplatecode,
                    "item": this.props.Login.masterData.selectedDefaultTemplate
                }
                : defaultTemplateOptions.length > 0 ? defaultTemplateOptions[0] : {}
            breadCrumbData = sampleTypeOptions.length > 0 ? [
                {
                    "label": "IDS_SAMPLETYPE",
                    "value": sampleTypeOptions[0].label,
                    "item": sampleTypeOptions[0]
                },
                {
                    "label": "IDS_TEMPLATETYPE",
                    "value": selectedDefaultTemplate.label,
                    "item": selectedDefaultTemplate
                }
            ] : [];

            // breadCrumbData = sampleTypeOptions.length > 0 ? [
            //     {
            //         "label": "IDS_SAMPLETYPE",
            //         "value": sampleTypeOptions[0].label,
            //         "item": sampleTypeOptions[0]
            //     }
            // ] : [];
            updateState = true;
        }
        if (this.props.Login.masterData.selectedSampleTypeList !== previousProps.Login.masterData.selectedSampleTypeList) {
            defaultTemplateOptions = constructOptionList(this.props.Login.masterData.DefaultTemplateList || [], 'ndefaulttemplatecode', 'sdefaulttemplatename', 'ndefaulttemplatecode', "ascending").get("OptionList")
            // selectedDefaultTemplate = defaultTemplateOptions.length > 0 ? defaultTemplateOptions[0] : {};

            selectedDefaultTemplate = this.props.Login.masterData.selectedDefaultTemplate
                ? {
                    "label": this.props.Login.masterData.selectedDefaultTemplate.sdefaulttemplatename,
                    "value": this.props.Login.masterData.selectedDefaultTemplate.ndefaulttemplatecode,
                    "item": this.props.Login.masterData.selectedDefaultTemplate
                }
                : defaultTemplateOptions.length > 0 ? defaultTemplateOptions[0] : {}
            selectedSampleType = this.props.Login.masterData.selectedSampleType && {
                "label": this.props.Login.masterData.selectedSampleType.ssampletypename,
                "value": this.props.Login.masterData.selectedSampleType.nsampletypecode,
                "item": this.props.Login.masterData.selectedSampleType
            };
            defaultSampleType = constructOptionList(this.props.Login.masterData.DefaultSampleTypeList || [], 'nsampletypecode', 'ssampletypename', 'nsampletypecode', "ascending").get("OptionList")

            selectedSampleTypeList = this.props.Login.masterData.selectedSampleTypeList
                ? {
                    "label": this.props.Login.masterData.selectedSampleTypeList.ssampletypename,
                    "value": this.props.Login.masterData.selectedSampleTypeList.nsampletypecode,
                    "item": this.props.Login.masterData.selectedSampleTypeList
                } : [];
            updateState = true;
        }
        if (this.props.Login.masterData.selectedSampleType !== previousProps.Login.masterData.selectedSampleType) {

            defaultTemplateOptions = constructOptionList(this.props.Login.masterData.DefaultTemplateList || [], 'ndefaulttemplatecode', 'sdefaulttemplatename', 'ndefaulttemplatecode', "ascending").get("OptionList")
            // selectedDefaultTemplate = defaultTemplateOptions.length > 0 ? defaultTemplateOptions[0] : {};

            selectedDefaultTemplate = this.props.Login.masterData.selectedDefaultTemplate
                ? {
                    "label": this.props.Login.masterData.selectedDefaultTemplate.sdefaulttemplatename,
                    "value": this.props.Login.masterData.selectedDefaultTemplate.ndefaulttemplatecode,
                    "item": this.props.Login.masterData.selectedDefaultTemplate
                }
                : defaultTemplateOptions.length > 0 ? defaultTemplateOptions[0] : {}
            selectedSampleType = this.props.Login.masterData.selectedSampleType && {
                "label": this.props.Login.masterData.selectedSampleType.ssampletypename,
                "value": this.props.Login.masterData.selectedSampleType.nsampletypecode,
                "item": this.props.Login.masterData.selectedSampleType
            };
            defaultSampleType = constructOptionList(this.props.Login.masterData.DefaultSampleTypeList || [], 'nsampletypecode', 'ssampletypename', 'nsampletypecode', "ascending").get("OptionList")

            selectedSampleTypeList = this.props.Login.masterData.selectedSampleTypeList
                ? {
                    "label": this.props.Login.masterData.selectedSampleTypeList.ssampletypename,
                    "value": this.props.Login.masterData.selectedSampleTypeList.nsampletypecode,
                    "item": this.props.Login.masterData.selectedSampleTypeList
                } : [];
            //{
            //     "label": this.state.selectedSampleType.label,
            //     "value": this.state.selectedSampleType.value,
            //     "item": this.state.selectedSampleType
            // }
            // breadCrumbData = sampleTypeOptions.length > 0 ? [
            //     {
            //         "label": "IDS_SAMPLETYPE",
            //         "value": sampleTypeOptions[0].label,
            //         "item": sampleTypeOptions[0]
            //     }
            // ] : [];
            updateState = true;
        }
        if (this.props.Login.masterData.selectedDefaultTemplate !== previousProps.Login.masterData.selectedDefaultTemplate) {
            updateState = true;
        }
        if (this.props.Login.realSampleType !== previousProps.Login.realSampleType) {
            updateState = true;
            breadCrumbData = this.props.Login.realSampleType || this.state.breadCrumbData;
        }
        if (this.props.Login.realDefaultTemplate !== previousProps.Login.realDefaultTemplate) {
            updateState = true;
            breadCrumbData = this.props.Login.realDefaultTemplate || this.state.breadCrumbData;
        }
        if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord) {
            updateState = true;
            selectedRecord = this.props.Login.selectedRecord
        }
        if (this.props.Login.selectedMaster !== previousProps.Login.selectedMaster) {
            updateState = true;
            selectedMaster = this.props.Login.selectedMaster
        }

        if (this.props.Login.comboComponents !== previousProps.Login.comboComponents) {
            updateState = true;
            comboComponents = this.props.Login.comboComponents
        }
        if (this.props.Login.withoutCombocomponent !== previousProps.Login.withoutCombocomponent) {
            updateState = true;
            withoutCombocomponent = this.props.Login.withoutCombocomponent
        }

        // if (this.props.Login.kendoTake !== previousProps.Login.kendoTake) {
        //     updateState = true;
        //     kendoTake = this.props.Login.kendoTake
        // }
        if (this.state.export) {
            this._excelExport.save()
            this.setState({ export: false })
        }


        if (updateState) {
            // console.log("selectedSampleType:", this.state.selectedSampleType,this.props.Login.masterData.selectedSampleType);
            this.setState({
                userRoleControlRights, controlMap, addTemplateId, sampleTypeOptions,
                breadCrumbData, selectedSampleType, defaultTemplateOptions, selectedDefaultTemplate,
                editId, deleteId, approveID, copyID, selectedRecord,
                comboComponents, previewId, withoutCombocomponent, selectedMaster, defaultSampleType, selectedSampleTypeList,
                importTemplateID,exportTemplateID

            });
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

    openFilter = () => {
        let showFilter = !this.props.Login.showFilter
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { showFilter }
        }
        this.props.updateStore(updateInfo);
    }

    filterComboChange = (comboData, Name) => {
        // this.setState({ selectedSampleType: comboData })
        let selectedRecord = [];
        selectedRecord[Name] = comboData;
        if (comboData && comboData.value === SampleType.SUBSAMPLE) {
            this.props.getDefaultTemplate(comboData, selectedRecord, this.props.Login.userInfo, this.props.Login.masterData);
        } else {
            this.props.getDefaultTemplate(comboData, selectedRecord, this.props.Login.userInfo, this.props.Login.masterData);
        }
    }
    // filterSubSampleComboChange = (comboData) => {
    //     // this.setState({ selectedSampleType: comboData })
    //     this.props.getDefaultSampleType(comboData, this.props.Login.userInfo, this.props.Login.masterData, undefined );

    // }

    templateComboChange = (comboData) => {
        // const updateInfo = {
        //     typeName: DEFAULT_RETURN,
        //     data: { selectedTemplate :  comboData, 
        //             selectedDefaultTemplate: { "label": comboData.sdefaulttemplatename,
        //                                         "value": comboData.ndefaulttemplatecode,
        //                                         "item": comboData
        //                                         }
        //         }
        // }
        // this.props.updateStore(updateInfo);
        this.setState({
            selectedDefaultTemplate: comboData
            //  { "label": comboData.sdefaulttemplatename,
            //     "value": comboData.ndefaulttemplatecode,
            //     "item": comboData
            //     }
        })
    }

    closeFilter = () => {
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { showFilter: false }
        }
        this.props.updateStore(updateInfo);
    }

    onFilterSubmit = () => {
        // this.reloadData()
        this.searchRef.current.value = "";
        if (this.state.selectedSampleType) {
            this.props.getRegistrationTemplate(this.state.selectedSampleType, this.state.selectedDefaultTemplate,
                this.props.Login.masterData, this.props.Login.userInfo, this.state.selectedSampleTypeList);
        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SAMPLETYPENOTAVALIABLE" }));
        }
    }


    removeIndex = (data, removeIndex) => {
        const data1 = [...data.splice(0, removeIndex), ...data.splice(removeIndex + 1)]
        return data1
    }

    closeModal = () => {
        let updateInfo = {}
        if (this.props.Login.addMaster) {

            let masterIndex = this.props.Login.masterIndex;
            if (masterIndex !== 0) {
                const screenName = this.props.Login.selectedControl[masterIndex - 1].displayname[this.props.Login.userInfo.slanguagetypecode]
                const selectedMaster = this.removeIndex(this.props.Login.selectedMaster, masterIndex)
                const selectedControl = this.removeIndex(this.props.Login.selectedControl, masterIndex)
                const masterextractedColumnList = this.props.Login.masterextractedColumnList && this.removeIndex(this.props.Login.masterextractedColumnList, masterIndex)
                const masterfieldList = this.props.Login.masterfieldList && this.removeIndex(this.props.Login.masterfieldList, masterIndex)
                const masterdataList = this.props.Login.masterdataList && this.removeIndex(this.props.Login.masterdataList, masterIndex)
                const mastercomboComponents = this.props.Login.mastercomboComponents && this.removeIndex(this.props.Login.mastercomboComponents, masterIndex)
                const masterComboColumnFiled = this.props.Login.masterComboColumnFiled && this.removeIndex(this.props.Login.masterComboColumnFiled, masterIndex)
                const masterwithoutCombocomponent = this.props.Login.masterwithoutCombocomponent && this.removeIndex(this.props.Login.masterwithoutCombocomponent, masterIndex)
                const masterDesign = this.props.Login.masterDesign && this.removeIndex(this.props.Login.masterDesign, masterIndex)
                const masterOperation = this.props.Login.masterOperation && this.removeIndex(this.props.Login.masterOperation, masterIndex)
                const masterEditObject = this.props.Login.masterEditObject && this.removeIndex(this.props.Login.masterEditObject, masterIndex)
                masterIndex = masterIndex - 1;


                updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        selectedMaster,
                        selectedControl,
                        masterextractedColumnList,
                        masterfieldList,
                        masterdataList,
                        mastercomboComponents,
                        masterwithoutCombocomponent,
                        masterComboColumnFiled,
                        masterDesign,
                        masterIndex,
                        masterOperation,
                        masterEditObject,
                        screenName
                    }

                }

            } else {
                // selectedMaster = []
                // selectedControl = []
                // masterextractedColumnList = []
                // masterfieldList = []
                // addMaster = true
                // masterdataList = []
                // mastercomboComponents = []
                // masterwithoutCombocomponent = []
                // masterComboColumnFiled = []
                // masterDesign = []
                // masterIndex = undefined
                // screenName=this.props.Login.inputParam.displayName

                updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        selectedMaster: [],
                        selectedControl: [],
                        masterextractedColumnList: [],
                        masterfieldList: [],
                        addMaster: false,
                        masterdataList: [],
                        mastercomboComponents: [],
                        masterwithoutCombocomponent: [],
                        masterComboColumnFiled: [],
                        masterDesign: [],
                        masterIndex: undefined,
                        masterOperation: [],
                        masterEditObject: [],

                    }

                }

            }
        }
        else if (this.props.Login.isDynamicViewSlideOut) {
            updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    isDynamicViewSlideOut: false,
                    selectedDynamicViewControl: undefined
                }
                // data: {openModal, loadEsign, selectedRecord}
            }
        }
        else if (!this.props.Login.loadCustomSearchFilter) {
            let loadEsign = this.props.Login.loadEsign;
            let openModal = this.props.Login.openModal;
            let openPortal = this.props.Login.openPortal;
            let selectedRecord = this.props.Login.selectedRecord;
            let showFilter = this.props.Login.showFilter;
            // let design = this.props.Login.design;
            //let selectedFieldRecord =  this.props.Login.selectedFieldRecord;

            if (this.props.Login.loadEsign) {
                if (this.props.Login.operation === "delete") {
                    loadEsign = false;
                    openModal = false;
                    openPortal = false;
                    selectedRecord = {};
                    updateInfo = {
                        typeName: DEFAULT_RETURN,
                        data: {
                            openModal, openPortal, loadEsign,
                            selectedRecord, selectedId: null, showFilter,
                            design: [], selectedFieldRecord: {}, showConfirmAlert: false
                        }
                        // data: {openModal, loadEsign, selectedRecord}
                    }
                }
                else if (this.props.Login.operation === "create" || this.props.Login.operation === "update" || this.props.Login.operation === "approve") {
                    loadEsign = false;
                    openModal = false;
                    selectedRecord['esignpassword'] = "";
                    selectedRecord['esigncomments'] = "";
                    selectedRecord['esignreason'] = "";
                    // openPortal = true;
                    updateInfo = {
                        typeName: DEFAULT_RETURN,
                        data: {
                            openModal, openPortal, loadEsign,
                            selectedRecord, selectedId: null,
                            showFilter, showConfirmAlert: false
                        }
                        // data: {openModal, loadEsign, selectedRecord}
                    }
                }
                else {
                    loadEsign = false;
                    selectedRecord['esignpassword'] = "";
                    selectedRecord['esigncomments'] = "";
                    selectedRecord['esignreason'] = "";
                    updateInfo = {
                        typeName: DEFAULT_RETURN,
                        data: {
                            openModal:openModal, openPortal, loadEsign,
                            selectedRecord, selectedId: null, showFilter,
                            design: [], selectedFieldRecord: {}, showConfirmAlert: false
                        }
                        // data: {openModal, loadEsign, selectedRecord}
                    }
                }
            }
            else {
                openModal = false;
                openPortal = false;
                selectedRecord = {};
                showFilter = false
                updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        openModal, openPortal, loadEsign,
                        selectedRecord, selectedId: null, showFilter,
                        design: [], selectedFieldRecord: {}, showConfirmAlert: false
                    }
                    // data: {openModal, loadEsign, selectedRecord}
                }
            }

        } else {
            updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadCustomSearchFilter: false, kendoSkip: 0,
                    kendoTake: 5,
                    kendoFilter: {
                        logic: "and",
                        filters: []
                    },
                    awesomeTree: undefined,
                    awesomeConfig: undefined
                }
                // data: {openModal, loadEsign, selectedRecord}
            }
        }

        this.props.updateStore(updateInfo);

    }

    openModal = (ncontrolcode,operation) => {
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                selectedRecord: {}, operation:operation, ncontrolcode, selectedId: null,
                openModal: true, screenName: this.props.Login.inputParam.displayName
            }
        }
        this.props.updateStore(updateInfo);
    }
    onSaveImportClick=(saveType, formRef)=>{
        if(this.state.selectedRecord && this.state.selectedRecord['stemplatefilename']){
        let inputParam = {};
        let selectedRecord = this.state.selectedRecord;
        let isFileupload =true;
        const formData = new FormData();
        formData.append("ImportFile", selectedRecord['stemplatefilename'][0])
        formData.append( "nsampletypecode", this.props.Login.masterData.selectedTemplate && this.props.Login.masterData.selectedTemplate.nsampletypecode||-1);
        formData.append( "ndefaulttemplatecode", this.props.Login.masterData.selectedTemplate && this.props.Login.masterData.selectedTemplate.ndefaulttemplatecode||-1);
        formData.append( "nreactregtemplatecode", this.props.Login.masterData.selectedTemplate && this.props.Login.masterData.selectedTemplate.nreactregtemplatecode||-1);
        formData.append( "sampleTypeCode",Lims_JSON_stringify(this.props.intl.formatMessage({ id: "IDS_SAMPLETYPECODE" }),false)  );
        formData.append( "defaultTemplateTypeCode",Lims_JSON_stringify(this.props.intl.formatMessage({ id: "IDS_DEFAULTTEMPLATECODE" })  ,false));
        formData.append( "sampleTypeName",Lims_JSON_stringify(this.props.intl.formatMessage({ id: "IDS_SAMPLETYPENAME" }),false));
        formData.append( "templateTypeName",Lims_JSON_stringify(this.props.intl.formatMessage({ id: "IDS_TEMPLATETYPE" }) ,false));
        formData.append( "jsondata",Lims_JSON_stringify(this.props.intl.formatMessage({ id: "IDS_JSONDATA" })) );
        formData.append( "selectedSampletype",Lims_JSON_stringify(this.props.Login.masterData.selectedSampleType.ssampletypename ,false));
        formData.append( "selecteddefaulttemplate",Lims_JSON_stringify(this.props.Login.masterData.selectedDefaultTemplate.sdefaulttemplatename,false));

        inputParam = {
            formData: formData,
            isFileupload,
            methodUrl:"ImportTemplate",
            operation: "create",
            classUrl: "dynamicpreregdesign",
            inputData:{"userinfo":this.props.Login.userInfo}
            
        }
        var saveType = this.statesaveType;
        const masterData = this.props.Login.masterData;
     
        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolcode)) {

            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, dynamicfields: [], screenData: {  masterData }, saveType
                }
            }
            this.props.updateStore(updateInfo);
        } else {
            this.props.crudMaster(inputParam,masterData, "openModal");

        }
    }else{
        toast.warn(this.props.intl.formatMessage({ id: "IDS_PLEASESELECTTHEFILE" }))
    }
    }

    onSaveClick = (saveType, formRef) => {
        let inputData = [];
        let dataState = undefined;
        inputData["userinfo"] = this.props.Login.userInfo;
        let selectedId = null;
        if(this.props.Login.operation==='copy'){
        inputData['registrationtemplate'] =
        {
            nreactregtemplatecode: this.props.Login.masterData.selectedTemplate.nreactregtemplatecode,
            sregtemplatename: this.state.selectedRecord['sregtemplatename'],
            nsampletypecode: this.props.Login.masterData.selectedTemplate.nsampletypecode,
            ndefaulttemplatecode: this.props.Login.masterData.selectedTemplate.ndefaulttemplatecode,
            nsubsampletypecode: this.props.Login.masterData.selectedTemplate.nsubsampletypecode
        }

        const inputParam = {
            methodUrl: "RegistrationTemplate",
            classUrl: 'dynamicpreregdesign',
            searchRef: this.searchRef,
            displayName: this.props.Login.inputParam.displayName,
            inputData: inputData, operation: this.props.Login.operation,
            saveType, formRef, selectedId, dataState,
            selectedRecord:{...this.state.selectedRecord}
        }
        const esignNeeded = showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolcode);
        if (esignNeeded) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData: this.props.Login.masterData },
                    openModal: true, screenName: this.props.Login.inputParam.displayName,
                    operation: this.props.Login.operation
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.crudMaster(inputParam, this.props.Login.masterData, "openModal");
        }
    }else{
        this.deleteApproveTemplate("approve", this.state.approveID);
    }
    }

    ConfirmDelete = (deleteId) => {
        this.confirmMessage.confirm("deleteMessage", this.props.intl.formatMessage({ id: "IDS_DELETE" }), this.props.intl.formatMessage({ id: "IDS_DEFAULTCONFIRMMSG" }),
            this.props.intl.formatMessage({ id: "IDS_OK" }), this.props.intl.formatMessage({ id: "IDS_CANCEL" }),
            () => this.deleteApproveTemplate("delete", deleteId));
    }

    deleteApproveTemplate = (operation, ncontrolCode) => {
        const masterData = this.props.Login.masterData;
        const postParam = {
            inputListName: "RegistrationTemplate",
            selectedObject: "selectedTemplate",
            primaryKeyField: "nreactregtemplatecode",
            fetchUrl: "dynamicpreregdesign/getRegistrationTemplateById",
            primaryKeyValue: this.props.Login.masterData.selectedTemplate.nreactregtemplatecode,
            fecthInputObject: {
                userinfo: this.props.Login.userInfo, nsampletypecode: this.state.breadCrumbData[0] ?
                    this.state.breadCrumbData[0].item.value : -1
            },
            masterData: this.props.Login.masterData
        }
        const data = []
        //ALPDJ21-64--Added by Vignesh for import & export issue
        const Layout = this.props.Login.masterData.selectedTemplate.jsondatatemp
        Layout.map(row => {
            row.children.map(column => {
                column.children.map(component => {
                    if (component.hasOwnProperty("children")) {
                        component.children.map(componentrow => {
                            if (this.state.breadCrumbData[0].item.value === -1)
                                componentrow['label'] = componentrow.label + "_child"

                            if(componentrow.inputtype==='date' && componentrow.hasOwnProperty("dateConstraintArraySQL")
                                && componentrow["dateConstraintArraySQL"].length>0){
                                componentrow['dateConstraintArraySQL'][0]['parentdate']=componentrow.label ;
                               }

                            data.push(componentrow.label)

                        })
                    } else {
                        if (this.state.breadCrumbData[0].item.value === -1) {
                            component['label'] = component.label + "_child"
                            if(component.inputtype==='date' && component.hasOwnProperty("dateConstraintArraySQL")
                                && component["dateConstraintArraySQL"].length>0){
                             component['dateConstraintArraySQL'][0]['parentdate']=component.label ;
                            }
                            data.push(component.label)
                        } else {
                            data.push(component.label)
                        }
                    }
                })
            })
        })


        const inputParam = {
            methodUrl: "RegistrationTemplate",
            classUrl: 'dynamicpreregdesign',
            postParam,
            searchRef: this.searchRef,
            inputData: {
                registrationtemplate: {
                    sregtemplatename: this.props.Login.masterData.selectedTemplate.sregtemplatename,
                    nreactregtemplatecode: this.props.Login.masterData.selectedTemplate.nreactregtemplatecode,
                    jsonString: JSON.stringify(Layout),
                    stemplatetypesname:this.state.selectedRecord.stemplatetypesname,

                },
                userinfo: this.props.Login.userInfo,
                dynamicFields: data,
                nsampletypecode: this.state.breadCrumbData[0].item.value

            },
            operation,
            selectedRecord:{...this.state.selectedRecord}
        }
        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, ncontrolCode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true,
                    screenData: { inputParam, masterData },
                    openModal: true,
                    operation: operation
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.crudMaster(inputParam, masterData, "openModal");
        }
    }

    reloadData = () => {
        this.searchRef.current.value = "";
        if (this.state.selectedSampleType) {
            this.props.getRegistrationTemplate(this.state.breadCrumbData[0] && this.state.breadCrumbData[0].item, this.state.breadCrumbData[1] && this.state.breadCrumbData[1].label === "IDS_TEMPLATETYPE" ? this.state.breadCrumbData[1] && this.state.breadCrumbData[1].item : this.state.breadCrumbData[2] && this.state.breadCrumbData[2].item,
                this.props.Login.masterData, this.props.Login.userInfo, this.state.breadCrumbData[1] && this.state.breadCrumbData[1].label === "IDS_SUBSAMPLEBASEDSAMPLETYPE" ? this.state.breadCrumbData[1] && this.state.breadCrumbData[1].item : []);
        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SAMPLETYPENOTAVALIABLE" }));
        }
    }

    getPreviewTemplate = (masterData, userInfo, editId) => {
        let data = [];
        const withoutCombocomponent = []
        const Layout = this.props.Login.masterData.selectedTemplate.jsondata
        Layout.map(row => {
            row.children.map(column => {
                column.children.map(component => {
                    return component.hasOwnProperty("children") ? component.children.map(componentrow => {
                        if (componentrow.inputtype === "combo"
                            || componentrow.inputtype === "backendsearchfilter"
                            || componentrow.inputtype === "frontendsearchfilter") {
                            data.push(componentrow)
                        } else {
                            withoutCombocomponent.push(componentrow)
                        }
                    })
                        : component.inputtype === "combo"
                            || component.inputtype === "backendsearchfilter"
                            || component.inputtype === "frontendsearchfilter" ? data.push(component) :
                            withoutCombocomponent.push(component)
                })
            })
        })

        const comboComponents = data
        let childColumnList = {};
        data.map(columnList => {
            const val = this.comboChild(data, columnList, childColumnList, true);
            data = val.data;
            childColumnList = val.childColumnList;
        })
        this.props.getPreviewTemplate(masterData, userInfo, editId, data, this.state.selectedRecord,
            childColumnList, comboComponents, withoutCombocomponent, false, true, new Map(), true)

    }

    comboChild = (data, columnList, childColumnList, slice, customButtonComponent) => {
        let retunObj = {}
        // if (data.findIndex(x => x.label === columnList.label) !== -1) {
        if (!childColumnList.hasOwnProperty(columnList.label)) {
            if (childColumnList[columnList.label] === undefined) {
                if (columnList.hasOwnProperty("child")) {

                    // if (!columnList.inputtype === 'backendsearchfilter' &&
                    //     !columnList.inputtype === 'frontendsearchfilter'
                    // ) {
                    let childList = []
                    columnList.child.map(childData => {
                        const index = data.findIndex(x => x.label === childData.label)
                        if (index !== -1) {
                            childList.push(data[index])
                            if (slice) {
                                data = [...data.slice(0, index), ...data.slice(index + 1)]
                            }
                        }
                    })

                    childColumnList[columnList.label] = childList;
                    if (childList.length > 0) {
                        childList.map(y => {
                            if (y.hasOwnProperty("child")) {
                                const val = this.comboChild(data, y, childColumnList, slice)
                                retunObj["data"] = val.data;
                                retunObj["childColumnList"] = val.childColumnList;
                            } else {
                                retunObj["data"] = data;
                                retunObj["childColumnList"] = childColumnList;
                            }
                        })
                    } else {
                        retunObj["data"] = data;
                        retunObj["childColumnList"] = childColumnList;
                    }
                    // } else {

                    //         columnList.child.map(childData => {
                    //             const index = data.findIndex(x => x.label === childData.label)
                    //             if (index !== -1) {
                    //                 childList.push(data[index])
                    //                 if (slice) {
                    //                     data = [...data.slice(0, index), ...data.slice(index + 1)]
                    //                 }
                    //             }
                    //         })

                    //         childColumnList[columnList.label] = childList;
                    // }
                } else {
                    retunObj["data"] = data;
                    retunObj["childColumnList"] = childColumnList;
                }
            } else {
                retunObj["data"] = data;
                retunObj["childColumnList"] = childColumnList;

            }
        } else {
            retunObj["data"] = data;
            retunObj["childColumnList"] = childColumnList;

        }
        return retunObj;
    }

    onComboChange = (comboData, control, customName) => {

        let comboName = customName || control.label;
        let selectedRecord = this.state.selectedRecord || {};
        //if (comboData) {
        selectedRecord[comboName] = comboData;
        if (comboData) {

            comboData["item"] = {
                ...comboData["item"], "pkey": control.valuemember,
                "nquerybuildertablecode": control.nquerybuildertablecode,
                "source": control.source
            };


            if (control.child && control.child.length > 0) {
                const childComboList = getSameRecordFromTwoArrays(this.state.comboComponents, control.child, "label")
                let childColumnList = {};
                childComboList.map(columnList => {
                    const val = this.comboChild(this.state.comboComponents, columnList, childColumnList, false);
                    childColumnList = val.childColumnList
                })

                const parentList = getSameRecordFromTwoArrays(this.state.withoutCombocomponent, control.child, "label")

                const inputParem = {
                    child: control.child,
                    source: control.source,
                    primarykeyField: control.valuemember,
                    value: comboData.value,
                    item: comboData.item
                }
                this.props.getChildValues(inputParem,
                    this.props.Login.userInfo, selectedRecord, this.props.Login.comboData,
                    childComboList, childColumnList, this.state.withoutCombocomponent, [...childComboList, ...parentList])

            } else {
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: { selectedRecord, loadCustomSearchFilter: false, }
                }
                this.props.updateStore(updateInfo);
            }
        }

        else {
            let comboData = this.props.Login.comboData
            const withoutCombocomponent = this.state.withoutCombocomponent || []
            const inputParam = { control, comboComponents: this.state.comboComponents, withoutCombocomponent, selectedRecord, comboData }
            const childParam = childComboClear(inputParam)
            selectedRecord = childParam.selectedRecord
            comboData = childParam.comboData
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: { selectedRecord, comboData, loadCustomSearchFilter: false, }
            }
            this.props.updateStore(updateInfo);
        }
    }

    onInputOnChange = (event, control, radiotext) => {
        const selectedRecord = this.state.selectedRecord || {};
        if (event.target.type === 'toggle') {
            selectedRecord[event.target.name] = event.target.checked === true ? transactionStatus.YES : transactionStatus.NO;
        } else if (event.target.name === 'stemplatetypesname') {
            if (event.target.value !== "") {
                event.target.value = validateCreateView(event.target.value);
                selectedRecord[event.target.name] = event.target.value !== "" ? event.target.value : selectedRecord[event.target.name];
            } else {
                selectedRecord[event.target.name] = event.target.value;
            }
        }
        else if (event.target.type === 'numeric') {
            if (/\D/.test(event.target.value))
                selectedRecord[event.target.name] = event.target.value;
        } else if (event.target.type === 'checkbox') {
            if (event.target.name === "agree") {
                selectedRecord[event.target.name] = event.target.checked === true ? 3 : 4;
            } else {
                const value = selectedRecord[event.target.name];
                if (value !== '' && value !== undefined) {
                    if (value.includes(radiotext)) {
                        const index = value.indexOf(radiotext);
                        if (index !== -1) {
                            if (index === 0) {
                                const indexcomma = value.indexOf(",")
                                if (indexcomma !== -1) {
                                    selectedRecord[event.target.name] = value.slice(indexcomma + 1)
                                } else {
                                    selectedRecord[event.target.name] = ""
                                }
                            } else {
                                if (value.slice(index).indexOf(",") !== -1) {
                                    selectedRecord[event.target.name] = value.slice(0, index) + value.slice(index + value.slice(index).indexOf(",") + 1)
                                } else {
                                    selectedRecord[event.target.name] = value.slice(0, index - 1)
                                }
                            }
                        }

                    } else {
                        selectedRecord[event.target.name] = value + ',' + radiotext;
                    }

                } else {
                    selectedRecord[event.target.name] = radiotext;
                }
            }
        } else if (event.target.type === 'radio') {
            selectedRecord[event.target.name] = radiotext
        } else {
            selectedRecord[event.target.name] = conditionBasedInput(control, event.target.value, radiotext, event.target.defaultValue)
        }
        this.setState({ selectedRecord });
        // this.saveComponentProperties()
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


    onNumericInputChange = (value, name) => {
        let selectedRecord = this.state.selectedRecord
        selectedRecord[name] = value;
        this.setState({ selectedRecord });
    }

    onNumericBlur = (value, control) => {
        let selectedRecord = this.state.selectedRecord
        if (selectedRecord[control.label]) {
            if (control.max) {
                if (!(selectedRecord[control.label] < parseFloat(control.max))) {
                    selectedRecord[control.label] = control.precision ? parseFloat(control.max) : parseInt(control.max)
                }
            }
            if (control.min) {
                if (!(selectedRecord[control.label] > parseFloat(control.min))) {
                    selectedRecord[control.label] = control.precision ? parseFloat(control.min) : parseInt(control.min)
                }
            }


        }
        this.setState({ selectedRecord });
    }

    handleDateChange = (dateValue, dateName) => {
        const { selectedRecord, withoutCombocomponent } = this.state;
        selectedRecord[dateName] = dateValue;
        if (this.props.Login.masterData.selectedTemplate.nsampletypecode === SampleType.CLINICALTYPE) {
            const age = ageCalculate(dateValue);
            const Age = withoutCombocomponent.filter(x => x.name === 'Age');
            selectedRecord[Age[0].label] = age
        }
        this.setState({ selectedRecord });
    }



    onComboChangeMasterDyanmic = (comboData, control, customName) => {

        let comboName = customName || control.label;
        let selectedMaster = this.state.selectedMaster || [];
        const masterIndex = this.props.Login.masterIndex
        selectedMaster[masterIndex] = selectedMaster[masterIndex] && { ...selectedMaster[masterIndex] } || {}
        //if (comboData) {
        comboData["item"] = {
            ...comboData["item"], "pkey": control.valuemember, "nquerybuildertablecode": control.nquerybuildertablecode,
            "source": control.source
        };
        selectedMaster[masterIndex][comboName] = comboData;

        // console.log("selected:", selectedMaster, comboData, control, customName);
        if (control.child && control.child.length > 0) {
            const childComboList = getSameRecordFromTwoArrays(this.props.Login.mastercomboComponents[masterIndex], control.child, "label")
            let childColumnList = {};
            childComboList.map(columnList => {
                const val = this.comboChild(this.props.Login.mastercomboComponents[masterIndex], columnList, childColumnList, false);
                childColumnList = val.childColumnList
            })

            const parentList = getSameRecordFromTwoArrays(this.props.Login.masterwithoutCombocomponent[masterIndex], control.child, "label")

            if (comboData) {
                const inputParem = {
                    child: control.child,
                    source: control.source,
                    primarykeyField: control.valuemember,
                    value: comboData.value,
                    item: comboData.item
                }
                this.props.getChildValuesForAddMaster(inputParem,
                    this.props.Login.userInfo, selectedMaster, this.props.Login.masterdataList,
                    childComboList, childColumnList,
                    this.props.Login.masterwithoutCombocomponent,
                    [...childComboList, ...parentList], masterIndex)
            } else {
                let comboData = this.props.Login.masterdataList
                const withoutCombocomponent = this.props.Login.masterwithoutCombocomponent || []
                const inputParam = { control, comboComponents: this.props.Login.mastercomboComponents[masterIndex], withoutCombocomponent: withoutCombocomponent[masterIndex], selectedMaster: selectedMaster[masterIndex], comboData: comboData[masterIndex] }
                const childParam = childComboClear(inputParam)
                selectedMaster[masterIndex] = childParam.selectedRecord
                comboData[masterIndex] = childParam.comboData
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: { selectedMaster, mastedataList: comboData }
                }
                this.props.updateStore(updateInfo);
            }
        } else {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: { selectedMaster }
            }
            this.props.updateStore(updateInfo);
        }
    }


    onInputOnChangeMasterDynamic = (event, control, radiotext) => {
        let selectedMaster = this.state.selectedMaster || [];
        const masterIndex = this.props.Login.masterIndex
        selectedMaster[masterIndex] = selectedMaster[masterIndex] && { ...selectedMaster[masterIndex] } || {}

        if (event.target.type === 'toggle') {
            selectedMaster[masterIndex][event.target.name] = event.target.checked === true ? transactionStatus.YES : transactionStatus.NO;
        } else if (event.target.type === 'numeric') {
            if (/\D/.test(event.target.value))
                selectedMaster[masterIndex][event.target.name] = event.target.value;
        } else if (event.target.type === 'checkbox') {
            const value = selectedMaster[masterIndex][event.target.name];
            if (value !== '' && value !== undefined) {
                if (value.includes(radiotext)) {
                    const index = value.indexOf(radiotext);
                    if (index !== -1) {
                        if (index === 0) {
                            const indexcomma = value.indexOf(",")
                            if (indexcomma !== -1) {
                                selectedMaster[masterIndex][event.target.name] = value.slice(indexcomma + 1)
                            } else {
                                selectedMaster[masterIndex][event.target.name] = ""
                            }
                        } else {
                            if (value.slice(index).indexOf(",") !== -1) {
                                selectedMaster[masterIndex][event.target.name] = value.slice(0, index) + value.slice(index + value.slice(index).indexOf(",") + 1)
                            } else {
                                selectedMaster[masterIndex][event.target.name] = value.slice(0, index - 1)
                            }
                        }
                    }

                } else {
                    selectedMaster[masterIndex][event.target.name] = value + ',' + radiotext;
                }

            } else {
                //  selectedMaster[masterIndex][event.target.name] = radiotext;
                selectedMaster[masterIndex][event.target.name] = conditionBasedInput(control, event.target.value, radiotext, event.target.defaultValue);
            }
        } else if (event.target.type === 'radio') {
            selectedMaster[masterIndex][event.target.name] = radiotext
        } else {
            selectedMaster[masterIndex][event.target.name] = event.target.value;
        }
        this.setState({ selectedMaster });
    }


    handleDateChangeMasterDynamic = (dateValue, dateName) => {
        let selectedMaster = this.state.selectedMaster || [];
        const masterIndex = this.props.Login.masterIndex
        selectedMaster[masterIndex] = selectedMaster[masterIndex] && { ...selectedMaster[masterIndex] } || {}

        selectedMaster[masterIndex][dateName] = dateValue;

        this.setState({ selectedMaster });
    }

    onNumericInputChangeMasterDynamic = (value, name) => {
        let selectedMaster = this.state.selectedMaster || [];
        const masterIndex = this.props.Login.masterIndex
        selectedMaster[masterIndex] = selectedMaster[masterIndex] && { ...selectedMaster[masterIndex] } || {}

        selectedMaster[masterIndex][name] = value;
        this.setState({ selectedMaster });
    }

    onNumericBlurMasterDynamic = (value, control) => {
        let selectedMaster = this.state.selectedMaster || [];
        const masterIndex = this.props.Login.masterIndex
        selectedMaster[masterIndex] = selectedMaster[masterIndex] && { ...selectedMaster[masterIndex] } || {}

        if (selectedMaster[masterIndex][control.label]) {
            if (control.max) {
                if (!(selectedMaster[masterIndex][control.label] < parseFloat(control.max))) {
                    selectedMaster[masterIndex][control.label] = control.precision ? parseFloat(control.max) : parseInt(control.max)
                }
            }
            if (control.min) {
                if (!(selectedMaster[masterIndex][control.label] > parseFloat(control.min))) {
                    selectedMaster[masterIndex][control.label] = control.precision ? parseFloat(control.min) : parseInt(control.min)
                }
            }


        }
        this.setState({ selectedMaster });
    }

    onDrop = (value, type, oldVlaue) => {
        const design = this.state.design;
        let columns = design[0].children;
        let designData = this.props.Login.ReactInputFields;
        value = JSON.parse(value.fields);
        value = { ...value, type: "component" }
        let designDataIndex = designData.findIndex(item => item.label === value.label);
        let firstIndex = columns[0] ? columns[0].children.findIndex(item => item.label === value.label) : -1;
        let secondIndex = columns[1] ? columns[1].children.findIndex(item => item.label === value.label) : -1;

        if (designDataIndex >= 0)
            designData.splice(designDataIndex, 1);
        if (firstIndex >= 0) {
            if (type !== 1) {
                columns[0].children.splice(firstIndex, 1);
                // columns[0].splice(to, 0, columns[0].splice(from, 1)[0]);
            } else {
                if (oldVlaue) {
                    oldVlaue = JSON.parse(oldVlaue);
                    let from = columns[0].children.findIndex(item => item.label === value.label);
                    let to = columns[0].children.findIndex(item => item.label === oldVlaue.label);
                    columns[0].children.splice(to, 0, columns[0].children.splice(from, 1)[0]);
                }
            }

        } else if (type === 1) {
            if (columns[0]) {
                columns[0].children.push(value);
            } else {
                columns[0] = {
                    id: "1",
                    type: "column",
                    children: []
                }

                columns[0].children.push(value);
            }
        }
        if (secondIndex >= 0) {
            if (type !== 2) {
                columns[1].splice(secondIndex, 1);
            } else {
                if (oldVlaue) {
                    oldVlaue = JSON.parse(oldVlaue);
                    let from = columns[1].children.findIndex(item => item.label === value.label);
                    let to = columns[1].children.findIndex(item => item.label === oldVlaue.label);
                    columns[1].children.splice(to, 0, columns[1].children.splice(from, 1)[0]);
                }
            }
        } else if (type === 2) {
            if (columns[1]) {
                columns[1].children.push(value);
            } else {
                columns[1] = {
                    id: "2",
                    type: "column",
                    children: []
                }
                columns[1].children.push(value);
            }
        }

        // design.push(columns)
        this.setState({ designData, design })
    }

    onDropFile = (attachedFiles, fieldName, maxSize) => {
        let selectedRecord = this.state.selectedRecord || {};
        selectedRecord[fieldName] = onDropAttachFileList(selectedRecord[fieldName], attachedFiles, maxSize)
        this.setState({ selectedRecord, actionType: "new" });
    }

    deleteAttachment = (event, file, fieldName) => {
        let selectedRecord = this.state.selectedRecord || {};
        selectedRecord[fieldName] = deleteAttachmentDropZone(selectedRecord[fieldName], file)

        this.setState({
            selectedRecord, actionType: "delete" //fileToDelete:file.name 
        });
    }

}
export default connect(mapStateToProps, {
    updateStore, crudMaster,
    getReactInputFields, selectRegistrationTemplate, filterColumnData,
    getRegistrationTemplate, getEditRegTemplate,
    getPreviewTemplate, getChildValues,
    getDynamicFilter, getDynamicFilterExecuteData,
    validateEsignCredential, validatePreview, addMasterRecord,
    getAddMasterCombo, getDynamicMasterTempalte, getChildComboMaster,
    getChildValuesForAddMaster, viewExternalportalDetail, getDefaultTemplate, getEditMaster
})(injectIntl(DynamicPreRegDesign))