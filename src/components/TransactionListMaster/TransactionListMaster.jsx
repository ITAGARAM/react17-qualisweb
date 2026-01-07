import React from 'react';
import { injectIntl } from 'react-intl';
import { InputGroup, FormControl, Media, ListGroup, Form, Nav, Col } from 'react-bootstrap';
import { ClientList, SearchAdd, MediaHeader, MediaSubHeader, MediaLabel, MediaSubHeaderText, SearchIcon, ContentPanel } from '../components/App.styles';
import { ListMasterWrapper } from '../components/list-master/list-master.styles';
import { getActionIcon } from '../components/HoverIcons';
import 'react-perfect-scrollbar/dist/css/styles.css';
import AdvFilter from './AdvFilter';
import { toast } from 'react-toastify';
import { getStatusIcon } from './StatusIcon'
import PerfectScrollbar from 'react-perfect-scrollbar';
import { designProperties, transactionStatus } from './Enumeration';
import QuickSearch from './QuickSearch';
import FilterAccordion from './custom-accordion/filter-accordion.component';
import '../pages/registration/registration.css'
import { connect } from 'react-redux';
import { ListView } from '@progress/kendo-react-listview';
import { filterRecordBasedOnTwoArrays, filterStatusBasedOnTwoArrays, getSameRecordFromTwoArrays } from './CommonScript';
import CustomPager from './CustomPager';
import ReactTooltip from 'react-tooltip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp, faSearch,faTimes } from '@fortawesome/free-solid-svg-icons';
import CustomSwitch from './custom-switch/custom-switch.component';
import Iframe from 'react-iframe';
//import useLongPress from "../actions/longPress";

const mapStateToProps = (state) => {
    return {
        Login: state.Login
    }
}

class TransationListMaster extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            showMore: {},
            allFieldExpanded: false,
            buttonCount: 4,
            skip: 0,
            take: this.props.Login.settings ? parseInt(this.props.Login.settings[3]) : 5,
            info: true,
            expandCheck: [],
            scrollHeight: '100vh',
            multipleselectionFlag: this.props.Login.settings && parseInt(this.props.Login.settings[7]) === 3 ? true : false,
            showList: null,
            disableClick: false,
            showSearch: false,
        }
    }

    handlePageChange = e => {
        this.setState({
            skip: e.skip,
            take: e.take
        });
        this.props.scrollChange()
    };

    filterColumn = (event) => {
        let filterValue = event.target.value;
        if (event.keyCode === 13) {
            this.props.filterColumnData(filterValue, this.props.filterParam, this.props.searchListName);
        }
    }
    selectMultiple = (selectionKey, inputData) => {
        let selectedArray = this.props.selectedMaster;

        let dataList = [];
        let removeElementFromArray = [];
        // let MultipleSelectCount = this.props.Login.settings[3];
        let masterList = this.props.masterList && this.props.masterList.slice(this.props.skip, this.props.skip + this.props.take);

        if (selectionKey === transactionStatus.ALL) {//Select All

            let filteredList = filterRecordBasedOnTwoArrays(masterList, selectedArray, this.props.primaryKeyField);
            filteredList.map((item, index) => {
                // if (index < this.state.take) {
                selectedArray.push(item)
                dataList.push(item[this.props.primaryKeyField]);
                // }
                return null;
            });
            inputData[`${this.props.selectedListName}`] = selectedArray
            inputData[`${this.props.primaryKeyField}`] = dataList.join(",")
            inputData[`${this.props.objectName}`] = selectedArray;
            inputData["checkBoxOperation"] = 1;
            inputData["childTabsKey"] = this.props.childTabsKey;
            if (dataList.length > 0) {
                this.props.getMasterDetail(inputData, true);
            }
            // else {
            //     toast.warn(this.props.intl.formatMessage({ id: "IDS_NOITEMSFOUND" }))
            // }

        } else if (selectionKey === transactionStatus.NA) {
            let filteredList = getSameRecordFromTwoArrays(masterList, selectedArray, this.props.primaryKeyField);
            if (filteredList.length > 0) {
                if (selectedArray.length === filteredList.length) {
                    selectedArray = [filteredList[0]];
                    dataList = [selectedArray[0][this.props.primaryKeyField]];
                } else {
                    selectedArray = filterRecordBasedOnTwoArrays(selectedArray, masterList, this.props.primaryKeyField);
                    dataList = [selectedArray[0][this.props.primaryKeyField]];
                }
                inputData[`${this.props.selectedListName}`] = selectedArray
                inputData[`${this.props.primaryKeyField}`] = dataList.join(",")
                inputData[`${this.props.objectName}`] = selectedArray;
                inputData["checkBoxOperation"] = 6;
                inputData["childTabsKey"] = this.props.childTabsKey;
                inputData["removeElementFromArray"] = filteredList;
                if (dataList.length > 0) {
                    this.props.getMasterDetail(inputData, false);
                }
            }

        } else {//Select Status Wise
            selectedArray = filterRecordBasedOnTwoArrays(selectedArray, masterList, this.props.primaryKeyField);

            removeElementFromArray = getSameRecordFromTwoArrays(this.props.masterList.slice(this.props.skip, this.props.skip + this.props.take), this.props.selectedMaster, this.props.primaryKeyField)
            masterList.map((item) => {
                // if (index < this.state.take) {
                if (item[this.props.selectionField] === selectionKey) {
                    selectedArray.push(item)
                    dataList.push(item[this.props.primaryKeyField]);
                }
                return null;
            });

            // this.props.masterList && this.props.masterList.map((item) => {
            //     if (item[this.props.selectionField] === selectionKey) {
            //         selectedArray.push(item)
            //         dataList.push(item[this.props.primaryKeyField]);
            //     }
            //     return null;
            // })
            inputData[`${this.props.selectedListName}`] = selectedArray
            inputData[`${this.props.primaryKeyField}`] = dataList.join(",")
            inputData[`${this.props.objectName}`] = selectedArray
            inputData["checkBoxOperation"] = 5;
            inputData["childTabsKey"] = this.props.childTabsKey;
            inputData["removeElementFromArray"] = removeElementFromArray;
            if (selectedArray.length > 0) {
                this.props.getMasterDetail(inputData, true);
            } else {
                toast.warn(this.props.intl.formatMessage({ id: "IDS_NOITEMSFOUND" }))
            }
        }
    }
    getselectedDetailAvoidDuplicateProps = (master, inputData, needMultiSelect) => {
        if ((this.props.selectedMaster.length === 1 &&
            this.props.selectedMaster.findIndex(x => x[this.props.primaryKeyField] === master[this.props.primaryKeyField]) !== -1)
            || (needMultiSelect === false)) {
            // const showMore = {};
            this.getSelectedDetail(master, inputData, needMultiSelect);
        }
        this.setState({
            showList: null,
            index: null
        })
    }
    getSelectedDetail = (master, inputData, needMultiSelect) => {
        let bool;
        let selectedMaster;
        if (needMultiSelect === false) {
            if (this.state.multipleselectionFlag) {
                selectedMaster = getSameRecordFromTwoArrays(this.props.selectedMaster, this.props.masterList.slice(this.props.skip, this.props.skip + this.props.take), this.props.primaryKeyField)
            } else {
                selectedMaster = master;
            }

            if (selectedMaster.length > 2) {
                bool = true;
            }
            if (selectedMaster.length === 1 && this.props.selectedMaster.findIndex(m1 => m1[this.props.primaryKeyField] === master[this.props.primaryKeyField]) !== -1) {
                bool = false
            } else {
                bool = true
            }
        } else {
            bool = true;
        }
        if (bool) {
            let selectedArray = this.props.selectedMaster ? needMultiSelect ? this.props.selectedMaster : this.state.multipleselectionFlag ?
                filterRecordBasedOnTwoArrays(this.props.selectedMaster, this.props.masterList.slice(this.props.skip, this.props.skip + this.props.take), this.props.primaryKeyField) : [] : [];
            let dataList = [];
            let removeElementFromArray = [];
            const indexValue = selectedArray ?
                selectedArray.findIndex(x => x[this.props.primaryKeyField] === master[this.props.primaryKeyField]) : -2;
            if (indexValue === -1) {//add new item
                // let MultipleSelectCount = this.props.Login.settings[3];
                // if (selectedArray.length < MultipleSelectCount) {
                removeElementFromArray = this.state.multipleselectionFlag ? getSameRecordFromTwoArrays(this.props.masterList.slice(this.props.skip, this.props.skip + this.props.take), this.props.selectedMaster, this.props.primaryKeyField) :
                    getSameRecordFromTwoArrays(this.props.masterList, this.props.selectedMaster, this.props.primaryKeyField);


                if (this.props.needMultiSelect) {//uselect an Item
                    selectedArray.push(master);
                    dataList.push(master[this.props.primaryKeyField]);
                } else {//Click new Item
                    selectedArray = [master];
                    dataList = [master[this.props.primaryKeyField]];

                }
                inputData[`${this.props.selectedListName}`] = selectedArray
                inputData[`${this.props.primaryKeyField}`] = dataList.join(",")
                inputData[`${this.props.objectName}`] = selectedArray
                inputData["checkBoxOperation"] = needMultiSelect ? 1 : this.state.multipleselectionFlag ? 5 : 3;
                inputData["childTabsKey"] = this.props.childTabsKey;
                inputData["removeElementFromArray"] = needMultiSelect ? [] : removeElementFromArray;
                if (selectedArray.length > 0) {
                    this.props.getMasterDetail(inputData, true);

                }
                // } else {
                //     toast.warn(`${this.props.intl.formatMessage({ id: "IDS_SELECTIONLIMITEXCEED" })} ${MultipleSelectCount} ${this.props.intl.formatMessage({ id: "IDS_RECORDS" })}`);
                // }
            } else if (needMultiSelect) {
                // let removeElementFromArray = [];
                if (needMultiSelect) {//uselect an Item
                    removeElementFromArray.push(this.props.selectedMaster[indexValue]);
                    selectedArray.splice(indexValue, 1)
                    dataList.splice(indexValue, 1);

                } else {//Click new Item
                    removeElementFromArray.push(master);
                    selectedArray.push(master);
                    dataList.push(master[this.props.primaryKeyField])

                }
                inputData[`${this.props.selectedListName}`] = selectedArray;
                inputData[`${this.props.primaryKeyField}`] = selectedArray.map(x => x[this.props.primaryKeyField]).join(",");
                inputData[`${this.props.objectName}`] = selectedArray
                inputData["checkBoxOperation"] = needMultiSelect ? 2 : 4;
                inputData["childTabsKey"] = this.props.childTabsKey;
                inputData["removeElementFromArray"] = removeElementFromArray;
                if (selectedArray.length > 0) {
                    this.props.getMasterDetail(inputData, false);
                }
            } else {
                selectedArray.push(master);
                dataList.push(master[this.props.primaryKeyField])
                inputData[`${this.props.selectedListName}`] = selectedArray
                inputData[`${this.props.primaryKeyField}`] = dataList.join(",")
                inputData[`${this.props.objectName}`] = selectedArray
                inputData["checkBoxOperation"] = needMultiSelect ? 1 : this.state.multipleselectionFlag ? 5 : 3;


                inputData["childTabsKey"] = this.props.childTabsKey;
                if (selectedArray.length > 0) {
                    this.props.getMasterDetail(inputData, true);
                }
            }
        }

    }
    onCheckBoxselect = (event, master, inputData) => {
        if (this.props.selectedMaster.findIndex(m1 => m1[this.props.primaryKeyField] === master[this.props.primaryKeyField]) === -1) {
            this.getSelectedDetail(master, inputData, true);
        } else if (this.props.selectedMaster.length > 1) {
            this.getSelectedDetail(master, inputData, true);
        }
        this.setState({
            showList: null
        })

        event.preventDefault();
        event.stopPropagation();
        // else{
        //     event.preventDefault();
        //     event.stopPropagation();
        //     this.getSelectedDetail(master, inputData, true);
        // }
    }
    componentDidMount() {
        // let val = document.getElementsByClassName('navbar')[0].clientHeight;
        
        setTimeout(() => {
            //let scrollHeight =  'calc(100vh - ' + val + 'px)';
            const pagerheight = document.querySelector('.pager_wrap');
            const navHeight = document.querySelector('.navbar.navbar-expand');
            const filterAccHeight = document.querySelector('.filter-accordian');
            const filterHeight = document.querySelector('.filter-wrap-group');
            const breadCrumbsHeight = document.querySelector('.breadcrumbs-scroll-container');
            //const componentBreadCrumbs = document.querySelector(".component_breadcrumbs");
           
            let val = navHeight ? navHeight.clientHeight : 53;
            if (this.props.needAccordianFilter) {
                val = val + (filterAccHeight ? filterAccHeight.clientHeight : 45);
            }
            if (this.props.needFilter) {
                val = val + (breadCrumbsHeight ? breadCrumbsHeight.clientHeight : 36);
            }
            if (!this.props.notSearchable) {
                val = val + (filterHeight ? filterHeight.clientHeight : 55);
            }
            if (!this.props.hidePaging) {
                val = val + (pagerheight ? pagerheight.clientHeight : 32);
            }
            if(this.props.componentBreadcrumbs){
               
                val = val + 170;
         }
            this.setState({
                scrollHeight:'calc(100vh - ' + val + 'px)'

            })
            
        }, 1000)
    }

    toggleSearch = () => {
        this.setState({
            showSearch: !this.state.showSearch
        })
    }

    render() {

        //console.log(this.props);
        // const { skip, take } = this.state;
        let checkStatus = ''
        let masterList = this.props.masterList ? this.props.masterList.slice(this.props.skip, this.props.skip + this.props.take) : [];
        let selectedMaster = this.props.selectedMaster && this.props.masterList ? getSameRecordFromTwoArrays(this.props.masterList.slice(this.props.skip, this.props.skip + this.props.take), this.props.selectedMaster, this.props.primaryKeyField) : [];
        if (masterList && masterList.length > 0 && selectedMaster && selectedMaster.length > 0) {

            if (masterList.length === selectedMaster.length) {
                checkStatus = 'all'
            } else if (masterList.length !== selectedMaster.length) {
                checkStatus = 'partial'
            } else if (this.props.selectedMaster.length === 0) {
                checkStatus = ''
            }
        }

        // className="client-list-scroll"
        return (
            <>
                {/* <ReactTooltip place="bottom" id="tooltip-common-wrap" globalEventOff='click' /> */}
                <ListMasterWrapper className={`${this.state.showModalBg ? 'show_modal_bg' : ''} ${this.props.splitModeClass}`}>
                    <SearchAdd className={`d-flex filter-wrap-group justify-content-between pad-15 ${this.props.titleClasses ? this.props.titleClasses : ''}`} >
                        {!this.props.notSearchable ?
                            <InputGroup className="search-with-ico-list">
                                <InputGroup.Append>
                                    {this.props.needMultiSelect ?
                                        <QuickSearch
                                            checkStatus={checkStatus}
                                            //selectionList={this.props.hideQuickSearch ? "" : filterStatusBasedOnTwoArrays(this.props.selectionList || [], this.props.masterList ? this.props.masterList.slice(this.props.skip, this.props.skip + this.props.take) : [], this.props.selectionField, this.props.selectionColorField)}
                                            selectionList={this.props.hideQuickSearch ? "" : filterStatusBasedOnTwoArrays(this.props.selectionList || [], this.props.masterList.slice(this.props.skip, this.props.skip + this.props.take), this.props.selectionField, this.props.selectionColorField)}
                                            selectionField={this.props.selectionField}
                                            selectionFieldName={this.props.selectionFieldName}
                                            selectionColorField={this.props.selectionColorField}
                                            selectMultiple={this.selectMultiple}
                                            inputParam={this.props.inputParam}
                                        />
                                        : ""}
                                </InputGroup.Append>
                                {this.props.hideSearch ? "" :
                                    // <FormControl ref={this.props.searchRef} autoComplete="off" placeholder={`${this.props.intl.formatMessage({ id: "IDS_SEARCH" })} ${this.props.intl.formatMessage({ id: this.props.listName })}`} name={"search"} onKeyUp={(e) => this.filterColumn(e)} />
                                    <div className={`list-group-search tool-search ${this.state.showSearch ? 'activesearch' : ""}`}>
                                        <SearchIcon className="search-icon" onClick={this.toggleSearch}>
                                            <FontAwesomeIcon icon={faSearch} />
                                        </SearchIcon>
                                        <FormControl ref={this.props.searchRef} autoComplete="off" placeholder={`${this.props.intl.formatMessage({ id: "IDS_SEARCH" })}`} name={"search"} onKeyUp={(e) => this.filterColumn(e)} />
                                        {this.state.showSearch ?
                                            <SearchIcon className="close-right-icon" onClick={this.toggleSearch}>
                                                <FontAwesomeIcon icon={faTimes} />
                                            </SearchIcon>
                                            : ""}
                                    </div>

                                }
                                {!this.state.showSearch ?
                                    <span>
                                        {this.props.needFilter ?
                                            <InputGroup.Append>
                                                <AdvFilter
                                                    filterComponent={this.props.filterComponent}
                                                    dataFor="tooltip-common-wrap"
                                                    onFilterSubmit={this.props.onFilterSubmit}
                                                    showFilter={this.props.showFilter}
                                                    openFilter={this.props.openFilter}
                                                    closeFilter={this.props.closeFilter}
                                                    showModalBg={(e) => this.setState({ showModalBg: e })}

                                                />
                                            </InputGroup.Append>
                                            : ""}



                                        {this.props.moreField && this.props.moreField.length > 0 ?
                                            <InputGroup.Append>
                                                <InputGroup.Text>
                                                    {/* <ProductList className="d-flex justify-content-end icon-group-wrap"> */}
                                                    <Nav.Link className="p-0" name="gridexpand" onClick={() => this.ExpandAll(masterList)}>
                                                        {/* <FontAwesomeIcon icon={faArrowsAltV} /> */}
                                                        {this.props.intl.formatMessage({
                                                            id: this.props.masterList.length ? this.state.expandCheck ?
                                                                this.props.masterList.length === this.state.expandCheck.length ?
                                                                    this.state.expandCheck.includes(false) ? "IDS_EXPANDALL" : "IDS_EXPANDLESS"
                                                                    : this.state.allFieldExpanded ? "IDS_EXPANDLESS" : "IDS_EXPANDALL"
                                                                : this.state.allFieldExpanded ? "IDS_EXPANDLESS" : "IDS_EXPANDALL"
                                                                : this.state.allFieldExpanded ? "IDS_EXPANDLESS" : "IDS_EXPANDALL"
                                                        })}
                                                    </Nav.Link>
                                                    {/* </ProductList> */}
                                                </InputGroup.Text>
                                            </InputGroup.Append>
                                            : ""}
                                    </span> : ""}
                            </InputGroup> : ''}
                        <>
                            {!this.state.showSearch ?
                                <span>
                                    {this.props.titleHead ? <h4>{this.props.titleHead}</h4> : ''}
                                </span> : ""}
                                {this.props.commonActions}
                        </>

                    </SearchAdd>
                    {
                        this.props.needAccordianFilter ?
                            <FilterAccordion key="filter" className="filter-accordian"
                                filterComponent={this.props.accordianfilterComponent}
                            />
                            : ""
                    }
                    {/* className={` ${this.props.masterList && this.props.masterList.length > 0 ? 'parent-port-height' : 0}`} className="box-shadow-box-btm" */}
                    <PerfectScrollbar >
                        {/*<ClientList className="product-list" style={{ height: this.props.paneHeight ? this.props.paneHeight : this.props.masterList && this.props.masterList.length > 0 ? 'calc(100vh - 230px)' : 'calc(100vh - 180px)' }}>
                   */}
                        <ClientList className="product-list port-height-inner" style={{ height: this.props.paneHeight ? this.props.paneHeight : this.state.scrollHeight }}>
                            <ListView
                                //  data={this.props.hidePaging ? this.props.masterList : this.props.masterList ? this.props.masterList.slice(this.state.skip, this.props.skip + this.props.take) : []}
                                //                data={this.props.hidePaging ? this.props.masterList : this.props.masterList.slice(this.props.skip ? 
                                //                    this.props.skip : this.state.skip, ((this.props.skip ? this.props.skip : this.state.skip) + 
                                //                (this.props.take ? this.props.take : this.state.take)))}
                                //   //  item={(props, index) => this.transactionListDesign(props, this.props.skip, index)}
                                //        //       data={this.props.hidePaging ? this.props.masterList : this.props.masterList.slice(this.props.skip ? this.props.skip : this.state.skip, ((this.props.skip ? this.props.skip : this.state.skip) + (this.props.take ? this.props.take : this.state.take)))}
                                //        item={(props) => this.transactionListDesign(props)}
                                data={this.props.hidePaging ? this.props.masterList : this.props.masterList.slice(this.props.skip, this.props.skip + this.props.take)}
                                item={(props, index) => this.transactionListDesign(props, this.props.skip, index)}


                            //  item={(props, index) => this.transactionListDesign(props, 0, 0)}

                            // style={{ width: "100%" }}
                            // header={myHeader}
                            // footer={this.myFooter}
                            //item={React.ComponentType<ListViewItemProps>} 

                            />
                        </ClientList>
                    </PerfectScrollbar >
                    {
                        this.props.hidePaging ? "" :
                            this.props.masterList && this.props.masterList.length > 0 ?
                                <CustomPager
                                    skip={this.props.skip}
                                    width={this.props.splitChangeWidthPercentage}
                                    take={this.props.take}
                                    handlePageChange={this.props.handlePageChange}
                                    total={this.props.masterList.length}
                                    buttonCount={this.props.splitChangeWidthPercentage >= 30 ? this.state.buttonCount : this.props.buttonCount ? this.props.buttonCount : 2}
                                    userInfo={this.props.Login.userInfo}
                                    info={this.state.info}
                                    pagershowwidth={30}
                                    // pageSize={this.props.Login.settings && this.props.Login.settings[4].split(",").map(setting => parseInt(setting))}
                                    pageSize={this.props.pageSize || (this.props.Login.settings && this.props.Login.settings[4].split(",").map(setting => parseInt(setting)))}
                                //  pageSize={this.props.pageSize || (this.props.Login.settings && this.props.Login.settings[4].split(",").map(setting => parseInt(setting)))}
                                >
                                </CustomPager>
                                //     <CustomPager
                                //     skip={this.props.skip ? this.props.skip : this.state.skip}
                                //     take={this.props.take ? this.props.take : this.state.take}
                                //     width={20}
                                //     pagershowwidth={18}
                                //     handlePageChange={this.props.handlePageChange}
                                //     total={this.props.masterList ? this.props.masterList.length : 0}
                                //     buttonCount={this.state.buttonCount}
                                //     info={this.state.info}
                                //     userInfo={this.props.Login.userInfo}
                                //     pageSize={this.props.pageSize? this.props.pageSize :this.props.Login.settings && this.props.Login.settings[4].split(",").map(setting => parseInt(setting))}
                                // >
                                //s </CustomPager>
                                : ''
                    }
                </ListMasterWrapper >
            </>
        )
    }
    // myFooter = () => {
    //     return (

    //     )
    // }
    onClickActions1 = (event, dataItem) => {

        event.stopPropagation();
        this.props.ListmasterSwitch({ event, nusersrolehidescreencode: dataItem.nusersrolehidescreencode })
    }

    onClickActions = (event, master, action) => {

        event.stopPropagation();
        let selectedArray = this.props.selectedMaster ? this.props.selectedMaster : [];
        let dataList = selectedArray.map(item => item[this.props.primaryKeyField]);
        const indexValue = this.props.selectedMaster ? this.props.selectedMaster.findIndex(x => x[this.props.primaryKeyField] === master[this.props.primaryKeyField]) : -2;
        if (indexValue === -1) {
            if (this.props.needMultiSelect) {
                selectedArray.push(master);
                dataList.push(master[this.props.primaryKeyField]);
            } else {
                selectedArray = [master];
                dataList = [master[this.props.primaryKeyField]];
            }
        }
        action.onClick({ ...action.inputData, [action.objectName]: master, [this.props.selectedListName]: selectedArray, [this.props.primaryKeyField]: dataList.join(",") })
    }

    showHideDetails = (event, index) => {
        event.stopPropagation();
        let showMore = { ...this.state.showMore, [index]: !this.state.showMore[index] }
        //   const check=showMore.map(item=>{return})
        const expandAll = [...Object.values(showMore)]
        let allFieldExpanded = this.state.allFieldExpanded;
        if (expandAll.includes(false)) {
            allFieldExpanded = false
        } else {
            let len = this.props.masterList.length
            if (len === expandAll.length) {
                allFieldExpanded = true
            }
        }
        this.setState({ showMore, allFieldExpanded, expandCheck: expandAll, disableClick: true })

    }
    ExpandAll = (masterData) => {
        const allFieldExpanded = this.state.allFieldExpanded;
        let showMore = {};
        if (!allFieldExpanded) {
            showMore = masterData.map((master, index) => {
                return showMore = { ...showMore, [index]: true };
            });
        }
        this.setState({ showMore, allFieldExpanded: !allFieldExpanded });
    }
    transactionListDesign = (props) => {
        let item = props.dataItem;
        const customswitchposition = {
            // 'padding-left': '290px',
            'padding-top': '-20px'
        }
        // let index;
        // const onLongPress = (e) => {
        //     e.preventDefault();
        //     e.stopPropagation();
        //     this.setState({
        //         index: props.index === this.state.index ? null : props.index
        //     })
        // };
        return (
            <>
                {/* <ReactTooltip place="bottom" id="tooltip-common-wrap" globalEventOff='click' /> */}
                <ListGroup.Item as="li"
                    className={`${this.state.showList === props.index ? "hover" : ""}  list-custom-ico-on-hover list-bgcolor  ${this.props.selectedMaster && this.props.selectedMaster.findIndex(m1 => m1[this.props.primaryKeyField] === item[this.props.primaryKeyField]) !== -1 ? "active" : ""}`}>
                    <Media onClick={() => this.getselectedDetailAvoidDuplicateProps(item, { ...this.props.inputParam }, false)}>
                        {this.props.needMultiSelect ?
                            <Form.Check custom type="checkbox" id="customControl">
                                <Form.Check.Input type="checkbox" id={`tm_customCheck_${this.props.listName}_${props.index}`}
                                    checked={this.props.selectedMaster &&
                                        this.props.selectedMaster.findIndex(m1 => m1[this.props.primaryKeyField] === item[this.props.primaryKeyField]) !== -1 ? true : false}
                                    readOnly
                                />
                                <Form.Check.Label className={`mr-3`}
                                    onClick={(event) => this.onCheckBoxselect(event, item, { ...this.props.inputParam }, true)}
                                    htmlFor={`tm_customCheck_${this.props.listName}_${props.index}`}></Form.Check.Label>
                            </Form.Check>
                            : ""}
                        <Media.Body>

                            {/* <MediaHeader>
                        {this.props.mainFieldLabel && this.props.mainFieldLabel.concat(" : ")}
                        {item[this.props.mainField]}
                        {this.props.showStatusLink &&
                            <Nav.Link className='add-txt-btn blue-text ml-1' style={{ display: 'inline', color: this.props.statusColor ? item[this.props.statusColor] : item.scolorhexcode }}>
                                {this.props.showStatusIcon && getStatusIcon(item[this.props.statusField])}
                                {this.props.showStatusName && <span className='ml-1 text-nowrap'>{item[this.props.statusFieldName]}</span>}
                            </Nav.Link>
                        }
                    </MediaHeader> */}

                            <ContentPanel className="product-category title-grid-wrap-width-md">
                                <ContentPanel>
                                    <MediaHeader data-tooltip-id="my-tooltip" data-tooltip-content={item[this.props.mainField] ? item[this.props.mainField] : item['jsondata'][this.props.mainField]} 
                                    //data-for="tooltip-common-wrap"
                                        style={{ maxWidth: this.props.objectName === "test" ? "30rem" : "15rem" }}>
                                        {this.props.mainFieldLabel && this.props.mainFieldLabel.concat(" : ")}
                                        {item[this.props.mainField] ? item[this.props.mainField] : item['jsondata'][this.props.mainField]}
                                        {/* {console.log(item[this.props.mainField] ? item[this.props.mainField] : item['jsondata'][this.props.mainField])} */}
                                    </MediaHeader>
                                    {this.props.showStatusLink &&
                                        <Nav.Link className='add-txt-btn blue-text ml-1 pl-2'
                                            style={{ padding: "0", display: 'inline', color: this.props.statusColor ? item[this.props.statusColor] : item.scolorhexcode }}>
                                            {this.props.showStatusIcon && getStatusIcon(item[this.props.statusField])}
                                            {this.props.showStatusName && <span className='ml-1 text-nowrap'>{this.props.jsonDesignFields ?
                                                item[this.props.jsonField][this.props.statusFieldName] ?
                                                    item[this.props.jsonField][this.props.statusFieldName] :
                                                    item[this.props.statusFieldName] : item[this.props.statusFieldName]}</span>}
                                        </Nav.Link>
                                    }

                                </ContentPanel>

                            </ContentPanel>

                            <MediaSubHeaderText>

                                {this.props.subFields && this.props.subFields.map((field, index) =>
                                    this.props.subFieldsLabel ?
                                        <>
                                            <MediaLabel>{`${field[designProperties.LABEL] ? this.props.intl.formatMessage({ id: field[designProperties.LABEL] }) + " : " : ""}`}</MediaLabel>
                                            <MediaLabel style={{ color: field[designProperties.COLOUR] ? item.scolorhexcode || item[field[designProperties.COLOUR]] : "" }}>
                                                {this.props.jsonDesignFields ?
                                                    item[this.props.jsonField][field[designProperties.VALUE]] ?
                                                        item[this.props.jsonField][field[designProperties.VALUE]].label ?
                                                            item[this.props.jsonField][field[designProperties.VALUE]].label :
                                                            item[this.props.jsonField][field[designProperties.VALUE]] : ""
                                                    : item[field[designProperties.VALUE]]}</MediaLabel>
                                            {index % 2 === 0 && index !== this.props.subFields.length - 1 ? <MediaLabel className="seperator">|</MediaLabel> : ""}
                                            {(index + 1) % 2 === 0 ? <br></br> : ""}
                                        </> :
                                        <>
                                            <MediaLabel style={{ color: field[designProperties.COLOUR] ? item.scolorhexcode || item[field[designProperties.COLOUR]] : "" }}>
                                                {`${this.props.jsonDesignFields ?
                                                    item[this.props.jsonField][field[designProperties.VALUE]] ?
                                                        item[this.props.jsonField][field[designProperties.VALUE]].label ?
                                                            item[this.props.jsonField][field[designProperties.VALUE]].label :
                                                            item[this.props.jsonField][field[designProperties.VALUE]] : ""
                                                    : item[field[designProperties.VALUE]]}`}</MediaLabel>
                                            {index % 2 === 0 && index !== this.props.subFields.length - 1 ? <MediaLabel className="seperator">|</MediaLabel> : ""}
                                            {(index + 1) % 2 === 0 ? <br></br> : ""}
                                        </>
                                )}
                                {this.props.moreField && this.props.moreField.length > 0 ?
                                    <>
                                        {/* <MediaLabel>
                                    <Nav.Link name={`show-wrap_${props.index}`} className={`show-more-action showmore`} onClick={(event) => this.showHideDetails(event, props.index)} style={{ display: "inline" }}>
                                        <Form.Label className={`show-more-link showmore`} htmlFor={`show-wrap_${props.index}`}>{` ...${this.props.intl.formatMessage({ id: this.state.allFieldExpanded ? "IDS_SHOWLESS" : this.state.showMore[props.index] ? "IDS_SHOWLESS" : "IDS_SHOWMORE" })}`}</Form.Label>
                                    </Nav.Link>
                                </MediaLabel> */}

                                        <MediaLabel>

                                            <Nav.Link name={`show-wrap_${props.index}`} className={`show-more-action showmore`} onClick={(event) => this.showHideDetails(event, props.index, "inner")} style={{ display: "inline" }} title={this.props.intl.formatMessage({ id: this.state.allFieldExpanded ? "IDS_SHOWLESS" : this.state.showMore[props.index] ? "IDS_SHOWLESS" : "IDS_SHOWMORE" })}>
                                                <Form.Label className={`show-more-link mr-1 showmore`} htmlFor={`show-wrap_${props.index}`}>{` ${this.props.intl.formatMessage({ id: this.state.allFieldExpanded ? "IDS_SHOWLESS" : this.state.showMore[props.index] ? "IDS_SHOWLESS" : "IDS_SHOWMORE" })}`}</Form.Label>
                                                <FontAwesomeIcon size="sm" htmlFor={`show-wrap_${props.index}`} icon={this.state.allFieldExpanded ? faChevronUp : this.state.showMore[props.index] ? faChevronUp : faChevronDown} />
                                            </Nav.Link>
                                        </MediaLabel>

                                        <Media.Body className={`show-more-wrap ${this.state.allFieldExpanded ? "showmore" : this.state.showMore[props.index] ? "showmore" : ""}`}>
                                            <MediaSubHeader>
                                                {this.props.moreField.map((field, index) =>
                                                    <>
                                                        <MediaLabel>{`${field[1] ? this.props.intl.formatMessage({ id: field[designProperties.LABEL] }) + " : " : ""} ${item[field[designProperties.VALUE]]}`}</MediaLabel>
                                                        {index % 2 === 0 && index !== this.props.moreField.length - 1 ? <MediaLabel className="seperator">|</MediaLabel> : ""}
                                                        {(index + 1) % 2 === 0 ? <br></br> : ""}
                                                    </>
                                                )}
                                            </MediaSubHeader>
                                        </Media.Body>
                                    </> : ""}
                            </MediaSubHeaderText>
                        </Media.Body>
                        <div className={`icon-list-sm-wrap ${props.index === this.state.index ? 'active' : ""}`}>
                            {this.props.actionIcons && this.props.selectedMaster &&
                                (this.props.selectedMaster.findIndex(m1 => m1[this.props.primaryKeyField] === item[this.props.primaryKeyField]) !== -1)
                                && this.props.actionIcons.length > 0 ?
                                // <div onClick={onLongPress} className="icon-list-sm" >
                                //  <div className="icon-list-sm" >
                                //      <FontAwesomeIcon size="sm" icon={faChevronDown} />
                                //  </div>
                                "" : ""}
                        </div>
                        <div className="icon-group-wrap">
                            {this.props.actionIcons && this.props.actionIcons.length > 0 && this.props.actionIcons.map(action =>
                                action.needConditionalIcon ?
                                    action.conditionalIconFunction(item) &&
                                    <Nav.Link
                                        className="btn btn-circle outline-grey ml-2"
                                       // data-for="tooltip-common-wrap"
                                        data-place={action.dataplace && action.dataplace ? action.dataplace : ""}
                                        data-tooltip-id="my-tooltip" data-tooltip-content={action.title}
                                        hidden={action.hidden === undefined ? true : action.hidden}
                                        onClick={(event) => this.onClickActions(event, item, action)}>
                                        {getActionIcon(action.controlname)}
                                    </Nav.Link>
                                    :
                                    <Nav.Link
                                        className="btn btn-circle outline-grey ml-2"
                                       // data-for="tooltip-common-wrap"
                                        data-tooltip-id="my-tooltip" data-tooltip-content={action.title}
                                        data-place={action.dataplace && action.dataplace ? action.dataplace : ""}
                                        hidden={action.hidden === undefined ? true : action.hidden}
                                        onClick={(event) => this.onClickActions(event, item, action)}>
                                        {getActionIcon(action.controlname)}
                                    </Nav.Link>
                            )}


                            {/* {this.props.ListmasterSwitch && this.props.ListScreenHidebtn &&
                                    <span data-for="screenrights_wrap"
                                        data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_ENABLEDISABLESCREEN" })}>
                                           <Nav.Link  onChange={(event) => this.onClickActions1(event, props.dataItem)}>
                                         <div style={customswitchposition} > 
                                            { 
                                                <CustomSwitch type="switch" id={props.dataItem.nusersrolehidescreencode}
                                                //  id={"ListmasterSwitch"}
                                                //onChange={(event) => this.onClickActions1(event, props.dataItem)}
                                                checked={props.dataItem.needrights === transactionStatus.YES ? true : false}
                                                name={props.dataItem.nusersrolehidescreencode}
                                                className="custom-switch-md customeswitchmanual"
                                                //data-tooltip-id="my-tooltip" data-tooltip-content={"Enable to group by screen name"}
                                                // data-for="screenrights_wrap"
                                                />
                                            }
                                          </div> 
                                        </Nav.Link>
                                    </span>
                            } */}

                        </div>



                    </Media >

                    {this.props.ListmasterSwitch && this.props.ListScreenHidebtn &&
                        <span
                        // data-for="screenrights_wrap" 
                        data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_ENABLEDISABLESCREEN" })}>
                            <div style={customswitchposition} >
                                {<CustomSwitch type="switch" id={props.dataItem.nusersrolehidescreencode}
                                    //  id={"ListmasterSwitch"}
                                    onChange={(event) => this.props.ListmasterSwitch(event, props.dataItem.nusersrolehidescreencode)}
                                    checked={props.dataItem.needrights === transactionStatus.YES ? true : false}
                                    name={props.dataItem.nusersrolehidescreencode}
                                    className="custom-switch-md customeswitchmanual"
                                //data-tooltip-id="my-tooltip" data-tooltip-content={"Enable to group by screen name"}
                                // data-for="screenrights_wrap"
                                />}
                            </div>
                        </span>
                    }
                </ListGroup.Item >
            </>
        )
    }

    componentDidUpdate(previousProps) {
        ReactTooltip.rebuild();
        if (this.props.showMoreResetList) {
            if (this.props.inputParam.masterData[this.props.showMoreResetListName]
                !== previousProps.inputParam.masterData[this.props.showMoreResetListName]) {
                this.setState({ allFieldExpanded: false, showList: null, showMore: {} });
            }
        }
        //  if(this.props.masterList !== previousProps.masterList){
        // if( this.props.masterList && this.props.masterList.length >= this.state.skip){
        //       this.setState({skip:0});
        //    }
        //  }
    }

}


export default connect(mapStateToProps, undefined)(injectIntl(TransationListMaster));



