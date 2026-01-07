import React from 'react';
import { AtTableWrap } from '../client-group.styles';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Grid, GridColumn, GridNoRecords } from '@progress/kendo-react-grid';
import { process } from '@progress/kendo-data-query';
// import ReactTooltip from 'react-tooltip';

class SimpleGrid extends React.Component {

    render() {
        return (

            <AtTableWrap className="at-list-table">
                {/* <ReactTooltip place="bottom" globalEventOff='click' id="tooltip-samplegrid-wrap" /> */}
                {/* <Tooltip openDelay={100} position="auto" tooltipClassName="ad-tooltip" anchorElement="element" parentTitle={true}> */}
                <Grid
                    sortable
                    resizable={true}
                    reorderable
                    data={process(this.props.childList, { skip: 0, take: this.props.childList.length })}>
                          <GridNoRecords>
                         {this.props.intl.formatMessage({ id: "IDS_NORECORDSAVAILABLE" })}
                        </GridNoRecords>
                        {this.props.extractedColumnList.map((item, index) =>
                        <GridColumn key={index}
                            title={this.props.intl.formatMessage({ id: item.idsName })}
                            cell={(row) => (
                                <td 
                                //data-for="tooltip-samplegrid-wrap"
                                    data-tooltip-id="my-tooltip" data-tooltip-content={row["dataItem"][item.dataField]}>
                                    {/* title={row["dataItem"][item.dataField]}> */}
                                    {item.isIdsField ? <FormattedMessage id={row["dataItem"][item.dataField]} defaultMessage={row["dataItem"][item.dataField]} />
                                        : row["dataItem"][item.dataField]}
                                </td>)}
                        />
                    )}
                </Grid>
                {/* </Tooltip>           */}
            </AtTableWrap>
        );
    }
}
export default injectIntl(SimpleGrid);