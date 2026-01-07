import React from 'react'
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Row, Col, Nav, Card, Button } from 'react-bootstrap';
import { Grid, GridColumn } from '@progress/kendo-react-grid';
import { process } from '@progress/kendo-data-query';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faSave, faCopy, faPlus } from '@fortawesome/free-solid-svg-icons';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import CustomSwitch from '../../components/custom-switch/custom-switch.component';
import SlideOutModal from '../../components/slide-out-modal/SlideOutModal';
import Esign from '../audittrail/Esign';
import ScreenRightsFilter from './ScreenRightsFilter';
import AddScreenRights from './AddScreenRights';
import UserRoleScreenRights from './UserRoleScreenRights';
import { showEsign, getControlMap, constructOptionList, sortData } from '../../components/CommonScript';
import {
    callService, crudMaster, validateEsignCredential, updateStore, getScreenRightsDetail, copyScreenRights, filterTransactionList,
    getScreenRightsComboService, comboChangeUserRoleScreenRights, handleClickDelete, filterColumnData, getCopyUseRoleScreenRights, checkUserRoleScreenRights, reload
} from '../../actions';
import { DEFAULT_RETURN } from '../../actions/LoginTypes';
import { transactionStatus } from '../../components/Enumeration';
import { ContentPanel, AtSubCard } from '../../components/App.styles';
import { AtTableWrap } from '../../components/data-grid/data-grid.styles';
// import TransactionListMaster from '../../components/TransactionListMaster';
import TransationListMasterJsonView from '../../components/TransactionListMasterJsonView';
import { ProductList } from '../product/product.styled';
import ConfirmMessage from '../../components/confirm-alert/confirm-message.component';
//import SplitterLayout from '@progress/kendo-react-layout'; //'react-splitter-layout';
import { Splitter, SplitterPane } from '@progress/kendo-react-layout';

import BreadcrumbComponent from '../../components/Breadcrumb.Component';
// import ReactTooltip from 'react-tooltip';
import {  LocalizationProvider } from '@progress/kendo-react-intl';
import { ReactComponent as RefreshIcon } from '../../assets/image/refresh.svg';

const mapStateToProps = state => {
    return ({ Login: state.Login })
}

class ScreenRights extends React.Component {
    constructor(props) {
        super(props);
        const dataState = {
            skip: 0,
            take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5
            //, group: [{ field: 'screenname' }]
        };
        this.searchFieldList = ["sdisplayname"]
        this.state = {
            masterStatus: "",
            error: "",
            isOpen: false,
            ScreenRightsData: [], userRoleData: [],
            availableDatas: [],
            selectedRecord: {},
            userroleList: [],
            operation: "",
            comboitem: undefined,
            screenName: undefined,
            SelectedScreenrights: undefined,
            selectedcombo: undefined, selectedcomboUserRole: undefined,
            userRoleControlRights: [],
            ControlRights: undefined,
            ConfirmDialogScreen: false,
            controlMap: new Map(),
            showAccordian: true,
            dataResult: [],
            skip: 0,
            take: this.props.Login.settings && this.props.Login.settings[3],
            dataState: dataState,
            columnName: '',
             rowIndex: 0, 
             data: [], 
            // splitChangeWidthPercentage: 30,
             panes: [
               { size: '30%', min: '25%', collapsible:true }             
            ],
            // panel:[
            //     { size: '40%', min: '5%' },
            //     {},
            //     { size: '20%' }
            // ]
        };
        this.searchRef = React.createRef();
        this.ControlButton = [{ value: 1, label: this.props.intl.formatMessage({ id: "IDS_ENABLEALLCONTROLRIGHTS" }) },
        { value: 2, label: this.props.intl.formatMessage({ id: "IDS_DISABLEALLCONTROLRIGHTS" }) },
        { value: 3, label: this.props.intl.formatMessage({ id: "IDS_ENABLEALLESIGNRIGHTS" }) },
        { value: 4, label: this.props.intl.formatMessage({ id: "IDS_DISABLEALLESIGNRIGHTS" }) }
        ];
        this.confirmMessage = new ConfirmMessage();
    }
    dataStateChange = (event) => {
       // if (event.dataState.group.length === 1 && event.dataState.group[0].field === 'screenname')
       // {
            this.setState({
                dataResult: process(this.props.Login.masterData.ControlRights || [], event.dataState),
                dataState: event.dataState
            });
        //}
    }


    expandChange = event => {
        const isExpanded =
            event.dataItem.expanded === undefined
                ? event.dataItem.aggregates
                : event.dataItem.expanded;
        event.dataItem.expanded = !isExpanded;
        this.setState({ ...this.state });
        //this.setState({ ...this.state.dataState });
    };

    static getDerivedStateFromProps(props, state) {
        if (props.Login.masterStatus !== "" && props.Login.masterStatus !== state.masterStatus) {
            toast.warn(props.Login.masterStatus);
            props.Login.masterStatus = "";
        }
        if (props.Login.error !== state.error) {
            toast.error(props.Login.error)
            props.Login.error = "";
        }
        return null;
    }


    paneSizeChange = (d) => {
        this.setState({
            splitChangeWidthPercentage: d
        })
    }

    //Added by L.Subashini on 19/12/2025 for Splitter issue with React Version Upgrade to 17
    onSplitterChange = (event) => {
        this.setState({ panes: event.newState });
    };

    render() {

       // console.log("master:", this.props.Login.masterData, this.state.dataResult)
        const searchedData = this.props.Login.masterData.searchedData 
        const ScreenRights = this.props.Login.masterData.ScreenRights || [];
        const addId = this.state.controlMap.has("AddScreenRights") && this.state.controlMap.get("AddScreenRights").ncontrolcode;
        const deleteId = this.state.controlMap.has("DeleteScreenRights") && this.state.controlMap.get("DeleteScreenRights").ncontrolcode;
        const copyId = this.state.controlMap.has("CopyScreenRights") && this.state.controlMap.get("CopyScreenRights").ncontrolcode;
        const filterParam = {
            inputListName: "ScreenRights",
            selectedObject: "SelectedScreenRights",
            primaryKeyField: "nuserrolescreencode",
            fetchUrl: "screenrights/getSearchScreenRights",
            userinfo: this.props.Login.userInfo,
            fecthInputObject: { userinfo: this.props.Login.userInfo },
            masterData: this.props.Login.masterData,
            searchFieldList: this.searchFieldList, changeList: [], isSingleSelect: false,
            skip: 0,
            take: this.props.Login.settings ? this.props.Login.settings[14] : 5
        };

        const mandatoryFieldsScreenRights = [
            { "mandatory": true, "idsName": "IDS_SCREENRIGHTS", "dataField": "nformcode", "mandatoryLabel":"IDS_SELECT", "controlType": "selectbox" }
        ];

        const mandatoryFieldsUsers = [{ "mandatory": true, "idsName": "IDS_USERROLE", "dataField": "nuserrole", "mandatoryLabel":"IDS_SELECT", "controlType": "selectbox" }
        ];
        // let screenlen = searchedData ? searchedData.length : ScreenRights.length
        const breadCrumbData = this.state.filterData || [];
        return (
            <>
                {/* <ReactTooltip place="bottom" globalEventOff='click' id="tooltip_list_wrap"/> */}
                <div className="client-listing-wrap mtop-4 screen-height-window">
                    {breadCrumbData.length > 0 ?
                        // <Affix top={64}>
                        <BreadcrumbComponent breadCrumbItem={breadCrumbData} />
                        // </Affix> 
                        : ""
                    }
                    <Row noGutters>
                        <Col md={12} className="parent-port-height sticky_head_parent" ref={(parentHeight) => { this.parentHeight = parentHeight }}>
                            {/* <SplitterLayout borderColor="#999"
                             percentage={true} primaryIndex={1}
                                    secondaryInitialSize={this.state.splitChangeWidthPercentage}
                                    onSecondaryPaneSizeChange={this.paneSizeChange}
                                    primaryMinSize={40}
                                    secondaryMinSize={20}
                              > */}

                            <Splitter className='layout-splitter' orientation="horizontal"
                             panes={this.state.panes} onChange={this.onSplitterChange}>
                                <SplitterPane size="30%" min="25%">
                                    {/* ALPD-2396 Changed component from TransactionListMaster to TransationListMasterJsonView */}
                                    <TransationListMasterJsonView
                                        splitChangeWidthPercentage={this.state.splitChangeWidthPercentage}
                                        masterList={searchedData || ScreenRights || []}
                                        selectedMaster={this.props.Login.masterData.SelectedScreenRights}
                                        primaryKeyField="nuserrolescreencode"
                                        getMasterDetail={this.props.getScreenRightsDetail}
                                        inputParam={{ userinfo: this.props.Login.userInfo,
                                            masterData: this.props.Login.masterData,
                                            dataState: this.state.dataState,skip:this.state.skip,take:this.state.take }}
                                        additionalParam={['napprovalversioncode']}
                                        mainField="sdisplayname"
                                        selectedListName="SelectedScreenRights"
                                        filterColumnData={this.props.filterTransactionList}
                                        searchListName="searchedData"
                                        searchRef={this.searchRef}
                                        filterParam={filterParam}
                                        objectName="screenrights"
                                        listName="IDS_SCREENRIGHTS"
                                        hideQuickSearch={true}
                                        skip={this.state.skip}
                                        take={this.state.take}   
                                        handlePageChange={this.handlePageChange}
                                        hidePaging={false}
                                        needFilter={true}
                                        needAccordianFilter={false}
                                        childTabsKey={["ControlRights"]}
                                        openFilter={this.openFilter}
                                        closeFilter={this.closeFilter}
                                        onFilterSubmit={this.onFilterSubmit}
                                        filterComponent={[
                                            {
                                                "IDS_FILTER":
                                                    <ScreenRightsFilter
                                                        filterUserRole={this.state.userroleList || []}
                                                        selectedRecord={this.state.selectedcombo || {}}//
                                                        onComboChange={this.onComboChange}
                                                    />
                                            }
                                        ]}
                                        // accordianfilterComponent={[
                                        //     {
                                        //         "IDS_USERROLE":
                                        //             <ScreenRightsFilter
                                        //                 filterUserRole={this.state.userroleList || []}
                                        //                 selectedRecord={this.state.selectedcombo || {}}//
                                        //                 onComboChange={this.onComboChange}
                                        //             />
                                        //     }
                                        // ]}
                                        needMultiSelect={true}
                                        commonActions={
                                            // <Tooltip position="bottom" anchorElement="target" openDelay={100} parentTitle={true}>
                                                <ProductList className="d-flex product-category float-right">
                                                {/* <ReactTooltip place="bottom" globalEventOff='click' /> */}
                                                <Button className="btn btn-icon-rounded btn-circle solid-blue" 
                                                    data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_ADD" })} 
                                                //  data-for="tooltip_list_wrap"
                                                    role="button"
                                                    hidden={this.state.userRoleControlRights.indexOf(addId) === -1}
                                                    onClick={() => this.props.getScreenRightsComboService("IDS_SCREENRIGHTS", "create", this.props.Login.userInfo, this.state.selectedcombo, addId)}>
                                                    <FontAwesomeIcon icon={faPlus} />
                                                </Button>
                                                <Button className="btn btn-circle outline-grey ml-2 p-0" variant="link"
                                                    data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_RELOAD" })} 
                                                //   data-for="tooltip_list_wrap"
                                                    onClick={() => this.reloadData()} >
                                                    <RefreshIcon className='custom_icons'/>
                                                </Button>
                                            </ProductList>
                                            // </Tooltip>
                                        }
                                    />
                                </SplitterPane>
                                 <SplitterPane size="70%" min="25%">
                                {/* <PerfectScrollbar> */}
                                {/* <SplitterLayout vertical borderColor="#999" percentage={true} primaryIndex={1} secondaryInitialSize={400} customClassName="fixed_list_height"> */}
                                {/* <Col md={9}> */}
                                        <Row >
                                            <Col md={12}>
                                                <ContentPanel className="panel-main-content">
                                                    <Card className="border-0">
                                                        {this.props.Login.masterData.ScreenRights && this.props.Login.masterData.ScreenRights.length > 0 && this.props.Login.masterData.SelectedScreenRights ?
                                                            <>
                                                            
                                                                <Card.Header className="pb-4" >
                                                                    {/* <ReactTooltip place="bottom" globalEventOff='click' id="screenrights_wrap"/> */}
                                                                    <Card.Title>
                                                                        <p className="product-title-main">
                                                                            {this.props.intl.formatMessage({ id: "IDS_CONTROLRIGHTSANDESIGNRIGHTS" })}
                                                                        </p>
                                                                    </Card.Title>
                                                                    <ContentPanel className="d-flex justify-content-end d-inline">
                                                                        {/* <Tooltip position="bottom" anchorElement="target" openDelay={100} parentTitle={true}> */}
                                                                        <Nav.Link className="btn btn-circle outline-grey mr-2 action-icons-wrap" 
                                                                            data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_DELETE" })}
                                                                            hidden={this.state.userRoleControlRights.indexOf(deleteId) === -1} 
                                                                            role="button"
                                                                        //    data-for="screenrights_wrap"
                                                                            onClick={() => this.ConfirmDelete(deleteId)}>
                                                                            <FontAwesomeIcon icon={faTrashAlt} />
                                                                            {/* <ConfirmDialog
                                                                                    name="deleteMessage"
                                                                                    message={this.props.intl.formatMessage({ id: "IDS_DEFAULTCONFIRMMSG" })}
                                                                                    doLabel={this.props.intl.formatMessage({ id: "IDS_OK" })}
                                                                                    doNotLabel={this.props.intl.formatMessage({ id: "IDS_CANCEL" })}
                                                                                    icon={faTrashAlt}
                                                                                    //title={this.props.intl.formatMessage({ id: "IDS_DELETE" })}
                                                                                    handleClickDelete={() => this.handleClickDelete(this.props.Login.masterData, deleteId, "openModal")}
                                                                                /> */}
                                                                        </Nav.Link>
                                                                        <Nav.Link className="btn btn-circle outline-grey mr-2" 
                                                                            data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_COPY" })} 
                                                                            hidden={this.state.userRoleControlRights.indexOf(copyId) === -1}
                                                                         //   data-for="screenrights_wrap"
                                                                            onClick={() => this.props.getCopyUseRoleScreenRights(this.props.intl.formatMessage({ id: "IDS_USERROLESCREENRIGHTS" }), "copy", copyId, this.state.selectedcombo, this.props.Login.userInfo, this.props.Login.masterData, 2)}>
                                                                            <FontAwesomeIcon icon={faCopy} />
                                                                        </Nav.Link>
                                                                        {/* </Tooltip> */}
                                                                    </ContentPanel>
                                                                </Card.Header>
                                                                <Row>
                                                                    {this.props.Login.userInfo.nusercode === -1 ?
                                                                    <Col md='6'>
                                                                        <AtSubCard className="d-flex justify-content-start">
                                                                            {/* <ReactTooltip place="bottom" globalEventOff='click' /> */}
                                                                            <FormSelectSearch
                                                                                name={"value"}
                                                                                placeholder={this.props.intl.formatMessage({ id: "IDS_SELECT" })}
                                                                                value={this.state.comboitem ? this.state.comboitem["value"] : this.ControlButton[0]}
                                                                                options={this.ControlButton}
                                                                                optionId="label"
                                                                                optionValue="label"
                                                                                isMandatory={false}
                                                                                isMulti={false}
                                                                                isSearchable={false}
                                                                                closeMenuOnSelect={true}
                                                                                alphabeticalSort={false}
                                                                                as={"select"}
                                                                                onChange={(event) => this.onComboChange(event, "value")}
                                                                            />
                                                                            {/* <Tooltip position="bottom" anchorElement="target" openDelay={100} parentTitle={true}> */}
                                                                            <Nav.Link className="btn btn-circle outline-grey ml-2 "
                                                                                 data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_SAVE" })} 
                                                                               //  data-for="screenrights_wrap"
                                                                                 onClick={() => this.onSaveAllControlAndEsign(this.state.skip, this.state.take)}
                                                                                 role="button">
                                                                                <FontAwesomeIcon icon={faSave} /> { }
                                                                            </Nav.Link>
                                                                            {/* </Tooltip> */}
                                                                        </AtSubCard>
                                                                    </Col>:""}
                                                                    {/* <Col md='6' >
                                                                        <Row>
                                                                            <Col md={12}>
                                                                                <strong>
                                                                                    {this.props.intl.formatMessage({ id: "Enable/Disable Grouping" })}
                                                                                </strong>
                                                                            </Col> */}
                                                                            <Col>
                                                                               <span    headerClassName="text-center" 
                                                                                   //     data-for="screenrights_wrap" 
                                                                                        data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_ENABLEDISABLEGROUPING" })}>
                                                                            
                                                                                    <CustomSwitch   type="switch" 
                                                                                            id={"groupbyswitch"}
                                                                                            onChange={(event) => this.switchGroupBy(event)}
                                                                                            checked={this.state.selectedSwitch === transactionStatus.YES ? true : false}
                                                                                            name={"groupbyswitch"} 
                                                                                            parentClassName= {"paddingclass"}
                                                                                            //data-tooltip-id="my-tooltip" data-tooltip-content={"Enable to group by screen name"}
                                                                                           // data-for="screenrights_wrap"
                                                                                            />
                                                                                </span>
                                                                            </Col>
                                                                        {/* </Row>
                                                                    </Col>*/}
                                                                </Row> 
                                                            </> :
                                                            ""}
                                                        {this.props.Login.masterData.ScreenRights && this.props.Login.masterData.ScreenRights.length > 0 && this.props.Login.masterData.SelectedScreenRights ?
                                                            <LocalizationProvider language={this.props.Login.userInfo.slanguagetypecode}>
                                                          <AtTableWrap className="at-list-table screen-rights-grid">
                                                                <Grid
                                                                    sortable
                                                                    resizable
                                                                    reorderable={false}
                                                                    scrollable={"scrollable"}
                                                                    onExpandChange={this.expandChange}
                                                                    expandField="expanded"
                                                                    pageable={{ buttonCount: 4, pageSizes: this.props.Login.settings && this.props.Login.settings[15].split(",").map(setting => parseInt(setting)), previousNext: false}}
                                                                    //data={this.state.dataResult}
                                                                    data={process(this.props.Login.masterData.ControlRights || [], this.state.dataState)}
                                                                    {...this.state.dataState}
                                                                    selectedField="selected"
                                                                    onDataStateChange={this.dataStateChange}
                                                                  //  groupable={true}
                                                                >
                                                                     <GridColumn width="300px"
                                                                        field="screenname"
                                                                        title={this.props.intl.formatMessage({ id: "IDS_SCREENNAME" })}
                                                                        //headerClassName="text-center"
                                                                        //groupable={this.isGroupable("screenname")}
                                                                        cell={(row) => (
                                                                            row.rowType === "groupHeader" ? null :
                                                                           
                                                                                <td 
                                                                                   // className={selectedId === row["dataItem"]["screenname"] ? 'active' : ''}
                                                                                    data-tooltip-id="my-tooltip" data-tooltip-content={row["dataItem"]["screenname"]}
                                                                               //     data-for="tooltip_list_wrap"
                                                                                    style={{textAlign: 'left' }}>
                                                                                    {/* <ReactTooltip place="bottom" globalEventOff='click' /> */}
                                                                                    {row["dataItem"]["screenname"]}
                                                                                </td>)}
                                                                    />
                                                                    <GridColumn width="300px"
                                                                        field="scontrolids"
                                                                        title={this.props.intl.formatMessage({ id: "IDS_CONTROLNAME" })}
                                                                        //headerClassName="text-center"
                                                                        cell={(row) => (
                                                                            row.rowType === "groupHeader" ? null :
                                                                                <td 
                                                                                    style={{textAlign: 'left' }}
                                                                                    data-tooltip-id="my-tooltip" data-tooltip-content={row["dataItem"]["scontrolids"]} 
                                                                                //    data-for="tooltip_list_wrap"
                                                                                    >
                                                                                    {/* <ReactTooltip place="bottom" globalEventOff='click' /> */}
                                                                                    {row["dataItem"]["scontrolids"]}
                                                                                </td>)}
                                                                    />

                                                                    <GridColumn width="250px"
                                                                        field={"nneedrights"}
                                                                        title={this.props.intl.formatMessage({ id: "IDS_CONTROLRIGHTS" })}
                                                                        headerClassName="text-center"
                                                                        cell={(row) => (
                                                                            row.rowType === "groupHeader" ? null :
                                                                                <td style={{ textAlign: "left" }} >
                                                                                    <CustomSwitch type="switch" id={row["dataItem"]["nneedrights"]}
                                                                                        onChange={(event) => this.onInputOnControlRights(event, row["dataItem"], "nneedrights", row.dataIndex, 1)}
                                                                                        checked={row["dataItem"]["nneedrights"] === transactionStatus.YES ? true : false}
                                                                                        name={row["dataItem"]["nuserrolescreencode"] + "_" + row.dataIndex + "_" + row.columnIndex} />
                                                                                </td>)}
                                                                    />
                                                                    <GridColumn width="230px"
                                                                        field={"nneedesign"}
                                                                        title={this.props.intl.formatMessage({ id: "IDS_ESIGN" })}
                                                                        headerClassName="text-center"
                                                                        cell={(row) => (
                                                                            row.rowType === "groupHeader" ? null :
                                                                                <td style={{ textAlign: "left" }} >
                                                                                    {row["dataItem"]["nisesigncontrol"] === 3 ?
                                                                                        <CustomSwitch type="switch" id={row["dataItem"]["nneedesign"]}
                                                                                            onChange={(event) => this.onInputOnControlRights(event, row["dataItem"], "nneedesign", row.dataIndex, undefined)}
                                                                                            checked={row["dataItem"]["nneedesign"] === transactionStatus.YES ? true : false}
                                                                                            name={row["dataItem"]["nuserrolescreencode"] + "_" + row.dataIndex + "_" + row.columnIndex}
                                                                                            disabled={row["dataItem"]["nisesigncontrol"] === transactionStatus.NO ? true : false}
                                                                                        /> :
                                                                                        ""
                                                                                    }
                                                                                </td>
                                                                        )
                                                                        }
                                                                    />
                                                                </Grid>
                                                            </AtTableWrap>
                                                            </LocalizationProvider>
                                                            : ""}
                                                    </Card>
                                                </ContentPanel>
                                            </Col>
                                        </Row>
                                {/* </SplitterLayout> */}
                                {/* </PerfectScrollbar> */}
                                </SplitterPane>
                            </Splitter>
                            {/* </SplitterLayout > */}
                        </Col>
                    </Row>
                </div>
                {/* End of get display*/}
                {}
                {
                    this.props.Login.openModal &&
                    <SlideOutModal show={this.props.Login.openModal}
                        closeModal={this.closeModal}
                        operation={this.props.Login.operation}
                        inputParam={this.props.Login.inputParam}
                        screenName={this.props.Login.screenName}
                        onSaveClick={this.onSaveClick}
                        esign={this.props.Login.loadEsign}
                        validateEsign={this.validateEsign}
                        masterStatus={this.props.Login.masterStatus}
                        selectedRecord={this.state.selectedRecord || {}}
                        mandatoryFields={this.props.Login.screenName === "IDS_SCREENRIGHTS" ? mandatoryFieldsScreenRights : mandatoryFieldsUsers}
                        updateStore={this.props.updateStore}
                        addComponent={this.props.Login.loadEsign ?
                            <Esign operation={this.props.Login.operation}
                                onInputOnChange={this.onInputOnChange}
                                inputParam={this.props.Login.inputParam}
                                selectedRecord={this.state.selectedRecord || {}}
                            />
                            : this.props.Login.screenName === "IDS_SCREENRIGHTS" ?
                                <AddScreenRights selectedRecord={this.state.selectedRecord || {}}
                                    onInputOnChange={this.onInputOnChange}
                                    onComboChange={this.onComboChange}
                                    avaliableScreen={this.props.Login.AvaliableScreen}
                                    operation={this.props.operation}
                                />
                                :
                                <UserRoleScreenRights selectedRecord={this.props.Login.selectedRecord || {}}
                                    onInputOnChange={this.onInputOnChange}
                                    onComboChange={this.onComboChangeUserRole}
                                    operation={this.props.operation}
                                    UserRole={this.props.Login.masterData.Userrole || []}
                                    SelectedUserRole={this.state.selectedcombo}
                                />
                        }
                    />
                }
                {}
            </>
        );
    }

    // commonActions = (skip, take, testskip, testtake)=>{
    //     const addId = this.state.controlMap.has("AddScreenRights") && this.state.controlMap.get("AddScreenRights").ncontrolcode;
      
    //     return(
    //          // <Tooltip position="bottom" anchorElement="target" openDelay={100} parentTitle={true}>
    //          <ProductList className="d-flex product-category float-right">
    //          {/* <ReactTooltip place="bottom" globalEventOff='click' /> */}
    //          <Button className="btn btn-icon-rounded btn-circle solid-blue" 
    //              data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_ADD" })} 
    //              data-for="tooltip_list_wrap"
    //              role="button"
    //              hidden={this.state.userRoleControlRights.indexOf(addId) === -1}
    //              onClick={() => this.props.getScreenRightsComboService("IDS_SCREENRIGHTS", "create", this.props.Login.userInfo, this.state.selectedcombo, addId)}>
    //              <FontAwesomeIcon icon={faPlus} />
    //          </Button>
    //          <Button className="btn btn-circle outline-grey ml-2" variant="link"
    //              data-tooltip-id="my-tooltip" data-tooltip-content={"Reload"}
    //              data-for="tooltip_list_wrap"
    //              onClick={() => this.reloadData()} >
    //              <FontAwesomeIcon icon={faSync} style={{ "width": "0.6!important" }} />
    //          </Button>
    //      </ProductList>
    //      // </Tooltip>
    //     )
    // }

    switchGroupBy = (event)=>{
       
        const selectedSwitch = event.target.checked === true ? transactionStatus.YES : transactionStatus.NO;
        let dataState = this.state.dataState || {};
         if (selectedSwitch === transactionStatus.YES){
            dataState= {...dataState, group: [{ field: 'screenname' }]} ;
         }
        else{
            dataState= {skip: dataState.skip,  take: dataState.take} 
        }
        this.setState({selectedSwitch, dataState});
    }

    ConfirmDelete = (deleteId) => {
        this.confirmMessage.confirm("deleteMessage", this.props.intl.formatMessage({ id: "IDS_DELETE" }), this.props.intl.formatMessage({ id: "IDS_DEFAULTCONFIRMMSG" }),
            this.props.intl.formatMessage({ id: "IDS_OK" }), this.props.intl.formatMessage({ id: "IDS_CANCEL" }),
            () => this.handleClickDelete(this.props.Login.masterData, deleteId, "openModal"));
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
        // this.reloadData(this.state.selectedRecord, true);
        if (this.state.selectedcombo["nuserrolecode"]) {
            this.props.comboChangeUserRoleScreenRights(this.state.selectedcombo, this.props.Login.masterData, this.props.Login.userInfo);
        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTUSERROLE" }));
        }
    }

    componentDidMount() {
        if (this.parentHeight) {
            const height = this.parentHeight.clientHeight;
            this.setState({
                firstPane: height - 80,
                parentHeight: height
            });
        }
    }

    generateBreadCrumData() {
        const breadCrumbData = [];
        if (this.props.Login.masterData && this.props.Login.masterData.userrole) {

            breadCrumbData.push(
                {
                    "label": "IDS_USERROLE",
                    "value": this.props.Login.masterData.SelectedUserRole ? this.props.Login.masterData.SelectedUserRole.suserrolename : "NA"

                },
            );
        } else {
            breadCrumbData.push(
                {
                    "label": "IDS_USERROLE",
                    "value": "NA"

                },
            );
        }
        return breadCrumbData;
    }

    componentDidUpdate(previousProps) { 
        // ReactTooltip.rebuild();
        const masterData = this.props.Login.masterData;
        if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord) {
            this.setState({ selectedRecord: this.props.Login.selectedRecord });

        }
        if (this.props.Login.selectedcombo !== previousProps.Login.selectedcombo) {
            this.setState({ selectedcombo: this.props.Login.selectedcombo });
        }

        if (this.props.Login.comboitem !== previousProps.Login.comboitem) {
            this.setState({ comboitem: this.props.Login.comboitem });
        }
        if(this.props.Login.masterData.AvaliableScreen !== previousProps.Login.masterData.AvaliableScreen
            || this.props.Login.masterData.SelectedUserRole !== previousProps.Login.masterData.SelectedUserRole){
            let skip=this.state.skip;
            let take=this.state.take;
            skip = this.props.Login.skip === undefined ? skip : this.props.Login.skip;
            take = this.props.Login.take || take;        

            this.setState({ skip,take});          
        }
        

    //     if(this.props.Login.masterData.ControlRights !== previousProps.Login.masterData.ControlRights){

    //         let skip=this.state.skip;
    //         let take=this.state.take;

    //         let dataState=this.state.dataState
    //         if (this.props.Login.dataState !== previousProps.Login.dataState) {
               
    //             dataState = this.props.Login.dataState || this.state.dataState
    //             dataState= {skip: dataState.skip,
    //             take: dataState.take
    //             , group: [{ field: 'screenname' }]} 
    //             if(this.props.Login.dataState===undefined){
    //                 dataState= {skip: 0,
    //                     take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5
    //                     , group: [{ field: 'screenname' }]} 
    //             }
            
    //     }
    //     skip = this.props.Login.skip === undefined ? skip : this.props.Login.skip
    //     take = this.props.Login.take || take

    //     this.setState({ dataState , dataResult: process(this.props.Login.masterData.ControlRights || [], dataState),skip,take});
    // }
        // if(this.props.Login.masterData.ControlRights !== previousProps.Login.masterData.ControlRights){
        //     this.setState({
        //           dataResult: process(this.props.Login.masterData.ControlRights || [], this.state.dataState)
        //     })
        // }
        if (this.props.Login.userInfo.nformcode !== previousProps.Login.userInfo.nformcode) {
            const userRoleControlRights = [];
            if (this.props.Login.userRoleControlRights) {
                this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode] && Object.values(this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode]).map(item =>
                    userRoleControlRights.push(item.ncontrolcode))
            }

            const controlMap = getControlMap(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode)
            this.setState({
                userRoleControlRights, controlMap, data: this.props.Login.masterData.ControlRightst
            });
        }
        if (this.props.Login.masterData.userrole !== previousProps.Login.masterData.userrole) {
            const userrole = constructOptionList(this.props.Login.masterData.userrole || [], "nuserrolecode",
                "suserrolename", undefined, undefined, undefined);
            const userroleList = userrole.get("OptionList");

            const selectedcombo = {
                nuserrolecode: masterData.userrole&&masterData.userrole.length > 0 ? {
                    "value": masterData.userrole[0].nuserrolecode,
                    "label": masterData.userrole[0].suserrolename
                } : ""
            }
            this.setState({
                selectedcombo: selectedcombo,
                userroleList: userroleList
            });
        }
        if (this.props.Login.masterData !== previousProps.Login.masterData) {
            const filterData = this.generateBreadCrumData();
            sortData(this.props.Login.masterData);

            //let skip=0;
            //let take=this.state.take;
           // take = this.props.Login.take || take;  
    
           let skip=this.state.skip;
           let take=this.state.take;
           skip = this.props.Login.skip === undefined ? skip : this.props.Login.skip;
           take = this.props.Login.take || take; 
    
            // let dataState = this.state.dataState || {};
            // dataState= {...dataState, group: [{ field: 'screenname' }]} ;

            this.setState({ filterData,//, dataState
            skip:skip,take:take});
        }
    }


    handlePageChange = e => {
        this.setState({
            skip: e.skip,
            take: e.take
        });
        //setTimeout(() => { this._scrollBarRef.updateScroll() })
    };

    validateEsign = () => {
        const inputParam = {
            inputData: {
                "userinfo": {
                    ...this.props.Login.userInfo,
                    sreason: this.state.selectedRecord["esigncomments"],
                    nreasoncode:this.state.selectedRecord["esignreason"] && this.state.selectedRecord["esignreason"].value,
                    spredefinedreason:this.state.selectedRecord["esignreason"] && this.state.selectedRecord["esignreason"].label,
               
                },
                password: this.state.selectedRecord["esignpassword"]
            },
            screenData: this.props.Login.screenData
        }
        this.props.validateEsignCredential(inputParam, "openModal");
    }

    closeModal = () => {
        let loadEsign = this.props.Login.loadEsign;
        let openModal = this.props.Login.openModal;
        let selectedRecord = this.props.Login.selectedRecord;
        if (this.props.Login.loadEsign) {
            if (this.props.Login.operation === "delete" || this.props.Login.operation === "retire") {
                loadEsign = false;
                openModal = false;
                selectedRecord = {};
            }
            else {
                loadEsign = false;
                selectedRecord['esignpassword'] = ""
                selectedRecord['esigncomments'] = ""
                selectedRecord['esignreason']=""
            }
        }
        else {
            openModal = false;
            selectedRecord = {};
        }
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { openModal, loadEsign, selectedRecord, selectedId: null }
        }
        this.props.updateStore(updateInfo);
    }


    onComboChange = (comboData, fieldName) => {
        if (comboData != null) {
            if (fieldName === "nuserrolecode") {
                const selectedcombo = this.state.selectedcombo || {};
                selectedcombo[fieldName] = comboData;
                this.searchRef.current.value = "";
                this.setState({ selectedcombo });
                // masterData["ControlRights"]=[]
                // this.props.comboChangeUserRoleScreenRights(comboData.value, this.props.Login.masterData, this.props.Login.userInfo, selectedcombo);
            }
            else if (fieldName === "value") {
                const comboitem = this.state.comboitem || {};
                comboitem[fieldName] = comboData;
                this.setState({ comboitem });
            }
            else if (fieldName === "nformcode") {
                const selectedRecord = this.state.selectedRecord || {};
                selectedRecord["nformcode"] = comboData;
                let availableDatas = [];
                this.state.selectedRecord.nformcode.map(data => {
                    return availableDatas.push(data.item);
                });
                this.setState({ selectedRecord, availableDatas });
            }
        }
    }

    onComboChangeUserRole = (comboData, fieldName) => {
        if (comboData != null) {
            const selectedRecord = this.state.selectedRecord || {}; //this.state.selectedRecord || {};
            selectedRecord["nuserrole"] = comboData;
            if (fieldName === "nuserrole") {
                this.props.checkUserRoleScreenRights(comboData.value, this.props.Login.masterData, this.props.Login.userInfo, selectedRecord);
            }
        }
    }

    onInputOnChange = (event) => {
        const selectedRecord = this.state.selectedRecord || {};
        if (event.target.type === 'checkbox') {
            if (event.target.name === "ntransactionstatus")
                selectedRecord[event.target.name] = event.target.checked === true ? transactionStatus.ACTIVE : transactionStatus.DEACTIVE;
            else
                selectedRecord[event.target.name] = event.target.checked === true ? transactionStatus.YES : transactionStatus.NO;
        }
        else {
            selectedRecord[event.target.name] = event.target.value;
        }
        this.setState({ selectedRecord });
    }

    onInputOnControlRights(event, rowItem, columnName, rowIndex, saveType) {
        const selectedRecord = rowItem || {};
        selectedRecord[columnName] = event.target.checked === true ? transactionStatus.YES : transactionStatus.NO;
        this.saveClick(selectedRecord, saveType, undefined);
    }

    saveClick = (selectedRecord, saveType, formRef) => {
        let operation = "update";
        let methodUrl = "";
        let inputData = [];
        let postParam = {
            inputListName: "ScreenRights", selectedObject: "SelectedScreenRights",
            primaryKeyField: "nuserrolescreencode"
        }
        inputData["userinfo"] = this.props.Login.userInfo;
        inputData["selectedscreenrights"] = this.props.Login.masterData.SelectedScreenRights;
        inputData["nflag"] = transactionStatus.ACTIVE;
        inputData["screenrights"] = selectedRecord;
        if (saveType === 1) {
            inputData["nneedrights"] = selectedRecord["nneedrights"];
            inputData["nneedesign"] = null;
            methodUrl = "ControlRights";
        }
        else {
            inputData["nneedesign"] = selectedRecord["nneedesign"];
            methodUrl = "Esign";
        }
        const inputParam = {
            classUrl: "screenrights",
            methodUrl: methodUrl,
            displayName: this.props.Login.inputParam.displayName,
            inputData: inputData,
            operation: operation, saveType, formRef, searchRef: this.searchRef, postParam,dataState: this.state.dataState
        }
        this.props.crudMaster(inputParam, this.props.Login.masterData, "openModal");
    }


    onSaveClick = (saveType, formRef) => {
        let inputData = [];
        let inputParam = {};
        inputData["userinfo"] = this.props.Login.userInfo;
        let postParam = undefined;
        inputData["screenrights"] = this.state.availableDatas;
        inputData["nuserrolecode"] = this.state.selectedcombo["nuserrolecode"] ? this.state.selectedcombo["nuserrolecode"].value : "";
        inputData["userrolecode"] = this.state.selectedRecord["nuserrole"] ? this.state.selectedRecord["nuserrole"].value : "";
        inputParam = {
            classUrl: this.props.Login.inputParam.classUrl,
            methodUrl: "ScreenRights",
            inputData: inputData,
            operation: this.props.Login.operation,
            saveType, formRef, postParam, selectedRecord: this.state.selectedRecord,
            searchRef: this.searchRef,
            dataState: this.state.dataState
        }
        const masterData = this.props.Login.masterData;
        if (this.props.Login.screenName === "IDS_SCREENRIGHTS") {
            if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolCode)) {
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        loadEsign: true, screenData: { inputParam, masterData }, saveType
                    }
                }
                this.props.updateStore(updateInfo);
            }
            else {
                this.props.crudMaster(inputParam, masterData, "openModal");
            }
        } else {
            if (this.props.Login.masterData.copyScreenRights ? this.props.Login.masterData.copyScreenRights.length > 0 : false) {
                this.ConfirmComponent()
            }
            else {
                if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolCode)) {
                    const updateInfo = {
                        typeName: DEFAULT_RETURN,
                        data: {
                            loadEsign: true, screenData: { inputParam, masterData }, saveType
                        }
                    }
                    this.props.updateStore(updateInfo);
                }
                else {
                    this.props.copyScreenRights(this.state.selectedRecord ? this.state.selectedRecord["nuserrole"].value : "", this.state.selectedcombo["nuserrolecode"] ? this.state.selectedcombo["nuserrolecode"].value : "", this.props.Login.userInfo, this.props.Login.masterData);
                }
            }
        }
    }

    copyAlertSave = () => {
        let inputData = [];
        let inputParam = {};
        inputData["userinfo"] = this.props.Login.userInfo;
        let postParam = undefined;
        inputData["screenrights"] = this.state.availableDatas;
        inputData["nuserrolecode"] = this.state.selectedcombo["nuserrolecode"] ? this.state.selectedcombo["nuserrolecode"].value : "";
        inputData["userrolecode"] = this.state.selectedRecord ? this.state.selectedRecord["nuserrole"].value : "";
        inputParam = {
            classUrl: this.props.Login.inputParam.classUrl,
            methodUrl: "ScreenRights",
            inputData: inputData,
            operation: this.props.Login.operation,
            postParam, searchRef: this.searchRef
        }
        const masterData = this.props.Login.masterData;
        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolCode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData }
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.copyScreenRights(this.state.selectedRecord ? this.state.selectedRecord["nuserrole"].value : "", this.state.selectedcombo["nuserrolecode"] ? this.state.selectedcombo["nuserrolecode"].value : "", this.props.Login.userInfo, this.props.Login.masterData);
        }
    }

    onSaveAllControlAndEsign = (skip,take,saveType, formRef) => {
        let value = this.state.comboitem ? this.state.comboitem.value.value : this.ControlButton[0].value
        let operation = "";
        let methodUrl = "";
        let inputData = [];
        let postParam = undefined;
        inputData["userinfo"] = this.props.Login.userInfo;
       // inputData["selectedscreenrights"] = this.props.Login.masterData.SelectedScreenRights.slice(skip, skip + take);
        inputData["selectedscreenrights"] = this.props.Login.masterData.SelectedScreenRights;
        inputData["nflag"] = transactionStatus.DEACTIVE;
        postParam = {
            inputListName: "ScreenRights", selectedObject: "SelectedScreenRights",
            primaryKeyField: "nuserrolescreencode"
        }
        if (value === 1) {
            inputData["nneedrights"] = transactionStatus.YES;
            inputData["nneedesign"] = null;
            operation = "update";
            methodUrl = "ControlRights";
        }
        else if (value === 2) {
            inputData["nneedrights"] = transactionStatus.NO;
            inputData["nneedesign"] = null;
            operation = "update";
            methodUrl = "ControlRights";
        }
        else if (value === 3) {
            inputData["nneedesign"] = transactionStatus.YES;
            operation = "update";
            methodUrl = "Esign";
        }
        else if (value === 4) {
            inputData["nneedesign"] = transactionStatus.NO;
            operation = "update";
            methodUrl = "Esign";
        }

        const inputParam = {
            classUrl: "screenrights",
            methodUrl: methodUrl,
            displayName: this.props.Login.inputParam.displayName,
            inputData: inputData,
            operation: operation, saveType,
             formRef, postParam, 
             searchRef: this.searchRef, 
             selectedcombo: this.props.Login.selectedcombo,
        }
        this.props.crudMaster(inputParam, this.props.Login.masterData, "openModal");
    }

    //ALPD-1545
    ConfirmComponent = () => {
        this.confirmMessage.confirm("confirmation", this.props.intl.formatMessage({ id: "IDS_CONFIRMATION" }), this.props.intl.formatMessage({ id: "IDS_OVERWRITRTHEEXISTINGSCREENRIGHTS" }),
        this.props.intl.formatMessage({ id: "IDS_OK" }), this.props.intl.formatMessage({ id: "IDS_CANCEL" }), () => this.copyAlertSave());
    }

    componentWillUnmount() {
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                masterData: [], inputParam: undefined, operation: null, modalName: undefined
            }
        }
        this.props.updateStore(updateInfo);
    }

    handleClickDelete(masterData, ncontrolcode, modalName) {
        const fieldArray = [];
        this.props.Login.masterData.SelectedScreenRights.map(item => fieldArray.push(item.nuserrolescreencode));
        let postParam = {
            inputListName: "ScreenRights", selectedObject: "SelectedScreenRights",
            primaryKeyField: "nuserrolescreencode",
            primaryKeyValue: fieldArray,
            fetchUrl: "screenrights/getScreenRights",
            fecthInputObject: { userinfo: this.props.Login.userInfo },
        }
        modalName = 'openModal'

        const inputParam = {
            methodUrl: "ScreenRights",
            classUrl: "screenrights",
            inputData: { "screenrights": this.props.Login.masterData.SelectedScreenRights, "userinfo": this.props.Login.userInfo, "nuserrolecode": this.state.selectedcombo["nuserrolecode"] ? this.state.selectedcombo["nuserrolecode"].value : "" },
            operation: "delete", postParam,
            displayName: "Screen Rights",
           // dataState: this.state.dataState
        }

        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, ncontrolcode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData }, [modalName]: true,
                    operation: 'delete', screenName: "ScreenRights", id: "screenrights"
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.crudMaster(inputParam, masterData, modalName);
        }
    }

    reloadData = () => {
        if (this.props.Login.masterData.SelectedUserRole) {
            let comboitem = {}
            //let selectedcombo= this.state.selectedcombo;
            comboitem["value"] = this.ControlButton[0];
            this.searchRef.current.value = "";
            this.props.Login.masterData.searchedData= undefined;
            const inputParam = {
                inputData: { "userinfo": this.props.Login.userInfo },
                classUrl: "screenrights",
                methodUrl: "ScreenRights",
                displayName: "Screen Rights",
                userInfo: this.props.Login.userInfo,
                comboitem,
                nuserrolecode: this.props.Login.masterData.SelectedUserRole,
                masterData: this.props.Login.masterData,
                skip:this.state.skip,
                take:this.state.take

            };
            this.props.reload(inputParam);
        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTUSERROLE" }))
        }
    }
}

export default connect(mapStateToProps, {
    callService, reload, crudMaster, validateEsignCredential, filterTransactionList,
    updateStore, getScreenRightsDetail, getScreenRightsComboService, comboChangeUserRoleScreenRights, handleClickDelete, filterColumnData, getCopyUseRoleScreenRights, copyScreenRights, checkUserRoleScreenRights
})(injectIntl(ScreenRights));

