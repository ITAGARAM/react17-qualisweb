import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { AtTableWrap } from '../../components/data-grid/data-grid.styles';
import { Grid, GridColumn, GridColumnMenuFilter,GridNoRecords} from '@progress/kendo-react-grid';
import { faGripVertical } from '@fortawesome/free-solid-svg-icons';
import { Draggable } from 'react-drag-and-drop';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ColumnMenu from '../../components/data-grid/ColumnMenu';

class SqlBuilderTableGrid extends Component {
    constructor(props) {
        super(props);
    }
    shouldComponentUpdate(nextProps, nextState) {
        if((this.props.selectedRecord.ssqlqueryname!==nextProps.selectedRecord.ssqlqueryname) ||
        (this.props.selectedRecord.ssqlquery!==nextProps.selectedRecord.ssqlquery)){
        return false
        }else{
            return true;
          }
        }
    render() {
        return (
           
              <AtTableWrap className="at-list-table">
                                <Grid
                                    style={this.props.style}
                                    data={this.props.data}
                                    onDataStateChange={this.props.onDataStateChange}
                                    dataState={this.props.dataState}
                                    detail={this.props.detail}
                                    expandField={this.props.expandField}
                                    onExpandChange={this.props.onExpandChange}
                                    //pageable={this.props.pageable}
                                //data={process(this.props.tableList, this.props.dataStateTable)}

                                >
                                      <GridNoRecords>
                                    {this.props.intl.formatMessage({ id: "IDS_NORECORDSAVAILABLE" })}
                                </GridNoRecords>
                                    <GridColumn
                                        width="48px"
                                        cell={(row) => (
                                            <td >
                                                <Draggable type="dragtable" data={row.dataItem.tableName + " \"" + row.dataItem.stabledisplayname + "\""}>
                                                    <FontAwesomeIcon icon={faGripVertical} className="dragicon"></FontAwesomeIcon>
                                                </Draggable>
                                            </td>
                                        )}
                                    />

                                    <GridColumn
                                        width={"425px"}
                                        field="stabledisplayname"
                                        {...this.columnProps("stabledisplayname")}
                                        title={this.props.intl.formatMessage({ id: "IDS_TABLE_NAME" })}
                                    />
                                </Grid>
                            </AtTableWrap>
    
        );

    } 
    columnProps(field) {
        if (!this.props.hideColumnFilter) {
            return {
                field: field,
                columnMenu: ColumnMenu,
                headerClassName: this.isColumnActive(field, this.props.onDataStateChange) ? 'active' : ''
            };
        }
    }

    isColumnActive(field, dataState) {
        return GridColumnMenuFilter.active(field, dataState.filter)
    }
}
export default (injectIntl(SqlBuilderTableGrid));
