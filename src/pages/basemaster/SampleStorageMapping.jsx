import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Row, Card, Nav, Button, } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { constructOptionList, getControlMap, onSaveMandatoryValidation, searchData, searchJsonData, showEsign, sortData } from '../../components/CommonScript';
//import SortableTree from 'react-sortable-tree'; 
import DataGrid from '../../components/data-grid/data-grid.component';
import {
    Utils as QbUtils,
} from "@react-awesome-query-builder/ui";

import SlideOutModal from '../../components/slide-out-modal/SlideOutModal';
import {
    callService, updateStore, validateEsignCredentialStorage
} from '../../actions';
import { DEFAULT_RETURN, UN_AUTHORIZED_ACCESS } from '../../actions/LoginTypes';
// import { initRequest } from "../../actions/LoginAction";
import { ListWrapper } from '../../components/client-group.styles';
import { ProductList } from '../product/product.styled';
// import ReactTooltip from 'react-tooltip';
//import { uuid } from 'uuidv4';
import { v4 as uuid } from 'uuid';
import ConfirmMessage from '../../components/confirm-alert/confirm-message.component';
import BreadcrumbComponent from '../../components/Breadcrumb.Component';
//import SplitterLayout from '@progress/kendo-react-layout'; //'react-splitter-layout';
import { Splitter, SplitterPane } from '@progress/kendo-react-layout';
import { transactionStatus } from '../../components/Enumeration';
import Esign from '../audittrail/Esign';
import rsapi from '../../rsapi';
import AddSampleStorageMapping from './AddSampleStorageMapping';
import Axios from 'axios';
import StorageMappingFilter from './StorageMappingFilter';
import Preloader from '../../components/preloader/preloader.component';
import TransactionListMasterJsonView from '../../components/TransactionListMasterJsonView';

import { process } from '@progress/kendo-data-query';
//import Spreadsheet from '../../components/Spreadsheet/Spreadsheet';
import MatrixComponent from '../../components/MatrixComponent';
import { ReactComponent as RefreshIcon } from '../../assets/image/refresh.svg';
import { intl } from '../../components/App';
//   import { Upload } from '@progress/kendo-react-upload';
//   import * as XLSX from 'xlsx';


class SampleStorageMapping extends Component {
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
            sheetData: {},
            selectedRecordFilter: {},

            toggleAction: false,
            treeDataView: undefined,
            toggleActionView: false,
            fields: {
                "ssamplestoragelocationname": {
                    "label": this.props.intl.formatMessage({
                        id: "IDS_STORAGESTRUCTURENAME",
                    }),
                    "type": "text",
                    "valueSources": ["value", "func"],

                    "mainWidgetProps": {
                        "valueLabel": "Name",
                        "valuePlaceholder": this.props.intl.formatMessage({
                            id: "IDS_STORAGESTRUCTURENAME"
                        })
                    }

                }, "scontainerpath": {
                    "label": this.props.intl.formatMessage({
                        id: "IDS_SAMPLESTORAGEPATH",
                    }),
                    "type": "text",
                    "valueSources": ["value", "func"],

                    "mainWidgetProps": {
                        "valueLabel": "Name",
                        "valuePlaceholder": this.props.intl.formatMessage({
                            id: "IDS_SAMPLESTORAGEPATH"
                        })
                    }

                }
            },
            treeData: [
                {
                    //  text: "root",
                    text: this.props.intl.formatMessage({ id: "IDS_ROOT" }),
                    expanded: true,
                    editable: true,
                    root: true,
                    id: uuid(),
                }],
            panes: [
                 { size: '30%', min: '25%',collapsible: true}                
            ],
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
            ncontrolcode: undefined,
            sampleStorageMappingOpenModal: false,   //  ALPD-5309   Changed openModal to sampleStorageMappingOpenModal due to got issue when change to other screens by Vishakh
            operation: undefined
         
        };
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

    onSplitterChange = (event) => {
        this.setState({ panes: event.newState });
    };

    componentDidUpdate(previousProps, previousState) {
        let { filterData, storageCategoryOptions,
            selectedRecord, controlMap,
            userRoleControlRights, storageLocationOptions,
            sampleStorageVersionOptions, masterData, selectedRecordFilter, sampleStorageMappingOpenModal, operation } = this.state
        let bool = false;

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

        }
        if (this.props.Login.sampleStorageMappingOpenModal !== previousProps.Login.sampleStorageMappingOpenModal) {
            bool = true;
            sampleStorageMappingOpenModal = this.props.Login.sampleStorageMappingOpenModal;
        }
        if (this.props.Login.operation !== previousProps.Login.operation) {
            bool = true;
            operation = this.props.Login.operation;
        }
        if (bool) {
            this.setState({
                storageCategoryOptions, filterData,
                selectedRecord, controlMap, sampleStorageMappingOpenModal,
                userRoleControlRights, storageLocationOptions,
                sampleStorageVersionOptions, masterData, selectedRecordFilter, operation
            });
        }

    }

    componentWillUnmount() {
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                masterData: [], inputParam: undefined, operation: null, modalName: undefined, sampleStorageMappingOpenModal: false
            }
        }
        this.props.updateStore(updateInfo);
    }

    openModal = () => {
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                sampleStorageMappingOpenModal: true, selectedRecord: {}, loadTreeProperties: false,
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
        let sampleStorageMappingOpenModal = this.state.sampleStorageMappingOpenModal;
        //let selectedId = this.props.Login.selectedId;
        let selectedRecord = this.state.selectedRecord; //this.props.Login.selectedRecord;
        let operation = this.state.operation;

        if (this.props.Login.loadEsign) {
            if (operation === "delete" || operation === "approve") {
                loadEsign = false;
                sampleStorageMappingOpenModal = false;
                selectedRecord = {};
                //selectedId = null;
                operation = undefined;
            }
            else {
                loadEsign = false;

            }
            selectedRecord['esignpassword'] = ""
            selectedRecord['esigncomments'] = ""
            selectedRecord['esignreason'] = ""

            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: { sampleStorageMappingOpenModal, loadEsign, selectedRecord, selectedId: null, operation }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            sampleStorageMappingOpenModal = false;
            //selectedId = null;
            selectedRecord = {};
            //  ALPD-5165   Added store update due to getting issue when delete with esign by Vishakh (05-06-2025)
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: { sampleStorageMappingOpenModal, selectedRecord }
            }
            this.props.updateStore(updateInfo);
        }

        // const updateInfo = {
        //     typeName: DEFAULT_RETURN,
        //     data: { openModal, loadEsign, selectedRecord, selectedId }
        // }
        // this.props.updateStore(updateInfo);
        this.setState({ selectedRecord, sampleStorageMappingOpenModal, loadEsign, isInitialRender: true })
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
            this.CRUDSampleStorageMapping({
                ...this.state.editedsheetData,
                nsamplestoragemappingcode: this.state.isMultiSampleAdd ?
                    Object.keys(this.state.sheetData).map(nsamplestoragemappingcode => nsamplestoragemappingcode).join(",") : this.state.editedsheetData.nsamplestoragemappingcode.toString(),
                nsamplestoragelocationcode: this.state.masterData.selectedSampleStorageLocation.nsamplestoragelocationcode,
                sheetData: JSON.stringify(this.state.sheetData ? this.state.sheetData : {}),
                sheetUpdate: true,
                userinfo: this.props.Login.userInfo,
                isMultiSampleAdd: this.state.isMultiSampleAdd
            }, 'update');
        } else {
            this.onSaveSampleStorageMapping(saveType, formRef);
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
                        obj.selectedStorageCategoryName : "NA",
                    //ALPD-4783--Vignesh R(02-09-2024)
                    "nfilterStorageCategory": obj.nfilterStorageCategory

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
        this.searchRef.current.value = "";
        this.setState({ loading: true })
        let inputParamData = {
            nstoragecategorycode: this.state.filterData &&
                this.state.filterData[0]['nfilterStorageCategory'] ?
                this.state.filterData[0]['nfilterStorageCategory'] : 0,
            nNeedInstrumentFlow: parseInt(this.props.Login.settings[84]),
            // nsamplestoragelocationcode: this.state.selectedRecordFilter["nsamplestoragelocationcode"].value,
            // nsamplestorageversioncode: this.state.selectedRecordFilter["nsamplestorageversioncode"].value,
            userinfo: this.props.Login.userInfo,
        }
        let urlArray = [];
        const url1 = rsapi().post("samplestoragemapping/getsamplestoragemapping", inputParamData);
        urlArray = [url1];
        Axios.all(urlArray)
            .then(response => {
                let object = {
                    selectedStorageCategoryName: this.state.filterData[0]['nfilterStorageCategory'].value,
                    nfilterStorageCategory: this.state.filterData[0]['nfilterStorageCategory']
                    // ssamplestoragelocationname: this.state.selectedRecordFilter["nsamplestoragelocationcode"].item.ssamplestoragelocationname,
                    // selectedSampleStorageVersion: this.state.selectedRecordFilter["nsamplestorageversioncode"].item.nversionno,
                }
                let filterData = this.generateBreadCrumData(object);
                //ALPDJ21-33--Added by Vignesh(05-08-2025)-->Storage Instrument - Screen Development
                let masterData = {
                    ...this.state.masterData,
                    ...response[0].data,
                    searchedData: undefined

                };

                sortData(masterData.sampleStoragemapping && masterData.sampleStoragemapping, "descending", "nsamplestoragemappingcode");
                this.setState({
                    filterData,
                    masterData: masterData,
                    loading: false
                });
            }).catch(error => {
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
                } else {
                    toast.warn(error.response.data);
                }
                this.setState({
                    loading: false
                });
            });
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
    handleClickDelete = (deleteParam) => {
        //this.props.deleteRecord(deleteParam);

        this.confirmMessage.confirm("deleteMessage", this.props.intl.formatMessage({ id: "IDS_DELETE" }), this.props.intl.formatMessage({ id: "IDS_DEFAULTCONFIRMMSG" }),
            this.props.intl.formatMessage({ id: "IDS_OK" }), this.props.intl.formatMessage({ id: "IDS_CANCEL" }),
            () => this.deletesamplestoragemapping(deleteParam));
    }
    deletesamplestoragemapping = (param) => {
        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.state.controlMap.has("DeletesampleStorageMapping") && this.state.controlMap.get("DeletesampleStorageMapping").ncontrolcode)) {
            const masterData = this.state.masterData || {};
            let inputParam = {
                methodUrl: "SampleStorageMapping",
                // operation: this.props.Login.operation || this.state.operation,
                operation: "delete",
                classUrl: "samplestoragemapping",
                inputData:
                {
                    'nsamplestoragelocationcode': masterData.selectedSampleStorageLocation.nsamplestoragelocationcode,
                    'nstorageinstrumentcode': masterData.selectedSampleStorageLocation.nstorageinstrumentcode,
                    'nNeedInstrumentFlow': this.props.Login.settings ? parseInt(this.props.Login.settings[84]) : transactionStatus.NO,
                    'nsamplestoragemappingcode': param.nsamplestoragemappingcode,
                    userinfo: this.props.Login.userInfo,
                       //BGSI-227	Sample Storage Mapping-->Records Disappear After Deleting Sample Storage Path --BY Neeraj 
                    'npartitioncode': parseInt(this.props.Login.settings[84]) ===transactionStatus.YES ?
                     masterData.selectedSampleStorageLocation.ninstrumentcode : 
                    masterData.selectedSampleStorageLocation.nprojecttypecode,
                }
            };

            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, sampleStorageMappingOpenModal: true, operation: "delete", screenData: { inputParam, masterData }
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.CRUDSampleStorageMapping({
                'nsamplestoragelocationcode': this.state.masterData.selectedSampleStorageLocation.nsamplestoragelocationcode,
                'nsamplestoragemappingcode': param.nsamplestoragemappingcode,
                'nstorageinstrumentcode': this.state.masterData.selectedSampleStorageLocation && this.state.masterData.selectedSampleStorageLocation.nstorageinstrumentcode || -1,
                'nNeedInstrumentFlow': this.props.Login.settings ? parseInt(this.props.Login.settings[84]) : transactionStatus.NO,
                userinfo: this.props.Login.userInfo,
                //BGSI-227	Sample Storage Mapping-->Records Disappear After Deleting Sample Storage Path --BY Neeraj 
                'npartitioncode': parseInt(this.props.Login.settings[84]) ===transactionStatus.YES ?
                     this.state.masterData?.selectedSampleStorageLocation?.ninstrumentcode : 
                    this.state.masterData?.selectedSampleStorageLocation?.nprojecttypecode,
            }, 'delete');
        }
    }
    addMultipleSample = (param) => {
        this.setState({
            //sheetData: JSON.parse(response[0].data.sheetData),
            sampleStorageMappingOpenModal: true, isMultiSampleAdd: true, openSpreadSheet: true,//, editedsheetData: param, Rows: param.nrow, columns: param.ncolumn,
            loading: false
        })
    }
    importdata = () => {
        this.setState({ sampleStorageMappingOpenModal: true, importdata: true })
    }
    addSample = (param, nflag) => {
        this.setState({ loading: true })
        let urlArray = [];
        const url1 = rsapi().post("samplestoragemapping/getsamplestoragemappingSheetData",
            {
                isMultiSampleAdd: (nflag === 2) ? true : false,
                nsamplestoragemappingcode:
                    (nflag === 2) ? this.state.masterData.sampleStoragemapping.map(item => item.nsamplestoragemappingcode).join(",")
                        : param.nsamplestoragemappingcode.toString()
            });
        urlArray = [url1];
        Axios.all(urlArray)
            .then(response => {
                if (nflag === 2) {
                    this.setState({
                        sheetData: JSON.parse(response[0].data.sheetData),
                        sampleStorageMappingOpenModal: true, isMultiSampleAdd: true, openSpreadSheet: true,//, editedsheetData: param, Rows: param.nrow, columns: param.ncolumn,
                        loading: false
                    })
                } else {
                    this.setState({
                        sheetData: JSON.parse(response[0].data.sheetData),
                        sampleStorageMappingOpenModal: true, isMultiSampleAdd: false, openSpreadSheet: true,
                        editedsheetData: param, Rows: param.nrow, columns: param.ncolumn,
                        loading: false
                    })
                }
            }).catch(error => {
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
        let selectedRecordFilter = this.state.selectedRecordFilter || {};

        if (fieldName === 'nstoragecategorycode') {
            selectedRecordFilter[fieldName] = comboData;
            this.setState({ selectedRecordFilter });
            /*
            return this.getSampleStorageLocation({
                userinfo: this.props.Login.userInfo,
                nstoragecategorycode: comboData.value
            }, fieldName, comboData);*/
        } else if (fieldName === 'ncontainertypecode') {
            return this.getContainerStructure({
                userinfo: this.props.Login.userInfo,
                ncontainertypecode: comboData.value
            }, fieldName, comboData);

        } else if (fieldName === 'ncontainerstructurecode') {
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

    onSaveSampleStorageMapping = (saveType) => {
        let selectedRecord = this.state.selectedRecord;
        let containerpathCodeArray = [];

        if (this.state.operation === 'create') {
            containerpathCodeArray = selectedRecord['nsamplestoragecontainerpathcode'].map(item => item.value);
        }
        const inputParam = selectedRecord['nneedposition'] === true ?
            {
                nsamplestoragelocationcode: this.state.masterData.selectedSampleStorageLocation.nsamplestoragelocationcode,
                nsamplestoragemappingcode: selectedRecord['nsamplestoragemappingcode'] ?
                    parseInt(selectedRecord['nsamplestoragemappingcode']) : 0,
                ncontainertypecode: selectedRecord['ncontainertypecode'].value ?
                    selectedRecord['ncontainertypecode'].value : -1,
                nproductcode: selectedRecord['nproductcode'] ? selectedRecord['nproductcode'].value : -1,
                nprojecttypecode: selectedRecord['nprojecttypecode'] ? selectedRecord['nprojecttypecode'].value : -1,
                nunitcode: selectedRecord['nunitcode'] ? selectedRecord['nunitcode'].value : -1,
                ssamplestoragemappingname: "-",
                ndirectionmastercode: selectedRecord['ndirectionmastercode'] ? selectedRecord['ndirectionmastercode'].value : -1,
                nsamplestoragecontainerpathcode: this.state.operation === 'create' ?
                    JSON.stringify(containerpathCodeArray) : parseInt(selectedRecord['nsamplestoragecontainerpathcode'].value),
                containerpathsize: containerpathCodeArray.length,
                nneedposition: 3,
                sboxid: '',
                ncontainerstructurecode: selectedRecord['ncontainerstructurecode'].value ?
                    selectedRecord['ncontainerstructurecode'].value : -1,
                nquantity: selectedRecord['nquantity'] ?
                    parseFloat(selectedRecord['nquantity']) : 0,
                nnoofcontainer: selectedRecord['nnoofcontainer'] ?
                    parseInt(selectedRecord['nnoofcontainer']) : 1,
                //nsamplestoragelocationcode: this.state.selectedRecordFilter["nsamplestoragelocationcode"].value,

                userinfo: this.props.Login.userInfo,

                nrow: selectedRecord['nrow'],
                ncolumn: selectedRecord['ncolumn'],

                //ALPDJ21-33-Added by Vignesh(04-08-2025)-->Storage Instrument - Screen Development
                nstorageinstrumentcode: this.state.masterData.selectedSampleStorageLocation &&
                    this.state.masterData.selectedSampleStorageLocation.nstorageinstrumentcode ?
                    this.state.masterData.selectedSampleStorageLocation.nstorageinstrumentcode : transactionStatus.NA,

                nsitecode: this.state.masterData.selectedSampleStorageLocation &&
                    this.state.masterData.selectedSampleStorageLocation.nregionalsitecode ?
                    this.state.masterData.selectedSampleStorageLocation.nregionalsitecode : transactionStatus.NA,
                //ALPDJ21-33-Added by Vignesh(02-09-2025)-->Storage Instrument - Screen Developmen
                nNeedInstrumentFlow: parseInt(this.props.Login.settings[84]),

				//ALPDJ21-71--Added by Vignesh(06-09-2025)--new fields added the for the partition of sample storage mapping
                ninstrumentcode: this.state.masterData.selectedSampleStorageLocation &&
                    this.state.masterData.selectedSampleStorageLocation.ninstrumentcode ?
                    this.state.masterData.selectedSampleStorageLocation.ninstrumentcode : transactionStatus.NA,

                npartitioncode: parseInt(this.props.Login.settings[84]) === transactionStatus.YES
                    ? (
                        this.state.masterData.selectedSampleStorageLocation &&
                            this.state.masterData.selectedSampleStorageLocation.ninstrumentcode
                            ? this.state.masterData.selectedSampleStorageLocation.ninstrumentcode
                            : transactionStatus.NA
                    )
                    : (
                        selectedRecord['nprojecttypecode']
                            ? selectedRecord['nprojecttypecode'].value
                            : transactionStatus.NA
                    )

            } : {

                nsamplestoragelocationcode: this.state.masterData.selectedSampleStorageLocation.nsamplestoragelocationcode,
                nsamplestoragemappingcode: selectedRecord['nsamplestoragemappingcode'] ?
                    parseInt(selectedRecord['nsamplestoragemappingcode']) : 0,
                ncontainertypecode: -1,
                nproductcode: selectedRecord['nproductcode'] ? selectedRecord['nproductcode'].value : -1,
                nprojecttypecode: selectedRecord['nprojecttypecode'] ? selectedRecord['nprojecttypecode'].value : -1,
                nunitcode: selectedRecord['nunitcode'] ? selectedRecord['nunitcode'].value : -1,
                ndirectionmastercode: 1,
                ssamplestoragemappingname: "-",
                nsamplestoragecontainerpathcode: this.state.operation === 'create' ?
                    JSON.stringify(containerpathCodeArray) : parseInt(selectedRecord['nsamplestoragecontainerpathcode'].value),
                containerpathsize: containerpathCodeArray.length,
                nneedposition: 4,
                sboxid: '',
                ncontainerstructurecode: -1,
                nquantity: selectedRecord['nquantity'] ?
                    parseInt(selectedRecord['nquantity']) : 0,
                nnoofcontainer: selectedRecord['nnoofcontainer'] ?
                    parseInt(selectedRecord['nnoofcontainer']) : 1,
                // nsamplestoragelocationcode: this.state.selectedRecordFilter["nsamplestoragelocationcode"].value,

                userinfo: this.props.Login.userInfo,

                nrow: selectedRecord['nrow'],
                ncolumn: selectedRecord['ncolumn'],

                //ALPDJ21-33-Added by Vignesh(04-08-2025)-->Storage Instrument - Screen Development
                nstorageinstrumentcode: this.state.masterData.selectedSampleStorageLocation &&
                    this.state.masterData.selectedSampleStorageLocation.nstorageinstrumentcode ?
                    this.state.masterData.selectedSampleStorageLocation.nstorageinstrumentcode : transactionStatus.NA,

                nsitecode: this.state.masterData.selectedSampleStorageLocation &&
                    this.state.masterData.selectedSampleStorageLocation.nregionalsitecode ?
                    this.state.masterData.selectedSampleStorageLocation.nregionalsitecode : transactionStatus.NA,
                //ALPDJ21-33-Added by Vignesh(02-09-2025)-->Storage Instrument - Screen Developmen
                nNeedInstrumentFlow: parseInt(this.props.Login.settings[84]),
                ninstrumentcode: this.state.masterData.selectedSampleStorageLocation &&
                    this.state.masterData.selectedSampleStorageLocation.ninstrumentcode ?
                    this.state.masterData.selectedSampleStorageLocation.ninstrumentcode : transactionStatus.NA,
				
				//ALPDJ21-71--Added by Vignesh(06-09-2025)--new fields added the for the partition of sample storage mapping
                npartitioncode: parseInt(this.props.Login.settings[84]) === transactionStatus.YES
                    ? (
                        this.state.masterData.selectedSampleStorageLocation &&
                            this.state.masterData.selectedSampleStorageLocation.ninstrumentcode
                            ? this.state.masterData.selectedSampleStorageLocation.ninstrumentcode
                            : transactionStatus.NA
                    )
                    : (
                        selectedRecord['nprojecttypecode']
                            ? selectedRecord['nprojecttypecode'].value
                            : transactionStatus.NA
                    )
            }

        if ((this.state.operation === "update") && showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.state.controlMap.has("EditsampleStorageMapping") && this.state.controlMap.get("EditsampleStorageMapping").ncontrolcode)) {
            const masterData = this.state.masterData;
            // let openModal = this.state.openModal;
            let inputParam = {
                methodUrl: "SampleStorageMapping",
                operation: this.state.operation,
                classUrl: "samplestoragemapping",

                inputData: selectedRecord['nneedposition'] === true ?
                    {
                        nsamplestoragelocationcode: this.state.masterData.selectedSampleStorageLocation.nsamplestoragelocationcode,
                        nsamplestoragemappingcode: selectedRecord['nsamplestoragemappingcode'] ?
                            parseInt(selectedRecord['nsamplestoragemappingcode']) : 0,
                        ncontainertypecode: selectedRecord['ncontainertypecode'].value ?
                            selectedRecord['ncontainertypecode'].value : -1,
                        nproductcode: selectedRecord['nproductcode'] ? selectedRecord['nproductcode'].value : -1,
                        nprojecttypecode: selectedRecord['nprojecttypecode'] ? selectedRecord['nprojecttypecode'].value : -1,
                        nunitcode: selectedRecord['nunitcode'] ? selectedRecord['nunitcode'].value : -1,
                        ssamplestoragemappingname: "-",
                        ndirectionmastercode: selectedRecord['ndirectionmastercode'] ? selectedRecord['ndirectionmastercode'].value : -1,
                        nsamplestoragecontainerpathcode: this.state.operation === 'create' ?
                            JSON.stringify(containerpathCodeArray) : parseInt(selectedRecord['nsamplestoragecontainerpathcode'].value),
                        containerpathsize: containerpathCodeArray.length,
                        nneedposition: 3,
                        sboxid: '',
                        ncontainerstructurecode: selectedRecord['ncontainerstructurecode'].value ?
                            selectedRecord['ncontainerstructurecode'].value : -1,
                        nquantity: selectedRecord['nquantity'] ?
                            parseFloat(selectedRecord['nquantity']) : 0,
                        nnoofcontainer: selectedRecord['nnoofcontainer'] ?
                            parseInt(selectedRecord['nnoofcontainer']) : 1,
                        //nsamplestoragelocationcode: this.state.selectedRecordFilter["nsamplestoragelocationcode"].value,

                        userinfo: this.props.Login.userInfo,

                        nrow: selectedRecord['nrow'],
                        ncolumn: selectedRecord['ncolumn'],

                        //ALPDJ21-33-Added by Vignesh(04-08-2025)-->Storage Instrument - Screen Development
                        nstorageinstrumentcode: this.state.masterData.selectedSampleStorageLocation &&
                            this.state.masterData.selectedSampleStorageLocation.nstorageinstrumentcode ?
                            this.state.masterData.selectedSampleStorageLocation.nstorageinstrumentcode : transactionStatus.NA,

                        nsitecode: this.state.masterData.selectedSampleStorageLocation &&
                            this.state.masterData.selectedSampleStorageLocation.nregionalsitecode ?
                            this.state.masterData.selectedSampleStorageLocation.nregionalsitecode : transactionStatus.NA,
                        //ALPDJ21-33-Added by Vignesh(02-09-2025)-->Storage Instrument - Screen Developmen
                        nNeedInstrumentFlow: parseInt(this.props.Login.settings[84]),
                        ninstrumentcode: this.state.masterData.selectedSampleStorageLocation &&
                            this.state.masterData.selectedSampleStorageLocation.ninstrumentcode ?
                            this.state.masterData.selectedSampleStorageLocation.ninstrumentcode : transactionStatus.NA,

                        npartitioncode: parseInt(this.props.Login.settings[84]) === transactionStatus.YES
                            ? (
                                this.state.masterData.selectedSampleStorageLocation &&
                                    this.state.masterData.selectedSampleStorageLocation.ninstrumentcode
                                    ? this.state.masterData.selectedSampleStorageLocation.ninstrumentcode
                                    : transactionStatus.NA
                            )
                            : (
                                selectedRecord['nprojecttypecode']
                                    ? selectedRecord['nprojecttypecode'].value
                                    : transactionStatus.NA
                            )

                    } : {
                        nsamplestoragelocationcode: this.state.masterData.selectedSampleStorageLocation.nsamplestoragelocationcode,
                        nsamplestoragemappingcode: selectedRecord['nsamplestoragemappingcode'] ?
                            parseInt(selectedRecord['nsamplestoragemappingcode']) : 0,
                        ncontainertypecode: -1,
                        nproductcode: selectedRecord['nproductcode'] ? selectedRecord['nproductcode'].value : -1,
                        nprojecttypecode: selectedRecord['nprojecttypecode'] ? selectedRecord['nprojecttypecode'].value : -1,
                        nunitcode: selectedRecord['nunitcode'] ? selectedRecord['nunitcode'].value : -1,
                        ndirectionmastercode: 1,
                        ssamplestoragemappingname: "-",
                        nsamplestoragecontainerpathcode: this.state.operation === 'create' ?
                            JSON.stringify(containerpathCodeArray) : parseInt(selectedRecord['nsamplestoragecontainerpathcode'].value),
                        containerpathsize: containerpathCodeArray.length,
                        nneedposition: 4,
                        sboxid: '',
                        ncontainerstructurecode: -1,
                        nquantity: selectedRecord['nquantity'] ?
                            parseInt(selectedRecord['nquantity']) : 0,
                        nnoofcontainer: selectedRecord['nnoofcontainer'] ?
                            parseInt(selectedRecord['nnoofcontainer']) : 1,
                        // nsamplestoragelocationcode: this.state.selectedRecordFilter["nsamplestoragelocationcode"].value,
                        userinfo: this.props.Login.userInfo,
                        nrow: selectedRecord['nrow'],
                        ncolumn: selectedRecord['ncolumn'],

                        //ALPDJ21-33-Added by Vignesh(04-08-2025)-->Storage Instrument - Screen Development
                        nsitecode: this.state.masterData.selectedSampleStorageLocation &&
                            this.state.masterData.selectedSampleStorageLocation.nregionalsitecode ?
                            this.state.masterData.selectedSampleStorageLocation.nregionalsitecode : transactionStatus.NA,
                        nstorageinstrumentcode: this.state.masterData.selectedSampleStorageLocation &&
                            this.state.masterData.selectedSampleStorageLocation.nstorageinstrumentcode ?
                            this.state.masterData.selectedSampleStorageLocation.nstorageinstrumentcode : transactionStatus.NA,
                        //ALPDJ21-33-Added by Vignesh(02-09-2025)-->Storage Instrument - Screen Developmen
                        nNeedInstrumentFlow: parseInt(this.props.Login.settings[84]),
                        ninstrumentcode: this.state.masterData.selectedSampleStorageLocation &&
                            this.state.masterData.selectedSampleStorageLocation.ninstrumentcode ?
                            this.state.masterData.selectedSampleStorageLocation.ninstrumentcode : transactionStatus.NA,

                        npartitioncode: parseInt(this.props.Login.settings[84]) === transactionStatus.YES
                            ? (
                                this.state.masterData.selectedSampleStorageLocation &&
                                    this.state.masterData.selectedSampleStorageLocation.ninstrumentcode
                                    ? this.state.masterData.selectedSampleStorageLocation.ninstrumentcode
                                    : transactionStatus.NA
                            )
                            : (
                                selectedRecord['nprojecttypecode']
                                    ? selectedRecord['nprojecttypecode'].value
                                    : transactionStatus.NA
                            )
                    }

            };

            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, operation: this.state.operation, sampleStorageMappingOpenModal: true, selectedRecord, screenData: { inputParam, masterData }, saveType
                }
            }
            this.props.updateStore(updateInfo);
        }


        else {
            this.CRUDSampleStorageMapping(inputParam, this.state.operation);
        }
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
        const url1 = rsapi().post("samplestoragemapping/getActiveSampleStorageMappingById", {
            nsamplestoragelocationcode: inputParam['selectedSampleStorageLocation'][0].nsamplestoragelocationcode,
            nstorageinstrumentcode: inputParam['selectedSampleStorageLocation'][0].nstorageinstrumentcode,
            nNeedInstrumentFlow: parseInt(this.props.Login.settings[84]),
            npartitioncode: parseInt(this.props.Login.settings[84]) ===transactionStatus.YES ? inputParam['selectedSampleStorageLocation'][0].ninstrumentcode : inputParam['selectedSampleStorageLocation'][0].nprojecttypecode,
            userinfo: userinfo
        });
        urlArray = [url1];
        Axios.all(urlArray)
            .then(response => {
                //ALPDJ21-33--Added by Vignesh(05-08-2025)-->Storage Instrument - Screen Development
                let masterData = {
                    ...this.state.masterData, ...response[0].data
                }

                sortData(masterData.sampleStoragemapping && masterData.sampleStoragemapping, "descending", "nsamplestoragemappingcode");

                this.setState({
                    //,
                    // selectedRecord: {
                    //     ...this.state.selectedRecord
                    //    // , sheetData: JSON.parse(response[0].data.selectedSampleStoragemapping.jsondata.value)
                    // }
                    masterData: masterData,
                    dataStateChange: { skip: 0, take: 10 },
                    loading: false
                });

            }).catch(error => {
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
            masterData["sampleStoragemapping"] = [];
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


    CRUDSampleStorageMapping = (inputParam, operation, isImport) => {
        this.setState({ loading: true })
        let urlArray = [];
        const url1 = rsapi().post("samplestoragemapping/" + operation + "SampleStorageMapping", inputParam);
        urlArray = [url1];
        Axios.all(urlArray)
            .then(response => {

                //ALPDJ21-33--Added by Vignesh(05-08-2025)-->Storage Instrument - Screen Development
                let masterData = {
                    ...this.state.masterData, ...response[0].data
                };
                sortData(masterData.sampleStoragemapping && masterData.sampleStoragemapping, "descending", "nsamplestoragemappingcode");

                this.setState({
                    isInitialRender: true,
                    selectedRecord: {},
                    masterData: masterData,
                    sampleStorageMappingOpenModal: false,
                    loading: false
                });

            }).catch(error => {
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
        const url1 = rsapi().post("samplestoragemapping/getsamplestoragemapping", inputParamData);

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
                } else {
                    toast.warn(error.response.data);
                }
                this.setState({
                    loading: false
                });
            });
    }

    onFilterSubmit = () => {
        this.searchRef.current.value = "";
        this.setState({ loading: true })
        let inputParamData = {
            nstoragecategorycode: this.state.selectedRecordFilter && this.state.selectedRecordFilter["nstoragecategorycode"] &&
                this.state.selectedRecordFilter["nstoragecategorycode"].value ?
                this.state.selectedRecordFilter["nstoragecategorycode"].value : 0,
            // nsamplestoragelocationcode: this.state.selectedRecordFilter["nsamplestoragelocationcode"].value,
            // nsamplestorageversioncode: this.state.selectedRecordFilter["nsamplestorageversioncode"].value,
            userinfo: this.props.Login.userInfo,
        }
        let urlArray = [];
        const url1 = rsapi().post("samplestoragemapping/getsamplestoragemapping", inputParamData);
        urlArray = [url1];
        Axios.all(urlArray)
            .then(response => {
                let object = {
                    selectedStorageCategoryName: this.state.selectedRecordFilter["nstoragecategorycode"].item.sstoragecategoryname,
                    nfilterStorageCategory: this.state.selectedRecordFilter["nstoragecategorycode"].value
                    // ssamplestoragelocationname: this.state.selectedRecordFilter["nsamplestoragelocationcode"].item.ssamplestoragelocationname,
                    // selectedSampleStorageVersion: this.state.selectedRecordFilter["nsamplestorageversioncode"].item.nversionno,
                }
                let filterData = this.generateBreadCrumData(object);

                this.setState({
                    filterData,
                    masterData: {
                        ...this.state.masterData,
                        ...response[0].data,
                        searchedData: undefined
                        //   sampleStoragemapping: response[0].data['sampleStoragemapping'],
                    },
                    loading: false,
                    // ALPD-5311    Added skip and take when doing filter submit by Vishakh (05-06-2025)
                    skip: 0,
                    take: this.props.Login.settings ? this.props.Login.settings[3] : 25
                });
            }).catch(error => {
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
                } else {
                    toast.warn(error.response.data);
                }
                this.setState({
                    loading: false
                });
            });
    }
    addSampleStorageMapping() {
        if (this.state.masterData.searchedData !== undefined ?
            this.state.masterData.searchedData.length > 0 ?
                true : false
            : this.state.masterData.sampleStorageLocation.length > 0) {
            this.setState({ loading: true })
            let selectedRecord = this.state.selectedRecord
            let inputParamData = {
                // nstoragecategorycode: this.state.selectedRecordFilter["nstoragecategorycode"].value,
                nsamplestoragelocationcode: this.state.masterData.selectedSampleStorageLocation.nsamplestoragelocationcode,
                // nsamplestorageversioncode: this.state.selectedRecordFilter["nsamplestorageversioncode"].value,
                userinfo: this.props.Login.userInfo,
                nNeedInstrumentFlow: parseInt(this.props.Login.settings[84]),
                operation: "create",
                nstorageinstrumentcode: this.state.masterData.selectedSampleStorageLocation && this.state.masterData.selectedSampleStorageLocation.nstorageinstrumentcode ? this.state.masterData.selectedSampleStorageLocation.nstorageinstrumentcode : -1
            }

            let urlArray = [];
            const url1 = rsapi().post("samplestoragemapping/addSampleStorageMapping", inputParamData);

            const url2 = rsapi().post("product/getProduct",
                { 'userinfo': this.props.Login.userInfo });

            const url3 = rsapi().post("/projecttype/getProjectType",
                { 'userinfo': this.props.Login.userInfo });

            const url4 = rsapi().post("/unit/getUnit",
                { 'userinfo': this.props.Login.userInfo });

            urlArray = [url1, url2, url3, url4];
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

                    const containerstructureMap = constructOptionList(response[0].data['containerStructure']
                        || [],
                        "ncontainerstructurecode",
                        "scontainerstructurename", undefined, undefined, true);
                    const containerstructureList = containerstructureMap.get("OptionList");

                    const productMap = constructOptionList(response[1].data['Product'] || [],
                        "nproductcode",
                        "sproductname", undefined, undefined, true);
                    const productList = productMap.get("OptionList");


                    const projectTypeMap = constructOptionList(response[2].data || [], "nprojecttypecode",
                        "sprojecttypename", undefined, undefined, true);

                    const projectTypeMapList = projectTypeMap.get("OptionList");

                    const unitMap = constructOptionList(response[3].data || [], "nunitcode",
                        "sunitname", undefined, undefined, true);

                    const unitMapList = unitMap.get("OptionList");


                    //To Load selected Data from Sample storage Location
                    unitMapList.map(item => item.value === response[0].data["selectedSampleStorageVersion"]["nunitcode"] ?
                        selectedRecord["nunitcode"] = {
                            "label": item.label,
                            "value": item.value,
                            "item": item.item
                        }
                        : "");

                    projectTypeMapList.map(item => item.value === response[0].data["selectedSampleStorageVersion"]["nprojecttypecode"] ?
                        selectedRecord["nprojecttypecode"] = {
                            "label": item.label,
                            "value": item.value,
                            "item": item.item
                        }
                        : "");
                    productList.map(item => item.value === response[0].data["selectedSampleStorageVersion"]["nproductcode"] ?
                        selectedRecord["nproductcode"] = {
                            "label": item.label,
                            "value": item.value,
                            "item": item.item
                        }
                        : "");
                    containerTypeList.map(item => item.value === response[0].data["selectedSampleStorageVersion"]["ncontainertypecode"] ?
                        selectedRecord["ncontainertypecode"] = {
                            "label": item.label,
                            "value": item.value,
                            "item": item.item
                        }
                        : "");
                    containerstructureList.map(item => item.value === response[0].data["selectedSampleStorageVersion"]["ncontainerstructurecode"] ?
                        selectedRecord["ncontainerstructurecode"] = {
                            "label": item.label,
                            "value": item.value,
                            "item": item.item
                        }
                        : "");

                    directionmasterList.map(item => item.value === response[0].data["selectedSampleStorageVersion"]["ndirectionmastercode"] ?
                        selectedRecord["ndirectionmastercode"] = {
                            "label": item.label,
                            "value": item.value,
                            "item": item.item
                        }
                        : "");
                    selectedRecord = {
                        ...selectedRecord,
                        nneedposition: true,
                        //ALPD-3353
                        nrow: response[0].data["selectedSampleStorageVersion"].nrow === 0 ? 1 : response[0].data["selectedSampleStorageVersion"].nrow,
                        ncolumn: response[0].data["selectedSampleStorageVersion"].ncolumn === 0 ? 1 : response[0].data["selectedSampleStorageVersion"].ncolumn,
                        nquantity: response[0].data["selectedSampleStorageVersion"].nquantity,
                        nnoofcontainer: response[0].data["selectedSampleStorageVersion"].nnoofcontainer,
                        containerTypeOptions: containerTypeList,
                        containerStructureOptions: containerstructureList,
                        directionmasterOptions: directionmasterList
                    }
                    this.setState({
                        sampleStorageMappingOpenModal: true,
                        storageMappingMapOptions: storageMappingMapList,
                        selectedRecord: {
                            ...selectedRecord,
                            nproductcode: { label: response[0].data.samplestoragelocation.sproductname, value: response[0].data.samplestoragelocation.nproductcode },
                            nprojecttypecode: { label: response[0].data.samplestoragelocation.sprojecttypename, value: response[0].data.samplestoragelocation.nprojecttypecode },
                            storageMappingMapOptions: storageMappingMapList,
                            productOptions: productList,
                            projectOptions: projectTypeMapList,
                            unitOptions: unitMapList,
                            containerTypeOptions: containerTypeList,
                            directionmasterOptions: directionmasterList,
                            // ncontainertypecode: containerTypeList[0],
                            // containerStructureOptions: containerstructureList,
                            // ncontainerstructurecode: containerstructureList[0],
                            // nrow: containerStructure.length > 0 ? containerStructure[0].nrow : 1,
                            // ncolumn: containerStructure.length > 0 ? containerStructure[0].ncolumn : 1,
                            isInitialRender: true

                        },
                        openSpreadSheet: false,
                        operation: 'create',
                        loading: false
                    });
                }).catch(error => {
                    //console.log(error)
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
                    } else {
                        toast.warn(error.response.data);
                    }
                    this.setState({
                        loading: false
                    });
                });
        }
        else {
            toast.info(this.props.intl.formatMessage({ id: "IDS_SELECTSTORAGESTRUCTURE" }));
        }
    }


    getContainerStructure(inputData, fieldName, comboData) {
        let inputParamData = {}
        this.setState({ loading: true })
        inputParamData = {
            ncontainertypecode: comboData.value,
            userinfo: inputData.userinfo
        }
        let urlArray = [];
        const url1 = rsapi().post("samplestoragemapping/getContainerStructure", inputParamData);

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
                "idsName": "IDS_SAMPLESTORAGEPATH", "dataField": "nsamplestoragecontainerpathcode",
                "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox"
            },
            {
                "idsName": "IDS_PRODUCT",
                "dataField": "nproductcode", "mandatoryLabel":
                    "IDS_SELECT", "controlType": "selectbox"
            }
            // },
            // {
            //     "idsName": "IDS_AVAILABLEQUANTITY",
            //     "dataField": "nquantity", "mandatoryLabel":
            //         "IDS_ENTER", "controlType": "selectbox"
            // }
        ] : [
            {
                "idsName": "IDS_SAMPLESTORAGEPATH", "dataField": "nsamplestoragecontainerpathcode",
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
            }
            // },
            // {
            //     "idsName": "IDS_AVAILABLEQUANTITY",
            //     "dataField": "nquantity", "mandatoryLabel":
            //         "IDS_ENTER", "controlType": "selectbox"
            // }
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
        if (this.state.masterData.sampleStorageLocation.length > 0) {
            if (this.state.masterData.sampleStoragemapping.length > 0) {
                if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.state.controlMap.has("ApprovesampleStorageMapping") && this.state.controlMap.get("ApprovesampleStorageMapping").ncontrolcode)) {
                    const masterData = this.state.masterData || {};
                    let inputParam = {
                        methodUrl: "SampleStorageMapping",
                        // operation: this.props.Login.operation || this.state.operation,
                        operation: "approve",
                        classUrl: "samplestoragemapping",
                        inputData:
                        {
                            'nsamplestoragelocationcode': masterData.selectedSampleStorageLocation.nsamplestoragelocationcode,
                            userinfo: this.props.Login.userInfo,
                            //ALPD-4934--Vignesh R(24-09-2024)
                            'nsamplestoragemappingcode': this.state.masterData.sampleStoragemapping.map(item => item.nsamplestoragemappingcode).join(','),
                            'ninstrumentcode': masterData.selectedSampleStorageLocation.ninstrumentcode,
                            'nNeedInstrumentFlow': parseInt(this.props.Login.settings[84]),
                            'nstorageinstrumentcode': masterData.selectedSampleStorageLocation.nstorageinstrumentcode,
                            //BGSI-119--Mullai Balaji(17-11-2025)
                            'npartitioncode': parseInt(this.props.Login.settings[84]) ===transactionStatus.YES ? masterData.selectedSampleStorageLocation.ninstrumentcode: masterData.selectedSampleStorageLocation.nprojecttypecode,

                        }
                    };

                    const updateInfo = {
                        typeName: DEFAULT_RETURN,
                        data: {
                            loadEsign: true, sampleStorageMappingOpenModal: true, operation: "approve", screenData: { inputParam, masterData }
                        }
                    }
                    this.props.updateStore(updateInfo);
                }
                else {

                    let inputParamData = {}
                    this.setState({ loading: true })
                    inputParamData = {
                        nsamplestoragelocationcode: this.state.masterData.selectedSampleStorageLocation.nsamplestoragelocationcode,
                        userinfo: this.props.Login.userInfo,
                        //ALPD-4934--Vignesh R(24-09-2024)
                        'nsamplestoragemappingcode': this.state.masterData.sampleStoragemapping.map(item => item.nsamplestoragemappingcode).join(','),
                        'ninstrumentcode': this.state.masterData.selectedSampleStorageLocation.ninstrumentcode,
                        'nNeedInstrumentFlow': parseInt(this.props.Login.settings[84]),
                        'nstorageinstrumentcode': this.state.masterData.selectedSampleStorageLocation.nstorageinstrumentcode,
                        //BGSI-119--Mullai Balaji(17-11-2025)
                        'npartitioncode': parseInt(this.props.Login.settings[84]) ===transactionStatus.YES ? this.state.masterData.selectedSampleStorageLocation.ninstrumentcode : this.state.masterData.selectedSampleStorageLocation.nprojecttypecode,


                    }
                    let urlArray = [];
                    const url1 = rsapi().post("samplestoragemapping/approveSampleStorageMapping", inputParamData);

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
                            } else {
                                toast.warn(error.response.data);
                            }
                            this.setState({
                                loading: false
                            });
                        });
                }
            } else {
                toast.warn(this.props.intl.formatMessage({ id: "IDS_CANNOTAPPROVEEMPTYMAPPING" }));
            }
        } else {
            toast.info(this.props.intl.formatMessage({ id: "IDS_SELECTSTORAGESTRUCTURE" }));
        }

    }

    getDynamicFilterExecuteData(inputParam) {
        this.setState({ loading: true })
        let selectedRecord = this.state.selectedRecord || {};
        let obj = {// ...inputParam.component, 
            label: 'sampleStorageLocation', valuemember: 'nsamplestoragelocationcode',
            filterquery: selectedRecord.filterquery, source: 'sampleStorageLocation', userinfo: this.props.Login.userInfo
        }
        let urlArray = [];
        const url1 = rsapi().post("/samplestoragemapping/getdynamicfilterexecutedata", obj);
        urlArray = [url1];
        Axios.all(urlArray)
            .then(response => {
                // console.log(response)
                let masterData = this.state.masterData
                masterData = { ...masterData, ...response[0].data }
                this.setState({
                    masterData: { ...masterData },
                    loading: false
                })
            })
            .catch(error => {
                this.setState({
                    loading: false
                });
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
                    toast.info(error.response.data.rtn);
                }

            })
    }

    fetchRecord = (data) => {
        this.setState({ loading: true })
        let selectedRecord = this.state.selectedRecord
        let inputParamData = {
            nsamplestoragelocationcode: this.state.masterData.selectedSampleStorageLocation.nsamplestoragelocationcode,
            nstorageinstrumentcode: this.state.masterData.selectedSampleStorageLocation.nstorageinstrumentcode,
            nNeedInstrumentFlow: parseInt(this.props.Login.settings[84]),
            userinfo: this.props.Login.userInfo,
        }
        let urlArray = [];
        const url1 = rsapi().post("samplestoragemapping/addSampleStorageMapping", inputParamData);

        const url2 = rsapi().post("product/getProduct",
            { 'userinfo': this.props.Login.userInfo });

        const url3 = rsapi().post("samplestoragemapping/getEditSampleStorageMapping",
            { 'nsamplestoragemappingcode': data.nsamplestoragemappingcode, 'userinfo': this.props.Login.userInfo });

        const getprojecttype = rsapi().post("/projecttype/getProjectType",
            { 'userinfo': this.props.Login.userInfo });

        const getUnit = rsapi().post("/unit/getUnit",
            { 'userinfo': this.props.Login.userInfo });

        urlArray = [url1, url2, url3, getprojecttype, getUnit];
        Axios.all(urlArray)
            .then(response => {
                const storageMappingMap = constructOptionList(response[0].data['samplestoragecontainerpath'] || [],
                    "nsamplestoragecontainerpathcode",
                    "scontainerpath", undefined, undefined, true);
                const storageMappingMapList = storageMappingMap.get("OptionList");
                //let containerStructure = response[0].data['containerStructure'];

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

                const projectTypeMap = constructOptionList(response[3].data || [], "nprojecttypecode",
                    "sprojecttypename", undefined, undefined, true);

                const projectTypeMapList = projectTypeMap.get("OptionList");

                const unitMap = constructOptionList(response[4].data || [], "nunitcode",
                    "sunitname", undefined, undefined, true);

                const unitMapList = unitMap.get("OptionList");

                selectedRecord = {
                    ndirectionmastercode: { label: editedObject.sdirection, value: editedObject.ndirectionmastercode },
                    nsamplestoragecontainerpathcode: { label: editedObject.scontainerpath, value: editedObject.nsamplestoragecontainerpathcode },
                    nproductcode: { label: editedObject.sproductname, value: editedObject.nproductcode },
                    nprojecttypecode: { label: editedObject.sprojecttypename, value: editedObject.nprojecttypecode },
                    nunitcode: { label: editedObject.sunitname, value: editedObject.nunitcode },
                    ncontainertypecode: { label: editedObject.scontainertype, value: editedObject.ncontainertypecode },
                    ncontainerstructurecode: { label: editedObject.scontainerstructurename, value: editedObject.ncontainerstructurecode },
                    nneedposition: editedObject.nneedposition === 3 ? true : false,
                    directionmasterOptions: directionmasterList,
                    nquantity: editedObject.nquantity,
                    nnoofcontainer: editedObject.nnoofcontainer,
                    nrow: editedObject.nrow,
                    ncolumn: editedObject.ncolumn,
                    nsamplestoragemappingcode: editedObject.nsamplestoragemappingcode
                }
                this.setState({
                    openSpreadSheet: false,
                    // ncontrolcode: this.state.controlMap.has("EditsampleStorageMapping") && this.state.controlMap.get("EditsampleStorageMapping").ncontrolcode,
                    sampleStorageMappingOpenModal: true,
                    selectedRecord: {
                        ...selectedRecord,
                        projectOptions: projectTypeMapList, unitOptions: unitMapList,
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


    //handleAdd = (e) => {
    //     let file = e.newState[0].getRawFile();
    //     let selectedRecord = this.state.selectedRecord;
    //     selectedRecord['nsamplestoragecontainerpathcode'] = []
    //     /* Boilerplate to set up FileReader */
    //     const reader = new FileReader();
    //     const rABS = !!reader.readAsBinaryString;
    //     let data = []
    //     reader.onload = (e) => {
    //         /* Parse data */
    //         const bstr = e.target.result;
    //         const wb = XLSX.read(bstr, {
    //             type: rABS ? 'binary' : 'array',
    //             bookVBA: true,
    //         });
    //         /* Get first worksheet */
    //         const wsname = wb.SheetNames[0];
    //         const ws = wb.Sheets[wsname];
    //         /* Convert array of arrays */
    //         data = XLSX.utils.sheet_to_json(ws);
    //         console.log(data);
    //         /* Update state */
    //         // this.setState({
    //         //     data,
    //         // });

    //         console.log('xlsx data :', this.state.storageMappingMapOptions)


    //         data.map((x, index) => {
    //             let clientcontainerpath = 'root > ' + x.fz_code + ' > ' + x.sf_code
    //                 + ' > ' + x.rk_code
    //                 + ' > ' + x.tr_code
    //                 + ' > ' + x.bx_code
    //             console.log('clientcontainerpath:', clientcontainerpath)

    //             this.state.storageMappingMapOptions.map((item, index) => {
    //                 if (item.label === clientcontainerpath) {
    //                     let i = -1
    //                     if (selectedRecord['nsamplestoragecontainerpathcode'].length > 0) {
    //                         i = selectedRecord['nsamplestoragecontainerpathcode']
    //                             .findIndex(k => k.label === clientcontainerpath)
    //                     }
    //                     x['nsamplestoragecontainerpathcode'] = this.state.storageMappingMapOptions[index].value
    //                     if (i === -1) {

    //                         selectedRecord['nsamplestoragecontainerpathcode'].push(this.state.storageMappingMapOptions[index]);
    //                     }
    //                 }
    //             });

    //         });
    //         let containerpathCodeArray = [];

    //         containerpathCodeArray = selectedRecord['nsamplestoragecontainerpathcode'].map(item => item.value);
    //         const inputParam = {
    //             nsamplestoragelocationcode: this.state.masterData.selectedSampleStorageLocation.nsamplestoragelocationcode,
    //             nsamplestoragemappingcode: 0,
    //             ncontainertypecode: 1,
    //             nproductcode: 9,
    //             nprojecttypecode: 2,
    //             ndirectionmastercode: 1,
    //             nsamplestoragecontainerpathcode: JSON.stringify(containerpathCodeArray),
    //             containerpathsize: containerpathCodeArray.length,
    //             nneedposition: 3,
    //             ncontainerstructurecode: 1,
    //             nquantity: 100,
    //             sboxid: '-',
    //             //nsamplestoragelocationcode: this.state.selectedRecordFilter["nsamplestoragelocationcode"].value,
    //             userinfo: this.props.Login.userInfo,
    //             clientData: JSON.stringify(data),
    //             isImport: true
    //         }
    //         this.CRUDSampleStorageMapping(inputParam, 'create', true);
    //         console.log('selectedRecord:', selectedRecord['nsamplestoragecontainerpathcode'])
    //     };
    //     if (rABS) {
    //         reader.readAsBinaryString(file);
    //     } else {
    //         reader.readAsArrayBuffer(file);
    //     }

    // };

    shouldComponentUpdate(nextProps, nextState) {
        if (this.state.sampleStorageMappingOpenModal && nextState.isInitialRender === false &&
            (nextState.selectedRecord !== this.state.selectedRecord)) {
            return false;
        } else if (this.state.sampleStorageMappingOpenModal && nextState.isInitialRender === false &&
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

    render() {

        //const addId = this.state.controlMap.has("AddSampleStorageMapping") && this.state.controlMap.get("AddSampleStorageMapping").ncontrolcode;
        const editId = this.state.controlMap.has("EditsampleStorageMapping") && this.state.controlMap.get("EditsampleStorageMapping").ncontrolcode;
        const deleteId = this.state.controlMap.has("DeletesampleStorageMapping") && this.state.controlMap.get("DeletesampleStorageMapping").ncontrolcode;
        const approveId = this.state.controlMap.has("ApprovesampleStorageMapping") && this.state.controlMap.get("ApprovesampleStorageMapping").ncontrolcode;


        const filterParam = {
            inputListName: "sampleStorageLocation", selectedObject: "selectedSampleStorageLocation", primaryKeyField: "nstorageinstrumentcode",
            fetchUrl: "samplestoragemapping/getActiveSampleStorageMappingById",
            fecthInputObject: { userinfo: this.props.Login.userInfo,npartitioncode: parseInt(this.props.Login.settings[84]) === transactionStatus.YES? this.props.Login.masterData && this.props.Login.masterData.selectedSampleStoragemapping &&  this.props.Login.masterData.selectedSampleStoragemapping.ninstrumentcode :  this.props.Login.masterData && this.props.Login.masterData.selectedSampleStoragemapping && this.props.Login.masterData.selectedSampleStoragemapping.nprojecttypecode},
            masterData: this.state.masterData,
            searchFieldList: parseInt(this.props.Login.settings[84]) === transactionStatus.YES ? ["sinstrumentid"] : ["ssamplestoragelocationname"]
        };

        const breadCrumbData = this.state.filterData || [];

        //const confirmMessage = new ConfirmMessage();
        return (
            <>
                <Preloader loading={this.state.loading} />
                <ListWrapper className="client-listing-wrap mtop-4 screen-height-window">
                    {breadCrumbData.length > 0 ?
                        <BreadcrumbComponent breadCrumbItem={breadCrumbData} />
                        : ""}
                    <Row noGutters={true} className={'sample-storage-mapping-grid'}>
                        {/* <SplitterLayout borderColor="#999" percentage={true} primaryIndex={1} onSecondaryPaneSizeChange={this.paneSizeChange} secondaryInitialSize={25} primaryMinSize={40} secondaryMinSize={20}> */}
                        <Splitter panes={this.state.panes} onChange={this.onSplitterChange} className='layout-splitter' orientation="horizontal">
                            <SplitterPane size="30%" min="25%">
                            <TransactionListMasterJsonView
                                paneHeight={this.state.parentHeight}
                                needMultiSelect={false}
                                masterList={this.state.masterData && this.state.masterData.searchedData ||
                                    this.state.masterData && this.state.masterData.sampleStorageLocation || []}
                                selectedMaster={[this.state.masterData && this.state.masterData.selectedSampleStorageLocation]}
                                primaryKeyField={"nstorageinstrumentcode"}
                                getMasterDetail={(selectedItem) =>
                                    this.getActiveSampleStorageMappingById(
                                        selectedItem,
                                        this.props.Login.userInfo
                                    )}
                                inputParam={{
                                    userInfo: this.props.Login.userInfo,
                                    masterData: this.props.Login.masterData
                                }}
                                mainField={"slocationinstrumentinfo"}
                                selectedListName="selectedSampleStorageLocation"
                                objectName="LocationMaster"
                                listName="IDS_STORAGESTRUCTURE"
                                filterColumnData={this.filterColumnData}
                                searchListName="searchedData"
                                searchRef={this.searchRef}
                                filterParam={filterParam}
                                showFilter={this.props.Login.showFilter}
                                openFilter={this.openFilter}
                                closeFilter={this.closeFilter}
                                onFilterSubmit={this.onFilterSubmit}
                                needFilter={true}
                                hidePaging={false}
                                handlePageChange={this.handlePageChange}
                                skip={this.state.skip}
                                take={this.state.take}
                                commonActions={
                                    <ProductList className="d-flex product-category float-right">
                                        {/* <Button className="btn btn-icon-rounded btn-circle solid-blue" role="button"
                                                    data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_ADD" })}
                                                hidden={this.state.userRoleControlRights.indexOf(addId) === -1}
                                                onClick={() => this.openStorageMapping(addId)}>
                                                <FontAwesomeIcon icon={faPlus} title={this.props.intl.formatMessage({ id: "IDS_ADD" })} />
                                            </Button> */}
                                        <Button className="btn btn-circle outline-grey ml-2 p-0" variant="link"
                                            onClick={() => this.reloadData()}
                                                data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_REFRESH" })}>
                                            <RefreshIcon className='custom_icons' />
                                        </Button>
                                    </ProductList>
                                }
                                filterComponent={[
                                    {
                                        "IDS_TESTFILTER":
                                            <StorageMappingFilter
                                                storageCategoryOptions={this.state.storageCategoryOptions || []}
                                                nfilterStorageCategory={this.state.nfilterStorageCategory || {}}
                                                storageLocationOptions={this.state.storageLocationOptions || []}
                                                storageLocationValue={this.state.storageLocationValue || []}
                                                sampleStorageVersionOptions={this.state.sampleStorageVersionOptions || []}
                                                storageVersionValue={this.state.storageVersionValue || []}
                                                onComboChange={this.onComboChange}
                                                selectedRecordFilter={this.state.selectedRecordFilter}
                                                selectedRecord={this.state.selectedRecord}
                                            />
                                    }
                                ]}

                            />
                            </SplitterPane>
                            <SplitterPane size="70%" min="25%" >
                            <>
                                <Card.Title className="product-title-main">
                                    {/* commented by sujatha ATE_274 before not using setting validation so rendering NA on structure flow*/}
                                    {/* {
                                        this.state.masterData && this.state.masterData.selectedSampleStorageLocation
                                          && this.state.masterData.selectedSampleStorageLocation.sinstrumentid } */}

                                    {/* added by sujatha ATE_274 ALPDJ21-59 for rendering name either instrument flow or structure flow dynamically */}
                                    {
                                        parseInt(this.props.Login.settings[84]) === transactionStatus.YES
                                            ? (
                                                this.state.masterData &&
                                                this.state.masterData.selectedSampleStorageLocation &&
                                                this.state.masterData.selectedSampleStorageLocation.sinstrumentid
                                            )
                                            : (
                                                this.state.masterData &&
                                                this.state.masterData.selectedSampleStorageLocation &&
                                                this.state.masterData.selectedSampleStorageLocation.slocationinstrumentinfo
                                            )
                                    }

                                </Card.Title>

                                <Card.Subtitle>
                                    <div className="d-flex product-category">
                                        <h2 className="product-title-sub flex-grow-1">
                                            <Nav.Link className="action-icons-wrap mr-2 pl-0">
                                                {
                                                    this.state.masterData && this.state.masterData.selectedSampleStorageLocation ?
                                                        this.state.masterData.selectedSampleStorageLocation.nmappingtranscode === transactionStatus.DRAFT ?

                                                            <span className={`btn btn-outlined  outline-secondary btn-sm mr-3`}>
                                                                <FormattedMessage id={"IDS_DRAFT"} defaultMessage="Draft" />
                                                            </span>
                                                            :
                                                            <span className={`btn btn-outlined outline-success btn-sm mr-3`}>
                                                                <FormattedMessage id={"IDS_APPROVED"} defaultMessage="Approved" />
                                                            </span> : ""
                                                }
                                            </Nav.Link>
                                        </h2>
                                        {/* <Nav.Link className="btn btn-circle outline-grey mr-2 " href="#"
                                                //hidden={this.state.userRoleControlRights.indexOf(copyId) === -1}
                                                // data-for="tooltip_list_wrap"
                                                data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_IMPORT" })}
                                                onClick={(e) => this.importdata(faThumbsUp)}
                                            >
                                                <FontAwesomeIcon icon={faFileImport} />

                                            </Nav.Link>  */}
                                        {/* <Button className="btn btn-circle outline-grey"
                                                            variant="link"
                                                            data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({
                                                                id: "IDS_SAMPLE"
                                                            })}
                                                            onClick={() => this.addSample({}, 2)}>
                                                            <FontAwesomeIcon icon={faPuzzlePiece} />
                                                        </Button> */}
                                        {/* {this.state.masterData && this.state.masterData.sampleStoragemapping && 
                                                          <Button className="btn btn-circle outline-grey"
                                            variant="link"
                                            data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({
                                                id: "IDS_APPROVE"
                                            })}
                                            hidden={this.state.userRoleControlRights.indexOf(approveId) === -1}
                                            onClick={() => this.approveSampleStorageMapping()}

                                        >
                                            <FontAwesomeIcon icon={faThumbsUp} />
                                        </Button>} */}

                                        {/* <div className="d-flex justify-content-end mt-3">
                                                            <Button className="btn-user btn-primary-blue"
                                                                onClick={() => this.getDynamicFilterExecuteData()}>
                                                                <FontAwesomeIcon icon={faCalculator} /> { }
                                                                <FormattedMessage id='IDS_EXECUTE' defaultMessage='Execute' />
                                                            </Button>
                                                        </div> */}
                                    </div>

                                </Card.Subtitle>
                                {/* <FilterQueryBuilder
                                                    fields={this.state.fields}
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
                                                /> */}

                                <DataGrid
                                    isRefreshRequired={false}
                                    // fetchRecord={this.fetchRecord}
                                    // editParam={{ 'primaryKeyField': 'nsamplestoragemappingcode' }}
                                    // handleClickDelete={this.deletesamplestoragemapping}
                                    methodUrl={'SampleStorageMapping'}
                                    isAddRequired={this.state.masterData &&
                                        this.state.masterData.sampleStoragemapping ? true : false}
                                    primaryKeyField={'nsamplestoragemappingcode'}
                                    data={this.state.masterData && this.state.masterData.sampleStoragemapping &&
                                        this.state.masterData.sampleStoragemapping}
                                    dataResult={this.state.masterData &&
                                        this.state.masterData.sampleStoragemapping &&
                                        process(this.state.masterData.sampleStoragemapping || [],
                                            this.state.dataStateChange ? this.state.dataStateChange : { skip: 0, take: 10 })}
                                    dataState={this.state.dataStateChange ? this.state.dataStateChange : { skip: 0, take: 10 }}
                                    dataStateChange={this.dataStateChange}
                                    isCustomButton={true}
                                    customButtonlist={this.state.masterData && this.state.masterData.sampleStoragemapping ? [{
                                        label: 'IDS_APPROVE',
                                        id: {},
                                        hidden: this.state.userRoleControlRights.indexOf(approveId) === -1,
                                        onClick: () => this.approveSampleStorageMapping(),
                                        controlname: 'faThumbsUp'
                                    }] : []}
                                    extractedColumnList={[
                                        { "idsName": "IDS_SAMPLESTORAGEPATH", "dataField": "scontainerpath", "width": "450px" },
                                        { "idsName": "IDS_PRODUCT", "dataField": "sproductname", "width": "200px" },
                                        { "idsName": "IDS_PROJECTTYPE", "dataField": "sprojecttypename", "width": "200px" },
                                        { "idsName": "IDS_CONTAINERID", "dataField": "sboxid", "width": "200px" },
                                        { "idsName": "IDS_CONTAINERTYPE", "dataField": "scontainertype", "width": "200px" },
                                        { "idsName": "IDS_CONTAINERSTRUCTURENAME", "dataField": "scontainerstructurename", "width": "200px" },
                                        { "idsName": "IDS_AVAILABLEQTY", "dataField": "nquantity", "width": "200px" },
                                        { "idsName": "IDS_UNIT", "dataField": "sunitname", "width": "200px" },//ALPD-4483 janakumar added the unit datagrid field
                                        { "idsName": "IDS_NEEDPREDEFINEDSTRUCURE", "dataField": "stransdisplaystatus", "width": "200px" }

                                    ]}
                                    controlMap={this.state.controlMap}
                                    userRoleControlRights={this.state.userRoleControlRights}
                                    userInfo={this.props.Login.userInfo}
                                    //     fetchRecord={this.fetchRecord}
                                    //    editParam={{ 'primaryKeyField': 'nsamplestoragemappingcode' }}
                                    // deleteRecord={this.deleteRecord}
                                    addRecord={() => this.openStorageMapping()}
                                    pageable={true}
                                    scrollable={'scrollable'}
                                    // isComponent={true}
                                        gridHeight={'600px'}
                                    isActionRequired={true
                                        // this.state.masterData&&this.state.masterData.
                                        // selectedSampleStorageLocation&&this.state.masterData.
                                        //     selectedSampleStorageLocation.nmappingtranscode
                                        //     === transactionStatus.DRAFT ? true : false
                                    }
                                    isToolBarRequired={true}
                                    //ATE234 Janakumar ALPD-5577 Sample Storage-->while download the pdf, screen getting freezed
                                    isDownloadPDFRequired={false}
                                    isDownloadExcelRequired={true}
                                    actionIcons={
                                        // this.state.masterData&&this.state.masterData.
                                        // selectedSampleStorageLocation&&this.state.masterData.
                                        // selectedSampleStorageLocation.nmappingtranscode
                                        // === transactionStatus.DRAFT ?
                                        [
                                            {
                                                title: this.props.intl.formatMessage({ id: "IDS_EDIT" }),
                                                controlname: "faPencilAlt",
                                                hidden: this.state.userRoleControlRights.indexOf(editId) === -1,
                                                objectName: "edit",
                                                onClick: this.fetchRecord
                                            },
                                            {
                                                title: this.props.intl.formatMessage({ id: "IDS_DELETE" }),
                                                controlname: "faTrashAlt",
                                                hidden: this.state.userRoleControlRights.indexOf(deleteId) === -1,
                                                objectName: "delete",
                                                onClick: this.handleClickDelete
                                            },
                                            // {
                                            //     title: this.props.intl.formatMessage({ id: "IDS_ADDSAMPLE" }),
                                            //     controlname: "faPenSquare",
                                            //     hidden: false,
                                            //     objectName: "add",
                                            //     onClick: (param) => this.addSample(param, 1)
                                            // }
                                        ]
                                        // : []
                                    }
                                    />   
                                 </>
                            </SplitterPane>
                        </Splitter>
                        {/* </SplitterLayout> */}
                    </Row>
                </ListWrapper >

                {
                    this.state.sampleStorageMappingOpenModal &&
                    <SlideOutModal show={this.state.sampleStorageMappingOpenModal}
                        closeModal={this.closeModal}
                        size={this.state.openSpreadSheet ? 'xl' : ""}
                        operation={this.state.operation}
                        inputParam={this.props.Login.inputParam}
                        screenName={this.props.intl.formatMessage({ id: "IDS_SAMPLESTORAGEMAPPING" })}
                        onSaveClick={this.onSampleMappingSaveClick}
                        esign={this.props.Login.loadEsign}
                        // className={"wide-popup"}

                        validateEsign={this.validateEsign}
                        masterStatus={this.props.Login.masterStatus}
                        updateStore={this.props.updateStore}
                        selectedRecord={this.state.selectedRecord || {}}
                        addComponent={
                            // this.state.importdata ?
                            // <Upload
                            //     batch={false}
                            //     multiple={false}
                            //     defaultFiles={[]}
                            //     withCredentials={false}
                            //     autoUpload={false}
                            //     onAdd={this.handleAdd}
                            // />
                            // :

                            this.props.Login.loadEsign ?
                                <Esign operation={this.props.Login.operation || this.state.operation}
                                    formatMessage={this.props.intl.formatMessage}
                                    onInputOnChange={this.onInputOnChange}
                                    inputParam={this.props.Login.inputParam}
                                    selectedRecord={this.state.selectedRecord || {}}
                                />
                                :
                                this.state.openSpreadSheet ? <>
                                    {/* <Spreadsheet
                                    data={acedSample}
                                    Rows={this.state.Rows || 1}
                                    columns={this.state.columns || 1}
                                /> */}
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
                                            this.state.masterData.sampleStoragemapping &&
                                            process(this.state.masterData.sampleStoragemapping || [],
                                                this.state.dataStateChange ? this.state.dataStateChange : { skip: 0, take: 10 }).data} />
                                </> :
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
        let screenData = this.props.Login.screenData;
        screenData['inputParam']['selectedRecord'] = this.state.selectedRecord || {};
        if (screenData['inputParam']['selectedRecord']['nsamplestoragecontainerpathcode']) {
            delete screenData['inputParam']['selectedRecord']['nsamplestoragecontainerpathcode'];
        }
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
            screenData: screenData
        }

        this.props.validateEsignCredentialStorage(inputParam, "sampleStorageMappingOpenModal");
    }


}
const mapStateToProps = (state) => {
    return {
        Login: state.Login
    }
}

export default connect(mapStateToProps, {
    callService, updateStore, validateEsignCredentialStorage
})(injectIntl(SampleStorageMapping));