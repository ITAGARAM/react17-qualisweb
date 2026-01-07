import {
    faCheck,faCloudDownloadAlt,faCopy,faEye,faFileCsv,faFileExcel,faFileImport,faFilePdf,faLanguage,faPencilAlt,faPlus,    
    faSync,faThumbsUp,faTrashAlt} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ExcelExport, ExcelExportColumn } from '@progress/kendo-react-excel-export';
import { Grid, GridColumn, GridColumnMenuFilter, GridNoRecords, GridToolbar } from '@progress/kendo-react-grid';
import { GridPDFExport } from '@progress/kendo-react-pdf';
import React from 'react';
import { Button, Card, Col, FormGroup, FormLabel, Image, Nav, Row } from 'react-bootstrap';
import { FormattedMessage, injectIntl } from 'react-intl';
import { AtTableWrap, FontIconWrap, FormControlStatic } from '../data-grid/data-grid.styles';
import ColumnMenu from './ColumnMenu';
import SimpleGrid from './SimpleGrid';
// import { Tooltip } from '@progress/kendo-react-tooltip';
import { process } from '@progress/kendo-data-query';
import { LocalizationProvider } from '@progress/kendo-react-intl';
import parse from 'html-react-parser';
import { CSVLink } from "react-csv";
import { connect } from 'react-redux';
import { toast } from 'react-toastify';

//component commented by L.Subashini 13/12/2025 while upgrading to React 17
//import ReactTooltip from 'react-tooltip';

//component used by L.Subashini 13/12/2025 while upgrading to React 17
//Commenting unused import
//import { Tooltip } from 'react-tooltip';

import reject from '../../assets/image/reject.svg';
import { ttfFont } from '../../assets/styles/ttfFont';
import ConfirmMessage from '../../components/confirm-alert/confirm-message.component';
import { getActionIcon } from '../HoverIcons';
import CustomSwitch from '../custom-switch/custom-switch.component'; // import '../../assets/styles/unicode-font.css';
import FormCheckbox from '../form-checkbox/form-checkbox.component';
import { dynamicFileDownload } from '../../actions/ServiceAction';
import { rearrangeDateFormatDateOnly } from "../../components/CommonScript";
import { ReactComponent as MailResend } from '../../assets/image/Mail Resend.svg';
import { ReactComponent as SyncIcon } from '../../assets/image/sync.svg';
import { ReactComponent as RefreshIcon } from '../../assets/image/refresh.svg';
import BarcodeButton from '../../pages/BarcodeTemplate/BarcodeButton';
import { transactionStatus } from '../Enumeration';
import { ReactComponent as Generate } from '../../assets/image/generate-certificate.svg'
import ExportButton from '../../pages/export&import/ExportButton';
import { faPaperPlane } from '@fortawesome/free-regular-svg-icons';
import { faHandHoldingWater, faInbox } from '@fortawesome/free-solid-svg-icons';
//INVOICE MODULE - 20-SEP-2025
import merge from '../../assets/image/merge.svg';
import exporticon from '../../assets/image/exporticon.svg';
import './exportimport.css';
import { ReactComponent as Report } from '../../assets/image/Report.svg';

class DataGrid extends React.Component {

    _pdfExport;
    _excelExport;
    constructor(props) {
        super(props);
        this.confirmMessage = new ConfirmMessage();

    }


    detailBand = (props) => {
        //console.log("detail:", props);
        return (
            <Row bsPrefix="margin_class">
                <Col md={12}>
                    {this.props.hasDynamicColSize ?
                        <div>
                            {this.props.detailedFieldList.length > 0 &&
                                <div>
                                    <Card>
                                        <Card.Header><FormattedMessage id="IDS_MOREINFO" message="More Info" /></Card.Header>
                                        <Card.Body className="form-static-wrap">
                                            <Row style={{ marginLeft: -18 }}>
                                                {this.props.detailedFieldList.map((item) => {
                                                    return (

                                                        <Col md={item.columnSize}>
                                                            <FormGroup>
                                                                <FormLabel><FormattedMessage id={item.idsName} message={item.idsName} /></FormLabel>
                                                                <FormControlStatic>
                                                                    {
                                                                        props.dataItem[item.dataField] === undefined ||
                                                                            props.dataItem[item.dataField] === null ||
                                                                            props.dataItem[item.dataField].length === 0 ? '-' :
                                                                            item.isIdsField ? <FormattedMessage id={props.dataItem[item.dataField]} message={props.dataItem[item.dataField]} /> :
                                                                                item.isHTML ? parse(props.dataItem[item.dataField]) : props.dataItem[item.dataField]}
                                                                    {item.dataType && item.dataType[0] === 'files' ?
                                                                        <FontIconWrap icon={faCloudDownloadAlt} className="ml-2 className action-icons-wrap" size="lg"
                                                                            data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_DOWNLOAD" })}
                                                                            data-place="left"
                                                                            onClick={() => this.props.dynamicFileDownload({ ...props.dataItem, ...this.props.inputParam, ...item, userInfo: this.props.Login.userInfo, ...this.props.viewFileURL })}>
                                                                            <FontAwesomeIcon icon={faCloudDownloadAlt} />
                                                                        </FontIconWrap> : ""
                                                                    }
                                                                </FormControlStatic>
                                                            </FormGroup>
                                                        </Col>
                                                    )
                                                })}
                                            </Row>
                                        </Card.Body>
                                    </Card>
                                </div>
                            }
                        </div>

                        : this.props.hasChild ?
                            <SimpleGrid childList={this.props.childList.get(parseInt(props.dataItem[this.props.childMappingField])) || []}
                                extractedColumnList={this.props.childColumnList} />
                            :
                            <div>

                                {this.props.detailedFieldList.length > 0 &&
                                    <div>
                                        <row>
                                            <Card>
                                                <Card.Header><FormattedMessage id="IDS_MOREINFO" message="More Info" /></Card.Header>
                                                <Card.Body className="form-static-wrap">
                                                    {
                                                        this.props.detailedFieldList.map((item) => {
                                                            return (

                                                                <Col md={6}>
                                                                    <FormGroup>
                                                                        <FormLabel><FormattedMessage id={item.idsName} message={item.idsName} /></FormLabel>
                                                                        <FormControlStatic>
                                                                            {props.dataItem[item.dataField] === undefined || props.dataItem[item.dataField] === null || props.dataItem[item.dataField].length === 0 ? '-' :
                                                                                item.isIdsField ? <FormattedMessage id={props.dataItem[item.dataField]} message={props.dataItem[item.dataField]} /> : item.isHTML ? parse(props.dataItem[item.dataField]) : props.dataItem[item.dataField]}

                                                                            {item.dataType && item.dataType[0] === 'files' ?
                                                                                <FontIconWrap icon={faCloudDownloadAlt} className="ml-2 className action-icons-wrap" size="lg"
                                                                                    data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_DOWNLOAD" })}
                                                                                    data-place="left"
                                                                                    onClick={() => this.props.dynamicFileDownload({ ...props.dataItem, ...this.props.inputParam, ...item, userInfo: this.props.Login.userInfo, ...this.props.viewFileURL })}>
                                                                                    <FontAwesomeIcon icon={faCloudDownloadAlt} />
                                                                                </FontIconWrap> : ""
                                                                            }
                                                                        </FormControlStatic>
                                                                    </FormGroup>

                                                                </Col>
                                                            )
                                                        })}

                                                </Card.Body>
                                            </Card>
                                        </row>
                                    </div>
                                }

                            </div>}
                </Col> </Row>
        )
    }

    //L.Subashini - 02/Jan/2026 - Kendo grid old version method commented by L.Subashini while React Upgrade 17
    // expandChange = (event) => {
    //     const isExpanded =
    //         event.dataItem.expanded === undefined ?
    //             event.dataItem.aggregates : event.dataItem.expanded;

    //     if (this.props.hasChild && event.value === true) {
    //         event.dataItem.expanded = !isExpanded;
    //         this.props.handleExpandChange(event, event.dataItem,this.props.dataState)
    //     }
    //     else {
    //         event.dataItem.expanded = !isExpanded;
    //         this.setState({ isExpanded });
    //     }
    // }

    //Added by L.Subashini - 02/Jan/2026 - React Upgrade to 17
    expandChange = (event) => {
            //to set and unset expanded attribute in the entire grid dataset
            const updatedData = this.props.dataResult.data.map(item =>
                                item === event.dataItem
                                ? { ...item, expanded: !item.expanded }
                                : item  
                            );

            // Update parent with new dataResult object
            this.props.handleExpandChange({ ...this.props.dataResult, data: updatedData }, 
                                        { ...event.dataItem, expanded: !event.dataItem.expanded},//to set and unset expanded attribute in the selected grid item
                                            this.props.dataState
                                        );
    };

    exportExcel = () => {
        if (this.props.dataResult.data.length > 0) {
            this._excelExport.save();
        }
        else
            toast.info(this.props.intl.formatMessage({ id: "IDS_NODATATOEXPORT" }));
    }

    exportExcelHeader = () => {
        //  if (this.props.dataResult.data.length > 0) {
        this._excelExportHeader.save();
        // }
        // else
        //     toast.info(this.props.intl.formatMessage({ id: "IDS_NODATATOEXPORT" }));
    }

    exportPDF = () => {
        if (this.props.dataResult.data.length > 0) {
            if (document.body.classList.contains("dark")) {
                document.body.classList.remove('dark');
                document.body.classList.add('temp-dark');
            }
            this._pdfExport.save();
            if (document.body.classList.contains("temp-dark")) {
                document.body.classList.add('dark');
                document.body.classList.remove('temp-dark');
            }
        }
        else
            toast.info(this.props.intl.formatMessage({ id: "IDS_NODATATOEXPORT" }));
    }

    columnProps(field) {
        if (!this.props.hideColumnFilter) {

            const returntype = {
                field: field,
                columnMenu: ColumnMenu,
                headerClassName: this.isColumnActive(field, this.props.dataState) ? 'active' : ''
            }
            return returntype;
        }
    }

    isColumnActive(field, dataState) {
        return GridColumnMenuFilter.active(field, dataState.filter)
    }

    handleClickDelete = (deleteParam, row) => {
        //this.props.deleteRecord(deleteParam);

        this.confirmMessage.confirm("deleteMessage", this.props.intl.formatMessage({ id: "IDS_DELETE" }), this.props.intl.formatMessage({ id: "IDS_DEFAULTCONFIRMMSG" }),
            this.props.intl.formatMessage({ id: "IDS_OK" }), this.props.intl.formatMessage({ id: "IDS_CANCEL" }),
            () => this.props.deleteRecord(deleteParam, row));
    }

    render() {

        //console.log("datagrid:", this.props);
        //  loadMessages(messages[this.props.Login.userInfo.slanguagetypecode], "lang");
        const methodUrl = this.props.methodUrl ? this.props.methodUrl : (this.props.inputParam && this.props.inputParam.methodUrl);

        const addId = this.props.controlMap && this.props.controlMap.has("Add".concat(methodUrl))
            && this.props.controlMap.get("Add".concat(methodUrl)).ncontrolcode;

        {/* Ate234 janakumar -> BGSI-7 Screen Name -> Project And Site Hierarchy Mapping -> View tree was site hierarchy screen deisgn  */ }
        const treeViewkey = `TreeView${methodUrl}`;
        const treeViewId = this.props.controlMap?.has(treeViewkey)
            ? this.props.controlMap.get(treeViewkey).ncontrolcode:undefined;

        const editId = this.props.controlMap && this.props.controlMap.has("Edit".concat(methodUrl))
            && this.props.controlMap.get("Edit".concat(methodUrl)).ncontrolcode;

        {/* added by sujatha ate_274 9/10/2025 for WQMIS Sync Icon */}
        const MasterSync = this.props.controlMap && this.props.controlMap.has("MasterSync".concat(methodUrl))
            && this.props.controlMap.get("MasterSync".concat(methodUrl)).ncontrolcode;

        // const barcodeId = this.props.controlMap && this.props.controlMap.has("Barcode".concat(methodUrl))
        //     && this.props.controlMap.get("Barcode".concat(methodUrl)).ncontrolcode;

        const syncId = this.props.controlMap && this.props.controlMap.has("ManualSync".concat(methodUrl))
            && this.props.controlMap.get("ManualSync".concat(methodUrl)).ncontrolcode;

        // {/* janakumar  Added the download button for sample receving */}
        const SampleReceivingReportId = this.props.controlMap && this.props.controlMap.has("SampleReceivingReport")
            && this.props.controlMap.get("SampleReceivingReport").ncontrolcode;


        {/* Add by Neeraj kumar for Language screen -RMTP-101*/ }
        const languagesId = this.props.controlMap && this.props.controlMap.has("Update".concat(methodUrl))
            && this.props.controlMap.get("Update".concat(methodUrl)).ncontrolcode;

		//SARAVANAN-BGSI-MIGRATION-17-OCT-2025
        //  const viewId = this.props.controlMap && this.props.controlMap.has("View".concat(methodUrl))
        //     && this.props.controlMap.get("View".concat(methodUrl)).ncontrolcode;
            

        const deleteId = this.props.controlMap && this.props.controlMap.has("Delete".concat(methodUrl))
            && this.props.controlMap.get("Delete".concat(methodUrl)).ncontrolcode;

        // const defaultId = this.props.controlMap && this.props.controlMap.has("Default".concat(methodUrl))
        //     && this.props.controlMap.get("Default".concat(methodUrl)).ncontrolcode;

        const approveId = this.props.controlMap && this.props.controlMap.has("Approve".concat(methodUrl))
            && this.props.controlMap.get("Approve".concat(methodUrl)).ncontrolcode;

        const copyId = this.props.controlMap && this.props.inputParam && this.props.controlMap.has("Copy".concat(methodUrl))
            && this.props.controlMap.get("Copy".concat(methodUrl)).ncontrolcode;

        const completeId = this.props.controlMap && this.props.controlMap.has("Complete".concat(methodUrl))
            && this.props.controlMap.get("Complete".concat(methodUrl)).ncontrolcode;

        const switchId = this.props.controlMap && this.props.switchParam && this.props.controlMap.has(this.props.switchParam.operation.concat(methodUrl))
            && this.props.controlMap.get(this.props.switchParam.operation.concat(methodUrl)).ncontrolcode;

        const cancelId = this.props.controlMap && this.props.controlMap.has("Cancel".concat(methodUrl))
            && this.props.controlMap.get("Cancel".concat(methodUrl)).ncontrolcode;
         //Invoice ExportImport
         const exportId = this.props.controlMap && this.props.controlMap.has("Export".concat(methodUrl))
         && this.props.controlMap.get("Export".concat(methodUrl)).ncontrolcode;

         const importId = this.props.controlMap && this.props.controlMap.has("Import".concat(methodUrl))
         && this.props.controlMap.get("Import".concat(methodUrl)).ncontrolcode;
 
         const mergeId = this.props.controlMap && this.props.controlMap.has("Merge".concat(methodUrl))
         && this.props.controlMap.get("Merge".concat(methodUrl)).ncontrolcode;
        // const receiveGoodsId = this.props.controlMap.has("Receive".concat(methodUrl))
        //     && this.props.controlMap.get("Receive".concat(methodUrl)).ncontrolcode;
        const downloadId = this.props.controlMap && this.props.controlMap.has("Download".concat(methodUrl))
            && this.props.controlMap.get("Download".concat(methodUrl)).ncontrolcode;

        const resentId = this.props.controlMap && this.props.controlMap.has("Resent")
            && this.props.controlMap.get("Resent").ncontrolcode;

        const SendToSubContractorId = this.props.controlMap && this.props.controlMap.has("SendToSubContractor")
            && this.props.controlMap.get("SendToSubContractor").ncontrolcode;

        const ReceivedBySTTId = this.props.controlMap && this.props.controlMap.has("ReceivedBySTT")
            && this.props.controlMap.get("ReceivedBySTT").ncontrolcode;

        const ResultReceivedId = this.props.controlMap && this.props.controlMap.has("ResultReceived")
            && this.props.controlMap.get("ResultReceived").ncontrolcode;

        {/* added by sujatha ate_274 15/10/2025 for Report Icon WQMIS Integration */}
        const wqmisTransactionReportId = this.props.controlMap && this.props.controlMap.has("Report".concat(methodUrl))
            && this.props.controlMap.get("Report".concat(methodUrl)).ncontrolcode;

        const selectedId = this.props.selectedId;
        // const confirmMessage = new ConfirmMessage();
        //console.log("props:",this.props);
        const pageSizes = this.props.pageSizes ? this.props.pageSizes : this.props.Login.settings && this.props.Login.settings[15].split(",").map(setting => parseInt(setting))
        return (
            <>
                {/* <ReactTooltip place="bottom" id="tooltip-grid-wrap" globalEventOff='click' /> */}
                <AtTableWrap className="at-list-table" actionColWidth={this.props.actionColWidth ? this.props.actionColWidth : "150px"} >
                    {/* <Tooltip openDelay={100} position="bottom" tooltipClassName="ad-tooltip" anchorElement="element" parentTitle={true}> */}
                    <LocalizationProvider language={this.props.Login.userInfo.slanguagetypecode}>
                        {this.props.iscsv ?
                            <>
                                {
                                    <>
                                        <div className="d-flex justify-content-end">
                                            <CSVLink data={this.props.ELNTest ? this.props.ELNTest : this.props.data} filename={this.props.selectedfilename + ".csv"}
                                                headers={this.props.batchCSViewList}
                                            >{this.props.ELNTest ? this.props.intl.formatMessage({ id: "IDS_EXPORTTOELN" }) : this.props.intl.formatMessage({ id: "IDS_EXPORTCSV" })}</CSVLink>
                                        </div>

                                    </>
                                }
                                <style>{ttfFont}</style>

                            </> : ""}
                        <ExcelExport
                            data={process(this.props.data || [], { sort: this.props.dataState.sort, filter: this.props.dataState.filter, group: this.props.dataState.group }).data}
                            filterable={true}
                            // fileName={this.props.inputParam && this.props.intl.formatMessage({ id: this.props.inputParam.displayName })}
                            group={this.props.dataState.group}
                            ref={(exporter) => {
                                // console.log(exporter);
                                this._excelExport = exporter;
                            }}>
                            <Grid
                                className={((this.props.dataResult && this.props.dataResult.length > 0) || (this.props.extractedColumnList && this.props.extractedColumnList.length > 0)) ? "active-paging" : "no-paging"}
                                style={{ height: this.props.gridHeight, width: this.props.gridWidth }}
                                sortable
                                resizable
                                reorderable={false}
                                scrollable={this.props.scrollable}
                                pageable={this.props.pageable && this.props.data && this.props.data.length > 0 ? { buttonCount: 5, pageSizes: pageSizes, previousNext: false } : false}
                                // pageable={this.props.pageable ? { buttonCount: 5, pageSizes: pageSizes, previousNext: false } : ""}
                                groupable={this.props.groupfooter ?
                                    {
                                        enabled: false,
                                        footer: "visible",
                                    } :
                                    this.props.groupable ? true : false}
                                detail={this.props.hideDetailBand ? false : this.detailBand}
                                expandField={(this.props.detailedFieldList && this.props.detailedFieldList.length > 0 || this.props.childColumnList && this.props.childColumnList.length > 0) && this.props.expandField ? this.props.expandField : false}
                                               
                                onExpandChange={this.expandChange}
                                data={this.props.dataResult}
                                total={this.props.total}
                                {...this.props.dataState}
                                selectedField="selected"
                                onRowClick={this.props.handleRowClick}
                                onDataStateChange={this.props.dataStateChange}>
                                <GridNoRecords>
                                    {this.props.intl.formatMessage({ id: "IDS_NORECORDSAVAILABLE" })}
                                </GridNoRecords>
                                {this.props.isToolBarRequired ?
                                    <GridToolbar>
                                        {this.props.isAddRequired === false ? <></> :
                                            <Button className="btn btn-icon-rounded btn-circle solid-blue" variant="link"
                                                //data-tip={this.props.intl.formatMessage({ id: "IDS_ADD" })}
                                                data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_ADD" })}
                                                data-tooltip-id="my-tooltip"
                                                // data-for="tooltip-grid-wrap"
                                                hidden={this.props.userRoleControlRights && this.props.userRoleControlRights.indexOf(addId) === -1}
                                                onClick={() => this.props.addRecord(addId)}>
                                                <FontAwesomeIcon icon={faPlus} />
                                            </Button>
                                        }

                                        {this.props.isSyncRequired === false ? <></> :
                                            <Nav.Link className="btn btn-circle outline-grey ml-2 nav-link"
                                                data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_SYNC" })}
                                                hidden={this.props.userRoleControlRights && this.props.userRoleControlRights.indexOf(syncId) === -1}
                                                onClick={() => this.props.syncData(syncId)}>
                                                <SyncIcon />
                                                {/* {getActionIcon("sync")} */}
                                            </Nav.Link>
                                        }

                                        {this.props.isCustomButton ?
                                            this.props.customButtonlist.map(button => {
                                                return <>
                                                    {/* <Button className="btn btn-circle outline-grey" variant="link" */}
                                                    <Button className="btn btn-circle outline-grey p-0" variant="link"
                                                        data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: button.label })}
                                                        // data-for="tooltip-grid-wrap"
                                                        hidden={button.hidden}
                                                        onClick={button.onClick}>
                                                        {getActionIcon(button.controlname)}
                                                    </Button>
                                                </>
                                            }) : <></>
                                        }
                                        {this.props.isRefreshRequired === false ? <></> :
                                            <Button className="btn btn-circle outline-grey p-0" variant="link"
                                                data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_REFRESH" })}
                                                // data-for="tooltip-grid-wrap"
                                                onClick={() => this.props.reloadData()}>
                                                <RefreshIcon className="custom_icons" />
                                                {/* <FontAwesomeIcon icon={faSync} /> */}
                                            </Button>
                                        }
                                        {(this.props.isExportImportRequired === false || this.props.isExportImportRequired === undefined) ? <></> :
                                            <ExportButton
                                                userRoleControlRights={this.props.userRoleControlRights}
                                                //selectedMaster={row["dataItem"]}
                                                userInfo={this.props.userInfo}
                                                controlMap={this.props.controlMap}
                                                exportUrl={"Export" + methodUrl}
                                                importUrl={"Import" + methodUrl}
                                                screenName={this.props.screenName}
                                                isDataGrid={true}
                                                detailedFieldList={this.props.detailedFieldList}
                                                extractedColumnList={this.props.extractedColumnList}
                                                settings={this.props.settings}

                                            ></ExportButton>
                                        }

                                        {this.props.isImportRequired === true ?
                                            <>
                                                <Button className="btn btn-circle outline-grey" variant="link"
                                                    data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_EXPORTTEMPLATE" })}
                                                    //data-for="tooltip-grid-wrap"
                                                    onClick={this.exportExcelHeader}>
                                                    <FontAwesomeIcon icon={faFileExcel} />
                                                </Button>
                                                <Button className="btn btn-circle outline-grey" variant="link"
                                                    data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_IMPORTDATA" })}
                                                    // data-for="tooltip-grid-wrap"
                                                    onClick={() => this.props.import()}>
                                                    <FontAwesomeIcon icon={faFileImport} />
                                                </Button>
                                            </> : ""
                                        }

                                        {this.props.isDownloadPDFRequired === false ? <></> :

                                            <Button className="btn btn-circle outline-grey" variant="link"
                                                data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_DOWNLOADPDF" })}
                                                // data-for="tooltip-grid-wrap"
                                                onClick={this.exportPDF}>
                                                <FontAwesomeIcon icon={faFilePdf} />
                                            </Button>
                                        }
                                        {/* : ""
                                        } */}
                                        {this.props.isDownloadExcelRequired === false ? <></> :
                                            <Button className="btn btn-circle outline-grey" variant="link"
                                                data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_DOWNLOADEXCEL" })}
                                                //data-for="tooltip-grid-wrap"
                                                onClick={this.exportExcel}>
                                                <FontAwesomeIcon icon={faFileExcel} />
                                            </Button>
                                        }



                                        {this.props.isExportExcelRequired === true ?
                                            <Button className="btn btn-circle outline-grey" variant="link"
                                                data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_DOWNLOADCSV" })}
                                                //data-for="tooltip-grid-wrap"
                                                onClick={() => this.props.exportExcelNew()}>
                                                <FontAwesomeIcon icon={faFileCsv} />
                                            </Button>
                                            : <></>
                                        }


                                        {this.props.isDownloadButtonOn === true ? //janakumar --> Added the sample reciving screen report button 

                                            <Nav.Link className="btn btn-circle outline-grey ml-2 nav-link"
                                                data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_PENDINGSAMPLETORECEIVEREPORT" })}
                                                hidden={this.props.userRoleControlRights && this.props.userRoleControlRights.indexOf(SampleReceivingReportId) === -1}
                                                onClick={() => this.props.samplereceivingData(SampleReceivingReportId)}>
                                                <Generate className="custom_icons" width="20" height="20" />
                                            </Nav.Link>

                                            : <></>
                                        }


                                        {/* <Button className="btn btn-circle outline-grey" variant="link"
                                            title="Download Excel"
                                            onClick={this.exportExcel}>
                                            <FontAwesomeIcon icon={faFileExcel} />
                                        </Button> */}

                                    </GridToolbar>
                                    : <></>}
                                {
                                    this.props.extractedColumnList.map((item, index) =>
                                        item.idsName &&
                                        <GridColumn key={index}
                                            // data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: item.idsName })}
                                            title={this.props.intl.formatMessage({ id: item.idsName })}
                                            {...this.columnProps(item.dataField)}
                                            width={item.width}
                                            cell={(row) => (
                                                row.rowType === "groupFooter" ?
                                                    item.dataField
                                                        === this.props.aggregatedColumn ?
                                                        <td aria-colindex={row.columnIndex} role={"gridcell"}>
                                                            {this.props.intl.formatMessage({ id: this.props.aggregateLabel })} :
                                                            {row.dataItem.aggregates[this.props.aggregatedColumn].sum}
                                                        </td> : null :
                                                    row.rowType === "groupHeader" ? null :
                                                        item.componentName === "switch" ?
                                                            <td style={{ textAlign: "center" }}>
                                                                <CustomSwitch type="switch" id={row["dataItem"][this.props.primaryKeyField] + "_" + row.dataIndex + "_" + row.columnIndex}
                                                                    disabled={item.needRights ? this.props.userRoleControlRights
                                                                        && this.props.userRoleControlRights.indexOf(
                                                                            this.props.controlMap.has(item.controlName) && this.props.controlMap.get(item.controlName).ncontrolcode
                                                                        ) === -1 : false}
                                                                    onChange={(event) => this.props.onSwitchChange({ ...this.props.switchParam, selectedRecord: row["dataItem"], ncontrolCode: switchId }, event)}
                                                                    checked={row["dataItem"][item.switchFieldName] === item.switchStatus ? true : false}
                                                                    name={row["dataItem"][this.props.primaryKeyField] + "_" + row.dataIndex + "_" + row.columnIndex} />
                                                            </td> :
                                                            //switch without logic
                                                            item.componentName === "toggle" ?
                                                                <td style={{ textAlign: "center" }}>
                                                                    <CustomSwitch type="switch" id={row["dataItem"][this.props.primaryKeyField] + "_" + row.dataIndex + "_" + row.columnIndex}
                                                                        disabled={item.needRights ? this.props.userRoleControlRights
                                                                            && this.props.userRoleControlRights.indexOf(
                                                                                this.props.controlMap.has(item.controlName) && this.props.controlMap.get(item.controlName).ncontrolcode
                                                                            ) === -1 : false}
                                                                        onChange={(event) => this.props.onToggleChange({ ...this.props.switchParam, selectedRecord: row["dataItem"], ncontrolCode: switchId }, item, event)}
                                                                        checked={row["dataItem"][item.switchFieldName] === transactionStatus.YES ? true : false}
                                                                        name={row["dataItem"][this.props.primaryKeyField] + "_" + row.dataIndex + "_" + row.columnIndex} />
                                                                </td> :
                                                                item.componentName === "checkbox" ?
                                                                    <td>
                                                                        <FormCheckbox
                                                                            name={row["dataItem"][this.props.primaryKeyField] + "_" + row.dataIndex + "_" + row.columnIndex}
                                                                            type="checkbox"
                                                                            value={row["dataItem"][item.checkBoxField] !== 0 ? true : false}
                                                                            isMandatory={false}
                                                                            required={false}
                                                                            //checked={row["dataItem"][item.checkBoxField] === item.switchStatus ? true : false}
                                                                            checked={row["dataItem"][item.checkBoxField] !== 0 ? true : false}
                                                                            onChange={(event) => this.props.onInputOnChange(event)}
                                                                        />
                                                                    </td> :
                                                                    item.fieldType === "gradeColumn" ?
                                                                        row.rowType === "groupHeader" ? null :
                                                                            <td
                                                                                data-tooltip-id="my-tooltip" data-tooltip-content={row["dataItem"][item.dataField]}
                                                                                // data-for="tooltip_grid_wrap"
                                                                                className={`${selectedId === row["dataItem"][this.props.primaryKeyField] ? 'active' : ''}`}
                                                                                style={{ color: [row["dataItem"]['scolorhexcode']] }}
                                                                            >
                                                                                {/* <ReactTooltip place="bottom" globalEventOff='click' id="tooltip_grid_wrap" /> */}
                                                                                {row["dataItem"][item.dataField]}
                                                                            </td> :
                                                                        <td data-tooltip-id="my-tooltip" data-tooltip-content={row["dataItem"][item.dataField]}
                                                                            //data-for="tooltip-grid-wrap"
                                                                            className={selectedId === row["dataItem"][this.props.primaryKeyField] ? 'active' : ''}>

                                                                            {item.isIdsField ? <FormattedMessage id={row["dataItem"][item.dataField]}
                                                                                defaultMessage={row["dataItem"][item.dataField]} /> : item.fieldType === "dateOnlyFormat" ? rearrangeDateFormatDateOnly(this.props.Login.userInfo, row["dataItem"][item.dataField])
                                                                                : row["dataItem"][item.dataField]

                                                                                // : row["dataItem"][item.dataField] ? row["dataItem"][item.dataField] :
                                                                                //     this.props.jsonField ? row["dataItem"][this.props.jsonField] &&
                                                                                //         row["dataItem"][this.props.jsonField][item.dataField]&&
                                                                                //         row["dataItem"][this.props.jsonField][item.dataField]['label'] ||
                                                                                //         row["dataItem"][this.props.jsonField][item.dataField]

                                                                            }       {
                                                                                item.dataType && item.dataType[0] === 'files' ?
                                                                                    <FontIconWrap icon={faCloudDownloadAlt} className="ml-2 className action-icons-wrap" size="lg"
                                                                                        data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_DOWNLOAD" })}
                                                                                        data-place="left"
                                                                                        onClick={() => this.props.dynamicFileDownload({ ...item, ...row.dataItem, userInfo: this.props.Login.userInfo, ...this.props.viewFileURL })}>
                                                                                        <FontAwesomeIcon icon={faCloudDownloadAlt} />
                                                                                    </FontIconWrap> : ""
                                                                            }
                                                                        </td>
                                            )}
                                        />
                                    )}

                                {this.props.isActionRequired ?

                                    <GridColumn
                                        locked
                                        headerClassName="text-center"
                                        title={this.props.intl.formatMessage({ id: 'IDS_ACTION' })}
                                        sort={false}
                                        cell={(row) => (
                                            row.rowType === "groupFooter" ? null :
                                                row.rowType === "groupHeader" ? null :
                                                    <td className={`k-grid-content-sticky k-command-cell pl-0 selectedId === row["dataItem"][this.props.primaryKeyField] ? 'active' : ''`} style={{ left: '0', right: '0', borderRightWidth: '1px', textAlign: 'center' }}>
                                                        <>
                                                            {/* Group Icon view End*/}

                                                            <FontIconWrap className="d-font-icon action-icons-wrap"
                                                                data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_SEND" })}
                                                                hidden={this.props.userRoleControlRights && this.props.userRoleControlRights.indexOf(SendToSubContractorId) === -1}
                                                                onClick={() => this.props.sendRecord(row["dataItem"], this.props.userInfo, this.props.masterdata, SendToSubContractorId)}
                                                                data-place="left"
                                                            >
                                                                <FontAwesomeIcon icon={faPaperPlane} />
                                                            </FontIconWrap>

                                                            <FontIconWrap className="d-font-icon action-icons-wrap"
                                                                data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_RECEIVEBYSTT" })}
                                                                hidden={this.props.userRoleControlRights && this.props.userRoleControlRights.indexOf(ReceivedBySTTId) === -1}
                                                                onClick={() => this.props.updateReceiveSTTSubContractTest(row["dataItem"], this.props.userInfo, this.props.masterdata, ReceivedBySTTId)}
                                                                data-place="left"
                                                            >
                                                                <FontAwesomeIcon icon={faHandHoldingWater} />
                                                            </FontIconWrap>

                                                            <FontIconWrap className="d-font-icon action-icons-wrap"
                                                                data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_RESULTRECEIVED" })}
                                                                hidden={this.props.userRoleControlRights && this.props.userRoleControlRights.indexOf(ResultReceivedId) === -1}
                                                                onClick={() => this.props.updateReceiveResultSubContractTest(row["dataItem"], this.props.userInfo, this.props.masterdata, ResultReceivedId)}
                                                                data-place="left"
                                                            >
                                                                <FontAwesomeIcon icon={faInbox} />
                                                            </FontIconWrap>


                                                            <FontIconWrap className="d-font-icon action-icons-wrap"
                                                                data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_EDIT" })}
                                                                // data-for="tooltip-grid-wrap"
                                                                data-place="left"
                                                                hidden={this.props.userRoleControlRights && this.props.userRoleControlRights.indexOf(editId) === -1}
                                                                onClick={() => this.props.fetchRecord({ ...this.props.editParam, primaryKeyValue: row["dataItem"][this.props.editParam.primaryKeyField], editRow: row["dataItem"], ncontrolCode: editId })}
                                                            >
                                                                <FontAwesomeIcon icon={faPencilAlt} />
                                                            </FontIconWrap>

                                                            {/* added by sujatha ate_274 9/10/2025 for WQMIS Sync Icon */}
                                                             <FontIconWrap className="d-font-icon action-icons-wrap"
                                                                data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_SYNC" })}
                                                                // data-for="tooltip-grid-wrap"
                                                                data-place="left"
                                                                hidden={this.props.userRoleControlRights && this.props.userRoleControlRights.indexOf(MasterSync) === -1}
                                                                onClick={() => this.props.syncRecord({ ...this.props.syncParam, primaryKeyValue: row["dataItem"][this.props.syncParam.primaryKeyField], editRow: row["dataItem"], ncontrolCode: editId })}
                                                            >
                                                                <FontAwesomeIcon icon={faSync} />
                                                            </FontIconWrap>
                                                            {/* Ate234 janakumar -> BGSI-7 Screen Name -> Project And Site Hierarchy Mapping -> View tree was site hierarchy screen deisgn  */}
                                                            <FontIconWrap className="d-font-icon action-icons-wrap"
                                                                data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_VIEW" })}
                                                                // data-for="tooltip-grid-wrap"
                                                                data-place="left"
                                                                hidden={this.props.userRoleControlRights && this.props.userRoleControlRights.indexOf(treeViewId) === -1}
                                                                onClick={() => this.props.fetchRecord({ ...this.props.treeView, primaryKeyValue: row["dataItem"][this.props.treeView.primaryKeyField], treeView: row["dataItem"], ncontrolCode: treeViewId })}
                                                            >
                                                                <FontAwesomeIcon icon={faEye} />
                                                            </FontIconWrap>

                                                            {/* below line commented by rukshana to remove duplicate view button in grid which
                                                            has been done for BGSI mock screen*/}
                                                        {/*
                                                            <FontIconWrap className="d-font-icon action-icons-wrap" 
                                                                data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_VIEW" })}
                                                                data-place="right"
                                                                hidden={this.props.
                                                                    userRoleControlRights && this.props.userRoleControlRights.indexOf(viewId) === -1}
                                                                onClick={() => this.props.fetchRecord({ ...this.props.viewParam, primaryKeyValue: row["dataItem"][this.props.viewParam.primaryKeyField], viewRow: row["dataItem"], ncontrolCode: viewId })}
                                                                >
                                                                <FontAwesomeIcon icon={faEye} />
                                                            </FontIconWrap> */}


                                                            <BarcodeButton
                                                                userRoleControlRights={this.props.userRoleControlRights}
                                                                selectedMaster={row["dataItem"]}
                                                                userInfo={this.props.userInfo}
                                                                controlMap={this.props.controlMap}
                                                                methodUrl={"Barcode" + methodUrl}
                                                                screenName={this.props.screenName}
                                                                isDataGrid={true}
                                                            ></BarcodeButton>

                                                            {/* <FontIconWrap className="d-font-icon action-icons-wrap"
                                                                    data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_PRINTBARCODE" })}
                                                                    // data-for="tooltip-grid-wrap"
                                                                    data-place="left"
                                                                    hidden={this.props.
                                                                        userRoleControlRights && this.props.userRoleControlRights.indexOf(barcodeId) === -1}
                                                                    onClick={() => this.props.openBarcodeModal(row["dataItem"], barcodeId, this.props.userInfo, false)}
                                                                >
                                                                    <FontAwesomeIcon icon={faBarcode} />
                                                                </FontIconWrap> */}
                                                            {/* Add by Neeraj kumar for Language screen -RMTP-101*/}
                                                            <FontIconWrap className="d-font-icon action-icons-wrap"
                                                                data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_ADDSYNONYMN" })}
                                                                //  data-for="tooltip-grid-wrap"
                                                                data-place="left"
                                                                hidden={this.props.userRoleControlRights && this.props.userRoleControlRights.indexOf(languagesId) === -1}
                                                                onClick={() => this.props.languagesRecord({ ...this.props.languagesParam, primaryKeyValue: row["dataItem"][this.props.languagesParam.primaryKeyField], languagesRow: row["dataItem"], ncontrolCode: languagesId })}
                                                            >
                                                                <FontAwesomeIcon icon={faLanguage} />
                                                            </FontIconWrap>

                                                            {/* <FontAwesomeIcon icon={faEye}
                                                    title={this.props.intl.formatMessage({ id: "IDS_VIEW" })}
                                                    hidden={this.props.userRoleControlRights && this.props.userRoleControlRights.indexOf(viewId) === -1}
                                                    onClick={() => this.props.viewRecord({...this.props.viewParam, primaryKeyValue:row["dataItem"][this.props.viewParam.primaryKeyField], viewRow:row["dataItem"]})}/>
                                                 */}        <FontIconWrap className="d-font-icon action-icons-wrap" data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_DELETE" })} data-place="top"
                                                                hidden={this.props.userRoleControlRights && this.props.userRoleControlRights.indexOf(deleteId) === -1}
                                                                onClick={() => this.handleClickDelete({ ...this.props.deleteParam, selectedRecord: row["dataItem"], ncontrolCode: deleteId }, row)}
                                                            >
                                                                <FontAwesomeIcon icon={faTrashAlt} />
                                                                {/* <ConfirmDialog
                                                                    name="deleteMessage"
                                                                    cardTitle={this.props.intl.formatMessage({ id: "IDS_CONFIRMATION" })}
                                                                    title={this.props.intl.formatMessage({ id: "IDS_DELETE" })}
                                                                    message={this.props.intl.formatMessage({ id: "IDS_DELETECONFIRMMSG" })}
                                                                    doLabel={this.props.intl.formatMessage({ id: "IDS_OK" })}
                                                                    doNotLabel={this.props.intl.formatMessage({ id: "IDS_CANCEL" })}
                                                                    icon={faTrashAlt}
                                                                    handleClickDelete={() => this.handleClickDelete({ ...this.props.deleteParam, selectedRecord: row["dataItem"], ncontrolCode: deleteId }, row)}
                                                                /> */}
                                                            </FontIconWrap>
                                                                {this.props.ExportRequired ?                                              
                                                                <FontIconWrap  className="d-font-icon action-icons-wrap" data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_EXPORT" })} data-place="left" //data-for="tooltip-grid-wrap"
                                                               //  hidden={this.props.userRoleControlRights && this.props.userRoleControlRights.indexOf(exportId) === -1}
                                                                >
                                                                <Image src={exporticon} alt="filer-icon action-icons-wrap" width="20" height="20" className="ActionIconColor img-normalize"
                                                                   // onClick={() => this.props.exportRecord(row["dataItem"], "Merge", exportId)} data-place="left"
                                                                    onClick={() =>  this.props.exportRecord({ ...this.props.exportParam, selectedRecord: row["dataItem"], ncontrolCode: exportId }, row)
                                                        }
                                                                />
                                                              </FontIconWrap>
                                                               : ""} 

                                                            {this.props.ImportRequired ?
                                                            <FontIconWrap className="d-font-icon action-icons-wrap" data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "Import" })} data-place="top"  
                                                            
                                                             //   hidden={this.props.userRoleControlRights && this.props.userRoleControlRights.indexOf(importId) === -1}  
                                                                                                                                                                                                   
                                                            onClick={() => this.props.openModal({ ...this.props.importParam, primaryKeyValue: row["dataItem"][this.props.importParam.primaryKeyField], importRow: row["dataItem"], ncontrolCode: importId })}>                                                                                                                                                                                                                                                                                                                   
                                                                <FontAwesomeIcon icon={faFileImport} />                                                               
                                                            </FontIconWrap>
                                                             : ""} 
                                  
                                                            {this.props.isMergeRequired ?
                                                            <FontIconWrap  className="d-font-icon action-icons-wrap" data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_MERGE" })} data-place="left" //data-for="tooltip-grid-wrap"
                                                                    
                                                                  >    
                                                                <Image src={merge} alt="filer-icon action-icons-wrap" width="20" height="20" className="ActionIconColor img-normalize"
                                                                   // onClick={() => this.props.mergeRecord(row["dataItem"], "Merge", mergeId)} data-place="left"
                                                                   onClick={() =>  this.props.mergeRecord({ ...this.props.mergeParam, selectedRecord: row["dataItem"], ncontrolCode: mergeId }, row)
                                                        }
                                                                />
                                                              </FontIconWrap>
                                                                    : ""} 

                                                            <FontIconWrap className="d-font-icon action-icons-wrap"
                                                                hidden={this.props.userRoleControlRights && this.props.userRoleControlRights.indexOf(downloadId) === -1}
                                                                onClick={() => this.props.viewDownloadFile({ ...this.props.masterdata, ...this.props.downloadParam, inputData: { ...row["dataItem"], userinfo: this.props.Login.userInfo }, userinfo: this.props.Login.userInfo, ncontrolCode: downloadId }, row)}
                                                                data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_DOWNLOADFILE" })} data-place="left"
                                                            //  data-for="tooltip-grid-wrap"
                                                            >
                                                                <FontAwesomeIcon icon={faCloudDownloadAlt} //title={this.props.intl.formatMessage({ id: "IDS_DOWNLOADFILE" })}
                                                                />
                                                            </FontIconWrap>
                                                            {this.props.isreportview ?
                                                                <FontIconWrap className="d-font-icon action-icons-wrap"
                                                                    //hidden={this.props.userRoleControlRights && this.props.userRoleControlRights.indexOf(viewreport) === -1}
                                                                    onClick={() => this.props.viewReportFile({ ...this.props.masterdata, ...this.props.downloadParam, inputData: { ...row["dataItem"], userinfo: this.props.Login.userInfo }, userinfo: this.props.Login.userInfo, ncontrolCode: downloadId }, row)}
                                                                    data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_VIEWREPORT" })} data-place="left"
                                                                //  data-for="tooltip-grid-wrap"
                                                                >

                                                                    <FontAwesomeIcon icon={faEye} //title={this.props.intl.formatMessage({ id: "IDS_DOWNLOADFILE" })} 
                                                                    />
                                                                </FontIconWrap>
                                                                : ""}
                                                            {/* <FontAwesomeIcon icon={faTrashAlt}
                                                    title={this.props.intl.formatMessage({ id: "IDS_DELETE" })}
                                                    hidden={this.props.userRoleControlRights && this.props.userRoleControlRights.indexOf(deleteId) === -1}
                                                    onClick = {() => confirmMessage.confirm(
                                                        "deleteMessage",
                                                        this.props.intl.formatMessage({ id: "IDS_DELETE" }),
                                                        this.props.intl.formatMessage({ id: "IDS_DEFAULTCONFIRMMSG" }),
                                                        this.props.intl.formatMessage({ id: "IDS_OK" }),
                                                        this.props.intl.formatMessage({ id: "IDS_CANCEL" }),
                                                        () => this.handleClickDelete({ ...this.props.deleteParam, selectedRecord: row["dataItem"], ncontrolCode: deleteId }, row)
                                                    )}
                                                /> */}

                                                            {/* <FontAwesomeIcon icon={faThumbtack}
                                                            title={this.props.intl.formatMessage({ id: "IDS_SETDEFAULT" })}
                                                            hidden={this.props.userRoleControlRights && this.props.userRoleControlRights.indexOf(defaultId) === -1}
                                                            onClick={() => this.props.defaultRecord({ ...this.props.defaultParam, selectedRecord: row["dataItem"], ncontrolCode: defaultId }, row)} /> */}
                                                            <FontIconWrap className="d-font-icon action-icons-wrap" data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_APPROVE" })}
                                                                hidden={this.props.userRoleControlRights && this.props.userRoleControlRights.indexOf(approveId) === -1}
                                                                onClick={() => this.props.approveRecord(row, "Approve", approveId)} data-place="left"
                                                            //data-for="tooltip-grid-wrap"
                                                            >
                                                                <FontAwesomeIcon icon={faThumbsUp} />
                                                            </FontIconWrap>
                                                            <FontIconWrap className="d-font-icon action-icons-wrap" data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_COPY" })}
                                                                hidden={this.props.userRoleControlRights && this.props.userRoleControlRights.indexOf(copyId) === -1}
                                                                onClick={() => this.props.copyRecord(row, "Copy", copyId)} data-place="left"
                                                            // data-for="tooltip-grid-wrap"
                                                            >
                                                                <FontAwesomeIcon icon={faCopy} />
                                                            </FontIconWrap>

                                                            <FontIconWrap className="d-font-icon action-icons-wrap" data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_COMPLETE" })}
                                                                hidden={this.props.userRoleControlRights && this.props.userRoleControlRights.indexOf(completeId) === -1}
                                                                onClick={() => this.props.completeRecord(row["dataItem"], "Complete", completeId)} data-place="left"
                                                            // data-for="tooltip-grid-wrap"
                                                            >
                                                                <FontAwesomeIcon icon={faCheck} />
                                                            </FontIconWrap>

                                                            <FontIconWrap className="d-font-icon action-icons-wrap" data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_RESENT" })}
                                                                hidden={this.props.userRoleControlRights && this.props.userRoleControlRights.indexOf(resentId) === -1}
                                                                onClick={() => this.props.reSent(row["dataItem"], "Resent", resentId)}
                                                                data-place="left" //data-for="tooltip-grid-wrap"
                                                            >
                                                                <MailResend width="24px" className='svg-inline--fa' />
                                                                {/* <FontAwesomeIcon icon={faRedo} /> */}
                                                            </FontIconWrap>


                                                            <Nav.Link className="d-font-icon action-icons-wrap" data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_CANCEL" })} data-place="left" //data-for="tooltip-grid-wrap"
                                                                hidden={this.props.userRoleControlRights && this.props.userRoleControlRights.indexOf(cancelId) === -1} >
                                                                <Image src={reject} alt="filer-icon action-icons-wrap" width="20" height="20" className="ActionIconColor img-normalize"
                                                                    onClick={() => this.props.cancelRecord(row["dataItem"], "Cancel", cancelId)} data-place="left"
                                                                />
                                                            </Nav.Link>
                                                            {/* <Button variant="link" title={this.props.intl.formatMessage({ id: "IDS_RECEIVE" })}
                                                    className="mr-2 action-icons-wrap"
                                                    hidden={this.props.userRoleControlRights && this.props.userRoleControlRights.indexOf(receiveGoodsId) === -1}
                                                    onClick={() => this.props.receiveRecord({ ...this.props.receiveParam, selectedRecord: row["dataItem"], ncontrolCode: receiveGoodsId })}>
                                                    <Image src={checkedIcon} alt="filer-icon" width="20" height="20" />
                                                </Button> */}
                                                            {this.props.actionIcons ? this.props.actionIcons.length > 0 ? this.props.actionIcons.map(action =>
                                                                <FontIconWrap
                                                                    className="d-font-icon action-icons-wrap"
                                                                    data-tooltip-id="my-tooltip" data-tooltip-content={action.title}
                                                                    hidden={action.hidden === undefined ? true : action.hidden}
                                                                    onClick={() => action.onClick(row["dataItem"], action, row)}>
                                                                    {getActionIcon(action.controlname)}
                                                                </FontIconWrap>
                                                            ) : "" : ""}

                                                             {/* added by sujatha ATE_274 for Report Icon in WQMIS Transaction Screen */}
                                                            {this.props.isReportRequired === true ? 
                                                            <Nav.Link className="btn btn-circle outline-grey mr-2"
                                                                hidden={this.props.userRoleControlRights.indexOf(wqmisTransactionReportId) === -1}
                                                                data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_REPORT" })}
                                                                onClick={() => this.props.onDownloadClick(wqmisTransactionReportId, row)}
                                                            >
                                                            <Report />
                                                            </Nav.Link>
                                                            : <></> 
                                                            }

                                                            {this.props.hasControlWithOutRights ?
                                                                <>
                                                                    {this.props.showeditRecordWORights ?
                                                                        <FontIconWrap className="d-font-icon action-icons-wrap" data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_EDIT" })}
                                                                            //title={this.props.intl.formatMessage({ id: "IDS_EDIT" })} 
                                                                            data-place="left">
                                                                            <FontAwesomeIcon icon={faPencilAlt}
                                                                                //title={this.props.intl.formatMessage({ id: "IDS_EDIT" })}
                                                                                name={"deleteworights"}
                                                                                onClick={() => this.props.editRecordWORights(row["dataItem"])}
                                                                            />
                                                                        </FontIconWrap> : ""
                                                                    }
                                                                    {/* Add by Neeraj kumar for Language screen -RMTP-101*/}
                                                                    {this.props.showeditRecordWORights ?
                                                                        <FontIconWrap className="d-font-icon action-icons-wrap" data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_LANGUAGESCONVERTER" })}
                                                                            //title={this.props.intl.formatMessage({ id: "IDS_EDIT" })} 
                                                                            data-place="left">
                                                                            <FontAwesomeIcon icon={faLanguage}
                                                                                //title={this.props.intl.formatMessage({ id: "IDS_EDIT" })}
                                                                                name={"deleteworights"}
                                                                                onClick={() => this.props.editRecordWORights(row["dataItem"])}
                                                                            />
                                                                        </FontIconWrap> : ""
                                                                    }
                                                                    {
                                                                        this.props.showdeleteRecordWORights ?
                                                                            <FontIconWrap className="d-font-icon action-icons-wrap" data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_DELETE" })}
                                                                                // data-for="tooltip-grid-wrap"
                                                                                onClick={() => this.props.deleteRecordWORights(row["dataItem"])}>
                                                                                <FontAwesomeIcon icon={faTrashAlt}
                                                                                    //title={this.props.intl.formatMessage({ id: "IDS_DELETE" })}
                                                                                    name={"deleteworights"}

                                                                                />
                                                                            </FontIconWrap> : ""
                                                                    }

                                                                </> : ""
                                                            }
                                                        </>

                                                    </td>
                                        )}
                                    /> : ""}
                            </Grid>
                            {[...this.props.extractedColumnList].map((item, index) =>
                                <ExcelExportColumn field={item.dataField} title={this.props.intl.formatMessage({ id: item.idsName }) + (item.dateField ? '(dd-mm-yyy)' : "")} width={200} />
                            )}
                            {this.props.detailedFieldList &&
                                this.props.detailedFieldList.map((item, index) =>
                                    <ExcelExportColumn field={item.dataField} title={this.props.intl.formatMessage({ id: item.idsName }) + (item.dateField ? '(dd-mm-yyy)' : "")} width={200} />
                                )}
                        </ExcelExport>
                        <ExcelExport
                            data={[]}
                            //group={group}
                            collapsible={true}
                            fileName={this.props.screenName && this.props.screenName}
                            ref={(exporter) => {
                                // console.log(exporter);
                                this._excelExportHeader = exporter;
                            }}>
                            {//console.log(this.props.extractedColumnList)
                            }

                            {
                                this.props.isImportRequired === true ?
                                    this.props.exportFieldList && this.props.exportFieldList.length > 0 ?
                                        this.props.exportFieldList.map((item, index) =>
                                            <ExcelExportColumn field={item.dataField} title={this.props.intl.formatMessage({ id: item.dataField }) + '(' + this.props.intl.formatMessage({ id: item.idsName }) + ')' + (item.dataType === "date" ? '(yyyy-mm-dd)' : "")} width={200} />
                                        )
                                        :
                                        <>
                                            {this.props.extractedColumnList && this.props.extractedColumnList.map((item, index) =>
                                                <ExcelExportColumn field={item.dataField} title={this.props.intl.formatMessage({ id: item.dataField }) + '(' + this.props.intl.formatMessage({ id: item.idsName }) + ')' + (item.dataType === "date" ? '(yyyy-mm-dd)' : "")} width={200} />
                                            )}
                                            {this.props.detailedFieldList && this.props.detailedFieldList.map((item, index) =>
                                                <ExcelExportColumn field={item.dataField} title={this.props.intl.formatMessage({ id: item.dataField }) + '(' + this.props.intl.formatMessage({ id: item.idsName }) + ')' + (item.dataType === "date" ? '(yyyy-mm-dd)' : "")} width={200} />
                                            )}

                                        </>

                                    :
                                    <>
                                        {this.props.extractedColumnList && this.props.extractedColumnList.map((item, index) =>
                                            <ExcelExportColumn field={item.dataField} title={this.props.intl.formatMessage({ id: item.dataField }) + '(' + this.props.intl.formatMessage({ id: item.idsName }) + ')' + (item.dataType === "date" ? '(yyyy-mm-dd)' : "")} width={200} />
                                        )}

                                        {this.props.detailedFieldList && this.props.detailedFieldList.map((item, index) =>
                                            <ExcelExportColumn field={item.dataField} title={this.props.intl.formatMessage({ id: item.dataField }) + '(' + this.props.intl.formatMessage({ id: item.idsName }) + ')' + (item.dataType === "date" ? '(yyyy-mm-dd)' : "")} width={200} />
                                        )}
                                    </>

                            }

                            {/* {[...this.props.extractedColumnList].map((item, index) =>
                                <ExcelExportColumn field={item.dataField} title={this.props.intl.formatMessage({ id: item.dataField }) + '(' + this.props.intl.formatMessage({ id: item.idsName }) + ')' + (item.dateField ? '(dd-mm-yyy)' : "")} width={200} />
                            )}  

                            {this.props.detailedFieldList &&
                                this.props.detailedFieldList.map((item, index) =>
                                    <ExcelExportColumn field={item.dataField} title={this.props.intl.formatMessage({ id: item.dataField }) + '(' + this.props.intl.formatMessage({ id: item.idsName }) + ')' + (item.dateField ? '(dd-mm-yyy)' : "")} width={200} />
                            )}  */}
                        </ExcelExport>
                    </LocalizationProvider >
                    {/* </Tooltip> */}
                    {
                        this.props.isToolBarRequired ?
                            <ttfStyle>
                                <GridPDFExport
                                    ref={(element) => { this._pdfExport = element; }}
                                    margin="1cm"
                                    // paperSize= "A4"
                                    scale={0.75}
                                    fileName="Export.pdf"

                                >

                                    {
                                        <Grid data={process(this.props.data || [], { sort: this.props.dataState.sort, filter: this.props.dataState.filter, group: this.props.dataState.group })} group={this.props.dataState.group} groupable={true}>
                                            {this.props.extractedColumnList.map((item, index) =>
                                                <GridColumn key={index} title={this.props.intl.formatMessage({ id: item.idsName })}
                                                    field={item.dataField}
                                                    width={item.width}

                                                    cell={(row) => (
                                                        <td>
                                                            {item.isIdsField ? <FormattedMessage id={row["dataItem"][item.dataField]} defaultMessage={row["dataItem"][item.dataField]} />
                                                                : row["dataItem"][item.dataField]}
                                                        </td>)}
                                                />
                                            )}
                                            {this.props.detailedFieldList &&
                                                this.props.detailedFieldList.map((item, index) =>
                                                    <GridColumn key={index} title={this.props.intl.formatMessage({ id: item.idsName })}
                                                        field={item.dataField}
                                                        width={item.width}

                                                        cell={(row) => (
                                                            <td>
                                                                {item.isIdsField ? <FormattedMessage id={row["dataItem"][item.dataField]} defaultMessage={row["dataItem"][item.dataField]} />
                                                                    : row["dataItem"][item.dataField]}
                                                            </td>)}
                                                    />
                                                )}


                                        </Grid>}
                                </GridPDFExport>

                                <style>{ttfFont}</style>
                            </ttfStyle>
                            : ""
                    }


                </AtTableWrap >
            </>
        );
    }

    /* component commented by L.Subashini 13/12/2025 while upgrading to React 17 */
    // componentDidUpdate() {
    //     ReactTooltip.rebuild();
    // }
}
const mapStateToProps = state => {
    return ({ Login: state.Login })
}



export default connect(mapStateToProps, { dynamicFileDownload, undefined })(injectIntl(DataGrid));