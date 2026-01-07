import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { constructOptionList, getControlMap, onSaveMandatoryValidation, searchData, searchJsonData, showEsign, sortData, onDropAttachFileList, deleteAttachmentDropZone, create_UUID, replaceBackSlash, Lims_JSON_stringify } from '../../components/CommonScript';
//import SortableTree from 'react-sortable-tree'; 
import DataGrid from '../../components/data-grid/data-grid.component';
import {
    Utils as QbUtils,
} from "@react-awesome-query-builder/ui";
import SlideOutModal from '../../components/slide-out-modal/SlideOutModal';
import { callService } from '../../actions';
import { DEFAULT_RETURN, UN_AUTHORIZED_ACCESS } from '../../actions/LoginTypes';
import { ListWrapper } from '../../components/client-group.styles';
// import ReactTooltip from 'react-tooltip';
//import { uuid } from 'uuidv4';
import { v4 as uuid } from 'uuid';
import ConfirmMessage from '../../components/confirm-alert/confirm-message.component';
import Esign from '../audittrail/Esign';
import rsapi from '../../rsapi';
import AddSampleStorageMapping from './AddSampleStorageMapping';
import Axios from 'axios';
import Preloader from '../../components/preloader/preloader.component';
import { process } from '@progress/kendo-data-query';
//import Spreadsheet from '../../components/Spreadsheet/Spreadsheet';
import MatrixComponent from '../../components/MatrixComponent';
import FilterQueryBuilder from '../../components/FilterQueryBuilder';
//import { ReactSpreadsheetImport } from 'react-spreadsheet-import';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import { LocalizationProvider } from '@progress/kendo-react-intl';
import { ExcelExport, ExcelExportColumn } from '@progress/kendo-react-excel-export';
import ImportSampleStorageTransaction from './ImportSampleStorageTransaction';

import {
    intl
} from '../../components/App';
import { transactionStatus } from '../../components/Enumeration';


class SampleStorageTransaction extends Component {
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

            extractedColumnList: this.props.Login.settings && parseInt(this.props.Login.settings[84]) === transactionStatus.YES ?
                [
                    { "idsName": "IDS_STORAGESTRUCTURENAME", "dataField": "ssamplestoragelocationname", "width": "200px" },
                    { "idsName": "IDS_SAMPLESTORAGEPATH", "dataField": "scontainerpath", "width": "450px" },
                    { "idsName": "IDS_AVAILABLESPACE", "dataField": "navailablespace", "width": "200px" },
                    { "idsName": "IDS_NEEDPREDEFINEDSTRUCURE", "dataField": "stransdisplaystatus", "width": "200px" },
                    { "idsName": "IDS_CONTAINERTYPE", "dataField": "scontainertype", "width": "200px" },
                    { "idsName": "IDS_CONTAINERSTRUCTURENAME", "dataField": "scontainerstructurename", "width": "200px" },
                ] : [
                    { "idsName": "IDS_STORAGESTRUCTURENAME", "dataField": "ssamplestoragelocationname", "width": "200px" },
                    { "idsName": "IDS_SAMPLESTORAGEPATH", "dataField": "scontainerpath", "width": "450px" },
                    { "idsName": "IDS_AVAILABLESPACE", "dataField": "navailablespace", "width": "200px" },
                    //{ "idsName": "IDS_VISITNUMBER", "dataField": "svisitnumber", "width": "100px" },
                    { "idsName": "IDS_PRODUCT", "dataField": "sproductname", "width": "200px" },
                    { "idsName": "IDS_PROJECTTYPE", "dataField": "sprojecttypename", "width": "200px" },
                    { "idsName": "IDS_NEEDPREDEFINEDSTRUCURE", "dataField": "stransdisplaystatus", "width": "200px" },
                    { "idsName": "IDS_CONTAINERTYPE", "dataField": "scontainertype", "width": "200px" },
                    { "idsName": "IDS_CONTAINERSTRUCTURENAME", "dataField": "scontainerstructurename", "width": "200px" },
                ],

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
                group: [
                    {
                        //field: "ssamplestoragelocationname",
                        field: "sinstrumentid",
                    },
                ],
            }
        };

        let fields = {};
        if (this.state.extractedColumnList) {
            this.state.extractedColumnList.map(field => {
                if (field.dataField !== 'ssamplestoragelocationname' && field.dataField !== 'sproductname'
                    && field.dataField !== 'sprojecttypename' && field.dataField !== 'scontainertype'
                    && field.dataField !== 'scontainerstructurename'
                ) {
                    fields = {
                        ...fields,
                        [field.dataField]: {
                            "label":
                                this.props.intl.formatMessage({
                                    id: field.idsName,
                                })
                            ,
                            "type": field.dataField === 'navailablespace' ? "number" : "text",
                            "valueSources": ["value", "func"],

                            "mainWidgetProps": {
                                "valueLabel": "Name",
                                "valuePlaceholder": this.props.intl.formatMessage({
                                    id: field.idsName
                                })
                            }
                        }
                    }
                }
            });
        }
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
            sampleStorageVersionOptions, masterData, selectedRecordFilter, fields, selectedProjectType, dataStateChange, selectedInstrument } = this.state
        let bool = false;
        ///////////////////////////////
        if (this.props.Login.masterData.sampleStorageLocation !== previousProps.Login.masterData.sampleStorageLocation && this.props.Login.settings && parseInt(this.props.Login.settings[84]) !== transactionStatus.YES) {
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
                            id: "IDS_PRODUCT",
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
                            id: "IDS_PRODUCT",
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
        if (this.props.Login.masterData.projectType !== previousProps.Login.masterData.projectType) {
            let queryBuilderFreezer = [];
            bool = true;
            masterData = this.props.Login.masterData;
            this.props.Login.masterData.projectType && this.props.Login.masterData.projectType.map(
                (item) => queryBuilderFreezer.push({ "value": item.nprojecttypecode, "title": item.sprojecttypename })
            )
            // fields = {
            //     ...fields,
            //     'nprojecttypecode': {
            //         "label": this.props.intl.formatMessage({
            //             id: "IDS_PROJECTTYPE",
            //         }),
            //         "type": "select",
            //         "valueSources": ["value"],
            //         "fieldSettings": {
            //             "listValues": queryBuilderFreezer
            //         }
            //     }
            // }
            selectedProjectType = {
                label: this.props.Login.masterData.selectedProjectType &&
                    this.props.Login.masterData.selectedProjectType.sprojecttypename, value:
                    this.props.Login.masterData.selectedProjectType &&
                    this.props.Login.masterData.selectedProjectType.nprojecttypecode
            };

            const filterStorageCategorylist = constructOptionList(this.props.Login.masterData.projectType || [], "nprojecttypecode",
                "sprojecttypename", undefined, undefined, undefined);
            masterData['projectTypeOptions'] = filterStorageCategorylist.get("OptionList");

            if (this.props.Login.masterData.lstInstrument !== previousProps.Login.masterData.lstInstrument) {

                const filterInstrumentlist = constructOptionList(this.props.Login.masterData.lstInstrument || [], "ninstrumentcode",
                    "sinstrumentid", undefined, undefined, undefined);

                masterData['instrumentTypeOptions'] = filterInstrumentlist.get("OptionList");

                selectedInstrument = {
                    label: this.props.Login.masterData.selectedInstrument &&
                        this.props.Login.masterData.selectedInstrument.sinstrumentid, value:
                        this.props.Login.masterData.selectedInstrument &&
                        this.props.Login.masterData.selectedInstrument.ninstrumentcode
                };
            }


        }
        if (this.props.Login.masterData.containerType !== previousProps.Login.masterData.containerType) {
            let queryBuilderFreezer = [];
            bool = true;
            this.props.Login.masterData.containerType && this.props.Login.masterData.containerType.map(
                (item) => queryBuilderFreezer.push({ "value": item.ncontainertypecode, "title": item.scontainertype })
            )
            fields = {
                ...fields,
                'ncontainertypecode': {
                    "label": this.props.intl.formatMessage({
                        id: "IDS_CONTAINERTYPE",
                    }),
                    "type": "select",
                    "valueSources": ["value"],
                    "fieldSettings": {
                        "listValues": queryBuilderFreezer
                    }
                }
            }

        } if (this.props.Login.masterData.containerStructure !== previousProps.Login.masterData.containerStructure) {
            let queryBuilderFreezer = [];
            bool = true;
            this.props.Login.masterData.containerStructure && this.props.Login.masterData.containerStructure.map(
                (item) => queryBuilderFreezer.push({ "value": item.ncontainerstructurecode, "title": item.scontainerstructurename })
            )
            fields = {
                ...fields,
                'ncontainerstructurecode': {
                    "label": this.props.intl.formatMessage({
                        id: "IDS_CONTAINERSTRUCTURENAME",
                    }),
                    "type": "select",
                    "valueSources": ["value"],
                    "fieldSettings": {
                        "listValues": queryBuilderFreezer
                    }
                }
            }

        }
        //ATE234 Janakumar ALPDJ21-37 Product Enhancement for sample storage & Repository. -Start
        // if (this.props.Login.masterData.lstInstrument !== previousProps.Login.masterData.lstInstrument && parseInt(this.props.Login.settings[84]) === transactionStatus.YES) {
        //     let queryBuilderFreezer = [];
        //     bool = true;
        //     this.props.Login.masterData.lstInstrument && this.props.Login.masterData.lstInstrument.map(
        //         (item) => queryBuilderFreezer.push({ "value": item.ninstrumentcode, "title": item.sinstrumentid })

        //     )
        //     fields = {
        //         ...fields,
        //         'ninstrumentcode': {
        //             "label": this.props.intl.formatMessage({
        //                 id: "IDS_STROAGENAMEORID",
        //             }),
        //             "type": "select",
        //             "valueSources": ["value"],
        //             "fieldSettings": {
        //                 "listValues": queryBuilderFreezer
        //             }
        //         }
        //     }
        // }
        //ATE234 Janakumar ALPDJ21-37 Product Enhancement for sample storage & Repository. -- End
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
            filterData = this.generateBreadCrumData(this.props.Login.masterData);

        }
        if (this.state.masterData !== previousState.masterData) {
            bool = true;
            filterData = this.generateBreadCrumData(this.state.masterData);
            //ALPD-4496 janakumar  pagination  work 
            let group = this.state.dataStateChange.group !== undefined ? this.state.dataStateChange.group : [];
            dataStateChange = { take: 10, skip: 0, group: group }

        }
        if (this.props.Login.masterData.sampleStoragetransaction !== previousProps.Login.masterData.sampleStoragetransaction) {
            bool = true;

            masterData['sampleStoragetransaction'] =
                (this.props.Login.masterData.sampleStoragetransaction && this.props.Login.masterData.sampleStoragetransaction.sampleStoragetransaction)
                || [];
        }

        if (bool) {
            this.setState({
                storageCategoryOptions, filterData,
                selectedRecord, controlMap,
                userRoleControlRights, storageLocationOptions, dataStateChange,
                sampleStorageVersionOptions, masterData, selectedRecordFilter, fields, selectedProjectType, selectedInstrument
            });
        }
        //ATE234 Janakumar ALPDJ21-37 Product Enhancement for sample storage & Repository. Start
        if (this.props.Login.settings && parseInt(this.props.Login.settings[84]) === transactionStatus.YES) {
            const extractedColumnList = [...this.state.extractedColumnList]; // create a shallow copy

            if (extractedColumnList[1].idsName !== "IDS_STROAGENAMEORID") {
                extractedColumnList.splice(1, 0,
                    { idsName: "IDS_STROAGENAMEORID", dataField: "sinstrumentid", width: "200px" }
                );

                this.setState({ extractedColumnList })
            }
            if (this.state.fields !== undefined && this.state.fields['sstorageconditionname'] === undefined &&
                this.state.fields['sinstrumentid'] === undefined) {

                if (this.state.fields !== undefined) {
                    let fields = { ...this.state.fields }; // make a shallow copy

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

        }


        //ATE234 Janakumar ALPDJ21-37 Product Enhancement for sample storage & Repository. - End

        // if (this.state.masterData.ExcelImport!== previousState.masterData.ExcelImport) {
        //     this.setState({ ExcelImport: this.state.masterData.ExcelImport })
        // }

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
        //      if (!this.state.isFilterPopup) {
        //         this.getDynamicFilterExecuteData(2)
        //    }
        this.setState({
            selectedRecord, ExcelImport: false,
            openModal: false, isInitialRender: true
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
        } else if (this.state.ExcelImport !== undefined && this.state.ExcelImport === true) {
            this.singlesampleimport(saveType, formRef);
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
    // opensearch=()={

    // }

    opensearch = () => {
        this.setState({
            openModal: true, isFilterPopup: true, openSpreadSheet: false, selectedRecord: { ...this.state.submittedselectedRecord } ||
                { ...this.state.selectedRecord }
        })
    }
    addSample = (param, nflag) => {
        this.setState({ loading: true })
        let urlArray = [];
        let groupedArray = this.processWithGroups(this.state.masterData.sampleStoragetransaction || [],
            this.state.dataStateChange ? this.state.dataStateChange : {
                take: 10,
                skip: 0
            }).data;
        const url1 = rsapi().post("samplestoragetransaction/getsamplestoragemappingSheetData",
            {
                isMultiSampleAdd: (nflag === 2) ? true : false,
                nsamplestoragemappingcode:
                    (nflag === 2) ? groupedArray.map(groupedItem => groupedItem.items.map(item => item.nsamplestoragemappingcode)).join(",")
                        : param.nsamplestoragemappingcode.toString()
            });
        urlArray = [url1];
        Axios.all(urlArray)
            .then(response => {
                if (nflag === 2) {
                    this.setState({
                        sheetData: JSON.parse(response[0].data.sheetData),
                        AdditionalFieldsComponentData: JSON.parse(response[0].data.AdditionalFieldsComponentData),
                        openModal: true, isMultiSampleAdd: true, openSpreadSheet: true,//, editedsheetData: param, Rows: param.nrow, columns: param.ncolumn,
                        loading: false
                    })
                } else {
                    this.setState({
                        sheetData: JSON.parse(response[0].data.sheetData),
                        AdditionalFieldsComponentData: JSON.parse(response[0].data.AdditionalFieldsComponentData),
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
    handleImportClick = () => {
        if (this.props.Login.masterData.sampleStorageLocation !== undefined) {

            this.setState({
                loading: false,
                openModal: true,
                ExcelImport: true,
                isMultiSampleAdd: false, openSpreadSheet: false,
                screenName: this.props.intl.formatMessage({ id: "IDS_IMPORTEXCEL" })

            });
        } else {
            toast.warn(
                this.props.intl.formatMessage({
                    id: "IDS_PROJECTTYPE",
                })
            );


        }
    }

    handleExportClick = () => {
        let exportFiled =
            [
                { "idsName": "IDS_PROJECTTYPECODE", "dataField": "nsamplestoragelocationcode", "width": "200px", "staticField": true },
                { "idsName": "IDS_PROJECTTYPE", "dataField": "nsamplestoragemappingcode", "width": "200px", "staticField": true },
                { "idsName": "IDS_STORAGESTRUCTURECODE", "dataField": "ssamplestoragelocationname", "width": "200px", "staticField": true },
                { "idsName": "IDS_STROAGENAMEORID", "dataField": "ssamplestoragelocationname", "width": "200px", "staticField": true },
                { "idsName": "IDS_SAMPLESTORAGEPATHCODE", "dataField": "scontainerpath", "width": "200px", "staticField": true },
                { "idsName": "IDS_SAMPLESTORAGEPATH", "dataField": "scontainerpath", "width": "200px", "staticField": true },
                { "idsName": "IDS_SAMPLEPOSITION", "dataField": "spositionvalue", "width": "200px", "staticField": true },
                { "idsName": "IDS_SAMPLEID", "dataField": "", "width": "200px", "staticField": true },
                { "idsName": "IDS_METADATA", "dataField": "", "width": "200px", "staticField": true },
            ];
        return exportFiled;
    }
    singlesampleexport = (param, nflag) => {
        this.setState({ loading: true });
        let urlArray = [];
        let groupedArray = this.processWithGroups(
            this.state.masterData.sampleStoragetransaction || [],
            this.state.dataStateChange ? this.state.dataStateChange : { take: 10, skip: 0 }
        ).data;
        //ATE234 Janakumar ALPD-6059 : SUP-1148 > ICGEB > Not able to view all samples stored in Plate 9 (Location- DNA Plates > FZ01 > Shelf-1 > Plate-9)-L4, check description
        //ATE234 Janakumar ALPDJ21-37 Product Enhancement for sample storage & Repository.
        const url1 = rsapi().post("samplestoragetransaction/getSingleExport", {
            ndirectionmastercode: param.ndirectionmastercode,
            nsamplestoragemappingcode: param.nsamplestoragemappingcode,
            nprojecttypecode: param.nprojecttypecode,
            nsamplestoragelocationcode: param.nsamplestoragelocationcode,
            sprojecttypename: param.sprojecttypename,
            ssamplestoragelocationname: param.ssamplestoragelocationname,
            nsamplestoragecontainerpathcode: param.nsamplestoragecontainerpathcode,
            scontainerpath: param.scontainerpath,
            nquantity: param.nquantity,
            sunitname: param.sunitname,
            nrow: param.nrow,
            ncolumn: param.ncolumn,
            ssampleid: "",
            scomments: "",
            userinfo: this.props.Login.userInfo
        });

        urlArray = [url1];

        Axios.all(urlArray)
            .then(response => {
                let value = "";
                if (response[0].data.rtn === "Success") {
                    value = response[0].data["exportFileViewUrl"];


                    const win = window.open(value);
                    if (win) {
                        win.focus();
                    } else {
                        toast.warn(intl.formatMessage("IDS_PLEASEALLOWPOPUPSFORTHISWEBSITE"));
                    }

                } else {
                    if (response[0].data.rtn) {
                        toast.warn(intl.formatMessage({ id: response[0].data.rtn }));
                    }
                }

                this.setState({
                    openModal: false,
                    isMultiSampleAdd: false,
                    openSpreadSheet: false,
                    editedsheetData: param,
                    Rows: param.nrow,
                    columns: param.ncolumn,
                    loading: false
                });
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
                } else if (error.response && error.response.status === 500) {
                    toast.error(error.message);
                } else {
                    toast.warn(error.response ? error.response.data : error.message);
                }
                this.setState({ loading: false });
            });
    }



    singlesampleimport = () => {
        this.setState({ loading: true })
        let urlArray = [];
        let selectedRecord = this.state.selectedRecord || {}
        const acceptedFiles = this.state.selectedRecord.sfilename;
        const formData = new FormData();

        if (acceptedFiles && acceptedFiles.length === 1) {
            if (acceptedFiles && Array.isArray(acceptedFiles) && acceptedFiles.length > 0) {
                acceptedFiles.forEach((file, index) => {
                    const tempData = {};
                    tempData['nprojecttypecode'] = this.state.selectedProjectType && this.state.selectedProjectType.value || -1;

                });
                formData.append("nprojecttypecode", this.state.selectedProjectType.value || -1);
                formData.append("filecount", acceptedFiles.length);
                formData.append("ImportFile", selectedRecord['sfilename'][0])
                formData.append("userinfo", JSON.stringify(this.props.Login.userInfo));


                const url1 = rsapi().post("samplestoragetransaction/getImportData", formData);
                urlArray = [url1];
                Axios.all(urlArray)
                    .then(response => {

                        const selectedRecord = {};
                        this.setState({
                            selectedRecord: selectedRecord, ExcelImport: false,
                            openModal: false, isMultiSampleAdd: false,
                            loading: false
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


            } else {
                this.setState({ loading: false });
                toast.warn(this.props.intl.formatMessage({ id: "IDS_PLEASESELECTTHEFILE" }))
            }
        } else {
            this.setState({ loading: false });
            toast.warn(this.props.intl.formatMessage({ id: "IDS_PLEASESELECTTHEFILE" }))
        }
    }

    onComboChange = (comboData, fieldName) => {
        const selectedRecord = this.state.selectedRecord || {};
        let selectedRecordFilter = this.state.selectedRecordFilter || {};
        let selectedProjectType = this.state.selectedProjectType;
        let selectedInstrument = this.state.selectedInstrument;
        let masterData = this.state.masterData;
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
            if (selectedProjectType.value !== comboData.value) {
                masterData = {
                    ...masterData,
                    sampleStoragetransaction: []
                }
            }
            if (this.props.Login.settings && parseInt(this.props.Login.settings[84]) === transactionStatus.YES) {
                return this.getInstrument({
                    userinfo: this.props.Login.userInfo,
                    nprojecttypecode: comboData.value
                }, fieldName, comboData);
            }
            this.setState({ masterData, selectedProjectType: { label: comboData.label, value: comboData.value } })

        } else if (fieldName === 'ninstrumentcode') {

            this.setState({ loading: true })

            let obj = {
                ninstrumentcode: comboData.value || -1,
                label: 'sampleStoragetransaction', valuemember: 'nsamplestoragemappingcode',
                filterquery: " ninstrumentcode =" + comboData.value +
                    " and nprojecttypecode=" + this.state.selectedProjectType.value + " "
                , source: 'view_samplestoragelocation', userinfo: this.props.Login.userInfo
            }


            rsapi().post("/samplestoragetransaction/getdynamicfilterexecutedata", obj)
                .then(response => {
                    // Initialize or reset queryBuilderFreezer as empty array
                    const queryBuilderFreezer = [];

                    // // Safely build listValues for select field
                    // if (response.data && Array.isArray(response.data.sampleType)) {
                    //     response.data.sampleType.forEach(item => {
                    //         queryBuilderFreezer.push({ value: item.nproductcode, title: item.sproductname });
                    //     });
                    // }

                    if (response && response.data && Array.isArray(response.data.sampleType) &&
                        response.data.sampleType.length > 0) {
                        response.data.sampleType.forEach(item => {
                            // Check if keys exist in each item, fallback to defaults if not
                            const value = item.nsampletypecode ?? null;
                            const title = item.sproductname ?? "Unknown Product";

                            queryBuilderFreezer.push({ value, title });
                        });
                    }

                    let fields = this.state.fields;
                    // Update fields with select options
                    fields = {
                        ...fields,
                        nsampletypecode: {
                            label: this.props.intl.formatMessage({ id: "IDS_PRODUCT" }),
                            type: "select",
                            valueSources: ["value"],
                            fieldSettings: {
                                listValues: queryBuilderFreezer
                            }
                        }
                    };

                    //if (selectedInstrument.value !== comboData.value) {
                    masterData = {
                        ...masterData,
                        //sampleStoragetransaction: []
                        ...response.data,
                    }
                    // }
                    this.setState({
                        submittedselectedRecord: [], masterData, fields,
                        selectedInstrument: { label: comboData.label, value: comboData.value }, loading: false
                    })
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
                    }
                    else {
                        toast.warn(error.response.data);
                    }
                    this.setState({ loading: false })
                })
        }


        // else if (fieldName === 'ninstrumentcode') {

        //     let obj = { 
        //         label: 'sampleStoragetransaction', valuemember: 'nsamplestoragemappingcode',
        //         filterquery: nflag === 2 ?
        //             this.state.submittedselectedRecord.filterquery + " and nprojecttypecode=" + this.state.selectedProjectType.value + " and npartitioncode=" + npartitioncode + ""
        //             :
        //             selectedRecord.filterquery + " and nprojecttypecode=" + this.state.selectedProjectType.value + " and npartitioncode=" + npartitioncode + ""
        //         , source: 'view_samplestoragelocation', userinfo: this.props.Login.userInfo
        //     }
        //     let urlArray = [];
        //     const url1 = rsapi().post("/samplestoragetransaction/getdynamicfilterexecutedata", obj);

        //     if (selectedInstrument.value !== comboData.value) {
        //         masterData = {
        //             ...masterData,
        //             sampleStoragetransaction: []
        //         }
        //     }
        //     this.setState({ masterData, selectedInstrument: { label: comboData.label, value: comboData.value } })
        // }
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
        const url1 = rsapi().post("samplestoragetransaction/getsamplestoragetransaction", {
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
        const url1 = rsapi().post("samplestoragetransaction/getActiveSampleStorageMappingById", {
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
        const url1 = rsapi().post("samplestoragetransaction/" + operation + "SampleStorageTransaction", inputParam);
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
        const url1 = rsapi().post("samplestoragetransaction/getsamplestoragemapping", inputParamData);

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
        const url1 = rsapi().post("samplestoragetransaction/getsamplestoragemapping", inputParamData);
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
                        //   sampleStoragetransaction: response[0].data['sampleStoragetransaction'],
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
        const url1 = rsapi().post("samplestoragetransaction/addSampleStorageMapping", inputParamData);

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
    getInstrument(inputData, fieldName, comboData) {
        this.setState({ loading: true })

        let urlArray = [];
        const url1 = rsapi().post("samplestoragetransaction/getInstrument", inputData);

        urlArray = [url1];
        Axios.all(urlArray)
            .then(response => {

                let masterData = this.state.masterData;
                const filterInstrumentlist = constructOptionList(response[0].data.lstInstrument || [], "ninstrumentcode",
                    "sinstrumentid", undefined, undefined, undefined);

                masterData['instrumentTypeOptions'] = filterInstrumentlist.get("OptionList");

                masterData['sampleStoragetransaction'] = [];

                this.setState({
                    submittedselectedRecord: [], masterData, loading: false,
                    selectedProjectType: { label: comboData.label, value: comboData.value },
                    selectedInstrument: { label: response[0].data.selectedInstrument.sinstrumentid, value: response[0].data.selectedInstrument.ninstrumentcode }
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
        const url1 = rsapi().post("samplestoragetransaction/getContainerStructure", inputParamData);

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
        const mandatoryFields = this.state.openSpreadSheet ? [] : (this.state.selectedRecord["nneedposition"] === undefined ||
            this.state.selectedRecord["nneedposition"] === false) && this.state.ExcelImport === false ? [
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
        ] : this.state.ExcelImport ? [
            {
                "idsName": "IDS_FILE",
                "dataField": "sfilename", "mandatoryLabel":
                    "IDS_SELECT", "controlType": "selectbox"
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
        const url1 = rsapi().post("samplestoragetransaction/approveSampleStorageMapping", inputParamData);

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
        let npartitioncode = parseInt(this.props.Login.settings[84]) === transactionStatus.YES ? this.state?.selectedInstrument?.value : this.state?.selectedProjectType?.value;
        if (nflag === 2 ? true : (selectedRecord.filterquery && selectedRecord.filterquery !== "" && npartitioncode !== undefined)) {
            let isFilterEmpty = this.checkFilterIsEmptyQueryBuilder(selectedRecord.filterQueryTreeStr);
            if (isFilterEmpty) {
                //let npartitioncode = parseInt(this.props.Login.settings[84]) === transactionStatus.YES ? this.state.selectedInstrument.value : this.state.selectedProjectType.value;
                this.setState({ loading: true })
                let obj = {// ...inputParam.component, 
                    label: 'sampleStoragetransaction', valuemember: 'nsamplestoragemappingcode',
                    filterquery: nflag === 2 ?
                        (this.state?.submittedselectedRecord?.filterquery ? this.state.submittedselectedRecord.filterquery + " and " : "") + "nprojecttypecode=" + this.state.selectedProjectType.value + " and npartitioncode=" + npartitioncode + ""
                        :
                        selectedRecord.filterquery + " and nprojecttypecode=" + this.state.selectedProjectType.value + " and npartitioncode=" + npartitioncode + ""
                    , source: 'view_samplestoragelocation', userinfo: this.props.Login.userInfo
                }
                let urlArray = [];
                const url1 = rsapi().post("/samplestoragetransaction/getdynamicfilterexecutedata", obj);
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
                toast.warn(this.props.intl.formatMessage({ id: "IDS_PROVIDEONEMOREFILTERDATAWITHNOTNULLOPERATOR" }));
            }
        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTAFILTER" }));

        }
    }

    fetchRecord = (data) => {
        this.setState({ loading: true })
        let selectedRecord = this.state.selectedRecord
        let inputParamData = {
            nsamplestoragelocationcode: this.state.masterData.selectedSampleStorageLocation.nsamplestoragelocationcode,
            userinfo: this.props.Login.userInfo,
        }
        let urlArray = [];
        const url1 = rsapi().post("samplestoragetransaction/addSampleStorageMapping", inputParamData);

        const url2 = rsapi().post("product/getProduct",
            { 'userinfo': this.props.Login.userInfo });

        const url3 = rsapi().post("samplestoragetransaction/getEditSampleStorageMapping",
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
        let tree = QbUtils.getTree(immutableTree);
        tree = QbUtils.queryString(immutableTree, config, true);
        selectedRecord['filterquery'] = QbUtils.sqlFormat(immutableTree, config);
        this.setState({ tree: immutableTree, config: config, selectedRecord: { ...selectedRecord } });

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
    //     const newDataState = this.processWithGroups(this.state.masterData.sampleStoragetransaction || [], this.state.dataStateChange, event.group);
    //     this.setState({
    //         masterData: { ...this.state.masterData, sampleStoragetransaction: newDataState },
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
    render() {

        const addId = this.state.controlMap.has("Add SampleStorageTransaction") && this.state.controlMap.get("Add SampleStorageTransaction").ncontrolcode;
        const editId = this.state.controlMap.has("Edit SampleStorageLocation") && this.state.controlMap.get("Edit SampleStorageLocation").ncontrolcode;
        const deleteId = this.state.controlMap.has("Delete SampleStorageLocation") && this.state.controlMap.get("Delete SampleStorageLocation").ncontrolcode;
        const copyId = this.state.controlMap.has("Copy SampleStorageLocation") && this.state.controlMap.get("Copy SampleStorageLocation").ncontrolcode;
        const approveId = this.state.controlMap.has("Approve SampleStorageLocation") && this.state.controlMap.get("Approve SampleStorageLocation").ncontrolcode;

        const addMultipleSampleId = this.state.controlMap.has("AddMultipleSample") && this.state.controlMap.get("AddMultipleSample").ncontrolcode;
        const addSampleId = this.state.controlMap.has("AddSample") && this.state.controlMap.get("AddSample").ncontrolcode;
        const singleExport = this.state.controlMap.has("ExportExcel") && this.state.controlMap.get("ExportExcel").ncontrolcode;
        const singleImport = this.state.controlMap.has("ImportExcel") && this.state.controlMap.get("ImportExcel").ncontrolcode;


        const filterParam = {
            inputListName: "sampleStorageLocation", selectedObject: "selectedSampleStorageLocation", primaryKeyField: "nsamplestoragelocationcode",
            fetchUrl: "sampleStoragetransaction/getActiveSampleStorageMappingById",
            fecthInputObject: { userinfo: this.props.Login.userInfo },
            masterData: this.props.Login.masterData,
            searchFieldList: ["ssamplestoragelocationname"]
        };

        const breadCrumbData = this.state.filterData || [];

        const confirmMessage = new ConfirmMessage();
        return (
            <>
                <Preloader loading={this.state.loading} />
                <ListWrapper className="client-list-content">
                    {


                        <Col md={12}>
                            <Row>
                                <Col md={3}>
                                    <FormSelectSearch
                                        name={"nprojecttypecode"}
                                        as={"select"}
                                        onChange={(event) => this.onComboChange(event, 'nprojecttypecode')}
                                        formLabel={this.props.intl.formatMessage({ id: "IDS_PROJECTTYPE" })}
                                        isMandatory={false}
                                        value={this.state.selectedProjectType ? this.state.selectedProjectType || [] : []}
                                        options={this.state.masterData && this.state.masterData.projectTypeOptions || []}
                                        optionId={"value"}
                                        optionValue={"label"}
                                        isMulti={false}
                                        isDisabled={false}
                                        isSearchable={false}
                                        isClearable={false}
                                    />
                                </Col>
                                {
                                    parseInt(this.props.Login.settings[84]) === transactionStatus.YES &&
                                    <Col md={3}>
                                        <FormSelectSearch
                                            name={"ninstrumentcode"}
                                            as={"select"}
                                            onChange={(event) => this.onComboChange(event, 'ninstrumentcode')}
                                            formLabel={this.props.intl.formatMessage({ id: "IDS_STROAGENAMEORID" })}
                                            isMandatory={false}
                                            value={this.state.selectedInstrument ? this.state.selectedInstrument || [] : []}
                                            options={this.state.masterData && this.state.masterData.instrumentTypeOptions || []}
                                            optionId={"value"}
                                            optionValue={"label"}
                                            isMulti={false}
                                            isDisabled={false}
                                            isSearchable={false}
                                            isClearable={false}
                                        />
                                    </Col>
                                }

                            </Row><Row>
                                <Col md={12}>
                                    <DataGrid
                                        // isDownloadPDFRequired={this.state.masterData && this.state.masterData.sampleStoragetransaction &&
                                        //     this.processWithGroups(this.state.masterData.sampleStoragetransaction || [],
                                        //         this.state.dataStateChange ? this.state.dataStateChange : {
                                        //             take: 10,
                                        //             skip: 0
                                        //         }).data.length > 0 ?
                                        //     true : false}
                                        //ATE234 Janakumar ALPD-5577 Sample Storage-->while download the pdf, screen getting freezed
                                        isDownloadPDFRequired={false}
                                        isDownloadExcelRequired={this.state.masterData && this.state.masterData.sampleStoragetransaction &&
                                            this.processWithGroups(this.state.masterData.sampleStoragetransaction || [],
                                                this.state.dataStateChange ? this.state.dataStateChange : {
                                                    take: 10,
                                                    skip: 0
                                                }).data.length > 0 ?
                                            true : false}
                                        isRefreshRequired={this.state.masterData && this.state.masterData.sampleStoragetransaction &&
                                            this.processWithGroups(this.state.masterData.sampleStoragetransaction || [],
                                                this.state.dataStateChange ? this.state.dataStateChange : {
                                                    take: 10,
                                                    skip: 0
                                                }).data.length > 0 ?
                                            true : false}
                                        reloadData={(e) => this.getDynamicFilterExecuteData(2)}
                                        isCustomButton={true}
                                        customButtonlist={
                                            this.state.masterData && this.state.masterData.sampleStoragetransaction &&
                                                this.processWithGroups(this.state.masterData.sampleStoragetransaction || [],
                                                    this.state.dataStateChange ? this.state.dataStateChange : {
                                                        take: 10,
                                                        skip: 0
                                                    }).data.length > 0 ?
                                                [
                                                    {
                                                        label: 'IDS_IMPORTEXCEL',
                                                        id: {},
                                                        hidden: this.state.userRoleControlRights.indexOf(singleImport) === -1,
                                                        onClick: () => this.handleImportClick({}, 2),
                                                        controlname: 'faFileImport'
                                                    },

                                                    {
                                                        label: 'IDS_ADDSAMPLETOMULTIPLEBOX',
                                                        id: {},
                                                        hidden: this.state.userRoleControlRights.indexOf(addMultipleSampleId) === -1,
                                                        onClick: () => this.addSample({}, 2),
                                                        controlname: 'faBoxes'
                                                    },
                                                    {
                                                        label: 'IDS_SEARCH',
                                                        id: {},
                                                        onClick: () => this.opensearch(),
                                                        controlname: 'faSearch'
                                                    }] : [{
                                                        label: 'IDS_SEARCH',
                                                        id: {},
                                                        onClick: () => this.opensearch(),
                                                        controlname: 'faSearch'
                                                    }]}
                                        cellRender={this.cellRender}
                                        group={this.state.group || []}
                                        // onGroupChange={this.handleGroupChange}
                                        primaryKeyField={'nsamplestoragemappingcode'}
                                        groupable={true}
                                        groupfooter={true}
                                        aggregateLabel={'IDS_AVAILABLESPACE'}
                                        aggregatedColumn={'navailablespace'}
                                        data={this.state.masterData &&
                                            this.state.masterData.sampleStoragetransaction}
                                        dataResult={
                                            // process(this.state.masterData.sampleStoragetransaction || [],
                                            //     this.state.dataStateChange ? this.state.dataStateChange : { skip: 0, take: 10 })
                                            this.state.masterData && this.state.masterData.sampleStoragetransaction ? this.processWithGroups(this.state.masterData.sampleStoragetransaction || [],
                                                this.state.dataStateChange ? this.state.dataStateChange : {
                                                    take: 10,
                                                    skip: 0
                                                }) : []


                                            // this.state.masterData && this.state.masterData.sampleStoragetransaction
                                            //     ? (
                                            //         this.state.masterData.sampleStoragetransaction.length > this.state.dataStateChange.skip
                                            //             ? this.state.dataStateChange.skip = 0
                                            //             : this.state.dataStateChange,
                                            //         this.processWithGroups(
                                            //             this.state.masterData.sampleStoragetransaction,
                                            //             this.state.dataStateChange || { take: 10, skip: 0 }
                                            //         )
                                            //     )
                                            //     : []
                                        }
                                        dataState={this.state.dataStateChange ? this.state.dataStateChange : { skip: 0, take: 10 }}
                                        dataStateChange={this.dataStateChange}
                                        extractedColumnList={this.state.extractedColumnList}
                                        controlMap={this.state.controlMap}
                                        userRoleControlRights={this.state.userRoleControlRights}
                                        userInfo={this.props.Login.userInfo}
                                        deleteRecord={this.deleteRecord}
                                        // addRecord={() => this.openStorageMapping()}
                                        pageable={true}
                                        scrollable={'scrollable'}
                                        // isComponent={true}
                                        gridHeight={'600px'}
                                        isActionRequired={true}
                                        isToolBarRequired={true}
                                        actionIcons={
                                            [{
                                                title: this.props.intl.formatMessage({ id: "IDS_EXPORTEXCEL" }),
                                                controlname: "faFileExcel",
                                                hidden: this.state.userRoleControlRights.indexOf(singleExport) === -1,
                                                objectName: "export",
                                                onClick: (param) => this.singlesampleexport(param, 1)
                                            },
                                            {
                                                title: this.props.intl.formatMessage({ id: "IDS_ADDSAMPLETOABOX" }),
                                                controlname: "faBox",
                                                hidden: this.state.userRoleControlRights.indexOf(addSampleId) === -1,
                                                objectName: "add",
                                                onClick: (param) => this.addSample(param, 1)
                                            }]}
                                    /></Col></Row>
                        </Col>

                    }
                    {this.state.export ?
                        <LocalizationProvider>
                            {/* <ExcelExport
                                data={[]}
                                collapsible={true}
                                //fileName={this.props.Login.masterData && this.props.Login.masterData.realProjectType.label + "_" + this.props.Login.masterData.realBarcodeConfig.label + "_" + new Date()}
                                ref={(exporter) => {
                                    this._excelExportHeader = exporter;
                                }}>
                                {this.props.Login.masterData.jsondataBarcodeFields && this.props.Login.masterData.jsondataBarcodeFields.map((item, index) =>
                                    item.sfieldname !== 'Barcode Id' && (
                                        <ExcelExportColumn
                                            field={item.sfieldname} title={(item.sfieldname)} width={200} />


                                    ))

                                }

                            </ExcelExport> */}
                            <ExcelExport
                                data={[]}
                                collapsible={true}
                                //fileName={`${masterData?.realProjectType?.label || 'Project'}_${masterData?.realBarcodeConfig?.label || 'Barcode'}_${new Date().toISOString()}`}
                                ref={(exporter) => { this._excelExport = exporter; }}
                            >
                                {this.state.samplepositionvalues.map((item, index) => (
                                    item.sfieldname !== 'samplepositionvalues' && (
                                        <ExcelExportColumn
                                            key={index}
                                            field={item.sfieldname}
                                            title={item.sfieldname}
                                            width={200}
                                        />
                                    )
                                ))}
                            </ExcelExport>
                        </LocalizationProvider > : ""}

                </ListWrapper>

                {
                    this.state.openModal &&
                    <SlideOutModal show={this.state.openModal}
                        closeModal={this.closeModal}
                        hideSave={true}
                        needClose={this.state.ExcelImport ? false : this.state.isFilterPopup ? true : false}
                        showSubmit={this.state.openSpreadSheet ? false : true}
                        size={this.state.openSpreadSheet || this.state.isFilterPopup ? 'xl' : ""}
                        operation={""}
                        inputParam={this.props.Login.inputParam}
                        // screenName={this.state.isFilterPopup ? "" :
                        //     this.state.isMultiSampleAdd ? this.props.intl.formatMessage({ id: "IDS_SAMPLESTORAGE" })
                        //         : this.state.editedsheetData && this.state.editedsheetData.scontainerpath}
                        screenName={this.state.ExcelImport ? this.props.intl.formatMessage({ id: "IDS_IMPORTEXCEL" }) : this.state.isFilterPopup ?
                            "" : this.state.isMultiSampleAdd ? this.props.intl.formatMessage({ id: "IDS_SAMPLESTORAGE" }) :
                                this.state.editedsheetData && this.state.editedsheetData.scontainerpath}
                        onSaveClick={this.state.isFilterPopup ? this.getDynamicFilterExecuteData.bind(this) : this.onSampleMappingSaveClick}
                        esign={this.props.Login.loadEsign}
                        // className={"wide-popup"}

                        validateEsign={this.validateEsign}
                        masterStatus={this.props.Login.masterStatus}
                        updateStore={this.props.updateStore}
                        selectedRecord={this.state.selectedRecord || {}}
                        addComponent={
                            this.state.isFilterPopup ?
                                <FilterQueryBuilder
                                    fields={this.state.fields}
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
                                        {/* <Spreadsheet
                                    data={this.state.placedSample}
                                    Rows={this.state.Rows || 1}
                                    columns={this.state.columns || 1}
                                /> */}
                                        <>
                                            <MatrixComponent
                                                updateStore={this.props.updateStore}
                                                intl={this.props.intl}
                                                Rows={this.state.Rows || 1}
                                                AdditionalFieldsComponentData={this.state.AdditionalFieldsComponentData}
                                                userInfo={this.props.Login.userInfo}
                                                columns={this.state.columns || 1}
                                                selectedRecord={this.state.selectedRecord.sheetData || {}}
                                                sheetData={this.state.sheetData || {}}
                                                isMultiSampleAdd={this.state.isMultiSampleAdd}
                                                childSheetDataChange={this.childSheetDataChange}
                                                editedsheetData={this.state.editedsheetData}
                                                nbarcodedescription={this.props.Login.settings && parseInt(this.props.Login.settings[36])}
                                                nbarcodeLength={this.props.Login.settings && parseInt(this.props.Login.settings[37])}
                                                sbarcodeboxWidth={this.props.Login.settings && this.props.Login.settings[38]}
                                                multipleSheetData={this.state.masterData &&
                                                    this.state.masterData.sampleStoragetransaction &&
                                                    process(this.state.masterData.sampleStoragetransaction || [],
                                                        this.state.dataStateChange ? this.state.dataStateChange : { skip: 0, take: 10 }).data} /></>

                                    </>
                                        : this.state.ExcelImport ?
                                            <ImportSampleStorageTransaction
                                                operation={this.state.operation}
                                                //loadImportFileData={this.props.Login.masterData}
                                                onDropFile={this.onDropFile}
                                                selectedRecord={this.state.selectedRecord || {}}
                                                deleteAttachment={this.deleteAttachment}
                                                onInputOnChange={this.onInputOnChange}

                                            /> :
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

    onDropFile = (attachedFiles, fieldName, maxSize) => {
        let selectedRecord = this.state.selectedRecord || {};
        selectedRecord[fieldName] = onDropAttachFileList(selectedRecord[fieldName], attachedFiles, maxSize)
        this.setState({ selectedRecord, actionType: "new" });
    }

    deleteAttachment = (event, file, fieldName) => {
        let selectedRecord = this.state.selectedRecord || {};
        selectedRecord[fieldName] = deleteAttachmentDropZone(selectedRecord[fieldName], file);

        this.setState({ selectedRecord, actionType: "delete" });
    };

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
    callService
})(injectIntl(SampleStorageTransaction));