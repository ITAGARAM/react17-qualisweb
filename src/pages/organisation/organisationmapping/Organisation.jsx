import React from 'react';
import { toast } from 'react-toastify';
import { process } from '@progress/kendo-data-query';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { Affix } from 'rsuite';
import Tree from 'react-tree-graph';

//import '../../../../node_modules1/react-simple-tree-menu/dist/main.css';

import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSync } from '@fortawesome/free-solid-svg-icons';
import { Row, Col, Button, Card, Nav } from 'react-bootstrap';
import 'react-perfect-scrollbar/dist/css/styles.css';
import 'react-tree-graph/dist/style.css';

import {
    callService, crudMaster, updateStore, validateEsignCredential, organisationService,
    getSectionUserRole, getOrganisationComboService
} from '../../../actions';

import AddChild from './AddChild';
import Esign from '../../../pages/audittrail/Esign';
import SlideOutModal from '../../../components/slide-out-modal/SlideOutModal';
import FormSelectSearch from '../../../components/form-select-search/form-select-search.component';
import ConfirmMessage from '../../../components/confirm-alert/confirm-message.component';
import { transactionStatus } from '../../../components/Enumeration';
import { showEsign, getControlMap, constructOptionList } from '../../../components/CommonScript';
import DataGrid from '../../../components/data-grid/data-grid.component';

import FormTreeMenu from '../../../components/form-tree-menu/form-tree-menu.component';
import { DEFAULT_RETURN } from '../../../actions/LoginTypes';

import './treegraph.css';
import { SearchAdd } from '../../../components/App.styles';
import { ReactComponent as Graph } from '../../../assets/image/organisational-graph.svg';
// import ReactTooltip from 'react-tooltip';

const mapStateToProps = state => {
    return ({ Login: state.Login })
}

class Organisation extends React.Component {

    constructor(props) {
        super(props);
        this.formRef = React.createRef();
        this.childRef = React.createRef();

        const dataState = {
            skip: 0
        };
        this.confirmMessage = new ConfirmMessage();
        this.state = {
            data: [], masterStatus: "", error: "", selectedRecord: {},
            dataResult: [], dataState: dataState,
            userRoleControlRights: [],
            controlMap: new Map(),

            selectedClass: 'selectedClass',
            siteClass: 'siteClass',
            deptClass: 'deptClass',
            labClass: 'labClass',
            sectionClass: 'sectionClass',
            userClass: 'userClass',

        };

        this.usersColumnList = [{ "idsName": "IDS_USERNAME", "dataField": "susername", "width": "300px" , "mandatoryLabel":"IDS_SELECT", "controlType": "selectbox"},
        { "idsName": "IDS_EMPLOYEENO", "dataField": "sempid", "width": "300px" , "mandatoryLabel":"IDS_SELECT", "controlType": "selectbox"},
        { "idsName": "IDS_DESIGNATION", "dataField": "sdesignationname", "width": "200px", "mandatoryLabel":"IDS_SELECT", "controlType": "selectbox" },
        ];

        this.roleColumnList = [{ "idsName": "IDS_ROLE", "dataField": "suserrolename", "width": "150px", "mandatoryLabel":"IDS_SELECT", "controlType": "selectbox" },
        { "idsName": "IDS_DEFAULTROLE", "dataField": "sdefaultstatus", "width": "100px" , "mandatoryLabel":"IDS_SELECT", "controlType": "selectbox"},
        ];
        this.siteDepartmentColumnList = [{ "mandatory": false, "controlType": "textbox", "idsName": "IDS_SITE", "dataField": "ssitename", "mandatoryLabel":"IDS_ENTER" },
        {
            "mandatory": true, "idsName": "IDS_DEPARTMENT",
            "dataField": "ndeptcode", "optionId": "ndeptcode", "optionValue": "sdeptname", "mandatoryLabel":"IDS_SELECT", "controlType": "selectbox"
        }];

        this.deptLabColumnList = [{ "mandatory": false, "controlType": "textbox", "idsName": "IDS_DEPTNAME", "dataField": "sdeptname", "mandatoryLabel":"IDS_ENTER" },
        {
            "mandatory": true, "idsName": "IDS_LAB",
            "dataField": "nlabcode", "optionId": "nlabcode", "optionValue": "slabname", "mandatoryLabel":"IDS_SELECT", "controlType": "selectbox"
        }];

        this.labSectionColumnList = [{ "mandatory": false, "controlType": "textbox", "idsName": "IDS_LAB", "dataField": "slabname", "mandatoryLabel":"IDS_ENTER"},
        {
            "mandatory": true, "idsName": "IDS_SECTION",
            "dataField": "nsectioncode", "optionId": "nsectioncode", "optionValue": "ssectionname", "mandatoryLabel":"IDS_SELECT", "controlType": "selectbox"
        }];

        this.sectionUserColumnList = [{ "mandatory": false, "controlType": "textbox", "idsName": "IDS_SECTION", "dataField": "ssectionname" , "mandatoryLabel":"IDS_ENTER"},
        {
            "mandatory": true, "idsName": "IDS_USERS",
            "dataField": "nusercode", "optionId": "nusercode", "optionValue": "susername", "mandatoryLabel":"IDS_SELECT", "controlType": "selectbox"
        }];
    }

    dataStateChange = (event) => {

        // const viewParam = {
        //     nsitecode: this.props.Login.masterData.SelectedOrgSite && this.props.Login.masterData.SelectedOrgSite.nsitecode,
        //     userInfo: this.props.Login.userInfo, primaryKeyField: "nusercode",
        //     masterData: this.props.Login.masterData
        // };

        this.setState({ dataState: event.dataState, dataResult: process(this.state.data, event.dataState) })
        // const row = process(this.state.data, event.dataState);
        // if (row.data.length > 0) {
        //     this.props.getSectionUserRole({
        //         ...viewParam,
        //         primaryKeyValue: row.data[0][viewParam.primaryKeyField],
        //         viewRow: row.data[0], data: this.state.data, dataResult: row, dataState: event.dataState
        //     });
        // }
    }

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

    handleDateChange = (dateName, dateValue) => {
        const { selectedRecord } = this.state;
        selectedRecord[dateName] = dateValue;
        this.setState({ selectedRecord });
    }

    render() {

        const addId = this.state.controlMap.has("Add") && this.state.controlMap.get("Add").ncontrolcode;
        const deleteId = this.state.controlMap.has("Delete") && this.state.controlMap.get("Delete").ncontrolcode;
        const addUserId = this.state.controlMap.has("AddSectionUsers") && this.state.controlMap.get("AddSectionUsers").ncontrolcode;

        const usersDeleteParam = {
            operation: "delete", methodUrl: "SectionUsers",
            nextNode: "Section",
            inputData: {
                userinfo: this.props.Login.userInfo,
                nsitecode: this.props.Login.masterData.SelectedOrgSite && this.props.Login.masterData.SelectedOrgSite.nsitecode
            }
        };

        const selectedOrgSite = this.props.Login.masterData.SelectedOrgSite || {};

        let deleteParam = {};
        let comboDataList = [];
        let columnList = [];
        if (this.props.Login.organisation && this.props.Login.organisation.selectedNode === "Site") {
            comboDataList = this.props.Login.siteDepartmentList || [];
            columnList = this.siteDepartmentColumnList;
        }
        else if (this.props.Login.organisation && this.props.Login.organisation.selectedNode === "Department") {
            comboDataList = this.props.Login.departmentLabList || [];
            columnList = this.deptLabColumnList;
            deleteParam = {
                screenName: "SiteDepartment", methodUrl: "SiteDepartment",
                operation: "delete",
                nextNode: "Site",
                inputData: {//sitedepartment:this.props.Login.organisation.selectedNodeDetail,
                    nsitedeptcode: this.props.Login.organisation.primaryKeyValue,
                    userinfo: this.props.Login.userInfo
                }
            };
        }
        else if (this.props.Login.organisation && this.props.Login.organisation.selectedNode === "Lab") {
            comboDataList = this.props.Login.labSectionList || [];
            columnList = this.labSectionColumnList;
            deleteParam = {
                screenName: "DepartmentLab",
                methodUrl: "DepartmentLab",
                operation: "delete",
                nextNode: "Department",
                inputData: {//departmentlab:this.props.Login.organisation.selectedNodeDetail,
                    ndeptlabcode: this.props.Login.organisation.primaryKeyValue,
                    userinfo: this.props.Login.userInfo,
                    nsitecode: this.props.Login.masterData.SelectedOrgSite && this.props.Login.masterData.SelectedOrgSite.nsitecode
                }
            };
        }
        else if (this.props.Login.organisation && this.props.Login.organisation.selectedNode === "Section") {
            comboDataList = this.props.Login.sectionUsersList || [];
            columnList = this.sectionUserColumnList;

            deleteParam = {
                screenName: "LabSection",
                methodUrl: "LabSection",
                operation: "delete",
                nextNode: "Lab",
                inputData: {//labsection:this.props.Login.organisation.selectedNodeDetail, 
                    nlabsectioncode: this.props.Login.organisation.primaryKeyValue,
                    userinfo: this.props.Login.userInfo,
                    nsitecode: this.props.Login.masterData.SelectedOrgSite && this.props.Login.masterData.SelectedOrgSite.nsitecode
                }
            };
        }
        // const deleteConfirmMsg = `IDS_CONFIRMDELETE${this.props.Login.organisation && this.props.Login.organisation.selectedNode && this.props.Login.organisation.selectedNode.toUpperCase()}`;

        const selectedPath = this.props.Login.masterData && this.props.Login.masterData.CompleteTreePath
            && this.props.Login.masterData.CompleteTreePath.replaceAll("/", " / ");

        //  const confirmMessage = new ConfirmMessage();

        const mandatoryFields = [];
        columnList.forEach(item => item.mandatory === true ?
            mandatoryFields.push(item) : ""
        );

        const defaultHeight = 600;
        let graphHeight = this.props.Login.graphHeight ? this.props.Login.graphHeight : defaultHeight;
        if (graphHeight < defaultHeight) {
            graphHeight = defaultHeight;
        }
        return (
            <>
                {/* <ReactTooltip place="bottom" globalEventOff='click' id="tooltip_list_wrap" /> */}
                <div className="client-listing-wrap mtop-5">

                    {/* Start of get display*/}
                    <Row noGutters>
                        <Col md={5}>
                            <Affix top={65}>
                                <Row>
                                    <Col md={12}>
                                        <SearchAdd className="org-tree-search">
                                            <Row>
                                                <Col md={5}>
                                                    <FormSelectSearch
                                                        name={"nsitecode"}
                                                        formLabel={this.props.intl.formatMessage({ id: "IDS_SITE" })}
                                                        placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                                        options={this.state.siteList || []}
                                                        value={this.props.Login.masterData && this.props.Login.masterData.SelectedOrgSite
                                                            && {
                                                            value: this.props.Login.masterData.SelectedOrgSite.nsitecode,
                                                            label: this.props.Login.masterData.SelectedOrgSite.ssitename
                                                        }}
                                                        isMandatory={true}
                                                        isMulti={false}
                                                        isClearable={false}
                                                        isSearchable={true}
                                                        isDisabled={false}
                                                        closeMenuOnSelect={true}
                                                        className="mb-2"
                                                        onChange={(event) => this.onComboChange(event, 'nsitecode')}
                                                    />
                                                </Col>

                                                <Col md={7}>
                                                    {/* <ReactTooltip place="bottom" globalEventOff='click'/> */}
                                                    <Button
                                                        className="btn btn-icon-rounded btn-circle solid-blue"
                                                        role="button"
                                                        data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_ADD" })}
                                                        hidden={this.state.userRoleControlRights.indexOf(addId) === -1}
                                                        onClick={() => this.openModal()}>
                                                        <FontAwesomeIcon icon={faPlus} />
                                                    </Button>

                                                    <Nav.Link
                                                        name="deleteLink"
                                                        hidden={this.state.userRoleControlRights.indexOf(deleteId) === -1}
                                                        className="btn btn-circle outline-grey ml-2"
                                                        data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_DELETE" })}
                                                      //  data-for="tooltip_list_wrap"
                                                        onClick={() => this.props.Login.organisation ? this.confirmDelete({ ...deleteParam }) : toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTNODETODELETE" }))}
                                                    >
                                                        <FontAwesomeIcon icon={faTrashAlt} />

                                                        {/* <ConfirmDialog
                                                            name="deleteMessage"
                                                            message={this.props.intl.formatMessage({ id: `${deleteConfirmMsg}`})}
                                                            doLabel={this.props.intl.formatMessage({ id: "IDS_OK" })}
                                                            doNotLabel={this.props.intl.formatMessage({ id: "IDS_CANCEL" })}
                                                            icon={faTrashAlt}
                                                            title={this.props.intl.formatMessage({ id: "IDS_DELETE" })}
                                                            hidden={this.state.userRoleControlRights.indexOf(deleteId) === -1}
                                                            handleClickDelete={() => this.deleteRecord({ ...deleteParam })}
                                                        /> */}

                                                        {/* <FontAwesomeIcon
                                                            icon={faTrashAlt}
                                                            title={this.props.intl.formatMessage({ id: "IDS_DELETE" })}
                                                            hidden={this.state.userRoleControlRights.indexOf(deleteId) === -1}
                                                            onClick={() => this.props.Login.organisation ? confirmMessage.confirm(
                                                                "deleteMessage",
                                                                this.props.intl.formatMessage({ id: "IDS_DELETE" }),
                                                                this.props.intl.formatMessage({ id: `${deleteConfirmMsg}` }),
                                                                this.props.intl.formatMessage({ id: "IDS_OK" }),
                                                                this.props.intl.formatMessage({ id: "IDS_CANCEL" }),
                                                                () => this.deleteRecord({ ...deleteParam })) : toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTNODETODELETE" }))
                                                            }
                                                        /> */}
                                                    </Nav.Link>

                                                    <Button className="btn btn-circle outline-grey ml-2" variant="link"
                                                        onClick={() => this.reloadData()} 
                                                        //data-for="tooltip_list_wrap"
                                                        data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_REFRESH" })}>
                                                        <FontAwesomeIcon icon={faSync} style={{ "width": "0.6!important" }} />
                                                    </Button>
                                                    {/* <ContentPanel className="d-flex justify-content-end dropdown badget_menu icon-group-wrap"> */}
                                                    <Nav.Link
                                                        className="btn btn-circle outline-grey ml-2"
                                                        variant="link"
                                                        data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_GRAPH" })}
                                                       // data-for="tooltip_list_wrap"
                                                        onClick={() => this.props.organisationService({
                                                            inputData: {
                                                                nsitecode: this.props.Login.masterData.SelectedOrgSite && this.props.Login.masterData.SelectedOrgSite.nsitecode,
                                                                userinfo: this.props.Login.userInfo,
                                                                graphview: true, completetreepath: "", primarykey: 0
                                                            },
                                                            masterData: this.props.Login.masterData, selectedNode: "Site",
                                                            url: "organisation/getSiteDepartment"
                                                        })}>
                                                        <Graph className="custom_icons" width="20" height="20" /> { }
                                                        {/* <FontAwesomeIcon icon={faBars} title={this.props.intl.formatMessage({id:'IDS_GRAPH'})}/>  */}
                                                    </Nav.Link  >
                                                    {/* </ContentPanel> */}

                                                </Col>
                                            </Row>
                                        </SearchAdd>
                                    </Col>
                                </Row>

                                {selectedOrgSite && selectedOrgSite.ssitename &&
                                    this.props.Login.masterData.SiteDepartment.length > 0 ?
                                    <Row>
                                        <Col md={12}>
                                            <PerfectScrollbar className="org-tree-scroll">
                                                <FormTreeMenu //data ={treeMap.get("data")}
                                                    placeholder={this.props.intl.formatMessage({ id: "IDS_FILTER" })}
                                                    data={this.props.Login.masterData.TreeData}
                                                    handleTreeClick={this.onTreeClick}
                                                    activeKey={this.props.Login.masterData.CompleteTreePath || ""}
                                                    focusKey={this.props.Login.masterData.CompleteTreePath || ""}
                                                    initialOpenNodes={this.props.Login.masterData.TreeInitialOpenNodes}
                                                    hasSearch={true}
                                                />
                                            </PerfectScrollbar>
                                        </Col>
                                    </Row> : ""}
                            </Affix>
                        </Col>

                        <Col md={7} className='border'>
                            <Row>
                                <Col md={12}>
                                    <div className="p-3">
                                        {/* <Button className="btn btn-user btn-primary-blue mb-3"
                                            hidden={this.props.Login.inputParam && this.state.userRoleControlRights.indexOf(addUserId) === -1}
                                            onClick={() => this.addUser()}
                                            role="button">
                                            <FormattedMessage id={"IDS_ADDUSER"} defaultMessage='Add User' />
                                        </Button> */}
                                        <div className="d-flex justify-content-end">
                                            {/* <ReactTooltip place="bottom" /> */}
                                            <Nav.Link name="addrole" className="add-txt-btn"
                                                // data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_ADDUSERS" })}
                                                hidden={this.props.Login.inputParam && this.state.userRoleControlRights.indexOf(addUserId) === -1}
                                                onClick={() => this.addUser()}>
                                                <FontAwesomeIcon icon={faPlus} /> { }
                                                <FormattedMessage id='IDS_USER' defaultMessage='User' />
                                            </Nav.Link>
                                        </div>
                                        <Card>
                                            <Card.Header>
                                                {selectedPath}
                                            </Card.Header>
                                            <Card.Body>
                                                <Row>
                                                    <Col md={12}>
                                                        {this.state.data ?
                                                            <DataGrid
                                                                primaryKeyField={"nusercode"}
                                                                data={this.state.data}
                                                                dataResult={this.state.dataResult}
                                                                dataState={this.state.dataState}
                                                                dataStateChange={this.dataStateChange}
                                                                extractedColumnList={this.usersColumnList}
                                                                controlMap={this.state.controlMap}
                                                                userRoleControlRights={this.state.userRoleControlRights}
                                                                inputParam={this.props.inputParam}
                                                                userInfo={this.props.userInfo}
                                                                methodUrl="SectionUsers"
                                                                deleteRecord={this.deleteRecord}
                                                                deleteParam={usersDeleteParam}
                                                                pageable={false}
                                                                scrollable={"scrollable"}
                                                                //isComponent={false}
                                                                isActionRequired={true}
                                                                isToolBarRequired={false}
                                                                selectedId={this.props.Login.selectedId}
                                                                expandField="expanded"
                                                                handleExpandChange={this.handleExpandChange}
                                                                hasChild={true}
                                                                childColumnList={this.roleColumnList}
                                                                childMappingField={"nusercode"}
                                                                childList={this.props.Login.userRoleMap || new Map()}
                                                            /**Uncomment below handleRowClick when row click is needed */
                                                            //handleRowClick={this.handleRowClick}  
                                                            />
                                                            : ""}
                                                    </Col>
                                                </Row>

                                            </Card.Body>
                                        </Card>
                                    </div>

                                </Col>
                            </Row>
                        </Col>
                    </Row>

                </div>
                {/* Start of Modal Slideout*/}
                {/* Below Condition Added to avoid unwanted rendering of SlideOut */}
                {this.props.Login.openModal ?
                    <SlideOutModal show={this.props.Login.openModal}
                        size={this.props.Login.graphView ? 'xl' : 'lg'}
                        closeModal={this.closeModal}
                        operation={this.props.Login.operation}
                        inputParam={this.props.Login.inputParam}
                        screenName={this.props.Login.screenName}
                        onSaveClick={this.onSaveClick}
                        esign={this.props.Login.loadEsign}
                        graphView={this.props.Login.graphView}
                        validateEsign={this.validateEsign}
                        masterStatus={this.props.Login.masterStatus}
                        updateStore={this.props.updateStore}
                        selectedRecord={this.state.selectedRecord || {}}
                        mandatoryFields={mandatoryFields}
                        resetView={this.resetView}
                        // addComponentParam={{comboDataList, columnList}}                   
                        // addComponent={this.addComponent}

                        addComponent={this.props.Login.loadEsign ?
                            <Esign operation={this.props.Login.operation}
                                onInputOnChange={this.onInputOnChange}
                                inputParam={this.props.Login.inputParam}
                                selectedRecord={this.state.selectedRecord || {}}
                            />
                            : this.props.Login.graphView ?
                                <>
                                    {/* <Row>                                  
                                    <Col md={12} style={{backgroundColor:'#ffffff', paddingTop:'20px', paddingBottom:'20px'}}>
                                         <Button  className="btn btn-user btn-primary-blue" role="button"   
                                          onClick={()=> this.props.organisationService({
                                                        inputData: {
                                                            nsitecode: this.props.Login.masterData.SelectedOrgSite && this.props.Login.masterData.SelectedOrgSite.nsitecode,
                                                            userinfo: this.props.Login.userInfo,
                                                            graphview: true, completetreepath: "", primarykey: 0
                                                        },
                                                        masterData: this.props.Login.masterData, selectedNode: "Site",
                                                        url: "organisation/getSiteDepartment"
                                                    })   }                              
                                            >
                                          <FormattedMessage id={"IDS_RESET"} defaultMessage='Reset' />
                                    </Button>
                                    </Col>
                                </Row> */}
                                    <Row>
                                        <Col md={12} style={{ backgroundColor: '#ffffff' }}>
                                            <Tree
                                                // data={this.graphView()["initialNode"]}
                                                data={this.props.Login.graphData}
                                                height={graphHeight}
                                                // height={900}
                                                width={1000}
                                                animated
                                                duration={800}
                                                svgProps={{
                                                    // transform: 'rotate(90)',
                                                    className: 'custom'
                                                }}
                                            />
                                            {/* <TreeGraph/> */}
                                        </Col>
                                    </Row></>
                                : <AddChild
                                    selectedRecord={this.state.selectedRecord || {}}
                                    onInputOnChange={this.onInputOnChange}
                                    onComboChange={this.onComboChange}
                                    operation={this.props.Login.operation}
                                    inputParam={this.props.Login.inputParam}
                                    comboDataList={comboDataList}
                                    extractedColumnList={columnList}
                                    handleDateChange={this.handleDateChange}

                                />
                        }
                    /> : ""}
                {/* End of Modal Sideout for GoodsIn Creation */}

            </>
        );
    }

    /**Uncomment below handleRowClick event handler function when row click is needed */
    // handleRowClick = (event) =>{
    //     const updateInfo = {
    //         typeName: DEFAULT_RETURN,
    //         data: {
    //             selectedId: event.dataItem["nusercode"]
    //         }
    //     }
    //     this.props.updateStore(updateInfo)
    // }

    resetView = () => {
        const inputParam = {
            inputData: {
                nsitecode: this.props.Login.masterData.SelectedOrgSite
                    && this.props.Login.masterData.SelectedOrgSite.nsitecode,
                userinfo: this.props.Login.userInfo,
                graphview: true, completetreepath: "", primarykey: 0
            },
            masterData: this.props.Login.masterData, selectedNode: "Site",
            url: "organisation/getSiteDepartment"
        }

        this.props.organisationService(inputParam);
    }

    //L.Subashini - 02/Jan/2026 - Updated method by adding additional method param,  setState and dataItem
    // as a fix for ReactVersion upgrade to 17 and kendo grid 5 to expand grid item
    handleExpandChange = (fullDataset, dataItem, dataState) => {
        const viewParam = {
            nsitecode: this.props.Login.masterData.SelectedOrgSite && this.props.Login.masterData.SelectedOrgSite.nsitecode,
            userInfo: this.props.Login.userInfo, primaryKeyField: "nusercode",
            masterData: {...this.props.Login.masterData,"SectionUsers":fullDataset.data}
        };    
        
        // this.setState(prevState => ({
        //     dataResult: fullDataset,
        //     dataState: dataState || prevState.dataState
        // }));

        this.props.getSectionUserRole({
            ...viewParam, dataState,
            //primaryKeyValue: row["dataItem"][viewParam.primaryKeyField], viewRow: row["dataItem"]
            primaryKeyValue: dataItem[viewParam.primaryKeyField], viewRow: dataItem
        });      
    }

    confirmDelete = (deleteParam) => {

        const deleteConfirmMsg = `IDS_CONFIRMDELETE${this.props.Login.organisation && this.props.Login.organisation.selectedNode && this.props.Login.organisation.selectedNode.toUpperCase()}`;

        this.confirmMessage.confirm("deleteMessage",
            this.props.intl.formatMessage({ id: "IDS_DELETE" }),
            this.props.intl.formatMessage({ id: `${deleteConfirmMsg}` }),
            this.props.intl.formatMessage({ id: "IDS_OK" }),
            this.props.intl.formatMessage({ id: "IDS_CANCEL" }),
            () => this.deleteRecord(deleteParam)
        );
    }

    onTreeClick = (event) => {
        if (event) {
            if (event.item.selectedNode === "Section") {
                let masterData = { ...this.props.Login.masterData }
                let inputData = {
                    userinfo: this.props.Login.userInfo,
                    selectedtreepath: event.key, graphview: false,
                    [event.item.primaryKeyField]: event.item.selectedNodeDetail[event.item.primaryKeyField]
                }
                masterData["CompleteTreePath"] = event.key;
                this.props.organisationService({
                    inputData,
                    //url:event.getParam.url,
                    url: event.serviceUrl,
                    masterData,
                    organisation: { ...event.item }
                })
            }
            else {
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        organisation: { ...event.item },
                        data: undefined, dataState: undefined,
                        masterData: { ...this.props.Login.masterData, "CompleteTreePath": event.key, SectionUsers: [] }
                    }
                }
                this.props.updateStore(updateInfo);
            }
        }

    }

    componentDidUpdate(previousProps) {
        if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord) {
            this.setState({ selectedRecord: this.props.Login.selectedRecord });
        }
        if (this.props.Login.masterData !== previousProps.Login.masterData) {

            if (this.props.Login.userInfo.nformcode !== previousProps.Login.userInfo.nformcode) {
                const userRoleControlRights = [];
                if (this.props.Login.userRoleControlRights) {
                    this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode] && Object.values(this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode]).map(item =>
                        userRoleControlRights.push(item.ncontrolcode))
                }
                const controlMap = getControlMap(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode)

                const siteMap = constructOptionList(this.props.Login.masterData.OrganisationSite || [], "nsitecode",
                    "ssitename", undefined, undefined, true);
                const siteList = siteMap.get("OptionList");


                this.setState({
                    userRoleControlRights, controlMap, siteList: siteList,
                    data: this.props.Login.data || this.props.Login.masterData.SectionUsers || [],
                    dataResult: process(this.props.Login.data || this.props.Login.masterData.SectionUsers || [], this.state.dataState),
                    //roleData: this.props.Login.masterData.SectionUserRoleList || [],
                    //roleDataResult:process(this.props.Login.masterData.SectionUserRoleList||[], this.state.roleDataState),

                });
            }
            else {
                let dataState = this.props.Login.dataState || this.state.dataState;

                if (this.props.Login.dataState === undefined) {
                    dataState = { skip: 0 };
                }
                const userData = this.props.Login.data || this.props.Login.masterData.SectionUsers || [];

                this.setState({
                    selectedRecord: this.props.Login.selectedRecord,
                    data: userData,
                    dataResult: process(userData, this.props.Login.dataState || dataState),
                    dataState: dataState,
                    //organisation:{...this.props.Login.organisation, primaryKeyValue: this.props.Login.masterData.AddedChildPrimaryKey }
                });
            }

        }
    }

    openModal = () => {
        let inputParam = {};
        //const primaryKey = this.props.Login.masterData.AddedChildPrimaryKey;
        // console.log("master data in open modal:", this.props.Login.masterData);
        if (this.props.Login.masterData.SiteDepartment.length === 0) {
            let completeTreePath = this.props.Login.masterData.CompleteTreePath;
            if (completeTreePath === "") {
                completeTreePath = this.props.Login.masterData.SelectedOrgSite.ssitename;
            }
            inputParam = {
                operation: "create", screenName: "IDS_DEPARTMENT",
                selectedRecord: {
                    ssitename: this.props.Login.masterData.SelectedOrgSite.ssitename,
                    nsitecode: this.props.Login.masterData.SelectedOrgSite.nsitecode,
                },
                url: "organisation/getSiteDepartmentComboData",
                listName: "siteDepartmentList",
                columnList: this.siteDepartmentColumnList,
                inputData: {
                    nsitecode: this.props.Login.masterData.SelectedOrgSite.nsitecode,
                    userinfo: this.props.Login.userInfo,
                    completetreepath: completeTreePath,
                },
                organisation: { selectedNode: "Site", }
            };
            this.props.getOrganisationComboService(inputParam);
        }
        else {
            if (this.props.Login.organisation && this.props.Login.organisation.selectedNode !== "Section") {
                if (this.props.Login.organisation.selectedNode === "Site")
                    inputParam = {
                        operation: "create", screenName: "IDS_DEPARTMENT",
                        selectedRecord: {
                            ssitename: this.props.Login.masterData.SelectedOrgSite.ssitename,//this.props.Login.organisation.selectedNodeName, 
                            nsitecode: this.props.Login.masterData.SelectedOrgSite.nsitecode,
                            //this.props.Login.organisation.primaryKeyValue
                        },
                        url: "organisation/getSiteDepartmentComboData",
                        listName: "siteDepartmentList",
                        columnList: this.siteDepartmentColumnList,
                        inputData: {
                            nsitecode: this.props.Login.masterData.SelectedOrgSite.nsitecode,//this.props.Login.organisation.primaryKeyValue, 
                            userinfo: this.props.Login.userInfo,
                            completetreepath: this.props.Login.masterData.CompleteTreePath
                        }
                    };
                else if (this.props.Login.organisation.selectedNode === "Department")
                    inputParam = {
                        operation: "create", screenName: "IDS_LAB",
                        selectedRecord: {
                            sdeptname: this.props.Login.organisation.selectedNodeName,
                            nsitedeptcode: this.props.Login.organisation.primaryKeyValue
                        },
                        url: "organisation/getDepartmentLabComboData",
                        listName: "departmentLabList",
                        columnList: this.deptLabColumnList,
                        inputData: {
                            nsitedeptcode: this.props.Login.organisation.primaryKeyValue,
                            userinfo: this.props.Login.userInfo,
                            completetreepath: this.props.Login.masterData.CompleteTreePath
                        }
                    };
                else if (this.props.Login.organisation.selectedNode === "Lab")
                    inputParam = {
                        operation: "create", screenName: "IDS_SECTION",
                        selectedRecord: {
                            slabname: this.props.Login.organisation.selectedNodeName,
                            ndeptlabcode: this.props.Login.organisation.primaryKeyValue
                        },
                        url: "organisation/getLabSectionComboData",
                        listName: "labSectionList",
                        columnList: this.labSectionColumnList,
                        inputData: {
                            ndeptlabcode: this.props.Login.organisation.primaryKeyValue,
                            userinfo: this.props.Login.userInfo,
                            completetreepath: this.props.Login.masterData.CompleteTreePath
                        }
                    };
                this.props.getOrganisationComboService(inputParam);
            }
            else if (this.props.Login.organisation && this.props.Login.organisation.selectedNode === "Section") {
                toast.warn(this.props.intl.formatMessage({ id: "IDS_CLICKADDUSER" }));
            }
            else {
                toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTNODE" }));
            }
        }
    }

    addUser = () => {
        let inputParam = {};
        if (this.props.Login.organisation &&
            this.props.Login.organisation.selectedNode === "Section") {
            inputParam = {
                operation: "create", screenName: "IDS_USERS",
                selectedRecord: {
                    ssectionname: this.props.Login.organisation.selectedNodeName,
                    nlabsectioncode: this.props.Login.organisation.primaryKeyValue
                },
                url: "organisation/getSectionUsersComboData",
                listName: "sectionUsersList",
                columnList: this.sectionUserColumnList,
                inputData: {
                    nlabsectioncode: this.props.Login.organisation.primaryKeyValue,
                    userinfo: this.props.Login.userInfo,
                    completetreepath: this.props.Login.masterData.CompleteTreePath,
                    nsitecode: this.props.Login.masterData.SelectedOrgSite.nsitecode
                }
            };
            this.props.getOrganisationComboService(inputParam);
        }
        else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTSECTIONTOADD" }));
        }
    }

    closeModal = () => {
        let loadEsign = this.props.Login.loadEsign;
        let openModal = this.props.Login.openModal;
        let selectedRecord = this.props.Login.selectedRecord;

        let operation = this.props.Login.operation;
        if (this.props.Login.loadEsign) {
            if (this.props.Login.operation === "delete") {
                loadEsign = false;
                openModal = false;
                selectedRecord = {};
            }
            else {
                loadEsign = false;
                selectedRecord['esignpassword'] = '';
                selectedRecord['esigncomments'] = '';
            }
        }
        else {
            openModal = false;
            selectedRecord = {};
            //operation = undefined;
        }

        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { openModal, loadEsign, selectedRecord, operation: operation }
        }
        this.props.updateStore(updateInfo);

    }

    onInputOnChange = (event) => {
        const selectedRecord = this.state.selectedRecord || {};
        if (event.target.type === 'checkbox') {
            selectedRecord[event.target.name] = event.target.checked === true ? transactionStatus.YES : transactionStatus.NO;
        }
        else {
            selectedRecord[event.target.name] = event.target.value;
        }
        this.setState({ selectedRecord });
    }

    onComboChange = (comboData, fieldName) => {
        const selectedRecord = this.state.selectedRecord || {};
        selectedRecord[fieldName] = comboData;

        if (fieldName === "nsitecode") {
            // this.props.organisationService({
            //     inputData: {
            //         nsitecode: selectedRecord.nsitecode.value,
            //         userinfo: this.props.Login.userInfo, graphview: false,
            //         completetreepath: selectedRecord.nsitecode.label,
            //         primarykey: selectedRecord.nsitecode.value
            //     },
            //     masterData: this.props.Login.masterData,
            //     url: "organisation/getSiteDepartment"
            // });
            this.reloadData(comboData);
        }
        else {
            this.setState({ selectedRecord });
        }

    }

    reloadData = (comboChangeData) => {

        const inputParam = {
            inputData: {
                userinfo: this.props.Login.userInfo,
                nsitecode: comboChangeData ? comboChangeData.value : this.props.Login.masterData && this.props.Login.masterData.SelectedOrgSite && this.props.Login.masterData.SelectedOrgSite.nsitecode
            },
            classUrl: "organisation",
            methodUrl: "Organisation",
            displayName: "IDS_ORGANISATION",
            userInfo: this.props.Login.userInfo
        };
        //this.props.reloadTreeData(inputParam);  
        this.props.callService(inputParam);
    }

    onSaveClick = (saveType, formRef) => {

        let inputData = [];
        inputData["userinfo"] = this.props.Login.userInfo;

        let methodUrl = "";
        let nextNode = "";
        if (this.props.Login.organisation.selectedNode === "Site") {
            methodUrl = "SiteDepartment";
            let siteDepartment = [];
            this.state.selectedRecord["ndeptcode"] &&
                this.state.selectedRecord["ndeptcode"].map(item => {
                    return siteDepartment.push({
                        nsitecode: this.state.selectedRecord.nsitecode,
                        ndeptcode: item.value
                    })
                })
            inputData["sitedepartmentlist"] = siteDepartment;
            nextNode = "Department";
        }
        else if (this.props.Login.organisation.selectedNode === "Department") {
            methodUrl = "DepartmentLab";
            let departmentLab = [];
            this.state.selectedRecord["nlabcode"] &&
                this.state.selectedRecord["nlabcode"].map(item => {
                    return departmentLab.push({
                        nsitedeptcode: this.state.selectedRecord.nsitedeptcode,
                        nlabcode: item.value
                    })
                })
            inputData["nsitecode"] = this.props.Login.masterData.SelectedOrgSite.nsitecode;
            inputData["departmentlablist"] = departmentLab;
            nextNode = "Lab";
        }
        else if (this.props.Login.organisation.selectedNode === "Lab") {
            methodUrl = "LabSection";
            let labSection = [];
            this.state.selectedRecord["nsectioncode"] &&
                this.state.selectedRecord["nsectioncode"].map(item => {
                    return labSection.push({
                        ndeptlabcode: this.state.selectedRecord.ndeptlabcode,
                        nsectioncode: item.value
                    })
                })
            inputData["nsitecode"] = this.props.Login.masterData.SelectedOrgSite.nsitecode;
            inputData["labsectionlist"] = labSection;
            nextNode = "Section";
        }
        else if (this.props.Login.organisation.selectedNode === "Section") {
            methodUrl = "SectionUsers";
            let sectionUsers = [];
            this.state.selectedRecord["nusercode"] &&
                this.state.selectedRecord["nusercode"].map(item => {
                    return sectionUsers.push({
                        nlabsectioncode: this.state.selectedRecord.nlabsectioncode,
                        nusercode: item.value,
                        nsitecode: this.props.Login.masterData.SelectedOrgSite.nsitecode
                    })
                })
            inputData["nsitecode"] = this.props.Login.masterData.SelectedOrgSite.nsitecode;
            inputData["sectionuserslist"] = sectionUsers;
            nextNode = "Section";
        }

        const masterData = this.props.Login.masterData;

        inputData["completetreepath"] = masterData.CompleteTreePath;
        const inputParam = {
            classUrl: "organisation",
            methodUrl,
            inputData: inputData,
            operation: this.props.Login.operation,
            saveType, formRef,
            nextNode
        }

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
    }

    deleteRecord = (deleteParam) => {

        let validateDelete = false;
        if (deleteParam.methodUrl === "SectionUsers") {
            deleteParam["inputData"] = {
                ...deleteParam["inputData"],
                //sectionusers:deleteParam.selectedRecord,
                deleteid: deleteParam.selectedRecord.nsectionusercode,
                // ALPD-5471 - Gowtham R - 20/02/2025 - Organization-->cannot be able to delete the section and user that are not being utilized in the instrument
                nlabsectioncode: deleteParam.selectedRecord.nlabsectioncode
            }
            validateDelete = true;
        }
        else {
            if (this.props.Login.organisation) {
                if (this.props.Login.organisation.selectedNode !== "Site") {
                    deleteParam["inputData"] = {
                        ...deleteParam["inputData"],
                        //sectionusers:deleteParam.selectedRecord,
                        //deleteid:deleteParam.selectedRecord.nsectionusercode
                    }
                    validateDelete = true;
                }
                else {
                    toast.warn(this.props.intl.formatMessage({ id: "IDS_CANNOTDELETESITE" }));
                }
            }
            else {
                toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTNODETODELETE" }));
            }
        }
        if (validateDelete) {
            if (deleteParam.inputData.sectionusers &&
                deleteParam.inputData.sectionusers.expanded !== undefined) {
                delete deleteParam.inputData.sectionusers.expanded
            }

            const inputParam = {
                classUrl: this.props.Login.inputParam.classUrl,
                displayName: "IDS_ORGANISATION",
                methodUrl: deleteParam.methodUrl,
                inputData: { ...deleteParam.inputData, completetreepath: this.props.Login.masterData.CompleteTreePath },
                operation: deleteParam.operation, nextNode: deleteParam.nextNode
            }
            const deleteId = this.state.controlMap.has("Delete") && this.state.controlMap.get("Delete").ncontrolcode;
            if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, deleteId)) {
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        loadEsign: true, screenData: { inputParam, masterData: this.props.Login.masterData },
                        openModal: true, screenName: "Organisation",
                        operation: deleteParam.operation
                    }
                }
                this.props.updateStore(updateInfo);
            }
            else {
                this.props.crudMaster(inputParam, this.props.Login.masterData, "openModal");
            }

        }
    }

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

}
export default connect(mapStateToProps, {
    callService, crudMaster, getOrganisationComboService,
    getSectionUserRole, organisationService, updateStore, validateEsignCredential
})(injectIntl(Organisation));

