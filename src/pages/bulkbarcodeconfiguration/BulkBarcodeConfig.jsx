import React from 'react'
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Row, Col, Button, Card, Nav, FormGroup, FormLabel } from 'react-bootstrap';//Nav, Card, Button
import { process } from '@progress/kendo-data-query';
import { toast } from 'react-toastify';
import { ContentPanel, ReadOnlyText } from '../../components/App.styles';
import { constructOptionList, getControlMap, showEsign, sortData } from '../../components/CommonScript';//showEsign, getControlMap,
import {
    callService, crudMaster, validateEsignCredential, updateStore, getEditData, getFilterProjectType,
    getBulkBarcodeConfigDetail, addBarcodeMaster, getFieldLengthService, getBulkBarcodeDetailsEditData,
    getParentBarcodeService, filterTransactionList, saveBarcodeMaster, validateEsignCredentialSaveBarcodeMaster
} from '../../actions';
import { DEFAULT_RETURN } from '../../actions/LoginTypes';
import BreadcrumbComponent from '../../components/Breadcrumb.Component';
import DataGrid from '../../components/data-grid/data-grid.component';
//import SplitterLayout from '@progress/kendo-react-layout'; //'react-splitter-layout';
import { Splitter, SplitterPane } from '@progress/kendo-react-layout';
import { ProductList } from '../product/product.styled';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faPlus, faPencilAlt, faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import SlideOutModal from '../../components/slide-out-modal/SlideOutModal';
import { ReactComponent as RefreshIcon } from '../../assets/image/refresh.svg';
import TransactionListMasterJsonView from '../../components/TransactionListMasterJsonView';
import { designProperties, transactionStatus } from '../../components/Enumeration';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import Esign from '../audittrail/Esign';
import { ListWrapper } from '../userroletemplate/userroletemplate.styles';
import AddBulkBarcodeConfiguration from './AddBulkBarcodeConfig';
import AddBulkBarcodeConfigMaster from './AddBulkBarcodeConfigMaster';
import ConfirmMessage from '../../components/confirm-alert/confirm-message.component';



class BulkBarcodeConfig extends React.Component {
    constructor(props) {
        super(props);
        this.myRef = React.createRef();
        const dataState = {
            skip: 0,
            take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5
        };
        this.searchFieldList = ["sconfigname", "sprojecttypename", "sversionno", "stransdisplaystatus"]

        this.state = {

            selectedRecord: {},
            selectedMasterRecord: {},
            operation: "",
            gridHeight: 'auto',
            screenName: undefined,
            userRoleControlRights: [],
            ControlRights: undefined,
            ConfirmDialogScreen: false,
            controlMap: new Map(),
            dataResult: [],
            dataState: dataState,
            skip: 0,
            error:"",
            take: this.props.Login.settings && this.props.Login.settings[3],
            kendoSkip: 0,
            kendoTake: this.props.Login.settings ? parseInt(this.props.Login.settings[16]) : 5,
            splitChangeWidthPercentage: 30,
               //Added by L.Subashini on 26/12/2025 for Splitter issue with React Version Upgrade to 17
            panes: [
                { size: '30%', min: '25%', resizable: true, collapsible:true }    
            ],
        };
        this.searchRef = React.createRef();
        this.ConfirmMessage = new ConfirmMessage();
    }

      //Added by L.Subashini on 25/12/2025 for Splitter issue with React Version Upgrade to 17
    onSplitterChange = (event) => {
        this.setState({ panes: event.newState});
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




    render() {
      let BarcodeDetails=sortData(this.props.Login.masterData.BarcodeDetails,'ascending','nsorter')
        let versionStatusCSS = "outline-secondary";
        if (this.props.Login.masterData.selectedBulkBarcodeConfig
            && this.props.Login.masterData.selectedBulkBarcodeConfig.ntransactionstatus === transactionStatus.APPROVED) {
            versionStatusCSS = "outline-success";
        }
        else if (this.props.Login.masterData.selectedBulkBarcodeConfig
            && this.props.Login.masterData.selectedBulkBarcodeConfig.ntransactionstatus === transactionStatus.RETIRED) {
            versionStatusCSS = "outline-danger";
        }
        const addID = this.state.controlMap.has("AddBulkBarcodeConfiguration") && this.state.controlMap.get("AddBulkBarcodeConfiguration").ncontrolcode;
        const editId = this.state.controlMap.has("EditBulkBarcodeConfiguration") && this.state.controlMap.get("EditBulkBarcodeConfiguration").ncontrolcode;
        const deleteId = this.state.controlMap.has("DeleteBulkBarcodeConfiguration") && this.state.controlMap.get("DeleteBulkBarcodeConfiguration").ncontrolcode;
        const approveId = this.state.controlMap.has("ApproveBulkBarcodeConfiguration") && this.state.controlMap.get("ApproveBulkBarcodeConfiguration").ncontrolcode;
        const addMasterID = this.state.controlMap.has("AddBulkBarcodeMaster") && this.state.controlMap.get("AddBulkBarcodeMaster").ncontrolcode;
        const addFieldID = this.state.controlMap.has("AddBulkBarcodeField") && this.state.controlMap.get("AddBulkBarcodeField").ncontrolcode;
        const editMasterId = this.state.controlMap.has("EditBulkBarcodeConfigDetails") && this.state.controlMap.get("EditBulkBarcodeConfigDetails").ncontrolcode;
        const deleteMasterId = this.state.controlMap.has("DeleteBulkBarcodeConfigDetails") && this.state.controlMap.get("DeleteBulkBarcodeConfigDetails").ncontrolcode;

        this.extractedColumnList = [
            { "idsName": "IDS_BARCODEFIELDNAME", "dataField": "sdisplayname", "width": "250px", "componentName": "date" },
            { "idsName": "IDS_FIELDLENGTH", "dataField": "nfieldlength", "width": "150px" },
            { "idsName": "IDS_SORTORDER", "dataField": "nsorter", "width": "150px" },
            { "idsName": "IDS_STARTINDEX", "dataField": "nfieldstartposition", "width": "150px" },
        ]
        let mandatoryFields = [];
        let mandatoryBarcodeMasterFields = [];
        mandatoryFields = [
            { "idsName": "IDS_CONFIGURATIONNAME", "dataField": "sconfigname", "width": "150px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
            { "idsName": "IDS_BARCODELENGTH", "dataField": "nbarcodelength", "width": "150px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
        ]

        if (this.props.Login.fieldName == "barcodemaster") {
            mandatoryBarcodeMasterFields.push({ "idsName": "IDS_BARCODEMASTERNAME", "dataField": "nbarcodemastercode", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" })
        }
        mandatoryBarcodeMasterFields.push(
            { "idsName": "IDS_FIELDNAME", "dataField": "sfieldname", "width": "150px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
            { "idsName": "IDS_FIELDLENGTH", "dataField": "nfieldlength", "width": "150px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
            { "idsName": "IDS_SORTORDER", "dataField": "nsorter", "width": "150px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
        )
        if ((this.props.Login.fieldName == "barcodemaster" && this.state.selectedMasterRecord && this.state.selectedMasterRecord.isneedparent === transactionStatus.YES)) {
            mandatoryBarcodeMasterFields.push({ "idsName": "IDS_PARENTMASTERNAME", "dataField": "nparentmastercode", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" })
        }

        const SubFields = [
            { [designProperties.VALUE]: "sversionno" },
            { [designProperties.VALUE]: "stransdisplaystatus" },

        ];
        const editParam = {
            screenName: "BulkBarcodeConfigDetails", primaryKeyField: "nbulkbarcodeconfigdetailscode", operation: "update",
            inputParam: this.props.login && this.props.login.inputParam, masterData: this.props.Login.masterData,
            userInfo: this.props.Login.userInfo, ncontrolCode: editMasterId
        };


        const filterParam = {
            inputListName: "BulkBarcodeConfig", selectedObject: "selectedBulkBarcodeConfig", primaryKeyField: "nbulkbarcodeconfigcode",
            fetchUrl: "bulkbarcodeconfiguration/getBulkBarcodeConfig", masterData: this.props.Login.masterData||{},

            fecthInputObject: {
                userinfo: this.props.Login.userInfo,
                nprojecttypecode: this.props.Login.masterData.SelectedProjectType &&
                    this.props.Login.masterData.SelectedProjectType.nprojecttypecode,
                nbulkbarcodeconfigcode: this.props.Login.masterData.selectedBulkBarcodeConfig &&
                    this.props.Login.masterData.selectedBulkBarcodeConfig.nbulkbarcodeconfigcode

            },
            filteredListName: "searchedBulkBarcodeConfig",
            clearFilter: "no",
            updatedListname: "selectedBulkBarcodeConfig",
            searchRef: this.searchRef,
            searchFieldList: this.searchFieldList,
            changeList:[],isSortable:true,sortList:'BulkBarcodeConfig'
        };

        this.breadCrumbData = this.breadcrumbList();
        return (
            <>
                <ListWrapper className="client-listing-wrap mtop-4 screen-height-window">
                    <BreadcrumbComponent breadCrumbItem={this.breadCrumbData} />
                    <Row noGutters={"true"}>
                        <Col md={12} className='parent-port-height sticky_head_parent' ref={(parentHeight) => { this.parentHeight = parentHeight }}>
                            <ListWrapper className={`vertical-tab-top ${this.state.enablePropertyPopup ? 'active-popup' : ""}`}>
                                {/* <SplitterLayout borderColor="#999" percentage={true} primaryIndex={1} secondaryInitialSize={this.state.splitChangeWidthPercentage} onSecondaryPaneSizeChange={this.paneSizeChange} primaryMinSize={40} secondaryMinSize={20}> */}
                                <Splitter className='layout-splitter' orientation="horizontal"
                                       panes={this.state.panes} onChange={this.onSplitterChange}>
                                    <SplitterPane size="30%" min="20%">  
                                        <TransactionListMasterJsonView
                                            splitChangeWidthPercentage={this.state.splitChangeWidthPercentage}
                                            needMultiSelect={false}
                                            masterList={this.props.Login.masterData.searchedData || this.props.Login.masterData.BulkBarcodeConfig || []}
                                            selectedMaster={[this.props.Login.masterData.selectedBulkBarcodeConfig] || []}
                                            primaryKeyField="nbulkbarcodeconfigcode"
                                            getMasterDetail={(Sample, status) =>
                                                this.props.getBulkBarcodeConfigDetail(

                                                    {
                                                        masterData: this.props.Login.masterData,
                                                        nprojecttypecode:this.props.Login.masterData && this.props.Login.masterData.SelectedProjectType["nprojecttypecode"] ?
                                                        this.props.Login.masterData.SelectedProjectType["nprojecttypecode"] : -1,
                                                        userinfo: this.props.Login.userInfo,
                                                        ...Sample
                                                    }, status
                                                )}
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
                                            showStatusName={true}
                                            needFilter={true}
                                            searchRef={this.searchRef}
                                            filterParam={filterParam}
                                            skip={this.state.skip}
                                            take={this.state.take}
                                            handlePageChange={this.handlePageChange}
                                            showStatusBlink={true}
                                            callCloseFunction={true}
                                            childTabsKey={[]}
                                            splitModeClass={this.state.splitChangeWidthPercentage && this.state.splitChangeWidthPercentage > 50 ? 'split-mode' : this.state.splitChangeWidthPercentage > 40 ? 'split-md' : ''}
                                            commonActions={
                                                <>
                                                    <ProductList className="d-flex product-category float-right">
                                                        <Nav.Link
                                                            className="btn btn-icon-rounded btn-circle solid-blue" role="button"
                                                            data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_ADD" })}
                                                            hidden={this.state.userRoleControlRights.indexOf(addID) === -1}
                                                            onClick={() => this.openModal(addID, 'create', 'IDS_BULKBARCODECONDIG')} >
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
                                            filterComponent={[
                                                {
                                                    "Bulk Barcode Configuration":
                                                        <Row>
                                                            <Col md={12}>
                                                                <FormSelectSearch
                                                                    name={"nprojecttypecode"}
                                                                    as={"select"}
                                                                    onChange={(event) => this.onComboChange(event, 'nprojecttypecode')}
                                                                    formLabel={this.props.intl.formatMessage({ id: "IDS_PROJECTTYPE" })}
                                                                    value={this.state.selectedRecord && this.state.selectedRecord["nprojecttypecode"] ? this.state.selectedRecord["nprojecttypecode"] || [] : []}
                                                                    options={this.state.projectType && this.state.projectType || []}
                                                                    optionId={"value"}
                                                                    optionValue={"label"}
                                                                    isMulti={false}
                                                                    isDisabled={false}
                                                                    isSearchable={false}
                                                                    isClearable={false}
                                                                />
                                                            </Col>
                                                        </Row>
                                                }
                                            ]}

                                        />
                                    </SplitterPane>
                                    <SplitterPane>
                                        <ContentPanel className="panel-main-content">
                                            <Card className="border-0">
                                                {this.props.Login.masterData.selectedBulkBarcodeConfig ? Object.entries(this.props.Login.masterData.selectedBulkBarcodeConfig).length > 0 ?
                                                    <>
                                                        <Card.Header>
                                                            <Card.Title>
                                                                <h1 className="product-title-main">{this.props.Login.masterData.selectedBulkBarcodeConfig.sconfigname}</h1>
                                                            </Card.Title>
                                                            <Card.Subtitle className="readonly-text font-weight-normal">
                                                                <Row>
                                                                    <Col md={8} >
                                                                        <h2 className="product-title-sub flex-grow-1">
                                                                            {`${this.props.intl.formatMessage({ id: "IDS_VERSIONNO" })}:${this.props.Login.masterData.selectedBulkBarcodeConfig.sversionno}`}
                                                                            <span className={`btn btn-outlined ${versionStatusCSS} btn-sm ml-3`}>
                                                                                {this.props.Login.masterData.selectedBulkBarcodeConfig.stransdisplaystatus}
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
                                                                                        onClick={() => this.props.getEditData(this.props.Login.masterData.selectedBulkBarcodeConfig.nbulkbarcodeconfigcode, this.props.Login.userInfo, this.props.Login.masterData, editId, 'IDS_BULKBARCODECONDIG')}>
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

                                                                                </div>
                                                                            </div>
                                                                        </>
                                                                    </Col>
                                                                </Row>
                                                            </Card.Subtitle>
                                                        </Card.Header>
                                                        <Card.Body>
                                                            <Card.Text>

                                                                <Row>

                                                                    <>
                                                                        <Col md="6">
                                                                            <FormGroup>
                                                                                <FormLabel><FormattedMessage id={"IDS_BARCODELENGTH"} /></FormLabel>
                                                                                <ReadOnlyText>{
                                                                                    this.props.Login.masterData.selectedBulkBarcodeConfig.nbarcodelength === "" ? '-'
                                                                                        : this.props.Login.masterData.selectedBulkBarcodeConfig.nbarcodelength}</ReadOnlyText>
                                                                            </FormGroup>
                                                                        </Col>
                                                                        <Col md="6">
                                                                            <FormGroup>
                                                                                <FormLabel><FormattedMessage id={"IDS_DESCRIPTION"} /></FormLabel>
                                                                                <ReadOnlyText>{
                                                                                    this.props.Login.masterData.selectedBulkBarcodeConfig.sdescription === "" ? '-'
                                                                                        : this.props.Login.masterData.selectedBulkBarcodeConfig.sdescription}</ReadOnlyText>
                                                                            </FormGroup>
                                                                        </Col>
                                                                    </>

                                                                </Row>
                                                            </Card.Text>

                                                            <Row noGutters={true}>
                                                                <Col md={8}></Col>
                                                                <Col md={4}>
                                                                    <div className="actions-stripe">
                                                                        <div className="d-flex justify-content-end">
                                                                            <Nav.Link className="add-txt-btn text-right"
                                                                                onClick={() => this.props.addBarcodeMaster(this.props.intl.formatMessage({ id: "IDS_BARCODEMASTERNAME" }), this.props.Login.userInfo,
                                                                                    'create', this.props.Login.masterData,'barcodemaster',addMasterID)}
                                                                                hidden={this.state.userRoleControlRights.indexOf(addMasterID) === -1} >
                                                                                <FontAwesomeIcon icon={faPlus} /> { }
                                                                                <FormattedMessage id='IDS_ADDBARCODEMASTER' defaultMessage='Barcode Master' />
                                                                            </Nav.Link>

                                                                            <Nav.Link className="add-txt-btn text-right"
                                                                                onClick={() => this.addBarcodeField(this.props.intl.formatMessage({ id: "IDS_BARCODEFORMATTINGFIELD" }), this.props.Login.userInfo, 'create',
                                                                                    this.props.Login.masterData,'barcodefield',addFieldID)}
                                                                                hidden={this.state.userRoleControlRights.indexOf(addFieldID) === -1} >
                                                                                <FontAwesomeIcon icon={faPlus} /> { }
                                                                                <FormattedMessage id='IDS_ADDBARCODEFIELD' defaultMessage='Barcode Field' />
                                                                            </Nav.Link>
                                                                        </div>
                                                                    </div>
                                                                </Col>
                                                                <Col md={12}>
                                                                    <DataGrid
                                                                        primaryKeyField={"nbulkbarcodeconfigdetailscode"}
                                                                        dataResult={BarcodeDetails &&
                                                                            BarcodeDetails.length > 0 &&
                                                                            process(BarcodeDetails ? BarcodeDetails : [], this.state.dataState) || []}
                                                                        data={this.state.data || []}
                                                                        dataState={this.state.dataState || []}
                                                                        dataStateChange={this.dataStateChange}
                                                                        extractedColumnList={this.extractedColumnList}
                                                                        controlMap={this.state.controlMap}
                                                                        userRoleControlRights={this.state.userRoleControlRights}
                                                                        inputParam={this.props.Login.inputParam}
                                                                        userInfo={this.props.Login.userInfo}
                                                                        methodUrl="BulkBarcodeConfigDetails"
                                                                        fetchRecord={this.props.getBulkBarcodeDetailsEditData}
                                                                        editParam={editParam}
                                                                        deleteRecord={this.deleteRecord}
                                                                        deleteParam={{ operation: "delete", screenName: "IDS_BARCODEMASTERNAME", ncontrolCode: deleteMasterId }}
                                                                        pageable={true}
                                                                        scrollable={"scrollable"}
                                                                        isToolBarRequired={false}
                                                                        selectedId={this.props.Login.selectedId}
                                                                        hideColumnFilter={false}
                                                                        groupable={false}
                                                                        isActionRequired={true}
                                                                        gridHeight={'350px'}	//ALPD-5082 Changed datagrid height by VISHAKH
                                                                    />
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

                {(this.props.Login.openModal || this.props.Login.openChildModal) ?
                    <SlideOutModal
                        show={(this.props.Login.openModal || this.props.Login.openChildModal)}
                        closeModal={this.props.Login.loadBulkBarcodeConfig ? this.closeModal : this.closeBarcodeMasterModal}
                        operation={this.props.Login.operation}
                        inputParam={this.props.Login.inputParam}
                        screenName={this.props.Login.screenName}
                        esign={this.props.Login.loadEsign}
                        onSaveClick={this.props.Login.loadBulkBarcodeConfig ? this.onSaveClick : this.onSaveBarcodeMasterClick}
                        validateEsign={this.validateEsign}
                        masterStatus={this.props.Login.masterStatus}
                        updateStore={this.props.updateStore}
                        mandatoryFields={this.props.Login.loadBulkBarcodeConfig ? mandatoryFields : mandatoryBarcodeMasterFields}
                        selectedRecord={this.props.Login.loadBulkBarcodeConfig ? this.state.selectedRecord || {} :
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
                            : this.props.Login.loadBulkBarcodeConfig ?
                                <AddBulkBarcodeConfiguration
                                    selectedRecord={this.state.selectedRecord || {}}
                                    onInputOnChange={this.onInputOnChange}
                                    onComboChange={this.onComboChange}
                                    formatMessage={this.props.intl.formatMessage}
                                />
                                : this.props.Login.loadBarcodeMaster ?
                                    <AddBulkBarcodeConfigMaster
                                        fieldName={this.props.Login.fieldName || ""}
                                        selectedMasterRecord={this.state.selectedMasterRecord || {}}
                                        onInputOnChange={this.onInputOnChangeMaster}
                                        onComboChange={this.onComboChangeMaster}
                                        formatMessage={this.props.intl.formatMessage}
                                        ParentBarcodeMasterList={this.props.Login.ParentBarcodeMasterList}
                                        bulkBarcodeMasterList={this.props.Login.bulkBarcodeMasterList}
                                        operation={this.props.Login.operation}
                                    />
                                    : ""}
                    /> : ""}

            </>
        );

    }

    addBarcodeField = (screenName, userInfo, operation, masterData,ncontrolcode) => {
        if (masterData.selectedBulkBarcodeConfig.ntransactionstatus === transactionStatus.APPROVED ||
            masterData.selectedBulkBarcodeConfig.ntransactionstatus === transactionStatus.RETIRED) {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTDRAFTRECORD" }));
        } else {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    openChildModal: true,
                    loadBarcodeMaster: true, operation: operation,ncontrolcode:ncontrolcode, fieldName: screenName, loadBulkBarcodeConfig: false, screenName
                }
            }
            this.props.updateStore(updateInfo);
        }
    }
    approveVersion = (ncontrolCode) => {
        if (this.props.Login.masterData.selectedBulkBarcodeConfig.ntransactionstatus === transactionStatus.RETIRED) {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_ALREADYRETIRED" }));
        }
        else if (this.props.Login.masterData.selectedBulkBarcodeConfig.ntransactionstatus === transactionStatus.APPROVED) {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_ALREADYAPPROVED" }));
        }
        else {
            let inputData = [];
            inputData["userinfo"] = this.props.Login.userInfo;
            //add               
            let postParam = undefined;
            inputData["bulkbarcodeconfig"] = this.props.Login.masterData.selectedBulkBarcodeConfig;
            postParam = {
                inputListName: "BulkBarcodeConfig", selectedObject: "selectedBulkBarcodeConfig",
                primaryKeyField: "nbulkbarcodeconfigcode"
            };
            const inputParam = {
                classUrl: 'bulkbarcodeconfiguration',
                methodUrl: "BulkBarcodeConfiguration",
                inputData: inputData,
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
                        loadEsign: true,loadBarcodeMaster:false,loadBulkBarcodeConfig:true, screenData: { inputParam, masterData }, saveType, openModal: true, operation: "approve"
                    }
                }
                this.props.updateStore(updateInfo);
            }
            else {
                this.props.crudMaster(inputParam, masterData, "openModal");
            }
        }
    }
    closeModal = () => {
        let loadEsign = this.props.Login.loadEsign;
        let openModal = this.props.Login.openModal;
        let openChildModal = this.props.Login.openChildModal;
        let selectedRecord = this.props.Login.selectedRecord;
        let loadBulkBarcodeConfig = this.props.Login.loadBulkBarcodeConfig;
        if (this.props.Login.loadEsign) {
            if (this.props.Login.operation === "delete" || this.props.Login.operation === "approve") {
                loadEsign = false;
                openModal = false;
                openChildModal=false;
                loadBulkBarcodeConfig=false;
                selectedRecord = { nprojecttypecode: this.state.selectedRecord.nprojecttypecode };
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
            selectedRecord = { nprojecttypecode: this.state.selectedRecord.nprojecttypecode };
            loadBulkBarcodeConfig = false;
        }

        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { openModal, loadEsign, selectedRecord, selectedId: null, loadBulkBarcodeConfig,openChildModal }
        }
        this.props.updateStore(updateInfo);

    }

    closeBarcodeMasterModal = () => {
        let loadEsign = this.props.Login.loadEsign;
        let openModal = this.props.Login.openModal;
        let selectedRecord = this.props.Login.selectedRecord;
        let openChildModal = this.props.Login.openChildModal;
        let selectedMasterRecord = this.props.Login.selectedMasterRecord;
        let loadBarcodeMaster = this.props.Login.loadBarcodeMaster;
        if (this.props.Login.loadEsign) {
            if (this.props.Login.operation === "delete" || this.props.Login.operation === "approve"
                || this.props.Login.operation === "blackList") {
                loadEsign = false;
                openChildModal = false;
                selectedMasterRecord = {};
                openModal=false;
            }
            else {
                loadEsign = false;
                selectedRecord['esignpassword'] = undefined;
                selectedRecord['esigncomments'] = undefined;
                selectedRecord['esignreason'] = undefined;

            }
        }
        else {
            openChildModal = false;
            selectedMasterRecord = {};
            loadBarcodeMaster = false;
            openModal=false;
        }

        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                openChildModal, loadEsign, selectedRecord,openModal,
                selectedMasterRecord, selectedId: null, loadBarcodeMaster
            }
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
        if (this.state.selectedRecord && this.state.selectedRecord["nprojecttypecode"]){
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                openModal: true,
                loadBulkBarcodeConfig: true, operation: operation, screenName: screenName, ncontrolcode: ncontrolcode
            }
        }
        this.props.updateStore(updateInfo);
     }else{
        toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTFILTER" }));
     }
    }

    onReload = () => {
        if (this.state.selectedRecord && this.state.selectedRecord["nprojecttypecode"]){
        this.searchRef.current.value = "";
        let inputData = {
            nprojecttypecode: this.props.Login.masterData && this.props.Login.masterData.SelectedProjectType["nprojecttypecode"] ?
            this.props.Login.masterData.SelectedProjectType["nprojecttypecode"] : -1,
            userinfo: this.props.Login.userInfo,
            postParamList: this.filterParam,
        }
        let masterData = { ...this.props.Login.masterData }
        let inputParam = { masterData, inputData, searchRef: this.searchRef }
        this.props.getFilterProjectType(inputParam)
    }else{
        toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTFILTER" }));
    }
    }

    onFilterSubmit = () => {
        if (this.state.selectedRecord && this.state.selectedRecord["nprojecttypecode"]){
            this.searchRef.current.value = "";
        let masterData = { ...this.props.Login.masterData }

        let inputData = {
            nprojecttypecode: this.state.selectedRecord["nprojecttypecode"] ? this.state.selectedRecord["nprojecttypecode"].value : -1,
            userinfo: this.props.Login.userInfo,
            //postParamList: this.filterParam,
        }
        let inputParam = {
            masterData, inputData, searchRef: this.searchRef
        }
        this.props.getFilterProjectType(inputParam)
    }else{
        toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTFILTER" }));
    }
    }

    onComboChange = (comboData, fieldName) => {
        const selectedRecord = this.state.selectedRecord || {};
        selectedRecord[fieldName] = comboData;;

        this.setState({ selectedRecord });
    }

    onInputOnChange = (event, fieldName) => {
        const selectedRecord = this.state.selectedRecord || {};
        if (event.target.name === 'nbarcodelength') {
            const numericRegex = /^[0-9]+$/;
            if (numericRegex.test(event.target.value)) {
                if (parseInt(event.target.value) !== 0) {
                    selectedRecord[event.target.name] = (parseInt(event.target.value) > 0 &&
                        parseInt(event.target.value) <= parseInt(this.props.Login.settings && this.props.Login.settings['37']))
                        ? event.target.value : event.target.defaultValue;
                } else {
                    selectedRecord[event.target.name] = "";
                }
            } else {
                selectedRecord[event.target.name] = event.target.value === "" ? "" : event.target.defaultValue;
            }
        } else {
            selectedRecord[event.target.name] = event.target.value
        }
        this.setState({ selectedRecord });
    }

    onComboChangeMaster = (comboData, fieldName) => {
        const selectedMasterRecord = this.state.selectedMasterRecord || {};
        if(fieldName==="nbarcodemastercode"){
        if(selectedMasterRecord.nbarcodemastercode && selectedMasterRecord.nbarcodemastercode.value!==comboData.value){
            delete(selectedMasterRecord.isneedparent);
            delete(selectedMasterRecord.nparentmastercode)
        }
    }
        selectedMasterRecord[fieldName] = comboData;
        this.setState({ selectedMasterRecord });
    }

    onInputOnChangeMaster = (event, fieldName) => {
        const selectedMasterRecord = this.state.selectedMasterRecord || {};
        const numericRegex = /^[0-9]+$/;
        if (event.target.type === 'checkbox') {
			//ALPD-5082 Added validation for isvalidationrequired by VISHAKH
            if(fieldName ==="isvalidationrequired"){
                selectedMasterRecord[event.target.name] = event.target.checked === true ? transactionStatus.YES : transactionStatus.NO;
                this.setState({ selectedMasterRecord });
            } else {
                if (selectedMasterRecord.nbarcodemastercode) {
                    selectedMasterRecord[event.target.name] = event.target.checked === true ? transactionStatus.YES : transactionStatus.NO;
                    if (event.target.checked === true) {
                        this.props.getParentBarcodeService({
                            inputData: {
                                userinfo: this.props.Login.userInfo,
                                nprojecttypecode: this.state.selectedRecord.nprojecttypecode.value,
                                masterData: this.props.Login.masterData,
                                selectedMasterRecord: selectedMasterRecord
                            }
                        });
                    }
                    if (event.target.checked === false) {
                        delete (selectedMasterRecord.nparentmastercode);
                    }
    
                    this.setState({ selectedMasterRecord });
                } else {
                    toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTBARCODEMASTER" }));
                }
            }     
        }
        else if (event.target.name === 'nsorter') {

            if (numericRegex.test(event.target.value)) {
                if (parseInt(event.target.value) !== 0) {
                    selectedMasterRecord[event.target.name] = (parseInt(event.target.value) > 0 &&
                        parseInt(event.target.value) <= parseInt(this.props.Login.settings && this.props.Login.settings['37']))
                        ? event.target.value : event.target.defaultValue;
                } else {
                    selectedMasterRecord[event.target.name] = "";
                }
            } else {
                selectedMasterRecord[event.target.name] = event.target.value === "" ? "" : event.target.defaultValue;
            }
            this.setState({ selectedMasterRecord });
        } else if (event.target.name === 'nfieldlength') {
            if (numericRegex.test(event.target.value)) {
                selectedMasterRecord[event.target.name] = event.target.value;
            } else {
                selectedMasterRecord[event.target.name] = event.target.value === "" ? "" : event.target.defaultValue;
            } this.setState({ selectedMasterRecord });
        } else {
            selectedMasterRecord[event.target.name] = event.target.value
            this.setState({ selectedMasterRecord });
        }

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

    breadcrumbList = () => {
        let breadCrumbArray = [];

            breadCrumbArray.push(
                {
                    "label": "IDS_PROJECTTYPE",
                    "value": this.props.Login.masterData.SelectedProjectType &&
                        this.props.Login.masterData.SelectedProjectType.sprojecttypename||'NA'
                });
        return breadCrumbArray;
    };

    componentDidUpdate(previousProps) {

        let updateState = false;
        let { selectedRecord, projectType, selectedProjectType, dataStateAll, skip, take, selectedMasterRecord } = this.state
        if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord) {
            updateState = true;
            selectedRecord = this.props.Login.selectedRecord;
        }
        if (this.props.Login.selectedMasterRecord !== previousProps.Login.selectedMasterRecord) {
            updateState = true;
            selectedMasterRecord = this.props.Login.selectedMasterRecord;
        }
        if (this.props.Login.masterData.ProjectType !== previousProps.Login.masterData.ProjectType) {
            updateState = true;
            const projectTypeMap = constructOptionList(this.props.Login.masterData.ProjectType || [], "nprojecttypecode",
                "sprojecttypename", "nsorter", "ascending", false);
            const projectTypeList = projectTypeMap.get("OptionList");
            projectType = projectTypeList;
            selectedRecord = {
                nprojecttypecode: this.props.Login.masterData.SelectedProjectType !== null ||
                    this.props.Login.masterData.SelectedProjectType !== undefined ? {
                    "value": this.props.Login.masterData.SelectedProjectType && this.props.Login.masterData.SelectedProjectType.nprojecttypecode,
                    "label": this.props.Login.masterData.SelectedProjectType && this.props.Login.masterData.SelectedProjectType.sprojecttypename
                } : this.state.selectedRecord["nprojecttypecode"]
            }
        }
        if (this.props.Login.masterData.SelectedProjectType !== previousProps.Login.masterData.SelectedProjectType) {
            updateState = true;
            selectedRecord = {
                nprojecttypecode: this.props.Login.masterData.SelectedProjectType !== null ||
                    this.props.Login.masterData.SelectedProjectType !== undefined ? {
                    "value": this.props.Login.masterData.SelectedProjectType && this.props.Login.masterData.SelectedProjectType.nprojecttypecode,
                    "label": this.props.Login.masterData.SelectedProjectType && this.props.Login.masterData.SelectedProjectType.sprojecttypename
                } : this.state.selectedRecord["nprojecttypecode"]
            }
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
        if(this.props.Login.masterData.BulkBarcodeConfig){
            let masterList = this.props.Login.masterData.BulkBarcodeConfig &&
             this.props.Login.masterData.BulkBarcodeConfig.slice(skip, skip +take);
            if(!masterList.length>0){
                skip=0;
                take=this.props.Login.settings ? parseInt(this.props.Login.settings[3]) : 5;
            }

        }
        if (this.props.Login.masterData.BarcodeDetails !== previousProps.Login.masterData.BarcodeDetails) {
            updateState = true;
            let { dataState } = this.state;
			//ALPD-4687-Changed by Neeraj
            if (this.props.Login.dataState !==dataState) {
                dataState = { skip: 0, take: this.state.dataState.take } 
            }
          if (this.state.dataResult.data) {
                if (this.state.dataResult.data.length === 1) {
                    let skipcount = this.state.dataState.skip > 0 ? (this.state.dataState.skip - this.state.dataState.take) :
                        this.state.dataState.skip
                    dataState = { skip: skipcount, take: this.state.dataState.take }
                }
            }
          
            this.setState({
                data: this.props.Login.masterData.BarcodeDetails,
                dataResult: process(this.props.Login.masterData.BarcodeDetails ? this.props.Login.masterData.BarcodeDetails : [], dataState),
                dataState
            });
        }

        if (updateState) {
            this.setState({
                selectedRecord, projectType, selectedProjectType, dataStateAll, skip, take, selectedMasterRecord
            })
        }

    }

    onSaveClick = (saveType, formRef) => {
        let inputData = [];
        let selectedRecord = this.state.selectedRecord;
        inputData["userinfo"] = this.props.Login.userInfo;
        let postParam = undefined;
        if (this.props.Login.operation === "update") {
            // edit
            postParam = {
                inputListName: "BulkBarcodeConfig",
                selectedObject: "selectedBulkBarcodeConfig",
                primaryKeyField: "nbulkbarcodeconfigcode"
            };
            inputData["bulkbarcodeconfig"] = {
                "sconfigname": selectedRecord.sconfigname,
                "nbarcodelength": parseInt(selectedRecord.nbarcodelength),
                "sdescription": selectedRecord.sdescription,
                "nprojecttypecode": selectedRecord.nprojecttypecode.value,
                "nbulkbarcodeconfigcode": selectedRecord.nbulkbarcodeconfigcode
            };

        }
        else {
            //add               
            inputData["bulkbarcodeconfig"] = {
                "sconfigname": selectedRecord.sconfigname,
                "nbarcodelength": parseInt(selectedRecord.nbarcodelength),
                "sdescription": selectedRecord.sdescription || "",
                "nprojecttypecode": selectedRecord.nprojecttypecode.value
            };

        }

        const inputParam = {
            classUrl: "bulkbarcodeconfiguration", //this.props.Login.inputParam.classUrl,
            methodUrl: "BulkBarcodeConfiguration",
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
    }
    onSaveBarcodeMasterClick = (saveType, formRef) => {
        let inputData = [];
        let selectedId = null;
        let isParentSameChild = true;
        let selectedMasterRecord = this.state.selectedMasterRecord;
        let selectedProjectType = this.props.Login.masterData && this.props.Login.masterData.SelectedProjectType;
        let selectedBulkBarcodeConfig = this.props.Login.masterData && this.props.Login.masterData.selectedBulkBarcodeConfig;
        if ((selectedMasterRecord.nparentmastercode !== undefined) && (selectedMasterRecord.nbarcodemastercode !== undefined)) {
            if (selectedMasterRecord.nbarcodemastercode && selectedMasterRecord.nbarcodemastercode.value ===
                (selectedMasterRecord.nparentmastercode && selectedMasterRecord.nparentmastercode.item &&
                    selectedMasterRecord.nparentmastercode.item.jsondata && selectedMasterRecord.nparentmastercode.item.jsondata.nbarcodemastercode)
            ) {
                isParentSameChild = false;
            } else {
                isParentSameChild = true;
            }
        }
        if (isParentSameChild) {
            inputData["userinfo"] = this.props.Login.userInfo;
            let postParam = undefined;
            if (this.props.Login.operation === "update") {
                // edit
                postParam = {
                    inputListName: "BulkBarcodeConfig",
                    selectedObject: "selectedBulkBarcodeConfig",
                    primaryKeyField: "nbulkbarcodeconfigcode"
                };
                inputData["bulkbarcodeconfigdetails"] = {
                    "nbulkbarcodeconfigcode": selectedBulkBarcodeConfig.nbulkbarcodeconfigcode,
                    "nsorter": selectedMasterRecord && selectedMasterRecord.nsorter,
                    "sdescription": selectedMasterRecord && selectedMasterRecord.sdescription || "",
                    "nbulkbarcodeconfigdetailscode": selectedMasterRecord.nbulkbarcodeconfigdetailscode,
                    "nprojecttypecode": selectedBulkBarcodeConfig.nprojecttypecode,
                    "isvalidationrequired": selectedMasterRecord && selectedMasterRecord.isvalidationrequired	//ALPD-5082 Added isvalidationrequired for update by VISHAKH
                };
                selectedId = this.props.Login.selectedId;

            }
            else {
                //add               
                inputData["bulkbarcodeconfigdetails"] = {
                    "nbulkbarcodeconfigcode": selectedBulkBarcodeConfig.nbulkbarcodeconfigcode,
                    "nprojecttypecode": selectedProjectType.nprojecttypecode,
                    "nneedmaster": this.props.Login.fieldName === 'barcodemaster' ? transactionStatus.YES : transactionStatus.NO,
                    "nqueryneed": (selectedMasterRecord && selectedMasterRecord.nbarcodemastercode && selectedMasterRecord.nbarcodemastercode.item.squery === null ||
                        selectedMasterRecord && selectedMasterRecord.nbarcodemastercode && selectedMasterRecord.nbarcodemastercode.item && selectedMasterRecord.nbarcodemastercode.item.squery === undefined) ? transactionStatus.NO : transactionStatus.YES,
                    "nquerybuildertablecode": -1,
                    "stablename": selectedMasterRecord && selectedMasterRecord.nbarcodemastercode && selectedMasterRecord.nbarcodemastercode.item && selectedMasterRecord.nbarcodemastercode.item.stablename || "",
                    "stablecolumnname": selectedMasterRecord && selectedMasterRecord.nbarcodemastercode && selectedMasterRecord.nbarcodemastercode.item && selectedMasterRecord.nbarcodemastercode.item.sconditionalfieldname || "",
                    "nfieldstartposition": 0,
                    "nfieldlength": selectedMasterRecord && selectedMasterRecord.nfieldlength,
                    "nsorter": selectedMasterRecord && selectedMasterRecord.nsorter,
                    "jsondata": {
                        sfieldname: selectedMasterRecord && selectedMasterRecord.sfieldname,
                        stablefieldname: selectedMasterRecord && selectedMasterRecord.nbarcodemastercode && selectedMasterRecord.nbarcodemastercode.item && selectedMasterRecord.nbarcodemastercode.item.stablecolumnname,
                        isneedparent: selectedMasterRecord.isneedparent || 4,
                        sprimarykeyfieldname: selectedMasterRecord.nbarcodemastercode && selectedMasterRecord.nbarcodemastercode.item && selectedMasterRecord.nbarcodemastercode.item.stableprimarykey,
                        parentData: {
                            ...selectedMasterRecord.nparentmastercode && selectedMasterRecord.nparentmastercode.item,
                        },
                        nbarcodemastercode: selectedMasterRecord.nbarcodemastercode && selectedMasterRecord.nbarcodemastercode.value,
                        nformcode: selectedMasterRecord.nbarcodemastercode && selectedMasterRecord.nbarcodemastercode.item && selectedMasterRecord.nbarcodemastercode.item.nformcode,
                        sformname: selectedMasterRecord.nbarcodemastercode && selectedMasterRecord.nbarcodemastercode.item && selectedMasterRecord.nbarcodemastercode.item.sformname,
                        isvalidationrequired: selectedMasterRecord && selectedMasterRecord.isvalidationrequired ? selectedMasterRecord.isvalidationrequired : transactionStatus.NO	//ALPD-5082 Added isvalidationrequired for create by VISHAKH
                    },
                    "squery": selectedMasterRecord && selectedMasterRecord.nbarcodemastercode && selectedMasterRecord.nbarcodemastercode.item && selectedMasterRecord.nbarcodemastercode.item.squery || null,
                    "sdescription": selectedMasterRecord && selectedMasterRecord.sdescription || "",
                    "sfieldname": selectedMasterRecord && selectedMasterRecord.sfieldname,
                };

            }

            const inputParam = {
                classUrl: "bulkbarcodeconfiguration", //this.props.Login.inputParam.classUrl,
                methodUrl: "BulkBarcodeMaster",
                inputData: inputData, selectedId,
                operation: this.props.Login.operation,
                saveType, formRef, postParam, searchRef: this.searchRef,
                selectedMasterRecord: this.state.selectedMasterRecord

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
                this.props.saveBarcodeMaster(inputParam, masterData, "openChildModal");
            }
        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_MASTERANDPARENTCANNOTBESAME" }));
        }
    }

    deleteRecord = (deleteParam) => {
        let inputData = [];
        let inputParam = {};
        if (this.props.Login.masterData.selectedBulkBarcodeConfig &&
            this.props.Login.masterData.selectedBulkBarcodeConfig.ntransactionstatus == transactionStatus.APPROVED
            || this.props.Login.masterData.selectedBulkBarcodeConfig &&
            this.props.Login.masterData.selectedBulkBarcodeConfig.ntransactionstatus == transactionStatus.RETIRED) {

            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTDRAFTRECORD" }));
        } else {
            inputData["bulkbarcodeconfigdetails"] = {
                ...deleteParam.selectedRecord, sfieldname: deleteParam.selectedRecord &&
                    deleteParam.selectedRecord.jsondata && deleteParam.selectedRecord.jsondata.sfieldname
            };
            inputData["userinfo"] = this.props.Login.userInfo;
            inputParam = {
                classUrl: "bulkbarcodeconfiguration",
                methodUrl: "BulkBarcodeMaster",
                inputData: inputData,
                operation: "delete",
                dataState: this.state.dataState
            }


            if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, deleteParam.ncontrolCode)) {
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        loadEsign: true, screenData: { inputParam, masterData: this.props.Login.masterData },
                        openChildModal: true, loadBarcodeMaster: true, screenName: "BulkBarcodeConfigDetails", operation: "delete"
                    }
                }
                this.props.updateStore(updateInfo);
            }
            else {
                this.props.crudMaster(inputParam, this.props.Login.masterData, "openChildModal");
            }
        }
    }



    ConfirmDelete = (deleteId) => {
        this.ConfirmMessage.confirm("deleteMessage", this.props.intl.formatMessage({ id: "IDS_DELETE" }), this.props.intl.formatMessage({ id: "IDS_DEFAULTCONFIRMMSG" }),
            this.props.intl.formatMessage({ id: "IDS_OK" }), this.props.intl.formatMessage({ id: "IDS_CANCEL" }),
            () => this.deleteBulkBarcodeConfig(deleteId));
    }

    deleteBulkBarcodeConfig = (deleteId) => {

        if (this.props.Login.masterData.selectedBulkBarcodeConfig.ntransactionstatus === transactionStatus.APPROVED ||
            this.props.Login.masterData.selectedBulkBarcodeConfig.ntransactionstatus === transactionStatus.RETIRED) {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTDRAFTRECORD" }))
        }
        else {
            const postParam = {
                inputListName: "BulkBarcodeConfig", selectedObject: "selectedBulkBarcodeConfig",
                primaryKeyField: "nbulkbarcodeconfigcode",
                primaryKeyValue: this.props.Login.masterData.selectedBulkBarcodeConfig.nbulkbarcodeconfigcode,
                fetchUrl: "bulkbarcodeconfiguration/getBulkBarcodeConfiguration",
                fecthInputObject: {
                    userinfo: this.props.Login.userInfo
                },
            }
            const inputData = {
                'bulkbarcodeconfig': this.props.Login.masterData.selectedBulkBarcodeConfig
            }
            inputData['userinfo'] = this.props.Login.userInfo
            const inputParam = {
                methodUrl: 'BulkBarcodeConfiguration',
                classUrl: "bulkbarcodeconfiguration",
                displayName: "IDS_BULKBARCODECONFIG",
                inputData: inputData, postParam,
                operation: "delete",
                selectedRecord: { ...this.state.selectedRecord }

            }

            const masterData = this.props.Login.masterData;
            if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, deleteId)) {
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        loadEsign: true, screenData: { inputParam, masterData },loadBarcodeMaster:false, operation: "delete",
                        openModal: true, screenName: this.props.intl.formatMessage({ id: "IDS_BULKBARCODECONFIG" })
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
        if (this.props.Login.loadBarcodeMaster && this.props.Login.operation === 'update') {
            this.props.validateEsignCredentialSaveBarcodeMaster(inputParam, "openChildModal");
        } else {
            this.props.validateEsignCredential(inputParam, this.props.Login.loadBarcodeMaster ? "openChildModal" : "openModal");

        }

    }

}


const mapStateToProps = (state) => {
    return {
        Login: state.Login
    }
}

export default connect(mapStateToProps,
    {
        callService, crudMaster, validateEsignCredential, updateStore, getEditData,
        getFilterProjectType, getBulkBarcodeConfigDetail, addBarcodeMaster, getFieldLengthService,
        getBulkBarcodeDetailsEditData, getParentBarcodeService, filterTransactionList, saveBarcodeMaster, validateEsignCredentialSaveBarcodeMaster
    })(injectIntl(BulkBarcodeConfig));