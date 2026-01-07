import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
//import { Grid, GridColumn as Column,GridNoRecords } from '@progress/kendo-react-grid';
import { Grid, GridColumn as Column, GridNoRecords, GridColumnMenuFilter } from '@progress/kendo-react-grid';
import { AtTableWrap, FontIconWrap } from '../data-grid/data-grid.styles';
import { loadMessages, LocalizationProvider } from '@progress/kendo-react-intl';
import ColumnMenu from './ColumnMenu';
import { process } from '@progress/kendo-data-query';
import { Col, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRemoveFormat, faTimes, faEye } from '@fortawesome/free-solid-svg-icons';
import { faClosedCaptioning } from '@fortawesome/free-regular-svg-icons';
import { connect } from 'react-redux';
import ConfirmMessage from '../../components/confirm-alert/confirm-message.component';

const mapStateToProps = state => {
    return ({ Login: state.Login })
}
class DataGridWithSelection extends React.Component {

    // BGSI-53  Added constructor for confirmmessage by Vishakh
    constructor(props) {
        super(props);
        this.confirmMessage = new ConfirmMessage();
    }

    columnProps(field) {
        if (this.props.dataState) {
            if (!this.props.hideColumnFilter) {
                const returntype = {
                    field: field,
                    columnMenu: ColumnMenu,
                    headerClassName: this.isColumnActive(field, this.props.dataState) ? 'active' : ''
                }
                return returntype;
            }
        }
    }

    isColumnActive(field, dataState) {
        return GridColumnMenuFilter.active(field, dataState.filter)
    }


    render() {
        const pageSizes = this.props.pageSizes ? this.props.pageSizes :
            this.props.Login.settings && this.props.Login.settings[4].split(",").map(setting => parseInt(setting));

        // BGSI-53  Added methrodurl abd deleteid for direct transform screen by Vishakh
        const methodUrl = this.props.methodUrl ? this.props.methodUrl : (this.props.inputParam && this.props.inputParam.methodUrl);
        const viewId = this.props.controlMap && this.props.controlMap.has("View".concat(methodUrl))
            && this.props.controlMap.get("View".concat(methodUrl)).ncontrolcode;
        return (
            <div>

                <AtTableWrap className="at-list-table">
                    <LocalizationProvider language={this.props.userInfo.slanguagetypecode}>
                        {/* <ReactTooltip place="bottom" globalEventOff='click' /> */}
                        <Row noGutters={true}>
                            <Col md="12">
                                <Grid   
                                    sortable
                                     //data={this.props.dataState ? process(this.props.dataResult || [],this.props.dataState) : this.props.dataResult}
                                     total={this.props.total}
                                    {...this.props.dataState}
                                    data={this.props.dataResult}
                                    style={ { height:this.props.gridHeight|| '400px' }}
                                    resizable
                                    selectedField="selected"
                                    onSelectionChange={this.props.selectionChange}
                                    onHeaderSelectionChange={this.props.headerSelectionChange}
                                    onRowClick={this.props.rowClick}
                                    onDataStateChange={this.props.dataStateChange}
                                    {...this.props.dataState}
                                    scrollable={this.props.scrollable}
                                    // pageable={true}
                                    pageable={this.props.pageable && this.props.dataResult && ((this.props.dataResult.length >0) || (this.props.dataResult.data && this.props.dataResult.data.length >0) )
                                        ? { buttonCount: 10, pageSizes: pageSizes, previousNext: false } : false}

                                >

                                    <GridNoRecords>
                                        {this.props.intl.formatMessage({ id: "IDS_NORECORDSAVAILABLE" })}
                                    </GridNoRecords>
                                    {!this.props.isHidemulipleselect ?
                                        <Column
                                            field="selected"
                                            width="50px"
                                            title={this.props.title}
                                            headerSelectionValue={this.props.selectAll}
                                        /> : ""}
                                    {this.props.extractedColumnList.map((item, index) =>
                                        <Column key={index}
                                            width={item.width}
                                            title={this.props.intl.formatMessage({ id: item.idsName })}
                                            {...this.columnProps(item.dataField)}
                                            cell={(row) => (
                                                <td data-tooltip-id="my-tooltip" data-tooltip-content={row["dataItem"][item.dataField]}>
                                                    {item.isIdsField ?
                                                        <FormattedMessage id={row["dataItem"][item.dataField]} defaultMessage={row["dataItem"][item.dataField]} />
                                                        : row["dataItem"][item.dataField]}
                                                </td>
                                            )} />
                                    )}
                                    {   // ADDed by Neeraj-ALPD-5136
                                        //WorkList Screen -> Including filter in Data selection Kendo Grid 
                                        //Command by neeraj
                                        //start
                                        this.props.isActionRequired ?
                                            <Column
                                                locked
                                                headerClassName="text-center"
                                                title={this.props.intl.formatMessage({ id: 'IDS_ACTION' })}
                                                sort={false}
                                                width="150px"
                                                cell={(row) => (
                                                    row.rowType === "groupFooter" ? null :
                                                        row.rowType === "groupHeader" ? null :
                                                            <td className={`k-grid-content-sticky k-command-cell pl-0 selectedId === row["dataItem"][this.props.primaryKeyField] ? 'active' : ''`} style={{ left: '0', right: '0', borderRightWidth: '1px', textAlign: 'center' }}>
                                                                <>
                                                                    <FontIconWrap className="d-font-icon action-icons-wrap"
                                                                        data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_REMOVE" })}
                                                                        data-place="top"
                                                                        // BGSI-53  Added hidden for handling this remove field in multiple screens by Vishakh
                                                                        hidden={this.props.removeNotRequired ? this.props.removeNotRequired : false}
                                                                        onClick={() => this.props.handleClickDelete(row)}
                                                                    >
                                                                        <FontAwesomeIcon icon={faTimes} />
                                                                    </FontIconWrap>
                                                                    {/* BGSI-53  Added IDS_DELETE for handling this IDS_DELETE field in multiple screens by Vishakh */}
                                                                    <FontIconWrap className="d-font-icon action-icons-wrap"
                                                                        data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_VIEW" })}
                                                                        data-place="left"
                                                                        // BGSI-53  Added by Vignesh(12-09-2025)-->View icon disbled when the userRoleControlRights undefined.
                                                                        //BGSI-SEP-98 ADDED BY JANAKUMAR-20-SEP-2025
                                                                        hidden={this.props.userRoleControlRights && 
                                                                            this.props.userRoleControlRights.indexOf(viewId) !== -1 ? false : true}
                                                                        onClick={() => this.props.fetchRecord({
                                                                            // ...this.props.treeView, primaryKeyValue: row["dataItem"][this.props.treeView.primaryKeyField], 
                                                                            treeView: row["dataItem"], ncontrolCode: viewId
                                                                        })}
                                                                    >
                                                                        <FontAwesomeIcon icon={faEye} />
                                                                    </FontIconWrap>
                                                                </>
                                                            </td>
                                                )} />
                                            : ""
                                        //--end
                                    }

                                </Grid>
                            </Col>
                        </Row>
                    </LocalizationProvider >
                </AtTableWrap>
            </div>
        );
    }

    // BGSI-53  Added handleDelete for handling this delete by Vishakh
    handleDelete = (deleteParam, row) => {
        this.confirmMessage.confirm("deleteMessage", this.props.intl.formatMessage({ id: "IDS_DELETE" }), this.props.intl.formatMessage({ id: "IDS_DEFAULTCONFIRMMSG" }),
            this.props.intl.formatMessage({ id: "IDS_OK" }), this.props.intl.formatMessage({ id: "IDS_CANCEL" }),
            () => this.props.deleteRecord(deleteParam, row));
    }
}

export default connect(mapStateToProps)(injectIntl(DataGridWithSelection));