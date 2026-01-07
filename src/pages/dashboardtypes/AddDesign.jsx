import React from 'react'
import { FormattedMessage, injectIntl } from 'react-intl';
import { Button, Row, Col, Nav } from 'react-bootstrap';
import FormInput from '../../components/form-input/form-input.component';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import { process } from '@progress/kendo-data-query';
import { faSave, faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Grid, GridColumn } from '@progress/kendo-react-grid';
import ColumnMenu from '../../components/data-grid/ColumnMenu.jsx';

class AddDesign extends React.Component {
    constructor(props) {
        super(props)
        const dataState = {
            skip: 0,
            take: 10,
        };
        this.state = {
            selectedRecord: {}
        }
    }
    dataStateChange = (event) => {
        this.setState({
            dataResult: process(this.props.addDesignParam, event.data),
            dataState: event.data
        });
    }
    render() {

        return (
            <>
                <Row>
                    <Col md={6}>
                        <FormInput
                            label={this.props.intl.formatMessage({ id: this.props.extractedColumnList[0].idsName} )}
                            name={this.props.extractedColumnList[0].dataField}
                            type="text"
                            onChange={(event) => this.props.onInputOnChange(event)}
                            placeholder={this.props.intl.formatMessage({ id:this.props.extractedColumnList[0].idsName })}
                            value={this.props.selectedRecord ? this.props.selectedRecord[this.props.extractedColumnList[0].dataField] : ""}
                            isMandatory={true}
                            required={true}
                            maxLength={"50"}
                        />
                    </Col>
                    <Col md={6}>
                        <FormSelectSearch
                            formLabel={this.props.intl.formatMessage({ id: this.props.extractedColumnList[1].idsName })}
                            isSearchable={true}
                            name={this.props.extractedColumnList[1].dataField}
                            isDisabled={false}
                            placeholder="Please Select..."
                            isMandatory={true}
                            isClearable={true}
                            options={this.props.designComponents}
                            optionId='ndesigncomponentcode'
                            optionValue='sdesigncomponentname'
                            defaultValue={this.props.selectedRecord["ndesigncomponentcode"] || []}
                            onChange={value => this.props.handleChange(value, this.props.extractedColumnList[1].dataField)}
                            closeMenuOnSelect={true}
                            alphabeticalSort={true}
                        />
                    </Col>
                    <Col md={6}>
                        <FormSelectSearch
                            formLabel={this.props.intl.formatMessage({ id: this.props.extractedColumnList[2].idsName })}
                            isSearchable={true}
                            name={this.props.extractedColumnList[2].dataField}
                            isDisabled={false}
                            placeholder="Please Select..."
                            isMandatory={true}
                            isClearable={true}
                            options={this.props.sqlQueryForParams}
                            optionId='sqlQueryParams'
                            optionValue='sqlQueryParams'
                            defaultValue={this.props.selectedRecord["sfieldname"] || []}
                            onChange={value => this.props.handleChange(value, this.props.extractedColumnList[2].dataField)}
                            closeMenuOnSelect={true}
                            alphabeticalSort={true}
                        />
                    </Col>
                    <Col md={6}>
                        <FormSelectSearch
                            formLabel={this.props.intl.formatMessage({ id: this.props.extractedColumnList[3].idsName })}
                            isSearchable={true}
                            name={this.props.extractedColumnList[3].dataField}
                            isDisabled={false}
                            placeholder="Please Select..."
                            isMandatory={true}
                            isClearable={true}
                            options={this.props.sqlQueryForExistingLinkTable}
                            optionId='nsqlquerycode'
                            optionValue='ssqlqueryname'
                            defaultValue={this.props.selectedRecord["nsqlquerycode"] || []}
                            onChange={value => this.props.handleChange(value, this.props.extractedColumnList[3].dataField)}
                            closeMenuOnSelect={true}
                            alphabeticalSort={true}
                        />
                    </Col>
                    <Col md={6}>
                        <FormInput
                            label={this.props.intl.formatMessage({ id: this.props.extractedColumnList[4].idsName })}
                            name={this.props.extractedColumnList[4].dataField}
                            type="text"
                            onChange={(event) => this.props.onInputOnChange(event)}
                            placeholder={this.props.intl.formatMessage({ id: this.props.extractedColumnList[4].idsName })}
                            value={this.props.selectedRecord ? this.props.selectedRecord[this.props.extractedColumnList[4].dataField] : ""}
                            isMandatory={true}
                            required={true}
                            maxLength={"50"}
                        />
                    </Col>
                    <Col md={6}>
                        <FormInput
                            label={this.props.intl.formatMessage({ id: this.props.extractedColumnList[5].idsName })}
                            name={this.props.extractedColumnList[5].dataField}
                            type="text"
                            onChange={(event) => this.props.onInputOnChange(event)}
                            placeholder={this.props.intl.formatMessage({ id: this.props.extractedColumnList[5].idsName })}
                            value={this.props.selectedRecord ? this.props.selectedRecord[this.props.extractedColumnList[5].dataField] : ""}
                            isMandatory={true}
                            required={true}
                            maxLength={"50"}
                        />
                    </Col>
                    <Col className="d-flex justify-content-end" md={12}>
                        <Button className="btn-user btn-primary-blue"
                            onClick={() => this.props.addParametersInDataGrid(this.props.selectedRecord)}
                        >
                            <FontAwesomeIcon icon={faSave} /> { }
                            <FormattedMessage id='IDS_ADD' defaultMessage='Add' />
                        </Button>
                    </Col>
                </Row>
                <Row>
                    <Row className="no-gutters">
                        <Col md={12}>
                            <Grid
                                sortable
                                resizable
                                reorderable
                                scrollable="none"
                                data={this.props.addDesignParam}
                                {...this.state.dataState}
                                onDataStateChange={this.dataStateChange}>
                                <GridColumn field={this.props.gridColumnList[0].dataField} columnMenu={ColumnMenu} title={this.props.intl.formatMessage({ id: this.props.gridColumnList[0].idsName })} width="175px" />
                                <GridColumn field={this.props.gridColumnList[1].dataField} columnMenu={ColumnMenu} title={this.props.intl.formatMessage({ id: this.props.gridColumnList[1].idsName })} width="175px" />
                                <GridColumn field={this.props.gridColumnList[2].dataField} columnMenu={ColumnMenu} title={this.props.intl.formatMessage({ id: this.props.gridColumnList[2].idsName })} width="175px" />
                                <GridColumn                                                                           
                                        width="175px"
                                        title={this.props.intl.formatMessage({ id: "IDS_ACTION" })}
                                        cell={(row) => (
                                            <td>                                              
                                                <Nav.Link className="action-icons-wrap" >
                                                <FontAwesomeIcon icon={faTrashAlt}
                                                    title={this.props.intl.formatMessage({ id: "IDS_ACTION" })}                                                   
                                                    onClick={(e) => this.props.removeParametersInDataGrid( row["dataItem"])} 
                                                 />
                                                </Nav.Link>

                                            </td>)}
                                    />
                            </Grid>
                        </Col>
                    </Row>
                </Row>
            </>
        );        
    }

  
}
export default injectIntl(AddDesign);
