import {
    faCheck,
    faCloudDownloadAlt,
    faCopy,
    faEye,
    faFileCsv,
    faFileExcel,
    faFileImport,
    faFilePdf,
    faLanguage,
    faPencilAlt,
    faPlus,
    faRedo,
    faSync,
    faThumbsUp,
    faTrashAlt
} from '@fortawesome/free-solid-svg-icons';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ExcelExport, ExcelExportColumn } from '@progress/kendo-react-excel-export';
import { Grid, GridColumn, GridColumnMenuFilter, GridNoRecords, GridToolbar } from '@progress/kendo-react-grid';
import { GridPDFExport } from '@progress/kendo-react-pdf';
import React from 'react';
import { Button, Card, Col, FormGroup, FormLabel, Image, Nav, Row } from 'react-bootstrap';
import { FormattedMessage, injectIntl } from 'react-intl';
// import { Tooltip } from '@progress/kendo-react-tooltip';
import { process } from '@progress/kendo-data-query';
import { LocalizationProvider } from '@progress/kendo-react-intl';
import parse from 'html-react-parser';
import { CSVLink } from "react-csv";
import { connect } from 'react-redux';
import { toast } from 'react-toastify';

import reject from '../../assets/image/reject.svg';
import { ttfFont } from '../../assets/styles/ttfFont';
import ConfirmMessage from '../../components/confirm-alert/confirm-message.component';
import { dynamicFileDownload } from '../../actions/ServiceAction';
import { rearrangeDateFormatDateOnly } from "../../components/CommonScript";
import { getActionIcon } from '../../components/HoverIcons';
import CustomSwitch from '../../components/custom-switch/custom-switch.component';
import { AtTableWrap, FontIconWrap, FormControlStatic } from '../../components/data-grid/data-grid.styles';
import FormCheckbox from '../../components/form-checkbox/form-checkbox.component';
import ColumnMenu from '../../components/data-grid/ColumnMenu';
import SimpleGrid from '../../components/data-grid/SimpleGrid';

{/* component commented by L.Subashini 13/12/2025 while upgrading to React 17 */}
//import ReactTooltip from 'react-tooltip';

{/* component used by L.Subashini 13/12/2025 while upgrading to React 17 */}
//import { Tooltip } from 'react-tooltip';




class DataGridForStorage extends React.Component {

    _pdfExport;
    _excelExport;
    constructor(props) {
        super(props);
        this.confirmMessage = new ConfirmMessage();
        this.state = {
            dataResult: this.props.dataResult
        }

    }


    detailBand = (props) => {

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

    expandChange = (event) => {
        const isExpanded =
            event.dataItem.expanded === undefined ?
                event.dataItem.aggregates : event.dataItem.expanded;

        if (this.props.hasChild && event.value === true) {
            event.dataItem.expanded = !isExpanded;
            this.props.handleExpandChange(event, this.props.dataState)
        }
        else {
            event.dataItem.expanded = !isExpanded;
            this.setState({ isExpanded });
        }
    }


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
        if (this.props.dataResult.data.length > 0)
            this._pdfExport.save();
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
    getNumberOfItems = (data) => {
        let count = 0;
        data.forEach((item) => {
            if (item.items) {
                count = count + this.getNumberOfItems(item.items);
            } else {
                count++;
            }
        });
        return count;
    };
    getNumberOfSelectedItems = (data) => {
        let count = 0;
        data.forEach((item) => {
            if (item.items) {
                count = count + this.getNumberOfSelectedItems(item.items);
            } else {
                count = count + (item.selected == true ? 1 : 0);
            }
        });
        return count;
    };
    checkHeaderSelectionValue = () => {
        let selectedItems = this.getNumberOfSelectedItems(this.props.dataResult.data);
        return this.props.dataResult.data.length > 0 && selectedItems == this.getNumberOfItems(this.props.dataResult.data);
    };
    headerSelectionChange = (event) => {
        const checkboxElement = event.target;
        const checked = event.syntheticEvent.target.checked;
        let dataResult = this.props.dataResult;
        dataResult.data.map(item => {
            return item.items.map(item => {
                if (item.selected === undefined) {
                    item.selected = false;
                }
                item.selected = checked;
                return item;
            });
        });
        this.setState({ dataResult })
    }

    selectionChange = (event) => {
        let dataResult = this.props.dataResult;
        dataResult.data.map(x => {
            return x.items.map(item => {
                if (item[this.props.primaryKeyField] === event.dataItem[this.props.primaryKeyField]) {
                    item.selected = !event.dataItem.selected;
                }
                return item;
            });
        });
        this.setState({ dataResult })
    }
    render() {

        //console.log("controlMap:", this.props);
        //  loadMessages(messages[this.props.Login.userInfo.slanguagetypecode], "lang");
        const methodUrl = this.props.methodUrl ? this.props.methodUrl : (this.props.inputParam && this.props.inputParam.methodUrl);

        const addId = this.props.controlMap && this.props.controlMap.has("Add".concat(methodUrl))
            && this.props.controlMap.get("Add".concat(methodUrl)).ncontrolcode;

        const editId = this.props.controlMap && this.props.controlMap.has("Edit".concat(methodUrl))
            && this.props.controlMap.get("Edit".concat(methodUrl)).ncontrolcode;

        {/* Add by Neeraj kumar for Language screen -RMTP-101*/ }
        const languagesId = this.props.controlMap && this.props.controlMap.has("Update".concat(methodUrl))
            && this.props.controlMap.get("Update".concat(methodUrl)).ncontrolcode;

        // const viewId = this.props.controlMap.has("View".concat(methodUrl))
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

        // const receiveGoodsId = this.props.controlMap.has("Receive".concat(methodUrl))
        //     && this.props.controlMap.get("Receive".concat(methodUrl)).ncontrolcode;
        const downloadId = this.props.controlMap && this.props.controlMap.has("Download".concat(methodUrl))
            && this.props.controlMap.get("Download".concat(methodUrl)).ncontrolcode;

        const resentId = this.props.controlMap && this.props.controlMap.has("Resent")
            && this.props.controlMap.get("Resent").ncontrolcode;

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
                                onDataStateChange={this.props.dataStateChange}
                                onSelectionChange={this.props.selectionChange}
                                onHeaderSelectionChange={this.props.headerSelectionChange}>
                                <GridNoRecords>
                                    {this.props.intl.formatMessage({ id: "IDS_NORECORDSAVAILABLE" })}
                                </GridNoRecords>
                                {this.props.needMultiSelect === false ? "" :
                                    <GridColumn
                                        field="selected"
                                        width="50px"
                                        title={this.props.title}
                                        groupable={false}
                                        headerSelectionValue={this.props.dataResult && this.props.dataResult.data && this.checkHeaderSelectionValue()}
                                    />}
                                {this.props.isToolBarRequired ?
                                    <GridToolbar>
                                        {this.props.isAddRequired === false ? <></> :
                                            <Button className="btn btn-icon-rounded btn-circle solid-blue" variant="link"
                                                data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_ADD" })}
                                                // data-for="tooltip-grid-wrap"
                                                hidden={this.props.userRoleControlRights && this.props.userRoleControlRights.indexOf(addId) === -1}
                                                onClick={() => this.props.addRecord(addId)}>
                                                <FontAwesomeIcon icon={faPlus} />
                                            </Button>
                                        }
                                        {this.props.isCustomButton ?
                                            this.props.customButtonlist
                                                .filter(button => Object.keys(button).length > 0) //ATE - Jana Added this line for BGSI
                                                .map(button => {
                                                    return <>
                                                        <Button className="btn btn-circle outline-grey" variant="link"
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
                                            <Button className="btn btn-circle outline-grey" variant="link"
                                                data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_REFRESH" })}
                                                // data-for="tooltip-grid-wrap"
                                                onClick={() => this.props.reloadData()}>
                                                <FontAwesomeIcon icon={faSync} />
                                            </Button>
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
                                            filter={item.filterType}
                                            cell={(row) => (
                                                row.rowType === "groupFooter" ?
                                                    item.dataField
                                                        === this.props.aggregatedColumn ?
                                                        <td aria-colindex={row.columnIndex} role={"gridcell"}>
                                                            {this.props.intl.formatMessage({ id: this.props.aggregateLabel })} :
                                                            {row.dataItem.aggregates[this.props.aggregatedColumn].sum}
                                                        </td> : null :
                                                    row.rowType === "groupHeader" ? null :
                                                        item.componentName === "combobox" ?
                                                            <td style={{ textAlign: "center" }}>
                                                                <FormSelectSearch
                                                                    name={row["dataItem"][this.props.primaryKeyField] + "_" + row.dataIndex + "_" + row.columnIndex}
                                                                    as={"select"}
                                                                    onChange={(event) => this.onSwitchChange({ ...this.props.switchParam, selectedRecord: row["dataItem"], ncontrolCode: switchId }, event)}
                                                                    formLabel={this.props.intl.formatMessage({ id: "IDS_STORAGESTRUCTURENAME" })}
                                                                    isMandatory={true}
                                                                    value={{}}
                                                                    options={[]}
                                                                    optionId={"value"}
                                                                    optionValue={"label"}
                                                                    isMulti={false}
                                                                    isDisabled={false}
                                                                    isSearchable={true}
                                                                    isClearable={false}
                                                                />
                                                            </td> :
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
                                                    <td className={`k-grid-content-sticky k-command-cell selectedId === row["dataItem"][this.props.primaryKeyField] ? 'active' : ''`} style={{ left: '0', right: '0', borderRightWidth: '1px', textAlign: 'center' }}>
                                                        <>
                                                            <Nav.Link>
                                                                <FontIconWrap className="d-font-icon action-icons-wrap"
                                                                    data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_EDIT" })}
                                                                    // data-for="tooltip-grid-wrap"
                                                                    data-place="left"
                                                                    hidden={this.props.
                                                                        userRoleControlRights && this.props.userRoleControlRights.indexOf(editId) === -1}
                                                                    onClick={() => this.props.fetchRecord({ ...this.props.editParam, primaryKeyValue: row["dataItem"][this.props.editParam.primaryKeyField], editRow: row["dataItem"], ncontrolCode: editId })}
                                                                >
                                                                    <FontAwesomeIcon icon={faPencilAlt} />
                                                                </FontIconWrap>
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
                                                                    <FontAwesomeIcon icon={faRedo} />
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
                                                            </Nav.Link>
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
                                    this.props.exportFieldList.length > 0 ?
                                        this.props.exportFieldList.map((item, index) =>
                                            <ExcelExportColumn field={item.dataField} title={this.props.intl.formatMessage({ id: item.dataField }) + '(' + this.props.intl.formatMessage({ id: item.idsName }) + ')' + (item.dateField ? '(dd-mm-yyy)' : "")} width={200} />
                                        ) : this.props.extractedColumnList && this.props.extractedColumnList.map((item, index) =>
                                            <ExcelExportColumn field={item.dataField} title={this.props.intl.formatMessage({ id: item.dataField }) + '(' + this.props.intl.formatMessage({ id: item.idsName }) + ')' + (item.dateField ? '(dd-mm-yyy)' : "")} width={200} />
                                        )
                                    :
                                    this.props.extractedColumnList && this.props.extractedColumnList.map((item, index) =>
                                        <ExcelExportColumn field={item.dataField} title={this.props.intl.formatMessage({ id: item.dataField }) + '(' + this.props.intl.formatMessage({ id: item.idsName }) + ')' + (item.dateField ? '(dd-mm-yyy)' : "")} width={200} />
                                    )
                            }

                            {/* {[...this.props.extractedColumnList].map((item, index) =>
                                <ExcelExportColumn field={item.dataField} title={this.props.intl.formatMessage({ id: item.dataField }) + '(' + this.props.intl.formatMessage({ id: item.idsName }) + ')' + (item.dateField ? '(dd-mm-yyy)' : "")} width={200} />
                            )} */}

                            {this.props.detailedFieldList &&
                                this.props.detailedFieldList.map((item, index) =>
                                    <ExcelExportColumn field={item.dataField} title={this.props.intl.formatMessage({ id: item.dataField }) + '(' + this.props.intl.formatMessage({ id: item.idsName }) + ')' + (item.dateField ? '(dd-mm-yyy)' : "")} width={200} />
                                )}
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

    componentDidUpdate(previousProps) {
          /* component commented by L.Subashini 13/12/2025 while upgrading to React 17 */
       // ReactTooltip.rebuild();
        let { dataResult } = this.state
        if (this.props.dataResult !== previousProps.dataResult) {
            dataResult = this.props.dataResult;
            this.setState({ dataResult })
        }
    }
}
const mapStateToProps = state => {
    return ({ Login: state.Login })
}



export default connect(mapStateToProps, { dynamicFileDownload, undefined })(injectIntl(DataGridForStorage));