import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Row, Col, Card, Nav, FormGroup, FormLabel, Form, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faCopy, faPencilAlt, faSync, faPlus, faThumbsUp, faFileInvoice, faEye, faLink, faChevronRight, faComments, faLaptopHouse, faBoxOpen, faBoxTissue, faBox, faLocationArrow, faFolderMinus, faFolderOpen, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import ListMaster from '../../components/list-master/list-master.component';
import { constructOptionList, getControlMap, showEsign } from '../../components/CommonScript';
import { ReadOnlyText, ContentPanel } from '../../components/App.styles';
import SlideOutModal from '../../components/slide-out-modal/SlideOutModal';
import {
    callService, crudMaster, validateEsignCredential, updateStore, getSelectedSampleStorageLocation, getSampleMaster,
    editSampleStorageLocation, approveSampleStorageLocation, getSelectedSampleStorageVersion, getContainerStorageCondition,
    getStorageConditionFromMaster, getSampleMasterDetails, getContainers, getselectedContainer, changeStorageCategoryFilterOnSampleMaster,
    openSampleStorageApprovedLocation, loadApprovedLocationOnCombo, filterColumnData,
    loadApprovedLocationOnTreeData, moveItems, saveSampleStorageMaster, getSelectedApprovedStorageVersion, validateEsignCredentialSampleStorageMaster,
    addSample
} from '../../actions';
import { DEFAULT_RETURN } from '../../actions/LoginTypes';
import { ListWrapper } from '../../components/client-group.styles';
import TreeViewEditable from "../../components/form-tree-editable/form-tree-editable.component";
import { mapTree, removeItems } from "@progress/kendo-react-treelist";
import ConfirmMessage from '../../components/confirm-alert/confirm-message.component';
import CustomSwitch from '../../components/custom-switch/custom-switch.component';
import AddSample from '../basemaster/AddSample';
import AddContainerStorageCondition from './AddContainerStorageCondition';
import { ProductList } from '../product/product.styled';
import TransactionListMasterJson from '../../components/TransactionListMasterJson';
import BreadcrumbComponent from '../../components/Breadcrumb.Component';
import StorageCategoryFilter from './StorageCategoryFilter';
import MoveSampleOrContainers from './MoveSampleOrContainers';
import { faFolder } from '@fortawesome/free-regular-svg-icons';
import Esign from '../audittrail/Esign';

class SampleStorageMaster extends Component {

    constructor(props) {
        super(props);

        this.state = {
            selectedRecord: {},
            userRoleControlRights: [],
            controlMap: new Map(),
            skip: 0,
            detailSkip: 0,
            detailTake: 10,
            take: this.props.Login.settings ?
                this.props.Login.settings[3] : 25,
            splitChangeWidthPercentage: 22,
            enablePropertyPopup: false,
            enableAutoClick: false,
            treeDataView: undefined,
            toggleActionView: false,
            toggleAction: false,
            propertyPopupWidth: "60",
            splitChangeWidthPercentage: 28.6,
            containers: [],
            treeData: [],
            selectedItem: undefined,
            selectedItemMove: undefined
        };
        this.searchRef = React.createRef();
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
    openModal = (addId) => {
        if (this.props.Login.selectedItem && this.props.Login.selectedItem.containerlastnode === true) {           
            this.props.addSample(addId, this.props.Login.masterData,this.props.Login.userInfo);
        }
    }
    closeModal = () => {
        let loadEsign = this.props.Login.loadEsign;
        let openModal = this.props.Login.openModal;
        let selectedId = this.props.Login.selectedId;
        let selectedRecord = this.state.selectedRecord; //this.props.Login.selectedRecord;
        if (this.props.Login.loadEsign) {
            if (this.props.Login.operation === "delete" || this.props.Login.operation === "discard") {
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

        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { openModal, loadEsign, selectedRecord, selectedId }
        }
        this.props.updateStore(updateInfo);
    }

    closeChildModal = () => {

        let loadEsign = this.props.Login.loadEsign;
        let openChildModal = this.props.Login.openChildModal;
        let selectedId = this.props.Login.selectedId;
        let selectedRecord = this.state.selectedRecord; //this.props.Login.selectedRecord;
        if (this.props.Login.loadEsign) {
            loadEsign = false;
        }
        else {
            openChildModal = false;
            selectedId = null;
            selectedRecord = {};
        }

        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { openChildModal, loadEsign, selectedRecord, selectedId }
        }
        this.props.updateStore(updateInfo);

        // const updateInfo = {
        //     typeName: DEFAULT_RETURN,
        //     data: {
        //         openChildModal: false, selectedRecord: {}
        //     }
        // }
        // this.props.updateStore(updateInfo);
    }
    onInputChange = (event) => {
        const selectedRecord = this.state.selectedRecord || {};
        selectedRecord[event.target.name] = event.target.value;
        this.setState({ selectedRecord });
    };
    onKeyUp = (event) => {
        if (event.keyCode === 13) {
            this.onSaveClickSample(2);
        }
    };
    onSaveClick = (saveType, formRef) => {
        if (this.state.activeTabIndex === 1) {
            this.onSaveClickSample(saveType, formRef);
        } else {
            this.onSaveClickContainer(saveType, formRef);
        }
    }
    onSaveClickSample = (saveType, formRef) => {
        let inputData = [];



        inputData["userinfo"] = this.props.Login.userInfo;

        if (this.props.Login.operation === "update") {
            inputData["sampleStorageMaster"] = {
                "nsamplecode": this.state.selectedRecord.nsamplecode ? this.state.selectedRecord.nsamplecode : -1,
                "ssampletraycode": this.props.Login.sampleTrayCode ? this.props.Login.sampleTrayCode : "",
                "ssamplearno": this.state.selectedRecord.ssamplearno ? this.state.selectedRecord.ssamplearno : "",
                "nsamplestoragelocationcode": this.props.Login.masterData.selectedSampleStorageVersion.nsamplestoragelocationcode,
                "nstoragecategorycode": this.props.Login.masterData.selectedSampleStorageVersion.nstoragecategorycode,
                "nsampleqty": this.state.selectedRecord.nsampleqty && this.state.selectedRecord.nsampleqty ? this.state.selectedRecord.nsampleqty : 0,
                "nunitcode": this.state.selectedRecord.nunitcode && this.state.selectedRecord.nunitcode ? this.state.selectedRecord.nunitcode.value : -1
            }
        }
        else {
            //add               
            inputData["sampleStorageMaster"] = {
                "ssampletraycode": this.props.Login.sampleTrayCode ? this.props.Login.sampleTrayCode : "",
                "ssamplearno": this.state.selectedRecord.ssamplearno ? this.state.selectedRecord.ssamplearno : "",
                "nsamplestoragelocationcode": this.props.Login.masterData.selectedSampleStorageVersion.nsamplestoragelocationcode,
                "slocationhierarchy": this.props.Login.sampleLocation ? this.props.Login.sampleLocation : "",
                "nstoragecategorycode": this.props.Login.masterData.selectedSampleStorageVersion.nstoragecategorycode,
                "nsampleqty": this.state.selectedRecord.nsampleqty && this.state.selectedRecord.nsampleqty ? this.state.selectedRecord.nsampleqty : 0,
                "nunitcode": this.state.selectedRecord.nunitcode && this.state.selectedRecord.nunitcode ? this.state.selectedRecord.nunitcode.value : -1
            }
        }

        const inputParam = {
            methodUrl: this.props.Login.inputParam.methodUrl,
            classUrl: this.props.Login.inputParam.classUrl,
            displayName: this.props.Login.inputParam.displayName ? this.props.Login.inputParam.displayName : '',
            inputData: inputData,
            operation: this.props.Login.operation,
            saveType, formRef
        }
        const masterData = this.props.Login.masterData;
        const selectedRecord = this.state.selectedRecord || {};

        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolcode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData, selectedRecord }, saveType, openModal: true
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            // this.props.crudMaster(inputParam, masterData, "openModal");
            this.props.saveSampleStorageMaster(this.props.Login.userInfo, this.props.Login.masterData, this.state.selectedRecord, inputParam);
        }

    }

    onSaveClickContainer = (saveType, formRef) => {
        let inputData = [];

        inputData["userinfo"] = this.props.Login.userInfo;

        inputData["containerStorageCondition"] = { "nstatus": 1 };
        if (this.props.Login.operation === "update") {
            inputData["containerStorageCondition"]["ncontainerstoragecode"] = this.props.Login.masterData.storageContainer && this.props.Login.masterData.storageContainer !== null ?
                this.props.Login.masterData.storageContainer.ncontainerstoragecode : -1
            inputData["containerStorageCondition"]["scontainercode"] = this.props.Login.containerCode && this.props.Login.containerCode !== undefined ? this.props.Login.containerCode : ""
            inputData["containerStorageCondition"]["nstorageconditioncode"] = this.state.selectedRecord.nstorageconditioncode && this.state.selectedRecord.nstorageconditioncode !== undefined ? this.state.selectedRecord.nstorageconditioncode.value : -1


        }
        inputData["containerStorageCondition"]["scontainercode"] = this.props.Login.containerCode && this.props.Login.containerCode !== undefined ? this.props.Login.containerCode : ""
        inputData["containerStorageCondition"]["nstorageconditioncode"] = this.state.selectedRecord.nstorageconditioncode && this.state.selectedRecord.nstorageconditioncode !== undefined ? this.state.selectedRecord.nstorageconditioncode.value : -1
        inputData["containerStorageCondition"]["slocationhierarchy"] = this.props.Login.containerLocation ? this.props.Login.containerLocation : "";
        inputData["containerStorageCondition"]["nsamplestoragelocationcode"] = this.props.Login.masterData.selectedSampleStorageVersion.nsamplestoragelocationcode;

        const inputParam = {
            methodUrl: "ContainerStorageCondition",
            classUrl: "samplestoragemaster",
            displayName: this.props.Login.inputParam.displayName ? this.props.Login.inputParam.displayName : '',
            inputData: inputData,
            operation: this.props.Login.operation,
            saveType, formRef
        }
        const masterData = this.props.Login.masterData;

        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolcode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData }, saveType, openModal: true
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.crudMaster(inputParam, masterData, "openModal");
        }

    }


    itemRenderView = (clickedItem) => {
        let item = clickedItem.item;
        if (!this.state.toggleActionView) {
            return (
                <>
                    {item ? (
                        <>
                            <span className={`normal-node
                            ${item.selected ? "active-node" : ""}
                            ${item.expanded ? "expand-node" : "collapse-node"}
                            `}>
                                {item.containerfirstnode ? <FontAwesomeIcon icon={faBoxOpen} /> :
                                    item.locationlastnode ? <FontAwesomeIcon icon={faLocationArrow} /> :
                                        item.containerlastnode ? <FontAwesomeIcon icon={faBox} /> :
                                            item.expanded ? <FontAwesomeIcon icon={faFolderOpen} /> : <FontAwesomeIcon icon={faFolder} />}
                                {item.text}
                            </span>
                            {/* <ul className="list-inline mb-0"> */}
                            {/* {console.log(clickedItem,'===>')} */}
                            {/* {clickedItem.item.editable ? (
                                <>
                                    <li className="list-inline-item"> */}
                            {/* <span
                                            className="action-icon tree-toggle"
                                            onClick={(e) => this.setProperties(e, clickedItem)}
                                        ></span> */}
                            {/* </li> */}
                            {/* </> */}
                            {/* ) : null} */}
                            {/* </ul> */}
                        </>
                    ) : (
                        ""
                    )}
                </>
            );
        }
    };

    onItemClickView = (event) => {
        if (this.state.selectedItem) {
            this.state.selectedItem.selected = false;
        }

        event.item.selected = true;
        this.setState({
            selectedItem: event.item
        })
        // let newData = mapTree(this.state.treeDataView, "items", (item) => {
        //     if (item.editable === true) {
        //         item.editable = false;
        //     } else if (item.id === event.item.id) {
        //         item.editable = true;
        //     }
        //     return item;
        // });

        // this.setState({ treeDataView: newData });

        if (event.item && event.item.containerlastnode && event.item.containerlastnode === true) {

            let result = this.state.treeDataView;
            const indices = event.itemHierarchicalIndex.split('_').map(index => Number(index));
            let itemText = "";

            for (let i = 0; i < indices.length; i++) {
                if (i === 0) {
                    result = result[indices[i]];
                } else {
                    result = result.items[indices[i]];
                }
                itemText = i > 0 ? itemText + " > " + result.text : result.text;
            }

            this.props.getSampleMaster(event.item, this.props.Login.userInfo, this.props.Login.masterData, itemText, event.itemHierarchicalIndex);

            if (this.state.activeTabIndex && this.state.activeTabIndex === false) {
                this.changePropertyView(1, undefined, false);
            } else if (this.state.activeTabIndex === undefined) {
                this.changePropertyView(1, undefined, false);
            } else if (this.state.activeTabIndex !== 1) {
                this.changePropertyView(1, undefined, false);
            }


        } else if (event.item && event.item.containerfirstnode && event.item.containerfirstnode === true) {

            let result = this.state.treeDataView;

            const indices = event.itemHierarchicalIndex.split('_').map(index => Number(index));
            let itemText = "";
            for (let i = 0; i < indices.length; i++) {
                if (i === 0) {
                    result = result[indices[i]];
                } else {
                    result = result.items[indices[i]];
                }
                itemText = i > 0 ? itemText + " > " + result.text : result.text;
            }

            this.props.getContainerStorageCondition(event.item, this.props.Login.userInfo, this.props.Login.masterData, itemText);

            if (this.state.activeTabIndex && this.state.activeTabIndex === false) {
                this.changePropertyView(2, undefined, false);
            } else if (this.state.activeTabIndex === undefined) {
                this.changePropertyView(2, undefined, false);
            } else if (this.state.activeTabIndex !== 2) {
                this.changePropertyView(2, undefined, false);
            }

        } else if (event.item && event.item.locationlastnode && event.item.locationlastnode === true) {

            let containers = [];
            if (event.item.items && event.item.items.length > 0) {
                event.item.items.forEach(element => {
                    if (element.containerfirstnode === true) {
                        containers.push(element);
                    }
                });
            }

            let result = this.state.treeDataView;
            const indices = event.itemHierarchicalIndex.split('_').map(index => Number(index));
            let itemText = "";
            for (let i = 0; i < indices.length; i++) {
                if (i === 0) {
                    result = result[indices[i]];
                } else {
                    result = result.items[indices[i]];
                }
                itemText = i > 0 ? itemText + " > " + result.text : result.text;
            }

            this.props.getContainers(event.item, this.props.Login.masterData, containers, itemText);
            if (this.state.activeTabIndex && this.state.activeTabIndex === false) {
                this.changePropertyView(3, undefined, false);
            } else if (this.state.activeTabIndex === undefined) {
                this.changePropertyView(3, undefined, false);
            } else if (this.state.activeTabIndex !== 3) {
                this.changePropertyView(3, undefined, false);
            }
        } else {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    selectedItem: event.item,
                    activeTabIndex: undefined
                }
            }
            this.props.updateStore(updateInfo);
        }



    };
    onComboChange = (comboData, fieldName, caseNo) => {
        const selectedRecord = this.state.selectedRecord || {};
        if (caseNo === 3) {

            let nfilterStorageCategory = this.state.nfilterStorageCategory || {}
            nfilterStorageCategory = comboData;
            this.searchRef.current.value = "";
            this.setState({ nfilterStorageCategory })

        } else if (caseNo === 4) {

            selectedRecord[fieldName] = comboData;
            this.props.loadApprovedLocationOnCombo(this.props.Login.userInfo, this.props.Login.masterData, selectedRecord);

        } else if (caseNo === 5) {

            selectedRecord[fieldName] = comboData;
            this.props.loadApprovedLocationOnTreeData(this.props.Login.userInfo, this.props.Login.masterData, selectedRecord);
        } else {

            selectedRecord[fieldName] = comboData;
            this.setState({ selectedRecord });
        }
    }
    onExpandChangeView = (event) => {
        event.item.expanded = !event.item.expanded;
        this.forceUpdate();
    };

    componentDidUpdate(previousProps) {

        let isComponentUpdated = false;
        let { filterData } = this.state;

        if (this.props.Login.masterData !== previousProps.Login.masterData) {

            if (this.props.Login.userInfo.nformcode !== previousProps.Login.userInfo.nformcode) {
                const userRoleControlRights = [];
                if (this.props.Login.userRoleControlRights) {
                    this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode] && Object.values(this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode]).map(item =>
                        userRoleControlRights.push(item.ncontrolcode))
                }
                const controlMap = getControlMap(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode)
                this.setState({ controlMap, userRoleControlRights });
            }
        }
        if (this.props.Login.masterData.approvedTreeData !== previousProps.Login.masterData.approvedTreeData) {
            if (this.props.Login.masterData.approvedTreeData && this.props.Login.masterData.approvedTreeData !== undefined) {
                this.setState({
                    treeData:
                        this.props.Login.masterData.approvedTreeData
                });
            } //JSON.parse(this.props.Login.masterData.approvedTreeData["jsondata"].value).data
        }

        if (this.props.Login.masterData.selectedSampleStorageVersion !== previousProps.Login.masterData.selectedSampleStorageVersion) {
            if (this.props.Login.masterData.selectedSampleStorageVersion && this.props.Login.masterData.selectedSampleStorageVersion !== undefined) {
                this.setState({
                    treeDataView:
                        JSON.parse(this.props.Login.masterData.selectedSampleStorageVersion["jsondata"].value).data
                });
            } else {
                this.setState({
                    treeDataView: undefined
                });
            }
        }

        let nfilterStorageCategory = this.state.nStorageCategory || {};
        let filterStorageCategory = this.state.filterStorageCategory || {};

        if (this.props.Login.masterData.filterStorageCategory !== previousProps.Login.masterData.filterStorageCategory) {
            if (this.props.Login.masterData.filterStorageCategory && this.props.Login.masterData.filterStorageCategory !== undefined) {
                const filterStorageCategoryMap = constructOptionList(this.props.Login.masterData.filterStorageCategory || [], "nstoragecategorycode",
                    "sstoragecategoryname", 'nstoragecategorycode', 'ascending', false);
                filterStorageCategory = filterStorageCategoryMap.get("OptionList");
                if (filterStorageCategory && filterStorageCategory.length > 0) {
                    const filterCategory = filterStorageCategory.filter(item => item.value === this.props.Login.masterData.nfilterStorageCategory);//filterStorageCategory[0];
                    nfilterStorageCategory = filterCategory[0];
                }
                isComponentUpdated = true;
            }
        } else if (this.props.Login.masterData.nfilterStorageCategory !== previousProps.Login.masterData.nfilterStorageCategory) {
            if (this.props.Login.masterData.nfilterStorageCategory && this.props.Login.masterData.nfilterStorageCategory !== undefined) {
                nfilterStorageCategory = this.props.Login.masterData.nfilterStorageCategory;
                isComponentUpdated = true;
            }
        }
        if (isComponentUpdated) {
            this.setState({ nfilterStorageCategory, filterStorageCategory });
        }

        if (this.props.Login.activeTabIndex !== previousProps.Login.activeTabIndex) {
            this.setState({ activeTabIndex: this.props.Login.activeTabIndex });
        }
        if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord) {
            this.setState({
                selectedRecord: this.props.Login.selectedRecord
            });
        }
        if (this.props.Login.masterData !== previousProps.Login.masterData) {
            const filterData = this.generateBreadCrumData();
            this.setState({ filterData });
        }

    }
    handlePageChange = e => {
        this.setState({
            skip: e.skip,
            take: e.take
        });
        setTimeout(() => { this._scrollBarRef.updateScroll() })
    };

    moveItem = (userInfo, masterData, moveId) => {

        // let sampleTrayID = [];
        // mapTree([this.props.Login.selectedItem], "items", (item) => {
        //     if (item.containerlastnode === true) {
        //         sampleTrayID.push(item.id);
        //     }
        //     return null;
        // });

        if (this.state.activeTabIndex && this.state.activeTabIndex === 1) {
            if (this.props.Login.masterData.sampleStorageMaster && this.props.Login.masterData.selectedSampleStorageMaster && this.props.Login.masterData.selectedSampleStorageMaster[0] !== undefined) {
                this.props.openSampleStorageApprovedLocation(userInfo, masterData, moveId);
            } else {
                toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTANYSAMPLE" }));
            }
        } else if (this.state.activeTabIndex && this.state.activeTabIndex === 3) {
            if (this.props.Login.masterData.containers && this.props.Login.masterData.selectedContainer && this.props.Login.masterData.selectedContainer[0] !== undefined) {
                this.props.openSampleStorageApprovedLocation(userInfo, masterData, moveId);
            } else {
                toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTANYCONTAINER" }));
            }
        }

    }
    confirmDelete = (ncontrolCode) => {
        if (this.props.Login.masterData.sampleStorageMaster && this.props.Login.masterData.selectedSampleStorageMaster && this.props.Login.masterData.selectedSampleStorageMaster[0] !== undefined) {
            this.confirmMessage.confirm("deleteMessage",
                this.props.intl.formatMessage({ id: "IDS_DELETE" }),
                this.props.intl.formatMessage({ id: "IDS_DEFAULTCONFIRMMSG" }),
                this.props.intl.formatMessage({ id: "IDS_OK" }),
                this.props.intl.formatMessage({ id: "IDS_CANCEL" }),
                () => this.deleteSampleStorageMaster(ncontrolCode));
        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTANYSAMPLE" }));
        }
    };
    deleteSampleStorageMaster = (ncontrolCode) => {
        let inputData = [];

        let data = [];

        this.props.Login.masterData.selectedSampleStorageMaster.forEach(item => {
            data.push({ "nsamplecode": item.nsamplecode, "ssampletraycode": item.ssampletraycode });
        })

        inputData["sampleStorageMaster"] = data;
        inputData["userinfo"] = this.props.Login.userInfo;

        const inputParam = {
            methodUrl: "SampleStorageMaster",
            classUrl: "samplestoragemaster",
            inputData: inputData,
            operation: "delete", searchRef: this.searchRef
        }
        const masterData = this.props.Login.masterData;

        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, ncontrolCode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData }, operation: "delete", openModal: true,
                    screenName: this.props.Login.inputParam.displayName
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.crudMaster(inputParam, this.props.Login.masterData, "openModal");
        }

    }
    loadStorageCondition = (editContainerID) => {
        let openStorage = false;
        if (this.props.Login.masterData.storageContainer === null || this.props.Login.masterData.storageContainer === undefined) {
            mapTree(this.state.treeDataView, "items", (item) => {
                if (item.id === this.props.Login.selectedItem.id) {
                    openStorage = true;
                }
                return item;
            });
        } else if (this.props.Login.masterData.storageContainer && this.props.Login.masterData.storageContainer !== undefined) {
            openStorage = true;
        }
        if (openStorage === true) {
            if (this.props.Login.selectedItem && this.props.Login.selectedItem.containerfirstnode === true) {
                this.props.getStorageConditionFromMaster(this.props.Login.userInfo, this.props.Login.masterData, editContainerID)
            } else {
                toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTANYCONTAINER" }));
            }
        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTANYCONTAINER" }));
        }

    }
    discardSampleStorageMaster = (ncontrolCode) => {
        let inputData = [];

        let data = [];
        if (this.props.Login.masterData.sampleStorageMaster && this.props.Login.masterData.selectedSampleStorageMaster && this.props.Login.masterData.selectedSampleStorageMaster[0] !== undefined) {
            this.props.Login.masterData.selectedSampleStorageMaster.forEach(item => {
                data.push({
                    "nsamplecode": item.nsamplecode, "ssampletraycode": item.ssampletraycode, "ssamplearno": item.ssamplearno,"slocationhierarchy":item.slocationhierarchy
                });
            })

            inputData["sampleStorageMaster"] = data;
            inputData["userinfo"] = this.props.Login.userInfo;

            const inputParam = {
                methodUrl: "SampleStorageMaster",
                classUrl: "samplestoragemaster",
                inputData: inputData,
                operation: "discard", searchRef: this.searchRef
            }
            const masterData = this.props.Login.masterData;
            if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, ncontrolCode)) {
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        loadEsign: true, screenData: { inputParam, masterData }, operation: "discard", openModal: true,
                        screenName: this.props.Login.inputParam.displayName
                    }
                }
                this.props.updateStore(updateInfo);
            }
            else {
                this.props.crudMaster(inputParam, this.props.Login.masterData, "openModal");
            }
        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTANYSAMPLE" }));
        }
    }
    sideNavDetail = (screenName) => {

        const addId = this.state.controlMap.has("Add SampleStorageMaster") && this.state.controlMap.get("Add SampleStorageMaster").ncontrolcode;
        const editId = this.state.controlMap.has("Edit SampleStorageMaster") && this.state.controlMap.get("Edit SampleStorageMaster").ncontrolcode;
        const deleteId = this.state.controlMap.has("Delete SampleStorageMaster") && this.state.controlMap.get("Delete SampleStorageMaster").ncontrolcode;
        const editContainerID = this.state.controlMap.has("Edit StorageContainer") && this.state.controlMap.get("Edit StorageContainer").ncontrolcode;
        const moveId = this.state.controlMap.has("Move SampleStorageMaster") && this.state.controlMap.get("Move SampleStorageMaster").ncontrolcode;
        const discardId = this.state.controlMap.has("Discard SampleStorageMaster") && this.state.controlMap.get("Discard SampleStorageMaster").ncontrolcode;

        if (this.props.Login.masterData.selectedSampleStorageVersion && this.props.Login.masterData.selectedSampleStorageVersion !== undefined) {
            return (
                screenName == "IDS_SAMPLEDETAILS" ?
                    <>
                        {this.props.Login.sampleTrayCode && this.props.Login.sampleTrayCode !== undefined ?
                            <>
                                <div className="actions-stripe">
                                    <div className="d-flex justify-content-end">
                                        <Nav.Link name="addsample" className="add-txt-btn"
                                            hidden={this.state.userRoleControlRights.indexOf(addId) === -1}
                                            onClick={() => this.openModal(addId)}
                                        >
                                            <FontAwesomeIcon icon={faPlus} /> { }
                                            <FormattedMessage id="IDS_SAMPLE" defaultMessage="Sample" />
                                        </Nav.Link>

                                        <Nav.Link name="deletesample" className="add-txt-btn"
                                            hidden={this.state.userRoleControlRights.indexOf(deleteId) === -1}
                                            onClick={() => this.confirmDelete(deleteId)}
                                        >
                                            <FontAwesomeIcon icon={faTrashAlt} /> { }
                                            <FormattedMessage id="IDS_DELETE" defaultMessage="Delete" />
                                        </Nav.Link>

                                        <Nav.Link name="movesample" className="add-txt-btn"
                                            hidden={this.state.userRoleControlRights.indexOf(moveId) === -1}
                                            onClick={() => this.moveItem(this.props.Login.userInfo, this.props.Login.masterData, moveId)}
                                        >
                                            <FontAwesomeIcon icon={faPlus} /> { }
                                            <FormattedMessage id="IDS_MOVE" defaultMessage="Move" />
                                        </Nav.Link>

                                        <Nav.Link name="discardsample" className="add-txt-btn"
                                            hidden={this.state.userRoleControlRights.indexOf(discardId) === -1}
                                            onClick={() => this.discardSampleStorageMaster(discardId)}
                                        >
                                            <FontAwesomeIcon icon={faArrowRight} /> { }
                                            <FormattedMessage id="IDS_DISCARD" defaultMessage="Discard" />
                                        </Nav.Link>

                                    </div>
                                </div>
                                <div className='toolbar-top-inner'>
                                    <TransactionListMasterJson
                                        listMasterShowIcon={1}
                                        clickIconGroup={false}
                                        splitChangeWidthPercentage={this.state.splitChangeWidthPercentage}
                                        masterList={this.props.Login.masterData.sampleStorageMaster || []}
                                        selectedMaster={this.props.Login.masterData.selectedSampleStorageMaster || []}
                                        primaryKeyField="nsamplecode"
                                        filterColumnData={this.props.filterTransactionList}
                                        getMasterDetail={this.props.getSampleMasterDetails}
                                        inputParam={{
                                            ...this.props.Login.masterData
                                        }}
                                        // moreField={this.props.Login.masterData.sampleStorageMaster || []}
                                        // selectionList={this.props.Login.masterData.RealFilterStatusValue
                                        //     && this.props.Login.masterData.RealFilterStatusValue.ntransactionstatus === transactionStatus.ALL ? this.props.Login.masterData.FilterStatus : []}
                                        selectionColorField="scolorhexcode"
                                        mainField={"ssamplearno"}
                                        showStatusLink={true}
                                        showStatusName={true}
                                        // statusFieldName="stransdisplaystatus"
                                        // statusField="ntransactionstatus"
                                        selectedListName="selectedSampleStorageMaster"
                                        // searchListName="searchedSample"
                                        // searchRef={this.searchSampleRef}
                                        // objectName="sample"
                                        listName="IDS_SAMPLE"
                                        // selectionField="ntransactionstatus"
                                        // selectionFieldName="stransdisplaystatus"
                                        // showFilter={this.props.Login.showFilter}
                                        // openFilter={this.openFilter}
                                        // closeFilter={this.closeFilter}
                                        // onFilterSubmit={this.onFilterSubmit}
                                        // subFields={this.state.DynamicSampleColumns}                                                 
                                        needMultiSelect={false}
                                        needSingleSelect={true}
                                        // subListName="columnlist"
                                        // jsonfield="jsondata"
                                        // showDynamicFields={true}
                                        // showStatusBlink={true}
                                        // filterParam={{
                                        //     ...this.state.filterSampleParam,
                                        //     childRefs: [{ ref: this.searchSubSampleRef, childFilteredListName: "searchedSubSample" },
                                        //     { ref: this.searchTestRef, childFilteredListName: "searchedTest" }],
                                        // }}
                                        // subFieldsLabel={false}
                                        handlePageChange={this.handlePageChange}
                                        skip={this.state.skip}
                                        take={this.state.take}
                                        needFilter={false}
                                        hidePaging={false}
                                        hideSearch={true}
                                    />
                                </div>
                            </>
                            : <></>
                        }
                    </>
                    : screenName == "IDS_CONTAINERS" ?
                        <>
                            <div className="actions-stripe">
                                <div className="d-flex justify-content-end">
                                    <Nav.Link name="addsample" className="add-txt-btn"
                                        hidden={this.state.userRoleControlRights.indexOf(moveId) === -1}
                                        onClick={() => this.moveItem(this.props.Login.userInfo, this.props.Login.masterData, moveId)}
                                    >
                                        <FontAwesomeIcon icon={faPlus} /> { }
                                        <FormattedMessage id="IDS_MOVE" defaultMessage="Move" />
                                    </Nav.Link>
                                </div>
                            </div>
                            <div className='toolbar-top-inner container-tab'>
                                <TransactionListMasterJson
                                    listMasterShowIcon={1}
                                    clickIconGroup={false}
                                    splitChangeWidthPercentage={this.state.splitChangeWidthPercentage}
                                    masterList={this.props.Login.masterData.containers || []}
                                    selectedMaster={this.props.Login.masterData.selectedContainer || []}
                                    primaryKeyField="id"
                                    filterColumnData={this.props.filterTransactionList}
                                    getMasterDetail={this.props.getselectedContainer}
                                    inputParam={{
                                        ...this.props.Login.masterData
                                    }}
                                    selectionColorField="scolorhexcode"
                                    mainField={"text"}
                                    showStatusLink={true}
                                    showStatusName={true}
                                    selectedListName="selectedContainer"
                                    listName="IDS_SAMPLE"
                                    needMultiSelect={false}
                                    needSingleSelect={true}
                                    subListName="columnlist"
                                    jsonfield="jsondata"
                                    showDynamicFields={true}
                                    showStatusBlink={true}
                                    handlePageChange={this.handlePageChange}
                                    skip={this.state.skip}
                                    take={this.state.take}
                                    needFilter={false}
                                    hidePaging={false}
                                    hideSearch={true}

                                />
                            </div>
                        </>
                        : screenName == "IDS_STORAGECONDITION" ?
                            <ProductList className="panel-main-content storage-tab">
                                {/* {this.props.Login.masterData.storageContainerCondition && this.props.Login.masterData.storageContainerCondition !== undefined ? */}
                                <Card className="border-0">
                                    <Card.Header className="no-padding">
                                        <Card.Subtitle>
                                            {/* <div className="d-inline">
                                                <Nav.Link name="editUser" hidden={this.state.userRoleControlRights.indexOf(editContainerID) === -1}
                                                    className="btn btn-circle outline-grey mr-2"
                                                    data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_EDIT" })}
                                                    onClick={() => this.loadStorageCondition()}
                                                >
                                                    <FontAwesomeIcon icon={faPencilAlt} />
                                                </Nav.Link>
                                            </div> */}
                                            <div className="actions-stripe">
                                                <div className="d-flex justify-content-end">
                                                    <Nav.Link name="editContainer" className="add-txt-btn"
                                                        hidden={this.state.userRoleControlRights.indexOf(editContainerID) === -1}
                                                        onClick={() => this.loadStorageCondition(editContainerID)}
                                                    >
                                                        {/* <FontAwesomeIcon icon={faPlus} /> { } */}
                                                        <FormattedMessage id="IDS_STORAGECONDITION" defaultMessage="Storage Condition" />
                                                    </Nav.Link>
                                                </div>
                                            </div>
                                        </Card.Subtitle>
                                    </Card.Header>
                                    <Card.Body className="form-static-wrap no-padding">
                                        <Row>
                                            <Col md={12}>
                                                <FormGroup>
                                                    <FormLabel>
                                                        <FormattedMessage id="IDS_STORAGECONDITIONNAME" />
                                                    </FormLabel>
                                                    <ReadOnlyText>
                                                        {this.props.Login.masterData.storageContainer && this.props.Login.masterData.storageContainer !== null ?
                                                            this.props.Login.masterData.storageContainer.sstorageconditionname === "NA" ? "-" : this.props.Login.masterData.storageContainer.sstorageconditionname
                                                            : "-" || "-"}
                                                    </ReadOnlyText>
                                                </FormGroup>
                                            </Col>
                                            <Col md={12}>
                                                <FormGroup>
                                                    <FormLabel>
                                                        <FormattedMessage id="IDS_STORAGELOCATIONNAME" />
                                                    </FormLabel>
                                                    <ReadOnlyText>
                                                        {this.props.Login.masterData.storageContainer && this.props.Login.masterData.storageContainer !== null ?
                                                            this.props.Login.masterData.storageContainer.sstorageconditionname === "NA" ? "-" : (this.props.Login.containerLocation && this.props.Login.containerLocation) : "-"}
                                                    </ReadOnlyText>
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>
                                {/* : ""} */}

                            </ProductList>
                            : ""
            )
        } else {
            const masterData = {
                ...this.props.Login.masterData, storageContainer: undefined,
                containers: undefined, sampleStorageMaster: undefined
            };
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    activeTabIndex: undefined,
                    containerLocation: undefined,
                    sampleTrayCode: undefined,
                    containerCode: undefined,
                    locationCode: undefined,
                    masterData
                }
            }
            this.props.updateStore(updateInfo);
        }
    }
    changePropertyView = (index, event, tabClick) => {


        let check = false;
        if (tabClick === true) {
            if ((index === 1 && this.state.selectedItem && this.state.selectedItem.containerlastnode === true) ||
                (index === 2 && this.state.selectedItem && this.state.selectedItem.containerfirstnode === true) ||
                (index === 3 && this.state.selectedItem && this.state.selectedItem.locationlastnode === true)) {
                check = false;
            } else {
                check = true;
            }
        }

        if (check === false) {
            if (window.innerWidth > 992 && event && this.state.enableAutoClick || !event) {

                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        activeTabIndex: this.state.activeTabIndex !== index ? index : 0 ? index : false
                    }
                }
                this.props.updateStore(updateInfo);
            }
        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTPROPERITEM" }));
        }
    }

    changePropertyViewClose = (id) => {
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                activeTabIndex: undefined
            }
        }
        this.props.updateStore(updateInfo);
    }

    onInputSwitchOnChange = (event) => {
        if (event.target.name == "PopupNav") {
            this.setState({
                enablePropertyPopup: !this.state.enablePropertyPopup
            })
        }
        else {
            this.setState({
                enableAutoClick: !this.state.enableAutoClick
            })
        }

    }


    generateBreadCrumData() {
        const breadCrumbData = [];
        if (this.props.Login.masterData && this.props.Login.masterData.filterStorageCategory) {

            breadCrumbData.push(
                {
                    "label": "IDS_STORAGECATEGORY",
                    "value": this.props.Login.masterData.selectedStorageCategoryName && this.props.Login.masterData.selectedStorageCategoryName !== null ? this.props.Login.masterData.selectedStorageCategoryName : "NA"
                    // "value": this.props.Login.masterData.approvedSampleStorageLocation ? this.props.Login.masterData.filterStorageCategory && this.props.Login.masterData.filterStorageCategory !== undefined ?
                    //     this.props.Login.masterData.selectedStorageCategoryName : "NA" : "NA"
                }
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

    onFilterSubmit = () => {
        if (this.state.nfilterStorageCategory.value) {
            let inputParam = {
                inputData: {
                    nstoragecategorycode: this.state.nfilterStorageCategory.value,
                    userinfo: this.props.Login.userInfo,
                    nfilterStorageCategory: this.state.nfilterStorageCategory

                }
            }
            this.props.changeStorageCategoryFilterOnSampleMaster(inputParam, this.props.Login.masterData.filterStorageCategory);
        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_STORAGECATEGORYNOTAVAILABLE" }));
        }
    }

    itemRender = (clickedItem) => {
        let item = clickedItem.item;
        if (!this.state.toggleAction) {
            return (
                <>
                    {clickedItem.item ? (
                        <span className={`normal-node
                         ${clickedItem.item.editable ? "active-node" : ""}
                         ${item.expanded ? "expand-node" : "collapse-node"}
                         `}>
                            {item.containerfirstnode ? <FontAwesomeIcon icon={faBoxOpen} /> :
                                item.locationlastnode ? <FontAwesomeIcon icon={faLocationArrow} /> :
                                    item.containerlastnode ? <FontAwesomeIcon icon={faBox} /> :
                                        item.expanded ? <FontAwesomeIcon icon={faFolderOpen} /> : <FontAwesomeIcon icon={faFolder} />}
                            {item.text}
                        </span>
                        // <ul className="list-inline mb-0">
                        // <li className="list-inline-item mr-3 ">{clickedItem.item.text}</li>
                        // {clickedItem.item.editable ? (
                        // <>
                        // <li className="list-inline-item ">
                        // <span
                        // className="action-icon"
                        // onClick={(e) => this.setProperties(e, clickedItem)}
                        // ></span>
                        // </li>
                        // </>
                        // ) : null}
                        // </ul>
                    ) : (
                        ""
                    )}
                </>
            );
        }
    };

    onItemClick = (event) => {
        // if (this.state.selectedItemMove) {
        //     this.state.selectedItemMove.selected = false;
        // }

        // event.item.selected = true;
        // this.setState({
        //     selectedItem: event.item
        // })
        let newData = mapTree(this.state.treeData, "items", (item) => {
            if (item.editable === true) {
                item.editable = false;
            } else if (item.id === event.item.id) {
                item.editable = true;
            }
            return item;
        });
        // newData.map((data) => {
        //     this.clearSelected(data, event.item)
        // })

        let result = newData;
        const indices = event.itemHierarchicalIndex.split('_').map(index => Number(index));
        let itemText = "";
        for (let i = 0; i < indices.length; i++) {
            if (i === 0) {
                result = result[indices[i]];
            } else {
                result = result.items[indices[i]];
            }
            itemText = i > 0 ? itemText + " > " + result.text : result.text;
        }

        this.setState({ treeData: newData, clickedItem: event.item, targetLocationHierarchy: itemText });
    };
    clearSelected(innerObj, selectedItem) {
        // console.log(innerObj, selectedItem, "aasd")
        if (innerObj.id == selectedItem.id) {
            innerObj.selected = true;
        } else {
            innerObj.selected = false;
        }
        if (innerObj.items && innerObj.items.length > 0) {
            innerObj.items.map((childObj) => {
                this.clearSelected(childObj, selectedItem)
            })
        }
        return innerObj
    }
    onExpandChange = (event) => {
        event.item.expanded = !event.item.expanded;
        this.forceUpdate();
    };

    onMoveClick = (saveType, formRef) => {
        let inputParam = {};
        let inputData = [];

        inputData["userinfo"] = this.props.Login.userInfo;

        if (this.state.activeTabIndex === 1) {

            if (this.state.clickedItem && this.state.clickedItem.containerlastnode === true) {
                if (this.state.clickedItem.id !== this.props.Login.sampleTrayCode) {

                    let getSelectedSamples = "";

                    this.props.Login.masterData.selectedSampleStorageMaster.forEach(data => {
                        getSelectedSamples += "'" + data.ssamplearno + "'" + ","; //ssampletraycode
                    });
                    if (getSelectedSamples !== "") {
                        getSelectedSamples = getSelectedSamples.slice(0, getSelectedSamples.length - 1);
                    }
                    inputParam = {
                        selectedSamples: getSelectedSamples,//this.props.Login.masterData.selectedSampleStorageMaster,
                        moveTargetTrayCode: this.state.clickedItem.id,
                        nsamplestoragelocationcode: this.props.Login.masterData.selectedSampleStorageVersion.nsamplestoragelocationcode,
                        moveContainers: false,
                        storageCategory: this.state.selectedRecord["nstoragecategorycode"] && this.state.selectedRecord["nstoragecategorycode"].value,
                        methodUrl: "SampleStorageMaster",
                        inputData: inputData,
                        operation: "move",
                        userinfo: this.props.Login.userInfo,
                        sourceLocationHierarchy: this.props.Login.sampleLocation,
                        targetLocationHierarchy: this.state.targetLocationHierarchy,
                    }
                    const masterData = this.props.Login.masterData;
                    const selectedRecord = this.state.selectedRecord || {};

                    if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolcode)) {
                        const updateInfo = {
                            typeName: DEFAULT_RETURN,
                            data: {
                                loadEsign: true, screenData: { inputParam, masterData, selectedRecord }, operation: "move", openChildModal: true,
                                screenName: this.props.Login.inputParam.displayName
                            }
                        }
                        this.props.updateStore(updateInfo);
                    } else {
                        this.props.moveItems(inputParam, this.props.Login.masterData);
                    }
                }
            } else {
                toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTPROPERITEM" }));
            }


        } else if (this.state.activeTabIndex === 3) {

            if (this.state.clickedItem && this.state.clickedItem.locationlastnode === true) {
                if (this.state.clickedItem.id !== this.props.Login.locationCode) {

                    let getSampleTray = "";
                    let getContainerCode = "";
                    let targetData = this.state.treeData || [];
                    let sourceData = this.state.treeDataView || [];
                    let newData = [];
                    let sameLocation = true;
                    let targetJsonData = {};
                    let SourceJsonData = {};
                    let selectedContainers = [];



                    if (this.props.Login.masterData.selectedSampleStorageVersion && this.props.Login.masterData.selectedSampleStorageVersion.nsamplestoragelocationcode === this.state.selectedRecord["nsamplestoragelocationcode"].value) {
                        this.props.Login.masterData.selectedContainer.forEach(data => {
                            targetData = removeItems(targetData, "items", (item) => {
                                return item.id === data.id;
                            });
                        })


                        newData = mapTree(targetData, "items", (item) => {
                            if (item.id === this.state.clickedItem.id) {
                                item.items = item.items || [];
                                item.items.push(...this.props.Login.masterData.selectedContainer);
                            }
                            if (item.expanded === false) {
                                item.expanded = true;
                            }
                            if (item.selected && item.selected === true) {
                                item.selected = false;
                            }
                            return item;
                        });
                        targetJsonData["data"] = newData;
                    } else {


                        this.props.Login.masterData.selectedContainer.forEach(data => {
                            sourceData = removeItems(sourceData, "items", (item) => {
                                return item.id === data.id;
                            });

                            if (sourceData.length > 0) {
                                sourceData = mapTree(sourceData, "items", (item) => {
                                    if (item.selected && item.selected === true) {
                                        item.selected = false;
                                    }
                                    return item;
                                });
                            }
                        })


                        newData = mapTree(targetData, "items", (item) => {
                            if (item.id === this.state.clickedItem.id) {
                                item.items = item.items || [];
                                item.items.push(...this.props.Login.masterData.selectedContainer);
                            }
                            if (item.expanded === false) {
                                item.expanded = true;
                            }
                            if (item.selected && item.selected === true) {
                                item.selected = false;
                            }
                            return item;
                        });
                        SourceJsonData["data"] = sourceData;
                        targetJsonData["data"] = newData;

                        sameLocation = false;
                    }

                    this.props.Login.masterData.selectedContainer.forEach(data => {

                        mapTree([data], "items", (item) => {
                            if (item.containerlastnode === true) {
                                getSampleTray += "'" + item.id + "'" + ",";
                            }
                        });

                        getContainerCode += "'" + data.id + "'" + ",";
                        selectedContainers.push({ scontainercode: data.id, text: data.text })
                    })
                    if (getSampleTray !== "") {
                        getSampleTray = getSampleTray.slice(0, getSampleTray.length - 1);
                    }
                    if (getContainerCode !== "") {
                        getContainerCode = getContainerCode.slice(0, getContainerCode.length - 1);
                    }

                    inputParam = {
                        selectedSamples: getSampleTray,
                        sourceLocationCode: this.props.Login.masterData.selectedSampleStorageVersion.nsamplestoragelocationcode,
                        sourceVersionCode: this.props.Login.masterData.selectedSampleStorageVersion.nsamplestorageversioncode,
                        nsamplestoragelocationcode: this.state.selectedRecord["nsamplestoragelocationcode"].item.nsamplestoragelocationcode,
                        nsamplestorageversioncode: this.state.selectedRecord["nsamplestoragelocationcode"].item.nsamplestorageversioncode,
                        SourceJsonData: SourceJsonData,
                        targetJsonData: targetJsonData,
                        moveContainers: true,
                        storageCategory: this.props.Login.masterData.selectedSampleStorageVersion.nstoragecategorycode,
                        sameLocation,
                        methodUrl: "SampleStorageMaster",
                        inputData: inputData,
                        operation: "move",
                        userinfo: this.props.Login.userInfo,
                        sourceLocationHierarchy: this.props.Login.locationText,
                        targetLocationHierarchy: this.state.targetLocationHierarchy,
                        selectedContainer: selectedContainers,
                        getContainerCode: getContainerCode
                    }
                    // this.props.moveItems(inputParam, this.props.Login.masterData);

                    const masterData = this.props.Login.masterData;
                    const selectedRecord = this.state.selectedRecord || {};

                    if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolcode)) {
                        const updateInfo = {
                            typeName: DEFAULT_RETURN,
                            data: {
                                loadEsign: true, screenData: { inputParam, masterData, selectedRecord }, operation: "move", openChildModal: true,
                                screenName: this.props.Login.inputParam.displayName
                            }
                        }
                        this.props.updateStore(updateInfo);
                    } else {
                        this.props.moveItems(inputParam, this.props.Login.masterData);
                    }
                }
            } else {
                toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTPROPERITEM" }));
            }

        }


    }

    reloadData = () => {
        this.searchRef.current.value = "";
        // let nfilterStorageCategory = this.state.nfilterStorageCategory && Object.keys(this.state.nfilterStorageCategory).length !== 0 ? this.state.nfilterStorageCategory.value : 0;
        let nfilterStorageCategory = this.props.Login.masterData.filterStorageCategory && this.props.Login.masterData.nfilterStorageCategory;
        const inputParam = {
            inputData: { "userinfo": this.props.Login.userInfo, "nstoragecategorycode": nfilterStorageCategory },
            classUrl: "samplestoragemaster",
            methodUrl: "SampleStorageMaster",
            displayName: "IDS_SAMPLESTORAGEMASTER",
            userInfo: this.props.Login.userInfo
        };

        this.props.callService(inputParam);
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
    render() {

        let mandatoryFields = [];

        if (this.state.activeTabIndex === 1) {
            mandatoryFields.push({ "idsName": "IDS_SAMPLE", "dataField": "ssamplearno", "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" });
        } else if (this.state.activeTabIndex === 2) {
            mandatoryFields.push({ "idsName": "IDS_STORAGECONDITIONNAME", "dataField": "nstorageconditioncode", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" });
        }

        const filterParam = {
            inputListName: "approvedSampleStorageLocation", selectedObject: "selectedSampleStorageVersion", primaryKeyField: "nsamplestorageversioncode",
            fetchUrl: "samplestoragelocation/getActiveSampleStorageVersion",
            fecthInputObject: { userinfo: this.props.Login.userInfo },
            masterData: this.props.Login.masterData,
            searchFieldList: ["ssamplestoragelocationname"]
        };

        const breadCrumbData = this.state.filterData || [];

        const confirmMessage = new ConfirmMessage();
        return (
            <>
                <ListWrapper className="client-listing-wrap toolbar-top-wrap mtop-4 screen-height-window">
                    {breadCrumbData.length > 0 ?
                        <BreadcrumbComponent breadCrumbItem={breadCrumbData} />
                        : ""}
                    <Row noGutters={true} className={`toolbar-top ${this.state.activeTabIndex ? 'active-property-bar' : ""}`}>
                        <Col md={12}>
                            <ListWrapper className={`vertical-tab-top grid-master ${this.state.enablePropertyPopup ? 'active-popup' : ""}`}>
                                <div className={`tab-left-area ${this.state.activeTabIndex ? 'active' : ""}`}>
                                    <ListMaster
                                        formatMessage={this.props.intl.formatMessage}
                                        screenName={this.props.intl.formatMessage({ id: "IDS_SAMPLESTORAGEMASTER" })}
                                        masterData={this.props.Login.masterData}
                                        userInfo={this.props.Login.userInfo}
                                        masterList={this.props.Login.masterData.searchedData || this.props.Login.masterData.approvedSampleStorageLocation}
                                        getMasterDetail={(selectedItem) =>
                                            this.props.getSelectedApprovedStorageVersion(
                                                selectedItem, this.props.Login.userInfo,
                                                this.props.Login.masterData
                                            )}
                                        selectedMaster={this.props.Login.masterData.selectedSampleStorageVersion}
                                        primaryKeyField="nsamplestoragelocationcode"
                                        mainField="ssamplestoragelocationname"
                                        // firstField="sversionno"
                                        // secondField="stransdisplaystatus"
                                        filterColumnData={this.props.filterColumnData}
                                        filterParam={filterParam}
                                        userRoleControlRights={this.state.userRoleControlRights}
                                        hideAddButton={true}
                                        // addId={addId}
                                        searchRef={this.searchRef}
                                        reloadData={this.reloadData}
                                        hidePaging={false}
                                        // openModal={() => this.props.getDesignTemplateMappingComboService(addParam)}
                                        showFilterIcon={true}
                                        showFilter={this.props.Login.showFilter}
                                        openFilter={this.openFilter}
                                        closeFilter={this.closeFilter}
                                        onFilterSubmit={this.onFilterSubmit}
                                        filterComponent={[
                                            {
                                                "IDS_STORAGEFILTER":
                                                    <StorageCategoryFilter
                                                        filterStorageCategory={this.state.filterStorageCategory || []}
                                                        nfilterStorageCategory={this.state.nfilterStorageCategory || {}}
                                                        onComboChange={this.onComboChange}
                                                    />
                                            }
                                        ]}
                                    />

                                </div>
                                <div className='tree-view-container'>
                                    {this.props.Login.masterData.selectedSampleStorageVersion && this.props.Login.masterData.selectedSampleStorageVersion !== undefined ?
                                        <TreeViewEditable
                                            id="samplestoragelocation"
                                            name="samplestoragelocation"
                                            // label="Sample Storage Location"
                                            data={this.state.treeDataView}
                                            expandIcons={true}
                                            item={this.itemRenderView}
                                            selectField={'active-node'}
                                            onExpandChange={this.onExpandChangeView}
                                            onItemClick={this.onItemClickView}
                                        />
                                        :
                                        <></>
                                    }
                                </div>
                                <div className={`${this.state.enablePropertyPopup ? 'active-popup' : ""} xs-grid-container vertical-tab ${this.state.activeTabIndex ? 'active' : ""}`} >
                                    <div className={`${this.state.enablePropertyPopup ? 'active-popup' : ""} vertical-tab-content pager_wrap wrap-class ${this.state.activeTabIndex ? 'active' : ""}`} style={{ width: this.state.enablePropertyPopup ? this.state.propertyPopupWidth + '%' : "" }}>
                                        <span className={` vertical-tab-close ${this.state.activeTabIndex ? 'active' : ""}`} onClick={() => this.changePropertyViewClose(false)}><FontAwesomeIcon icon={faChevronRight} /> </span>
                                        <div className={` vertical-tab-content-common  ${this.state.activeTabIndex && this.state.activeTabIndex === 1 ? 'active' : ""}`}>
                                            <h4 className='inner_h4 no-margin'>
                                                {this.props.intl.formatMessage({ id: "IDS_SAMPLEDETAILS" })}
                                            </h4>
                                            {this.state.activeTabIndex && this.state.activeTabIndex === 1 ? this.sideNavDetail("IDS_SAMPLEDETAILS") : ""}
                                        </div>
                                        <div className={` vertical-tab-content-common  ${this.state.activeTabIndex && this.state.activeTabIndex === 2 ? 'active' : ""}`}>
                                            <h4 className='inner_h4 no-margin'>
                                                {this.props.intl.formatMessage({ id: "IDS_STORAGECONDITION" })}
                                            </h4>
                                            {this.state.activeTabIndex && this.state.activeTabIndex === 2 ? this.sideNavDetail("IDS_STORAGECONDITION") : ""}
                                        </div>
                                        <div className={` vertical-tab-content-common  ${this.state.activeTabIndex && this.state.activeTabIndex === 3 ? 'active' : ""}`}>
                                            <h4 className='inner_h4 no-margin'>
                                                {this.props.intl.formatMessage({ id: "IDS_CONTAINERS" })}
                                            </h4>
                                            {this.state.activeTabIndex && this.state.activeTabIndex === 3 ? this.sideNavDetail("IDS_CONTAINERS") : ""}
                                        </div>


                                    </div>
                                    <div className='tab-head'>
                                        <ul>
                                            <li className={`${this.state.activeTabIndex && this.state.activeTabIndex === 1 ? 'active' : ""}`} onClick={() => this.changePropertyView(1, undefined, true)}>
                                                <FontAwesomeIcon icon={faEye} />
                                                <span>
                                                    {this.props.intl.formatMessage({ id: "IDS_SAMPLEDETAILS" })}
                                                </span>
                                            </li>
                                            <li className={`${this.state.activeTabIndex && this.state.activeTabIndex === 2 ? 'active' : ""}`} onClick={() => this.changePropertyView(2, undefined, true)}>
                                                <FontAwesomeIcon icon={faLink} />
                                                <span>
                                                    {this.props.intl.formatMessage({ id: "IDS_STORAGECONDITION" })}
                                                </span>
                                            </li>
                                            <li className={`${this.state.activeTabIndex && this.state.activeTabIndex === 3 ? 'active' : ""}`} onClick={() => this.changePropertyView(3, undefined, true)}>
                                                <FontAwesomeIcon icon={faComments} />
                                                <span>
                                                    {this.props.intl.formatMessage({ id: "IDS_CONTAINERS" })}
                                                </span>
                                            </li>

                                        </ul>
                                        {/* <span className='tab-click-toggle-btn'>
                                            <CustomSwitch
                                                label={"Auto Show"}
                                                type="switch"
                                                name={"Auto Click"}
                                                onChange={(event) => this.onInputSwitchOnChange(event)}
                                                defaultValue={this.state.enableAutoClick}
                                                isMandatory={false}
                                                required={true}
                                                checked={this.state.enableAutoClick}
                                            />
                                        </span> */}
                                        {/* <span className='tab-click-toggle-btn'>
                                            <CustomSwitch
                                                label={"Popup Nav"}
                                                type="switch"
                                                name={"PopupNav"}
                                                onChange={(event) => this.onInputSwitchOnChange(event)}
                                                defaultValue={this.state.enablePropertyPopup}
                                                isMandatory={false}
                                                required={true}
                                                checked={this.state.enablePropertyPopup}
                                            />
                                        </span> */}
                                    </div>
                                </div>
                            </ListWrapper>
                        </Col>
                    </Row>
                </ListWrapper>
                {this.props.Login.openModal &&
                    <SlideOutModal show={this.props.Login.openModal}
                        closeModal={this.closeModal}
                        operation={this.props.Login.operation}
                        inputParam={this.props.Login.inputParam}
                        screenName={this.props.intl.formatMessage({ id: this.state.activeTabIndex && this.state.activeTabIndex === 1 ? "IDS_SAMPLE" : "IDS_STORAGECONDITIONNAME" })}
                        onSaveClick={this.onSaveClick}
                        esign={this.props.Login.loadEsign}
                        validateEsign={this.validateEsign}
                        masterStatus={this.props.Login.masterStatus}
                        updateStore={this.props.updateStore}
                        selectedRecord={this.state.selectedRecord || {}}
                        showSaveContinue={this.props.Login.loadEsign ? false : this.state.activeTabIndex && this.state.activeTabIndex === 1 ? true : false}
                        mandatoryFields={mandatoryFields}
                        addComponent={this.props.Login.loadEsign ?
                            <Esign operation={this.props.Login.operation}
                                formatMessage={this.props.intl.formatMessage}
                                onInputOnChange={this.onInputOnChange}
                                inputParam={this.props.Login.inputParam}
                                selectedRecord={this.state.selectedRecord || {}}
                            />
                            :
                            this.state.activeTabIndex && this.state.activeTabIndex === 1 ? (
                                <AddSample
                                    onInputChange={(e) => this.onInputChange(e)}
                                    selectedRecord={this.state.selectedRecord || {}}
                                    onKeyUp={(e) => this.onKeyUp(e)}
                                    onNumericInputChange={this.onNumericInputChange}
                                    onComboChange={this.onComboChange}
                                    unitMaster= {this.props.Login.masterData.unitMaster || []}
                                    isneedSubSampleQty={this.props.Login.isneedSubSampleQty && this.props.Login.isneedSubSampleQty || false}
                                />
                            ) : this.state.activeTabIndex && this.state.activeTabIndex === 2 ? (
                                <AddContainerStorageCondition
                                    selectedRecord={this.state.selectedRecord || {}}
                                    onComboChange={this.onComboChange}
                                    storageCondition={this.props.Login.masterData.storageCondition || []}
                                />
                            ) : (
                                <></>
                            )
                        }
                    />
                }

                {this.props.Login.openChildModal &&
                    <SlideOutModal show={this.props.Login.openChildModal}
                        closeModal={this.closeChildModal}
                        // operation={this.props.intl.formatMessage({ id: "IDS_MOVE" })}
                        operation={(this.props.Login.screenName === "IDS_MOVE") ? "" :  this.props.Login.operation}
                        inputParam={this.props.Login.inputParam}
                        screenName={this.props.intl.formatMessage({ id: this.state.activeTabIndex && this.state.activeTabIndex === 1 ? "IDS_SAMPLE" : "IDS_CONTAINERS" })}
                        onSaveClick={this.onMoveClick}
                        esign={this.props.Login.loadEsign}
                        validateEsign={this.validateEsign}
                        masterStatus={this.props.Login.masterStatus}
                        updateStore={this.props.updateStore}
                        selectedRecord={this.state.selectedRecord || {}}
                        addComponent={this.props.Login.loadEsign ?
                            <Esign operation={this.props.Login.operation}
                                formatMessage={this.props.intl.formatMessage}
                                onInputOnChange={this.onInputOnChange}
                                inputParam={this.props.Login.inputParam}
                                selectedRecord={this.state.selectedRecord || {}}
                            />
                            :
                            <MoveSampleOrContainers
                                treeData={this.state.treeData}
                                selectedRecord={this.state.selectedRecord || {}}
                                itemRender={this.itemRender}
                                onExpandChange={this.onExpandChange}
                                onItemClick={this.onItemClick}
                                onComboChange={this.onComboChange}
                                storageCategory={this.props.Login.masterData.storageCategory || []}
                                approvedLocation={this.props.Login.masterData.approvedLocation || []}
                                isSendToStore={false}
                            />
                        }
                    />
                }
            </>
        )
    }

    onNumericInputChange = (value, name) => {
        const selectedRecord = this.state.selectedRecord || {};
        selectedRecord[name] = value;
        this.setState({ selectedRecord });
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
        if (this.state.activeTabIndex === 1 && this.props.Login.operation === "create") {

            this.props.validateEsignCredentialSampleStorageMaster(inputParam);
        } else if (this.props.Login.operation === "move") {
            this.props.validateEsignCredentialSampleStorageMaster(inputParam);
        } else {
            this.props.validateEsignCredential(inputParam, "openModal");
        }

    }

}


const mapStateToProps = (state) => {
    return {
        Login: state.Login
    }
}
export default connect(mapStateToProps, {
    callService, crudMaster, updateStore, validateEsignCredential, getSampleMaster, filterColumnData,
    getSelectedSampleStorageLocation, editSampleStorageLocation, approveSampleStorageLocation,
    getSelectedSampleStorageVersion, getContainerStorageCondition, getStorageConditionFromMaster, getSampleMasterDetails,
    getContainers, getselectedContainer, changeStorageCategoryFilterOnSampleMaster, openSampleStorageApprovedLocation,
    loadApprovedLocationOnCombo, loadApprovedLocationOnTreeData, moveItems, saveSampleStorageMaster, getSelectedApprovedStorageVersion,
    validateEsignCredentialSampleStorageMaster,addSample
})(injectIntl(SampleStorageMaster));