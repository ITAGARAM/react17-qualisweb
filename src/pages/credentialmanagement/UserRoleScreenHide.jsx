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
import AddScreenRights from './AddScreenRights';
import { showEsign, getControlMap, constructOptionList, sortData } from '../../components/CommonScript';

import {
    callService, crudMaster, validateEsignCredential, updateStore, getScreenRightsDetail, copyScreenRights, filterTransactionList,
    comboChangeUserRoleScreenRights, handleClickDelete, filterColumnData, getCopyUseRoleScreenRights, checkUserRoleScreenRights, reload

} from '../../actions';
import {
    initialcombochangeget, getUserScreenhideComboService, comboChangeUserRoleScreenRightsHide, getUserScreenhideDetail, ListSwitchUpdate
} from '../../actions/UserRoleScreenHideAction';

import { DEFAULT_RETURN } from '../../actions/LoginTypes';
import { transactionStatus } from '../../components/Enumeration';
import { ContentPanel, AtSubCard } from '../../components/App.styles';
import { AtTableWrap } from '../../components/data-grid/data-grid.styles';
import TransactionListMaster from '../../components/TransactionListMaster';
import { ProductList } from '../product/product.styled';
import ConfirmMessage from '../../components/confirm-alert/confirm-message.component';
import PerfectScrollbar from 'react-perfect-scrollbar';
//import SplitterLayout from '@progress/kendo-react-layout'; //'react-splitter-layout';
import { Splitter, SplitterPane } from '@progress/kendo-react-layout';
// import { Tooltip } from '@progress/kendo-react-tooltip';

import UserRoleScreenHideFilter from './UserRoleScreenHideFilter';
import { ReactComponent as RefreshIcon } from '../../assets/image/refresh.svg';
import BreadcrumbComponent from '../../components/Breadcrumb.Component';

{/* component commented by L.Subashini 13/12/2025 while upgrading to React 17 */}
//import ReactTooltip from 'react-tooltip';

{/* component used by L.Subashini 13/12/2025 while upgrading to React 17 */}
//import { Tooltip } from 'react-tooltip';


const mapStateToProps = state => {
    return ({ Login: state.Login })
}

class UserRoleScreenHide extends React.Component {
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
            
            selectedcombouser: undefined,
            userrnameList: [],
            selectedListmasterSwitch: undefined,
            custombuttonstate: false,
            ControlRightsParent:[],


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
            splitChangeWidthPercentage: 30,
               //Added by L.Subashini on 26/12/2025 for Splitter issue with React Version Upgrade to 17
            panes: [
                { size: '30%', min: '25%', resizable: true, collapsible:true }    
            ],
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


       //Added by L.Subashini on 25/12/2025 for Splitter issue with React Version Upgrade to 17
    onSplitterChange = (event) => {
        this.setState({ panes: event.newState});
    };

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
    render() {

        // console.log("master:", this.props.Login.masterData, this.state.dataResult)
        //added by allwin 
        ///FOR SORTING DATa BASED ON nusersrolehidescreencode***************************************************************
        this.props.Login.masterData.ScreenRights && sortData(this.props.Login.masterData.ScreenRights, '', 'nusersrolehidescreencode')
        const searchedData = this.props.Login.masterData.searchedData
        const ScreenRights = this.props.Login.masterData.ScreenRights || [];
        const addId = this.state.controlMap.has("AddUserScreenhide") && this.state.controlMap.get("AddUserScreenhide").ncontrolcode;
        const deleteId = this.state.controlMap.has("DeleteUserScreenhide") && this.state.controlMap.get("DeleteUserScreenhide").ncontrolcode;
        const copyId = this.state.controlMap.has("CopyScreenRights") && this.state.controlMap.get("CopyScreenRights").ncontrolcode;
        //const ListScreenHideId = this.state.controlMap.has("ListScreenHide") && this.state.controlMap.get("ListScreenHide").ncontrolcode;
       //console.log('kkkkk',this.props.Login.masterData.SelectedUserName)
        const filterParam = {
            inputListName: "ScreenRights",
            selectedObject: "SelectedScreenRights",
            primaryKeyField: "nformcode",
           
            fetchUrl: "userscreenhide/getSearchScreenHide",
            //  fetchUrl: "screenrights/getSearchScreenRights",
            userinfo: this.props.Login.userInfo,

            fecthInputObject: { userinfo: this.props.Login.userInfo, nusercode:this.props.Login.masterData.SelectedUserName&&
                this.props.Login.masterData.SelectedUserName.nusercode },
            masterData: this.props.Login.masterData,
            searchFieldList: this.searchFieldList, changeList: []
            , isSingleSelect: false,
        };
        // const filterParam = {
        //     inputListName: "ScreenRights",
        //     selectedObject: "SelectedScreenRights",
        //     primaryKeyField: "nuserrolescreencode",
        //     fetchUrl: "screenrights/getSearchScreenRights",
        //     userinfo: this.props.Login.userInfo,
        //     fecthInputObject: { userinfo: this.props.Login.userInfo },
        //     masterData: this.props.Login.masterData,
        //     searchFieldList: this.searchFieldList, changeList: [], isSingleSelect: false
        // };
        const mandatoryFieldsScreenRights = [
            { "mandatory": true, "idsName": "IDS_USERSCREENHIDE", "dataField": "nusersrolehidescreencode", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" }
        ];

        const mandatoryFieldsUsers = [{ "mandatory": true, "idsName": "IDS_SCREENRIGHTS", "dataField": "nformcode", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" }
        ];
        // let screenlen = searchedData ? searchedData.length : ScreenRights.length
        // const demo=[];
        // this.props.Login.masterData.UsersMain&&          
        // demo.push(
        //     {
        //         "label": "IDS_USER",
        //         "value": this.props.Login.masterData.UsersMain[0].susername

        //     },
        // );

        const breadCrumbData = this.state.filterData || [];
        return (
            <>
                {/* <ReactTooltip place="bottom" globalEventOff='click' id="tooltip_list_wrap" /> */}
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
                                <SplitterPane size="30%" min="20%">
                                <TransactionListMaster
                                    splitChangeWidthPercentage={this.state.splitChangeWidthPercentage}
                                    masterList={searchedData || ScreenRights || []}
                                    selectedMaster={this.props.Login.masterData.SelectedScreenRights}
                                    primaryKeyField="nusersrolehidescreencode"
                                    getMasterDetail={this.props.getUserScreenhideDetail}
                                    inputParam={{
                                        userinfo: this.props.Login.userInfo,
                                        masterData: this.props.Login.masterData,
                                        dataState: this.state.dataState, skip: this.state.skip, take: this.state.take
                                    }}
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
                                    //ListmasterSwitch
                                    ListmasterSwitch={this.ListmasterSwitch}
                                    selectedListmasterSwitch={this.state.selectedListmasterSwitch}
                                    ListScreenHidebtn= {this.state.controlMap.has("ListScreenHide") && this.state.controlMap.get("ListScreenHide").ncontrolcode}
                                    //  needrightsList={this.props.Login}
                                    filterComponent={[
                                        {
                                            "IDS_FILTER":
                                                <UserRoleScreenHideFilter
                                                    filterUserRole={this.state.userroleList || []}
                                                    userrnameList={this.state.userrnameList || []}
                                                    selectedRecord={this.state.selectedcombo || {}}//
                                                    selectedcombouser={this.state.selectedcombouser || {}}
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
                                            //    data-for="tooltip_list_wrap"
                                                role="button"
                                                hidden={this.state.userRoleControlRights.indexOf(addId) === -1}
                                                onClick={() => this.props.getUserScreenhideComboService("IDS_SCREENRIGHTS",
                                                    "create", this.props.Login.userInfo, this.state.selectedcombo, this.state.selectedcombouser, addId)}>
                                                <FontAwesomeIcon icon={faPlus} />
                                            </Button>
                                            <Button className="btn btn-circle outline-grey ml-2 p-0" variant="link"
                                                    data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_RELOAD"})}
                                              //  data-for="tooltip_list_wrap"
                                                onClick={() => this.onFilterSubmit()} >
                                                    <RefreshIcon className='custom_icons'/>
                                            </Button>
                                        </ProductList>
                                        // </Tooltip>
                                    }
                                />
                                </SplitterPane>
                                {/* <PerfectScrollbar> */}
                                {/* <SplitterLayout vertical borderColor="#999" percentage={true} primaryIndex={1} secondaryInitialSize={400} customClassName="fixed_list_height"> */}
                                {/* <Col md={9}> */}
                                <SplitterPane>
                                <PerfectScrollbar>
                                    <div className="fixed_list_height">
                                        <Row >
                                            <Col md={12}>
                                                <ContentPanel className="panel-main-content">
                                                    <Card className="border-0">
                                                        {this.props.Login.masterData.ScreenRights && this.props.Login.masterData.ScreenRights.length > 0 && this.props.Login.masterData.SelectedScreenRights ?
                                                            <>

                                                                <Card.Header className="pb-4" >
                                                                    {/* <ReactTooltip place="bottom" globalEventOff='click' id="screenrights_wrap" /> */}
                                                                    <Card.Title>
                                                                        <p className="product-title-main">
                                                                            {this.props.intl.formatMessage({ id: "IDS_HIDESCREENCONTROLRIGHTS" })}
                                                                        </p>
                                                                    </Card.Title>
                                                                    <ContentPanel className="d-flex justify-content-end d-inline">
                                                                        {/* <Tooltip position="bottom" anchorElement="target" openDelay={100} parentTitle={true}> */}
                                                                        <Nav.Link className="btn btn-circle outline-grey mr-2 action-icons-wrap"
                                                                                data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_DELETE" })}
                                                                            hidden={this.state.userRoleControlRights.indexOf(deleteId) === -1}
                                                                            role="button"
                                                                           // data-for="tooltip_list_wrap"
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
                                                                       //     data-for="tooltip_list_wrap"
                                                                            onClick={() => this.props.getCopyUseRoleScreenRights("User Role ScreenRights", "copy", copyId, this.state.selectedcombo, this.props.Login.userInfo, this.props.Login.masterData, 2)}>
                                                                            <FontAwesomeIcon icon={faCopy} />
                                                                        </Nav.Link>
                                                                        {/* </Tooltip> */}
                                                                    </ContentPanel>
                                                                </Card.Header>
                                                                <Row>
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
                                                                             //   data-for="tooltip_list_wrap"
                                                                                onClick={() => this.onSaveAllControlAndEsign(this.state.skip, this.state.take)}
                                                                                role="button">
                                                                                <FontAwesomeIcon icon={faSave} /> { }
                                                                            </Nav.Link>
                                                                            {/* </Tooltip> */}
                                                                        </AtSubCard>
                                                                    </Col>
                                                                    {/* <Col md='6' >
                                                                        <Row>
                                                                            <Col md={12}>
                                                                                <strong>
                                                                                    {this.props.intl.formatMessage({ id: "Enable/Disable Grouping" })}
                                                                                </strong>
                                                                            </Col> */}
                                                                    <Col>
                                                                        <span headerClassName="text-center"
                                                                         //   data-for="screenrights_wrap"
                                                                                data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_ENABLEDISABLEGROUPING" })}>

                                                                            <CustomSwitch type="switch"
                                                                                id={"groupbyswitch"}
                                                                                onChange={(event) => this.switchGroupBy(event)}
                                                                                checked={this.state.selectedSwitch === transactionStatus.YES ? true : false}
                                                                                name={"groupbyswitch"}
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
                                                            <AtTableWrap className="at-list-table">
                                                                <Grid
                                                                    sortable
                                                                    resizable
                                                                    reorderable={false}
                                                                    scrollable={"scrollable"}
                                                                    onExpandChange={this.expandChange}
                                                                    expandField="expanded"
                                                                    pageable={{ buttonCount: 4, pageSizes: this.props.Login.settings && this.props.Login.settings[15].split(",").map(setting => parseInt(setting)), previousNext: false }}
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
                                                                                    style={{ textAlign: 'left' }}>
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
                                                                                    style={{ textAlign: 'left' }}
                                                                                        data-tooltip-id="my-tooltip" data-tooltip-content={row["dataItem"]["scontrolids"]} >
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
                                                                                <td style={{ textAlign: "center" }} >
                                                                                    <CustomSwitch type="switch" id={row["dataItem"]["nneedrights"]}
                                                                                        onChange={(event) => this.onInputOnControlRights(event, row["dataItem"], "nneedrights", row.dataIndex, 1)}
                                                                                        checked={row["dataItem"]["nneedrights"] === transactionStatus.YES ? true : false}
                                                                                        name={row["dataItem"]["nusersrolehidescreencode"] + "_" + row.dataIndex + "_" + row.columnIndex}
                                                                                        // disabled={this.state.custombuttonstate}

                                                                                        disabled={row["dataItem"]["needrights"] === transactionStatus.YES ? true : false}
                                                                                    />
                                                                                </td>)}
                                                                    />
                                                                    <GridColumn width="230px"
                                                                        field={"nneedesign"}
                                                                        title={this.props.intl.formatMessage({ id: "IDS_ESIGN" })}
                                                                        headerClassName="text-center"
                                                                        cell={(row) => (
                                                                            row.rowType === "groupHeader" ? null :
                                                                                <td style={{ textAlign: "center" }} >
                                                                                    {row["dataItem"]["nisesigncontrol"] === 3 ?
                                                                                        <CustomSwitch type="switch" id={row["dataItem"]["nneedesign"]}
                                                                                          onChange={(event) => this.onInputOnControlRights(event, row["dataItem"], "nneedesign", row.dataIndex, undefined,row["dataItem"]["needesignsparent"])}
                                                                                            checked={row["dataItem"]["nneedesign"] === transactionStatus.YES ? true : false}
                                                                                            name={row["dataItem"]["nusersrolehidescreencode"] + "_" + row.dataIndex + "_" + row.columnIndex}
                                                                                          //  disabled={row["dataItem"]["needrights"] === transactionStatus.YES ? true : false}
                                                                                          //  disabled={row["dataItem"]["needesignsparent"] === transactionStatus.NO ? true : false}
                                                                                        /> :
                                                                                        ""
                                                                                    }
                                                                                </td>
                                                                        )
                                                                        }
                                                                    /> 
                                                                </Grid>
                                                            </AtTableWrap>
                                                            : ""}
                                                    </Card>
                                                </ContentPanel>
                                            </Col>
                                        </Row>
                                    </div>
                                </PerfectScrollbar>
                                </SplitterPane>
                                {/* </SplitterLayout> */}
                                {/* </PerfectScrollbar> */}
                            </Splitter>
                            {/* </SplitterLayout > */}
                        </Col>
                    </Row>
                </div>
                {/* End of get display*/}
                { }
                {
                    this.props.Login.openModal &&
                    <SlideOutModal show={this.props.Login.openModal}
                        closeModal={this.closeModal}
                        operation={this.props.Login.operation}
                        inputParam={this.props.Login.inputParam}
                        screenName={'IDS_USERSCREENHIDE'}
                        onSaveClick={this.onSaveClick}
                        esign={this.props.Login.loadEsign}
                        validateEsign={this.validateEsign}
                        masterStatus={this.props.Login.masterStatus}
                        selectedRecord={this.state.selectedRecord || {}}
                        mandatoryFields={this.props.Login.screenName === "IDS_USERSCREENHIDE" ? mandatoryFieldsScreenRights : mandatoryFieldsUsers}
                        updateStore={this.props.updateStore}
                        addComponent={
                            this.props.Login.loadEsign ?
                            <Esign operation={this.props.Login.operation}
                                onInputOnChange={this.onInputOnChange}
                                inputParam={this.props.Login.inputParam}
                                selectedRecord={this.state.selectedRecord || {}}
                            />
                            // : this.props.Login.screenName === "IDS_USERSCREENHIDE" ?
                            : <AddScreenRights selectedRecord={this.state.selectedRecord || {}}
                                onInputOnChange={this.onInputOnChange}
                                onComboChange={this.onComboChange}
                                avaliableScreen={this.props.Login.AvaliableScreen}
                                operation={this.props.operation}
                            />
                            // :
                            // <UserRoleScreenRights selectedRecord={this.props.Login.masterData.selectedRecord || {}}
                            //     onInputOnChange={this.onInputOnChange}
                            //     onComboChange={this.onComboChangeUserRole}
                            //     operation={this.props.operation}
                            //     UserRole={this.props.Login.masterData.Userrole || []}
                            //     SelectedUserRole={this.state.selectedcombo}
                            // />
                        }
                    />
                }
                { }
            </>
        );
    }

    ListmasterSwitch = (event, nusersrolehidescreencode) => {
       // let inputData = [];
        //  inputData["nuserrolecode"] = this.state.selectedcombo["nuserrolecode"];
        // inputData["nusercodemain"] = this.state.selectedcombouser["nusercode"];
        const selectedSwitch = event.target.checked === true ? transactionStatus.YES : transactionStatus.NO;
        const inputParam = {
            needrights: selectedSwitch,
            nusersrolehidescreencode: nusersrolehidescreencode,
            nuserrolecode: this.state.selectedcombo["nuserrolecode"].value,
            nusercodemain: this.state.selectedcombouser["nusercode"].value
        }
        this.props.ListSwitchUpdate(inputParam, this.props.Login.masterData, this.props.Login.userInfo);
        // this.setState({selectedListmasterSwitch:selectedSwitch});
    }
    switchGroupBy = (event) => {

        const selectedSwitch = event.target.checked === true ? transactionStatus.YES : transactionStatus.NO;
        let dataState = this.state.dataState || {};
        if (selectedSwitch === transactionStatus.YES) {
            dataState = { ...dataState, group: [{ field: 'screenname' }] };
        }
        else {
            dataState = { skip: dataState.skip, take: dataState.take }
        }
        this.setState({ selectedSwitch, dataState });
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
        this.searchRef.current.value = "";
        // this.reloadData(this.state.selectedRecord, true);
        let inputData = [];
        inputData["nuserrolecode"] = this.state.selectedcombo["nuserrolecode"];
        inputData["nusercodemain"] = this.state.selectedcombouser["nusercode"];
        // const inputParam = {
        //     classUrl: "userscreenhide",
        //     methodUrl: "UserScreenhide",
        //     displayName: "IDS_USERSCREENHIDE",
        //     inputData: inputData
        //     //,
        //     // operation: operation, saveType, formRef, searchRef: this.searchRef, postParam,dataState: this.state.dataState
        // }
        if (this.state.selectedcombo["nuserrolecode"]) {
            this.props.comboChangeUserRoleScreenRightsHide(this.state.selectedcombo, this.state.selectedcombouser, this.props.Login.masterData, this.props.Login.userInfo);

            // this.props.crudMaster(inputParam, this.props.Login.masterData, "openModal");
            //  this.props.callService(inputParam);


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
        //   if (this.props.Login.masterData && this.props.Login.masterData.userrole) {

        breadCrumbData.push(
            {
                "label": "IDS_USERROLE",
                "value": this.props.Login.masterData.SelectedUserRole ? this.props.Login.masterData.SelectedUserRole.suserrolename : "NA",
               // "label": "IDS_USERNAME",
              //  "value": this.props.Login.masterData.SelectedUserName ? this.props.Login.masterData.SelectedUserName.susername : "NA",
            },{
              //  "label": "IDS_USERROLE",
               // "value": this.props.Login.masterData.SelectedUserRole ? this.props.Login.masterData.SelectedUserRole.suserrolename : "NA",
               "label": "IDS_USERNAME",
                "value": this.props.Login.masterData.SelectedUserName ? this.props.Login.masterData.SelectedUserName.susername : "NA",
            }
        );
        // } else {
        //     breadCrumbData.push(
        //         {
        //             "label": "IDS_USERROLE",
        //             "value": "NA"

        //         },
        //     );
        // }
        return breadCrumbData;
    }

    componentDidUpdate(previousProps) {

        /* component commented by L.Subashini 13/12/2025 while upgrading to React 17 */
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
        if (this.props.Login.masterData.AvaliableScreen !== previousProps.Login.masterData.AvaliableScreen) {
            let skip = this.state.skip;
            let take = this.state.take;
            skip = this.props.Login.skip === undefined ? skip : this.props.Login.skip;
            take = this.props.Login.take || take;

            this.setState({ skip, take });
        }

        if (this.props.Login.userInfo.nformcode !== previousProps.Login.userInfo.nformcode) {
            const userRoleControlRights = [];
            if (this.props.Login.userRoleControlRights) {
                this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode] && Object.values(this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode]).map(item =>
                    userRoleControlRights.push(item.ncontrolcode))
            }

            const controlMap = getControlMap(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode)
            this.setState({
                userRoleControlRights, controlMap, data: this.props.Login.masterData.ControlRights
            });
        }
        if (this.props.Login.masterData.userrole !== undefined) {
            if (this.props.Login.masterData.userrole !== previousProps.Login.masterData.userrole) {
                const userrole = constructOptionList(this.props.Login.masterData.userrole || [], "nuserrolecode",
                    "suserrolename", undefined, undefined, undefined);
                const userroleList = userrole.get("OptionList");

                const selectedcombo = {
                    nuserrolecode: masterData.userrole && masterData.userrole.length > 0 ? {
                        "value": masterData.userrole[0].nuserrolecode,
                        "label": masterData.userrole[0].suserrolename
                    } : ""
                }
                this.setState({
                    selectedcombo: selectedcombo,
                    userroleList: userroleList
                });
            }
        }
        //Added by Allwin
        if (this.props.Login.masterData.UsersMain !== previousProps.Login.masterData.UsersMain) {
            const UsersMain = constructOptionList(this.props.Login.masterData.UsersMain || [], "nusercode",
                "susername", undefined, undefined, undefined);
            const userrnameList = UsersMain.get("OptionList");

            const selectedcombouser = {
                nusercode: masterData.UsersMain && masterData.UsersMain.length > 0 ? {
                    "value": masterData.UsersMain[0].nusercode,
                    "label": masterData.UsersMain[0].susername
                } : ""
            }
            this.setState({
                selectedcombouser: selectedcombouser,
                userrnameList: userrnameList
            });
        }
        //         if('SelectedScreenRights' in this.props.Login.masterData)
        //         {
        //             if(this.props.Login.masterData.SelectedScreenRights.length>0)
        //             {
        //                 if('SelectedScreenRights' in previousProps.Login.masterData)
        //                 {
        //                     if(previousProps.Login.masterData.SelectedScreenRights.length>0)
        //            {
        //             if(this.props.Login.masterData.SelectedScreenRights[0].needrights!==
        //                 previousProps.Login.masterData.SelectedScreenRights[0].needrights)
        //                 {
        // if( this.props.Login.masterData.SelectedScreenRights[0].needrights===3)
        // {
        //     this.setState({custombuttonstate:true})
        // }
        // else
        // {
        //     this.setState({custombuttonstate:false}) 
        // }
        //                 }
        //             }
        //             }
        //             }
        //         }
        if (this.props.Login.masterData !== previousProps.Login.masterData) {
            const filterData = this.generateBreadCrumData();

            // let dataState = this.state.dataState || {};
            // dataState= {...dataState, group: [{ field: 'screenname' }]} ;

            this.setState({
                filterData//, dataState
            });
        }


        // if(this.props.Login.masterData.searchedData !== this.props.Login.masterData.ScreenRights){
        //    if (this.props.Login.masterData.searchedData) 
        //    {
        //     if(this.props.Login.masterData.searchedData.length<= this.state.skip){
        //         this.setState({skip:0});
        //     }
        // }
        // }


    }


    handlePageChange = e => {
        // console.log('zzzzzzzzzz',e.skip)
        // console.log('zzzzzzzzzz1',e.take)
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
                selectedRecord = {}
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

                //Added by Allwin for Combo Change Get
                // const inputParamcombo = {
                //     nuserrolecode: comboData.item.nuserrolecode
                // };

               // const selectedcombouser = this.state.selectedcombouser || {};
                // selectedcombouser= this.props.initialcombochangeget(comboData.item.nuserrolecode);
                this.props.initialcombochangeget(comboData.item.nuserrolecode,this.props.Login.masterData,this.props.Login.userInfo);
            //    this.props.initialcombochangeget(comboData.item.nuserrolecode);
               
              //  this.props.initialcombochangeget(comboData.item.nuserrolecode,this.props.Login.masterData, this.props.Login.userInfo);
               
               
                //this.setState({ selectedcombo});

                // let dataState = this.state.dataState || {};
                // dataState= {...dataState, group: [{ field: 'screenname' }]} ;


                // masterData["ControlRights"]=[]
                // this.props.comboChangeUserRoleScreenRights(comboData.value, this.props.Login.masterData, this.props.Login.userInfo, selectedcombo);
            }
            else if (fieldName === "nusercode") {
                const selectedcombouser = this.state.selectedcombouser || {};
                selectedcombouser[fieldName] = comboData;
                this.setState({ selectedcombouser });
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

    onInputOnControlRights(event, rowItem, columnName, rowIndex, saveType,needesignparent) {
        //  const selectedRecord = rowItem || {};
        // selectedRecord[]
        const selectedRecord = {};
         if(needesignparent===4)
         {
             toast.warn(this.props.intl.formatMessage({ id: "IDS_ITISDEACTIVEINSCREENRIGHTS" }))
       }
        else
    {
        if (rowItem["needrights"] !== 3) {
            selectedRecord["ncontrolcode"] = rowItem["ncontrolcode"]
            selectedRecord["nformcode"] = rowItem["nformcode"]
            //    selectedRecord["needrights"]= rowItem["needrights"]
            selectedRecord["nstatus"] = rowItem["nstatus"]
            selectedRecord["nuserrolecode"] = this.state.selectedcombo["nuserrolecode"].value
            selectedRecord["nusercode"] = this.state.selectedcombouser["nusercode"].value
            selectedRecord["scontrolids"] = rowItem["scontrolids"]
            selectedRecord["scontrolname"] = rowItem["scontrolname"]
            selectedRecord["screenname"] = rowItem["screenname"]
        //    if(columnName==="nneedesign")  
        //    {
        //    selectedRecord["nneedesign"]=rowItem["nneedesign"]
        //    }
            // ncontrolcode: 133
            // nformcode: 44

            // nneedrights: 3
            // nstatus: 1
            // nuserrolecode: 0
            // scontrolids: "Delete Charge Band"
            // scontrolname: "DeleteChargeBand"
            // screenname: "Charge Band"

            if(columnName==="nneedesign")  
            {
                selectedRecord["nneedesign"] = event.target.checked === true ? transactionStatus.YES : transactionStatus.NO;
            }
            else
            {
            selectedRecord["needrights"] = event.target.checked === true ? transactionStatus.YES : transactionStatus.NO;
            }
            this.saveClick(selectedRecord, saveType, undefined);
        }
    }
    }

    saveClick = (selectedRecord, saveType, formRef) => {
        let operation = "update";
       // let methodUrl = "";
        let inputData = [];
        let postParam = {
            inputListName: "ScreenRights", selectedObject: "SelectedScreenRights",
            primaryKeyField: "nusersrolehidescreencode"
        }
        inputData["userinfo"] = this.props.Login.userInfo;
        inputData["selectedscreenrights"] = this.props.Login.masterData.SelectedScreenRights;
        inputData["nflag"] = transactionStatus.ACTIVE;
        inputData["screenrights"] = selectedRecord;
        if (saveType === 1) {
            inputData["needrights"] = selectedRecord["needrights"];
            inputData["nneedesign"] = null;
            //methodUrl = "ControlRights";
        }
        else {
            inputData["nneedesign"] = selectedRecord["nneedesign"];
           // methodUrl = "Esign";
        }
        const inputParam = {
            classUrl: "userscreenhide",
            methodUrl: "ScreenHideControlRights",
            displayName: this.props.Login.inputParam.displayName,
            inputData: inputData,
            operation: operation, saveType, formRef, searchRef: this.searchRef, postParam, dataState: this.state.dataState
        }
        this.props.crudMaster(inputParam, this.props.Login.masterData, "openModal");
    }


    onSaveClick = (saveType, formRef) => {
        let inputData = [];
        let inputParam = {};
        inputData["userinfo"] = this.props.Login.userInfo;
        let postParam = undefined;
        inputData["userscreenhide"] = this.state.availableDatas;
        inputData["nuserrolecode"] = this.state.selectedcombo["nuserrolecode"] ? this.state.selectedcombo["nuserrolecode"].value : "";
        inputData["userrolecode"] = this.state.selectedRecord["nuserrole"] ? this.state.selectedRecord["nuserrole"].value : "";
        inputData["usercode"] = this.state.selectedcombouser["nusercode"] ? this.state.selectedcombouser["nusercode"].value : "";
        // inputData["nusercode"] = this.state.selectedcombouser["nusercode"] ? this.state.selectedcombouser["nusercode"].value : "";
        inputParam = {
            classUrl: this.props.Login.inputParam.classUrl,
            methodUrl: "UserScreenhide",
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

    onSaveAllControlAndEsign = (skip, take, saveType, formRef) => {
        let value = this.state.comboitem ? this.state.comboitem.value.value : this.ControlButton[0].value
        let operation = "";
       // let methodUrl = "";
        let inputData = [];
        let postParam = undefined;
        inputData["userinfo"] = this.props.Login.userInfo;
        // inputData["selectedscreenrights"] = this.props.Login.masterData.SelectedScreenRights.slice(skip, skip + take);
        inputData["selectedscreenrights"] = this.props.Login.masterData.SelectedScreenRights;
        inputData["nflag"] = transactionStatus.DEACTIVE;
        postParam = {
            inputListName: "ScreenRights", selectedObject: "SelectedScreenRights",
            primaryKeyField: "nusersrolehidescreencode"
        }
        if (value === 1) {
            inputData["needrights"] = transactionStatus.YES;
            inputData["nneedesign"] = null;
            operation = "update";
           // methodUrl = "ControlRights";
        }
        else if (value === 2) {
            inputData["needrights"] = transactionStatus.NO;
            inputData["nneedesign"] = null;
            operation = "update";
          //  methodUrl = "ControlRights";
        }
        else if (value === 3) {
            inputData["nneedesign"] = transactionStatus.YES;
            operation = "update";
          //  methodUrl = "Esign";
        }
        else if (value === 4) {
            inputData["nneedesign"] = transactionStatus.NO;
            operation = "update";
          //  methodUrl = "Esign";
        }

        const inputParam = {
            classUrl: "userscreenhide",
            methodUrl: "ScreenHideControlRights",
            displayName: this.props.Login.inputParam.displayName,
            inputData: inputData,
            operation: operation, saveType,
            formRef, postParam,
            searchRef: this.searchRef,
            selectedcombo: this.props.Login.selectedcombo,
        }
        this.props.crudMaster(inputParam, this.props.Login.masterData, "openModal");
    }

    ConfirmComponent = () => {
        this.confirmMessage.confirm("confirmation", "Confiramtion!", this.props.intl.formatMessage({ id: "IDS_OVERWRITRTHEEXISTINGSCREENRIGHTS" }),
            "ok", "cancel", () => this.copyAlertSave());
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
        this.props.Login.masterData.SelectedScreenRights.map(item => fieldArray.push(item.nusersrolehidescreencode));
        let postParam = {
            inputListName: "UserScreenhide", selectedObject: "SelectedScreenRights",
            primaryKeyField: "nusersrolehidescreencode",
            primaryKeyValue: fieldArray,
            fetchUrl: "userscreenhide/getUserScreenhide",
            fecthInputObject: { userinfo: this.props.Login.userInfo },
        }
        modalName = 'openModal'

        const inputParam = {
            methodUrl: "UserScreenhide",
            classUrl: "userscreenhide",
            inputData: {
                "screenrights": this.props.Login.masterData.SelectedScreenRights,
                "userinfo": this.props.Login.userInfo,
                "nuserrolecode": this.state.selectedcombo["nuserrolecode"]
                    ? this.state.selectedcombo["nuserrolecode"].value : ""
                , "usercode": this.state.selectedcombouser["nusercode"]
                    ? this.state.selectedcombouser["nusercode"].value : ""
            },
            operation: "delete", postParam,
            displayName: "IDS_USERSCREENHIDE",
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
        this.searchRef.current.value = "";
        if (this.props.Login.masterData.SelectedUserRole) {
            let comboitem = {}
            //let selectedcombo= this.state.selectedcombo;
            comboitem["value"] = this.ControlButton[0];
            this.searchRef.current.value = "";
            const inputParam = {
                inputData: { "userinfo": this.props.Login.userInfo },
                classUrl: "userscreenhide",
                methodUrl: "getUserScreenhide",
                displayName: "UserScreenhide",
                userInfo: this.props.Login.userInfo,
                comboitem,
                nuserrolecode: this.props.Login.masterData.SelectedUserRole,
                masterData: this.props.Login.masterData,
                skip: this.state.skip,
                take: this.state.take

            };
            this.props.reload(inputParam);
        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTUSERROLE" }))
        }
    }
}

export default connect(mapStateToProps, {
    callService, reload, crudMaster, validateEsignCredential, filterTransactionList,
    updateStore, getScreenRightsDetail, getUserScreenhideComboService, comboChangeUserRoleScreenRights, handleClickDelete, filterColumnData, getCopyUseRoleScreenRights, copyScreenRights, checkUserRoleScreenRights,
    sortData, initialcombochangeget, comboChangeUserRoleScreenRightsHide, getUserScreenhideDetail, ListSwitchUpdate
})(injectIntl(UserRoleScreenHide));

