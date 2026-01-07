import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Row, Col, Card, Nav, FormGroup, FormLabel, Form, Button, FormControl } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faTrashAlt, faCopy, faPencilAlt, faPlus, faThumbsUp, faBoxOpen, faBox, faLocationArrow, faFolder, faFolderOpen, faSearch, faTimes, faArrowDown, faHandPointLeft, faArrowUp, faClone, faFileImport, faEye, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import { constructOptionList, getControlMap, showEsign } from '../../components/CommonScript';
import { ReadOnlyText,  SearchIcon } from '../../components/App.styles';
import SlideOutModal from '../../components/slide-out-modal/SlideOutModal';
import {
    callService, crudMaster, validateEsignCredential, updateStore, getSelectedSampleStorageLocation, filterTransactionList, changeStorageCategoryFilter,
    openPropertyModal, editSampleStorageLocation, approveSampleStorageLocation, getSelectedSampleStorageVersion, fetchStorageCategory, copySampleStorageVersion,
    crudSampleStorageLocation, additionalInformationData, //getsite
} from '../../actions';
import { DEFAULT_RETURN, UN_AUTHORIZED_ACCESS } from '../../actions/LoginTypes';
import { ListWrapper } from '../../components/client-group.styles';
import { ProductList } from '../product/product.styled';
// import ReactTooltip from 'react-tooltip';
//import { uuid } from 'uuidv4';
import { v4 as uuid } from 'uuid';
//import TreeEditable from "../../components/form-tree-editable/TreeEditable";
import TreeViewEditable from "../../components/form-tree-editable/form-tree-editable.component";
import { mapTree, removeItems } from "@progress/kendo-react-treelist";
import ConfirmMessage from '../../components/confirm-alert/confirm-message.component';
import AddTreeview from './AddTreeview';
import AddTreeProperties from './AddTreeProperties';
import TransactionListMasterJsonView from '../../components/TransactionListMasterJsonView';
import BreadcrumbComponent from '../../components/Breadcrumb.Component';
//import SplitterLayout from '@progress/kendo-react-layout'; //'react-splitter-layout';
import { Splitter, SplitterPane } from '@progress/kendo-react-layout';
import StorageCategoryFilter from './StorageCategoryFilter';
import { transactionStatus,designProperties } from '../../components/Enumeration';
import Esign from '../audittrail/Esign';
import { TreeViewDragAnalyzer, moveTreeViewItem } from '@progress/kendo-react-treeview';
import { ReactComponent as RefreshIcon } from '../../assets/image/refresh.svg';
import ModalShow from '../../components/ModalShow';
import { faChevronDown, faChevronUp} from '@fortawesome/free-solid-svg-icons';
import Axios from 'axios';
import rsapi from '../../rsapi';
import { intl } from '../../components/App';

//import { Upload } from '@progress/kendo-react-upload';


class StorageStructure extends Component {
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
            treeData: [{ title: 'Chicken', children: [{ title: 'Egg' }] }],
            toggleAction: false,
            treeDataView: undefined,
            toggleActionView: false,
            keyIndentify: false,
            treeData: [
                {
                    //  text: "root",
                    text: this.props.intl.formatMessage({ id: "IDS_ROOT" }),
                    expanded: true,
                    editable: true,
                    root: true,
                    id: uuid(),
                }],
            // panes: [{
            //     size: '50%',
            //     scrollable: false
            // }],
             //Added by L.Subashini on 20/12/2025 for Splitter issue with React Version Upgrade to 17
            panes: [
                { size: '30%', min: '25%', collapsible:true } ,
                 
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
            selectedItem: undefined
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
    onChange = (event) => {
        this.setState({ panes: event.newState })
    };

    //Added by L.Subashini on 23/12/2025 for Splitter issue with React Version Upgrade to 17
    onSplitterChange = (event) => {
        this.setState({ panes: event.newState });
    };

    componentDidUpdate(previousProps) {
        if (this.pointedItem) {
            let scrollDoc = document.getElementById('selected-tree-point');
            if (scrollDoc) {
                scrollDoc.scrollIntoView({ behavior: 'smooth' })
            }
        }
        let isComponentUpdated = false;
        let { filterData } = this.state;
        let selectedRecord = this.state.selectedRecord || {};
        if (this.props.Login.userInfo.nformcode !== previousProps.Login.userInfo.nformcode) {
            const userRoleControlRights = [];
            if (this.props.Login.userRoleControlRights) {
                this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode] && Object.values(this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode]).map(item =>
                    userRoleControlRights.push(item.ncontrolcode))
            }
            const controlMap = getControlMap(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode)
            this.setState({ controlMap, userRoleControlRights });
        }
        if (this.props.Login.treeData !== previousProps.Login.treeData) {
            this.setState({
                treeData: this.props.Login.treeData
            });
        }
        if (this.props.Login.treeDataView !== previousProps.Login.treeDataView) {
            this.setState({
                treeDataView: this.props.Login.treeDataView
            });
        }
        if (this.props.Login.masterData.selectedSampleStorageVersion !== previousProps.Login.masterData.selectedSampleStorageVersion) {

            if (this.props.Login.masterData.selectedSampleStorageVersion && this.props.Login.masterData.selectedSampleStorageVersion !== undefined) {
                if (this.searchRef.current) {
                    //  this.searchRef.current.value = "";
                }
                this.handleSearch();
                this.setState({
                    treeDataView:
                        JSON.parse(this.props.Login.masterData.selectedSampleStorageVersion["jsondata"].value).data,
                    searchedTreeData: undefined,
                    showSearch: false,
                    //	ALPD-5308	Added skip and take for pagination issue by Vishakh (05-06-2025)
                    skip: this.state.skip,
                    take: this.state.take
                });
            } else {
                if (this.searchRef.current) {
                    //  this.searchRef.current.value = "";
                }
                this.handleSearch();
                this.setState({
                    treeDataView: undefined,
                    searchedTreeData: undefined,
                    showSearch: false
                });
            }
        }

        //	ALPD-5119	Added skip and take for filter search issue by Vishakh (05-06-2025)
        if (this.props.Login.dataState && this.props.Login.dataState !== previousProps.Login.dataState) {
            this.setState({
                skip: this.props.Login.dataState.skip,
                take: this.props.Login.dataState.take
            });
        }

        let nfilterStorageCategory = this.state.nStorageCategory || {};
        let filterStorageCategory = this.state.filterStorageCategory || {};

        //	ALPD-5308	Added JSON.stringify for condition check by Vishakh (05-06-2025)
        if (JSON.stringify(this.props.Login.masterData.filterStorageCategory) !== JSON.stringify(previousProps.Login.masterData.filterStorageCategory)) {
            const filterStorageCategoryMap = constructOptionList(this.props.Login.masterData.filterStorageCategory || [], "nstoragecategorycode",
                "sstoragecategoryname", 'nstoragecategorycode', 'ascending', false);
            filterStorageCategory = filterStorageCategoryMap.get("OptionList");
            if (filterStorageCategory && filterStorageCategory.length > 0) {

                const filterCategory = filterStorageCategory.filter(item => item.value === this.props.Login.masterData.nfilterStorageCategory);//filterStorageCategory[0];
                nfilterStorageCategory = filterCategory[0];
            }
            isComponentUpdated = true;

            const filterData = this.generateBreadCrumData();
            //ALPD-4495 ALPD-4733 janakumar  pagination  work 
            let take = this.state.take;
            let skip = 0

            this.setState({ filterData, skip, take });

        } else if (this.props.Login.masterData.nfilterStorageCategory !== previousProps.Login.masterData.nfilterStorageCategory) {
            nfilterStorageCategory = this.props.Login.masterData.nfilterStorageCategory;
            isComponentUpdated = true;
            const filterData = this.generateBreadCrumData();
            //ALPD-4495 ALPD-4733 janakumar  pagination  work 
            let take = this.state.take;
            let skip = 0

            this.setState({ filterData, skip, take });
        }
        if (isComponentUpdated) {
            this.setState({ nfilterStorageCategory, selectedRecord, filterStorageCategory });
        }
        if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord) {
            this.setState({
                selectedRecord: this.props.Login.selectedRecord
            });
        }
        
        //ALPDJ21-32-comment by vignesh(23-07-2025)-->There is no need to fetch Instrument ID.
        /*
        //ALPDJ21-23
		//Storage Category, Instrument Category and Storage Structure Screens mapping enhancements
	    //start        
        if(this.props.Login.InstrumentList !==previousProps.Login.InstrumentList ){
             this.setState({
                InstrumentList: this.props.Login.InstrumentList
            });
        } */
        // UnCommented byL.Subashini to include site when settings 84=4
        if(this.props.Login.SiteList !== previousProps.Login.SiteList){
             this.setState({
                SiteList: this.props.Login.SiteList
            });
        }
        //end
       
        //below lines commented by rukshana
        //Added by janakumar ALPD-5125 Storage Structure → Search Pagination Error on Page 2
        // if(this.props.Login.dataState !==previousProps.Login.dataState){
        //     if(this.props.Login.dataState!==undefined){
        //         const take=this.props.Login.dataState.take;
        //         const skip=this.props.Login.dataState.skip;
        //         this.setState({ skip ,take});
        //     }

        // }
        // if (this.props.Login.masterData !== previousProps.Login.masterData) {
        //     const filterData = this.generateBreadCrumData();
        //     //ALPD-4495 janakumar  pagination  work 
        //     let take=this.state.take;
        //     let skip=0

        //     this.setState({ filterData ,skip ,take});
        // }
    }
    getSiblings = (itemIndex, data) => {
        let result = data;
        const indices = itemIndex.split(this.SEPARATOR).map(index => Number(index));
        for (let i = 0; i < indices.length - 1; i++) {
            result = result[indices[i]].items || [];
        }
        return result;
    };

    getClueClassName(event) {
        const eventAnalyzer = new TreeViewDragAnalyzer(event).init();
        const {
            itemHierarchicalIndex: itemIndex
        } = eventAnalyzer.destinationMeta;
        if (eventAnalyzer.isDropAllowed) {
            switch (eventAnalyzer.getDropOperation()) {
                case 'child':
                    return 'k-i-plus';
                case 'before':
                    return itemIndex === '0' || itemIndex.endsWith(`${this.SEPARATOR}0`) ? 'k-i-insert-up' : 'k-i-insert-middle';
                case 'after':
                    const siblings = this.getSiblings(itemIndex, this.state.tree);
                    const lastIndex = Number(itemIndex.split(this.SEPARATOR).pop());
                    return lastIndex < siblings.length - 1 ? 'k-i-insert-middle' : 'k-i-insert-down';
                default:
                    break;
            }
        }
        return 'k-i-cancel';
    }
    onItemDragOver = event => {
        this.dragOverCnt++;
        this.dragClue.show(event.pageY + 10, event.pageX, event.item.text, this.getClueClassName(event));
    };
    onItemDragEnd = event => {
        this.isDragDrop = this.dragOverCnt > 0;
        this.dragOverCnt = 0;
        this.dragClue.hide();
        const eventAnalyzer = new TreeViewDragAnalyzer(event).init();
        if (eventAnalyzer.isDropAllowed) {
            const updatedTree = moveTreeViewItem(event.itemHierarchicalIndex, this.state.treeData, eventAnalyzer.getDropOperation() || 'child', eventAnalyzer.destinationMeta.itemHierarchicalIndex);
            this.setState({
                tree: updatedTree
            });
        }
    };
    addChildNode = (e, clickedItem) => {
        let iscontainerlastnode = false;
        let ParentItem = this.searchClickedItemParent(this.state.treeData[0])
        if (ParentItem) {
            ParentItem.items.map(item => {
                item.expanded = false;
            });
        }

        let newData = mapTree(this.state.treeData, "items", (item) => {
            if (item.id === clickedItem.id) {
                if (item['containerlastnode'] === true) {
                    iscontainerlastnode = true;
                } else {
                    item.items = item.items || [];
                    item.expanded = true
                    item.items.push({
                        id: uuid(),
                        text: this.props.intl.formatMessage({ id: "IDS_LABEL" }),
                        expanded: true,
                        editable: false,
                        locationlastnode: false,
                        containerfirstnode: false,
                        containerlastnode: false,
                        itemhierarchy: ""
                    });
                }

            }
            return item;
        });
        if (iscontainerlastnode === true) {
            toast.info(this.props.intl.formatMessage({ id: "IDS_STORAGELOCATIONENDCANNOTHAVECHILDNODE" })

            );
        } else {
            this.setState({ treeData: newData });
        }
    };

    // generateUUID(innerObj) {

    //     // let parentIDNew=uuid()
    //     // let innerObjNew={...innerObj,
    //     //                 'id':parentIDNew } 
    //     // if (innerObjNew.items && innerObjNew.items.length > 0) {
    //     //     innerObjNew.items.map((childObj) => { 
    //     //         childObj={...childObj,
    //     //         'parentID':parentIDNew}
    //     //         this.generateUUID(childObj)
    //     //     })
    //     // }
    //     let parentIDNew=uuid()
    //     let innerObjNew={...innerObj,
    //            'id':parentIDNew } 
    //  if (innerObjNew.items && innerObjNew.items.length > 0) {
    //        innerObjNew.items.map((childObj) => { 
    //                 childObj={...childObj,
    //                 'parentID':parentIDNew}
    //                 return  this.generateUUID(childObj)
    //             })
    // } 
    //     return innerObjNew
    // }

    generateUUID(innerObj) {
        let parentIDNew = uuid()
        let innerObjNew = {
            ...innerObj,
            'id': parentIDNew
        }

        //  innerObj['id']=parentIDNew  
        if (innerObj.items && innerObj.items.length > 0) {
            for (let Obj of innerObj.items) {
                let childObj = Obj;
                childObj = {
                    ...childObj,
                    'parentID': parentIDNew
                }
                //childObj['parentID']=parentIDNew

                this.generateUUID(childObj);
            }
        }
        return innerObj;
    }

    searchClickedItemParent(treeData, clickedItem) {
        let ParentItem = { ...treeData };
        if (ParentItem.items && ParentItem.items.length > 0) {
            let childArray = ParentItem.items;
            if (childArray.length > 0) {
                for (var i = 0; i < childArray.length; i++) {
                    let childData = childArray[i]
                    if (clickedItem ? (clickedItem.id === childData.id) : (childData.editable === true)) {
                        return treeData;
                    } else {
                        if (childData.items) {
                            ParentItem = this.searchClickedItemParent(childData, clickedItem)
                            if (ParentItem) {
                                return ParentItem;
                            }
                        }
                    }
                }
            }
        }
        //    return ParentItem;
    }
    cloneNode = (e, clickedItem) => {
        let parentItem = {};
        let parentID = '';
        let clonedParentID = '';
        let parentFound = false;
        let cloneItems = {};
        let clonedparentFound = false;
        let newData = [...this.state.treeData];
        let newData1 = [...this.state.treeData];
        mapTree(this.state.treeData
            , "items", (item) => {
                // if (item.items) {
                //     if (parentFound&&(item.id===parentID)) {
                //         parentItem = item;
                //         parentFound = false;
                //     }
                // }

                if (item.id === clickedItem.id) {
                    parentFound = true;
                    parentID = clickedItem.parentID
                    parentItem = this.searchClickedItemParent(this.state.treeData[0])
                }
                if (item.editable === true) {
                    clonedParentID = uuid();
                    let clonedNewParentID = uuid();
                    //     //  let clonedObject=//{...item}
                    //     //   Object.assign({}, item);
                    //       const clonedObject = JSON.parse(JSON.stringify(item1));
                    //      cloneItems =//[{...clonedObject}].map((data) => {
                    //       // return 
                    //        this.generateUUID(clonedObject)
                    //    // })
                    let levelBasedParents = {}
                    cloneItems = mapTree([{ ...item }], "items", (cloneditem) => {
                        // const indices = cloneditem.itemHierarchicalIndex.split('_').map(index => Number(index));
                        // let x=getItemPath(this.state.treeData,indices,"items")
                        // console.log('------------->',cloneditem)
                        // if(cloneditem.items===undefined&&clonedparentFound){
                        //     clonedParentID=uuid();
                        //     clonedparentFound=false;
                        // }
                        // else{
                        //     clonedNewParentID=uuid();
                        // }
                        // if(!levelBasedParents.hasOwnProperty(cloneditem.itemHierarchicalIndex)){
                        //     let level=cloneditem.itemHierarchicalIndex;
                        //     levelBasedParents={...levelBasedParents,
                        //                         [level]:uuid()
                        //                     }
                        // }
                        // if(cloneditem.items){
                        //      //if ClonedItem is a Parent

                        //     cloneditem={
                        //         ...cloneditem,
                        //         'parentID':levelBasedParents[cloneditem.itemHierarchicalIndex]//clonedNewParentID
                        //         ,
                        //         'id':clonedParentID,
                        //         'editable': false 
                        //     } 
                        //     clonedParentID=levelBasedParents[cloneditem.itemHierarchicalIndex];
                        //     //  clonedParentID=uuid()//clonedNewParentID;
                        //     // clonedparentFound=true;
                        // }else{
                        //if ClonedItem is a Child
                        cloneditem = {
                            ...cloneditem,
                            //'parentID':levelBasedParents[cloneditem.itemHierarchicalIndex]//clonedParentID
                            // ,
                            'id': uuid(),
                            'editable': false,
                            'expanded': false
                            //   }
                            //  clonedParentID=levelBasedParents[cloneditem.itemHierarchicalIndex];
                        }
                        return cloneditem;
                    });
                }

                // item={
                //    ...item,
                //     'id':uuid(),
                //   'editable': false 
                //     } 
                return item;
            });
        if (parentItem === undefined) {
            return toast.warn(this.props.intl.formatMessage({ id: "IDS_ROOTNODECANNOTBEDELETED" }))
        }
        let count = 1;
        newData = mapTree(this.state.treeData, "items", (item) => {

            if (item.id === parentItem.id) {
                count++;
                item.items.push(
                    // {
                    // ...cloneItem,
                    // 'id':uuid(),
                    // 'editable': false,
                    // 'text': cloneItem['text']+'('+count+')'
                    // } 
                    {
                        ...cloneItems[0]
                        ,
                        'parentID': parentID,
                        // 'id':clonedParentID
                    }
                );
            }
            return item;
        });
        this.setState({ treeData: newData });
    }
    equalNode = (e, clickedItem) => {
        let parentItem = {};
        let parentFound = false;
        let newData = [...this.state.treeData];
        mapTree(this.state.treeData, "items", (item) => {
            if (item.items) {
                if (parentFound) {
                    parentItem = item;
                    parentFound = false;
                }
            }

            if (item.id === clickedItem.id) {
                parentFound = true;
            }

            return item;
        });
        if (parentItem.text === undefined) {
            newData.push({
                id: uuid(),
                text: this.props.intl.formatMessage({ id: "IDS_LABEL" }),
                expanded: true,
                editable: false,
                locationlastnode: false,
                containerfirstnode: false,
                containerlastnode: false,
                itemhierarchy: ""
            });
            this.setState({ treeData: newData });
        } else {
            newData = mapTree(this.state.treeData, "items", (item) => {
                if (item.id === parentItem.id) {
                    item.items.push({
                        id: uuid(),
                        text: this.props.intl.formatMessage({ id: "IDS_LABEL" }),
                        expanded: true,
                        editable: false,
                        locationlastnode: false,
                        containerfirstnode: false,
                        containerlastnode: false,
                        itemhierarchy: ""
                    });
                }
                return item;
            });
            this.setState({ treeData: newData });
        }
    };
    deleteNode = (clickedItem) => {
        if (clickedItem.root && clickedItem.root === true) {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_PARENTNODENOTALLOWTODELETE" }));
        } else {
            const newData = removeItems(this.state.treeData, "items", (item) => {
                return item.id === clickedItem.id;
            });
            this.setState({ treeData: newData });
        }
    };
    editRecord = (e, clickedItem) => {
        this.setState({ toggleAction: !this.state.toggleAction });
    };
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
    closeModalShow = () => {
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { loadTreeProperties: false }
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

        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { openModal, loadEsign, selectedRecord, selectedId, isView: false }
        }
        this.props.updateStore(updateInfo);
    }
    onInputChange = (event) => {
        const selectedRecord = this.state.selectedRecord || {};
        if (event.target.type === "checkbox") {
            if (event.target.checked && event.target.name === 'nneedposition') {
                selectedRecord['ncontainertypecode'] && delete selectedRecord['ncontainertypecode'];
                selectedRecord['ncontainerstructurecode'] && delete selectedRecord['ncontainerstructurecode'];
                selectedRecord['containerStructureOptions'] && delete selectedRecord['containerStructureOptions'];
                selectedRecord['nrow'] && delete selectedRecord['nrow'];
                selectedRecord['ncolumn'] && delete selectedRecord['ncolumn'];
                selectedRecord['ndirectionmastercode'] && delete selectedRecord['ndirectionmastercode'];

                //  selectedRecord['nquantity'] = this.calculateRowColumn(selectedRecord['nrow'], selectedRecord['ncolumn']);
            }

            selectedRecord[event.target.name] = event.target.checked;
            if (event.target.checked === false && event.target.name === 'nneedposition') {
                selectedRecord['nrow'] = 1;
                selectedRecord['ncolumn'] = 1;
                selectedRecord['nnoofcontainer'] = 1;
            }

        } else {
            selectedRecord[event.target.name] = event.target.value;
        }

        this.setState({ selectedRecord });
    };

    itemRender = (props) => {
        if (this.state.toggleAction) {
            return (
                <>
                    {props.item.editable ? (
                        <Form.Group className="k-editable-text-wrap">
                            <Form.Control
                                id={"nodename"}
                                name={"nodename"}
                                type="text"
                                onKeyDown={(e) => e.stopPropagation()}
                                value={props.item.text}
                                autoFocus
                                autoComplete="off"
                                onChange={(e) => this.handleChange(e, props.item)}
                                onBlur={(e) => this.handleBlur(e, props.item, props.itemHierarchicalIndex)}
                                maxLength="50"
                            />
                        </Form.Group>
                    ) : (
                        <span>{props.item.text}</span>
                    )}
                </>
            );
        } else {
            return (
                <>
                    {props.item ? (
                        <>
                            <span className='d-flex align-items-center'>
                                <span className={`normal-node text-truncate
                            ${props.item.editable ? "active-node" : ""}
                            ${props.item.expanded ? "expand-node" : "collapse-node"}
                            `} data-tooltip-id="my-tooltip" data-tooltip-content={props.item.text}>
                                    {props.item.containerfirstnode ? <FontAwesomeIcon icon={faBoxOpen} /> :
                                        props.item.locationlastnode ? <FontAwesomeIcon icon={faLocationArrow} /> :
                                            props.item.containerlastnode ? <FontAwesomeIcon icon={faBox} /> :
                                                props.item.expanded ? <FontAwesomeIcon icon={faFolderOpen} /> : <FontAwesomeIcon icon={faFolder} />}
                                    {props.item.text}
                                </span>
                                {props.item.editable ? (
                                    <>
                                        {/* 
                                <Button   className="action-icon tree-level1" role="button"
                                                 data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_CLONENODE" })}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    this.cloneNode(e, props.item);
                                                }}>
                                                <FontAwesomeIcon icon={faClone}
                                                 title={this.props.intl.formatMessage({ id: "IDS_CLONENODE" })} />
                                            </Button> */}
                                        {/* <span
                                        className="action-icon tree-level1"
                                        data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_EQUALNODE" })}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            this.equalNode(e, props.item);
                                        }}
                                    ></span> */}
                                        <span
                                            className="action-icon tree-level2"
                                            data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_CHILDNODE" })}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                this.addChildNode(e, props.item);
                                            }}
                                        ></span>
                                        <span
                                            className="k-icon k-i-edit k-i-pencil ml-2"
                                            data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_EDIT" })}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                this.editRecord(e, props.item);
                                            }}
                                        ></span>
                                        {!props.item.isRoot ? (
                                            <span
                                                className="k-icon k-i-delete ml-2"
                                                data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_DELETE" })}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    this.deleteNode(props.item);
                                                }}
                                            ></span>
                                        ) : null}
                                        <span
                                            className="action-icon tree-toggle m-l-half"
                                            data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_PROPERTIES" })}
                                            onClick={(e) => this.setProperties(e, props)}
                                        ></span>
                                        <span
                                            className="action-icon tree-level1"
                                            data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_CLONENODE" })}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                this.cloneNode(e, props.item);
                                            }}
                                        ></span>
                                    </>
                                ) : null}
                            </span>
                        </>
                    ) : (
                        ""
                    )}
                </>
            );
        }
    };

    onItemClick = (event) => {
        // if (selectedItem) {
        //     selectedItem.editable = false;
        //   }
        //   event.item.editable = true;
        //   selectedItem = event.item; 


        // let searchedData =undefined;
        // if(this.state.searchedTreeData){
        //      searchedData = mapTree(this.state.searchedTreeData, "items", (item1) => {
        //         if (item1.editable === true) {
        //             item1.editable = false;
        //         } else if (item1.id === event.item.id) {
        //             item1.editable = true;
        //         }
        //         return item1;
        //     });
        // } 

        // let newData = mapTree(this.state.treeData, "items", (item) => {
        //     if (item.editable === true) {
        //         item.editable = false;
        //     } else if (item.id === event.item.id) {
        //         item.editable = true;
        //     }
        //     return item;
        // });
        // this.setState({ treeData: newData,searchedTreeData: searchedData  }); 
        let searchedData = undefined;
        if (this.state.searchedTreeData) {
            searchedData = mapTree(this.state.searchedTreeData, "items", (item) => {
                if (item.editable === true) {
                    item.editable = false;
                } else if (item.id === event.item.id) {
                    item.editable = true;
                    if (this.pointedItem) {
                        if (this.pointedItem.id === item.id) {
                            this.pointedItem = undefined
                        }
                    }
                    let result = this.state.searchedTreeData;
                    const indices =
                        event.itemHierarchicalIndex.split('_').map(index => Number(index));
                    let itemText = "";

                    for (let i = 0; i < indices.length; i++) {
                        if (i === 0) {
                            result = result[0];
                        } else {
                            result = result.items[indices[i]];
                        }
                        itemText = i > 0 ? itemText + " > " + result.text : result.text;
                    }
                    item.itemhierarchy = itemText;
                }
                return item;
            });

            searchedData.map((data) => {
                this.clearSelected(data, event.item)
            })
        }
        let newData = mapTree(this.state.treeData, "items", (item) => {
            if (item.editable === true) {
                item.editable = false;
            } else if (item.id === event.item.id) {
                item.editable = true;

                let result = this.state.treeData;
                const indices =
                    event.itemHierarchicalIndex.split('_').map(index => Number(index));
                let itemText = "";

                for (let i = 0; i < indices.length; i++) {
                    if (i === 0) {
                        result = result[0];
                    } else {
                        result = result.items[indices[i]];
                    }
                    itemText = i > 0 ? itemText + " > " + result.text : result.text;
                }
                item.itemhierarchy = itemText;
            }
            return item;
        });
        newData.map((data) => {
            this.clearSelected(data, event.item)
        })


        this.setState({ treeData: newData, searchedTreeData: searchedData });
    };


    shrinkNodes(ParentItem) {
        //  ParentItem.expanded=false;
        if (ParentItem.items && ParentItem.items.length > 0) {
            let childArray = ParentItem.items;
            if (childArray.length > 0) {
                for (var i = 0; i < childArray.length; i++) {
                    let childData = childArray[i]
                    childData.expanded = false;
                    if (childData.items) {
                        this.shrinkNodes(childData)
                    }
                }
            }
        }
    }

    toggleSearch = () => {
        this.setState({
            showSearch: !this.state.showSearch
        })
    }


    clearSearchedState = () => {
        this.setState({
            searchedTreeData: undefined,
            showSearch: false
        })
    }

    navigationCounter = () => {
        let counter = this.state.counter || 0;

        return counter;
    }
    // handleSearch = () => { 
    //     let value = document.querySelector('.k-textbox').value
    //     this.uniqueIDArr=[]
    //     this.countforTree=0;
    //     let newData = this.search(this.state.treeDataView, value) 
    //     //Always root node should be expanded
    //     newData[0].expanded=true;  
    //     if(value===""){
    //         this.pointedItem=undefined
    //         this.setState({ searchedTreeData: undefined })
    //     }else{
    //         this.setState({ searchedTreeData: JSON.parse(JSON.stringify(newData)) })
    //     }
    //   }
    handleSearch = () => {
        this.uniqueIDArr = []
        this.pointedItem = undefined
        this.countforTree = 0;
        //this.setState({searchedTreeData: undefined})
    }
    search = (items, term) => {
        return items.reduce((acc, item) => {
            if (this.contains(item.text, term)) {
                this.uniqueIDArr.push(item.id);
                acc.push(item);
            } else if (item.items && item.items.length > 0) {
                let newItems = this.search(item.items, term);
                if (newItems && newItems.length > 0) {
                    acc.push({
                        ...item, text: item.text, items: newItems, expanded: acc.length === 0 ?
                            true : false//item.expanded

                    });
                }
            }
            return acc;
        }, []);
    }

    handlenavigation = (e, direction) => {
        if (e.key === 'Enter' || e.type === 'click') {
            let value = document.querySelector('.k-textbox').value
            if (value !== "") {

                if (direction === 'up') {
                    //Navigate up
                    this.countforTree--;
                    if (this.countforTree <= 0) {
                        this.countforTree = 0;

                    }
                } else {
                    //if(direction==='down'){
                    //Navigate down
                    this.countforTree++;
                    if (this.countforTree >= this.uniqueIDArr.length) {
                        if ((this.uniqueIDArr.length - 1) === -1) {
                            this.countforTree = 0;
                        } else {
                            this.countforTree = this.uniqueIDArr.length - 1;
                        }

                        //toast.info(this.props.intl.formatMessage({ id: "IDS_NOMORENODESTOSEARCH" }))
                    }
                }

                let newData = this.navigateSearchedTree(this.state.treeDataView, value)


                this.setState({ searchedTreeData: JSON.parse(JSON.stringify(newData)) })
            }
            else {
                this.setState({ searchedTreeData: undefined })
            }
        }
    }

    navigateSearchedTree = (items, term) => {
        return items.reduce((acc, item) => {
            if (item.editable) {
                item.editable = false
            }
            if (item.selected) {
                item.selected = false
            }
            if (this.contains(item.text, term)) {

                if (!this.uniqueIDArr.includes(item.id)) {
                    this.uniqueIDArr.push(item.id);
                }
                if (item.id === this.uniqueIDArr[this.countforTree]) {
                    if (this.pointedItem) {
                        this.pointedItem = undefined;
                    }
                    this.pointedItem = item;
                }

                if (item.items && item.items.length > 0) {
                    let newItems = this.navigateSearchedTree(item.items, term);
                    if (newItems && newItems.length > 0) {
                        if (newItems.some(item => item.id === this.uniqueIDArr[this.countforTree])) {
                            acc.push({ ...item, text: item.text, items: newItems, expanded: true });
                        } else {
                            acc.push({
                                ...item, text: item.text, items: newItems, expanded:
                                    newItems.some(item => item.expanded === true) ? true : false
                            });
                        }

                    } else {
                        acc.push(item);
                    }
                } else {
                    acc.push(item);
                }
            }
            else if (item.items && item.items.length > 0) {
                let newItems = this.navigateSearchedTree(item.items, term);
                if (newItems && newItems.length > 0) {
                    if (newItems.some(item => item.id === this.uniqueIDArr[this.countforTree])) {
                        acc.push({ ...item, text: item.text, items: newItems, expanded: true });
                    } else {
                        acc.push({
                            ...item, text: item.text, items: newItems, expanded:
                                newItems.some(item => item.expanded === true) ? true : false
                        });
                    }

                }
            }
            return acc;
        }, []);
    }
    // navigateSearchedTree = (items, term) => {
    //     return items.reduce((acc, item) => {
    //         if (item.editable) {
    //             item.editable = false
    //         }
    //         if (item.selected) {
    //             item.selected = false
    //         }
    //         if (this.contains(item.text, term)) {

    //             if (!this.uniqueIDArr.includes(item.id)) {
    //                 this.uniqueIDArr.push(item.id);
    //             }
    //             if (item.id === this.uniqueIDArr[this.countforTree]) {
    //                 if (this.pointedItem) {
    //                     this.pointedItem = undefined;
    //                 }
    //                 this.pointedItem = item;
    //             }
    //             acc.push(item);
    //         } else if (item.items && item.items.length > 0) {
    //             let newItems = this.navigateSearchedTree(item.items, term);
    //             if (newItems && newItems.length > 0) {
    //                 if (newItems.some(item => item.id === this.uniqueIDArr[this.countforTree])) {
    //                     acc.push({ ...item, text: item.text, items: newItems, expanded: true });
    //                 } else {
    //                     acc.push({
    //                         ...item, text: item.text, items: newItems, expanded:
    //                             newItems.some(item => item.expanded === true) ? true : false
    //                     });
    //                 }

    //             }
    //         }
    //         return acc;
    //     }, []);
    // }

    contains = (text, term) => {
        return text.toLowerCase().indexOf(term.toLowerCase()) >= 0;
    }
    onExpandChange = (event) => {
        let clickedItem = event.item
        if (!event.item.expanded) {
            //this.onItemClick(event)
            let ParentItem = this.searchClickedItemParent(//this.state.searchedTreeData&&
                //this.state.searchedTreeData[0]||
                this.state.treeData[0], clickedItem)
            if (ParentItem) {
                ParentItem.items.map(item => {
                    item.expanded = false;
                });
            }
            this.shrinkNodes(event.item);
        }
        event.item.expanded = !event.item.expanded;

        this.forceUpdate();
    };

    itemRenderView = (clickedItem) => {
        let item = clickedItem.item;
        this.getitemPath = { ...this.getitemPath, [item.id]: clickedItem.itemHierarchicalIndex }


        if (!this.state.toggleActionView) {
            return (
                <>
                    {clickedItem.item ? (
                        <>

                            <span className='d-flex align-items-center'>
                                {this.pointedItem ? (item.id === this.pointedItem.id) && !item.selected ?
                                    <>
                                        <input type="text" className='hidden-treeview-focus' id='selected-tree-point' />
                                    </> :
                                    <></> : ''
                                }
                                <span className={`normal-node text-truncate
                                ${this.pointedItem ? (item.id === this.pointedItem.id) && !item.selected ? "pointed-node" : item.selected ? "active-node" : "" :
                                        item.selected ? "active-node" : ""}
                                ${item.expanded ? "expand-node" : "collapse-node"}
                                `} data-tooltip-id="my-tooltip" data-tooltip-content={item.text}>
                                    {item.containerfirstnode ? <FontAwesomeIcon icon={faBoxOpen} /> :
                                        item.locationlastnode ? <FontAwesomeIcon icon={faLocationArrow} /> :
                                            item.containerlastnode ? <FontAwesomeIcon icon={faBox} /> :
                                                item.expanded ? <FontAwesomeIcon icon={faFolderOpen} /> : <FontAwesomeIcon icon={faFolder} />}
                                    {item.text}
                                </span>
                                {/* <ul className="list-inline mb-0">
                                <li className="list-inline-item mr-3">{clickedItem.item.text}</li> */}
                                {this.pointedItem && item.id === this.pointedItem.id ?
                                    <FontAwesomeIcon icon={faHandPointLeft} bounce
                                    />
                                    :
                                    clickedItem.item.editable ?
                                        (
                                            <>
                                                {/* <span
                                        className="action-icon tree-toggle m-l-half"
                                        data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_PROPERTIES" })}
                                        onClick={(e) => this.setProperties(e, clickedItem)}
                                    ></span>  */}
                                            </>
                                        )
                                        : null
                                }
                                {/* </ul> */}
                            </span>
                        </>
                    ) : (
                        ""
                    )}
                </>
            );
        }
    };

    onItemClickView = (event) => {
        // if (this.state.selectedItem) {
        //     let selectedobj = this.state.selectedItem;
        //         selectedobj.selected = false
        //     this.setState({
        //         selectedItem : selectedobj
        //     })
        // }
        // this.setState({
        //     selectedItem : event.item
        // })             
        let searchedData = undefined;
        if (this.state.searchedTreeData) {
            searchedData = mapTree(this.state.searchedTreeData, "items", (item) => {
                if (item.editable === true) {
                    item.editable = false;
                } else if (item.id === event.item.id) {
                    item.editable = true;
                    if (this.pointedItem) {
                        if (this.pointedItem.id === item.id) {
                            this.pointedItem = undefined
                        }
                    }
                    let result = this.state.searchedTreeData;
                    const indices =
                        event.itemHierarchicalIndex.split('_').map(index => Number(index));
                    let itemText = "";

                    for (let i = 0; i < indices.length; i++) {
                        if (i === 0) {
                            result = result[0];
                        } else {
                            result = result.items[indices[i]];
                        }
                        itemText = i > 0 ? itemText + " > " + result.text : result.text;
                    }
                    item.itemhierarchy = itemText;
                }
                return item;
            });

            searchedData.map((data) => {
                this.clearSelected(data, event.item)
            })
        }
        let newData = mapTree(this.state.treeDataView, "items", (item) => {
            if (item.editable === true) {
                item.editable = false;
            } else if (item.id === event.item.id) {
                item.editable = true;

                let result = this.state.treeDataView;
                const indices =
                    event.itemHierarchicalIndex.split('_').map(index => Number(index));
                let itemText = "";

                for (let i = 0; i < indices.length; i++) {
                    if (i === 0) {
                        result = result[0];
                    } else {
                        result = result.items[indices[i]];
                    }
                    itemText = i > 0 ? itemText + " > " + result.text : result.text;
                }
                item.itemhierarchy = itemText;
            }
            return item;
        });
        newData.map((data) => {
            this.clearSelected(data, event.item)
        })


        this.setState({ treeDataView: newData, searchedTreeData: searchedData });
    };
    clearSelected(innerObj, selectedItem) {
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
    onExpandChangeView = (event) => {

        let clickedItem = event.item
        if (!event.item.expanded) {
            //this.onItemClick(event)
            let ParentItem = this.searchClickedItemParent(this.state.searchedTreeData &&
                this.state.searchedTreeData[0] || this.state.treeDataView[0], clickedItem)
            if (ParentItem) {
                ParentItem.items.map(item => {
                    item.expanded = false;
                });
            }
            this.shrinkNodes(event.item);
        }

        event.item.expanded = !event.item.expanded;
        this.forceUpdate();
    };
    setProperties = (event, clickedItem) => {
        const editId = this.state.controlMap.has("Edit SampleStorageLocation") && this.state.controlMap.get("Edit SampleStorageLocation").ncontrolcode;
        //this.props.openPropertyModal(this.props.Login.masterData.selectedSampleStorageVersion, this.props.Login.userInfo, clickedItem, editId);
        this.openPropertyModal(clickedItem, editId);

    };

    openPropertyModal(clickedItem, editId) {
        let selectedRecord = this.state.selectedRecord || {};
        selectedRecord["locationlastnode"] = clickedItem.item.locationlastnode === undefined ? false :
            clickedItem.item.locationlastnode;
        selectedRecord["containerfirstnode"] = clickedItem.item.containerfirstnode === undefined ? false :
            clickedItem.item.containerfirstnode;
        selectedRecord["containerlastnode"] = clickedItem.item.containerlastnode === undefined ? false :
            clickedItem.item.containerlastnode;
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                selectedRecord, loadTreeProperties: true,
                clickedItem, loading: false
            }
        }
        this.props.updateStore(updateInfo);
    }

    handleChange = (e, clickedItem) => {
        let searchedData = undefined;
        if (this.state.searchedTreeData) {
            searchedData = mapTree(this.state.searchedTreeData, "items", (item) => {
                if (item.id === clickedItem.id) {
                    item.text = e.target.value;
                }
                return item;
            });
        }
        let newData = mapTree(this.state.treeData, "items", (item) => {
            if (item.id === clickedItem.id) {
                item.text = e.target.value;
            }
            return item;
        });
        this.setState({ treeData: newData, searchedTreeData: searchedData });
    };
    //generate Path for edited item 
    generatePathForEditedItem(ParentItem, indices) {
        if (ParentItem.items && ParentItem.items.length > 0) {
            let childArray = ParentItem.items;
            if (childArray.length > 0) {
                for (var i = 0; i < childArray.length; i++) {
                    let childData = childArray[i];
                    let result = this.state.treeData;
                    indices.push(i);
                    let itemText = "";
                    for (let i = 0; i < indices.length; i++) {
                        if (i === 0) {
                            result = result[0];
                        } else {
                            result = result.items[indices[i]];
                        }
                        itemText = i > 0 ? itemText + " > " + result.text : result.text;
                    }
                    childData.itemhierarchy = itemText;

                    if (childData.items) {
                        this.generatePathForEditedItem(childData, indices)
                    }
                    indices.pop();
                }
            }
        } else {
            let result = this.state.treeData;
            let itemText = "";
            for (let i = 0; i < indices.length; i++) {
                if (i === 0) {
                    result = result[0];
                } else {
                    result = result.items[indices[i]];
                }
                itemText = i > 0 ? itemText + " > " + result.text : result.text;
            }
            ParentItem.itemhierarchy = itemText;
        }
    }

    handleBlur = (e, clickedItem, itemHierarchicalIndex) => {
        clickedItem.editable = false;
        //Added for creating path after edit 
        const indices = itemHierarchicalIndex.split('_').map(index => Number(index));
        this.generatePathForEditedItem(clickedItem, indices);
        this.setState({ toggleAction: !this.state.toggleAction });
    };

    onSaveClick = (saveType, formRef) => {
        if (this.props.Login.loadTreeProperties === true) {
            this.onSaveProperties(saveType, formRef);
        } else if (this.props.Login.operation === "create" || this.props.Login.operation === "update") {
            this.onSaveSampleStorageLocation(saveType, formRef);
        } else if (this.props.Login.operation === "addinfo") {
            this.onSaveAdditionalInformation(saveType, formRef);
        }
    };
    onSaveProperties = (saveType, formRef) => {

        const { selectedRecord } = this.state;
        // if (this.props.Login.masterData.selectedSampleStorageVersion.napprovalstatus === transactionStatus.DRAFT) {
        if (this.props.Login.clickedItem && this.props.Login.clickedItem !== undefined) {
            let inputData = [];
            let jsondata = {}
            let postParam = undefined;
            let count = 0;
            if (selectedRecord["locationlastnode"] !== undefined && selectedRecord["locationlastnode"] === true) {
                count = count + 1;
            }
            if (selectedRecord["containerfirstnode"] !== undefined && selectedRecord["containerfirstnode"] === true) {
                count = count + 1;
            }
            if (selectedRecord["containerlastnode"] !== undefined && selectedRecord["containerlastnode"] === true) {
                count = count + 1;
            }
            if (count > 1) {
                toast.info(this.props.intl.formatMessage({ id: "IDS_SELECTONLYONE" }));
            } else {
                let haschild = false;
                let newData = mapTree(this.state.treeData, "items", (item) => {
                    if (item.id === this.props.Login.clickedItem.item.id) {
                        if (item.hasOwnProperty('items') && item.items !== undefined && selectedRecord["containerlastnode"] === true) {
                            haschild = true;
                        } else {
                            item.locationlastnode = selectedRecord["locationlastnode"] !== undefined ? selectedRecord["locationlastnode"] : false;
                            item.containerfirstnode = selectedRecord["containerfirstnode"] !== undefined ? selectedRecord["containerfirstnode"] : false;
                            item.containerlastnode = selectedRecord["containerlastnode"] !== undefined ? selectedRecord["containerlastnode"] : false;
                        }
                    }
                    if (item.selected && item.selected === true) {
                        item.selected = false;
                    }
                    return item;
                });
                if (haschild === true) {
                    toast.info(this.props.intl.formatMessage({ id: "IDS_STORAGELOCATIONENDCANNOTHAVECHILDNODE" })

                    );
                } else {
                    const updateInfo = {
                        typeName: DEFAULT_RETURN,
                        data: {
                            treeData: newData,
                            selectedRecord, loadTreeProperties: false,
                            loading: false
                        }
                    }
                    this.props.updateStore(updateInfo)
                }
            }
        }
        // } else {
        //     toast.info(this.props.intl.formatMessage({ id: "IDS_SELECTDRAFTRECORD" }));
        // }
    }
    onSaveSampleStorageLocation = (saveType, formRef) => {

        const { selectedRecord } = this.state;

        // if (selectedRecord["nstoragecategorycode"] && selectedRecord["nstoragecategorycode"] !== undefined) {
        //     if (selectedRecord["ssamplestoragelocationname"] && selectedRecord["ssamplestoragelocationname"].length > 0) {

        let inputData = [];
        let jsondata = {}
        let postParam = undefined;
        let countLevels = 0;

        let newData = mapTree(this.state.treeData, "items", (item) => {
            if (item.editable === true) {
                item.editable = false;
            }
            if (item.expanded === false) {
                item.expanded = true;
            }
            item.expanded = false;
            countLevels++;
            return item;
        });

        // let lhs = JSON.parse(this.props.Login.masterData.selectedSampleStorageVersion["jsondata"].value).data;
        // let rhs = newData;

        // console.log(detailedDiff(lhs, rhs));

        // return;
        // postParam = { inputListName: "SampleStorageLocation", selectedObject: "selectedSampleStorageLocation", primaryKeyField: "nsamplestoragelocationcode" };
       
        //const ischeck=this.props.Login.settings && parseInt(this.props.Login.settings[84])!==3?selectedRecord["ssamplestoragelocationname"]:selectedRecord["sinstrumentid"];
        if (countLevels > 3) {

            //if (ischeck!==undefined) {
                //this.props.Login.settings && parseInt(this.props.Login.settings[84])!==3?selectedRecord["ssamplestoragelocationname"]:selectedRecord["sinstrumentid"].label;

                jsondata["data"] = newData;
                inputData["userinfo"] = this.props.Login.userInfo;
                inputData["sampleStorageLocation"] = { "nstatus": 1 };
                inputData["sampleStorageVersion"] = { "nstatus": 1 };

                //ATE234 Janakumar BGSI-10->Storage Structure → Instrument id & Site combo load based on Setting table.
                //inputData["sampleStorageLocation"]["ssamplestoragelocationname"] = this.props.Login.settings && parseInt(this.props.Login.settings[84]) !== 3 ? selectedRecord["ssamplestoragelocationname"] : selectedRecord["sinstrumentid"].label;
                inputData["sampleStorageLocation"]["ssamplestoragelocationname"] = selectedRecord["ssamplestoragelocationname"];
                //inputData["sampleStorageLocation"]["ninstrumentcode"] = this.props.Login.settings && parseInt(this.props.Login.settings[84]) === 3 ? selectedRecord["sinstrumentid"].value : -1;
                inputData["sampleStorageLocation"]["nstoragecategorycode"] = selectedRecord["nstoragecategorycode"].value;
                inputData["sampleStorageLocation"]["nmastersitecode"] = this.props.Login.settings && parseInt(this.props.Login.settings[84]) !== 3 ? selectedRecord["ssitename"].value : this.props.Login.userInfo.nmastersitecode;


                if (this.props.Login.operation === "create") {
                    inputData["sampleStorageLocation"]["nproductcode"] = selectedRecord["nproductcode"] && selectedRecord["nproductcode"].value ?
                        selectedRecord["nproductcode"].value : -1;
                    inputData["sampleStorageLocation"]["nprojecttypecode"] = selectedRecord["nprojecttypecode"] && selectedRecord["nprojecttypecode"].value ?
                        selectedRecord["nprojecttypecode"].value : -1;
                    inputData["sampleStorageLocation"]["nquantity"] = selectedRecord['nquantity'] ? parseInt(selectedRecord['nquantity']) : 0;
                    inputData["sampleStorageLocation"]["nunitcode"] = selectedRecord['nunitcode'] ? parseInt(selectedRecord['nunitcode']) : -1;

                    // inputData["sampleStorageLocation"]["nneedautomapping"] = selectedRecord["nneedautomapping"] ? 3 : 4;
                    inputData["sampleStorageLocation"]["nneedautomapping"] = transactionStatus.YES;
                    inputData["sampleStorageLocation"] = selectedRecord['nneedposition'] === true ?
                        {
                            ...inputData["sampleStorageLocation"],
                            ncontainertypecode: selectedRecord['ncontainertypecode'].value ? selectedRecord['ncontainertypecode'].value : -1,
                            ndirectionmastercode: selectedRecord['ndirectionmastercode'].value,
                            nneedposition: 3,
                            ncontainerstructurecode: selectedRecord['ncontainerstructurecode'].value ? selectedRecord['ncontainerstructurecode'].value : -1,
                            nnoofcontainer: selectedRecord['nnoofcontainer'] ? parseInt(selectedRecord['nnoofcontainer']) : 1,
                            nrow: selectedRecord['nrow'],
                            ncolumn: selectedRecord['ncolumn']

                        } : {
                            ...inputData["sampleStorageLocation"],
                            ncontainertypecode: -1,
                            ndirectionmastercode: 1,
                            nneedposition: 4,
                            ncontainerstructurecode: -1, nnoofcontainer: selectedRecord['nnoofcontainer'] ? parseInt(selectedRecord['nnoofcontainer']) : 1,
                            //ALPD-3353
                            nrow: selectedRecord['nrow'] === undefined || selectedRecord['nrow'] === 0 ? 1 : selectedRecord['nrow'],
                            ncolumn: selectedRecord['ncolumn'] === undefined || selectedRecord['ncolumn'] === 0 ? 1 : selectedRecord['ncolumn']
                        }

                }





                //ALPD-4493-Vignesh R(20-07-2024)--storage structure->approved records also edited after copy the version.
                inputData["sampleStorageVersion"]["jsondata"] = {
                    ...jsondata
                }
                //ALPD-4734-Vignesh R(28-10-2024)--storage structure-->while edit the record, Feilds became empty.

                if (this.props.Login.operation === "create") {
                    inputData["sampleStorageVersion"]["jsondata"] = {
                        ...inputData["sampleStorageVersion"]["jsondata"],
                        "additionalinfo": {
                            ...inputData["sampleStorageLocation"],
                            "sstoragecategoryname": this.props.Login.masterData.selectedStorageCategory.sstoragecategoryname ? this.props.Login.masterData.selectedStorageCategory.sstoragecategoryname : 'NA',

                        }
                    }
                }
                else if (this.props.Login.operation === "update") {
                    inputData["sampleStorageVersion"]["jsondata"] = {
                        ...inputData["sampleStorageVersion"]["jsondata"],
                        "additionalinfo": {
                            ...this.props.Login.masterData.selectedSampleStorageVersion,
                            ...inputData["sampleStorageLocation"],
                            "nstoragecategorycode": selectedRecord["nstoragecategorycode"] ? selectedRecord["nstoragecategorycode"].value : -1,
                            "sstoragecategoryname": selectedRecord["nstoragecategorycode"] ? selectedRecord["nstoragecategorycode"].label : 'NA',

                        }
                    }
                }
                if (this.props.Login.operation === "create") {
                    const inputParam = {
                        classUrl: "samplestoragelocation",
                        methodUrl: "SampleStorageLocation",
                        displayName: this.props.Login.inputParam.displayName,
                        inputData: inputData, searchRef: this.searchRef,
                        operation: "create", saveType, formRef
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
                        this.props.crudMaster(inputParam, this.props.Login.masterData, "openModal");
                        // }
                        // this.props.crudSampleStorageLocation(inputParam, this.props.Login.masterData);
                    }
                } else {

                    postParam = {
                        inputListName: "sampleStorageLocation",
                        selectedObject: "selectedSampleStorageLocation",
                        primaryKeyField: "nsamplestoragelocationcode"
                    };
                    inputData["sampleStorageLocation"]["nsamplestoragelocationcode"] = this.props.Login.masterData.selectedSampleStorageLocation["nsamplestoragelocationcode"]
                    inputData["sampleStorageLocation"]["ncontainerstructurecode"] = this.props.Login.masterData.selectedSampleStorageLocation["ncontainerstructurecode"]
                    inputData["sampleStorageLocation"]["nneedautomapping"] = this.props.Login.masterData.selectedSampleStorageLocation["nneedautomapping"]
                    

                    // inputData["sampleStorageLocation"]["nprojecttypecode"] = selectedRecord["nprojecttypecode"].value
                    // inputData["sampleStorageLocation"]["nproductcode"] = selectedRecord["nproductcode"].value

                    inputData["sampleStorageVersion"]["nsamplestorageversioncode"] = this.props.Login.masterData.selectedSampleStorageVersion["nsamplestorageversioncode"]
                    inputData["sampleStorageVersion"]["napprovalstatus"] = this.props.Login.masterData.selectedSampleStorageVersion["napprovalstatus"]

                    const inputParam = {
                        classUrl: "samplestoragelocation",
                        methodUrl: "SampleStorageLocation",
                        displayName: this.props.Login.inputParam.displayName,
                        inputData: inputData, searchRef: this.searchRef, postParam,
                        operation: "update", saveType, formRef
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
                    } else {
                        this.props.crudMaster(inputParam, this.props.Login.masterData, "openModal");
                        // this.props.crudSampleStorageLocation(inputParam, this.props.Login.masterData);
                    }

                }
            // } else {
            //     //Ate234 Janakumar ALPDJ21-25 Flow Testing Bugs - Site Hospital Mapping
            //     this.props.Login.settings && parseInt(this.props.Login.settings[84])!==3?
            //     toast.info(this.props.intl.formatMessage({ id: "IDS_STORAGESTRUCTURENAME" })):toast.info(this.props.intl.formatMessage({ id: "IDS_INSTRUMENTID" }));
            // }
            } else {
            toast.info(this.props.intl.formatMessage({ id: "IDS_CREATEATLEASTFOURLEVELS" }));
        }

    }

    onSaveAdditionalInformation = (saveType, formRef) => {
        let postParam = undefined;
        postParam = {
            inputListName: "sampleStorageLocation",
            selectedObject: "selectedSampleStorageLocation",
            primaryKeyField: "nsamplestoragelocationcode"
        };
        const { selectedRecord } = this.state;
        let inputData = [];
        let jsondata = {};
        inputData["sampleStorageLocation"] = { "nstatus": 1 };
        inputData["sampleStorageVersion"] = { "nstatus": 1 };
        inputData["sampleStorageVersion"]["nsamplestorageversioncode"] = this.props.Login.masterData.selectedSampleStorageVersion["nsamplestorageversioncode"];
        inputData["userinfo"] = this.props.Login.userInfo;
        inputData["sampleStorageLocation"]["nsamplestoragelocationcode"] = this.props.Login.masterData.selectedSampleStorageLocation["nsamplestoragelocationcode"]
        inputData["sampleStorageVersion"]["nsamplestoragelocationcode"] = this.props.Login.masterData.selectedSampleStorageVersion["nsamplestorageversioncode"]
        inputData["sampleStorageLocation"]["nprojecttypecode"] = selectedRecord["nprojecttypecode"] && selectedRecord["nprojecttypecode"].value ? selectedRecord["nprojecttypecode"].value : -1;
        inputData["sampleStorageLocation"]["nunitcode"] = selectedRecord["nunitcode"] && selectedRecord["nunitcode"].value ? selectedRecord["nunitcode"].value : -1;
        inputData["sampleStorageLocation"]["nquantity"] = selectedRecord["nquantity"] && selectedRecord["nquantity"] ? parseFloat(selectedRecord["nquantity"]) : 0;
        inputData["sampleStorageLocation"]["nproductcode"] = selectedRecord["nproductcode"] && selectedRecord["nproductcode"].value ? selectedRecord["nproductcode"].value : -1;
        inputData["sampleStorageLocation"]["nneedautomapping"] = selectedRecord["nneedautomapping"] ? 3 : 4;
        inputData["sampleStorageLocation"]["nstoragecategorycode"] = this.props.Login.masterData.selectedStorageCategory.nstoragecategorycode ? this.props.Login.masterData.selectedStorageCategory.nstoragecategorycode : 0;







        inputData["sampleStorageLocation"] = selectedRecord['nneedposition'] === true ?
            {
                ...inputData["sampleStorageLocation"],
                ncontainertypecode: selectedRecord['ncontainertypecode'].value ? selectedRecord['ncontainertypecode'].value : -1,
                ndirectionmastercode: selectedRecord['ndirectionmastercode'].value,
                nneedposition: 3,
                ncontainerstructurecode: selectedRecord['ncontainerstructurecode'].value ? selectedRecord['ncontainerstructurecode'].value : -1,
                // nquantity: selectedRecord['nquantity'] ? parseInt(selectedRecord['nquantity']) : 1,
                nnoofcontainer: selectedRecord['nnoofcontainer'] ? parseInt(selectedRecord['nnoofcontainer']) : 1,
                nrow: selectedRecord['nrow'],
                ncolumn: selectedRecord['ncolumn']

            } : {
                ...inputData["sampleStorageLocation"],
                ncontainertypecode: -1,
                ndirectionmastercode: 1,
                nneedposition: 4,
                ncontainerstructurecode: -1,
                // nquantity: selectedRecord['nquantity'] ?  parseInt(selectedRecord['nquantity']) : 1,
                nnoofcontainer: selectedRecord['nnoofcontainer'] ? parseInt(selectedRecord['nnoofcontainer']) : 1,
                nrow: selectedRecord['nrow'],
                ncolumn: selectedRecord['ncolumn']
            }
        //ALPD-4493-Vignesh R(20-07-2024)--storage structure->approved records also edited after copy the version.
        jsondata = {
            ...inputData["sampleStorageLocation"],
            "sproductname": selectedRecord["nproductcode"] && selectedRecord["nproductcode"].label ?
                selectedRecord["nproductcode"].label : "-",
            "sprojecttypename": selectedRecord["nprojecttypecode"] && selectedRecord["nprojecttypecode"].label ?
                selectedRecord["nprojecttypecode"].label : 'NA',
            "scontainertype": selectedRecord['ncontainertypecode'] && selectedRecord["ncontainertypecode"].label ?
                selectedRecord["ncontainertypecode"].label : 'NA',
            "sdirection": selectedRecord['ndirectionmastercode'] && selectedRecord["ndirectionmastercode"].label ?
                selectedRecord["ndirectionmastercode"].label : 'NA',
            "scontainerstructurename": selectedRecord['ncontainerstructurecode'] && selectedRecord["ncontainerstructurecode"].label ?
                selectedRecord["ncontainerstructurecode"].label : 'NA',
            "sstoragecategoryname": this.props.Login.masterData.selectedStorageCategory.sstoragecategoryname ? this.props.Login.masterData.selectedStorageCategory.sstoragecategoryname : 'NA',
            "sunitname": selectedRecord["nunitcode"] && selectedRecord["nunitcode"].label ? selectedRecord["nunitcode"].label : "NA"
        }

        inputData["sampleStorageVersion"]["jsondata"] = jsondata;
        const inputParam = {
            classUrl: "samplestoragelocation",
            methodUrl: "SampleStorageLocation",
            displayName: this.props.Login.inputParam.displayName,
            inputData: inputData, searchRef: this.searchRef, postParam,
            operation: "addinfo", saveType, formRef
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
        } else {
            this.props.crudMaster(inputParam, this.props.Login.masterData, "openModal");
        }



    }

    deleteSampleStorageLocation = (ncontrolCode) => {
        this.handleSearch();
        this.setState({ searchedTreeData: undefined })
        // if (this.searchRef.current) {
        //     this.searchRef.current.value = "";
        // }

        const postParam = {
            inputListName: "sampleStorageLocation", selectedObject: "selectedSampleStorageLocation",
            primaryKeyField: "nsamplestoragelocationcode",
            primaryKeyValue: this.props.Login.masterData.selectedSampleStorageLocation["nsamplestoragelocationcode"],
            fetchUrl: "samplestoragelocation/getSelectedSampleStorageLocation",
            fecthInputObject: {
                userinfo: this.props.Login.userInfo
            },
            unchangeList: []
        }
        let inputData = [];
        inputData["sampleStorageVersion"] = {};
        inputData["sampleStorageLocation"] = {};

        inputData["sampleStorageVersion"]["nsamplestoragelocationcode"] = this.props.Login.masterData.selectedSampleStorageVersion["nsamplestoragelocationcode"]
        inputData["sampleStorageVersion"]["nsamplestorageversioncode"] = this.props.Login.masterData.selectedSampleStorageVersion["nsamplestorageversioncode"]
        inputData["sampleStorageVersion"]["napprovalstatus"] = this.props.Login.masterData.selectedSampleStorageVersion["napprovalstatus"]

        inputData["userinfo"] = this.props.Login.userInfo;
        inputData["sampleStorageLocation"]["nstoragecategorycode"] = this.props.Login.masterData.selectedSampleStorageVersion["nstoragecategorycode"]
        inputData["sampleStorageLocation"]["nsamplestoragelocationcode"] = this.props.Login.masterData.selectedSampleStorageVersion["nstoragecategorycode"]
        inputData["sampleStorageLocation"]["ssamplestoragelocationname"] = this.props.Login.masterData.selectedSampleStorageLocation["ssamplestoragelocationname"]

        const inputParam = {
            methodUrl: "SampleStorageLocation",
            classUrl: "samplestoragelocation",
            inputData: inputData, postParam,
            operation: "delete",//searchRef: this.searchRef
        }
        const masterData = this.props.Login.masterData;
        // this.props.crudSampleStorageLocation(inputParam, this.props.Login.masterData);
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
    confirmDelete = (ncontrolCode) => {
        this.confirmMessage.confirm("deleteMessage",
            this.props.intl.formatMessage({ id: "IDS_DELETE" }),
            this.props.intl.formatMessage({ id: "IDS_DEFAULTCONFIRMMSG" }),
            this.props.intl.formatMessage({ id: "IDS_OK" }),
            this.props.intl.formatMessage({ id: "IDS_CANCEL" }),
            () => this.deleteSampleStorageLocation(ncontrolCode));
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
    getSampleStorageLocation(inputData, fieldName, comboData) {
        let selectedRecordFilter = this.props.selectedRecordFilter || {};
        let inputParamData = {}
        this.setState({ loading: true })
        if (fieldName === 'nsamplestoragelocationcode') {
            inputParamData = {
                nstoragecategorycode: selectedRecordFilter['nstoragecategorycode'].value,
                nsamplestoragelocationcode: comboData.value,
                userinfo: this.props.Login.userInfo
            }
        } else {
            inputParamData = {
                nstoragecategorycode: comboData.value,
                userinfo: this.props.Login.userInfo
            }
        }
        //ATE234 Janakumar BGSI-10->Storage Structure → Instrument id & Site combo load based on Setting table.
        let urlArray = [];
        const url1 = rsapi().post("samplestoragemapping/getsamplestoragemapping", inputParamData);
        //const url2 = rsapi().post("samplestoragelocation/getinstrumentID", inputParamData);
        //const url3 = rsapi().post("samplestoragelocation/getsite", inputParamData);

        urlArray = [url1];//, url3];
        if(this.props.Login.settings && this.props.Login.settings[84] &&
                     parseInt(this.props.Login.settings[84]) === transactionStatus.NO){
            urlArray.push(rsapi.post("site/getsite", inputParamData));
         }
        Axios.all(urlArray)
            .then(response => {
                let { storageLocationOptions, sampleStorageVersionOptions, SiteList } = this.state

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

                //comment by vignesh(23-07-2025)-->There is no need to fetch Instrument ID.
                /*
                //ATE234 Janakumar BGSI-10->Storage Structure → Instrument id & Site combo load based on Setting table.
                let sampleStorageInstrumentList = constructOptionList(response[1].data || [], "ninstrumentcode",
                    "sinstrumentid", undefined, undefined, undefined);
                InstrumentList = sampleStorageInstrumentList.get("OptionList");*/

                 if(this.props.Login.settings && this.props.Login.settings[84] &&
                     parseInt(this.props.Login.settings[84]) === transactionStatus.NO)
                {
                    SiteList = constructOptionList(response[1].data || [], "nsitecode",
                        "ssitename", undefined, undefined, undefined);
                    SiteList = SiteList.get("OptionList");
                }


                this.setState({
                    storageLocationOptions, sampleStorageVersionOptions, //InstrumentList,
                    selectedRecordFilter: {
                        ...selectedRecordFilter,
                        [fieldName]: comboData
                    },
                    loading: false,SiteList:[]
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
    calculateRowColumn = (Row, column) => {
        let nnoofcontainer = Row * column;
        return nnoofcontainer;
    }
    getContainerStructure(inputData, fieldName, comboData) {
        let inputParamData = {}
        this.setState({ loading: true })
        inputParamData = {
            ncontainertypecode: comboData.value,
            userinfo: inputData.userInfo
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
                    nnoofcontainer: selectedRecord["nneedposition"] === true ? this.calculateRowColumn(containerStructureOptions[0].item.nrow,
                        containerStructureOptions[0].item.ncolumn) : 1,
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
    onComboChange = (comboData, fieldName, caseNo) => {
        const selectedRecord = this.state.selectedRecord || {};
        if (caseNo === 3) {

            let nfilterStorageCategory = this.state.nfilterStorageCategory || {}
            nfilterStorageCategory = comboData;
            if (this.searchRef.current) {
                this.searchRef.current.value = "";
            }

            this.setState({ nfilterStorageCategory })

        } else {
            if (fieldName === 'nstoragecategorycode') {
                //ALPDJ21-23
			//Storage Category, Instrument Category and Storage Structure Screens mapping enhancements
            //start
                if(this.props.Login.settings && this.props.Login.settings[84] &&
                     parseInt(this.props.Login.settings[84])===transactionStatus.YES){
                this.getSampleStorageLocation({
                    userinfo: this.props.Login.userInfo,
                    nstoragecategorycode: comboData.value
                }, fieldName, comboData);
              //  selectedRecord['sinstrumentid']="";
               // selectedRecord['sregionalsitename']="";
            }
            //end
            } else if (fieldName === 'ncontainertypecode') {
                this.getContainerStructure({
                    userInfo: this.props.Login.userInfo,
                    ncontainertypecode: comboData.value
                }, fieldName, comboData);

            } else if (fieldName === 'ncontainerstructurecode') {
                selectedRecord['nrow'] = comboData.item.nrow ? comboData.item.nrow : 1;
                selectedRecord['ncolumn'] = comboData.item.ncolumn ? comboData.item.ncolumn : 1;
                selectedRecord['nnoofcontainer'] = selectedRecord["nneedposition"] === true ? this.calculateRowColumn(selectedRecord['nrow'],
                    selectedRecord['ncolumn']) : 1

            } else if (fieldName === 'nsamplestoragelocationcode') {
                this.getSampleStorageLocation({
                    userinfo: this.props.userInfo,
                    nstoragecategorycode: this.props.selectedRecordFilter['nstoragecategorycode'].value,
                    nsamplestoragelocationcode: comboData.value

                }, fieldName, comboData);
            } 
            
            /*else if (fieldName === 'sinstrumentid') {
                this.props.getsite({
                    userInfo: this.props.Login.userInfo,
                    nstoragecategorycode: this.state.selectedRecord.nstoragecategorycode.value,
                    ninstrumentid: comboData.value,
                    nsettingscode: this.props.Login.settings && this.props.Login.settings[84] ? parseInt(this.props.Login.settings[84]) : 4

                }, fieldName, comboData, selectedRecord);
            }*/
            selectedRecord[fieldName] = comboData;
            this.setState({ selectedRecord });
        }


    }
    componentDidMount() {
        if (this.parentHeight) {
            const height = this.parentHeight.clientHeight;
            this.setState({
                firstPane: height - 80,
                parentHeight: height - 50
            });
        }
    }
    generateBreadCrumData() {
        const breadCrumbData = [];
        if (this.props.Login.masterData && this.props.Login.masterData.filterStorageCategory) {

            breadCrumbData.push(
                {
                    "label": "IDS_STORAGECATEGORY",
                    "value": this.props.Login.masterData.selectedStorageCategoryName && this.props.Login.masterData.selectedStorageCategoryName !== null ? this.props.Login.masterData.selectedStorageCategoryName : "NA"
                    // "value": this.props.Login.masterData.selectedSampleStorageLocation ? this.props.Login.masterData.filterStorageCategory && this.props.Login.masterData.filterStorageCategory !== undefined ?
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
        this.searchRef.current.value = "";
        if (this.state.nfilterStorageCategory.value) {
            let inputParam = {
                inputData: {
                    nstoragecategorycode: this.state.nfilterStorageCategory.value,
                    userinfo: this.props.Login.userInfo,
                    nfilterStorageCategory: this.state.nfilterStorageCategory

                }
            }
            this.props.changeStorageCategoryFilter(inputParam, this.props.Login.masterData.filterStorageCategory);
        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_STORAGECATEGORYNOTAVAILABLE" }));
        }
    }

    //ALPDJ21-32--Added by Vignesh(20-08-2025)-->checks the StorageInstrument Version
    checkStorageInstrumentVersion = (ncontrolCode) => {

	//ALPDJ21-32--Added by Vignesh(30-09-2025)-->Confirmation displayed when the instrument based flow set No
        if(this.props.Login.settings[84] && parseInt(this.props.Login.settings[84])===transactionStatus.YES){

            rsapi().post("samplestoragelocation/checkStorageInstrumentVersion", {
                'userinfo':this.props.Login.userInfo,
                'nsamplestoragelocationcode': this.props.Login.masterData.selectedSampleStorageLocation["nsamplestoragelocationcode"],

            })
                .then(response => {

                    let needConfirmMessage = response.data.needConfirmMessage;

                    if (needConfirmMessage) {
                        this.confirmMessage.confirm("deleteMessage", this.props.intl.formatMessage({ id: "IDS_CONFIRMATION" }), this.props.intl.formatMessage({ id: "IDS_VERSIONUSEDSTORAGEINSTRUMENT" }),
                            this.props.intl.formatMessage({ id: "IDS_OK" }), this.props.intl.formatMessage({ id: "IDS_CANCEL" }),
                            () => this.onApproveSampleStorageLocation(ncontrolCode));
                    } else {
                        this.onApproveSampleStorageLocation(ncontrolCode);
                    }
                })
                .catch(error => {
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
                        this.setState({ loading: false });
                    } else if (error.response.status === 500) {
                        toast.error(error.message);
                        this.setState({ loading: false });
                    }
                    else {
                        toast.warn(error.response.data);
                        this.setState({ loading: false });
                    }
                })
            }
			//ALPDJ21-32--Added by Vignesh(30-09-2025)-->Confirmation displayed when the instrument based flow set No
			else{
                this.onApproveSampleStorageLocation(ncontrolCode);
            }
    }


    onApproveSampleStorageLocation = (ncontrolCode) => {
        this.handleSearch();
        this.setState({ searchedTreeData: undefined })
        // if (this.searchRef.current) {
        //     this.searchRef.current.value = "";
        // }

        const postParam = {
            inputListName: "sampleStorageLocation", selectedObject: "selectedSampleStorageLocation",
            primaryKeyField: "nsamplestoragelocationcode",
            primaryKeyValue: this.props.Login.masterData.selectedSampleStorageLocation["nsamplestoragelocationcode"],
            fetchUrl: "samplestoragelocation/getSelectedSampleStorageLocation",
            fecthInputObject: {
                userinfo: this.props.Login.userInfo
            },
        }

        let inputData = [];
        let locationEnd = false;
        let storageStart = false;
        let storageEnd = false;
        let containers = [];
        let containerpath = [];
        let containerlastnode = [];
        //BGSI-10 samplestoragecontainerpath table suid filed value updated.
        let containerid = [];
        mapTree(this.state.treeDataView
            //this.state.treeData
            , "items", (item) => {
                if (item.locationlastnode === true) {
                    locationEnd = true;
                }
                if (item.containerfirstnode === true) {
                    storageStart = true;
                    containers.push({ itemHierarchy: item.itemhierarchy, scontainercode: item.id });
                }
                if (item.containerlastnode === true) {
                    storageEnd = true;
                    containerpath.push({ scontainerpath: item.itemhierarchy });
                    containerlastnode.push(item.text);
                    //BGSI-10 samplestoragecontainerpath table suid filed value updated.
                    containerid.push(item.id);
                }
                return null;
            });
        // if (locationEnd === false) {
        //     toast.warning(this.props.intl.formatMessage({ id: "IDS_PLEASESELECTLOCATIONEND" }));
        //     return;
        // }
        // if (storageStart === false) {
        //     toast.warning(this.props.intl.formatMessage({ id: "IDS_PLEASESELECTSTORAGESTART" }));
        //     return;
        // }
        // if (storageEnd === false) {
        //     toast.warning(this.props.intl.formatMessage({ id: "IDS_PLEASESELECTSTORAGEEND" }));
        //     return;
        // }
        const masterData = this.props.Login.masterData;

        inputData["userinfo"] = this.props.Login.userInfo;
        inputData["sampleStorageLocation"] = { "nstatus": 1 };
        inputData["sampleStorageVersion"] = { "nstatus": 1 };
        inputData["containers"] = containers;
        inputData["containerpath"] = JSON.stringify(containerpath);
        inputData["containerpathsize"] = containerpath.length;
        inputData["containerlastnode"] = JSON.stringify(containerlastnode);
        //BGSI-10 samplestoragecontainerpath table suid filed value updated.
        inputData["containerid"] = JSON.stringify(containerid);
        inputData["propertyValidation"] = { "locationEnd": locationEnd, "storageStart": storageStart, "storageEnd": storageEnd };
        inputData["sampleStorageVersion"]["napprovalstatus"] = masterData.selectedSampleStorageVersion["napprovalstatus"];
        inputData["sampleStorageVersion"]["nsamplestorageversioncode"] = masterData.selectedSampleStorageVersion["nsamplestorageversioncode"];
        inputData["sampleStorageVersion"]["nsamplestoragelocationcode"] = masterData.selectedSampleStorageVersion["nsamplestoragelocationcode"];

        inputData["sampleStorageLocation"]["nstoragecategorycode"] = masterData.selectedSampleStorageVersion["nstoragecategorycode"];
        inputData["sampleStorageLocation"]["nsamplestoragelocationcode"] = masterData.selectedSampleStorageVersion["nsamplestoragelocationcode"];
        inputData["selectedSampleStorageLocation"] = masterData.selectedSampleStorageLocation;
        inputData["nprojecttypecode"] =masterData.selectedSampleStorageLocation.nprojecttypecode;

        const inputParam = {
            inputData: inputData,
            classUrl: "samplestoragelocation",
            methodUrl: "SampleStorageLocation",
            displayName: "IDS_STORAGESTRUCTURE",
            userInfo: this.props.Login.userInfo, operation: "Approve", postParam, searchRef: this.searchRef,
            selectedRecord: { ...this.state.selectedRecord }
        };

        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, ncontrolCode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData }, openModal: true, operation: "Approve",
                    screenName: this.props.Login.inputParam.displayName
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            // this.props.approveSampleStorageLocation(this.props.Login.userInfo, this.props.Login.masterData);
            this.props.crudMaster(inputParam, this.props.Login.masterData, "openModal");
        }
    }
    viewAdditionalInfo = () => {
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                isView: true,
                openModal: true
            }
        }
        this.props.updateStore(updateInfo);
    }

    additionalInformation = (selectedSampleStorageVersion, userInfo, addInfoId) => {

        this.handleSearch();
        this.setState({ searchedTreeData: undefined })
        // if (this.searchRef.current) {
        //     this.searchRef.current.value = "";
        // }

        let isOnlyDraft = false;
        if (this.props.Login.masterData.sampleStorageVersion && this.props.Login.masterData.sampleStorageVersion.length > 1) {
            isOnlyDraft = true;
        }
        this.props.additionalInformationData(selectedSampleStorageVersion, userInfo, isOnlyDraft, addInfoId);

    }


    importdata = () => {
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                screenName: 'IDS_IMPORT',
                openModal: true
            }
        }
        this.props.updateStore(updateInfo);
    }
    copySampleStorageversion = (ncontrolCode) => {
        this.handleSearch();
        this.setState({ searchedTreeData: undefined })
        // if (this.searchRef.current) {
        //     this.searchRef.current.value = "";
        // }
        let postParam = undefined;
        postParam = {
            inputListName: "sampleStorageLocation", selectedObject: "selectedSampleStorageLocation",
            primaryKeyField: "nsamplestoragelocationcode",
            primaryKeyValue: this.props.Login.masterData.selectedSampleStorageLocation["nsamplestoragelocationcode"],
            fetchUrl: "samplestoragelocation/getSelectedSampleStorageLocation",
            fecthInputObject: {
                userinfo: this.props.Login.userInfo
            },
        }
        let inputData = [];
        let jsondata = [];
        const masterData = this.props.Login.masterData;
        let selectedRecord = this.state.selectedRecord;

        inputData["userinfo"] = this.props.Login.userInfo;
        inputData["sampleStorageLocation"] = { "nstatus": 1 };
        inputData["sampleStorageVersion"] = { "nstatus": 1 };

        inputData["sampleStorageVersion"]["napprovalstatus"] = masterData.selectedSampleStorageVersion["napprovalstatus"];
        inputData["sampleStorageVersion"]["nsamplestorageversioncode"] = masterData.selectedSampleStorageVersion["nsamplestorageversioncode"];
        inputData["sampleStorageVersion"]["nsamplestoragelocationcode"] = masterData.selectedSampleStorageVersion["nsamplestoragelocationcode"];

        //ALPD-4493-Vignesh R(20-07-2024)--storage structure->approved records also edited after copy the version.
        jsondata = {
            "nprojecttypecode": masterData.selectedSampleStorageVersion && masterData.selectedSampleStorageVersion.nprojecttypecode || -1,
            "nquantity": masterData.selectedSampleStorageVersion && masterData.selectedSampleStorageVersion.nquantity ? parseFloat(masterData.selectedSampleStorageLocation.nquantity) : 0 || 0,
            "nunitcode": masterData.selectedSampleStorageVersion && masterData.selectedSampleStorageVersion.nunitcode || -1,
            "nproductcode": masterData.selectedSampleStorageVersion && masterData.selectedSampleStorageVersion.nproductcode || -1,
            "nneedautomapping": masterData.selectedSampleStorageVersion && masterData.selectedSampleStorageVersion.nneedautomapping || -1,
            "nstoragecategorycode": masterData.selectedSampleStorageVersion && masterData.selectedSampleStorageVersion.nstoragecategorycode || -1,
            "ncontainertypecode": masterData.selectedSampleStorageVersion && masterData.selectedSampleStorageVersion.ncontainertypecode || -1,
            "nneedposition": masterData.selectedSampleStorageVersion && masterData.selectedSampleStorageVersion.nneedposition || -1,
            "ndirectionmastercode": masterData.selectedSampleStorageVersion && masterData.selectedSampleStorageVersion.ndirectionmastercode || -1,
            "ncontainerstructurecode": masterData.selectedSampleStorageVersion && masterData.selectedSampleStorageVersion.ncontainerstructurecode || -1,
            "nrow": masterData.selectedSampleStorageVersion && masterData.selectedSampleStorageVersion.nrow || -1,
            "ncolumn": masterData.selectedSampleStorageVersion && masterData.selectedSampleStorageVersion.ncolumn || -1,
            "nnoofcontainer": masterData.selectedSampleStorageVersion && masterData.selectedSampleStorageVersion.nnoofcontainer || -1,
            "sprojecttypename": masterData.selectedSampleStorageVersion && masterData.selectedSampleStorageVersion.sprojecttypename || 'NA',
            "sproductname": masterData.selectedSampleStorageVersion && masterData.selectedSampleStorageVersion.sproductname || 'NA',
            "scontainertype": masterData.selectedSampleStorageVersion && masterData.selectedSampleStorageVersion.scontainertype || 'NA',
            "sdirection": masterData.selectedSampleStorageVersion && masterData.selectedSampleStorageVersion.sdirection || 'NA',
            "scontainerstructurename": masterData.selectedSampleStorageVersion && masterData.selectedSampleStorageVersion.scontainerstructurename || 'NA',
            "sstoragecategoryname": masterData.selectedSampleStorageVersion && masterData.selectedSampleStorageVersion.sstoragecategoryname || 'NA',
            "sunitname": masterData.selectedSampleStorageVersion && masterData.selectedSampleStorageVersion.sunitname || 'NA',


        }
        inputData["sampleStorageVersion"]["jsondata"] = jsondata;

        inputData["sampleStorageLocation"]["nstoragecategorycode"] = masterData.selectedSampleStorageVersion["nstoragecategorycode"];
        inputData["sampleStorageLocation"]["nsamplestoragelocationcode"] = masterData.selectedSampleStorageVersion["nsamplestoragelocationcode"];
        const inputParam = {
            inputData: inputData,
            classUrl: "samplestoragelocation",
            methodUrl: "SampleStorageVersion",
            displayName: "IDS_STORAGESTRUCTURE", postParam, searchRef: this.searchRef,
            userInfo: this.props.Login.userInfo, operation: "copy"
        };

        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, ncontrolCode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData }, openModal: true, operation: "copy",
                    screenName: this.props.Login.inputParam.displayName
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            // this.props.approveSampleStorageLocation(this.props.Login.userInfo, this.props.Login.masterData);
            this.props.crudMaster(inputParam, this.props.Login.masterData, "openModal");
        }
    }
    reloadData = () => {
        if (this.searchRef.current) {
            this.searchRef.current.value = "";
        }

        // let nfilterStorageCategory = this.state.nfilterStorageCategory && Object.keys(this.state.nfilterStorageCategory).length !== 0 ? this.state.nfilterStorageCategory.value : 0;
        let nfilterStorageCategory = this.props.Login.masterData.selectedStorageCategory && this.props.Login.masterData.selectedStorageCategory.nstoragecategorycode;
        const inputParam = {
            inputData: { "userinfo": this.props.Login.userInfo, "nstoragecategorycode": nfilterStorageCategory },
            classUrl: "samplestoragelocation",
            methodUrl: "SampleStorageLocation",
            displayName: "IDS_STORAGESTRUCTURE",
            userInfo: this.props.Login.userInfo
        };

        this.props.callService(inputParam);
    }
    onNumericInputChange = (value, field) => {
        const selectedRecord = this.state.selectedRecord || {};
        let constantvalue = value.target.value;
        // Added by reukshana for restricting negative symbol 
        // ALPD-5172 Sample storage mapping screen -> While saving sample storage mapping 500 error is occurring in specific scenario.
        let regAllow = /^-\d+(\.\d+)?$/;
        if (!regAllow.test(constantvalue)) {
            if (field === 'nnoofcontainer') {
                if (constantvalue !== 0) {
                    selectedRecord['nrow'] = 1;
                    selectedRecord['ncolumn'] = constantvalue;
                } else {
                    selectedRecord['nrow'] && delete selectedRecord['nrow'];
                    selectedRecord['ncolumn'] && delete selectedRecord['ncolumn']
                }
            }

            if (!isNaN(constantvalue)) {
                selectedRecord[field] = constantvalue;
                this.setState({ selectedRecord });
            }

        }
    }

    onEditSampleStorageLocation = (selectedSampleStorageVersion, userInfo, editId) => {
        this.handleSearch();
        this.setState({ searchedTreeData: undefined })
        // if (this.searchRef.current) {
        //     this.searchRef.current.value = "";
        // }

        let isOnlyDraft = false;
        if (this.props.Login.masterData.sampleStorageVersion && this.props.Login.masterData.sampleStorageVersion.length > 1) {
            isOnlyDraft = true;
        }
        const instrumentBasedStorage = this.props.Login.settings && this.props.Login.settings[84] ? parseInt(this.props.Login.settings[84]) : null;
        this.props.editSampleStorageLocation(selectedSampleStorageVersion, userInfo, isOnlyDraft, editId, instrumentBasedStorage);
    }
    openStorageLocation = (addId) => {
        this.handleSearch();
        this.setState({ searchedTreeData: undefined })
        if (this.searchRef.current) {
            this.searchRef.current.value = "";
        }
        if (this.state.nfilterStorageCategory && Object.keys(this.state.nfilterStorageCategory).length !== 0) {
            this.props.fetchStorageCategory({ userInfo: this.props.Login.userInfo, id: uuid(), nfilterStorageCategory: this.state.nfilterStorageCategory, addId, nsettings: parseInt(this.props.Login.settings[84]) });
        } else {
            toast.warning(this.props.intl.formatMessage({ id: "IDS_SELECTSTORAGECATEGORY" }));
        }
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

        const addId = this.state.controlMap.has("Add SampleStorageStructure") && this.state.controlMap.get("Add SampleStorageStructure").ncontrolcode;
        const editId = this.state.controlMap.has("Edit SampleStorageStructure") && this.state.controlMap.get("Edit SampleStorageStructure").ncontrolcode;
        const deleteId = this.state.controlMap.has("Delete SampleStorageStructure") && this.state.controlMap.get("Delete SampleStorageStructure").ncontrolcode;
        const copyId = this.state.controlMap.has("Copy SampleStorageStructure") && this.state.controlMap.get("Copy SampleStorageStructure").ncontrolcode;
        const approveId = this.state.controlMap.has("Approve SampleStorageStructure") && this.state.controlMap.get("Approve SampleStorageStructure").ncontrolcode;
        const addInfoId = this.state.controlMap.has("AdditionalInformation") && this.state.controlMap.get("AdditionalInformation").ncontrolcode;


        const filterParam = {
            inputListName: "sampleStorageLocation", selectedObject: "selectedSampleStorageLocation", primaryKeyField: "nsamplestoragelocationcode",
            fetchUrl: "samplestoragelocation/getSelectedSampleStorageLocation",
            fecthInputObject: { userinfo: this.props.Login.userInfo },
            masterData: this.props.Login.masterData, searchRef: this.searchRef,
            searchFieldList: ["ssamplestoragelocationname"],
        };
        const infoFields = [
            { "dataField": "sstoragecategoryname", "idsName": "IDS_STORAGECATEGORY" },
            { "dataField": "ssamplestoragelocationname", "idsName": "IDS_STORAGESTRUCTURENAME" },
            { "dataField": "sprojecttypename", "idsName": "IDS_PROJECT" },
            { "dataField": "sproductname", "idsName": "IDS_PRODUCT" },
            { "dataField": "nquantity", "idsName": "IDS_QUANTITY" },
            { "dataField": "sunitname", "idsName": "IDS_UNIT" },
            { "dataField": "scontainertype", "idsName": "IDS_CONTAINERTYPE" },
            { "dataField": "scontainerstructurename", "idsName": "IDS_CONTAINERSTRUCTURENAME" },
            { "dataField": "nnoofcontainer", "idsName": "IDS_NOOFSAMPLECONTAINER" },
            { "dataField": "sdirection", "idsName": "IDS_DIRECTION" },
            { "dataField": "nrow", "idsName": "IDS_ROWS" },
            { "dataField": "ncolumn", "idsName": "IDS_COLUMNS" },
            { "dataField": "sneedautomapping", "idsName": "IDS_AUTOMAPPING" }];

        if(this.props.Login.settings && parseInt(this.props.Login.settings[84]) === transactionStatus.NO)
        {
            infoFields.unshift( { "dataField": "ssitename", "idsName": "IDS_SITE" },)
        }

        // const mandatoryFields =
        //     this.state.selectedRecord["nneedposition"] === undefined ||
        //         this.state.selectedRecord["nneedposition"] === false ?
        //         [
        //             { "idsName": "IDS_STORAGECATEGORY", "dataField": "nstoragecategorycode", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
        //             { "idsName": "IDS_STORAGESTRUCTURENAME", "dataField": "ssamplestoragelocationname", "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
        //             // { "idsName": "IDS_PROJECTTYPE", "dataField": "nprojecttypecode", "mandatoryLabel": "IDS_SELECT", "controlType": "textbox" },
        //             // { "idsName": "IDS_PRODUCT", "dataField": "nproductcode", "mandatoryLabel": "IDS_SELECT", "controlType": "textbox" },
        //             // {
        //             //     "idsName": "IDS_AVAILABLEQUANTITY",
        //             //     "dataField": "nquantity", "mandatoryLabel":
        //             //         "IDS_ENTER", "controlType": "selectbox"
        //             // }
        //         ]
        //         : [

        //             { "idsName": "IDS_STORAGECATEGORY", "dataField": "nstoragecategorycode", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
        //             { "idsName": "IDS_STORAGESTRUCTURENAME", "dataField": "ssamplestoragelocationname", "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
        //             // { "idsName": "IDS_PROJECTTYPE", "dataField": "nprojecttypecode", "mandatoryLabel": "IDS_SELECT", "controlType": "textbox" },
        //             // { "idsName": "IDS_PRODUCT", "dataField": "nproductcode", "mandatoryLabel": "IDS_SELECT", "controlType": "textbox" },
        //             // {
        //             //     "idsName": "IDS_AVAILABLEQUANTITY",
        //             //     "dataField": "nquantity", "mandatoryLabel":
        //             //         "IDS_ENTER", "controlType": "selectbox"
        //             // },  
        //             {
        //                 "idsName": "IDS_CONTAINERTYPE",
        //                 "dataField": "ncontainertypecode", "mandatoryLabel":
        //                     "IDS_SELECT", "controlType": "selectbox"
        //             },
        //             {
        //                 "idsName": "IDS_CONTAINERSTRUCTURENAME",
        //                 "dataField": "ncontainerstructurecode", "mandatoryLabel":
        //                     "IDS_SELECT", "controlType": "selectbox"
        //             },
        //             {
        //                 "idsName": "IDS_DIRECTION",
        //                 "dataField": "ndirectionmastercode", "mandatoryLabel":
        //                     "IDS_ENTER", "controlType": "selectbox"
        //             }
        //         ]




        const mandatoryFields =
            this.state.selectedRecord["nneedposition"] === undefined || this.state.selectedRecord["nneedposition"] === false && this.props.Login.operation !== "addinfo" ?
                [
                    { "idsName": "IDS_STORAGECATEGORY", "dataField": "nstoragecategorycode", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
                    { "idsName": "IDS_STORAGESTRUCTURENAME", "dataField": "ssamplestoragelocationname", "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" }
                ] : this.props.Login.operation === "create" ? [
                    { "idsName": "IDS_STORAGECATEGORY", "dataField": "nstoragecategorycode", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
                    { "idsName": "IDS_STORAGESTRUCTURENAME", "dataField": "ssamplestoragelocationname", "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" }
                ] : this.props.Login.operation === "addinfo" && this.state.selectedRecord["nneedposition"] !== undefined && this.state.selectedRecord["nneedposition"] === true ? [
                    { "idsName": "IDS_CONTAINERTYPE", "dataField": "ncontainertypecode", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
                    { "idsName": "IDS_CONTAINERSTRUCTURENAME", "dataField": "ncontainerstructurecode", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
                    { "idsName": "IDS_DIRECTION", "dataField": "ndirectionmastercode", "mandatoryLabel": "IDS_ENTER", "controlType": "selectbox" }

                ] : ""

        const breadCrumbData = this.state.filterData || [];

        const confirmMessage = new ConfirmMessage();
        return (
            <>
                <ListWrapper className="client-listing-wrap mtop-4 screen-height-window">
                    {breadCrumbData.length > 0 ?
                        <BreadcrumbComponent breadCrumbItem={breadCrumbData} />
                        : ""}
                    <Row noGutters={true}>
                        <Col md={12} className="parent-port-height">
                            {/* <Col md={12} className='parent-port-height-nobreadcrumb sticky_head_parent' ref={(parentHeight) => { this.parentHeight = parentHeight }}>
                            <ListWrapper> */}
                            {/* <SplitterLayout borderColor="#999" percentage={true} primaryIndex={1} onSecondaryPaneSizeChange={this.paneSizeChange} secondaryInitialSize={25} primaryMinSize={40} secondaryMinSize={20}> */}
                             <Splitter className='layout-splitter' orientation="horizontal"
                                      panes={this.state.panes} onChange={this.onSplitterChange}>
                                 <SplitterPane size="30%" min="25%">
                                {/* First column */}
                                <TransactionListMasterJsonView
                                    paneHeight={this.state.parentHeight}
                                    needMultiSelect={false}
                                    masterList={this.props.Login.masterData.searchedData || this.props.Login.masterData.sampleStorageLocation || []}
                                    selectedMaster={this.props.Login.masterData.selectedSampleStorageLocation &&
                                        [this.props.Login.masterData.selectedSampleStorageLocation] || []}
                                    primaryKeyField="nsamplestoragelocationcode"
                                    getMasterDetail={(selectedItem) =>
                                        this.props.getSelectedSampleStorageLocation(
                                            selectedItem,
                                            this.props.Login.userInfo, this.props.Login.masterData
                                        )}
                                    inputParam={{
                                        userInfo: this.props.Login.userInfo,
                                        masterData: this.props.Login.masterData
                                    }}
                                    mainField={"ssamplestoragelocationname"}
                                    subFields={this.props.Login.settings && parseInt(this.props.Login.settings[84]) === transactionStatus.NO
                                         ? [{
                                                [designProperties.VALUE]: "ssitename",
                                                [designProperties.LABEL]: "IDS_SITENAME"
                                            }] : []}
                                    subFieldsLabel={false}
                                    selectedListName="selectedSampleStorageLocation"
                                    objectName="LocationMaster"
                                    listName="IDS_STORAGESTRUCTURE"
                                    filterColumnData={this.props.filterTransactionList}
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
                                            <Button className="btn btn-icon-rounded btn-circle solid-blue" role="button"
                                                    data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_ADD" })}
                                                // data-for="tooltip-common-wrap"
                                                hidden={this.state.userRoleControlRights.indexOf(addId) === -1}
                                                onClick={() => this.openStorageLocation(addId)}>
                                                <FontAwesomeIcon icon={faPlus} title={this.props.intl.formatMessage({ id: "IDS_ADD" })} />
                                            </Button>
                                            <Button className="btn btn-circle outline-grey ml-2 p-0" variant="link"
                                                onClick={() => this.reloadData()}
                                                // data-for="tooltip-common-wrap"
                                                    data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_REFRESH" })}>
                                                <RefreshIcon className='custom_icons' />
                                            </Button>
                                        </ProductList>
                                    }
                                    filterComponent={[
                                        {
                                            "IDS_TESTFILTER":
                                                <StorageCategoryFilter
                                                    filterStorageCategory={this.state.filterStorageCategory || []}
                                                    nfilterStorageCategory={this.state.nfilterStorageCategory || {}}
                                                    onComboChange={this.onComboChange}
                                                />
                                        }
                                    ]}

                                />
                                </SplitterPane>
                                {/* End of first column */}
                                {/* <SplitterPane size="70%" min="50%"> */}
                                     {/* <Splitter orientation="vertical"> */}
                                        <SplitterPane size="70%" min="25%">
                                             {/* <SplitterLayout vertical borderColor="#999" percentage={true} primaryIndex={1} //secondaryInitialSize={400}
                                                customClassName="fixed_list_height"> */}
                                    {/* <PerfectScrollbar> */}
                                    {/* Start of second column */}
                                    <div className="card_group">
                                        <Row>
                                            <Col md={3} style={{ paddingRight: '0' }}>
                                                {/* Start of version column */}
                                                <TransactionListMasterJsonView
                                                    masterList={ //this.props.Login.masterData.searchedData ||
                                                        this.props.Login.masterData.sampleStorageVersion || []}
                                                    needMultiSelect={false}
                                                    selectedMaster={this.props.Login.masterData.selectedSampleStorageVersion &&
                                                        [this.props.Login.masterData.selectedSampleStorageVersion] || []}
                                                    primaryKeyField="nsamplestorageversioncode"
                                                    getMasterDetail={(selectedItem) =>
                                                        this.props.getSelectedSampleStorageVersion(
                                                            selectedItem, this.props.Login.userInfo,
                                                            this.props.Login.masterData
                                                        )}
                                                    inputParam={{
                                                        userInfo: this.props.Login.userInfo,
                                                        masterData: this.props.Login.masterData
                                                    }}
                                                    mainField={"nversionno"}
                                                    mainFieldLabel={this.props.intl.formatMessage({ id: "IDS_VERSION" })}
                                                    selectedListName="selectedSampleStorageVersion"
                                                    objectName="Version"
                                                    listName="IDS_SAMPLESTORAGEVersion"
                                                    hideSearch={true}
                                                    needValidation={false}
                                                    needFilter={false}
                                                    moreField={[]}
                                                    skip={this.state.detailSkip}
                                                    take={this.state.detailTake}
                                                    hidePaging={true}
                                                    handlePageChange={this.handleDetailPageChange}
                                                    splitModeClass={this.state.splitChangeWidthPercentage && this.state.splitChangeWidthPercentage > 50 ? 'split-mode' : this.state.splitChangeWidthPercentage > 40 ? 'split-md' : ''}
                                                // actionIcons={
                                                //     [
                                                //         {
                                                //             title: this.props.intl.formatMessage({ id: "IDS_EDIT" }),
                                                //             controlname: "faPencilAlt",
                                                //             objectName: "detailtoedit",
                                                //             hidden: this.state.userRoleControlRights.indexOf(editId) === -1,
                                                //             onClick: (e) => this.props.editSampleStorageLocation(this.props.Login.masterData.selectedSampleStorageVersion, this.props.Login.userInfo, this.props.Login.masterData),
                                                //         },
                                                //         {
                                                //             title: this.props.intl.formatMessage({ id: "IDS_DELETE" }),
                                                //             controlname: "faTrashAlt",
                                                //             objectName: "mastertodelete",
                                                //             hidden: this.state.userRoleControlRights.indexOf(deleteId) === -1,
                                                //             onClick: () => this.confirmDelete(deleteId)
                                                //         }
                                                //     ]
                                                // }
                                                />
                                                {/* End of version column */}
                                            </Col>
                                            <Col md={9}>
                                                {/* Start of detailed content */}
                                                <ProductList className="panel-main-content grid-master ">
                                                    {this.props.Login.masterData.sampleStorageLocation && this.props.Login.masterData.sampleStorageLocation.length > 0 && this.props.Login.masterData.selectedSampleStorageLocation ?
                                                        <Card className="border-0">
                                                            <Card.Header>
                                                                <Card.Title className="product-title-main">{this.props.Login.masterData.selectedSampleStorageLocation.ssamplestoragelocationname}</Card.Title>
                                                                <Card.Subtitle>
                                                                    <div className="d-flex product-category">
                                                                        <h2 className="product-title-sub flex-grow-1">
                                                                            <Nav.Link className="action-icons-wrap mr-2 pl-0">
                                                                                {this.props.Login.masterData.selectedSampleStorageVersion.napprovalstatus === transactionStatus.DRAFT ?

                                                                                    <span className={`btn btn-outlined  outline-secondary btn-sm mr-3`}>
                                                                                        <FormattedMessage id={"IDS_DRAFT"} defaultMessage="Draft" />
                                                                                    </span>
                                                                                    :
                                                                                    this.props.Login.masterData.selectedSampleStorageVersion.napprovalstatus === transactionStatus.RETIRED ?

                                                                                        <span className={`btn btn-outlined outline-danger btn-sm mr-3`}>
                                                                                            <FormattedMessage id={"IDS_RETIRED"} defaultMessage="Retired" />
                                                                                        </span>
                                                                                        :
                                                                                        <span className={`btn btn-outlined outline-success btn-sm mr-3`}>
                                                                                            <FormattedMessage id={"IDS_APPROVED"} defaultMessage="Approved" />
                                                                                        </span>
                                                                                }
                                                                            </Nav.Link>
                                                                        </h2>
                                                                        <div className="d-inline">
                                                                            {this.props.Login.masterData.selectedSampleStorageVersion.napprovalstatus === transactionStatus.DRAFT ?
                                                                                <Nav.Link className="btn btn-circle 1 outline-grey mr-2 " href="#"
                                                                                    hidden={this.state.userRoleControlRights.indexOf(editId) === -1}
                                                                                    // data-for="tooltip_list_wrap"
                                                                                                data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_EDIT" })}
                                                                                    onClick={(e) => this.onEditSampleStorageLocation(this.props.Login.masterData.selectedSampleStorageVersion, this.props.Login.userInfo, editId)}
                                                                                >
                                                                                    <FontAwesomeIcon icon={faPencilAlt} />

                                                                                </Nav.Link>
                                                                                :
                                                                                <>    <Nav.Link className="btn btn-circle outline-grey mr-2 " href="#"
                                                                                    hidden={this.state.userRoleControlRights.indexOf(copyId) === -1}
                                                                                    // data-for="tooltip_list_wrap"
                                                                                                data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_COPY" })}
                                                                                    onClick={(e) => this.copySampleStorageversion(copyId)}
                                                                                >
                                                                                    <FontAwesomeIcon icon={faCopy} />

                                                                                </Nav.Link>
                                                                                    {/* <Nav.Link className="btn btn-circle outline-grey mr-2 " href="#"
                                                                                        //hidden={this.state.userRoleControlRights.indexOf(copyId) === -1}
                                                                                        // data-for="tooltip_list_wrap"
                                                                                                    data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_IMPORT" })}
                                                                                        onClick={(e) => this.importdata(copyId)}
                                                                                    >
                                                                                        <FontAwesomeIcon icon={faFileImport} />

                                                                                    </Nav.Link> */}

                                                                                </>

                                                                            }
                                                                            <Nav.Link className="btn btn-circle outline-grey mr-2 " href="#"
                                                                                hidden={this.state.userRoleControlRights.indexOf(addInfoId) === -1}
                                                                                            data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_ADDITIONALINFO" })}
                                                                                onClick={(e) => this.additionalInformation(this.props.Login.masterData.selectedSampleStorageVersion, this.props.Login.userInfo, addInfoId)}
                                                                            >
                                                                                <FontAwesomeIcon icon={faInfoCircle} />
                                                                            </Nav.Link>

                                                                            <Nav.Link name="QB" className="btn btn-circle outline-grey mr-2"
                                                                                hidden={this.state.userRoleControlRights.indexOf(deleteId) === -1}
                                                                                // data-for="tooltip_list_wrap"
                                                                                            data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_DELETE" })}
                                                                                onClick={() => this.confirmDelete(deleteId)}
                                                                            >
                                                                                <FontAwesomeIcon icon={faTrashAlt} />
                                                                            </Nav.Link>
                                                                            {this.props.Login.masterData.selectedSampleStorageVersion.napprovalstatus === transactionStatus.DRAFT ?
                                                                                <Nav.Link name="QB" className="btn btn-circle outline-grey mr-2"
                                                                                    hidden={this.state.userRoleControlRights.indexOf(approveId) === -1}
                                                                                    // data-for="tooltip_list_wrap"
                                                                                                data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_APPROVE" })}
                                                                                    onClick={() => this.checkStorageInstrumentVersion(approveId)}
                                                                                >
                                                                                    <FontAwesomeIcon icon={faThumbsUp} />
                                                                                </Nav.Link>
                                                                                : ""
                                                                            }
                                                                            <Nav.Link className="btn btn-circle outline-grey mr-2 " href="#"
                                                                                            data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_VIEW" })}
                                                                                onClick={(e) => this.viewAdditionalInfo(copyId)}
                                                                            >
                                                                                <FontAwesomeIcon icon={faEye} />
                                                                            </Nav.Link>
                                                                        </div>
                                                                    </div>
                                                                </Card.Subtitle>
                                                            </Card.Header>
                                                            <Card.Body >
                                                                <Col md={12}>

                                                                    <div className={`list-group-search tool-search ${this.state.showSearch ? 'activesearch' : ""}`}>
                                                                        <SearchIcon className="search-icon" onClick={this.toggleSearch}>
                                                                            <FontAwesomeIcon icon={faSearch} />
                                                                        </SearchIcon>
                                                                        <FormControl // ref={this.searchRef}
                                                                            autoComplete="off"
                                                                            className='k-textbox' onChange={this.handleSearch}
                                                                            placeholder={`${this.props.intl.formatMessage({ id: "IDS_FILTER" })}`}
                                                                            name={"search"} onKeyUp={(e) => this.handlenavigation(e, 'down')}
                                                                        />
                                                                        {!this.props.showSearch ?
                                                                            <>
                                                                                <span className='search-up-down'>
                                                                                    <FontAwesomeIcon icon={faChevronUp} onClick={(e) => this.handlenavigation(e, 'up')} />
                                                                                    <FontAwesomeIcon icon={faChevronDown} onClick={(e) => this.handlenavigation(e, 'down')} />
                                                                                    {/* <Button className="btn btn-icon-rounded btn-circle solid-blue" 
                                                                                                                data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_NAVIGATEDOWN" })}  
                                                                                                    onClick={(e)=>this.handlenavigation(e,'down')}>
                                                                                                    <FontAwesomeIcon icon={faArrowDown} title={this.props.intl.formatMessage({ id: "IDS_NAVIGATEDOWN" })} />
                                                                                                </Button>

                                                                                                <Button className="btn btn-icon-rounded btn-circle solid-blue" 
                                                                                                                data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_NAVIGATEUP" })}  
                                                                                                    onClick={(e)=>this.handlenavigation(e,'up')}>
                                                                                                    <FontAwesomeIcon icon={faArrowUp} title={this.props.intl.formatMessage({ id: "IDS_NAVIGATEDOWN" })} />
                                                                                                </Button> */}
                                                                                </span>
                                                                            </>
                                                                            : ""}
                                                                        {this.props.showSearch ?
                                                                            <SearchIcon className="close-right-icon" onClick={this.toggleSearch}>
                                                                                <FontAwesomeIcon icon={faTimes} />
                                                                            </SearchIcon>
                                                                            : ""}
                                                                    </div>
                                                                    <div className='tree-view-container'>
                                                                        <TreeViewEditable
                                                                            id="samplestoragelocation"
                                                                            name="samplestoragelocation"
                                                                            // label="Sample Storage Location"
                                                                            data={this.state.searchedTreeData || this.state.treeDataView}
                                                                            expandIcons={true}
                                                                            selectField={'active-node'}
                                                                            item={this.itemRenderView}
                                                                            onExpandChange={this.onExpandChangeView}
                                                                            onItemClick={this.onItemClickView}
                                                                        />
                                                                    </div>
                                                                </Col>
                                                            </Card.Body>
                                                        </Card>
                                                        : ""}

                                                </ProductList>
                                                {/* End of detailed content */}
                                            </Col>
                                        </Row>

                                    </div>
                                    {/* End of second column */}
                                    {/* </PerfectScrollbar> */}

                                            {/* </SplitterLayout> */}
                                        </SplitterPane>
                                    {/* </Splitter>
                                </SplitterPane> */}
                            </Splitter>


                            {/* </SplitterLayout> */}
                        </Col>
                    </Row>
                </ListWrapper>

                {<ModalShow
                    modalShow={this.props.Login.loadTreeProperties}
                    modalTitle={this.props.intl.formatMessage({ id: "IDS_STORAGESTRUCTURE" })}
                    closeModal={this.closeModalShow}
                    onSaveClick={this.onSaveClick}
                    selectedRecord={this.state.selectedRecord || {}}
                    modalBody={
                        <AddTreeProperties
                            onInputChange={(e) => this.onInputChange(e)}
                            selectedRecord={this.state.selectedRecord || {}}
                        />
                    }
                />}


                {this.props.Login.openModal &&
                    <SlideOutModal show={this.props.Login.openModal}
                        closeModal={this.closeModal}
                        hideSave={this.props.Login.isView}
                        operation={this.props.Login.isView ? "" : this.props.Login.operation}
                        inputParam={this.props.Login.inputParam}
                        screenName={this.props.Login.isView ? this.props.intl.formatMessage({ id: "IDS_VIEW" }) :
                            this.props.Login.operation === "addinfo" ? "" :
                                this.props.intl.formatMessage({ id: "IDS_STORAGESTRUCTURE" })}
                        onSaveClick={this.onSaveClick}
                        esign={this.props.Login.loadEsign}
                        validateEsign={this.validateEsign}
                        masterStatus={this.props.Login.masterStatus}
                        updateStore={this.props.updateStore}
                        selectedRecord={this.state.selectedRecord || {}}
                        mandatoryFields={this.props.Login.loadTreeProperties === true ? [] : mandatoryFields}
                        addComponent={
                            this.props.Login.isView ?
                                <>

                                    <Row>
                                        {
                                            infoFields.map((item, index) => {
                                                return (
                                                    <>
                                                        <Col md={6} >
                                                            <FormGroup>
                                                                <FormLabel>{this.props.intl.formatMessage({ id: item.idsName })}</FormLabel>
                                                                <ReadOnlyText>{this.props.Login.masterData.selectedSampleStorageVersion[item.dataField] ?
                                                                    this.props.Login.masterData.selectedSampleStorageVersion[item.dataField] : '-'
                                                                }</ReadOnlyText>
                                                            </FormGroup>
                                                        </Col>
                                                    </>
                                                )
                                            })}
                                    </Row>
                                </>
                                :
                                this.props.Login.screenName === 'IDS_IMPORT'
                                    ? <>
                                        {/* <Upload
                                        batch={false}
                                        multiple={false}
                                        defaultFiles={[]}
                                        withCredentials={false}
                                        autoUpload={false}
                                        onAdd={this.handleAdd}
                                    /> */}
                                        <hr />
                                        {/* <Grid data={this.state.data} key={this.state.data} /> */}
                                    </> :
                                    this.props.Login.loadEsign ?
                                        <Esign operation={this.props.Login.operation}
                                            formatMessage={this.props.intl.formatMessage}
                                            onInputOnChange={this.onInputOnChange}
                                            inputParam={this.props.Login.inputParam}
                                            selectedRecord={this.state.selectedRecord || {}}
                                        />
                                        :
                                        // this.props.Login.loadTreeProperties ? (
                                        //     <AddTreeProperties
                                        //         onInputChange={(e) => this.onInputChange(e)}
                                        //         selectedRecord={this.state.selectedRecord || {}}
                                        //     />
                                        // ) 
                                        // :
                                        this.state.treeData ? (
                                            <>
                                                <div>
                                                    {/* <input className='k-textbox' onChange={this.handleSearch}/>
                                <hr /> */}
                                                    <AddTreeview
                                                        settings={this.props.Login.settings}
                                                        clearSearchedState={this.clearSearchedState}
                                                        toggleSearch={this.toggleSearch}
                                                        handleSearch={this.handleSearch}
                                                        handlenavigation={this.handlenavigation}
                                                        showSearch={this.state.showSearch}
                                                        treeData={//this.state.searchedTreeData||
                                                            this.state.treeData}
                                                        onInputChange={(e) => this.onInputChange(e)}
                                                        selectedRecord={this.state.selectedRecord || {}}
                                                        itemRender={this.itemRender}
                                                        onExpandChange={this.onExpandChange}
                                                        onItemClick={this.onItemClick}
                                                        onComboChange={this.onComboChange}
                                                        onItemDragOver={this.onItemDragOver}
                                                        onItemDragEnd={this.onItemDragEnd}
                                                        onNumericInputChange={this.onNumericInputChange}
                                                        operation={this.props.Login.operation}
                                                        storageCategoryList={this.props.Login.storageCategoryList || []}
                                                        //InstrumentList={this.state.InstrumentList || []}
                                                        SiteList={this.state.SiteList || []}
                                                        projectTypeMapList={this.props.Login.projectTypeMapList || []}
                                                        sampleTypeList={this.props.Login.sampleTypeList || []}
                                                        isOnlyDraft={this.props.Login.isOnlyDraft}
                                                        unitMapList={this.props.Login.unitMapList}
                                                    />
                                                </div></>
                                        ) : ""
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
    callService, crudMaster, updateStore, validateEsignCredential, filterTransactionList, changeStorageCategoryFilter,
    getSelectedSampleStorageLocation, openPropertyModal, editSampleStorageLocation, approveSampleStorageLocation,
    getSelectedSampleStorageVersion, fetchStorageCategory, copySampleStorageVersion, crudSampleStorageLocation, additionalInformationData, //getsite
})(injectIntl(StorageStructure));