import React from 'react';
import { Chart, ChartTitle, ChartLegend, ChartSeries, ChartSeriesItem, ChartCategoryAxis, ChartCategoryAxisItem, ChartTooltip } from '@progress/kendo-react-charts';
import { injectIntl } from 'react-intl';



class ColumnChart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [], masterStatus: "", error: "", selectedRecord: {}
        }
    }

    render() {
        let Series = [];
        if(this.props.ySeries != undefined){
        this.props.ySeries.map(item =>  {
            Series.push(<ChartSeriesItem type="column" line={{ style: "smooth" }} data={item.Series} name={item.yField} color={item.colors} aggregate="count" stack={true} gap={1.5} overlay={false} />);
        
        })}
        return (
            <>
                <Chart renderAs="canvas" pannable={true} zoomable={true}>
                    <ChartTooltip />
                    <ChartTitle
                    // text={this.state.ChartTitle} 
                    />
                    <ChartLegend position="bottom" orientation="horizontal" />
                    <ChartCategoryAxis>
                        <ChartCategoryAxisItem labels={{ rotation: "auto" }} categories={this.props.xSeries} 
                        // title={{ text: this.state.MonthNew }} 
                        />
                    </ChartCategoryAxis>

                    <ChartSeries>
                        {Series}
                    </ChartSeries>
                </Chart>
            </>

        );
    }

}

export default injectIntl(ColumnChart);