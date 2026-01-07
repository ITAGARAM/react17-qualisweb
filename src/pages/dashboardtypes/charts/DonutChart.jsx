import React from 'react';
import { Chart, ChartLegend, ChartSeries, ChartSeriesItem, ChartSeriesLabels, ChartTooltip } from '@progress/kendo-react-charts';
import { PDFExport } from "@progress/kendo-react-pdf";
import { injectIntl } from 'react-intl';

class DonutChart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [], masterStatus: "", error: "", selectedRecord: {}
        }
    }

    exportPDF = () => {
        this.pdfExportComponent.save();
    }

    render() {
        // const labelContent = (e) => (e.category);
        const labelContent = (e) => (`${ e.category }: \n ${e.value}`);
        const renderTooltip = (context) => {
            const { category, series, value } = context.point || context;
            return (<div>{category} ({series.name}): {value}</div>);
        };
    
        return (
            <>
                <PDFExport
                    ref={component => (this.pdfExportComponent = component)}
                    paperSize="auto"
                    margin={40}
                >
                    <Chart style={this.props.style} onSeriesClick={(item) => this.props.chartItemClick(item)}>
                    <ChartTooltip render={renderTooltip} />
                    <ChartLegend position="bottom" />
                        <ChartSeries>
                            <ChartSeriesItem autoFit="autofit" type="donut" data={this.props.chartData} categoryField="stransdisplaystatus" field="statuscount" >
                                {/* <ChartSeriesLabels color="#fff" background="none" content={labelContent} /> */}
                                <ChartSeriesLabels position="outsideEnd" background="none" content={labelContent} />
                            </ChartSeriesItem>
                        </ChartSeries>                       
                    </Chart>
                </PDFExport>
            </>
        );
    }

}

export default injectIntl(DonutChart);