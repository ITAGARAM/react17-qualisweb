import React from 'react';
import { Filter,  Pager} from "@progress/kendo-react-data-tools";
import { Grid, GridColumn, GridColumnMenuFilter } from "@progress/kendo-react-grid";
import { filterBy } from '@progress/kendo-data-query';
import { LocalizationProvider } from '@progress/kendo-react-intl';
import ColumnMenu from '../../components/data-grid/ColumnMenu';

class KendoDatatoolFilter extends React.Component {
  // constructor(props) {
  //   super(props);
  // }

  columnProps(field) {
    if (!this.props.hideColumnFilter) {

      const returntype = {
        field: field,
        columnMenu: ColumnMenu,
        //  headerClassName: this.isColumnActive(field, this.props.dataState) ? 'active' : ''
      }
      return returntype;
    }
  }

  isColumnActive(field, dataState) {
    return GridColumnMenuFilter.active(field, dataState.filter)
  }
  // ALPD-4130 Additional filter parent call back handler to pass on filtered data and filter upon blur event ATE-241
  parentCallBack(data, filter) {
    this.props.parentCallBack(data, filter);
  }

  render() {

    const data = filterBy(this.props.filterData, this.props.filter)
    return (
      <React.Fragment>
        <LocalizationProvider language={this.props.userInfo.slanguagetypecode} >

          {/* ALPD-4130 Additional filter on Blur event handler to pass filtered data to parent */}
          <div className='kendo-filter-block' onBlur={this.props.needParentCallBack ? () => this.parentCallBack(data, this.props.filter) : ""} tabindex="0" contentEditable >
            <Filter
              value={this.props.filter}
              onChange={this.props.handleFilterChange}
              fields={this.props.fields}
            />
          </div>


          {!this.props.static ?
            <hr /> : ""}
          {!this.props.static ?
            <Grid
              style={{
                maxHeight: "400px",
              }}
              onRowClick={this.props.onRowClick}
              data={data.slice(this.props.skip, this.props.skip + this.props.take)}
            >
              {this.props.gridColumns.map(x => {

                return <GridColumn   {...this.columnProps(x.field)} field={x.field} title={x.title} width={x.width} />

              })}

              {/* <GridColumn field="UnitPrice" title="Price" />
              <GridColumn field="Discontinued" title="Discontinued" /> */}
            </Grid> : ""}

          {!this.props.static ?
            <hr /> : ""}
          {!this.props.static ? <Pager
            skip={this.props.skip}
            take={this.props.take}
            type="input"
            previousNext={true}
            total={data.length}
            onPageChange={this.props.handlePageChange}
          /> : ""}

        </LocalizationProvider>

      </React.Fragment>
    );
  }
}
export default KendoDatatoolFilter;