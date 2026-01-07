import * as React from 'react';
import 'hammerjs';

import {
    Chart,
    ChartSeries,
    ChartSeriesItem,
    ChartValueAxis,
    ChartValueAxisItem,
    ChartCategoryAxis,
    ChartCategoryAxisItem
} from '@progress/kendo-react-charts';

const generateSeries = () => {
    const series = [];

    for (let idx = 0; idx < 10000; idx++) {
        series.push({
            value: Math.floor(Math.random() * 100) + 1,
            category: new Date(2000, 0, idx)
        });
    }

    return series;
};

class BarChart extends React.Component {
    state = {
        series: generateSeries(),
        categoryAxisMax: new Date(2000, 1, 0),
        categoryAxisMaxDivisions: 10
    }

    render() {
        const { series, categoryAxisMax, categoryAxisMaxDivisions } = this.state;

        return (
            <Chart pannable={true}>
                <ChartCategoryAxis>
                    <ChartCategoryAxisItem max={categoryAxisMax} maxDivisions={categoryAxisMaxDivisions} />
                </ChartCategoryAxis>
                <ChartValueAxis>
                    <ChartValueAxisItem labels={{ visible: true, format: '#.00' }} />
                </ChartValueAxis>
                <ChartSeries>
                    <ChartSeriesItem data={series} field="value" categoryField="category" />
                </ChartSeries>
            </Chart>
        );
    }
}

export default BarChart;
