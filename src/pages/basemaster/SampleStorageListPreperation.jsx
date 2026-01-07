import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl, } from 'react-intl';
import { Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';
import {
    constructOptionList, getControlMap, onSaveMandatoryValidation, searchData,
    searchJsonData, showEsign, sortData, deleteAttachmentDropZone, onDropAttachFileList,
    Lims_JSON_stringify
} from '../../components/CommonScript';
//import SortableTree from 'react-sortable-tree'; 
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import DataGrid from '../../components/data-grid/data-grid.component';
import {
    Utils as QbUtils,
} from "@react-awesome-query-builder/ui";
import SlideOutModal from '../../components/slide-out-modal/SlideOutModal';
import {
    callService
} from '../../actions';
import { DEFAULT_RETURN, UN_AUTHORIZED_ACCESS } from '../../actions/LoginTypes';
import { ListWrapper } from '../../components/client-group.styles';
// import ReactTooltip from 'react-tooltip';
//import { uuid } from 'uuidv4';
import { v4 as uuid } from 'uuid';
import ConfirmMessage from '../../components/confirm-alert/confirm-message.component';
import { transactionStatus } from '../../components/Enumeration';
import Esign from '../audittrail/Esign';
import rsapi from '../../rsapi';
import AddSampleStorageMapping from './AddSampleStorageMapping';
import Axios from 'axios';
import Preloader from '../../components/preloader/preloader.component';
import { process } from '@progress/kendo-data-query';
//import Spreadsheet from '../../components/Spreadsheet/Spreadsheet';
import MatrixComponent from '../../components/MatrixComponent';
import FilterQueryBuilder from '../../components/FilterQueryBuilder';
import { ExcelExport, ExcelExportColumn } from '@progress/kendo-react-excel-export';
import { LocalizationProvider } from '@progress/kendo-react-intl';
import AddFile from "../goodsin/AddFile";
import { updateStore } from '../../actions';
import { Checkbox } from '@progress/kendo-react-inputs';


class SampleStorageListPreperation extends Component {
    dragOverCnt = 0;
    isDragDrop = false;
    SEPARATOR = '_';
    uniqueIDArr = [];
    countforTree = 0;
    pointedItem = undefined
    getitemPath = {};


    constructor(props) {
        super(props);
        this.state = {
            queryBuilderFreezer: [],
            retrievalType: 1,
            // extractedColumnList: [   
            //     { "idsName": "IDS_STROAGENAMEORID", "dataField": "ssamplestoragelocationname", "width": "200px" },
            //     { "idsName": "IDS_SAMPLESTORAGEPATH", "dataField": "scontainerpath", "width": "450px" },
            //     { "idsName": "IDS_POSITION", "dataField": "sposition", "width": "100px" },
            //     { "idsName": "IDS_SAMPLEID", "dataField": "spositionvalue", "width": "100px" },
            //     //{ "idsName": "IDS_PROJECTTYPE", "dataField": "sprojecttypename", "width": "100px" },
            //     //{ "idsName": "IDS_PRODUCT", "dataField": "sproductname", "width": "100px" },
            //     { "idsName": "IDS_PARTICIPANTS", "dataField": "sparticipantid", "width": "100px" },
            //     //{ "idsName": "IDS_VISITNUMBER", "dataField": "svisitnumber", "width": "100px" },
            //     { "dataField": "svisitnumbershortcode", "idsName": "IDS_VISITNUMBERCODE", "width": "100px" }, 
            //     { "dataField": "sprojectshortcode", "idsName": "IDS_PROJECTTYPECODE" , "width": "100px"} ,
            //     { "dataField": "sproductshortcode", "idsName": "IDS_PRODUCTCODE", "width": "100px" } ,
            //     { "dataField": "ssampledonorshortcode", "idsName": "IDS_SAMPLEDONORCODE", "width": "100px" }  ,
            //     { "dataField": "scollectiontubetypeshortcode", "idsName": "IDS_COLLECTIONTUBETYPECODE", "width": "100px" }
            // ],
            sheetData: {},
            selectedRecordFilter: {},
            treeData: [{ title: 'Chicken', children: [{ title: 'Egg' }] }],
            toggleAction: false,
            treeDataView: undefined,
            toggleActionView: false,
            treeData: [
                {
                    //  text: "root",
                    text: this.props.intl.formatMessage({ id: "IDS_ROOT" }),
                    expanded: true,
                    editable: true,
                    root: true,
                    id: uuid(),
                }],
            panes: [{
                size: '50%',
                scrollable: false
            }],
            selectedRecord: {},
            userRoleControlRights: [],
            controlMap: new Map(),
            skip: 0,
            detailSkip: 0,
            detailTake: 10,
            take: this.props.Login.settings ?
                this.props.Login.settings[3] : 25,
            splitChangeWidthPercentage: 22,
            selectedItem: undefined,
            loading: false,
            dataStateChange: {
                take: 10,
                skip: 0,
                // group: [
                //     {
                //         field: "ssamplestoragelocationname",
                //     },
                // ],
            }
        };
        let fields = {};
        // if (this.state.extractedColumnList) {
        //     // let newArr=[...[  { "dataField": "svisitnumbershortcode", "idsName": "IDS_VISITNUMBERCODE", "width": "100px" }, 
        //     // { "dataField": "sprojectshortcode", "idsName": "IDS_PROJECTTYPECODE" , "width": "100px"} ,
        //     // { "dataField": "sproductshortcode", "idsName": "IDS_PRODUCTCODE", "width": "100px" } ,
        //     // { "dataField": "ssampledonorshortcode", "idsName": "IDS_SAMPLEDONORCODE", "width": "100px" }  ,
        //     // { "dataField": "scollectiontubetypeshortcode", "idsName": "IDS_COLLECTIONTUBETYPECODE", "width": "100px" }]
        //     // ,...this.state.extractedColumnList]
        //     this.state.extractedColumnList.map(field => {
        //         if (field.dataField !== 'ssamplestoragelocationname' && field.dataField !== 'sproductname'
        //             && field.dataField !== 'sprojecttypename' && field.dataField !== 'svisitnumber') {
        //             fields = {
        //                 ...fields,
        //                 [field.dataField]: {
        //                     "label":
        //                         this.props.intl.formatMessage({
        //                             id: field.idsName,
        //                         })
        //                     ,
        //                     "type": field.dataField === 'navailablespace' ? "number" : "text",
        //                     "valueSources": ["value", "func"],

        //                     "mainWidgetProps": {
        //                         "valueLabel": "Name",
        //                         "valuePlaceholder": this.props.intl.formatMessage({
        //                             id: field.idsName
        //                         })
        //                     }
        //                 }
        //             }
        //         }
        //     });
        // }
        this.state = { ... this.state, 'fields': fields }
        this.searchRef = React.createRef();
        this.dragClue = React.createRef();
        this.confirmMessage = new ConfirmMessage();
    }
    static getDerivedStateFromProps(props, state) {

        if (props.Login.masterStatus !== "" && props.Login.masterStatus !== state.masterStatus) {
            toast.warn(props.Login.masterStatus);
            props.Login.masterStatus = "";
        }

        if (props.Login.error !== "" && props.Login.error !== state.error) {
            toast.error(props.Login.error)
            props.Login.error = "";
        }
        return null;
    }
    componentDidUpdate(previousProps, previousState) {
        let { filterData, storageCategoryOptions,
            selectedRecord, controlMap,
            userRoleControlRights, storageLocationOptions,
            sampleStorageVersionOptions, masterData, selectedRecordFilter, fields, selectedProjectType, selectedProjectTypeList, queryBuilderFreezer, selectedSite, needSiteCombo, nprojectbasedload } = this.state

        let bool = false;

        ///////////////////////////////
        if (this.props.Login.masterData.sampleStorageLocation !== previousProps.Login.masterData.sampleStorageLocation) {
            bool = true;
            //ALPDJ21-32--Added by Vignesh(30-09-2025)-->Sample Storage Structure Displayed when the instrument set to No
            if (this.props.Login.settings && parseInt(this.props.Login.settings[84]) === transactionStatus.NO) {

                this.props.Login.masterData.sampleStorageLocation && this.props.Login.masterData.sampleStorageLocation.map(
                    (item) => queryBuilderFreezer.push({ "value": item.nsamplestoragelocationcode, "title": item.ssamplestoragelocationname })
                )
                fields = {
                    ...fields,
                    'nsamplestoragelocationcode': {
                        "label": this.props.intl.formatMessage({
                            id: "IDS_STORAGESTRUCTURENAME",
                        }),
                        "type": "select",
                        "valueSources": ["value"],
                        "fieldSettings": {
                            "listValues": queryBuilderFreezer
                        }
                    }
                }

            }
        }

        if (this.props.Login.masterData.sampleType !== previousProps.Login.masterData.sampleType) {
            let queryBuilderFreezer = [];
            bool = true;


            if (this.props.Login.settings && parseInt(this.props.Login.settings[84]) === transactionStatus.YES) {

                this.props.Login.masterData.sampleType && this.props.Login.masterData.sampleType.map(
                    (item) => queryBuilderFreezer.push({ "value": item.nsampletypecode, "title": item.sproductname })
                )
                fields = {
                    ...fields,
                    'nsampletypecode': {
                        "label": this.props.intl.formatMessage({
                            id: "IDS_BIOSAMPLETYPE",
                        }),
                        "type": "select",
                        "valueSources": ["value"],
                        "fieldSettings": {
                            "listValues": queryBuilderFreezer
                        }
                    }
                }

            } else {
                this.props.Login.masterData.sampleType && this.props.Login.masterData.sampleType.map(
                    (item) => queryBuilderFreezer.push({ "value": item.nproductcode, "title": item.sproductname })
                )
                fields = {
                    ...fields,
                    'nproductcode': {
                        "label": this.props.intl.formatMessage({
                            id: "IDS_SAMPLETYPE",
                        }),
                        "type": "select",
                        "valueSources": ["value"],
                        "fieldSettings": {
                            "listValues": queryBuilderFreezer
                        }
                    }
                }
            }





        }

        //ATE234 Janakumar ALPDJ21-37 Product Enhancement for sample storage & Repository. -Start
        if (this.props.Login.masterData.lstInstrument !== previousProps.Login.masterData.lstInstrument && parseInt(this.props.Login.settings[84]) === transactionStatus.YES) {
            let queryBuilderFreezer = [];
            bool = true;
            this.props.Login.masterData.lstInstrument && this.props.Login.masterData.lstInstrument.map(
                (item) => queryBuilderFreezer.push({ "value": item.ninstrumentcode, "title": item.sinstrumentid })

            )
            fields = {
                ...fields,
                'ninstrumentcode': {
                    "label": this.props.intl.formatMessage({
                        id: "IDS_STROAGENAMEORID",
                    }),
                    "type": "select",
                    "valueSources": ["value"],
                    "fieldSettings": {
                        "listValues": queryBuilderFreezer
                    }
                }
            }
        }
        // ATE234-janakumar-ALPDJ21-37 Product Enhancement for sample storage & Repository. -- End


        // if (this.props.Login.masterData.sampleType !== previousProps.Login.masterData.sampleType) {
        //     let queryBuilderFreezer = [];
        //     bool = true;
        //     this.props.Login.masterData.sampleType && this.props.Login.masterData.sampleType.map(
        //         (item) => queryBuilderFreezer.push({ "value": item.nproductcode, "title": item.sproductname })
        //     )
        //     fields = {
        //         ...fields,
        //         'nproductcode': {
        //             "label": this.props.intl.formatMessage({
        //                 id: "IDS_PRODUCT",
        //             }),
        //             "type": "select",
        //             "valueSources": ["value"],
        //             "fieldSettings": {
        //                 "listValues": queryBuilderFreezer
        //             }
        //         }
        //     }

        // }
        // if (this.props.Login.masterData.ProjectType !== previousProps.Login.masterData.ProjectType) {
        //     let queryBuilderFreezer = [];
        //     bool = true;
        //     this.props.Login.masterData.ProjectType && this.props.Login.masterData.ProjectType.map(
        //         (item) => queryBuilderFreezer.push({ "value": item.nprojecttypecode, "title": item.sprojecttypename })
        //     )
        //     fields = {
        //         ...fields,
        //         'nprojecttypecode': {
        //             "label": this.props.intl.formatMessage({
        //                 id: "IDS_PROJECTTYPE",
        //             }),
        //             "type": "select",
        //             "valueSources": ["value"],
        //             "fieldSettings": {
        //                 "listValues": queryBuilderFreezer
        //             }
        //         }
        //     }

        // } if (this.props.Login.masterData.VisitNumber !== previousProps.Login.masterData.VisitNumber) {
        //     let queryBuilderFreezer = [];
        //     bool = true;
        //     this.props.Login.masterData.VisitNumber && this.props.Login.masterData.VisitNumber.map(
        //         (item) => queryBuilderFreezer.push({ "value": item.nvisitnumbercode, "title": item.svisitnumber })
        //     )
        //     fields = {
        //         ...fields,
        //         'nvisitnumbercode': {
        //             "label": this.props.intl.formatMessage({
        //                 id: "IDS_VISITNUMBER",
        //             }),
        //             "type": "select",
        //             "valueSources": ["value"],
        //             "fieldSettings": {
        //                 "listValues": queryBuilderFreezer
        //             }
        //         }
        //     }

        // }
        ///////////////////////////////
        if (this.props.Login.userInfo.nformcode !== previousProps.Login.userInfo.nformcode) {
            bool = true;
            userRoleControlRights = [];
            if (this.props.Login.userRoleControlRights) {
                this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode] && Object.values(this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode]).map(item =>
                    userRoleControlRights.push(item.ncontrolcode))
            }
            controlMap = getControlMap(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode)

        }

        if (this.props.Login.masterData.filterStorageCategory !== previousProps.Login.masterData.filterStorageCategory) {
            bool = true;
            const filterStorageCategorylist = constructOptionList(this.props.Login.masterData.filterStorageCategory || [], "nstoragecategorycode",
                "sstoragecategoryname", undefined, undefined, undefined);
            storageCategoryOptions = filterStorageCategorylist.get("OptionList");
            if (this.props.Login.masterData.selectedStorageCategory) {
                selectedRecordFilter = {
                    ...selectedRecordFilter,
                    nstoragecategorycode: storageCategoryOptions.filter(item =>
                        item.value === this.props.Login.masterData.selectedStorageCategory.nstoragecategorycode)[0]
                }
            }

        }
        if (this.props.Login.masterData.sampleStorageLocation !== previousProps.Login.masterData.sampleStorageLocation) {
            bool = true;
            const sampleStorageLocationList = constructOptionList(this.props.Login.masterData.sampleStorageLocation || [], "nsamplestoragelocationcode",
                "ssamplestoragelocationname", undefined, undefined, undefined);
            storageLocationOptions = sampleStorageLocationList.get("OptionList");
            if (this.props.Login.masterData.selectedSampleStorageLocation) {
                selectedRecordFilter = {
                    ...selectedRecordFilter,
                    nsamplestoragelocationcode: storageLocationOptions.filter(item =>
                        item.value === this.props.Login.masterData.selectedSampleStorageLocation.nsamplestoragelocationcode)[0]
                }
            }


        }

        if (this.props.Login.masterData.sampleStorageVersion !== previousProps.Login.masterData.sampleStorageVersion) {
            bool = true;
            const sampleStorageVersionList = constructOptionList(this.props.Login.masterData.sampleStorageVersion || [], "nsamplestorageversioncode",
                "nversionno", undefined, undefined, undefined);
            sampleStorageVersionOptions = sampleStorageVersionList.get("OptionList");
            if (this.props.Login.masterData.selectedSampleStorageVersion) {
                selectedRecordFilter = {
                    ...selectedRecordFilter,
                    nsamplestorageversioncode: sampleStorageVersionOptions.filter(item =>
                        item.value === this.props.Login.masterData.selectedSampleStorageVersion.nsamplestorageversioncode)[0]
                }
            }
        }

        if (this.props.Login.masterData !== previousProps.Login.masterData) {
            bool = true;
            masterData = this.props.Login.masterData;
            selectedProjectType = {
                label: this.props.Login.masterData.selectedProjectType &&
                    this.props.Login.masterData.selectedProjectType.sprojecttypename, value:
                    this.props.Login.masterData.selectedProjectType &&
                    this.props.Login.masterData.selectedProjectType.nprojecttypecode
            };
            selectedProjectTypeList = this.props.Login.masterData.selectedProjectTypeList;
            const filterStorageCategorylist = constructOptionList(this.props.Login.masterData.projectbarcodeconfig || [], "nprojecttypecode",
                "sprojecttypename", undefined, undefined, "alphabeticalSort");
            masterData['projectbarcodeconfig'] = filterStorageCategorylist.get("OptionList");
            if (masterData.samplestoragelistpreperation === undefined) {
                masterData['samplestoragelistpreperation'] = []
            }
            filterData = this.generateBreadCrumData(this.props.Login.masterData);

            // ATE234-janakumar-ALPDJ21-37 Product Enhancement for sample storage & Repository. -- Start

            if (this.props.Login.masterData.lstSite !== undefined && parseInt(this.props.Login.settings[84]) === transactionStatus.YES) {

                const filterSitelist = constructOptionList(this.props.Login.masterData.lstSite || [], "nsitecode",
                    "ssitename", undefined, undefined, undefined);

                masterData['siteTypeOptions'] = filterSitelist.get("OptionList");

                selectedSite = {
                    label: this.props.Login.masterData.selectedSite &&
                        this.props.Login.masterData.selectedSite.ssitename,
                    value:
                        this.props.Login.masterData.selectedSite &&
                        this.props.Login.masterData.selectedSite.nsitecode
                };

            }
            // ATE234-janakumar-ALPDJ21-37 Product Enhancement for sample storage & Repository. -- End


        }

        if (this.state.masterData !== previousState.masterData) {
            bool = true;
            filterData = this.generateBreadCrumData(this.state.masterData);

        }
        // ALPD-5531 added by Abdul 07-Mar-2025 for Handling Export template Click
        if (this.state.export) {
            this._excelExportHeader.save()
            this.setState({ export: false })
        }
        // ALPD-5531 End

        // ATE234-janakumar-ALPDJ21-37 Product Enhancement for sample storage & Repository. -- Start

        if (this.props.Login.settings && parseInt(this.props.Login.settings[84]) === transactionStatus.YES) {

            let fields = { ...this.state.fields }; // make a shallow copy

            if (this.state.fields !== undefined && this.state.fields['sstorageconditionname'] === undefined) {
                if (this.state.fields !== undefined) {

                    fields["sstorageconditionname"] = {
                        label: this.props.intl.formatMessage({ id: "IDS_TEMPERATUREDEG" }),
                        type: "text",
                        valueSources: ["value", "func"],
                        mainWidgetProps: {
                            valueLabel: "Name",
                            valuePlaceholder: this.props.intl.formatMessage({ id: "IDS_TEMPERATUREDEG" })
                        }
                    };

                    this.setState({ fields });
                }
            }

            if (this.state.fields !== undefined && this.props.Login.masterData?.nisthirdpartysharable !== undefined && this.state.fields['nissampleaccesable'] === undefined) {

                if (this.state.fields !== undefined) {
                    const queryBuilderFreezer = this.props.Login.masterData?.nissampleaccesable?.map(item => ({
                        value: item.nissampleaccesable,
                        title: item.ssampleaccesable
                    })) || [];

                    fields = {
                        ...fields,
                        'nissampleaccesable': {
                            "label": this.props.intl.formatMessage({
                                id: "IDS_SAMPLEACCESABLE",
                            }),
                            "type": "select",
                            "valueSources": ["value"],
                            "fieldSettings": {
                                "listValues": queryBuilderFreezer
                            }
                        }
                    }
                    this.setState({ fields });
                }
            }

            if (this.state.fields !== undefined && this.props.Login.masterData?.nisthirdpartysharable !== undefined && this.state.fields['nisthirdpartysharable'] === undefined) {


                if (this.state.fields !== undefined) {
                    const queryBuilderFreezer = this.props.Login.masterData?.nisthirdpartysharable?.map(item => ({
                        value: item.nisthirdpartysharable,
                        title: item.sthirdpartysharable
                    })) || [];

                    fields = {
                        ...fields,
                        'nisthirdpartysharable': {
                            "label": this.props.intl.formatMessage({
                                id: "IDS_THIRDPARTYSHARABLE",
                            }),
                            "type": "select",
                            "valueSources": ["value"],
                            "fieldSettings": {
                                "listValues": queryBuilderFreezer
                            }
                        }
                    }
                    this.setState({ fields });
                }
            }
            //User enter to the screen ,record inital was no 4
            if (this.state.nprojectbasedload === undefined) {
                nprojectbasedload = 4;
            }

        }
        if (this.props.Login.masterData.needSiteCombo !== undefined && this.props.Login.masterData?.needSiteCombo !== previousProps.Login.masterData.needSiteCombo) {
            if (this.props.Login.masterData.needSiteCombo === true) {
                needSiteCombo = true;
            } else {
                needSiteCombo = false;
            }

        }
        // ATE234-janakumar-ALPDJ21-37 Product Enhancement for sample storage & Repository. -- End



        if (bool) {
            this.setState({
                storageCategoryOptions, filterData,
                selectedRecord, controlMap,
                userRoleControlRights, storageLocationOptions,
                sampleStorageVersionOptions, masterData, selectedRecordFilter, fields, selectedProjectType, selectedProjectTypeList, queryBuilderFreezer, selectedSite, needSiteCombo, nprojectbasedload
            });
        }

    }


    openModal = () => {
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                openModal: true, selectedRecord: {}, loadTreeProperties: false,
                treeData: [
                    {
                        text: "root",
                        expanded: true,
                        editable: true,
                        root: true,
                        id: uuid(),
                    },
                ], operation: "create"
            }
        }
        this.props.updateStore(updateInfo);
    }
    closeModal = () => {
        // const updateInfo = {
        //     typeName: DEFAULT_RETURN,
        //     data: {
        //         openModal: false, selectedRecord: {}
        //     }
        // }
        // this.props.updateStore(updateInfo);
        let loadEsign = this.props.Login.loadEsign;
        let openModal = this.props.Login.openModal;
        let selectedId = this.props.Login.selectedId;
        let selectedRecord = this.state.selectedRecord; //this.props.Login.selectedRecord;
        if (this.props.Login.loadEsign) {
            if (this.props.Login.operation === "delete" || this.props.Login.operation === "Approve" || this.props.Login.operation === "copy") {
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

        // const updateInfo = {
        //     typeName: DEFAULT_RETURN,
        //     data: { openModal, loadEsign, selectedRecord, selectedId }
        // }
        // this.props.updateStore(updateInfo);
        // this.getsamplestoragetransaction({}, this.props.Login.userInfo);
        // if (!this.state.isFilterPopup) {
        //     this.getDynamicFilterExecuteData()

        // }
        this.setState({
            selectedRecord,
            openModal: false, isInitialRender: true, importTemplate: false
            , isFilterPopup: false
        })
    }
    onInputChange = (event) => {
        const selectedRecord = this.state.selectedRecord || {};
        if (event.target.type === "checkbox") {
            selectedRecord[event.target.name] = event.target.checked;
        } else {
            selectedRecord[event.target.name] = event.target.value;
        }

        this.setState({ selectedRecord });
    };

    onSaveClick = (saveType, formRef) => {
        if (this.props.Login.loadTreeProperties === true) {
            this.onSaveProperties(saveType, formRef);
        } else if (this.state.openSpreadSheet) {
            this.CRUDSampleStorageTransaction({
                ...this.state.editedsheetData,
                nsamplestoragemappingcode: this.state.isMultiSampleAdd ?
                    Object.keys(this.state.sheetData).map(nsamplestoragemappingcode => nsamplestoragemappingcode).join(",")
                    : this.state.editedsheetData.nsamplestoragemappingcode.toString(),
                nsamplestoragelocationcode: this.state.editedsheetData.nsamplestoragelocationcode,
                sheetData: JSON.stringify(this.state.sheetData ? this.state.sheetData : {}),
                sheetUpdate: true,
                userinfo: this.props.Login.userInfo,
                isMultiSampleAdd: this.state.isMultiSampleAdd
            }, 'create');
        } else {
            this.onSaveSampleStorageTransaction(saveType, formRef);
        }
    };


    paneSizeChange = (d) => {
        this.setState({
            splitChangeWidthPercentage: d
        })
    }
    handlePageChange = e => {
        this.setState({
            skip: e.skip,
            take: e.take
        });
    };
    handleDetailPageChange = e => {
        this.setState({
            skip: e.skip,
            take: e.take
        });
    };
    componentDidMount() {
        if (this.parentHeight) {
            const height = this.parentHeight.clientHeight;
            this.setState({
                firstPane: height - 80,
                parentHeight: height - 50
            });
        }
    }
    generateBreadCrumData(obj) {
        const breadCrumbData = [];
        if (this.state.masterData && this.state.masterData.filterStorageCategory) {

            breadCrumbData.push(
                {
                    "label": "IDS_STORAGECATEGORY",
                    "value": obj.selectedStorageCategoryName &&
                        obj.selectedStorageCategoryName !== null ?
                        obj.selectedStorageCategoryName : "NA"

                }
                // ,
                // {
                //     "label": "IDS_STORAGECATEGORYLOCATION",
                //     "value": obj.selectedSampleStorageLocation &&
                //         obj.selectedSampleStorageLocation.ssamplestoragelocationname !== null ?
                //         obj.selectedSampleStorageLocation.ssamplestoragelocationname : "NA"
                // },
                // {
                //     "label": "IDS_STORAGECATEGORYVERSION",
                //     "value": obj.selectedSampleStorageVersion &&
                //         obj.selectedSampleStorageVersion.nversionno !== null ?
                //         obj.selectedSampleStorageVersion.nversionno : "NA"
                // }
            );
        }
        return breadCrumbData;
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
    reloadData = () => {
        this.onFilterSubmit();
    }
    onEditSampleStorageLocation = (selectedSampleStorageVersion, userInfo, editId) => {
        this.handleSearch();
        this.setState({ searchedTreeData: undefined })
        if (this.searchRef.current) {
            this.searchRef.current.value = "";
        }

        let isOnlyDraft = false;
        if (this.props.Login.masterData.sampleStorageVersion && this.props.Login.masterData.sampleStorageVersion.length > 1) {
            isOnlyDraft = true;
        }
        this.props.editSampleStorageLocation(selectedSampleStorageVersion, userInfo, isOnlyDraft, editId);
    }
    openStorageMapping = (addId) => {
        this.addSampleStorageMapping({ userInfo: this.props.Login.userInfo, addId });
    }
    deletesamplestoragemapping = (param) => {
        this.CRUDSampleStorageTransaction({
            'nsamplestoragelocationcode': this.state.masterData.selectedSampleStorageLocation.nsamplestoragelocationcode,
            'nsamplestoragemappingcode': param.nsamplestoragemappingcode,
            userinfo: this.props.Login.userInfo
        }, 'delete');
    }
    addMultipleSample = (param) => {
        this.setState({
            //sheetData: JSON.parse(response[0].data.sheetData),
            openModal: true, isMultiSampleAdd: true, openSpreadSheet: true,//, editedsheetData: param, Rows: param.nrow, columns: param.ncolumn,
            loading: false
        })
    }
    opensearch = () => {
        this.setState({
            openModal: true, isFilterPopup: true, selectedRecord: { ...this.state.submittedselectedRecord } ||
                { ...this.state.selectedRecord }
        })
    }
    // ALPD 5531 Start Added by Abdul for handling Export and Import clicks, file drop and delete in drop zone of Bulk Search SlideOut 07/03/2025
    handleExportClick = () => {
        let exportField = [{ "idsName": "IDS_SAMPLEID", "dataField": "spositionvalue", "width": "200px", "staticField": true }];
        this.setState({ exportField, export: true });
    }
    handleImportTemplate = () => {
        this.setState({
            importTemplate: true,
            openModal: true,
            loading: false,
            selectedRecord: {},
        });
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
    getImportSampleIDData = () => {
        let selectedRecord = this.state.selectedRecord;
        // ALPD-5582 Added by Abdul on 19 Mar 2025 for validating whether a file has been uploaded or not
        if (selectedRecord['stemplatefilename'] && (selectedRecord['stemplatefilename'][0] !== undefined)) {
            const formData = new FormData();
            formData.append("ImportFile", selectedRecord['stemplatefilename'][0]);
            formData.append("nformcode", this.props.Login.userInfo && this.props.Login.userInfo.nformcode);
            formData.append("userinfo", JSON.stringify(this.props.Login.userInfo));
            formData.append("nprojecttypecode", this.state.selectedProjectType && this.state.selectedProjectType.value ? this.state.selectedProjectType.value : -1);
            formData.append("source", 'view_samplelistprep_');
            formData.append("fieldName", Lims_JSON_stringify(this.props.intl.formatMessage({ id: "IDS_SAMPLEID" })));
            formData.append("label", 'samplestoragelistpreperation');
            formData.append("valuemember", 'nsamplestoragetransactioncode');
            this.setState({ loading: true });
            const requestUrl = rsapi().post("/samplestoragelistpreperation/getimportsampleiddata", formData);
            return requestUrl
                .then(response => {
                    let masterData = this.state.masterData
                    masterData = { ...masterData, ...response.data }
                    this.setState({
                        masterData: { ...masterData },
                        loading: false,
                        openModal: false,
                        isFilterPopup: false,
                        importTemplate: false,
                        submittedselectedRecord:
                            { ...this.state.submittedselectedRecord }
                        ,
                        dataStateChange: {
                            take: 10,
                            skip: 0
                        },
                        selectedRecord: {},
                    })
                })
                .catch(error => {
                    this.setState({
                        loading: false
                    });
                    if (error.response?.status === 429) {
                    toast.warn(this.props.intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
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
                        toast.info(error.response.data);
                    }

                })

        }
        // ALPD-5582 Added by Abdul on 19 Mar 2025 for validating whether a file has been uploaded or not
        else {
            toast.info(`${this.props.intl.formatMessage({ id: "IDS_CHOOSE" })} ${this.props.intl.formatMessage({ id: "IDS_FILE" })}`);
        }

    }
    // ALPD 5531 End

    addSample = (param, nflag) => {
        this.setState({ loading: true })
        let urlArray = [];
        const url1 = rsapi().post("samplestoragelistpreperation/getsamplestoragemappingSheetData",
            {
                isMultiSampleAdd: (nflag === 2) ? true : false,
                nsamplestoragemappingcode:
                    (nflag === 2) ? this.state.masterData.samplestoragelistpreperation.map(item => item.nsamplestoragemappingcode).join(",")
                        : param.nsamplestoragemappingcode.toString()
            });
        urlArray = [url1];
        Axios.all(urlArray)
            .then(response => {
                if (nflag === 2) {
                    this.setState({
                        sheetData: JSON.parse(response[0].data.sheetData),
                        openModal: true, isMultiSampleAdd: true, openSpreadSheet: true,//, editedsheetData: param, Rows: param.nrow, columns: param.ncolumn,
                        loading: false
                    })
                } else {
                    this.setState({
                        sheetData: JSON.parse(response[0].data.sheetData),
                        openModal: true, isMultiSampleAdd: false, openSpreadSheet: true,
                        editedsheetData: param, Rows: param.nrow, columns: param.ncolumn,
                        loading: false
                    })
                }
            }).catch(error => {
                if (error.response?.status === 429) {
                    toast.warn(this.props.intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
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
                } else {
                    toast.warn(error.response.data);
                }
                this.setState({
                    loading: false
                });
            });


    }
    onInputSetCheckBoxValue = (event) => {

        const nprojectbasedload = event.target.element.current.checked === true ? 3 : 4;

        this.setState({ nprojectbasedload });

    }
    onComboChange = (comboData, fieldName) => {
        const selectedRecord = this.state.selectedRecord || {};
        let selectedRecordFilter = this.state.selectedRecordFilter || {};

        if (fieldName === 'nstoragecategorycode') {
            return this.getSampleStorageLocation({
                userinfo: this.props.Login.userInfo,
                nstoragecategorycode: comboData.value
            }, fieldName, comboData);
        } else if (fieldName === 'ncontainertypecode') {
            return this.getContainerStructure({
                userinfo: this.props.Login.userInfo,
                ncontainertypecode: comboData.value
            }, fieldName, comboData);

        } else if (fieldName === 'nprojecttypecode') {
            return this.getprojectbarcodeconfig(comboData);

        } else if (fieldName === 'nsitecode') {
            // ATE234-janakumar-ALPDJ21-37 Product Enhancement for sample storage & Repository. -- Start
            return this.getSiteRecords(comboData);

        }
        else if (fieldName === 'ncontainerstructurecode') {
            selectedRecord['nrow'] = comboData.item.nrow ? comboData.item.nrow : 1;
            selectedRecord['ncolumn'] = comboData.item.ncolumn ? comboData.item.ncolumn : 1;
        } else if (fieldName === 'nsamplestoragelocationcode') {
            return this.getSampleStorageLocation({
                userinfo: this.props.Login.userInfo,
                nstoragecategorycode: this.state.selectedRecordFilter['nstoragecategorycode'].value,
                nsamplestoragelocationcode: comboData.value

            }, fieldName, comboData);
        }
        if (fieldName === 'nsamplestorageversioncode') {
            selectedRecordFilter[fieldName] = comboData;
            this.setState({ selectedRecordFilter });

        } else {
            selectedRecord[fieldName] = comboData;
            this.setState({ selectedRecord, selectedRecordFilter });
        }


    }

    onSaveSampleStorageTransaction = (saveType) => {
        let selectedRecord = this.state.selectedRecord;
        let containerpathCodeArray = [];
        if (this.state.operation === 'create') {
            containerpathCodeArray = selectedRecord['nsamplestoragecontainerpathcode'].map(item => item.value);
        }
        const inputParam =
        {
            nsamplestoragetransactioncode: selectedRecord['nsamplestoragetransactioncode'] ?
                parseInt(selectedRecord['nsamplestoragetransactioncode']) : 0,
            nsamplestoragelocationcode: this.state.masterData.selectedSampleStorageLocation.nsamplestoragelocationcode,
            nsamplestoragemappingcode: selectedRecord['nsamplestoragemappingcode'] ?
                parseInt(selectedRecord['nsamplestoragemappingcode']) : 0,
            ncontainertypecode: -1,
            nproductcode: selectedRecord['nproductcode'].value,
            ndirectionmastercode: -1,
            ssamplestoragemappingname: "-",
            nsamplestoragecontainerpathcode: this.state.operation === 'create' ?
                JSON.stringify(containerpathCodeArray) : parseInt(selectedRecord['nsamplestoragecontainerpathcode'].value),
            containerpathsize: containerpathCodeArray.length,
            nneedposition: 4,
            ncontainerstructurecode: -1, nquantity: selectedRecord['nquantity'] ?
                parseInt(selectedRecord['nquantity']) : 1,
            userinfo: this.props.Login.userInfo
        }
        const masterData = this.props.Login.masterData;
        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolcode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData }, saveType
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.CRUDSampleStorageTransaction(inputParam, this.state.operation);
        }
    }
    getsamplestoragetransaction = (inputParam, userinfo) => {
        this.setState({ loading: true })
        let urlArray = [];
        const url1 = rsapi().post("samplestoragelistpreperation/getsamplestoragetransaction", {
            userinfo: this.props.Login.userInfo
        });
        urlArray = [url1];
        Axios.all(urlArray)
            .then(response => {
                this.setState({
                    masterData: {
                        ...this.state.masterData, ...response[0].data
                    },
                    loading: false
                });

            }).catch(error => {
                if (error.response?.status === 429) {
                    toast.warn(this.props.intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
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
                } else {
                    toast.warn(error.response.data);
                }
                this.setState({
                    loading: false
                });
            });

    }

    childDataChange = (selectedRecord) => {
        this.setState({
            selectedRecord: {
                ...selectedRecord
            },
            isInitialRender: false
        });
    }
    childSheetDataChange = (sheetData) => {

        this.setState({
            // selectedRecord: {
            //     ...this.state.selectedRecord,
            //     sheetData: {
            //         ...this.state.selectedRecord.sheetData,
            //         ...sheetData
            //     }
            // },
            sheetData: {
                ...sheetData
            },
            isInitialRender: false
        });
    }
    // Actions start
    getActiveSampleStorageMappingById = (inputParam, userinfo) => {
        this.setState({ loading: true })
        let urlArray = [];
        const url1 = rsapi().post("samplestoragelistpreperation/getActiveSampleStorageMappingById", {
            nsamplestoragelocationcode: inputParam['selectedSampleStorageLocation'][0].nsamplestoragelocationcode,
            userinfo: userinfo
        });
        urlArray = [url1];
        Axios.all(urlArray)
            .then(response => {
                this.setState({
                    masterData: {
                        ...this.state.masterData, ...response[0].data
                    }//,
                    // selectedRecord: {
                    //     ...this.state.selectedRecord
                    //    // , sheetData: JSON.parse(response[0].data.selectedSampleStoragemapping.jsondata.value)
                    // }
                    ,
                    loading: false
                });

            }).catch(error => {
                if (error.response?.status === 429) {
                    toast.warn(this.props.intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
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
                } else {
                    toast.warn(error.response.data);
                }
                this.setState({
                    loading: false
                });
            });

    }
    filterColumnData = (filterValue, filterParam) => {
        let masterData = filterParam.masterData;
        let primaryKeyValue = 0;
        let searchedData = undefined;
        if (filterValue === "") {
            if (masterData[filterParam.inputListName] && masterData[filterParam.inputListName].length > 0) {
                primaryKeyValue = masterData[filterParam.inputListName][0][filterParam.primaryKeyField];
            }
        }
        else {
            if (filterParam.isjsondata) {
                searchedData = searchJsonData(filterValue, masterData[filterParam.inputListName], filterParam.searchFieldList || []);
            }
            else {
                searchedData = searchData(filterValue, masterData[filterParam.inputListName], filterParam.searchFieldList || []);

            }
            if (searchedData.length > 0) {
                primaryKeyValue = searchedData[0][filterParam.primaryKeyField];
            }
        }

        if (primaryKeyValue !== 0) {
            this.setState({ loading: true });
            return rsapi().post(filterParam.fetchUrl, { ...filterParam.fecthInputObject, [filterParam.primaryKeyField]: primaryKeyValue })
                .then(response => {
                    masterData["searchedData"] = searchedData;
                    masterData = { ...masterData, ...response.data };

                    if (filterParam.sortField) {
                        sortData(masterData, filterParam.sortOrder, filterParam.sortField);
                    }
                    else {
                        sortData(masterData);
                    }
                    this.setState({ masterData, loading: false, skip: 0, take: 10, selectedId: null });
                })
                .catch(error => {
                    this.setState({ loading: false });
                    if (error.response?.status === 429) {
                    toast.warn(this.props.intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
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
                        toast.error(this.props.intl.formatMessage({ id: error.message }));
                    }
                    else {
                        toast.warn(this.props.intl.formatMessage({ id: error.response.data }));
                    }
                })
        }
        else {
            masterData[filterParam.selectedObject] = undefined;
            masterData["searchedData"] = [];
            Object.keys(masterData).forEach(item => {
                if (item !== filterParam.inputListName && item !== filterParam.selectedObject
                    && filterParam.unchangeList && filterParam.unchangeList.indexOf(item) === -1)
                    masterData[item] = [];
            })
            this.setState({
                masterData, operation: null, modalName: undefined,
                loading: false
            });

        }
    }


    CRUDSampleStorageTransaction = (inputParam, operation) => {
        this.setState({ loading: true })
        let urlArray = [];
        const url1 = rsapi().post("samplestoragelistpreperation/" + operation + "samplestoragelistpreperation", inputParam);
        urlArray = [url1];
        Axios.all(urlArray)
            .then(response => {
                this.setState({
                    isInitialRender: true,
                    selectedRecord: {},
                    masterData: {
                        ...this.state.masterData, ...response[0].data
                    },
                    openModal: false,
                    loading: false
                });

            }).catch(error => {
                if (error.response?.status === 429) {
                    toast.warn(this.props.intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
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
                } else {
                    toast.warn(error.response.data);
                }
                this.setState({
                    loading: false
                });
            });

    }

    getSampleStorageLocation(inputData, fieldName, comboData) {
        let selectedRecordFilter = this.state.selectedRecordFilter || {};
        let inputParamData = {}
        this.setState({ loading: true })
        if (fieldName === 'nsamplestoragelocationcode') {
            inputParamData = {
                nstoragecategorycode: selectedRecordFilter['nstoragecategorycode'].value,
                nsamplestoragelocationcode: comboData.value,
                userinfo: inputData.userinfo
            }
        } else {
            inputParamData = {
                nstoragecategorycode: comboData.value,
                userinfo: inputData.userinfo
            }
        }
        let urlArray = [];
        const url1 = rsapi().post("samplestoragelistpreperation/getsamplestoragemapping", inputParamData);

        urlArray = [url1];
        Axios.all(urlArray)
            .then(response => {
                let { storageLocationOptions,
                    sampleStorageVersionOptions } = this.state

                let sampleStorageLocationList = constructOptionList(response[0].data.sampleStorageLocation || [], "nsamplestoragelocationcode",
                    "ssamplestoragelocationname", undefined, undefined, undefined);
                storageLocationOptions = sampleStorageLocationList.get("OptionList");
                let sampleStorageVersionList = constructOptionList(response[0].data.sampleStorageVersion || [], "nsamplestorageversioncode",
                    "nversionno", undefined, undefined, undefined);
                sampleStorageVersionOptions = sampleStorageVersionList.get("OptionList");
                selectedRecordFilter = {
                    ...selectedRecordFilter,
                    nsamplestoragelocationcode: storageLocationOptions.length > 0 ?
                        storageLocationOptions[0] : [],
                    nsamplestorageversioncode: sampleStorageVersionOptions.length > 0 ?
                        sampleStorageVersionOptions[0] : [],

                }
                this.setState({
                    storageLocationOptions, sampleStorageVersionOptions,
                    selectedRecordFilter: {
                        ...selectedRecordFilter,
                        [fieldName]: comboData
                    },
                    loading: false
                });
            }).catch(error => {
                if (error.response?.status === 429) {
                    toast.warn(this.props.intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
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
                } else {
                    toast.warn(error.response.data);
                }
                this.setState({
                    loading: false
                });
            });
    }

    onFilterSubmit = () => {
        this.setState({ loading: true })
        let inputParamData = {
            nstoragecategorycode: this.state.selectedRecordFilter["nstoragecategorycode"].value,
            // nsamplestoragelocationcode: this.state.selectedRecordFilter["nsamplestoragelocationcode"].value,
            // nsamplestorageversioncode: this.state.selectedRecordFilter["nsamplestorageversioncode"].value,
            userinfo: this.props.Login.userInfo,
        }
        let urlArray = [];
        const url1 = rsapi().post("samplestoragelistpreperation/getsamplestoragemapping", inputParamData);
        urlArray = [url1];
        Axios.all(urlArray)
            .then(response => {
                let object = {
                    selectedStorageCategoryName: this.state.selectedRecordFilter["nstoragecategorycode"].item.sstoragecategoryname,
                    // ssamplestoragelocationname: this.state.selectedRecordFilter["nsamplestoragelocationcode"].item.ssamplestoragelocationname,
                    // selectedSampleStorageVersion: this.state.selectedRecordFilter["nsamplestorageversioncode"].item.nversionno,
                }
                let filterData = this.generateBreadCrumData(object);

                this.setState({
                    filterData,
                    masterData: {
                        ...this.state.masterData,
                        ...response[0].data,
                        //   samplestoragelistpreperation: response[0].data['samplestoragelistpreperation'],
                    },
                    loading: false
                });
            }).catch(error => {
                if (error.response?.status === 429) {
                    toast.warn(this.props.intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
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
                } else {
                    toast.warn(error.response.data);
                }
                this.setState({
                    loading: false
                });
            });
    }
    addSampleStorageMapping() {
        this.setState({ loading: true })
        let selectedRecord = this.state.selectedRecord
        let inputParamData = {
            // nstoragecategorycode: this.state.selectedRecordFilter["nstoragecategorycode"].value,
            nsamplestoragelocationcode: this.state.masterData.selectedSampleStorageLocation.nsamplestoragelocationcode,
            // nsamplestorageversioncode: this.state.selectedRecordFilter["nsamplestorageversioncode"].value,
            userinfo: this.props.Login.userInfo,
        }

        let urlArray = [];
        const url1 = rsapi().post("samplestoragelistpreperation/addSampleStorageMapping", inputParamData);

        const url2 = rsapi().post("product/getProduct",
            { 'userinfo': this.props.Login.userInfo });

        const url3 = rsapi().post("containertype/getContainerType",
            { 'userinfo': this.props.Login.userInfo });

        urlArray = [url1, url2];
        Axios.all(urlArray)
            .then(response => {
                const storageMappingMap = constructOptionList(response[0].data['samplestoragecontainerpath'] || [],
                    "nsamplestoragecontainerpathcode",
                    "scontainerpath", undefined, undefined, true);
                const storageMappingMapList = storageMappingMap.get("OptionList");
                let containerStructure = response[0].data['containerStructure'];

                const containerTypeMap = constructOptionList(response[0].data['containerType'] || [],
                    "ncontainertypecode",
                    "scontainertype", undefined, undefined, true);
                const containerTypeList = containerTypeMap.get("OptionList");


                const directionmasterMap = constructOptionList(response[0].data['directionmaster'] || [],
                    "ndirectionmastercode",
                    "sdirection", undefined, undefined, true);
                const directionmasterList = directionmasterMap.get("OptionList");

                const containerstructureMap = constructOptionList(response[0].data['containerStructure']
                    || [],
                    "ncontainerstructurecode",
                    "scontainerstructurename", undefined, undefined, true);
                const containerstructureList = containerstructureMap.get("OptionList");

                const productMap = constructOptionList(response[1].data['Product'] || [],
                    "nproductcode",
                    "sproductname", undefined, undefined, true);
                const productList = productMap.get("OptionList");

                this.setState({
                    openModal: true,
                    selectedRecord: {
                        ...selectedRecord,
                        storageMappingMapOptions: storageMappingMapList,
                        productOptions: productList,
                        containerTypeOptions: containerTypeList,
                        directionmasterOptions: directionmasterList,
                        // ncontainertypecode: containerTypeList[0],
                        // containerStructureOptions: containerstructureList,
                        // ncontainerstructurecode: containerstructureList[0],
                        nrow: containerStructure.length > 0 ? containerStructure[0].nrow : 1,
                        ncolumn: containerStructure.length > 0 ? containerStructure[0].ncolumn : 1,
                        isInitialRender: true

                    },
                    openSpreadSheet: false,
                    operation: 'create',
                    loading: false
                });
            }).catch(error => {
                if (error.response?.status === 429) {
                    toast.warn(this.props.intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
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
                } else {
                    toast.warn(error.response.data);
                }
                this.setState({
                    loading: false
                });
            });
    }
    // ATE234-janakumar-ALPDJ21-37 Product Enhancement for sample storage & Repository. -- Start
    getSiteRecords(comboData) {
        let inputParamData = {}
        this.setState({ loading: true })
        inputParamData = {
            selectedSiteCode: comboData.value,
            userinfo: this.props.Login.userInfo
        }
        let urlArray = [];
        const url1 = rsapi().post("samplestoragelistpreperation/getSiteBasedInstrument", inputParamData);

        urlArray = [url1];
        Axios.all(urlArray)
            .then(response => {
                let fields = this.state.fields;
                let selectedRecord = this.state.selectedRecord;
                let masterData = this.state.masterData;

                masterData["samplestoragelistpreperation"] = [];
                selectedRecord["filterQueryTreeStr"] = [];
                selectedRecord["filterquery"] = [];

                //ATE234 Janakumar ALPDJ21-37 Product Enhancement for sample storage & Repository. -Start
                if (parseInt(this.props.Login.settings[84]) === transactionStatus.YES) {
                    const queryBuilderFreezer = response?.[0]?.data?.lstInstrument?.map(item => ({
                        value: item.ninstrumentcode,
                        title: item.sinstrumentid
                    })) || [];

                    fields = {
                        ...fields,
                        ninstrumentcode: {
                            label: this.props.intl.formatMessage({ id: "IDS_STROAGENAMEORID" }),
                            type: "select",
                            valueSources: ["value"],
                            fieldSettings: {
                                listValues: queryBuilderFreezer
                            }
                        }
                    };
                }

                let queryBuilderFreezer = response?.[0]?.data?.sampleType?.map(item => ({
                    value: item.nsampletypecode,
                    title: item.sproductname
                })) || [];
                fields = {
                    ...fields,
                    nsampletypecode: {
                        label: this.props.intl.formatMessage({ id: "IDS_SAMPLETYPE" }),
                        type: "select",
                        valueSources: ["value"],
                        fieldSettings: {
                            listValues: queryBuilderFreezer
                        }
                    }
                };

                queryBuilderFreezer = response?.[0]?.data?.sampleStorageLocation?.map(item => ({
                    value: item.nsamplestoragelocationcode,
                    title: item.ssamplestoragelocationname
                })) || [];
                fields = {
                    ...fields,
                    nsamplestoragelocationcode: {
                        label: this.props.intl.formatMessage({ id: "IDS_STORAGESTRUCTURENAME" }),
                        type: "select",
                        valueSources: ["value"],
                        fieldSettings: {
                            listValues: queryBuilderFreezer
                        }
                    }
                };

                this.setState({
                    fields, masterData,
                    submittedselectedRecord: [],
                    selectedRecord,
                    selectedSite: { label: comboData.label, value: comboData.value },
                    loading: false
                });

            }).catch(error => {
                if (error.response?.status === 429) {
                    toast.warn(this.props.intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
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
                } else {
                    toast.warn(error.response.data);
                }
                this.setState({
                    loading: false
                });
            });
    }
    // ATE234-janakumar-ALPDJ21-37 Product Enhancement for sample storage & Repository. -- End


    getprojectbarcodeconfig(comboData) {
        let inputParamData = {}
        this.setState({ loading: true })
        inputParamData = {
            nprojecttypecode: comboData.value,
            userinfo: this.props.Login.userInfo
        }
        let urlArray = [];
        const url1 = rsapi().post("samplestoragelistpreperation/getProjectbarcodeconfig", inputParamData);

        urlArray = [url1];
        Axios.all(urlArray)
            .then(response => {
                let masterData = this.state.masterData;
                let fields = this.state.fields;
                let submittedselectedRecord = this.state.submittedselectedRecord;
                let queryBuilderFreezer = [];
                const filterSitelist = constructOptionList(response[0].data.lstSite || [], "nsitecode",
                    "ssitename", undefined, undefined, undefined);

                masterData['siteTypeOptions'] = filterSitelist.get("OptionList");
                if (this.state.selectedProjectType.value !== comboData.value) {
                    masterData = {
                        ...masterData,
                        samplestoragelistpreperation: []
                    }
                    submittedselectedRecord = {}
                }
                let selectedSite = {};
                if (response[0].data.selectedSite !== null) {
                    selectedSite = { label: response[0].data.selectedSite["ssitename"], value: response[0].data.selectedSite["nsitecode"] }
                }


                if (parseInt(this.props.Login.settings[84]) === transactionStatus.YES) {

                    const queryBuilderFreezer = masterData?.lstInstrument?.map(item => ({
                        value: item.ninstrumentcode,
                        title: item.sinstrumentid
                    })) || [];

                    fields = {
                        ...fields,
                        ninstrumentcode: {
                            label: this.props.intl.formatMessage({ id: "IDS_STROAGENAMEORID" }),
                            type: "select",
                            valueSources: ["value"],
                            fieldSettings: {
                                listValues: queryBuilderFreezer
                            }
                        }
                    };

                    const queryBuilderFreezerSampleType = masterData?.sampleType?.map(item => ({
                        value: item.nsampletypecode,
                        title: item.sproductname
                    })) || [];
                    fields = {
                        ...fields,
                        nsampletypecode: {
                            label: this.props.intl.formatMessage({ id: "IDS_SAMPLETYPE" }),
                            type: "select",
                            valueSources: ["value"],
                            fieldSettings: {
                                listValues: queryBuilderFreezerSampleType
                            }
                        }
                    };
                } else {

                    let queryBuilderFreezer = masterData?.sampleType?.map(item => ({
                        value: item.nproductcode,
                        title: item.sproductname
                    })) || [];
                    fields = {
                        ...fields,
                        nproductcode: {
                            label: this.props.intl.formatMessage({ id: "IDS_SAMPLETYPE" }),
                            type: "select",
                            valueSources: ["value"],
                            fieldSettings: {
                                listValues: queryBuilderFreezer
                            }
                        }
                    };

                }

                if (response?.[0]?.data?.sampleStorageLocation !== undefined) {
                    queryBuilderFreezer = response?.[0]?.data?.sampleStorageLocation?.map(item => ({
                        value: item.nsamplestoragelocationcode,
                        title: item.ssamplestoragelocationname
                    })) || [];
                    fields = {
                        ...fields,
                        nsamplestoragelocationcode: {
                            label: this.props.intl.formatMessage({ id: "IDS_STORAGESTRUCTURENAME" }),
                            type: "select",
                            valueSources: ["value"],
                            fieldSettings: {
                                listValues: queryBuilderFreezer
                            }
                        }
                    };
                }


                this.setState({
                    masterData,
                    submittedselectedRecord,
                    selectedProjectTypeList: sortData(response[0].data.selectedProjectTypeList),
                    selectedProjectType: { label: comboData.label, value: comboData.value },
                    selectedSite: selectedSite,
                    selectedRecord: {
                        nprojecttypecode: { label: comboData.label, value: comboData.value },
                    },
                    fields,
                    loading: false
                });
            }).catch(error => {
                if (error.response?.status === 429) {
                    toast.warn(this.props.intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
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
                } else {
                    toast.warn(error.response.data);
                }
                this.setState({
                    loading: false
                });
            });
    }

    getContainerStructure(inputData, fieldName, comboData) {
        let inputParamData = {}
        this.setState({ loading: true })
        inputParamData = {
            ncontainertypecode: comboData.value,
            userinfo: inputData.userinfo
        }
        let urlArray = [];
        const url1 = rsapi().post("samplestoragelistpreperation/getContainerStructure", inputParamData);

        urlArray = [url1];
        Axios.all(urlArray)
            .then(response => {
                let { containerStructureOptions, selectedRecord } = this.state

                let containerStructureList = constructOptionList(response[0].data.containerStructure || [], "ncontainerstructurecode",
                    "scontainerstructurename", undefined, undefined, undefined);
                containerStructureOptions = containerStructureList.get("OptionList");
                selectedRecord = {
                    ...selectedRecord,
                    nrow: containerStructureOptions.length > 0 ?
                        containerStructureOptions[0].item.nrow : 1,
                    ncolumn: containerStructureOptions.length > 0 ?
                        containerStructureOptions[0].item.ncolumn : 1,
                    ncontainerstructurecode: containerStructureOptions.length > 0 ?
                        containerStructureOptions[0] : [],
                    containerStructureOptions: containerStructureOptions.length > 0 ?
                        [...containerStructureOptions] : [],
                }

                this.setState({

                    selectedRecord: {
                        ...selectedRecord,
                        [fieldName]: comboData
                    },
                    loading: false
                });
            }).catch(error => {
                if (error.response?.status === 429) {
                    toast.warn(this.props.intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
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
                } else {
                    toast.warn(error.response.data);
                }
                this.setState({
                    loading: false
                });
            });
    }
    onSampleMappingSaveClick = () => {
        const mandatoryFields = this.state.openSpreadSheet ? [] : this.state.selectedRecord["nneedposition"] === undefined ||
            this.state.selectedRecord["nneedposition"] === false ? [
            {
                "idsName": "IDS_SAMPLESTORAGEMAPPING", "dataField": "nsamplestoragecontainerpathcode",
                "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox"
            },
            {
                "idsName": "IDS_PRODUCT",
                "dataField": "nproductcode", "mandatoryLabel":
                    "IDS_SELECT", "controlType": "selectbox"
            },
            {
                "idsName": "IDS_AVAILABLESPACE",
                "dataField": "nquantity", "mandatoryLabel":
                    "IDS_ENTER", "controlType": "selectbox"
            }
        ] : [
            {
                "idsName": "IDS_SAMPLESTORAGEMAPPING", "dataField": "nsamplestoragecontainerpathcode",
                "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox"
            },
            {
                "idsName": "IDS_PRODUCT",
                "dataField": "nproductcode", "mandatoryLabel":
                    "IDS_SELECT", "controlType": "selectbox"
            }
            ,
            {
                "idsName": "IDS_CONTAINERTYPE",
                "dataField": "ncontainertypecode", "mandatoryLabel":
                    "IDS_SELECT", "controlType": "selectbox"
            },
            {
                "idsName": "IDS_CONTAINERSTRUCTURENAME",
                "dataField": "ncontainerstructurecode", "mandatoryLabel":
                    "IDS_SELECT", "controlType": "selectbox"
            },
            {
                "idsName": "IDS_DIRECTION",
                "dataField": "ndirectionmastercode", "mandatoryLabel":
                    "IDS_ENTER", "controlType": "selectbox"
            },
            {
                "idsName": "IDS_AVAILABLESPACE",
                "dataField": "nquantity", "mandatoryLabel":
                    "IDS_ENTER", "controlType": "selectbox"
            }
        ]
        onSaveMandatoryValidation(this.state.selectedRecord, mandatoryFields,
            this.onSaveClick)
    }
    dataStateChange = (event) => {
        this.setState({
            dataStateChange: event.dataState
        });
    }

    approveSampleStorageMapping = (event) => {
        let inputParamData = {}
        this.setState({ loading: true })
        inputParamData = {
            nsamplestoragelocationcode: this.state.masterData.selectedSampleStorageLocation.nsamplestoragelocationcode,
            userinfo: this.props.Login.userInfo
        }
        let urlArray = [];
        const url1 = rsapi().post("samplestoragelistpreperation/approveSampleStorageMapping", inputParamData);

        urlArray = [url1];
        Axios.all(urlArray)
            .then(response => {
                this.setState({
                    masterData: {
                        ...this.state.masterData,
                        ...response[0].data
                    },
                    loading: false
                });
            }).catch(error => {
                if (error.response?.status === 429) {
                    toast.warn(this.props.intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
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
                } else {
                    toast.warn(error.response.data);
                }
                this.setState({
                    loading: false
                });
            });
    }
    getSelectedBarcodeData(inputParam) {
        this.setState({ loading: true })
        let selectedRecord = this.state.selectedRecord || {};
        let urlArray = [];
        const url1 = rsapi().post("/samplestoragelistpreperation/getSelectedBarcodeData", {
            nprojecttypecode: this.state.selectedProjectType.value,
            spositionvalue: inputParam.spositionvalue
        });
        urlArray = [url1];
        Axios.all(urlArray)
            .then(response => {
                this.setState({
                    selectedBarcodeValue: { ...response[0].data['selectedBarcodeValue'] },
                    loading: false
                })
            })
            .catch(error => {
                this.setState({
                    loading: false
                });
                if (error.response?.status === 429) {
                    toast.warn(this.props.intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
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
                    toast.info(error.response.data.rtn);
                }

            })
    }
    //ALPD-4635
    checkFilterIsEmptyQueryBuilder = (treeData) => {
        //this condition is handle for bulk record only 
        if (this.props.Login && this.props.Login.settings && parseInt(this.props.Login.settings['69']) === transactionStatus.YES) {
            let isFilterEmpty = true;
            return isFilterEmpty;
        } else {
            let ParentItem = { ...treeData };
            let isFilterEmpty = false;
            let childArray = ParentItem.children1;
            if (childArray && childArray.length > 0 && childArray !== undefined) {
                for (var i = 0; i < childArray.length; i++) {
                    let childData = childArray[i]
                    if (!childData.hasOwnProperty('children1')) {
                        if (childData.properties.operator !== "is_empty"
                            && childData.properties.operator !== "is_not_empty"
                            && childData.properties.operator !== "is_null"
                            && childData.properties.operator !== "is_not_null") {
                            isFilterEmpty = true;
                            return isFilterEmpty;
                        }
                    } else {
                        if (childData) {
                            ParentItem = this.checkFilterIsEmptyQueryBuilder(childData)
                            if (!ParentItem) {
                                return ParentItem;
                            }
                        }
                    }
                }
            }
            return isFilterEmpty;
        }
    }

    getDynamicFilterExecuteData(nflag) {
        let selectedRecord = this.state.selectedRecord || {};
        let selectedProjectType = this.state?.selectedProjectType?.value;
        if (nflag === 2 ? true : (selectedRecord.filterquery && selectedRecord.filterquery !== "") && selectedProjectType !== null && selectedProjectType !== undefined) {
            let isFilterEmpty = this.checkFilterIsEmptyQueryBuilder(selectedRecord.filterQueryTreeStr);
            if (isFilterEmpty) {
                //ATE234 Janakumar ALPDJ21-37 Product Enhancement for sample storage & Repository. -- Start
                let nsitecode = this.state?.selectedSite?.value ?? null;
                let passNsitecode = nsitecode !== null ? ` and nsitecode=${nsitecode}` : '';
                //let projectType = this.state.nprojectbasedload === 3 ? "" : " and nprojecttypecode=" + this.state.selectedProjectType.value;
                let projectType = selectedProjectType === 0 ? "" : " and nprojecttypecode=" + this.state.selectedProjectType.value;

                this.setState({ loading: true })
                let obj = {// ...inputParam.component, 
                    label: 'samplestoragelistpreperation', valuemember: 'nsamplestoragetransactioncode',
                    filterquery: nflag === 2 ?
                        this.state.submittedselectedRecord.filterquery + " and nprojecttypecode=" + this.state.selectedProjectType.value + passNsitecode
                        :
                        selectedRecord.filterquery + projectType + passNsitecode
                    // , source: 'view_samplelistprep_' + this.state.selectedProjectType.value
                    , source: 'view_samplelistprep_'
                    , userinfo: this.props.Login.userInfo,
                    nprojecttypecode: this.state.selectedProjectType.value
                }
                let urlArray = [];
                const url1 = rsapi().post("/samplestoragelistpreperation/getdynamicfilterexecutedata", obj);
                urlArray = [url1];
                Axios.all(urlArray)
                    .then(response => {
                        let masterData = this.state.masterData
                        masterData = { ...masterData, ...response[0].data }
                        this.setState({
                            masterData: { ...masterData },
                            loading: false,
                            openModal: false,
                            isFilterPopup: false,
                            submittedselectedRecord: nflag === 2 ?
                                { ...this.state.submittedselectedRecord }
                                :
                                { ...selectedRecord }
                            ,
                            dataStateChange: {
                                take: 10,
                                skip: 0
                            },
                            selectedRecord: {},
                            displayQuery: this.state.tree ? QbUtils.queryString(this.state.tree, this.state.config, true) : ""
                        })
                    })
                    .catch(error => {
                        this.setState({
                            loading: false
                        });
                        if (error.response?.status === 429) {
                    toast.warn(this.props.intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
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
                            toast.info(error.response.data.rtn);
                        }

                    })
            } else {
                toast.warn(this.props.intl.formatMessage({ id: "IDS_PROVIDEONEMOREFILTERDATAWITHNOTNULLOPERATOR" }));
            }
        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTAFILTER" }));

        }
    }
    // getDynamicFilterExecuteData(nflag) {
    //     this.setState({ loading: true })
    //     let selectedRecord = this.state.selectedRecord || {};
    //     let obj = {// ...inputParam.component, 
    //         label: 'samplestoragelistpreperation', valuemember: 'nsamplestoragetransactioncode',
    //         filterquery:   
    //         selectedRecord.filterquery, source: 'view_sampleretrieval', userinfo: this.props.Login.userInfo
    //     }
    //     let urlArray = [];
    //     const url1 = rsapi().post("/samplestoragelistpreperation/getdynamicfilterexecutedata", obj);
    //     urlArray = [url1];
    //     Axios.all(urlArray)
    //         .then(response => {
    //             console.log(response)
    //             let masterData = this.state.masterData
    //             masterData = { ...masterData, ...response[0].data }
    //             this.setState({
    //                 masterData: { ...masterData },
    //                 loading: false,
    //                 openModal: false,
    //                 submittedselectedRecord: nflag === 2 ?
    //                     { ...this.state.submittedselectedRecord }
    //                     :
    //                     { ...selectedRecord }
    //                 ,
    //                 isFilterPopup: false,
    //                 selectedRecord: {}
    //             })
    //         })
    //         .catch(error => {
    //             this.setState({
    //                 loading: false
    //             });
    //             if (error.response?.status === 429) {
    //                toast.warn(intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
    //                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } });
    //            } else if (error.response?.status === 401 || error.response?.status === 403) {
    //      dispatch({
    //        type: UN_AUTHORIZED_ACCESS,
    //                    payload: {
    //                        navigation: 'forbiddenaccess',
    //                        loading: false,
    //                        responseStatus: error.response.status
    //                    }
    //        payload: {
    //          navigation: 'forbiddenaccess',
    //          loading: false,
    //        }
    //      });
    //    } else if (error.response.status === 500) {
    //                 toast.error(error.message);
    //             }
    //             else {
    //                 toast.info(error.response.data.rtn);
    //             }

    //         })
    // }

    fetchRecord = (data) => {
        this.setState({ loading: true })
        let selectedRecord = this.state.selectedRecord
        let inputParamData = {
            nsamplestoragelocationcode: this.state.masterData.selectedSampleStorageLocation.nsamplestoragelocationcode,
            userinfo: this.props.Login.userInfo,
        }
        let urlArray = [];
        const url1 = rsapi().post("samplestoragelistpreperation/addSampleStorageMapping", inputParamData);

        const url2 = rsapi().post("product/getProduct",
            { 'userinfo': this.props.Login.userInfo });

        const url3 = rsapi().post("samplestoragelistpreperation/getEditSampleStorageMapping",
            { 'nsamplestoragemappingcode': data.nsamplestoragemappingcode, 'userinfo': this.props.Login.userInfo });

        urlArray = [url1, url2, url3];
        Axios.all(urlArray)
            .then(response => {
                const storageMappingMap = constructOptionList(response[0].data['samplestoragecontainerpath'] || [],
                    "nsamplestoragecontainerpathcode",
                    "scontainerpath", undefined, undefined, true);
                const storageMappingMapList = storageMappingMap.get("OptionList");
                let containerStructure = response[0].data['containerStructure'];

                const containerTypeMap = constructOptionList(response[0].data['containerType'] || [],
                    "ncontainertypecode",
                    "scontainertype", undefined, undefined, true);
                const containerTypeList = containerTypeMap.get("OptionList");

                const directionmasterMap = constructOptionList(response[0].data['directionmaster'] || [],
                    "ndirectionmastercode",
                    "sdirection", undefined, undefined, true);
                const directionmasterList = directionmasterMap.get("OptionList");


                const containerstructureMap = constructOptionList(response[2].data['containerStructure']
                    || [],
                    "ncontainerstructurecode",
                    "scontainerstructurename", undefined, undefined, true);
                const containerstructureList = containerstructureMap.get("OptionList");

                const productMap = constructOptionList(response[1].data['Product'] || [],
                    "nproductcode",
                    "sproductname", undefined, undefined, true);
                const productList = productMap.get("OptionList");

                const editedObject = response[2].data.editsampleStorageMapping;

                storageMappingMapList.unshift({ label: editedObject.scontainerpath, value: editedObject.nsamplestoragecontainerpathcode })
                selectedRecord = {
                    ndirectionmastercode: { label: editedObject.sdirection, value: editedObject.ndirectionmastercode },
                    nsamplestoragecontainerpathcode: { label: editedObject.scontainerpath, value: editedObject.nsamplestoragecontainerpathcode },
                    nproductcode: { label: editedObject.sproductname, value: editedObject.nproductcode },
                    ncontainertypecode: { label: editedObject.scontainertype, value: editedObject.ncontainertypecode },
                    ncontainerstructurecode: { label: editedObject.scontainerstructurename, value: editedObject.ncontainerstructurecode },
                    nneedposition: editedObject.nneedposition === 3 ? true : false,
                    directionmasterOptions: directionmasterList,
                    nquantity: editedObject.nquantity,
                    nrow: editedObject.nrow,
                    ncolumn: editedObject.ncolumn,
                    nsamplestoragemappingcode: editedObject.nsamplestoragemappingcode
                }
                this.setState({
                    openSpreadSheet: false,
                    openModal: true,
                    selectedRecord: {
                        ...selectedRecord,
                        storageMappingMapOptions: storageMappingMapList,
                        productOptions: productList,
                        containerTypeOptions: containerTypeList,
                        containerStructureOptions: containerstructureList,
                        isInitialRender: true
                    },
                    operation: 'update',
                    loading: false
                });
            }).catch(error => {
                if (error.response?.status === 429) {
                    toast.warn(this.props.intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
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
                } else {
                    toast.warn(error.response.data);
                }
                this.setState({
                    loading: false
                });
            });
    }
    // Actions End
    retrievalType = () => {
        let retrievalType = this.state.retrievalType;
        if (retrievalType === 1) {
            retrievalType = 2;
        } else {
            retrievalType = 1;
        }
        this.setState({ retrievalType: retrievalType })
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

    shouldComponentUpdate(nextProps, nextState) {
        if (this.state.openModal && nextState.isInitialRender === false &&
            (nextState.selectedRecord !== this.state.selectedRecord)) {
            return false;
        } else if (this.state.openModal && nextState.isInitialRender === false &&
            (nextState.sheetData !== this.state.sheetData)) {
            return false;
        } else {
            return true;
        }
    }
    handlePageChangeFilter = (event) => {
        this.setState({ kendoSkip: event.skip, kendoTake: event.take });
    };
    onChange = (immutableTree, config) => {
        let selectedRecord = this.state.selectedRecord || {};
        selectedRecord["tree"] = immutableTree;
        selectedRecord["config"] = config;
        selectedRecord["filterQueryTreeStr"] = QbUtils.getTree(immutableTree);
        selectedRecord['filterquery'] = QbUtils.sqlFormat(immutableTree, config);
        this.setState({ tree: immutableTree, config: config, selectedRecord: selectedRecord });

    };
    // cellRender(tdElement, cellProps) {

    //     if (cellProps.rowType === "groupFooter") {
    //         console.log('cellProps.field', cellProps)
    //         if (cellProps.dataItem.field === "ssamplestoragelocationname") {
    //             console.log('tdElement', tdElement, 'cellProps', cellProps)
    //             return (
    //                 <td aria-colindex={cellProps.columnIndex} role={"gridcell"}>
    //                     Sum: {cellProps.dataItem.aggregates.navailablespace.sum}
    //                 </td>
    //             );
    //         }
    //     }
    //     return tdElement;
    // }
    // handleGroupChange = (event) => {
    //     const newDataState = this.processWithGroups(this.state.masterData.samplestoragelistpreperation || [], this.state.dataStateChange, event.group);
    //     this.setState({
    //         masterData: { ...this.state.masterData, samplestoragelistpreperation: newDataState },
    //         group: event.group,
    //     });
    // };
    // processWithGroups = (data, group) => {
    //     const newDataState = groupBy(data, group);
    //     return newDataState;
    // };
    processWithGroups = (data, dataState) => {
        const aggregates = [
            {
                field: "navailablespace",
                aggregate: "sum",
            }
        ];
        const groups = dataState.group;
        if (groups) {
            groups.map((group) => (group.aggregates = aggregates));
        }
        dataState.group = groups;
        const newDataState = process(data, dataState);
        // setGroupIds({
        //     data: newDataState.data,
        //     group: dataState.group,
        // });
        return newDataState;
    };
    gridfillingColumn(data) {
        //  const tempArray = [];
        // const temparray = data && data.map((option) => {
        //     return { "idsName": option.sfieldname, "dataField": option.sfieldname, "width": "200px" };
        // });
        // return temparray;
        let temparray1 = [];

        if (this.props.Login.settings && parseInt(this.props.Login.settings[84]) === transactionStatus.YES) {
            temparray1 = [{ "idsName": "IDS_REPOSITORYID", "dataField": "spositionvalue", "width": "200px", "staticField": true, "NeedFilter": true },
            { "idsName": "IDS_STROAGENAMEORID", "dataField": "sinstrumentid", "width": "200px", "staticField": true, "NeedFilter": false },
            { "idsName": "IDS_LOCATIONCODE", "dataField": "slocationcode", "width": "200px", "staticField": true, "NeedFilter": true },
            { "idsName": "IDS_PARENTSAMPLECODE", "dataField": "sparentsamplecode", "width": "200px", "staticField": true, "NeedFilter": true },
            { "idsName": "IDS_COHORTNUMBER", "dataField": "ncohortno", "width": "200px", "staticField": true, "NeedFilter": false },
            { "idsName": "IDS_SUBJECTID", "dataField": "ssubjectid", "width": "200px", "staticField": true, "NeedFilter": true },
            { "idsName": "IDS_BIOSAMPLETYPE", "dataField": "sproductname", "width": "200px", "staticField": false, "NeedFilter": false },
            { "idsName": "IDS_VOLUMEµL", "dataField": "sqty", "width": "200px", "staticField": true, "NeedFilter": false },
            { "idsName": "IDS_DISEASE", "dataField": "sdiseasename", "width": "200px", "staticField": true, "NeedFilter": false },
            { "idsName": "IDS_CASETYPE", "dataField": "scasetype", "width": "200px", "staticField": true, "NeedFilter": false }
                //{ "idsName": "IDS_SAMPLEACCESABLE", "dataField": "ssampleaccesable", "width": "200px", "staticField": false, "NeedFilter": false },
                //{ "idsName": "IDS_THIRDPARTYSHARABLE", "dataField": "sthirdpartysharable", "width": "200px", "staticField": false, "NeedFilter": false }
            ];

        } else {
            temparray1 = [{ "idsName": "IDS_SAMPLEID", "dataField": "spositionvalue", "width": "200px", "staticField": true, "NeedFilter": true },
            //  { "idsName": "IDS_STROAGENAMEORID", "dataField": "ssamplestoragelocationname", "width": "200px", "staticField": true, "NeedFilter": true },
            { "idsName": "IDS_SAMPLETYPE", "dataField": "sproductname", "width": "200px", "staticField": true, "NeedFilter": true },
            { "idsName": "IDS_PATHWITHPOSITION", "dataField": "scontainerpathwithposition", "width": "500px", "staticField": true, "NeedFilter": true },
            { "idsName": "IDS_CONTAINERID", "dataField": "sboxid", "width": "200px", "staticField": true, "NeedFilter": true },
            // { "idsName": "IDS_POSITION", "dataField": "sposition", "width": "200px", "staticField": true },
            { "idsName": "IDS_QUANTITY", "dataField": "nquantity", "width": "200px", "staticField": true, "NeedFilter": false },
            { "idsName": "IDS_UNIT", "dataField": "sunitname", "width": "200px", "staticField": true, "NeedFilter": false }];

        }

        const temparray2 = data && data.map((option) => {
            return { "idsName": option.sfieldname, "dataField": option.sfieldname, "width": "200px" };
        });
        const newArray = [...temparray1, ...temparray2]
        return newArray;
    }
    render() {
        const addId = this.state.controlMap.has("Add samplestoragelistpreperation") && this.state.controlMap.get("Add samplestoragelistpreperation").ncontrolcode;
        const editId = this.state.controlMap.has("Edit SampleStorageLocation") && this.state.controlMap.get("Edit SampleStorageLocation").ncontrolcode;
        const deleteId = this.state.controlMap.has("Delete SampleStorageLocation") && this.state.controlMap.get("Delete SampleStorageLocation").ncontrolcode;
        const copyId = this.state.controlMap.has("Copy SampleStorageLocation") && this.state.controlMap.get("Copy SampleStorageLocation").ncontrolcode;
        const approveId = this.state.controlMap.has("Approve SampleStorageLocation") && this.state.controlMap.get("Approve SampleStorageLocation").ncontrolcode;

        const extractedColumnList = this.state.selectedProjectTypeList ? this.gridfillingColumn(this.state.selectedProjectTypeList) : [];

        // ATE234-janakumar-ALPDJ21-37 Product Enhancement for sample storage & Repository. -- Start 
        let fields = {};
        let tempfields = this.state.fields;
        if (extractedColumnList.length > 0) {

            if (extractedColumnList.length > 0) {


                extractedColumnList.forEach(field => {
                    if (field.NeedFilter === true) {
                        if (field.hasOwnProperty("staticField")) {
                            fields = {
                                ...fields,
                                [field.dataField]: {
                                    label: this.props.intl.formatMessage({ id: field.idsName }),
                                    type: "text",
                                    valueSources: ["value", "func"],
                                    mainWidgetProps: {
                                        valueLabel: "Name",
                                        valuePlaceholder: this.props.intl.formatMessage({ id: field.idsName })
                                    }
                                }
                            };
                        } else if (field.dataField === 'ssamplestoragelocationname' && this.state.queryBuilderFreezer.length > 0) {
                            fields = {
                                ...fields,
                                nsamplestoragelocationcode: {
                                    label: this.props.intl.formatMessage({ id: "IDS_STORAGESTRUCTURENAME" }),
                                    type: "select",
                                    valueSources: ["value"],
                                    fieldSettings: {
                                        listValues: this.state.queryBuilderFreezer
                                    }
                                }
                            };
                        } else if (field.dataField === 'sproductname' && this.state.queryBuilderFreezer.length > 0) {
                            if (this.props.Login.settings && parseInt(this.props.Login.settings[84]) === transactionStatus.YES) {
                                fields = {
                                    ...fields,
                                    nsampletypecode: {
                                        label: this.props.intl.formatMessage({ id: "IDS_SAMPLETYPE" }),
                                        type: "select",
                                        valueSources: ["value"],
                                        fieldSettings: {
                                            listValues: this.state.queryBuilderFreezer
                                        }
                                    }
                                };
                            } else {
                                fields = {
                                    ...fields,
                                    nproductcode: {
                                        label: this.props.intl.formatMessage({ id: "IDS_SAMPLETYPE" }),
                                        type: "select",
                                        valueSources: ["value"],
                                        fieldSettings: {
                                            listValues: this.state.queryBuilderFreezer
                                        }
                                    }
                                };
                            }
                        }
                        // else if (field.dataField === 'ssampleaccesable' && this.state.queryBuilderFreezer.length > 0) {
                        //     fields = {
                        //         ...fields,
                        //         nissampleaccesable: {
                        //             label: this.props.intl.formatMessage({ id: "IDS_SAMPLEACCESABLE" }),
                        //             type: "select",
                        //             valueSources: ["value"],
                        //             fieldSettings: {
                        //                 listValues: queryBuilderFreezer
                        //             }
                        //         }
                        //     };
                        // } else if (field.dataField === 'sthirdpartysharable' && this.state.queryBuilderFreezer.length > 0) {
                        //     fields = {
                        //         ...fields,
                        //         nisthirdpartysharable: {
                        //             label: this.props.intl.formatMessage({ id: "IDS_THIRDPARTYSHARABLE" }),
                        //             type: "select",
                        //             valueSources: ["value"],
                        //             fieldSettings: {
                        //                 listValues: queryBuilderFreezer
                        //             }
                        //         }
                        //     };
                        // }
                        else {
                            fields = {
                                ...fields,
                                [field.dataField]: {
                                    label: field.dataField,
                                    type: "text",
                                    valueSources: ["value", "func"],
                                    mainWidgetProps: {
                                        valueLabel: "Name",
                                        valuePlaceholder: field.dataField
                                    }
                                }
                            };
                        }
                    }
                });

                // Add tempfields at the end
                const newFields = { ...fields, ...tempfields };
                fields = newFields;
            }

            // extractedColumnList.map(field => {
            //       field.hasOwnProperty("staticField") ?
            //         fields = {
            //             ...fields,
            //             [field.dataField]: {
            //                 "label": this.props.intl.formatMessage({
            //                     id: field.idsName,
            //                 })
            //                 ,
            //                 "type": "text",
            //                 "valueSources": ["value", "func"],

            //                 "mainWidgetProps": {
            //                     "valueLabel": "Name",
            //                     "valuePlaceholder": this.props.intl.formatMessage({
            //                         id: field.idsName
            //                     })
            //                 }
            //             }
            //         }
            //         :
            //         field.dataField === 'ssamplestoragelocationname' && this.state.queryBuilderFreezer.length > 0 ?
            //             fields = {
            //                 ...fields,
            //                 'nsamplestoragelocationcode': {
            //                     "label": this.props.intl.formatMessage({
            //                         id: "IDS_STORAGESTRUCTURENAME",
            //                     }),
            //                     "type": "select",
            //                     "valueSources": ["value"],
            //                     "fieldSettings": {
            //                         "listValues": this.state.queryBuilderFreezer
            //                     }
            //                 }
            //             }
            //             :
            //             field.dataField === 'sproductname' && this.state.queryBuilderFreezer.length > 0 ?

            //                 this.props.Login.settings
            //                     && parseInt(this.props.Login.settings[84]) === transactionStatus.YES ? fields = {
            //                         ...fields,
            //                         'nsampletypecode': {
            //                             "label": this.props.intl.formatMessage({
            //                                 id: "IDS_SAMPLETYPE",
            //                             }),
            //                             "type": "select",
            //                             "valueSources": ["value"],
            //                             "fieldSettings": {
            //                                 "listValues": this.state.queryBuilderFreezer
            //                             }
            //                         }
            //                     } : fields = {
            //                         ...fields,
            //                         'nproductcode': {
            //                             "label": this.props.intl.formatMessage({
            //                                 id: "IDS_SAMPLETYPE",
            //                             }),
            //                             "type": "select",
            //                             "valueSources": ["value"],
            //                             "fieldSettings": {
            //                                 "listValues": this.state.queryBuilderFreezer
            //                             }
            //                         }
            //                     }
            //                 :
            //                 fields = {
            //                     ...fields,
            //                     ['"' + field.dataField + '"']: {
            //                         "label": field.dataField
            //                         ,
            //                         "type": "text",
            //                         "valueSources": ["value", "func"],

            //                         "mainWidgetProps": {
            //                             "valueLabel": "Name",
            //                             "valuePlaceholder": field.dataField
            //                         }
            //                     }
            //                 }
            // });
            // ATE234-janakumar-ALPDJ21-37 Product Enhancement for sample storage & Repository. -- Start 
            //const newFields = { ...fields, ...tempfields };
            //fields = newFields;
        }
        const filterParam = {
            inputListName: "sampleStorageLocation", selectedObject: "selectedSampleStorageLocation", primaryKeyField: "nsamplestoragelocationcode",
            fetchUrl: "samplestoragelistpreperation/getActiveSampleStorageMappingById",
            fecthInputObject: { userinfo: this.props.Login.userInfo },
            masterData: this.props.Login.masterData,
            searchFieldList: ["ssamplestoragelocationname"]
        };

        const breadCrumbData = this.state.filterData || [];

        const confirmMessage = new ConfirmMessage();
        return (
            <>

                <Preloader loading={this.state.loading} />
                {//this.state.retrievalType === 1 ?
                    <>
                        <ListWrapper className="client-list-content">
                            {
                                <Col md={12}>
                                    <Row>
                                        {/* {this.props.Login.settings && parseInt(this.props.Login.settings[84]) === transactionStatus.YES ?
                                        <Col md={3}>
                                                <Checkbox
                                                    label={this.props.intl.formatMessage({ id: "IDS_LOADIRRESPECTIVEOFFILTER" })}
                                                    type="Checkbox"
                                                    name={"nprojectbasedload"}
                                                    onChange={(event) => this.onInputSetCheckBoxValue(event)}
                                                    placeholder={this.props.intl.formatMessage({ id: "IDS_BIOPROJECT" })}
                                                    defaultValue={this.state?.nprojectbasedload === 3 ? true : false}
                                                    isMandatory={false}
                                                    required={false}
                                                    checked={this.state?.nprojectbasedload === 3}
                                                    style={{ transform: 'scale(0.8)' }}
                                                />
                                            </Col>
                                            : ""} */}

                                        <Col md={3}>
                                            <FormSelectSearch
                                                name={"nprojecttypecode"}
                                                as={"select"}
                                                onChange={(event) => this.onComboChange(event, 'nprojecttypecode')}
                                                formLabel={this.props.intl.formatMessage({ id: this.props.Login.settings && parseInt(this.props.Login.settings[84]) === transactionStatus.YES ? "IDS_BIOPROJECT" : "IDS_PROJECTTYPE" })}
                                                isMandatory={this.state.selectedRecord["nneedposition"]}
                                                //value={this.state?.nprojectbasedload === 3 ? "" : this.state.selectedProjectType ? this.state.selectedProjectType || [] : []}
                                                value={this.state.selectedProjectType ? this.state.selectedProjectType || [] : []}
                                                options={this.state.masterData && this.state.masterData.projectbarcodeconfig || []}
                                                optionId={"value"}
                                                optionValue={"label"}
                                                isMulti={false}
                                                //isDisabled={this.state?.nprojectbasedload === 3 ? true : false}
                                                isDisabled={false}
                                                isSearchable={false}
                                                isClearable={false}
                                            />
                                        </Col>

                                        {/* // ATE234-janakumar-ALPDJ21-37 Product Enhancement for sample storage & Repository. -- Start */}
                                        {this.state.needSiteCombo === true ?
                                            <Col md={3}>
                                                <FormSelectSearch
                                                    name={"nsitecode"}
                                                    as={"select"}
                                                    onChange={(event) => this.onComboChange(event, 'nsitecode')}
                                                    formLabel={this.props.intl.formatMessage({ id: "IDS_SITEDETAILS" })}
                                                    isMandatory={false}
                                                    value={this.state.selectedSite !== undefined ? this.state.selectedSite || [] : []}
                                                    options={this.state.masterData && this.state.masterData.siteTypeOptions || []}
                                                    optionId={"value"}
                                                    optionValue={"label"}
                                                    isMulti={false}
                                                    isDisabled={false}
                                                    isSearchable={false}
                                                    isClearable={false}
                                                />
                                            </Col>
                                            : ""}
                                        {/* // ATE234-janakumar-ALPDJ21-37 Product Enhancement for sample storage & Repository. -- Start */}

                                    </Row>

                                    {this.state.selectedProjectTypeList && <Row>
                                        <Col md={12}><DataGrid
                                            // isDownloadPDFRequired={this.state.masterData && this.state.masterData.samplestoragelistpreperation &&
                                            //     this.processWithGroups(this.state.masterData.samplestoragelistpreperation || [],
                                            //         this.state.dataStateChange ? this.state.dataStateChange : {
                                            //             take: 10,
                                            //             skip: 0
                                            //         }).data.length > 0 ?
                                            //     true : false}
                                            // isDownloadExcelRequired={this.state.masterData && this.state.masterData.samplestoragelistpreperation &&
                                            //     this.processWithGroups(this.state.masterData.samplestoragelistpreperation || [],
                                            //         this.state.dataStateChange ? this.state.dataStateChange : {
                                            //             take: 10,
                                            //             skip: 0
                                            //         }).data.length > 0 ?
                                            //     true : false}
                                            isCustomButton={true}
                                            customButtonlist={[{
                                                label: 'IDS_SEARCH',
                                                id: {},
                                                onClick: () => this.opensearch(),
                                                controlname: 'faSearch'
                                            },
                                            // ALPD 5531 Start Button from export and bulk search Added by Abdul Gaffoor A on 07/03/2025
                                            {
                                                label: 'IDS_EXPORTTEMPLATE',
                                                // id: {},
                                                onClick: () => this.handleExportClick(),
                                                controlname: 'faFileExcel'
                                            },
                                            {
                                                label: 'IDS_BULKSEARCH',
                                                // id: {},
                                                onClick: () => this.handleImportTemplate(),
                                                controlname: 'faFileImport'
                                            }
                                                // ALPD 5531 End
                                            ]}
                                            isRefreshRequired={false}
                                            // onGroupChange={this.handleGroupChange}
                                            primaryKeyField={'nsamplestoragetransactioncode'}
                                            /*data={this.state.masterData &&
                                                this.state.masterData.samplestoragelistpreperation}*/

                                            //ALPD-4767--Vignesh R(29-08-2024)
                                            data={
                                                this.state.masterData && this.state.masterData.samplestoragelistpreperation ? this.state.masterData.samplestoragelistpreperation.map(item => {
                                                    return { ...item, ...JSON.parse(item.jsondata.value) || {} };
                                                }) : []}
                                            /*dataResult={this.state.masterData &&
                                                this.state.masterData.samplestoragelistpreperation ?
                                                process(this.state.masterData.samplestoragelistpreperation || [],
                                                    this.state.dataStateChange ? this.state.dataStateChange : { skip: 0, take: 10 }) : []
                                                // this.processWithGroups(this.state.masterData.samplestoragelistpreperation || [],
                                                //     this.state.dataStateChange ? this.state.dataStateChange : {
                                                //         take: 10,
                                                //         skip: 0
                                                //     })
                                            }*/

                                            //ALPD-4767--Vignesh R(29-08-2024)
                                            dataResult={this.state.masterData &&
                                                this.state.masterData.samplestoragelistpreperation ?
                                                process(this.state.masterData.samplestoragelistpreperation.map(item => {
                                                    return { ...item, ...JSON.parse(item.jsondata.value) };
                                                }) || [],
                                                    this.state.dataStateChange ? this.state.dataStateChange : { skip: 0, take: 10 }) : []
                                                // this.processWithGroups(this.state.masterData.samplestoragelistpreperation || [],
                                                //     this.state.dataStateChange ? this.state.dataStateChange : {
                                                //         take: 10,
                                                //         skip: 0
                                                //     })
                                            }
                                            dataState={this.state.dataStateChange ? this.state.dataStateChange : { skip: 0, take: 10 }}
                                            dataStateChange={this.dataStateChange}
                                            extractedColumnList={extractedColumnList}
                                            controlMap={this.state.controlMap}
                                            userRoleControlRights={this.state.userRoleControlRights}
                                            userInfo={this.props.Login.userInfo}
                                            deleteRecord={this.deleteRecord}
                                            addRecord={() => this.openStorageMapping()}
                                            pageable={true}
                                            scrollable={'scrollable'}
                                            // isComponent={true}
                                            gridHeight={'600px'}
                                            // isActionRequired={true}
                                            isToolBarRequired={true}
                                            //ATE234 Janakumar ALPD-5577 Sample Storage-->while download the pdf, screen getting freezed
                                            isDownloadPDFRequired={false}
                                            isDownloadExcelRequired={true}
                                        // actionIcons={
                                        //     [{
                                        //         title: this.props.intl.formatMessage({ id: "IDS_ADDSAMPLE" }),
                                        //         controlname: "faPenSquare",
                                        //         hidden: false,
                                        //         objectName: "add",
                                        //         onClick: (param) => this.addSample(param, 1)
                                        //     }]}
                                        /> </Col></Row>}
                                    {/* ALPD-5531 added by Abdul 07-Mar-2025 for Handling Export template Click */}
                                    {this.state.export ?
                                        <LocalizationProvider>
                                            <ExcelExport
                                                data={[]}
                                                collapsible={true}
                                                fileName={(this.props.Login.displayName && this.props.Login.displayName)}
                                                ref={(exporter) => {
                                                    this._excelExportHeader = exporter;
                                                }}>
                                                {[...this.state.exportField].map((item) =>
                                                    <ExcelExportColumn
                                                        field={item.dataField} title={this.props.intl.formatMessage({ id: item.idsName })} width={200} />
                                                )

                                                }
                                            </ExcelExport>
                                        </LocalizationProvider > : ""}
                                    {/* ALPD-5531 End */}

                                </Col>


                            }

                        </ListWrapper>

                        {/* < ListWrapper className="client-list-content" ><Row>
                        
                        </Row>
                            <Col md={12}>
                                <Col md={6}>
                                    <Row>
                                        <FormInput
                                            name={'spositionvalue'}
                                            onb
                                            label={this.props.intl.formatMessage({ id: "IDS_POSITIONVALUE" })}
                                            placeholder={this.props.intl.formatMessage({ id: "IDS_POSITIONVALUE" })}
                                            value={this.state.selectedRecord['spositionvalue']
                                                ? this.state.selectedRecord['spositionvalue'] : ""}
                                            maxLength={255}
                                            isDisabled={this.props.isDisabled}
                                            onKeyDown={(event) => this.getSelectedBarcodeData(this.state.selectedRecord)}
                                            onChange={(event) => this.onInputOnChange(event)}
                                        />
                                    </Row>
                                </Col>
                                <Col md={6}>
                                    {this.state.selectedBarcodeValue && <div className="d-flex justify-content-end mr-3">
                                        <Row>
                                            {
                                                extractedColumnList.map((item, index) => {
                                                    return (
                                                        <>
                                                            <Col md={6} key={`specInfo_${index}`}>
                                                                <FormGroup>
                                                                    <FormLabel>{this.props.intl.formatMessage({ id: item.idsName })}</FormLabel>
                                                                    <ReadOnlyText>{this.state.selectedBarcodeValue[item.dataField]}</ReadOnlyText>
                                                                </FormGroup>
                                                            </Col>
                                                        </>
                                                    )
                                                })
                                            }
                                        </Row>
                                    </div>}
                                </Col>
                            </Col>
                            </ListWrapper> */}
                    </>}


                {
                    this.state.openModal &&
                    <SlideOutModal show={this.state.openModal}
                        closeModal={this.closeModal}
                        hideSave={true}
                        showSubmit={true}
                        size={this.state.openSpreadSheet || this.state.isFilterPopup ? 'xl' : ""}
                        operation={""}
                        inputParam={this.props.Login.inputParam}
                        screenName={this.state.isFilterPopup ? "" : this.state.isMultiSampleAdd ? this.props.intl.formatMessage({ id: "IDS_STROAGENAMEORID" })
                            : this.state.importTemplate ? this.props.intl.formatMessage({ id: "IDS_IMPORTSAMPLEID" })
                                : this.state.editedsheetData.scontainerpath}
                        onSaveClick={this.state.isFilterPopup ? this.getDynamicFilterExecuteData.bind(this) : this.state.importTemplate ? this.getImportSampleIDData : this.onSampleMappingSaveClick}
                        esign={this.props.Login.loadEsign}
                        // className={"wide-popup"}

                        validateEsign={this.validateEsign}
                        masterStatus={this.props.Login.masterStatus}
                        updateStore={this.props.updateStore}
                        selectedRecord={this.state.selectedRecord || {}}
                        addComponent={this.state.isFilterPopup ?
                            <FilterQueryBuilder
                                fields={fields}
                                isSampleStorage={true}

                                queryArray={this.state.queryArray}
                                skip={this.state.kendoSkip}
                                take={this.state.kendoTake}
                                onChange={this.onChange}
                                tree={this.props.Login.tree !== undefined ? this.props.Login.tree : this.state.selectedRecord.tree}
                                gridColumns={this.slideList}
                                filterData={this.props.Login.slideResult || []}
                                handlePageChange={this.handlePageChangeFilter}
                                static={true}
                                userInfo={this.props.Login.userInfo}
                                updateStore={this.props.updateStore}
                            />
                            : this.props.Login.loadEsign ?
                                <Esign operation={this.props.Login.operation}
                                    formatMessage={this.props.intl.formatMessage}
                                    onInputOnChange={this.onInputOnChange}
                                    inputParam={this.props.Login.inputParam}
                                    selectedRecord={this.state.selectedRecord || {}}
                                />
                                :
                                this.state.openSpreadSheet ? <>
                                    <MatrixComponent
                                        Rows={this.state.Rows || 1}
                                        userInfo={this.props.Login.userInfo}
                                        columns={this.state.columns || 1}
                                        selectedRecord={this.state.selectedRecord.sheetData || {}}
                                        sheetData={this.state.sheetData || {}}
                                        isMultiSampleAdd={this.state.isMultiSampleAdd}
                                        childSheetDataChange={this.childSheetDataChange}
                                        editedsheetData={this.state.editedsheetData}
                                        multipleSheetData={this.state.masterData &&
                                            this.state.masterData.samplestoragelistpreperation &&
                                            process(this.state.masterData.samplestoragelistpreperation || [],
                                                this.state.dataStateChange ? this.state.dataStateChange : { skip: 0, take: 10 }).data} />
                                </> :
                                    // ALPD-5531 added by Abdul 07-Mar-2025 for Handling Export template Click
                                    this.state.importTemplate ? <>
                                        <AddFile
                                            selectedRecord={this.state.selectedRecord}
                                            onDrop={this.onDropFile}
                                            deleteAttachment={this.deleteAttachment}
                                        />
                                    </> :
                                        // ALPD-5531 End
                                        <AddSampleStorageMapping
                                            operation={this.state.operation}
                                            selectedRecordFilter={this.state.selectedRecordFilter}
                                            onInputChange={(e) => this.onInputChange(e)}
                                            onComboChange={this.onComboChange}
                                            selectedRecord={this.state.selectedRecord || {}}
                                            childDataChange={this.childDataChange}
                                            userInfo={this.props.Login.userInfo}
                                        />
                        }
                    />
                }
            </>
        )
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
const mapStateToProps = (state) => {
    return {
        Login: state.Login
    }
}

export default connect(mapStateToProps, {
    callService, updateStore
})(injectIntl(SampleStorageListPreperation));