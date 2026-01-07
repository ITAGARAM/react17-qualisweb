import React from 'react'
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Row, Col, Button, Card, Nav } from 'react-bootstrap';//Nav, Card, Button
import { process } from '@progress/kendo-data-query';
import { toast } from 'react-toastify';
import { ContentPanel } from '../../../components/App.styles';
import { getControlMap, showEsign } from '../../../components/CommonScript';//showEsign, getControlMap,
import {
    callService, crudMaster, validateEsignCredential, updateStore, filterTransactionList, getSiteHierarchy, getSiteHierarchyConfigDetail, 
    getEditSiteHierarchyData, getTreeDetail, approveSiteHierarchy, retireSiteHierarchy
} from '../../../actions';
import { DEFAULT_RETURN } from '../../../actions/LoginTypes';
//import SplitterLayout from '@progress/kendo-react-layout'; //'react-splitter-layout';
import { Splitter, SplitterPane } from '@progress/kendo-react-layout';
import { ProductList } from '../../product/product.styled';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faPlus, faPencilAlt, faThumbsUp, faUserTimes, faCopy } from '@fortawesome/free-solid-svg-icons';
import SlideOutModal from '../../../components/slide-out-modal/SlideOutModal';
import { ReactComponent as RefreshIcon } from '../../../assets/image/refresh.svg';
import TransactionListMasterJsonView from '../../../components/TransactionListMasterJsonView';
import { designProperties, transactionStatus } from '../../../components/Enumeration';
import FormSelectSearch from '../../../components/form-select-search/form-select-search.component';
import Esign from '../../audittrail/Esign';
import { ListWrapper } from '../../userroletemplate/userroletemplate.styles';
import ConfirmMessage from '../../../components/confirm-alert/confirm-message.component';
import AlertModal from '../../dynamicpreregdesign/AlertModal';
import FormInput from '../../../components/form-input/form-input.component';
import PerfectScrollbar from 'react-perfect-scrollbar';
import FormTreeMenu from '../../../components/form-tree-menu/form-tree-menu.component';
import Tree from 'react-tree-graph';
import CustomSwitch from '../../../components/custom-switch/custom-switch.component';
//SWSM-54 - committed by rukshana on september 20-2025 for showing graph view in slideout modal in site hierarchy
import { ReactComponent as Graph } from '../../../assets/image/organisational-graph.svg';

//Commented usused code - L.Subashini - 20/12/2025
// const colorMap = {};
// const usedColors = new Set();

// function getRandomColor() {
//     let color;
//     do {
//         color = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
//     } while (usedColors.has(color));
//     usedColors.add(color);
//     return color;
// }

// function getColorForKey(key) {
//     if (!colorMap[key]) {
//         colorMap[key] = getRandomColor();
//     }
//     return colorMap[key];
// }


class SiteHierarchyConfiguration extends React.Component {
    constructor(props) {
        super(props);
        this.myRef = React.createRef();
        const dataState = {
            skip: 0,
            take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5
        };
        this.searchFieldList = ["sconfigname", "stransdisplaystatus"]

        this.state = {

            selectedRecord: {},
            operation: "",
            screenName: undefined,
            userRoleControlRights: [],
            ControlRights: undefined,
            ConfirmDialogScreen: false,
            controlMap: new Map(),
            dataResult: [],
            dataState: dataState,
            skip: 0,
            error: "",
            take: this.props.Login.settings && this.props.Login.settings[3],
            splitChangeWidthPercentage: 30,
             //Added by L.Subashini on 20/12/2025 for Splitter issue with React Version Upgrade to 17
            panes: [
                 { size: '30%', min: '25%', collapsible:true }    
            ],
          
        };
        this.searchRef = React.createRef();
        this.ConfirmMessage = new ConfirmMessage();
    }

     //Added by L.Subashini on 19/12/2025 for Splitter issue with React Version Upgrade to 17
    onSplitterChange = (event) => {
        this.setState({ panes: event.newState });
    };


    dataStateChange = (event) => {
        this.setState({
            dataResult: process(this.state.data ? this.state.data : [], event.dataState),
            dataState: event.dataState
        });
    }

    paneSizeChange = (d) => {
        this.setState({
            splitChangeWidthPercentage: d
        })
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
//SWSM-54 - committed by rukshana on september 20-2025 for showing graph view in slideout modal in site hierarchy
        countNodes = (node) => {
        if (!node) return 0;
        return 1 + (node.children ? node.children.reduce((sum, child) => sum + this.countNodes(child), 0) : 0);
        };



    render() {

        let versionStatusCSS = "outline-secondary";
        if (this.props.Login.masterData.selectedSiteHierarchyConfig
            && this.props.Login.masterData.selectedSiteHierarchyConfig.ntransactionstatus === transactionStatus.APPROVED) {
            versionStatusCSS = "outline-success";
        }
        else if (this.props.Login.masterData.selectedSiteHierarchyConfig
            && this.props.Login.masterData.selectedSiteHierarchyConfig.ntransactionstatus === transactionStatus.RETIRED) {
            versionStatusCSS = "outline-danger";
        }

        let treeData = this.props.Login.masterData && this.props.Login.masterData.selectedSiteHierarchyConfig && this.props.Login.masterData.selectedSiteHierarchyConfig.jsondata;
        const formattedTree = treeData && this.convertToTreeGraphFormat(treeData) || {};
        const addID = this.state.controlMap.has("AddSiteHierarchyConfiguration") && this.state.controlMap.get("AddSiteHierarchyConfiguration").ncontrolcode;
        const editId = this.state.controlMap.has("EditSiteHierarchyConfiguration") && this.state.controlMap.get("EditSiteHierarchyConfiguration").ncontrolcode;
        const deleteId = this.state.controlMap.has("DeleteSiteHierarchyConfiguration") && this.state.controlMap.get("DeleteSiteHierarchyConfiguration").ncontrolcode;
        const approveId = this.state.controlMap.has("ApproveSiteHierarchyConfiguration") && this.state.controlMap.get("ApproveSiteHierarchyConfiguration").ncontrolcode;
        const retireId = this.state.controlMap.has("RetrieSiteHierarchyConfiguration") && this.state.controlMap.get("RetrieSiteHierarchyConfiguration").ncontrolcode;
        const copyID = this.state.controlMap.has("CopySiteHierarchyConfiguration") && this.state.controlMap.get("CopySiteHierarchyConfiguration").ncontrolcode;

        let mandatoryFields = [];
        mandatoryFields = [
            { "idsName": "IDS_SITEHIERARCHYCONFIGURATIONNAME", "dataField": "sconfigname", "width": "150px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
        ]

        const SubFields = [
            { [designProperties.VALUE]: "stransdisplaystatus" },

        ];

        const filterParam = {
            inputListName: "SiteHierarchyConfig", selectedObject: "selectedSiteHierarchyConfig", primaryKeyField: "nsitehierarchyconfigcode",
            fetchUrl: "sitehierarchyconfiguration/getSiteHierarchyConfiguration", masterData: { ...this.props.Login.masterData } || {},

            fecthInputObject: {
                userinfo: this.props.Login.userInfo,
                nbulkbarcodeconfigcode: this.props.Login.masterData.selectedSiteHierarchyConfig &&
                    this.props.Login.masterData.selectedSiteHierarchyConfig.nsitehierarchyconfigcode

            },
            filteredListName: "searchedSiteHierarchyConfig",
            clearFilter: "no",
            updatedListname: "selectedSiteHierarchyConfig",
            searchRef: this.searchRef,
            searchFieldList: this.searchFieldList,
            changeList: [], isSortable: true, sortList: 'SiteHierarchyConfig'
        };

//SWSM-54 - committed by rukshana on september 20-2025 for showing graph view in slideout modal in site hierarchy

        let totalNodes = formattedTree ? this.countNodes(formattedTree) : 0;
        let dynamicHeight = totalNodes * 25;
        return (
            <>
                <ListWrapper className="client-listing-wrap mtop-4 screen-height-window">
                    {/* <BreadcrumbComponent breadCrumbItem={this.breadCrumbData} /> */}
                    <Row noGutters={"true"}>
                        <Col md={12} className='parent-port-height-nobreadcrumb1 sticky_head_parent' ref={(parentHeight) => { this.parentHeight = parentHeight }}>
                            <ListWrapper className={`vertical-tab-top ${this.state.enablePropertyPopup ? 'active-popup' : ""}`}>
                                {/* <SplitterLayout borderColor="#999" percentage={true} primaryIndex={1} secondaryInitialSize={this.state.splitChangeWidthPercentage} onSecondaryPaneSizeChange={this.paneSizeChange} primaryMinSize={40} secondaryMinSize={20}> */}
                                    <Splitter className='layout-splitter' orientation="horizontal"
                                                panes={this.state.panes} onChange={this.onSplitterChange}>
                                        <SplitterPane size="30%" min="25%">
                                            <TransactionListMasterJsonView
                                                splitChangeWidthPercentage={this.state.splitChangeWidthPercentage}
                                                needMultiSelect={false}
                                                masterList={this.props.Login.masterData.searchedData || this.props.Login.masterData.SiteHierarchyConfig || []}
                                                selectedMaster={[this.props.Login.masterData.selectedSiteHierarchyConfig] || []}
                                                primaryKeyField="nsitehierarchyconfigcode"
                                                
                                                getMasterDetail={
                                                    (vieweditSample) => this.getMasterDetail(vieweditSample, this.props.Login.userInfo, this.props.Login.masterData, this.props.Login.masterData && this.props.Login.masterData.selectedSiteHierarchyConfig["nsitehierarchyconfigcode"] ? this.props.Login.masterData.selectedSiteHierarchyConfig["nsitehierarchyconfigcode"] : -1)
                                                }
                                                subFieldsLabel={false}
                                                additionalParam={['']}
                                                mainField={'sconfigname'}
                                                filterColumnData={this.props.filterTransactionList}
                                                showFilter={this.props.Login.showFilter}
                                                openFilter={this.openFilter}
                                                closeFilter={this.closeFilter}
                                                onFilterSubmit={this.onFilterSubmit}
                                                subFields={SubFields}
                                                statusFieldName="stransdisplaystatus"
                                                statusField="ntransactionstatus"
                                                statusColor="stranscolor"
                                                showStatusIcon={false}
                                                showStatusName={false}
                                                needFilter={false}
                                                searchRef={this.searchRef}
                                                filterParam={filterParam}
                                                skip={this.state.skip}
                                                take={this.state.take}
                                                handlePageChange={this.handlePageChange}
                                                showStatusBlink={false}
                                                childTabsKey={[]}
                                                splitModeClass={this.state.splitChangeWidthPercentage && this.state.splitChangeWidthPercentage > 50 ? 'split-mode' : this.state.splitChangeWidthPercentage > 40 ? 'split-md' : ''}
                                                commonActions={
                                                    <>
                                                        <ProductList className="d-flex product-category float-right">
                                                            <Nav.Link
                                                                className="btn btn-icon-rounded btn-circle solid-blue" role="button"
                                                                data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_ADD" })}
                                                                hidden={this.state.userRoleControlRights.indexOf(addID) === -1}
                                                                onClick={() => this.openModal(addID, 'create', 'IDS_SITEHIERARCHYCONFIGURATIONNAME')} >
                                                                <FontAwesomeIcon icon={faPlus} />
                                                            </Nav.Link>


                                                            <Button className="btn btn-circle outline-grey ml-2 p-0" variant="link"
                                                                onClick={() => this.onReload()}
                                                                data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_REFRESH" })}>
                                                                <RefreshIcon className='custom_icons' />
                                                            </Button>
                                                        </ProductList>
                                                    </>
                                                }

                                            />
                                        </SplitterPane>
                                        <SplitterPane size="70%" min="25%">
                                            <ContentPanel className="panel-main-content">
                                                <Card className="border-0">
                                                    {this.props.Login.masterData.selectedSiteHierarchyConfig ? Object.entries(this.props.Login.masterData.selectedSiteHierarchyConfig).length > 0 ?
                                                        <>
                                                            <Card.Header>
                                                                <Card.Title>
                                                                    <h1 className="product-title-main">{this.props.Login.masterData.selectedSiteHierarchyConfig && this.props.Login.masterData.selectedSiteHierarchyConfig.sconfigname}</h1>
                                                                </Card.Title>
                                                                <Card.Subtitle className="readonly-text font-weight-normal">
                                                                    <Row>
                                                                        <Col md={8} >
                                                                            <h2 className="product-title-sub flex-grow-1">
                                                                                <span className={`btn btn-outlined ${versionStatusCSS} btn-sm ml-3`}>
                                                                                    {this.props.Login.masterData.selectedSiteHierarchyConfig && this.props.Login.masterData.selectedSiteHierarchyConfig.stransdisplaystatus}
                                                                                </span>
                                                                            </h2>
                                                                        </Col>
                                                                        <Col md={4}>
                                                                            <>
                                                                                <div className="d-flex product-category" style={{ float: "right" }}>
                                                                                    <div className="d-inline ">
                                                                                        <Nav.Link
                                                                                            hidden={this.state.userRoleControlRights.indexOf(editId) === -1}
                                                                                            className="btn btn-circle outline-grey mr-2"
                                                                                            data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_EDIT" })}
                                                                                            onClick={() => this.props.getEditSiteHierarchyData(this.props.Login.masterData.selectedSiteHierarchyConfig.nsitehierarchyconfigcode, this.props.Login.userInfo, this.props.Login.masterData, editId, 'IDS_SITEHIERARCHYCONFIGURATIONNAME')}>
                                                                                            <FontAwesomeIcon icon={faPencilAlt} title={this.props.intl.formatMessage({ id: "IDS_EDIT" })} />
                                                                                        </Nav.Link>
                                                                                        <Nav.Link className="btn btn-circle outline-grey mr-2"
                                                                                            data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_DELETE" })}
                                                                                            hidden={this.state.userRoleControlRights.indexOf(deleteId) === -1}
                                                                                            onClick={() => this.ConfirmDelete(deleteId)}>
                                                                                            <FontAwesomeIcon icon={faTrashAlt} />

                                                                                        </Nav.Link>
                                                                                        <Nav.Link
                                                                                            hidden={this.state.userRoleControlRights.indexOf(approveId) === -1}
                                                                                            className="btn btn-circle outline-grey mr-2"
                                                                                            data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_APPROVE" })}
                                                                                            onClick={() => this.approveVersion(approveId)}>
                                                                                            <FontAwesomeIcon icon={faThumbsUp} />
                                                                                        </Nav.Link>
                                                                                        <Nav.Link
                                                                                            hidden={this.state.userRoleControlRights.indexOf(copyID) === -1}
                                                                                            className="btn btn-circle outline-grey mr-2"
                                                                                            data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_COPY" })}
                                                                                            // onClick={() => this.copySiteHierarchyConfiguration(copyID)}>
                                                                                            onClick={() => this.openModal(addID, 'copy', 'IDS_SITEHIERARCHYCONFIGURATIONNAME')} >
                                                                                            <FontAwesomeIcon icon={faCopy} />
                                                                                        </Nav.Link>
                                                                                        
                                                                                        {this.props.Login && this.props.Login.settings &&
                                                                                            parseInt(this.props.Login.settings['85']) === transactionStatus.YES ?
                                                                                            <Nav.Link
                                                                                                hidden={this.state.userRoleControlRights.indexOf(retireId) === -1}
                                                                                                className="btn btn-circle outline-grey mr-2"
                                                                                                data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_RETIRE" })}
                                                                                                onClick={() => this.retireVersion(retireId)}>
                                                                                                <FontAwesomeIcon icon={faUserTimes} />
                                                                                            </Nav.Link> : ""}
                                                                            {/* SWSM-54 - committed by rukshana on september 20-2025 for showing graph view in slideout modal in site hierarchy */}
                                                                                            <Nav.Link
                                                                                                className="btn btn-circle outline-grey ml-2"
                                                                                                variant="link"
                                                                                                data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_GRAPH" })}
                                                                                                onClick={() => this.gettreeDetail(this.props.Login.masterData)}
                                                                                                >
                                                                                                <Graph className="custom_icons" width="20" height="20" /> { }
                                                                                            </Nav.Link  >

                                                                                    </div>
                                                                                </div>
                                                                            </>
                                                                        </Col>
                                                                    </Row>
                                                                </Card.Subtitle>
                                                            </Card.Header>
                                                            <Card.Body>
                                                                <Row noGutters={true}>
                                                                    {/* <Col md={12}  style={{ transform: 'rotate(90deg)', transformOrigin: 'top left',backgroundColor: '#ffffff' }}>
                                                                    <Tree
                                                                        data={formattedTree}
                                                                        height={400}
                                                                        width={500}
                                                                        animated
                                                                        nodeRadius={10}
                                                                    />
                                                                </Col> */}
                                                                    <Col md={12} style={{ backgroundColor: '#ffffff' }}>
                                                                        {/* <DynamicNodeStyles colorMap={colorMap} />                                                          */}
                                                                        {/* SWSM-54 - committed by rukshana on september 20-2025 for showing graph view in slideout modal in site hierarchy start */}
                                                                        {/* <Tree
                                                                            key={this.state.formattedTree !== undefined ? this.state.formattedTree.name : formattedTree.name}
                                                                            data={this.state.formattedTree !== undefined ? this.state.formattedTree : formattedTree}
                                                                            height={400}
                                                                            width={1000}
                                                                            duration={800}
                                                                            animated
                                                                            svgProps={{
                                                                                //  transform: 'rotate(90)',
                                                                                className: 'custom',
                                                                                onClick: this.handleClick, // attach click here
                                                                            }}
                                                                        /> */}
                                                                        <div>
                                                                        <PerfectScrollbar className="org-tree-scroll"  style={{
                                                                                            maxHeight: "600px",
                                                                                            height: "100%",
                                                                                            overflowX: "auto",
                                                                                            overflowY: "auto",
                                                                                            whiteSpace: "nowrap"
                                                                                        }} >
                                                                            <FormTreeMenu
                                                                                data={this.state.selectedTreeNode && this.state.selectedTreeNode.AgaramTree}
                                                                                hasSearch={false}
                                                                                handleTreeClick={this.onTreeClick}
                                                                                initialOpenNodes={this.state.selectedTreeNode && this.state.selectedTreeNode.OpenNodes}
                                                                                focusKey={this.state.selectedTreeNode && this.state.selectedTreeNode.CompleteTreePath || ""}
                                                                                activeKey={this.state.selectedTreeNode && this.state.selectedTreeNode.CompleteTreePath || ""}
                                                                            />
                                                                    </PerfectScrollbar>
                                                                    </div>
                                                                    {/* SWSM-54 - committed by rukshana on september 20-2025 for showing graph view in slideout modal in site hierarchy end */}
                                                                        {/* <Tree
                                                                        data={formattedTree}
                                                                        height={400}
                                                                        width={800}
                                                                        svgProps={{
                                                                            className: 'custom-tree'
                                                                        }}
                                                                        keyProp="id"
                                                                        labelProp="name"
                                                                        nodeRadius={10}
                                                                        margins={{ bottom: 10, left: 100, right: 10, top: 10 }}
                                                                        gProps={{
                                                                            transform: 'translate(100,50)' // manually offset nodes
                                                                        }}
                                                                    /> */}

                                                                    </Col>
                                                                </Row>

                                                            </Card.Body>
                                                        </>
                                                        : "" : ""}
                                                </Card>
                                            </ContentPanel>
                                        </SplitterPane>
                                    </Splitter>

                                {/* </SplitterLayout> */}

                            </ListWrapper>
                        </Col>
                    </Row>
                </ListWrapper>

                {this.props.Login.openModal ?
                    <SlideOutModal
                        show={this.props.Login.openModal}
						//SWSM-54 - committed by rukshana on september 20-2025 for showing graph view in slideout modal in site hierarchy
                        size = {this.props.Login.graphView ? "xl":"lg" }
                        closeModal={this.closeModal}
                        operation={this.props.Login.operation}
                        inputParam={this.props.Login.inputParam}
                        screenName={this.props.Login.screenName}
                        esign={this.props.Login.loadEsign}
                        graphView={this.props.Login.graphView}
                        onSaveClick={this.onSaveClick}
                        validateEsign={this.validateEsign}
                        masterStatus={this.props.Login.masterStatus}
                        updateStore={this.props.updateStore}
                        mandatoryFields={mandatoryFields}
                        selectedRecord={this.props.Login.loadSiteHierarchyConfig ? this.state.selectedRecord || {} :
                            this.props.Login.loadEsign ? {
                                ...this.state.selectedMasterRecord,
                                'esignpassword': this.state.selectedRecord['esignpassword'],
                                'esigncomments': this.state.selectedRecord['esigncomments'],
                                'esignreason': this.state.selectedRecord['esignreason']
                            } : this.state.selectedMasterRecord || {}}
                        showSaveContinue={this.state.showSaveContinue}
                        addComponent={this.props.Login.loadEsign ?
                            <Esign operation={this.props.Login.operation}
                                onInputOnChange={this.onInputOnChange}
                                inputParam={this.props.Login.inputParam}
                                selectedRecord={this.state.selectedRecord || {}}
                            />
                            : this.props.Login.loadSiteHierarchyConfig ?
                                <>
                                    <Row>
                                        <Col md={this.props.Login.operation !== 'copy' ? 8 : 12}>
                                            <FormInput
                                                label={this.props.intl.formatMessage({ id: "IDS_SITEHIERARCHYCONFIGURATIONNAME" })}
                                                name="sconfigname"
                                                type="text"
                                                onChange={(event) => this.onInputOnChange(event)}
                                                placeholder={this.props.intl.formatMessage({ id: "IDS_SITEHIERARCHYCONFIGURATIONNAME" })}
                                                value={this.state.selectedRecord && this.state.selectedRecord["sconfigname"] ? this.state.selectedRecord["sconfigname"] : ""}
                                                isMandatory={true}
                                                required={false}
                                                maxLength={20}
                                            />
                                        </Col>
                                        {this.props.Login.operation !== 'copy' && 
                                            <Col md={4}>
                                                <CustomSwitch
                                                    label={this.props.intl.formatMessage({ id: "IDS_SHOWHIERARCHY" })}
                                                    type="switch"
                                                    name={"nneedalltypesite"}
                                                    onChange={this.onInputOnChange}
                                                    placeholder={this.props.intl.formatMessage({ id: "IDS_SHOWHIERARCHY" })}
                                                    defaultValue={this.state.selectedRecord["nneedalltypesite"] === 3 ? true : false}
                                                    isMandatory={false}
                                                    required={false}
                                                    checked={this.state.selectedRecord ? this.state.selectedRecord["nneedalltypesite"] === 3 ? true : false : false}
                                                    disabled={this.props.Login.operation === 'copy'}
                                                // disabled={this.state.selectedRecord &&
                                                //             this.state.selectedRecord.AgaramTree && 
                                                //             this.state.selectedRecord.AgaramTree.length > 0 ? true : false}
                                                />
                                            </Col>
                                        }
                                    </Row>
                                    {this.props.Login.operation !== 'copy' && 
                                        <Row>
                                            <Col md={12}>
                                                <Button className="btn-user btn-primary-blue" onClick={this.getSiteHierarchy}>
                                                    <FontAwesomeIcon icon={faPlus} data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_ADD" })} /> { }
                                                    {/* <FormattedMessage id='IDS_ADD' defaultMessage='Add' /> */}
                                                </Button>

                                                <Button className="btn-user btn-primary-blue" onClick={this.deleteNode}>
                                                    <FontAwesomeIcon icon={faTrashAlt} data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_DELETE" })} /> { }
                                                    {/* <FormattedMessage id='IDS_DELETE' defaultMessage='Delete' /> */}
                                                </Button>
                                            </Col>

                                            <Col md={12}> <br></br></Col>
                                            <Col md={12}>
                                                <PerfectScrollbar className="org-tree-scroll">
                                                    <FormTreeMenu
                                                        data={this.state.selectedRecord && this.state.selectedRecord.AgaramTree}
                                                        hasSearch={false}
                                                        handleTreeClick={this.onTreeClick}
                                                        initialOpenNodes={this.state.selectedRecord.OpenNodes}
                                                        focusKey={this.state.selectedRecord.CompleteTreePath || ""}
                                                        activeKey={this.state.selectedRecord.CompleteTreePath || ""}
                                                    />
                                                </PerfectScrollbar>
                                            </Col>
                                        </Row>
                                    }

                                    {this.props.Login.openAlertModal &&
                                        <AlertModal
                                            openAlertModal={this.props.Login.openAlertModal}
                                            modalTitle={"IDS_SITE"}
                                            closeModal={() => {
                                                let selectedRecord = this.state.selectedRecord;
                                                delete (selectedRecord["nsitecode"]);
                                                const updateInfo = {
                                                    typeName: DEFAULT_RETURN,
                                                    data: {
                                                        openAlertModal: false,
                                                        selectedRecord
                                                    },
                                                };
                                                this.props.updateStore(updateInfo);
                                            }
                                            }
                                            onSaveClick={this.handleSaveFilterClick}
                                            modalBody={
                                                <Row>
                                                    <Col>
                                                        <FormSelectSearch
                                                            name={"nsitecode"}
                                                            formLabel={this.props.intl.formatMessage({ id: "IDS_SITE" })}
                                                            placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                                            options={this.state.siteList || []}
                                                            value={this.state.selectedRecord &&
                                                                this.state.selectedRecord.nsitecode || []}
                                                            isMandatory={true}
                                                            isMulti={this.state.selectedRecord &&
                                                                this.state.selectedRecord.AgaramTree &&
                                                                this.state.selectedRecord.AgaramTree.length > 0 ? true : false}
                                                            optionId={"value"}
                                                            optionValue={"label"}
                                                            isClearable={false}
                                                            isSearchable={true}
                                                            isDisabled={false}
                                                            closeMenuOnSelect={this.state.selectedRecord &&
                                                                this.state.selectedRecord.AgaramTree &&
                                                                this.state.selectedRecord.AgaramTree.length > 0 ? false : true}
                                                            className="mb-2"
                                                            onChange={(event) => this.onComboChange(event, 'nsitecode')}
                                                        />
                                                    </Col>
                                                </Row>
                                            }
                                        />}
                                </>
								//SWSM-54 - committed by rukshana on september 20-2025 for showing graph view in slideout modal in site hierarchy
                                : this.props.Login.graphView ?
                                <>
                                    <Row>
                                        <Col md={12} style={{ backgroundColor: '#ffffff' }}>
                                            <Tree
                                                key={this.state.formattedTree !== undefined ? this.state.formattedTree.name : formattedTree.name}
                                                data={this.state.formattedTree !== undefined ? this.state.formattedTree : formattedTree}
                                                width={1000}
                                                height={dynamicHeight}
                                                animated
                                                duration={800}
                                                svgProps={{
                                                    className: 'custom'
                                                }}
                                            />
                                            {/* <TreeGraph/> */}
                                        </Col>
                                    </Row></>                               
                               
                                : ""}
                    /> : ""}

            </>
        );

    }

    convertToTreeGraphFormat = (node) => {
        return {
            name: node.key,
            children: node.nodes?.map(this.convertToTreeGraphFormat) || [],
            textProps: { x: 0, y: 10 },
        };
    };



    getMasterDetail = (Sample) => {
        let formattedTree = {}
         this.setState({ formattedTree });
        let inputparam = {
            masterData: this.props.Login.masterData,
            nsitehierarchyconfigcode:Sample.nsitehierarchyconfigcode && Sample.nsitehierarchyconfigcode?Sample.nsitehierarchyconfigcode : -1,
            userinfo: this.props.Login.userInfo,
        }
        this.props.getSiteHierarchyConfigDetail(inputparam)

    }
//SWSM-54 - committed by rukshana on september 20-2025 for showing graph view in slideout modal in site hierarchy
     gettreeDetail = (Sample) => {
        let formattedTree = {}
         this.setState({ formattedTree });
        let inputparam = {
            masterData: this.props.Login.masterData,
            nsitehierarchyconfigcode:this.props.Login.masterData.selectedSiteHierarchyConfig && this.props.Login.masterData.selectedSiteHierarchyConfig.nsitehierarchyconfigcode 
                                        ? this.props.Login.masterData.selectedSiteHierarchyConfig.nsitehierarchyconfigcode : -1,
            userinfo: this.props.Login.userInfo,
        }
        this.props.getTreeDetail(inputparam)

    }

    

    //  convertToTreeGraphFormat = (node) => {
    //   const className = `node-${node.key.replace(/\s+/g, '-')}`;
    //   getColorForKey(node.key); // Ensures color is created

    //   return {
    //     name: node.key,
    //     children: (node.nodes || []).map(this.convertToTreeGraphFormat),
    //     gProps: {
    //       className: className,
    //     }
    //   };
    // };






    addBarcodeField = (screenName, userInfo, operation, masterData, ncontrolcode) => {
        if (masterData.selectedBulkBarcodeConfig.ntransactionstatus === transactionStatus.APPROVED ||
            masterData.selectedBulkBarcodeConfig.ntransactionstatus === transactionStatus.RETIRED) {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTDRAFTRECORD" }));
        } else {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    openChildModal: true,
                    loadBarcodeMaster: true, operation: operation, ncontrolcode: ncontrolcode, fieldName: screenName, loadBulkBarcodeConfig: false, screenName
                }
            }
            this.props.updateStore(updateInfo);
        }
    }

    copySiteHierarchyConfiguration = (ncontrolCode) => {
        let inputData = [];
        inputData["userinfo"] = this.props.Login.userInfo;
        // let postParam = undefined;
        inputData["sitehierarchyconfig"] = this.props.Login.masterData.selectedSiteHierarchyConfig;
        inputData["ssitecode"] = collectAllPrimaryKeys([this.props.Login.masterData.selectedSiteHierarchyConfig.jsondata]);
        inputData["sconfigname"] = this.state.selectedRecord.sconfigname;
        // inputData["isneedtoretire"] = this.props.Login && this.props.Login.settings &&
        //     parseInt(this.props.Login.settings['85']) === transactionStatus.YES ? false : true;
    
        // postParam = {
        //     inputListName: "SiteHierarchyConfig", selectedObject: "selectedSiteHierarchyConfig",
        //     primaryKeyField: "nsitehierarchyconfigcode"
        // };
        // const ChildNode = collectAllChildrenMap([this.props.Login.masterData.selectedSiteHierarchyConfig.jsondata]);
        // const reverseParent = buildReverseParentChain([this.props.Login.masterData.selectedSiteHierarchyConfig.jsondata])
        const inputParam = {
            classUrl: 'sitehierarchyconfiguration',
            methodUrl: "SiteHierarchyConfig",
            inputData,
            operation: "copy",
            selectedRecord: { ...this.state.selectedRecord }
        }
    
        const masterData = this.props.Login.masterData;
    
        const esignNeeded = showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, ncontrolCode);
        if (esignNeeded) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, loadBarcodeMaster: false, loadBulkBarcodeConfig: true, screenData: { inputParam, masterData }, undefined, openModal: true, operation: "copy"
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.crudMaster(inputParam, masterData, "openModal");
        }
    }

    approveVersion = (ncontrolCode) => {

        if (this.props.Login.masterData.selectedSiteHierarchyConfig.ntransactionstatus === transactionStatus.RETIRED) {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_ALREADYRETIRED" }));
        }
        else if (this.props.Login.masterData.selectedSiteHierarchyConfig.ntransactionstatus === transactionStatus.APPROVED) {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_ALREADYAPPROVED" }));
        }
        else {
            let inputData = [];
            inputData["userinfo"] = this.props.Login.userInfo;
            //add               
            let postParam = undefined;
            inputData["sitehierarchyconfig"] = this.props.Login.masterData.selectedSiteHierarchyConfig;
            inputData["ssitecode"] = collectAllPrimaryKeys([this.props.Login.masterData.selectedSiteHierarchyConfig.jsondata]);
            inputData["isneedtoretire"] = this.props.Login && this.props.Login.settings &&
                parseInt(this.props.Login.settings['85']) === transactionStatus.YES ? false : true;

            postParam = {
                inputListName: "SiteHierarchyConfig", selectedObject: "selectedSiteHierarchyConfig",
                primaryKeyField: "nsitehierarchyconfigcode"
            };
            const ChildNode = collectAllChildrenMap([this.props.Login.masterData.selectedSiteHierarchyConfig.jsondata]);
            const reverseParent = buildReverseParentChain([this.props.Login.masterData.selectedSiteHierarchyConfig.jsondata])
            const inputParam = {
                classUrl: 'sitehierarchyconfiguration',
                methodUrl: "SiteHierarchyConfig",
                inputData: { ...inputData, ChildNode: ChildNode, reverseParent: reverseParent },
                operation: "approve", postParam,
                selectedRecord: { ...this.state.selectedRecord }
            }
            let saveType;

            const masterData = this.props.Login.masterData;

            const esignNeeded = showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, ncontrolCode);
            if (esignNeeded) {
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        loadEsign: true, loadBarcodeMaster: false, loadBulkBarcodeConfig: true, screenData: { inputParam, masterData }, saveType, openModal: true, operation: "approve"
                    }
                }
                this.props.updateStore(updateInfo);
            }
            else {
                // this.props.crudMaster(inputParam, masterData, "openModal");
                this.props.approveSiteHierarchy(inputParam, masterData, "openModal", this.ConfirmMessage);
            }
        }
    }

    retireVersion = (ncontrolCode) => {

        if (this.props.Login.masterData.selectedSiteHierarchyConfig.ntransactionstatus === transactionStatus.DRAFT) {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTAPPROVERECORD" }));
        } else {
            if (this.props.Login.masterData.selectedSiteHierarchyConfig.ntransactionstatus === transactionStatus.RETIRED) {
                toast.warn(this.props.intl.formatMessage({ id: "IDS_ALREADYRETIRED" }));
            }
            else {
                let inputData = [];
                inputData["userinfo"] = this.props.Login.userInfo;
                //add               
                let postParam = undefined;
                inputData["sitehierarchyconfig"] = this.props.Login.masterData.selectedSiteHierarchyConfig;
                inputData["ssitecode"] = collectAllPrimaryKeys([this.props.Login.masterData.selectedSiteHierarchyConfig.jsondata]);

                postParam = {
                    inputListName: "SiteHierarchyConfig", selectedObject: "selectedSiteHierarchyConfig",
                    primaryKeyField: "nsitehierarchyconfigcode"
                };
                const inputParam = {
                    classUrl: 'sitehierarchyconfiguration',
                    methodUrl: "SiteHierarchyConfig",
                    inputData: inputData,
                    operation: "retire", postParam,
                    selectedRecord: { ...this.state.selectedRecord }
                }
                let saveType;

                const masterData = this.props.Login.masterData;

                const esignNeeded = showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, ncontrolCode);
                if (esignNeeded) {
                    const updateInfo = {
                        typeName: DEFAULT_RETURN,
                        data: {
                            loadEsign: true, loadBarcodeMaster: false, loadBulkBarcodeConfig: true, screenData: { inputParam, masterData }, saveType, openModal: true, operation: "approve"
                        }
                    }
                    this.props.updateStore(updateInfo);
                }
                else {
                    // this.props.crudMaster(inputParam, masterData, "openModal");
                    this.props.retireSiteHierarchy(inputParam, masterData, "openModal", this.ConfirmMessage, this.props.Login.settings[85]);
                }
            }
        }
    }

    handleClick = (e) => {
        const nodeName = e.target.textContent;
        const cloned = JSON.parse(JSON.stringify([this.props.Login.masterData.selectedSiteHierarchyConfig.jsondata])); // deep copy
        // updateNode(cloned, nodeName);
        //setTreeData(cloned);
    };

    closeModal = () => {
        let loadEsign = this.props.Login.loadEsign;
        let openModal = this.props.Login.openModal;
        let selectedRecord = this.props.Login.selectedRecord;
        let loadSiteHierarchyConfig = this.props.Login.loadSiteHierarchyConfig;
//SWSM-54 - committed by rukshana on september 20-2025 for showing graph view in slideout modal in site hierarchy
        let graphView = this.props.Login.graphView
        if (this.props.Login.loadEsign) {
            if (this.props.Login.operation === "delete" || this.props.Login.operation === "approve") {
                loadEsign = false;
                openModal = false;
                loadSiteHierarchyConfig = false;
                graphView = false;
                selectedRecord = {};
            }
            else {
                loadEsign = false;
                selectedRecord['esignpassword'] = undefined;
                selectedRecord['esigncomments'] = undefined;
                selectedRecord['esignreason'] = undefined;

            }
        }
        else {
            openModal = false;
            selectedRecord = {};
            loadSiteHierarchyConfig = false;
            graphView = false;
        }

        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { openModal, loadEsign, selectedRecord, selectedId: null, loadSiteHierarchyConfig,graphView }
        }
        this.props.updateStore(updateInfo);

    }



    handlePageChange = e => {
        this.setState({
            skip: e.skip,
            take: e.take
        });
    };
    openModal = (ncontrolcode, operation, screenName) => {
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                openModal: true, selectedRecord: {},
                loadSiteHierarchyConfig: true, operation: operation, screenName: screenName, ncontrolcode: ncontrolcode
            }
        }
        this.props.updateStore(updateInfo);

    }

    getSiteHierarchy = () => {
        this.searchRef.current.value = "";
        let nsitecode = "";
        let selectedRecord = this.state.selectedRecord;
        if (selectedRecord.AgaramTree && selectedRecord.AgaramTree.length > 0) {
            let nsitecodearray = extractPrimaryKeys(selectedRecord.AgaramTree, "get");
            nsitecode = nsitecodearray.map(x => x).join(',')
        }
        let inputData = {
            userInfo: this.props.Login.userInfo,
            postParamList: this.filterParam, nsitecode
        }
        let masterData = { ...this.props.Login.masterData }
        let inputParam = { masterData, inputData, searchRef: this.searchRef, selectedRecord }
        this.props.getSiteHierarchy(inputParam)
    }

    deleteNode = () => {
        let TreeData;
        let OpenNodes;
        let CompleteTreePath;
        let selectedNodeKey;
        let selectedNodePKey;
        let masterData = { ...this.props.Login.masterData };
        const selectedRecord = this.state.selectedRecord;
        if (selectedRecord && selectedRecord.AgaramTree
            && selectedRecord.AgaramTree.length > 0) {
            const { updatedTree, labelPaths, addedNodePath, nextPointerPath, nextnsitetypecode, nextnsitecode } = updateTreeAndBuildPaths(selectedRecord.AgaramTree, selectedRecord,
                selectedRecord.selectedNodePKey, 'delete');
            TreeData = updatedTree;
            OpenNodes = labelPaths;
            CompleteTreePath = nextPointerPath;
            selectedNodeKey = nextnsitetypecode || -1;
            selectedNodePKey = nextnsitecode || -1;

        }
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                masterData,
                selectedRecord: {
                    ...selectedRecord,
                    AgaramTree: TreeData,
                    selectedNodeKey: selectedNodeKey,
                    OpenNodes: OpenNodes, CompleteTreePath: CompleteTreePath, selectedNodePKey: selectedNodePKey
                }, openAlertModal: false
            }
        }
        this.props.updateStore(updateInfo);

    }

    onReload = () => {
        this.searchRef.current.value = "";
        let inputData = {
            postParamList: this.filterParam,
        }
        let userinfo = this.props.Login.userInfo;
        let masterData = { ...this.props.Login.masterData }
        delete (masterData.searchedData)
        let inputParam = { masterData, searchRef: this.searchRef, userinfo, reload: true }
        this.props.getSiteHierarchyConfigDetail(inputParam)
    }

    onComboChange = (comboData, fieldName) => {
        const selectedRecord = this.state.selectedRecord || {};
        selectedRecord[fieldName] = comboData;;
        this.setState({ selectedRecord });
    }



    onInputOnChange = (event) => {
        const selectedRecord = this.state.selectedRecord || {};
        if (event.target.type === 'checkbox') {
            if (selectedRecord.AgaramTree && selectedRecord.AgaramTree.length > 0) {
                toast.warn(this.props.intl.formatMessage({ id: "IDS_DELETETOPLEVEL" }));
            } else {
                selectedRecord[event.target.name] = event.target.checked === true ? transactionStatus.YES : transactionStatus.NO;

            }
        }
        else {
            selectedRecord[event.target.name] = event.target.value
        }
        this.setState({ selectedRecord });
    }

    handleSaveFilterClick = () => {
        let TreeData;
        let OpenNodes;
        let CompleteTreePath;
        let selectedNodeKey;
        let selectedNodePKey;
        let masterData = { ...this.props.Login.masterData };
        const selectedRecord = this.state.selectedRecord;
        if (this.state.selectedRecord.nsitecode !== "" && this.state.selectedRecord.nsitecode !== undefined) {
            if (selectedRecord && selectedRecord.AgaramTree
                && selectedRecord.AgaramTree.length > 0) {
                const { updatedTree, labelPaths, addedNodePath, parentNodePath, nextnsitecode, nextnsitetypecode } = updateTreeAndBuildPaths(selectedRecord.AgaramTree, selectedRecord,
                    selectedRecord.selectedNodePKey, 'insert');
                TreeData = updatedTree;
                OpenNodes = labelPaths;
                CompleteTreePath = addedNodePath;
                selectedNodeKey = nextnsitetypecode;
                selectedNodePKey = nextnsitecode;
            } else {
                TreeData = [
                    {
                        "key": selectedRecord.nsitecode.label,
                        "primaryKey": selectedRecord.nsitecode.value,
                        "parentKey": 0,
                        "label": selectedRecord.nsitecode.item.ssitetypename + " : " + selectedRecord.nsitecode.item.ssiteconfigname,
                        "item": {
                            "selectedNode": selectedRecord.nsitecode.label,
                            "primaryKeyField": "nsitecode",
                            "primaryKeyValue": selectedRecord.nsitecode.label,
                            "selectedNodeName": selectedRecord.nsitecode.label,
                            "selectedNodeDetail": selectedRecord.nsitecode.item
                        },
                        "nodes": []
                    }
                ]
                OpenNodes = [selectedRecord.nsitecode.label];
                CompleteTreePath = selectedRecord.nsitecode.label;
                selectedNodeKey = selectedRecord.nsitecode.item && selectedRecord.nsitecode.item.nhierarchicalorderno;
                selectedNodePKey = selectedRecord.nsitecode.item && selectedRecord.nsitecode.item.nsitecode;
            }

            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    masterData,
                    selectedRecord: {
                        ...selectedRecord,
                        AgaramTree: TreeData,
                        selectedNodeKey: selectedNodeKey,
                        OpenNodes: OpenNodes, CompleteTreePath: CompleteTreePath, selectedNodePKey: selectedNodePKey
                    }, openAlertModal: false
                }
            }
            this.props.updateStore(updateInfo);

        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTSITENAME" }));
        }

    }


    onTreeClick = (event) => {
        const selectedRecord = this.state.selectedRecord;
        if (event) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    organisation: { ...event.item },
                    data: undefined, dataState: undefined,
                    masterData: {
                        ...this.props.Login.masterData
                    },
                    selectedRecord: {
                        ...selectedRecord,
                        selectedNodeKey: event.item.selectedNodeDetail["nhierarchicalorderno"],
                        selectedNodePKey: event.item.selectedNodeDetail[event.item.primaryKeyField],
                        "CompleteTreePath": event.key, organisation: { ...event.item }, SectionUsers: []
                    }
                }
            }
            this.props.updateStore(updateInfo);
        }

    }

    componentDidUpdate(previousProps) {

        let updateState = false;
        let { selectedRecord, skip, take, siteList } = this.state
        if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord) {
            updateState = true;
            selectedRecord = this.props.Login.selectedRecord;
        }
        if (this.props.Login.userInfo.nformcode !== previousProps.Login.userInfo.nformcode) {
            updateState = true;
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
        if (this.props.Login.masterData !== previousProps.Login.masterData) {
            if (this.props.Login.nneedchange) {
                updateState = true;
                skip = this.props.Login.skip || 0
                take = this.props.Login.take || take
            }
            if (this.props.Login.masterData && this.props.Login.masterData.searchedData &&
                this.props.Login.masterData.searchedData.length > 0) {
                updateState = true;
                skip = this.props.Login.skip || 0
                take = this.props.Login.take || take
            }
        }

        // if (prevProps.formattedTree !== this.props.formattedTree) {
        //     const svg = document.querySelector('.custom');
        //     if (svg) svg.innerHTML = ''; // clear previous lines
        // }

//SWSM-54 - committed by rukshana on september 20-2025 for showing graph view in slideout modal in site hierarchy
        if (this.props.Login.masterData.selectedSiteHierarchyConfig !== previousProps.Login.masterData.selectedSiteHierarchyConfig) {
            let treeData = this.props.Login.masterData && this.props.Login.masterData.selectedSiteHierarchyConfig && this.props.Login.masterData.selectedSiteHierarchyConfig.jsondata;
            if (treeData !== undefined && treeData !== null) {
                let arr = []
                arr.push(this.props.Login.masterData.selectedSiteHierarchyConfig && this.props.Login.masterData.selectedSiteHierarchyConfig.jsondata)
                let pathList = this.buildLabelPaths(arr)
                let selectedTreeNode = {
                        
                        OpenNodes: pathList,
                        CompleteTreePath: pathList[0],
                        AgaramTree: arr,
                        selectedNodeKey: arr[0].item.selectedNodeDetail.nsitetypecode,
                        selectedNodePKey: arr[0].primaryKey
                    }
                const formattedTree = treeData && this.convertToTreeGraphFormat(treeData) || {};
                this.setState({ formattedTree: formattedTree, selectedTreeNode })
            }
        }


        if (this.props.Login.masterData.siteConfigList !== previousProps.Login.masterData.siteConfigList) {
            updateState = true;
            siteList = this.props.Login.masterData.siteConfigList;
        }



        if (updateState) {
            this.setState({
                selectedRecord, skip, take, siteList
            })
        }

    }
//SWSM-54 - committed by rukshana on september 20-2025 for showing graph view in slideout modal in site hierarchy
    buildLabelPaths = (tree) => {
        const result = [];
    
        const traverse = (nodes, pathSoFar = '', currentKey = null) => {
            for (let node of nodes) {
                // If parentKey matches, or it's root (no parentKey), then include in path
                const shouldJoin = !node.parentKey || node.parentKey === currentKey;
                const currentPath = shouldJoin
                    ? pathSoFar
                        ? `${pathSoFar}/${node.key}`
                        : node.key
                    : pathSoFar; // skip if parent doesn't match
    
                if (shouldJoin) result.push(currentPath);
    
                if (node.nodes && node.nodes.length > 0) {
                    traverse(node.nodes, currentPath, node.primaryKey); // pass current node's primaryKey
                }
            }
        };
    
        traverse(tree);
        //return result;
        return result; // ⬅ reverse the result here
    };

    onSaveClick = (saveType, formRef) => {
        let inputData = [];
        let selectedRecord = this.state.selectedRecord;
        inputData["userinfo"] = this.props.Login.userInfo;
        if (selectedRecord.sconfigname !== undefined && selectedRecord.sconfigname !== "") {
            if (this.props.Login.operation === 'copy') {
                this.copySiteHierarchyConfiguration();
            } else if (selectedRecord.AgaramTree && selectedRecord.AgaramTree.length > 0 && selectedRecord.AgaramTree[0].nodes.length > 0) {
                let postParam = undefined;

                let ssitecode = collectAllPrimaryKeys(selectedRecord.AgaramTree);
                inputData["sitehierarchyconfig"] = {
                    "sconfigname": selectedRecord.sconfigname,
                    "nneedalltypesite": selectedRecord.nneedalltypesite,
                    "jsondata": selectedRecord.AgaramTree[0]
                };
                inputData["ssitecode"] = ssitecode;

                inputData["sitehierarchyconfigdetails"] = extractPrimaryKeys(selectedRecord.AgaramTree, "");
                if (this.props.Login.operation === "update") {
                    postParam = {
                        inputListName: "SiteHierarchyConfig",
                        selectedObject: "selectedSiteHierarchyConfig",
                        primaryKeyField: "nsitehierarchyconfigcode"
                    };
                    inputData["sitehierarchyconfig"]["nsitehierarchyconfigcode"] = selectedRecord.nsitehierarchyconfigcode;
                    inputData["ssitecodebefore"] = collectAllPrimaryKeys([this.props.Login.masterData.selectedSiteHierarchyConfig.jsondata]);
                }

                const inputParam = {
                    classUrl: "sitehierarchyconfiguration",
                    methodUrl: "SiteHierarchyConfig",
                    inputData: inputData,
                    operation: this.props.Login.operation,
                    saveType, formRef, postParam, searchRef: this.searchRef,
                    selectedRecord: { ...this.state.selectedRecord }

                }
                const masterData = this.props.Login.masterData;

                if (
                    showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolcode)) {
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
                toast.info(this.props.intl.formatMessage({ id: "IDS_ADDEDMORETHANTWONODE" }));
            }
        } else {
            toast.info(this.props.intl.formatMessage({ id: "IDS_ENTERSITECONFIG" }));
        }
    }

    ConfirmDelete = (deleteId) => {
        this.ConfirmMessage.confirm("deleteMessage", this.props.intl.formatMessage({ id: "IDS_DELETE" }), this.props.intl.formatMessage({ id: "IDS_DEFAULTCONFIRMMSG" }),
            this.props.intl.formatMessage({ id: "IDS_OK" }), this.props.intl.formatMessage({ id: "IDS_CANCEL" }),
            () => this.deleteSiteHierarchyConfig(deleteId));
    }

    deleteSiteHierarchyConfig = (deleteId) => {

        if (this.props.Login.masterData.selectedSiteHierarchyConfig.ntransactionstatus === transactionStatus.APPROVED
            || this.props.Login.masterData.selectedSiteHierarchyConfig &&
            this.props.Login.masterData.selectedSiteHierarchyConfig.ntransactionstatus == transactionStatus.RETIRED
        ) {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTDRAFTRECORD" }))
        }
        else {
            const postParam = {
                inputListName: "SiteHierarchyConfig", selectedObject: "selectedSiteHierarchyConfig",
                primaryKeyField: "nsitehierarchyconfigcode",
                primaryKeyValue: this.props.Login.masterData.selectedSiteHierarchyConfig.nsitehierarchyconfigcode,
                fetchUrl: "sitehierarchyconfiguration/getSiteHierarchyConfiguration",
                fecthInputObject: {
                    userinfo: this.props.Login.userInfo
                },
            }
            const inputData = {
                'sitehierarchyconfig': this.props.Login.masterData.selectedSiteHierarchyConfig,
                "ssitecode": collectAllPrimaryKeys([this.props.Login.masterData.selectedSiteHierarchyConfig.jsondata])

            }
            inputData['userinfo'] = this.props.Login.userInfo
            const inputParam = {
                methodUrl: 'SiteHierarchyConfig',
                classUrl: "sitehierarchyconfiguration",
                displayName: "IDS_SITEHIERARCHYCONFIGURATIONNAME",
                inputData: inputData, postParam,
                operation: "delete",
                selectedRecord: { ...this.state.selectedRecord }

            }

            const masterData = this.props.Login.masterData;
            if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, deleteId)) {
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        loadEsign: true, screenData: { inputParam, masterData }, operation: "delete",
                        openModal: true, screenName: this.props.intl.formatMessage({ id: "IDS_SITEHIERARCHYCONFIGURATIONNAME" })
                    }
                }
                this.props.updateStore(updateInfo);
            }
            else {
                this.props.crudMaster(inputParam, masterData, "openModal");
            }
        }

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

export const extractPrimaryKeys = (tree, field) => {
    const result = [];
    const resultValue = [];

    const traverse = (nodes) => {
        for (let node of nodes) {
            result.push(node.primaryKey); // store primary key
            resultValue.push({ nnodesitecode: node.primaryKey, nparentsitecode: node.parentKey }); // store primary key
            if (node.nodes && node.nodes.length > 0) {
                traverse(node.nodes); // recurse into children
            }
        }
    };


    traverse(tree);
    if (field === "get") {
        return result;
    } else {
        return resultValue;
    }

};


const collectAllChildrenMap = (tree) => {
    const result = {};

    const collect = (node) => {
        let collected = [];

        for (let child of node.nodes) {
            collected.push(child.primaryKey);
            if (child.nodes && child.nodes.length > 0) {
                const childCollected = collect(child);
                collected = collected.concat(childCollected);
            }
        }

        if (collected.length > 0) {
            result[node.primaryKey] = collected.join(",");
        }

        return collected;
    };

    for (let node of tree) {
        collect(node);
    }

    return result;
};


export const updateTreeAndBuildPaths = (treeData, selectedRecord, selectedNodeKey, action) => {
    const clonedTree = JSON.parse(JSON.stringify(treeData));
    let addedNodePath = null;
    let parentNodePath = null;
    let deletedNodePath = null;
    let nextnsitecode = null;
    let nextnsitetypecode = null;

    const buildLabelPaths = (tree) => {
        const result = [];

        const traverse = (nodes, pathSoFar = '', currentKey = null) => {
            for (let node of nodes) {
                const shouldJoin = !node.parentKey || node.parentKey === currentKey;
                const currentPath = shouldJoin
                    ? pathSoFar
                        ? `${pathSoFar}/${node.key}`
                        : node.key
                    : pathSoFar;

                if (shouldJoin) result.push(currentPath);

                if (node.nodes && node.nodes.length > 0) {
                    traverse(node.nodes, currentPath, node.primaryKey);
                }
            }
        };

        traverse(tree);
        return result.reverse();
    };

    // Insert Node
    const insertNode = (nodes, currentPath = []) => {
        for (let node of nodes) {
            const newPath = [...currentPath, node.key];

            if (node.primaryKey === selectedNodeKey) {
                for (let i = 0; i < selectedRecord.nsitecode.length; i++) {
                    parentNodePath = newPath.join('/');
                    const newNode = {
                        key: selectedRecord.nsitecode[i].label,
                        primaryKey: selectedRecord.nsitecode[i].value,
                        parentKey: node.primaryKey,
                        label: selectedRecord.nsitecode[i].item.ssitetypename + " : " + selectedRecord.nsitecode[i].item.ssiteconfigname,
                        item: {
                            selectedNode: selectedRecord.nsitecode[i].label,
                            primaryKeyField: "nsitecode",
                            primaryKeyValue: selectedRecord.nsitecode[i].label,
                            selectedNodeName: selectedRecord.nsitecode[i].label,
                            selectedNodeDetail: selectedRecord.nsitecode[i].item,
                        },
                        nodes: [],
                    };
                    node.nodes.push(newNode);
                    addedNodePath = [...newPath, newNode.key].join('/');
                    nextnsitecode = selectedRecord.nsitecode[i].item && selectedRecord.nsitecode[i].item.nsitecode;
                    nextnsitetypecode = selectedRecord.nsitecode[i].item && selectedRecord.nsitecode[i].item.nhierarchicalorderno;
                }
                return true;

            }

            if (node.nodes && node.nodes.length > 0) {
                const inserted = insertNode(node.nodes, newPath);
                if (inserted) return true;
            }
        }
        return false;
    };

    // Delete Node by primaryKey
    //   const deleteNode = (nodes, currentPath = []) => {
    //     for (let i = 0; i < nodes.length; i++) {
    //       const node = nodes[i];
    //       const newPath = [...currentPath, node.key];

    //       if (node.primaryKey === selectedNodeKey) {
    //         nodes.splice(i, 1);
    //         deletedNodePath = newPath.join('/');
    //         return true;
    //       }

    //       if (node.nodes && node.nodes.length > 0) {
    //         const deleted = deleteNode(node.nodes, newPath);
    //         if (deleted) return true;
    //       }
    //     }
    //     return false;
    //   };
    let nextPointerPath = null; // Path to highlight after deletion



    const deleteNode = (nodes, currentPath = [], parent = null) => {
        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            const newPath = [...currentPath, node.key];

            if (node.primaryKey === selectedNodeKey) {
                deletedNodePath = newPath.join('/');

                // Decide where the pointer should go next
                if (i > 0) {
                    // Point to previous sibling
                    const previousSibling = nodes[i - 1];
                    nextPointerPath = [...currentPath, previousSibling.key].join('/');
                    nextnsitecode = previousSibling.primaryKey;
                    nextnsitetypecode = previousSibling.item.selectedNodeDetail.nhierarchicalorderno;
                } else if (parent) {
                    // No previous sibling — point to parent
                    nextPointerPath = [...currentPath].join('/');
                    nextnsitecode = parent.primaryKey;
                    nextnsitetypecode = parent.item.selectedNodeDetail.nhierarchicalorderno;
                }

                nodes.splice(i, 1); // Perform actual deletion

                // Clean up parent if needed
                if (parent && parent.nodes.length === 0) {
                    parent.nodes = [];
                }

                return true;
            }

            if (node.nodes && node.nodes.length > 0) {
                const deleted = deleteNode(node.nodes, newPath, node);
                if (deleted) {
                    // Optional cleanup after child deletion
                    if (node.nodes.length === 0) node.nodes = [];
                    return true;
                }
            }
        }
        return false;
    };


    // Perform action
    if (action === 'insert') {
        insertNode(clonedTree);
    } else if (action === 'delete') {
        deleteNode(clonedTree);
    }

    // Build updated label paths
    const labelPaths = buildLabelPaths(clonedTree);

    return {
        updatedTree: clonedTree,
        labelPaths,
        ...(action === 'insert' && {
            addedNodePath,
            parentNodePath, nextnsitecode, nextnsitetypecode
        }),
        ...(action === 'delete' && {
            deletedNodePath,
            nextPointerPath, nextnsitecode, nextnsitetypecode
        }),
    };

};

const buildReverseParentChain = (tree) => {
    const parentMap = {};
    const result = {};

    // Step 1: Build a map of child → parent
    const mapParents = (nodes, parent = null) => {
        for (let node of nodes) {
            if (parent) {
                parentMap[node.primaryKey] = parent.primaryKey;
            }
            if (node.nodes && node.nodes.length > 0) {
                mapParents(node.nodes, node);
            }
        }
    };

    // Step 2: From each child, walk up to root and collect parent keys
    const buildPaths = () => {
        for (let childKey in parentMap) {
            const path = [];
            let current = parentMap[childKey];
            while (current) {
                path.push(current);
                current = parentMap[current];
            }
            result[childKey] = path.join(",");
        }
    };

    // Execute both steps
    mapParents(tree);
    buildPaths();

    return result;
};

const collectAllPrimaryKeys = (tree) => {
    const result = [];

    const traverse = (nodes) => {
        for (let node of nodes) {
            result.push(node.primaryKey);
            if (node.nodes && node.nodes.length > 0) {
                traverse(node.nodes);
            }
        }
    };

    traverse(tree);

    return { key: result.join(",") };
};



const mapStateToProps = (state) => {
    return {
        Login: state.Login
    }
}

export default connect(mapStateToProps,
    {
        callService, crudMaster, validateEsignCredential, updateStore, approveSiteHierarchy, retireSiteHierarchy,
        filterTransactionList, getSiteHierarchy, getSiteHierarchyConfigDetail, getEditSiteHierarchyData,getTreeDetail
    })(injectIntl(SiteHierarchyConfiguration));