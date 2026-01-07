import React from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Row, Col, Button, Card, Nav } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { process } from '@progress/kendo-data-query';
import SlideOutModal from '../../components/slide-out-modal/SlideOutModal';
import Esign from '../audittrail/Esign';
import { ProductList } from '../product/product.styled';
import {
    callService, crudMaster, updateStore, validateEsignCredential,
    getBulkBarcodeGenData, getBulkBarcodeGeneration,
    getBarcodeAndPrinterService,
    filterTransactionList, getProjectBarcodceConfig, importBulkBarcodeGeneration, getTabBulkBarcodeGeneration,deleteBarcodeData,deleteBulkBarcodeGeneration
} from '../../actions';
import { DEFAULT_RETURN } from '../../actions/LoginTypes';
import { constructOptionList, getControlMap, showEsign, onDropAttachFileList, Lims_JSON_stringify, convertDateValuetoString, rearrangeDateFormat, deleteAttachmentDropZone, create_UUID, replaceBackSlash, sortData } from '../../components/CommonScript';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileImport, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { ContentPanel } from '../product/product.styled';
import { ReactComponent as RefreshIcon } from '../../assets/image/refresh.svg';
import ConfirmMessage from '../../components/confirm-alert/confirm-message.component';
import { attachmentType } from '../../components/Enumeration';
import BulkBarcodeGenerationFilter from './BulkBarcodeGenerationFilter';
import BreadcrumbComponent from '../../components/Breadcrumb.Component';
import { ExcelExport, ExcelExportColumn } from '@progress/kendo-react-excel-export';
import { LocalizationProvider } from '@progress/kendo-react-intl';
import ImportBulkBarcodeData from './ImportBulkBarcodeData';
import TransactionListMasterJsonView from '../../components/TransactionListMasterJsonView';
import { faFileExcel ,faPrint} from '@fortawesome/free-solid-svg-icons';
import { ListWrapper } from '../userroletemplate/userroletemplate.styles';
//import SplitterLayout from '@progress/kendo-react-layout'; //'react-splitter-layout';
import { Splitter, SplitterPane } from '@progress/kendo-react-layout';
import AddPrinter from '../registration/AddPrinter';
import ImportDataGridWithSelection from '../../pages/storagemanagement/ImportDataGridWithSelection';


const mapStateToProps = state => {
    return ({ Login: state.Login })
}

class BulkBarcodeGeneration extends React.Component {
    constructor(props) {
        super(props);
        this.formRef = React.createRef();
        this.extractedColumnList = [];
        this.fieldList = [];
        const dataState = {
            skip: 0,
            take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5,
        };
        this.searchFieldList = ["sfilename"]

        this.state = {
            addScreen: false, data: [], masterStatus: "", error: "", operation: "create",
            dataResult: [],
            dataState: dataState,
            userRoleControlRights: [],
            controlMap: new Map(),
            selectedRecord: {},
            sidebarview: false,
            splitChangeWidthPercentage: 30,
                   //Added by L.Subashini on 26/12/2025 for Splitter issue with React Version Upgrade to 17
            panes: [
                { size: '30%', min: '25%', resizable: true, collapsible:true }    
            ],
        };
        this.searchRef = React.createRef();

        this.confirmMessage = new ConfirmMessage();
    }

             //Added by L.Subashini on 25/12/2025 for Splitter issue with React Version Upgrade to 17
    onSplitterChange = (event) => {
        this.setState({ panes: event.newState});
    };

    sidebarExpandCollapse = () => {
        this.setState({
            sidebarview: true
        })
    }

    dataStateChange = (event) => {
        this.setState({
            dataResult: process(this.state.data, event.dataState),
            dataState: event.dataState
        });
    }
    paneSizeChange = (d) => {
        this.setState({
            splitChangeWidthPercentage: d
        })
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


    closeModal = () => {
        let loadEsign = this.props.Login.loadEsign;
        let openModal = this.props.Login.openModal;
        let selectedRecord = this.props.Login.selectedRecord;
        let loadPrinter=this.props.Login.loadPrinter ;
        if (this.props.Login.loadEsign) {
            if (this.props.Login.operation === "delete") {
                loadEsign = false;
                openModal = false;
                selectedRecord = {};
                loadPrinter=false;
            }
            else {
                loadEsign = false;
                // selectedRecord["agree"] = 4;
                selectedRecord['esignpassword'] = ""
                selectedRecord['esigncomments'] = ""
                selectedRecord['esignreason'] = ""
            }
        }
        else {
            openModal = false;
            selectedRecord = {};
            loadPrinter=false;
        }

        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { openModal, loadEsign, selectedRecord, selectedId: null,loadPrinter }
        }
        this.props.updateStore(updateInfo);

    }

    handleDateChange = (dateName, dateValue) => {
        let masterData = this.props.Login.masterData;
        masterData[dateName] = dateValue;
        this.setState({ masterData });
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
        if (props.Login.selectedRecord === undefined) {
            return { selectedRecord: {} }
        }
        return null;
    }

    printBulkBarcodegeneration = (printbarcodeId) => {
        if (this.props.Login.masterData && this.props.Login.masterData.bulkbarcodedatagen && this.props.Login.masterData.bulkbarcodedatagen.length > 0) {
           if(this.props.Login.addedComponentList && this.props.Login.addedComponentList.length>0){
             this.props.getBarcodeAndPrinterService({
                masterData: this.props.Login.masterData,
                ncontrolcode: printbarcodeId,
                userInfo: this.props.Login.userInfo,
                control: "sampleBarcode"
            })
        }else{
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTANYONERECORD" }));
        }
         }else{
            toast.warn(this.props.intl.formatMessage({ id: "IDS_NORECORDSAVAILABLE" }));
         }
    }


    // printBulkBarcodegeneration = () => {
    //     if (this.props.Login.masterData && this.props.Login.masterData.bulkbarcodedatagen && this.props.Login.masterData.bulkbarcodedatagen.length > 0) {


    //         let obj = convertDateValuetoString(this.props.Login.masterData.FromDate, this.props.Login.masterData.ToDate, this.props.Login.userInfo);
    //         let fromDate = obj.fromDate;
    //         let toDate = obj.toDate;
    //         let inputData = {
    //             nbulkbarcodeconfigcode: this.props.Login.masterData && this.props.Login.masterData.realBarcodeConfig && this.props.Login.masterData.realBarcodeConfig.value,
    //             nprojecttypecode: this.props.Login.masterData && this.props.Login.masterData.realProjectType && this.props.Login.masterData.realProjectType.value,
    //             nbulkbarcodegenerationcode: this.props.Login.masterData && this.props.Login.masterData.selectedBulkBarcodeGeneration && this.props.Login.masterData.selectedBulkBarcodeGeneration.nbulkbarcodegenerationcode,
    //             userinfo: this.props.Login.userInfo,
    //             fromDate: fromDate,
    //             toDate: toDate,
    //             jsondata: {},
    //             nbarcodeLength: 14

    //         }
    //         let inputParam = {};
    //         inputParam = {
    //             inputData: inputData,
    //             masterData: this.props.Login.masterData
    //         };
    //         // this.props.getStorageCategoryForSendToStore(inputParam.userInfo, inputParam.masterData, inputParam.controlcode, this.state.selectedRecord, inputData);
    //         this.props.getBulkBarcodeGenData(inputParam);
    //     }
    //     else {
    //         toast.warn(
    //             this.props.intl.formatMessage({
    //                 id: "IDS_NORECORDSAVAILABLE",
    //             })
    //         );

    //     }
    // }

    gridfillingColumn(barcodeFields) {


        let temparray1 = [];
        sortData(barcodeFields, 'ascending', 'nsorter');
        barcodeFields && barcodeFields.forEach(barcodeItem => {


            temparray1.push({
                idsName: barcodeItem.sfieldname,
                dataField: barcodeItem.sfieldname,
                width: '250px'
            });

        });

        const newArray = [...temparray1]
        return newArray;
    }


    render() {
     
        const extractedColumnList = this.gridfillingColumn(this.props.Login.masterData.jsondataBarcodeFields && this.props.Login.masterData.jsondataBarcodeFields);
        this.extractedColumnList = extractedColumnList;

        let obj = convertDateValuetoString(this.props.Login.masterData.realFromDate, this.props.Login.masterData.realToDate, this.props.Login.userInfo);
        const mandatoryFields = [
            { "idsName": "IDS_FILENAME", "dataField": "simportfilename", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
        ]
        const printMandatoryFields = [
            { "idsName": "IDS_BARCODENAME", "dataField": "sbarcodename", "width": "150px", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
            { "idsName": "IDS_PRINTERNAME", "dataField": "sprintername", "width": "150px", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
        ]
        let fromDate = this.props.Login.masterData.FromDate ? rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.FromDate) : new Date();
        let toDate = this.props.Login.masterData.ToDate ? rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.ToDate) : new Date();

        const breadCrumbData = [];
        if (this.props.Login.masterData && this.props.Login.masterData.realProjectType) {

            breadCrumbData.push(
                {
                    "label": "IDS_FROM",
                    "value": obj.breadCrumbFrom
                },
                {
                    "label": "IDS_TO",
                    "value": obj.breadCrumbto
                },
                {
                    "label": "IDS_PROJECTTYPE",
                    "value": this.props.Login.masterData.realProjectType && (this.props.Login.masterData.realProjectType.label || "NA")
                },
                {
                    "label": "IDS_BULKBARCODECONDIG",
                    "value": this.props.Login.masterData.realBarcodeConfig && (this.props.Login.masterData.realBarcodeConfig.label || "NA")
                }
            );
        }






        const exportId = this.state.controlMap.has("ExportBulkBarcodeGeneration") && this.state.controlMap.get("ExportBulkBarcodeGeneration").ncontrolcode;
        const importId = this.state.controlMap.has("ImportBulkBarcodeGeneration") && this.state.controlMap.get("ImportBulkBarcodeGeneration").ncontrolcode;

        const printbarcodeId = this.state.controlMap.has("PrintBulkBarcodeGeneration") && this.state.controlMap.get("PrintBulkBarcodeGeneration").ncontrolcode;
        const deleteId = this.state.controlMap.has("DeleteBulkBarcodeGeneration") && this.state.controlMap.get("DeleteBulkBarcodeGeneration").ncontrolcode;

        let obj1 = convertDateValuetoString(this.props.Login.masterData.FromDate, this.props.Login.masterData.ToDate, this.props.Login.userInfo);
        let fromDate1 = obj1.fromDate;
        let toDate1 = obj1.toDate;
        const filterParam = {



            inputListName: "BulkBarcodeGeneration", selectedObject: "selectedBulkBarcodeGeneration", primaryKeyField: "nbulkbarcodegenerationcode",
            fetchUrl: "bulkbarcodegeneration/getBulkBarcodeGeneration", masterData: this.props.Login.masterData || {},

            fecthInputObject: {
                userinfo: this.props.Login.userInfo,
                nprojecttypecode: this.props.Login.masterData && this.props.Login.masterData.realProjectType &&
                    this.props.Login.masterData.realProjectType.value,
                nbulkbarcodeconfigcode: this.props.Login.masterData && this.props.Login.masterData.selectedBulkBarcodeGeneration &&
                    this.props.Login.masterData.selectedBulkBarcodeGeneration.nbulkbarcodeconfigcode,
                fromDate: fromDate1,
                toDate: toDate1

            },
            filteredListName: "searchedBulkBarcodeConfig",
            clearFilter: "no",
            updatedListname: "selectedBulkBarcodeConfig",
            searchRef: this.searchRef,
            searchFieldList: this.searchFieldList,
            changeList: []
        };


        return (
            <>
                <ListWrapper className="client-listing-wrap mtop-4 screen-height-window">
                    <BreadcrumbComponent breadCrumbItem={breadCrumbData} />
                    <Row noGutters={"true"}>
                        <Col md={12} className='parent-port-height sticky_head_parent' ref={(parentHeight) => { this.parentHeight = parentHeight }}>
                            <ListWrapper className={`vertical-tab-top ${this.state.enablePropertyPopup ? 'active-popup' : ""}`}>
                                {/* <SplitterLayout borderColor="#999" percentage={true} primaryIndex={1} secondaryInitialSize={this.state.splitChangeWidthPercentage} onSecondaryPaneSizeChange={this.paneSizeChange} primaryMinSize={40} secondaryMinSize={20}> */}
                                <Splitter className='layout-splitter' orientation="horizontal"
                                       panes={this.state.panes} onChange={this.onSplitterChange}>
                                    <SplitterPane size="50%" min="20%">  
                                        <TransactionListMasterJsonView
                                            splitChangeWidthPercentage={this.state.splitChangeWidthPercentage}
                                            hidePaging={false}
                                            filterColumnData={this.props.filterTransactionList}
                                            needMultiSelect={false}
                                            masterList={this.props.Login.masterData.searchedData ||
                                                this.props.Login.masterData.BulkBarcodeGeneration || []}
                                            selectedMaster={[this.props.Login.masterData && this.props.Login.masterData.selectedBulkBarcodeGeneration]}
                                            primaryKeyField="nbulkbarcodegenerationcode"
                                            getMasterDetail={(bulkBarcodeGeneration) =>
                                                this.props.getTabBulkBarcodeGeneration(
                                                    bulkBarcodeGeneration,
                                                    this.props.Login.userInfo,
                                                    this.props.Login.masterData,
                                                    this.state.selectedRecord
                                                )}
                                            inputParam={{
                                                userInfo: this.props.Login.userInfo,
                                                masterData: this.props.Login.masterData
                                            }}
                                            mainField={"sfilename"}
                                            selectedListName="selectedBulkBarcodeGeneration"
                                            objectName="LocationMaster"
                                            searchListName="searchedData"
                                            searchRef={this.searchRef}
                                            filterParam={filterParam}
                                            showFilter={this.props.Login.showFilter}
                                            openFilter={this.openFilter}
                                            closeFilter={this.closeFilter}
                                            onFilterSubmit={this.onFilterSubmit}
                                            needFilter={true}
                                            handlePageChange={this.handlePageChange}
                                            skip={this.state.skip}
                                            take={this.state.take}
                                            //ALPD-4614--Vignesh R(01-08-2024)
                                            childTabsKey={[]}
                                            splitModeClass={this.state.splitChangeWidthPercentage && this.state.splitChangeWidthPercentage > 50 ? 'split-mode' : this.state.splitChangeWidthPercentage > 40 ? 'split-md' : ''}


                                            commonActions={
                                                <ProductList className="d-flex product-category float-right">

                                                    <Button className="btn btn-icon-rounded btn-circle solid-blue" role="button"
                                                        data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_EXPORTTEMPLATE" })}
                                                        onClick={() => this.handleExportClick()}
                                                        hidden={this.state.userRoleControlRights.indexOf(exportId) === -1}

                                                    >
                                                        <FontAwesomeIcon icon={faFileExcel} />
                                                    </Button>

                                                    <Button className="btn btn-circle outline-grey ml-2" variant="link"
                                                        data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_IMPORTDATA" })}
                                                        hidden={this.state.userRoleControlRights.indexOf(importId) === -1}

                                                        onClick={() => this.handleImportClick()}>
                                                        <FontAwesomeIcon icon={faFileImport} />
                                                    </Button>

                                                    <Button className="btn btn-circle outline-grey ml-2" variant="link"
                                                    data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_DELETE" })}
                                                    hidden={this.state.userRoleControlRights.indexOf(deleteId) === -1}
                                                    onClick={() => this.ConfirmDelete(deleteId)}>
                                                    <FontAwesomeIcon icon={faTrashAlt} />
                                                    </Button>

                                                    <Button className="btn btn-circle outline-grey ml-2 p-0" variant="link"
                                                        onClick={() => this.reloadData()}
                                                        data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_REFRESH" })}>
                                                        <RefreshIcon className='custom_icons' />
                                                    </Button>
                                                </ProductList>
                                            }
                                            filterComponent={[
                                                {

                                                    "IDS_BULKBARCODEGENRATION":
                                                        <BulkBarcodeGenerationFilter
                                                            fromDate={fromDate}
                                                            toDate={toDate}
                                                            projectType={this.state.projectType}
                                                            onComboChange={this.onComboChange}
                                                            defaultProjectType={this.props.Login.masterData.defaultProjectType || {}}
                                                            handleDateChange={this.handleDateChange}
                                                            userInfo={this.props.Login.userInfo}
                                                            masterData={this.props.Login.masterData}
                                                            selectedRecord={this.state.selectedRecord}
                                                            bulkbarcodeconfig={this.state.bulkbarcodeconfig}

                                                        />
                                                }
                                            ]}

                                        />
                                    </SplitterPane>
                                    <SplitterPane>
                                        <ContentPanel className="panel-main-content">
                                            
                                        {this.props.Login.masterData && this.props.Login.masterData.selectedBulkBarcodeGeneration && this.props.Login.masterData.realBarcodeConfig&&

                                            <Card className="border-0">
                                                <>
                                                    <Card.Header>
                                                        <Card.Title className="product-title-main">{this.props.Login.masterData && this.props.Login.masterData.selectedBulkBarcodeGeneration && this.props.Login.masterData.selectedBulkBarcodeGeneration.sfilename}</Card.Title>
                                                        <Card.Subtitle className="readonly-text font-weight-normal">
                                                            <Row>
                                                                <Col md={8} >
                                                                    <h2 className="product-title-sub flex-grow-1">

                                                                        {this.props.Login.masterData && this.props.Login.masterData.selectedBulkBarcodeGeneration && this.props.Login.masterData.realBarcodeConfig.label}

                                                                    </h2>
                                                                </Col>
                                                                <Col md={4}>
                                                                    <>
                                                                        <div className="d-flex product-category" style={{ float: "right" }}>
                                                                            <div className="d-inline ">
                                                                                <Nav.Link className="btn btn-circle outline-grey mr-2 action-icons-wrap" href=""
                                                                                data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_DELETE" })}
                                                                                hidden={this.state.userRoleControlRights.indexOf(deleteId) === -1}
                                                                                onClick={() => this.ConfirmDeleteBarcodeRecord(deleteId)}>
                                                                                <FontAwesomeIcon icon={faTrashAlt} />

                                                                                </Nav.Link>

                                                                                < Button className="btn btn-circle outline-grey ml-2" variant="link"
                                                                                    data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_BARCODEGENERATION" })}

                                                                                    hidden={this.state.userRoleControlRights.indexOf(printbarcodeId) === -1}
                                                                                    onClick={() => this.printBulkBarcodegeneration(printbarcodeId)}
                                                                                    // onClick={() => this.props.getBarcodeAndPrinterService({
                                                                                    //     masterData: this.props.Login.masterData,
                                                                                    //     ncontrolcode: printbarcodeId,
                                                                                    //     userInfo: this.props.Login.userInfo,
                                                                                    //     control: "sampleBarcode"
                                                                                    // })}
                                                                                >


                                                                                    <FontAwesomeIcon icon={faPrint} />
                                                                                </Button>

                                                                            </div>
                                                                        </div>
                                                                    </>
                                                                </Col>
                                                            </Row>
                                                        </Card.Subtitle>
                                                    </Card.Header>
                                                    <Card.Body>


                                                        <Row noGutters={true}>

                                                            <Col md={12}>
                                                    <ImportDataGridWithSelection
                                                    userInfo={this.props.Login.userInfo}
                                                    data={(this.props.Login.masterData && this.props.Login.masterData.selectedBulkBarcodeGeneration && this.props.Login.masterData.bulkbarcodedatagen !== null) || (this.props.Login.masterData && this.props.Login.masterData.selectedBulkBarcodeGeneration && this.props.Login.masterData.bulkbarcodedatagen.length > 0) ? this.props.Login.masterData.bulkbarcodedatagen : [] || []}
                                                    selectAll={ this.props.Login.selectAll}
                                                    title={this.props.intl.formatMessage({ id: "IDS_SELECTTODELETE" })}
                                                    selectionChange={this.selectionChange}
                                                    headerSelectionChange={this.headerSelectionChange}
                                                    extractedColumnList={this.extractedColumnList}
                                                    selectedRecord={this.state.selectedRecord}
                                                    isInitialRender={this.props.Login.isInitialRender!==undefined && !this.props.Login.isInitialRender?this.props.Login.isInitialRender: true || true}
                                                    isInitialRenderSelected={this.state.selectedRecord["isInitialRender"]!==undefined ? this.state.selectedRecord["isInitialRender"]: true}
                                                
                                                />
                                                            </Col>
                                                        </Row>

                                                        
                                                    </Card.Body>
                                                </>
                                            </Card>
                                            }
                                        </ContentPanel>
                                    </SplitterPane>
                                </Splitter>
                                {/* </SplitterLayout> */}

                            </ListWrapper>
                        </Col>
                    </Row>
                    
                </ListWrapper>
                {this.state.export ?
                                                        <LocalizationProvider>
                                                            <ExcelExport
                                                                data={[]}
                                                                collapsible={true}
                                                                fileName={this.props.Login.masterData && this.props.Login.masterData.realProjectType.label + "_" + this.props.Login.masterData.realBarcodeConfig.label + "_" + new Date()}
                                                                ref={(exporter) => {
                                                                    this._excelExportHeader = exporter;
                                                                }}>
                                                                {this.props.Login.masterData.jsondataBarcodeFields && this.props.Login.masterData.jsondataBarcodeFields.map((item, index) =>
                                                                    item.sfieldname !== 'Barcode Id' && (
                                                                        <ExcelExportColumn
                                                                            field={item.sfieldname} title={(item.sfieldname)} width={200} />


                                                                    ))

                                                                }

                                                            </ExcelExport>
                                                        </LocalizationProvider > : ""}
                {this.props.Login.openModal &&
                    <SlideOutModal show={this.props.Login.openModal}
                        closeModal={this.closeModal}
                        operation={this.props.Login.operation}
                        inputParam={this.props.Login.inputParam}
                        screenName={this.props.Login.screenName}
                        onSaveClick={this.props.Login.loadPrinter ?this.onSavePrinterClick:this.onSaveClick}
                        esign={this.props.Login.loadEsign}
                        validateEsign={this.validateEsign}
                        masterStatus={this.props.Login.masterStatus}
                        updateStore={this.props.updateStore}
                        selectedRecord={ this.state.selectedRecord || {}}
                        mandatoryFields={this.props.Login.loadPrinter ?printMandatoryFields:this.props.Login.screenName === this.props.intl.formatMessage({ id: "IDS_IMPORT" }) && mandatoryFields}

                        addComponent={this.props.Login.loadEsign ?
                            <Esign operation={this.props.Login.operation}
                                formatMessage={this.props.intl.formatMessage}
                                onInputOnChange={this.onInputOnChange}
                                inputParam={this.props.Login.inputParam}
                                selectedRecord={this.state.selectedRecord || {}}
                            />
                            : this.props.Login.screenName === this.props.intl.formatMessage({ id: "IDS_IMPORT" }) ?

                                <ImportBulkBarcodeData
                                    loadImportFileData={this.props.Login.masterData.loadImportFileData}
                                    onDropFile={this.onDropFile}
                                    selectedRecord={this.state.selectedRecord || {}}
                                    deleteAttachment={this.deleteAttachment}
                                    onInputOnChange={this.onInputOnChange}

                                />
                                : this.props.Login.loadPrinter  ?
                                <AddPrinter
                                printer={this.props.Login.printer}
                                barcode={this.props.Login.barcode}
                                selectedPrinterData={this.state.selectedRecord||{}}
                                PrinterChange={this.PrinterChange}
                            />
                                : ""
                        }
                    />
                }
            </>
        );

    }

    ConfirmDelete = (deleteId) => {
        this.confirmMessage.confirm("deleteMessage", this.props.intl.formatMessage({ id: "IDS_DELETE" }), this.props.intl.formatMessage({ id: "IDS_DEFAULTCONFIRMMSG" }),
            this.props.intl.formatMessage({ id: "IDS_OK" }), this.props.intl.formatMessage({ id: "IDS_CANCEL" }),
            () => this.deleteRecord(deleteId));
    }
    ConfirmDeleteBarcodeRecord = (deleteId) => {
        this.confirmMessage.confirm("deleteMessage", this.props.intl.formatMessage({ id: "IDS_DELETE" }), this.props.intl.formatMessage({ id: "IDS_DEFAULTCONFIRMMSG" }),
            this.props.intl.formatMessage({ id: "IDS_OK" }), this.props.intl.formatMessage({ id: "IDS_CANCEL" }),
            () => this.deleteBarcodeRecord("delete", deleteId));
    }
    handlePageChange = e => {
        this.setState({
            skip: e.skip,
            take: e.take
        });
    };
    PrinterChange = (comboData, fieldName) => {
        const selectedRecord = this.state.selectedRecord || {};
        selectedRecord[fieldName] = comboData;
        this.setState({ selectedRecord });
    }

    onFilterSubmit = () => {
        if (this.props.Login.masterData.defaultProjectType && this.props.Login.masterData.defaultBarcodeConfig && this.props.Login.masterData.defaultBarcodeConfig.value) {
            this.searchRef.current.value = "";

            let inputData = [];

            let obj = convertDateValuetoString(this.props.Login.masterData.FromDate, this.props.Login.masterData.ToDate, this.props.Login.userInfo);
            let fromDate = obj.fromDate;
            let toDate = obj.toDate;
            inputData = {
                userinfo: this.props.Login.userInfo,
                nprojecttypecode: this.props.Login.masterData && this.props.Login.masterData.defaultProjectType && (this.props.Login.masterData.defaultProjectType.value || -1),
                nbulkbarcodeconfigcode: this.props.Login.masterData && this.props.Login.masterData.defaultBarcodeConfig && (this.props.Login.masterData.defaultBarcodeConfig.value || -1),
                fromDate: fromDate,
                toDate: toDate,
                isfilterSubmit: true

            }

            let masterData = {
                ...this.props.Login.masterData,
                realProjectType: this.props.Login.masterData && this.props.Login.masterData.defaultProjectType && this.props.Login.masterData.defaultProjectType,
                realBarcodeConfig: this.props.Login.masterData && this.props.Login.masterData.defaultBarcodeConfig && this.props.Login.masterData.defaultBarcodeConfig,



            }
            let inputParam = { masterData, inputData };
            this.props.getBulkBarcodeGeneration(inputParam);
        }
        else {
            toast.warn(
                this.props.intl.formatMessage({
                    id: "IDS_SELECTALLINFILTER",
                })
            );

        }
    }


    selectionChange = (event) => {
        let addedComponentList = this.props.Login.addedComponentList || [];
       // let selectedRecord={...this.state.selectedRecord,"isInitialRender":true}
        const addComponentDataList = this.props.Login.masterData.bulkbarcodedatagen.map(item => {
            if (item["Barcode Id"] === event.dataItem["Barcode Id"]) {
                item.selected = !event.dataItem.selected;
                if (item.selected) {
                    const newItem = JSON.parse(JSON.stringify(item));
                    addedComponentList.push(newItem);
                }
                else {
                    addedComponentList = addedComponentList.filter(item1 => item1["Barcode Id"] !== item["Barcode Id"])
                }

            }
            return item;
        });
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { isInitialRender: true,addComponentDataList,addedComponentList,selectAll: this.valiateCheckAll(addComponentDataList), 
                deleteSelectAll: this.valiateCheckAll(addedComponentList)
            }
        }
        this.props.updateStore(updateInfo);
        
        
      /*  this.setState({
                "selected":"selected",
            selectedRecord,
            addComponentDataList, addedComponentList,
            addSelectAll: this.valiateCheckAll(addComponentDataList),
            deleteSelectAll: this.valiateCheckAll(addedComponentList)
        });*/
    }

    valiateCheckAll(data) {
    let selectAll = true;
        if (data && data.length > 0) {

            data.forEach(dataItem => {
                if (dataItem.selected) {
                    if (dataItem.selected === false) {
                        selectAll = false;
                    }
                }
                else {
                    selectAll = false;
                }
            })
        }
        else {

            selectAll = false;
        }

        return selectAll;

    }
    headerSelectionChange = (event) => {
        const checked = event.syntheticEvent.target.checked;
        let addedComponentList = [];
     //   let selectedRecord={...this.state.selectedRecord,"isInitialRender":true}


        if (checked) {
            const data = event.target.props.data.map(item => {

                if (addedComponentList.findIndex(x => x["Barcode Id"] === item["Barcode Id"]) === -1) {

                    item.selected = checked;
                    const newItem = JSON.parse(JSON.stringify(item));

                    delete newItem['selected']

                    addedComponentList.push(newItem);

                    return item;
                } else {
                    let olditem = JSON.parse(JSON.stringify(addedComponentList[addedComponentList.findIndex(x => x["Barcode Id"] === item["Barcode Id"])]))
                    olditem.selected = checked;
                    let newItem = JSON.parse(JSON.stringify(olditem));
                    newItem.selected = false;

                    addedComponentList.push(newItem);
                    return olditem;
                }

            });
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: { isInitialRender:true,addComponentDataList: data,
                    addedComponentList,
                    selectAll: this.valiateCheckAll(addedComponentList),
                deleteSelectAll: this.valiateCheckAll(addedComponentList),
                selectAll: checked, deleteSelectAll: false
                 }
            }
            this.props.updateStore(updateInfo);




            
       /*     this.setState({
               // selectedRecord,
                addComponentDataList: data, addedComponentList,
                addSelectAll: this.valiateCheckAll(addedComponentList),
                deleteSelectAll: this.valiateCheckAll(addedComponentList),
                addSelectAll: checked, deleteSelectAll: false
            });*/
        }

        else {
            let addedComponentData = this.props.Login.addedComponentList || [];
            let deletedListdData = this.state.deletedList || [];

            const data =this.props.Login.addComponentDataList.map(item => {
                addedComponentData = addedComponentData.filter(item1 => item1.npreregno !== item.npreregno);
                deletedListdData = deletedListdData.filter(item1 => item1.npreregno !== item.npreregno);
                item.selected = checked;
                return item;
            });

            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: { isInitialRender:true,addComponentDataList: data,
                    addedComponentList,addedComponentData,deletedList:deletedListdData,
                deleteSelectAll: this.valiateCheckAll(addedComponentList),
                selectAll: checked, deleteSelectAll: false
                 }
            }
            this.props.updateStore(updateInfo);
         
         /*   this.setState({
                addComponentDataList: data, addedComponentList: addedComponentData, deletedList: deletedListdData,
                addSelectAll: this.valiateCheckAll(addedComponentList),
                deleteSelectAll: this.valiateCheckAll(addedComponentList),
                addSelectAll: checked, deleteSelectAll: false
            });*/
        }



    }
    onDropFile = (attachedFiles, fieldName, maxSize) => {
        let selectedRecord = this.state.selectedRecord || {};
        selectedRecord[fieldName] = onDropAttachFileList(selectedRecord[fieldName], attachedFiles, maxSize)
        this.setState({ selectedRecord, actionType: "new" });
    }

    expandChange = (event) => {
        const isExpanded =
            event.dataItem.expanded === undefined ?
                event.dataItem.aggregates : event.dataItem.expanded;
        event.dataItem.expanded = !isExpanded;
        this.setState({ ...this.props });
    }


    onComboChange = (comboData, fieldName) => {
        if (comboData != null) {
            const selectedRecord = this.state.selectedRecord || {};
            let inputData = [];
            if (fieldName == "nprojecttypecode") {
                inputData = {
                    userinfo: this.props.Login.userInfo,
                    nprojecttypecode: parseInt(comboData.value),
                    defaultProjectType: comboData
                }
                const masterData = { ...this.props.Login.masterData }
                const inputParam = { masterData, inputData, selectedRecord }
                this.props.getProjectBarcodceConfig(inputParam)
            }
            else if (fieldName === 'nbulkbarcodeconfigcode') {
                const masterData = { ...this.props.Login.masterData, defaultBarcodeConfig: comboData }
                const updateInfo = {
                    isInitialRender:false,
                    typeName: DEFAULT_RETURN,
                    data: { masterData }
                }
                this.props.updateStore(updateInfo);
            }
            else {
                selectedRecord[fieldName] = comboData;
                this.setState({ selectedRecord });

            }


        }
    }
    deleteAttachment = (event, file, fieldName) => {
        let selectedRecord = this.state.selectedRecord || {};
        selectedRecord[fieldName] = deleteAttachmentDropZone(selectedRecord[fieldName], file);

        this.setState({ selectedRecord, actionType: "delete" });
    };

    handleExportClick = () => {
        //ALPD-4737--Vignesh R(28-08-2024)
        if (this.props.Login.masterData.realProjectType && this.props.Login.masterData.realBarcodeConfig && this.props.Login.masterData.realBarcodeConfig.value) {
            this.setState({ export: true });

        }
        else {

            toast.warn(
                this.props.intl.formatMessage({
                    id: "IDS_SELECTALLINFILTER",
                })
            );
        }

    }
    handleImportClick = () => {
        if (this.props.Login.masterData.realProjectType && this.props.Login.masterData.realBarcodeConfig && this.props.Login.masterData.realBarcodeConfig.value) {

            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    //ALPD-4594,ALPD-4596--Vignesh R(31-07-2024)
                    selectedRecord:{...this.state.selectedRecord,"isInitialRender":false},
                    isInitialRender:false,
                    operation:"",
                    loadImportFileData: true,
                    openModal: true,
                    loadPrinter: false,
                    screenName: this.props.intl.formatMessage({ id: "IDS_IMPORT" }),
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            toast.warn(
                this.props.intl.formatMessage({
                    id: "IDS_SELECTALLINFILTER",
                })
            );

        }
    }

    componentDidUpdate(previousProps,previousState) {
        let { projectType, bulkbarcodeconfig, controlMap, userRoleControlRights, skip, take } = this.state;
        let bool = false;

        /*if(this.props.Login.addedComponentList!==previousProps.Login.addedComponentList){
            addedComponentList=this.props.Login.addedComponentList;
            bool = true;
        }*/
        if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord) {
            this.setState({ selectedRecord: this.props.Login.selectedRecord });
        }
        if (this.state.export) {
            this._excelExportHeader.save()
            this.setState({ export: false })
        }
        if (this.props.Login.masterData.projectType !== previousProps.Login.masterData.projectType) {
            const projectTypeMap = constructOptionList(this.props.Login.masterData.projectType || [], "nprojecttypecode",
                "sprojecttypename", undefined, undefined, undefined);
            projectType = projectTypeMap.get("OptionList");
            bool = true;

        }

        if (this.props.Login.masterData.selectedProjectType !== previousProps.Login.masterData.selectedProjectType) {
            const projectTypeMap = constructOptionList(this.props.Login.masterData.projectType || [], "nprojecttypecode",
                "sprojecttypename", undefined, undefined, undefined);
            projectType = projectTypeMap.get("OptionList");
            bool = true;

        }
        if (this.props.Login.masterData.bulkBarcodeConfig !== previousProps.Login.masterData.bulkBarcodeConfig) {
            const bulkbarcodeconfigMap = constructOptionList(this.props.Login.masterData.bulkBarcodeConfig || [], "nbulkbarcodeconfigcode",
                "sconfigname", undefined, undefined, undefined);
            bulkbarcodeconfig = bulkbarcodeconfigMap.get("OptionList");
            bool = true;

        }
        if (
            this.props.Login.userInfo.nformcode !== previousProps.Login.userInfo.nformcode) {
            userRoleControlRights = [];
            if (this.props.Login.userRoleControlRights) {
                this.props.Login.userRoleControlRights[
                    this.props.Login.userInfo.nformcode
                ] &&
                    Object.values(
                        this.props.Login.userRoleControlRights[
                        this.props.Login.userInfo.nformcode
                        ]
                    ).map((item) => userRoleControlRights.push(item.ncontrolcode));
            }
            controlMap = getControlMap(
                this.props.Login.userRoleControlRights,
                this.props.Login.userInfo.nformcode
            );
            bool = true;
        }



        if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord) {
            this.setState({ selectedRecord: this.props.Login.selectedRecord });
        }
         if (this.props.Login.selectedPrinterData !== previousProps.Login.selectedPrinterData) {
            this.setState({ selectedRecord:{ ...this.props.Login.selectedPrinterData,...this.state.selectedRecord }});
        }

        if (bool) {
            this.setState({
                projectType, bulkbarcodeconfig, controlMap, userRoleControlRights, skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[3]) : 5
            });
        }
    }
    childDataChange = (selectedRecord) => {
        this.setState({
            selectedRecord: {
                ...selectedRecord, isInitialRender: false
            },
           
        });
    }
    onInputOnChange = (event) => {
        const selectedRecord = this.state.selectedRecord || {};
       
        selectedRecord[event.target.name] = event.target.value;
        this.childDataChange(selectedRecord);
        //this.setState({ selectedRecord });
            
        
        //this.setState({ selectedRecord });
    }

    deleteRecord = (operation, ncontrolcode) => {
        if (this.props.Login.masterData && this.props.Login.masterData.selectedBulkBarcodeGeneration !== null) {
            let obj = convertDateValuetoString(this.props.Login.masterData.FromDate, this.props.Login.masterData.ToDate, this.props.Login.userInfo);
            let fromDate = obj.fromDate;
            let toDate = obj.toDate;

            const postParam = {
                inputListName: "BarcodeGeneration", selectedObject: "selectedBulkBarcodeGeneration",
                primaryKeyField: "nbulkbarcodegenerationcode",
                primaryKeyValue: this.props.Login.masterData.selectedBulkBarcodeGeneration.nbulkbarcodegenerationcode,
                fetchUrl: "bulkbarcodegeneration/getBulkBarcodeGeneration",
                fecthInputObject: {
                    userinfo: this.props.Login.userInfo
                },
            }

            const inputParam = {
                classUrl: this.props.Login.inputParam.classUrl,
                methodUrl: "BulkBarcodeGeneration",
                displayName: this.props.Login.inputParam.displayName,
                inputData: {
                    "isDelete":true,
                    "userinfo": this.props.Login.userInfo,
                    "operation": "delete",
                    "fromDate": fromDate,
                    "toDate": toDate,
                    "nprojecttypecode": this.props.Login.masterData.realProjectType.value || -1,
                    "nbulkbarcodegenerationcode": this.props.Login.masterData && this.props.Login.masterData.selectedBulkBarcodeGeneration && this.props.Login.masterData.selectedBulkBarcodeGeneration.nbulkbarcodegenerationcode || -1

                },
                postParam,
                operation: "delete",
                dataState: this.state.dataState
            }

            if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, ncontrolcode)) {
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        loadEsign: true, screenData: { inputParam, masterData: this.props.Login.masterData },
                        openModal: true, screenName: this.props.intl.formatMessage({ id: this.props.Login.inputParam.displayName }),
                        operation: "delete"
                    }
                }
                this.props.updateStore(updateInfo);
            }
            else {
                this.props.deleteBulkBarcodeGeneration(inputParam, this.props.Login.masterData);
            }
        }
        else {

            toast.warn(
                this.props.intl.formatMessage({
                    id: "IDS_NORECORDSAVAILABLE",
                })
            );
        }
    }
    deleteBarcodeRecord = ( ncontrolcode) => {
        if (this.props.Login.masterData && this.props.Login.masterData.selectedBulkBarcodeGeneration !== null) {
            if (this.props.Login.masterData && this.props.Login.masterData.bulkbarcodedatagen && this.props.Login.masterData.bulkbarcodedatagen.length > 0) {
                if(this.props.Login.addedComponentList && this.props.Login.addedComponentList.length>0){
          
            let obj = convertDateValuetoString(this.props.Login.masterData.FromDate, this.props.Login.masterData.ToDate, this.props.Login.userInfo);
            let fromDate = obj.fromDate;
            let toDate = obj.toDate;
            
            let updateBarcodeData = this.props.Login.masterData.bulkbarcodedatagen.filter(item => {
                return !this.props.Login.addedComponentList.some(item1 => item1['Barcode Id'] === item['Barcode Id']);
            });
            
            
            
            const postParam = {
                inputListName: "BarcodeGeneration", selectedObject: "selectedBulkBarcodeGeneration",
                primaryKeyField: "nbulkbarcodegenerationcode",
                primaryKeyValue: this.props.Login.masterData.selectedBulkBarcodeGeneration.nbulkbarcodegenerationcode,
                fetchUrl: "bulkbarcodegeneration/getBulkBarcodeGeneration",
                fecthInputObject: {
                    userinfo: this.props.Login.userInfo
                },
            }

            const inputParam = {
                classUrl: this.props.Login.inputParam.classUrl,
                addedComponentList:[],
                selectAll:false,
                methodUrl: "BarcodeData",
                displayName: this.props.Login.inputParam.displayName,
                inputData: {

                    "userinfo": this.props.Login.userInfo,
                    "operation": "delete",
                    "fromDate": fromDate,
                    "toDate": toDate,
                    "nbulkbarcodeconfigcode": this.props.Login.masterData && this.props.Login.masterData.realBarcodeConfig && this.props.Login.masterData.realBarcodeConfig.value || -1,
                    "nprojecttypecode": this.props.Login.masterData.realProjectType.value || -1,
                    "nbulkbarcodegenerationcode": this.props.Login.masterData && this.props.Login.masterData.selectedBulkBarcodeGeneration && this.props.Login.masterData.selectedBulkBarcodeGeneration.nbulkbarcodegenerationcode || -1,
                    "updateBarcodeData" :Lims_JSON_stringify(JSON.stringify(updateBarcodeData))

                },
                postParam,
                operation: "delete",
                dataState: this.state.dataState
            }

            if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, ncontrolcode)) {
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        loadEsign: true, screenData: { inputParam, masterData: this.props.Login.masterData },
                        openModal: true, screenName: this.props.intl.formatMessage({ id: this.props.Login.inputParam.displayName }),
                        operation: "delete"
                    }
                }
                this.props.updateStore(updateInfo);
            }
            else {
                this.props.deleteBarcodeData(inputParam, this.props.Login.masterData);
            }
        }else{
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTANYONERECORD" }));
        }
         }else{
            toast.warn(this.props.intl.formatMessage({ id: "IDS_NORECORDSAVAILABLE" }));
         }
        }
        else {

            toast.warn(
                this.props.intl.formatMessage({
                    id: "IDS_NORECORDSAVAILABLE",
                })
            );
        }
    }

    reloadData = () => {
        this.searchRef.current.value = "";
        if (this.props.Login.masterData.realProjectType && this.props.Login.masterData.realBarcodeConfig && this.props.Login.masterData.realBarcodeConfig.value) {
            let inputData = [];
            let obj = convertDateValuetoString(this.props.Login.masterData.FromDate, this.props.Login.masterData.ToDate, this.props.Login.userInfo);
            let fromDate = obj.fromDate;
            let toDate = obj.toDate;
            inputData = {
                userinfo: this.props.Login.userInfo,
                //ALPD-4599--Vignesh R(31-07-2024)
                nprojecttypecode: this.props.Login.masterData && this.props.Login.masterData.realProjectType && this.props.Login.masterData.realProjectType.value || -1,
                nbulkbarcodeconfigcode: this.props.Login.masterData && this.props.Login.masterData.realBarcodeConfig && this.props.Login.masterData.realBarcodeConfig.value || -1,
                fromDate: fromDate,
                toDate: toDate,
            }
            const inputParam = {
                inputData: inputData,
                masterData: this.props.Login.masterData

            };

            this.props.getBulkBarcodeGeneration(inputParam);
        } else {
            toast.warn(
                this.props.intl.formatMessage({
                    id: "IDS_SELECTALLINFILTER",
                })
            );

        }
    }
    ConfirmDelete = (deleteId) => {
        this.confirmMessage.confirm("deleteMessage", this.props.intl.formatMessage({ id: "IDS_DELETE" }), this.props.intl.formatMessage({ id: "IDS_DEFAULTCONFIRMMSG" }),
            this.props.intl.formatMessage({ id: "IDS_OK" }), this.props.intl.formatMessage({ id: "IDS_CANCEL" }),
            () => this.deleteRecord("delete", deleteId));
    }

    onSaveClick = (saveType, formRef) => {

       
        this.searchRef.current.value = "";
   

        let selectedRecord = this.state.selectedRecord || {}
        const acceptedFiles = this.state.selectedRecord.sfilename;
        let importBulkBarcodeGen = [];
        const formData = new FormData();
        let obj = convertDateValuetoString(this.props.Login.masterData.FromDate, this.props.Login.masterData.ToDate, this.props.Login.userInfo);
        let fromDate = obj.fromDate;
        let toDate = obj.toDate;
        if (acceptedFiles && acceptedFiles.length === 1) {

            if (acceptedFiles && Array.isArray(acceptedFiles) && acceptedFiles.length > 0) {
                acceptedFiles.forEach((file, index) => {
                    const tempData = {};
                    const splittedFileName = file.name.split('.');
                    const fileExtension = file.name.split('.')[splittedFileName.length - 1];
                    const ssystemfilename = selectedRecord.ssystemfilename ? selectedRecord.ssystemfilename.split('.') : "";
                    const filesystemfileext = selectedRecord.ssystemfilename ? file.name.split('.')[ssystemfilename.length - 1] : "";
                    const uniquefilename = 1 === attachmentType.FTP ?
                        ssystemfilename !== "" ? ssystemfilename[0] + '.' + filesystemfileext : create_UUID() + '.' + fileExtension : "";
                    tempData["sfilename"] = this.state.selectedRecord['simportfilename'] ? this.state.selectedRecord['simportfilename'] : "";
                    // tempData["sfilename"] = Lims_JSON_stringify(file.name, false);
                    tempData["sdescription"] = Lims_JSON_stringify(replaceBackSlash(selectedRecord.sdescription ? selectedRecord.sdescription.trim() : ""), false);
                    //  tempData["nlinkcode"] = transactionStatus.NA;
                    tempData["ssystemfilename"] = uniquefilename;
                    tempData['nprojecttypecode'] = this.props.Login.masterData.realProjectType && this.props.Login.masterData.realProjectType.value || -1
                    tempData['nbulkbarcodeconfigcode'] = this.props.Login.masterData.realBarcodeConfig && this.props.Login.masterData.realBarcodeConfig.value || -1
                    tempData['barcodefields'] =

                        formData.append("uploadedFile" + index, file);
                    formData.append("uniquefilename" + index, uniquefilename);
                    importBulkBarcodeGen.push(tempData);
                });
                formData.append("filecount", acceptedFiles.length);
                formData.append("importBulkBarcodeGen", JSON.stringify(importBulkBarcodeGen));
                formData.append("fromDate", fromDate);
                formData.append("toDate", toDate);
                formData.append("ImportFile", selectedRecord['sfilename'][0])

                const bulkbarcodeFields = this.props.Login.masterData
                    && this.props.Login.masterData.jsondataBarcodeFields
                        .filter(item => item.sfieldname !== 'Barcode Id')
                        .map(item => item.sfieldname)
                        .join(",");

                formData.append("bulkbarcodeFields", bulkbarcodeFields)
            }

            const inputParam = {
                inputData: {
                    "userinfo": {
                        ...this.props.Login.userInfo,
                        sformname: Lims_JSON_stringify(this.props.Login.userInfo.sformname),
                        smodulename: Lims_JSON_stringify(this.props.Login.userInfo.smodulename),
                        //ALPD-1826(while saving the file and link,audit trail is not captured the respective language)
                        slanguagename: Lims_JSON_stringify(this.props.Login.userInfo.slanguagename)
                    }
                },
                formData: formData,
                masterData: this.props.Login.masterData && this.props.Login.masterData,
                selectedRecord: this.state.selectedRecord || {},
                operation: "import",
                classUrl: "bulkbarcodegeneration",
                saveType, formRef, methodUrl: "BulkBarcodeGeneration",
            }
            if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolCode)) {
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        loadEsign: true, screenData: { inputParam, masterData: this.props.Login.masterData },
                        openModal: true, screenName: this.props.intl.formatMessage({ id: "IDS_CLIENT" }),
                        //this.props.intl.formatMessage({ id: this.props.Login.inputParam.displayName }),
                        operation: this.props.Login.operation
                    }
                }
                this.props.updateStore(updateInfo);
            }
            else {
                this.props.importBulkBarcodeGeneration(inputParam, this.props.Login.masterData, "openModal");
            }

        } else {

            toast.warn(this.props.intl.formatMessage({ id: "IDS_PLEASESELECTTHEFILE" }))
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

   
    onSavePrinterClick = () => {
        let insertlist = [];
        const inputParam = {
            classUrl: 'bulkbarcodegeneration',
            methodUrl: 'Barcode',
            displayName: this.props.Login.inputParam.displayName,
            inputData: {
                selectAll:false,
                sprintername: this.state.selectedRecord.sprintername ? this.state.selectedRecord.sprintername.value : '',
                sbarcodename: this.state.selectedRecord.sbarcodename ? this.state.selectedRecord.sbarcodename.value : '',
                insertlist,
                BarcodeID: this.props.Login.addedComponentList ? this.props.Login.addedComponentList.map(x =>"'"+x['Barcode Id']+"'").join(",") : " ",
                //selectDetailsList:this.state.addedComponentList,
                
                userinfo: this.props.Login.userInfo,
                ncontrolcode: this.props.Login.ncontrolcode,
                nbulkbarcodegenerationcode: this.props.Login.masterData && this.props.Login.masterData.selectedBulkBarcodeGeneration && this.props.Login.masterData.selectedBulkBarcodeGeneration.nbulkbarcodegenerationcode
            },
            operation: 'print',
            action: 'printer'
        }

        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolcode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData: {...this.props.Login.masterData,searchedData:undefined} },
                    openModal: true, screenName: this.props.intl.formatMessage({ id: this.props.Login.inputParam.displayName }),
                    operation: 'printer'
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.crudMaster(inputParam, {...this.props.Login.masterData,searchedData:undefined}, "openModal");
        }
    }

}

export default connect(mapStateToProps, {
    callService, crudMaster, updateStore, validateEsignCredential,
    getBulkBarcodeGenData, getBulkBarcodeGeneration,getBarcodeAndPrinterService,
    filterTransactionList, getProjectBarcodceConfig, importBulkBarcodeGeneration, getTabBulkBarcodeGeneration,deleteBarcodeData,deleteBulkBarcodeGeneration
})(injectIntl(BulkBarcodeGeneration));