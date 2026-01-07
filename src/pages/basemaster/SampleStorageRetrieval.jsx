import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Row, Col, InputGroup } from 'react-bootstrap';
import { toast } from 'react-toastify';
import {
    constructOptionList, convertDateValuetoString, getControlMap, onSaveMandatoryValidation,
    rearrangeDateFormat, searchData, searchJsonData, showEsign, sortData, Lims_JSON_stringify
} from '../../components/CommonScript';
//import SortableTree from 'react-sortable-tree'; 
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import DataGrid from '../../components/data-grid/data-grid.component';
import {

    Utils as QbUtils,
} from "@react-awesome-query-builder/ui";
import SlideOutModal from '../../components/slide-out-modal/SlideOutModal';
import {
    callService, crudMaster, validateEsignCredential, updateStore,
    addComponent
} from '../../actions';
import { DEFAULT_RETURN, UN_AUTHORIZED_ACCESS } from '../../actions/LoginTypes';
import { ListWrapper } from '../../components/client-group.styles';
// import ReactTooltip from 'react-tooltip';
//import { uuid } from 'uuidv4';
import { v4 as uuid } from 'uuid';
import ConfirmMessage from '../../components/confirm-alert/confirm-message.component';
import BreadcrumbComponent from '../../components/Breadcrumb.Component';
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
import AdvFilter from '../../components/AdvFilter';
import DateTimePicker from "../../components/date-time-picker/date-time-picker.component";
import RetrieveOrDiposeSample from '../storagemanagement/RetrieveOrDiposeSample';
import DisposeSample from '../storagemanagement/DisposeSample';
import { ExcelExport, ExcelExportColumn } from '@progress/kendo-react-excel-export';
import { LocalizationProvider } from '@progress/kendo-react-intl';
import BulkRetrieveOrDiposeSample from '../storagemanagement/BulkRetrieveOrDiposeSample';
// import * as XLSX from 'xlsx';
// import { Upload } from '@progress/kendo-react-upload';

class SampleStorageRetrieval extends Component {
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
            retrievalType: 1,
            // extractedColumnList: [   
            //     { "idsName": "IDS_STORAGESTRUCTURE", "dataField": "ssamplestoragelocationname", "width": "200px" },
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

            // added by sujatha v for dispose button to dispose expired samples SWSM-37  12-09-2025 - start  
            addComponentList: [],
            addComponentDataList: [],
            siteSampleExpiry: [],
            //end
            sheetData: {},
            selectedRecordFilter: {},
            // treeData: [{ title: 'Chicken', children: [{ title: 'Egg' }] }],
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
            esignreason: this.props.esignreason,
            dataStateGridChange: {
                take: 10,
                skip: 0
            },
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
        this.state = { ...this.state, 'fields': fields }
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
        //modified by sujatha for dispose button SWSM-37 12-09-2025
        let { filterData, storageCategoryOptions, addComponentDataList,
            selectedRecord, controlMap, addedComponentDataList,
            userRoleControlRights, storageLocationOptions,
            sampleStorageVersionOptions, masterData, selectedRecordFilter,
            fields, selectedProjectType, selectedProjectTypeList,
            breadCrumbdata, openModal, isInitialRender, dynamicfields//,importRetrieveOrDispose,isRetrieveOrDispose 
        } = this.state
        let bool = false;
        ///////////////////////////////
        //  if(this.props.Login.importRetrieveOrDispose){
        if (this.props.Login.openModal !== previousProps.Login.openModal) {
            bool = true;
            openModal = this.props.Login.openModal;
        }
        //}
        if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord) {
            selectedRecord = this.props.Login.selectedRecord || {};
            bool = true;
            isInitialRender = true;
            dynamicfields = [];
            // selectedRecord['spositionvalue'] = "";
            // selectedRecord['scomments'] = ""; 
            selectedRecord['nprojecttypecode'] = previousProps.Login.selectedRecord.nprojecttypecode;

        }
        if (this.props.Login.masterData.sampleStorageLocation !== previousProps.Login.masterData.sampleStorageLocation) {
            let queryBuilderFreezer = [];
            bool = true;
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
            if (selectedRecord["nprojecttypecode"] === undefined) {
                selectedRecord["nprojecttypecode"] = {
                    label: this.props.Login.masterData.selectedProjectType &&
                        this.props.Login.masterData.selectedProjectType.sprojecttypename ?
                        this.props.Login.masterData.selectedProjectType.sprojecttypename : 'NA'
                    , value: this.props.Login.masterData.selectedProjectType && this.props.Login.masterData.selectedProjectType.nprojecttypecode ? this.props.Login.masterData.selectedProjectType.nprojecttypecode : -1
                };

                // selectedRecord["nprojecttypecode"] = {
                //     label: this.state.selectedProjectType.nprojecttypecode.item.sprojecttypename &&
                //     this.state.selectedProjectType.nprojecttypecode.item.sprojecttypename ?
                //    this.state.selectedProjectType.nprojecttypecode.item.sprojecttypename: 'NA'
                //     , value: this.state.selectedProjectType && this.state.selectedProjectType.nprojecttypecode.item.nprojecttypecode
                // }; 

                selectedProjectType = {
                    nprojecttypecode: {
                        label: this.props.Login.masterData.selectedProjectType &&
                            this.props.Login.masterData.selectedProjectType.sprojecttypename ?
                            this.props.Login.masterData.selectedProjectType.sprojecttypename : 'NA'
                        , value: this.props.Login.masterData.selectedProjectType && this.props.Login.masterData.selectedProjectType.nprojecttypecode ? this.props.Login.masterData.selectedProjectType.nprojecttypecode : -1
                    }
                };
                breadCrumbdata = {
                    ...convertDateValuetoString(this.props.Login.masterData.fromDate,
                        this.props.Login.masterData.toDate, this.props.Login.userInfo),
                    breadcrumbprojecttype: {
                        label: this.props.Login.masterData.selectedProjectType &&
                            this.props.Login.masterData.selectedProjectType.sprojecttypename ?
                            this.props.Login.masterData.selectedProjectType.sprojecttypename : 'NA',
                        value: this.props.Login.masterData.selectedProjectType &&
                            this.props.Login.masterData.selectedProjectType.nprojecttypecode ?
                            this.props.Login.masterData.selectedProjectType.nprojecttypecode : -1
                    }
                }
            }

            if (this.props.Login.masterData.projectbarcodeconfig !== previousProps.Login.masterData.projectbarcodeconfig) {
                selectedProjectTypeList = this.props.Login.masterData.selectedProjectTypeList;
                const filterStorageCategorylist = constructOptionList(this.props.Login.masterData.projectbarcodeconfig || [], "nprojecttypecode",
                    "sprojecttypename", undefined, undefined, "alphabeticalSort");
                masterData['projectbarcodeconfig'] = filterStorageCategorylist.get("OptionList");
            }

            filterData = this.generateBreadCrumData(this.props.Login.masterData);

        }
        if (this.state.export) {
            this._excelExportHeader.save()
            this.setState({ export: false })
        }
        //     if(this.props.Login.importRetrieveOrDispose!== previousProps.Login.importRetrieveOrDispose){
        //         //bool = true;
        //            // importRetrieveOrDispose=this.props.Login.importRetrieveOrDispose
        //             //openModal = this.props.Login.importRetrieveOrDispose?this.props.Login.openModal:true;
        //     }
        //     if(this.props.Login.isRetrieveOrDispose!== previousProps.Login.isRetrieveOrDispose){
        //         // bool = true;
        //      // isRetrieveOrDispose=this.props.Login.importRetrieveOrDispose?this.props.Login.isRetrieveOrDispose :true;
        //  }
        /*    if (this.state.masterData !== previousState.masterData) {
                bool = true;
    
                selectedRecord["nprojecttypecode"] = {
                    label: this.state.masterData.selectedProjectType &&
                        this.state.masterData.selectedProjectType.sprojecttypename ?
                        this.state.masterData.selectedProjectType.sprojecttypename : 'NA'
                    , value: this.state.masterData.selectedProjectType && this.state.masterData.selectedProjectType.nprojecttypecode
                };
                selectedProjectType = {
                    nprojecttypecode: {
                        label: this.state.masterData.selectedProjectType &&
                        this.state.masterData.selectedProjectType.sprojecttypename ?
                        this.state.masterData.selectedProjectType.sprojecttypename : 'NA'
                        , value: this.state.masterData.selectedProjectType && this.state.masterData.selectedProjectType.nprojecttypecode
                    }
                };
             
    
                //this.state.masterData.projectbarcodeconfig=previousState.masterData.projectbarcodeconfig;
    
                filterData = this.generateBreadCrumData(this.state.masterData);
    
            }*/

        // added by sujatha v for dispose button to dispose expired samples SWSM-37 12-09-2025
        //Start
        let addSelectAll;
        let deleteSelectAll;
        if (this.state.masterData && this.state.masterData.addComponentDataList && this.state.masterData.addComponentDataList !== previousState.masterData.addComponentDataList) {
            addSelectAll = false;
            deleteSelectAll = true;
            this.setState({
                addComponentDataList: this.state.masterData.addComponentDataList,
                addSelectAll, deleteSelectAll
            });
        }

        if (this.state.masterData && this.state.masterData.addComponentDataList && this.state.masterData.addComponentDataList !== previousState.masterData.addComponentDataList) {
            this.setState({ addComponentDataList: this.state.masterData.addComponentDataList, addedComponentList: [] });
        }
        if (this.state.masterData && this.state.masterData.addComponentSortedList && this.state.masterData.addComponentSortedList !== previousState.addComponentSortedList) {
            this.setState({ addComponentSortedList: this.state.masterData.addComponentSortedList, isInitialRender: true });
        }

        if (this.state.masterData && this.state.masterData.siteSampleExpiry && this.state.masterData.siteSampleExpiry !== previousState.masterData.siteSampleExpiry) {
            this.setState({ siteSampleExpiry: this.state.masterData.siteSampleExpiry });
        }
        //modified by sujatha ATE_274 for dispose expired samples SWSM-37 12-09-2025
        if (bool) {
            this.setState({
                storageCategoryOptions, filterData,
                selectedRecord, controlMap,
                userRoleControlRights, storageLocationOptions, addSelectAll, deleteSelectAll,
                sampleStorageVersionOptions, masterData, selectedRecordFilter, fields, selectedProjectType, selectedProjectTypeList,
                breadCrumbdata, isInitialRender, openModal, dynamicfields, addedComponentList: []//,importRetrieveOrDispose,isRetrieveOrDispose
            });
        }
        //End
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
    // closeModalImport=()=>{
    //     let loadEsign = this.props.Login.loadEsign;
    //     let openModal = this.props.Login.openModal;
    //     let isRetrieveOrDispose = this.props.Login.isRetrieveOrDispose;
    //     let importRetrieveOrDispose = this.props.Login.importRetrieveOrDispose;
    //     let selectedId = this.props.Login.selectedId;
    //     let selectedRecord = this.state.selectedRecord;
    //     if (this.props.Login.loadEsign) {
    //         openModal = true;
    //         loadEsign = false;
    //         isRetrieveOrDispose=true;
    //         importRetrieveOrDispose=true;
    //         selectedRecord['esignpassword'] = ""
    //         selectedRecord['esigncomments'] = ""
    //         selectedRecord['esignreason'] = ""

    //         const updateInfo = {
    //             typeName: DEFAULT_RETURN,
    //             data: {
    //                 openModal, importRetrieveOrDispose  ,isRetrieveOrDispose,loadEsign,selectedRecord, selectedId: null 
    //             }
    //         }
    //         this.props.updateStore(updateInfo);
    //     }else{
    //         selectedRecord={};
    //         this.setState({
    //             selectedRecord,
    //             openModal: false, isInitialRender: true
    //             , isFilterPopup: false, isRetrieveOrDispose: false,importRetrieveOrDispose:false
    //         })
    //     }

    // }
    closeModal = () => {
        // const updateInfo = {
        //     typeName: DEFAULT_RETURN,
        //     data: {
        //         openModal: false, selectedRecord: {}
        //     }
        // }
        // this.props.updateStore(updateInfo);
        //ALPD-4749
        //Fixed: Removed the store action in sample retrieval, and the screen is now fully managed through the state.
        let loadEsign = this.state.loadEsign;
        let openModal = this.state.openModal;
        //let selectedId = this.props.Login.selectedId;
        let selectedRecord = this.state.selectedRecord; //this.props.Login.selectedRecord;
        let masterData = this.state.masterData;
        if (this.state.loadEsign) {
            if (this.props.Login.operation === "delete" || this.props.Login.operation === "Approve" || this.props.Login.operation === "copy") {
                loadEsign = false;
                openModal = false;
                selectedRecord = {};
                //selectedId = null;
            }
            else {
                //this.state.isRetrieveOrDispose=true;
                openModal = true;
                loadEsign = false;
                //isRetrieveOrDispose=false;
                selectedRecord['esignpassword'] = ""
                selectedRecord['esigncomments'] = ""
                selectedRecord['esignreason'] = ""
                //ALPD-4749
                //Fixed: Removed the store action in sample retrieval, and the screen is now fully managed through the state.
                // const updateInfo = {
                //     typeName: DEFAULT_RETURN,
                //     data: { openModal, loadEsign, selectedRecord, selectedId: null ,importRetrieveOrDispose:false}
                // }
                // this.props.updateStore(updateInfo);
                // added by sujatha v for dispose button to dispose expired samples SWSM-37 12-09-2025
                this.setState({ selectedRecord, openModal, loadEsign, selectedId: null, addedComponentList: this.state.addedComponentList })
            }
        }
        else {
            openModal = false;
            ///selectedId = null;
            //selectedRecord = {};
            //this.state.isRetrieveOrDispose= false;
            this.state.masterData.addComponent = {}
            this.getprojectbarcodeconfig(true);
            this.setState({
                selectedRecord, masterData,
                // added by sujatha v for dispose button to dispose expired samples SWSM-37 12-09-2025
                addComponentDataList: [],
                openModal: false, isInitialRender: true
                , isFilterPopup: false, isRetrieveOrDispose: false, importRetrieveOrDispose: false, isDispose: false
            })
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
        // let showFilter = !this.props.Login.showFilter
        // const updateInfo = {
        //     typeName: DEFAULT_RETURN,
        //     data: { showFilter }
        // }
        // this.props.updateStore(updateInfo);

        let boolean = !this.state.showFilter
        this.setState({ showFilter: boolean })
    }

    closeFilter = () => {

        // const updateInfo = {
        //     typeName: DEFAULT_RETURN,
        //     data: { showFilter: false }
        // }
        // this.props.updateStore(updateInfo);
        this.setState({ showFilter: false })
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
            'userinfo': this.props.Login.userInfo
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
    openbulkretrieve = () => {
        this.setState({
            isbulkretrieve: true,
            openModal: true,
            loading: false
        });
    }
    handleExportClick = () => {
        let exportFiled = [{ "idsName": "IDS_SAMPLEID", "dataField": "spositionvalue", "width": "200px", "staticField": true }];
        this.setState({ exportFiled, export: true });
    }
    bulkRetrieveDispose = () => {
        this.setState({
            importRetrieveOrDispose: true,
            openModal: true,
            loading: false,
            isRetrieveOrDispose: false,
            isDispose: false,
            selectedRecord: {},
        });
        //     const updateInfo = {
        //         typeName: DEFAULT_RETURN,
        //         data: {
        //             openModal: true, importRetrieveOrDispose: true,
        //                   isRetrieveOrDispose: true,
        //     }
        // }
        //     this.props.updateStore(updateInfo);
    }
    openRetrieveDispose = () => {
        this.setState({ loading: true, importRetrieveOrDispose: false })
        let urlArray = [];
        const url1 = rsapi().post("unit/getUnit", { userinfo: this.props.Login.userInfo });
        urlArray = [url1];
        Axios.all(urlArray)
            .then(response => {
                const unitMap = constructOptionList(response[0].data || [], "nunitcode", "sunitname", false, false, true);
                const unit = unitMap.get("OptionList");
                this.setState({
                    unitMapList: unit,
                    openModal: true, isRetrieveOrDispose: true, importRetrieveOrDispose: false, isDispose: false,
                    dynamicfields: [],
                    selectedBarcodeValue: {},
                    selectedRecord: {},
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

    // added by sujatha v for dispose button to dispose expired samples SWSM-37 12-09-2025
    openDispose = (masterData, ncontrolCode, operation, screenName, selectedProjectType) => {
        this.setState({ loading: true, importRetrieveOrDispose: false })
        let urlArray = [];
        const sampleStorageTransaction = rsapi().post("samplestorageretrieval/getSampleStorageTransaction",
            { userinfo: this.props.Login.userInfo, nprojecttypecode: selectedProjectType });
        const siteSampleExpiry = rsapi().post("samplestorageretrieval/getSiteSampleExpiryMapping",
            { userinfo: this.props.Login.userInfo });
        urlArray = [sampleStorageTransaction, siteSampleExpiry];
        Axios.all(urlArray)
            .then(response => {
                let currentTime = undefined;
                masterData = { ...masterData, addComponentDataList: response[0].data || [], siteSampleExpiry: response[1].data || [] };
                this.setState({
                    currentTime,
                    masterData,
                    isOpen: true,
                    needClose: false,
                    activeKey: "IDS_SAMPLEDISPOSE",
                    screenName: screenName,
                    openModal: true, isRetrieveOrDispose: false, importRetrieveOrDispose: false, isDispose: true,
                    dynamicfields: [],
                    selectedBarcodeValue: {},
                    selectedRecord: {},
                    loading: false,
                    ncontrolCode: ncontrolCode,
                    operation: operation,
                    addComponentList: [],
                    addComponentSortedList: [],
                    addedComponentList: []
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

    //end

    addSample = (param, nflag) => {
        this.setState({ loading: true })
        let urlArray = [];
        const url1 = rsapi().post("samplestorageretrieval/getsamplestoragemappingSheetData",
            {
                isMultiSampleAdd: (nflag === 2) ? true : false,
                nsamplestoragemappingcode:
                    (nflag === 2) ? this.state.masterData.samplestorageretrieval.map(item => item.nsamplestoragemappingcode).join(",")
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
    onComboChange = (comboData, fieldName) => {
        const selectedRecord = this.state.selectedRecord || {};
        const selectedProjectType = this.state.selectedProjectType || {};
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

        }
        else if (fieldName === 'nprojecttypecode') {
            ///return this.getprojectbarcodeconfig(comboData);
            selectedProjectType[fieldName] = comboData;
            selectedRecord[fieldName] = comboData;
            this.setState({ selectedRecord });
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
        const url1 = rsapi().post("samplestorageretrieval/getsamplestoragetransaction", {
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
        const url1 = rsapi().post("samplestorageretrieval/getActiveSampleStorageMappingById", {
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
    onNumericInputChange = (value, field, actionType) => {
        const selectedRecord = this.state.selectedRecord || {};
        let constantvalue = value.target ? value.target.value : value;
        // added by sujatha v for dispose button to dispose expired samples SWSM-37 12-09-2025
        if (actionType === 'dispose') {
            this.setState({
                siteSampleExpiry: {
                    ...this.state.siteSampleExpiry,
                    siteSampleExpiryMap: {
                        ...this.state.siteSampleExpiry.siteSampleExpiryMap,
                        [field]: constantvalue
                    }
                }
            });

        } else if (!isNaN(constantvalue)) {
            selectedRecord[field] = constantvalue;
            this.setState({ selectedRecord });
        }
    }
    validateRetrievOrDispose = () => {
        if ((this.state.selectedRecord.saliquotsampleid && this.state.selectedRecord.saliquotsampleid === "") ||
            this.state.selectedRecord.saliquotsampleid === undefined) {
            toast.info(`${this.props.intl.formatMessage({ id: "IDS_ENTER" })} ${"IDS_NEWSAMPLEID"}`);
        }
        else if ((this.state.selectedRecord.nquantity && this.state.selectedRecord.nquantity === "") ||
            (this.state.selectedRecord.saliquotsampleid === undefined)) {
            return toast.info(`${this.props.intl.formatMessage({ id: "IDS_ENTER" })} ${"IDS_QUANTITY"}`);
        }
        else if ((this.state.selectedRecord.nunitcode && Object.keys(this.state.selectedRecord.nunitcode).length <= 0) ||
            (this.state.selectedRecord.nunitcode === undefined)) {
            return toast.info(`${this.props.intl.formatMessage({ id: "IDS_SELECT" })} ${"IDS_UNIT"}`);
        }
    }

    CRUDSampleStorageTransaction = (inputParam, operation) => {

        let inputData = [];
        let obj = convertDateValuetoString(this.state.masterData.fromDate,
            this.state.masterData.toDate, this.props.Login.userInfo);
        let selectedRecord = this.state.selectedRecord;
        let isFileupload = inputParam.importRetrieveOrDispose ? true : false;
        const formData = new FormData();
        inputData["userinfo"] = this.props.Login.userInfo;
        inputData["scomments"] = inputParam.scomments;
        inputData["spositionvalue"] = inputParam.spositionvalue
        inputData["nquantity"] = parseInt(inputParam.nquantity)
        inputData["sunitname"] = inputParam.sunitname
        inputData["saliquotsampleid"] = inputParam.saliquotsampleid
        inputData["isRetrieve"] = inputParam.isRetrieve;
        inputData["nneedaliquot"] = inputParam.nneedaliquot;
        inputData["nprojecttypecode"] = this.state.breadCrumbdata.breadcrumbprojecttype.value || -1;

        if (inputParam.importRetrieveOrDispose) {
            formData.append("ImportFile", selectedRecord['sfilename'][0])
            formData.append("retrieveDisposeSampleType", inputParam.isRetrieve ? transactionStatus.Retrieved : transactionStatus.Disposed)
            formData.append("fieldName", Lims_JSON_stringify(this.props.intl.formatMessage({ id: "IDS_SAMPLEID" })))
            formData.append("fromDate", obj.fromDate);
            formData.append("toDate", obj.toDate);
            formData.append("nprojecttypecode", this.state.breadCrumbdata.breadcrumbprojecttype.value || -1);
        }
        inputParam = {
            formData: formData,
            isFileupload,
            methodUrl: inputParam.importRetrieveOrDispose ? "bulkeretrievedispose" : "samplestorageretrieval",
            operation: "create",
            dynamicfields: [],
            classUrl: "samplestorageretrieval",
            isInitialRender: true,
            selectedRecord: inputParam.importRetrieveOrDispose ? { ...this.state.selectedRecord } : {},
            //selectedRecord: {},
            ...inputParam, inputData
        }
        var saveType = this.statesaveType;
        const masterData = this.state.masterData;

        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, inputParam.ncontrolcode)) {
            //ALPD-4749
            //Fixed: Removed the store action in sample retrieval, and the screen is now fully managed through the state.
            this.setState({ loading: true, dynamicfields: [] })
            let urlArray = [];
            const currentTimeUrl = rsapi().post("/timezone/getLocalTimeByZone", {
                "userinfo": this.props.Login.userInfo
            });
            const reasonUrl = rsapi().post("/reason/getReason", {
                "userinfo": this.props.Login.userInfo
            });

            urlArray = [reasonUrl, currentTimeUrl];

            Axios.all(urlArray)
                .then(response => {
                    const reasonMap = constructOptionList(response[0].data || [], "nreasoncode",
                        "sreason", undefined, undefined, false);
                    const reasonList = reasonMap.get("OptionList");
                    this.setState({
                        esign: reasonList,
                        serverTime: rearrangeDateFormat(this.props.Login.userInfo, response[1].data?.date),
                        loadEsign: true, openModal: true, screenData: { inputParam, masterData }, importRetrieveOrDispose: inputParam.importRetrieveOrDispose,
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
            // const updateInfo = {
            //     typeName: DEFAULT_RETURN,
            //     data: {
            //         loadEsign: true, dynamicfields: [], screenData: { inputParam, masterData }, saveType,importRetrieveOrDispose:inputParam.importRetrieveOrDispose
            //     }
            // }
            // this.props.updateStore(updateInfo);
        } else {
            this.crudMasterSampleStorageRetrieval(inputParam, this.state.masterData, inputParam.importRetrieveOrDispose ? "openModal" : "");

        }
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
        const url1 = rsapi().post("samplestorageretrieval/getsamplestoragemapping", inputParamData);

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
        this.getprojectbarcodeconfigForSubmit(true);
        // this.setState({ loading: true })
        // let inputParamData = {
        //     nstoragecategorycode: this.state.selectedRecordFilter["nstoragecategorycode"].value,
        //     // nsamplestoragelocationcode: this.state.selectedRecordFilter["nsamplestoragelocationcode"].value,
        //     // nsamplestorageversioncode: this.state.selectedRecordFilter["nsamplestorageversioncode"].value,
        //     userinfo: this.props.Login.userInfo,
        // }
        // let urlArray = [];
        // const url1 = rsapi().post("samplestorageretrieval/getsamplestoragemapping", inputParamData);
        // urlArray = [url1];
        // Axios.all(urlArray)
        //     .then(response => {
        //         let object = {
        //             selectedStorageCategoryName: this.state.selectedRecordFilter["nstoragecategorycode"].item.sstoragecategoryname,
        //             // ssamplestoragelocationname: this.state.selectedRecordFilter["nsamplestoragelocationcode"].item.ssamplestoragelocationname,
        //             // selectedSampleStorageVersion: this.state.selectedRecordFilter["nsamplestorageversioncode"].item.nversionno,
        //         }
        //         let filterData = this.generateBreadCrumData(object);

        //         this.setState({
        //             filterData,
        //             masterData: {
        //                 ...this.state.masterData,
        //                 ...response[0].data,
        //                 //   samplestorageretrieval: response[0].data['samplestorageretrieval'],
        //             },
        //             loading: false
        //         });
        //     }).catch(error => {
        //         if (error.response?.status === 429) {
        //            toast.warn(this.props.intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
        //            dispatch({ type: DEFAULT_RETURN, payload: { loading: false } });
        //        } else if (error.response?.status === 401 || error.response?.status === 403) {
        //   dispatch({
        //     type: UN_AUTHORIZED_ACCESS,
        //                payload: {
        //                    navigation: 'forbiddenaccess',
        //                    loading: false,
        //                    responseStatus: error.response.status
        //                }
        //     payload: {
        //       navigation: 'forbiddenaccess',
        //       loading: false,
        //     }
        //   });
        // } else if (error.response.status === 500) {
        //             toast.error(error.message);
        //         } else {
        //             toast.warn(error.response.data);
        //         }
        //         this.setState({
        //             loading: false
        //         });
        //     });
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
        const url1 = rsapi().post("samplestorageretrieval/addSampleStorageMapping", inputParamData);

        const url2 = rsapi().post("product/getProduct",
            { 'userinfo': this.props.Login.userInfo });

        // const url3 = rsapi().post("containertype/getContainerType",
        //     { 'userinfo': this.props.Login.userInfo });

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
                //const containerstructureList = containerstructureMap.get("OptionList");

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

    getprojectbarcodeconfigForSubmit(nflag) {
        let inputParamData = {}
        this.setState({ loading: true })
        let obj = convertDateValuetoString(this.state.masterData.fromDate, this.state.masterData.toDate, this.props.Login.userInfo);
        inputParamData = {
            nprojecttypecode: this.state.selectedProjectType.nprojecttypecode.value,
            isFilterSubmit: nflag,
            // fromDate: rearrangeDateFormat(this.props.Login.userInfo, this.state.masterData.fromDate),
            // toDate: rearrangeDateFormat(this.props.Login.userInfo, this.state.masterData.toDate),
            fromDate: obj.fromDate,
            toDate: obj.toDate,
            userinfo: this.props.Login.userInfo
        }
        let urlArray = [];
        const url1 = rsapi().post("samplestorageretrieval/getProjectbarcodeconfig", inputParamData);

        urlArray = [url1];
        Axios.all(urlArray)
            .then(response => {
                //let masterData = this.state.masterData.samplestorageretrieval;
                this.setState(nflag === false ? {
                    selectedProjectTypeList: sortData(response[0].data.selectedProjectTypeList),
                    // selectedRecord: {
                    //     nprojecttypecode: { label: comboData.label, value: comboData.value }
                    // },
                    loading: false
                } : {
                    selectedProjectTypeList: sortData(response[0].data.selectedProjectTypeList),
                    breadCrumbdata: {
                        breadcrumbprojecttype: {
                            label: this.state.selectedProjectType.nprojecttypecode.label,
                            value: this.state.selectedProjectType.nprojecttypecode.value
                        },
                        ...convertDateValuetoString(this.state.masterData.fromDate,
                            this.state.masterData.toDate, this.props.Login.userInfo)
                    },
                    masterData: {
                        ...this.state.masterData,
                        fromDate: rearrangeDateFormat(this.props.Login.userInfo, this.state.masterData.fromDate),
                        toDate: rearrangeDateFormat(this.props.Login.userInfo, this.state.masterData.toDate),
                        samplestorageretrieval: response[0].data.samplestorageretrieval
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


    getprojectbarcodeconfig(nflag) {
        let inputParamData = {}
        this.setState({ loading: true })
        let obj = convertDateValuetoString(this.state.masterData.fromDate, this.state.masterData.toDate, this.props.Login.userInfo);
        inputParamData = {
            nprojecttypecode: this.state.breadCrumbdata.breadcrumbprojecttype.value,
            isFilterSubmit: nflag,
            // fromDate: rearrangeDateFormat(this.props.Login.userInfo, this.state.masterData.fromDate),
            // toDate: rearrangeDateFormat(this.props.Login.userInfo, this.state.masterData.toDate),
            fromDate: obj.fromDate,
            toDate: obj.toDate,
            userinfo: this.props.Login.userInfo
        }
        let urlArray = [];
        const url1 = rsapi().post("samplestorageretrieval/getProjectbarcodeconfig", inputParamData);

        urlArray = [url1];
        Axios.all(urlArray)
            .then(response => {
                //let masterData = this.state.masterData.samplestorageretrieval
                this.setState(nflag === false ? {
                    selectedProjectTypeList: sortData(response[0].data.selectedProjectTypeList),
                    // selectedRecord: {
                    //     nprojecttypecode: { label: comboData.label, value: comboData.value }
                    // },
                    loading: false
                } : {
                    selectedProjectTypeList: sortData(response[0].data.selectedProjectTypeList),
                    /*breadCrumbdata: {
                        breadcrumbprojecttype: {
                            label: this.state.selectedProjectType.nprojecttypecode.label,
                            value: this.state.selectedProjectType.nprojecttypecode.value
                        },
                        ...convertDateValuetoString(this.state.masterData.fromDate,
                            this.state.masterData.toDate, this.props.Login.userInfo)
                    },*/
                    masterData: {
                        ...this.state.masterData,
                        fromDate: rearrangeDateFormat(this.props.Login.userInfo, this.state.masterData.fromDate),
                        toDate: rearrangeDateFormat(this.props.Login.userInfo, this.state.masterData.toDate),
                        samplestorageretrieval: response[0].data.samplestorageretrieval
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

    getContainerStructure(inputData, fieldName, comboData) {
        let inputParamData = {}
        this.setState({ loading: true })
        inputParamData = {
            ncontainertypecode: comboData.value,
            userinfo: inputData.userinfo
        }
        let urlArray = [];
        const url1 = rsapi().post("samplestorageretrieval/getContainerStructure", inputParamData);

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
    bulkeretrieval = (inputParam, operation) => {
        let inputData = [];
        let obj = convertDateValuetoString(this.state.masterData.fromDate, this.state.masterData.toDate, this.props.Login.userInfo);

        inputData = {
            fromDate: obj.fromDate,
            toDate: obj.toDate,
            userinfo: this.props.Login.userInfo,
            nprojecttypecode: this.state.breadCrumbdata.breadcrumbprojecttype.value,
            spositionvaluesize: this.state.newData.length,
            spositionvalue: this.state.newData.map(item => item['Sample Id']).join('\',\''),
            isbulkretrieve: true
        }
        inputParam = {
            methodUrl: "bulkeretrieve",
            operation: "create",
            classUrl: "samplestorageretrieval",
            isInitialRender: true,
            //  selectedRecord: {...this.state.selectedRecord},
            selectedRecord: {},
            ...inputParam, inputData
        }
        var saveType = this.statesaveType;
        const masterData = this.state.masterData;
        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, inputParam.ncontrolcode)) {

            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData }, saveType
                }
            }
            this.props.updateStore(updateInfo);
        } else {
            this.props.crudMaster(inputParam, this.state.masterData, "openModal");

        }
    }

    onSampleMappingSaveClick = (param) => {
        if (!param.isRetrieve) {
            if (this.state.selectedRecord["nneedaliquot"] &&
                this.state.selectedRecord["nneedaliquot"] === true) {
                return toast.info(this.props.intl.formatMessage({ id: "IDS_DISABLEINPUTFORALIQUOTSAMPLE" }));
            }
        }
        const mandatoryFields = param.importRetrieveOrDispose ?
            [{ "idsName": "IDS_FILE", "dataField": "sfilename", "mandatory": true, "mandatoryLabel": "IDS_CHOOSE", "controlType": "file" }]
            : this.state.selectedRecord["nneedaliquot"] &&
                this.state.selectedRecord["nneedaliquot"] === true ? [
                {
                    "idsName": "IDS_SAMPLEID", "dataField": "spositionvalue",
                    "mandatoryLabel": "IDS_ENTER", "controlType": "selectbox"
                },
                {
                    "idsName": "IDS_NEWSAMPLEID",
                    "dataField": "saliquotsampleid", "mandatoryLabel":
                        "IDS_ENTER", "controlType": "selectbox"
                },
                {
                    "idsName": "IDS_QUANTITY",
                    "dataField": "nquantity", "mandatoryLabel":
                        "IDS_ENTER", "controlType": "selectbox"
                },
                {
                    "idsName": "IDS_UNITNAME",
                    "dataField": "nunitcode", "mandatoryLabel":
                        "IDS_SELECT", "controlType": "selectbox"
                }
            ] : [
                {
                    "idsName": "IDS_SAMPLEID", "dataField": "spositionvalue",
                    "mandatoryLabel": "IDS_ENTER", "controlType": "selectbox"
                }
            ]
        onSaveMandatoryValidation(this.state.selectedRecord, mandatoryFields,
            () => this.CRUDSampleStorageTransaction(param))


    }
    dataStateChange = (event) => {
        this.setState({
            dataStateChange: event.dataState
        });
    }
    dataStateGridChange = (event) => {
        this.setState({
            dataStateGridChange: event.dataState
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
        const url1 = rsapi().post("samplestorageretrieval/approveSampleStorageMapping", inputParamData);

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
    getSelectedBarcodeData(e, inputParam) {
        if (e.keyCode === 13) {
            this.setState({ loading: true })
            //let selectedRecord = this.state.selectedRecord || {};
            let urlArray = [];
            const url1 = rsapi().post("/samplestorageretrieval/getSelectedBarcodeData", {
                // nprojecttypecode: this.state.selectedBarcodeValue.nprojecttypecode,
                spositionvalue: inputParam.spositionvalue,
                userinfo: this.props.Login.userInfo
            });
            urlArray = [url1];
            Axios.all(urlArray)
                .then(response => {
                    let dynamicfields = [];
                    dynamicfields = [{ "idsName": "IDS_SAMPLEID", "dataField": "spositionvalue", "width": "200px", "staticField": true },
                    { "idsName": "IDS_POSITION", "dataField": "sposition", "width": "200px", "staticField": true },
                    { "idsName": "IDS_QUANTITY", "dataField": "nquantity", "width": "200px", "staticField": true },
                    { "idsName": "IDS_UNIT", "dataField": "sunitname", "width": "200px", "staticField": true }];
                    const temparray2 = response[0].data['selectedProjectTypeList'] && response[0].data['selectedProjectTypeList'].map((option) => {
                        return { "idsName": option.sfieldname, "dataField": option.sfieldname, "width": "200px" };
                    });
                    dynamicfields = [...dynamicfields, ...temparray2]
                    this.setState({
                        dynamicfields,
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
                        this.setState({
                            dynamicfields: [],
                            selectedBarcodeValue: {}
                        })
                        toast.info(error.response.data);
                    }

                })
        }
    }
    getDynamicFilterExecuteData(nflag) {
        let selectedRecord = this.state.selectedRecord || {};
        if (nflag === 2 ? true : (selectedRecord.filterquery && selectedRecord.filterquery !== "")) {
            this.setState({ loading: true })
            let obj = {// ...inputParam.component, 
                label: 'samplestorageretrieval', valuemember: 'nsamplestorageretrievalcode',
                filterquery: nflag === 2 ?
                    this.state.submittedselectedRecord.filterquery
                    :
                    selectedRecord.filterquery,
                fromDate: rearrangeDateFormat(this.props.Login.userInfo, this.state.masterData.fromDate),
                toDate: rearrangeDateFormat(this.props.Login.userInfo, this.state.masterData.toDate),
                nprojecttypecode: this.state.breadCrumbdata.breadcrumbprojecttype.value
                , source: 'view_sampleretrieval_' + this.state.breadCrumbdata.breadcrumbprojecttype.value, userinfo: this.props.Login.userInfo
            }
            let urlArray = [];
            const url1 = rsapi().post("/samplestorageretrieval/getdynamicfilterexecutedata", obj);
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
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTAFILTER" }));

        }
    }
    // getDynamicFilterExecuteData(nflag) {
    //     this.setState({ loading: true })
    //     let selectedRecord = this.state.selectedRecord || {};
    //     let obj = {// ...inputParam.component, 
    //         label: 'samplestorageretrieval', valuemember: 'nsamplestoragetransactioncode',
    //         filterquery:   
    //         selectedRecord.filterquery, source: 'view_sampleretrieval', userinfo: this.props.Login.userInfo
    //     }
    //     let urlArray = [];
    //     const url1 = rsapi().post("/samplestorageretrieval/getdynamicfilterexecutedata", obj);
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
    //                toast.warn(this.props.intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
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
        const url1 = rsapi().post("samplestorageretrieval/addSampleStorageMapping", inputParamData);

        const url2 = rsapi().post("product/getProduct",
            { 'userinfo': this.props.Login.userInfo });

        const url3 = rsapi().post("samplestorageretrieval/getEditSampleStorageMapping",
            { 'nsamplestoragemappingcode': data.nsamplestoragemappingcode, 'userinfo': this.props.Login.userInfo });

        urlArray = [url1, url2, url3];
        Axios.all(urlArray)
            .then(response => {
                const storageMappingMap = constructOptionList(response[0].data['samplestoragecontainerpath'] || [],
                    "nsamplestoragecontainerpathcode",
                    "scontainerpath", undefined, undefined, true);
                const storageMappingMapList = storageMappingMap.get("OptionList");
                // let containerStructure = response[0].data['containerStructure'];

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

        if (event.target.type === 'text') {
            selectedRecord[event.target.name] = event.target.value;
        }
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
    //     const newDataState = this.processWithGroups(this.state.masterData.samplestorageretrieval || [], this.state.dataStateChange, event.group);
    //     this.setState({
    //         masterData: { ...this.state.masterData, samplestorageretrieval: newDataState },
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

        const temparray1 = this.props.Login.settings && parseInt(this.props.Login.settings[84]) === transactionStatus.YES ? [{ "idsName": "IDS_SAMPLEID", "dataField": "spositionvalue", "width": "200px", "staticField": true },
        { "idsName": "IDS_STORAGESTRUCTURE", "dataField": "ssamplestoragelocationname", "width": "200px", "staticField": true },
        { "idsName": "IDS_PATHWITHPOSITION", "dataField": "scontainerpathwithposition", "width": "500px", "staticField": true },
        { "idsName": "IDS_TRANSACTIONSTATUS", "dataField": "stransdisplaystatus", "width": "200px", "staticField": true },
        { "idsName": "IDS_TRANSACTIONDATE", "dataField": "dtransactiondate", "width": "200px", "staticField": true },
        { "idsName": "IDS_USERNAME", "dataField": "susername", "width": "200px", "staticField": true },
        { "idsName": "IDS_USERROLE", "dataField": "suserrolename", "width": "200px", "staticField": true },
        { "idsName": "IDS_COMMENTS", "dataField": "scomments", "width": "200px", "staticField": true }]

            : [{ "idsName": "IDS_SAMPLEID", "dataField": "spositionvalue", "width": "200px", "staticField": true },
            { "idsName": "IDS_STORAGESTRUCTURE", "dataField": "ssamplestoragelocationname", "width": "200px", "staticField": true },
            { "idsName": "IDS_PATHWITHPOSITION", "dataField": "scontainerpathwithposition", "width": "500px", "staticField": true },
            { "idsName": "IDS_CONTAINERID", "dataField": "sboxid", "width": "200px", "staticField": true },
            //  { "idsName": "IDS_POSITION", "dataField": "sposition", "width": "200px", "staticField": true },
            { "idsName": "IDS_QUANTITY", "dataField": "nquantity", "width": "200px", "staticField": true },
            { "idsName": "IDS_UNIT", "dataField": "sunitname", "width": "200px", "staticField": true },
            { "idsName": "IDS_TRANSACTIONSTATUS", "dataField": "stransdisplaystatus", "width": "200px", "staticField": true },
            { "idsName": "IDS_TRANSACTIONDATE", "dataField": "dtransactiondate", "width": "200px", "staticField": true },
            { "idsName": "IDS_USERNAME", "dataField": "susername", "width": "200px", "staticField": true },
            { "idsName": "IDS_USERROLE", "dataField": "suserrolename", "width": "200px", "staticField": true },
            { "idsName": "IDS_COMMENTS", "dataField": "scomments", "width": "200px", "staticField": true }];


        const temparray2 = data && data.map((option) => {
            return { "idsName": option.sfieldname, "dataField": option.sfieldname, "width": "200px" };
        });
        const newArray = [...temparray1, ...temparray2]
        return newArray;
    }
    handleFilterDateChange = (dateName, dateValue) => {
        let masterData = this.state.masterData;
        masterData[dateName] = dateValue;
        this.setState({ masterData });

    }
    // handleAdd = e => {
    //     let file = e.newState[0].getRawFile();
    //     /* Boilerplate to set up FileReader */
    //     const reader = new FileReader();
    //     const rABS = !!reader.readAsBinaryString;

    //     reader.onload = e => {
    //       /* Parse data */
    //       const bstr = e.target.result;
    //       const wb = XLSX.read(bstr, {
    //         type: rABS ? "binary" : "array",
    //         bookVBA: true
    //       });
    //       /* Get first worksheet */
    //       const wsname = wb.SheetNames[0];
    //       const ws = wb.Sheets[wsname];
    //       /* Convert array of arrays */
    //       const newData = XLSX.utils.sheet_to_json(ws); 
    //       /* Update state */
    //       this.setState({
    //         newData
    //       })
    //     };
    //     if (rABS) {
    //       reader.readAsBinaryString(file);
    //     } else {
    //       reader.readAsArrayBuffer(file);
    //     }
    //   };
    render() {
        // const addId = this.state.controlMap.has("Add samplestorageretrieval") && this.state.controlMap.get("Add samplestorageretrieval").ncontrolcode;
        // const editId = this.state.controlMap.has("Edit SampleStorageLocation") && this.state.controlMap.get("Edit SampleStorageLocation").ncontrolcode;
        // const deleteId = this.state.controlMap.has("Delete SampleStorageLocation") && this.state.controlMap.get("Delete SampleStorageLocation").ncontrolcode;
        // const copyId = this.state.controlMap.has("Copy SampleStorageLocation") && this.state.controlMap.get("Copy SampleStorageLocation").ncontrolcode;
        // const approveId = this.state.controlMap.has("Approve SampleStorageLocation") && this.state.controlMap.get("Approve SampleStorageLocation").ncontrolcode;
        // const retrievedispose = this.state.controlMap.has("Retrieve/Dispose") && this.state.controlMap.get("Retrieve/Dispose").ncontrolcode;
        // const retrieve = this.state.controlMap.has("Retrieve") && this.state.controlMap.get("Retrieve").ncontrolcode;
        // const dispose = this.state.controlMap.has("Dispose") && this.state.controlMap.get("Dispose").ncontrolcode;

        // added by sujatha v for dispose button to dispose expired samples SWSM-37 12-09-2025
        const sampleDispose = this.state.controlMap.has("SampleDispose") && this.state.controlMap.get("SampleDispose").ncontrolcode;
        const retrievedispose = this.state.controlMap.has("Retrieve/Dispose") && this.state.controlMap.get("Retrieve/Dispose").ncontrolcode;
        const bulkretievedispose = this.state.controlMap.has("Bulk Retrieve/Dispose") && this.state.controlMap.get("Bulk Retrieve/Dispose").ncontrolcode;
        const exportTemplate = this.state.controlMap.has("Export Template") && this.state.controlMap.get("Export Template").ncontrolcode;



        let fromDate = this.state.masterData && this.state.masterData.fromDate ? rearrangeDateFormat(this.props.Login.userInfo, this.state.masterData.fromDate) : new Date();
        let toDate = this.state.masterData && this.state.masterData.toDate ? rearrangeDateFormat(this.props.Login.userInfo, this.state.masterData.toDate) : new Date();

        //  let obj = convertDateValuetoString(this.props.Login.masterData.realfromDate, this.props.Login.masterData.realtoDate, this.props.Login.userInfo);

        const extractedColumnList = this.state.selectedProjectTypeList ? this.gridfillingColumn(this.state.selectedProjectTypeList) : [];

        // added by sujatha v for dispose button to dispose expired samples SWSM-37 12-09-2025
        const addDisposeId =
            this.state.controlMap.has("ExpiryDispose") &&
            this.state.controlMap.get("ExpiryDispose").ncontrolcode;

        let fields = {};
        if (extractedColumnList.length > 0) {
            extractedColumnList.map(field => {
                field.hasOwnProperty("staticField") ?
                    fields = {
                        ...fields,
                        [field.dataField]: {
                            "label": this.props.intl.formatMessage({
                                id: field.idsName,
                            })
                            ,
                            "type": "text",
                            "valueSources": ["value", "func"],

                            "mainWidgetProps": {
                                "valueLabel": "Name",
                                "valuePlaceholder": this.props.intl.formatMessage({
                                    id: field.idsName
                                })
                            }
                        }
                    }
                    :
                    fields = {
                        ...fields,
                        ['"' + field.dataField + '"']: {
                            "label": field.dataField
                            ,
                            "type": "text",
                            "valueSources": ["value", "func"],

                            "mainWidgetProps": {
                                "valueLabel": "Name",
                                "valuePlaceholder": field.dataField
                            }
                        }
                    }
            });
        }
        // const filterParam = {
        //     inputListName: "sampleStorageLocation", selectedObject: "selectedSampleStorageLocation", primaryKeyField: "nsamplestoragelocationcode",
        //     fetchUrl: "samplestorageretrieval/getActiveSampleStorageMappingById",
        //     fecthInputObject: { userinfo: this.props.Login.userInfo },
        //     masterData: this.props.Login.masterData,
        //     searchFieldList: ["ssamplestoragelocationname"]
        // };

        const breadCrumbData = [
            {
                "label": "IDS_FROM",
                "value": this.state.breadCrumbdata && this.state.breadCrumbdata.breadCrumbFrom ? this.state.breadCrumbdata.breadCrumbFrom : 'IDS_NA'
            },
            {
                "label": "IDS_TO",
                "value": this.state.breadCrumbdata && this.state.breadCrumbdata.breadCrumbto ? this.state.breadCrumbdata.breadCrumbto : 'IDS_NA'
            },
          // Added by Mullai Balaji: If setting code 84 equals YES, use IDS_BIOPROJECT
            {
                "label":(this.props.Login.settings && parseInt(this.props.Login.settings[84]) === transactionStatus.YES)? "IDS_BIOPROJECT":"IDS_PROJECTTYPE",
                "value": this.state.breadCrumbdata &&
                    this.state.breadCrumbdata.breadcrumbprojecttype ? this.state.breadCrumbdata.breadcrumbprojecttype.label : 'IDS_NA'
            }

        ];

        //const confirmMessage = new ConfirmMessage();
        return (
            <>

                <Preloader loading={this.state.loading} />
                {//this.state.retrievalType === 1 ?
                    <>

                        <ListWrapper className="client-listing-wrap toolbar-top-wrap mtop-4 screen-height-window">
                            <BreadcrumbComponent breadCrumbItem={breadCrumbData} />
                            {
                                <>
                                    <Row>
                                        <Col md={12}>
                                            <InputGroup.Append>
                                                <AdvFilter
                                                    filterComponent={[{
                                                        "IDS_SAMPLESTORAGERETRIEVEFILTER": <>
                                                            <Col md={12}>
                                                                <Row>
                                                                    <Col md={6}>
                                                                        <DateTimePicker
                                                                            name={"fromdate"}
                                                                            label={this.props.intl.formatMessage({ id: "IDS_FROM" })}
                                                                            className="form-control"
                                                                            placeholderText={this.props.intl.formatMessage({ id: "IDS_FROM" })}
                                                                            selected={fromDate}
                                                                            value={fromDate}
                                                                            dateFormat={this.props.Login.userInfo.ssitedate}
                                                                            isClearable={false}
                                                                            onChange={(date) =>
                                                                                this.handleFilterDateChange("fromDate", date)}
                                                                        />
                                                                    </Col>
                                                                    <Col md={6}>
                                                                        <DateTimePicker
                                                                            name={"todate"}
                                                                            label={this.props.intl.formatMessage({ id: "IDS_TO" })}
                                                                            className="form-control"
                                                                            placeholderText={this.props.intl.formatMessage({ id: "IDS_TO" })}
                                                                            selected={toDate}
                                                                            value={toDate}
                                                                            dateFormat={this.props.Login.userInfo.ssitedate}
                                                                            isClearable={false}
                                                                            onChange={(date) =>
                                                                                this.handleFilterDateChange("toDate", date)}
                                                                        />
                                                                    </Col>
                                                                </Row>
                                                                <Row>
                                                                    <Col md={12}>
                                                                        <FormSelectSearch
                                                                            name={"nprojecttypecode"}
                                                                            as={"select"}
                                                                            onChange={(event) => this.onComboChange(event, 'nprojecttypecode')}                                                            
                                                                              formLabel={ this.props.Login.settings && parseInt(this.props.Login.settings[84]) === transactionStatus.YES  ? this.props.intl.formatMessage({ id: "IDS_BIOPROJECT" }) 
                                                                               : this.props.intl.formatMessage({ id: "IDS_PROJECTTYPE" })}                     
                                                                            isMandatory={this.state.selectedRecord["nneedposition"]}
                                                                            value={this.state.selectedProjectType && this.state.selectedProjectType["nprojecttypecode"] ? this.state.selectedProjectType["nprojecttypecode"] || [] : []}
                                                                            options={this.state.masterData && (this.state.masterData.projectbarcodeconfig || [])}
                                                                            optionId={"value"}
                                                                            optionValue={"label"}
                                                                            isMulti={false}
                                                                            isDisabled={false}
                                                                            isSearchable={false}
                                                                            isClearable={false}
                                                                        />
                                                                    </Col>
                                                                </Row>
                                                            </Col>

                                                        </>
                                                    }]}
                                                    dataFor="tooltip_list_wrap"
                                                    onFilterSubmit={this.onFilterSubmit}
                                                    showFilter={this.state.showFilter}
                                                    openFilter={this.openFilter}
                                                    closeFilter={this.closeFilter}
                                                    showModalBg={(e) => this.setState({ showModalBg: e })}

                                                />
                                            </InputGroup.Append>
                                        </Col>
                                    </Row>
                                    {this.state.selectedProjectTypeList &&
                                        <Row> <Col md={12}>
                                            <DataGrid
                                                // isDownloadPDFRequired={this.state.masterData && this.state.masterData.samplestorageretrieval &&
                                                //     this.processWithGroups(this.state.masterData.samplestorageretrieval || [],
                                                //         this.state.dataStateChange ? this.state.dataStateChange : {
                                                //             take: 10,
                                                //             skip: 0
                                                //         }).data.length > 0 ?
                                                //     true : false}
                                                // isDownloadExcelRequired={this.state.masterData && this.state.masterData.samplestorageretrieval &&
                                                //     this.processWithGroups(this.state.masterData.samplestorageretrieval || [],
                                                //         this.state.dataStateChange ? this.state.dataStateChange : {
                                                //             take: 10,
                                                //             skip: 0
                                                //         }).data.length > 0 ?
                                                //     true : false}
                                                isCustomButton={true}
                                                customButtonlist={[
                                                    //     {
                                                    //     label: 'IDS_SEARCH',
                                                    //     id: {},
                                                    //     onClick: () => this.opensearch(),
                                                    //     controlname: 'faSearch'
                                                    // },
                                                    // {
                                                    //     label: 'IDS_BULKRETRIEVE',
                                                    //     id: {},
                                                    //     // hidden : this.state.userRoleControlRights.indexOf(retrievedispose) === -1,
                                                    //     onClick: () => this.openbulkretrieve(),
                                                    //     controlname: 'faRecycle'
                                                    // },

                                                    // added by sujatha v for dispose button to dispose expired samples SWSM-37 12-09-2025- start
                                                    {
                                                        label: 'IDS_DISPOSE',
                                                        id: {},
                                                        onClick: () => this.openDispose(this.state.masterData, addDisposeId, "create", "IDS_DISPOSE",
                                                            this.state.breadCrumbdata.breadcrumbprojecttype.value),
                                                        controlname: 'faRecycle',
                                                        hidden: this.state.userRoleControlRights.indexOf(sampleDispose) === -1
                                                    },
                                                    {
                                                        //label: 'IDS_RETRIEVEDISPOSE',
                                                        label: (this.props.Login.settings && parseInt(this.props.Login.settings[84]) === transactionStatus.YES) 
                                                        ? 'IDS_RETRIEVE' : 'IDS_RETRIEVEDISPOSE',
                                                        id: {},
                                                        hidden: this.state.userRoleControlRights.indexOf(retrievedispose) === -1,
                                                        onClick: () => this.openRetrieveDispose(),
                                                        controlname: 'faRecycle'
                                                    },
                                                    {
                                                        label: 'IDS_EXPORTTEMPLATE',
                                                        id: {},
                                                        hidden: this.state.userRoleControlRights.indexOf(exportTemplate) === -1,
                                                        onClick: () => this.handleExportClick(),
                                                        controlname: 'faFileExcel'
                                                    },
                                                    {
                                                        //label: 'IDS_BULKRETRIEVEDISPOSE',
                                                        label: (this.props.Login.settings && parseInt(this.props.Login.settings[84]) === transactionStatus.YES) 
                                                        ? 'IDS_RETRIEVE' : 'IDS_BULKRETRIEVEDISPOSE',
                                                        id: {},
                                                        hidden: this.state.userRoleControlRights.indexOf(bulkretievedispose) === -1,
                                                        onClick: () => this.bulkRetrieveDispose(),
                                                        controlname: 'faFileImport'
                                                    }
                                                    //End

                                                    // {
                                                    //     label: 'IDS_RETRIEVE',

                                                    //     hidden : this.state.userRoleControlRights.indexOf(retrieve) === -1,
                                                    //     onClick: () => this.openRetrieve(),
                                                    //     controlname: 'faRecycle'
                                                    // }

                                                    // {
                                                    //     label: 'IDS_DISPOSE',
                                                    //     id: {},
                                                    //     hidden : this.state.userRoleControlRights.indexOf(dispose) === -1,
                                                    //     onClick: () => this.openDispose(),
                                                    //     controlname: 'faRecycle'
                                                    // }


                                                ]}
                                                isRefreshRequired={false}
                                                // onGroupChange={this.handleGroupChange}
                                                primaryKeyField={'nsamplestoragetransactioncode'}
                                                //data={this.state.masterData &&
                                                //  this.state.masterData.samplestorageretrieval}
                                                data={
                                                    this.state.masterData && this.state.masterData.samplestorageretrieval ? this.state.masterData.samplestorageretrieval.map(item => {
                                                        let parsedData = {};
                                                        parsedData = JSON.parse(item.jsondata.value) || {};
                                                        return { ...item, ...parsedData };
                                                    }) : []}
                                                dataResult={this.state.masterData &&
                                                    this.state.masterData.samplestorageretrieval ?
                                                    process(this.state.masterData.samplestorageretrieval.map(item => {
                                                        let parsedData = {};
                                                        parsedData = JSON.parse(item.jsondata.value) || {}; return { ...item, ...parsedData };
                                                    }) || [],
                                                        this.state.dataStateChange ? this.state.dataStateChange : { skip: 0, take: 10 }) : []
                                                    // this.processWithGroups(this.state.masterData.samplestorageretrieval || [],
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
                                            // actionIcons={
                                            //     [{
                                            //         title: this.props.intl.formatMessage({ id: "IDS_ADDSAMPLE" }),
                                            //         controlname: "faPenSquare",
                                            //         hidden: false,
                                            //         objectName: "add",
                                            //         onClick: (param) => this.addSample(param, 1)
                                            //     }]}
                                            />

                                        </Col></Row>

                                    }
                                    {this.state.export ?
                                        <LocalizationProvider>
                                            <ExcelExport
                                                data={[]}
                                                collapsible={true}
                                                fileName={(this.props.Login.displayName && this.props.Login.displayName)}
                                                ref={(exporter) => {
                                                    this._excelExportHeader = exporter;
                                                }}>
                                                {[...this.state.exportFiled].map((item) =>
                                                    <ExcelExportColumn
                                                        field={item.dataField} title={this.props.intl.formatMessage({ id: item.idsName })} width={200} />
                                                )

                                                }
                                            </ExcelExport>
                                        </LocalizationProvider > : ""}


                                </>


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
                            </Col></ListWrapper> */}
                    </>}


                {
                    this.state.openModal &&
                    <SlideOutModal show={this.state.openModal}
                        closeModal={this.closeModal}
                        hideSave={this.state.isbulkretrieve ? false : true}
                        showSubmit={false}
                        needClose={this.state.loadEsign ? false : true}
                        size={this.state.isbulkretrieve || this.state.openSpreadSheet || this.state.isFilterPopup ? 'xl' : ""}
                        operation={""}
                        inputParam={this.props.Login.inputParam}
                        // modified by sujatha v for dispose button to dispose expired samples SWSM-37 12-09-2025
                        //  Added By ATE234-JK based on record was change IDS this.props.Login.settings && parseInt(this.props.Login.settings[84]) === transactionStatus.YES ?this.props.intl.formatMessage({ id: "IDS_RETRIEVE" }) :this.props.intl.formatMessage({ id: "IDS_RETRIEVEDISPOSE" }) :  
                        screenName={this.state.importRetrieveOrDispose ? (this.props.Login.settings && parseInt(this.props.Login.settings[84]) === transactionStatus.YES) ?"IDS_BUIKRETRIEVE":"IDS_BULKRETRIEVE" :
                            this.props.Login.loadEsign === true ? this.props.intl.formatMessage({ id: "IDS_ESIGN" }) :
                                this.state.isRetrieveOrDispose ? this.props.Login.settings && parseInt(this.props.Login.settings[84]) === transactionStatus.YES ? this.props.intl.formatMessage({ id: "IDS_RETRIEVE" }) : this.props.intl.formatMessage({ id: "IDS_RETRIEVEDISPOSE" }) :
                                    this.state.isDispose ? this.props.intl.formatMessage({ id: "IDS_DISPOSE" }) : this.state.isFilterPopup ? "" : this.state.isMultiSampleAdd ? this.props.intl.formatMessage({ id: "IDS_STORAGESTRUCTURE" })
                                        : this.state.editedsheetData && this.state.editedsheetData.scontainerpath}
                        onSaveClick={this.state.isFilterPopup ? this.getDynamicFilterExecuteData.bind(this) : this.onSampleMappingSaveClick}
                        esign={this.state.loadEsign}
                        // className={"wide-popup"}

                        validateEsign={this.validateEsign}
                        masterStatus={this.props.Login.masterStatus}
                        updateStore={this.props.updateStore}
                        selectedRecord={this.state.selectedRecord || {}}
                        addComponent={
                            // this.state.isbulkretrieve ?
                            //     <>
                            //         <Upload
                            //            batch={false}
                            //                multiple={false}
                            //                defaultFiles={[]}
                            //                withCredentials={false}
                            //                autoUpload={false}
                            //                onAdd={this.handleAdd}
                            //         />
                            //         <hr />
                            //         <Grid   
                            //   pageable={{ buttonCount: 4, pageSizes: this.props.Login.settings &&
                            //      this.props.Login.settings[15].split(",").map(setting => parseInt(setting)),
                            //       previousNext: false}} 
                            //         onDataStateChange={this.dataStateGridChange}
                            //         data={ process(this.state.newData || [],
                            //                         this.state.dataStateGridChange ? 
                            //                         this.state.dataStateGridChange :
                            //                          { skip: 0, take: 10 })} 
                            //         key={this.state.newData} 
                            //      />
                            //     </>
                            //     :
                            // ALPD-5120 : Added by rukshana this.state.serverTime for Sample Retrieval and Disposal screen : E-signature's date and time not displayed in popup 
                            this.state.loadEsign ?//this.props.Login.loadEsign ?
                                <Esign operation={this.props.Login.operation}
                                    formatMessage={this.props.intl.formatMessage}
                                    onInputOnChange={this.onInputOnChange}
                                    inputParam={this.props.Login.inputParam}
                                    selectedRecord={this.state.selectedRecord || {}}
                                    esignReasonList={this.state.esign || []}
                                    serverTime={this.state.serverTime || []}
                                /> :
                                this.state.isRetrieveOrDispose ?
                                    <RetrieveOrDiposeSample
                                        dynamicfields={this.state.dynamicfields}
                                        userRoleControlRights={this.state.userRoleControlRights}
                                        selectedRecord={this.state.selectedRecord || {}}
                                        controlMap={this.state.controlMap}
                                        childDataChange={this.childDataChange}
                                        CRUDSampleStorageTransaction={this.onSampleMappingSaveClick}
                                        intl={this.props.intl}
                                        userInfo={this.props.Login.userInfo}
                                        unitMapList={this.state.unitMapList}
                                        loadEsign={this.props.Login.loadEsign}
                                        isRetrieveOrDispose={this.state.isRetrieveOrDispose}
                                        breadcrumbprojecttype={this.state.breadCrumbdata.breadcrumbprojecttype}
                                    /> :
                                    // added by sujatha v for dispose button to dispose expired samples SWSM-37 12-09-2025
                                    this.state.isDispose ?
                                        <DisposeSample
                                            dynamicfields={this.state.dynamicfields}
                                            userRoleControlRights={this.state.userRoleControlRights}
                                            addComponentDataLists={this.state.addComponentDataList || []}
                                            addedComponentList={this.state.addedComponentList || []}
                                            siteSampleExpiry={this.state.siteSampleExpiry}
                                            onInputOnChange={this.onInputOnChange}
                                            onNumericInputChange={this.onNumericInputChange}
                                            // selectedProjectType={this.selectedProjectType.nprojecttypecode.value}
                                            closeModal={this.closeModal}
                                            selectedRecord={this.state.selectedRecord || {}}
                                            controlMap={this.state.controlMap}
                                            addSelectAll={this.state.addSelectAll}
                                            dataResult={this.state.dataResult ? this.state.dataResult : process(this.state.addComponentDataList || [], this.state.dataState
                                                ? this.state.dataState : { skip: 0, take: 10 })}
                                            dataState={this.state.dataState
                                                ? this.state.dataState : { skip: 0, take: 10 }}
                                            intl={this.props.intl}
                                            userInfo={this.props.Login.userInfo}
                                            loadEsign={this.props.Login.loadEsign}
                                            isDispose={this.state.isDispose}
                                            masterData={this.props.Login.masterData}
                                            breadcrumbprojecttype={this.state.breadCrumbdata.breadcrumbprojecttype}
                                            reloadData={this.reloadGrid}
                                            validateEsignforDispose={this.validateEsignforDispose}
                                        />
                                        : this.state.importRetrieveOrDispose ?
                                            <BulkRetrieveOrDiposeSample
                                                dynamicfields={this.state.dynamicfields}
                                                userRoleControlRights={this.state.userRoleControlRights}
                                                selectedRecord={this.state.selectedRecord || {}}
                                                controlMap={this.state.controlMap}
                                                childDataChange={this.childDataChange}
                                                CRUDSampleStorageTransaction={this.onSampleMappingSaveClick}
                                                intl={this.props.intl}
                                                userInfo={this.props.Login.userInfo}
                                                unitMapList={this.state.unitMapList}
                                                importRetrieveOrDispose={this.state.importRetrieveOrDispose}
                                                loadEsign={this.props.Login.loadEsign}
                                            //isRetrieveOrDispose={this.state.isRetrieveOrDispose}
                                            />
                                            : this.state.isFilterPopup ?
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
                                                :
                                                //Command by Neeraj
                                                //ALPD-4749
                                                //Fixed: Removed the store action in sample retrieval, and the screen is now fully managed through the state.
                                                // this.state.loadEsign ?//this.props.Login.loadEsign ?
                                                //     <Esign operation={this.props.Login.operation}
                                                //         formatMessage={this.props.intl.formatMessage}
                                                //         onInputOnChange={this.onInputOnChange}
                                                //         inputParam={this.props.Login.inputParam}
                                                //         selectedRecord={this.state.selectedRecord || {}}
                                                //     />
                                                //     :
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
                                                            this.state.masterData.samplestorageretrieval &&
                                                            process(this.state.masterData.samplestorageretrieval || [],
                                                                this.state.dataStateChange ? this.state.dataStateChange : { skip: 0, take: 10 }).data} />
                                                </>
                                                    :
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

    // added by sujatha v for dispose button to dispose expired samples SWSM-37 12-09-2025
    reloadGrid = () => {
        let { siteSampleExpiry } = this.state;
        const inputParam = {
            inputData: {
                "userinfo": this.props.Login.userInfo,
                "sexpirydays": siteSampleExpiry && siteSampleExpiry.siteSampleExpiryMap ?
                    siteSampleExpiry.siteSampleExpiryMap.sexpirydays : "",
                "nprojecttypecode": this.state.breadCrumbdata.breadcrumbprojecttype.value
            },
            masterData: this.state.masterData,
            classUrl: this.props.Login.inputParam.classUrl,
            methodUrl: "getExpiredSample",
            userInfo: this.props.Login.userInfo,
            displayName: this.props.Login.inputParam.displayName,
            selectedRecord: this.state.selectedRecord || {}
        };

        this.refreshGetExpiredSample(inputParam);
    }

    // added by sujatha v for dispose button to dispose expired samples SWSM-37 12-09-2025
    refreshGetExpiredSample = (inputParam) => {
        if (!inputParam.inputData.sexpirydays || inputParam.inputData.sexpirydays == "") {
            toast.info(this.props.intl.formatMessage({ id: "IDS_ENTERRETENTIONDAYS" }));
            return;
        }
        this.setState({ loading: true, importRetrieveOrDispose: false })
        let urlArray = [];
        let masterData = { ...inputParam.masterData }
        const expiredSamples = rsapi().post("samplestorageretrieval/" + inputParam.methodUrl, {
            userinfo: this.props.Login.userInfo,
            sexpirydays: inputParam.inputData.sexpirydays, nprojecttypecode: inputParam.inputData.nprojecttypecode
        });

        urlArray = [expiredSamples];
        let addComponentDataList = this.state.addComponentDataList;
        const updatedList = addComponentDataList.map(item => ({
            ...item,
            selected: false
        }));
        // let addComponentDataList = this.state.addComponentDataList;
        // const updatedList = addComponentDataList.map(({ selected, ...rest }) => rest);
        this.setState({ addComponentDataList: updatedList });

        // let addComponentDataList1 = this.props.addComponentDataList || [];
        // const updatedList1 = addComponentDataList1.map(item => ({
        //     ...item,
        //     selected: false
        // }));
        //     this.setState({ addComponentDataList1: updatedList1 });

        Axios.all(urlArray)
            .then(response => {
                let addComponentDataList = response[0].data.map(x => ({ ...x, selected: false }))

                masterData = { ...masterData, addComponentDataList: addComponentDataList || [], addComponentDataLists: response[0].data || [] };
                this.setState({
                    masterData,
                    isOpen: true,
                    activeKey: "IDS_SAMPLEDISPOSE",
                    openModal: true, isRetrieveOrDispose: false, importRetrieveOrDispose: false, isDispose: true,
                    selectedBarcodeValue: {},
                    selectedRecord: {},
                    loading: false,
                    addComponentList: [],
                    addComponentSortedList: [],
                    //addComponentDataList: || [] ,
                    addComponentDataList: addComponentDataList
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
            screenData: this.state.screenData//this.props.Login.screenData
        }
        //this.props.validateEsignCredential(inputParam, this.props.Login.importRetrieveOrDispose?"openModal":"");
        this.validateEsignCredential(inputParam, this.state.importRetrieveOrDispose ? "openModal" : "");
    }
    //ALPD-4749
    //Fixed: Removed the store action in sample retrieval, and the screen is now fully managed through the state.
    validateEsignCredential = (inputParam, modalName, action) => {
        this.setState({ loading: true })
        if (inputParam && inputParam.inputData && inputParam.inputData.userinfo) {
            inputParam.inputData["userinfo"] = {
                ...inputParam.inputData.userinfo,
                sformname: Lims_JSON_stringify(inputParam.inputData.userinfo.sformname),
                smodulename: Lims_JSON_stringify(inputParam.inputData.userinfo.smodulename),
            }
        }
        return rsapi().post("login/validateEsignCredential", inputParam.inputData)
            .then(response => {
                if (response.data.credentials === "Success") {

                    const methodUrl = inputParam["screenData"]["inputParam"]["methodUrl"];
                    inputParam["screenData"]["inputParam"]["inputData"]["userinfo"] = inputParam.inputData.userinfo;

                    if (inputParam["screenData"]["inputParam"]["inputData"][methodUrl.toLowerCase()]) {

                        delete inputParam["screenData"]["inputParam"]["inputData"][methodUrl.toLowerCase()]["esignreason"];

                        if (inputParam["screenData"]["inputParam"]["inputData"][methodUrl.toLowerCase()]) {
                            delete inputParam["screenData"]["inputParam"]["inputData"][methodUrl.toLowerCase()]["esignpassword"];
                            delete inputParam["screenData"]["inputParam"]["inputData"][methodUrl.toLowerCase()]["esigncomments"];
                            delete inputParam["screenData"]["inputParam"]["inputData"][methodUrl.toLowerCase()]["agree"];


                        }

                        // ALPD-2437 added for Type3 Component. Use selected record to clear esign values
                        if (inputParam["screenData"]["inputParam"]["selectedRecord"]) {

                            delete inputParam["screenData"]["inputParam"]["selectedRecord"]["esignreason"];
                            delete inputParam["screenData"]["inputParam"]["selectedRecord"]["esignpassword"];
                            delete inputParam["screenData"]["inputParam"]["selectedRecord"]["esigncomments"];
                            delete inputParam["screenData"]["inputParam"]["selectedRecord"]["agree"];
                        }
                    }
                    if (inputParam.screenData.inputParam.action == "createDisposeExpiredSample") {
                        return (this.CRUDExpirySampleDispose(inputParam["screenData"]["inputParam"], inputParam["screenData"]["masterData"], modalName, undefined, action))

                    } else {
                        return (this.crudMasterSampleStorageRetrieval(inputParam["screenData"]["inputParam"], inputParam["screenData"]["masterData"], modalName, undefined, action))

                    }
                }
            })
            .catch(error => {
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
            })
    }


    //ALPD-4749
    //Fixed: Removed the store action in sample retrieval, and the screen is now fully managed through the state.
    crudMasterSampleStorageRetrieval = (inputParam, masterData, modalName, defaultInput, action) => {
        this.setState({ loading: true, dynamicfields: [] })
        let requestUrl = '';
        let urlArray = [];
        if (inputParam.isFileupload) {
            const formData = inputParam.formData;
            formData.append("userinfo", JSON.stringify(inputParam.inputData.userinfo));
            requestUrl = rsapi().post(inputParam.classUrl + "/" + inputParam.operation + inputParam.methodUrl, formData);
        } else {
            requestUrl = rsapi().post(inputParam.classUrl + "/" + inputParam.operation + inputParam.methodUrl, { ...inputParam.inputData });
        }
        urlArray = [requestUrl];
        Axios.all(urlArray)
            .then(response => {
                this.setState({
                    isInitialRender: true,
                    selectedRecord: {},
                    masterData: {
                        ...masterData, ...response[0].data
                    },
                    [modalName]: false,
                    loading: false,
                    loadEsign: false,
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
                    loadEsign: false, loading: false
                });
            });
    }

    // commented by sujatha v for dispose button to dispose expired samples SWSM-37 12-09-2025
    // handlerSampleExpiryDispose = (param) => {
    //     if (!param.addedComponentList || param.addedComponentList.length === 0) {
    //         toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTSAMPLETODISPOSE" }));
    //         return;
    //     }
    //    // let selectedRecord = this.state.selectedRecord;
    //    // let selectedRecord = { ...this.state.selectedRecord };

    //     let inputParam =
    //     {
    //         addedComponentList: param.addedComponentList,
    //         nsamplestoragetransactioncode: param.nsamplestoragetransactioncode ? param.nsamplestoragetransactioncode : 0,
    //         nsamplestoragelocationcode: param.nsamplestoragelocationcode ? param.nsamplestoragelocationcode : 0,
    //         userinfo: param.userinfo,
    //         ssitename: param.ssitename,
    //         sexpirydays: String(param.sexpirydays),
    //         ssampleid: param.ssampleid,
    //         ncontrolcode: param.ncontrolcode,
    //         userRoleControlRights: param.userRoleControlRights,
    //         isRetrieve: param.isRetrieve,
    //     }

    //     this.validateEsignforDispose(inputParam, this.state.operation);
    // }

    // added by sujatha v for dispose button to dispose expired samples SWSM-37 12-09-2025
    validateEsignforDispose = (inputParam, operation) => {

        let obj = convertDateValuetoString(this.state.masterData.fromDate, this.state.masterData.toDate, this.props.Login.userInfo);
        let inputData = {};
        inputData["userinfo"] = this.props.Login.userInfo;
        inputData["addedComponentList"] = inputParam.addedComponentList;
        inputData["nsamplestoragetransactioncode"] = inputParam.nsamplestoragetransactioncode
        inputData["nsamplestoragelocationcode"] = parseInt(inputParam.nsamplestoragelocationcode)
        inputData["ssitename"] = inputParam.ssitename
        inputData["sexpirydays"] = inputParam.sexpirydays
        inputData["ssampleid"] = inputParam.ssampleid;
        inputData["isRetrieve"] = inputParam.isRetrieve;
        inputData["nprojecttypecode"] = this.state.breadCrumbdata.breadcrumbprojecttype.value || -1;
        inputData["isFilterSubmit"] = true;
        inputData["fromDate"] = obj.fromDate;
        inputData["toDate"] = obj.toDate;
        inputParam = {
            methodUrl: "DisposeExpiredSample",
            operation: "create",
            action: "createDisposeExpiredSample",
            dynamicfields: [],
            classUrl: "samplestorageretrieval",
            isInitialRender: true,
            selectedRecord: { ...this.state.selectedRecord },
            openModal: false,
            ...inputParam, inputData
        }
        const masterData = this.state.masterData;

        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, inputParam.ncontrolcode)) {
            let urlArray = [];
            const currentTimeUrl = rsapi().post("/timezone/getLocalTimeByZone", {
                "userinfo": this.props.Login.userInfo
            });
            const reasonUrl = rsapi().post("/reason/getReason", {
                "userinfo": this.props.Login.userInfo
            });

            urlArray = [reasonUrl, currentTimeUrl];

            Axios.all(urlArray)
                .then(response => {
                    const reasonMap = constructOptionList(response[0].data || [], "nreasoncode",
                        "sreason", undefined, undefined, false);
                    const reasonList = reasonMap.get("OptionList");
                    this.setState({
                        esign: reasonList,
                        serverTime: rearrangeDateFormat(this.props.Login.userInfo, response[1].data?.date),
                        loadEsign: true, screenData: { inputParam, masterData },
                        loading: false,
                        openModal: true,
                        addedComponentList: inputParam.addedComponentList
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
                });
        }

        else {
            this.CRUDExpirySampleDispose(inputParam, operation)
        }
    }

    // added by sujatha v for dispose button to dispose expired samples SWSM-37 12-09-2025
    CRUDExpirySampleDispose = (inputParam, operation) => {

        const masterData = this.state.masterData;
        this.setState({ loading: true, dynamicfields: [] })
        let requestUrl = '';
        let urlArray = [];
        requestUrl = rsapi().post(inputParam.classUrl + "/" + inputParam.operation + inputParam.methodUrl, { ...inputParam.inputData });
        urlArray = [requestUrl]
        Axios.all(urlArray)
            .then(response => {
                this.setState({
                    selectedProjectTypeList: sortData(response[0].data.selectedProjectTypeList),
                    masterData: {
                        ...this.state.masterData,
                        fromDate: rearrangeDateFormat(this.props.Login.userInfo, this.state.masterData.fromDate),
                        toDate: rearrangeDateFormat(this.props.Login.userInfo, this.state.masterData.toDate),
                        samplestorageretrieval: response[0].data.samplestorageretrieval,
                        loadEsign: false,
                    },
                    openModal: false, isFilterPopup: false,
                    isRetrieveOrDispose: false, importRetrieveOrDispose: false, isDispose: false, loadEsign: false,
                    loading: false,
                    addComponentDataList: []
                })
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
                            responseStatus: error.response
                        }

                    }
                    this.props.updateStore(UnAuthorizedAccess);
                } else if (error.response.status === 500) {
                    toast.error(error.message);
                } else {
                    toast.warn(error.response.data);
                }
                this.setState({
                    loadEsign: false, loading: false
                });
            });

    }
}
const mapStateToProps = (state) => {
    return {
        Login: state.Login
    }
}

export default connect(mapStateToProps, {
    callService, crudMaster, updateStore, validateEsignCredential
})(injectIntl(SampleStorageRetrieval));