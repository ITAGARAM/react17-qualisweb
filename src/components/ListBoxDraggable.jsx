import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ListBox, ListBoxToolbar, processListBoxData, processListBoxDragAndDrop }
    from '@progress/kendo-react-listbox';
import { useLayoutEffect, useRef, useState } from 'react';
import { ClientList, SearchAdd, MediaHeader, MediaSubHeader, MediaLabel, MediaSubHeaderText, SearchIcon, ContentPanel } from '../components/App.styles';
import PerfectScrollbar from 'react-perfect-scrollbar';

import { connect } from 'react-redux';
import '@progress/kendo-theme-default/dist/all.css';
import { injectIntl } from 'react-intl';
import { getActionIcon } from '../components/HoverIcons';
import { FormControl, ListGroup, Media, Nav } from 'react-bootstrap';
import { faArrowsAlt, faArrowsAltH, faArrowsAltV, faEquals, faEye, faGift, faGripVertical, faSearch, faSort, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ListMasterWrapper } from '../components/list-master/list-master.styles';

import { designProperties } from '../components/Enumeration';
import '../pages/registration/registration.css'

const SELECTED_FIELD = 'selected';

class ListBoxDraggable extends React.Component {

    constructor(props) {
        //console.log('eeeee222')
        super(props)
        this.state = {
            masterList: //data
                this.props.masterList.length > 0 ? this.props.masterList.map((item, index) => {
                    if (index === 0) {
                        if (item['selected']) {
                            item['selected'] = true;
                        } else {
                            item['selected'] = {};
                            item['selected'] = true;
                        }
                    }
                    return item;
                }) :
                    [],
            developers: [],
            draggedItem: {}
        }
    }
    handleItemClick = (event, data, connectedData) => {
        this.props.getMasterDetail(event.dataItem, this.props.userInfo, this.props.masterData)
        // this.setState({
        //     ...this.state,
        //     [data]: this.state[data].map(item => {
        //         if (item.srulename === event.dataItem.srulename) {
        //             item[SELECTED_FIELD] = true;// !item[SELECTED_FIELD];
        //         }
        //         else //if (!event.nativeEvent.ctrlKey)
        //         {
        //             item[SELECTED_FIELD] = false;
        //         }

        //         return item;
        //     })
        //     // ,
        //     // [connectedData]: this.state[connectedData].map(item => {
        //     //     item[SELECTED_FIELD] = false;
        //     //     return item;
        //     // })
        // });
    };

    handleToolBarClick = e => {
        let toolName = e.toolName || '';
        // let sortableField = this.props.sortableField
        // let sourceSortValue = (this.state.masterList.filter(x => x[SELECTED_FIELD] === true))[0][sortableField]  
        // if (toolName === 'moveDown') {
        //     let index=this.state.masterList.findIndex(x => x[SELECTED_FIELD]=== true);
        //     let destinationSortValue = (this.state.masterList[index+1])[sortableField];
        //     (this.state.masterList[index+1])[sortableField]=sourceSortValue;
        //     (this.state.masterList.filter(x => x[SELECTED_FIELD] === true))[0][sortableField]=destinationSortValue;
        // }else{
        //     let index=this.state.masterList.findIndex(x => x[SELECTED_FIELD]=== true);
        //     let destinationSortValue = (this.state.masterList[index-1])[sortableField];
        //     (this.state.masterList[index-1])[sortableField]=sourceSortValue;
        //     (this.state.masterList.filter(x => x[SELECTED_FIELD] === true))[0][sortableField]=destinationSortValue;
        // }   
        let result = processListBoxData(this.state.masterList, this.state.developers, toolName, SELECTED_FIELD);

        let sortedList = result['listBoxOneData'];
        let sortableField = this.props.sortableField;
        sortedList.map((item, i) => item[sortableField] = i + 1);
        this.props.saveExecutionOrder(sortedList);
        // this.setState({
        //     ...this.state, sortedList,
        //     masterList: sortedList//result.listBoxOneData//,
        //     //  developers: result.listBoxTwoData
        // });
    };

    handleDragStart = e => {
        this.setState({
            ...this.state,
            draggedItem: e.dataItem
        });
    };
    saveExecutionOrder = (sortedArray) => {
        let sortableField = this.props.sortableField;
        sortedArray.map((item, i) => item[sortableField] = i + 1);
        this.props.saveExecutionOrder(sortedArray);
    };
    //this.props.saveExecutionOrder(this.state.masterList);
    handleDrop = e => {
        // let sortableField = this.props.sortableField
        // let destinationSortValue = e.dataItem[sortableField]
        // let sourceSortValue = this.state.draggedItem[sortableField]
        // let sourceindex=this.state.masterList.findIndex(x => x===this.state.draggedItem);
        // let destinationindex=this.state.masterList.findIndex(x => x=== e.dataItem);
        // this.state.masterList[sourceindex][sortableField]=destinationSortValue
        // this.state.masterList[destinationindex][sortableField]=sourceSortValue
        // this.state.draggedItem[sortableField] = destinationSortValue
        // e.dataItem[sortableField] = sourceSortValue
        let result = processListBoxDragAndDrop(this.state.masterList, this.state.developers, this.state.draggedItem, e.dataItem, this.props.mainField);

        let sortedList = result['listBoxOneData'];
        let sortableField = this.props.sortableField;
        sortedList.map((item, i) => item[sortableField] = i + 1);

        this.props.saveExecutionOrder(sortedList);
        // this.setState({
        //     ...this.state, sortedList,
        //     masterList: sortedList//result.listBoxOneData//,
        //     //    developers: result.listBoxTwoData
        // });
    };
    iconGroupView(index) {
        this.setState({ activeIconIndex: this.state.activeIconIndex == index ? null : index })
    }
    toggleSearch = () => {
        this.setState({
            showSearch: !this.state.showSearch
        })
    }
    filterColumn = (event) => {
        let filterValue = event.target.value;
        if (event.keyCode === 13) {
            this.props.filterColumnData(filterValue, this.props.filterParam, this.props.searchListName);
        }
    }
    MyCustomItem = (props) => {
        let { dataItem, selected, ...others } = props;
        let sortableField = this.props.sortableField;
        let index = dataItem[sortableField];
        const ref = useRef(null);
        const [width, setWidth] = useState(0);
        useLayoutEffect(() => {
            function updateSize() {
                setWidth(ref.current.offsetWidth - 200);
            }
            window.addEventListener('resize', updateSize);
            updateSize();
            return () => window.removeEventListener('resize', updateSize)
        }, []);

        return (
            <ListGroup.Item as="li" ref={ref} {...others}
                className={`${this.state.showList === props.index ? "hover" : ""}  list-custom-ico-on-hover list-bgcolor 
             ${this.props && this.props.selectedMaster && this.props.selectedMaster[this.props.primaryKeyField] ===
                        dataItem[this.props.primaryKeyField] ? "active" : ""}`}>
                {/* <li {...others} className={`${this.state.showList === props.index ? "hover" : ""}  list-custom-ico-on-hover list-bgcolor 
            ${this.props.selectedMaster && this.props.selectedMaster[this.props.primaryKeyField] ===
                        dataItem[this.props.primaryKeyField] ? "active" : ""}`} > */}


                <Media onClick={(e) => this.props.getMasterDetail ? this.handleItemClick(props, 'masterList', 'developers') : ""}>
                    {this.props.isSearchedDataPresent ? "" : <MediaHeader style={{ marginTop: "10px", marginRight: "5px", content: "||" }} >
                        <FontAwesomeIcon icon={faGripVertical} className="dragicon" ></FontAwesomeIcon>
                    </MediaHeader>}

                    <MediaHeader  >
                        <MediaHeader data-tooltip-id="my-tooltip" data-tooltip-content={props.dataItem[this.props.mainField]}  //data-for="tooltip-common-wrap"
                            style={this.props.subFields ?
                                { maxWidth: "15rem", marginLeft: "10px", fontSize: "1.10rem" }
                                : { maxWidth: "15rem", marginLeft: "10px", fontSize: "1.10rem", marginTop: '10px' }}
                        >
                            <span  >{props.dataItem[this.props.mainField]}</span>

                        </MediaHeader>
                        <MediaSubHeader style={{ padding: "0.1rem", marginLeft: "9px" }} className="text-wrap">
                            {/* <span>Status: {props.dataItem.stransdisplaystatus}</span> */}
                            {this.props.subFields && this.props.subFields.map((field, index) =>
                                this.props.subFieldsLabel ?
                                    <>
                                        <MediaLabel >{`${field[designProperties.LABEL][this.props.userInfo.slanguagetypecode] ||
                                            this.props.intl.formatMessage({ id: field[designProperties.LABEL] }) + " : "}`}</MediaLabel>
                                        <MediaLabel style={{ color: field[designProperties.COLOUR] ? dataItem.scolorhexcode || dataItem[field[designProperties.COLOUR]] : "" }}>
                                            {dataItem[field[designProperties.VALUE]] === undefined ? '-' : dataItem[field[designProperties.VALUE]]}</MediaLabel>
                                        {index !== this.props.subFields.length - 1 ? <MediaLabel className="seperator">|</MediaLabel> : ""}
                                        {/* {(index + 1) % 2 === 0 ? <br></br> : ""} */}
                                        {/* index % 2 === 0 && */}
                                    </> :
                                    <>
                                        <MediaLabel style={{ color: field[designProperties.COLOUR] ? dataItem.scolorhexcode || dataItem[field[designProperties.COLOUR]] : "" }}>
                                            {`${dataItem[field[designProperties.VALUE]] === undefined ? '-' : dataItem[field[designProperties.VALUE]]}`}</MediaLabel>
                                        {index !== this.props.subFields.length - 1 ? <MediaLabel className="seperator">|</MediaLabel> : ""}
                                        {/* {(index + 1) % 2 === 0 ? <br></br> : ""} */}
                                        {/* index % 2 === 0 &&  */}
                                    </>
                            )}
                        </MediaSubHeader>

                    </MediaHeader>


                    <Media.Body >

                    </Media.Body>

                </Media>
                <div className={`icon-group-wrap ${this.props.actionIcons && this.props.listMasterShowIcon
                    ? "enable-view" : ""} ${this.props.clickIconGroup ? "click-view" : "hover-view"}
                         ${this.state.activeIconIndex == index ? "active" : ""}`}>
                    {this.props.actionIcons && this.props.actionIcons.length > 0 && this.props.actionIcons.map((action, index) =>
                        <span className={`${this.props.listMasterShowIcon && index + 1 > this.props.listMasterShowIcon ? 'disable-view' : ""}`}>
                            <Nav.Link
                                className="btn btn-circle outline-grey ml-2"
                                // data-for="tooltip-common-wrap"
                                data-tooltip-id="my-tooltip" data-tooltip-content={action.title}
                                data-place={action.dataplace && action.dataplace ? action.dataplace : ""}
                                hidden={action.hidden === undefined ? true : action.hidden}
                                onClick={(event) => action.onClick({ [this.props.selectedListName]: [dataItem] })}
                            >
                                {getActionIcon(action.controlname)}
                            </Nav.Link>
                        </span>
                    )}
                </div>
                {this.props.clickIconGroup ?
                    (this.props.listMasterShowIcon && this.props.actionIcons && this.props.actionIcons.length <= this.props.listMasterShowIcon) ? "" :
                        <span className='vertical-dots end-icon' onClick={() => this.iconGroupView(index)}></span> : ""}
                {/* </li > */}
            </ListGroup.Item >

        );
    };
    render() {
        return (
            <ListMasterWrapper className={`${this.state.showModalBg ? 'show_modal_bg' : ''} ${this.props.splitModeClass}`}>
                <SearchAdd className={`d-flex filter-wrap-group justify-content-between pad-15`} >
                    {this.props.hideSearch ? <div className={`list-group-search tool-search ${this.state.showSearch ? 'activesearch' : ""}`}>

                    </div> :
                        !this.props.disableToolBarItems ?
                            // <FormControl ref={this.props.searchRef} autoComplete="off" placeholder={`${this.props.intl.formatMessage({ id: "IDS_SEARCH" })} ${this.props.intl.formatMessage({ id: this.props.listName })}`} name={"search"} onKeyUp={(e) => this.filterColumn(e)} />
                            <div className={`list-group-search tool-search ${this.state.showSearch ? 'activesearch' : ""}`}>
                                <SearchIcon className="search-icon" onClick={this.toggleSearch}>
                                    <FontAwesomeIcon icon={faSearch} />
                                </SearchIcon>
                                <FormControl ref={this.props.searchRef} autoComplete="off"
                                    placeholder={`${this.props.intl.formatMessage({ id: "IDS_SEARCH" })}`} name={"search"}
                                    onKeyUp={(e) => this.filterColumn(e)} />
                                {this.state.showSearch ?
                                    <SearchIcon className="close-right-icon" onClick={this.toggleSearch}>
                                        <FontAwesomeIcon icon={faTimes} />
                                    </SearchIcon>
                                    : ""}
                            </div> : ""

                    }
                    <>
                        <span>
                            {this.props.commonActions}
                        </span>
                    </>
                </SearchAdd>
                <PerfectScrollbar >
                    <ClientList className="product-list sm-list-view port-height-inner"
                       >

                         
                            <ListBox
                                draggable={this.props.isSearchedDataPresent ? false : true}
                                style={{
                                    height: 400,
                                    width: '100%'
                                }}
                                size={'large'}
                                data={this.state.masterList || []}
                                item={this.MyCustomItem}

                                textField={this.props.mainField}
                                selectedField={SELECTED_FIELD}
                                //   onItemClick={e => this.handleItemClick(e, 'masterList', 'developers')}
                                onDragStart={this.handleDragStart}
                                onDrop={this.handleDrop}
                            // toolbar={() => {
                            //     return <ListBoxToolbar
                            //         tools={['moveUp', 'moveDown'//, 'transferTo', 'transferFrom', 'transferAllTo', 'transferAllFrom', 'remove'
                            //         ]}
                            //         data={this.state.masterList}
                            //         //   dataConnected={state.developers}
                            //         onToolClick={this.handleToolBarClick}
                            //     />;
                            // }} 
                            /> 

                    </ClientList>
                </PerfectScrollbar>


            </ListMasterWrapper >

        );

    }
    // static getDerivedStateFromProps(nextProps, prevState) {
    //     if (nextProps.selectedTestGroupTestCode !== prevState.selectedTestGroupTestCode) {
    //         return {sortedList: [] };
    //     }else{
    //         return{ masterList: this.state.sortedList } ;
    //     }
    // }
    componentDidUpdate(previousProps) {
        // console.log('previousProps--->>>')
        if (this.props.selectedTestGroupTestCode !== previousProps.selectedTestGroupTestCode) {
            this.setState({ sortedList: [], selectedTestGroupTestCode: this.props.selectedTestGroupTestCode });
        }
        if (this.props.masterList !== previousProps.masterList) {
            // let selectedIndex = this.props.masterList.findIndex(y => y['selected'] && y['selected'] === true);
            // if (selectedIndex !== -1) {
            //     this.props.masterList[0]['selected'] = {};
            //     this.props.masterList[0]['selected'] = false;
            // }
            // const updateInfo = {
            //     typeName: DEFAULT_RETURN,
            //     data: { masterList: this.props.masterList }
            // }
            // this.props.updateStore(updateInfo);

            this.setState({ masterList: this.props.masterList });
        }

        // if (this.props.Login.masterList !== previousProps.Login.masterList) {
        //     // let selectedIndex = this.props.masterList.findIndex(y => y['selected'] && y['selected'] === true);
        //     // if (selectedIndex !== -1) {
        //     //     this.props.masterList[0]['selected'] = {};
        //     //     this.props.masterList[0]['selected'] = false;
        //     // }
        //     this.setState({ masterList: this.props.Login.masterList });
        // }
        // if (this.props.selectedMaster !== previousProps.selectedMaster) {
        //     if (this.props.Login.masterList.length>0) {
        //         let primaryKeyField = this.props.primaryKeyField
        //         let oldselectedIndex = this.props.Login.masterList.findIndex(x =>
        //             x['selected'] && x['selected'] === true
        //         );
        //         let newselectedIndex = this.props.Login.masterList.findIndex(y => y[primaryKeyField] === this.props.selectedMaster[primaryKeyField]);
        //         if (oldselectedIndex !== -1) {
        //             this.props.Login.masterList[oldselectedIndex]['selected'] = false;
        //         }
        //         this.props.Login.masterList[newselectedIndex]['selected'] = {};
        //         this.props.Login.masterList[newselectedIndex]['selected'] = true;
        //     }
        //     this.setState({ masterList: this.props.Login.masterList });
        // }
        if (this.props.selectedMaster !== previousProps.selectedMaster) {
            if (this.props.masterList.length > 0) {
                let primaryKeyField = this.props.primaryKeyField
                let oldselectedIndex = this.props.masterList.findIndex(x =>
                    x['selected'] && x['selected'] === true
                );
                let newselectedIndex = this.props.masterList.findIndex(y => y[primaryKeyField] === this.props.selectedMaster[primaryKeyField]);
                if (oldselectedIndex !== -1) {
                    this.props.masterList[oldselectedIndex]['selected'] = false;
                }
                this.props.masterList[newselectedIndex]['selected'] = {};
                this.props.masterList[newselectedIndex]['selected'] = true;
            }
            this.setState({ masterList: this.props.masterList, activeIconIndex: null });
        }
    }
};



export default injectIntl(ListBoxDraggable);


