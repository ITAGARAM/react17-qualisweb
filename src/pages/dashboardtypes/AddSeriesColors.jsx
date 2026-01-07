import React from 'react';
import { ListWrapper, PrimaryHeader, HeaderName, AtTableWrap } from '../../components/client-group.styles'
import { FormattedMessage, injectIntl } from 'react-intl';
import { Row, Col } from 'react-bootstrap';
import { Grid, GridColumn } from '@progress/kendo-react-grid';
import { process } from '@progress/kendo-data-query';
import ColumnMenu from '../../components/data-grid/ColumnMenu.jsx';
import FormColorPicker from '../../components/form-color-picker/form-color-picker.component';


// const mapStateToProps = state => {
//     return ({ Login: state.Login })
// }
class AddSeriesColors extends React.Component {
    constructor(props) {
        super(props)

        this.formRef = React.createRef();
        this.extractedColumnList = [];

        const dataState = {
            skip: 0,
            take: 10,
        };
        this.state = {
            addScreen: false, data: this.props.ySeries, masterStatus: "", error: "", selectedRecord: {},
            dataResult: [],
            dataState: dataState,
            selectedUserRole: {}, columnName: '', rowIndex: 0, value: 'rgba(237, 126, 50, 1)'
        }
    }

    dataStateChange = (event) => {
        this.setState({
            dataResult: process(this.props.ySeries, event.data),
            dataState: event.data
        });
    }

    render() {

        return (
            <>
                <Row>
                    <Col>
                        <ListWrapper className="client-list-content">
                            <PrimaryHeader className="d-flex justify-content-between mb-3">
                                <HeaderName className="header-primary-md">

                                    <FormattedMessage id={"IDS_SELECTCHARTSERIESCOLOR"} defaultMessage="" />
                                </HeaderName>
                            </PrimaryHeader>

                            <AtTableWrap className="at-list-table">
                                <Grid
                                    sortable
                                    resizable
                                    reorderable
                                    scrollable="none"
                                    data={this.state.data}
                                    {...this.state.dataState}
                                    onDataStateChange={this.dataStateChange}>

                                    <GridColumn field="label" columnMenu={ColumnMenu} title={this.props.intl.formatMessage({ id: "IDS_COLUMNNAME" })} width="175px" />
                                    <GridColumn
                                        field={"value"}
                                        // columnMenu={ColumnMenu}
                                        width="175px"
                                        title={this.props.intl.formatMessage({ id: "IDS_COLOR" })}
                                        cell={(row) => (
                                            <td>
                                                <FormColorPicker //id={row["dataItem"]["value"]}
                                                    name="Color1"
                                                    handleChange={(e) => this.handleColorChange(e, row["dataItem"])}
                                                    initialValue={row["dataItem"].item.Color}
                                                />
                                            </td>)}
                                    />
                                </Grid>
                            </AtTableWrap>
                        </ListWrapper>
                    </Col>
                </Row>
            </>
        );
    }

    handleColorChange(e, item) {     
        //const yField = [... this.props.ySeries];
        // const current = yField.findIndex(dataItem => dataItem === e.dataItem);
        item.item.Color = e.hex;

    }
    // handleChange (e, Item){
    //     console.log("Hex : ", e.value);

    // }

}
export default injectIntl(AddSeriesColors);