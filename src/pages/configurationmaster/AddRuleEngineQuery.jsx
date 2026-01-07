import React, { Component } from 'react';//createRef
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Row, Col } from 'react-bootstrap';
import { Grid, GridColumn, GridColumnMenuFilter } from '@progress/kendo-react-grid';
import { Draggable, Droppable } from 'react-drag-and-drop';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGripVertical } from '@fortawesome/free-solid-svg-icons';
import FormInput from '../../components/form-input/form-input.component';
import FormTextarea from '../../components/form-textarea/form-textarea.component';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component'
import {
    callService, crudMaster, validateEsignCredential, updateStore, getSQLQueryDetail,
    getSQLQueryComboService, filterColumnData, comboChangeQueryType, executeUserQuery, comboColumnValues, getColumnNamesByTableName
} from '../../actions';
import { AtTableWrap } from '../../components/data-grid/data-grid.styles';
import { process } from '@progress/kendo-data-query';
import ColumnMenu from '../../components/data-grid/ColumnMenu';
import { tableType,queryTypeFilter} from '../../components/Enumeration';


class AddQuery extends Component {
    constructor(props) {
        super(props);
        this.state = ({
            dataStateTable: { skip: 0 },
        });

    }
    tableDataStateChange = (event) => {
        this.setState({
            dataStateTable: event.dataState
        });
    }
    expandChange = (event) => {
        event.dataItem.expanded = !event.dataItem.expanded;
        this.forceUpdate();
    }

    detailBand = (props) => {
        const columnName = this.props.tableList.filter(p => p.stable === props.dataItem.tableName)

        return (
            <Grid
                data={columnName}
                //resizable
                //scrollable={"scrollable"}
            >

                <GridColumn
                    width="48px"
                    cell={(row) => (
                        <td>
                            <Draggable type={'dragcolumn'} data={row.dataItem.stable + "." + row.dataItem.scolumn}>
                                <FontAwesomeIcon icon={faGripVertical} className="dragicon" />
                            </Draggable>
                        </td>
                    )}
                />

                <GridColumn
                    width={"336px"}
                    field="scolumn"
                    title={this.props.intl.formatMessage({ id: "IDS_COLUMN_NAME" })}
                />

            </Grid>
        );
    }
    columnProps(field) {
        if (!this.props.hideColumnFilter) {
            return {
                field: field,
                columnMenu: ColumnMenu,
                headerClassName: this.isColumnActive(field, this.state.dataStateTable) ? 'active' : ''
            };
        }
    }

    isColumnActive(field, dataState) {
        return GridColumnMenuFilter.active(field, dataState.filter)
    }

    render() {
        return (
            <Row>
                <Col md={6}>
                    <Row>
                        <Col md={12}>
                        <FormSelectSearch
                        name={"ntabletypecode"}
                        formLabel={this.props.intl.formatMessage({ id: "IDS_TABLETYPE" })}
                        isSearchable={false}
                        isDisabled={false}
                        isMulti={false}
                        placeholder="Please Select..."
                        isMandatory={true}
                        options={this.props.tableType}
                        // optionId='ntabletypecode'
                        // optionValue='stabletype'
                        defaultValue={this.props.selectedTableType["ntabletypecode"]}
                        showOption={true}
                        required={true}
                        value={this.props.selectedTableType["ntabletypecode"] ? this.props.selectedTableType["ntabletypecode"] : ""}
                        closeMenuOnSelect={true}
                        alphabeticalSort={true}
                        onChange={(event) => this.props.onComboChange(event, 'ntabletypecode')}
                        //  sortField={"ntabletypecode"}
                        //  sortOrder={"ascending"}

                    >
                    </FormSelectSearch>
                    {this.props.tableTypeCode === tableType.ALL ? "":
                    <FormSelectSearch
                        name={"nformcode"}
                        formLabel={this.props.intl.formatMessage({ id: this.props.tableTypeCode === tableType.MODULES ? "IDS_MODULENAME": this.props.tableTypeCode === tableType.FORMS ? "IDS_FORMNAME" : "IDS_FORMNAME" })}
                        isSearchable={true}
                        isDisabled={this.props.tableTypeCode === tableType.ALL ? true : false}
                        isMulti={false}
                        placeholder="Please Select..."
                        isMandatory={true}
                        options={this.props.moduleFormName || [] }
                        optionId='nformcode'
                        optionValue='sformname'
                        defaultValue={this.props.selectedRecord["nformcode"]}
                        showOption={true}
                        required={true}
                        value={this.props.selectedRecord["nformcode"] ? this.props.selectedRecord["nformcode"] : ""}
                        closeMenuOnSelect={true}
                        //alphabeticalSort={true}
                        onChange={(event) => this.props.onComboChange(event, 'nformcode')}
                         //sortField={"nformcode"}
                         //sortOrder={"ascending"}

                    >
                    </FormSelectSearch>
                    }
                            <AtTableWrap className="at-list-table">
                                <Grid
                                    style={{ height: '600px' }}
                                    data={process(this.props.tableName, this.state.dataStateTable)}
                                    //{...this.dataStateTable}
                                    onDataStateChange={this.tableDataStateChange}
                                    dataState={this.state.dataStateTable}
                                    detail={this.detailBand}
                                    expandField="expanded"
                                    onExpandChange={this.expandChange}
                                //data={process(this.props.tableList, this.props.dataStateTable)}

                                >
                                    <GridColumn
                                        width="48px"
                                        cell={(row) => (
                                            <td >
                                                <Draggable type="dragtable" data={row.dataItem.tableName}>
                                                    <FontAwesomeIcon icon={faGripVertical} className="dragicon"></FontAwesomeIcon>
                                                </Draggable>
                                            </td>
                                        )}
                                    />

                                    <GridColumn
                                        width={"425px"}
                                        field="tableName"
                                        {...this.columnProps("tableName")}
                                        title={this.props.intl.formatMessage({ id: "IDS_TABLE_NAME" })}
                                    />
                                </Grid>
                            </AtTableWrap>
                        </Col>
                    </Row>
                </Col>

                <Col md={6}>
                    <Row>
                        <Col md={12}>
                            <FormInput
                                name={"ssqlqueryname"}
                                label={this.props.intl.formatMessage({ id: "IDS_SQLQUERYNAME" })}
                                type="text"
                                onChange={(event) => this.props.onInputOnChange(event)}
                                placeholder={this.props.intl.formatMessage({ id: "IDS_SQLQUERYNAME" })}
                                value={this.props.selectedRecord["ssqlqueryname"]}
                                isMandatory={true}
                                required={true}
                                maxLength={100}

                            />

                            <Droppable
                                types={['dragcolumn', 'dragtable']}
                                onDrop={event => this.props.onDrop(event)}
                            >

                                <FormTextarea
                                    name={"ssqlquery"}
                                    label={this.props.intl.formatMessage({ id: "IDS_SQLQUERY" })}
                                    onChange={(event) => this.props.onInputOnChange(event)}
                                    placeholder={this.props.intl.formatMessage({ id: "IDS_SQLQUERY" })}
                                    value={this.props.selectedRecord["ssqlquery"]}
                                    rows={15}
                                    isMandatory={true}
                                    required={true}
                                    maxLength={10000}
                                />
                            </Droppable>


                            {/* {this.props.queryTypeCode === 12 &&
                                <FormInput
                                    name={"sscreenrecordquery"}
                                    label={this.props.intl.formatMessage({ id: "IDS_SCREENRECORDQUERY" })}
                                    type="text"
                                    onChange={(event) => this.props.onInputOnChange(event)}
                                    placeholder={this.props.intl.formatMessage({ id: "IDS_SCREENRECORDQUERY" })}
                                    value={this.props.selectedRecord["sscreenrecordquery"]}
                                    isMandatory={true}
                                    required={true}
                                    maxLength={100}
                                    isDisabled={this.props.queryTypeCode === 2 ? false : true}
                                    isVisible={false}
                                />
                            } */}
                            {this.props.queryTypeCode ===  queryTypeFilter.LIMSALERTQUERY &&
                                <FormInput
                                    name={"sscreenheader"}
                                    label={this.props.intl.formatMessage({ id: "IDS_SCREENHEADER" })}
                                    type="text"
                                    onChange={(event) => this.props.onInputOnChange(event)}
                                    placeholder={this.props.intl.formatMessage({ id: "IDS_SCREENHEADER" })}
                                    value={this.props.selectedRecord["sscreenheader"]}
                                    isMandatory={true}
                                    required={true}
                                    maxLength={100}
                                    isDisabled={this.props.queryTypeCode === 2 ? false : true}
                                />
                            }
                            {this.props.queryTypeCode === queryTypeFilter.LIMSFILTERQUERY &&
                                <FormInput
                                    name={"svaluemember"}
                                    label={this.props.intl.formatMessage({ id: "IDS_SVALUEMEMBER" })}
                                    type="text"
                                    onChange={(event) => this.props.onInputOnChange(event)}
                                    placeholder={this.props.intl.formatMessage({ id: "IDS_SVALUEMEMBER" })}
                                    value={this.props.selectedRecord["svaluemember"]}
                                    isMandatory={true}
                                    required={true}
                                    maxLength={100}

                                />
                            }
                            {this.props.queryTypeCode === queryTypeFilter.LIMSFILTERQUERY &&
                                <FormInput
                                    name={"sdisplaymember"}
                                    label={this.props.intl.formatMessage({ id: "IDS_SDISPLAYMEMBER" })}
                                    type="text"
                                    onChange={(event) => this.props.onInputOnChange(event)}
                                    placeholder={this.props.intl.formatMessage({ id: "IDS_SDISPLAYMEMBER" })}
                                    value={this.props.selectedRecord["sdisplaymember"]}
                                    isMandatory={true}
                                    required={true}
                                    maxLength={100}

                                />
                            }
                            {this.props.queryTypeCode === queryTypeFilter.LIMSDASHBOARDQUERY &&
                                <FormSelectSearch
                                    name={"ncharttypecode"}
                                    formLabel={this.props.intl.formatMessage({ id: "IDS_CHARTTYPE" })}
                                    isSearchable={true}


                                    placeholder="Please Select..."
                                    isMandatory={true}
                                    options={this.props.chartList}
                                    optionId='ncharttypecode'
                                    optionValue='schartname'
                                    value={this.props.selectedRecord["ncharttypecode"]}
                                    defaultValue={this.props.selectedRecord["ncharttypecode"]}

                                    onChange={(event) => this.props.onComboChange(event, 'ncharttypecode')}
                                    closeMenuOnSelect={true}
                                    alphabeticalSort={true}
                                    isDisabled={this.props.queryTypeCode === 1 ? false : true}
                                />
                            }
                        </Col>
                    </Row>
                </Col>
            </Row>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        Login: state.Login
    }
}

export default connect(mapStateToProps, {
    callService, crudMaster, updateStore, filterColumnData, validateEsignCredential, getSQLQueryDetail, getSQLQueryComboService, comboChangeQueryType, executeUserQuery, comboColumnValues, getColumnNamesByTableName
})(injectIntl(AddQuery));