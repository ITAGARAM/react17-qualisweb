import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { Lims_JSON_stringify, constructOptionList, getControlMap, onSaveMandatoryValidation, searchData, searchJsonData, showEsign, sortData, rearrangeDateFormat } from '../../components/CommonScript';
import {   Utils as QbUtils} from "@react-awesome-query-builder/ui";
import SlideOutModal from '../../components/slide-out-modal/SlideOutModal';
import {
    callService, validateEsignCredential, updateStore,  validateEsignCredentialStorage, crudMasterstorage
} from '../../actions';
import { DEFAULT_RETURN, UN_AUTHORIZED_ACCESS } from '../../actions/LoginTypes';
import { ListWrapper } from '../../components/client-group.styles';
//import { uuid } from 'uuidv4';
import { v4 as uuid } from 'uuid';
import ConfirmMessage from '../../components/confirm-alert/confirm-message.component';
import { transactionStatus } from '../../components/Enumeration';
import Esign from '../audittrail/Esign';import rsapi from '../../rsapi';
import Axios from 'axios';import Preloader from '../../components/preloader/preloader.component';

import {  process } from '@progress/kendo-data-query';
import MatrixComponent from '../../components/MatrixComponent';
import FilterQueryBuilder from '../../components/FilterQueryBuilder';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import MoveSample from '../storagemanagement/MoveSample';
import DataGridForStorage from './DataGridForStorage';


class SampleStorageMove extends Component {
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
            extractedColumnList: [
                { "idsName": "IDS_STORAGESTRUCTURE", "dataField": "ssamplestoragelocationname", "width": "200px" },
                { "idsName": "IDS_SAMPLESTORAGEPATH", "dataField": "scontainerpath", "width": "450px" },
                {
                    "idsName": "IDS_AVAILABLESPACE", "dataField": "navailablespace", "width": "200px"
                    // , "filterType": "numeric" 
                },
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
                        field: "ssamplestoragelocationname",
                    },
                ],
            }
        };
        let fields = {};
        if (this.state.extractedColumnList) {
            this.state.extractedColumnList.map(field => {
                if (field.dataField !== 'ssamplestoragelocationname' && field.dataField !== 'sproductname'
                    && field.dataField !== 'sprojecttypename' && field.dataField !== 'scontainertype'
                    && field.dataField !== 'scontainerstructurename') {
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
            sampleStorageVersionOptions, masterData, dataResult, selectedRecordFilter, fields, selectedProjectType, openModal, loadEsign, selectedInstrument } = this.state
        let bool = false;
        ///////////////////////////////
        if (this.props.Login.openModal !== previousProps.Login.openModal) {
            bool = true;
            openModal = this.props.Login.openModal;
        }
        if (this.props.Login.loadEsign !== previousProps.Login.loadEsign) {
            bool = true;
            loadEsign = this.props.Login.loadEsign;
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
        if (this.props.Login.masterData.sampleType !== previousProps.Login.masterData.sampleType) {
            let queryBuilderFreezer = [];
            bool = true;
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
        }

        //Added by jana
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
        //Added by jana
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
            if (this.state.masterData.sampleStoragetransaction) {
                if (this.state.masterData.sampleStoragetransaction !== previousState.masterData.sampleStoragetransaction) {
                    masterData = this.state.masterData;
                    // console.log('masterData.sampleStoragetransaction', dataResult)
                    //ALPD-4496 janakumar  pagination  work 
                    if (masterData.sampleStoragetransaction !== undefined && masterData.sampleStoragetransaction.length > this.state.dataStateChange.skip === false) {
                        this.state.dataStateChange.skip = 0;
                        this.state.dataStateChange.take = 10;
                    }
                    dataResult = masterData.sampleStoragetransaction ?
                        this.processWithGroups(masterData.sampleStoragetransaction || [],
                            this.state.dataStateChange ? this.state.dataStateChange : {
                                take: 10,
                                skip: 0
                            }) : []




                    // console.log('dataResultn', dataResult)
                }
            }

            filterData = this.generateBreadCrumData(this.state.masterData);

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
                userRoleControlRights, storageLocationOptions,
                sampleStorageVersionOptions, masterData, selectedRecordFilter, fields, selectedProjectType, openModal, loadEsign, dataResult, selectedInstrument
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
        let loadEsign = this.state.loadEsign;
        let openModal = this.state.openModal;
        let selectedRecord = this.state.selectedRecord;
        if (loadEsign) {
            //  loadEsign = false;
            openModal = true;
            loadEsign = false;
            selectedRecord['esignpassword'] = ""
            selectedRecord['esigncomments'] = ""
            selectedRecord['esignreason'] = ""
            //ALPD-4738
            //Fixed: Removed the store action in sample retrieval, and the screen is now fully managed through the state.
            // const updateInfo = {
            //     typeName: DEFAULT_RETURN,
            //     data: { openModal, loadEsign, selectedRecord, selectedId: null }
            // }
            // this.props.updateStore(updateInfo);
            this.setState({ openModal, loadEsign, selectedRecord, selectedId: null })
        }
        else {
            openModal = false;
            selectedRecord = {};
        }
        this.setState({
            selectedRecord,
            // ismoveSample: false,
            openModal, isInitialRender: true
            , isFilterPopup: false,
            loadEsign: false
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
        } else if (this.state.openSpreadSheet && !this.state.ismoveSample) {
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
        } else if (this.state.ismoveSample) {
            let destinationPathlst = [];
            let dataResult = this.state.dataResult;
            dataResult.data.map(item => {
                item.items.map(item => {
                    if (item.hasOwnProperty('selected') && item.selected) {
                        destinationPathlst.push(item);
                    }
                });
            });
            if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.state.ncontrolcode)) {
                const masterData = this.state.masterData;
                let inputParam = {
                    methodUrl: "SampleStorageTransaction",
                    operation: "update",
                    classUrl: "samplestoragemove",

                    inputData: this.state.isMultiContainermove ? {
                        selectedContainers: JSON.stringify(destinationPathlst),
                        nsourcemappingcode: JSON.stringify(destinationPathlst.map(y => y.nsamplestoragemappingcode)),
                        nsourcensamplestoragelocationcode: JSON.stringify(destinationPathlst.map(y => y.nsamplestoragelocationcode)),
                        nsourcenprojecttypecode: JSON.stringify(destinationPathlst.map(y => y.nprojecttypecode)),
                        destinationPathCount: destinationPathlst.length,
                        isMultiContainermove: true,
                        nsamplestoragelocationcode: this.state.selectedRecord.nsamplestoragelocationcode.value,
                        ...this.state.masterData,
                        userinfo: this.props.Login.userInfo
                    } : {
                        nsourcemappingcode: this.state.editedsheetData.nsamplestoragemappingcode,
                        nsourceprojecttypecode: this.state.editedsheetData.nprojecttypecode,
                        nsourcesamplestoragelocationcode: this.state.editedsheetData.nsamplestoragelocationcode,
                        nsamplestoragelocationcode: this.state.selectedRecord.nsamplestoragelocationcode.value,
                        nsamplestoragemappingcode: this.state.selectedRecord.nsamplestoragemappingcode.value,
                        nprojecttypecode: this.state.selectedRecord.nsamplestoragemappingcode.item.nprojecttypecode,
                        filterprojecttypecode: this.state.selectedProjectType.value,

                        ssamplestoragelocationname: this.state.editedsheetData.ssamplestoragelocationname,
                        ssamplestoragepathname: this.state.editedsheetData.scontainerpath,
                        stosamplestoragelocationname: this.state.selectedRecord.nsamplestoragelocationcode.label,
                        stosamplestoragepathname: this.state.selectedRecord.nsamplestoragemappingcode.label,
                        sboxid: this.state.editedsheetData.sboxid,
                        stoboxid: this.state.selectedRecord.nsamplestoragemappingcode.item.sboxid,
                        ...this.state.masterData,
                        userinfo: this.props.Login.userInfo
                    }
                }
                //ALPD-4738
                //Fixed: Removed the store action in sample retrieval, and the screen is now fully managed through the state.
                this.setState({ loading: true })
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
                            loadEsign: true, openModal: true, screenData: { inputParam, masterData },
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
                //         loadEsign: true, openModal: true,  screenData: { inputParam, masterData }
                //     }
                // }
                // this.props.updateStore(updateInfo);
                //this.setState({ loadEsign: true, openModal: true,  screenData: { inputParam, masterData }})
            }
            else {
                if (this.state.isMultiContainermove) {
                    this.CRUDSampleStorageTransaction({
                        selectedContainers: JSON.stringify(destinationPathlst),
                        nsourcemappingcode: JSON.stringify(destinationPathlst.map(y => y.nsamplestoragemappingcode)),
                        //ALPD-4490--Vignesh R(07-08-2024)
                        nsourcenprojecttypecode: JSON.stringify(destinationPathlst.map(y => y.nprojecttypecode)),
                        nsourcensamplestoragelocationcode: JSON.stringify(destinationPathlst.map(y => y.nsamplestoragelocationcode)),
                        destinationPathCount: destinationPathlst.length,
                        isMultiContainermove: true,
                        nsamplestoragelocationcode: this.state.selectedRecord.nsamplestoragelocationcode.value,
                        // nsamplestoragemappingcode: this.state.selectedRecord.nsamplestoragemappingcode.value,
                        // nprojecttypecode: this.state.selectedRecord.nsamplestoragemappingcode.item.nprojecttypecode,
                        //Added By ATE234 janakumkar BGSI Work
                        //filterquery: this.state.submittedselectedRecord.filterquery + " and nprojecttypecode=" + this.state.selectedProjectType.value,
                        filterquery: (this.state?.submittedselectedRecord?.filterquery ? this.state.submittedselectedRecord.filterquery +
                            " and " : "") + "nprojecttypecode=" + this.state.selectedProjectType.value + ""
                            + (parseInt(this.props.Login.settings[84]) === transactionStatus.YES
                                ? " and ninstrumentcode=" + (this.state?.selectedInstrument?.value || -1)
                                : ""),

                        userinfo: this.props.Login.userInfo
                    }, 'update');
                } else {
                    this.CRUDSampleStorageTransaction({
                        nsourcemappingcode: this.state.editedsheetData.nsamplestoragemappingcode,
                        //ALPD-4490--Vignesh R(07-08-2024)
                        nsourcesamplestoragelocationcode: this.state.editedsheetData.nsamplestoragelocationcode,
                        nsourceprojecttypecode: this.state.editedsheetData.nprojecttypecode,
                        nsamplestoragelocationcode: this.state.selectedRecord.nsamplestoragelocationcode.value,
                        nsamplestoragemappingcode: this.state.selectedRecord.nsamplestoragemappingcode.value,
                        nprojecttypecode: this.state.selectedRecord.nsamplestoragemappingcode.item.nprojecttypecode,
                        filterprojecttypecode: this.state.selectedProjectType.value,
                        ssamplestoragelocationname: this.state.editedsheetData.ssamplestoragelocationname,
                        ssamplestoragepathname: this.state.editedsheetData.scontainerpath,
                        stosamplestoragelocationname: this.state.selectedRecord.nsamplestoragelocationcode.label,
                        stosamplestoragepathname: this.state.selectedRecord.nsamplestoragemappingcode.label,
                        sboxid: this.state.editedsheetData.sboxid,
                        stoboxid: this.state.selectedRecord.nsamplestoragemappingcode.item.sboxid,
                        //filterquery: this.state.submittedselectedRecord.filterquery + " and nprojecttypecode=" + this.state.selectedProjectType.value,
                        //Added By ATE234 janakumkar BGSI Work
                        filterquery: (this.state?.submittedselectedRecord?.filterquery ? this.state.submittedselectedRecord.filterquery +
                            " and " : "") + "nprojecttypecode=" + this.state.selectedProjectType.value + ""
                            + (parseInt(this.props.Login.settings[84]) === transactionStatus.YES
                                ? " and ninstrumentcode=" + (this.state?.selectedInstrument?.value || -1)
                                : ""),

                        userinfo: this.props.Login.userInfo
                    }, 'update');
                }
            }
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
            openModal: true, isFilterPopup: true, openSpreadSheet: false, ismoveSample: false, selectedRecord: { ...this.state.submittedselectedRecord } ||
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
                        loading: false,
                        loadEsign: false, ismoveSample: false
                    })
                } else {
                    this.setState({
                        sheetData: JSON.parse(response[0].data.sheetData),
                        AdditionalFieldsComponentData: JSON.parse(response[0].data.AdditionalFieldsComponentData),
                        openModal: true, isMultiSampleAdd: false, openSpreadSheet: true,
                        editedsheetData: param, Rows: param.nrow, columns: param.ncolumn,
                        loading: false, loadEsign: false, ismoveSample: false
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
        let selectedRecordFilter = this.state.selectedRecordFilter || {};
        let selectedProjectType = this.state.selectedProjectType;
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

            if (this.props.Login.settings && parseInt(this.props.Login.settings[84]) === transactionStatus.YES) {

                return this.getInstrument({
                    userinfo: this.props.Login.userInfo,
                    nprojecttypecode: comboData.value

                }, fieldName, comboData);


            } else {
                if (selectedProjectType.value !== comboData.value) {
                    masterData = {
                        ...masterData,
                        sampleStoragetransaction: []
                    }
                }
                this.setState({ masterData, selectedProjectType: { label: comboData.label, value: comboData.value } })
            }

        } else if (fieldName === 'ncontainerstructurecode') {
            selectedRecord['nrow'] = comboData.item.nrow ? comboData.item.nrow : 1;
            selectedRecord['ncolumn'] = comboData.item.ncolumn ? comboData.item.ncolumn : 1;
        } else if (fieldName === 'nsamplestoragelocationcode') {
            return this.getSampleStorageLocation({
                userinfo: this.props.Login.userInfo,
                nstoragecategorycode: this.state.selectedRecordFilter['nstoragecategorycode'].value,
                nsamplestoragelocationcode: comboData.value

            }, fieldName, comboData);
        } else if (fieldName === 'ninstrumentcode') {

            if (this.state?.selectedProjectType?.value !== undefined) {

                let obj = {
                    ninstrumentcode: comboData.value || -1,
                    label: 'sampleStoragetransaction', valuemember: 'nsamplestoragemappingcode',
                    filterquery: " ninstrumentcode =" + comboData.value +
                        " and nprojecttypecode=" + this.state.selectedProjectType.value + " "
                    , source: 'view_samplestoragelocation', userinfo: this.props.Login.userInfo
                }

                rsapi().post("/samplestoragemove/getdynamicfilterexecutedata", obj)
                    .then(response => {

                        masterData = {
                            ...masterData,
                            ...response.data,
                        }

                        this.setState({
                            submittedselectedRecord: [], masterData,
                            selectedInstrument: { label: comboData.label, value: comboData.value }
                        })


                    }).catch(error => {
                        if (error.response.status === 401 || error.response.status === 403) {
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
            } else {
                toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTAFILTER" }));
            }


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

    childDataChange = (selectedRecord, availableContainersdata) => {
        this.setState({
            availableContainers: availableContainersdata,
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

    ConfirmMove = () => {
        let destinationPathlst = [];
        let dataResult = this.state.dataResult;
        dataResult.data.map(item => {
            item.items.map(item => {
                if (item.hasOwnProperty('selected') && item.selected) {
                    destinationPathlst.push(item);
                }
            });
        });
        const inputData = {
            isok: true,
            filterprojecttypecode: this.state.selectedProjectType.value,
            selectedContainers: JSON.stringify(destinationPathlst),
            nsourcemappingcode: JSON.stringify(destinationPathlst.map(y => y.nsamplestoragemappingcode)),
            destinationPathCount: destinationPathlst.length,
            isMultiContainermove: true,
            nsamplestoragelocationcode: this.state.selectedRecord.nsamplestoragelocationcode.value,
            userinfo: this.props.Login.userInfo
        }
        const inputParam = {
            methodUrl: "SampleStorageTransaction",
            classUrl: 'samplestoragemove',
            inputData: inputData,
            operation: "update",
            dataState: this.state.dataStateChange,
        };

        this.confirmMessage.confirm("deleteMessage",
            this.props.intl.formatMessage({ id: "IDS_WARNING" }),
            this.props.intl.formatMessage({ id: "IDS_MISMATCHCONFIRMMSG" }),
            this.props.intl.formatMessage({ id: "IDS_OK" }),
            this.props.intl.formatMessage({ id: "IDS_CANCEL" }),
            this.state.loadEsign ?
                () => this.props.crudMasterstorage(inputParam, this.state.masterData, "openModal")
                :
                () => this.CRUDSampleStorageTransaction({ ...inputData }, 'update'));
    }
    CRUDSampleStorageTransaction = (inputParam, operation) => {
        this.setState({ loading: true })
        let urlArray = [];
        const url1 = rsapi().post("samplestoragemove/" + operation + "SampleStorageTransaction", inputParam);
        urlArray = [url1];
        Axios.all(urlArray)
            .then(response => {
                // if(this.state.isMultiContainermove){
                //     this.ConfirmMove()
                // }else{
                this.setState({
                    isInitialRender: true,
                    selectedRecord: {},
                    masterData: {
                        ...this.state.masterData, ...response[0].data
                    },
                    openModal: false,
                    loading: false,
                    ismoveSample: false
                });
                //} 
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
                    if (error.response.data === 'IDS_SOURCEANDDESTINATIONMISMATCH') {
                        this.ConfirmMove()
                    } else {
                        toast.warn(error.response.data);
                    }
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
                    submittedselectedRecord: [], masterData: { ...masterData, sampleStoragetransaction: [] }, loading: false,
                    selectedProjectType: { label: comboData.label, value: comboData.value }, selectedInstrument: {}
                    //selectedInstrument: { label: response[0].data.selectedInstrument.sinstrumentid, value: response[0].data.selectedInstrument.ninstrumentcode }
                })

            }).catch(error => {
                if (error.response.status === 401 || error.response.status === 403) {
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
        const mandatoryFields =
            this.state.isMultiContainermove ?
                [{
                    "idsName": "IDS_TOSTORAGESTRUCTURENAME", "dataField": "nsamplestoragelocationcode",
                    "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox"
                }] :
                [{
                    "idsName": "IDS_TOSTORAGESTRUCTURENAME", "dataField": "nsamplestoragelocationcode",
                    "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox"
                },
                {
                    "idsName": "IDS_TOSAMPLESTORAGEPATH",
                    "dataField": "nsamplestoragemappingcode", "mandatoryLabel":
                        "IDS_SELECT", "controlType": "selectbox"
                }]
        // :
        // this.state.openSpreadSheet ? [] : this.state.selectedRecord["nneedposition"] === undefined ||
        //     this.state.selectedRecord["nneedposition"] === false ? [
        //     {
        //         "idsName": "IDS_SAMPLESTORAGEMAPPING", "dataField": "nsamplestoragecontainerpathcode",
        //         "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox"
        //     },
        //     {
        //         "idsName": "IDS_PRODUCT",
        //         "dataField": "nproductcode", "mandatoryLabel":
        //             "IDS_SELECT", "controlType": "selectbox"
        //     },
        //     {
        //         "idsName": "IDS_AVAILABLESPACE",
        //         "dataField": "nquantity", "mandatoryLabel":
        //             "IDS_ENTER", "controlType": "selectbox"
        //     }
        // ] : [
        //     {
        //         "idsName": "IDS_SAMPLESTORAGEMAPPING", "dataField": "nsamplestoragecontainerpathcode",
        //         "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox"
        //     },
        //     {
        //         "idsName": "IDS_PRODUCT",
        //         "dataField": "nproductcode", "mandatoryLabel":
        //             "IDS_SELECT", "controlType": "selectbox"
        //     }
        //     ,
        //     {
        //         "idsName": "IDS_CONTAINERTYPE",
        //         "dataField": "ncontainertypecode", "mandatoryLabel":
        //             "IDS_SELECT", "controlType": "selectbox"
        //     },
        //     {
        //         "idsName": "IDS_CONTAINERSTRUCTURENAME",
        //         "dataField": "ncontainerstructurecode", "mandatoryLabel":
        //             "IDS_SELECT", "controlType": "selectbox"
        //     },
        //     {
        //         "idsName": "IDS_DIRECTION",
        //         "dataField": "ndirectionmastercode", "mandatoryLabel":
        //             "IDS_ENTER", "controlType": "selectbox"
        //     },
        //     {
        //         "idsName": "IDS_AVAILABLESPACE",
        //         "dataField": "nquantity", "mandatoryLabel":
        //             "IDS_ENTER", "controlType": "selectbox"
        //     }
        // ]
        onSaveMandatoryValidation(this.state.selectedRecord, mandatoryFields,
            this.onSaveClick)
    }
    dataStateChange = (event) => {
        let dataResult = this.state.dataResult;
        if (this.state.masterData.sampleStoragetransaction) {
            dataResult = this.state.masterData.sampleStoragetransaction ?
                this.processWithGroups(this.state.masterData.sampleStoragetransaction || [],
                    event.dataState ? event.dataState : {
                        take: 10,
                        skip: 0
                    }) : []
            dataResult.data.map(x => {
                return x.items.map(item => {
                    item.selected = false;
                    return item;
                });
            });
        }
        this.setState({
            dataResult: dataResult,
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
        let strInstrument = "";
        let isStorageFilter = parseInt(this.props.Login.settings[84]) === transactionStatus.YES
            ? this.state.selectedInstrument ? strInstrument = " and ninstrumentcode =" + this.state?.selectedInstrument?.value || -1 + undefined : undefined : "NA";

        const selectfilterData = parseInt(this.props.Login.settings[84]) === transactionStatus.YES ? selectedRecord['filterquery'] : "";

        if (nflag === 2 ? true : (selectedRecord.filterquery && selectedRecord?.filterquery !== undefined && selectedRecord.filterquery !== "" && this.state.selectedProjectType.value !== undefined && isStorageFilter !== undefined)) {
            let isFilterEmpty = this.checkFilterIsEmptyQueryBuilder(selectedRecord.filterQueryTreeStr);
            if (isFilterEmpty) {
                this.setState({ loading: true })
                let obj = {// ...inputParam.component, 
                    label: 'sampleStoragetransaction', valuemember: 'nsamplestoragemappingcode',
                    filterquery: nflag === 2 ?
                        (this.state?.submittedselectedRecord?.filterquery ? this.state.submittedselectedRecord.filterquery
                            + " and " : "") + "nprojecttypecode=" + this.state.selectedProjectType.value + " " + strInstrument + ""
                        //this.state.submittedselectedRecord.filterquery + " and nprojecttypecode=" + this.state.selectedProjectType.value + strInstrument
                        :
                        selectedRecord.filterquery + " and nprojecttypecode=" + this.state.selectedProjectType.value + strInstrument
                    , source: 'view_samplestoragelocation', userinfo: this.props.Login.userInfo
                }
                let urlArray = [];
                const url1 = rsapi().post("/samplestoragemove/getdynamicfilterexecutedata", obj);
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
    movemultipleContainer = () => {
        let destinationPathlst = [];
        let dataResult = this.state.dataResult;
        dataResult.data.map(item => {
            item.items.map(item => {
                if (item.hasOwnProperty('selected') && item.selected) {
                    destinationPathlst.push(item);
                }
            });
        });
        if (destinationPathlst.length > 0) {
            this.setState({ loading: true })
            let urlArray = [];
            const url1 = rsapi().post("samplestoragemove/getsamplemovedata",
                {
                    isMultiContainermove: true,
                    // ncontainertypecode: 1,
                    // ncontainerstructurecode: 1,
                    isMultiContainermove: true,
                    userinfo: this.props.Login.userInfo
                });
            urlArray = [url1];
            Axios.all(urlArray)
                .then(response => {
                    let storagemoverecords = {};
                    let selectedRecord = this.state.selectedRecord;
                    const samplestoragecontainerpathMap = constructOptionList(response[0].data['samplestoragecontainerpath'] || [],
                        "nsamplestoragecontainerpathcode",
                        "scontainerpath", undefined, undefined, true);
                    const samplestoragecontainerpathList = samplestoragecontainerpathMap.get("OptionList");
                    const storageStructureMap = constructOptionList(response[0].data['sampleStorageLocation'] || [],
                        "nsamplestoragelocationcode",
                        "ssamplestoragelocationname", "descending", undefined, true);
                    const storageStructureList = storageStructureMap.get("OptionList");

                    storagemoverecords = this.state.masterData.sampleStoragetransaction.filter(item =>
                        item.hasOwnProperty('selected') && item.selected
                    )
                    selectedRecord = {
                        ...selectedRecord,
                        nsamplestoragelocationcode: {
                            label: storageStructureList[0].label,
                            value: storageStructureList[0].value,
                            item: storageStructureList[0]
                        },
                        storageStructureOptions: storageStructureList,
                    };
                    this.state.masterData.sampleStoragetransaction.map(item =>
                        selectedRecord = {
                            ...selectedRecord,
                            mappingcodeOptions: {
                                ...selectedRecord.mappingcodeOptions,
                                [item.nsamplestoragemappingcode]: samplestoragecontainerpathList
                            }
                        }
                    )
                    this.setState({
                        availableContainers: response[0].data['availableContainers'],
                        totalContainers: response[0].data['totalContainers'],
                        selectedRecord,
                        isMultiContainermove: true,
                        storagemoverecords: storagemoverecords,
                        ismoveSample: true,
                        openModal: true,
                        loadEsign: false,
                        loading: false,
                        ncontrolcode: this.state.controlMap.has("Move Multiple Container") && this.state.controlMap.get("Move Multiple Container").ncontrolcode
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
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTACONTAINERTOMOVE" }));

        }
    }
    moveSample = (param, nflag) => {
        this.setState({ loading: true })
        let urlArray = [];
        const url1 = rsapi().post("samplestoragemove/getsamplemovedata",
            {
                nsamplestoragemappingcode: param.nsamplestoragemappingcode,
                ncontainertypecode: param.ncontainertypecode,
                ncontainerstructurecode: param.ncontainerstructurecode,
                userinfo: this.props.Login.userInfo,
                ninstrumentcode: param.ninstrumentcode
            });
        const getProjectType = rsapi().post("projecttype/getProjectType", {
            "userinfo": this.props.Login.userInfo
        });
        const getProduct = rsapi().post("/samplestoragelocation/getProduct",
            { 'userinfo': this.props.Login.userInfo });
        urlArray = [url1, getProduct, getProjectType];
        Axios.all(urlArray)
            .then(response => {
                const storageStructureMap = constructOptionList(response[0].data['sampleStorageLocation'] || [],
                    "nsamplestoragelocationcode",
                    "ssamplestoragelocationname", "descending", undefined, true);
                const storageStructureList = storageStructureMap.get("OptionList");

                // const samplestoragecontainerpathMap = constructOptionList(response[0].data['samplestoragecontainerpath'] || [],
                //     "nsamplestoragecontainerpathcode",
                //     "scontainerpath", undefined, undefined, true);
                // const samplestoragecontainerpathList = samplestoragecontainerpathMap.get("OptionList");
                // ALPD-3757
                const sampleStorageMappingMap = constructOptionList(response[0].data['samplestoragecontainerpath'] || [],
                    "nsamplestoragemappingcode", "scontainerpath", undefined, undefined, true
                );
                const sampleStorageMappingList = sampleStorageMappingMap.get("OptionList");

                const sampleTypeMap = constructOptionList(response[1].data || [], "nproductcode", "sproductname", undefined, undefined, true);

                const sampleTypeList = sampleTypeMap.get("OptionList");

                let ProjectTypelst = constructOptionList(response[2].data || [], "nprojecttypecode", "sprojecttypename", false, false, true).get("OptionList");

                let instrumentListFilter = [];

                if (this.props.Login.settings && parseInt(this.props.Login.settings[84]) === transactionStatus.YES) {

                    const filterInstrumentlist = constructOptionList(response[0].data['lstInstrument'] || [], "ninstrumentcode",
                        "sinstrumentid", undefined, undefined, undefined);

                    instrumentListFilter = filterInstrumentlist.get("OptionList");

                }

                this.setState({
                    instrumentListFilter: instrumentListFilter,
                    sampleTypeList: sampleTypeList,
                    ProjectTypeOptions: ProjectTypelst,
                    sourcencontainertypecode: param.ncontainertypecode,
                    sourcencontainerstructurecode: param.ncontainerstructurecode,
                    isMultiContainermove: false,
                    selectedRecord: {
                        // nprojecttypecode:{
                        //     label: this.state.selectedProjectType.label,
                        //     value:  this.state.selectedProjectType.value 
                        // },
                        nfromsamplestoragelocationcode: {
                            label: param.ssamplestoragelocationname,
                            value: param.nsamplestoragelocationcode,
                            item: param
                        },
                        nfromsamplestoragemappingcode: {
                            label: param.scontainerpath,
                            value: param.nsamplestoragemappingcode,
                            item: param
                        },
                        nsamplestoragelocationcode: storageStructureList.length > 0 ? {
                            label: storageStructureList[0].label,
                            value: storageStructureList[0].value,
                            item: storageStructureList[0].item
                        } : "",
                        nsamplestoragemappingcode: sampleStorageMappingList.length > 0 ? {
                            label: sampleStorageMappingList[0].label,
                            value: sampleStorageMappingList[0].value,
                            item: sampleStorageMappingList[0].item
                        } : ""
                        ,
                        storageStructureOptions: storageStructureList,
                        samplestoragecontainerpathOptions: sampleStorageMappingList,

                        ninstrumentcode: {
                            label: param.sinstrumentid,
                            value: param.ninstrumentcode,
                            item: param
                        },
                    },
                    editedsheetData: param,
                    ismoveSample: true,
                    openModal: true,
                    loadEsign: false,
                    loading: false,
                    ncontrolcode: this.state.controlMap.has("Move Container") && this.state.controlMap.get("Move Container").ncontrolcode
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
    // headerSelectionChange = (event) => {
    //     const checkboxElement = event.target;
    //     const checked = event.syntheticEvent.target.checked;
    //     let sampleStoragetransaction=this.state.masterData.sampleStoragetransaction;
    //     let masterData=this.state.masterData
    //     sampleStoragetransaction.map(item => { 
    //             if (item.selected === undefined) {
    //                 item.selected = false;
    //             }
    //             item.selected = checked;
    //             return item; 
    //     });
    //     masterData[sampleStoragetransaction]=sampleStoragetransaction
    //     this.setState({ masterData })
    // }
    headerSelectionChange = (event) => {
        const checkboxElement = event.target;
        const checked = event.syntheticEvent.target.checked;
        let dataResult = this.state.dataResult;
        dataResult.data.map(item => {
            return item.items.map(item => {
                if (item.selected === undefined) {
                    item.selected = false;
                }
                item.selected = checked;
                return item;
            });
        });
        this.setState({ dataResult })
    }
    selectionChange = (event) => {
        let dataResult = this.state.dataResult;
        dataResult.data.map(x => {
            return x.items.map(item => {
                if (item['nsamplestoragemappingcode'] === event.dataItem['nsamplestoragemappingcode']) {
                    item.selected = !event.dataItem.selected;
                }
                return item;
            });
        });
        this.setState({ dataResult })
    }
    // selectionChange = (event) => {
    //     let sampleStoragetransaction=this.state.masterData.sampleStoragetransaction;
    //     let masterData=this.state.masterData
    //     sampleStoragetransaction.map(item => {
    //             if (item['nsamplestoragemappingcode'] === event.dataItem['nsamplestoragemappingcode']) {
    //                 item.selected = !event.dataItem.selected;
    //             }
    //             return item; 
    //     });
    //     masterData[sampleStoragetransaction]=sampleStoragetransaction
    //     this.setState({ masterData })
    // }
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
        const moveSampleId = this.state.controlMap.has("Move Container") && this.state.controlMap.get("Move Container").ncontrolcode;
        const moveMultipleSampleId = this.state.controlMap.has("Move Multiple Container") && this.state.controlMap.get("Move Multiple Container").ncontrolcode;

        const addMultipleSampleId = this.state.controlMap.has("AddMultipleSample") && this.state.controlMap.get("AddMultipleSample").ncontrolcode;
        const addSampleId = this.state.controlMap.has("AddSample") && this.state.controlMap.get("AddSample").ncontrolcode;

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
                                        formLabel={this.props.Login.settings && parseInt(this.props.Login.settings[84]) === transactionStatus.YES ? this.props.intl.formatMessage({ id: "IDS_BIOPROJECT" })
                                            : this.props.intl.formatMessage({ id: "IDS_PROJECTTYPE" })}
                                        isMandatory={true}
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
                                            isMandatory={true}
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
                                    <DataGridForStorage
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
                                                [{
                                                    label: 'IDS_VIEWMULTIPLEBOX',
                                                    id: {},
                                                    hidden: false//this.state.userRoleControlRights.indexOf(addMultipleSampleId) === -1
                                                    ,
                                                    onClick: () => this.addSample({}, 2),
                                                    controlname: 'faBoxes'
                                                },
                                                {
                                                    label: 'IDS_MOVEMULTIPLECONTAINER',
                                                    id: {},
                                                    hidden: this.state.userRoleControlRights.indexOf(moveMultipleSampleId) === -1,
                                                    onClick: () => this.movemultipleContainer(),
                                                    controlname: 'faDollyFlatbed'
                                                },
                                                this.props.Login?.settings && parseInt(this.props.Login.settings[84]) === transactionStatus.YES ?
                                                    {} : {
                                                        label: 'IDS_SEARCH',
                                                        id: {},
                                                        onClick: () => this.opensearch(),
                                                        controlname: 'faSearch'
                                                    }

                                                ] : [
                                                    this.props.Login?.settings && parseInt(this.props.Login.settings[84]) === transactionStatus.YES ?
                                                        {} : {
                                                            label: 'IDS_SEARCH',
                                                            id: {},
                                                            onClick: () => this.opensearch(),
                                                            controlname: 'faSearch'
                                                        }
                                                ]}
                                        cellRender={this.cellRender}
                                        group={this.state.group || []}
                                        primaryKeyField={'nsamplestoragemappingcode'}
                                        // groupable={true}
                                        // groupfooter={true}
                                        // aggregateLabel={'IDS_AVAILABLESPACE'}
                                        // aggregatedColumn={'navailablespace'}
                                        selectionChange={this.selectionChange}
                                        headerSelectionChange={this.headerSelectionChange}
                                        data={this.state.masterData &&
                                            this.state.masterData.sampleStoragetransaction}
                                        dataResult={
                                            // this.state.masterData && this.state.masterData.sampleStoragetransaction ? this.processWithGroups(this.state.masterData.sampleStoragetransaction || [],
                                            //     this.state.dataStateChange ? this.state.dataStateChange : {
                                            //         take: 10,
                                            //         skip: 0
                                            //     }) : []
                                            this.state.dataResult ? this.state.dataResult : []
                                        }
                                        dataState={this.state.dataStateChange ? this.state.dataStateChange : { skip: 0, take: 10 }}
                                        dataStateChange={this.dataStateChange}
                                        extractedColumnList={this.state.extractedColumnList}
                                        controlMap={this.state.controlMap}
                                        userRoleControlRights={this.state.userRoleControlRights}
                                        userInfo={this.props.Login.userInfo}
                                        deleteRecord={this.deleteRecord}
                                        pageable={true}
                                        scrollable={'scrollable'}
                                        gridHeight={'700px'}
                                        isActionRequired={true}
                                        isToolBarRequired={true}
                                        needMultiSelect={false}
                                        actionIcons={
                                            [
                                                {
                                                    title: this.props.intl.formatMessage({ id: "IDS_MOVECONTAINER" }),
                                                    controlname: "faDolly",
                                                    hidden: this.state.userRoleControlRights.indexOf(moveSampleId) === -1,
                                                    objectName: "edit",
                                                    onClick: this.moveSample
                                                },
                                                {
                                                    title: this.props.intl.formatMessage({ id: "IDS_VIEWBOX" }),
                                                    controlname: "faBox",
                                                    hidden: false// this.state.userRoleControlRights.indexOf(addSampleId) === -1
                                                    ,
                                                    objectName: "add",
                                                    onClick: (param) => this.addSample(param, 1)
                                                }]}
                                    />
                                    {/* <DataGrid
                                        isDownloadPDFRequired={this.state.masterData && this.state.masterData.sampleStoragetransaction &&
                                            this.processWithGroups(this.state.masterData.sampleStoragetransaction || [],
                                                this.state.dataStateChange ? this.state.dataStateChange : {
                                                    take: 10,
                                                    skip: 0
                                                }).data.length > 0 ?
                                            true : false}
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
                                                [{
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
                                        primaryKeyField={'nsamplestoragemappingcode'}
                                        groupable={true}
                                        groupfooter={true}
                                        aggregateLabel={'IDS_AVAILABLESPACE'}
                                        aggregatedColumn={'navailablespace'}
                                        data={this.state.masterData &&
                                            this.state.masterData.sampleStoragetransaction}
                                        dataResult={ 
                                               this.state.masterData && this.state.masterData.sampleStoragetransaction ? this.processWithGroups(this.state.masterData.sampleStoragetransaction || [],
                                                this.state.dataStateChange ? this.state.dataStateChange : {
                                                    take: 10,
                                                    skip: 0
                                                }) : []
                                        }
                                        dataState={this.state.dataStateChange ? this.state.dataStateChange : { skip: 0, take: 10 }}
                                        dataStateChange={this.dataStateChange}
                                        extractedColumnList={this.state.extractedColumnList}
                                        controlMap={this.state.controlMap}
                                        userRoleControlRights={this.state.userRoleControlRights}
                                        userInfo={this.props.Login.userInfo}
                                        deleteRecord={this.deleteRecord} 
                                        pageable={true}
                                        scrollable={'scrollable'} 
                                        gridHeight={'600px'}
                                        isActionRequired={true}
                                        isToolBarRequired={true}
                                        actionIcons={
                                            [
                                                 {
                                                    title: this.props.intl.formatMessage({ id: "IDS_MOVECONTAINER" }),
                                                    controlname: "faPencilAlt",
                                                    hidden: false, //this.state.userRoleControlRights.indexOf(moveSampleId) === -1,
                                                    objectName: "edit",
                                                    onClick: this.moveSample
                                                },
                                                {
                                                title: this.props.intl.formatMessage({ id: "IDS_ADDSAMPLETOABOX" }),
                                                controlname: "faBox",
                                                hidden: this.state.userRoleControlRights.indexOf(addSampleId) === -1,
                                                objectName: "add",
                                                onClick: (param) => this.addSample(param, 1)
                                            }]}
                                    /> */}
                                </Col></Row>
                        </Col>

                    }

                </ListWrapper>

                {
                    this.state.openModal &&
                    <SlideOutModal show={this.state.openModal}
                        closeModal={this.closeModal}
                        hideSave={this.state.ismoveSample ? false : true}
                        //needClose={this.state.ismoveSample ? true : this.state.isFilterPopup ? false : true}
                        needClose={this.state.ismoveSample ? false : this.state.isFilterPopup ? true : false}
                        showSubmit={this.state.ismoveSample ? false : this.state.openSpreadSheet ? false : true}
                        size={this.state.ismoveSample ? "" : (this.state.openSpreadSheet || this.state.isFilterPopup) ? 'xl' : ""}
                        operation={""}
                        inputParam={this.props.Login.inputParam}
                        screenName={this.state.ismoveSample ? this.props.intl.formatMessage({ id: "IDS_MOVECONTAINER" }) : this.state.isFilterPopup ? "" :
                            this.state.isMultiSampleAdd ? this.props.intl.formatMessage({ id: "IDS_SAMPLESTORAGE" })
                                : this.state.editedsheetData.scontainerpath}
                        onSaveClick={this.state.isFilterPopup ? this.getDynamicFilterExecuteData.bind(this) : this.onSampleMappingSaveClick}
                        esign={this.state.loadEsign}
                        // className={"wide-popup"}

                        validateEsign={this.validateEsign}
                        masterStatus={this.props.Login.masterStatus}
                        updateStore={this.props.updateStore}
                        selectedRecord={this.state.selectedRecord || {}}
                        // ALPD-5120 : Added by rukshana this.state.serverTime for sample storage move : E-signature's date and time not displayed in popup 
                        addComponent={this.state.loadEsign ?
                            <Esign operation={this.props.Login.operation}
                                formatMessage={this.props.intl.formatMessage}
                                onInputOnChange={this.onInputOnChange}
                                inputParam={this.props.Login.inputParam}
                                selectedRecord={this.state.selectedRecord || {}}
                                esignReasonList={this.state.esign || []}
                                serverTime={this.state.serverTime || []}
                            />
                            :
                            this.state.ismoveSample ?
                                <MoveSample
                                    ProjectTypeOptions={this.state.ProjectTypeOptions}
                                    sampleTypeList={this.state.sampleTypeList}
                                    availableContainers={this.state.availableContainers}
                                    totalContainers={this.state.totalContainers}
                                    storagemoverecords={this.state.storagemoverecords}
                                    isMultiContainermove={this.state.isMultiContainermove}
                                    sourcencontainertypecode={this.state.sourcencontainertypecode}
                                    sourcencontainerstructurecode={this.state.sourcencontainerstructurecode}
                                    operation={this.state.operation}
                                    selectedRecordFilter={this.state.selectedRecordFilter}
                                    onInputChange={(e) => this.onInputChange(e)}
                                    onComboChange={this.onComboChange}
                                    selectedRecord={this.state.selectedRecord || {}}
                                    childDataChange={this.childDataChange}
                                    userInfo={this.props.Login.userInfo}
                                    dataState={this.state.dataStateChange ? this.state.dataStateChange : { skip: 0, take: 10 }}
                                    controlMap={this.state.controlMap}
                                    userRoleControlRights={this.state.userRoleControlRights}
                                    settings={this.props.Login.settings}
                                    instrumentTypeOptions={this.state?.instrumentListFilter || []}
                                //selectedInstrument={this.state?.instrumentListFilter || []}
                                />
                                :
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
                                    :
                                    this.state.openSpreadSheet ? <>
                                        <>
                                            <MatrixComponent
                                                isMoveScreen={true}
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
                                        :
                                        <></>
                            // <AddSampleStorageMapping
                            //     operation={this.state.operation}
                            //     selectedRecordFilter={this.state.selectedRecordFilter}
                            //     onInputChange={(e) => this.onInputChange(e)}
                            //     onComboChange={this.onComboChange}
                            //     selectedRecord={this.state.selectedRecord || {}}
                            //     childDataChange={this.childDataChange}
                            //     userInfo={this.props.Login.userInfo}
                            // />
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
            screenData: this.state.screenData
        }
        //this.props.validateEsignCredential(inputParam, "openModal");
        // let destinationPathlst = [];
        // let dataResult = this.state.dataResult;
        // dataResult.data.map(item => {
        //       item.items.map(item => {
        //         if (item.hasOwnProperty('selected') && item.selected) {
        //             destinationPathlst.push(item);
        //         } 
        //     });
        // });

        //this.props.validateEsignCredentialStorage(inputParam, "openModal",() => this.ConfirmMove())
        this.validateEsignCredentialStorage(inputParam, "openModal", () => this.ConfirmMove())
    }

    //ALPD-4738
    //Fixed: Removed the store action in sample retrieval, and the screen is now fully managed through the state.
    validateEsignCredentialStorage = (inputParam, modalName, action) => {
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
                    return (this.crudMasterstorage(inputParam["screenData"]["inputParam"], inputParam["screenData"]["masterData"], modalName, undefined, action))
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
                    if (error.response.data === 'IDS_SOURCEANDDESTINATIONMISMATCH') {
                        action()
                    } else {
                        toast.warn(error.response.data);
                    }
                }
                this.setState({
                    loading: false
                });
            })
    }

    //ALPD-4738
    //Fixed: Removed the store action in sample retrieval, and the screen is now fully managed through the state.
    crudMasterstorage = (inputParam, masterData, modalName, defaultInput, action) => {
        this.setState({ loading: true })
        let requestUrl = '';
        let urlArray = [];
        requestUrl = rsapi().post(inputParam.classUrl + "/" + inputParam.operation + inputParam.methodUrl, { ...inputParam.inputData });
        urlArray = [requestUrl];
        Axios.all(urlArray)
            .then(response => {
                this.setState({
                    isInitialRender: true,
                    selectedRecord: {},
                    masterData: {
                        ...masterData, ...response[0].data
                    },
                    openModal: false,
                    loading: false,
                    ismoveSample: false,
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
                    if (error.response.data === 'IDS_SOURCEANDDESTINATIONMISMATCH') {
                        this.ConfirmMove()
                    } else {
                        toast.warn(error.response.data);
                    }
                }
                this.setState({
                    loading: false
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
    callService, updateStore, validateEsignCredential, validateEsignCredentialStorage, crudMasterstorage,
})(injectIntl(SampleStorageMove));