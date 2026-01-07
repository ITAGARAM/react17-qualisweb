import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Button, Nav } from 'react-bootstrap';
import { Grid, GridColumn as Column, GridToolbar, GridColumnMenuFilter, GridNoRecords, GridColumn } from '@progress/kendo-react-grid';

import { Row, Col } from 'react-bootstrap';
import { AtTableWrap, FontIconWrap } from '../data-grid/data-grid.styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReactComponent as RefreshIcon } from '../../assets/image/refresh.svg';
import {
    updateStore, viewAttachment
} from '../../actions';

import {faCloudDownloadAlt, faRocket, faRecycle
} from '@fortawesome/free-solid-svg-icons';
import ColumnMenu from './ColumnMenu';
// import { Tooltip } from '@progress/kendo-react-tooltip';

import messages_en from '../../assets/translations/en.json';
import messages_ko from '../../assets/translations/ko.json';
import messages_fr from '../../assets/translations/fr.json';
import messages_id from '../../assets/translations/id.json';
import messages_de from '../../assets/translations/de.json';
import { loadMessages, LocalizationProvider } from '@progress/kendo-react-intl';
import { connect } from 'react-redux';
import { process } from '@progress/kendo-data-query';

//component commented by L.Subashini 13/12/2025 while upgrading to React 17 */}
//import ReactTooltip from 'react-tooltip';

//component used by L.Subashini 13/12/2025 while upgrading to React 17 */}
//Commenting unused import
//import { Tooltip } from 'react-tooltip';


import ConfirmMessage from '../../components/confirm-alert/confirm-message.component';
import messages_ru from '../../assets/translations/ru.json';
import messages_tg from '../../assets/translations/tg.json';
import SimpleGridWithSelection from './SimpleGridWithSelection';

import SingleSelectionDataGrid from './SingleSelectionDataGrid';
import { fileViewUrl } from '../../rsapi';

import DataGrid from '../../components/data-grid/data-grid.component';

const messages = {
    'en-US': messages_en,
    'ru-RU': messages_ru,
    'tg-TG': messages_tg,
    //ALPD-5196 ADDed by Neeraj -All masters screens > Filter is in multi Language
    'ko-KR': messages_ko,
    'fr-FR': messages_fr,
    'id-ID': messages_id,
    'de-DE': messages_de
}

class DataGridWithMultipleGrid extends React.Component {

    _pdfExport;
    _excelExport;
    constructor(props) {
        super(props);
        this.myRef = React.createRef();
        this.confirmMessage = new ConfirmMessage();
        // this.state = { status: false }
        this.state = {
            showChild: true,
            arr: [],
            change: false,
            check: false,
            status: false,
            count: 0
        }

    }
    detailBand = (props) => {
        return (
            <Row bsPrefix="margin_class">
                <Col md={12}>
                    {this.props.hasChild && this.props.needSubSample ?
                        <SimpleGridWithSelection
                            ref={foo1 => this.foo1 = foo1}
                            //handleChange={this.expandData.bind(this)}
                            extractedColumnList={this.props.childColumnList}
                            dataState={this.props.dataState}
                            childList={props.dataItem ? this.props.childList[(props.dataItem[this.props.childMappingField])] || []
                                : this.props.childList[(props[this.props.childMappingField])] || []}
                            childDataResult={this.props.childDataResult}
                            childSelectionChange={this.props.childSelectionChange}
                            headerSelectionChange={this.props.childHeaderSelectionChange}
                            selectAll={this.props.childSelectAll}
                            hasSubChild={this.props.hasSubChild}
                            subChildDataResult={this.props.subChildDataResult && this.props.subChildDataResult || []}
                            subChildColumnList={this.props.subChildColumnList}
                            expandField="expanded"
                            childHandleExpandChange={this.props.childHandleExpandChange}
                            subChildSelectionChange={this.props.subChildSelectionChange}
                            subChildList={this.props.subChildList || []}
                            subChildMappingField={this.props.subChildMappingField}
                            subChildHeaderSelectionChange={this.props.subChildHeaderSelectionChange}
                            subChildSelectAll={this.props.subChildSelectAll}
                            selectedsubcild={this.props.selectedsubcild}
                        />
                        : 
                        // ALPDJ21-69--Added by Vignesh(02-09-2025)--Test wise release
                        this.props.hasTestBased?
                        <DataGrid
                                primaryKeyField={this.props.childMappingField}
                                data={this.props.childList}
                                dataResult={props.dataItem ? process(this.props.childList[(props.dataItem[this.props.childMappingField])],{
                                skip: 0,
                                take: this.props.childList.length
                                }) || []
                                :  process(this.props.childList[(props[this.props.childMappingField])],{skip: 0,
                                take: this.props.childList.length}) || [] }
                                 dataState={this.props.childDataState}
                                extractedColumnList={this.props.childColumnList}
                                expandField="expanded"
                            /> 
                        
                        :this.props.hasSubChild ?
                            <SingleSelectionDataGrid
                                hasSubChild={this.props.hasSubChild}
                                subChildDataResult={this.props.subChildDataResult && this.props.subChildDataResult || []}
                                subChildColumnList={this.props.subChildColumnList}
                                subChildSelectionChange={this.props.subChildSelectionChange}
                                subChildList={props.dataItem ? this.props.subChildList[(props.dataItem[this.props.subChildMappingField])] || []
                                    : this.props.subChildList[(props[this.props.subChildMappingField])] || []}
                                subChildHeaderSelectionChange={this.props.subChildHeaderSelectionChange}
                                subChildSelectAll={this.props.subChildSelectAll}
                                selectedsubcild={this.props.selectedsubcild}
                                subChildMappingField={this.props.subChildMappingField}
                                extractedColumnList={this.props.subChildColumnList}



                            /> : ""
                            
                            }
                </Col> </Row>
        )
    }
    expandChange = (event) => {
        let arrayfalse = []
        let change = []

        const isExpanded =
            event.dataItem.expanded === undefined ?
                event.dataItem.aggregates : event.dataItem.expanded;

        // ALPDJ21-69--Added by Vignesh(02-09-2025)--Test wise release
        if (this.props.screenName === "IDS_ADDTEST") {
            if (this.props.hasChild && event.value === true) {
                event.dataItem.expanded = !isExpanded;

                Object.values(this.props.childList).forEach(item => {
                    if(event.dataItem.ntransactiontestcode===item.ntransactiontestcode)
                        item['expanded'] = true
                    })
            }
            else {
                event.dataItem.expanded = !isExpanded;
                arrayfalse.push(event.dataItem)
                change = false
                this.setState({ isExpanded, arrayfalse });
            }
        } else {
            if (this.props.hasChild && event.value === true) {
                event.dataItem.expanded = !isExpanded;

                Object.values(this.props.childList).forEach(item => {
                    item.map(item1 => {
                        item1['expanded'] = true
                    })
                })
            }
            else {
                event.dataItem.expanded = !isExpanded;
                arrayfalse.push(event.dataItem)
                change = false
                this.setState({ isExpanded, arrayfalse });
            }
        }
        let parentData =
            this.props.dataResult.data ? this.props.dataResult.data.every(item => {
                return item.expanded === true
            }) : this.props.dataResult.every(item => {
                return item.expanded === true
            })

        if (parentData === true) {
            change = true
        }
        else {
            change = false
        }
        this.props.expandFunc({ change: change });


    }

    columnProps(field) {
        if (!this.props.hideColumnFilter) {
            return {
                field: field,
                columnMenu: ColumnMenu,
                headerClassName: this.isColumnActive(field, this.props.dataState) ? 'active' : ''
            };
        }
    }

    isColumnActive(field, dataState) {
        return GridColumnMenuFilter.active(field, dataState.filter)
    }
    expandData() {
        let change = []
        if (this.props.Login.checkFlag === undefined || this.props.Login.checkFlag === "1"
            //|| this.props.Login.count === 0
        ) {

            let data = this.props.dataResult.data.every(item => {
                return item.expanded === true
            })
            if (data === false) {
                this.props.dataResult.data.map((item, i) => {
                    if ((item['expanded'] === undefined) || (item['expanded'] !== true)) {
                        item['expanded'] = true
                        if (this.props.childList[(item[this.props.childMappingField])] != undefined) {
                            this.props.childList[(item[this.props.childMappingField])].map((item1, x) => {
                                this.props.childList[(item[this.props.childMappingField])][x]['expanded'] = true
                            })
                        }
                        change = true
                    }
                })
            }
            else {
                if (this.state.arrayfalse && this.state.arrayfalse.length !== 0 && this.props.Login.change === false) {
                    this.state.arrayfalse.map(item => {
                        item['expanded'] = true

                        change = true

                    })
                }
                else {
                    this.props.dataResult.data.map((item, i) => {
                        item['expanded'] = false
                        if (this.props.childList[(item[this.props.childMappingField])] != undefined) {

                            this.props.childList[(item[this.props.childMappingField])].map((item1, x) => {
                                this.props.childList[(item[this.props.childMappingField])][x]['expanded'] = false
                            })
                        }
                        change = false
                    })
                }
            }
        }
        else {
            if (this.props.Login.childfalsearray && this.props.Login.childfalsearray !== 0) {
                this.props.Login.childfalsearray.map(item =>
                    item['expanded'] = true

                )
                change = true

            }
            if (this.state.arrayfalse && this.state.arrayfalse.length !== 0 && this.props.Login.change === false) {
                this.state.arrayfalse.map(item => {
                    item['expanded'] = true
                    change = true

                })
            }
        }
        // if (this.props.Login.count === 0) {
        //  change=true        }
        this.props.expandFunc({ change: change })
    }

    allData = (props) => {
        props.map(item => {

        })
    }
    render() {
        // console.log("selectiongrid", this.props.subChildList)
        // console.log("selectiongrid1", this.props)


        const methodUrl = this.props.methodUrl ? this.props.methodUrl : (this.props.inputParam && this.props.inputParam.methodUrl);
        const regenerateId = this.props.controlMap && this.props.controlMap.has("RegenerateReleaseFile")
            && this.props.controlMap.get("RegenerateReleaseFile").ncontrolcode;
        const downloadId = this.props.controlMap && this.props.controlMap.has("DownloadReleaseFile")
            && this.props.controlMap.get("DownloadReleaseFile").ncontrolcode;
        const releaseId = this.props.controlMap && this.props.controlMap.has("COA".concat(methodUrl))
            && this.props.controlMap.get("COA".concat(methodUrl)).ncontrolcode;
        const expandId = this.props.controlMap && this.props.controlMap.has("ReleaseExpand")
            && this.props.controlMap.get("ReleaseExpand").ncontrolcode;
        const collapseId = this.props.controlMap && this.props.controlMap.has("ReleaseCollapse")
            && this.props.controlMap.get("ReleaseCollapse").ncontrolcode;
        const pageSizes = this.props.pageSizes ? this.props.pageSizes : this.props.Login.settings && this.props.Login.settings[15].split(",").map(setting => parseInt(setting))
        return (
            <>
                {/* <ReactTooltip place="bottom" id="tooltip-grid-wrap" globalEventOff='click' /> */}
                <AtTableWrap className="at-list-table" actionColWidth={this.props.actionColWidth ? this.props.actionColWidth : "150px"} >
                    <LocalizationProvider language={this.props.Login.userInfo.slanguagetypecode}>

                        <Grid ref={foo => this.foo = foo}
                            className={((this.props.dataResult && this.props.dataResult.length > 0) || (this.props.extractedColumnList && this.props.extractedColumnList.length > 0)) ? "active-paging" : "no-paging"}
                            style={{ height: this.props.gridHeight, width: this.props.gridWidth }}
                            sortable
                            resizable
                            reorderable={false}
                            scrollable={this.props.scrollable}
                            pageable={this.props.pageable ? { buttonCount: 5, pageSizes: pageSizes, previousNext: false } : ""}
                            groupable={this.props.groupable ? true : false}
                            detail={this.props.hideDetailBand ? false : this.detailBand}
                            expandField={this.props.expandField}
                            onExpandChange={this.expandChange}
                            data={this.props.dataResult}
                            total={this.props.total}
                            {...this.props.dataState}
                            selectedField="selected"
                            onRowClick={this.props.handleRowClick}
                            onSelectionChange={this.props.selectionChange}
                            onHeaderSelectionChange={this.props.headerSelectionChange}
                            onDataStateChange={this.props.dataStateChange}
                            selectable={{
                                enabled: true,
                                drag: false,
                                cell: false,
                                mode: 'multiple'
                            }}
                        >
                            <GridNoRecords>
                                {this.props.intl.formatMessage({ id: "IDS_NORECORDSAVAILABLE" })}
                            </GridNoRecords>
                            {this.props.isToolBarRequired ?
                                <GridToolbar>
                                    {/* {this.props.isExpandRequired === true ?

                                        <Nav.Link className="p-0" name="gridexpand" onClick={() => this.expandData()}>
                                            {this.props.intl.formatMessage({
                                                id: this.props.Login.change ? "IDS_COLLAPSE" : "IDS_EXPAND"

                                            })}
                                        </Nav.Link>

                                        : ""} */}
                                    {this.props.isExpandRequired === true ?
                                        <button className="btn btn-primary btn-padd-custom" href="#" style={{ marginRight: "8px" }}
                                            //    data-for="tooltip_list_wrap"
                                            onClick={() => this.expandData()} >

                                            {this.props.intl.formatMessage({
                                                id: this.props.Login.change ? "IDS_COLLAPSE" : "IDS_EXPAND"

                                            })}                                                                </button>
                                        : ""}
                                    {this.props.isDownloadRequired === true ?
                                        <button className="btn btn-primary btn-padd-custom" href="#" style={{ marginRight: "8px" }}
                                            //    data-for="tooltip_list_wrap"
                                            onClick={() => this.downloadData()} >

                                            {/*this.props.intl.formatMessage({
                                                id: this.props.Login.change ? "IDS_COLLAPSE" : "IDS_EXPAND"

                                            })*/}
                                            {this.props.intl.formatMessage({
                                                id: "IDS_DOWNLOADFILE"

                                            })}                                                                </button>
                                        : ""}
                                    {this.props.isReleaseRequired === false ? "" :
                                        <Button className="btn btn-icon-rounded btn-circle solid-blue" variant="link"
                                            data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_RELEASE" })}
                                            data-for="tooltip-grid-wrap"
                                            hidden={this.props.userRoleControlRights && this.props.userRoleControlRights.indexOf(releaseId) === -1}
                                            onClick={() => this.props.releaseRecord({ userInfo: this.props.userInfo })}>
                                            <FontAwesomeIcon icon={faRocket} />
                                        </Button>
                                    }
                                    {this.props.isRefreshRequired === false ? "" :
                                        <Button className="btn btn-circle outline-grey p-2" variant="link"
                                            data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_REFRESH" })}
                                            data-for="tooltip-grid-wrap"
                                            onClick={() => this.props.reloadData()}>
                                            <RefreshIcon className="custom_icons" />
                                        </Button>
                                    }
                                </GridToolbar>
                                : ""}
                            {this.props.isCheckBoxRequired === true ?
                                <Column

                                    field="selected"
                                    //    width="45px"
                                    title={this.props.title}
                                    //    headerSelectionValue={false}
                                    headerSelectionValue={this.props.dataResult.data && this.props.dataResult.data.length === 0 ? false : this.props.dataResult.data && this.props.dataResult.data.every((data) => {
                                        return data.selected === true
                                    }) ? true : false} />
                                : ""

                            }

                            {this.props.extractedColumnList.map((item, index) =>
                                <Column key={index}
                                    title={this.props.intl.formatMessage({ id: item.idsName })}
                                    //  {...this.columnProps(item.dataField)}
                                    width={item.width}
                                    cell={(row) => (
                                        <td data-tooltip-id="my-tooltip" data-tooltip-content={row["dataItem"][item.dataField]}>
                                            {item.isIdsField ?
                                                <FormattedMessage id={row["dataItem"][item.dataField]} defaultMessage={row["dataItem"][item.dataField]} />
                                                : row["dataItem"][item.dataField]}
                                        </td>
                                    )} />
                            )}

                            {this.props.isActionRequired ?
                                <GridColumn
                                    locked
                                    headerClassName="text-center"
                                    title={this.props.intl.formatMessage({ id: 'IDS_ACTION' })}
                                    sort={false}
                                    cell={(row) => (

                                        row.rowType === "groupHeader" ? null :
                                            <td className={`k-grid-content-sticky k-command-cell selectedId === row["dataItem"][this.props.primaryKeyField] ? 'active' : ''`} style={{ left: '0', right: '0', borderRightWidth: '1px', textAlign: 'center' }}>
                                                <>
                                                    <Nav.Link>
                                                        <FontIconWrap className="d-font-icon action-icons-wrap"
                                                            //hidden={this.props.userRoleControlRights && this.props.userRoleControlRights.indexOf(downloadId) === -1}
                                                            onClick={() => this.props.viewDownloadFile({ ...this.props.masterdata, ...this.props.downloadParam, inputData: { ...row["dataItem"], userinfo: this.props.Login.userInfo }, userinfo: this.props.Login.userInfo, ncontrolCode: downloadId }, row)}
                                                            data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_PREVIEW" })} data-place="left"
                                                        //  data-for="tooltip-grid-wrap"
                                                        >
                                                            <FontAwesomeIcon icon={faCloudDownloadAlt}
                                                            />
                                                        </FontIconWrap>
                                                        <FontIconWrap className="d-font-icon action-icons-wrap"
                                                            hidden={this.props.userRoleControlRights && this.props.userRoleControlRights.indexOf(regenerateId) === -1}
                                                            onClick={() => this.props.regnerateFile({ ...this.props.masterdata, ...this.props.downloadParam, inputData: { ...row["dataItem"], userinfo: this.props.Login.userInfo }, userinfo: this.props.Login.userInfo, ncontrolCode: downloadId }, row)}
                                                            data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_REGENERATEFILE" })} data-place="left"
                                                        //  data-for="tooltip-grid-wrap"
                                                        >
                                                            <FontAwesomeIcon icon={faRecycle}
                                                            />
                                                        </FontIconWrap>
                                                    </Nav.Link>
                                                </>

                                            </td>
                                    )}
                                /> : ""}
                        </Grid>
                    </LocalizationProvider >

                </AtTableWrap >
            </>
        );
    }

    /* component commented by L.Subashini 13/12/2025 while upgrading to React 17 */
    // componentDidUpdate() {
    //     ReactTooltip.rebuild();
    // }

    downloadData() {
        let sfileurl = fileViewUrl() + this.props.Login.sfilepath;
        // console.log(sfileurl);
        //ncoahistorycode, 
        let filedata = {
            ncoahistorycode: this.props.Login.ncoahistorycode,
            ssystemfilename: this.props.Login.ssystemfilename
        }
        this.viewCOAHistoryFile(filedata);
        //this.handleDownload(sfileurl, this.props.Login.sfilepath)
        //this.pdfDownload(sfileurl)
    }
    viewCOAHistoryFile = (filedata) => {
        const inputParam = {
            inputData: {
                COAHistoryFile: filedata,
                userinfo: this.props.userInfo
            },
            classUrl: "coarelease",
            operation: "view",
            methodUrl: "AttachedCOAHistoryFile",
            screenName: "IDS_TEST"
        }
        this.props.viewAttachment(inputParam);
    }
    /*pdfDownload = (id) => {
        axios({
            url: id,
            method: 'GET',
            responseType: 'blob', // important
          }).then((response) => {
            const url = window.URL.createObjectURL(response.data));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'file.pdf');
            document.body.appendChild(link);
            link.click();
          });
    };*/
    /*
        handleDownload = (url, filename) => {
            Axios.get(url, {
              responseType: 'blob',
            })
            .then((res) => {
              js-file-downloa(res.data, filename)
            })
          }*/
}
const mapStateToProps = state => {
    return ({ Login: state.Login })
}



export default connect(mapStateToProps, { updateStore, viewAttachment })(injectIntl(DataGridWithMultipleGrid));