import React from 'react';
import { injectIntl } from 'react-intl';
import { Button, InputGroup, FormControl, Media, ListGroup, Form, Nav } from 'react-bootstrap';
import { ClientList, SearchAdd, MediaHeader, MediaSubHeader, MediaLabel, SearchIcon } from '../App.styles';
import { ListMasterWrapper } from '../list-master/list-master.styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faDatabase, faPlus, faSearch, faSitemap, faTable, faTimes ,faFileExcel,faFileImport} from '@fortawesome/free-solid-svg-icons';
// import FilterWithAccordian from './FilterWithAccordian';
import FilterAccordion from '../custom-accordion/filter-accordion.component';
import 'react-perfect-scrollbar/dist/css/styles.css';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { Affix } from 'rsuite';
import AdvFilter from '../AdvFilter';
import CustomPager from '../CustomPager';
import { ListView } from '@progress/kendo-react-listview';
import { connect } from 'react-redux';
// import { Tooltip } from '@progress/kendo-react-tooltip';
import { ListWrapper } from '../client-group.styles';
import { ReactComponent as FilterIcon } from '../../assets/image/filer-icon.svg';
//  import { ReactComponent as SolidFilterIcon } from '../../assets/image/databasefilter.svg';
 import { ReactComponent as SolidFilterIcon } from '../../assets/image/usersearch.svg';
 import { ReactComponent as SyncInitiate } from '../../assets/image/SyncInitiate.svg';
 import BarcodeButton from '../../pages/BarcodeTemplate/BarcodeButton';
 import { ReactComponent as RefreshIcon } from '../../assets/image/refresh.svg';
import ExportButton from '../../pages/export&import/ExportButton';

//component commented by L.Subashini 13/12/2025 while upgrading to React 17 
//import ReactTooltip from 'react-tooltip';

//component used by L.Subashini 13/12/2025 while upgrading to React 17
//Commenting unused import
//import { Tooltip } from 'react-tooltip';


class ListMaster extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            buttonCount: 4,
            info: true,
            skip: 0,
            take: this.props.Login.settings ? parseInt(this.props.Login.settings[3]) : 5,
            testskip: 0,
            testtake: this.props.Login.settings ? parseInt(this.props.Login.settings[12]) : 5,
            tabHideSearch: false
        }
    }

    handlePageChange = e => {
        this.setState({
            skip: e.skip,
            take: e.take
        });
    };
    tabSearch = () => {
        this.setState({
            tabHideSearch: true
        });
    };
    tabSearch1 = () => {
        this.setState({
            tabHideSearch: false
        });
    };

    filterColumn = (event) => {
        let filterValue = event.target.value;
        if (event.keyCode === 13) {
            this.props.filterColumnData(filterValue, this.props.filterParam,this.props.Login&&this.props.Login.filterOperator[0].sfilteroperator);
        }

        // clearInterval(this.interval);

        // if (filterValue === "") {
        //     this.props.filterColumnData(filterValue, this.props.filterParam);

        // } else {
        //     // (filterValue.length > 2) {
        //     this.interval = setInterval(() => {
        //         this.props.filterColumnData(filterValue, this.props.filterParam);
        //         clearInterval(this.interval);
        //     }, 3000);
        //     // }
        // }
    }

    getSelectedDetail = (master) => {
        if (this.props.allowDuplicateHits
            || this.props.selectedMaster[this.props.primaryKeyField] !== master[this.props.primaryKeyField])
            this.props.getMasterDetail(master);
    }
    ListDesign = props => {
        //add by neeraj-(05-11-2022)
        let item = props.dataItem;
        let value = item[this.props.mainField] ? item[this.props.mainField].trim() : "";
        let firstLetter = value.substring(0, 1);
        let wordArray = value.split(" ");
        if (wordArray.length > 1) {
            firstLetter = firstLetter + wordArray[wordArray.length - 1][0];
        }
        const labelColor = ['label-orange', 'label-green', 'label-yellow', 'label-purple'];
        return (
            // <Tooltip position="bottom" anchorElement="target" openDelay={100} parentTitle={true}>
            <ListGroup.Item key={`listKey_${props.index}`} as="li" onClick={() => this.getSelectedDetail(item)}
                className={`list-bgcolor ${this.props.noSelectedRecord ? "" : this.props.selectedMaster ? this.props.selectedMaster[this.props.primaryKeyField] === item[this.props.primaryKeyField] ? "active" : "" : ""}`}>
                {/* <ReactTooltip place="bottom" id="tooltip_list_wrap" /> */}
                <Media>
                    {this.props.isMultiSelecct ?
                        <Form.Check custom type="checkbox" id="customControl"  >
                            <Form.Check.Input type="checkbox" id={`tm_customCheck_${props.index}`}
                                checked={this.props.selectedMaster ? this.props.selectedMaster[this.props.primaryKeyField] === item[this.props.primaryKeyField] ? true : false : false}
                                readOnly
                            />

                            <Form.Check.Label className={`mr-3 label-circle ${labelColor[props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{firstLetter.toUpperCase()}</Form.Check.Label>
                        </Form.Check> :
                        this.props.hideCheckLabel ? this.props.showTableIcon ?
                            <FontAwesomeIcon icon={faTable} size='lg' />
                            : "" :
                            <Form.Check.Label className={`mr-3 label-circle ${labelColor[props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{firstLetter.toUpperCase()}</Form.Check.Label>
                    }
                    <Media.Body>
                        {/* <ReactTooltip place="bottom" id="tooltip_list_wrap" /> */}
                        <MediaHeader data-tooltip-id="my-tooltip" data-tooltip-content={item[this.props.mainField]}
                        // data-for="tooltip_list_wrap"
                        >{item[this.props.mainField]}</MediaHeader>
                        <MediaSubHeader className="title-grid-width-sm">
                            <MediaLabel>{item[this.props.firstField]}</MediaLabel>
                            {this.props.secondField ? <>
                                <MediaLabel className="text_seperator">
                                    {item[this.props.secondField]}
                                </MediaLabel>
                            </> : ""}
                        </MediaSubHeader>
                    </Media.Body>
                </Media>
            </ListGroup.Item>
        )
    }
    render() {
        let headerClass = this.props.hideSearch ? "justify-content-end" : "justify-content-between";
        //const barcodeControl = this.props.controlMap && this.props.controlMap.has(this.props.methodUrl + "Barcode") && this.props.controlMap.get(this.props.methodUrl + "Barcode").ncontrolcode;

        return (
            <>
                <Affix top={this.props.showFilterIcon ? 91 : 53}>
                    {/* ${this.props.needAccordianFilter ? 'hight-md' : 'height-normal'} */}
                    {/* <ReactTooltip place="bottom" globalEventOff='click' id="tooltip_list_wrap" /> */}
                    <ListMasterWrapper className={`${this.state.showModalBg ? 'show_modal_bg' : ''} `}>
                        {/* <Tooltip position="bottom" anchorElement="target" openDelay={100} parentTitle={true}> */}
                        <SearchAdd className={`d-flex ${headerClass}  pad-15 ${this.props.titleClasses ? this.props.titleClasses : ''}`} >
                            {this.props.hideSearch ? "" :
                                <>
                                <div className='search-tab '>
                                {!this.state.tabHideSearch?
                                    <>
                                        <div className='d-flex'>
                                        <SearchIcon className="search-icon mt-1 mr-1" onClick={this.tabSearch}>
                                            {/* <FontAwesomeIcon icon={faFilter} style={{ color: "#c1c7d0" }} /> */}
                                            <FontAwesomeIcon icon={faSearch} style={{ color: "#c1c7d0" }} />
                                            {/* <SolidFilterIcon className="custom_icons" width="18" height="18" fill='#FFF' stroke='#000000' stroke-width="15"/> */}
                                        </SearchIcon>
                                        {this.props.showFilterIcon ?
                                            <InputGroup.Append>
                                                <AdvFilter
                                                    filterComponent={this.props.filterComponent}
                                                    dataFor="tooltip_list_wrap"
                                                    onFilterSubmit={this.props.onFilterSubmit}
                                                    showFilter={this.props.showFilter}
                                                    openFilter={this.props.openFilter}
                                                    closeFilter={this.props.closeFilter}
                                                    callCloseFunction={this.props.callCloseFunction}
                                                    showModalBg={(e) => this.setState({ showModalBg: e })}

                                                />
                                            </InputGroup.Append>

                                            : ""
                                        }
                                        {this.props.showAdvFilterIcon ? (
                                            <InputGroup.Append>
                                                <Button
                                                    data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({
                                                        id: "IDS_ADVFILTER",
                                                    })}
                                                    // data-for="tooltip-common-wrap"
                                                    className="bg-default svg_custom_big no-down-arrow custom-drop-down-arrow-top ico-fontello-psheudo"
                                                    onClick={(event) => this.props.handleClick(event, 1)}
                                                >
                                                    <FilterIcon
                                                        className="custom_icons"
                                                        width="24"
                                                        height="24"
                                                    />
                                                </Button>
                                            </InputGroup.Append>
                                        ) : (
                                            ""
                                        )}
                                        {this.props.showSolidFilterIcon ? (
                                            <InputGroup.Append>
                                                <Button
                                                    // data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({
                                                    //   id: "IDS_SOLIDFILTER",
                                                    // })}
                                                    // data-for="tooltip-common-wrap"
                                                    className="bg-default svg_custom_big no-down-arrow custom-drop-down-arrow-top ico-fontello-psheudo"
                                                    onClick={(event) => this.props.handleClick(event, 1)}
                                                >
                                                    <SolidFilterIcon
                                                        className="custom_icons"
                                                        //stroke="rgb(151, 160, 175)"
                                                        width="24"
                                                        height="24"
                                                        //fill='#FFF' 
                                                        stroke-width="45"
                                                    />
                                                </Button>
                                            </InputGroup.Append>
                                        ) : (
                                            ""
                                        )}
                                        </div>
                                    
                                    </>
                                    :
                                    <InputGroup className="list-group-search pr-4">
                                    <SearchIcon className="search-icon">
                                        {/* <FontAwesomeIcon icon={faFilter} style={{ color: "#c1c7d0" }} /> */}
                                        <FontAwesomeIcon icon={faSearch} style={{ color: "#c1c7d0" }} />
                                        {/* <SolidFilterIcon className="custom_icons" width="18" height="18" fill='#FFF' stroke='#000000' stroke-width="15"/> */}
                                    </SearchIcon>

                                    <FormControl
                                        ref={this.props.searchRef}// onEnterKeyPress={this.filterColumn}
                                        autoComplete="off"
                                        placeholder={this.props.intl.formatMessage({ id: "IDS_FILTER" })} //.concat(this.props.screenName)
                                        name={"search".concat(this.props.screenName.toLowerCase())}
                                        onKeyUp={(e) => this.filterColumn(e)}
                                    />
                                    <SearchIcon className="close-right-icon" onClick={this.tabSearch1}>
                                        <FontAwesomeIcon icon={faTimes} />
                                    </SearchIcon>
                                    </InputGroup>
                                }
                               
                                </div>
                                
                                <div className='search-desktop'>
                                <InputGroup className="list-group-search">
                                    <SearchIcon className="search-icon">
                                        {/* <FontAwesomeIcon icon={faFilter} style={{ color: "#c1c7d0" }} /> */}
                                        <FontAwesomeIcon icon={faSearch} style={{ color: "#c1c7d0" }} />
                                        {/* <SolidFilterIcon className="custom_icons" width="18" height="18" fill='#FFF' stroke='#000000' stroke-width="15"/> */}
                                    </SearchIcon>

                                    <FormControl
                                        ref={this.props.searchRef}// onEnterKeyPress={this.filterColumn}
                                        autoComplete="off"
                                        placeholder={this.props.intl.formatMessage({ id: "IDS_FILTER" })} //.concat(this.props.screenName)
                                        name={"search".concat(this.props.screenName.toLowerCase())}
                                        onKeyUp={(e) => this.filterColumn(e)}
                                    />

                                    {this.props.showFilterIcon ?
                                        <InputGroup.Append>
                                            <AdvFilter
                                                filterComponent={this.props.filterComponent}
                                                dataFor="tooltip_list_wrap"
                                                onFilterSubmit={this.props.onFilterSubmit}
                                                showFilter={this.props.showFilter}
                                                openFilter={this.props.openFilter}
                                                closeFilter={this.props.closeFilter}
                                                callCloseFunction={this.props.callCloseFunction}
                                                showModalBg={(e) => this.setState({ showModalBg: e })}

                                            />
                                        </InputGroup.Append>

                                        : ""
                                    }
                                    {this.props.showAdvFilterIcon ? (
                                        <InputGroup.Append>
                                            <Button
                                                data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({
                                                    id: "IDS_ADVFILTER",
                                                })}
                                                // data-for="tooltip-common-wrap"
                                                className="bg-default svg_custom_big no-down-arrow custom-drop-down-arrow-top ico-fontello-psheudo"
                                                onClick={(event) => this.props.handleClick(event, 1)}
                                            >
                                                <FilterIcon
                                                    className="custom_icons"
                                                    width="24"
                                                    height="24"
                                                />
                                            </Button>
                                        </InputGroup.Append>
                                    ) : (
                                        ""
                                    )}
                                    {this.props.showSolidFilterIcon ? (
                                        <InputGroup.Append>
                                            <Button
                                                // data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({
                                                //   id: "IDS_SOLIDFILTER",
                                                // })}
                                                // data-for="tooltip-common-wrap"
                                                className="bg-default svg_custom_big no-down-arrow custom-drop-down-arrow-top ico-fontello-psheudo"
                                                onClick={(event) => this.props.handleClick(event, 1)}
                                            >
                                                <SolidFilterIcon
                                                    className="custom_icons"
                                                    //stroke="rgb(151, 160, 175)"
                                                    width="24"
                                                    height="24"
                                                    //fill='#FFF' 
                                                    stroke-width="45"
                                                />
                                            </Button>
                                        </InputGroup.Append>
                                    ) : (
                                        ""
                                    )}
                                </InputGroup>
                                </div>
                                </>
                            }


                            <ListWrapper className="d-flex ml-2">
                                {this.props.titleHead ? <h4>{this.props.titleHead}</h4> : ''}


                                {this.props.showBuildQuery ?
                                    <Button className="btn btn-circle outline-grey mr-2" variant="link"
                                        // hidden={this.props.userRoleControlRights.indexOf(this.props.buildQueryId) === -1}
                                        // data-for="tooltip_list_wrap"
                                        data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_BUILDQUERY" })}
                                        onClick={() => this.props.builderData()}>
                                        <FontAwesomeIcon icon={faDatabase} />
                                    </Button>
                                    : ""
                                }

                                {this.props.hideAddButton ? "" :
                                    <Button className="btn btn-icon-rounded btn-circle solid-blue" role="button"
                                        hidden={this.props.userRoleControlRights.indexOf(this.props.addId) === -1}
                                        //title={this.props.intl.formatMessage({ id: "IDS_ADD" })}
                                        data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_ADD" })}
                                        // data-for="tooltip_list_wrap"
                                        onClick={() => this.props.openModal()}>
                                        <FontAwesomeIcon icon={faPlus} />
                                    </Button>
                                }

                                 {this.props.showExportImport ? 
                                <>
                                <Nav.Link name="export"
                                    data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_EXPORTTEMPLATE" })}
                                    //  data-for="tooltip_list_wrap"
                                    hidden={this.props.userRoleControlRights.indexOf(this.props.exportId) === -1}
                                    className="btn btn-circle outline-grey mr-2 ml-2"
                                    onClick={(e) => this.props.exportExcel(this.props.exportId, 'Export')}
                                >
                                <FontAwesomeIcon icon={faFileExcel} />
                                </Nav.Link>
                                <Nav.Link name="import"
                                    data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_IMPORTTEMPLATE" })}
                                    //  data-for="tooltip_list_wrap"
                                    hidden={this.props.userRoleControlRights.indexOf(this.props.importId) === -1}
                                    className="btn btn-circle outline-grey mr-2"
                                    onClick={(e) => this.props.excelModal(this.props.importId, 'import')}
                                >
                                    <FontAwesomeIcon icon={faFileImport} />
                                </Nav.Link>
                                </>
                                 :""
                                }

                                <BarcodeButton userRoleControlRights={this.props.userRoleControlRights}
                                    selectedMaster={this.props.selectedMaster}
                                    userInfo={this.props.Login.userInfo}
                                    controlMap={this.props.controlMap}
                                    methodUrl={this.props.methodUrl+"Barcode"}
                                    screenName={this.props.Login.screenName}
                                ></BarcodeButton>

                                <ExportButton userRoleControlRights={this.props.userRoleControlRights}
                                    selectedMaster={this.props.selectedMaster}
                                    userInfo={this.props.Login.userInfo}
                                    controlMap={this.props.controlMap}
                                    screenName={this.props.screenName}
                                    //selectedMaster={row["dataItem"]}
                                    exportUrl={"Export" + this.props.methodUrl}
                                    importUrl={"Import" + this.props.methodUrl}
                                    settings={this.props.settings}
                                ></ExportButton>

                                {/* <Button className="btn btn-icon-rounded btn-circle solid-blue" role="button"
                                    hidden={this.props.userRoleControlRights.indexOf(barcodeControl) === -1}
                                    data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_BARCODEGENERATE" })}
                                    onClick={() => this.props.openBarcodeModal(this.props.selectedMaster, barcodeControl, this.props.Login.userInfo)}>
                                    <FontAwesomeIcon icon={faBarcode} />
                                </Button> */}
                                {this.props.hideSyncButton ? "" :
                                    <Nav.Link className="btn btn-icon-rounded btn-circle solid-blue" 
                                        hidden={this.props.userRoleControlRights.indexOf(this.props.syncId) === -1}
                                        data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_INITIATESYNC" })}
                                        // data-for="tooltip_list_wrap"
                                        onClick={() => this.props.openModal()}>
                                        <SyncInitiate className="custom_icons" width="20" height="20"/>
                                        </Nav.Link>

                                }
                                {/* {this.props.hideViewButton ? "" :
                                    <Button className="btn btn-circle outline-grey ml-2" variant="link"
                                        hidden={this.props.userRoleControlRights.indexOf(this.props.viewId) === -1}
                                        //title={this.props.intl.formatMessage({ id: "IDS_ADD" })}
                                        data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_VIEW" })}
                                        data-for="tooltip_list_wrap"
                                        onClick={() => this.props.viewMaterialInventoryDetails()}>
                                        <FontAwesomeIcon icon={faEye}/>
                                    </Button>
                                } */}

                                {this.props.hideReload ? "" :
                                    <Button className="btn btn-circle outline-grey ml-2 p-0" variant="link"
                                        onClick={() => this.props.reloadData()}
                                        // {/* title={this.props.intl.formatMessage({ id: "IDS_REFRESH" })}  */}
                                        // data-for="tooltip_list_wrap"
                                        data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_REFRESH" })}>
                                        <RefreshIcon className='custom_icons'/>
                                    </Button>
                                }
                                {this.props.showGraphView ?
                                    <Button
                                        className="btn btn-circle outline-grey ml-2 fa-rotate-270" variant="link"
                                        onClick={() => this.props.getGraphView()}
                                        // data-for="tooltip_list_wrap"
                                        data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_GRAPH" })}>
                                        {/* title={this.props.intl.formatMessage({ id: "IDS_GRAPH" })}> */}
                                        <FontAwesomeIcon icon={faSitemap} style={{ "width": "0.6!important" }} />
                                    </Button>
                                    // <Nav.Link className="btn btn-circle outline-grey ml-2 action-icons-wrap" onClick={() => this.props.getGraphView()} title={this.props.intl.formatMessage({ id: "IDS_GRAPH" })} >
                                    //     <Image src={Graph} alt="filer-icon" width="20" height="20" className="ActionIconColor img-normalize"/>
                                    // </Nav.Link>
                                    : ""
                                }
                                {this.props.showCopy ?
                                    <Button className="btn btn-circle outline-grey ml-2" variant="link"
                                        hidden={this.props.userRoleControlRights.indexOf(this.props.copyId) === -1}
                                        // title={this.props.intl.formatMessage({ id: "IDS_COPY" })}
                                        // data-for="tooltip_list_wrap"
                                        data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_COPY" })}
                                        onClick={() => this.props.copyData()}>
                                        <FontAwesomeIcon icon={faCopy} />
                                    </Button>
                                    : ""
                                }
                            </ListWrapper>
                        </SearchAdd>
                        {/* </Tooltip> */}

                        {this.props.needAccordianFilter ?
                            <FilterAccordion
                                key="filter"
                                filterComponent={this.props.filterComponent}
                                className={this.props.accordianClassName}
                            />
                            : ""}

                        <ClientList className="product-list list_rightborder">
                            <PerfectScrollbar>
                                {/* style={{ height: this.props.paneHeight ? this.props.paneHeight : this.props.needAccordianFilter ? 'calc(100vh - 220px)' : 'calc(100vh - 180px)' }} */}
                                {/* className="inner-hg-pane" */}
                                <div className={`${this.props.needAccordianFilter ? 'height-md' : 'height-normal'} ${this.props.masterList === 0 && 'list-master-no-record'} ${this.props.showFilterIcon ? 'height-xd' : 'height-xl'} ${this.props.hidePaging ? '' : 'height-xld'}`}>

                                    <ListGroup as="ul">
                                        {this.props.masterList ?
                                            <ListView
                                                data={this.props.hidePaging ? this.props.masterList : this.props.masterList.slice(this.props.skip ? this.props.skip : this.state.skip, ((this.props.skip ? this.props.skip : this.state.skip) + (this.props.take ? this.props.take : this.state.take)))}
                                                item={(props) => this.ListDesign(props)}
                                            /> : ""}

                                        {/* {this.props.masterList ?

                                    this.props.masterList.map((master, index) =>
                                      
                                    )
                                    : ""} */}
                                    </ListGroup>
                                </div>
                            </PerfectScrollbar>

                        </ClientList>
                        {this.props.hidePaging ? "" :
                            <CustomPager
                                skip={this.props.skip ? this.props.skip : this.state.skip}
                                take={this.props.take ? this.props.take : this.state.take}
                                width={20}
                                pagershowwidth={18}
                                handlePageChange={this.handlePageChange}
                                total={this.props.masterList ? this.props.masterList.length : 0}
                                buttonCount={this.state.buttonCount}
                                info={this.state.info}
                                userInfo={this.props.Login.userInfo}
                                pageSize={this.props.pageSize ? this.props.pageSize : this.props.Login.settings && this.props.Login.settings[4].split(",").map(setting => parseInt(setting))}
                            >
                            </CustomPager>
                        }
                    </ListMasterWrapper>
                </Affix>
            </>
        )
    }

    componentDidUpdate(previousProps) {
         /* component commented by L.Subashini 13/12/2025 while upgrading to React 17 */
        //ReactTooltip.rebuild();
        if (this.props.masterList !== previousProps.masterList) {
            if (this.props.skip === undefined && this.props.masterList && this.props.masterList.length <= this.state.skip) {
                this.setState({ skip: 0 });
            }
        }
    }
}

const mapStateToProps = state => {
    return ({ Login: state.Login })
}

export default connect(mapStateToProps, {  })(injectIntl(ListMaster));